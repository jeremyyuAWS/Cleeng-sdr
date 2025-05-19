import React, { useEffect, useState } from 'react';
import { X, Target, Users, Mail, Calendar, BarChart3, Settings, Book, Sparkles, Shield, Headset } from 'lucide-react';
import { Button } from './Button';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'icp', label: 'Ideal Customer Profile' },
    { id: 'leads', label: 'Contact Enrichment' },
    { id: 'intelligence', label: 'Security Intelligence' },
    { id: 'email', label: 'Engagement Composer' },
    { id: 'sequence', label: 'Sequence Scheduler' },
    { id: 'analytics', label: 'Analytics Dashboard' },
    { id: 'knowledge', label: 'Knowledge Library' },
    { id: 'support', label: 'AI Support' },
    { id: 'responsible', label: 'Security & Compliance' }
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              KnoxEngage is a comprehensive AI-powered platform that guides you through the entire cybersecurity-focused outreach workflow - 
              from defining your ideal customer profile to launching multi-touch email sequences and analyzing results.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Key Features</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Define your ideal customer profile with AI assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Enrich contacts automatically with company and security data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Get personalized security intelligence and talking points</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Create engagement templates with AI-powered content suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Build optimized email sequences with smart timing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Analyze performance with AI-enhanced insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Access knowledge base for consistent cybersecurity communications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Get 24/7 AI-powered support assistance</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 'icp':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Target size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Ideal Customer Profile</h4>
                <p className="text-sm text-gray-600">Define your ideal customer profile for cybersecurity solutions</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Website URL analysis for automatic ICP suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Industry, role, company size, and geography targeting</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Security concern identification for personalized messaging</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>AI-suggested ICP segments with one-click lead generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Save multiple ICPs for different market segments</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Start by analyzing your company website to let AI suggest an initial ICP, then refine based on your best-performing cybersecurity customers.
            </div>
          </div>
        );
      case 'leads':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Contact Enrichment</h4>
                <p className="text-sm text-gray-600">Discover and enrich contacts with cybersecurity data and AI-powered insights</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Segment-based contact organization and filtering</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>One-click contact enrichment with company and security data</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Multiple data providers including KnoxEngage, LeadGenius, and Apollo</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Cost-effective waterfall enrichment to avoid duplicate charges</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>AI-powered lead scoring based on your ICP</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>CSV upload with smart field mapping</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Detailed contact profiles with actionable insights</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Upload your existing contacts via CSV, then let our AI enrich them with additional data points and personalized insights for higher conversion rates. Use our waterfall approach to optimize costs.
            </div>
          </div>
        );
      case 'intelligence':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Sparkles size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Security Intelligence</h4>
                <p className="text-sm text-gray-600">Personalized cybersecurity insights to boost sales effectiveness</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>AI-generated personalized talking points for each contact</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Competitive intelligence on other security vendors</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Security buying signal detection with strength scoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Optimal contact time recommendations by lead</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Industry and security trend analysis</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Focus on leads with strong security buying signals first, and use the AI-suggested talking points to personalize your outreach.
            </div>
          </div>
        );
      case 'email':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Mail size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Engagement Composer</h4>
                <p className="text-sm text-gray-600">Create personalized engagement templates with AI assistance</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Template library with proven, high-converting security-focused formats</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>AI-powered content suggestions based on your ICP</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Multiple tone options (professional, friendly, persuasive, witty)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Variable personalization with smart preview</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Email quality check with AI recommendations</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Start with a template, then use the AI to adjust the tone and personalize based on your target audience's security concerns. The quality check will ensure high deliverability.
            </div>
          </div>
        );
      case 'sequence':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Sequence Scheduler</h4>
                <p className="text-sm text-gray-600">Build engagement sequences with optimal timing</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Visual timeline builder for multi-step sequences</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Smart Send-Time AI for optimal delivery timing</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Mix email, LinkedIn, and task steps in one sequence</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Save and load sequence templates for different campaigns</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Performance analytics for each sequence step</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Enable Smart Send-Time AI to automatically optimize delivery times based on your audience's engagement patterns and time zones.
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <BarChart3 size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Analytics Dashboard</h4>
                <p className="text-sm text-gray-600">Visualize engagement performance with AI insights</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Key performance metrics (open, reply, meeting rates)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Email funnel visualization with drop-off analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Performance breakdown by job title, industry, and sequence</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Time-of-day and day-of-week performance analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>AI-generated insights with actionable recommendations</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Review the AI-generated insights section regularly for optimization suggestions based on your specific campaign performance data.
            </div>
          </div>
        );
      case 'knowledge':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Book size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Knowledge Library</h4>
                <p className="text-sm text-gray-600">AI answers grounded in your security documentation</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Document repository for company materials and security knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Automatic document processing and chunking for retrieval</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>AI-powered question answering with source citations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>FAQ management with AI-suggested questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Content gap identification for knowledge base improvement</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Upload your product documentation, case studies, and security collateral to ensure the AI gives accurate, consistent answers to prospects' questions.
            </div>
          </div>
        );
      case 'support':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Headset size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">AI Support</h4>
                <p className="text-sm text-gray-600">AI-powered assistance for your product and security questions</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>24/7 AI-powered support assistance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Knowledge-grounded responses to security questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Step-by-step guided troubleshooting</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Smart human escalation for complex issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Conversation history and customer context retention</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Use the AI Support for instant answers to product questions and basic troubleshooting, freeing your support team to focus on more complex customer needs.
            </div>
          </div>
        );
      case 'responsible':
        return (
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Shield size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Security & Compliance</h4>
                <p className="text-sm text-gray-600">Configure security guardrails and compliance settings for AI engagement</p>
              </div>
            </div>
            
            <h5 className="text-sm font-medium text-gray-700 mt-3 mb-2">Key Features:</h5>
            <ul className="space-y-1 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Toxicity detection with configurable thresholds</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Prompt injection protection for system security</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Topic controls to define allowed and banned topics</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>PII protection and sensitive information masking</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Comprehensive audit logging and violation tracking</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
              <strong>Pro Tip:</strong> Set appropriate guardrails based on your company's risk tolerance and compliance requirements to ensure safe, secure AI interactions.
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to KnoxEngage</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="mt-4 text-gray-600">
            This advanced AI platform guides you through personalized engagement with cybersecurity-grade precision, from defining your ICP to launching multi-touch email sequences.
          </p>
          
          <div className="mt-6">
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-2 px-4 border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 font-medium'
                        : 'border-transparent hover:text-gray-700 hover:border-gray-300 text-gray-500'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 min-h-[300px]">
              {renderTabContent()}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};