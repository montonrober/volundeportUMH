import { EventItem, VolunteerSubmission, SystemConfig } from './types';

export const UMH_ASSETS = {
  escudoOficial: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3WJ6-NYdXsEEHpLrX9nuluMrxrlJdXPIxJIn0V1B6GfrAvj70-ZdanSmR7RDyFIsq33_LVoLrHVwoBDwlv2GPE_I7fhhiCPrnqDkAe03M_kNEioNnSJbcHk5K4d0QC75eOeBA7hXlrhuelNi0dcqD7Sv6PESAI-q3GDsfUgBglGQ0Vu-zPGBQ4mxiNzc-40cW1HNI6AMtU6eoiifwwrw2YfGSqrgqU3_iqX_8Ngj8w3PtL4ZCQbRAkv1VNNPPW44BZYA',
  bannerFooterDiploma: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBktlgidgfSfzDw7SrCR5yzmKMWYt0rLY5hKiDqsx10UNzEBBUn35MxGgWYGcl9rTwfThai75Xd9HZyx671EGz_Lbmuf10Z4y5jh6910qTGBtZ831fm3eXhkjH8Knspk2v5lomosKzGiFUTOjVecfQgzpzJlbPjpJlpl6nUjJH-t-W1O4JIMZmh4tsa7xHMeGplymOjww9vi08FoPFdEpSaH_mKB-6aN7jH5nMKceecobVKO_DWF8__cjdETWG1GNOPgO0',
  logoDeportes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkQcOrVkosKj0L1uJ3vO62TVIE05VbjF9T7-drjQGf-3AbNiDyuhFMoQHYzy9IJb8_4yqxKM3mijZXvAE8XHudsJDxtjJ-WFRKZ7h8PqgBb3NLL3WVMrxLT8vRB0V6SwXLo-KQKArqtRADI-UkKdEQysgPC_k8-kX-a5qDFRG-ChyU-dNRzAhSksfaiFos0NtzVjnW3_Gw19_Dcui3Z-KEb3b-fF339R81YL3lFPKMRjJ5Jih3hqkHEM5aC0r8fN4WmBg',
  logoSaludable: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtum-csDRJaKxcqyANQauT-Jnf8OMrP8DWaPXQ8cQ72nKiIlYM_yQGLdkmsocyM72vRkM8h47GVw5j-CtFj5giX6zm-nRVbnRiq5c1bDBOw8GkDMXRCltUBgRolqk2orsih4PYTlMXmJauXLIWtdTWnP7jE7kkpYLzKNejbw3Shp8-ljtfNyfjrOdWmW7aD2SIZoC2l55elVwcFnBCuyTXhzI6VHFyjwTyoFhHStiovKd6OlHHWZN-t3YibUKz38f0aIQ',
  logoVoluntariado: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDczURH95Gr_-oIKrtCkqkIP2y26EAE-nPeocFnW0l7UYe-TbYkGmRlGre4YCKfLXGbSvC97Zop2vMs0F9jyg-AP3Jf_-u6GLmaQsFxmwvpDN2fCU1MsyNzc-UOUS6DKPEs9J9_8g79RnRjEb8lA05xzC09pjLnCsv1M_pRFUsmb-aJtZ5_ogH-qD9oUwNAAAsBZwz3ymf-m4ksCylNrHfNonuZeWQcEEvqXhNOuW_GPOEIWVLk_4_2Mkjn7bLZTHE8e0c'
};

export const initialConfig: SystemConfig = {
  hoursPerEcts: 25,
  signerName: 'Prof. Raúl Reina Vaíllo',
  signerRole: 'Delegado del Rector de Campus Saludables y Deportes',
  signerResolution: 'Resolución Rectoral 1600/2023, de 16 de junio de 2023',
  academicYear: '2025-2026',
  availableYears: ['2025-2026', '2024-2025', '2023-2024']
};

