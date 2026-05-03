import jwt from "jsonwebtoken";

const validateJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") && authHeader.slice(7);

  if (!token) {
    return res.status(401).json({ error: "Unauthorised", message: "Valid token required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorised", message: "Invalid or expired token" });
  }
};

export default validateJwt;
