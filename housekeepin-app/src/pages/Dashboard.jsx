// Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { supabase } from '../supabaseClient';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Tabs, 
  Tab, 
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ExitToApp as LogoutIcon, 
  Home as HomeIcon, 
  Group as GroupIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [householdId, setHouseholdId] = useState(null);
  const [householdData, setHouseholdData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Background patterns
  const backgroundStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    opacity: 0.04,
    backgroundImage: `
      radial-gradient(circle at 25px 25px, var(--secondary-pink) 2%, transparent 0%), 
      radial-gradient(circle at 75px 75px, var(--primary-mint) 2%, transparent 0%)
    `,
    backgroundSize: '100px 100px',
    pointerEvents: 'none',
  };

  // Fetch household members function
  const fetchHouseholdMembers = async () => {
    if (!householdId) return;
    
    setLoadingMembers(true);
    try {
      // First get all member user IDs
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select('user_id, role')
        .eq('household_id', householdId);
        
      if (memberError) {
        console.error('Error fetching household members:', memberError);
        return;
      }
      
      if (!memberData || memberData.length === 0) {
        setMembers([]);
        return;
      }
      
      // Then fetch user details for each member
      const userIds = memberData.map(member => member.user_id);
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email')
        .in('id', userIds);
        
      if (usersError) {
        console.error('Error fetching member details:', usersError);
        return;
      }
      
      // Combine the data
      const combinedData = memberData.map(member => {
        const userData = usersData.find(user => user.id === member.user_id);
        return {
          ...userData,
          role: member.role
        };
      });
      
      setMembers(combinedData);
    } catch (err) {
      console.error('Error in fetchHouseholdMembers:', err);
    } finally {
      setLoadingMembers(false);
    }
  };
  
  // Toggle member dialog and fetch data if needed
  const handleToggleMembers = () => {
    if (!showMembers && members.length === 0) {
      fetchHouseholdMembers();
    }
    setShowMembers(!showMembers);
  };

  // Wait for auth state to be determined before redirecting
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user and household data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user profile first
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else {
          setUserData(userData);
        }
        
        // Then fetch household membership
        const { data: memberData, error: memberError } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', user.id)
          .single();
          
        if (memberError) {
          console.error('Error fetching household membership:', memberError);
        } else if (memberData?.household_id) {
          setHouseholdId(memberData.household_id);
          
          // Fetch household details
          const { data: householdData, error: householdError } = await supabase
            .from('households')
            .select('*')
            .eq('id', memberData.household_id)
            .single();
            
          if (householdError) {
            console.error('Error fetching household details:', householdError);
          } else {
            setHouseholdData(householdData);
          }
        }
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get user's first name for personalized greeting
  const firstName = userData?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there';
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background pattern */}
      <Box sx={backgroundStyles} />
      
      {/* AppBar with personalization - Smaller with whitespace */}
      <Box sx={{ px: 2, pt: 2 }}>
        <AppBar 
          position="static" 
          elevation={2} 
          sx={{ 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary-mint) 0%, var(--primary-mint) 35%, var(--sage-light) 60%, var(--accent-pink) 100%)',
            maxWidth: '100%',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <Toolbar sx={{ minHeight: {xs: '64px', sm: '56px'} }}>
            <Box sx={{ flexGrow: 1 }}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" component="div" sx={{ color: 'var(--text-color)' }}>
                  Welcome, {firstName}!
                </Typography>
                {householdData && (
                  <Typography variant="subtitle2" sx={{ opacity: 0.9, color: 'var(--text-color)' }}>
                    <HomeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    {householdData.name}
                  </Typography>
                )}
              </motion.div>
            </Box>
            <motion.div variants={itemVariants}>
              <Tooltip title="View Household Members">
                <Button 
                  sx={{ 
                    mr: 1, 
                    backgroundColor: 'rgba(var(--sage-dark), 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(var(--sage-dark), 0.3)',
                    }
                  }} 
                  onClick={handleToggleMembers}
                  startIcon={<GroupIcon />}
                >
                  Members
                </Button>
              </Tooltip>
              <Button 
                sx={{ 
                  backgroundColor: 'rgba(var(--sage-dark), 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(var(--sage-dark), 0.3)',
                  }
                }}
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/login');
                }}
                startIcon={<LogoutIcon />}
              >
                Sign Out
              </Button>
            </motion.div>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Main Container */}
      <Container 
        maxWidth="md" 
        component={motion.div} 
        variants={itemVariants}
        sx={{ mt: 4, mb: 8 }}
      >
        {/* User Info Card */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            display: 'flex',
            alignItems: 'center',
            background: 'var(--gradient-teal-sage)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              backgroundSize: '300px 300px',
              opacity: 0.3,
            },
          }}
        >
          <Avatar 
            sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'var(--primary-mint)', 
              mr: 3,
              fontSize: '1.5rem'
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{userData?.full_name || user.email}</Typography>
            <Typography variant="body2" color="text.secondary">
              {householdData?.name || 'Your Household'}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<GroupIcon />}
            onClick={handleToggleMembers}
            sx={{ 
              borderRadius: '20px',
              borderColor: 'var(--accent-pink)',
              color: 'var(--accent-pink)',
              '&:hover': {
                borderColor: 'var(--accent-pink)',
                backgroundColor: 'rgba(201, 124, 93, 0.1)'
              }
            }}
          >
            Household Members
          </Button>
        </Paper>

        {/* Tabs Navigation */}
        <Paper 
          elevation={1} 
          sx={{ 
            mb: 4, 
            borderRadius: '16px',
            backgroundImage: 'linear-gradient(to bottom, var(--background-white), var(--secondary-white))',
            boxShadow: '0 4px 20px var(--shadow-color)'
          }}
        >
          <Tabs 
            value={tab} 
            onChange={(e, newValue) => setTab(newValue)}
            variant="fullWidth"
            sx={{ 
              '& .MuiTabs-indicator': { 
                backgroundColor: 'var(--primary-mint)',
                height: '3px',
                borderRadius: '3px 3px 0 0'
              },
              '& .MuiTab-root': {
                transition: 'all var(--transition-fast)',
                '&.Mui-selected': {
                  color: 'var(--primary-mint)',
                  fontWeight: '500'
                }
              }
            }}
          >
            <Tab label="Tasks" />
            <Tab label="Calendar" />
            <Tab label="Budget" />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
              <Typography variant="h5" gutterBottom>
                Your Tasks
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <AddTaskForm 
                householdId={householdId} 
                onTaskAdded={(newTask) => console.log("Task added:", newTask)} 
              />
            </Paper>
            
            <TaskList householdId={householdId} />
          </motion.div>
        )}
        
        {tab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
              <Typography variant="h5" gutterBottom>
                Calendar
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
                Calendar feature coming soon!
              </Typography>
            </Paper>
          </motion.div>
        )}
        
        {tab === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
              <Typography variant="h5" gutterBottom>
                Budget
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
                Budget tracking feature coming soon!
              </Typography>
            </Paper>
          </motion.div>
        )}
      </Container>
      
      {/* Household Members Dialog */}
      <Dialog
        open={showMembers}
        onClose={() => setShowMembers(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
              {householdData?.name || 'Household'} Members
            </Typography>
            <IconButton onClick={() => setShowMembers(false)} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loadingMembers ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress size={30} sx={{ color: 'var(--primary-mint)' }} />
            </Box>
          ) : members.length > 0 ? (
            <List>
              {members.map((member) => (
                <ListItem key={member.id} divider>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: member.id === user.id 
                          ? 'var(--primary-mint)' 
                          : 'var(--accent-pink)' 
                      }}
                    >
                      {(member.full_name?.charAt(0) || member.email?.charAt(0) || '?').toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={member.full_name || member.email}
                    secondary={
                      <React.Fragment>
                        {member.email}
                        {member.id === user.id && " (You)"}
                      </React.Fragment>
                    } 
                  />
                  <Chip 
                    label={member.role || 'member'} 
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: member.role === 'owner' ? 'var(--primary-mint)' : undefined,
                      color: member.role === 'owner' ? 'var(--primary-mint)' : undefined
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box textAlign="center" p={3}>
              <Typography color="textSecondary">
                No household members found
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Dashboard;
