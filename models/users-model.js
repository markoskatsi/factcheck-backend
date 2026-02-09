import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Users",
  idField: "UserID",
  mutableFields: [
    "UserFirstname",
    "UserLastname",
    "UserEmail",
    "UserUsertypeID",
  ],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table} INNER JOIN Usertypes ON Users.UserUsertypeID=Usertypes.UsertypeID)`;
    fields = [...fields, "Usertypes.UsertypeName"];

    // Process request queries ----------------
    const allowedQueryFields = [...model.mutableFields, "UsertypeName"];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "UserID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "usertype":
        where = "Users.UserUsertypeID=:ID";
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
