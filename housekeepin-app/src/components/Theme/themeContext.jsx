import React, { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
 
// Define themes
const themes = {
  light: {
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      background: { default: "#f5f5f5", paper: "#fff" },
    },
  },
  dark: {
    palette: {
      mode: "dark",
      primary: { main: "#90caf9" },
      background: { default: "#121212", paper: "#1e1e1e" },
    },
  },
  blue: {
    palette: {
      mode: "light",
      primary: { main: "#2196F3" },
      background: { default: "#E3F2FD", paper: "#BBDEFB" },
    },
  },
};
 
export const ThemeContext = createContext();
 
export function ThemeProviderComponent({ children }) {
  const [themeName, setThemeName] = useState("light");
 
  const theme = useMemo(() => createTheme(themes[themeName]), [themeName]);
 
  return (
<ThemeContext.Provider value={{ themeName, setThemeName }}>
<ThemeProvider theme={theme}>
<CssBaseline />
        {children}
</ThemeProvider>
</ThemeContext.Provider>
  );
}