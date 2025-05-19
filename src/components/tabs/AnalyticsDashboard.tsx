import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import { 
  BarChart3, BarChart, PieChart, TrendingUp, TrendingDown,
  Users, Calendar, Mail, MessageSquare, ThumbsUp, Download, 
  Sparkles, Clock, Filter, RefreshCw, ChevronDown, ChevronUp, 
  ArrowUpRight, FileText, Info, Layers, LayoutDashboard, 
  CalendarDays, Group as UserGroup, Target, PieChartIcon,
  Shield, Lock, Server, ShieldAlert, Database
} from 'lucide-react';

// Import analytics data
import analyticsData from '../../data/analytics_data.json';

export const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [showAiInsights, setShowAiInsights] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight);
  };

  const toggleExpandSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Updated render KPI cards with security theme
  const renderKPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="bg-gradient-to-br from-knox-blue-500 to-knox-blue-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm">Open Rate</p>
            <h3 className="text-3xl font-bold">{analyticsData.overview.openRate}%</h3>
            <div className="flex items-center mt-1 text-blue-100">
              {analyticsData.compareToLastPeriod.openRate.trend === "up" ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span className="text-xs">
                {analyticsData.compareToLastPeriod.openRate.trend === "up" ? "+" : "-"}
                {analyticsData.compareToLastPeriod.openRate.change}% from last period
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Mail size={24} className="text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-br from-knox-teal-500 to-knox-teal-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-green-100 text-sm">Reply Rate</p>
            <h3 className="text-3xl font-bold">{analyticsData.overview.replyRate}%</h3>
            <div className="flex items-center mt-1 text-green-100">
              {analyticsData.compareToLastPeriod.replyRate.trend === "up" ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span className="text-xs">
                {analyticsData.compareToLastPeriod.replyRate.trend === "up" ? "+" : "-"}
                {analyticsData.compareToLastPeriod.replyRate.change}% from last period
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <MessageSquare size={24} className="text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-purple-100 text-sm">Security Demos</p>
            <h3 className="text-3xl font-bold">{analyticsData.overview.meetingRate}%</h3>
            <div className="flex items-center mt-1 text-purple-100">
              {analyticsData.compareToLastPeriod.meetingRate.trend === "up" ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span className="text-xs">
                {analyticsData.compareToLastPeriod.meetingRate.trend === "up" ? "+" : "-"}
                {analyticsData.compareToLastPeriod.meetingRate.change}% from last period
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-yellow-100 text-sm">Security Assessments</p>
            <h3 className="text-3xl font-bold">{analyticsData.overview.totalMeetings}</h3>
            <div className="flex items-center mt-1 text-yellow-100">
              <TrendingUp size={16} className="mr-1" />
              <span className="text-xs">+{analyticsData.overview.totalMeetings * 0.3 | 0} from last period</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Lock size={24} className="text-white" />
          </div>
        </div>
      </Card>
    </div>
  );

  // Security-focused visualization - Replace job title chart with security roles chart
  const renderSecurityRoleChart = () => (
    <div className="h-64 w-full flex items-center justify-center">
      <div className="w-full h-full flex">
        <div className="w-16 flex flex-col justify-between text-right">
          <span className="text-xs text-gray-500">50%</span>
          <span className="text-xs text-gray-500">40%</span>
          <span className="text-xs text-gray-500">30%</span>
          <span className="text-xs text-gray-500">20%</span>
          <span className="text-xs text-gray-500">10%</span>
          <span className="text-xs text-gray-500">0%</span>
        </div>
        <div className="flex-1 border-t border-l border-gray-200 relative">
          {/* Bar chart */}
          <div className="absolute bottom-0 left-0 w-full h-full flex justify-around items-end px-6">
            {[
              { role: 'CISO', openRate: 46, color: 'bg-knox-blue-600' },
              { role: 'Security Director', openRate: 42, color: 'bg-knox-blue-500' },
              { role: 'DevSecOps', openRate: 38, color: 'bg-knox-teal-500' },
              { role: 'Cloud Security', openRate: 44, color: 'bg-knox-teal-600' }
            ].map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-12 ${data.color} rounded-t-sm`} 
                  style={{ height: `${data.openRate}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.role}</span>
              </div>
            ))}
          </div>
          
          {/* Horizontal grid lines */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="h-1/5 border-b border-gray-100"></div>
            <div className="h-1/5 border-b border-gray-100"></div>
            <div className="h-1/5 border-b border-gray-100"></div>
            <div className="h-1/5 border-b border-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Security-focused visualization for industry table
  const renderSecurityTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Industry
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Security Concerns
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Rate
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversion
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[
            { industry: "Financial Services", concerns: "Compliance, Data Protection", openRate: 44, replyRate: 5.5, meetingRate: 1.9 },
            { industry: "Healthcare", concerns: "HIPAA, PHI Protection", openRate: 38, replyRate: 4.2, meetingRate: 1.2 },
            { industry: "Technology", concerns: "DevSecOps, Container Security", openRate: 46, replyRate: 5.2, meetingRate: 1.7 },
            { industry: "Government", concerns: "Zero Trust, Compliance", openRate: 32, replyRate: 3.2, meetingRate: 0.9 },
            { industry: "Retail", concerns: "PCI-DSS, Supply Chain", openRate: 36, replyRate: 3.8, meetingRate: 1.1 }
          ].map((industry, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{industry.industry}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{industry.concerns}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        industry.openRate >= 40 ? 'bg-green-500' : 
                        industry.openRate >= 30 ? 'bg-blue-500' : 
                        industry.openRate >= 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${industry.openRate * 2}%` }}
                    ></div>
                  </div>
                  <span>{industry.openRate}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        industry.replyRate >= 5 ? 'bg-green-500' : 
                        industry.replyRate >= 3 ? 'bg-blue-500' : 
                        industry.replyRate >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${industry.replyRate * 12}%` }}
                    ></div>
                  </div>
                  <span>{industry.replyRate}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Security-focused AI insight cards
  const renderSecurityInsightCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        {
          id: "1",
          category: "Targeting",
          title: "CISO Engagement Strategy",
          insight: "Messaging focused on container runtime security shows 42% higher engagement with CISOs and security directors.",
          recommendation: "Prioritize runtime protection in your outreach to security leadership roles.",
          confidenceScore: 87
        },
        {
          id: "2",
          category: "Content",
          title: "Compliance Messaging Impact",
          insight: "Emails mentioning specific compliance frameworks (PCI-DSS, HIPAA) relevant to the recipient's industry perform 35% better.",
          recommendation: "Tailor compliance messaging to each industry's specific regulatory requirements.",
          confidenceScore: 92
        },
        {
          id: "3", 
          category: "Timing",
          title: "Security Assessment Scheduling",
          insight: "Tuesday and Wednesday mornings show 38% higher acceptance rates for security assessment meetings.",
          recommendation: "Schedule security demos and assessments midweek during morning hours.",
          confidenceScore: 85
        }
      ].map((insight) => (
        <div 
          key={insight.id}
          className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
        >
          <div className="flex items-start mb-3">
            <div className="bg-knox-blue-100 p-2 rounded-full mr-3">
              <Sparkles size={16} className="text-knox-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{insight.title}</h4>
              <p className="text-xs text-gray-500">{insight.category} • {insight.confidenceScore}% confidence</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{insight.insight}</p>
        </div>
      ))}
    </div>
  );

  // New security-focused audience tab content
  const renderSecurityAudienceTab = () => (
    <div className="space-y-6">
      <Card title="Performance by Security Role">
        {renderSecurityRoleChart()}
        
        <div className="mt-4 bg-blue-50 p-4 rounded-md">
          <div className="flex items-start">
            <Sparkles size={18} className="text-knox-blue-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>AI Insight:</strong> CISOs and Cloud Security Architects show the highest engagement rates with container security content, while DevSecOps teams respond better to technical implementation details.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Performance by Industry">
        {renderSecurityTable()}
        
        <div className="mt-4 bg-blue-50 p-4 rounded-md">
          <div className="flex items-start">
            <Sparkles size={18} className="text-knox-blue-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>AI Insight:</strong> Financial services and technology companies show the highest engagement with container security content. Consider allocating more resources to these segments and emphasizing compliance automation for financial services prospects.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Security-focused overview tab
  const renderSecurityOverviewTab = () => (
    <div>
      {renderKPICards()}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Security Engagement by Stage">
          {renderEmailFunnel()}
          
          <div className="mt-4 bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <Sparkles size={18} className="text-knox-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>AI Insight:</strong> The largest drop-off occurs between 
                  "Opened" and "Clicked". Security teams require more compelling content to move forward.
                  Consider adding more technical details and compliance benefits.
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="Performance by Security Role">
          {renderSecurityRoleChart()}
          
          <div className="mt-4 bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <Sparkles size={18} className="text-knox-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>AI Insight:</strong> CISOs and Cloud Security Architects have the highest engagement rates.
                  Consider allocating more resources to these segments and creating role-specific content.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Engagement Analytics</h2>
        <p className="text-gray-600">Visualize engagement performance with AI insights</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-knox-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
          
          <Button
            variant="outline"
            icon={<Filter size={16} />}
            className="hidden md:flex"
          >
            Add Filter
          </Button>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <label htmlFor="ai-insights" className="text-sm font-medium text-gray-700 mr-2">
              AI Insights
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="ai-insights"
                checked={showAiInsights}
                onChange={() => setShowAiInsights(!showAiInsights)}
                className="sr-only"
              />
              <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                  showAiInsights ? 'transform translate-x-4 bg-knox-blue-600' : ''
                }`}
              ></div>
            </div>
          </div>
          
          <Button
            variant="outline"
            icon={<Download size={16} />}
          >
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Analytics Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview'
              ? 'border-knox-blue-600 text-knox-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <LayoutDashboard size={18} className="mr-2" />
              <span>Overview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'email'
              ? 'border-knox-blue-600 text-knox-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Mail size={18} className="mr-2" />
              <span>Email Performance</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('timing')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'timing'
              ? 'border-knox-blue-600 text-knox-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <CalendarDays size={18} className="mr-2" />
              <span>Time Analysis</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('audience')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'audience'
              ? 'border-knox-blue-600 text-knox-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <ShieldAlert size={18} className="mr-2" />
              <span>Security Audience</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'insights'
              ? 'border-knox-blue-600 text-knox-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Sparkles size={18} className="mr-2" />
              <span>AI Insights</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div>
          {activeTab === 'overview' && renderSecurityOverviewTab()}
          {activeTab === 'email' && renderEmailPerformanceTab()}
          {activeTab === 'timing' && renderTimingTab()}
          {activeTab === 'audience' && renderSecurityAudienceTab()}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">AI-Generated Security Insights</h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw size={14} />}
                >
                  Refresh Insights
                </Button>
              </div>
              {renderSecurityInsightCards()}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 flex justify-end">
        <Button
          variant="primary"
          onClick={() => window.open('#/analytics-details', '_blank')}
          icon={<ArrowUpRight size={16} />}
        >
          Export Security Analytics Report
        </Button>
      </div>
      
      <ChatModal 
        agentName="KnoxEngage Analytics Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'I can help you understand your security engagement performance and identify optimization opportunities. What metrics are you most interested in improving?',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};