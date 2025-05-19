import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { Upload, Check, X, AlertCircle, ChevronDown, ChevronUp, RefreshCw, Sparkles, Clock, Database, ArrowRight, MessageSquare } from 'lucide-react';
import { CSVProcessingModal } from './CSVProcessingModal';

interface CSVUploaderProps {
  onUploadComplete?: (mappedData: any[]) => void;
  onCancel?: () => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ 
  onUploadComplete, 
  onCancel 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMappingPanel, setShowMappingPanel] = useState(false);
  const [autoMappingComplete, setAutoMappingComplete] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const requiredFields = ['name', 'company', 'title', 'email'];
  const possibleFieldMappings: Record<string, string[]> = {
    name: ['name', 'full name', 'contact name', 'person', 'full_name', 'contact_name'],
    email: ['email', 'email address', 'work email', 'business email', 'contact email', 'email_address'],
    company: ['company', 'company name', 'organization', 'account', 'business', 'company_name'],
    title: ['title', 'job title', 'position', 'role', 'job role', 'job_title'],
    phone: ['phone', 'phone number', 'work phone', 'mobile', 'telephone', 'phone_number'],
    linkedIn: ['linkedin', 'linkedin url', 'linkedin profile', 'linkedin_url'],
    industry: ['industry', 'sector', 'vertical', 'business type'],
    location: ['location', 'city', 'state', 'country', 'region', 'address']
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      processCSV(csvData);
    };
    
    reader.readAsText(selectedFile);
  };
  
  const processCSV = (csvData: string) => {
    // Parse CSV data
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Get preview data (up to 5 rows)
    const previewRows = lines.slice(1, 6).map(line => 
      line.split(',').map(cell => cell.trim())
    );
    
    setHeaders(headers);
    setPreviewData(previewRows);
    
    // Attempt automatic field mapping
    const mappings: Record<string, string> = {};
    
    headers.forEach(header => {
      const normalizedHeader = header.toLowerCase().trim();
      
      // Check each required field for potential matches
      Object.entries(possibleFieldMappings).forEach(([fieldName, possibleMatches]) => {
        if (possibleMatches.includes(normalizedHeader)) {
          mappings[header] = fieldName;
        }
      });
    });
    
    setMappedFields(mappings);
    setIsProcessing(false);
    setShowMappingPanel(true);
    setAutoMappingComplete(true);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile || !droppedFile.name.endsWith('.csv')) return;
    
    setFile(droppedFile);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      processCSV(csvData);
    };
    
    reader.readAsText(droppedFile);
  };
  
  const handleFieldMapping = (header: string, fieldType: string) => {
    setMappedFields(prev => ({
      ...prev,
      [header]: fieldType
    }));
  };
  
  const getMappedFieldsCount = () => {
    return Object.keys(mappedFields).length;
  };
  
  const getRequiredFieldsMappedCount = () => {
    const mapped = new Set(Object.values(mappedFields));
    return requiredFields.filter(field => mapped.has(field)).length;
  };
  
  const areAllRequiredFieldsMapped = () => {
    return getRequiredFieldsMappedCount() === requiredFields.length;
  };
  
  const resetUpload = () => {
    setFile(null);
    setHeaders([]);
    setPreviewData([]);
    setMappedFields({});
    setShowMappingPanel(false);
    setAutoMappingComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const startProcessing = () => {
    // Prepare data for processing
    const dataToProcess = previewData.map((row, index) => {
      const record: Record<string, string> = {};
      
      headers.forEach((header, colIndex) => {
        const mappedField = mappedFields[header];
        if (mappedField) {
          record[mappedField] = row[colIndex] || '';
        }
      });
      
      return record;
    });
    
    setProcessedData(dataToProcess);
    setShowProcessingModal(true);
  };
  
  const handleProcessingComplete = (enrichedData: any[]) => {
    setShowProcessingModal(false);
    if (onUploadComplete) {
      onUploadComplete(enrichedData);
    }
  };
  
  return (
    <div className="w-full">
      {!file && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
          
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your CSV file here, or click to browse
          </p>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Browse Files
          </Button>
          
          <div className="mt-4 text-xs text-gray-500">
            File should be a CSV with headers in the first row
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your file...</p>
        </div>
      )}
      
      {file && !isProcessing && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Check size={16} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{file.name}</h3>
                <p className="text-xs text-gray-500">{headers.length} columns, {previewData.length}+ rows</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetUpload}
              icon={<X size={14} />}
            >
              Cancel
            </Button>
          </div>
          
          {showMappingPanel && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Field Mapping</h3>
                <div className="flex items-center">
                  {autoMappingComplete && (
                    <Badge variant="success" className="mr-2 flex items-center">
                      <Check size={12} className="mr-1" />
                      Auto-mapped {getMappedFieldsCount()} fields
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMappingPanel(!showMappingPanel)}
                    icon={showMappingPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  >
                    {showMappingPanel ? 'Hide Mapping' : 'Show Mapping'}
                  </Button>
                </div>
              </div>
              
              <Card>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    We've automatically matched your CSV headers to our system fields. 
                    Please review and adjust if needed.
                  </p>
                  
                  <div className={`flex items-center ${areAllRequiredFieldsMapped() ? 'bg-green-50' : 'bg-yellow-50'} p-2 rounded-md`}>
                    {areAllRequiredFieldsMapped() ? (
                      <Check size={16} className="text-green-600 mr-2" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-600 mr-2" />
                    )}
                    <p className="text-sm">
                      {getRequiredFieldsMappedCount()} of {requiredFields.length} required fields mapped
                      {!areAllRequiredFieldsMapped() && ' (name, email, company, and title are required)'}
                    </p>
                  </div>
                  
                  {!areAllRequiredFieldsMapped() && (
                    <div className="mt-2 bg-blue-50 p-2 rounded-md flex items-start">
                      <Sparkles size={16} className="text-blue-600 mt-0.5 mr-2" />
                      <p className="text-xs text-blue-800">
                        Don't worry if some fields are missing. Our AI system can help fill gaps in your data during the enrichment process.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CSV Header
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Map to Field
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preview Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {headers.map((header, index) => (
                        <tr key={header} className={requiredFields.includes(mappedFields[header] || '') ? 'bg-green-50' : ''}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {header}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <select
                              value={mappedFields[header] || ''}
                              onChange={(e) => handleFieldMapping(header, e.target.value)}
                              className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                requiredFields.includes(mappedFields[header] || '') 
                                  ? 'border-green-300 bg-green-50' 
                                  : 'border-gray-300'
                              }`}
                            >
                              <option value="">-- Not Mapped --</option>
                              <option value="name">Name</option>
                              <option value="email">Email</option>
                              <option value="company">Company</option>
                              <option value="title">Job Title</option>
                              <option value="phone">Phone</option>
                              <option value="linkedIn">LinkedIn</option>
                              <option value="industry">Industry</option>
                              <option value="location">Location</option>
                              <option value="companySize">Company Size</option>
                              <option value="department">Department</option>
                              <option value="country">Country</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {previewData[0] && previewData[0][index] ? previewData[0][index] : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {!areAllRequiredFieldsMapped() && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle size={16} className="text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Not all required fields are mapped
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Don't see a match for required fields? Don't worry - our AI can help fill the gaps based on other data points. For best results, map as many fields as possible.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">
                {areAllRequiredFieldsMapped() 
                  ? "All required fields mapped! Ready to process."
                  : "AI can help with missing fields during processing."
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={resetUpload}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={startProcessing}
                icon={<RefreshCw size={16} />}
              >
                Process & Enrich Leads
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showProcessingModal && (
        <CSVProcessingModal
          onClose={() => setShowProcessingModal(false)}
          onComplete={handleProcessingComplete}
          initialData={processedData}
          fields={headers}
          mappedFields={mappedFields}
        />
      )}
    </div>
  );
};