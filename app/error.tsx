"use client";

const wrap = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  fontFamily: "system-ui, sans-serif",
  textAlign: "center",
  padding: 24,
} as const;

const ErrorPage = ({ reset }: { error: Error; reset: () => void }) => (
  <main style={wrap}>
    <h1>Something went wrong</h1>
    <button type="button" onClick={reset}>
      Try again
    </button>
  </main>
);

export default ErrorPage;
