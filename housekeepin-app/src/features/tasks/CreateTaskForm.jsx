import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const CreateTaskForm = ({ householdId, onNext, onBack }) => {
  const [title, setTitle] = useState('Welcome Task');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const createTask = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Example: Direct insert or call an RPC
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            household_id: householdId,
            title,
            description,
            due_date: dueDate || null,
          },
        ]);

      if (error) throw error;

      onNext();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Your First Task</h2>
      <p>Let’s set up a simple task to get you started.</p>
      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <label>Description</label>
      <textarea
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <label>Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <div style={{ marginTop: '16px' }}>
        <button onClick={onBack} disabled={loading}>Back</button>
        <button onClick={createTask} disabled={loading}>
          {loading ? 'Creating...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CreateTaskForm;
