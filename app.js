// Imports ---------------------------------
import "dotenv/config";
import express from "express";
import cors from "cors";
import validateApiKey from "./middleware/auth.js";
import showApiInfo from "./controllers/api-info-controller.js";
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
