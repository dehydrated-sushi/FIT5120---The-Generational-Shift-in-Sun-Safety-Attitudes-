import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navigation/Navbar'
import Home from './pages/Home/Home'
import UserSetting from './pages/UserSetting/UserSetting'
import RecommendClothingPage from './pages/RecommendClothingPage/RecommendClothingPage'
import { UVProvider } from './context/UVContext'
import Awareness from './pages/Awareness/Awareness'
import Login from './pages/Login/Login'
import './App.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <UVProvider>
      <div className="phone-shell">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserSetting /></ProtectedRoute>} />
          <Route path="/clothing" element={<ProtectedRoute><RecommendClothingPage /></ProtectedRoute>} />
          <Route path="/awareness" element={<ProtectedRoute><Awareness /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
        {!hideNavbar && <Navbar />}
      </div>
    </UVProvider>
  )
}
