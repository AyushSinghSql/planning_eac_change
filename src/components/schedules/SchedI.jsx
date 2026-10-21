// // import React, { useState, useEffect } from "react";
// // import { backendUrl } from "../config";

// // /* =========================================================
// //    Helpers
// // ========================================================= */

// // const parseAmt = (val) => {
// //   if (val === null || val === undefined || val === "") return 0;
// //   if (typeof val === "number") {
// //     return Number.isFinite(val) ? val : 0;
// //   }
// //   const str = String(val).replace(/,/g, "").replace(/[()]/g, "-").trim();
// //   if (str === "" || str === "-") return 0;
// //   const parsed = parseFloat(str);
// //   return Number.isFinite(parsed) ? parsed : 0;
// // };

// // const formatVal = (val) => {
// //   const num = Number(val) || 0;
// //   return num === 0 ? "-" : Math.round(num).toLocaleString();
// // };

// // const formatInputValue = (val) => {
// //   if (val === null || val === undefined || val === "") return "";
// //   const num = Number(val);
// //   if (!Number.isFinite(num)) return "";
// //   return Math.round(num).toLocaleString();
// // };

// // const toApiDate = (dateValue) => {
// //   if (!dateValue) return null;
// //   const date = new Date(dateValue);
// //   if (Number.isNaN(date.getTime())) return null;
// //   return date.toISOString();
// // };

// // const sanitizeNumericInput = (value) => {
// //   if (value === null || value === undefined) return "";
// //   let str = String(value).replace(/[^0-9,.\-()]/g, "");
// //   const openCount = (str.match(/\(/g) || []).length;
// //   const closeCount = (str.match(/\)/g) || []).length;

// //   if (openCount > 1) {
// //     let seen = false;
// //     str = str.replace(/\(/g, () => {
// //       if (seen) return "";
// //       seen = true;
// //       return "(";
// //     });
// //   }
// //   if (closeCount > 1) {
// //     let seen = false;
// //     str = str.replace(/\)/g, () => {
// //       if (seen) return "";
// //       seen = true;
// //       return ")";
// //     });
// //   }

// //   const minusStripped = str.replace(/-/g, "");
// //   const hadMinus = str.startsWith("-");
// //   str = (hadMinus ? "-" : "") + minusStripped;

// //   const parts = str.split(".");
// //   if (parts.length > 2) {
// //     str = parts[0] + "." + parts.slice(1).join("");
// //   }
// //   return str;
// // };

// // const keyMatch = (reportLvl) => (row) =>
// //   String(row.reportLvl).trim() === String(reportLvl).trim();

// // const recalcContractRows = (rows = []) => {
// //   const updatedRows = rows.map((row) => {
// //     const priorAmount = parseAmt(row.priorYearInput);
// //     const currentAmount = Number(row.currentYear) || 0;
// //     const cumulative = priorAmount + currentAmount;
// //     const limitation = parseAmt(row.limitationInput);
// //     const netCumulative = cumulative - limitation;
// //     return { ...row, cumulative, netCumulative };
// //   });

// //   const totals = updatedRows.reduce(
// //     (acc, row) => {
// //       acc.settled += parseAmt(row.pyr_Settled_Amt);
// //       acc.prior += parseAmt(row.priorYearInput);
// //       acc.current += Number(row.currentYear) || 0;
// //       acc.cum += row.cumulative;
// //       acc.net += row.netCumulative;
// //       return acc;
// //     },
// //     { settled: 0, prior: 0, current: 0, cum: 0, net: 0 },
// //   );

// //   return { rows: updatedRows, totals };
// // };

// // const computeBillingTotals = (billingRows, flexKeySet) => {
// //   let flexBilled = 0;
// //   let flexOverUnder = 0;
// //   let tmBilled = 0;
// //   let tmOverUnder = 0;

// //   billingRows.forEach((row) => {
// //     const key = String(row.reportLvl).trim();
// //     const billed = Number(row.billedAmt) || 0;
// //     const overUnder = Number(row.overUnderBilling) || 0;

// //     if (flexKeySet.has(key)) {
// //       flexBilled += billed;
// //       flexOverUnder += overUnder;
// //     } else {
// //       tmBilled += billed;
// //       tmOverUnder += overUnder;
// //     }
// //   });

// //   return {
// //     flexBilled,
// //     flexOverUnder,
// //     tmBilled,
// //     tmOverUnder,
// //     totalBilled: flexBilled + tmBilled,
// //     totalOverUnder: flexOverUnder + tmOverUnder,
// //   };
// // };

// // /* =========================================================
// //    Table Colgroup & Header with Frozen Columns
// // ========================================================= */

// // const TableColgroup = () => (
// //   <colgroup>
// //     <col style={{ width: "130px", minWidth: "130px" }} />
// //     <col style={{ width: "130px", minWidth: "130px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "90px", minWidth: "90px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "125px", minWidth: "125px" }} />
// //     <col style={{ width: "125px", minWidth: "125px" }} />
// //     <col style={{ width: "125px", minWidth: "125px" }} />
// //     <col style={{ width: "100px", minWidth: "100px" }} />
// //     <col style={{ width: "115px", minWidth: "115px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "85px", minWidth: "85px" }} />
// //     <col style={{ width: "80px", minWidth: "80px" }} />
// //   </colgroup>
// // );

// // const TableHeader = () => (
// //   <thead className="sched-i-thead">
// //     <tr className="top-header">
// //       <th colSpan="3" className="freeze-header-group"></th>
// //       <th colSpan="2"></th>
// //       <th colSpan="2">
// //         Unsettled/Claimed Direct
// //         <br />
// //         And Indirect Costs Using
// //       </th>
// //       <th>
// //         Total
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or Claimed
// //       </th>
// //       <th>
// //         Less
// //         <br />
// //         Contract
// //         <br />
// //         Limitations
// //         <br />
// //         Rebates/Credits
// //       </th>
// //       <th>
// //         Net
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or Claimed
// //       </th>
// //       <th colSpan="3">Cumulative Cost Billed (Manual Entry)</th>
// //       <th rowSpan="2">
// //         Over
// //         <br />
// //         (Under)
// //         <br />
// //         Billing
// //       </th>
// //       <th rowSpan="2">
// //         Physically
// //         <br />
// //         Complete
// //         <br />
// //         (Note 7)
// //       </th>
// //       <th rowSpan="2">Note</th>
// //     </tr>
// //     <tr className="column-header">
// //       <th className="freeze-col-1">Contract No.</th>
// //       <th className="freeze-col-2">Subcontract No.</th>
// //       <th className="freeze-col-3">
// //         Order
// //         <br />
// //         No.
// //       </th>
// //       <th>
// //         Subject
// //         <br />
// //         To
// //         <br />
// //         Penalty
// //         <br />
// //         Clause
// //         <br />
// //         Note (2)
// //       </th>
// //       <th>
// //         Prior
// //         <br />
// //         Years
// //         <br />
// //         Settled
// //         <br />
// //         Total
// //         <br />
// //         Costs
// //         <br />
// //         Note (3)
// //       </th>
// //       <th>
// //         Prior Year
// //         <br />
// //         Costs
// //         <br />
// //         FYE
// //         <br />
// //         Note (4)
// //       </th>
// //       <th>
// //         Current Year
// //         <br />
// //         Costs
// //         <br />
// //         FYE
// //         <br />
// //         Note (4)
// //       </th>
// //       <th>
// //         Total
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or
// //         <br />
// //         Claimed
// //       </th>
// //       <th>
// //         Contract
// //         <br />
// //         Limitations
// //         <br />
// //         Rebates/Credits
// //         <br />
// //         Note (5)
// //       </th>
// //       <th>
// //         Net
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or
// //         <br />
// //         Claimed
// //         <br />
// //         Note (6)
// //       </th>
// //       <th>PV No.</th>
// //       <th>
// //         Date Cost Billed
// //         <br />
// //         Through
// //       </th>
// //       <th>Amount</th>
// //     </tr>
// //   </thead>
// // );

// // /* =========================================================
// //    Combined Contract + Billing Table
// // ========================================================= */

// // const CombinedTable = ({
// //   flexRows,
// //   tmRows,
// //   billingRowsMap,
// //   flexTotals,
// //   tmTotals,
// //   billingTotals,
// //   combinedTotal,
// //   combinedNet,
// //   onCellChange,
// //   onBillingChange,
// //   onNavigate,
// // }) => {
// //   const renderRow = (row, index) => {
// //     const key = String(row.reportLvl).trim();
// //     const billingRow = billingRowsMap.get(key) || {};

// //     return (
// //       <tr key={`${row.id || row.reportLvl}-${index}`}>
// //         {/* Frozen Column 1: Contract */}
// //         <td className="yellow left freeze-col-1">{row.contract || ""}</td>

// //         {/* Frozen Column 2: Subcontract */}
// //         <td className="yellow left freeze-col-2">{row.sub || ""}</td>

// //         {/* Frozen Column 3: Order No */}
// //         <td className="yellow freeze-col-3">{row.order || ""}</td>

// //         {/* Note (2): Penalty Clause */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input center"
// //             autoComplete="off"
// //             value={row.penalty_Clause ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "penalty_Clause",
// //                 e.target.value,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Note (3): Prior Years Settled Total Costs */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input center"
// //             autoComplete="off"
// //             inputMode="decimal"
// //             value={row.pyr_Settled_Amt ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "pyr_Settled_Amt",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Prior Year Cost */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input num"
// //             inputMode="decimal"
// //             autoComplete="off"
// //             value={row.priorYearInput ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "priorYearInput",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Current Year Cost */}
// //         <td className="num yellow">{formatVal(row.currentYear)}</td>

// //         {/* Total Cumulative */}
// //         <td className="num cyan">{formatVal(row.cumulative)}</td>

// //         {/* Limitation */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input num"
// //             inputMode="decimal"
// //             autoComplete="off"
// //             value={row.limitationInput ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "limitationInput",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Net Cumulative */}
// //         <td className="num cyan">{formatVal(row.netCumulative)}</td>

// //         {/* PV No */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input left"
// //             autoComplete="off"
// //             value={billingRow.pvNo ?? ""}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "pvNo",
// //                 e.target.value,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Billing Date */}
// //         <td className="editable-cell">
// //           <input
// //             type="date"
// //             className="sched-i-input"
// //             value={billingRow.billedDtInput ?? ""}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "billedDtInput",
// //                 e.target.value,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Billing Amount */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input num"
// //             inputMode="decimal"
// //             autoComplete="off"
// //             value={billingRow.billedAmtInput ?? ""}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "billedAmtInput",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Over / Under Billing */}
// //         <td className="num cyan">{formatVal(billingRow.overUnderBilling)}</td>

// //         {/* Physically Complete */}
// //         <td className="editable-cell center">
// //           <input
// //             type="checkbox"
// //             checked={Boolean(billingRow.completeFl)}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "completeFl",
// //                 e.target.checked,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Last Note */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input left"
// //             autoComplete="off"
// //             value={row.note ?? ""}
// //             onChange={(e) =>
// //               onCellChange(row.id, row.reportLvl, "note", e.target.value)
// //             }
// //           />
// //         </td>
// //       </tr>
// //     );
// //   };

// //   return (
// //     <div className="sched-i-tables-container">
// //       {/* =========================================================
// //           1. COST TYPE & FLEXIBLY PRICED SECTION
// //       ========================================================= */}
// //       <div className="sched-i-section-block">
// //         <div className="sched-i-section-header">
// //           <button
// //             type="button"
// //             className="blue-label"
// //             onClick={() => onNavigate("sched_h")}
// //           >
// //             SCHED H
// //           </button>
// //           Cost Type &amp; Flexibly Priced:
// //         </div>
// //         <div className="sched-i-table-container custom-scrollbar">
// //           <table className="sched-i-combined-table">
// //             <TableColgroup />
// //             <TableHeader />
// //             <tbody>
// //               {flexRows.map(renderRow)}
// //               {/* SCHED H Subtotal */}
// //               <tr className="subtotal">
// //                 <td
// //                   colSpan="3"
// //                   className="freeze-header-group"
// //                   style={{ textAlign: "left", paddingLeft: "8px" }}
// //                 >
// //                   Subtotal-Cost &amp; Flexibly Priced Contracts
// //                 </td>
// //                 <td colSpan="4"></td>
// //                 <td className="num cyan">{formatVal(flexTotals.cum)}</td>
// //                 <td></td>
// //                 <td className="num cyan">{formatVal(flexTotals.net)}</td>
// //                 <td colSpan="2"></td>
// //                 <td className="num cyan">
// //                   {formatVal(billingTotals.flexBilled)}
// //                 </td>
// //                 <td className="num cyan">
// //                   {formatVal(billingTotals.flexOverUnder)}
// //                 </td>
// //                 <td colSpan="2"></td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* =========================================================
// //           2. TIME & MATERIAL SECTION
// //       ========================================================= */}
// //       <div className="sched-i-section-block">
// //         <div className="sched-i-section-header">
// //           <button
// //             type="button"
// //             className="blue-label"
// //             onClick={() => onNavigate("sched_k")}
// //           >
// //             SCHED K
// //           </button>
// //           Time &amp; Material
// //         </div>
// //         <div className="sched-i-table-container custom-scrollbar">
// //           <table className="sched-i-combined-table">
// //             <TableColgroup />
// //             <TableHeader />
// //             <tbody>
// //               {tmRows.map(renderRow)}
// //               {/* SCHED K Subtotal */}
// //               <tr className="subtotal">
// //                 <td
// //                   colSpan="3"
// //                   className="freeze-header-group"
// //                   style={{ textAlign: "left", paddingLeft: "8px" }}
// //                 >
// //                   Subtotal-Time &amp; Material Contracts
// //                 </td>
// //                 <td colSpan="4"></td>
// //                 <td className="num cyan">{formatVal(tmTotals.cum)}</td>
// //                 <td></td>
// //                 <td className="num cyan">{formatVal(tmTotals.net)}</td>
// //                 <td colSpan="2"></td>
// //                 <td className="num cyan">
// //                   {formatVal(billingTotals.tmBilled)}
// //                 </td>
// //                 <td className="num cyan">
// //                   {formatVal(billingTotals.tmOverUnder)}
// //                 </td>
// //                 <td colSpan="2"></td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* =========================================================
// //           3. GRAND TOTAL / COMBINED SECTION
// //       ========================================================= */}
// //       <div className="sched-i-section-block">
// //         <div className="sched-i-section-header total-heading">
// //           Total- Cost/Flexibly Priced and Time &amp; Material Contracts
// //         </div>
// //         <div className="sched-i-table-container sched-i-grand-total-table-container custom-scrollbar">
// //           <table className="sched-i-combined-table">
// //             <TableColgroup />
// //             <tbody>
// //               <tr className="subtotal billing-total grand">
// //                 <td
// //                   colSpan="3"
// //                   className="freeze-header-group"
// //                   style={{ textAlign: "left", paddingLeft: "8px" }}
// //                 >
// //                   Grand Total
// //                 </td>
// //                 <td colSpan="4"></td>
// //                 <td className="num cyan">{formatVal(combinedTotal)}</td>
// //                 <td></td>
// //                 <td className="num cyan">{formatVal(combinedNet)}</td>
// //                 <td colSpan="2"></td>
// //                 <td className="num cyan">
// //                   {formatVal(billingTotals.totalBilled)}
// //                 </td>
// //                 <td className="num cyan">
// //                   {formatVal(billingTotals.totalOverUnder)}
// //                 </td>
// //                 <td colSpan="2"></td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // /* =========================================================
// //    Notes
// // ========================================================= */

// // const Notes = () => (
// //   <div className="notes">
// //     <div className="notes-title">Explanatory Notes:</div>

// //     <div>
// //       <b>1.</b> Fiscal Year 2025 represents initial formal Incurred Cost
// //       Submission (ICS). The amounts reflected in Schedule I, Column 'Prior Year
// //       Costs' (Note 4), represent the cumulative actual costs incurred on
// //       flexibly priced contracts from their respective inception dates through
// //       December 31, 2024. Historically, these contracts were not subject to
// //       formal ICS filing requirements; however, prior year actuals have been
// //       included herein to establish the accurate cumulative-to-date cost position
// //       and to ensure proper reconciliation with life-to-date billings.
// //     </div>

// //     <div>
// //       <b>2.</b> Revenue totals in the Financial Statements include a $1,029.30
// //       revenue accrual that does not have corresponding costs on project
// //       C1435.001. This revenue accrual is excluded from the Incurred Cost
// //       Submission as no allowable costs were incurred or billed related to this
// //       balance in FY 2025.
// //     </div>

// //     <div>
// //       <b>3.</b> Project C1800.U is non billable project and it has $382K labor
// //       costs accrued for 12/29 &amp; 12/31, which is allowable cost. These costs
// //       were accrued to a nonbillable project code C1800.U in the General Ledger
// //       to exclude from NASA 533 reporting but are properly allocable to the
// //       active project C1800.C for the period of 12/29–12/31. Hence shown as under
// //       billed and ensures proper matching of incurred costs to contract billings
// //       and revenue for FY 2025. The unbilled in accounting system tie back to the
// //       under bill amount of this project on this schedule 'I'.
// //     </div>

// //     <div>
// //       <b>4.</b> Contract limitation of $276K updated for project C1800.C as the
// //       cost not billed/claimed towards the teammate's Fee.
// //     </div>

// //     <div className="legend linked">
// //       <span>Linked to Other Worksheet</span>
// //       <b>Current Year Contract Costs, Schedule H and K</b>
// //     </div>

// //     <div className="legend formula">
// //       <span>Cell Contains a Formula</span>
// //       <b>
// //         Formulas calculate Total and Net Cumulative Claimed and or Settled
// //         Amounts
// //       </b>
// //     </div>

// //     <div className="legend links">
// //       <span>Cell Contains a Formula With Links</span>
// //       <b>None</b>
// //     </div>
// //   </div>
// // );

// // /* =========================================================
// //    Main Component
// // ========================================================= */

// // export default function SchedI({ companyName, companyAddress, onNavigate }) {
// //   const [flexRows, setFlexRows] = useState([]);
// //   const [tmRows, setTmRows] = useState([]);
// //   const [billingRows, setBillingRows] = useState([]);

// //   const [flexTotals, setFlexTotals] = useState({
// //     settled: 0,
// //     prior: 0,
// //     current: 0,
// //     cum: 0,
// //     net: 0,
// //   });

// //   const [tmTotals, setTmTotals] = useState({
// //     settled: 0,
// //     prior: 0,
// //     current: 0,
// //     cum: 0,
// //     net: 0,
// //   });

// //   const [billingTotals, setBillingTotals] = useState({
// //     flexBilled: 0,
// //     flexOverUnder: 0,
// //     tmBilled: 0,
// //     tmOverUnder: 0,
// //     totalBilled: 0,
// //     totalOverUnder: 0,
// //   });

// //   const [scheduleIData, setScheduleIData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");

// //   const FY_YEAR = 2025;

// //   /* =========================================================
// //      Build UI rows
// //   ========================================================= */

// //   const buildRows = (ledgerData, schedKData, scheduleIData, ratesData) => {
// //     let rates = {
// //       fringe: 0,
// //       aeroFringe: 0,
// //       custOH: 0,
// //       colOH: 0,
// //       smh: 0,
// //       ga: 0,
// //     };
// //     if (ratesData && ratesData.schedules) {
// //       ratesData.schedules.forEach((schedule) => {
// //         let rawRate = parseFloat(schedule.rate) || 0;
// //         let percentForm = rawRate > 1 ? rawRate : rawRate * 100;
// //         percentForm = Math.round(percentForm * 100) / 100;
// //         const r = percentForm / 100;

// //         if (schedule.name.includes("Fringe Pool") || schedule.name === "Fringe")
// //           rates.fringe = r;
// //         else if (schedule.name.includes("AERO Fringe")) rates.aeroFringe = r;
// //         else if (schedule.name.includes("Customer Site Overhead"))
// //           rates.custOH = r;
// //         else if (schedule.name.includes("Off - Site Overhead")) rates.colOH = r;
// //         else if (schedule.name.includes("Subk & Material Handling"))
// //           rates.smh = r;
// //         else if (schedule.name.includes("General and Administrative"))
// //           rates.ga = r;
// //       });
// //     }

// //     const scheduleIDict = {};
// //     scheduleIData.forEach((item) => {
// //       if (!item.reportLvl) return;
// //       scheduleIDict[String(item.reportLvl).trim()] = item;
// //     });

// //     const flexGroup = {};
// //     const lookupDict = {};

// //     ledgerData.forEach((row) => {
// //       const key = row.reportLvl || row.projId;
// //       if (!key) return;

// //       if (!lookupDict[key])
// //         lookupDict[key] = {
// //           contract: row.primeCntrId || "",
// //           sub: row.subctrId || "",
// //         };

// //       if (Number(row.year) === 2025) {
// //         const pt = (row.projType || "").toUpperCase();
// //         let cat = "Flexibly Priced";
// //         if (pt.includes("CPFF") || pt.includes("CPAF")) cat = "Cost-Type";
// //         else if (pt === "T&M" || pt.includes("T&M")) cat = "T&M";
// //         else if (pt.includes("FIXED") || pt === "FFP") cat = "Fixed Price";
// //         else if (pt.includes("COMMERCIAL")) cat = "Commercial";
// //         else if (pt.includes("IR&D") || pt.includes("B&P")) cat = "IR&D&BP";

// //         if (cat === "Cost-Type" || cat === "Flexibly Priced") {
// //           if (!flexGroup[key]) {
// //             flexGroup[key] = {
// //               contract: row.primeCntrId || "",
// //               sub: row.subctrId || "",
// //               order: key,
// //               cat: cat,
// //               laborOnsite: 0,
// //               laborOffsite: 0,
// //               laborAero: 0,
// //               travel: 0,
// //               material: 0,
// //               odc: 0,
// //               subcontracts: 0,
// //               unburden: 0,
// //             };
// //           }

// //           const amount = parseFloat(row.amount) || 0;
// //           if (
// //             row.acctId === "50-00-01" ||
// //             row.acctId === "50-00-98" ||
// //             row.acctId === "59-00-01"
// //           ) {
// //             if (row.orgId === "1.1.01" || row.acctId === "59-00-01")
// //               flexGroup[key].laborAero += amount;
// //             else flexGroup[key].laborOnsite += amount;
// //           } else if (row.acctId === "50-00-02") {
// //             flexGroup[key].laborOffsite += amount;
// //           } else if (
// //             row.acctId &&
// //             (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
// //           ) {
// //             flexGroup[key].travel += amount;
// //           } else if (
// //             ["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)
// //           ) {
// //             flexGroup[key].material += amount;
// //           } else if (
// //             ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(
// //               row.acctId,
// //             )
// //           ) {
// //             flexGroup[key].odc += amount;
// //           } else if (
// //             [
// //               "50-21-01",
// //               "50-21-02",
// //               "50-21-03",
// //               "50-21-04",
// //               "50-22-01",
// //             ].includes(row.acctId)
// //           ) {
// //             flexGroup[key].subcontracts += amount;
// //           } else if (
// //             ["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)
// //           ) {
// //             flexGroup[key].unburden += amount;
// //           }
// //         }
// //       }
// //     });

// //     /* =====================================================
// //        FLEX ROWS
// //     ===================================================== */
// //     let totalFlexSettled = 0;
// //     let totalFlexPrior = 0;
// //     let totalFlexCurrent = 0;
// //     let totalFlexCum = 0;
// //     let totalFlexNet = 0;

// //     const generatedFlexRows = Object.values(flexGroup).map((rawItem) => {
// //       const reportLvl = String(rawItem.order).trim();
// //       const saved = scheduleIDict[reportLvl] || null;

// //       const item = {
// //         laborOnsite: Math.round(rawItem.laborOnsite),
// //         laborOffsite: Math.round(rawItem.laborOffsite),
// //         laborAero: Math.round(rawItem.laborAero),
// //         travel: Math.round(rawItem.travel),
// //         material: Math.round(rawItem.material),
// //         odc: Math.round(rawItem.odc),
// //         subcontracts: Math.round(rawItem.subcontracts),
// //         unburden: Math.round(rawItem.unburden),
// //       };

// //       const totalLabor = item.laborOnsite + item.laborOffsite + item.laborAero;
// //       const totalDirectCosts =
// //         totalLabor +
// //         item.travel +
// //         item.material +
// //         item.odc +
// //         item.subcontracts +
// //         item.unburden;

// //       const fringeOnsite = Math.round(item.laborOnsite * rates.fringe);
// //       const fringeOffsite = Math.round(item.laborOffsite * rates.fringe);
// //       const fringeAero = Math.round(item.laborAero * rates.aeroFringe);

// //       const ohOnsiteBase =
// //         item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;
// //       const ohOffsiteBase = item.laborOffsite + fringeOffsite;
// //       const smhBase = item.material + item.subcontracts;

// //       const ohOnsite = Math.round(ohOnsiteBase * rates.custOH);
// //       const ohOffsite = Math.round(ohOffsiteBase * rates.colOH);
// //       const ohSMH = Math.round(smhBase * rates.smh);

// //       const totalIndirectCosts =
// //         fringeOnsite +
// //         fringeOffsite +
// //         fringeAero +
// //         ohOnsite +
// //         ohOffsite +
// //         ohSMH;

// //       const directPlusOH = totalDirectCosts + totalIndirectCosts;
// //       const gaBase =
// //         directPlusOH -
// //         (item.material + item.subcontracts + item.unburden + ohSMH);
// //       const gaApplied = Math.round(gaBase * rates.ga);

// //       const grandTotal = directPlusOH + gaApplied;
// //       const currentYearCost = grandTotal;

// //       const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
// //       const pyrSettledAmt =
// //         saved?.pyrSettledAmt != null
// //           ? Number(saved.pyrSettledAmt)
// //           : saved?.pyr_Settled_Amt != null
// //             ? Number(saved.pyr_Settled_Amt)
// //             : 0;

