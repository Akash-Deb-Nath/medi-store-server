/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import {
  OrderStatus,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  console.log("webhook ping");
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      const paymentId = session.metadata?.paymentId;

      if (!orderId || !paymentId) {
        console.error("Missing orderId or paymentId in session metadata");
        return { message: "Missing orderId or paymentId in session metadata" };
      }
      console.log("OrderId ar payment id paisi");

      const order = await prisma.orders.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        console.error(`Order with id ${orderId} not found`);
        return { message: `Order with id ${orderId} not found` };
      }

      await prisma.$transaction(async (tx: any) => {
        await tx.orders.update({
          where: {
            id: orderId,
          },
          data: {
            status: OrderStatus.PROCESSING,
            paymentStatus:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            stripeEventId: event.id,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGatewayData: session as any,
          },
        });
      });

      // for (const item of order.items) {
      //   await prisma.medicines.update({
      //     where: { id: item.medicineId },
      //     data: {
      //       stockQuantity: {
      //         decrement: item.quantity,
      //       },
      //     },
      //   });
      // }

      // await prisma.cartItem.deleteMany({
      //   where: {
      //     cart: {
      //       customerId: order.customerId,
      //     },
      //   },
      // });

      const cart = await prisma.cart.findUnique({
        where: {
          customerId: order.customerId,
        },
        include: {
          items: true,
        },
      });
      console.log(cart);

      if (!cart) {
        console.error("Cart not found for customer:", order.customerId);
        return;
      }

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

      console.log(
        `Processed checkout.session.completed for order ${orderId} and payment ${paymentId}`,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;

      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;

      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};
