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
  await prisma.cartDetail.delete({ where: { id: cartDetailId } });

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
          decrement: 1,
        },
      },
    });
  }
};

const updateCartDetailBeforeCheckout = async (
  data: {
    id: string;
    quantity: string;
  }[]
) => {
  for (let i = 0; i < data.length; i++) {
    await prisma.cartDetail.update({
      where: {
        id: +data[i].id,
      },
      data: { quantity: +data[i].quantity },
    });
  }
};

const handlePlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number
) => {
  const cart = await prisma.cart.findUnique({
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

    await prisma.order.create({
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
    await prisma.cartDetail.deleteMany({
      where: { cartId: cart.id },
    });

    await prisma.cart.delete({
      where: { id: cart.id },
    });
  }
  console.log(cart);
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
