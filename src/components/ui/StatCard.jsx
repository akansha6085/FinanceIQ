import clsx from 'clsx'

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'brand', className }) {
  const colors = {
    brand:  { bg: 'bg-brand-50 dark:bg-brand-900/20',  icon: 'text-brand-600 dark:text-brand-400' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400' },
    red:    { bg: 'bg-rose-50 dark:bg-rose-900/20',    icon: 'text-rose-600 dark:text-rose-400' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',  icon: 'text-amber-600 dark:text-amber-400' },
    cyan:   { bg: 'bg-cyan-50 dark:bg-cyan-900/20',    icon: 'text-cyan-600 dark:text-cyan-400' },
  }
  const c = colors[color]

  return (
    <div className={clsx('card p-5 flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {Icon && (
          <span className={clsx('p-2 rounded-xl', c.bg)}>
            <Icon size={18} className={c.icon} />
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {trend !== undefined && (
        <div className={clsx('text-xs font-medium flex items-center gap-1', trend >= 0 ? 'text-emerald-600' : 'text-rose-500')}>
          <span>{trend >= 0 ? '▲' : '▼'}</span>
          <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
        </div>
      )}
    </div>
  )
}
