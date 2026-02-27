import joi from "joi";

const schema = {};

schema.mutableFields = [
  "AnnotationTitle",
  "AnnotationDescription",
  "AnnotationAssignmentID",
];
schema.recordSchema = joi
  .object({
    AnnotationID: joi.number().integer(),
    AnnotationTitle: joi.string().min(8),
    AnnotationDescription: joi.string().min(20),
    AnnotationAssignmentID: joi.number().integer(),
  })
  .required()
  .unknown(true);

export default schema;
