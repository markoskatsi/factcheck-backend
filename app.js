// Imports ---------------------------------
import "dotenv/config";
import express from "express";
import cors from "cors";
import claimsRouter from "./routers/claims-router.js";
import sourcesRouter from "./routers/sources-router.js";
import sourcetypesRouter from "./routers/sourcetypes-router.js";
import usersRouter from "./routers/users-router.js";
import usertypesRouter from "./routers/usertypes-router.js";
import assignmentsRouter from "./routers/assignments-router.js";

// Configure express app and multer-------------------
const app = express();

// Configure middleware ---------------------
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints ------------------------------
app.use("/api/claims", claimsRouter);
app.use("/api/sources", sourcesRouter);
app.use("/api/sourcetypes", sourcetypesRouter);
app.use("/api/users", usersRouter);
app.use("/api/usertypes", usertypesRouter);
app.use("/api/assignments", assignmentsRouter);
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "List of available endpoints",
    endpoints: [
      [
        { entity: "Claims", sap: "/api/claims" },
        { entity: "Users claims", sap: "/api/claims/users" },
      ],
      { entity: "Sources", sap: "/api/sources" },
      { entity: "Source Types", sap: "/api/sourcetypes" },
      { entity: "Users", sap: "/api/users" },
      { entity: "User Types", sap: "/api/usertypes" },
      { entity: "Assignments", sap: "/api/assignments" },
    ],
  });
});
// Start server ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
