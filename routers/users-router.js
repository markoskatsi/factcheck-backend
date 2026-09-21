import { Router } from "express";
import Validator from "../validators/Validator.js";
import database from "../config/database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/users-model.js";
import Accessor from "../accessor/Accessor.js";
import schema from "../validators/users-schema.js";
import Controller from "../controllers/Controller.js";
import hashPassword from "../middleware/hashPassword.js";
import validateJwt from "../middleware/auth.js";

// Validator --------------------------------------------
const validator = new Validator(schema);

// Model -----------------------------------------------
const model = new Model(modelConfig);

// Data accessorts --------------------------------------
const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const controller = new Controller(validator, accessor);

// Endpoints --------------------------------------------
const router = Router();

router.get("/", validateJwt, (req, res) => controller.get(req, res, null));
router.get("/:id", validateJwt, (req, res) => controller.get(req, res, "primary"));
router.get("/usertypes/:id", validateJwt, (req, res) =>
  controller.get(req, res, "usertype"),
);
router.post("/", hashPassword, controller.post);
router.put("/:id", validateJwt, hashPassword, controller.put);
router.delete("/:id", validateJwt, controller.delete);

export default router;
