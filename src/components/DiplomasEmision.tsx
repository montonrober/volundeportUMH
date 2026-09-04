import { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { UMH_ASSETS } from '../data';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Printer, 
  FolderArchive,
  Eye,
  Sparkles, 
  ShieldCheck,
  Calendar,
  Table,
  Search,
  Send
} from 'lucide-react';

export function DiplomasEmision() {
  const { 
    yearSubmissions,
    selectedYear,
    selectedSubmissionId, 
    setSelectedSubmissionId, 
    config, 
    issueCertificate,
    issueAllPendingCertificates,
    markCertificateAsSent,
    exportDataToCsv,
    showToast
  } = useVolunteer();

  const [activeTab, setActiveTab] = useState<'pendientes' | 'enviados'>('pendientes');
  const [filterMode, setFilterMode] = useState<'all' | 'estudiante' | 'personal'>('all');
  const [search, setSearch] = useState('');

  const availableSubs = yearSubmissions.filter(sub => {
    if (filterMode !== 'all') {
      if (filterMode === 'estudiante' && sub.colectivo !== 'estudiante') return false;
      if (filterMode === 'personal' && sub.colectivo === 'estudiante') return false;
    }
    
    // Tab filter
    const isSent = !!sub.certificate?.sentByEmail;
    if (activeTab === 'pendientes' && isSent) return false;
    if (activeTab === 'enviados' && !isSent) return false;

    const matchesSearch = 
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.nif.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  const currentIndex = availableSubs.findIndex(s => s.id === selectedSubmissionId);
  const currentSub = availableSubs[currentIndex >= 0 ? currentIndex : 0] || yearSubmissions[0];

  const handleNavigate = (direction: number) => {
    let nextIdx = currentIndex + direction;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= availableSubs.length) nextIdx = availableSubs.length - 1;
    if (availableSubs[nextIdx]) {
      setSelectedSubmissionId(availableSubs[nextIdx].id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadZip = () => {
    showToast(`Generando lote completo de diplomas en ZIP (${availableSubs.length} archivos para el curso ${selectedYear})...`, 'info');
    setTimeout(() => {
      showToast(`Descarga completada: Lote_Diplomas_UMH_${selectedYear}.zip`, 'success');
    }, 1500);
  };

  if (!currentSub) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
        <p className="text-gray-500">No hay solicitudes registradas en el Curso {selectedYear}.</p>
      </div>
    );
  }

  const isStudent = currentSub.colectivo === 'estudiante';
  const validatedEvents = currentSub.eventsDeclared.filter(e => e.attended && e.validatedForCertificate);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-[#8b1820]">
              Curso {selectedYear}
            </span>
            <span className="text-xs text-gray-500">• Expedición Oficial de Certificados</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            Informes y Certificados Oficiales de Voluntariado
          </h1>
          <p className="text-xs text-gray-500">
            Visualiza y descarga el diploma de cada voluntario en PDF oficial o emite todos en bloque.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={issueAllPendingCertificates}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Emitir Todos los Pendientes</span>
          </button>

          <button
            type="button"
            onClick={() => exportDataToCsv('certificados')}
            className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Table className="w-4 h-4 text-emerald-700" />
            <span>Exportar Registro Excel</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: LIST AND ACTIONS (5 COLS) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Box 3: All Expedientes List with Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col flex-1 min-h-[500px]">
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Voluntarios del Curso {selectedYear}
                </h4>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {availableSubs.length} personas
                </span>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('pendientes')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeTab === 'pendientes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('enviados')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeTab === 'enviados' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Completados
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar voluntario..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b1820]"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100 overflow-y-auto flex-1 p-2 max-h-[500px]">
              {availableSubs.map((sub, idx) => {
                const isActive = sub.id === currentSub.id;
                const isSent = sub.certificate?.sentByEmail;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                    className={`p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors flex flex-col justify-between gap-1 mb-1 ${
                      isActive ? 'bg-red-50/40 border border-[#8b1820]' : 'border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {idx + 1}. {sub.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          NIF: {sub.nif}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#8b1820] shrink-0">
                        {sub.hoursApproved} h
                      </span>
                    </div>

                    <div className="flex justify-between items-end mt-1">
                      <div className="flex flex-col text-[10px]">
                        <span className="text-gray-400">Solicitado: {sub.submissionDate.split(',')[0]}</span>
                        {isSent && <span className="text-blue-600 font-semibold">Enviado: {sub.certificate?.emailSentDate?.split(',')[0]}</span>}
                      </div>
                      <p className={`text-[10px] font-semibold flex items-center justify-end gap-1 px-1.5 py-0.5 rounded-md ${
                        isSent ? 'bg-blue-50 text-blue-700' : sub.status === 'emitido' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {isSent ? (
                          <><Send className="w-3 h-3" /> <span>Enviado</span></>
                        ) : sub.status === 'emitido' ? (
                          <><CheckCircle2 className="w-3 h-3" /> <span>Emitido</span></>
                        ) : (
                          <span>Validado</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
              {availableSubs.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-500">
                  No se encontraron resultados para esta pestaña.
                </div>
              )}
            </div>
          </div>

          {/* Box 1: Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8b1820]" />
              <span>Acciones para {currentSub.name}</span>
            </h3>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => issueCertificate(currentSub.id)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Generar Certificado Oficial PDF</span>
              </button>

              <button
                type="button"
                onClick={() => markCertificateAsSent(currentSub.id)}
                disabled={!!currentSub.certificate?.sentByEmail || !currentSub.certificate}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs ${
                  !currentSub.certificate 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : currentSub.certificate?.sentByEmail 
                    ? 'bg-blue-50 text-blue-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{!currentSub.certificate ? 'Requiere Generar PDF Primero' : currentSub.certificate?.sentByEmail ? 'Ya Enviado al Voluntario' : 'Marcar como Enviado al Voluntario'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full bg-slate-900 hover:bg-black text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Descargar PDF Individual</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: OFFICIAL A4 DIPLOMA PREVIEW (7 COLS) */}
        <section className="lg:col-span-7 flex flex-col items-center">
          
          {/* Sub-header controls */}
          <div className="w-full max-w-[640px] flex items-center justify-between gap-2 mb-3 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs text-xs">
            <button
              type="button"
              disabled={currentIndex <= 0}
              onClick={() => handleNavigate(-1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[11px]">Expediente:</span>
              <select
                value={currentSub.id}
                onChange={(e) => setSelectedSubmissionId(e.target.value)}
                className="text-xs py-1 px-2.5 rounded-lg border border-gray-300 bg-white font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8b1820] cursor-pointer max-w-[200px] sm:max-w-none truncate"
              >
                {availableSubs.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {idx + 1}. {s.name} ({s.colectivo.toUpperCase()} - {s.hoursApproved}h)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={currentIndex >= availableSubs.length - 1}
              onClick={() => handleNavigate(1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition-colors disabled:opacity-40"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* DIN-A4 Badge */}
          <div className="w-full max-w-[640px] flex items-center justify-between text-[11px] font-medium text-gray-500 px-1 mb-1.5">
            <span className="flex items-center gap-1 font-semibold text-gray-700">
              <Eye className="w-3.5 h-3.5 text-[#8b1820]" />
              Formato Oficial DIN-A4 Vertical
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="text-[#8b1820] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Guardar como PDF
            </button>
          </div>

          {/* ======================================================== */}
          {/* THE AUTHENTIC A4 OFFICIAL UMH DIPLOMA DOCUMENT REPLICA  */}
          {/* ======================================================== */}
          <div 
            id="certificate-print-area"
            className="w-full max-w-[640px] min-h-[900px] bg-white text-slate-900 border border-gray-200 rounded-lg p-10 sm:p-14 shadow-lg flex flex-col justify-between relative overflow-hidden select-none"
            style={{ aspectRatio: '1 / 1.414' }}
          >
            {/* Top Seal & Opening */}
            <div className="flex flex-col items-center text-center">
              {/* Official UMH Round Seal */}
              <div className="mb-5 pt-1">
                <img 
                  src={UMH_ASSETS.escudoOficial} 
                  alt="Escudo Oficial UMH" 
                  className="w-22 h-22 object-contain mx-auto"
                />
              </div>

              {/* Protocol Ceremony Formula */}
              <div className="font-serif text-[13px] leading-relaxed text-slate-900 max-w-lg mb-5 space-y-0.5">
                <p>El Sr. Rector Magfco. de la Universidad Miguel Hernández,</p>
                <p>y en su nombre,</p>
                <p className="font-semibold text-slate-900">{config.signerRole}</p>
                <p>otorga a</p>
              </div>

              {/* Recipient Full Name & Official NIF */}
              <div className="my-2 text-center">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-1">
                  {currentSub.name}
                </h2>
                <p className="font-serif text-[13px] text-slate-800 tracking-wide">
                  Con NIF: <strong className="font-mono">{currentSub.nif}</strong>
                </p>
              </div>

              {/* Main Certification Text */}
              <div className="mt-5 mb-4 text-center font-serif text-[13px] leading-relaxed text-slate-900 max-w-lg">
                {isStudent ? (
                  // ESTUDIANTE TEXT
                  <p>
                    Diploma acreditativo de su participación, el curso académico <strong className="text-slate-900">{selectedYear}</strong>,
                    en el Programa <strong className="font-bold text-[#8b1820]">#VoluntariadoDeportivoUMH</strong>, por el que se acreditan <strong className="text-slate-900 font-bold">{currentSub.hoursApproved} horas</strong> de participación efectiva para su reconocimiento como <strong className="text-slate-900">créditos de competencias transversales y profesionales</strong> ({currentSub.ectsCredits} ECTS).
                  </p>
                ) : (
                  // PTGAS / PDI TEXT
                  <div className="space-y-2.5">
                    <p>
                      Diploma acreditativo de su participación, el año <strong className="text-slate-900 font-bold">{selectedYear}</strong>, en los siguientes Eventos del Programa <strong className="font-bold text-[#8b1820]">#VoluntariadoDeportivoUMH</strong>, por el que se le reconoce <strong className="text-slate-900 font-bold">{currentSub.activitiesCount} actividades</strong> dentro del apartado 3º de “actividades protocolarias, científicas, de cultura y competiciones deportivas, en representación de la Universidad” de la Evaluación del Desempeño de la UMH:
                    </p>

                    <div className="py-2 space-y-1 text-center">
                      {validatedEvents.map((ev, i) => (
                        <p key={i} className="font-bold text-[#8b1820] text-[13px] tracking-wide font-serif">
                          {ev.eventName}
                        </p>
                      ))}
                      {validatedEvents.length === 0 && (
                        <p className="text-xs text-gray-400 italic">No hay actividades convalidadas aún</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Signature & Logos */}
            <div className="w-full flex flex-col items-center">
              <div className="w-full text-center font-serif text-xs leading-relaxed text-slate-900 mb-4 pt-2">
                <p>Firmado electrónicamente por <span className="font-bold">{config.signerName}</span></p>
                <p>{config.signerRole}</p>
                <p className="text-[11px] text-gray-500">({config.signerResolution})</p>
              </div>

              {/* Footer Logos Banner */}
              <div className="w-full max-w-md my-2 flex justify-center">
                <img 
                  src={UMH_ASSETS.bannerFooterDiploma} 
                  alt="Logotipos Oficiales UMH"
                  className="w-full h-auto max-h-12 object-contain"
                />
              </div>

              {/* Official Address */}
              <div className="text-center font-sans text-[8px] uppercase tracking-wider text-slate-700 font-bold mt-1 space-y-0.5">
                <p>OFICINA DE CAMPUS SALUDABLES Y DEPORTES</p>
                <p className="font-normal text-slate-600">Complejo de Formación Deporte El Clot • Avda. de la Universidad, s/n - 03202 ELCHE</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
