"use client";

import React, { useState } from "react";
import { 
  futureRoadmap,
  getFeaturesByTimeframe
} from "@/lib/future-enhancements";
import {
  Globe,
  Video,
  Package,
  Mic,
  Ruler,
  Share2,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Code,
  Sparkles,
  Lightbulb
} from "lucide-react";

/**
 * Status badge component for feature status
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
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "research":
      case "concept":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "released":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "beta":
      case "in-development":
        return <Clock className="w-3 h-3 mr-1" />;
      case "planning":
      case "research":
      case "concept":
      default:
        return <Lightbulb className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}>
      {getStatusIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/**
 * Feature card component
 */
const FeatureCard = ({ feature }: { feature: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getFeatureIcon = (name: string) => {
    if (name.toLowerCase().includes('voice')) return <Mic className="w-5 h-5 text-purple-500" />;
    if (name.toLowerCase().includes('fit') || name.toLowerCase().includes('size')) return <Ruler className="w-5 h-5 text-blue-500" />;
    if (name.toLowerCase().includes('social') || name.toLowerCase().includes('sharing')) return <Share2 className="w-5 h-5 text-green-500" />;
    if (name.toLowerCase().includes('virtual') || name.toLowerCase().includes('metaverse')) return <Globe className="w-5 h-5 text-indigo-500" />;
    if (name.toLowerCase().includes('fashion') || name.toLowerCase().includes('show')) return <Video className="w-5 h-5 text-red-500" />;
    if (name.toLowerCase().includes('subscription') || name.toLowerCase().includes('box')) return <Package className="w-5 h-5 text-orange-500" />;
    return <Sparkles className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            {getFeatureIcon(feature.name)}
            <h3 className="text-lg font-medium ml-2">{feature.name}</h3>
          </div>
          <StatusBadge status={feature.status} />
        </div>
        <p className="text-gray-600 mb-4">{feature.description}</p>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {expanded ? "Hide technical details" : "Show technical details"}
        </button>
        
        {expanded && feature.technicalRequirements && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-start">
              <Code className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
              <div>
                <span className="font-medium">Technical Requirements:</span>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                  {feature.technicalRequirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Timeline section component
 */
const TimelineSection = ({ timeframe, features }: { timeframe: string, features: any[] }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold">{timeframe}</h2>
      </div>
      
      <div className="ml-12 space-y-6">
        {features.map((categoryGroup, index) => (
          <div key={index}>
            <h3 className="text-lg font-medium mb-3">{categoryGroup.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryGroup.features.map((feature: any, featureIndex: number) => (
                <FeatureCard key={featureIndex} feature={feature} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Category section component
 */
const CategorySection = ({ title, icon, description, features }: { 
  title: string, 
  icon: React.ReactNode, 
  description: string, 
  features: any[] 
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
          {icon}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-600 mb-4 ml-12">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </div>
  );
};

/**
 * Future Enhancements Dashboard component
 * Displays the planned future features and enhancements
 */
const FutureEnhancementsDashboard = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'category'>('timeline');
  
  // Get unique timeframes
  const timeframes = Array.from(new Set([
    futureRoadmap.metaverseIntegration.timeline,
    futureRoadmap.aiFashionShows.timeline,
    futureRoadmap.subscriptionBoxes.timeline,
    ...futureRoadmap.additionalEnhancements.map(e => e.timeline)
  ])).sort();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Future Enhancements</h1>
        <p className="text-gray-600">
          Our roadmap for upcoming features and platform innovations
        </p>
        
        <div className="flex mt-4 border-b">
          <button
            className={`px-4 py-2 font-medium ${viewMode === 'timeline' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline View
          </button>
          <button
            className={`px-4 py-2 font-medium ${viewMode === 'category' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setViewMode('category')}
          >
            Category View
          </button>
        </div>
      </div>
      
      {viewMode === 'timeline' ? (
        <div>
          {timeframes.map((timeframe, index) => (
            <TimelineSection 
              key={index} 
              timeframe={timeframe} 
              features={getFeaturesByTimeframe(timeframe)} 
            />
          ))}
        </div>
      ) : (
        <div>
          <CategorySection
            title="Metaverse Integration"
            icon={<Globe className="w-5 h-5 text-indigo-600" />}
            description={futureRoadmap.metaverseIntegration.description}
            features={futureRoadmap.metaverseIntegration.features}
          />
          
          <CategorySection
            title="AI Fashion Shows"
            icon={<Video className="w-5 h-5 text-red-600" />}
            description={futureRoadmap.aiFashionShows.description}
            features={futureRoadmap.aiFashionShows.features}
          />
          
          <CategorySection
            title="Subscription Boxes"
            icon={<Package className="w-5 h-5 text-orange-600" />}
            description={futureRoadmap.subscriptionBoxes.description}
            features={futureRoadmap.subscriptionBoxes.features}
          />
          
          <CategorySection
            title="Additional Enhancements"
            icon={<Sparkles className="w-5 h-5 text-purple-600" />}
            description="Other innovative features to enhance the platform experience"
            features={futureRoadmap.additionalEnhancements}
          />
        </div>
      )}
    </div>
  );
};

export default FutureEnhancementsDashboard; 