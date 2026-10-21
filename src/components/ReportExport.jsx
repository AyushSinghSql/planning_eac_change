import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Shared constants (kept identical to ForecastPSRReport.jsx) ──────────────

const MONTHS = [
  { id: 1, name: "Jan", key: "01" },
  { id: 2, name: "Feb", key: "02" },
  { id: 3, name: "Mar", key: "03" },
  { id: 4, name: "Apr", key: "04" },
  { id: 5, name: "May", key: "05" },
  { id: 6, name: "Jun", key: "06" },
  { id: 7, name: "Jul", key: "07" },
  { id: 8, name: "Aug", key: "08" },
  { id: 9, name: "Sep", key: "09" },
  { id: 10, name: "Oct", key: "10" },
  { id: 11, name: "Nov", key: "11" },
  { id: 12, name: "Dec", key: "12" },
];

const INDIRECT_PREFIXES = [
  "60",
  "62",
  "70",
  "78",
  "80",
  "82",
  "83",
  "84",
  "89",
  "90",
  "AL",
];

const INDIRECT_PREFIXES_NAME = [
  "Fringe Benefits",
  "Overhead",
  "General & Administrative",
  "Subcontract & Matl Handling",
  "Misc Income/(Expenses)",
  "Interest Expense",
  "Other Unallowable Expense",
  "Income Taxes",
  "Allocations",
];

const getAmt = (totals, year, monthKey) =>
  Number((totals || {})[`${year}-${monthKey}`] || 0);

const getChildren = (node) => {
  if (!node) return [];
  const ch = node.children;
  if (!ch) return [];
  if (Array.isArray(ch)) return ch;
  if (typeof ch === "object") return Object.values(ch);
  return [];
};

const isIndirect = (id) =>
  INDIRECT_PREFIXES.some((p) => (id || "").startsWith(p));

const isIndirectname = (id) => INDIRECT_PREFIXES_NAME.some((p) => id === p);

const isODC = (id) => (id || "").startsWith("50.24");

// ─── computeTotals ────────────────────────────────────────────────────────────
// Same logic as ForecastPSRReport.jsx's computeTotals. selectedProjectIds:
//   null        → allMode, sums the whole tree (used for the Actual sheet)
//   Set([id])   → filtered to a single project's revenue/ODC/unallowable/
//                 non-opps (used for each per-project sheet; labor/nonLabor/
//                 indirect for BUD & EAC come from projectIndirectData instead)

