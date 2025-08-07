import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { vendorRatingScheduler } from '../schedulers/vendorRatingScheduler.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(['admin']));

// Scheduler management endpoints
router.get('/scheduler/status', (req, res) => {
  try {
    const status = vendorRatingScheduler.getDetailedStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get scheduler status',
      details: error.message
    });
  }
});

router.post('/scheduler/start', (req, res) => {
  try {
    const result = vendorRatingScheduler.start();
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start scheduler',
      details: error.message
    });
  }
});

router.post('/scheduler/stop', (req, res) => {
  try {
    const result = vendorRatingScheduler.stop();
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to stop scheduler',
      details: error.message
    });
  }
});

router.post('/scheduler/restart', (req, res) => {
  try {
    const result = vendorRatingScheduler.restart();
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to restart scheduler',
      details: error.message
    });
  }
});

router.put('/scheduler/interval',
  [
    body('minutes')
      .isInt({ min: 1, max: 1440 })
      .withMessage('Interval must be between 1 and 1440 minutes (24 hours)')
  ],
  (req, res) => {
    try {
      const { minutes } = req.body;
      const result = vendorRatingScheduler.setInterval(minutes);
      res.json({
        success: result.success,
        message: result.message,
        newInterval: minutes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to set scheduler interval',
        details: error.message
      });
    }
  }
);

// Manual vendor rating updates
router.post('/vendors/update-ratings', 
  [
    body('vendorIds')
      .optional()
      .isArray()
      .withMessage('vendorIds must be an array if provided')
  ],
  async (req, res) => {
    try {
      const { vendorIds } = req.body;
      
      if (vendorIds && Array.isArray(vendorIds) && vendorIds.length > 0) {
        const results = await vendorRatingScheduler.updateSpecificVendors(vendorIds);
        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;
        
        res.json({
          success: true,
          message: `Manual rating update completed for ${vendorIds.length} vendors`,
          results: {
            total: vendorIds.length,
            successful: successCount,
            failed: errorCount,
            details: results
          }
        });
      } else {
        // Update all vendors
        await vendorRatingScheduler.updateAllVendorRatings();
        res.json({
          success: true,
          message: 'Manual rating update triggered for all vendors',
          note: 'Check the logs for detailed results'
        });
      }
    } catch (error) {
      console.error('Manual rating update failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update ratings',
        details: error.message
      });
    }
  }
);

// Get scheduler statistics
router.get('/scheduler/stats', (req, res) => {
  try {
    const status = vendorRatingScheduler.getStatus();
    res.json({
      success: true,
      stats: status.stats,
      isRunning: status.isRunning,
      intervalMinutes: status.intervalMinutes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get scheduler stats',
      details: error.message
    });
  }
});

export default router;