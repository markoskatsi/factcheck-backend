class Model {
  constructor(model) {
    this.table = model.table;
    this.mutableFields = model.mutableFields;
    this.idField = model.idField;
    this.buildReadQuery = model.buildReadQuery;
  }

  // Methods
  buildSetFields = (fields) =>
    fields.reduce(
      (setSQL, field, index) =>
        setSQL +
        `${field}=:${field}` +
        (index === fields.length - 1 ? "" : ", "),
      " SET ",
    );

  buildCreateQuery = (req) => {
    const sql =
      `INSERT INTO ${this.table}` + this.buildSetFields(this.mutableFields);
    return { sql, parameters: req.body };
  };

  buildUpdateQuery = (req) => {
    const allowedRecordFields = this.mutableFields.filter((field) => req.body.hasOwnProperty(field));
    const sql =
      `UPDATE ${this.table}` +
      this.buildSetFields(allowedRecordFields) +
      ` WHERE ${this.idField}=:${this.idField}`;
    return { sql, parameters: { ...req.body, [this.idField]: req.params.id } };
  };

  buildDeleteQuery = (req) => {
    const sql = `DELETE FROM ${this.table} WHERE ${this.idField}=:${this.idField}`;
    return { sql, parameters: { [this.idField]: req.params.id } };
  };
}

export default Model;
