const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.cjs');
const ownerRoutes = require('./routes/ownerRoutes.cjs');
const agentRoutes = require('./routes/agentRoutes.cjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/agent', agentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});