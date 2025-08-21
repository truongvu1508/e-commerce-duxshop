import { loginAPI } from "controllers/api/auth.controller";
import {
  createUserAPI,
  deleteUserByIdAPI,
  getAllUsersAPI,
  getUserByIdAPI,
  postAddProductToCartAPI,
  updateUserByIdAPI,
} from "controllers/api/user.controller";
import express, { Express } from "express";
import { checkValidJWT } from "src/middleware/jwt.middleware";

const router = express.Router();

const apiRoutes = (app: Express) => {
  router.post("/add-product-to-cart", postAddProductToCartAPI);

  router.get("/users", checkValidJWT, getAllUsersAPI);
  router.get("/users/:id", getUserByIdAPI);
  router.post("/users", createUserAPI);
  router.put("/users/:id", updateUserByIdAPI);
  router.delete("/users/:id", deleteUserByIdAPI);

  router.post("/login", loginAPI);

  app.use("/api", router);
};

export default apiRoutes;
