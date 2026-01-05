import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function Captcha({ onVerify }) {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('pending'); // pending, success, error

    const generateProblem = () => {
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 10);
        setNum1(n1);
        setNum2(n2);
        setAnswer('');
        setStatus('pending');
        onVerify(false);
    };

    useEffect(() => {
        generateProblem();
    }, []);

    const handleVerify = () => {
        if (parseInt(answer) === num1 + num2) {
            setStatus('success');
            onVerify(true);
        } else {
            setStatus('error');
            setAnswer('');
            onVerify(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <label className="text-slate-300 text-sm font-medium">Human Verification</label>
                <button type="button" onClick={generateProblem} className="text-slate-400 hover:text-white transition">
                    <RefreshCw size={14} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-slate-900 px-3 py-2 rounded text-slate-300 font-mono tracking-widest border border-slate-700 select-none">
                    {num1} + {num2} = ?
                </div>
                <input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder=""
                    className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-2 text-center text-white focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
                <button
                    type="button"
                    onClick={handleVerify}
                    className={`px-3 py-2 rounded font-medium transition ${status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                    disabled={status === 'success'}
                >
                    {status === 'success' ? <CheckCircle size={18} /> : 'Verify'}
                </button>
            </div>
            {status === 'error' && <p className="text-red-400 text-xs mt-2">Incorrect, try again.</p>}
        </div>
    );
}
