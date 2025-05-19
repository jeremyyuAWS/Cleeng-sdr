import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import { 
  Shield, 
  AlertCircle, 
  MessageSquare, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Info, 
  CheckCircle, 
  XCircle,
  Settings,
  BarChart,
  Clock,
  RefreshCw,
  Download,
  Tag,
  UserX,
  Zap,
  Filter,
  Sliders
} from 'lucide-react';

// Import responsible AI data
import responsibleAIData from '../../data/responsible_ai_data.json';

export const ResponsibleAI: React.FC = () => {
  const [activePolicyTab, setActivePolicyTab] = useState<string>('toxicity');
  const [showDetailedLog, setShowDetailedLog] = useState<boolean>(false);
  const [toxicityThreshold, setToxicityThreshold] = useState<number>(responsibleAIData.policies.toxicityDetection.threshold * 100);
  const [promptInjectionThreshold, setPromptInjectionThreshold] = useState<number>(responsibleAIData.policies.promptInjection.threshold * 100);
  const [bannedTopics, setBannedTopics] = useState<string>(responsibleAIData.policies.topicControls.bannedTopics.topics.join(', '));
  const [allowedTopics, setAllowedTopics] = useState<string>(responsibleAIData.policies.topicControls.allowedTopics.topics.join(', '));
  
  const [piiControls, setPiiControls] = useState<{[key: string]: boolean}>({
    'Email Addresses': true,
    'Phone Numbers': true,
    'Credit Card Numbers': true,
    'Social Security Numbers': true,
    'Physical Addresses': true,
    'Dates of Birth': true,
  });
  
  const [secretsControls, setSecretsControls] = useState<{[key: string]: boolean}>({
    'API Keys': true,
    'JWT Tokens': true,
    'OAuth Secrets': true,
    'SSH/Private Keys': true,
    'Database Connection Strings': false,
  });
  
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getSeverityBadge = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToxicityThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToxicityThreshold(parseInt(e.target.value));
  };

  const handlePromptInjectionThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptInjectionThreshold(parseInt(e.target.value));
  };

  const handlePiiControlToggle = (control: string) => {
    setPiiControls({
      ...piiControls,
      [control]: !piiControls[control]
    });
  };

  const handleSecretsControlToggle = (control: string) => {
    setSecretsControls({
      ...secretsControls,
      [control]: !secretsControls[control]
    });
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Security & Compliance</h2>
        <p className="text-gray-600">Configure security guardrails and compliance settings for AI engagement</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="mr-2 text-blue-600" />
              Security Controls
            </h3>
            
            <div className="space-y-2">
              <button
                className={`w-full text-left p-3 rounded-md flex items-start ${
                  activePolicyTab === 'toxicity' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setActivePolicyTab('toxicity')}
              >
                <div className="mr-3 mt-0.5">
                  <AlertTriangle size={16} className="text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Content Monitoring</h4>
                  <p className="text-sm text-gray-500">Detect and block harmful content</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="success">Enabled</Badge>
                </div>
              </button>
              
              <button
                className={`w-full text-left p-3 rounded-md flex items-start ${
                  activePolicyTab === 'promptInjection' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setActivePolicyTab('promptInjection')}
              >
                <div className="mr-3 mt-0.5">
                  <Shield size={16} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">System Protection</h4>
                  <p className="text-sm text-gray-500">Prevent prompt manipulation attempts</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="success">Enabled</Badge>
                </div>
              </button>
              
              <button
                className={`w-full text-left p-3 rounded-md flex items-start ${
                  activePolicyTab === 'topicControls' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setActivePolicyTab('topicControls')}
              >
                <div className="mr-3 mt-0.5">
                  <Tag size={16} className="text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Topic Controls</h4>
                  <p className="text-sm text-gray-500">Restrict conversations to approved topics</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="success">Enabled</Badge>
                </div>
              </button>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4 flex items-center">
              <Lock className="mr-2 text-green-600" />
              Privacy & Security
            </h3>
            
            <div className="space-y-2">
              <button
                className={`w-full text-left p-3 rounded-md flex items-start ${
                  activePolicyTab === 'piiControls' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setActivePolicyTab('piiControls')}
              >
                <div className="mr-3 mt-0.5">
                  <UserX size={16} className="text-red-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">PII Protection</h4>
                  <p className="text-sm text-gray-500">Protect personal identifiable information</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="success">Enabled</Badge>
                </div>
              </button>
              
              <button
                className={`w-full text-left p-3 rounded-md flex items-start ${
                  activePolicyTab === 'secretsMasking' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setActivePolicyTab('secretsMasking')}
              >
                <div className="mr-3 mt-0.5">
                  <EyeOff size={16} className="text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Secrets Protection</h4>
                  <p className="text-sm text-gray-500">Detect and redact API keys and credentials</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="success">Enabled</Badge>
                </div>
              </button>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BarChart className="mr-2 text-indigo-600" />
                System Statistics
              </h3>
              
              <div className="bg-gray-50 rounded-md p-4 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Total Violations</span>
                    <span className="font-medium text-gray-900">{responsibleAIData.metrics.totalViolations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Blocked Requests</span>
                    <span className="font-medium text-gray-900">{responsibleAIData.metrics.totalBlocked}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Violations by Type</div>
                  <div className="space-y-2">
                    {Object.entries(responsibleAIData.metrics.violationsByType).map(([type, count], index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-24 text-xs text-gray-500">{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(count as number) / responsibleAIData.metrics.totalViolations * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Download size={16} />}
                >
                  Export Audit Log
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="mr-2 text-gray-600" />
              Global Settings
            </h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Policy Enforcement</h4>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Strict (Block all violations)</option>
                  <option>Moderate (Warn on low severity)</option>
                  <option>Permissive (Log only)</option>
                </select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">External Integrations</h4>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="external-audit"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked
                  />
                  <label htmlFor="external-audit" className="ml-2 text-sm text-gray-700">
                    Enable external audit logging
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="api-monitoring"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked
                  />
                  <label htmlFor="api-monitoring" className="ml-2 text-sm text-gray-700">
                    Enable API usage monitoring
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  fullWidth
                  icon={<Sliders size={16} />}
                >
                  Apply Global Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {/* Toxicity Detection */}
          {activePolicyTab === 'toxicity' && (
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Content Monitoring</h3>
                  <p className="text-gray-600">Automatically detect and block harmful content based on toxicity score</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Enabled</span>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={true}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                    <div
                      className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-blue-600"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detection Threshold ({toxicityThreshold}%)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Permissive</span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={toxicityThreshold}
                    onChange={handleToxicityThresholdChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">Strict</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Messages with toxicity scores above this threshold will be blocked.
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Action on Violation</h4>
                <div className="flex space-x-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="toxicity-action"
                      id="toxicity-block"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked
                    />
                    <label htmlFor="toxicity-block" className="ml-2 text-sm text-gray-700">
                      Block message
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="toxicity-action"
                      id="toxicity-warn"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="toxicity-warn" className="ml-2 text-sm text-gray-700">
                      Show warning
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="toxicity-action"
                      id="toxicity-log"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="toxicity-log" className="ml-2 text-sm text-gray-700">
                      Log only
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Recent Violations</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RefreshCw size={14} />}
                  >
                    Refresh
                  </Button>
                </div>
                
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                  {responsibleAIData.policies.toxicityDetection.recentViolations.map((violation, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-900 font-medium">
                          <AlertCircle size={16} className="inline text-yellow-500 mr-1" />
                          Toxicity Score: {violation.detectedScore}
                        </div>
                        <Badge variant="danger">Blocked</Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-700">
                        <p className="line-clamp-1">{violation.inputText}</p>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatTimestamp(violation.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {/* Prompt Injection Detection */}
          {activePolicyTab === 'promptInjection' && (
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">System Protection</h3>
                  <p className="text-gray-600">Protect against attempts to override system instructions or manipulate the AI</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Enabled</span>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={true}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                    <div
                      className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-blue-600"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detection Threshold ({promptInjectionThreshold}%)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Permissive</span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={promptInjectionThreshold}
                    onChange={handlePromptInjectionThresholdChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">Strict</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Lower values catch more potential injections but may increase false positives.
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Example Attack Patterns</h4>
                <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800 space-y-1">
                  {responsibleAIData.policies.promptInjection.exampleAttacks.map((example, index) => (
                    <div key={index} className="flex items-center">
                      <AlertTriangle size={14} className="text-yellow-600 mr-2 flex-shrink-0" />
                      <code className="font-mono bg-yellow-100 px-1 py-0.5 rounded">{example}</code>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Recent Injection Attempts</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => setShowDetailedLog(!showDetailedLog)}
                  >
                    {showDetailedLog ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>
                
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                  {responsibleAIData.policies.promptInjection.recentViolations.map((violation, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-900 font-medium">
                          <Shield size={16} className="inline text-red-500 mr-1" />
                          Injection Score: {violation.detectedScore}
                        </div>
                        <Badge variant="danger">Blocked</Badge>
                      </div>
                      {showDetailedLog && (
                        <div className="mt-1 text-sm text-gray-700">
                          <p className="bg-red-50 p-2 rounded text-red-800 text-xs font-mono">{violation.inputText}</p>
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        {formatTimestamp(violation.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {/* Topic Controls */}
          {activePolicyTab === 'topicControls' && (
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Topic Controls</h3>
                  <p className="text-gray-600">Control which topics the AI can discuss and which ones to avoid</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CheckCircle size={16} className="mr-2 text-green-500" />
                  Allowed Topics
                </h4>
                <div className="relative">
                  <textarea
                    value={allowedTopics}
                    onChange={(e) => setAllowedTopics(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter allowed topics, separated by commas"
                  />
                  <div className="absolute inset-y-0 right-0 px-3 flex items-center">
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={true}
                        className="sr-only"
                      />
                      <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                      <div
                        className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-4 bg-blue-600"
                      ></div>
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  The AI will only discuss topics from this list. Leave empty to allow all topics except banned ones.
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <XCircle size={16} className="mr-2 text-red-500" />
                  Banned Topics
                </h4>
                <textarea
                  value={bannedTopics}
                  onChange={(e) => setBannedTopics(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter banned topics, separated by commas"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The AI will refuse to discuss these topics and explain the limitation to users.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Recent Topic Violations</h4>
                </div>
                
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-[200px] overflow-y-auto">
                  {responsibleAIData.policies.topicControls.bannedTopics.recentViolations.map((violation, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-900">
                          <Tag size={16} className="inline text-purple-500 mr-1" />
                          Banned topic: <span className="font-medium">{violation.requestedTopic}</span>
                        </div>
                        <Badge variant="danger">Blocked</Badge>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatTimestamp(violation.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {/* PII Controls */}
          {activePolicyTab === 'piiControls' && (
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">PII Protection</h3>
                  <p className="text-gray-600">Configure how the system handles personally identifiable information</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Enabled</span>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={true}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                    <div
                      className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-blue-600"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">PII Detection Types</h4>
                <div className="space-y-3">
                  {Object.entries(piiControls).map(([control, enabled]) => (
                    <div key={control} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <UserX size={16} className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-900">{control}</span>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => handlePiiControlToggle(control)}
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            enabled ? "transform translate-x-4 bg-blue-600" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Default Action</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-300 rounded-md p-3 flex items-center bg-blue-50 border-blue-300">
                    <input
                      type="radio"
                      name="pii-action"
                      id="pii-mask"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked
                    />
                    <label htmlFor="pii-mask" className="ml-2 text-sm text-gray-700">
                      Mask PII <span className="text-xs text-gray-500">(Replace with ****)</span>
                    </label>
                  </div>
                  <div className="border border-gray-300 rounded-md p-3 flex items-center">
                    <input
                      type="radio"
                      name="pii-action"
                      id="pii-block"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="pii-block" className="ml-2 text-sm text-gray-700">
                      Block Message <span className="text-xs text-gray-500">(Prevent sending)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Recent PII Detections</h4>
                </div>
                
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-[200px] overflow-y-auto">
                  {responsibleAIData.policies.piiControls.recentHandled.map((detection, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-900">
                          <UserX size={16} className="inline text-gray-600 mr-1" />
                          <span className="font-medium">{detection.type}</span> detected
                        </div>
                        <Badge variant={detection.action === 'masked' ? 'info' : 'danger'}>
                          {detection.action === 'masked' ? 'Masked' : 'Blocked'}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatTimestamp(detection.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {/* Secrets Masking */}
          {activePolicyTab === 'secretsMasking' && (
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Secrets Protection</h3>
                  <p className="text-gray-600">Automatically detect and mask API keys, tokens, and other secrets</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Enabled</span>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={true}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                    <div
                      className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-6 bg-blue-600"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Pattern Types</h4>
                <div className="space-y-3">
                  {Object.entries(secretsControls).map(([control, enabled]) => (
                    <div key={control} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Lock size={16} className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-900">{control}</span>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => handleSecretsControlToggle(control)}
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            enabled ? "transform translate-x-4 bg-blue-600" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Example Masking</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Original Text</h5>
                  <code className="text-xs font-mono block bg-gray-100 p-2 rounded">
                    My API key is sk_live_51I8J5tJtEZLQh73jIxFqWaLa4B2HOf3EJEpzB1QXOQpYrkdDTZEnjhNZJnfYx0slj2Pbo... 
                  </code>
                  
                  <h5 className="text-sm font-medium text-gray-900 mt-4 mb-2">Masked Text</h5>
                  <code className="text-xs font-mono block bg-gray-100 p-2 rounded">
                    My API key is sk_live_****MASKED_SECRET****
                  </code>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Recent Detections</h4>
                </div>
                
                <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-[200px] overflow-y-auto">
                  {responsibleAIData.policies.secretsMasking.recentDetections.map((detection, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-900">
                          <Lock size={16} className="inline text-gray-600 mr-1" />
                          <span className="font-medium">{detection.patternType}</span> ({detection.detectionCount} instances)
                        </div>
                        <Badge variant="info">
                          {detection.action === 'masked' ? 'Masked' : 'Blocked'}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatTimestamp(detection.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {/* Audit Log */}
          <Card title="Security Audit Log">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h4 className="text-base font-medium text-gray-900">
                  <Clock size={16} className="inline mr-1" /> 
                  Recent Events
                </h4>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Filter size={14} />}
                >
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download size={14} />}
                >
                  Export
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[400px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responsibleAIData.auditLog.map((logEntry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(logEntry.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {logEntry.event}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getSeverityBadge(logEntry.severity)}>
                          {logEntry.severity.charAt(0).toUpperCase() + logEntry.severity.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Info Banner */}
      <div className="mt-8 bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Security & Compliance Controls</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                These controls help ensure AI assistants operate safely and respect user privacy. They protect against harmful content, prevent data leakage, and maintain appropriate conversation boundaries.
              </p>
              <p className="mt-2">
                All settings are applied across all AI assistants in the system. Audit logs are retained for 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ChatModal 
        agentName="KnoxEngage Security Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'I can help you understand and configure cybersecurity controls. What would you like to know about data protection, compliance, or security configuration?',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};