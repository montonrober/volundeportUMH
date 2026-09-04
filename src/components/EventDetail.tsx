import { useParams, Link } from 'react-router-dom';
import { useVolunteer } from '../context/VolunteerContext';
import { ArrowLeft, CalendarDays, MapPin, Clock, FileCheck } from 'lucide-react';

export function EventDetail() {
  const { id } = useParams();
  const { events } = useVolunteer();
  const event = events.find(e => e.id === id) || events[0];

  if (!event) return <div className="p-8 text-center text-gray-500">Evento no encontrado</div>;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/eventos" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#8b1820] mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo de eventos</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-[#8b1820]" />
              <span>{event.date}</span>
              <span>•</span>
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{event.location}</span>
            </p>
          </div>
          <Link
            to="/formulario"
            className="px-4 py-2 bg-[#8b1820] text-white text-xs font-bold rounded-xl hover:bg-[#73131a] transition-colors shadow-xs"
          >
            Abrir Formulario de Solicitud
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Turnos Oficiales Disponibles
        </h3>
        <div className="space-y-3">
          {event.shifts.map(shift => (
            <div key={shift.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900">{shift.name}</p>
                {shift.description && <p className="text-[11px] text-gray-500">{shift.description}</p>}
              </div>
              <span className="font-bold text-[#8b1820] bg-white border border-gray-200 px-3 py-1 rounded-lg">
                {shift.hours} horas
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
