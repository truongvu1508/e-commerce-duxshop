import { postAddProductToCartAPI } from "controllers/client/api.controller";
import express, { Express } from "express";

const router = express.Router();

const apiRoutes = (app: Express) => {
  router.post("/add-product-to-cart", postAddProductToCartAPI);

  app.use("/api", router);
};

export default apiRoutes;
