
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings as SettingsIcon, Save, Camera, UploadCloud, Shield, Trash2, Sparkles } from 'lucide-react';
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
        avatar_url: ''
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

        if (selectedFile) {
            data.append('avatar', selectedFile);
        } else {
            data.append('avatar_url', formData.avatar_url);
        }

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            await api.put('/users/profile', data, config);

            setMessage('Profile optimized successfully!');
            setTimeout(() => setMessage(''), 3000);
            fetchProfile();
            setSelectedFile(null);
        } catch (err) {
            setMessage('Error synchronizing profile.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="bg-[#020617] min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full" />
        </div>
    );

    return (
        <Layout>
            <PageTransition>
                <div className="p-4 md:p-10 space-y-10 max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
                            <SettingsIcon size={12} /> System Prefs
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            User <span className="text-blue-500">Configuration</span>
                        </h1>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar / Tabs */}
                        <div className="w-full lg:w-72 space-y-4">
                            <GlassCard className="p-3 space-y-2 bg-black/40 border-white/10">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                                >
                                    <User size={20} /> Profile Data
                                </button>
                                <button
                                    onClick={() => setActiveTab('account')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'account' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                                >
                                    <Shield size={20} /> Core Account
                                </button>
                            </GlassCard>
                            <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Sync Status</p>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">System is encrypted and synchronized with primary core server.</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <GlassCard className="p-8 md:p-12 border-white/10 bg-black/40">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'profile' ? (
                                        <motion.div key="profile" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                                            <div className="flex justify-between items-center mb-10">
                                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div> Public Identity
                                                </h2>
                                                <Sparkles size={20} className="text-blue-500/30" />
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-10">
                                                <div className="flex flex-col md:flex-row items-center gap-10">
                                                    <div className="relative group">
                                                        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-900 overflow-hidden border-2 border-white/10 shadow-2xl relative">
                                                            {previewUrl ? (
                                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                            ) : formData.avatar_url ? (
                                                                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-700 text-6xl font-black uppercase">
                                                                    {formData.username?.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm pointer-events-none">
                                                                <Camera size={32} className="text-white" />
                                                            </div>
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            type="button"
                                                            onClick={() => fileInputRef.current.click()}
                                                            className="absolute -bottom-4 -right-4 p-4 bg-blue-600 rounded-2xl text-white shadow-xl hover:bg-blue-500 transition-all border-4 border-black"
                                                        >
                                                            <Camera size={22} />
                                                        </motion.button>
                                                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                                                    </div>

                                                    <div className="flex-1 text-center md:text-left">
                                                        <h3 className="text-xl font-black text-white mb-2">Visual ID</h3>
                                                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-6">400x400 JPEG/PNG Preferred</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current.click()}
                                                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-slate-300 transition-all flex items-center gap-3 mx-auto md:ml-0"
                                                        >
                                                            <UploadCloud size={18} /> Replace Module
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Operative ID</label>
                                                        <input
                                                            type="text"
                                                            value={formData.username}
                                                            disabled
                                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-slate-600 font-black cursor-not-allowed italic"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Designation</label>
                                                        <input
                                                            type="text"
                                                            name="full_name"
                                                            value={formData.full_name}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Operative Intelligence / Bio</label>
                                                    <textarea
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleChange}
                                                        rows="4"
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        placeholder="Define your mission parameters..."
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                                                    <AnimatePresence>
                                                        {message && (
                                                            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={`text-sm font-black uppercase tracking-widest ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                                                {message}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        type="submit"
                                                        disabled={saving}
                                                        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.2rem] font-black transition-all flex items-center gap-3 ml-auto shadow-2xl shadow-blue-500/30 border border-blue-400/30"
                                                    >
                                                        <Save size={20} /> {saving ? 'SYNCING...' : 'COMMIT CHANGES'}
                                                    </motion.button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="account" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                                <div className="w-2 h-8 bg-red-500 rounded-full"></div> Core Account Settings
                                            </h2>
                                            <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem]">
                                                <h3 className="text-red-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Trash2 size={18} /> Danger Protocol
                                                </h3>
                                                <p className="text-sm text-slate-400 font-bold mb-8">Termination of your operative account is semi-permanent. All progress data will be purged from the Nexus core.</p>
                                                <button className="px-8 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30 rounded-xl font-black transition-all text-xs tracking-[0.2em]">
                                                    TERMINATE ACCOUNT
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </Layout>
    );
}
