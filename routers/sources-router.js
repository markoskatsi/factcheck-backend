import { Router } from "express";
import database from "../database.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const router = Router();

// Multer ----------------------------------------------

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Query builders ---------------------------------------
const buildSetField = (fields) =>
  fields.reduce(
    (setSQL, field, index) =>
      setSQL + `${field}=:${field}` + (index === fields.length - 1 ? "" : ", "),
    " SET "
  );

const buildSourcesCreateQuery = (record) => {
  const table = "Sources";
  const mutableFields = [
    "SourceDescription",
    "SourceURL",
    "SourceClaimID",
    "SourceSourcetypeID",
    "SourceFilename",
    "SourceFilepath",
    "SourceFiletype",
    "SourceFilesize",
  ];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  const sql = `INSERT INTO ${table}` + buildSetField(mutableFields);
  return { sql, data: record };
};

const buildSourcesReadQuery = (id, variant) => {
  let sql = "";
  const table =
    "Sources INNER JOIN Claims ON Sources.SourceClaimID=Claims.ClaimID INNER JOIN Sourcetypes ON Sources.SourceSourcetypeID=Sourcetypes.SourcetypeID";
  const fields = [
    "SourceID",
    "SourcetypeName",
    "SourceDescription",
    "SourceCreated",
    "ClaimDescription",
    "SourceClaimID",
    "SourceSourcetypeID",
    "SourceURL",
    "SourceFilename",
    "SourceFilepath",
    "SourceFiletype",
    "SourceFilesize",
  ];

  switch (variant) {
    case "claims":
      sql = `SELECT ${fields} FROM ${table} WHERE SourceClaimID = :ID ORDER BY SourceCreated DESC`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE SourceID = :ID`;
      sql += ` ORDER BY SourceCreated DESC`;
  }

  return { sql: sql, data: { ID: id } };
};

const buildSourcesUpdateQuery = (record, id) => {
  const table = "Sources";
  const mutableFields = [
    "SourceDescription",
    "SourceURL",
    "SourceClaimID",
    "SourceSourcetypeID",
    "SourceFilename",
    "SourceFilepath",
    "SourceFiletype",
    "SourceFilesize",
  ];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  const sql =
    `UPDATE ${table}` +
    buildSetField(mutableFields) +
    ` WHERE SourceID=:SourceID`;
  return { sql, data: { ...record, SourceID: id } };
};

const buildSourcesDeleteQuery = (id) => {
  const table = "Sources";
  const sql = `DELETE FROM ${table} WHERE SourceID=:SourceID`;
  return { sql, data: { SourceID: id } };
};

// Data Accessors ---------------------------------------
const createSource = async (createQuery) => {
  try {
    const status = await database.query(createQuery.sql, createQuery.data);
    const readQuery = buildSourcesReadQuery(status[0].insertId, null);

    const { isSuccess, result, message } = await read(readQuery);

    return isSuccess
      ? {
          isSuccess: true,
          result: result,
          message: "Record successfully recovered",
        }
      : {
          isSuccess: false,
          result: null,
          message: `Failed to recover the inserted record: ${message}`,
        };
  } catch (error) {
    return {
      isSuccess: false,
      result: null,
      message: `Failed to execute query: ${error.message}`,
    };
  }
};

const read = async (query) => {
  try {
    const [result] = await database.query(query.sql, query.data);
    return result.length === 0
      ? { isSuccess: true, result: [], message: "No record(s) found" }
      : { isSuccess: true, result: result, message: "Record(s) recovered" };
  } catch (error) {
    return {
      isSuccess: false,
      result: null,
      message: `Failed to execute query: ${error.message}`,
    };
  }
};

const updateSource = async (updateQuery) => {
  try {
    const status = await database.query(updateQuery.sql, updateQuery.data);

    if (status[0].affectedRows === 0) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to update record: no rows affected`,
      };
    }

    const readQuery = buildSourcesReadQuery(updateQuery.data.SourceID, null);

    const { isSuccess, result, message } = await read(readQuery);

    return isSuccess
      ? {
          isSuccess: true,
          result: result,
          message: "Record successfully recovered",
        }
      : {
          isSuccess: false,
          result: null,
          message: `Failed to recover the updated record: ${message}`,
        };
  } catch (error) {
    return {
      isSuccess: false,
      result: null,
      message: `Failed to execute query: ${error.message}`,
    };
  }
};

const deleteSource = async (deleteQuery) => {
  try {
    const status = await database.query(deleteQuery.sql, deleteQuery.data);

    return status[0].affectedRows === 0
      ? {
          isSuccess: false,
          result: null,
          message: `Failed to delete record: ${deleteQuery.data.SourceID}`,
        }
      : {
          isSuccess: true,
          result: null,
          message: "Record successfully deleted",
        };
  } catch (error) {
    return {
      isSuccess: false,
      result: null,
      message: `Failed to execute query: ${error.message}`,
    };
  }
};
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
  const query = buildSourcesCreateQuery(record);
  const { isSuccess, result, message } = await createSource(query);
  if (!isSuccess) return res.status(404).json({ message });
  // Response to request
  res.status(201).json(result);
};

const getSourcesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const query = buildSourcesReadQuery(id, variant);
  const { isSuccess, result, message } = await read(query);
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
  const query = buildSourcesUpdateQuery(record, id);
  const { isSuccess, result, message } = await updateSource(query);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteSourceController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const query = buildSourcesDeleteQuery(id);
  const { isSuccess, result, message } = await deleteSource(query);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};
// Endpoints --------------------------------------------
router.get("/", (req, res) => getSourcesController(req, res, null));
router.get("/:id", (req, res) => getSourcesController(req, res, null));
router.get("/claims/:id", (req, res) =>
  getSourcesController(req, res, "claims")
);
router.post("/", upload.single("file"), postSourcesController);

router.put("/:id", upload.single("file"), putSourcesController);

router.delete("/:id", deleteSourceController);

export default router;
