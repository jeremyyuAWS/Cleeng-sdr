import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ChatModal } from '../common/ChatModal';
import { 
  Linkedin, 
  UserPlus, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  BellDot, 
  Users, 
  UserCheck,
  Calendar,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FileCog,
  FileText,
  PlusCircle
} from 'lucide-react';

export const LinkedInAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'connections' | 'messages' | 'settings'>('campaigns');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data
  const campaigns = [
    { 
      id: '1',
      name: 'VP Sales Outreach',
      status: 'active',
      targets: 124,
      pending: 56,
      connected: 42,
      responded: 18,
      meetings: 5,
      lastRun: '2 hours ago'
    },
    { 
      id: '2',
      name: 'Marketing Directors',
      status: 'paused',
      targets: 87,
      pending: 32,
      connected: 28,
      responded: 14,
      meetings: 3,
      lastRun: '1 day ago'
    },
    { 
      id: '3',
      name: 'SaaS Founders',
      status: 'draft',
      targets: 45,
      pending: 0,
      connected: 0,
      responded: 0,
      meetings: 0,
      lastRun: 'Not started'
    }
  ];

  const pendingConnections = 56;
  const newMessages = 12;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">LinkedIn Automation</h2>
        <p className="text-gray-600">Automate LinkedIn outreach while maintaining a personal touch</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-cleeng-blue-600 text-cleeng-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Play size={18} className="mr-2" />
              <span>Campaigns</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'connections'
                ? 'border-cleeng-blue-600 text-cleeng-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <UserPlus size={18} className="mr-2" />
              <span>Connection Requests</span>
              {pendingConnections > 0 && (
                <Badge className="ml-2">{pendingConnections}</Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-cleeng-blue-600 text-cleeng-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <MessageSquare size={18} className="mr-2" />
              <span>Messages</span>
              {newMessages > 0 && (
                <Badge className="ml-2">{newMessages}</Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-cleeng-blue-600 text-cleeng-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Settings size={18} className="mr-2" />
              <span>Settings</span>
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cleeng-blue-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                icon={<Filter size={16} />}
              >
                Filter
              </Button>
              <Button
                variant="primary"
                icon={<Plus size={16} />}
              >
                New Campaign
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {campaigns.map(campaign => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                  <Badge 
                    variant={
                      campaign.status === 'active' ? 'success' : 
                      campaign.status === 'paused' ? 'warning' : 'default'
                    }
                  >
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Targets:</span>
                    <span className="font-medium">{campaign.targets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pending:</span>
                    <span className="font-medium">{campaign.pending}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Connected:</span>
                    <span className="font-medium">{campaign.connected}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Responded:</span>
                    <span className="font-medium">{campaign.responded}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Meetings:</span>
                    <span className="font-medium">{campaign.meetings}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <Clock size={12} className="inline-block mr-1" />
                    Last run: {campaign.lastRun}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    icon={campaign.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                  >
                    {campaign.status === 'active' ? 'Pause' : campaign.status === 'paused' ? 'Resume' : 'Start'}
                  </Button>
                </div>
              </Card>
            ))}
            
            <Card className="flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-300 hover:bg-gray-100 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-cleeng-blue-100 flex items-center justify-center mb-4">
                <PlusCircle size={24} className="text-cleeng-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Create New Campaign</h3>
              <p className="text-gray-500 text-sm text-center mb-3">
                Define targeting, connection messages, and follow-up sequence
              </p>
              <Button
                variant="primary"
                icon={<Plus size={16} />}
              >
                New Campaign
              </Button>
            </Card>
          </div>
          
          <Card title="Campaign Performance">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Connection Request Performance</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Last 30 days</span>
                  <ChevronDownIcon size={16} />
                </div>
              </div>
              
              <div className="h-64 w-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md">
                {/* Chart would go here - showing a placeholder for demo */}
                <div className="text-gray-500 italic">LinkedIn Connection Request Analytics</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-sm text-gray-500 mb-1">Connection Rate</div>
                  <div className="text-xl font-bold text-cleeng-blue-600">37.4%</div>
                  <div className="text-xs text-green-600">+5.2% vs last month</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-sm text-gray-500 mb-1">Response Rate</div>
                  <div className="text-xl font-bold text-cleeng-blue-600">21.8%</div>
                  <div className="text-xs text-green-600">+3.7% vs last month</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-sm text-gray-500 mb-1">Meeting Rate</div>
                  <div className="text-xl font-bold text-cleeng-blue-600">4.2%</div>
                  <div className="text-xs text-green-600">+1.1% vs last month</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-sm text-gray-500 mb-1">Avg. Response Time</div>
                  <div className="text-xl font-bold text-cleeng-blue-600">8h</div>
                  <div className="text-xs text-red-600">+2h vs last month</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <div className="text-blue-600 mt-0.5 mr-3">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">AI Insights</h3>
                  <p className="text-sm text-blue-700">
                    Your connection acceptance rate is 12% higher when you include a personalized note referencing the prospect's recent content activity. Consider enabling the "Content Engagement" feature to automatically reference recent posts in your connection requests.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-white"
                  >
                    Enable Content Engagement
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'connections' && (
        <div className="space-y-6">
          <Card>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Pending Connection Requests</h3>
              <p className="text-gray-600 text-sm">Manage your outgoing LinkedIn connection requests</p>
            </div>
            
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">John Smith {index + 1}</div>
                            <div className="text-sm text-gray-500">VP Sales at Technology Inc</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">VP Sales Outreach</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{index + 1} day{index !== 0 ? 's' : ''} ago</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge>Pending</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">New Connections</h3>
              <p className="text-gray-600 text-sm">People who recently accepted your connection requests</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Sarah Johnson {index + 1}</div>
                      <div className="text-xs text-gray-500">Marketing Director at Tech Company</div>
                      <div className="mt-2 flex">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          icon={<MessageSquare size={12} />}
                        >
                          Message
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs ml-2"
                          icon={<Calendar size={12} />}
                        >
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cleeng-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                {[...Array(10)].map((_, index) => (
                  <button 
                    key={index} 
                    className={`w-full text-left p-3 rounded-md ${index === 0 ? 'bg-cleeng-blue-50 border border-cleeng-blue-100' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                      <div className="ml-3">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium text-gray-900">David Miller {index + 1}</div>
                          <div className="text-xs text-gray-500">2h ago</div>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {index % 2 === 0 ? 'Thanks for reaching out! I would...' : 'I would be interested in learning more about...'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">David Miller</div>
                      <div className="text-xs text-gray-500">VP Sales at Enterprise Corp</div>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Calendar size={14} />}
                    >
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-cleeng-blue-500 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p>Hi David, I noticed your recent post about sales automation challenges. Our platform might be a good fit for what you're looking to solve. Would you be open to a quick chat about it?</p>
                      <div className="text-xs text-cleeng-blue-100 text-right mt-1">Sent 2 days ago</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p>Thanks for reaching out! I would definitely be interested in learning more about your solution. We've been struggling with scaling our outreach effectively.</p>
                      <div className="text-xs text-gray-500 mt-1">Received yesterday</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-cleeng-blue-500 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p>Great to hear that! I'd be happy to show you how our platform can help scale your outreach while maintaining personalization. Would you have 15 minutes tomorrow or Wednesday for a quick demo?</p>
                      <div className="text-xs text-cleeng-blue-100 text-right mt-1">Sent yesterday</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p>Wednesday would work! How about 2pm Eastern?</p>
                      <div className="text-xs text-gray-500 mt-1">Received 2 hours ago</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-l-md p-2 min-h-[100px]">
                      <div className="bg-blue-50 p-2 rounded mb-2 text-sm text-blue-800">
                        <div className="flex items-start">
                          <div className="text-blue-600 mt-0.5 mr-2">
                            <RefreshCw size={14} />
                          </div>
                          <p>
                            <span className="font-medium">AI Suggestion:</span> Confirm the meeting time and send a calendar invite with meeting details and agenda.
                          </p>
                        </div>
                      </div>
                      <textarea 
                        placeholder="Type your message..." 
                        className="w-full bg-transparent border-0 focus:ring-0 resize-none text-sm p-0"
                        defaultValue="Perfect! I'll send over a calendar invite for Wednesday at 2pm Eastern. Looking forward to our conversation and showing you how we can help scale your outreach efforts. Would you prefer Google Meet or Zoom?"
                      ></textarea>
                    </div>
                    <Button
                      className="rounded-l-none h-full"
                    >
                      Send
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      AI suggestions based on conversation history and best practices
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        icon={<Calendar size={14} />}
                      >
                        Add Meeting Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        icon={<RefreshCw size={14} />}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">LinkedIn Account</h3>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-start">
                <CheckCircle size={18} className="text-green-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Connected</h4>
                  <p className="text-sm text-green-700">Your LinkedIn account is connected and active</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">Account</div>
                  <div className="text-sm font-medium">john.doe@example.com</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">Profile</div>
                  <div className="text-sm font-medium">John Doe</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">Connection Limit</div>
                  <div className="text-sm font-medium">100/day</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">Message Limit</div>
                  <div className="text-sm font-medium">50/day</div>
                </div>
              </div>
              
              <Button
                variant="outline"
                fullWidth
                className="mt-4"
              >
                Reconnect Account
              </Button>
            </Card>
            
            <Card>
              <h3 className="font-medium text-gray-900 mb-4">Safety Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Daily Connection Limit
                    </label>
                    <span className="text-xs text-gray-500">
                      Recommended: 25-50
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    defaultValue="30"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>30 connections</span>
                    <span>100</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Daily Message Limit
                    </label>
                    <span className="text-xs text-gray-500">
                      Recommended: 20-40
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    defaultValue="25"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>25 messages</span>
                    <span>100</span>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-cleeng-blue-600 focus:ring-cleeng-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-700">Random delay between actions (30-90 seconds)</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-cleeng-blue-600 focus:ring-cleeng-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-700">Avoid LinkedIn's peak hours</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-cleeng-blue-600 focus:ring-cleeng-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable MCP (Meaningful Connection Points) model</span>
                  </label>
                  <p className="ml-6 text-xs text-gray-500 mt-1">
                    Uses AI to find meaningful points of connection in profiles
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    fullWidth
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Message Templates</h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">Connection Request</h4>
                    <Badge>Default</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Hi {{firstName}}, I came across your profile and noticed we're both in the {{industry}} space. I'd love to connect and learn more about your work at {{company}}. Would you be open to connecting?
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FileCog size={14} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FileText size={14} />}
                    >
                      Duplicate
                    </Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">Follow-up Message</h4>
                    <Badge>Default</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Hi {{firstName}}, thanks for connecting! I noticed that {{company}} has been doing amazing work in {{industry}}. I'd love to share how our platform has been helping similar companies improve their outreach and CRM integration. Would you be open to a quick chat?
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FileCog size={14} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FileText size={14} />}
                    >
                      Duplicate
                    </Button>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  icon={<Plus size={16} />}
                  fullWidth
                >
                  Add Template
                </Button>
              </div>
            </Card>
            
            <Card>
              <h3 className="font-medium text-gray-900 mb-4">CRM Integration</h3>
              
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mt-0.5 mr-3">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Two-way Sync</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      LinkedIn connections and conversations are automatically synced with your CRM system. New contacts are created, and conversation histories are logged as activities.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <div className="flex items-center mb-1">
                          <img src="/images/Hubspot logo.png" alt="HubSpot" className="h-5 w-5 mr-2" />
                          <h5 className="text-sm font-medium text-gray-900">HubSpot</h5>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle size={14} className="text-green-600 mr-1" />
                          <span className="text-xs text-green-700">Connected</span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <div className="flex items-center mb-1">
                          <img src="/images/Salesforcelogo2.png" alt="Salesforce" className="h-5 w-5 mr-2" />
                          <h5 className="text-sm font-medium text-gray-900">Salesforce</h5>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle size={14} className="text-green-600 mr-1" />
                          <span className="text-xs text-green-700">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sync Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-cleeng-blue-600 focus:ring-cleeng-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">Sync new connections as contacts</span>
                      </label>
                      <select className="text-sm border border-gray-300 rounded-md">
                        <option>All CRMs</option>
                        <option>HubSpot Only</option>
                        <option>Salesforce Only</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-cleeng-blue-600 focus:ring-cleeng-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">Sync messages as activities</span>
                      </label>
                      <select className="text-sm border border-gray-300 rounded-md">
                        <option>All CRMs</option>
                        <option>HubSpot Only</option>
                        <option>Salesforce Only</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-cleeng-blue-600 focus:ring-cleeng-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">Auto-create tasks for follow-ups</span>
                      </label>
                      <select className="text-sm border border-gray-300 rounded-md">
                        <option>All CRMs</option>
                        <option>HubSpot Only</option>
                        <option>Salesforce Only</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-cleeng-blue-600 focus:ring-cleeng-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">Sync LinkedIn profile data</span>
                      </label>
                      <select className="text-sm border border-gray-300 rounded-md">
                        <option>All CRMs</option>
                        <option>HubSpot Only</option>
                        <option>Salesforce Only</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    fullWidth
                  >
                    Save Integration Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      <ChatModal 
        agentName="Cleengage LinkedIn Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: "I can help you create effective LinkedIn automation campaigns while maintaining a personal touch. How would you like to improve your LinkedIn outreach today?",
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};

function ChevronDownIcon(props: { size: number }) {
  return <ChevronDown size={props.size} />;
}

export default LinkedInAutomation;