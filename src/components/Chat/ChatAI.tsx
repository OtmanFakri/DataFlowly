import React, {useState, useRef, useEffect} from 'react';
import {X, Send, Bot, User, Loader2, FileJson} from 'lucide-react';
import {useGeminiAI} from '../../hooks/useGeminiAI';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isJson?: boolean;
}

interface ChatAIProps {
    onClose: () => void;
    schema: any;
    onJsonResponse: (jsonResponse: any) => void;
}

export const ChatAI: React.FC<ChatAIProps> = ({onClose, schema,onJsonResponse}) => {
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
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const {sendMessage, loading: aiLoading, error: aiError} = useGeminiAI();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Focus input when component mounts
        inputRef.current?.focus();
    }, []);

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

        try {
            const aiResponseJson = await sendMessage(
                inputMessage.trim(),
                schema
            );

            let aiContent = '';
            let isJson = false;

            if (typeof aiResponseJson === 'string') {
                aiContent = aiResponseJson;
            } else {
                // It's JSON, so set flag and content accordingly
                isJson = true;
                aiContent = ''; // empty because we want to show only icon
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: aiContent,
                timestamp: new Date(),
                isJson
            };
            onJsonResponse(aiResponseJson);
            setMessages(prev => [...prev, aiResponse]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: 'Sorry, there was an error contacting Gemini AI.',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    return (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-2">
                    <div
                        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot size={16} className="text-white"/>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                >
                    <X size={16}/>
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
                                    <User size={12} className="text-white"/>
                                ) : (
                                    <Bot size={12} className="text-white"/>
                                )}
                            </div>
                            <div className={`rounded-lg px-3 py-2 ${
                                message.type === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.isJson && message.type === 'ai' ? (
                                        // Show only icon for JSON AI responses
                                        <FileJson size={32} className="text-purple-600" />
                                    ) : (
                                        message.content
                                    )}
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
                            <div
                                className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                <Bot size={12} className="text-white"/>
                            </div>
                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                <div className="flex items-center space-x-2">
                                    <Loader2 size={14} className="animate-spin text-gray-500"/>
                                    <span className="text-sm text-gray-600">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}/>
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
                            <Send size={12}/>
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};