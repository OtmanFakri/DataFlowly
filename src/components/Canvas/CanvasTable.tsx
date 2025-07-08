import React, { useState, useRef } from 'react';
import { DatabaseTable, DatabaseColumn } from '../../types/database';
import { Key, Hash, Type, Calendar, ToggleLeft } from 'lucide-react';

interface CanvasTableProps {
  table: DatabaseTable;
  isSelected: boolean;
  selectedColumnId?: string;
  onMove: (position: { x: number; y: number }) => void;
  onSelect: () => void;
  onColumnSelect: (columnId: string) => void;
  onDoubleClick: () => void;
  onColumnMouseDown: (columnId: string, e: React.MouseEvent) => void;
}

export const CanvasTable: React.FC<CanvasTableProps> = ({
  table,
  isSelected,
  selectedColumnId,
  onMove,
  onSelect,
  onColumnSelect,
  onDoubleClick,
  onColumnMouseDown
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const tableRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === tableRef.current || (e.target as HTMLElement).classList.contains('table-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - table.position.x,
        y: e.clientY - table.position.y
      });
      onSelect();
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      onMove({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getColumnIcon = (column: DatabaseColumn) => {
    if (column.primaryKey) return <Key size={12} className="text-yellow-600" />;
    if (column.dataType.includes('INT')) return <Hash size={12} className="text-blue-600" />;
    if (column.dataType.includes('DATE') || column.dataType.includes('TIME')) return <Calendar size={12} className="text-green-600" />;
    if (column.dataType === 'BOOLEAN' || column.dataType === 'BIT') return <ToggleLeft size={12} className="text-purple-600" />;
    return <Type size={12} className="text-gray-600" />;
  };

  const getDataTypeDisplay = (column: DatabaseColumn) => {
    let display = column.dataType;
    if (column.length && ['VARCHAR', 'CHAR'].includes(column.dataType)) {
      display += `(${column.length})`;
    }
    if (column.precision && column.scale !== undefined && column.dataType === 'DECIMAL') {
      display += `(${column.precision},${column.scale})`;
    }
    return display;
  };

  return (
    <div
      ref={tableRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 cursor-move ${
        isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      style={{
        left: table.position.x,
        top: table.position.y,
        minWidth: 250,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={onDoubleClick}
    >
      {/* Table Header */}
      <div className="table-header bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <h3 className="font-semibold text-gray-800 text-sm">{table.name}</h3>
        {table.description && (
          <p className="text-xs text-gray-500 mt-1">{table.description}</p>
        )}
      </div>

      {/* Columns */}
      <div className="divide-y divide-gray-100">
        {table.columns.map((column, index) => (
          <div
            key={column.id}
            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedColumnId === column.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onColumnSelect(column.id)}
            onMouseDown={(e) => onColumnMouseDown(column.id, e)}
          >
            <div className="flex items-center space-x-2">
              {getColumnIcon(column)}
              <span className="text-sm font-medium text-gray-800 flex-1">
                {column.name}
              </span>
              <div className="flex items-center space-x-1">
                {column.nullable && (
                  <span className="text-xs text-gray-400">NULL</span>
                )}
                {column.autoIncrement && (
                  <span className="text-xs text-blue-500">AI</span>
                )}
                {column.unique && (
                  <span className="text-xs text-purple-500">UQ</span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getDataTypeDisplay(column)}
              {column.defaultValue && (
                <span className="ml-2">default: {column.defaultValue}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Points */}
      {isSelected && (
        <>
          <div className="absolute -left-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 cursor-crosshair opacity-70 hover:opacity-100" />
          <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 cursor-crosshair opacity-70 hover:opacity-100" />
          <div className="absolute left-1/2 -top-2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 cursor-crosshair opacity-70 hover:opacity-100" />
          <div className="absolute left-1/2 -bottom-2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 cursor-crosshair opacity-70 hover:opacity-100" />
        </>
      )}
    </div>
  );
};