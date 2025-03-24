import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

// ErrorBoundary Component to catch rendering errors in LoginSignup
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ padding: 2 }}>
          <Alert severity="error">
            Something went wrong: {this.state.error && this.state.error.toString()}
          </Alert>
        </Box>
      );
    }
    return this.props.children; 
  }
}

const LoginSignup = () => {
  // Use the custom auth hook
  const { loading: authLoading } = useAuth();
  
  // Local state to manage form values and loading/error states
  const [localLoading, setLocalLoading] = useState(false);
  const [authState, setAuthState] = useState({
    email: '',
    password: '',
    isLogin: true,
    errorMessage: null,
  });

  // Destructure state variables for easy usage
  const { email, password, isLogin, errorMessage } = authState;

  // Helper to update fields in authState
  const updateField = (field, value) => {
    setAuthState(prev => ({ ...prev, [field]: value }));
  };

  // Handle email/password authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    updateField('errorMessage', null); // clear previous errors

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      console.error('Authentication error:', err);
      updateField('errorMessage', err.message || 'Authentication failed');
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle authentication with Google
  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google authentication error:', err);
      updateField('errorMessage', err.message || 'Google authentication failed');
    }
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Page Title */}
          <Typography component="h1" variant="h5">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Typography>

          {/* Error Message */}
          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Authentication Form */}
          <Box component="form" onSubmit={handleAuth} sx={{ mt: 3 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => updateField('password', e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={localLoading || authLoading}
              sx={{ mt: 2, mb: 2 }}
            >
              {localLoading ? <CircularProgress size={24} /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </Box>

          <Divider sx={{ width: '100%', mb: 2 }}>OR</Divider>

          {/* Google Authentication Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleAuth}
            disabled={localLoading || authLoading}
          >
            Continue with Google
          </Button>

          {/* Toggle between Sign In and Sign Up */}
          <Button
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => updateField('isLogin', !isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </Box>
      </Container>
    </ErrorBoundary>
  );
};

export default LoginSignup;
