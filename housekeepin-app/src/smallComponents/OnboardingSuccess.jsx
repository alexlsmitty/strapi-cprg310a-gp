import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Paper
} from '@mui/material';

const OnboardingSuccess = ({ household, inviteEmails, onFinish }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Onboarding Complete!
      </Typography>
      <Typography variant="body1" paragraph>
        You've set up the <strong>{household?.name}</strong> household
        {inviteEmails.filter(email => email.trim()).length > 0 && " and invited:"}
      </Typography>
      
      {inviteEmails.filter(email => email.trim()).length > 0 && (
        <Box bgcolor="rgba(160, 231, 229, 0.1)" borderRadius={2} p={2} mb={3}>
          <List>
            {inviteEmails
              .filter((email) => email.trim() !== '')
              .map((email, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={email} />
                </ListItem>
              ))}
          </List>
        </Box>
      )}
      
      <Typography variant="body1" paragraph>
        We've also created your first task. Feel free to add more tasks!
      </Typography>
      
      <Button variant="contained" onClick={onFinish} sx={{ mt: 2 }}>
        Go to Dashboard
      </Button>
    </Paper>
  );
};

export default OnboardingSuccess;
