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
import { getSectionPalette, IThemePalette } from "@/theme/sectionPalette";
import { NavbarPosition } from "./ResumePage";
import {
  editorBtn,
  NAV_ITEMS,
  navbarId,
  secretEditor,
  websiteTitle,
} from "./constants/constant";
import { NavbarBtn } from "./components/buttons/NavbarBtn";

export interface INavbarProps {
  isAuthenticated: boolean;
  position: NavbarPosition;
}

const Navbar = ({ isAuthenticated, position }: INavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTheme } = useThemeContext();
  const { isDarkMode } = useThemeContext();
  const theme = getSectionPalette(isDarkMode);

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
    // Navbar
    <AppBar
      id={`${navbarId}-main-container`}
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
      {/* Navbar container */}
      <Container maxWidth="xl" id={`${navbarId}-sub-container`}>
        {/* My Resume Typography */}
        <Toolbar
          id={`${navbarId}-my-resume`}
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
            {websiteTitle}
          </Typography>

          {/* Navbar buttons */}
          <Stack
            id={`${navbarId}-buttons-row`}
            direction="row"
            spacing={1}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <NavbarBtn
              id={navbarId}
              navbarBtns={NAV_ITEMS}
              cssProps={{
                buttonCss: {
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
                },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {/* Editor button */}
            {isAuthenticated && (
              <Button
                id="secret-editor-btn"
                component={Link}
                href={secretEditor}
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
                {editorBtn}
              </Button>
            )}

            {/* Dark and Light Theme */}
            <IconButton
              id="theme-btn"
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

            {/* Burger Menu */}
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

        {/* Burger menu for mobile */}
        <Collapse in={isMobileMenuOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: { md: "none" },
              pb: 2,
            }}
          >
            {/* Buttons Links */}
            <Stack id={`${navbarId}-buttons-column`} spacing={1}>
              {
                <NavbarBtn
                  id={navbarId}
                  navbarBtns={NAV_ITEMS}
                  handler={{
                    onClick: () => setIsMobileMenuOpen(false),
                  }}
                  cssProps={{
                    buttonCss: {
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
                    },
                  }}
                />
              }
            </Stack>
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  );
};

export default Navbar;
