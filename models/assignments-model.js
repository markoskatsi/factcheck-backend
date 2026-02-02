const model = {};

model.table = "Assignments";
model.mutableFields = ["AssignmentUserID", "AssignmentClaimID"];
model.idField = "AssignmentID";

model.buildReadQuery = (id, variant) => {
  let sql = "";
  const resolvedTable =
    "Assignments INNER JOIN Users ON Assignments.AssignmentUserID=Users.UserID INNER JOIN Claims ON Assignments.AssignmentClaimID=Claims.ClaimID INNER JOIN Claimstatus ON Claims.ClaimClaimstatusID=Claimstatus.ClaimstatusID";
  const resolvedFields = [
    model.idField,
    ...model.mutableFields,
    "AssignmentCreated",
    "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS AssignedUserName",
    "Claims.ClaimTitle AS ClaimTitle",
    "Claims.ClaimDescription AS ClaimDescription",
    "Claims.ClaimCreated AS ClaimCreated",
    "Claimstatus.ClaimstatusName AS ClaimstatusName",
  ];
  switch (variant) {
    case "claims":
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable} WHERE Assignments.AssignmentClaimID =:ID`;
      break;
    case "users":
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable} WHERE Assignments.AssignmentUserID =:ID`;
      break;
    default:
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable}`;
      if (id) sql += ` WHERE ${model.idField} =:ID`;
  }

  return { sql: sql, data: { ID: id } };
};

export default model;
