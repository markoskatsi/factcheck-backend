import { Router } from "express";
import database from "../database.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import Model from "../models/Model.js";
import modelConfig from "../models/sources-model.js";
import Accessor from "../accessor/Accessor.js";

// Multer ----------------------------------------------

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Model ------------------------------------------------

const model = new Model(modelConfig);

// Data Accessors ---------------------------------------

const accessor = new Accessor(model, database);

// Controllers ------------------------------------------
const postSourcesController = async (req, res) => {
  const record = req.body;
  // Validate request
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      record.SourceFilename = req.file.originalname;
      record.SourceFilepath = uploadResult.secure_url;
      record.SourceFiletype = req.file.mimetype;
      record.SourceFilesize = req.file.size;
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Cloudinary upload failed: ${error.message}` });
    }
  }

  // Access database
  const { isSuccess, result, message } = await accessor.create(record);
  if (!isSuccess) return res.status(404).json({ message });
  // Response to request
  res.status(201).json(result);
};

const getSourcesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.read(id, variant);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const putSourcesController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      record.SourceFilename = req.file.originalname;
      record.SourceFilepath = uploadResult.secure_url;
      record.SourceFiletype = req.file.mimetype;
      record.SourceFilesize = req.file.size;
      record.SourceURL = null;
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Cloudinary upload failed: ${error.message}` });
    }
  } else if (record.SourceURL) {
    record.SourceFilename = null;
    record.SourceFilepath = null;
    record.SourceFiletype = null;
    record.SourceFilesize = null;
  }

  // Access database
  const { isSuccess, result, message } = await accessor.update(record, id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteSourceController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await accessor.delete(id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};
// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => getSourcesController(req, res, null));
router.get("/:id", (req, res) => getSourcesController(req, res, null));
router.get("/claims/:id", (req, res) =>
  getSourcesController(req, res, "claims"),
);
router.post("/", upload.single("file"), postSourcesController);

router.put("/:id", upload.single("file"), putSourcesController);

router.delete("/:id", deleteSourceController);

export default router;
