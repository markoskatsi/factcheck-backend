import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Disputes",
  idField: "DisputeID",
  mutableFields: [
    "DisputeDescription",
    "DisputeOutcome",
    "DisputeDisputetypeID",
    "DisputeVerdictID",
  ],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table} INNER JOIN Disputetypes ON Disputes.DisputeDisputetypeID=Disputetypes.DisputetypeID INNER JOIN Verdicts ON Disputes.DisputeVerdictID=Verdicts.VerdictID INNER JOIN Assignments ON Verdicts.VerdictAssignmentID=Assignments.AssignmentID INNER JOIN Claims ON Assignments.AssignmentClaimID=Claims.ClaimID)`;
    fields = [...fields, "DisputetypeName"];

    // Process request queries ----------------
    const allowedQueryFields = [
      ...model.mutableFields,
      "DisputetypeName",
      "DisputeOutcome",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "DisputeID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "verdicts":
        where = "Verdicts.VerdictID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "disputetypes":
        where = "Disputetypes.DisputetypeID=:ID";
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
