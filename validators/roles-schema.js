import joi from "joi";

const schema = {};

schema.mutableFields = ["RoleName", "RoleDescription"];
schema.recordSchema = joi
  .object({
    RoleID: joi.number().integer(),
    RoleName: joi.string().min(3),
    RoleDescription: joi.string().min(10),
  })
  .required()
  .unknown(true);

export default schema;
