import { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { 
  CalendarPlus, 
  MapPin, 
  Clock, 
  Save, 
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { EventItem, EventShift } from '../types';

export function EventsManager() {
  const { yearEvents, selectedYear, addEvent, updateEvent, showToast } = useVolunteer();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({
    name: '',
    date: '',
    location: '',
    status: 'upcoming',
    shifts: []
  });

  const [newShift, setNewShift] = useState<Partial<EventShift>>({
    name: '',
    date: '',
    hours: 0,
    description: ''
  });

  const startEdit = (event: EventItem) => {
    setIsCreating(true);
    setEditingId(event.id);
    setNewEvent(event);
  };

  const handleAddShift = () => {
    if (!newShift.name || !newShift.date || !newShift.hours) {
      showToast('Completa el nombre, fecha y horas del turno.', 'warning');
      return;
    }
    
    setNewEvent(prev => ({
      ...prev,
      shifts: [
        ...(prev.shifts || []),
        {
          id: 'sh-' + Date.now().toString(),
          name: newShift.name!,
          date: newShift.date!,
          hours: Number(newShift.hours),
          description: newShift.description || ''
        }
      ]
    }));
    
    setNewShift({ name: '', date: '', hours: 0, description: '' });
  };

  const handleRemoveShift = (shiftId: string) => {
    setNewEvent(prev => ({
      ...prev,
      shifts: prev.shifts?.filter(s => s.id !== shiftId) || []
    }));
  };

  const handleSaveEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.location) {
      showToast('Completa los datos básicos del evento.', 'warning');
      return;
    }
    
    if (!newEvent.shifts || newEvent.shifts.length === 0) {
      showToast('Añade al menos un turno o jornada.', 'warning');
      return;
    }

    if (editingId) {
      updateEvent(editingId, newEvent);
    } else {
      addEvent(newEvent as Omit<EventItem, 'id' | 'academicYear'>);
    }
    
    setIsCreating(false);
    setEditingId(null);
    setNewEvent({ name: '', date: '', location: '', status: 'upcoming', shifts: [] });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarPlus className="w-6 h-6 text-[#8b1820]" />
            Gestión de Eventos y Jornadas
          </h1>
          <p className="text-sm text-gray-500 mt-1">Crea y modifica los eventos disponibles para el curso {selectedYear}.</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingId(null);
            setNewEvent({ name: '', date: '', location: '', status: 'upcoming', shifts: [] });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-xs transition-colors"
        >
          {isCreating ? 'Cancelar' : <><Plus className="w-4 h-4" /> Nuevo Evento</>}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            {editingId ? 'Editar Evento Deportivo' : 'Crear Nuevo Evento Deportivo'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Evento</label>
              <input
                type="text"
                placeholder="Ej. Torneo CADU"
                value={newEvent.name}
                onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Fecha(s) General</label>
              <input
                type="text"
                placeholder="Ej. 10 y 11 de Abril"
                value={newEvent.date}
                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                placeholder="Ej. Palacio de los Deportes"
                value={newEvent.location}
                onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820]"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Turnos / Jornadas (Requerido)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Nombre del turno (Ej. Sábado Mañana)"
                  value={newShift.name}
                  onChange={e => setNewShift({...newShift, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="date"
                  value={newShift.date}
                  onChange={e => setNewShift({...newShift, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  placeholder="Horas (Ej. 5)"
                  value={newShift.hours || ''}
                  onChange={e => setNewShift({...newShift, hours: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  onClick={handleAddShift}
                  className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs py-1.5 rounded-lg transition-colors"
                >
                  Añadir Turno
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {newEvent.shifts?.map((shift, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{shift.name}</span>
                    <span className="text-gray-500 ml-2">{shift.date} • {shift.hours}h</span>
                  </div>
                  <button onClick={() => handleRemoveShift(shift.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!newEvent.shifts || newEvent.shifts.length === 0) && (
                <p className="text-xs text-gray-400 italic">No hay turnos añadidos.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveEvent}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Evento Completo
            </button>
          </div>
        </div>
      )}

      {/* List existing events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {yearEvents.map(event => (
          <div key={event.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{event.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <CalendarPlus className="w-3.5 h-3.5" /> {event.date}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {event.location}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase">
                  {event.shifts.length} Turnos
                </span>
                <button
                  onClick={() => startEdit(event)}
                  className="text-gray-400 hover:text-[#8b1820] transition-colors p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-100 space-y-1">
              {event.shifts.map(sh => (
                <div key={sh.id} className="text-[11px] flex justify-between bg-slate-50 p-1.5 rounded border border-gray-100">
                  <span className="font-semibold text-gray-700 truncate pr-2">{sh.name}</span>
                  <span className="text-[#8b1820] font-bold shrink-0">{sh.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {yearEvents.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500">
            No hay eventos registrados para este curso.
          </div>
        )}
      </div>
    </div>
  );
}
