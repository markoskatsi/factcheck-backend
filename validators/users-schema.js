import joi from "joi";

const schema = {};

schema.mutableFields = [
  "UserFirstname",
  "UserLastname",
  "UserEmail",
  "UserPassword",
  "UserUsertypeID",
];
schema.recordSchema = joi
  .object({
    UserID: joi.number().integer(),
    UserFirstname: joi.string().min(2),
    UserLastname: joi.string().min(2),
    UserEmail: joi.string().email(),
    UserPassword: joi.string().min(8),
    UserUsertypeID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default schema;
