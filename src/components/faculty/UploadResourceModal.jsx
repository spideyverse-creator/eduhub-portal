// src/components/faculty/UploadResourceModal.jsx
import { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import Modal from '../common/Modal';
import { formatFileSize, validatePdfFile, todayString } from '../../utils/fileHelper';

// Firebase Firestore Imports
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// 🔥 Upstash Official Hook
import { useUpload } from "@upstash/blob/react";

export default function UploadResourceModal({ isOpen, onClose, subjectId, facultyName, facultyId }) {
  const { start } = useUpload("/api/upload"); // Hook initialize
  const [category, setCategory] = useState('notes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setError('');
    if (!selectedFile) return;
    
    const validation = validatePdfFile(selectedFile, 5);
    if (!validation.valid) {
      setError(validation.error);
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError('Title and PDF file are required.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // 🔥 1. File Seedha Upstash pe bhejo (Vercel server bypass)
      const record = start({ file });
      if (!record) throw new Error("File processing failed");

      // 2. Upload complete hone ka wait karo
      let uploadedRecord = record;
      while (uploadedRecord.status !== 'done' && uploadedRecord.status !== 'error') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (uploadedRecord.status === 'error') {
        throw new Error(uploadedRecord.error?.message || "Upload failed");
      }

      // 3. URL lo aur Firestore me save karo
      const fileUrl = uploadedRecord.blob.url;

      await addDoc(collection(db, 'resources'), {
        subjectId: subjectId,
        category: category,
        title: title,
        description: description || 'Uploaded by faculty.',
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileUrl: fileUrl, // Upstash ka direct URL
        uploadedAt: todayString(),
        uploadedBy: facultyName,
        facultyId: facultyId,
      });

      // Form Reset karo
      setTitle(''); 
      setDescription(''); 
      setFile(null); 
      setCategory('notes');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      onClose(); // Modal band karo
    } catch (err) {
      console.error(err);
      setError('Failed to upload. Check internet or file size.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Learning Material" icon={<UploadCloud className="w-5 h-5 text-indigo-600" />}>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {error && <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2"><X className="w-4 h-4 shrink-0"/>{error}</div>}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
          <select
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value="notes">Class Notes / PPTs</option>
            <option value="assignments">Assignment</option>
            <option value="lab_manual">Lab Manual / Practical Guide</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
          <input
            type="text" required placeholder="e.g., Unit 2 Queue Algorithms"
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
          <textarea
            rows={2} placeholder="Provide brief instructions..."
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
          />
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Upload PDF File (Max 5MB)</label>
          
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                  : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
              }`}
            >
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">Click to browse or drag & drop</p>
              <p className="text-xs text-slate-500 mt-1">Only PDF files up to 5MB are supported</p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white border border-indigo-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="bg-indigo-600 text-white p-3 rounded-lg shrink-0 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg shrink-0 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <input
            type="file" accept=".pdf" ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files[0])} className="hidden"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-slate-100 mt-6 pt-4">
          <button type="button" onClick={onClose} disabled={isUploading} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
          <button type="submit" disabled={isUploading} className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2">
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : 'Publish Resource'}
          </button>
        </div>
      </form>
    </Modal>
  );
}