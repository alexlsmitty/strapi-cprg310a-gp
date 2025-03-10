import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Stack, 
  Paper,
  Alert, 
  CircularProgress
} from '@mui/material';

const CreateTaskForm = ({ householdId, onNext, onBack }) => {
  const [title, setTitle] = useState('Welcome Task');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const createTask = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            household_id: householdId,
            title,
            description,
            due_date: dueDate || null,
          },
        ]);

      if (error) throw error;
      onNext();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Create Your First Task</Typography>
      <Typography variant="body1" paragraph>Let's set up a simple task to get you started.</Typography>
      
      <Stack spacing={3} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          variant="outlined"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      {errorMsg && <Alert severity="error" sx={{ mt: 2 }}>{errorMsg}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onBack} 
          disabled={loading}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={createTask} 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateTaskForm;
