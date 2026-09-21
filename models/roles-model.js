import { parseRequestQuery, constructPreparedStatement } from "../utils/query-builder.js";

const model = {
  table: "Roles",
  idField: "RoleID",
  mutableFields: ["RoleName", "RoleDescription"],

  buildReadQuery: (req, variant) => {
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];
    const allowedQueryFields = [...model.mutableFields];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "RoleID=:ID";
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
