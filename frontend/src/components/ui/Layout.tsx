import { NavLink, Outlet } from 'react-router-dom';
import { Sparkles, LayoutDashboard, MessageSquareText, Activity } from 'lucide-react';

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Chat', icon: MessageSquareText },
  { to: '/status', label: 'System Status', icon: Activity }
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-400">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-lg font-semibold">Skylark Drones</p>
              <p className="text-sm text-slate-400">Business Intelligence Agent</p>
            </div>
          </div>
          <nav className="flex gap-2">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:w-72">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-cyan-300">Workspace Overview</p>
            <p className="mt-2 text-sm text-slate-400">
              A reusable UI shell for analytics, AI conversations, and service health.
            </p>
          </div>
        </aside>

        <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
