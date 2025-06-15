import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Product from '../models/product.js';

export const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            vendorId,
            name,
            description,
            price,
            quantityInStock,
            images,
            tags,
            isPublished = true,
        } = req.body;
        const product = await Product.create({
            vendorId,
            name,
            description,
            price,
            quantityInStock,
            images,
            tags: tags || [],
            isPublished,
        });
        res.status(201).json({
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const updateData = req.body;
        updateData.updatedAt = new Date();
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({
            message: 'Product deleted successfully',
            product,
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const listProducts = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            page = 1,
            limit = 10,
            minPrice,
            maxPrice,
            tags,
            sort = 'createdAt',
        } = req.query;
        const query = {};
        if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
        if (tags) query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'name_asc') sortOption = { name: 1 };
        if (sort === 'name_desc') sortOption = { name: -1 };
        if (sort === 'created_asc') sortOption = { createdAt: 1 };
        if (sort === 'created_desc') sortOption = { createdAt: -1 };
        const products = await Product.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(query);
        res.json({
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const listProductsByVendor = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { vendorId } = req.params;
        const {
            page = 1,
            limit = 10,
            minPrice,
            maxPrice,
            tags,
            sort = 'createdAt',
        } = req.query;
        const query = { vendorId };
        if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
        if (tags) query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'name_asc') sortOption = { name: 1 };
        if (sort === 'name_desc') sortOption = { name: -1 };
        if (sort === 'created_asc') sortOption = { createdAt: 1 };
        if (sort === 'created_desc') sortOption = { createdAt: -1 };
        const products = await Product.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(query);
        res.json({
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error listing products by vendor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
