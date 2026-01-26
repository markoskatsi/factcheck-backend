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
});
// Start server ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
