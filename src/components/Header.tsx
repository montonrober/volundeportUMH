import { Link, useLocation } from 'react-router-dom';
import { useVolunteer } from '../context/VolunteerContext';
import { UMH_ASSETS } from '../data';
import { 
  CheckSquare, 
  Award, 
  History, 
  FileText, 
  ExternalLink,
  Calendar,
  Settings,
  LayoutDashboard
} from 'lucide-react';

export function Header() {
  const { selectedYear, setSelectedYear, availableYears } = useVolunteer();
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logos */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src={UMH_ASSETS.logoDeportes} 
              alt="Deportes UMH" 
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            <img 
              src={UMH_ASSETS.logoVoluntariado} 
              alt="Voluntariado Deportivo UMH" 
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Administration Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              location.pathname === '/'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className={`w-3.5 h-3.5 ${location.pathname === '/' ? 'text-[#8b1820]' : ''}`} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/eventos"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              location.pathname === '/eventos'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${location.pathname === '/eventos' ? 'text-[#8b1820]' : ''}`} />
            <span>Eventos</span>
          </Link>

          <Link
            to="/asistencia"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              location.pathname === '/asistencia'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckSquare className={`w-3.5 h-3.5 ${location.pathname === '/asistencia' ? 'text-[#8b1820]' : ''}`} />
            <span>Asistencia</span>
          </Link>

          <Link
            to="/certificados"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              location.pathname === '/certificados'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${location.pathname === '/certificados' ? 'text-[#8b1820]' : ''}`} />
            <span>Certificados</span>
          </Link>

          <Link
            to="/historico"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              location.pathname === '/historico'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className={`w-3.5 h-3.5 ${location.pathname === '/historico' ? 'text-[#8b1820]' : ''}`} />
            <span>Histórico</span>
          </Link>

          <Link
            to="/configuracion"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              location.pathname === '/configuracion'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className={`w-3.5 h-3.5 ${location.pathname === '/configuracion' ? 'text-[#8b1820]' : ''}`} />
            <span>Ajustes</span>
          </Link>
        </nav>

        {/* Right Action Switcher */}
        <div className="flex items-center gap-3">
          {/* Year Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#8b1820]" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-gray-800 text-xs focus:outline-none cursor-pointer"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  Curso {year}
                </option>
              ))}
            </select>
          </div>

          {/* View Student Form Link */}
          <Link
            to="/formulario"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#ff9995]" />
            <span className="hidden sm:inline">Enlace Formulario</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Mobile Submenu when in Admin */}
      <div className="lg:hidden border-t border-gray-100 px-4 py-2 flex items-center justify-between overflow-x-auto gap-4 text-xs font-semibold bg-gray-50 no-scrollbar">
        <Link to="/" className={`flex items-center gap-1 shrink-0 ${location.pathname === '/' ? 'text-[#8b1820] font-bold' : 'text-gray-600'}`}>
          <LayoutDashboard className="w-3.5 h-3.5" /> <span>Dashboard</span>
        </Link>
        <Link to="/eventos" className={`flex items-center gap-1 shrink-0 ${location.pathname === '/eventos' ? 'text-[#8b1820] font-bold' : 'text-gray-600'}`}>
          <Calendar className="w-3.5 h-3.5" /> <span>Eventos</span>
        </Link>
        <Link to="/asistencia" className={`flex items-center gap-1 shrink-0 ${location.pathname === '/asistencia' ? 'text-[#8b1820] font-bold' : 'text-gray-600'}`}>
          <CheckSquare className="w-3.5 h-3.5" /> <span>Asistencia</span>
        </Link>
        <Link to="/certificados" className={`flex items-center gap-1 shrink-0 ${location.pathname === '/certificados' ? 'text-[#8b1820] font-bold' : 'text-gray-600'}`}>
          <Award className="w-3.5 h-3.5" /> <span>Certificados</span>
        </Link>
        <Link to="/historico" className={`flex items-center gap-1 shrink-0 ${location.pathname === '/historico' ? 'text-[#8b1820] font-bold' : 'text-gray-600'}`}>
          <History className="w-3.5 h-3.5" /> <span>Histórico</span>
        </Link>
        <Link to="/configuracion" className={`flex items-center gap-1 shrink-0 ${location.pathname === '/configuracion' ? 'text-[#8b1820] font-bold' : 'text-gray-600'}`}>
          <Settings className="w-3.5 h-3.5" /> <span>Ajustes</span>
        </Link>
      </div>
    </header>
  );
}
