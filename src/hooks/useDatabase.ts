import { useState, useCallback } from 'react';
import { DatabaseSchema, DatabaseTable, DatabaseColumn, DatabaseRelationship } from '../types/database';
import { Node, Edge, Connection } from 'reactflow';

interface DatabaseState extends DatabaseSchema {
  selectedTableId?: string;
  selectedColumnId?: string;
  selectedRelationshipId?: string;
}

export const useDatabase = () => {
  const [state, setState] = useState<DatabaseState>({
    database: {
      name: 'New Database',
      engine: 'mysql',
      tables: [],
      relationships: []
    }
  });

  const [history, setHistory] = useState<DatabaseState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newState: DatabaseState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...newState });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setState(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setState(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const updateDatabase = useCallback((updates: Partial<DatabaseState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    saveToHistory(newState);
  }, [state, saveToHistory]);

  const addTable = useCallback((position: { x: number; y: number }) => {
    const newTable: DatabaseTable = {
      id: `table_${Date.now()}`,
      name: `table_${state.database.tables.length + 1}`,
      position,
      columns: [
        {
          id: `col_${Date.now()}`,
          name: 'id',
          dataType: 'INT',
          nullable: false,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
          index: true
        }
      ],
      indexes: []
    };

    updateDatabase({
      database: {
        ...state.database,
        tables: [...state.database.tables, newTable]
      }
    });

    return newTable.id;
  }, [state, updateDatabase]);

  const updateTable = useCallback((tableId: string, updates: Partial<DatabaseTable>) => {
    const updatedTables = state.database.tables.map(table =>
      table.id === tableId ? { ...table, ...updates } : table
    );

    updateDatabase({
      database: {
        ...state.database,
        tables: updatedTables
      }
    });
  }, [state, updateDatabase]);

  const deleteTable = useCallback((tableId: string) => {
    const updatedTables = state.database.tables.filter(table => table.id !== tableId);
    const updatedRelationships = state.database.relationships.filter(
      rel => rel.sourceTable !== tableId && rel.targetTable !== tableId
    );

    updateDatabase({
      database: {
        ...state.database,
        tables: updatedTables,
        relationships: updatedRelationships
      },
      selectedTableId: state.selectedTableId === tableId ? undefined : state.selectedTableId
    });
  }, [state, updateDatabase]);

  const addColumn = useCallback((tableId: string) => {
    const table = state.database.tables.find(t => t.id === tableId);
    if (!table) return '';

    const newColumn: DatabaseColumn = {
      id: `col_${Date.now()}`,
      name: `column_${table.columns.length + 1}`,
      dataType: 'VARCHAR',
      length: 255,
      nullable: true,
      autoIncrement: false,
      primaryKey: false,
      unique: false,
      index: false
    };

    const updatedColumns = [...table.columns, newColumn];
    updateTable(tableId, { columns: updatedColumns });
    return newColumn.id;
  }, [state, updateTable]);

  const updateColumn = useCallback((tableId: string, columnId: string, updates: Partial<DatabaseColumn>) => {
    const table = state.database.tables.find(t => t.id === tableId);
    if (!table) return;

    const updatedColumns = table.columns.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    );

    updateTable(tableId, { columns: updatedColumns });
  }, [updateTable]);

  const deleteColumn = useCallback((tableId: string, columnId: string) => {
    const table = state.database.tables.find(t => t.id === tableId);
    if (!table) return;

    const updatedColumns = table.columns.filter(col => col.id !== columnId);
    const updatedRelationships = state.database.relationships.filter(
      rel => rel.sourceColumn !== columnId && rel.targetColumn !== columnId
    );

    updateTable(tableId, { columns: updatedColumns });
    updateDatabase({
      database: {
        ...state.database,
        relationships: updatedRelationships
      }
    });
  }, [state, updateTable, updateDatabase]);

  const addRelationship = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
      return;
    }

    const sourceTable = connection.source;
    const targetTable = connection.target;
    const sourceColumn = connection.sourceHandle;
    const targetColumn = connection.targetHandle;

    const newRelationship: DatabaseRelationship = {
      id: `rel_${Date.now()}`,
      name: `fk_${sourceTable}_${targetTable}`,
      type: 'ONE_TO_MANY',
      sourceTable,
      sourceColumn,
      targetTable,
      targetColumn,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    };

    updateDatabase({
      database: {
        ...state.database,
        relationships: [...state.database.relationships, newRelationship]
      }
    });

    return newRelationship.id;
  }, [state, updateDatabase]);

  const updateRelationship = useCallback((relationshipId: string, updates: Partial<DatabaseRelationship>) => {
    const updatedRelationships = state.database.relationships.map(rel =>
      rel.id === relationshipId ? { ...rel, ...updates } : rel
    );

    updateDatabase({
      database: {
        ...state.database,
        relationships: updatedRelationships
      }
    });
  }, [state, updateDatabase]);

  const deleteRelationship = useCallback((relationshipId: string) => {
    const updatedRelationships = state.database.relationships.filter(
      rel => rel.id !== relationshipId
    );

    updateDatabase({
      database: {
        ...state.database,
        relationships: updatedRelationships
      }
    });
  }, [state, updateDatabase]);

  const setSelection = useCallback((tableId?: string, columnId?: string, relationshipId?: string) => {
    setState(prev => ({
      ...prev,
      selectedTableId: tableId,
      selectedColumnId: columnId,
      selectedRelationshipId: relationshipId
    }));
  }, []);

  const importSchema = useCallback((schema: DatabaseSchema) => {
    const newState = {
      ...schema,
      selectedTableId: undefined,
      selectedColumnId: undefined,
      selectedRelationshipId: undefined
    };
    setState(newState);
    saveToHistory(newState);
  }, [saveToHistory]);

  const updateTablePosition = useCallback((tableId: string, position: { x: number; y: number }) => {
    updateTable(tableId, { position });
  }, [updateTable]);

  return {
    schema: state,
    addTable,
    updateTable,
    deleteTable,
    addColumn,
    updateColumn,
    deleteColumn,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    setSelection,
    importSchema,
    updateTablePosition,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};