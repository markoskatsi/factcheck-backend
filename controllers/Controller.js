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
    const recordSchema = joi.object({
      ClaimID: joi.number().integer(),
      ClaimTitle: joi.string().min(8).required(),
      ClaimDescription: joi.string().min(20).required(),
      ClaimUserID: joi.number().integer(),
      ClaimClaimstatusID: joi.number().integer(),
    }).required();
    const { error } = recordSchema.validate(record, { abortEarly: false });
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
    // Validate request
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
    // Validate request
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
