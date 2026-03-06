// Imports ---------------------------------
import "dotenv/config";
import express from "express";
import cors from "cors";
import validateApiKey from "./middleware/auth.js";
import claimsRouter from "./routers/claims-router.js";
import sourcesRouter from "./routers/sources-router.js";
import sourcetypesRouter from "./routers/sourcetypes-router.js";
import usersRouter from "./routers/users-router.js";
import usertypesRouter from "./routers/usertypes-router.js";
import assignmentsRouter from "./routers/assignments-router.js";
import evidencetypesRouter from "./routers/evidencetypes-router.js";
import evidenceRouter from "./routers/evidence-router.js";
import annotationsRouter from "./routers/annotations-router.js";

// Configure express app and multer-------------------
const app = express();

// Configure middleware ---------------------
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-api-key",
  );
  next();
});

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controllers ----------------------------
const showApiInfo = async (req, res) => {
  res.status(200).json({
    message: "List of available endpoints",
    endpoints: [
      {
        entity: "Claims",
        path: "/api/claims",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      {
        entity: "Claims by Users",
        path: "/api/claims/users/:id",
        methods: ["GET"],
      },
      {
        entity: "Claims by Status",
        path: "/api/claims/claimstatus/:id",
        methods: ["GET"],
      },
      {
        entity: "Sources",
        path: "/api/sources",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      {
        entity: "Sources by claim",
        path: "/api/sources/claims/:id",
        methods: ["GET"],
      },
      {
        entity: "Source Types",
        path: "/api/sourcetypes",
        methods: ["GET"],
      },
      {
        entity: "Users",
        path: "/api/users",
        methods: ["GET"],
      },
      {
        entity: "Users by User Types",
        path: "/api/users/usertypes/:id",
        methods: ["GET"],
      },
      {
        entity: "User Types",
        path: "/api/usertypes",
        methods: ["GET"],
      },
      {
        entity: "Assignments",
        path: "/api/assignments",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      {
        entity: "Assignments by claim",
        path: "/api/assignments/claims/:id",
        methods: ["GET"],
      },
      {
        entity: "Assignments by user",
        path: "/api/assignments/users/:id",
        methods: ["GET"],
      },
    ],
  });
};

// Endpoints ------------------------------

// Public
app.get("/api", showApiInfo);

// Protected
app.use("/api/claims", validateApiKey, claimsRouter);
app.use("/api/sources", validateApiKey, sourcesRouter);
app.use("/api/sourcetypes", validateApiKey, sourcetypesRouter);
app.use("/api/users", validateApiKey, usersRouter);
app.use("/api/usertypes", validateApiKey, usertypesRouter);
app.use("/api/assignments", validateApiKey, assignmentsRouter);
app.use("/api/evidencetypes", validateApiKey, evidencetypesRouter);
app.use("/api/evidence", validateApiKey, evidenceRouter);
app.use("/api/annotations", validateApiKey, annotationsRouter);

// Start server ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
