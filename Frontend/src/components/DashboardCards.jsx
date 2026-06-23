import { ClipboardList, Clock, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

const DashboardCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel p-6 rounded-lg animate-pulse h-28 flex items-center justify-center border-slate-200 dark:border-white/5">
            <Loader2 className="w-6 h-6 text-slate-400 dark:text-slate-500 animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Complaints',
      value: stats?.total || 0,
      icon: ClipboardList,
      color: 'from-blue-500 to-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'hover:border-indigo-500/40',
      glowColor: 'hover:shadow-indigo-500/10',
    },
    {
      title: 'Pending Review',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'hover:border-amber-500/40',
      glowColor: 'hover:shadow-amber-500/10',
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: RefreshCw,
      color: 'from-cyan-500 to-teal-500',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      borderColor: 'hover:border-cyan-500/40',
      glowColor: 'hover:shadow-cyan-500/10',
    },
    {
      title: 'Resolved',
      value: stats?.resolved || 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-emerald-500/40',
      glowColor: 'hover:shadow-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-[#0a0a0a] p-5 rounded-md border border-slate-200 dark:border-white/10 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
              <Icon className="w-4 h-4" />
              <p className="text-xs font-medium font-medium tracking-wide">
                {card.title}
              </p>
            </div>
            
            <div className="flex-1 flex items-end">
              <h3 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tighter">
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
