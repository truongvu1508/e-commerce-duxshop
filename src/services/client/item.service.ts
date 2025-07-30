import { prisma } from "config/client";

const getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id: +id },
  });
};
export { getProducts, getProductById };
