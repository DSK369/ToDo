import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // 👈 added


  const handleLogin = async () => {
  try {
    console.log(email, password); // 👈 debug

    const res = await API.post('/auth/login', {
      email,
      password,
    });

    localStorage.setItem('token', res.data.token);
    navigate('/tasks');

  } catch (err) {
    console.log(err.response?.data); // 👈 IMPORTANT
    alert(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;