import React from 'react';
import { DatabaseTable } from '../../types/database';
import { Plus, Trash2, Table } from 'lucide-react';

interface TablePropertiesProps {
  table: DatabaseTable;
  onUpdate: (updates: Partial<DatabaseTable>) => void;
  onAddColumn: () => void;
  onDeleteTable: () => void;
}

export const TableProperties: React.FC<TablePropertiesProps> = ({
  table,
  onUpdate,
  onAddColumn,
  onDeleteTable
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2 text-blue-600">
        <Table size={20} />
        <h3 className="font-medium">Table Properties</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Table Name
          </label>
          <input
            type="text"
            value={table.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={table.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Optional table description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position X
            </label>
            <input
              type="number"
              value={Math.round(table.position.x)}
              onChange={(e) => onUpdate({ 
                position: { ...table.position, x: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position Y
            </label>
            <input
              type="number"
              value={Math.round(table.position.y)}
              onChange={(e) => onUpdate({ 
                position: { ...table.position, y: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">Columns ({table.columns.length})</h4>
          <button
            onClick={onAddColumn}
            className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {table.columns.map((column) => (
            <div key={column.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="text-sm font-medium text-gray-800">{column.name}</div>
                <div className="text-xs text-gray-500">
                  {column.dataType}
                  {column.length && ['VARCHAR', 'CHAR'].includes(column.dataType) && `(${column.length})`}
                  {column.primaryKey && ' • PK'}
                  {column.nullable || ' • NOT NULL'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={onDeleteTable}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full justify-center transition-colors"
        >
          <Trash2 size={16} />
          <span>Delete Table</span>
        </button>
      </div>
    </div>
  );
};