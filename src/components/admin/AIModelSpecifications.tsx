"use client";

import React, { useState } from "react";
import { aiFeatureDocs } from "@/lib/ai-documentation-schema";
import {
  Cpu,
  Database,
  BarChart,
  GitBranch,
  Layers,
  Server
} from "lucide-react";

/**
 * AI Model Specifications Component
 * Displays detailed technical specifications for AI models
 */
const AIModelSpecifications = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("try-on");
  
  const feature = aiFeatureDocs[selectedFeature];
  const model = feature.modelSpecs;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Cpu className="w-5 h-5 mr-2 text-purple-600" />
        <h2 className="text-xl font-bold">AI Model Specifications</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Detailed technical specifications for AI models used in the platform
      </p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Feature
        </label>
        <select
          value={selectedFeature}
          onChange={(e) => setSelectedFeature(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.keys(aiFeatureDocs).map(id => (
            <option key={id} value={id}>
              {aiFeatureDocs[id].name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Layers className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium">{model.name}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 block">Architecture</span>
              <span className="text-base">{model.architecture}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500 block">Framework</span>
              <span className="text-base">{model.framework} {model.version}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500 block">Training Data</span>
              <span className="text-base">{model.trainedOn}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 block">Accuracy</span>
              <span className="text-base">{model.accuracy}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500 block">Type</span>
              <span className="text-base">{model.type}</span>
            </div>
            
            {model.parameters && (
              <div>
                <span className="text-sm font-medium text-gray-500 block">Parameters</span>
                <span className="text-base">{model.parameters}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Performance Metrics</h4>
          <div className="space-y-2">
            {feature.performance.map((metric, index) => (
              <div key={index} className="flex items-start">
                <BarChart className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                <div>
                  <span className="font-medium">{metric.name}</span>
                  <p className="text-sm text-gray-600">{metric.target}</p>
                  {metric.environment && (
                    <p className="text-xs text-gray-500">Environment: {metric.environment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Validation Rules</h4>
          <div className="space-y-2">
            {feature.validation.map((rule, index) => (
              <div key={index} className="flex items-start">
                <GitBranch className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <span className="font-medium">{rule.target}</span>
                  <p className="text-sm text-gray-600">{rule.rule}</p>
                  <p className="text-xs text-red-500">Error: {rule.errorMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Data Privacy</h4>
          <div className="space-y-2">
            <div className="flex items-start">
              <Database className="w-4 h-4 text-indigo-600 mt-0.5 mr-2" />
              <div>
                <span className="font-medium">Retention Policy</span>
                <p className="text-sm text-gray-600">{feature.dataPrivacy.retentionPolicy}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Server className="w-4 h-4 text-indigo-600 mt-0.5 mr-2" />
              <div>
                <span className="font-medium">Storage & Encryption</span>
                <p className="text-sm text-gray-600">{feature.dataPrivacy.dataStorage}</p>
                <p className="text-sm text-gray-600">{feature.dataPrivacy.encryption}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelSpecifications; 