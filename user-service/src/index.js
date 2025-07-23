import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import vendorRoute from './routes/vendorRoutes.js';
import consumerRoute from './routes/consumerRoutes.js';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/user', consumerRoute);
app.use('/api/user', vendorRoute);

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected");
    app.listen(PORT || 5002, () =>
      console.log(`User is running on port ${PORT}`)
    );
  })
  .catch(err => console.error("Error:", err));

export default app;