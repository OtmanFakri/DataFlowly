import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TableNode from './TableNode';
import CustomEdge from './CustomEdge';
import { DatabaseSchema, DatabaseTable, TableNodeData } from '../../types/database';

interface DatabaseFlowProps {
  schema: DatabaseSchema & {
    selectedTableId?: string;
    selectedColumnId?: string;
    selectedRelationshipId?: string;
  };
  onTableUpdate: (tableId: string, updates: Partial<DatabaseTable>) => void;
  onColumnUpdate: (tableId: string, columnId: string, updates: any) => void;
  onAddColumn: (tableId: string) => string;
  onDeleteColumn: (tableId: string, columnId: string) => void;
  onAddRelationship: (connection: Connection) => string | undefined;
  onUpdateRelationship: (relationshipId: string, updates: any) => void;
  onTablePositionChange: (tableId: string, position: { x: number; y: number }) => void;
  onTableSelect: (tableId: string) => void;
  onColumnSelect: (tableId: string, columnId: string) => void;
  onRelationshipSelect: (relationshipId: string) => void;
}

const nodeTypes: NodeTypes = {
  tableNode: TableNode,
};

const edgeTypes: EdgeTypes = {
  customEdge: CustomEdge,
};

export const DatabaseFlow: React.FC<DatabaseFlowProps> = ({
  schema,
  onTableUpdate,
  onColumnUpdate,
  onAddColumn,
  onDeleteColumn,
  onAddRelationship,
  onUpdateRelationship,
  onTablePositionChange,
  onTableSelect,
  onColumnSelect,
  onRelationshipSelect,
}) => {
  // Convert tables to React Flow nodes
  const initialNodes: Node<TableNodeData>[] = useMemo(() => 
    schema.database.tables.map(table => ({
      id: table.id,
      type: 'tableNode',
      position: table.position,
      data: {
        table,
        onTableUpdate: (updates) => onTableUpdate(table.id, updates),
        onColumnUpdate: (columnId, updates) => onColumnUpdate(table.id, columnId, updates),
        onAddColumn: () => onAddColumn(table.id),
        onDeleteColumn: (columnId) => onDeleteColumn(table.id, columnId),
        onColumnSelect: (columnId) => onColumnSelect(table.id, columnId),
        selectedColumnId: schema.selectedColumnId,
      },
      selected: schema.selectedTableId === table.id,
    })), [schema, onTableUpdate, onColumnUpdate, onAddColumn, onDeleteColumn, onColumnSelect]);

  // Convert relationships to React Flow edges
  const initialEdges: Edge[] = useMemo(() => 
    schema.database.relationships.map(relationship => ({
      id: relationship.id,
      source: relationship.sourceTable,
      target: relationship.targetTable,
      sourceHandle: relationship.sourceColumn,
      targetHandle: relationship.targetColumn,
      type: 'customEdge',
      selected: schema.selectedRelationshipId === relationship.id,
      data: {
        type: relationship.type,
        onDelete: relationship.onDelete,
        onUpdate: relationship.onUpdate,
        onRelationshipClick: (relationshipId: string) => onRelationshipSelect(relationshipId),
      },
    })), [schema.database.relationships, schema.selectedRelationshipId, onRelationshipSelect]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when schema changes
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update edges when relationships change
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    const relationshipId = onAddRelationship(connection);
    if (relationshipId) {
      const newEdge: Edge = {
        id: relationshipId,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle!,
        targetHandle: connection.targetHandle!,
        type: 'customEdge',
        data: {
          type: 'ONE_TO_MANY',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          onRelationshipClick: (relationshipId: string) => onRelationshipSelect(relationshipId),
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }
  }, [onAddRelationship, setEdges, onRelationshipSelect]);

  const onNodeDragStop = useCallback((_: any, node: Node) => {
    onTablePositionChange(node.id, node.position);
  }, [onTablePositionChange]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    onTableSelect(node.id);
  }, [onTableSelect]);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    onRelationshipSelect(edge.id);
  }, [onRelationshipSelect]);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Controls className="!bottom-8 !left-4" />
        <MiniMap 
          className="!bottom-8 !right-4 !w-48 !h-32" 
          nodeColor="#e5e7eb"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#e5e7eb"
        />
      </ReactFlow>
    </div>
  );
};