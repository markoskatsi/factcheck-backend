import { Router } from "express";
import Validator from "../validators/Validator.js";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/assignments-model.js";
import Accessor from "../accessor/Accessor.js";
import schema from "../validators/assignments-schema.js";
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

router.post("/", controller.post);
router.get("/", (req, res) => controller.get(req, res, null));
router.get("/:id", (req, res) => controller.get(req, res, "primary"));
router.get("/users/:id", (req, res) => controller.get(req, res, "users"));
router.get("/claims/:id", (req, res) => controller.get(req, res, "claims"));
router.put("/:id", controller.put);
router.delete("/:id", controller.delete);

export default router;
