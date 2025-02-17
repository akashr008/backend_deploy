const express = require('express');
const jwt = require('jsonwebtoken');
const Jobseeker = require('../models/jobseeker');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');

router.get('/profile', authenticate, async (req, res) => {
  try {
    const jobseeker = await Jobseeker.findOne({ email: req.jobseekerId }).select('name mobileNumber email bio skills resume role');

    if (!jobseeker) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(jobseeker); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, mobileNumber, email, bio, skills,resume } = req.body;

    const jobseeker = await Jobseeker.findOne({ email: req.jobseekerId });

    if (!jobseeker) {
      return res.status(404).json({ message: 'User not found' });
    }

jobseeker.name = name || jobseeker.name;
jobseeker.mobileNumber = mobileNumber || jobseeker.mobileNumber;
jobseeker.bio = bio || jobseeker.bio;
jobseeker.skills = skills || jobseeker.skills;
jobseeker.email = email || jobseeker.email;
jobseeker.resume = resume || jobseeker.resume;

    await jobseeker.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;