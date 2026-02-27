import joi from "joi";

const schema = {};

schema.mutableFields = ["SourcetypeName", "SourcetypeDescription"];
schema.recordSchema = joi
  .object({
    SourcetypeID: joi.number().integer(),
    SourcetypeName: joi.string().min(3),
    SourcetypeDescription: joi.string().min(10),
  })
  .required()
  .unknown(true);

export default schema;
