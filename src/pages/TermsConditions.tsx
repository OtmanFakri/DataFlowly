import React, { useState } from 'react';
import {
    FileText,
    Shield,
    CreditCard,
    Database,
    Users,
    AlertCircle,
    CheckCircle,
    ChevronRight,
    ArrowUp
} from 'lucide-react';

const TableOfContents = ({ activeSection, onSectionClick }: { activeSection: string; onSectionClick: (section: string) => void }) => {
    const sections = [
        { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
        { id: 'service', title: 'Service Description', icon: Database },
        { id: 'points', title: 'Points System', icon: CreditCard },
        { id: 'account', title: 'Account Management', icon: Users },
        { id: 'usage', title: 'Acceptable Use', icon: Shield },
        { id: 'intellectual', title: 'Intellectual Property', icon: FileText },
        { id: 'privacy', title: 'Privacy & Data', icon: Shield },
        { id: 'liability', title: 'Limitation of Liability', icon: AlertCircle },
        { id: 'termination', title: 'Termination', icon: AlertCircle },
        { id: 'general', title: 'General Provisions', icon: FileText }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
            <nav className="space-y-2">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => onSectionClick(section.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                                activeSection === section.id
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon size={16} />
                            <span className="text-sm font-medium">{section.title}</span>
                            <ChevronRight size={14} className="ml-auto" />
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <section id={id} className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
                <Icon className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="prose prose-gray max-w-none">
            {children}
        </div>
    </section>
);

function TermsConditions() {
    const [activeSection, setActiveSection] = useState('acceptance');
    const [showScrollTop, setShowScrollTop] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);

            // Update active section based on scroll position
            const sections = ['acceptance', 'service', 'points', 'account', 'usage', 'intellectual', 'privacy', 'liability', 'termination', 'general'];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 150 && rect.bottom >= 150;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSectionClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Database className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">DataFlowly</h1>
                                <p className="text-sm text-gray-600">Terms and Conditions</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Last Updated: January 15, 2025
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <TableOfContents activeSection={activeSection} onSectionClick={handleSectionClick} />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="mb-12">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
                                <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
                                <p className="text-blue-100 leading-relaxed">
                                    Welcome to DataFlowly! These Terms and Conditions govern your use of our AI-powered
                                    Entity-Relationship diagram generation service. Please read them carefully before using our platform.
                                </p>
                            </div>
                        </div>

                        <Section id="acceptance" title="Acceptance of Terms" icon={CheckCircle}>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By accessing or using DataFlowly's services, you agree to be bound by these Terms and Conditions
                                and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <p className="text-blue-800 font-medium">Important Notice</p>
                                <p className="text-blue-700 mt-1">
                                    These terms constitute a legally binding agreement between you and DataFlowly.
                                    By using our service, you confirm that you have read, understood, and agree to these terms.
                                </p>
                            </div>
                        </Section>

                        <Section id="service" title="Service Description" icon={Database}>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                DataFlowly is an AI-powered service that generates Entity-Relationship (ER) diagrams based on
                                your input descriptions and requirements. Our service includes:
                            </p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">AI-powered ER diagram generation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Database schema design assistance</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Export capabilities for generated diagrams</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Collaborative features for team projects</span>
                                </li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify, suspend, or discontinue any part of our service at any time
                                with reasonable notice to users.
                            </p>
                        </Section>

                        <Section id="points" title="Points System" icon={CreditCard}>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                DataFlowly operates on a points-based system rather than traditional recurring subscriptions.
                                Here's how our points system works:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <h4 className="font-semibold text-green-800 mb-3">Points Purchase</h4>
                                    <ul className="space-y-2 text-green-700">
                                        <li>• Points are purchased in packages</li>
                                        <li>• One-time payments, no recurring charges</li>
                                        <li>• Various package sizes available</li>
                                        <li>• Points never expire</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-3">Points Usage</h4>
                                    <ul className="space-y-2 text-blue-700">
                                        <li>• Points consumed per diagram generation</li>
                                        <li>• Cost varies by diagram complexity</li>
                                        <li>• Real-time points balance tracking</li>
                                        <li>• Low balance notifications</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <h4 className="font-medium text-yellow-800 mb-2">Refund Policy</h4>
                                <p className="text-yellow-700 text-sm">
                                    Unused points may be refunded within 30 days of purchase, subject to our refund policy.
                                    Points used for diagram generation are non-refundable.
                                </p>
                            </div>
                        </Section>

                        <Section id="account" title="Account Management" icon={Users}>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                To use DataFlowly, you must create and maintain an account. Account responsibilities include:
                            </p>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-1 rounded-full">
                                        <CheckCircle size={14} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Accurate Information:</span>
                                        <p className="text-gray-700 text-sm mt-1">Provide true, accurate, and complete information</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-1 rounded-full">
                                        <CheckCircle size={14} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Security:</span>
                                        <p className="text-gray-700 text-sm mt-1">Maintain the confidentiality of your account credentials</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-1 rounded-full">
                                        <CheckCircle size={14} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Responsibility:</span>
                                        <p className="text-gray-700 text-sm mt-1">You are responsible for all activities under your account</p>
                                    </div>
                                </li>
                            </ul>
                        </Section>

                        <Section id="usage" title="Acceptable Use" icon={Shield}>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                You agree to use DataFlowly only for lawful purposes and in accordance with these Terms.
                                Prohibited activities include:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <h4 className="font-medium text-red-800 mb-2">Prohibited Uses</h4>
                                    <ul className="space-y-1 text-red-700 text-sm">
                                        <li>• Illegal or unauthorized activities</li>
                                        <li>• Violating intellectual property rights</li>
                                        <li>• Transmitting malicious code</li>
                                        <li>• Interfering with service operation</li>
                                        <li>• Reverse engineering our AI models</li>
                                    </ul>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                    <h4 className="font-medium text-amber-800 mb-2">Content Guidelines</h4>
                                    <ul className="space-y-1 text-amber-700 text-sm">
                                        <li>• No offensive or inappropriate content</li>
                                        <li>• Respect privacy and confidentiality</li>
                                        <li>• No spam or excessive requests</li>
                                        <li>• Follow data protection regulations</li>
                                    </ul>
                                </div>
                            </div>
                        </Section>

                        <Section id="intellectual" title="Intellectual Property" icon={FileText}>
                            <div className="space-y-6">
                                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                    <h4 className="font-semibold text-purple-800 mb-3">Your Content</h4>
                                    <p className="text-purple-700 text-sm">
                                        You retain ownership of all input data and descriptions you provide to DataFlowly.
                                        We require a limited license to process your content and generate diagrams.
                                    </p>
                                </div>

                                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                                    <h4 className="font-semibold text-indigo-800 mb-3">Generated Diagrams</h4>
                                    <p className="text-indigo-700 text-sm">
                                        You own the ER diagrams generated by our AI based on your input. DataFlowly retains
                                        no rights to your generated content, though we may use anonymized data for service improvement.
                                    </p>
                                </div>

                                <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                                    <h4 className="font-semibold text-teal-800 mb-3">Our Technology</h4>
                                    <p className="text-teal-700 text-sm">
                                        DataFlowly's AI technology, algorithms, and platform remain our exclusive property.
                                        Users are granted a limited license to use our service subject to these terms.
                                    </p>
                                </div>
                            </div>
                        </Section>

                        <Section id="privacy" title="Privacy & Data Protection" icon={Shield}>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Your privacy is important to us. Our data handling practices include:
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                                    <Shield size={20} className="text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-green-800">Data Security</h4>
                                        <p className="text-green-700 text-sm mt-1">
                                            We implement industry-standard security measures to protect your data and generated content.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                    <Database size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-blue-800">Data Processing</h4>
                                        <p className="text-blue-700 text-sm mt-1">
                                            Your input data is processed solely for diagram generation and service improvement.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                                    <Users size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-purple-800">Data Retention</h4>
                                        <p className="text-purple-700 text-sm mt-1">
                                            We retain your data only as long as necessary to provide our services and as required by law.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section id="liability" title="Limitation of Liability" icon={AlertCircle}>
                            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle size={20} className="text-amber-600" />
                                    <h4 className="font-semibold text-amber-800">Important Legal Notice</h4>
                                </div>
                                <p className="text-amber-700 text-sm">
                                    DataFlowly is provided "as is" without warranties of any kind. We make no guarantees
                                    about the accuracy, completeness, or suitability of generated diagrams for any particular purpose.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>Service Availability:</strong> While we strive for high availability, we cannot guarantee
                                    uninterrupted service. We are not liable for temporary service disruptions or maintenance periods.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    <strong>AI Accuracy:</strong> Our AI-generated diagrams are based on automated analysis of your input.
                                    Users should review and validate all generated content before use in production environments.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    <strong>Limitation of Damages:</strong> In no event shall DataFlowly be liable for any indirect,
                                    incidental, special, or consequential damages arising from your use of our service.
                                </p>
                            </div>
                        </Section>

                        <Section id="termination" title="Termination" icon={AlertCircle}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                    <h4 className="font-semibold text-red-800 mb-3">Account Termination</h4>
                                    <p className="text-red-700 text-sm mb-3">
                                        We reserve the right to terminate accounts for violations of these terms, including:
                                    </p>
                                    <ul className="space-y-1 text-red-700 text-sm">
                                        <li>• Breach of acceptable use policies</li>
                                        <li>• Fraudulent activity</li>
                                        <li>• Abuse of our service</li>
                                        <li>• Non-payment of fees</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-3">Voluntary Termination</h4>
                                    <p className="text-blue-700 text-sm mb-3">
                                        You may terminate your account at any time by:
                                    </p>
                                    <ul className="space-y-1 text-blue-700 text-sm">
                                        <li>• Contacting our support team</li>
                                        <li>• Using account settings</li>
                                        <li>• Requesting data deletion</li>
                                        <li>• Unused points may be refunded</li>
                                    </ul>
                                </div>
                            </div>
                        </Section>

                        <Section id="general" title="General Provisions" icon={FileText}>
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                                    <p className="text-gray-700 text-sm mb-2">
                                        For questions about these Terms and Conditions, please contact us:
                                    </p>
                                    <div className="space-y-1 text-gray-600 text-sm">
                                        <p>Email: legal@dataflowly.com</p>
                                        <p>Support: support@dataflowly.com</p>
                                        <p>Address: [Your Business Address]</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-indigo-800 mb-2">Governing Law</h4>
                                        <p className="text-indigo-700 text-sm">
                                            These terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles.
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-purple-800 mb-2">Changes to Terms</h4>
                                        <p className="text-purple-700 text-sm">
                                            We may update these terms periodically. Users will be notified of material changes via email or platform notifications.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                >
                    <ArrowUp size={20} />
                </button>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Database className="text-white" size={20} />
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
}

export default TermsConditions;