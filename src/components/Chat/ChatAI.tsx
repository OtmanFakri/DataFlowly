import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

interface ChatAIProps {
    onClose: () => void;
    schema: any;
}

export const ChatAI: React.FC<ChatAIProps> = ({ onClose, schema }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'ai',
            content: 'Hello! I\'m your database design assistant. I can help you with table structures, relationships, optimization suggestions, and answer questions about your database schema. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Focus input when component mounts
        inputRef.current?.focus();
    }, []);

    const simulateAIResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        // Database-specific responses
        if (lowerMessage.includes('table') && lowerMessage.includes('create')) {
            return 'To create a well-structured table, consider:\n\n• Always include a primary key (usually an auto-incrementing ID)\n• Use appropriate data types for each column\n• Set NOT NULL constraints where appropriate\n• Add indexes for frequently queried columns\n• Consider foreign key relationships with other tables\n\nWould you like me to suggest a specific table structure for your use case?';
        }

        if (lowerMessage.includes('relationship') || lowerMessage.includes('foreign key')) {
            return 'Great question about relationships! Here are the main types:\n\n• **One-to-One**: Each record in Table A relates to exactly one record in Table B\n• **One-to-Many**: One record in Table A can relate to multiple records in Table B\n• **Many-to-Many**: Multiple records in Table A can relate to multiple records in Table B (requires junction table)\n\nFor foreign keys, consider CASCADE options:\n• CASCADE: Automatically update/delete related records\n• SET NULL: Set foreign key to NULL when parent is deleted\n• RESTRICT: Prevent deletion if related records exist';
        }

        if (lowerMessage.includes('optimize') || lowerMessage.includes('performance')) {
            return 'Here are some database optimization tips:\n\n• **Indexing**: Add indexes on frequently queried columns\n• **Normalization**: Eliminate data redundancy\n• **Data Types**: Use appropriate sizes (don\'t use VARCHAR(255) for everything)\n• **Relationships**: Properly define foreign keys\n• **Constraints**: Use NOT NULL, UNIQUE where appropriate\n\nWould you like me to analyze your current schema for optimization opportunities?';
        }

        if (lowerMessage.includes('schema') || lowerMessage.includes('current')) {
            const tableCount = schema?.database?.tables?.length || 0;
            const relationshipCount = schema?.database?.relationships?.length || 0;

            return `I can see your current schema has:\n\n• **${tableCount} tables**\n• **${relationshipCount} relationships**\n• **Database Engine**: ${schema?.database?.engine || 'Not specified'}\n\nYour schema looks ${tableCount > 0 ? 'like it\'s taking shape' : 'ready for some tables'}! ${tableCount === 0 ? 'Start by adding your first table with the "Add Table" button.' : 'Would you like me to suggest improvements or help with specific aspects?'}`;
        }

        if (lowerMessage.includes('data type') || lowerMessage.includes('datatype')) {
            return 'Here\'s a guide to common data types:\n\n**Text:**\n• VARCHAR(n) - Variable length text up to n characters\n• TEXT - Large text content\n• CHAR(n) - Fixed length text\n\n**Numbers:**\n• INT - Standard integers\n• BIGINT - Large integers\n• DECIMAL(p,s) - Precise decimal numbers\n\n**Dates:**\n• DATE - Date only\n• DATETIME - Date and time\n• TIMESTAMP - Auto-updating timestamp\n\n**Others:**\n• BOOLEAN - True/false values\n• JSON - Structured data';
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! I\'m here to help you design better databases. I can assist with:\n\n• Table structure recommendations\n• Relationship design\n• Data type selection\n• Performance optimization\n• Best practices\n\nWhat would you like to work on?';
        }

        // Default responses
        const defaultResponses = [
            'That\'s an interesting question about database design! Could you provide more specific details about what you\'re trying to achieve?',
            'I\'d be happy to help with that! Database design can be complex, but I\'m here to guide you through it.',
            'Great question! For database-related queries, I can help with table structures, relationships, optimization, and best practices. What specific aspect would you like to explore?',
            'I understand you\'re working on your database schema. Could you tell me more about the specific challenge you\'re facing?'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: simulateAIResponse(userMessage.content),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1000 + Math.random() * 2000); // 1-3 second delay
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-start space-x-2 max-w-[85%] ${
                            message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.type === 'user'
                                    ? 'bg-blue-500'
                                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
                            }`}>
                                {message.type === 'user' ? (
                                    <User size={12} className="text-white" />
                                ) : (
                                    <Bot size={12} className="text-white" />
                                )}
                            </div>
                            <div className={`rounded-lg px-3 py-2 ${
                                message.type === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.content}
                                </div>
                                <div className={`text-xs mt-1 ${
                                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-2 max-w-[85%]">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                <Bot size={12} className="text-white" />
                            </div>
                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                <div className="flex items-center space-x-2">
                                    <Loader2 size={14} className="animate-spin text-gray-500" />
                                    <span className="text-sm text-gray-600">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2">
          <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about database design, relationships, optimization..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows={2}
              disabled={isLoading}
          />
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Enter to send • Shift+Enter for new line
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                        >
                            <Send size={12} />
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};