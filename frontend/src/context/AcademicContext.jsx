import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AcademicContext = createContext(null);

export const AcademicProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [cgpaData, setCgpaData] = useState({ cgpa: 0, totalCredits: 0, semesters: [] });
  const [notes, setNotes] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, val) => setLoadingStates(prev => ({ ...prev, [key]: val }));

  // ── Subjects ────────────────────────────────────────────────
  const fetchSubjects = useCallback(async (params = {}) => {
    setLoading('subjects', true);
    try {
      const { data } = await api.get('/subjects', { params });
      setSubjects(data.subjects);
      return data.subjects;
    } finally { setLoading('subjects', false); }
  }, []);

  const createSubject = async (payload) => {
    const { data } = await api.post('/subjects', payload);
    setSubjects(prev => [data.subject, ...prev]);
    return data.subject;
  };

  const updateSubject = async (id, payload) => {
    const { data } = await api.put(`/subjects/${id}`, payload);
    setSubjects(prev => prev.map(s => s._id === id ? data.subject : s));
    return data.subject;
  };

  const deleteSubject = async (id) => {
    await api.delete(`/subjects/${id}`);
    setSubjects(prev => prev.filter(s => s._id !== id));
    setAttendance(prev => prev.filter(a => a.subject?._id !== id));
  };

  // ── Attendance ──────────────────────────────────────────────
  const fetchAttendance = useCallback(async () => {
    setLoading('attendance', true);
    try {
      const { data } = await api.get('/attendance');
      setAttendance(data.attendance);
      return data.attendance;
    } finally { setLoading('attendance', false); }
  }, []);

  const logAttendance = async (payload) => {
    const { data } = await api.post('/attendance/log', payload);
    setAttendance(prev => {
      const exists = prev.find(a => a.subject?._id === payload.subjectId);
      if (exists) return prev.map(a => a.subject?._id === payload.subjectId ? data.record : a);
      return [...prev, data.record];
    });
    return data.record;
  };

  const setManualAttendance = async (subjectId, payload) => {
    const { data } = await api.put(`/attendance/${subjectId}/manual`, payload);
    setAttendance(prev => prev.map(a => a.subject?._id === subjectId ? data.record : a));
    return data.record;
  };

  // ── CGPA ────────────────────────────────────────────────────
  const fetchCGPA = useCallback(async () => {
    setLoading('cgpa', true);
    try {
      const { data } = await api.get('/cgpa');
      setCgpaData({ cgpa: data.cgpa, totalCredits: data.totalCredits, semesters: data.semesters });
      return data;
    } finally { setLoading('cgpa', false); }
  }, []);

  const addSemester = async (payload) => {
    const { data } = await api.post('/cgpa/semester', payload);
    setCgpaData(prev => {
      const exists = prev.semesters.find(s => s.semester === payload.semester);
      const semesters = exists
        ? prev.semesters.map(s => s.semester === payload.semester ? data.entry : s)
        : [...prev.semesters, data.entry].sort((a, b) => a.semester - b.semester);
      return { ...prev, semesters };
    });
    await fetchCGPA();
    return data.entry;
  };

  const deleteSemester = async (semester) => {
    await api.delete(`/cgpa/semester/${semester}`);
    setCgpaData(prev => ({ ...prev, semesters: prev.semesters.filter(s => s.semester !== semester) }));
    await fetchCGPA();
  };

  const simulateCGPA = async (payload) => {
    const { data } = await api.post('/cgpa/simulate', payload);
    return data;
  };

  // ── Notes ───────────────────────────────────────────────────
  const fetchNotes = useCallback(async (params = {}) => {
    setLoading('notes', true);
    try {
      const { data } = await api.get('/notes', { params });
      setNotes(data.notes);
      return data.notes;
    } finally { setLoading('notes', false); }
  }, []);

  const createNote = async (payload) => {
    const { data } = await api.post('/notes', payload);
    setNotes(prev => [data.note, ...prev]);
    return data.note;
  };

  const updateNote = async (id, payload) => {
    const { data } = await api.put(`/notes/${id}`, payload);
    setNotes(prev => prev.map(n => n._id === id ? data.note : n));
    return data.note;
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(prev => prev.filter(n => n._id !== id));
  };

  return (
    <AcademicContext.Provider value={{
      subjects, attendance, cgpaData, notes, loadingStates,
      fetchSubjects, createSubject, updateSubject, deleteSubject,
      fetchAttendance, logAttendance, setManualAttendance,
      fetchCGPA, addSemester, deleteSemester, simulateCGPA,
      fetchNotes, createNote, updateNote, deleteNote,
    }}>
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const ctx = useContext(AcademicContext);
  if (!ctx) throw new Error('useAcademic must be within AcademicProvider');
  return ctx;
};
