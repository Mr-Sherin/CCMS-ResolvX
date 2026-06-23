import { useState, useEffect, useContext, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import ComplaintTable from '../components/ComplaintTable';
import ComplaintForm from '../components/ComplaintForm';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, CheckSquare, RefreshCcw, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import ProfileDetails from '../components/ProfileDetails';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [complaintsRes, statsRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/complaints/stats')
      ]);
      setComplaints(complaintsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not update dashboard logs. Check connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleFormSubmit = async (formData) => {
    if (editData) {
      // Update existing
      await api.put(`/complaints/${editData._id}`, formData);
    } else {
      // Create new
      await api.post('/complaints', formData);
    }
    fetchDashboardData();
  };

  const handleEditClick = (complaint) => {
    setEditData(complaint);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await api.delete(`/complaints/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete complaint.');
      }
    }
  };

  const handleOpenNewForm = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-slate-50 dark:bg-[#000000] min-h-screen text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 w-full max-w-full px-6 py-8 md:py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
        {/* Sidebar Navigation */}
        <Sidebar onOpenRaiseForm={handleOpenNewForm} />

        {/* Dashboard Content */}
        <main className="space-y-6 overflow-hidden w-full">
          {/* Header section */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {user?.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Here's a breakdown of your campus infrastructure reports.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                id="btn-student-refresh"
                onClick={fetchDashboardData}
                variant="secondary"
                className="p-2.5 rounded-md"
                title="Refresh stats"
              >
                <RefreshCcw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </Button>
              <Button
                id="btn-student-raise"
                onClick={handleOpenNewForm}
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-md"
              >
                <Plus className="w-4 h-4" />
                Raise Complaint
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
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
              <CheckSquare className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <h2 className="text-sm font-bold font-medium text-slate-550 dark:text-slate-400">
                Recent Submissions
              </h2>
            </div>
            
            <ComplaintTable
              complaints={complaints}
              userRole="Student"
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              loading={loading}
            />
          </div>
        </main>
      </div>

      {/* Raised/Edit Form overlay */}
      <ComplaintForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editData={editData}
      />
    </div>
  );
};

export default StudentDashboard;
