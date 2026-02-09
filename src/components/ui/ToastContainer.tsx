import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeToast } from '../../store/slices/toastSlice';
import { X, CheckCircle, AlertCircle, CircleX } from 'lucide-react';
import { useEffect } from 'react';

//Data interface
interface IToast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

// Interface propses for separate element
interface ToastItemProps {
    toast: IToast;
}

// Container
export const ToastContainer = () => {
    const toasts = useAppSelector((state) => state.toast.toasts);

    return (
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast: IToast) => (
                    // Transmit special ID and object
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const handleMessage = (type: string) => {
    if (type === 'success') {
        return <CheckCircle size={20}/>;
    }
    if (type === 'error') {
        return <CircleX size={20}/>;
    }
    if (type === 'info') {
        return <AlertCircle size={20}/>;
    }
}

//Element inside Container
const ToastItem = ({ toast }: ToastItemProps) => {
    const dispatch = useAppDispatch();
    const message = handleMessage(toast.type);
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast.id, dispatch]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            layout
            // pointer-events-auto for clicking (X)
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border backdrop-blur-md 
            ${toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/90 border-blue-400 text-white' : ''}`}
        >
            <div className="flex items-center gap-3">
                {message}
                <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button onClick={() => dispatch(removeToast(toast.id))}>
                <X size={16} className="opacity-70 hover:opacity-100" />
            </button>
        </motion.div>
    );
};