import { Box, Container, Divider, Skeleton, Stack } from "@mui/material";

const ResumeSkeleton = () => {
  return (
    <Box component="main" sx={{ width: "100%", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderBottom: "1px solid rgba(226, 232, 240, 1)",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ minHeight: 64 }}
          >
            <Skeleton variant="text" width={140} height={28} />
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={78}
                  height={32}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Skeleton variant="circular" width={38} height={38} />
              <Skeleton variant="circular" width={38} height={38} />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        sx={{
          minHeight: { xs: "100vh", md: 640 },
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 0.94) 50%, rgba(30, 64, 175, 0.7) 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Skeleton variant="circular" width={192} height={192} />
            <Stack spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
              <Skeleton variant="text" width="65%" height={72} />
              <Skeleton variant="text" width="32%" height={28} />
              <Skeleton variant="text" width="82%" height={26} />
              <Skeleton variant="text" width="68%" height={26} />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Skeleton variant="rounded" width={150} height={48} />
              <Skeleton variant="rounded" width={170} height={48} />
            </Stack>
            <Stack
              direction="row"
              spacing={{ xs: 2, md: 4 }}
              sx={{ pt: 2, flexWrap: "wrap", justifyContent: "center" }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Stack
                  key={index}
                  spacing={1}
                  alignItems="center"
                  sx={{ minWidth: 120 }}
                >
                  <Skeleton variant="text" width={64} height={36} />
                  <Skeleton variant="text" width={90} height={20} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        <Stack spacing={{ xs: 10, md: 14 }}>
          {Array.from({ length: 5 }).map((_, sectionIndex) => (
            <Stack key={sectionIndex} spacing={3}>
              <Stack
                spacing={1}
                alignItems={sectionIndex % 2 === 0 ? "flex-start" : "center"}
              >
                <Skeleton variant="text" width={160} height={22} />
                <Skeleton variant="text" width={260} height={44} />
              </Stack>
              <Stack
                direction={{
                  xs: "column",
                  md: sectionIndex === 0 ? "row" : "column",
                }}
                spacing={3}
              >
                {Array.from({ length: sectionIndex === 0 ? 3 : 2 }).map(
                  (__, cardIndex) => (
                    <Box
                      key={cardIndex}
                      sx={{
                        flex: 1,
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 4,
                        border: "1px solid rgba(226, 232, 240, 1)",
                        backgroundColor: "rgba(255, 255, 255, 0.82)",
                      }}
                    >
                      <Stack spacing={1.25}>
                        <Skeleton variant="text" width="42%" height={28} />
                        <Skeleton variant="text" width="28%" height={20} />
                        <Divider />
                        {Array.from({ length: 4 }).map((___, lineIndex) => (
                          <Skeleton
                            key={lineIndex}
                            variant="text"
                            width={`${92 - lineIndex * 10}%`}
                            height={22}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ),
                )}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default ResumeSkeleton;
