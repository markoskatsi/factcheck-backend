import joi from "joi";

const schema = {};

schema.mutableFields = ["AssignmentUserID", "AssignmentClaimID"];
schema.recordSchema = joi
  .object({
    AssignmentID: joi.number().integer(),
    AssignmentUserID: joi.number().integer(),
    AssignmentClaimID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default schema;
