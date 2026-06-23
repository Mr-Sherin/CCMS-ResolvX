import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  Tag,
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

const ComplaintTable = ({ 
  complaints, 
  userRole, 
  onEdit, 
  onDelete, 
  loading 
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Status badge style mapping
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400">
            <TrendingUp className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-500/10 dark:border-slate-500/20 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  // Format dates cleanly
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter complaints list dynamically
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesCategory = categoryFilter ? c.category === categoryFilter : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [
    'Classroom', 'Laboratory', 'Hostel', 'Library', 
    'Internet/Wi-Fi', 'Electrical', 'Water Supply', 'Cleanliness', 'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Filtering Header panel */}
      <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-md flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            className="glass-input w-full pl-10 pr-4 py-2 rounded-md text-sm"
            placeholder="Search title, desc, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" />
            Filter by:
          </div>

          <select
            className="glass-input px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="glass-input px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints Grid/Table */}
      {loading ? (
        <div className="text-center py-12">
          <span className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white dark:bg-[#0a0a0a] p-12 rounded-md text-center border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No complaints found matching criteria.</p>
        </div>
      ) : (
        <>
          {/* Mobile Screen: Responsive list layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredComplaints.map((c) => (
              <div 
                key={c._id} 
                className="bg-white dark:bg-[#0a0a0a] p-5 rounded-md border border-slate-200 dark:border-white/5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{c.title}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450">{formatDate(c.createdDate)}</span>
                  </div>
                  {getStatusBadge(c.status)}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{c.description}</p>

                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <Tag className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    {c.category}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <MapPin className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    {c.location}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/complaint/${c._id}`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>

                  {userRole === 'Student' && c.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onEdit(c)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition cursor-pointer font-semibold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(c._id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Screen: Traditional Table */}
          <div className="hidden md:block bg-white dark:bg-[#0a0a0a] rounded-md border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400 font-medium">
                    <th className="py-4 px-6">Complaint Title</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Submitted Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm">
                  {filteredComplaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800 dark:text-white truncate max-w-xs">{c.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{c.description}</div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Tag className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          {c.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          {c.location}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500" />
                          {formatDate(c.createdDate)}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/complaint/${c._id}`)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {userRole === 'Student' && c.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => onEdit(c)}
                                className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition cursor-pointer font-semibold"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDelete(c._id)}
                                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComplaintTable;
