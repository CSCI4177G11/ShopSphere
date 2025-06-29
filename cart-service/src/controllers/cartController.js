import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart || { userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching cart" });
  }
};

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, productName, price, quantity } = req.body;

  if (!productId || !productName || !price || quantity < 1) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, productName, price, quantity });
    }

    await cart.save();
    res.status(201).json({ message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Server error while adding to cart" });
  }
};
