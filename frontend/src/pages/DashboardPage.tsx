import { useDashboardData } from '../hooks/useDashboardData';
import Card from '../components/ui/Card';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import ChartCard from '../components/ui/ChartCard';

const DashboardPage = () => {
  const { deals, workOrders, isLoading, isError, error } = useDashboardData();

  const totalDeals = deals.length;
  const delayedProjects = workOrders.length;

  const safeNumberFromValue = (value: unknown): number => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]+/g, '');
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const directNumber = safeNumberFromValue(record.number ?? record.value ?? record.amount ?? record.total ?? record.amountInRupees ?? record.valueText);
      if (directNumber !== 0 || String(record.number ?? record.value ?? record.amount ?? record.total ?? record.amountInRupees ?? record.valueText ?? '').trim() !== '') {
        return directNumber;
      }

      for (const candidate of Object.values(record)) {
        const nested = safeNumberFromValue(candidate);
        if (nested !== 0) {
          return nested;
        }
      }
    }

    return 0;
  };

  const parseRevenueFromColumn = (col: any): number => {
    const candidates: unknown[] = [col?.text, col?.value, col?.title];

    for (const candidate of candidates) {
      if (candidate !== undefined && candidate !== null && candidate !== '') {
        const direct = safeNumberFromValue(candidate);
        if (direct !== 0 || String(candidate).trim() !== '') {
          return direct;
        }
      }
    }

    if (typeof col?.value === 'string') {
      try {
        const parsed = JSON.parse(col.value);
        return safeNumberFromValue(parsed);
      } catch {
        return 0;
      }
    }

    return 0;
  };

  const findColumnByKeywords = (columns: any[] | undefined, keywords: string[]): any => {
    if (!columns) {
      return undefined;
    }

    const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());

    const directMatch = columns.find((column) => {
      const label = `${column?.title ?? ''} ${column?.id ?? ''} ${column?.text ?? ''}`.toLowerCase();
      return normalizedKeywords.some((keyword) => label.includes(keyword));
    });

    if (directMatch) {
      return directMatch;
    }

    return columns.find((column) => {
      const rawValue = column?.text ?? column?.value ?? '';
      const valueAsString = String(rawValue).trim();
      return normalizedKeywords.some((keyword) => valueAsString.toLowerCase().includes(keyword));
    });
  };

  const totalRevenue = deals.reduce((sum, item) => {
    const col = findColumnByKeywords(item.column_values ?? [], ['revenue', 'deal value', 'masked deal value', 'amount']);
    const parsed = col ? parseRevenueFromColumn(col) : 0;
    return sum + parsed;
  }, 0);

  const averageDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;

  const statusCounts = deals.reduce<Record<string, number>>((counts, item) => {
    const statusCol = findColumnByKeywords(item.column_values ?? [], ['status', 'deal status', 'execution status']);
    const statusValue = (statusCol?.text ?? (statusCol?.value ? String(statusCol.value) : undefined)) || 'Unknown';
    const normalizedStatus = String(statusValue).trim() || 'Unknown';
    counts[normalizedStatus] = (counts[normalizedStatus] || 0) + 1;
    return counts;
  }, {});

  const statusEntries = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Executive Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Live Monday board metrics for deals and work orders.</p>
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading Monday board data..." /> : null}
      {isError ? <ErrorState title="Unable to load dashboard data" message={(error && (error as any).response?.data?.message) ?? (error instanceof Error ? error.message : 'Backend unavailable')} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Deals" value={String(totalDeals)} subtitle="Live Monday board count" tone="accent" />
        <Card title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} subtitle="Calculated from deal revenue" tone="success" />
        <Card title="Average Deal Size" value={`$${averageDealSize.toFixed(0)}`} subtitle="Average deal revenue" tone="default" />
        <Card title="Delayed Projects" value={String(delayedProjects)} subtitle="Live work-order count" tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue Summary">
          <div className="space-y-2 rounded-xl border border-slate-700 p-4 text-sm text-slate-400">
            {totalDeals > 0 ? (
              statusEntries.map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span>{status}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              ))
            ) : (
              <p>No status data available.</p>
            )}
          </div>
        </ChartCard>
        <ChartCard title="Projects by Status">
          <div className="space-y-2 rounded-xl border border-slate-700 p-4 text-sm text-slate-400">
            {statusEntries.length > 0 ? (
              statusEntries.map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span>{status}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              ))
            ) : (
              <p>No status data available.</p>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardPage;
