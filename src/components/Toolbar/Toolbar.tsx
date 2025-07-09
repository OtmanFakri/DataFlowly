import React from 'react';
import {
  Plus,
  Download,
  Upload,
  Undo,
  Redo,
  Code,
  Database,
  Settings,
  MessageCircle
} from 'lucide-react';

interface ToolbarProps {
  onAddTable: () => void;
  onImport: () => void;
  onExport: () => void;
  onShowJSON: () => void;
  onShowSQL: () => void;
  onShowChatAI: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  userPoints: number | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddTable,
  onImport,
  onExport,
  onShowJSON,
  onShowSQL,
  onShowChatAI,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  saveStatus,
  userPoints
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
        <button
          onClick={onShowChatAI}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-md"
        >
          <MessageCircle size={16} />
          <span>Chat AI</span>
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
        {/* Save Button */}
        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <span>Saving...</span>
          ) : (
            <span>Save</span>
          )}
        </button>
        {/* Save status feedback */}
        {saveStatus === 'success' && <span className="text-green-600 text-sm">Saved!</span>}
        {saveStatus === 'error' && <span className="text-red-600 text-sm">Error</span>}
        {/* User Points */}
        <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-lg border border-purple-200 ml-2">
          <MessageCircle size={16} className="text-purple-600" />
          <span className="text-sm font-medium text-purple-700">{userPoints !== null ? userPoints : '--'} AI Points</span>
        </div>
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