export const availableEvents: EventItem[] = [
  {
    id: 'ev-1',
    academicYear: '2025-2026',
    name: '52ª Media Maratón Internacional de Elche',
    date: '20-22 de Febrero de 2026',
    location: 'Paseo de la Estación / Hort de Baix',
    status: 'ongoing',
    shifts: [
      {
        id: 'sh-1-1',
        name: 'Viernes 20 Feb — Feria del Corredor y Dorsales',
        date: '2026-02-20',
        hours: 5,
        description: 'Entrega de bolsa del corredor y chips'
      },
      {
        id: 'sh-1-2',
        name: 'Sábado 21 Feb — Guardarropa y Logística',
        date: '2026-02-21',
        hours: 4,
        description: 'Consigna y preparación de salida'
      },
      {
        id: 'sh-1-3',
        name: 'Domingo 22 Feb — Carrera, Avituallamiento y Meta',
        date: '2026-02-22',
        hours: 7,
        description: 'Puestos de agua, medallas y avituallamiento final'
      }
    ]
  },
  {
    id: 'ev-2',
    academicYear: '2025-2026',
    name: 'Elche Night Race 2025',
    date: '14 de Noviembre de 2025',
    location: 'Plaça de Baix / Palmeral de Elche',
    status: 'past',
    shifts: [
      {
        id: 'sh-2-1',
        name: 'Sábado 14 Nov — Control de Recorrido Nocturno y Meta',
        date: '2025-11-14',
        hours: 5,
        description: 'Seguridad de cruces y entrega de trofeos'
      }
    ]
  },
  {
    id: 'ev-3',
    academicYear: '2025-2026',
    name: 'Jornadas de Deporte Inclusivo UMH',
    date: '12-13 de Diciembre de 2025',
    location: 'Palacio de Deportes UMH / El Clot',
    status: 'past',
    shifts: [
      {
        id: 'sh-3-1',
        name: 'Jueves 12 Dic — Talleres Deporte Adaptado',
        date: '2025-12-12',
        hours: 5,
        description: 'Apoyo a deportistas con diversidad funcional'
      },
      {
        id: 'sh-3-2',
        name: 'Viernes 13 Dic — Torneo Exhibición y Clausura',
        date: '2025-12-13',
        hours: 5,
        description: 'Coordinación de partidos y protocolo de clausura'
      }
    ]
  },
  {
    id: 'ev-4',
    academicYear: '2024-2025',
    name: '51ª Media Maratón Internacional de Elche',
    date: '23-25 de Febrero de 2025',
    location: 'Elche',
    status: 'past',
    shifts: [
      {
        id: 'sh-4-1',
        name: 'Fin de semana completo — Feria y Carrera',
        date: '2025-02-24',
        hours: 12,
        description: 'Dorsales y meta'
      }
    ]
  }
];

