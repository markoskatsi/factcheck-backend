const model = {};

model.table = "Sources";
model.mutableFields = [
  "SourceDescription",
  "SourceClaimID",
  "SourceSourcetypeID",
  "SourceURL",
  "SourceFilename",
  "SourceFilepath",
  "SourceFiletype",
  "SourceFilesize",
];
model.idField = "SourceID";
model.buildReadQuery = (id, variant) => {
  let sql = "";
  const resolvedTable =
    "Sources INNER JOIN Claims ON Sources.SourceClaimID=Claims.ClaimID INNER JOIN Sourcetypes ON Sources.SourceSourcetypeID=Sourcetypes.SourcetypeID";
  const resolvedFields = [
    model.idField,
    ...model.mutableFields,
    "SourceCreated",
    "SourcetypeName",
    "ClaimDescription",
  ];

  switch (variant) {
    case "claims":
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable} WHERE SourceClaimID = :ID ORDER BY SourceCreated DESC`;
      break;
    default:
      sql = `SELECT ${resolvedFields} FROM ${resolvedTable}`;
      if (id) sql += ` WHERE ${model.idField} = :ID`;
      sql += ` ORDER BY SourceCreated DESC`;
  }

  return { sql: sql, data: { ID: id } };
};

export default model;
