const asyncHandler = require("express-async-handler");
const Project = require("./project.model");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("./projects.validation");

const createProject = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { error, value } = createProjectSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }

  const project = await Project.create({
    platform: value.platform,
    clientId: value.clientId,
    userId: userId,
    deadline: value.deadline,
    budget: value.budget,
    status: value.status,
    description: value.description,
    title: value.title,
  });
  if (!project) {
    return res
      .status(400)
      .json({ status: "error", message: "cannot create this project" });
  }
  res.status(201).json({ status: "success", data: project });
});

const getAllProjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;
  const projects = await Project.find({ userId: userId })
    .limit(limit)
    .skip(skip);
  if (projects.length === 0) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find any project" });
  }
  res.status(200).json({
    numberOfProjects: projects.length,
    response: { status: "success", data: projects },
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const project = await Project.findOne({ userId: userId, _id: projectId });
  if (!project) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find this project" });
  }
  res.status(200).json({ status: "success", data: project });
});

const updateProject = asyncHandler(async (req, res) => {
  const { error, value } = updateProjectSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  const userId = req.user.id;
  const projectId = req.params.id;
  const project = await Project.findOneAndUpdate(
    {
      userId: userId,
      _id: projectId,
    },
    value,
    { new: true },
  );
  if (!project) {
    return res
      .status(404)
      .json({ status: "error", message: "project id is  invalid " });
  }
  res.status(200).json({ status: "success", data: project });
});

const deleteProject = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const isDeleted = await Project.findOneAndDelete({ userId, _id: projectId });
  if (!isDeleted) {
    return res
      .status(400)
      .json({ status: "error", message: "invalid projectId" });
  }
  res
    .status(200)
    .json({ status: "success", message: "project have been deleted" });

});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
