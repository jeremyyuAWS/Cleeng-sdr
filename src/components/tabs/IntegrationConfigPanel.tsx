import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import { 
  Plug, 
  Check, 
  X, 
  Settings, 
  Layers, 
  Bot, 
  Database, 
  Mail, 
  RefreshCw,
  PlusCircle,
  Linkedin
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  logoPath: string;
  category: 'AI' | 'Data' | 'Email' | 'CRM' | 'Social';
  status: 'connected' | 'disconnected';
  benefits: string[];
}

export const IntegrationConfigPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const integrations: Integration[] = [
    {
      id: 'utopian',
      name: 'Utopian Labs',
      description: 'AI-powered research, ICP generation, and timing optimization',
      logoPath: '',
      category: 'AI',
      status: 'connected',
      benefits: [
        'Improved ICP accuracy by 37%',
        'Optimal send-time recommendations',
        'Personalized content suggestions',
      ]
    },
    {
      id: 'apollo',
      name: 'Apollo.io',
      description: 'Lead enrichment and intelligence data',
      logoPath: '/images/Apollo logo.png',
      category: 'Data',
      status: 'connected',
      benefits: [
        'Access to 200M+ B2B contacts',
        'Company and contact data enrichment',
        'Technographic and firmographic data',
      ]
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing and sales CRM with automation',
      logoPath: '/images/hubspot_logo.png',
      category: 'CRM',
      status: 'connected',
      benefits: [
        'Two-way contact synchronization',
        'Campaign performance tracking',
        'Email sequence integration',
      ]
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM integration for contact and opportunity management',
      logoPath: '/images/Salesforcelogo2.png',
      category: 'CRM',
      status: 'connected',
      benefits: [
        'Bi-directional data sync',
        'Campaign tracking in Salesforce',
        'Opportunity attribution',
      ]
    },
    {
      id: 'aws-ses',
      name: 'AWS SES',
      description: 'Email delivery service with high deliverability',
      logoPath: '',
      category: 'Email',
      status: 'connected',
      benefits: [
        '99.9% uptime and delivery rates',
        'DKIM and SPF authentication',
        'Detailed delivery metrics and feedback',
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Sales Navigator',
      description: 'Advanced lead and company search tools',
      logoPath: '/images/Linkedin logo square 2.png',
      category: 'Social',
      status: 'connected',
      benefits: [
        'Enhanced lead recommendations',
        'Advanced filtering and search',
        'Real-time lead updates',
      ]
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email delivery and marketing automation',
      logoPath: '',
      category: 'Email',
      status: 'disconnected',
      benefits: [
        'Advanced email deliverability',
        'Email template library',
        'A/B testing capabilities',
      ]
    },
    {
      id: 'leadgenius',
      name: 'LeadGenius',
      description: 'Lead enrichment, segmentation, and scoring',
      logoPath: '/images/leadgenius logo.jpeg',
      category: 'Data',
      status: 'disconnected',
      benefits: [
        'Enriched contact data with 98% accuracy',
        'AI-powered lead scoring',
        'Data-driven segment recommendations',
      ]
    },
  ];
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'bot':
        return <Bot size={20} className="text-blue-600" />;
      case 'database':
        return <Database size={20} className="text-blue-600" />;
      case 'mail':
        return <Mail size={20} className="text-blue-600" />;
      case 'layers':
        return <Layers size={20} className="text-blue-600" />;
      case 'linkedin':
        return <Linkedin size={20} className="text-blue-600" />;
      default:
        return <Plug size={20} className="text-blue-600" />;
    }
  };
  
  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category.toLowerCase() === activeCategory.toLowerCase());
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin & Integrations</h2>
        <p className="text-gray-600">Configure external services and view system settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card
            title="Integration Categories"
            className="mb-6"
          >
            <div className="space-y-2">
              <button 
                className={`w-full text-left p-2 rounded-md ${activeCategory === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveCategory('all')}
              >
                All Integrations
                <Badge className="ml-2">{integrations.length}</Badge>
              </button>
              
              <button 
                className={`w-full text-left p-2 rounded-md ${activeCategory === 'ai' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveCategory('ai')}
              >
                <div className="flex items-center">
                  <Bot size={16} className="mr-2" />
                  AI Services
                </div>
                <Badge className="ml-2">{integrations.filter(i => i.category === 'AI').length}</Badge>
              </button>
              
              <button 
                className={`w-full text-left p-2 rounded-md ${activeCategory === 'data' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveCategory('data')}
              >
                <div className="flex items-center">
                  <Database size={16} className="mr-2" />
                  Data Providers
                </div>
                <Badge className="ml-2">{integrations.filter(i => i.category === 'Data').length}</Badge>
              </button>
              
              <button 
                className={`w-full text-left p-2 rounded-md ${activeCategory === 'email' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveCategory('email')}
              >
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Services
                </div>
                <Badge className="ml-2">{integrations.filter(i => i.category === 'Email').length}</Badge>
              </button>
              
              <button 
                className={`w-full text-left p-2 rounded-md ${activeCategory === 'crm' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveCategory('crm')}
              >
                <div className="flex items-center">
                  <Layers size={16} className="mr-2" />
                  CRM Systems
                </div>
                <Badge className="ml-2">{integrations.filter(i => i.category === 'CRM').length}</Badge>
              </button>
              
              <button 
                className={`w-full text-left p-2 rounded-md ${activeCategory === 'social' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveCategory('social')}
              >
                <div className="flex items-center">
                  <Linkedin size={16} className="mr-2" />
                  Social Media
                </div>
                <Badge className="ml-2">{integrations.filter(i => i.category === 'Social').length}</Badge>
              </button>
            </div>
          </Card>
          
          <Card title="System Settings">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">API Credits</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-cleeng-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Used: 7,000</span>
                  <span className="text-xs text-gray-500">Total: 10,000</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Data Sync Status</h4>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Last sync: 15 minutes ago</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                fullWidth
                icon={<RefreshCw size={16} />}
              >
                Force Sync Now
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                icon={<Settings size={16} />}
              >
                Advanced Settings
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Available Integrations</h3>
            <p className="text-sm text-gray-600">
              Connect your preferred services to enhance Cleengage's capabilities.
            </p>
          </div>
          
          <div className="space-y-4">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                      {integration.logoPath ? (
                        <img 
                          src={integration.logoPath} 
                          alt={`${integration.name} logo`} 
                          className="w-full h-full object-contain p-1"
                        />
                      ) : integration.category === 'AI' ? (
                        <Bot size={20} className="text-blue-600" />
                      ) : integration.category === 'Data' ? (
                        <Database size={20} className="text-blue-600" />
                      ) : integration.category === 'Email' ? (
                        <Mail size={20} className="text-blue-600" />
                      ) : integration.category === 'Social' ? (
                        <Linkedin size={20} className="text-blue-600" />
                      ) : (
                        <Layers size={20} className="text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  
                  {integration.status === 'connected' ? (
                    <Badge variant="success" className="flex items-center">
                      <Check size={12} className="mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      icon={<PlusCircle size={14} />}
                    >
                      Connect
                    </Button>
                  )}
                </div>
                
                {integration.status === 'connected' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Integration Benefits</h5>
                    <div className="space-y-1">
                      {integration.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start">
                          <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                          <p className="text-sm text-gray-600">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              icon={<PlusCircle size={16} />}
            >
              Browse Integration Marketplace
            </Button>
          </div>
        </div>
      </div>
      
      <ChatModal 
        agentName="Cleengage Admin Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'I can help you configure CRM integrations and system settings. What would you like to set up or modify?',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};