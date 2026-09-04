import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VolunteerProvider } from './context/VolunteerContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { PublicLayout } from './components/PublicLayout';
import { StudentForm } from './components/StudentForm';
import { Dashboard } from './components/Dashboard';
import { AttendanceManager } from './components/AttendanceManager';
import { DiplomasEmision } from './components/DiplomasEmision';
import { HistoricoImportar } from './components/HistoricoImportar';
import { Configuracion } from './components/Configuracion';
import { EventsManager } from './components/EventsManager';
import { LoginScreen } from './components/LoginScreen';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/formulario" replace />;
  
  return <>{children}</>;
}

function ProtectedPublicRoute({ children }: { children: React.ReactNode }) {
  // We no longer require auth for the public form.
  return <>{children}</>;
}

function MainApp() {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Cargando...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={isAdmin ? "/" : "/formulario"} replace /> : <LoginScreen />} />
      
      {/* Public Route for Students/Staff */}
      <Route element={<ProtectedPublicRoute><PublicLayout /></ProtectedPublicRoute>}>
        <Route path="/formulario" element={<StudentForm />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="asistencia" element={<AttendanceManager />} />
        <Route path="certificados" element={<DiplomasEmision />} />
        <Route path="historico" element={<HistoricoImportar />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="eventos" element={<EventsManager />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VolunteerProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </VolunteerProvider>
    </AuthProvider>
  );
}
