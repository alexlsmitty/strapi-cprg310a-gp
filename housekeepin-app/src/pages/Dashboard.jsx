import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActionArea, Grid2, Avatar } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Dashboard = () => {
  const navigate = useNavigate();

  // Widget definitions with title, description, route, and icon
  const widgets = [
    {
      title: 'Tasks',
      description: 'View and manage your tasks',
      route: '/tasks',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Calendar',
      description: 'Check your schedule and events',
      route: '/calendar',
      icon: <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Budget',
      description: 'Track your finances and expenses',
      route: '/budget',
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
  ];

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Grid2 container spacing={4} justifyContent="center">
        {widgets.map((widget, index) => (
          <Grid2 item key={index} xs={12} sm={6} md={4}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <CardActionArea onClick={() => navigate(widget.route)}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.light',
                      width: 64,
                      height: 64,
                      mb: 2,
                    }}
                  >
                    {widget.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {widget.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {widget.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Dashboard;
