import { Button } from "@mui/material";

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

// NavbarBtn is a React component that renders a set of navigation buttons based on the provided props.
// Each button is created using the MUI Button component and is styled according to the provided CSS properties.
// The component also supports an optional click handler for each button, allowing for custom behavior when a button is clicked.
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
