import Link from "next/link";

const NotFound = () => (
  <main
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      fontFamily: "system-ui, sans-serif",
    }}
  >
    <h1>Page not found</h1>
    <Link href="/">Back to home</Link>
  </main>
);

export default NotFound;
