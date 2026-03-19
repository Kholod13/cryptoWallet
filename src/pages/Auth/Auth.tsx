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
    // 2. Достаем токен из стора
    const { isLoading, error, token } = useAppSelector((state) => state.auth);

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [localError, setLocalError] = useState('');

    // 3. СЛЕДИМ ЗА ТОКЕНОМ: Если он появился — уходим на Dashboard
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    useEffect(() => {
        dispatch(clearError());
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalError('');
    }, [isLogin, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // e.target.name — это имя инпута (например, "email")
        // e.target.value — это то, что ты ввел в этот инпут
        setFormData({
            ...formData,               // Копируем все старые поля
            [e.target.name]: e.target.value  // Обновляем только то поле, которое изменилось
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Отправка формы...", formData); // ЛОГ ДЛЯ ПРОВЕРКИ

        setLocalError('');
        if (!formData.email.includes('@')) {
            setLocalError('Invalid email address');
            return;
        }
        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        if (isLogin) {
            dispatch(loginUser({ email: formData.email, password: formData.password }));
        } else {
            dispatch(registerUser(formData));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B101B] p-4 relative">
            <DataAggregation />
            <BitcoinFlow />
            <AnimatedBackgroundText/>
            <motion.div
                layout
                className="bg-[#161B26] w-full max-w-md p-8 rounded-[32px] shadow-2xl border border-white/5 absolute z-100"
            >
                <div className="flex items-center justify-center mb-3">
                    <Logo/>
                </div>
                <p className="text-3xl font-black text-white mb-2 text-center" style={{ color: 'white' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </p>
                <p className="text-slate-400 text-center mb-8 text-sm" style={{ color: 'white' }}>
                    {isLogin ? 'Log in to manage your crypto' : 'Join us and start tracking your assets'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 p-3 pl-12 rounded-xl text-white focus:border-[#362F5E] outline-none transition-all"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-black/20 border p-3 pl-12 rounded-xl text-white outline-none transition-all 
                                ${error || localError ? 'border-red-500/50' : 'border-white/10 focus:border-[#362F5E]'}`}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full bg-black/20 border p-3 pl-12 rounded-xl text-white outline-none transition-all 
                                ${error || localError ? 'border-red-500/50' : 'border-white/10 focus:border-[#362F5E]'}`}
                        />
                    </div>

                    {/* ОТОБРАЖЕНИЕ ОШИБОК */}
                    {(error || localError) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-red-400 text-xs"
                        >
                            <AlertCircle size={16} />
                            <span>{error || localError}</span>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#362F5E] hover:bg-[#4a4080] text-white font-bold py-4 rounded-xl mt-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Get Started')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-slate-500" style={{ color: 'white' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 font-bold hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;