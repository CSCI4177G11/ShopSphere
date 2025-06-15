import { validationResult } from 'express-validator';
import Review from '../models/review.js';
import Product from '../models/product.js';

export const createReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const { userId } = req.user;
        const review = await Review.create({
            productId,
            userId,
            rating,
            comment: comment || '',
        });
        // Recalculate product rating
        await Product.recalculateRating(productId);
        res.status(201).json({
            message: 'Review created successfully',
            review,
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const listReviews = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { productId } = req.params;
        const {
            page = 1,
            limit = 10,
            sort = 'createdAt',
        } = req.query;
        let sortOption = { createdAt: -1 };
        if (sort === 'created_asc') sortOption = { createdAt: 1 };
        if (sort === 'created_desc') sortOption = { createdAt: -1 };
        if (sort === 'rating_asc') sortOption = { rating: 1 };
        if (sort === 'rating_desc') sortOption = { rating: -1 };
        const reviews = await Review.find({ productId })
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Review.countDocuments({ productId });
        res.json({
            reviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error listing reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { productId, reviewId } = req.params;
        const { userId } = req.user;
        const updateData = req.body;
        const review = await Review.findOneAndUpdate(
            { _id: reviewId, productId, userId },
            updateData,
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }
        await Product.recalculateRating(productId);
        res.json({
            message: 'Review updated successfully',
            review,
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { productId, reviewId } = req.params;
        const { userId } = req.user;
        const review = await Review.findOneAndDelete({ _id: reviewId, productId, userId });
        if (!review) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }
        await Product.recalculateRating(productId);
        res.json({
            message: 'Review deleted successfully',
            review,
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
