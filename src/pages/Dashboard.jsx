import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import {
  getSummary,
  getMonthlyData,
  getCategoryBreakdown,
  formatCurrency,
  formatDate,
} from '../utils/helpers'
import StatCard from '../components/ui/StatCard'
import BalanceTrendChart from '../components/charts/BalanceTrendChart'
import SpendingPieChart from '../components/charts/SpendingPieChart'
import MonthlyBarChart from '../components/charts/MonthlyBarChart'
import { Badge } from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions)

  const summary = useMemo(() => getSummary(transactions), [transactions])
  const monthlyData = useMemo(() => getMonthlyData(transactions, 6), [transactions])
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions])
  const recentTxns = useMemo(() => transactions.slice(0, 5), [transactions])

  const currentMonth = monthlyData[monthlyData.length - 1] || {}
  const prevMonth = monthlyData[monthlyData.length - 2] || {}

  const balanceTrend =
    prevMonth.balance != null && prevMonth.balance !== 0
      ? ((currentMonth.balance - prevMonth.balance) / Math.abs(prevMonth.balance)) * 100
      : undefined
  const incomeTrend =
    prevMonth.income
      ? ((currentMonth.income - prevMonth.income) / prevMonth.income) * 100
      : undefined
  const expTrend =
    prevMonth.expenses
      ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100
      : undefined

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(summary.balance)}
          subtitle="All time net"
          icon={Wallet}
          color="brand"
          trend={balanceTrend}
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.income)}
          subtitle="All time income"
          icon={TrendingUp}
          color="green"
          trend={incomeTrend}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.expenses)}
          subtitle="All time expenses"
          icon={TrendingDown}
          color="red"
          trend={expTrend !== undefined ? -expTrend : undefined}
        />
        <StatCard
          title="Savings Rate"
          value={`${summary.savingsRate.toFixed(1)}%`}
          subtitle="Income kept"
          icon={PiggyBank}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Balance Trend</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last 6 months overview</p>
          </div>
          {monthlyData.length ? (
            <BalanceTrendChart data={monthlyData} />
          ) : (
            <EmptyState title="No trend data" />
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Spending Breakdown</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">By category (all time)</p>
          </div>
          {categoryBreakdown.length ? (
            <SpendingPieChart data={categoryBreakdown} />
          ) : (
            <EmptyState title="No expenses yet" />
          )}
        </div>
      </div>

      {/* Bar Chart + Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Monthly Comparison</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Income vs Expenses</p>
          </div>
          <MonthlyBarChart data={monthlyData} />
        </div>

        <div className="card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest activity</p>
            </div>
            <Link
              to="/transactions"
              className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentTxns.length === 0 ? (
            <EmptyState title="No transactions" />
          ) : (
            <ul className="space-y-3">
              {recentTxns.map((txn) => (
                <li key={txn.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {txn.description}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(txn.date)} · {txn.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-semibold ${
                        txn.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-500'
                      }`}
                    >
                      {txn.type === 'income' ? '+' : '-'}
                      {formatCurrency(txn.amount)}
                    </p>
                    <Badge variant={txn.type}>{txn.type}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
