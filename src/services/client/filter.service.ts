import { prisma } from "config/client";

const userFilter = async (usernameInput: string) => {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: usernameInput,
      },
    },
  });
};

const productFilterFactory = async (factoryInput: string) => {
  return await prisma.product.findMany({
    where: {
      factory: {
        equals: factoryInput,
      },
    },
  });
};

const productFilterFactories = async (factoryArray: string[]) => {
  return await prisma.product.findMany({
    where: {
      factory: {
        in: factoryArray,
      },
    },
  });
};

const productFilterMinPrice = async (minPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
      },
    },
  });
};

const productFilterMaxPrice = async (maxPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        lte: maxPrice,
      },
    },
  });
};

const productFilterPrice = async (minPrice: number, maxPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
  });
};
const productFilterPrices = async () => {
  return await prisma.product.findMany({
    where: {
      OR: [
        { price: { gte: 10000000, lte: 15000000 } },
        { price: { gte: 16000000, lte: 20000000 } },
      ],
    },
  });
};

const productFilterPriceAsc = async () => {
  return await prisma.product.findMany({
    orderBy: [
      {
        price: "asc",
      },
    ],
  });
};

export {
  userFilter,
  productFilterFactory,
  productFilterFactories,
  productFilterMinPrice,
  productFilterMaxPrice,
  productFilterPrice,
  productFilterPrices,
  productFilterPriceAsc,
};
