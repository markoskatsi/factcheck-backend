import upload from "../middleware/upload.js";
import { Router } from "express";
import Validator from "../validators/Validator.js";
import database from "../database.js";
import cloudinary from "../utils/cloudinary.js";
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
const postEvidenceController = async (req, res) => {
  const record = req.body;
  // Validate request
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      record.EvidenceFilename = req.file.originalname;
      record.EvidenceFilepath = uploadResult.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Cloudinary upload failed: ${error.message}` });
    }
  }

  // Access database
  const { isSuccess, result, message } = await accessor.create({
    body: record,
  });
  if (!isSuccess) return res.status(404).json({ message });
  // Response to request
  res.status(201).json(result);
};

const putEvidenceController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      record.EvidenceFilename = req.file.originalname;
      record.EvidenceFilepath = uploadResult.secure_url;
      record.SourceURL = null;
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Cloudinary upload failed: ${error.message}` });
    }
  }
  // Access database
  const { isSuccess, result, message } = await accessor.update({
    body: record,
    params: { id },
  });
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};
const controller = new Controller(validator, accessor);

// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => controller.get(req, res, null));
router.get("/:id", (req, res) => controller.get(req, res, "primary"));
router.get("/annotations/:id", (req, res) =>
  controller.get(req, res, "annotations"),
);
router.post("/", upload.single("file"), postEvidenceController);
router.put("/:id", upload.single("file"), putEvidenceController);
router.delete("/:id", controller.delete);

export default router;
