// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { FcDataConfiguration } from "react-icons/fc";

// const DFARS = () => {
//   return (
//     <div className="min-h-screen text-gray-900 flex flex-col gap-y-2 ml-2">
//       {/* ===================================================== */}
//       {/* Header */}
//       {/* ===================================================== */}

//       <div className="p-4 w-full flex items-center rounded-sm bg-white">
//         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//           <FcDataConfiguration size={20} />
//           DFARS
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default DFARS;

import React, { useState } from "react";
import { FcDataConfiguration } from "react-icons/fc";

const checklistData = [
  {
    title: "1. General & Administrative Checklist Rules",
    items: [
      {
        id: "Item 1",
        req: "Table 15-2 Compliance: Proposal conforms to the format and instructions in FAR 15.408, Table 15-2.",
        logic:
          "Verifies all summary elements (Labor, Subcontract, Material, Indirects, Fee) roll into a standard 15-2 summary schedule.",
      },
      {
        id: "Item 2",
        req: "Cognizant Audit & Admin Offices: Disclose ACO and DCAA branch office addresses, POCs, and emails.",
        logic:
          "Validates company entity profile fields for Cognizant DCMA/ACO and DCAA offices, CAGE code, and UEI.",
      },
      {
        id: "Item 3",
        req: "Accounting System Adequacy: Statement regarding whether the accounting system has been approved by DCAA/DCMA.",
        logic:
          "Checks for system adequacy disclosure, audit report number, and approval date (e.g., DFARS 252.242-7005 status).",
      },
      {
        id: "Item 4",
        req: "Estimating System Adequacy: Statement confirming the estimating system meets DFARS 252.215-7002 criteria.",
        logic:
          "Checks for an affirmative disclosure of an approved estimating system or explicit rationale if not approved.",
      },
      {
        id: "Item 5",
        req: "CAS Disclosure Statement: Does the offeror have an active Cost Accounting Standards (CAS) Disclosure Statement (Form CASB DS-1)?",
        logic:
          "Checks if contract value meets CAS thresholds (e.g., TINA/Truth in Negotiations threshold) and verifies CAS status (Exempt, Modified, Full).",
      },
      {
        id: "Item 6",
        req: "Index of Cost or Pricing Data: Direct cross-reference index showing where all supporting data resides in the package.",
        logic:
          "Auto-generates a dynamic document index mapping every WBS/CLIN to its underlying BOE, payroll file, or vendor quote attachment.",
      },
    ],
  },
  {
    title: "2. Direct Labor Checklist Rules",
    items: [
      {
        id: "Item 11",
        req: "Labor Category Basis: Basis of labor rates proposed (historical actuals, payroll records, market surveys, forward pricing).",
        logic:
          "Validates that every proposed LCAT has an assigned Rate Source flag (e.g., Costpoint Master Pay, Bureau of Labor Statistics, Salary.com).",
      },
      {
        id: "Item 12",
        req: "Labor Escalation Rationale: Specific methodology and historical basis used for out-year escalation.",
        logic:
          "Verifies an escalation factor is applied per Option Year and checks that the user has selected or written an escalation justification.",
      },
      {
        id: "Item 13",
        req: "Time-Phased Hours (BOE): Breakdown of hours by LCAT, task/WBS, and performance period.",
        logic:
          "Validates that total CLIN hours reconcile exactly with the sum of detailed task hours across all periods of performance.",
      },
    ],
  },
  {
    title: "3. Indirect Rates & Cost Pools Rules",
    items: [
      {
        id: "Item 14",
        req: "Indirect Rate Status (FPRA/FPRP/PBR): Disclose whether indirect rates are based on an FPRA, FPRP, Provisional Billing Rates, or other estimates.",
        logic:
          "Inspects the Rate Schedule selector. If FPRA is selected, validates agreement date, expiration date, and ACO reference ID.",
      },
      {
        id: "Item 15",
        req: "Rate Base & Pool Description: Detailed explanation of allocation bases (e.g., Fringe on Direct Labor, G&A on Total Cost Input).",
        logic:
          "Ensures applied cost pools match Costpoint allocation logic and that no unburdened base elements are skipped.",
      },
      {
        id: "Item 16",
        req: "Indirect Pool Reconciliation: If FPRA does not exist, provide at least 3 years of historical actual pool rates, base amounts, and pool expenses.",
        logic:
          "Checks if non-FPRA mode has historical base/pool data attached or populated from Costpoint pool history.",
      },
    ],
  },
  {
    title: "4. Subcontractors & Materials (High DCAA Scrutiny)",
    items: [
      {
        id: "Item 17",
        req: "Subcontract Price/Cost Analysis: Prime contractor's documented cost/price analysis for all subcontractors per FAR 15.404-3.",
        logic:
          'Requires user to tag each subcontract as "Commercial / Price Analysis" or "Cost-Reimbursable / Cost Analysis Performed."',
      },
      {
        id: "Item 18",
        req: "TINA Subcontract Threshold: Submission of certified cost or pricing data from subcontractors exceeding the TINA threshold ($2,000,000+).",
        logic:
          "Checks individual sub line items against the threshold; prompts for certified sub-tier package attachment.",
      },
      {
        id: "Item 20",
        req: "Consolidated Bill of Materials (CBOM): Materials priced over the threshold must include vendor quotes, purchase orders, or catalog pricing.",
        logic:
          "Validates that line-item materials link to a documented unit price source (Vendor Quote, Historical PO, Catalog Price).",
      },
    ],
  },
  {
    title: "5. Other Direct Costs (ODCs) & Travel",
    items: [
      {
        id: "Item 23",
        req: "Travel Basis of Estimate: Travel costs broken down by origin, destination, number of trips, travelers, duration, and per diem.",
        logic:
          "Ensures travel lines are not entered as flat lump sums; verifies rate sources (GSA Per Diem, Fly America Act airfare estimates).",
      },
      {
        id: "Item 25",
        req: "Royalties & Special Equipment: Explanations for license fees, specialized testing facilities, or royalties.",
        logic:
          "If non-standard ODC accounts are used, verifies that narrative justification is entered.",
      },
    ],
  },
];