// //       const cumulative = priorYear + currentYearCost;
// //       const netCumulative =
// //         saved?.netCum != null ? Number(saved.netCum) : cumulative;
// //       const limitation = cumulative - netCumulative;

// //       totalFlexSettled += pyrSettledAmt;
// //       totalFlexPrior += priorYear;
// //       totalFlexCurrent += currentYearCost;
// //       totalFlexCum += cumulative;
// //       totalFlexNet += netCumulative;

// //       return {
// //         id: saved?.id || 0,
// //         year: saved?.year || FY_YEAR,
// //         schedCd: saved?.schedCd || "I",
// //         contract: rawItem.contract || saved?.primeCntrId || "",
// //         sub: rawItem.sub || saved?.subctrId || "",
// //         reportLvl,
// //         order: reportLvl,
// //         penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
// //         pyr_Settled_Amt:
// //           pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
// //         priorYearInput:
// //           saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
// //         currentYear: currentYearCost,
// //         cumulative,
// //         limitationInput:
// //           saved?.netCum != null ? formatInputValue(limitation) : "",
// //         netCumulative,
// //         pvNo: saved?.pvNo || "",
// //         billedDt: saved?.billedDt || null,
// //         billedAmt: saved?.billedAmt || 0,
// //         completeFl: saved?.completeFl ?? false,
// //         note: saved?.note ?? saved?.Note ?? "",
// //         isEdited: false,
// //       };
// //     });

// //     /* =====================================================
// //        TM ROWS
// //     ===================================================== */
// //     const tmGroup = {};
// //     schedKData.forEach((row) => {
// //       const key = row.invcProjId;
// //       if (!key) return;
// //       if (!tmGroup[key]) {
// //         const lookup = lookupDict[key] || { contract: "", sub: "" };
// //         tmGroup[key] = {
// //           contract: lookup.contract,
// //           sub: lookup.sub || row.taskId || "",
// //           order: key,
// //           amount: 0,
// //         };
// //       }
// //       tmGroup[key].amount += parseFloat(row.amount) || 0;
// //     });

// //     let totalTmSettled = 0;
// //     let totalTmPrior = 0;
// //     let totalTmCurrent = 0;
// //     let totalTmCum = 0;
// //     let totalTmNet = 0;

// //     const generatedTmRows = Object.values(tmGroup).map((item) => {
// //       const reportLvl = String(item.order).trim();
// //       const saved = scheduleIDict[reportLvl] || null;
// //       const currentYearCost = Number(item.amount) || 0;
// //       const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
// //       const pyrSettledAmt =
// //         saved?.pyrSettledAmt != null
// //           ? Number(saved.pyrSettledAmt)
// //           : saved?.pyr_Settled_Amt != null
// //             ? Number(saved.pyr_Settled_Amt)
// //             : 0;
// //       const cumulative = priorYear + currentYearCost;
// //       const netCumulative =
// //         saved?.netCum != null ? Number(saved.netCum) : cumulative;
// //       const limitation = cumulative - netCumulative;

// //       totalTmSettled += pyrSettledAmt;
// //       totalTmPrior += priorYear;
// //       totalTmCurrent += currentYearCost;
// //       totalTmCum += cumulative;
// //       totalTmNet += netCumulative;

// //       return {
// //         id: saved?.id || 0,
// //         year: saved?.year || FY_YEAR,
// //         schedCd: saved?.schedCd || "I",
// //         contract: item.contract || saved?.primeCntrId || "",
// //         sub: item.sub || saved?.subctrId || "",
// //         reportLvl,
// //         order: reportLvl,
// //         penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
// //         pyr_Settled_Amt:
// //           pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
// //         priorYearInput:
// //           saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
// //         currentYear: currentYearCost,
// //         cumulative,
// //         limitationInput:
// //           saved?.netCum != null ? formatInputValue(limitation) : "",
// //         netCumulative,
// //         pvNo: saved?.pvNo || "",
// //         billedDt: saved?.billedDt || null,
// //         billedAmt: saved?.billedAmt || 0,
// //         completeFl: saved?.completeFl ?? false,
// //         note: saved?.note ?? saved?.Note ?? "",
// //         isEdited: false,
// //       };
// //     });

// //     /* =====================================================
// //        BILLING DATA
// //     ===================================================== */
// //     const billingData = scheduleIData
// //       .filter(
// //         (item) =>
// //           item.pvNo ||
// //           item.billedDt ||
// //           (item.billedAmt !== null && item.billedAmt !== undefined),
// //       )
// //       .map((item) => {
// //         const billedAmount = Number(item.billedAmt) || 0;
// //         const flexMatch = generatedFlexRows.find(
// //           (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
// //         );
// //         const tmMatch = generatedTmRows.find(
// //           (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
// //         );
// //         const cost = flexMatch?.netCumulative ?? tmMatch?.netCumulative ?? 0;
// //         const overUnder = billedAmount - cost;

// //         return {
// //           id: item.id || 0,
// //           year: item.year || FY_YEAR,
// //           schedCd: item.schedCd || "I",
// //           primeCntrId: item.primeCntrId || "",
// //           subctrId: item.subctrId || "",
// //           reportLvl: item.reportLvl || "",
// //           pvNo: item.pvNo || "",
// //           billedDt: item.billedDt || null,
// //           billedDtInput: item.billedDt
// //             ? new Date(item.billedDt).toISOString().split("T")[0]
// //             : "",
// //           billedAmt: billedAmount,
// //           billedAmtInput:
// //             item.billedAmt != null ? formatInputValue(item.billedAmt) : "",
// //           completeFl: item.completeFl ?? false,
// //           overUnderBilling: overUnder,
// //           isEdited: false,
// //         };
// //       });

// //     const existingBillingKeys = new Set(
// //       billingData.map((x) => String(x.reportLvl).trim()),
// //     );

// //     [...generatedFlexRows, ...generatedTmRows].forEach((row) => {
// //       const key = String(row.reportLvl).trim();
// //       if (!key) return;
// //       if (!existingBillingKeys.has(key)) {
// //         billingData.push({
// //           id: row.id || 0,
// //           year: FY_YEAR,
// //           schedCd: "I",
// //           primeCntrId: row.contract || "",
// //           subctrId: row.sub || "",
// //           reportLvl: key,
// //           pvNo: row.pvNo || "",
// //           billedDt: null,
// //           billedDtInput: "",
// //           billedAmt: 0,
// //           billedAmtInput: "",
// //           completeFl: row.completeFl || false,
// //           overUnderBilling: 0,
// //           isEdited: false,
// //         });
// //       }
// //     });

// //     const flexBillingKeys = new Set(
// //       generatedFlexRows.map((x) => String(x.reportLvl).trim()),
// //     );
// //     setFlexRows(generatedFlexRows);
// //     setTmRows(generatedTmRows);
// //     setFlexTotals({
// //       settled: totalFlexSettled,
// //       prior: totalFlexPrior,
// //       current: totalFlexCurrent,
// //       cum: totalFlexCum,
// //       net: totalFlexNet,
// //     });
// //     setTmTotals({
// //       settled: totalTmSettled,
// //       prior: totalTmPrior,
// //       current: totalTmCurrent,
// //       cum: totalTmCum,
// //       net: totalTmNet,
// //     });
// //     setBillingRows(billingData);
// //     setBillingTotals(computeBillingTotals(billingData, flexBillingKeys));
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         const [ledgerRes, schedKRes, scheduleIRes, ratesRes] =
// //           await Promise.all([
// //             fetch(`${backendUrl}/api/JobCostLedger`),
// //             fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
// //             fetch(
// //               `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
// //             ),
// //             fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
// //           ]);

// //         if (!ledgerRes.ok) throw new Error("Failed to load Job Cost Ledger.");
// //         if (!schedKRes.ok) throw new Error("Failed to load Schedule K.");
// //         if (!scheduleIRes.ok) throw new Error("Failed to load Schedule I.");

// //         const ledgerData = await ledgerRes.json();
// //         const schedKData = await schedKRes.json();
// //         const scheduleIData = await scheduleIRes.json();
// //         const ratesData = await ratesRes.json();

// //         const normalizedScheduleIData = Array.isArray(scheduleIData)
// //           ? scheduleIData
// //           : [];
// //         setScheduleIData(normalizedScheduleIData);

// //         buildRows(
// //           Array.isArray(ledgerData) ? ledgerData : [],
// //           Array.isArray(schedKData) ? schedKData : [],
// //           normalizedScheduleIData,
// //           ratesData,
// //         );
// //       } catch (err) {
// //         console.error("Failed to load Schedule I data:", err);
// //         setError(err?.message || "Failed to load Schedule I data.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     if (loading) return;
// //     setBillingRows((prevBilling) => {
// //       if (prevBilling.length === 0) return prevBilling;
// //       const flexMap = new Map(
// //         flexRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
// //       );
// //       const tmMap = new Map(
// //         tmRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
// //       );
// //       let changed = false;

// //       const updated = prevBilling.map((row) => {
// //         const key = String(row.reportLvl).trim();
// //         const cumulative = flexMap.has(key)
// //           ? flexMap.get(key)
// //           : tmMap.has(key)
// //             ? tmMap.get(key)
// //             : 0;
// //         const billed = Number(row.billedAmt) || 0;
// //         const overUnder = billed - cumulative;
// //         if (overUnder !== row.overUnderBilling) {
// //           changed = true;
// //           return { ...row, overUnderBilling: overUnder };
// //         }
// //         return row;
// //       });

// //       if (!changed) return prevBilling;
// //       const flexKeySet = new Set(
// //         flexRows.map((r) => String(r.reportLvl).trim()),
// //       );
// //       setBillingTotals(computeBillingTotals(updated, flexKeySet));
// //       return updated;
// //     });
// //   }, [flexRows, tmRows, loading]);

// //   const handleContractCellChange = (id, reportLvl, field, value) => {
// //     const matches = keyMatch(reportLvl);
// //     setFlexRows((prevFlex) => {
// //       if (!prevFlex.some(matches)) return prevFlex;
// //       const withEdit = prevFlex.map((row) =>
// //         matches(row) ? { ...row, [field]: value, isEdited: true } : row,
// //       );
// //       const { rows: recalculated, totals } = recalcContractRows(withEdit);
// //       setFlexTotals(totals);
// //       return recalculated;
// //     });

// //     setTmRows((prevTm) => {
// //       if (!prevTm.some(matches)) return prevTm;
// //       const withEdit = prevTm.map((row) =>
// //         matches(row) ? { ...row, [field]: value, isEdited: true } : row,
// //       );
// //       const { rows: recalculated, totals } = recalcContractRows(withEdit);
// //       setTmTotals(totals);
// //       return recalculated;
// //     });
// //   };

// //   const handleBillingChange = (id, reportLvl, field, value) => {
// //     const matches = keyMatch(reportLvl);
// //     setBillingRows((prev) => {
// //       const updated = prev.map((row) => {
// //         if (!matches(row)) return row;
// //         const updatedRow = { ...row, [field]: value, isEdited: true };

// //         if (field === "billedAmtInput") {
// //           const billed = parseAmt(value);
// //           updatedRow.billedAmt = billed;
// //           const flexRow = flexRows.find(matches);
// //           const tmRow = tmRows.find(matches);
// //           const netCumulative =
// //             flexRow?.netCumulative ?? tmRow?.netCumulative ?? 0;
// //           updatedRow.overUnderBilling = billed - netCumulative;
// //         }

// //         if (field === "billedDtInput") updatedRow.billedDt = toApiDate(value);
// //         if (field === "pvNo") updatedRow.pvNo = value;
// //         if (field === "completeFl") updatedRow.completeFl = Boolean(value);
// //         return updatedRow;
// //       });

// //       const flexKeySet = new Set(
// //         flexRows.map((x) => String(x.reportLvl).trim()),
// //       );
// //       setBillingTotals(computeBillingTotals(updated, flexKeySet));
// //       return updated;
// //     });
// //   };

// //   const buildUpsertPayload = () => {
// //     const payloadMap = new Map();

// //     [...flexRows, ...tmRows].forEach((row) => {
// //       const key = String(row.reportLvl).trim();
// //       if (!key || !row.isEdited) return;

// //       const priorYear = parseAmt(row.priorYearInput);
// //       const limitation = parseAmt(row.limitationInput);
// //       const cumulative = priorYear + (Number(row.currentYear) || 0);
// //       const netCum = cumulative - limitation;

// //       const billingRow = billingRows.find(
// //         (b) =>
// //           String(b.reportLvl || "").trim() === key &&
// //           String(b.schedCd || "")
// //             .trim()
// //             .toUpperCase() ===
// //             String(row.schedCd || "")
// //               .trim()
// //               .toUpperCase(),
// //       );

// //       payloadMap.set(key, {
// //         id: billingRow?.id || row.id || 0,
// //         year: row.year || FY_YEAR,
// //         schedCd: row.schedCd || "I",
// //         primeCntrId: row.contract || null,
// //         subctrId: row.sub || null,
// //         reportLvl: key,
// //         penalty_Clause: row.penalty_Clause || null,
// //         pyr_Settled_Amt: parseAmt(row.pyr_Settled_Amt),
// //         pyCost: priorYear,
// //         netCum,
// //         pvNo: billingRow?.pvNo || row.pvNo || null,
// //         billedDt: billingRow?.billedDt || row.billedDt || null,
// //         billedAmt: Number(billingRow?.billedAmt) || Number(row.billedAmt) || 0,
// //         completeFl: billingRow?.completeFl ?? row.completeFl ?? false,
// //         note: row.note || null,
// //       });
// //     });

// //     billingRows.forEach((row) => {
// //       const key = String(row.reportLvl).trim();
// //       if (!key || !row.isEdited) return;

// //       const existing = payloadMap.get(key);
// //       const resolvedBilledDt =
// //         row.billedDt ||
// //         (row.billedDtInput ? toApiDate(row.billedDtInput) : null);
// //       const resolvedBilledAmt = parseAmt(row.billedAmtInput);

// //       if (existing) {
// //         existing.pvNo = row.pvNo || null;
// //         existing.billedDt = resolvedBilledDt;
// //         existing.billedAmt = resolvedBilledAmt;
// //         existing.completeFl = Boolean(row.completeFl);
// //         payloadMap.set(key, existing);
// //       } else {
// //         const matches = keyMatch(key);
// //         const flexRow = flexRows.find(matches);
// //         const tmRow = tmRows.find(matches);
// //         const matchedRow = flexRow || tmRow;

// //         const pyCost = matchedRow ? parseAmt(matchedRow.priorYearInput) : 0;
// //         const cumulative = matchedRow
// //           ? pyCost + (Number(matchedRow.currentYear) || 0)
// //           : 0;
// //         const limitation = matchedRow
// //           ? parseAmt(matchedRow.limitationInput)
// //           : 0;
// //         const netCum = matchedRow ? cumulative - limitation : 0;

// //         payloadMap.set(key, {
// //           id: row.id || matchedRow?.id || 0,
// //           year: row.year || FY_YEAR,
// //           schedCd: row.schedCd || "I",
// //           primeCntrId: matchedRow?.contract || row.primeCntrId || null,
// //           subctrId: matchedRow?.sub || row.subctrId || null,
// //           reportLvl: key,
// //           Penalty_Clause: matchedRow?.penalty_Clause || null,
// //           Pyr_Settled_Amt: parseAmt(matchedRow?.pyr_Settled_Amt),
// //           pyCost,
// //           netCum,
// //           pvNo: row.pvNo || null,
// //           billedDt: resolvedBilledDt,
// //           billedAmt: resolvedBilledAmt,
// //           completeFl: Boolean(row.completeFl),
// //           Note: matchedRow?.note || null,
// //         });
// //       }
// //     });

// //     return Array.from(payloadMap.values());
// //   };

// //   const handleSave = async () => {
// //     try {
// //       setSaving(true);
// //       setError("");
// //       const payload = buildUpsertPayload();

// //       if (!payload.length) {
// //         alert("There is no Schedule I data to save.");
// //         return;
// //       }

// //       const filteredPayload = payload.filter(
// //         (p) =>
// //           !(
// //             p.billedAmt === 0 &&
// //             p.pvNo == null &&
// //             p.pyCost === 0 &&
// //             !p.Penalty_Clause &&
// //             !p.Note &&
// //             p.Pyr_Settled_Amt === 0
// //           ),
// //       );
// //       const hasMissingPvNo = filteredPayload.some(
// //         (row) => !row.pvNo || row.pvNo.trim() === "",
// //       );

// //       if (hasMissingPvNo) {
// //         alert("Please enter the PV No. for the edited row.");
// //         return;
// //       }

// //       const response = await fetch(
// //         `${backendUrl}/api/TrialBalance/ScheduleIUpsert`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(filteredPayload),
// //         },
// //       );
// //       const result = await response.json();
// //       if (!response.ok)
// //         throw new Error(result?.message || "Failed to save Schedule I.");

// //       alert(result?.message || "Schedule I saved successfully.");

// //       const [ledgerRes, schedKRes, scheduleIRes, ratesRes] = await Promise.all([
// //         fetch(`${backendUrl}/api/JobCostLedger`),
// //         fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
// //         fetch(
// //           `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
// //         ),
// //         fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
// //       ]);

// //       if (!ledgerRes.ok) throw new Error("Failed to reload Job Cost Ledger.");
// //       if (!schedKRes.ok) throw new Error("Failed to reload Schedule K.");
// //       if (!scheduleIRes.ok) throw new Error("Failed to reload Schedule I.");

// //       const ledgerData = await ledgerRes.json();
// //       const schedKData = await schedKRes.json();
// //       const scheduleIData = await scheduleIRes.json();
// //       const ratesData = await ratesRes.json();

// //       const normalizedScheduleIData = Array.isArray(scheduleIData)
// //         ? scheduleIData
// //         : [];
// //       setScheduleIData(normalizedScheduleIData);
// //       buildRows(
// //         Array.isArray(ledgerData) ? ledgerData : [],
// //         Array.isArray(schedKData) ? schedKData : [],
// //         normalizedScheduleIData,
// //         ratesData,
// //       );
// //     } catch (err) {
// //       console.error("Schedule I save failed:", err);
// //       setError(err?.message || "Failed to save Schedule I.");
// //       alert(err?.message || "Failed to save Schedule I.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const combinedTotal = flexTotals.cum + tmTotals.cum;
// //   const combinedNet = flexTotals.net + tmTotals.net;
// //   const billingRowsMap = new Map(
// //     billingRows.map((row) => [String(row.reportLvl).trim(), row]),
// //   );

// //   return (
// //     <>
// //       <style>{`
// //         .sched-i-page { width: 100%; height: auto; min-height: 100%; overflow-y: visible; overflow-x: auto; background: #f4f4f4; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 13px; padding: 18px 18px 35px; box-sizing: border-box; }
// //         .custom-scrollbar::-webkit-scrollbar,
// //         .sched-i-table-container::-webkit-scrollbar { height: 10px; width: 10px; }
// //         .custom-scrollbar::-webkit-scrollbar-track,
// //         .sched-i-table-container::-webkit-scrollbar-track { background: #f8fafc; border: 1px solid #e2e8f0; }
// //         .custom-scrollbar::-webkit-scrollbar-thumb,
// //         .sched-i-table-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
// //         .custom-scrollbar::-webkit-scrollbar-thumb:hover,
// //         .sched-i-table-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
// //         .sched-i-inner { width: fit-content; max-width: 100%; margin: 0 auto; }
// //         .sched-i-header { position: relative; min-height: 176px; }
// //         .schedule-links { position: absolute; left: 0; top: 0; width: 290px; line-height: 1.25; }
// //         .schedule-links a { display: block; color: #0000ee; text-decoration: underline; margin-top: 3px; cursor: pointer; }
// //         .schedule-heading { width: 825px; margin: 0 auto; text-align: center; font-weight: 700; }
// //         .company { background: #fff200; font-size: 17px; line-height: 1.15; padding: 3px; }
// //         .title { font-size: 17px; line-height: 1.25; padding: 4px 0; }
// //         .fiscal { background: #fff200; font-size: 17px; padding: 4px; }
// //         .ice { position: absolute; right: 14px; top: 3px; font-weight: 700; font-size: 16px; line-height: 1.2; }
// //         .blue-label { display: inline-block; color: #fff; background: #0000ee; padding: 2px 8px; margin-right: 4px; border: none; cursor: pointer; font-size: 12px; font-weight: bold; }
// //         .blue-label:hover { background: #0000c8; }

// //         .sched-i-tables-container { display: flex; flex-direction: column; gap: 18px; margin-top: 10px; }
// //         .sched-i-section-block { display: flex; flex-direction: column; }
// //         .sched-i-section-header { font-weight: 700; background: #f9f9f9; border: 1px solid #222; border-bottom: none; padding: 5px 8px; font-size: 13px; display: flex; align-items: center; width: max-content; min-width: 100%; box-sizing: border-box; }

// //         .sched-i-table-container { max-height: 380px; overflow-y: auto; overflow-x: auto; border: 1px solid #222; background: #fff; }
// //         .sched-i-grand-total-table-container { max-height: none; overflow-x: auto; overflow-y: hidden; border: 1px solid #222; background: #fff; }

// //         .sched-i-combined-table { border-collapse: separate; border-spacing: 0; table-layout: fixed; width: max-content; background: #fff; }
// //         .sched-i-combined-table th, .sched-i-combined-table td { border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; font-size: 12px; padding: 1px 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-sizing: border-box; }

// //         .sched-i-thead { position: sticky; top: 0; z-index: 25; }
// //         .sched-i-combined-table th { text-align: center; vertical-align: middle; font-weight: 700; line-height: 1.05; background: #f0f0f0; border-top: none; }
// //         .sched-i-combined-table .top-header th { height: 55px; border-bottom: 1px solid #222; }
// //         .sched-i-combined-table .column-header th { height: 64px; border-bottom: 1px solid #222; font-size: 11px; }
// //         .sched-i-combined-table td { height: 23px; }

// //         /* Frozen Columns up to Order No. (Contract: 130px, Subcontract: 130px, Order: 110px) */
// //         .freeze-col-1 { position: sticky; left: 0px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
// //         .freeze-col-2 { position: sticky; left: 130px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
// //         .freeze-col-3 { position: sticky; left: 260px; z-index: 10; width: 110px; min-width: 110px; max-width: 110px; border-right: 2px solid #555 !important; }

// //         .sched-i-thead th.freeze-col-1 { position: sticky; left: 0px; top: 55px; z-index: 35; background: #f0f0f0; }
// //         .sched-i-thead th.freeze-col-2 { position: sticky; left: 130px; top: 55px; z-index: 35; background: #f0f0f0; }
// //         .sched-i-thead th.freeze-col-3 { position: sticky; left: 260px; top: 55px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }

// //         .freeze-header-group { position: sticky; left: 0px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }

// //         .yellow { background: #fff200; }
// //         .cyan { background: #00dfe8 !important; }
// //         .left { text-align: left; }
// //         .num { text-align: right; font-variant-numeric: tabular-nums; }
// //         .center { text-align: center; }
// //         .editable-cell { background: #fff !important; padding: 0 !important; }
// //         .sched-i-input { width: 100%; height: 22px; box-sizing: border-box; border: 1px solid transparent; background: #fff; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 12px; padding: 1px 4px; outline: none; }
// //         .sched-i-input:hover { border-color: #bbb; }
// //         .sched-i-input:focus { border-color: #0000ee; background: #fff; }
// //         .subtotal td, .billing-total td { border-top: 1px solid #111; border-bottom: 1px solid #111; height: 31px; font-weight: 700; background: #f9f9f9; }
// //         .billing-total.grand td { border-top: 2px solid #111; border-bottom: 2px solid #111; background: #f9f9f9; }

// //         .notes { margin-top: 24px; font-size: 11px; line-height: 1.25; }
// //         .notes > div { margin-bottom: 5px; }
// //         .notes-title { font-weight: 700; text-decoration: underline; margin-bottom: 6px !important; }
// //         .legend { display: flex; align-items: stretch; margin-top: 40px; min-height: 24px; }
// //         .legend span { display: inline-flex; align-items: center; width: 255px; padding: 3px 5px; }
// //         .legend b { display: inline-flex; align-items: center; padding-left: 10px; font-weight: 400; }
// //         .legend.linked span { background: #fff200; }
// //         .legend.formula span { background: #00dfe8; }
// //         .legend.links span { background: #cfcfcf; }
// //         .sched-i-toolbar { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 8px; gap: 8px; }
// //         .sched-i-save-btn { border: 1px solid #0000ee; background: #0000ee; color: #fff; padding: 6px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }
// //         .sched-i-save-btn:hover { background: #0000c8; }
// //         .sched-i-save-btn:disabled { background: #999; border-color: #999; cursor: not-allowed; }
// //         .sched-i-error { margin: 8px 0; padding: 7px 10px; background: #ffe0e0; border: 1px solid #cc0000; color: #990000; font-weight: 600; }
// //         .sched-i-loading { padding: 20px; text-align: center; font-weight: 700; }
// //         @media print { .sched-i-page { padding: 0; background: #fff; } .sched-i-table-container { max-height: none !important; overflow: visible !important; } .sched-i-toolbar, .sched-i-error { display: none; } .sched-i-input { border: 0 !important; } }
// //       `}</style>

// //       <div className="sched-i-page custom-scrollbar">
// //         <div className="sched-i-inner">
// //           <div className="sched-i-header">
// //             <div className="schedule-links">
// //               <div>Schedule I is linked to the following schedules:</div>
// //               <a>Schedule H, Contract Costs</a>
// //               <a>Schedule K, T&amp;M</a>
// //               <a>ICE MANUAL</a>
// //             </div>
// //             <div className="schedule-heading">
// //               <div className="company">
// //                 {companyName}
// //                 <br />
// //                 {companyAddress}
// //               </div>
// //               <div className="title">
// //                 Schedule of Cumulative Direct and Indirect Costs Claimed and
// //                 Billed
// //                 <br />
// //                 by Contract and Subcontract
// //               </div>
// //               <div className="fiscal">Fiscal Year End - 12/31/2025</div>
// //             </div>
// //             <div className="ice">
// //               SCHEDULE I<br />
// //               ICE (version 2.0.1h)
// //             </div>
// //           </div>

