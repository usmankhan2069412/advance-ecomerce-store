"use client";

import React, { useState } from "react";
import { aiRoadmap, getFeatureById } from "@/lib/ai-roadmap";
import {
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  Database,
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";
import Link from "next/link";

/**
 * Status badge component for AI features
 */
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "planned":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "in-progress":
        return <Clock className="w-3 h-3 mr-1" />;
      case "planned":
      default:
        return <Calendar className="w-3 h-3 mr-1" />;
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

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{feature.name}</h3>
          <StatusBadge status={feature.status} />
        </div>
        <p className="text-gray-600 mb-4">{feature.description}</p>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {expanded ? "Hide details" : "Show implementation details"}
        </button>
        
        {expanded && (
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start">
              <Code className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
              <div>
                <span className="font-medium">Frontend:</span> {feature.implementation.frontend}
              </div>
            </div>
            <div className="flex items-start">
              <Database className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
              <div>
                <span className="font-medium">Backend:</span> {feature.implementation.backend}
              </div>
            </div>
            <div className="flex items-start">
              <Brain className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
              <div>
                <span className="font-medium">Model:</span> {feature.implementation.model}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {feature.demoUrl && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <Link href={feature.demoUrl}>
            <span className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <ExternalLink className="w-4 h-4 mr-1" />
              View Demo
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

/**
 * Phase section component
 */
const PhaseSection = ({ phase, phaseKey }: { phase: any, phaseKey: string }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
          ${phase.status === 'completed' ? 'bg-green-100' : 
            phase.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {phaseKey === 'phase1' ? (
            <Layers className="w-4 h-4 text-gray-700" />
          ) : phaseKey === 'phase2' ? (
            <Brain className="w-4 h-4 text-gray-700" />
          ) : (
            <Sparkles className="w-4 h-4 text-gray-700" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{phase.name}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {phase.timeline}
            <StatusBadge status={phase.status} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-11">
        {phase.features.map((feature: any) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
};

/**
 * AI Roadmap Dashboard component
 * Displays the AI feature roadmap with implementation details
 */
const AIRoadmapDashboard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">AI Integration Roadmap</h1>
        <p className="text-gray-600">
          Our plan for implementing advanced AI features across the platform
        </p>
      </div>
      
      <PhaseSection phase={aiRoadmap.phase1} phaseKey="phase1" />
      <PhaseSection phase={aiRoadmap.phase2} phaseKey="phase2" />
      <PhaseSection phase={aiRoadmap.phase3} phaseKey="phase3" />
    </div>
  );
};

export default AIRoadmapDashboard; 