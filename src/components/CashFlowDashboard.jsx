import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  Wallet,
  Activity,
} from "lucide-react";

// Values taken from the FY2026 Cash Flow Statement provided by the user.
// Positive values are shown as inflows; negative values are shown as outflows.
const cashFlowStatementData = [
  { name: "Net Income Before Taxes", shortName: "Net Income", value: 194820 },
  {
    name: "Depreciation & Amortization",
    shortName: "Depreciation",
    value: 191107,
  },
  { name: "Accounts Receivable", shortName: "Accounts Rec.", value: -451301 },
  { name: "Unbilled Receivable", shortName: "Unbilled Rec.", value: -83398 },
  {
    name: "Prepaid & Other Receivables",
    shortName: "Prepaid Rec.",
    value: 221638,
  },
  { name: "Accounts Payable", shortName: "Accounts Pay.", value: -719058 },
  {
    name: "Accrued Payroll & Leave",
    shortName: "Accrued Payroll",
    value: -226219,
  },
  {
    name: "Fixed Assets & Leasehold Improvements",
    shortName: "Fixed Assets",
    value: -420058,
  },
  {
    name: "Short-Term Loans & Other Financing",
    shortName: "Loans/Financing",
    value: 1466542,
  },
];

const chartData = cashFlowStatementData.map((item) => ({
  name: item.shortName,
  Income: Math.max(item.value, 0),
  Expenses: Math.max(-item.value, 0),
}));

const formatCurrency = (value) => {
  const formatted = Math.abs(value).toLocaleString("en-US");
  return value < 0 ? `($${formatted})` : `$${formatted}`;
};

