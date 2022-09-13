import { mode } from "@chakra-ui/theme-tools";

export const globalStyles = {
  colors: {
    teal: {
      300: "#B6142C",
    },
    gray: {
      700: "#1f2733",
    },
    primaryColor: {
      700: "#B6142C",
    },
    primaryColorHover: {
      700: "#000",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode("gray.50", "gray.800")(props),
        fontFamily: "Helvetica, sans-serif",
      },
      html: {
        fontFamily: "Helvetica, sans-serif",
      },
    }),
  },
};
