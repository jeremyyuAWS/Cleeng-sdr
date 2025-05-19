import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  Headset, 
  MessageSquare, 
  Search, 
  Send, 
  User, 
  RefreshCw, 
  Clock, 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  Video,
  Download,
  Upload, 
  ArrowUpRight,
  ExternalLink,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
  X
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  helpful?: boolean;
  sources?: string[];
}

interface SupportArticle {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  content: string;
  tags: string[];
  views: number;
}

export const CustomerSupport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi there! I'm your KnoxEngage Support Assistant. I can help you with product questions, cybersecurity best practices, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "How do I set up my first email sequence?",
    "Can I import contacts from my CRM?",
    "How does AI contact enrichment work?",
    "What security features are included?"
  ]);
  const [recentTickets, setRecentTickets] = useState([
    { id: "T-1234", title: "Email sequence not sending", status: "open", lastUpdate: "2 hours ago" },
    { id: "T-1233", title: "Data importing issue", status: "resolved", lastUpdate: "1 day ago" }
  ]);
  const [popularArticles, setPopularArticles] = useState<SupportArticle[]>([
    {
      id: "a1",
      title: "Getting Started Guide",
      category: "Onboarding",
      lastUpdated: "2023-12-15",
      content: "A comprehensive guide to setting up your KnoxEngage account, configuring your first ICP, and launching your initial outreach campaign.",
      tags: ["beginners", "setup", "configuration"],
      views: 1245
    },
    {
      id: "a2",
      title: "Security Best Practices",
      category: "Security",
      lastUpdated: "2023-12-10",
      content: "Learn how to leverage KnoxEngage's security features to maximize the protection of your data and ensure compliance with regulations.",
      tags: ["security", "best practices", "compliance"],
      views: 987
    },
    {
      id: "a3",
      title: "Email Deliverability Guide",
      category: "Email",
      lastUpdated: "2023-12-08",
      content: "Essential tips to ensure your emails reach the inbox, including domain authentication, warm-up strategies, and content optimization.",
      tags: ["deliverability", "email", "SPF", "DKIM"],
      views: 873
    }
  ]);
  
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<SupportArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('New Conversation');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Effect for scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  // Effect to focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newUserMessage]);
    setInput('');
    setIsTyping(true);
    
    // For demo, automatically show feedback for the second assistant message
    if (messages.length === 1) {
      setTimeout(() => setShowFeedback('2'), 6000);
    }
    
    // Simulate AI response based on input
    setTimeout(() => {
      let responseContent = "";
      let sources = [];
      
      // Check for product-related keywords
      if (input.toLowerCase().includes("pricing") || input.toLowerCase().includes("cost")) {
        responseContent = "KnoxEngage offers several pricing tiers to fit your needs:\n\n" +
          "• Starter: $499/month - Up to 5 users, 2,500 contacts\n" +
          "• Professional: $999/month - Up to 15 users, 10,000 contacts\n" +
          "• Enterprise: $2,499/month - Unlimited users and contacts\n\n" +
          "All plans include basic email templates, CRM integration, standard analytics, and our core security features. Would you like to schedule a demo with our sales team to discuss which plan is right for you?";
        sources = ["doc-1"];
      } 
      // Check for setup-related keywords
      else if (input.toLowerCase().includes("setup") || input.toLowerCase().includes("start") || input.toLowerCase().includes("begin")) {
        responseContent = "To get started with KnoxEngage, follow these steps:\n\n" +
          "1. Define your Ideal Customer Profile in the ICP Generator tab\n" +
          "2. Import or find contacts that match your ICP in the Contact Enrichment tab\n" +
          "3. Create email templates in the Engagement Composer tab\n" +
          "4. Build a sequence in the Sequence Scheduler tab\n" +
          "5. Launch your campaign and monitor results in the Analytics Dashboard\n\n" +
          "Would you like me to walk you through any of these steps in more detail?";
        sources = ["a1"];
      }
      // Check for security-related keywords 
      else if (input.toLowerCase().includes("security") || input.toLowerCase().includes("protection") || input.toLowerCase().includes("compliance")) {
        responseContent = "KnoxEngage incorporates robust security features throughout the platform:\n\n" +
          "• Data Encryption: All data is encrypted both in transit and at rest\n" +
          "• Access Controls: Role-based permissions and multi-factor authentication\n" +
          "• Compliance: We maintain SOC 2, ISO 27001, and GDPR compliance\n" +
          "• Audit Logging: Comprehensive logging of all system activities\n" +
          "• PII Protection: Automatic detection and masking of sensitive information\n\n" +
          "For more details, you can visit our Security tab or I can elaborate on any specific area.";
        sources = ["a2"];
      }
      // Check for integration-related keywords 
      else if (input.toLowerCase().includes("integration") || input.toLowerCase().includes("connect") || input.toLowerCase().includes("crm")) {
        responseContent = "KnoxEngage integrates seamlessly with popular CRM systems including Salesforce, HubSpot, and Zoho. Our platform provides bi-directional data synchronization to ensure that all contact data, activity history, and campaign performance metrics are accurately reflected in both systems.\n\n" +
          "To set up an integration, navigate to the Admin & Integrations tab, select your CRM, and follow the OAuth authorization process. Let me know if you need help with a specific integration!";
        sources = ["doc-4"];
      }
      // Default response
      else {
        responseContent = "Thanks for your question. Based on what you're asking about, I think I can help you with that. Would you like me to provide more specific information on this topic, or would you prefer to see our documentation or speak with a human agent?";
      }
      
      const newAssistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        sources
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      setIsTyping(false);
    }, 2000);
  };
  
  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
    // Optional: auto-send the message
    setTimeout(() => {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: question,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newUserMessage]);
      setInput('');
      setIsTyping(true);
      
      // Generate response based on the question
      setTimeout(() => {
        let responseContent = "";
        
        if (question === "How do I set up my first email sequence?") {
          responseContent = "Setting up your first email sequence is easy! Here's a step-by-step guide:\n\n" +
            "1. Go to the 'Sequence Scheduler' tab in the main navigation\n" +
            "2. Click the 'Add Step' button to create your first sequence step\n" +
            "3. Choose a step type (email, LinkedIn, or task)\n" +
            "4. For email steps, select a template from your library or create a new one\n" +
            "5. Set the delay days and optimal send time (or enable Smart Send-Time AI)\n" +
            "6. Repeat for additional steps in your sequence\n" +
            "7. Click 'Activate Sequence' when you're ready to launch\n\n" +
            "Would you like me to explain any of these steps in more detail?";
        } 
        else if (question === "Can I import contacts from my CRM?") {
          responseContent = "Yes, you can import contacts directly from your CRM system! KnoxEngage integrates with Salesforce, HubSpot, Pipedrive, and most other popular CRMs.\n\n" +
            "To import contacts:\n" +
            "1. Go to the 'Contact Enrichment' tab\n" +
            "2. Click 'Add Contacts' and select your CRM from the integrations menu\n" +
            "3. Configure the field mapping to match your CRM fields to KnoxEngage fields\n" +
            "4. Select the contacts you want to import\n" +
            "5. Click 'Import & Enrich' to bring them into KnoxEngage with additional data\n\n" +
            "You can also set up automatic syncing to keep your CRM and KnoxEngage data in sync.";
        }
        else if (question === "How does AI contact enrichment work?") {
          responseContent = "Our AI contact enrichment process works in several layers:\n\n" +
            "1. Basic Enrichment: We fill in missing company and contact information using our proprietary database of over 200M profiles\n\n" +
            "2. Security Context: We analyze the company's security posture, tech stack, and potential vulnerabilities\n\n" +
            "3. Intent Data: We incorporate technographic and intent signals to identify purchase readiness\n\n" +
            "4. ICP Matching: We score each contact against your Ideal Customer Profile to generate a fit score\n\n" +
            "5. AI Analysis: Our AI generates personalized talking points and security-focused recommendations specific to each contact\n\n" +
            "This multi-layered approach typically improves lead quality by 40% and increases conversion rates by 35%.";
        }
        else if (question === "What security features are included?") {
          responseContent = "KnoxEngage includes comprehensive security features:\n\n" +
            "• Data Encryption: All data encrypted in transit (TLS 1.3) and at rest (AES-256)\n" +
            "• Access Controls: Role-based permissions and multi-factor authentication\n" +
            "• Compliance: SOC 2 Type II, GDPR, and ISO 27001 compliance\n" +
            "• PII Protection: Automatic detection and masking of personal information\n" +
            "• Audit Logging: Detailed logs of all system activities and user actions\n" +
            "• Secrets Management: Secure storage and handling of API keys and credentials\n" +
            "• Regular Penetration Testing: Third-party security assessments\n" +
            "• Data Loss Prevention: Controls to prevent unauthorized data exfiltration\n\n" +
            "You can configure these features in the 'Security & Compliance' tab. Would you like more details on any specific security feature?";
        }
        else {
          responseContent = "I don't have a specific answer scripted for that question yet, but I'm happy to help. Could you provide more details about what you're looking to accomplish?";
        }
        
        const newAssistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newAssistantMessage]);
        setIsTyping(false);
      }, 1500);
    }, 100);
  };
  
  const handleFeedback = (messageId: string, isHelpful: boolean) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, helpful: isHelpful } : message
    ));
    setShowFeedback(null);
    
    // Show thank you message for feedback
    setTimeout(() => {
      const feedbackMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: isHelpful ? 
          "Thank you for your positive feedback! I'm glad I could help." : 
          "Thank you for your feedback. I'll work on improving my responses. Would you like me to connect you with a human support agent for better assistance?",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, feedbackMessage]);
    }, 500);
  };
  
  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "👋 Hi there! I'm your KnoxEngage Support Assistant. I can help you with product questions, cybersecurity best practices, and more. How can I assist you today?",
        timestamp: new Date(),
      }
    ]);
    setInput('');
    setShowFeedback(null);
    setConversationTitle('New Conversation');
  };
  
  const viewArticle = (article: SupportArticle) => {
    setSelectedArticle(article);
  };
  
  const closeArticle = () => {
    setSelectedArticle(null);
  };
  
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderSourceLink = (source: string) => {
    const article = popularArticles.find(a => a.id === source);
    if (article) {
      return (
        <button
          key={source}
          onClick={() => viewArticle(article)}
          className="inline-flex items-center text-blue-600 hover:underline text-sm mr-2"
        >
          <FileText size={14} className="mr-1" />
          {article.title}
        </button>
      );
    }
    
    // If not an article, assume it's a document from knowledge library
    return (
      <button
        key={source}
        className="inline-flex items-center text-blue-600 hover:underline text-sm mr-2"
        onClick={() => window.location.href = '#/knowledge'}
      >
        <FileText size={14} className="mr-1" />
        {source.includes('doc-') ? `Document Reference` : source}
        <ExternalLink size={12} className="ml-1" />
      </button>
    );
  };
  
  const renderCategory = (category: string) => {
    switch (category) {
      case 'Onboarding':
        return <Badge className="bg-green-100 text-green-800">{category}</Badge>;
      case 'Security':
        return <Badge className="bg-blue-100 text-blue-800">{category}</Badge>;
      case 'Email':
        return <Badge className="bg-purple-100 text-purple-800">{category}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{category}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Support</h2>
        <p className="text-gray-600">AI-powered assistance for your product and security questions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Search size={16} className="mr-2 text-gray-500" />
              Search Support
            </h3>
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 border-b-2 ${
                    activeCategory === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>
                <button
                  className={`py-2 px-4 border-b-2 ${
                    activeCategory === 'popular'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveCategory('popular')}
                >
                  Popular
                </button>
                <button
                  className={`py-2 px-4 border-b-2 ${
                    activeCategory === 'recent'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveCategory('recent')}
                >
                  Recent
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {popularArticles.map((article) => (
                <button
                  key={article.id}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => viewArticle(article)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{article.title}</h4>
                    {renderCategory(article.category)}
                  </div>
                  <p className="text-xs text-gray-500 mb-1 line-clamp-2">{article.content}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock size={12} className="mr-1" />
                    <span>Updated {article.lastUpdated}</span>
                    <span className="mx-2">•</span>
                    <span>{article.views.toLocaleString()} views</span>
                  </div>
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              icon={<ArrowUpRight size={16} />}
            >
              Browse All Articles
            </Button>
          </Card>
          
          <Card title="Your Support Tickets">
            {recentTickets.length > 0 ? (
              <div className="space-y-2">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full mr-2 bg-yellow-500"></div>
                        <p className="font-medium text-gray-900 text-sm">{ticket.title}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{ticket.id} • {ticket.lastUpdate}</div>
                    </div>
                    <Badge 
                      variant={ticket.status === 'open' ? 'info' : 'success'}
                      className="uppercase text-xs"
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <HelpCircle size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 mb-1">No support tickets</p>
                <p className="text-xs text-gray-500">Open a ticket if AI support can't resolve your issue</p>
              </div>
            )}
            
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              icon={<Plus size={16} />}
            >
              Create New Ticket
            </Button>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <Card>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-900">{selectedArticle.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span>Category: {selectedArticle.category}</span>
                    <span className="mx-2">•</span>
                    <span>Last updated: {selectedArticle.lastUpdated}</span>
                  </div>
                </div>
                <button
                  onClick={closeArticle}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none mb-6">
                <p>{selectedArticle.content}</p>
                
                {selectedArticle.title === "Getting Started Guide" && (
                  <>
                    <h4>Step 1: Create Your Account</h4>
                    <p>
                      After signing up, you'll be guided through the account creation process. Make sure to:
                    </p>
                    <ul>
                      <li>Complete your profile information</li>
                      <li>Configure your email sending domain</li>
                      <li>Set up SPF and DKIM records for better deliverability</li>
                    </ul>
                    
                    <h4>Step 2: Define Your Ideal Customer Profile</h4>
                    <p>
                      Navigate to the ICP Generator tab and define who your perfect customer is:
                    </p>
                    <ul>
                      <li>Specify industry, company size, and geography</li>
                      <li>Define target roles and decision makers</li>
                      <li>Identify key security pain points your solution addresses</li>
                    </ul>
                    
                    <h4>Step 3: Find and Enrich Contacts</h4>
                    <p>
                      Use the Contact Enrichment tab to:
                    </p>
                    <ul>
                      <li>Search for contacts matching your ICP</li>
                      <li>Import existing contacts from CSV or CRM</li>
                      <li>Enrich contacts with company and security data</li>
                    </ul>
                    
                    <h4>Step 4: Create Email Templates</h4>
                    <p>
                      In the Engagement Composer tab:
                    </p>
                    <ul>
                      <li>Create personalized email templates</li>
                      <li>Use AI to suggest subject lines and content</li>
                      <li>Configure personalization variables</li>
                    </ul>
                    
                    <h4>Step 5: Build Your Sequence</h4>
                    <p>
                      In the Sequence Scheduler tab:
                    </p>
                    <ul>
                      <li>Create multi-step outreach sequences</li>
                      <li>Set optimal timing between steps</li>
                      <li>Use Smart Send-Time AI for timing optimization</li>
                    </ul>
                    
                    <h4>Step 6: Launch and Monitor</h4>
                    <p>
                      Once everything is set up:
                    </p>
                    <ul>
                      <li>Activate your sequence</li>
                      <li>Monitor performance in the Analytics Dashboard</li>
                      <li>Optimize based on AI-generated insights</li>
                    </ul>
                  </>
                )}
                
                {selectedArticle.title === "Security Best Practices" && (
                  <>
                    <h4>Data Protection Measures</h4>
                    <p>
                      KnoxEngage implements multiple layers of security to protect your data:
                    </p>
                    <ul>
                      <li>End-to-end encryption for all data in transit and at rest</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Compliance with industry standards including SOC 2 and GDPR</li>
                      <li>Automatic detection and masking of sensitive information</li>
                    </ul>
                    
                    <h4>Access Control</h4>
                    <p>
                      Ensure proper access management:
                    </p>
                    <ul>
                      <li>Implement role-based access controls for team members</li>
                      <li>Enable multi-factor authentication for all accounts</li>
                      <li>Regularly audit user permissions and access logs</li>
                      <li>Enforce strong password policies</li>
                    </ul>
                    
                    <h4>Email Security</h4>
                    <p>
                      Maintain secure email practices:
                    </p>
                    <ul>
                      <li>Configure proper SPF, DKIM, and DMARC records</li>
                      <li>Monitor for suspicious email activities</li>
                      <li>Implement gradual warming for new sending domains</li>
                      <li>Use our built-in content scanner to avoid spam triggers</li>
                    </ul>
                    
                    <h4>Data Retention</h4>
                    <p>
                      Follow these data retention guidelines:
                    </p>
                    <ul>
                      <li>Configure appropriate data retention policies</li>
                      <li>Regularly purge unnecessary contact data</li>
                      <li>Maintain audit trails of data access and modifications</li>
                      <li>Set up automated data backup procedures</li>
                    </ul>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Tags: {selectedArticle.tags.map((tag, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded mr-1">
                        {tag}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download size={14} />}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<ThumbsUp size={14} />}
                  >
                    Helpful
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={conversationTitle}
                    onChange={(e) => setConversationTitle(e.target.value)}
                    className="font-medium text-gray-900 border-0 focus:ring-0 p-0 bg-transparent"
                    placeholder="Conversation Title"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => setShowConversationHistory(!showConversationHistory)}
                    icon={showConversationHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  >
                    {showConversationHistory ? 'Hide History' : 'History'}
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetConversation}
                    icon={<RefreshCw size={14} />}
                  >
                    New Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Upload size={14} />}
                  >
                    Upload File
                  </Button>
                </div>
              </div>
              
              {showConversationHistory && (
                <div className="mb-4 border border-gray-200 rounded-md p-3 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Conversations</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Security configuration help</p>
                        <p className="text-xs text-gray-500">Dec 10, 2023 • 8 messages</p>
                      </div>
                      <Badge>Active</Badge>
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Contact enrichment questions</p>
                        <p className="text-xs text-gray-500">Dec 8, 2023 • 12 messages</p>
                      </div>
                      <Badge variant="default">Closed</Badge>
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">API integration support</p>
                        <p className="text-xs text-gray-500">Dec 5, 2023 • 6 messages</p>
                      </div>
                      <Badge variant="default">Closed</Badge>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-md p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-br-none' 
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            {message.role === 'assistant' && (
                              <span className="font-medium text-xs flex items-center text-blue-600">
                                <Headset size={12} className="mr-1" />
                                Support AI
                              </span>
                            )}
                            <span className="text-xs text-gray-500 ml-2">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          
                          <div className="whitespace-pre-line">{message.content}</div>
                          
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 border-opacity-20">
                              <p className="text-xs text-gray-500 mb-1">Sources:</p>
                              <div>
                                {message.sources.map(source => renderSourceLink(source))}
                              </div>
                            </div>
                          )}
                          
                          {showFeedback === message.id && message.role === 'assistant' && (
                            <div className="mt-2 pt-2 border-t border-gray-200 border-opacity-20">
                              <p className="text-xs text-gray-500 mb-1">Was this response helpful?</p>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleFeedback(message.id, true)}
                                  className="bg-white text-green-600 p-1 rounded"
                                >
                                  <ThumbsUp size={14} />
                                </button>
                                <button 
                                  onClick={() => handleFeedback(message.id, false)}
                                  className="bg-white text-red-600 p-1 rounded"
                                >
                                  <ThumbsDown size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {message.helpful !== undefined && (
                            <div className="mt-2 pt-2 border-t border-gray-200 border-opacity-20">
                              <p className="text-xs flex items-center">
                                {message.helpful 
                                  ? <><ThumbsUp size={12} className="text-green-600 mr-1" /> Marked as helpful</>
                                  : <><ThumbsDown size={12} className="text-red-600 mr-1" /> Feedback received</>
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                <div>
                  {suggestedQuestions.length > 0 && !isTyping && messages.length < 3 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestionClick(question)}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full px-3 py-1 border border-blue-200 flex items-center"
                        >
                          <Zap size={12} className="mr-1 text-blue-500" />
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question here..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={input.trim() === ''}
                      className={`px-4 py-3 rounded-r-md ${
                        input.trim() === '' 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } transition-colors duration-200`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <div>
                      Powered by AI - Answers may not be 100% accurate
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs py-1"
                        icon={<Headset size={14} />}
                      >
                        Human Support
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 text-xs py-1"
                        icon={<Video size={14} />}
                      >
                        Schedule Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Sparkles size={16} className="mr-2 text-blue-600" />
                Quick Features Spotlight
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">AI-Powered Security Scoring</h4>
                  <p className="text-xs text-blue-700">
                    Our machine learning model evaluates contacts based on 40+ data points to predict security needs and conversion likelihood.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Data Protection Controls</h4>
                  <p className="text-xs text-blue-700">
                    Enterprise-grade security with encryption, access controls, and comprehensive audit logging.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                fullWidth
                className="mt-3"
                icon={<ArrowUpRight size={14} />}
              >
                View all features
              </Button>
            </Card>
            
            <Card>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Video size={16} className="mr-2 text-blue-600" />
                Video Tutorials
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-white"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Security Features Overview</p>
                    <p className="text-xs text-gray-500">4:32 • 1.2K views</p>
                  </div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-white"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Engagement Sequence Masterclass</p>
                    <p className="text-xs text-gray-500">12:47 • 3.5K views</p>
                  </div>
                </button>
              </div>
              <Button
                variant="outline"
                fullWidth
                className="mt-3"
                icon={<ArrowUpRight size={14} />}
              >
                View all tutorials
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};