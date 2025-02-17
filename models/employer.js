const mongoose = require('mongoose');
const employerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'employer' },
    password: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
  },
  { timestamps: true }
);
const Employer = mongoose.model('Employer', employerSchema);
module.exports = Employer;
