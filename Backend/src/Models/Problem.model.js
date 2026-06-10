// models/Problem.js
import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    unique: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
    default: 'Medium'
  },
  tags: [{
    type: String,
    enum: ['Arrays', 'Strings', 'Hash Tables', 'Dynamic Programming', 
           'Math', 'Sorting', 'Greedy', 'Recursion', 'Trees', 'Graphs']
  }],
  description: {
    type: String,
    required: true
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false // Hidden test cases for final judging
    }
  }],
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  solution: {
    type: String,
    select: false // Don't expose solution in normal queries
  },
  acceptanceRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
problemSchema.index({ difficulty: 1, tags: 1 });

// Static method to get problems by difficulty
problemSchema.statics.getByDifficulty = function(difficulty) {
  return this.find({ difficulty }).sort({ createdAt: -1 });
};

// Instance method to check if submission passes basic tests
problemSchema.methods.runBasicTests = function(userOutput, testCaseIndex) {
  const testCase = this.testCases[testCaseIndex];
  return userOutput.toString() === testCase.output.toString();
};

export default mongoose.model('Problem', problemSchema);