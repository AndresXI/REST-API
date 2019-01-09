const { validationResult } = require('express-validator/check'); 
const Post = require('../models/post'); 


/** Route to fetch all posts from database */
exports.getPosts = (req, res, next) => {
  // Find all posts from database
  Post.find()
    .then(posts => {
      res.status(200).json({message: 'Fetched posts successfully', posts: posts}); 
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); 
    }); 
}; 

/** Route to store post in database */
exports.createPost = (req, res, next) => {
  const errors = validationResult(req); 
  // Return a response if validation fails 
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, input data is incorrect");
    error.statusCode = 422;
    throw error; 
  }
  // Check for a valid file upload
  if (!req.file) {
    const error = new Error('No image provided'); 
    error.statusCode = 422; 
    throw error; 
  }
  // set path of our image in our server to the const 'imageUrl'
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content; 
  // Create post in database 
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Maximilian' }
  }); 
  // Save post in database
  post.save()
    .then(result => {
      console.log(result); 
      console.log('CREATED POST SUCCESSFULLY')
      // Send response to client 
      res.status(201).json({
        message: 'Post created successfully',
        post: result
      }); 
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500; 
      }
      next(err); 
    }); 
}; 

/** Controller action to view a single post */
exports.getPost = (req, res, next) => {
  // extract post id from request
  const postId = req.params.postId; 
  // find post by id 
  Post.findById(postId)
    .then(post => {
      console.log(post); 
      // If post not found return error message
      if (!post) {
        const error = new Error('Could not find post'); 
        error.statusCode = 404; 
        throw error; 
      }
      // return success message and post Json object
      res.status(200).json({message: 'Post fetched successfully', post: post}); 
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); 
    }); 
}; 

