import React from 'react';
import { TableProperties } from './TableProperties';
import { ColumnProperties } from './ColumnProperties';
import { RelationshipProperties } from './RelationshipProperties';
import { DatabaseSchema } from '../../types/database';
import { X } from 'lucide-react';

interface PropertyPanelProps {
  schema: DatabaseSchema & {
    selectedTableId?: string;
    selectedColumnId?: string;
    selectedRelationshipId?: string;
  };
  onUpdateTable: (tableId: string, updates: any) => void;
  onUpdateColumn: (tableId: string, columnId: string, updates: any) => void;
  onAddColumn: (tableId: string) => void;
  onDeleteColumn: (tableId: string, columnId: string) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateRelationship: (relationshipId: string, updates: any) => void;
  onDeleteRelationship: (relationshipId: string) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  schema,
  onUpdateTable,
  onUpdateColumn,
  onAddColumn,
  onDeleteColumn,
  onDeleteTable,
  onUpdateRelationship,
  onDeleteRelationship,
  onClose
}) => {
  const selectedTable = schema.database.tables.find(t => t.id === schema.selectedTableId);
  const selectedColumn = selectedTable?.columns.find(c => c.id === schema.selectedColumnId);
  const selectedRelationship = schema.database.relationships.find(r => r.id === schema.selectedRelationshipId);

  if (!selectedTable && !selectedRelationship) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedRelationship ? (
          <RelationshipProperties
            relationship={selectedRelationship}
            tables={schema.database.tables}
            onUpdate={(updates) => onUpdateRelationship(selectedRelationship.id, updates)}
            onDelete={() => onDeleteRelationship(selectedRelationship.id)}
          />
        ) : selectedColumn && selectedTable ? (
          <ColumnProperties
            table={selectedTable}
            column={selectedColumn}
            onUpdate={(updates) => onUpdateColumn(selectedTable.id, selectedColumn.id, updates)}
            onDelete={() => onDeleteColumn(selectedTable.id, selectedColumn.id)}
          />
        ) : selectedTable ? (
          <TableProperties
            table={selectedTable}
            onUpdate={(updates) => onUpdateTable(selectedTable.id, updates)}
            onAddColumn={() => onAddColumn(selectedTable.id)}
            onDeleteTable={() => onDeleteTable(selectedTable.id)}
          />
        ) : null}
      </div>
    </div>
  );
};