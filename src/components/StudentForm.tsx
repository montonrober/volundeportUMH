import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { UMH_ASSETS } from '../data';
import { ColectivoType } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Send, 
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentForm() {
  const { yearEvents, selectedYear, addSubmission, config, showToast } = useVolunteer();

  // Form state
  const [nombre, setNombre] = useState('');
  const [nif, setNif] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [colectivo, setColectivo] = useState<ColectivoType>('estudiante');
  const [departmentOrDegree, setDepartmentOrDegree] = useState('');
  const [declaracion, setDeclaracion] = useState(true);

  // Selected shifts: Record of "eventId_shiftId" -> boolean
  const [selectedShifts, setSelectedShifts] = useState<Record<string, boolean>>({
    'ev-1_sh-1-1': true,
    'ev-1_sh-1-3': true
  });

  // Submitted success state
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const toggleShift = (key: string) => {
    setSelectedShifts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Compute hours and ECTS
  const declaredList: {
    eventId: string;
    eventName: string;
    shiftId: string;
    shiftName: string;
    hours: number;
  }[] = [];

  yearEvents.forEach(ev => {
    ev.shifts.forEach(sh => {
      const key = `${ev.id}_${sh.id}`;
      if (selectedShifts[key]) {
        declaredList.push({
          eventId: ev.id,
          eventName: ev.name,
          shiftId: sh.id,
          shiftName: sh.name,
          hours: sh.hours
        });
      }
    });
  });

  const totalHours = declaredList.reduce((acc, curr) => acc + curr.hours, 0);
  const ectsCredits = colectivo === 'estudiante' ? Number((totalHours / 25).toFixed(2)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !nif.trim() || !email.trim()) {
      alert('Por favor, completa tus datos personales obligatorios (Nombre, NIF y Email).');
      return;
    }

    if (declaredList.length === 0) {
      alert('Por favor, selecciona al menos un evento o día al que hayas asistido.');
      return;
    }

    if (colectivo === 'estudiante' && totalHours < 10) {
      alert('Los estudiantes necesitan un mínimo de 10 horas para solicitar el certificado.');
      return;
    }

    if (!declaracion) {
      alert('Debes aceptar la declaración jurada de asistencia.');
      return;
    }

    const eventsDeclared = declaredList.map(item => ({
      eventId: item.eventId,
      eventName: item.eventName,
      shiftId: item.shiftId,
      shiftName: item.shiftName,
      hoursDeclared: item.hours,
      hoursApproved: item.hours,
      attended: true,
      validatedForCertificate: true
    }));

    const newId = addSubmission({
      name: nombre.trim(),
      nif: nif.trim().toUpperCase(),
      phone: telefono.trim(),
      email: email.trim().toLowerCase(),
      colectivo,
      departmentOrDegree: departmentOrDegree.trim() || (colectivo === 'estudiante' ? 'Grado UMH' : 'Personal UMH'),
      hoursRequested: totalHours,
      eventsDeclared,
      observations: 'Solicitud realizada mediante formulario web'
    });

    if (config.notificationEmail) {
      setTimeout(() => {
        showToast(`Notificación enviada a ${config.notificationEmail}`, 'info');
      }, 500);
    }

    setSubmittedId(newId);
  };

  // If submitted, show friendly confirmation screen
  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Solicitud Registrada con Éxito
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              ¡Gracias por tu colaboración, {nombre || 'voluntario'}!
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Hemos recibido tu solicitud para el <strong>Curso {selectedYear}</strong> con un total de <strong>{totalHours} horas</strong> declaradas.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between py-1 border-b border-gray-200 font-medium">
              <span className="text-gray-500">NIF / NIE:</span>
              <span className="font-bold text-gray-900">{nif}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200 font-medium">
              <span className="text-gray-500">Colectivo:</span>
              <span className="font-bold text-gray-900 uppercase">{colectivo}</span>
            </div>
            <div className="flex justify-between py-1 text-gray-500">
              <span>Estado actual:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Pendiente de comprobación de firmas
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            La Oficina de Deportes de la UMH comprobará las hojas de firmas del evento y emitirá tu certificado oficial con firma electrónica y código CSV.
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmittedId(null);
                setNombre('');
                setNif('');
                setTelefono('');
                setEmail('');
                setDepartmentOrDegree('');
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
            >
              Enviar otra solicitud
            </button>
            <Link
              to="/asistencia"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-xs"
            >
              Acceso Gestión Oficina de Deportes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Institutional Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={UMH_ASSETS.escudoOficial} 
              alt="Escudo UMH" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-[#8b1820]">
                  Curso Académico {selectedYear}
                </span>
                <span className="text-xs text-gray-500">• Oficina de Deportes UMH</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                Solicitud de Certificado de Voluntariado Deportivo
              </h1>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Rellena este formulario para solicitar tu certificado de participación. 
          {colectivo === 'estudiante' ? (
            <span> Se requieren un mínimo de <strong>10 horas</strong> para solicitar el certificado.</span>
          ) : (
            <span> Válido para el reconocimiento en la <strong>Evaluación del Desempeño</strong> (Apartado 3º).</span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1: Colectivo & Personal Data */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-[#8b1820] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-50 text-[#8b1820] flex items-center justify-center text-xs">1</span>
              <span>¿A qué colectivo perteneces?</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona tu colectivo en la Universidad Miguel Hernández:
            </p>
          </div>

          {/* 3 Large Selectable Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Estudiante */}
            <button
              type="button"
              onClick={() => setColectivo('estudiante')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                colectivo === 'estudiante'
                  ? 'border-[#8b1820] bg-red-50/50 ring-2 ring-[#8b1820]/20'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <GraduationCap className={`w-6 h-6 ${colectivo === 'estudiante' ? 'text-[#8b1820]' : 'text-gray-400'}`} />
                {colectivo === 'estudiante' && <CheckCircle2 className="w-4 h-4 text-[#8b1820]" />}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">Estudiante</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Mínimo 10 horas requeridas</div>
              </div>
            </button>

            {/* PTGAS */}
            <button
              type="button"
              onClick={() => setColectivo('ptgas')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                colectivo === 'ptgas'
                  ? 'border-[#8b1820] bg-red-50/50 ring-2 ring-[#8b1820]/20'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Briefcase className={`w-6 h-6 ${colectivo === 'ptgas' ? 'text-[#8b1820]' : 'text-gray-400'}`} />
                {colectivo === 'ptgas' && <CheckCircle2 className="w-4 h-4 text-[#8b1820]" />}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">PTGAS</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Evaluación del Desempeño</div>
              </div>
            </button>

            {/* PDI */}
            <button
              type="button"
              onClick={() => setColectivo('pdi')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                colectivo === 'pdi'
                  ? 'border-[#8b1820] bg-red-50/50 ring-2 ring-[#8b1820]/20'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <BookOpen className={`w-6 h-6 ${colectivo === 'pdi' ? 'text-[#8b1820]' : 'text-gray-400'}`} />
                {colectivo === 'pdi' && <CheckCircle2 className="w-4 h-4 text-[#8b1820]" />}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">PDI</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Docente e Investigador</div>
              </div>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nombre y Apellidos <span className="text-[#8b1820]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Carmen Martínez Gomis"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1820]/20 focus:border-[#8b1820]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                DNI / NIE / Pasaporte <span className="text-[#8b1820]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. 48123456-X"
                value={nif}
                onChange={(e) => setNif(e.target.value)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1820]/20 focus:border-[#8b1820]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Correo Electrónico UMH <span className="text-[#8b1820]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="ejemplo@alumnos.umh.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1820]/20 focus:border-[#8b1820]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                placeholder="Ej. 612 34 56 78"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1820]/20 focus:border-[#8b1820]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {colectivo === 'estudiante' ? 'Titulación / Grado' : 'Servicio o Departamento'}
              </label>
              <input
                type="text"
                placeholder={colectivo === 'estudiante' ? 'Ej. Grado en Fisioterapia' : 'Ej. Servicio de Deportes'}
                value={departmentOrDegree}
                onChange={(e) => setDepartmentOrDegree(e.target.value)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1820]/20 focus:border-[#8b1820]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Events and Days Attended */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-[#8b1820] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-50 text-[#8b1820] flex items-center justify-center text-xs">2</span>
                <span>Eventos y Días a los que has asistido</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Marca los días o turnos en los que participaste:
              </p>
            </div>

            {/* Live Counter Badge */}
            <div className="bg-slate-100 rounded-2xl px-4 py-2 flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-500">Horas Totales:</span>
                <span className="text-base font-bold text-[#8b1820]">{totalHours} horas</span>
              </div>
              {colectivo === 'estudiante' && (
                <div className="pl-3 border-l border-gray-300">
                  <span className="block text-[10px] uppercase font-bold text-gray-500">Créditos ECTS:</span>
                  <span className="text-base font-bold text-gray-900">{ectsCredits} ECTS</span>
                </div>
              )}
            </div>
          </div>

          {/* List of Events */}
          <div className="space-y-4">
            {yearEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-slate-50/50">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{event.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#8b1820]" />
                        {event.date}
                      </span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  {event.shifts.map((shift) => {
                    const key = `${event.id}_${shift.id}`;
                    const isChecked = !!selectedShifts[key];

                    return (
                      <button
                        key={shift.id}
                        type="button"
                        onClick={() => toggleShift(key)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isChecked
                            ? 'bg-red-50/70 border-[#8b1820] text-gray-900'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#8b1820] rounded border-gray-300 focus:ring-[#8b1820] cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-gray-900 truncate">
                              {shift.name}
                            </div>
                            {shift.description && (
                              <div className="text-[11px] text-gray-500 truncate mt-0.5">
                                {shift.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                          isChecked ? 'bg-[#8b1820] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {shift.hours} h
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Declaration & Submit */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={declaracion}
              onChange={(e) => setDeclaracion(e.target.checked)}
              className="w-4 h-4 text-[#8b1820] rounded border-gray-300 focus:ring-[#8b1820] mt-0.5 cursor-pointer"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              Declaro que los datos indicados son verídicos y que he participado activamente en los eventos seleccionados, constando mi firma en las actas oficiales de la Universidad Miguel Hernández.
            </span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-[#8b1820] hover:bg-[#73131a] text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Solicitud de Certificado ({totalHours} horas)</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
