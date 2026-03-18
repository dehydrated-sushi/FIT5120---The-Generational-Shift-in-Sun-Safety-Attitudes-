import { useState } from 'react';
import './UserSetting.css';

export default function UserSetting() {
  const savedData = JSON.parse(localStorage.getItem('userSettings') || '{}');

  const [name, setName] = useState(savedData.name || '');
  const [location, setLocation] = useState(savedData.location || 'Use current location');
  const [skinType, setSkinType] = useState(savedData.skinType || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    localStorage.setItem('userSettings', JSON.stringify({
      name, location, skinType,
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

        {/* ── Skin Type ── */}
        <p className="setting-section-label">Skin Type</p>
        <div className="setting-field">
            <label className="setting-label">Your Skin Type</label>
            <select
                className="setting-input"
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
            >
                <option value="">Select skin type</option>
                <option value="1">Type I – Very Fair</option>
                <option value="2">Type II – Fair</option>
                <option value="3">Type III – Medium</option>
                <option value="4">Type IV – Olive</option>
                <option value="5">Type V – Brown</option>
                <option value="6">Type VI – Dark</option>
            </select>
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