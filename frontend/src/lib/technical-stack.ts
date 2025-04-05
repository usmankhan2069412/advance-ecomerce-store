/**
 * Technical Stack Configuration
 * This file defines the core technical components used throughout the application
 */

// Frontend Libraries
export const frontendStack = {
  // Core Framework
  framework: "Next.js", // SSR + Static Site Generation
  
  // AI Libraries
  aiLibraries: {
    tensorflowJs: {
      name: "TensorFlow.js",
      purpose: "Client-side virtual try-on processing",
      implementation: "Lazy-loaded on product pages"
    },
    threeJs: {
      name: "Three.js",
      purpose: "3D product viewer",
      implementation: "Canvas-based rendering with optimized assets"
    }
  },
  
  // Animation Libraries
  animations: {
    framerMotion: {
      name: "Framer Motion",
      purpose: "Component transitions and micro-interactions"
    },
    gsap: {
      name: "GSAP",
      purpose: "Complex scroll-triggered animations and timeline effects"
    }
  }
};

// Backend Services
export const backendStack = {
  // Core Backend
  language: "Python",
  framework: "FastAPI",
  purpose: "Real-time features and AI model serving",
  
  // Database
  databases: {
    primary: {
      type: "PostgreSQL",
      purpose: "Main application data storage"
    },
    cache: {
      type: "Redis",
      purpose: "Caching for AI queries and session data"
    }
  },
  
  // AI Infrastructure
  aiInfrastructure: {
    modelTraining: {
      service: "AWS SageMaker",
      purpose: "Training and fine-tuning AI models"
    },
    mediaProcessing: {
      service: "Cloudinary",
      purpose: "AI-powered image/video processing"
    }
  }
};

// Third-Party Integrations
export const thirdPartyIntegrations = {
  payment: {
    provider: "Stripe",
    features: ["Standard payments", "Subscription handling", "Crypto payments"]
  },
  augmentedReality: {
    provider: "8th Wall",
    purpose: "WebAR integration for product visualization"
  },
  analytics: {
    providers: [
      {
        name: "Mixpanel",
        purpose: "User behavior tracking and funnel analysis"
      },
      {
        name: "Hotjar",
        purpose: "Heatmaps, session recordings, and user feedback"
      }
    ]
  }
};

/**
 * Initializes the technical stack components based on the current environment
 * @param {string} environment - The current environment (development, production, etc.)
 * @returns {Object} Initialized technical stack components
 */
export function initializeTechnicalStack(environment: 'development' | 'production' | 'test') {
  // Implementation would initialize different components based on environment
  console.log(`Initializing technical stack for ${environment} environment`);
  
  return {
    frontend: frontendStack,
    backend: backendStack,
    thirdParty: thirdPartyIntegrations,
    environment
  };
} 