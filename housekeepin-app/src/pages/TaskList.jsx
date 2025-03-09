// TaskList.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const TaskList = ({ householdId }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      // More explicit check for null/undefined
      if (householdId === null || householdId === undefined) {
        console.log('Skipping task fetch - no household ID available');
        return;
      }
      
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('household_id', householdId);
      
      setLoading(false);
      if (error) {
        console.error('Task fetch error:', error);
        setError(error.message);
      } else {
        setTasks(data || []);
      }
    };

    fetchTasks();
  }, [householdId]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading tasks...</div>;
  if (!householdId) return <div>No household selected</div>;

  return (
    <div>
      <h2>Household Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>{task.title} - Due: {task.due_date}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
