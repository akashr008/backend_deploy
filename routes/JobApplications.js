const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/jobModel')
const Jobseeker =require('../models/jobseeker') 

router.post('/apply', (req, res) => {
  const { jobId, jobSeekerId, name, mobileNumber, email, resume } = req.body;

  Application.findOne({ jobId, jobSeekerId })
    .then(existingApplication => {
      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this job.' });
      }

      const newApplication = new Application({
        jobId,
        jobSeekerId,
        name,
        mobileNumber,
        email,
        resume,
      });

      newApplication.save()
        .then(application => {
          res.status(201).json({ message: 'Successfully applied for the job!', application });
        })
        .catch(error => {
          res.status(500).json({ error: 'Failed to apply for the job', details: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: 'Error checking application status', details: error });
    });
});

router.get('/applications', (req, res) => {
    Application.find()
      .populate('jobId','title salary location') 
      .then(applications => {
        res.status(200).json(applications); 
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to fetch applicants', details: error });
      });
});

router.put('/applications/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  Application.findByIdAndUpdate(id, { status }, { new: true })
    .then(updatedApplication => {
      if (!updatedApplication) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.status(200).json({ message: 'Application status updated', application: updatedApplication });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update application status', details: error });
    });
});


router.get('/applications/:jobSeekerId', (req, res) => {
  const { jobSeekerId } = req.params;

  Jobseeker.findById(jobSeekerId)
    .then(jobseeker => {
      if (!jobseeker) {
        return res.status(404).json({ error: 'Jobseeker not found' });
      }
      Application.find({ jobSeekerId })
        .populate('jobId', 'title salary location companyname')
        .then(applications => {
          res.status(200).json(applications); 
        })
        .catch(error => {
          res.status(500).json({ error: 'Failed to fetch applications', details: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to find jobseeker', details: error });
    });
});


router.get('/jobseekers', (req, res) => {
  Jobseeker.find()
    .then(jobseekers => {
      res.status(200).json(jobseekers); 
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch jobseekers', details: error });
    });
});



module.exports = router;