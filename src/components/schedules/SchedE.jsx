// // import React from "react";

// // const YELLOW = "bg-[#fff500]";
// // const TEAL = "bg-[#28c4c8]";
// // const BLUE = "bg-[#1717b8]";

// // /* =========================================================
// //    COMMON COMPONENTS
// // ========================================================= */

// // function RefBox({ children, className = "" }) {
// //   return (
// //     <div
// //       className={`${BLUE} min-w-[145px] px-3 py-[3px] text-center text-[13px] font-bold leading-[15px] text-white underline ${className}`}
// //     >
// //       {children}
// //     </div>
// //   );
// // }

// // function TextCell({ children, bold = false, className = "" }) {
// //   return (
// //     <div
// //       className={`min-h-[19px] px-1 py-[2px] text-[12px] leading-[15px] ${
// //         bold ? "font-bold" : ""
// //       } ${className}`}
// //     >
// //       {children}
// //     </div>
// //   );
// // }

// // function ValueCell({ value = "-", color = "yellow", className = "" }) {
// //   return (
// //     <div
// //       className={`min-h-[19px] px-2 py-[2px] text-right text-[12px] leading-[15px] ${
// //         color === "teal" ? TEAL : YELLOW
// //       } ${className}`}
// //     >
// //       {value}
// //     </div>
// //   );
// // }

// // const MAIN_GRID = "grid grid-cols-[245px_165px_165px_165px_80px_145px]";

// // /* =========================================================
// //    SECTION HEADER
// // ========================================================= */

// // function PoolHeader({ title }) {
// //   return (
// //     <div className={`${MAIN_GRID} items-end border-b border-black`}>
// //       <div className="border border-[#73999d] bg-[#cfe7e9] py-[2px] text-center text-[18px] font-bold text-[#0d369b]">
// //         {title}
// //       </div>

// //       <div className="text-center text-[13px] font-bold leading-[18px]">
// //         PER G/L, F/S
// //         <br />
// //         &amp; TRIAL BAL/F.S
// //       </div>

// //       <div className="text-center text-[13px] font-bold leading-[18px]">
// //         PER G/L
// //         <br />
// //         ADJUSTMENTS
// //       </div>

// //       <div className="text-center text-[13px] font-bold">CLAIMED</div>

// //       <div className="text-center text-[12px]">Notes</div>

// //       <div className="text-center text-[13px] font-bold">Ref.</div>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    SIMPLE TOTAL ROW
// // ========================================================= */

// // function TotalRow({ label, fs, adjustment = "-", claimed }) {
// //   return (
// //     <div className={`${MAIN_GRID} border-t border-black`}>
// //       <TextCell bold>{label}</TextCell>

// //       <ValueCell value={fs} color="teal" />

// //       <ValueCell value={adjustment} color="teal" />

// //       <ValueCell value={claimed || fs} color="teal" />
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    RATE ROW
// // ========================================================= */

// // function RateRow({ label, fs, claimed }) {
// //   return (
// //     <div className={`${MAIN_GRID} mt-5`}>
// //       <div className="border-b border-black px-1 py-[2px] text-[14px] font-bold">
// //         {label}
// //       </div>

// //       <ValueCell value={fs} color="teal" />

// //       <div />

// //       <ValueCell value={claimed || fs} color="teal" />
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    OH BASE BLOCK
// // ========================================================= */

// // function OverheadBase({ rows, total, rate, references = [] }) {
// //   return (
// //     <>
// //       <div className="mt-3 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
// //         Overhead Base:
// //       </div>

// //       <div className={`${MAIN_GRID} mt-4`}>
// //         <div>
// //           {rows.map((row, index) => (
// //             <TextCell key={index}>{row.label}</TextCell>
// //           ))}
// //         </div>

// //         <div>
// //           {rows.map((row, index) => (
// //             <ValueCell key={index} value={row.fs} />
// //           ))}
// //         </div>

// //         <div />

// //         <div>
// //           {rows.map((row, index) => (
// //             <ValueCell key={index} value={row.claimed || row.fs} color="teal" />
// //           ))}
// //         </div>

// //         <div />

// //         <div className="flex flex-col gap-[3px]">
// //           {references.map((reference, index) => (
// //             <RefBox key={index}>{reference}</RefBox>
// //           ))}
// //         </div>
// //       </div>

// //       <TotalRow
// //         label={total.label}
// //         fs={total.fs}
// //         adjustment={total.adjustment}
// //         claimed={total.claimed}
// //       />

// //       <RateRow label={rate.label} fs={rate.fs} claimed={rate.claimed} />
// //     </>
// //   );
// // }

// // /* =========================================================
// //    MAIN COMPONENT
// // ========================================================= */

// // export default function ScheduleE() {
// //   return (
// //     <div className="min-h-screen w-full overflow-x-auto bg-[#eeeeee] text-black">
// //       <div className="min-w-[1200px] p-[2px]">
// //         {/* =====================================================
// //             TOP HEADER
// //         ====================================================== */}

// //         <div className="relative h-[162px]">
// //           {/* LEFT INFORMATION */}
// //           <div className="absolute left-0 top-0 w-[245px] text-[13px] leading-[18px]">
// //             <div>Schedule E is linked to the following</div>
// //             <div>schedules:</div>

// //             <div className="mt-1">Summary Sched H</div>

// //             <div>Sched H, Contract Costs</div>

// //             <div>Schedule C(x), Overhead</div>

// //             <div>Schedule B, G&amp;A</div>

// //             <div className="mt-1 text-[#173f9b] underline">ICE MANUAL</div>
// //           </div>

// //           {/* COMPANY */}
// //           <div className="absolute left-[248px] top-0 w-[505px]">
// //             <div
// //               className={`${YELLOW} py-[2px] text-center text-[14px] font-bold`}
// //             >
// //               Columbus Technologies, Inc.
// //             </div>

// //             <div
// //               className={`${YELLOW} py-[2px] text-center text-[14px] font-bold`}
// //             >
// //               California
// //             </div>
// //           </div>

// //           {/* TITLE */}
// //           <div className="absolute left-[248px] top-[56px] w-[505px]">
// //             <div className="text-center text-[15px] font-bold">
// //               Claimed Allocation Bases by element of cost used to distribute
// //               indirect costs
// //             </div>

// //             <div
// //               className={`${YELLOW} mt-[2px] py-[2px] text-center text-[14px] font-bold`}
// //             >
// //               Fiscal Year End - 12/31/2025
// //             </div>
// //           </div>

// //           {/* SCHEDULE NAME */}
// //           <div className="absolute left-[855px] top-0 text-[13px] font-bold">
// //             <div>SCHEDULE E</div>
// //             <div>ICE (version 2.0.1h)</div>
// //           </div>
// //         </div>

// //         {/* =====================================================
// //             OH - ONSITE
// //         ====================================================== */}

// //         <section>
// //           <PoolHeader title="OH - Onsite" />

// //           {/* OVERHEAD POOL */}
// //           <div className={`${MAIN_GRID} border-b border-black`}>
// //             <TextCell bold>Overhead Pool</TextCell>

// //             <ValueCell value="20,00,082" />

// //             <ValueCell value="-" />

// //             <ValueCell value="20,00,082" color="yellow" />

// //             <div />

// //             <RefBox>Sched C (1)</RefBox>
// //           </div>

// //           {/* OVERHEAD BASE */}
// //           <OverheadBase
// //             rows={[
// //               {
// //                 label: "Total Contract Labor",
// //                 fs: "2,14,10,622",
// //               },
// //               {
// //                 label: "IR&D Labor",
// //                 fs: "-",
// //               },
// //               {
// //                 label: "B&P Labor",
// //                 fs: "-",
// //               },
// //               {
// //                 label: "Fringe on D/L (before adjustments)",
// //                 fs: "71,38,029",
// //               },
// //             ]}
// //             total={{
// //               label: "Total Overhead Base",
// //               fs: "2,85,48,651",
// //             }}
// //             rate={{
// //               label: "Overhead Rate",
// //               fs: "7.01%",
// //             }}
// //             references={["Summary Sched H", '"', '"']}
// //           />

// //           <div className="mt-5 px-1 text-[14px] font-bold">
// //             Overhead Base* - Straight time direct labor dollars of all contracts
// //             and projects including labor costs of IR&amp;D/B&amp;P projects plus
// //             fringe on direct labor.
// //           </div>
// //         </section>

// //         {/* =====================================================
// //             OH - OFFSITE
// //         ====================================================== */}

// //         <section className="mt-8">
// //           <PoolHeader title="OH - Offsite" />

// //           {/* OVERHEAD POOL */}
// //           <div className={`${MAIN_GRID} border-b border-black`}>
// //             <TextCell bold>Overhead Pool</TextCell>

// //             <ValueCell value="3,37,961" />

// //             <ValueCell value="-" />

// //             <ValueCell value="3,37,961" />

// //             <div />

// //             <RefBox>Sched C (2)</RefBox>
// //           </div>

// //           <OverheadBase
// //             rows={[
// //               {
// //                 label: "Total Contract Labor",
// //                 fs: "16,48,803",
// //               },
// //               {
// //                 label: "IR&D Labor",
// //                 fs: "-",
// //               },
// //               {
// //                 label: "B&P Labor",
// //                 fs: "-",
// //               },
// //               {
// //                 label: "Fringe on D/L (before adjustments)",
// //                 fs: "5,49,543",
// //               },
// //             ]}
// //             total={{
// //               label: "Total Overhead Base",
// //               fs: "21,98,346",
// //             }}
// //             rate={{
// //               label: "Overhead Rate",
// //               fs: "15.37%",
// //             }}
// //             references={["Summary Sched H", '"', '"']}
// //           />

