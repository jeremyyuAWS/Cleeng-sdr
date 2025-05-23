import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  Search,
  Clock,
  Target,
  Building,
  Globe,
  Users,
  Server,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Cpu,
  TrendingUp,
  Crosshair,
  Briefcase,
  BarChart
} from 'lucide-react';

// Import security intelligence data
import securityIntelligenceData from '../../data/security_intelligence.json';

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  companySize: string;
  industry: string;
  securityStack: string[];
  cloudEnvironment: string[];
  securityChallenges: string[];
  fitScore: number;
  recentActivity?: string[];
}

interface CompanyInsight {
  name: string;
  id: string;
  industry: string;
  securityPosture: string;
  cloudArchitecture: string[];
  securityStack: string[];
  compliance: string[];
  vulnerabilities: string[];
  recentSecurityEvents: string[];
}

export const SalesIntelligence: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'insights' | 'companies' | 'trends'>('insights');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companyInsights, setCompanyInsights] = useState<CompanyInsight[]>([]);
  const [showInsightDetails, setShowInsightDetails] = useState<boolean>(false);

  // Fetch data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContacts(securityIntelligenceData.contacts || []);
      setCompanyInsights(securityIntelligenceData.companies || []);
      setIsLoading(false);
    }, 1200);
  }, []);

  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.title.toLowerCase().includes(query)
    );
  });

  const getContactById = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const getCompanyById = (id: string) => {
    return companyInsights.find(company => company.id === id);
  };

  const handleSelectContact = (id: string) => {
    setSelectedContact(id);
    const contact = getContactById(id);
    if (contact) {
      // Find corresponding company
      const company = companyInsights.find(c => c.name === contact.company);
      if (company) {
        setSelectedCompany(company.id);
      } else {
        setSelectedCompany(null);
      }
    }
  };

  const getSecurityFitBadge = (score: number) => {
    if (score >= 8.5) return <Badge variant="success">{score.toFixed(1)}</Badge>;
    if (score >= 7) return <Badge variant="info">{score.toFixed(1)}</Badge>;
    return <Badge variant="danger">{score.toFixed(1)}</Badge>;
  };

  const renderContactInsights = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (selectedContact) {
      const contact = getContactById(selectedContact);
      if (!contact) {
        return (
          <div className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Contact not found</p>
            <p className="text-gray-600">The selected contact could not be found</p>
            <Button variant="primary" className="mt-4" onClick={() => setSelectedContact(null)}>
              Back to Contact List
            </Button>
          </div>
        );
      }

      return (
        <div>
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-4"
              onClick={() => setSelectedContact(null)}
            >
              Back to Contacts
            </Button>
            <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
            <Badge className="ml-3">{contact.title}</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Users size={18} className="text-cleeng-blue-600 mr-2" />
                Contact Information
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Company:</span>
                  <span className="font-medium">{contact.company}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Title:</span>
                  <span>{contact.title}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Email:</span>
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Industry:</span>
                  <span>{contact.industry}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Company Size:</span>
                  <span>{contact.companySize}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Fit Score:</span>
                  {getSecurityFitBadge(contact.fitScore)}
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Target size={18} className="text-cleeng-blue-600 mr-2" />
                Business Context
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {contact.securityStack.map((tech, idx) => (
                      <Badge key={idx}>{tech}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Cloud Environment</h5>
                  <div className="flex flex-wrap gap-2">
                    {contact.cloudEnvironment.map((env, idx) => (
                      <Badge key={idx} variant="info">{env}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Key Challenges</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {contact.securityChallenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertTriangle size={14} className="text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {contact.recentActivity && contact.recentActivity.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {contact.recentActivity.map((activity, idx) => (
                        <li key={idx} className="flex items-start">
                          <Clock size={14} className="text-cleeng-blue-500 mt-0.5 mr-1 flex-shrink-0" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card title="AI-Powered Engagement Recommendations">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Sparkles size={16} className="mr-2" />
                  Personalized Talking Points
                </h5>
                <ul className="space-y-3 text-sm text-blue-700">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Mention {contact.company}'s recent focus on {contact.securityChallenges[0].toLowerCase()}, which our platform specifically addresses.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reference their use of {contact.securityStack[0]} and how our solution complements it with additional features.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Highlight our success with similar {contact.industry} companies that face similar challenges.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Target size={16} className="text-cleeng-blue-600 mr-2" />
                  Optimal Engagement Strategy
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center mb-1">
                      <Clock size={14} className="text-gray-500 mr-2" />
                      <span className="font-medium text-gray-800">Best Time to Contact</span>
                    </div>
                    <p className="text-sm text-gray-600">Tuesday or Thursday, 10:00 AM - 11:30 AM (Recipient's time zone)</p>
                    <p className="text-xs text-gray-500 mt-1">Based on {contact.title}'s typical engagement patterns</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center mb-1">
                      <Target size={14} className="text-gray-500 mr-2" />
                      <span className="font-medium text-gray-800">Recommended Approach</span>
                    </div>
                    <p className="text-sm text-gray-600">LinkedIn connection request followed by personalized email</p>
                    <p className="text-xs text-gray-500 mt-1">Based on their recent social media activity</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Insights</h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cleeng-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No matching contacts</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4 cursor-pointer bg-white"
                onClick={() => handleSelectContact(contact.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.title}</p>
                  </div>
                  {getSecurityFitBadge(contact.fitScore)}
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-700">{contact.company}</span>
                  <span className="text-xs text-gray-500 mx-2">•</span>
                  <span className="text-sm text-gray-700">{contact.industry}</span>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-1">
                    {contact.securityStack.slice(0, 3).map((tech, idx) => (
                      <Badge key={idx} variant="info" className="text-xs">{tech}</Badge>
                    ))}
                    {contact.securityStack.length > 3 && (
                      <Badge variant="info" className="text-xs">+{contact.securityStack.length - 3}</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Key Challenges:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {contact.securityChallenges.slice(0, 2).map((challenge, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertTriangle size={12} className="text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                    {contact.securityChallenges.length > 2 && (
                      <li className="text-cleeng-blue-600 text-xs">+{contact.securityChallenges.length - 2} more challenges</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        <Card title="Industry Insights">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <TrendingUp size={16} className="mr-2" />
                Top Industry Trends
              </h4>
              <div className="space-y-2">
                {securityIntelligenceData.securityTrends && securityIntelligenceData.securityTrends.map((trend, idx) => (
                  <div key={idx} className="flex items-start">
                    <Sparkles size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">{trend.trend}</p>
                      <p className="text-xs text-blue-600">{trend.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Top Challenges by Industry</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Challenge</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution Fit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { industry: "Financial Services", challenge: "Data Integration", priority: "High", fit: "Excellent" },
                      { industry: "Healthcare", challenge: "Sales Automation", priority: "Critical", fit: "Strong" },
                      { industry: "Retail", challenge: "CRM Synchronization", priority: "Medium", fit: "Good" },
                      { industry: "Technology", challenge: "Lead Enrichment", priority: "High", fit: "Excellent" }
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.industry}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{item.challenge}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Badge 
                            variant={
                              item.priority === "Critical" ? "danger" :
                              item.priority === "High" ? "warning" :
                              "info"
                            }
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Badge 
                            variant={
                              item.fit === "Excellent" ? "success" :
                              item.fit === "Strong" ? "info" :
                              "default"
                            }
                            className="text-xs"
                          >
                            {item.fit}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderCompanyInsights = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (selectedCompany) {
      const company = getCompanyById(selectedCompany);
      if (!company) {
        return (
          <div className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Company not found</p>
            <p className="text-gray-600">The selected company could not be found</p>
            <Button variant="primary" className="mt-4" onClick={() => setSelectedCompany(null)}>
              Back to Companies
            </Button>
          </div>
        );
      }

      return (
        <div>
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-4"
              onClick={() => setSelectedCompany(null)}
            >
              Back to Companies
            </Button>
            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
            <Badge className="ml-3">{company.industry}</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Building size={18} className="text-cleeng-blue-600 mr-2" />
                Company Profile
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Industry</h5>
                  <p className="text-gray-900">{company.industry}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Tech Maturity</h5>
                  <p className="text-gray-900">{company.securityPosture}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {company.cloudArchitecture.map((item, index) => (
                      <Badge key={index}>{item}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Compliance Requirements</h5>
                  <div className="flex flex-wrap gap-2">
                    {company.compliance.map((item, index) => (
                      <Badge key={index} variant="info">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Target size={18} className="text-cleeng-blue-600 mr-2" />
                Business Context
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Current Technology Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {company.securityStack.map((tech, index) => (
                      <Badge key={index}>{tech}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Key Business Challenges</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {company.vulnerabilities.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle size={14} className="text-red-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Business Events</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {company.recentSecurityEvents.map((event, index) => (
                      <li key={index} className="flex items-start">
                        <Clock size={14} className="text-cleeng-blue-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Solution Fit Analysis">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Business Challenges</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                    <div className="flex items-center mb-1">
                      <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                      <h5 className="font-medium text-yellow-800">Outreach Efficiency</h5>
                    </div>
                    <p className="text-sm text-yellow-700">Manual outreach processes and lack of personalization</p>
                  </div>
                  <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                    <div className="flex items-center mb-1">
                      <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                      <h5 className="font-medium text-yellow-800">CRM Integration</h5>
                    </div>
                    <p className="text-sm text-yellow-700">Disconnected systems and double data entry</p>
                  </div>
                  <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                    <div className="flex items-center mb-1">
                      <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                      <h5 className="font-medium text-yellow-800">Lead Quality</h5>
                    </div>
                    <p className="text-sm text-yellow-700">Insufficient data on prospects and poor targeting</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Solution Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 border border-green-200 bg-green-50 rounded-md">
                    <div className="flex items-center mb-1">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <h5 className="font-medium text-green-800">AI Automation</h5>
                    </div>
                    <p className="text-sm text-green-700">Personalized outreach at scale with AI assistance</p>
                  </div>
                  <div className="p-3 border border-green-200 bg-green-50 rounded-md">
                    <div className="flex items-center mb-1">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <h5 className="font-medium text-green-800">Seamless Integration</h5>
                    </div>
                    <p className="text-sm text-green-700">Two-way sync with {company.compliance.join(', ')} systems</p>
                  </div>
                  <div className="p-3 border border-green-200 bg-green-50 rounded-md">
                    <div className="flex items-center mb-1">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <h5 className="font-medium text-green-800">Enriched Data</h5>
                    </div>
                    <p className="text-sm text-green-700">Comprehensive contact enrichment with Apollo.io</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mt-6">
                <div className="flex items-start">
                  <Sparkles size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-2">AI-Generated Engagement Strategy</h4>
                    <div className="text-sm text-blue-700">
                      <p>Based on {company.name}'s profile, focus on these key points in your engagement:</p>
                      <ul className="mt-2 space-y-1 list-disc pl-5">
                        <li>Emphasize how our platform addresses their {company.vulnerabilities[0].toLowerCase()} challenges</li>
                        <li>Demonstrate our seamless integration with their existing {company.securityStack[0]} solution</li>
                        <li>Highlight our AI-powered personalization capabilities</li>
                        <li>Share the case study from a similar company in the {company.industry} space</li>
                      </ul>
                      <p className="mt-2 font-medium">Recommended contacts: CMOs, Sales Directors, Marketing Operations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Business Insights</h3>
        
        {companyInsights.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Building size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No companies found</h3>
            <p className="text-gray-600">Add companies to get business insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {companyInsights.map((company) => (
              <div
                key={company.id}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4 cursor-pointer bg-white"
                onClick={() => setSelectedCompany(company.id)}
              >
                <h3 className="font-medium text-gray-900 mb-1">{company.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{company.industry}</p>
                
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-1">
                    {company.cloudArchitecture.map((item, idx) => (
                      <Badge key={idx} variant="info" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Business Posture:</h4>
                  <p className="text-sm text-gray-700">{company.securityPosture}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Key Challenges:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {company.vulnerabilities.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertTriangle size={12} className="text-red-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {company.vulnerabilities.length > 2 && (
                      <li className="text-cleeng-blue-600 text-xs">+{company.vulnerabilities.length - 2} more</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Card title="CRM Integration Insights">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integration Needs</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cleengage Capabilities</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Financial Services</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      <Badge>Salesforce</Badge>
                      <Badge>HubSpot</Badge>
                      <Badge>LinkedIn Sales Nav</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Bi-directional CRM sync</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Activity logging</span>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Technology</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      <Badge>HubSpot</Badge>
                      <Badge>Salesforce</Badge>
                      <Badge>Apollo.io</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Full LinkedIn automation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Advanced enrichment</span>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      <Badge>Salesforce</Badge>
                      <Badge>Microsoft Dynamics</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Compliant data handling</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Secure messaging</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderTrends = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card title="Sales Technology Landscape">
          <div className="mb-4 bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <Sparkles size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-2">Market Intelligence Summary</h4>
                <p className="text-sm text-blue-700">
                  The sales engagement market is experiencing significant growth with AI becoming a critical differentiator. Key drivers include the need for personalization at scale, integration with CRM systems, and multi-channel outreach capabilities.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  With 87% of enterprises now prioritizing AI-powered sales tools (up from 52% last year), there is an urgent need for solutions that combine automation with personalization while maintaining a human touch.
                </p>
              </div>
            </div>
          </div>

          <h4 className="text-base font-medium text-gray-900 mb-3">Top Sales Challenges (2024)</h4>
          <div className="relative pt-1 pb-6">
            <div className="overflow-hidden h-10">
              <div className="w-full h-10 bg-gray-200 absolute rounded-lg"></div>
              <div className="h-10 bg-red-500 absolute rounded-l-lg" style={{ width: "78%" }}></div>
              <div className="relative z-10 flex items-center h-10">
                <span className="text-white text-xs font-medium pl-3">78% - Personalization at Scale</span>
              </div>
            </div>
            
            <div className="mt-3 overflow-hidden h-10">
              <div className="w-full h-10 bg-gray-200 absolute rounded-lg"></div>
              <div className="h-10 bg-red-400 absolute rounded-l-lg" style={{ width: "65%" }}></div>
              <div className="relative z-10 flex items-center h-10">
                <span className="text-white text-xs font-medium pl-3">65% - CRM Integration & Data Quality</span>
              </div>
            </div>
            
            <div className="mt-3 overflow-hidden h-10">
              <div className="w-full h-10 bg-gray-200 absolute rounded-lg"></div>
              <div className="h-10 bg-red-300 absolute rounded-l-lg" style={{ width: "61%" }}></div>
              <div className="relative z-10 flex items-center h-10">
                <span className="text-white text-xs font-medium pl-3">61% - Multi-channel Coordination</span>
              </div>
            </div>
            
            <div className="mt-3 overflow-hidden h-10">
              <div className="w-full h-10 bg-gray-200 absolute rounded-lg"></div>
              <div className="h-10 bg-orange-400 absolute rounded-l-lg" style={{ width: "55%" }}></div>
              <div className="relative z-10 flex items-center h-10">
                <span className="text-white text-xs font-medium pl-3">55% - Measuring Outreach Effectiveness</span>
              </div>
            </div>
            
            <div className="mt-3 overflow-hidden h-10">
              <div className="w-full h-10 bg-gray-200 absolute rounded-lg"></div>
              <div className="h-10 bg-yellow-400 absolute rounded-l-lg" style={{ width: "48%" }}></div>
              <div className="relative z-10 flex items-center h-10">
                <span className="text-gray-800 text-xs font-medium pl-3">48% - Balancing Automation & Human Touch</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-right">
            Source: Sales Engagement Trends Report 2024, n=1,200 sales professionals
          </div>
        </Card>

        <Card title="Competitive Landscape Analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Market Leaders</h4>
              <div className="space-y-3">
                {[
                  { 
                    name: "OutreachPro", 
                    marketShare: "26%", 
                    strengths: ["Enterprise presence", "Sequence automation"], 
                    weaknesses: ["Limited personalization", "Lacks AI capabilities"] 
                  },
                  { 
                    name: "SalesLoft", 
                    marketShare: "22%", 
                    strengths: ["Email deliverability", "LinkedIn integration"], 
                    weaknesses: ["Complex pricing", "Basic analytics"] 
                  },
                  { 
                    name: "Apollo", 
                    marketShare: "18%", 
                    strengths: ["Contact database", "Affordability"], 
                    weaknesses: ["Limited AI capabilities", "CRM sync issues"] 
                  }
                ].map((competitor, idx) => (
                  <div key={idx} className="p-3 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                      <Badge>{competitor.marketShare} Share</Badge>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div>
                        <div className="text-xs font-medium text-gray-700">Strengths:</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {competitor.strengths.map((strength, idx2) => (
                            <span key={idx2} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{strength}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-700">Weaknesses:</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {competitor.weaknesses.map((weakness, idx2) => (
                            <span key={idx2} className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">{weakness}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Win/Loss Analysis</h4>
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Win Rate vs Competitors</span>
                  <span className="text-sm font-medium text-blue-800">67%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>

              <h5 className="text-sm font-medium text-gray-700 mb-2">Key Differentiators</h5>
              <div className="space-y-2">
                <div className="p-2 border border-green-200 bg-green-50 rounded-md flex items-start">
                  <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Seamless CRM integration</p>
                    <p className="text-xs text-green-700">83% of wins cited this as a key factor</p>
                  </div>
                </div>
                <div className="p-2 border border-green-200 bg-green-50 rounded-md flex items-start">
                  <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">AI-generated personalization</p>
                    <p className="text-xs text-green-700">71% of wins cited this as a key factor</p>
                  </div>
                </div>
                <div className="p-2 border border-green-200 bg-green-50 rounded-md flex items-start">
                  <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Multi-channel outreach</p>
                    <p className="text-xs text-green-700">65% of wins cited this as a key factor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              size="sm"
              icon={<ExternalLink size={14} />}
              onClick={() => {
                setShowInsightDetails(!showInsightDetails);
              }}
            >
              {showInsightDetails ? "Hide Detailed Reports" : "View Detailed Reports"}
            </Button>

            {showInsightDetails && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                  <h5 className="font-medium text-gray-900 flex items-center">
                    <FileText size={16} className="mr-2 text-cleeng-blue-600" />
                    Gartner Market Guide: Sales Engagement Tools
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive analysis of the sales engagement market landscape.</p>
                  <p className="text-xs text-gray-500 mt-1">Updated: Dec 2023</p>
                </div>
                <div className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                  <h5 className="font-medium text-gray-900 flex items-center">
                    <FileText size={16} className="mr-2 text-cleeng-blue-600" />
                    Forrester Wave: Sales Automation Platforms
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">Evaluation of top sales automation providers.</p>
                  <p className="text-xs text-gray-500 mt-1">Updated: Nov 2023</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  function FileText(props: any) {
    return <TrendingUp size={props.size || 16} className={props.className || ''} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sales Intelligence</h2>
        <p className="text-gray-600">Personalized insights to boost sales effectiveness</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setSelectedTab('insights')}
            className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
              selectedTab === 'insights'
                ? 'border-cleeng-blue-600 text-cleeng-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contact Insights
          </button>
          <button
            onClick={() => setSelectedTab('companies')}
            className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
              selectedTab === 'companies'
                ? 'border-cleeng-blue-600 text-cleeng-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Company Analysis
          </button>
          <button
            onClick={() => setSelectedTab('trends')}
            className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
              selectedTab === 'trends'
                ? 'border-cleeng-blue-600 text-cleeng-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Market Trends
          </button>
        </nav>
      </div>

      {selectedTab === 'insights' && renderContactInsights()}
      {selectedTab === 'companies' && renderCompanyInsights()}
      {selectedTab === 'trends' && renderTrends()}
      
      <ChatModal 
        agentName="Cleengage Intelligence Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'I can help you analyze sales trends, understand company business needs, and develop targeted engagement strategies for your contacts. What specific information are you looking for today?',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};