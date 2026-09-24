import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import type { ResumeData } from "@/types/resume";

const FILE_PATH = "data/resume.json";

/**
 * Publishes the resume by committing data/resume.json to GitHub.
 * The commit triggers a Vercel redeploy, which rebuilds the public resume (/) with the new data.
 */
export async function PUT(request: Request) {
  // Only the logged-in owner can publish
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check that GitHub configuration is present
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = "main" } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return NextResponse.json(
      { error: "GitHub storage is not configured" },
      { status: 500 },
    );
  }

  // Parse the request body as JSON and validate it against the ResumeData interface
  let data: ResumeData;
  try {
    data = (await request.json()) as ResumeData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!data || typeof data !== "object" || !data.personalInfo) {
    return NextResponse.json(
      { error: "Body is not a valid resume" },
      { status: 400 },
    );
  }

  // Commit the resume data to GitHub
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // GitHub needs the current file's SHA to update it (absent on first publish)
  const current = await fetch(`${url}?ref=${GITHUB_BRANCH}`, {
    headers,
    cache: "no-store",
  });

  // If the file doesn't exist yet, GitHub returns 404. If it exists, we need to get its SHA for the update.
  if (!current.ok && current.status !== 404) {
    return NextResponse.json(
      { error: `GitHub read failed: ${await current.text()}` },
      { status: 502 },
    );
  }

  // If the file exists, get its SHA; if it doesn't exist, SHA is undefined (first commit)
  const sha: string | undefined = current.ok
    ? (await current.json()).sha
    : undefined;

  // Commit the new resume data to GitHub
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "content: update resume via editor",
      content: Buffer.from(JSON.stringify(data, null, 2) + "\n").toString(
        "base64",
      ),
      branch: GITHUB_BRANCH,
      sha,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub write failed: ${await res.text()}` },
      { status: 502 },
    );
  }

  const result = await res.json();
  return NextResponse.json({ ok: true, commitUrl: result.commit?.html_url });
}
