import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { CheckCircle, AlertCircle, X, RefreshCw, ArrowRight, Database, Sparkles, MessageSquare, AlertTriangle } from 'lucide-react';

interface CSVProcessingModalProps {
  onClose: () => void;
  onComplete: (processedData: any[]) => void;
  initialData: any[];
  fields: string[];
  mappedFields: Record<string, string>;
}

export const CSVProcessingModal: React.FC<CSVProcessingModalProps> = ({
  onClose,
  onComplete,
  initialData,
  fields,
  mappedFields
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<'initializing' | 'matching' | 'enriching' | 'analyzing' | 'complete'>('initializing');
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [unmappedFields, setUnmappedFields] = useState<string[]>([]);
  const [matchingSuggestions, setMatchingSuggestions] = useState<{[key: string]: string[]}>({});
  
  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      setCurrentStage('matching');
      setProgress(10);
      
      // Find unmapped fields
      const requiredFields = ['name', 'company', 'title', 'email'];
      const mappedKeys = Object.values(mappedFields);
      const missing = requiredFields.filter(field => !mappedKeys.includes(field));
      
      if (missing.length > 0) {
        setUnmappedFields(missing);
        
        // Simulate AI suggesting matches for unmapped fields
        const suggestedMatches: {[key: string]: string[]} = {};
        
        missing.forEach(field => {
          switch (field) {
            case 'name':
              suggestedMatches[field] = ['full name', 'contact', 'person'];
              break;
            case 'company':
              suggestedMatches[field] = ['organization', 'account', 'business'];
              break;
            case 'title':
              suggestedMatches[field] = ['job title', 'position', 'role'];
              break;
            case 'email':
              suggestedMatches[field] = ['email address', 'contact email', 'work email'];
              break;
            default:
              suggestedMatches[field] = [];
          }
        });
        
        setMatchingSuggestions(suggestedMatches);
        simulateEnrichment();
      } else {
        // All fields mapped, proceed to enrichment
        simulateEnrichment();
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const simulateEnrichment = () => {
    // Start enrichment process
    setTimeout(() => {
      setCurrentStage('enriching');
      setProgress(30);
      
      // Simulate a multi-step enrichment process
      const enrichmentInterval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 60) {
            clearInterval(enrichmentInterval);
            simulateAnalysis();
            return 60;
          }
          return prevProgress + 5;
        });
      }, 600);
      
      // Generate processed data with enhanced information
      const enhanced = initialData.map((item, index) => {
        // Create a base record with mapped fields
        const record: any = {};
        Object.entries(mappedFields).forEach(([header, mappedField]) => {
          record[mappedField] = item[header] || '';
        });
        
        // Add missing required fields with simulated values if they're not mapped
        if (!record.name) record.name = `Contact ${index + 1}`;
        if (!record.email) record.email = `contact${index + 1}@example.com`;
        if (!record.company) record.company = `Company ${index + 1}`;
        if (!record.title) record.title = 'Manager';
        
        // Add enriched data
        record.id = `lead-${Date.now()}-${index}`;
        record.fitScore = (7 + Math.random() * 3).toFixed(1);
        record.industry = record.industry || ['Technology', 'SaaS', 'Retail', 'Healthcare', 'Financial Services'][Math.floor(Math.random() * 5)];
        record.companySize = record.companySize || ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'][Math.floor(Math.random() * 6)];
        record.location = record.location || ['San Francisco, CA', 'New York, NY', 'Chicago, IL', 'Austin, TX', 'Boston, MA'][Math.floor(Math.random() * 5)];
        record.linkedIn = record.linkedIn || `linkedin.com/in/${record.name.toLowerCase().replace(/\s+/g, '')}`;
        
        // Add AI-driven insights
        record.reason = `${record.title} at ${record.company} matches your ICP criteria for ${record.industry} companies. Their profile suggests interest in solutions for ${['lead generation', 'customer retention', 'marketing automation', 'sales enablement'][Math.floor(Math.random() * 4)]}.`;
        
        // Add recent activity
        record.recentActivity = [
          `Visited your website (${Math.floor(Math.random() * 10) + 1} days ago)`,
          `Downloaded "${['Product Guide', 'Case Study', 'ROI Calculator', 'Industry Report'][Math.floor(Math.random() * 4)]}" (${Math.floor(Math.random() * 30) + 1} days ago)`
        ];
        
        return record;
      });
      
      setProcessedData(enhanced);
    }, 1500);
  };
  
  const simulateAnalysis = () => {
    setCurrentStage('analyzing');
    
    // Simulate analysis
    const analysisInterval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 95) {
          clearInterval(analysisInterval);
          finishProcessing();
          return 100;
        }
        return prevProgress + 5;
      });
    }, 500);
    
    // Generate AI suggestions based on the data
    setTimeout(() => {
      setAiSuggestions([
        `${processedData.length > 5 ? processedData.length : 'All'} leads have been enriched with company and contact data`,
        `${Math.floor(processedData.length * 0.3)} leads have high fit scores (8.5+) indicating strong ICP match`,
        `${Math.floor(processedData.length * 0.2)} leads recently engaged with your content`,
        `Most common industry: ${['Technology', 'SaaS', 'Retail'][Math.floor(Math.random() * 3)]}`,
        `Most common role: ${['Marketing Manager', 'Director', 'VP'][Math.floor(Math.random() * 3)]}`
      ]);
    }, 2500);
  };
  
  const finishProcessing = () => {
    setCurrentStage('complete');
    setProgress(100);
  };
  
  const handleComplete = () => {
    onComplete(processedData);
  };
  
  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
  
  const renderProgressStages = () => (
    <div className="flex justify-between text-xs text-gray-500 mb-6">
      <div className={`flex flex-col items-center ${currentStage === 'initializing' || progress >= 10 ? 'text-blue-600' : ''}`}>
        <div className={`w-5 h-5 rounded-full mb-1 flex items-center justify-center ${currentStage === 'initializing' ? 'bg-blue-100 animate-pulse' : progress >= 10 ? 'bg-blue-100' : 'bg-gray-200'}`}>
          {progress >= 10 ? <CheckCircle size={12} className="text-blue-600" /> : 1}
        </div>
        <span>Initialize</span>
      </div>
      <div className={`flex flex-col items-center ${currentStage === 'matching' || progress >= 30 ? 'text-blue-600' : ''}`}>
        <div className={`w-5 h-5 rounded-full mb-1 flex items-center justify-center ${currentStage === 'matching' ? 'bg-blue-100 animate-pulse' : progress >= 30 ? 'bg-blue-100' : 'bg-gray-200'}`}>
          {progress >= 30 ? <CheckCircle size={12} className="text-blue-600" /> : 2}
        </div>
        <span>Match</span>
      </div>
      <div className={`flex flex-col items-center ${currentStage === 'enriching' || progress >= 60 ? 'text-blue-600' : ''}`}>
        <div className={`w-5 h-5 rounded-full mb-1 flex items-center justify-center ${currentStage === 'enriching' ? 'bg-blue-100 animate-pulse' : progress >= 60 ? 'bg-blue-100' : 'bg-gray-200'}`}>
          {progress >= 60 ? <CheckCircle size={12} className="text-blue-600" /> : 3}
        </div>
        <span>Enrich</span>
      </div>
      <div className={`flex flex-col items-center ${currentStage === 'analyzing' || progress >= 95 ? 'text-blue-600' : ''}`}>
        <div className={`w-5 h-5 rounded-full mb-1 flex items-center justify-center ${currentStage === 'analyzing' ? 'bg-blue-100 animate-pulse' : progress >= 95 ? 'bg-blue-100' : 'bg-gray-200'}`}>
          {progress >= 95 ? <CheckCircle size={12} className="text-blue-600" /> : 4}
        </div>
        <span>Analyze</span>
      </div>
      <div className={`flex flex-col items-center ${currentStage === 'complete' ? 'text-blue-600' : ''}`}>
        <div className={`w-5 h-5 rounded-full mb-1 flex items-center justify-center ${currentStage === 'complete' ? 'bg-blue-100' : 'bg-gray-200'}`}>
          {progress >= 100 ? <CheckCircle size={12} className="text-blue-600" /> : 5}
        </div>
        <span>Complete</span>
      </div>
    </div>
  );
  
  const renderMatchingStage = () => (
    <div>
      <div className="bg-yellow-50 p-4 rounded-md mb-4 flex items-start">
        <AlertTriangle size={18} className="text-yellow-600 mt-0.5 mr-2" />
        <div>
          <p className="text-sm text-yellow-800 font-medium">
            Some required fields are missing or not mapped correctly
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            AI has detected potential matches for these fields in your data. Please review the suggestions below.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {unmappedFields.map(field => (
          <div key={field} className="border border-gray-200 rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900 capitalize">Missing: {field}</h4>
              <Badge variant="warning">Required Field</Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              AI suggests these columns from your CSV may contain this information:
            </p>
            
            <div className="space-y-2">
              {matchingSuggestions[field]?.map((suggestion, idx) => (
                <div key={idx} className="flex items-center bg-blue-50 p-2 rounded-md">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <Database size={12} className="text-blue-600" />
                  </div>
                  <span className="text-sm">{suggestion}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    Use This
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-gray-500">
              Note: The system will generate synthetic data for missing fields to complete the enrichment.
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Button
          variant="primary"
          fullWidth
          onClick={simulateEnrichment}
          icon={<ArrowRight size={16} />}
        >
          Continue with AI-Assisted Completion
        </Button>
      </div>
    </div>
  );
  
  const renderEnrichingStage = () => (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Enriching Leads</h3>
        <p className="text-gray-600 text-sm">
          Adding additional company and contact details to your leads...
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-md flex items-start">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
            <Database size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Company Enrichment
            </p>
            <div className="flex items-center mt-1">
              <div className="w-24 bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-xs text-blue-600 ml-2">Complete</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md flex items-start">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
            <MessageSquare size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Contact Data Enrichment
            </p>
            <div className="flex items-center mt-1">
              <div className="w-24 bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs text-blue-600 ml-2">75%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md flex items-start">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5">
            <Sparkles size={14} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              AI Scoring & Analysis
            </p>
            <div className="flex items-center mt-1">
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">Waiting...</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Enriching {initialData.length} leads... Do not close this window.</p>
      </div>
    </div>
  );
  
  const renderAnalyzeStage = () => (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Leads</h3>
        <p className="text-gray-600 text-sm">
          Generating AI insights and scoring leads based on your ICP...
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-md flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Sparkles size={16} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-blue-800">AI Analysis Progress</p>
              <span className="text-xs font-medium text-blue-800">{Math.round((progress - 60) * 2.5)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(progress - 60) * 2.5}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {Array.from({ length: Math.min(5, processedData.length) }).map((_, i) => (
            <div key={i} className="p-2 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  {i < 3 ? (
                    <CheckCircle size={14} className="text-green-600" />
                  ) : (
                    <RefreshCw size={14} className={`text-blue-600 ${i === 3 ? 'animate-spin' : ''}`} />
                  )}
                </div>
                <span className="text-sm">{processedData[i]?.name || `Lead ${i+1}`}</span>
              </div>
              <span className="text-xs">
                {i < 3 ? 'Analyzed' : i === 3 ? 'In progress...' : 'Waiting...'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderCompleteStage = () => (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-gray-900 mb-1">Processing Complete!</h3>
        <p className="text-gray-600">
          Successfully processed and enriched {processedData.length} leads
        </p>
      </div>
      
      {aiSuggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Sparkles size={16} className="mr-2 text-blue-600" />
            AI-Generated Insights
          </h4>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, idx) => (
              <div key={idx} className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 flex items-start">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                  <CheckCircle size={12} className="text-blue-600" />
                </div>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onClose}
          icon={<X size={16} />}
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          onClick={handleComplete}
          icon={<ArrowRight size={16} />}
        >
          View Enriched Leads
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Processing Leads</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              disabled={progress > 0 && progress < 100}
            >
              <X size={20} />
            </button>
          </div>
          
          {renderProgressBar()}
          <div className="flex justify-between text-xs text-gray-500 mb-6">
            <span>Progress: {progress}%</span>
            <span>
              {currentStage === 'initializing' && 'Initializing...'}
              {currentStage === 'matching' && 'Matching fields...'}
              {currentStage === 'enriching' && 'Enriching leads...'}
              {currentStage === 'analyzing' && 'Analyzing data...'}
              {currentStage === 'complete' && 'Complete!'}
            </span>
          </div>
          
          {renderProgressStages()}
          
          <div className="border-t border-gray-200 pt-6">
            {currentStage === 'initializing' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700">Initializing data processing...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your data</p>
              </div>
            )}
            
            {currentStage === 'matching' && renderMatchingStage()}
            {currentStage === 'enriching' && renderEnrichingStage()}
            {currentStage === 'analyzing' && renderAnalyzeStage()}
            {currentStage === 'complete' && renderCompleteStage()}
          </div>
        </div>
      </div>
    </div>
  );
};