import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Book, Video, FileText, Code, Globe, Search, Filter } from 'lucide-react';
import GlassCard from './GlassCard';

const Resources = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Resources data - document links as requested
    const resources = [
        {
            id: 1,
            title: 'JavaScript Fundamentals',
            description: 'Complete guide to JavaScript basics and concepts',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            category: 'documentation',
            type: 'documentation',
            difficulty: 'beginner'
        },
        {
            id: 2,
            title: 'React Official Documentation',
            description: 'Learn React from the official documentation',
            url: 'https://react.dev/learn',
            category: 'documentation',
            type: 'documentation',
            difficulty: 'intermediate'
        },
        {
            id: 3,
            title: 'CSS Grid Layout Guide',
            description: 'Master CSS Grid with this comprehensive guide',
            url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
            category: 'documentation',
            type: 'documentation',
            difficulty: 'intermediate'
        },
        {
            id: 4,
            title: 'Web Development Roadmap',
            description: 'Complete roadmap for becoming a web developer',
            url: 'https://roadmap.sh/frontend',
            category: 'roadmap',
            type: 'guide',
            difficulty: 'beginner'
        },
        {
            id: 5,
            title: 'Node.js Best Practices',
            description: 'Best practices and patterns for Node.js development',
            url: 'https://github.com/goldbergyoni/nodebestpractices',
            category: 'documentation',
            type: 'documentation',
            difficulty: 'advanced'
        },
        {
            id: 6,
            title: 'Git Handbook',
            description: 'Complete guide to Git version control',
            url: 'https://guides.github.com/introduction/git-handbook/',
            category: 'tools',
            type: 'guide',
            difficulty: 'beginner'
        },
        {
            id: 7,
            title: 'REST API Design Guide',
            description: 'Learn how to design and build RESTful APIs',
            url: 'https://restfulapi.net/',
            category: 'documentation',
            type: 'documentation',
            difficulty: 'intermediate'
        },
        {
            id: 8,
            title: 'Database Design Principles',
            description: 'Understanding database design and normalization',
            url: 'https://www.guru99.com/database-design.html',
            category: 'database',
            type: 'documentation',
            difficulty: 'intermediate'
        },
        {
            id: 9,
            title: 'TypeScript Handbook',
            description: 'Learn TypeScript from the official handbook',
            url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
            category: 'documentation',
            type: 'documentation',
            difficulty: 'intermediate'
        },
        {
            id: 10,
            title: 'Web Security Guide',
            description: 'Essential web security practices for developers',
            url: 'https://owasp.org/www-project-top-ten/',
            category: 'security',
            type: 'documentation',
            difficulty: 'advanced'
        },
        {
            id: 11,
            title: 'Frontend Performance Guide',
            description: 'Optimize your web applications for better performance',
            url: 'https://web.dev/performance/',
            category: 'performance',
            type: 'guide',
            difficulty: 'intermediate'
        },
        {
            id: 12,
            title: 'Testing JavaScript Applications',
            description: 'Comprehensive guide to testing in JavaScript',
            url: 'https://testingjavascript.com/',
            category: 'testing',
            type: 'documentation',
            difficulty: 'advanced'
        }
    ];

    const categories = [
        { value: 'all', label: 'All Resources' },
        { value: 'documentation', label: 'Documentation' },
        { value: 'roadmap', label: 'Roadmaps' },
        { value: 'tools', label: 'Tools' },
        { value: 'database', label: 'Database' },
        { value: 'security', label: 'Security' },
        { value: 'performance', label: 'Performance' },
        { value: 'testing', label: 'Testing' }
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'documentation':
                return <FileText size={20} className="text-blue-400" />;
            case 'guide':
                return <Book size={20} className="text-green-400" />;
            case 'video':
                return <Video size={20} className="text-red-400" />;
            case 'code':
                return <Code size={20} className="text-purple-400" />;
            default:
                return <Globe size={20} className="text-gray-400" />;
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'intermediate':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'advanced':
                return 'bg-red-500/20 text-red-400 border-red-500/50';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleResourceClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Learning Resources</h2>
                <p className="text-gray-400">
                    Explore these curated learning materials to enhance your skills
                </p>
            </div>

            {/* Search and Filter */}
            <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource, index) => (
                    <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => handleResourceClick(resource.url)}
                    >
                        <GlassCard className="p-5 h-full hover:border-blue-500/50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    {getTypeIcon(resource.type)}
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(resource.difficulty)}`}>
                                    {resource.difficulty}
                                </span>
                            </div>

                            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                {resource.title}
                                <ExternalLink size={14} className="text-gray-400" />
                            </h3>

                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                {resource.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 capitalize">
                                    {resource.category}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResourceClick(resource.url);
                                    }}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                                >
                                    Open
                                    <ExternalLink size={12} />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* No Results */}
            {filteredResources.length === 0 && (
                <GlassCard className="p-8 text-center">
                    <div className="text-gray-400">
                        <Book size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No resources found</p>
                        <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                </GlassCard>
            )}

            {/* Tips Section */}
            <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">💡 Learning Tips</h3>
                <div className="space-y-2 text-sm text-gray-300">
                    <p>• Start with beginner resources and gradually move to advanced topics</p>
                    <p>• Practice what you learn by building small projects</p>
                    <p>• Join online communities to discuss concepts with other learners</p>
                    <p>• Set aside dedicated time each day for learning</p>
                    <p>• Take notes and review them regularly</p>
                </div>
            </GlassCard>
        </div>
    );
};

export default Resources;
