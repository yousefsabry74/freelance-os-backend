const asyncHandler = require("express-async-handler");
const Client = require("./client.model");
const {
  createClientSchema,
  updateClientSchema,
} = require("./clients.validation");

const createClient = asyncHandler(async (req, res) => {
  const { error, value } = createClientSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  const userId = req.user.id;
  const client = await Client.create({
    name: value.name,
    userId: userId,
    email: value.email,
    company: value.company,
    notes: value.notes,
    platform: value.platform,
    phone: value.phone,
  });
  res.status(201).json({ status: "success", data: client });
});

const getAllClients = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = req.query.page || 1;
  const limit = Math.min(parseInt(req.query.limit) || 5, 50);
  const skip = (page - 1) * limit;
  const clients = await Client.find({ userId: userId }).skip(skip).limit(limit);
  if (clients.length === 0) {
    return res.status(404).json({ status: "error", message: "..." });
  }
  res.status(200).json({
    numberOfClients: clients.length,
    count: clients.length,
    data: clients,
  });
});

const getClientById = asyncHandler(async (req, res) => {
  const clientId = req.params.id;

  const client = await Client.findOne({ _id: clientId, userId: req.user.id });
  if (!client) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find this client" });
  }
  res.status(200).json({ status: "success", data: client });
});

const updateClient = asyncHandler(async (req, res) => {
  const { error, value } = updateClientSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  const userId = req.user.id;
  const clientId = req.params.id;

  const client = await Client.findOneAndUpdate(
    {
      _id: clientId,
      userId: req.user.id,
    },
    value,
    { new: true },
  );
  if (!client) {
    return res.status(404).json({
      status: "error",
      message: "cannot find this client",
    });
  }
  res.status(200).json({ status: "success", data: client });
});

const deleteClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  const client = await Client.findOneAndDelete({
    _id: clientId,
    userId: req.user.id,
  });
  if (!client) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot delete this client" });
  }
  res.status(200).json({ status: "success", data: "client have been deleted" });
});

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
