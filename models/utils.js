export const parseRequestQuery = (req, allowedFields) => {
  let ordering = null;
  let filter = { sql: "", parameters: {} };
  // console.log("req.query:", req.query);
  // console.log("allowedFields:", allowedFields);
  for (const key in req.query)
    switch (true) {
      case allowedFields.includes(key):
        filter.sql += `${filter.sql.length !== 0 ? " AND " : ""}${key}=:${key}`; // Prepared statement
        filter.parameters[key] = req.query[key]; // Data for prepared statement
        break;
      case key === "orderby":
        req.query.orderby
          .split(/[ ,]+/)
          .filter((field) => !["asc", "ASC", "desc", "DESC"].includes(field))
          .every((field) => allowedFields.includes(field))
          ? (ordering = req.query.orderby)
          : console.warn(
              `[buildReadQuery] The 'orderby' argument "${req.query.orderby}" should only contain fields from the list "${allowedFields}"`,
            );
        break;
    }
  return [filter.sql.length === 0 ? null : filter, ordering];
};

export const constructPreparedStatement = (
  fields,
  table,
  where,
  parameters,
  filter,
  orderby,
) => {
  where = `${where ? `WHERE ${where}` : ""}`;
  orderby = `${orderby ? `ORDER BY ${orderby}` : ""}`;
  let sql = `SELECT ${fields} FROM ${table} ${where} ${orderby}`;
  if (filter) {
    // Filter fields are sometimes aliases which are not accesssible to the above SELECT where clause
    sql = `SELECT * FROM ( ${sql} ) AS subquery WHERE ${filter.sql}`;
    parameters = Object.assign(parameters, filter.parameters);
  }

//   console.log(`SQL=[${sql}]`);
//   console.log(`Parameters=[${JSON.stringify(parameters)}]`);
  return { sql, parameters };
};
