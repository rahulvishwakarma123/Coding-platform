// models/Submission.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  language: {
    type: String,
    enum: ["javascript", "python", "java", "cpp"],
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Accepted",
      "Wrong Answer",
      "Time Limit Exceeded",
      "Runtime Error",
      "Compilation Error",
      "Pending",
    ],
    default: "Pending",
  },
  runtime: {
    type: Number, // in milliseconds
    default: null,
  },
  memory: {
    type: Number, // in KB
    default: null,
  },
  testResults: [
    {
      testCase: Number,
      passed: Boolean,
      output: String,
      expected: String,
      runtime: Number,
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add compound index for efficient user-problem queries
submissionSchema.index({ userId: 1, problemId: 1, submittedAt: -1 });

// Static method to get user's best submission for a problem
submissionSchema.statics.getBestSubmission = async function (
  userId,
  problemId,
) {
  return this.findOne({
    userId,
    problemId,
    status: "Accepted",
  }).sort({ runtime: 1 });
};

// Instance method to update problem stats
submissionSchema.methods.updateProblemStats = async function () {
  const Problem = mongoose.model("Problem");
  const totalAccepted = await this.constructor.countDocuments({
    problemId: this.problemId,
    status: "Accepted",
  });

  const totalSubmissions = await this.constructor.countDocuments({
    problemId: this.problemId,
  });

  await Problem.findByIdAndUpdate(this.problemId, {
    totalSubmissions,
    acceptanceRate:
      totalSubmissions > 0 ? (totalAccepted / totalSubmissions) * 100 : 0,
  });
};

module.exports = mongoose.model("Submission", submissionSchema);
