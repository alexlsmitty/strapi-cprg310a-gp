import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../supabaseClient';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import { motion, AnimatePresence } from 'framer-motion';

const TaskFeature = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [householdId, setHouseholdId] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch the household ID for the current user
  useEffect(() => {
    const fetchHousehold = async () => {
      const { data: membership, error } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error('Error fetching household:', error);
      } else if (membership) {
        setHouseholdId(membership.household_id);
      }
    };

    if (user) {
      fetchHousehold();
    }
  }, [user]);

  // Callback when a task is added to refresh the task list
  const handleTaskAdded = (newTask) => {
    setRefreshKey((prev) => prev + 1);
    setShowAddTask(false);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Button
        variant="contained"
        onClick={() => setShowAddTask((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {showAddTask ? 'Hide Add Task Form' : 'Add Task'}
      </Button>

      {/* Animate the AddTaskForm appearance */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            key="addTaskForm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AddTaskForm householdId={householdId} onTaskAdded={handleTaskAdded} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list which already has its own animations */}
      <TaskList householdId={householdId} key={refreshKey} />

      <Button
        variant="outlined"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default TaskFeature;
