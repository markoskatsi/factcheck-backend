import { Router } from "express";
import database from "../database.js";

const router = Router();

// Query builders ---------------------------------------
const buildAssignmentsReadQuery = (id) => {
  let sql = "";
  const table =
    "Assignments INNER JOIN Users ON Assignments.AssignmentUserID=Users.UserID INNER JOIN Claims ON Assignments.AssignmentClaimID=Claims.ClaimID";
  const fields = [
    "AssignmentID",
    "AssignmentUserID",
    "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS AssignedUserName",
    "AssignmentClaimID",
    "Claims.ClaimTitle AS ClaimTitle",
    "AssignmentCreated",
  ];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE AssignmentID =:ID`;

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
const getAssignmentsController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const query = buildAssignmentsReadQuery(id, variant);
  const { isSuccess, result, message } = await read(query);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};
// Endpoints --------------------------------------------
router.get("/", (req, res) => getAssignmentsController(req, res, null));
router.get("/:id", (req, res) => getAssignmentsController(req, res, null));
export default router;
