"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface StudioLoginFormProps {
  nextPath?: string;
}

export default function StudioLoginForm({ nextPath }: StudioLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/studio/session", {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          authenticated?: boolean;
          configured?: boolean;
        };

        if (!isMounted) {
          return;
        }

        if (data.authenticated) {
          router.replace("/studio");
          return;
        }

        if (data.configured === false) {
          setError("RESUME_OWNER_PASSWORD is not configured.");
        }
      } catch {
        if (isMounted) {
          setError("Unable to verify the current studio session.");
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setError(data?.error ?? "Unable to sign in to the studio.");
        return;
      }

      router.replace(nextPath || "/studio");
      router.refresh();
    } catch {
      setError("Unable to sign in to the studio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(circle at top, rgba(14, 165, 233, 0.2), transparent 35%), #020617",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

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
                  Hidden Owner Studio
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#f8fafc" }}
                >
                  Sign in to edit the resume draft
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
                    {isSubmitting ? "Signing in..." : "Enter studio"}
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
