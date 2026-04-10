import joi from "joi";

const schema = {};

schema.mutableFields = ["DisputetypeName", "DisputetypeDescription"];
schema.recordSchema = joi
  .object({
    DisputetypeID: joi.number().integer(),
    DisputetypeName: joi.string().min(3),
    DisputetypeDescription: joi.string().min(10),
  })
  .required()
  .unknown(true);

export default schema;
