"use client";

import React, { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

interface NavbarProps {
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
}

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ position = "sticky" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <AppBar
      position={position}
      elevation={0}
      sx={{
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(18px)",
        backgroundColor: isDarkMode
          ? "rgba(2, 6, 23, 0.92)"
          : "rgba(255, 255, 255, 0.9)",
        borderBottom: "1px solid",
        borderColor: isDarkMode
          ? "rgba(51, 65, 85, 0.9)"
          : "rgba(226, 232, 240, 1)",
        color: isDarkMode ? "#ffffff" : "#0f172a",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ minHeight: 64, justifyContent: "space-between", gap: 2 }}
        >
          <Typography
            component="a"
            href="#"
            sx={{
              textDecoration: "none",
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "inherit",
            }}
          >
            CREATIVE CV
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                color="inherit"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                  color: isDarkMode ? "#e2e8f0" : "#0f172a",
                  "&:hover": {
                    color: isDarkMode ? "rgb(45, 212, 191)" : "#0f766e",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <IconButton
              onClick={toggleTheme}
              aria-label="Toggle theme"
              sx={{
                borderRadius: 2,
                backgroundColor: isDarkMode
                  ? "rgba(15, 23, 42, 0.95)"
                  : "rgba(241, 245, 249, 1)",
                color: isDarkMode ? "rgb(45, 212, 191)" : "rgb(37, 99, 235)",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(30, 41, 59, 1)"
                    : "rgba(226, 232, 240, 1)",
                },
              }}
            >
              {isDarkMode ? (
                <LightModeIcon fontSize="small" />
              ) : (
                <DarkModeIcon fontSize="small" />
              )}
            </IconButton>

            <IconButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              sx={{
                display: { md: "none" },
                borderRadius: 2,
                color: isDarkMode ? "#ffffff" : "#0f172a",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(30, 41, 59, 1)"
                    : "rgba(241, 245, 249, 1)",
                },
              }}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
        </Toolbar>

        <Collapse in={isMobileMenuOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: { md: "none" },
              pb: 2,
            }}
          >
            <Stack spacing={1}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  color="inherit"
                  sx={{
                    justifyContent: "flex-start",
                    px: 2,
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    fontSize: "0.78rem",
                    color: isDarkMode ? "#e2e8f0" : "#0f172a",
                    "&:hover": {
                      color: isDarkMode ? "rgb(45, 212, 191)" : "#0f766e",
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 42, 1)"
                        : "rgba(248, 250, 252, 1)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  );
}
