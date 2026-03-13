import { Router } from "express";
import Validator from "../validators/Validator.js";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/verdicts-model.js";
import Accessor from "../accessor/Accessor.js";
import schema from "../validators/verdicts-schema.js";
import Controller from "../controllers/Controller.js";

// Validator --------------------------------------------
const validator = new Validator(schema);

// Model  -----------------------------------------------
const model = new Model(modelConfig);

// Data accessorts --------------------------------------
const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const controller = new Controller(validator, accessor);

// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => controller.get(req, res, null));
router.get("/users/:id", (req, res) => controller.get(req, res, "users"));
router.get("/claims/:id", (req, res) => controller.get(req, res, "claims"));
router.get("/:id", (req, res) => controller.get(req, res, "primary"));
router.post("/", (req, res) => controller.post(req, res));
router.put("/:id", (req, res) => controller.put(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

export default router;
