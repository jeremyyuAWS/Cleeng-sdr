import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import { Calendar } from '../common/Calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  ArrowDown, 
  ArrowUp, 
  Mail, 
  Sparkles,
  Phone,
  MessageSquare,
  CheckSquare,
  Zap,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  PenTool,
  Save,
  FileText,
  X,
  User
} from 'lucide-react';

interface SequenceStep {
  id: string;
  type: 'email' | 'task' | 'linkedin';
  name: string;
  delayDays: number;
  time?: string;
  templateId?: string;
  templateName?: string;
  status?: 'active' | 'draft' | 'paused';
  usesSmartSendTime?: boolean;
  taskDescription?: string;
}

interface SequenceTemplateProps {
  id: string;
  name: string;
  description: string;
  steps: SequenceStep[];
  status: 'active' | 'draft' | 'paused';
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview: string;
}

export const SequenceScheduler: React.FC = () => {
  const [sequences, setSequences] = useState<SequenceTemplateProps[]>([]);
  const [activeSequence, setActiveSequence] = useState<string | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepType, setNewStepType] = useState<'email' | 'task' | 'linkedin'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [sequenceToEdit, setSequenceToEdit] = useState<SequenceTemplateProps | null>(null);
  const [sequenceName, setSequenceName] = useState<string>('');
  const [sequenceDescription, setSequenceDescription] = useState<string>('');
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [lastAddedStepIndex, setLastAddedStepIndex] = useState<number>(-1);
  const [isSmartSendTimeEnabled, setIsSmartSendTimeEnabled] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Sample sequences
      const sampleSequences: SequenceTemplateProps[] = [
        {
          id: 'seq-1',
          name: 'B2B SaaS Outreach',
          description: 'Standard 4-step sequence for SaaS prospects',
          status: 'active',
          steps: [
            {
              id: 'step-1-1',
              type: 'email',
              name: 'Initial Outreach',
              delayDays: 0,
              time: '9:30 AM',
              templateId: 'template-1',
              templateName: 'Initial Outreach',
              usesSmartSendTime: true
            },
            {
              id: 'step-1-2',
              type: 'email',
              name: 'Follow-up Email',
              delayDays: 3,
              time: '10:00 AM',
              templateId: 'template-2',
              templateName: 'Follow-up Email',
              usesSmartSendTime: true
            },
            {
              id: 'step-1-3',
              type: 'linkedin',
              name: 'LinkedIn Connection',
              delayDays: 2,
              usesSmartSendTime: false
            },
            {
              id: 'step-1-4',
              type: 'email',
              name: 'Final Outreach',
              delayDays: 5,
              time: '11:00 AM',
              templateId: 'template-4',
              templateName: 'Final Outreach',
              usesSmartSendTime: true
            }
          ]
        },
        {
          id: 'seq-2',
          name: 'Enterprise Decision Makers',
          description: 'High-touch sequence for C-suite executives',
          status: 'draft',
          steps: [
            {
              id: 'step-2-1',
              type: 'email',
              name: 'Personalized Introduction',
              delayDays: 0,
              time: '8:00 AM',
              templateId: 'template-8',
              templateName: 'Personalized Research Intro',
              usesSmartSendTime: true
            },
            {
              id: 'step-2-2',
              type: 'task',
              name: 'Research on LinkedIn',
              delayDays: 1,
              taskDescription: 'Research recent posts and activities to personalize next outreach',
              usesSmartSendTime: false
            },
            {
              id: 'step-2-3',
              type: 'email',
              name: 'Case Study Share',
              delayDays: 3,
              time: '2:00 PM',
              templateId: 'template-3',
              templateName: 'Case Study Share',
              usesSmartSendTime: true
            },
            {
              id: 'step-2-4',
              type: 'phone',
              name: 'Phone Call',
              delayDays: 2,
              usesSmartSendTime: false
            },
            {
              id: 'step-2-5',
              type: 'email',
              name: 'Final Outreach',
              delayDays: 4,
              time: '9:00 AM',
              templateId: 'template-4',
              templateName: 'Final Outreach',
              usesSmartSendTime: true
            }
          ]
        }
      ];

      // Sample email templates (simplified from the full list)
      const sampleTemplates: EmailTemplate[] = [
        {
          id: 'template-1',
          name: 'Initial Outreach',
          subject: 'AI SDRs Built for {{company}}',
          preview: 'I noticed {{company}}\'s recent focus on scaling your sales pipeline...'
        },
        {
          id: 'template-2',
          name: 'Follow-up Email',
          subject: 'Following up on AI SDRs for {{company}}',
          preview: 'I wanted to quickly follow up on my previous email about how our AI-powered SDR platform...'
        },
        {
          id: 'template-3',
          name: 'Case Study Share',
          subject: 'How {{similarCompany}} achieved 40% more meetings with AI SDRs',
          preview: 'I thought you might be interested in how {{similarCompany}}, another {{industry}} company like {{company}}...'
        },
        {
          id: 'template-4',
          name: 'Final Outreach',
          subject: 'Last thoughts on AI SDRs for {{company}}',
          preview: 'I\'ve reached out a couple times about how our AI-powered SDR platform could help {{company}}...'
        },
        {
          id: 'template-5',
          name: 'Pain Point Focus',
          subject: 'Solving {{painPoint}} for {{company}}',
          preview: 'I\'ve been researching {{company}} and noticed you might be facing challenges with {{painPoint}}...'
        }
      ];

      setSequences(sampleSequences);
      setEmailTemplates(sampleTemplates);
      setActiveSequence(sampleSequences[0].id);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDateSelected = (date: Date, timeSlot: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
  };

  const getActiveSequence = () => {
    if (!activeSequence) return null;
    return sequences.find(seq => seq.id === activeSequence) || null;
  };

  const handleAddStep = () => {
    if (!activeSequence) return;
    
    const sequence = sequences.find(seq => seq.id === activeSequence);
    if (!sequence) return;
    
    const newStepId = `step-${sequence.id}-${Date.now()}`;
    
    const newStep: SequenceStep = {
      id: newStepId,
      type: newStepType,
      name: newStepType === 'email' 
        ? emailTemplates.find(t => t.id === selectedTemplate)?.name || 'New Email' 
        : newStepType === 'task'
          ? 'New Task'
          : 'LinkedIn Outreach',
      delayDays: sequence.steps.length > 0 ? 3 : 0, // Default to 3 days after previous step, or 0 if first step
      usesSmartSendTime: isSmartSendTimeEnabled
    };
    
    // Add type-specific properties
    if (newStepType === 'email' && selectedTemplate) {
      newStep.templateId = selectedTemplate;
      newStep.templateName = emailTemplates.find(t => t.id === selectedTemplate)?.name;
      newStep.time = selectedTimeSlot || '9:00 AM';
    } else if (newStepType === 'task' && taskDescription) {
      newStep.taskDescription = taskDescription;
    }
    
    const updatedSequence = {
      ...sequence,
      steps: [...sequence.steps, newStep]
    };
    
    setSequences(sequences.map(seq => 
      seq.id === activeSequence ? updatedSequence : seq
    ));
    
    setLastAddedStepIndex(updatedSequence.steps.length - 1);
    setShowAddStep(false);
    setSelectedTemplate('');
    setTaskDescription('');
  };

  const handleRemoveStep = (stepId: string) => {
    const sequence = sequences.find(seq => seq.id === activeSequence);
    if (!sequence) return;
    
    const updatedSteps = sequence.steps.filter(step => step.id !== stepId);
    
    const updatedSequence = {
      ...sequence,
      steps: updatedSteps
    };
    
    setSequences(sequences.map(seq => 
      seq.id === activeSequence ? updatedSequence : seq
    ));
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const sequence = sequences.find(seq => seq.id === activeSequence);
    if (!sequence) return;
    
    const stepIndex = sequence.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;
    
    if (direction === 'up' && stepIndex === 0) return;
    if (direction === 'down' && stepIndex === sequence.steps.length - 1) return;
    
    const updatedSteps = [...sequence.steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    
    // Swap the steps
    [updatedSteps[stepIndex], updatedSteps[targetIndex]] = 
      [updatedSteps[targetIndex], updatedSteps[stepIndex]];
    
    const updatedSequence = {
      ...sequence,
      steps: updatedSteps
    };
    
    setSequences(sequences.map(seq => 
      seq.id === activeSequence ? updatedSequence : seq
    ));
  };

  const handleToggleSmartSendTime = (stepId: string) => {
    const sequence = sequences.find(seq => seq.id === activeSequence);
    if (!sequence) return;
    
    const updatedSteps = sequence.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          usesSmartSendTime: !step.usesSmartSendTime
        };
      }
      return step;
    });
    
    const updatedSequence = {
      ...sequence,
      steps: updatedSteps
    };
    
    setSequences(sequences.map(seq => 
      seq.id === activeSequence ? updatedSequence : seq
    ));
  };

  const handleCreateSequence = () => {
    const newSequence: SequenceTemplateProps = {
      id: `seq-${Date.now()}`,
      name: sequenceName || 'New Sequence',
      description: sequenceDescription || 'Sequence description',
      status: 'draft',
      steps: []
    };
    
    setSequences([...sequences, newSequence]);
    setActiveSequence(newSequence.id);
    setIsCreateMode(false);
    setSequenceName('');
    setSequenceDescription('');
  };

  const handleSaveSequence = () => {
    if (!sequenceToEdit) return;
    
    const updatedSequence = {
      ...sequenceToEdit,
      name: sequenceName || sequenceToEdit.name,
      description: sequenceDescription || sequenceToEdit.description
    };
    
    setSequences(sequences.map(seq => 
      seq.id === sequenceToEdit.id ? updatedSequence : seq
    ));
    
    setSequenceToEdit(null);
    setSequenceName('');
    setSequenceDescription('');
  };

  const handleEditSequence = (sequenceId: string) => {
    const sequence = sequences.find(seq => seq.id === sequenceId);
    if (!sequence) return;
    
    setSequenceToEdit(sequence);
    setSequenceName(sequence.name);
    setSequenceDescription(sequence.description);
  };

  const handleActivateSequence = (sequenceId: string) => {
    setSequences(sequences.map(seq => ({
      ...seq,
      status: seq.id === sequenceId ? 'active' : seq.status
    })));
  };

  const handlePauseSequence = (sequenceId: string) => {
    setSequences(sequences.map(seq => ({
      ...seq,
      status: seq.id === sequenceId ? 'paused' : seq.status
    })));
  };

  const getStepIcon = (type: string) => {
    switch(type) {
      case 'email': 
        return <Mail size={16} className="text-blue-600" />;
      case 'task':
        return <CheckSquare size={16} className="text-green-600" />;
      case 'linkedin':
        return <MessageSquare size={16} className="text-purple-600" />;
      case 'phone':
        return <Phone size={16} className="text-yellow-600" />;
      default:
        return <Mail size={16} />;
    }
  };

  const renderSequenceEditor = () => {
    const sequence = getActiveSequence();
    
    if (!sequence) {
      return (
        <div className="text-center py-12">
          <div className="mb-4">
            <CalendarIcon size={48} className="text-gray-300 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sequence Selected</h3>
          <p className="text-gray-500 mb-6">Select a sequence from the sidebar or create a new one</p>
          <Button 
            variant="primary"
            onClick={() => {
              setIsCreateMode(true);
              setSequenceName('');
              setSequenceDescription('');
            }}
            icon={<Plus size={16} />}
          >
            Create New Sequence
          </Button>
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{sequence.name}</h3>
            <p className="text-gray-600">{sequence.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<PenTool size={14} />}
              onClick={() => handleEditSequence(sequence.id)}
            >
              Edit Details
            </Button>
            {sequence.status === 'draft' || sequence.status === 'paused' ? (
              <Button
                variant="primary"
                size="sm"
                icon={<Play size={14} />}
                onClick={() => handleActivateSequence(sequence.id)}
              >
                {sequence.status === 'draft' ? 'Activate' : 'Resume'}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                icon={<Pause size={14} />}
                onClick={() => handlePauseSequence(sequence.id)}
              >
                Pause
              </Button>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-700">Sequence Steps</h4>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setShowAddStep(true)}
            >
              Add Step
            </Button>
          </div>
          
          {sequence.steps.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <div className="mb-4">
                <Plus size={32} className="text-gray-400 mx-auto" />
              </div>
              <p className="text-gray-700 mb-2">No steps added yet</p>
              <p className="text-sm text-gray-500 mb-4">Add your first step to get started</p>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setShowAddStep(true)}
              >
                Add First Step
              </Button>
            </div>
          ) : (
            <div className="relative pb-6">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200" aria-hidden="true"></div>
              
              <div className="space-y-6">
                {sequence.steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`relative pl-14 ${lastAddedStepIndex === index ? 'animate-pulse bg-blue-50 p-4 rounded-lg' : ''}`}
                  >
                    {/* Step number circle */}
                    <div className="absolute left-0 top-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        {getStepIcon(step.type)}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="mb-3">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{step.name}</h4>
                            <Badge className="ml-2">{step.type}</Badge>
                            {index === 0 && <Badge variant="success" className="ml-2">First Touch</Badge>}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            {index === 0 ? (
                              <>
                                <Clock size={14} className="mr-1" />
                                <span>Day 1</span>
                                {selectedDate && selectedTimeSlot ? (
                                  <div className="flex items-center ml-4 text-blue-600">
                                    <CalendarIcon size={14} className="mr-1" />
                                    <span>
                                      {selectedDate.toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}, {selectedTimeSlot}
                                    </span>
                                  </div>
                                ) : step.time ? (
                                  <div className="flex items-center ml-4">
                                    <CalendarIcon size={14} className="mr-1" />
                                    <span>{step.time}</span>
                                  </div>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <Clock size={14} className="mr-1" />
                                <span>+{step.delayDays} days after previous step</span>
                                {step.time && (
                                  <div className="flex items-center ml-4">
                                    <CalendarIcon size={14} className="mr-1" />
                                    <span>{step.time}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          {index > 0 && (
                            <button 
                              className="p-1 text-gray-400 hover:text-gray-600"
                              onClick={() => handleMoveStep(step.id, 'up')}
                            >
                              <ArrowUp size={14} />
                            </button>
                          )}
                          {index < sequence.steps.length - 1 && (
                            <button 
                              className="p-1 text-gray-400 hover:text-gray-600"
                              onClick={() => handleMoveStep(step.id, 'down')}
                            >
                              <ArrowDown size={14} />
                            </button>
                          )}
                          <button 
                            className="p-1 text-gray-400 hover:text-red-600"
                            onClick={() => handleRemoveStep(step.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {step.type === 'email' && step.templateId && (
                        <div className="mb-3">
                          <div className="flex items-center text-sm text-gray-700">
                            <FileText size={14} className="mr-1 text-gray-500" />
                            <span className="font-medium">Template:</span>
                            <span className="ml-1">{step.templateName}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {emailTemplates.find(t => t.id === step.templateId)?.preview}
                          </p>
                        </div>
                      )}
                      
                      {step.type === 'task' && step.taskDescription && (
                        <div className="mb-3">
                          <div className="flex items-center text-sm text-gray-700 mb-1">
                            <CheckSquare size={14} className="mr-1 text-gray-500" />
                            <span className="font-medium">Task:</span>
                          </div>
                          <p className="text-sm text-gray-600">{step.taskDescription}</p>
                        </div>
                      )}
                      
                      {step.type === 'email' && (
                        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`smart-send-${step.id}`}
                              checked={step.usesSmartSendTime}
                              onChange={() => handleToggleSmartSendTime(step.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`smart-send-${step.id}`} className="ml-2 text-xs text-gray-700 flex items-center">
                              <Zap size={12} className="text-blue-500 mr-1" />
                              Smart Send-Time AI
                            </label>
                          </div>
                          {step.usesSmartSendTime && (
                            <div className="ml-auto">
                              <Badge variant="info" className="text-xs">
                                Optimized for Response
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {showAddStep && (
            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-medium text-gray-900">Add New Step</h4>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<X size={14} />}
                  onClick={() => setShowAddStep(false)}
                >
                  Cancel
                </Button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className={`px-3 py-2 rounded-md border flex flex-col items-center ${
                      newStepType === 'email' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300'
                    }`}
                    onClick={() => setNewStepType('email')}
                  >
                    <Mail size={20} className={newStepType === 'email' ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="mt-1 text-sm">Email</span>
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md border flex flex-col items-center ${
                      newStepType === 'linkedin' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300'
                    }`}
                    onClick={() => setNewStepType('linkedin')}
                  >
                    <MessageSquare size={20} className={newStepType === 'linkedin' ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="mt-1 text-sm">LinkedIn</span>
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md border flex flex-col items-center ${
                      newStepType === 'task' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300'
                    }`}
                    onClick={() => setNewStepType('task')}
                  >
                    <CheckSquare size={20} className={newStepType === 'task' ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="mt-1 text-sm">Manual Task</span>
                  </button>
                </div>
              </div>
              
              {newStepType === 'email' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a template</option>
                    {emailTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  
                  {selectedTemplate && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Template Preview</h5>
                      <p className="text-sm text-gray-600">{emailTemplates.find(t => t.id === selectedTemplate)?.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">{emailTemplates.find(t => t.id === selectedTemplate)?.preview}</p>
                    </div>
                  )}
                </div>
              )}
              
              {newStepType === 'task' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description
                  </label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the manual task to be completed..."
                  ></textarea>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timing
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Send after</span>
                  <select
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3" selected>3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="10">10</option>
                    <option value="14">14</option>
                  </select>
                  <span className="text-sm text-gray-600 mx-2">days</span>
                  
                  {newStepType === 'email' && (
                    <div className="ml-auto flex items-center">
                      <input
                        type="checkbox"
                        id="smart-send-time"
                        checked={isSmartSendTimeEnabled}
                        onChange={() => setIsSmartSendTimeEnabled(!isSmartSendTimeEnabled)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="smart-send-time" className="ml-2 text-xs text-gray-700 flex items-center">
                        <Zap size={12} className="text-blue-500 mr-1" />
                        Smart Send-Time AI
                      </label>
                    </div>
                  )}
                </div>
                
                {isSmartSendTimeEnabled && newStepType === 'email' && (
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <Sparkles size={16} className="text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-xs text-blue-800 font-medium">
                          AI will automatically determine the best time to send based on:
                        </p>
                        <ul className="mt-1 text-xs text-blue-700 list-disc pl-4 space-y-1">
                          <li>Recipient's time zone and past engagement patterns</li>
                          <li>Industry-specific optimal timing data</li>
                          <li>Job role response time analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isSmartSendTimeEnabled && newStepType === 'email' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Send Time
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="8:00 AM">8:00 AM</option>
                      <option value="8:30 AM">8:30 AM</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="9:30 AM" selected>9:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  icon={<Plus size={16} />}
                  onClick={handleAddStep}
                  disabled={(newStepType === 'email' && !selectedTemplate) || (newStepType === 'task' && !taskDescription)}
                >
                  Add Step
                </Button>
              </div>
            </div>
          )}
          
          {sequence.steps.length > 0 && !showAddStep && (
            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => setShowAddStep(true)}
              >
                Add Another Step
              </Button>
            </div>
          )}
        </div>
        
        {sequence.steps.length > 0 && (
          <div className="mb-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-700">First Outreach Scheduling</h4>
              {selectedDate && selectedTimeSlot ? (
                <div className="flex items-center text-sm text-blue-600">
                  <CalendarIcon size={16} className="mr-2" />
                  Scheduled for: {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric' 
                  })} at {selectedTimeSlot}
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-3"
                    onClick={() => setShowCalendar(true)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  icon={<CalendarIcon size={16} />}
                  onClick={() => setShowCalendar(true)}
                >
                  Schedule Start Date
                </Button>
              )}
            </div>
            
            {showCalendar && (
              <div className="mb-6">
                <Calendar 
                  onDateSelected={handleDateSelected}
                  className="mb-4"
                />
                <div className="flex justify-end">
                  <Button 
                    variant="primary" 
                    onClick={() => setShowCalendar(false)}
                    disabled={!selectedDate || !selectedTimeSlot}
                  >
                    Confirm Schedule
                  </Button>
                </div>
              </div>
            )}
            
            {!showCalendar && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recipients</h4>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <Badge>From Lead Enrichment</Badge>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <User size={16} className="mr-2 text-gray-500" />
                      High-Priority Prospects (15 leads)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User size={16} className="mr-2 text-gray-500" />
                      Marketing Leaders (9 leads)
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    fullWidth
                  >
                    Manage Recipients
                  </Button>
                </Card>
                
                <Card className="bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Sequence Overview</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Steps:</span>
                      <span className="font-medium text-gray-900">{sequence.steps.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email Steps:</span>
                      <span className="font-medium text-gray-900">
                        {sequence.steps.filter(s => s.type === 'email').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Duration:</span>
                      <span className="font-medium text-gray-900">
                        {sequence.steps.reduce((total, step) => total + step.delayDays, 0)} days
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Smart Send-Time:</span>
                      <span className="font-medium text-gray-900">
                        {sequence.steps.filter(s => s.usesSmartSendTime).length > 0 ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={sequence.status === 'active' ? 'outline' : 'primary'}
                    fullWidth
                    icon={sequence.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    onClick={() => sequence.status === 'active' 
                      ? handlePauseSequence(sequence.id)
                      : handleActivateSequence(sequence.id)
                    }
                  >
                    {sequence.status === 'active' 
                      ? 'Pause Sequence' 
                      : sequence.status === 'paused'
                        ? 'Resume Sequence'
                        : 'Activate Sequence'
                    }
                  </Button>
                </Card>
              </div>
            )}
          </div>
        )}
        
        {sequence.steps.length > 0 && sequence.status === 'active' && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <Sparkles size={18} className="text-blue-600 mt-0.5 mr-2" />
              <div>
                <h5 className="text-sm font-medium text-blue-800 mb-1">AI Performance Insights</h5>
                <p className="text-sm text-blue-700">
                  Based on analysis of 5,000+ similar sequences, your current setup is projected to achieve:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-600">Open Rate</p>
                    <p className="text-sm font-bold text-blue-900">42%</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-600">Reply Rate</p>
                    <p className="text-sm font-bold text-blue-900">5.8%</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-600">Meeting Rate</p>
                    <p className="text-sm font-bold text-blue-900">1.9%</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-600">Bounce Rate</p>
                    <p className="text-sm font-bold text-blue-900">2.1%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render sequence edit/create modal
  const renderSequenceModal = () => {
    if (!sequenceToEdit && !isCreateMode) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {sequenceToEdit ? 'Edit Sequence' : 'Create New Sequence'}
            </h3>
            
            <div className="mb-4">
              <label htmlFor="sequence-name" className="block text-sm font-medium text-gray-700 mb-1">
                Sequence Name
              </label>
              <input
                id="sequence-name"
                type="text"
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., B2B Outreach Sequence"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="sequence-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="sequence-description"
                value={sequenceDescription}
                onChange={(e) => setSequenceDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Briefly describe the purpose of this sequence"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSequenceToEdit(null);
                  setIsCreateMode(false);
                  setSequenceName('');
                  setSequenceDescription('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Save size={16} />}
                onClick={sequenceToEdit ? handleSaveSequence : handleCreateSequence}
                disabled={!sequenceName}
              >
                {sequenceToEdit ? 'Save Changes' : 'Create Sequence'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sequence Scheduler</h2>
        <p className="text-gray-600">Build email sequences with optimal timing</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Sequences</h3>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => {
                  setIsCreateMode(true);
                  setSequenceName('');
                  setSequenceDescription('');
                }}
              >
                New
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : sequences.length === 0 ? (
              <div className="text-center py-6">
                <CalendarIcon size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No sequences created yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  icon={<Plus size={14} />}
                  onClick={() => {
                    setIsCreateMode(true);
                    setSequenceName('');
                    setSequenceDescription('');
                  }}
                >
                  Create Sequence
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {sequences.map(sequence => (
                  <button
                    key={sequence.id}
                    className={`w-full text-left p-3 rounded-md border ${
                      activeSequence === sequence.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveSequence(sequence.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{sequence.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{sequence.steps.length} steps</p>
                      </div>
                      <Badge 
                        variant={
                          sequence.status === 'active' 
                            ? 'success' 
                            : sequence.status === 'paused'
                              ? 'warning'
                              : 'default'
                        }
                      >
                        {sequence.status.charAt(0).toUpperCase() + sequence.status.slice(1)}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
          
          <Card title="Resources">
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-1">Sequence Best Practices</h4>
                <p className="text-xs text-gray-500 mb-2">Learn how to create high-converting sequences</p>
                <Badge className="text-xs">4 min read</Badge>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-1">Timing Optimization</h4>
                <p className="text-xs text-gray-500 mb-2">Discover optimal send times by industry</p>
                <Badge className="text-xs">6 min read</Badge>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-1">Template Library</h4>
                <p className="text-xs text-gray-500 mb-2">Browse our pre-built sequence templates</p>
                <Badge className="text-xs">12 templates</Badge>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            {renderSequenceEditor()}
          </Card>
        </div>
      </div>
      
      {/* Sequence Edit/Create Modal */}
      {renderSequenceModal()}
      
      <ChatModal 
        agentName="Jazon Sequence Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: "I can help you build effective email sequences. What kind of sequence would you like to create today?",
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};