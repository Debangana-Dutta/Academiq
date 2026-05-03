import { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { timeAgo } from '../../utils/academicCalc';
import { PencilIcon, TrashIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const COLOR_CLASSES = {
  slate:   { bg: 'bg-slate-50',   border: 'border-slate-200', dot: 'bg-slate-400',   tag: 'bg-slate-200 text-slate-600' },
  indigo:  { bg: 'bg-brand-50',   border: 'border-brand-200', dot: 'bg-brand-400',   tag: 'bg-brand-100 text-brand-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400', tag: 'bg-emerald-100 text-emerald-600' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200', dot: 'bg-amber-400',   tag: 'bg-amber-100 text-amber-600' },
  rose:    { bg: 'bg-rose-50',    border: 'border-rose-200',  dot: 'bg-rose-400',    tag: 'bg-rose-100 text-rose-600' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200', dot: 'bg-violet-400', tag: 'bg-violet-100 text-violet-600' },
};

export default function NoteCard({ note, onEdit }) {
  const { deleteNote, updateNote } = useAcademic();
  const [deleting, setDeleting] = useState(false);
  const c = COLOR_CLASSES[note.color] || COLOR_CLASSES.slate;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    setDeleting(true);
    try { await deleteNote(note._id); toast.success('Note deleted'); }
    catch (e) { toast.error(e.message); setDeleting(false); }
  };

  const togglePin = async () => {
    try { await updateNote(note._id, { isPinned: !note.isPinned }); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className={`rounded-2xl border-2 p-4 ${c.bg} ${c.border} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group animate-fade-in ${deleting ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 flex-1">{note.title}</h4>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={togglePin} className="btn-icon w-7 h-7" title={note.isPinned ? 'Unpin' : 'Pin'}>
            {note.isPinned ? <BookmarkSolid className="w-4 h-4 text-brand-500" /> : <BookmarkIcon className="w-4 h-4" />}
          </button>
          <button onClick={() => onEdit(note)} className="btn-icon w-7 h-7" title="Edit">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} disabled={deleting} className="btn-icon w-7 h-7 text-danger-400 hover:text-danger-600" title="Delete">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subject tag */}
      {note.subject && (
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: note.subject.color || '#6366f1' }} />
          <span className="text-xs font-semibold text-slate-500">{note.subject.name}</span>
        </div>
      )}

      {/* Content preview */}
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">{note.content}</p>

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.tag}`}>#{tag}</span>
          ))}
          {note.tags.length > 3 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.tag}`}>+{note.tags.length - 3}</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium">{timeAgo(note.updatedAt)}</span>
        {note.isPinned && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-brand-500">
            <BookmarkSolid className="w-3 h-3" /> Pinned
          </span>
        )}
      </div>
    </div>
  );
}
