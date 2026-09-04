export type ColectivoType = 'estudiante' | 'ptgas' | 'pdi' | 'otro';

export type EstadoCotejo = 'cotejado' | 'validado' | 'pendiente' | 'discrepancia' | 'emitido';

export interface EventShift {
  id: string;
  name: string;
  date: string;
  hours: number;
  location?: string;
  description?: string;
}

export interface EventItem {
  id: string;
  academicYear: string;
  name: string;
  date: string;
  location: string;
  shifts: EventShift[];
  status?: 'upcoming' | 'ongoing' | 'past';
}

export interface VolunteerEventParticipation {
  eventId: string;
  eventName: string;
  shiftId?: string;
  shiftName: string;
  shiftDate?: string;
  hoursDeclared: number;
  hoursApproved: number;
  attended: boolean; // checked if student/worker attended that day
  actaNumber?: string;
  note?: string;
  validatedForCertificate: boolean;
}

export interface VolunteerSubmission {
  id: string;
  academicYear: string; // e.g. "2025-2026", "2024-2025"
  name: string;
  nif: string;
  phone: string;
  email: string;
  colectivo: ColectivoType;
  departmentOrDegree: string;
  submissionDate: string;
  hoursRequested: number;
  hoursApproved: number;
  ectsCredits: number;
  activitiesCount: number;
  eventsDeclared: VolunteerEventParticipation[];
  status: EstadoCotejo;
  certificate?: {
    csvCode: string;
    issueDate: string;
    signedBy: string;
    rectoralResolution: string;
    sentByEmail: boolean;
    emailSentDate?: string;
  };
  observations?: string;
}

export interface SystemConfig {
  hoursPerEcts: number;
  signerName: string;
  signerRole: string;
  signerResolution: string;
  academicYear: string;
  availableYears: string[];
  notificationEmail?: string;
}
