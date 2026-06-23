import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  User, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Wrench,
  CheckSquare
} from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin controls state
  const [status, setStatus] = useState('Pending');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComplaintDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data);
      setStatus(data.status);
      setResolutionDetails(data.resolutionDetails || '');
    } catch (err) {
      console.error('Error loading complaint details:', err);
      setError(err.response?.data?.message || 'Failed to download complaint details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComplaintDetails();
  }, [fetchComplaintDetails]);

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await api.put(`/admin/status/${id}`, {
        status,
        resolutionDetails
      });
      alert('Complaint status updated successfully!');
      fetchComplaintDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint.');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineStepClass = (stepStatus) => {
    const statusSequence = ['Pending', 'In Progress', 'Resolved'];
    const currentIndex = statusSequence.indexOf(complaint?.status);
    const stepIndex = statusSequence.indexOf(stepStatus);

    if (stepIndex < currentIndex) {
      return 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40';
    } else if (stepIndex === currentIndex) {
      if (stepStatus === 'Resolved') return 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40';
      if (stepStatus === 'In Progress') return 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/40 animate-pulse';
      return 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40';
    }
    return 'border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/2';
  };

  return (
    <div className="bg-slate-50 dark:bg-[#000000] min-h-screen text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 w-full max-w-full px-6 py-8 md:py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
        <Sidebar />

        <main className="space-y-6 w-full">
          {/* Back Action Header */}
          <div className="flex items-center gap-2">
            <Button
              id="btn-details-back"
              onClick={() => navigate(-1)}
              variant="secondary"
              className="p-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Go Back
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <span className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading details...</p>
            </div>
          ) : error ? (
            <div className="glass-panel p-6 rounded-lg border-slate-200 dark:border-white/5 text-rose-600 dark:text-rose-400 text-sm">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Complaint Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-lg border-slate-200 dark:border-white/5 space-y-6">
                  {/* Title & Metadata Header */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                        <Tag className="w-3.5 h-3.5" />
                        {complaint.category}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {complaint.location}
                      </span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {complaint.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 border-t border-b border-slate-200 dark:border-white/5 py-3">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        Raised by: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{complaint.createdBy?.name}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        {formatDate(complaint.createdDate)}
                      </span>
                    </div>
                  </div>

                  {/* Body Text Description */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      Detailed Statement
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line p-4 rounded-md bg-slate-50 dark:bg-white/2 border border-slate-200 dark:border-white/5">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Resolution Output */}
                  {complaint.status === 'Resolved' && (
                    <div className="space-y-2 p-5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      <h3 className="text-sm font-bold font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Resolution Notes
                      </h3>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                        {complaint.resolutionDetails || 'The infrastructure issue has been resolved.'}
                      </p>
                      {complaint.resolvedDate && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500/70 font-mono mt-2">
                          Resolved on: {formatDate(complaint.resolvedDate)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Status Stepper / Admin Form */}
              <div className="space-y-6">
                
                {/* Visual Status Stepper */}
                <div className="glass-panel p-6 rounded-lg border-slate-200 dark:border-white/5 space-y-4">
                  <h3 className="text-sm font-bold font-medium text-slate-550 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    Tracking Timeline
                  </h3>

                  <div className="space-y-6 relative before:absolute before:left-[1.125rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
                    
                    {/* Step 1: Pending */}
                    <div className="relative flex gap-4">
                      <div className={`relative z-10 shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getTimelineStepClass('Pending')}`}>
                        1
                      </div>
                      <div className="pt-1.5">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Ticket Filed</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Defaulting and waiting review.</p>
                      </div>
                    </div>

                    {/* Step 2: In Progress */}
                    <div className="relative flex gap-4">
                      <div className={`relative z-10 shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getTimelineStepClass('In Progress')}`}>
                        2
                      </div>
                      <div className="pt-1.5">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">In Progress</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Campus staff assigned to resolve.</p>
                      </div>
                    </div>

                    {/* Step 3: Resolved */}
                    <div className="relative flex gap-4">
                      <div className={`relative z-10 shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getTimelineStepClass('Resolved')}`}>
                        3
                      </div>
                      <div className="pt-1.5">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Resolved</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Issue cleared with report notes.</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Admin Status update Card */}
                {(user?.role === 'Admin' || user?.role === 'MasterAdmin') && (
                  <div className="glass-panel p-6 rounded-lg border-slate-200 dark:border-white/5 space-y-4 shadow-sm border border-cyan-500/20 active-glow">
                    <h3 className="text-sm font-bold font-medium text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      Take Action
                    </h3>

                    <form onSubmit={handleAdminUpdate} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Set Ticket Status
                        </label>
                        <select
                          className="glass-input w-full px-3 py-2 rounded-lg text-xs cursor-pointer"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          required
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Resolution / Progress Details
                        </label>
                        <textarea
                          rows={4}
                          className="glass-input w-full px-3 py-2 rounded-lg text-xs resize-none"
                          placeholder="Provide repair instructions or details of the fix..."
                          value={resolutionDetails}
                          onChange={(e) => setResolutionDetails(e.target.value)}
                        />
                      </div>

                      <Button
                        id="btn-admin-saveprogress"
                        type="submit"
                        disabled={updating}
                        loading={updating}
                        className="w-full py-2.5 text-xs font-semibold tracking-wider uppercase shadow-sm"
                      >
                        Save Progress
                      </Button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ComplaintDetails;
