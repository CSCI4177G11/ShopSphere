// src/schedulers/vendorRatingScheduler.js
import cron from 'node-cron';
import Vendor from '../models/vendorModel.js';
import { updateVendorRating } from '../controllers/vendorController.js';
import { invalidatePattern } from '../utils/redisClient.js';

class VendorRatingScheduler {
  constructor() {
    this.isRunning = false;
    this.job = null;
    this.intervalMinutes = 2; // Default to 2 minutes
    this.currentCronExpression = '*/2 * * * *'; // Every 2 minutes
    this.stats = {
      lastRun: null,
      nextRun: null,
      totalRuns: 0,
      lastRunStats: null,
    };
  }

  /**
   * Generate cron expression from minutes
   */
  getCronExpression(minutes) {
    if (minutes < 60) {
      return `*/${minutes} * * * *`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `0 */${hours} * * *`;
      } else {
        // For complex intervals, fallback to minute-based
        return `*/${minutes} * * * *`;
      }
    }
  }

  /**
   * Start the vendor rating update scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('Vendor rating scheduler is already running');
      return { success: false, message: 'Scheduler is already running' };
    }

    console.log(`Starting vendor rating update scheduler (every ${this.intervalMinutes} minutes)...`);
    
    this.job = cron.schedule(this.currentCronExpression, async () => {
      await this.updateAllVendorRatings();
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'America/Toronto'
    });

    this.job.start();
    this.isRunning = true;
    this.updateStats();
    
    // Run once immediately after 10 seconds
    setTimeout(() => {
      this.updateAllVendorRatings();
    }, 10000);

    return { success: true, message: `Scheduler started with ${this.intervalMinutes} minute interval` };
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
      this.stats.nextRun = null;
      console.log('Vendor rating scheduler stopped');
      return { success: true, message: 'Scheduler stopped successfully' };
    }
    return { success: false, message: 'Scheduler was not running' };
  }

  /**
   * Restart the scheduler (useful when changing interval)
   */
  restart() {
    this.stop();
    setTimeout(() => {
      this.start();
    }, 1000);
    return { success: true, message: 'Scheduler restarted' };
  }

  /**
   * Change the interval and restart if running
   */
  setInterval(minutes) {
    if (minutes < 1 || minutes > 1440) { // 1 minute to 24 hours
      return { success: false, message: 'Interval must be between 1 and 1440 minutes' };
    }

    const wasRunning = this.isRunning;
    this.intervalMinutes = minutes;
    this.currentCronExpression = this.getCronExpression(minutes);

    if (wasRunning) {
      this.restart();
      return { success: true, message: `Interval updated to ${minutes} minutes and scheduler restarted` };
    } else {
      return { success: true, message: `Interval updated to ${minutes} minutes. Start scheduler to apply changes.` };
    }
  }

  /**
   * Update internal stats
   */
  updateStats() {
    if (this.job && this.isRunning) {
      try {
        this.stats.nextRun = this.job.nextDate()?.toISOString() || null;
      } catch (error) {
        this.stats.nextRun = null;
      }
    }
  }

  /**
   * Update ratings for all vendors
   */
  async updateAllVendorRatings() {
    const startTime = Date.now();
    const runId = this.stats.totalRuns + 1;
    
    console.log(`[${new Date().toISOString()}] Starting vendor rating update job #${runId}...`);
    
    try {
      // Get all vendors
      const vendors = await Vendor.find({}, 'vendorId').lean();
      console.log(`Found ${vendors.length} vendors to update`);
      
      let successCount = 0;
      let errorCount = 0;
      let skippedCount = 0;
      
      // Process vendors in batches to avoid overwhelming the system
      const batchSize = 10;
      for (let i = 0; i < vendors.length; i += batchSize) {
        const batch = vendors.slice(i, i + batchSize);
        
        // Process batch in parallel
        const promises = batch.map(async (vendor) => {
          try {
            const result = await updateVendorRating(vendor.vendorId);
            if (result !== null) {
              successCount++;
            } else {
              skippedCount++;
            }
          } catch (error) {
            console.error(`Failed to update rating for vendor ${vendor.vendorId}:`, error.message);
            errorCount++;
          }
        });
        
        await Promise.all(promises);
        
        // Small delay between batches to prevent overwhelming the product service
        if (i + batchSize < vendors.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Invalidate vendor list caches after bulk updates
      try {
        await invalidatePattern('vendors:list:*');
        console.log('Invalidated vendor list caches');
      } catch (cacheError) {
        console.warn('Failed to invalidate vendor caches:', cacheError.message);
      }
      
      const duration = Date.now() - startTime;
      const runStats = {
        runId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration,
        processedVendors: vendors.length,
        successful: successCount,
        errors: errorCount,
        skipped: skippedCount,
      };

      this.stats.lastRun = new Date().toISOString();
      this.stats.totalRuns = runId;
      this.stats.lastRunStats = runStats;
      this.updateStats();
      
      console.log(`[${new Date().toISOString()}] Vendor rating update #${runId} completed:`);
      console.log(`  - Processed: ${vendors.length} vendors`);
      console.log(`  - Successful: ${successCount}`);
      console.log(`  - Errors: ${errorCount}`);
      console.log(`  - Skipped: ${skippedCount}`);
      console.log(`  - Duration: ${duration}ms`);
      
    } catch (error) {
      console.error('Vendor rating update job failed:', error);
      this.stats.lastRunStats = {
        runId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  /**
   * Update ratings for specific vendors only
   */
  async updateSpecificVendors(vendorIds) {
    console.log(`Updating ratings for specific vendors: ${vendorIds.join(', ')}`);
    
    const results = [];
    const promises = vendorIds.map(async (vendorId) => {
      try {
        const result = await updateVendorRating(vendorId);
        console.log(`Updated rating for vendor ${vendorId}: ${result}`);
        results.push({ vendorId, success: true, rating: result });
      } catch (error) {
        console.error(`Failed to update rating for vendor ${vendorId}:`, error.message);
        results.push({ vendorId, success: false, error: error.message });
      }
    });
    
    await Promise.all(promises);
    
    // Invalidate caches
    try {
      await invalidatePattern('vendors:list:*');
    } catch (cacheError) {
      console.warn('Failed to invalidate vendor caches:', cacheError.message);
    }
    
    return results;
  }

  /**
   * Get scheduler status and statistics
   */
  getStatus() {
    this.updateStats();
    return {
      isRunning: this.isRunning,
      intervalMinutes: this.intervalMinutes,
      cronExpression: this.currentCronExpression,
      stats: this.stats,
    };
  }

  /**
   * Get detailed scheduler information
   */
  getDetailedStatus() {
    this.updateStats();
    return {
      isRunning: this.isRunning,
      intervalMinutes: this.intervalMinutes,
      cronExpression: this.currentCronExpression,
      timezone: process.env.TIMEZONE || 'America/Toronto',
      stats: this.stats,
      uptime: this.isRunning ? Date.now() - (this.stats.totalRuns > 0 ? new Date(this.stats.lastRun).getTime() : Date.now()) : 0,
    };
  }
}

// Export singleton instance
export const vendorRatingScheduler = new VendorRatingScheduler();