import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VolunteerProvider } from './context/VolunteerContext';
import { AdminLayout } from './components/AdminLayout';
import { PublicLayout } from './components/PublicLayout';
import { StudentForm } from './components/StudentForm';
import { Dashboard } from './components/Dashboard';
import { AttendanceManager } from './components/AttendanceManager';
import { DiplomasEmision } from './components/DiplomasEmision';
import { HistoricoImportar } from './components/HistoricoImportar';
import { Configuracion } from './components/Configuracion';
import { EventsManager } from './components/EventsManager';

export default function App() {
  return (
    <VolunteerProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route for Students/Staff */}
          <Route element={<PublicLayout />}>
            <Route path="/formulario" element={<StudentForm />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="asistencia" element={<AttendanceManager />} />
            
            {/* Admin Certificate Preview & Download */}
            <Route path="certificados" element={<DiplomasEmision />} />
            
            {/* Historic academic years, Google Forms CSV importer & Excel exporter */}
            <Route path="historico" element={<HistoricoImportar />} />

            {/* Admin Configuration for Years, Emails, and Signatures */}
            <Route path="configuracion" element={<Configuracion />} />

            {/* Admin Event CRUD */}
            <Route path="eventos" element={<EventsManager />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VolunteerProvider>
  );
}
