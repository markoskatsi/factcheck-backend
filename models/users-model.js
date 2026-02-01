const model = {};

model.table = "Users";
model.mutableFields = [
  "UserFirstname",
  "UserLastname",
  "UserEmail",
  "UserUsertypeID",
];
model.idField = "UserID";

model.buildReadQuery = (id, variant) => {
  let sql = "";
  const resolvedTable =
    "Users INNER JOIN Usertypes ON Users.UserUsertypeID=Usertypes.UsertypeID";
  const resolvedFields = [
    model.idField,
    ...model.mutableFields,
    "Usertypes.UsertypeName",
  ];
  switch (variant) {
    case "usertype":
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable} WHERE Users.UserUsertypeID = :ID`;
      break;
    default:
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable}`;
      if (id) sql += ` WHERE ${model.idField} = :ID`;
  }

  return { sql: sql, data: { ID: id } };
};

export default model;
