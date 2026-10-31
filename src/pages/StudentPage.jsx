// src/pages/StudentPage.jsx
import { useState, useEffect } from 'react';
import { 
  BookOpen, CheckSquare, FlaskConical, Megaphone, 
  FileText, Eye, Download, Search, AlertTriangle, 
  ChevronLeft, FolderOpen, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // AuthContext import
import Header from '../components/common/Header';
import Toast from '../components/common/Toast';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function StudentPage() {
  const { user: authUser } = useAuth(); // Name change taaki local state se clash na ho
  
  // Local state jo UI ko turant update karegi
  const [localUser, setLocalUser] = useState(authUser);

  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const [view, setView] = useState('grid');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  // AuthContext update hone par local state sync karo
  useEffect(() => {
    if (authUser) setLocalUser(authUser);
  }, [authUser]);

  // 1. Firebase se Data Fetch karo
  useEffect(() => {
    const unsubSubjects = onSnapshot(collection(db, "subjects"), (snapshot) => {
      setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubResources = onSnapshot(collection(db, "resources"), (snapshot) => {
      setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAnnouncements = onSnapshot(collection(db, "announcements"), (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubSubjects();
      unsubResources();
      unsubAnnouncements();
    };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Optimistic Mark as Complete Logic
  const toggleComplete = async (resId) => {
    if (!localUser) return;
    const isCompleted = localUser.completedResources?.includes(resId);

    // 1. UI ko turant update karo (Optimistic Update)
    const newCompleted = isCompleted 
      ? localUser.completedResources.filter(id => id !== resId) 
      : [...(localUser.completedResources || []), resId];
    
    setLocalUser({ ...localUser, completedResources: newCompleted });

    // 2. Database me save karo
    const userRef = doc(db, 'users', localUser.id);
    try {
      if (isCompleted) {
        await updateDoc(userRef, { completedResources: arrayRemove(resId) });
      } else {
        await updateDoc(userRef, { completedResources: arrayUnion(resId) });
      }
      showToast(isCompleted ? 'Marked as incomplete' : 'Marked as complete! ⭐');
    } catch (err) {
      // Agar error aaye toh UI ko wapas purana kar do
      setLocalUser(localUser); 
      showToast('Failed to update progress');
    }
  };

  const totalCompleted = localUser?.completedResources?.length || 0;

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const currentResources = resources.filter(r => {
    if (r.subjectId !== selectedSubjectId || r.category !== activeTab) return false;
    if (!searchTerm) return true;
    return r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           r.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentAnnouncements = announcements.filter(a => {
    if (a.subjectId !== selectedSubjectId) return false;
    if (!searchTerm) return true;
    return a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           a.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDownload = (file) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, "_blank");
      showToast('Download started!');
    } else {
      showToast('File URL not found.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Toast message={toast} />
      <Header title="Student Portal" roleBadge="Student Access" colorTheme="emerald" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* ================= VIEW 1: SUBJECTS GRID ================= */}
        {view === 'grid' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">My Subjects</h2>
                <p className="text-sm text-slate-500">Select a subject to access notes, assignments, and announcements.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text" placeholder="Search all subjects..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())).map(sub => {
                const subResources = resources.filter(r => r.subjectId === sub.id);
                const notesCount = subResources.filter(r => r.category === 'notes').length;
                const assignCount = subResources.filter(r => r.category === 'assignments').length;
                
                return (
                  <div 
                    key={sub.id} 
                    onClick={() => { setSelectedSubjectId(sub.id); setView('detail'); setSearchTerm(''); setActiveTab('notes'); }}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 cursor-pointer transition-all group"
                  >
                    <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${sub.color} mb-4`}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sub.code}</span>
                    <h3 className="font-bold text-slate-900 text-lg mt-1 group-hover:text-emerald-600 transition">{sub.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Instructor: {sub.faculty}</p>
                    
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-xs text-slate-500"><BookOpen className="w-3.5 h-3.5 text-indigo-500"/> {notesCount} Notes</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500"><CheckSquare className="w-3.5 h-3.5 text-amber-500"/> {assignCount} Tasks</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VIEW 2: RESOURCES DETAIL ================= */}
        {view === 'detail' && selectedSubject && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <button 
              onClick={() => setView('grid')}
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Subjects
            </button>

            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${selectedSubject.color} text-white p-6 shadow-md`}>
              <div className="relative z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md">
                  {selectedSubject.code}
                </span>
                <h2 className="text-2xl font-bold mt-2">{selectedSubject.name}</h2>
                <div className="flex items-center gap-4 text-xs text-white/80 mt-2">
                  <span>Instructor: <strong>{selectedSubject.faculty}</strong></span>
                  <span>•</span>
                  <span>Venue: <strong>{selectedSubject.room}</strong></span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'notes', label: 'Notes', icon: <BookOpen className="w-4 h-4" /> },
                  { id: 'assignments', label: 'Assignments', icon: <CheckSquare className="w-4 h-4" /> },
                  { id: 'lab_manual', label: 'Lab Manuals', icon: <FlaskConical className="w-4 h-4" /> },
                  { id: 'announcements', label: 'Notices', icon: <Megaphone className="w-4 h-4" /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      activeTab === tab.id ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text" placeholder="Search in this subject..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {activeTab !== 'announcements' && (
                currentResources.length === 0 ? (
                  <EmptyState title="No materials found" desc="No files uploaded in this section yet." />
                ) : (
                  currentResources.map(res => (
                    <div key={res.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{res.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{res.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                            <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{res.fileName}</span>
                            <span>•</span>
                            <span>{res.fileSize}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* MARK AS COMPLETE STAR ICON */}
                        <button 
                          onClick={() => toggleComplete(res.id)} 
                          className={`p-2 rounded-lg transition ${localUser?.completedResources?.includes(res.id) ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
                          title="Mark as Complete"
                        >
                          <Star className="w-5 h-5" fill={localUser?.completedResources?.includes(res.id) ? "currentColor" : "none"} />
                        </button>

                        <button onClick={() => setPreviewFile(res)} className="flex items-center gap-1 text-slate-700 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 font-medium text-xs px-3 py-1.5 rounded-lg transition">
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button onClick={() => handleDownload(res)} className="flex items-center gap-1 text-white bg-emerald-600 hover:bg-emerald-700 font-medium text-xs px-3 py-1.5 rounded-lg shadow-sm transition">
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeTab === 'announcements' && (
                currentAnnouncements.length === 0 ? (
                  <EmptyState title="No notices found" desc="No announcements posted for this subject." />
                ) : (
                  currentAnnouncements.map(ann => (
                    <div key={ann.id} className={`bg-white border rounded-2xl p-5 relative ${ann.urgent ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            {ann.urgent && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Urgent</span>}
                            <span className="text-xs text-slate-400">{ann.date}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{ann.title}</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ann.content}</p>
                          <div className="text-[11px] text-emerald-600 font-medium mt-3">Posted by: {ann.author}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FileText className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{previewFile.title}</h3>
                  <p className="text-xs text-slate-500">{previewFile.fileName}</p>
                </div>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-600 p-1 font-bold text-xl">&times;</button>
            </div>
            
            <div className="my-4 bg-slate-100 border border-slate-200 rounded-xl p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center min-h-[300px]">
              {previewFile.fileUrl ? (
                 <iframe src={previewFile.fileUrl} className="w-full h-[50vh] rounded-lg border border-slate-300" title="PDF Preview" />
              ) : (
                <>
                  <FileText className="w-16 h-16 text-slate-400 mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm">PDF Document Viewer</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">Preview not available for this file.</p>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-500">By {previewFile.uploadedBy}</span>
              <button onClick={() => handleDownload(previewFile)} className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </div>
  );
}