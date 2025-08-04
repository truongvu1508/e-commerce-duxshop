import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  addProductToCart,
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

export { getCartPage, postAddProductToCart };