// //           <div className="sched-i-toolbar">
// //             <button
// //               type="button"
// //               className="sched-i-save-btn"
// //               onClick={handleSave}
// //               disabled={saving || loading}
// //             >
// //               {saving ? "Saving..." : "Save Schedule I"}
// //             </button>
// //           </div>

// //           {error && <div className="sched-i-error">{error}</div>}

// //           {loading ? (
// //             <div className="sched-i-loading">Loading Schedule I...</div>
// //           ) : (
// //             <>
// //               <CombinedTable
// //                 flexRows={flexRows}
// //                 tmRows={tmRows}
// //                 billingRowsMap={billingRowsMap}
// //                 flexTotals={flexTotals}
// //                 tmTotals={tmTotals}
// //                 billingTotals={billingTotals}
// //                 combinedTotal={combinedTotal}
// //                 combinedNet={combinedNet}
// //                 onCellChange={handleContractCellChange}
// //                 onBillingChange={handleBillingChange}
// //                 onNavigate={onNavigate}
// //               />
// //               <Notes />
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // import React, { useState, useEffect } from "react";
// // import { backendUrl } from "../config";

// // /* =========================================================
// //    Helpers
// // ========================================================= */

// // const parseAmt = (val) => {
// //   if (val === null || val === undefined || val === "") return 0;
// //   if (typeof val === "number") {
// //     return Number.isFinite(val) ? val : 0;
// //   }
// //   const str = String(val).replace(/,/g, "").replace(/[()]/g, "-").trim();
// //   if (str === "" || str === "-") return 0;
// //   const parsed = parseFloat(str);
// //   return Number.isFinite(parsed) ? parsed : 0;
// // };

// // const formatVal = (val) => {
// //   const num = Number(val) || 0;
// //   return num === 0 ? "-" : Math.round(num).toLocaleString();
// // };

// // const formatInputValue = (val) => {
// //   if (val === null || val === undefined || val === "") return "";
// //   const num = Number(val);
// //   if (!Number.isFinite(num)) return "";
// //   return Math.round(num).toLocaleString();
// // };

// // const toApiDate = (dateValue) => {
// //   if (!dateValue) return null;
// //   const date = new Date(dateValue);
// //   if (Number.isNaN(date.getTime())) return null;
// //   return date.toISOString();
// // };

// // const sanitizeNumericInput = (value) => {
// //   if (value === null || value === undefined) return "";
// //   let str = String(value).replace(/[^0-9,.\-()]/g, "");
// //   const openCount = (str.match(/\(/g) || []).length;
// //   const closeCount = (str.match(/\)/g) || []).length;

// //   if (openCount > 1) {
// //     let seen = false;
// //     str = str.replace(/\(/g, () => {
// //       if (seen) return "";
// //       seen = true;
// //       return "(";
// //     });
// //   }
// //   if (closeCount > 1) {
// //     let seen = false;
// //     str = str.replace(/\)/g, () => {
// //       if (seen) return "";
// //       seen = true;
// //       return ")";
// //     });
// //   }

// //   const minusStripped = str.replace(/-/g, "");
// //   const hadMinus = str.startsWith("-");
// //   str = (hadMinus ? "-" : "") + minusStripped;

// //   const parts = str.split(".");
// //   if (parts.length > 2) {
// //     str = parts[0] + "." + parts.slice(1).join("");
// //   }
// //   return str;
// // };

// // const keyMatch = (reportLvl) => (row) =>
// //   String(row.reportLvl).trim() === String(reportLvl).trim();

// // const recalcContractRows = (rows = []) => {
// //   const updatedRows = rows.map((row) => {
// //     const priorAmount = parseAmt(row.priorYearInput);
// //     const currentAmount = Number(row.currentYear) || 0;
// //     const cumulative = priorAmount + currentAmount;
// //     const limitation = parseAmt(row.limitationInput);
// //     const netCumulative = cumulative - limitation;
// //     return { ...row, cumulative, netCumulative };
// //   });

// //   const totals = updatedRows.reduce(
// //     (acc, row) => {
// //       acc.settled += parseAmt(row.pyr_Settled_Amt);
// //       acc.prior += parseAmt(row.priorYearInput);
// //       acc.current += Number(row.currentYear) || 0;
// //       acc.cum += row.cumulative;
// //       acc.net += row.netCumulative;
// //       return acc;
// //     },
// //     { settled: 0, prior: 0, current: 0, cum: 0, net: 0 },
// //   );

// //   return { rows: updatedRows, totals };
// // };

// // const computeBillingTotals = (billingRows, flexKeySet) => {
// //   let flexBilled = 0;
// //   let flexOverUnder = 0;
// //   let tmBilled = 0;
// //   let tmOverUnder = 0;

// //   billingRows.forEach((row) => {
// //     const key = String(row.reportLvl).trim();
// //     const billed = Number(row.billedAmt) || 0;
// //     const overUnder = Number(row.overUnderBilling) || 0;

// //     if (flexKeySet.has(key)) {
// //       flexBilled += billed;
// //       flexOverUnder += overUnder;
// //     } else {
// //       tmBilled += billed;
// //       tmOverUnder += overUnder;
// //     }
// //   });

// //   return {
// //     flexBilled,
// //     flexOverUnder,
// //     tmBilled,
// //     tmOverUnder,
// //     totalBilled: flexBilled + tmBilled,
// //     totalOverUnder: flexOverUnder + tmOverUnder,
// //   };
// // };

// // /* =========================================================
// //    Table Colgroup & Header with Frozen Columns
// // ========================================================= */

// // const TableColgroup = () => (
// //   <colgroup>
// //     <col style={{ width: "130px", minWidth: "130px" }} />
// //     <col style={{ width: "130px", minWidth: "130px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "90px", minWidth: "90px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "125px", minWidth: "125px" }} />
// //     <col style={{ width: "125px", minWidth: "125px" }} />
// //     <col style={{ width: "125px", minWidth: "125px" }} />
// //     <col style={{ width: "100px", minWidth: "100px" }} />
// //     <col style={{ width: "115px", minWidth: "115px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "110px", minWidth: "110px" }} />
// //     <col style={{ width: "85px", minWidth: "85px" }} />
// //     <col style={{ width: "80px", minWidth: "80px" }} />
// //   </colgroup>
// // );

// // const TableHeader = () => (
// //   <thead className="sched-i-thead">
// //     <tr className="top-header">
// //       <th colSpan="3" className="freeze-header-group"></th>
// //       <th colSpan="2"></th>
// //       <th colSpan="2">
// //         Unsettled/Claimed Direct
// //         <br />
// //         And Indirect Costs Using
// //       </th>
// //       <th>
// //         Total
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or Claimed
// //       </th>
// //       <th>
// //         Less
// //         <br />
// //         Contract
// //         <br />
// //         Limitations
// //         <br />
// //         Rebates/Credits
// //       </th>
// //       <th>
// //         Net
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or Claimed
// //       </th>
// //       <th colSpan="3">Cumulative Cost Billed (Manual Entry)</th>
// //       <th rowSpan="2">
// //         Over
// //         <br />
// //         (Under)
// //         <br />
// //         Billing
// //       </th>
// //       <th rowSpan="2">
// //         Physically
// //         <br />
// //         Complete
// //         <br />
// //         (Note 7)
// //       </th>
// //       <th rowSpan="2">Note</th>
// //     </tr>
// //     <tr className="column-header">
// //       <th className="freeze-col-1">Contract No.</th>
// //       <th className="freeze-col-2">Subcontract No.</th>
// //       <th className="freeze-col-3">
// //         Order
// //         <br />
// //         No.
// //       </th>
// //       <th>
// //         Subject
// //         <br />
// //         To
// //         <br />
// //         Penalty
// //         <br />
// //         Clause
// //         <br />
// //         Note (2)
// //       </th>
// //       <th>
// //         Prior
// //         <br />
// //         Years
// //         <br />
// //         Settled
// //         <br />
// //         Total
// //         <br />
// //         Costs
// //         <br />
// //         Note (3)
// //       </th>
// //       <th>
// //         Prior Year
// //         <br />
// //         Costs
// //         <br />
// //         FYE
// //         <br />
// //         Note (4)
// //       </th>
// //       <th>
// //         Current Year
// //         <br />
// //         Costs
// //         <br />
// //         FYE
// //         <br />
// //         Note (4)
// //       </th>
// //       <th>
// //         Total
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or
// //         <br />
// //         Claimed
// //       </th>
// //       <th>
// //         Contract
// //         <br />
// //         Limitations
// //         <br />
// //         Rebates/Credits
// //         <br />
// //         Note (5)
// //       </th>
// //       <th>
// //         Net
// //         <br />
// //         Cumulative
// //         <br />
// //         Settled or
// //         <br />
// //         Claimed
// //         <br />
// //         Note (6)
// //       </th>
// //       <th>PV No.</th>
// //       <th>
// //         Date Cost Billed
// //         <br />
// //         Through
// //       </th>
// //       <th>Amount</th>
// //     </tr>
// //   </thead>
// // );

// // /* =========================================================
// //    Combined Contract + Billing Table
// // ========================================================= */

// // const CombinedTable = ({
// //   flexRows,
// //   tmRows,
// //   billingRowsMap,
// //   flexTotals,
// //   tmTotals,
// //   billingTotals,
// //   combinedTotal,
// //   combinedNet,
// //   onCellChange,
// //   onBillingChange,
// //   onNavigate,
// // }) => {
// //   const renderRow = (row, index) => {
// //     const key = String(row.reportLvl).trim();
// //     const billingRow = billingRowsMap.get(key) || {};

// //     return (
// //       <tr key={`${row.id || row.reportLvl}-${index}`}>
// //         {/* Frozen Column 1: Contract */}
// //         <td className="yellow left freeze-col-1">{row.contract || ""}</td>

// //         {/* Frozen Column 2: Subcontract */}
// //         <td className="yellow left freeze-col-2">{row.sub || ""}</td>

// //         {/* Frozen Column 3: Order No */}
// //         <td className="yellow freeze-col-3">{row.order || ""}</td>

// //         {/* Note (2): Penalty Clause */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input center"
// //             autoComplete="off"
// //             value={row.penalty_Clause ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "penalty_Clause",
// //                 e.target.value,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Note (3): Prior Years Settled Total Costs */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input center"
// //             autoComplete="off"
// //             inputMode="decimal"
// //             value={row.pyr_Settled_Amt ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "pyr_Settled_Amt",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Prior Year Cost */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input num"
// //             inputMode="decimal"
// //             autoComplete="off"
// //             value={row.priorYearInput ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "priorYearInput",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Current Year Cost */}
// //         <td className="num yellow">{formatVal(row.currentYear)}</td>

// //         {/* Total Cumulative */}
// //         <td className="num cyan">{formatVal(row.cumulative)}</td>

// //         {/* Limitation */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input num"
// //             inputMode="decimal"
// //             autoComplete="off"
// //             value={row.limitationInput ?? ""}
// //             onChange={(e) =>
// //               onCellChange(
// //                 row.id,
// //                 row.reportLvl,
// //                 "limitationInput",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Net Cumulative */}
// //         <td className="num cyan">{formatVal(row.netCumulative)}</td>

// //         {/* PV No */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input left"
// //             autoComplete="off"
// //             value={billingRow.pvNo ?? ""}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "pvNo",
// //                 e.target.value,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Billing Date */}
// //         <td className="editable-cell">
// //           <input
// //             type="date"
// //             className="sched-i-input"
// //             value={billingRow.billedDtInput ?? ""}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "billedDtInput",
// //                 e.target.value,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Billing Amount */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input num"
// //             inputMode="decimal"
// //             autoComplete="off"
// //             value={billingRow.billedAmtInput ?? ""}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "billedAmtInput",
// //                 sanitizeNumericInput(e.target.value),
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Over / Under Billing */}
// //         <td className="num cyan">{formatVal(billingRow.overUnderBilling)}</td>

// //         {/* Physically Complete */}
// //         <td className="editable-cell center">
// //           <input
// //             type="checkbox"
// //             checked={Boolean(billingRow.completeFl)}
// //             onChange={(e) =>
// //               onBillingChange(
// //                 billingRow.id || row.id,
// //                 row.reportLvl,
// //                 "completeFl",
// //                 e.target.checked,
// //               )
// //             }
// //           />
// //         </td>

// //         {/* Last Note */}
// //         <td className="editable-cell">
// //           <input
// //             className="sched-i-input left"
// //             autoComplete="off"
// //             value={row.note ?? ""}
// //             onChange={(e) =>
// //               onCellChange(row.id, row.reportLvl, "note", e.target.value)
// //             }
// //           />
// //         </td>
// //       </tr>
// //     );
// //   };

// //   return (
// //     <div className="sched-i-tables-container">
// //       {/* =========================================================
// //           1. COST TYPE & FLEXIBLY PRICED SECTION
// //       ========================================================= */}
// //       <div className="sched-i-section-block">
// //         <div className="sched-i-section-header">
// //           <button
// //             type="button"
// //             className="blue-label"
// //             onClick={() => onNavigate("sched_h")}
// //           >
// //             SCHED H
// //           </button>
// //           Cost Type &amp; Flexibly Priced:
// //         </div>
// //         <div className="sched-i-table-container custom-scrollbar">
// //           <table className="sched-i-combined-table">
// //             <TableColgroup />
// //             <TableHeader />
// //             <tbody>
// //               {flexRows.map(renderRow)}
// //               {/* SCHED H Subtotal */}
// //               <tr className="subtotal">
// //                 <td colSpan="3" className="freeze-header-group" style={{ textAlign: "left", paddingLeft: "8px" }}>
// //                   Subtotal-Cost &amp; Flexibly Priced Contracts
// //                 </td>
// //                 <td colSpan="4"></td>
// //                 <td className="num cyan">{formatVal(flexTotals.cum)}</td>
// //                 <td></td>
// //                 <td className="num cyan">{formatVal(flexTotals.net)}</td>
// //                 <td colSpan="2"></td>
// //                 <td className="num cyan">{formatVal(billingTotals.flexBilled)}</td>
// //                 <td className="num cyan">{formatVal(billingTotals.flexOverUnder)}</td>
// //                 <td colSpan="2"></td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* =========================================================
// //           2. TIME & MATERIAL SECTION
// //       ========================================================= */}
// //       <div className="sched-i-section-block">
// //         <div className="sched-i-section-header">
// //           <button
// //             type="button"
// //             className="blue-label"
// //             onClick={() => onNavigate("sched_k")}
// //           >
// //             SCHED K
// //           </button>
// //           Time &amp; Material
// //         </div>
// //         <div className="sched-i-table-container custom-scrollbar">
// //           <table className="sched-i-combined-table">
// //             <TableColgroup />
// //             <TableHeader />
// //             <tbody>
// //               {tmRows.map(renderRow)}
// //               {/* SCHED K Subtotal */}
// //               <tr className="subtotal">
// //                 <td colSpan="3" className="freeze-header-group" style={{ textAlign: "left", paddingLeft: "8px" }}>
// //                   Subtotal-Time &amp; Material Contracts
// //                 </td>
// //                 <td colSpan="4"></td>
// //                 <td className="num cyan">{formatVal(tmTotals.cum)}</td>
// //                 <td></td>
// //                 <td className="num cyan">{formatVal(tmTotals.net)}</td>
// //                 <td colSpan="2"></td>
// //                 <td className="num cyan">{formatVal(billingTotals.tmBilled)}</td>
// //                 <td className="num cyan">{formatVal(billingTotals.tmOverUnder)}</td>
// //                 <td colSpan="2"></td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* =========================================================
// //           3. GRAND TOTAL / COMBINED SECTION
// //       ========================================================= */}
// //       <div className="sched-i-section-block">
// //         <div className="sched-i-section-header total-heading">
// //           Total- Cost/Flexibly Priced and Time &amp; Material Contracts
// //         </div>
// //         <div className="sched-i-table-container sched-i-grand-total-table-container custom-scrollbar">
// //           <table className="sched-i-combined-table">
// //             <TableColgroup />
// //             <tbody>
// //               <tr className="subtotal billing-total grand">
// //                 <td colSpan="3" className="freeze-header-group" style={{ textAlign: "left", paddingLeft: "8px" }}>
// //                   Grand Total
// //                 </td>
// //                 <td colSpan="4"></td>
// //                 <td className="num cyan">{formatVal(combinedTotal)}</td>
// //                 <td></td>
// //                 <td className="num cyan">{formatVal(combinedNet)}</td>
// //                 <td colSpan="2"></td>
// //                 <td className="num cyan">{formatVal(billingTotals.totalBilled)}</td>
// //                 <td className="num cyan">{formatVal(billingTotals.totalOverUnder)}</td>
// //                 <td colSpan="2"></td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // /* =========================================================
// //    Notes
// // ========================================================= */

// // const Notes = () => (
// //   <div className="notes">
// //     <div className="notes-title">Explanatory Notes:</div>

// //     <div>
// //       <b>1.</b> Fiscal Year 2025 represents initial formal Incurred Cost
// //       Submission (ICS). The amounts reflected in Schedule I, Column 'Prior Year
// //       Costs' (Note 4), represent the cumulative actual costs incurred on
// //       flexibly priced contracts from their respective inception dates through
// //       December 31, 2024. Historically, these contracts were not subject to
// //       formal ICS filing requirements; however, prior year actuals have been
// //       included herein to establish the accurate cumulative-to-date cost position
// //       and to ensure proper reconciliation with life-to-date billings.
// //     </div>

// //     <div>
// //       <b>2.</b> Revenue totals in the Financial Statements include a $1,029.30
// //       revenue accrual that does not have corresponding costs on project
// //       C1435.001. This revenue accrual is excluded from the Incurred Cost
// //       Submission as no allowable costs were incurred or billed related to this
// //       balance in FY 2025.
// //     </div>

// //     <div>
// //       <b>3.</b> Project C1800.U is non billable project and it has $382K labor
// //       costs accrued for 12/29 &amp; 12/31, which is allowable cost. These costs
// //       were accrued to a nonbillable project code C1800.U in the General Ledger
// //       to exclude from NASA 533 reporting but are properly allocable to the
// //       active project C1800.C for the period of 12/29–12/31. Hence shown as under
// //       billed and ensures proper matching of incurred costs to contract billings
// //       and revenue for FY 2025. The unbilled in accounting system tie back to the
// //       under bill amount of this project on this schedule 'I'.
// //     </div>

// //     <div>
// //       <b>4.</b> Contract limitation of $276K updated for project C1800.C as the
// //       cost not billed/claimed towards the teammate's Fee.
// //     </div>

// //     <div className="legend linked">
// //       <span>Linked to Other Worksheet</span>
// //       <b>Current Year Contract Costs, Schedule H and K</b>
// //     </div>

// //     <div className="legend formula">
// //       <span>Cell Contains a Formula</span>
// //       <b>
// //         Formulas calculate Total and Net Cumulative Claimed and or Settled
// //         Amounts
// //       </b>
// //     </div>

// //     <div className="legend links">
// //       <span>Cell Contains a Formula With Links</span>
// //       <b>None</b>
// //     </div>
// //   </div>
// // );

// // /* =========================================================
// //    Main Component
// // ========================================================= */

// // export default function SchedI({ companyName, companyAddress, onNavigate }) {
// //   const [flexRows, setFlexRows] = useState([]);
// //   const [tmRows, setTmRows] = useState([]);
// //   const [billingRows, setBillingRows] = useState([]);

// //   const [flexTotals, setFlexTotals] = useState({
// //     settled: 0,
// //     prior: 0,
// //     current: 0,
// //     cum: 0,
// //     net: 0,
// //   });

// //   const [tmTotals, setTmTotals] = useState({
// //     settled: 0,
// //     prior: 0,
// //     current: 0,
// //     cum: 0,
// //     net: 0,
// //   });

// //   const [billingTotals, setBillingTotals] = useState({
// //     flexBilled: 0,
// //     flexOverUnder: 0,
// //     tmBilled: 0,
// //     tmOverUnder: 0,
// //     totalBilled: 0,
// //     totalOverUnder: 0,
// //   });

// //   const [scheduleIData, setScheduleIData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");

// //   const FY_YEAR = 2025;

// //   /* =========================================================
// //      Build UI rows
// //   ========================================================= */

// //   const buildRows = (ledgerData, schedKData, scheduleIData, ratesData) => {
// //     let rates = { fringe: 0, aeroFringe: 0, custOH: 0, colOH: 0, smh: 0, ga: 0 };
// //     if (ratesData && ratesData.schedules) {
// //       ratesData.schedules.forEach((schedule) => {
// //         let rawRate = parseFloat(schedule.rate) || 0;
// //         let percentForm = rawRate > 1 ? rawRate : rawRate * 100;
// //         percentForm = Math.round(percentForm * 100) / 100;
// //         const r = percentForm / 100;

// //         if (schedule.name.includes("Fringe Pool") || schedule.name === "Fringe") rates.fringe = r;
// //         else if (schedule.name.includes("AERO Fringe")) rates.aeroFringe = r;
// //         else if (schedule.name.includes("Customer Site Overhead")) rates.custOH = r;
// //         else if (schedule.name.includes("Off - Site Overhead")) rates.colOH = r;
// //         else if (schedule.name.includes("Subk & Material Handling")) rates.smh = r;
// //         else if (schedule.name.includes("General and Administrative")) rates.ga = r;
// //       });
// //     }

// //     const scheduleIDict = {};
// //     scheduleIData.forEach((item) => {
// //       if (!item.reportLvl) return;
// //       scheduleIDict[String(item.reportLvl).trim()] = item;
// //     });

// //     const flexGroup = {};
// //     const lookupDict = {};

// //     ledgerData.forEach((row) => {
// //       const key = row.reportLvl || row.projId;
// //       if (!key) return;

// //       if (!lookupDict[key])
// //         lookupDict[key] = {
// //           contract: row.primeCntrId || "",
// //           sub: row.subctrId || "",
// //         };

// //       if (Number(row.year) === 2025) {
// //         const pt = (row.projType || "").toUpperCase();
// //         let cat = "Flexibly Priced";
// //         if (pt.includes("CPFF") || pt.includes("CPAF")) cat = "Cost-Type";
// //         else if (pt === "T&M" || pt.includes("T&M")) cat = "T&M";
// //         else if (pt.includes("FIXED") || pt === "FFP") cat = "Fixed Price";
// //         else if (pt.includes("COMMERCIAL")) cat = "Commercial";
// //         else if (pt.includes("IR&D") || pt.includes("B&P")) cat = "IR&D&BP";

// //         if (cat === "Cost-Type" || cat === "Flexibly Priced") {
// //           if (!flexGroup[key]) {
// //             flexGroup[key] = {
// //               contract: row.primeCntrId || "",
// //               sub: row.subctrId || "",
// //               order: key,
// //               cat: cat,
// //               laborOnsite: 0,
// //               laborOffsite: 0,
// //               laborAero: 0,
// //               travel: 0,
// //               material: 0,
// //               odc: 0,
// //               subcontracts: 0,
// //               unburden: 0,
// //             };
// //           }

// //           const amount = parseFloat(row.amount) || 0;
// //           if (
// //             row.acctId === "50-00-01" ||
// //             row.acctId === "50-00-98" ||
// //             row.acctId === "59-00-01"
// //           ) {
// //             if (row.orgId === "1.1.01" || row.acctId === "59-00-01")
// //               flexGroup[key].laborAero += amount;
// //             else flexGroup[key].laborOnsite += amount;
// //           } else if (row.acctId === "50-00-02") {
// //             flexGroup[key].laborOffsite += amount;
// //           } else if (
// //             row.acctId &&
// //             (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
// //           ) {
// //             flexGroup[key].travel += amount;
// //           } else if (
// //             ["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)
// //           ) {
// //             flexGroup[key].material += amount;
// //           } else if (
// //             ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(
// //               row.acctId,
// //             )
// //           ) {
// //             flexGroup[key].odc += amount;
// //           } else if (
// //             [
// //               "50-21-01",
// //               "50-21-02",
// //               "50-21-03",
// //               "50-21-04",
// //               "50-22-01",
// //             ].includes(row.acctId)
// //           ) {
// //             flexGroup[key].subcontracts += amount;
// //           } else if (
// //             ["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)
// //           ) {
// //             flexGroup[key].unburden += amount;
// //           }
// //         }
// //       }
// //     });

// //     /* =====================================================
// //        FLEX ROWS
// //     ===================================================== */
// //     let totalFlexSettled = 0;
// //     let totalFlexPrior = 0;
// //     let totalFlexCurrent = 0;
// //     let totalFlexCum = 0;
// //     let totalFlexNet = 0;

// //     const generatedFlexRows = Object.values(flexGroup).map((rawItem) => {
// //       const reportLvl = String(rawItem.order).trim();
// //       const saved = scheduleIDict[reportLvl] || null;

// //       const item = {
// //         laborOnsite: Math.round(rawItem.laborOnsite),
// //         laborOffsite: Math.round(rawItem.laborOffsite),
// //         laborAero: Math.round(rawItem.laborAero),
// //         travel: Math.round(rawItem.travel),
// //         material: Math.round(rawItem.material),
// //         odc: Math.round(rawItem.odc),
// //         subcontracts: Math.round(rawItem.subcontracts),
// //         unburden: Math.round(rawItem.unburden),
// //       };

// //       const totalLabor = item.laborOnsite + item.laborOffsite + item.laborAero;
// //       const totalDirectCosts =
// //         totalLabor +
// //         item.travel +
// //         item.material +
// //         item.odc +
// //         item.subcontracts +
// //         item.unburden;

