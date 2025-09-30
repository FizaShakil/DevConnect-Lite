import mongoose, {Schema} from "mongoose";

const projectSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String], // ["Node.js", "ExpressJS", "MongoDB"]
      required: true,
    },
    estimatedBudget: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema)
