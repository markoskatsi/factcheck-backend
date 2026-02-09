import cloudinary from "../utils/cloudinary.js";

class Controller {
  constructor(accessor) {
    this.accessor = accessor;
  }
  // Methods
  post = async (req, res) => {
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.create(req);
    if (!isSuccess) return res.status(404).json({ message });
    // Response to request
    res.status(201).json(result);
  };

  get = async (req, res, variant) => {
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.read(
      req,
      variant,
    );
    if (!isSuccess) return res.status(400).json({ message });
    // Response to request
    res.status(200).json(result);
  };

  put = async (req, res) => {
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.update(req);
    if (!isSuccess) return res.status(400).json({ message });
    // Response to request
    res.status(200).json(result);
  };

  delete = async (req, res) => {
    // Validate request
    // Access database
    const { isSuccess, result, message } = await this.accessor.delete(req);
    if (!isSuccess) return res.status(400).json({ message });
    // Response to request
    res.status(200).json({ message });
  };
}

export default Controller;
