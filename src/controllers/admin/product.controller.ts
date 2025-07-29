import { Request, Response } from "express";

const getProductPage = async (req: Request, res: Response) => {
  return res.render("client/product/detail.ejs");
};

const getAdminCreateProductPage = async (req: Request, res: Response) => {
  return res.render("admin/product/create.ejs");
};

const postAdminCreateProductPage = async (req: Request, res: Response) => {
  const { name } = req.body;
  return res.redirect("/admin/product");
};

export {
  getProductPage,
  getAdminCreateProductPage,
  postAdminCreateProductPage,
};
