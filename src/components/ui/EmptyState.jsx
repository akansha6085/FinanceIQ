export default function EmptyState({ title = 'No data', description = '', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon size={28} className="text-slate-400" />
        </div>
      )}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  )
}
