const express = require('express');
const Job = require('../models/jobModel');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const {companyname, title, description, salary, requirements, location,companylogo } = req.body;
    const newJob = new Job({ companyname,title, description, salary, requirements, location,companylogo });
    await newJob.save();
    res.json({ message: 'Job added successfully!' });
  } catch (err) {
    console.error('Error adding job:', err);
    res.status(500).json({ message: 'Error adding job' });
  } 
});

router.put('/update/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job updated successfully!' });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ message: 'Error updating job' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully!' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ message: 'Error deleting job' });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

router.get('/jobs/:jobId', (req, res) => {
  const { jobId } = req.params; // Extract jobId from the URL
  
  Job.findById(jobId)
    .then(job => {
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json(job); 
    })
    .catch(err => {
      console.error('Error fetching job details:', err);
      res.status(500).json({ message: 'Server error' });
    });
  });

module.exports = router;





