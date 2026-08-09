interface CardProps {
  title: string;
  value: string;
  subtitle?: string;
  tone?: 'default' | 'accent' | 'success' | 'warning';
}

const toneClasses = {
  default: 'border-slate-800 bg-slate-900/70 text-slate-100',
  accent: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-100',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-100'
};

const Card = ({ title, value, subtitle, tone = 'default' }: CardProps) => {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClasses[tone]}`}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </div>
  );
};

export default Card;
