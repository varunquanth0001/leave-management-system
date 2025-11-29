const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- FAKE DATABASE (Saves to RAM for the video) ---
let users = [];
let leaves = [];
let idCounter = 1;

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if user exists
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: "User already exists" });

  const newUser = { 
    _id: String(idCounter++), 
    name, email, password, role, 
    leaveBalance: { sick: 10, casual: 5, vacation: 5 } 
  };
  users.push(newUser);
  console.log("✅ User Registered:", name); 
  res.status(201).json({ message: 'User registered' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, 'secret123');
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.header('Authorization');
  if(!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token.split(" ")[1], 'secret123');
    const user = users.find(u => u._id === verified.id);
    res.json(user);
  } catch (err) { res.status(400).send("Invalid Token"); }
});

// --- LEAVE ROUTES ---
app.post('/api/leaves', (req, res) => {
  const token = req.header('Authorization');
  if(!token) return res.status(401).json({message: "No token"});
  
  try {
    const verified = jwt.verify(token.split(" ")[1], 'secret123');
    const { leaveType, startDate, endDate, reason } = req.body;
    
    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      _id: Math.random().toString(36).substr(2, 9),
      userId: verified.id,
      leaveType, startDate, endDate, reason, totalDays,
      status: 'pending', createdAt: new Date()
    };
    leaves.push(newLeave);
    console.log("✅ Leave Applied:", leaveType);
    res.status(201).json(newLeave);
  } catch(e) { res.status(400).json({message: "Invalid Token"}); }
});

app.get('/api/leaves/my-requests', (req, res) => {
  const token = req.header('Authorization');
  if(!token) return res.json([]);
  const verified = jwt.verify(token.split(" ")[1], 'secret123');
  const myLeaves = leaves.filter(l => l.userId === verified.id);
  res.json(myLeaves);
});

app.get('/api/leaves/balance', (req, res) => {
  const token = req.header('Authorization');
  const verified = jwt.verify(token.split(" ")[1], 'secret123');
  const user = users.find(u => u._id === verified.id);
  res.json(user ? user.leaveBalance : {});
});

app.get('/api/leaves/all', (req, res) => {
  const populated = leaves.map(l => {
    const user = users.find(u => u._id === l.userId);
    return { ...l, userId: { name: user ? user.name : 'Unknown' } };
  });
  res.json(populated);
});

app.put('/api/leaves/:id/status', (req, res) => {
  const { status } = req.body;
  const leave = leaves.find(l => l._id === req.params.id);
  if(leave) {
     leave.status = status;
     if(status === 'approved') {
         const user = users.find(u => u._id === leave.userId);
         if(user) user.leaveBalance[leave.leaveType] -= leave.totalDays;
     }
  }
  res.json(leave);
});

app.listen(5000, () => console.log('✅ SERVER READY (No MongoDB Needed)'));