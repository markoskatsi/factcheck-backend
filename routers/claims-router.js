import { Router } from "express";
import database from "../database.js";

const router = Router();

// Query builders ---------------------------------------
const buildSetField = (fields) =>
  fields.reduce(
    (setSQL, field, index) =>
      setSQL + `${field}=:${field}` + (index === fields.length - 1 ? "" : ", "),
    " SET "
  );

const buildClaimsCreateQuery = (record) => {
  const table = "Claims";
  const mutableFields = [
    "ClaimTitle",
    "ClaimDescription",
    "ClaimUserID",
    "ClaimClaimstatusID",
  ];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  const sql = `INSERT INTO ${table}` + buildSetField(mutableFields);
  return { sql, data: record };
};

const buildClaimsReadQuery = (id, variant) => {
  let sql = "";
  const table =
    "Claims INNER JOIN Users ON Claims.ClaimUserID=Users.UserID INNER JOIN Claimstatus ON Claims.ClaimClaimstatusID=Claimstatus.ClaimstatusID";
  const fields = [
    "ClaimID",
    "ClaimTitle",
    "ClaimDescription",
    "ClaimCreated",
    "ClaimstatusName",
    "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS ClaimUserName",
    "ClaimUserID",
    "ClaimClaimstatusID",
  ];

  switch (variant) {
    case "users":
      sql = `SELECT ${fields} FROM ${table} WHERE Claims.ClaimUserID =:ID ORDER BY ClaimCreated DESC`;
      break;
    case "claimstatus":
      sql = `SELECT ${fields} FROM ${table} WHERE Claims.ClaimClaimstatusID =:ID ORDER BY ClaimCreated DESC`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE ClaimID =:ID`;
      sql += ` ORDER BY ClaimCreated DESC`;
  }

  return { sql: sql, data: { ID: id } };
};

const buildClaimsUpdateQuery = (record, id) => {
  const table = "Claims";
  const mutableFields = [
    "ClaimTitle",
    "ClaimDescription",
    "ClaimUserID",
    "ClaimClaimstatusID",
  ];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  const sql =
    `UPDATE ${table}` +
    buildSetField(mutableFields) +
    ` WHERE ClaimID=:ClaimID`;
  return { sql, data: { ...record, ClaimID: id } };
};

const buildClaimsDeleteQuery = (id) => {
  const table = "Claims";
  const sql = `DELETE FROM ${table} WHERE ClaimID=:ClaimID`;
  return { sql, data: { ClaimID: id } };
};

// Data accessorts --------------------------------------
const createClaim = async (createQuery) => {
  try {
    const status = await database.query(createQuery.sql, createQuery.data);
    const readQuery = buildClaimsReadQuery(status[0].insertId, null);

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

const updateClaim = async (updateQuery) => {
  try {
    const status = await database.query(updateQuery.sql, updateQuery.data);

    if (status[0].affectedRows === 0) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to update record: no rows affected`,
      };
    }

    const readQuery = buildClaimsReadQuery(updateQuery.data.ClaimID, null);

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

const deleteClaim = async (deleteQuery) => {
  try {
    const status = await database.query(deleteQuery.sql, deleteQuery.data);

    return status[0].affectedRows === 0
      ? {
          isSuccess: false,
          result: null,
          message: `Failed to delete record: ${deleteQuery.data.ClaimID}`,
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
  const query = buildClaimsCreateQuery(record);
  const { isSuccess, result, message } = await createClaim(query);
  if (!isSuccess) return res.status(404).json({ message });

  // Response to request
  res.status(201).json(result);
};

const getClaimsController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const query = buildClaimsReadQuery(id, variant);
  const { isSuccess, result, message } = await read(query);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const putClaimsController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request

  // Access database
  const query = buildClaimsUpdateQuery(record, id);
  const { isSuccess, result, message } = await updateClaim(query);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteClaimController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const query = buildClaimsDeleteQuery(id);
  const { isSuccess, result, message } = await deleteClaim(query);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};

// Endpoints --------------------------------------------

router.get("/", (req, res) => getClaimsController(req, res, null));
router.get("/:id", (req, res) => getClaimsController(req, res, null));
router.get("/users/:id", (req, res) => getClaimsController(req, res, "users"));
router.get("/claimstatus/:id", (req, res) =>
  getClaimsController(req, res, "claimstatus")
);

router.post("/", postClaimsController);

router.put("/:id", putClaimsController);

router.delete("/:id", deleteClaimController);

export default router;
