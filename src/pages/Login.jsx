import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import vanhaLogo from '../assets/vanha-logo-white.png';
import fibertimeLogo from '../assets/fibertime-logo.png';

export function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Local development fallback (default password: demo2026)
      const isDevelopment = window.location.hostname === 'localhost';
      
      if (isDevelopment && password === 'demo2026') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.setItem('auth_token', 'dev_token_' + Date.now());
        onLogin();
        setIsLoading(false);
        return;
      }

      // Call auth API for production
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store session token
        localStorage.setItem('auth_token', data.token);
        onLogin();
      } else {
        setError('Invalid access code. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Co-branding Header */}
        <div className="login-branding">
          <div className="flex items-center justify-center">
            <img src={fibertimeLogo} alt="FiberTime" className="h-10 object-contain" />
            <span className="text-white/30 text-xl mx-3">×</span>
            <img src={vanhaLogo} alt="Vanha" className="h-10 object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="login-header">
          <div className="login-icon">
            <Lock className="w-6 h-6 text-cyan animate-pulse-slow" />
          </div>
          <h2 className="login-title">Growth Simulation Model</h2>
          <p className="login-subtitle">Secure Demo Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Access Code
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your access code"
              disabled={isLoading}
              className="form-input"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="login-button"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-navy border-t-transparent rounded-full"></span>
                Validating...
              </>
            ) : (
              'Access Demo'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p className="text-xs text-white/30">
            Professional Growth Modeling • Secure Access
          </p>
        </div>
      </div>
    </div>
  );
}
