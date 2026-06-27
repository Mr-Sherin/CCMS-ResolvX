import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import {
  Search,
  User,
  Landmark,
  Edit,
  Trash2,
  X,
  Save,
  Users,
  CheckSquare,
  ShieldAlert
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

const AdminStudents = () => {
  const { user } = useContext(AuthContext);
  
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formSemester, setFormSemester] = useState('');
  const [formAdmissionNo, setFormAdmissionNo] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const studentsRes = await api.get('/master/students');
      setStudents(studentsRes.data);
    } catch (err) {
      console.error('Failed to load records:', err);
      setError('Could not download student records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStudentClick = (student) => {
    setEditStudent(student);
    setFormName(student.name);
    setFormEmail(student.email);
    setFormPassword('');
    setFormDepartment(student.department || '');
    setFormSemester(student.semester || '');
    setFormAdmissionNo(student.admissionNo || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteStudentClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete student "${name}"?`)) {
      try {
        await api.delete(`/master/students/${id}`);
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete student.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    
    const payload = {
      name: formName,
      email: formEmail,
      department: formDepartment,
      semester: formSemester,
      admissionNo: formAdmissionNo,
    };
    if (formPassword) payload.password = formPassword;

    try {
      if (editStudent) {
        const { data } = await api.put(`/master/students/${editStudent._id}`, payload);
        setStudents((prev) => prev.map((s) => (s._id === editStudent._id ? data : s)));
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'An error occurred during submission.');
    } finally {
      setFormSubmitting(false);
    }
  };

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
                Student Administration
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage student records, departments, and credentials.
              </p>
            </div>
          </div>

          {/* Stats summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-lg border-slate-200 dark:border-white/5 flex items-center gap-4">
              <div className="p-3 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Students</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{students.length}</p>
              </div>
            </div>
          </div>

          {/* Manage Area */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="glass-panel p-2 rounded-lg flex items-center border-slate-200 dark:border-white/5 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-md text-sm"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* List Table */}
            {loading ? (
              <div className="text-center py-12">
                <span className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Retrieving records...</p>
              </div>
            ) : error ? (
              <div className="glass-panel p-6 rounded-lg text-center border-slate-200 dark:border-white/5 text-rose-600 dark:text-rose-400 text-sm">
                {error}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="glass-panel p-12 rounded-lg text-center border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-sm">
                No student accounts found.
              </div>
            ) : (
              <div className="glass-panel rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400 font-medium">
                        <th className="py-4 px-6">Student Member</th>
                        <th className="py-4 px-6">Admission No</th>
                        <th className="py-4 px-6">Dept & Sem</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm">
                      {filteredStudents.map((student) => (
                        <tr key={student._id} className="glass-table-row">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-800 dark:text-white">{student.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{student.email}</div>
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-cyan-600 dark:text-cyan-400">
                            {student.admissionNo}
                          </td>
                          <td className="py-4 px-6 text-slate-650 dark:text-slate-300">
                            <div className="font-medium">{student.department}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sem: {student.semester}</div>
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleEditStudentClick(student)}
                                className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500 hover:text-white transition cursor-pointer font-semibold"
                                title="Edit Student"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudentClick(student._id, student.name)}
                                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                                title="Delete Student"
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

      {/* Edit Student Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-full max-w-md rounded-lg overflow-hidden shadow-sm relative z-10 border border-slate-200 dark:border-white/10 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5 mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                Edit Student
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Student Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Admission No</label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs font-mono"
                      value={formAdmissionNo}
                      onChange={(e) => setFormAdmissionNo(e.target.value)}
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
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Semester</label>
                <select
                  className="glass-input w-full px-3 py-2 rounded-lg text-xs cursor-pointer"
                  value={formSemester}
                  onChange={(e) => setFormSemester(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Sem</option>
                  {['S1','S2','S3','S4','S5','S6','S7','S8'].map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email Address (Login ID)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="email"
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">New Password (Leave blank to keep current)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="password"
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs"
                    placeholder="•••••••• (unchanged)"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                  className="px-4 py-2 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formSubmitting}
                  loading={formSubmitting}
                  className="px-4 py-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium"
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

export default AdminStudents;
