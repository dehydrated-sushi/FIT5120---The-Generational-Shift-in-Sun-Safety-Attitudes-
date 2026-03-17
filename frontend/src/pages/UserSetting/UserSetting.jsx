// pages/UserSetting/UserSetting.jsx
import { useState } from 'react';
import './UserSetting.css';

export default function UserSetting() {
  const [name, setName] = useState('Zedong');
  const [location, setLocation] = useState('Use current location');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [uvNotification, setUvNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    localStorage.setItem('userSettings', JSON.stringify({
      name, location, temperatureUnit, uvNotification, darkMode,
    }));
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="setting-root">
      <div className="setting-scroll">

        {/* ── Header ── */}
        <div className="setting-header">
          <span className="setting-page-label">Preferences</span>
          <h1 className="setting-title">Settings</h1>
          <p className="setting-subtitle">Manage your personal preferences for UVGuard.</p>
        </div>

        {/* ── Profile ── */}
        <p className="setting-section-label">Profile</p>
        <div className="setting-field">
          <label className="setting-label">Display Name</label>
          <input
            className="setting-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* ── Location ── */}
        <p className="setting-section-label">Location</p>
        <div className="setting-field">
          <label className="setting-label">Location Preference</label>
          <select
            className="setting-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option>Use current location</option>
            <option>Enter location manually</option>
          </select>
        </div>

        {/* ── Units ── */}
        <p className="setting-section-label">Units</p>
        <div className="setting-field">
          <label className="setting-label">Temperature Unit</label>
          <select
            className="setting-input"
            value={temperatureUnit}
            onChange={(e) => setTemperatureUnit(e.target.value)}
          >
            <option>Celsius</option>
            <option>Fahrenheit</option>
          </select>
        </div>

        {/* ── Notifications ── */}
        <p className="setting-section-label">Notifications</p>
        <div className="setting-toggle">
          <div className="toggle-text">
            <p className="toggle-title">UV Alert Notifications</p>
            <p className="toggle-desc">Get reminders when UV levels become dangerous.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={uvNotification}
              onChange={() => setUvNotification(!uvNotification)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* ── Display ── */}
        <p className="setting-section-label">Display</p>
        <div className="setting-toggle">
          <div className="toggle-text">
            <p className="toggle-title">Dark Mode</p>
            <p className="toggle-desc">Use a darker interface for comfortable viewing.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* ── Save ── */}
        <button className="setting-btn" onClick={handleSave}>
          Save Settings
        </button>

        {saved && (
          <div className="setting-success">
            <span>✓</span> Settings saved successfully.
          </div>
        )}

        <p className="setting-footer">UVGuard · Your data stays on your device</p>

      </div>
    </div>
  );
}