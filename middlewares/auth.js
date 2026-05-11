import jwt from "jsonwebtoken";
import User from "../models/User.js";
import jwtConfig from "../config/jwt.js";

/**
 * Authenticate JWT token from Authorization header.
 * Attaches the user document to req.user on success.
 */
const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Access denied. No token provided.");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("User not found. Token is invalid.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      err.message = "Invalid token.";
      err.statusCode = 401;
    }
    if (err.name === "TokenExpiredError") {
      err.message = "Token has expired.";
      err.statusCode = 401;
    }
    next(err);
  }
};

export default authenticate;
