import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BlacklistModel } from "../models/blacklist.js";

dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.trim().split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ sucess: false, msg: "Access Denied! Please log in." });
    }

    // Checking for blacklisted token
    const isBlacklisted = await BlacklistModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        sucess: false,
        msg: "Token is blacklisted !please Login First",
      });
    }

    // console.log(token);
    const decodedToken = jwt.verify(token, process.env.jwtSecretKey);
    // console.log(decodedToken);
    //manupulating reqbody for relationship purpose ...
    req.body.authorID = decodedToken.authorID;
    req.body.author = decodedToken.author;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, msg: "Access token expired" });
    }
    return res.status(403).json({ success: false, msg: err.message });
  }
};

// GitHub Copilot
// Key changes made:
// Changed require statements to import statements
// Added .js extension to the local import
// Changed module.exports to export const
// Removed the variable declaration for auth and directly exported it
// Changed env.config() to dotenv.config()
// Make sure your blacklist.js model is also using ES module syntax:
