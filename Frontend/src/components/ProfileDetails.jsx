import { User, Mail, Shield, BookOpen } from 'lucide-react';

const ProfileDetails = ({ user }) => {
  if (!user) return null;

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 dark:border-white/5 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-500" />
      
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <User className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Profile Details
        </h2>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3" />
              {user.role}
            </p>
          </div>
        </div>

        <div className="space-y-3 p-2">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="truncate font-medium">{user.email}</span>
          </div>
          
          {user.role === 'Student' && (
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="font-medium">Account ID: #{user._id?.substring(0, 8) || 'N/A'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
