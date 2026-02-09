import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Sources",
  idField: "SourceID",
  mutableFields: [
    "SourceDescription",
    "SourceClaimID",
    "SourceSourcetypeID",
    "SourceURL",
    "SourceFilename",
    "SourceFilepath",
    "SourceFiletype",
    "SourceFilesize",
  ],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table} INNER JOIN Claims ON Sources.SourceClaimID=Claims.ClaimID INNER JOIN Sourcetypes ON Sources.SourceSourcetypeID=Sourcetypes.SourcetypeID)`;
    fields = [...fields, "SourceCreated", "SourcetypeName", "ClaimDescription"];

    // Process request queries ----------------
    const allowedQueryFields = [
      ...model.mutableFields,
      "SourceCreated",
      "SourcetypeName",
      "ClaimDescription",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "SourceID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "claims":
        where = "SourceClaimID=:ID";
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
