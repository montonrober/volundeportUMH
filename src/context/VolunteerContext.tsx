import React, { createContext, useContext, useState, useEffect } from 'react';
import { VolunteerSubmission, EventItem, SystemConfig, ColectivoType } from '../types';
import { initialSubmissions, availableEvents, initialConfig } from '../data';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  text: string;
}

interface VolunteerContextType {
  submissions: VolunteerSubmission[];
  events: EventItem[];
  config: SystemConfig;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: string[];
  addAcademicYear: (year: string) => void;
  selectedSubmissionId: string;
  setSelectedSubmissionId: (id: string) => void;
  activeSubmission: VolunteerSubmission | undefined;
  
  // Student Form
  addSubmission: (newSub: Omit<VolunteerSubmission, 'id' | 'submissionDate' | 'status' | 'hoursApproved' | 'ectsCredits' | 'activitiesCount' | 'academicYear'>) => string;
  
  // Fast Attendance Check & 1-Click Cert Generation
  toggleAttendance: (submissionId: string, eventIdx: number) => void;
  markAllAttendedForEvent: (eventId: string) => void;
  acceptAndGenerateReportForEvent: (eventId: string) => void;
  
  // Direct Certificate actions
  issueCertificate: (submissionId: string) => void;
  issueAllPendingCertificates: () => void;
  markCertificateAsSent: (submissionId: string) => void;
  
  // Google Forms Import & Export
  importGoogleFormsCsv: (csvText: string) => number;
  exportDataToCsv: (type: 'asistencia' | 'certificados') => void;
  
