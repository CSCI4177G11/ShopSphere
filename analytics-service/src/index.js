import express from 'express';
import helmet from 'helmet';
import sequelize from './db/db.js';
import { syncOrders, scheduleSyncJob } from './jobs/syncOrders.js';
import analyticsRouter from './routes/analyticsRoutes.js';
import cors from 'cors';


const PORT = process.env.PORT || 4700;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json());

app.use('/api/analytics', analyticsRouter);

(async () => {
    try {
        await sequelize.sync();
        console.log('✅ MySQL schema synced');
        syncOrders();
        scheduleSyncJob();
        app.listen(PORT, () => {
            console.log(`⚡ analytics-service listening on http://localhost:${PORT}/analytics`);
        });
    } catch (err) {
        console.error('❌ Failed to start analytics-service:', err);
        process.exit(1);
    }
})();
