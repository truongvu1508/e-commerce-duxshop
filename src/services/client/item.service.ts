import { prisma } from "config/client";
import { TOTAL_ITEM_PER__PAGE } from "config/constant";

const getProducts = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
  return products;
};

const countTotalProductClientPages = async (pageSize: number) => {
  const totalItems = await prisma.product.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  return totalPages;
};

const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id: +id },
  });
};

export { getProducts, getProductById, countTotalProductClientPages };
