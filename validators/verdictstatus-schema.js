import joi from "joi";

const schema = {};

schema.mutableFields = ["VerdictstatusName", "VerdictstatusDescription"];
schema.recordSchema = joi
  .object({
    VerdictstatusID: joi.number().integer(),
    VerdictstatusName: joi.string().min(3),
    VerdictstatusDescription: joi.string().min(10),
  })
  .required()
  .unknown(true);

export default schema;
