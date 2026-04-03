# FinanceIQ — Personal Finance Dashboard

A polished, fully interactive finance dashboard built for an internship evaluation. Designed with clean UI/UX, responsive layout, role-based access control, and rich data visualisations.

---

## Live Features

| Feature | Details |
|---|---|
| **Dashboard Overview** | Summary cards for Balance, Income, Expenses, Savings Rate with month-over-month trend arrows |
| **Balance Trend Chart** | 6-month area chart showing Income / Expenses / Net Balance |
| **Spending Pie Chart** | Donut chart breaking down expenses by category with percentage labels |
| **Monthly Bar Chart** | Grouped bar chart comparing Income vs Expenses per month |
| **Transactions Page** | Full table with search, category filter, type filter, and sort (date/amount) |
| **Role-Based UI** | Viewer (read-only) vs Admin (add / edit / delete transactions) — toggle in the header |
| **Add/Edit/Delete** | Admin modal forms with client-side validation and optimistic Zustand updates |
| **Insights Page** | KPI cards, MoM comparison table, category progress bars, spending radar chart |
| **Key Observations** | Auto-generated callouts: top category, expense trend, savings health |
| **Dark Mode** | System-aware toggle, persisted to localStorage |
| **Data Persistence** | All state (transactions, role, dark mode) persisted via Zustand `persist` middleware |
| **Responsive Design** | Mobile-first layout with collapsible sidebar on small screens |
| **Empty States** | Graceful handling when filters return no results |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **React 18 + Vite** | Fast HMR, minimal config, modern defaults |
| Routing | **React Router v6** | Declarative nested routes with `<Outlet>` |
| State | **Zustand + persist** | Lightweight, no boilerplate, localStorage persistence built-in |
| Charts | **Recharts** | React-native SVG charts, composable and flexible |
| Styling | **Tailwind CSS v3** | Utility-first, dark mode via `class` strategy |
| Icons | **Lucide React** | Consistent icon set, tree-shakeable |
| Date util | **date-fns** | Lightweight date formatting and arithmetic |
| Utility | **clsx** | Conditional class merging |

---

## Project Structure

```
src/
├── App.jsx                   # Router + dark-mode init
├── main.jsx
├── index.css                 # Tailwind directives + custom utilities
├── data/
│   └── mockData.js           # 6-month seeded transaction data + category metadata
├── store/
│   └── useStore.js           # Zustand store — state, actions, derived selectors
├── utils/
│   └── helpers.js            # formatCurrency, getSummary, getMonthlyData, insights
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx     # Sidebar + Header shell with <Outlet>
│   │   ├── Sidebar.jsx       # Nav links, mobile overlay
│   │   └── Header.jsx        # Role switcher, dark mode toggle, page title
│   ├── charts/
│   │   ├── BalanceTrendChart.jsx
│   │   ├── SpendingPieChart.jsx
│   │   └── MonthlyBarChart.jsx
│   ├── transactions/
│   │   └── TransactionForm.jsx  # Controlled form with validation
│   └── ui/
│       ├── StatCard.jsx
│       ├── Badge.jsx
│       ├── EmptyState.jsx
│       └── Modal.jsx
└── pages/
    ├── Dashboard.jsx         # Overview: cards + 3 charts + recent transactions
    ├── Transactions.jsx      # Table + filters + RBAC add/edit/delete
    └── Insights.jsx          # MoM analysis, radar chart, observation callouts
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repo-url>
cd finance-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Role-Based UI

The role switcher is in the **top-right header** and persists across page refreshes.

| Role | Capabilities |
|---|---|
| **Viewer** | View all pages, charts, and transaction data. No mutation controls visible. |
| **Admin** | All viewer capabilities + **Add**, **Edit**, **Delete** buttons on the Transactions page. |

No backend or authentication is required — the role is purely simulated frontend state stored in Zustand/localStorage.

---

## Mock Data

- **6 months** of realistic transactions generated with a seeded PRNG (deterministic, no random flicker)
- Includes recurring items (salary, rent, subscriptions) and variable expenses across 10 categories
- Categories: Food & Dining, Transport, Shopping, Entertainment, Healthcare, Housing, Utilities, Salary, Freelance, Investment

---

## Optional Enhancements Implemented

- [x] Dark mode with persistence
- [x] Data persistence (localStorage via Zustand `persist`)
- [x] Animated charts (Recharts transitions)
- [x] Advanced filtering (search + category + type + sort combined)
- [x] Client-side form validation on add/edit

---

## Design Decisions

1. **Zustand over Redux** — The app's state surface is modest; Zustand cuts boilerplate by ~80% while offering the same capabilities needed here.
2. **Tailwind custom utilities** — `.card`, `.btn-primary`, `.input` are defined in `index.css` as `@layer utilities` to keep JSX clean without a component library dependency.
3. **Seeded random data** — Using a linear congruential generator makes the mock data deterministic so the UI looks consistent across refreshes and won't cause hydration mismatches.
4. **Role persistence** — Storing the selected role in localStorage means demo reviewers don't lose their selected role on page refresh.
5. **Recharts + custom tooltips** — Fully custom `<Tooltip>` components match the app's dark/light card style instead of the library default.
