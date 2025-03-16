import mixpanel from "mixpanel-browser";

// Initialize analytics services
export const initAnalytics = () => {
  // Initialize Mixpanel
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV !== "production",
      track_pageview: true,
    });
    console.log("Mixpanel initialized");
  }

  // Initialize Hotjar
  if (
    process.env.NEXT_PUBLIC_HOTJAR_ID &&
    process.env.NEXT_PUBLIC_HOTJAR_VERSION &&
    typeof window !== "undefined"
  ) {
    try {
      const hjid = parseInt(process.env.NEXT_PUBLIC_HOTJAR_ID);
      const hjsv = parseInt(process.env.NEXT_PUBLIC_HOTJAR_VERSION);

      // This would be replaced with the actual Hotjar initialization code
      console.log(`Hotjar initialized with ID: ${hjid} and Version: ${hjsv}`);
    } catch (error) {
      console.error("Failed to initialize Hotjar:", error);
    }
  }
};

// Track page view
export const trackPageView = (pageName: string) => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track("Page View", { page: pageName });
  }
};

// Track product view
export const trackProductView = (
  productId: string,
  productName: string,
  price: number,
) => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track("Product View", {
      product_id: productId,
      product_name: productName,
      price: price,
    });
  }
};

// Track add to cart
export const trackAddToCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1,
) => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track("Add to Cart", {
      product_id: productId,
      product_name: productName,
      price: price,
      quantity: quantity,
    });
  }
};

// Track user interaction with AI features
export const trackAIInteraction = (
  featureName: string,
  parameters: Record<string, any>,
) => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track("AI Interaction", {
      feature: featureName,
      ...parameters,
    });
  }
};
