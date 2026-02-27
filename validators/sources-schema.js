import joi from "joi";

const schema = {};

schema.mutableFields = [
  "SourceDescription",
  "SourceClaimID",
  "SourceSourcetypeID",
  "SourceURL",
  "SourceFilename",
  "SourceFilepath",
  "SourceFiletype",
  "SourceFilesize",
];
schema.recordSchema = joi
  .object({
    SourceID: joi.number().integer(),
    SourceDescription: joi.string().min(20),
    SourceClaimID: joi.number().integer(),
    SourceSourcetypeID: joi.number().integer(),
    SourceURL: joi.string().uri().allow(null, ""),
    SourceFilename: joi.string().allow(null, ""),
    SourceFilepath: joi.string().uri().allow(null, ""),
    SourceFiletype: joi.string().allow(null, ""),
    SourceFilesize: joi.number().integer().allow(null),
  })
  .required()
  .unknown(true);

export default schema;
