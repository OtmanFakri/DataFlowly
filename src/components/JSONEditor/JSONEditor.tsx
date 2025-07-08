import React, { useState, useEffect } from 'react';
import { DatabaseSchema } from '../../types/database';
import { X, Copy, Check } from 'lucide-react';

interface JSONEditorProps {
  schema: DatabaseSchema;
  onImport: (schema: DatabaseSchema) => void;
  onClose: () => void;
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  schema,
  onImport,
  onClose
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setJsonText(JSON.stringify(schema, null, 2));
  }, [schema]);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      
      // Basic validation
      if (!parsed.database || !Array.isArray(parsed.database.tables) || !Array.isArray(parsed.database.relationships)) {
        throw new Error('Invalid schema structure');
      }

      onImport(parsed);
      setError(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">JSON Schema Editor</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
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
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            className="w-full h-full min-h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste your JSON schema here..."
          />
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Import Schema
          </button>
        </div>
      </div>
    </div>
  );
};