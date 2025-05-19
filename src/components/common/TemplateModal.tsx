import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { X, Save, Sparkles, AlertCircle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  tone: 'friendly' | 'professional' | 'persuasive' | 'witty';
  variables: string[];
}

interface TemplateModalProps {
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
  template?: EmailTemplate;
  isEditing: boolean;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
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
  
  useEffect(() => {
    if (template) {
      setFormData(template);
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
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
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
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Line*
              </label>
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
              <p className="text-xs text-gray-500 mt-1">
                Use {{variableName}} for personalization variables (e.g., {{firstName}}, {{company}})
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
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
            
            <div>
              <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-1">
                Email Body*
              </label>
              <textarea
                id="email-body"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
                placeholder="Write your email template here. Use {{variableName}} for personalization."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {{variableName}} for personalization variables (e.g., {{firstName}}, {{company}})
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Personalization Variables
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Sparkles size={14} />}
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
                      <Badge key={variable}>{variable}</Badge>
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
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<Save size={16} />}
            onClick={handleSave}
            disabled={!formData.name || !formData.subject || !formData.body}
          >
            {isEditing ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  );
};