const computeTotals = (trendData, year, selectedProjectIds) => {
  const blank = () => Object.fromEntries(MONTHS.map((m) => [m.name, 0]));
  const out = {
    rev: blank(),
    labor: blank(),
    cost: blank(),
    nonLabor: blank(),
    odc: blank(),
    sub: blank(),
    unallowable: blank(),
    nonOpps: blank(),
    indirect: blank(),
  };

  if (!trendData || trendData.length === 0) return out;

  const allMode = selectedProjectIds === null;

  trendData.forEach((group) => {
    const gid = (group.id || "").toString();
    const gidName = (group.name || "").toString();

    // ── REVENUE ──────────────────────────────────────────────────────
    // if (gid === '40-10-01') {
    if (gidName === "Contracts Revenue") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.rev[m.name] += getAmt(group.monthlyTotals, year, m.key) * -1;
        });
      } else {
        // Contracts Revenue
        //   -> Account
        //      -> Project
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            // console.log("Revenue Project:", proj);
            // console.log("Selected Projects:", selectedProjectIds);

            if (selectedProjectIds.has(proj.id)) {
              console.log("MATCHED REVENUE:", proj);

              MONTHS.forEach((m) => {
                out.rev[m.name] += getAmt(proj.monthlyTotals, year, m.key) * -1;
              });
            }
          });
        });
      }

      return;
    }

    if (gid === "50" || gid.includes("50")) {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.cost[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.cost[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      // return;
    }

    // ── DIRECT LABOR ─────────────────────────────────────────────────
    // if (gid === "50-00-01") {
    if (gidName === "Direct Labor") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.labor[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.labor[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      return;
    }

    // ── DIRECT LABOR ─────────────────────────────────────────────────
    // if (gid === "50.2") {
    //   if (allMode) {
    //     MONTHS.forEach((m) => {
    //       out.nonLabor[m.name] += getAmt(group.monthlyTotals, year, m.key);
    //     });
    //   } else {
    //     // account → project → employee; sum matching projects
    //     getChildren(group).forEach((acct) => {
    //       getChildren(acct).forEach((proj) => {
    //         if (selectedProjectIds.has(proj.id)) {
    //           MONTHS.forEach((m) => {
    //             out.nonLabor[m.name] += getAmt(proj.monthlyTotals, year, m.key);
    //           });
    //         }
    //       });
    //     });
    //   }

    //   getChildren(group).forEach((acct) => {
    //     if (!isODC(acct.id)) return; // only 50.24.x accounts
    //     if (allMode) {
    //       MONTHS.forEach((m) => {
    //         out.odc[m.name] += getAmt(acct.monthlyTotals, year, m.key);
    //       });
    //     } else {
    //       getChildren(acct).forEach((proj) => {
    //         if (selectedProjectIds.has(proj.id)) {
    //           MONTHS.forEach((m) => {
    //             out.odc[m.name] += getAmt(proj.monthlyTotals, year, m.key);
    //           });
    //         }
    //       });
    //     }
    //   });

    //   return;
    // }
    // ── DIRECT LABOR ─────────────────────────────────────────────────
    // if (gid === "50-50-02") {
    if (gidName === "Subcontracts") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.sub[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.sub[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      return;
    }

    // ── DIRECT NON-LABOR / ODC ────────────────────────────────────────
    if (
      gidName === "Other Direct Costs" ||
      gidName === "Direct Travel" ||
      gidName === "Direct Materials"
    ) {
      getChildren(group).forEach((acct) => {
        // if (!isODC(acct.id)) return;
        if (allMode) {
          MONTHS.forEach((m) => {
            out.odc[m.name] += getAmt(acct.monthlyTotals, year, m.key);
          });
        } else {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.odc[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        }
      });

      return;
    }

    // if (gid === "90") {
    if (gid === "90") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.unallowable[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.unallowable[m.name] += getAmt(
                  proj.monthlyTotals,
                  year,
                  m.key,
                );
              });
            }
          });
        });
      }
      return;
    }

    if (gid === "95") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.nonOpps[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.nonOpps[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      return;
    }

    // ── DIRECT NON-LABOR (ODC only: 50.24.x) ─────────────────────────
    // if (gid === "50.2") {
    //   getChildren(group).forEach((acct) => {
    //     if (!isODC(acct.id)) return; // only 50.24.x accounts
    //     if (allMode) {
    //       MONTHS.forEach((m) => {
    //         out.odc[m.name] += getAmt(acct.monthlyTotals, year, m.key);
    //       });
    //     } else {
    //       getChildren(acct).forEach((proj) => {
    //         if (selectedProjectIds.has(proj.id)) {
    //           MONTHS.forEach((m) => {
    //             out.odc[m.name] += getAmt(proj.monthlyTotals, year, m.key);
    //           });
    //         }
    //       });
    //     }
    //   });
    //   return;
    // }

    // ── INDIRECT ─────────────────────────────────────────────────────
    // if (isIndirect(gid)) {
    if (isIndirectname(gidName)) {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.indirect[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.indirect[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
    }
  });

  return out;
};

// ─── Per-project, per-planType cost totals from projectIndirectData ─────────

const computeProjectApiTotals = (
  projectIndirectData,
  projId,
  planType,
  year,
) => {
  const blank = () => Object.fromEntries(MONTHS.map((m) => [m.name, 0]));
  const out = { labor: blank(), nonLabor: blank(), indirect: blank() };

  if (!projectIndirectData || projectIndirectData.length === 0) return out;

  projectIndirectData
    .filter(
      (proj) =>
        proj.projId === projId &&
        (proj.planType || "").toUpperCase() === planType.toUpperCase(),
    )
    .forEach((proj) => {
      (proj.monthlyData || []).forEach((md) => {
        if (Number(md.year) !== Number(year)) return;
        const monthDef = MONTHS.find((m) => m.id === md.month);
        if (!monthDef) return;

        out.labor[monthDef.name] += Number(md.laborCost) || 0;
        out.nonLabor[monthDef.name] += Number(md.nonLaborCost) || 0;

        const monthIndirectSum = (md.indirectCost || []).reduce(
          (sum, ic) => sum + (Number(ic.value) || 0),
          0,
        );
        out.indirect[monthDef.name] += monthIndirectSum;
      });
    });

  return out;
};

const getUniqueProjectIds = (projectIndirectData) => {
  const ids = new Set(
    (projectIndirectData || []).map((p) => p.projId).filter(Boolean),
  );
  return Array.from(ids).sort();
};

// ─── Build the 8 summary rows from a tree slice + a cost slice ──────────────
// treeSlice: { rev, odc, unallowable, nonOpps }   (month name -> value)
// costSlice: { labor, nonLabor, indirect }        (month name -> value)

