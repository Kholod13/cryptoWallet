import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, registerUser, clearError } from '../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import '../../App.css'
import {useNavigate} from "react-router-dom";
import DataAggregation from "./DataAgregation.tsx";
import BitcoinFlow from "./BitcoinFlow.tsx";
import {AnimatedBackgroundText} from "./AnimatedBackgroundText.tsx";
import Logo from '../../components/ui/Logo';

const AuthPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, token } = useAppSelector((state) => state.auth);

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    useEffect(() => {
        dispatch(clearError());
        setLocalError('');
    }, [isLogin, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email.includes('@')) return setLocalError('Invalid email address');
        if (formData.password.length < 6) return setLocalError('Min 6 characters');

        if (isLogin) {
            dispatch(loginUser({ email: formData.email, password: formData.password }));
        } else {
            dispatch(registerUser(formData));
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0B101B] p-4 relative overflow-hidden">

            {/* СЛОЙ ДЕКОРАЦИЙ (Адаптивный) */}
            <div className="absolute inset-0 z-0">
                <div className="hidden lg:block">
                    <DataAggregation />
                </div>
                <div className="opacity-30 md:opacity-100">
                    <AnimatedBackgroundText />
                </div>
                <div className="opacity-50">
                    <BitcoinFlow />
                </div>
            </div>

            {/* ФОРМА (Всегда в центре и выше всех) */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-50 bg-[#161B26]/80 backdrop-blur-xl w-full max-w-[400px] p-6 md:p-10 rounded-[40px] shadow-2xl border border-white/5"
            >
                <div className="flex items-center justify-center mb-6">
                    <Logo className="w-16 h-16" />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 text-center tracking-tight" style={{color: 'white'}}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-400 text-center mb-8 text-sm md:text-base" style={{color: 'white'}}>
                    {isLogin ? 'Log in to manage assets' : 'Join the crypto tracker'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative overflow-hidden">
                                <User className="absolute left-4 top-4 text-slate-500" size={18} />
                                <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange}
                                       className="w-full bg-black/30 border border-white/10 p-3.5 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-500" size={18} />
                        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}
                               className={`w-full bg-black/30 border p-3.5 pl-12 rounded-2xl text-white outline-none transition-all 
                                ${error || localError ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`} />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-500" size={18} />
                        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}
                               className={`w-full bg-black/30 border p-3.5 pl-12 rounded-2xl text-white outline-none transition-all 
                                ${error || localError ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'}`} />
                    </div>

                    {(error || localError) && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                            <AlertCircle size={16} />
                            <span>{error || localError}</span>
                        </div>
                    )}

                    <button type="submit" disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl mt-4 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? 'Wait...' : (isLogin ? 'Sign In' : 'Register')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-slate-500" style={{color: 'white'}}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 font-bold hover:underline">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;