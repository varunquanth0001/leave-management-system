import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [newLeave, setNewLeave] = useState({ leaveType: 'sick', startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    if (!token) return;
    fetchLeaves();
    if (user.role === 'employee') fetchBalance();
  }, [token]);

  const fetchLeaves = async () => {
    const endpoint = user.role === 'manager' ? '/api/leaves/all' : '/api/leaves/my-requests';
    const res = await axios.get(`http://localhost:5000${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
    setLeaves(res.data);
  };

  const fetchBalance = async () => {
    const res = await axios.get('http://localhost:5000/api/leaves/balance', { headers: { Authorization: `Bearer ${token}` } });
    setBalance(res.data);
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/leaves', newLeave, { headers: { Authorization: `Bearer ${token}` } });
      alert('Leave Applied');
      fetchLeaves();
    } catch (err) { alert('Error applying'); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchLeaves();
    } catch (err) { alert('Error updating status'); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">Welcome, {user.name} ({user.role})</h1>
        <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>
      {user.role === 'employee' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Leave Balance</h2>
            {balance && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-100 p-4 rounded">Sick: {balance.sick}</div>
                <div className="bg-green-100 p-4 rounded">Casual: {balance.casual}</div>
                <div className="bg-yellow-100 p-4 rounded">Vacation: {balance.vacation}</div>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
            <form onSubmit={handleApplyLeave} className="space-y-3">
              <select className="w-full border p-2 rounded" onChange={e => setNewLeave({...newLeave, leaveType: e.target.value})}>
                <option value="sick">Sick</option><option value="casual">Casual</option><option value="vacation">Vacation</option>
              </select>
              <div className="flex gap-2">
                <input type="date" className="w-1/2 border p-2 rounded" onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} required />
                <input type="date" className="w-1/2 border p-2 rounded" onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} required />
              </div>
              <textarea placeholder="Reason" className="w-full border p-2 rounded" onChange={e => setNewLeave({...newLeave, reason: e.target.value})} required></textarea>
              <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Submit Request</button>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">{user.role === 'manager' ? 'All Requests' : 'My History'}</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              {user.role === 'manager' && <th className="p-3">Employee</th>}
              <th className="p-3">Type</th><th className="p-3">Days</th><th className="p-3">Reason</th><th className="p-3">Status</th>
              {user.role === 'manager' && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave._id} className="border-b hover:bg-gray-50">
                {user.role === 'manager' && <td className="p-3">{leave.userId?.name}</td>}
                <td className="p-3 capitalize">{leave.leaveType}</td>
                <td className="p-3">{leave.totalDays}</td>
                <td className="p-3">{leave.reason}</td>
                <td className={`p-3 font-bold ${leave.status === 'approved' ? 'text-green-600' : leave.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{leave.status.toUpperCase()}</td>
                {user.role === 'manager' && leave.status === 'pending' && (
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleUpdateStatus(leave._id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                    <button onClick={() => handleUpdateStatus(leave._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Reject</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}