import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { CATEGORIES } from '../data/mockData'
import { formatCurrency, formatDate } from '../utils/helpers'
import { Badge } from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import TransactionForm from '../components/transactions/TransactionForm'
import {
  Search,
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  ArrowLeftRight,
  ChevronDown,
  X,
} from 'lucide-react'
import clsx from 'clsx'

function CategoryDot({ category }) {
  const colors = {
    'Food & Dining':  '#f97316',
    'Transport':      '#3b82f6',
    'Shopping':       '#a855f7',
    'Entertainment':  '#ec4899',
    'Healthcare':     '#14b8a6',
    'Housing':        '#6366f1',
    'Utilities':      '#f59e0b',
    'Salary':         '#22c55e',
    'Freelance':      '#06b6d4',
    'Investment':     '#84cc16',
  }
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ background: colors[category] || '#94a3b8' }}
    />
  )
}

export default function Transactions() {
  const { role, filters, setFilter, getFilteredTransactions, addTransaction, editTransaction, deleteTransaction, resetFilters } = useStore()

  const filtered = useMemo(() => getFilteredTransactions(), [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    filters,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useStore.getState().transactions,
  ])

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const isAdmin = role === 'admin'
  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all'

  function handleAdd(data) {
    addTransaction(data)
    setAddOpen(false)
  }

  function handleEdit(data) {
    editTransaction(editTarget.id, data)
    setEditTarget(null)
  }

  function handleDelete() {
    deleteTransaction(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="card p-3 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-8"
            placeholder="Search transactions…"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />
          {filters.search && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setFilter('search', '')}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            className="input pr-8 appearance-none min-w-[140px]"
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Type filter */}
        <div className="relative">
          <select
            className="input pr-8 appearance-none min-w-[110px]"
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            className="input pr-8 appearance-none min-w-[140px]"
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: High</option>
            <option value="amount-asc">Amount: Low</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <button className="btn-ghost text-xs" onClick={resetFilters}>
            <X size={13} /> Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setAddOpen(true)}>
              <Plus size={15} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters"
            icon={ArrowLeftRight}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Description</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Type</th>
                  <th className="text-right px-5 py-3 font-medium">Amount</th>
                  {isAdmin && <th className="text-right px-5 py-3 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {filtered.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(txn.date, 'MMM d, yy')}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-[180px]">
                      <span className="truncate block">{txn.description}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <CategoryDot category={txn.category} />
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <Badge variant={txn.type}>{txn.type}</Badge>
                    </td>
                    <td className={clsx(
                      'px-5 py-3.5 text-right font-semibold whitespace-nowrap',
                      txn.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-500'
                    )}>
                      {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount)}
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setEditTarget(txn)}
                            className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(txn)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Viewer hint */}
      {!isAdmin && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Switch to <strong>Admin</strong> role in the header to add or edit transactions.
        </p>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Transaction">
        <TransactionForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Transaction">
        {editTarget && (
          <TransactionForm
            initial={{ ...editTarget, amount: String(editTarget.amount) }}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Transaction" size="sm">
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete{' '}
              <strong>&ldquo;{deleteTarget.description}&rdquo;</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 active:scale-95 transition-all"
                onClick={handleDelete}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
