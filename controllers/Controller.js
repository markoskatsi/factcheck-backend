import cloudinary from "../config/cloudinary.js";

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

  post = async (req, res, variant) => {
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        req.body[`${variant}Filename`] = req.file.originalname;
        req.body[`${variant}Filepath`] = uploadResult.secure_url;
        req.body[`${variant}Filetype`] = req.file.mimetype;
        req.body[`${variant}Filesize`] = req.file.size;
        req.body[`${variant}URL`] = null;
      } catch (error) {
        return res
          .status(500)
          .json({ message: `Cloudinary upload failed: ${error.message}` });
      }
    } else if (variant && req.body[`${variant}URL`]) {
      req.body[`${variant}Filename`] = null;
      req.body[`${variant}Filepath`] = null;
      req.body[`${variant}Filetype`] = null;
      req.body[`${variant}Filesize`] = null;
    }

    const { isValid, message: validationMessage } = this.validator.post(
      req.body,
    );
    if (!isValid) return res.status(400).json({ message: validationMessage });

    const {
      isSuccess,
      result,
      message: accessorMessage,
    } = await this.accessor.create(req);
    if (!isSuccess) return res.status(500).json({ message: accessorMessage });

    res.status(201).json(result);
  };

  put = async (req, res, variant) => {
    const id = req.params.id;
    const record = req.body;

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        req.body[`${variant}Filename`] = req.file.originalname;
        req.body[`${variant}Filepath`] = uploadResult.secure_url;
        req.body[`${variant}Filetype`] = req.file.mimetype;
        req.body[`${variant}Filesize`] = req.file.size;
        req.body[`${variant}URL`] = null;
      } catch (error) {
        return res
          .status(500)
          .json({ message: `Cloudinary upload failed: ${error.message}` });
      }
    } else if (record[`${variant}URL`]) {
      req.body[`${variant}Filename`] = null;
      req.body[`${variant}Filepath`] = null;
      req.body[`${variant}Filetype`] = null;
      req.body[`${variant}Filesize`] = null;
    }

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
