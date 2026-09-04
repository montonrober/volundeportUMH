import { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { 
  Settings, 
  Calendar, 
  Mail, 
  PenTool, 
  Save, 
  Plus
} from 'lucide-react';

export function Configuracion() {
  const { config, updateConfig, addAcademicYear } = useVolunteer();
  const [newYearInput, setNewYearInput] = useState('');
  
  // Local state for edits
  const [localConfig, setLocalConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateConfig(localConfig);
      setIsSaving(false);
    }, 600);
  };

  const handleAddYear = () => {
    if (newYearInput.trim()) {
      addAcademicYear(newYearInput.trim());
      setNewYearInput('');
    }
  };

  const handleChange = (field: keyof typeof localConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#8b1820]" />
            Ajustes del Sistema
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configura parámetros globales, cursos académicos y notificaciones.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Academic Years */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            Cursos Académicos
          </h3>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: 2026-2027"
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820] focus:border-transparent"
              />
              <button
                onClick={handleAddYear}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Añadir
              </button>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 max-h-[150px] overflow-y-auto space-y-2">
              {config.availableYears.map(year => (
                <div key={year} className="flex items-center justify-between text-sm bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                  <span className="font-semibold text-gray-700">{year}</span>
                  {year === config.academicYear && (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Activo</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">Para cambiar el curso activo actual, utiliza el selector en la cabecera superior.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Mail className="w-5 h-5 text-amber-500" />
            Notificaciones
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email para Nuevas Solicitudes</label>
              <input
                type="email"
                value={localConfig.notificationEmail || ''}
                onChange={(e) => handleChange('notificationEmail', e.target.value)}
                placeholder="oficina.deportes@umh.es"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Se enviará un aviso a esta dirección cada vez que alguien rellene el formulario público.</p>
            </div>
          </div>
        </div>

        {/* Signer Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 md:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <PenTool className="w-5 h-5 text-emerald-600" />
            Parámetros de Firma (Certificados)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Firmante</label>
              <input
                type="text"
                value={localConfig.signerName}
                onChange={(e) => handleChange('signerName', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Cargo Oficial</label>
              <input
                type="text"
                value={localConfig.signerRole}
                onChange={(e) => handleChange('signerRole', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Resolución Rectoral de Delegación</label>
              <input
                type="text"
                value={localConfig.signerResolution}
                onChange={(e) => handleChange('signerResolution', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Horas por Crédito ECTS</label>
              <input
                type="number"
                value={localConfig.hoursPerEcts}
                onChange={(e) => handleChange('hoursPerEcts', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8b1820]"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
