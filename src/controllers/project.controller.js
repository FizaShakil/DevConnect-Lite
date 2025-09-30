import asyncHandler from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { Project } from '../models/project.model.js'
import { Bid } from '../models/bid.model.js';
import fs from "fs";
import path from "path";

//create project
const createProject = asyncHandler(async (req, res) => {
  const { title, description, techStack, estimatedBudget, status } = req.body;

  if (!title?.trim() || !description?.trim() || !status?.trim() || !techStack?.length || !estimatedBudget) {
    throw new ApiError(400, "All fields are required");
  }

  const project = await Project.create({
    user: req.user._id, // logged-in user from auth middleware
    title,
    description,
    techStack,
    estimatedBudget,
    status,
  });

  if (!project) {
    throw new ApiError(500, "Something went wrong while creating project");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project Created Successfully"));
});


//open projects
const openProject = asyncHandler(async (req, res) => {
  
  const openProjects = await Project.find({ status: "open" })
  .populate("user", "username email");

  if (!openProjects || openProjects.length === 0) {
    throw new ApiError(404, "No open projects found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, openProjects, "Open projects fetched successfully"));
});


// get project bids of specific project
const getProjectBids = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Project ID is required");
  }

  // Verify project exists
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Find all bids 
  const bids = await Bid.find({ project: id })
    .populate("developer", "username email skills")
    .sort({ createdAt: -1 }); // newest first

  return res
    .status(200)
    .json(new ApiResponse(200, bids, "Bids fetched successfully"));
});


//export projects in .json
const exportProjects = asyncHandler(async (req, res) => {
  try {
    // Fetch 
    const projects = await Project.find().lean();

    if (!projects.length) {
      throw new ApiError(404, "No projects found to export");
    }

    // Define file path
    const filePath = path.join(process.cwd(), "src/exports", "projects.json");

    // Ensure exports folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));

    return res
      .status(200)
      .json(
        new ApiResponse(200, { filePath }, "Projects exported successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Failed to export projects: " + error.message);
  }
});


export {createProject, openProject, getProjectBids, exportProjects}