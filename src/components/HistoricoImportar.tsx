import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { sampleGoogleFormsCsv } from '../data';
import { 
  History, 
  Upload, 
  Download, 
  Plus, 
  CheckCircle2, 
  FileSpreadsheet, 
  FolderArchive,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export function HistoricoImportar() {
  const { 
    selectedYear, 
    setSelectedYear, 
    availableYears, 
    addAcademicYear, 
    yearSubmissions,
    yearEvents,
    importGoogleFormsCsv, 
    exportDataToCsv,
    showToast 
  } = useVolunteer();

  const [newYearInput, setNewYearInput] = useState('');
  const [csvTextInput, setCsvTextInput] = useState('');
  const [showAddYearModal, setShowAddYearModal] = useState(false);

  const handleAddNewYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;
    addAcademicYear(newYearInput.trim());
    setNewYearInput('');
    setShowAddYearModal(false);
  };

  const handleImportSample = () => {
    setCsvTextInput(sampleGoogleFormsCsv);
    showToast('Ejemplo de Google Forms cargado en el cuadro de texto.', 'info');
  };

  const handleProcessCsv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvTextInput.trim()) {
      showToast('Por favor, introduce o pega el contenido del archivo CSV.', 'warning');
      return;
    }
    const count = importGoogleFormsCsv(csvTextInput);
    if (count > 0) {
      setCsvTextInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setCsvTextInput(text);
        showToast(`Archivo "${file.name}" cargado. Pulsa "Procesar e Importar".`, 'info');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Histórico &amp; Herramientas
            </span>
            <span className="text-xs text-gray-500">• Gestión Multianual</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            Histórico de Cursos Académicos e Importación Google Forms
          </h1>
          <p className="text-xs text-gray-500">
            Cambia de curso para consultar o re-emitir certificados de años anteriores, e importa/exporta datos en Excel/CSV.
          </p>
        </div>

        {/* Academic Year Switcher */}
        <div className="bg-slate-50 border border-gray-300 rounded-xl p-2 flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-[#8b1820]" />
          <span className="text-xs font-semibold text-gray-600">Curso Activo:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-300 text-xs font-bold text-gray-900 py-1 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8b1820] cursor-pointer"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                Curso {year}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddYearModal(true)}
            className="px-2 py-1 text-xs font-bold text-[#8b1820] hover:bg-red-50 rounded-lg transition-colors"
            title="Añadir nuevo curso al histórico"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Course Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <span className="text-xs text-gray-500">Registros en Curso {selectedYear}</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{yearSubmissions.length} personas</div>
          <span className="text-[11px] text-gray-400">Entre estudiantes, PTGAS y PDI</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <span className="text-xs text-gray-500">Eventos en Curso {selectedYear}</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{yearEvents.length} eventos</div>
          <span className="text-[11px] text-gray-400">Competiciones y jornadas activas</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <span className="text-xs text-gray-500">Certificados con CSV Emitidos</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {yearSubmissions.filter(s => s.status === 'emitido').length} emitidos
          </div>
          <span className="text-[11px] text-emerald-600">Listos para entrega o descarga</span>
        </div>
      </div>

      {/* Two Columns: Import Google Forms & Export Excel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Import from Google Forms */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Importar Respuestas de Google Forms</h3>
                  <p className="text-xs text-gray-500">Archivo CSV descargado de tu formulario</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleImportSample}
                className="text-[11px] font-bold text-[#8b1820] hover:underline"
              >
                Cargar datos de ejemplo
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Descarga las respuestas de tu Google Forms en formato <strong>.CSV</strong> y súbelas aquí para incorporarlas directamente al curso <strong>{selectedYear}</strong>:
            </p>

            {/* File upload input */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
                id="google-csv-upload"
              />
              <label
                htmlFor="google-csv-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-1"
              >
                <FileSpreadsheet className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-bold text-gray-700">Seleccionar archivo .CSV de Google Forms</span>
                <span className="text-[11px] text-gray-400">o pega el texto abajo</span>
              </label>
            </div>

            {/* Textarea preview/edit */}
            <textarea
              rows={4}
              value={csvTextInput}
              onChange={(e) => setCsvTextInput(e.target.value)}
              placeholder="Pega aquí el contenido CSV o sube el archivo..."
              className="w-full p-2.5 font-mono text-[11px] rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8b1820]"
            />
          </div>

          <button
            type="button"
            onClick={handleProcessCsv}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Procesar e Importar al Curso {selectedYear}</span>
          </button>
        </div>

        {/* Box 2: Export to Excel / CSV */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Exportar Informes a Excel / CSV</h3>
                <p className="text-xs text-gray-500">Descarga los datos oficiales del curso {selectedYear}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Exporta archivos compatibles con Microsoft Excel, Google Sheets y LibreOffice para archivo técnico o envío a departamentos:
            </p>

            <div className="space-y-2.5 pt-2">
              {/* Option 1: Attendance List */}
              <button
                type="button"
                onClick={() => exportDataToCsv('asistencia')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">1. Listado Completo de Asistencia</h4>
                  <p className="text-[11px] text-gray-500">Personas, eventos, turnos asistidos y horas computadas</p>
                </div>
                <Download className="w-4 h-4 text-gray-500 shrink-0" />
              </button>

              {/* Option 2: Issued Certificates */}
              <button
                type="button"
                onClick={() => exportDataToCsv('certificados')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">2. Registro Oficial de Certificados y Códigos CSV</h4>
                  <p className="text-[11px] text-gray-500">Relación de diplomas emitidos con CSV y créditos ECTS</p>
                </div>
                <Download className="w-4 h-4 text-emerald-700 shrink-0" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Datos protegidos y clasificados por curso académico oficial.</span>
          </div>
        </div>
      </div>

      {/* Add New Academic Year Modal */}
      {showAddYearModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Añadir Curso Académico</h3>
            <p className="text-xs text-gray-500">
              Crea un nuevo año para almacenar eventos y solicitudes separadamente.
            </p>
            <form onSubmit={handleAddNewYear} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre del Curso</label>
                <input
                  type="text"
                  placeholder="Ej. 2026-2027"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#8b1820]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddYearModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8b1820] text-white font-bold hover:bg-[#73131a]"
                >
                  Añadir y Activar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
