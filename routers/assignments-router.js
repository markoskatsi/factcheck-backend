import { Router } from "express";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/assignments-model.js";
import Accessor from "../accessor/Accessor.js";

// Modal ------------------------------------------------

const model = new Model(modelConfig);

// Data accessorts --------------------------------------

const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const postAssignmentsController = async (req, res) => {
  const record = req.body;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.create(record);
  if (!isSuccess) return res.status(404).json({ message });

  // Response to request
  res.status(201).json(result);
};

const getAssignmentsController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const { isSuccess, result, message } = await accessor.read(id, variant);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const putAssignmentsController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.update(record, id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteAssignmentController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.delete(id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};
// Endpoints --------------------------------------------
const router = Router();

router.post("/", postAssignmentsController);

router.get("/", (req, res) => getAssignmentsController(req, res, null));
router.get("/:id", (req, res) => getAssignmentsController(req, res, null));
router.get("/users/:id", (req, res) =>
  getAssignmentsController(req, res, "users"),
);
router.get("/claims/:id", (req, res) =>
  getAssignmentsController(req, res, "claims"),
);

router.put("/:id", putAssignmentsController);
router.delete("/:id", deleteAssignmentController);
export default router;
