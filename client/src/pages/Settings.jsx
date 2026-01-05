import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { User, Settings as SettingsIcon, Save, Camera, UploadCloud } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        bio: '',
        avatar_url: '' // Keep as fallback/display
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setFormData({
                username: res.data.username || '',
                full_name: res.data.full_name || '',
                bio: res.data.bio || '',
                avatar_url: res.data.avatar_url || ''
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const data = new FormData();
        data.append('full_name', formData.full_name);
        data.append('bio', formData.bio);
        // data.append('avatar_url', formData.avatar_url); // Optional: keep supporting URL if no file

        if (selectedFile) {
            data.append('avatar', selectedFile);
        } else {
            // If no file, we might want to send the text URL if it was manually edited (hybrid approach), 
            // but for now let's prioritize the file upload as requested.
            data.append('avatar_url', formData.avatar_url);
        }

        try {
            // Need to send multipart/form-data
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            await api.put('/users/profile', data, config);

            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);

            // Refresh data to show new avatar URL from server
            fetchProfile();
            setSelectedFile(null); // Clear selected file after upload
        } catch (err) {
            setMessage('Error updating profile.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;

    return (
        <Layout>
            <PageTransition>
                <div className="p-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-white mb-2 text-neon-blue">Settings</h1>
                        <p className="text-slate-400">Manage your account and preferences.</p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar / Tabs */}
                        <div className="w-full lg:w-64">
                            <GlassCard className="p-2 space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${activeTab === 'profile' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]' : 'text-slate-400 hover:bg-white/5'}`}
                                >
                                    <User size={18} /> Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('account')}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${activeTab === 'account' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]' : 'text-slate-400 hover:bg-white/5'}`}
                                >
                                    <SettingsIcon size={18} /> Account
                                </button>
                            </GlassCard>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <GlassCard>
                                {activeTab === 'profile' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h2 className="text-xl font-bold text-white mb-6">Public Profile</h2>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="flex items-center gap-8 mb-8">
                                                <div className="relative group">
                                                    <div className="w-32 h-32 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                                        {previewUrl ? (
                                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : formData.avatar_url ? (
                                                            <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl font-bold uppercase">
                                                                {formData.username?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current.click()}
                                                        className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition hover:scale-110"
                                                    >
                                                        <Camera size={20} />
                                                    </button>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileSelect}
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-white mb-1">Profile Picture</h3>
                                                    <p className="text-sm text-slate-400 mb-4">Upload a high-quality image of yourself. <br /> Preferred size: 400x400px.</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current.click()}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 transition flex items-center gap-2"
                                                    >
                                                        <UploadCloud size={16} /> Choose Image
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                                                    <input
                                                        type="text"
                                                        value={formData.username}
                                                        disabled
                                                        className="w-full bg-slate-900/50 border border-white/5 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        value={formData.full_name}
                                                        onChange={handleChange}
                                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                                                <textarea
                                                    name="bio"
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    rows="4"
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                                    placeholder="Tell the community about your goals..."
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                {message && (
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className={`text-sm font-medium ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}
                                                    >
                                                        {message}
                                                    </motion.span>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium transition flex items-center gap-2 ml-auto shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                                >
                                                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {activeTab === 'account' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                                            <p className="text-sm text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                            <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-500/50 rounded transition text-sm">
                                                Delete Account
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </Layout>
    );
}
