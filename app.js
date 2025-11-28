// Imports ---------------------------------
import "dotenv/config";
import express from "express";
import database from "./database.js";
import cors from "cors";
import multer from "multer";

// Configure express app and multer-------------------
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Configure middleware ---------------------
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controllers ------------------------------
const createClaim = async (sql, record) => {
  try {
    const status = await database.query(sql, record);
    const recoverRecordSql = buildClaimsSelectSql(status[0].insertId, null);

    const { isSuccess, result, message } = await read(recoverRecordSql);

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
const createSource = async (sql, record) => {
  try {
    const status = await database.query(sql, record);
    const recoverRecordSql = buildSourcesSelectSql(status[0].insertId, null);

    const { isSuccess, result, message } = await read(recoverRecordSql);

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

const read = async (selectSql) => {
  try {
    const [result] = await database.query(selectSql);
    return result.length === 0
      ? { isSuccess: false, result: null, message: "No record(s) found" }
      : { isSuccess: true, result: result, message: "Record(s) recovered" };
  } catch (error) {
    return {
      isSuccess: false,
      result: null,
      message: `Failed to execute query: ${error.message}`,
    };
  }
};

const buildSetField = (fields) =>
  fields.reduce(
    (setSQL, field, index) =>
      setSQL + `${field}=:${field}` + (index === fields.length - 1 ? "" : ", "),
    " SET "
  );

const buildClaimsInsertSql = (record) => {
  const table = "Claims";
  const mutableFields = [
    "ClaimTitle",
    "ClaimDescription",
    "ClaimUserID",
    "ClaimClaimstatusID",
  ];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  return `INSERT INTO ${table}` + buildSetField(mutableFields);
};

const buildSourcesInsertSql = (record) => {
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
  return `INSERT INTO ${table}` + buildSetField(mutableFields);
};

const buildClaimsSelectSql = (id, variant) => {
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
      sql = `SELECT ${fields} FROM ${table} WHERE Claims.ClaimUserID = ${id} ORDER BY ClaimCreated DESC`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE ClaimID = ${id}`;
      sql += ` ORDER BY ClaimCreated DESC`;
  }

  return sql;
};

const buildSourcetypesSelectSql = (id, variant) => {
  let sql = "";
  const table = "Sourcetypes";
  const fields = ["SourcetypeID", "SourcetypeName", "SourcetypeDescription"];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE SourcetypeID = ${id}`;

  return sql;
};

const buildSourcesSelectSql = (id, variant) => {
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
      sql = `SELECT ${fields} FROM ${table} WHERE SourceClaimID = ${id} ORDER BY SourceCreated DESC`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table} ORDER BY SourceCreated DESC`;
      if (id) sql += ` WHERE SourceID = ${id}`;
  }

  return sql;
};

const buildUsersSelectSql = (id, variant) => {
  let sql = "";
  const table = "Users";
  const fields = ["UserID", "UserFirstname", "UserLastname", "UserEmail", "UserType"];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE UserID = ${id}`;

  return sql;
};

const getClaimsController = async (res, id, variant) => {
  // Validate request

  // Access database
  const sql = buildClaimsSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const getUsersController = async (res, id, variant) => {
  // Validate request

  // Access database
  const sql = buildUsersSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const getSourcetypesController = async (res, id, variant) => {
  // Validate request
  // Access database
  const sql = buildSourcetypesSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const postClaimsController = async (req, res) => {
  // Validate request

  // Access database
  const sql = buildClaimsInsertSql(req.body);
  const { isSuccess, result, message } = await createClaim(sql, req.body);
  if (!isSuccess) return res.status(404).json({ message });
  // Response to request
  res.status(201).json(result);
};

const getSourcesController = async (res, id, variant) => {
  // Validate request

  // Access database
  const sql = buildSourcesSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const postSourcesController = async (req, res) => {
  // Validate request
  if (req.file) {
    req.body.SourceFilename = req.file.originalname;
    req.body.SourceFilepath = `/uploads/${req.file.filename}`;
    req.body.SourceFiletype = req.file.mimetype;
    req.body.SourceFilesize = req.file.size;
  }

  // Access database
  const sql = buildSourcesInsertSql(req.body);
  const { isSuccess, result, message } = await createSource(sql, req.body);
  if (!isSuccess) return res.status(404).json({ message });
  // Response to request
  res.status(201).json(result);
};

// Endpoints ------------------------------
// Claims
app.get("/api/claims", (req, res) => getClaimsController(res, null, null));
app.get("/api/claims/:id", (req, res) =>
  getClaimsController(res, req.params.id, null)
);
app.get("/api/claims/users/:id", (req, res) =>
  getClaimsController(res, req.params.id, "users")
);

app.post("/api/claims", postClaimsController);

// Sources
app.get("/api/sources", (req, res) => getSourcesController(res, null, null));
app.get("/api/sources/:id", (req, res) =>
  getSourcesController(res, req.params.id, null)
);
app.get("/api/sources/claims/:id", (req, res) =>
  getSourcesController(res, req.params.id, "claims")
);

app.post("/api/sources", upload.single("file"), postSourcesController);

app.get("/api/sourcetypes", (req, res) =>
  getSourcetypesController(res, null, null)
);
// Users
app.get("/api/users", (req, res) => {
  getUsersController(res, null, null);
});
// Start server ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
