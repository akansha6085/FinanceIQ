import { subDays, format, startOfMonth, subMonths } from 'date-fns'

const CATEGORIES = ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Housing', 'Utilities', 'Salary', 'Freelance', 'Investment']

const CATEGORY_COLORS = {
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

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment']

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function seedRand(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const nextRand = seedRand(42)

function generateTransactions() {
  const txns = []
  let id = 1
  const today = new Date(2026, 3, 3) // April 3 2026

  // 6 months of data
  for (let m = 5; m >= 0; m--) {
    const base = subMonths(today, m)
    const year = base.getFullYear()
    const month = base.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Salary every month
    txns.push({
      id: `txn-${id++}`,
      date: format(new Date(year, month, 1), 'yyyy-MM-dd'),
      description: 'Monthly Salary',
      category: 'Salary',
      type: 'income',
      amount: 5800 + Math.floor(nextRand() * 400),
    })

    // Freelance some months
    if (nextRand() > 0.4) {
      txns.push({
        id: `txn-${id++}`,
        date: format(new Date(year, month, rand(5, 15)), 'yyyy-MM-dd'),
        description: 'Freelance Project',
        category: 'Freelance',
        type: 'income',
        amount: 800 + Math.floor(nextRand() * 1200),
      })
    }

    // Investment dividend
    if (nextRand() > 0.6) {
      txns.push({
        id: `txn-${id++}`,
        date: format(new Date(year, month, rand(10, 20)), 'yyyy-MM-dd'),
        description: 'Dividend Payment',
        category: 'Investment',
        type: 'income',
        amount: 150 + Math.floor(nextRand() * 350),
      })
    }

    // Expense transactions
    const expenseDescriptions = {
      'Food & Dining':  ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Food Delivery', 'Bakery'],
      'Transport':      ['Uber Ride', 'Gas Station', 'Parking Fee', 'Train Ticket', 'Bus Pass'],
      'Shopping':       ['Amazon Order', 'Clothing Store', 'Electronics', 'Home Decor', 'Books'],
      'Entertainment':  ['Netflix', 'Spotify', 'Movie Tickets', 'Concert', 'Video Games'],
      'Healthcare':     ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Dental Checkup'],
      'Housing':        ['Rent Payment', 'Home Insurance', 'Maintenance'],
      'Utilities':      ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill'],
    }

    // Recurring
    txns.push({
      id: `txn-${id++}`,
      date: format(new Date(year, month, 1), 'yyyy-MM-dd'),
      description: 'Rent Payment',
      category: 'Housing',
      type: 'expense',
      amount: 1850,
    })
    txns.push({
      id: `txn-${id++}`,
      date: format(new Date(year, month, 5), 'yyyy-MM-dd'),
      description: 'Electricity Bill',
      category: 'Utilities',
      type: 'expense',
      amount: 85 + Math.floor(nextRand() * 40),
    })
    txns.push({
      id: `txn-${id++}`,
      date: format(new Date(year, month, 5), 'yyyy-MM-dd'),
      description: 'Internet Bill',
      category: 'Utilities',
      type: 'expense',
      amount: 65,
    })
    txns.push({
      id: `txn-${id++}`,
      date: format(new Date(year, month, 10), 'yyyy-MM-dd'),
      description: 'Netflix',
      category: 'Entertainment',
      type: 'expense',
      amount: 15,
    })
    txns.push({
      id: `txn-${id++}`,
      date: format(new Date(year, month, 10), 'yyyy-MM-dd'),
      description: 'Spotify',
      category: 'Entertainment',
      type: 'expense',
      amount: 10,
    })
    txns.push({
      id: `txn-${id++}`,
      date: format(new Date(year, month, 15), 'yyyy-MM-dd'),
      description: 'Gym Membership',
      category: 'Healthcare',
      type: 'expense',
      amount: 45,
    })

    // Variable expenses
    const expCats = ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Food & Dining', 'Transport', 'Food & Dining']
    expCats.forEach(cat => {
      if (nextRand() > 0.2) {
        const descArr = expenseDescriptions[cat]
        const desc = descArr[Math.floor(nextRand() * descArr.length)]
        const day = rand(1, daysInMonth)
        const amounts = {
          'Food & Dining': [12, 120],
          'Transport': [8, 80],
          'Shopping': [25, 250],
          'Entertainment': [10, 90],
          'Healthcare': [20, 180],
        }
        const [lo, hi] = amounts[cat] || [10, 100]
        txns.push({
          id: `txn-${id++}`,
          date: format(new Date(year, month, day), 'yyyy-MM-dd'),
          description: desc,
          category: cat,
          type: 'expense',
          amount: lo + Math.floor(nextRand() * (hi - lo)),
        })
      }
    })
  }

  return txns.sort((a, b) => b.date.localeCompare(a.date))
}

export const MOCK_TRANSACTIONS = generateTransactions()

export { CATEGORIES, CATEGORY_COLORS, INCOME_CATEGORIES }