// //           <div className="mt-5 px-1 text-[14px] font-bold">
// //             Overhead Base* - Straight time direct labor dollars of all contracts
// //             and projects including labor costs of IR&amp;D/B&amp;P projects plus
// //             fringe on direct labor.
// //           </div>
// //         </section>

// //         {/* =====================================================
// //             G&A POOL
// //         ====================================================== */}

// //         <section className="mt-8">
// //           <PoolHeader title="G&A Pool" />

// //           {/* G&A BASE TOTAL */}
// //           <div className={`${MAIN_GRID} border-b border-black`}>
// //             <TextCell bold>G &amp; A Base:</TextCell>

// //             <ValueCell value="4,37,76,494" />

// //             <ValueCell value="621" />

// //             <ValueCell value="4,37,76,323" />

// //             <div />

// //             <RefBox>Sched B</RefBox>
// //           </div>

// //           {/* G&A BASE */}
// //           <div className="mt-2 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
// //             G &amp; A Base:
// //           </div>

// //           <div className={`${MAIN_GRID} mt-1`}>
// //             {/* LABELS */}
// //             <div>
// //               <TextCell>Contract Labor</TextCell>
// //               <TextCell>Contract Travel</TextCell>
// //               <TextCell>Contract Material</TextCell>
// //               <TextCell>Other Direct Costs</TextCell>
// //               <TextCell>Subcontracts</TextCell>
// //             </div>

// //             {/* PER G/L */}
// //             <div>
// //               <ValueCell value="2,30,59,425" />
// //               <ValueCell value="1,38,492" />
// //               <ValueCell value="15,30,143" />
// //               <ValueCell value="47,053" />
// //               <ValueCell value="2,40,29,352" />
// //             </div>

// //             {/* ADJUSTMENTS */}
// //             <div className="pt-[62px]">
// //               <ValueCell value="(3,24,751)" />
// //             </div>

// //             {/* CLAIMED */}
// //             <div>
// //               <ValueCell value="2,30,59,425" color="yellow" />
// //               <ValueCell value="1,38,492" color="yellow" />
// //               <ValueCell value="15,30,143" color="yellow" />
// //               <ValueCell value="47,053" color="yellow" />
// //               <ValueCell value="2,37,04,811" color="yellow" />
// //             </div>

// //             {/* NOTES */}
// //             <div className="pt-[62px] text-center text-[12px]">2</div>

// //             {/* REFERENCES */}
// //             <div>
// //               <RefBox>Summary Sched H</RefBox>
// //             </div>
// //           </div>

// //           {/* SUBTOTAL */}
// //           <div className={`${MAIN_GRID} border-t border-black`}>
// //             <TextCell bold>Subtotal = DIRECT COSTS</TextCell>

// //             <ValueCell value="4,92,35,125" color="teal" />

// //             <div />

// //             <ValueCell value="4,89,10,373" color="teal" />
// //           </div>

// //           {/* GENERAL LEDGER */}
// //           <div className={`${MAIN_GRID} mt-6`}>
// //             <div>
// //               <TextCell>General Ledger Overhead (before adjustments)</TextCell>

// //               <TextCell>Fringe on Direct Labor (before adjustments)</TextCell>

// //               <TextCell>
// //                 IR&D/B&P Fringe transferred to G &amp; A pool.
// //               </TextCell>
// //             </div>

// //             <div />

// //             <div />

// //             <div>
// //               <ValueCell value="23,38,043" />
// //               <ValueCell value="" />
// //               <ValueCell value="76,87,571" />
// //               <ValueCell value="" />
// //               <ValueCell value="-" />
// //             </div>

// //             <div />

// //             <div>
// //               <RefBox>Sched C (x)</RefBox>

// //               <div className="mt-2">
// //                 <RefBox>Sched H</RefBox>
// //               </div>
// //             </div>
// //           </div>

// //           {/* DEDUCTIONS */}
// //           <div className={`${MAIN_GRID} mt-3`}>
// //             <div>
// //               <TextCell>
// //                 Less: IR&D/B&P OH transferred to G &amp; A pool.
// //               </TextCell>

// //               <TextCell>IR&D OH (at G/L rate)</TextCell>

// //               <TextCell>B&P OH (at G/L rate)</TextCell>

// //               <TextCell>
// //                 Less: Material related costs to arrive at Value Added base.
// //               </TextCell>

// //               <TextCell>Direct Material</TextCell>

// //               <TextCell>Subcontracts</TextCell>
// //             </div>

// //             <div />

// //             <div />

// //             <div>
// //               <ValueCell value="-" />
// //               <ValueCell value="-" />
// //               <ValueCell value="" />
// //               <ValueCell value="" />
// //               <ValueCell value="(15,30,143)" />
// //               <ValueCell value="(2,37,04,811)" />
// //             </div>

// //             <div />

// //             <div>
// //               <RefBox>SCHED B</RefBox>
// //             </div>
// //           </div>

// //           {/* VALUE ADDED BASE */}
// //           <div className={`${MAIN_GRID} mt-1 border-b border-black`}>
// //             <TextCell bold>
// //               G&amp;A Base - Value Added [excludes IR&amp;D/B&amp;P and COM]
// //             </TextCell>

// //             <div />
// //             <div />

// //             <ValueCell value="3,37,01,034" color="teal" />
// //           </div>

// //           {/* G&A RATE */}
// //           <div className={`${MAIN_GRID} mt-5`}>
// //             <div className="border-b border-black px-1 py-[2px] text-[14px] font-bold">
// //               G&amp;A Rate
// //             </div>

// //             <div />

// //             <div />

// //             <ValueCell value="12.93%" color="teal" />
// //           </div>
// //         </section>

// //         {/* =====================================================
// //             FRINGE BASE
// //         ====================================================== */}

// //         <section className="mt-10">
// //           <div className="w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
// //             Fringe Base:
// //           </div>

// //           <div className={`${MAIN_GRID} mt-4`}>
// //             <div>
// //               <TextCell>G&A Labor</TextCell>
// //               <TextCell>Direct Labor</TextCell>
// //               <TextCell>Indirect Labor (Overhead Pools)</TextCell>
// //               <TextCell>Indirect Labor (Intermediate Pools)</TextCell>
// //             </div>

// //             <div>
// //               <ValueCell value="19,00,655" />
// //               <ValueCell value="2,25,02,797" />
// //               <ValueCell value="4,41,540" />
// //               <ValueCell value="13,12,719" />
// //             </div>

// //             <div />

// //             <div>
// //               <ValueCell value="19,00,655" color="teal" />
// //               <ValueCell value="2,25,02,797" color="teal" />
// //               <ValueCell value="4,41,540" color="teal" />
// //               <ValueCell value="13,12,719" color="teal" />
// //             </div>

// //             <div />

// //             <div className="flex flex-col gap-[3px]">
// //               <RefBox>Fringe</RefBox>
// //               <RefBox>"</RefBox>
// //               <RefBox>"</RefBox>
// //               <RefBox>"</RefBox>
// //             </div>
// //           </div>

// //           <TotalRow label="Total Fringe Base" fs="2,62,47,710" />

// //           <RateRow label="Fringe Rate" fs="33.33%" />

// //           <div className="mt-5 px-1 text-[14px] font-bold">
// //             Fringe Base* - All labor dollars i.e. direct, indirect, and
// //             unallowable labor dollars (except AERO division).
// //           </div>
// //         </section>

// //         {/* =====================================================
// //             AERO FRINGE
// //         ====================================================== */}

// //         <section className="mt-8">
// //           <PoolHeader title="AERO Fringe" />

// //           {/* FRINGE POOL */}
// //           <div className={`${MAIN_GRID} border-b border-black`}>
// //             <TextCell bold>Fringe Pool</TextCell>

// //             <ValueCell value="1,87,453" />

// //             <ValueCell value="-" />

// //             <ValueCell value="1,87,453" />

// //             <div className="text-center text-[12px]">1</div>

// //             <RefBox>Sched D (1)</RefBox>
// //           </div>

// //           {/* AERO FRINGE BASE */}
// //           <div className="mt-3 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
// //             Fringe Base:
// //           </div>

// //           <div className={`${MAIN_GRID} mt-4`}>
// //             <div>
// //               <TextCell>G&A Labor</TextCell>
// //               <TextCell>Direct Labor</TextCell>
// //               <TextCell>Indirect Labor (Overhead Pools)</TextCell>
// //               <TextCell>Indirect Labor (Intermediate Pools)</TextCell>
// //             </div>

// //             <div>
// //               <ValueCell value="" />
// //               <ValueCell value="5,56,628" />
// //               <ValueCell value="53" />
// //               <ValueCell value="" />
// //             </div>

// //             <div />

// //             <div>
// //               <ValueCell value="-" color="teal" />
// //               <ValueCell value="5,56,628" color="teal" />
// //               <ValueCell value="53" color="teal" />
// //               <ValueCell value="-" color="teal" />
// //             </div>

// //             <div />

// //             <div className="flex flex-col gap-[3px]">
// //               <RefBox>Sched D (1)</RefBox>
// //               <RefBox>"</RefBox>
// //               <RefBox>"</RefBox>
// //             </div>
// //           </div>

// //           <TotalRow label="Total Fringe Base" fs="5,56,681" />

// //           <RateRow label="Fringe Rate" fs="33.67%" />

// //           <div className="mt-5 px-1 text-[14px] font-bold">
// //             AERO Fringe Base* - All AERO associated labor dollars i.e. direct,
// //             indirect and unallowable labor dollars.
// //           </div>
// //         </section>

// //         {/* =====================================================
// //             LOWER SECTION
// //         ====================================================== */}

// //         <section className="mt-10">
// //           <div className={`${MAIN_GRID} items-end border-b border-black`}>
// //             <div className="h-[24px] border border-[#73999d] bg-[#cfe7e9]" />

