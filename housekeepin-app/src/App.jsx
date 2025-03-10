import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import OnboardingWizard from './pages/OnboardWizard';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import { supabase } from './supabaseClient';
import './index.css';

function App() {
  const { user } = useContext(AuthContext);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // After AuthContext loads user, fetch a profile or household info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) {
          setLoadingProfile(false);
          return;
        }

        // Query the users table for the current user
        const { data, error } = await supabase
          .from('users')
          .select('onboard_success') // Make sure this matches your Supabase field name
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setOnboardingComplete(false); // Default to false if there's an error
        } else {
          // Check if data exists and has the onboard_success field
          console.log("User data:", data); // Debug output
          setOnboardingComplete(data?.onboard_success || false);
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setOnboardingComplete(false);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    console.log('Current state:', { user, loadingProfile, onboardingComplete });
  }, [user, loadingProfile, onboardingComplete]);

  // If we’re still fetching profile info, just show loading
  if (loadingProfile) {
    return <p>Loading user profile…</p>;
  }

  console.log('Render state:', { user, loadingProfile, onboardingComplete });

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
