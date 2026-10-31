// src/components/faculty/CreateSubjectModal.jsx
import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import Modal from '../common/Modal';
import { generateId } from '../../utils/fileHelper';

export default function CreateSubjectModal({ isOpen, onClose, onCreate, facultyName, facultyId }) {
  const [formData, setFormData] = useState({ code: '', name: '', room: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;

    const colors = [
      'from-blue-600 to-indigo-700', 'from-purple-600 to-pink-700',
      'from-emerald-600 to-teal-700', 'from-rose-600 to-red-700',
      'from-amber-600 to-orange-700'
    ];

    const newSubject = {
      id: generateId('sub'),
      code: formData.code.toUpperCase(),
      name: formData.name,
      faculty: facultyName,
      facultyId: facultyId,
      room: formData.room || 'TBA',
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    onCreate(newSubject);
    setFormData({ code: '', name: '', room: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Subject Space" icon={<FolderPlus className="w-5 h-5 text-indigo-600" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code</label>
          <input
            type="text" required placeholder="e.g., CS501"
            value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
          <input
            type="text" required placeholder="e.g., Software Engineering"
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Venue (Optional)</label>
          <input
            type="text" placeholder="e.g., LH 101"
            value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition">Create Space</button>
        </div>
        // Baaki inputs ke neeche
      <div>
        <label className="block text-xs font-semibold       text-slate-700 mb-1">Google Form Link       (Assignments ke liye)</label>
        <input
          type="url"
          placeholder="https://forms.gle/..."
          value={formData.formLink || ''}
          onChange={(e) => setFormData({ ...formData,       formLink: e.target.value })}
          className="w-full bg-slate-50 border      border-slate-300 rounded-xl p-2.5 text-sm     focus:ring-2 focus:ring-indigo-500      outline-none"
        />
        <p className="text-[10px] text-slate-400      mt-1">Students is link pe click karke apna      assignment submit karenge.</p>
      </div>
      </form>
    </Modal>
  );
}