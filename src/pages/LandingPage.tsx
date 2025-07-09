import React, {useState, useEffect} from 'react';
import {
    Database,
    ArrowRight,
    Star,
    MessageCircle,
    Code,
    Download,
    Play,
    Menu,
    X,
    Sparkles,
    Bot,
    GitBranch,
    Eye, FileText
} from 'lucide-react';
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const navigate = useNavigate();
    const onGetStarted = () => {
        // For now, just log or redirect to a signup page
        console.log("Get Started clicked");
        navigate('/dashboard');

        // You can replace this with your actual navigation logic
    };
    const features = [
        {
            icon: <Database className="w-8 h-8"/>,
            title: "Visual Database Design",
            description: "Create beautiful database schemas with drag-and-drop tables, columns, and relationships."
        },
        {
            icon: <Bot className="w-8 h-8"/>,
            title: "AI-Powered Assistant",
            description: "Get intelligent suggestions for table structures, relationships, and optimization tips."
        },
        {
            icon: <Code className="w-8 h-8"/>,
            title: "Multi-Database Support",
            description: "Generate SQL for MySQL, PostgreSQL, and SQL Server with engine-specific optimizations."
        },
        {
            icon: <GitBranch className="w-8 h-8"/>,
            title: "Version Control",
            description: "Track changes with built-in undo/redo and schema versioning capabilities."
        },
        {
            icon: <Download className="w-8 h-8"/>,
            title: "Export & Import",
            description: "Export to SQL DDL, JSON schema, or import existing database structures."
        },
        {
            icon: <Eye className="w-8 h-8"/>,
            title: "Real-time Preview",
            description: "See your database structure come to life with interactive visual relationships."
        },
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Senior Database Architect",
            company: "TechCorp",
            content: "This tool revolutionized how we design databases. The AI suggestions are incredibly accurate and save us hours of work.",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
        },
        {
            name: "Michael Rodriguez",
            role: "Full Stack Developer",
            company: "StartupXYZ",
            content: "The visual interface is intuitive and the SQL generation is flawless. It's become an essential part of our development workflow.",
            avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
        },
        {
            name: "Emily Johnson",
            role: "Data Engineer",
            company: "DataFlow Inc",
            content: "The AI assistant understands complex relationships and provides optimization suggestions that actually work. Impressive!",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Database className="w-6 h-6 text-white"/>
                            </div>
                            <span
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                DataFlowly
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features"
                               className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                            <a href="#pricing"
                               className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
                            <a href="#testimonials"
                               className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
                            <Link to="/terms"
                                  className="text-gray-700 hover:text-blue-600 transition-colors">Terms</Link>
                            <button
                                onClick={onGetStarted}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                Try Free
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col space-y-4">
                                <a href="#features"
                                   className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                                <a href="#pricing"
                                   className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
                                <a href="#testimonials"
                                   className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
                                <Link to="/terms"
                                      className="text-gray-700 hover:text-blue-600 transition-colors">Terms</Link>
                                <button
                                    onClick={onGetStarted}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium w-full"
                                >
                                    Try Free
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div
                            className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
                            <Sparkles size={16}/>
                            <span>AI-Powered Database Design</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Design Databases
                            <span
                                className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Like a Pro
    </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Create beautiful, optimized database schemas with our AI-powered visual designer.
                            From concept to production-ready SQL in minutes, not hours.
                        </p>

                        <div
                            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                            <button
                                onClick={onGetStarted}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
                            >
                                <Play size={20}/>
                                <span>Start Designing Free</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">50K+</div>
                                <div className="text-gray-600">Schemas Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                                <div className="text-gray-600">Uptime</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                                <div className="text-gray-600 flex items-center justify-center space-x-1">
                                    <span>Rating</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className="text-yellow-400 fill-current"/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div
                        className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div
                        className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                    <div
                        className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Design Better Databases
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Powerful features that make database design intuitive, collaborative, and AI-enhanced
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                            >
                                <div
                                    className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Buy AI Points
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Purchase AI points to unlock the power of our AI assistant. Use them whenever you need
                            intelligent database design help.
                        </p>
                        <div
                            className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <MessageCircle size={16}/>
                            <span>1 AI Point = 1 AI Assistant Query</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            ✨ Get 50 free AI points when you sign up!
                        </div>
                    </div>

                    {/* Dynamic Pricing Card */}
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                            {/* 200 Points Package */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 mb-2">200</div>
                                    <div className="text-gray-600 mb-4">AI Points</div>
                                    <div className="text-3xl font-bold text-gray-900 mb-4">$5.00</div>
                                    <button
                                        onClick={() => navigate('/buy-points')}
                                        className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            {/* 500 Points Package */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-500 relative">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 mb-2">500</div>
                                    <div className="text-gray-600 mb-4">AI Points</div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">$10.00</div>
                                    <div className="text-green-600 text-sm font-medium mb-4">25% more points</div>
                                    <button
                                        onClick={() => navigate('/buy-points')}
                                        className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            {/* 1000 Points Package */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 mb-2">1000</div>
                                    <div className="text-gray-600 mb-4">AI Points</div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">$18.00</div>
                                    <div className="text-green-600 text-sm font-medium mb-4">40% more points</div>
                                    <button
                                        onClick={() => navigate('/buy-points')}
                                        className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Loved by Developers Worldwide
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            See what our users are saying about DataFlowly
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center space-x-4 mb-6">
                                <img
                                    src={testimonials[activeTestimonial].avatar}
                                    alt={testimonials[activeTestimonial].name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">
                                        {testimonials[activeTestimonial].name}
                                    </h4>
                                    <p className="text-gray-600">
                                        {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                                    </p>
                                </div>
                            </div>
                            <blockquote className="text-lg text-gray-700 leading-relaxed mb-6">
                                "{testimonials[activeTestimonial].content}"
                            </blockquote>
                            <div className="flex justify-center space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestimonial(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            index === activeTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Database Design?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Start designing amazing databases today with 50 free AI points!
                    </p>
                    <div
                        className="flex flex-col items-center justify-center space-y-4">
                        <button
                            onClick={() => navigate('/buy-points')}
                            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
                        >
                            <span>Get 50 Free Points</span>
                            <ArrowRight size={20}/>
                        </button>
                        <div className="text-blue-100 text-sm">
                            No credit card required • Start designing immediately
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Database className="text-white" size={20}/>
                            </div>
                            <span className="font-semibold">DataFlowly</span>
                        </div>
                        <div className="text-sm text-gray-400">
                            © 2025 DataFlowly. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};