class Controller {
  constructor(validator, accessor) {
    this.validator = validator;
    this.accessor = accessor;
  }
  // Methods
  get = async (req, res, variant) => {
    const id = req.params.id;
    // Validate request
    const { isValid, message: validationMessage } = this.validator.get(id);
    if (!isValid) return res.status(404).json({ message: validationMessage });

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
    const { isValid, message: validationMessage } = this.validator.post(record);
    if (!isValid) return res.status(404).json({ message: validationMessage });

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
    const { isValid, message: validationMessage } = this.validator.put({
      id,
      record,
    });
    if (!isValid) return res.status(404).json({ message: validationMessage });

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
    const { isValid, message: validationMessage } = this.validator.delete(id);
    if (!isValid) return res.status(404).json({ message: validationMessage });

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
