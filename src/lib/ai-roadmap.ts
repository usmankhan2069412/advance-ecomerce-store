/**
 * AI Integration Roadmap
 * This file defines the AI features roadmap and implementation status
 */

// Phase definitions with timeline and features
export const aiRoadmap = {
  // Phase 1 (MVP)
  phase1: {
    name: "MVP AI Features",
    status: "in-progress", // 'planned', 'in-progress', 'completed'
    timeline: "Q3 2023",
    features: [
      {
        id: "try-on-basic",
        name: "Basic Virtual Try-On",
        description: "Image segmentation using U-Net architecture for basic virtual try-on",
        status: "in-progress",
        implementation: {
          frontend: "TensorFlow.js for client-side processing",
          backend: "Python FastAPI for heavy processing tasks",
          model: "U-Net for image segmentation"
        },
        demoUrl: "/demo/virtual-try-on"
      },
      {
        id: "artist-design-tool",
        name: "Artist Design Tool",
        description: "Design tool powered by Stable Diffusion API for custom product creation",
        status: "planned",
        implementation: {
          frontend: "React canvas with design controls",
          backend: "Integration with Stable Diffusion API",
          model: "Stable Diffusion fine-tuned on fashion datasets"
        },
        demoUrl: "/demo/design-tool"
      }
    ]
  },
  
  // Phase 2 (Advanced)
  phase2: {
    name: "Advanced AI Features",
    status: "planned",
    timeline: "Q1 2024",
    features: [
      {
        id: "ar-try-on",
        name: "AR Try-On with Pose Estimation",
        description: "Augmented reality try-on using MediaPipe for real-time pose estimation",
        status: "planned",
        implementation: {
          frontend: "WebXR API with Three.js",
          backend: "MediaPipe integration for pose tracking",
          model: "PoseNet with custom clothing overlay models"
        },
        demoUrl: "/demo/ar-try-on"
      },
      {
        id: "ai-stylist",
        name: "AI Stylist Chatbot",
        description: "Personalized styling recommendations based on user preferences and trends",
        status: "planned",
        implementation: {
          frontend: "Interactive chat interface with suggestion cards",
          backend: "Fine-tuned LLM for fashion advice",
          model: "Custom model trained on fashion datasets and styling guides"
        },
        demoUrl: "/demo/ai-stylist"
      }
    ]
  },
  
  // Phase 3 (Innovation)
  phase3: {
    name: "Innovative AI Features",
    status: "planned",
    timeline: "Q3 2024",
    features: [
      {
        id: "gan-design",
        name: "GAN-based Custom Design Generation",
        description: "Generate completely new designs based on user preferences using GANs",
        status: "planned",
        implementation: {
          frontend: "Interactive design parameter controls",
          backend: "GAN model deployment on AWS SageMaker",
          model: "StyleGAN3 fine-tuned on fashion datasets"
        },
        demoUrl: "/demo/gan-design"
      },
      {
        id: "voice-assistant",
        name: "Voice-Powered Shopping Assistant",
        description: "Natural language voice interface for browsing and purchasing products",
        status: "planned",
        implementation: {
          frontend: "Web Speech API integration",
          backend: "Speech-to-intent processing pipeline",
          model: "Custom NLP model for shopping-specific commands"
        },
        demoUrl: "/demo/voice-assistant"
      }
    ]
  }
};

/**
 * Get all AI features across all phases
 * @returns Array of all AI features
 */
export function getAllAIFeatures() {
  return [
    ...aiRoadmap.phase1.features,
    ...aiRoadmap.phase2.features,
    ...aiRoadmap.phase3.features
  ];
}

/**
 * Get active AI features (in-progress or completed)
 * @returns Array of active AI features
 */
export function getActiveAIFeatures() {
  return getAllAIFeatures().filter(
    feature => feature.status === "in-progress" || feature.status === "completed"
  );
}

/**
 * Get feature by ID
 * @param id Feature ID to find
 * @returns Feature object or undefined if not found
 */
export function getFeatureById(id: string) {
  return getAllAIFeatures().find(feature => feature.id === id);
} 