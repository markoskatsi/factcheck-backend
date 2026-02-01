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

  buildCreateQuery = (record) => {
    const sql =
      `INSERT INTO ${this.table}` + this.buildSetFields(this.mutableFields);
    return { sql, data: record };
  };

  buildUpdateQuery = (record, id) => {
    const sql =
      `UPDATE ${this.table}` +
      this.buildSetFields(this.mutableFields) +
      ` WHERE ${this.idField}=:${this.idField}`;
    return { sql, data: { ...record, [this.idField]: id } };
  };

  buildDeleteQuery = (id) => {
    const sql = `DELETE FROM ${this.table} WHERE ${this.idField}=:${this.idField}`;
    return { sql, data: { [this.idField]: id } };
  };
}

export default Model;
