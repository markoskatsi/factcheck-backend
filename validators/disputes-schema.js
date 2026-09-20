import joi from "joi";

const schema = {};

schema.mutableFields = [
  "DisputeDescription",
  "DisputeOutcome",
  "DisputeDisputetypeID",
  "DisputeVerdictID",
];
schema.recordSchema = joi
  .object({
    DisputeID: joi.number().integer(),
    DisputeDescription: joi.string().min(20),
    DisputeOutcome: joi.number().valid(0, 1, 2),
    DisputeDisputetypeID: joi.number().integer(),
    DisputeVerdictID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default schema;
