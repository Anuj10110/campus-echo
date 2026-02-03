import { Routes, Route } from 'react-router-dom';
import CampusEchoHomePage from './CampusEchoHomePage';
import CampusEchoLogin from './CampusEchoLogin';
import CampusEchoRegistration from "./CampusEchoRegistration";


// Simple Login Page
const Login = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F14',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: '700'
    }}>
      Login Page
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Homepage should open first */}
      <Route path="/" element={<CampusEchoHomePage />} />

      {/* Login page */}
      <Route path="/login" element={<CampusEchoLogin />} />

      {/* Registration page */}
      <Route path="/register" element={<CampusEchoRegistration />} />
    </Routes>
  );
}

export default App;
