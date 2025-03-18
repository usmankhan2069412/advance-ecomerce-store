/**
 * AI Documentation Schema
 * Defines structured formats for AI feature documentation
 */

// Feature documentation schema
export interface AIFeatureDoc {
  id: string;
  name: string;
  description: string;
  inputs: AIParameterDoc[];
  outputs: AIParameterDoc[];
  errorCodes: AIErrorCode[];
  modelSpecs: AIModelSpec;
  apiEndpoint: AIEndpointDoc;
  dataPrivacy: AIDataPrivacyDoc;
  validation: AIValidationRule[];
  performance: AIPerformanceMetric[];
}

// Parameter documentation schema
export interface AIParameterDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  constraints?: string;
}

// Error code documentation
export interface AIErrorCode {
  code: number;
  message: string;
  resolution: string;
}

// Model specification documentation
export interface AIModelSpec {
  name: string;
  type: string;
  architecture: string;
  framework: string;
  version: string;
  trainedOn: string;
  accuracy: string;
  parameters?: string;
}

// API endpoint documentation
export interface AIEndpointDoc {
  path: string;
  method: string;
  headers: Record<string, string>;
  requestBody: string;
  responseBody: string;
  rateLimit?: string;
}

// Data privacy documentation
export interface AIDataPrivacyDoc {
  retentionPolicy: string;
  dataStorage: string;
  encryption: string;
  compliance: string[];
  userConsent: string;
}

// Validation rule documentation
export interface AIValidationRule {
  target: string;
  rule: string;
  errorMessage: string;
}

// Performance metric documentation
export interface AIPerformanceMetric {
  name: string;
  target: string;
  measurement: string;
  environment?: string;
}

/**
 * AI Feature Documentation Collection
 * Contains structured documentation for all AI features
 */
export const aiFeatureDocs: Record<string, AIFeatureDoc> = {
  // Virtual Try-On Feature
  "try-on": {
    id: "try-on",
    name: "AI Virtual Try-On",
    description: "Allows users to virtually try on garments using their uploaded photos",
    inputs: [
      {
        name: "User_image",
        type: "JPEG/PNG",
        description: "User's photo for virtual try-on",
        required: true,
        constraints: "Max 5MB, min dimensions 500px × 500px"
      },
      {
        name: "Garment_ID",
        type: "String",
        description: "Unique identifier for the garment to try on",
        required: true
      },
      {
        name: "Options",
        type: "Object",
        description: "Additional processing options",
        required: false
      }
    ],
    outputs: [
      {
        name: "Overlay_image",
        type: "Base64",
        description: "Processed image with garment overlay",
        required: true
      },
      {
        name: "Confidence_score",
        type: "Float",
        description: "Confidence level of the try-on result (0.0-1.0)",
        required: true
      }
    ],
    errorCodes: [
      {
        code: 400,
        message: "Invalid image format",
        resolution: "Ensure image is JPEG or PNG format under 5MB"
      },
      {
        code: 422,
        message: "Face not detected",
        resolution: "Upload a clear photo showing your face"
      },
      {
        code: 503,
        message: "Model inference timeout",
        resolution: "Try again or use a simpler image"
      }
    ],
    modelSpecs: {
      name: "TryOnNet",
      type: "Segmentation + Warping",
      architecture: "U-Net",
      framework: "TensorFlow",
      version: "2.1.0",
      trainedOn: "Fashion dataset with 100,000+ human poses",
      accuracy: "92% alignment accuracy on test set"
    },
    apiEndpoint: {
      path: "/api/ai/try-on",
      method: "POST",
      headers: {
        "Authorization": "Bearer <API_KEY>",
        "Content-Type": "application/json"
      },
      requestBody: '{ "image": "base64_string", "garment_id": "123" }',
      responseBody: '{ "result_image": "base64_string", "confidence_score": 0.95, "processing_time": "1.2s" }',
      rateLimit: "10 requests per minute per user"
    },
    dataPrivacy: {
      retentionPolicy: "User images deleted after 24 hours",
      dataStorage: "Temporary storage in region-specific secure cloud storage",
      encryption: "AES-256 for stored images; TLS 1.3 for data in transit",
      compliance: ["GDPR", "CCPA"],
      userConsent: "Explicit consent required before image processing"
    },
    validation: [
      {
        target: "image",
        rule: "Image dimensions ≥ 500px × 500px",
        errorMessage: "Image too small, minimum size is 500x500 pixels"
      },
      {
        target: "face_detection",
        rule: "Face detection confidence > 70%",
        errorMessage: "Unable to detect face clearly in the image"
      }
    ],
    performance: [
      {
        name: "Response Time",
        target: "95% of requests processed in <2s",
        measurement: "P95 latency",
        environment: "AWS Inferentia"
      },
      {
        name: "Throughput",
        target: "50 concurrent requests per instance",
        measurement: "Requests per second"
      }
    ]
  },
  
  // Artist Design Tool Feature
  "design-tool": {
    id: "design-tool",
    name: "AI Artist Design Tool",
    description: "Enables artists to create and customize designs using AI-assisted tools",
    inputs: [
      {
        name: "Text_prompt",
        type: "String",
        description: "Text description of the desired design",
        required: true,
        constraints: "Max 500 characters"
      },
      {
        name: "Base_design",
        type: "SVG/PNG",
        description: "Optional base design to modify",
        required: false,
        constraints: "Max 10MB"
      },
      {
        name: "Style_reference",
        type: "JPEG/PNG",
        description: "Reference image for style transfer",
        required: false,
        constraints: "Max 5MB"
      }
    ],
    outputs: [
      {
        name: "Generated_design",
        type: "SVG/PNG",
        description: "AI-generated or modified design",
        required: true
      },
      {
        name: "Design_variations",
        type: "Array<PNG>",
        description: "Alternative design variations",
        required: true
      }
    ],
    errorCodes: [
      {
        code: 400,
        message: "Invalid input format",
        resolution: "Check file formats and sizes"
      },
      {
        code: 422,
        message: "Inappropriate content detected",
        resolution: "Modify text prompt to comply with content policy"
      },
      {
        code: 429,
        message: "Rate limit exceeded",
        resolution: "Try again later or upgrade account tier"
      }
    ],
    modelSpecs: {
      name: "DesignGAN",
      type: "Generative + Style Transfer",
      architecture: "StyleGAN2 + CLIP",
      framework: "PyTorch",
      version: "1.8.0",
      trainedOn: "Fashion design dataset with 50,000+ professional designs",
      accuracy: "CLIP score 0.85 for text-to-image alignment"
    },
    apiEndpoint: {
      path: "/api/ai/design",
      method: "POST",
      headers: {
        "Authorization": "Bearer <API_KEY>",
        "Content-Type": "multipart/form-data"
      },
      requestBody: 'FormData with "prompt", optional "base_design" and "style_reference" files',
      responseBody: '{ "design": "svg_string", "variations": ["url1", "url2"], "processing_time": "3.5s" }'
    },
    dataPrivacy: {
      retentionPolicy: "Designs stored for 30 days unless saved to user account",
      dataStorage: "Encrypted cloud storage with user-specific access controls",
      encryption: "AES-256 for stored designs; TLS 1.3 for data in transit",
      compliance: ["GDPR", "CCPA"],
      userConsent: "Terms of service acceptance required for design generation"
    },
    validation: [
      {
        target: "text_prompt",
        rule: "No prohibited content as defined in content policy",
        errorMessage: "Your prompt contains prohibited content"
      },
      {
        target: "svg_file",
        rule: "Reject SVG files > 10MB",
        errorMessage: "SVG file too large, maximum size is 10MB"
      }
    ],
    performance: [
      {
        name: "Generation Time",
        target: "90% of designs generated in <5s",
        measurement: "P90 latency"
      },
      {
        name: "Scalability",
        target: "Auto-scaling during peak traffic periods",
        measurement: "Kubernetes HPA metrics",
        environment: "GCP with T4 GPUs"
      }
    ]
  }
};

