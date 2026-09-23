import cloudinary from "../config/cloudinary.js";

export const fileFields = async (req, variant) => {
  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    req.body[`${variant}Filename`] = req.file.originalname;
    req.body[`${variant}Filepath`] = uploadResult.secure_url;
    req.body[`${variant}Filetype`] = req.file.mimetype;
    req.body[`${variant}Filesize`] = req.file.size;
    req.body[`${variant}URL`] = null;
  } else {
    req.body[`${variant}Filename`] = null;
    req.body[`${variant}Filepath`] = null;
    req.body[`${variant}Filetype`] = null;
    req.body[`${variant}Filesize`] = null;
  }
};
