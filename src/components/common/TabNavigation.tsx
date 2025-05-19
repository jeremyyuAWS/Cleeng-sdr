import React from 'react';
import { Target, Users, Mail, Calendar, BarChart3, Settings, Book, Sparkles, Shield, Headset, Lock, Server, Database, Shield as FileShield, ShieldAlert } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onChange 
}) => {
  const getIcon = (iconName: string, isActive: boolean) => {
    const props = { 
      size: 18, 
      className: isActive ? 'text-cleeng-blue-500' : 'text-gray-500' 
    };

    switch (iconName) {
      case 'Target':
        return <Target {...props} />;
      case 'Users':
        return <Users {...props} />;
      case 'Mail':
        return <Mail {...props} />;
      case 'Calendar':
        return <Calendar {...props} />;
      case 'BarChart3':
        return <BarChart3 {...props} />;
      case 'Book':
        return <Book {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Shield':
        return <ShieldAlert {...props} />;
      case 'Lock':
        return <Lock {...props} />;
      case 'Headset':
        return <Headset {...props} />;
      case 'Settings':
        return <Settings {...props} />;
      case 'FileShield':
        return <FileShield {...props} />;
      case 'Server':
        return <Server {...props} />;
      case 'Database':
        return <Database {...props} />;
      default:
        return <Target {...props} />;
    }
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              data-tab={tab.id}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${isActive 
                  ? 'border-cleeng-green-500 text-cleeng-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                transition-colors duration-200 whitespace-nowrap
              `}
            >
              <span className="mr-2">
                {getIcon(tab.icon, isActive)}
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};