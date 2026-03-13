import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Verdicts",
  idField: "VerdictID",
  mutableFields: [
    "VerdictDescription",
    "VerdictVerdictstatusID",
    "VerdictAssignmentID",
  ],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table}
      INNER JOIN Assignments ON Verdicts.VerdictAssignmentID = Assignments.AssignmentID
      INNER JOIN Users ON Assignments.AssignmentUserID = Users.UserID
      INNER JOIN Claims ON Assignments.AssignmentClaimID = Claims.ClaimID
      INNER JOIN Claimstatus ON Claims.ClaimClaimstatusID = Claimstatus.ClaimstatusID
      INNER JOIN Verdictstatus ON Verdicts.VerdictVerdictstatusID = Verdictstatus.VerdictstatusID
    )`;

    fields = [
      ...fields,
      "VerdictCreated",
      "Users.UserID AS VerdictUserID",
      "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS VerdictUsername",
      "Verdictstatus.VerdictstatusName AS VerdictStatusName",
      "Claims.ClaimID AS VerdictClaimID",
      "Claims.ClaimTitle AS VerdictClaimTitle",
      "Claims.ClaimDescription AS VerdictClaimDescription",
      "Claimstatus.ClaimstatusName AS VerdictClaimStatus",
    ];

    // Process request queries ----------------
    const allowedQueryFields = [
      ...model.mutableFields,
      "VerdictCreated",
      "VerdictUserID",
      "VerdictClaimID",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "Verdicts.VerdictID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "users":
        where = "Assignments.AssignmentUserID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "claims":
        where = "Claims.ClaimID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
    }

    return constructPreparedStatement(
      fields,
      table,
      where,
      parameters,
      filter,
      orderby,
    );
  },
};

export default model;
