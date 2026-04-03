import { CATEGORY_COLORS } from '../data/mockData'
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

export function formatCurrency(amount, opts = {}) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: opts.compact ? 0 : 2,
    maximumFractionDigits: opts.compact ? 0 : 2,
    notation: opts.compact ? 'compact' : 'standard',
    ...opts,
  }).format(amount)
}

export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  return format(parseISO(dateStr), fmt)
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#94a3b8'
}

export function getSummary(transactions) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  return {
    income,
    expenses,
    balance: income - expenses,
    savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
  }
}

export function getMonthlyData(transactions, months = 6) {
  const today = new Date(2026, 3, 3)
  return Array.from({ length: months }, (_, i) => {
    const ref = subMonths(today, months - 1 - i)
    const start = startOfMonth(ref)
    const end = endOfMonth(ref)
    const inMonth = transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), { start, end })
    )
    const { income, expenses, balance } = getSummary(inMonth)
    return {
      month: format(ref, 'MMM yy'),
      income,
      expenses,
      balance,
    }
  })
}

export function getCategoryBreakdown(transactions) {
  const map = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, color: getCategoryColor(name) }))
    .sort((a, b) => b.value - a.value)
}

export function getInsights(transactions) {
  const today = new Date(2026, 3, 3)
  const thisMonth = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), {
      start: startOfMonth(today),
      end: endOfMonth(today),
    })
  )
  const lastMonth = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), {
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1)),
    })
  )

  const thisBreakdown = getCategoryBreakdown(thisMonth)
  const lastBreakdown = getCategoryBreakdown(lastMonth)

  const thisExpenses = thisMonth
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const lastExpenses = lastMonth
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const thisIncome = thisMonth
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const lastIncome = lastMonth
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const expenseChange =
    lastExpenses > 0 ? ((thisExpenses - lastExpenses) / lastExpenses) * 100 : 0
  const incomeChange =
    lastIncome > 0 ? ((thisIncome - lastIncome) / lastIncome) * 100 : 0

  const topCategory = thisBreakdown[0] || null
  const lastTopCategory = lastBreakdown[0] || null

  return {
    thisExpenses,
    lastExpenses,
    expenseChange,
    thisIncome,
    lastIncome,
    incomeChange,
    topCategory,
    lastTopCategory,
    thisBreakdown,
    lastBreakdown,
    thisSavings: thisIncome - thisExpenses,
    savingsChange:
      lastIncome - lastExpenses > 0
        ? (((thisIncome - thisExpenses) - (lastIncome - lastExpenses)) /
            Math.abs(lastIncome - lastExpenses)) *
          100
        : 0,
  }
}
