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
const deleteClaim = async (sql, id) => {
  try {
    const status = await database.query(sql, { ClaimID: id });

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

const deleteSource = async (sql, id) => {
  try {
    const status = await database.query(sql, { SourceID: id });

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

const updateClaim = async (sql, id, record) => {
  try {
    const status = await database.query(sql, { ...record, ClaimID: id });

    if (status[0].affectedRows === 0) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to update record: no rows affected`,
      };
    }

    const recoverRecordSql = buildClaimsSelectSql(id, null);

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

const updateSource = async (sql, id, record) => {
  try {
    const status = await database.query(sql, { ...record, SourceID: id });

    if (status[0].affectedRows === 0) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to update record: no rows affected`,
      };
    }

    const recoverRecordSql = buildSourcesSelectSql(id, null);

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

const read = async (sql, id) => {
  try {
    const [result] = await database.query(sql, { ID: id });
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

const buildSetField = (fields) =>
  fields.reduce(
    (setSQL, field, index) =>
      setSQL + `${field}=:${field}` + (index === fields.length - 1 ? "" : ", "),
    " SET "
  );

const buildClaimsDeleteSql = () => {
  const table = "Claims";
  return `DELETE FROM ${table} WHERE ClaimID=:ClaimID`;
};

const buildSourcesDeleteSql = () => {
  const table = "Sources";
  return `DELETE FROM ${table} WHERE SourceID=:SourceID`;
};

const buildClaimsUpdateSql = () => {
  const table = "Claims";
  const mutableFields = [
    "ClaimTitle",
    "ClaimDescription",
    "ClaimUserID",
    "ClaimClaimstatusID",
  ];

  console.log("SQL : " + `INSERT INTO ${table}` + buildSetField(mutableFields));
  return (
    `UPDATE ${table}` + buildSetField(mutableFields) + ` WHERE ClaimID=:ClaimID`
  );
};

const buildSourcesUpdateSql = () => {
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
  return (
    `UPDATE ${table}` +
    buildSetField(mutableFields) +
    ` WHERE SourceID=:SourceID`
  );
};

const buildClaimsInsertSql = () => {
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

const buildSourcesInsertSql = () => {
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

  return sql;
};

const buildSourcetypesSelectSql = (id) => {
  let sql = "";
  const table = "Sourcetypes";
  const fields = ["SourcetypeID", "SourcetypeName", "SourcetypeDescription"];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE SourcetypeID = ${id}`;

  return sql;
};

const buildUsertypesSelectSql = (id) => {
  let sql = "";
  const table = "Usertypes";
  const fields = ["UsertypeID", "UsertypeName", "UsertypeDescription"];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE UsertypeID = ${id}`;

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
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE SourceID = ${id}`;
      sql += ` ORDER BY SourceCreated DESC`;
  }

  return sql;
};

const buildUsersSelectSql = (id) => {
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

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE UserID = ${id}`;

  return sql;
};

const getClaimsController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const sql = buildClaimsSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql, id);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const getUsersController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const sql = buildUsersSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const getSourcetypesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const sql = buildSourcetypesSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const getUsertypesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request
  // Access database
  const sql = buildUsertypesSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const getSourcesController = async (req, res, variant) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const sql = buildSourcesSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(400).json({ message });
  // Response to request
  res.status(200).json(result);
};

const postClaimsController = async (req, res) => {
  const record = req.body;
  // Validate request

  // Access database
  const sql = buildClaimsInsertSql();
  const { isSuccess, result, message } = await createClaim(sql, record);
  if (!isSuccess) return res.status(404).json({ message });
  // Response to request
  res.status(201).json(result);
};

const postSourcesController = async (req, res) => {
  const record = req.body;
  // Validate request
  if (req.file) {
    req.body.SourceFilename = req.file.originalname;
    req.body.SourceFilepath = `/uploads/${req.file.filename}`;
    req.body.SourceFiletype = req.file.mimetype;
    req.body.SourceFilesize = req.file.size;
  }

  // Access database
  const sql = buildSourcesInsertSql();
  const { isSuccess, result, message } = await createSource(sql, record);
  if (!isSuccess) return res.status(404).json({ message });
  // Response to request
  res.status(201).json(result);
};

const putClaimsController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request

  // Access database
  const sql = buildClaimsUpdateSql();
  const { isSuccess, result, message } = await updateClaim(sql, id, record);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const putSourcesController = async (req, res) => {
  const id = req.params.id;
  const record = req.body;
  // Validate request

  // Access database
  const sql = buildSourcesUpdateSql();
  const { isSuccess, result, message } = await updateSource(sql, id, record);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json(result);
};

const deleteClaimController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const sql = buildClaimsDeleteSql();
  const { isSuccess, result, message } = await deleteClaim(sql, id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};

const deleteSourceController = async (req, res) => {
  const id = req.params.id;
  // Validate request

  // Access database
  const sql = buildSourcesDeleteSql();
  const { isSuccess, result, message } = await deleteSource(sql, id);
  if (!isSuccess) return res.status(400).json({ message });

  // Response to request
  res.status(200).json({ message });
};

// Endpoints ------------------------------
// Claims
app.get("/api/claims", (req, res) => getClaimsController(req, res, null));
app.get("/api/claims/:id", (req, res) => getClaimsController(req, res, null));
app.get("/api/claims/users/:id", (req, res) =>
  getClaimsController(req, res, "users")
);
app.post("/api/claims", postClaimsController);
app.put("/api/claims/:id", putClaimsController);
app.delete("/api/claims/:id", deleteClaimController);

// Claimstatus
app.get("/api/claims/claimstatus/:id", (req, res) =>
  getClaimsController(req, res, "claimstatus")
);

// Sources
app.get("/api/sources", (req, res) => getSourcesController(req, res, null));
app.get("/api/sources/:id", (req, res) => getSourcesController(req, res, null));
app.get("/api/sources/claims/:id", (req, res) =>
  getSourcesController(req, res, "claims")
);
app.post("/api/sources", upload.single("file"), postSourcesController);
app.put("/api/sources/:id", putSourcesController);
app.delete("/api/sources/:id", deleteSourceController);

// Sourcetypes
app.get("/api/sourcetypes", (req, res) =>
  getSourcetypesController(req, res, null)
);
// Users
app.get("/api/users", (req, res) => {
  getUsersController(req, res, null);
});
// Usertypes
app.get("/api/usertypes", (req, res) => getUsertypesController(req, res, null));
// Start server ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
