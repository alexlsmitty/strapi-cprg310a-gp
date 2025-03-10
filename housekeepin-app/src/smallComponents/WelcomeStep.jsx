import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { supabase } from '../supabaseClient';
import { 
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';

const WelcomeStep = ({ household, onNext }) => {
  const { user } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update the user record with full name
      const { error: updateError } = await supabase
        .from('users')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      // Proceed to next step
      onNext();
    } catch (err) {
      console.error('Error saving name:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Welcome to HouseKeepin!
        </Typography>
        
        <Typography variant="body1" paragraph>
          We've created a household for you:
        </Typography>
        
        <Box 
          bgcolor="rgba(160, 231, 229, 0.1)" 
          borderRadius={2} 
          p={2} 
          mb={3}
        >
          <Typography variant="h6">
            {household?.name}
          </Typography>
          {household?.description && (
            <Typography variant="body2" color="text.secondary">
              {household.description}
            </Typography>
          )}
        </Box>
        
        <Typography variant="body1" paragraph>
          Let's start by setting up your profile. What should we call you?
        </Typography>
        
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your name"
          sx={{ mb: 3 }}
          error={!!error}
          helperText={error}
        />
        
        {loading ? (
          <CircularProgress />
        ) : (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            size="large"
            sx={{ mt: 2 }}
          >
            Continue
          </Button>
        )}
      </Paper>
    </motion.div>
  );
};

export default WelcomeStep;