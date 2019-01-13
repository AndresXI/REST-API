const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

/** Controller action to signup a new user */
exports.signup = async (req, res, next) => {
  // Collect errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  // extract user data 
  const email = req.body.email; 
  const name = req.body.name; 
  const password = req.body.password; 
  try {
    // store user in database by first hashing the password
    const hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email: email,
      password: hashedPw,
      name: name
    });
    const result = await user.save();
    // Return created user to the client
    res.status(201).json({ message: 'USER CREATED SUCCESSFULLY!', userId: userObj._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); 
  }
}; 

/** Controller action to authenticate user */
exports.login = async (req, res, next) => {
  const email = req.body.email; 
  const password = req.body.password;
  let loadedUser;
  // Check if email address already exists
  try {
    const user = User.findOne({ email: email })
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    // Check for matching passwords
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    // generate a new token
    const token = jwt.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    }, 'secretkey', { expiresIn: '1h' });
    // return response with token and ID
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); 
  }
};

/** Controller to display status */
exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    };
    // Return the user status
    res.status(200).json({ status: user.status })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); 
  } 
}; 

/** Controller to edit user status */
exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: 'USER STATUS UPDATED' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); 
  }
}