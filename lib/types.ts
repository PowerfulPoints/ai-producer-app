
// Extended types for AI Enhancement Engine

export interface FormData {
  // Index signature for dynamic access
  [key: string]: any;
  
  // Platform Selection
  selectedPlatformId?: string;
  selectedPlatform?: string;
  platformCategory?: string;
  usePlatformSpecificQuestions?: boolean;
  platformData?: AdminPlatform;
  
  // 15 Questions Data
  mainMessage?: string;
  videoType?: string;
  videoTypeOther?: string;
  videoDimensions?: string;
  customWidth?: number;
  customHeight?: number;
  videoDuration?: number;
  visualStyle?: string;
  moodTone?: string;
  colorThemes?: string[];
  keyScenes?: string;
  charactersProducts?: string;
  productsObjects?: string;
  animationStyle?: string;
  cameraMovements?: string[];
  doNotInclude?: string;
  additionalNotes?: string;
  
  // Dynamic Questions Data
  dynamicQuestions?: any;
  
  // AI Enhancement & Approval
  originalPrompt?: string;
  enhancedPrompt?: string;
  promptApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EDITING' | 'READY_TO_SEND';
  promptApprovedAt?: string;
  promptRejectedAt?: string;
  platformOptimizedPrompts?: Record<string, string>;
  enhancementHistory?: EnhancementHistoryEntry[];
  userEditedPrompt?: string;
  enhancementMetadata?: EnhancementMetadata;
  
  // File uploads
  styleReferences?: StyleReference[];
  characters?: Character[];
}

export interface EnhancementHistoryEntry {
  id: string;
  timestamp: string;
  action: 'ENHANCED' | 'EDITED' | 'APPROVED' | 'REJECTED';
  promptVersion: string;
  platformId?: string;
  metadata?: any;
}

export interface EnhancementMetadata {
  enhancementDate: string;
  platformsOptimized: string[];
  improvementStats: {
    originalLength: number;
    enhancedLength: number;
    technicalTermsAdded: number;
    structureImprovement: boolean;
  };
  aiConfidenceScore: number;
  platformCompatibility: Record<string, number>;
}

export interface SessionData {
  sessionId: string;
  currentStep: number;
  formData?: FormData;
  lastActive: string;
}

export interface Question {
  id: number;
  question?: string;
  title?: string;
  description?: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'file' | 'dimensions' | 'textarea' | 'platform-select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  defaultValue?: any;
  hasOther?: boolean;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customValidation?: (value: any) => boolean;
  };
  helperText?: string;
  group?: string;
}

export interface StyleReference {
  id: string;
  projectId: string;
  filename: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  filename?: string;
  originalName?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt: string;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'RESEARCH_NEEDED' | 'ANALYSIS_PENDING';
  logoUrl?: string;
  category: 'CREATION' | 'DISTRIBUTION';
  
  // Research & Analysis Fields
  researchDate?: string;
  availableOptions?: any;
  generatedQuestions?: any;
  strengths: string[];
  weaknesses: string[];
  videoSpecs?: any;
  confidenceScore?: number;
  lastAnalyzed?: string;
  
  // Legacy fields
  maxDuration?: number;
  supportedStyles: string[];
  pricingTier?: string;
  websiteUrl?: string;
  isActive: boolean;
  
  // API Integration Fields
  apiEndpoint?: string;
  authMethod?: 'API_KEY' | 'OAUTH' | 'BEARER_TOKEN' | 'BASIC_AUTH' | 'CUSTOM' | 'NONE';
  authRequired: boolean;
  apiDocumentationUrl?: string;
  
  // JSON & Schema Support
  jsonFormatSupported: boolean;
  jsonSchema?: any;
  promptMappingRules?: any;
  
  // Rate Limiting & Usage
  rateLimits?: any;
  usageRestrictions?: any;
  
  // Direct Submission Support
  directSubmissionSupported: boolean;
  submissionEndpoint?: string;
  
  // API Testing & Validation
  lastApiTest?: string;
  apiTestStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'AUTH_ERROR' | 'RATE_LIMITED';
  apiTestResults?: any;
  
  // Usage Analytics
  totalApiCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime?: number;
  
  // Recommendation system properties
  score?: number;
  compatibility?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface AdminPlatform extends Platform {
  // Additional admin-specific fields if needed
}

export interface OptimizationResult {
  optimizedPrompt: string;
  platformId: string;
  optimizationSummary: {
    lengthReduction: number;
    improvementsApplied: string[];
    warningsResolved: string[];
  };
  platformCompatibility: number;
  suggestedImprovements: string[];
}

// Admin API types
export interface AdminQuestion extends Question {
  adminId?: string;
  label?: string;
  validationRules?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformQuestion extends Question {
  platformId: string;
  platformName?: string;
  baseQuestionId?: string;
  platformSpecificLabel?: string;
  platformSpecificOptions?: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// AI Enhancement specific types
export interface PlatformEnhancementResult {
  platformId: string;
  platformName: string;
  originalPrompt: string;
  enhancedPrompt: string;
  improvementStats: {
    lengthChange: number;
    technicalTermsAdded: string[];
    structureImprovements: string[];
  };
  compatibilityScore: number;
  recommendations: string[];
}

export interface EnhancementRequest {
  originalPrompt: string;
  formData: FormData;
  targetPlatforms?: string[];
  enhancementLevel?: 'basic' | 'advanced' | 'professional';
  userPreferences?: {
    maintainOriginalStyle: boolean;
    emphasizeTechnicalDetails: boolean;
    optimizeForLength: boolean;
  };
}

export interface EnhancementResponse {
  success: boolean;
  error?: string;
  originalPrompt: string;
  enhancedPrompt: string;
  platformOptimizedPrompts: Record<string, PlatformEnhancementResult>;
  enhancementMetadata: EnhancementMetadata;
  recommendations: string[];
}
