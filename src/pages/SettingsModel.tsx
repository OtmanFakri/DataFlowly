import React, { useState } from 'react';
import {
    X,
    User,
    Bell,
    Shield,
    CreditCard,
    Database,
    Save,
    Eye,
    EyeOff,
    CheckCircle
} from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // const [notificationSettings, setNotificationSettings] = useState({
    //     emailNotifications: true,
    //     pointsAlerts: true,
    //     diagramUpdates: false,
    //     marketingEmails: false
    // });

    // const [privacySettings, setPrivacySettings] = useState({
    //     profileVisibility: 'private',
    //     dataSharing: false,
    //     analyticsOptOut: true
    // });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleProfileChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    // const handleNotificationChange = (setting: string, value: boolean) => {
    //     setNotificationSettings(prev => ({ ...prev, [setting]: value }));
    // };
    //
    // const handlePrivacyChange = (setting: string, value: string | boolean) => {
    //     setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    // };

    if (!isOpen) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        // { id: 'notifications', label: 'Notifications', icon: Bell },
        // { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                            <Database className="text-white" size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex h-[calc(90vh-120px)]">
                    {/* Sidebar */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.firstName}
                                                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.lastName}
                                                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={profileData.currentPassword}
                                                        onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={profileData.newPassword}
                                                        onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={profileData.confirmPassword}
                                                        onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*{activeTab === 'notifications' && (*/}
                            {/*    <div className="space-y-6">*/}
                            {/*        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>*/}
                            {/*        <div className="space-y-4">*/}
                            {/*            {[*/}
                            {/*                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email' },*/}
                            {/*                { key: 'pointsAlerts', label: 'Points Alerts', description: 'Get notified when your points are running low' },*/}
                            {/*                { key: 'diagramUpdates', label: 'Diagram Updates', description: 'Notifications about diagram generation status' },*/}
                            {/*                { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive product updates and promotional content' }*/}
                            {/*            ].map((setting) => (*/}
                            {/*                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">*/}
                            {/*                    <div>*/}
                            {/*                        <h4 className="font-medium text-gray-900">{setting.label}</h4>*/}
                            {/*                        <p className="text-sm text-gray-600">{setting.description}</p>*/}
                            {/*                    </div>*/}
                            {/*                    <label className="relative inline-flex items-center cursor-pointer">*/}
                            {/*                        <input*/}
                            {/*                            type="checkbox"*/}
                            {/*                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}*/}
                            {/*                            onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}*/}
                            {/*                            className="sr-only peer"*/}
                            {/*                        />*/}
                            {/*                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>*/}
                            {/*                    </label>*/}
                            {/*                </div>*/}
                            {/*            ))}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            {/*{activeTab === 'privacy' && (*/}
                            {/*    <div className="space-y-6">*/}
                            {/*        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>*/}
                            {/*        <div className="space-y-6">*/}
                            {/*            <div className="p-4 bg-gray-50 rounded-lg">*/}
                            {/*                <h4 className="font-medium text-gray-900 mb-2">Profile Visibility</h4>*/}
                            {/*                <p className="text-sm text-gray-600 mb-3">Control who can see your profile information</p>*/}
                            {/*                <select*/}
                            {/*                    value={privacySettings.profileVisibility}*/}
                            {/*                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}*/}
                            {/*                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                            {/*                >*/}
                            {/*                    <option value="public">Public</option>*/}
                            {/*                    <option value="private">Private</option>*/}
                            {/*                    <option value="team">Team Only</option>*/}
                            {/*                </select>*/}
                            {/*            </div>*/}

                            {/*            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">*/}
                            {/*                <div>*/}
                            {/*                    <h4 className="font-medium text-gray-900">Data Sharing</h4>*/}
                            {/*                    <p className="text-sm text-gray-600">Allow DataFlowly to use anonymized data for service improvement</p>*/}
                            {/*                </div>*/}
                            {/*                <label className="relative inline-flex items-center cursor-pointer">*/}
                            {/*                    <input*/}
                            {/*                        type="checkbox"*/}
                            {/*                        checked={privacySettings.dataSharing}*/}
                            {/*                        onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}*/}
                            {/*                        className="sr-only peer"*/}
                            {/*                    />*/}
                            {/*                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>*/}
                            {/*                </label>*/}
                            {/*            </div>*/}

                            {/*            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">*/}
                            {/*                <div>*/}
                            {/*                    <h4 className="font-medium text-gray-900">Analytics Opt-out</h4>*/}
                            {/*                    <p className="text-sm text-gray-600">Opt out of usage analytics and tracking</p>*/}
                            {/*                </div>*/}
                            {/*                <label className="relative inline-flex items-center cursor-pointer">*/}
                            {/*                    <input*/}
                            {/*                        type="checkbox"*/}
                            {/*                        checked={privacySettings.analyticsOptOut}*/}
                            {/*                        onChange={(e) => handlePrivacyChange('analyticsOptOut', e.target.checked)}*/}
                            {/*                        className="sr-only peer"*/}
                            {/*                    />*/}
                            {/*                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>*/}
                            {/*                </label>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            {activeTab === 'billing' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Points</h3>

                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Current Points Balance</h4>
                                            <div className="text-2xl font-bold text-blue-600">2,450</div>
                                        </div>
                                        <p className="text-gray-600 mb-4">You have enough points for approximately 245 diagram generations.</p>
                                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                                            Buy More Points
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-4">Recent Transactions</h4>
                                        <div className="space-y-3">
                                            {[
                                                { date: '2025-01-10', description: 'Points Package - 5,000 points', amount: '$49.99', status: 'Completed' },
                                                { date: '2024-12-15', description: 'Points Package - 1,000 points', amount: '$12.99', status: 'Completed' },
                                                { date: '2024-11-28', description: 'Points Package - 2,500 points', amount: '$24.99', status: 'Completed' }
                                            ].map((transaction, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{transaction.description}</p>
                                                        <p className="text-sm text-gray-600">{transaction.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">{transaction.amount}</p>
                                                        <p className="text-sm text-green-600">{transaction.status}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        {saveSuccess && (
                            <>
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm text-green-600 font-medium">Settings saved successfully!</span>
                            </>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;