// //       const fringeOnsite = Math.round(item.laborOnsite * rates.fringe);
// //       const fringeOffsite = Math.round(item.laborOffsite * rates.fringe);
// //       const fringeAero = Math.round(item.laborAero * rates.aeroFringe);

// //       const ohOnsiteBase =
// //         item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;
// //       const ohOffsiteBase = item.laborOffsite + fringeOffsite;
// //       const smhBase = item.material + item.subcontracts;

// //       const ohOnsite = Math.round(ohOnsiteBase * rates.custOH);
// //       const ohOffsite = Math.round(ohOffsiteBase * rates.colOH);
// //       const ohSMH = Math.round(smhBase * rates.smh);

// //       const totalIndirectCosts =
// //         fringeOnsite +
// //         fringeOffsite +
// //         fringeAero +
// //         ohOnsite +
// //         ohOffsite +
// //         ohSMH;

// //       const directPlusOH = totalDirectCosts + totalIndirectCosts;
// //       const gaBase =
// //         directPlusOH -
// //         (item.material + item.subcontracts + item.unburden + ohSMH);
// //       const gaApplied = Math.round(gaBase * rates.ga);

// //       const grandTotal = directPlusOH + gaApplied;
// //       const currentYearCost = grandTotal;

// //       const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
// //       const pyrSettledAmt =
// //         saved?.pyrSettledAmt != null
// //           ? Number(saved.pyrSettledAmt)
// //           : saved?.pyr_Settled_Amt != null
// //             ? Number(saved.pyr_Settled_Amt)
// //             : 0;

// //       const cumulative = priorYear + currentYearCost;
// //       const netCumulative =
// //         saved?.netCum != null ? Number(saved.netCum) : cumulative;
// //       const limitation = cumulative - netCumulative;

// //       totalFlexSettled += pyrSettledAmt;
// //       totalFlexPrior += priorYear;
// //       totalFlexCurrent += currentYearCost;
// //       totalFlexCum += cumulative;
// //       totalFlexNet += netCumulative;

// //       return {
// //         id: saved?.id || 0,
// //         year: saved?.year || FY_YEAR,
// //         schedCd: saved?.schedCd || "I",
// //         contract: rawItem.contract || saved?.primeCntrId || "",
// //         sub: rawItem.sub || saved?.subctrId || "",
// //         reportLvl,
// //         order: reportLvl,
// //         penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
// //         pyr_Settled_Amt:
// //           pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
// //         priorYearInput:
// //           saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
// //         currentYear: currentYearCost,
// //         cumulative,
// //         limitationInput:
// //           saved?.netCum != null ? formatInputValue(limitation) : "",
// //         netCumulative,
// //         pvNo: saved?.pvNo || "",
// //         billedDt: saved?.billedDt || null,
// //         billedAmt: saved?.billedAmt || 0,
// //         completeFl: saved?.completeFl ?? false,
// //         note: saved?.note ?? saved?.Note ?? "",
// //         isEdited: false,
// //       };
// //     });

// //     /* =====================================================
// //        TM ROWS
// //     ===================================================== */
// //     const tmGroup = {};
// //     schedKData.forEach((row) => {
// //       const key = row.invcProjId;
// //       if (!key) return;
// //       if (!tmGroup[key]) {
// //         const lookup = lookupDict[key] || { contract: "", sub: "" };
// //         tmGroup[key] = {
// //           contract: lookup.contract,
// //           sub: lookup.sub || row.taskId || "",
// //           order: key,
// //           amount: 0,
// //         };
// //       }
// //       tmGroup[key].amount += parseFloat(row.amount) || 0;
// //     });

// //     let totalTmSettled = 0;
// //     let totalTmPrior = 0;
// //     let totalTmCurrent = 0;
// //     let totalTmCum = 0;
// //     let totalTmNet = 0;

// //     const generatedTmRows = Object.values(tmGroup).map((item) => {
// //       const reportLvl = String(item.order).trim();
// //       const saved = scheduleIDict[reportLvl] || null;
// //       const currentYearCost = Number(item.amount) || 0;
// //       const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
// //       const pyrSettledAmt =
// //         saved?.pyrSettledAmt != null
// //           ? Number(saved.pyrSettledAmt)
// //           : saved?.pyr_Settled_Amt != null
// //             ? Number(saved.pyr_Settled_Amt)
// //             : 0;
// //       const cumulative = priorYear + currentYearCost;
// //       const netCumulative =
// //         saved?.netCum != null ? Number(saved.netCum) : cumulative;
// //       const limitation = cumulative - netCumulative;

// //       totalTmSettled += pyrSettledAmt;
// //       totalTmPrior += priorYear;
// //       totalTmCurrent += currentYearCost;
// //       totalTmCum += cumulative;
// //       totalTmNet += netCumulative;

// //       return {
// //         id: saved?.id || 0,
// //         year: saved?.year || FY_YEAR,
// //         schedCd: saved?.schedCd || "I",
// //         contract: item.contract || saved?.primeCntrId || "",
// //         sub: item.sub || saved?.subctrId || "",
// //         reportLvl,
// //         order: reportLvl,
// //         penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
// //         pyr_Settled_Amt:
// //           pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
// //         priorYearInput:
// //           saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
// //         currentYear: currentYearCost,
// //         cumulative,
// //         limitationInput:
// //           saved?.netCum != null ? formatInputValue(limitation) : "",
// //         netCumulative,
// //         pvNo: saved?.pvNo || "",
// //         billedDt: saved?.billedDt || null,
// //         billedAmt: saved?.billedAmt || 0,
// //         completeFl: saved?.completeFl ?? false,
// //         note: saved?.note ?? saved?.Note ?? "",
// //         isEdited: false,
// //       };
// //     });

// //     /* =====================================================
// //        BILLING DATA
// //     ===================================================== */
// //     const billingData = scheduleIData
// //       .filter(
// //         (item) =>
// //           item.pvNo ||
// //           item.billedDt ||
// //           (item.billedAmt !== null && item.billedAmt !== undefined),
// //       )
// //       .map((item) => {
// //         const billedAmount = Number(item.billedAmt) || 0;
// //         const flexMatch = generatedFlexRows.find(
// //           (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
// //         );
// //         const tmMatch = generatedTmRows.find(
// //           (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
// //         );
// //         const cost = flexMatch?.netCumulative ?? tmMatch?.netCumulative ?? 0;
// //         const overUnder = billedAmount - cost;

// //         return {
// //           id: item.id || 0,
// //           year: item.year || FY_YEAR,
// //           schedCd: item.schedCd || "I",
// //           primeCntrId: item.primeCntrId || "",
// //           subctrId: item.subctrId || "",
// //           reportLvl: item.reportLvl || "",
// //           pvNo: item.pvNo || "",
// //           billedDt: item.billedDt || null,
// //           billedDtInput: item.billedDt
// //             ? new Date(item.billedDt).toISOString().split("T")[0]
// //             : "",
// //           billedAmt: billedAmount,
// //           billedAmtInput:
// //             item.billedAmt != null ? formatInputValue(item.billedAmt) : "",
// //           completeFl: item.completeFl ?? false,
// //           overUnderBilling: overUnder,
// //           isEdited: false,
// //         };
// //       });

// //     const existingBillingKeys = new Set(
// //       billingData.map((x) => String(x.reportLvl).trim()),
// //     );

// //     [...generatedFlexRows, ...generatedTmRows].forEach((row) => {
// //       const key = String(row.reportLvl).trim();
// //       if (!key) return;
// //       if (!existingBillingKeys.has(key)) {
// //         billingData.push({
// //           id: row.id || 0,
// //           year: FY_YEAR,
// //           schedCd: "I",
// //           primeCntrId: row.contract || "",
// //           subctrId: row.sub || "",
// //           reportLvl: key,
// //           pvNo: row.pvNo || "",
// //           billedDt: null,
// //           billedDtInput: "",
// //           billedAmt: 0,
// //           billedAmtInput: "",
// //           completeFl: row.completeFl || false,
// //           overUnderBilling: 0,
// //           isEdited: false,
// //         });
// //       }
// //     });

// //     const flexBillingKeys = new Set(
// //       generatedFlexRows.map((x) => String(x.reportLvl).trim()),
// //     );
// //     setFlexRows(generatedFlexRows);
// //     setTmRows(generatedTmRows);
// //     setFlexTotals({
// //       settled: totalFlexSettled,
// //       prior: totalFlexPrior,
// //       current: totalFlexCurrent,
// //       cum: totalFlexCum,
// //       net: totalFlexNet,
// //     });
// //     setTmTotals({
// //       settled: totalTmSettled,
// //       prior: totalTmPrior,
// //       current: totalTmCurrent,
// //       cum: totalTmCum,
// //       net: totalTmNet,
// //     });
// //     setBillingRows(billingData);
// //     setBillingTotals(computeBillingTotals(billingData, flexBillingKeys));
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         const [ledgerRes, schedKRes, scheduleIRes, ratesRes] =
// //           await Promise.all([
// //             fetch(`${backendUrl}/api/JobCostLedger`),
// //             fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
// //             fetch(
// //               `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
// //             ),
// //             fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
// //           ]);

// //         if (!ledgerRes.ok) throw new Error("Failed to load Job Cost Ledger.");
// //         if (!schedKRes.ok) throw new Error("Failed to load Schedule K.");
// //         if (!scheduleIRes.ok) throw new Error("Failed to load Schedule I.");

// //         const ledgerData = await ledgerRes.json();
// //         const schedKData = await schedKRes.json();
// //         const scheduleIData = await scheduleIRes.json();
// //         const ratesData = await ratesRes.json();

// //         const normalizedScheduleIData = Array.isArray(scheduleIData)
// //           ? scheduleIData
// //           : [];
// //         setScheduleIData(normalizedScheduleIData);

// //         buildRows(
// //           Array.isArray(ledgerData) ? ledgerData : [],
// //           Array.isArray(schedKData) ? schedKData : [],
// //           normalizedScheduleIData,
// //           ratesData,
// //         );
// //       } catch (err) {
// //         console.error("Failed to load Schedule I data:", err);
// //         setError(err?.message || "Failed to load Schedule I data.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     if (loading) return;
// //     setBillingRows((prevBilling) => {
// //       if (prevBilling.length === 0) return prevBilling;
// //       const flexMap = new Map(
// //         flexRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
// //       );
// //       const tmMap = new Map(
// //         tmRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
// //       );
// //       let changed = false;

// //       const updated = prevBilling.map((row) => {
// //         const key = String(row.reportLvl).trim();
// //         const cumulative = flexMap.has(key)
// //           ? flexMap.get(key)
// //           : tmMap.has(key)
// //             ? tmMap.get(key)
// //             : 0;
// //         const billed = Number(row.billedAmt) || 0;
// //         const overUnder = billed - cumulative;
// //         if (overUnder !== row.overUnderBilling) {
// //           changed = true;
// //           return { ...row, overUnderBilling: overUnder };
// //         }
// //         return row;
// //       });

// //       if (!changed) return prevBilling;
// //       const flexKeySet = new Set(
// //         flexRows.map((r) => String(r.reportLvl).trim()),
// //       );
// //       setBillingTotals(computeBillingTotals(updated, flexKeySet));
// //       return updated;
// //     });
// //   }, [flexRows, tmRows, loading]);

// //   const handleContractCellChange = (id, reportLvl, field, value) => {
// //     const matches = keyMatch(reportLvl);
// //     setFlexRows((prevFlex) => {
// //       if (!prevFlex.some(matches)) return prevFlex;
// //       const withEdit = prevFlex.map((row) =>
// //         matches(row) ? { ...row, [field]: value, isEdited: true } : row,
// //       );
// //       const { rows: recalculated, totals } = recalcContractRows(withEdit);
// //       setFlexTotals(totals);
// //       return recalculated;
// //     });

// //     setTmRows((prevTm) => {
// //       if (!prevTm.some(matches)) return prevTm;
// //       const withEdit = prevTm.map((row) =>
// //         matches(row) ? { ...row, [field]: value, isEdited: true } : row,
// //       );
// //       const { rows: recalculated, totals } = recalcContractRows(withEdit);
// //       setTmTotals(totals);
// //       return recalculated;
// //     });
// //   };

// //   const handleBillingChange = (id, reportLvl, field, value) => {
// //     const matches = keyMatch(reportLvl);
// //     setBillingRows((prev) => {
// //       const updated = prev.map((row) => {
// //         if (!matches(row)) return row;
// //         const updatedRow = { ...row, [field]: value, isEdited: true };

// //         if (field === "billedAmtInput") {
// //           const billed = parseAmt(value);
// //           updatedRow.billedAmt = billed;
// //           const flexRow = flexRows.find(matches);
// //           const tmRow = tmRows.find(matches);
// //           const netCumulative =
// //             flexRow?.netCumulative ?? tmRow?.netCumulative ?? 0;
// //           updatedRow.overUnderBilling = billed - netCumulative;
// //         }

// //         if (field === "billedDtInput") updatedRow.billedDt = toApiDate(value);
// //         if (field === "pvNo") updatedRow.pvNo = value;
// //         if (field === "completeFl") updatedRow.completeFl = Boolean(value);
// //         return updatedRow;
// //       });

// //       const flexKeySet = new Set(
// //         flexRows.map((x) => String(x.reportLvl).trim()),
// //       );
// //       setBillingTotals(computeBillingTotals(updated, flexKeySet));
// //       return updated;
// //     });
// //   };

// //   const buildUpsertPayload = () => {
// //     const payloadMap = new Map();

// //     [...flexRows, ...tmRows].forEach((row) => {
// //       const key = String(row.reportLvl).trim();
// //       if (!key || !row.isEdited) return;

// //       const priorYear = parseAmt(row.priorYearInput);
// //       const limitation = parseAmt(row.limitationInput);
// //       const cumulative = priorYear + (Number(row.currentYear) || 0);
// //       const netCum = cumulative - limitation;

// //       const billingRow = billingRows.find(
// //         (b) =>
// //           String(b.reportLvl || "").trim() === key &&
// //           String(b.schedCd || "")
// //             .trim()
// //             .toUpperCase() ===
// //           String(row.schedCd || "")
// //             .trim()
// //             .toUpperCase(),
// //       );

// //       payloadMap.set(key, {
// //         id: billingRow?.id || row.id || 0,
// //         year: row.year || FY_YEAR,
// //         schedCd: row.schedCd || "I",
// //         primeCntrId: row.contract || null,
// //         subctrId: row.sub || null,
// //         reportLvl: key,
// //         penalty_Clause: row.penalty_Clause || null,
// //         pyr_Settled_Amt: parseAmt(row.pyr_Settled_Amt),
// //         pyCost: priorYear,
// //         netCum,
// //         pvNo: billingRow?.pvNo || row.pvNo || null,
// //         billedDt: billingRow?.billedDt || row.billedDt || null,
// //         billedAmt: Number(billingRow?.billedAmt) || Number(row.billedAmt) || 0,
// //         completeFl: billingRow?.completeFl ?? row.completeFl ?? false,
// //         note: row.note || null,
// //       });
// //     });

// //     billingRows.forEach((row) => {
// //       const key = String(row.reportLvl).trim();
// //       if (!key || !row.isEdited) return;

// //       const existing = payloadMap.get(key);
// //       const resolvedBilledDt =
// //         row.billedDt ||
// //         (row.billedDtInput ? toApiDate(row.billedDtInput) : null);
// //       const resolvedBilledAmt = parseAmt(row.billedAmtInput);

// //       if (existing) {
// //         existing.pvNo = row.pvNo || null;
// //         existing.billedDt = resolvedBilledDt;
// //         existing.billedAmt = resolvedBilledAmt;
// //         existing.completeFl = Boolean(row.completeFl);
// //         payloadMap.set(key, existing);
// //       } else {
// //         const matches = keyMatch(key);
// //         const flexRow = flexRows.find(matches);
// //         const tmRow = tmRows.find(matches);
// //         const matchedRow = flexRow || tmRow;

// //         const pyCost = matchedRow ? parseAmt(matchedRow.priorYearInput) : 0;
// //         const cumulative = matchedRow
// //           ? pyCost + (Number(matchedRow.currentYear) || 0)
// //           : 0;
// //         const limitation = matchedRow
// //           ? parseAmt(matchedRow.limitationInput)
// //           : 0;
// //         const netCum = matchedRow ? cumulative - limitation : 0;

// //         payloadMap.set(key, {
// //           id: row.id || matchedRow?.id || 0,
// //           year: row.year || FY_YEAR,
// //           schedCd: row.schedCd || "I",
// //           primeCntrId: matchedRow?.contract || row.primeCntrId || null,
// //           subctrId: matchedRow?.sub || row.subctrId || null,
// //           reportLvl: key,
// //           Penalty_Clause: matchedRow?.penalty_Clause || null,
// //           Pyr_Settled_Amt: parseAmt(matchedRow?.pyr_Settled_Amt),
// //           pyCost,
// //           netCum,
// //           pvNo: row.pvNo || null,
// //           billedDt: resolvedBilledDt,
// //           billedAmt: resolvedBilledAmt,
// //           completeFl: Boolean(row.completeFl),
// //           Note: matchedRow?.note || null,
// //         });
// //       }
// //     });

// //     return Array.from(payloadMap.values());
// //   };

// //   const handleSave = async () => {
// //     try {
// //       setSaving(true);
// //       setError("");
// //       const payload = buildUpsertPayload();

// //       if (!payload.length) {
// //         alert("There is no Schedule I data to save.");
// //         return;
// //       }

// //       const filteredPayload = payload.filter(
// //         (p) =>
// //           !(
// //             p.billedAmt === 0 &&
// //             p.pvNo == null &&
// //             p.pyCost === 0 &&
// //             !p.Penalty_Clause &&
// //             !p.Note &&
// //             p.Pyr_Settled_Amt === 0
// //           ),
// //       );
// //       const hasMissingPvNo = filteredPayload.some(
// //         (row) => !row.pvNo || row.pvNo.trim() === "",
// //       );

// //       if (hasMissingPvNo) {
// //         alert("Please enter the PV No. for the edited row.");
// //         return;
// //       }

// //       const response = await fetch(
// //         `${backendUrl}/api/TrialBalance/ScheduleIUpsert`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(filteredPayload),
// //         },
// //       );
// //       const result = await response.json();
// //       if (!response.ok)
// //         throw new Error(result?.message || "Failed to save Schedule I.");

// //       alert(result?.message || "Schedule I saved successfully.");

// //       const [ledgerRes, schedKRes, scheduleIRes, ratesRes] = await Promise.all([
// //         fetch(`${backendUrl}/api/JobCostLedger`),
// //         fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
// //         fetch(
// //           `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
// //         ),
// //         fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
// //       ]);

// //       if (!ledgerRes.ok) throw new Error("Failed to reload Job Cost Ledger.");
// //       if (!schedKRes.ok) throw new Error("Failed to reload Schedule K.");
// //       if (!scheduleIRes.ok) throw new Error("Failed to reload Schedule I.");

// //       const ledgerData = await ledgerRes.json();
// //       const schedKData = await schedKRes.json();
// //       const scheduleIData = await scheduleIRes.json();
// //       const ratesData = await ratesRes.json();

// //       const normalizedScheduleIData = Array.isArray(scheduleIData)
// //         ? scheduleIData
// //         : [];
// //       setScheduleIData(normalizedScheduleIData);
// //       buildRows(
// //         Array.isArray(ledgerData) ? ledgerData : [],
// //         Array.isArray(schedKData) ? schedKData : [],
// //         normalizedScheduleIData,
// //         ratesData,
// //       );
// //     } catch (err) {
// //       console.error("Schedule I save failed:", err);
// //       setError(err?.message || "Failed to save Schedule I.");
// //       alert(err?.message || "Failed to save Schedule I.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const combinedTotal = flexTotals.cum + tmTotals.cum;
// //   const combinedNet = flexTotals.net + tmTotals.net;
// //   const billingRowsMap = new Map(
// //     billingRows.map((row) => [String(row.reportLvl).trim(), row]),
// //   );

// //   return (
// //     <>
// //       <style>{`
// //         .sched-i-page { width: 100%; height: auto; min-height: 100%; overflow-y: visible; overflow-x: auto; background: #f4f4f4; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 13px; padding: 18px 18px 35px; box-sizing: border-box; }
// //         .custom-scrollbar::-webkit-scrollbar,
// //         .sched-i-table-container::-webkit-scrollbar { height: 10px; width: 10px; }
// //         .custom-scrollbar::-webkit-scrollbar-track,
// //         .sched-i-table-container::-webkit-scrollbar-track { background: #f8fafc; border: 1px solid #e2e8f0; }
// //         .custom-scrollbar::-webkit-scrollbar-thumb,
// //         .sched-i-table-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
// //         .custom-scrollbar::-webkit-scrollbar-thumb:hover,
// //         .sched-i-table-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
// //         .sched-i-inner { width: fit-content; max-width: 100%; margin: 0 auto; }
// //         .sched-i-header { position: relative; min-height: 176px; }
// //         .schedule-links { position: absolute; left: 0; top: 0; width: 290px; line-height: 1.25; }
// //         .schedule-links a { display: block; color: #0000ee; text-decoration: underline; margin-top: 3px; cursor: pointer; }
// //         .schedule-heading { width: 825px; margin: 0 auto; text-align: center; font-weight: 700; }
// //         .company { background: #fff200; font-size: 17px; line-height: 1.15; padding: 3px; }
// //         .title { font-size: 17px; line-height: 1.25; padding: 4px 0; }
// //         .fiscal { background: #fff200; font-size: 17px; padding: 4px; }
// //         .ice { position: absolute; right: 14px; top: 3px; font-weight: 700; font-size: 16px; line-height: 1.2; }
// //         .blue-label { display: inline-block; color: #fff; background: #0000ee; padding: 2px 8px; margin-right: 4px; border: none; cursor: pointer; font-size: 12px; font-weight: bold; }
// //         .blue-label:hover { background: #0000c8; }

// //         .sched-i-tables-container { display: flex; flex-direction: column; gap: 18px; margin-top: 10px; }
// //         .sched-i-section-block { display: flex; flex-direction: column; }
// //         .sched-i-section-header { font-weight: 700; background: #f9f9f9; border: 1px solid #222; border-bottom: none; padding: 5px 8px; font-size: 13px; display: flex; align-items: center; width: max-content; min-width: 100%; box-sizing: border-box; }

// //         .sched-i-table-container { max-height: 380px; overflow-y: auto; overflow-x: auto; border: 1px solid #222; background: #fff; }
// //         .sched-i-grand-total-table-container { max-height: none; overflow-x: auto; overflow-y: hidden; border: 1px solid #222; background: #fff; }

// //         .sched-i-combined-table { border-collapse: separate; border-spacing: 0; table-layout: fixed; width: max-content; background: #fff; }
// //         .sched-i-combined-table th, .sched-i-combined-table td { border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; font-size: 12px; padding: 1px 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-sizing: border-box; }

// //         .sched-i-thead { position: sticky; top: 0; z-index: 25; }
// //         .sched-i-combined-table th { text-align: center; vertical-align: middle; font-weight: 700; line-height: 1.05; background: #f0f0f0; border-top: none; }
// //         .sched-i-combined-table .top-header th { height: 55px; border-bottom: 1px solid #222; }
// //         .sched-i-combined-table .column-header th { height: 64px; border-bottom: 1px solid #222; font-size: 11px; }
// //         .sched-i-combined-table td { height: 23px; }

// //         /* Frozen Columns up to Order No. (Contract: 130px, Subcontract: 130px, Order: 110px) */
// //         .freeze-col-1 { position: sticky; left: 0px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
// //         .freeze-col-2 { position: sticky; left: 130px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
// //         .freeze-col-3 { position: sticky; left: 260px; z-index: 10; width: 110px; min-width: 110px; max-width: 110px; border-right: 2px solid #555 !important; }

// //         .sched-i-thead th.freeze-col-1 { position: sticky; left: 0px; top: 55px; z-index: 35; background: #f0f0f0; }
// //         .sched-i-thead th.freeze-col-2 { position: sticky; left: 130px; top: 55px; z-index: 35; background: #f0f0f0; }
// //         .sched-i-thead th.freeze-col-3 { position: sticky; left: 260px; top: 55px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }

// //         .freeze-header-group { position: sticky; left: 0px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }

// //         .yellow { background: #fff200; }
// //         .cyan { background: #00dfe8 !important; }
// //         .left { text-align: left; }
// //         .num { text-align: right; font-variant-numeric: tabular-nums; }
// //         .center { text-align: center; }
// //         .editable-cell { background: #fff !important; padding: 0 !important; }
// //         .sched-i-input { width: 100%; height: 22px; box-sizing: border-box; border: 1px solid transparent; background: #fff; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 12px; padding: 1px 4px; outline: none; }
// //         .sched-i-input:hover { border-color: #bbb; }
// //         .sched-i-input:focus { border-color: #0000ee; background: #fff; }
// //         .subtotal td, .billing-total td { border-top: 1px solid #111; border-bottom: 1px solid #111; height: 31px; font-weight: 700; background: #f9f9f9; }
// //         .billing-total.grand td { border-top: 2px solid #111; border-bottom: 2px solid #111; background: #f9f9f9; }

