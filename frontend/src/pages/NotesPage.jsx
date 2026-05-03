import { useEffect, useState, useCallback } from 'react';
import { useAcademic } from '../context/AcademicContext';
import NoteCard from '../components/notes/NoteCard';
import NoteEditor from '../components/notes/NoteEditor';
import { PageLoader, EmptyState } from '../components/ui/index.jsx';
import { DocumentTextIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
    if (search)        params.search  = search;
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
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="page-title">Notes Repository</h2>
          <p className="page-subtitle">{notes.length} note{notes.length !== 1 ? 's' : ''} · search and filter instantly</p>
        </div>
        <button onClick={() => setEditorNote(null)} className="btn-primary">
          <PlusIcon className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="form-input pl-10" placeholder="Search notes by title, content or tag..."
          />
        </div>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="form-select sm:w-44">
          <option value="">All subjects</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <select value={filterColor} onChange={e => setFilterColor(e.target.value)} className="form-select sm:w-36">
          <option value="">All colors</option>
          {COLORS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button
          onClick={() => setFilterPinned(p => !p)}
          className={`btn-secondary flex-shrink-0 ${filterPinned ? 'bg-brand-50 border-brand-300 text-brand-700' : ''}`}
        >
          📌 {filterPinned ? 'Pinned only' : 'Show all'}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-icon border border-slate-200 flex-shrink-0" title="Clear filters">
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Notes grid */}
      {displayed.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={DocumentTextIcon}
            title={hasFilters ? 'No notes match your filters' : 'No notes yet'}
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Create your first note to get started.'}
            action={!hasFilters && <button onClick={() => setEditorNote(null)} className="btn-primary">Create First Note</button>}
          />
        </div>
      ) : (
        <>
          {/* Pinned section */}
          {pinned.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                📌 Pinned
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-stagger">
                {pinned.map(note => <NoteCard key={note._id} note={note} onEdit={setEditorNote} />)}
              </div>
            </div>
          )}

          {/* All notes */}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">All Notes</h3>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-stagger">
                {unpinned.map(note => <NoteCard key={note._id} note={note} onEdit={setEditorNote} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Editor modal */}
      {editorNote !== undefined && (
        <NoteEditor note={editorNote || undefined} onClose={() => setEditorNote(undefined)} />
      )}
    </div>
  );
}
