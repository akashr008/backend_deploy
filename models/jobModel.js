const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companylogo:{ type: String, required: true },
  companyname: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: Number, required: true },
  requirements: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;



