import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = false, ...props }) {
    return (
        <motion.div
            className={`glass rounded-xl p-6 ${hover ? 'glass-hover transition-all duration-300' : ''} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
