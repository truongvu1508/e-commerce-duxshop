import { Request, Response } from "express";
import {
  countTotalProductClientPages,
  getProducts,
} from "services/client/item.service";
import {
  getAllRoles,
  getAllUsers,
  getUserById,
  handleCreateUser,
  handleDeleteUser,
  updateUserById,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }

  const products = await getProducts(currentPage, 8);
  const totalPages = await countTotalProductClientPages(8);

  return res.render("client/home/show", {
    products: products,
    page: +currentPage,
    totalPages: +totalPages,
  });
};

const getProductFilterPage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = await countTotalProductClientPages(6);
  const products = await getProducts(currentPage, 6);

  return res.render("client/product/filter", {
    products: products,
    page: +currentPage,
    totalPages: +totalPages,
  });
};

const getCreateUserPage = async (req: Request, res: Response) => {
  //get roles
  const roles = await getAllRoles();
  return res.render("admin/user/create.ejs", {
    roles: roles,
  });
};

const postCreateUser = async (req: Request, res: Response) => {
  const { fullName, username, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? "";

  // handle create user
  await handleCreateUser(fullName, username, address, phone, avatar, role);

  return res.redirect("/admin/user");
};

const postDeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteUser(id);
  return res.redirect("/admin/user");
};

const getViewUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // get user by id
  const user = await getUserById(id);
  const roles = await getAllRoles();
  return res.render("admin/user/detail.ejs", {
    id: id,
    user: user,
    roles: roles,
  });
};

const postUpdateUser = async (req: Request, res: Response) => {
  const { id, fullName, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? undefined;
  // update user by id
  const a = await updateUserById(id, fullName, phone, role, address, avatar);
  return res.redirect("/admin/user");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
  getProductFilterPage,
};
