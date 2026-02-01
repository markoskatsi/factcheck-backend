import { Router } from "express";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/usertypes-model.js";
import Accessor from "../accessor/Accessor.js";

// Model  -----------------------------------------------
const model = new Model(modelConfig);
// Data accessorts --------------------------------------
const accessor = new Accessor(model, database);
// Controllers ------------------------------------------
const getUsertypesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const { isSuccess, result, message } = await accessor.read(id, variant);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};
// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => getUsertypesController(req, res, null));
router.get("/:id", (req, res) => getUsertypesController(req, res, null));
export default router;
