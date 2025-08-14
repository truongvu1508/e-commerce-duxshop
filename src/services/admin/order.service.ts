import { prisma } from "config/client";
import { TOTAL_ITEM_PER__PAGE } from "config/constant";

const getOrderAdmin = async (page: number) => {
  const pageSize = TOTAL_ITEM_PER__PAGE;
  const skip = (page - 1) * pageSize;
  return await prisma.order.findMany({
    include: { user: true },
    skip: skip,
    take: pageSize,
  });
};

const countTotalOrderPages = async () => {
  const pageSize = TOTAL_ITEM_PER__PAGE;
  const totalItems = await prisma.order.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  return totalPages;
};

const getOrderDetailAdmin = async (orderId: number) => {
  return await prisma.orderDetail.findMany({
    where: { id: orderId },
    include: { product: true },
  });
};

export { getOrderAdmin, getOrderDetailAdmin, countTotalOrderPages };
