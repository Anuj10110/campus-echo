import { Routes, Route } from 'react-router-dom';
import CampusEchoHomePage from './CampusEchoHomePage';
import CampusEchoLogin from './CampusEchoLogin';
import CampusEchoRegistration from "./CampusEchoRegistration";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Homepage should open first */}
        <Route path="/" element={<CampusEchoHomePage />} />

        {/* Login page */}
        <Route path="/login" element={<CampusEchoLogin />} />

        {/* Registration page */}
        <Route path="/register" element={<CampusEchoRegistration />} />

        {/* Protected Student Dashboard */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Faculty Dashboard */}
        <Route 
          path="/faculty/dashboard" 
          element={
            <ProtectedRoute requiredRole="FACULTY">
              <FacultyDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