const DFARS = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col gap-y-6 p-6">
      {/* ===================================================== */}
      {/* Header */}
      {/* ===================================================== */}
      <div className="p-5 w-full flex flex-col justify-center rounded-md bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <FcDataConfiguration size={28} />
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            DFARS 252.215-7009 Proposal Adequacy Checklist
          </h2>
        </div>
        <p className="text-sm text-slate-500 mt-2 ml-10">
          Verify cost proposal compliance with FAR 15.408 Table 15-2. Please
          refer to <strong>DFARS_Template.pdf</strong> for full regulatory
          context.
        </p>
      </div>

      {/* ===================================================== */}
      {/* Checklist Sections */}
      {/* ===================================================== */}
      <div className="flex flex-col gap-y-6 max-w-5xl">
        {checklistData.map((section, sIndex) => (
          <div
            key={sIndex}
            className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="bg-blue-50/50 border-b border-slate-200 px-5 py-3">
              <h3 className="text-md font-semibold text-blue-900">
                {section.title}
              </h3>
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-5 transition-colors duration-150 ${
                    checkedItems[item.id]
                      ? "bg-slate-50/70"
                      : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleCheck(item.id)}
                      className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 cursor-pointer transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor={item.id}
                      className="cursor-pointer text-sm text-slate-700 leading-relaxed"
                    >
                      <span className="font-bold text-slate-900 mr-2">
                        {item.id}:
                      </span>
                      {item.req}
                    </label>

                    <div className="mt-1 bg-emerald-50/50 border-l-4 border-emerald-400 p-3 rounded-r-md text-xs text-slate-600">
                      <span className="font-semibold text-emerald-800 block mb-1">
                        FedAxis Validation Logic:
                      </span>
                      {item.logic}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DFARS;