export const initialSubmissions: VolunteerSubmission[] = [
  {
    id: 'sub-1',
    academicYear: '2025-2026',
    name: 'D. Samir',
    nif: '***6789*',
    phone: '611 23 45 67',
    email: 'samir.v@alumnos.umh.es',
    colectivo: 'estudiante',
    departmentOrDegree: 'Grado en CC. de la Actividad Física y del Deporte',
    submissionDate: '24 feb 2026, 11:20',
    hoursRequested: 50,
    hoursApproved: 50,
    ectsCredits: 2.0,
    activitiesCount: 3,
    status: 'cotejado',
    eventsDeclared: [
      {
        eventId: 'ev-1',
        eventName: '52ª Media Maratón Internacional de Elche',
        shiftId: 'sh-1-1',
        shiftName: 'Viernes 20 Feb — Feria del Corredor y Dorsales',
        shiftDate: '2026-02-20',
        hoursDeclared: 25,
        hoursApproved: 25,
        attended: true,
        actaNumber: 'Acta #142',
        note: 'Firma física comprobada en hoja de firmas El Clot',
        validatedForCertificate: true
      },
      {
        eventId: 'ev-1',
        eventName: '52ª Media Maratón Internacional de Elche',
        shiftId: 'sh-1-3',
        shiftName: 'Domingo 22 Feb — Carrera, Avituallamiento y Meta',
        shiftDate: '2026-02-22',
        hoursDeclared: 25,
        hoursApproved: 25,
        attended: true,
        actaNumber: 'Acta #142',
        note: 'Firma física comprobada',
        validatedForCertificate: true
      }
    ],
    certificate: {
      csvCode: 'CSV-UMH-2026-8A9F',
      issueDate: '25 feb 2026',
      signedBy: 'Prof. Raúl Reina Vaíllo',
      rectoralResolution: 'Resolución Rectoral 1600/2023, de 16 de junio de 2023',
      sentByEmail: true,
      emailSentDate: '25 feb 2026, 12:45'
    }
  },
  {
    id: 'sub-2',
    academicYear: '2025-2026',
    name: 'Dña. Clara',
    nif: '***4567*',
    phone: '622 34 56 78',
    email: 'clara.sanchez@umh.es',
    colectivo: 'ptgas',
    departmentOrDegree: 'Servicio de Gestión de Estudios',
    submissionDate: '24 feb 2026, 09:15',
    hoursRequested: 16,
    hoursApproved: 16,
    ectsCredits: 0,
    activitiesCount: 2,
    status: 'cotejado',
    eventsDeclared: [
      {
        eventId: 'ev-1',
        eventName: '52ª Media Maratón Internacional de Elche',
        shiftId: 'sh-1-1',
        shiftName: 'Viernes 20 Feb — Feria del Corredor y Dorsales',
        shiftDate: '2026-02-20',
        hoursDeclared: 5,
        hoursApproved: 5,
        attended: true,
        actaNumber: 'Acta #089',
        validatedForCertificate: true
      },
      {
        eventId: 'ev-2',
        eventName: 'Elche Night Race 2025',
        shiftId: 'sh-2-1',
        shiftName: 'Sábado 14 Nov — Control de Recorrido Nocturno',
        shiftDate: '2025-11-14',
        hoursDeclared: 5,
        hoursApproved: 5,
        attended: true,
        actaNumber: 'Acta #055',
        validatedForCertificate: true
      }
    ]
  },
  {
    id: 'sub-3',
    academicYear: '2025-2026',
    name: 'Dr. Carlos Miralles Soler',
    nif: '***1234*',
    phone: '633 45 67 89',
    email: 'carlos.miralles@umh.es',
    colectivo: 'pdi',
    departmentOrDegree: 'Dpto. de Arte, Humanidades y CC. Sociales',
    submissionDate: '23 feb 2026, 17:40',
    hoursRequested: 15,
    hoursApproved: 15,
    ectsCredits: 0,
    activitiesCount: 2,
    status: 'cotejado',
    eventsDeclared: [
      {
        eventId: 'ev-1',
        eventName: '52ª Media Maratón Internacional de Elche',
        shiftId: 'sh-1-2',
        shiftName: 'Sábado 21 Feb — Guardarropa y Logística',
        shiftDate: '2026-02-21',
        hoursDeclared: 4,
        hoursApproved: 4,
        attended: true,
        actaNumber: 'Acta #142',
        validatedForCertificate: true
      },
      {
        eventId: 'ev-3',
        eventName: 'Jornadas de Deporte Inclusivo UMH',
        shiftId: 'sh-3-1',
        shiftName: 'Jueves 12 Dic — Talleres Deporte Adaptado',
        shiftDate: '2025-12-12',
        hoursDeclared: 5,
        hoursApproved: 5,
        attended: true,
        actaNumber: 'Acta #077',
        validatedForCertificate: true
      }
    ]
  },
  {
    id: 'sub-4',
    academicYear: '2025-2026',
    name: 'Lucía Fernández Pérez',
    nif: '48392019-Z',
    phone: '655 98 12 34',
    email: 'lucia.fernandez@alumnos.umh.es',
    colectivo: 'estudiante',
    departmentOrDegree: 'Grado en Fisioterapia',
    submissionDate: '25 feb 2026, 08:30',
    hoursRequested: 25,
    hoursApproved: 25,
    ectsCredits: 1.0,
    activitiesCount: 1,
    status: 'pendiente',
    eventsDeclared: [
      {
        eventId: 'ev-1',
        eventName: '52ª Media Maratón Internacional de Elche',
        shiftId: 'sh-1-3',
        shiftName: 'Domingo 22 Feb — Carrera, Avituallamiento y Meta',
        shiftDate: '2026-02-22',
        hoursDeclared: 7,
        hoursApproved: 7,
        attended: true,
        actaNumber: 'Acta #142',
        validatedForCertificate: true
      }
    ]
  },
  {
    id: 'sub-5',
    academicYear: '2024-2025',
    name: 'Marcos Ruiz Campillo',
    nif: '48552190-X',
    phone: '644 11 22 33',
    email: 'marcos.ruiz@alumnos.umh.es',
    colectivo: 'estudiante',
    departmentOrDegree: 'Grado en Podología',
    submissionDate: '10 mar 2025, 14:00',
    hoursRequested: 25,
    hoursApproved: 25,
    ectsCredits: 1.0,
    activitiesCount: 1,
    status: 'emitido',
    eventsDeclared: [
      {
        eventId: 'ev-4',
        eventName: '51ª Media Maratón Internacional de Elche',
        shiftId: 'sh-4-1',
        shiftName: 'Fin de semana completo — Feria y Carrera',
        shiftDate: '2025-02-24',
        hoursDeclared: 25,
        hoursApproved: 25,
        attended: true,
        actaNumber: 'Acta #HIST-2025',
        validatedForCertificate: true
      }
    ],
    certificate: {
      csvCode: 'CSV-UMH-2025-99B2',
      issueDate: '15 mar 2025',
      signedBy: 'Prof. Raúl Reina Vaíllo',
      rectoralResolution: 'Resolución Rectoral 1600/2023, de 16 de junio de 2023',
      sentByEmail: true,
      emailSentDate: '15 mar 2025, 16:30'
    }
  }
];

export const sampleGoogleFormsCsv = `Marca temporal,Nombre y Apellidos,NIF o NIE,Correo Institucional UMH,Teléfono,Colectivo,Titulación o Departamento,Evento Asistido,Días o Turnos Asistidos,Horas Totales Estimadas
2026/02/25 10:14:00,Andrea Serrano Mora,48991234-A,andrea.serrano@alumnos.umh.es,622114477,estudiante,Grado en Farmacia,52ª Media Maratón Internacional de Elche,Viernes 20 Feb (5h); Domingo 22 Feb (7h),12
2026/02/25 11:30:15,Vicente Pascual Belda,21445588-P,vicente.pascual@umh.es,633998811,ptgas,Servicio de Mantenimiento y Campus,Elche Night Race 2025,Sábado 14 Nov - Control de Recorrido (5h),5
2026/02/25 12:05:40,Dra. Belén Orts Ramos,74112233-M,belen.orts@umh.es,655447722,pdi,Dpto. de Psicología de la Salud,Jornadas de Deporte Inclusivo UMH,Jueves 12 Dic (5h); Viernes 13 Dic (5h),10
`;
