import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Skeleton,
  Stack,
} from "@mui/material";

interface SecretEditorSkeletonProps {
  isDarkMode?: boolean;
}

export const SecretLoginSkeleton = () => {
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
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(103, 232, 249, 0.14)",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: 150,
                    fontSize: "0.9rem",
                    bgcolor: "rgba(148, 163, 184, 0.18)",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "82%",
                    fontSize: "2.2rem",
                    bgcolor: "rgba(248, 250, 252, 0.2)",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "100%",
                    fontSize: "1rem",
                    bgcolor: "rgba(148, 163, 184, 0.16)",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "88%",
                    fontSize: "1rem",
                    bgcolor: "rgba(148, 163, 184, 0.16)",
                  }}
                />
              </Stack>

              <Stack spacing={2.5}>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{
                    width: "100%",
                    height: 56,
                    borderRadius: 2.5,
                    bgcolor: "rgba(148, 163, 184, 0.12)",
                  }}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{
                    width: "100%",
                    height: 52,
                    borderRadius: 2.5,
                    bgcolor: "rgba(45, 212, 191, 0.18)",
                  }}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export const SecretEditorSkeleton = ({
  isDarkMode = true,
}: SecretEditorSkeletonProps) => {
  const borderColor = isDarkMode
    ? "rgba(51, 65, 85, 0.8)"
    : "rgba(203, 213, 225, 0.9)";
  const surfaceColor = isDarkMode
    ? "rgba(15, 23, 42, 0.94)"
    : "rgba(255, 255, 255, 0.94)";
  const backdropColor = isDarkMode
    ? "rgba(2, 6, 23, 0.88)"
    : "rgba(248, 250, 252, 0.92)";
  const background = isDarkMode
    ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
    : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)";
  const mutedBg = isDarkMode
    ? "rgba(148, 163, 184, 0.14)"
    : "rgba(100, 116, 139, 0.12)";
  const accentBg = isDarkMode
    ? "rgba(103, 232, 249, 0.16)"
    : "rgba(15, 118, 110, 0.14)";

  return (
    <Box sx={{ minHeight: "100vh", background }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid",
          borderColor,
          backgroundColor: backdropColor,
        }}
      >
        <Stack spacing={2} sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <Stack
            direction={{ xs: "column", xl: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: 148, fontSize: "0.9rem", bgcolor: accentBg }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: 220, fontSize: "2.1rem", bgcolor: mutedBg }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "100%",
                  maxWidth: 580,
                  fontSize: "1rem",
                  bgcolor: mutedBg,
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "85%",
                  maxWidth: 520,
                  fontSize: "1rem",
                  bgcolor: mutedBg,
                }}
              />
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              alignItems={{ sm: "center" }}
              sx={{ flexWrap: "wrap" }}
            >
              <Chip
                label={<Skeleton width={110} animation="wave" />}
                variant="outlined"
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: 124,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: accentBg,
                }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: 146,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: mutedBg,
                }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: 156,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: mutedBg,
                }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: 92,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: mutedBg,
                }}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ overflowX: "hidden" }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                animation="wave"
                sx={{
                  width: 112,
                  height: 40,
                  borderRadius: 10,
                  flexShrink: 0,
                  bgcolor: mutedBg,
                }}
              />
            ))}
          </Stack>

          <Divider />
        </Stack>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
            <Card
              sx={{
                flex: 1.2,
                borderRadius: 4,
                border: "1px solid",
                borderColor,
                backgroundColor: surfaceColor,
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={2}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{ width: 180, fontSize: "1.4rem", bgcolor: mutedBg }}
                  />
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Stack key={index} spacing={1}>
                      <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                          width: 132,
                          fontSize: "0.95rem",
                          bgcolor: mutedBg,
                        }}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        sx={{
                          width: "100%",
                          height: index === 2 ? 120 : 56,
                          borderRadius: 2.5,
                          bgcolor: mutedBg,
                        }}
                      />
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                flex: 1,
                borderRadius: 4,
                border: "1px solid",
                borderColor,
                backgroundColor: surfaceColor,
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={2.5}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{ width: 160, fontSize: "1.4rem", bgcolor: accentBg }}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                      width: "100%",
                      height: 280,
                      borderRadius: 3,
                      bgcolor: mutedBg,
                    }}
                  />
                  <Stack spacing={1.25}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="text"
                        animation="wave"
                        sx={{
                          width: `${92 - index * 8}%`,
                          fontSize: "1rem",
                          bgcolor: mutedBg,
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
