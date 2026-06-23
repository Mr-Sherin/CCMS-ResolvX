import { useState, useEffect, useContext, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ComplaintTable from '../components/ComplaintTable';
import ComplaintForm from '../components/ComplaintForm';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FileSpreadsheet, RefreshCcw } from 'lucide-react';
import Button from '../components/Button';

const ComplaintList = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const endpoint = user?.role === 'Admin' ? '/admin/complaints' : '/complaints';
      const { data } = await api.get(endpoint);
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints list:', err);
      setError('Could not download complaint logs.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchComplaints();
    }
  }, [user, fetchComplaints]);

  const handleFormSubmit = async (formData) => {
    if (editData) {
      await api.put(`/complaints/${editData._id}`, formData);
    }
    fetchComplaints();
  };

  const handleEditClick = (complaint) => {
    setEditData(complaint);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await api.delete(`/complaints/${id}`);
        fetchComplaints();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete complaint.');
      }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#000000] min-h-screen text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 w-full max-w-full px-6 py-8 md:py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* List Content */}
        <main className="space-y-6 w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {user?.role === 'Admin' ? 'Review Logs' : 'My Complaint Log'}
              </h1>
            </div>

            <Button
              id="btn-list-refresh"
              onClick={fetchComplaints}
              variant="secondary"
              className="p-2 rounded-lg"
              title="Refresh logs"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
              {error}
            </div>
          )}

          <ComplaintTable
            complaints={complaints}
            userRole={user?.role}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        </main>
      </div>

      <ComplaintForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editData={editData}
      />
    </div>
  );
};

export default ComplaintList;
