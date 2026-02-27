import joi from "joi";

const schema = {};

schema.mutableFields = ["EvidencetypeName", "EvidencetypeDescription"];
schema.recordSchema = joi
  .object({
    EvidencetypeID: joi.number().integer(),
    EvidencetypeName: joi.string().min(3),
    EvidencetypeDescription: joi.string().min(10),
  })
  .required()
  .unknown(true);

export default schema;
