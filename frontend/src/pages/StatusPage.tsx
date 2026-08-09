import { useSystemStatus } from '../hooks/useSystemStatus';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';

const StatusPage = () => {
  const { data, isLoading, isError, error } = useSystemStatus();
  const status = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">System Status</h1>
        <p className="mt-1 text-sm text-slate-400">Monitoring-ready surface for health, Monday integration, and backend connectivity.</p>
      </div>

      {isLoading ? <LoadingState label="Checking services..." /> : null}
      {isError ? <ErrorState title="Health check failed" message={(error && (error as any).response?.data?.message) ?? (error instanceof Error ? error.message : 'Unknown error')} /> : null}

      {status ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Backend Health</p>
            <p className="mt-2 text-xl font-semibold text-white">{status.health.status}</p>
            <p className="mt-1 text-sm text-slate-400">{status.health.service}</p>
            <p className="mt-2 text-sm text-slate-400">Uptime: {status.health.uptime}s</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Monday Integration</p>
            <p className="mt-2 text-xl font-semibold text-white">{status.monday.configured ? 'Connected' : 'Not configured'}</p>
            <p className="mt-2 text-sm text-slate-400">Deals board: {status.monday.boardIds.deals ?? 'unknown'}</p>
            <p className="mt-1 text-sm text-slate-400">Work orders board: {status.monday.boardIds.workOrders ?? 'unknown'}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Last Sync</p>
            <p className="mt-2 text-xl font-semibold text-white">{new Date(status.lastSyncedAt).toLocaleString()}</p>
            <p className="mt-2 text-sm text-slate-400">API Connectivity: {data.success ? 'OK' : 'Unavailable'}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StatusPage;
