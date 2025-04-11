"use client";

import React, { useState } from "react";
import { 
  frontendStack, 
  backendStack, 
  thirdPartyIntegrations 
} from "@/lib/technical-stack";
import {
  Server,
  Database,
  Cloud,
  CreditCard,
  Layers,
  BarChart,
  Cpu
} from "lucide-react";

/**
 * TechnicalStackDashboard component
 * Displays the current technical stack configuration and status
 */
const TechnicalStackDashboard = () => {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'integrations'>('frontend');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Technical Stack Overview</h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'frontend' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('frontend')}
        >
          Frontend
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'backend' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('backend')}
        >
          Backend
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'integrations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
      </div>
      
      {/* Frontend Stack */}
      {activeTab === 'frontend' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Core Framework</h3>
            <p className="text-gray-700">
              <span className="font-semibold">{frontendStack.framework}</span> - 
              Server-Side Rendering + Static Site Generation
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">AI Libraries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <Cpu className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-medium">{frontendStack.aiLibraries.tensorflowJs.name}</span>
                </div>
                <p className="text-sm text-gray-600">{frontendStack.aiLibraries.tensorflowJs.purpose}</p>
              </div>
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <Layers className="w-5 h-5 mr-2 text-purple-500" />
                  <span className="font-medium">{frontendStack.aiLibraries.threeJs.name}</span>
                </div>
                <p className="text-sm text-gray-600">{frontendStack.aiLibraries.threeJs.purpose}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Animation Libraries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <span className="font-medium">{frontendStack.animations.framerMotion.name}</span>
                </div>
                <p className="text-sm text-gray-600">{frontendStack.animations.framerMotion.purpose}</p>
              </div>
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <span className="font-medium">{frontendStack.animations.gsap.name}</span>
                </div>
                <p className="text-sm text-gray-600">{frontendStack.animations.gsap.purpose}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Backend Stack */}
      {activeTab === 'backend' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Core Backend</h3>
            <div className="flex items-center">
              <Server className="w-5 h-5 mr-2 text-green-500" />
              <p className="text-gray-700">
                <span className="font-semibold">{backendStack.language} ({backendStack.framework})</span> - 
                {backendStack.purpose}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Databases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <Database className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-medium">{backendStack.databases.primary.type}</span>
                </div>
                <p className="text-sm text-gray-600">{backendStack.databases.primary.purpose}</p>
              </div>
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <Database className="w-5 h-5 mr-2 text-red-500" />
                  <span className="font-medium">{backendStack.databases.cache.type}</span>
                </div>
                <p className="text-sm text-gray-600">{backendStack.databases.cache.purpose}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">AI Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <Cloud className="w-5 h-5 mr-2 text-orange-500" />
                  <span className="font-medium">{backendStack.aiInfrastructure.modelTraining.service}</span>
                </div>
                <p className="text-sm text-gray-600">{backendStack.aiInfrastructure.modelTraining.purpose}</p>
              </div>
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <Cloud className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-medium">{backendStack.aiInfrastructure.mediaProcessing.service}</span>
                </div>
                <p className="text-sm text-gray-600">{backendStack.aiInfrastructure.mediaProcessing.purpose}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Third-Party Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Payment</h3>
            <div className="flex items-center mb-2">
              <CreditCard className="w-5 h-5 mr-2 text-purple-500" />
              <span className="font-medium">{thirdPartyIntegrations.payment.provider}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {thirdPartyIntegrations.payment.features.map((feature, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Augmented Reality</h3>
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center mb-2">
                <span className="font-medium">{thirdPartyIntegrations.augmentedReality.provider}</span>
              </div>
              <p className="text-sm text-gray-600">{thirdPartyIntegrations.augmentedReality.purpose}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {thirdPartyIntegrations.analytics.providers.map((provider, index) => (
                <div key={index} className="border border-gray-200 rounded p-3">
                  <div className="flex items-center mb-2">
                    <BarChart className="w-5 h-5 mr-2 text-green-500" />
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{provider.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalStackDashboard; 