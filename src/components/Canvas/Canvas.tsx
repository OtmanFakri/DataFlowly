import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CanvasTable } from './CanvasTable';
import { RelationshipLine } from './RelationshipLine';
import { DatabaseTable, DatabaseRelationship, CanvasViewport } from '../../types/database';

interface CanvasProps {
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
  selectedTableId?: string;
  selectedColumnId?: string;
  onTableMove: (tableId: string, position: { x: number; y: number }) => void;
  onTableSelect: (tableId: string) => void;
  onColumnSelect: (tableId: string, columnId: string) => void;
  onAddTable: (position: { x: number; y: number }) => void;
  onTableDoubleClick: (tableId: string) => void;
  viewport: CanvasViewport;
  onViewportChange: (viewport: CanvasViewport) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  tables,
  relationships,
  selectedTableId,
  selectedColumnId,
  onTableMove,
  onTableSelect,
  onColumnSelect,
  onAddTable,
  onTableDoubleClick,
  viewport,
  onViewportChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false);
  const [relationshipStart, setRelationshipStart] = useState<{
    tableId: string;
    columnId: string;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle click or Ctrl+Click for panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      onViewportChange({
        ...viewport,
        panX: viewport.panX + deltaX,
        panY: viewport.panY + deltaY
      });
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint, viewport, onViewportChange]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewport.panX) / viewport.zoom;
    const y = (e.clientY - rect.top - viewport.panY) / viewport.zoom;
    
    onAddTable({ x, y });
  }, [viewport, onAddTable]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, viewport.zoom * delta));
    
    onViewportChange({
      ...viewport,
      zoom: newZoom
    });
  }, [viewport, onViewportChange]);

  const handleColumnMouseDown = useCallback((tableId: string, columnId: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setIsCreatingRelationship(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setRelationshipStart({
          tableId,
          columnId,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
      setIsCreatingRelationship(false);
      setRelationshipStart(null);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-gray-50 relative overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Relationships */}
        {relationships.map(relationship => {
          const sourceTable = tables.find(t => t.id === relationship.sourceTable);
          const targetTable = tables.find(t => t.id === relationship.targetTable);
          
          if (!sourceTable || !targetTable) return null;
          
          return (
            <RelationshipLine
              key={relationship.id}
              relationship={relationship}
              sourceTable={sourceTable}
              targetTable={targetTable}
              isSelected={false}
              onClick={() => {}}
            />
          );
        })}

        {/* Tables */}
        {tables.map(table => (
          <CanvasTable
            key={table.id}
            table={table}
            isSelected={selectedTableId === table.id}
            selectedColumnId={selectedColumnId}
            onMove={(position) => onTableMove(table.id, position)}
            onSelect={() => onTableSelect(table.id)}
            onColumnSelect={(columnId) => onColumnSelect(table.id, columnId)}
            onDoubleClick={() => onTableDoubleClick(table.id)}
            onColumnMouseDown={(columnId, e) => handleColumnMouseDown(table.id, columnId, e)}
          />
        ))}
      </div>

      {/* Instructions */}
      {tables.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">Welcome to Database Designer</div>
            <div className="text-sm">
              Double-click to create a table, or use the "Add Table" button
            </div>
            <div className="text-xs mt-2 text-gray-400">
              Hold Shift + Click column to create relationships
            </div>
          </div>
        </div>
      )}
    </div>
  );
};