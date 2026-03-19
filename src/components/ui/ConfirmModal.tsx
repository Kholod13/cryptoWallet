import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 description,
                                 confirmText = "Confirm",
                                 cancelText = "Cancel",
                                 type = 'danger'
                             }: ConfirmModalProps) => {

    // Выбираем цвет кнопки в зависимости от типа действия
    const confirmBtnColor = type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop (Затемнение) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#161B26] border border-white/10 w-full max-w-sm rounded-[32px] p-8 shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col items-center text-center gap-3">
                            {/* Icon Area */}
                            <div className={`p-4 rounded-2xl mb-4 ${type === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-xl font-black text-white mb-2" style={{color: 'white'}}>{title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                {description}
                            </p>

                            {/* Actions */}
                            <div className="flex w-full gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-xl text-white font-bold transition-all active:scale-95 cursor-pointer shadow-lg ${confirmBtnColor}`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Кнопка закрытия в углу */}
                        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};