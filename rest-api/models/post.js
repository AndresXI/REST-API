const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

/** Schema for a post */
const postSchema = new Schema({
  title: {
    type: String, 
    required: true
  }, 
  imageUrl: {
    type: String, 
    required: true
  }, 
  content: {
    type: String, 
    required: true
  }, 
  creator: {
    // Connect posts to users
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, {timestamps: true}); 

module.exports = mongoose.model('Post', postSchema); 