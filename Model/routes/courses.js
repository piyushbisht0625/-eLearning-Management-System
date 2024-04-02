const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get courses endpoint with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, level } = req.query;

        // Prepare query object for filtering
        const query = {};
        if (category) query.category = category;
        if (level) query.level = level;

        // Fetch courses with pagination and filtering
        const courses = await Course.find(query)
                                    .limit(limit * 1)
                                    .skip((page - 1) * limit)
                                    .exec();

        // Get total count of courses for pagination
        const totalCount = await Course.countDocuments(query);

        res.json({
            courses,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});



module.exports = router;
