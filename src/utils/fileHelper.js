// src/utils/fileHelper.js

/**
 * File object ko Base64 data URL me convert karo (async).
 * @param {File} file - Browser File object
 * @returns {Promise<string>} Base64 data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Bytes ko human-readable size me convert karo.
 * @param {number} bytes
 * @returns {string} e.g., "2.4 MB"
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Base64 data URL ko download trigger karo.
 * @param {string} base64Data - data:application/pdf;base64,...
 * @param {string} fileName - e.g., "notes.pdf"
 */
export const downloadFile = (base64Data, fileName) => {
  if (!base64Data) {
    alert('File data not available. This is a demo file.');
    return;
  }
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Sirf PDF files allowed hain — validate karo.
 * @param {File} file
 * @param {number} maxSizeMB - max size in MB (default 5)
 * @returns {{ valid: boolean, error?: string }}
 */
export const validatePdfFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Only PDF files are allowed.' };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File size must be under ${maxSizeMB} MB.` };
  }
  return { valid: true };
};

/**
 * Aaj ki date YYYY-MM-DD format me return karo.
 */
export const todayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Unique ID generate karo (prefix ke saath).
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};