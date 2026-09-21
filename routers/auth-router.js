import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import database from "../config/database.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { UserEmail, UserPassword } = req.body;

  if (!UserEmail || !UserPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await database.query(
      "SELECT UserID, UserUsertypeID, UserPassword, UserFirstname, UserEmail FROM Users WHERE UserEmail = :email",
      { email: UserEmail },
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(UserPassword, user.UserPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        UserID: user.UserID,
        UserUsertypeID: user.UserUsertypeID,
        UserFirstname: user.UserFirstname,
        UserEmail: user.UserEmail,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      token,
      UserID: user.UserID,
      UserUsertypeID: user.UserUsertypeID,
      UserFirstname: user.UserFirstname,
      UserEmail: user.UserEmail,
    });
  } catch (error) {
    res.status(500).json({ message: `Login failed: ${error.message}` });
  }
});

export default router;
