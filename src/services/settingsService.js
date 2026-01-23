import { supabase } from '../utils/supabase';

/**
 * Save a new settings configuration to the database
 * @param {string} name - Name for the saved settings (max 15 chars)
 * @param {Object} settingsData - The settings object to save
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function saveSettings(name, settingsData) {
  try {
    const { data, error } = await supabase
      .from('saved_settings')
      .insert([
        {
          name: name.slice(0, 15), // Ensure max 15 chars
          settings_data: settingsData,
        },
      ])
      .select();

    if (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error saving settings:', err);
    return { success: false, error: 'Failed to save settings. Please try again.' };
  }
}

/**
 * Fetch all saved settings from the database, ordered by most recent
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function fetchAllSettings() {
  try {
    const { data, error } = await supabase
      .from('saved_settings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Unexpected error fetching settings:', err);
    return { success: false, error: 'Failed to load saved settings. Please try again.' };
  }
}

/**
 * Delete a saved settings configuration
 * @param {string} id - UUID of the settings to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteSettings(id) {
  try {
    const { error } = await supabase
      .from('saved_settings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error deleting settings:', err);
    return { success: false, error: 'Failed to delete settings. Please try again.' };
  }
}
