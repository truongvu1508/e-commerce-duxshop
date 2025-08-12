import { prisma } from "config/client";

const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (cart) {
    // update
    // 1. update sum card
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: {
          increment: quantity,
        },
      },
    });

    // 2. update cart (create a new one if it doesn't exist, otherwise update it)
    // update + insert

    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        productId: productId,
        cartId: cart.id,
      },
    });
    await prisma.cartDetail.upsert({
      where: {
        id: currentCartDetail?.id ?? 0,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        price: product.price,
        quantity: quantity,
        productId: productId,
        cartId: cart.id,
      },
    });
  } else {
    // create
    await prisma.cart.create({
      data: {
        sum: quantity,
        userId: user.id,
        cardDetails: {
          create: [
            {
              price: product.price,
              quantity: quantity,
              productId: productId,
            },
          ],
        },
      },
    });
  }
};

const getProductInCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: userId },
  });

  if (cart) {
    const currentCartDetail = await prisma.cartDetail.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
    return currentCartDetail;
  }
  return [];
};

const deleteProductInCart = async (
  cartDetailId: number,
  userId: number,
  sumCart: number
) => {
  const currentCartDetail = await prisma.cartDetail.findUnique({
    where: { id: cartDetailId },
  });
  const quantity = currentCartDetail.quantity;

  await prisma.cartDetail.delete({
    where: { id: cartDetailId },
  });

  if (sumCart === 1) {
    // delete cart
    await prisma.cart.delete({
      where: { userId: userId },
    });
  } else if (sumCart > 1) {
    // update cart
    await prisma.cart.update({
      where: { userId: userId },
      data: {
        sum: {
          decrement: quantity,
        },
      },
    });
  }
};

const updateCartDetailBeforeCheckout = async (
  data: {
    id: string;
    quantity: string;
  }[],
  cartId: string
) => {
  let quantity = 0;

  for (let i = 0; i < data.length; i++) {
    quantity = quantity + +data[i].quantity;
    await prisma.cartDetail.update({
      where: {
        id: +data[i].id,
      },
      data: { quantity: +data[i].quantity },
    });
  }

  // update cart sum
  await prisma.cart.update({
    where: { id: +cartId },
    data: {
      sum: quantity,
    },
  });
};

const handlePlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number
) => {
  try {
    // create transaction
    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: userId },
        include: {
          cardDetails: true,
        },
      });
      if (cart) {
        // create order
        const dataOrderDetail =
          cart?.cardDetails?.map((item) => ({
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
          })) ?? [];

        await tx.order.create({
          data: {
            receiverName,
            receiverAddress,
            receiverPhone,
            paymentMethod: "COD",
            paymentStatus: "PAYMENT_UNPAID",
            status: "PENDING",
            totalPrice: totalPrice,
            userId,
            orderDetail: {
              create: dataOrderDetail,
            },
          },
        });

        // remove cart detail, cart
        await tx.cartDetail.deleteMany({
          where: { cartId: cart.id },
        });

        await tx.cart.delete({
          where: { id: cart.id },
        });

        // check product
        for (let i = 0; i < cart.cardDetails.length; i++) {
          const productId = cart.cardDetails[i].productId;
          const product = await tx.product.findUnique({
            where: { id: productId },
          });
          if (!product || product.quantity < cart.cardDetails[i].quantity) {
            throw new Error(
              `Sản phẩm ${product?.name} không tồn tại hoặc không đủ số lượng`
            );
          }
          await tx.product.update({
            where: { id: productId },
            data: {
              quantity: { decrement: cart.cardDetails[i].quantity },
              sold: { increment: cart.cardDetails[i].quantity },
            },
          });
        }
      }
    });
    return "";
  } catch (error) {
    return error.message;
  }
};

const getOrderHistory = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderDetail: {
        include: {
          product: true,
        },
      },
    },
  });
};

export {
  getProductInCart,
  addProductToCart,
  deleteProductInCart,
  updateCartDetailBeforeCheckout,
  handlePlaceOrder,
  getOrderHistory,
};
