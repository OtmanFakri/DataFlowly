import React from 'react';
import { DatabaseTable, DatabaseColumn, DataType } from '../../types/database';
import { Trash2, Hash } from 'lucide-react';

interface ColumnPropertiesProps {
  table: DatabaseTable;
  column: DatabaseColumn;
  onUpdate: (updates: Partial<DatabaseColumn>) => void;
  onDelete: () => void;
}

const DATA_TYPES: DataType[] = [
  'VARCHAR', 'CHAR', 'TEXT', 'LONGTEXT',
  'INT', 'BIGINT', 'SMALLINT', 'TINYINT',
  'DECIMAL', 'FLOAT', 'DOUBLE',
  'DATE', 'DATETIME', 'TIMESTAMP', 'TIME',
  'BOOLEAN', 'BIT',
  'JSON', 'BLOB', 'BINARY'
];

export const ColumnProperties: React.FC<ColumnPropertiesProps> = ({
  table,
  column,
  onUpdate,
  onDelete
}) => {
  const requiresLength = ['VARCHAR', 'CHAR', 'BINARY'].includes(column.dataType);
  const requiresPrecision = column.dataType === 'DECIMAL';
  const canAutoIncrement = ['INT', 'BIGINT', 'SMALLINT'].includes(column.dataType);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2 text-blue-600">
        <Hash size={20} />
        <h3 className="font-medium">Column Properties</h3>
      </div>

      <div className="text-sm text-gray-600">
        Table: <span className="font-medium">{table.name}</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Column Name
          </label>
          <input
            type="text"
            value={column.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Type
          </label>
          <select
            value={column.dataType}
            onChange={(e) => onUpdate({ dataType: e.target.value as DataType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {DATA_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {requiresLength && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length
              </label>
              <input
                  type="number"
                  value={column.length ?? ''}
                  onChange={(e) => onUpdate({length: parseInt(e.target.value) || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
        )}

        {requiresPrecision && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precision
                </label>
                <input
                    type="number"
                    value={column.precision ?? ''}
                    onChange={(e) => onUpdate({precision: parseInt(e.target.value) || undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale
                </label>
                <input
                    type="number"
                    value={column.scale !== undefined ? column.scale : ''}
                    onChange={(e) => onUpdate({scale: e.target.value !== '' ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Value
          </label>
          <input
              type="text"
              value={column.defaultValue ?? ''}
              onChange={(e) => onUpdate({defaultValue: e.target.value || undefined})}
              placeholder="Leave empty for no default"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
              value={column.comment ?? ''}
              onChange={(e) => onUpdate({comment: e.target.value || undefined})}
              rows={2}
              placeholder="Optional column comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">Constraints</h4>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
                type="checkbox"
                checked={!column.nullable}
                onChange={(e) => onUpdate({nullable: !e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">NOT NULL</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={column.primaryKey}
              onChange={(e) => onUpdate({ primaryKey: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Primary Key</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={column.unique}
              onChange={(e) => onUpdate({ unique: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Unique</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={column.index}
              onChange={(e) => onUpdate({ index: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Index</span>
          </label>

          {canAutoIncrement && (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={column.autoIncrement}
                onChange={(e) => onUpdate({ autoIncrement: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Auto Increment</span>
            </label>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={() => onDelete()}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full justify-center transition-colors"
        >
          <Trash2 size={16} />
          <span>Delete Column</span>
        </button>
      </div>
    </div>
  );
};