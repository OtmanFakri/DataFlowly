import { useState, useCallback } from 'react';
import { useDatabase } from './hooks/useDatabase';
import { Toolbar } from './components/Toolbar/Toolbar';
import { DatabaseFlow } from './components/Flow/DatabaseFlow';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';
import { JSONEditor } from './components/JSONEditor/JSONEditor';
import { ExportPanel } from './components/ExportPanel/ExportPanel';
import { DatabaseEngine } from './types/database';
import {ChatAI} from "./components/Chat/ChatAI.tsx";

function App() {
  const {
    schema,
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
    canUndo,
    canRedo
  } = useDatabase();

  const [showJSONEditor, setShowJSONEditor] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showChatAI, setShowChatAI] = useState(false);

  const handleAddTable = useCallback(() => {
    // Add table at center of viewport
    const tableId = addTable({ x: 100, y: 100 });
    setSelection(tableId);
    setShowPropertyPanel(true);
  }, [addTable, setSelection]);

  const handleTableSelect = useCallback((tableId: string) => {
    setSelection(tableId);
    setShowPropertyPanel(true);
  }, [setSelection]);

  const handleColumnSelect = useCallback((tableId: string, columnId: string) => {
    setSelection(tableId, columnId);
    setShowPropertyPanel(true);
  }, [setSelection]);

  const handleRelationshipSelect = useCallback((relationshipId: string) => {
    setSelection(undefined, undefined, relationshipId);
    setShowPropertyPanel(true);
  }, [setSelection]);

  const handleEngineChange = useCallback((engine: string) => {
    const newSchema = {
      ...schema,
      database: {
        ...schema.database,
        engine: engine as DatabaseEngine
      }
    };
    importSchema(newSchema);
  }, [schema, importSchema]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const schema = JSON.parse(e.target?.result as string);
            importSchema(schema);
          } catch (err) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [importSchema]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(schema, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schema.database.name.replace(/\s+/g, '_')}_schema.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [schema]);

  return (
      <div className="h-screen flex flex-col bg-gray-100">
        <Toolbar
            onAddTable={handleAddTable}
            onImport={handleImport}
            onExport={handleExport}
            onShowJSON={() => setShowJSONEditor(true)}
            onShowSQL={() => setShowExportPanel(true)}
            onShowChatAI={() => setShowChatAI(true)}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            databaseEngine={schema.database.engine}
            onEngineChange={handleEngineChange}
        />

        <div className="flex-1 flex">
          <DatabaseFlow
              schema={schema}
              onTableUpdate={updateTable}
              onColumnUpdate={updateColumn}
              onAddColumn={addColumn}
              onDeleteColumn={deleteColumn}
              onAddRelationship={addRelationship}
              onUpdateRelationship={updateRelationship}
              onTablePositionChange={updateTablePosition}
              onTableSelect={handleTableSelect}
              onColumnSelect={handleColumnSelect}
              onRelationshipSelect={handleRelationshipSelect}
          />

          {showPropertyPanel && (
              <PropertyPanel
                  schema={schema}
                  onUpdateTable={updateTable}
                  onUpdateColumn={updateColumn}
                  onAddColumn={addColumn}
                  onDeleteColumn={deleteColumn}
                  onDeleteTable={deleteTable}
                  onUpdateRelationship={updateRelationship}
                  onDeleteRelationship={deleteRelationship}
                  onClose={() => setShowPropertyPanel(false)}
              />
          )}

          {showChatAI && (
              <ChatAI
                  schema={schema}
                  onClose={() => setShowChatAI(false)}
              />
          )}
        </div>

        {showJSONEditor && (
            <JSONEditor
                schema={schema}
                onImport={importSchema}
                onClose={() => setShowJSONEditor(false)}
            />
        )}

        {showExportPanel && (
            <ExportPanel
                schema={schema}
                onClose={() => setShowExportPanel(false)}
            />
        )}
      </div>
  );
}

export default App;