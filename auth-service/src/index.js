import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import route from '../routes/authRoutes.js';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', route);

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5001;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected");
    app.listen(PORT || 5001, () =>
      console.log(`Authentication is running on port ${PORT || 5001}`)
    );
  })
  .catch(err => console.error("Error:", err));
    
start();

export default app;