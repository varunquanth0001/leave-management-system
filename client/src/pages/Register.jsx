import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Error registering');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 font-bold text-center">Register</h2>
        <input className="w-full mb-3 p-2 border rounded" placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input className="w-full mb-3 p-2 border rounded" type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input className="w-full mb-3 p-2 border rounded" type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <select className="w-full mb-4 p-2 border rounded" onChange={e => setFormData({...formData, role: e.target.value})}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
        <p className="mt-4 text-sm text-center">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
}