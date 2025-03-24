import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { supabase } from '../../supabaseClient';

function EditTaskDialog({ open, onClose, task, onTaskUpdated }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  // Ensure the date is in YYYY-MM-DD format
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.substring(0, 10) : "");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.due_date ? task.due_date.substring(0, 10) : "");
    }
  }, [task]);

  const handleSave = async () => {
    const { error } = await supabase
      .from('tasks')
      .update({ title, description, due_date: dueDate })
      .eq('id', task.id);
    if (error) {
      console.error("Error updating task:", error);
    } else {
      onTaskUpdated();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField 
          label="Title" 
          fullWidth 
          margin="normal" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <TextField 
          label="Description" 
          fullWidth 
          margin="normal" 
          multiline 
          rows={3} 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <TextField 
          label="Due Date" 
          type="date" 
          fullWidth 
          margin="normal" 
          InputLabelProps={{ shrink: true }}
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditTaskDialog;
