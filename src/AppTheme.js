//import React from "react";
import { createMuiTheme } from "@material-ui/core";

const AppTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#5C78FF",
      light: "#b0beff",
      dark: "#222753",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4ADAB3",
      contrastText: "#ffffff",
    },
  },
  overrides: {
    MuiInputBase: {
      root: {
        "&.Mui-disabled": {
          backgroundColor: "#FFFFFF !important",
        },
      },
    },
  },
});

export default AppTheme;
