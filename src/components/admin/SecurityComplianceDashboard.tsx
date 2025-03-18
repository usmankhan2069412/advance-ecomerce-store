"use client";

import React, { useState } from "react";
import { 
  imageSecurityConfig, 
  blockchainConfig, 
  complianceConfig,
  validateSecurityCompliance
} from "@/lib/security-config";
import {
  Shield,
  Lock,
  Clock,
  Server,
  Smartphone,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

/**
 * Security status indicator component
 */
const SecurityStatus = ({ status }: { status: "enabled" | "disabled" | "partial" }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "enabled":
        return "bg-green-100 text-green-800";
      case "disabled":
        return "bg-red-100 text-red-800";
      case "partial":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "enabled":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "disabled":
        return <XCircle className="w-4 h-4 mr-1" />;
      case "partial":
      default:
        return <AlertTriangle className="w-4 h-4 mr-1" />;
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
 * Security & Compliance Dashboard component
 * Displays security configurations and compliance status
 */
const SecurityComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'blockchain' | 'compliance'>('image');
  const complianceStatus = validateSecurityCompliance();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold">Security & Compliance</h1>
        </div>
        <p className="text-gray-600">
          Manage security settings and ensure compliance with regulations
        </p>
        
        {!complianceStatus.compliant && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  There are {complianceStatus.issues.length} compliance issues that need attention
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'image' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('image')}
        >
          Image Security
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'blockchain' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('blockchain')}
        >
          Blockchain
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'compliance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('compliance')}
        >
          Compliance
        </button>
      </div>
      
      {/* Image Security Tab */}
      {activeTab === 'image' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Encryption</h3>
              <SecurityStatus status={imageSecurityConfig.encryption.enabled ? "enabled" : "disabled"} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Algorithm</span>
                <span className="font-medium">{imageSecurityConfig.encryption.algorithm}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Key Rotation</span>
                <span className="font-medium">Every {imageSecurityConfig.encryption.keyRotationDays} days</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Data Retention</h3>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-500" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">User Uploads</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {imageSecurityConfig.retention.userUploads.hours} hours
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Automatic Deletion</span>
                  <span className={imageSecurityConfig.retention.userUploads.automaticDeletion ? "text-green-600" : "text-red-600"}>
                    {imageSecurityConfig.retention.userUploads.automaticDeletion ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Try-On Results</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {imageSecurityConfig.retention.tryOnResults.hours} hours
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Automatic Deletion</span>
                  <span className={imageSecurityConfig.retention.tryOnResults.automaticDeletion ? "text-green-600" : "text-red-600"}>
                    {imageSecurityConfig.retention.tryOnResults.automaticDeletion ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Processing Location</h3>
              <div className="flex items-center">
                <Smartphone className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-sm font-medium">Client-side</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Try-on processing is performed client-side to avoid data transmission and enhance privacy.
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Server Fallback</span>
              <span className={imageSecurityConfig.processing.tryOn.fallbackToServer ? "text-yellow-600" : "text-green-600"}>
                {imageSecurityConfig.processing.tryOn.fallbackToServer ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">User Consent Required</span>
              <span className={imageSecurityConfig.processing.tryOn.requireConsent ? "text-green-600" : "text-red-600"}>
                {imageSecurityConfig.processing.tryOn.requireConsent ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Blockchain Tab */}
      {activeTab === 'blockchain' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Blockchain Integration</h3>
              <SecurityStatus status={blockchainConfig.enabled ? "enabled" : "disabled"} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Network</span>
                <span className="font-medium capitalize">{blockchainConfig.network}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contract Address</span>
                <span className="font-medium font-mono text-xs">{blockchainConfig.contractAddress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gas Fees Paid By</span>
                <span className="font-medium capitalize">{blockchainConfig.gasFees.paidBy}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Authenticity Features</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Design Certificates</span>
                  <SecurityStatus status={blockchainConfig.features.designCertificates.enabled ? "enabled" : "disabled"} />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Blockchain certificates proving design authenticity and ownership
                </p>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Metadata:</span>{" "}
                  {blockchainConfig.features.designCertificates.metadataSchema.properties.join(", ")}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Product Authenticity</span>
                  <SecurityStatus status={blockchainConfig.features.productAuthenticity.enabled ? "enabled" : "disabled"} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verification Method</span>
                  <span className="font-medium">{blockchainConfig.features.productAuthenticity.verificationMethod}</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Royalty Payments</span>
                  <SecurityStatus status={blockchainConfig.features.royaltyPayments.enabled ? "enabled" : "disabled"} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Default Percentage</span>
                  <span className="font-medium">{blockchainConfig.features.royaltyPayments.defaultPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">GDPR Compliance</h3>
              <SecurityStatus status={complianceConfig.gdpr.enabled ? "enabled" : "disabled"} />
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded p-3">
                <span className="font-medium">Data Subject Rights</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center text-sm">
                    <div className={`w-3 h-3 rounded-full mr-2 ${complianceConfig.gdpr.dataSubjectRights.accessEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Right to Access</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className={`w-3 h-3 rounded-full mr-2 ${complianceConfig.gdpr.dataSubjectRights.deleteEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Right to Delete</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className={`w-3 h-3 rounded-full mr-2 ${complianceConfig.gdpr.dataSubjectRights.portabilityEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Data Portability</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className={`w-3 h-3 rounded-full mr-2 ${complianceConfig.gdpr.dataSubjectRights.rectificationEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Rectification</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded p-3">
                <span className="font-medium">Consent Management</span>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Required</span>
                    <span className={complianceConfig.gdpr.consentManagement.required ? "text-green-600" : "text-red-600"}>
                      {complianceConfig.gdpr.consentManagement.required ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Granular Options</span>
                    <span className={complianceConfig.gdpr.consentManagement.granularOptions ? "text-green-600" : "text-red-600"}>
                      {complianceConfig.gdpr.consentManagement.granularOptions ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage Method</span>
                    <span className="font-medium">{complianceConfig.gdpr.consentManagement.storageMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">CCPA Compliance</h3>
              <SecurityStatus status={complianceConfig.ccpa.enabled ? "enabled" : "disabled"} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Do Not Sell Link</span>
                <span className={complianceConfig.ccpa.doNotSellLink ? "text-green-600" : "text-red-600"}>
                  {complianceConfig.ccpa.doNotSellLink ? "Implemented" : "Missing"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Privacy Notice</span>
                <a href={complianceConfig.ccpa.privacyNoticeUrl} className="text-blue-600 hover:underline">
                  View Notice
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Accessibility Compliance</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                WCAG {complianceConfig.accessibilityCompliance.wcag.conformanceLevel}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Automated Testing</span>
                <span className={complianceConfig.accessibilityCompliance.wcag.automated ? "text-green-600" : "text-red-600"}>
                  {complianceConfig.accessibilityCompliance.wcag.automated ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Manual Audits</span>
                <span className="font-medium">
                  {complianceConfig.accessibilityCompliance.wcag.manualAudits.frequency}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityComplianceDashboard; 