const CashFlowDashboard = () => {
  return (
    <div className="cashflow-dashboard">
      <div className="cashflow-content">
        {/* <header className="cashflow-header">
          <div>
            <h1>Cash Flow Statement</h1>
          </div>

          <div className="cashflow-period-panel">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
              <button
                key={period}
                type="button"
                className={`cashflow-period-btn ${
                  period === 'Yearly' ? 'active' : ''
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </header> */}

        <section className="cashflow-stats-grid">
          <StatCard
            title="Cash — End of Year"
            value={formatCurrency(1756513)}
            change="FY2026 closing balance"
            icon={<Wallet size={18} />}
            accent="blue"
          />
          <StatCard
            title="Net Income Before Taxes"
            value={formatCurrency(194820)}
            change="FY2026 statement value"
            icon={<TrendingUp size={18} />}
            accent="green"
          />
          <StatCard
            title="Net Cash Used in Operations"
            value={formatCurrency(-872411)}
            change="FY2026 operating cash flow"
            icon={<Activity size={18} />}
            accent="orange"
          />
        </section>

        <section className="cashflow-main-grid">
          <div className="cashflow-panel cashflow-chart-panel">
            <div className="cashflow-panel-heading">
              <div>
                <h2>FY2026 Cash Flow Breakdown</h2>
                <p>Cash inflows and outflows by statement line item</p>
              </div>
            </div>

            <div className="cashflow-legend">
              <span>
                <i className="cashflow-legend-dot income-dot" />
                Cash Inflow
              </span>
              <span>
                <i className="cashflow-legend-dot expense-dot" />
                Cash Outflow
              </span>
            </div>

            <div className="cashflow-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 4, bottom: 4 }}
                >
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f59e0b"
                        stopOpacity={0.18}
                      />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5eaf0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#718096", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#718096", fontSize: 12 }}
                    width={48}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(name === "Expenses" ? -value : value),
                      name === "Expenses" ? "Cash Outflow" : "Cash Inflow",
                    ]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e9ef",
                      boxShadow: "0 5px 18px rgba(30, 41, 59, 0.09)",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Income"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Expenses"
                    stroke="#496b88"
                    strokeWidth={2.5}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="cashflow-panel cashflow-allocation-panel">
            <div className="cashflow-panel-heading">
              <div>
                <span className="cashflow-eyebrow">BREAKDOWN</span>
                <h2>Allocation by Category</h2>
                <p>Distribution across categories</p>
              </div>
            </div>

            <div className="cashflow-category-list">
              <CategoryProgress
                label="Short-Term Loans & Other Financing"
                value={100}
                color="blue"
                index="01"
              />
              <CategoryProgress
                label="Net Cash Used in Operations"
                value={60}
                color="orange"
                index="02"
              />
              <CategoryProgress
                label="Fixed Assets & Leasehold Improvements"
                value={29}
                color="slate"
                index="03"
              />
            </div>
          </div>
        </section>

        {/* <section className="cashflow-panel cashflow-actions-panel">
          <div className="cashflow-panel-heading">
            <div>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="cashflow-actions-grid">
            <button type="button" className="cashflow-action-card">
              <span className="cashflow-action-icon blue-icon">
                <ArrowUpRight size={20} />
              </span>
              <span className="cashflow-action-copy">
                <strong>Send Invoice</strong>
              </span>
            </button>

            <button type="button" className="cashflow-action-card">
              <span className="cashflow-action-icon orange-icon">
                <DollarSign size={20} />
              </span>
              <span className="cashflow-action-copy">
                <strong>Add Expense</strong>
              </span>
            </button>
          </div>
        </section> */}
      </div>

      <style>{`
        .cashflow-dashboard {
          width: 100%;
          min-height: 100vh;
          padding: 8px;
          box-sizing: border-box;
          background: #f6f7f9;
          color: #26384a;
          font-family: Arial, Helvetica, sans-serif;
        }

        .cashflow-dashboard * {
          box-sizing: border-box;
        }

        .cashflow-content {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
        }

        .cashflow-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          padding: 9px 12px;
          margin-bottom: 10px;
          background: #fff;
          border: 1px solid #e2e7ed;
          border-radius: 17px;
          box-shadow: 0 3px 12px rgba(30, 41, 59, 0.025);
        }

        .cashflow-header h1 {
          margin: 0;
          color: #293c50;
          font-size: 19px;
          font-weight: 750;
          letter-spacing: -0.45px;
        }

        .cashflow-period-panel {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          padding: 3px;
          background: #f7f9fb;
          border: 1px solid #e4e9ef;
          border-radius: 10px;
        }

        .cashflow-period-btn {
          min-width: 60px;
          padding: 6px 10px;
          border: 1px solid transparent;
          border-radius: 7px;
          background: transparent;
          color: #68798c;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .cashflow-period-btn:hover {
          background: #edf1f5;
          color: #345674;
        }

        .cashflow-period-btn.active {
          background: #345674;
          color: #fff;
          box-shadow: 0 2px 5px rgba(35, 65, 91, 0.14);
        }

        .cashflow-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
          margin-bottom: 10px;
        }

        .cashflow-stat-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          padding: 12px 14px 11px;
          background: #fff;
          border: 1px solid #e2e7ed;
          border-radius: 13px;
          box-shadow: 0 4px 12px rgba(30, 41, 59, 0.025);
        }

        .cashflow-stat-card::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #49677f 0%, #c89a65 70%, #f59e0b 100%);
          content: "";
        }

        .cashflow-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .cashflow-stat-label {
          color: #7d8b9d;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .cashflow-stat-icon {
          display: flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
        }

        .cashflow-stat-icon.blue {
          background: #f0f4f7;
          color: #496b88;
        }

        .cashflow-stat-icon.green {
          background: #eef5ef;
          color: #628567;
        }

        .cashflow-stat-icon.orange {
          background: #fff4e5;
          color: #c98724;
        }

        .cashflow-stat-value {
          margin: 0 0 7px;
          color: #293c50;
          font-size: clamp(21px, 1.8vw, 27px);
          font-weight: 750;
          line-height: 1.2;
          letter-spacing: -0.8px;
          overflow-wrap: anywhere;
        }

        .cashflow-stat-change {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          font-size: 10px;
          font-weight: 600;
        }

        .cashflow-stat-change.positive {
          color: #648768;
        }

        .cashflow-stat-change.negative {
          color: #b85b48;
        }

        .cashflow-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.9fr) minmax(290px, 1fr);
          align-items: stretch;
          gap: 10px;
          margin-bottom: 10px;
        }

        .cashflow-panel {
          min-width: 0;
          padding: 14px;
          background: #fff;
          border: 1px solid #e2e7ed;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(30, 41, 59, 0.025);
        }

        .cashflow-panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .cashflow-panel-heading h2 {
          margin: 0;
          color: #293c50;
          font-size: 16px;
          line-height: 1.35;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .cashflow-panel-heading p {
          margin: 3px 0 0;
          color: #8793a3;
          font-size: 11px;
          line-height: 1.4;
        }

        .cashflow-legend {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin: 13px 4px 4px;
          color: #60758b;
          font-size: 12px;
        }

        .cashflow-legend span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .cashflow-legend-dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .income-dot {
          background: #f59e0b;
        }

        .expense-dot {
          background: #496b88;
        }

        .cashflow-chart {
          width: 100%;
          height: 220px;
          min-width: 0;
        }

        .cashflow-allocation-panel {
          display: flex;
          flex-direction: column;
        }

        .cashflow-eyebrow {
          display: block;
          margin-bottom: 4px;
          color: #bc812a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .cashflow-category-list {
          display: flex;
          flex-direction: column;
          margin-top: 9px;
        }

        .cashflow-category {
          padding: 9px 0;
          border-bottom: 1px solid #edf0f3;
        }

        .cashflow-category:last-child {
          border-bottom: none;
        }

        .cashflow-category-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .cashflow-category-index {
          display: flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #f2f4f6;
          color: #8290a0;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .cashflow-category-info {
          flex: 1;
          min-width: 0;
        }

        .cashflow-category-info > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .cashflow-category-label {
          color: #35495d;
          font-size: 12px;
          font-weight: 700;
        }

        .cashflow-category-value {
          color: #75869a;
          font-size: 12px;
          font-weight: 700;
        }

        .cashflow-progress-track {
          width: 100%;
          height: 5px;
          overflow: hidden;
          background: #eef1f4;
          border-radius: 20px;
        }

        .cashflow-progress-bar {
          height: 100%;
          border-radius: 20px;
          transition: width 0.4s ease;
        }

        .cashflow-progress-bar.blue {
          background: #496b88;
        }

        .cashflow-progress-bar.orange {
          background: #e5a044;
        }

        .cashflow-progress-bar.slate {
          background: #8495a6;
        }

        .cashflow-actions-panel {
          margin-bottom: 4px;
        }

        .cashflow-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 9px;
        }

        .cashflow-action-card {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          padding: 9px 11px;
          background: #fbfcfd;
          border: 1px solid #e7ebf0;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .cashflow-action-card:hover {
          background: #f4f7fa;
          border-color: #c9d5e0;
        }

        .cashflow-action-icon {
          display: flex;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .blue-icon {
          background: #edf3f8;
          color: #496b88;
        }

        .orange-icon {
          background: #fff4e5;
          color: #c98724;
        }

        .cashflow-action-copy {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .cashflow-action-card strong {
          color: #35495d;
          font-size: 12px;
          font-weight: 700;
        }

        @media (min-width: 1500px) {
          .cashflow-dashboard {
            padding: 16px;
          }

          .cashflow-chart {
            height: 310px;
          }
        }

        @media (max-width: 1000px) {
          .cashflow-main-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .cashflow-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cashflow-stat-card:last-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .cashflow-dashboard {
            padding: 7px;
          }

          .cashflow-header {
            align-items: stretch;
            padding: 12px;
          }

          .cashflow-header h1 {
            font-size: 18px;
          }

          .cashflow-period-panel {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .cashflow-period-btn {
            min-width: 0;
            padding: 9px 5px;
            font-size: 11px;
          }

          .cashflow-stats-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }

          .cashflow-stat-card:last-child {
            grid-column: auto;
          }

          .cashflow-stat-card {
            padding: 18px;
          }

          .cashflow-panel {
            padding: 14px;
            border-radius: 14px;
          }

          .cashflow-panel-heading h2 {
            font-size: 15px;
          }

          .cashflow-chart {
            height: 235px;
          }

          .cashflow-legend {
            margin-top: 22px;
          }

          .cashflow-actions-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, change, icon, accent }) => {
  const isPositive = change.includes("+");

  return (
    <div className="cashflow-stat-card">
      <div className="cashflow-stat-top">
        <span className="cashflow-stat-label">{title}</span>
        <span className={`cashflow-stat-icon ${accent}`}>{icon}</span>
      </div>

      <h2 className="cashflow-stat-value">{value}</h2>

      <div
        className={`cashflow-stat-change ${isPositive ? "positive" : "negative"}`}
      >
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{change}</span>
      </div>
    </div>
  );
};

const CategoryProgress = ({ label, value, color, index }) => (
  <div className="cashflow-category">
    <div className="cashflow-category-top">
      <span className="cashflow-category-index">{index}</span>
      <div className="cashflow-category-info">
        <div>
          <span className="cashflow-category-label">{label}</span>
          <span className="cashflow-category-value">{value}%</span>
        </div>
      </div>
    </div>

    <div className="cashflow-progress-track">
      <div
        className={`cashflow-progress-bar ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default CashFlowDashboard;
