import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/User.model.js';

// Hash password helper (12 salt rounds provides excellent security) [citation:7]
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Generate both access and refresh tokens [citation:5]
const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { id: userId, email: email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

// Set cookie options for security
const getCookieOptions = () => ({
  httpOnly: true,  // Prevents XSS attacks - JS cannot access the cookie [citation:9]
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict', // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      rating: 1200, // Default starting rating
      solvedProblems: [],
      contestHistory: []
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.email);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    // Send response (access token can be sent in response body or cookie)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken, // Frontend can store this in memory
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password using bcrypt compare [citation:1]
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.email);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires refresh token in cookie)
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'No refresh token provided' 
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user to ensure they still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
    );

    res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid refresh token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Refresh token expired. Please login again.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error during token refresh' 
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
