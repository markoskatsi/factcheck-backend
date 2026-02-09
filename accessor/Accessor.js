class Accessor {
  constructor(model, database) {
    this.model = model;
    this.database = database;
  }

  // Methods
  create = async (req) => {
    try {
      const { sql, parameters } = this.model.buildCreateQuery(req);
      const status = await this.database.query(sql, parameters);

      const { isSuccess, result, message } = await this.read(
        { params: { id: status[0].insertId } },
        "primary",
      );
      // { params: { id: status[0].insertId } } simulates the request object, 'req', that the 'read' method expects
      return isSuccess
        ? {
            isSuccess: true,
            result: result,
            message: "Record successfully recovered",
          }
        : {
            isSuccess: false,
            result: null,
            message: `Failed to recover the inserted record: ${message}`,
          };
    } catch (error) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to execute query: ${error.message}`,
      };
    }
  };

  read = async (req, variant) => {
    try {
      const { sql, parameters } = this.model.buildReadQuery(req, variant);
      const [result] = await this.database.query(sql, parameters);
      return result.length === 0
        ? { isSuccess: false, result: null, message: "No record(s) found" }
        : {
            isSuccess: true,
            result: result,
            message: "Record(s) successfully recovered",
          };
    } catch (error) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to execute query: ${error.message}`,
      };
    }
  };

  update = async (req) => {
    try {
      const { sql, parameters } = this.model.buildUpdateQuery(req);
      const status = await this.database.query(sql, parameters);
      if (status[0].affectedRows === 0)
        return {
          isSuccess: false,
          result: null,
          message: "Failed to update record: no rows affected",
        };

      const { isSuccess, result, message } = await this.read(req, "primary");
      return isSuccess
        ? {
            isSuccess: true,
            result: result,
            message: "Record successfully recovered",
          }
        : {
            isSuccess: false,
            result: null,
            message: `Failed to recover the updated record: ${message}`,
          };
    } catch (error) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to execute query: ${error.message}`,
      };
    }
  };

  delete = async (req) => {
    try {
      const { sql, parameters } = this.model.buildDeleteQuery(req);
      const status = await this.database.query(sql, parameters);
      return status[0].affectedRows === 0
        ? {
            isSuccess: false,
            result: null,
            message: `Failed to delete record ${req.params.id}`,
          }
        : {
            isSuccess: true,
            result: null,
            message: "Record successfully deleted",
          };
    } catch (error) {
      return {
        isSuccess: false,
        result: null,
        message: `Failed to execute query: ${error.message}`,
      };
    }
  };
}

export default Accessor;
