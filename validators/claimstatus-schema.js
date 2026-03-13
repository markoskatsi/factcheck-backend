import joi from "joi";

const schema = {};

schema.mutableFields = ["ClaimstatusName", "ClaimstatusDescription"];
schema.recordSchema = joi
  .object({
    ClaimstatusID: joi.number().integer(),
    ClaimstatusName: joi.string().min(3),
    ClaimstatusDescription: joi.string().min(10),
  })
  .required()
  .unknown(true);

export default schema;
