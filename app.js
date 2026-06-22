// Imports ---------------------------------
import "dotenv/config";
import express from "express";
import cors from "cors";
import validateJwt from "./middleware/auth.js";
import authRouter from "./routers/auth-router.js";
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
import verdictsRouter from "./routers/verdicts-router.js";
import claimstatusRouter from "./routers/claimstatus-router.js";
import verdictstatusRouter from "./routers/verdictstatus-router.js";
import disputetypesRouter from "./routers/disputetypes-router.js";
import rolesRouter from "./routers/roles-router.js";
import disputesRouter from "./routers/disputes-router.js";
import feedbackRouter from "./routers/feedback-router.js";

// Configure express app and multer-------------------
const app = express();

// Configure middleware ---------------------
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints ------------------------------

// Public
app.get("/api", showApiInfo);
app.use("/api/auth", authRouter);

// Protected
app.use("/api/claims", validateJwt, claimsRouter);
app.use("/api/sources", validateJwt, sourcesRouter);
app.use("/api/sourcetypes", validateJwt, sourcetypesRouter);
app.use("/api/users", usersRouter);
app.use("/api/usertypes", validateJwt, usertypesRouter);
app.use("/api/assignments", validateJwt, assignmentsRouter);
app.use("/api/evidencetypes", validateJwt, evidencetypesRouter);
app.use("/api/evidence", validateJwt, evidenceRouter);
app.use("/api/annotations", validateJwt, annotationsRouter);
app.use("/api/verdicts", validateJwt, verdictsRouter);
app.use("/api/claimstatus", validateJwt, claimstatusRouter);
app.use("/api/verdictstatus", validateJwt, verdictstatusRouter);
app.use("/api/disputetypes", validateJwt, disputetypesRouter);
app.use("/api/disputes", validateJwt, disputesRouter);
app.use("/api/roles", validateJwt, rolesRouter);
app.use("/api/feedback", validateJwt, feedbackRouter);

// Start server ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