// //         .notes { margin-top: 24px; font-size: 11px; line-height: 1.25; }
// //         .notes > div { margin-bottom: 5px; }
// //         .notes-title { font-weight: 700; text-decoration: underline; margin-bottom: 6px !important; }
// //         .legend { display: flex; align-items: stretch; margin-top: 40px; min-height: 24px; }
// //         .legend span { display: inline-flex; align-items: center; width: 255px; padding: 3px 5px; }
// //         .legend b { display: inline-flex; align-items: center; padding-left: 10px; font-weight: 400; }
// //         .legend.linked span { background: #fff200; }
// //         .legend.formula span { background: #00dfe8; }
// //         .legend.links span { background: #cfcfcf; }
// //         .sched-i-toolbar { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 8px; gap: 8px; }
// //         .sched-i-save-btn { border: 1px solid #0000ee; background: #0000ee; color: #fff; padding: 6px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }
// //         .sched-i-save-btn:hover { background: #0000c8; }
// //         .sched-i-save-btn:disabled { background: #999; border-color: #999; cursor: not-allowed; }
// //         .sched-i-error { margin: 8px 0; padding: 7px 10px; background: #ffe0e0; border: 1px solid #cc0000; color: #990000; font-weight: 600; }
// //         .sched-i-loading { padding: 20px; text-align: center; font-weight: 700; }
// //         @media print { .sched-i-page { padding: 0; background: #fff; } .sched-i-table-container { max-height: none !important; overflow: visible !important; } .sched-i-toolbar, .sched-i-error { display: none; } .sched-i-input { border: 0 !important; } }
// //       `}</style>

// //       <div className="sched-i-page custom-scrollbar">
// //         <div className="sched-i-inner">
// //           <div className="sched-i-header">
// //             <div className="schedule-links">
// //               <div>Schedule I is linked to the following schedules:</div>
// //               <a>Schedule H, Contract Costs</a>
// //               <a>Schedule K, T&amp;M</a>
// //               <a>ICE MANUAL</a>
// //             </div>
// //             <div className="schedule-heading">
// //               <div className="company">
// //                 {companyName}
// //                 <br />
// //                 {companyAddress}
// //               </div>
// //               <div className="title">
// //                 Schedule of Cumulative Direct and Indirect Costs Claimed and
// //                 Billed
// //                 <br />
// //                 by Contract and Subcontract
// //               </div>
// //               <div className="fiscal">Fiscal Year End - 12/31/2025</div>
// //             </div>
// //             <div className="ice">
// //               SCHEDULE I<br />
// //               ICE (version 2.0.1h)
// //             </div>
// //           </div>

// //           <div className="sched-i-toolbar">
// //             <button
// //               type="button"
// //               className="sched-i-save-btn"
// //               onClick={handleSave}
// //               disabled={saving || loading}
// //             >
// //               {saving ? "Saving..." : "Save Schedule I"}
// //             </button>
// //           </div>

// //           {error && <div className="sched-i-error">{error}</div>}

// //           {loading ? (
// //             <div className="sched-i-loading">Loading Schedule I...</div>
// //           ) : (
// //             <>
// //               <CombinedTable
// //                 flexRows={flexRows}
// //                 tmRows={tmRows}
// //                 billingRowsMap={billingRowsMap}
// //                 flexTotals={flexTotals}
// //                 tmTotals={tmTotals}
// //                 billingTotals={billingTotals}
// //                 combinedTotal={combinedTotal}
// //                 combinedNet={combinedNet}
// //                 onCellChange={handleContractCellChange}
// //                 onBillingChange={handleBillingChange}
// //                 onNavigate={onNavigate}
// //               />
// //               <Notes />
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import { backendUrl } from "../config";

// /* =========================================================
//    Helpers
// ========================================================= */

