import { Request, Response } from "express";
import { addProductToCart, getProductById } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id);
  return res.render("client/product/detail.ejs", { product: product });
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

export { getProductPage, postAddProductToCart };
