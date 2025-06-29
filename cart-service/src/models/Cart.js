import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ItemSchema = new Schema({
  productId: String,
  productName: String,
  price: Number,
  quantity: Number,
  addedAt: { type: Date, default: Date.now }
});

const CartSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  items: [ItemSchema]
});

export default model('Cart', CartSchema);