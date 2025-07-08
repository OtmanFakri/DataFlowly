import React from 'react';
import { DatabaseRelationship, DatabaseTable } from '../../types/database';
import { Trash2, Link } from 'lucide-react';

interface RelationshipPropertiesProps {
  relationship: DatabaseRelationship;
  tables: DatabaseTable[];
  onUpdate: (updates: Partial<DatabaseRelationship>) => void;
  onDelete: () => void;
}

const RELATIONSHIP_TYPES = ['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_MANY'] as const;
const CASCADE_ACTIONS = ['CASCADE', 'SET_NULL', 'RESTRICT', 'NO_ACTION'] as const;

export const RelationshipProperties: React.FC<RelationshipPropertiesProps> = ({
  relationship,
  tables,
  onUpdate,
  onDelete
}) => {
  const sourceTable = tables.find(t => t.id === relationship.sourceTable);
  const targetTable = tables.find(t => t.id === relationship.targetTable);
  const sourceColumn = sourceTable?.columns.find(c => c.id === relationship.sourceColumn);
  const targetColumn = targetTable?.columns.find(c => c.id === relationship.targetColumn);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2 text-blue-600">
        <Link size={20} />
        <h3 className="font-medium">Relationship Properties</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Name
          </label>
          <input
            type="text"
            value={relationship.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Type
          </label>
          <select
            value={relationship.type}
            onChange={(e) => onUpdate({ type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {RELATIONSHIP_TYPES.map(type => (
              <option key={type} value={type}>
                {type.replace('_', ' to ').toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              On Delete
            </label>
            <select
              value={relationship.onDelete}
              onChange={(e) => onUpdate({ onDelete: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CASCADE_ACTIONS.map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              On Update
            </label>
            <select
              value={relationship.onUpdate}
              onChange={(e) => onUpdate({ onUpdate: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CASCADE_ACTIONS.map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">Connection Details</h4>
        
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="text-sm">
            <span className="font-medium text-gray-700">From:</span>
            <div className="text-gray-600 ml-2">
              {sourceTable?.name}.{sourceColumn?.name}
            </div>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">To:</span>
            <div className="text-gray-600 ml-2">
              {targetTable?.name}.{targetColumn?.name}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={onDelete}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full justify-center transition-colors"
        >
          <Trash2 size={16} />
          <span>Delete Relationship</span>
        </button>
      </div>
    </div>
  );
};