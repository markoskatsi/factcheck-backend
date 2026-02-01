const model = {};

model.table = "Usertypes";
model.mutableFields = ["UsertypeName", "UsertypeDescription"];
model.idField = "UsertypeID";

model.buildReadQuery = (id) => {
  let sql = "";
  const table = "Usertypes";
  const fields = [model.idField, ...model.mutableFields];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE ${model.idField} =:ID`;

  return { sql: sql, data: { ID: id } };
};

export default model;
