import { prisma } from "config/client";

const getOrderAdmin = async () => {
  return await prisma.order.findMany({
    include: { user: true },
  });
};

const getOrderDetailAdmin = async (orderId: number) => {
  return await prisma.orderDetail.findMany({
    where: { id: orderId },
    include: { product: true },
  });
};

export { getOrderAdmin, getOrderDetailAdmin };
