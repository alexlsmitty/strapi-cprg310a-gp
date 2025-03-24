import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { useAuth } from '../../auth/AuthContext';

const CalendarFeature = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for household, tasks, events, and UI toggles
  const [householdId, setHouseholdId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [showTasks, setShowTasks] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openAddEventDialog, setOpenAddEventDialog] = useState(false);

  // Fetch the household ID based on the logged-in user
  useEffect(() => {
    const fetchHousehold = async () => {
      const { data: membership, error } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error('Error fetching household:', error);
      } else if (membership) {
        setHouseholdId(membership.household_id);
      }
    };

    if (user) {
      fetchHousehold();
    }
  }, [user]);

  // Fetch tasks and events for the current month when household or currentDate changes
  useEffect(() => {
    const fetchData = async () => {
      if (!householdId) return;
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const startISO = start.toISOString();
      const endISO = end.toISOString();

      // Fetch tasks with due dates in the current month
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('household_id', householdId)
        .gte('due_date', startISO)
        .lte('due_date', endISO)
        .order('due_date', { ascending: true });
      if (taskError) {
        console.error('Error fetching tasks:', taskError);
      } else {
        setTasks(taskData);
      }

      // Fetch calendar events for the current month
      const { data: eventData, error: eventError } = await supabase
        .from('calendar_events')
        .select('*, created_by ( id, full_name, email )')
        .eq('household_id', householdId)
        .gte('event_date', startISO)
        .lte('event_date', endISO)
        .order('event_date', { ascending: true });
    
      if (eventError) {
        console.error('Error fetching events:', eventError);
      } else {
        setEvents(eventData);
      }
    };

    fetchData();
  }, [householdId, currentDate]);

  // Generate days for the current month and blank cells to align the first day
  const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  const firstDayOfMonth = startOfMonth(currentDate);
  const blankCells = new Array(firstDayOfMonth.getDay()).fill(null);
  const calendarCells = [...blankCells, ...daysInMonth];

  // Handler to add a new event to the database
  const handleAddEvent = async (eventDetails) => {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{
        household_id: householdId,
        title: eventDetails.title, // Make sure title is provided
        event_date: eventDetails.event_date,
        event_location: eventDetails.event_location,
        created_by: user.id,
      }])
      .select(); // This tells Supabase to return the inserted row(s)
  
    if (error) {
      console.error('Error adding event:', error);
    } else if (data && data.length > 0) {
      setEvents(prev => [...prev, data[0]]);
    } else {
      console.warn('No data returned from insert.');
    }
  };
  
  

  // Handler to delete an event from the database
  const handleDeleteEvent = async (eventId) => {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId);
    if (error) {
      console.error('Error deleting event:', error);
    } else {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setOpenEventDialog(false);
    }
  };

  // Component: DayCell renders each calendar cell with tasks and events for that day
  const DayCell = ({ day }) => {
    const tasksForDay = tasks.filter(task => task.due_date && isSameDay(parseISO(task.due_date), day));
    const eventsForDay = events.filter(event => event.event_date && isSameDay(parseISO(event.event_date), day));

    return (
      <Paper variant="outlined" sx={{ minHeight: 120, p: 1, position: 'relative' }}>
        <Typography variant="caption" sx={{ position: 'absolute', top: 4, right: 4 }}>
          {format(day, 'd')}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {showTasks && tasksForDay.map(task => (
            <Tooltip key={task.id} title={task.title} arrow>
              <Chip
                label={task.completed ? "✔ Completed" : "Task"} // Use a more descriptive label
                size="medium" // Increase size
                onClick={() => navigate('/tasks')}
                sx={{
                  width: '100%', // Make the Chip fill the width
                  height: 40, // Set a fixed height
                  justifyContent: 'flex-start', // Align text to the left
                  cursor: 'pointer',
                  backgroundColor: task.completed ? '#e8f5e9' : '#fff3e0', // Add background color for better visibility
                  '&:hover': { backgroundColor: task.completed ? '#c8e6c9' : '#ffe0b2' }, // Hover effect
                }}
              />
            </Tooltip>
          ))}
          {eventsForDay.map(event => (
            <Chip 
                key={event.id} 
                label={`📍 ${event.event_location} - ${event.created_by?.full_name || event.created_by?.email}`}
                size="medium"
                color="secondary"
                onClick={() => { setSelectedEvent(event); setOpenEventDialog(true); }}
                sx={{
                width: '100%', // Uniform width for better consistency
                height: 40,
                justifyContent: 'flex-start',
                cursor: 'pointer',
                backgroundColor: '#ede7f6',
                '&:hover': { backgroundColor: '#d1c4e9' },
                }}
            />
        ))}

        </Box>
      </Paper>
    );
  } 

  // Component: AddEventDialog renders a dialog to add new calendar events
  const AddEventDialog = ({ open, onClose }) => {
    const [eventTitle, setEventTitle] = useState('');      // New state for title
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
  
    const handleSubmit = async () => {
      // Ensure that the title is provided (you could also add validation)
      if (!eventTitle.trim()) {
        alert("Please enter an event title");
        return;
      }
      await handleAddEvent({
        title: eventTitle,               // Pass title here
        event_date: eventDate,
        event_location: eventLocation,
      });
      // Clear fields after submission if desired
      setEventTitle('');
      setEventDate('');
      setEventLocation('');
      onClose();
    };  

    return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Add Calendar Event</DialogTitle>
          <DialogContent>
            {/* New Event Title Field */}
            <TextField 
              label="Event Title" 
              fullWidth 
              value={eventTitle} 
              onChange={(e) => setEventTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Event Date" 
              type="date" 
              fullWidth 
              value={eventDate} 
              onChange={(e) => setEventDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Event Location" 
              fullWidth 
              value={eventLocation} 
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Add Event</Button>
          </DialogActions>
        </Dialog>
      );
    };

  // Component: EventDetailDialog renders a dialog displaying event details and a delete option
  const EventDetailDialog = ({ open, onClose, event }) => {
    if (!event) return null;
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Location: {event.event_location}</Typography>
          <Typography variant="body2">
            Date: {format(parseISO(event.event_date), 'PPP')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={() => handleDeleteEvent(event.id)} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

 
return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      <FormControlLabel 
        control={
          <Switch 
            checked={showTasks} 
            onChange={(e) => setShowTasks(e.target.checked)} 
          />
        }
        label="Show Tasks"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="outlined" onClick={() =>
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        }>
          Previous
        </Button>
        <Typography variant="h6">{format(currentDate, 'MMMM yyyy')}</Typography>
        <Button variant="outlined" onClick={() =>
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        }>
          Next
        </Button>
      </Box>
      {/* Weekday Headers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Box key={day} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {day}
          </Box>
        ))}
      </Box>
      {/* Calendar Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {calendarCells.map((cell, index) => {
          if (!cell) {
            return <Box key={`blank-${index}`} sx={{ minHeight: 120, border: '1px solid transparent' }} />;
          }
          return <DayCell key={cell.toISOString()} day={cell} />;
        })}
      </Box>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" onClick={() => setOpenAddEventDialog(true)}>
          Add Event
        </Button>
        {/* Back to Dashboard Button */}
        <Button variant="outlined" onClick={() => navigate('/')} sx={{ ml: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
      <AddEventDialog open={openAddEventDialog} onClose={() => setOpenAddEventDialog(false)} />
      <EventDetailDialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} event={selectedEvent} />
    </Box>
  );
}
export default CalendarFeature;
