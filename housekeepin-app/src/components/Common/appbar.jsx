import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeSwitcher from '../Theme/themeSwitcher';

const CustomAppbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setDrawerOpen(false);
  };

  const drawerList = (
    <Box 
      sx={{ width: 250 }} 
      role="presentation" 
      onClick={() => setDrawerOpen(false)} 
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        <ListItem button onClick={() => handleNavigation('/tasks')}>
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/calendar')}>
          <ListItemText primary="Calendar" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/budget')}>
          <ListItemText primary="Budget" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/account')}>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/invite')}>
          <ListItemText primary="Invite" />
        </ListItem>
        <ListItem>
          <ThemeSwitcher />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/housekeepin.svg"
              alt="Housekeepin Logo"
              sx={{ 
                maxWidth: '356px',
                width: '100%',
                height: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation('/')}
            />
          </Box>
          {/* Navigation: either inline for larger screens or a hamburger icon for mobile */}
          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button color="inherit" onClick={() => handleNavigation('/tasks')}>
                Tasks
              </Button>
              <Button color="inherit" onClick={() => handleNavigation('/calendar')}>
                Calendar
              </Button>
              <Button color="inherit" onClick={() => handleNavigation('/budget')}>
                Budget
              </Button>
              <IconButton color="inherit" onClick={() => handleNavigation('/account')}>
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit" onClick={() => handleNavigation('/invite')}>
                <GroupAddIcon />
              </IconButton>
              <ThemeSwitcher />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerList}
      </Drawer>
    </>
  );
};

export default CustomAppbar;
