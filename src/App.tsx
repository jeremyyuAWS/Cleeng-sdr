import React, { useState } from 'react';
import { TabNavigation } from './components/common/TabNavigation';
import { ICPGenerator } from './components/tabs/ICPGenerator';
import { LeadEnrichment } from './components/tabs/LeadEnrichment';
import { EmailComposer } from './components/tabs/EmailComposer';
import { SequenceScheduler } from './components/tabs/SequenceScheduler';
import { AnalyticsDashboard } from './components/tabs/AnalyticsDashboard';
import { IntegrationConfigPanel } from './components/tabs/IntegrationConfigPanel';
import { KnowledgeLibrary } from './components/tabs/KnowledgeLibrary';
import { SalesIntelligence } from './components/tabs/SalesIntelligence';
import { ResponsibleAI } from './components/tabs/ResponsibleAI';
import { CustomerSupport } from './components/tabs/CustomerSupport';
import { WelcomeModal } from './components/common/WelcomeModal';

function App() {
  const [activeTab, setActiveTab] = useState('icp');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const tabs = [
    { id: 'icp', label: 'ICP Generator', icon: 'Target' },
    { id: 'leads', label: 'Lead Enrichment', icon: 'Users' },
    { id: 'intelligence', label: 'Sales Intelligence', icon: 'Sparkles' },
    { id: 'email', label: 'Email Composer', icon: 'Mail' },
    { id: 'sequence', label: 'Sequence Scheduler', icon: 'Calendar' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'knowledge', label: 'Knowledge Library', icon: 'Book' },
    { id: 'support', label: 'Customer Support', icon: 'Headset' },
    { id: 'responsible', label: 'Security & Compliance', icon: 'Shield' },
    { id: 'admin', label: 'Admin & Integrations', icon: 'Settings' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'icp':
        return <ICPGenerator />;
      case 'leads':
        return <LeadEnrichment />;
      case 'intelligence':
        return <SalesIntelligence />;
      case 'email':
        return <EmailComposer />;
      case 'sequence':
        return <SequenceScheduler />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'knowledge':
        return <KnowledgeLibrary />;
      case 'support':
        return <CustomerSupport />;
      case 'responsible':
        return <ResponsibleAI />;
      case 'admin':
        return <IntegrationConfigPanel />;
      default:
        return <ICPGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}
      
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <img 
                  src="/images/cleeng-logo.png" 
                  alt="Cleeng Logo" 
                  className="h-8 w-auto mr-2"
                />
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-cleeng-blue-600">Cleen</span>gage
                </h1>
              </div>
              <p className="ml-4 text-sm text-gray-500 hidden md:block">AI-powered outreach and CRM sync platform</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        <div className="mt-6">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;