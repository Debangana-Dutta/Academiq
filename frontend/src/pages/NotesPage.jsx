import { useEffect, useState, useCallback } from 'react';
import { useAcademic } from '../context/AcademicContext';
import NoteCard from '../components/notes/NoteCard';
import NoteEditor from '../components/notes/NoteEditor';
import { PageLoader, EmptyState } from '../components/ui/index.jsx';
import { DocumentTextIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const COLORS = ['slate', 'indigo', 'emerald', 'amber', 'rose', 'violet'];

export default function NotesPage() {
  const { notes, subjects, fetchNotes, fetchSubjects, loadingStates } = useAcademic();
  const [editorNote, setEditorNote] = useState(undefined); // undefined = closed, null = new, object = edit
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterPinned, setFilterPinned] = useState(false);

  useEffect(() => { fetchNotes(); fetchSubjects(); }, []);

  const doSearch = useCallback(async () => {
    const params = {};
    if (search)         params.search  = search;
    if (filterSubject) params.subject = filterSubject;
    if (filterColor)   params.color   = filterColor;
    await fetchNotes(params);
  }, [search, filterSubject, filterColor]);

  useEffect(() => {
    const t = setTimeout(doSearch, 350);
    return () => clearTimeout(t);
  }, [doSearch]);

  const clearFilters = () => { setSearch(''); setFilterSubject(''); setFilterColor(''); setFilterPinned(false); fetchNotes(); };
  const hasFilters = search || filterSubject || filterColor || filterPinned;

  const displayed = filterPinned ? notes.filter(n => n.isPinned) : notes;
  const pinned = displayed.filter(n => n.isPinned);
  const unpinned = displayed.filter(n => !n.isPinned);

  if (loadingStates.notes && !notes.length) return <PageLoader />;

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-6">
      {/* 🟢 Smaller, Refined Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notes</h2>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Intelligence & Search Repository</p>
        </div>
        <button onClick={() => setEditorNote(null)} className="btn-primary flex items-center gap-2 px-5 py-2 text-sm shadow-lg shadow-brand-500/10">
          <PlusIcon className="w-4 h-4" /> 
          <span className="font-bold">New Note</span>
        </button>
      </div>

      {/* 🟢 Dynamic Filter Bar: Improved Spacing */}
      <div className="flex flex-col lg:flex-row gap-3 mb-8">
        <div className="relative flex-1 group">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="form-input pl-10 bg-white border-slate-200 focus:bg-white shadow-sm" 
            placeholder="Search title, content or tags..."
          />
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="form-select text-xs font-semibold sm:w-40 bg-white shadow-sm">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          
          <select value={filterColor} onChange={e => setFilterColor(e.target.value)} className="form-select text-xs font-semibold sm:w-32 bg-white shadow-sm">
            <option value="">All Colors</option>
            {COLORS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          
          <button
            onClick={() => setFilterPinned(p => !p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              filterPinned 
                ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{filterPinned ? '📌 Pinned Only' : '📍 Show All'}</span>
          </button>
          
          {hasFilters && (
            <button onClick={clearFilters} className="btn-icon bg-white border border-slate-200 hover:border-red-200 hover:text-red-500 shadow-sm" title="Clear Filters">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 🟢 Section Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 bg-brand-500 rounded-full" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {filterPinned ? 'Pinned Collection' : 'Active Workspace'}
        </span>
      </div>

      {/* Notes Grid */}
      {displayed.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-12">
          <EmptyState
            icon={DocumentTextIcon}
            title={hasFilters ? 'No results found' : 'Workspace is empty'}
            description={hasFilters ? 'Try adjusting your filters or search keywords.' : 'Capture your thoughts and sync them across devices.'}
            action={!hasFilters && <button onClick={() => setEditorNote(null)} className="btn-primary mt-4">Create First Note</button>}
          />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Pinned section */}
          {pinned.length > 0 && (
            <div className="animate-fade-in">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger">
                {pinned.map(note => <NoteCard key={note._id} note={note} onEdit={setEditorNote} />)}
              </div>
            </div>
          )}

          {/* All notes */}
          {unpinned.length > 0 && (
            <div className="animate-fade-in">
              {pinned.length > 0 && (
                <div className="flex items-center gap-4 mb-6">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] whitespace-nowrap">Archives</span>
                   <div className="h-px w-full bg-slate-100" />
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger">
                {unpinned.map(note => <NoteCard key={note._id} note={note} onEdit={setEditorNote} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor modal */}
      {editorNote !== undefined && (
        <NoteEditor note={editorNote || undefined} onClose={() => setEditorNote(undefined)} />
      )}
    </div>
  );
}