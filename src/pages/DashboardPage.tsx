import React, {useEffect, useState} from 'react';
import {
    Plus,
    Search,
    Grid3X3,
    List,
    Calendar,
    Database,
    Star,
    Clock,
    Users,
    Settings,
    LogOut,
    Sparkles,
    Bot,
    ChevronDown,
    MoreVertical,
    Trash2,
} from 'lucide-react';
import {signOut} from 'firebase/auth';
import {useNavigate} from "react-router-dom";
import {auth, db} from "../utils/config.ts";
import {collection, doc, getDoc, serverTimestamp, setDoc} from 'firebase/firestore';
import {deleteDiagramById, Diagram, getAllDiagrams} from "../utils/Digrammes.ts";
import SettingsModal from "./SettingsModel.tsx";

type NewDiagramInput = {
    name: string;
    description: string;
    engine: 'mysql' | 'postgresql' | 'sqlserver';
};

// ConfirmationModal component
function ConfirmationModal({open, title, message, onCancel, onConfirm}: {
    open: boolean,
    title?: string,
    message: string,
    onCancel: () => void,
    onConfirm: () => void
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
                <p className="mb-6 text-gray-700">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export const DashboardPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterEngine, setFilterEngine] = useState<string>('all');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [points, setPoints] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [diagrams, setDiagrams] = useState<Diagram[]>([]);
    const [userInitials, setUserInitials] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

    const [newDiagram, setNewDiagram] = useState<NewDiagramInput>({
        name: '',
        description: '',
        engine: 'mysql',
    });
    const [creating, setCreating] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
            } else {
                // Set user initials
                let initials = '';
                if (user.displayName) {
                    const names = user.displayName.split(' ');
                    initials = names.map(n => n[0]).join('').toUpperCase();
                } else if (user.email) {
                    initials = user.email[0].toUpperCase();
                }
                setUserInitials(initials);

                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    if (data.point !== undefined) {
                        setPoints(data.point);
                    } else {
                        setPoints(50);
                    }
                } else {
                    setPoints(50);
                }

                // Fetch diagrams after user is authenticated
                try {
                    const fetchedDiagrams = await getAllDiagrams(user.uid);
                    setDiagrams(fetchedDiagrams);
                } catch (error) {
                    console.error("Failed to fetch diagrams:", error);
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleCreateDiagram = async () => {
        setCreating(true);
        try {
            const newDocRef = doc(collection(db, 'diagrams'));
            const now = serverTimestamp();
            const user = auth.currentUser;

            if (!user) {
                console.error("User is not authenticated");
                return;
            }
            const diagramData = {
                ...newDiagram,  // <-- fix here: use newDiagram instead of diagram
                isStarred: false,
                createdAt: now,
                collaborators: 1,
                tableCount: 0,
                relationshipCount: 0,
                updatedAt: now,
                userId: user.uid,
                schema: {
                    database: {
                        name: 'New Database',
                        engine: 'mysql',
                        tables: [],
                        relationships: []
                    }
                },
            };

            await setDoc(newDocRef, diagramData);

            // Refresh diagrams list after creation
            const updatedDiagrams = await getAllDiagrams(user.uid);
            setDiagrams(updatedDiagrams);
            setShowCreateModal(false);
            setNewDiagram({
                name: '',
                description: '',
                engine: 'mysql',
            });
        } catch (error) {
            console.error("Failed to create diagram:", error);
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            await signOut(auth);
            navigate('/login'); // or wherever you want to redirect after logout
        } catch (err: any) {
            setError(err.message || 'Logout failed');
        } finally {
            setLoading(false);
        }
    };


    const getEngineIcon = (engine: string) => {
        const iconClass = "w-4 h-4";
        switch (engine) {
            case 'mysql':
                return <Database className={`${iconClass} text-orange-500`}/>;
            case 'postgresql':
                return <Database className={`${iconClass} text-blue-500`}/>;
            case 'sqlserver':
                return <Database className={`${iconClass} text-red-500`}/>;
            default:
                return <Database className={`${iconClass} text-gray-500`}/>;
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    };

    const DiagramCard: React.FC<{ diagram: Diagram }> = ({diagram}) => (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group cursor-pointer"
            onClick={() => diagram.id && navigate(`/app/${diagram.id}`)}
        >
            <div
                className="p-6"
                // onClick={() => onOpenDiagram(diagram.id)}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        {getEngineIcon(diagram.engine)}
                        <span className="text-xs font-medium text-gray-500 uppercase">
              {diagram.engine}
            </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (diagram.id) {
                                    setConfirmDeleteId(diagram.id);
                                }
                            }}
                            className="p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {diagram.name}
                    </h3>
                    {diagram.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {diagram.description}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Database size={14}/>
                        <span>{diagram.tableCount} tables</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>{diagram.relationshipCount} relations</span>
                    </div>
                    {diagram.collaborators && diagram.collaborators > 1 && (
                        <>
                            <div className="flex items-center space-x-1">
                                <Users size={14}/>
                                <span>{diagram.collaborators}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Clock size={12}/>
                        <span>Updated {formatDate(diagram.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar size={12}/>
                        <span>Created {formatDate(diagram.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const DiagramListItem: React.FC<{ diagram: Diagram }> = ({diagram}) => (
        <div
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => diagram.id && navigate(`/app/${diagram.id}`)}
        >
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            {getEngineIcon(diagram.engine)}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Toggle star
                                }}
                                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                                    diagram.isStarred ? 'text-yellow-500' : 'text-gray-400'
                                }`}
                            >
                                <Star size={14} className={diagram.isStarred ? 'fill-current' : ''}/>
                            </button>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                {diagram.name}
                            </h3>
                            {diagram.description && (
                                <p className="text-xs text-gray-600 truncate mt-1">
                                    {diagram.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <div className="text-center">
                            <div className="font-medium text-gray-900">{diagram.tableCount}</div>
                            <div>Tables</div>
                        </div>
                        <div className="text-center">
                            <div className="font-medium text-gray-900">{diagram.relationshipCount}</div>
                            <div>Relations</div>
                        </div>
                        <div className="text-center min-w-[80px]">
                            <div className="font-medium text-gray-900">{formatDate(diagram.updatedAt)}</div>
                            <div>Updated</div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Show menu
                            }}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <MoreVertical size={16}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Filter diagrams based on search and engine
    const filteredDiagrams = diagrams.filter(diagram => {
        const matchesSearch = diagram.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            diagram.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEngine = filterEngine === 'all' || diagram.engine === filterEngine;
        return matchesSearch && matchesEngine;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-white"/>
                            </div>
                            <span
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DataFlowly
              </span>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            {/* AI Points */}
                            <div
                                className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-lg border border-purple-200">
                                <Sparkles className="w-4 h-4 text-purple-600"/>
                                <span className="text-sm font-medium text-purple-700">{points} AI Points</span>
                            </div>

                            {/* User Profile */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div
                                        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">{userInitials}</span>
                                    </div>
                                    <ChevronDown size={16} className="text-gray-500"/>
                                </button>

                                {showUserMenu && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <button onClick={()=>setShowSettingsModal(true)}
                                           className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Settings size={16}/>
                                            <span>Settings</span>
                                        </button>
                                        <a href="#"
                                           className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Bot size={16}/>
                                            <span>Buy AI Points</span>
                                        </a>
                                        <hr className="my-1"/>
                                        <button
                                            onClick={handleLogout}
                                            disabled={loading}
                                            className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <LogOut size={16}/>
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Diagrams</h1>
                            <p className="text-gray-600 mt-1">Create and manage your database schemas</p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                <Plus size={16}/>
                                <span>New Diagram</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}/>
                                <input
                                    type="text"
                                    placeholder="Search diagrams..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                />
                            </div>

                            <select
                                value={filterEngine}
                                onChange={(e) => setFilterEngine(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Engines</option>
                                <option value="mysql">MySQL</option>
                                <option value="postgresql">PostgreSQL</option>
                                <option value="sqlserver">SQL Server</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                <Grid3X3 size={16}/>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                <List size={16}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Diagrams Grid/List */}
                {filteredDiagrams.length === 0 ? (
                    <div className="text-center py-12">
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Database className="w-8 h-8 text-gray-400"/>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery || filterEngine !== 'all' ? 'No diagrams found' : 'No diagrams yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || filterEngine !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first database diagram to get started'
                            }
                        </p>
                        {!searchQuery && filterEngine === 'all' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                            >
                                <Plus size={16}/>
                                <span>Create Your First Diagram</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-3'
                    }>
                        {filteredDiagrams.map((diagram) =>
                            viewMode === 'grid'
                                ? <DiagramCard key={diagram.id} diagram={diagram}/>
                                : <DiagramListItem key={diagram.id} diagram={diagram}/>
                        )}
                    </div>
                )}
            </main>
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Create New Diagram</h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                await handleCreateDiagram();
                            }}
                            className="space-y-4"
                        >
                            {/* form inputs unchanged */}
                            <input
                                className="w-full border rounded px-3 py-2"
                                placeholder="Name"
                                value={newDiagram.name}
                                onChange={e => setNewDiagram({...newDiagram, name: e.target.value})}
                                required
                            />
                            <textarea
                                className="w-full border rounded px-3 py-2"
                                placeholder="Description"
                                value={newDiagram.description}
                                onChange={e => setNewDiagram({...newDiagram, description: e.target.value})}
                            />
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={newDiagram.engine}
                                onChange={e => setNewDiagram({...newDiagram, engine: e.target.value as any})}
                            >
                                <option value="mysql">MySQL</option>
                                <option value="postgresql">PostgreSQL</option>
                                <option value="sqlserver">SQL Server</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={creating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white"
                                    disabled={creating}
                                >
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Confirmation Modal for delete */}
            <ConfirmationModal
                open={!!confirmDeleteId}
                title="Delete Diagram"
                message="Are you sure you want to delete this diagram? This action cannot be undone."
                onCancel={() => setConfirmDeleteId(null)}
                onConfirm={async () => {
                    if (confirmDeleteId) {
                        await deleteDiagramById(confirmDeleteId);
                        setConfirmDeleteId(null);
                        const user = auth.currentUser;
                        if (user) {
                            const updatedDiagrams = await getAllDiagrams(user.uid);
                            setDiagrams(updatedDiagrams);
                        }
                    }
                }}
            />
            {
                showSettingsModal && (
                    <SettingsModal
                        isOpen={showSettingsModal}
                        onClose={() => setShowSettingsModal(false)}
                    />
                )
            }
        </div>
    );
};