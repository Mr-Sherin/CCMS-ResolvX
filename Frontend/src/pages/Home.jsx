import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Clock, ChevronRight, Mail, MapPin, Phone, Calendar, RefreshCw, FileText, CheckCircle2, Search, Eye, ShieldAlert, Wifi, Droplets } from 'lucide-react';
import heroBg from '../assets/custom_hero.jpg';
import resolvxIcon from '../assets/resolvx_icon.png';

const Home = () => {
  return (
    <div className="bg-white dark:bg-[#000000] min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={resolvxIcon} alt="ResolvX Icon" className="w-8 h-8 object-contain" />
            <span className="font-bold tracking-tight text-lg">ResolvX</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
          {/* Subtle background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="flex w-2 h-2 rounded-full bg-blue-500"></span>
                Campus Guard v2.0 is now live
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Streamline your campus <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                  infrastructure management.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                ResolvX provides a centralized, transparent platform for students and administration to resolve facility issues instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  Access Portal
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <a 
                  href="#features" 
                  className="flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 font-medium transition-colors"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right Background Image / Illustration */}
            <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center lg:justify-end z-0">
               {/* Faded decorative blob behind image */}
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/10 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
               
               <img 
                 src={heroBg} 
                 alt="Students on campus illustration" 
                 className="relative object-contain w-full h-full max-w-[600px] drop-shadow-2xl z-10 transition-transform hover:scale-[1.02] duration-700"
                 style={{
                   maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                   WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                 }}
               />
            </div>

          </div>
        </section>


        {/* About Section */}
        <section id="about" className="py-24 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold tracking-tight">About the System</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                ResolvX is designed to eliminate the friction between reporting an issue and getting it fixed. Whether it's a broken projector in the computer science lab or a Wi-Fi outage in the hostel, our platform ensures that requests are instantly routed to the correct administrative personnel.
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                By maintaining a clear digital paper trail, we guarantee accountability, faster resolution times, and a better campus experience for everyone.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] aspect-[4/3] flex items-center justify-center p-8 order-2 md:order-1">
               {/* High-Fidelity Dashboard Mockup */}
               <div className="w-full bg-slate-50 dark:bg-[#000000] rounded-md border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col text-left">
                 {/* Mockup Header */}
                 <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-start bg-white dark:bg-[#0a0a0a]">
                   <div>
                     <h4 className="font-bold text-slate-900 dark:text-white text-sm">Administrative Dashboard</h4>
                     <p className="text-[10px] text-slate-500 mt-0.5">Oversee campus maintenance requests.</p>
                   </div>
                   <div className="flex gap-1.5">
                     <div className="p-1 rounded border border-slate-200 dark:border-white/10 text-slate-400"><Calendar className="w-3 h-3" /></div>
                     <div className="p-1 rounded border border-slate-200 dark:border-white/10 text-slate-400"><RefreshCw className="w-3 h-3" /></div>
                   </div>
                 </div>
                 
                 {/* Mockup Stats */}
                 <div className="p-4 grid grid-cols-4 gap-2 border-b border-slate-200 dark:border-white/10">
                   {[
                     { label: 'Total Complaints', val: '3', icon: <FileText className="w-3 h-3 text-slate-400" /> },
                     { label: 'Pending Review', val: '1', icon: <Clock className="w-3 h-3 text-amber-500" /> },
                     { label: 'In Progress', val: '1', icon: <RefreshCw className="w-3 h-3 text-blue-500" /> },
                     { label: 'Resolved', val: '1', icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" /> }
                   ].map((stat, i) => (
                     <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded p-2 flex flex-col gap-1">
                       <div className="flex items-center gap-1">
                         {stat.icon}
                         <span className="text-[9px] text-slate-500 truncate">{stat.label}</span>
                       </div>
                       <span className="font-bold text-sm text-slate-900 dark:text-white">{stat.val}</span>
                     </div>
                   ))}
                 </div>
                 
                 {/* Mockup Table Area */}
                 <div className="p-4 flex-1 bg-white dark:bg-[#0a0a0a]">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="flex-1 border border-slate-200 dark:border-white/10 rounded px-2 py-1 flex items-center gap-2 bg-slate-50 dark:bg-[#111111]">
                       <Search className="w-3 h-3 text-slate-400" />
                       <div className="h-2 w-24 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                     </div>
                     <div className="w-16 h-5 border border-slate-200 dark:border-white/10 rounded bg-slate-50 dark:bg-[#111111]"></div>
                   </div>
                   
                   <div className="space-y-2">
                     <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                       <div className="flex items-center gap-2 w-1/2">
                         <Wifi className="w-3 h-3 text-cyan-500" />
                         <div className="space-y-1">
                           <div className="h-2 w-28 bg-slate-800 dark:bg-slate-200 rounded-full"></div>
                           <div className="h-1.5 w-16 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                         </div>
                       </div>
                       <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">In Progress</span>
                       <Eye className="w-3 h-3 text-slate-300" />
                     </div>
                     <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                       <div className="flex items-center gap-2 w-1/2">
                         <ShieldAlert className="w-3 h-3 text-amber-500" />
                         <div className="space-y-1">
                           <div className="h-2 w-24 bg-slate-800 dark:bg-slate-200 rounded-full"></div>
                           <div className="h-1.5 w-12 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                         </div>
                       </div>
                       <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Pending</span>
                       <Eye className="w-3 h-3 text-slate-300" />
                     </div>
                     <div className="flex items-center justify-between py-1.5">
                       <div className="flex items-center gap-2 w-1/2">
                         <Droplets className="w-3 h-3 text-blue-400" />
                         <div className="space-y-1">
                           <div className="h-2 w-32 bg-slate-800 dark:bg-slate-200 rounded-full"></div>
                           <div className="h-1.5 w-20 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                         </div>
                       </div>
                       <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Resolved</span>
                       <Eye className="w-3 h-3 text-slate-300" />
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-t border-slate-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
              <p className="text-slate-500 dark:text-slate-400">Everything you need to manage facility requests efficiently and transparently.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-blue-500" />,
                  title: 'Instant Logging',
                  desc: 'File complaints in seconds with categorized tags, detailed descriptions, and exact campus locations.'
                },
                {
                  icon: <Clock className="w-6 h-6 text-blue-500" />,
                  title: 'Real-time Tracking',
                  desc: 'Students can track the exact status of their tickets from "Pending" to "In Progress" to "Resolved".'
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
                  title: 'Admin Dashboard',
                  desc: 'Administrators get a birds-eye view of all campus tickets, complete with statistical breakdowns and filtering.'
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-md bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors space-y-4">
                  <div className="w-12 h-12 rounded-md bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#050505]">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
              <p className="text-slate-500 dark:text-slate-400">Need help accessing the portal or have an urgent query? Contact the IT support desk.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-3 p-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">support@campus.edu</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">+91 9496576872</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-center">IT Block, Room 101<br/>Main Campus</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-slate-200 dark:border-white/10 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Campus Complaint Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
