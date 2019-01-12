const express = require('express'); 
const path = require('path'); 
const bodyParser = require('body-parser'); 
const multer = require('multer'); 
const feedRoutes = require('./routes/feed'); 
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose'); 
const dotEnv = require('dotenv').config();
const cors = require('cors'); 

const app = express(); 

/** Configure multer for file uploads */
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/** Used to allow cross origin resource */
app.options('*', cors()); 
/** application/json, append data to our request that reaches our server */
app.use(bodyParser.json());  
/** Use multer */
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
// Serve our images statically 
app.use('/images', express.static(path.join(__dirname, 'images'))); 

/** set headers to any response (does not send it) */
app.use((req, res, next) => {
  // Wildcard for all resources
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Tell the client which methods are allowed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); 
  // Header our client can set on their request
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization'); 
  // Continue with the next request
  next(); 
}); 

/** Register feed routes */
app.use('/feed', feedRoutes); 
/** Register authentication routes */
app.use('/auth', authRoutes); 
/** Middleware to handle errors 
  execute whenever an error is thrown */
app.use((error, req, res, next) => {
  console.log(error); 
  const status = error.statusCode || 500; 
  const message = error.message; 
  const data = error.data;
  res.status(status).json({message: message, data: data}); 
}); 

/** Establish connection with mongoose */
mongoose.connect(process.env.DB_URL)
  .then(result => {
    console.log(`Connected to database successfully, listening on port: ${process.env.PORT}. Happy Coding!.`)
    app.listen(process.env.PORT); 
  })
  .catch(err => console.log(err)); 