const buildRows = (treeSlice, costSlice) => {
  const monthNames = MONTHS.map((m) => m.name);

  const revenueValues = monthNames.map((m) => treeSlice.rev[m]);
  const laborValues = monthNames.map((m) => costSlice.labor[m]);
  const nonLaborValues = monthNames.map((m) => costSlice.nonLabor[m]);
  const odcValues = monthNames.map((m) => treeSlice.odc[m]);
  const directValues = monthNames.map(
    (m, i) => laborValues[i] + nonLaborValues[i],
  );
  const directCost = monthNames.map((m) => treeSlice.cost[m]);
  const subcontractor = monthNames.map((m) => treeSlice?.sub?.[m] ?? 0);
  const grossValues = revenueValues.map(
    (v, i) => v - (laborValues[i] + odcValues[i] + subcontractor[i]),
  );
  const unallowable = monthNames.map((m) => treeSlice.unallowable[m]);
  const nonOpps = monthNames.map((m) => treeSlice.nonOpps[m]);
  const indirectValues = monthNames.map((m) => costSlice.indirect[m]);
  const netValues = indirectValues.map((v, i) => grossValues[i] - v);

  const withTotal = (values) => [
    ...values,
    values.reduce((a, b) => a + (Number(b) || 0), 0),
  ];

  return [
    {
      label: "Contract Revenue",
      values: withTotal(revenueValues),
      kind: "normal",
    },
    { label: "Direct Labor", values: withTotal(laborValues), kind: "normal" },
    // { label: "Non Labour", values: withTotal(nonLaborValues), kind: "normal" },
    {
      label: "Direct Cost (ODC, Travel, Materials)",
      values: withTotal(odcValues),
      kind: "normal",
    },
    {
      label: "Subcontractor",
      values: withTotal(subcontractor),
      kind: "normal",
    },
    {
      label: "Total Direct Costs",
      values: withTotal(directValues),
      kind: "subtotal",
    },
    { label: "Gross Profit", values: withTotal(grossValues), kind: "bold" },
    {
      label: "Indirect Burdens",
      values: withTotal(indirectValues),
      kind: "normal",
    },
    { label: "Net Profit / Fee", values: withTotal(netValues), kind: "net" },
  ];
};

// ─── Assemble everything needed for export: Actual + one block per project ──

const buildExportData = (trendData, projectIndirectData, year) => {
  const allTree = computeTotals(trendData, year, null);
  const actualRows = buildRows(allTree, allTree); // allMode: tree supplies both slices

  const projectIds = getUniqueProjectIds(projectIndirectData);

  const projects = projectIds.map((projId) => {
    const treeSlice = computeTotals(trendData, year, new Set([projId]));
    const budCost = computeProjectApiTotals(
      projectIndirectData,
      projId,
      "BUD",
      year,
    );
    const eacCost = computeProjectApiTotals(
      projectIndirectData,
      projId,
      "EAC",
      year,
    );

    return {
      projId,
      budRows: buildRows(treeSlice, budCost),
      eacRows: buildRows(treeSlice, eacCost),
    };
  });

  return { actualRows, projects };
};

// ─── Excel sheet-name sanitizing (Excel: 31 chars max, no : \ / ? * [ ]) ─────

const sanitizeSheetName = (name, used) => {
  let clean = (name || "Project").replace(/[:\\/?*[\]]/g, "-").slice(0, 31);
  let candidate = clean;
  let i = 1;
  while (used.has(candidate)) {
    const suffix = `_${i++}`;
    candidate = clean.slice(0, 31 - suffix.length) + suffix;
  }
  used.add(candidate);
  return candidate;
};

// ─── Shared Excel table writer ───────────────────────────────────────────────

const writeTable = (worksheet, startRow, title, rows) => {
  const monthNames = MONTHS.map((m) => m.name);

  if (title) {
    const titleRow = worksheet.getRow(startRow);
    titleRow.getCell(1).value = title;
    titleRow.getCell(1).font = {
      name: "Arial",
      size: 12,
      bold: true,
      color: { argb: "1E293B" },
    };
    startRow += 1;
  }

  const headerRow = worksheet.getRow(startRow);
  headerRow.getCell(1).value = "Line Item";
  monthNames.forEach((m, idx) => {
    headerRow.getCell(idx + 2).value = m;
  });
  headerRow.getCell(monthNames.length + 2).value = "Annual Total";
  headerRow.height = 24;
  headerRow.eachCell((cell, colNumber) => {
    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      color: { argb: "FFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E293B" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: colNumber === 1 ? "left" : "right",
    };
  });
  startRow += 1;

  rows.forEach(({ label, values, kind }) => {
    const row = worksheet.getRow(startRow);
    row.getCell(1).value = label;
    values.forEach((v, idx) => {
      const cell = row.getCell(idx + 2);
      cell.value = v;
      cell.numFmt = '$#,##0.00;($#,##0.00);"-"';
    });
    row.height = 20;

    const isBold = kind === "subtotal" || kind === "bold" || kind === "net";
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", size: 10, bold: isBold };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 ? "left" : "right",
      };

      if (kind === "subtotal") {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8FAFC" },
        };
        cell.border = { top: { style: "thin", color: { argb: "94A3B8" } } };
      } else if (kind === "net") {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "EFF6FF" },
        };
        cell.font = {
          name: "Arial",
          size: 10,
          bold: true,
          color: { argb: "1E40AF" },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "94A3B8" } },
          bottom: { style: "double", color: { argb: "334155" } },
        };
      }
    });
    startRow += 1;
  });

  return startRow;
};

