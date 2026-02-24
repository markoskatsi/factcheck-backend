import joi from "joi";

const validator = {};

validator.reportErrors = (error) =>
  error.details.map((detail) => detail.message);
validator.idSchema = joi.number().integer().min(1);
validator.mutableFields = [
  "ClaimTitle",
  "ClaimDescription",
  "ClaimUserID",
  "ClaimClaimstatusID",
];
validator.recordSchema = joi
  .object({
    ClaimID: joi.number().integer(),
    ClaimTitle: joi.string().min(8),
    ClaimDescription: joi.string().min(20),
    ClaimUserID: joi.number().integer(),
    ClaimClaimstatusID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default validator;
