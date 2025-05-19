import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChatModal, Message } from '../common/ChatModal';
import { Badge } from '../common/Badge';
import {
  Book,
  FileText,
  Search,
  Upload,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  Plus,
  Sparkles,
  Database,
  Tag,
  Filter,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  User,
  MessageSquare,
  Shield,
  Lock,
  Server
} from 'lucide-react';

// Import knowledge data
import knowledgeData from '../../data/knowledge_chunks.json';

interface DocumentChunk {
  id: string;
  content: string;
  page: number;
  embedding_id: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
  dateUploaded: string;
  uploadedBy: string;
  size: string;
  tags: string[];
  chunks: DocumentChunk[];
}

interface FAQ {
  question: string;
  answer: string;
  sources: string[];
}

export const KnowledgeLibrary: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [activeChunk, setActiveChunk] = useState<DocumentChunk | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'faqs' | 'search'>('documents');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I can help you find information about our cybersecurity solutions. Ask me anything about our container security, compliance automation, or runtime protection features.",
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showUploaderModal, setShowUploaderModal] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load documents and FAQs
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDocuments(knowledgeData.documents || []);
      setFaqs(knowledgeData.faqs || []);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Scroll chat to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      setActiveTab('search');
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFile(true);
    setShowUploaderModal(true);
    setProcessingStatus('processing');
    setProcessingProgress(0);
    
    // Simulate document processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 300);
    
    // Simulate completion
    setTimeout(() => {
      clearInterval(interval);
      setProcessingProgress(100);
      setProcessingStatus('complete');
      
      // Add the new document
      setTimeout(() => {
        const newDoc: Document = {
          id: `doc-${documents.length + 1}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: file.name.split('.').pop() || 'pdf',
          dateUploaded: new Date().toISOString().split('T')[0],
          uploadedBy: 'Current User',
          size: formatFileSize(file.size),
          tags: ['new', 'uploaded'],
          chunks: [
            {
              id: `chunk-${documents.length + 1}-1`,
              content: "This is the content extracted from your uploaded document. In a real implementation, this would contain the actual text extracted from the document after processing.",
              page: 1,
              embedding_id: `emb-${documents.length + 1}-1`
            }
          ]
        };
        
        setDocuments(prev => [...prev, newDoc]);
        setUploadingFile(false);
        setShowUploaderModal(false);
        setProcessingStatus('idle');
        setProcessingProgress(0);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    }, 5000);
  };
  
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Simulate thinking
    setTimeout(() => {
      let responseContent = '';
      let sources: string[] = [];
      
      // Simple matching logic for demo purposes
      const query = chatInput.toLowerCase();
      
      if (query.includes('container') || query.includes('kubernetes') || query.includes('k8s')) {
        responseContent = "Our container security solution provides comprehensive protection for your containerized applications. Key features include:\n\n" +
          "• Runtime threat detection and prevention for containers and pods\n" +
          "• Kubernetes security posture management\n" +
          "• Supply chain security with image scanning\n" +
          "• Network security policies and microsegmentation\n\n" +
          "The platform integrates seamlessly with your existing Kubernetes deployments and CI/CD pipelines. Would you like more information about a specific aspect of our container security capabilities?";
        sources = ['doc-2', 'doc-5'];
      }
      else if (query.includes('compliance') || query.includes('regulatory') || query.includes('audit')) {
        responseContent = "Our compliance automation feature helps you maintain continuous compliance with various regulations and standards. The system:\n\n" +
          "• Automatically maps security controls to compliance frameworks\n" +
          "• Generates audit-ready reports for standards like SOC 2, ISO 27001, PCI DSS, and HIPAA\n" +
          "• Provides real-time compliance dashboards\n" +
          "• Alerts on compliance drift or violations\n\n" +
          "This reduces manual compliance work by up to 80% and ensures you're always audit-ready.";
        sources = ['doc-1', 'doc-4'];
      }
      else if (query.includes('runtime') || query.includes('protection')) {
        responseContent = "Our runtime protection module provides real-time security for running applications without impacting performance. It includes:\n\n" +
          "• Behavioral analysis to detect anomalies\n" +
          "• Process monitoring and file integrity verification\n" +
          "• Memory protection against exploits\n" +
          "• Network traffic analysis and microsegmentation\n\n" +
          "The system uses a lightweight sensor that typically causes less than 1% performance impact.";
        sources = ['doc-3'];
      }
      else if (query.includes('price') || query.includes('cost') || query.includes('pricing')) {
        responseContent = "Our pricing is based on the number of nodes or containers you need to protect. We offer three tiers:\n\n" +
          "• Standard: $15 per node/month\n" +
          "• Professional: $25 per node/month\n" +
          "• Enterprise: Custom pricing\n\n" +
          "Each tier includes different feature sets, with the Enterprise tier offering unlimited nodes, 24/7 support, and custom compliance reporting. Would you like me to arrange a call with our sales team to discuss pricing options for your specific environment?";
        sources = ['doc-1'];
      }
      else {
        // Generic response
        responseContent = "Based on your question, I'd recommend exploring our documentation on container security, runtime protection, and compliance automation. These are the core components of our platform that help organizations secure their cloud-native environments.\n\n" +
          "Would you like specific information about any of these areas? Or is there another aspect of our cybersecurity solution you'd like to learn about?";
        sources = [];
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        sources: sources
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
      case 'docx':
        return <FileText size={16} className="text-blue-500" />;
      case 'txt':
        return <FileText size={16} className="text-gray-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  const getTags = (): string[] => {
    const allTags: string[] = [];
    documents.forEach(doc => {
      doc.tags.forEach(tag => {
        if (!allTags.includes(tag)) {
          allTags.push(tag);
        }
      });
    });
    return allTags;
  };
  
  const getDocTypes = (): string[] => {
    const types: string[] = [];
    documents.forEach(doc => {
      if (!types.includes(doc.type)) {
        types.push(doc.type);
      }
    });
    return types;
  };
  
  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const toggleDocTypeFilter = (type: string) => {
    if (selectedDocTypes.includes(type)) {
      setSelectedDocTypes(selectedDocTypes.filter(t => t !== type));
    } else {
      setSelectedDocTypes([...selectedDocTypes, type]);
    }
  };
  
  const filteredDocuments = documents.filter(doc => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = doc.title.toLowerCase().includes(query);
      const matchesTags = doc.tags.some(tag => tag.toLowerCase().includes(query));
      const matchesContent = doc.chunks.some(chunk => chunk.content.toLowerCase().includes(query));
      
      if (!matchesTitle && !matchesTags && !matchesContent) {
        return false;
      }
    }
    
    // Apply tag filters
    if (selectedTags.length > 0 && !doc.tags.some(tag => selectedTags.includes(tag))) {
      return false;
    }
    
    // Apply doc type filters
    if (selectedDocTypes.length > 0 && !selectedDocTypes.includes(doc.type)) {
      return false;
    }
    
    return true;
  });
  
  const filteredFAQs = faqs.filter(faq => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  });
  
  // Render Methods
  const renderDocumentsList = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      );
    }
    
    if (filteredDocuments.length === 0) {
      return (
        <div className="text-center py-8">
          <FileText size={32} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or upload a new document</p>
          <Button 
            variant="primary"
            onClick={handleUploadClick}
            icon={<Upload size={16} />}
          >
            Upload Document
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <div 
            key={doc.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveDocument(doc)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                {getDocumentIcon(doc.type)}
                <h3 className="font-medium text-gray-900 ml-2">{doc.title}</h3>
              </div>
              <Badge className="uppercase">{doc.type}</Badge>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {doc.chunks[0].content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {doc.tags.map((tag, idx) => (
                  <Badge key={idx} variant="default" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock size={12} className="mr-1" />
                {formatTimestamp(doc.dateUploaded)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderFAQsList = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      );
    }
    
    if (filteredFAQs.length === 0) {
      return (
        <div className="text-center py-8">
          <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedFAQ(faq)}
          >
            <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {faq.sources.length > 0 && (
                  <span>{faq.sources.length} source{faq.sources.length !== 1 ? 's' : ''}</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
              >
                View Answer
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderDocumentDetails = () => {
    if (!activeDocument) return null;
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-3"
              onClick={() => {
                setActiveDocument(null);
                setActiveChunk(null);
              }}
            >
              Back to Documents
            </Button>
            <h3 className="text-lg font-medium text-gray-900">{activeDocument.title}</h3>
          </div>
          <Badge className="uppercase">{activeDocument.type}</Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-900">Document Preview</h4>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download size={14} />}
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Copy size={14} />}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              {activeChunk ? (
                <div>
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-gray-900">Chunk {activeDocument.chunks.indexOf(activeChunk) + 1} of {activeDocument.chunks.length}</h5>
                      <Badge>Page {activeChunk.page}</Badge>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p>{activeChunk.content}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeDocument.chunks.map((chunk, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-white cursor-pointer"
                      onClick={() => setActiveChunk(chunk)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-900">Chunk {idx + 1}</h5>
                        <Badge>Page {chunk.page}</Badge>
                      </div>
                      <p className="text-gray-600 line-clamp-3">{chunk.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
          
          <Card>
            <h4 className="font-medium text-gray-900 mb-4">Document Metadata</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">File Details</h5>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">Type:</div>
                    <div className="text-gray-900">{activeDocument.type.toUpperCase()}</div>
                    
                    <div className="text-gray-500">Size:</div>
                    <div className="text-gray-900">{activeDocument.size}</div>
                    
                    <div className="text-gray-500">Uploaded:</div>
                    <div className="text-gray-900">{formatTimestamp(activeDocument.dateUploaded)}</div>
                    
                    <div className="text-gray-500">By:</div>
                    <div className="text-gray-900">{activeDocument.uploadedBy}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {activeDocument.tags.map((tag, idx) => (
                    <Badge key={idx}>{tag}</Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-1.5 text-xs"
                    icon={<Plus size={14} />}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Processing</h5>
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle size={14} className="text-green-600 mr-2" />
                      Text extraction complete
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={14} className="text-green-600 mr-2" />
                      Chunking complete ({activeDocument.chunks.length} chunks)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={14} className="text-green-600 mr-2" />
                      Embeddings generated
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <Card>
          <h4 className="font-medium text-gray-900 mb-4">Ask About This Document</h4>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
              >
                What are the key features?
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                Summarize this document
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                What compliance standards are mentioned?
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask a question about this document..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button>Ask</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  const renderFAQDetails = () => {
    if (!selectedFAQ) return null;
    
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            className="mr-3"
            onClick={() => setSelectedFAQ(null)}
          >
            Back to FAQs
          </Button>
          <h3 className="text-lg font-medium text-gray-900">Frequently Asked Question</h3>
        </div>
        
        <Card className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">{selectedFAQ.question}</h4>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-800">{selectedFAQ.answer}</p>
          </div>
          
          {selectedFAQ.sources.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Sources:</h5>
              <div className="space-y-2">
                {selectedFAQ.sources.map((source, idx) => {
                  const sourceDoc = documents.find(doc => doc.id === source);
                  return (
                    <div key={idx} className="bg-blue-50 p-3 rounded-md flex items-start">
                      <FileText size={16} className="text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          {sourceDoc ? sourceDoc.title : source}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 text-xs"
                          onClick={() => {
                            const doc = documents.find(d => d.id === source);
                            if (doc) {
                              setActiveDocument(doc);
                              setActiveTab('documents');
                              setSelectedFAQ(null);
                            }
                          }}
                        >
                          View Source
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
        
        <Card title="Related Questions">
          <div className="space-y-3">
            {faqs
              .filter(faq => faq !== selectedFAQ)
              .slice(0, 3)
              .map((faq, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedFAQ(faq)}
                >
                  {faq.question}
                </Button>
              ))}
          </div>
        </Card>
      </div>
    );
  };
  
  const renderUploadModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-900">Document Processing</h2>
            <button
              onClick={() => setShowUploaderModal(false)}
              disabled={processingStatus === 'processing'}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4 text-center">
              {processingStatus === 'processing' ? (
                <>
                  <RefreshCw size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Document</h3>
                </>
              ) : processingStatus === 'complete' ? (
                <>
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Complete</h3>
                </>
              ) : (
                <>
                  <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Error</h3>
                </>
              )}
              
              <p className="text-gray-600">
                {processingStatus === 'processing' 
                  ? 'Extracting text, chunking content, and generating embeddings...'
                  : processingStatus === 'complete'
                    ? 'Your document has been successfully processed and is now searchable.'
                    : 'There was an error processing your document. Please try again.'}
              </p>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    processingStatus === 'complete' 
                      ? 'bg-green-600' 
                      : processingStatus === 'error'
                        ? 'bg-red-600'
                        : 'bg-blue-600'
                  }`}
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{processingStatus === 'complete' ? 'Complete' : `${Math.round(processingProgress)}%`}</span>
                <span>
                  {processingStatus === 'processing' && (
                    processingProgress < 30 
                      ? 'Extracting text...' 
                      : processingProgress < 60
                        ? 'Chunking content...'
                        : 'Generating embeddings...'
                  )}
                </span>
              </div>
            </div>
            
            {processingStatus === 'complete' && (
              <div className="bg-green-50 p-3 rounded-md mb-6">
                <div className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">Document successfully processed</p>
                    <p className="text-xs text-green-700 mt-1">
                      Your document is now available in the library and can be used for knowledge retrieval.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              {processingStatus === 'processing' ? (
                <Button
                  variant="outline"
                  disabled
                >
                  Processing...
                </Button>
              ) : (
                <Button
                  variant={processingStatus === 'complete' ? 'primary' : 'outline'}
                  onClick={() => {
                    setShowUploaderModal(false);
                    setProcessingStatus('idle');
                  }}
                >
                  {processingStatus === 'complete' ? 'View Document' : 'Close'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderChatInterface = () => {
    return (
      <div className="h-[600px] flex flex-col border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white flex-shrink-0">
          <h3 className="font-medium">Chat with the Knowledge Base</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${
                message.role === 'user' 
                  ? 'justify-end' 
                  : 'justify-start'
              }`}
            >
              <div className={`
                max-w-[80%] rounded-lg p-3
                ${message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }
              `}>
                <p>{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 border-opacity-20">
                    <p className="text-xs text-gray-300 mb-1">Sources:</p>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, i) => {
                        const sourceDoc = documents.find(doc => doc.id === source);
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              const doc = documents.find(d => d.id === source);
                              if (doc) {
                                setActiveDocument(doc);
                                setActiveTab('documents');
                              }
                            }}
                            className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded hover:bg-blue-300 inline-flex items-center"
                          >
                            <FileText size={12} className="mr-1" />
                            {sourceDoc ? sourceDoc.title : source}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about our cybersecurity solutions..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button type="submit" disabled={!chatInput.trim()}>
              Send
            </Button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Knowledge Library</h2>
        <p className="text-gray-600">Access and manage technical documentation and get AI answers to your questions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Knowledge Base</h3>
              <Button
                variant="outline"
                size="sm"
                icon={<Upload size={14} />}
                onClick={handleUploadClick}
              >
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
            </div>
            
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-4">
                <button 
                  className={`py-2 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('documents')}
                >
                  Documents
                </button>
                <button 
                  className={`py-2 border-b-2 font-medium text-sm ${activeTab === 'faqs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('faqs')}
                >
                  FAQs
                </button>
                {searchQuery && (
                  <button 
                    className={`py-2 border-b-2 font-medium text-sm ${activeTab === 'search' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveTab('search')}
                  >
                    Search Results
                  </button>
                )}
              </nav>
            </div>
            
            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    icon={showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  >
                    Filters
                  </Button>
                </div>
                
                {showFilters && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Document Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {getDocTypes().map((type, idx) => (
                          <button
                            key={idx}
                            className={`text-xs px-3 py-1 rounded-full ${
                              selectedDocTypes.includes(type)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleDocTypeFilter(type)}
                          >
                            {type.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {getTags().map((tag, idx) => (
                          <button
                            key={idx}
                            className={`text-xs px-3 py-1 rounded-full ${
                              selectedTags.includes(tag)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleTagFilter(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {(selectedTags.length > 0 || selectedDocTypes.length > 0) && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setSelectedTags([]);
                            setSelectedDocTypes([]);
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {renderDocumentsList()}
              </div>
            )}
            
            {activeTab === 'faqs' && renderFAQsList()}
            
            {activeTab === 'search' && searchQuery && (
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Search Results</h4>
                  <p className="text-xs text-gray-500">
                    Showing results for "{searchQuery}"
                  </p>
                </div>
                
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">Documents ({filteredDocuments.length})</h5>
                  {filteredDocuments.length > 0 ? renderDocumentsList() : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">No matching documents</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">FAQs ({filteredFAQs.length})</h5>
                  {filteredFAQs.length > 0 ? renderFAQsList() : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">No matching FAQs</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
          
          <Card title="Popular Topics">
            <div className="space-y-2">
              <Button
                variant="outline"
                fullWidth
                className="justify-start"
                icon={<Shield size={16} />}
                onClick={() => setSearchQuery('container security')}
              >
                Container Security
              </Button>
              <Button
                variant="outline"
                fullWidth
                className="justify-start"
                icon={<Lock size={16} />}
                onClick={() => setSearchQuery('compliance')}
              >
                Compliance Automation
              </Button>
              <Button
                variant="outline"
                fullWidth
                className="justify-start"
                icon={<Server size={16} />}
                onClick={() => setSearchQuery('kubernetes')}
              >
                Kubernetes Security
              </Button>
              <Button
                variant="outline"
                fullWidth
                className="justify-start"
                icon={<Database size={16} />}
                onClick={() => setSearchQuery('runtime protection')}
              >
                Runtime Protection
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {activeDocument ? (
            renderDocumentDetails()
          ) : selectedFAQ ? (
            renderFAQDetails()
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ask Your Security Questions</h3>
              {renderChatInterface()}
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <Sparkles size={16} className="text-blue-600 mr-2" />
                    Suggested Questions
                  </h4>
                  
                  <div className="space-y-2">
                    {[
                      "What container security features do you provide?",
                      "How does your Kubernetes protection work?",
                      "What compliance standards do you support?",
                      "How does runtime protection work?",
                      "What is your pricing model?"
                    ].map((question, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
                        onClick={() => {
                          setChatInput(question);
                          
                          // Focus any input element within the chat interface
                          document.querySelector('.h-\\[600px\\] input')?.focus();
                        }}
                      >
                        <MessageSquare size={14} className="text-blue-500 mr-2" />
                        {question}
                      </button>
                    ))}
                  </div>
                </Card>
                
                <Card>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <Cpu size={16} className="text-blue-600 mr-2" />
                    Knowledge Base Stats
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Documents</h5>
                      <p className="text-xl font-bold text-gray-900">{documents.length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">FAQ Entries</h5>
                      <p className="text-xl font-bold text-gray-900">{faqs.length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Tags</h5>
                      <p className="text-xl font-bold text-gray-900">{getTags().length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h5>
                      <p className="text-sm font-medium text-gray-900">Today</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <Info size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">
                          Content Freshness
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Your knowledge base is current with the latest documentation and product information. 
                          Regular updates ensure accurate responses to security questions.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Upload Document Modal */}
      {showUploaderModal && renderUploadModal()}
      
      <ChatModal 
        agentName="KnoxEngage Knowledge Assistant"
        initialMessages={[
          {
            id: '1',
            role: 'assistant',
            content: 'I can help you find information in our knowledge base about container security, compliance automation, and runtime protection. What would you like to know?',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
};