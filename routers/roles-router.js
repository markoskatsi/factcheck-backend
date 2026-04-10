import { Router } from "express";
import Validator from "../validators/Validator.js";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/roles-model.js";
import Accessor from "../accessor/Accessor.js";
import schema from "../validators/roles-schema.js";
import Controller from "../controllers/Controller.js";

const validator = new Validator(schema);
const model = new Model(modelConfig);
const accessor = new Accessor(model, database);
const controller = new Controller(validator, accessor);
const router = Router();

router.get("/", (req, res) => controller.get(req, res, null));
router.get("/:id", (req, res) => controller.get(req, res, "primary"));
router.post("/", controller.post);
router.put("/:id", controller.put);
router.delete("/:id", controller.delete);

export default router;
