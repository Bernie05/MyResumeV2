"use client";

import React, { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import {
  ArticleOutlined,
  ChevronLeft,
  ChevronRight,
  ContactMailOutlined,
  Inventory2Outlined,
  MenuOutlined,
  MenuBookOutlined,
  PersonOutline,
  ShoppingCartOutlined,
  WorkOutline,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";

const MENU_ITEMS = [
  { icon: MenuOutlined, label: "Menu", href: "#menu" },
  { icon: ShoppingCartOutlined, label: "Shop", href: "#shop" },
  { icon: PersonOutline, label: "Profile", href: "#profile" },
  { icon: ArticleOutlined, label: "Resume", href: "#resume" },
  { icon: WorkOutline, label: "Works", href: "#works" },
  { icon: MenuBookOutlined, label: "Blog", href: "#blog" },
  { icon: ContactMailOutlined, label: "Contact", href: "#contact" },
  { icon: Inventory2Outlined, label: "Products", href: "#products" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useThemeContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        py: 4,
        px: 2,
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        width: isCollapsed ? 80 : 112,
        transition: "width 0.3s ease",
        backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
        borderRight: "1px solid",
        borderColor: isDarkMode ? "#334155" : "#e5e7eb",
      }}
    >
      <Stack spacing={3}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip
              key={item.label}
              title={isCollapsed ? item.label : ""}
              placement="right"
            >
              <Box
                component="a"
                href={item.href}
                sx={{
                  textDecoration: "none",
                  color: isDarkMode ? "#94a3b8" : "#475569",
                  p: 1.5,
                  borderRadius: 2,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                  "&:hover": {
                    color: isDarkMode ? "#60a5fa" : "#2563eb",
                    backgroundColor: isDarkMode
                      ? "rgba(59, 130, 246, 0.12)"
                      : "rgba(219, 234, 254, 1)",
                  },
                }}
              >
                <Icon fontSize="small" />
                {!isCollapsed && (
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Stack>

      <IconButton
        onClick={() => setIsCollapsed(!isCollapsed)}
        title="Toggle sidebar"
        sx={{
          borderRadius: 2,
          color: isDarkMode ? "#94a3b8" : "#475569",
          "&:hover": {
            color: isDarkMode ? "#60a5fa" : "#2563eb",
            backgroundColor: isDarkMode
              ? "rgba(30, 41, 59, 1)"
              : "rgba(241, 245, 249, 1)",
          },
        }}
      >
        {isCollapsed ? (
          <ChevronRight fontSize="small" />
        ) : (
          <ChevronLeft fontSize="small" />
        )}
      </IconButton>
    </Box>
  );
};

export default Sidebar;
