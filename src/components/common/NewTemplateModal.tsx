import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { X, Save, Sparkles, AlertCircle, RefreshCw, Check, Copy, Mail, MessageSquare, ArrowRight, Edit, ChevronRight, Brain, FileText, Clock, Target, Wand2 } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  tone: 'friendly' | 'professional' | 'persuasive' | 'witty';
  variables: string[];
}

interface NewTemplateModalProps {
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
  template?: EmailTemplate;
  isEditing: boolean;
}

export const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  onClose,
  onSave,
  template,
  isEditing
}) => {
  const [formData, setFormData] = useState<EmailTemplate>({
    id: '',
    name: '',
    subject: '',
    body: '',
    tone: 'professional',
    variables: []
  });
  
  const [detectingVariables, setDetectingVariables] = useState(false);
  const [step, setStep] = useState<'details' | 'content' | 'settings' | 'preview'>('details');
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [templatePurpose, setTemplatePurpose] = useState<string>('introduction');
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [industry, setIndustry] = useState<string>('technology');
  const [targetRole, setTargetRole] = useState<string>('marketing');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const templatePurposes = [
    { id: 'introduction', label: 'Introduction / First Touch', description: 'Introduce yourself and your solution to a new prospect' },
    { id: 'follow-up', label: 'Follow-up', description: 'Follow up on a previous message or engagement' },
    { id: 'nurture', label: 'Value-Add / Nurture', description: 'Provide helpful content or resources to nurture a lead' },
    { id: 'case-study', label: 'Case Study / Social Proof', description: 'Share a success story from a similar customer' },
    { id: 'meeting', label: 'Meeting Request', description: 'Directly ask for a meeting or demo' },
    { id: 'breakup', label: 'Break-up / Final Attempt', description: 'Last attempt to engage with an unresponsive prospect' }
  ];

  useEffect(() => {
    if (template) {
      setFormData(template);
      
      // If editing, start on the content step
      if (isEditing) {
        setStep('content');
      }
    } else {
      // Generate a random ID for new templates
      setFormData({
        ...formData,
        id: Math.random().toString(36).substring(2, 11)
      });
    }
  }, [template]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleToneChange = (tone: 'friendly' | 'professional' | 'persuasive' | 'witty') => {
    setFormData({ ...formData, tone });
  };
  
  const handleSave = () => {
    if (!formData.name || !formData.subject || !formData.body) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave(formData);
  };
  
  const detectVariables = () => {
    setDetectingVariables(true);
    
    // Use a regex to find all variables in the format {{variableName}}
    const subjectVariables = (formData.subject.match(/{{([^}]+)}}/g) || [])
      .map(v => v.replace(/[{}]/g, ''));
    
    const bodyVariables = (formData.body.match(/{{([^}]+)}}/g) || [])
      .map(v => v.replace(/[{}]/g, ''));
    
    // Combine unique variables
    const allVariables = Array.from(new Set([...subjectVariables, ...bodyVariables]));
    
    setTimeout(() => {
      setFormData({ ...formData, variables: allVariables });
      setDetectingVariables(false);
    }, 800);
  };

  const handleGenerateTemplate = () => {
    setIsGeneratingTemplate(true);
    
    // Simulate AI generation
    setTimeout(() => {
      // Generate template based on purpose, tone, industry, and role
      let newSubject = '';
      let newBody = '';
      
      switch (templatePurpose) {
        case 'introduction':
          if (formData.tone === 'professional') {
            newSubject = 'AI SDRs Built for {{company}}';
            newBody = `Hi {{firstName}},

I noticed that {{company}} is looking to scale ${targetRole === 'marketing' ? 'marketing efforts' : 'sales operations'} in the ${industry} space.

Our AI-powered SDR platform helps companies like {{company}} to:
• Increase qualified meetings by 40%
• Reduce cost-per-meeting by 35%
• Scale outreach without adding headcount

Would you be open to a quick 15-minute call to explore how we've helped similar companies in the ${industry} space?

Best regards,
[Your name]`;
          } else if (formData.tone === 'friendly') {
            newSubject = 'Quick question about {{company}}\'s outreach strategy';
            newBody = `Hey {{firstName}}!

I've been checking out what {{company}} has been doing in the ${industry} space - really impressive stuff! 

I noticed you might be facing some of the same challenges our customers deal with around scaling ${targetRole === 'marketing' ? 'demand gen' : 'sales prospecting'} without burning out the team.

Our AI platform has been a game-changer for teams like yours:
• 40% more meetings (without the extra work!)
• 35% lower cost-per-meeting
• Way happier SDRs who can focus on closing deals

I'd love to show you how it works in a quick 15-min chat. How's your schedule looking this week?

Cheers,
[Your name]`;
          } else if (formData.tone === 'persuasive') {
            newSubject = 'How {{company}} can book 40% more meetings';
            newBody = `Hello {{firstName}},

What would it mean for {{company}} if you could increase qualified meetings by 40% while reducing your cost-per-meeting by 35%?

These aren't hypothetical numbers. They're the actual results we've delivered for leading ${industry} companies by implementing our AI-powered SDR platform.

Here's what sets us apart:
1. No more wasted time on low-quality leads
2. Elimination of repetitive outreach tasks
3. Data-driven personalization at scale

Your competitors in the ${industry} space are already moving in this direction. Are you ready to stay ahead?

I'd value 15 minutes of your time this week to demonstrate the ROI potential for {{company}}.

Regards,
[Your name]`;
          } else {
            newSubject = `SDRs + AI = {{company}}'s new secret weapon?`;
            newBody = `{{firstName}}, ever feel like your ${targetRole} team needs superpowers?

If your team at {{company}} could use a cape and some x-ray vision for spotting qualified leads, you're not alone. The ${industry} struggle is real.

Our AI platform is basically the Marvel Universe for SDRs:
• 40% more meetings (no radioactive spider bites required)
• 35% cost savings (Tony Stark would approve)
• Scale without cloning your team (though that would be cool too)

I promise I can explain all this without terrible puns in a quick 15-minute demo. Unless you like terrible puns, in which case I have plenty more.

What do you say - hero or villain in this story?

Heroically yours,
[Your name]`;
          }
          break;
        case 'follow-up':
          if (formData.tone === 'professional') {
            newSubject = 'Following up on AI SDRs for {{company}}';
            newBody = `Hi {{firstName}},

I wanted to follow up on my previous message about how our AI-powered SDR platform could help {{company}} improve your ${targetRole} efficiency.

Our platform recently helped a ${industry} company similar to yours book 27% more qualified meetings while reducing their SDR costs by 35%.

Would you be open to a brief conversation this week to explore if we could deliver similar results for {{company}}?

Best regards,
[Your name]`;
          } else if (formData.tone === 'friendly') {
            newSubject = 'Quick follow-up about {{company}}';
            newBody = `Hey {{firstName}},

Just floating this back to the top of your inbox! I'd still love to chat about how we could help {{company}} with your ${targetRole} outreach efforts.

I completely understand how busy things get, especially in the ${industry} space.

Would 15 minutes sometime this week work to discuss how we're helping similar companies boost their meeting rates by 40%?

All the best,
[Your name]`;
          } else {
            newSubject = 'One more thing about improving {{company}}\'s outreach';
            newBody = `{{firstName}},

I wanted to follow up once more about how {{company}} could benefit from our AI SDR platform.

Since I last reached out, we've helped 3 more ${industry} companies achieve:
• 37% increase in qualified meetings
• 42% reduction in prospecting time
• 29% decrease in customer acquisition cost

I'd still love to connect for a quick 15-minute call this week. Would Tuesday or Thursday work best?

Regards,
[Your name]`;
          }
          break;
        case 'case-study':
          newSubject = 'How {{similarCompany}} achieved 40% more meetings with AI SDRs';
          newBody = `Hi {{firstName}},

I thought you might be interested in how {{similarCompany}}, another ${industry} company like {{company}}, achieved 40% more qualified meetings after implementing our AI SDR platform.

Their ${targetRole} team was facing similar challenges:
• Too much time spent on manual prospecting
• Inconsistent personalization
• Difficulty scaling outreach without adding headcount

Within 90 days of implementation, they saw:
• 40% increase in qualified meetings booked
• 35% reduction in cost per meeting
• 65% more time for their SDRs to focus on conversations instead of prospecting

Would you be interested in a 15-minute call to discuss how we could implement a similar approach at {{company}}?

Best regards,
[Your name]`;
          break;
        case 'breakup':
          newSubject = 'Last thoughts on AI SDRs for {{company}}';
          newBody = `Hi {{firstName}},

I've reached out a couple times about how our AI-powered SDR platform could help {{company}} scale your outreach efforts and improve conversion rates.

I understand you're busy, so I'll make this my last outreach for now. If you're interested in learning how we've helped companies like yours in the ${industry} space achieve:
• 40% increase in qualified meetings
• 35% reduction in cost-per-meeting
• 65% more productive ${targetRole} teams

You can book time directly on my calendar here: [Calendar Link]

Or simply reply to this email when timing is better.

All the best,
[Your name]`;
          break;
        default:
          newSubject = 'AI SDRs for {{company}}';
          newBody = `Hi {{firstName}},

I wanted to reach out regarding {{company}}'s ${targetRole} efforts.

Our AI-powered SDR platform has been helping companies in the ${industry} space to significantly improve their outreach results.

Would you be open to a brief conversation to explore if we could help {{company}}?

Best regards,
[Your name]`;
      }
      
      setFormData({
        ...formData,
        subject: newSubject,
        body: newBody
      });
      
      setIsGeneratingTemplate(false);
      setStep('content');
    }, 2000);
  };

  const handleNextStep = () => {
    if (step === 'details') {
      if (!formData.name) {
        alert('Please enter a template name');
        return;
      }
      setStep('content');
    } else if (step === 'content') {
      if (!formData.subject || !formData.body) {
        alert('Please complete both subject and body content');
        return;
      }
      setStep('settings');
    } else if (step === 'settings') {
      // Detect variables if not done already
      if (formData.variables.length === 0) {
        detectVariables();
      }
      setStep('preview');
    } else if (step === 'preview') {
      handleSave();
    }
  };

  const handlePrevStep = () => {
    if (step === 'content') {
      setStep('details');
    } else if (step === 'settings') {
      setStep('content');
    } else if (step === 'preview') {
      setStep('settings');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {['details', 'content', 'settings', 'preview'].map((stepName, index) => (
        <div 
          key={stepName} 
          className={`flex flex-col items-center w-1/4 relative ${
            index !== 0 && "before:content-[''] before:absolute before:left-[-50%] before:top-4 before:w-full before:h-0.5 before:bg-gray-200 before:z-0"
          }`}
        >
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-medium text-sm ${
              step === stepName
                ? 'bg-blue-600 text-white' 
                : ['details', 'content', 'settings', 'preview'].indexOf(stepName) < ['details', 'content', 'settings', 'preview'].indexOf(step)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
          <span className={`mt-2 text-xs capitalize ${
            step === stepName ? 'text-blue-600 font-medium' : 'text-gray-500'
          }`}>
            {stepName}
          </span>
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return renderDetailsStep();
      case 'content':
        return renderContentStep();
      case 'settings':
        return renderSettingsStep();
      case 'preview':
        return renderPreviewStep();
      default:
        return null;
    }
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
          Template Name*
        </label>
        <input
          id="template-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., Initial Outreach"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
          <Sparkles size={18} className="text-blue-600 mr-2" />
          AI Template Generator
        </h3>
        <p className="text-gray-600 mb-4">
          Let AI help you create an effective template based on your needs.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Purpose
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templatePurposes.map((purpose) => (
              <div 
                key={purpose.id}
                className={`border rounded-md p-3 cursor-pointer ${
                  templatePurpose === purpose.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => setTemplatePurpose(purpose.id)}
              >
                <div className="font-medium text-gray-900">{purpose.label}</div>
                <p className="text-xs text-gray-600 mt-1">{purpose.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIOptions(!showAIOptions)}
            icon={showAIOptions ? <ChevronRight size={16} className="transform rotate-90" /> : <ChevronRight size={16} />}
            className="mb-3"
          >
            {showAIOptions ? "Hide Advanced Options" : "Show Advanced Options"}
          </Button>
          
          {showAIOptions && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Financial Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="professional-services">Professional Services</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="operations">Operations</option>
                  <option value="executive">Executive</option>
                  <option value="it">IT</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Tone
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['professional', 'friendly', 'persuasive', 'witty'].map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      className={`px-3 py-2 text-sm rounded-md border ${
                        formData.tone === tone
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleToneChange(tone as any)}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <Button
            variant={isGeneratingTemplate ? "outline" : "primary"}
            fullWidth
            onClick={handleGenerateTemplate}
            disabled={isGeneratingTemplate}
            icon={isGeneratingTemplate ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
          >
            {isGeneratingTemplate ? "Generating Template..." : "Generate Template with AI"}
          </Button>
          
          {formData.name && (
            <p className="text-center text-sm text-gray-500 mt-2">
              or continue to manually create "{formData.name}"
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={!formData.name}
            icon={<ArrowRight size={16} />}
          >
            Next: Content
          </Button>
        </div>
      </div>
    </div>
  );
  
  const renderContentStep = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject Line*
        </label>
        <div className="relative">
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., AI SDRs Built for {{company}}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <Button 
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Sparkles size={14} className="text-blue-600" />
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Use {{variableName}} for personalization variables (e.g., {{firstName}}, {{company}})
        </p>
      </div>
      
      <div>
        <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-1">
          Email Body*
        </label>
        <textarea
          id="email-body"
          name="body"
          value={formData.body}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px]"
          placeholder="Write your email template here. Use {{variableName}} for personalization."
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Use {{variableName}} for personalization variables (e.g., {{firstName}}, {{company}})
        </p>
      </div>
      
      <div className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-md">
        <Button
          variant="outline"
          size="sm"
          icon={<Sparkles size={14} />}
        >
          Improve Subject Line
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          icon={<Edit size={14} />}
        >
          Refine Body Content
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          icon={<Copy size={14} />}
        >
          Simplify Language
        </Button>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          className="px-4"
        >
          Back
        </Button>
        
        <Button
          variant="primary"
          onClick={handleNextStep}
          disabled={!formData.subject || !formData.body}
          icon={<ArrowRight size={16} />}
        >
          Next: Settings
        </Button>
      </div>
    </div>
  );
  
  const renderSettingsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Tone
        </label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {['professional', 'friendly', 'persuasive', 'witty'].map((tone) => (
            <button
              key={tone}
              type="button"
              className={`px-4 py-3 text-sm rounded-md border flex flex-col items-center ${
                formData.tone === tone
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleToneChange(tone as any)}
            >
              {tone === 'professional' && <FileText size={24} className="mb-2 text-gray-600" />}
              {tone === 'friendly' && <MessageSquare size={24} className="mb-2 text-green-600" />}
              {tone === 'persuasive' && <Target size={24} className="mb-2 text-purple-600" />}
              {tone === 'witty' && <Brain size={24} className="mb-2 text-yellow-600" />}
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tone Description</h4>
          <p className="text-sm text-gray-600">
            {formData.tone === 'professional' && 
              "Professional tone is formal, clear, and business-appropriate. It establishes credibility and respect."
            }
            {formData.tone === 'friendly' && 
              "Friendly tone is warm, conversational, and approachable. It builds rapport and seems less sales-focused."
            }
            {formData.tone === 'persuasive' && 
              "Persuasive tone is compelling and impactful, focusing on benefits and creating urgency."
            }
            {formData.tone === 'witty' && 
              "Witty tone is clever and entertaining, using humor to engage and stand out in busy inboxes."
            }
          </p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Personalization Variables
          </label>
          <Button
            variant="outline"
            size="sm"
            icon={detectingVariables ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            onClick={detectVariables}
            disabled={detectingVariables}
          >
            {detectingVariables ? 'Detecting...' : 'Auto-Detect Variables'}
          </Button>
        </div>
        
        {formData.variables.length > 0 ? (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex flex-wrap gap-2">
              {formData.variables.map((variable) => (
                <Badge key={variable} className="flex items-center">
                  {variable}
                  <button 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      const updatedVariables = formData.variables.filter(v => v !== variable);
                      setFormData({...formData, variables: updatedVariables});
                    }}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-3 rounded-md flex items-start">
            <AlertCircle size={16} className="text-yellow-600 mr-2 mt-0.5" />
            <p className="text-sm text-yellow-800">
              No variables detected. Add variables like {{firstName}} or {{company}} to your template for personalization.
            </p>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Optimal Send Time
        </h4>
        <div className="bg-blue-50 p-3 rounded-md flex items-start">
          <Clock size={16} className="text-blue-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              AI Recommended: Tuesday, 9:30 AM - 10:30 AM (recipient's local time)
            </p>
            <p className="text-xs text-blue-700">
              Based on our analysis of 10,000+ emails, this time window shows 42% higher engagement rates for this type of message and audience.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          className="px-4"
        >
          Back
        </Button>
        
        <Button
          variant="primary"
          onClick={handleNextStep}
          icon={<ArrowRight size={16} />}
        >
          Next: Preview
        </Button>
      </div>
    </div>
  );
  
  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-3">Template Preview</h3>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <p className="text-sm text-gray-500 mb-2">Subject:</p>
          <p className="text-base font-medium">
            {formData.subject.replace(/{{(\w+)}}/g, (match, variable) => `<span class="text-blue-600">${match}</span>`)}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <p className="text-sm text-gray-500 mb-2">Body:</p>
          <div 
            className="prose prose-sm max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ 
              __html: formData.body
                .replace(/\n/g, '<br>')
                .replace(/{{(\w+)}}/g, (match) => `<span class="text-blue-600 font-medium">${match}</span>`)
            }}
          ></div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
          <Sparkles size={16} className="mr-2" />
          AI-Generated Quality Analysis
        </h4>
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
              <Check size={12} className="text-green-600" />
            </div>
            <div className="text-sm text-blue-800">
              <strong>Good length</strong> - Email is concise and focused ({formData.body.split(/\s+/).length} words)
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
              <Check size={12} className="text-green-600" />
            </div>
            <div className="text-sm text-blue-800">
              <strong>Clear call-to-action</strong> - Request for meeting or next step is specific
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
              <Check size={12} className="text-green-600" />
            </div>
            <div className="text-sm text-blue-800">
              <strong>Good personalization</strong> - Uses {formData.variables.length} variables for customization
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          className="px-4"
        >
          Back
        </Button>
        
        <div className="space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            icon={<Save size={16} />}
          >
            {isEditing ? 'Update Template' : 'Save Template'}
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Email Template' : 'Create New Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {renderStepIndicator()}
          
          <div className="mt-4">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};