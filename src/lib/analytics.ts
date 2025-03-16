// Create a fallback implementation for SSR environments
let mixpanel: any = { track: () => {}, init: () => {} };

// Initialize analytics services
export const initAnalytics = () => {
  // Initialize Mixpanel (only in browser)
  if (typeof window !== "undefined") {
    // Dynamic import for mixpanel-browser
    import("mixpanel-browser")
      .then((module) => {
        mixpanel = module.default;

        if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
          try {
            mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
              debug: process.env.NODE_ENV !== "production",
              track_pageview: true,
              api_host: "https://api-eu.mixpanel.com", // Use EU endpoint for GDPR compliance
              opt_out_tracking_by_default: true, // Default to opt-out for GDPR
              persistence: "localStorage", // More reliable than cookies
            });
            console.log("Mixpanel initialized");
          } catch (error) {
            console.error("Error initializing Mixpanel:", error);
            // Provide a fallback tracking implementation
            mixpanel = {
              track: (event, props) =>
                console.log("Analytics event (fallback):", event, props),
              init: () => {},
            };
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load mixpanel:", err);
      });
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
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track("Page View", { page: pageName });
  }
};

// Track product view
export const trackProductView = (
  productId: string,
  productName: string,
  price: number,
) => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
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
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
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
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track("AI Interaction", {
      feature: featureName,
      ...parameters,
    });
  }
};

// Generic event tracking function
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track(eventName, properties || {});
  }
};
