/**
 * Security & Compliance Configuration
 * Defines security policies, data handling procedures, and compliance measures
 */

// Image handling security policies
export const imageSecurityConfig = {
  // Encryption settings for user-uploaded images
  encryption: {
    enabled: true,
    algorithm: "AES-256-GCM",
    keyRotationDays: 30
  },
  
  // Data retention policies
  retention: {
    userUploads: {
      hours: 24,
      automaticDeletion: true,
      notifyUser: true
    },
    tryOnResults: {
      hours: 24,
      automaticDeletion: true,
      notifyUser: false
    },
    productImages: {
      retention: "permanent",
      backupFrequency: "daily"
    }
  },
  
  // Processing location policies
  processing: {
    tryOn: {
      location: "client-side",
      fallbackToServer: false,
      requireConsent: true
    },
    designTool: {
      location: "hybrid",
      fallbackToServer: true,
      requireConsent: true
    }
  }
};

// Blockchain integration for authenticity certificates
export const blockchainConfig = {
  enabled: true,
  network: "polygon",
  contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
  features: {
    designCertificates: {
      enabled: true,
      metadataSchema: {
        properties: [
          "designerId",
          "collectionId",
          "creationDate",
          "materials",
          "sustainabilityScore"
        ]
      }
    },
    productAuthenticity: {
      enabled: true,
      verificationMethod: "qr-code"
    },
    royaltyPayments: {
      enabled: true,
      defaultPercentage: 5 // 5% royalty to original designers
    }
  },
  // Gas fee handling
  gasFees: {
    paidBy: "platform", // platform covers gas fees
    estimationEndpoint: "/api/blockchain/estimate-gas"
  }
};

// GDPR and data protection compliance
export const complianceConfig = {
  gdpr: {
    enabled: true,
    dataSubjectRights: {
      accessEnabled: true,
      deleteEnabled: true,
      portabilityEnabled: true,
      rectificationEnabled: true
    },
    consentManagement: {
      required: true,
      granularOptions: true,
      storageMethod: "encrypted-local-storage"
    },
    dataProcessingAgreement: {
      version: "1.2",
      lastUpdated: "2023-09-15"
    }
  },
  ccpa: {
    enabled: true,
    doNotSellLink: true,
    privacyNoticeUrl: "/privacy/ccpa"
  },
  accessibilityCompliance: {
    wcag: {
      conformanceLevel: "AA",
      automated: true,
      manualAudits: {
        frequency: "quarterly"
      }
    }
  }
};

/**
 * Validates if the current security configuration meets compliance requirements
 * @returns {Object} Validation results with any compliance issues
 */
export function validateSecurityCompliance() {
  const issues = [];
  
  // Check image retention policy
  if (imageSecurityConfig.retention.userUploads.hours > 72) {
    issues.push({
      severity: "high",
      component: "image-retention",
      message: "User uploads are stored longer than the recommended 72 hours"
    });
  }
  
  // Check encryption
  if (!imageSecurityConfig.encryption.enabled) {
    issues.push({
      severity: "critical",
      component: "encryption",
      message: "Image encryption is disabled, violating data protection requirements"
    });
  }
  
  // Check blockchain configuration
  if (blockchainConfig.enabled && !blockchainConfig.contractAddress) {
    issues.push({
      severity: "medium",
      component: "blockchain",
      message: "Blockchain is enabled but no contract address is specified"
    });
  }
  
  return {
    compliant: issues.length === 0,
    issues
  };
} 