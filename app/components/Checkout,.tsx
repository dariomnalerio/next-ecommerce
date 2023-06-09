"use client";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import OrderAnimation from "./OrderAnimation";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const cartStore = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const ThemeStore = useThemeStore();
  const [stripeTheme, setStripeTheme] = useState<"flat" | "stripe" | "night" | "none">("stripe");

  useEffect(() => {

    // Set stripe checkout theme
    if (ThemeStore.mode === "light") {
      setStripeTheme("stripe");
    } else {
      setStripeTheme("night");
    }

    // Create a paymentIntent as soon as the page loads up
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          // If the user is not logged in, redirect to login page
          return router.push("/api/auth/signin");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret); // We use client_secret to confirm the payment
        cartStore.setPaymentIntent(data.paymentIntent.id); // Uses same paymentIntent.id for updated cart
      });
  }, []);

  const options: StripeElementsOptions = {
    // Options for the Stripe Elements
    clientSecret,
    appearance: {
      theme: stripeTheme,
      labels: "floating",
    },
  };

  return (
    <div>
      {!clientSecret && <OrderAnimation />}{" "}
      {/* Show the animation while the paymentIntent is being created */}
      {clientSecret && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
}
