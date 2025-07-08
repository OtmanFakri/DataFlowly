import React from 'react';
import { DatabaseRelationship, DatabaseTable } from '../../types/database';

interface RelationshipLineProps {
  relationship: DatabaseRelationship;
  sourceTable: DatabaseTable;
  targetTable: DatabaseTable;
  isSelected: boolean;
  onClick: () => void;
}

export const RelationshipLine: React.FC<RelationshipLineProps> = ({
  relationship,
  sourceTable,
  targetTable,
  isSelected,
  onClick
}) => {
  // Calculate connection points
  const sourceX = sourceTable.position.x + 125; // Center of table (assuming 250px width)
  const sourceY = sourceTable.position.y + 50; // Approximate center height
  const targetX = targetTable.position.x + 125;
  const targetY = targetTable.position.y + 50;

  // Calculate control points for curved line
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Create a curved path
  const controlOffset = Math.min(distance / 4, 50);
  const control1X = sourceX + (dx * 0.3) + (dy > 0 ? -controlOffset : controlOffset);
  const control1Y = sourceY + (dy * 0.3) + (dx > 0 ? controlOffset : -controlOffset);
  const control2X = targetX - (dx * 0.3) + (dy > 0 ? -controlOffset : controlOffset);
  const control2Y = targetY - (dy * 0.3) + (dx > 0 ? controlOffset : -controlOffset);

  const pathData = `M ${sourceX} ${sourceY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${targetX} ${targetY}`;

  // Calculate arrow position and rotation
  const arrowX = targetX;
  const arrowY = targetY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const getLineColor = () => {
    if (isSelected) return '#3b82f6';
    switch (relationship.type) {
      case 'ONE_TO_ONE': return '#10b981';
      case 'ONE_TO_MANY': return '#f59e0b';
      case 'MANY_TO_MANY': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLineStyle = () => {
    switch (relationship.type) {
      case 'ONE_TO_ONE': return '5,0';
      case 'ONE_TO_MANY': return '10,5';
      case 'MANY_TO_MANY': return '15,10,5,10';
      default: return '0';
    }
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      width="100%"
      height="100%"
    >
      {/* Relationship line */}
      <path
        d={pathData}
        fill="none"
        stroke={getLineColor()}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={getLineStyle()}
        className="pointer-events-auto cursor-pointer"
        onClick={onClick}
      />

      {/* Arrow head */}
      <polygon
        points="0,-5 10,0 0,5"
        fill={getLineColor()}
        transform={`translate(${arrowX}, ${arrowY}) rotate(${angle})`}
        className="pointer-events-auto cursor-pointer"
        onClick={onClick}
      />

      {/* Relationship label */}
      <text
        x={midX}
        y={midY - 10}
        textAnchor="middle"
        className="text-xs fill-gray-600 font-medium pointer-events-none"
        style={{ fontSize: '10px' }}
      >
        {relationship.type.replace('_', '-')}
      </text>

      {/* Selection indicator */}
      {isSelected && (
        <circle
          cx={midX}
          cy={midY}
          r="8"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="pointer-events-auto cursor-pointer"
          onClick={onClick}
        />
      )}
    </svg>
  );
};