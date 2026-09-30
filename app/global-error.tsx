"use client";

const GlobalError = ({ reset }: { error: Error; reset: () => void }) => (
  <html lang="en">
    <body
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
      <h1>Something went wrong</h1>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </body>
  </html>
);

export default GlobalError;
