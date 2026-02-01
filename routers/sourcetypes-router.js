import { Router } from "express";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/sourcetypes-model.js";
import Accessor from "../accessor/Accessor.js";

// Model  -----------------------------------------------
const model = new Model(modelConfig);
// Data accessorts --------------------------------------
const accessor = new Accessor(model, database);
// Controllers ------------------------------------------
const getSourcetypesController = async (req, res) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const { isSuccess, result, message } = await accessor.read(id);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};
// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => getSourcetypesController(req, res));
router.get("/:id", (req, res) => getSourcetypesController(req, res));

export default router;
