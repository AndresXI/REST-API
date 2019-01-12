const express = require('express');
const router = express.Router();
const { body } = require("express-validator/check"); 
const User = require('../models/user');
const authController = require('../controllers/auth');

/** Route to signup a user */
router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      // reject promise if user already exists
      return User.findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-mail address already exits!'); 
          }
        });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('name')
    .trim()
    .not()
    .isEmpty()    
], authController.signup); 

/** Route to authenticate a user */
router.post('/login', );

module.exports = router; 