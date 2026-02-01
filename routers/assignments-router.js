import { Router } from "express";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/assignments-model.js";
import Accessor from "../accessor/Accessor.js";
import Controller from "../controllers/Controller.js";

// Modal ------------------------------------------------
const model = new Model(modelConfig);

// Data accessorts --------------------------------------
const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const controller = new Controller(accessor);

// Endpoints --------------------------------------------
const router = Router();

router.post("/", controller.post);
router.get("/", (req, res) => controller.get(req, res, null));
router.get("/:id", (req, res) => controller.get(req, res, null));
router.get("/users/:id", (req, res) => controller.get(req, res, "users"));
router.get("/claims/:id", (req, res) => controller.get(req, res, "claims"));
router.put("/:id", controller.put);
router.delete("/:id", controller.delete);

export default router;