// //             <div className="text-center text-[13px] font-bold">
// //               PER G/L, F/S
// //               <br />
// //               &amp; TRIAL BAL/F.S
// //             </div>

// //             <div className="text-center text-[13px] font-bold">
// //               PER G/L
// //               <br />
// //               ADJUSTMENTS
// //             </div>

// //             <div className="text-center text-[13px] font-bold">CLAIMED</div>

// //             <div className="text-center text-[12px]">Notes</div>

// //             <div className="text-center text-[13px] font-bold">Ref.</div>
// //           </div>

// //           {/* SCHED C6 */}
// //           <div className={`${MAIN_GRID} border-b border-black`}>
// //             <div />

// //             <ValueCell value="6,11,410" />

// //             <ValueCell value="-" />

// //             <ValueCell value="6,11,410" />

// //             <div />

// //             <RefBox>Sched C (6)</RefBox>
// //           </div>

// //           {/* SUMMARY SCHEDULE H */}
// //           <div className={`${MAIN_GRID} mt-8`}>
// //             <div />

// //             <ValueCell value="2,55,59,705" />

// //             <ValueCell value="(3,24,751)" />

// //             <ValueCell value="2,52,34,954" color="teal" />

// //             <div className="text-center text-[12px]">2</div>

// //             <RefBox>Summary Sched H</RefBox>
// //           </div>

// //           <div className={`${MAIN_GRID} border-t border-black`}>
// //             <div />

// //             <ValueCell value="2,55,59,705" color="teal" />

// //             <ValueCell value="(3,24,751)" color="teal" />

// //             <ValueCell value="2,52,34,954" color="teal" />
// //           </div>

// //           <div className={`${MAIN_GRID} mt-5`}>
// //             <div />

// //             <ValueCell value="2.39%" color="teal" />

// //             <div />

// //             <ValueCell value="2.42%" color="teal" />
// //           </div>

// //           {/* FRINGE */}
// //           <div className={`${MAIN_GRID} mt-10`}>
// //             <div />

// //             <ValueCell value="87,48,308" />

// //             <ValueCell value="-" />

// //             <ValueCell value="87,48,308" />

// //             <div />

// //             <RefBox>Fringe</RefBox>
// //           </div>
// //         </section>

// //         {/* =====================================================
// //             EXPLANATORY NOTES
// //         ====================================================== */}

// //         <section className="mt-10 pb-8">
// //           <div className="mb-3 text-[12px] font-bold underline">
// //             Explanatory Notes:
// //           </div>

// //           <div className="space-y-1 text-[10px] leading-[15px]">
// //             <div>
// //               1. AERO Fringe added as per Sched D (1) as it determines a final
// //               rate and not working as intermediary pool.
// //             </div>

// //             <div>
// //               2. Adjustments were made to the Subcontractor and Material
// //               Handling (SM&amp;H) base to exclude non-labor flow-through costs,
// //               specifically teammate travel, teammate ODC, and teammate fee.
// //             </div>

// //             <div>
// //               This methodology ensures an equitable allocation of SM&amp;H costs
// //               in accordance with FAR 31.203 and the Company's established
// //               accounting practices.
// //             </div>
// //           </div>

// //           {/* LEGEND */}

// //           <div className="mt-6 w-[200px] bg-[#fff500] px-2 py-[3px] text-[12px]">
// //             Imported from Other Worksheet
// //           </div>

// //           <div className="mt-4 w-[200px] bg-[#28c4c8] px-2 py-[3px] text-[12px]">
// //             Cell Contains a Formula
// //           </div>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import { backendUrl } from "../config";

// const YELLOW = "bg-[#fff500]";
// const TEAL = "bg-[#28c4c8]";
// const BLUE = "bg-[#1717b8]";

// /* =========================================================
//    COMMON COMPONENTS
// ========================================================= */

// function RefBox({ children, targetTab, onNavigate, className = "" }) {
//   return (
//     <button
//       type="button"
//       onClick={() => targetTab && onNavigate?.(targetTab)}
//       className={`${BLUE} min-w-[145px] w-full px-3 py-[3px] text-center text-[13px] font-bold leading-[15px] text-white underline cursor-pointer hover:bg-blue-900 transition-colors ${className}`}
//     >
//       {children}
//     </button>
//   );
// }

// function TextCell({ children, bold = false, className = "" }) {
//   return (
//     <div
//       className={`min-h-[19px] px-1 py-[2px] text-[12px] leading-[15px] ${
//         bold ? "font-bold" : ""
//       } ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// function ValueCell({ value = "-", color = "yellow", className = "" }) {
//   return (
//     <div
//       className={`min-h-[19px] px-2 py-[2px] text-right text-[12px] leading-[15px] ${
//         color === "teal" ? TEAL : YELLOW
//       } ${className}`}
//     >
//       {value}
//     </div>
//   );
// }

// const MAIN_GRID = "grid grid-cols-[245px_165px_165px_165px_80px_145px]";

// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val) || val === "-")
//     return "-";
//   if (val === 0) return "-";
//   return Number(val).toLocaleString("en-US", {
//     maximumFractionDigits: 2,
//   });
// };

// /* =========================================================
//    SECTION HEADER
// ========================================================= */

// function PoolHeader({ title }) {
//   return (
//     <div className={`${MAIN_GRID} items-end border-b border-black`}>
//       <div className="border border-[#73999d] bg-[#cfe7e9] py-[2px] text-center text-[18px] font-bold text-[#0d369b]">
//         {title}
//       </div>

//       <div className="text-center text-[13px] font-bold leading-[18px]">
//         PER G/L, F/S
//         <br />
//         &amp; TRIAL BAL/F.S
//       </div>

//       <div className="text-center text-[13px] font-bold leading-[18px]">
//         PER G/L
//         <br />
//         ADJUSTMENTS
//       </div>

//       <div className="text-center text-[13px] font-bold">CLAIMED</div>

//       <div className="text-center text-[12px]">Notes</div>

//       <div className="text-center text-[13px] font-bold">Ref.</div>
//     </div>
//   );
// }

// /* =========================================================
//    SIMPLE TOTAL ROW
// ========================================================= */

// function TotalRow({ label, fs, adjustment = "-", claimed }) {
//   return (
//     <div className={`${MAIN_GRID} border-t border-black`}>
//       <TextCell bold>{label}</TextCell>

//       <ValueCell value={fs} color="teal" />

//       <ValueCell value={adjustment} color="teal" />

//       <ValueCell value={claimed || fs} color="teal" />
//     </div>
//   );
// }

// /* =========================================================
//    RATE ROW
// ========================================================= */

// function RateRow({ label, fs, claimed }) {
//   return (
//     <div className={`${MAIN_GRID} mt-5`}>
//       <div className="border-b border-black px-1 py-[2px] text-[14px] font-bold">
//         {label}
//       </div>

//       <ValueCell value={fs} color="teal" />

//       <div />

//       <ValueCell value={claimed || fs} color="teal" />
//     </div>
//   );
// }

// /* =========================================================
//    OH BASE BLOCK
// ========================================================= */

// function OverheadBase({ rows, total, rate, references = [], onNavigate }) {
//   return (
//     <>
//       <div className="mt-3 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
//         Overhead Base:
//       </div>

//       <div className={`${MAIN_GRID} mt-4`}>
//         <div>
//           {rows.map((row, index) => (
//             <TextCell key={index}>{row.label}</TextCell>
//           ))}
//         </div>

//         <div>
//           {rows.map((row, index) => (
//             <ValueCell key={index} value={row.fs} />
//           ))}
//         </div>

//         <div />

//         <div>
//           {rows.map((row, index) => (
//             <ValueCell key={index} value={row.claimed || row.fs} color="teal" />
//           ))}
//         </div>

//         <div />

//         <div className="flex flex-col gap-[3px]">
//           {references.map((ref, index) => (
//             <RefBox
//               key={index}
//               targetTab={ref.targetTab}
//               onNavigate={onNavigate}
//             >
//               {ref.label}
//             </RefBox>
//           ))}
//         </div>
//       </div>

//       <TotalRow
//         label={total.label}
//         fs={total.fs}
//         adjustment={total.adjustment}
//         claimed={total.claimed}
//       />

//       <RateRow label={rate.label} fs={rate.fs} claimed={rate.claimed} />
//     </>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// export default function ScheduleE({ onNavigate }) {
//   const [apiData, setApiData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${backendUrl}/api/TrialBalance/scheduleDE_cost?fyCd=2025`,
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         const schedules = data.schedules || [];

//         // Parse schedules into key-value structure
//         const mapped = {};
//         schedules.forEach((item) => {
//           if (item.rows && item.rows.length > 0) {
//             mapped[item.name] = item.rows[0];
//           }
//         });

//         setApiData(mapped);
//       } catch (err) {
//         console.error("Failed to fetch Schedule E data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Safe data extractors with defaults
//   const getPoolData = (key) => {
//     // Fallback to spaced version if standard key isn't found
//     const item = apiData[key] || apiData[key.replace("&", " & ")];
//     if (!item) return { trialBal: "-", adjustment: "-", claimed: "-" };

//     return {
//       trialBal: formatCurrency(item.trialBal),
//       adjustment: item.adjustment === 0 ? "-" : formatCurrency(item.adjustment),
//       claimed: formatCurrency(item.claimed),
//     };
//   };

//   const ohOnsite = getPoolData("OH Onsite");
//   const ohOffsite = getPoolData("OH Offsite");
//   const smh = getPoolData("SM&H") || getPoolData("SM & H");
//   const fringe = getPoolData("Fringe");
//   const aeroFringe = getPoolData("AERO Fringe");
//   const gna = getPoolData("G&A");

//   return (
//     <div className="min-h-screen w-full overflow-x-auto bg-[#eeeeee] text-black">
//       <div className="min-w-[1200px] p-[2px]">
//         {/* =====================================================
//             TOP HEADER
//         ====================================================== */}

