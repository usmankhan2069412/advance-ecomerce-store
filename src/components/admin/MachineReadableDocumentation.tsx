"use client";

import React, { useState } from "react";
import { aiFeatureDocs, generateMachineReadableDoc } from "@/lib/ai-documentation-schema";
import { Code, Copy, Check, FileText } from "lucide-react";

/**
 * Machine Readable Documentation Component
 * Displays AI feature documentation in a machine-parsable format
 */
const MachineReadableDocumentation = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("try-on");
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const markdown = generateMachineReadableDoc(selectedFeature);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const markdown = generateMachineReadableDoc(selectedFeature);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 mr-2 text-blue-600" />
        <h2 className="text-xl font-bold">Machine-Readable Documentation</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Structured documentation format for AI systems to parse and understand our AI features
      </p>
      
      <div className="mb-4">
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
      
      <div className="relative">
        <div className="absolute top-2 right-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre-wrap border border-gray-200">
          {markdown}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Usage Instructions</h3>
        <p className="text-gray-600 mb-2">
          This documentation format is designed to be parsed by AI systems and other automated tools.
          The structured format ensures consistent interpretation of feature capabilities.
        </p>
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Integration Example</h4>
          <code className="text-xs text-blue-800 block">
            const aiDoc = fetchDocumentation("try-on");<br />
            validateRequest(request, aiDoc.inputs);<br />
            processWithErrorHandling(request, aiDoc.errorCodes);
          </code>
        </div>
      </div>
    </div>
  );
};

export default MachineReadableDocumentation; 