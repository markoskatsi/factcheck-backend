import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Claims",
  idField: "ClaimID",
  mutableFields: [
    "ClaimTitle",
    "ClaimDescription",
    "ClaimUserID",
    "ClaimClaimstatusID",
  ],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table} INNER JOIN Users ON Claims.ClaimUserID=Users.UserID INNER JOIN Claimstatus ON Claims.ClaimClaimstatusID=Claimstatus.ClaimstatusID)`;
    fields = [
      ...fields,
      "ClaimCreated",
      "ClaimstatusName",
      "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS ClaimUserName",
    ];

    // Process request queries ----------------
    const allowedQueryFields = [
      ...model.mutableFields,
      "ClaimCreated",
      "ClaimstatusName",
      "ClaimUserName",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "ClaimID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "users":
        where = "Claims.ClaimUserID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "claimstatus":
        where = "Claims.ClaimClaimstatusID=:ID";
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
