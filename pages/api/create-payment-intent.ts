import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { AddCartType } from "@/types/AddCartType";
import { Prisma, PrismaClient } from "@prisma/client";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

// Initialize Prisma
const prisma = new PrismaClient();

// Calculate the order amount from the items in the cart
const calculateOrderAmount = (items: AddCartType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0); // Starts at 0
  return totalPrice;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get user
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }

  //Extract the data from the body
  const { items, payment_intent_id } = req.body;
  console.log(items, payment_intent_id);

  // Create the order data
  const orderData = {
    user: { connect: { id: userSession.user?.id } },
    amount: calculateOrderAmount(items),
    currency: "usd",
    status: "pending",
    payment_intent_id: payment_intent_id,
    products: {
      create: items.map((item) => ({
        name: item.name,
        description: item.description || null,
        unit_amount: parseFloat(item.unit_amount),
        image: item.image,
        quantity: item.quantity,
      })),
    },
  };

  // Check if the payment intent exists, then updates the order
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: calculateOrderAmount(items) }
      );
      // Fetch order with product id
      const existing_order = await prisma.order.findFirst({
        where: { payment_intent_id: updated_intent.id },
        include: { products: true },
      });
      if (!existing_order) {
        res.status(400).json({ message: "Invalid Payment Intent" });
      }
      // Update existing order
      const updated_order = await prisma.order.update({
        where: { id: existing_order?.id },
        data: {
          amount: calculateOrderAmount(items),
          products: {
            deleteMany: {},
            create: items.map((item) => ({
              name: item.name,
              description: item.description || null,
              unit_amount: parseFloat(item.unit_amount),
              image: item.image,
              quantity: item.quantity,
            })),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent }); // Send back updated payment intent to the client
      return;
    }
  } else {
    // Create new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    // Create new order with prisma
    orderData.payment_intent_id = paymentIntent.id; // Add the payment intent id to the order data
    const newOrder = await prisma.order.create({
      data: {
        data: orderData,
      },
    });
    res.status(200).json({ paymentIntent }); // Send back payment intent id to the client
    return;
  }
}
