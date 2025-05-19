import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import { TemplateModal } from '../common/TemplateModal';
import { NewTemplateModal } from '../common/NewTemplateModal';
import { 
  Sparkles, 
  RefreshCw, 
  Save, 
  Copy, 
  PenTool, 
  Palette, 
  CheckSquare, 
  Trash2, 
  FileText, 
  Search,
  Filter,
  Plus,
  Edit,
  ArrowRight,
  Calendar,
  Users,
  X,
  Check,
  MessageSquare,
  Send
} from 'lucide-react';

// Import email templates data
import emailTemplatesData from '../../data/email_templates.json';
// Import leads data
import leadsData from '../../data/leads.json';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  tone: 'friendly' | 'professional' | 'persuasive' | 'witty';
  variables: string[];
  performance?: {
    openRate: number;
    clickRate: number;
    replyRate: number;
    meetingRate: number;
  };
  bestTimeToSend?: string;
  bestDayOfWeek?: string;
  targetAudience?: string;
  notes?: string;
}

export const EmailComposer: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate>({
    id: '1',
    name: 'Initial Outreach',
    subject: 'Cloud-Native Security Solutions for {{company}}',
    body: `Hey {{firstName}},

I noticed {{company}}'s focus on container-based infrastructure and wanted to reach out about security challenges that often arise with Kubernetes deployments.

Our security platform helps organizations like {{company}} to:
• Detect and prevent runtime threats in containerized environments
• Secure the entire application lifecycle from build to runtime
• Achieve compliance with automated security policies

Would you be open to a quick 15-minute call to explore how we've helped similar companies in the {{industry}} space strengthen their container security posture?

Best,
[Your name]`,
    tone: 'professional',
    variables: ['firstName', 'company', 'industry'],
  });
  
  const [templates, setTemplates] = useState<EmailTemplate[]>(
    emailTemplatesData.templates.map(template => ({
      ...template,
      variables: template.variables || []
    }))
  );
  
  const [selectedTone, setSelectedTone] = useState<string>('professional');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>(undefined);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<{[key: string]: string}>({
    firstName: 'Alex',
    company: 'Acme Corp',
    industry: 'Financial Services',
    painPoint: 'container security',
    triggerEvent: 'recent cloud migration',
    benefitOne: 'Detect and prevent runtime threats in Kubernetes',
    benefitTwo: 'Secure the entire application lifecycle',
    benefitThree: 'Achieve compliance with automated security policies',
    companyExample: 'TechCorp',
    similarCompany: 'CloudSecure',
    title: 'Security Director',
    topicOfInterest: 'cloud-native security',
    contentReference: 'LinkedIn post',
    specificPoint: 'container security in production',
    improvementStat: '40%',
    referralName: 'Sam Johnson',
    referralCompany: 'GrowthCo',
    recentEvent: 'Kubernetes implementation'
  });
  
  // Recipients management
  const [showRecipientSelector, setShowRecipientSelector] = useState(false);
  const [availableLeads, setAvailableLeads] = useState<any[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<any[]>([]);
  const [recipientSearchQuery, setRecipientSearchQuery] = useState('');
  
  // Sequence redirect state
  const [showSequenceRedirect, setShowSequenceRedirect] = useState(false);
  const [selectedTemplateForSequence, setSelectedTemplateForSequence] = useState<EmailTemplate | null>(null);
  
  useEffect(() => {
    // Load leads data
    setAvailableLeads(leadsData.leads);
  }, []);

  const handleToneChange = (tone: string) => {
    setSelectedTone(tone);
    
    // Simulate AI regenerating email with new tone
    setTimeout(() => {
      if (tone === 'friendly') {
        setActiveTemplate({
          ...activeTemplate,
          subject: `Hi {{firstName}}, I'd love to show you our container security solution`,
          body: `Hey there {{firstName}}!

I've been checking out {{company}} and noticed you're using Kubernetes and containers. That's awesome stuff!

Security for container environments can be tricky, and I thought you might be interested in how we're helping companies like yours protect their cloud-native apps without slowing down development.

Our platform makes it super easy to:
• Spot and stop threats in your running containers
• Keep your entire app lifecycle secure from build to runtime 
• Stay compliant with automated security checks

I'd love to show you how it works with a quick 15-min demo. Would that be helpful?

Cheers,
[Your name]`,
          tone: 'friendly',
        });
      } else if (tone === 'professional') {
        setActiveTemplate({
          ...activeTemplate,
          subject: 'Cloud-Native Security Solutions for {{company}}',
          body: `Hey {{firstName}},

I noticed {{company}}'s focus on container-based infrastructure and wanted to reach out about security challenges that often arise with Kubernetes deployments.

Our security platform helps organizations like {{company}} to:
• Detect and prevent runtime threats in containerized environments
• Secure the entire application lifecycle from build to runtime
• Achieve compliance with automated security policies

Would you be open to a quick 15-minute call to explore how we've helped similar companies in the {{industry}} space strengthen their container security posture?

Best,
[Your name]`,
          tone: 'professional',
        });
      } else if (tone === 'persuasive') {
        setActiveTemplate({
          ...activeTemplate,
          subject: 'How {{company}} can strengthen container security',
          body: `Hello {{firstName}},

What would it mean for {{company}} if you could strengthen your Kubernetes security while actually accelerating development?

This isn't a hypothetical question. Organizations running containerized workloads face a critical security challenge: traditional security tools can't protect dynamic, ephemeral containers, leaving dangerous security gaps.

Our cloud-native security platform addresses this by:
1. Providing real-time threat detection and prevention for running containers
2. Automating security across the entire application lifecycle
3. Enforcing compliance without slowing development

Leading {{industry}} companies have reduced security incidents by 78% while deploying code 35% faster after implementation.

Would a 15-minute call make sense to explore how these approaches could deliver similar results for {{company}}?

Regards,
[Your name]`,
          tone: 'persuasive',
        });
      } else if (tone === 'witty') {
        setActiveTemplate({
          ...activeTemplate,
          subject: `Container security for {{company}} (no "thinking outside the box" puns, promise)`,
          body: `{{firstName}}, let's talk about securing what's inside your containers - and no, I don't mean leftovers in your office fridge.

As {{company}} scales your Kubernetes environment, securing those containers becomes about as straightforward as teaching cats to march in formation. Your DevOps team is moving at warp speed, but security threats are faster than a caffeinated developer on a deadline.

Our platform is like a security superhero for your containers:
• Threat detection so fast it makes The Flash look like he's running in slow motion
• Lifecycle protection that's more thorough than your most detail-obsessed team member
• Compliance automation that's less painful than sitting through a 3-hour governance meeting

I can show you how it all works in a quick 15-minute demo. No long sales pitch - I promise it'll be shorter than a Kubernetes deployment command.

What do you say - shall we make your containers more secure than Fort Knox?

Containeriously yours,
[Your name]`,
          tone: 'witty',
        });
      }
    }, 1000);
  };
  
  const handleSaveTemplate = () => {
    // Add or update the template in the templates array
    const templateExists = templates.some(t => t.id === activeTemplate.id);
    
    if (templateExists) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === activeTemplate.id ? activeTemplate : t
      ));
    } else {
      // Add new template
      setTemplates([...templates, activeTemplate]);
    }
    
    // Show success message
    alert('Template saved successfully!');
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
      
      // If the active template was deleted, set the first available template as active
      if (activeTemplate.id === templateId && templates.length > 1) {
        const remainingTemplates = templates.filter(t => t.id !== templateId);
        setActiveTemplate(remainingTemplates[0]);
      }
    }
  };
  
  const handleCreateTemplate = () => {
    setEditingTemplate(undefined);
    setShowNewTemplateModal(true);
  };
  
  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };
  
  const handleSaveTemplateFromModal = (template: EmailTemplate) => {
    if (templates.some(t => t.id === template.id)) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === template.id ? template : t
      ));
    } else {
      // Add new template
      setTemplates([...templates, template]);
    }
    
    // Update active template if it's the one being edited
    if (activeTemplate.id === template.id) {
      setActiveTemplate(template);
    }
    
    setShowTemplateModal(false);
  };
  
  const handleSaveFromNewTemplateModal = (template: EmailTemplate) => {
    if (templates.some(t => t.id === template.id)) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === template.id ? template : t
      ));
    } else {
      // Add new template
      setTemplates([...templates, template]);
    }
    
    // Set as active template
    setActiveTemplate(template);
    
    setShowNewTemplateModal(false);
  };
  
  const getToneBadgeColor = (tone: string): string => {
    switch (tone) {
      case 'friendly':
        return 'bg-green-100 text-green-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'persuasive':
        return 'bg-purple-100 text-purple-800';
      case 'witty':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredTemplates = templates.filter(template => {
    if (!searchQuery) return true;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      template.name.toLowerCase().includes(lowerCaseQuery) || 
      template.subject.toLowerCase().includes(lowerCaseQuery) || 
      template.body.toLowerCase().includes(lowerCaseQuery) ||
      template.tone.toLowerCase().includes(lowerCaseQuery)
    );
  });
  
  // Function to add template to sequence
  const addTemplateToSequence = () => {
    setSelectedTemplateForSequence(activeTemplate);
    setShowSequenceRedirect(true);
  };

  // Function to replace variables with preview data
  const replaceVariables = (text: string): string => {
    return text.replace(/{{(\w+)}}/g, (match, variableName) => {
      return previewData[variableName] || match;
    });
  };

  // Function to handle recipient selection
  const handleRecipientSelect = (lead: any) => {
    if (selectedRecipients.some(r => r.id === lead.id)) {
      setSelectedRecipients(selectedRecipients.filter(r => r.id !== lead.id));
    } else {
      setSelectedRecipients([...selectedRecipients, lead]);
    }
  };

  // Function to select all filtered recipients
  const handleSelectAllRecipients = () => {
    if (filteredRecipients.length === selectedRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(filteredRecipients);
    }
  };
  
  // Filter available leads based on search
  const filteredRecipients = availableLeads.filter(lead => {
    if (!recipientSearchQuery) return true;
    
    const query = recipientSearchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.title.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query)
    );
  });

  // Render recipient selector modal
  const renderRecipientSelector = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900">Select Recipients</h2>
          <button 
            onClick={() => setShowRecipientSelector(false)}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name, company, or email..."
                value={recipientSearchQuery}
                onChange={e => setRecipientSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {recipientSearchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  onClick={() => setRecipientSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all-recipients"
                checked={filteredRecipients.length > 0 && filteredRecipients.every(r => selectedRecipients.some(s => s.id === r.id))}
                onChange={handleSelectAllRecipients}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="select-all-recipients" className="ml-2 text-sm text-gray-700">
                Select All
              </label>
            </div>
            
            <div className="flex items-center">
              {selectedRecipients.length > 0 && (
                <span className="text-sm text-gray-700 mr-4">
                  {selectedRecipients.length} selected
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                icon={<Filter size={14} />}
              >
                Filter Options
              </Button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {filteredRecipients.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No matching contacts found
              </div>
            ) : (
              filteredRecipients.map(lead => (
                <div 
                  key={lead.id} 
                  className={`p-3 hover:bg-gray-50 ${
                    selectedRecipients.some(r => r.id === lead.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.some(r => r.id === lead.id)}
                      onChange={() => handleRecipientSelect(lead)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <Badge variant={lead.fitScore >= 8.5 ? 'success' : lead.fitScore >= 7 ? 'info' : 'default'}>
                          {lead.fitScore.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.title} • {lead.company}
                      </div>
                      <div className="text-sm text-gray-700 mt-0.5">
                        {lead.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowRecipientSelector(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowRecipientSelector(false)}
              disabled={selectedRecipients.length === 0}
            >
              Use {selectedRecipients.length} Selected Recipient{selectedRecipients.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render sequence redirect modal
  const renderSequenceRedirectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Add Template to Sequence
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Your template is ready to be added to an email sequence
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Template Details</h3>
            <div className="text-sm text-blue-700">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Name:</span>
                <span>{selectedTemplateForSequence?.name}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Tone:</span>
                <span className="capitalize">{selectedTemplateForSequence?.tone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recipients:</span>
                <span>{selectedRecipients.length > 0 ? selectedRecipients.length : 'None selected'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowSequenceRedirect(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowSequenceRedirect(false);
                window.location.href = '#/sequence';
              }}
              icon={<ArrowRight size={16} />}
            >
              Go to Sequence Scheduler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Engagement Composer</h2>
        <p className="text-gray-600">Create personalized engagement templates with AI assistance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">Template Library</h3>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus size={14} />}
                onClick={handleCreateTemplate}
              >
                New Template
              </Button>
            </div>
            
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 mb-1">No templates found</p>
                <p className="text-sm text-gray-500">
                  {searchQuery ? "Try another search term" : "Create your first template"}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-md flex items-start ${
                      template.id === activeTemplate.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <button
                      className="flex-1 text-left"
                      onClick={() => setActiveTemplate(template)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getToneBadgeColor(template.tone)}`}>
                          {template.tone}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{template.subject}</p>
                      {template.performance && (
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="text-green-600 font-medium">{template.performance.openRate}% opens</span>
                          <span className="mx-1">·</span>
                          <span>{template.performance.replyRate}% replies</span>
                        </div>
                      )}
                    </button>
                    <div className="flex ml-2">
                      <button
                        className="text-gray-400 hover:text-gray-500 p-1"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-500 p-1"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              icon={<PenTool size={16} />}
              onClick={handleCreateTemplate}
            >
              Create New Template
            </Button>
          </Card>
          
          <Card title="AI Email Tools">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Email Tone</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['professional', 'friendly', 'persuasive', 'witty'].map((tone) => (
                    <button
                      key={tone}
                      className={`px-3 py-2 text-sm rounded-md border ${
                        selectedTone === tone
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleToneChange(tone)}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">AI Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Sparkles size={16} />}
                  >
                    Improve Subject Line
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<RefreshCw size={16} />}
                  >
                    Regenerate Email
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Palette size={16} />}
                  >
                    A/B Test Creator
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview Data</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder="First Name"
                        value={previewData.firstName}
                        onChange={(e) => setPreviewData({...previewData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder="Company"
                        value={previewData.company}
                        onChange={(e) => setPreviewData({...previewData, company: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="Industry"
                      value={previewData.industry}
                      onChange={(e) => setPreviewData({...previewData, industry: e.target.value})}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={<RefreshCw size={14} />}
                    onClick={() => setPreviewData({
                      firstName: 'Alex',
                      company: 'Acme Corp',
                      industry: 'Financial Services',
                      painPoint: 'container security',
                      triggerEvent: 'recent cloud migration',
                      benefitOne: 'Detect and prevent runtime threats in Kubernetes',
                      benefitTwo: 'Secure the entire application lifecycle',
                      benefitThree: 'Achieve compliance with automated security policies',
                      companyExample: 'TechCorp',
                      similarCompany: 'CloudSecure',
                      title: 'Security Director',
                      topicOfInterest: 'cloud-native security',
                      contentReference: 'LinkedIn post',
                      specificPoint: 'container security in production',
                      improvementStat: '40%',
                      referralName: 'Sam Johnson',
                      referralCompany: 'GrowthCo',
                      recentEvent: 'Kubernetes implementation'
                    })}
                  >
                    Reset Preview Data
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Users size={16} />}
                    onClick={() => setShowRecipientSelector(true)}
                  >
                    Select Recipients {selectedRecipients.length > 0 && `(${selectedRecipients.length})`}
                  </Button>
                  
                  <Button
                    variant="primary"
                    fullWidth
                    icon={<Calendar size={16} />}
                    onClick={addTemplateToSequence}
                    disabled={selectedRecipients.length === 0}
                  >
                    Add to Sequence
                  </Button>
                </div>
                
                {selectedRecipients.length > 0 && (
                  <div className="mt-3 bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-blue-800">Selected Recipients</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 py-0 px-2 text-xs"
                        onClick={() => setSelectedRecipients([])}
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="text-xs text-blue-700">
                      {selectedRecipients.slice(0, 2).map((recipient, index) => (
                        <div key={recipient.id} className="flex items-center mb-1">
                          <Check size={12} className="mr-1 text-blue-600" />
                          <span>{recipient.name} ({recipient.company})</span>
                        </div>
                      ))}
                      {selectedRecipients.length > 2 && (
                        <div className="text-xs text-blue-700 mt-1">
                          + {selectedRecipients.length - 2} more recipients
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Template Editor</h3>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit size={14} />}
                  onClick={() => handleEditTemplate(activeTemplate)}
                >
                  Edit as New
                </Button>
              </div>
            </div>
            
            {isPreviewMode ? (
              <div>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-500 mb-2">Subject:</p>
                  <p className="text-base font-medium">{replaceVariables(activeTemplate.subject)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-2">Body:</p>
                  <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-line">
                    {replaceVariables(activeTemplate.body)}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    id="template-name"
                    type="text"
                    value={activeTemplate.name}
                    onChange={(e) => setActiveTemplate({...activeTemplate, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <div className="relative">
                    <input
                      id="subject"
                      type="text"
                      value={activeTemplate.subject}
                      onChange={(e) => setActiveTemplate({...activeTemplate, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700">
                      <Sparkles size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Body
                  </label>
                  <textarea
                    id="email-body"
                    value={activeTemplate.body}
                    onChange={(e) => setActiveTemplate({...activeTemplate, body: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px]"
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex">
                {activeTemplate.variables.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Variables:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeTemplate.variables.map(variable => (
                        <Badge key={variable} className="text-xs">{variable}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  icon={<Copy size={16} />}
                >
                  Copy
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleSaveTemplate}
                  icon={<Save size={16} />}
                >
                  Save Template
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="Email Preview">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="bg-white rounded-md shadow-sm p-6 max-w-2xl mx-auto border border-gray-200">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">From: Your Name &lt;your.email@company.com&gt;</div>
                  {selectedRecipients.length > 0 ? (
                    <div className="text-sm text-gray-500 mb-1">
                      To: {selectedRecipients.length === 1 ? (
                        `${selectedRecipients[0].name} <${selectedRecipients[0].email}>`
                      ) : (
                        `${selectedRecipients[0].name} <${selectedRecipients[0].email}> +${selectedRecipients.length - 1} more`
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-1">To: {previewData.firstName} &lt;{previewData.firstName.toLowerCase()}@{previewData.company.toLowerCase().replace(/\s+/g, '')}.com&gt;</div>
                  )}
                  <div className="text-sm text-gray-500 mb-1">Subject: <span className="font-medium text-gray-900">{replaceVariables(activeTemplate.subject)}</span></div>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-line">
                  {replaceVariables(activeTemplate.body)}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <CheckSquare size={16} className="mr-1" />
                  AI Quality Check
                </div>
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-start p-2 bg-green-50 rounded-md">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <CheckSquare size={12} className="text-green-600" />
                  </div>
                  <div className="text-sm text-green-800">
                    <strong>Good length</strong> - Email is concise and focused ({activeTemplate.body.split(/\s+/).length} words)
                  </div>
                </div>
                
                <div className="flex items-start p-2 bg-green-50 rounded-md">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <CheckSquare size={12} className="text-green-600" />
                  </div>
                  <div className="text-sm text-green-800">
                    <strong>Clear call-to-action</strong> - Request for 15-minute call is specific
                  </div>
                </div>
                
                <div className="flex items-start p-2 bg-green-50 rounded-md">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <CheckSquare size={12} className="text-green-600" />
                  </div>
                  <div className="text-sm text-green-800">
                    <strong>Strong security focus</strong> - Emphasizes container security and compliance benefits
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<Users size={16} />}
                onClick={() => setShowRecipientSelector(true)}
              >
                Select Recipients {selectedRecipients.length > 0 && `(${selectedRecipients.length})`}
              </Button>
              
              <Button
                variant="primary"
                icon={<Calendar size={16} />}
                onClick={addTemplateToSequence}
                disabled={selectedRecipients.length === 0}
              >
                Add to Sequence
              </Button>
            </div>

            {selectedRecipients.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  icon={<Send size={16} />}
                >
                  Send Test Email
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {showTemplateModal && (
        <TemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSave={handleSaveTemplateFromModal}
          template={editingTemplate}
          isEditing={!!editingTemplate}
        />
      )}

      {showNewTemplateModal && (
        <NewTemplateModal
          onClose={() => setShowNewTemplateModal(false)}
          onSave={handleSaveFromNewTemplateModal}
          template={editingTemplate}
          isEditing={!!editingTemplate}
        />
      )}
      
      {showRecipientSelector && renderRecipientSelector()}
      
      {showSequenceRedirect && renderSequenceRedirectModal()}
      
      <ChatModal 
        agentName="KnoxEngage Email Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'I can help you create engaging, personalized security-focused email templates that convert. Need help with subject lines, body content, or security messaging?',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};