//         <div className="relative h-[162px]">
//           {/* LEFT INFORMATION */}
//           <div className="absolute left-0 top-0 w-[245px] text-[13px] leading-[18px]">
//             <div>Schedule E is linked to the following</div>
//             <div>schedules:</div>

//             <button
//               type="button"
//               onClick={() => onNavigate?.("summary_sched_h")}
//               className="mt-1 text-left block hover:underline cursor-pointer text-black"
//             >
//               Summary Sched H
//             </button>

//             <button
//               type="button"
//               onClick={() => onNavigate?.("sched_h")}
//               className="text-left block hover:underline cursor-pointer text-black"
//             >
//               Sched H, Contract Costs
//             </button>

//             <button
//               type="button"
//               onClick={() => onNavigate?.("sched_c1")}
//               className="text-left block hover:underline cursor-pointer text-black"
//             >
//               Schedule C(x), Overhead
//             </button>

//             <button
//               type="button"
//               onClick={() => onNavigate?.("sched_b")}
//               className="text-left block hover:underline cursor-pointer text-black"
//             >
//               Schedule B, G&amp;A
//             </button>

//             <div className="mt-1 text-[#173f9b] underline cursor-pointer">
//               ICE MANUAL
//             </div>
//           </div>

//           {/* COMPANY */}
//           <div className="absolute left-[248px] top-0 w-[505px]">
//             <div
//               className={`${YELLOW} py-[2px] text-center text-[14px] font-bold`}
//             >
//               Columbus Technologies, Inc.
//             </div>

//             <div
//               className={`${YELLOW} py-[2px] text-center text-[14px] font-bold`}
//             >
//               California
//             </div>
//           </div>

//           {/* TITLE */}
//           <div className="absolute left-[248px] top-[56px] w-[505px]">
//             <div className="text-center text-[15px] font-bold">
//               Claimed Allocation Bases by element of cost used to distribute
//               indirect costs
//             </div>

//             <div
//               className={`${YELLOW} mt-[2px] py-[2px] text-center text-[14px] font-bold`}
//             >
//               Fiscal Year End - 12/31/2025
//             </div>
//           </div>

//           {/* SCHEDULE NAME */}
//           <div className="absolute left-[855px] top-0 text-[13px] font-bold">
//             <div>SCHEDULE E</div>
//             <div>ICE (version 2.0.1h)</div>
//           </div>
//         </div>

//         {loading && (
//           <div className="p-4 text-center text-sm font-semibold text-gray-700">
//             Loading Schedule E data...
//           </div>
//         )}

//         {error && (
//           <div className="p-4 text-center text-sm font-semibold text-red-600">
//             Error loading data: {error}
//           </div>
//         )}

//         {/* =====================================================
//             OH - ONSITE
//         ====================================================== */}

//         <section>
//           <PoolHeader title="OH - Onsite" />

//           {/* OVERHEAD POOL */}
//           <div className={`${MAIN_GRID} border-b border-black`}>
//             <TextCell bold>Overhead Pool</TextCell>

//             <ValueCell value={ohOnsite.trialBal} />

//             <ValueCell value={ohOnsite.adjustment} />

//             <ValueCell value={ohOnsite.claimed} color="yellow" />

//             <div />

//             <RefBox targetTab="sched_c1" onNavigate={onNavigate}>
//               Sched C (1)
//             </RefBox>
//           </div>

//           {/* OVERHEAD BASE */}
//           <OverheadBase
//             onNavigate={onNavigate}
//             rows={[
//               {
//                 label: "Total Contract Labor",
//                 fs: "2,14,10,622",
//               },
//               {
//                 label: "IR&D Labor",
//                 fs: "-",
//               },
//               {
//                 label: "B&P Labor",
//                 fs: "-",
//               },
//               {
//                 label: "Fringe on D/L (before adjustments)",
//                 fs: "71,38,029",
//               },
//             ]}
//             total={{
//               label: "Total Overhead Base",
//               fs: "2,85,48,651",
//             }}
//             rate={{
//               label: "Overhead Rate",
//               fs: "7.01%",
//             }}
//             references={[
//               { label: "Summary Sched H", targetTab: "summary_sched_h" },
//               { label: '"', targetTab: "summary_sched_h" },
//               { label: '"', targetTab: "summary_sched_h" },
//             ]}
//           />

//           <div className="mt-5 px-1 text-[14px] font-bold">
//             Overhead Base* - Straight time direct labor dollars of all contracts
//             and projects including labor costs of IR&amp;D/B&amp;P projects plus
//             fringe on direct labor.
//           </div>
//         </section>

//         {/* =====================================================
//             OH - OFFSITE
//         ====================================================== */}

//         <section className="mt-8">
//           <PoolHeader title="OH - Offsite" />

//           {/* OVERHEAD POOL */}
//           <div className={`${MAIN_GRID} border-b border-black`}>
//             <TextCell bold>Overhead Pool</TextCell>

//             <ValueCell value={ohOffsite.trialBal} />

//             <ValueCell value={ohOffsite.adjustment} />

//             <ValueCell value={ohOffsite.claimed} />

//             <div />

//             <RefBox targetTab="sched_c2" onNavigate={onNavigate}>
//               Sched C (2)
//             </RefBox>
//           </div>

//           <OverheadBase
//             onNavigate={onNavigate}
//             rows={[
//               {
//                 label: "Total Contract Labor",
//                 fs: "16,48,803",
//               },
//               {
//                 label: "IR&D Labor",
//                 fs: "-",
//               },
//               {
//                 label: "B&P Labor",
//                 fs: "-",
//               },
//               {
//                 label: "Fringe on D/L (before adjustments)",
//                 fs: "5,49,543",
//               },
//             ]}
//             total={{
//               label: "Total Overhead Base",
//               fs: "21,98,346",
//             }}
//             rate={{
//               label: "Overhead Rate",
//               fs: "15.37%",
//             }}
//             references={[
//               { label: "Summary Sched H", targetTab: "summary_sched_h" },
//               { label: '"', targetTab: "summary_sched_h" },
//               { label: '"', targetTab: "summary_sched_h" },
//             ]}
//           />

//           <div className="mt-5 px-1 text-[14px] font-bold">
//             Overhead Base* - Straight time direct labor dollars of all contracts
//             and projects including labor costs of IR&amp;D/B&amp;P projects plus
//             fringe on direct labor.
//           </div>
//         </section>

//         {/* =====================================================
//             G&A POOL
//         ====================================================== */}

//         <section className="mt-8">
//           <PoolHeader title="G&A Pool" />

//           {/* G&A POOL FROM API */}
//           <div className={`${MAIN_GRID} border-b border-black`}>
//             <TextCell bold>G&amp;A Pool Total</TextCell>

//             <ValueCell value={gna.trialBal} />

//             <ValueCell value={gna.adjustment} />

//             <ValueCell value={gna.claimed} />

//             <div />

//             <RefBox targetTab="sched_b" onNavigate={onNavigate}>
//               Sched B
//             </RefBox>
//           </div>

//           {/* G&A BASE TOTAL */}
//           <div className={`${MAIN_GRID} border-b border-black mt-2`}>
//             <TextCell bold>G &amp; A Base:</TextCell>

//             <ValueCell value="4,37,76,494" />

//             <ValueCell value="621" />

//             <ValueCell value="4,37,76,323" />

//             <div />

//             <RefBox targetTab="sched_b" onNavigate={onNavigate}>
//               Sched B
//             </RefBox>
//           </div>

//           {/* G&A BASE */}
//           <div className="mt-2 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
//             G &amp; A Base:
//           </div>

//           <div className={`${MAIN_GRID} mt-1`}>
//             {/* LABELS */}
//             <div>
//               <TextCell>Contract Labor</TextCell>
//               <TextCell>Contract Travel</TextCell>
//               <TextCell>Contract Material</TextCell>
//               <TextCell>Other Direct Costs</TextCell>
//               <TextCell>Subcontracts</TextCell>
//             </div>

//             {/* PER G/L */}
//             <div>
//               <ValueCell value="2,30,59,425" />
//               <ValueCell value="1,38,492" />
//               <ValueCell value="15,30,143" />
//               <ValueCell value="47,053" />
//               <ValueCell value="2,40,29,352" />
//             </div>

//             {/* ADJUSTMENTS */}
//             <div className="pt-[62px]">
//               <ValueCell value="(3,24,751)" />
//             </div>

//             {/* CLAIMED */}
//             <div>
//               <ValueCell value="2,30,59,425" color="yellow" />
//               <ValueCell value="1,38,492" color="yellow" />
//               <ValueCell value="15,30,143" color="yellow" />
//               <ValueCell value="47,053" color="yellow" />
//               <ValueCell value="2,37,04,811" color="yellow" />
//             </div>

//             {/* NOTES */}
//             <div className="pt-[62px] text-center text-[12px]">2</div>

//             {/* REFERENCES */}
//             <div>
//               <RefBox targetTab="summary_sched_h" onNavigate={onNavigate}>
//                 Summary Sched H
//               </RefBox>
//             </div>
//           </div>

//           {/* SUBTOTAL */}
//           <div className={`${MAIN_GRID} border-t border-black`}>
//             <TextCell bold>Subtotal = DIRECT COSTS</TextCell>

//             <ValueCell value="4,92,35,125" color="teal" />

//             <div />

//             <ValueCell value="4,89,10,373" color="teal" />
//           </div>

//           {/* GENERAL LEDGER */}
//           <div className={`${MAIN_GRID} mt-6`}>
//             <div>
//               <TextCell>General Ledger Overhead (before adjustments)</TextCell>

//               <TextCell>Fringe on Direct Labor (before adjustments)</TextCell>

