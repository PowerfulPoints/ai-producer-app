
'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@/contexts/form-context';
import { questions } from '@/lib/questions';
import Header from '@/components/header';
import ProgressIndicator from '@/components/progress-indicator';
import FormStep from '@/components/form-step';
import AIEnhancement from '@/components/ai-enhancement';
import AIEnhancementStep from '@/components/ai-enhancement-step';
import PlatformRecommendations from '@/components/platform-recommendations';
import FormNavigation from '@/components/form-navigation';
import { useToast } from '@/hooks/use-toast';
import { Platform } from '@/lib/types';
import { Download, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { 
    formData, 
    currentStep, 
    setCurrentStep, 
    sessionId, 
    saveToDatabase,
    loadFromSession,
    updateFormData
  } = useForm();
  
  const [isValidStep, setIsValidStep] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAIEnhancement, setShowAIEnhancement] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiEnhancementComplete, setAiEnhancementComplete] = useState(false);
  const { toast } = useToast();
  
  const totalSteps = questions.length;
  const isFormComplete = currentStep > totalSteps;
  const isAIEnhancementStep = currentStep === totalSteps + 1;
  const isResultsStep = currentStep > totalSteps + 1;

  // Load session on mount
  useEffect(() => {
    if (sessionId && sessionId !== '') {
      loadFromSession(sessionId);
    }
  }, [sessionId]); // Removed loadFromSession dependency to prevent loops

  // Show appropriate view based on current step
  useEffect(() => {
    if (isAIEnhancementStep) {
      setShowAIEnhancement(true);
      setShowResults(false);
    } else if (isResultsStep) {
      setShowResults(true);
      setShowAIEnhancement(false);
    } else {
      setShowResults(false);
      setShowAIEnhancement(false);
    }
  }, [isAIEnhancementStep, isResultsStep]);

  const handleNext = async () => {
    try {
      if (currentStep < totalSteps) {
        // Save BEFORE changing step to prevent race conditions
        await saveToDatabase();
        setCurrentStep(currentStep + 1);
      } else if (currentStep === totalSteps) {
        // Save final step before moving to AI Enhancement
        await saveToDatabase();
        // Move to AI Enhancement step
        setCurrentStep(totalSteps + 1);
        setShowAIEnhancement(true);
      } else if (currentStep === totalSteps + 1) {
        // Move to Results step (this should only happen after approval)
        setCurrentStep(totalSteps + 2);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to advance step:', error);
      toast({
        title: "Save Required",
        description: "Please fix any validation errors before proceeding.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handlePrevious = () => {
    if (showResults) {
      // Go back to AI Enhancement step
      setCurrentStep(totalSteps + 1);
      setShowResults(false);
      setShowAIEnhancement(true);
    } else if (showAIEnhancement) {
      // Go back to last form step
      setCurrentStep(totalSteps);
      setShowAIEnhancement(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAIEnhancementApprove = async (finalPrompt: string, platformOptimizations: Record<string, string>) => {
    try {
      // Save approval to database
      const response = await fetch('/api/ai/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'approve',
          finalPrompt,
          platformOptimizations
        })
      });

      if (response.ok) {
        // CRITICAL FIX: Update local formData state with approval results
        updateFormData({
          userEditedPrompt: finalPrompt,
          platformOptimizedPrompts: platformOptimizations,
          promptApprovalStatus: 'APPROVED',
          promptApprovedAt: new Date().toISOString()
        });

        // Move to results page
        setCurrentStep(totalSteps + 2);
        setShowResults(true);
        setShowAIEnhancement(false);
        setAiEnhancementComplete(true);
        
        toast({
          title: "Prompt Approved! 🎉",
          description: "Your enhanced prompt is ready. Proceeding to final results.",
          duration: 3000
        });
      } else {
        throw new Error('Failed to save approval');
      }
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Save Failed",
        description: "There was an issue saving your approval. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAIEnhancementReject = async () => {
    try {
      // Save rejection to database
      const response = await fetch('/api/ai/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'reject',
          rejectionReason: 'User chose to reject the enhanced prompt'
        })
      });

      if (response.ok) {
        // CRITICAL FIX: Update local formData state with rejection results
        updateFormData({
          promptApprovalStatus: 'REJECTED',
          promptRejectedAt: new Date().toISOString()
        });

        // Go back to last form step
        setCurrentStep(totalSteps);
        setShowAIEnhancement(false);
        
        toast({
          title: "Prompt Rejected",
          description: "You can modify your original prompt and try enhancement again.",
          duration: 3000
        });
      } else {
        throw new Error('Failed to save rejection');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: "Save Failed",
        description: "There was an issue saving your rejection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    saveToDatabase();
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/project/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const { data } = await response.json();
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-producer-project-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your project has been exported successfully.",
        duration: 3000
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Unable to export your project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCopyPrompt = async () => {
    const prompt = formData.userEditedPrompt || formData.enhancedPrompt || formData.mainMessage || '';
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
        duration: 2000
      });
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
        duration: 2000
      });
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const generateFinalPrompt = () => {
    const enhanced = formData.enhancedPrompt;
    const original = formData.mainMessage;
    
    if (!enhanced && !original) return '';
    
    let prompt = enhanced || original;
    
    // Add technical specifications
    const specs = [];
    if (formData.videoDuration) specs.push(`Duration: ${formData.videoDuration} seconds`);
    if (formData.videoDimensions) specs.push(`Format: ${formData.videoDimensions}`);
    if (formData.visualStyle) specs.push(`Style: ${formData.visualStyle}`);
    if (formData.moodTone) specs.push(`Mood: ${formData.moodTone}`);
    
    if (specs.length > 0) {
      prompt += `\n\nTechnical specifications: ${specs.join(', ')}`;
    }
    
    // Add additional context
    if (formData.keyScenes) {
      prompt += `\n\nKey scenes: ${formData.keyScenes}`;
    }
    
    if (formData.doNotInclude) {
      prompt += `\n\nAvoid: ${formData.doNotInclude}`;
    }
    
    return prompt;
  };

  // AI Enhancement Step View
  if (showAIEnhancement) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Progress indicator for AI Enhancement step */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span>Step {totalSteps + 1} of {totalSteps + 2}</span>
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI Enhancement & Approval</span>
              </div>
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((totalSteps + 1) / (totalSteps + 2)) * 100}%` }}
                />
              </div>
            </div>

            <AIEnhancementStep
              onApprove={handleAIEnhancementApprove}
              onReject={handleAIEnhancementReject}
            />
          </div>
        </main>

        <FormNavigation
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
          onExport={handleExport}
          canProceed={false} // Controlled by approval workflow
          showNext={false}   // Hide next button - controlled by approval
        />
      </div>
    );
  }

  // Results View
  if (showResults) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Your AI Video Project is Ready! 🎬
              </h1>
              <p className="text-lg text-gray-600">
                Your prompt has been enhanced and approved. Ready for platform submission!
              </p>
              {formData.promptApprovalStatus === 'APPROVED' && (
                <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Prompt Approved & Ready</span>
                </div>
              )}
            </div>

            {/* Final Prompt */}
            <div className="glassmorphism rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Final Approved Prompt</h2>
                  <Button
                    onClick={handleCopyPrompt}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700 max-h-60 overflow-y-auto">
                  {formData.userEditedPrompt || formData.enhancedPrompt || generateFinalPrompt()}
                </div>
              </div>
            </div>

            {/* Platform-Specific Prompts */}
            {formData.platformOptimizedPrompts && Object.keys(formData.platformOptimizedPrompts).length > 0 && (
              <div className="glassmorphism rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Platform-Optimized Prompts</h2>
                <div className="grid gap-4">
                  {Object.entries(formData.platformOptimizedPrompts).map(([platformId, prompt]) => (
                    <div key={platformId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 capitalize">{platformId}</h3>
                        <Button
                          onClick={() => copyToClipboard(prompt)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                        {prompt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Recommendations */}
            <PlatformRecommendations onPlatformSelect={setSelectedPlatform} />

            {/* Project Summary */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Video Type:</span>
                    <span className="ml-2 text-gray-600">{formData.videoType || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{formData.videoDuration || 'Not specified'} seconds</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Style:</span>
                    <span className="ml-2 text-gray-600">{formData.visualStyle || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Mood:</span>
                    <span className="ml-2 text-gray-600">{formData.moodTone || 'Not specified'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Dimensions:</span>
                    <span className="ml-2 text-gray-600">{formData.videoDimensions || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Animation:</span>
                    <span className="ml-2 text-gray-600">{formData.animationStyle || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Approval Status:</span>
                    <span className="ml-2 text-green-600 font-medium">{formData.promptApprovalStatus || 'Approved'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Selected Platform:</span>
                    <span className="ml-2 text-gray-600">{selectedPlatform?.name || 'None selected'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-3">🚀 Ready for Step 3.2</h2>
              <p className="text-gray-700 mb-4">
                Your prompt has been enhanced and approved! In Step 3.2, you'll be able to send your optimized prompts directly to AI video platforms through their APIs.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Coming in Step 3.2:</strong> Direct API integration with RunwayML, Synthesia, Sora, Luma, and HeyGen
              </div>
            </div>
          </div>
        </main>

        <FormNavigation
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
          onExport={handleExport}
          canProceed={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      <main className="pb-24">
        <ProgressIndicator />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Current Form Step */}
            <FormStep
              stepNumber={currentStep}
              onValidationChange={setIsValidStep}
            />
          </div>
        </div>
      </main>

      <FormNavigation
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSave={handleSave}
        onExport={handleExport}
        canProceed={isValidStep}
      />
    </div>
  );
}
