import { Router } from "express";
import database from "../database.js";

const router = Router();

// Query builders ---------------------------------------
const buildSourcetypesReadQuery = (id) => {
  let sql = "";
  const table = "Sourcetypes";
  const fields = ["SourcetypeID", "SourcetypeName", "SourcetypeDescription"];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE SourcetypeID =:ID`;

  return { sql: sql, data: { ID: id } };
};
// Data accessorts --------------------------------------
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
// Controllers ------------------------------------------
const getSourcetypesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const query = buildSourcetypesReadQuery(id, variant);
  const { isSuccess, result, message } = await read(query);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};
// Endpoints --------------------------------------------
router.get("/", (req, res) => getSourcetypesController(req, res, null));
router.get("/:id", (req, res) => getSourcetypesController(req, res, null));
export default router;
