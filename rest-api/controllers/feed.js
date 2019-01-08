const { validationResult } = require('express-validator/check'); 

/** route to get a post */
exports.getPosts = (req, res, next) => {
  /** Return a JSON response */
  res.status(200).json({
    posts: [{
      _id: '1',
      title: 'First Post', 
      content: 'This is the first post!',
      imageUrl: 'images/pizza.jpg', 
      creator: {
        name: 'Andres'
      }, 
      createdAt: new Date()
    }]
  }); 
}; 

/** Route to post data  */
exports.createPost = (req, res, next) => {
  const errors = validationResult(req); 
  // Return a response if validation fails 
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, input data is incorrect', 
      errors: errors.array()
    }); 
  }
  const title = req.body.title;
  const content = req.body.content; 
  // Create post in database
  res.status(201).json({
    message: 'Post created successfully', 
    post: {
      _id: new Date().toISOString(),
      title: title, 
      content: content,
      creator: { name: 'Maximilian' },
      createdAt: new Date()
    }
  }); 
}; 

