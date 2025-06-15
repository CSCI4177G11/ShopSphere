import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/* ───────── helper sub‑schemas ───────── */

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    quantity:  { type: Number, required: true, min: 1 },
    price:     { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    line1:       { type: String, required: true },
    line2:       { type: String },
    city:        { type: String, required: true },
    province:    { type: String },
    postalCode:  { type: String, required: true },
    country:     { type: String, required: true, maxlength: 2 }, // ISO 3166‑1 alpha‑2
  },
  { _id: false }
);

const trackingEventSchema = new Schema(
  {
    status:         { type: String, required: true },
    timestamp:      { type: Date,   default: Date.now },
    carrier:        { type: String },
    trackingNumber: { type: String },
  },
  { _id: false }
);

/* ───────── main Order schema ───────── */

const orderSchema = new Schema(
  {
    consumerId:     { type: String, required: true, index: true },
    vendorId:       { type: String, required: true, index: true },

    paymentId:      { type: String, required: true },
    paymentStatus:  {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'succeeded',
    },

    orderStatus: {
      type: String,
      enum: [
        'pending',          // awaiting vendor acceptance
        'processing',       // vendor preparing
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },

    subtotalAmount: { type: Number, required: true, min: 0 },

    orderItems:      { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },

    tracking: { type: [trackingEventSchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

/* ───────── virtuals & helpers ───────── */

// Expose _id as orderId in JSON responses
orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.orderId = ret._id;
    delete ret._id;
  },
});

/**
 * Append a tracking event and update the orderStatus
 *   await Order.appendTracking(orderId, { status: 'shipped', carrier: 'UPS' });
 */
orderSchema.statics.appendTracking = async function (orderId, event) {
  await this.findByIdAndUpdate(orderId, {
    $push: { tracking: event },
    orderStatus: event.status,
  });
};

export default model('Order', orderSchema);
