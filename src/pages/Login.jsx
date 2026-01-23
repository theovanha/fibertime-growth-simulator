import { useState, useEffect, useRef } from 'react';
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import vanhaLogo from '../assets/vanha-logo-white.png';
import fibertimeLogo from '../assets/fibertime-logo.png';

export function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // #region agent log
  const fibertimeRef = useRef(null);
  const vanhaRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (fibertimeRef.current && vanhaRef.current && containerRef.current) {
      const ftRect = fibertimeRef.current.getBoundingClientRect();
      const vhRect = vanhaRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const ftComputed = window.getComputedStyle(fibertimeRef.current);
      const vhComputed = window.getComputedStyle(vanhaRef.current);
      
      fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:mounted',message:'Logo dimensions on mount',data:{fibertime:{width:ftRect.width,height:ftRect.height,naturalWidth:fibertimeRef.current.naturalWidth,naturalHeight:fibertimeRef.current.naturalHeight,computedHeight:ftComputed.height},vanha:{width:vhRect.width,height:vhRect.height,naturalWidth:vanhaRef.current.naturalWidth,naturalHeight:vanhaRef.current.naturalHeight,computedHeight:vhComputed.height},container:{width:containerRect.width,height:containerRect.height}},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B,C'})}).catch(()=>{});
    }
  }, []);
  // #endregion

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:entry',message:'Login attempt started',data:{isDev:window.location.hostname==='localhost',hostname:window.location.hostname},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,D'})}).catch(()=>{});
    // #endregion

    try {
      // Local development fallback (default password: demo2026)
      const isDevelopment = window.location.hostname === 'localhost';
      
      if (isDevelopment && password === 'demo2026') {
        // #region agent log
        fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:devMode',message:'Dev mode login success',data:{tokenSet:true},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,C'})}).catch(()=>{});
        // #endregion
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.setItem('auth_token', 'dev_token_' + Date.now());
        onLogin();
        setIsLoading(false);
        return;
      }

      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:beforeFetch',message:'Calling production API',data:{url:'/api/auth/login'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      // Call auth API for production
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:afterFetch',message:'API response received',data:{responseOk:response.ok,status:response.status,dataSuccess:data.success,hasToken:!!data.token,dataKeys:Object.keys(data)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,D'})}).catch(()=>{});
      // #endregion

      if (response.ok && data.success) {
        // #region agent log
        fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:beforeOnLogin',message:'About to call onLogin callback',data:{tokenStored:!!localStorage.getItem('auth_token')},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B,C'})}).catch(()=>{});
        // #endregion
        // Store session token
        localStorage.setItem('auth_token', data.token);
        onLogin();
        // #region agent log
        fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:afterOnLogin',message:'onLogin callback completed',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B'})}).catch(()=>{});
        // #endregion
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:loginFailed',message:'Login failed',data:{responseOk:response.ok,dataSuccess:data.success},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        setError('Invalid access code. Please try again.');
        setPassword('');
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/150fb983-4dc4-4174-a2e2-b2de1b9cdad7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.jsx:handleSubmit:error',message:'Login error caught',data:{error:err.message,errorType:err.constructor.name},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
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
          <div ref={containerRef} className="flex flex-col items-center justify-center gap-2">
            <img ref={fibertimeRef} src={fibertimeLogo} alt="FiberTime" className="h-8 object-contain" />
            <span className="text-white/20 text-sm">×</span>
            <img ref={vanhaRef} src={vanhaLogo} alt="Vanha" className="h-14 object-contain" />
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your access code"
                disabled={isLoading}
                className="form-input pr-12"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-white/40 hover:text-white/60" />
                ) : (
                  <Eye className="w-5 h-5 text-white/40 hover:text-white/60" />
                )}
              </button>
            </div>
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
