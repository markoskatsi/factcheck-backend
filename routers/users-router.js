import { Router } from "express";
import database from "../database.js";

const router = Router();

// Query builders ---------------------------------------
const buildUsersReadQuery = (id, variant) => {
  let sql = "";
  const table =
    "Users INNER JOIN Usertypes ON Users.UserUsertypeID=Usertypes.UsertypeID";
  const fields = [
    "UserID",
    "UserFirstname",
    "UserLastname",
    "UserEmail",
    "UsertypeName",
    "UserUsertypeID",
  ];
  switch (variant) {
    case "usertype":
      sql = `SELECT ${fields} FROM ${table} WHERE Users.UserUsertypeID = :ID`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE UserID = :ID`;
  }

  return { sql: sql, data: { ID: id } };
};

// Data accessorts --------------------------------------
const read = async (id, variant) => {
  try {
    const { sql, data } = buildUsersReadQuery(id, variant);

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
const getUsersController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const { isSuccess, result, message } = await read(id, variant);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};
// Endpoints --------------------------------------------
router.get("/", (req, res) => {
  getUsersController(req, res, null);
});
router.get("/:id", (req, res) => {
  getUsersController(req, res, null);
});
router.get("/usertypes/:id", (req, res) => {
  getUsersController(req, res, "usertype");
});

export default router;
