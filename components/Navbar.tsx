"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { useSession } from "next-auth/react";
import { IThemePalette } from "@/theme/sectionPalette";
import { NavbarPosition } from "./resume/ResumePage";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export interface INavbarProps extends IThemePalette {
  isAuthenticated: boolean;
  position: NavbarPosition;
}

const Navbar = ({
  isAuthenticated,
  isDarkMode,
  theme,
  position,
}: INavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTheme } = useThemeContext();

  const {
    navbarBackgroundColor,
    navbarBorderColor,
    titleColor,
    primaryAccent,
    navbarTextHoverBackground,
    secondaryAccent,
    navbarIconButtonBackgroundColor,
    navbarIconButtonHoverBackground,
  } = theme;

  return (
    <AppBar
      position={position}
      elevation={0}
      sx={{
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(18px)",
        backgroundColor: navbarBackgroundColor,
        borderBottom: "1px solid",
        borderColor: navbarBorderColor,
        color: titleColor,
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
            My Resume
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
                  color: titleColor,
                  "&:hover": {
                    color: secondaryAccent,
                    backgroundColor: "transparent",
                  },
                  "&:active": {
                    color: secondaryAccent,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {isAuthenticated ? (
              <Button
                component={Link}
                href="/secret"
                color="inherit"
                sx={{
                  borderRadius: 2,
                  backgroundColor: navbarIconButtonBackgroundColor,
                  color: titleColor,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontSize: "0.72rem",
                  px: 1.5,
                  minWidth: "auto",
                  "&:hover": {
                    color: secondaryAccent,
                    backgroundColor: navbarIconButtonHoverBackground,
                  },
                }}
              >
                Editor
              </Button>
            ) : null}

            <IconButton
              onClick={toggleTheme}
              aria-label="Toggle theme"
              sx={{
                borderRadius: 2,
                backgroundColor: navbarIconButtonBackgroundColor,
                color: secondaryAccent,
                "&:hover": {
                  backgroundColor: navbarIconButtonHoverBackground,
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
                color: secondaryAccent,
                "&:hover": {
                  backgroundColor: navbarIconButtonHoverBackground,
                },
              }}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
        </Toolbar>

        {/*  */}
        {/* Burger menu for mobile */}
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
                    color: titleColor,
                    "&:hover": {
                      color: navbarTextHoverBackground,
                    },
                    "&:active": {
                      color: primaryAccent,
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
};

export default Navbar;
