interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="mb-4 text-sm font-semibold text-slate-200">{title}</p>
      {children}
    </div>
  );
};

export default ChartCard;
