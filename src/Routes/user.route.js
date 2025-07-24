import { Router } from "express";

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

//Logout user and blacklist token
userRoutes.post("/logout", logout);

//for ref token purpose  -using ref token we;ll generate new acesstoken
userRoutes.post("/refresh", refresh);

// //redirected to this  after o-auth
userRoutes.get("/auth/github", githubOauth);

export default userRoutes;
