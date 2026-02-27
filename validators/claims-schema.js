import joi from "joi";

const schema = {};

schema.mutableFields = [
  "ClaimTitle",
  "ClaimDescription",
  "ClaimUserID",
  "ClaimClaimstatusID",
];
schema.recordSchema = joi
  .object({
    ClaimID: joi.number().integer(),
    ClaimTitle: joi.string().min(8),
    ClaimDescription: joi.string().min(20),
    ClaimUserID: joi.number().integer(),
    ClaimClaimstatusID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default schema;
