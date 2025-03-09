// Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { supabase } from '../supabaseClient';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import { AppBar, Toolbar, Typography, Button, Container, Box, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [householdId, setHouseholdId] = useState(null);
  const [tab, setTab] = useState(0);

  // Wait for auth state to be determined before redirecting.
  useEffect(() => {
    // user is undefined means loading.
    if (user === undefined) return;

    if (!user) {
      navigate('/login');
    } else {
      // Fetch the household associated with the logged-in user.
      const fetchHousehold = async () => {
        const { data, error } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', user.id)
          .single();
        if (error) {
          console.error('Error fetching household:', error);
        } else {
          setHouseholdId(data.household_id);
        }
      };
      fetchHousehold();
    }
  }, [user, navigate]);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* AppBar for Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Household Dashboard
          </Typography>
          <Button color="inherit" onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Tasks" />
          <Tab label="Calendar" />
          <Tab label="Budget" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              Your Tasks
            </Typography>
            <AddTaskForm 
              householdId={householdId} 
              onTaskAdded={(newTask) => console.log("Task added:", newTask)} 
            />
            <TaskList householdId={householdId} />
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">
              Calendar (Coming Soon)
            </Typography>
          </Box>
        )}
        {tab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">
              Budget (Coming Soon)
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
