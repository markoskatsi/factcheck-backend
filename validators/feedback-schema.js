import joi from "joi";

const schema = {};

schema.mutableFields = ["FeedbackScore", "FeedbackAssignmentID"];

schema.recordSchema = joi
  .object({
    FeedbackID: joi.number().integer(),
    FeedbackScore: joi.number().integer().min(1).max(5),
    FeedbackComment: joi.string().allow("", null),
    FeedbackAssignmentID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default schema;
