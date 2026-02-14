import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const checkout = async (customerId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await prisma.orders.create({
    data: {
      customerId,
      totalPrice,
      status: "PENDING",
      items: {
        create: cart.items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  for (const item of cart.items) {
    await prisma.medicines.update({
      where: { id: item.medicineId },
      data: { stockQuantity: { decrement: item.quantity } },
    });
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({
    where: { id: cart.id },
    data: { totalPrice: 0 },
  });

  return order;
};
const updateOrderStatus = async (
  orderId: string,
  sellerId: string,
  status: OrderStatus,
) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const ownsMedicine = order.items.some(
    (item) => item.medicine.sellerId === sellerId,
  );
  if (!ownsMedicine) {
    throw new Error("Unauthorized: Seller does not own this order's items");
  }

  const updatedOrder = await prisma.orders.update({
    where: { id: orderId },
    data: { status },
  });

  return updatedOrder;
};

const getSellerOrders = async (sellerId: string) => {
  const orders = await prisma.orders.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });

  return orders;
};

const getCustomerOrders = async (customerId: string) => {
  const orders = await prisma.orders.findMany({
    where: { customerId },
    include: {
      items: {
        include: { medicine: true },
      },
    },
    orderBy: { orderedAt: "desc" },
  });
  return orders;
};

const getOrderDetails = async (orderId: string, customerId: string) => {
  const order = await prisma.orders.findFirst({
    where: {
      id: orderId,
      customerId,
    },
    include: {
      items: {
        include: { medicine: true },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found or unauthorized");
  }

  return order;
};

export const orderService = {
  checkout,
  updateOrderStatus,
  getSellerOrders,
  getCustomerOrders,
  getOrderDetails,
};
