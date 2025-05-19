import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { X, RefreshCw, CheckCircle, AlertCircle, Search, Database, Sparkles, Building, Clock, User, Target, ChevronUp, ChevronDown, Tag } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  fitScore?: number;
  status?: 'pending' | 'processing' | 'enriched' | 'failed';
}

interface BatchEnrichmentModalProps {
  onClose: () => void;
  onComplete: (enrichedLeads: Lead[]) => void;
  leads: Lead[];
}

export const BatchEnrichmentModal: React.FC<BatchEnrichmentModalProps> = ({
  onClose,
  onComplete,
  leads
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<'initializing' | 'processing' | 'analyzing' | 'complete'>('initializing');
  const [processedLeads, setProcessedLeads] = useState<Lead[]>(
    leads.map(lead => ({ ...lead, status: 'pending' }))
  );
  const [enrichmentStats, setEnrichmentStats] = useState({
    improvements: 0,
    additionalData: 0,
    newInsights: 0,
    failedLeads: 0
  });
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Start the enrichment process
    setTimeout(() => {
      setCurrentStage('processing');
      setProgress(5);
      processLeads();
    }, 1000);
  }, []);
  
  const processLeads = () => {
    const totalLeads = processedLeads.length;
    let processed = 0;
    
    // Process leads one by one
    const processNext = () => {
      if (processed >= totalLeads) {
        analyzeResults();
        return;
      }
      
      // Update status to processing
      setProcessedLeads(prevLeads => {
        const updated = [...prevLeads];
        updated[processed].status = 'processing';
        return updated;
      });
      
      // Simulate processing time (faster for demo)
      setTimeout(() => {
        // Randomly fail some leads for realism (about 5%)
        const success = Math.random() > 0.05;
        
        // Update the lead
        setProcessedLeads(prevLeads => {
          const updated = [...prevLeads];
          updated[processed] = {
            ...updated[processed],
            status: success ? 'enriched' : 'failed',
            fitScore: success ? Math.min(10, (updated[processed].fitScore || 7) + (Math.random() * 1.5)) : updated[processed].fitScore
          };
          return updated;
        });
        
        // Update stats
        if (success) {
          setEnrichmentStats(prev => ({
            ...prev,
            improvements: prev.improvements + 1,
            additionalData: prev.additionalData + (Math.random() > 0.3 ? 1 : 0),
            newInsights: prev.newInsights + (Math.random() > 0.5 ? 1 : 0)
          }));
        } else {
          setEnrichmentStats(prev => ({
            ...prev,
            failedLeads: prev.failedLeads + 1
          }));
        }
        
        // Update progress
        processed++;
        const newProgress = Math.min(60, Math.round((processed / totalLeads) * 60));
        setProgress(newProgress);
        
        // Process next lead
        processNext();
      }, 500); // Fast processing for demo
    };
    
    processNext();
  };
  
  const analyzeResults = () => {
    setCurrentStage('analyzing');
    
    // Simulate analysis time
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          completeProcess();
          return 100;
        }
        return prev + 5;
      });
    }, 300);
    
    // Generate AI insights after some time
    setTimeout(() => {
      const successfulLeads = processedLeads.filter(l => l.status === 'enriched').length;
      const highFitLeads = processedLeads.filter(l => l.status === 'enriched' && (l.fitScore || 0) >= 8.5).length;
      
      setAiInsights([
        `${successfulLeads} leads successfully enriched with additional data points and insights`,
        `${highFitLeads} leads have high fit scores (8.5+) indicating strong ICP match`,
        `The average fit score increased by ${(Math.random() * 0.8 + 0.4).toFixed(1)} points after enrichment`,
        `Most common industries in your dataset: Technology, Financial Services, and Healthcare`,
        `Recommendation: Focus outreach on the ${highFitLeads} high-fit leads for best conversion rates`
      ]);
    }, 1500);
  };
  
  const completeProcess = () => {
    setCurrentStage('complete');
    setProgress(100);
  };
  
  const handleComplete = () => {
    onComplete(processedLeads);
  };
  
  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
  
  const renderProcessingStage = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-2">Enriching Leads</h3>
        <p className="text-gray-600 text-sm">
          Our AI is analyzing and enriching your leads with additional data points...
        </p>
      </div>
      
      {showDetails ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Lead Processing Status</h4>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(false)}
              icon={<ChevronUp size={14} />}
            >
              Hide Details
            </Button>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-200">
            {processedLeads.map((lead) => (
              <div key={lead.id} className="p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {lead.status === 'processing' && (
                      <div className="w-5 h-5 mr-3">
                        <RefreshCw size={16} className="text-blue-600 animate-spin" />
                      </div>
                    )}
                    {lead.status === 'pending' && (
                      <div className="w-5 h-5 mr-3">
                        <Clock size={16} className="text-gray-400" />
                      </div>
                    )}
                    {lead.status === 'enriched' && (
                      <div className="w-5 h-5 mr-3">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                    )}
                    {lead.status === 'failed' && (
                      <div className="w-5 h-5 mr-3">
                        <X size={16} className="text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.company} • {lead.title}</p>
                    </div>
                  </div>
                  
                  <div>
                    {lead.status === 'processing' && (
                      <Badge variant="info">Processing...</Badge>
                    )}
                    {lead.status === 'pending' && (
                      <Badge>Pending</Badge>
                    )}
                    {lead.status === 'enriched' && (
                      <Badge variant="success">Enriched</Badge>
                    )}
                    {lead.status === 'failed' && (
                      <Badge variant="danger">Failed</Badge>
                    )}
                  </div>
                </div>
                
                {lead.status === 'enriched' && (
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-green-600">
                      Fit score: <span className="font-medium">{lead.fitScore?.toFixed(1)}/10</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {lead.status === 'enriched' ? `Enriched with ${Math.floor(Math.random() * 5) + 3} new data points` : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Processing Summary</h4>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
              icon={<ChevronDown size={14} />}
            >
              Show Details
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <Database size={14} className="text-blue-600" />
                </div>
                <h5 className="text-sm font-medium text-blue-800">Company Data</h5>
              </div>
              <p className="text-xs text-blue-700">
                Enhancing with firmographics, technographics, and company insights
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <User size={14} className="text-blue-600" />
                </div>
                <h5 className="text-sm font-medium text-blue-800">Contact Data</h5>
              </div>
              <p className="text-xs text-blue-700">
                Adding contact details, social profiles, and engagement data
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Sparkles size={14} className="text-blue-600" />
              </div>
              <h5 className="text-sm font-medium text-blue-800">AI Processing</h5>
            </div>
            <p className="text-xs text-blue-700">
              Analyzing lead fit, generating personalized insights, and calculating engagement scores
            </p>
          </div>
        </div>
      )}
      
      <div className="text-center text-sm text-gray-600">
        <p>Processed {processedLeads.filter(l => l.status === 'enriched' || l.status === 'failed').length} of {processedLeads.length} leads</p>
        <p className="text-xs text-gray-500 mt-1">Please don't close this window during processing</p>
      </div>
    </div>
  );
  
  const renderAnalyzingStage = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-2">Analyzing Enrichment Results</h3>
        <p className="text-gray-600 text-sm">
          Generating insights and recommendations based on enriched data...
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-green-800 mb-1">Successful Enrichments</h4>
          <p className="text-2xl font-bold text-green-700">
            {processedLeads.filter(l => l.status === 'enriched').length}
            <span className="text-sm font-normal text-green-600 ml-1">leads</span>
          </p>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">Failed Enrichments</h4>
          <p className="text-2xl font-bold text-yellow-700">
            {processedLeads.filter(l => l.status === 'failed').length}
            <span className="text-sm font-normal text-yellow-600 ml-1">leads</span>
          </p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-1">New Data Points</h4>
          <p className="text-2xl font-bold text-blue-700">
            {enrichmentStats.additionalData}
            <span className="text-sm font-normal text-blue-600 ml-1">added</span>
          </p>
        </div>
        
        <div className="bg-indigo-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-indigo-800 mb-1">Score Improvements</h4>
          <p className="text-2xl font-bold text-indigo-700">
            {enrichmentStats.improvements}
            <span className="text-sm font-normal text-indigo-600 ml-1">leads</span>
          </p>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        <RefreshCw size={16} className="inline-block animate-spin mr-1" />
        <span>Generating AI insights and recommendations...</span>
      </div>
    </div>
  );
  
  const renderCompleteStage = () => (
    <div>
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-gray-900 mb-1">Enrichment Complete!</h3>
        <p className="text-gray-600">
          Successfully enriched {processedLeads.filter(l => l.status === 'enriched').length} out of {processedLeads.length} leads
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Sparkles size={16} className="mr-2 text-blue-600" />
          AI-Generated Insights
        </h4>
        <div className="space-y-2">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 flex items-start">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                <CheckCircle size={12} className="text-blue-600" />
              </div>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Next Steps</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center text-gray-900 font-medium text-sm">
              <Tag size={16} className="mr-2 text-blue-600" />
              Create segment with high-fit leads
            </div>
          </div>
          <div className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center text-gray-900 font-medium text-sm">
              <Target size={16} className="mr-2 text-blue-600" />
              Start a targeted email campaign
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          onClick={handleComplete}
        >
          View Enriched Leads
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900">Batch Lead Enrichment</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            disabled={currentStage !== 'complete' && progress > 0}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {renderProgressBar()}
          <div className="flex justify-between text-xs text-gray-500 mb-6">
            <span>Progress: {progress}%</span>
            <span>
              {currentStage === 'initializing' && 'Initializing...'}
              {currentStage === 'processing' && 'Processing leads...'}
              {currentStage === 'analyzing' && 'Analyzing results...'}
              {currentStage === 'complete' && 'Complete!'}
            </span>
          </div>
          
          <div className="mb-6 flex justify-between">
            <div className={`flex flex-col items-center ${currentStage === 'initializing' || progress > 0 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${currentStage === 'initializing' ? 'bg-blue-100 animate-pulse' : progress > 0 ? 'bg-blue-100' : 'bg-gray-200'}`}>
                {progress > 0 ? <CheckCircle size={16} className="text-blue-600" /> : 1}
              </div>
              <span className="text-xs">Prepare</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 self-center mx-2 md:mx-4">
              <div className="h-0.5 bg-blue-600" style={{ width: progress > 0 ? '100%' : '0%' }}></div>
            </div>
            
            <div className={`flex flex-col items-center ${currentStage === 'processing' || progress > 60 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${currentStage === 'processing' ? 'bg-blue-100 animate-pulse' : progress > 60 ? 'bg-blue-100' : 'bg-gray-200'}`}>
                {progress > 60 ? <CheckCircle size={16} className="text-blue-600" /> : 2}
              </div>
              <span className="text-xs">Enrich</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 self-center mx-2 md:mx-4">
              <div className="h-0.5 bg-blue-600" style={{ width: progress > 60 ? '100%' : '0%' }}></div>
            </div>
            
            <div className={`flex flex-col items-center ${currentStage === 'analyzing' || progress > 95 ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${currentStage === 'analyzing' ? 'bg-blue-100 animate-pulse' : progress > 95 ? 'bg-blue-100' : 'bg-gray-200'}`}>
                {progress > 95 ? <CheckCircle size={16} className="text-blue-600" /> : 3}
              </div>
              <span className="text-xs">Analyze</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 self-center mx-2 md:mx-4">
              <div className="h-0.5 bg-blue-600" style={{ width: progress > 95 ? '100%' : '0%' }}></div>
            </div>
            
            <div className={`flex flex-col items-center ${currentStage === 'complete' ? 'text-blue-600' : ''}`}>
              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${currentStage === 'complete' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                {progress === 100 ? <CheckCircle size={16} className="text-blue-600" /> : 4}
              </div>
              <span className="text-xs">Complete</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            {currentStage === 'initializing' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700">Initializing enrichment process...</p>
                <p className="text-sm text-gray-500 mt-1">Preparing {processedLeads.length} leads for enrichment</p>
              </div>
            )}
            
            {currentStage === 'processing' && renderProcessingStage()}
            {currentStage === 'analyzing' && renderAnalyzingStage()}
            {currentStage === 'complete' && renderCompleteStage()}
          </div>
        </div>
      </div>
    </div>
  );
};