export interface DatabaseColumn {
  id: string;
  name: string;
  dataType: DataType;
  length?: number;
  precision?: number;
  scale?: number;
  nullable: boolean;
  defaultValue?: string;
  autoIncrement: boolean;
  primaryKey: boolean;
  unique: boolean;
  index: boolean;
  comment?: string;
}

export interface DatabaseIndex {
  name: string;
  type: 'INDEX' | 'UNIQUE' | 'PRIMARY';
  columns: string[];
}

export interface DatabaseTable {
  id: string;
  name: string;
  description?: string;
  position: { x: number; y: number };
  columns: DatabaseColumn[];
  indexes: DatabaseIndex[];
}

export interface DatabaseRelationship {
  id: string;
  name: string;
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  onDelete: CascadeAction;
  onUpdate: CascadeAction;
}

export interface DatabaseSchema {
  database: {
    name: string;
    engine: DatabaseEngine;
    tables: DatabaseTable[];
    relationships: DatabaseRelationship[];
  };
}

export type DataType = 
  | 'VARCHAR' | 'CHAR' | 'TEXT' | 'LONGTEXT'
  | 'INT' | 'BIGINT' | 'SMALLINT' | 'TINYINT'
  | 'DECIMAL' | 'FLOAT' | 'DOUBLE'
  | 'DATE' | 'DATETIME' | 'TIMESTAMP' | 'TIME'
  | 'BOOLEAN' | 'BIT'
  | 'JSON' | 'BLOB' | 'BINARY';

export type DatabaseEngine = 'mysql' | 'postgresql' | 'sqlserver';

export type CascadeAction = 'CASCADE' | 'SET_NULL' | 'RESTRICT' | 'NO_ACTION';

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasViewport {
  zoom: number;
  panX: number;
  panY: number;
}

// React Flow specific types
export interface TableNodeData {
  table: DatabaseTable;
  onTableUpdate: (updates: Partial<DatabaseTable>) => void;
  onColumnUpdate: (columnId: string, updates: Partial<DatabaseColumn>) => void;
  onAddColumn: () => void;
  onDeleteColumn: (columnId: string) => void;
  onColumnSelect: (columnId: string) => void;
  selectedColumnId?: string;
}

export interface ConnectionData {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}