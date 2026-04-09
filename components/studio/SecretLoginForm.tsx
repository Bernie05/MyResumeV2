"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SecretLoginFormProps {
  callbackUrl?: string;
}

function getLoginErrorMessage(error: string | undefined) {
  if (!error) {
    return "Unable to sign in to the private editor.";
  }

  if (error === "CredentialsSignin") {
    return "Incorrect password. Try again.";
  }

  return "Unable to sign in to the private editor.";
}

export default function SecretLoginForm({ callbackUrl }: SecretLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Fallback to root if callbackUrl is not provided, since the secret editor is at the root of the secret subdomain
    console.log("Callback URL:", callbackUrl);
    const nextUrl = callbackUrl || "/secret/login";

    try {
      const result = await signIn("credentials", {
        password,
        callbackUrl: nextUrl,
        redirect: false,
      });

      if (!result) {
        setError("Unable to sign in to the private editor.");
        return;
      }

      if (result.error) {
        setError(getLoginErrorMessage(result.error));
        return;
      }

      setPassword("");
      router.replace(result.url || nextUrl);
      router.refresh();
    } catch {
      setError("Unable to sign in to the private editor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, rgba(14, 165, 233, 0.2), transparent 35%), #020617",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid rgba(148, 163, 184, 0.22)",
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            boxShadow: "0 30px 80px rgba(15, 23, 42, 0.55)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3}>
              <Stack spacing={1.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(56, 189, 248, 0.28))",
                    color: "#67e8f9",
                  }}
                >
                  <LockOutlinedIcon />
                </Box>
                <Typography variant="overline" sx={{ color: "#67e8f9" }}>
                  Owner-only access
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#f8fafc" }}
                >
                  Sign in to open the private resume editor
                </Typography>
                <Typography sx={{ color: "#94a3b8" }}>
                  Phase 1 saves your draft locally in this browser and keeps the
                  public resume sourced from the static data file.
                </Typography>
              </Stack>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Owner password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    fullWidth
                    autoFocus
                    autoComplete="current-password"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ py: 1.5, fontWeight: 700, textTransform: "none" }}
                  >
                    {isSubmitting ? "Signing in..." : "Open private editor"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
