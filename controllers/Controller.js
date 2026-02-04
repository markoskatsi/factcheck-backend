import cloudinary from "../utils/cloudinary.js";

class Controller {
  constructor(accessor) {
    this.accessor = accessor;
  }
  // Methods
  post = async (req, res) => {
    const record = req.body;
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.create(record);
    if (!isSuccess) return res.status(404).json({ message });
    // Response to request
    res.status(201).json(result);
  };

  get = async (req, res, variant) => {
    const id = req.params.id;
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.read(
      id,
      variant,
    );
    if (!isSuccess) return res.status(400).json({ message });
    // Response to request
    res.status(200).json(result);
  };

  put = async (req, res) => {
    const id = req.params.id;
    const record = req.body;
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.update(
      record,
      id,
    );
    if (!isSuccess) return res.status(400).json({ message });
    // Response to request
    res.status(200).json(result);
  };

  delete = async (req, res) => {
    const id = req.params.id;
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.delete(id);
    if (!isSuccess) return res.status(400).json({ message });
    // Response to request
    res.status(200).json({ message });
  };
}

export default Controller;
