import { CartItem } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const addToCart = async (
  data: Omit<CartItem, "id" | "createdAt" | "updatedAt">,
  customerId: string,
) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: data.medicineId },
  });
  if (!medicine) {
    throw new Error("Invalid medicine");
  }
  const customer = await prisma.customer.findUnique({
    where: { userId: customerId },
  });
  console.log("Customer found:", customer);

  let cart = await prisma.cart.upsert({
    where: { customerId: customer?.id as string },
    update: {},
    create: { customerId: customer?.id as string, totalPrice: 0 },
  });

  const item = await prisma.cartItem.upsert({
    where: {
      cartId_medicineId: {
        cartId: cart.id,
        medicineId: data.medicineId,
      },
    },
    update: {
      quantity: { increment: data.quantity },
    },
    create: {
      cartId: cart.id,
      medicineId: data.medicineId,
      quantity: data.quantity,
      price: medicine.price,
    },
  });

  cart = await prisma.cart.update({
    where: { id: cart.id },
    data: {
      totalPrice: cart.totalPrice + medicine.price * data.quantity,
    },
  });

  return item;
};
const getCart = async (userId: string) => {
  const customer = await prisma.customer.findUnique({
    where: { userId },
  });
  if (!customer) throw new Error("Customer not found");
  const result = await prisma.cart.findUnique({
    where: { customerId: customer.id },
    include: { items: { include: { medicine: true } } },
  });
  return result;
};
const updateCartItem = async (itemId: string, quantity: number) => {
  const result = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
  return result;
};
const deleteCartItem = async (itemId: string) => {
  const result = await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });
  return result;
};

export const CartService = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
};
