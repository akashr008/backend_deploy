const mongoose = require('mongoose');

const jobseekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String,enum: ['jobseeker'],required: true},
  skills: [{ type: String }],
  resume: { type: String }, 
  bio: { type: String, required: false }, 
  timestamps: { type: Date, default: Date.now }
});

const Jobseeker = mongoose.model('Jobseeker', jobseekerSchema);
module.exports = Jobseeker;







