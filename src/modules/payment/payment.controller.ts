/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res
      .status(404)
      .json({ message: "Missing Stripe signature or webhook secret" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Error processing Stripe webhook:", error);
    return res.status(400).json({ message: "Error processing Stripe webhook" });
  }

  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    res.status(500).json({ message: "Error handling Stripe webhook event" });
  }
};

export const PaymentController = {
  handleStripeWebhookEvent,
};
