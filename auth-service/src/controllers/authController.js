const auth = require('../models/userModel');
import bcrypt from 'bycrptjs';
import { createToken } from '../utils/token.js';


  const emailExist = await auth.findOne({ $or: [{email}]});
  if (emailExist.test(email)) {
    return res.status(409).json({ error: 'Email already exists.' });
  }

  const usernameExist = await auth.findOne({ $or: [{username}]});
  if (usernameExist.test(username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }


  const user = await User.create({ username, email, password, role });
  
  res.status(201).json({
    message: 'User registered successfully.',
    user: {
        username: user.username,
        role: user.role,
        email: user.email,
        role: user.role}
  });

  
  const registerEmail = async (request, res) => {
  const {email} = request.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
}

  const registerPassword = async (request, res) => {
  const {password} = request.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }
}

  const registerUsername = async (request, res) => {
  const {username} = request.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }
};