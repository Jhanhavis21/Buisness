const LoadingState = ({ label = 'Loading...' }: { label?: string }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
      <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
      {label}
    </div>
  );
};

export default LoadingState;
