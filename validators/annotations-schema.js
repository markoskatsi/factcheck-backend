import joi from "joi";

const schema = {};

schema.mutableFields = [
  "AnnotationDescription",
  "AnnotationAssignmentID",
];
schema.recordSchema = joi
  .object({
    AnnotationID: joi.number().integer(),
    AnnotationDescription: joi.string().min(20),
    AnnotationAssignmentID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default schema;
