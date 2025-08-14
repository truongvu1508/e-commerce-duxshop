import { Request, Response } from "express";
import { getDashboardInfo } from "services/admin/dashboard.service";
import {
  countTotalOrderPages,
  getOrderAdmin,
  getOrderDetailAdmin,
} from "services/admin/order.service";
import {
  countTotalProductPages,
  getProductList,
} from "services/admin/product.service";
import { countTotalUserPages, getAllUsers } from "services/user.service";

const getDashboardPage = async (req: Request, res: Response) => {
  const info = await getDashboardInfo();
  return res.render("admin/dashboard/show.ejs", { info });
};

const getAdminUserPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const users = await getAllUsers(currentPage);
  const totalPages = await countTotalUserPages();

  return res.render("admin/user/show.ejs", {
    users: users,
    totalPages: +totalPages,
    page: +page,
  });
};

const getAdminProductPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }

  const products = await getProductList(currentPage);
  const totalPages = await countTotalProductPages();

  return res.render("admin/product/show.ejs", {
    products: products,
    page: +page,
    totalPages: +totalPages,
  });
};

const getAdminOrderPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const orders = await getOrderAdmin(currentPage);
  const totalPages = await countTotalOrderPages();

  return res.render("admin/order/show.ejs", {
    orders: orders,
    page: +page,
    totalPages: +totalPages,
  });
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
