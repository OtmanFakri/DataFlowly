import {useState, useCallback, useEffect} from 'react';
import {useDatabase} from './hooks/useDatabase';
import {Toolbar} from './components/Toolbar/Toolbar';
import {DatabaseFlow} from './components/Flow/DatabaseFlow';
import {PropertyPanel} from './components/PropertyPanel/PropertyPanel';
import {JSONEditor} from './components/JSONEditor/JSONEditor';
import {ExportPanel} from './components/ExportPanel/ExportPanel';
import {DatabaseEngine} from './types/database';
import {ChatAI} from "./components/Chat/ChatAI.tsx";
import {useParams} from 'react-router-dom';
import {getDiagramSchemaById, updateDiagramSchema} from './utils/Digrammes';
import {auth, db} from './utils/config';
import {doc, onSnapshot} from 'firebase/firestore';

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

    const {id} = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>("idle");
    const [userPoints, setUserPoints] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;
        if (!id) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        setLoading(true);
        setNotFound(false);
        getDiagramSchemaById(id)
            .then(schemaData => {
                if (isMounted) {
                    if (!schemaData) {
                        setNotFound(true);
                    } else {
                        setNotFound(false);
                        importSchema(schemaData);  // load schema into state
                    }
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setNotFound(true);
                    setLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                setUserPoints(null);
                return;
            }
            const userDocRef = doc(db, 'users', user.uid);
            const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserPoints(docSnap.data().point ?? 0);
                } else {
                    setUserPoints(0);
                }
            });
            // Cleanup snapshot listener when user changes or component unmounts
            return () => unsubscribeSnapshot();
        });
        // Cleanup auth listener on unmount
        return () => unsubscribe();
    }, []);


    const [showJSONEditor, setShowJSONEditor] = useState(false);
    const [showExportPanel, setShowExportPanel] = useState(false);
    const [showPropertyPanel, setShowPropertyPanel] = useState(false);
    const [showChatAI, setShowChatAI] = useState(false);

    const [chatJsonSchema, setChatJsonSchema] = useState<any | null>(null);
    const handleChatJsonUpdate = useCallback((jsonSchema: any) => {
        importSchema(jsonSchema);
    }, [importSchema]);

    const handleAddTable = useCallback(() => {
        // Add table at center of viewport
        const tableId = addTable({x: 100, y: 100});
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
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${schema.database.name.replace(/\s+/g, '_')}_schema.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [schema]);

    const handleSaveSchema = async () => {
        if (!id) return;
        setSaveStatus('saving');
        try {
            const cleanSchema = JSON.parse(JSON.stringify(schema));
            await updateDiagramSchema(id, cleanSchema);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (e) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
    if (notFound) return <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-500">Page
        Not Found</div>;

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
                onSave={handleSaveSchema}
                saveStatus={saveStatus}
                userPoints={userPoints}
            />
            <div className="flex-1 flex">
                <DatabaseFlow
                    schema={chatJsonSchema ?? schema}
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
                        onJsonResponse={handleChatJsonUpdate}
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