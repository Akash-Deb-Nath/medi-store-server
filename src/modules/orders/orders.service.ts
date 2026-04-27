import { OrderStatus } from "../../../prisma/generated/prisma/enums";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";
import { v7 as uuidv7 } from "uuid";
import { UserRole } from "../../middlewares/authMiddleware";

// const checkout = async (userId: string) => {
//   const customer = await prisma.customer.findUnique({
//     where: { userId },
//   });
//   if (!customer) {
//     throw new Error("User not found");
//   }
//   const cart = await prisma.cart.findUnique({
//     where: { customerId: customer.id as string },
//     include: { items: true },
//   });

//   if (!cart || cart.items.length === 0) {
//     throw new Error("Cart is empty");
//   }

//   const totalPrice = cart.items.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );

//   const order = await prisma.orders.create({
//     data: {
//       customerId: customer.id as string,
//       totalPrice,
//       status: "PENDING",
//       items: {
//         create: cart.items.map((item) => ({
//           medicineId: item.medicineId,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       },
//     },
//     include: { items: true },
//   });

//   for (const item of cart.items) {
//     await prisma.medicines.update({
//       where: { id: item.medicineId },
//       data: { stockQuantity: { decrement: item.quantity } },
//     });
//   }

//   await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
//   await prisma.cart.update({
//     where: { id: cart.id },
//     data: { totalPrice: 0 },
//   });

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     line_items: cart.items.map((item) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.medicineId,
//         },
//         unit_amount: item.price * 100,
//       },
//       quantity: item.quantity,
//     })),
//     success_url: `${process.env.FRONTEND_URL}/success`,
//     cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//     metadata: {
//       orderId: order.id,
//     },
//   });

//   return order;
// };

const checkout = async (userId: string) => {
  const customer = await prisma.customer.findUnique({
    where: { userId },
  });

  if (!customer) throw new Error("User not found");

  const cart = await prisma.cart.findUnique({
    where: { customerId: customer.id },
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
      customerId: customer.id,
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
    include: {
      items: true,
    },
  });

  const transactionId = String(uuidv7());
  const paymentData = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: totalPrice,
      transactionId,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: cart.items.map((item) => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: item.medicineId,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    metadata: {
      orderId: order.id,
      paymentId: paymentData.id,
    },
    success_url: `${envVars.FRONTEND_URL}/payment-success`,
    cancel_url: `${envVars.FRONTEND_URL}/orders`,
  });

  return {
    order,
    url: session.url,
  };
};

const updateOrderStatus = async (
  orderId: string,
  userId: string,
  status: OrderStatus,
) => {
  const seller = await prisma.seller.findUnique({
    where: { userId },
  });

  if (!seller) {
    throw new Error("Seller not found");
  }

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { medicine: true } },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const ownsMedicine = order.items.some(
    (item) => item.medicine.sellerId === seller.id, // now both are UUIDs
  );

  if (!ownsMedicine) {
    throw new Error("Unauthorized: Seller does not own this order's items");
  }

  return await prisma.orders.update({
    where: { id: orderId },
    data: { status },
  });
};

const getAllOrders = async () => {
  const orders = await prisma.orders.findMany({
    orderBy: { orderedAt: "desc" },
  });
  return orders;
};

const getSellerOrders = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { userId },
  });
  if (!seller) {
    throw new Error("User not found");
  }
  const orders = await prisma.orders.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId: seller.id,
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
    orderBy: { orderedAt: "desc" },
  });

  return orders;
};

const getCustomerOrders = async (userId: string) => {
  const customer = await prisma.customer.findUnique({
    where: { userId },
  });
  if (!customer) {
    throw new Error("User not found");
  }
  const orders = await prisma.orders.findMany({
    where: { customerId: customer.id as string },
    include: {
      items: {
        include: { medicine: true },
      },
    },
    orderBy: { orderedAt: "desc" },
  });
  return orders;
};

const getOrderDetails = async (
  orderId: string,
  userId: string,
  role: UserRole,
) => {
  // 1. Admin hole sorasori order details diye dibo (No restriction)
  if (role === "ADMIN") {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { medicine: true } },
      },
    });
    if (!order) throw new Error("Order not found");
    return order;
  }

  // 2. Customer hole check korbo order-ta tar niche kina
  if (role === "CUSTOMER") {
    const customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer) throw new Error("Customer profile not found");

    const order = await prisma.orders.findFirst({
      where: { id: orderId, customerId: customer.id },
      include: {
        items: { include: { medicine: true } },
      },
    });
    if (!order) throw new Error("Order not found or unauthorized");
    return order;
  }

  // 3. Seller hole check korbo oi order-er bhitore seller-er kono medicine ache kina
  if (role === "SELLER") {
    const seller = await prisma.seller.findUnique({ where: { userId } });
    if (!seller) throw new Error("Seller profile not found");

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        items: {
          where: { medicine: { sellerId: seller.id } },
          include: { medicine: true },
        },
      },
    });

    // Jodi order thake kintu seller-er kono product oi order-e na thake
    if (!order || order.items.length === 0) {
      throw new Error("Order not found or no items for this seller");
    }
    return order;
  }
};

export const orderService = {
  checkout,
  updateOrderStatus,
  getAllOrders,
  getSellerOrders,
  getCustomerOrders,
  getOrderDetails,
};
