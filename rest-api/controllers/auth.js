const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt'); 

/** Route to signup a new user */
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