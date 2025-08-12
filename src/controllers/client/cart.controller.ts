import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  addProductToCart,
  deleteProductInCart,
  getOrderHistory,
  getProductInCart,
  handlePlaceOrder,
  updateCartDetailBeforeCheckout,
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

  const cartId = cartDetails.length ? cartDetails[0].cartId : 0;

  return res.render("client/cart/show.ejs", {
    cartDetails: cartDetails,
    totalPrice: totalPrice,
    cartId: cartId,
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

const postHandleCartToCheckout = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  const currentCartDetail: { id: string; quantity: string }[] =
    req.body?.cartDetails ?? [];

  const { cartId } = req.body;

  await updateCartDetailBeforeCheckout(currentCartDetail, cartId);
  console.log(req.body);

  return res.redirect("/checkout");
};

const postOrder = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body;

  const message = await handlePlaceOrder(
    user.id,
    receiverName,
    receiverAddress,
    receiverPhone,
    +totalPrice
  );
  if (message) {
    return res.redirect("/checkout");
  }

  return res.redirect("/thanks");
};

const getThanksPage = (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  return res.render("client/cart/thanks.ejs");
};

const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  const orders = await getOrderHistory(user.id);

  return res.render("client/cart/order.history.ejs", { orders: orders });
};

const postAddToCartFromDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  await addProductToCart(+quantity, +id, user);

  return res.redirect(`/product/${id}`);
};

export {
  getCartPage,
  postAddProductToCart,
  postDeleteProductInCart,
  getCheckoutPage,
  postHandleCartToCheckout,
  postOrder,
  getThanksPage,
  getOrderHistoryPage,
  postAddToCartFromDetailPage,
};
