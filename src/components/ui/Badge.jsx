import clsx from 'clsx'

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    income:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    expense: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    brand:   'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
  }
  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
