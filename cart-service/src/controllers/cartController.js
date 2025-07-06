import Cart from '../models/Cart.js';


function resolveUserId(req) {
  return req?.user?.userId || req?.user?.id || null;
}

function requireUserId(req, res) {
  const userId = resolveUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  return userId;
}

export const getCart = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  try {
    const cart = await Cart.findOne({ userId });
    res.json(cart || { userId, items: [] });
  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ error: 'Server error while fetching cart' });
  }
};

export const addToCart = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const { productId, productName, price, quantity = 1 } = req.body;
  if (!productId || !productName || !price || quantity < 1) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existing = cart.items.find((i) => i.productId === productId);
    existing ? (existing.quantity += quantity)
             : cart.items.push({ productId, productName, price, quantity });

    await cart.save();
    res.status(201).json({ message: 'Product added', cart });
  } catch (err) {
    console.error('addToCart error:', err);
    res.status(500).json({ error: 'Server error while adding item' });
  }
};

export const updateCart = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be ≥ 1' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find((i) => i.productId === itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.quantity = quantity;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    console.error('updateCart error:', err);
    res.status(500).json({ error: 'Server error while updating cart' });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.productId !== itemId);
    await cart.save();
    res.json({ message: 'Item removed', cart });
  } catch (err) {
    console.error('removeFromCart error:', err);
    res.status(500).json({ error: 'Server error while removing item' });
  }
};

export const clearCart = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    console.error('clearCart error:', err);
    res.status(500).json({ error: 'Server error while clearing cart' });
  }
};

export const getCartTotals = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const totals = cart.items.reduce(
      (acc, i) => {
        acc.totalItems += i.quantity;
        acc.totalPrice += i.quantity * i.price;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );

    res.json(totals);
  } catch (err) {
    console.error('getCartTotals error:', err);
    res.status(500).json({ error: 'Server error while calculating totals' });
  }
};
