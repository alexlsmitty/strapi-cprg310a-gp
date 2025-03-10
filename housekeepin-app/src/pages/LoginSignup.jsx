import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Divider,
  Alert 
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const LoginSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const formControlVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.4 }
    })
  };

  // Function to handle email/password authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }
      if (result.error) {
        setMessage({ type: 'error', text: result.error.message });
      } else {
        // Create user record if signing up
        if (!isLogin && result.data.user) {
          const { error: profileError } = await supabase
            .from('users')
            .insert([{ 
              id: result.data.user.id, 
              email: result.data.user.email,
            }]);
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }
        setMessage({ type: 'success', text: isLogin ? 'Logged in!' : 'Account created! Check your email to confirm.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google OAuth
  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setMessage({ type: 'error', text: error.message });
    setLoading(false);
  };

  useEffect(() => {
    // Debug logging
    console.log("Auth state:", { user, loading });
    
    // If there's an error with Supabase connection
    const checkSupabase = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
          setMessage({ type: 'error', text: `API Connection Error: ${error.message}` });
        }
      } catch (err) {
        console.error("Supabase client error:", err);
        setMessage({ type: 'error', text: `Client Error: ${err.message}` });
      }
    };
    
    checkSupabase();
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography component="h1" variant="h5">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Typography>
          </motion.div>
          
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Alert severity={message.type} sx={{ width: '100%', mt: 2 }}>
                {message.text}
              </Alert>
            </motion.div>
          )}
          
          <Box component="form" onSubmit={handleAuth} sx={{ mt: 3, width: '100%' }}>
            <motion.div 
              custom={1} 
              variants={formControlVariants}
              initial="hidden"
              animate="visible"
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            
            <motion.div 
              custom={2} 
              variants={formControlVariants}
              initial="hidden"
              animate="visible"
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
            
            <motion.div 
              custom={3} 
              variants={formControlVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2, mb: 2 }}
                component={motion.button}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </motion.div>
          </Box>
          
          <motion.div 
            custom={4} 
            variants={formControlVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <Divider sx={{ width: '100%', mb: 2 }}>OR</Divider>
          </motion.div>
          
          <motion.div 
            custom={5} 
            variants={formControlVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={signInWithGoogle}
              disabled={loading}
              component={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Continue with Google
            </Button>
          </motion.div>
          
          <motion.div 
            custom={6} 
            variants={formControlVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <Button
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setIsLogin(!isLogin)}
              component={motion.button}
              whileHover={{ scale: 1.03 }}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
};

export default LoginSignup;
