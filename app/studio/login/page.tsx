import StudioLoginForm from "@/components/studio/StudioLoginForm";

export default function StudioLoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  return <StudioLoginForm nextPath={searchParams?.next} />;
}
