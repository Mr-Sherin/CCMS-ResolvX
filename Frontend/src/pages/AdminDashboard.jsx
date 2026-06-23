import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import ComplaintTable from '../components/ComplaintTable';
import api from '../services/api';
import { Calendar, RefreshCcw, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import ProfileDetails from '../components/ProfileDetails';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');

  // Fetch admin-level dashboard records
  const fetchAdminData = useCallback(async () => {
    try {
      await Promise.resolve(); // Defer state updates to microtask to prevent synchronous setState within effect
      setLoading(true);
      setError('');
      
      // Setup query parameters for server-side date filter
      const params = {};
      if (dateFilter) {
        params.date = dateFilter;
      }

      const [complaintsRes, statsRes] = await Promise.all([
        api.get('/admin/complaints', { params }),
        api.get('/complaints/stats') // Global stats
      ]);

      setComplaints(complaintsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load admin records:', err);
      setError('Error communicating with database server.');
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminData();
  }, [fetchAdminData]);

  const handleClearFilters = () => {
    setDateFilter('');
  };

  return (
    <div className="bg-slate-50 dark:bg-[#000000] min-h-screen text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 w-full max-w-full px-6 py-8 md:py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Dashboard Content */}
        <main className="space-y-6 w-full overflow-hidden">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Administrative Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Oversee campus maintenance requests, change progress states, and provide resolutions.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Server-side Date Filter (Icon Only) */}
              <div 
                className={`relative inline-flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer border ${
                  dateFilter 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' 
                    : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
                title="Filter by Date"
              >
                <Calendar className="w-4 h-4" />
                <input
                  type="date"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              {dateFilter && (
                <Button
                  id="btn-admin-cleardate"
                  onClick={handleClearFilters}
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                >
                  Clear Date
                </Button>
              )}

              <Button
                id="btn-admin-refresh"
                onClick={fetchAdminData}
                variant="secondary"
                className="p-2 rounded-lg"
                title="Force refresh"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* Profile and Stats Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
            <ProfileDetails user={user} />
            <DashboardCards stats={stats} loading={loading} />
          </div>

          {/* Detailed table view */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-bold font-medium text-slate-550 dark:text-slate-400">
                All Campus Tickets
              </h2>
            </div>
            
            <ComplaintTable
              complaints={complaints}
              userRole="Admin"
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
