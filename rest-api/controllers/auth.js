const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

/** Controller action to signup a new user */
exports.signup = (req, res, next) => {
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
  // store user in database by first hashing the password
  bcrypt.hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(userObj => {
      // Return created user to the client
      res.status(201).json({ message: 'USER CREATED SUCCESSFULLY!', userId: userObj._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); 
    });
}; 

/** Controller action to authenticate user */
exports.login = (req, res, next) => {
  const email = req.body.email; 
  const password = req.body.password;
  let loadedUser;
  // Check if email address already exists
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      // Check for matching passwords
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
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
      res.status(200).json({token: token, userId: loadedUser._id.toString()})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); 
    });
};

/** Controller to display status */
exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      };
      // Return the user status
      res.status(200).json({ status: user.status })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); 
    }); 
}; 

/** Controller to edit user status */
exports.updateUserStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'USER STATUS UPDATED' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); 
    })
}