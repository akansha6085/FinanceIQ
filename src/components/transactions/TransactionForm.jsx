import { useState } from 'react'
import { CATEGORIES } from '../../data/mockData'
import { format } from 'date-fns'

const EMPTY = {
  description: '',
  amount: '',
  category: CATEGORIES[0],
  type: 'expense',
  date: format(new Date(), 'yyyy-MM-dd'),
}

export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.description.trim()) e.description = 'Description is required'
    const amt = parseFloat(form.amount)
    if (isNaN(amt) || amt <= 0) e.amount = 'Enter a valid positive amount'
    if (!form.date) e.date = 'Date is required'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => {
      const n = { ...e }
      delete n[key]
      return n
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Description
          </label>
          <input
            className="input"
            placeholder="e.g. Grocery Store"
            value={form.description}
            maxLength={80}
            onChange={(e) => field('description', e.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Amount ($)
          </label>
          <input
            className="input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => field('amount', e.target.value)}
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Date
          </label>
          <input
            className="input"
            type="date"
            value={form.date}
            max={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => field('date', e.target.value)}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-rose-500">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Type
          </label>
          <select
            className="input"
            value={form.type}
            onChange={(e) => field('type', e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Category
          </label>
          <select
            className="input"
            value={form.category}
            onChange={(e) => field('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Transaction
        </button>
      </div>
    </form>
  )
}
