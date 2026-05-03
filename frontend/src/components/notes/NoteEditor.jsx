import { useState, useEffect } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Modal } from '../ui/index.jsx';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const COLORS = ['slate', 'indigo', 'emerald', 'amber', 'rose', 'violet'];
const COLOR_DISPLAY = {
  slate: 'bg-slate-400', indigo: 'bg-brand-400', emerald: 'bg-emerald-400',
  amber: 'bg-amber-400', rose: 'bg-rose-400', violet: 'bg-violet-400',
};

export default function NoteEditor({ note, onClose }) {
  const { createNote, updateNote, subjects } = useAcademic();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || 'slate');
  const [subjectId, setSubjectId] = useState(note?.subject?._id || note?.subject || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(note?.tags || []);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };
  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t));
  const handleTagKeyDown = (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } };

  const save = async () => {
    if (!title.trim()) return toast.error('Title is required');
    if (!content.trim()) return toast.error('Content is required');
    setSaving(true);
    try {
      const payload = { title: title.trim(), content: content.trim(), color, tags, isPinned, subject: subjectId || null };
      if (note) { await updateNote(note._id, payload); toast.success('Note updated'); }
      else { await createNote(payload); toast.success('Note created'); }
      onClose();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title={note ? 'Edit Note' : 'New Note'} size="xl">
      <div className="flex flex-col max-h-[85vh]">
        
        {/* SCROLLABLE SECTION */}
        <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4 custom-scrollbar">
          {/* Title */}
          <div>
            <label className="form-label">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="form-input" placeholder="Note title..." />
          </div>

          {/* Content */}
          <div>
            <label className="form-label">Content</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)}
              className="form-input resize-none h-48 font-mono text-xs leading-relaxed"
              placeholder="Write your note here..."
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{content.length.toLocaleString()} / 50,000</p>
          </div>

          {/* Subject + Color row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Subject (optional)</label>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="form-select">
                <option value="">No subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Color</label>
              <div className="flex items-center gap-2 mt-1.5">
                {COLORS.map(c => (
                  <button
                    key={c} type="button" onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full ${COLOR_DISPLAY[c]} transition-all hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-danger-500 transition-colors">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                className="form-input flex-1" placeholder="Add tag, press Enter..."
              />
              <button type="button" onClick={addTag} className="btn-secondary px-3">Add</button>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER SECTION */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 bg-white">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded border-slate-300 focus:ring-brand-500" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Pin this note</span>
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="btn-primary min-w-[100px]">
              {saving ? 'Saving...' : note ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}