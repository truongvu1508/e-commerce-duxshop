import { name } from "ejs";
import { Request, Response } from "express";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getProductPage = async (req: Request, res: Response) => {
  return res.render("client/product/detail.ejs");
};

const getAdminCreateProductPage = async (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    name: "",
    price: "",
    detailDesc: "",
    shortDesc: "",
    quantity: "",
    factory: "",
    target: "",
  };

  return res.render("admin/product/create.ejs", {
    errors: errors,
    oldData: oldData,
  });
};

const postAdminCreateProductPage = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TProductSchema;

  const validate = ProductSchema.safeParse(req.body);

  if (!validate.success) {
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message} (${item.path[0]})`
    );
    const oldData = {
      name: name,
      price: price,
      detailDesc: detailDesc,
      shortDesc: shortDesc,
      quantity: quantity,
      factory: factory,
      target: target,
    };

    return res.render("admin/product/create.ejs", {
      errors: errors,
      oldData: oldData,
    });
  }

  return res.redirect("/admin/product");
};

export {
  getProductPage,
  getAdminCreateProductPage,
  postAdminCreateProductPage,
};
