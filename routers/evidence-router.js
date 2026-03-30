import upload from "../middleware/upload.js";
import { Router } from "express";
import Validator from "../validators/Validator.js";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/evidence-model.js";
import Accessor from "../accessor/Accessor.js";
import schema from "../validators/evidence-schema.js";
import Controller from "../controllers/Controller.js";

// Validator --------------------------------------------
const validator = new Validator(schema);

// Model ------------------------------------------------
const model = new Model(modelConfig);

// Data Accessors ---------------------------------------
const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const controller = new Controller(validator, accessor);

// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => controller.get(req, res, null));
router.get("/:id", (req, res) => controller.get(req, res, "primary"));
router.get("/annotations/:id", (req, res) =>
  controller.get(req, res, "annotations"),
);
router.post("/", upload.single("file"), (req, res) =>
  controller.post(req, res, "Evidence"),
);
router.put("/:id", upload.single("file"), (req, res) => controller.put(req, res, "Evidence"));
router.delete("/:id", controller.delete);

export default router;