//               <TextCell>
//                 IR&D/B&P Fringe transferred to G &amp; A pool.
//               </TextCell>
//             </div>

//             <div />

//             <div />

//             <div>
//               <ValueCell value="23,38,043" />
//               <ValueCell value="" />
//               <ValueCell value="76,87,571" />
//               <ValueCell value="" />
//               <ValueCell value="-" />
//             </div>

//             <div />

//             <div>
//               <RefBox targetTab="sched_c1" onNavigate={onNavigate}>
//                 Sched C (x)
//               </RefBox>

//               <div className="mt-2">
//                 <RefBox targetTab="sched_h" onNavigate={onNavigate}>
//                   Sched H
//                 </RefBox>
//               </div>
//             </div>
//           </div>

//           {/* DEDUCTIONS */}
//           <div className={`${MAIN_GRID} mt-3`}>
//             <div>
//               <TextCell>
//                 Less: IR&D/B&P OH transferred to G &amp; A pool.
//               </TextCell>

//               <TextCell>IR&D OH (at G/L rate)</TextCell>

//               <TextCell>B&P OH (at G/L rate)</TextCell>

//               <TextCell>
//                 Less: Material related costs to arrive at Value Added base.
//               </TextCell>

//               <TextCell>Direct Material</TextCell>

//               <TextCell>Subcontracts</TextCell>
//             </div>

//             <div />

//             <div />

//             <div>
//               <ValueCell value="-" />
//               <ValueCell value="-" />
//               <ValueCell value="" />
//               <ValueCell value="" />
//               <ValueCell value="(15,30,143)" />
//               <ValueCell value="(2,37,04,811)" />
//             </div>

//             <div />

//             <div>
//               <RefBox targetTab="sched_b" onNavigate={onNavigate}>
//                 SCHED B
//               </RefBox>
//             </div>
//           </div>

//           {/* VALUE ADDED BASE */}
//           <div className={`${MAIN_GRID} mt-1 border-b border-black`}>
//             <TextCell bold>
//               G&amp;A Base - Value Added [excludes IR&amp;D/B&amp;P and COM]
//             </TextCell>

//             <div />
//             <div />

//             <ValueCell value="3,37,01,034" color="teal" />
//           </div>

//           {/* G&A RATE */}
//           <div className={`${MAIN_GRID} mt-5`}>
//             <div className="border-b border-black px-1 py-[2px] text-[14px] font-bold">
//               G&amp;A Rate
//             </div>

//             <div />

//             <div />

//             <ValueCell value="12.93%" color="teal" />
//           </div>
//         </section>

//         {/* =====================================================
//             FRINGE BASE
//         ====================================================== */}

//         <section className="mt-10">
//           <div className="w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
//             Fringe Base:
//           </div>

//           <div className={`${MAIN_GRID} mt-4`}>
//             <div>
//               <TextCell>G&A Labor</TextCell>
//               <TextCell>Direct Labor</TextCell>
//               <TextCell>Indirect Labor (Overhead Pools)</TextCell>
//               <TextCell>Indirect Labor (Intermediate Pools)</TextCell>
//             </div>

//             <div>
//               <ValueCell value="19,00,655" />
//               <ValueCell value="2,25,02,797" />
//               <ValueCell value="4,41,540" />
//               <ValueCell value="13,12,719" />
//             </div>

//             <div />

//             <div>
//               <ValueCell value="19,00,655" color="teal" />
//               <ValueCell value="2,25,02,797" color="teal" />
//               <ValueCell value="4,41,540" color="teal" />
//               <ValueCell value="13,12,719" color="teal" />
//             </div>

//             <div />

//             <div className="flex flex-col gap-[3px]">
//               <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
//                 Fringe
//               </RefBox>
//               <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
//                 "
//               </RefBox>
//               <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
//                 "
//               </RefBox>
//               <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
//                 "
//               </RefBox>
//             </div>
//           </div>

//           <TotalRow label="Total Fringe Base" fs="2,62,47,710" />

//           <RateRow label="Fringe Rate" fs="33.33%" />

//           <div className="mt-5 px-1 text-[14px] font-bold">
//             Fringe Base* - All labor dollars i.e. direct, indirect, and
//             unallowable labor dollars (except AERO division).
//           </div>
//         </section>

//         {/* =====================================================
//             AERO FRINGE
//         ====================================================== */}

//         <section className="mt-8">
//           <PoolHeader title="AERO Fringe" />

//           {/* FRINGE POOL */}
//           <div className={`${MAIN_GRID} border-b border-black`}>
//             <TextCell bold>Fringe Pool</TextCell>

//             <ValueCell value={aeroFringe.trialBal} />

//             <ValueCell value={aeroFringe.adjustment} />

//             <ValueCell value={aeroFringe.claimed} />

//             <div className="text-center text-[12px]">1</div>

//             <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
//               Sched D (1)
//             </RefBox>
//           </div>

//           {/* AERO FRINGE BASE */}
//           <div className="mt-3 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
//             Fringe Base:
//           </div>

//           <div className={`${MAIN_GRID} mt-4`}>
//             <div>
//               <TextCell>G&A Labor</TextCell>
//               <TextCell>Direct Labor</TextCell>
//               <TextCell>Indirect Labor (Overhead Pools)</TextCell>
//               <TextCell>Indirect Labor (Intermediate Pools)</TextCell>
//             </div>

//             <div>
//               <ValueCell value="" />
//               <ValueCell value="5,56,628" />
//               <ValueCell value="53" />
//               <ValueCell value="" />
//             </div>

//             <div />

//             <div>
//               <ValueCell value="-" color="teal" />
//               <ValueCell value="5,56,628" color="teal" />
//               <ValueCell value="53" color="teal" />
//               <ValueCell value="-" color="teal" />
//             </div>

//             <div />

//             <div className="flex flex-col gap-[3px]">
//               <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
//                 Sched D (1)
//               </RefBox>
//               <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
//                 "
//               </RefBox>
//               <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
//                 "
//               </RefBox>
//             </div>
//           </div>

//           <TotalRow label="Total Fringe Base" fs="5,56,681" />

//           <RateRow label="Fringe Rate" fs="33.67%" />

//           <div className="mt-5 px-1 text-[14px] font-bold">
//             AERO Fringe Base* - All AERO associated labor dollars i.e. direct,
//             indirect and unallowable labor dollars.
//           </div>
//         </section>

//         {/* =====================================================
//             LOWER SECTION
//         ====================================================== */}

//         <section className="mt-10">
//           <PoolHeader title="SM&H" />
//           <div className={`${MAIN_GRID} items-end border-b border-black`}>
//             {/* <div className="h-[24px] border border-[#73999d] bg-[#cfe7e9]" /> */}

//             {/* <div className="text-center text-[13px] font-bold">
//               PER G/L, F/S
//               <br />
//               &amp; TRIAL BAL/F.S
//             </div>

//             <div className="text-center text-[13px] font-bold">
//               PER G/L
//               <br />
//               ADJUSTMENTS
//             </div>

//             <div className="text-center text-[13px] font-bold">CLAIMED</div>

//             <div className="text-center text-[12px]">Notes</div>

//             <div className="text-center text-[13px] font-bold">Ref.</div> */}
//           </div>

//           {/* SCHED C6 */}
//           <div className={`${MAIN_GRID} border-b border-black`}>
//             <div />

//             <ValueCell value={smh.trialBal} />

//             <ValueCell value={smh.adjustment} />

//             <ValueCell value={smh.claimed} />

//             <div />

//             <RefBox targetTab="sched_c6" onNavigate={onNavigate}>
//               Sched C (6)
//             </RefBox>
//           </div>

//           {/* SUMMARY SCHEDULE H */}
//           <div className={`${MAIN_GRID} mt-8`}>
//             <div />

//             <ValueCell value="2,55,59,705" />

//             <ValueCell value="(3,24,751)" />

//             <ValueCell value="2,52,34,954" color="teal" />

//             <div className="text-center text-[12px]">2</div>

//             <RefBox targetTab="summary_sched_h" onNavigate={onNavigate}>
//               Summary Sched H
//             </RefBox>
//           </div>

//           <div className={`${MAIN_GRID} border-t border-black`}>
//             <div />

//             <ValueCell value="2,55,59,705" color="teal" />

//             <ValueCell value="(3,24,751)" color="teal" />

//             <ValueCell value="2,52,34,954" color="teal" />
//           </div>

//           <div className={`${MAIN_GRID} mt-5`}>
//             <div />

//             <ValueCell value="2.39%" color="teal" />

//             <div />

//             <ValueCell value="2.42%" color="teal" />
//           </div>

//           {/* FRINGE */}
//           <div className={`${MAIN_GRID} mt-10`}>
//             <div />

//             <ValueCell value={fringe.trialBal} />

//             <ValueCell value={fringe.adjustment} />

//             <ValueCell value={fringe.claimed} />

//             <div />

//             <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
//               Fringe
//             </RefBox>
//           </div>
//         </section>

//         {/* =====================================================
//             EXPLANATORY NOTES
//         ====================================================== */}

//         <section className="mt-10 pb-8">
//           <div className="mb-3 text-[12px] font-bold underline">
//             Explanatory Notes:
//           </div>

//           <div className="space-y-1 text-[10px] leading-[15px]">
//             <div>
//               1. AERO Fringe added as per Sched D (1) as it determines a final
//               rate and not working as intermediary pool.
//             </div>

//             <div>
//               2. Adjustments were made to the Subcontractor and Material
//               Handling (SM&amp;H) base to exclude non-labor flow-through costs,
//               specifically teammate travel, teammate ODC, and teammate fee.
//             </div>

//             <div>
//               This methodology ensures an equitable allocation of SM&amp;H costs
//               in accordance with FAR 31.203 and the Company's established
//               accounting practices.
//             </div>
//           </div>

