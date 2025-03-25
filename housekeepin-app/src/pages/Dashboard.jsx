import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActionArea, Grid, Avatar } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State to hold household id and dynamic details
  const [householdId, setHouseholdId] = useState(null);
  const [tasksCount, setTasksCount] = useState(0);
  const [nextEvent, setNextEvent] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(null);

  // Fetch the household membership for the current user
  useEffect(() => {
    const fetchHousehold = async () => {
      const { data, error } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setHouseholdId(data.household_id);
      }
    };
    if (user) {
      fetchHousehold();
    }
  }, [user]);

  // Fetch tasks assigned to the current user for the Tasks widget
  useEffect(() => {
    if (!householdId) return;
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('household_id', householdId)
        .eq('assigned_to', user.id);  // Assuming the field is "assigned_to"
      if (data) {
        setTasksCount(data.length);
      }
    };
    fetchTasks();
  }, [householdId, user]);

  // Fetch the next upcoming event for the Calendar widget
  useEffect(() => {
    if (!householdId) return;
    const fetchNextEvent = async () => {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('household_id', householdId)
        .gt('event_date', today)
        .order('event_date', { ascending: true })
        .limit(1);
      if (data && data.length > 0) {
        setNextEvent(data[0]);
      }
    };
    fetchNextEvent();
  }, [householdId]);

  // Fetch active budget and compute remaining budget for the Budget widget
  useEffect(() => {
    if (!householdId) return;
    const fetchBudgetData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: budget, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('household_id', householdId)
        .lte('start_date', today)
        .gte('end_date', today)
        .single();
      if (budget) {
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('household_id', householdId);
        const totalExpenses = transactions
          .filter(tx => tx.transaction_type === 'expense')
          .reduce((acc, tx) => acc + tx.amount, 0);
        const totalContributions = transactions
          .filter(tx => tx.transaction_type === 'contribution')
          .reduce((acc, tx) => acc + tx.amount, 0);
        const remaining = budget.total_amount - totalExpenses + totalContributions;
        setRemainingBudget(remaining);
      }
    };
    fetchBudgetData();
  }, [householdId]);

  // Update widget definitions with dynamic details
  const widgets = [
    {
      title: 'Tasks',
      description: tasksCount > 0 ? `${tasksCount} tasks assigned to you` : 'No tasks assigned',
      route: '/tasks',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Calendar',
      description: nextEvent
        ? `Next event: ${nextEvent.title} on ${new Date(nextEvent.event_date).toLocaleDateString()}`
        : 'No upcoming events',
      route: '/calendar',
      icon: <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Budget',
      description: remainingBudget !== null
        ? `Remaining budget: $${remainingBudget.toFixed(2)}`
        : 'No active budget',
      route: '/budget',
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
  ];

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {widgets.map((widget, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
