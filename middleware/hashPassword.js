import bcrypt from "bcryptjs";

const hashPassword = async (req, res, next) => {
  if (req.body.UserPassword) {
    req.body.UserPassword = await bcrypt.hash(req.body.UserPassword, 10);
  }
  next();
};

export default hashPassword;
