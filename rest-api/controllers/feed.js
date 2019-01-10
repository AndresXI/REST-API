const { validationResult } = require('express-validator/check'); 
const Post = require('../models/post'); 
const fs = require('fs');
const path = require('path'); 

/** Helper function to delete images  */
const clearImage = (filePath) => {
  // construct file path to image
  filePath = path.join(__dirname, '..', filePath); 
  // Delete image
  fs.unlink(filePath, err => console.log(err)); 
}; 

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

/** Controller action to edit post */
exports.updatePost = (req, res, next) => {
  // extract id form the request url 
  const postId = req.params.postId; 
  const errors = validationResult(req);
  // Return a response if validation fails 
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, input data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title; 
  const content = req.body.content; 
  // Keep the existing image url if no file was uploaded 
  let imageUrl = req.body.image; 
  // If there is a file upload set the imageUrl accordingly 
  if (req.file) {
    imageUrl = req.file.path; 
  }
  if (!imageUrl) {
    const error = new Error('No file picked, please make sure to upload a file'); 
    error.statusCode = 422; 
    throw error; 
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error; 
      }
      // Delete old image if url path is not the same
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl); 
      }
      // Update post fields with extracted data 
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();  
    })
    .then(result => {
      res.status(200).json({ message: 'POST UPDATED SUCCESSFULLY!', post: result }); 
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); 
    });
}; 

/** Route to delete post */
exports.deletePost = (req, res, next) => {
  // extract post id from request params
  const postId = req.params.postId; 
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      // check if the creator is the currently logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId); 
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'POST DELETED SUCCESSFULLY!' });
    })
    .catch(err => {

    });
}

