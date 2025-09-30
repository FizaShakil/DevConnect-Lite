import mongoose, {Schema} from 'mongoose'

const bidSchema = new mongoose.Schema(
{
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Bid = mongoose.model("Bid", bidSchema);
