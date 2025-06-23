// src/index.js
// ────────────────────────────────────────────────────────────
// Payment-service entry point for ShopSphere
// ------------------------------------------------------------

import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Stripe from 'stripe';

import apiRouter from './routes/index.js';      

dotenv.config();

const {
  PORT           = 4004,
  NODE_ENV       = 'development',
  MONGO_URI,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} = process.env;

if (!STRIPE_SECRET_KEY) {
  console.error('❌  STRIPE_SECRET_KEY missing – aborting start-up.');
  process.exit(1);
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

const app = express();

app.use(cors());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));


app.post(
  '/api/payment/webhook/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('⚡️  Stripe signature verification failed:', err.message);
      return res.status(400).json({ error: `Invalid signature: ${err.message}` });
    }

    console.log('🔔  Stripe event received:', event.type);
    return res.json({ received: true });
  },
);

app.use(express.json({ limit: '10kb' }));

app.use('/api/payment', apiRouter); 

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error('🔥  Uncaught error:', err);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

(async () => {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('💾  MongoDB connected');
    } else {
      console.warn('⚠️  MONGO_URI not set – skipping DB connection (ephemeral only)');
    }

    app.listen(PORT, () =>
      console.log(`🚀  payment-service running on port ${PORT} (${NODE_ENV})`),
    );
  } catch (err) {
    console.error('❌  Failed to initialise payment-service:', err);
    process.exit(1);
  }
})();
