import { Router } from "express";
import database from "../database.js";
import Model from "../models/Model.js";
import modelConfig from "../models/claims-model.js";

// Model  -----------------------------------------------

const model = new Model(modelConfig);

// Data accessorts --------------------------------------
const create = async (record) => {
  try {
    const { sql, data } = model.buildCreateQuery(record);
    const status = await database.query(sql, data);

    const { isSuccess, result, message } = await read(status[0].insertId, null);

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

const read = async (id, variant) => {
  try {
    const { sql, data } = model.buildReadQuery(id, variant);
    const [result] = await database.query(sql, data);
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

const update = async (record, id) => {
  try {
    const { sql, data } = model.buildUpdateQuery(record, id);
    const status = await database.query(sql, data);

    if (status[0].affectedRows === 0) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to update record: no rows affected`,
      };
    }

    const { isSuccess, result, message } = await read(id, null);

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

const _delete = async (id) => {
  try {
    const { sql, data } = model.buildDeleteQuery(id);
    const status = await database.query(sql, data);

    return status[0].affectedRows === 0
      ? {
          isSuccess: false,
          result: null,
          message: `Failed to delete record: ${id}`,
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
const postClaimsController = async (req, res) => {
  const record = req.body;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await create(record);
  if (!isSuccess) return res.status(404).json({ message });

  // Response to request
  res.status(201).json(result);
};

const getClaimsController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await read(id, variant);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const putClaimsController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await update(record, id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteClaimController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await _delete(id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};

// Endpoints --------------------------------------------
const router = Router();

router.get("/", (req, res) => getClaimsController(req, res, null));
router.get("/:id", (req, res) => getClaimsController(req, res, null));
router.get("/users/:id", (req, res) => getClaimsController(req, res, "users"));
router.get("/claimstatus/:id", (req, res) =>
  getClaimsController(req, res, "claimstatus"),
);

router.post("/", postClaimsController);

router.put("/:id", putClaimsController);

router.delete("/:id", deleteClaimController);

export default router;
