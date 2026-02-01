import { Router } from "express";
import database from "../database.js";

const router = Router();

// Query builders ---------------------------------------
const buildUsertypesReadQuery = (id) => {
  let sql = "";
  const table = "Usertypes";
  const fields = ["UsertypeID", "UsertypeName", "UsertypeDescription"];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE UsertypeID =:ID`;

  return { sql: sql, data: { ID: id } };
};
// Data accessorts --------------------------------------
const read = async (id, variant) => {
  try {
    const { sql, data } = buildUsertypesReadQuery(id, variant);

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
// Controllers ------------------------------------------
const getUsertypesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const { isSuccess, result, message } = await read(id, variant);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};
// Endpoints --------------------------------------------
router.get("/", (req, res) => getUsertypesController(req, res, null));
router.get("/:id", (req, res) => getUsertypesController(req, res, null));
export default router;
