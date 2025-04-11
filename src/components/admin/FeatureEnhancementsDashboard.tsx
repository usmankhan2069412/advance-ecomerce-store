"use client";

import React, { useState } from "react";
import {
  getAllEnhancements,
  getEnhancementsByCategory,
  getEnhancementsByStatus,
  tryOnEnhancements,
  designEnhancements,
  personalizationEnhancements
} from "@/lib/ai-feature-enhancements";
import {
  Layers,
  Zap,
  Calendar,
  Code,
  BarChart,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Shirt,
  Palette,
  Users
} from "lucide-react";

/**
 * Status badge component for feature enhancements
 */
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "released":
        return "bg-green-100 text-green-800";
      case "beta":
        return "bg-purple-100 text-purple-800";
      case "in-development":
        return "bg-blue-100 text-blue-800";
      case "planned":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "released":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "beta":
      case "in-development":
        return <Clock className="w-3 h-3 mr-1" />;
      case "planned":
      default:
        return <Calendar className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/**
 * Complexity badge component
 */
const ComplexityBadge = ({ complexity }: { complexity: string }) => {
  const getComplexityStyles = () => {
    switch (complexity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexityStyles()}`}>
      {complexity.charAt(0).toUpperCase() + complexity.slice(1)} Complexity
    </span>
  );
};

/**
 * Feature enhancement card component
 */
const EnhancementCard = ({ enhancement }: { enhancement: any }) => {
  const [expanded, setExpanded] = useState(false);

  const getCategoryIcon = () => {
    switch (enhancement.category) {
      case "try-on":
        return <Shirt className="w-5 h-5 text-blue-500" />;
      case "design":
        return <Palette className="w-5 h-5 text-purple-500" />;
      case "personalization":
        return <Users className="w-5 h-5 text-green-500" />;
      default:
        return <Zap className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {getCategoryIcon()}
            <h3 className="ml-2 text-lg font-semibold text-gray-900">{enhancement.name}</h3>
          </div>
          <StatusBadge status={enhancement.status} />
        </div>
        
        <p className="text-gray-600 mb-4">{enhancement.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Timeline: {enhancement.timeline}</span>
          <div className="ml-4">
            <ComplexityBadge complexity={enhancement.technicalDetails.complexity} />
          </div>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {expanded ? "Show less" : "Show more details"}
          <svg
            className={`ml-1 w-4 h-4 transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {expanded && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Code className="w-4 h-4 mr-1" /> Technical Implementation
            </h4>
            <div className="bg-white p-3 rounded border border-gray-200 text-sm">
              <p className="text-gray-700">{enhancement.technicalDetails.implementation}</p>
              
              {enhancement.technicalDetails.models && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">Models:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {enhancement.technicalDetails.models.map((model: string, index: number) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {enhancement.technicalDetails.apis && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">APIs:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {enhancement.technicalDetails.apis.map((api: string, index: number) => (
                      <span key={index} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                        {api}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <BarChart className="w-4 h-4 mr-1" /> Business Benefits
            </h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {enhancement.benefits.map((benefit: string, index: number) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          {enhancement.dependencies && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Layers className="w-4 h-4 mr-1" /> Dependencies
              </h4>
              <div className="flex flex-wrap gap-1">
                {enhancement.dependencies.map((dep: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Category section component
 */
const CategorySection = ({ title, icon, enhancements }: { title: string; icon: React.ReactNode; enhancements: any[] }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-bold ml-2">{title}</h2>
        <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm">
          {enhancements.length} enhancements
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancements.map((enhancement, index) => (
          <EnhancementCard key={index} enhancement={enhancement} />
        ))}
      </div>
    </div>
  );
};

/**
 * Feature Enhancements Dashboard Component
 * Displays planned and in-progress feature enhancements
 */
const FeatureEnhancementsDashboard = () => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const getFilteredEnhancements = (enhancements: any[]) => {
    if (!filterStatus) return enhancements;
    return enhancements.filter(enhancement => enhancement.status === filterStatus);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Feature Improvements</h1>
          <p className="text-gray-600">
            Upcoming enhancements to our AI features
          </p>
        </div>
        
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-2 text-gray-500" />
          <select
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="border border-gray-300 rounded-md shadow-sm py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All statuses</option>
            <option value="planned">Planned</option>
            <option value="in-development">In Development</option>
            <option value="beta">Beta</option>
            <option value="released">Released</option>
          </select>
        </div>
      </div>
      
      <CategorySection
        title="AI Try-On Enhancements"
        icon={<Shirt className="w-6 h-6 text-blue-500" />}
        enhancements={getFilteredEnhancements(tryOnEnhancements)}
      />
      
      <CategorySection
        title="Artist Design Platform Upgrades"
        icon={<Palette className="w-6 h-6 text-purple-500" />}
        enhancements={getFilteredEnhancements(designEnhancements)}
      />
      
      <CategorySection
        title="Personalization Engine"
        icon={<Users className="w-6 h-6 text-green-500" />}
        enhancements={getFilteredEnhancements(personalizationEnhancements)}
      />
    </div>
  );
};

export default FeatureEnhancementsDashboard; 