const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobseeker', required: true },
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  resume:{ type: String, required: true },
  
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  appliedAt: { type: Date, default: Date.now },
 
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;


