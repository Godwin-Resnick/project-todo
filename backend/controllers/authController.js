const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      username,
      password: hashedPassword
    });

    // Save the user
    await user.save();
    res.status(201).json({ message: 'User registered succsessfully'});

  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }

};

// User login
exports.login = async (req, res) => {
  const { username, password} = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: `${error.message}`});
  }
};