// controllers/problem.controller.js
import Problem from '../Models/Problem.model.js';

// @desc    Create a new problem (Admin only)
// @route   POST /api/problems
// @access  Private/Admin
export const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);
    
    res.status(201).json({
      success: true,
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all problems with pagination and filters
// @route   GET /api/problems
// @access  Public
export const getProblems = async (req, res, next) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Difficulty filter
    if (req.query.difficulty) {
      const difficulties = req.query.difficulty.split(',');
      filter.difficulty = { $in: difficulties };
    }
    
    // Tags filter
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      filter.tags = { $in: tags };
    }
    
    // Search by title
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    
    // Execute queries in parallel for better performance
    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select('-testCases') // Exclude test cases from list view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Problem.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: problems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single problem by ID (excludes test cases)
// @route   GET /api/problems/:id
// @access  Public
export const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select('-testCases'); // Exclude test cases from public view
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    res.json({
      success: true,
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update problem (Admin only)
// @route   PUT /api/problems/:id
// @access  Private/Admin
export const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    res.json({
      success: true,
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete problem (Admin only)
// @route   DELETE /api/problems/:id
// @access  Private/Admin
export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};