import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import { CSVUploadModal } from '../common/CSVUploadModal';
import { SegmentCreationModal } from '../common/SegmentCreationModal';
import { BatchEnrichmentModal } from '../enrichment/BatchEnrichmentModal';
import {
  Users,
  PlusCircle,
  Filter,
  ArrowDownUp,
  Search,
  Upload,
  Sparkles,
  Database,
  BarChart2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Star,
  StarHalf,
  Clock,
  Mail,
  Briefcase,
  BuildingIcon,
  X,
  UserPlus,
  Zap,
  MessageSquare,
  ExternalLink,
  DollarSign
} from 'lucide-react';

// Import leads data
import leadsData from '../../data/leads.json';
// Import segment data
import segmentsData from '../../data/segments.json';

export const LeadEnrichment: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [segments, setSegments] = useState<any[]>([]);
  const [activeSegment, setActiveSegment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false);
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeProvider, setActiveProvider] = useState<string>('waterfall');
  const [visibleSegments, setVisibleSegments] = useState<'segments' | 'settings'>('segments');
  
  // Enrichment provider configuration
  const [enrichmentProviders, setEnrichmentProviders] = useState([
    {
      id: 'knoxengage',
      name: 'KnoxEngage Intelligence',
      enabled: true,
      priority: 1,
      costPerLead: 0.08,
      description: 'Our in-house AI enrichment with basic company and security data',
      features: ['Company data', 'Security profile', 'Basic firmographics', 'AI-driven insights'],
      dataPoints: ['Name', 'Email', 'Company', 'Title', 'Industry', 'Company Size', 'Location', 'Security Posture'],
      logo: ''
    },
    {
      id: 'leadgenius',
      name: 'LeadGenius',
      enabled: true,
      priority: 2,
      costPerLead: 0.25,
      description: 'Premium data provider with enhanced intelligence and accuracy',
      features: ['Advanced firmographics', 'Technographics', 'Intent data', '95%+ accuracy'],
      dataPoints: ['Contact details', 'Direct dial phones', 'Job function', 'Technologies used', 'Security tools', 'Purchase intent'],
      logo: '/images/leadgenius logo.jpeg',
      documentationUrl: 'https://docs.leadgenius.com/#leadgenius-api-docs'
    },
    {
      id: 'apollo',
      name: 'Apollo.io',
      enabled: false,
      priority: 3,
      costPerLead: 0.15,
      description: 'Large contact database with good coverage across industries',
      features: ['200M+ contacts', 'Job change alerts', 'Buying intent signals', 'Affordable pricing'],
      dataPoints: ['Contact information', 'Social profiles', 'Department', 'Seniority', 'Company funding'],
      logo: '/images/Apollo logo.png',
      documentationUrl: 'https://docs.apollo.io/docs/api-overview'
    }
  ]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // For each segment, create the appropriate number of leads that match its criteria
      const allLeads = [...leadsData.leads];
      
      // Ensure we have enough leads for each segment
      let segmentsWithCounts = [...segmentsData.segments];
      
      // Make sure we add extra leads to match the segment counts if needed
      segmentsWithCounts.forEach((segment) => {
        if (segment.id !== 'all') {
          const count = segment.count;
          const existingMatches = allLeads.filter(lead => matchesSegmentCriteria(lead, segment));
          
          // If we don't have enough leads matching this segment, generate more
          if (existingMatches.length < count) {
            const additionalNeeded = count - existingMatches.length;
            
            for (let i = 0; i < additionalNeeded; i++) {
              // Clone and modify an existing lead to match this segment
              const templateLead = {...allLeads[i % allLeads.length]};
              const newId = `lead-${Date.now()}-${i}`;
              
              // Adjust properties to match segment criteria
              const { criteria } = segment;
              
              if (criteria.fitScore) {
                templateLead.fitScore = criteria.fitScore.min + (Math.random() * (criteria.fitScore.max - criteria.fitScore.min));
              }
              
              if (criteria.roles && criteria.roles.length > 0 && !criteria.roles.includes('All')) {
                templateLead.title = criteria.roles[Math.floor(Math.random() * criteria.roles.length)];
              }
              
              if (criteria.companySize && criteria.companySize.length > 0 && !criteria.companySize.includes('All')) {
                templateLead.companySize = criteria.companySize[Math.floor(Math.random() * criteria.companySize.length)];
              }
              
              templateLead.id = newId;
              templateLead.name = `${['John', 'Sarah', 'Michael', 'Emily', 'David'][i % 5]} ${['Smith', 'Johnson', 'Williams', 'Jones', 'Brown'][i % 5]}`;
              templateLead.email = `${templateLead.name.toLowerCase().replace(' ', '.')}@example.com`;
              
              allLeads.push(templateLead);
            }
          }
        }
      });
      
      setLeads(allLeads);
      setSegments(segmentsData.segments);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Helper function to check if a lead matches segment criteria
  const matchesSegmentCriteria = (lead: any, segment: any): boolean => {
    const { criteria } = segment;
    
    // Filter by fit score
    if (criteria.fitScore) {
      const { min, max } = criteria.fitScore;
      if (lead.fitScore < min || lead.fitScore > max) {
        return false;
      }
    }
    
    // Filter by roles
    if (criteria.roles && criteria.roles.length > 0 && !criteria.roles.includes('All')) {
      if (!criteria.roles.some((role: string) => lead.title.includes(role))) {
        return false;
      }
    }
    
    // Filter by company size
    if (criteria.companySize && criteria.companySize.length > 0 && !criteria.companySize.includes('All')) {
      if (!criteria.companySize.includes(lead.companySize)) {
        return false;
      }
    }
    
    return true;
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSegmentChange = (segmentId: string) => {
    setActiveSegment(segmentId);
    setSelectedLeads([]);
    setSelectAll(false);
    // Clear the search query when changing segments
    setSearchQuery('');
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };
  
  const handleSelectAllLeads = () => {
    if (selectAll) {
      setSelectedLeads([]);
    } else {
      const ids = filteredLeads.map(lead => lead.id);
      setSelectedLeads(ids);
    }
    setSelectAll(!selectAll);
  };
  
  const handleUploadComplete = (uploadedLeads: any[]) => {
    setLeads([...uploadedLeads, ...leads]);
  };
  
  const handleCreateSegment = (segmentData: any) => {
    setSegments([...segments, segmentData]);
  };
  
  const handleEnrichLeads = () => {
    if (selectedLeads.length === 0) {
      alert('Please select at least one contact to enrich');
      return;
    }
    
    setShowEnrichmentModal(true);
  };

  const handleBatchEnrichmentComplete = (enrichedLeads: any[]) => {
    // Update the leads with the enriched data
    const updatedLeads = leads.map(lead => {
      const enrichedLead = enrichedLeads.find(enriched => enriched.id === lead.id);
      return enrichedLead || lead;
    });
    
    setLeads(updatedLeads);
    setShowEnrichmentModal(false);
  };
  
  const handleProviderToggle = (providerId: string) => {
    setEnrichmentProviders(
      enrichmentProviders.map(provider => 
        provider.id === providerId 
          ? { ...provider, enabled: !provider.enabled }
          : provider
      )
    );
  };
  
  const handleProviderPriorityChange = (providerId: string, newPriority: number) => {
    // Find the provider that currently has the target priority
    const providerWithTargetPriority = enrichmentProviders.find(p => p.priority === newPriority);
    
    if (!providerWithTargetPriority) return;
    
    // Find the provider we want to change
    const providerToChange = enrichmentProviders.find(p => p.id === providerId);
    
    if (!providerToChange) return;
    
    // Get the current priority of the provider we want to change
    const currentPriority = providerToChange.priority;
    
    // Update both providers
    setEnrichmentProviders(
      enrichmentProviders.map(provider => {
        if (provider.id === providerId) {
          return { ...provider, priority: newPriority };
        } else if (provider.id === providerWithTargetPriority.id) {
          return { ...provider, priority: currentPriority };
        }
        return provider;
      })
    );
  };
  
  const sortedProviders = [...enrichmentProviders].sort((a, b) => a.priority - b.priority);
  
  const filteredSegments = segments.filter(segment => segment.id !== 'all');
  
  // Apply filters and sorting to leads
  let filteredLeads = [...leads];
  
  // Filter by segment
  if (activeSegment !== 'all') {
    const activeSegmentData = segments.find(segment => segment.id === activeSegment);
    
    if (activeSegmentData) {
      filteredLeads = filteredLeads.filter(lead => matchesSegmentCriteria(lead, activeSegmentData));
      
      // Ensure we only show the exact count from the segment
      const segmentCount = activeSegmentData.count;
      if (filteredLeads.length > segmentCount) {
        filteredLeads = filteredLeads.slice(0, segmentCount);
      }
    }
  }
  
  // Filter by search query
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredLeads = filteredLeads.filter(
      lead =>
        lead.name.toLowerCase().includes(lowerQuery) ||
        lead.company.toLowerCase().includes(lowerQuery) ||
        lead.title.toLowerCase().includes(lowerQuery) ||
        lead.email.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Apply sorting
  if (sortField) {
    filteredLeads.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  const getFitScoreBadge = (score: number) => {
    if (score >= 8.5) return <Badge variant="success" className="flex items-center">{score.toFixed(1)}</Badge>;
    if (score >= 7) return <Badge variant="info" className="flex items-center">{score.toFixed(1)}</Badge>;
    return <Badge variant="danger" className="flex items-center">{score.toFixed(1)}</Badge>;
  };

  const calculateEnrichmentCost = (numLeads: number) => {
    let totalCost = 0;
    
    // Calculate based on active providers and enrichment method
    if (activeProvider === 'waterfall') {
      // In waterfall, we assume each provider processes a percentage of leads
      // For simplicity, we'll assume providers with higher priority process 70% of leads
      // and the remainder passes to the next provider
      
      let remainingLeads = numLeads;
      const enabledProviders = sortedProviders.filter(p => p.enabled);
      
      enabledProviders.forEach((provider, index) => {
        // Last provider gets all remaining leads
        if (index === enabledProviders.length - 1) {
          totalCost += provider.costPerLead * remainingLeads;
          remainingLeads = 0;
        } else {
          // Each provider processes 70% of the remaining leads
          const leadsProcessed = Math.round(remainingLeads * 0.7);
          totalCost += provider.costPerLead * leadsProcessed;
          remainingLeads -= leadsProcessed;
        }
      });
      
      return totalCost.toFixed(2);
    } else {
      // When using a specific provider, calculate cost directly
      const provider = enrichmentProviders.find(p => p.id === activeProvider);
      if (provider) {
        return (provider.costPerLead * numLeads).toFixed(2);
      }
      return '0.00';
    }
  };
  
  const renderSegmentsList = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Segments</h3>
        <Button
          variant="outline"
          size="sm"
          icon={<PlusCircle size={14} />}
          onClick={() => setShowSegmentModal(true)}
        >
          New Segment
        </Button>
      </div>
      
      <div className="space-y-1">
        <button
          onClick={() => handleSegmentChange('all')}
          className={`w-full flex items-center justify-between py-2 px-3 rounded-md ${
            activeSegment === 'all'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            <span>All Contacts</span>
          </div>
          <Badge>{leads.length}</Badge>
        </button>
        
        {filteredSegments.map((segment) => (
          <button
            key={segment.id}
            onClick={() => handleSegmentChange(segment.id)}
            className={`w-full flex items-center justify-between py-2 px-3 rounded-md ${
              activeSegment === segment.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                <span>{segment.name}</span>
              </div>
              {activeSegment === segment.id && (
                <p className="text-xs text-blue-600 ml-6 mt-1">{segment.description}</p>
              )}
            </div>
            <Badge>{segment.count}</Badge>
          </button>
        ))}
      </div>
      
      <Button
        variant="outline"
        fullWidth
        className="mt-4"
        icon={<Upload size={16} />}
        onClick={() => setShowUploadModal(true)}
      >
        Upload CSV
      </Button>
    </div>
  );
  
  const renderProviderSettings = () => (
    <div>
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Enrichment Providers</h4>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowProviderSettings(!showProviderSettings)}
            icon={showProviderSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          >
            {showProviderSettings ? "Hide" : "Configure"}
          </Button>
        </div>
        
        {showProviderSettings ? (
          <div className="space-y-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800">
              <h5 className="font-medium mb-1 flex items-center">
                <Zap size={14} className="mr-1 text-blue-600" />
                Waterfall Enrichment
              </h5>
              <p className="text-xs">
                Our waterfall system tries each provider in order of priority, only moving to the next provider
                if data is missing or incomplete. This prevents paying multiple providers for the same data.
              </p>
            </div>
            
            <div className="space-y-2">
              {sortedProviders.map((provider) => (
                <div key={provider.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {provider.logo ? (
                        <div className="w-8 h-8 rounded overflow-hidden mr-2 border border-gray-200 flex-shrink-0">
                          <img src={provider.logo} alt={provider.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-blue-100 mr-2 flex items-center justify-center flex-shrink-0">
                          <Database size={16} className="text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-medium text-gray-900">{provider.name}</h5>
                        <div className="flex items-center text-xs text-gray-500">
                          <DollarSign size={10} className="mr-0.5" />
                          {`$${provider.costPerLead.toFixed(2)}/contact`}
                          <span className="mx-1">•</span>
                          Priority {provider.priority}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={provider.enabled}
                        onChange={() => handleProviderToggle(provider.id)}
                        className="sr-only"
                      />
                      <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          provider.enabled ? "transform translate-x-4 bg-blue-600" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">{provider.description}</div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {provider.features.map((feature, idx) => (
                      <Badge key={idx} className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                  
                  {provider.documentationUrl && (
                    <a 
                      href={provider.documentationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center"
                    >
                      <ExternalLink size={10} className="mr-1" />
                      API Documentation
                    </a>
                  )}
                  
                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Priority:</span>
                      <select 
                        className="text-xs border border-gray-300 rounded p-1"
                        value={provider.priority}
                        onChange={(e) => handleProviderPriorityChange(
                          provider.id, 
                          parseInt(e.target.value)
                        )}
                      >
                        {[1, 2, 3].map(priority => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                    </div>
                    {provider.enabled && provider.id !== 'knoxengage' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs py-1"
                        icon={<Zap size={12} />}
                      >
                        Test API Connection
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-700">Active Providers</h5>
            </div>
            
            <div className="space-y-2">
              {sortedProviders.filter(p => p.enabled).map((provider) => (
                <div key={provider.id} className="bg-gray-50 p-2 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    {provider.logo ? (
                      <div className="w-6 h-6 rounded overflow-hidden mr-2 border border-gray-200">
                        <img src={provider.logo} alt={provider.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded bg-blue-100 mr-2 flex items-center justify-center">
                        <Database size={12} className="text-blue-600" />
                      </div>
                    )}
                    <span className="text-sm">{provider.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">${provider.costPerLead.toFixed(2)}/contact</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Enrichment Method</h4>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={activeProvider}
            onChange={(e) => setActiveProvider(e.target.value)}
          >
            <option value="waterfall">Waterfall (Cost-Optimized)</option>
            {sortedProviders.filter(p => p.enabled).map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name} Only
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {activeProvider === 'waterfall' ? 
              'Tries each provider in order of priority, only using the next provider if data is missing.' : 
              'Enriches using only the selected provider.'
            }
          </p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Estimate</h4>
          <div className="p-3 bg-gray-50 rounded-md">
            {selectedLeads.length > 0 ? (
              <div className="text-center">
                <p className="mb-1">
                  <span className="text-2xl font-bold text-gray-900">${calculateEnrichmentCost(selectedLeads.length)}</span>
                </p>
                <p className="text-sm text-gray-600">to enrich {selectedLeads.length} contact{selectedLeads.length !== 1 ? 's' : ''}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                Select contacts to see cost estimate
              </p>
            )}
          </div>
        </div>
        
        <Button
          variant="primary"
          fullWidth
          icon={<Sparkles size={16} />}
          onClick={handleEnrichLeads}
          disabled={selectedLeads.length === 0}
        >
          Enrich {selectedLeads.length > 0 ? `${selectedLeads.length} Contact${selectedLeads.length !== 1 ? 's' : ''}` : 'Selected Contacts'}
        </Button>
      </div>
    </div>
  );
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Enrichment</h2>
        <p className="text-gray-600">Discover and enrich contacts with AI-powered insights</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="border-b border-gray-200 mb-4">
              <div className="flex -mb-px">
                <button
                  className={`py-3 px-4 border-b-2 font-medium text-sm ${visibleSegments === 'segments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setVisibleSegments('segments')}
                >
                  Segments
                </button>
                <button
                  className={`py-3 px-4 border-b-2 font-medium text-sm ${visibleSegments === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setVisibleSegments('settings')}
                >
                  Enrichment
                </button>
              </div>
            </div>
            
            {visibleSegments === 'segments' ? renderSegmentsList() : renderProviderSettings()}
          </Card>
          
          {visibleSegments === 'settings' && (
            <Card title="Waterfall Enrichment">
              <div className="p-4 bg-blue-50 rounded-md mb-4">
                <div className="flex items-start">
                  <Zap size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 text-sm mb-1">How Waterfall Works</h4>
                    <p className="text-xs text-blue-700">
                      Our waterfall enrichment process saves you money by using providers in sequence:
                    </p>
                    <ol className="mt-2 space-y-1 text-xs text-blue-700 pl-4 list-decimal">
                      <li>First tries lower-cost, in-house data sources</li>
                      <li>Only uses premium providers for missing data</li>
                      <li>Automatically finds the best value based on your needs</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <h4 className="text-sm font-medium text-gray-700 mb-2">Success Rate by Provider</h4>
              
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">KnoxEngage Intelligence</span>
                    <span className="font-medium text-gray-900">76%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">LeadGenius</span>
                    <span className="font-medium text-gray-900">92%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Apollo.io</span>
                    <span className="font-medium text-gray-900">84%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                fullWidth
                className="text-sm"
              >
                View Detailed Analytics
              </Button>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-3 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search contacts by name, company, or email"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  icon={<Filter size={16} />}
                >
                  Filter
                </Button>
                <Button
                  variant="outline"
                  icon={<ArrowDownUp size={16} />}
                >
                  Sort
                </Button>
                <Button
                  variant="primary"
                  onClick={handleEnrichLeads}
                  icon={<Sparkles size={16} />}
                  disabled={selectedLeads.length === 0}
                >
                  Enrich {selectedLeads.length > 0 ? `(${selectedLeads.length})` : ''}
                </Button>
              </div>
            </div>
            
            {activeSegment !== 'all' && (
              <div className="mb-4 bg-blue-50 p-3 rounded-md">
                <div className="flex items-start">
                  <Filter size={16} className="text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-blue-800 text-sm">
                        Filtered by: {segments.find(s => s.id === activeSegment)?.name}
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="ml-2 py-0.5 px-2 text-xs"
                        onClick={() => handleSegmentChange('all')}
                      >
                        Clear Filter
                      </Button>
                    </div>
                    <p className="text-xs text-blue-700">
                      {segments.find(s => s.id === activeSegment)?.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery ? 
                    'Try adjusting your search or filter criteria' : 
                    'Upload contacts or create segments to get started'
                  }
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button
                    variant="outline"
                    icon={<Upload size={16} />}
                    onClick={() => setShowUploadModal(true)}
                  >
                    Upload CSV
                  </Button>
                  <Button
                    variant="outline"
                    icon={<UserPlus size={16} />}
                  >
                    Add Manually
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectAll}
                              onChange={handleSelectAllLeads}
                            />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            <span>Contact</span>
                            {sortField === 'name' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('company')}
                        >
                          <div className="flex items-center">
                            <span>Company</span>
                            {sortField === 'company' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('fitScore')}
                        >
                          <div className="flex items-center">
                            <span>Security Fit</span>
                            {sortField === 'fitScore' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className={selectedLeads.includes(lead.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={() => handleSelectLead(lead.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-start">
                              <div className="ml-0">
                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail size={12} className="mr-1" />
                                  <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.company}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Briefcase size={12} className="mr-1" />
                              {lead.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getFitScoreBadge(lead.fitScore)}
                            
                            <div className="flex items-center mt-1">
                              {lead.fitScore >= 9 ? (
                                <Star size={12} className="text-yellow-400" />
                              ) : lead.fitScore >= 7 ? (
                                <StarHalf size={12} className="text-yellow-400" />
                              ) : (
                                <Star size={12} className="text-gray-300" />
                              )}
                              <span className="text-xs text-gray-500 ml-1">
                                {lead.fitScore >= 8.5 ? 'High security fit' : lead.fitScore >= 7 ? 'Medium fit' : 'Low fit'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Sparkles size={14} />}
                                onClick={() => {
                                  setSelectedLeads([lead.id]);
                                  handleEnrichLeads();
                                }}
                                disabled={lead.isEnriching}
                              >
                                Enrich
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<MessageSquare size={14} />}
                              >
                                Contact
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    {selectAll ? (
                      <span>All {filteredLeads.length} contacts selected</span>
                    ) : (
                      selectedLeads.length > 0 && (
                        <span>
                          {selectedLeads.length} of {filteredLeads.length} contacts selected
                        </span>
                      )
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>Last updated: Just now</span>
                  </div>
                </div>
              </>
            )}
            
            {leads.some(lead => lead.reason) && (
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <div className="flex items-start">
                  <Sparkles size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      AI Enrichment Insights
                    </p>
                    <div className="text-sm text-blue-700">
                      <p>
                        {leads.filter(l => l.reason).length} contacts have been enriched with additional data.
                        The average security fit score is {(leads.reduce((sum, lead) => sum + lead.fitScore, 0) / leads.length).toFixed(1)}.
                      </p>
                      <p className="mt-2">
                        Recommended next action: Focus on high-fit contacts (8.5+) in the enterprise technology sector with Kubernetes deployments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {showUploadModal && (
        <CSVUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
      
      {showSegmentModal && (
        <SegmentCreationModal
          onClose={() => setShowSegmentModal(false)}
          onSave={handleCreateSegment}
        />
      )}
      
      {showEnrichmentModal && (
        <BatchEnrichmentModal
          onClose={() => setShowEnrichmentModal(false)}
          onComplete={handleBatchEnrichmentComplete}
          leads={leads.filter(lead => selectedLeads.includes(lead.id))}
        />
      )}
      
      <ChatModal 
        agentName="KnoxEngage Enrichment Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'I can help you enrich your contacts with security and company data. Would you like me to explain how our enrichment providers work or help you find the right contacts for your cybersecurity outreach?',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};