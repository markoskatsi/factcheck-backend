import joi from "joi";

class Controller {
  constructor(accessor) {
    this.accessor = accessor;
  }
  // Methods
  reportErrors = (error) => error.details.map((detail) => detail.message);
  post = async (req, res) => {
    const record = req.body;
    // Validate request
    const mutableFields = [
      "ClaimTitle",
      "ClaimDescription",
      "ClaimUserID",
      "ClaimClaimstatusID",
    ];
    const recordSchema = joi
      .object({
        ClaimID: joi.number().integer(),
        ClaimTitle: joi.string().min(8).required(),
        ClaimDescription: joi.string().min(20).required(),
        ClaimUserID: joi.number().integer(),
        ClaimClaimstatusID: joi.number().integer(),
      })
      .required()
      .unknown(true);
    const postSchema = recordSchema.and(...mutableFields);
    const { error } = postSchema.validate(record, { abortEarly: false });
    if (error)
      return res.status(404).json({ message: this.reportErrors(error) });

    // Access database
    const {
      isSuccess,
      result,
      message: accessorMessage,
    } = await this.accessor.create(req);
    if (!isSuccess) return res.status(404).json({ message: accessorMessage });
    // Response to request
    res.status(201).json(result);
  };

  get = async (req, res, variant) => {
    const id = req.params.id;
    // Validate request
    const idSchema = joi.number().integer().min(1);
    const { error } = idSchema.validate(id);
    if (error)
      return res.status(404).json({ message: this.reportErrors(error) });
    // Access database
    const {
      isSuccess,
      result,
      message: accessorMessage,
    } = await this.accessor.read(req, variant);
    if (!isSuccess) return res.status(400).json({ message: accessorMessage });
    // Response to request
    res.status(200).json(result);
  };

  put = async (req, res) => {
    const id = req.params.id;
    const record = req.body;
    // Validate request
    const mutableFields = [
      "ClaimTitle",
      "ClaimDescription",
      "ClaimUserID",
      "ClaimClaimstatusID",
    ];
    const putSchema = joi.object({
      id: joi.number().integer().min(1).required(),
      record: joi
        .object({
          ClaimID: joi.number().integer(),
          ClaimTitle: joi.string().min(8),
          ClaimDescription: joi.string().min(20),
          ClaimUserID: joi.number().integer(),
          ClaimClaimstatusID: joi.number().integer(),
        })
        .required()
        .unknown(true)
        .or(...mutableFields),
    });
    const { error } = putSchema.validate({ id, record }, { abortEarly: false });
    if (error)
      return res.status(404).json({ message: this.reportErrors(error) });
    // Access database
    const {
      isSuccess,
      result,
      message: accessorMessage,
    } = await this.accessor.update(req);
    if (!isSuccess) return res.status(400).json({ message: accessorMessage });
    // Response to request
    res.status(200).json(result);
  };

  delete = async (req, res) => {
    const id = req.params.id;
    // Validate request
    const idSchema = joi.number().integer().min(1).required();
    const deleteSchema = idSchema.required();
    const { error } = deleteSchema.validate(id, { abortEarly: false });
    if (error)
      return res.status(404).json({ message: this.reportErrors(error) });
    // Access database
    const {
      isSuccess,
      result,
      message: accessorMessage,
    } = await this.accessor.delete(req);
    if (!isSuccess) return res.status(400).json({ message: accessorMessage });
    // Response to request
    res.status(200).json({ message: accessorMessage });
  };
}

export default Controller;
