
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#020617] text-white relative overflow-hidden">
            {/* Global Dynamic Background Lighting */}
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            <Sidebar />
            <main className="flex-1 overflow-x-hidden relative z-10">
                {children}
            </main>
        </div>
    );
}
