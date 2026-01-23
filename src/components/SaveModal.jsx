import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export function SaveModal({ isOpen, onClose, onSave, isSaving }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter a name for your settings');
      return;
    }
    
    if (trimmedName.length > 15) {
      setError('Name must be 15 characters or less');
      return;
    }

    onSave(trimmedName);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Save Settings</h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="setting-name" className="block text-sm text-white/80 mb-2">
              Setting Name
            </label>
            <div className="relative">
              <input
                id="setting-name"
                type="text"
                value={name}
                onChange={handleNameChange}
                maxLength={15}
                placeholder="e.g., High Growth"
                disabled={isSaving}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan/50 disabled:opacity-50"
                autoFocus
              />
              <span className="absolute right-3 top-2 text-xs text-white/40">
                {name.length}/15
              </span>
            </div>
            {error && (
              <p className="mt-1 text-xs text-red-400">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="btn-gradient flex items-center gap-2 text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
