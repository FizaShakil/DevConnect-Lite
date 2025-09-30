import asyncHandler from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { Bid } from "../models/bid.model.js"
import { Project } from "../models/project.model.js"

const placeBid = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { bidAmount, message } = req.body;

  if (!bidAmount || !message) {
    throw new ApiError(400, "Bid amount and message are required");
  }

  // Check if project exists or open
  const project = await Project.findOne({ _id: projectId, status: "open" });
  if (!project) {
    throw new ApiError(404, "Project not found or not open for bids");
  }

  // Prevent duplicate bids from same developer on the same project
  const existingBid = await Bid.findOne({
    project: projectId,
    developer: req.user._id,
  });

  if (existingBid) {
    throw new ApiError(400, "You have already placed a bid on this project");
  }

  // Create bid
  const bid = await Bid.create({
    project: projectId,
    developer: req.user._id,
    bidAmount,
    message,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bid, "Bid placed successfully"));
});

export {placeBid}