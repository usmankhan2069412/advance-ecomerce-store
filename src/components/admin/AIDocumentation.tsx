"use client";

import React, { useState } from "react";
import {
  Code,
  FileText,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Server,
  User,
  Database,
  Workflow,
  Search,
  Sparkles,
  ShoppingCart,
  Award,
  Cpu,
  FileOutput,
  Trash
} from "lucide-react";

/**
 * API Endpoint Documentation Component
 */
const APIEndpointDoc = ({ 
  endpoint, 
  method, 
  description, 
  requestParams, 
  responseParams,
  exampleRequest,
  exampleResponse
}: {
  endpoint: string;
  method: string;
  description: string;
  requestParams: { name: string; type: string; description: string; required: boolean }[];
  responseParams: { name: string; type: string; description: string }[];
  exampleRequest: string;
  exampleResponse: string;
}) => {
  const [showExample, setShowExample] = useState(false);
  
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(method)}`}>
              {method.toUpperCase()}
            </span>
            <code className="ml-2 text-lg font-mono">{endpoint}</code>
          </div>
          <button
            onClick={() => setShowExample(!showExample)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showExample ? "Hide Example" : "Show Example"}
          </button>
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      
      <div className="p-4">
        <h4 className="font-medium mb-2">Request Parameters</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requestParams.map((param, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-mono">{param.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{param.type}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {param.required ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">{param.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <h4 className="font-medium mt-6 mb-2">Response Parameters</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responseParams.map((param, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-mono">{param.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{param.type}</td>
                  <td className="px-4 py-2 text-sm">{param.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {showExample && (
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Example Request</h4>
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {exampleRequest}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Example Response</h4>
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {exampleResponse}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Data Flow Diagram Component
 */
const DataFlowDiagram = ({ 
  title, 
  steps 
}: { 
  title: string; 
  steps: { 
    name: string; 
    description: string; 
    icon: React.ReactNode;
  }[] 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex mb-8 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center z-10">
              {step.icon}
            </div>
            
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-blue-200 -mb-4" />
            )}
            
            <div className="ml-4">
              <h4 className="text-md font-medium">{step.name}</h4>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Error Handling Documentation Component
 */
const ErrorHandlingDoc = ({ 
  scenario, 
  solution, 
  fallback 
}: { 
  scenario: string; 
  solution: string; 
  fallback: string; 
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h4 className="font-medium">{scenario}</h4>
          <p className="text-gray-600 mt-1">{solution}</p>
          
          <div className="mt-3 bg-gray-50 p-3 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="font-medium text-sm">Fallback Strategy:</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{fallback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * AI Documentation Component
 * Comprehensive documentation for AI agents and APIs
 */
const AIDocumentation = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'dataflow' | 'errors'>('api');
  
  // API Endpoints Documentation
  const apiEndpoints = [
    {
      endpoint: "/api/try-on",
      method: "POST",
      description: "Virtual try-on endpoint that processes user images with product overlays",
      requestParams: [
        { 
          name: "image", 
          type: "string (base64)", 
          description: "Base64-encoded user image", 
          required: true 
        },
        { 
          name: "product_id", 
          type: "string", 
          description: "ID of the product to try on", 
          required: true 
        },
        { 
          name: "options", 
          type: "object", 
          description: "Additional processing options", 
          required: false 
        }
      ],
      responseParams: [
        { 
          name: "overlay_image", 
          type: "string (base64)", 
          description: "Base64-encoded result image with product overlay" 
        },
        { 
          name: "confidence_score", 
          type: "float", 
          description: "Confidence score of the try-on result (0.0-1.0)" 
        },
        { 
          name: "processing_time_ms", 
          type: "integer", 
          description: "Processing time in milliseconds" 
        }
      ],
      exampleRequest: `
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...",
  "product_id": "prod_123456789",
  "options": {
    "size": "M",
    "color": "blue",
    "quality": "high"
  }
}`,
      exampleResponse: `
{
  "overlay_image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...",
  "confidence_score": 0.92,
  "processing_time_ms": 1250
}`
    },
    {
      endpoint: "/api/ai-recommendations",
      method: "GET",
      description: "Get AI-powered product recommendations based on user preferences and behavior",
      requestParams: [
        { 
          name: "user_id", 
          type: "string", 
          description: "User ID for personalized recommendations", 
          required: true 
        },
        { 
          name: "limit", 
          type: "integer", 
          description: "Maximum number of recommendations to return", 
          required: false 
        },
        { 
          name: "category", 
          type: "string", 
          description: "Filter recommendations by category", 
          required: false 
        }
      ],
      responseParams: [
        { 
          name: "recommendations", 
          type: "array", 
          description: "Array of recommended product objects" 
        },
        { 
          name: "relevance_scores", 
          type: "object", 
          description: "Relevance scores for each recommendation" 
        },
        { 
          name: "recommendation_id", 
          type: "string", 
          description: "Unique ID for this recommendation set for analytics tracking" 
        }
      ],
      exampleRequest: `
{
  "user_id": "user_987654321",
  "limit": 5,
  "category": "clothing"
}`,
      exampleResponse: `
{
  "recommendations": [
    {
      "product_id": "prod_123456",
      "name": "Premium Cotton T-Shirt",
      "price": 29.99,
      "image_url": "https://example.com/images/tshirt.jpg"
    },
    {
      "product_id": "prod_789012",
      "name": "Slim Fit Jeans",
      "price": 59.99,
      "image_url": "https://example.com/images/jeans.jpg"
    }
  ],
  "relevance_scores": {
    "prod_123456": 0.95,
    "prod_789012": 0.87
  },
  "recommendation_id": "rec_567890123"
}`
    },
    {
      endpoint: "/api/design-certificate",
      method: "POST",
      description: "Generate blockchain certificate for a custom design",
      requestParams: [
        { 
          name: "design_id", 
          type: "string", 
          description: "ID of the custom design", 
          required: true 
        },
        { 
          name: "designer_id", 
          type: "string", 
          description: "ID of the designer", 
          required: true 
        },
        { 
          name: "metadata", 
          type: "object", 
          description: "Additional metadata for the certificate", 
          required: true 
        }
      ],
      responseParams: [
        { 
          name: "certificate_id", 
          type: "string", 
          description: "Unique ID of the generated certificate" 
        },
        { 
          name: "transaction_hash", 
          type: "string", 
          description: "Blockchain transaction hash" 
        },
        { 
          name: "certificate_url", 
          type: "string", 
          description: "URL to view the certificate" 
        }
      ],
      exampleRequest: `
{
  "design_id": "design_123456789",
  "designer_id": "designer_987654321",
  "metadata": {
    "name": "Summer Collection 2023 - Floral Dress",
    "creation_date": "2023-06-15T14:30:00Z",
    "materials": ["cotton", "silk"],
    "sustainability_score": 85
  }
}`,
      exampleResponse: `
{
  "certificate_id": "cert_567890123",
  "transaction_hash": "0x1234567890abcdef1234567890abcdef12345678",
  "certificate_url": "https://example.com/certificates/cert_567890123"
}`
    }
  ];
  
  // User Journey Data Flow
  const userJourneySteps = [
    {
      name: "Search & Discovery",
      description: "User searches for products or browses categories. AI analyzes search patterns and browsing behavior.",
      icon: <Search className="w-6 h-6 text-blue-600" />
    },
    {
      name: "AI Recommendations",
      description: "Based on user behavior and preferences, AI suggests personalized product recommendations.",
      icon: <Sparkles className="w-6 h-6 text-blue-600" />
    },
    {
      name: "Virtual Try-On",
      description: "User selects a product and uses the virtual try-on feature to visualize how it looks.",
      icon: <User className="w-6 h-6 text-blue-600" />
    },
    {
      name: "Checkout Process",
      description: "User proceeds to checkout. AI optimizes the checkout flow based on user preferences.",
      icon: <ShoppingCart className="w-6 h-6 text-blue-600" />
    },
    {
      name: "NFT Loyalty Rewards",
      description: "After purchase, user receives NFT-based loyalty rewards on the Polygon blockchain.",
      icon: <Award className="w-6 h-6 text-blue-600" />
    }
  ];
  
  // Data Processing Flow
  const dataProcessingSteps = [
    {
      name: "Data Collection",
      description: "User data is collected with explicit consent and encrypted for processing.",
      icon: <Database className="w-6 h-6 text-purple-600" />
    },
    {
      name: "AI Processing",
      description: "Data is processed by AI models, with sensitive operations performed client-side when possible.",
      icon: <Cpu className="w-6 h-6 text-purple-600" />
    },
    {
      name: "Result Generation",
      description: "AI generates results (recommendations, try-on images, etc.) based on processed data.",
      icon: <FileOutput className="w-6 h-6 text-purple-600" />
    },
    {
      name: "Data Cleanup",
      description: "Temporary data is deleted after 24 hours, with permanent data stored securely.",
      icon: <Trash className="w-6 h-6 text-purple-600" />
    }
  ];
  
  // Error Handling Scenarios
  const errorScenarios = [
    {
      scenario: "Virtual Try-On Failure",
      solution: "When the virtual try-on process fails due to image quality or processing errors, the system detects the failure and implements fallback strategies.",
      fallback: "Display size charts, show product on model images, and offer live chat support for sizing assistance."
    },
    {
      scenario: "AI Recommendation Engine Unavailable",
      solution: "If the AI recommendation service is unavailable or returns low-confidence results, the system gracefully degrades.",
      fallback: "Show trending products, bestsellers, and category-based recommendations instead of personalized ones."
    },
    {
      scenario: "Blockchain Certificate Generation Failure",
      solution: "When blockchain certificate generation fails due to network issues or contract errors, the system queues the request.",
      fallback: "Issue a temporary digital certificate and queue the blockchain transaction for later processing with notification to the user."
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold">AI Agent Documentation</h1>
        </div>
        <p className="text-gray-600">
          Comprehensive documentation for AI agents, APIs, data flows, and error handling
        </p>
      </div>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'api' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('api')}
        >
          API Specifications
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'dataflow' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('dataflow')}
        >
          Data Flows
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'errors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('errors')}
        >
          Error Handling
        </button>
      </div>
      
      {activeTab === 'api' && (
        <div>
          <h2 className="text-xl font-bold mb-4">API Specifications</h2>
          <p className="text-gray-600 mb-6">
            Detailed documentation for AI-related API endpoints
          </p>
          
          {apiEndpoints.map((endpoint, index) => (
            <APIEndpointDoc
              key={index}
              endpoint={endpoint.endpoint}
              method={endpoint.method}
              description={endpoint.description}
              requestParams={endpoint.requestParams}
              responseParams={endpoint.responseParams}
              exampleRequest={endpoint.exampleRequest}
              exampleResponse={endpoint.exampleResponse}
            />
          ))}
        </div>
      )}
      
      {activeTab === 'dataflow' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Data Flows</h2>
          <p className="text-gray-600 mb-6">
            Visualization of data flows and user journeys through the platform
          </p>
          
          <DataFlowDiagram
            title="User Journey"
            steps={userJourneySteps}
          />
          
          <DataFlowDiagram
            title="Data Processing Flow"
            steps={dataProcessingSteps}
          />
        </div>
      )}
      
      {activeTab === 'errors' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Error Handling</h2>
          <p className="text-gray-600 mb-6">
            Strategies for handling errors and providing fallback experiences
          </p>
          
          {errorScenarios.map((scenario, index) => (
            <ErrorHandlingDoc
              key={index}
              scenario={scenario.scenario}
              solution={scenario.solution}
              fallback={scenario.fallback}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIDocumentation; 