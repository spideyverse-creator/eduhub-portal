// src/components/faculty/PostAnnouncementModal.jsx
import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import Modal from '../common/Modal';
import { generateId, todayString } from '../../utils/fileHelper';

export default function PostAnnouncementModal({ isOpen, onClose, onPost, subjectId, facultyName, facultyId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urgent, setUrgent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnnouncement = {
      id: generateId('ann'),
      subjectId: subjectId,
      title: title,
      content: content,
      date: todayString(),
      author: facultyName,
      authorId: facultyId,
      urgent: urgent,
    };

    onPost(newAnnouncement);
    setTitle(''); setContent(''); setUrgent(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Broadcast Notice" icon={<Megaphone className="w-5 h-5 text-indigo-600" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Headline</label>
          <input
            type="text" required placeholder="e.g., Extra Remedial Class Scheduled"
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Details</label>
          <textarea
            rows={4} required placeholder="Write notice text clearly..."
            value={content} onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
          <input
            type="checkbox" id="urgent"
            checked={urgent} onChange={(e) => setUrgent(e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="urgent" className="text-xs font-medium text-amber-900 cursor-pointer">
            Mark as Urgent Notice (Highlight in yellow)
          </label>
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition">Publish Notice</button>
        </div>
      </form>
    </Modal>
  );
}