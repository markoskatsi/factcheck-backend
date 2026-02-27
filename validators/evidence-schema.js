import joi from "joi";

const schema = {};

schema.mutableFields = [
  "EvidenceDescription",
  "EvidenceAnnotationID",
  "EvidenceEvidencetypeID",
  "EvidenceURL",
  "EvidenceFilename",
  "EvidenceFilepath",
];
schema.recordSchema = joi
  .object({
    EvidenceID: joi.number().integer(),
    EvidenceDescription: joi.string().min(20),
    EvidenceAnnotationID: joi.number().integer(),
    EvidenceEvidencetypeID: joi.number().integer(),
    EvidenceURL: joi.string().uri().allow(null, ""),
    EvidenceFilename: joi.string().allow(null, ""),
    EvidenceFilepath: joi.string().uri().allow(null, ""),
  })
  .required()
  .unknown(true);

export default schema;
