import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  AssignmentTurnedIn as TaskIcon, 
  Event as EventIcon,
  MoreVert as MoreIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isValid, parseISO } from 'date-fns';

const TaskList = ({ householdId }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (householdId === null || householdId === undefined) {
        console.log('Skipping task fetch - no household ID available');
        return;
      }
      
      setLoading(true);
      try {
        // Simplified query - just get the tasks first
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('household_id', householdId)
          .order('created_at', { ascending: false });
        
        if (taskError) throw taskError;
        
        // Get user information for assigned tasks in a separate step
        const tasksWithAssignees = [...taskData];
        const assignedTasks = taskData.filter(task => task.assigned_to_id);
        
        if (assignedTasks.length > 0) {
          const uniqueUserIds = [...new Set(assignedTasks.map(task => task.assigned_to_id))];
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, full_name, email')
            .in('id', uniqueUserIds);
          
          if (!userError && userData) {
            // Connect users to their tasks
            tasksWithAssignees.forEach(task => {
              if (task.assigned_to_id) {
                const assignee = userData.find(user => user.id === task.assigned_to_id);
                task.users = assignee || null;
              }
            });
          }
        }
        
        setTasks(tasksWithAssignees);
      } catch (error) {
        console.error('Task fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [householdId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'PPP'); // e.g., "Apr 29, 2023"
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return '#f44336'; // Red
      case 'medium':
        return '#ff9800'; // Orange
      case 'low':
        return '#4caf50'; // Green
      default:
        return '#9e9e9e'; // Grey (default)
    }
  };

  // Status indicator
  const StatusIndicator = ({ status }) => {
    let color = '#9e9e9e'; // Default gray
    let label = status || 'Pending';

    switch(status?.toLowerCase()) {
      case 'completed':
        color = '#4caf50'; // Green
        break;
      case 'in progress':
        color = '#2196f3'; // Blue
        break;
      case 'pending':
        color = '#ff9800'; // Orange
        break;
      default:
        color = '#9e9e9e'; // Grey (default)
    }

    return (
      <Chip 
        label={label}
        size="small"
        sx={{ 
          bgcolor: `${color}20`,
          color: color,
          fontWeight: 500,
          fontSize: '0.7rem'
        }}
      />
    );
  };

  if (error) return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Alert severity="error" sx={{ mb: 0 }}>Error: {error}</Alert>
      </motion.div>
    </Paper>
  );
  
  if (loading) return (
    <Paper elevation={2} sx={{ p: 4, mt: 3, textAlign: 'center' }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress color="primary" />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading tasks...
          </Typography>
        </motion.div>
      </Box>
    </Paper>
  );
  
  if (!householdId) return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Alert severity="info" sx={{ mb: 0 }}>No household selected</Alert>
      </motion.div>
    </Paper>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={2} 
        sx={{ 
          mt: 3, 
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'rgba(160, 231, 229, 0.1)', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <TaskIcon sx={{ mr: 1.5, color: 'var(--primary-mint)' }} />
          <Typography variant="h6" component="h2">
            Household Tasks
          </Typography>
        </Box>
        
        {tasks.length === 0 ? (
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              minHeight: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography variant="body1" color="text.secondary" paragraph>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new task to get started
            </Typography>
          </Box>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.div key={task.id} variants={itemVariants}>
                    <ListItem 
                      component={motion.div}
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                      transition={{ duration: 0.2 }}
                      sx={{ 
                        pl: 3, 
                        pr: 2, 
                        py: 2,
                        borderLeft: '4px solid transparent',
                        borderLeftColor: getPriorityColor(task.priority)
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgba(160, 231, 229, 0.2)',
                            color: 'var(--primary-mint)'
                          }}
                        >
                          <TaskIcon />
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {task.title}
                            <StatusIndicator status={task.status} />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <EventIcon sx={{ fontSize: '0.9rem', mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" component="span">
                                {formatDate(task.due_date)}
                              </Typography>
                            </Box>
                            {task.description && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {task.description}
                              </Typography>
                            )}
                            {task.users && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                Assigned to: {task.users.full_name || task.users.email || 'Unassigned'}
                              </Typography>
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      
                      <ListItemSecondaryAction>
                        <Tooltip title="Task options">
                          <IconButton edge="end" size="small">
                            <MoreIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < tasks.length - 1 && <Divider component="li" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          </motion.div>
        )}
      </Paper>
    </motion.div>
  );
};

export default TaskList;
