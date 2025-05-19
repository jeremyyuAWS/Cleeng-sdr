import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { RefreshCw, Filter, CheckCircle, AlertCircle, ArrowRight, ChevronDown, ChevronUp, X, Target, User, Clock, Search, Sparkles, Mail, Briefcase, Star, StarHalf, MessageSquare } from 'lucide-react';

interface LeadData {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  selected?: boolean;
  fitScore: number;
  isEnriching?: boolean;
  isEnriched?: boolean;
  reason?: string;
  recentActivity?: string[];
}

interface ICPSegmentEnrichmentProps {
  segment: {
    id: string;
    name: string;
    description: string;
  };
  onBackToSuggestions: () => void;
}

export const ICPSegmentEnrichment: React.FC<ICPSegmentEnrichmentProps> = ({ segment, onBackToSuggestions }) => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [isEnrichingBatch, setIsEnrichingBatch] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enrichmentCount, setEnrichmentCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Generate sample leads based on segment
      const generatedLeads = Array.from({ length: 10 }, (_, i) => ({
        id: `lead-${Date.now()}-${i}`,
        name: `${['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Jennifer', 'William', 'Elizabeth'][i % 10]} ${['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'][i % 10]}`,
        title: `${['Marketing', 'Sales', 'Growth', 'Product', 'Customer Success'][i % 5]} ${['Director', 'Manager', 'VP', 'Lead', 'Head'][i % 5]}`,
        company: `${['Tech', 'Advanced', 'Global', 'Future', 'Smart', 'Acme', 'Apex', 'Summit', 'Prime', 'Elite'][i % 10]} ${['Solutions', 'Systems', 'Technologies', 'Innovations', 'Industries', 'Services', 'Applications', 'Software', 'Group', 'Partners'][i % 10]}`,
        email: `person${i+1}@example.com`,
        selected: false,
        fitScore: 7 + Math.random() * 3,
        isEnriched: i < 3,
        reason: i < 3 ? "This lead matches your ICP criteria and shows recent engagement with content related to your solution." : undefined,
        recentActivity: i < 3 ? [
          `Visited your website (${Math.floor(Math.random() * 5) + 1} days ago)`,
          `Downloaded a whitepaper (${Math.floor(Math.random() * 14) + 7} days ago)`
        ] : undefined
      }));
      
      setLeads(generatedLeads);
      setIsLoading(false);
    }, 1200);
  }, [segment]);
  
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setLeads(prevLeads => 
      prevLeads.map(lead => ({
        ...lead,
        selected: !selectAll
      }))
    );
  };
  
  const handleSelectLead = (id: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, selected: !lead.selected } : lead
      )
    );
    
    // Update selectAll state if needed
    const allSelected = leads.every(lead => lead.id === id ? !lead.selected : lead.selected);
    setSelectAll(allSelected);
  };
  
  const handleEnrichSelected = () => {
    const selectedLeads = leads.filter(lead => lead.selected);
    if (selectedLeads.length === 0) {
      alert('Please select at least one lead to enrich');
      return;
    }
    
    setIsEnrichingBatch(true);
    setEnrichmentCount(0);
    setEnrichmentProgress(0);
    
    // Mark selected leads as "enriching"
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.selected ? { ...lead, isEnriching: true } : lead
      )
    );
    
    // Simulate batch enrichment process
    const total = selectedLeads.length;
    let processed = 0;
    
    const enrichInterval = setInterval(() => {
      if (processed >= total) {
        clearInterval(enrichInterval);
        setIsEnrichingBatch(false);
        return;
      }
      
      processed++;
      setEnrichmentCount(processed);
      setEnrichmentProgress(Math.round((processed / total) * 100));
      
      // Update one lead at a time
      setLeads(prevLeads => {
        const leadToEnrich = prevLeads.findIndex(lead => lead.selected && lead.isEnriching && !lead.isEnriched);
        if (leadToEnrich === -1) return prevLeads;
        
        const updatedLeads = [...prevLeads];
        updatedLeads[leadToEnrich] = {
          ...updatedLeads[leadToEnrich],
          isEnriching: false,
          isEnriched: true,
          fitScore: Math.min(10, updatedLeads[leadToEnrich].fitScore + 0.7),
          reason: "This lead matches your ICP criteria and has been enriched with additional company and contact information.",
          recentActivity: [
            `Visited your website (${Math.floor(Math.random() * 5) + 1} days ago)`,
            `Downloaded a whitepaper (${Math.floor(Math.random() * 14) + 7} days ago)`
          ]
        };
        
        return updatedLeads;
      });
      
    }, 1000); // Process one lead per second for demo purposes
  };
  
  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.title.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query)
    );
  });
  
  const getFitScoreColor = (score: number): string => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Add the missing function to generate fit score badges
  const getFitScoreBadge = (score: number) => {
    let bgColor = '';
    let textColor = '';
    let label = '';
    
    if (score >= 8.5) {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'High';
    } else if (score >= 7) {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'Medium';
    } else {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Low';
    }
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label} <span className="ml-1 font-bold">{score.toFixed(1)}</span>
      </div>
    );
  };
  
  const selectedLeadCount = leads.filter(lead => lead.selected).length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button 
            className="mr-3 text-gray-500 hover:text-gray-700"
            onClick={onBackToSuggestions}
          >
            <ArrowRight size={18} className="transform rotate-180" />
          </button>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{segment.name}</h3>
            <p className="text-sm text-gray-500">{segment.description}</p>
          </div>
        </div>
      </div>
      
      {/* Enrichment Progress Banner */}
      {isEnrichingBatch && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <RefreshCw size={16} className="text-blue-600 mr-2 animate-spin" />
              <p className="text-sm font-medium text-blue-800">
                Enriching {selectedLeadCount} leads ({enrichmentCount}/{selectedLeadCount} complete)
              </p>
            </div>
            <Badge variant="info">{enrichmentProgress}%</Badge>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${enrichmentProgress}%` }}></div>
          </div>
          <p className="mt-2 text-xs text-blue-700">
            Adding company information, contact details, and generating AI insights for selected leads...
          </p>
        </div>
      )}
      
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              icon={<Filter size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
              {showFilters ? 
                <ChevronUp size={16} className="ml-1" /> : 
                <ChevronDown size={16} className="ml-1" />
              }
            </Button>
            
            <Button 
              variant="primary"
              icon={<Sparkles size={16} />}
              onClick={handleEnrichSelected}
              disabled={isEnrichingBatch || selectedLeadCount === 0}
            >
              {isEnrichingBatch ? 'Enriching...' : `Enrich Selected (${selectedLeadCount})`}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
            <div className="text-sm font-medium text-gray-700 mb-2">Quick Filters</div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white cursor-pointer">All Leads ({leads.length})</Badge>
              <Badge className="bg-white cursor-pointer">High Fit (8.5+)</Badge>
              <Badge className="bg-white cursor-pointer">Not Yet Enriched</Badge>
              <Badge className="bg-white cursor-pointer">Recently Added</Badge>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex p-4 border border-gray-200 rounded-lg">
                <div className="w-6 mr-3"></div>
                <div className="w-full">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-24 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-md">
            <User size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-700 mb-1">No matching leads found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fit Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className={lead.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={lead.selected || false}
                          onChange={() => handleSelectLead(lead.id)}
                          disabled={lead.isEnriching}
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
                            {lead.fitScore >= 8.5 ? 'High fit' : lead.fitScore >= 7 ? 'Medium fit' : 'Low fit'}
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
                              setLeads(prevLeads => 
                                prevLeads.map(l => 
                                  l.id === lead.id ? { ...l, isEnriching: true } : l
                                )
                              );
                              
                              // Simulate enrichment
                              setTimeout(() => {
                                setLeads(prevLeads => 
                                  prevLeads.map(l => 
                                    l.id === lead.id ? {
                                      ...l,
                                      isEnriching: false,
                                      isEnriched: true,
                                      fitScore: Math.min(10, l.fitScore + 0.7),
                                      reason: "This lead matches your ICP criteria and has been enriched with additional company and contact information.",
                                      recentActivity: [
                                        `Visited your website (${Math.floor(Math.random() * 5) + 1} days ago)`,
                                        `Downloaded a whitepaper (${Math.floor(Math.random() * 14) + 7} days ago)`
                                      ]
                                    } : l
                                  )
                                );
                              }, 2500);
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
            
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {selectedLeadCount > 0 && !isEnrichingBatch && (
                    <span>
                      {selectedLeadCount} lead{selectedLeadCount !== 1 ? 's' : ''} selected
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>Last updated: Just now</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {filteredLeads.some(lead => lead.isEnriched) && (
          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <Sparkles size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-2">
                  AI Enrichment Insights
                </p>
                <div className="text-sm text-blue-700">
                  <p>
                    {filteredLeads.filter(l => l.isEnriched).length} leads have been enriched with additional data.
                    The average fit score improved by 0.7 points after enrichment.
                  </p>
                  <p className="mt-2">
                    Key findings: 3 leads have recently visited your website, and 2 have downloaded content related to your solution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={onBackToSuggestions}
        >
          Back to Suggestions
        </Button>
        
        <Button
          variant="primary"
          onClick={() => {
            // Find the leads tab in the main navigation and click it
            const tabElements = document.querySelectorAll('button');
            const leadsTab = Array.from(tabElements).find(
              tab => tab.textContent?.includes('Lead Enrichment')
            );
            
            if (leadsTab) {
              leadsTab.click();
            } else {
              // Fallback to parent app's setActiveTab if available
              // This requires context or prop passing from the parent component
              // If none of those work, try direct DOM manipulation
              const tabList = document.querySelector('nav');
              if (tabList) {
                const buttons = tabList.querySelectorAll('button');
                const leadsButton = Array.from(buttons).find(
                  button => button.textContent?.includes('Lead Enrichment')
                );
                if (leadsButton) {
                  leadsButton.click();
                } else {
                  // Last resort fallback
                  window.location.href = '#/leads';
                }
              } else {
                window.location.href = '#/leads';
              }
            }
          }}
          icon={<ArrowRight size={16} />}
        >
          Go to Lead Enrichment
        </Button>
      </div>
    </div>
  );
};