import React, {useState} from 'react';
import {
    Send,
    CheckCircle,
    Mail,
    User,
    MessageSquare
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import emailjs from '@emailjs/browser';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                },
                EMAILJS_PUBLIC_KEY
            );
            setIsSubmitting(false);
            setSubmitStatus('success');
            setTimeout(() => {
                setFormData({name: '', email: '', subject: '', message: ''});
                setSubmitStatus('idle');
            }, 3000);
        } catch (error) {
            setIsSubmitting(false);
            setSubmitStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navigation onGetStarted={() => {
            }}/>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
                        <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-lg text-blue-100 leading-relaxed">
                            Have questions about DataFlowly? We're here to help you with your ER diagram needs.
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {submitStatus === 'success' ? (
                        <div className="text-center py-8">
                            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="text-green-600" size={32}/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                            <p className="text-gray-600 mb-4">
                                Thank you for contacting DataFlowly. We'll get back to you within 24 hours.
                            </p>
                            <div className="text-sm text-gray-500">
                                Reference ID: #DF{Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Send us a Message</h2>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name"
                                           className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <User size={16}/>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email"
                                           className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Mail size={16}/>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject"
                                           className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <MessageSquare size={16}/>
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Please describe your inquiry or issue in detail..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div
                                                className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"/>
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18}/>
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                    {submitStatus === 'error' && (
                        <div className="text-center py-4 text-red-600 font-semibold">
                            Failed to send message. Please try again later.
                        </div>
                    )}
                </div>

                {/* Simple Contact Info */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-2">You can also reach us directly at:</p>
                    <a href="mailto:support@dataflowly.com" className="text-blue-600 hover:text-blue-700 font-medium">
                        support@dataflowly.com
                    </a>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default Contact;