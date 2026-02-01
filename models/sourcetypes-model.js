const model = {};

model.table = "Sourcetypes";
model.mutableFields = ["SourcetypeName", "SourcetypeDescription"];
model.idField = "SourcetypeID";

model.buildReadQuery = (id) => {
  let sql = "";
  const table = "Sourcetypes";
  const fields = ["SourcetypeID", "SourcetypeName", "SourcetypeDescription"];

  sql = `SELECT ${fields} FROM ${table}`;
  if (id) sql += ` WHERE ${model.idField} =:ID`;

  return { sql: sql, data: { ID: id } };
};

export default model;
