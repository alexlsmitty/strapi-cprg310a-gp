import React, { useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  IconButton, 
  Typography, 
  Stack,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const InviteMembersForm = ({ householdId, inviteEmails, setInviteEmails, onNext, onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e, index) => {
    const { value } = e.target;
    const updated = [...inviteEmails];
    updated[index] = value;
    setInviteEmails(updated);
  };

  const addInviteField = () => {
    setInviteEmails([...inviteEmails, '']);
  };

  const removeInviteField = (index) => {
    const updated = inviteEmails.filter((_, i) => i !== index);
    setInviteEmails(updated);
  };

  const submitInvites = async () => {
    if (!user) {
      setErrorMsg('You must be logged in to send invitations');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      for (let email of inviteEmails) {
        if (email.trim() !== '') {
          const { data, error } = await supabase
            .from('invitations')
            .insert([
              {
                household_id: householdId,
                invitee_email: email.trim(),
                inviter_id: user.id, // Use user ID from context
              },
            ]);
          if (error) throw error;
        }
      }
      onNext(); // move to next step
    } catch (error) {
      console.error('Invitation error:', error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Invite Household Members
      </Typography>
      <Typography variant="body1" paragraph>
        Enter email addresses of the people you'd like to invite:
      </Typography>
      
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
      
      <Stack spacing={2} sx={{ mb: 3 }}>
        {inviteEmails.map((email, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              type="email"
              fullWidth
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => handleChange(e, index)}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <IconButton 
              color="error" 
              onClick={() => removeInviteField(index)}
              disabled={inviteEmails.length === 1}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        ))}
        
        <Button 
          startIcon={<AddCircleOutlineIcon />} 
          onClick={addInviteField}
          variant="outlined"
          sx={{ alignSelf: 'flex-start' }}
        >
          Add another
        </Button>
      </Stack>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={submitInvites} 
          disabled={loading || !inviteEmails.some(email => email.trim() !== '')}
        >
          {loading ? <CircularProgress size={24} /> : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default InviteMembersForm;
