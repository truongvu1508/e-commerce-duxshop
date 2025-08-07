import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  addProductToCart,
  deleteProductInCart,
  getProductInCart,
} from "services/client/cart.service";

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  const cartDetails = await getProductInCart(+user.id);

  const totalPrice = cartDetails
    ?.map((item) => +item.price * +item.quantity)
    ?.reduce((a, b) => a + b, 0);

  return res.render("client/cart/show.ejs", {
    cartDetails: cartDetails,
    totalPrice: totalPrice,
  });
};

const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user; // passport
  if (user) {
    await addProductToCart(1, +id, user);
  } else {
    return res.redirect("/login");
  }
  return res.redirect("/");
};

const postDeleteProductInCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (user) {
    await deleteProductInCart(+id, user.id, user.sumCart);
  } else {
    return res.redirect("/login");
  }
  return res.redirect("/cart");
};

const getCheckoutPage = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  const cartDetails = await getProductInCart(+user.id);

  const totalPrice = cartDetails
    ?.map((item) => +item.price * +item.quantity)
    ?.reduce((a, b) => a + b, 0);

  return res.render("client/cart/checkout.ejs", {
    cartDetails: cartDetails,
    totalPrice: totalPrice,
  });
};

export {
  getCartPage,
  postAddProductToCart,
  postDeleteProductInCart,
  getCheckoutPage,
};
