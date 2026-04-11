import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Assignments",
  idField: "AssignmentID",
  mutableFields: ["AssignmentUserID", "AssignmentClaimID", "AssignmentRoleID"],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table} INNER JOIN Users ON Assignments.AssignmentUserID=Users.UserID INNER JOIN Claims ON Assignments.AssignmentClaimID=Claims.ClaimID INNER JOIN Claimstatus ON Claims.ClaimClaimstatusID=Claimstatus.ClaimstatusID INNER JOIN Usertypes ON Users.UserUsertypeID=Usertypes.UsertypeID INNER JOIN Roles ON Assignments.AssignmentRoleID=Roles.RoleID)`;
    fields = [
      ...fields,
      "AssignmentCreated",
      "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS AssignedUserName",
      "ClaimTitle",
      "ClaimDescription",
      "ClaimCreated",
      "ClaimstatusName",
      "UsertypeName",
      "UserUsertypeID",
      "RoleName",
      "RoleID",
    ];

    // Process request queries ----------------
    const allowedQueryFields = [
      ...model.mutableFields,
      "AssignmentCreated",
      "AssignedUserName",
      "ClaimTitle",
      "ClaimDescription",
      "ClaimCreated",
      "ClaimstatusName",
      "UsertypeName",
      "UserUsertypeID",
      "RoleName",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "AssignmentID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "claims":
        where = "Assignments.AssignmentClaimID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "users":
        where = "Assignments.AssignmentUserID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "roles":
        where = "Assignments.AssignmentRoleID=:ID";
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
