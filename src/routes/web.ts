import express, { Express } from "express";
import {
  getCreateUserPage,
  getHomePage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
} from "controllers/user.controller";
import {
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import {
  getAdminCreateProductPage,
  getViewProduct,
  postAdminCreateProduct,
  postDeleteProduct,
  postUpdateProduct,
} from "controllers/admin/product.controller";
import { getProductPage } from "controllers/client/product.controller";
import {
  getLoginPage,
  getRegisterPage,
  getSuccessRedirectPage,
  postRegister,
} from "controllers/client/auth.controller";
import passport from "passport";
import { isAdmin, isLogin } from "src/middleware/auth";

const router = express.Router();

const webRoutes = (app: Express) => {
  // user route
  router.get("/", getHomePage);
  router.get("/success-redirect", getSuccessRedirectPage);
  // auth
  router.get("/login", isLogin, getLoginPage);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/success-redirect",
      failureRedirect: "/login",
      failureMessage: true,
    })
  );
  router.get("/register", getRegisterPage);
  router.post("/register", postRegister);

  // product
  router.get("/product/:id", getProductPage);

  // admin routes
  router.get("/admin", isAdmin, getDashboardPage);
  // Admin user management routes
  router.get("/admin/user", isAdmin, getAdminUserPage);
  router.get("/admin/create-user", isAdmin, getCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    isAdmin,
    fileUploadMiddleware("avatar"),
    postCreateUser
  );
  router.post("/admin/delete-user/:id", isAdmin, postDeleteUser);
  router.get("/admin/view-user/:id", isAdmin, getViewUser);
  router.post(
    "/admin/update-user",
    isAdmin,
    fileUploadMiddleware("avatar"),
    postUpdateUser
  );

  // Product
  router.get("/admin/product", isAdmin, getAdminProductPage);
  router.get("/admin/create-product", isAdmin, getAdminCreateProductPage);
  router.post(
    "/admin/create-product",
    isAdmin,
    fileUploadMiddleware("image", "images/product"),
    postAdminCreateProduct
  );
  router.post("/admin/delete-product/:id", isAdmin, postDeleteProduct);
  router.get("/admin/view-product/:id", isAdmin, getViewProduct);
  router.post(
    "/admin/update-product",
    isAdmin,
    fileUploadMiddleware("image", "images/product"),
    postUpdateProduct
  );

  // Order
  router.get("/admin/order", isAdmin, getAdminOrderPage);

  app.use("/", router);
};

export default webRoutes;
