require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });
  


mongoose.set('debug', true); 
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


// Import routes
const scheduleRoutes = require('./routes/scheduleRoutes');
const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes');
const fantasyRoutes = require('./routes/fantasyRoutes');
const homeRoutes = require('./routes/homeRoutes');


// Use routes
app.use('/api/schedule', scheduleRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fantasy/teams', fantasyRoutes);
app.use('/api/home', homeRoutes);
 

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
