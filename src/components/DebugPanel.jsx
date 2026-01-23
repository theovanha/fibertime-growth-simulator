import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Copy, Trash2, X } from 'lucide-react';

// Global log buffer to capture logs before component mounts
const globalLogBuffer = [];

// Intercept console.log immediately (before React even starts)
if (typeof window !== 'undefined' && !window.__debugPanelInitialized) {
  window.__debugPanelInitialized = true;
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = function(...args) {
    originalLog.apply(console, args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    globalLogBuffer.push({ timestamp, message, type: 'log' });
  };

  console.error = function(...args) {
    originalError.apply(console, args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    globalLogBuffer.push({ timestamp, message: `❌ ERROR: ${message}`, type: 'error' });
  };

  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    globalLogBuffer.push({ 
      timestamp, 
      message: `❌ UNHANDLED ERROR: ${event.message} at ${event.filename}:${event.lineno}`, 
      type: 'error' 
    });
  });
}

export function DebugPanel() {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Load buffered logs
    if (globalLogBuffer.length > 0) {
      setLogs([...globalLogBuffer]);
    }

    // Set up periodic sync with global buffer
    const interval = setInterval(() => {
      if (globalLogBuffer.length > logs.length) {
        setLogs([...globalLogBuffer]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [logs.length]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isExpanded && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  const handleCopy = () => {
    const logText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(logText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleClear = () => {
    setLogs([]);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-[9999] bg-yellow/90 hover:bg-yellow text-navy px-3 py-2 rounded-lg shadow-xl font-semibold text-xs flex items-center gap-2 transition-all"
        title="Open Debug Panel"
      >
        <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        Debug Logs ({logs.length})
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-navy/95 backdrop-blur-sm border-2 border-cyan/40 rounded-lg shadow-2xl w-96 max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan/30 bg-cyan/10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-cyan font-semibold text-sm">Debug Logs ({logs.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4 text-white/60" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Copy all logs"
          >
            <Copy className="w-4 h-4 text-white/60" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronUp className="w-4 h-4 text-white/60" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Minimize"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Copy Success Message */}
      {copySuccess && (
        <div className="px-3 py-1 bg-green-500/20 border-b border-green-500/30 text-green-400 text-xs">
          ✓ Copied to clipboard!
        </div>
      )}

      {/* Logs Container */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-mono max-h-[400px]">
          {logs.length === 0 ? (
            <div className="text-white/40 text-center py-8">
              No debug logs yet. Interact with the app to see logs.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="text-white/70 leading-relaxed border-b border-white/5 pb-1">
                <span className="text-cyan/60">[{log.timestamp}]</span> {log.message}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      )}

      {/* Collapsed Preview */}
      {!isExpanded && logs.length > 0 && (
        <div className="px-3 py-2 text-xs font-mono text-white/50 truncate">
          {logs[logs.length - 1].message.substring(0, 50)}...
        </div>
      )}
    </div>
  );
}
