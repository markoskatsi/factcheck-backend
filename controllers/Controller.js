import joi from "joi";

class Controller {
  constructor(validator, accessor) {
    this.validator = validator;
    this.accessor = accessor;
  }
  // Methods
  get = async (req, res, variant) => {
    const id = req.params.id;
    // Validate request
    const { error } = this.validator.idSchema.validate(id);
    if (error)
      return res
        .status(404)
        .json({ message: this.validator.reportErrors(error) });
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

  post = async (req, res) => {
    const record = req.body;
    // Validate request
    const postSchema = this.validator.recordSchema.and(
      ...this.validator.mutableFields,
    );
    const { error } = postSchema.validate(record, { abortEarly: false });
    if (error)
      return res
        .status(404)
        .json({ message: this.validator.reportErrors(error) });

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

  put = async (req, res) => {
    const id = req.params.id;
    const record = req.body;
    // Validate request
    const putSchema = joi.object({
      id: this.validator.idSchema.required(),
      record: this.validator.recordSchema.and(...this.validator.mutableFields),
    });
    const { error } = putSchema.validate({ id, record }, { abortEarly: false });
    if (error)
      return res
        .status(404)
        .json({ message: this.validator.reportErrors(error) });
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
    const deleteSchema = this.validator.idSchema.required();
    const { error } = deleteSchema.validate(id, { abortEarly: false });
    if (error)
      return res
        .status(404)
        .json({ message: this.validator.reportErrors(error) });
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
