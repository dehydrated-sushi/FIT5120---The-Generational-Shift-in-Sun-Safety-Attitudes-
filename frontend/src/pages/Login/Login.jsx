import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/api';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post(ENDPOINTS.AUTH_LOGIN, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-brand">
        <span className="login-brand__icon">☀</span>
        UVGuard
      </div>

      <div className="login-card">
        <div className="login-header">
          <span className="login-page-label">Team Access</span>
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">
            Access restricted to project team members.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-section">
            <label className="login-label">Username</label>
            <input
              className="login-input"
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="login-section">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="login-message login-message--error">
              {error}
            </div>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
