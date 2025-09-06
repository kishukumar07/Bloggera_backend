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
    req.body.role = decodedToken.role;

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

