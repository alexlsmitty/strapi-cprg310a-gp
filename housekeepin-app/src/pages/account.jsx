import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../supabaseClient';

const Account = () => {
  const { user, logout } = useAuth();
  const [householdId, setHouseholdId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [houseMembers, setHouseMembers] = useState([]);

  // Fetch the current user's household membership details
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

  // Fetch all household members with their user details
  useEffect(() => {
    const fetchHouseMembers = async () => {
      if (!householdId) return;
      const { data, error } = await supabase
        .from('household_members')
        .select('user_id, role, users ( full_name, email )')
        .eq('household_id', householdId);
      if (error) {
        console.error('Error fetching household members:', error);
      } else if (data) {
        setHouseMembers(data);
      }
    };
    fetchHouseMembers();
  }, [householdId]);

  // Function to remove a household member (only if current user is the owner)
  const removeMember = async (memberUserId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    const { error } = await supabase
      .from('household_members')
      .delete()
      .eq('user_id', memberUserId)
      .eq('household_id', householdId);
    if (error) {
      console.error("Error removing member:", error);
    } else {
      // Remove member from local state after successful deletion
      setHouseMembers((prev) =>
        prev.filter((member) => member.user_id !== memberUserId)
      );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account / Household Details
      </Typography>
      {user && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            {user.user_metadata?.full_name || user.email}
          </Typography>
          <Typography variant="body1">
            Role: {userRole}
          </Typography>
        </Box>
      )}
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Household Members
      </Typography>
      <List>
        {houseMembers.map((member) => (
          <ListItem
            key={member.user_id}
            secondaryAction={
              userRole === 'owner' && member.user_id !== user.id && (
                <IconButton
                  edge="end"
                  onClick={() => removeMember(member.user_id)}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemText
              primary={
                member.users?.full_name ||
                member.users?.email ||
                'Unknown'
              }
              secondary={`Role: ${member.role}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" color="primary" onClick={logout}>
        Sign Out
      </Button>
    </Box>
  );
};

export default Account;
