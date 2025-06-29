import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Cart service running on port ${PORT}`));
