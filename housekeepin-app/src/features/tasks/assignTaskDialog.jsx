// You can place this in the same file or in a separate file (e.g., AssignTaskDialog.jsx)
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Typography } from '@mui/material';
import { supabase } from '../../supabaseClient';

function AssignTaskDialog({ open, onClose, task, householdId, onTaskUpdated }) {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      // First, fetch household_members entries for the household
      const { data: memberships, error: memberError } = await supabase
        .from('household_members')
        .select('user_id')
        .eq('household_id', householdId);
      if (memberError) {
        console.error("Error fetching household members:", memberError);
      } else if (memberships) {
        const userIds = memberships.map(m => m.user_id);
        // Then, fetch user details
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .in('id', userIds);
        if (userError) {
          console.error("Error fetching user details:", userError);
        } else {
          setMembers(users);
        }
      }
    };

    if (householdId) {
      fetchMembers();
    }
  }, [householdId]);

  const handleAssign = async () => {
    if (!selectedMemberId) return;
    const { error } = await supabase
      .from('tasks')
      .update({ assigned_to: selectedMemberId })
      .eq('id', task.id);
    if (error) {
      console.error("Error assigning task:", error);
    } else {
      onTaskUpdated();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assign Task</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Select a household member to assign this task:
        </Typography>
        {members.map(member => (
          <MenuItem key={member.id} onClick={() => setSelectedMemberId(member.id)} selected={selectedMemberId === member.id}>
            {member.full_name || member.email}
          </MenuItem>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAssign} variant="contained" disabled={!selectedMemberId}>Assign</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssignTaskDialog;
