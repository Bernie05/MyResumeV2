"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  clearAuthState,
  signInFailed,
  signInStarted,
  signInSucceeded,
} from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
import { signInUp } from "@/auth";

interface SecretLoginFormProps {
  callbackUrl?: string;
}

const getLoginErrorMessage = (error: string | undefined) => {
  if (!error) {
    return "Unable to sign in to the private editor.";
  }

  if (error === "CredentialsSignin") {
    return "Incorrect password. Try again.";
  }

  return "Unable to sign in to the private editor.";
};

const SecretLoginForm = ({ callbackUrl }: SecretLoginFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const { error, status } = useAppSelector((state) => state.auth);
  const isSubmitting = status === "submitting";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearAuthState());
    dispatch(signInStarted());

    const nextUrl = callbackUrl || "/secret";

    try {
      const result = await signInUp({
        password,
        callbackUrl: nextUrl,
        redirect: false,
      });

      if (!result) {
        dispatch(signInFailed("Unable to sign in to the private editor."));
        return;
      }

      if (result.error) {
        dispatch(signInFailed(getLoginErrorMessage(result.error)));
        return;
      }

      dispatch(signInSucceeded());
      setPassword("");

      // Use replace to avoid keeping the login page in the history stack
      router.replace(result.url || nextUrl);
      router.refresh();
    } catch {
      dispatch(signInFailed("Unable to sign in to the private editor."));
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
};

export default SecretLoginForm;
