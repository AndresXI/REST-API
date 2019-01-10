const express = require("express"); 
const feedController = require('../controllers/feed'); 
const { body } = require('express-validator/check'); 

const router = express.Router(); 

/** GET: /feed/posts */
router.get('/posts', feedController.getPosts); 

/** POST: /feed/post */
router.post('/post', [
  body('title').trim().isLength({min: 5}),
  body('content').trim().isLength({min: 5})
], feedController.createPost); 

/** Route to view a single post */
router.get('/post/:postId', feedController.getPost); 

/** Route to edit posts */
router.put('/post/:postId', [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 })
], feedController.updatePost); 

/** Route to delete posts */
router.delete('/post/:postId', feedController.deletePost); 

module.exports = router; 