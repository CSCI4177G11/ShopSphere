import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Mock data for now - replace with actual database operations
let products = [];
let productIdCounter = 1;

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

        const product = {
            id: productIdCounter++,
            vendorId,
            name,
            description,
            price,
            quantityInStock,
            images,
            tags: tags || [],
            isPublished,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        products.push(product);

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
        const productIndex = products.findIndex(p => p.id === parseInt(id));

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updateData = req.body;
        updateData.updatedAt = new Date();

        products[productIndex] = { ...products[productIndex], ...updateData };

        res.json({
            message: 'Product updated successfully',
            product: products[productIndex],
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
        const productIndex = products.findIndex(p => p.id === parseInt(id));

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const deletedProduct = products.splice(productIndex, 1)[0];

        res.json({
            message: 'Product deleted successfully',
            product: deletedProduct,
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

        let filteredProducts = [...products];

        // Apply filters
        if (minPrice) {
            filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
        }
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filteredProducts = filteredProducts.filter(p =>
                p.tags.some(tag => tagArray.includes(tag))
            );
        }

        // Apply sorting
        filteredProducts.sort((a, b) => {
            if (sort === 'price') return a.price - b.price;
            if (sort === 'name') return a.name.localeCompare(b.name);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        res.json({
            products: paginatedProducts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredProducts.length,
                pages: Math.ceil(filteredProducts.length / limit),
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

        let filteredProducts = products.filter(p => p.vendorId === vendorId);

        // Apply filters
        if (minPrice) {
            filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
        }
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filteredProducts = filteredProducts.filter(p =>
                p.tags.some(tag => tagArray.includes(tag))
            );
        }

        // Apply sorting
        filteredProducts.sort((a, b) => {
            if (sort === 'price') return a.price - b.price;
            if (sort === 'name') return a.name.localeCompare(b.name);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        res.json({
            products: paginatedProducts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredProducts.length,
                pages: Math.ceil(filteredProducts.length / limit),
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
        const product = products.find(p => p.id === parseInt(id));

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
