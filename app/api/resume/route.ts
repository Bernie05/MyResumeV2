import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const jsonPath = join(process.cwd(), "public", "resume.json");
    const jsonData = readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(jsonData);

    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load resume data" },
      { status: 500 },
    );
  }
}
