import React, { createContext, useContext, useState, useEffect } from 'react';
import { VolunteerSubmission, EventItem, SystemConfig, ColectivoType } from '../types';
import confetti from 'canvas-confetti';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, writeBatch, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

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
  
  addSubmission: (newSub: Omit<VolunteerSubmission, 'id' | 'submissionDate' | 'status' | 'hoursApproved' | 'ectsCredits' | 'activitiesCount' | 'academicYear'>) => Promise<string>;
  toggleAttendance: (submissionId: string, eventIdx: number) => Promise<void>;
  markAllAttendedForEvent: (eventId: string) => Promise<void>;
  acceptAndGenerateReportForEvent: (eventId: string) => Promise<void>;
  issueCertificate: (submissionId: string) => Promise<void>;
  issueAllPendingCertificates: () => Promise<void>;
  markCertificateAsSent: (submissionId: string) => Promise<void>;
  
  importGoogleFormsCsv: (csvText: string) => Promise<number>;
  exportDataToCsv: (type: 'asistencia' | 'certificados') => void;
  
  updateConfig: (newCfg: Partial<SystemConfig>) => Promise<void>;
  addEvent: (newEvent: Omit<EventItem, 'id' | 'academicYear'>) => Promise<void>;
  updateEvent: (eventId: string, updatedEvent: Partial<EventItem>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

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

const initialConfig: SystemConfig = {
  academicYear: '2025-2026',
  availableYears: ['2025-2026', '2024-2025'],
  hoursPerEcts: 25,
  signerName: 'Fdo: Fulanito de Tal',
  signerRole: 'Vicerrector de Inclusión',
  signerResolution: 'Resolución Rectoral UMH 1/2026'
};

export function VolunteerProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  
  const [config, setConfig] = useState<SystemConfig>(initialConfig);
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [submissions, setSubmissions] = useState<VolunteerSubmission[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load Config
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const c = docSnap.data() as SystemConfig;
        setConfig(c);
        if (!selectedYear || !c.availableYears.includes(selectedYear)) {
          setSelectedYear(c.academicYear);
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/main'));
    return () => unsubscribe();
  }, [user]);

  // Load Events
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const evs: EventItem[] = [];
      snapshot.forEach(doc => evs.push({ id: doc.id, ...doc.data() } as EventItem));
      setEvents(evs);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'events'));
    return () => unsubscribe();
  }, [user]);

  // Load Submissions
  useEffect(() => {
    if (!user) return;
    const q = isAdmin 
      ? collection(db, 'submissions')
      : query(collection(db, 'submissions'), where('userId', '==', user.uid));
      
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs: VolunteerSubmission[] = [];
      snapshot.forEach(doc => subs.push({ id: doc.id, ...doc.data() } as VolunteerSubmission));
      
      subs.sort((a, b) => {
        return (b.submissionDate > a.submissionDate) ? 1 : -1;
      });
      
      setSubmissions(subs);
      if (subs.length > 0 && !selectedSubmissionId) {
        setSelectedSubmissionId(subs[0].id);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'submissions'));
    return () => unsubscribe();
  }, [user, isAdmin]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => dismissToast(id), 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAcademicYear = async (newYear: string) => {
    const trimmed = newYear.trim();
    if (!trimmed) return;
    if (!config.availableYears.includes(trimmed)) {
      const updatedYears = [trimmed, ...config.availableYears];
      try {
        await updateDoc(doc(db, 'config', 'main'), { 
          availableYears: updatedYears,
          academicYear: trimmed 
        });
        setSelectedYear(trimmed);
        showToast(`Nuevo curso ${trimmed} añadido al histórico.`, 'success');
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, 'config/main');
      }
    } else {
      setSelectedYear(trimmed);
    }
  };

  const addSubmission = async (newSub: Omit<VolunteerSubmission, 'id' | 'submissionDate' | 'status' | 'hoursApproved' | 'ectsCredits' | 'activitiesCount' | 'academicYear'>) => {
    const id = 'sub-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2,6);
    const now = new Date();
    const submissionDate = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const totalApproved = newSub.eventsDeclared.reduce((acc, ev) => acc + (ev.hoursApproved || ev.hoursDeclared), 0);
    const ects = newSub.colectivo === 'estudiante' ? Number((totalApproved / config.hoursPerEcts).toFixed(2)) : 0;
    const activitiesCount = newSub.eventsDeclared.filter(e => e.validatedForCertificate).length;

    const fullSubmission = {
      ...newSub,
      userId: user?.uid || 'public-user',
      academicYear: selectedYear,
      submissionDate,
      hoursApproved: totalApproved,
      ectsCredits: ects,
      activitiesCount,
      status: 'pendiente'
    };

    try {
      await setDoc(doc(db, 'submissions', id), fullSubmission);
      setSelectedSubmissionId(id);
      showToast(`Solicitud guardada para ${newSub.name}.`, 'success');
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'submissions');
      return '';
    }
  };

  const toggleAttendance = async (submissionId: string, eventIdx: number) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    
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

    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        eventsDeclared: updatedEvents,
        hoursApproved: totalApproved,
        ectsCredits: ects,
        activitiesCount: validActivities,
        status: 'cotejado'
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `submissions/${submissionId}`);
    }
  };

  const markAllAttendedForEvent = async (eventId: string) => {
    const batch = writeBatch(db);
    let count = 0;
    
    submissions.forEach(sub => {
      let changed = false;
      const updatedEvents = sub.eventsDeclared.map(ev => {
        if (ev.eventId === eventId) {
          changed = true;
          return {
            ...ev,
            attended: true,
            validatedForCertificate: true,
            hoursApproved: ev.hoursDeclared
          };
        }
        return ev;
      });

      if (changed) {
        const totalApproved = updatedEvents.reduce((acc, e) => acc + (e.attended ? e.hoursApproved : 0), 0);
        const validActivities = updatedEvents.filter(e => e.attended).length;
        const ects = sub.colectivo === 'estudiante' ? Number((totalApproved / config.hoursPerEcts).toFixed(2)) : 0;
        
        batch.update(doc(db, 'submissions', sub.id), {
          eventsDeclared: updatedEvents,
          hoursApproved: totalApproved,
          ectsCredits: ects,
          activitiesCount: validActivities,
          status: 'cotejado'
        });
        count++;
      }
    });

    if (count > 0) {
      try {
        await batch.commit();
        showToast(`Asistencia confirmada para ${count} participantes.`, 'success');
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, 'submissions');
      }
    }
  };

  const acceptAndGenerateReportForEvent = async (eventId: string) => {
    const now = new Date();
    const batch = writeBatch(db);
    let count = 0;

    submissions.forEach(sub => {
      const hasEvent = sub.eventsDeclared.some(e => e.eventId === eventId && e.attended);
      if (hasEvent) {
        const csvCode = sub.certificate?.csvCode || `CSV-UMH-${selectedYear.slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        batch.update(doc(db, 'submissions', sub.id), {
          status: 'emitido',
          certificate: {
            csvCode,
            issueDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            signedBy: config.signerName,
            rectoralResolution: config.signerResolution,
            sentByEmail: sub.certificate?.sentByEmail || false,
            emailSentDate: sub.certificate?.emailSentDate || ''
          }
        });
        count++;
      }
    });

    if (count > 0) {
      try {
        await batch.commit();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        showToast(`¡Aceptado con éxito! Se han generado los certificados para ${count} participantes.`, 'success');
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, 'submissions');
      }
    }
  };

  const issueCertificate = async (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    
    const now = new Date();
    const csvCode = sub.certificate?.csvCode || `CSV-UMH-${selectedYear.slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        status: 'emitido',
        certificate: {
          csvCode,
          issueDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          signedBy: config.signerName,
          rectoralResolution: config.signerResolution,
          sentByEmail: sub.certificate?.sentByEmail || false,
          emailSentDate: sub.certificate?.emailSentDate || ''
        }
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showToast('Certificado oficial generado.', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `submissions/${submissionId}`);
    }
  };

  const markCertificateAsSent = async (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub || !sub.certificate) return;
    
    const now = new Date();
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        certificate: {
          ...sub.certificate,
          sentByEmail: true,
          emailSentDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      });
      showToast('Marcado como enviado por correo.', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `submissions/${submissionId}`);
    }
  };

  const issueAllPendingCertificates = async () => {
    const now = new Date();
    const batch = writeBatch(db);
    let count = 0;
    
    submissions.forEach(sub => {
      if (sub.academicYear === selectedYear && sub.status !== 'emitido') {
        const csvCode = `CSV-UMH-${selectedYear.slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        batch.update(doc(db, 'submissions', sub.id), {
          status: 'emitido',
          certificate: {
            csvCode,
            issueDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            signedBy: config.signerName,
            rectoralResolution: config.signerResolution,
            sentByEmail: true,
            emailSentDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          }
        });
        count++;
      }
    });

    if (count > 0) {
      try {
        await batch.commit();
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        showToast(`Generados ${count} certificados oficiales con código seguro CSV.`, 'success');
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, 'submissions');
      }
    }
  };

  const importGoogleFormsCsv = async (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      showToast('El archivo CSV está vacío o no tiene registros.', 'warning');
      return 0;
    }

    const batch = writeBatch(db);
    let addedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
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

      const newSub: VolunteerSubmission = {
        id,
        userId: 'imported', // For imported users without auth accounts
        academicYear: selectedYear,
        name,
        nif,
        email,
        phone,
        colectivo,
        departmentOrDegree: deptOrDegree,
        submissionDate: timestamp,
        hoursApproved: hours,
        ectsCredits: ects,
        activitiesCount: 1,
        status: 'cotejado',
        eventsDeclared: [
          {
            eventId: 'ev-import',
            eventName,
            shiftName,
            hoursDeclared: hours,
            hoursApproved: hours,
            attended: true,
            validatedForCertificate: true
          }
        ]
      };
      
      batch.set(doc(db, 'submissions', id), newSub);
      addedCount++;
    }

    if (addedCount > 0) {
      try {
        await batch.commit();
        showToast(`Importados ${addedCount} voluntarios desde Google Forms.`, 'success');
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, 'submissions');
      }
    }
    return addedCount;
  };

  const exportDataToCsv = (type: 'asistencia' | 'certificados') => {
    let headers: string[];
    let rows: string[];
    
    if (type === 'asistencia') {
      headers = ['Nombre', 'NIF', 'Email', 'Colectivo', 'Horas Acumuladas', 'Estado'];
      rows = yearSubmissions.map(s => 
        `"${s.name}","${s.nif}","${s.email}","${s.colectivo}","${s.hoursApproved}","${s.status}"`
      );
    } else {
      headers = ['Nombre', 'NIF', 'Email', 'CSV Certificado', 'Fecha Emision', 'Enviado'];
      rows = yearSubmissions.map(s => 
        `"${s.name}","${s.nif}","${s.email}","${s.certificate?.csvCode || 'No emitido'}","${s.certificate?.issueDate || ''}","${s.certificate?.sentByEmail ? 'SI' : 'NO'}"`
      );
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `umh_${type}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Exportación de ${type} iniciada.`, 'info');
  };

  const updateConfig = async (newCfg: Partial<SystemConfig>) => {
    try {
      await updateDoc(doc(db, 'config', 'main'), newCfg);
      showToast('Configuración actualizada correctamente.', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'config/main');
    }
  };

  const addEvent = async (newEvent: Omit<EventItem, 'id' | 'academicYear'>) => {
    const id = 'ev-' + Date.now().toString();
    try {
      await setDoc(doc(db, 'events', id), {
        ...newEvent,
        academicYear: selectedYear
      });
      showToast('Evento creado.', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'events');
    }
  };

  const updateEvent = async (eventId: string, updatedEvent: Partial<EventItem>) => {
    try {
      await updateDoc(doc(db, 'events', eventId), updatedEvent);
      showToast('Evento actualizado.', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `events/${eventId}`);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      showToast('Evento eliminado.', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `events/${eventId}`);
    }
  };

  const yearSubmissions = submissions.filter(s => s.academicYear === selectedYear);
  const yearEvents = events.filter(e => e.academicYear === selectedYear);
  const activeSubmission = submissions.find(s => s.id === selectedSubmissionId);

  const pendingCount = yearSubmissions.filter(s => s.status === 'pendiente').length;
  const validatedCount = yearSubmissions.filter(s => s.status === 'validado' || s.status === 'cotejado').length;
  const issuedCount = yearSubmissions.filter(s => s.status === 'emitido').length;
  const totalEctsHours = yearSubmissions.filter(s => s.colectivo === 'estudiante').reduce((acc, sub) => acc + sub.hoursApproved, 0);
  
  const stats = {
    totalVolunteers: yearSubmissions.length,
    pendingCount,
    validatedCount,
    issuedCount,
    totalEctsHours,
    studentsCount: yearSubmissions.filter(s => s.colectivo === 'estudiante').length,
    workersCount: yearSubmissions.filter(s => s.colectivo !== 'estudiante').length
  };

  const ctx: VolunteerContextType = {
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
    stats
  };

  return (
    <VolunteerContext.Provider value={ctx}>
      {children}
    </VolunteerContext.Provider>
  );
}

export function useVolunteer() {
  const context = useContext(VolunteerContext);
  if (context === undefined) {
    throw new Error('useVolunteer must be used within a VolunteerProvider');
  }
  return context;
}
