import { useVolunteer } from '../context/VolunteerContext';
import { 
  Users, 
  Award, 
  Clock, 
  FileCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { yearSubmissions, selectedYear } = useVolunteer();

  // Metrics
  const totalSubmissions = yearSubmissions.length;
  const pendingCertificates = yearSubmissions.filter(s => s.status === 'validado' || s.status === 'pendiente').length;
  const issuedCertificates = yearSubmissions.filter(s => s.status === 'emitido').length;
  
  const totalHours = yearSubmissions.reduce((acc, sub) => acc + sub.hoursApproved, 0);

  const studentsCount = yearSubmissions.filter(s => s.colectivo === 'estudiante').length;
  const ptgasCount = yearSubmissions.filter(s => s.colectivo === 'ptgas').length;
  const pdiCount = yearSubmissions.filter(s => s.colectivo === 'pdi').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Gestión</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen general del programa de voluntariado - Curso {selectedYear}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/asistencia"
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
          >
            Revisar Asistencia
          </Link>
          <Link
            to="/certificados"
            className="px-4 py-2 bg-[#8b1820] hover:bg-[#73131a] text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
          >
            Emitir Certificados
          </Link>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Solicitudes</p>
            <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Certif. Emitidos</p>
            <p className="text-2xl font-bold text-gray-900">{issuedCertificates}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCertificates}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Horas Aprobadas</p>
            <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
          </div>
        </div>

      </div>

      {/* Secondary Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Collective Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <span>Participación por Colectivo</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700">Estudiantes</span>
                <span className="font-bold text-gray-900">{studentsCount}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${totalSubmissions > 0 ? (studentsCount / totalSubmissions) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700">PTGAS</span>
                <span className="font-bold text-gray-900">{ptgasCount}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `${totalSubmissions > 0 ? (ptgasCount / totalSubmissions) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700">PDI</span>
                <span className="font-bold text-gray-900">{pdiCount}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${totalSubmissions > 0 ? (pdiCount / totalSubmissions) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Help Box */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp className="w-32 h-32" />
          </div>
          
          <h3 className="text-lg font-bold mb-2">Flujo de Trabajo Sugerido</h3>
          <ul className="text-sm text-slate-300 space-y-3 z-10">
            <li className="flex gap-2">
              <span className="font-bold text-[#ff9995]">1.</span> 
              <span>Comparte el enlace del <strong>Formulario</strong> con los voluntarios para que envíen sus solicitudes.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#ff9995]">2.</span> 
              <span>Revisa la pestaña <strong>Asistencia</strong>, marca a los asistentes y genera sus resoluciones con un clic.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#ff9995]">3.</span> 
              <span>Ve a <strong>Certificados</strong> para previsualizar, imprimir y descargar los PDF oficiales.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
