import SecretLoginForm from "@/components/secret/SecretLoginForm";

type SearchParamValue = string | string[] | undefined;

const getFirstSearchParam = (value: SearchParamValue) =>
  Array.isArray(value) ? value[0] : value;

const getInternalCallbackUrl = (value: SearchParamValue) => {
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
};

const SecretLoginPage = ({
  searchParams,
}: {
  searchParams?: { callbackUrl?: SearchParamValue; next?: SearchParamValue };
}) => {
  const callbackUrl =
    getInternalCallbackUrl(searchParams?.callbackUrl) ||
    getInternalCallbackUrl(searchParams?.next) ||
    "/secret";

  return <SecretLoginForm callbackUrl={callbackUrl} />;
};

export default SecretLoginPage;
