import { useMemo } from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { useStore } from '../store/useStore'
import {
  getInsights,
  getMonthlyData,
  getCategoryBreakdown,
  formatCurrency,
} from '../utils/helpers'
import StatCard from '../components/ui/StatCard'
import {
  TrendingUp,
  TrendingDown,
  Flame,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Landmark,
  CheckCircle2,
  Wallet,
  AlertTriangle,
  CircleDollarSign,
} from 'lucide-react'
import clsx from 'clsx'

function ChangeChip({ value, invert = false }) {
  const positive = invert ? value <= 0 : value >= 0
  return (
    <span className={clsx(
      'inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
      positive
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
    )}>
      {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-0.5 text-slate-700 dark:text-slate-300">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Insights() {
  const transactions = useStore((s) => s.transactions)
  const insights = useMemo(() => getInsights(transactions), [transactions])
  const monthlyData = useMemo(() => getMonthlyData(transactions, 6), [transactions])
  const allBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions])

  const radarData = allBreakdown.slice(0, 7).map((d) => ({
    subject: d.name.split(' ')[0],
    value: d.value,
  }))

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="This Month's Expenses"
          value={formatCurrency(insights.thisExpenses)}
          subtitle="Current month"
          icon={TrendingDown}
          color="red"
          trend={-insights.expenseChange}
        />
        <StatCard
          title="This Month's Income"
          value={formatCurrency(insights.thisIncome)}
          subtitle="Current month"
          icon={TrendingUp}
          color="green"
          trend={insights.incomeChange}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(insights.thisSavings)}
          subtitle="Income − Expenses"
          icon={PiggyBank}
          color="brand"
          trend={insights.savingsChange}
        />
        <StatCard
          title="Top Spending Category"
          value={insights.topCategory?.name || '—'}
          subtitle={insights.topCategory ? formatCurrency(insights.topCategory.value) : 'No data'}
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Month-over-month comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Comparison table */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Month-over-Month Summary</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Current month vs last month</p>
          <div className="space-y-3">
            {[
              {
                label: 'Income',
                this: insights.thisIncome,
                prev: insights.lastIncome,
                change: insights.incomeChange,
                invert: false,
              },
              {
                label: 'Expenses',
                this: insights.thisExpenses,
                prev: insights.lastExpenses,
                change: insights.expenseChange,
                invert: true,
              },
              {
                label: 'Net Savings',
                this: insights.thisSavings,
                prev: insights.lastIncome - insights.lastExpenses,
                change: insights.savingsChange,
                invert: false,
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prev: {formatCurrency(row.prev)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(row.this)}</p>
                  <ChangeChip value={row.change} invert={row.invert} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category comparison: this vs last month */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Category Spend — This vs Last Month</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Top 6 expense categories</p>
          {insights.thisBreakdown.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-slate-400 text-sm">No data</div>
          ) : (
            <div className="space-y-2.5">
              {insights.thisBreakdown.slice(0, 6).map((cat) => {
                const last = insights.lastBreakdown.find((c) => c.name === cat.name)
                const lastVal = last?.value || 0
                const max = Math.max(cat.value, lastVal, 1)
                const pct = (cat.value / max) * 100
                const lastPct = (lastVal / max) * 100
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                        {cat.name}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(cat.value)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: cat.color }}
                      />
                    </div>
                    {lastVal > 0 && (
                      <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden opacity-40">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${lastPct}%`, background: cat.color }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
              <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                Thicker bar = this month · Thinner bar = last month
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Radar + Trend bar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Radar chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Spending Radar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">All-time category distribution</p>
          {radarData.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-slate-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="currentColor" strokeOpacity={0.1} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }} />
                <Radar
                  name="Spend"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <ReTooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{ fontSize: 12 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly expenses bar */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Monthly Expenses Trend</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">6-month expense breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={42}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="expenses" name="Expenses" radius={[4, 4, 0, 0]}>
                {monthlyData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === monthlyData.length - 1 ? '#f43f5e' : '#fda4af'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Observations callouts */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-brand-600" />
          Key Observations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.topCategory && (
            <Observation
              icon={Landmark}
              title="Highest Spend"
              text={`${insights.topCategory.name} is your biggest expense category this month at ${formatCurrency(insights.topCategory.value)}.`}
              color="amber"
            />
          )}
          <Observation
            icon={insights.expenseChange <= 0 ? CheckCircle2 : AlertTriangle}
            title="Expense Trend"
            text={
              insights.expenseChange <= 0
                ? `Great job! Expenses dropped by ${Math.abs(insights.expenseChange).toFixed(1)}% compared to last month.`
                : `Expenses increased by ${insights.expenseChange.toFixed(1)}% compared to last month. Review your spending.`
            }
            color={insights.expenseChange <= 0 ? 'green' : 'red'}
          />
          <Observation
            icon={insights.thisSavings >= 0 ? CircleDollarSign : Wallet}
            title="Savings Health"
            text={
              insights.thisSavings >= 0
                ? `You saved ${formatCurrency(insights.thisSavings)} this month. Keep it up!`
                : `You overspent by ${formatCurrency(Math.abs(insights.thisSavings))} this month.`
            }
            color={insights.thisSavings >= 0 ? 'green' : 'red'}
          />
        </div>
      </div>
    </div>
  )
}

function Observation({ icon: Icon, title, text, color }) {
  const bg = {
    green: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800',
    red:   'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800',
    amber: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800',
    brand: 'bg-brand-50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-800',
  }
  return (
    <div className={clsx('rounded-xl p-4 border', bg[color])}>
      <div className="mb-2">
        <Icon size={22} className="text-slate-700 dark:text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
    </div>
  )
}
