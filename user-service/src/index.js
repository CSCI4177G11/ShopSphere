import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import vendorRoute from './routes/vendorRoutes.js';
import consumerRoute from './routes/consumerRoutes.js';
import publicVendorRoute from './routes/publicVendorRoutes.js';
import publicConsumerRoutes from './routes/publicConsumerRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import { vendorRatingScheduler } from './schedulers/vendorRatingScheduler.js';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();
const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/shopsphere';
const PORT = process.env.PORT || 4200;
const CORS_ORIGIN = (process.env.CORS_ORIGIN || '*').split(',');
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(morgan(NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/api/user/health', (req, res) => {
  const schedulerStatus = vendorRatingScheduler.getStatus();
  res.json({
    service: 'user',
    status: 'up',
    uptime_seconds: process.uptime().toFixed(2),
    checked_at: new Date().toISOString(),
    message: 'User service is operational.',
    scheduler: {
      status: schedulerStatus.isRunning ? 'running' : 'stopped',
      interval_minutes: schedulerStatus.intervalMinutes,
      next_run: schedulerStatus.stats.nextRun,
      total_runs: schedulerStatus.stats.totalRuns,
    }
  });
});

// Main routes
app.use('/api/user/consumer', consumerRoute);
app.use('/api/user/vendor', vendorRoute);
app.use('/api/user/consumers/public', publicConsumerRoutes);
app.use('/api/user/vendors/public', publicVendorRoute);
app.use('/api/user/admin', adminRoute);

// Error handlers
app.use((req, res, next) => {
  const err = new Error(`Not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => { 
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    
    if (NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`user-service running on port :${PORT}`);
        
        // Start the vendor rating scheduler after successful server start
        setTimeout(() => {
          try {
            const result = vendorRatingScheduler.start();
            if (result.success) {
              console.log('✅ Vendor rating scheduler started successfully (2-minute intervals)');
            } else {
              console.log('⚠️ Vendor rating scheduler:', result.message);
            }
          } catch (error) {
            console.error('❌ Failed to start vendor rating scheduler:', error);
          }
        }, 5000); // 5 second delay to ensure everything is initialized
      });
    }
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  try {
    vendorRatingScheduler.stop();
    await mongoose.connection.close();
    console.log('Shutdown complete');
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  try {
    vendorRatingScheduler.stop();
    await mongoose.connection.close();
    console.log('Shutdown complete');
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
  process.exit(0);
});

export default app;