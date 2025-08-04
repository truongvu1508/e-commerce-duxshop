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

export { getProductInCart, addProductToCart };
