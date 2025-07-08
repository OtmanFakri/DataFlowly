import React, { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { TableNodeData } from '../../types/database';
import { Key, Hash, Type, Calendar, ToggleLeft, Plus, Trash2 } from 'lucide-react';

const TableNode = memo(({ data, selected }: NodeProps<TableNodeData>) => {
  const { table, onTableUpdate, onColumnUpdate, onAddColumn, onDeleteColumn, onColumnSelect, selectedColumnId } = data;

  const getColumnIcon = (column: any) => {
    if (column.primaryKey) return <Key size={12} className="text-yellow-600" />;
    if (column.dataType.includes('INT')) return <Hash size={12} className="text-blue-600" />;
    if (column.dataType.includes('DATE') || column.dataType.includes('TIME')) return <Calendar size={12} className="text-green-600" />;
    if (column.dataType === 'BOOLEAN' || column.dataType === 'BIT') return <ToggleLeft size={12} className="text-purple-600" />;
    return <Type size={12} className="text-gray-600" />;
  };

  const getDataTypeDisplay = (column: any) => {
    let display = column.dataType;
    if (column.length && ['VARCHAR', 'CHAR'].includes(column.dataType)) {
      display += `(${column.length})`;
    }
    if (column.precision && column.scale !== undefined && column.dataType === 'DECIMAL') {
      display += `(${column.precision},${column.scale})`;
    }
    return display;
  };

  const handleTableNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTableUpdate({ name: e.target.value });
  }, [onTableUpdate]);

  const handleColumnClick = useCallback((columnId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onColumnSelect(columnId);
  }, [onColumnSelect]);

  return (
    <div className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-200 min-w-[280px] ${
      selected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200'
    }`}>
      {/* Table Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <input
          type="text"
          value={table.name}
          onChange={handleTableNameChange}
          className="font-semibold text-gray-800 text-sm bg-transparent border-none outline-none w-full"
          placeholder="Table name"
        />
        {table.description && (
          <p className="text-xs text-gray-500 mt-1">{table.description}</p>
        )}
      </div>

      {/* Columns */}
      <div className="divide-y divide-gray-100">
        {table.columns.map((column, index) => {
          return (
            <div
              key={column.id}
              className={`relative px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors group ${
                selectedColumnId === column.id ? 'bg-blue-50' : ''
              }`}
              onClick={(e) => handleColumnClick(column.id, e)}
              style={{ height: '44px' }} // Fixed height for consistent positioning
            >
              {/* Source Handle (left side) - positioned at 50% of row height */}
              <Handle
                type="source"
                position={Position.Left}
                id={column.id}
                className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !left-[-6px] !top-1/2 !transform !-translate-y-1/2"
              />
              
              {/* Target Handle (right side) - positioned at 50% of row height */}
              <Handle
                type="target"
                position={Position.Right}
                id={column.id}
                className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !right-[-6px] !top-1/2 !transform !-translate-y-1/2"
              />

              <div className="flex items-center space-x-2 h-full">
                {getColumnIcon(column)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {column.name}
                    </span>
                    <div className="flex items-center space-x-1 ml-2">
                      {column.nullable && (
                        <span className="text-xs text-gray-400">NULL</span>
                      )}
                      {column.autoIncrement && (
                        <span className="text-xs text-blue-500">AI</span>
                      )}
                      {column.unique && (
                        <span className="text-xs text-purple-500">UQ</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteColumn(column.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {getDataTypeDisplay(column)}
                    {column.defaultValue && (
                      <span className="ml-2">default: {column.defaultValue}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Column Button */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddColumn();
          }}
          className="flex items-center space-x-2 w-full px-2 py-2 text-gray-600 hover:bg-gray-50 rounded text-sm transition-colors"
        >
          <Plus size={14} />
          <span>Add Column</span>
        </button>
      </div>
    </div>
  );
});

TableNode.displayName = 'TableNode';

export default TableNode;