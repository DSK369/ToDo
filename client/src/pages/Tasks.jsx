import { useEffect, useState } from 'react';
import API from '../services/api';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // 🔄 FETCH TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await API.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ CREATE
  const createTask = async () => {
    if (!title.trim()) return alert('Title is required');

    try {
      await API.post(
        '/tasks',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ DELETE
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 TOGGLE STATUS
  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'todo' ? 'done' : 'todo';

      await API.put(
        `/tasks/${task._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>My Tasks</h2>

      <button onClick={logout} style={{ marginBottom: '10px' }}>
        Logout
      </button>

      <hr />

      {/* ➕ Create Task */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />

      <button onClick={createTask}>Add Task</button>

      <hr />

      {/* ⏳ Loading */}
      {loading && <p>Loading...</p>}

      {/* 📋 Task List */}
      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: '1px solid #ccc',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <p>
            Status:{' '}
            <span
              style={{
                color: task.status === 'done' ? 'green' : 'orange',
                fontWeight: 'bold',
              }}
            >
              {task.status}
            </span>
          </p>

          <button onClick={() => toggleStatus(task)} style={{ marginRight: '10px' }}>
            Mark as {task.status === 'todo' ? 'Done' : 'Todo'}
          </button>

          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Tasks;