// middleware/validation.js
import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Problem creation validation rules
export const problemValidationRules = () => [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('tags')
    .isArray().withMessage('Tags must be an array'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('testCases')
    .isArray({ min: 1 }).withMessage('At least one test case is required')
];

// Problem update validation rules (all fields optional)
export const problemUpdateValidationRules = () => [
  body('title').optional().isLength({ min: 3, max: 100 }),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  body('tags').optional().isArray(),
  body('description').optional().isLength({ min: 20 })
];

// ID parameter validation
export const idParamValidationRules = () => [
  param('id')
    .isMongoId().withMessage('Invalid problem ID format')
];

// Pagination and filter validation
export const listQueryValidationRules = () => [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('difficulty')
    .optional()
    .matches(/^(Easy|Medium|Hard)(,?(Easy|Medium|Hard))*$/).withMessage('Invalid difficulty filter'),
  query('tags')
    .optional()
    .isString().withMessage('Tags must be a comma-separated string'),
  query('search')
    .optional()
    .isString().withMessage('Search term must be a string')
];