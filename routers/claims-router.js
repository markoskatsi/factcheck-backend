import { Router } from "express";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/claims-model.js";
import Accessor from "../accessor/Accessor.js";

// Model  -----------------------------------------------

const model = new Model(modelConfig);

// Data accessorts --------------------------------------

const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const postClaimsController = async (req, res) => {
  const record = req.body;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.create(record);
  if (!isSuccess) return res.status(404).json({ message });

  // Response to request
  res.status(201).json(result);
};

const getClaimsController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.read(id, variant);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const putClaimsController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.update(record, id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteClaimController = async (req, res) => {
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

router.get("/", (req, res) => getClaimsController(req, res, null));
router.get("/:id", (req, res) => getClaimsController(req, res, null));
router.get("/users/:id", (req, res) => getClaimsController(req, res, "users"));
router.get("/claimstatus/:id", (req, res) =>
  getClaimsController(req, res, "claimstatus"),
);

router.post("/", postClaimsController);

router.put("/:id", putClaimsController);

router.delete("/:id", deleteClaimController);

export default router;