// const parseAmt = (val) => {
//   if (val === null || val === undefined || val === "") return 0;
//   if (typeof val === "number") {
//     return Number.isFinite(val) ? val : 0;
//   }
//   const str = String(val).replace(/,/g, "").replace(/[()]/g, "-").trim();
//   if (str === "" || str === "-") return 0;
//   const parsed = parseFloat(str);
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const formatVal = (val) => {
//   const num = Number(val) || 0;
//   return num === 0 ? "-" : Math.round(num).toLocaleString();
// };

// const formatInputValue = (val) => {
//   if (val === null || val === undefined || val === "") return "";
//   const num = Number(val);
//   if (!Number.isFinite(num)) return "";
//   return Math.round(num).toLocaleString();
// };

// const toApiDate = (dateValue) => {
//   if (!dateValue) return null;
//   const date = new Date(dateValue);
//   if (Number.isNaN(date.getTime())) return null;
//   return date.toISOString();
// };

// const sanitizeNumericInput = (value) => {
//   if (value === null || value === undefined) return "";
//   let str = String(value).replace(/[^0-9,.\-()]/g, "");
//   const openCount = (str.match(/\(/g) || []).length;
//   const closeCount = (str.match(/\)/g) || []).length;

//   if (openCount > 1) {
//     let seen = false;
//     str = str.replace(/\(/g, () => {
//       if (seen) return "";
//       seen = true;
//       return "(";
//     });
//   }
//   if (closeCount > 1) {
//     let seen = false;
//     str = str.replace(/\)/g, () => {
//       if (seen) return "";
//       seen = true;
//       return ")";
//     });
//   }

//   const minusStripped = str.replace(/-/g, "");
//   const hadMinus = str.startsWith("-");
//   str = (hadMinus ? "-" : "") + minusStripped;

//   const parts = str.split(".");
//   if (parts.length > 2) {
//     str = parts[0] + "." + parts.slice(1).join("");
//   }
//   return str;
// };

// const keyMatch = (reportLvl) => (row) =>
//   String(row.reportLvl).trim() === String(reportLvl).trim();

// const recalcContractRows = (rows = []) => {
//   const updatedRows = rows.map((row) => {
//     const priorAmount = parseAmt(row.priorYearInput);
//     const currentAmount = Number(row.currentYear) || 0;
//     const cumulative = priorAmount + currentAmount;
//     const limitation = parseAmt(row.limitationInput);
//     const netCumulative = cumulative - limitation;
//     return { ...row, cumulative, netCumulative };
//   });

//   const totals = updatedRows.reduce(
//     (acc, row) => {
//       acc.settled += parseAmt(row.pyr_Settled_Amt);
//       acc.prior += parseAmt(row.priorYearInput);
//       acc.current += Number(row.currentYear) || 0;
//       acc.cum += row.cumulative;
//       acc.net += row.netCumulative;
//       return acc;
//     },
//     { settled: 0, prior: 0, current: 0, cum: 0, net: 0 },
//   );

//   return { rows: updatedRows, totals };
// };

// const computeBillingTotals = (billingRows, flexKeySet) => {
//   let flexBilled = 0;
//   let flexOverUnder = 0;
//   let tmBilled = 0;
//   let tmOverUnder = 0;

//   billingRows.forEach((row) => {
//     const key = String(row.reportLvl).trim();
//     const billed = Number(row.billedAmt) || 0;
//     const overUnder = Number(row.overUnderBilling) || 0;

//     if (flexKeySet.has(key)) {
//       flexBilled += billed;
//       flexOverUnder += overUnder;
//     } else {
//       tmBilled += billed;
//       tmOverUnder += overUnder;
//     }
//   });

//   return {
//     flexBilled,
//     flexOverUnder,
//     tmBilled,
//     tmOverUnder,
//     totalBilled: flexBilled + tmBilled,
//     totalOverUnder: flexOverUnder + tmOverUnder,
//   };
// };

// /* =========================================================
//    Table Colgroup & Header with Frozen Columns
// ========================================================= */

// const TableColgroup = () => (
//   <colgroup>
//     <col style={{ width: "130px", minWidth: "130px" }} />
//     <col style={{ width: "130px", minWidth: "130px" }} />
//     <col style={{ width: "110px", minWidth: "110px" }} />
//     <col style={{ width: "90px", minWidth: "90px" }} />
//     <col style={{ width: "110px", minWidth: "110px" }} />
//     <col style={{ width: "110px", minWidth: "110px" }} />
//     <col style={{ width: "110px", minWidth: "110px" }} />
//     <col style={{ width: "125px", minWidth: "125px" }} />
//     <col style={{ width: "125px", minWidth: "125px" }} />
//     <col style={{ width: "125px", minWidth: "125px" }} />
//     <col style={{ width: "100px", minWidth: "100px" }} />
//     <col style={{ width: "115px", minWidth: "115px" }} />
//     <col style={{ width: "110px", minWidth: "110px" }} />
//     <col style={{ width: "110px", minWidth: "110px" }} />
//     <col style={{ width: "85px", minWidth: "85px" }} />
//     <col style={{ width: "80px", minWidth: "80px" }} />
//   </colgroup>
// );

// const TableHeader = () => (
//   <thead className="sched-i-thead">
//     <tr className="top-header">
//       <th colSpan="3" className="freeze-header-group"></th>
//       <th colSpan="2"></th>
//       <th colSpan="2">
//         Unsettled/Claimed Direct
//         <br />
//         And Indirect Costs Using
//       </th>
//       <th>
//         Total
//         <br />
//         Cumulative
//         <br />
//         Settled or Claimed
//       </th>
//       <th>
//         Less
//         <br />
//         Contract
//         <br />
//         Limitations
//         <br />
//         Rebates/Credits
//       </th>
//       <th>
//         Net
//         <br />
//         Cumulative
//         <br />
//         Settled or Claimed
//       </th>
//       <th colSpan="3">Cumulative Cost Billed (Manual Entry)</th>
//       <th rowSpan="2">
//         Over
//         <br />
//         (Under)
//         <br />
//         Billing
//       </th>
//       <th rowSpan="2">
//         Physically
//         <br />
//         Complete
//         <br />
//         (Note 7)
//       </th>
//       <th rowSpan="2">Note</th>
//     </tr>
//     <tr className="column-header">
//       <th className="freeze-col-1">Contract No.</th>
//       <th className="freeze-col-2">Subcontract No.</th>
//       <th className="freeze-col-3">
//         Order
//         <br />
//         No.
//       </th>
//       <th>
//         Subject
//         <br />
//         To
//         <br />
//         Penalty
//         <br />
//         Clause
//         <br />
//         Note (2)
//       </th>
//       <th>
//         Prior
//         <br />
//         Years
//         <br />
//         Settled
//         <br />
//         Total
//         <br />
//         Costs
//         <br />
//         Note (3)
//       </th>
//       <th>
//         Prior Year
//         <br />
//         Costs
//         <br />
//         FYE
//         <br />
//         Note (4)
//       </th>
//       <th>
//         Current Year
//         <br />
//         Costs
//         <br />
//         FYE
//         <br />
//         Note (4)
//       </th>
//       <th>
//         Total
//         <br />
//         Cumulative
//         <br />
//         Settled or
//         <br />
//         Claimed
//       </th>
//       <th>
//         Contract
//         <br />
//         Limitations
//         <br />
//         Rebates/Credits
//         <br />
//         Note (5)
//       </th>
//       <th>
//         Net
//         <br />
//         Cumulative
//         <br />
//         Settled or
//         <br />
//         Claimed
//         <br />
//         Note (6)
//       </th>
//       <th>PV No.</th>
//       <th>
//         Date Cost Billed
//         <br />
//         Through
//       </th>
//       <th>Amount</th>
//     </tr>
//   </thead>
// );

// /* =========================================================
//    Combined Contract + Billing Table
// ========================================================= */

// const CombinedTable = ({
//   flexRows,
//   tmRows,
//   billingRowsMap,
//   flexTotals,
//   tmTotals,
//   billingTotals,
//   combinedTotal,
//   combinedNet,
//   onCellChange,
//   onBillingChange,
//   onNavigate,
// }) => {
//   const renderRow = (row, index) => {
//     const key = String(row.reportLvl).trim();
//     const billingRow = billingRowsMap.get(key) || {};

//     return (
//       <tr key={`${row.id || row.reportLvl}-${index}`}>
//         {/* Frozen Column 1: Contract */}
//         <td className="yellow left freeze-col-1">{row.contract || ""}</td>

//         {/* Frozen Column 2: Subcontract */}
//         <td className="yellow left freeze-col-2">{row.sub || ""}</td>

//         {/* Frozen Column 3: Order No */}
//         <td className="yellow freeze-col-3">{row.order || ""}</td>

//         {/* Note (2): Penalty Clause */}
//         <td className="editable-cell">
//           <input
//             className="sched-i-input center"
//             autoComplete="off"
//             value={row.penalty_Clause ?? ""}
//             onChange={(e) =>
//               onCellChange(
//                 row.id,
//                 row.reportLvl,
//                 "penalty_Clause",
//                 e.target.value,
//               )
//             }
//           />
//         </td>

//         {/* Note (3): Prior Years Settled Total Costs */}
//         <td className="editable-cell">
//           <input
//             className="sched-i-input center"
//             autoComplete="off"
//             inputMode="decimal"
//             value={row.pyr_Settled_Amt ?? ""}
//             onChange={(e) =>
//               onCellChange(
//                 row.id,
//                 row.reportLvl,
//                 "pyr_Settled_Amt",
//                 sanitizeNumericInput(e.target.value),
//               )
//             }
//           />
//         </td>

//         {/* Prior Year Cost */}
//         <td className="editable-cell">
//           <input
//             className="sched-i-input num"
//             inputMode="decimal"
//             autoComplete="off"
//             value={row.priorYearInput ?? ""}
//             onChange={(e) =>
//               onCellChange(
//                 row.id,
//                 row.reportLvl,
//                 "priorYearInput",
//                 sanitizeNumericInput(e.target.value),
//               )
//             }
//           />
//         </td>

//         {/* Current Year Cost */}
//         <td className="num yellow">{formatVal(row.currentYear)}</td>

//         {/* Total Cumulative */}
//         <td className="num cyan">{formatVal(row.cumulative)}</td>

//         {/* Limitation */}
//         <td className="editable-cell">
//           <input
//             className="sched-i-input num"
//             inputMode="decimal"
//             autoComplete="off"
//             value={row.limitationInput ?? ""}
//             onChange={(e) =>
//               onCellChange(
//                 row.id,
//                 row.reportLvl,
//                 "limitationInput",
//                 sanitizeNumericInput(e.target.value),
//               )
//             }
//           />
//         </td>

//         {/* Net Cumulative */}
//         <td className="num cyan">{formatVal(row.netCumulative)}</td>

//         {/* PV No */}
//         <td className="editable-cell">
//           <input
//             className="sched-i-input left"
//             autoComplete="off"
//             value={billingRow.pvNo ?? ""}
//             onChange={(e) =>
//               onBillingChange(
//                 billingRow.id || row.id,
//                 row.reportLvl,
//                 "pvNo",
//                 e.target.value,
//               )
//             }
//           />
//         </td>

//         {/* Billing Date */}
//         <td className="editable-cell">
//           <input
//             type="date"
//             className="sched-i-input"
//             value={billingRow.billedDtInput ?? ""}
//             onChange={(e) =>
//               onBillingChange(
//                 billingRow.id || row.id,
//                 row.reportLvl,
//                 "billedDtInput",
//                 e.target.value,
//               )
//             }
//           />
//         </td>

//         {/* Billing Amount */}
//         <td className="editable-cell">
//           <input
//             className="sched-i-input num"
//             inputMode="decimal"
//             autoComplete="off"
//             value={billingRow.billedAmtInput ?? ""}
//             onChange={(e) =>
//               onBillingChange(
//                 billingRow.id || row.id,
//                 row.reportLvl,
//                 "billedAmtInput",
//                 sanitizeNumericInput(e.target.value),
//               )
//             }
//           />
//         </td>

//         {/* Over / Under Billing */}
//         <td className="num cyan">{formatVal(billingRow.overUnderBilling)}</td>

//         {/* Physically Complete */}
//         <td className="editable-cell center">
//           <input
//             type="checkbox"
//             checked={Boolean(billingRow.completeFl)}
//             onChange={(e) =>
//               onBillingChange(
//                 billingRow.id || row.id,
//                 row.reportLvl,
//                 "completeFl",
//                 e.target.checked,
//               )
//             }
//           />
//         </td>

//         {/* Last Note */}
//         <td className="editable-cell">
//           <input
//             className="sched-i-input left"
//             autoComplete="off"
//             value={row.note ?? ""}
//             onChange={(e) =>
//               onCellChange(row.id, row.reportLvl, "note", e.target.value)
//             }
//           />
//         </td>
//       </tr>
//     );
//   };

//   return (
//     <div className="sched-i-tables-container">
//       {/* =========================================================
//           1. COST TYPE & FLEXIBLY PRICED SECTION
//       ========================================================= */}
//       <div className="sched-i-section-block">
//         <div className="sched-i-section-header">
//           <button
//             type="button"
//             className="blue-label"
//             onClick={() => onNavigate("sched_h")}
//           >
//             SCHED H
//           </button>
//           Cost Type &amp; Flexibly Priced:
//         </div>
//         <div className="sched-i-table-container custom-scrollbar">
//           <table className="sched-i-combined-table">
//             <TableColgroup />
//             <TableHeader />
//             <tbody>
//               {flexRows.map(renderRow)}
//               {/* SCHED H Subtotal */}
//               <tr className="subtotal">
//                 <td
//                   colSpan="3"
//                   className="freeze-header-group"
//                   style={{ textAlign: "left", paddingLeft: "8px" }}
//                 >
//                   Subtotal-Cost &amp; Flexibly Priced Contracts
//                 </td>
//                 <td colSpan="4"></td>
//                 <td className="num cyan">{formatVal(flexTotals.cum)}</td>
//                 <td></td>
//                 <td className="num cyan">{formatVal(flexTotals.net)}</td>
//                 <td colSpan="2"></td>
//                 <td className="num cyan">
//                   {formatVal(billingTotals.flexBilled)}
//                 </td>
//                 <td className="num cyan">
//                   {formatVal(billingTotals.flexOverUnder)}
//                 </td>
//                 <td colSpan="2"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* =========================================================
//           2. TIME & MATERIAL SECTION
//       ========================================================= */}
//       <div className="sched-i-section-block">
//         <div className="sched-i-section-header">
//           <button
//             type="button"
//             className="blue-label"
//             onClick={() => onNavigate("sched_k")}
//           >
//             SCHED K
//           </button>
//           Time &amp; Material
//         </div>
//         <div className="sched-i-table-container custom-scrollbar">
//           <table className="sched-i-combined-table">
//             <TableColgroup />
//             <TableHeader />
//             <tbody>
//               {tmRows.map(renderRow)}
//               {/* SCHED K Subtotal */}
//               <tr className="subtotal">
//                 <td
//                   colSpan="3"
//                   className="freeze-header-group"
//                   style={{ textAlign: "left", paddingLeft: "8px" }}
//                 >
//                   Subtotal-Time &amp; Material Contracts
//                 </td>
//                 <td colSpan="4"></td>
//                 <td className="num cyan">{formatVal(tmTotals.cum)}</td>
//                 <td></td>
//                 <td className="num cyan">{formatVal(tmTotals.net)}</td>
//                 <td colSpan="2"></td>
//                 <td className="num cyan">
//                   {formatVal(billingTotals.tmBilled)}
//                 </td>
//                 <td className="num cyan">
//                   {formatVal(billingTotals.tmOverUnder)}
//                 </td>
//                 <td colSpan="2"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* =========================================================
//           3. GRAND TOTAL / COMBINED SECTION
//       ========================================================= */}
//       <div className="sched-i-section-block">
//         <div className="sched-i-section-header total-heading">
//           Total- Cost/Flexibly Priced and Time &amp; Material Contracts
//         </div>
//         <div className="sched-i-table-container sched-i-grand-total-table-container custom-scrollbar">
//           <table className="sched-i-combined-table">
//             <TableColgroup />
//             <tbody>
//               <tr className="subtotal billing-total grand">
//                 <td
//                   colSpan="3"
//                   className="freeze-header-group"
//                   style={{ textAlign: "left", paddingLeft: "8px" }}
//                 >
//                   Grand Total
//                 </td>
//                 <td colSpan="4"></td>
//                 <td className="num cyan">{formatVal(combinedTotal)}</td>
//                 <td></td>
//                 <td className="num cyan">{formatVal(combinedNet)}</td>
//                 <td colSpan="2"></td>
//                 <td className="num cyan">
//                   {formatVal(billingTotals.totalBilled)}
//                 </td>
//                 <td className="num cyan">
//                   {formatVal(billingTotals.totalOverUnder)}
//                 </td>
//                 <td colSpan="2"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    Notes
// ========================================================= */

// const Notes = () => (
//   <div className="notes">
//     <div className="notes-title">Explanatory Notes:</div>

//     <div>
//       <b>1.</b> Fiscal Year 2025 represents initial formal Incurred Cost
//       Submission (ICS). The amounts reflected in Schedule I, Column 'Prior Year
//       Costs' (Note 4), represent the cumulative actual costs incurred on
//       flexibly priced contracts from their respective inception dates through
//       December 31, 2024. Historically, these contracts were not subject to
//       formal ICS filing requirements; however, prior year actuals have been
//       included herein to establish the accurate cumulative-to-date cost position
//       and to ensure proper reconciliation with life-to-date billings.
//     </div>

//     <div>
//       <b>2.</b> Revenue totals in the Financial Statements include a $1,029.30
//       revenue accrual that does not have corresponding costs on project
//       C1435.001. This revenue accrual is excluded from the Incurred Cost
//       Submission as no allowable costs were incurred or billed related to this
//       balance in FY 2025.
//     </div>

//     <div>
//       <b>3.</b> Project C1800.U is non billable project and it has $382K labor
//       costs accrued for 12/29 &amp; 12/31, which is allowable cost. These costs
//       were accrued to a nonbillable project code C1800.U in the General Ledger
//       to exclude from NASA 533 reporting but are properly allocable to the
//       active project C1800.C for the period of 12/29–12/31. Hence shown as under
//       billed and ensures proper matching of incurred costs to contract billings
//       and revenue for FY 2025. The unbilled in accounting system tie back to the
//       under bill amount of this project on this schedule 'I'.
//     </div>

//     <div>
//       <b>4.</b> Contract limitation of $276K updated for project C1800.C as the
//       cost not billed/claimed towards the teammate's Fee.
//     </div>

//     <div className="legend linked">
//       <span>Linked to Other Worksheet</span>
//       <b>Current Year Contract Costs, Schedule H and K</b>
//     </div>

//     <div className="legend formula">
//       <span>Cell Contains a Formula</span>
//       <b>
//         Formulas calculate Total and Net Cumulative Claimed and or Settled
//         Amounts
//       </b>
//     </div>

//     <div className="legend links">
//       <span>Cell Contains a Formula With Links</span>
//       <b>None</b>
//     </div>
//   </div>
// );

// /* =========================================================
//    Main Component
// ========================================================= */

// export default function SchedI1({ companyName, companyAddress, onNavigate }) {
//   const [flexRows, setFlexRows] = useState([]);
//   const [tmRows, setTmRows] = useState([]);
//   const [billingRows, setBillingRows] = useState([]);

//   const [flexTotals, setFlexTotals] = useState({
//     settled: 0,
//     prior: 0,
//     current: 0,
//     cum: 0,
//     net: 0,
//   });

//   const [tmTotals, setTmTotals] = useState({
//     settled: 0,
//     prior: 0,
//     current: 0,
//     cum: 0,
//     net: 0,
//   });

//   const [billingTotals, setBillingTotals] = useState({
//     flexBilled: 0,
//     flexOverUnder: 0,
//     tmBilled: 0,
//     tmOverUnder: 0,
//     totalBilled: 0,
//     totalOverUnder: 0,
//   });

//   const [scheduleIData, setScheduleIData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const FY_YEAR = 2025;

//   /* =========================================================
//      Build UI rows
//   ========================================================= */

//   const buildRows = (ledgerData, schedKData, scheduleIData, ratesData) => {
//     let rates = {
//       fringe: 0,
//       aeroFringe: 0,
//       custOH: 0,
//       colOH: 0,
//       smh: 0,
//       ga: 0,
//     };
//     if (ratesData && ratesData.schedules) {
//       ratesData.schedules.forEach((schedule) => {
//         let rawRate = parseFloat(schedule.rate) || 0;
//         let percentForm = rawRate > 1 ? rawRate : rawRate * 100;
//         percentForm = Math.round(percentForm * 100) / 100;
//         const r = percentForm / 100;

//         if (schedule.name.includes("Fringe Pool") || schedule.name === "Fringe")
//           rates.fringe = r;
//         else if (schedule.name.includes("AERO Fringe")) rates.aeroFringe = r;
//         else if (schedule.name.includes("Customer Site Overhead"))
//           rates.custOH = r;
//         else if (schedule.name.includes("Off - Site Overhead")) rates.colOH = r;
//         else if (schedule.name.includes("Subk & Material Handling"))
//           rates.smh = r;
//         else if (schedule.name.includes("General and Administrative"))
//           rates.ga = r;
//       });
//     }

//     const scheduleIDict = {};
//     scheduleIData.forEach((item) => {
//       if (!item.reportLvl) return;
//       scheduleIDict[String(item.reportLvl).trim()] = item;
//     });

//     const flexGroup = {};
//     const lookupDict = {};

//     ledgerData.forEach((row) => {
//       const key = row.reportLvl || row.projId;
//       if (!key) return;

//       if (!lookupDict[key])
//         lookupDict[key] = {
//           contract: row.primeCntrId || "",
//           sub: row.subctrId || "",
//         };

//       if (Number(row.year) === 2025) {
//         const pt = (row.projType || "").toUpperCase();
//         let cat = "Flexibly Priced";
//         if (pt.includes("CPFF") || pt.includes("CPAF")) cat = "Cost-Type";
//         else if (pt === "T&M" || pt.includes("T&M")) cat = "T&M";
//         else if (pt.includes("FIXED") || pt === "FFP") cat = "Fixed Price";
//         else if (pt.includes("COMMERCIAL")) cat = "Commercial";
//         else if (pt.includes("IR&D") || pt.includes("B&P")) cat = "IR&D&BP";

//         if (cat === "Cost-Type" || cat === "Flexibly Priced") {
//           if (!flexGroup[key]) {
//             flexGroup[key] = {
//               contract: row.primeCntrId || "",
//               sub: row.subctrId || "",
//               order: key,
//               cat: cat,
//               laborOnsite: 0,
//               laborOffsite: 0,
//               laborAero: 0,
//               travel: 0,
//               material: 0,
//               odc: 0,
//               subcontracts: 0,
//               unburden: 0,
//             };
//           }

//           const amount = parseFloat(row.amount) || 0;
//           if (
//             row.acctId === "50-00-01" ||
//             row.acctId === "50-00-98" ||
//             row.acctId === "59-00-01"
//           ) {
//             if (row.orgId === "1.1.01" || row.acctId === "59-00-01")
//               flexGroup[key].laborAero += amount;
//             else flexGroup[key].laborOnsite += amount;
//           } else if (row.acctId === "50-00-02") {
//             flexGroup[key].laborOffsite += amount;
//           } else if (
//             row.acctId &&
//             (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
//           ) {
//             flexGroup[key].travel += amount;
//           } else if (
//             ["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)
//           ) {
//             flexGroup[key].material += amount;
//           } else if (
//             ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(
//               row.acctId,
//             )
//           ) {
//             flexGroup[key].odc += amount;
//           } else if (
//             [
//               "50-21-01",
//               "50-21-02",
//               "50-21-03",
//               "50-21-04",
//               "50-22-01",
//             ].includes(row.acctId)
//           ) {
//             flexGroup[key].subcontracts += amount;
//           } else if (
//             ["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)
//           ) {
//             flexGroup[key].unburden += amount;
//           }
//         }
//       }
//     });

//     /* =====================================================
//        FLEX ROWS
//     ===================================================== */
//     let totalFlexSettled = 0;
//     let totalFlexPrior = 0;
//     let totalFlexCurrent = 0;
//     let totalFlexCum = 0;
//     let totalFlexNet = 0;

//     const generatedFlexRows = Object.values(flexGroup).map((rawItem) => {
//       const reportLvl = String(rawItem.order).trim();
//       const saved = scheduleIDict[reportLvl] || null;

//       const item = {
//         laborOnsite: Math.round(rawItem.laborOnsite),
//         laborOffsite: Math.round(rawItem.laborOffsite),
//         laborAero: Math.round(rawItem.laborAero),
//         travel: Math.round(rawItem.travel),
//         material: Math.round(rawItem.material),
//         odc: Math.round(rawItem.odc),
//         subcontracts: Math.round(rawItem.subcontracts),
//         unburden: Math.round(rawItem.unburden),
//       };

//       const totalLabor = item.laborOnsite + item.laborOffsite + item.laborAero;
//       const totalDirectCosts =
//         totalLabor +
//         item.travel +
//         item.material +
//         item.odc +
//         item.subcontracts +
//         item.unburden;

//       const fringeOnsite = Math.round(item.laborOnsite * rates.fringe);
//       const fringeOffsite = Math.round(item.laborOffsite * rates.fringe);
//       const fringeAero = Math.round(item.laborAero * rates.aeroFringe);

//       const ohOnsiteBase =
//         item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;
//       const ohOffsiteBase = item.laborOffsite + fringeOffsite;
//       const smhBase = item.material + item.subcontracts;

//       const ohOnsite = Math.round(ohOnsiteBase * rates.custOH);
//       const ohOffsite = Math.round(ohOffsiteBase * rates.colOH);
//       const ohSMH = Math.round(smhBase * rates.smh);

//       const totalIndirectCosts =
//         fringeOnsite +
//         fringeOffsite +
//         fringeAero +
//         ohOnsite +
//         ohOffsite +
//         ohSMH;

//       const directPlusOH = totalDirectCosts + totalIndirectCosts;
//       const gaBase =
//         directPlusOH -
//         (item.material + item.subcontracts + item.unburden + ohSMH);
//       const gaApplied = Math.round(gaBase * rates.ga);

//       const grandTotal = directPlusOH + gaApplied;
//       const currentYearCost = grandTotal;

//       const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
//       const pyrSettledAmt =
//         saved?.pyrSettledAmt != null
//           ? Number(saved.pyrSettledAmt)
//           : saved?.pyr_Settled_Amt != null
//             ? Number(saved.pyr_Settled_Amt)
//             : 0;

//       const cumulative = priorYear + currentYearCost;
//       const netCumulative =
//         saved?.netCum != null ? Number(saved.netCum) : cumulative;
//       const limitation = cumulative - netCumulative;

//       totalFlexSettled += pyrSettledAmt;
//       totalFlexPrior += priorYear;
//       totalFlexCurrent += currentYearCost;
//       totalFlexCum += cumulative;
//       totalFlexNet += netCumulative;

//       return {
//         id: saved?.id || 0,
//         year: saved?.year || FY_YEAR,
//         schedCd: saved?.schedCd || "I",
//         contract: rawItem.contract || saved?.primeCntrId || "",
//         sub: rawItem.sub || saved?.subctrId || "",
//         reportLvl,
//         order: reportLvl,
//         penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
//         pyr_Settled_Amt:
//           pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
//         priorYearInput:
//           saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
//         currentYear: currentYearCost,
//         cumulative,
//         limitationInput:
//           saved?.netCum != null ? formatInputValue(limitation) : "",
//         netCumulative,
//         pvNo: saved?.pvNo || "",
//         billedDt: saved?.billedDt || null,
//         billedAmt: saved?.billedAmt || 0,
//         completeFl: saved?.completeFl ?? false,
//         note: saved?.note ?? saved?.Note ?? "",
//         isEdited: false,
//       };
//     });

//     /* =====================================================
//        TM ROWS
//     ===================================================== */
//     const tmGroup = {};
//     schedKData.forEach((row) => {
//       const key = row.invcProjId;
//       if (!key) return;
//       if (!tmGroup[key]) {
//         const lookup = lookupDict[key] || { contract: "", sub: "" };
//         tmGroup[key] = {
//           contract: lookup.contract,
//           sub: lookup.sub || row.taskId || "",
//           order: key,
//           amount: 0,
//         };
//       }
//       tmGroup[key].amount += parseFloat(row.amount) || 0;
//     });

//     let totalTmSettled = 0;
//     let totalTmPrior = 0;
//     let totalTmCurrent = 0;
//     let totalTmCum = 0;
//     let totalTmNet = 0;

//     const generatedTmRows = Object.values(tmGroup).map((item) => {
//       const reportLvl = String(item.order).trim();
//       const saved = scheduleIDict[reportLvl] || null;
//       const currentYearCost = Number(item.amount) || 0;
//       const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
//       const pyrSettledAmt =
//         saved?.pyrSettledAmt != null
//           ? Number(saved.pyrSettledAmt)
//           : saved?.pyr_Settled_Amt != null
//             ? Number(saved.pyr_Settled_Amt)
//             : 0;
//       const cumulative = priorYear + currentYearCost;
//       const netCumulative =
//         saved?.netCum != null ? Number(saved.netCum) : cumulative;
//       const limitation = cumulative - netCumulative;

//       totalTmSettled += pyrSettledAmt;
//       totalTmPrior += priorYear;
//       totalTmCurrent += currentYearCost;
//       totalTmCum += cumulative;
//       totalTmNet += netCumulative;

//       return {
//         id: saved?.id || 0,
//         year: saved?.year || FY_YEAR,
//         schedCd: saved?.schedCd || "I",
//         contract: item.contract || saved?.primeCntrId || "",
//         sub: item.sub || saved?.subctrId || "",
//         reportLvl,
//         order: reportLvl,
//         penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
//         pyr_Settled_Amt:
//           pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
//         priorYearInput:
//           saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
//         currentYear: currentYearCost,
//         cumulative,
//         limitationInput:
//           saved?.netCum != null ? formatInputValue(limitation) : "",
//         netCumulative,
//         pvNo: saved?.pvNo || "",
//         billedDt: saved?.billedDt || null,
//         billedAmt: saved?.billedAmt || 0,
//         completeFl: saved?.completeFl ?? false,
//         note: saved?.note ?? saved?.Note ?? "",
//         isEdited: false,
//       };
//     });

//     /* =====================================================
//        BILLING DATA
//     ===================================================== */
//     const billingData = scheduleIData
//       .filter(
//         (item) =>
//           item.pvNo ||
//           item.billedDt ||
//           (item.billedAmt !== null && item.billedAmt !== undefined),
//       )
//       .map((item) => {
//         const billedAmount = Number(item.billedAmt) || 0;
//         const flexMatch = generatedFlexRows.find(
//           (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
//         );
//         const tmMatch = generatedTmRows.find(
//           (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
//         );
//         const cost = flexMatch?.netCumulative ?? tmMatch?.netCumulative ?? 0;
//         const overUnder = billedAmount - cost;

//         return {
//           id: item.id || 0,
//           year: item.year || FY_YEAR,
//           schedCd: item.schedCd || "I",
//           primeCntrId: item.primeCntrId || "",
//           subctrId: item.subctrId || "",
//           reportLvl: item.reportLvl || "",
//           pvNo: item.pvNo || "",
//           billedDt: item.billedDt || null,
//           billedDtInput: item.billedDt
//             ? new Date(item.billedDt).toISOString().split("T")[0]
//             : "",
//           billedAmt: billedAmount,
//           billedAmtInput:
//             item.billedAmt != null ? formatInputValue(item.billedAmt) : "",
//           completeFl: item.completeFl ?? false,
//           overUnderBilling: overUnder,
//           isEdited: false,
//         };
//       });

//     const existingBillingKeys = new Set(
//       billingData.map((x) => String(x.reportLvl).trim()),
//     );

//     [...generatedFlexRows, ...generatedTmRows].forEach((row) => {
//       const key = String(row.reportLvl).trim();
//       if (!key) return;
//       if (!existingBillingKeys.has(key)) {
//         billingData.push({
//           id: row.id || 0,
//           year: FY_YEAR,
//           schedCd: "I",
//           primeCntrId: row.contract || "",
//           subctrId: row.sub || "",
//           reportLvl: key,
//           pvNo: row.pvNo || "",
//           billedDt: null,
//           billedDtInput: "",
//           billedAmt: 0,
//           billedAmtInput: "",
//           completeFl: row.completeFl || false,
//           overUnderBilling: 0,
//           isEdited: false,
//         });
//       }
//     });

//     const flexBillingKeys = new Set(
//       generatedFlexRows.map((x) => String(x.reportLvl).trim()),
//     );
//     setFlexRows(generatedFlexRows);
//     setTmRows(generatedTmRows);
//     setFlexTotals({
//       settled: totalFlexSettled,
//       prior: totalFlexPrior,
//       current: totalFlexCurrent,
//       cum: totalFlexCum,
//       net: totalFlexNet,
//     });
//     setTmTotals({
//       settled: totalTmSettled,
//       prior: totalTmPrior,
//       current: totalTmCurrent,
//       cum: totalTmCum,
//       net: totalTmNet,
//     });
//     setBillingRows(billingData);
//     setBillingTotals(computeBillingTotals(billingData, flexBillingKeys));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const [ledgerRes, schedKRes, scheduleIRes, ratesRes] =
//           await Promise.all([
//             fetch(`${backendUrl}/api/JobCostLedger`),
//             fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
//             fetch(
//               `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
//             ),
//             fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
//           ]);

//         if (!ledgerRes.ok) throw new Error("Failed to load Job Cost Ledger.");
//         if (!schedKRes.ok) throw new Error("Failed to load Schedule K.");
//         if (!scheduleIRes.ok) throw new Error("Failed to load Schedule I.");

//         const ledgerData = await ledgerRes.json();
//         const schedKData = await schedKRes.json();
//         const scheduleIData = await scheduleIRes.json();
//         const ratesData = await ratesRes.json();

//         const normalizedScheduleIData = Array.isArray(scheduleIData)
//           ? scheduleIData
//           : [];
//         setScheduleIData(normalizedScheduleIData);

//         buildRows(
//           Array.isArray(ledgerData) ? ledgerData : [],
//           Array.isArray(schedKData) ? schedKData : [],
//           normalizedScheduleIData,
//           ratesData,
//         );
//       } catch (err) {
//         console.error("Failed to load Schedule I data:", err);
//         setError(err?.message || "Failed to load Schedule I data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (loading) return;
//     setBillingRows((prevBilling) => {
//       if (prevBilling.length === 0) return prevBilling;
//       const flexMap = new Map(
//         flexRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
//       );
//       const tmMap = new Map(
//         tmRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
//       );
//       let changed = false;

//       const updated = prevBilling.map((row) => {
//         const key = String(row.reportLvl).trim();
//         const cumulative = flexMap.has(key)
//           ? flexMap.get(key)
//           : tmMap.has(key)
//             ? tmMap.get(key)
//             : 0;
//         const billed = Number(row.billedAmt) || 0;
//         const overUnder = billed - cumulative;
//         if (overUnder !== row.overUnderBilling) {
//           changed = true;
//           return { ...row, overUnderBilling: overUnder };
//         }
//         return row;
//       });

//       if (!changed) return prevBilling;
//       const flexKeySet = new Set(
//         flexRows.map((r) => String(r.reportLvl).trim()),
//       );
//       setBillingTotals(computeBillingTotals(updated, flexKeySet));
//       return updated;
//     });
//   }, [flexRows, tmRows, loading]);

//   const handleContractCellChange = (id, reportLvl, field, value) => {
//     const matches = keyMatch(reportLvl);
//     setFlexRows((prevFlex) => {
//       if (!prevFlex.some(matches)) return prevFlex;
//       const withEdit = prevFlex.map((row) =>
//         matches(row) ? { ...row, [field]: value, isEdited: true } : row,
//       );
//       const { rows: recalculated, totals } = recalcContractRows(withEdit);
//       setFlexTotals(totals);
//       return recalculated;
//     });

//     setTmRows((prevTm) => {
//       if (!prevTm.some(matches)) return prevTm;
//       const withEdit = prevTm.map((row) =>
//         matches(row) ? { ...row, [field]: value, isEdited: true } : row,
//       );
//       const { rows: recalculated, totals } = recalcContractRows(withEdit);
//       setTmTotals(totals);
//       return recalculated;
//     });
//   };

//   const handleBillingChange = (id, reportLvl, field, value) => {
//     const matches = keyMatch(reportLvl);
//     setBillingRows((prev) => {
//       const updated = prev.map((row) => {
//         if (!matches(row)) return row;
//         const updatedRow = { ...row, [field]: value, isEdited: true };

//         if (field === "billedAmtInput") {
//           const billed = parseAmt(value);
//           updatedRow.billedAmt = billed;
//           const flexRow = flexRows.find(matches);
//           const tmRow = tmRows.find(matches);
//           const netCumulative =
//             flexRow?.netCumulative ?? tmRow?.netCumulative ?? 0;
//           updatedRow.overUnderBilling = billed - netCumulative;
//         }

//         if (field === "billedDtInput") updatedRow.billedDt = toApiDate(value);
//         if (field === "pvNo") updatedRow.pvNo = value;
//         if (field === "completeFl") updatedRow.completeFl = Boolean(value);
//         return updatedRow;
//       });

//       const flexKeySet = new Set(
//         flexRows.map((x) => String(x.reportLvl).trim()),
//       );
//       setBillingTotals(computeBillingTotals(updated, flexKeySet));
//       return updated;
//     });
//   };

//   const buildUpsertPayload = () => {
//     const payloadMap = new Map();

//     [...flexRows, ...tmRows].forEach((row) => {
//       const key = String(row.reportLvl).trim();
//       if (!key || !row.isEdited) return;

//       const priorYear = parseAmt(row.priorYearInput);
//       const limitation = parseAmt(row.limitationInput);
//       const cumulative = priorYear + (Number(row.currentYear) || 0);
//       const netCum = cumulative - limitation;

//       const billingRow = billingRows.find(
//         (b) =>
//           String(b.reportLvl || "").trim() === key &&
//           String(b.schedCd || "")
//             .trim()
//             .toUpperCase() ===
//             String(row.schedCd || "")
//               .trim()
//               .toUpperCase(),
//       );

//       payloadMap.set(key, {
//         id: billingRow?.id || row.id || 0,
//         year: row.year || FY_YEAR,
//         schedCd: row.schedCd || "I",
//         primeCntrId: row.contract || null,
//         subctrId: row.sub || null,
//         reportLvl: key,
//         penalty_Clause: row.penalty_Clause || null,
//         pyr_Settled_Amt: parseAmt(row.pyr_Settled_Amt),
//         pyCost: priorYear,
//         netCum,
//         pvNo: billingRow?.pvNo || row.pvNo || null,
//         billedDt: billingRow?.billedDt || row.billedDt || null,
//         billedAmt: Number(billingRow?.billedAmt) || Number(row.billedAmt) || 0,
//         completeFl: billingRow?.completeFl ?? row.completeFl ?? false,
//         note: row.note || null,
//       });
//     });

//     billingRows.forEach((row) => {
//       const key = String(row.reportLvl).trim();
//       if (!key || !row.isEdited) return;

//       const existing = payloadMap.get(key);
//       const resolvedBilledDt =
//         row.billedDt ||
//         (row.billedDtInput ? toApiDate(row.billedDtInput) : null);
//       const resolvedBilledAmt = parseAmt(row.billedAmtInput);

//       if (existing) {
//         existing.pvNo = row.pvNo || null;
//         existing.billedDt = resolvedBilledDt;
//         existing.billedAmt = resolvedBilledAmt;
//         existing.completeFl = Boolean(row.completeFl);
//         payloadMap.set(key, existing);
//       } else {
//         const matches = keyMatch(key);
//         const flexRow = flexRows.find(matches);
//         const tmRow = tmRows.find(matches);
//         const matchedRow = flexRow || tmRow;

//         const pyCost = matchedRow ? parseAmt(matchedRow.priorYearInput) : 0;
//         const cumulative = matchedRow
//           ? pyCost + (Number(matchedRow.currentYear) || 0)
//           : 0;
//         const limitation = matchedRow
//           ? parseAmt(matchedRow.limitationInput)
//           : 0;
//         const netCum = matchedRow ? cumulative - limitation : 0;

//         payloadMap.set(key, {
//           id: row.id || matchedRow?.id || 0,
//           year: row.year || FY_YEAR,
//           schedCd: row.schedCd || "I",
//           primeCntrId: matchedRow?.contract || row.primeCntrId || null,
//           subctrId: matchedRow?.sub || row.subctrId || null,
//           reportLvl: key,
//           Penalty_Clause: matchedRow?.penalty_Clause || null,
//           Pyr_Settled_Amt: parseAmt(matchedRow?.pyr_Settled_Amt),
//           pyCost,
//           netCum,
//           pvNo: row.pvNo || null,
//           billedDt: resolvedBilledDt,
//           billedAmt: resolvedBilledAmt,
//           completeFl: Boolean(row.completeFl),
//           Note: matchedRow?.note || null,
//         });
//       }
//     });

//     return Array.from(payloadMap.values());
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       setError("");
//       const payload = buildUpsertPayload();

//       if (!payload.length) {
//         alert("There is no Schedule I data to save.");
//         return;
//       }

//       const filteredPayload = payload.filter(
//         (p) =>
//           !(
//             p.billedAmt === 0 &&
//             p.pvNo == null &&
//             p.pyCost === 0 &&
//             !p.Penalty_Clause &&
//             !p.Note &&
//             p.Pyr_Settled_Amt === 0
//           ),
//       );
//       const hasMissingPvNo = filteredPayload.some(
//         (row) => !row.pvNo || row.pvNo.trim() === "",
//       );

//       if (hasMissingPvNo) {
//         alert("Please enter the PV No. for the edited row.");
//         return;
//       }

//       const response = await fetch(
//         `${backendUrl}/api/TrialBalance/ScheduleIUpsert`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(filteredPayload),
//         },
//       );
//       const result = await response.json();
//       if (!response.ok)
//         throw new Error(result?.message || "Failed to save Schedule I.");

//       alert(result?.message || "Schedule I saved successfully.");

//       const [ledgerRes, schedKRes, scheduleIRes, ratesRes] = await Promise.all([
//         fetch(`${backendUrl}/api/JobCostLedger`),
//         fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
//         fetch(
//           `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
//         ),
//         fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
//       ]);

//       if (!ledgerRes.ok) throw new Error("Failed to reload Job Cost Ledger.");
//       if (!schedKRes.ok) throw new Error("Failed to reload Schedule K.");
//       if (!scheduleIRes.ok) throw new Error("Failed to reload Schedule I.");

//       const ledgerData = await ledgerRes.json();
//       const schedKData = await schedKRes.json();
//       const scheduleIData = await scheduleIRes.json();
//       const ratesData = await ratesRes.json();

//       const normalizedScheduleIData = Array.isArray(scheduleIData)
//         ? scheduleIData
//         : [];
//       setScheduleIData(normalizedScheduleIData);
//       buildRows(
//         Array.isArray(ledgerData) ? ledgerData : [],
//         Array.isArray(schedKData) ? schedKData : [],
//         normalizedScheduleIData,
//         ratesData,
//       );
//     } catch (err) {
//       console.error("Schedule I save failed:", err);
//       setError(err?.message || "Failed to save Schedule I.");
//       alert(err?.message || "Failed to save Schedule I.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const combinedTotal = flexTotals.cum + tmTotals.cum;
//   const combinedNet = flexTotals.net + tmTotals.net;
//   const billingRowsMap = new Map(
//     billingRows.map((row) => [String(row.reportLvl).trim(), row]),
//   );

//   return (
//     <>
//       <style>{`
//         .sched-i-page { width: 100%; height: auto; min-height: 100%; overflow-y: visible; overflow-x: auto; background: #f4f4f4; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 13px; padding: 18px 18px 35px; box-sizing: border-box; }
//         .custom-scrollbar::-webkit-scrollbar,
//         .sched-i-table-container::-webkit-scrollbar { height: 10px; width: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-track,
//         .sched-i-table-container::-webkit-scrollbar-track { background: #f8fafc; border: 1px solid #e2e8f0; }
//         .custom-scrollbar::-webkit-scrollbar-thumb,
//         .sched-i-table-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover,
//         .sched-i-table-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//         .sched-i-inner { width: fit-content; max-width: 100%; margin: 0 auto; }
//         .sched-i-header { position: relative; min-height: 176px; }
//         .schedule-links { position: absolute; left: 0; top: 0; width: 290px; line-height: 1.25; }
//         .schedule-links a { display: block; color: #0000ee; text-decoration: underline; margin-top: 3px; cursor: pointer; }
//         .schedule-heading { width: 825px; margin: 0 auto; text-align: center; font-weight: 700; }
//         .company { background: #fff200; font-size: 17px; line-height: 1.15; padding: 3px; }
//         .title { font-size: 17px; line-height: 1.25; padding: 4px 0; }
//         .fiscal { background: #fff200; font-size: 17px; padding: 4px; }
//         .ice { position: absolute; right: 14px; top: 3px; font-weight: 700; font-size: 16px; line-height: 1.2; }
//         .blue-label { display: inline-block; color: #fff; background: #0000ee; padding: 2px 8px; margin-right: 4px; border: none; cursor: pointer; font-size: 12px; font-weight: bold; }
//         .blue-label:hover { background: #0000c8; }

//         .sched-i-tables-container { display: flex; flex-direction: column; gap: 18px; margin-top: 10px; }
//         .sched-i-section-block { display: flex; flex-direction: column; }
//         .sched-i-section-header { font-weight: 700; background: #f9f9f9; border: 1px solid #222; border-bottom: none; padding: 5px 8px; font-size: 13px; display: flex; align-items: center; width: max-content; min-width: 100%; box-sizing: border-box; }

//         .sched-i-table-container { max-height: 380px; overflow-y: auto; overflow-x: auto; border: 1px solid #222; background: #fff; }
//         .sched-i-grand-total-table-container { max-height: none; overflow-x: auto; overflow-y: hidden; border: 1px solid #222; background: #fff; }

//         .sched-i-combined-table { border-collapse: separate; border-spacing: 0; table-layout: fixed; width: max-content; background: #fff; }
//         .sched-i-combined-table th, .sched-i-combined-table td { border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; font-size: 12px; padding: 1px 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-sizing: border-box; }

//         .sched-i-thead { position: sticky; top: 0; z-index: 25; }
//         .sched-i-combined-table th { text-align: center; vertical-align: middle; font-weight: 700; line-height: 1.05; background: #f0f0f0; border-top: none; }
//         .sched-i-combined-table .top-header th { height: 55px; border-bottom: 1px solid #222; }
//         .sched-i-combined-table .column-header th { height: 64px; border-bottom: 1px solid #222; font-size: 11px; }
//         .sched-i-combined-table td { height: 23px; }

//         /* Frozen Columns up to Order No. (Contract: 130px, Subcontract: 130px, Order: 110px) */
//         .freeze-col-1 { position: sticky; left: 0px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
//         .freeze-col-2 { position: sticky; left: 130px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
//         .freeze-col-3 { position: sticky; left: 260px; z-index: 10; width: 110px; min-width: 110px; max-width: 110px; border-right: 2px solid #555 !important; }

//         .sched-i-thead th.freeze-col-1 { position: sticky; left: 0px; top: 55px; z-index: 35; background: #f0f0f0; }
//         .sched-i-thead th.freeze-col-2 { position: sticky; left: 130px; top: 55px; z-index: 35; background: #f0f0f0; }
//         .sched-i-thead th.freeze-col-3 { position: sticky; left: 260px; top: 55px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }

//         .freeze-header-group { position: sticky; left: 0px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }

//         .yellow { background: #fff200; }
//         .cyan { background: #00dfe8 !important; }
//         .left { text-align: left; }
//         .num { text-align: right; font-variant-numeric: tabular-nums; }
//         .center { text-align: center; }
//         .editable-cell { background: #fff !important; padding: 0 !important; }
//         .sched-i-input { width: 100%; height: 22px; box-sizing: border-box; border: 1px solid transparent; background: #fff; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 12px; padding: 1px 4px; outline: none; }
//         .sched-i-input:hover { border-color: #bbb; }
//         .sched-i-input:focus { border-color: #0000ee; background: #fff; }
//         .subtotal td, .billing-total td { border-top: 1px solid #111; border-bottom: 1px solid #111; height: 31px; font-weight: 700; background: #f9f9f9; }
//         .billing-total.grand td { border-top: 2px solid #111; border-bottom: 2px solid #111; background: #f9f9f9; }

//         .notes { margin-top: 24px; font-size: 11px; line-height: 1.25; }
//         .notes > div { margin-bottom: 5px; }
//         .notes-title { font-weight: 700; text-decoration: underline; margin-bottom: 6px !important; }
//         .legend { display: flex; align-items: stretch; margin-top: 40px; min-height: 24px; }
//         .legend span { display: inline-flex; align-items: center; width: 255px; padding: 3px 5px; }
//         .legend b { display: inline-flex; align-items: center; padding-left: 10px; font-weight: 400; }
//         .legend.linked span { background: #fff200; }
//         .legend.formula span { background: #00dfe8; }
//         .legend.links span { background: #cfcfcf; }
//         .sched-i-toolbar { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 8px; gap: 8px; }
//         .sched-i-save-btn { border: 1px solid #0000ee; background: #0000ee; color: #fff; padding: 6px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }
//         .sched-i-save-btn:hover { background: #0000c8; }
//         .sched-i-save-btn:disabled { background: #999; border-color: #999; cursor: not-allowed; }
//         .sched-i-error { margin: 8px 0; padding: 7px 10px; background: #ffe0e0; border: 1px solid #cc0000; color: #990000; font-weight: 600; }
//         .sched-i-loading { padding: 20px; text-align: center; font-weight: 700; }
//         @media print { .sched-i-page { padding: 0; background: #fff; } .sched-i-table-container { max-height: none !important; overflow: visible !important; } .sched-i-toolbar, .sched-i-error { display: none; } .sched-i-input { border: 0 !important; } }
//       `}</style>

//       <div className="sched-i-page custom-scrollbar">
//         <div className="sched-i-inner">
//           <div className="sched-i-header">
//             <div className="schedule-links">
//               <div>Schedule I is linked to the following schedules:</div>
//               <a>Schedule H, Contract Costs</a>
//               <a>Schedule K, T&amp;M</a>
//               <a>ICE MANUAL</a>
//             </div>
//             <div className="schedule-heading">
//               <div className="company">
//                 {companyName}
//                 <br />
//                 {companyAddress}
//               </div>
//               <div className="title">
//                 Schedule of Cumulative Direct and Indirect Costs Claimed and
//                 Billed
//                 <br />
//                 by Contract and Subcontract
//               </div>
//               <div className="fiscal">Fiscal Year End - 12/31/2025</div>
//             </div>
//             <div className="ice">
//               SCHEDULE I<br />
//               ICE (version 2.0.1h)
//             </div>
//           </div>

//           <div className="sched-i-toolbar">
//             <button
//               type="button"
//               className="sched-i-save-btn"
//               onClick={handleSave}
//               disabled={saving || loading}
//             >
//               {saving ? "Saving..." : "Save Schedule I"}
//             </button>
//           </div>

//           {error && <div className="sched-i-error">{error}</div>}

//           {loading ? (
//             <div className="sched-i-loading">Loading Schedule I...</div>
//           ) : (
//             <>
//               <CombinedTable
//                 flexRows={flexRows}
//                 tmRows={tmRows}
//                 billingRowsMap={billingRowsMap}
//                 flexTotals={flexTotals}
//                 tmTotals={tmTotals}
//                 billingTotals={billingTotals}
//                 combinedTotal={combinedTotal}
//                 combinedNet={combinedNet}
//                 onCellChange={handleContractCellChange}
//                 onBillingChange={handleBillingChange}
//                 onNavigate={onNavigate}
//               />
//               <Notes />
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

/* =========================================================
   Helpers
========================================================= */

const parseAmt = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") {
    return Number.isFinite(val) ? val : 0;
  }
  const str = String(val).replace(/,/g, "").replace(/[()]/g, "-").trim();
  if (str === "" || str === "-") return 0;
  const parsed = parseFloat(str);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatVal = (val) => {
  const num = Number(val) || 0;
  return num === 0 ? "-" : Math.round(num).toLocaleString();
};

