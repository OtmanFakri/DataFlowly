import React, { useState } from 'react';
import {
    Database,
    Settings,
    Bot,
    LogOut,
    ChevronDown,
    User,
    Shield,
    Eye,
    Lock,
    Server,
    Globe,
    FileText,
    Mail,
    Clock,
    ArrowUp,
    DollarSign
} from 'lucide-react';
import SettingsModal from "./SettingsModel.tsx";
import Navigation from "../components/Navigation.tsx";
import Footer from "../components/Footer.tsx";

function Policy() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Mock user data
    const userInitials = 'JD';

    const handleLogout = async () => {
        setLoading(true);
        // Simulate logout process
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        setShowUserMenu(false);
        // Handle actual logout logic here
    };

    const handleSettingsClick = () => {
        setShowUserMenu(false);
        setShowSettingsModal(true);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle scroll for show/hide scroll-to-top button
    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const privacySections = [
        { id: 'information-collection', title: 'Information We Collect', icon: Database },
        { id: 'how-we-use', title: 'How We Use Information', icon: Settings },
        { id: 'data-sharing', title: 'Information Sharing', icon: Globe },
        { id: 'data-security', title: 'Data Security', icon: Shield },
        { id: 'ai-processing', title: 'AI Data Processing', icon: Bot },
        { id: 'cookies', title: 'Cookies & Tracking', icon: Eye },
        { id: 'user-rights', title: 'Your Rights', icon: User },
        { id: 'data-retention', title: 'Data Retention', icon: Clock },
        { id: 'international', title: 'International Transfers', icon: Server },
        { id: 'updates', title: 'Policy Updates', icon: FileText },
        { id: 'refund-policy', title: 'Refund Policy', icon: DollarSign }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="text-blue-600" size={20} />
                                Privacy Policy
                            </h3>
                            <nav className="space-y-2">
                                {privacySections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Icon size={16} />
                                            <span>{section.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-white/20 p-3 rounded-lg">
                                        <Shield size={32} />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                                        <p className="text-blue-100 mt-2">Last updated: January 15, 2025</p>
                                    </div>
                                </div>
                                <p className="text-lg text-blue-100 leading-relaxed">
                                    At DataFlowly, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered ER diagram generation service.
                                </p>
                            </div>

                            {/* Content Sections */}
                            <div className="p-8 space-y-12">
                                {/* Information We Collect */}
                                <section id="information-collection" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Database className="text-blue-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• Name and email address when you create an account</li>
                                                <li>• Profile information you choose to provide</li>
                                                <li>• Account preferences and settings</li>
                                                <li>• Points balance and transaction history</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Data</h3>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• ER diagram inputs and generated outputs</li>
                                                <li>• Service usage patterns and feature interactions</li>
                                                <li>• Device information and browser type</li>
                                                <li>• IP address and general location data</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• Billing address and payment method details</li>
                                                <li>• Transaction records for points purchases</li>
                                                <li>• Payment processor information (processed securely by third parties)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* How We Use Information */}
                                <section id="how-we-use" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Settings className="text-green-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                            <h3 className="text-lg font-semibold text-green-800 mb-3">Service Provision</h3>
                                            <ul className="space-y-2 text-green-700">
                                                <li>• Generate ER diagrams using AI technology</li>
                                                <li>• Manage your points balance and usage</li>
                                                <li>• Provide customer support and assistance</li>
                                                <li>• Process payments and billing</li>
                                            </ul>
                                        </div>
                                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                            <h3 className="text-lg font-semibold text-blue-800 mb-3">Service Improvement</h3>
                                            <ul className="space-y-2 text-blue-700">
                                                <li>• Improve AI model accuracy and performance</li>
                                                <li>• Analyze usage patterns to enhance features</li>
                                                <li>• Develop new functionalities and services</li>
                                                <li>• Ensure platform security and reliability</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Information Sharing */}
                                <section id="data-sharing" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Globe className="text-purple-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Information Sharing and Disclosure</h2>
                                    </div>
                                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                        <p className="text-gray-700 mb-4">
                                            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:
                                        </p>
                                        <ul className="space-y-3 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span><strong>Service Providers:</strong> With trusted third-party vendors who help us operate our service (payment processors, cloud hosting, analytics)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to users)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 font-bold">•</span>
                                                <span><strong>Consent:</strong> With your explicit consent for specific purposes</span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Data Security */}
                                <section id="data-security" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-red-100 p-2 rounded-lg">
                                            <Shield className="text-red-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                                    <Lock size={16} />
                                                    Encryption
                                                </h3>
                                                <p className="text-red-700 text-sm">All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.</p>
                                            </div>
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                                    <Server size={16} />
                                                    Infrastructure
                                                </h3>
                                                <p className="text-red-700 text-sm">We use enterprise-grade cloud infrastructure with regular security audits and monitoring.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                                    <Eye size={16} />
                                                    Access Control
                                                </h3>
                                                <p className="text-red-700 text-sm">Strict access controls ensure only authorized personnel can access your data.</p>
                                            </div>
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                                    <Shield size={16} />
                                                    Compliance
                                                </h3>
                                                <p className="text-red-700 text-sm">We comply with industry standards including SOC 2, GDPR, and CCPA requirements.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* AI Data Processing */}
                                <section id="ai-processing" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <Bot className="text-indigo-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">AI Data Processing</h2>
                                    </div>
                                    <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                                        <h3 className="text-lg font-semibold text-indigo-800 mb-4">How Our AI Uses Your Data</h3>
                                        <div className="space-y-4 text-indigo-700">
                                            <p>
                                                <strong>Input Processing:</strong> Your ER diagram descriptions and requirements are processed by our AI models to generate accurate diagrams. This data is used solely for generating your specific output.
                                            </p>
                                            <p>
                                                <strong>Model Training:</strong> We may use anonymized and aggregated data patterns to improve our AI models, but never your specific personal information or proprietary business data.
                                            </p>
                                            <p>
                                                <strong>Data Isolation:</strong> Each user's data is processed independently, and we implement strict measures to prevent data leakage between users.
                                            </p>
                                            <p>
                                                <strong>Retention:</strong> AI processing data is retained only as long as necessary to provide the service and improve our models, with automatic deletion policies in place.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Cookies & Tracking */}
                                <section id="cookies" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-yellow-100 p-2 rounded-lg">
                                            <Eye className="text-yellow-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking Technologies</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Types of Cookies We Use</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium text-yellow-800 mb-2">Essential Cookies</h4>
                                                    <p className="text-yellow-700 text-sm">Required for basic site functionality, authentication, and security.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-yellow-800 mb-2">Analytics Cookies</h4>
                                                    <p className="text-yellow-700 text-sm">Help us understand how users interact with our service to improve performance.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-yellow-800 mb-2">Preference Cookies</h4>
                                                    <p className="text-yellow-700 text-sm">Remember your settings and preferences for a better user experience.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-yellow-800 mb-2">Marketing Cookies</h4>
                                                    <p className="text-yellow-700 text-sm">Used to deliver relevant advertisements and measure campaign effectiveness.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">
                                            You can control cookie preferences through your browser settings or our cookie consent banner. Note that disabling certain cookies may affect site functionality.
                                        </p>
                                    </div>
                                </section>

                                {/* User Rights */}
                                <section id="user-rights" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-teal-100 p-2 rounded-lg">
                                            <User className="text-teal-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                                                <h3 className="font-semibold text-teal-800 mb-2">Access & Portability</h3>
                                                <p className="text-teal-700 text-sm">Request a copy of your personal data in a portable format.</p>
                                            </div>
                                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                                                <h3 className="font-semibold text-teal-800 mb-2">Correction</h3>
                                                <p className="text-teal-700 text-sm">Update or correct inaccurate personal information.</p>
                                            </div>
                                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                                                <h3 className="font-semibold text-teal-800 mb-2">Deletion</h3>
                                                <p className="text-teal-700 text-sm">Request deletion of your personal data (subject to legal requirements).</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                                                <h3 className="font-semibold text-teal-800 mb-2">Restriction</h3>
                                                <p className="text-teal-700 text-sm">Limit how we process your personal information.</p>
                                            </div>
                                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                                                <h3 className="font-semibold text-teal-800 mb-2">Objection</h3>
                                                <p className="text-teal-700 text-sm">Object to processing based on legitimate interests.</p>
                                            </div>
                                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                                                <h3 className="font-semibold text-teal-800 mb-2">Withdraw Consent</h3>
                                                <p className="text-teal-700 text-sm">Withdraw consent for data processing at any time.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                                        <p className="text-gray-700 text-sm">
                                            To exercise these rights, contact us at <a href="mailto:otmanhero00@gmail.com" className="text-blue-600 hover:underline">otmanhero00@gmail.com</a>. We will respond within 30 days of receiving your request.
                                        </p>
                                    </div>
                                </section>

                                {/* Data Retention */}
                                <section id="data-retention" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <Clock className="text-orange-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
                                    </div>
                                    <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                                        <div className="space-y-4 text-orange-700">
                                            <p>
                                                <strong>Account Data:</strong> Retained for the duration of your account plus 90 days after account closure for legal and business purposes.
                                            </p>
                                            <p>
                                                <strong>ER Diagram Data:</strong> Your generated diagrams and inputs are retained for 2 years to enable service functionality and support.
                                            </p>
                                            <p>
                                                <strong>Transaction Records:</strong> Billing and payment information is retained for 7 years as required by financial regulations.
                                            </p>
                                            <p>
                                                <strong>Analytics Data:</strong> Anonymized usage analytics are retained for 3 years for service improvement purposes.
                                            </p>
                                            <p>
                                                <strong>Legal Hold:</strong> Data may be retained longer if required by legal proceedings or regulatory requirements.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* International Transfers */}
                                <section id="international" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-cyan-100 p-2 rounded-lg">
                                            <Server className="text-cyan-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">International Data Transfers</h2>
                                    </div>
                                    <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                                        <p className="text-cyan-700 mb-4">
                                            DataFlowly operates globally and may transfer your personal data to countries outside your residence. We ensure adequate protection through:
                                        </p>
                                        <ul className="space-y-2 text-cyan-700">
                                            <li>• <strong>Adequacy Decisions:</strong> Transfers to countries with adequate data protection laws</li>
                                            <li>• <strong>Standard Contractual Clauses:</strong> EU-approved contracts ensuring data protection standards</li>
                                            <li>• <strong>Certification Programs:</strong> Participation in recognized privacy frameworks</li>
                                            <li>• <strong>Binding Corporate Rules:</strong> Internal policies ensuring consistent global protection</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Policy Updates */}
                                <section id="updates" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-pink-100 p-2 rounded-lg">
                                            <FileText className="text-pink-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Changes to This Privacy Policy</h2>
                                    </div>
                                    <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                                        <p className="text-pink-700 mb-4">
                                            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                                        </p>
                                        <div className="space-y-3 text-pink-700">
                                            <p>
                                                <strong>Notification:</strong> We will notify you of material changes via email or prominent notice on our website at least 30 days before the changes take effect.
                                            </p>
                                            <p>
                                                <strong>Review:</strong> We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                                            </p>
                                            <p>
                                                <strong>Continued Use:</strong> Your continued use of DataFlowly after changes become effective constitutes acceptance of the updated Privacy Policy.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Refund Policy */}
                                <section id="refund-policy" className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <DollarSign className="text-blue-600" size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Refund Policy</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Eligibility</h3>
                                            <p className="text-gray-700 mb-4">
                                                You may be eligible for a refund under the following circumstances:
                                            </p>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• <strong>Service Not Rendered:</strong> If our service fails to generate an ER diagram due to a technical issue on our end.</li>
                                                <li>• <strong>Duplicate Charges:</strong> If you were charged multiple times for the same transaction due to an error.</li>
                                                <li>• <strong>Unauthorized Charges:</strong> If a charge was made without your authorization (subject to verification).</li>
                                                <li>• <strong>Non-Delivery of Points:</strong> If purchased points were not credited to your account within 24 hours of payment.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Non-Refundable Cases</h3>
                                            <p className="text-gray-700 mb-4">
                                                Refunds will not be provided in the following cases:
                                            </p>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• <strong>User Dissatisfaction:</strong> If you are dissatisfied with the generated ER diagram but the service was provided as described.</li>
                                                <li>• <strong>Points Usage:</strong> If points purchased have been used to generate ER diagrams or access other services.</li>
                                                <li>• <strong>Change of Mind:</strong> If you no longer wish to use our services after a successful transaction.</li>
                                                <li>• <strong>Violation of Terms:</strong> If your account was terminated due to a violation of our Terms and Conditions.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Process</h3>
                                            <p className="text-gray-700 mb-4">
                                                To request a refund, please follow these steps:
                                            </p>
                                            <ul className="space-y-2 text-gray-700">
                                                <li>• <strong>Contact Us:</strong> Email us at <a href="mailto:oo99otman@gmail.com" className="text-blue-600 hover:underline">oo99otman@gmail.com</a> with your account details and transaction ID.</li>
                                                <li>• <strong>Provide Details:</strong> Include a brief explanation of why you are requesting a refund.</li>
                                                <li>• <strong>Review Period:</strong> We will review your request within 7 business days and respond with our decision.</li>
                                                <li>• <strong>Processing Time:</strong> Approved refunds will be processed within 14 business days to the original payment method.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us About Refunds</h3>
                                            <p className="text-gray-700 mb-4">
                                                If you have questions or need assistance with a refund, please reach out to us:
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Support Team</h4>
                                                    <p className="text-gray-700 text-sm">
                                                        Email: <a href="mailto:oo99otman@gmail.com" className="text-blue-600 hover:underline">oo99otman@gmail.com</a><br />
                                                        Response Time: Within 48 hours
                                                    </p>
                                                </div>
                                                {/* <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Mailing Address</h4>
                                                    <p className="text-gray-700 text-sm">
                                                        DataFlowly Support Team<br />
                                                        123 Tech Street, Suite 100<br />
                                                        San Francisco, CA 94105<br />
                                                        United States
                                                    </p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
                >
                    <ArrowUp size={20} />
                </button>
            )}

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
            />

            {/* Footer */}
            <Footer />

        </div>
    );
}

export default Policy;