import { useState, useEffect } from 'react';
import { X, Send, Save, AlertCircle } from 'lucide-react';
import Button from './Button';

const ComplaintForm = ({ isOpen, onClose, onSubmit, editData }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Classroom');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Classroom',
    'Laboratory',
    'Hostel',
    'Library',
    'Internet/Wi-Fi',
    'Electrical',
    'Water Supply',
    'Cleanliness',
    'Other'
  ];

  /* eslint-disable react-hooks/set-state-in-effect */
  // Pre-fill values if editing
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setCategory(editData.category || 'Classroom');
      setDescription(editData.description || '');
      setLocation(editData.location || '');
    } else {
      setTitle('');
      setCategory('Classroom');
      setDescription('');
      setLocation('');
    }
    setError('');
  }, [editData, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !location.trim()) {
      return setError('Please fill in all fields');
    }

    try {
      setSubmitting(true);
      await onSubmit({ title, category, description, location });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-md overflow-hidden shadow-sm relative z-10 border border-slate-200 dark:border-white/10 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {editData ? 'Edit Complaint' : 'Submit New Complaint'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">
              Title / Summary
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-white/30 focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30 outline-none transition-all placeholder:text-slate-400"
              placeholder="e.g. Broken bench in room 302"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">
                Category
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-white/30 focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30 outline-none transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">
                Location / Department
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-white/30 focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30 outline-none transition-all placeholder:text-slate-400"
                placeholder="e.g. Block B, 3rd Floor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">
              Full Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 rounded-lg text-sm resize-none bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-white/30 focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/30 outline-none transition-all placeholder:text-slate-400"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/5">
            <Button
              id="btn-form-cancel"
              type="button"
              onClick={onClose}
              variant="secondary"
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button
              id="btn-form-submit"
              type="submit"
              disabled={submitting}
              loading={submitting}
              className="px-5 py-2 text-sm flex items-center gap-2"
            >
              {editData ? (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