const formatInputValue = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = Number(val);
  if (!Number.isFinite(num)) return "";
  return Math.round(num).toLocaleString();
};

const toApiDate = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const sanitizeNumericInput = (value) => {
  if (value === null || value === undefined) return "";
  let str = String(value).replace(/[^0-9,.\-()]/g, "");
  const openCount = (str.match(/\(/g) || []).length;
  const closeCount = (str.match(/\)/g) || []).length;

  if (openCount > 1) {
    let seen = false;
    str = str.replace(/\(/g, () => {
      if (seen) return "";
      seen = true;
      return "(";
    });
  }
  if (closeCount > 1) {
    let seen = false;
    str = str.replace(/\)/g, () => {
      if (seen) return "";
      seen = true;
      return ")";
    });
  }

  const minusStripped = str.replace(/-/g, "");
  const hadMinus = str.startsWith("-");
  str = (hadMinus ? "-" : "") + minusStripped;

  const parts = str.split(".");
  if (parts.length > 2) {
    str = parts[0] + "." + parts.slice(1).join("");
  }
  return str;
};

const keyMatch = (reportLvl) => (row) =>
  String(row.reportLvl).trim() === String(reportLvl).trim();

const recalcContractRows = (rows = []) => {
  const updatedRows = rows.map((row) => {
    const priorAmount = parseAmt(row.priorYearInput);
    const currentAmount = Number(row.currentYear) || 0;
    const cumulative = priorAmount + currentAmount;
    const limitation = parseAmt(row.limitationInput);
    const netCumulative = cumulative - limitation;
    return { ...row, cumulative, netCumulative };
  });

  const totals = updatedRows.reduce(
    (acc, row) => {
      acc.settled += parseAmt(row.pyr_Settled_Amt);
      acc.prior += parseAmt(row.priorYearInput);
      acc.current += Number(row.currentYear) || 0;
      acc.cum += row.cumulative;
      acc.net += row.netCumulative;
      return acc;
    },
    { settled: 0, prior: 0, current: 0, cum: 0, net: 0 },
  );

  return { rows: updatedRows, totals };
};

const computeBillingTotals = (billingRows, flexKeySet) => {
  let flexBilled = 0;
  let flexOverUnder = 0;
  let tmBilled = 0;
  let tmOverUnder = 0;

  // reportLvl is already treated as unique in the UI
  // because billingRowsMap also uses reportLvl as the key.
  const uniqueRows = new Map();

  billingRows.forEach((row) => {
    const key = String(row.reportLvl || "").trim();

    if (!key) return;

    // Keep the same row that the UI displays
    uniqueRows.set(key, row);
  });

  uniqueRows.forEach((row) => {
    const key = String(row.reportLvl).trim();

    const billed = parseAmt(row.billedAmt);
    const overUnder = parseAmt(row.overUnderBilling);

    if (flexKeySet.has(key)) {
      flexBilled += billed;
      flexOverUnder += overUnder;
    } else {
      tmBilled += billed;
      tmOverUnder += overUnder;
    }
  });

  return {
    flexBilled,
    flexOverUnder,
    tmBilled,
    tmOverUnder,
    totalBilled: flexBilled + tmBilled,
    totalOverUnder: flexOverUnder + tmOverUnder,
  };
};

/* =========================================================
   Table Colgroup & Header with Frozen Columns
========================================================= */

const TableColgroup = () => (
  <colgroup>
    <col style={{ width: "130px", minWidth: "130px" }} />
    <col style={{ width: "130px", minWidth: "130px" }} />
    <col style={{ width: "110px", minWidth: "110px" }} />
    <col style={{ width: "90px", minWidth: "90px" }} />
    <col style={{ width: "110px", minWidth: "110px" }} />
    <col style={{ width: "110px", minWidth: "110px" }} />
    <col style={{ width: "110px", minWidth: "110px" }} />
    <col style={{ width: "125px", minWidth: "125px" }} />
    <col style={{ width: "125px", minWidth: "125px" }} />
    <col style={{ width: "125px", minWidth: "125px" }} />
    <col style={{ width: "100px", minWidth: "100px" }} />
    <col style={{ width: "115px", minWidth: "115px" }} />
    <col style={{ width: "110px", minWidth: "110px" }} />
    <col style={{ width: "110px", minWidth: "110px" }} />
    <col style={{ width: "85px", minWidth: "85px" }} />
    <col style={{ width: "80px", minWidth: "80px" }} />
  </colgroup>
);

const TableHeader = () => (
  <thead className="sched-i-thead">
    <tr className="top-header">
      <th colSpan="3" className="freeze-header-group"></th>
      <th colSpan="2"></th>
      <th colSpan="2">
        Unsettled/Claimed Direct
        <br />
        And Indirect Costs Using
      </th>
      <th>
        Total
        <br />
        Cumulative
        <br />
        Settled or Claimed
      </th>
      <th>
        Less
        <br />
        Contract
        <br />
        Limitations
        <br />
        Rebates/Credits
      </th>
      <th>
        Net
        <br />
        Cumulative
        <br />
        Settled or Claimed
      </th>
      <th colSpan="3">Cumulative Cost Billed (Manual Entry)</th>
      <th rowSpan="2">
        Over
        <br />
        (Under)
        <br />
        Billing
      </th>
      <th rowSpan="2">
        Physically
        <br />
        Complete
        <br />
        (Note 7)
      </th>
      <th rowSpan="2">Note</th>
    </tr>
    <tr className="column-header">
      <th className="freeze-col-1">Contract No.</th>
      <th className="freeze-col-2">Subcontract No.</th>
      <th className="freeze-col-3">
        Order
        <br />
        No.
      </th>
      <th>
        Subject
        <br />
        To
        <br />
        Penalty
        <br />
        Clause
        <br />
        Note (2)
      </th>
      <th>
        Prior
        <br />
        Years
        <br />
        Settled
        <br />
        Total
        <br />
        Costs
        <br />
        Note (3)
      </th>
      <th>
        Prior Year
        <br />
        Costs
        <br />
        FYE
        <br />
        Note (4)
      </th>
      <th>
        Current Year
        <br />
        Costs
        <br />
        FYE
        <br />
        Note (4)
      </th>
      <th>
        Total
        <br />
        Cumulative
        <br />
        Settled or
        <br />
        Claimed
      </th>
      <th>
        Contract
        <br />
        Limitations
        <br />
        Rebates/Credits
        <br />
        Note (5)
      </th>
      <th>
        Net
        <br />
        Cumulative
        <br />
        Settled or
        <br />
        Claimed
        <br />
        Note (6)
      </th>
      <th>PV No.</th>
      <th>
        Date Cost Billed
        <br />
        Through
      </th>
      <th>Amount</th>
    </tr>
  </thead>
);

/* =========================================================
   Combined Contract + Billing Table
========================================================= */

