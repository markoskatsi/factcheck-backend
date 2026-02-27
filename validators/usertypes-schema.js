import joi from "joi";

const schema = {};

schema.mutableFields = ["UsertypeName", "UsertypeDescription"];
schema.recordSchema = joi
  .object({
    UsertypeID: joi.number().integer(),
    UsertypeName: joi.string().min(3),
    UsertypeDescription: joi.string().min(10),
  })
  .required()
  .unknown(true);

export default schema;
