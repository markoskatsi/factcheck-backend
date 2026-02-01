import { Router } from "express";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/sourcetypes-model.js";
import Accessor from "../accessor/Accessor.js";
import Controller from "../controllers/Controller.js";

// Model  -----------------------------------------------
const model = new Model(modelConfig);

// Data accessorts --------------------------------------
const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const controller = new Controller(accessor);

// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => controller.get(req, res, null));
router.get("/:id", (req, res) => controller.get(req, res, null));

export default router;