/**
 * Generate machine-readable documentation in markdown format
 * @param featureId The ID of the feature to document
 * @returns Markdown string with structured documentation
 */
export function generateMachineReadableDoc(featureId: string): string {
  const feature = aiFeatureDocs[featureId];
  if (!feature) return "Feature not found";
  
  let markdown = `## ${feature.id.toUpperCase()}_FEATURE\n`;
  
  // Inputs
  markdown += "- **Input:**\n";
  feature.inputs.forEach(input => {
    markdown += `  - ${input.name} (${input.type}${input.constraints ? `, ${input.constraints}` : ''})\n`;
  });
  
  // Outputs
  markdown += "- **Output:**\n";
  feature.outputs.forEach(output => {
    markdown += `  - ${output.name} (${output.type})\n`;
  });
  
  // Error Codes
  markdown += "- **Error Codes:**\n";
  feature.errorCodes.forEach(error => {
    markdown += `  - ${error.code}: ${error.message}\n`;
  });
  
  // Model Specs
  markdown += "- **Model:**\n";
  markdown += `  - ${feature.modelSpecs.name} (${feature.modelSpecs.architecture})\n`;
  markdown += `  - Framework: ${feature.modelSpecs.framework} ${feature.modelSpecs.version}\n`;
  
  // API Endpoint
  markdown += "- **API:**\n";
  markdown += `  - ${feature.apiEndpoint.method} ${feature.apiEndpoint.path}\n`;
  
  // Data Privacy
  markdown += "- **Privacy:**\n";
  markdown += `  - ${feature.dataPrivacy.retentionPolicy}\n`;
  markdown += `  - Encryption: ${feature.dataPrivacy.encryption}\n`;
  
  return markdown;
}

/**
 * Parse machine-readable documentation from markdown
 * @param markdown Markdown string with structured documentation
 * @returns Parsed feature documentation object
 */
export function parseMachineReadableDoc(markdown: string): Partial<AIFeatureDoc> {
  const result: Partial<AIFeatureDoc> = {
    inputs: [],
    outputs: [],
    errorCodes: []
  };
  
  // Extract feature ID from header
  const idMatch = markdown.match(/## ([A-Z_]+)_FEATURE/);
  if (idMatch) {
    result.id = idMatch[1].toLowerCase();
  }
  
  // Extract inputs
  const inputSection = markdown.match(/- \*\*Input:\*\*\n([\s\S]*?)(?=- \*\*)/);
  if (inputSection) {
    const inputLines = inputSection[1].match(/  - (.*?) \((.*?)(?:, (.*?))?\)/g);
    if (inputLines) {
      inputLines.forEach(line => {
        const match = line.match(/  - (.*?) \((.*?)(?:, (.*?))?\)/);
        if (match) {
          result.inputs?.push({
            name: match[1],
            type: match[2],
            description: "",
            required: true,
            constraints: match[3]
          });
        }
      });
    }
  }
  
  // Similar parsing for other sections would be implemented here
  
  return result;
} 