import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "@/theme/sectionPalette";
import { Button, Stack } from "@mui/material";

interface INavbarBtnProps {
  id: string;
  navbarBtns: {
    label: string;
    href: string;
  }[];
  cssProps: Record<any, any>;
  handler?: {
    onClick?: () => void;
  };
}

export const NavbarBtn = ({
  id,
  navbarBtns,
  handler,
  cssProps,
}: INavbarBtnProps) => {
  const { onClick } = handler || {};

  return (
    <>
      {navbarBtns.map(({ label, href }) => (
        <Button
          id={`${id}-${label.toLowerCase()}-btn`}
          key={`${id}-${label.toLowerCase()}-btn`}
          href={href}
          color="inherit"
          sx={{
            ...cssProps.buttonCss,
          }}
          onClick={onClick}
        >
          {label}
        </Button>
      ))}
    </>
  );
};
