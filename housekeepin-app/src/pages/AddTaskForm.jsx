// AddTaskForm.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Box, 
  TextField, 
  Button, 
  Stack,
  Paper,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';

const AddTaskForm = ({ householdId, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!householdId) {
      setError("Cannot add task - no household selected");
      return;
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ household_id: householdId, title, due_date: dueDate }]);

    if (error) {
      console.error('Error adding task:', error);
      setError(error.message);
    } else {
      onTaskAdded && onTaskAdded(data);
      setTitle('');
      setDueDate('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Task</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Task Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            variant="outlined"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!householdId}
          >
            Add Task
          </Button>
        </Stack>
      </Box>
      
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Task added successfully!</Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddTaskForm;
