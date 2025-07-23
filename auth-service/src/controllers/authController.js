const auth = require('../models/userModel');
import bcrypt from 'bycrptjs';


  const emailExist = await auth.findOne({ $or: [{email}]});
  if (emailExist.test(email)) {
    return res.status(409).json({ error: 'Email already exists.' });
  }

  const usernameExist = await auth.findOne({ $or: [{username}]});
  if (usernameExist.test(username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }


  const user = await User.create({ username, email, password, role });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h"
  });
  
  res.status(201).json({
    message: 'User registered successfully.',
    user: {
        username: user.username,
        role: user.role,
        email: user.email,
        role: user.role}, 
        token
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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User cannot found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Email or password is incorrect." });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};