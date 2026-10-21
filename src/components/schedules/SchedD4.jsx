import React from "react";

/*
 * Static UI for Schedule D (4)
 * Built to mirror SchedD3.xlsx rather than the D2 reference component.
 */

const fiscalYearEnd = "12/31/2025";
const companyName = "Revolve FinTech LLC";
const scheduleName = "Vienna, VA 22182";
const poolName = "Intermed Pool-4 (Intermed. Pool)";

const money = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "-";
  const rounded = Math.round(n);
  return rounded < 0
    ? `(${Math.abs(rounded).toLocaleString("en-US")})`
    : rounded.toLocaleString("en-US");
};

const percent = (value) => {
  const n = Number(value || 0);
  return `${n.toFixed(2)}%`;
};

function HatchedCell({ className = "" }) {
  return (
    <div
      className={`min-h-[19px] ${className}`}
      style={{
        backgroundColor: "#1f1f1f",
        backgroundImage: "radial-gradient(#666 0.65px, transparent 0.65px)",
        backgroundSize: "3px 3px",
      }}
    />
  );
}

function LinkBox({ children, onClick, width = "112px" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer border border-black bg-[#1717b7] px-2 py-[2px] text-center text-[12px] font-bold text-white underline hover:bg-[#12128a]"
      style={{ minWidth: width }}
    >
      {children}
    </button>
  );
}

const accountRows = [
  { note: "" },
  { note: "" },
  //   { note: 1 },
  { note: "" },
  { note: "" },
];

const incomingRows = [
  { label: "  AERO Fringe", reference: "Sched D (1)" },
  { label: "  California - Interm", reference: "Sched D (2)" },
  { label: "I_Pool-3", reference: "Sched D (3)" },
  { label: "ADD: Fringe Allocation", reference: "Fringe" },
];

const allocationGroups = [
  {
    title: "G & A",
    schedule: "Sched B",
    rows: ["Dept1"],
  },
  {
    title: "O/H - OH - Onsite",
    schedule: "Sched C (1)",
    rows: ["Dept1"],
  },
  {
    title: "O/H - OH - Offsite",
    schedule: "Sched C (2)",
    rows: ["Dept1"],
  },
  {
    title: "O/H - SM&H",
    schedule: "Sched C (6)",
    rows: ["Dept1"],
  },
];

const otherPools = [
  //   { label: "I_Pool-4", schedule: "Sched D (4)" },
  { label: "I_Pool-5", schedule: "Sched D (5)" },
  { label: "I_Pool-6", schedule: "Sched D (6)" },
];

const allocationColumns =
  "grid grid-cols-[260px_115px_10px_115px_115px_115px_115px_70px_40px_125px]";

function EmptyAllocationRow({ label, note }) {
  return (
    <div
      className={`${allocationColumns} min-h-[19px] text-[12px] leading-[19px]`}
    >
      <div className="px-1">{label}</div>
      <div className="text-right" />
      <div />
      <div className="bg-[#29c5ca] px-2 text-right">{percent(0)}</div>
      <div className="bg-[#29c5ca] px-2 text-right" />
      <div className="bg-[#29c5ca] px-2 text-right">{money(0)}</div>
      <div className="bg-[#29c5ca] px-2 text-right">{money(0)}</div>
      <div className="text-center">{note || ""}</div>
      <div />
      <div />
    </div>
  );
}

export default function SchedD4({ onNavigate }) {
  const navigate = (key) => {
    if (onNavigate) onNavigate(key);
  };

  return (
    <div className="min-h-full w-full overflow-x-auto bg-[#f3f3f3] font-sans text-black">
      <div className="min-w-[1090px] p-4">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="relative mb-5 h-[125px] text-[12px]">
          <div className="absolute left-0 top-0 leading-[18px]">
            <div>Schedule D(4) is linked to the following</div>
            <div>schedule(s):</div>
            <div>Schedule D(x)</div>
            <button
              type="button"
              onClick={() => navigate("ice_manual")}
              className="cursor-pointer text-blue-800 underline"
            >
              ICE MANUAL
            </button>
          </div>

          <div className="absolute left-[235px] top-0 w-[455px]">
            <div className="bg-[#ffff00] py-[2px] text-center font-bold">
              {companyName}
            </div>
            <div className="bg-[#ffff00] py-[2px] text-center font-bold">
              {scheduleName}
            </div>
          </div>

          <div className="absolute left-[790px] top-0 font-bold">
            <div>SCHEDULE D (4)</div>
            <div>ICE (version 2.0.1h)</div>
          </div>

          <div className="absolute left-[205px] top-[62px] w-[610px] text-center">
            <div className="py-[2px] font-bold italic">
              Intermediate Indirect Cost Pool
            </div>
            <div className="bg-[#ffff00] py-[2px] font-bold">{poolName}</div>
            <div className="bg-[#ffff00] py-[2px] font-bold">
              Fiscal Year End - {fiscalYearEnd}
            </div>
          </div>
        </div>

        <div className="mb-3 text-[12px] font-bold text-[#444]">
          RECHECK FORMULAS AND LINKS AFTER COMPLETING SCHEDULE
        </div>

        {/* =====================================================
            ACCOUNT / MAIN COST TABLE
        ====================================================== */}
        <div className="w-fit min-w-[910px] text-[12px]">
          <div className="grid grid-cols-[155px_180px_10px_120px_120px_120px_30px_70px_40px_125px] border-b border-black font-bold">
            <div className="flex items-end justify-center pb-[2px]">
              ACCOUNT
            </div>
            <div />
            <div />
            <div className="flex items-end justify-center pb-[2px]">
              PER G/L
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>

          <div className="grid grid-cols-[155px_180px_10px_120px_120px_120px_30px_70px_40px_125px] border-b border-black font-bold">
            <div className="text-center">NUMBER</div>
            <div>DESCRIPTION</div>
            <div />
            <div className="text-center">&amp; TRIAL BAL/FS</div>
            <div className="text-center">ADJUSTMENT</div>
            <div className="text-center">CLAIMED</div>
            <div />
            <div className="text-center">NOTES</div>
            <div />
            <div className="text-center">REFERENCE</div>
          </div>

          {accountRows.map((row, index) => (
            <div
              key={index}
              className="grid min-h-[19px] grid-cols-[155px_180px_10px_120px_120px_120px_30px_70px_40px_125px] text-[12px]"
            >
              <div />
              <div />
              <div />
              <div className="text-right" />
              <div className="text-right" />
              <div className="bg-[#29c5ca] px-2 text-right">{money(0)}</div>
              <div className="bg-[#29c5ca]" />
              <div className="text-center">{row.note}</div>
              <div />
              <div />
            </div>
          ))}

          {/* Total */}
          <div className="mt-1 grid grid-cols-[155px_180px_10px_120px_120px_120px_30px_70px_40px_125px] text-[12px]">
            <div />
            <div className="py-[2px] font-bold">Total</div>
            <div />
            <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {money(0)}
            </div>
            <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {money(0)}
            </div>
            <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {money(0)}
            </div>
            <div className="border-t border-black bg-[#29c5ca]" />
            <div />
            <div />
            <div />
          </div>

          {/* Incoming intermediate pool allocations */}
          <div className="grid min-h-[19px] grid-cols-[155px_180px_10px_120px_120px_120px_30px_70px_40px_125px] text-[12px]">
            <div className="col-span-3 py-[2px] font-bold">
              ADD: Intermediate Pool Allocations In:
            </div>
            <HatchedCell />
            <HatchedCell />
            <HatchedCell />
            <HatchedCell />
            <div />
            <div />
            <div />
          </div>

          {incomingRows.map((row, index) => (
            <div
              key={row.label}
              className="grid min-h-[19px] grid-cols-[155px_180px_10px_120px_120px_120px_30px_70px_40px_125px] text-[12px]"
            >
              <div className="bg-[#ffff00] px-1">{row.label}</div>
              <div />
              <div />
              <div className="bg-[#ffff00] px-2 text-right">{money(0)}</div>
              <div className="bg-[#ffff00] px-2 text-right">{money(0)}</div>
              <div className="bg-[#ffff00] px-2 text-right">{money(0)}</div>
              <div />
              <div />
              <div />
              <div className="flex justify-center">
                <LinkBox
                  onClick={() =>
                    navigate(
                      index === 0
                        ? "sched_d1"
                        : index === 1
                          ? "sched_d2"
                          : "sched_fringe",
                    )
                  }
                >
                  {row.reference}
                </LinkBox>
              </div>
            </div>
          ))}

          {/* Total with allocation */}
          <div className="mt-2 grid grid-cols-[155px_180px_10px_120px_120px_120px_30px_70px_40px_125px] text-[12px]">
            <div />
            <div className="py-[2px] font-bold">Total W / Alloc.</div>
            <div />
            <div className="border-t border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {money(0)}
            </div>
            <div className="border-t border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {money(0)}
            </div>
            <div className="border-t border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {money(0)}
            </div>
            <div className="border-t border-b border-black bg-[#29c5ca]" />
            <div />
            <div className="flex items-center justify-end">TO</div>
            <div className="flex justify-center">
              <LinkBox onClick={() => navigate("sched_a")}>Sched A</LinkBox>
            </div>
          </div>
        </div>

        {/* =====================================================
            ALLOCATION SECTION
        ====================================================== */}
        <div className="mt-10 min-w-[1050px] text-[12px]">
          <div className="mb-1">Allocation of Expenses Based on</div>
          <div className="mb-3">
            {" "}
            Square Feet Utilized ( Preparation Note 4 &amp; Sample Note 2)
          </div>

          <div className="w-fit">
            {/* Multi-row spreadsheet header */}
            <div
              className={`${allocationColumns} min-h-[72px] border-b border-black font-bold`}
            >
              <div />
              <div className="flex items-end justify-center pb-[8px]">Base</div>
              <div />
              <div className="flex items-end justify-center pb-[8px]">
                <span>
                  % of
                  <br />
                  Total
                </span>
              </div>
              <div className="flex items-end justify-center pb-[8px]">
                Adjustments
              </div>
              <div className="flex items-end justify-center pb-[8px]">
                <span>
                  Claimed
                  <br />
                  Expense
                  <br />
                  Allocation
                </span>
              </div>
              <div className="flex items-end justify-center pb-[8px]">
                <span>
                  Allocation
                  <br />
                  of Amts per
                  <br />
                  G/L
                </span>
              </div>
              <div />
              <div />
              <div className="flex items-end justify-center pb-[8px] text-center">
                See Preparation Note 4
              </div>
            </div>

            {/* Group rows */}
            {allocationGroups.map((group) => (
              <React.Fragment key={group.title}>
                <div
                  className={`${allocationColumns} min-h-[19px] items-center text-[12px]`}
                >
                  <div className="bg-[#ffff00] px-1 font-bold">
                    {group.title}
                  </div>
                  <HatchedCell className="col-span-6" />
                  <div />
                  <div className="text-center">TO</div>
                  <div className="flex justify-center">
                    <LinkBox
                      onClick={() =>
                        navigate(
                          group.schedule
                            .toLowerCase()
                            .replaceAll(" ", "_")
                            .replace(/[()]/g, ""),
                        )
                      }
                    >
                      {group.schedule}
                    </LinkBox>
                  </div>
                </div>

                {group.rows.map((label, index) => (
                  <EmptyAllocationRow
                    key={`${group.title}-${label}`}
                    label={`  ${label}`}
                    note={group.title === "G & A" && index === 0 ? 2 : ""}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Other intermediate pools */}
            <div
              className={`${allocationColumns} min-h-[31px] items-center text-[12px]`}
            >
              <div className="px-1 font-bold underline">
                Alloc to Other Intermed. Pools:
              </div>
              <HatchedCell className="col-span-6" />
              <div />
              <div />
              <div />
            </div>

            {otherPools.map((row) => (
              <div
                key={row.label}
                className={`${allocationColumns} min-h-[19px] text-[12px] leading-[19px]`}
              >
                <div className="bg-[#ffff00] px-1">{row.label}</div>
                <div />
                <div />
                <div className="bg-[#29c5ca] px-2 text-right">{percent(0)}</div>
                <div className="px-2 text-right" />
                <div className="bg-[#29c5ca] px-2 text-right">{money(0)}</div>
                <div className="bg-[#29c5ca] px-2 text-right">{money(0)}</div>
                <div />
                <div className="flex items-center justify-center">TO</div>
                <div className="flex justify-center">
                  <LinkBox
                    onClick={() =>
                      navigate(
                        row.schedule === "Sched D (4)"
                          ? "sched_d4"
                          : row.schedule === "Sched D (5)"
                            ? "sched_d5"
                            : "sched_d6",
                      )
                    }
                  >
                    {row.schedule}
                  </LinkBox>
                </div>
              </div>
            ))}

            {/* Allocation total */}
            <div
              className={`${allocationColumns} mt-1 border-t border-b border-black text-[12px] font-bold`}
            >
              <div />
              <div className="bg-[#29c5ca] px-2 py-[2px] text-right">
                {money(0)}
              </div>
              <div />
              <div className="bg-[#29c5ca] px-2 py-[2px] text-right">
                {percent(0)}
              </div>
              <div />
              <div className="bg-[#29c5ca] px-2 py-[2px] text-right">
                {money(0)}
              </div>
              <div className="bg-[#29c5ca] px-2 py-[2px] text-right">
                {money(0)}
              </div>
              <div />
              <div className="flex items-center justify-center">TO</div>
              <div className="flex justify-center">
                <LinkBox onClick={() => navigate("sched_a")}>Sched A</LinkBox>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PREPARATION NOTES
        ====================================================== */}
        {/* <div className="mt-8 border-t-2 border-l-2 border-r-2 border-black text-[12px]">
          <div className="bg-[#777] px-1 py-[2px] font-bold">
            PREPARATION NOTES: &nbsp;(PLEASE DELETE BEFORE SUBMITTING PROPOSAL)
          </div>

          <div className="border-b-2 border-black px-1 py-[2px]">
            1. Insert Additional Rows after Column Descriptions to Accommodate
            Chart of Accounts OR Use ICE MANUAL Section E.4.2 Automatic
          </div>
          <div className="border-b border-black px-1 py-[2px]">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“Insert Copied Cells” Command
            That Will Automatically Adjust for the Number of Rows Required to
            Accommodate the Copied Data
          </div>
          <div className="border-b border-black px-1 py-[2px]">
            2. &nbsp;Hidden rows have been inserted that will allow for
            automatic adjustment of the column totals when additional rows are
            inserted
          </div>
          <div className="border-b border-black px-1 py-[2px]">
            3. &nbsp;A replication of this schedule or Schedule C would be
            useful for any intermediate pool which is allocated to other final
            pools.
          </div>
          <div className="border-b-2 border-black px-1 py-[2px]">
            4. &nbsp;It may be necessary to modify the square feet base if the
            resulting allocation is not equitable.
          </div>
        </div> */}

        {/* =====================================================
            EXPLANATORY NOTES + LEGEND
        ====================================================== */}
        {/* <div className="mt-5 text-[12px]">
          <div className="mb-3 underline">
            Sample Explanatory Notes: (Please provide notes to explain costs
            claimed or processes used for final proposal and delete the word
            “Sample.”)
          </div>

          <div className="mb-1">
            1. &nbsp;Personal telephone allowance for executives not claimed.
          </div>
          <div>2. &nbsp;Describe adjustment and reason.</div>

          <div className="mt-7 space-y-3">
            <div className="w-[430px] bg-[#ffff00] px-1 py-[2px]">
              Linked to Other Worksheet
            </div>
            <div className="w-[430px] bg-[#29c5ca] px-1 py-[2px]">
              Cell Contains a Formula
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
