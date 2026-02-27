import joi from "joi";

class Validator {
  constructor(schema) {
    this.getSchema = this.idSchema;
    this.postSchema = schema.recordSchema.and(...schema.mutableFields);
    this.putSchema = joi.object({
      id: this.idSchema.required(),
      record: schema.recordSchema.or(...schema.mutableFields),
    });
    this.deleteSchema = this.idSchema.required();
  }

  // Properties ----------------------------------
  idSchema = joi.number().integer().min(1);

  // Helpers -------------------------------------
  reportErrors = (error) => error.details.map((detail) => detail.message);

  validate = (schema, value) => {
    const { error } = schema.validate(value, { abortEarly: false });
    return error
      ? { isValid: false, message: this.reportErrors(error) }
      : { isValid: true, message: null };
  };

  // Methods -------------------------------------
  get = (value) => this.validate(this.getSchema, value);
  delete = (value) => this.validate(this.deleteSchema, value);
  post = (value) => this.validate(this.postSchema, value);
  put = (value) => this.validate(this.putSchema, value);
}

export default Validator;
