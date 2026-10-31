// src/data/mockData.js

// ============ USERS (Login credentials) ============
export const USERS = [
  {
    id: 'u1',
    username: 'faculty1',
    password: 'faculty123',
    role: 'faculty',
    name: 'Dr. Anjali Sharma',
    email: 'anjali.sharma@eduhub.edu',
  },
  {
    id: 'u2',
    username: 'faculty2',
    password: 'faculty123',
    role: 'faculty',
    name: 'Prof. Rajesh Verma',
    email: 'rajesh.verma@eduhub.edu',
  },
  {
    id: 's1',
    username: 'student1',
    password: 'student123',
    role: 'student',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@student.eduhub.edu',
  },
  {
    id: 's2',
    username: 'student2',
    password: 'student123',
    role: 'student',
    name: 'Priya Singh',
    email: 'priya.singh@student.eduhub.edu',
  },
];

// ============ SUBJECTS ============
export const INITIAL_SUBJECTS = [
  {
    id: 'cs101',
    code: 'CS101',
    name: 'Data Structures & Algorithms',
    faculty: 'Dr. Anjali Sharma',
    facultyId: 'u1',
    room: 'Lab 302',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'cs202',
    code: 'CS202',
    name: 'Operating Systems',
    faculty: 'Prof. Rajesh Verma',
    facultyId: 'u2',
    room: 'LH 104',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'cs303',
    code: 'CS303',
    name: 'Computer Networks',
    faculty: 'Dr. Anjali Sharma',
    facultyId: 'u1',
    room: 'LH 201',
    color: 'from-purple-600 to-pink-700',
  },
  {
    id: 'cs404',
    code: 'CS404',
    name: 'Database Management Systems',
    faculty: 'Prof. Rajesh Verma',
    facultyId: 'u2',
    room: 'Lab 108',
    color: 'from-amber-600 to-orange-700',
  },
];

// ============ RESOURCES ============
// NOTE: fileData field me actual Base64 store hoga (real file upload ke liye)
export const INITIAL_RESOURCES = [
  {
    id: 'res-1',
    subjectId: 'cs101',
    category: 'notes',
    title: 'Unit 1: Trees and Binary Search Trees (BST)',
    description: 'Complete lecture notes on BST insertion, deletion, and balancing algorithms with C++ examples.',
    fileName: 'Unit1_Trees_BST_Notes.pdf',
    fileSize: '2.4 MB',
    fileData: null, // real PDF Base64 (null = no file uploaded, only metadata)
    uploadedAt: '2026-10-25',
    uploadedBy: 'Dr. Anjali Sharma',
    uploadedById: 'u1',
  },
  {
    id: 'res-2',
    subjectId: 'cs101',
    category: 'assignments',
    title: 'Assignment 2: Graph Algorithms & Dijkstra',
    description: 'Implement Dijkstra and Prim algorithm. Submission deadline: Nov 10th before 11:59 PM.',
    fileName: 'Assignment_2_DSA.pdf',
    fileSize: '1.1 MB',
    fileData: null,
    uploadedAt: '2026-10-28',
    uploadedBy: 'Dr. Anjali Sharma',
    uploadedById: 'u1',
  },
  {
    id: 'res-3',
    subjectId: 'cs101',
    category: 'lab_manual',
    title: 'Lab Manual: Stack & Queue Applications',
    description: 'Step-by-step practical guide for Lab Session 4. Includes problem statements and starter codes.',
    fileName: 'DSA_Lab_Manual_Session4.pdf',
    fileSize: '3.8 MB',
    fileData: null,
    uploadedAt: '2026-10-18',
    uploadedBy: 'Dr. Anjali Sharma',
    uploadedById: 'u1',
  },
  {
    id: 'res-4',
    subjectId: 'cs202',
    category: 'notes',
    title: 'Process Synchronization & Semaphores',
    description: 'Peterson solution, Producer-Consumer problem, and Readers-Writers synchronization notes.',
    fileName: 'OS_Process_Sync.pdf',
    fileSize: '4.2 MB',
    fileData: null,
    uploadedAt: '2026-10-29',
    uploadedBy: 'Prof. Rajesh Verma',
    uploadedById: 'u2',
  },
];

// ============ ANNOUNCEMENTS ============
export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    subjectId: 'cs101',
    title: 'Mid-Semester Exam Syllabus Update',
    content: 'Mid-sem exam will cover Unit 1 to Unit 3. Make sure to solve all assignment questions before Friday.',
    date: '2026-10-30',
    author: 'Dr. Anjali Sharma',
    authorId: 'u1',
    urgent: true,
  },
  {
    id: 'ann-2',
    subjectId: 'cs202',
    title: 'Lab Session Rescheduled',
    content: "Tomorrow's Operating Systems lab at 2:00 PM is shifted to Computer Lab 4.",
    date: '2026-10-29',
    author: 'Prof. Rajesh Verma',
    authorId: 'u2',
    urgent: false,
  },
];

// ============ CATEGORY META ============
export const CATEGORIES = [
  { id: 'notes', label: 'Class Notes', icon: 'BookOpen' },
  { id: 'assignments', label: 'Assignments', icon: 'CheckSquare' },
  { id: 'lab_manual', label: 'Lab Manuals', icon: 'FlaskConical' },
  { id: 'announcements', label: 'Announcements', icon: 'Megaphone' },
];

// ============ STORAGE KEYS ============
export const STORAGE_KEYS = {
  AUTH: 'eduhub_auth',
  SUBJECTS: 'eduhub_subjects',
  RESOURCES: 'eduhub_resources',
  ANNOUNCEMENTS: 'eduhub_announcements',
};