import { Router } from "express";

import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorization.js";

const userRoutes = Router();

import {
  register,
  login,
  logout,
  refresh,
  githubOauth,
} from "../controllers/user.controller.js";

//register
userRoutes.post("/register", register);

//login
userRoutes.post("/login", login);

//for ref token purpose  -using ref token we;ll generate new acesstoken
userRoutes.post("/refresh",  refresh);

//Logout user and blacklist token
userRoutes.post("/logout", auth, authorize(["user", "admin"]), logout);

//featured for user  if they want to delete their account
// userRoutes.delete("/delete",auth, deleteAccount);

// //redirected to this  after o-auth
userRoutes.get("/auth/github"), githubOauth);

export default userRoutes;
