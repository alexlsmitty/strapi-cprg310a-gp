import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../AuthContext';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress, 
  Button,
  Paper
} from '@mui/material';
import InviteMembersForm from '../smallComponents/InviteMembersForm';
import CreateTaskForm from '../smallComponents/CreateTaskForm';
import WelcomeStep from '../smallComponents/WelcomeStep';
import OnboardingSuccess from '../smallComponents/OnboardingSuccess';

console.log("WelcomeStep:", WelcomeStep);
console.log("InviteMembersForm:", InviteMembersForm);
console.log("CreateTaskForm:", CreateTaskForm);
console.log("OnboardingSuccess:", OnboardingSuccess);

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Step index to control the wizard
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Household info, invitations, etc.
  const [household, setHousehold] = useState(null);
  const [inviteEmails, setInviteEmails] = useState(['']);
  
  // Create household function - runs on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const createOrFetchHousehold = async () => {
      setLoading(true);
      try {
        // First ensure user record exists
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (userError || !userRecord) {
          // Create user record if missing
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ 
              id: user.id, 
              email: user.email,
              onboard_success: false,
              full_name: user.user_metadata?.full_name || null
            }]);
          
          if (insertError) throw insertError;
        }
        
        // First check if user already has a household
        const { data: existingMemberships, error: memberError } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', user.id);
          
        if (memberError) throw memberError;
        
        // If user already has a household, fetch it
        if (existingMemberships && existingMemberships.length > 0) {
          const { data: existingHousehold, error: householdError } = await supabase
            .from('households')
            .select('*')
            .eq('id', existingMemberships[0].household_id)
            .single();
            
          if (householdError) throw householdError;
          setHousehold(existingHousehold);
        } else {
          // No household found, create one
          console.log("Creating new household for user", user.id);
          
          // First, create the household
          const householdName = `${user.email.split('@')[0]}'s Household`;
          const { data: newHousehold, error: createError } = await supabase
            .from('households')
            .insert([{ 
              name: householdName,
              created_by: user.id 
            }])
            .select();
            
          if (createError) throw createError;
          
          console.log("Created household:", newHousehold);
          
          // Then, create the membership
          if (newHousehold && newHousehold.length > 0) {
            const { error: membershipError } = await supabase
              .from('household_members')
              .insert([{ 
                household_id: newHousehold[0].id, 
                user_id: user.id,
                role: 'owner' 
              }]);
              
            if (membershipError) throw membershipError;
            
            setHousehold(newHousehold[0]);
          }
        }
      } catch (error) {
        console.error("Household setup error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    createOrFetchHousehold();
  }, [user, navigate]);

  // Handler to go to the next step
  const nextStep = () => setStep((prev) => prev + 1);
  // Handler to go to the previous step
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const finishOnboarding = async () => {
    try {
      // Update the user's onboarding status
      const { error } = await supabase
        .from('users')
        .update({ onboard_success: true })
        .eq('id', user.id);

      if (error) throw error;

      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError(error.message);
    }
  };

  const InlineOnboardingSuccess = ({ household, inviteEmails, onFinish }) => {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Onboarding Complete!
        </Typography>
        <Typography variant="body1">
          You've set up your household and you're ready to go!
        </Typography>
        <Button 
          variant="contained" 
          onClick={onFinish} 
          sx={{ mt: 3 }}
        >
          Go to Dashboard
        </Button>
      </Paper>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
        <CircularProgress />
        <Typography variant="body1" mt={2}>Setting up your household...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h5" color="error">Something went wrong</Typography>
        <Typography variant="body1">{error}</Typography>
        <Typography variant="body2" mt={2}>
          Please try refreshing the page or contact support.
        </Typography>
      </Box>
    );
  }

  // Steps for the stepper
  const steps = ['Welcome', 'Invite Members', 'Create Task', 'Complete'];

  // Wizard content
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <WelcomeStep
            household={household}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <InviteMembersForm
            householdId={household?.id}
            inviteEmails={inviteEmails}
            setInviteEmails={setInviteEmails}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <CreateTaskForm
            householdId={household?.id}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <InlineOnboardingSuccess
            household={household}
            inviteEmails={inviteEmails}
            onFinish={finishOnboarding}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Welcome to HouseKeepin
      </Typography>
      
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStep()}
    </Box>
  );
};

export default OnboardingWizard;
