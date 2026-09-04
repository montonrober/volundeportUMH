import { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { ColectivoType, EstadoCotejo, VolunteerSubmission } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  CheckCircle2, 
  Search, 
  Clock, 
  AlertCircle, 
  CheckCheck, 
  FileText, 
  ArrowRight,
  Send,
  Eye,
  X
} from 'lucide-react';

export function SolicitudesCotejo() {
  const { 
    submissions, 
    stats, 
    setSelectedSubmissionId, 
    issueCertificate, 
    issueBulkCertificates,
    confirmAuditAndValidate,
    updateEventAudit,
    showToast 
  } = useVolunteer();
  const navigate = useNavigate();

  const [colectivoFilter, setColectivoFilter] = useState<'all' | ColectivoType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | EstadoCotejo>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal for inspecting / editing audit breakdown for a submission
  const [inspectingSub, setInspectingSub] = useState<VolunteerSubmission | null>(null);

  // Filtered list
  const filteredSubmissions = submissions.filter((sub) => {
    const matchColectivo = colectivoFilter === 'all' || sub.colectivo === colectivoFilter;
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.nif.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.departmentOrDegree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchColectivo && matchStatus && matchSearch;
  });

  const exportToCsv = () => {
    const headers = ['Nombre', 'NIF', 'Email', 'Colectivo', 'Titulación/Dpto', 'Horas Aprobadas', 'ECTS', 'Actividades', 'Estado', 'CSV Diploma'];
    const rows = filteredSubmissions.map(s => [
      s.name,
      s.nif,
      s.email,
      s.colectivo.toUpperCase(),
      s.departmentOrDegree,
      s.hoursApproved,
      s.ectsCredits,
      s.activitiesCount,
      s.status.toUpperCase(),
      s.certificate?.csvCode || 'Pendiente'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cotejo_Voluntariado_UMH_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Base de datos exportada con éxito a formato CSV/Excel.', 'info');
  };

  const handleOpenDiploma = (subId: string) => {
    setSelectedSubmissionId(subId);
    navigate('/diplomas');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Base de Datos: Solicitudes &amp; Cotejo de Asistencia
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Validación de actas presenciales y cómputo oficial para ECTS (Estudiantes) y Evaluación del Desempeño (PTGAS y PDI).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={exportToCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Exportar Excel / CSV</span>
          </button>
          <button
            type="button"
            onClick={issueBulkCertificates}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8b1820] hover:bg-[#73131a] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Aprobación &amp; Emisión Masiva</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (matching screen (14).png and screen (6).png) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs relative overflow-hidden flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Pendientes de Cotejo
            </span>
            <div className="text-3xl font-extrabold text-gray-900 mt-2">
              {stats.pendingCotejo}
            </div>
            <span className="text-xs text-amber-600 font-medium mt-1 inline-block">
              Hojas de firmas por contrastar
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs relative overflow-hidden flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Cotejadas y Válidas
            </span>
            <div className="text-3xl font-extrabold text-gray-900 mt-2">
              {stats.validatedCount + stats.issuedCount}
            </div>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">
              Listas para firma institucional
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs relative overflow-hidden flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Diplomas Emitidos con CSV
            </span>
            <div className="text-3xl font-extrabold text-[#8b1820] mt-2">
              {stats.issuedCount}
            </div>
            <span className="text-xs text-gray-500 font-medium mt-1 inline-block">
              Enviados al correo @umh.es
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8b1820] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8b1820]"></div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <button
            type="button"
            onClick={() => setColectivoFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              colectivoFilter === 'all'
                ? 'bg-[#8b1820] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setColectivoFilter('estudiante')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              colectivoFilter === 'estudiante'
                ? 'bg-[#8b1820] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Estudiantes ({stats.studentsCount})
          </button>
          <button
            type="button"
            onClick={() => setColectivoFilter('ptgas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              colectivoFilter === 'ptgas'
                ? 'bg-[#8b1820] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            PTGAS ({stats.ptgasCount})
          </button>
          <button
            type="button"
            onClick={() => setColectivoFilter('pdi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              colectivoFilter === 'pdi'
                ? 'bg-[#8b1820] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            PDI ({stats.pdiCount})
          </button>
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por voluntario, NIF o titulación..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#8b1820] text-gray-700"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 py-1.5 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="cotejado">Cotejado con firmas</option>
            <option value="validado">Validado</option>
            <option value="pendiente">Pendiente de cotejo</option>
            <option value="emitido">Diploma emitido</option>
            <option value="discrepancia">Discrepancias</option>
          </select>
        </div>
      </div>

      {/* Main Database Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Voluntario / Identificación</th>
                <th className="py-3.5 px-4">Colectivo</th>
                <th className="py-3.5 px-4">Cómputo / Horas Acreditadas</th>
                <th className="py-3.5 px-4">Estado Cotejo</th>
                <th className="py-3.5 px-4">Trazabilidad Diploma &amp; CSV</th>
                <th className="py-3.5 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSubmissions.map((sub) => {
                const isStudent = sub.colectivo === 'estudiante';
                const initials = sub.name.split(' ').map(n => n[0]).slice(0, 2).join('');

                return (
                  <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                          sub.colectivo === 'estudiante' 
                            ? 'bg-blue-50 text-blue-700' 
                            : sub.colectivo === 'pdi' 
                            ? 'bg-purple-50 text-purple-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{sub.name}</div>
                          <div className="text-gray-400 font-mono text-[11px]">
                            {sub.nif} • {sub.departmentOrDegree}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Colectivo badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] inline-block ${
                        sub.colectivo === 'estudiante'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : sub.colectivo === 'pdi'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {sub.colectivo === 'estudiante' ? 'Estudiantado' : sub.colectivo.toUpperCase()}
                      </span>
                    </td>

                    {/* Hours / Activities */}
                    <td className="py-3.5 px-4">
                      {isStudent ? (
                        <div>
                          <span className="font-bold text-[#8b1820] text-sm">{sub.hoursApproved} Horas</span>
                          <span className="text-gray-400 text-[11px] block font-medium">
                            {sub.ectsCredits} Créditos ECTS
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-gray-900 text-sm">
                            {sub.activitiesCount} {sub.activitiesCount === 1 ? 'Actividad' : 'Actividades'}
                          </span>
                          <span className="text-gray-400 text-[11px] block font-medium">
                            Desempeño Ap. 3º
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Estado Cotejo */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        sub.status === 'cotejado'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sub.status === 'validado'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sub.status === 'emitido'
                          ? 'bg-gray-100 text-gray-800 border border-gray-200'
                          : sub.status === 'discrepancia'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          sub.status === 'cotejado' || sub.status === 'validado'
                            ? 'bg-emerald-500'
                            : sub.status === 'emitido'
                            ? 'bg-blue-500'
                            : sub.status === 'discrepancia'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                        }`}></span>
                        {sub.status === 'cotejado' && 'Cotejado'}
                        {sub.status === 'validado' && 'Validado'}
                        {sub.status === 'emitido' && 'Diploma Emitido'}
                        {sub.status === 'discrepancia' && 'Discrepancia'}
                        {sub.status === 'pendiente' && 'Pendiente Cotejo'}
                      </span>
                    </td>

                    {/* CSV and email traceability */}
                    <td className="py-3.5 px-4">
                      {sub.certificate ? (
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <span className="font-mono text-gray-800 font-semibold bg-gray-100 px-2 py-0.5 rounded border border-gray-200 inline-block w-max">
                            {sub.certificate.csvCode}
                          </span>
                          <span className="text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                            <Send className="w-3 h-3" />
                            {sub.certificate.emailSentDate || 'Enviado por email'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400">
                          <span className="text-amber-700 font-medium">⏳ Pendiente de firma y emisión</span>
                          <span className="block text-gray-400">Recibida: {sub.submissionDate}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectingSub(sub)}
                          className="px-2.5 py-1 text-xs text-gray-700 hover:text-gray-900 font-semibold border border-gray-200 bg-white hover:bg-gray-50 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          <span>Ver Cotejo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDiploma(sub.id)}
                          className="px-3 py-1 text-xs bg-[#8b1820] hover:bg-[#73131a] text-white font-bold rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{sub.status === 'emitido' ? 'Ver Diploma' : 'Emitir'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando {filteredSubmissions.length} de {submissions.length} expedientes</span>
          <div className="flex items-center gap-1 font-medium">
            <span className="px-3 py-1 rounded-lg bg-[#8b1820] text-white font-bold shadow-2xs">1</span>
          </div>
        </div>
      </div>

      {/* MODAL: VER COTEJO DETALLADO VS ACTAS */}
      {inspectingSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Cotejo de Asistencia: {inspectingSub.name}
                </h3>
                <p className="text-xs text-gray-500">
                  NIF: {inspectingSub.nif} • Colectivo: {inspectingSub.colectivo.toUpperCase()} • {inspectingSub.departmentOrDegree}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectingSub(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {inspectingSub.eventsDeclared.map((ev, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ev.eventName}</h4>
                      <p className="text-slate-500">{ev.shiftName}</p>
                      {ev.note && <p className="text-[11px] text-amber-700 mt-0.5 font-medium">{ev.note}</p>}
                    </div>
                    <span className="font-mono text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                      {ev.actaNumber || 'Acta #142'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Declaró: <strong>{ev.hoursDeclared}h</strong></span>
                      <span>→</span>
                      <div className="flex items-center gap-1">
                        <label className="font-semibold text-slate-700">Aprobar:</label>
                        <input
                          type="number"
                          min={0}
                          max={24}
                          value={ev.hoursApproved}
                          onChange={(e) => updateEventAudit(inspectingSub.id, idx, Number(e.target.value), ev.validatedForCertificate)}
                          className="w-16 h-8 text-center font-bold text-xs border border-slate-300 rounded-lg bg-white"
                        />
                        <span className="text-slate-500 font-medium">horas</span>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={ev.validatedForCertificate}
                        onChange={(e) => updateEventAudit(inspectingSub.id, idx, ev.hoursApproved, e.target.checked)}
                        className="rounded text-[#8b1820] focus:ring-[#8b1820]"
                      />
                      <span>Convalidar para diploma</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {inspectingSub.observations && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-slate-700">
                <span className="font-bold block mb-0.5">Observaciones del participante:</span>
                <p>{inspectingSub.observations}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs">
                <span className="text-gray-500">Total Validado:</span>{' '}
                <strong className="text-gray-900 text-sm">{inspectingSub.hoursApproved}h</strong>
                {inspectingSub.colectivo === 'estudiante' && (
                  <span className="text-gray-500 ml-1">({inspectingSub.ectsCredits} ECTS)</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    confirmAuditAndValidate(inspectingSub.id);
                    setInspectingSub(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Confirmar Cotejo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenDiploma(inspectingSub.id);
                    setInspectingSub(null);
                  }}
                  className="px-4 py-2 bg-[#8b1820] hover:bg-[#73131a] text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1"
                >
                  <span>Ir a Emisión</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
