import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Eye, EyeOff, ShieldAlert, Sun, Moon, ChevronLeft, ChevronRight, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import ParticleMesh from '../components/ParticleMesh';
import resolvxIcon from '../assets/resolvx_icon.png';
import authV1 from '../assets/auth_v1.png';
import authV2 from '../assets/auth_v2.png';
import authV3 from '../assets/auth_v3.png';

const SLIDES = [
  { src: authV1, caption: 'Track Every Complaint', sub: 'Organised categories, real-time status updates.' },
  { src: authV2, caption: 'Submit from Anywhere', sub: 'Report campus issues in seconds from any device.' },
  { src: authV3, caption: 'Fast Resolutions', sub: 'Collaborate with staff and see issues get fixed.' },
];


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [semesterOpen, setSemesterOpen] = useState(false);
  const semesterRef = useRef(null);
  const intervalRef = useRef(null);

  // Close semester dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (semesterRef.current && !semesterRef.current.contains(e.target)) {
        setSemesterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { register, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const goTo = (idx) => setActiveSlide((idx + SLIDES.length) % SLIDES.length);
  const prev = () => goTo(activeSlide - 1);
  const next = () => goTo(activeSlide + 1);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveSlide(s => (s + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, activeSlide]);

  // Redirect if user already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'MasterAdmin') {
        navigate('/admin');
      } else {
        navigate('/student-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !department || !admissionNo || !semester || !otp) {
      return setError('Please fill in all fields (including OTP).');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setSubmitting(true);
      await register(
        name,
        email,
        password,
        'Student',
        admissionNo,
        undefined,
        department,
        semester,
        otp
      );
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      return setError('Please enter your email first.');
    }
    try {
      setIsSendingOtp(true);
      setError('');
      await api.post('/auth/send-otp', { email });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">

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
        }}
      >
        
        {/* LEFT PANEL - Form Content Area */}
        <div className="order-2 lg:order-1 w-full lg:w-1/2 px-6 py-8 sm:px-10 flex flex-col relative backdrop-blur-md"
          style={{ background: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.35)' }}
        >
          
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-2 mb-3">
            <img src={resolvxIcon} alt="ResolvX Icon" className="w-7 h-7 object-contain" />
            <span className="font-bold text-lg tracking-wider text-slate-900 dark:text-white">ResolvX Student</span>
          </div>

          <div className="space-y-3">
            {/* Form Header */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                Ready to start your success story?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Create your student account to submit and track your campus complaints.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Main Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-slate-800 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors text-sm rounded-none pl-0 pr-0"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Admission No */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    Admission Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-slate-800 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors text-sm rounded-none pl-0 pr-0"
                    placeholder="Enter your admission number"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    required
                  />
                </div>

                {/* Email Address (Spans 2 columns) */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-slate-800 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors text-sm rounded-none pl-0 pr-0"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={otpSent}
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || otpSent || !email}
                      className="px-4 py-1.5 whitespace-nowrap bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-lg transition-colors border border-slate-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingOtp ? 'Sending...' : (otpSent ? 'Sent' : 'Send OTP')}
                    </button>
                  </div>
                </div>

                {/* OTP Input (Spans 2 columns) */}
                {otpSent && (
                  <div className="space-y-1 sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider flex items-center gap-2">
                      Enter OTP <span className="text-[10px] font-normal text-cyan-600 dark:text-cyan-400">(Sent to {email})</span>
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-slate-800 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors text-sm rounded-none pl-0 pr-0"
                      placeholder="6-digit code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Department (Spans 1 column now) */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    Department
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-slate-800 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors text-sm rounded-none pl-0 pr-0"
                    placeholder="Enter your department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>

                {/* Semester (Spans 1 column now) */}
                <div className="space-y-1" ref={semesterRef}>
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    Semester
                  </label>
                  <div className="relative">
                    {/* Trigger */}
                    <button
                      type="button"
                      onClick={() => setSemesterOpen(o => !o)}
                      className="w-full flex items-center justify-between border-b border-slate-200 dark:border-white/10 py-2 text-sm text-left transition-colors focus:outline-none cursor-pointer"
                      style={{ color: semester ? undefined : '#94a3b8' }}
                    >
                      <span className={semester ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}>
                        {semester ? `Semester ${semester}` : 'Select semester'}
                      </span>
                      <ChevronDown
                        className="w-4 h-4 text-slate-400 transition-transform duration-200"
                        style={{ transform: semesterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>

                    {/* Dropdown Panel */}
                    {semesterOpen && (
                      <div
                        className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md overflow-hidden"
                        style={{
                          background: theme === 'dark' ? '#111827' : '#ffffff',
                          border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
                        }}
                      >
                        <div className="p-2 grid grid-cols-4 gap-1">
                          {['S1','S2','S3','S4','S5','S6','S7','S8'].map(sem => (
                            <button
                              key={sem}
                              type="button"
                              onClick={() => { setSemester(sem); setSemesterOpen(false); }}
                              className="flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
                              style={{
                                background: semester === sem
                                  ? (theme === 'dark' ? 'rgba(6,182,212,0.18)' : 'rgba(99,102,241,0.1)')
                                  : 'transparent',
                                color: semester === sem
                                  ? (theme === 'dark' ? '#22d3ee' : '#6366f1')
                                  : (theme === 'dark' ? '#cbd5e1' : '#475569'),
                                border: semester === sem
                                  ? (theme === 'dark' ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(99,102,241,0.25)')
                                  : '1px solid transparent',
                              }}
                            >
                              {semester === sem && <Check className="w-3 h-3" />}
                              {sem}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 pl-0 pr-8 text-slate-800 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors text-sm rounded-none"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 pl-0 pr-8 text-slate-800 dark:text-slate-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors text-sm rounded-none"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-register-submit"
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-[#a2d2ff] hover:bg-[#8ecae6] text-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer mt-4"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-slate-800 dark:border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          </div>

          {/* Redirect Container */}
          <div className="mt-auto pt-4 text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>

        </div>

        {/* RIGHT PANEL - Illustration Carousel */}
        <div
          className="order-1 lg:order-2 flex w-full h-[250px] sm:h-[350px] lg:h-auto lg:w-1/2 overflow-hidden border-b lg:border-b-0 lg:border-l border-slate-100 dark:border-white/[0.04] relative bg-[#f0f6ff] dark:bg-[#000000] flex-col"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Dark mode ambient glows */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden dark:block">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>

          {/* Slides */}
          <div className="relative w-full flex-1 overflow-hidden">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: i === activeSlide ? 1 : 0, zIndex: i === activeSlide ? 10 : 0 }}
              >
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="w-full h-full object-cover object-center"
                  style={{ display: 'block' }}
                />
                {/* Dark overlay */}
                <div
                  className="absolute inset-0 pointer-events-none hidden dark:block"
                  style={{
                    background: 'linear-gradient(135deg, rgba(7,9,26,0.55) 0%, rgba(7,9,26,0.3) 50%, rgba(7,9,26,0.6) 100%)',
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Caption bar */}
          <div className="absolute bottom-0 left-0 right-0 z-30 px-8 py-5"
            style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.72) 0%, transparent 100%)' }}>
            <p className="text-white font-bold text-base leading-tight drop-shadow">
              {SLIDES[activeSlide].caption}
            </p>
            <p className="text-white/70 text-xs mt-0.5">{SLIDES[activeSlide].sub}</p>

            {/* Dot indicators + arrows */}
            <div className="flex items-center gap-3 mt-3">
              <button onClick={prev} className="p-1 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      width: i === activeSlide ? '20px' : '6px',
                      height: '6px',
                      borderRadius: '99px',
                      background: i === activeSlide ? '#ffffff' : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </div>
              <button onClick={next} className="p-1 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
