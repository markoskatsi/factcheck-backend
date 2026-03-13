import joi from "joi";

const schema = {};

schema.mutableFields = [
  "VerdictDescription",
  "VerdictVerdictstatusID",
  "VerdictAssignmentID",
];

schema.recordSchema = joi
  .object({
    VerdictID: joi.number().integer(),
    VerdictDescription: joi.string().min(20),
    VerdictVerdictstatusID: joi.number().integer(),
    VerdictAssignmentID: joi.number().integer(),
    VerdictCreated: joi.date(),
  })
  .required()
  .unknown(true);

export default schema;