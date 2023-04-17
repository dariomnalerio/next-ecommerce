"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import formatPrice from "@/util/PriceFormat";
import { useCartStore } from "@/store";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe(); // Initialize stripe
  const elements = useElements(); // Initialize elements
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button
  const cartStore = useCartStore(); // Initialize cartStore

  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0); // Total price
  const formattedPrice = formatPrice(totalPrice); // Format the price

  useEffect(() => {
    if (!stripe) {
      return; // If stripe is not initialized, don't render the form
    }
    if (!clientSecret) {
      return; // If !clientSecret, client is not authorized to pay
    }
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page from refreshing on submit
    if (!stripe || !elements) {
      return; // If stripe or elements are not initialized, don't submit
    }
    setIsLoading(true); // Prevent the user from spamming the button

    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (!result.error) {
          cartStore.setCheckout("success"); // If payment is successful, set checkout to success
        }
        setIsLoading(false); // If payment is not successful, set isLoading to false
      });
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <h1 className="py-4 text-sm font-bold">Total: {formattedPrice}</h1>
      <button
        className={`btn w-full bg-primary text-white disabled:opacity-25`}
        id="submit"
        disabled={isLoading || !stripe || !elements}
      >
        <span id="button-text">
          {/* If isLoading is true, show "Processing", else show "Pay now" */}
          {isLoading ? <span> Processing...</span> : <span>Pay now</span>}
        </span>
      </button>
    </form>
  );
}
