import React, { useState } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { X, Users, Target, Building, Globe, Filter, Sliders, Save, Check, Database, Briefcase } from 'lucide-react';

interface SegmentCreationModalProps {
  onClose: () => void;
  onSave: (segmentData: any) => void;
  initialData?: {
    name?: string;
    description?: string;
    criteria?: any;
  };
}

export const SegmentCreationModal: React.FC<SegmentCreationModalProps> = ({
  onClose,
  onSave,
  initialData = {}
}) => {
  const [segmentName, setSegmentName] = useState(initialData.name || '');
  const [segmentDescription, setSegmentDescription] = useState(initialData.description || '');
  const [minFitScore, setMinFitScore] = useState(initialData.criteria?.fitScore?.min || 7);
  const [maxFitScore, setMaxFitScore] = useState(initialData.criteria?.fitScore?.max || 10);
  const [autoEnrich, setAutoEnrich] = useState(false);
  
  // Targeting criteria
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialData.criteria?.roles || []);
  const [industry, setIndustry] = useState(initialData.criteria?.industry || '');
  const [geography, setGeography] = useState(initialData.criteria?.geography || '');
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>(
    initialData.criteria?.companySize || ['50-200', '201-500']
  );
  
  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '50-200', label: '50-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];
  
  const roleOptions = [
    'CEO', 'CMO', 'CRO', 'VP Marketing', 'VP Sales', 'Director of Marketing', 
    'Director of Sales', 'Marketing Manager', 'Demand Gen Manager', 'Growth Lead',
    'Head of Marketing', 'Head of Sales', 'Head of Growth'
  ];
  
  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };
  
  const handleCompanySizeToggle = (size: string) => {
    if (selectedCompanySizes.includes(size)) {
      setSelectedCompanySizes(selectedCompanySizes.filter(s => s !== size));
    } else {
      setSelectedCompanySizes([...selectedCompanySizes, size]);
    }
  };
  
  const handleSave = () => {
    if (!segmentName) {
      alert('Please enter a segment name');
      return;
    }
    
    const segmentData = {
      id: `segment-${Date.now()}`,
      name: segmentName,
      description: segmentDescription || `Leads matching ${industry || 'any industry'} companies with ${selectedRoles.join(', ')} roles`,
      criteria: {
        fitScore: {
          min: minFitScore,
          max: maxFitScore
        },
        roles: selectedRoles,
        industry: industry,
        geography: geography,
        companySize: selectedCompanySizes
      },
      autoEnrich: autoEnrich,
      count: Math.floor(Math.random() * 50) + 20 // Simulated count
    };
    
    onSave(segmentData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Lead Segment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="segment-name" className="block text-sm font-medium text-gray-700 mb-1">
              Segment Name*
            </label>
            <input
              id="segment-name"
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="e.g., High-Value Marketing Leaders"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="segment-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="segment-description"
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e.target.value)}
              placeholder="Briefly describe this segment's purpose or targeting criteria"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Target size={16} className="mr-2" />
                Fit Score Range
              </h3>
              <div className="mb-6 px-3">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{minFitScore}</span>
                  <span>{maxFitScore}</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-1 bg-gray-200 rounded"></div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={minFitScore}
                    onChange={(e) => setMinFitScore(parseFloat(e.target.value))}
                    className="absolute left-0 w-full"
                    style={{ zIndex: 10 }}
                  />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={maxFitScore}
                    onChange={(e) => setMaxFitScore(parseFloat(e.target.value))}
                    className="absolute left-0 w-full"
                    style={{ zIndex: 20 }}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <div className="text-center">
                    <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Low (&lt;7)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Medium (7-8.4)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      High (8.5+)
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Building size={16} className="mr-2" />
                Industry & Geography
              </h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="industry" className="block text-xs text-gray-500 mb-1">Industry</label>
                  <input
                    id="industry"
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., B2B SaaS, Healthcare, Financial Services"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="geography" className="block text-xs text-gray-500 mb-1">Geography</label>
                  <input
                    id="geography"
                    type="text"
                    value={geography}
                    onChange={(e) => setGeography(e.target.value)}
                    placeholder="e.g., North America, EMEA, Global"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Briefcase size={16} className="mr-2" />
                Target Roles
              </h3>
              <div className="mb-2 text-xs text-gray-500">
                Select all relevant roles for this segment:
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto mb-6">
                {roleOptions.map(role => (
                  <div 
                    key={role} 
                    className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center ${
                      selectedRoles.includes(role)
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleToggle(role)}
                  >
                    {selectedRoles.includes(role) && (
                      <Check size={14} className="mr-2 text-blue-600" />
                    )}
                    {role}
                  </div>
                ))}
              </div>
              
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Users size={16} className="mr-2" />
                Company Size
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {companySizeOptions.map(option => (
                  <div 
                    key={option.value} 
                    className={`px-3 py-2 rounded-md border text-sm cursor-pointer flex items-center ${
                      selectedCompanySizes.includes(option.value)
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleCompanySizeToggle(option.value)}
                  >
                    {selectedCompanySizes.includes(option.value) && (
                      <Check size={14} className="mr-2 text-blue-600" />
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <div className="flex items-start">
              <Database size={18} className="text-blue-600 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-2">Lead Enrichment</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-enrichment"
                    checked={autoEnrich}
                    onChange={() => setAutoEnrich(!autoEnrich)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-enrichment" className="ml-2 block text-sm text-blue-700">
                    Automatically enrich leads that match this segment
                  </label>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  When enabled, leads added to this segment will be automatically enriched with additional data and AI insights.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center text-sm text-gray-700">
                  <Filter size={16} className="mr-2 text-blue-600" />
                  <span className="font-medium">Estimated match:</span>
                  <Badge className="ml-2">{Math.floor(Math.random() * 50) + 20} leads</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Based on your current database and selection criteria
                </p>
              </div>
              <div className="flex space-x-3">
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
                  disabled={!segmentName.trim() || selectedRoles.length === 0}
                >
                  Create Segment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};