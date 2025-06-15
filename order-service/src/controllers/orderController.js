// src/controllers/orderController.js
import { validationResult } from 'express-validator';
import Order from '../models/order.js';

/* ───────────────────────── helpers ───────────────────────── */

function parsePagination({ page = 1, limit = 20 }) {
  return { page: +page, limit: +limit };
}

function parseDateFilter(dateFrom, dateTo) {
  const createdAt = {};
  if (dateFrom) createdAt.$gte = new Date(dateFrom);
  if (dateTo) createdAt.$lte = new Date(dateTo);
  return Object.keys(createdAt).length ? { createdAt } : {};
}

/* ───────────────────────── controllers ───────────────────────── */

export async function createOrder(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  const { paymentId, orderItems, shippingAddress } = req.body;

  if (req.user.userId !== req.body.consumerId && req.user.role !== 'admin') {
    // ConsumerId is inferred from token—block spoofing
    return res.status(403).json({ error: 'Forbidden' });
  }

  // If paymentId is provided, assume payment was successful
  if (!paymentId) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }

  // Calculate subtotal (simple sum)
  const subtotalAmount = orderItems.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0
  );

  // Assuming every item belongs to the same vendor (ShopSphere rule)
  const vendorId = orderItems[0].vendorId || req.body.vendorId;

  const order = await Order.create({
    consumerId: req.user.userId,
    vendorId,
    paymentId,
    subtotalAmount,
    orderItems,
    shippingAddress,
    orderStatus: 'pending',
    paymentStatus: 'succeeded',
    tracking: [{ status: 'pending' }],
  });

  return res.status(201).json({ message: 'Order created', orderId: order.id });
}

export async function listOrders(req, res) {
  const { page, limit } = parsePagination(req.query);
  const { orderStatus, dateFrom, dateTo } = req.query;

  const query = {};
  if (req.user.role === 'vendor') query.vendorId = req.user.userId;
  if (orderStatus) query.orderStatus = orderStatus;
  Object.assign(query, parseDateFilter(dateFrom, dateTo));

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return res.json({ page, limit, total, orders });
}

export async function listOrdersByUser(req, res) {
  const { userId } = req.params;
  if (req.user.role !== 'admin' && req.user.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { page, limit } = parsePagination(req.query);

  const total = await Order.countDocuments({ consumerId: userId });
  const orders = await Order.find({ consumerId: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return res.json({ page, limit, total, orders });
}

export async function getOrderById(req, res) {
  const { id } = req.params;
  const order = await Order.findById(id).lean();
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (
    req.user.role === 'consumer' &&
    order.consumerId !== req.user.userId
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (
    req.user.role === 'vendor' &&
    order.vendorId !== req.user.userId
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.json(order);
}

export async function updateOrderStatus(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  const { id } = req.params;
  const { orderStatus } = req.body;

  const allowedStatuses = [
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
  ];
  if (!allowedStatuses.includes(orderStatus))
    return res.status(400).json({ error: 'Invalid status transition' });

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (
    req.user.role === 'vendor' &&
    order.vendorId !== req.user.userId
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await Order.appendTracking(id, { status: orderStatus });
  return res.json({ message: 'Status updated', newStatus: orderStatus });
}

export async function cancelOrder(req, res) {
  const { id } = req.params;
  const { reason } = req.body || {};

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // Permission check
  if (req.user.role === 'consumer' && order.consumerId !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Disallow cancel if already shipped or delivered
  if (['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
    return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
  }

  await Order.appendTracking(id, { status: 'cancelled', note: reason });
  return res.status(200).json({ message: 'Order cancelled' });
}

export async function getOrderTracking(req, res) {
  const { id } = req.params;
  const order = await Order.findById(id, 'consumerId vendorId tracking').lean();
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (
    req.user.role === 'consumer' &&
    order.consumerId !== req.user.userId
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (
    req.user.role === 'vendor' &&
    order.vendorId !== req.user.userId
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.json({ orderId: id, tracking: order.tracking });
}
