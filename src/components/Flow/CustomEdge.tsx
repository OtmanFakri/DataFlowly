import React from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getEdgeColor = () => {
    if (selected) return '#3b82f6';
    if (data?.type === 'ONE_TO_ONE') return '#10b981';
    if (data?.type === 'ONE_TO_MANY') return '#f59e0b';
    if (data?.type === 'MANY_TO_MANY') return '#ef4444';
    return '#6b7280';
  };

  const getStrokeDasharray = () => {
    if (data?.type === 'ONE_TO_ONE') return '5,0';
    if (data?.type === 'ONE_TO_MANY') return '10,5';
    if (data?.type === 'MANY_TO_MANY') return '15,10,5,10';
    return '0';
  };

  const handleEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data?.onRelationshipClick) {
      data.onRelationshipClick(id);
    }
  };

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: getEdgeColor(),
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: getStrokeDasharray(),
        }}
        className="react-flow__edge-path cursor-pointer"
        d={edgePath}
        onClick={handleEdgeClick}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            fontWeight: 500,
            color: '#6b7280',
            background: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #e5e7eb',
            pointerEvents: 'all',
            cursor: 'pointer',
          }}
          className="nodrag nopan"
          onClick={handleEdgeClick}
        >
          {data?.type?.replace('_', '-') || 'FK'}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;