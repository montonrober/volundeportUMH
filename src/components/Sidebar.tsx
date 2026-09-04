import { Link, useLocation } from 'react-router-dom';
import { useVolunteer } from '../context/VolunteerContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  CalendarDays, 
  Award, 
  Settings, 
  FileEdit,
  ShieldCheck
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const { stats, events } = useVolunteer();

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: LayoutDashboard,
      badge: null 
    },
    { 
      name: 'Formulario Solicitud', 
      path: '/formulario', 
      icon: FileEdit,
      badge: 'Alumnos / Personal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    { 
      name: 'Solicitudes & Cotejo', 
      path: '/solicitudes', 
      icon: UserCheck,
      badge: stats.pendingCotejo > 0 ? stats.pendingCotejo : null,
      badgeColor: 'bg-red-100 text-[#8b1820]'
    },
    { 
      name: 'Eventos y Turnos', 
      path: '/eventos', 
      icon: CalendarDays,
      badge: events.length,
      badgeColor: 'bg-gray-100 text-gray-600'
    },
    { 
      name: 'Diplomas & Emisión', 
      path: '/diplomas', 
      icon: Award,
      badge: stats.validatedCount > 0 ? `${stats.validatedCount} listos` : null,
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200'
    },
    { 
      name: 'Configuración', 
      path: '/configuracion', 
      icon: Settings,
      badge: null 
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col justify-between space-y-6">
      <div className="space-y-6">
        {/* Navigation box */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs">
          <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase px-3 pt-2 pb-2">
            Navegación
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#8b1820] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== null && (
                    <span 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white text-[#8b1820]" : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Campus Info Card (matching the official design) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs text-xs">
          <div className="flex items-center gap-2 font-bold text-gray-800 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#8b1820]" />
            <span>Campus El Clot</span>
          </div>
          <p className="text-gray-500 leading-relaxed text-[11px] mb-3">
            Delegación del Rector de Campus Saludables y Deportes.
          </p>
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#8b1820] font-semibold">
            <span>Res. Rectoral 1600/2023</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
