import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import { Book, Link as LinkIcon, ExternalLink, Video, FileText } from 'lucide-react';

export default function Resources() {
    const resources = [
        {
            category: 'Documentation',
            items: [
                { title: 'React Documentation', url: 'https://react.dev', icon: FileText, desc: 'Official React guides' },
                { title: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: FileText, desc: 'Utility-first CSS framework' },
            ]
        },
        {
            category: 'Video Tutorials',
            items: [
                { title: 'Node.js Crash Course', url: '#', icon: Video, desc: 'Master Node.js in 1 hour' },
                { title: 'PostgreSQL Basics', url: '#', icon: Video, desc: 'Learn SQL fundamentals' },
            ]
        },
        {
            category: 'Tools',
            items: [
                { title: 'Neon Database', url: 'https://neon.tech', icon: LinkIcon, desc: 'Serverless Postgres' },
                { title: 'Framer Motion', url: 'https://www.framer.com/motion', icon: LinkIcon, desc: 'Animation library' },
            ]
        }
    ];

    return (
        <Layout>
            <div className="p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Learning Resources</h1>
                    <p className="text-slate-400">Curated links and tools to help you grow.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((section, idx) => (
                        <GlassCard key={idx} className="h-full">
                            <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                                <Book size={20} /> {section.category}
                            </h3>
                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <motion.a
                                        key={i}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ x: 5 }}
                                        className="block group"
                                    >
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-3">
                                                    <item.icon size={20} className="text-slate-400 group-hover:text-white transition" />
                                                    <div>
                                                        <h4 className="font-medium text-slate-200 group-hover:text-blue-300 transition">{item.title}</h4>
                                                        <p className="text-xs text-slate-500 group-hover:text-slate-400">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition" />
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
