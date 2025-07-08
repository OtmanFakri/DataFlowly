import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Database,
  Trash2,
  Copy,
  Edit3,
  Star,
  Clock,
  Users,
  Settings,
  LogOut,
  Sparkles,
  Bot,
  ChevronDown,
  MoreVertical,
  FolderPlus,
  Import,
  Download
} from 'lucide-react';

interface Diagram {
  id: string;
  name: string;
  description?: string;
  engine: 'mysql' | 'postgresql' | 'sqlserver';
  tableCount: number;
  relationshipCount: number;
  createdAt: Date;
  updatedAt: Date;
  isStarred: boolean;
  thumbnail?: string;
  collaborators?: number;
}

interface DashboardPageProps {
  onCreateDiagram: () => void;
  onOpenDiagram: (diagramId: string) => void;
  userPoints?: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
                                                              onCreateDiagram,
                                                              onOpenDiagram,
                                                              userPoints = 150
                                                            }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEngine, setFilterEngine] = useState<string>('all');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock data for diagrams
  const [diagrams] = useState<Diagram[]>([
    {
      id: '1',
      name: 'E-commerce Database',
      description: 'Complete database schema for online store with products, orders, and users',
      engine: 'mysql',
      tableCount: 12,
      relationshipCount: 18,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isStarred: true,
      collaborators: 3
    },
    {
      id: '2',
      name: 'Blog Platform',
      description: 'Simple blog database with posts, comments, and categories',
      engine: 'postgresql',
      tableCount: 8,
      relationshipCount: 10,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      isStarred: false,
      collaborators: 1
    },
    {
      id: '3',
      name: 'CRM System',
      description: 'Customer relationship management database schema',
      engine: 'sqlserver',
      tableCount: 15,
      relationshipCount: 22,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-19'),
      isStarred: true,
      collaborators: 5
    },
    {
      id: '4',
      name: 'Inventory Management',
      description: 'Warehouse and inventory tracking system',
      engine: 'mysql',
      tableCount: 10,
      relationshipCount: 14,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-17'),
      isStarred: false,
      collaborators: 2
    }
  ]);

  const filteredDiagrams = diagrams.filter(diagram => {
    const matchesSearch = diagram.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diagram.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEngine = filterEngine === 'all' || diagram.engine === filterEngine;
    return matchesSearch && matchesEngine;
  });

  const getEngineIcon = (engine: string) => {
    const iconClass = "w-4 h-4";
    switch (engine) {
      case 'mysql': return <Database className={`${iconClass} text-orange-500`} />;
      case 'postgresql': return <Database className={`${iconClass} text-blue-500`} />;
      case 'sqlserver': return <Database className={`${iconClass} text-red-500`} />;
      default: return <Database className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const DiagramCard: React.FC<{ diagram: Diagram }> = ({ diagram }) => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group cursor-pointer">
        <div
            className="p-6"
            onClick={() => onOpenDiagram(diagram.id)}
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
                    // Toggle star
                  }}
                  className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                      diagram.isStarred ? 'text-yellow-500' : 'text-gray-400'
                  }`}
              >
                <Star size={16} className={diagram.isStarred ? 'fill-current' : ''} />
              </button>
              <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show menu
                  }}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical size={16} />
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
              <Database size={14} />
              <span>{diagram.tableCount} tables</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>•</span>
              <span>{diagram.relationshipCount} relations</span>
            </div>
            {diagram.collaborators && diagram.collaborators > 1 && (
                <>
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{diagram.collaborators}</span>
                  </div>
                </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>Updated {formatDate(diagram.updatedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>Created {formatDate(diagram.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
  );

  const DiagramListItem: React.FC<{ diagram: Diagram }> = ({ diagram }) => (
      <div
          className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
          onClick={() => onOpenDiagram(diagram.id)}
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
                  <Star size={14} className={diagram.isStarred ? 'fill-current' : ''} />
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
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DatabasePro
              </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {/* AI Points */}
                <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-lg border border-purple-200">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">{userPoints} AI Points</span>
                </div>

                {/* User Profile */}
                <div className="relative">
                  <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">JD</span>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Settings size={16} />
                          <span>Settings</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Bot size={16} />
                          <span>Buy AI Points</span>
                        </a>
                        <hr className="my-1" />
                        <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </a>
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
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Import size={16} />
                  <span>Import</span>
                </button>
                <button
                    onClick={onCreateDiagram}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Plus size={16} />
                  <span>New Diagram</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
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
                  <Grid3X3 size={16} />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
                onClick={onCreateDiagram}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Create New Diagram</div>
                <div className="text-sm text-gray-600">Start with a blank schema</div>
              </div>
            </button>


            <button className="flex items-center space-x-3 p-4 bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl hover:bg-orange-100 transition-colors group">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Import className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Import Schema</div>
                <div className="text-sm text-gray-600">Import existing database</div>
              </div>
            </button>
          </div>

          {/* Diagrams Grid/List */}
          {filteredDiagrams.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-gray-400" />
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
                        onClick={onCreateDiagram}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                    >
                      <Plus size={16} />
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
                        ? <DiagramCard key={diagram.id} diagram={diagram} />
                        : <DiagramListItem key={diagram.id} diagram={diagram} />
                )}
              </div>
          )}
        </main>
      </div>
  );
};