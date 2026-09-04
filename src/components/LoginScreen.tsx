import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UMH_ASSETS } from '../data';
import { LogIn } from 'lucide-react';

export function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full flex flex-col items-center text-center space-y-6">
        <div className="flex gap-4 items-center justify-center">
          <img src={UMH_ASSETS.logoDeportes} alt="UMH Deportes" className="h-12 w-auto object-contain" />
          <img src={UMH_ASSETS.logoVoluntariado} alt="Voluntariado" className="h-10 w-auto object-contain" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Acceso a Voluntariado</h1>
          <p className="text-sm text-gray-500">Inicia sesión con tu cuenta de Google para acceder a la plataforma de Voluntariado Deportivo UMH.</p>
        </div>

        <button 
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span>Iniciar sesión con Google</span>
        </button>
      </div>
    </div>
  );
}