  // Config
  updateConfig: (newCfg: Partial<SystemConfig>) => void;
  addEvent: (newEvent: Omit<EventItem, 'id' | 'academicYear'>) => void;
  updateEvent: (eventId: string, updatedEvent: Partial<EventItem>) => void;
  deleteEvent: (eventId: string) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Real-time filtered lists & stats for current selectedYear
  yearSubmissions: VolunteerSubmission[];
  yearEvents: EventItem[];
  stats: {
    totalVolunteers: number;
    pendingCount: number;
    validatedCount: number;
    issuedCount: number;
    totalEctsHours: number;
    studentsCount: number;
    workersCount: number;
  };
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

export function VolunteerProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('umh_config_v2');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return config.academicYear || '2025-2026';
  });

  const [submissions, setSubmissions] = useState<VolunteerSubmission[]>(() => {
    const saved = localStorage.getItem('umh_submissions_v2');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('umh_events_v2');
    return saved ? JSON.parse(saved) : availableEvents;
  });

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(() => {
    return initialSubmissions[0]?.id || '';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('umh_config_v2', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('umh_submissions_v2', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('umh_events_v2', JSON.stringify(events));
  }, [events]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAcademicYear = (newYear: string) => {
    const trimmed = newYear.trim();
    if (!trimmed) return;
    if (!config.availableYears.includes(trimmed)) {
      const updatedYears = [trimmed, ...config.availableYears];
      setConfig(prev => ({ ...prev, availableYears: updatedYears, academicYear: trimmed }));
      setSelectedYear(trimmed);
      showToast(`Nuevo curso ${trimmed} añadido al histórico.`, 'success');
    } else {
      setSelectedYear(trimmed);
    }
  };

  const addSubmission = (newSub: Omit<VolunteerSubmission, 'id' | 'submissionDate' | 'status' | 'hoursApproved' | 'ectsCredits' | 'activitiesCount' | 'academicYear'>): string => {
    const id = 'sub-' + Date.now().toString();
    const now = new Date();
    const submissionDate = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const totalApproved = newSub.eventsDeclared.reduce((acc, ev) => acc + (ev.hoursApproved || ev.hoursDeclared), 0);
    const ects = newSub.colectivo === 'estudiante' ? Number((totalApproved / config.hoursPerEcts).toFixed(2)) : 0;
    const activitiesCount = newSub.eventsDeclared.filter(e => e.validatedForCertificate).length;

    const fullSubmission: VolunteerSubmission = {
      ...newSub,
      id,
      academicYear: selectedYear,
      submissionDate,
      hoursApproved: totalApproved,
      ectsCredits: ects,
      activitiesCount,
      status: 'pendiente'
    };

    setSubmissions(prev => [fullSubmission, ...prev]);
    setSelectedSubmissionId(id);
    showToast(`Solicitud guardada para ${newSub.name} en el curso ${selectedYear}.`, 'success');
    return id;
  };

  // Toggle single attendance item
  const toggleAttendance = (submissionId: string, eventIdx: number) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id !== submissionId) return sub;
      const updatedEvents = sub.eventsDeclared.map((ev, idx) => {
        if (idx !== eventIdx) return ev;
        const newAttended = !ev.attended;
        return {
          ...ev,
          attended: newAttended,
          validatedForCertificate: newAttended,
          hoursApproved: newAttended ? ev.hoursDeclared : 0
        };
      });

      const totalApproved = updatedEvents.reduce((acc, e) => acc + (e.attended ? e.hoursApproved : 0), 0);
      const validActivities = updatedEvents.filter(e => e.attended).length;
      const ects = sub.colectivo === 'estudiante' ? Number((totalApproved / config.hoursPerEcts).toFixed(2)) : 0;

      return {
        ...sub,
        eventsDeclared: updatedEvents,
        hoursApproved: totalApproved,
        ectsCredits: ects,
        activitiesCount: validActivities
      };
    }));
  };

  // Mark all volunteers for an event as attended
  const markAllAttendedForEvent = (eventId: string) => {
    let count = 0;
    setSubmissions(prev => prev.map(sub => {
      let changed = false;
      const updatedEvents = sub.eventsDeclared.map(ev => {
        if (ev.eventId === eventId) {
          changed = true;
          count++;
          return {
            ...ev,
            attended: true,
            validatedForCertificate: true,
            hoursApproved: ev.hoursDeclared
          };
        }
        return ev;
      });

      if (!changed) return sub;

      const totalApproved = updatedEvents.reduce((acc, e) => acc + (e.attended ? e.hoursApproved : 0), 0);
      const validActivities = updatedEvents.filter(e => e.attended).length;
      const ects = sub.colectivo === 'estudiante' ? Number((totalApproved / config.hoursPerEcts).toFixed(2)) : 0;

      return {
        ...sub,
        eventsDeclared: updatedEvents,
        hoursApproved: totalApproved,
        ectsCredits: ects,
        activitiesCount: validActivities
      };
    }));

    showToast(`Asistencia confirmada para todos los participantes del evento.`, 'success');
  };

  // 1-Click Accept attendance and generate certificates/report for an entire event
  const acceptAndGenerateReportForEvent = (eventId: string) => {
    const now = new Date();
    let updatedCount = 0;

    setSubmissions(prev => prev.map(sub => {
      const hasEvent = sub.eventsDeclared.some(e => e.eventId === eventId && e.attended);
      if (!hasEvent) return sub;

      updatedCount++;
      const csvCode = sub.certificate?.csvCode || `CSV-UMH-${selectedYear.slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      return {
        ...sub,
        status: 'emitido',
        certificate: {
          csvCode,
          issueDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          signedBy: config.signerName,
          rectoralResolution: config.signerResolution,
          sentByEmail: sub.certificate?.sentByEmail || false,
          emailSentDate: sub.certificate?.emailSentDate
        }
      };
    }));

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    showToast(`¡Aceptado con éxito! Se han generado los certificados para ${updatedCount} participantes.`, 'success');
  };

  // Issue single certificate
  const issueCertificate = (submissionId: string) => {
    const now = new Date();
    setSubmissions(prev => prev.map(sub => {
      if (sub.id !== submissionId) return sub;
      const csvCode = sub.certificate?.csvCode || `CSV-UMH-${selectedYear.slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      return {
        ...sub,
        status: 'emitido',
        certificate: {
          csvCode,
          issueDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          signedBy: config.signerName,
          rectoralResolution: config.signerResolution,
          sentByEmail: sub.certificate?.sentByEmail || false,
          emailSentDate: sub.certificate?.emailSentDate
        }
      };
    }));

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    showToast('Certificado oficial generado.', 'success');
  };

  const markCertificateAsSent = (submissionId: string) => {
    const now = new Date();
    setSubmissions(prev => prev.map(sub => {
      if (sub.id !== submissionId || !sub.certificate) return sub;
      return {
        ...sub,
        certificate: {
          ...sub.certificate,
          sentByEmail: true,
          emailSentDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      };
    }));
    showToast('Marcado como enviado por correo.', 'success');
  };

  // Issue all pending certificates in bulk
  const issueAllPendingCertificates = () => {
    const now = new Date();
    let count = 0;
    setSubmissions(prev => prev.map(sub => {
      if (sub.academicYear === selectedYear && sub.status !== 'emitido') {
        count++;
        const csvCode = `CSV-UMH-${selectedYear.slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        return {
          ...sub,
          status: 'emitido',
          certificate: {
            csvCode,
            issueDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            signedBy: config.signerName,
            rectoralResolution: config.signerResolution,
            sentByEmail: true,
            emailSentDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          }
        };
      }
      return sub;
    }));

    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch {
      // safe fallback
    }

    showToast(`Generados ${count} certificados oficiales con código seguro CSV.`, 'success');
  };

  // Import Google Forms CSV
  const importGoogleFormsCsv = (csvText: string): number => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      showToast('El archivo CSV está vacío o no tiene registros.', 'warning');
      return 0;
    }

    let addedCount = 0;
    const newItems: VolunteerSubmission[] = [];

    // Parse simple CSV (ignoring header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple parser handling quoted commas or standard comma separation
      const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
      if (cols.length < 4) continue;

      const timestamp = cols[0] || '2026/02/25';
      const name = cols[1] || 'Voluntario Importado';
      const nif = cols[2] || '***0000*';
      const email = cols[3] || 'voluntario@umh.es';
      const phone = cols[4] || '600000000';
      const colectivoRaw = (cols[5] || 'estudiante').toLowerCase();
      const colectivo: ColectivoType = colectivoRaw.includes('ptgas') ? 'ptgas' : colectivoRaw.includes('pdi') ? 'pdi' : 'estudiante';
      const deptOrDegree = cols[6] || (colectivo === 'estudiante' ? 'Grado UMH' : 'Personal UMH');
      const eventName = cols[7] || '52ª Media Maratón Internacional de Elche';
      const shiftName = cols[8] || 'Jornada Completa';
      const hours = Number(cols[9]) || (colectivo === 'estudiante' ? 12 : 5);

      const id = 'import-' + Date.now().toString() + '-' + i;
      const ects = colectivo === 'estudiante' ? Number((hours / config.hoursPerEcts).toFixed(2)) : 0;

      newItems.push({
        id,
        academicYear: selectedYear,
        name,
        nif,
        email,
        phone,
        colectivo,
        departmentOrDegree: deptOrDegree,
        submissionDate: timestamp,
        hoursRequested: hours,
        hoursApproved: hours,
        ectsCredits: ects,
        activitiesCount: 1,
        status: 'cotejado',
        eventsDeclared: [
          {
            eventId: 'ev-1',
            eventName,
            shiftName,
            hoursDeclared: hours,
            hoursApproved: hours,
            attended: true,
            actaNumber: 'Google Forms',
            validatedForCertificate: true
          }
        ]
      });
      addedCount++;
    }

    if (addedCount > 0) {
      setSubmissions(prev => [...newItems, ...prev]);
      showToast(`¡Se han importado con éxito ${addedCount} registros de Google Forms para el curso ${selectedYear}!`, 'success');
    }

    return addedCount;
  };

  // Export to CSV/Excel
  const exportDataToCsv = (type: 'asistencia' | 'certificados') => {
    const currentSubs = submissions.filter(s => s.academicYear === selectedYear);
    
    if (type === 'asistencia') {
      const headers = ['Curso', 'Nombre', 'NIF', 'Email', 'Teléfono', 'Colectivo', 'Titulación/Dpto', 'Evento', 'Turno', 'Horas Asistidas', 'Asistió', 'Fecha Solicitud'];
      const rows: any[] = [];
      currentSubs.forEach(s => {
        s.eventsDeclared.forEach(e => {
          rows.push([
            s.academicYear,
            s.name,
            s.nif,
            s.email,
            s.phone,
            s.colectivo.toUpperCase(),
            s.departmentOrDegree,
            e.eventName,
            e.shiftName,
            e.hoursApproved,
            e.attended ? 'SÍ' : 'NO',
            s.submissionDate
          ]);
        });
      });

      const csv = [headers.join(','), ...rows.map(r => r.map((v: any) => `"${v}"`).join(','))].join('\n');
      downloadFile(csv, `Listado_Asistencia_${selectedYear}.csv`);
      showToast(`Listado de asistencia de ${selectedYear} exportado a Excel.`, 'info');
    } else {
      const headers = ['Curso', 'Nombre', 'NIF', 'Colectivo', 'Horas Totales', 'Créditos ECTS', 'Actividades Desempeño', 'Código Seguro CSV', 'Fecha Solicitud', 'Fecha Resolución', 'Firmado Por'];
      const rows = currentSubs.map(s => [
        s.academicYear,
        s.name,
        s.nif,
        s.colectivo.toUpperCase(),
        s.hoursApproved,
        s.ectsCredits,
        s.activitiesCount,
        s.certificate?.csvCode || 'Pendiente',
        s.submissionDate,
        s.certificate?.issueDate || 'No resuelto',
        s.certificate?.signedBy || config.signerName
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map((v: any) => `"${v}"`).join(','))].join('\n');
      downloadFile(csv, `Certificados_Emitidos_${selectedYear}.csv`);
      showToast(`Informes y certificados de ${selectedYear} exportados a Excel.`, 'info');
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const updateConfig = (newCfg: Partial<SystemConfig>) => {
    setConfig(prev => ({ ...prev, ...newCfg }));
    showToast('Ajustes guardados correctamente.', 'info');
  };

  const updateEvent = (eventId: string, updatedEvent: Partial<EventItem>) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return { ...ev, ...updatedEvent };
      }
      return ev;
    }));
    showToast('Evento actualizado correctamente.', 'success');
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== eventId));
    showToast('Evento eliminado.', 'success');
  };

  const addEvent = (newEvent: Omit<EventItem, 'id' | 'academicYear'>) => {
    const id = 'ev-' + Date.now().toString();
    setEvents(prev => [{ ...newEvent, id, academicYear: selectedYear }, ...prev]);
    showToast(`Evento "${newEvent.name}" creado para el curso ${selectedYear}.`, 'success');
  };

  // Filtered by selected year
  const yearSubmissions = submissions.filter(s => s.academicYear === selectedYear);
  const yearEvents = events.filter(e => e.academicYear === selectedYear);

  const activeSubmission = submissions.find(s => s.id === selectedSubmissionId) || yearSubmissions[0] || submissions[0];

  const totalVolunteers = yearSubmissions.length;
  const pendingCount = yearSubmissions.filter(s => s.status === 'pendiente').length;
  const validatedCount = yearSubmissions.filter(s => s.status === 'validado' || s.status === 'cotejado').length;
  const issuedCount = yearSubmissions.filter(s => s.status === 'emitido').length;
  const totalEctsHours = yearSubmissions
    .filter(s => s.colectivo === 'estudiante')
    .reduce((acc, s) => acc + s.hoursApproved, 0);
  const studentsCount = yearSubmissions.filter(s => s.colectivo === 'estudiante').length;
  const workersCount = yearSubmissions.filter(s => s.colectivo === 'ptgas' || s.colectivo === 'pdi').length;

  return (
    <VolunteerContext.Provider
      value={{
        submissions,
        events,
        config,
        selectedYear,
        setSelectedYear,
        availableYears: config.availableYears,
        addAcademicYear,
        selectedSubmissionId,
        setSelectedSubmissionId,
        activeSubmission,
        addSubmission,
        toggleAttendance,
        markAllAttendedForEvent,
        acceptAndGenerateReportForEvent,
        issueCertificate,
        issueAllPendingCertificates,
        markCertificateAsSent,
        importGoogleFormsCsv,
        exportDataToCsv,
        updateConfig,
        addEvent,
        updateEvent,
        deleteEvent,
        toasts,
        showToast,
        dismissToast,
        yearSubmissions,
        yearEvents,
        stats: {
          totalVolunteers,
          pendingCount,
          validatedCount,
          issuedCount,
          totalEctsHours,
          studentsCount,
          workersCount
        }
      }}
    >
      {children}
    </VolunteerContext.Provider>
  );
}

export function useVolunteer() {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error('useVolunteer must be used within a VolunteerProvider');
  }
  return context;
}
