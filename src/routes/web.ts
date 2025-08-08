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
  postLogout,
  postRegister,
} from "controllers/client/auth.controller";
import passport from "passport";
import { isAdmin, isLogin } from "src/middleware/auth";
import {
  getCartPage,
  getCheckoutPage,
  postAddProductToCart,
  postDeleteProductInCart,
  postHandleCartToCheckout,
} from "controllers/client/cart.controller";

const router = express.Router();

const webRoutes = (app: Express) => {
  // user route
  router.get("/", getHomePage);
  router.get("/success-redirect", getSuccessRedirectPage);
  // auth
  router.get("/login", isLogin, getLoginPage);
  router.post("/logout", postLogout);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/success-redirect",
      failureRedirect: "/login",
      failureMessage: true,
    })
  );
  router.get("/register", isLogin, getRegisterPage);
  router.post("/register", postRegister);

  // product
  router.get("/product/:id", getProductPage);

  // cart
  router.post("/add-product-to-cart/:id", postAddProductToCart);
  router.get("/cart", getCartPage);
  router.post("/delete-product-in-cart/:id", postDeleteProductInCart);
  router.post("/handle-cart-to-checkout", postHandleCartToCheckout);
  router.get("/checkout", getCheckoutPage);

  // admin routes
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);
  router.post(
    "/admin/handle-create-user",

    fileUploadMiddleware("avatar"),
    postCreateUser
  );
  router.post("/admin/delete-user/:id", postDeleteUser);
  router.get("/admin/view-user/:id", getViewUser);
  router.post(
    "/admin/update-user",

    fileUploadMiddleware("avatar"),
    postUpdateUser
  );

  // Product
  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/create-product", getAdminCreateProductPage);
  router.post(
    "/admin/create-product",

    fileUploadMiddleware("image", "images/product"),
    postAdminCreateProduct
  );
  router.post("/admin/delete-product/:id", postDeleteProduct);
  router.get("/admin/view-product/:id", getViewProduct);
  router.post(
    "/admin/update-product",

    fileUploadMiddleware("image", "images/product"),
    postUpdateProduct
  );

  // Order
  router.get("/admin/order", getAdminOrderPage);

  app.use("/", isAdmin, router);
};

export default webRoutes;
