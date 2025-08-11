import { Request, Response } from "express";
import { getDashboardInfo } from "services/admin/dashboard.service";
import {
  getOrderAdmin,
  getOrderDetailAdmin,
} from "services/admin/order.service";
import { getProductList } from "services/admin/product.service";
import { getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  const info = await getDashboardInfo();
  return res.render("admin/dashboard/show.ejs", { info });
};

const getAdminUserPage = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  return res.render("admin/user/show.ejs", { users: users });
};

const getAdminProductPage = async (req: Request, res: Response) => {
  const products = await getProductList();
  return res.render("admin/product/show.ejs", { products: products });
};

const getAdminOrderPage = async (req: Request, res: Response) => {
  const orders = await getOrderAdmin();
  return res.render("admin/order/show.ejs", { orders: orders });
};

const getAdminOrderDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderDetails = await getOrderDetailAdmin(+id);
  return res.render("admin/order/detail.ejs", {
    orderDetails: orderDetails,
    id: id,
  });
};

export {
  getDashboardPage,
  getAdminUserPage,
  getAdminProductPage,
  getAdminOrderPage,
  getAdminOrderDetailPage,
};
