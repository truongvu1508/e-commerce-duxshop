import { prisma } from "config/client";

const handleCreateProduct = async (
  name: string,
  price: number,
  imageUpload: string,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string
) => {
  const newProduct = await prisma.product.create({
    data: {
      name: name,
      price: +price,
      ...(imageUpload && { image: imageUpload }), // them image khi imageUpload co gia tri
      detailDesc: detailDesc,
      shortDesc: shortDesc,
      quantity: +quantity,
      factory: factory,
      target: target,
    },
  });
  return newProduct;
};

const getProductList = async () => {
  return await prisma.product.findMany();
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id: +id } });
  return product;
};

const handleDeleteProduct = async (id: string) => {
  const deleteProduct = await prisma.product.delete({ where: { id: +id } });
  return deleteProduct;
};

const updateProductById = async (
  id: string,
  name: string,
  price: number,
  imageUpload: string,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string
) => {
  const updateProduct = await prisma.product.update({
    where: { id: +id }, // +id: string -> int
    data: {
      name: name,
      price: +price,
      ...(imageUpload && { image: imageUpload }), // them image khi imageUpload co gia tri
      detailDesc: detailDesc,
      shortDesc: shortDesc,
      quantity: +quantity,
      factory: factory,
      target: target,
    },
  });
  return updateProduct;
};

export {
  handleCreateProduct,
  getProductList,
  handleDeleteProduct,
  getProductById,
  updateProductById,
};