// ─── EXCEL EXPORT ─────────────────────────────────────────────────────────────
// Sheet 1: "Actual" — all projects combined (unchanged behavior)
// Sheet 2..N: one per project (named by projId) — BUD table stacked above EAC table

export const exportReportToExcel = async ({
  trendData,
  projectIndirectData,
  year,
}) => {
  const { actualRows, projects } = buildExportData(
    trendData,
    projectIndirectData,
    year,
  );
  const monthNames = MONTHS.map((m) => m.name);

  const workbook = new ExcelJS.Workbook();
  const usedNames = new Set();

  const setColumnWidths = (worksheet) => {
    worksheet.getColumn(1).width = 24;
    monthNames.forEach((_, idx) => {
      worksheet.getColumn(idx + 2).width = 13;
    });
    worksheet.getColumn(monthNames.length + 2).width = 16;
  };

  // Actual sheet
  const actualSheet = workbook.addWorksheet(
    sanitizeSheetName("Actual", usedNames),
  );
  setColumnWidths(actualSheet);
  writeTable(actualSheet, 1, null, actualRows);

  // One sheet per project: BUD table, blank row, EAC table
  projects.forEach(({ projId, budRows, eacRows }) => {
    const sheet = workbook.addWorksheet(sanitizeSheetName(projId, usedNames));
    setColumnWidths(sheet);
    const nextRow = writeTable(sheet, 1, "BUD", budRows);
    writeTable(sheet, nextRow + 1, "EAC", eacRows);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `Forecast_PSR_Report_${year}_${new Date().toISOString().split("T")[0]}.xlsx`;
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
};

// ─── PDF EXPORT ────────────────────────────────────────────────────────────────
// Page 1: Actual (all projects). One page per project after that, with BUD and
// EAC tables stacked on the same page.

const fmt = (v) =>
  v === 0
    ? "—"
    : v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const drawPdfTable = (doc, startY, title, rows) => {
  const monthNames = MONTHS.map((m) => m.name);
  const head = [["Line Item", ...monthNames, "Total"]];

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title, 40, startY);

  const body = rows.map((r) => [r.label, ...r.values.map(fmt)]);
  const boldRowIndexes = rows
    .map((r, i) =>
      r.kind === "subtotal" || r.kind === "bold" || r.kind === "net" ? i : null,
    )
    .filter((i) => i !== null);
  const netRowIndex = rows.findIndex((r) => r.kind === "net");

  // Build column styles dynamically to ensure enough room for numbers
  const columnStyles = { 0: { halign: "left", cellWidth: 105 } };
  monthNames.forEach((_, idx) => {
    columnStyles[idx + 1] = { halign: "right", cellWidth: 50 };
  });
  columnStyles[monthNames.length + 1] = { halign: "right", cellWidth: 55 }; // Total column

  autoTable(doc, {
    head,
    body,
    startY: startY + 10,
    styles: {
      font: "helvetica",
      fontSize: 7.5, // Slightly reduced font size to fit numbers comfortably
      cellPadding: 3.5,
      halign: "right",
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      fontStyle: "bold",
      halign: "right",
      fontSize: 8,
    },
    columnStyles,
    didParseCell: (data) => {
      if (data.section !== "body") return;
      if (boldRowIndexes.includes(data.row.index)) {
        data.cell.styles.fontStyle = "bold";
      }
      if (data.row.index === netRowIndex) {
        data.cell.styles.fillColor = [239, 246, 255];
        data.cell.styles.textColor = [30, 64, 175];
      }
    },
  });

  return doc.lastAutoTable.finalY;
};

export const exportReportToPdf = ({ trendData, projectIndirectData, year }) => {
  const { actualRows, projects } = buildExportData(
    trendData,
    projectIndirectData,
    year,
  );

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Trend Forecast — Actual (${year})`, 40, 30);
  drawPdfTable(doc, 55, "All Projects — Actual", actualRows);

  projects.forEach(({ projId, budRows, eacRows }) => {
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Trend Forecast — ${projId} (${year})`, 40, 30);

    const afterBud = drawPdfTable(doc, 55, "BUD", budRows);
    drawPdfTable(doc, afterBud + 30, "EAC", eacRows);
  });

  doc.save(
    `Forecast_PSR_Report_${year}_${new Date().toISOString().split("T")[0]}.pdf`,
  );
};
