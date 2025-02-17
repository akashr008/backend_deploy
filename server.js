const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRouters');
const jobRoutes = require('./routes/jobRouters');
const profileRouters = require('./routes/profileRouters')
const applicationRoutes = require('./routes/JobApplications')


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));


app.use('/api', authRoutes);
app.use('/api', jobRoutes);
app.use('/api', authRoutes);
app.use('/api',profileRouters);
app.use('/api',applicationRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



