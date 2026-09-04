import { Outlet } from 'react-router-dom';
import { useVolunteer } from '../context/VolunteerContext';
import { useAuth } from '../context/AuthContext';
import { UMH_ASSETS } from '../data';
import { CheckCircle2, AlertCircle, Info, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicLayout() {
  const { toasts, dismissToast } = useVolunteer();
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <div className="flex items-center gap-4">
              <img 
                src={UMH_ASSETS.logoDeportes} 
                alt="Deportes UMH" 
                className="h-8 sm:h-10 w-auto object-contain"
              />
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <img 
                src={UMH_ASSETS.logoSaludable} 
                alt="UMH Saludable" 
                className="h-7 sm:h-9 w-auto object-contain hidden sm:block"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <img 
              src={UMH_ASSETS.logoVoluntariado} 
              alt="Voluntariado Deportivo UMH" 
              className="h-6 sm:h-8 w-auto object-contain hidden md:block mr-2"
            />
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Solicitud Oficial</span>
            </div>
            
            <button 
              onClick={signOut}
              className="flex items-center gap-2 p-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md transition-all ${
                toast.type === 'success'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : toast.type === 'warning'
                  ? 'bg-amber-900 text-white border-amber-700'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
                <span>{toast.text}</span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="ml-3 text-gray-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
