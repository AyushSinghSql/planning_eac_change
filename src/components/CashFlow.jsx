import React from "react";

const cashFlowRows = [
  { label: "Operating Activities", type: "section" },
  { label: "Net Income Before Taxes", value: "$194,820" },
  { label: "Depreciation & Amortization", value: "$191,107" },
  { label: "Accounts Receivable", value: "($451,301)" },
  { label: "Unbilled Receivable", value: "($83,398)" },
  { label: "Prepaid & Other Receivables", value: "$221,638" },
  { label: "Accounts Payable", value: "($719,058)" },
  { label: "Accrued Payroll & Leave", value: "($226,219)" },
  {
    label: "Net Cash Used in Operations",
    value: "($872,411)",
    type: "subtotal",
  },
  { label: "Investing & Financing Activities", type: "section" },
  {
    label: "Fixed Assets & Leasehold Improvements",
    value: "($420,058)",
  },
  {
    label: "Short-Term Loans & Other Financing",
    value: "$1,466,542",
  },
  { label: "Net Change in Cash", value: "$174,073", type: "subtotal" },
  { label: "Cash — Beginning of Year", value: "$1,582,441", type: "subtotal" },
  { label: "Cash — End of Year", value: "$1,756,513", type: "total" },
];

export default function InteractiveCashFlow() {
  const fiscalYear = "FY2026";

  return (
    <section className="cash-flow-statement">
      <table className="cash-flow-statement__table">
        <colgroup>
          <col className="cash-flow-statement__description-col" />
          <col className="cash-flow-statement__amount-col" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Cash Flow Statement</th>
            <th scope="col">{fiscalYear}</th>
          </tr>
        </thead>
        <tbody>
          {cashFlowRows.map((row, index) => {
            if (row.type === "section") {
              return (
                <tr
                  className="cash-flow-statement__section-row"
                  key={`${row.label}-${index}`}
                >
                  <th colSpan={2} scope="rowgroup">
                    {row.label}
                  </th>
                </tr>
              );
            }

            return (
              <tr
                key={row.label}
                className={`cash-flow-statement__row ${
                  row.type ? `cash-flow-statement__row--${row.type}` : ""
                }`}
              >
                <td>{row.label}</td>
                <td className="cash-flow-statement__amount">{row.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`
        .cash-flow-statement {
          width: 100%;
          overflow-x: auto;
          background: #fff;
          font-family: Arial, Helvetica, sans-serif;
          color: #414141;
        }

        .cash-flow-statement__table {
          width: 100%;
          min-width: 430px;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 12px;
          line-height: 1.2;
          border: 1px solid #dfd5bd;
        }

        .cash-flow-statement__description-col {
          width: 69%;
        }

        .cash-flow-statement__amount-col {
          width: 31%;
        }

        .cash-flow-statement__table th,
        .cash-flow-statement__table td {
          padding: 7px 5px;
          border: 2px solid #e7ddc8;
          text-align: left;
          vertical-align: middle;
        }

        .cash-flow-statement__table thead th {
          padding: 8px 5px;
          background: #3e5f7e;
          color: #fff;
          border-color: #e7ddc8;
          font-weight: 700;
        }

        .cash-flow-statement__table thead th:last-child {
          text-align: right;
        }

        .cash-flow-statement__section-row th {
          padding: 7px 5px;
          background: #f0e6cf;
          color: #89683c;
          font-style: italic;
          font-weight: 700;
          text-align: left;
        }

        .cash-flow-statement__row td {
          background: #fffdf8;
          font-weight: 400;
        }

        .cash-flow-statement__amount {
          text-align: right !important;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }

        .cash-flow-statement__row--subtotal td {
          background: #f0e8d6;
          font-weight: 700;
        }

        .cash-flow-statement__row--total td {
          background: #3e5f7e;
          color: #fff;
          font-weight: 700;
          border-color: #e7ddc8;
        }

        @media (max-width: 600px) {
          .cash-flow-statement__table {
            font-size: 11px;
          }

          .cash-flow-statement__table th,
          .cash-flow-statement__table td {
            padding: 6px 4px;
          }
        }
      `}</style>
    </section>
  );
}
