import SecretLoginForm from "@/components/studio/SecretLoginForm";

type SearchParamValue = string | string[] | undefined;

function getFirstSearchParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function getInternalCallbackUrl(value: SearchParamValue) {
  const rawValue = getFirstSearchParam(value)?.trim();

  if (!rawValue || !rawValue.startsWith("/") || rawValue.startsWith("//")) {
    return undefined;
  }

  try {
    const url = new URL(rawValue, "https://resume-secret.local");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
}

export default function SecretLoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: SearchParamValue; next?: SearchParamValue };
}) {
  console.log("Search params:", searchParams);
  const callbackUrl =
    getInternalCallbackUrl(searchParams?.callbackUrl) ||
    getInternalCallbackUrl(searchParams?.next) ||
    "/";

  return <SecretLoginForm callbackUrl={callbackUrl} />;
}
