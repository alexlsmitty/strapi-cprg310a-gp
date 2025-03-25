import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../supabaseClient';

const Invite = () => {
  const { user } = useAuth();
  const [householdId, setHouseholdId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the current user's household membership and role
  useEffect(() => {
    const fetchHousehold = async () => {
      if (!user) return;
      const { data: membership, error } = await supabase
        .from('household_members')
        .select('household_id, role')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error('Error fetching membership:', error);
      } else if (membership) {
        setHouseholdId(membership.household_id);
        setUserRole(membership.role);
      }
    };
    fetchHousehold();
  }, [user]);

  // If the user is the owner, fetch invitations that they have sent
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!householdId) return;
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('household_id', householdId)
        .eq('inviter_id', user.id);
      if (error) {
        console.error('Error fetching invitations:', error);
      } else if (data) {
        setInvitations(data);
      }
    };
    if (userRole === 'owner' && householdId) {
      fetchInvitations();
    }
  }, [householdId, user, userRole]);

  // Function to send a new invitation
  const handleInvite = async () => {
    if (!inviteEmail) {
      setError('Please enter an email address.');
      return;
    }
    setError('');
    setLoading(true);
    const { data, error } = await supabase
      .from('invitations')
      .insert([
        {
          household_id: householdId, // Explicitly using householdId here
          invitee_email: inviteEmail,
          inviter_id: user.id
        }
      ])
      .select();
    setLoading(false);
    if (error) {
      console.error('Error sending invitation:', error);
      setError(error.message);
    } else {
      // Update the invitation list locally with the newly sent invite
      setInvitations(prev => [...prev, data[0]]);
      setInviteEmail('');
    }
  };

  // If not owner, show a message instead of the invite interface
  if (userRole !== 'owner') {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Invite New Members
        </Typography>
        <Typography variant="body1">
          Make your own household to invite new members.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invite New Members
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Email Address"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <Button variant="contained" onClick={handleInvite} disabled={loading}>
          {loading ? 'Sending...' : 'Send Invite'}
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>
        Sent Invitations
      </Typography>
      {invitations.length === 0 ? (
        <Typography variant="body1">No invitations sent yet.</Typography>
      ) : (
        <List>
          {invitations.map((invite) => (
            <ListItem key={invite.id}>
              <ListItemText
                primary={invite.invitee_email}
                secondary={`Status: ${invite.status || 'Pending'}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Invite;
