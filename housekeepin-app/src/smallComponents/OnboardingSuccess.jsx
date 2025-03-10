// OnboardingSuccess.jsx

import React from 'react';

const OnboardingSuccess = ({ household, inviteEmails, onFinish }) => {
  return (
    <div>
      <h2>Onboarding Complete!</h2>
      <p>
        You’ve set up the <strong>{household?.name}</strong> household and invited:
      </p>
      <ul>
        {inviteEmails
          .filter((email) => email.trim() !== '')
          .map((email, idx) => (
            <li key={idx}>{email}</li>
          ))}
      </ul>
      <p>We’ve also created your first task. Feel free to add more tasks!</p>
      <button onClick={onFinish}>Go to Dashboard</button>
    </div>
  );
};

const finishOnboarding = async () => {
    // set `onboarding_complete` to true in `public.users`
    await supabase
      .from('users')
      .update({ onboarding_complete: true })
      .eq('id', user.id);
  
    // Then route to the main dashboard
    navigate('/');
  };

export default { OnboardingSuccess, finishOnboarding };
