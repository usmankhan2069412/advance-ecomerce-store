import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Create a checkout session
export const createCheckoutSession = async ({
  lineItems,
  successUrl,
  cancelUrl,
}: {
  lineItems: Array<{
    price: string;
    quantity: number;
  }>;
  successUrl: string;
  cancelUrl: string;
}) => {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lineItems,
        successUrl,
        cancelUrl,
      }),
    });

    const { sessionId } = await response.json();
    const stripe = await getStripe();

    if (!stripe) {
      throw new Error("Stripe failed to initialize");
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

// Process crypto payment (placeholder for actual implementation)
export const processCryptoPayment = async ({
  amount,
  currency,
  walletAddress,
}: {
  amount: number;
  currency: string;
  walletAddress: string;
}) => {
  // This would be replaced with actual crypto payment processing
  console.log(`Processing ${amount} ${currency} payment to ${walletAddress}`);

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `tx_${Math.random().toString(36).substring(2, 15)}`,
        timestamp: new Date().toISOString(),
      });
    }, 1500);
  });
};
