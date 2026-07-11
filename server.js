const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'mywebsite')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://fredsamuel949_db_user:sammy123@sammy.gawuoku.mongodb.net/?appName=sammy')
.then(() => console.log('Database connected!'))
.catch(err => console.log('Database error:', err));

// User Model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  balance: { type: Number, default: 0 }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'EliteBet server is running!', status: 'success' });
});

// Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ status: 'error', message: 'All fields required!' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ status: 'error', message: 'Email already exists!' });
    }
    const user = new User({ name, email, password, balance: 0 });
    await user.save();
    res.json({ status: 'success', message: 'Account created successfully!' });
  } catch (err) {
    res.json({ status: 'error', message: 'Something went wrong!' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ status: 'error', message: 'All fields required!' });
  }
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.json({ status: 'error', message: 'Invalid email or password!' });
    }
    res.json({ status: 'success', message: 'Login successful!', user: { name: user.name, balance: user.balance } });
  } catch (err) {
    res.json({ status: 'error', message: 'Something went wrong!' });
  }
});

app.listen(3000, () => {
  console.log('EliteBet server running on port 3000');
});
