import { name } from "ejs";
import { Request, Response } from "express";
import {
  getProductById,
  handleCreateProduct,
  handleDeleteProduct,
  updateProductById,
} from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

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

const postAdminCreateProduct = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TProductSchema;
  const image = req?.file?.filename ?? null;

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

  // handle create product
  await handleCreateProduct(
    name,
    price,
    image,
    detailDesc,
    shortDesc,
    quantity,
    factory,
    target
  );

  return res.redirect("/admin/product");
};

const postDeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteProduct(id);
  return res.redirect("/admin/product");
};

const getViewProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  // get product by id
  const product = await getProductById(id);

  // factory
  const factoryOptions = [
    { name: "Apple", value: "APPLE" },
    { name: "Asus", value: "ASUS" },
    { name: "Lenovo", value: "LENOVO" },
    { name: "Dell", value: "DELL" },
    { name: "LG", value: "LG" },
    { name: "Acer", value: "ACER" },
  ];

  // target
  const targetOptions = [
    { name: "Gaming", value: "Gaming" },
    { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
    { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
    { name: "Mỏng nhẹ", value: "MONG-NHE" },
    { name: "Doanh nhân", value: "DOANH-NHAN" },
  ];

  return res.render("admin/product/detail.ejs", {
    product: product,
    factoryOptions: factoryOptions,
    targetOptions: targetOptions,
  });
};

const postUpdateProduct = async (req: Request, res: Response) => {
  const { id, name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TProductSchema;
  const image = req?.file?.filename ?? null;

  // update user by id
  const a = await updateProductById(
    id,
    name,
    price,
    image,
    detailDesc,
    shortDesc,
    quantity,
    factory,
    target
  );
  return res.redirect("/admin/product");
};

export {
  getAdminCreateProductPage,
  postAdminCreateProduct,
  postDeleteProduct,
  getViewProduct,
  postUpdateProduct,
};
