import React from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Code, 
  Database,
  Settings
} from 'lucide-react';

interface ToolbarProps {
  onAddTable: () => void;
  onImport: () => void;
  onExport: () => void;
  onShowJSON: () => void;
  onShowSQL: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  databaseEngine: string;
  onEngineChange: (engine: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddTable,
  onImport,
  onExport,
  onShowJSON,
  onShowSQL,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  databaseEngine,
  onEngineChange
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        {/* Main Actions */}
        <button
          onClick={onAddTable}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={16} />
          <span>Add Table</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* History */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {/* Database Engine */}
        <select
          value={databaseEngine}
          onChange={(e) => onEngineChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sqlserver">SQL Server</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Export Actions */}
        <button
          onClick={onShowJSON}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Code size={16} />
          <span>JSON</span>
        </button>
        <button
          onClick={onShowSQL}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Database size={16} />
          <span>SQL</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onImport}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Upload size={16} />
          <span>Import</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};