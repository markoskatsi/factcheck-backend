import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Claimstatus",
  idField: "ClaimstatusID",
  mutableFields: ["ClaimstatusName", "ClaimstatusDescription"],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Process request queries ----------------
    const allowedQueryFields = [...model.mutableFields];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "ClaimstatusID=:ID";
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
