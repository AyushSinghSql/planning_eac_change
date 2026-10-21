import React, { useEffect, useState } from "react";
import { backendUrl } from "../config";

const SchedLTable = ({
  onNavigate,
  companyName,
  companyAddress,
  year,
  fiscalYearEnd,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/ScheduleL_cost?fyCd=${year}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value) => {
    if (value === undefined || value === null || value === "") return "";
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercent = (value) => {
    if (value === undefined || value === null || value === "")
      return "0.0000000%";
    return `${(Number(value) * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="p-4 font-sans text-sm">Loading Schedule L Data...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 font-sans text-sm text-red-600">Error: {error}</div>
    );
  }

  // Derive static & calculated tables using API's manualEntry data
  const manualEntry = data?.manualEntry || {};
  const rows = data?.rows || [];

  // Split rows into main table rows vs total row
  const tableRows = rows.filter(
    (r) => r.acctName !== "TOTAL LABOR DISTRIBUTION",
  );
  const totalLaborRow = rows.find(
    (r) => r.acctName === "TOTAL LABOR DISTRIBUTION",
  );

  const totalLaborDistribution = totalLaborRow?.generalLedger || 0;

  // IRS Form 941
  const payrollRows = [
    { description: "1ST QTR.", ledger: manualEntry.qtr1 || 0 },
    { description: "2ND QTR", ledger: manualEntry.qtr2 || 0 },
    { description: "3rd QTR.", ledger: manualEntry.qtr3 || 0 },
    { description: "4th QTR.", ledger: manualEntry.qtr4 || 0 },
  ];
  const totalIRS = payrollRows.reduce((acc, curr) => acc + curr.ledger, 0);

  // Pretax Deductions
  const pretaxRows = [
    { description: "401K", ledger: manualEntry.retirement401K || 0 },
    { description: "Medical", ledger: manualEntry.medical || 0 },
    { description: "Dental", ledger: manualEntry.dental || 0 },
    { description: "FSA", ledger: manualEntry.fsa || 0 },
    { description: "Cafe 125 HSA", ledger: manualEntry.cafe125 || 0 },
    { description: "Health Care Benefit", ledger: manualEntry.healthcare || 0 },
    { description: "Miscellaneous", ledger: manualEntry.misc || 0 },
  ];
  const totalPretax = pretaxRows.reduce((acc, curr) => acc + curr.ledger, 0);

  // Payroll and Leave Accruals
  const accrualRows = [
    {
      account: "23-00-11",
      description: "Plus: Current Year vacation Liablity",
      ledger: 1069900.12,
    },
    {
      account: "23-00-11",
      description: "Minus: Prior Year vacation Liability",
      ledger: 615563.86,
    },
    {
      account: "23-10-01",
      description: "Minus: Prior Year vacation Liability",
      ledger: -1196510.06,
    },
    {
      account: "23-00-15",
      description: "Plus: Current Year Accrued NIH PTO Liability",
      ledger: 7496.61,
    },
    {
      account: "23-00-15",
      description: "Minus: Prior Year Accrued NIH PTO Liability",
      ledger: -5805.5,
    },
    {
      account: "23-00-12",
      description: "Plus: Current Year Accrual Sick Leave",
      ledger: 16543.1,
    },
    {
      account: "23-00-12",
      description: "Minus: Prior Year Accrual Sick Leave",
      ledger: 191322.91,
    },
    {
      account: "23-10-03",
      description: "Minus: Prior Year Accrual Sick Leave",
      ledger: -225892.19,
    },
    {
      account: "23-00-01",
      description: "Plus: Current Year Accrual Salaries",
      ledger: 951582.59,
    },
    {
      account: "23-00-01",
      description: "Minus: Prior Year Accrual Salaries Check date",
      ledger: -377537.31,
    },
    {
      account: "23-00-01",
      description: "Plus: Prior Year Accrual Reversal- JE#1 (50-00-01)",
      ledger: -51917.79,
    },
    {
      account: "23-00-01",
      description: "Minus: Current Year Accrual - JE#23 Dec'25 (50-00-01)",
      ledger: 207722.1,
    },
    {
      account: "23-00-01",
      description: "Plus: Prior Year Accrual Reversal- JE#1 (50-00-02)",
      ledger: -917.6,
    },
    {
      account: "23-00-01",
      description: "Minus: Current Year Accrual - JE#23 Dec'25 (50-00-02)",
      ledger: 22902.68,
    },
    {
      account: "23-00-01",
      description: "Minus: Current Year Accrual - JE#23 Dec'25 (84-00-01)",
      ledger: 6342,
    },
    {
      account: "23-00-01",
      description: "Plus: Prior Year Accrual Reversal- JE#1 (80-00-01)",
      ledger: -13728.3,
    },
    {
      account: "23-00-01",
      description: "Minus: Current Year Accrual - JE#23 Dec'25 (80-00-01)",
      ledger: 24860.43,
    },
    {
      account: "23-00-01",
      description: "Plus: Prior Year Accrual Reversal- JE#1 (72-00-01)",
      ledger: -10842.88,
    },
    {
      account: "23-00-01",
      description: "Minus: Current Year Accrual - JE#23 Dec'25 (72-00-01)",
      ledger: 14384.96,
    },
    {
      account: "23-00-01",
      description: `Minus: D/L Customer Site ${year} labor booked 2026 (50-00-01)`,
      ledger: 14826.24,
    },
  ];
  const totalAccrual = accrualRows.reduce((acc, curr) => acc + curr.ledger, 0);

  // Adjustments
  const adjustmentRows = [
    { account: "60-06-04", description: "Health & Welfare", ledger: -145.88 },
    {
      account: "60-06-05",
      description: "Incentive Compensation",
      ledger: 44300,
    },
    {
      account: "60-06-03",
      description: "Cash in Lieu of Benefits",
      ledger: 904.13,
    },
    { account: "60-03-13", description: "Severance", ledger: 5068.8 },
  ];
  const totalAdjustments = adjustmentRows.reduce(
    (acc, curr) => acc + curr.ledger,
    0,
  );

  // Calculated Totals & Variance
  const totalPayroll = totalIRS + totalPretax + totalAccrual + totalAdjustments;
  const variance = totalPayroll - totalLaborDistribution;
  const variancePercent = totalLaborDistribution
    ? variance / totalLaborDistribution
    : 0;

  // Schedule mapping lookup for references
  const getReference = (row) => {
    if (row.acctName === "Direct Labor") return "Summary SCHED H";
    if (row.acctName === "General & Administrative:") return "SCHED B";
    if (row.acctName === "G&A Executive Labor") return "link from Schedule B";
    if (row.acctName === "Overhead Pools (incl Fringe):") return "SCHED C (x)";
    if (row.acctName?.includes("Cust Site OH Labor"))
      return "link from Schedule C";
    if (row.acctName === "CA Overhead Labor") return "SCHED D (x)";
    return "";
  };

  const getReferenceNav = (row) => {
    if (row.acctName === "Direct Labor") return "sched_summaryh";
    if (row.acctName === "General & Administrative:") return "sched_b";
    if (row.acctName === "G&A Executive Labor") return "sched_b";
    if (row.acctName === "Overhead Pools (incl Fringe):") return "sched_c1";
    if (row.acctName === "CA Overhead Labor") return "sched_d1";
    return null;
  };

  return (
    <div className="sched-l-page">
      <style>{`
        * { box-sizing: border-box; }
        .sched-l-page {
          width: 100%;
          min-height: 100vh;
          background: #ededed;
          padding: 24px;
          color: #111;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
        }
        .sched-l-sheet {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #888;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          overflow-x: auto;
        }
        .sheet-header {
          display: grid;
          grid-template-columns: 1fr 260px;
          min-height: 105px;
          border-bottom: 1px solid #555;
        }
        .header-left { padding: 14px 18px; }
        .linked-title { font-weight: 700; margin-bottom: 7px; }
        .linked-item {
          margin: 2px 0;
          color: #0000ff;
          text-decoration: underline;
          cursor: pointer;
        }
        .linked-item:hover { color: #0000cc; }
        .manual { margin-top: 9px; font-weight: 700; color: #0000ff; text-decoration: underline; cursor: pointer; }
        .header-right {
          border-left: 1px solid #555;
          text-align: center;
          padding-top: 14px;
          font-weight: 700;
        }
        .schedule-name { font-size: 18px; margin-bottom: 10px; }
        .version { font-weight: 400; }
        .company-row { padding: 6px 18px; border-bottom: 1px solid #aaa; font-weight: 600; }
        .company-row.highlight-yellow { background: #ffff00; }
        .main-title { text-align: center; padding: 10px; font-size: 16px; font-weight: 700; }
        .sub-title { text-align: center; padding-bottom: 5px; font-weight: 600; }
        .fiscal-year { text-align: center; padding-bottom: 14px; font-weight: 600; }
        .table-wrapper { padding: 0 12px 12px; }
        .sched-l-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .account-col { width: 145px; }
        .description-col { width: 38%; }
        .spacer-col { width: 18px; }
        .ledger-col { width: 155px; }
        .reference-col { width: 190px; }
        .sched-l-table th, .sched-l-table td {
          border: 1px solid #555;
          min-height: 27px;
          height: 27px;
          padding: 4px 7px;
          vertical-align: middle;
        }
        .sched-l-table th { background: #efefef; font-weight: 700; text-align: center; }
        .account-cell { text-align: left; white-space: nowrap; }
        .description-cell { text-align: left; }
        .ledger-cell { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .reference-cell { text-align: left; font-size: 12px; }
        .highlight-yellow { background: #ffff00 !important; }
        .highlight-blue { background: #0000ff !important; color: #fff; cursor: pointer; }
        .highlight-blue-light { background: #3366ff !important; color: #fff; cursor: pointer; }
        .highlight-cyan { background: #00ffff !important; color: #000; }
        .spacer-cell { background: #fff; }
        .section-row td { font-weight: 700; background: #f6f6f6; }
        .section-title-row td { font-weight: 700; background: #f6f6f6; border-top: 2px solid #555; }
        .total-row {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 20px;
          border: 1px solid #555;
          border-top: none;
          min-height: 32px;
          padding: 5px 12px;
        }
        .total-row span { font-weight: 700; min-width: 260px; text-align: left; }
        .total-row strong { min-width: 155px; text-align: right; font-variant-numeric: tabular-nums; }
        .total-main { background: #efefef; border-top: 2px solid #444; font-size: 14px; }
        .irs-section { margin-top: 22px; }
        .irs-heading {
          display: grid;
          grid-template-columns: 1fr 200px;
          border: 1px solid #555;
          background: #efefef;
          font-weight: 700;
        }
        .irs-heading div { padding: 6px 8px; }
        .irs-heading div:last-child { border-left: 1px solid #555; text-align: center; }
        .simple-row {
          display: grid;
          grid-template-columns: 1fr 200px;
          border: 1px solid #555;
          border-top: none;
          min-height: 30px;
        }
        .simple-row > div { padding: 6px 8px; }
        .simple-row .amount { border-left: 1px solid #555; text-align: right; font-variant-numeric: tabular-nums; }
        .subsection { margin-top: 22px; }
        .subsection-title { padding: 7px 8px; border: 1px solid #555; background: #efefef; font-weight: 700; }
        .bottom-summary { margin-top: 22px; border-top: 2px solid #444; }
        .variance {
          display: flex;
          justify-content: flex-end;
          gap: 30px;
          padding: 6px 12px;
          border: 1px solid #555;
          border-top: none;
        }
        .legend { margin-top: 18px; padding: 10px; border-top: 1px solid #555; font-size: 12px; }
        .legend-row { margin: 4px 0; }
        .legend-label { font-weight: 700; display: inline-block; min-width: 190px; }
      `}</style>

      <div className="sched-l-sheet">
        {/* HEADER */}
        <div className="sheet-header">
          <div className="header-left">
            <div className="linked-title">
              Schedule L is linked to the following schedules:
            </div>
            <div
              className="linked-item"
              onClick={() => onNavigate?.("sched_c1")}
            >
              Schedule C, Overhead
            </div>
            <div
              className="linked-item"
              onClick={() => onNavigate?.("sched_b")}
            >
              Schedule B, G&A
            </div>
            <div
              className="linked-item"
              onClick={() => onNavigate?.("sched_d1")}
            >
              Schedule D, Occupancy
            </div>
            <div
              className="linked-item"
              onClick={() => onNavigate?.("sched_summaryh")}
            >
              Schedule H, Claimed Allocation Bases
            </div>
            <div className="manual">ICE MANUAL</div>
          </div>

          <div className="header-right">
            <div className="schedule-name">SCHEDULE L</div>
            <div className="version">ICE (version 2.0.1h)</div>
          </div>
        </div>

        <div className="company-row highlight-yellow">
          {companyName || "Revolve"}
        </div>

        <div className="main-title">
          Reconciliation of Total Payroll per IRS form 941
        </div>

        <div className="sub-title">to Total Labor Costs Distribution</div>

        <div className="fiscal-year">Fiscal Year End - {fiscalYearEnd}</div>

        {/* MAIN TABLE */}
        <div className="table-wrapper">
          <table className="sched-l-table">
            <colgroup>
              <col className="account-col" />
              <col className="description-col" />
              <col className="spacer-col" />
              <col className="spacer-col" />
              <col className="ledger-col" />
              <col className="spacer-col" />
              <col className="reference-col" />
            </colgroup>
            <thead>
              <tr>
                <th>Acct No.</th>
                <th>Description</th>
                <th></th>
                <th></th>
                <th>Ledger</th>
                <th></th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="section-title-row">
                <td></td>
                <td colSpan={6}>General</td>
              </tr>

              {tableRows.map((row, index) => {
                const isSectionHeader = !row.acctId && row.generalLedger === 0;
                const referenceText = getReference(row);
                const navTarget = getReferenceNav(row);

                let referenceClass = "";
                if (navTarget === "sched_summaryh" || navTarget === "sched_b") {
                  referenceClass = "highlight-blue";
                } else if (
                  navTarget === "sched_c1" ||
                  navTarget === "sched_d1"
                ) {
                  referenceClass = "highlight-blue-light";
                }

                return (
                  <tr
                    key={index}
                    className={isSectionHeader ? "section-row" : ""}
                  >
                    <td className="account-cell">{row.acctId}</td>
                    <td className="description-cell">{row.acctName}</td>
                    <td className="spacer-cell"></td>
                    <td className="spacer-cell"></td>
                    <td
                      className={`ledger-cell ${
                        row.generalLedger !== 0 || !isSectionHeader
                          ? "highlight-yellow"
                          : ""
                      }`}
                    >
                      {row.generalLedger ? formatNumber(row.generalLedger) : ""}
                    </td>
                    <td className="spacer-cell"></td>
                    <td
                      className={`reference-cell ${referenceClass}`}
                      onClick={() => navTarget && onNavigate?.(navTarget)}
                    >
                      {referenceText}
                    </td>
                  </tr>
                );
              })}

              <tr className="section-row">
                <td></td>
                <td>TOTAL LABOR DISTRIBUTION</td>
                <td></td>
                <td></td>
                <td className="ledger-cell highlight-cyan font-bold">
                  {formatNumber(totalLaborDistribution)}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* IRS FORM 941 */}
          <div className="irs-section">
            <div className="irs-heading">
              <div></div>
              <div>PER IRS FORM 941</div>
            </div>

            {payrollRows.map((row, index) => (
              <div className="simple-row" key={index}>
                <div>{row.description}</div>
                <div className="amount">{formatNumber(row.ledger)}</div>
              </div>
            ))}
          </div>

          {/* PRETAX DEDUCTIONS */}
          <div className="subsection">
            <div className="subsection-title">Pretax Deductions :</div>
            {pretaxRows.map((row, index) => (
              <div className="simple-row" key={index}>
                <div>{row.description}</div>
                <div className="amount">{formatNumber(row.ledger)}</div>
              </div>
            ))}
          </div>

          {/* PAYROLL AND LEAVE ACCRUALS */}
          <div className="subsection">
            <div className="subsection-title">Payroll and Leave Accruals :</div>
            {accrualRows.map((row, index) => (
              <div className="simple-row" key={index}>
                <div>
                  <strong style={{ marginRight: 12 }}>{row.account}</strong>
                  {row.description}
                </div>
                <div className="amount">{formatNumber(row.ledger)}</div>
              </div>
            ))}
          </div>

          {/* ADJUSTMENTS */}
          <div className="subsection">
            <div className="subsection-title">Adjustments:</div>
            {adjustmentRows.map((row, index) => (
              <div className="simple-row" key={index}>
                <div>
                  <strong style={{ marginRight: 12 }}>{row.account}</strong>
                  {row.description}
                </div>
                <div className="amount">{formatNumber(row.ledger)}</div>
              </div>
            ))}
          </div>

          {/* FINAL TOTAL & VARIANCE */}
          <div className="bottom-summary">
            <div className="total-row total-main highlight-cyan">
              <span>TOTAL PAYROLL</span>
              <strong>{formatNumber(totalPayroll)}</strong>
            </div>

            <div className="variance">
              <strong>Variance</strong>
              <strong>{formatNumber(variance)}</strong>
            </div>

            <div className="variance">
              <strong>Variance %</strong>
              <strong>{formatPercent(variancePercent)}</strong>
            </div>
          </div>

          {/* LEGEND */}
          <div className="legend">
            <div className="legend-row">
              <span className="legend-label highlight-yellow">
                Linked to Other Worksheet
              </span>
              <span>As Referenced</span>
            </div>

            <div className="legend-row">
              <span className="legend-label highlight-cyan">
                Cell Contains a Formula
              </span>
              <span>Summarizes Totals and Differences</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedLTable;
