import { OrdersFact } from '../db/db.js';
import { Op, fn, col, literal } from 'sequelize';

function getVendorId(req) {
    return req.user.vendorId || req.user.sub || req.user.id;
}

export async function getSummary(req, res) {
    const where = { orderStatus: 'delivered' };
  
    if (!isAdmin(req)) {
      const vendorId = getVendorId(req);
      if (!vendorId) return res.status(400).json({ error: 'vendorId missing' });
      where.vendorId = vendorId;
    }
    const [result] = await OrdersFact.findAll({
      where,
      attributes: [
        [fn('SUM', col('subtotal')),             'totalRevenue'],
        [fn('COUNT', literal('DISTINCT orderId')),'totalOrders'],
        [fn('AVG', col('subtotal')),             'averageOrderValue'],
        [fn('MAX', col('loadTimestamp')),        'lastUpdated'],
      ],
      raw: true,
    });
    res.json({ result });
  }
  
  
  export async function getTopProducts(req, res) {
    const limit      = parseInt(req.query.limit || '5', 10);
    const startDate  = req.query.startDate || '1970-01-01';
    const endDate    = req.query.endDate   || new Date().toISOString().slice(0, 10);
  
    const where = {
      orderStatus: 'delivered',
      orderDate:   { [Op.between]: [startDate, endDate] },
    };
  
    if (!isAdmin(req)) {
      const vendorId = getVendorId(req);
      if (!vendorId) return res.status(400).json({ error: 'vendorId missing' });
      where.vendorId = vendorId;
    }
  
    const topProducts = await OrdersFact.findAll({
      where,
      attributes: [
        'productId',
        [fn('SUM', col('subtotal')), 'revenue'],
        [fn('SUM', col('quantity')), 'unitsSold'],
      ],
      group: ['productId'],
      order: [[literal('revenue'), 'DESC']],
      limit,
      raw: true,
    });
  
    res.json({ topProducts });
  }
  
  
  export async function getSalesTrend(req, res) {
    const interval   = req.query.interval === 'month' ? 'month' : 'day';
    const months     = parseInt(req.query.months || '6', 10);
  
    const end   = new Date();
    const start = new Date(end);
    start.setMonth(end.getMonth() - months);
  
    const startDate  = start.toISOString().slice(0, 10);
    const endDate    = end.toISOString().slice(0, 10);
    const dateFormat = interval === 'month' ? '%Y-%m' : '%Y-%m-%d';
  
    const where = {
      orderStatus: 'delivered',
      orderDate:   { [Op.between]: [startDate, endDate] },
    };
  
    if (!isAdmin(req)) {
      const vendorId = getVendorId(req);
      if (!vendorId) return res.status(400).json({ error: 'vendorId missing' });
      where.vendorId = vendorId;
    }
  
    const trend = await OrdersFact.findAll({
      where,
      attributes: [
        [fn('DATE_FORMAT', col('orderDate'), dateFormat), 'period'],
        [fn('SUM', col('subtotal')),                      'revenue'],
      ],
      group: ['period'],
      order: [[literal('period'), 'ASC']],
      raw: true,
    });
  
    res.json({ trend });
  }

export async function getTopProductsGlobal(req, res) {
    const limit      = parseInt(req.query.limit || '5', 10);
    const startDate  = req.query.startDate || '1970-01-01';
    const endDate    = req.query.endDate   || new Date().toISOString().slice(0, 10);
  
    try {
      const topProducts = await OrdersFact.findAll({
        where: {
          orderStatus: 'delivered',
          orderDate:   { [Op.between]: [startDate, endDate] },
        },
        attributes: [
          'productId',
          [fn('SUM', col('subtotal')), 'revenue'],
          [fn('SUM', col('quantity')), 'unitsSold'],
        ],
        group: ['productId'],
        order: [[literal('revenue'), 'DESC']],
        limit,
        raw: true,
      });
  
      res.json({ topProducts });
    } catch (err) {
      console.error('[getTopProductsGlobal] error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }