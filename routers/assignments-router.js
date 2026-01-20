import { Router } from "express";
import database from "../database.js";

const router = Router();

// Query builders ---------------------------------------
const buildSetField = (fields) =>
  fields.reduce(
    (setSQL, field, index) =>
      setSQL + `${field}=:${field}` + (index === fields.length - 1 ? "" : ", "),
    " SET ",
  );

const buildAssignmentsCreateQuery = (record) => {
  const table = "Assignments";
  const mutableFields = ["AssignmentUserID", "AssignmentClaimID"];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  const sql = `INSERT INTO ${table}` + buildSetField(mutableFields);
  return { sql, data: record };
};

const buildAssignmentsReadQuery = (id, variant) => {
  let sql = "";
  const table =
    "Assignments INNER JOIN Users ON Assignments.AssignmentUserID=Users.UserID INNER JOIN Claims ON Assignments.AssignmentClaimID=Claims.ClaimID";
  const fields = [
    "AssignmentID",
    "AssignmentUserID",
    "AssignmentClaimID",
    "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS AssignedUserName",
    "Claims.ClaimTitle AS ClaimTitle",
    "AssignmentCreated",
  ];
  switch (variant) {
    case "claims":
      sql = `SELECT ${fields} FROM ${table} WHERE Assignments.AssignmentClaimID =:ID`;
      break;
    case "users":
      sql = `SELECT ${fields} FROM ${table} WHERE Assignments.AssignmentUserID =:ID`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE AssignmentID =:ID`;
  }

  return { sql: sql, data: { ID: id } };
};

const buildAssignmentsUpdateQuery = (record, id) => {
  const table = "Assignments";
  const mutableFields = ["AssignmentUserID", "AssignmentClaimID"];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  const sql =
    `UPDATE ${table}` +
    buildSetField(mutableFields) +
    ` WHERE AssignmentID=:AssignmentID`;
  return { sql, data: { ...record, AssignmentID: id } };
};

const buildAssignmentsDeleteQuery = (id) => {
  const table = "Assignments";
  const sql = `DELETE FROM ${table} WHERE AssignmentID=:AssignmentID`;
  return { sql, data: { AssignmentID: id } };
};
// Data accessorts --------------------------------------
const createAssignment = async (createQuery) => {
  try {
    const status = await database.query(createQuery.sql, createQuery.data);
    const readQuery = buildAssignmentsReadQuery(status[0].insertId, null);

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

const updateAssignment = async (updateQuery) => {
  try {
    const status = await database.query(updateQuery.sql, updateQuery.data);

    if (status[0].affectedRows === 0) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to update record: no rows affected`,
      };
    }

    const readQuery = buildAssignmentsReadQuery(
      updateQuery.data.AssignmentID,
      null,
    );

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

const deleteAssignment = async (deleteQuery) => {
  try {
    const status = await database.query(deleteQuery.sql, deleteQuery.data);

    return status[0].affectedRows === 0
      ? {
          isSuccess: false,
          result: null,
          message: `Failed to delete record: ${deleteQuery.data.AssignmentID}`,
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
const postAssignmentsController = async (req, res) => {
  const record = req.body;
  // Validate request

  // Access database
  const query = buildAssignmentsCreateQuery(record);
  const { isSuccess, result, message } = await createAssignment(query);
  if (!isSuccess) return res.status(404).json({ message });

  // Response to request
  res.status(201).json(result);
};

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

const putAssignmentsController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request

  // Access database
  const query = buildAssignmentsUpdateQuery(record, id);
  const { isSuccess, result, message } = await updateAssignment(query);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteAssignmentController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const query = buildAssignmentsDeleteQuery(id);
  const { isSuccess, result, message } = await deleteAssignment(query);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};
// Endpoints --------------------------------------------
router.post("/", postAssignmentsController);

router.get("/", (req, res) => getAssignmentsController(req, res, null));
router.get("/:id", (req, res) => getAssignmentsController(req, res, null));
router.get("/users/:id", (req, res) =>
  getAssignmentsController(req, res, "users"),
);
router.get("/claims/:id", (req, res) =>
  getAssignmentsController(req, res, "claims"),
);

router.put("/:id", putAssignmentsController);
router.delete("/:id", deleteAssignmentController);
export default router;
