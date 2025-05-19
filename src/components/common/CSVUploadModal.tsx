import React from 'react';
import { Button } from './Button';
import { X } from 'lucide-react';
import { CSVUploader } from './CSVUploader';

interface CSVUploadModalProps {
  onClose: () => void;
  onUploadComplete: (data: any[]) => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ 
  onClose,
  onUploadComplete
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900">Upload Leads CSV</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <CSVUploader 
            onUploadComplete={(data) => {
              onUploadComplete(data);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};