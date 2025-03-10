import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        ensureUserRecord(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth event: ${event}`);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle signup and OAuth events by ensuring user record exists
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
          await ensureUserRecord(session.user);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Function to ensure user record exists in the users table
  async function ensureUserRecord(authUser) {
    try {
      // First check if user record exists
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single();
      
      // If no record or error (no rows), create one
      if (error || !data) {
        console.log("Creating new user record for:", authUser.email);
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: authUser.id, 
            email: authUser.email,
            onboard_success: false,
            full_name: authUser.user_metadata?.full_name || null
          }]);
          
        if (insertError) {
          console.error("Failed to create user record:", insertError);
        } else {
          console.log("User record created successfully");
        }
      } else {
        console.log("User record already exists");
      }
    } catch (err) {
      console.error("Error ensuring user record:", err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
};
