import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 font-bold text-center">Login</h2>
        <input className="w-full mb-3 p-2 border rounded" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
        <p className="mt-4 text-sm text-center">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
      </form>
    </div>
  );
}