import { validationResult } from 'express-validator';

// Mock data for now - replace with actual database operations
let reviews = [];
let reviewIdCounter = 1;

export const createReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { productId } = req.params;
        const { rating, comment } = req.body;
        const { userId } = req.user;

        const review = {
            id: reviewIdCounter++,
            productId: parseInt(productId),
            userId,
            rating,
            comment: comment || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        reviews.push(review);

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

        let filteredReviews = reviews.filter(r => r.productId === parseInt(productId));

        // Apply sorting
        filteredReviews.sort((a, b) => {
            if (sort === 'rating') return b.rating - a.rating;
            if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

        res.json({
            reviews: paginatedReviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredReviews.length,
                pages: Math.ceil(filteredReviews.length / limit),
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

        const { reviewId } = req.params;
        const { userId } = req.user;
        const reviewIndex = reviews.findIndex(r => r.id === parseInt(reviewId) && r.userId === userId);

        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        const updateData = req.body;
        updateData.updatedAt = new Date();

        reviews[reviewIndex] = { ...reviews[reviewIndex], ...updateData };

        res.json({
            message: 'Review updated successfully',
            review: reviews[reviewIndex],
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

        const { reviewId } = req.params;
        const { userId } = req.user;
        const reviewIndex = reviews.findIndex(r => r.id === parseInt(reviewId) && r.userId === userId);

        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        const deletedReview = reviews.splice(reviewIndex, 1)[0];

        res.json({
            message: 'Review deleted successfully',
            review: deletedReview,
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
