import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized !" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = await User.findById(decoded?.id).select(
      "-password -refreshToken"
    );

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const optionalProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer")) return next(); // guest, skip

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded?.id).select(
      "-password -refreshToken"
    );
  } catch (_) {
    // invalid token — treat as guest
  }
  next();
};

