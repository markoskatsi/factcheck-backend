import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Annotations",
  idField: "AnnotationID",
  mutableFields: [
    "AnnotationTitle",
    "AnnotationDescription",
    "AnnotationAssignmentID",
  ],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table} INNER JOIN Assignments ON Annotations.AnnotationAssignmentID=Assignments.AssignmentID INNER JOIN Users ON Assignments.AssignmentUserID=Users.UserID INNER JOIN Claims ON Assignments.AssignmentClaimID=Claims.ClaimID)`;
    fields = [
      ...fields,
      "AnnotationCreated",
      "Users.UserID AS AnnotationUserID",
      "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS AnnotationUsername",
      "Claims.ClaimID AS AnnotationClaimID",
    ];

    // Process request queries ----------------
    const allowedQueryFields = [
      ...model.mutableFields,
      "AnnotationCreated",
      "AnnotationUsername",
      "AnnotationClaimID",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "AnnotationID=:ID";
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
