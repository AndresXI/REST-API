const express = require('express'); 
const bodyParser = require('body-parser'); 
const feedRoutes = require('./routes/feed'); 
const cors = require('cors'); 
const app = express(); 

/** Used to allow cross origin resource */
app.options('*', cors()); 
/** application/json, append data to our request that reaches our server */
app.use(bodyParser.json());  

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


app.listen(8080); 