//           {/* LEGEND */}

//           <div className="mt-6 w-[200px] bg-[#fff500] px-2 py-[3px] text-[12px]">
//             Imported from Other Worksheet
//           </div>

//           <div className="mt-4 w-[200px] bg-[#28c4c8] px-2 py-[3px] text-[12px]">
//             Cell Contains a Formula
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

const YELLOW = "bg-[#fff500]";
const TEAL = "bg-[#28c4c8]";
const BLUE = "bg-[#1717b8]";

/* =========================================================
   COMMON COMPONENTS
========================================================= */

function RefBox({ children, targetTab, onNavigate, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => targetTab && onNavigate?.(targetTab)}
      className={`${BLUE} min-w-[145px] w-full px-3 py-[3px] text-center text-[13px] font-bold leading-[15px] text-white underline cursor-pointer hover:bg-blue-900 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function TextCell({ children, bold = false, className = "" }) {
  return (
    <div
      className={`min-h-[19px] px-1 py-[2px] text-[12px] leading-[15px] ${
        bold ? "font-bold" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ValueCell({ value = "-", color = "yellow", className = "" }) {
  return (
    <div
      className={`min-h-[19px] px-2 py-[2px] text-right text-[12px] leading-[15px] ${
        color === "teal" ? TEAL : YELLOW
      } ${className}`}
    >
      {value}
    </div>
  );
}

const MAIN_GRID = "grid grid-cols-[245px_165px_165px_165px_80px_145px]";

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "-";
  if (val === 0) return "-";
  return Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatRate = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "-";
  return `${Number(val).toFixed(2)}%`;
};

/* =========================================================
   SECTION HEADER
========================================================= */

function PoolHeader({ title }) {
  return (
    <div className={`${MAIN_GRID} items-end border-b border-black`}>
      <div className="border border-[#73999d] bg-[#cfe7e9] py-[2px] text-center text-[18px] font-bold text-[#0d369b]">
        {title}
      </div>

      <div className="text-center text-[13px] font-bold leading-[18px]">
        PER G/L, F/S
        <br />
        &amp; TRIAL BAL/F.S
      </div>

      <div className="text-center text-[13px] font-bold leading-[18px]">
        PER G/L
        <br />
        ADJUSTMENTS
      </div>

      <div className="text-center text-[13px] font-bold">CLAIMED</div>

      <div className="text-center text-[12px]">Notes</div>

      <div className="text-center text-[13px] font-bold">Ref.</div>
    </div>
  );
}

/* =========================================================
   SIMPLE TOTAL ROW
========================================================= */

function TotalRow({ label, fs, adjustment = "-", claimed }) {
  return (
    <div className={`${MAIN_GRID} border-t border-black`}>
      <TextCell bold>{label}</TextCell>

      <ValueCell value={fs} color="teal" />

      <ValueCell value={adjustment} color="teal" />

      <ValueCell value={claimed || fs} color="teal" />
    </div>
  );
}

/* =========================================================
   RATE ROW
========================================================= */

function RateRow({ label, fs, claimed }) {
  return (
    <div className={`${MAIN_GRID} mt-5`}>
      <div className="border-b border-black px-1 py-[2px] text-[14px] font-bold">
        {label}
      </div>

      <ValueCell value={fs} color="teal" />

      <div />

      <ValueCell value={claimed || fs} color="teal" />
    </div>
  );
}

/* =========================================================
   OH BASE BLOCK
========================================================= */

function OverheadBase({ rows, total, rate, references = [], onNavigate }) {
  return (
    <>
      <div className="mt-3 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
        Overhead Base:
      </div>

      <div className={`${MAIN_GRID} mt-4`}>
        <div>
          {rows.map((row, index) => (
            <TextCell key={index}>{row.label}</TextCell>
          ))}
        </div>

        <div>
          {rows.map((row, index) => (
            <ValueCell key={index} value={row.fs} />
          ))}
        </div>

        <div />

        <div>
          {rows.map((row, index) => (
            <ValueCell key={index} value={row.claimed || row.fs} color="teal" />
          ))}
        </div>

        <div />

        <div className="flex flex-col gap-[3px]">
          {references.map((ref, index) => (
            <RefBox
              key={index}
              targetTab={ref.targetTab}
              onNavigate={onNavigate}
            >
              {ref.label}
            </RefBox>
          ))}
        </div>
      </div>

      <TotalRow
        label={total?.label || "Total Overhead Base"}
        fs={total?.fs}
        adjustment={total?.adjustment}
        claimed={total?.claimed}
      />

      <RateRow
        label={rate?.label || "Overhead Rate"}
        fs={rate?.fs}
        claimed={rate?.claimed}
      />
    </>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ScheduleE({
  onNavigate,
  companyName,
  companyAddress,
  explanatoryNote,
  setExplanatoryNote,
  year,
  fiscalYearEnd,
}) {
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fiscalYearEnd = `12/31/${year}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/scheduleDE_cost?fyCd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const schedules = data.schedules || [];

        // Build structured dictionary by schedule name & subname
        const mapped = {};
        schedules.forEach((sched) => {
          mapped[sched.name] = {};
          if (sched.rows) {
            sched.rows.forEach((row) => {
              mapped[sched.name][row.subname] = {
                trialBal: row.trialBal,
                adjustment: row.adjustment,
                claimed: row.claimed,
              };
            });
          }
        });

        setApiData(mapped);
      } catch (err) {
        console.error("Failed to fetch Schedule E data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Safe metric extraction helper
  const getMetric = (schedName, subName, isRate = false) => {
    const sched = apiData[schedName] || apiData[schedName?.replace("&", " & ")];
    const item = sched?.[subName];

    if (!item) {
      return { trialBal: "-", adjustment: "-", claimed: "-" };
    }

    const formatter = isRate ? formatRate : formatCurrency;

    return {
      trialBal: formatter(item.trialBal),
      adjustment: item.adjustment === 0 ? "-" : formatCurrency(item.adjustment),
      claimed: formatter(item.claimed),
    };
  };

  return (
    <div className="min-h-screen w-full overflow-x-auto bg-[#eeeeee] text-black">
      <div className="min-w-[1200px] p-[2px]">
        {/* =====================================================
            TOP HEADER
        ====================================================== */}

        <div className="relative h-[162px]">
          {/* LEFT INFORMATION */}
          <div className="absolute left-0 top-0 w-[245px] text-[13px] leading-[18px]">
            <div>Schedule E is linked to the following</div>
            <div>schedules:</div>

            <button
              type="button"
              onClick={() => onNavigate?.("sched_summaryh")}
              className="mt-1 text-left block hover:underline cursor-pointer text-black"
            >
              Summary Sched H
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("sched_h")}
              className="text-left block hover:underline cursor-pointer text-black"
            >
              Sched H, Contract Costs
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("sched_c1")}
              className="text-left block hover:underline cursor-pointer text-black"
            >
              Schedule C(x), Overhead
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("sched_b")}
              className="text-left block hover:underline cursor-pointer text-black"
            >
              Schedule B, G&amp;A
            </button>

            <div className="mt-1 text-[#173f9b] underline cursor-pointer">
              ICE MANUAL
            </div>
          </div>

          {/* COMPANY */}
          <div className="absolute left-[248px] top-0 w-[505px]">
            <div
              className={`${YELLOW} py-[2px] text-center text-[14px] font-bold`}
            >
              {companyName}
            </div>

            <div
              className={`${YELLOW} py-[2px] text-center text-[14px] font-bold`}
            >
              {companyAddress}
            </div>
          </div>

          {/* TITLE */}
          <div className="absolute left-[248px] top-[56px] w-[505px]">
            <div className="text-center text-[15px] font-bold">
              Claimed Allocation Bases by element of cost used to distribute
              indirect costs
            </div>

            <div
              className={`${YELLOW} mt-[2px] py-[2px] text-center text-[14px] font-bold`}
            >
              Fiscal Year End - {fiscalYearEnd}
            </div>
          </div>

          {/* SCHEDULE NAME */}
          <div className="absolute left-[855px] top-0 text-[13px] font-bold">
            <div>SCHEDULE E</div>
            <div>ICE (version 2.0.1h)</div>
          </div>
        </div>

        {loading && (
          <div className="p-4 text-center text-sm font-semibold text-gray-700">
            Loading Schedule E data...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-sm font-semibold text-red-600">
            Error loading data: {error}
          </div>
        )}

        {/* =====================================================
            OH - ONSITE
        ====================================================== */}

        <section>
          <PoolHeader title="OH - Onsite" />

          {/* OVERHEAD POOL */}
          <div className={`${MAIN_GRID} border-b border-black`}>
            <TextCell bold>Overhead Pool</TextCell>

            <ValueCell
              value={getMetric("OH Onsite", "Overhead Pool").trialBal}
            />

            <ValueCell
              value={getMetric("OH Onsite", "Overhead Pool").adjustment}
            />

            <ValueCell
              value={getMetric("OH Onsite", "Overhead Pool").claimed}
              color="yellow"
            />

            <div />

            <RefBox targetTab="sched_c1" onNavigate={onNavigate}>
              Sched C (1)
            </RefBox>
          </div>

          {/* OVERHEAD BASE */}
          <OverheadBase
            onNavigate={onNavigate}
            rows={[
              {
                label: "Total Contract Labor",
                fs: getMetric("OH Onsite", "Total Contract Labor").trialBal,
                claimed: getMetric("OH Onsite", "Total Contract Labor").claimed,
              },
              {
                label: "IR&D Labor",
                fs: "-",
              },
              {
                label: "B&P Labor",
                fs: "-",
              },
              {
                label: "Fringe on D/L (before adjustments)",
                fs: getMetric("OH Onsite", "Fringe on D/L (before adjustments)")
                  .trialBal,
                claimed: getMetric(
                  "OH Onsite",
                  "Fringe on D/L (before adjustments)",
                ).claimed,
              },
            ]}
            total={{
              label: "Total Overhead Base",
              fs: getMetric("OH Onsite", "Total Overhead Base").trialBal,
              adjustment: getMetric("OH Onsite", "Total Overhead Base")
                .adjustment,
              claimed: getMetric("OH Onsite", "Total Overhead Base").claimed,
            }}
            rate={{
              label: "Overhead Rate",
              fs: getMetric("OH Onsite", "Overhead Rate", true).trialBal,
              claimed: getMetric("OH Onsite", "Overhead Rate", true).claimed,
            }}
            references={[
              { label: "Summary Sched H", targetTab: "sched_summaryh" },
              { label: '"', targetTab: "sched_summaryh" },
              { label: '"', targetTab: "sched_summaryh" },
            ]}
          />

          <div className="mt-5 px-1 text-[14px] font-bold">
            Overhead Base* - Straight time direct labor dollars of all contracts
            and projects including labor costs of IR&amp;D/B&amp;P projects plus
            fringe on direct labor.
          </div>
        </section>

        {/* =====================================================
            OH - OFFSITE
        ====================================================== */}

        <section className="mt-8">
          <PoolHeader title="OH - Offsite" />

          {/* OVERHEAD POOL */}
          <div className={`${MAIN_GRID} border-b border-black`}>
            <TextCell bold>Overhead Pool</TextCell>

            <ValueCell
              value={getMetric("OH Offsite", "Overhead Pool").trialBal}
            />

            <ValueCell
              value={getMetric("OH Offsite", "Overhead Pool").adjustment}
            />

            <ValueCell
              value={getMetric("OH Offsite", "Overhead Pool").claimed}
            />

            <div />

            <RefBox targetTab="sched_c2" onNavigate={onNavigate}>
              Sched C (2)
            </RefBox>
          </div>

          <OverheadBase
            onNavigate={onNavigate}
            rows={[
              {
                label: "Total Contract Labor",
                fs: getMetric("OH Offsite", "Total Contract Labor").trialBal,
                claimed: getMetric("OH Offsite", "Total Contract Labor")
                  .claimed,
              },
              {
                label: "IR&D Labor",
                fs: "-",
              },
              {
                label: "B&P Labor",
                fs: "-",
              },
              {
                label: "Fringe on D/L (before adjustments)",
                fs: getMetric(
                  "OH Offsite",
                  "Fringe on D/L (before adjustments)",
                ).trialBal,
                claimed: getMetric(
                  "OH Offsite",
                  "Fringe on D/L (before adjustments)",
                ).claimed,
              },
            ]}
            total={{
              label: "Total Overhead Base",
              fs: getMetric("OH Offsite", "Total Overhead Base").trialBal,
              adjustment: getMetric("OH Offsite", "Total Overhead Base")
                .adjustment,
              claimed: getMetric("OH Offsite", "Total Overhead Base").claimed,
            }}
            rate={{
              label: "Overhead Rate",
              fs: getMetric("OH Offsite", "Overhead Rate", true).trialBal,
              claimed: getMetric("OH Offsite", "Overhead Rate", true).claimed,
            }}
            references={[
              { label: "Summary Sched H", targetTab: "sched_summaryh" },
              { label: '"', targetTab: "sched_summaryh" },
              { label: '"', targetTab: "sched_summaryh" },
            ]}
          />

          <div className="mt-5 px-1 text-[14px] font-bold">
            Overhead Base* - Straight time direct labor dollars of all contracts
            and projects including labor costs of IR&amp;D/B&amp;P projects plus
            fringe on direct labor.
          </div>
        </section>

        {/* =====================================================
            SM&H SECTION
        ====================================================== */}

        <section className="mt-10">
          <PoolHeader title="SM&H" />

          {/* SCHED C6 */}
          <div className={`${MAIN_GRID} border-b border-black`}>
            <TextCell bold>Overhead Pool</TextCell>

            <ValueCell value={getMetric("SM&H", "Overhead Pool").trialBal} />

            <ValueCell value={getMetric("SM&H", "Overhead Pool").adjustment} />

            <ValueCell value={getMetric("SM&H", "Overhead Pool").claimed} />

            <div />

            <RefBox targetTab="sched_c6" onNavigate={onNavigate}>
              Sched C (6)
            </RefBox>
          </div>

          {/* SUMMARY SCHEDULE H */}
          <div className={`${MAIN_GRID} mt-8`}>
            <TextCell>Total Contract Material &amp; Subcontract</TextCell>

            <ValueCell
              value={
                getMetric("SM&H", "Total Contract Material & Subcontract")
                  .trialBal
              }
            />

            <ValueCell
              value={
                getMetric("SM&H", "Total Contract Material & Subcontract")
                  .adjustment
              }
            />

            <ValueCell
              value={
                getMetric("SM&H", "Total Contract Material & Subcontract")
                  .claimed
              }
              color="teal"
            />

            <div className="text-center text-[12px]">2</div>

            <RefBox targetTab="sched_summaryh" onNavigate={onNavigate}>
              Summary Sched H
            </RefBox>
          </div>

          <div className={`${MAIN_GRID} border-t border-black`}>
            <TextCell bold>Total Overhead Base</TextCell>

            <ValueCell
              value={getMetric("SM&H", "Total Overhead Base").trialBal}
              color="teal"
            />

            <ValueCell
              value={getMetric("SM&H", "Total Overhead Base").adjustment}
              color="teal"
            />

            <ValueCell
              value={getMetric("SM&H", "Total Overhead Base").claimed}
              color="teal"
            />
          </div>

          <div className={`${MAIN_GRID} mt-5`}>
            <TextCell bold>Overhead Rate</TextCell>

            <ValueCell
              value={getMetric("SM&H", "Overhead Rate", true).trialBal}
              color="teal"
            />

            <div />

            <ValueCell
              value={getMetric("SM&H", "Overhead Rate", true).claimed}
              color="teal"
            />
          </div>

          {/* FRINGE SUMMARY ROW */}
          <div className={`${MAIN_GRID} mt-10`}>
            <TextCell bold>Fringe Pool</TextCell>

            <ValueCell value={getMetric("Fringe", "Overhead Pool").trialBal} />

            <ValueCell
              value={getMetric("Fringe", "Overhead Pool").adjustment}
            />

            <ValueCell value={getMetric("Fringe", "Overhead Pool").claimed} />

            <div />

            <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
              Fringe
            </RefBox>
          </div>
        </section>

        {/* =====================================================
            FRINGE POOL
        ====================================================== */}

        <section className="mt-10">
          <div className="w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
            Fringe Pool:
          </div>

          <div className={`${MAIN_GRID} mt-4`}>
            <div>
              <TextCell>G&A Labor</TextCell>
              <TextCell>Direct Labor</TextCell>
              <TextCell>Indirect Labor (Overhead Pools)</TextCell>
              <TextCell>Indirect Labor (Intermediate Pools)</TextCell>
            </div>

            <div>
              <ValueCell value={getMetric("Fringe", "G&A Labor").trialBal} />
              <ValueCell value={getMetric("Fringe", "Direct Labor").trialBal} />
              <ValueCell
                value={
                  getMetric("Fringe", "Indirect Labor (Overhead Pools)")
                    .trialBal
                }
              />
              <ValueCell
                value={
                  getMetric("Fringe", "Indirect Labor (Intermediate Pools)")
                    .trialBal
                }
              />
            </div>

            <div />

            <div>
              <ValueCell
                value={getMetric("Fringe", "G&A Labor").claimed}
                color="teal"
              />
              <ValueCell
                value={getMetric("Fringe", "Direct Labor").claimed}
                color="teal"
              />
              <ValueCell
                value={
                  getMetric("Fringe", "Indirect Labor (Overhead Pools)").claimed
                }
                color="teal"
              />
              <ValueCell
                value={
                  getMetric("Fringe", "Indirect Labor (Intermediate Pools)")
                    .claimed
                }
                color="teal"
              />
            </div>

            <div />

            <div className="flex flex-col gap-[3px]">
              <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
                Fringe
              </RefBox>
              <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
                "
              </RefBox>
              <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
                "
              </RefBox>
              <RefBox targetTab="sched_fringe" onNavigate={onNavigate}>
                "
              </RefBox>
            </div>
          </div>

          <TotalRow
            label="Total Fringe Base"
            fs={getMetric("Fringe", "Total Overhead Base").trialBal}
            adjustment={getMetric("Fringe", "Total Overhead Base").adjustment}
            claimed={getMetric("Fringe", "Total Overhead Base").claimed}
          />

          <RateRow
            label="Fringe Rate"
            fs={getMetric("Fringe", "Overhead Rate", true).trialBal}
            claimed={getMetric("Fringe", "Overhead Rate", true).claimed}
          />

          <div className="mt-5 px-1 text-[14px] font-bold">
            Fringe Base* - All labor dollars i.e. direct, indirect, and
            unallowable labor dollars (except AERO division).
          </div>
        </section>

        {/* =====================================================
            AERO FRINGE
        ====================================================== */}

        <section className="mt-8">
          <PoolHeader title="AERO Fringe" />

          {/* FRINGE POOL */}
          <div className={`${MAIN_GRID} border-b border-black`}>
            <TextCell bold>Fringe Pool</TextCell>

            <ValueCell
              value={getMetric("AERO Fringe", "Overhead Pool").trialBal}
            />

            <ValueCell
              value={getMetric("AERO Fringe", "Overhead Pool").adjustment}
            />

            <ValueCell
              value={getMetric("AERO Fringe", "Overhead Pool").claimed}
            />

            <div className="text-center text-[12px]">1</div>

            <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
              Sched D (1)
            </RefBox>
          </div>

          {/* AERO FRINGE BASE */}
          <div className="mt-3 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
            Fringe Base:
          </div>

          <div className={`${MAIN_GRID} mt-4`}>
            <div>
              <TextCell>G&A Labor</TextCell>
              <TextCell>Direct Labor</TextCell>
              <TextCell>Indirect Labor (Overhead Pools)</TextCell>
              <TextCell>Indirect Labor (Intermediate Pools)</TextCell>
            </div>

            <div>
              <ValueCell value="" />
              <ValueCell
                value={getMetric("AERO Fringe", "Direct Labor").trialBal}
              />
              <ValueCell
                value={
                  getMetric("AERO Fringe", "Indirect Labor (Overhead Pools)")
                    .trialBal
                }
              />
              <ValueCell value="" />
            </div>

            <div />

            <div>
              <ValueCell value="-" color="teal" />
              <ValueCell
                value={getMetric("AERO Fringe", "Direct Labor").claimed}
                color="teal"
              />
              <ValueCell
                value={
                  getMetric("AERO Fringe", "Indirect Labor (Overhead Pools)")
                    .claimed
                }
                color="teal"
              />
              <ValueCell value="-" color="teal" />
            </div>

            <div />

            <div className="flex flex-col gap-[3px]">
              <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
                Sched D (1)
              </RefBox>
              <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
                "
              </RefBox>
              <RefBox targetTab="sched_d1" onNavigate={onNavigate}>
                "
              </RefBox>
            </div>
          </div>

          <TotalRow
            label="Total Fringe Base"
            fs={getMetric("AERO Fringe", "Total Overhead Base").trialBal}
            adjustment={
              getMetric("AERO Fringe", "Total Overhead Base").adjustment
            }
            claimed={getMetric("AERO Fringe", "Total Overhead Base").claimed}
          />

          <RateRow
            label="Fringe Rate"
            fs={getMetric("AERO Fringe", "Overhead Rate", true).trialBal}
            claimed={getMetric("AERO Fringe", "Overhead Rate", true).claimed}
          />

          <div className="mt-5 px-1 text-[14px] font-bold">
            AERO Fringe Base* - All AERO associated labor dollars i.e. direct,
            indirect and unallowable labor dollars.
          </div>
        </section>

        {/* =====================================================
            G&A POOL
        ====================================================== */}

        <section className="mt-8">
          <PoolHeader title="G&A Pool" />

          {/* G&A BASE TOTAL HEADER */}
          <div className={`${MAIN_GRID} border-b border-black`}>
            <TextCell bold>G &amp; A Base:</TextCell>

            <ValueCell value={getMetric("G&A", "G&A Base:").trialBal} />

            <ValueCell value={getMetric("G&A", "G&A Base:").adjustment} />

            <ValueCell value={getMetric("G&A", "G&A Base:").claimed} />

            <div />

            <RefBox targetTab="sched_b" onNavigate={onNavigate}>
              Sched B
            </RefBox>
          </div>

          {/* G&A BASE */}
          <div className="mt-2 w-[245px] border-b border-black px-1 py-[2px] text-[14px] font-bold">
            G &amp; A Base:
          </div>

          <div className={`${MAIN_GRID} mt-1`}>
            {/* LABELS */}
            <div>
              <TextCell>Contract Labor</TextCell>
              <TextCell>Contract Travel</TextCell>
              <TextCell>Contract Material</TextCell>
              <TextCell>Other Direct Costs</TextCell>
              <TextCell>Subcontracts</TextCell>
            </div>

            {/* PER G/L */}
            <div>
              <ValueCell value={getMetric("G&A", "Contract Labor").trialBal} />
              <ValueCell value={getMetric("G&A", "Contract Travel").trialBal} />
              <ValueCell
                value={getMetric("G&A", "Contract Material").trialBal}
              />
              <ValueCell
                value={getMetric("G&A", "Other Direct Costs").trialBal}
              />
              <ValueCell value={getMetric("G&A", "Subcontracts").trialBal} />
            </div>

            {/* ADJUSTMENTS */}
            <div className="pt-[75px]">
              <ValueCell value={getMetric("G&A", "Subcontracts").adjustment} />
            </div>

            {/* CLAIMED */}
            <div>
              <ValueCell
                value={getMetric("G&A", "Contract Labor").claimed}
                color="yellow"
              />
              <ValueCell
                value={getMetric("G&A", "Contract Travel").claimed}
                color="yellow"
              />
              <ValueCell
                value={getMetric("G&A", "Contract Material").claimed}
                color="yellow"
              />
              <ValueCell
                value={getMetric("G&A", "Other Direct Costs").claimed}
                color="yellow"
              />
              <ValueCell
                value={getMetric("G&A", "Subcontracts").claimed}
                color="yellow"
              />
            </div>

            {/* NOTES */}
            <div className="pt-[62px] text-center text-[12px]">2</div>

            {/* REFERENCES */}
            <div>
              <RefBox targetTab="sched_summaryh" onNavigate={onNavigate}>
                Summary Sched H
              </RefBox>
            </div>
          </div>

          {/* SUBTOTAL */}
          <div className={`${MAIN_GRID} border-t border-black`}>
            <TextCell bold>Subtotal = DIRECT COSTS</TextCell>

            <ValueCell
              value={getMetric("G&A", "Subtotal = DIRECT COSTS").trialBal}
              color="teal"
            />

            <ValueCell
              value={getMetric("G&A", "Subtotal = DIRECT COSTS").adjustment}
              color="teal"
            />

            <ValueCell
              value={getMetric("G&A", "Subtotal = DIRECT COSTS").claimed}
              color="teal"
            />
          </div>

          {/* GENERAL LEDGER */}
          <div className={`${MAIN_GRID} mt-6`}>
            <div>
              <TextCell>General Ledger Overhead (before adjustments)</TextCell>

              <TextCell>Fringe on Direct Labor (before adjustments)</TextCell>

              <TextCell>
                IR&D/B&P Fringe transferred to G &amp; A pool.
              </TextCell>
            </div>

            <div />

            <div />

            <div>
              <ValueCell
                value={
                  getMetric(
                    "G&A",
                    "General Ledger Overhead (before adjustments)",
                  ).claimed
                }
              />
              <ValueCell
                value={
                  getMetric(
                    "G&A",
                    "Fringe on Direct Labor (before adjustments)",
                  ).claimed
                }
              />
              <ValueCell value="-" />
            </div>

            <div />

            <div>
              <RefBox targetTab="sched_c1" onNavigate={onNavigate}>
                Sched C (x)
              </RefBox>

              <div className="mt-2">
                <RefBox targetTab="sched_h" onNavigate={onNavigate}>
                  Sched H
                </RefBox>
              </div>
            </div>
          </div>

          {/* DEDUCTIONS */}
          <div className={`${MAIN_GRID} mt-3`}>
            <div>
              <TextCell>
                Less: IR&D/B&P OH transferred to G &amp; A pool.
              </TextCell>

              <TextCell>IR&D OH (at G/L rate)</TextCell>

              <TextCell>B&P OH (at G/L rate)</TextCell>

              <TextCell>
                Less: Material related costs to arrive at Value Added base.
              </TextCell>

              <TextCell>Direct Material</TextCell>

              <TextCell>Subcontracts</TextCell>
            </div>

            <div />

            <div />

            <div>
              <ValueCell value="-" />
              <ValueCell value="-" />
              <ValueCell value="" />
              <ValueCell value="" />
              <ValueCell value={getMetric("G&A", "Direct Material").claimed} />
              <ValueCell value={getMetric("G&A", "Subcontractors").claimed} />
            </div>

            <div />

            <div>
              <RefBox targetTab="sched_b" onNavigate={onNavigate}>
                SCHED B
              </RefBox>
            </div>
          </div>

          {/* VALUE ADDED BASE */}
          <div className={`${MAIN_GRID} mt-1 border-b border-black`}>
            <TextCell bold>
              G&amp;A Base - Value Added [excludes IR&amp;D/B&amp;P and COM]
            </TextCell>

            <div />
            <div />

            <ValueCell
              value={getMetric("G&A", "G&A Base").claimed}
              color="teal"
            />
          </div>

          {/* G&A RATE */}
          <div className={`${MAIN_GRID} mt-5`}>
            <div className="border-b border-black px-1 py-[2px] text-[14px] font-bold">
              G&amp;A Rate
            </div>

            <div />

            <div />

            <ValueCell
              value={getMetric("G&A", "G&A Rate", true).claimed}
              color="teal"
            />
          </div>
        </section>

        {/* =====================================================
            EXPLANATORY NOTES
        ====================================================== */}
        {/* 
        <section className="mt-10 pb-8">
          <div className="mb-3 text-[12px] font-bold underline">
            Explanatory Notes:
          </div>

          <div className="space-y-1 text-[10px] leading-[15px]">
            <div>
              1. AERO Fringe added as per Sched D (1) as it determines a final
              rate and not working as intermediary pool.
            </div>

            <div>
              2. Adjustments were made to the Subcontractor and Material
              Handling (SM&amp;H) base to exclude non-labor flow-through costs,
              specifically teammate travel, teammate ODC, and teammate fee.
            </div>

            <div>
              This methodology ensures an equitable allocation of SM&amp;H costs
              in accordance with FAR 31.203 and the Company's established
              accounting practices.
            </div>
          </div>

          // LEGEND 

         
        </section> */}

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
          <div className="mt-6 w-[200px] bg-[#fff500] px-2 py-[3px] text-[12px]">
            Imported from Other Worksheet
          </div>

          <div className="mt-4 w-[200px] bg-[#28c4c8] px-2 py-[3px] text-[12px]">
            Cell Contains a Formula
          </div>
        </div>
      </div>
    </div>
  );
}
