import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button, Menu, MenuItem } from "@mui/material";
import { Brightness4, Brightness7, ColorLens } from "@mui/icons-material";
 
function ThemeSwitcher() {
  const { themeName, setThemeName } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
 
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
 
  return (
<div style={{ position: "absolute", top: 10, right: 10 }}>
<Button 
        variant="contained" 
        startIcon={<ColorLens />} 
        onClick={handleClick}
>
        Theme
</Button>
<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
<MenuItem onClick={() => setThemeName("light")}>
<Brightness7 /> Light Mode
</MenuItem>
<MenuItem onClick={() => setThemeName("dark")}>
<Brightness4 /> Dark Mode
</MenuItem>
<MenuItem onClick={() => setThemeName("blue")}>
<ColorLens /> Blue Theme
</MenuItem>
</Menu>
</div>
  );
}
 
export default ThemeSwitcher;