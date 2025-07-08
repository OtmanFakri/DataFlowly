import React, { useState } from 'react';
import { DatabaseSchema } from '../../types/database';
import { generateSQL } from '../../utils/sqlGenerator';
import { X, Copy, Check, Download } from 'lucide-react';

interface ExportPanelProps {
  schema: DatabaseSchema;
  onClose: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  schema,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'sql'>('sql');
  const [copied, setCopied] = useState(false);

  const jsonContent = JSON.stringify(schema, null, 2);
  const sqlContent = generateSQL(schema);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard');
    }
  };

  const handleDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentContent = activeTab === 'json' ? jsonContent : sqlContent;
  const currentFilename = activeTab === 'json' 
    ? `${schema.database.name.replace(/\s+/g, '_')}_schema.json`
    : `${schema.database.name.replace(/\s+/g, '_')}_schema.sql`;
  const currentMimeType = activeTab === 'json' ? 'application/json' : 'text/sql';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">Export Schema</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === 'sql' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                SQL DDL
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === 'json' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                JSON Schema
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(currentContent)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={() => handleDownload(currentContent, currentFilename, currentMimeType)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="h-full border border-gray-300 rounded-lg">
            <pre className="h-full p-4 overflow-auto bg-gray-50 rounded-lg font-mono text-sm">
              <code>{currentContent}</code>
            </pre>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {activeTab === 'sql' ? 'SQL DDL' : 'JSON Schema'} • {currentContent.split('\n').length} lines
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};