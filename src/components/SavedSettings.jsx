import { useState, useEffect } from 'react';
import { Save, ChevronDown, ChevronUp, Trash2, Play, AlertCircle, Loader } from 'lucide-react';
import { SaveModal } from './SaveModal';
import { saveSettings, fetchAllSettings, deleteSettings } from '../services/settingsService';

export function SavedSettings({ currentSettings, onLoadSettings }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSettings, setSavedSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // ID of setting to delete

  // Load saved settings when component mounts or when expanded
  useEffect(() => {
    if (isExpanded) {
      loadSettings();
    }
  }, [isExpanded]);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchAllSettings();
    
    if (result.success) {
      setSavedSettings(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleSave = async (name) => {
    setIsSaving(true);
    const result = await saveSettings(name, currentSettings);
    
    if (result.success) {
      setIsModalOpen(false);
      await loadSettings(); // Refresh list
    } else {
      setError(result.error);
    }
    setIsSaving(false);
  };

  const handleLoad = (settingsData) => {
    onLoadSettings(settingsData);
  };

  const handleDelete = async (id) => {
    const result = await deleteSettings(id);
    
    if (result.success) {
      setDeleteConfirm(null);
      await loadSettings(); // Refresh list
    } else {
      setError(result.error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-yellow/20 via-yellow/10 to-transparent border-l-2 border-yellow group"
      >
        <div className="flex items-center gap-2">
          <Save className="w-4 h-4 text-yellow flex-shrink-0" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Saved Settings
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Save Current Settings Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-4 bg-cyan/10 hover:bg-cyan/20 border border-cyan/40 rounded-lg text-cyan text-xs font-semibold transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          Save Current Settings
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-5 h-5 text-cyan animate-spin" />
          </div>
        )}

        {/* Saved Settings List */}
        {!isLoading && savedSettings.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-white/40">No saved settings yet</p>
            <p className="text-xs text-white/30 mt-1">Save your first configuration above</p>
          </div>
        )}

        {!isLoading && savedSettings.length > 0 && (
          <div className="space-y-2">
            {savedSettings.map((setting) => (
              <div
                key={setting.id}
                className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan/30 transition-all group"
              >
                {deleteConfirm === setting.id ? (
                  // Delete Confirmation
                  <div className="space-y-2">
                    <p className="text-xs text-white/80">Delete "{setting.name}"?</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(setting.id)}
                        className="flex-1 px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/20 text-white/70 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal View
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{setting.name}</h4>
                        <p className="text-xs text-white/40">{formatDate(setting.created_at)}</p>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(setting.id)}
                        className="p-1.5 rounded hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleLoad(setting.settings_data)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 rounded text-cyan text-xs font-medium transition-all"
                    >
                      <Play className="w-3 h-3" />
                      Load Settings
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Modal */}
      <SaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
