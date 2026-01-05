
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { Book, Link as LinkIcon, ExternalLink, Video, FileText, Sparkles, Zap, Award } from 'lucide-react';

export default function Resources() {
    const resources = [
        {
            category: 'Core Protocols',
            color: 'text-blue-400',
            bg: 'bg-blue-500/5',
            border: 'border-blue-500/20',
            icon: Zap,
            items: [
                { title: 'React Documentation', url: 'https://react.dev', icon: FileText, desc: 'Official React guides' },
                { title: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: FileText, desc: 'Utility-first CSS framework' },
            ]
        },
        {
            category: 'Visual Data',
            color: 'text-purple-400',
            bg: 'bg-purple-500/5',
            border: 'border-purple-500/20',
            icon: Video,
            items: [
                { title: 'Node.js Crash Course', url: '#', icon: Video, desc: 'Master Node.js in 1 hour' },
                { title: 'PostgreSQL Basics', url: '#', icon: Video, desc: 'Learn SQL fundamentals' },
            ]
        },
        {
            category: 'Elite Tooling',
            color: 'text-green-400',
            bg: 'bg-green-500/5',
            border: 'border-green-500/20',
            icon: Award,
            items: [
                { title: 'Neon Database', url: 'https://neon.tech', icon: LinkIcon, desc: 'Serverless Postgres' },
                { title: 'Framer Motion', url: 'https://www.framer.com/motion', icon: LinkIcon, desc: 'Animation library' },
            ]
        }
    ];

    return (
        <Layout>
            <div className="p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
                        <Book size={12} /> Resource Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        Intel <span className="text-blue-500">Repository</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((section, idx) => (
                        <GlassCard key={idx} className={`h-full border-white/5 bg-black/40 flex flex-col p-8 ${section.border}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className={`text-xl font-black flex items-center gap-3 ${section.color}`}>
                                    <section.icon size={22} /> {section.category}
                                </h3>
                                <Sparkles size={16} className={`${section.color} opacity-30`} />
                            </div>

                            <div className="space-y-4 flex-1">
                                {section.items.map((item, i) => (
                                    <motion.a
                                        key={i}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ x: 8 }}
                                        className="block group"
                                    >
                                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 group-hover:bg-white/[0.08] group-hover:border-white/10 transition-all duration-300">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                                        <item.icon size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">{item.title}</h4>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-all opacity-40 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
