const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employer = require('../models/employer');
const Jobseeker = require('../models/jobseeker');
const Admin = require('../models/Admin');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);
const isValidMobileNumber = (mobileNumber) => /^[0-9]{10}$/.test(mobileNumber);
const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail.com$/.test(email);
const isValidRole = (role) => ['employer', 'jobseeker'].includes(role);

router.post('/jobseeker-register', async (req, res) => {
  const { email, password, name, mobileNumber, skills, resume, bio } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!isValidName(name)) {
    return res.status(400).json({ error: 'Name should only contain alphabets' });
  }
  if (!isValidMobileNumber(mobileNumber)) {
    return res.status(400).json({ error: 'Mobile number should be 10 digits' });
  }

  try {
    const existingUserByEmail = await Jobseeker.findOne({ email }) || await Employer.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const existingUserByMobile = await Jobseeker.findOne({ mobileNumber }) || await Employer.findOne({ mobileNumber });
    if (existingUserByMobile) {
      return res.status(400).json({ error: 'Mobile number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newJobseeker = new Jobseeker({
      email,
      password: hashedPassword,
      name,
      mobileNumber,
      role: 'jobseeker',
      skills,
      resume,
      bio,
    });
    await newJobseeker.save();

    const token = jwt.sign({ email: newJobseeker.email, role: 'jobseeker' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ message: 'Jobseeker registered successfully', token });
  } catch (err) {
    console.error('Error in Register:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/admin/approve-employer', async (req, res) => {
  const { employerId, action } = req.body;

  if (!employerId || !action) {
    return res.status(400).json({ error: 'Employer ID and action are required' });
  }

  if (!['approve', 'reject'].includes(action)) {  
    return res.status(400).json({ error: 'Action must be either "approve" or "reject"' }); 
  }

  try {
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    if (employer.status !== 'pending' && employer.status !== 'approved') {
      return res.status(400).json({ error: 'Employer cannot be modified from its current state' });
    }

    if (action === 'approve') {
      employer.status = 'approved';
    } else if (action === 'reject') {
      employer.status = 'rejected';
    }

    await employer.save();

    res.status(200).json({ message: `Employer has been ${action}d` });
  } catch (err) {
    console.error('Error in Admin Approval:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/admin/all-employers', async (req, res) => {
  try {
    const employers = await Employer.find(); 
    res.status(200).json(employers);
  } catch (err) {
    console.error('Error fetching all employers:', err);
    res.status(500).json({ error: 'Failed to fetch all employers' });
  }
});

router.post('/employer-register', async (req, res) => {
  const { name, companyName, contactNumber, email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }
  if (!isValidMobileNumber(contactNumber)) {
    return res.status(400).json({ error: 'Contact number should be 10 digits' });
  }

  try {

    const existingUserByEmail = await Jobseeker.findOne({ email }) || await Employer.findOne({ email }) || await Admin.findOne({email})
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const existingUserByMobile = await Jobseeker.findOne({ mobileNumber: contactNumber }) || await Employer.findOne({ contactNumber });
    if (existingUserByMobile) {
      return res.status(400).json({ error: 'Contact number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployer = new Employer({
      name,
      companyName,
      contactNumber,
      email,
      role: 'employer',
      status: 'pending',
      password: hashedPassword,
    });
    await newEmployer.save();

    res.status(201).json({ message: 'Employer registered successfully. Awaiting admin approval.' });
  } catch (err) {
    console.error('Error in Register:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    let user = await Jobseeker.findOne({ email });
    if (!user) {
      user = await Employer.findOne({ email }) || await Admin.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
    }

    if (user.role === 'employer' && user.status !== 'approved') {
      return res.status(400).json({ error: 'Employer not approved yet' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      role: user.role, 
      jobseekerId: user._id 
    });
  } catch (err) {
    console.error('Error in Login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
