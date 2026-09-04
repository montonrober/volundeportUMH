import { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Download, 
  FileText, 
  Search, 
  Sparkles, 
  Users, 
  Calendar, 
  MapPin, 
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AttendanceManager() {
  const { 
    yearEvents, 
    yearSubmissions, 
    selectedYear,
    toggleAttendance, 
    markAllAttendedForEvent, 
    acceptAndGenerateReportForEvent,
    setSelectedSubmissionId,
    exportDataToCsv
  } = useVolunteer();
  const navigate = useNavigate();

  const [selectedEventId, setSelectedEventId] = useState<string>(yearEvents[0]?.id || 'ev-1');
  const [colectivoFilter, setColectivoFilter] = useState<'all' | 'estudiante' | 'ptgas' | 'pdi'>('all');
  const [search, setSearch] = useState('');

  const currentEvent = yearEvents.find(e => e.id === selectedEventId) || yearEvents[0];

  // Volunteers who registered for this event
  const participants = yearSubmissions.filter(sub => {
    const hasEvent = sub.eventsDeclared.some(e => e.eventId === selectedEventId);
    const matchesColectivo = colectivoFilter === 'all' || sub.colectivo === colectivoFilter;
    const matchesSearch = 
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.nif.toLowerCase().includes(search.toLowerCase()) ||
      sub.departmentOrDegree.toLowerCase().includes(search.toLowerCase());
    return hasEvent && matchesColectivo && matchesSearch;
  });

  const handleOpenCertificate = (subId: string) => {
    setSelectedSubmissionId(subId);
    navigate('/certificados');
  };

  return (
    <div className="space-y-6">
      {/* Event Selector & Actions Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-[#8b1820]">
                Curso {selectedYear}
              </span>
              <span className="text-xs text-gray-500">• Comprobación de Asistencia</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-1">
              Listas de Asistencia por Evento Deportivo
            </h1>
            <p className="text-xs text-gray-500">
              Marca los días asistidos y pulsa "Aceptar y Generar Informes" para emitir los certificados automáticamente.
            </p>
          </div>

          {/* Quick Event Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-700 shrink-0">Seleccionar Evento:</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#8b1820] focus:outline-none cursor-pointer"
            >
              {yearEvents.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.date})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Event Details & Primary Action Bar */}
        {currentEvent && (
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 p-4 rounded-xl">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b1820]"></span>
                {currentEvent.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8b1820]" />
                  {currentEvent.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {currentEvent.location}
                </span>
                <span>•</span>
                <span className="font-bold text-gray-700">
                  {participants.length} inscritos en lista
                </span>
              </div>
            </div>

            {/* Two powerful buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => markAllAttendedForEvent(selectedEventId)}
                className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Marcar Todos Asistidos</span>
              </button>

              <button
                type="button"
                onClick={() => acceptAndGenerateReportForEvent(selectedEventId)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Aceptar Asistencia y Generar Informes</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mr-1">Colectivo:</span>
          <button
            type="button"
            onClick={() => setColectivoFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              colectivoFilter === 'all' ? 'bg-[#8b1820] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos ({yearSubmissions.filter(s => s.eventsDeclared.some(e => e.eventId === selectedEventId)).length})
          </button>
          <button
            type="button"
            onClick={() => setColectivoFilter('estudiante')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              colectivoFilter === 'estudiante' ? 'bg-[#8b1820] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Estudiantes
          </button>
          <button
            type="button"
            onClick={() => setColectivoFilter('ptgas')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              colectivoFilter === 'ptgas' ? 'bg-[#8b1820] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            PTGAS
          </button>
          <button
            type="button"
            onClick={() => setColectivoFilter('pdi')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              colectivoFilter === 'pdi' ? 'bg-[#8b1820] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            PDI
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, NIF o titulación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8b1820]"
            />
          </div>

          <button
            type="button"
            onClick={() => exportDataToCsv('asistencia')}
            className="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Exportar a Excel"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Attendance Check Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Voluntario</th>
                <th className="py-3 px-4">Asistencia: Evento y Jornada</th>
                <th className="py-3 px-3 text-center">Horas</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {participants.map((person) => {
                const isStudent = person.colectivo === 'estudiante';
                const hasAttendedAny = person.eventsDeclared.some(e => e.eventId === selectedEventId && e.attended);
                const isSent = person.certificate?.sentByEmail;

                return (
                  <tr key={person.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name, NIF & Colectivo */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{person.name}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] uppercase ${
                            isStudent
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : person.colectivo === 'pdi'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : 'bg-amber-50 text-amber-800 border border-amber-100'
                          }`}>
                            {person.colectivo}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          NIF: {person.nif}
                        </div>
                        <div className="text-[10px] text-gray-400 flex flex-col pt-1">
                          <span>Solicitado: {person.submissionDate.split(',')[0]}</span>
                          {isSent && (
                            <span className="text-blue-600 font-semibold">Enviado: {person.certificate?.emailSentDate?.split(',')[0]}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Days / Shifts Checklist */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1.5 max-w-sm">
                        {person.eventsDeclared
                          .map((ev, idx) => ({ ev, idx }))
                          .filter(({ ev }) => ev.eventId === selectedEventId)
                          .map(({ ev, idx }) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleAttendance(person.id, idx)}
                              className={`w-full text-left p-2 rounded-lg border transition-all flex items-start gap-2 cursor-pointer ${
                                ev.attended
                                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              <div className="mt-0.5">
                                {ev.attended ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-400 shrink-0" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold truncate text-[11px]">{ev.eventName}</div>
                                <div className="truncate text-[10px] opacity-80">{ev.shiftName}</div>
                              </div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                ev.attended ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-600'
                              }`}>
                                {ev.hoursDeclared}h
                              </span>
                            </button>
                          ))}
                      </div>
                    </td>

                    {/* Computed Hours */}
                    <td className="py-3.5 px-3 text-center align-top">
                      <span className="font-bold text-sm text-[#8b1820] bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                        {person.hoursApproved}h
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 align-top">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isSent
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : person.status === 'emitido'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : hasAttendedAny
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isSent ? 'bg-blue-500' : person.status === 'emitido' ? 'bg-emerald-500' : hasAttendedAny ? 'bg-amber-500' : 'bg-gray-400'
                        }`}></span>
                        {isSent ? 'Enviado' : person.status === 'emitido' ? 'Emitido' : hasAttendedAny ? 'Validado' : 'Pendiente'}
                      </span>
                    </td>

                    {/* Action: Open/Download certificate */}
                    <td className="py-3.5 px-4 text-right align-top">
                      <button
                        type="button"
                        onClick={() => handleOpenCertificate(person.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#8b1820]" />
                        <span>Gestionar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {participants.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    No hay voluntarios apuntados en este evento con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando {participants.length} personas en lista de asistencia</span>
        </div>
      </div>
    </div>
  );
}
