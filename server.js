// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/dbconfig.js'
import usercontroller from './src/auth/controller/usercontroller.js'
import postrouter from './src/Posts/Routes/Postroutes.js'
import LikesRouter from './src/Likes/Routes/Routes.js' 


dotenv.config()

  
// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use('/api/auth', usercontroller)
app.use('/api/posts', postrouter);
app.use('/api/likes', LikesRouter);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
  connectDB()
  
});

console.log('yuhu ayush started it')