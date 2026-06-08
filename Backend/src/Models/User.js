import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password by default in queries
  },
  rating: {
    type: Number,
    default: 1200, // Starting ELO rating for coders
    min: 0,
    max: 3000
  },
  solvedProblems: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  contestHistory: [{
    contestId: String,
    rank: Number,
    score: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add helpful instance methods
userSchema.methods.getProfile = function() {
  return {
    name: this.name,
    email: this.email,
    rating: this.rating,
    problemsSolved: this.solvedProblems.length
  };
};

// Static method to find users by rating range
userSchema.statics.findByRatingRange = function(min, max) {
  return this.find({ rating: { $gte: min, $lte: max } }).sort({ rating: -1 });
};

module.exports = mongoose.model('User', userSchema);