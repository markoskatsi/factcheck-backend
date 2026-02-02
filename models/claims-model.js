const model = {};

model.table = "Claims";
model.mutableFields = [
  "ClaimTitle",
  "ClaimDescription",
  "ClaimUserID",
  "ClaimClaimstatusID",
];
model.idField = "ClaimID";

model.buildReadQuery = (id, variant) => {
  let sql = "";
  const resolvedTable =
    "Claims INNER JOIN Users ON Claims.ClaimUserID=Users.UserID INNER JOIN Claimstatus ON Claims.ClaimClaimstatusID=Claimstatus.ClaimstatusID";
  const resolvedFields = [
    model.idField,
    ...model.mutableFields,
    "ClaimCreated",
    "ClaimstatusName",
    "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS ClaimUserName",
  ];

  switch (variant) {
    case "users":
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable} WHERE Claims.ClaimUserID =:ID ORDER BY ClaimCreated DESC`;
      break;
    case "claimstatus":
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable} WHERE Claims.ClaimClaimstatusID =:ID ORDER BY ClaimCreated DESC`;
      break;
    default:
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable}`;
      if (id) sql += ` WHERE ${model.idField} =:ID`;
      sql += ` ORDER BY ClaimCreated DESC`;
  }

  return { sql: sql, data: { ID: id } };
};

export default model;
