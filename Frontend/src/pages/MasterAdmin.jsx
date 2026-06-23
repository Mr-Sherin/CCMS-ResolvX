import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginBg from '../assets/admin_page_bg.png';
import adminPanelSide from '../assets/admin_panel_side.png';
import ParticleMesh from '../components/ParticleMesh';
import resolvxIcon from '../assets/resolvx_icon.png';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import {
  ShieldAlert,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Search,
  User,
  Landmark,
  Edit,
  Trash2,
  X,
  Save,
  Users,
  Building,
  CheckSquare,
  Sun,
  Moon
} from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Physics',
  'Chemistry',
  'Mathematics'
];

const MasterAdmin = () => {
  const { user, login, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Authentication State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Dashboard Management State
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formStaffId, setFormStaffId] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch local admins
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/master/admins');
      setAdmins(data);
    } catch (err) {
      console.error('Failed to load local admins:', err);
      setError('Could not download admin records.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Redirect local admins or students if they load this page
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'Student') {
        navigate('/student-dashboard');
      }
    }
  }, [user, navigate]);

  // Sync state if user is logged in
  useEffect(() => {
    if (user && user.role === 'MasterAdmin') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAdmins();
    }
  }, [user, fetchAdmins]);

  // Handle Master / Local Admin Login
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password) {
      return setAuthError('Please fill in all fields');
    }

    try {
      setAuthSubmitting(true);
      const data = await login(email, password);

      if (data.role !== 'MasterAdmin' && data.role !== 'Admin') {
        logout();
        setAuthError('Access Denied: Student accounts cannot access the administrative dashboard.');
        return;
      }

      if (data.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Open Form for Adding
  const handleAddClick = () => {
    setEditAdmin(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormDepartment('');
    setFormStaffId('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Form for Editing
  const handleEditClick = (admin) => {
    setEditAdmin(admin);
    setFormName(admin.name);
    setFormEmail(admin.email);
    setFormPassword(''); // blank for editing unless they want to change
    setFormDepartment(admin.department);
    setFormStaffId(admin.staffId);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formEmail.trim() || !formDepartment || !formStaffId.trim()) {
      return setFormError('Please fill in all required fields');
    }

    if (!editAdmin && !formPassword) {
      return setFormError('Password is required for new admin accounts');
    }

    try {
      setFormSubmitting(true);
      const formData = {
        name: formName,
        email: formEmail,
        department: formDepartment,
        staffId: formStaffId
      };
      if (formPassword) {
        formData.password = formPassword;
      }

      if (editAdmin) {
        await api.put(`/master/admins/${editAdmin._id}`, formData);
      } else {
        await api.post('/master/admins', formData);
      }

      setIsModalOpen(false);
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save admin account details.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Deletion
  const handleDeleteClick = async (adminId, adminName) => {
    if (window.confirm(`Are you sure you want to permanently delete the admin account for ${adminName}?`)) {
      try {
        await api.delete(`/master/admins/${adminId}`);
        fetchAdmins();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete admin.');
      }
    }
  };

  // Filter list
  const filteredAdmins = admins.filter((admin) => {
    const term = searchQuery.toLowerCase();
    return (
      admin.name.toLowerCase().includes(term) ||
      admin.email.toLowerCase().includes(term) ||
      admin.staffId.toLowerCase().includes(term) ||
      admin.department.toLowerCase().includes(term)
    );
  });

  // Render Login view if user is not authenticated as MasterAdmin
  if (!user || user.role !== 'MasterAdmin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans antialiased">

        {/* ── 3D PARTICLE MESH BACKGROUND ── */}
        <div className="absolute inset-0" style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #020617 100%)' : 'linear-gradient(135deg, #e8e8ee 0%, #dfe0e8 30%, #eaeaef 60%, #e4e5ec 100%)' }}>
          <ParticleMesh />
        </div>

        {/* ── BACK TO HOME (top-left) ── */}
        <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-1.5 px-3 py-2 rounded-md backdrop-blur-md border text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition text-sm font-medium shadow-sm" style={{ background: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)', borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)' }}>
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>



        {/* ── MAIN CARD ── */}
        <div className="w-full max-w-5xl h-auto lg:h-[600px] min-h-[600px] rounded-3xl border flex flex-col lg:flex-row overflow-hidden relative z-10 backdrop-blur-xl"
          style={{
            background: theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.12)',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(120, 80, 200, 0.08), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>

          {/* ── LEFT: FORM PANEL ── */}
          <div className="order-2 lg:order-1 w-full lg:w-1/2 flex flex-col px-6 py-8 sm:px-10 relative backdrop-blur-md"
            style={{ background: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.35)' }}>

            {/* Top brand */}
            <div className="flex items-center gap-2.5 mb-4">
              <img src={resolvxIcon} alt="ResolvX Icon" className="w-7 h-7 object-contain" />
              <span className="font-bold text-lg tracking-wider text-slate-900 dark:text-white">ResolvX Admin</span>
            </div>

            {/* Heading — vertically centered */}
            <div className="my-auto space-y-6">
              <div>
                <h2 className="text-[28px] font-black tracking-tight" style={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>
                  Secure Sign In
                </h2>
                <p className="text-xs mt-1.5" style={{ color: theme === 'dark' ? '#64748b' : '#94a3b8' }}>
                  Restricted to authorised administrators only.
                </p>
              </div>

              {/* Error */}
              {authError && (
                <div className="p-3 rounded-md text-xs flex items-start gap-2.5"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0 mt-0.5" />
                  <p className="font-semibold leading-relaxed">{authError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color: theme === 'dark' ? '#475569' : '#94a3b8' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                    <input type="email"
                      className="w-full text-sm py-3 pl-10 pr-4 rounded-md transition-all focus:outline-none"
                      style={{
                        background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
                        color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)'}
                      onBlur={e => e.target.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color: theme === 'dark' ? '#475569' : '#94a3b8' }}>
                    Password / Security Key
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                    <input type={showPassword ? 'text' : 'password'}
                      className="w-full text-sm py-3 pl-10 pr-11 rounded-md transition-all focus:outline-none"
                      style={{
                        background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
                        color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)'}
                      onBlur={e => e.target.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                      style={{ color: '#64748b' }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={authSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-white font-bold text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                  style={{ background: 'linear-gradient(to right, #06b6d4, #3b82f6)', boxShadow: '0 4px 14px 0 rgba(6, 182, 212, 0.39)' }}
                >
                  {authSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ChevronRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>

            {/* Footer */}
            <p className="text-[11px]" style={{ color: theme === 'dark' ? '#334155' : '#cbd5e1' }}>
              Students →{' '}
              <a href="/" className="font-semibold hover:underline" style={{ color: '#06b6d4' }}>Student Portal</a>
            </p>
          </div>

          {/* ── RIGHT: PHOTO PANEL ── */}
          <div className="order-1 lg:order-2 flex w-full h-[250px] sm:h-[350px] lg:h-auto lg:w-1/2 relative overflow-hidden">
            {/* Campus photo fills the panel */}
            <img
              src={adminPanelSide}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ display: 'block' }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0" style={{ background: theme === 'dark' ? 'rgba(4,6,18,0.60)' : 'rgba(8,14,40,0.45)' }} />

            {/* Bottom text */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <img src={resolvxIcon} alt="ResolvX Icon" className="w-5 h-5 object-contain" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">ResolvX Admin</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-snug">
                Manage. Monitor.<br />Resolve.
              </h3>
              <p className="text-sm text-white/50 mt-2 leading-relaxed max-w-xs">
                Oversee campus complaints, staff accounts, and departmental operations from one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Dashboard View if authenticated
  return (
    <div className="animated-bg min-h-screen text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 w-full max-w-full px-6 py-8 md:py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
        <Sidebar />

        <main className="space-y-6 w-full overflow-hidden">
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Master Administration Control
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Provision new admin logins, manage staffs/teachers credentials, and view system status.
              </p>
            </div>

            <Button
              id="btn-master-addadmin"
              onClick={handleAddClick}
              className="flex items-center gap-1 px-4 py-2.5 text-sm bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Local Admin
            </Button>
          </div>

          {/* Stats summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-lg border-slate-200 dark:border-white/5 flex items-center gap-4">
              <div className="p-3 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Local Admins</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{admins.length}</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-lg border-slate-200 dark:border-white/5 flex items-center gap-4">
              <div className="p-3 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Active Departments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {new Set(admins.map((a) => a.department)).size}
                </p>
              </div>
            </div>
          </div>

          {/* Manage Area */}
          <div className="space-y-4">
            {/* Search filter panel */}
            <div className="glass-panel p-4 rounded-lg flex items-center justify-between border-slate-200 dark:border-white/5">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-md text-sm"
                  placeholder="Search by name, email, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Admins List Table */}
            {loading ? (
              <div className="text-center py-12">
                <span className="inline-block w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Retrieving records...</p>
              </div>
            ) : error ? (
              <div className="glass-panel p-6 rounded-lg text-center border-slate-200 dark:border-white/5 text-rose-600 dark:text-rose-400 text-sm">
                {error}
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="glass-panel p-12 rounded-lg text-center border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-sm">
                No local admin accounts found.
              </div>
            ) : (
              <div className="glass-panel rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400 font-medium">
                        <th className="py-4 px-6">Staff Member</th>
                        <th className="py-4 px-6">Staff ID</th>
                        <th className="py-4 px-6">Department</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm">
                      {filteredAdmins.map((admin) => (
                        <tr key={admin._id} className="glass-table-row">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-800 dark:text-white">{admin.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{admin.email}</div>
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-cyan-600 dark:text-cyan-400">
                            {admin.staffId}
                          </td>
                          <td className="py-4 px-6 text-slate-650 dark:text-slate-300">
                            {admin.department}
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleEditClick(admin)}
                                className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500 hover:text-white transition cursor-pointer font-semibold"
                                title="Edit Admin"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(admin._id, admin.name)}
                                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                                title="Delete Admin"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add / Edit Admin Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-full max-w-md rounded-lg overflow-hidden shadow-sm relative z-10 border border-slate-200 dark:border-white/10 p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5 mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                {editAdmin ? 'Edit Local Admin' : 'Provision Local Admin'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Staff Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs"
                    placeholder="e.g. Professor Smith"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Staff ID</label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs font-mono"
                      placeholder="STF-2026-XXXX"
                      value={formStaffId}
                      onChange={(e) => setFormStaffId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Department</label>
                  <select
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs cursor-pointer"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Dept</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email Address (Login ID)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="email"
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs"
                    placeholder="name@college.edu"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {editAdmin ? 'New Password (Leave blank to keep current)' : 'Account Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="password"
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs"
                    placeholder={editAdmin ? '•••••••• (unchanged)' : '••••••••'}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    required={!editAdmin}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex justify-end gap-2">
                <Button
                  id="btn-master-cancel"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                  className="px-4 py-2 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  id="btn-master-save"
                  type="submit"
                  disabled={formSubmitting}
                  loading={formSubmitting}
                  className="px-4 py-2 text-xs bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-medium"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterAdmin;