const CombinedTable = ({
  flexRows,
  tmRows,
  billingRowsMap,
  flexTotals,
  tmTotals,
  billingTotals,
  combinedTotal,
  combinedNet,
  onCellChange,
  onBillingChange,
  onNavigate,
}) => {
  const renderRow = (row, index) => {
    const key = String(row.reportLvl).trim();
    const billingRow = billingRowsMap.get(key) || {};

    return (
      <tr key={`${row.id || row.reportLvl}-${index}`}>
        {/* Frozen Column 1: Contract */}
        <td className="yellow left freeze-col-1">{row.contract || ""}</td>

        {/* Frozen Column 2: Subcontract */}
        <td className="yellow left freeze-col-2">{row.sub || ""}</td>

        {/* Frozen Column 3: Order No */}
        <td className="yellow freeze-col-3">{row.order || ""}</td>

        {/* Note (2): Penalty Clause */}
        <td className="editable-cell">
          <input
            className="sched-i-input center"
            autoComplete="off"
            value={row.penalty_Clause ?? ""}
            onChange={(e) =>
              onCellChange(
                row.id,
                row.reportLvl,
                "penalty_Clause",
                e.target.value,
              )
            }
          />
        </td>

        {/* Note (3): Prior Years Settled Total Costs */}
        <td className="editable-cell">
          <input
            className="sched-i-input center"
            autoComplete="off"
            inputMode="decimal"
            value={row.pyr_Settled_Amt ?? ""}
            onChange={(e) =>
              onCellChange(
                row.id,
                row.reportLvl,
                "pyr_Settled_Amt",
                sanitizeNumericInput(e.target.value),
              )
            }
          />
        </td>

        {/* Prior Year Cost */}
        <td className="editable-cell">
          <input
            className="sched-i-input num"
            inputMode="decimal"
            autoComplete="off"
            value={row.priorYearInput ?? ""}
            onChange={(e) =>
              onCellChange(
                row.id,
                row.reportLvl,
                "priorYearInput",
                sanitizeNumericInput(e.target.value),
              )
            }
          />
        </td>

        {/* Current Year Cost */}
        <td className="num yellow">{formatVal(row.currentYear)}</td>

        {/* Total Cumulative */}
        <td className="num cyan">{formatVal(row.cumulative)}</td>

        {/* Limitation */}
        <td className="editable-cell">
          <input
            className="sched-i-input num"
            inputMode="decimal"
            autoComplete="off"
            value={row.limitationInput ?? ""}
            onChange={(e) =>
              onCellChange(
                row.id,
                row.reportLvl,
                "limitationInput",
                sanitizeNumericInput(e.target.value),
              )
            }
          />
        </td>

        {/* Net Cumulative */}
        <td className="num cyan">{formatVal(row.netCumulative)}</td>

        {/* PV No */}
        <td className="editable-cell">
          <input
            className="sched-i-input left"
            autoComplete="off"
            value={billingRow.pvNo ?? ""}
            onChange={(e) =>
              onBillingChange(
                billingRow.id || row.id,
                row.reportLvl,
                "pvNo",
                e.target.value,
              )
            }
          />
        </td>

        {/* Billing Date */}
        <td className="editable-cell">
          <input
            type="date"
            className="sched-i-input"
            value={billingRow.billedDtInput ?? ""}
            onChange={(e) =>
              onBillingChange(
                billingRow.id || row.id,
                row.reportLvl,
                "billedDtInput",
                e.target.value,
              )
            }
          />
        </td>

        {/* Billing Amount */}
        <td className="editable-cell">
          <input
            className="sched-i-input num"
            inputMode="decimal"
            autoComplete="off"
            value={billingRow.billedAmtInput ?? ""}
            onChange={(e) =>
              onBillingChange(
                billingRow.id || row.id,
                row.reportLvl,
                "billedAmtInput",
                sanitizeNumericInput(e.target.value),
              )
            }
          />
        </td>

        {/* Over / Under Billing */}
        <td className="num cyan">{formatVal(billingRow.overUnderBilling)}</td>

        {/* Physically Complete */}
        <td className="editable-cell center">
          <input
            type="checkbox"
            checked={Boolean(billingRow.completeFl)}
            onChange={(e) =>
              onBillingChange(
                billingRow.id || row.id,
                row.reportLvl,
                "completeFl",
                e.target.checked,
              )
            }
          />
        </td>

        {/* Last Note */}
        <td className="editable-cell">
          <input
            className="sched-i-input left"
            autoComplete="off"
            value={row.note ?? ""}
            onChange={(e) =>
              onCellChange(row.id, row.reportLvl, "note", e.target.value)
            }
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="sched-i-tables-container">
      {/* =========================================================
          1. COST TYPE & FLEXIBLY PRICED SECTION
      ========================================================= */}
      <div className="sched-i-section-block">
        <div className="sched-i-section-header">
          <button
            type="button"
            className="blue-label"
            onClick={() => onNavigate("sched_h")}
          >
            SCHED H
          </button>
          Cost Type &amp; Flexibly Priced:
        </div>
        <div className="sched-i-table-container custom-scrollbar">
          <table className="sched-i-combined-table">
            <TableColgroup />
            <TableHeader />
            <tbody>
              {flexRows.map(renderRow)}
              {/* SCHED H Subtotal */}
              <tr className="subtotal">
                <td
                  colSpan="3"
                  className="freeze-header-group"
                  style={{ textAlign: "left", paddingLeft: "8px" }}
                >
                  Subtotal-Cost &amp; Flexibly Priced Contracts
                </td>
                <td colSpan="4"></td>
                <td className="num cyan">{formatVal(flexTotals.cum)}</td>
                <td></td>
                <td className="num cyan">{formatVal(flexTotals.net)}</td>
                <td colSpan="2"></td>
                <td className="num cyan">
                  {formatVal(billingTotals.flexBilled)}
                </td>
                <td className="num cyan">
                  {formatVal(billingTotals.flexOverUnder)}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          2. TIME & MATERIAL SECTION
      ========================================================= */}
      <div className="sched-i-section-block">
        <div className="sched-i-section-header">
          <button
            type="button"
            className="blue-label"
            onClick={() => onNavigate("sched_k")}
          >
            SCHED K
          </button>
          Time &amp; Material
        </div>
        <div className="sched-i-table-container custom-scrollbar">
          <table className="sched-i-combined-table">
            <TableColgroup />
            <TableHeader />
            <tbody>
              {tmRows.map(renderRow)}
              {/* SCHED K Subtotal */}
              <tr className="subtotal">
                <td
                  colSpan="3"
                  className="freeze-header-group"
                  style={{ textAlign: "left", paddingLeft: "8px" }}
                >
                  Subtotal-Time &amp; Material Contracts
                </td>
                <td colSpan="4"></td>
                <td className="num cyan">{formatVal(tmTotals.cum)}</td>
                <td></td>
                <td className="num cyan">{formatVal(tmTotals.net)}</td>
                <td colSpan="2"></td>
                <td className="num cyan">
                  {formatVal(billingTotals.tmBilled)}
                </td>
                <td className="num cyan">
                  {formatVal(billingTotals.tmOverUnder)}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          3. GRAND TOTAL / COMBINED SECTION
      ========================================================= */}
      <div className="sched-i-section-block">
        <div className="sched-i-section-header total-heading">
          Total- Cost/Flexibly Priced and Time &amp; Material Contracts
        </div>
        <div className="sched-i-table-container sched-i-grand-total-table-container custom-scrollbar">
          <table className="sched-i-combined-table">
            <TableColgroup />
            <tbody>
              <tr className="subtotal billing-total grand">
                <td
                  colSpan="3"
                  className="freeze-header-group"
                  style={{ textAlign: "left", paddingLeft: "8px" }}
                >
                  Grand Total
                </td>
                <td colSpan="4"></td>
                <td className="num cyan">{formatVal(combinedTotal)}</td>
                <td></td>
                <td className="num cyan">{formatVal(combinedNet)}</td>
                <td colSpan="2"></td>
                <td className="num cyan">
                  {formatVal(billingTotals.totalBilled)}
                </td>
                <td className="num cyan">
                  {formatVal(billingTotals.totalOverUnder)}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Notes
========================================================= */

const Notes = ({ explanatoryNote, setExplanatoryNote }) => (
  <div className="notes">
    <div className="mt-8 border p-4 bg-gray-50 rounded">
      <label className="block font-bold underline mb-2 text-sm">
        Explanatory Notes:
      </label>
      <textarea
        value={explanatoryNote}
        onChange={(e) => setExplanatoryNote(e.target.value)}
        rows={4}
        className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        placeholder="Type explanatory notes here..."
      />
    </div>
    <div className="legend linked">
      <span>Linked to Other Worksheet</span>
      <b>Current Year Contract Costs, Schedule H and K</b>
    </div>
    <div className="legend formula">
      <span>Cell Contains a Formula</span>
      <b>
        Formulas calculate Total and Net Cumulative Claimed and or Settled
        Amounts
      </b>
    </div>
    <div className="legend links">
      <span>Cell Contains a Formula With Links</span>
      <b>None</b>
    </div>
  </div>
);

/* =========================================================
   Main Component
========================================================= */

export default function SchedI1({
  companyName,
  companyAddress,
  onNavigate,
  explanatoryNote: propExplanatoryNote,
  setExplanatoryNote: propSetExplanatoryNote,
}) {
  const [localExplanatoryNote, setLocalExplanatoryNote] = useState("");
  const explanatoryNote =
    propExplanatoryNote !== undefined
      ? propExplanatoryNote
      : localExplanatoryNote;
  const setExplanatoryNote = propSetExplanatoryNote || setLocalExplanatoryNote;
  const [flexRows, setFlexRows] = useState([]);
  const [tmRows, setTmRows] = useState([]);
  const [billingRows, setBillingRows] = useState([]);

  const [flexTotals, setFlexTotals] = useState({
    settled: 0,
    prior: 0,
    current: 0,
    cum: 0,
    net: 0,
  });

  const [tmTotals, setTmTotals] = useState({
    settled: 0,
    prior: 0,
    current: 0,
    cum: 0,
    net: 0,
  });

  const [billingTotals, setBillingTotals] = useState({
    flexBilled: 0,
    flexOverUnder: 0,
    tmBilled: 0,
    tmOverUnder: 0,
    totalBilled: 0,
    totalOverUnder: 0,
  });

  const [scheduleIData, setScheduleIData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const FY_YEAR = 2025;

  /* =========================================================
     Build UI rows
  ========================================================= */

  const buildRows = (ledgerData, schedKData, scheduleIData, ratesData) => {
    let rates = {
      fringe: 0,
      aeroFringe: 0,
      custOH: 0,
      colOH: 0,
      smh: 0,
      ga: 0,
    };
    if (ratesData && ratesData.schedules) {
      ratesData.schedules.forEach((schedule) => {
        let rawRate = parseFloat(schedule.rate) || 0;
        let percentForm = rawRate > 1 ? rawRate : rawRate * 100;
        percentForm = Math.round(percentForm * 100) / 100;
        const r = percentForm / 100;

        if (schedule.name.includes("Fringe Pool") || schedule.name === "Fringe")
          rates.fringe = r;
        else if (schedule.name.includes("AERO Fringe")) rates.aeroFringe = r;
        else if (schedule.name.includes("Customer Site Overhead"))
          rates.custOH = r;
        else if (schedule.name.includes("Off - Site Overhead")) rates.colOH = r;
        else if (schedule.name.includes("Subk & Material Handling"))
          rates.smh = r;
        else if (schedule.name.includes("General and Administrative"))
          rates.ga = r;
      });
    }

    const scheduleIDict = {};
    scheduleIData.forEach((item) => {
      if (!item.reportLvl) return;
      scheduleIDict[String(item.reportLvl).trim()] = item;
    });

    const flexGroup = {};
    const lookupDict = {};

    ledgerData.forEach((row) => {
      const key = row.reportLvl || row.projId;
      if (!key) return;

      if (!lookupDict[key])
        lookupDict[key] = {
          contract: row.primeCntrId || "",
          sub: row.subctrId || "",
        };

      if (Number(row.year) === 2025) {
        const pt = (row.projType || "").toUpperCase();
        let cat = "Flexibly Priced";
        if (pt.includes("CPFF") || pt.includes("CPAF")) cat = "Cost-Type";
        else if (pt === "T&M" || pt.includes("T&M")) cat = "T&M";
        else if (pt.includes("FIXED") || pt === "FFP") cat = "Fixed Price";
        else if (pt.includes("COMMERCIAL")) cat = "Commercial";
        else if (pt.includes("IR&D") || pt.includes("B&P")) cat = "IR&D&BP";

        if (cat === "Cost-Type" || cat === "Flexibly Priced") {
          if (!flexGroup[key]) {
            flexGroup[key] = {
              contract: row.primeCntrId || "",
              sub: row.subctrId || "",
              order: key,
              cat: cat,
              laborOnsite: 0,
              laborOffsite: 0,
              laborAero: 0,
              travel: 0,
              material: 0,
              odc: 0,
              subcontracts: 0,
              unburden: 0,
            };
          }

          const amount = parseFloat(row.amount) || 0;
          if (
            row.acctId === "50-00-01" ||
            row.acctId === "50-00-98" ||
            row.acctId === "59-00-01"
          ) {
            if (row.orgId === "1.1.01" || row.acctId === "59-00-01")
              flexGroup[key].laborAero += amount;
            else flexGroup[key].laborOnsite += amount;
          } else if (row.acctId === "50-00-02") {
            flexGroup[key].laborOffsite += amount;
          } else if (
            row.acctId &&
            (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
          ) {
            flexGroup[key].travel += amount;
          } else if (
            ["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)
          ) {
            flexGroup[key].material += amount;
          } else if (
            ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(
              row.acctId,
            )
          ) {
            flexGroup[key].odc += amount;
          } else if (
            [
              "50-21-01",
              "50-21-02",
              "50-21-03",
              "50-21-04",
              "50-22-01",
            ].includes(row.acctId)
          ) {
            flexGroup[key].subcontracts += amount;
          } else if (
            ["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)
          ) {
            flexGroup[key].unburden += amount;
          }
        }
      }
    });

    /* =====================================================
       FLEX ROWS
    ===================================================== */
    let totalFlexSettled = 0;
    let totalFlexPrior = 0;
    let totalFlexCurrent = 0;
    let totalFlexCum = 0;
    let totalFlexNet = 0;

    const generatedFlexRows = Object.values(flexGroup).map((rawItem) => {
      const reportLvl = String(rawItem.order).trim();
      const saved = scheduleIDict[reportLvl] || null;

      const item = {
        laborOnsite: Math.round(rawItem.laborOnsite),
        laborOffsite: Math.round(rawItem.laborOffsite),
        laborAero: Math.round(rawItem.laborAero),
        travel: Math.round(rawItem.travel),
        material: Math.round(rawItem.material),
        odc: Math.round(rawItem.odc),
        subcontracts: Math.round(rawItem.subcontracts),
        unburden: Math.round(rawItem.unburden),
      };

      const totalLabor = item.laborOnsite + item.laborOffsite + item.laborAero;
      const totalDirectCosts =
        totalLabor +
        item.travel +
        item.material +
        item.odc +
        item.subcontracts +
        item.unburden;

      const fringeOnsite = Math.round(item.laborOnsite * rates.fringe);
      const fringeOffsite = Math.round(item.laborOffsite * rates.fringe);
      const fringeAero = Math.round(item.laborAero * rates.aeroFringe);

      const ohOnsiteBase =
        item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;
      const ohOffsiteBase = item.laborOffsite + fringeOffsite;
      const smhBase = item.material + item.subcontracts;

      const ohOnsite = Math.round(ohOnsiteBase * rates.custOH);
      const ohOffsite = Math.round(ohOffsiteBase * rates.colOH);
      const ohSMH = Math.round(smhBase * rates.smh);

      const totalIndirectCosts =
        fringeOnsite +
        fringeOffsite +
        fringeAero +
        ohOnsite +
        ohOffsite +
        ohSMH;

      const directPlusOH = totalDirectCosts + totalIndirectCosts;
      const gaBase =
        directPlusOH -
        (item.material + item.subcontracts + item.unburden + ohSMH);
      const gaApplied = Math.round(gaBase * rates.ga);

      const grandTotal = directPlusOH + gaApplied;
      const currentYearCost = grandTotal;

      const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
      const pyrSettledAmt =
        saved?.pyrSettledAmt != null
          ? Number(saved.pyrSettledAmt)
          : saved?.pyr_Settled_Amt != null
            ? Number(saved.pyr_Settled_Amt)
            : 0;

      const cumulative = priorYear + currentYearCost;
      const netCumulative =
        saved?.netCum != null ? Number(saved.netCum) : cumulative;
      const limitation = cumulative - netCumulative;

      totalFlexSettled += pyrSettledAmt;
      totalFlexPrior += priorYear;
      totalFlexCurrent += currentYearCost;
      totalFlexCum += cumulative;
      totalFlexNet += netCumulative;

      return {
        id: saved?.id || 0,
        year: saved?.year || FY_YEAR,
        schedCd: saved?.schedCd || "I",
        contract: rawItem.contract || saved?.primeCntrId || "",
        sub: rawItem.sub || saved?.subctrId || "",
        reportLvl,
        order: reportLvl,
        penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
        pyr_Settled_Amt:
          pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
        priorYearInput:
          saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
        currentYear: currentYearCost,
        cumulative,
        limitationInput:
          saved?.netCum != null ? formatInputValue(limitation) : "",
        netCumulative,
        pvNo: saved?.pvNo || "",
        billedDt: saved?.billedDt || null,
        billedAmt: saved?.billedAmt || 0,
        completeFl: saved?.completeFl ?? false,
        note: saved?.note ?? saved?.Note ?? "",
        isEdited: false,
      };
    });

    /* =====================================================
       TM ROWS
    ===================================================== */
    const tmGroup = {};
    schedKData.forEach((row) => {
      const key = row.invcProjId;
      if (!key) return;
      if (!tmGroup[key]) {
        const lookup = lookupDict[key] || { contract: "", sub: "" };
        tmGroup[key] = {
          contract: lookup.contract,
          sub: lookup.sub || row.taskId || "",
          order: key,
          amount: 0,
        };
      }
      tmGroup[key].amount += parseFloat(row.amount) || 0;
    });

    let totalTmSettled = 0;
    let totalTmPrior = 0;
    let totalTmCurrent = 0;
    let totalTmCum = 0;
    let totalTmNet = 0;

    const generatedTmRows = Object.values(tmGroup).map((item) => {
      const reportLvl = String(item.order).trim();
      const saved = scheduleIDict[reportLvl] || null;
      const currentYearCost = Number(item.amount) || 0;
      const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;
      const pyrSettledAmt =
        saved?.pyrSettledAmt != null
          ? Number(saved.pyrSettledAmt)
          : saved?.pyr_Settled_Amt != null
            ? Number(saved.pyr_Settled_Amt)
            : 0;
      const cumulative = priorYear + currentYearCost;
      const netCumulative =
        saved?.netCum != null ? Number(saved.netCum) : cumulative;
      const limitation = cumulative - netCumulative;

      totalTmSettled += pyrSettledAmt;
      totalTmPrior += priorYear;
      totalTmCurrent += currentYearCost;
      totalTmCum += cumulative;
      totalTmNet += netCumulative;

      return {
        id: saved?.id || 0,
        year: saved?.year || FY_YEAR,
        schedCd: saved?.schedCd || "I",
        contract: item.contract || saved?.primeCntrId || "",
        sub: item.sub || saved?.subctrId || "",
        reportLvl,
        order: reportLvl,
        penalty_Clause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
        pyr_Settled_Amt:
          pyrSettledAmt !== 0 ? formatInputValue(pyrSettledAmt) : "",
        priorYearInput:
          saved?.pyCost != null ? formatInputValue(saved.pyCost) : "",
        currentYear: currentYearCost,
        cumulative,
        limitationInput:
          saved?.netCum != null ? formatInputValue(limitation) : "",
        netCumulative,
        pvNo: saved?.pvNo || "",
        billedDt: saved?.billedDt || null,
        billedAmt: saved?.billedAmt || 0,
        completeFl: saved?.completeFl ?? false,
        note: saved?.note ?? saved?.Note ?? "",
        isEdited: false,
      };
    });

    /* =====================================================
       BILLING DATA
    ===================================================== */
    const billingData = scheduleIData
      .filter(
        (item) =>
          item.pvNo ||
          item.billedDt ||
          (item.billedAmt !== null && item.billedAmt !== undefined),
      )
      .map((item) => {
        const billedAmount = Number(item.billedAmt) || 0;
        const flexMatch = generatedFlexRows.find(
          (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
        );
        const tmMatch = generatedTmRows.find(
          (x) => String(x.reportLvl).trim() === String(item.reportLvl).trim(),
        );
        const cost = flexMatch?.netCumulative ?? tmMatch?.netCumulative ?? 0;
        const overUnder = billedAmount - cost;

        return {
          id: item.id || 0,
          year: item.year || FY_YEAR,
          schedCd: item.schedCd || "I",
          primeCntrId: item.primeCntrId || "",
          subctrId: item.subctrId || "",
          reportLvl: item.reportLvl || "",
          pvNo: item.pvNo || "",
          billedDt: item.billedDt || null,
          billedDtInput: item.billedDt
            ? new Date(item.billedDt).toISOString().split("T")[0]
            : "",
          billedAmt: billedAmount,
          billedAmtInput:
            item.billedAmt != null ? formatInputValue(item.billedAmt) : "",
          completeFl: item.completeFl ?? false,
          overUnderBilling: overUnder,
          isEdited: false,
        };
      });

    const existingBillingKeys = new Set(
      billingData.map((x) => String(x.reportLvl).trim()),
    );

    [...generatedFlexRows, ...generatedTmRows].forEach((row) => {
      const key = String(row.reportLvl).trim();
      if (!key) return;
      if (!existingBillingKeys.has(key)) {
        billingData.push({
          id: row.id || 0,
          year: FY_YEAR,
          schedCd: "I",
          primeCntrId: row.contract || "",
          subctrId: row.sub || "",
          reportLvl: key,
          pvNo: row.pvNo || "",
          billedDt: null,
          billedDtInput: "",
          billedAmt: 0,
          billedAmtInput: "",
          completeFl: row.completeFl || false,
          overUnderBilling: 0,
          isEdited: false,
        });
      }
    });

    const flexBillingKeys = new Set(
      generatedFlexRows.map((x) => String(x.reportLvl).trim()),
    );
    setFlexRows(generatedFlexRows);
    setTmRows(generatedTmRows);
    setFlexTotals({
      settled: totalFlexSettled,
      prior: totalFlexPrior,
      current: totalFlexCurrent,
      cum: totalFlexCum,
      net: totalFlexNet,
    });
    setTmTotals({
      settled: totalTmSettled,
      prior: totalTmPrior,
      current: totalTmCurrent,
      cum: totalTmCum,
      net: totalTmNet,
    });
    setBillingRows(billingData);
    setBillingTotals(computeBillingTotals(billingData, flexBillingKeys));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [ledgerRes, schedKRes, scheduleIRes, ratesRes] =
          await Promise.all([
            fetch(`${backendUrl}/api/JobCostLedger`),
            fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
            fetch(
              `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
            ),
            fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
          ]);

        if (!ledgerRes.ok) throw new Error("Failed to load Job Cost Ledger.");
        if (!schedKRes.ok) throw new Error("Failed to load Schedule K.");
        if (!scheduleIRes.ok) throw new Error("Failed to load Schedule I.");

        const ledgerData = await ledgerRes.json();
        const schedKData = await schedKRes.json();
        const scheduleIData = await scheduleIRes.json();
        const ratesData = await ratesRes.json();

        const normalizedScheduleIData = Array.isArray(scheduleIData)
          ? scheduleIData
          : [];
        setScheduleIData(normalizedScheduleIData);

        buildRows(
          Array.isArray(ledgerData) ? ledgerData : [],
          Array.isArray(schedKData) ? schedKData : [],
          normalizedScheduleIData,
          ratesData,
        );
      } catch (err) {
        console.error("Failed to load Schedule I data:", err);
        setError(err?.message || "Failed to load Schedule I data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    setBillingRows((prevBilling) => {
      if (prevBilling.length === 0) return prevBilling;
      const flexMap = new Map(
        flexRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
      );
      const tmMap = new Map(
        tmRows.map((r) => [String(r.reportLvl).trim(), r.netCumulative]),
      );
      let changed = false;

      const updated = prevBilling.map((row) => {
        const key = String(row.reportLvl).trim();
        const cumulative = flexMap.has(key)
          ? flexMap.get(key)
          : tmMap.has(key)
            ? tmMap.get(key)
            : 0;
        const billed = Number(row.billedAmt) || 0;
        const overUnder = billed - cumulative;
        if (overUnder !== row.overUnderBilling) {
          changed = true;
          return { ...row, overUnderBilling: overUnder };
        }
        return row;
      });

      if (!changed) return prevBilling;
      const flexKeySet = new Set(
        flexRows.map((r) => String(r.reportLvl).trim()),
      );
      setBillingTotals(computeBillingTotals(updated, flexKeySet));
      return updated;
    });
  }, [flexRows, tmRows, loading]);

  const handleContractCellChange = (id, reportLvl, field, value) => {
    const matches = keyMatch(reportLvl);
    setFlexRows((prevFlex) => {
      if (!prevFlex.some(matches)) return prevFlex;
      const withEdit = prevFlex.map((row) =>
        matches(row) ? { ...row, [field]: value, isEdited: true } : row,
      );
      const { rows: recalculated, totals } = recalcContractRows(withEdit);
      setFlexTotals(totals);
      return recalculated;
    });

    setTmRows((prevTm) => {
      if (!prevTm.some(matches)) return prevTm;
      const withEdit = prevTm.map((row) =>
        matches(row) ? { ...row, [field]: value, isEdited: true } : row,
      );
      const { rows: recalculated, totals } = recalcContractRows(withEdit);
      setTmTotals(totals);
      return recalculated;
    });
  };

  const handleBillingChange = (id, reportLvl, field, value) => {
    const matches = keyMatch(reportLvl);
    setBillingRows((prev) => {
      const updated = prev.map((row) => {
        if (!matches(row)) return row;
        const updatedRow = { ...row, [field]: value, isEdited: true };

        if (field === "billedAmtInput") {
          const billed = parseAmt(value);
          updatedRow.billedAmt = billed;
          const flexRow = flexRows.find(matches);
          const tmRow = tmRows.find(matches);
          const netCumulative =
            flexRow?.netCumulative ?? tmRow?.netCumulative ?? 0;
          updatedRow.overUnderBilling = billed - netCumulative;
        }

        if (field === "billedDtInput") updatedRow.billedDt = toApiDate(value);
        if (field === "pvNo") updatedRow.pvNo = value;
        if (field === "completeFl") updatedRow.completeFl = Boolean(value);
        return updatedRow;
      });

      const flexKeySet = new Set(
        flexRows.map((x) => String(x.reportLvl).trim()),
      );
      setBillingTotals(computeBillingTotals(updated, flexKeySet));
      return updated;
    });
  };

  const buildUpsertPayload = () => {
    const payloadMap = new Map();

    [...flexRows, ...tmRows].forEach((row) => {
      const key = String(row.reportLvl).trim();
      if (!key || !row.isEdited) return;

      const priorYear = parseAmt(row.priorYearInput);
      const limitation = parseAmt(row.limitationInput);
      const cumulative = priorYear + (Number(row.currentYear) || 0);
      const netCum = cumulative - limitation;

      const billingRow = billingRows.find(
        (b) =>
          String(b.reportLvl || "").trim() === key &&
          String(b.schedCd || "")
            .trim()
            .toUpperCase() ===
            String(row.schedCd || "")
              .trim()
              .toUpperCase(),
      );

      payloadMap.set(key, {
        id: billingRow?.id || row.id || 0,
        year: row.year || FY_YEAR,
        schedCd: row.schedCd || "I",
        primeCntrId: row.contract || null,
        subctrId: row.sub || null,
        reportLvl: key,
        penalty_Clause: row.penalty_Clause || null,
        pyr_Settled_Amt: parseAmt(row.pyr_Settled_Amt),
        pyCost: priorYear,
        netCum,
        pvNo: billingRow?.pvNo || row.pvNo || null,
        billedDt: billingRow?.billedDt || row.billedDt || null,
        billedAmt: Number(billingRow?.billedAmt) || Number(row.billedAmt) || 0,
        completeFl: billingRow?.completeFl ?? row.completeFl ?? false,
        note: row.note || null,
      });
    });

    billingRows.forEach((row) => {
      const key = String(row.reportLvl).trim();
      if (!key || !row.isEdited) return;

      const existing = payloadMap.get(key);
      const resolvedBilledDt =
        row.billedDt ||
        (row.billedDtInput ? toApiDate(row.billedDtInput) : null);
      const resolvedBilledAmt = parseAmt(row.billedAmtInput);

      if (existing) {
        existing.pvNo = row.pvNo || null;
        existing.billedDt = resolvedBilledDt;
        existing.billedAmt = resolvedBilledAmt;
        existing.completeFl = Boolean(row.completeFl);
        payloadMap.set(key, existing);
      } else {
        const matches = keyMatch(key);
        const flexRow = flexRows.find(matches);
        const tmRow = tmRows.find(matches);
        const matchedRow = flexRow || tmRow;

        const pyCost = matchedRow ? parseAmt(matchedRow.priorYearInput) : 0;
        const cumulative = matchedRow
          ? pyCost + (Number(matchedRow.currentYear) || 0)
          : 0;
        const limitation = matchedRow
          ? parseAmt(matchedRow.limitationInput)
          : 0;
        const netCum = matchedRow ? cumulative - limitation : 0;

        payloadMap.set(key, {
          id: row.id || matchedRow?.id || 0,
          year: row.year || FY_YEAR,
          schedCd: row.schedCd || "I",
          primeCntrId: matchedRow?.contract || row.primeCntrId || null,
          subctrId: matchedRow?.sub || row.subctrId || null,
          reportLvl: key,
          Penalty_Clause: matchedRow?.penalty_Clause || null,
          Pyr_Settled_Amt: parseAmt(matchedRow?.pyr_Settled_Amt),
          pyCost,
          netCum,
          pvNo: row.pvNo || null,
          billedDt: resolvedBilledDt,
          billedAmt: resolvedBilledAmt,
          completeFl: Boolean(row.completeFl),
          Note: matchedRow?.note || null,
        });
      }
    });

    return Array.from(payloadMap.values());
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const payload = buildUpsertPayload();

      if (!payload.length) {
        alert("There is no Schedule I data to save.");
        return;
      }

      const filteredPayload = payload.filter(
        (p) =>
          !(
            p.billedAmt === 0 &&
            p.pvNo == null &&
            p.pyCost === 0 &&
            !p.Penalty_Clause &&
            !p.Note &&
            p.Pyr_Settled_Amt === 0
          ),
      );
      const hasMissingPvNo = filteredPayload.some(
        (row) => !row.pvNo || row.pvNo.trim() === "",
      );

      if (hasMissingPvNo) {
        alert("Please enter the PV No. for the edited row.");
        return;
      }

      const response = await fetch(
        `${backendUrl}/api/TrialBalance/ScheduleIUpsert`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filteredPayload),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result?.message || "Failed to save Schedule I.");

      alert(result?.message || "Schedule I saved successfully.");

      const [ledgerRes, schedKRes, scheduleIRes, ratesRes] = await Promise.all([
        fetch(`${backendUrl}/api/JobCostLedger`),
        fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
        fetch(
          `${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${FY_YEAR}`,
        ),
        fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
      ]);

      if (!ledgerRes.ok) throw new Error("Failed to reload Job Cost Ledger.");
      if (!schedKRes.ok) throw new Error("Failed to reload Schedule K.");
      if (!scheduleIRes.ok) throw new Error("Failed to reload Schedule I.");

      const ledgerData = await ledgerRes.json();
      const schedKData = await schedKRes.json();
      const scheduleIData = await scheduleIRes.json();
      const ratesData = await ratesRes.json();

      const normalizedScheduleIData = Array.isArray(scheduleIData)
        ? scheduleIData
        : [];
      setScheduleIData(normalizedScheduleIData);
      buildRows(
        Array.isArray(ledgerData) ? ledgerData : [],
        Array.isArray(schedKData) ? schedKData : [],
        normalizedScheduleIData,
        ratesData,
      );
    } catch (err) {
      console.error("Schedule I save failed:", err);
      setError(err?.message || "Failed to save Schedule I.");
      alert(err?.message || "Failed to save Schedule I.");
    } finally {
      setSaving(false);
    }
  };

  const combinedTotal = flexTotals.cum + tmTotals.cum;
  const combinedNet = flexTotals.net + tmTotals.net;
  const billingRowsMap = new Map(
    billingRows.map((row) => [String(row.reportLvl).trim(), row]),
  );

  return (
    <>
      <style>{`
        .sched-i-page { width: 100%; height: auto; min-height: 100%; overflow-y: visible; overflow-x: auto; background: #f4f4f4; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 13px; padding: 18px 18px 35px; box-sizing: border-box; }
        .custom-scrollbar::-webkit-scrollbar,
        .sched-i-table-container::-webkit-scrollbar { height: 10px; width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track,
        .sched-i-table-container::-webkit-scrollbar-track { background: #f8fafc; border: 1px solid #e2e8f0; }
        .custom-scrollbar::-webkit-scrollbar-thumb,
        .sched-i-table-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover,
        .sched-i-table-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .sched-i-inner { width: fit-content; max-width: 100%; margin: 0 auto; }
        .sched-i-header { position: relative; min-height: 176px; }
        .schedule-links { position: absolute; left: 0; top: 0; width: 290px; line-height: 1.25; }
        .schedule-links a { display: block; color: #0000ee; text-decoration: underline; margin-top: 3px; cursor: pointer; }
        .schedule-heading { width: 825px; margin: 0 auto; text-align: center; font-weight: 700; }
        .company { background: #fff200; font-size: 17px; line-height: 1.15; padding: 3px; }
        .title { font-size: 17px; line-height: 1.25; padding: 4px 0; }
        .fiscal { background: #fff200; font-size: 17px; padding: 4px; }
        .ice { position: absolute; right: 14px; top: 3px; font-weight: 700; font-size: 16px; line-height: 1.2; }
        .blue-label { display: inline-block; color: #fff; background: #0000ee; padding: 2px 8px; margin-right: 4px; border: none; cursor: pointer; font-size: 12px; font-weight: bold; }
        .blue-label:hover { background: #0000c8; }
        
        .sched-i-tables-container { display: flex; flex-direction: column; gap: 18px; margin-top: 10px; }
        .sched-i-section-block { display: flex; flex-direction: column; }
        .sched-i-section-header { font-weight: 700; background: #f9f9f9; border: 1px solid #222; border-bottom: none; padding: 5px 8px; font-size: 13px; display: flex; align-items: center; width: max-content; min-width: 100%; box-sizing: border-box; }
        
        .sched-i-table-container { max-height: 380px; overflow-y: auto; overflow-x: auto; border: 1px solid #222; background: #fff; }
        .sched-i-grand-total-table-container { max-height: none; overflow-x: auto; overflow-y: hidden; border: 1px solid #222; background: #fff; }
        
        .sched-i-combined-table { border-collapse: separate; border-spacing: 0; table-layout: fixed; width: max-content; background: #fff; }
        .sched-i-combined-table th, .sched-i-combined-table td { border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; font-size: 12px; padding: 1px 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-sizing: border-box; }
        
        .sched-i-thead { position: sticky; top: 0; z-index: 25; }
        .sched-i-combined-table th { text-align: center; vertical-align: middle; font-weight: 700; line-height: 1.05; background: #f0f0f0; border-top: none; }
        .sched-i-combined-table .top-header th { height: 55px; border-bottom: 1px solid #222; }
        .sched-i-combined-table .column-header th { height: 64px; border-bottom: 1px solid #222; font-size: 11px; }
        .sched-i-combined-table td { height: 23px; }
        
        /* Frozen Columns up to Order No. (Contract: 130px, Subcontract: 130px, Order: 110px) */
        .freeze-col-1 { position: sticky; left: 0px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
        .freeze-col-2 { position: sticky; left: 130px; z-index: 10; width: 130px; min-width: 130px; max-width: 130px; }
        .freeze-col-3 { position: sticky; left: 260px; z-index: 10; width: 110px; min-width: 110px; max-width: 110px; border-right: 2px solid #555 !important; }
        
        .sched-i-thead th.freeze-col-1 { position: sticky; left: 0px; top: 55px; z-index: 35; background: #f0f0f0; }
        .sched-i-thead th.freeze-col-2 { position: sticky; left: 130px; top: 55px; z-index: 35; background: #f0f0f0; }
        .sched-i-thead th.freeze-col-3 { position: sticky; left: 260px; top: 55px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }
        
        .freeze-header-group { position: sticky; left: 0px; z-index: 35; background: #f0f0f0; border-right: 2px solid #555 !important; }
        
        .yellow { background: #fff200; }
        .cyan { background: #00dfe8 !important; }
        .left { text-align: left; }
        .num { text-align: right; font-variant-numeric: tabular-nums; }
        .center { text-align: center; }
        .editable-cell { background: #fff !important; padding: 0 !important; }
        .sched-i-input { width: 100%; height: 22px; box-sizing: border-box; border: 1px solid transparent; background: #fff; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 12px; padding: 1px 4px; outline: none; }
        .sched-i-input:hover { border-color: #bbb; }
        .sched-i-input:focus { border-color: #0000ee; background: #fff; }
        .subtotal td, .billing-total td { border-top: 1px solid #111; border-bottom: 1px solid #111; height: 31px; font-weight: 700; background: #f9f9f9; }
        .billing-total.grand td { border-top: 2px solid #111; border-bottom: 2px solid #111; background: #f9f9f9; }
        
        .notes { margin-top: 24px; font-size: 11px; line-height: 1.25; }
        .notes > div { margin-bottom: 5px; }
        .notes-title { font-weight: 700; text-decoration: underline; margin-bottom: 6px !important; }
        .legend { display: flex; align-items: stretch; margin-top: 40px; min-height: 24px; }
        .legend span { display: inline-flex; align-items: center; width: 255px; padding: 3px 5px; }
        .legend b { display: inline-flex; align-items: center; padding-left: 10px; font-weight: 400; }
        .legend.linked span { background: #fff200; }
        .legend.formula span { background: #00dfe8; }
        .legend.links span { background: #cfcfcf; }
        .sched-i-toolbar { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 8px; gap: 8px; }
        .sched-i-save-btn { border: 1px solid #0000ee; background: #0000ee; color: #fff; padding: 6px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .sched-i-save-btn:hover { background: #0000c8; }
        .sched-i-save-btn:disabled { background: #999; border-color: #999; cursor: not-allowed; }
        .sched-i-error { margin: 8px 0; padding: 7px 10px; background: #ffe0e0; border: 1px solid #cc0000; color: #990000; font-weight: 600; }
        .sched-i-loading { padding: 20px; text-align: center; font-weight: 700; }
        @media print { .sched-i-page { padding: 0; background: #fff; } .sched-i-table-container { max-height: none !important; overflow: visible !important; } .sched-i-toolbar, .sched-i-error { display: none; } .sched-i-input { border: 0 !important; } }
      `}</style>

      <div className="sched-i-page custom-scrollbar">
        <div className="sched-i-inner">
          <div className="sched-i-header">
            <div className="schedule-links">
              <div>Schedule I is linked to the following schedules:</div>
              <a>Schedule H, Contract Costs</a>
              <a>Schedule K, T&amp;M</a>
              <a>ICE MANUAL</a>
            </div>
            <div className="schedule-heading">
              <div className="company">
                {companyName}
                <br />
                {companyAddress}
              </div>
              <div className="title">
                Schedule of Cumulative Direct and Indirect Costs Claimed and
                Billed
                <br />
                by Contract and Subcontract
              </div>
              <div className="fiscal">Fiscal Year End - 12/31/2025</div>
            </div>
            <div className="ice">
              SCHEDULE I<br />
              ICE (version 2.0.1h)
            </div>
          </div>

          <div className="sched-i-toolbar">
            <button
              type="button"
              className="sched-i-save-btn"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save Schedule I"}
            </button>
          </div>

          {error && <div className="sched-i-error">{error}</div>}

          {loading ? (
            <div className="sched-i-loading">Loading Schedule I...</div>
          ) : (
            <>
              <CombinedTable
                flexRows={flexRows}
                tmRows={tmRows}
                billingRowsMap={billingRowsMap}
                flexTotals={flexTotals}
                tmTotals={tmTotals}
                billingTotals={billingTotals}
                combinedTotal={combinedTotal}
                combinedNet={combinedNet}
                onCellChange={handleContractCellChange}
                onBillingChange={handleBillingChange}
                onNavigate={onNavigate}
              />
              <Notes
                explanatoryNote={explanatoryNote}
                setExplanatoryNote={setExplanatoryNote}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
