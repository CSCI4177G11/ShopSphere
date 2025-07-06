import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: Date.now() }));

app.get('/', (req, res) => {
  res.send('Welcome to the Cart Service!');
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/shopsphere')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Cart service running on port ${PORT}`));
