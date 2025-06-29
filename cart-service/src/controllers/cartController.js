import Cart from '../models/Cart.js';

/**
 * GET /api/cart
 * Fetch the current user's cart or return an empty template if none exists yet.
 */
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart || { userId, items: [] });
  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ error: 'Server error while fetching cart' });
  }
};

/**
 * POST /api/cart/items
 * Adds a product to the user's cart (or increases quantity if it already exists).
 * Body: { productId, productName, price, quantity }
 */
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, productName, price, quantity } = req.body;

  if (!productId || !productName || !price || quantity < 1) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, productName, price, quantity });
    }

    await cart.save();
    res.status(201).json({ message: 'Product added to cart', cart });
  } catch (err) {
    console.error('addToCart error:', err);
    res.status(500).json({ error: 'Server error while adding to cart' });
  }
};

/**
 * PUT /api/cart/items/:itemId
 * Updates the quantity of an existing cart line-item identified by :itemId (== productId).
 * Body: { quantity }
 */
export const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params; // itemId == productId
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find((i) => i.productId === itemId);
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    console.error('updateCart error:', err);
    res.status(500).json({ error: 'Server error while updating cart' });
  }
};

/**
 * DELETE /api/cart/items/:itemId
 * Removes a single item from the cart.
 */
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params; // itemId == productId

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId !== itemId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (err) {
    console.error('removeFromCart error:', err);
    res.status(500).json({ error: 'Server error while removing item from cart' });
  }
};

/**
 * DELETE /api/cart/clear
 * Clears all items from the user's cart.
 */
export const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    console.error('clearCart error:', err);
    res.status(500).json({ error: 'Server error while clearing cart' });
  }
};

/**
 * GET /api/cart/totals
 * Provides aggregate info: total number of items and total cost.
 */
export const getCartTotals = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const totals = cart.items.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.quantity * item.price;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );

    res.status(200).json(totals);
  } catch (err) {
    console.error('getCartTotals error:', err);
    res.status(500).json({ error: 'Server error while calculating totals' });
  }
};