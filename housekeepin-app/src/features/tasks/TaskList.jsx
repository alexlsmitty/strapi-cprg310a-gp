// TaskList.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
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
  Menu, 
  MenuItem,
  useTheme,
  ListItemText
} from '@mui/material';
import { 
  AssignmentTurnedIn as TaskIcon, 
  Event as EventIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isValid, parseISO } from 'date-fns';
import EditTaskDialog from './editTaskDialog';
import AssignTaskDialog from './assignTaskDialog';
import { useAuth } from '../../auth/AuthContext';

const TaskList = ({ householdId }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { user } = useAuth();

  // States for options menu and dialogs
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  // Used to refresh task list after an update
  const [refreshKey, setRefreshKey] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
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
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('household_id', householdId)
          .order('created_at', { ascending: false });
        
        if (taskError) throw taskError;
        
        // Process tasks with assigned user info
        const tasksWithAssignees = [...taskData];
        const assignedTasks = taskData.filter(task => task.assigned_to_id);
        if (assignedTasks.length > 0) {
          const uniqueUserIds = [...new Set(assignedTasks.map(task => task.assigned_to_id))];
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, full_name, email')
            .in('id', uniqueUserIds);
          
          if (!userError && userData) {
            tasksWithAssignees.forEach(task => {
              if (task.assigned_to_id) {
                const assignee = userData.find(u => u.id === task.assigned_to_id);
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
  }, [householdId, refreshKey]);

  // Options menu handlers
  const handleMenuOpen = (event, task) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this task?")) {
      const { error } = await supabase.from('tasks').delete().eq('id', selectedTask.id);
      if (error) {
        console.error("Error deleting task:", error);
      } else {
        setRefreshKey(prev => prev + 1);
      }
    }
  };

  // New handler for marking a task as complete
  const handleComplete = async () => {
    handleMenuClose();
    if (window.confirm("Mark this task as complete?")) {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: true })
        .eq('id', selectedTask.id);
      if (error) {
        console.error("Error marking task as complete:", error);
      } else {
        setRefreshKey(prev => prev + 1);
      }
    }
  };

  const handleAssign = () => {
    setAssignDialogOpen(true);
    handleMenuClose();
  };

  // Refresh list after an update
  const onTaskUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const StatusIndicator = ({ status }) => {
    let color = '#9e9e9e';
    let label = status || 'Pending';
    switch(status?.toLowerCase()) {
      case 'completed': color = '#4caf50'; break;
      case 'in progress': color = '#2196f3'; break;
      case 'pending': color = '#ff9800'; break;
      default: color = '#9e9e9e';
    }
    return (
      <Chip 
        label={label}
        size="small"
        sx={{ bgcolor: `${color}20`, color: color, fontWeight: 500, fontSize: '0.7rem' }}
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
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
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
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper elevation={2} sx={{ mt: 3, borderRadius: '16px', overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'rgba(160, 231, 229, 0.1)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center' }}>
            <TaskIcon sx={{ mr: 1.5, color: 'var(--primary-mint)' }} />
            <Typography variant="h6" component="h2">
              Household Tasks
            </Typography>
          </Box>
          
          {tasks.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary" paragraph>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new task to get started
              </Typography>
            </Box>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <motion.div key={task.id} variants={itemVariants}>
                      <ListItem 
                        component={motion.div}
                        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                        transition={{ duration: 0.2 }}
                        sx={{ pl: 3, pr: 2, py: 2, borderLeft: '4px solid transparent', borderLeftColor: getPriorityColor(task.priority) }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'rgba(160, 231, 229, 0.2)', color: 'var(--primary-mint)' }}>
                            <TaskIcon />
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {/* Render the title with a strike-through if completed */}
                                <Typography 
                                  variant="subtitle1" 
                                  sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                                >
                                  {task.title}
                                </Typography>
                                {/* Show Completed status if task.completed is true */}
                                <StatusIndicator status={task.completed ? 'completed' : (task.status || 'pending')} />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                {/* Your existing secondary content, e.g., due date, description */}
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
                                {/* Optionally, you can show assigned user info here */}
                              </Box>
                            }
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        
                        <ListItemSecondaryAction>
                          <Tooltip title="Task options">
                            <IconButton edge="end" size="small" onClick={(e) => handleMenuOpen(e, task)}>
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

      {/* Options Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit Task</MenuItem>
        <MenuItem onClick={handleComplete}>Complete Task</MenuItem>
        <MenuItem onClick={handleDelete}>Delete Task</MenuItem>
        <MenuItem onClick={handleAssign}>Assign Task</MenuItem>
      </Menu>

      {/* Edit Task Dialog */}
      {selectedTask && (
        <EditTaskDialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          task={selectedTask} 
          onTaskUpdated={onTaskUpdated} 
        />
      )}

      {/* Assign Task Dialog */}
      {selectedTask && (
        <AssignTaskDialog 
          open={assignDialogOpen} 
          onClose={() => setAssignDialogOpen(false)} 
          task={selectedTask} 
          householdId={householdId} 
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  );
};

export default TaskList;
