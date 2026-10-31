// src/utils/storage.js

/**
 * localStorage se data load karo. Agar nahi mila toh fallback return karo.
 */
export const loadData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to load "${key}" from storage:`, err);
    return fallback;
  }
};

/**
 * localStorage me data save karo.
 */
export const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save "${key}" to storage:`, err);
  }
};

/**
 * Ek specific key remove karo.
 */
export const removeData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Failed to remove "${key}" from storage:`, err);
  }
};

/**
 * Saara EduHub data clear karo (logout ke time use hoga nahi, sirf debug ke liye).
 */
export const clearAllData = () => {
  Object.values({
    AUTH: 'eduhub_auth',
    SUBJECTS: 'eduhub_subjects',
    RESOURCES: 'eduhub_resources',
    ANNOUNCEMENTS: 'eduhub_announcements',
  }).forEach(removeData);
};