// src/pages/FacultyPage.jsx
import { useState, useEffect } from 'react';
import { 
  Plus, BookOpen, CheckSquare, FlaskConical, Megaphone, 
  Trash2, FileText, UploadCloud, Eye, Download, AlertTriangle, Link as LinkIcon, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Firebase Imports
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Components
import Header from '../components/common/Header';
import Toast from '../components/common/Toast';
import CreateSubjectModal from '../components/faculty/CreateSubjectModal';
import UploadResourceModal from '../components/faculty/UploadResourceModal';
import PostAnnouncementModal from '../components/faculty/PostAnnouncementModal';
import { doc, setDoc } from 'firebase/firestore';

export default function FacultyPage() {
  const { user } = useAuth();

  // ================= STATES =================
  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [toast, setToast] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [tempLink, setTempLink] = useState('');

  // Modals state
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // ================= REAL-TIME DATA FETCHING =================
  useEffect(() => {
    if (!user) return;

    // 1. Fetch Subjects
    const qSub = query(collection(db, "subjects"), where("facultyId", "==", user.id));
    const unsubSub = onSnapshot(qSub, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subs);
      if (subs.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(subs[0].id);
      }
    });

    // 2. Fetch Resources
    const qRes = query(collection(db, "resources"), where("facultyId", "==", user.id));
    const unsubRes = onSnapshot(qRes, (snapshot) => {
      setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. Fetch Announcements
    const qAnn = query(collection(db, "announcements"), where("facultyId", "==", user.id));
    const unsubAnn = onSnapshot(qAnn, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubSub();
      unsubRes();
      unsubAnn();
    };
  }, [user, selectedSubjectId]);

  // ================= HELPERS =================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const currentResources = resources.filter(
    r => r.subjectId === selectedSubjectId && r.category === activeTab
  );
  const currentAnnouncements = announcements.filter(
    a => a.subjectId === selectedSubjectId
  );

  // ================= ACTIONS =================
  const handleCreateSubject = async (newSubject) => {
    try {
      await addDoc(collection(db, "subjects"), {
        ...newSubject,
        facultyId: user.id,
        faculty: user.name,
      });
      showToast('Subject created successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error creating subject.');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteDoc(doc(db, "resources", id));
      showToast('Resource deleted safely.');
    } catch (err) {
      showToast('Error deleting resource.');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await deleteDoc(doc(db, "announcements", id));
      showToast('Notice deleted.');
    } catch (err) {
      showToast('Error deleting notice.');
    }
  };

  const handleDeleteSubject = async (subId) => {
    if (!window.confirm(`Delete "${selectedSubject?.name}"? This will also delete all its resources.`)) return;
    
    try {
      // 1. Delete Subject
      await deleteDoc(doc(db, "subjects", subId));

      // 2. Delete related resources
      const resToDelete = resources.filter(r => r.subjectId === subId);
      for (const res of resToDelete) {
        await deleteDoc(doc(db, "resources", res.id));
      }

      // 3. Delete related announcements
      const annToDelete = announcements.filter(a => a.subjectId === subId);
      for (const ann of annToDelete) {
        await deleteDoc(doc(db, "announcements", ann.id));
      }

      // 4. UI Update
      if (selectedSubjectId === subId) {
        const remainingSubs = subjects.filter(s => s.id !== subId);
        setSelectedSubjectId(remainingSubs.length > 0 ? remainingSubs[0].id : null);
      }
      
      showToast('Subject and its contents deleted safely.');
    } catch (err) {
      console.error("DELETE ERROR:", err);
      showToast('Failed to delete subject.');
    }
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Toast message={toast} />
      <Header title="Faculty Dashboard" roleBadge="Faculty Access" colorTheme="indigo" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">My Subjects</h2>
              <button 
                onClick={() => setIsSubjectModalOpen(true)}
                className="p-1 hover:bg-indigo-50 rounded-lg text-indigo-600 transition"
                title="Add Subject"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {subjects.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No subjects created yet.</p>
              ) : (
                subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border relative group ${
                      sub.id === selectedSubjectId
                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        sub.id === selectedSubjectId ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sub.code}
                      </span>
                      
                      {sub.id === selectedSubjectId && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDeleteSubject(sub.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-slate-900 mt-1.5 line-clamp-1">{sub.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{sub.room}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD AREA */}
        <main className="lg:col-span-9 space-y-5">
          {!selectedSubject ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center">
              <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-700">Welcome, {user?.name}</h2>
              <p className="text-sm text-slate-500 mt-2 mb-6">You haven't created any subjects yet.</p>
              <button 
                onClick={() => setIsSubjectModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" /> Create First Subject
              </button>
            </div>
          ) : (
            <>
              {/* Subject Banner */}
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${selectedSubject.color} text-white p-6 shadow-md`}>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md">
                      {selectedSubject.code}
                    </span>
                    <h2 className="text-2xl font-bold mt-2">{selectedSubject.name}</h2>
                    <div className="flex items-center gap-4 text-xs text-white/80 mt-2">
                      <span>Venue: <strong>{selectedSubject.room}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setTempLink(selectedSubject.formLink || '');
                        setIsLinkModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-indigo-900/40 hover:bg-indigo-900/60 border border-white/20 text-white font-semibold text-xs px-3 py-2.5 rounded-xl backdrop-blur-md transition"
                    >
                      <LinkIcon className="w-4 h-4" /> Update Form Link
                    </button>

                    <button
                      onClick={() => setIsResourceModalOpen(true)}
                      className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
                    >
                      <UploadCloud className="w-4 h-4 text-indigo-600" />
                      <span>Upload File</span>
                    </button>
                    <button
                      onClick={() => setIsAnnouncementModalOpen(true)}
                      className="flex items-center gap-2 bg-black/20 hover:bg-black/30 border border-white/20 text-white font-semibold text-xs px-3 py-2.5 rounded-xl backdrop-blur-md transition"
                    >
                      <Megaphone className="w-4 h-4" />
                      <span>Post Notice</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
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
                      activeTab === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="space-y-3">
                {activeTab !== 'announcements' && (
                  currentResources.length === 0 ? (
                    <EmptyState title="No files uploaded yet" desc="Click 'Upload File' to add resources to this section." />
                  ) : (
                    currentResources.map(res => (
                      <div key={res.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm">{res.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{res.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                              <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{res.fileName}</span>
                              <span>•</span>
                              <span>{res.fileSize}</span>
                              <span>•</span>
                              <span>{res.uploadedAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button onClick={() => setPreviewFile(res)} className="flex items-center gap-1 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 font-medium text-xs px-3 py-1.5 rounded-lg transition">
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </button>
                          <button onClick={() => handleDeleteResource(res.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'announcements' && (
                  currentAnnouncements.length === 0 ? (
                    <EmptyState title="No notices posted" desc="Click 'Post Notice' to broadcast an update." />
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
                            <div className="text-[11px] text-indigo-600 font-medium mt-3">Posted by: {ann.author}</div>
                          </div>
                          <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      <CreateSubjectModal 
        isOpen={isSubjectModalOpen} 
        onClose={() => setIsSubjectModalOpen(false)} 
        onCreate={handleCreateSubject} 
        facultyName={user?.name}
        facultyId={user?.id}
      />

      {selectedSubject && (
        <>
          <UploadResourceModal 
            isOpen={isResourceModalOpen} 
            onClose={() => setIsResourceModalOpen(false)} 
            subjectId={selectedSubject.id}
            facultyName={user?.name}
            facultyId={user?.id}
          />
          <PostAnnouncementModal 
            isOpen={isAnnouncementModalOpen} 
            onClose={() => setIsAnnouncementModalOpen(false)} 
            onPost={() => {}}
            subjectId={selectedSubject.id}
            facultyName={user?.name}
            facultyId={user?.id}
          />
        </>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FileText className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{previewFile.title}</h3>
                  <p className="text-xs text-slate-500">{previewFile.fileName} • {previewFile.fileSize}</p>
                </div>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-600 p-1 font-bold text-xl">&times;</button>
            </div>
            
            <div className="my-4 bg-slate-100 border border-slate-200 rounded-xl p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center min-h-[300px]">
              {previewFile.fileUrl ? (
                 <iframe 
                   src={previewFile.fileUrl} 
                   className="w-full h-[50vh] rounded-lg border border-slate-300" 
                   title="PDF Preview"
                 />
              ) : (
                <>
                  <FileText className="w-16 h-16 text-slate-400 mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm">PDF Document Viewer</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">{previewFile.description}</p>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-500">Uploaded on {previewFile.uploadedAt}</span>
              <button 
                onClick={() => {
                  if(previewFile.fileUrl) {
                    window.open(previewFile.fileUrl, "_blank");
                  } else {
                    showToast('File URL not found.');
                  }
                }} 
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM LINK MODAL */}
      {isLinkModalOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsLinkModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Add Submission Link</h3>
            <p className="text-xs text-slate-500 mb-4">Paste your Google Form link below. Students will see this link in the "Submit Work" tab.</p>
            
            <input
              type="url"
              placeholder="https://forms.gle/..."
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            
            <button
              onClick={async () => {
                try {
                  await setDoc(doc(db, "subjects", selectedSubject.id), { formLink: tempLink }, { merge: true });
                  showToast('Form link saved successfully!');
                  setIsLinkModalOpen(false);
                } catch (error) {
                  console.error(error);
                  showToast('Failed to save link.');
                }
              }}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Save Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </div>
  );
}