import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal, Message } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import { Target, Globe, Building, Users, Briefcase, Sparkles, Zap, AlertCircle, Check, HelpCircle, RefreshCw, ArrowRight, ChevronDown, ChevronUp, Save, Filter, Plus, Search } from 'lucide-react';
import { ICPSegmentEnrichment } from '../enrichment/ICPSegmentEnrichment';

interface ICPFormData {
  industry: string;
  companySize: string;
  roles: string[];
  geography: string;
  budget: string;
  painPoints: string[];
}

interface ICPSegment {
  id: string;
  name: string;
  description: string;
  saved: boolean;
}

export const ICPGenerator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('');
  const [formData, setFormData] = useState<ICPFormData>({
    industry: '',
    companySize: '',
    roles: [],
    geography: '',
    budget: '',
    painPoints: [],
  });
  
  const [icpSuggestions, setIcpSuggestions] = useState<string[]>([]);
  const [savedICPs, setSavedICPs] = useState<{name: string, data: ICPFormData}[]>([]);
  const [showSavedICPs, setShowSavedICPs] = useState(false);
  const [icpName, setIcpName] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [savedSegments, setSavedSegments] = useState<ICPSegment[]>([]);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [activeSegment, setActiveSegment] = useState<ICPSegment | null>(null);
  const [isViewingLeads, setIsViewingLeads] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [isSearchingLeads, setIsSearchingLeads] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templatesFilter, setTemplatesFilter] = useState('all');
  
  const demoProfiles = [
    {
      id: 'cybersecurity-it',
      name: 'Enterprise IT Security',
      data: {
        industry: 'Enterprise Technology',
        companySize: '1000+',
        roles: ['CISO', 'CIO', 'VP of IT Security', 'Security Director'],
        geography: 'North America',
        budget: '$100k+/month',
        painPoints: ['Zero-trust implementation', 'Container security', 'Compliance automation', 'Cloud misconfiguration', 'Runtime threats'],
      }
    },
    {
      id: 'fintech-security',
      name: 'FinTech Security Leaders',
      data: {
        industry: 'Financial Technology',
        companySize: '201-1000',
        roles: ['CISO', 'Head of Security', 'DevSecOps Lead', 'Security Architect'],
        geography: 'Global',
        budget: '$50k-100k/month',
        painPoints: ['Kubernetes security', 'Regulatory compliance', 'API security', 'Data protection', 'Threat detection'],
      }
    },
    {
      id: 'midmarket-security',
      name: 'Mid-Market Security Teams',
      data: {
        industry: 'Technology',
        companySize: '201-500',
        roles: ['Security Manager', 'IT Director', 'DevOps Lead', 'Cloud Architect'],
        geography: 'United States',
        budget: '$25k-50k/month',
        painPoints: ['Container security', 'Cloud-native protection', 'Security automation', 'Compliance requirements', 'Resource constraints'],
      }
    },
    {
      id: 'healthcare-security',
      name: 'Healthcare Security Teams',
      data: {
        industry: 'Healthcare Technology',
        companySize: '501-1000',
        roles: ['CISO', 'Security Director', 'Compliance Officer', 'IT Security Manager'],
        geography: 'United States, EU',
        budget: '$50k-100k/month',
        painPoints: ['HIPAA compliance', 'Container security', 'Patient data protection', 'Legacy system integration', 'Cloud security'],
      }
    },
    {
      id: 'devsecops',
      name: 'DevSecOps Teams',
      data: {
        industry: 'Technology',
        companySize: '50-1000',
        roles: ['DevSecOps Engineer', 'Security Architect', 'Platform Engineer', 'Cloud Security Lead'],
        geography: 'Global',
        budget: '$25k-75k/month',
        painPoints: ['Shift-left security', 'CI/CD pipeline integration', 'Kubernetes security', 'Automated compliance', 'Runtime protection'],
      }
    },
    {
      id: 'cloud-native',
      name: 'Cloud-Native Organizations',
      data: {
        industry: 'SaaS/Technology',
        companySize: '50-500',
        roles: ['Cloud Architect', 'DevOps Lead', 'Security Engineer', 'Platform Manager'],
        geography: 'North America, Europe',
        budget: '$20k-50k/month',
        painPoints: ['Container security', 'Kubernetes misconfigurations', 'Cloud compliance', 'Runtime threats', 'Zero-trust implementation'],
      }
    }
  ];
  
  const initialMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: `Hi there! I am KnoxEngage, your AI security engagement assistant. I can help you define your Ideal Customer Profile for cybersecurity solutions and suggest the best contacts to target. How can I assist you today?`,
      timestamp: new Date(),
    },
  ];
  
  const handleAnalyzeWebsite = () => {
    if (!websiteUrl) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Simulate AI response
      setFormData({
        industry: 'Enterprise Technology',
        companySize: '1000+',
        roles: ['CISO', 'CIO', 'VP of IT Security'],
        geography: 'North America',
        budget: '$50k-100k/month',
        painPoints: ['Container security', 'Kubernetes protection', 'Runtime threats'],
      });
      
      setIcpSuggestions([
        'Enterprise organizations with Kubernetes deployments',
        'Security teams at cloud-native companies',
        'CISOs at companies with 1000+ employees',
      ]);
      
      setStep(2);
    }, 2000);
  };
  
  const activateDemoMode = (demoId: string) => {
    const selectedProfile = demoProfiles.find(demo => demo.id === demoId);
    if (selectedProfile) {
      setSelectedDemo(demoId);
      setFormData(selectedProfile.data);
      setIcpSuggestions([
        `${selectedProfile.data.industry} companies in ${selectedProfile.data.geography}`,
        `${selectedProfile.data.roles[0]}s at ${selectedProfile.data.companySize} employee companies`,
        `Organizations focused on solving ${selectedProfile.data.painPoints[0]} challenges`,
      ]);
      setStep(2);
    }
  };
  
  const handleGenerateAI = () => {
    setAiGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      // Generate some variations based on current form data
      const industries = ['Enterprise Technology', 'Financial Services', 'Healthcare', 'SaaS/Cloud', 'Government'];
      const roles = [
        ['CISO', 'CIO', 'VP of IT Security'], 
        ['Security Architect', 'Cloud Security Lead', 'Security Director'],
        ['DevSecOps Lead', 'Platform Engineer', 'Security Engineering Manager'],
        ['Security Operations Manager', 'Threat Intel Lead', 'Security Analyst']
      ];
      const painPoints = [
        ['Container security', 'Kubernetes protection', 'Runtime threats'],
        ['Zero-day vulnerabilities', 'Compliance automation', 'Cloud misconfigurations'],
        ['Lateral movement detection', 'Network segmentation', 'Supply chain attacks'],
      ];
      
      // Pick random variations
      const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
      const randomRoles = roles[Math.floor(Math.random() * roles.length)];
      const randomPainPoints = painPoints[Math.floor(Math.random() * painPoints.length)];
      
      setFormData({
        ...formData,
        industry: randomIndustry,
        roles: randomRoles,
        painPoints: randomPainPoints
      });
      
      setIcpSuggestions([
        `${randomIndustry} companies in ${formData.geography || 'North America'}`,
        `${randomRoles[0]}s at ${formData.companySize || '1000+'} employee companies`,
        `Organizations focused on solving ${randomPainPoints[0]} challenges`,
      ]);
      
      setAiGenerating(false);
    }, 2000);
  };
  
  const handleSaveICP = () => {
    if (!icpName.trim()) {
      alert('Please enter a name for this ICP');
      return;
    }
    
    // Add to saved ICPs
    setSavedICPs([...savedICPs, {
      name: icpName,
      data: formData
    }]);
    
    // Reset name and show success message
    setIcpName('');
    alert('ICP saved successfully!');
  };
  
  const loadSavedICP = (savedICP: {name: string, data: ICPFormData}) => {
    setFormData(savedICP.data);
    setIcpSuggestions([
      `${savedICP.data.industry} companies in ${savedICP.data.geography}`,
      `${savedICP.data.roles[0]}s at ${savedICP.data.companySize} employee companies`,
      `Organizations focused on solving ${savedICP.data.painPoints[0]} challenges`,
    ]);
    setShowSavedICPs(false);
    setStep(2);
  };

  const handleSaveSegment = (segmentName: string) => {
    // Create a new segment
    const newSegment: ICPSegment = {
      id: `segment-${Date.now()}`,
      name: segmentName,
      description: `Based on ${formData.industry} companies in ${formData.geography} focusing on ${formData.roles.join(', ')}`,
      saved: true
    };
    
    setSavedSegments([...savedSegments, newSegment]);
    setShowSegmentModal(false);
    
    // Show success message
    alert(`Segment "${segmentName}" has been saved successfully!`);
  };

  const handleViewLeads = (suggestion: string) => {
    setIsSearchingLeads(true);
    setSearchProgress(0);
    
    // Simulate API call progress
    const interval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + (Math.random() * 10);
      });
    }, 200);
    
    // Simulate API call to find matching leads
    setTimeout(() => {
      clearInterval(interval);
      setSearchProgress(100);
      
      setTimeout(() => {
        setIsSearchingLeads(false);
        setActiveSegment({
          id: `temp-${Date.now()}`,
          name: suggestion,
          description: `Contacts matching "${suggestion}" criteria`,
          saved: false
        });
        
        setLoadingLeads(true);
        setIsViewingLeads(true);
        
        // Simulate API call to fetch matching leads
        setTimeout(() => {
          setLoadingLeads(false);
        }, 1500);
      }, 500);
    }, 2500);
  };
  
  const handleFindMatchingLeads = () => {
    // Use first suggestion as default if available
    if (icpSuggestions.length > 0) {
      handleViewLeads(icpSuggestions[0]);
    } else {
      // Create a generic suggestion based on current form data
      const suggestion = `${formData.industry} companies in ${formData.geography || 'global market'}`;
      handleViewLeads(suggestion);
    }
  };

  const renderSegmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Save ICP Segment</h3>
          
          <div className="mb-4">
            <label htmlFor="segment-name" className="block text-sm font-medium text-gray-700 mb-1">
              Segment Name*
            </label>
            <input
              id="segment-name"
              type="text"
              placeholder="e.g., Enterprise Security Leaders"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segment Criteria (Based on ICP)
            </label>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <div className="flex items-start mb-1">
                <span className="w-24 flex-shrink-0 text-gray-500">Industry:</span>
                <span className="font-medium">{formData.industry}</span>
              </div>
              <div className="flex items-start mb-1">
                <span className="w-24 flex-shrink-0 text-gray-500">Roles:</span>
                <span className="font-medium">{formData.roles.join(', ')}</span>
              </div>
              <div className="flex items-start mb-1">
                <span className="w-24 flex-shrink-0 text-gray-500">Company Size:</span>
                <span className="font-medium">{formData.companySize}</span>
              </div>
              <div className="flex items-start">
                <span className="w-24 flex-shrink-0 text-gray-500">Geography:</span>
                <span className="font-medium">{formData.geography}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mt-1 mb-4">
            <input
              id="auto-enrichment"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="auto-enrichment" className="ml-2 text-sm text-gray-700">
              Automatically enrich contacts in this segment
            </label>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowSegmentModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSaveSegment("Enterprise Security Leaders")}
            icon={<Save size={16} />}
          >
            Save Segment
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLeadViewer = () => (
    <ICPSegmentEnrichment 
      segment={activeSegment!} 
      onBackToSuggestions={() => setIsViewingLeads(false)} 
    />
  );
  
  const renderLeadSearchModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-4 text-center">Finding Matching Contacts</h3>
          
          <div className="flex flex-col items-center justify-center my-8">
            <div className="w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" 
                style={{ 
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                  transform: `rotate(${searchProgress * 3.6}deg)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center font-medium text-blue-600">
                {Math.round(searchProgress)}%
              </div>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Searching for contacts...</p>
            <p className="text-gray-600 text-center max-w-xs">
              Analyzing your ICP criteria and finding matching contacts in our database
            </p>
          </div>
          
          <div className="mt-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Matching industry criteria</span>
                <Check size={16} className="text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Finding contacts by role</span>
                <Check size={16} className={searchProgress >= 40 ? "text-green-600" : "text-gray-300"} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Analyzing company size match</span>
                <Check size={16} className={searchProgress >= 70 ? "text-green-600" : "text-gray-300"} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Determining security fit score</span>
                {searchProgress >= 90 ? 
                  <Check size={16} className="text-green-600" /> : 
                  searchProgress >= 80 ? 
                    <RefreshCw size={16} className="text-blue-600 animate-spin" /> : 
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderTemplatesTab = () => {
    // Filter templates based on search and filters
    const filteredTemplates = demoProfiles.filter(profile => {
      if (templateSearch) {
        const searchLower = templateSearch.toLowerCase();
        return (
          profile.name.toLowerCase().includes(searchLower) ||
          profile.data.industry.toLowerCase().includes(searchLower) ||
          profile.data.roles.some(role => role.toLowerCase().includes(searchLower)) ||
          profile.data.geography.toLowerCase().includes(searchLower)
        );
      }
      
      if (templatesFilter !== 'all') {
        // Filter by industry category if not showing all
        return profile.data.industry.toLowerCase().includes(templatesFilter.toLowerCase());
      }
      
      return true;
    });
    
    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">ICP Templates</h3>
          <p className="text-gray-600">Pre-built ideal customer profiles for various industries and target markets</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search templates..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={templatesFilter}
              onChange={(e) => setTemplatesFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              <option value="enterprise">Enterprise</option>
              <option value="fintech">FinTech</option>
              <option value="healthcare">Healthcare</option>
              <option value="technology">Technology</option>
            </select>
            
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setStep(2)}
            >
              Create Custom
            </Button>
          </div>
        </div>
        
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No templates found</h4>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setTemplateSearch('');
                setTemplatesFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((profile) => (
              <Card key={profile.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-medium text-gray-900">{profile.name}</h4>
                  <Badge variant={profile.id === 'cybersecurity-it' || profile.id === 'devsecops' ? 'success' : 'info'}>
                    {profile.id === 'cybersecurity-it' || profile.id === 'devsecops' ? 'Popular' : 'New'}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-3">
                  <div className="flex items-start">
                    <Building size={16} className="text-gray-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Industry</p>
                      <p className="text-sm font-medium">{profile.data.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users size={16} className="text-gray-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Company Size</p>
                      <p className="text-sm font-medium">{profile.data.companySize}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe size={16} className="text-gray-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Geography</p>
                      <p className="text-sm font-medium">{profile.data.geography}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Target Roles</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.data.roles.slice(0, 3).map((role, i) => (
                      <Badge key={i} className="text-xs">{role}</Badge>
                    ))}
                    {profile.data.roles.length > 3 && (
                      <Badge className="text-xs">+{profile.data.roles.length - 3}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end pt-3 border-t border-gray-200">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => activateDemoMode(profile.id)}
                  >
                    Use Template
                  </Button>
                </div>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50 flex flex-col items-center justify-center p-6 hover:bg-gray-100 cursor-pointer">
              <div className="mb-3 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus size={24} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">Create Custom Template</h4>
              <p className="text-sm text-gray-500 text-center mb-4">
                Define your own ideal customer profile from scratch
              </p>
              <Button
                variant="outline"
                onClick={() => setStep(2)}
              >
                Start Building
              </Button>
            </Card>
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 p-4 rounded-md">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Sparkles size={18} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-2">Template Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Define specific industries and security concerns for better targeting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Include multiple job titles for each decision-maker level</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Identify specific security pain points your solution addresses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Use templates as a starting point, then refine based on results</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderStep1 = () => (
    <Card 
      title="Define Your Ideal Customer Profile"
      className="mb-6"
    >
      <p className="text-gray-600 mb-4">
        Let our AI analyze your website to suggest an ideal customer profile, try a demo profile, or define one manually.
      </p>
      
      <div className="mb-6">
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
          Company Website
        </label>
        <div className="flex">
          <input
            type="url"
            id="website"
            placeholder="https://yourcompany.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={handleAnalyzeWebsite}
            disabled={!websiteUrl || isAnalyzing}
            className="rounded-l-none"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
        
        <p className="mt-2 text-xs text-gray-500">
          We'll analyze your website content, products, and target audience to suggest an ideal customer profile.
        </p>
      </div>
      
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Zap size={16} className="mr-1 text-yellow-500" />
          Try Demo Profiles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {demoProfiles.slice(0, 3).map((demo) => (
            <div 
              key={demo.id}
              className={`border p-4 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors ${
                selectedDemo === demo.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => activateDemoMode(demo.id)}
            >
              <h4 className="font-medium text-gray-900 mb-1">{demo.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{demo.data.industry} • {demo.data.companySize} employees</p>
              <div className="flex flex-wrap gap-1">
                {demo.data.roles.slice(0, 2).map((role, i) => (
                  <Badge key={i} className="text-xs">{role}</Badge>
                ))}
                {demo.data.roles.length > 2 && (
                  <Badge className="text-xs">+{demo.data.roles.length - 2} more</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setStep(2)}
            className="flex-1 mr-2"
          >
            Define ICP Manually
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setStep(3)}
            className="flex-1 ml-2"
            icon={<Search size={16} />}
          >
            Browse All Templates
          </Button>
        </div>
        
        {savedICPs.length > 0 && (
          <div className="mt-4">
            <button
              className="text-blue-600 text-sm flex items-center"
              onClick={() => setShowSavedICPs(!showSavedICPs)}
            >
              {showSavedICPs ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  Hide Saved Profiles
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  View {savedICPs.length} Saved Profiles
                </>
              )}
            </button>
            
            {showSavedICPs && (
              <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                {savedICPs.map((savedICP, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => loadSavedICP(savedICP)}
                  >
                    <h4 className="font-medium text-gray-900">{savedICP.name}</h4>
                    <p className="text-xs text-gray-500">
                      {savedICP.data.industry} • {savedICP.data.geography} • {savedICP.data.roles.slice(0, 2).join(', ')}
                      {savedICP.data.roles.length > 2 ? `, +${savedICP.data.roles.length - 2} more` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
  
  const renderStep2 = () => (
    <>
      {isViewingLeads ? (
        renderLeadViewer()
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your Ideal Customer Profile</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw size={14} className={aiGenerating ? "animate-spin" : ""} />}
                onClick={handleGenerateAI}
                disabled={aiGenerating}
              >
                {aiGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Building size={16} className="mr-1" />
                      Industry
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      Company Size
                    </div>
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="50-200">50-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Globe size={16} className="mr-1" />
                      Geography
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.geography}
                    onChange={(e) => setFormData({...formData, geography: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <HelpCircle size={16} className="mr-1" />
                      Budget Range (Optional)
                    </div>
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select budget range</option>
                    <option value="<$5k/month">Less than $5k/month</option>
                    <option value="$5k-10k/month">$5k-10k/month</option>
                    <option value="$10k-25k/month">$10k-25k/month</option>
                    <option value="$25k-50k/month">$25k-50k/month</option>
                    <option value="$50k-100k/month">$50k-100k/month</option>
                    <option value="$100k+/month">$100k+/month</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1" />
                      Target Roles
                    </div>
                  </label>
                  <textarea
                    value={formData.roles.join(', ')}
                    onChange={(e) => setFormData({...formData, roles: e.target.value.split(',').map(r => r.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    placeholder="Enter roles separated by commas"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    E.g., CISO, CIO, VP of IT Security, Security Architect
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Target size={16} className="mr-1" />
                      Key Security Pain Points
                    </div>
                  </label>
                  <textarea
                    value={formData.painPoints.join(', ')}
                    onChange={(e) => setFormData({...formData, painPoints: e.target.value.split(',').map(p => p.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    placeholder="Enter pain points separated by commas"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    E.g., Container security, Kubernetes protection, Runtime threats
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1 mb-3 md:mb-0 md:mr-4">
                  <label htmlFor="icp-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Save this ICP Profile
                  </label>
                  <input
                    id="icp-name"
                    type="text"
                    placeholder="Enter a name for this ICP"
                    value={icpName}
                    onChange={(e) => setIcpName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleSaveICP}
                  icon={<Save size={16} />}
                  disabled={!icpName.trim()}
                >
                  Save ICP
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="AI-Suggested ICP Segments">
            <p className="text-gray-600 mb-4">
              Based on your inputs, here are some suggested ICP segments to target:
            </p>
            
            <div className="space-y-3">
              {isSearchingLeads ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                icpSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-md group relative overflow-hidden">
                    <Target size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                    <span>{suggestion}</span>
                    <Badge variant="info" className="ml-auto">Recommended</Badge>
                    
                    {/* Hover actions */}
                    <div className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-100 via-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center pr-3 pl-10">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs mr-2"
                        onClick={() => handleViewLeads(suggestion)}
                      >
                        View Contacts
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => {
                          setActiveSegment({
                            id: `segment-${Date.now()}`,
                            name: suggestion,
                            description: `Based on ${formData.industry} companies in ${formData.geography}`,
                            saved: false
                          });
                          setShowSegmentModal(true);
                        }}
                      >
                        Save Segment
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Sparkles size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">
                    <strong>AI Insight:</strong> Organizations with {formData.companySize || '1000+'} employees in the {formData.industry || 'Enterprise Technology'} space 
                    typically have dedicated security teams addressing challenges with 
                    {formData.painPoints.length > 0 ? ` ${formData.painPoints.join(' and ')}` : ' container security and Kubernetes protection'}.
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Industry Targeting Tip</h4>
                      <p className="text-xs text-gray-700">
                        {formData.industry || 'Enterprise Technology'} companies typically have a {formData.companySize ? `complex` : 'complex'} security approval process and prioritize compliance and risk-focused messaging.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Role-Based Approach</h4>
                      <p className="text-xs text-gray-700">
                        {formData.roles.length > 0 ? formData.roles[0] : 'Security leaders'} typically focus on {formData.painPoints.length > 0 ? formData.painPoints[0] : 'compliance'} and respond well to ROI-focused messaging and case studies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              
              <Button
                variant="primary"
                icon={<ArrowRight size={16} />}
                onClick={handleFindMatchingLeads}
              >
                Find Matching Contacts
              </Button>
            </div>
          </Card>
        </>
      )}
      
      {showSegmentModal && renderSegmentModal()}
      {isSearchingLeads && renderLeadSearchModal()}
    </>
  );
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ideal Customer Profile</h2>
        <p className="text-gray-600">Define your ideal customer profile for cybersecurity solutions</p>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex -mb-px">
            <button 
              className={`py-4 px-6 border-b-2 font-medium text-sm ${step === 1 || step === 2 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setStep(isViewingLeads ? 2 : 1)}
            >
              Define ICP
            </button>
            <button 
              className={`py-4 px-6 border-b-2 font-medium text-sm ${step === 3 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setStep(3)}
            >
              Templates Gallery
            </button>
          </div>
        </div>
      </div>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderTemplatesTab()}
      
      <ChatModal 
        agentName="KnoxEngage ICP Assistant"
        initialMessages={initialMessages}
      />
    </div>
  );
};