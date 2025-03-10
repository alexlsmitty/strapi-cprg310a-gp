import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import OnboardingWizard from './pages/OnboardWizard';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import { supabase } from './supabaseClient';
import { Box, Typography, CircularProgress } from '@mui/material';
import './index.css';

function App() {
  const { user, authError } = useContext(AuthContext);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // After AuthContext loads user, fetch a profile or household info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If not authenticated, don't fetch profile
        if (user === undefined) {
          return; // Still loading
        }
        
        if (user === null) {
          console.log("No authenticated user");
          setLoadingProfile(false);
          return;
        }

        console.log("Fetching user profile for:", user.id);
        
        // Query the users table for the current user
        const { data, error } = await supabase
          .from('users')
          .select('onboard_success')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setProfileError(error.message);
          setOnboardingComplete(false);
        } else {
          console.log("User data:", data);
          setOnboardingComplete(!!data?.onboard_success);
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setProfileError(err.message);
        setOnboardingComplete(false);
      } finally {
        if (user !== undefined) { // Only set loading to false if auth state is determined
          setLoadingProfile(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Still determining auth state
  if (user === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Checking authentication...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Auth error
  if (authError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Authentication Error</Typography>
        <Typography variant="body1">{authError}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please check your network connection or try clearing your browser cache.
        </Typography>
      </Box>
    );
  }

  // Profile loading
  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading user profile...
          </Typography>
        </Box>
      </Box>
    );
  }
  
  // Profile error
  if (profileError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Profile Error</Typography>
        <Typography variant="body1">{profileError}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </Box>
    );
  }

  console.log('App rendering with state:', { user: !!user, onboardingComplete });

  return (
    <BrowserRouter>
      <Routes>
        {/* If no user, always go to /login */}
        {!user && (
          <>
            <Route path="/login" element={<LoginSignup />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* If logged in but not onboarded, default to /onboarding */}
        {user && !onboardingComplete && (
          <>
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        )}

        {/* If logged in AND onboarded, show main app */}
        {user && onboardingComplete && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/onboarding" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
