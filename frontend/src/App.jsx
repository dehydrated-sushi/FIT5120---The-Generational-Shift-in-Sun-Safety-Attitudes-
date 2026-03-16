import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navigation/Navbar'
import Home from './pages/Home/Home'
import UserSetting from './pages/UserSetting/UserSetting'
import RecommendClothingPage from './pages/RecommendClothingPage/RecommendClothingPage'
import { UVProvider } from './context/UVContext'
import Awareness from './pages/Awareness/Awareness'
import UVTracker from './pages/UVTracker/UVTracker'
import './App.css'

export default function App() {
  return (
    <UVProvider>
      <div className="phone-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<UserSetting />} />
          <Route path="/prevention" element={<RecommendClothingPage />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/uv-tracker" element={<UVTracker />} />
        </Routes>
        <Navbar />
      </div>
    </UVProvider>
  )
}
