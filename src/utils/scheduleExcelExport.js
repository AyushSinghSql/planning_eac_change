// // src/utils/scheduleExcelExport.js

// import ExcelJS from "exceljs";
// import { backendUrl } from "../components/config";
// import signature from "../assets/signature.png";

// const FISCAL_YEAR = 2025;
// const FISCAL_YEAR_END = "12/31/2025";
// const EXPORT_COMPANY_NAME = "Revolve";
// const EXPORT_COMPANY_ADDRESS = "Vienna";

// const YELLOW = "FFFF00";
// const CYAN = "00FFFF";
// const BLUE = "1F4E78";
// const WHITE = "FFFFFF";
// const BLACK = "000000";

// // ---------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------

// const formatDateToString = (date) => {
//   if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const dd = String(date.getDate()).padStart(2, "0");
//   const yyyy = date.getFullYear();
//   return `${mm}/${dd}/${yyyy}`;
// };

// const safeMerge = (ws, range) => {
//   try {
//     console.log("Merging:", range);
//     ws.mergeCells(range);
//   } catch (error) {
//     console.error("FAILED MERGE:", range);
//     console.error(error);
//     throw error;
//   }
// };

// const numberValue = (value) => {
//   if (value === null || value === undefined || value === "" || value === "-") {
//     return 0;
//   }

//   if (typeof value === "number") {
//     return value;
//   }

//   const cleaned = String(value)
//     .replace(/,/g, "")
//     .replace(/[()]/g, (m) => (m === "(" ? "-" : ""));

//   const result = Number(cleaned);

//   return Number.isNaN(result) ? 0 : result;
// };

// const formatNumber = (value) => {
//   if (value === null || value === undefined || value === "") {
//     return "";
//   }

//   return Number(value).toLocaleString("en-US", {
//     maximumFractionDigits: 2,
//   });
// };

// const formatPercent = (value) => {
//   if (value === null || value === undefined || Number.isNaN(Number(value))) {
//     return "0.00%";
//   }

//   return `${Number(value).toFixed(2)}%`;
// };

// const setCell = (
//   cell,
//   value,
//   {
//     bold = false,
//     underline = false,
//     align = "left",
//     fill = null,
//     fontSize = 10,
//     italic = false,
//     color = BLACK,
//   } = {},
// ) => {
//   cell.value = value;

//   cell.font = {
//     name: "Arial",
//     size: fontSize,
//     bold,
//     italic,
//     underline: underline ? "single" : undefined,
//     color: { argb: color },
//   };

//   cell.alignment = {
//     horizontal: align,
//     vertical: "middle",
//     wrapText: true,
//   };

//   if (fill) {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: fill },
//     };
//   }
// };

// const applyBottomBorder = (row, start = 1, end = row.cellCount) => {
//   for (let i = start; i <= end; i++) {
//     row.getCell(i).border = {
//       bottom: {
//         style: "thin",
//         color: { argb: BLACK },
//       },
//     };
//   }
// };

// const setupWorksheet = (worksheet) => {
//   worksheet.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   worksheet.properties.defaultRowHeight = 18;

//   worksheet.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: worksheet.PAPERSIZE_LETTER,
//   };

//   worksheet.pageMargins = {
//     left: 0.25,
//     right: 0.25,
//     top: 0.4,
//     bottom: 0.4,
//     header: 0.2,
//     footer: 0.2,
//   };
// };

// const applyWholeNumberFormats = (workbook) => {
//   workbook.worksheets.forEach((worksheet) => {
//     worksheet.eachRow((row) => {
//       row.eachCell((cell) => {
//         if (cell.value instanceof Date) return;

//         const formula =
//           cell.value && typeof cell.value === "object"
//             ? cell.value.formula
//             : null;
//         const isHyperlinkFormula = formula?.startsWith("HYPERLINK(");
//         const isRate = String(cell.numFmt || "").includes("%");

//         if (
//           !isRate &&
//           !isHyperlinkFormula &&
//           (typeof cell.value === "number" || formula)
//         ) {
//           cell.numFmt = "#,##0;(#,##0);0";
//         }
//       });
//     });
//   });
// };

// const getScheduleLinkTarget = (label) => {
//   const text = label
//     .trim()
//     .replace(/^(?:TO|LINK FROM)\s+/i, "")
//     .replace(/\s+/g, " ");
//   const upper = text.toUpperCase();

//   if (/^THIS SCHEDULE IS LINKED TO SUMMARY SCH(?:EDULE)? H\b/.test(upper)) {
//     return "Summary Schedule H";
//   }
//   if (/^THIS SCHEDULE IS LINKED TO SCHEDULE A\b/.test(upper)) {
//     return "SCHEDULE A";
//   }
//   if (/^(SUMMARY\s+SCHED(?:ULE)?\s+H|SUMMARY\s+SCH\s+H)/.test(upper)) {
//     return "Summary Schedule H";
//   }
//   if (/^(SCHED(?:ULE)?\s+H-1|SCHED(?:ULE)?\s+H-1\b)/.test(upper)) {
//     return "Schedule H-1";
//   }
//   if (/^(SCHED(?:ULE)?\s+H)(\b|,)/.test(upper)) return "Schedule H";
//   if (/^(SCHED(?:ULE)?\s+A)(\b|\s*[-(])/.test(upper)) return "SCHEDULE A";
//   if (/^(SCHED(?:ULE)?\s+B)(\b|\s*[-(])/.test(upper)) return "SCHEDULE B";
//   if (/^(SCHED(?:ULE)?\s+C\s*\(1\))/.test(upper)) return "Schedule C (1)";
//   if (/^(SCHED(?:ULE)?\s+C\s*\(2\))/.test(upper)) return "SCHEDULE C (2)";
//   if (/^(SCHED(?:ULE)?\s+C\s*\(6\))/.test(upper)) return "SCHEDULE C (6)";
//   if (/^(SCHED(?:ULE)?\s+C\s*\(X\))/.test(upper)) return "Schedule C (1)";
//   if (/^(SCHED(?:ULE)?\s+D\s*\(1\))/.test(upper)) return "SCHEDULE D (1)";
//   if (/^(SCHED(?:ULE)?\s+D\s*\(2\))/.test(upper)) return "SCHEDULE D (2)";
//   if (/^(SCHED(?:ULE)?\s+D\s*\(X\))/.test(upper)) return "SCHEDULE D (1)";
//   if (/^(SCHED(?:ULE)?\s+D)(\b|,)/.test(upper)) return "SCHEDULE D (1)";
//   if (/^(SCHED(?:ULE)?\s+C)(\b|,)/.test(upper)) return "Schedule C (1)";
//   if (/^(SCHED(?:ULE)?\s+G-1)(\b|,)/.test(upper)) return "SCHEDULE G-1";
//   if (/^(SCHED(?:ULE)?\s+G)(\b|,)/.test(upper)) return "SCHEDULE G";
//   if (/^(SCHED(?:ULE)?\s+E)(\b|\s*[-,(])/.test(upper)) return "SCHEDULE E";
//   if (/^(SCHED(?:ULE)?\s+I)(\b|\s*[-,(])/.test(upper)) return "Schedule I";
//   if (/^(SCHED(?:ULE)?\s+J)(\b|\s*[-,(])/.test(upper)) return "Schedule J";
//   if (/^(SCHED(?:ULE)?\s+K)(\b|\s*[-,(])/.test(upper)) return "SCHEDULE K";
//   if (/^(SCHED(?:ULE)?\s+L)(\b|\s*[-,(])/.test(upper)) return "Schedule L";
//   if (/^(SCHED(?:ULE)?\s+M)(\b|\s*[-,(])/.test(upper)) return "Schedule M";
//   if (/^(SCHED(?:ULE)?\s+N)(\b|\s*[-,(])/.test(upper)) return "Schedule N";
//   if (/^(SCHED(?:ULE)?\s+O)(\b|\s*[-,(])/.test(upper)) return "Schedule O";
//   if (/^SCHED(?:ULE)?\s+FRINGE\b/.test(upper)) return "Fringe";
//   if (/^FRINGE\b/.test(upper)) return "Fringe";

//   return null;
// };

// const addInternalScheduleLinks = (workbook) => {
//   workbook.worksheets.forEach((worksheet) => {
//     worksheet.eachRow((row) => {
//       row.eachCell((cell) => {
//         if (typeof cell.value !== "string") return;

//         const label = cell.value.trim();
//         if (/^ICE\s+MANUAL$/i.test(label)) {
//           cell.font = {
//             ...(cell.font || {}),
//             color: { argb: "FF0000FF" },
//             underline: true,
//           };
//           return;
//         }

//         const target = getScheduleLinkTarget(label);
//         if (!target || target === worksheet.name || !workbook.getWorksheet(target)) return;

//         const fillColor = String(cell.fill?.fgColor?.argb || "").slice(-6);
//         const isButton = ["1717A8", "29258F", "1717B8", "2563EB", "1F4E78"].includes(fillColor);
//         const escapedLabel = label.replace(/"/g, '""');

//         cell.value = {
//           formula: `HYPERLINK("#'${target}'!A1","${escapedLabel}")`,
//           result: label,
//         };
//         cell.font = {
//           ...(cell.font || {}),
//           bold: isButton || cell.font?.bold,
//           color: { argb: isButton ? "FFFFFFFF" : "FF0000FF" },
//           underline: true,
//         };
//         if (!isButton) cell.alignment = { ...(cell.alignment || {}), horizontal: "left" };
//       });
//     });
//   });
// };

// // ---------------------------------------------------------
// // Common Schedule Header
// // ---------------------------------------------------------

// const addCompanyHeader = (
//   worksheet,
//   { companyName, companyAddress, scheduleName, title },
// ) => {
//   worksheet.mergeCells("B2:F2");
//   worksheet.mergeCells("B3:F3");

//   setCell(worksheet.getCell("B2"), companyName || EXPORT_COMPANY_NAME, {
//     bold: true,
//     align: "center",
//     fill: YELLOW,
//     fontSize: 11,
//   });

//   setCell(worksheet.getCell("B3"), companyAddress || EXPORT_COMPANY_ADDRESS, {
//     bold: true,
//     align: "center",
//     fill: YELLOW,
//     fontSize: 11,
//   });

//   worksheet.mergeCells("H2:J2");
//   worksheet.mergeCells("H3:J3");

//   setCell(worksheet.getCell("H2"), scheduleName, {
//     bold: true,
//     align: "right",
//     fontSize: 12,
//   });

//   setCell(worksheet.getCell("H3"), "ICE (version 2.0.1h)", {
//     bold: true,
//     align: "right",
//     fontSize: 10,
//   });

//   if (title) {
//     worksheet.mergeCells("B5:F5");

//     setCell(worksheet.getCell("B5"), title, {
//       bold: true,
//       italic: true,
//       align: "center",
//       fontSize: 11,
//     });
//   }

//   worksheet.getRow(2).height = 20;
//   worksheet.getRow(3).height = 20;
// };

// // ---------------------------------------------------------
// // API
// // ---------------------------------------------------------

// const getJson = async (url) => {
//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status} - ${url}`);
//   }

//   return response.json();
// };

// // =========================================================
// // SCHEDULE A
// // =========================================================

// const getScheduleAData = async () => {
//   const data = await getJson(
//     `${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=${FISCAL_YEAR}`,
//   );

//   const apiSchedules = data.schedules || [];

//   const metadata = [
//     {
//       apiKey: "Customer Site Overhead",
//       title: "Customer Site Overhead",
//       rateLabel: "OH RATE",
//       reference: "SCHED C (1)",
//     },
//     {
//       apiKey: "Off - Site Overhead",
//       title: "Off - Site Overhead",
//       rateLabel: "OH RATE",
//       reference: "SCHED C (2)",
//     },
//     {
//       apiKey: "Subk & Material Handling",
//       title: "Subk & Material Handling",
//       rateLabel: "OH RATE",
//       reference: "SCHED C (6)",
//     },
//     {
//       apiKey: "General and Administrative (G&A) Expenses",
//       title: "General and Administrative (G&A) Expenses",
//       rateLabel: "G&A RATE",
//       reference: "SCHED B",
//     },
//     {
//       apiKey: "Fringe Pool",
//       title: "Fringe Pool",
//       rateLabel: "FRINGE RATE",
//       reference: "FRINGE",
//     },
//     {
//       apiKey: "AERO Fringe",
//       title: "AERO Fringe",
//       rateLabel: "AERO FRINGE RATE",
//       reference: "SCHED D (1)",
//     },
//     {
//       apiKey: "California Intermediate",
//       title: "California Intermediate",
//       rateLabel: "RATE",
//       reference: "SCHED D (2)",
//     },
//   ];

//   return metadata.map((meta) => {
//     const item = apiSchedules.find(
//       (x) => x.name?.toLowerCase() === meta.apiKey.toLowerCase(),
//     );

//     return {
//       ...meta,
//       pool: item?.pool ?? 0,
//       base: item?.base ?? 0,
//       rate: item?.rate ?? 0,
//     };
//   });
// };

// const addScheduleA = async (workbook, { companyName, companyAddress }) => {
//   const worksheet = workbook.addWorksheet("SCHEDULE A");

//   setupWorksheet(worksheet);

//   addCompanyHeader(worksheet, {
//     companyName,
//     companyAddress,
//     scheduleName: "SCHEDULE A",
//     title: "Summary of all Claimed Indirect Rates",
//   });

//   worksheet.mergeCells("B6:F6");

//   setCell(worksheet.getCell("B6"), `Fiscal Year End - ${FISCAL_YEAR_END}`, {
//     bold: true,
//     align: "center",
//     fill: YELLOW,
//   });

//   // Header
//   worksheet.getRow(8).values = ["", "COST ELEMENT", "CLAIMED", "", "REFERENCE"];

//   worksheet.mergeCells("B8:B9");
//   worksheet.mergeCells("C8:D9");
//   worksheet.mergeCells("E8:F9");

//   setCell(worksheet.getCell("B8"), "COST ELEMENT", {
//     bold: true,
//     underline: true,
//   });

//   setCell(worksheet.getCell("C8"), "CLAIMED", {
//     bold: true,
//     underline: true,
//     align: "center",
//   });

//   setCell(worksheet.getCell("E8"), "REFERENCE", {
//     bold: true,
//     underline: true,
//   });

//   applyBottomBorder(worksheet.getRow(9), 2, 5);

//   const sections = await getScheduleAData();

//   let rowNumber = 11;

//   sections.forEach((section) => {
//     worksheet.mergeCells(`B${rowNumber}:B${rowNumber}`);

//     setCell(worksheet.getCell(`B${rowNumber}`), section.title, {
//       bold: true,
//       underline: true,
//       fill: YELLOW,
//     });

//     setCell(worksheet.getCell(`B${rowNumber + 1}`), "POOL");

//     setCell(worksheet.getCell(`B${rowNumber + 2}`), "BASE");

//     setCell(worksheet.getCell(`B${rowNumber + 3}`), section.rateLabel);

//     setCell(worksheet.getCell(`C${rowNumber + 1}`), numberValue(section.pool), {
//       align: "right",
//       fill: YELLOW,
//     });

//     setCell(worksheet.getCell(`C${rowNumber + 2}`), numberValue(section.base), {
//       align: "right",
//       fill: YELLOW,
//     });

//     setCell(
//       worksheet.getCell(`C${rowNumber + 3}`),
//       Number(section.rate) / 100,
//       {
//         align: "right",
//         fill: CYAN,
//       },
//     );

//     worksheet.getCell(`C${rowNumber + 1}`).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(`C${rowNumber + 2}`).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(`C${rowNumber + 3}`).numFmt = "0.00%";

//     setCell(worksheet.getCell(`E${rowNumber + 1}`), section.reference, {
//       bold: true,
//       underline: true,
//       color: WHITE,
//       fill: BLUE,
//       align: "center",
//     });

//     rowNumber += 5;
//   });

//   worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);

//   setCell(worksheet.getCell(`B${rowNumber}`), "Imported from Other Worksheet", {
//     fill: YELLOW,
//     fontSize: 9,
//   });

//   worksheet.mergeCells(`B${rowNumber + 1}:C${rowNumber + 1}`);

//   setCell(worksheet.getCell(`B${rowNumber + 1}`), "Cell Contains a Formula", {
//     fill: CYAN,
//     fontSize: 9,
//   });

//   worksheet.columns = [
//     { width: 3 },
//     { width: 36 },
//     { width: 18 },
//     { width: 4 },
//     { width: 22 },
//     { width: 4 },
//     { width: 4 },
//     { width: 20 },
//     { width: 18 },
//     { width: 18 },
//   ];
// };

// // =========================================================
// // SCHEDULE B
// // =========================================================

// const SCHEDULE_B_ACCOUNT_LABELS = [
//   ["80-00-01", "G&A Executive Labor"],
//   ["80-10-01", "G&A Admin Supplies"],
//   ["80-10-02", "G&A Delivery/Courier"],
//   ["80-10-04", "G&A Postage/Shipping"],
//   ["80-10-06", "G&A Dues/Publications"],
//   ["80-20-02", "G&A Consultants"],
//   ["80-30-01", "G&A Rent"],
//   ["80-40-00", "G&A Travel - Other"],
//   ["80-40-01", "G&A Airfare"],
//   ["80-40-02", "G&A Hotel"],
//   ["80-40-04", "G&A Per Diem Meals"],
//   ["80-40-05", "G&A Rental Car"],
//   ["80-40-06", "G&A Ground Transport"],
//   ["80-50-01", "G&A Miscellaneous Expense"],
//   ["80-50-03", "G&A Furnished Meals"],
//   ["80-50-05", "G&A Taxes Licenses Fees"],
//   ["80-50-06", "G&A Legal Audit"],
//   ["80-50-07", "G&A Outside PR Services"],
//   ["80-50-09", "G&A Small Equipment"],
//   ["80-50-10", "G&A Software"],
//   ["80-50-11", "G&A Business Conferences"],
//   ["80-50-12", "G&A Bank Charges"],
//   ["80-50-14", "G&A Employee Relations"],
//   ["80-50-16", "G&A Marketing"],
//   ["80-50-17", "G&A Depreciation Expense"],
//   ["80-50-18", "GA Auto Expense"],
//   ["80-50-19", "G&A Parking"],
//   ["80-50-20", "G&A Telephone/Internet"],
//   ["80-50-21", "G&A Equip Maint/Repairs"],
//   ["80-70-01", "G&A Business Insurance"],
//   ["90-03-01", "State Tax Expense"],
// ];

// const getScheduleBData = async () => {
//   const data = await getJson(
//     `${backendUrl}/api/TrialBalance/scheduleB_cost?fycd=${FISCAL_YEAR}`,
//   );

//   const accountsList = Array.isArray(data) ? data : data.accounts || [];

//   const fringeAllocation = data.fringeAllocation || {
//     acctName: "Fringe Allocation",
//     endingBalance: 0,
//   };

//   const aggregated = accountsList.reduce((acc, item) => {
//     const acctId = item.acctId;
//     const endingBalance = item.endingBalance || 0;

//     if (!acc[acctId]) {
//       acc[acctId] = {
//         account: acctId,
//         description: item.acctName ? item.acctName.trim() : "",
//         amountRaw: endingBalance,
//         adjustmentRaw: 0,
//       };
//     } else {
//       acc[acctId].amountRaw += endingBalance;
//     }

//     return acc;
//   }, {});

//   const rows = Object.values(aggregated).map((row) => {
//     let adjustment = row.adjustmentRaw;

//     if (row.account === "90-03-01") {
//       adjustment = -row.amountRaw;
//     }

//     const total = row.amountRaw;
//     const claimed = total + adjustment;

//     return {
//       account: row.account,
//       description: row.description,
//       amountRaw: row.amountRaw,
//       totalRaw: total,
//       adjustmentRaw: adjustment,
//       claimedRaw: claimed,
//     };
//   });

//   const accountsById = new Map(rows.map((row) => [String(row.account), row]));
//   SCHEDULE_B_ACCOUNT_LABELS.forEach(([account, description]) => {
//     const row = accountsById.get(account);
//     if (row) {
//       if (!row.description) row.description = description;
//       return;
//     }
//     rows.push({
//       account,
//       description,
//       amountRaw: 0,
//       totalRaw: 0,
//       adjustmentRaw: 0,
//       claimedRaw: 0,
//     });
//   });

//   return {
//     rows,
//     fringeBalance: fringeAllocation.endingBalance || 0,
//   };
// };

// const addScheduleB = async (workbook, { companyName, companyAddress }) => {
//   const worksheet = workbook.addWorksheet("SCHEDULE B");

//   setupWorksheet(worksheet);

//   addCompanyHeader(worksheet, {
//     companyName,
//     companyAddress,
//     scheduleName: "SCHEDULE B",
//     title: "General and Administrative (G&A) Expenses",
//   });

//   [
//     "Schedule B is linked to the following",
//     "schedules:",
//     "Schedule D (x), Intermediate Allocations",
//     "Schedule E, Bases",
//     "Schedule H, Contract Costs",
//     "Summary Sch H",
//     "Sched P, IR&D/B&P",
//     "ICE MANUAL",
//   ].forEach((label, index) => {
//     setCell(worksheet.getCell(index + 1, 1), label, { fontSize: 9 });
//   });

//   const { rows, fringeBalance } = await getScheduleBData();

//   let row = 8;

//   // Header
//   const headers = [
//     "ACCOUNT NUMBER",
//     "DESCRIPTION",
//     "Acct Balances\nAmount",
//     "TOTAL PER G/L,\n& TRIAL BAL/F/S",
//     "ADJUSTMENTS",
//     "CLAIMED",
//     "Notes",
//     "Ref.",
//   ];

//   headers.forEach((header, index) => {
//     const cell = worksheet.getCell(row, index + 2);

//     setCell(cell, header, {
//       bold: true,
//       underline: index === 0 || index === 1,
//       align: "center",
//     });

//     if (index === 2) {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: YELLOW },
//       };
//     }
//   });

//   applyBottomBorder(worksheet.getRow(row), 2, 9);

//   row++;

//   // Data rows
//   rows.forEach((item) => {
//     setCell(worksheet.getCell(row, 2), item.account);

//     setCell(worksheet.getCell(row, 3), item.description);

//     setCell(worksheet.getCell(row, 4), item.amountRaw, { align: "right" });

//     // Frontend's TOTAL value
//     setCell(worksheet.getCell(row, 5), item.totalRaw, {
//       align: "right",
//       fill: CYAN,
//     });

//     setCell(worksheet.getCell(row, 6), item.adjustmentRaw, {
//       align: "right",
//     });

//     // Frontend's CLAIMED value
//     setCell(
//       worksheet.getCell(row, 7),
//       {
//         formula: `E${row}+F${row}`,
//       },
//       {
//         align: "right",
//         fill: CYAN,
//       },
//     );

//     worksheet.getCell(row, 4).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(row, 5).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(row, 6).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(row, 7).numFmt = "#,##0.00;(#,##0.00);-";

//     row++;
//   });

//   // Subtotal
//   const subtotalRow = row;

//   setCell(worksheet.getCell(subtotalRow, 3), "Subtotal", {
//     bold: true,
//     underline: true,
//   });

//   worksheet.getCell(subtotalRow, 4).value = {
//     formula: `SUM(D${8 + 1}:D${subtotalRow - 1})`,
//   };

//   worksheet.getCell(subtotalRow, 5).value = {
//     formula: `SUM(E${8 + 1}:E${subtotalRow - 1})`,
//   };

//   worksheet.getCell(subtotalRow, 6).value = {
//     formula: `SUM(F${8 + 1}:F${subtotalRow - 1})`,
//   };

//   worksheet.getCell(subtotalRow, 7).value = {
//     formula: `SUM(G${8 + 1}:G${subtotalRow - 1})`,
//   };

//   for (let col = 4; col <= 7; col++) {
//     worksheet.getCell(subtotalRow, col).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: CYAN },
//     };

//     worksheet.getCell(subtotalRow, col).font = {
//       name: "Arial",
//       bold: true,
//       size: 10,
//     };

//     worksheet.getCell(subtotalRow, col).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(subtotalRow, col).alignment = {
//       horizontal: "right",
//     };
//   }

//   applyBottomBorder(worksheet.getRow(subtotalRow), 2, 9);

//   row += 2;

//   // Fringe Allocation
//   setCell(worksheet.getCell(row, 3), "Fringe Allocation", {
//     bold: true,
//     fill: YELLOW,
//   });

//   setCell(worksheet.getCell(row, 5), fringeBalance, {
//     align: "right",
//     fill: YELLOW,
//   });

//   worksheet.getCell(row, 5).numFmt = "#,##0.00;(#,##0.00);-";

//   row++;

//   // Intermediate subtotal
//   setCell(worksheet.getCell(row, 3), "Intermediate Subtotal", {
//     bold: true,
//     underline: true,
//   });

//   worksheet.getCell(row, 5).value = {
//     formula: `E${subtotalRow}+E${row - 1}`,
//   };

//   worksheet.getCell(row, 7).value = {
//     formula: `G${subtotalRow}+E${row - 1}`,
//   };

//   for (const col of [5, 7]) {
//     worksheet.getCell(row, col).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: CYAN },
//     };

//     worksheet.getCell(row, col).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(row, col).alignment = {
//       horizontal: "right",
//     };
//   }

//   row += 2;

//   // Final Pool Total
//   setCell(worksheet.getCell(row, 3), "FINAL POOL TOTAL", {
//     bold: true,
//     underline: true,
//   });

//   worksheet.getCell(row, 5).value = {
//     formula: `E${row - 2}`,
//   };

//   worksheet.getCell(row, 6).value = {
//     formula: `F${subtotalRow}`,
//   };

//   worksheet.getCell(row, 7).value = {
//     formula: `G${row - 2}`,
//   };

//   for (const col of [5, 6, 7]) {
//     worksheet.getCell(row, col).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: CYAN },
//     };

//     worksheet.getCell(row, col).numFmt = "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(row, col).alignment = {
//       horizontal: "right",
//     };
//   }

//   worksheet.columns = [
//     { width: 35 },
//     { width: 18 },
//     { width: 40 },
//     { width: 18 },
//     { width: 20 },
//     { width: 18 },
//     { width: 18 },
//     { width: 10 },
//     { width: 10 },
//   ];
// };

// // =========================================================
// // COMMON C SCHEDULE DATA
// // =========================================================

// const getCAccountRows = (accounts, aggregate = true) => {
//   if (!aggregate) {
//     return accounts.map((item) => {
//       const amount = item.endingBalance || 0;

//       return {
//         account: item.acctId,
//         description: item.acctName ? item.acctName.trim() : "",
//         amountRaw: amount,
//         totalRaw: amount,
//         adjustmentRaw: 0,
//         claimedRaw: amount,
//       };
//     });
//   }

//   const aggregated = accounts.reduce((acc, item) => {
//     const acctId = item.acctId;
//     const amount = item.endingBalance || 0;

//     if (!acc[acctId]) {
//       acc[acctId] = {
//         account: acctId,
//         description: item.acctName ? item.acctName.trim() : "",
//         amountRaw: amount,
//         adjustmentRaw: 0,
//       };
//     } else {
//       acc[acctId].amountRaw += amount;
//     }

//     return acc;
//   }, {});

//   return Object.values(aggregated).map((item) => ({
//     ...item,
//     totalRaw: item.amountRaw,
//     claimedRaw: item.amountRaw + item.adjustmentRaw,
//   }));
// };

// // =========================================================
// // SCHEDULE C1
// // =========================================================

// const getScheduleC1Data = async () => {
//   const data = await getJson(
//     `${backendUrl}/api/TrialBalance/scheduleC1_cost?fycd=${FISCAL_YEAR}`,
//   );

//   const rows = getCAccountRows(
//     data.accounts || [],
//     true,
//   );

//   const amounts = data.amounts || [];

//   const california = amounts.find((x) =>
//     x.name
//       ?.toLowerCase()
//       .includes("california intermediate"),
//   );

//   const fringe = amounts.find((x) =>
//     x.name
//       ?.toLowerCase()
//       .includes("fringe"),
//   );

//   return {
//     rows,
//     californiaIntermediate:
//       Number(california?.amount || 0),
//     fringeAllocation:
//       Number(fringe?.amount || 0),
//   };
// };

// const addCScheduleTable = (worksheet, startRow, rows) => {
//   let row = startRow;

//   const headers = [
//     "ACCOUNT\nNUMBER",
//     "DESCRIPTION",
//     "Acct Balances\nAmount",
//     "TOTAL PER G/L\n& TRIAL BAL/F/S",
//     "ADJUSTMENTS",
//     "CLAIMED",
//     "Notes",
//     "Ref.",
//   ];

//   headers.forEach((header, index) => {
//     const cell = worksheet.getCell(row, index + 2);

//     setCell(cell, header, {
//       bold: true,
//       underline: index === 0 || index === 1,
//       align: "center",
//     });

//     if (index === 2) {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: YELLOW },
//       };
//     }
//   });

//   worksheet.getRow(row).height = 35;

//   applyBottomBorder(worksheet.getRow(row), 2, 9);

//   row++;

//   const firstDataRow = row;

//   rows.forEach((item) => {
//     setCell(worksheet.getCell(row, 2), item.account);

//     setCell(worksheet.getCell(row, 3), item.description);

//     setCell(worksheet.getCell(row, 4), item.amountRaw, {
//       align: "right",
//     });

//     setCell(worksheet.getCell(row, 5), item.totalRaw, {
//       align: "right",
//       fill: CYAN,
//     });

//     setCell(worksheet.getCell(row, 6), item.adjustmentRaw, {
//       align: "right",
//     });

//     worksheet.getCell(row, 7).value = {
//       formula: `E${row}+F${row}`,
//     };

//     worksheet.getCell(row, 7).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: CYAN },
//     };

//     worksheet.getCell(row, 7).alignment = {
//       horizontal: "right",
//     };

//     for (let col = 4; col <= 7; col++) {
//       worksheet.getCell(row, col).numFmt = "#,##0.00;(#,##0.00);-";
//     }

//     row++;
//   });

//   const subtotalRow = row;

//   setCell(worksheet.getCell(subtotalRow, 3), "Subtotal", {
//     bold: true,
//     underline: true,
//   });

//   for (let col = 4; col <= 7; col++) {
//     const letter = String.fromCharCode(64 + col);

//     worksheet.getCell(subtotalRow, col).value = {
//       formula: `SUM(${letter}${firstDataRow}:${letter}${subtotalRow - 1})`,
//     };

//     worksheet.getCell(subtotalRow, col).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: CYAN },
//     };

//     worksheet.getCell(subtotalRow, col).font = {
//       name: "Arial",
//       bold: true,
//       size: 10,
//     };

//     worksheet.getCell(subtotalRow, col).alignment = {
//       horizontal: "right",
//     };

//     worksheet.getCell(subtotalRow, col).numFmt = "#,##0.00;(#,##0.00);-";
//   }

//   applyBottomBorder(worksheet.getRow(subtotalRow), 2, 9);

//   return subtotalRow;
// };

// const addAllocationRow = (
//   worksheet,
//   row,
//   label,
//   amount,
//   { fill = YELLOW } = {},
// ) => {
//   setCell(worksheet.getCell(row, 3), label, {
//     bold: true,
//     underline: true,
//     fill,
//   });

//   setCell(worksheet.getCell(row, 4), 0, {
//     align: "right",
//     fill,
//   });

//   setCell(worksheet.getCell(row, 5), amount, {
//     align: "right",
//     fill,
//   });

//   setCell(worksheet.getCell(row, 7), amount, {
//     align: "right",
//     fill: CYAN,
//   });

//   worksheet.getCell(row, 4).numFmt = "#,##0.00;(#,##0.00);-";

//   worksheet.getCell(row, 5).numFmt = "#,##0.00;(#,##0.00);-";

//   worksheet.getCell(row, 7).numFmt = "#,##0.00;(#,##0.00);-";
// };

// const addCSchedule = async (
//   workbook,
//   {
//     sheetName,
//     scheduleName,
//     sectionTitle,
//     companyName,
//     companyAddress,
//     getData,
//     includeFringe,
//     includeCalifornia,
//   },
// ) => {
//   const worksheet = workbook.addWorksheet(sheetName);

//   setupWorksheet(worksheet);

//   // ============================================================
//   // HEADER
//   // ============================================================

//   [
//     `${scheduleName} is linked to the following schedules:`,
//     "Schedule E, Bases",
//     "Schedule H, Contract Costs",
//     "ICE MANUAL",
//   ].forEach((label, index) => {
//     setCell(worksheet.getCell(index + 1, 1), label, { fontSize: 9 });
//   });

//   worksheet.mergeCells("B1:F1");
//   worksheet.mergeCells("B2:F2");
//   worksheet.mergeCells("H1:I1");
//   worksheet.mergeCells("H2:I2");
//   setCell(worksheet.getCell("B1"), companyName || EXPORT_COMPANY_NAME, {
//     bold: true, align: "center", fill: YELLOW, fontSize: 11,
//   });
//   setCell(worksheet.getCell("B2"), companyAddress || EXPORT_COMPANY_ADDRESS, {
//     bold: true, align: "center", fill: YELLOW, fontSize: 11,
//   });
//   setCell(worksheet.getCell("H1"), scheduleName, { bold: true, align: "right" });
//   setCell(worksheet.getCell("H2"), "ICE (version 2.0.1h)", { align: "right" });

//   worksheet.mergeCells("B5:F5");
//   setCell(worksheet.getCell("B5"), sectionTitle, {
//     bold: true, align: "center", fill: YELLOW, fontSize: 11,
//   });

//   worksheet.mergeCells("B7:F7");

//   setCell(
//     worksheet.getCell("B7"),
//     `Fiscal Year End - ${FISCAL_YEAR_END}`,
//     {
//       bold: true,
//       align: "center",
//       fill: YELLOW,
//     },
//   );

//   // ============================================================
//   // API DATA
//   // ============================================================

//   const data = await getData();

//   // ============================================================
//   // MAIN ACCOUNT TABLE
//   // ============================================================

//   const subtotalRow = addCScheduleTable(
//     worksheet,
//     9,
//     data.rows,
//   );

//   let row = subtotalRow + 2;

//   let californiaRow = null;
//   let fringeRow = null;

//   // ============================================================
//   // CALIFORNIA INTERMEDIATE
//   // ============================================================

//   if (includeCalifornia) {
//     californiaRow = row;

//     addAllocationRow(
//       worksheet,
//       row,
//       "California Intermediate",
//       Number(data.californiaIntermediate || 0),
//     );

//     // ----------------------------------------------------------
//     // Reference: Sched D (1)
//     // ----------------------------------------------------------

//  setCell(
//   worksheet.getCell(row, 9),
//   "Sched D (1)",
//   {
//     bold: true,
//     underline: true,
//     align: "center",
//     color: "FFFFFF",
//     fill: "1D4ED8",
//   },
// );

//     worksheet.getCell(row, 9).font = {
//       name: "Arial",
//       size: 9,
//       bold: true,
//       color: { argb: "0563C1" },
//       underline: true,
//     };

//     row++;

//     // ----------------------------------------------------------
//     // Reference: Sched D (2)
//     // Separate row exactly like JSX
//     // ----------------------------------------------------------

//     setCell(
//       worksheet.getCell(row, 9),
//       "Sched D (2)",
//       {
//         bold: true,
//         underline: true,
//         align: "center",
//         color: "FFFFFF",
//     fill: "1D4ED8",
//       },
//     );

//     worksheet.getCell(row, 9).font = {
//       name: "Arial",
//       size: 9,
//       bold: true,
//       color: { argb: "0563C1" },
//       underline: true,
//     };

//     row++;
//   }

//   // ============================================================
//   // FRINGE ALLOCATION
//   // ============================================================

//   if (includeFringe) {
//     fringeRow = row;

//     // Same values as JSX
//     setCell(
//       worksheet.getCell(row, 2),
//       "ADD: Fringe Allocation",
//       {
//         bold: true,
//       },
//     );

//     // Empty Amount column
//     setCell(
//       worksheet.getCell(row, 4),
//       "",
//       {
//         align: "right",
//         fill: YELLOW,
//       },
//     );

//     // Total per G/L
//     setCell(
//       worksheet.getCell(row, 5),
//       Number(data.fringeAllocation || 0),
//       {
//         align: "right",
//         fill: YELLOW,
//       },
//     );

//     // Adjustment
//     setCell(
//       worksheet.getCell(row, 6),
//       0,
//       {
//         align: "right",
//         fill: CYAN,
//       },
//     );

//     // Claimed
//     setCell(
//       worksheet.getCell(row, 7),
//       Number(data.fringeAllocation || 0),
//       {
//         align: "right",
//         fill: YELLOW,
//       },
//     );

//     worksheet.getCell(row, 5).numFmt =
//       "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(row, 6).numFmt =
//       "#,##0.00;(#,##0.00);-";

//     worksheet.getCell(row, 7).numFmt =
//       "#,##0.00;(#,##0.00);-";

//     // ----------------------------------------------------------
//     // Fringe reference
//     // ----------------------------------------------------------

//     setCell(
//       worksheet.getCell(row, 9),
//       "Fringe",
//       {
//         bold: true,
//         underline: true,
//         align: "center",
//       },
//     );

//     worksheet.getCell(row, 9).font = {
//       name: "Arial",
//       size: 9,
//       bold: true,
//       color: { argb: "0563C1" },
//       underline: true,
//     };

//     row++;
//   }

//   // ============================================================
//   // TOTAL OVERHEAD POOL
//   // ============================================================

//   const totalRow = row + 1;

//   setCell(
//     worksheet.getCell(totalRow, 3),
//     "Total Overhead Pool",
//     {
//       bold: true,
//     },
//   );

//   // ------------------------------------------------------------
//   // Total formula
//   // ------------------------------------------------------------

//   const totalReferences = [
//     `E${subtotalRow}`,
//     californiaRow
//       ? `E${californiaRow}`
//       : null,
//     fringeRow
//       ? `E${fringeRow}`
//       : null,
//   ].filter(Boolean);

//   const claimedReferences = [
//     `G${subtotalRow}`,
//     californiaRow
//       ? `G${californiaRow}`
//       : null,
//     fringeRow
//       ? `G${fringeRow}`
//       : null,
//   ].filter(Boolean);

//   worksheet.getCell(totalRow, 5).value = {
//     formula: totalReferences.join("+"),
//   };

//   worksheet.getCell(totalRow, 6).value = {
//     formula: `F${subtotalRow}`,
//   };

//   worksheet.getCell(totalRow, 7).value = {
//     formula: claimedReferences.join("+"),
//   };

//   // ============================================================
//   // TOTAL FORMATTING
//   // ============================================================

//   for (let col = 5; col <= 7; col++) {
//     const cell = worksheet.getCell(
//       totalRow,
//       col,
//     );

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };

//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     cell.numFmt =
//       "#,##0.00;(#,##0.00);-";
//   }

//   applyBottomBorder(
//     worksheet.getRow(totalRow),
//     2,
//     9,
//   );

//   // ============================================================
//   // EXPLANATORY NOTES
//   // ============================================================

//   const notesStartRow = totalRow + 3;

//   worksheet.mergeCells(
//     `B${notesStartRow}:I${notesStartRow}`,
//   );

//   setCell(
//     worksheet.getCell(`B${notesStartRow}`),
//     "Explanatory Notes:",
//     {
//       bold: true,
//       underline: true,
//     },
//   );

//   worksheet.mergeCells(
//     `B${notesStartRow + 2}:I${notesStartRow + 2}`,
//   );

//   setCell(
//     worksheet.getCell(
//       `B${notesStartRow + 2}`,
//     ),
//     "Explanation reflects the allocation of two separate Fringe benefit pools (D-1). AERO Fringe Pool 2 (D-1) has been linked directly to the Fringe Allocation section to ensure consistent treatment with Fringe Pool 1. These costs are allocated to the benefiting Overhead and G&A pools based on the specific labor categories assigned to each fringe group.",
//     {
//       size: 9,
//       wrapText: true,
//     },
//   );

//   worksheet.getRow(
//     notesStartRow + 2,
//   ).height = 55;

//   // ============================================================
//   // LEGEND
//   // ============================================================

//   const legendRow = notesStartRow + 5;

//   // Imported from Other Worksheet
//   setCell(
//     worksheet.getCell(`B${legendRow}`),
//     "Imported from Other Worksheet",
//     {
//       size: 9,
//       fill: YELLOW,
//     },
//   );

//   setCell(
//     worksheet.getCell(`C${legendRow}`),
//     "As Referenced",
//     {
//       size: 9,
//     },
//   );

//   // Formula
//   setCell(
//     worksheet.getCell(`B${legendRow + 1}`),
//     "Cell Contains a Formula",
//     {
//       size: 9,
//       fill: CYAN,
//     },
//   );

//   setCell(
//     worksheet.getCell(`C${legendRow + 1}`),
//     "Totals Claimed and Reconciling Differences",
//     {
//       size: 9,
//     },
//   );

//   // ============================================================
//   // COLUMN WIDTHS
//   // ============================================================

//   worksheet.columns = [
//     { width: 3 },
//     { width: 18 },
//     { width: 36 },
//     { width: 16 },
//     { width: 19 },
//     { width: 17 },
//     { width: 17 },
//     { width: 10 },
//     { width: 12 },
//   ];

//   // ============================================================
//   // PAGE SETUP
//   // ============================================================

//   worksheet.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   return worksheet;
// };

// // =========================================================
// // SCHEDULE C2
// // =========================================================

// const getScheduleC2Data = async () => {
//   const data = await getJson(
//     `${backendUrl}/api/TrialBalance/scheduleC2_cost?fycd=${FISCAL_YEAR}`,
//   );

//   const rows = getCAccountRows(data.accounts || [], false);

//   const amounts = data.amounts || [];

//   const california = amounts.find((x) =>
//     x.name?.toLowerCase().includes("california intermediate"),
//   );

//   return {
//     rows,
//     californiaIntermediate: california?.amount || 0,
//     fringeAllocation: 0,
//   };
// };

// // =========================================================
// // SCHEDULE C6
// // =========================================================

// const getScheduleC6Data = async () => {
//   const data = await getJson(
//     `${backendUrl}/api/TrialBalance/scheduleC6_cost?fycd=${FISCAL_YEAR}`,
//   );

//   const rows = getCAccountRows(data.accounts || [], true);

//   return {
//     rows,
//     californiaIntermediate: 0,
//     fringeAllocation: data.fringeAllocation?.endingBalance || 0,
//   };
// };

// //Schedule D1

// async function getScheduleD1Data(fiscalYear = FISCAL_YEAR) {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/scheduleD1_cost?fycd=${fiscalYear}`,
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Schedule D (1) API failed: HTTP ${response.status}`,
//     );
//   }

//   const data = await response.json();

//   // =========================================================
//   // ACCOUNTS
//   // Same mapping as SchedD1.jsx
//   // =========================================================

//   const accounts = (data.accounts || []).map((item) => {
//     const perGL = item.endingBalance || 0;
//     const adjustment = 0;
//     const claimed = perGL + adjustment;

//     return {
//       account: item.acctId,
//       description: item.acctName
//         ? item.acctName.trim()
//         : "",
//       perGLRaw: perGL,
//       adjustmentRaw: adjustment,
//       claimedRaw: claimed,
//       notes: "",
//       reference: "",
//     };
//   });

//   // =========================================================
//   // ALLOCATION
//   // Same mapping as SchedD1.jsx
//   // =========================================================

//   const allocation = data.allocation || {};

//   const allocationData = {
//     rows: allocation.rows || [],

//     totals: {
//       totalBaseLaborDollars:
//         allocation.totalBaseLaborDollars || 0,

//       totalPercentage:
//         allocation.totalPercentage || 100,

//       totalClaimedExpenseAllocation:
//         allocation.totalClaimedExpenseAllocation || 0,

//       totalAllocationBasedOnGlAmounts:
//         allocation.totalAllocationBasedOnGlAmounts || 0,
//     },
//   };

//   return {
//     accounts,
//     allocation: allocationData,
//   };
// }

// // =============================================================
// // SCHEDULE D (1)
// // =============================================================

// async function addScheduleD1(
//   workbook,
//   {
//     sheetName = "SCHEDULE D (1)",
//     scheduleName = "SCHEDULE D (1)",
//     sectionTitle = "AERO Fringe",
//     companyName = "",
//     companyAddress = "",
//     getData = getScheduleD1Data,
//   } = {},
// ) {
//   // =========================================================
//   // GET DATA FROM SAME API USED BY JSX
//   // =========================================================

//   const { accounts, allocation } =
//     await getData(FISCAL_YEAR);

//   // =========================================================
//   // WORKSHEET
//   // =========================================================

//   const worksheet =
//     workbook.addWorksheet(sheetName);

//   worksheet.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   // =========================================================
//   // PAGE SETUP
//   // =========================================================

//   worksheet.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,

//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   // =========================================================
//   // COLUMN WIDTHS
//   //
//   // A:F  = Main/allocation table
//   // G    = TO
//   // H    = Reference button
//   // =========================================================

//   worksheet.columns = [
//     { width: 22 }, // A
//     { width: 30 }, // B
//     { width: 17 }, // C
//     { width: 15 }, // D
//     { width: 18 }, // E
//     { width: 18 }, // F
//     { width: 8 },  // G - TO
//     { width: 16 }, // H - Reference
//   ];

//   // =========================================================
//   // COLORS
//   // =========================================================

//   const YELLOW = "FFFF00";
//   const CYAN = "28C3C8";
//   const BLACK = "000000";
//   const WHITE = "FFFFFF";
//   const BLUE = "1717B9";

//   // =========================================================
//   // BORDERS
//   // =========================================================

//   const thinBlackBorder = {
//     style: "thin",
//     color: {
//       argb: BLACK,
//     },
//   };

//   // =========================================================
//   // HELPERS
//   // =========================================================

//   const formatNumber = (value) => {
//     if (
//       value === null ||
//       value === undefined ||
//       Number.isNaN(Number(value)) ||
//       Number(value) === 0
//     ) {
//       return "-";
//     }

//     return Math.round(Number(value));
//   };

//   const setFont = (
//     cell,
//     options = {},
//   ) => {
//     cell.font = {
//       name: "Arial",
//       size: 9,
//       color: {
//         argb: BLACK,
//       },
//       ...options,
//     };
//   };

//   const setCenter = (cell) => {
//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };
//   };

//   const setRight = (cell) => {
//     cell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };
//   };

//   const setLeft = (cell) => {
//     cell.alignment = {
//       horizontal: "left",
//       vertical: "middle",
//       wrapText: true,
//     };
//   };

//   const setYellow = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: YELLOW,
//       },
//     };
//   };

//   const setCyan = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };
//   };

//   // =========================================================
//   // BLUE REFERENCE BUTTON
//   //
//   // Same concept as:
//   //
//   // <AllocationReference>
//   //   Sched B
//   // </AllocationReference>
//   //
//   // React:
//   // bg-[#1717b9]
//   // text-white
//   // font-bold
//   // underline
//   // =========================================================

//   const setBlue = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: BLUE,
//       },
//     };

//     cell.font = {
//       name: "Arial",
//       size: 9,
//       bold: true,
//       underline: true,
//       color: {
//         argb: WHITE,
//       },
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: false,
//     };

//     cell.border = {
//       top: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       bottom: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       left: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       right: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//     };
//   };

//   // =========================================================
//   // HATCHED CELL
//   //
//   // React:
//   // backgroundColor: #1f1f1f
//   // radial-gradient(...)
//   //
//   // Excel uses its native hatch pattern.
//   // =========================================================

//   const setHatched = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "darkGrid",
//       fgColor: {
//         argb: "666666",
//       },
//       bgColor: {
//         argb: "1F1F1F",
//       },
//     };
//   };

//   // =========================================================
//   // REFERENCE ROW
//   //
//   // Produces:
//   //
//   //                         TO   [Sched B]
//   // =========================================================

//   const setToReference = (
//     row,
//     reference,
//   ) => {
//     const toCell =
//       worksheet.getCell(row, 7);

//     toCell.value = "TO";

//     setFont(toCell, {
//       bold: true,
//       size: 9,
//     });

//     toCell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     const referenceCell =
//       worksheet.getCell(row, 8);

//     referenceCell.value = reference;

//     setBlue(referenceCell);

//     referenceCell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };
//   };

//   // =========================================================
//   // HEADER
//   // =========================================================

//   // ---------------------------------------------------------
//   // LEFT HEADER
//   // ---------------------------------------------------------

//   worksheet.mergeCells("A1:B3");

//   worksheet.getCell("A1").value =
//     "This Schedule does not contain any links to\n" +
//     "other schedules.\n\n" +
//     "ICE MANUAL";

//   setFont(
//     worksheet.getCell("A1"),
//     {
//       size: 9,
//     },
//   );

//   setLeft(
//     worksheet.getCell("A1"),
//   );

//   // ---------------------------------------------------------
//   // COMPANY NAME
//   // ---------------------------------------------------------

//   worksheet.mergeCells("C1:F1");

//   worksheet.getCell("C1").value =
//     companyName;

//   setYellow(
//     worksheet.getCell("C1"),
//   );

//   setCenter(
//     worksheet.getCell("C1"),
//   );

//   setFont(
//     worksheet.getCell("C1"),
//     {
//       bold: true,
//       size: 11,
//     },
//   );

//   // ---------------------------------------------------------
//   // COMPANY ADDRESS
//   // ---------------------------------------------------------

//   worksheet.mergeCells("C2:F2");

//   worksheet.getCell("C2").value =
//     companyAddress;

//   setYellow(
//     worksheet.getCell("C2"),
//   );

//   setCenter(
//     worksheet.getCell("C2"),
//   );

//   setFont(
//     worksheet.getCell("C2"),
//     {
//       bold: true,
//       size: 11,
//     },
//   );

//   // ---------------------------------------------------------
//   // SCHEDULE NAME
//   // ---------------------------------------------------------

//   worksheet.getCell("H1").value =
//     scheduleName;

//   setFont(
//     worksheet.getCell("H1"),
//     {
//       bold: true,
//       size: 10,
//     },
//   );

//   setCenter(
//     worksheet.getCell("H1"),
//   );

//   // ---------------------------------------------------------
//   // ICE VERSION
//   // ---------------------------------------------------------

//   worksheet.getCell("H2").value =
//     "ICE (version 2.0.1h)";

//   setFont(
//     worksheet.getCell("H2"),
//     {
//       bold: true,
//       size: 9,
//     },
//   );

//   setCenter(
//     worksheet.getCell("H2"),
//   );

//   // =========================================================
//   // SECTION TITLE
//   // =========================================================

//   worksheet.mergeCells("B5:F5");

//   worksheet.getCell("B5").value =
//     `${sectionTitle} (final indirect cost pool)`;

//   setFont(
//     worksheet.getCell("B5"),
//     {
//       bold: true,
//       italic: true,
//       size: 11,
//     },
//   );

//   setCenter(
//     worksheet.getCell("B5"),
//   );

//   // ---------------------------------------------------------
//   // SECTION NAME
//   // ---------------------------------------------------------

//   worksheet.mergeCells("B6:F6");

//   worksheet.getCell("B6").value =
//     sectionTitle;

//   setYellow(
//     worksheet.getCell("B6"),
//   );

//   setCenter(
//     worksheet.getCell("B6"),
//   );

//   setFont(
//     worksheet.getCell("B6"),
//     {
//       bold: true,
//       size: 11,
//     },
//   );

//   // ---------------------------------------------------------
//   // FISCAL YEAR
//   // ---------------------------------------------------------

//   worksheet.mergeCells("B7:F7");

//   worksheet.getCell("B7").value =
//     `Fiscal Year End - 12/31/${FISCAL_YEAR}`;

//   setYellow(
//     worksheet.getCell("B7"),
//   );

//   setCenter(
//     worksheet.getCell("B7"),
//   );

//   setFont(
//     worksheet.getCell("B7"),
//     {
//       bold: true,
//       size: 11,
//     },
//   );

//   // =========================================================
//   // ACCOUNT TABLE HEADER
//   // =========================================================

//   let rowNumber = 9;

//   const accountHeaders = [
//     "ACCOUNT\nNUMBER",
//     "DESCRIPTION",
//     "PER G/L\n& TRIAL BAL/F.S",
//     "ADJUSTMENT",
//     "CLAIMED",
//     "",
//     "NOTES",
//     "REFERENCE",
//   ];

//   accountHeaders.forEach(
//     (header, index) => {
//       const cell =
//         worksheet.getCell(
//           rowNumber,
//           index + 1,
//         );

//       cell.value = header;

//       setFont(cell, {
//         bold: true,
//         size: 9,
//       });

//       setCenter(cell);

//       cell.border = {
//         bottom: thinBlackBorder,
//       };
//     },
//   );

//   worksheet.getRow(
//     rowNumber,
//   ).height = 32;

//   rowNumber++;

//   // =========================================================
//   // ACCOUNT DATA
//   // =========================================================

//   let totalPerGL = 0;
//   let totalAdjustment = 0;
//   let totalClaimed = 0;

//   accounts.forEach((row) => {
//     const currentRow =
//       worksheet.getRow(
//         rowNumber,
//       );

//     // Account
//     currentRow.getCell(1).value =
//       row.account || "";

//     // Description
//     currentRow.getCell(2).value =
//       row.description || "";

//     // Per GL
//     currentRow.getCell(3).value =
//       formatNumber(
//         row.perGLRaw,
//       );

//     // Adjustment
//     currentRow.getCell(4).value =
//       row.adjustmentRaw === 0
//         ? ""
//         : formatNumber(
//             row.adjustmentRaw,
//           );

//     // Claimed
//     currentRow.getCell(5).value =
//       formatNumber(
//         row.claimedRaw,
//       );

//     // Spacer
//     currentRow.getCell(6).value =
//       "";

//     // Notes
//     currentRow.getCell(7).value =
//       row.notes || "";

//     // Reference
//     currentRow.getCell(8).value =
//       row.reference || "";

//     // Alignment
//     setLeft(
//       currentRow.getCell(1),
//     );

//     setLeft(
//       currentRow.getCell(2),
//     );

//     setRight(
//       currentRow.getCell(3),
//     );

//     setRight(
//       currentRow.getCell(4),
//     );

//     setRight(
//       currentRow.getCell(5),
//     );

//     setLeft(
//       currentRow.getCell(7),
//     );

//     setLeft(
//       currentRow.getCell(8),
//     );

//     // Claimed = cyan
//     setCyan(
//       currentRow.getCell(5),
//     );

//     // Font
//     for (
//       let col = 1;
//       col <= 8;
//       col++
//     ) {
//       setFont(
//         currentRow.getCell(col),
//         {
//           size: 9,
//         },
//       );
//     }

//     totalPerGL += Number(
//       row.perGLRaw || 0,
//     );

//     totalAdjustment += Number(
//       row.adjustmentRaw || 0,
//     );

//     totalClaimed += Number(
//       row.claimedRaw || 0,
//     );

//     rowNumber++;
//   });

//   // =========================================================
//   // TOTAL SEPARATOR
//   // =========================================================

//   for (
//     let col = 3;
//     col <= 5;
//     col++
//   ) {
//     worksheet.getCell(
//       rowNumber,
//       col,
//     ).border = {
//       bottom: thinBlackBorder,
//     };
//   }

//   rowNumber++;

//   // =========================================================
//   // TOTAL
//   // =========================================================

//   worksheet.getCell(
//     rowNumber,
//     2,
//   ).value = "Total";

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       2,
//     ),
//     {
//       bold: true,
//       size: 9,
//     },
//   );

//   worksheet.getCell(
//     rowNumber,
//     3,
//   ).value =
//     formatNumber(
//       totalPerGL,
//     );

//   worksheet.getCell(
//     rowNumber,
//     4,
//   ).value =
//     totalAdjustment === 0
//       ? "-"
//       : formatNumber(
//           totalAdjustment,
//         );

//   worksheet.getCell(
//     rowNumber,
//     5,
//   ).value =
//     formatNumber(
//       totalClaimed,
//     );

//   for (
//     let col = 3;
//     col <= 5;
//     col++
//   ) {
//     setCyan(
//       worksheet.getCell(
//         rowNumber,
//         col,
//       ),
//     );

//     setRight(
//       worksheet.getCell(
//         rowNumber,
//         col,
//       ),
//     );

//     setFont(
//       worksheet.getCell(
//         rowNumber,
//         col,
//       ),
//       {
//         size: 9,
//       },
//     );
//   }

//   // =========================================================
//   // TOTAL W / ALLOC.
//   // =========================================================

//   rowNumber += 2;

//   worksheet.getCell(
//     rowNumber,
//     2,
//   ).value =
//     "Total W / Alloc.";

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       2,
//     ),
//     {
//       bold: true,
//       size: 9,
//     },
//   );

//   worksheet.getCell(
//     rowNumber,
//     3,
//   ).value =
//     formatNumber(
//       totalPerGL,
//     );

//   worksheet.getCell(
//     rowNumber,
//     4,
//   ).value =
//     totalAdjustment === 0
//       ? "-"
//       : formatNumber(
//           totalAdjustment,
//         );

//   worksheet.getCell(
//     rowNumber,
//     5,
//   ).value =
//     formatNumber(
//       totalClaimed,
//     );

//   for (
//     let col = 3;
//     col <= 5;
//     col++
//   ) {
//     setCyan(
//       worksheet.getCell(
//         rowNumber,
//         col,
//       ),
//     );

//     setRight(
//       worksheet.getCell(
//         rowNumber,
//         col,
//       ),
//     );

//     worksheet.getCell(
//       rowNumber,
//       col,
//     ).border = {
//       bottom: thinBlackBorder,
//     };

//     setFont(
//       worksheet.getCell(
//         rowNumber,
//         col,
//       ),
//       {
//         size: 9,
//       },
//     );
//   }

//   // ---------------------------------------------------------
//   // TO SCHED A
//   // ---------------------------------------------------------

//   setToReference(
//     rowNumber,
//     "Sched A",
//   );

//   // =========================================================
//   // ALLOCATION SECTION TITLE
//   // =========================================================

//   rowNumber += 4;

//   worksheet.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Allocation of Expenses Based on";

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       size: 9,
//     },
//   );

//   rowNumber++;

//   worksheet.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Straight-Time Labor Dollars";

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       size: 9,
//     },
//   );

//   rowNumber += 2;

//   // =========================================================
//   // ALLOCATION HEADER
//   // =========================================================

//   const allocationHeaders = [
//     "",
//     "Base\n$",
//     "% of\nTotal",
//     "Adjustments",
//     "Claimed\nExpense\nAllocation",
//     "Allocation\nof Amts per\nG/L",
//   ];

//   allocationHeaders.forEach(
//     (header, index) => {
//       const cell =
//         worksheet.getCell(
//           rowNumber,
//           index + 1,
//         );

//       cell.value = header;

//       setFont(cell, {
//         bold: true,
//         size: 9,
//       });

//       setCenter(cell);

//       cell.border = {
//         bottom: thinBlackBorder,
//       };
//     },
//   );

//   worksheet.getRow(
//     rowNumber,
//   ).height = 45;

//   rowNumber++;

//   // =========================================================
//   // SAME SECTIONS AS JSX
//   // =========================================================

//   const sections = [
//     {
//       title: "G & A",
//       navLabel: "Sched B",
//       items: [
//         {
//           label: "Amount",
//           nameMatch: "G & A",
//         },
//       ],
//     },

//     {
//       title: "O/H - OH - Onsite",
//       navLabel: "Sched C (1)",
//       items: [
//         {
//           label: "Indirect Labor",
//           nameMatch:
//             "Indirect labor",
//         },
//         {
//           label: "Direct Labor Amount",
//           nameMatch:
//             "Direct Labor Amount",
//         },
//         {
//           label: "Direct NonReim Labor",
//           nameMatch:
//             "Direct NonReim Labor",
//         },
//       ],
//     },

//     {
//       title: "O/H - OH - Offsite",
//       navLabel: "Sched C (2)",
//       items: [
//         {
//           label: "Amount",
//           nameMatch:
//             "O/H - OH - Offsite",
//         },
//       ],
//     },

//     {
//       title: "O/H - SM&H",
//       navLabel: "Sched C (6)",
//       items: [
//         {
//           label: "Amount",
//           nameMatch:
//             "O/H - SM&H",
//         },
//       ],
//     },

//     {
//       title:
//         "Alloc to Other Intermed. Pools:",
//       navLabel: "Sched D (2)",
//       items: [
//         {
//           label:
//             "California - Interm",
//           nameMatch:
//             "California",
//         },
//       ],
//     },
//   ];

//   // =========================================================
//   // FIND ALLOCATION ROW
//   // =========================================================

//   const findAllocationRow =
//     (item) => {
//       return (
//         allocation.rows.find(
//           (r) =>
//             r.subname
//               ?.toLowerCase()
//               .includes(
//                 item.nameMatch
//                   .toLowerCase(),
//               ) ||
//             r.name
//               ?.toLowerCase()
//               .includes(
//                 item.nameMatch
//                   .toLowerCase(),
//               ),
//         ) || {}
//       );
//     };

//   // =========================================================
//   // ALLOCATION SECTIONS
//   // =========================================================

//   sections.forEach(
//     (section) => {
//       const sectionRow =
//         worksheet.getRow(
//           rowNumber,
//         );

//       // -----------------------------------------------------
//       // YELLOW SECTION LABEL
//       // -----------------------------------------------------

//       sectionRow.getCell(
//         1,
//       ).value = section.title;

//       setYellow(
//         sectionRow.getCell(1),
//       );

//       setFont(
//         sectionRow.getCell(1),
//         {
//           bold: true,
//           size: 9,
//         },
//       );

//       setLeft(
//         sectionRow.getCell(1),
//       );

//       // -----------------------------------------------------
//       // HATCHED AREA B:F
//       // -----------------------------------------------------

//       for (
//         let col = 2;
//         col <= 6;
//         col++
//       ) {
//         setHatched(
//           sectionRow.getCell(
//             col,
//           ),
//         );
//       }

//       // -----------------------------------------------------
//       // TO + BLUE REFERENCE
//       // G:H
//       // -----------------------------------------------------

//       setToReference(
//         rowNumber,
//         section.navLabel,
//       );

//       sectionRow.height = 22;

//       rowNumber++;

//       // -----------------------------------------------------
//       // DATA SUB-ROWS
//       // -----------------------------------------------------

//       section.items.forEach(
//         (item) => {
//           const data =
//             findAllocationRow(
//               item,
//             );

//           const currentRow =
//             worksheet.getRow(
//               rowNumber,
//             );

//           // -------------------------------------------------
//           // LABEL
//           // -------------------------------------------------

//           currentRow.getCell(
//             1,
//           ).value = item.label;

//           setYellow(
//             currentRow.getCell(1),
//           );

//           setFont(
//             currentRow.getCell(1),
//             {
//               size: 9,
//             },
//           );

//           setLeft(
//             currentRow.getCell(1),
//           );

//           // -------------------------------------------------
//           // BASE
//           // -------------------------------------------------

//           currentRow.getCell(
//             2,
//           ).value =
//             formatNumber(
//               data.baseLaborDollars,
//             );

//           // -------------------------------------------------
//           // PERCENTAGE
//           // -------------------------------------------------

//           const percentage =
//             data.percentageOfTotal !==
//               undefined &&
//             data.percentageOfTotal !==
//               null
//               ? Number(
//                   data.percentageOfTotal,
//                 )
//               : 0;

//           currentRow.getCell(
//             3,
//           ).value =
//             percentage / 100;

//           currentRow.getCell(
//             3,
//           ).numFmt =
//             '0.00"%"';

//           // -------------------------------------------------
//           // ADJUSTMENTS
//           // -------------------------------------------------

//           currentRow.getCell(
//             4,
//           ).value =
//             data.adjustments
//               ? formatNumber(
//                   data.adjustments,
//                 )
//               : "";

//           // -------------------------------------------------
//           // CLAIMED
//           // -------------------------------------------------

//           currentRow.getCell(
//             5,
//           ).value =
//             formatNumber(
//               data.claimedExpenseAllocation,
//             );

//           // -------------------------------------------------
//           // ALLOCATION OF GL
//           // -------------------------------------------------

//           currentRow.getCell(
//             6,
//           ).value =
//             formatNumber(
//               data.allocationBasedOnGlAmounts,
//             );

//           // -------------------------------------------------
//           // ALIGNMENT
//           // -------------------------------------------------

//           for (
//             let col = 2;
//             col <= 6;
//             col++
//           ) {
//             setRight(
//               currentRow.getCell(
//                 col,
//               ),
//             );

//             setFont(
//               currentRow.getCell(
//                 col,
//               ),
//               {
//                 size: 9,
//               },
//             );
//           }

//           // -------------------------------------------------
//           // CYAN CELLS
//           // -------------------------------------------------

//           setCyan(
//             currentRow.getCell(3),
//           );

//           setCyan(
//             currentRow.getCell(5),
//           );

//           setCyan(
//             currentRow.getCell(6),
//           );

//           rowNumber++;
//         },
//       );
//     },
//   );

//   // =========================================================
//   // ALLOCATION TOTAL
//   // =========================================================

//   rowNumber++;

//   const totalAllocationRow =
//     worksheet.getRow(
//       rowNumber,
//     );

//   // ---------------------------------------------------------
//   // BASE
//   // ---------------------------------------------------------

//   totalAllocationRow.getCell(
//     2,
//   ).value =
//     formatNumber(
//       allocation.totals
//         .totalBaseLaborDollars,
//     );

//   // ---------------------------------------------------------
//   // PERCENTAGE
//   // ---------------------------------------------------------

//   const totalPercentage =
//     allocation.totals
//       .totalPercentage !==
//       undefined &&
//     allocation.totals
//       .totalPercentage !== null
//       ? Number(
//           allocation.totals
//             .totalPercentage,
//         )
//       : 100;

//   totalAllocationRow.getCell(
//     3,
//   ).value =
//     totalPercentage / 100;

//   totalAllocationRow.getCell(
//     3,
//   ).numFmt =
//     '0.00"%"';

//   // ---------------------------------------------------------
//   // ADJUSTMENT
//   // ---------------------------------------------------------

//   totalAllocationRow.getCell(
//     4,
//   ).value = "";

//   // ---------------------------------------------------------
//   // CLAIMED
//   // ---------------------------------------------------------

//   totalAllocationRow.getCell(
//     5,
//   ).value =
//     formatNumber(
//       allocation.totals
//         .totalClaimedExpenseAllocation,
//     );

//   // ---------------------------------------------------------
//   // GL
//   // ---------------------------------------------------------

//   totalAllocationRow.getCell(
//     6,
//   ).value =
//     formatNumber(
//       allocation.totals
//         .totalAllocationBasedOnGlAmounts,
//     );

//   // ---------------------------------------------------------
//   // TOTAL FORMATTING
//   // ---------------------------------------------------------

//   for (
//     let col = 2;
//     col <= 6;
//     col++
//   ) {
//     setCyan(
//       totalAllocationRow.getCell(
//         col,
//       ),
//     );

//     setRight(
//       totalAllocationRow.getCell(
//         col,
//       ),
//     );

//     totalAllocationRow.getCell(
//       col,
//     ).border = {
//       top: thinBlackBorder,
//       bottom: thinBlackBorder,
//     };

//     setFont(
//       totalAllocationRow.getCell(
//         col,
//       ),
//       {
//         bold: true,
//         size: 9,
//       },
//     );
//   }

//   // ---------------------------------------------------------
//   // TO SCHED A
//   // ---------------------------------------------------------

//   setToReference(
//     rowNumber,
//     "Sched A",
//   );

//   // =========================================================
//   // EXPLANATORY NOTES
//   // =========================================================

//   rowNumber += 3;

//   worksheet.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Explanatory Notes:";

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       bold: true,
//       underline: true,
//       size: 9,
//     },
//   );

//   rowNumber++;

//   worksheet.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     6,
//   );

//   worksheet.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "AERO Fringe and associated labors captured separately to burden the projects consistently.";

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       size: 9,
//     },
//   );

//   setLeft(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//   );

//   // =========================================================
//   // LEGEND
//   // =========================================================

//   rowNumber += 3;

//   // ---------------------------------------------------------
//   // LINKED TO OTHER WORKSHEET
//   // ---------------------------------------------------------

//   worksheet.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     3,
//   );

//   worksheet.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Linked to Other Worksheet";

//   setYellow(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//   );

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       size: 9,
//     },
//   );

//   rowNumber++;

//   // ---------------------------------------------------------
//   // FORMULA
//   // ---------------------------------------------------------

//   worksheet.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     3,
//   );

//   worksheet.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Cell Contains a Formula";

//   setCyan(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//   );

//   setFont(
//     worksheet.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       size: 9,
//     },
//   );

//   // =========================================================
//   // FINAL ROW HEIGHTS
//   // =========================================================

//   worksheet.getRow(1).height = 20;
//   worksheet.getRow(2).height = 20;
//   worksheet.getRow(5).height = 20;
//   worksheet.getRow(6).height = 20;
//   worksheet.getRow(7).height = 20;

//   // =========================================================
//   // RETURN
//   // =========================================================

//   return worksheet;
// }

// //schedule D (2)

// async function getScheduleD2Data(fiscalYear = 2025) {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/scheduleD2_cost?fycd=${fiscalYear}`,
//   );

//   if (!response.ok) {
//     throw new Error(`Schedule D (2) API failed: HTTP ${response.status}`);
//   }

//   const data = await response.json();

//   // =========================================================
//   // ACCOUNTS - SAME MAPPING AS JSX
//   // =========================================================

//   const accounts = (data.accounts || []).map((item) => {
//     const perGL = item.endingBalance || 0;
//     const adjustment = 0;
//     const claimed = perGL + adjustment;

//     return {
//       account: item.acctId,
//       description: item.acctName ? item.acctName.trim() : "",
//       amountRaw: perGL,
//       adjustmentRaw: adjustment,
//       claimedRaw: claimed,
//     };
//   });

//   // =========================================================
//   // ALLOCATION - SAME MAPPING AS JSX
//   // =========================================================

//   const allocation = data.allocation || {};

//   const allocationData = {
//     rows: allocation.rows || [],

//     totals: {
//       totalBaseLaborDollars: allocation.totalBaseLaborDollars || 0,

//       totalPercentage: allocation.totalPercentage || 100,

//       totalClaimedExpenseAllocation:
//         allocation.totalClaimedExpenseAllocation || 0,

//       totalAllocationBasedOnGlAmounts:
//         allocation.totalAllocationBasedOnGlAmounts || 0,
//     },

//     // IMPORTANT:
//     // This must come from API.
//     // Do NOT hard-code 437526.
//     fringeAllocationAmount: allocation.fringeAllocationAmount || 0,
//   };

//   return {
//     accounts,
//     allocation: allocationData,
//   };
// }

// async function addScheduleD2(
//   workbook,
//   {
//     fiscalYear = 2025,
//     companyName = "",
//     companyAddress = "",
//     getData = getScheduleD2Data,
//   } = {},
// ) {
//   const { accounts, allocation } = await getData(fiscalYear);

//   const worksheet = workbook.addWorksheet("SCHEDULE D (2)");

//   /* =========================================================
//      PAGE SETTINGS
//   ========================================================= */

//   worksheet.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   worksheet.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   /*
//    * A-H
//    *
//    * A Account
//    * B Description
//    * C Per GL
//    * D Adjustment
//    * E Claimed
//    * F spacer/formula area
//    * G Notes / TO
//    * H Reference / Schedule
//    */

//   worksheet.columns = [
//     { width: 16 },
//     { width: 30 },
//     { width: 16 },
//     { width: 14 },
//     { width: 16 },
//     { width: 5 },
//     { width: 15 },
//     { width: 15 },
//   ];

//   /* =========================================================
//      COLORS
//   ========================================================= */

//   const YELLOW = "FFFF00";
//   const CYAN = "29C5CA";
//   const BLACK = "000000";
//   const WHITE = "FFFFFF";
//   const BLUE = "1717B9";
//   const DARK = "1F1F1F";

//   const thinBorder = {
//     style: "thin",
//     color: {
//       argb: BLACK,
//     },
//   };

//   /* =========================================================
//      HELPERS
//   ========================================================= */

//   const formatNumber = (value) => {
//     if (
//       value === null ||
//       value === undefined ||
//       Number.isNaN(Number(value)) ||
//       Number(value) === 0
//     ) {
//       return "-";
//     }

//     return Math.round(Number(value));
//   };

//   const setFont = (cell, options = {}) => {
//     cell.font = {
//       name: "Arial",
//       size: 9,
//       color: {
//         argb: BLACK,
//       },
//       ...options,
//     };
//   };

//   const setCenter = (cell) => {
//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };
//   };

//   const setRight = (cell) => {
//     cell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//       wrapText: true,
//     };
//   };

//   const setLeft = (cell) => {
//     cell.alignment = {
//       horizontal: "left",
//       vertical: "middle",
//       wrapText: true,
//     };
//   };

//   const setYellow = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: YELLOW,
//       },
//     };
//   };

//   const setCyan = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };
//   };

//   const setBlue = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: BLUE,
//       },
//     };

//     cell.font = {
//       name: "Arial",
//       size: 9,
//       bold: true,
//       underline: "single",
//       color: {
//         argb: WHITE,
//       },
//     };

//     setCenter(cell);
//   };

//   const addBottomBorder = (cell) => {
//     cell.border = {
//       ...cell.border,
//       bottom: thinBorder,
//     };
//   };

//   const addTopBottomBorder = (cell) => {
//     cell.border = {
//       ...cell.border,
//       top: thinBorder,
//       bottom: thinBorder,
//     };
//   };

//   /* =========================================================
//      HATCHED CELL
//   ========================================================= */

//   const setHatched = (cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "darkGrid",
//       fgColor: {
//         argb: DARK,
//       },
//       bgColor: {
//         argb: "666666",
//       },
//     };
//   };

//   /* =========================================================
//      HEADER
//   ========================================================= */

//   worksheet.mergeCells("A1:B3");

//   worksheet.getCell("A1").value =
//   ["A1:B1", "A2:B2", "A3:B3"].forEach((range) => worksheet.mergeCells(range));
//   [
//     "Schedule D(2) is linked to the following",
//     "Schedule D(x)",
//     "ICE MANUAL",
//   ].forEach((label, index) => {
//     const cell = worksheet.getCell(index + 1, 1);
//     cell.value = label;
//     setFont(cell, { size: 9 });
//     setLeft(cell);
//   });

//   /* Company */

//   worksheet.mergeCells("C1:F1");

//   worksheet.getCell("C1").value = companyName;

//   setYellow(worksheet.getCell("C1"));

//   setCenter(worksheet.getCell("C1"));

//   setFont(worksheet.getCell("C1"), {
//     bold: true,
//     size: 11,
//   });

//   worksheet.mergeCells("C2:F2");

//   worksheet.getCell("C2").value = companyAddress;

//   setYellow(worksheet.getCell("C2"));

//   setCenter(worksheet.getCell("C2"));

//   setFont(worksheet.getCell("C2"), {
//     bold: true,
//     size: 11,
//   });

//   /* Schedule title */

//   worksheet.getCell("H1").value = "SCHEDULE D (2)";

//   setFont(worksheet.getCell("H1"), {
//     bold: true,
//     size: 10,
//   });

//   setCenter(worksheet.getCell("H1"));

//   worksheet.getCell("H2").value = "ICE (version 2.0.1h)";

//   setFont(worksheet.getCell("H2"), {
//     bold: true,
//     size: 9,
//   });

//   setCenter(worksheet.getCell("H2"));

//   /* Pool title */

//   worksheet.mergeCells("B5:F5");

//   worksheet.getCell("B5").value = "Intermediate Indirect Cost Pool";

//   setFont(worksheet.getCell("B5"), {
//     bold: true,
//     italic: true,
//     size: 11,
//   });

//   setCenter(worksheet.getCell("B5"));

//   worksheet.mergeCells("B6:F6");

//   worksheet.getCell("B6").value = "California Intermediate Ind. Pool";

//   setYellow(worksheet.getCell("B6"));

//   setCenter(worksheet.getCell("B6"));

//   setFont(worksheet.getCell("B6"), {
//     bold: true,
//     size: 11,
//   });

//   worksheet.mergeCells("B7:F7");

//   worksheet.getCell("B7").value = `Fiscal Year End - 12/31/${fiscalYear}`;

//   setYellow(worksheet.getCell("B7"));

//   setCenter(worksheet.getCell("B7"));

//   setFont(worksheet.getCell("B7"), {
//     bold: true,
//     size: 11,
//   });

//   /* =========================================================
//      ACCOUNT TABLE HEADER
//   ========================================================= */

//   const headerRow = 9;

//   const headers = [
//     "ACCOUNT\nNUMBER",
//     "DESCRIPTION",
//     "PER G/L\nTRIAL BAL/F.S",
//     "ADJUSTMENT",
//     "CLAIMED",
//     "",
//     "NOTES",
//     "REFERENCE",
//   ];

//   headers.forEach((header, index) => {
//     const cell = worksheet.getCell(headerRow, index + 1);

//     cell.value = header;

//     setFont(cell, {
//       bold: true,
//       size: 9,
//     });

//     setCenter(cell);

//     addBottomBorder(cell);
//   });

//   /* =========================================================
//      ACCOUNT DATA
//   ========================================================= */

//   let rowNumber = headerRow + 1;

//   let totalAmount = 0;
//   let totalAdjustment = 0;
//   let totalClaimed = 0;

//   accounts.forEach((row) => {
//     const currentRow = worksheet.getRow(rowNumber);

//     currentRow.getCell(1).value = row.account || "";

//     currentRow.getCell(2).value = row.description || "";

//     currentRow.getCell(3).value = formatNumber(row.amountRaw);

//     currentRow.getCell(4).value =
//       row.adjustmentRaw === 0 ? "" : formatNumber(row.adjustmentRaw);

//     currentRow.getCell(5).value = formatNumber(row.claimedRaw);

//     /* Same visual style as JSX */

//     setLeft(currentRow.getCell(1));
//     setLeft(currentRow.getCell(2));

//     setRight(currentRow.getCell(3));
//     setRight(currentRow.getCell(4));
//     setRight(currentRow.getCell(5));

//     setCyan(currentRow.getCell(5));
//     setCyan(currentRow.getCell(6));

//     for (let col = 1; col <= 8; col++) {
//       setFont(currentRow.getCell(col), {
//         size: 9,
//       });
//     }

//     totalAmount += Number(row.amountRaw || 0);

//     totalAdjustment += Number(row.adjustmentRaw || 0);

//     totalClaimed += Number(row.claimedRaw || 0);

//     rowNumber++;
//   });

//   /* =========================================================
//      TOTAL
//   ========================================================= */

//   for (let col = 3; col <= 6; col++) {
//     addTopBottomBorder(worksheet.getCell(rowNumber, col));
//   }

//   rowNumber++;

//   worksheet.getCell(rowNumber, 2).value = "Total";

//   setFont(worksheet.getCell(rowNumber, 2), {
//     bold: true,
//     size: 9,
//   });

//   worksheet.getCell(rowNumber, 3).value = formatNumber(totalAmount);

//   worksheet.getCell(rowNumber, 4).value = formatNumber(totalAdjustment);

//   worksheet.getCell(rowNumber, 5).value = formatNumber(totalClaimed);

//   for (let col = 3; col <= 6; col++) {
//     setCyan(worksheet.getCell(rowNumber, col));

//     setRight(worksheet.getCell(rowNumber, col));

//     setFont(worksheet.getCell(rowNumber, col), {
//       size: 9,
//     });
//   }

//   /* =========================================================
//      ADD: INTERMEDIATE POOL ALLOCATIONS
//   ========================================================= */

//   rowNumber++;

//   worksheet.getCell(rowNumber, 2).value = "ADD: Intermediate Pool Allocations";

//   setFont(worksheet.getCell(rowNumber, 2), {
//     bold: true,
//     size: 9,
//   });

//   for (let col = 4; col <= 6; col++) {
//     setHatched(worksheet.getCell(rowNumber, col));
//   }

//   /* =========================================================
//      FRINGE ALLOCATION
//      API VALUE ONLY
//   ========================================================= */

//   const fringeAllocationAmount = Number(allocation.fringeAllocationAmount || 0);

//   rowNumber++;

//   worksheet.getCell(rowNumber, 2).value = "ADD: Fringe Allocation";

//   setFont(worksheet.getCell(rowNumber, 2), {
//     bold: true,
//     size: 9,
//   });

//   worksheet.getCell(rowNumber, 3).value = formatNumber(fringeAllocationAmount);

//   worksheet.getCell(rowNumber, 4).value = "-";

//   worksheet.getCell(rowNumber, 5).value = formatNumber(fringeAllocationAmount);

//   setYellow(worksheet.getCell(rowNumber, 3));

//   setCyan(worksheet.getCell(rowNumber, 4));

//   setYellow(worksheet.getCell(rowNumber, 5));

//   setRight(worksheet.getCell(rowNumber, 3));

//   setRight(worksheet.getCell(rowNumber, 4));

//   setRight(worksheet.getCell(rowNumber, 5));

//   setCyan(worksheet.getCell(rowNumber, 6));

//   /* =========================================================
//      TOTAL WITH ALLOCATION
//   ========================================================= */

//   const totalWithAllocAmount = totalAmount + fringeAllocationAmount;

//   const totalWithAllocClaimed = totalClaimed + fringeAllocationAmount;

//   rowNumber++;

//   worksheet.getCell(rowNumber, 2).value = "Total W / Alloc.";

//   setFont(worksheet.getCell(rowNumber, 2), {
//     bold: true,
//     size: 9,
//   });

//   worksheet.getCell(rowNumber, 3).value = formatNumber(totalWithAllocAmount);

//   worksheet.getCell(rowNumber, 4).value = "-";

//   worksheet.getCell(rowNumber, 5).value = formatNumber(totalWithAllocClaimed);

//   for (let col = 3; col <= 6; col++) {
//     setCyan(worksheet.getCell(rowNumber, col));

//     setRight(worksheet.getCell(rowNumber, col));

//     worksheet.getCell(rowNumber, col).border = {
//       bottom: thinBorder,
//     };
//   }

//   /* ---------------------------------------------------------
//      FRINGE REFERENCE
//   --------------------------------------------------------- */

//   worksheet.getCell(rowNumber, 7).value = "Fringe";

//   setBlue(worksheet.getCell(rowNumber, 7));

//   /* ---------------------------------------------------------
//      TO SCHED A
//   --------------------------------------------------------- */

//   worksheet.getCell(rowNumber, 8).value = "TO Sched A";

//   setBlue(worksheet.getCell(rowNumber, 8));

//   /* =========================================================
//      ALLOCATION SECTION
//   ========================================================= */

//   rowNumber += 4;

//   worksheet.getCell(rowNumber, 1).value = "Allocation of Expenses Based on";

//   setFont(worksheet.getCell(rowNumber, 1), {
//     size: 9,
//   });

//   rowNumber++;

//   worksheet.getCell(rowNumber, 1).value = "Payroll";

//   setFont(worksheet.getCell(rowNumber, 1), {
//     size: 9,
//   });

//   rowNumber += 2;

//   /* =========================================================
//      ALLOCATION HEADER
//   ========================================================= */

//   const allocationHeaderRow = rowNumber;

//   const allocationHeaders = [
//     "",
//     "Base\n$",
//     "% of\nTotal",
//     "Adjustments",
//     "Claimed\nExpense\nAllocation",
//     "Allocation\nof Amts per\nG/L",
//     "",
//     "",
//   ];

//   allocationHeaders.forEach((header, index) => {
//     const cell = worksheet.getCell(allocationHeaderRow, index + 1);

//     cell.value = header;

//     setFont(cell, {
//       bold: true,
//       size: 9,
//     });

//     setCenter(cell);

//     addBottomBorder(cell);
//   });

//   rowNumber++;

//   /* =========================================================
//      SECTIONS
//   ========================================================= */

//   const sections = [
//     {
//       title: "G & A",
//       navLabel: "Sched B",
//       items: [
//         {
//           label: "Amount",
//           nameMatch: "G&A",
//         },
//       ],
//     },

//     {
//       title: "O/H - OH - Onsite",
//       navLabel: "Sched C (1)",
//       items: [
//         {
//           label: "Direct Labor & Fringe Allocation Amount",
//           nameMatch: "O/H - OH - Onsite",
//         },
//       ],
//     },

//     {
//       title: "O/H - OH - Offsite",
//       navLabel: "Sched C (2)",
//       items: [
//         {
//           label: "Direct Labor & Fringe Allocation Amount",
//           nameMatch: "O/H - OH - Offsite",
//         },
//       ],
//     },

//     {
//       title: "O/H - SM&H",
//       navLabel: "Sched C (6)",
//       items: [
//         {
//           label: "Amount",
//           nameMatch: "O/H - SM&H",
//         },
//       ],
//     },
//   ];

//   const findAllocationRow = (item) => {
//     return (
//       allocation.rows.find(
//         (r) =>
//           r.name?.toLowerCase().includes(item.nameMatch.toLowerCase()) ||
//           r.subname?.toLowerCase().includes(item.nameMatch.toLowerCase()),
//       ) || {}
//     );
//   };

//   /* =========================================================
//      SECTION RENDER
//   ========================================================= */

//   sections.forEach((section) => {
//     /* -------------------------------------------------------
//        SECTION HEADER
//     ------------------------------------------------------- */

//     const sectionRow = worksheet.getRow(rowNumber);

//     sectionRow.getCell(1).value = section.title;

//     setYellow(sectionRow.getCell(1));

//     setFont(sectionRow.getCell(1), {
//       bold: true,
//       size: 9,
//     });

//     /*
//      * BLUE "TO" AREA
//      *
//      * G = TO
//      * H = Sched C(...)
//      */

//     sectionRow.getCell(7).value = "TO";

//     setFont(sectionRow.getCell(7), {
//       bold: true,
//       size: 9,
//     });

//     setCenter(sectionRow.getCell(7));

//     sectionRow.getCell(8).value = section.navLabel;

//     setBlue(sectionRow.getCell(8));

//     /*
//      * HATCHED AREA
//      *
//      * B-F
//      */

//     for (let col = 2; col <= 6; col++) {
//       setHatched(sectionRow.getCell(col));
//     }

//     rowNumber++;

//     /* -------------------------------------------------------
//        DATA ROWS
//     ------------------------------------------------------- */

//     section.items.forEach((item) => {
//       const data = findAllocationRow(item);

//       const currentRow = worksheet.getRow(rowNumber);

//       currentRow.getCell(1).value = item.label;

//       currentRow.getCell(2).value = formatNumber(data.baseLaborDollars);

//       currentRow.getCell(3).value =
//         data.percentageOfTotal !== undefined && data.percentageOfTotal !== null
//           ? `${Number(data.percentageOfTotal).toFixed(2)}%`
//           : "0.00%";

//       currentRow.getCell(4).value = data.adjustments
//         ? formatNumber(data.adjustments)
//         : "";

//       currentRow.getCell(5).value = formatNumber(data.claimedExpenseAllocation);

//       currentRow.getCell(6).value = formatNumber(
//         data.allocationBasedOnGlAmounts,
//       );

//       /* Label */

//       setYellow(currentRow.getCell(1));

//       setFont(currentRow.getCell(1), {
//         size: 9,
//       });

//       /* Numeric columns */

//       for (let col = 2; col <= 6; col++) {
//         setRight(currentRow.getCell(col));

//         setFont(currentRow.getCell(col), {
//           size: 9,
//         });
//       }

//       /* Formula cells */

//       setCyan(currentRow.getCell(3));

//       setCyan(currentRow.getCell(5));

//       setCyan(currentRow.getCell(6));

//       rowNumber++;
//     });
//   });

//   /* =========================================================
//      ALLOCATION TOTAL
//   ========================================================= */

//   rowNumber++;

//   const totalAllocationRow = worksheet.getRow(rowNumber);

//   totalAllocationRow.getCell(2).value = formatNumber(
//     allocation.totals.totalBaseLaborDollars,
//   );

//   totalAllocationRow.getCell(3).value =
//     allocation.totals.totalPercentage !== undefined
//       ? `${Number(allocation.totals.totalPercentage).toFixed(2)}%`
//       : "100.00%";

//   totalAllocationRow.getCell(5).value = formatNumber(
//     allocation.totals.totalClaimedExpenseAllocation,
//   );

//   totalAllocationRow.getCell(6).value = formatNumber(
//     allocation.totals.totalAllocationBasedOnGlAmounts,
//   );

//   for (let col = 2; col <= 6; col++) {
//     setCyan(totalAllocationRow.getCell(col));

//     setRight(totalAllocationRow.getCell(col));

//     addTopBottomBorder(totalAllocationRow.getCell(col));

//     setFont(totalAllocationRow.getCell(col), {
//       bold: true,
//       size: 9,
//     });
//   }

//   /* ---------------------------------------------------------
//      TO SCHED A
//      SAME POSITION AS JSX
//   --------------------------------------------------------- */

//   totalAllocationRow.getCell(7).value = "TO";

//   setFont(totalAllocationRow.getCell(7), {
//     bold: true,
//     size: 9,
//   });

//   setCenter(totalAllocationRow.getCell(7));

//   totalAllocationRow.getCell(8).value = "Sched A";

//   setBlue(totalAllocationRow.getCell(8));

//   /* =========================================================
//      EXPLANATORY NOTES
//   ========================================================= */

//   rowNumber += 3;

//   worksheet.getCell(rowNumber, 1).value = "Explanatory Notes:";

//   setFont(worksheet.getCell(rowNumber, 1), {
//     bold: true,
//     underline: "single",
//     size: 9,
//   });

//   rowNumber++;

//   worksheet.mergeCells(rowNumber, 1, rowNumber, 6);

//   worksheet.getCell(rowNumber, 1).value =
//     "To Split the California OH cost based on Direct Labor-Fringe on Direct Labor for Onsite and Offsite";

//   setFont(worksheet.getCell(rowNumber, 1), {
//     size: 9,
//   });

//   /* =========================================================
//      LEGEND
//   ========================================================= */

//   rowNumber += 3;

//   worksheet.mergeCells(rowNumber, 1, rowNumber, 3);

//   worksheet.getCell(rowNumber, 1).value = "Linked to Other Worksheet";

//   setYellow(worksheet.getCell(rowNumber, 1));

//   setFont(worksheet.getCell(rowNumber, 1), {
//     size: 9,
//   });

//   rowNumber++;

//   worksheet.mergeCells(rowNumber, 1, rowNumber, 3);

//   worksheet.getCell(rowNumber, 1).value = "Cell Contains a Formula";

//   setCyan(worksheet.getCell(rowNumber, 1));

//   setFont(worksheet.getCell(rowNumber, 1), {
//     size: 9,
//   });

//   return worksheet;
// }

// // =========================================================
// // SCHEDULE E - API DATA
// // =========================================================

// const getScheduleEData = async (year = 2025) => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/scheduleDE_cost?fyCd=${year}`
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Schedule E API failed: ${response.status}`
//     );
//   }

//   const data = await response.json();

//   const schedules = data.schedules || [];

//   // Same mapping as ScheduleE.jsx
//   const mapped = {};

//   schedules.forEach((sched) => {
//     mapped[sched.name] = {};

//     if (sched.rows) {
//       sched.rows.forEach((row) => {
//         mapped[sched.name][row.subname] = {
//           trialBal: row.trialBal,
//           adjustment: row.adjustment,
//           claimed: row.claimed,
//         };
//       });
//     }
//   });

//   return mapped;
// };

// // =========================================================
// // SCHEDULE E
// // =========================================================

// const addScheduleE = async (
//   workbook,
//   {
//     companyName = "",
//     companyAddress = "",
//     year = 2025,
//   } = {}
// ) => {
//   // =======================================================
//   // GET SAME API DATA AS JSX
//   // =======================================================

//   const data = await getScheduleEData(year);

//   // =======================================================
//   // CREATE WORKSHEET
//   // =======================================================

//   const ws = workbook.addWorksheet("SCHEDULE E");

//   // =======================================================
//   // PAGE SETUP
//   // =======================================================

//   ws.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.35,
//       bottom: 0.35,
//       header: 0.1,
//       footer: 0.1,
//     },
//   };

//   ws.properties.defaultRowHeight = 18;

//   // =======================================================
//   // COLUMN WIDTHS
//   // Same logical structure as:
//   //
//   // 245px | 165px | 165px | 165px | 80px | 145px
//   // =======================================================

//   ws.columns = [
//     { width: 34 }, // A - Label
//     { width: 21 }, // B - Per G/L
//     { width: 21 }, // C - Adjustment
//     { width: 21 }, // D - Claimed
//     { width: 10 }, // E - Notes
//     { width: 20 }, // F - Reference
//   ];

//   // =======================================================
//   // COLORS
//   // =======================================================

//   const YELLOW = "FFFF00";
//   const TEAL = "28C4C8";
//   const BLUE = "1717B8";
//   const LIGHT_BLUE = "CFE7E9";

//   const thinBlack = {
//     style: "thin",
//     color: {
//       argb: "000000",
//     },
//   };

//   const borderBottom = {
//     bottom: thinBlack,
//   };

//   const borderTopBottom = {
//     top: thinBlack,
//     bottom: thinBlack,
//   };

//   // =======================================================
//   // HELPERS
//   // =======================================================

//   // Same display behavior as JSX formatCurrency()
//   const formatCurrency = (value) => {
//     if (
//       value === null ||
//       value === undefined ||
//       value === "" ||
//       Number.isNaN(Number(value))
//     ) {
//       return "-";
//     }

//     if (Number(value) === 0) {
//       return "-";
//     }

//     return Number(value).toLocaleString("en-US", {
//       maximumFractionDigits: 0,
//     });
//   };

//   // Same display behavior as JSX formatRate()
//   const formatRate = (value) => {
//     if (
//       value === null ||
//       value === undefined ||
//       value === "" ||
//       Number.isNaN(Number(value))
//     ) {
//       return "-";
//     }

//     return `${Number(value).toFixed(2)}%`;
//   };

//   // Same getMetric() behavior as JSX
//   const getMetric = (
//     schedName,
//     subName,
//     isRate = false
//   ) => {
//     const sched =
//       data[schedName] ||
//       data[schedName?.replace("&", " & ")];

//     const item = sched?.[subName];

//     if (!item) {
//       return {
//         trialBal: "-",
//         adjustment: "-",
//         claimed: "-",
//       };
//     }

//     const formatter = isRate
//       ? formatRate
//       : formatCurrency;

//     return {
//       trialBal: formatter(item.trialBal),

//       adjustment:
//         item.adjustment === 0
//           ? "-"
//           : formatCurrency(item.adjustment),

//       claimed: formatter(item.claimed),
//     };
//   };

//   // -------------------------------------------------------
//   // Generic display cell
//   // -------------------------------------------------------

//   const setDisplayValue = (
//     cell,
//     value,
//     fill = null,
//     horizontal = "right"
//   ) => {
//     cell.value =
//       value === null ||
//       value === undefined
//         ? ""
//         : value;

//     cell.font = {
//       name: "Arial",
//       size: 10,
//     };

//     cell.alignment = {
//       horizontal,
//       vertical: "center",
//       wrapText: true,
//     };

//     if (fill) {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: fill,
//         },
//       };
//     }
//   };

//   // -------------------------------------------------------
//   // Label
//   // -------------------------------------------------------

//   const setLabel = (
//     cell,
//     value,
//     bold = false
//   ) => {
//     cell.value = value;

//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold,
//     };

//     cell.alignment = {
//       vertical: "center",
//       wrapText: true,
//     };
//   };

//   // -------------------------------------------------------
//   // Header text
//   // -------------------------------------------------------

//   const setHeader = (
//     cell,
//     value
//   ) => {
//     cell.value = value;

//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "center",
//       wrapText: true,
//     };
//   };

//   // -------------------------------------------------------
//   // Reference button
//   // -------------------------------------------------------

//   const setReference = (
//     cell,
//     value
//   ) => {
//     cell.value = value;

//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//       underline: true,
//       color: {
//         argb: "FFFFFF",
//       },
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "center",
//       wrapText: true,
//     };

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: BLUE,
//       },
//     };

//     cell.border = {
//       top: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       bottom: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       left: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       right: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//     };
//   };

//   // =======================================================
//   // TOP HEADER
//   // EXACT STRUCTURE BASED ON JSX
//   // =======================================================

//   // -------------------------------------------------------
//   // -------------------------------------------------------
//   // LEFT INFORMATION
//   // -------------------------------------------------------

//   [
//     "Schedule E is linked to the following",
//     "schedules:",
//     "Summary Sched H",
//     "Sched H, Contract Costs",
//     "Schedule C(x), Overhead",
//     "Schedule B, G&A",
//     "ICE MANUAL",
//   ].forEach((label, index) => {
//     setCell(ws.getCell(index + 1, 1), label, { fontSize: 9 });
//   });

//   for (let row = 1; row <= 7; row++) ws.getRow(row).height = 17;

//   // -------------------------------------------------------
//   // COMPANY NAME
//   // -------------------------------------------------------

//   ws.mergeCells("B1:E1");

//   ws.getCell("B1").value = companyName || EXPORT_COMPANY_NAME;

//   ws.getCell("B1").font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell("B1").alignment = {
//     horizontal: "center",
//     vertical: "center",
//   };

//   ws.getCell("B1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: YELLOW,
//     },
//   };

//   // -------------------------------------------------------
//   // COMPANY ADDRESS
//   // -------------------------------------------------------

//   ws.mergeCells("B2:E2");

//   ws.getCell("B2").value = companyAddress || EXPORT_COMPANY_ADDRESS;

//   ws.getCell("B2").font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell("B2").alignment = {
//     horizontal: "center",
//     vertical: "center",
//   };

//   ws.getCell("B2").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: YELLOW,
//     },
//   };

//   // -------------------------------------------------------
//   // TITLE
//   // -------------------------------------------------------

//   ws.mergeCells("B3:E3");

//   ws.getCell("B3").value =
//     "Claimed Allocation Bases by element of cost used to distribute indirect costs";

//   ws.getCell("B3").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("B3").alignment = {
//     horizontal: "center",
//     vertical: "center",
//     wrapText: true,
//   };

//   // -------------------------------------------------------
//   // FISCAL YEAR
//   // -------------------------------------------------------

//   ws.mergeCells("B4:E4");

//   ws.getCell("B4").value =
//     `Fiscal Year End - 12/31/${year}`;

//   ws.getCell("B4").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("B4").alignment = {
//     horizontal: "center",
//     vertical: "center",
//   };

//   ws.getCell("B4").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: YELLOW,
//     },
//   };

//   // -------------------------------------------------------
//   // SCHEDULE NAME
//   // -------------------------------------------------------

//   ws.getCell("F1").value =
//     "SCHEDULE E";

//   ws.getCell("F1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("F1").alignment = {
//     horizontal: "left",
//     vertical: "top",
//   };

//   ws.getCell("F2").value =
//     "ICE (version 2.0.1h)";

//   ws.getCell("F2").font = {
//     name: "Arial",
//     size: 10,
//   };

//   ws.getCell("F2").alignment = {
//     horizontal: "left",
//     vertical: "top",
//   };

//   // Row heights
//   ws.getRow(1).height = 22;
//   ws.getRow(2).height = 22;
//   ws.getRow(3).height = 25;
//   ws.getRow(4).height = 22;

//   // =======================================================
//   // COMMON POOL HEADER
//   // =======================================================

//   const addPoolHeader = (
//     rowNumber,
//     title
//   ) => {
//     const row = ws.getRow(rowNumber);

//     row.height = 34;

//     // Pool title
//     setHeader(
//       row.getCell(1),
//       title
//     );

//     row.getCell(1).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: LIGHT_BLUE,
//       },
//     };

//     row.getCell(1).font = {
//       name: "Arial",
//       size: 13,
//       bold: true,
//       color: {
//         argb: "0D369B",
//       },
//     };

//     // Per GL
//     setHeader(
//       row.getCell(2),
//       "PER G/L, F/S\n& TRIAL BAL/F.S"
//     );

//     // Adjustment
//     setHeader(
//       row.getCell(3),
//       "PER G/L\nADJUSTMENTS"
//     );

//     // Claimed
//     setHeader(
//       row.getCell(4),
//       "CLAIMED"
//     );

//     // Notes
//     setHeader(
//       row.getCell(5),
//       "Notes"
//     );

//     // Ref
//     setHeader(
//       row.getCell(6),
//       "Ref."
//     );

//     for (let c = 1; c <= 6; c++) {
//       row.getCell(c).border =
//         borderBottom;
//     }
//   };

//   // =======================================================
//   // NORMAL METRIC ROW
//   // =======================================================

//   const addMetricRow = (
//     rowNumber,
//     label,
//     metric,
//     {
//       claimedFill = YELLOW,
//       note = "",
//       reference = "",
//       bold = true,
//     } = {}
//   ) => {
//     const row = ws.getRow(
//       rowNumber
//     );

//     setLabel(
//       row.getCell(1),
//       label,
//       bold
//     );

//     // PER G/L
//     setDisplayValue(
//       row.getCell(2),
//       metric.trialBal
//     );

//     // ADJUSTMENT
//     setDisplayValue(
//       row.getCell(3),
//       metric.adjustment
//     );

//     // CLAIMED
//     setDisplayValue(
//       row.getCell(4),
//       metric.claimed,
//       claimedFill
//     );

//     // NOTES
//     setDisplayValue(
//       row.getCell(5),
//       note,
//       null,
//       "center"
//     );

//     // REFERENCE
//     if (reference) {
//       setReference(
//         row.getCell(6),
//         reference
//       );
//     }

//     for (let c = 1; c <= 6; c++) {
//       row.getCell(c).border =
//         borderBottom;
//     }
//   };

//   // =======================================================
//   // CLAIMED ONLY ROW
//   // Used where JSX only shows value in CLAIMED column
//   // =======================================================

//   const addClaimedOnlyRow = (
//     rowNumber,
//     label,
//     value,
//     {
//       fill = YELLOW,
//       note = "",
//       reference = "",
//       bold = false,
//     } = {}
//   ) => {
//     const row = ws.getRow(
//       rowNumber
//     );

//     setLabel(
//       row.getCell(1),
//       label,
//       bold
//     );

//     // B/C intentionally blank
//     row.getCell(2).value = "";
//     row.getCell(3).value = "";

//     // D = CLAIMED
//     setDisplayValue(
//       row.getCell(4),
//       value,
//       fill
//     );

//     // E = Notes
//     setDisplayValue(
//       row.getCell(5),
//       note,
//       null,
//       "center"
//     );

//     // F = Ref
//     if (reference) {
//       setReference(
//         row.getCell(6),
//         reference
//       );
//     }

//     for (let c = 1; c <= 6; c++) {
//       row.getCell(c).border =
//         borderBottom;
//     }
//   };

//   // =======================================================
//   // RATE ROW
//   // Same as JSX:
//   //
//   // Label | FS | blank | Claimed
//   // =======================================================

//   const addRateRow = (
//     rowNumber,
//     label,
//     metric
//   ) => {
//     const row = ws.getRow(
//       rowNumber
//     );

//     setLabel(
//       row.getCell(1),
//       label,
//       true
//     );

//     setDisplayValue(
//       row.getCell(2),
//       metric.trialBal,
//       TEAL
//     );

//     row.getCell(3).value = "";

//     setDisplayValue(
//       row.getCell(4),
//       metric.claimed,
//       TEAL
//     );

//     row.getCell(5).value = "";
//     row.getCell(6).value = "";

//     row.getCell(1).border =
//       borderBottom;
//   };

//   // =======================================================
//   // TOTAL ROW
//   // =======================================================

//   const addTotalRow = (
//     rowNumber,
//     label,
//     metric
//   ) => {
//     const row = ws.getRow(
//       rowNumber
//     );

//     setLabel(
//       row.getCell(1),
//       label,
//       true
//     );

//     setDisplayValue(
//       row.getCell(2),
//       metric.trialBal,
//       TEAL
//     );

//     setDisplayValue(
//       row.getCell(3),
//       metric.adjustment,
//       TEAL
//     );

//     setDisplayValue(
//       row.getCell(4),
//       metric.claimed,
//       TEAL
//     );

//     row.getCell(5).value = "";
//     row.getCell(6).value = "";

//     for (let c = 1; c <= 6; c++) {
//       row.getCell(c).border =
//         borderTopBottom;
//     }
//   };

//   // =======================================================
//   // OH - ONSITE
//   // =======================================================

//   let r = 6;

//   addPoolHeader(
//     r,
//     "OH - Onsite"
//   );

//   r++;

//   // Overhead Pool
//   addMetricRow(
//     r,
//     "Overhead Pool",
//     getMetric(
//       "OH Onsite",
//       "Overhead Pool"
//     ),
//     {
//       claimedFill: YELLOW,
//       reference: "Sched C (1)",
//     }
//   );

//   r += 2;

//   // Overhead Base label
//   setLabel(
//     ws.getCell(`A${r}`),
//     "Overhead Base:",
//     true
//   );

//   ws.getCell(`A${r}`).border =
//     borderBottom;

//   r++;

//   // Base rows
//   addMetricRow(
//     r,
//     "Total Contract Labor",
//     getMetric(
//       "OH Onsite",
//       "Total Contract Labor"
//     )
//   );
//   r++;

//   // IR&D - UI displays "-"
//   addMetricRow(
//     r,
//     "IR&D Labor",
//     {
//       trialBal: "-",
//       adjustment: "-",
//       claimed: "-",
//     }
//   );
//   r++;

//   // B&P - UI displays "-"
//   addMetricRow(
//     r,
//     "B&P Labor",
//     {
//       trialBal: "-",
//       adjustment: "-",
//       claimed: "-",
//     }
//   );
//   r++;

//   addMetricRow(
//     r,
//     "Fringe on D/L (before adjustments)",
//     getMetric(
//       "OH Onsite",
//       "Fringe on D/L (before adjustments)"
//     )
//   );
//   r++;

//   // Total Overhead Base
//   addTotalRow(
//     r,
//     "Total Overhead Base",
//     getMetric(
//       "OH Onsite",
//       "Total Overhead Base"
//     )
//   );

//   r++;

//   // Rate
//   addRateRow(
//     r,
//     "Overhead Rate",
//     getMetric(
//       "OH Onsite",
//       "Overhead Rate",
//       true
//     )
//   );

//   r += 2;

//   // Explanation
//   ws.mergeCells(
//     `A${r}:F${r}`
//   );

//   ws.getCell(`A${r}`).value =
//     "Overhead Base* - Straight time direct labor dollars of all contracts and projects including labor costs of IR&D/B&P projects plus fringe on direct labor.";

//   ws.getCell(`A${r}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${r}`).alignment = {
//     wrapText: true,
//     vertical: "center",
//   };

//   ws.getRow(r).height = 32;

//   // =======================================================
//   // OH - OFFSITE
//   // =======================================================

//   r += 2;

//   addPoolHeader(
//     r,
//     "OH - Offsite"
//   );

//   r++;

//   addMetricRow(
//     r,
//     "Overhead Pool",
//     getMetric(
//       "OH Offsite",
//       "Overhead Pool"
//     ),
//     {
//       claimedFill: YELLOW,
//       reference: "Sched C (2)",
//     }
//   );

//   r += 2;

//   setLabel(
//     ws.getCell(`A${r}`),
//     "Overhead Base:",
//     true
//   );

//   ws.getCell(`A${r}`).border =
//     borderBottom;

//   r++;

//   addMetricRow(
//     r,
//     "Total Contract Labor",
//     getMetric(
//       "OH Offsite",
//       "Total Contract Labor"
//     )
//   );
//   r++;

//   addMetricRow(
//     r,
//     "IR&D Labor",
//     {
//       trialBal: "-",
//       adjustment: "-",
//       claimed: "-",
//     }
//   );
//   r++;

//   addMetricRow(
//     r,
//     "B&P Labor",
//     {
//       trialBal: "-",
//       adjustment: "-",
//       claimed: "-",
//     }
//   );
//   r++;

//   addMetricRow(
//     r,
//     "Fringe on D/L (before adjustments)",
//     getMetric(
//       "OH Offsite",
//       "Fringe on D/L (before adjustments)"
//     )
//   );
//   r++;

//   addTotalRow(
//     r,
//     "Total Overhead Base",
//     getMetric(
//       "OH Offsite",
//       "Total Overhead Base"
//     )
//   );

//   r++;

//   addRateRow(
//     r,
//     "Overhead Rate",
//     getMetric(
//       "OH Offsite",
//       "Overhead Rate",
//       true
//     )
//   );

//   r += 2;

//   ws.mergeCells(
//     `A${r}:F${r}`
//   );

//   ws.getCell(`A${r}`).value =
//     "Overhead Base* - Straight time direct labor dollars of all contracts and projects including labor costs of IR&D/B&P projects plus fringe on direct labor.";

//   ws.getCell(`A${r}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${r}`).alignment = {
//     wrapText: true,
//     vertical: "center",
//   };

//   ws.getRow(r).height = 32;

//   // =======================================================
//   // SM&H
//   // =======================================================

//   r += 2;

//   addPoolHeader(
//     r,
//     "SM&H"
//   );

//   r++;

//   // Overhead Pool
//   addMetricRow(
//     r,
//     "Overhead Pool",
//     getMetric(
//       "SM&H",
//       "Overhead Pool"
//     ),
//     {
//       claimedFill: YELLOW,
//       reference: "Sched C (6)",
//     }
//   );

//   r += 2;

//   // Total Contract Material & Subcontract
//   addMetricRow(
//     r,
//     "Total Contract Material & Subcontract",
//     getMetric(
//       "SM&H",
//       "Total Contract Material & Subcontract"
//     ),
//     {
//       claimedFill: TEAL,
//       note: "2",
//       reference: "Summary Sched H",
//     }
//   );

//   r++;

//   // Total Overhead Base
//   addTotalRow(
//     r,
//     "Total Overhead Base",
//     getMetric(
//       "SM&H",
//       "Total Overhead Base"
//     )
//   );

//   r++;

//   // Overhead Rate
//   addRateRow(
//     r,
//     "Overhead Rate",
//     getMetric(
//       "SM&H",
//       "Overhead Rate",
//       true
//     )
//   );

//   r++;

//   // Fringe Pool
//   addMetricRow(
//     r,
//     "Fringe Pool",
//     getMetric(
//       "Fringe",
//       "Overhead Pool"
//     ),
//     {
//       claimedFill: YELLOW,
//       reference: "Fringe",
//     }
//   );

//   // =======================================================
//   // FRINGE POOL
//   // =======================================================

//   r += 2;

//   setLabel(
//     ws.getCell(`A${r}`),
//     "Fringe Pool:",
//     true
//   );

//   ws.getCell(`A${r}`).border =
//     borderBottom;

//   r++;

//   // G&A Labor
//   addMetricRow(
//     r,
//     "G&A Labor",
//     getMetric(
//       "Fringe",
//       "G&A Labor"
//     ),
//     {
//       claimedFill: TEAL,
//       reference: "Fringe",
//     }
//   );
//   r++;

//   // Direct Labor
//   addMetricRow(
//     r,
//     "Direct Labor",
//     getMetric(
//       "Fringe",
//       "Direct Labor"
//     ),
//     {
//       claimedFill: TEAL,
//       reference: '"',
//     }
//   );
//   r++;

//   // Indirect Labor - Overhead
//   addMetricRow(
//     r,
//     "Indirect Labor (Overhead Pools)",
//     getMetric(
//       "Fringe",
//       "Indirect Labor (Overhead Pools)"
//     ),
//     {
//       claimedFill: TEAL,
//       reference: '"',
//     }
//   );
//   r++;

//   // Indirect Labor - Intermediate
//   addMetricRow(
//     r,
//     "Indirect Labor (Intermediate Pools)",
//     getMetric(
//       "Fringe",
//       "Indirect Labor (Intermediate Pools)"
//     ),
//     {
//       claimedFill: TEAL,
//       reference: '"',
//     }
//   );
//   r++;

//   // Total Fringe Base
//   addTotalRow(
//     r,
//     "Total Fringe Base",
//     getMetric(
//       "Fringe",
//       "Total Overhead Base"
//     )
//   );

//   r++;

//   // Fringe Rate
//   addRateRow(
//     r,
//     "Fringe Rate",
//     getMetric(
//       "Fringe",
//       "Overhead Rate",
//       true
//     )
//   );

//   r++;

//   ws.mergeCells(
//     `A${r}:F${r}`
//   );

//   ws.getCell(`A${r}`).value =
//     "Fringe Base* - All labor dollars i.e. direct, indirect, and unallowable labor dollars (except AERO division).";

//   ws.getCell(`A${r}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${r}`).alignment = {
//     wrapText: true,
//     vertical: "center",
//   };

//   ws.getRow(r).height = 30;

//   // =======================================================
//   // AERO FRINGE
//   // =======================================================

//   r += 2;

//   addPoolHeader(
//     r,
//     "AERO Fringe"
//   );

//   r++;

//   // Fringe Pool
//   addMetricRow(
//     r,
//     "Fringe Pool",
//     getMetric(
//       "AERO Fringe",
//       "Overhead Pool"
//     ),
//     {
//       claimedFill: YELLOW,
//       note: "1",
//       reference: "Sched D (1)",
//     }
//   );

//   r += 2;

//   // Fringe Base
//   setLabel(
//     ws.getCell(`A${r}`),
//     "Fringe Base:",
//     true
//   );

//   ws.getCell(`A${r}`).border =
//     borderBottom;

//   r++;

//   // -------------------------------------------------------
//   // G&A LABOR
//   //
//   // JSX:
//   // B = blank
//   // D = "-"
//   // -------------------------------------------------------

//   addMetricRow(
//     r,
//     "G&A Labor",
//     {
//       trialBal: "",
//       adjustment: "",
//       claimed: "-",
//     },
//     {
//       claimedFill: TEAL,
//       reference: "Sched D (1)",
//     }
//   );

//   r++;

//   // Direct Labor
//   addMetricRow(
//     r,
//     "Direct Labor",
//     getMetric(
//       "AERO Fringe",
//       "Direct Labor"
//     ),
//     {
//       claimedFill: TEAL,
//       reference: '"',
//     }
//   );

//   r++;

//   // Indirect Labor - Overhead
//   addMetricRow(
//     r,
//     "Indirect Labor (Overhead Pools)",
//     getMetric(
//       "AERO Fringe",
//       "Indirect Labor (Overhead Pools)"
//     ),
//     {
//       claimedFill: TEAL,
//       reference: '"',
//     }
//   );

//   r++;

//   // -------------------------------------------------------
//   // Intermediate Pools
//   //
//   // JSX:
//   // B = blank
//   // D = "-"
//   // -------------------------------------------------------

//   addMetricRow(
//     r,
//     "Indirect Labor (Intermediate Pools)",
//     {
//       trialBal: "",
//       adjustment: "",
//       claimed: "-",
//     },
//     {
//       claimedFill: TEAL,
//     }
//   );

//   r++;

//   // Total Fringe Base
//   addTotalRow(
//     r,
//     "Total Fringe Base",
//     getMetric(
//       "AERO Fringe",
//       "Total Overhead Base"
//     )
//   );

//   r++;

//   // Fringe Rate
//   addRateRow(
//     r,
//     "Fringe Rate",
//     getMetric(
//       "AERO Fringe",
//       "Overhead Rate",
//       true
//     )
//   );

//   r++;

//   ws.mergeCells(
//     `A${r}:F${r}`
//   );

//   ws.getCell(`A${r}`).value =
//     "AERO Fringe Base* - All AERO associated labor dollars i.e. direct, indirect and unallowable labor dollars.";

//   ws.getCell(`A${r}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${r}`).alignment = {
//     wrapText: true,
//     vertical: "center",
//   };

//   ws.getRow(r).height = 30;

//   // =======================================================
//   // G&A POOL
//   // =======================================================

//   r += 2;

//   addPoolHeader(
//     r,
//     "G&A Pool"
//   );

//   r++;

//   // G&A Base header row
//   addMetricRow(
//     r,
//     "G & A Base:",
//     getMetric(
//       "G&A",
//       "G&A Base:"
//     ),
//     {
//       claimedFill: YELLOW,
//       reference: "Sched B",
//     }
//   );

//   r += 2;

//   // G&A Base label
//   setLabel(
//     ws.getCell(`A${r}`),
//     "G & A Base:",
//     true
//   );

//   ws.getCell(`A${r}`).border =
//     borderBottom;

//   r++;

//   // =======================================================
//   // G&A DIRECT COSTS
//   // =======================================================

//   addMetricRow(
//     r,
//     "Contract Labor",
//     getMetric(
//       "G&A",
//       "Contract Labor"
//     ),
//     {
//       claimedFill: YELLOW,
//     }
//   );
//   r++;

//   addMetricRow(
//     r,
//     "Contract Travel",
//     getMetric(
//       "G&A",
//       "Contract Travel"
//     ),
//     {
//       claimedFill: YELLOW,
//     }
//   );
//   r++;

//   addMetricRow(
//     r,
//     "Contract Material",
//     getMetric(
//       "G&A",
//       "Contract Material"
//     ),
//     {
//       claimedFill: YELLOW,
//     }
//   );
//   r++;

//   addMetricRow(
//     r,
//     "Other Direct Costs",
//     getMetric(
//       "G&A",
//       "Other Direct Costs"
//     ),
//     {
//       claimedFill: YELLOW,
//     }
//   );
//   r++;

//   addMetricRow(
//     r,
//     "Subcontracts",
//     getMetric(
//       "G&A",
//       "Subcontracts"
//     ),
//     {
//       claimedFill: YELLOW,
//     }
//   );
//   r++;

//   // =======================================================
//   // SUBTOTAL
//   // =======================================================

//   addTotalRow(
//     r,
//     "Subtotal = DIRECT COSTS",
//     getMetric(
//       "G&A",
//       "Subtotal = DIRECT COSTS"
//     )
//   );

//   r += 2;

//   // =======================================================
//   // GENERAL LEDGER SECTION
//   //
//   // JSX shows CLAIMED values only.
//   // =======================================================

//   addClaimedOnlyRow(
//     r,
//     "General Ledger Overhead (before adjustments)",
//     getMetric(
//       "G&A",
//       "General Ledger Overhead (before adjustments)"
//     ).claimed,
//     {
//       fill: YELLOW,
//       reference: "Sched C (x)",
//     }
//   );

//   r++;

//   addClaimedOnlyRow(
//     r,
//     "Fringe on Direct Labor (before adjustments)",
//     getMetric(
//       "G&A",
//       "Fringe on Direct Labor (before adjustments)"
//     ).claimed,
//     {
//       fill: YELLOW,
//       reference: "Sched H",
//     }
//   );

//   r++;

//   addClaimedOnlyRow(
//     r,
//     "IR&D/B&P Fringe transferred to G & A pool.",
//     "-",
//     {
//       fill: YELLOW,
//     }
//   );

//   r += 1;

//   // =======================================================
//   // DEDUCTIONS
//   // =======================================================

//   addClaimedOnlyRow(
//     r,
//     "Less: IR&D/B&P OH transferred to G & A pool.",
//     "-",
//     {
//       fill: YELLOW,
//       reference: "SCHED B",
//     }
//   );

//   r++;

//   addClaimedOnlyRow(
//     r,
//     "IR&D OH (at G/L rate)",
//     "-",
//     {
//       fill: YELLOW,
//     }
//   );

//   r++;

//   addClaimedOnlyRow(
//     r,
//     "B&P OH (at G/L rate)",
//     "",
//     {
//       fill: YELLOW,
//     }
//   );

//   r++;

//   addClaimedOnlyRow(
//     r,
//     "Less: Material related costs to arrive at Value Added base.",
//     "",
//     {
//       fill: YELLOW,
//     }
//   );

//   r++;

//   // Direct Material
//   addClaimedOnlyRow(
//     r,
//     "Direct Material",
//     getMetric(
//       "G&A",
//       "Direct Material"
//     ).claimed,
//     {
//       fill: YELLOW,
//     }
//   );

//   r++;

//   // Subcontractors
//   addClaimedOnlyRow(
//     r,
//     "Subcontracts",
//     getMetric(
//       "G&A",
//       "Subcontractors"
//     ).claimed,
//     {
//       fill: YELLOW,
//       reference: "SCHED B",
//     }
//   );

//   r += 1;

//   // =======================================================
//   // VALUE ADDED BASE
//   // =======================================================

//   const valueAddedMetric =
//     getMetric(
//       "G&A",
//       "G&A Base"
//     );

//   const valueAddedRow =
//     ws.getRow(r);

//   setLabel(
//     valueAddedRow.getCell(1),
//     "G&A Base - Value Added [excludes IR&D/B&P and COM]",
//     true
//   );

//   valueAddedRow.getCell(2).value =
//     "";

//   valueAddedRow.getCell(3).value =
//     "";

//   setDisplayValue(
//     valueAddedRow.getCell(4),
//     valueAddedMetric.claimed,
//     TEAL
//   );

//   valueAddedRow.getCell(5).value =
//     "";

//   valueAddedRow.getCell(6).value =
//     "";

//   for (let c = 1; c <= 6; c++) {
//     valueAddedRow.getCell(c).border =
//       borderBottom;
//   }

//   r += 2;

//   // =======================================================
//   // G&A RATE
//   // =======================================================

//   const gaRate =
//     getMetric(
//       "G&A",
//       "G&A Rate",
//       true
//     );

//   const gaRateRow =
//     ws.getRow(r);

//   setLabel(
//     gaRateRow.getCell(1),
//     "G&A Rate",
//     true
//   );

//   gaRateRow.getCell(1).border =
//     borderBottom;

//   gaRateRow.getCell(2).value =
//     "";

//   gaRateRow.getCell(3).value =
//     "";

//   setDisplayValue(
//     gaRateRow.getCell(4),
//     gaRate.claimed,
//     TEAL
//   );

//   gaRateRow.getCell(5).value =
//     "";

//   gaRateRow.getCell(6).value =
//     "";

//   // =======================================================
//   // EXPLANATORY NOTES
//   // =======================================================

//   r += 3;

//   ws.mergeCells(
//     `A${r}:F${r}`
//   );

//   ws.getCell(`A${r}`).value =
//     "Explanatory Notes:";

//   ws.getCell(`A${r}`).font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//     underline: true,
//   };

//   ws.getCell(`A${r}`).alignment = {
//     vertical: "center",
//   };

//   r++;

//   const notes = [
//     "1. AERO Fringe added as per Sched D (1) as it determines a final rate and not working as intermediary pool.",

//     "2. Adjustments were made to the Subcontractor and Material Handling (SM&H) base to exclude non-labor flow-through costs, specifically teammate travel, teammate ODC, and teammate fee.",

//     "This methodology ensures an equitable allocation of SM&H costs in accordance with FAR 31.203 and the Company's established accounting practices.",
//   ];

//   notes.forEach((note) => {
//     ws.mergeCells(
//       `A${r}:F${r}`
//     );

//     ws.getCell(`A${r}`).value =
//       note;

//     ws.getCell(`A${r}`).font = {
//       name: "Arial",
//       size: 9,
//     };

//     ws.getCell(`A${r}`).alignment = {
//       wrapText: true,
//       vertical: "center",
//     };

//     ws.getRow(r).height = 30;

//     r++;
//   });

//   // =======================================================
//   // LEGEND
//   // =======================================================

//   r += 2;

//   ws.mergeCells(
//     `A${r}:B${r}`
//   );

//   ws.getCell(`A${r}`).value =
//     "Imported from Other Worksheet";

//   ws.getCell(`A${r}`).font = {
//     name: "Arial",
//     size: 10,
//   };

//   ws.getCell(`A${r}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: YELLOW,
//     },
//   };

//   ws.getCell(`A${r}`).alignment = {
//     horizontal: "left",
//     vertical: "center",
//   };

//   r += 2;

//   ws.mergeCells(
//     `A${r}:B${r}`
//   );

//   ws.getCell(`A${r}`).value =
//     "Cell Contains a Formula";

//   ws.getCell(`A${r}`).font = {
//     name: "Arial",
//     size: 10,
//   };

//   ws.getCell(`A${r}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: TEAL,
//     },
//   };

//   ws.getCell(`A${r}`).alignment = {
//     horizontal: "left",
//     vertical: "center",
//   };

//   // =======================================================
//   // GENERAL FORMATTING
//   // =======================================================

//   ws.eachRow((row) => {
//     row.eachCell((cell) => {
//       if (!cell.font) {
//         cell.font = {
//           name: "Arial",
//           size: 10,
//         };
//       }

//       cell.alignment = {
//         ...cell.alignment,
//         vertical:
//           cell.alignment?.vertical ||
//           "center",
//       };
//     });
//   });

//   // =======================================================
//   // FREEZE
//   // =======================================================

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 5,
//     },
//   ];

//   // =======================================================
//   // PRINT AREA
//   // =======================================================

//   ws.pageSetup.printArea =
//     `A1:F${r}`;

//   return ws;
// };

// //Fringe

// // =============================================================
// // FRINGE API DATA
// // =============================================================

// const getFringeData = async (year = FISCAL_YEAR) => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/firing-allocation?fyCd=${year}`,
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Fringe API failed: ${response.status}`,
//     );
//   }

//   const data = await response.json();

//   // ===========================================================
//   // 1. FRINGE COST
//   // Same aggregation as Fringe.jsx
//   // ===========================================================

//   const rawFringeCost =
//     data.fringeCost || [];

//   const aggregatedGL =
//     rawFringeCost.reduce(
//       (acc, item) => {
//         const acctId =
//           item.acctId;

//         const endingBal =
//           Number(
//             item.endingBalance || 0,
//           );

//         if (!acc[acctId]) {
//           acc[acctId] = {
//             account: acctId,
//             description:
//               item.acctName
//                 ? item.acctName.trim()
//                 : "",
//             perGLRaw:
//               endingBal,
//             adjustmentRaw: 0,
//           };
//         } else {
//           acc[acctId].perGLRaw +=
//             endingBal;
//         }

//         return acc;
//       },
//       {},
//     );

//   const fringeCostData =
//     Object.values(
//       aggregatedGL,
//     ).map((row) => ({
//       ...row,

//       claimedRaw:
//         Number(row.perGLRaw || 0) +
//         Number(
//           row.adjustmentRaw || 0,
//         ),
//     }));

//   // ===========================================================
//   // 2. ALLOCATION ROWS
//   // ===========================================================

//   const allocationRows =
//     data.rows || [];

//   // ===========================================================
//   // 3. ALLOCATION TOTALS
//   // ===========================================================

//   const allocationTotals = {
//     totalBaseLaborDollars:
//       Number(
//         data.totalBaseLaborDollars ||
//           0,
//       ),

//     totalPercentage:
//       Number(
//         data.totalPercentage || 0,
//       ),

//     totalClaimedExpenseAllocation:
//       Number(
//         data.totalClaimedExpenseAllocation ||
//           0,
//       ),

//     totalAllocationBasedOnGlAmounts:
//       Number(
//         data.totalAllocationBasedOnGlAmounts ||
//           0,
//       ),
//   };

//   return {
//     fringeCostData,
//     allocationRows,
//     allocationTotals,
//   };
// };

// // =============================================================
// // ADD FRINGE SHEET
// // =============================================================

// const addFringe = async (
//   workbook,
//   {
//     year = FISCAL_YEAR,
//     companyName = "",
//     companyAddress = "",
//     sheetName = "Fringe",
//   } = {},
// ) => {
//   // ===========================================================
//   // API
//   // ===========================================================

//   const {
//     fringeCostData,
//     allocationRows,
//     allocationTotals,
//   } = await getFringeData(year);

//   // ===========================================================
//   // WORKSHEET
//   // ===========================================================

//   const ws =
//     workbook.addWorksheet(
//       sheetName,
//     );

//   ws.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   // ===========================================================
//   // COLUMN WIDTHS
//   //
//   // Detail:
//   // 250 / 180 / 150 / 120 / 140 / 80 / 160
//   //
//   // Allocation:
//   // 220 / 140 / 100 / 110 / 140 / 140
//   //
//   // G is used for TO / Reference area.
//   // ===========================================================

//   ws.columns = [
//     { width: 32 }, // A
//     { width: 24 }, // B
//     { width: 20 }, // C
//     { width: 16 }, // D
//     { width: 18 }, // E
//     { width: 12 }, // F
//     { width: 22 }, // G
//     { width: 16 }, // H
//   ];

//   // ===========================================================
//   // COLORS
//   // ===========================================================

//   const YELLOW =
//     "FFFF00";

//   const CYAN =
//     "27C4C7";

//   const CYAN_BORDER =
//     "08767B";

//   const BLUE =
//     "211FAE";

//   const BLACK =
//     "000000";

//   const WHITE =
//     "FFFFFF";

//   const DARK_HATCH =
//     "1F1F1F";

//   const LIGHT_HATCH =
//     "666666";

//   // ===========================================================
//   // BORDERS
//   // ===========================================================

//   const blackBorder = {
//     top: {
//       style: "thin",
//       color: {
//         argb: BLACK,
//       },
//     },
//     bottom: {
//       style: "thin",
//       color: {
//         argb: BLACK,
//       },
//     },
//     left: {
//       style: "thin",
//       color: {
//         argb: BLACK,
//       },
//     },
//     right: {
//       style: "thin",
//       color: {
//         argb: BLACK,
//       },
//     },
//   };

//   const cyanBorder = {
//     bottom: {
//       style: "thin",
//       color: {
//         argb: CYAN_BORDER,
//       },
//     },
//   };

//   // ===========================================================
//   // HELPERS
//   // ===========================================================

//   const setFont = (
//     cell,
//     {
//       bold = false,
//       underline = false,
//       size = 9,
//       color = BLACK,
//       italic = false,
//     } = {},
//   ) => {
//     cell.font = {
//       name: "Arial",
//       size,
//       bold,
//       underline,
//       italic,
//       color: {
//         argb: color,
//       },
//     };
//   };

//   const setCenter = (
//     cell,
//     wrapText = true,
//   ) => {
//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText,
//     };
//   };

//   const setLeft = (
//     cell,
//     wrapText = true,
//   ) => {
//     cell.alignment = {
//       horizontal: "left",
//       vertical: "middle",
//       wrapText,
//     };
//   };

//   const setRight = (cell) => {
//     cell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//       wrapText: false,
//     };
//   };

//   // ===========================================================
//   // NUMBER FORMAT
//   //
//   // Matches React:
//   // 0      => "-"
//   // positive => 1,234
//   // negative => (1,234)
//   // ===========================================================

//   const numberFormat =
//     "#,##0;(#,##0);-";

//   const formatNumberValue =
//     (value) => {
//       const numeric =
//         Number(value || 0);

//       return numeric;
//     };

//   // ===========================================================
//   // YELLOW LINKED CELL
//   // ===========================================================

//   const linkedCell = (
//     cell,
//     value,
//   ) => {
//     cell.value =
//       formatNumberValue(value);

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: YELLOW,
//       },
//     };

//     cell.numFmt =
//       numberFormat;

//     setRight(cell);

//     cell.border =
//       blackBorder;

//     setFont(cell, {
//       size: 9,
//     });
//   };

//   // ===========================================================
//   // CYAN FORMULA CELL
//   // ===========================================================

//   const formulaCell = (
//     cell,
//     value,
//   ) => {
//     cell.value =
//       formatNumberValue(value);

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };

//     cell.numFmt =
//       numberFormat;

//     setRight(cell);

//     cell.border =
//       cyanBorder;

//     setFont(cell, {
//       size: 9,
//     });
//   };

//   // ===========================================================
//   // NORMAL NUMBER
//   // ===========================================================

//   const normalNumberCell = (
//     cell,
//     value,
//   ) => {
//     cell.value =
//       formatNumberValue(value);

//     cell.numFmt =
//       numberFormat;

//     setRight(cell);

//     cell.border =
//       blackBorder;

//     setFont(cell, {
//       size: 9,
//     });
//   };

//   // ===========================================================
//   // BLUE REFERENCE BUTTON
//   //
//   // Matches:
//   //
//   // bg-[#211fae]
//   // text-white
//   // font-bold
//   // underline
//   // ===========================================================

//   const setReferenceButton = (
//     cell,
//     text,
//   ) => {
//     cell.value = text;

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: BLUE,
//       },
//     };

//     cell.font = {
//       name: "Arial",
//       size: 9,
//       bold: true,
//       underline: true,
//       color: {
//         argb: WHITE,
//       },
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: false,
//     };

//     cell.border = {
//       top: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       bottom: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       left: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//       right: {
//         style: "thin",
//         color: {
//           argb: BLUE,
//         },
//       },
//     };
//   };

//   // ===========================================================
//   // TO + BLUE REFERENCE
//   //
//   // Excel:
//   //
//   // G = TO
//   // H = [Sched X]
//   // ===========================================================

//   const setToReference = (
//     rowNumber,
//     reference,
//   ) => {
//     const toCell =
//       ws.getCell(
//         rowNumber,
//         7,
//       );

//     toCell.value = "TO";

//     setFont(toCell, {
//       bold: false,
//       size: 9,
//     });

//     toCell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     const referenceCell =
//       ws.getCell(
//         rowNumber,
//         8,
//       );

//     setReferenceButton(
//       referenceCell,
//       reference,
//     );
//   };

//   // ===========================================================
//   // HATCHED CELL
//   //
//   // React:
//   //
//   // repeating-linear-gradient(
//   //   -45deg,
//   //   #1f1f1f 0px,
//   //   #1f1f1f 1px,
//   //   #666 1px,
//   //   #666 2px
//   // )
//   //
//   // Excel cannot reproduce the CSS gradient exactly,
//   // so use Excel's native hatch pattern.
//   // ===========================================================

//   const setHatched = (
//     cell,
//   ) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "darkGrid",
//       fgColor: {
//         argb: LIGHT_HATCH,
//       },
//       bgColor: {
//         argb: DARK_HATCH,
//       },
//     };

//     cell.border =
//       blackBorder;
//   };

//   // ===========================================================
//   // SCREEN 1
//   // FRINGE POOL DETAIL
//   // ===========================================================

//   // ===========================================================
//   // TOP HEADER
//   // ===========================================================

//   ws.mergeCells("A1:B1");
//   ws.mergeCells("A2:B2");
//   ws.mergeCells("A3:B3");
//   ws.mergeCells("A4:B4");

//   ws.getCell("A1").value =
//     "Schedule Fringe is linked to the following";

//   ws.getCell("A2").value =
//     "schedule(s):";

//   ws.getCell("A3").value =
//     "Schedule D (x)";

//   ws.getCell("A4").value =
//     "ICE MANUAL";

//   setFont(
//     ws.getCell("A1"),
//     {
//       size: 9,
//     },
//   );

//   setFont(
//     ws.getCell("A2"),
//     {
//       size: 9,
//     },
//   );

//   setFont(
//     ws.getCell("A3"),
//     {
//       size: 9,
//     },
//   );

//   setFont(
//     ws.getCell("A4"),
//     {
//       size: 9,
//       underline: true,
//       color: "0000AA",
//     },
//   );

//   setLeft(
//     ws.getCell("A1"),
//   );

//   setLeft(
//     ws.getCell("A2"),
//   );

//   setLeft(
//     ws.getCell("A3"),
//   );

//   setLeft(
//     ws.getCell("A4"),
//   );

//   // ===========================================================
//   // COMPANY / TITLE
//   // ===========================================================

//   ws.mergeCells("C1:E1");
//   ws.mergeCells("C2:E2");
//   ws.mergeCells("C4:E4");
//   ws.mergeCells("C5:E5");

//   const companyNameCell =
//     ws.getCell("C1");

//   companyNameCell.value =
//     companyName;

//   const companyAddressCell =
//     ws.getCell("C2");

//   companyAddressCell.value =
//     companyAddress;

//   const titleCell =
//     ws.getCell("C4");

//   titleCell.value =
//     "Fringe Pool";

//   const fiscalCell =
//     ws.getCell("C5");

//   fiscalCell.value =
//     `Fiscal Year End - 12/31/${year}`;

//   [
//     companyNameCell,
//     companyAddressCell,
//     titleCell,
//     fiscalCell,
//   ].forEach((cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: YELLOW,
//       },
//     };

//     setFont(cell, {
//       bold: true,
//       size: 10,
//     });

//     setCenter(cell);
//   });

//   // ===========================================================
//   // RIGHT HEADER
//   // ===========================================================

//   ws.mergeCells("F1:H1");
//   ws.mergeCells("F2:H2");

//   ws.getCell("F1").value =
//     "SCHEDULE Fringe";

//   ws.getCell("F2").value =
//     "ICE (version 2.0.1h)";

//   setFont(
//     ws.getCell("F1"),
//     {
//       bold: true,
//       size: 9,
//     },
//   );

//   setFont(
//     ws.getCell("F2"),
//     {
//       bold: true,
//       size: 9,
//     },
//   );

//   setCenter(
//     ws.getCell("F1"),
//   );

//   setCenter(
//     ws.getCell("F2"),
//   );

//   // ===========================================================
//   // DETAIL TABLE HEADER
//   // ===========================================================

//   let rowNumber = 8;

//   const detailHeaders = [
//     "ACCOUNT\nNUMBER",
//     "DESCRIPTION",
//     "PER G/L\n& TRIAL BAL/FS",
//     "ADJUSTMENT",
//     "CLAIMED",
//     "NOTES",
//     "REFERENCE",
//   ];

//   detailHeaders.forEach(
//     (header, index) => {
//       const cell =
//         ws.getCell(
//           rowNumber,
//           index + 1,
//         );

//       cell.value =
//         header;

//       setFont(cell, {
//         bold: true,
//         size: 9,
//       });

//       setCenter(cell);

//       cell.border = {
//         bottom: {
//           style: "thin",
//           color: {
//             argb: BLACK,
//           },
//         },
//       };
//     },
//   );

//   ws.getRow(
//     rowNumber,
//   ).height = 35;

//   rowNumber++;

//   // ===========================================================
//   // DETAIL DATA
//   // ===========================================================

//   fringeCostData.forEach(
//     (row) => {
//       const excelRow =
//         ws.getRow(
//           rowNumber,
//         );

//       // -------------------------------------------------------
//       // ACCOUNT
//       // -------------------------------------------------------

//       excelRow.getCell(1).value =
//         row.account || "";

//       setLeft(
//         excelRow.getCell(1),
//       );

//       setFont(
//         excelRow.getCell(1),
//         {
//           size: 9,
//         },
//       );

//       // -------------------------------------------------------
//       // DESCRIPTION
//       // -------------------------------------------------------

//       excelRow.getCell(2).value =
//         row.description || "";

//       setLeft(
//         excelRow.getCell(2),
//       );

//       setFont(
//         excelRow.getCell(2),
//         {
//           size: 9,
//         },
//       );

//       // -------------------------------------------------------
//       // PER G/L
//       //
//       // API-linked = yellow
//       // -------------------------------------------------------

//       linkedCell(
//         excelRow.getCell(3),
//         row.perGLRaw,
//       );

//       // -------------------------------------------------------
//       // ADJUSTMENT
//       //
//       // JSX renders blank because adjustment is 0
//       // -------------------------------------------------------

//       excelRow.getCell(4).value =
//         "";

//       excelRow.getCell(4).border =
//         blackBorder;

//       // -------------------------------------------------------
//       // CLAIMED
//       //
//       // Formula = Per GL + Adjustment
//       // -------------------------------------------------------

//       formulaCell(
//         excelRow.getCell(5),
//         row.claimedRaw,
//       );

//       // -------------------------------------------------------
//       // NOTES
//       // -------------------------------------------------------

//       excelRow.getCell(6).value =
//         "";

//       excelRow.getCell(6).border =
//         blackBorder;

//       // -------------------------------------------------------
//       // REFERENCE
//       // -------------------------------------------------------

//       excelRow.getCell(7).value =
//         "";

//       excelRow.getCell(7).border =
//         blackBorder;

//       rowNumber++;
//     },
//   );

//   // ===========================================================
//   // DETAIL TOTALS
//   // ===========================================================

//   const totalPerGL =
//     fringeCostData.reduce(
//       (sum, row) =>
//         sum +
//         Number(
//           row.perGLRaw || 0,
//         ),
//       0,
//     );

//   const totalAdjustment =
//     fringeCostData.reduce(
//       (sum, row) =>
//         sum +
//         Number(
//           row.adjustmentRaw || 0,
//         ),
//       0,
//     );

//   const totalClaimed =
//     totalPerGL +
//     totalAdjustment;

//   // Small gap
//   rowNumber++;

//   const detailTotalRow =
//     ws.getRow(
//       rowNumber,
//     );

//   detailTotalRow.getCell(2)
//     .value = "Total";

//   setFont(
//     detailTotalRow.getCell(2),
//     {
//       bold: true,
//       size: 9,
//     },
//   );

//   // -------------------------------------------------------
//   // TOTAL PER GL
//   // -------------------------------------------------------

//   formulaCell(
//     detailTotalRow.getCell(3),
//     totalPerGL,
//   );

//   // -------------------------------------------------------
//   // TOTAL ADJUSTMENT
//   // -------------------------------------------------------

//   formulaCell(
//     detailTotalRow.getCell(4),
//     totalAdjustment,
//   );

//   // -------------------------------------------------------
//   // TOTAL CLAIMED
//   // -------------------------------------------------------

//   formulaCell(
//     detailTotalRow.getCell(5),
//     totalClaimed,
//   );

//   // -------------------------------------------------------
//   // NOTES
//   // -------------------------------------------------------

//   detailTotalRow.getCell(6).value =
//     "";

//   detailTotalRow.getCell(6).border =
//     blackBorder;

//   // -------------------------------------------------------
//   // TO SCHED A
//   // -------------------------------------------------------

//   setToReference(
//     rowNumber,
//     "Sched A",
//   );

//   ws.getRow(
//     rowNumber,
//   ).height = 22;

//   // ===========================================================
//   // SCREEN 2
//   // ALLOCATION OF EXPENSES
//   // ===========================================================

//   rowNumber += 3;

//   // ===========================================================
//   // ALLOCATION TITLE
//   // ===========================================================

//   ws.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     6,
//   );

//   ws.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Allocation of Expenses Based on";

//   setFont(
//     ws.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       size: 9,
//     },
//   );

//   setLeft(
//     ws.getCell(
//       rowNumber,
//       1,
//     ),
//   );

//   rowNumber++;

//   ws.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     6,
//   );

//   ws.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Straight-Time Labor Dollars";

//   setFont(
//     ws.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       size: 9,
//     },
//   );

//   setLeft(
//     ws.getCell(
//       rowNumber,
//       1,
//     ),
//   );

//   rowNumber += 2;

//   // ===========================================================
//   // ALLOCATION HEADER
//   // ===========================================================

//   const allocationHeaders = [
//     "",
//     "Base\nLabor Dollars",
//     "% of\nTotal",
//     "Adjustments",
//     "Claimed\nExpense\nAllocation",
//     "Allocation\nbased on\nPer G/L Amts",
//   ];

//   allocationHeaders.forEach(
//     (header, index) => {
//       const cell =
//         ws.getCell(
//           rowNumber,
//           index + 1,
//         );

//       cell.value =
//         header;

//       setFont(cell, {
//         bold: true,
//         size: 9,
//       });

//       setCenter(cell);

//       cell.border = {
//         bottom: {
//           style: "thin",
//           color: {
//             argb: BLACK,
//           },
//         },
//       };
//     },
//   );

//   ws.getRow(
//     rowNumber,
//   ).height = 45;

//   rowNumber++;

//   // ===========================================================
//   // SCHEDULE LABEL MAP
//   // Same mapping as React
//   // ===========================================================

//   const routeMap = {
//     "G&A Labor":
//       "sched_b",

//     "O/H - OH - Onsite":
//       "sched_c1",

//     "O/H - OH - Offsite":
//       "sched_c2",

//     "O/H - SM&L":
//       "sched_c3",

//     "AERO Fringe":
//       "sched_d1",

//     California:
//       "sched_c6",
//   };

//   const scheduleLabelMap = {
//     "G&A Labor":
//       "Sched B",

//     "O/H - OH - Onsite":
//       "Sched C (1)",

//     "O/H - OH - Offsite":
//       "Sched C (2)",

//     "O/H - SM&L":
//       "Sched C (3)",

//     "AERO Fringe":
//       "Sched D (1)",

//     California:
//       "Sched C (6)",
//   };

//   // ===========================================================
//   // ALLOCATION BODY
//   // ===========================================================

//   allocationRows.forEach(
//     (row, index) => {
//       const previousRow =
//         allocationRows[
//           index - 1
//         ];

//       const showHeader =
//         index === 0 ||
//         previousRow?.name !==
//           row.name;

//       // =======================================================
//       // CATEGORY HEADER
//       //
//       // React:
//       //
//       // [NAME] [HATCHED x5]
//       //
//       // TO [Sched X] outside grid
//       // =======================================================

//       if (showHeader) {
//         const categoryRow =
//           ws.getRow(
//             rowNumber,
//           );

//         // -----------------------------------------------------
//         // Yellow category name
//         // -----------------------------------------------------

//         categoryRow.getCell(
//           1,
//         ).value =
//           row.name || "";

//         categoryRow.getCell(
//           1,
//         ).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: {
//             argb: YELLOW,
//           },
//         };

//         setFont(
//           categoryRow.getCell(1),
//           {
//             bold: true,
//             size: 9,
//           },
//         );

//         setLeft(
//           categoryRow.getCell(1),
//         );

//         // -----------------------------------------------------
//         // Hatched B:F
//         // -----------------------------------------------------

//         for (
//           let col = 2;
//           col <= 6;
//           col++
//         ) {
//           setHatched(
//             categoryRow.getCell(
//               col,
//             ),
//           );
//         }

//         // -----------------------------------------------------
//         // TO + REFERENCE
//         // -----------------------------------------------------

//         const reference =
//           scheduleLabelMap[
//             row.name
//           ];

//         if (reference) {
//           setToReference(
//             rowNumber,
//             reference,
//           );
//         }

//         categoryRow.height =
//           22;

//         rowNumber++;
//       }

//       // =======================================================
//       // ALLOCATION SUB ROW
//       // =======================================================

//       const allocationRow =
//         ws.getRow(
//           rowNumber,
//         );

//       // -------------------------------------------------------
//       // SUBNAME
//       // -------------------------------------------------------

//       allocationRow.getCell(
//         1,
//       ).value =
//         row.subname || "";

//       setLeft(
//         allocationRow.getCell(1),
//       );

//       setFont(
//         allocationRow.getCell(1),
//         {
//           size: 9,
//         },
//       );

//       // -------------------------------------------------------
//       // BASE LABOR DOLLARS
//       //
//       // React normal cell
//       // -------------------------------------------------------

//       normalNumberCell(
//         allocationRow.getCell(2),
//         row.baseLaborDollars,
//       );

//       // -------------------------------------------------------
//       // PERCENTAGE
//       //
//       // React FormulaCell
//       // -------------------------------------------------------

//       const percentage =
//         Number(
//           row.percentageOfTotal ||
//             0,
//         );

//       formulaCell(
//         allocationRow.getCell(3),
//         percentage / 100,
//       );

//       allocationRow.getCell(
//         3,
//       ).numFmt =
//         '0.00"%"';

//       // -------------------------------------------------------
//       // ADJUSTMENT
//       // -------------------------------------------------------

//       if (
//         row.adjustments !==
//           null &&
//         row.adjustments !==
//           undefined &&
//         Number(
//           row.adjustments,
//         ) !== 0
//       ) {
//         normalNumberCell(
//           allocationRow.getCell(
//             4,
//           ),
//           row.adjustments,
//         );
//       } else {
//         allocationRow.getCell(
//           4,
//         ).value = "";

//         allocationRow.getCell(
//           4,
//         ).border =
//           blackBorder;
//       }

//       // -------------------------------------------------------
//       // CLAIMED EXPENSE ALLOCATION
//       // -------------------------------------------------------

//       formulaCell(
//         allocationRow.getCell(5),
//         row.claimedExpenseAllocation,
//       );

//       // -------------------------------------------------------
//       // ALLOCATION BASED ON GL
//       // -------------------------------------------------------

//       formulaCell(
//         allocationRow.getCell(6),
//         row.allocationBasedOnGlAmounts,
//       );

//       // -------------------------------------------------------
//       // G/H EMPTY FOR SUBROWS
//       // Reference lives on category header,
//       // exactly like the React layout.
//       // -------------------------------------------------------

//       allocationRow.getCell(
//         7,
//       ).value = "";

//       allocationRow.getCell(
//         8,
//       ).value = "";

//       rowNumber++;
//     },
//   );

//   // ===========================================================
//   // TOTAL ALLOCATION
//   // ===========================================================

//   rowNumber++;

//   const totalRow =
//     ws.getRow(
//       rowNumber,
//     );

//   // -----------------------------------------------------------
//   // TOTAL LABEL
//   // -----------------------------------------------------------

//   totalRow.getCell(
//     1,
//   ).value =
//     "Total";

//   setFont(
//     totalRow.getCell(1),
//     {
//       bold: true,
//       size: 9,
//     },
//   );

//   setLeft(
//     totalRow.getCell(1),
//   );

//   // -----------------------------------------------------------
//   // BASE LABOR
//   // -----------------------------------------------------------

//   formulaCell(
//     totalRow.getCell(2),
//     allocationTotals
//       .totalBaseLaborDollars,
//   );

//   // -----------------------------------------------------------
//   // TOTAL %
//   // -----------------------------------------------------------

//   formulaCell(
//     totalRow.getCell(3),
//     Number(
//       allocationTotals
//         .totalPercentage || 0,
//     ) / 100,
//   );

//   totalRow.getCell(
//     3,
//   ).numFmt =
//     '0.00"%"';

//   // -----------------------------------------------------------
//   // ADJUSTMENT
//   // React has empty cell
//   // -----------------------------------------------------------

//   totalRow.getCell(
//     4,
//   ).value = "";

//   // -----------------------------------------------------------
//   // CLAIMED
//   // -----------------------------------------------------------

//   formulaCell(
//     totalRow.getCell(5),
//     allocationTotals
//       .totalClaimedExpenseAllocation,
//   );

//   // -----------------------------------------------------------
//   // GL
//   // -----------------------------------------------------------

//   formulaCell(
//     totalRow.getCell(6),
//     allocationTotals
//       .totalAllocationBasedOnGlAmounts,
//   );

//   // -----------------------------------------------------------
//   // TO SCHED D (2)
//   // -----------------------------------------------------------

//   setToReference(
//     rowNumber,
//     "Sched D (2)",
//   );

//   totalRow.height =
//     22;

//   // ===========================================================
//   // EXPLANATORY NOTES
//   // ===========================================================

//   rowNumber += 3;

//   ws.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     8,
//   );

//   ws.getCell(
//     rowNumber,
//     1,
//   ).value =
//     "Explanatory Notes:";

//   setFont(
//     ws.getCell(
//       rowNumber,
//       1,
//     ),
//     {
//       bold: true,
//       underline: true,
//       size: 9,
//     },
//   );

//   setLeft(
//     ws.getCell(
//       rowNumber,
//       1,
//     ),
//   );

//   // ===========================================================
//   // LEGEND
//   // ===========================================================

//   rowNumber += 3;

//   // -----------------------------------------------------------
//   // LINKED
//   // -----------------------------------------------------------

//   ws.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     3,
//   );

//   const linkedLegend =
//     ws.getCell(
//       rowNumber,
//       1,
//     );

//   linkedLegend.value =
//     "Linked to Other Worksheet";

//   linkedLegend.fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: YELLOW,
//     },
//   };

//   setFont(
//     linkedLegend,
//     {
//       size: 9,
//     },
//   );

//   setLeft(
//     linkedLegend,
//   );

//   // -----------------------------------------------------------
//   // FORMULA
//   // -----------------------------------------------------------

//   rowNumber++;

//   ws.mergeCells(
//     rowNumber,
//     1,
//     rowNumber,
//     3,
//   );

//   const formulaLegend =
//     ws.getCell(
//       rowNumber,
//       1,
//     );

//   formulaLegend.value =
//     "Cell Contains a Formula";

//   formulaLegend.fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: CYAN,
//     },
//   };

//   setFont(
//     formulaLegend,
//     {
//       size: 9,
//     },
//   );

//   setLeft(
//     formulaLegend,
//   );

//   // ===========================================================
//   // ROW HEIGHTS
//   // ===========================================================

//   ws.getRow(1).height =
//     18;

//   ws.getRow(2).height =
//     18;

//   ws.getRow(3).height =
//     18;

//   ws.getRow(4).height =
//     18;

//   ws.getRow(5).height =
//     18;

//   // ===========================================================
//   // PAGE SETUP
//   // ===========================================================

//   ws.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,

//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   // ===========================================================
//   // PRINT OPTIONS
//   // ===========================================================

//   ws.pageSetup.horizontalDpi =
//     300;

//   ws.pageSetup.verticalDpi =
//     300;

//   // ===========================================================
//   // FREEZE
//   // ===========================================================

//   ws.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   return ws;
// };

// // Schedule G - 1

// const getScheduleG1Data = async () => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/scheduleDG1_cost?fyCd=2025`,
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch Schedule G-1 data. Status: ${response.status}`,
//     );
//   }

//   const data = await response.json();

//   const rows =
//     data?.schedules?.[0]?.rows
//       ?.filter((row) => !row.subname?.toLowerCase().includes("total"))
//       ?.map((row) => ({
//         subname: row.subname || "",
//         trialBal: Number(row.trialBal || 0),
//         claimed: Number(row.claimed || 0),
//       })) || [];

//   return rows;
// };

// const addScheduleG1 = async (workbook, { companyName, companyAddress }) => {
//   const rows = await getScheduleG1Data();

//   const worksheet = workbook.addWorksheet("SCHEDULE G-1");

//   worksheet.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   worksheet.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   // ---------------------------------------------------------
//   // Column widths
//   // ---------------------------------------------------------

//   worksheet.columns = [
//     { width: 32 }, // Cost Element
//     { width: 20 }, // Per General Ledger
//     { width: 20 }, // Per Job Cost Ledger
//     { width: 17 }, // Difference
//     { width: 10 }, // Notes
//     { width: 17 }, // Reference
//   ];

//   // ---------------------------------------------------------
//   // Styles
//   // ---------------------------------------------------------

//   const yellowFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FFFFFF00",
//     },
//   };

//   const formulaFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FF29C4C8",
//     },
//   };

//   const blueFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FF1719A8",
//     },
//   };

//   const blackBorder = {
//     style: "thin",
//     color: {
//       argb: "FF000000",
//     },
//   };

//   const moneyFormat = "$#,##0.00;($#,##0.00);-";

//   const baseFont = {
//     name: "Times New Roman",
//     size: 11,
//   };

//   const boldFont = {
//     name: "Times New Roman",
//     size: 11,
//     bold: true,
//   };

//   // ---------------------------------------------------------
//   // Top information
//   // ---------------------------------------------------------

//   worksheet.mergeCells("A1:B1");
//   worksheet.getCell("A1").value =
//     "Schedule G-1 is linked to the following schedule:";

//   worksheet.mergeCells("A2:B2");
//   worksheet.getCell("A2").value = "Schedule G, Reconciled to GL";

//   worksheet.getCell("A3").value = "ICE MANUAL";

//   worksheet.getCell("A3").font = {
//     ...baseFont,
//     color: {
//       argb: "FF0000CC",
//     },
//     underline: true,
//   };

//   // Company
//   worksheet.mergeCells("C3:D4");

//   const companyCell = worksheet.getCell("C3");
//   companyCell.value = `${companyName || ""}\n${companyAddress || ""}`;

//   companyCell.fill = yellowFill;
//   companyCell.font = boldFont;
//   companyCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // Schedule title
//   worksheet.mergeCells("E1:F3");

//   const scheduleTitle = worksheet.getCell("E1");
//   scheduleTitle.value = "SCHEDULE G-1\n(OPTIONAL)\nICE (version 2.0.1h)";

//   scheduleTitle.font = boldFont;
//   scheduleTitle.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // Main heading
//   worksheet.mergeCells("C6:D7");

//   const heading = worksheet.getCell("C6");
//   heading.value = "RECONCILIATION OF CLAIMED DIRECT\nCOSTS TO JOB COST LEDGER";

//   heading.font = boldFont;
//   heading.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // Fiscal year
//   worksheet.mergeCells("C8:D8");

//   const fiscalYearCell = worksheet.getCell("C8");
//   fiscalYearCell.value = "Fiscal Year End - 12/31/2025";
//   fiscalYearCell.fill = yellowFill;
//   fiscalYearCell.font = boldFont;
//   fiscalYearCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // ---------------------------------------------------------
//   // Table Header
//   // ---------------------------------------------------------

//   const headerRow = 10;

//   const headers = [
//     "Cost Element",
//     "Per General\nLedger",
//     "Per Job\nCost Ledger",
//     "Difference",
//     "Notes",
//     "Reference",
//   ];

//   headers.forEach((header, index) => {
//     const cell = worksheet.getCell(headerRow, index + 1);

//     cell.value = header;
//     cell.font = boldFont;
//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };

//     cell.border = {
//       bottom: blackBorder,
//     };
//   });

//   worksheet.getCell(headerRow, 1).alignment = {
//     horizontal: "left",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // Underline matching frontend
//   worksheet.getCell(headerRow, 1).font = {
//     ...boldFont,
//     underline: true,
//   };

//   worksheet.getCell(headerRow, 4).font = {
//     ...boldFont,
//     underline: true,
//   };

//   worksheet.getCell(headerRow, 5).font = {
//     ...baseFont,
//     underline: true,
//   };

//   worksheet.getCell(headerRow, 6).font = {
//     ...boldFont,
//     underline: true,
//   };

//   // ---------------------------------------------------------
//   // API rows
//   // ---------------------------------------------------------

//   let currentRow = headerRow + 1;

//   let totalGl = 0;
//   let totalJobCost = 0;

//   rows.forEach((item, index) => {
//     const glAmount = Number(item.trialBal || 0);
//     const jclAmount = Number(item.claimed || 0);
//     const difference = glAmount - jclAmount;

//     totalGl += glAmount;
//     totalJobCost += jclAmount;

//     const row = worksheet.getRow(currentRow);

//     // Cost Element
//     row.getCell(1).value = item.subname;

//     // Per General Ledger
//     row.getCell(2).value = glAmount;

//     // Per Job Cost Ledger
//     row.getCell(3).value = jclAmount;

//     // Difference
//     row.getCell(4).value = difference;

//     // Notes
//     row.getCell(5).value = "";

//     // Reference - only first row
//     if (index === 0) {
//       row.getCell(6).value = "Sched G";
//     }

//     // -------------------------------------------------------
//     // Styling
//     // -------------------------------------------------------

//     row.getCell(1).font = baseFont;
//     row.getCell(1).alignment = {
//       horizontal: "left",
//       vertical: "middle",
//     };

//     // Yellow = imported from worksheet
//     row.getCell(2).fill = yellowFill;
//     row.getCell(2).font = baseFont;
//     row.getCell(2).numFmt = moneyFormat;
//     row.getCell(2).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     row.getCell(3).font = baseFont;
//     row.getCell(3).numFmt = moneyFormat;
//     row.getCell(3).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     // Formula cell
//     row.getCell(4).fill = formulaFill;
//     row.getCell(4).font = baseFont;
//     row.getCell(4).numFmt = moneyFormat;
//     row.getCell(4).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     row.getCell(5).font = baseFont;

//     // Reference
//     if (index === 0) {
//       row.getCell(6).value = "Sched G";
//       row.getCell(6).fill = blueFill;
//       row.getCell(6).font = {
//         ...boldFont,
//         color: {
//           argb: "FFFFFFFF",
//         },
//         underline: true,
//       };
//       row.getCell(6).alignment = {
//         horizontal: "center",
//         vertical: "middle",
//       };
//     }

//     currentRow++;
//   });

//   // ---------------------------------------------------------
//   // Total Direct
//   // ---------------------------------------------------------

//   const totalDifference = totalGl - totalJobCost;

//   const totalRow = worksheet.getRow(currentRow);

//   totalRow.getCell(1).value = "Total Direct";
//   totalRow.getCell(2).value = totalGl;
//   totalRow.getCell(3).value = totalJobCost;
//   totalRow.getCell(4).value = totalDifference;

//   for (let col = 1; col <= 6; col++) {
//     totalRow.getCell(col).border = {
//       top: blackBorder,
//     };
//   }

//   totalRow.getCell(1).font = boldFont;

//   totalRow.getCell(2).fill = formulaFill;
//   totalRow.getCell(3).fill = formulaFill;
//   totalRow.getCell(4).fill = formulaFill;

//   totalRow.getCell(2).font = boldFont;
//   totalRow.getCell(3).font = boldFont;
//   totalRow.getCell(4).font = boldFont;

//   totalRow.getCell(2).numFmt = moneyFormat;
//   totalRow.getCell(3).numFmt = moneyFormat;
//   totalRow.getCell(4).numFmt = moneyFormat;

//   totalRow.getCell(2).alignment = {
//     horizontal: "right",
//   };

//   totalRow.getCell(3).alignment = {
//     horizontal: "right",
//   };

//   totalRow.getCell(4).alignment = {
//     horizontal: "right",
//   };

//   // ---------------------------------------------------------
//   // Legend
//   // ---------------------------------------------------------

//   const legendStartRow = currentRow + 5;

//   worksheet.mergeCells(`A${legendStartRow}:B${legendStartRow}`);

//   worksheet.getCell(`A${legendStartRow}`).value =
//     "Imported from Other Worksheet";

//   worksheet.getCell(`A${legendStartRow}`).fill = yellowFill;
//   worksheet.getCell(`A${legendStartRow}`).font = baseFont;

//   worksheet.mergeCells(`A${legendStartRow + 1}:B${legendStartRow + 1}`);

//   worksheet.getCell(`A${legendStartRow + 1}`).value = "Cell Contains a Formula";

//   worksheet.getCell(`A${legendStartRow + 1}`).fill = formulaFill;

//   worksheet.getCell(`A${legendStartRow + 1}`).font = baseFont;

//   // ---------------------------------------------------------
//   // Row heights
//   // ---------------------------------------------------------

//   worksheet.getRow(1).height = 20;
//   worksheet.getRow(2).height = 20;
//   worksheet.getRow(3).height = 20;
//   worksheet.getRow(6).height = 20;
//   worksheet.getRow(7).height = 20;
//   worksheet.getRow(8).height = 20;
//   worksheet.getRow(10).height = 32;

//   for (let row = 11; row <= currentRow; row++) {
//     worksheet.getRow(row).height = 20;
//   }

//   // ---------------------------------------------------------
//   // Print area
//   // ---------------------------------------------------------

//   worksheet.printArea = `A1:F${legendStartRow + 1}`;

//   return worksheet;
// };

// // Schedule G

// const getScheduleGData = async () => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/scheduleDG_cost?fyCd=2025`,
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch Schedule G data. Status: ${response.status}`,
//     );
//   }

//   const data = await response.json();

//   const rows =
//     data?.schedules?.[0]?.rows
//       ?.filter((row) => !row.subname?.toLowerCase().includes("subtotal"))
//       ?.map((row) => ({
//         subname: row.subname || "",
//         trialBal: Number(row.trialBal || 0),
//         adjustment: Number(row.adjustment || 0),
//         claimed: Number(row.claimed || 0),
//       })) || [];

//   return rows;
// };

// const addScheduleG = async (workbook, { companyName, companyAddress }) => {
//   const rows = await getScheduleGData();

//   const worksheet = workbook.addWorksheet("SCHEDULE G");

//   worksheet.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   worksheet.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   worksheet.columns = [
//     { width: 8 }, // ACCT
//     { width: 36 }, // DESCRIPTION
//     { width: 20 }, // AMOUNT PER GL
//     { width: 20 }, // ADJUSTMENTS
//     { width: 20 }, // AMOUNT CLAIMED
//     { width: 9 }, // NOTES
//     { width: 25 }, // REF
//   ];

//   // ---------------------------------------------------------
//   // Styles
//   // ---------------------------------------------------------

//   const yellowFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FFFFFF00",
//     },
//   };

//   const formulaFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FF29C4C8",
//     },
//   };

//   const blueFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FF1719A8",
//     },
//   };

//   const blackBorder = {
//     style: "thin",
//     color: {
//       argb: "FF000000",
//     },
//   };

//   const baseFont = {
//     name: "Times New Roman",
//     size: 11,
//   };

//   const boldFont = {
//     name: "Times New Roman",
//     size: 11,
//     bold: true,
//   };

//   const moneyFormat = "$#,##0.00;($#,##0.00);-";

//   // ---------------------------------------------------------
//   // Header information
//   // ---------------------------------------------------------

//   worksheet.mergeCells("A1:B1");
//   worksheet.getCell("A1").value =
//     "Schedule G is linked to the following schedule:";

//   worksheet.mergeCells("A2:B2");
//   worksheet.getCell("A2").value = "Summary Schedule H";

//   worksheet.getCell("A3").value = "ICE MANUAL";

//   worksheet.getCell("A3").font = {
//     ...baseFont,
//     color: {
//       argb: "FF0000CC",
//     },
//     underline: true,
//   };

//   // Company
//   worksheet.mergeCells("C2:E3");

//   const companyCell = worksheet.getCell("C2");

//   companyCell.value = `${companyName || ""}\n${companyAddress || ""}`;

//   companyCell.fill = yellowFill;
//   companyCell.font = boldFont;
//   companyCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // Schedule title
//   worksheet.mergeCells("F1:G2");

//   const scheduleTitle = worksheet.getCell("F1");

//   scheduleTitle.value = "SCHEDULE G\nICF (version 2.0.1h)";

//   scheduleTitle.font = boldFont;
//   scheduleTitle.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // Main heading
//   worksheet.mergeCells("C5:E6");

//   const heading = worksheet.getCell("C5");

//   heading.value =
//     "Reconciliation of Books of Account and Claimed Direct Costs\nby major cost element";

//   heading.font = boldFont;
//   heading.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // Fiscal year
//   worksheet.mergeCells("C7:E7");

//   const fiscalYearCell = worksheet.getCell("C7");

//   fiscalYearCell.value = "Fiscal Year End - 12/31/2025";
//   fiscalYearCell.fill = yellowFill;
//   fiscalYearCell.font = boldFont;
//   fiscalYearCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // ---------------------------------------------------------
//   // Table Header
//   // ---------------------------------------------------------

//   const headerRow = 9;

//   const headers = [
//     "ACCT",
//     "DESCRIPTION*",
//     "AMOUNT\nPER GENERAL\nLEDGER",
//     "ADJUSTMENTS",
//     "AMOUNT\nCLAIMED",
//     "Notes",
//     "Ref.",
//   ];

//   headers.forEach((header, index) => {
//     const cell = worksheet.getCell(headerRow, index + 1);

//     cell.value = header;
//     cell.font = {
//       ...boldFont,
//       underline:
//         index === 0 || index === 1 || index === 3 || index === 5 || index === 6,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };

//     cell.border = {
//       bottom: blackBorder,
//     };
//   });

//   // ---------------------------------------------------------
//   // API rows
//   // ---------------------------------------------------------

//   let currentRow = headerRow + 1;

//   let totalTrialBal = 0;
//   let totalAdjustment = 0;
//   let totalClaimed = 0;

//   rows.forEach((item, index) => {
//     const trialBal = Number(item.trialBal || 0);
//     const adjustment = Number(item.adjustment || 0);
//     const claimed = Number(item.claimed || 0);

//     totalTrialBal += trialBal;
//     totalAdjustment += adjustment;
//     totalClaimed += claimed;

//     const row = worksheet.getRow(currentRow);

//     // -------------------------------------------------------
//     // Description
//     // -------------------------------------------------------

//     row.getCell(2).value = item.subname;

//     // -------------------------------------------------------
//     // Amount per General Ledger
//     // -------------------------------------------------------

//     row.getCell(3).value = trialBal;

//     // -------------------------------------------------------
//     // Adjustments
//     // -------------------------------------------------------

//     row.getCell(4).value = adjustment;

//     // -------------------------------------------------------
//     // Amount Claimed
//     // -------------------------------------------------------

//     row.getCell(5).value = claimed;

//     // -------------------------------------------------------
//     // Notes
//     // Same frontend logic:
//     // item.adjustment !== 0 ? index + 1 : ""
//     // -------------------------------------------------------

//     if (adjustment !== 0) {
//       row.getCell(6).value = index + 1;
//     }

//     // -------------------------------------------------------
//     // Reference
//     // First row only
//     // -------------------------------------------------------

//     if (index === 0) {
//       row.getCell(7).value = "Summary Sched H";
//     }

//     // -------------------------------------------------------
//     // Styling
//     // -------------------------------------------------------

//     row.getCell(1).font = baseFont;

//     row.getCell(2).font = baseFont;
//     row.getCell(2).alignment = {
//       horizontal: "left",
//       vertical: "middle",
//     };

//     // Yellow = linked/imported
//     row.getCell(3).fill = yellowFill;
//     row.getCell(3).font = baseFont;
//     row.getCell(3).numFmt = moneyFormat;
//     row.getCell(3).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     // Adjustment
//     row.getCell(4).font = baseFont;
//     row.getCell(4).numFmt = moneyFormat;
//     row.getCell(4).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     // Claimed = formula
//     row.getCell(5).fill = formulaFill;
//     row.getCell(5).font = baseFont;
//     row.getCell(5).numFmt = moneyFormat;
//     row.getCell(5).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     row.getCell(6).font = baseFont;
//     row.getCell(6).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     // Reference
//     if (index === 0) {
//       row.getCell(7).fill = blueFill;
//       row.getCell(7).font = {
//         ...boldFont,
//         color: {
//           argb: "FFFFFFFF",
//         },
//         underline: true,
//       };

//       row.getCell(7).alignment = {
//         horizontal: "center",
//         vertical: "middle",
//       };
//     } else {
//       row.getCell(7).value = '"';
//       row.getCell(7).alignment = {
//         horizontal: "center",
//         vertical: "middle",
//       };
//     }

//     currentRow++;
//   });

//   // ---------------------------------------------------------
//   // TOTAL DIRECT COSTS
//   // ---------------------------------------------------------

//   const totalRow = worksheet.getRow(currentRow);

//   totalRow.getCell(2).value = "TOTAL DIRECT COSTS";
//   totalRow.getCell(3).value = totalTrialBal;
//   totalRow.getCell(4).value = totalAdjustment;
//   totalRow.getCell(5).value = totalClaimed;

//   for (let col = 1; col <= 7; col++) {
//     totalRow.getCell(col).border = {
//       top: blackBorder,
//     };
//   }

//   totalRow.getCell(2).font = boldFont;

//   // Frontend FormulaCell = turquoise
//   [3, 4, 5].forEach((col) => {
//     const cell = totalRow.getCell(col);

//     cell.fill = formulaFill;
//     cell.font = boldFont;
//     cell.numFmt = moneyFormat;
//     cell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };
//   });

//   // ---------------------------------------------------------
//   // Explanatory Notes
//   // ---------------------------------------------------------

//   const notesStartRow = currentRow + 4;

//   worksheet.getCell(`A${notesStartRow}`).value = "Explanatory Notes:";

//   worksheet.getCell(`A${notesStartRow}`).font = {
//     ...boldFont,
//     underline: true,
//   };

//   worksheet.mergeCells(`A${notesStartRow + 1}:G${notesStartRow + 1}`);

//   worksheet.getCell(`A${notesStartRow + 1}`).value =
//     "1. Non reimbursable Labor cost to the project 80N1001D0004 for $212 has been adjusted from claimed Labor cost.";

//   worksheet.mergeCells(`A${notesStartRow + 2}:G${notesStartRow + 2}`);

//   worksheet.getCell(`A${notesStartRow + 2}`).value =
//     "2. Non reimbursable Travel cost to the project 80GFSC25C004 for $(1,165) and 47QFCA21F0001 (440.02) has been updated as adjustment from the claimed Travel costs.";

//   worksheet.mergeCells(`A${notesStartRow + 3}:G${notesStartRow + 3}`);

//   worksheet.getCell(`A${notesStartRow + 3}`).value =
//     "3. Non reimbursable ODC cost to the project 4400574846 for $2,953.50 has been updated as adjustment from the claimed ODC costs.";

//   worksheet.mergeCells(`A${notesStartRow + 4}:G${notesStartRow + 4}`);

//   worksheet.getCell(`A${notesStartRow + 4}`).value =
//     "4. An adjustment of $(276,702) for project 80GFSC25C004 is made for Teammate Fee Costs, as these are not claimed.";

//   for (let row = notesStartRow; row <= notesStartRow + 4; row++) {
//     worksheet.getRow(row).font = baseFont;
//   }

//   // ---------------------------------------------------------
//   // Legend
//   // ---------------------------------------------------------

//   const legendRow = notesStartRow + 6;

//   worksheet.mergeCells(`A${legendRow}:B${legendRow}`);

//   worksheet.getCell(`A${legendRow}`).value = "Linked to Other Worksheet";

//   worksheet.getCell(`A${legendRow}`).fill = yellowFill;
//   worksheet.getCell(`A${legendRow}`).font = baseFont;

//   worksheet.getCell(`C${legendRow}`).value = "As Referenced";

//   worksheet.mergeCells(`A${legendRow + 1}:B${legendRow + 1}`);

//   worksheet.getCell(`A${legendRow + 1}`).value = "Cell Contains a Formula";

//   worksheet.getCell(`A${legendRow + 1}`).fill = formulaFill;
//   worksheet.getCell(`A${legendRow + 1}`).font = baseFont;

//   worksheet.getCell(`C${legendRow + 1}`).value = "Totals and Differences";

//   // ---------------------------------------------------------
//   // Row heights
//   // ---------------------------------------------------------

//   worksheet.getRow(1).height = 20;
//   worksheet.getRow(2).height = 20;
//   worksheet.getRow(3).height = 20;
//   worksheet.getRow(5).height = 25;
//   worksheet.getRow(6).height = 25;
//   worksheet.getRow(7).height = 20;
//   worksheet.getRow(headerRow).height = 45;

//   for (let row = 10; row <= currentRow; row++) {
//     worksheet.getRow(row).height = 20;
//   }

//   // ---------------------------------------------------------
//   // Print area
//   // ---------------------------------------------------------

//   worksheet.printArea = `A1:G${legendRow + 1}`;

//   return worksheet;
// };

// // ============================================================
// // SCHEDULE H-1 / H CONT
// // ============================================================

// const getScheduleH1Data = async () => {
//   // =========================================================
//   // SAME APIs AS SchedHCont.jsx
//   // =========================================================
//   const [ledgerRes, ratesRes] = await Promise.all([
//     fetch(`${backendUrl}/api/JobCostLedger`),
//     fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
//   ]);

//   if (!ledgerRes.ok) {
//     throw new Error(
//       `JobCostLedger API failed: ${ledgerRes.status}`
//     );
//   }

//   if (!ratesRes.ok) {
//     throw new Error(
//       `scheduleDA_cost API failed: ${ratesRes.status}`
//     );
//   }

//   const ledgerData = await ledgerRes.json();
//   const ratesData = await ratesRes.json();

//   // =========================================================
//   // EXACT SAME RATE EXTRACTION AS COMPONENT
//   // =========================================================
//   const rates = {
//     fringe: 0,
//     aeroFringe: 0,
//     custOH: 0,
//     colOH: 0,
//     smh: 0,
//     ga: 0,
//   };

//   if (ratesData && ratesData.schedules) {
//     ratesData.schedules.forEach((schedule) => {
//       let rawRate = parseFloat(schedule.rate) || 0;

//       let percentForm =
//         rawRate > 1
//           ? rawRate
//           : rawRate * 100;

//       percentForm =
//         Math.round(percentForm * 100) / 100;

//       const r = percentForm / 100;

//       if (
//         schedule.name.includes("Fringe Pool") ||
//         schedule.name === "Fringe"
//       ) {
//         rates.fringe = r;
//       } else if (
//         schedule.name.includes("AERO Fringe")
//       ) {
//         rates.aeroFringe = r;
//       } else if (
//         schedule.name.includes("Customer Site Overhead")
//       ) {
//         rates.custOH = r;
//       } else if (
//         schedule.name.includes("Off - Site Overhead")
//       ) {
//         rates.colOH = r;
//       } else if (
//         schedule.name.includes("Subk & Material Handling")
//       ) {
//         rates.smh = r;
//       } else if (
//         schedule.name.includes("General and Administrative")
//       ) {
//         rates.ga = r;
//       }
//     });
//   }

//   // =========================================================
//   // EXACT SAME CATEGORIES AS COMPONENT
//   // =========================================================
//   const createCategory = () => ({
//     laborOnsite: 0,
//     laborOffsite: 0,
//     laborAero: 0,
//     material: 0,
//     odc: 0,
//     subcontracts: 0,
//     unburden: 0,
//     travel: 0,
//   });

//   const categories = {
//     "Cost-Type": createCategory(),
//     "Flexibly Priced": createCategory(),
//     "T&M": createCategory(),
//     "Fixed Price": createCategory(),
//     Commercial: createCategory(),
//     "IR&D&BP": createCategory(),
//   };

//   // =========================================================
//   // EXACT SAME LEDGER CLASSIFICATION
//   // =========================================================
//   ledgerData
//     .filter((row) => Number(row.year) === 2025)
//     .forEach((row) => {
//       const pt = (row.projType || "").toUpperCase();

//       let cat = "Flexibly Priced";

//       if (
//         pt.includes("CPFF") ||
//         pt.includes("COST") ||
//         pt.includes("CPAF")
//       ) {
//         cat = "Cost-Type";
//       } else if (
//         pt === "T&M" ||
//         pt.includes("T&M")
//       ) {
//         cat = "T&M";
//       } else if (
//         pt.includes("FIXED") ||
//         pt === "FFP"
//       ) {
//         cat = "Fixed Price";
//       } else if (
//         pt.includes("COMMERCIAL")
//       ) {
//         cat = "Commercial";
//       } else if (
//         pt.includes("IR&D") ||
//         pt.includes("B&P")
//       ) {
//         cat = "IR&D&BP";
//       }

//       const amount = parseFloat(row.amount) || 0;

//       if (
//         row.acctId === "50-00-01" ||
//         row.acctId === "50-00-98" ||
//         row.acctId === "59-00-01"
//       ) {
//         if (
//           row.orgId === "1.1.01" ||
//           row.acctId === "59-00-01"
//         ) {
//           categories[cat].laborAero += amount;
//         } else {
//           categories[cat].laborOnsite += amount;
//         }
//       } else if (
//         row.acctId === "50-00-02"
//       ) {
//         categories[cat].laborOffsite += amount;
//       } else if (
//         row.acctId &&
//         (
//           row.acctId.startsWith("50-40") ||
//           row.acctId.startsWith("59-40")
//         )
//       ) {
//         categories[cat].travel += amount;
//       } else if (
//         [
//           "50-30-01",
//           "50-31-01",
//           "50-31-02",
//         ].includes(row.acctId)
//       ) {
//         categories[cat].material += amount;
//       } else if (
//         [
//           "50-50-01",
//           "50-50-02",
//           "50-50-03",
//           "59-50-01",
//         ].includes(row.acctId)
//       ) {
//         categories[cat].odc += amount;
//       } else if (
//         [
//           "50-21-01",
//           "50-21-02",
//           "50-21-03",
//           "50-21-04",
//           "50-22-01",
//         ].includes(row.acctId)
//       ) {
//         categories[cat].subcontracts += amount;
//       } else if (
//         [
//           "50-22-02",
//           "50-22-03",
//           "50-22-05",
//         ].includes(row.acctId)
//       ) {
//         categories[cat].unburden += amount;
//       }
//     });

//   // =========================================================
//   // EXACT SAME CALCULATION AS COMPONENT
//   // =========================================================
//   const catBases = {};

//   const baseTotals = {
//     onsite: 0,
//     offsite: 0,
//     smh: 0,
//     ga: 0,
//   };

//   for (const [cat, rawItem] of Object.entries(categories)) {
//     const item = {
//       laborOnsite: Math.round(rawItem.laborOnsite),
//       laborOffsite: Math.round(rawItem.laborOffsite),
//       laborAero: Math.round(rawItem.laborAero),
//       travel: Math.round(rawItem.travel),
//       material: Math.round(rawItem.material),
//       odc: Math.round(rawItem.odc),
//       subcontracts: Math.round(rawItem.subcontracts),
//       unburden: Math.round(rawItem.unburden),
//     };

//     const totalLabor =
//       item.laborOnsite +
//       item.laborOffsite +
//       item.laborAero;

//     const fringeOnsite = Math.round(
//       item.laborOnsite * rates.fringe
//     );

//     const fringeOffsite = Math.round(
//       item.laborOffsite * rates.fringe
//     );

//     const fringeAero = Math.round(
//       item.laborAero * rates.aeroFringe
//     );

//     // EXACT SAME DISPLAY BASE AS COMPONENT
//     const ohOnsiteBaseDisplay =
//       cat === "Cost-Type" ||
//       cat === "T&M"
//         ? item.laborOnsite + item.laborAero
//         : item.laborOnsite +
//           fringeOnsite +
//           item.laborAero +
//           fringeAero;

//     // EXACT SAME G&A BASE CALCULATION
//     const ohOnsiteBaseForGA =
//       item.laborOnsite +
//       fringeOnsite +
//       item.laborAero +
//       fringeAero;

//     const ohOffsiteBase =
//       item.laborOffsite;

//     const smhBase =
//       item.material +
//       item.subcontracts;

//     const ohOnsiteDisplay = Math.round(
//       ohOnsiteBaseDisplay *
//         rates.custOH
//     );

//     const ohOnsiteForGA = Math.round(
//       ohOnsiteBaseForGA *
//         rates.custOH
//     );

//     const ohOffsite = Math.round(
//       (ohOffsiteBase + fringeOffsite) *
//         rates.colOH
//     );

//     const ohSMH = Math.round(
//       smhBase * rates.smh
//     );

//     const totalDirectCosts =
//       totalLabor +
//       item.travel +
//       item.material +
//       item.odc +
//       item.subcontracts +
//       item.unburden;

//     const totalIndirectCosts =
//       fringeOnsite +
//       fringeOffsite +
//       fringeAero +
//       ohOnsiteForGA +
//       ohOffsite +
//       ohSMH;

//     const directPlusOH =
//       totalDirectCosts +
//       totalIndirectCosts;

//     const gaBase =
//       directPlusOH -
//       (
//         item.material +
//         item.subcontracts +
//         item.unburden +
//         ohSMH
//       );

//     catBases[cat] = {
//       ohOnsiteBase: ohOnsiteBaseDisplay,
//       ohOffsiteBase,
//       smhBase,
//       gaBase,
//     };

//     baseTotals.onsite +=
//       ohOnsiteBaseDisplay;

//     baseTotals.offsite +=
//       ohOffsiteBase;

//     baseTotals.smh +=
//       smhBase;

//     baseTotals.ga +=
//       gaBase;
//   }

//   // =========================================================
//   // EXACT SAME ROW VALUES AS UI
//   // =========================================================
//   const categoryNames = [
//     "Cost-Type",
//     "Flexibly Priced",
//     "T&M",
//     "Fixed Price",
//     "Commercial",
//     "IR&D&BP",
//   ];

//   const rows = categoryNames.map((type) => {
//     const cb = catBases[type] || {
//       ohOnsiteBase: 0,
//       ohOffsiteBase: 0,
//       smhBase: 0,
//       gaBase: 0,
//     };

//     return {
//       type,

//       onsiteAmount: cb.ohOnsiteBase,
//       onsitePct:
//         baseTotals.onsite === 0
//           ? 0
//           : cb.ohOnsiteBase /
//             baseTotals.onsite,

//       offsiteAmount: cb.ohOffsiteBase,
//       offsitePct:
//         baseTotals.offsite === 0
//           ? 0
//           : cb.ohOffsiteBase /
//             baseTotals.offsite,

//       smhAmount: cb.smhBase,
//       smhPct:
//         baseTotals.smh === 0
//           ? 0
//           : cb.smhBase /
//             baseTotals.smh,

//       gaAmount: cb.gaBase,
//       gaPct:
//         baseTotals.ga === 0
//           ? 0
//           : cb.gaBase /
//             baseTotals.ga,

//       ref:
//         type === "Cost-Type"
//           ? "SCHED H"
//           : '"',
//     };
//   });

//   // EXACT SAME TOTAL ROW
//   rows.push({
//     type: "Total",

//     onsiteAmount: baseTotals.onsite,
//     onsitePct:
//       baseTotals.onsite === 0
//         ? 0
//         : 1,

//     offsiteAmount: baseTotals.offsite,
//     offsitePct:
//       baseTotals.offsite === 0
//         ? 0
//         : 1,

//     smhAmount: baseTotals.smh,
//     smhPct:
//       baseTotals.smh === 0
//         ? 0
//         : 1,

//     gaAmount: baseTotals.ga,
//     gaPct:
//       baseTotals.ga === 0
//         ? 0
//         : 1,

//     ref: "",
//     total: true,
//   });

//   return {
//     rows,
//     rates,
//     baseTotals,
//   };
// };

// // =========================================================
// // SCHEDULE H-1
// // =========================================================
// const addScheduleH1 = async (
//   workbook,
//   {
//     companyName = "",
//     companyAddress = "",
//     year = FISCAL_YEAR,
//   } = {}
// ) => {
//   // =========================================================
//   // IMPORTANT:
//   // getScheduleH1Data() must use the EXACT API + mapping +
//   // calculations from SchedHCont.jsx.
//   // =========================================================
//   const { rows } = await getScheduleH1Data(year);

//   const ws = workbook.addWorksheet("Schedule H-1");

//   // ---------------------------------------------------------
//   // COLORS
//   // ---------------------------------------------------------
//   const YELLOW = "FFFF00";
//   const CYAN = "2BBEC3";
//   const PERCENT_CYAN = "28C0C5";
//   const BLUE = "29258F";
//   const BLACK = "222222";

//   const thinBlack = {
//     style: "thin",
//     color: { argb: BLACK },
//   };

//   // ---------------------------------------------------------
//   // COLUMNS
//   // ---------------------------------------------------------
//   ws.columns = [
//     { width: 20 }, // A Contract Type
//     { width: 18 }, // B Onsite Amount
//     { width: 12 }, // C Onsite %
//     { width: 18 }, // D Offsite Amount
//     { width: 12 }, // E Offsite %
//     { width: 18 }, // F SM&H Amount
//     { width: 12 }, // G SM&H %
//     { width: 18 }, // H G&A Amount
//     { width: 12 }, // I G&A %
//     { width: 18 }, // J Ref
//   ];

//   // ---------------------------------------------------------
//   // DEFAULT FONT / ROW HEIGHT
//   // ---------------------------------------------------------
//   for (let r = 1; r <= 40; r++) {
//     ws.getRow(r).height = 20;

//     for (let c = 1; c <= 10; c++) {
//       ws.getCell(r, c).font = {
//         name: "Arial",
//         size: 10,
//         color: { argb: "000000" },
//       };
//     }
//   }

//   // ---------------------------------------------------------
//   // TOP LINKS
//   // ---------------------------------------------------------
//   ws.getCell("A1").value =
//     "Schedule H-1 is linked to the following schedules:";

//   ws.getCell("A1").font = {
//     name: "Arial",
//     size: 10,
//   };

//   ws.getCell("A2").value =
//     "Schedule H, Contract Costs";

//   ws.getCell("A2").font = {
//     name: "Arial",
//     size: 10,
//     underline: true,
//     color: { argb: "00158F" },
//   };

//   ws.getCell("A3").value = "ICE MANUAL";

//   ws.getCell("A3").font = {
//     name: "Arial",
//     size: 9,
//     underline: true,
//     color: { argb: "00158F" },
//   };

//   // ---------------------------------------------------------
//   // RIGHT HEADER
//   // ---------------------------------------------------------
//   ws.mergeCells("J1:J2");

//   ws.getCell("J1").value =
//     "Schedule H-1\nICE (version 2.0.1h)";

//   ws.getCell("J1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("J1").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // ---------------------------------------------------------
//   // COMPANY BANNER
//   // ---------------------------------------------------------
//   ws.mergeCells("B4:I5");

//   ws.getCell("B4").value =
//     `${companyName}\n${companyAddress}`;

//   ws.getCell("B4").font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell("B4").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   ws.getCell("B4").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: YELLOW },
//   };

//   // ---------------------------------------------------------
//   // TITLE
//   // ---------------------------------------------------------
//   ws.mergeCells("B6:I7");

//   ws.getCell("B6").value =
//     "Subsidiary Schedule of\nGovernment Participation Percentages";

//   ws.getCell("B6").font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell("B6").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // ---------------------------------------------------------
//   // FISCAL YEAR
//   // ---------------------------------------------------------
//   ws.mergeCells("B8:I8");

//   ws.getCell("B8").value =
//     `Fiscal Year End - 12/31/${year}`;

//   ws.getCell("B8").font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell("B8").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   ws.getCell("B8").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: YELLOW },
//   };

//   // ---------------------------------------------------------
//   // TABLE HEADER
//   // ---------------------------------------------------------
//   const headerRow = 11;

//   ws.getCell(`A${headerRow}`).value =
//     "Contract Type";

//   ws.getCell(`B${headerRow}`).value =
//     "OH - Onsite";

//   ws.getCell(`D${headerRow}`).value =
//     "OH - Offsite";

//   ws.getCell(`F${headerRow}`).value =
//     "SM&H";

//   ws.getCell(`H${headerRow}`).value =
//     "G&A";

//   ws.getCell(`J${headerRow}`).value = "Ref.";

//   ws.mergeCells(`B${headerRow}:C${headerRow}`);
//   ws.mergeCells(`D${headerRow}:E${headerRow}`);
//   ws.mergeCells(`F${headerRow}:G${headerRow}`);
//   ws.mergeCells(`H${headerRow}:I${headerRow}`);

//   // Main section headers
//   [2, 4, 6, 8].forEach((col) => {
//     const cell = ws.getCell(headerRow, col);

//     cell.font = {
//       name: "Arial",
//       size: 11,
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: YELLOW },
//     };

//     cell.border = {
//       top: thinBlack,
//       bottom: thinBlack,
//     };
//   });

//   ws.getCell(`A${headerRow}`).font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell(`J${headerRow}`).font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell(`A${headerRow}`).border = {
//     bottom: thinBlack,
//   };

//   ws.getCell(`J${headerRow}`).border = {
//     bottom: thinBlack,
//   };

//   // ---------------------------------------------------------
//   // SUB HEADERS
//   // ---------------------------------------------------------
//   const subHeaderRow = 12;

//   ws.getCell(`B${subHeaderRow}`).value =
//     "Overhead\nBase Amount";

//   ws.getCell(`C${subHeaderRow}`).value = "%";

//   ws.getCell(`D${subHeaderRow}`).value =
//     "Overhead\nBase Amount";

//   ws.getCell(`E${subHeaderRow}`).value = "%";

//   ws.getCell(`F${subHeaderRow}`).value =
//     "Overhead\nBase Amount";

//   ws.getCell(`G${subHeaderRow}`).value = "%";

//   ws.getCell(`H${subHeaderRow}`).value =
//     "G&A\nBase Amount";

//   ws.getCell(`I${subHeaderRow}`).value = "%";

//   for (let col = 2; col <= 9; col++) {
//     const cell = ws.getCell(subHeaderRow, col);

//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };

//     cell.border = {
//       bottom: thinBlack,
//     };
//   }

//   ws.getRow(subHeaderRow).height = 35;

//   // =========================================================
//   // DATA
//   // =========================================================
//   const startRow = 13;

//   rows.forEach((item, index) => {
//     const r = startRow + index;

//     const isTotal = item.total === true;

//     // -------------------------------------------------------
//     // CONTRACT TYPE
//     // -------------------------------------------------------
//     ws.getCell(r, 1).value = item.type || "";

//     ws.getCell(r, 1).font = {
//       name: "Arial",
//       size: 10,
//       bold: isTotal,
//     };

//     ws.getCell(r, 1).alignment = {
//       horizontal: "left",
//       vertical: "middle",
//     };

//     // -------------------------------------------------------
//     // AMOUNTS
//     //
//     // getScheduleH1Data() should return NUMBERS here.
//     // Do not use the UI formatted strings such as "12,345".
//     // -------------------------------------------------------
//     const amountValues = [
//       item.onsiteAmount,
//       item.offsiteAmount,
//       item.smhAmount,
//       item.gaAmount,
//     ];

//     [2, 4, 6, 8].forEach((col, index) => {
//       const cell = ws.getCell(r, col);

//       const value = amountValues[index];

//       cell.value =
//         value === null ||
//         value === undefined ||
//         value === ""
//           ? 0
//           : Number(value) || 0;

//       cell.font = {
//         name: "Arial",
//         size: 10,
//         bold: isTotal,
//       };

//       cell.alignment = {
//         horizontal: "right",
//         vertical: "middle",
//       };

//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: isTotal ? CYAN : YELLOW,
//         },
//       };

//       cell.border = {
//         bottom: thinBlack,
//       };

//       cell.numFmt = '#,##0;(#,##0);-';
//     });

//     // -------------------------------------------------------
//     // PERCENTAGES
//     //
//     // IMPORTANT:
//     // getScheduleH1Data() returns ratios:
//     //
//     // 0.25 => 25.0%
//     // 0.753 => 75.3%
//     //
//     // Excel formats these using 0.0%.
//     // -------------------------------------------------------
//     const percentageValues = [
//       item.onsitePct,
//       item.offsitePct,
//       item.smhPct,
//       item.gaPct,
//     ];

//     [3, 5, 7, 9].forEach((col, index) => {
//       const cell = ws.getCell(r, col);

//       const value = percentageValues[index];

//       cell.value =
//         value === null ||
//         value === undefined ||
//         value === ""
//           ? 0
//           : Number(value) || 0;

//       cell.font = {
//         name: "Arial",
//         size: 10,
//         bold: isTotal,
//       };

//       cell.alignment = {
//         horizontal: "right",
//         vertical: "middle",
//       };

//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: isTotal ? CYAN : PERCENT_CYAN,
//         },
//       };

//       cell.border = {
//         bottom: thinBlack,
//       };

//       cell.numFmt = "0.0%";
//     });

//     // -------------------------------------------------------
//     // REFERENCE
//     // -------------------------------------------------------
//     const refCell = ws.getCell(r, 10);

//     refCell.value = item.ref || "";

//     refCell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     if (item.ref === "SCHED H") {
//       refCell.font = {
//         name: "Arial",
//         size: 10,
//         bold: true,
//         underline: true,
//         color: { argb: "FFFFFF" },
//       };

//       refCell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: BLUE },
//       };
//     }
//   });

//   // =========================================================
//   // LEGEND
//   // =========================================================
//   const legendRow = startRow + rows.length + 3;

//   // Linked
//   ws.mergeCells(
//     `A${legendRow}:B${legendRow}`
//   );

//   ws.getCell(`A${legendRow}`).value =
//     "Linked to Other Worksheet";

//   ws.getCell(`A${legendRow}`).font = {
//     name: "Arial",
//     size: 10,
//   };

//   ws.getCell(`A${legendRow}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: YELLOW },
//   };

//   // Formula
//   ws.mergeCells(
//     `A${legendRow + 2}:B${legendRow + 2}`
//   );

//   ws.getCell(
//     `A${legendRow + 2}`
//   ).value = "Cell Contains a Formula";

//   ws.getCell(
//     `A${legendRow + 2}`
//   ).font = {
//     name: "Arial",
//     size: 10,
//   };

//   ws.getCell(
//     `A${legendRow + 2}`
//   ).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: CYAN },
//   };

//   // ---------------------------------------------------------
//   // VIEW
//   // ---------------------------------------------------------
//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 12,
//     },
//   ];

//   // ---------------------------------------------------------
//   // PAGE SETUP
//   // ---------------------------------------------------------
//   ws.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 1,
//     horizontalDpi: 300,
//     verticalDpi: 300,
//   };

//   ws.pageSetup.margins = {
//     left: 0.25,
//     right: 0.25,
//     top: 0.5,
//     bottom: 0.5,
//     header: 0.2,
//     footer: 0.2,
//   };

//   return ws;
// };

// // ============================================================
// // SUMMARY SCHEDULE H
// // ============================================================

// const getSummaryScheduleHData = async (year = 2025) => {
//   const response = await fetch(`${backendUrl}/api/JobCostLedger`);

//   if (!response.ok) {
//     throw new Error(
//       `Job Cost Ledger API failed: ${response.status}`
//     );
//   }

//   const data = await response.json();

//   const acc = {
//     laborOnsite: 0,
//     laborOffsite: 0,
//     laborAero: 0,
//     material: 0,
//     travel: 0,
//     odc: 0,
//     subcontracts: 0,
//     unburden: 0,
//   };

//   data.forEach((row) => {
//     if (Number(row.year) !== Number(year)) return;

//     const amount = parseFloat(row.amount) || 0;

//     if (
//       row.acctId === "50-00-01" ||
//       row.acctId === "50-00-98" ||
//       row.acctId === "59-00-01"
//     ) {
//       if (row.orgId === "1.1.01") {
//         acc.laborAero += amount;
//       } else {
//         acc.laborOnsite += amount;
//       }
//     } else if (row.acctId === "50-00-02") {
//       acc.laborOffsite += amount;
//     } else if (
//       row.acctId &&
//       (
//         row.acctId.startsWith("50-40") ||
//         row.acctId.startsWith("59-40")
//       )
//     ) {
//       acc.travel += amount;
//     } else if (
//       ["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)
//     ) {
//       acc.material += amount;
//     } else if (
//       [
//         "50-50-01",
//         "50-50-02",
//         "50-50-03",
//         "59-50-01",
//       ].includes(row.acctId)
//     ) {
//       acc.odc += amount;
//     } else if (
//       [
//         "50-21-01",
//         "50-21-02",
//         "50-21-03",
//         "50-21-04",
//         "50-22-01",
//       ].includes(row.acctId)
//     ) {
//       acc.subcontracts += amount;
//     } else if (
//       ["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)
//     ) {
//       acc.unburden += amount;
//     }
//   });

//   const totals = {
//     laborOnsite: Math.round(acc.laborOnsite),
//     laborOffsite: Math.round(acc.laborOffsite),
//     laborAero: Math.round(acc.laborAero),
//     material: Math.round(acc.material),
//     travel: Math.round(acc.travel),
//     odc: Math.round(acc.odc),
//     subcontracts: Math.round(acc.subcontracts),
//     unburden: Math.round(acc.unburden),
//   };

//   const totalLabor =
//     totals.laborOnsite +
//     totals.laborOffsite +
//     totals.laborAero;

//   const totalDirectCosts =
//     totalLabor +
//     totals.material +
//     totals.travel +
//     totals.odc +
//     totals.subcontracts +
//     totals.unburden;

//   return {
//     ...totals,
//     totalLabor,
//     totalDirectCosts,
//   };
// };

// const addSummaryScheduleH = async (
//   workbook,
//   {
//     companyName = "",
//     companyAddress = "",
//     year = 2025,
//   } = {}
// ) => {
//   const data = await getSummaryScheduleHData(year);

//   const ws = workbook.addWorksheet("Summary Schedule H", {
//     views: [{ showGridLines: false }],
//   });

//   // =========================================================
//   // COLORS - SAME AS JSX
//   // =========================================================

//   const YELLOW = "FFFF00";
//   const CYAN = "29BEC2";
//   const GRAY = "A8A8A8";
//   const BLUE = "1717A8";
//   const BLACK = "000000";
//   const WHITE = "FFFFFF";

//   const thinBlack = {
//     style: "thin",
//     color: { argb: BLACK },
//   };

//   const dashedGray = {
//     style: "dashed",
//     color: { argb: "666666" },
//   };

//   const noBorder = {
//     style: "thin",
//     color: { argb: "FFFFFF" },
//   };

//   // =========================================================
//   // COLUMN WIDTHS
//   //
//   // UI:
//   // 302 | 100 | 100 | 110 | 110 | 100 | 100 | 75 | 55
//   // =========================================================

//   ws.columns = [
//     { width: 42 },
//     { width: 14 },
//     { width: 14 },
//     { width: 15 },
//     { width: 15 },
//     { width: 14 },
//     { width: 14 },
//     { width: 11 },
//     { width: 8 },
//   ];

//   // =========================================================
//   // HELPERS
//   // =========================================================

//   const setFont = (cell, opts = {}) => {
//     cell.font = {
//       name: "Arial",
//       size: 10,
//       color: { argb: BLACK },
//       ...opts,
//     };
//   };

//   const setLabel = (
//     row,
//     col,
//     value,
//     {
//       bold = false,
//       indent = 0,
//       align = "left",
//     } = {}
//   ) => {
//     const cell = ws.getCell(row, col);
//     cell.value = value;

//     setFont(cell, {
//       bold,
//       size: 10,
//     });

//     cell.alignment = {
//       horizontal: align,
//       vertical: "middle",
//       indent,
//       wrapText: true,
//     };

//     return cell;
//   };

//   const setValue = (
//     row,
//     col,
//     value,
//     {
//       fill = null,
//       bold = false,
//       borderBottom = false,
//       align = "right",
//     } = {}
//   ) => {
//     const cell = ws.getCell(row, col);

//     cell.value = value;

//     setFont(cell, {
//       bold,
//       size: 10,
//     });

//     cell.alignment = {
//       horizontal: align,
//       vertical: "middle",
//     };

//     if (fill) {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: fill },
//       };
//     }

//     if (borderBottom) {
//       cell.border = {
//         bottom: thinBlack,
//       };
//     }

//     if (typeof value === "number") {
//       cell.numFmt = '#,##0;(#,##0);-';
//     }

//     return cell;
//   };

//   const setDashLine = (row, col) => {
//     const cell = ws.getCell(row, col);

//     cell.border = {
//       bottom: dashedGray,
//     };

//     cell.alignment = {
//       vertical: "middle",
//     };

//     return cell;
//   };

//   const setReference = (row, col, text) => {
//     const cell = ws.getCell(row, col);

//     cell.value = text;

//     cell.font = {
//       name: "Arial",
//       size: 9,
//       bold: true,
//       underline: true,
//       color: { argb: WHITE },
//     };

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: BLUE },
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     cell.border = {
//       top: {
//         style: "thin",
//         color: { argb: BLUE },
//       },
//       bottom: {
//         style: "thin",
//         color: { argb: BLUE },
//       },
//       left: {
//         style: "thin",
//         color: { argb: BLUE },
//       },
//       right: {
//         style: "thin",
//         color: { argb: BLUE },
//       },
//     };

//     return cell;
//   };

//   const amount = (value) => {
//     return value === 0 ? "-" : value;
//   };

//   // =========================================================
//   // HEADER
//   // =========================================================

//  // =========================================================
// // HEADER
// // =========================================================

// ws.mergeCells("B2:G3");
// ws.mergeCells("B5:G6");

// setLabel(
//   2,
//   1,
//   "Summary Schedule H is linked from the following schedules:"
// );

// setLabel(3, 1, "Schedule H, Contract Costs", {
//   align: "left",
// });

// setLabel(4, 1, "Schedule E, Indirect Rate", {
//   align: "left",
// });

// setLabel(5, 1, "ICE MANUAL", {
//   align: "left",
// });

// ws.getCell("A5").font = {
//   name: "Arial",
//   size: 10,
//   underline: true,
//   color: { argb: "000099" },
// };

// // Company banner
// ws.getCell("B2").value =
//   `${companyName}\n${companyAddress}`;

// ws.getCell("B2").font = {
//   name: "Arial",
//   size: 10,
//   bold: true,
// };

// ws.getCell("B2").alignment = {
//   horizontal: "center",
//   vertical: "middle",
//   wrapText: true,
// };

// ws.getCell("B2").fill = {
//   type: "pattern",
//   pattern: "solid",
//   fgColor: { argb: "FFFF00" },
// };

// // Main title
// ws.getCell("B5").value =
//   `Summary Schedule H of Direct Contract/Subcontract/IR&D/B&P Costs\nFiscal Year End - 12/31/${year}`;

// ws.getCell("B5").font = {
//   name: "Arial",
//   size: 10,
//   bold: true,
// };

// ws.getCell("B5").alignment = {
//   horizontal: "center",
//   vertical: "middle",
//   wrapText: true,
// };

// ws.getCell("B5").fill = {
//   type: "pattern",
//   pattern: "solid",
//   fgColor: { argb: "FFFF00" },
// };

// ws.getRow(2).height = 20;
// ws.getRow(3).height = 20;
// ws.getRow(5).height = 20;
// ws.getRow(6).height = 20;

//   // =========================================================
//   // DIRECT COST HEADER
//   // =========================================================

//   let r = 8;

//   const headers = [
//     "DIRECT COST ELEMENTS",
//     "OH - Onsite",
//     "OH - Offsite",
//     "AERO OH Onsite",
//     "CONTRACT\nTOTAL",
//     "IR&D/B&P\nTOTAL",
//     "GRAND\nTOTAL",
//     "Ref.",
//     "Notes",
//   ];

//   headers.forEach((value, i) => {
//     const cell = ws.getCell(r, i + 1);

//     cell.value = value;

//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "bottom",
//       wrapText: true,
//     };

//     cell.border = {
//       bottom: thinBlack,
//     };
//   });

//   ws.getRow(r).height = 32;

//   // =========================================================
//   // DIRECT COST ROW
//   // =========================================================

//   const addDirectRow = ({
//     label,
//     onsite = null,
//     offsite = null,
//     aero = null,
//     contract,
//     irbp = "-",
//     grand,
//     reference = "",
//     note = "",
//     bold = false,
//     totalRow = false,
//   }) => {
//     r++;

//     setLabel(r, 1, label, {
//       bold,
//       indent: 1,
//     });

//     if (onsite !== null) {
//       setValue(r, 2, amount(onsite), {
//         fill: YELLOW,
//       });
//     } else {
//       setDashLine(r, 2);
//     }

//     if (offsite !== null) {
//       setValue(r, 3, amount(offsite), {
//         fill: YELLOW,
//       });
//     } else {
//       setDashLine(r, 3);
//     }

//     if (aero !== null) {
//       setValue(r, 4, amount(aero), {
//         fill: YELLOW,
//       });
//     } else {
//       setDashLine(r, 4);
//     }

//     setValue(r, 5, amount(contract), {
//       fill: CYAN,
//       bold: totalRow,
//       borderBottom: totalRow,
//     });

//     setValue(r, 6, irbp, {
//       fill: totalRow ? CYAN : YELLOW,
//       bold: totalRow,
//       borderBottom: totalRow,
//     });

//     setValue(r, 7, amount(grand), {
//       fill: CYAN,
//       bold: totalRow,
//       borderBottom: totalRow,
//     });

//     if (reference) {
//       setReference(r, 8, reference);
//     }

//     if (note) {
//       setLabel(r, 9, note);
//     }

//     ws.getRow(r).height = 20;
//   };

//   addDirectRow({
//     label: "Direct Contract Labor",
//     onsite: data.laborOnsite,
//     offsite: data.laborOffsite,
//     aero: data.laborAero,
//     contract: data.totalLabor,
//     grand: data.totalLabor,
//     reference: "Sched H",
//     bold: true,
//   });

//   addDirectRow({
//     label: "Direct Material",
//     contract: data.material,
//     grand: data.material,
//   });

//   addDirectRow({
//     label: "Travel",
//     contract: data.travel,
//     grand: data.travel,
//   });

//   addDirectRow({
//     label: "Other Direct Costs (ODC)",
//     contract: data.odc,
//     grand: data.odc,
//   });

//   addDirectRow({
//     label: "Subcontracts",
//     contract: data.subcontracts,
//     grand: data.subcontracts,
//   });

//   addDirectRow({
//     label: "Unburden Teammate Cost",
//     contract: data.unburden,
//     grand: data.unburden,
//   });

//   addDirectRow({
//     label: "TOT. DIR. CONTRACT COSTS",
//     contract: data.totalDirectCosts,
//     irbp: "-",
//     grand: data.totalDirectCosts,
//     bold: true,
//     totalRow: true,
//   });

//   // =========================================================
//   // IR&D / B&P
//   // =========================================================

//   r += 2;

//   ws.mergeCells(r, 1, r, 1);

//   setLabel(r, 1, "IR&D AND B&P COSTS", {
//     bold: true,
//   });

//   ws.getCell(r, 1).border = {
//     bottom: thinBlack,
//   };

//   r += 2;

//   const addIRBPRow = ({
//     label,
//     fill = YELLOW,
//     reference = "",
//     note = "",
//     total = false,
//     gray = false,
//   }) => {
//     r++;

//     setLabel(r, 1, label, {
//       indent: 1,
//       bold: total,
//     });

//     for (let c = 2; c <= 6; c++) {
//       ws.getCell(r, c).value = null;
//     }

//     setValue(r, 7, "-", {
//       fill: gray ? GRAY : fill,
//       bold: total,
//     });

//     if (reference) {
//       setReference(r, 8, reference);
//     }

//     if (note) {
//       setLabel(r, 9, note);
//     }

//     ws.getRow(r).height = 20;
//   };

//   addIRBPRow({
//     label: "IR&D Labor",
//     reference: "Sched H",
//   });

//   addIRBPRow({
//     label: "B&P Labor",
//   });

//   addIRBPRow({
//     label: "Subtotal IR&D/B&P Labor",
//     fill: CYAN,
//     total: true,
//   });

//   addIRBPRow({
//     label: "IR&D Labor Fringe (NOTE 1)",
//     fill: CYAN,
//     reference: "Sched E",
//     note: "RATES",
//   });

//   addIRBPRow({
//     label: "B&P Labor Fringe (NOTE 1)",
//     fill: CYAN,
//     reference: "Sched H",
//     note: "RATES",
//   });

//   addIRBPRow({
//     label: "IR&D Material",
//   });

//   addIRBPRow({
//     label: "B&P Material",
//   });

//   addIRBPRow({
//     label: "IR&D Subcontract",
//     gray: true,
//   });

//   addIRBPRow({
//     label: "B&P Subcontract",
//     reference: "Sched H",
//   });

//   addIRBPRow({
//     label: "IR&D Other Costs",
//   });

//   addIRBPRow({
//     label: "B&P Other Costs",
//   });

//   addIRBPRow({
//     label: "TOTAL IR&D/B&P",
//     fill: CYAN,
//     total: true,
//   });

//   // =========================================================
//   // SCREEN 2
//   // =========================================================

//   r += 3;

//   const addContinuedRow = ({
//     label,
//     fill = YELLOW,
//     reference = "",
//     gray = false,
//     total = false,
//   }) => {
//     r++;

//     setLabel(r, 1, label, {
//       indent: 1,
//       bold: total,
//     });

//     setValue(r, 7, "-", {
//       fill: gray ? GRAY : fill,
//       bold: total,
//     });

//     if (reference) {
//       setReference(r, 8, reference);
//     }

//     ws.getRow(r).height = 20;
//   };

//   addContinuedRow({
//     label: "B&P Material",
//   });

//   addContinuedRow({
//     label: "IR&D Material Overhead (NOTE 1)",
//     gray: true,
//   });

//   addContinuedRow({
//     label: "B&P Material Overhead (NOTE 1)",
//     gray: true,
//   });

//   addContinuedRow({
//     label: "IR&D Other Costs",
//     reference: "Sched H",
//   });

//   addContinuedRow({
//     label: "B&P Other Costs",
//   });

//   addContinuedRow({
//     label: "TOTAL IR&D/B&P",
//     fill: CYAN,
//     total: true,
//   });

//   // =========================================================
//   // TOTAL DIRECT LABOR
//   // =========================================================

//   r += 2;

//   setLabel(r, 1, "TOTAL DIRECT LABOR", {
//     bold: true,
//   });

//   ws.getCell(r, 1).border = {
//     bottom: thinBlack,
//   };

//   r += 1;

//   setLabel(r, 1, "Total Contract Labor", {
//     indent: 1,
//   });

//   setValue(r, 5, amount(data.totalLabor), {
//     fill: CYAN,
//   });

//   setLabel(r, 7, "- see total above", {
//     indent: 1,
//   });

//   r++;

//   setLabel(r, 1, "Total IR&D/B&P Labor", {
//     indent: 1,
//   });

//   setValue(r, 5, amount(data.totalLabor), {
//     fill: CYAN,
//     borderBottom: true,
//   });

//   setLabel(r, 7, "to Schedule G and L", {
//     indent: 1,
//   });

//   r++;

//   setLabel(
//     r,
//     1,
//     "TOTAL CONTRACT/IR&D/B&P LABOR",
//     {
//       bold: true,
//     }
//   );

//   // =========================================================
//   // NOTES
//   // =========================================================

//   r += 2;

//   setLabel(r, 1, "Explanatory Notes:", {
//     bold: true,
//   });

//   ws.getCell(r, 1).font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//     underline: true,
//   };

//   r += 2;

//   ws.mergeCells(r, 1, r, 9);

//   setLabel(
//     r,
//     1,
//     "1. Total direct costs include teammate nonreimbursable fee, however burden not applied and did not claim it during the billing."
//   );

//   r++;

//   ws.mergeCells(r, 1, r, 9);

//   setLabel(
//     r,
//     1,
//     "2. Summary Schedule H represents total incurred costs per the General Ledger to ensure a complete tie-out to the FY 2025 Financial Statements. All contract-specific exclusions, unallowable costs, and limitations are itemized and adjusted on Schedule I and Supplement A-4 to reach the final claimed allowable totals."
//   );

//   ws.getRow(r).height = 35;

//   // =========================================================
//   // LEGEND
//   // =========================================================

//   r += 2;

//   const legendStart = r;

//   const legend = [
//     ["Linked to Other Worksheet", YELLOW, "As Referenced"],
//     ["Cell Contains a Formula", CYAN, "Totals, Claimed and Differences"],
//     [
//       "Cell Contains a Formula With Links",
//       GRAY,
//       "Complex formulas, linked between Sched E and H",
//     ],
//   ];

//   legend.forEach(([label, fill, explanation], index) => {
//     const row = legendStart + index;

//     ws.mergeCells(row, 1, row, 3);

//     const labelCell = ws.getCell(row, 1);

//     labelCell.value = label;
//     labelCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: fill },
//     };

//     labelCell.font = {
//       name: "Arial",
//       size: 10,
//     };

//     labelCell.alignment = {
//       horizontal: "left",
//       vertical: "middle",
//     };

//     ws.mergeCells(row, 4, row, 9);

//     const explanationCell = ws.getCell(row, 4);

//     explanationCell.value = explanation;
//     explanationCell.font = {
//       name: "Arial",
//       size: 10,
//     };

//     explanationCell.alignment = {
//       horizontal: "left",
//       vertical: "middle",
//     };

//     ws.getRow(row).height = 20;
//   });

//   // =========================================================
//   // GENERAL ALIGNMENT / FONT
//   // =========================================================

//   ws.eachRow((row) => {
//     row.eachCell((cell) => {
//       if (!cell.font || !cell.font.name) {
//         cell.font = {
//           name: "Arial",
//           size: 10,
//         };
//       }

//       if (!cell.alignment) {
//         cell.alignment = {
//           vertical: "middle",
//         };
//       }
//     });
//   });

//   // =========================================================
//   // PRINT / PAGE SETUP
//   // =========================================================

//   ws.views = [
//     {
//       showGridLines: false,
//       state: "normal",
//     },
//   ];

//   ws.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 2,
//     horizontalDpi: 300,
//     verticalDpi: 300,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.35,
//       bottom: 0.35,
//       header: 0.1,
//       footer: 0.1,
//     },
//   };

//   ws.pageSetup.printArea = `A1:I${r}`;

//   ws.pageSetup.horizontalCentered = false;

//   ws.freezePanes = {
//     xSplit: 0,
//     ySplit: 8,
//   };

//   return ws;
// };

// //Shcdule H
// const getScheduleHData = async (year = 2025) => {
//   const [ledgerResponse, ratesResponse] = await Promise.all([
//     fetch(`${backendUrl}/api/JobCostLedger`),
//     fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=${year}`),
//   ]);

//   if (!ledgerResponse.ok) {
//     throw new Error(`Job Cost Ledger API failed: ${ledgerResponse.status}`);
//   }

//   if (!ratesResponse.ok) {
//     throw new Error(`Schedule D(A) API failed: ${ratesResponse.status}`);
//   }

//   const ledgerData = await ledgerResponse.json();
//   const ratesData = await ratesResponse.json();

//   // =====================================================
//   // SAME RATE MAPPING AS SCHEDULE H JSX
//   // =====================================================

//   const rates = {
//     fringe: 0,
//     aeroFringe: 0,
//     custOH: 0,
//     colOH: 0,
//     smh: 0,
//     ga: 0,
//   };

//   if (ratesData?.schedules) {
//     ratesData.schedules.forEach((schedule) => {
//       const rate = Number(schedule.rate || 0) / 100;

//       if (schedule.name === "Fringe Pool") {
//         rates.fringe = rate;
//       } else if (schedule.name === "AERO Fringe") {
//         rates.aeroFringe = rate;
//       } else if (schedule.name === "Customer Site Overhead") {
//         rates.custOH = rate;
//       } else if (schedule.name === "Columbus Site Overhead") {
//         rates.colOH = rate;
//       } else if (schedule.name === "Subk & Material Handling") {
//         rates.smh = rate;
//       } else if (
//         schedule.name === "General and Administrative (G&A) Expenses"
//       ) {
//         rates.ga = rate;
//       }
//     });
//   }

//   // =====================================================
//   // SAME GROUPING AS JSX
//   // =====================================================

//   const grouped = {
//     A: {},
//     B: {},
//     C: {},
//     D: {},
//     E: {},
//   };

//   ledgerData
//     .filter((row) => Number(row.year) === Number(year))
//     .forEach((row) => {
//       const key = row.reportLvl || row.projId;

//       if (!key) return;

//       let section = "B";

//       const projectType = (row.projType || "").toUpperCase();

//       if (
//         projectType.includes("CPFF") ||
//         projectType.includes("COST") ||
//         projectType.includes("CPAF")
//       ) {
//         section = "A";
//       } else if (projectType.includes("T&M") || projectType.includes("TIME")) {
//         section = "C";
//       } else if (projectType.includes("FIXED") || projectType === "FFP") {
//         section = "D";
//       } else if (projectType.includes("COMMERCIAL")) {
//         section = "E";
//       }

//       if (!grouped[section][key]) {
//         grouped[section][key] = {
//           jobOrder: key,
//           contractNumber: row.primeCntrId || "",
//           subcontractNumber: row.subctrId || "",

//           laborOnsite: 0,
//           laborOffsite: 0,
//           laborAero: 0,

//           travel: 0,
//           material: 0,
//           odc: 0,
//           subcontracts: 0,
//           unburden: 0,
//         };
//       }

//       const amount = parseFloat(row.amount) || 0;

//       // =================================================
//       // LABOR
//       // =================================================

//       if (row.acctId === "50-00-01" || row.acctId === "50-00-98") {
//         if (row.orgId === "1.1.01") {
//           grouped[section][key].laborAero += amount;
//         } else {
//           grouped[section][key].laborOnsite += amount;
//         }
//       }

//       // =================================================
//       // OFFSITE LABOR
//       // =================================================
//       else if (row.acctId === "50-00-02") {
//         grouped[section][key].laborOffsite += amount;
//       }

//       // =================================================
//       // TRAVEL
//       // =================================================
//       else if (
//         row.acctId &&
//         (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
//       ) {
//         grouped[section][key].travel += amount;
//       }

//       // =================================================
//       // MATERIAL
//       // =================================================
//       else if (["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)) {
//         grouped[section][key].material += amount;
//       }

//       // =================================================
//       // ODC
//       // =================================================
//       else if (["50-50-01", "50-50-02", "50-50-03"].includes(row.acctId)) {
//         grouped[section][key].odc += amount;
//       }

//       // =================================================
//       // SUBCONTRACTS
//       // =================================================
//       else if (
//         ["50-21-01", "50-21-02", "50-21-03", "50-21-04", "50-22-01"].includes(
//           row.acctId,
//         )
//       ) {
//         grouped[section][key].subcontracts += amount;
//       }

//       // =================================================
//       // UNBURDEN TEAMMATE COST
//       // =================================================
//       else if (["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)) {
//         grouped[section][key].unburden += amount;
//       }
//     });

//   // =====================================================
//   // SAME FORMAT/CALCULATION AS JSX
//   // =====================================================

//   const formatSection = (sectionObject) => {
//     return Object.values(sectionObject).map((item) => {
//       // -----------------------------------------------
//       // Direct Labor
//       // -----------------------------------------------

//       const totalLabor = item.laborOnsite + item.laborOffsite + item.laborAero;

//       // -----------------------------------------------
//       // Direct Costs
//       // -----------------------------------------------

//       const totalDirectCosts =
//         totalLabor +
//         item.travel +
//         item.material +
//         item.odc +
//         item.subcontracts +
//         item.unburden;

//       // -----------------------------------------------
//       // Fringe
//       // -----------------------------------------------

//       const fringeOnsite = item.laborOnsite * rates.fringe;

//       const fringeOffsite = item.laborOffsite * rates.fringe;

//       const fringeAero = item.laborAero * rates.aeroFringe;

//       // -----------------------------------------------
//       // Overhead
//       // Same formulas as JSX
//       // -----------------------------------------------

//       const ohOnsite =
//         (item.laborOnsite + fringeOnsite + item.laborAero + fringeAero) *
//         rates.custOH;

//       const ohOffsite = (item.laborOffsite + totalLabor) * rates.colOH;

//       const ohSMH = (item.material + item.subcontracts) * rates.smh;

//       // -----------------------------------------------
//       // Total Indirect Costs
//       // -----------------------------------------------

//       const totalIndirectCosts =
//         fringeOnsite +
//         fringeOffsite +
//         fringeAero +
//         ohOnsite +
//         ohOffsite +
//         ohSMH;

//       // -----------------------------------------------
//       // Direct + OH
//       // -----------------------------------------------

//       const directPlusOH = totalDirectCosts + totalIndirectCosts;

//       // -----------------------------------------------
//       // G&A Base
//       // -----------------------------------------------

//       const gaBase =
//         directPlusOH -
//         (item.travel +
//           item.material +
//           item.odc +
//           item.subcontracts +
//           item.unburden);

//       // -----------------------------------------------
//       // G&A Applied
//       // -----------------------------------------------

//       const gaApplied = gaBase * rates.ga;

//       // -----------------------------------------------
//       // Total Costs
//       // -----------------------------------------------

//       const totalCosts = directPlusOH + gaApplied;

//       return {
//         jobOrder: item.jobOrder,
//         contractNumber: item.contractNumber,
//         subcontractNumber: item.subcontractNumber,

//         laborOnsite: item.laborOnsite,
//         laborOffsite: item.laborOffsite,
//         laborAero: item.laborAero,

//         totalLabor,

//         travel: item.travel,
//         material: item.material,
//         odc: item.odc,
//         subcontracts: item.subcontracts,
//         unburden: item.unburden,

//         totalDirectCosts,

//         fringeOnsite,
//         fringeOffsite,
//         fringeAero,

//         ohOnsite,
//         ohOffsite,
//         ohSMH,

//         directPlusOH,
//         gaBase,
//         gaApplied,
//         totalCosts,
//       };
//     });
//   };

//   return {
//     rates,

//     sectionA: formatSection(grouped.A),
//     sectionB: formatSection(grouped.B),
//     sectionC: formatSection(grouped.C),
//     sectionD: formatSection(grouped.D),
//     sectionE: formatSection(grouped.E),
//   };
// };

// const addScheduleH = async (workbook, companyName, companyAddress, year = 2025) => {
//   const { rates, sectionA, sectionB, sectionC, sectionD, sectionE } =
//     await getScheduleHData(year);

//   const ws = workbook.addWorksheet("Schedule H");

//   // =====================================================
//   // SAME HEADERS AS JSX
//   // =====================================================

//   const headers = [
//     "JOB ORDER",
//     "CONTRACT NUMBER",
//     "SUBCONTRACT NUMBER",
//     "Labor OH - Onsite",
//     "Labor OH - Offsite",
//     "Labor AERO OH Onsite",
//     "Total Labor",
//     "Travel",
//     "Material",
//     "ODC",
//     "Sub-Contracts",
//     "Unburden Teammate Cost",
//     "Direct Costs",
//     "Claimed Fringe OH - Onsite",
//     "Claimed Fringe OH - Offsite",
//     "Claimed Fringe AERO OH Onsite",
//     "Claimed O/H OH - Onsite",
//     "Claimed O/H OH - Offsite",
//     "Claimed O/H SM&H",
//     "Direct Costs Plus O/H & Fringe",
//     "G&A Base (Value Added)",
//     "Claimed G&A Applied",
//     "Total Costs",
//     "Total COM",
//     "Grand Total",
//   ];

//   // =====================================================
//   // COLORS
//   // =====================================================

//   const CYAN = "FF29BEC2";
//   const GREY = "FFA8A8A8";
//   const LIGHT_GREY = "FFF1F1F1";
//   const HEADER_GREY = "FFEFEFEF";
//   const YELLOW = "FFFFFF00";
//   const BLUE = "FF29258F";
//   const BLACK = "FF444444";
//   const WHITE = "FFFFFFFF";

//   // Same cell background logic as JSX
//   const cellBg = (index) => {
//     if ([6, 12, 19, 20, 22, 24].includes(index)) {
//       return CYAN;
//     }

//     if (index >= 13 && index <= 18) {
//       return GREY;
//     }

//     return LIGHT_GREY;
//   };

//   // =====================================================
//   // COLUMN WIDTHS
//   // =====================================================

//   const widths = [
//     16, 28, 24, 17, 17, 20, 15, 13, 13, 12, 17, 22, 17, 20, 20, 23, 20, 20, 18,
//     25, 22, 20, 17, 17, 17,
//   ];

//   ws.columns = headers.map((header, index) => ({
//     header,
//     key: `col${index}`,
//     width: widths[index],
//   }));

//   // =====================================================
//   // HEADER
//   // =====================================================

//   ws.mergeCells("A1:C1");

//   ws.getCell("A1").value = "Schedule H is linked to the following schedules:";

//   ws.getCell("A2").value = "Schedule A - Applied Overhead, G&A, & COM Rates";

//   ws.getCell("A3").value = "Summary Schedule H";

//   ws.getCell("A4").value = "Schedule H-1 Govt Participation";

//   ws.getCell("A5").value = "ICE MANUAL";

//   ws.getCell("A5").font = {
//     color: {
//       argb: "FF0D2B86",
//     },
//     underline: true,
//   };

//   // Company
//   ws.mergeCells("D1:T1");
//   ws.mergeCells("D2:T2");

//   ws.getCell("D1").value = companyName;

//   ws.getCell("D2").value = companyAddress;

//   ["D1", "D2"].forEach((cellAddress) => {
//     const cell = ws.getCell(cellAddress);

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: YELLOW,
//       },
//     };

//     cell.font = {
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };
//   });

//   // Title
//   ws.mergeCells("D4:T4");
//   ws.mergeCells("D5:T5");

//   ws.getCell("D4").value = "Schedule of Direct Costs by Contract/Subcontract";

//   ws.getCell("D5").value = "and Indirect Expense Applied at Claimed Rates";

//   ["D4", "D5"].forEach((cellAddress) => {
//     ws.getCell(cellAddress).font = {
//       bold: true,
//     };

//     ws.getCell(cellAddress).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };
//   });

//   ws.mergeCells("D6:T6");

//   ws.getCell("D6").value = `Fiscal Year End - 12/31/${year}`;

//   ws.getCell("D6").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: YELLOW,
//     },
//   };

//   ws.getCell("D6").font = {
//     bold: true,
//   };

//   ws.getCell("D6").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // Schedule H
//   ws.mergeCells("U1:Y1");
//   ws.mergeCells("U2:Y2");

//   ws.getCell("U1").value = "SCHEDULE H";

//   ws.getCell("U2").value = "ICE (version 2.0.1h)";

//   ws.getCell("U1").font = {
//     bold: true,
//   };

//   ws.getCell("U2").font = {
//     bold: true,
//   };

//   ws.getCell("U1").alignment = {
//     horizontal: "center",
//   };

//   ws.getCell("U2").alignment = {
//     horizontal: "center",
//   };

//   // =====================================================
//   // SCHED A REFERENCE BARS
//   // =====================================================

//   ws.mergeCells("T8:U8");

//   ws.getCell("T8").value = "Sched A";

//   ws.getCell("T8").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: BLUE,
//     },
//   };

//   ws.getCell("T8").font = {
//     bold: true,
//     color: {
//       argb: WHITE,
//     },
//     underline: true,
//   };

//   ws.getCell("T8").alignment = {
//     horizontal: "center",
//   };

//   ws.getCell("Y8").value = "Sched A";

//   ws.getCell("Y8").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: BLUE,
//     },
//   };

//   ws.getCell("Y8").font = {
//     bold: true,
//     color: {
//       argb: WHITE,
//     },
//     underline: true,
//   };

//   ws.getCell("Y8").alignment = {
//     horizontal: "center",
//   };

//   // =====================================================
//   // TABLE HEADER
//   // =====================================================

//   const headerRow = ws.addRow(headers);

//   headerRow.height = 48;

//   headerRow.eachCell((cell, columnNumber) => {
//     const index = columnNumber - 1;

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: HEADER_GREY,
//       },
//     };

//     cell.font = {
//       bold: true,
//       size: 9,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };

//     cell.border = {
//       right: {
//         style: "thin",
//         color: {
//           argb: BLACK,
//         },
//       },
//       bottom: {
//         style: "thin",
//         color: {
//           argb: BLACK,
//         },
//       },
//     };
//   });

//   // =====================================================
//   // ROW FORMATTER
//   // =====================================================

//   const addDataRow = (item) => {
//     const values = [
//       item.jobOrder,
//       item.contractNumber,
//       item.subcontractNumber,

//       item.laborOnsite,
//       item.laborOffsite,
//       item.laborAero,
//       item.totalLabor,

//       item.travel,
//       item.material,
//       item.odc,
//       item.subcontracts,
//       item.unburden,

//       item.totalDirectCosts,

//       item.fringeOnsite,
//       item.fringeOffsite,
//       item.fringeAero,

//       item.ohOnsite,
//       item.ohOffsite,
//       item.ohSMH,

//       item.directPlusOH,
//       item.gaBase,
//       item.gaApplied,
//       item.totalCosts,

//       0,

//       item.totalCosts,
//     ];

//     const row = ws.addRow(values);

//     row.height = 18;

//     row.eachCell((cell, columnNumber) => {
//       const index = columnNumber - 1;

//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: cellBg(index),
//         },
//       };

//       cell.border = {
//         right: {
//           style: "thin",
//           color: {
//             argb: BLACK,
//           },
//         },
//         bottom: {
//           style: "thin",
//           color: {
//             argb: BLACK,
//           },
//         },
//       };

//       cell.alignment = {
//         horizontal: index < 3 ? "left" : "right",
//         vertical: "middle",
//       };

//       if (index >= 3) {
//         cell.numFmt = "#,##0;(#,##0);-";
//       }
//     });

//     return row;
//   };

//   // =====================================================
//   // SECTION
//   // =====================================================

//   const addSection = (title, rows, totalLabel, emptyRows = 1) => {
//     const sectionRow = ws.addRow([title]);

//     ws.mergeCells(`A${sectionRow.number}:Y${sectionRow.number}`);

//     sectionRow.getCell(1).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: "FFD0D0D0",
//       },
//     };

//     sectionRow.getCell(1).font = {
//       bold: true,
//       size: 11,
//     };

//     sectionRow.getCell(1).alignment = {
//       vertical: "middle",
//     };

//     if (rows.length === 0) {
//       for (let i = 0; i < emptyRows; i++) {
//         const empty = Array(headers.length).fill("");

//         const emptyRow = ws.addRow(empty);

//         emptyRow.height = 18;

//         emptyRow.eachCell((cell, columnNumber) => {
//           const index = columnNumber - 1;

//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: {
//               argb: cellBg(index),
//             },
//           };

//           cell.border = {
//             right: {
//               style: "thin",
//               color: {
//                 argb: BLACK,
//               },
//             },
//             bottom: {
//               style: "thin",
//               color: {
//                 argb: BLACK,
//               },
//             },
//           };
//         });
//       }
//     } else {
//       rows.forEach(addDataRow);
//     }

//     // Blank row
//     ws.addRow([]);

//     // =================================================
//     // TOTAL
//     // =================================================

//     const totals = calculateScheduleHTotal(rows);

//     const totalValues = [
//       "",
//       "",
//       "",
//       totals.laborOnsite,
//       totals.laborOffsite,
//       totals.laborAero,
//       totals.totalLabor,
//       totals.travel,
//       totals.material,
//       totals.odc,
//       totals.subcontracts,
//       totals.unburden,
//       totals.totalDirectCosts,
//       totals.fringeOnsite,
//       totals.fringeOffsite,
//       totals.fringeAero,
//       totals.ohOnsite,
//       totals.ohOffsite,
//       totals.ohSMH,
//       totals.directPlusOH,
//       totals.gaBase,
//       totals.gaApplied,
//       totals.totalCosts,
//       0,
//       totals.totalCosts,
//     ];

//     const totalRow = ws.addRow(totalValues);

//     totalRow.height = 18;

//     // Merge first 3 cells for label
//     ws.mergeCells(`A${totalRow.number}:C${totalRow.number}`);

//     totalRow.getCell(1).value = totalLabel;

//     totalRow.getCell(1).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };

//     totalRow.getCell(1).font = {
//       bold: true,
//     };

//     totalRow.getCell(1).alignment = {
//       vertical: "middle",
//     };

//     for (let col = 4; col <= headers.length; col++) {
//       const cell = totalRow.getCell(col);

//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: CYAN,
//         },
//       };

//       cell.font = {
//         bold: true,
//       };

//       cell.alignment = {
//         horizontal: "right",
//         vertical: "middle",
//       };

//       cell.numFmt = "#,##0;(#,##0);-";

//       cell.border = {
//         right: {
//           style: "thin",
//           color: {
//             argb: BLACK,
//           },
//         },
//         bottom: {
//           style: "thin",
//           color: {
//             argb: BLACK,
//           },
//         },
//       };
//     }
//   };

//   // =====================================================
//   // TOTAL CALCULATION
//   // SAME AS calcTotal() IN JSX
//   // =====================================================

//   const calculateScheduleHTotal = (rows) => {
//     const totals = {
//       laborOnsite: 0,
//       laborOffsite: 0,
//       laborAero: 0,
//       totalLabor: 0,

//       travel: 0,
//       material: 0,
//       odc: 0,
//       subcontracts: 0,
//       unburden: 0,

//       totalDirectCosts: 0,

//       fringeOnsite: 0,
//       fringeOffsite: 0,
//       fringeAero: 0,

//       ohOnsite: 0,
//       ohOffsite: 0,
//       ohSMH: 0,

//       directPlusOH: 0,
//       gaBase: 0,
//       gaApplied: 0,
//       totalCosts: 0,
//     };

//     rows.forEach((item) => {
//       totals.laborOnsite += Number(item.laborOnsite || 0);

//       totals.laborOffsite += Number(item.laborOffsite || 0);

//       totals.laborAero += Number(item.laborAero || 0);

//       totals.totalLabor += Number(item.totalLabor || 0);

//       totals.travel += Number(item.travel || 0);

//       totals.material += Number(item.material || 0);

//       totals.odc += Number(item.odc || 0);

//       totals.subcontracts += Number(item.subcontracts || 0);

//       totals.unburden += Number(item.unburden || 0);

//       totals.totalDirectCosts += Number(item.totalDirectCosts || 0);

//       totals.fringeOnsite += Number(item.fringeOnsite || 0);

//       totals.fringeOffsite += Number(item.fringeOffsite || 0);

//       totals.fringeAero += Number(item.fringeAero || 0);

//       totals.ohOnsite += Number(item.ohOnsite || 0);

//       totals.ohOffsite += Number(item.ohOffsite || 0);

//       totals.ohSMH += Number(item.ohSMH || 0);

//       totals.directPlusOH += Number(item.directPlusOH || 0);

//       totals.gaBase += Number(item.gaBase || 0);

//       totals.gaApplied += Number(item.gaApplied || 0);

//       totals.totalCosts += Number(item.totalCosts || 0);
//     });

//     return totals;
//   };

//   // =====================================================
//   // SECTIONS A-E
//   // =====================================================

//   addSection(
//     "A. COST TYPE (no entry on title line)",
//     sectionA,
//     "A. TOTAL COST TYPE:",
//     1,
//   );

//   addSection(
//     "B. OTHER FLEXIBLY PRICED",
//     sectionB,
//     "B. TOTAL OTHER FLEXIBLY PRICED",
//     2,
//   );

//   addSection("C. TIME & MAT'L", sectionC, "C. TOTAL TIME & MAT'L", 1);

//   addSection("D. FIXED PRICE", sectionD, "D. TOTAL FIXED PRICE", 2);

//   addSection("E. COMMERCIAL WORK", sectionE, "E. TOTAL COMMERCIAL WORK", 2);

//   // =====================================================
//   // GRAND CONTRACT TOTAL
//   // =====================================================

//   const allRows = [
//     ...sectionA,
//     ...sectionB,
//     ...sectionC,
//     ...sectionD,
//     ...sectionE,
//   ];

//   const grandTotals = calculateScheduleHTotal(allRows);

//   const grandValues = [
//     "",
//     "",
//     "",
//     grandTotals.laborOnsite,
//     grandTotals.laborOffsite,
//     grandTotals.laborAero,
//     grandTotals.totalLabor,
//     grandTotals.travel,
//     grandTotals.material,
//     grandTotals.odc,
//     grandTotals.subcontracts,
//     grandTotals.unburden,
//     grandTotals.totalDirectCosts,
//     grandTotals.fringeOnsite,
//     grandTotals.fringeOffsite,
//     grandTotals.fringeAero,
//     grandTotals.ohOnsite,
//     grandTotals.ohOffsite,
//     grandTotals.ohSMH,
//     grandTotals.directPlusOH,
//     grandTotals.gaBase,
//     grandTotals.gaApplied,
//     grandTotals.totalCosts,
//     0,
//     grandTotals.totalCosts,
//   ];

//   const contractTotalRow = ws.addRow(grandValues);

//   ws.mergeCells(`A${contractTotalRow.number}:C${contractTotalRow.number}`);

//   contractTotalRow.getCell(1).value = "TOTAL CONTRACT COSTS";

//   contractTotalRow.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: CYAN,
//     },
//   };

//   contractTotalRow.getCell(1).font = {
//     bold: true,
//   };

//   for (let col = 4; col <= headers.length; col++) {
//     const cell = contractTotalRow.getCell(col);

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };

//     cell.font = {
//       bold: true,
//     };

//     cell.numFmt = "#,##0;(#,##0);-";

//     cell.alignment = {
//       horizontal: "right",
//     };
//   }

//   // =====================================================
//   // IR&D
//   // =====================================================

//   const irndRow = ws.addRow(Array(headers.length).fill("-"));

//   irndRow.getCell(1).value = "";
//   irndRow.getCell(2).value = "IR & D";

//   // =====================================================
//   // B&P
//   // =====================================================

//   const bnpRow = ws.addRow(Array(headers.length).fill("-"));

//   bnpRow.getCell(1).value = "";
//   bnpRow.getCell(2).value = "B&P";

//   // =====================================================
//   // TOTAL IR&D / B&P
//   // JSX uses all "-"
//   // =====================================================

//   const irndBnpTotal = ws.addRow(Array(headers.length).fill("-"));

//   ws.mergeCells(`A${irndBnpTotal.number}:C${irndBnpTotal.number}`);

//   irndBnpTotal.getCell(1).value = "TOTAL IR & D/B & P";

//   irndBnpTotal.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: CYAN,
//     },
//   };

//   irndBnpTotal.getCell(1).font = {
//     bold: true,
//   };

//   for (let col = 4; col <= headers.length; col++) {
//     irndBnpTotal.getCell(col).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };
//   }

//   // =====================================================
//   // GRAND TOTAL
//   // =====================================================

//   const grandTotalRow = ws.addRow(grandValues);

//   ws.mergeCells(`A${grandTotalRow.number}:C${grandTotalRow.number}`);

//   grandTotalRow.getCell(1).value = "GRAND TOTAL";

//   grandTotalRow.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: CYAN,
//     },
//   };

//   grandTotalRow.getCell(1).font = {
//     bold: true,
//   };

//   for (let col = 4; col <= headers.length; col++) {
//     const cell = grandTotalRow.getCell(col);

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: CYAN,
//       },
//     };

//     cell.font = {
//       bold: true,
//     };

//     cell.numFmt = "#,##0;(#,##0);-";
//   }

//   // =====================================================
//   // EXPLANATORY NOTES
//   // =====================================================

//   ws.addRow([]);
//   ws.addRow([]);

//   const notesTitle = ws.addRow(["Explanatory Notes:"]);

//   ws.mergeCells(`A${notesTitle.number}:Y${notesTitle.number}`);

//   notesTitle.getCell(1).font = {
//     bold: true,
//     underline: true,
//   };

//   ws.addRow(["1. Direct costs not claimed are explained in Schedule G"]);

//   ws.addRow([
//     "2. Claimed indirect expense rates are applicable to cost-type and flexibly-priced effort.",
//   ]);

//   ws.addRow([
//     "3. Teammate cost ODC, Travel and Fee, doesn't apply the burden as per contract requirement. Hense shown separately on the schedule.",
//   ]);

//   // =====================================================
//   // LEGEND
//   // =====================================================

//   ws.addRow([]);

//   const legend1 = ws.addRow(["Linked to Other Worksheet"]);

//   ws.mergeCells(`A${legend1.number}:C${legend1.number}`);

//   legend1.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: YELLOW,
//     },
//   };

//   const legend2 = ws.addRow(["Cell Contains a Formula"]);

//   ws.mergeCells(`A${legend2.number}:C${legend2.number}`);

//   legend2.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: CYAN,
//     },
//   };

//   const legend3 = ws.addRow([
//     "Cell Contains a Formula With Links",
//     "",
//     "",
//     "Complex Formulas, using Claimed Rates from Schedule A",
//   ]);

//   ws.mergeCells(`A${legend3.number}:C${legend3.number}`);

//   ws.mergeCells(`D${legend3.number}:J${legend3.number}`);

//   legend3.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: GREY,
//     },
//   };

//   legend3.getCell(4).alignment = {
//     vertical: "middle",
//   };

//   // =====================================================
//   // FREEZE
//   // =====================================================

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 9,
//     },
//   ];

//   // =====================================================
//   // PAGE SETUP
//   // =====================================================

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//   };

//   ws.pageSetup.margins = {
//     left: 0.25,
//     right: 0.25,
//     top: 0.5,
//     bottom: 0.5,
//     header: 0.2,
//     footer: 0.2,
//   };
// };

// // Schedule J

// const STORAGE_KEY = "sched-j-section-rows";

// const getScheduleJData = () => {
//   try {
//     const stored = localStorage.getItem("sched-j-section-rows");

//     if (!stored) {
//       return {
//         costType: [],
//         tm: [],
//         incentive: [],
//         idiq: [],
//         interdivision: [],
//       };
//     }

//     const parsed = JSON.parse(stored);

//     return {
//       costType: Array.isArray(parsed?.costType) ? parsed.costType : [],
//       tm: Array.isArray(parsed?.tm) ? parsed.tm : [],
//       incentive: Array.isArray(parsed?.incentive) ? parsed.incentive : [],
//       idiq: Array.isArray(parsed?.idiq) ? parsed.idiq : [],
//       interdivision: Array.isArray(parsed?.interdivision)
//         ? parsed.interdivision
//         : [],
//     };
//   } catch (error) {
//     console.error("Unable to load Schedule J data:", error);

//     return {
//       costType: [],
//       tm: [],
//       incentive: [],
//       idiq: [],
//       interdivision: [],
//     };
//   }
// };

// const addScheduleJ = async (
//   workbook,
//   { companyName = "", companyAddress = "", fiscalYearEnd = "2025-12-31" } = {},
// ) => {
//   const sectionRows = getScheduleJData();

//   const ws = workbook.addWorksheet("Schedule J");

//   // ---------------------------------------------------------
//   // HEADER
//   // ---------------------------------------------------------

//   ws.mergeCells("A1:L1");
//   ws.getCell("A1").value = companyName;
//   ws.getCell("A1").font = {
//     name: "Times New Roman",
//     size: 14,
//     bold: true,
//   };
//   ws.getCell("A1").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };
//   ws.getCell("A1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.mergeCells("A2:L2");
//   ws.getCell("A2").value = companyAddress;
//   ws.getCell("A2").font = {
//     name: "Times New Roman",
//     size: 14,
//     bold: true,
//   };
//   ws.getCell("A2").alignment = {
//     horizontal: "center",
//   };
//   ws.getCell("A2").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.mergeCells("A4:L4");
//   ws.getCell("A4").value = "Subcontractor Information";
//   ws.getCell("A4").font = {
//     name: "Times New Roman",
//     size: 15,
//     bold: true,
//   };
//   ws.getCell("A4").alignment = {
//     horizontal: "center",
//   };

//   ws.mergeCells("A5:L5");
//   ws.getCell("A5").value = `Fiscal Year End - ${fiscalYearEnd}`;
//   ws.getCell("A5").font = {
//     name: "Times New Roman",
//     size: 14,
//     bold: true,
//   };
//   ws.getCell("A5").alignment = {
//     horizontal: "center",
//   };
//   ws.getCell("A5").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   // ---------------------------------------------------------
//   // TABLE HEADERS
//   // ---------------------------------------------------------

//   const headers = [
//     "",
//     "SUBCONTRACT NO.",
//     "PRIME CONTRACT NO.",
//     "PRIME CONTRACT VALUE",
//     "SUBCONTRACTOR'S NAME & ADDRESS",
//     "SUBCONTRACTOR'S DUNS NUMBER",
//     "POINT OF CONTACT AND PHONE NO.",
//     "SUBCONTRACT VALUE",
//     "Performance From",
//     "Performance To",
//     "SUBCONTRACT INCURRED IN FY 2009",
//     "AWARD TYPE",
//   ];

//   let currentRow = 7;

//   const writeHeader = () => {
//     const row = ws.getRow(currentRow);

//     headers.forEach((header, index) => {
//       const cell = row.getCell(index + 1);

//       cell.value = header;

//       cell.font = {
//         name: "Arial",
//         size: 9,
//         bold: true,
//       };

//       cell.alignment = {
//         horizontal: "center",
//         vertical: "middle",
//         wrapText: true,
//       };

//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFE4F5FC" },
//       };

//       cell.border = {
//         top: { style: "thin", color: { argb: "FFC9E5F2" } },
//         bottom: { style: "thin", color: { argb: "FFC9E5F2" } },
//         left: { style: "thin", color: { argb: "FFC9E5F2" } },
//         right: { style: "thin", color: { argb: "FFC9E5F2" } },
//       };
//     });

//     row.height = 42;
//     currentRow++;
//   };

//   // ---------------------------------------------------------
//   // SECTION WRITER
//   // ---------------------------------------------------------

//   const writeSection = (title, rows) => {
//     ws.mergeCells(currentRow, 1, currentRow, 12);

//     const sectionCell = ws.getCell(currentRow, 1);

//     sectionCell.value = title;

//     sectionCell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//       color: { argb: "FF12384A" },
//     };

//     sectionCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFEAF7FB" },
//     };

//     sectionCell.alignment = {
//       vertical: "middle",
//       horizontal: "left",
//       wrapText: true,
//     };

//     currentRow++;

//     writeHeader();

//     if (!rows || rows.length === 0) {
//       const row = ws.getRow(currentRow);

//       row.getCell(1).value = "No data available";

//       ws.mergeCells(currentRow, 1, currentRow, 12);

//       row.getCell(1).alignment = {
//         horizontal: "center",
//         vertical: "middle",
//       };

//       row.getCell(1).font = {
//         name: "Arial",
//         size: 9,
//         color: { argb: "FF8AA4B2" },
//       };

//       currentRow++;

//       return;
//     }

//     rows.forEach((dataRow) => {
//       const row = ws.getRow(currentRow);

//       for (let i = 0; i < 11; i++) {
//         let value = dataRow?.[i] ?? "";

//         // Amount columns:
//         // 2 = Prime Contract Value
//         // 6 = Subcontract Value
//         // 9 = Subcontract Incurred
//         if ([2, 6, 9].includes(i)) {
//           const numericValue = Number(
//             String(value).replace(/[$,]/g, "").trim(),
//           );

//           value =
//             value !== "" && Number.isFinite(numericValue) ? numericValue : "";
//         }

//         const cell = row.getCell(i + 2);

//         cell.value = value;

//         cell.font = {
//           name: "Arial",
//           size: 9,
//         };

//         cell.alignment = {
//           horizontal: [3, 5].includes(i) ? "left" : "center",
//           vertical: "middle",
//           wrapText: true,
//         };

//         cell.border = {
//           top: { style: "thin", color: { argb: "FFD7E8EF" } },
//           bottom: { style: "thin", color: { argb: "FFD7E8EF" } },
//           left: { style: "thin", color: { argb: "FFD7E8EF" } },
//           right: { style: "thin", color: { argb: "FFD7E8EF" } },
//         };

//         if ([2, 6, 9].includes(i)) {
//           cell.numFmt = "$#,##0.00;($#,##0.00);-";
//           cell.alignment = {
//             horizontal: "right",
//             vertical: "middle",
//           };
//         }
//       }

//       // First column is the selection checkbox in the UI.
//       // Excel does not need the checkbox.
//       row.getCell(1).value = "";

//       row.height = 31;

//       currentRow++;
//     });

//     currentRow += 1;
//   };

//   // ---------------------------------------------------------
//   // SECTIONS — SAME ORDER AS JSX
//   // ---------------------------------------------------------

//   const sectionMap = [
//     {
//       id: "costType",
//       title:
//         "Cost-type subcontracts issued under flexibly priced prime contracts",
//     },
//     {
//       id: "tm",
//       title: "T&M/LH subcontracts issued under flexibly priced prime contracts",
//     },
//     {
//       id: "incentive",
//       title: "Incentive subcontracts under flexibly priced prime contracts",
//     },
//     {
//       id: "idiq",
//       title:
//         "Subcontract orders based on cost issued under IDIQ prime contracts",
//     },
//     {
//       id: "interdivision",
//       title:
//         "Inter-divisional/intercompany and FFP effort issued under flexibly priced prime contracts",
//     },
//   ];

//   sectionMap.forEach((section) => {
//     writeSection(section.title, sectionRows[section.id]);
//   });

//   // ---------------------------------------------------------
//   // NOTE — STATIC UI TEXT FROM JSX
//   // ---------------------------------------------------------

//   ws.mergeCells(currentRow, 1, currentRow, 12);

//   const noteCell = ws.getCell(currentRow, 1);

//   noteCell.value =
//     "Note: Subject schedule is to provide identification of subcontracts you have awarded to companies for which you are the prime or upper-tier contractor, including inter-divisional effort. This information is required at the pricing action level (e.g. delivery order, CLIN) for all subcontract awards (e.g. cost-type, incentive contracts, T&M/LH, FFP etc.) issued under flexibly-priced and IDIQ prime contracts.";

//   noteCell.font = {
//     name: "Arial",
//     size: 9,
//     color: { argb: "FF49616D" },
//   };

//   noteCell.alignment = {
//     vertical: "top",
//     wrapText: true,
//   };

//   noteCell.fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFF7F9FA" },
//   };

//   noteCell.border = {
//     top: { style: "thin", color: { argb: "FFD3E0E6" } },
//     bottom: { style: "thin", color: { argb: "FFD3E0E6" } },
//     left: { style: "thin", color: { argb: "FFD3E0E6" } },
//     right: { style: "thin", color: { argb: "FFD3E0E6" } },
//   };

//   ws.getRow(currentRow).height = 55;

//   // ---------------------------------------------------------
//   // COLUMN WIDTHS
//   // ---------------------------------------------------------

//   const widths = [4, 17, 18, 17, 28, 20, 24, 17, 15, 15, 22, 15];

//   widths.forEach((width, index) => {
//     ws.getColumn(index + 1).width = width;
//   });

//   // ---------------------------------------------------------
//   // FREEZE / PRINT
//   // ---------------------------------------------------------

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 7,
//     },
//   ];

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.4,
//       bottom: 0.4,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   ws.pageSetup.printArea = `A1:L${currentRow}`;

//   return ws;
// };

// //Schedule K

// const getScheduleIData = async (year = FISCAL_YEAR) => {
//   const [ledgerRes, schedKRes, scheduleIRes] = await Promise.all([
//     fetch(`${backendUrl}/api/JobCostLedger`),
//     fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
//     fetch(`${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${year}`),
//   ]);

//   if (!ledgerRes.ok) throw new Error(`Job Cost Ledger API failed: ${ledgerRes.status}`);
//   if (!schedKRes.ok) throw new Error(`Schedule K API failed: ${schedKRes.status}`);
//   if (!scheduleIRes.ok) throw new Error(`Schedule I API failed: ${scheduleIRes.status}`);

//   const [ledgerData, schedKData, scheduleIData] = await Promise.all([
//     ledgerRes.json(),
//     schedKRes.json(),
//     scheduleIRes.json(),
//   ]);
//   const savedByOrder = new Map(
//     (Array.isArray(scheduleIData) ? scheduleIData : [])
//       .filter((item) => item.reportLvl)
//       .map((item) => [String(item.reportLvl).trim(), item]),
//   );
//   const contractLookup = new Map();
//   const flexGroups = new Map();

//   (Array.isArray(ledgerData) ? ledgerData : []).forEach((item) => {
//     const order = item.reportLvl || item.projId;
//     if (!order) return;

//     const key = String(order).trim();
//     if (!contractLookup.has(key)) {
//       contractLookup.set(key, {
//         contract: item.primeCntrId || "",
//         sub: item.subctrId || "",
//       });
//     }

//     if (Number(item.year) !== year) return;
//     const projectType = String(item.projType || "").toUpperCase();
//     if (!projectType.includes("CPFF") && !projectType.includes("CPAF")) return;

//     const group = flexGroups.get(key) || {
//       contract: item.primeCntrId || "",
//       sub: item.subctrId || "",
//       order: key,
//       amount: 0,
//     };
//     group.amount += Number(item.amount) || 0;
//     flexGroups.set(key, group);
//   });

//   const makeRow = (item, order) => {
//     const saved = savedByOrder.get(order) || {};
//     const currentYear = Number(item.amount) || 0;
//     const priorYear = numberValue(saved.pyCost);
//     const cumulative = priorYear + currentYear;
//     const netCumulative =
//       saved.netCum !== null && saved.netCum !== undefined
//         ? numberValue(saved.netCum)
//         : cumulative;
//     const limitation = cumulative - netCumulative;
//     const billedAmount = numberValue(saved.billedAmt);
//     const billedDate = saved.billedDt ? new Date(saved.billedDt) : null;

//     return {
//       contract: item.contract || saved.primeCntrId || "",
//       sub: item.sub || saved.subctrId || "",
//       order,
//       penalty: saved.penaltyClause ?? saved.penalty_Clause ?? "",
//       settled: numberValue(saved.pyrSettledAmt ?? saved.pyr_Settled_Amt),
//       priorYear,
//       currentYear,
//       cumulative,
//       limitation,
//       netCumulative,
//       pvNo: saved.pvNo || "",
//       billedDate:
//         billedDate && !Number.isNaN(billedDate.getTime()) ? billedDate : null,
//       billedAmount,
//       overUnder: billedAmount - netCumulative,
//       complete: Boolean(saved.completeFl),
//       note: saved.note ?? saved.Note ?? "",
//     };
//   };

//   const flexRows = Array.from(flexGroups.values()).map((item) =>
//     makeRow(item, String(item.order).trim()),
//   );
//   const tmGroups = new Map();
//   (Array.isArray(schedKData) ? schedKData : []).forEach((item) => {
//     if (!item.invcProjId) return;
//     const order = String(item.invcProjId).trim();
//     const lookup = contractLookup.get(order) || {};
//     const group = tmGroups.get(order) || {
//       contract: lookup.contract || "",
//       sub: lookup.sub || item.taskId || "",
//       order,
//       amount: 0,
//     };
//     group.amount += Number(item.amount) || 0;
//     tmGroups.set(order, group);
//   });
//   const tmRows = Array.from(tmGroups.values()).map((item) =>
//     makeRow(item, String(item.order).trim()),
//   );

//   return { flexRows, tmRows };
// };

// const addScheduleI = async (
//   workbook,
//   { companyName, companyAddress, year = FISCAL_YEAR },
// ) => {
//   const { flexRows, tmRows } = await getScheduleIData(year);
//   const ws = workbook.addWorksheet("Schedule I");
//   ws.columns = [
//     { width: 22 }, { width: 22 }, { width: 17 }, { width: 13 },
//     { width: 17 }, { width: 17 }, { width: 17 }, { width: 18 },
//     { width: 18 }, { width: 18 }, { width: 15 }, { width: 16 },
//     { width: 17 }, { width: 17 }, { width: 14 }, { width: 24 },
//   ];
//   setupWorksheet(ws);
//   ws.pageSetup.orientation = "landscape";

//   [
//     "Schedule I is linked to the following schedules:",
//     "Schedule H, Contract Costs",
//     "Schedule K, T&M",
//     "ICE MANUAL",
//   ].forEach((label, index) => {
//     setCell(ws.getCell(index + 1, 1), label, { fontSize: 9 });
//   });

//   ws.mergeCells("F1:J1");
//   ws.mergeCells("F2:J2");
//   ws.mergeCells("F4:J4");
//   ws.mergeCells("F5:J5");
//   ws.mergeCells("F6:J6");
//   ws.mergeCells("N1:P1");
//   ws.mergeCells("N2:P2");
//   setCell(ws.getCell("F1"), companyName || EXPORT_COMPANY_NAME, {
//     bold: true, align: "center", fill: YELLOW, fontSize: 11,
//   });
//   setCell(ws.getCell("F2"), companyAddress || EXPORT_COMPANY_ADDRESS, {
//     bold: true, align: "center", fill: YELLOW, fontSize: 11,
//   });
//   setCell(ws.getCell("F4"), "Schedule of Cumulative Direct and Indirect Costs Claimed and Billed", {
//     bold: true, align: "center", fontSize: 11,
//   });
//   setCell(ws.getCell("F5"), "by Contract and Subcontract", {
//     bold: true, align: "center", fontSize: 11,
//   });
//   setCell(ws.getCell("F6"), `Fiscal Year End - 12/31/${year}`, {
//     bold: true, align: "center", fill: YELLOW, fontSize: 10,
//   });
//   setCell(ws.getCell("N1"), "SCHEDULE I", { bold: true, align: "right" });
//   setCell(ws.getCell("N2"), "ICE (version 2.0.1h)", { bold: true, align: "right" });
//   ws.getRow(1).height = 20;
//   ws.getRow(2).height = 20;
//   ws.getRow(4).height = 22;
//   ws.getRow(5).height = 22;
//   ws.getRow(6).height = 22;

//   ws.mergeCells("A8:E8");
//   ws.mergeCells("F8:G8");
//   ws.mergeCells("H8:H9");
//   ws.mergeCells("I8:I9");
//   ws.mergeCells("J8:J9");
//   ws.mergeCells("K8:M8");
//   ws.mergeCells("N8:N9");
//   ws.mergeCells("O8:O9");
//   ws.mergeCells("P8:P9");
//   setCell(ws.getCell("F8"), "Unsettled/Claimed Direct and Indirect Costs", {
//     bold: true, align: "center", fill: "D9E2F3", fontSize: 9,
//   });
//   setCell(ws.getCell("K8"), "Cumulative Cost Billed (Manual Entry)", {
//     bold: true, align: "center", fill: "D9E2F3", fontSize: 9,
//   });

//   const headers = [
//     "Contract No.", "Subcontract No.", "Order No.", "Subject to Penalty Clause",
//     "Prior Years Settled Total Costs", "Prior Year Costs", "Current Year Costs",
//     "Total Cumulative Settled or Claimed", "Contract Limitations Rebates/Credits",
//     "Net Cumulative Settled or Claimed", "PV No.", "Date Cost Billed Through",
//     "Amount", "Over (Under) Billing", "Physically Complete", "Note",
//   ];
//   headers.forEach((header, index) => {
//     setCell(ws.getCell(9, index + 1), header, {
//       bold: true, align: "center", fill: "E7E6E6", fontSize: 8,
//     });
//     ws.getCell(9, index + 1).border = {
//       top: { style: "thin", color: { argb: BLACK } },
//       bottom: { style: "thin", color: { argb: BLACK } },
//       left: { style: "thin", color: { argb: BLACK } },
//       right: { style: "thin", color: { argb: BLACK } },
//     };
//   });
//   ws.getRow(9).height = 54;

//   const putFormula = (cell, formula, result, fill = null) => {
//     cell.value = { formula, result };
//     cell.alignment = { horizontal: "right", vertical: "middle" };
//     if (fill) {
//       cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
//     }
//   };
//   const addSection = (row, title, description) => {
//     ws.mergeCells(`B${row}:P${row}`);
//     setCell(ws.getCell(row, 1), title, {
//       bold: true, underline: true, fill: "29258F", color: WHITE, fontSize: 9,
//     });
//     setCell(ws.getCell(row, 2), description, { bold: true, fill: "F2F2F2" });
//   };
//   const addContractRows = (rows, sectionTitle, description, startRow) => {
//     addSection(startRow, sectionTitle, description);
//     let row = startRow + 1;
//     rows.forEach((item) => {
//       [item.contract, item.sub, item.order, item.penalty, item.settled, item.priorYear, item.currentYear]
//         .forEach((value, index) => setCell(ws.getCell(row, index + 1), value, {
//           align: index < 4 ? "left" : "right",
//           fill: index < 3 ? YELLOW : null,
//           fontSize: 8,
//         }));
//       putFormula(ws.getCell(row, 8), `F${row}+G${row}`, item.cumulative, CYAN);
//       setCell(ws.getCell(row, 9), item.limitation, { align: "right", fontSize: 8 });
//       putFormula(ws.getCell(row, 10), `H${row}-I${row}`, item.netCumulative, CYAN);
//       setCell(ws.getCell(row, 11), item.pvNo, { fontSize: 8 });
//       if (item.billedDate) {
//         ws.getCell(row, 12).value = item.billedDate;
//         ws.getCell(row, 12).numFmt = "mm/dd/yyyy";
//       }
//       setCell(ws.getCell(row, 13), item.billedAmount, { align: "right", fontSize: 8 });
//       putFormula(ws.getCell(row, 14), `M${row}-J${row}`, item.overUnder, CYAN);
//       setCell(ws.getCell(row, 15), item.complete, { align: "center", fontSize: 8 });
//       setCell(ws.getCell(row, 16), item.note, { fontSize: 8 });
//       for (let col = 1; col <= 16; col++) {
//         ws.getCell(row, col).border = { bottom: { style: "hair", color: { argb: "FFB7B7B7" } } };
//       }
//       row++;
//     });
//     return { first: startRow + 1, last: row - 1, next: row };
//   };
//   const addSubtotal = (row, label, range, rows) => {
//     ws.mergeCells(`A${row}:G${row}`);
//     setCell(ws.getCell(row, 1), label, { bold: true, underline: true });
//     const sums = [
//       [8, "cumulative"], [10, "netCumulative"],
//       [13, "billedAmount"], [14, "overUnder"],
//     ];
//     sums.forEach(([column, key]) => {
//       const result = rows.reduce((sum, item) => sum + item[key], 0);
//       const target = ws.getCell(row, column);
//       if (range.last >= range.first) {
//         const letter = String.fromCharCode(64 + column);
//         putFormula(target, `SUM(${letter}${range.first}:${letter}${range.last})`, result, CYAN);
//       } else {
//         setCell(target, 0, { bold: true, align: "right", fill: CYAN, fontSize: 9 });
//       }
//       ws.getCell(row, column).font = { name: "Arial", size: 9, bold: true, color: { argb: BLACK } };
//     });
//     applyBottomBorder(ws.getRow(row), 1, 16);
//   };

//   let row = 10;
//   const flexRange = addContractRows(flexRows, "SCHED H", "Cost Type & Flexibly Priced:", row);
//   row = flexRange.next;
//   addSubtotal(row, "Subtotal - Cost & Flexibly Priced Contracts", flexRange, flexRows);
//   const flexSubtotalRow = row++;
//   const tmRange = addContractRows(tmRows, "SCHED K", "Time & Material", row);
//   row = tmRange.next;
//   addSubtotal(row, "Subtotal - Time & Material Contracts", tmRange, tmRows);
//   const tmSubtotalRow = row++;

//   ws.mergeCells(`A${row}:G${row}`);
//   setCell(ws.getCell(row, 1), "Total - Cost/Flexibly Priced and Time & Material Contracts", {
//     bold: true, fill: "D9E2F3", fontSize: 9,
//   });
//   [[8, "H", flexRows.reduce((sum, item) => sum + item.cumulative, 0) + tmRows.reduce((sum, item) => sum + item.cumulative, 0)],
//     [10, "J", flexRows.reduce((sum, item) => sum + item.netCumulative, 0) + tmRows.reduce((sum, item) => sum + item.netCumulative, 0)],
//     [13, "M", flexRows.reduce((sum, item) => sum + item.billedAmount, 0) + tmRows.reduce((sum, item) => sum + item.billedAmount, 0)],
//     [14, "N", flexRows.reduce((sum, item) => sum + item.overUnder, 0) + tmRows.reduce((sum, item) => sum + item.overUnder, 0)],
//   ].forEach(([column, letter, result]) => {
//     putFormula(ws.getCell(row, column), `${letter}${flexSubtotalRow}+${letter}${tmSubtotalRow}`, result, CYAN);
//     ws.getCell(row, column).font = { name: "Arial", size: 9, bold: true, color: { argb: BLACK } };
//   });
//   applyBottomBorder(ws.getRow(row), 1, 16);
//   row += 2;

//   [
//     "Explanatory Notes:",
//     "1. Fiscal Year 2025 represents initial formal Incurred Cost Submission (ICS). Prior year costs represent cumulative actual costs incurred through December 31, 2024.",
//     "2. Revenue accrual on project C1435.001 is excluded as no allowable costs were incurred or billed in FY 2025.",
//     "3. Project C1800.U costs are shown as under billed and tie to the under bill amount on Schedule I.",
//     "4. Contract limitation for project C1800.C excludes teammate fee not billed or claimed.",
//   ].forEach((text, index) => {
//     ws.mergeCells(`A${row + index}:P${row + index}`);
//     setCell(ws.getCell(row + index, 1), text, {
//       bold: index === 0, underline: index === 0, fontSize: 9,
//     });
//     ws.getRow(row + index).height = index === 0 ? 20 : 30;
//   });
// };

// //Schedule K
// const getScheduleKData = async (year = 2025) => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/ScheduleK?year=${year}`,
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch Schedule K data. Status: ${response.status}`,
//     );
//   }

//   const data = await response.json();

//   return Array.isArray(data) ? data : [];
// };

// const addScheduleK = async (
//   workbook,
//   { companyName, companyAddress, year = 2025 },
// ) => {
//   const laborData = await getScheduleKData(year);

//   // ---------------------------------------------------------
//   // Same contract mapping as JSX
//   // ---------------------------------------------------------

//   const contractMap = new Map();

//   laborData.forEach((item) => {
//     const key = `${item.invcProjId || ""}_${item.taskId || ""}`;

//     if (!contractMap.has(key)) {
//       contractMap.set(key, {
//         key,
//         contractNo: item.invcProjId || "N/A",
//         taskId: item.taskId || "N/A",
//         materialCost: Number(item.materialCost || 0),
//         subcontractor: Number(item.subcontractor || 0),
//         materialOverhead: Number(item.materialOverhead || 0),
//         travelCost: Number(item.travelCost || 0),
//         odcCost: Number(item.odcCost || 0),
//         taskCeiling: Number(item.taskCeiling || 0),
//       });
//     }
//   });

//   const contracts = Array.from(contractMap.values());

//   // ---------------------------------------------------------
//   // Same category mapping as JSX
//   // ---------------------------------------------------------

//   const categoryMap = new Map();

//   laborData.forEach((item) => {
//     const category = item.plcDesc || "Uncategorized";

//     if (!categoryMap.has(category)) {
//       categoryMap.set(category, {});
//     }

//     const categoryEntry = categoryMap.get(category);

//     const contractKey = `${item.invcProjId || ""}_${item.taskId || ""}`;

//     if (!categoryEntry[contractKey]) {
//       categoryEntry[contractKey] = [];
//     }

//     categoryEntry[contractKey].push({
//       rate: Number(item.rate || 0),
//       hours: Number(item.hours || 0),
//       amount: Number(item.amount || 0),
//     });
//   });

//   const categoryRows = Array.from(categoryMap.entries()).map(
//     ([category, contractValues]) => ({
//       category,
//       contractValues,
//     }),
//   );

//   // ---------------------------------------------------------
//   // Same labor totals as JSX
//   // ---------------------------------------------------------

//   const contractLaborTotals = {};

//   contracts.forEach((contract) => {
//     contractLaborTotals[contract.key] = {
//       hours: 0,
//       amount: 0,
//     };
//   });

//   laborData.forEach((item) => {
//     const key = `${item.invcProjId || ""}_${item.taskId || ""}`;

//     if (contractLaborTotals[key]) {
//       contractLaborTotals[key].hours += Number(item.hours || 0);
//       contractLaborTotals[key].amount += Number(item.amount || 0);
//     }
//   });

//   // ---------------------------------------------------------
//   // Worksheet
//   // ---------------------------------------------------------

//   const worksheet = workbook.addWorksheet("SCHEDULE K");

//   worksheet.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   worksheet.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   // ---------------------------------------------------------
//   // Styles
//   // ---------------------------------------------------------

//   const yellowFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FFFFFF00",
//     },
//   };

//   const cyanFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FF67E8F9",
//     },
//   };

//   const blueFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FF2563EB",
//     },
//   };

//   const blackBorder = {
//     style: "thin",
//     color: {
//       argb: "FF000000",
//     },
//   };

//   const grayBorder = {
//     style: "thin",
//     color: {
//       argb: "FFD1D5DB",
//     },
//   };

//   const baseFont = {
//     name: "Arial",
//     size: 9,
//   };

//   const boldFont = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   const moneyFormat = "#,##0.00;(#,##0.00);-";
//   const integerFormat = "#,##0;(#,##0);-";
//   const rateFormat = '0.00"%"';

//   // ---------------------------------------------------------
//   // Dynamic columns
//   //
//   // First column = Category
//   // Each contract = Rate + Hrs + Amount
//   // ---------------------------------------------------------

//   worksheet.getColumn(1).width = 32;

//   let column = 2;

//   contracts.forEach(() => {
//     worksheet.getColumn(column).width = 12; // Rate
//     worksheet.getColumn(column + 1).width = 12; // Hrs
//     worksheet.getColumn(column + 2).width = 16; // Amount

//     column += 3;
//   });

//   // ---------------------------------------------------------
//   // Header / metadata
//   // ---------------------------------------------------------

//   worksheet.mergeCells("A1:C1");

//   worksheet.getCell("A1").value =
//     "This Schedule is linked to schedule A for the G&A rate.";

//   worksheet.getCell("A1").border = {
//     top: blackBorder,
//     left: blackBorder,
//     right: blackBorder,
//     bottom: blackBorder,
//   };

//   worksheet.getCell("A1").font = boldFont;

//   worksheet.getCell("A3").value = "Any changes in data will affect Schedule I.";

//   worksheet.getCell("A3").font = boldFont;

//   worksheet.mergeCells("A4:C4");

//   worksheet.getCell("A4").value =
//     "Other than G&A rate, only manual or externally imported entries";

//   worksheet.getCell("A5").value =
//     "Schedule A - Applied Overhead, G&A, & COM Rates";

//   worksheet.getCell("A5").font = {
//     ...baseFont,
//     color: {
//       argb: "FF0000CC",
//     },
//     underline: true,
//   };

//   worksheet.getCell("A6").value = "ICE MANUAL";

//   worksheet.getCell("A6").font = {
//     ...baseFont,
//     color: {
//       argb: "FF0000CC",
//     },
//     underline: true,
//   };

//   // Schedule title
//   const lastColumn = Math.max(1, 1 + contracts.length * 3);

//   worksheet.mergeCells(
//     `${String.fromCharCode(64 + Math.min(lastColumn, 26))}1:${String.fromCharCode(
//       64 + Math.min(lastColumn, 26),
//     )}2`,
//   );

//   const titleColumn = Math.max(2, lastColumn);

//   worksheet.getCell(1, titleColumn).value = "SCHEDULE K";

//   worksheet.getCell(1, titleColumn).font = {
//     ...boldFont,
//     size: 11,
//   };

//   worksheet.getCell(1, titleColumn).alignment = {
//     horizontal: "right",
//     vertical: "middle",
//   };

//   worksheet.getCell(2, titleColumn).value = "ICE (version 2.0.1h)";

//   worksheet.getCell(2, titleColumn).font = {
//     ...boldFont,
//     size: 11,
//   };

//   worksheet.getCell(2, titleColumn).alignment = {
//     horizontal: "right",
//     vertical: "middle",
//   };

//   // ---------------------------------------------------------
//   // Company / title
//   // ---------------------------------------------------------

//   const titleStart = Math.max(2, Math.floor(lastColumn / 2) - 1);
//   const titleEnd = Math.min(lastColumn, titleStart + 4);

//   worksheet.mergeCells(8, titleStart, 8, titleEnd);

//   worksheet.getCell(8, titleStart).value = companyName;

//   worksheet.getCell(8, titleStart).fill = yellowFill;
//   worksheet.getCell(8, titleStart).font = {
//     ...boldFont,
//     size: 10,
//   };

//   worksheet.getCell(8, titleStart).alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   worksheet.mergeCells(9, titleStart, 9, titleEnd);

//   worksheet.getCell(9, titleStart).value = companyAddress;

//   worksheet.getCell(9, titleStart).fill = yellowFill;
//   worksheet.getCell(9, titleStart).font = boldFont;

//   worksheet.getCell(9, titleStart).alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   worksheet.mergeCells(10, titleStart, 10, titleEnd);

//   worksheet.getCell(10, titleStart).value =
//     "Summary of Hours and Amounts on Time and Material/Labor Hour Contracts";

//   worksheet.getCell(10, titleStart).fill = yellowFill;
//   worksheet.getCell(10, titleStart).font = boldFont;

//   worksheet.getCell(10, titleStart).alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   worksheet.mergeCells(11, titleStart, 11, titleEnd);

//   worksheet.getCell(11, titleStart).value = `Fiscal Year End - 12/31/${year}`;

//   worksheet.getCell(11, titleStart).fill = yellowFill;
//   worksheet.getCell(11, titleStart).font = boldFont;

//   worksheet.getCell(11, titleStart).alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // ---------------------------------------------------------
//   // Contract Header Row
//   // ---------------------------------------------------------

//   const contractHeaderRow = 13;

//   worksheet.getCell(contractHeaderRow, 1).value = "Contract Labor";

//   worksheet.getCell(contractHeaderRow, 1).font = boldFont;

//   worksheet.getCell(contractHeaderRow, 1).border = {
//     bottom: blackBorder,
//     right: grayBorder,
//   };

//   column = 2;

//   contracts.forEach((contract) => {
//     worksheet.mergeCells(
//       contractHeaderRow,
//       column,
//       contractHeaderRow,
//       column + 2,
//     );

//     const cell = worksheet.getCell(contractHeaderRow, column);

//     cell.value = contract.contractNo;

//     cell.font = boldFont;
//     cell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     cell.border = {
//       bottom: blackBorder,
//       right: grayBorder,
//     };

//     column += 3;
//   });

//   // ---------------------------------------------------------
//   // Task Row
//   // ---------------------------------------------------------

//   const taskRow = 14;

//   worksheet.getCell(taskRow, 1).value = "Contract No.";

//   worksheet.getCell(taskRow, 1).font = boldFont;

//   column = 2;

//   contracts.forEach((contract) => {
//     worksheet.mergeCells(taskRow, column, taskRow, column + 2);

//     const cell = worksheet.getCell(taskRow, column);

//     cell.value = `Task: ${contract.taskId}`;

//     cell.font = boldFont;
//     cell.alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     cell.border = {
//       bottom: blackBorder,
//       right: grayBorder,
//     };

//     column += 3;
//   });

//   // ---------------------------------------------------------
//   // Column Headers
//   // ---------------------------------------------------------

//   const columnHeaderRow = 15;

//   worksheet.getCell(columnHeaderRow, 1).value = "Category (1)";

//   worksheet.getCell(columnHeaderRow, 1).font = boldFont;
//   worksheet.getCell(columnHeaderRow, 1).border = {
//     bottom: blackBorder,
//     right: grayBorder,
//   };

//   column = 2;

//   contracts.forEach(() => {
//     const rateCell = worksheet.getCell(columnHeaderRow, column);

//     rateCell.value = "Rate (2)";
//     rateCell.font = boldFont;
//     rateCell.alignment = {
//       horizontal: "right",
//     };
//     rateCell.border = {
//       bottom: blackBorder,
//       right: grayBorder,
//     };

//     const hrsCell = worksheet.getCell(columnHeaderRow, column + 1);

//     hrsCell.value = "Hrs";
//     hrsCell.font = boldFont;
//     hrsCell.alignment = {
//       horizontal: "right",
//     };
//     hrsCell.border = {
//       bottom: blackBorder,
//       right: grayBorder,
//     };

//     const amountCell = worksheet.getCell(columnHeaderRow, column + 2);

//     amountCell.value = "Amount";
//     amountCell.fill = cyanFill;
//     amountCell.font = boldFont;
//     amountCell.alignment = {
//       horizontal: "right",
//     };
//     amountCell.border = {
//       bottom: blackBorder,
//       right: grayBorder,
//     };

//     column += 3;
//   });

//   // ---------------------------------------------------------
//   // Labor Categories
//   // ---------------------------------------------------------

//   let currentRow = 16;

//   categoryRows.forEach((categoryRow) => {
//     worksheet.getCell(currentRow, 1).value = categoryRow.category;

//     worksheet.getCell(currentRow, 1).font = baseFont;

//     column = 2;

//     contracts.forEach((contract) => {
//       const entries = categoryRow.contractValues[contract.key] || [];

//       // Rate
//       const rateCell = worksheet.getCell(currentRow, column);

//       if (entries.length > 0) {
//         entries.forEach((entry, index) => {
//           if (index === 0) {
//             rateCell.value = Number(entry.rate || 0);
//           }
//         });

//         rateCell.numFmt = rateFormat;
//       }

//       rateCell.alignment = {
//         horizontal: "right",
//         vertical: "top",
//       };

//       // Hours
//       const hrsCell = worksheet.getCell(currentRow, column + 1);

//       if (entries.length > 0) {
//         if (entries.length === 1) {
//           hrsCell.value = Number(entries[0].hours || 0);
//         } else {
//           // Excel cell cannot contain multiple
//           // independently formatted values.
//           hrsCell.value = entries
//             .map((entry) => Number(entry.hours || 0).toLocaleString())
//             .join("\n");
//         }
//       }

//       hrsCell.alignment = {
//         horizontal: "right",
//         vertical: "top",
//         wrapText: entries.length > 1,
//       };

//       // Amount
//       const amountCell = worksheet.getCell(currentRow, column + 2);

//       if (entries.length > 0) {
//         if (entries.length === 1) {
//           amountCell.value = Number(entries[0].amount || 0);
//         } else {
//           amountCell.value = entries
//             .map((entry) => Number(entry.amount || 0).toLocaleString())
//             .join("\n");
//         }
//       } else {
//         amountCell.value = "-";
//       }

//       amountCell.fill = cyanFill;
//       amountCell.alignment = {
//         horizontal: "right",
//         vertical: "top",
//         wrapText: entries.length > 1,
//       };

//       if (entries.length === 1) {
//         amountCell.numFmt = integerFormat;
//       }

//       column += 3;
//     });

//     currentRow++;
//   });

//   // ---------------------------------------------------------
//   // LABOR TOTAL
//   // ---------------------------------------------------------

//   const laborTotalRow = currentRow;

//   worksheet.getCell(laborTotalRow, 1).value = "TOTAL";

//   worksheet.getCell(laborTotalRow, 1).font = boldFont;

//   worksheet.getCell(laborTotalRow, 1).border = {
//     top: blackBorder,
//   };

//   column = 2;

//   contracts.forEach((contract) => {
//     const total = contractLaborTotals[contract.key] || {
//       hours: 0,
//       amount: 0,
//     };

//     worksheet.getCell(laborTotalRow, column + 1).value = total.hours;

//     worksheet.getCell(laborTotalRow, column + 1).numFmt = integerFormat;

//     worksheet.getCell(laborTotalRow, column + 1).alignment = {
//       horizontal: "right",
//     };

//     worksheet.getCell(laborTotalRow, column + 2).value = total.amount;

//     worksheet.getCell(laborTotalRow, column + 2).fill = cyanFill;

//     worksheet.getCell(laborTotalRow, column + 2).numFmt = integerFormat;

//     worksheet.getCell(laborTotalRow, column + 2).font = boldFont;

//     worksheet.getCell(laborTotalRow, column + 2).alignment = {
//       horizontal: "right",
//     };

//     column += 3;
//   });

//   currentRow++;

//   // ---------------------------------------------------------
//   // OTHER COSTS
//   // ---------------------------------------------------------

//   worksheet.mergeCells(currentRow, 1, currentRow, lastColumn);

//   worksheet.getCell(currentRow, 1).value = "OTHER COSTS";

//   worksheet.getCell(currentRow, 1).font = boldFont;

//   worksheet.getCell(currentRow, 1).border = {
//     top: blackBorder,
//     bottom: grayBorder,
//   };

//   currentRow++;

//   // ---------------------------------------------------------
//   // Helper for Other Cost rows
//   // ---------------------------------------------------------

//   const addOtherCostRow = (label, valueKey, fill = null) => {
//     worksheet.getCell(currentRow, 1).value = label;
//     worksheet.getCell(currentRow, 1).font = baseFont;

//     column = 2;

//     contracts.forEach((contract) => {
//       worksheet.getCell(currentRow, column).value = "";

//       worksheet.getCell(currentRow, column + 1).value = "";

//       const amountCell = worksheet.getCell(currentRow, column + 2);

//       const value = Number(contract[valueKey] || 0);

//       amountCell.value = value || "-";

//       if (fill) {
//         amountCell.fill = fill;
//       }

//       amountCell.numFmt = integerFormat;
//       amountCell.alignment = {
//         horizontal: "right",
//       };

//       column += 3;
//     });

//     currentRow++;
//   };

//   addOtherCostRow("Material Costs (3)", "materialCost");
//   addOtherCostRow("Subcontractor", "subcontractor");

//   // ---------------------------------------------------------
//   // Material Overhead
//   // ---------------------------------------------------------

//   worksheet.getCell(currentRow, 1).value = "Material Overhead";

//   worksheet.getCell(currentRow, 1).font = boldFont;

//   column = 2;

//   contracts.forEach((contract) => {
//     const rateCell = worksheet.getCell(currentRow, column);

//     // This matches the current JSX.
//     rateCell.value = 2.42;
//     rateCell.numFmt = rateFormat;
//     rateCell.fill = yellowFill;
//     rateCell.font = boldFont;

//     const amountCell = worksheet.getCell(currentRow, column + 2);

//     amountCell.value = Number(contract.materialOverhead || 0) || "-";

//     amountCell.numFmt = integerFormat;
//     amountCell.alignment = {
//       horizontal: "right",
//     };

//     column += 3;
//   });

//   currentRow++;

//   addOtherCostRow("Travel Costs (3)", "travelCost");
//   addOtherCostRow("ODC", "odcCost");

//   // ---------------------------------------------------------
//   // G&A Rate
//   // ---------------------------------------------------------

//   worksheet.getCell(currentRow, 1).value =
//     "G&A @:  Sched A                         (4)";

//   worksheet.getCell(currentRow, 1).font = boldFont;

//   column = 2;

//   contracts.forEach((contract) => {
//     const rateCell = worksheet.getCell(currentRow, column);

//     // This is the exact value currently rendered by JSX.
//     rateCell.value = 12.99;
//     rateCell.numFmt = rateFormat;
//     rateCell.fill = yellowFill;
//     rateCell.font = boldFont;

//     const amountCell = worksheet.getCell(currentRow, column + 2);

//     amountCell.value = "-";
//     amountCell.fill = cyanFill;

//     column += 3;
//   });

//   currentRow++;

//   // ---------------------------------------------------------
//   // Subtotal
//   // ---------------------------------------------------------

//   worksheet.getCell(currentRow, 1).value = "Subtotal";

//   worksheet.getCell(currentRow, 1).font = boldFont;

//   column = 2;

//   contracts.forEach(() => {
//     worksheet.getCell(currentRow, column + 2).value = "-";

//     worksheet.getCell(currentRow, column + 2).fill = cyanFill;

//     worksheet.getCell(currentRow, column + 2).border = {
//       bottom: blackBorder,
//     };

//     column += 3;
//   });

//   currentRow++;

//   // ---------------------------------------------------------
//   // FINAL TOTAL
//   // Same JSX: uses contractLaborTotals amount
//   // ---------------------------------------------------------

//   worksheet.getCell(currentRow, 1).value = "TOTAL";

//   worksheet.getCell(currentRow, 1).font = boldFont;

//   column = 2;

//   contracts.forEach((contract) => {
//     const total = contractLaborTotals[contract.key] || {
//       amount: 0,
//     };

//     worksheet.getCell(currentRow, column + 2).value = total.amount;

//     worksheet.getCell(currentRow, column + 2).fill = cyanFill;

//     worksheet.getCell(currentRow, column + 2).numFmt = integerFormat;

//     worksheet.getCell(currentRow, column + 2).font = boldFont;

//     column += 3;
//   });

//   currentRow++;

//   // ---------------------------------------------------------
//   // TASK CEILINGS
//   // ---------------------------------------------------------

//   worksheet.getCell(currentRow, 1).value = "Task Ceilings";

//   worksheet.getCell(currentRow, 1).font = boldFont;

//   column = 2;

//   contracts.forEach((contract) => {
//     const ceiling = Number(contract.taskCeiling || 0);

//     worksheet.getCell(currentRow, column + 2).value = ceiling || "-";

//     worksheet.getCell(currentRow, column + 2).numFmt = integerFormat;

//     column += 3;
//   });

//   currentRow += 2;

//   // ---------------------------------------------------------
//   // Explanatory Notes
//   // ---------------------------------------------------------

//   worksheet.getCell(currentRow, 1).value = "Explanatory Notes:";

//   worksheet.getCell(currentRow, 1).font = {
//     ...boldFont,
//     underline: true,
//   };

//   currentRow++;

//   const notes = [
//     "(1) Represents effort performed by the company. Any subcontract effort should be identified separately.",
//     "(2) Represents rates specified in the contract which may be higher or lower than actual rates incurred.",
//     "(3) Represents actual costs recorded in the cost records.",
//     "(4) G&A applied at the claimed rate excluding the Material and Travel Costs.",
//   ];

//   notes.forEach((note) => {
//     worksheet.mergeCells(currentRow, 1, currentRow, Math.min(lastColumn, 8));

//     worksheet.getCell(currentRow, 1).value = note;
//     worksheet.getCell(currentRow, 1).font = baseFont;
//     worksheet.getCell(currentRow, 1).alignment = {
//       wrapText: true,
//       vertical: "top",
//     };

//     currentRow++;
//   });

//   // ---------------------------------------------------------
//   // Legend
//   // ---------------------------------------------------------

//   currentRow++;

//   worksheet.getCell(currentRow, 1).value = "Cell Contains a Formula";

//   worksheet.getCell(currentRow, 1).fill = cyanFill;
//   worksheet.getCell(currentRow, 1).font = boldFont;

//   worksheet.getCell(currentRow, 2).value = "Indicates Summary Amounts";

//   currentRow++;

//   worksheet.getCell(currentRow, 1).value = "Linked to Other Worksheet";

//   worksheet.getCell(currentRow, 1).fill = yellowFill;
//   worksheet.getCell(currentRow, 1).font = boldFont;

//   worksheet.getCell(currentRow, 2).value = "Linked to Schedule A Rate";

//   worksheet.printArea = `A1:${String.fromCharCode(
//     64 + Math.min(lastColumn, 26),
//   )}${currentRow}`;

//   return worksheet;
// };

// // Schedule L

// const getScheduleLData = async (year = 2025) => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/ScheduleL_cost?fyCd=${year}`,
//   );

//   if (!response.ok) {
//     throw new Error(`Schedule L API failed: ${response.status}`);
//   }

//   return await response.json();
// };

// const addScheduleL = async (workbook, year = 2025) => {
//   const data = await getScheduleLData(year);

//   // =====================================================
//   // SAME DATA MAPPING AS JSX
//   // =====================================================

//   const manualEntry = data?.manualEntry || {};
//   const rows = data?.rows || [];

//   const tableRows = rows.filter(
//     (r) => r.acctName !== "TOTAL LABOR DISTRIBUTION",
//   );

//   const totalLaborRow = rows.find(
//     (r) => r.acctName === "TOTAL LABOR DISTRIBUTION",
//   );

//   const totalLaborDistribution = totalLaborRow?.generalLedger || 0;

//   // =====================================================
//   // IRS FORM 941
//   // =====================================================

//   const payrollRows = [
//     {
//       description: "1ST QTR.",
//       ledger: manualEntry.qtr1 || 0,
//     },
//     {
//       description: "2ND QTR",
//       ledger: manualEntry.qtr2 || 0,
//     },
//     {
//       description: "3rd QTR.",
//       ledger: manualEntry.qtr3 || 0,
//     },
//     {
//       description: "4th QTR.",
//       ledger: manualEntry.qtr4 || 0,
//     },
//   ];

//   const totalIRS = payrollRows.reduce(
//     (acc, row) => acc + Number(row.ledger || 0),
//     0,
//   );

//   // =====================================================
//   // PRETAX DEDUCTIONS
//   // =====================================================

//   const pretaxRows = [
//     {
//       description: "401K",
//       ledger: manualEntry.retirement401K || 0,
//     },
//     {
//       description: "Medical",
//       ledger: manualEntry.medical || 0,
//     },
//     {
//       description: "Dental",
//       ledger: manualEntry.dental || 0,
//     },
//     {
//       description: "FSA",
//       ledger: manualEntry.fsa || 0,
//     },
//     {
//       description: "Cafe 125 HSA",
//       ledger: manualEntry.cafe125 || 0,
//     },
//     {
//       description: "Health Care Benefit",
//       ledger: manualEntry.healthcare || 0,
//     },
//     {
//       description: "Miscellaneous",
//       ledger: manualEntry.misc || 0,
//     },
//   ];

//   const totalPretax = pretaxRows.reduce(
//     (acc, row) => acc + Number(row.ledger || 0),
//     0,
//   );

//   // =====================================================
//   // PAYROLL AND LEAVE ACCRUALS
//   // =====================================================
//   // NOTE:
//   // These values are currently hardcoded in the JSX/exporter.
//   // They are kept here exactly as your current implementation.
//   // For a strict API-only export, these need to come from API data.

//   const accrualRows = [
//     {
//       account: "23-00-11",
//       description: "Plus: Current Year vacation Liablity",
//       ledger: 1069900.12,
//     },
//     {
//       account: "23-00-11",
//       description: "Minus: Prior Year vacation Liability",
//       ledger: 615563.86,
//     },
//     {
//       account: "23-10-01",
//       description: "Minus: Prior Year vacation Liability",
//       ledger: -1196510.06,
//     },
//     {
//       account: "23-00-15",
//       description: "Plus: Current Year Accrued NIH PTO Liability",
//       ledger: 7496.61,
//     },
//     {
//       account: "23-00-15",
//       description: "Minus: Prior Year Accrued NIH PTO Liability",
//       ledger: -5805.5,
//     },
//     {
//       account: "23-00-12",
//       description: "Plus: Current Year Accrual Sick Leave",
//       ledger: 16543.1,
//     },
//     {
//       account: "23-00-12",
//       description: "Minus: Prior Year Accrual Sick Leave",
//       ledger: 191322.91,
//     },
//     {
//       account: "23-10-03",
//       description: "Minus: Prior Year Accrual Sick Leave",
//       ledger: -225892.19,
//     },
//     {
//       account: "23-00-01",
//       description: "Plus: Current Year Accrual Salaries",
//       ledger: 951582.59,
//     },
//     {
//       account: "23-00-01",
//       description: "Minus: Prior Year Accrual Salaries Check date",
//       ledger: -377537.31,
//     },
//     {
//       account: "23-00-01",
//       description: "Plus: Prior Year Accrual Reversal- JE#1 (50-00-01)",
//       ledger: -51917.79,
//     },
//     {
//       account: "23-00-01",
//       description: "Minus: Current Year Accrual - JE#23 Dec'25 (50-00-01)",
//       ledger: 207722.1,
//     },
//     {
//       account: "23-00-01",
//       description: "Plus: Prior Year Accrual Reversal- JE#1 (50-00-02)",
//       ledger: -917.6,
//     },
//     {
//       account: "23-00-01",
//       description: "Minus: Current Year Accrual - JE#23 Dec'25 (50-00-02)",
//       ledger: 22902.68,
//     },
//     {
//       account: "23-00-01",
//       description: "Minus: Current Year Accrual - JE#23 Dec'25 (84-00-01)",
//       ledger: 6342,
//     },
//     {
//       account: "23-00-01",
//       description: "Plus: Prior Year Accrual Reversal- JE#1 (80-00-01)",
//       ledger: -13728.3,
//     },
//     {
//       account: "23-00-01",
//       description: "Minus: Current Year Accrual - JE#23 Dec'25 (80-00-01)",
//       ledger: 24860.43,
//     },
//     {
//       account: "23-00-01",
//       description: "Plus: Prior Year Accrual Reversal- JE#1 (72-00-01)",
//       ledger: -10842.88,
//     },
//     {
//       account: "23-00-01",
//       description: "Minus: Current Year Accrual - JE#23 Dec'25 (72-00-01)",
//       ledger: 14384.96,
//     },
//     {
//       account: "23-00-01",
//       description: "Minus: D/L Customer Site 2025 labor booked 2026 (50-00-01)",
//       ledger: 14826.24,
//     },
//   ];

//   const totalAccrual = accrualRows.reduce(
//     (acc, row) => acc + Number(row.ledger || 0),
//     0,
//   );

//   // =====================================================
//   // ADJUSTMENTS
//   // =====================================================
//   // NOTE:
//   // These values are currently hardcoded in the JSX/exporter.
//   // For a strict API-only export, these need to come from API data.

//   const adjustmentRows = [
//     {
//       account: "60-06-04",
//       description: "Health & Welfare",
//       ledger: -145.88,
//     },
//     {
//       account: "60-06-05",
//       description: "Incentive Compensation",
//       ledger: 44300,
//     },
//     {
//       account: "60-06-03",
//       description: "Cash in Lieu of Benefits",
//       ledger: 904.13,
//     },
//     {
//       account: "60-03-13",
//       description: "Severance",
//       ledger: 5068.8,
//     },
//   ];

//   const totalAdjustments = adjustmentRows.reduce(
//     (acc, row) => acc + Number(row.ledger || 0),
//     0,
//   );

//   // =====================================================
//   // SAME JSX CALCULATIONS
//   // =====================================================

//   const totalPayroll = totalIRS + totalPretax + totalAccrual + totalAdjustments;

//   const variance = totalPayroll - totalLaborDistribution;

//   const variancePercent = totalLaborDistribution
//     ? variance / totalLaborDistribution
//     : 0;

//   // =====================================================
//   // CREATE SHEET
//   // =====================================================

//   const ws = workbook.addWorksheet("Schedule L");

//   // =====================================================
//   // COLUMNS
//   // =====================================================

//   ws.columns = [
//     { width: 16 }, // A - Acct No.
//     { width: 45 }, // B - Description
//     { width: 4 }, // C - spacer
//     { width: 4 }, // D - spacer
//     { width: 18 }, // E - Ledger
//     { width: 4 }, // F - spacer
//     { width: 28 }, // G - Reference
//   ];

//   // =====================================================
//   // HEADER
//   // =====================================================

//   // IMPORTANT:
//   // DO NOT merge G1:G1.
//   // G1:G6 is merged below.
//   ws.mergeCells("A1:F1");

//   ws.getCell("A1").value = "Schedule L is linked to the following schedules:";

//   ws.getCell("A2").value = "Schedule C, Overhead";
//   ws.getCell("A3").value = "Schedule B, G&A";
//   ws.getCell("A4").value = "Schedule D, Occupancy";
//   ws.getCell("A5").value = "Schedule H, Claimed Allocation Bases";
//   ws.getCell("A6").value = "ICE MANUAL";

//   // ONLY THIS MERGE FOR COLUMN G
//   ws.mergeCells("G1:G6");

//   ws.getCell("G1").value = "SCHEDULE L\nICE (version 2.0.1h)";

//   ws.getCell("A1").font = {
//     bold: true,
//   };

//   ws.getCell("A6").font = {
//     bold: true,
//     underline: true,
//     color: { argb: "FF0000FF" },
//   };

//   ["A2", "A3", "A4", "A5"].forEach((cell) => {
//     ws.getCell(cell).font = {
//       color: { argb: "FF0000FF" },
//       underline: true,
//     };
//   });

//   ws.getCell("G1").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   ws.getCell("G1").font = {
//     bold: true,
//     size: 14,
//   };

//   // =====================================================
//   // COMPANY
//   // =====================================================

//   ws.mergeCells("A7:G7");

//   ws.getCell("A7").value = `${EXPORT_COMPANY_NAME} | ${EXPORT_COMPANY_ADDRESS}`;

//   ws.getCell("A7").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.getCell("A7").font = {
//     bold: true,
//   };

//   // =====================================================
//   // TITLES
//   // =====================================================

//   ws.mergeCells("A8:G8");

//   ws.getCell("A8").value = "Reconciliation of Total Payroll per IRS form 941";

//   ws.mergeCells("A9:G9");

//   ws.getCell("A9").value = "to Total Labor Costs Distribution";

//   ws.mergeCells("A10:G10");

//   ws.getCell("A10").value =
//     `Fiscal Year End - 12/31/${manualEntry.year || year}`;

//   ["A8", "A9", "A10"].forEach((cell) => {
//     ws.getCell(cell).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     ws.getCell(cell).font = {
//       bold: true,
//     };
//   });

//   // =====================================================
//   // MAIN TABLE HEADER
//   // =====================================================

//   ws.addRow(["Acct No.", "Description", "", "", "Ledger", "", "Reference"]);

//   const headerRow = ws.lastRow.number;

//   ws.getRow(headerRow).eachCell((cell) => {
//     cell.font = {
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFEFEFEF" },
//     };

//     cell.border = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };
//   });

//   // =====================================================
//   // GENERAL
//   // =====================================================

//   ws.addRow(["", "General", "", "", "", "", ""]);

//   ws.getCell(ws.lastRow.number, 2).font = {
//     bold: true,
//   };

//   // =====================================================
//   // MAIN API ROWS
//   // =====================================================

//   tableRows.forEach((row) => {
//     let reference = "";

//     if (row.acctName === "Direct Labor") {
//       reference = "Summary SCHED H";
//     } else if (row.acctName === "General & Administrative:") {
//       reference = "SCHED B";
//     } else if (row.acctName === "G&A Executive Labor") {
//       reference = "link from Schedule B";
//     } else if (row.acctName === "Overhead Pools (incl Fringe):") {
//       reference = "SCHED C (x)";
//     } else if (row.acctName?.includes("Cust Site OH Labor")) {
//       reference = "link from Schedule C";
//     } else if (row.acctName === "CA Overhead Labor") {
//       reference = "SCHED D (x)";
//     }

//     const excelRow = ws.addRow([
//       row.acctId || "",
//       row.acctName || "",
//       "",
//       "",
//       row.generalLedger || 0,
//       "",
//       reference,
//     ]);

//     // API-linked ledger
//     excelRow.getCell(5).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFFFFF00" },
//     };

//     // References
//     if (
//       row.acctName === "Direct Labor" ||
//       row.acctName === "General & Administrative:"
//     ) {
//       excelRow.getCell(7).fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF0000FF" },
//       };

//       excelRow.getCell(7).font = {
//         color: { argb: "FFFFFFFF" },
//       };
//     } else if (
//       row.acctName === "Overhead Pools (incl Fringe):" ||
//       row.acctName === "CA Overhead Labor"
//     ) {
//       excelRow.getCell(7).fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF3366FF" },
//       };

//       excelRow.getCell(7).font = {
//         color: { argb: "FFFFFFFF" },
//       };
//     }
//   });

//   // =====================================================
//   // TOTAL LABOR DISTRIBUTION
//   // =====================================================

//   const totalLaborExcelRow = ws.addRow([
//     "",
//     "TOTAL LABOR DISTRIBUTION",
//     "",
//     "",
//     totalLaborDistribution,
//     "",
//     "",
//   ]);

//   totalLaborExcelRow.getCell(5).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FF00FFFF" },
//   };

//   totalLaborExcelRow.font = {
//     bold: true,
//   };

//   // =====================================================
//   // IRS FORM 941
//   // =====================================================

//   ws.addRow([]);

//   const irsHeader = ws.addRow(["", "", "", "", "PER IRS FORM 941", "", ""]);

//   irsHeader.font = {
//     bold: true,
//   };

//   payrollRows.forEach((row) => {
//     ws.addRow(["", row.description, "", "", row.ledger, "", ""]);
//   });

//   // =====================================================
//   // PRETAX DEDUCTIONS
//   // =====================================================

//   ws.addRow([]);

//   const pretaxHeader = ws.addRow([
//     "",
//     "Pretax Deductions :",
//     "",
//     "",
//     "",
//     "",
//     "",
//   ]);

//   pretaxHeader.font = {
//     bold: true,
//   };

//   pretaxRows.forEach((row) => {
//     ws.addRow(["", row.description, "", "", row.ledger, "", ""]);
//   });

//   // =====================================================
//   // PAYROLL & LEAVE ACCRUALS
//   // =====================================================

//   ws.addRow([]);

//   const accrualHeader = ws.addRow([
//     "",
//     "Payroll and Leave Accruals :",
//     "",
//     "",
//     "",
//     "",
//     "",
//   ]);

//   accrualHeader.font = {
//     bold: true,
//   };

//   accrualRows.forEach((row) => {
//     ws.addRow([row.account, row.description, "", "", row.ledger, "", ""]);
//   });

//   // =====================================================
//   // ADJUSTMENTS
//   // =====================================================

//   ws.addRow([]);

//   const adjustmentHeader = ws.addRow(["", "Adjustments:", "", "", "", "", ""]);

//   adjustmentHeader.font = {
//     bold: true,
//   };

//   adjustmentRows.forEach((row) => {
//     ws.addRow([row.account, row.description, "", "", row.ledger, "", ""]);
//   });

//   // =====================================================
//   // FINAL TOTAL
//   // =====================================================

//   ws.addRow([]);

//   const totalPayrollRow = ws.addRow([
//     "",
//     "TOTAL PAYROLL",
//     "",
//     "",
//     totalPayroll,
//     "",
//     "",
//   ]);

//   totalPayrollRow.font = {
//     bold: true,
//   };

//   totalPayrollRow.getCell(5).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FF00FFFF" },
//   };

//   // =====================================================
//   // VARIANCE
//   // =====================================================

//   const varianceRow = ws.addRow(["", "Variance", "", "", variance, "", ""]);

//   varianceRow.getCell(5).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: "FF00FFFF",
//   };

//   // =====================================================
//   // VARIANCE %
//   // =====================================================

//   const variancePercentRow = ws.addRow([
//     "",
//     "Variance %",
//     "",
//     "",
//     variancePercent,
//     "",
//     "",
//   ]);

//   variancePercentRow.getCell(5).numFmt = "0.00%";

//   // =====================================================
//   // NUMBER FORMATTING
//   // =====================================================

//   ws.eachRow((row, rowNumber) => {
//     row.eachCell((cell, colNumber) => {
//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };

//       if (colNumber === 5) {
//         cell.numFmt = "#,##0.00;(#,##0.00);-";

//         cell.alignment = {
//           horizontal: "right",
//           vertical: "middle",
//         };
//       }

//       if (colNumber === 1 || colNumber === 2 || colNumber === 7) {
//         cell.alignment = {
//           vertical: "middle",
//         };
//       }
//     });
//   });

//   // Re-apply percentage format because
//   // the general number formatting above would
//   // otherwise overwrite it.
//   variancePercentRow.getCell(5).numFmt = "0.00%";

//   // =====================================================
//   // LEGEND
//   // =====================================================

//   ws.addRow([]);

//   const legend1 = ws.addRow([
//     "",
//     "Linked to Other Worksheet",
//     "",
//     "",
//     "",
//     "",
//     "As Referenced",
//   ]);

//   legend1.getCell(2).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   const legend2 = ws.addRow([
//     "",
//     "Cell Contains a Formula",
//     "",
//     "",
//     "",
//     "",
//     "Summarizes Totals and Differences",
//   ]);

//   legend2.getCell(2).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FF00FFFF" },
//   };

//   // =====================================================
//   // FREEZE HEADER
//   // =====================================================

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: headerRow,
//     },
//   ];

//   // =====================================================
//   // PAGE SETUP
//   // =====================================================

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//   };
// };

// // Schedule M / FPRA
// const addScheduleMFPRA = async (workbook) => {
//   const ws = workbook.addWorksheet("Schedule M FRPA 2025");

//   // Column widths
//   ws.columns = [{ width: 32 }, { width: 58 }, { width: 22 }];

//   // =========================
//   // HEADER
//   // =========================

//   ws.mergeCells("A1:C1");
//   ws.getCell("A1").value = "CONTROLLED UNCLASSIFIED INFORMATION (CUI)";

//   ws.getCell("A1").font = {
//     bold: true,
//     size: 12,
//     name: "Arial",
//   };

//   ws.getCell("A1").alignment = {
//     horizontal: "center",
//   };

//   // NASA heading
//   ws.getCell("A3").value = "National Aeronautics and";
//   ws.getCell("A4").value = "Space Administration";

//   ws.getCell("A6").value = "Mary W. Jackson NASA Headquarters";
//   ws.getCell("A7").value = "Washington, DC 20546-0001";

//   ["A6", "A7"].forEach((cell) => {
//     ws.getCell(cell).font = {
//       bold: true,
//       name: "Arial",
//     };
//   });

//   // NASA logo
//   // If you have the logo file available to the exporter,
//   // it can be inserted here using workbook.addImage(...).

//   // =========================
//   // META
//   // =========================

//   ws.getCell("A9").value = "IN REPLY REFER TO:";
//   ws.getCell("A9").font = {
//     bold: true,
//     size: 9,
//     name: "Arial",
//   };

//   ws.getCell("A10").value = "Cognizant Federal Agency Office";

//   ws.getCell("C9").value = "August 19, 2025";
//   ws.getCell("C9").font = {
//     bold: true,
//   };

//   ws.getCell("C9").alignment = {
//     horizontal: "right",
//   };

//   // =========================
//   // ADDRESS
//   // =========================

//   ws.getCell("A12").value = "William Bennett";
//   ws.getCell("A13").value = "Director of Finance";
//   ws.getCell("A14").value = EXPORT_COMPANY_NAME;
//   ws.getCell("A15").value = "1960 E Grand Ave. Suite 1000";
//   ws.getCell("A16").value = "El Segundo, CA 90245";

//   // =========================
//   // SUBJECT
//   // =========================

//   ws.getCell("A18").value = "Subject:";
//   ws.getCell("A18").font = {
//     bold: true,
//   };

//   ws.mergeCells("B18:C18");

//   ws.getCell("B18").value =
//     "Established Provisional Billing Rates for Contractor Fiscal Year (CFY) 2025";

//   // =========================
//   // LETTER
//   // =========================

//   ws.mergeCells("A20:C20");
//   ws.getCell("A20").value = "Dear William Bennett,";

//   ws.mergeCells("A22:C24");
//   ws.getCell("A22").value =
//     `In accordance with Federal Acquisition Regulation (FAR) 42.704, Billing Rates, ${EXPORT_COMPANY_NAME} provisional billing rates for CFY 2025 are as follows:`;

//   ws.getCell("A22").alignment = {
//     wrapText: true,
//     vertical: "top",
//   };

//   // =========================
//   // RATE TABLE
//   // =========================

//   const headerRow = ws.addRow([
//     "Indirect Pool",
//     "Allocation Base Description",
//     "Provisional Billing Rate (%)",
//   ]);

//   headerRow.eachCell((cell) => {
//     cell.font = {
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };

//     cell.border = {
//       top: { style: "medium" },
//       bottom: { style: "medium" },
//       left: { style: "medium" },
//       right: { style: "medium" },
//     };
//   });

//   // Same static rows from JSX
//   const tableRows = [
//     {
//       indirectPool: "NASA/NIH Fringe",
//       allocationBase: "Total Direct and Indirect labor costs",
//       rate: "33.04%",
//     },
//     {
//       indirectPool: "Columbus Site OH Rate",
//       allocationBase: "Total Direct Columbus site Labor and Fringe",
//       rate: "6.02%",
//     },
//     {
//       indirectPool: "Customer Site OH Rate",
//       allocationBase: "Total Direct Customer site Labor and Fringe",
//       rate: "4.26%",
//     },
//     {
//       indirectPool: "G&A",
//       allocationBase: "Value Added",
//       rate: "7.45%",
//     },
//     {
//       indirectPool: "MH",
//       allocationBase: "Direct Materials and Subcontract Labor",
//       rate: "1.81%",
//     },
//   ];

//   tableRows.forEach((item) => {
//     const row = ws.addRow([item.indirectPool, item.allocationBase, item.rate]);

//     row.eachCell((cell) => {
//       cell.border = {
//         top: { style: "medium" },
//         bottom: { style: "medium" },
//         left: { style: "medium" },
//         right: { style: "medium" },
//       };

//       cell.alignment = {
//         horizontal: "center",
//         vertical: "middle",
//         wrapText: true,
//       };
//     });

//     row.getCell(3).font = {
//       bold: true,
//     };
//   });

//   // =========================
//   // LETTER CONTINUATION
//   // =========================

//   const startRow = ws.lastRow.number + 2;

//   ws.mergeCells(`A${startRow}:C${startRow + 2}`);

//   ws.getCell(`A${startRow}`).value =
//     `${EXPORT_COMPANY_NAME} should immediately begin using the established billing rates in preparing SF 1443, Contractor's Request for Progress Payment, SF 1034, Public Vouchers for Purchases and Services and/or Cost Vouchers.`;

//   ws.getCell(`A${startRow}`).alignment = {
//     wrapText: true,
//     vertical: "top",
//   };

//   const nextRow = startRow + 4;

//   ws.mergeCells(`A${nextRow}:C${nextRow + 1}`);

//   ws.getCell(`A${nextRow}`).value =
//     "All contract payments should be adjusted to reflect these provisional rates.";

//   ws.getCell(`A${nextRow}`).alignment = {
//     wrapText: true,
//     vertical: "top",
//   };

//   // =========================
//   // FOOTER
//   // =========================

//   const footerRow = nextRow + 4;

//   ws.getCell(`A${footerRow}`).value =
//     "Controlled Unclassified Information (CUI)";

//   ws.getCell(`A${footerRow + 1}`).value =
//     "Controlled By: NASA Headquarters Office of Procurement";

//   ws.getCell(`A${footerRow + 2}`).value =
//     "CUI Category: General Proprietary Business Information";

//   ws.getCell(`A${footerRow + 3}`).value =
//     "Point of Contact: john.d.moore@nasa.gov";

//   for (let i = 0; i < 4; i++) {
//     ws.getCell(`A${footerRow + i}`).font = {
//       bold: true,
//     };
//   }

//   // =========================
//   // GENERAL FORMATTING
//   // =========================

//   ws.eachRow((row) => {
//     row.eachCell((cell) => {
//       cell.font = {
//         ...(cell.font || {}),
//         name: "Times New Roman",
//         size: cell.font?.size || 11,
//       };
//     });
//   });

//   ws.pageSetup = {
//     paperSize: 9, // A4
//     orientation: "portrait",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     margins: {
//       left: 0.5,
//       right: 0.5,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   ws.views = [
//     {
//       showGridLines: false,
//     },
//   ];
// };

// // Schedule M

// const getScheduleMData = async (year = FISCAL_YEAR) => {
//   const token =
//     localStorage.getItem("token") ||
//     JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   const response = await fetch(
//     `${backendUrl}/api/ScheduleM?year=${year}`,
//     {
//       headers,
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Schedule M API failed: ${response.status}`);
//   }

//   const records = await response.json();

//   const recordsArr = Array.isArray(records)
//     ? records
//     : records
//       ? [records]
//       : [];

//   // SAME MAPPING AS ScheduleM.jsx
//   return recordsArr.map((item, index) => ({
//     id: `entry-db-${item.year}-${index}`,

//     change_hdr:
//       item.changeHdr ||
//       item.change_hdr ||
//       "",

//     change_desc:
//       item.changeDesc ||
//       item.change_desc ||
//       "",

//     effective_dt: item.effectiveDt
//       ? new Date(item.effectiveDt)
//       : null,
//   }));
// };

// const addScheduleM = async (
//   workbook,
//   {
//     year = FISCAL_YEAR,
//     companyName = "",
//     companyAddress = "",
//     iceVersion = "ICE (version 2.0.1h)",
//   } = {}
// ) => {
//   const entries = await getScheduleMData(year);

//   const ws = workbook.addWorksheet("Schedule M");

//   ws.columns = [
//     {
//       key: "description",
//       width: 75,
//     },
//     {
//       key: "effective",
//       width: 22,
//     },
//   ];

//   // =====================================================
//   // TOP HEADER
//   // =====================================================

//   ws.mergeCells("A1:B1");

//   const manualCell = ws.getCell("A1");

//   manualCell.value = "Manual Entry";

//   manualCell.font = {
//     name: "Arial",
//     color: { argb: "FF0000FF" },
//     underline: true,
//     size: 11,
//   };

//   // =====================================================
//   // HEADER
//   // =====================================================

//   ws.mergeCells("A2:B2");

//   const headerCell = ws.getCell("A2");

//   headerCell.value =
//     `${companyName || ""}\n` +
//     `${companyAddress || ""}\n` +
//     `SCHEDULE OF DESCRIPTION OF ACCOUNTING SYSTEM AND OTHER SIGNIFICANT\n` +
//     `CHANGES AND OTHER AGREEMENTS AND APPROVALS\n` +
//     `FISCAL YEAR ENDED 12/31/${year}`;

//   headerCell.fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   headerCell.font = {
//     name: "Arial",
//     bold: true,
//     size: 11,
//   };

//   headerCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//     wrapText: true,
//   };

//   ws.getRow(2).height = 95;

//   // =====================================================
//   // SCHEDULE / VERSION
//   // =====================================================

//   const scheduleCell = ws.getCell("B3");

//   scheduleCell.value = "SCHEDULE M";

//   scheduleCell.font = {
//     name: "Arial",
//     bold: true,
//     size: 13,
//   };

//   const versionCell = ws.getCell("B4");

//   versionCell.value = iceVersion;

//   versionCell.font = {
//     name: "Arial",
//     size: 11,
//   };

//   // =====================================================
//   // TABLE HEADER
//   // =====================================================

//   const headerRow = ws.addRow([
//     "Description of change",
//     "Effective",
//   ]);

//   headerRow.height = 22;

//   headerRow.eachCell((cell) => {
//     cell.font = {
//       name: "Arial",
//       bold: true,
//       size: 11,
//     };

//     cell.alignment = {
//       horizontal: "left",
//       vertical: "middle",
//       wrapText: true,
//     };

//     cell.border = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };
//   });

//   // =====================================================
//   // API DATA ONLY
//   // =====================================================

//   entries.forEach((entry, index) => {
//     // -----------------------------------------------
//     // CHANGE HEADER + EFFECTIVE DATE
//     // -----------------------------------------------

//     const headerDataRow = ws.addRow([
//       entry.change_hdr,
//       entry.effective_dt,
//     ]);

//     headerDataRow.height = 28;

//     const changeHeaderCell = headerDataRow.getCell(1);

//     changeHeaderCell.font = {
//       name: "Arial",
//       bold: true,
//       size: 11,
//     };

//     changeHeaderCell.alignment = {
//       vertical: "middle",
//       wrapText: true,
//     };

//     const effectiveCell = headerDataRow.getCell(2);

//     if (entry.effective_dt) {
//       effectiveCell.numFmt = "mm/dd/yyyy";
//     }

//     effectiveCell.font = {
//       name: "Arial",
//       bold: true,
//       size: 11,
//     };

//     effectiveCell.alignment = {
//       vertical: "middle",
//       horizontal: "left",
//     };

//     headerDataRow.eachCell((cell) => {
//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     // -----------------------------------------------
//     // DESCRIPTION FROM API
//     // -----------------------------------------------

//     const descriptionRow = ws.addRow([
//       entry.change_desc,
//       "",
//     ]);

//     ws.mergeCells(
//       `A${descriptionRow.number}:B${descriptionRow.number}`
//     );

//     const descriptionCell = descriptionRow.getCell(1);

//     descriptionCell.font = {
//       name: "Arial",
//       size: 11,
//     };

//     descriptionCell.alignment = {
//       vertical: "top",
//       horizontal: "left",
//       wrapText: true,
//     };

//     descriptionCell.border = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };

//     descriptionRow.height = index === 0 ? 180 : 60;
//   });

//   // =====================================================
//   // FONT
//   // =====================================================

//   ws.eachRow((row) => {
//     row.eachCell((cell) => {
//       cell.font = {
//         ...(cell.font || {}),
//         name: "Arial",
//       };
//     });
//   });

//   ws.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   ws.pageSetup = {
//     orientation: "portrait",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     margins: {
//       left: 0.4,
//       right: 0.4,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };
// };

// //Schedule N

// const formatDateForExcel = (date) => {
//   if (!date) return "";

//   const [year, month, day] = date.split("-");

//   return `${month}/${day}/${year}`;
// };
// const SCHEDULE_N_STORAGE_KEY = "SCHEDULE_N_DATA";

// const getScheduleNData = (year = FISCAL_YEAR) => {
//   let fiscalYearEnd = `${year}-12-31`;
//   let dateOfExecution = "";

//   try {
//     const savedData = localStorage.getItem(SCHEDULE_N_STORAGE_KEY);

//     if (savedData) {
//       const parsedData = JSON.parse(savedData);

//       if (parsedData.fiscalYearEnd) {
//         fiscalYearEnd = parsedData.fiscalYearEnd;
//       }

//       if (parsedData.dateOfExecution) {
//         dateOfExecution = parsedData.dateOfExecution;
//       }
//     }
//   } catch (error) {
//     console.warn("Unable to load Schedule N data:", error);
//   }

//   return {
//     fiscalYearEnd,
//     dateOfExecution,
//   };
// };

// // Same calculation as ScheduleN.jsx
// const getFiscalYearStart = (date) => {
//   if (!date) return "";

//   const [year, month, day] = date.split("-").map(Number);

//   const previousYear = new Date(
//     year - 1,
//     month - 1,
//     day
//   );

//   previousYear.setDate(previousYear.getDate() + 1);

//   const startYear = previousYear.getFullYear();
//   const startMonth = String(
//     previousYear.getMonth() + 1
//   ).padStart(2, "0");

//   const startDay = String(
//     previousYear.getDate()
//   ).padStart(2, "0");

//   return `${startYear}-${startMonth}-${startDay}`;
// };

// const formatLongDate = (date) => {
//   if (!date) return "";

//   const [year, month, day] = date.split("-").map(Number);

//   const value = new Date(
//     year,
//     month - 1,
//     day
//   );

//   return value.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// const addScheduleN = async (
//   workbook,
//   {
//     year = FISCAL_YEAR,
//     companyName = EXPORT_COMPANY_NAME,
//   } = {}
// ) => {
//   // =====================================================
//   // SAME DATA SOURCE AS FRONTEND
//   // =====================================================

//   const {
//     fiscalYearEnd,
//     dateOfExecution,
//   } = getScheduleNData(year);

//   const fiscalYear = fiscalYearEnd
//     ? fiscalYearEnd.split("-")[0]
//     : year;

//   const fiscalYearStart =
//     getFiscalYearStart(fiscalYearEnd);

//   // =====================================================
//   // WORKSHEET
//   // =====================================================

//   const ws = workbook.addWorksheet("Schedule N");

//   ws.columns = [
//     {
//       width: 18,
//     },
//     {
//       width: 95,
//     },
//   ];

//   // =====================================================
//   // TITLE
//   // =====================================================

//   ws.mergeCells("A1:B1");

//   const titleCell = ws.getCell("A1");

//   titleCell.value =
//     "Certificate of Final Indirect Costs";

//   titleCell.font = {
//     name: "Arial",
//     size: 16,
//     bold: true,
//   };

//   titleCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // =====================================================
//   // FISCAL YEAR
//   // =====================================================

//   ws.mergeCells("A2:B2");

//   const fiscalCell = ws.getCell("A2");

//   fiscalCell.value =
//     `Fiscal Year End - ${formatDateForExcel(fiscalYearEnd)}`;

//   fiscalCell.font = {
//     name: "Arial",
//     size: 14,
//     bold: true,
//   };

//   fiscalCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // =====================================================
//   // CERTIFICATION INTRO
//   // =====================================================

//   ws.mergeCells("A4:B5");

//   ws.getCell("A4").value =
//     "This is to certify that I have reviewed this proposal to establish final indirect cost rates, and to the best of my knowledge and belief:";

//   // =====================================================
//   // ITEM 1
//   // SAME TEXT / DYNAMIC VALUES AS FRONTEND
//   // =====================================================

//   ws.mergeCells("A7:B9");

//   ws.getCell("A7").value =
//     `1. All costs included in the proposal, ${companyName}, FY${fiscalYear} ICS, to establish final indirect cost rates for ${formatLongDate(
//       fiscalYearStart
//     )} to ${formatLongDate(
//       fiscalYearEnd
//     )}. Are allowable in accordance with the cost principles of the Federal Acquisition Regulation (FAR) and its supplements applicable to the contracts to which the final indirect cost rates will apply; and`;

//   // =====================================================
//   // ITEM 2
//   // =====================================================

//   ws.mergeCells("A11:B12");

//   ws.getCell("A11").value =
//     "2. This proposal does not include any costs that are expressly unallowable under applicable cost principles of the FAR or its supplements.";

//   // =====================================================
//   // SIGNATURE INFORMATION
//   // =====================================================

//   ws.getCell("A14").value = "Firm:";
//   ws.getCell("B14").value = companyName;

//   ws.getCell("A15").value = "Signature:";

//   // Signature image will be inserted here

//   ws.getCell("A16").value =
//     "Name of Certifying Official:";

//   ws.getCell("B16").value =
//     "William Bennett";

//   ws.getCell("A17").value = "Title:";

//   ws.getCell("B17").value =
//     "Director of Finance";

//   ws.getCell("A18").value =
//     "Date of Execution:";

//   ws.getCell("B18").value =
//     formatDateForExcel(dateOfExecution);

//   // =====================================================
//   // SIGNATURE IMAGE
//   // =====================================================

//   try {
//     const signatureResponse =
//       await fetch(signature);

//     if (signatureResponse.ok) {
//       const signatureBuffer =
//         await signatureResponse.arrayBuffer();

//       const imageId = workbook.addImage({
//   buffer: signatureBuffer,
//   extension: "png",
// });

//       ws.addImage(imageId, {
//         tl: {
//           col: 1.25,
//           row: 14.15,
//         },
//         ext: {
//           width: 220,
//           height: 45,
//         },
//       });
//     }
//   } catch (error) {
//     console.warn(
//       "Unable to load Schedule N signature image:",
//       error
//     );
//   }

//   // =====================================================
//   // FAR SECTION
//   // =====================================================

//   ws.mergeCells("A20:B20");

//   ws.getCell("A20").value =
//     "FAR Part 52.242-4-- Certification of Final Indirect Costs.";

//   ws.mergeCells("A21:B21");

//   ws.getCell("A21").value =
//     "As prescribed in 42.703-2(f), insert the following clause:";

//   ws.mergeCells("A22:B22");

//   ws.getCell("A22").value =
//     "Certification of Final Indirect Costs (Jan 1997)";

//   // =====================================================
//   // FAR PARAGRAPHS
//   // =====================================================

//   const paragraphs = [
//     "(a) The Contractor shall --",

//     "(1) Certify any proposal to establish or modify final indirect cost rates.",

//     "(2) Use the format in paragraph (c) of this clause to certify; and",

//     "(3) Have the certificate signed by an individual of the Contractor's organization at a level no lower than a vice president or chief financial officer of the business segment of the Contractor that submits the proposal.",

//     "(b) Failure by the Contractor to submit a signed certificate, as described in this clause, may result in final indirect costs at rates unilaterally established by the Contracting Officer.",

//     "(c) The certificate of final indirect costs shall be read as follows: (see above)",
//   ];

//   let row = 24;

//   paragraphs.forEach((text) => {
//     ws.mergeCells(`A${row}:B${row}`);

//     ws.getCell(`A${row}`).value = text;

//     row++;
//   });

//   // =====================================================
//   // GENERAL FORMATTING
//   // =====================================================

//   ws.eachRow((r) => {
//     r.eachCell((cell) => {
//       cell.font = {
//         name: "Arial",
//         size: 10,
//         ...(cell.font || {}),
//       };

//       cell.alignment = {
//         vertical: "top",
//         wrapText: true,
//         ...(cell.alignment || {}),
//       };
//     });
//   });

//   // =====================================================
//   // BOLD LABELS
//   // =====================================================

//   [
//     "A14",
//     "A15",
//     "A16",
//     "A17",
//     "A18",
//   ].forEach((address) => {
//     ws.getCell(address).font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };
//   });

//   ws.getCell("A20").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A22").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   // =====================================================
//   // ROW HEIGHTS
//   // =====================================================

//   ws.getRow(1).height = 28;
//   ws.getRow(2).height = 24;
//   ws.getRow(4).height = 45;
//   ws.getRow(7).height = 70;
//   ws.getRow(11).height = 45;

//   // Give signature row enough space
//   ws.getRow(15).height = 48;

//   // =====================================================
//   // VIEW
//   // =====================================================

//   ws.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   // =====================================================
//   // PAGE SETUP
//   // =====================================================

//   ws.pageSetup = {
//     orientation: "portrait",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.3,
//       right: 0.3,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };
// };

// //schedule O
// const getScheduleOData = async (year = FISCAL_YEAR) => {
//   const token =
//     localStorage.getItem("token") ||
//     JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   const response = await fetch(
//     `${backendUrl}/api/ScheduleO?year=${year}`,
//     {
//       headers,
//     }
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Schedule O API failed: ${response.status}`
//     );
//   }

//   const data = await response.json();

//   const records = Array.isArray(data)
//     ? data
//     : data
//       ? [data]
//       : [];

//   // =====================================================
//   // SAME MAPPING AS ScheduleO.jsx
//   // =====================================================

//   const costTypeRows = [];
//   const timeMaterialRows = [];

//   records.forEach((item, index) => {
//     const mappedRow = {
//       id: `db-row-${index}`,

//       contractNo: item.contractNo || "",

//       orderNo: item.orderNo || "",

//       from: item.popStartDt || "",

//       to: item.popEndDt || "",

//       readyToClose: item.readyToCloseFl
//         ? "Y"
//         : "N",

//       ceilingAmount:
//         item.cntrCeilingAmt != null
//           ? String(item.cntrCeilingAmt)
//           : "",

//       fee:
//         item.feeAmt != null
//           ? String(item.feeAmt)
//           : "",

//       required:
//         item.reqHrs != null
//           ? String(item.reqHrs)
//           : "",

//       actual:
//         item.actualHrs != null
//           ? String(item.actualHrs)
//           : "",

//       notes: item.notes || "",
//     };

//     // SAME SECTION LOGIC AS JSX
//     if (item.projType === "CostType") {
//       costTypeRows.push(mappedRow);
//     } else {
//       timeMaterialRows.push(mappedRow);
//     }
//   });

//   return {
//     costTypeRows,
//     timeMaterialRows,
//   };
// };

// const addScheduleO = async (
//   workbook,
//   {
//     companyName = "",
//     companyAddress = "",
//     year = FISCAL_YEAR,
//   } = {}
// ) => {
//   const {
//     costTypeRows,
//     timeMaterialRows,
//   } = await getScheduleOData(year);

//   const ws = workbook.addWorksheet("Schedule O");

//   // =====================================================
//   // COLUMN WIDTHS
//   // =====================================================

//   ws.columns = [
//     { width: 5 },   // Select
//     { width: 16 },  // Contract
//     { width: 13 },  // Order
//     { width: 13 },  // From
//     { width: 13 },  // To
//     { width: 16 },  // Ready
//     { width: 21 },  // Ceiling
//     { width: 14 },  // Fee
//     { width: 13 },  // Required
//     { width: 13 },  // Actual
//     { width: 25 },  // Notes
//   ];

//   // =====================================================
//   // HEADER
//   // =====================================================

//   ws.mergeCells("A1:K1");

//   const companyCell = ws.getCell("A1");

//   companyCell.value = companyName;

//   companyCell.font = {
//     name: "Arial",
//     bold: true,
//     size: 13,
//   };

//   companyCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   ws.mergeCells("A2:K2");

//   const addressCell = ws.getCell("A2");

//   addressCell.value = companyAddress;

//   addressCell.font = {
//     name: "Arial",
//     bold: true,
//     size: 12,
//   };

//   addressCell.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // =====================================================
//   // SCHEDULE O
//   // =====================================================

//   ws.getCell("K3").value = "SCHEDULE O";

//   ws.getCell("K3").font = {
//     name: "Arial",
//     bold: true,
//     size: 13,
//   };

//   ws.getCell("K3").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // =====================================================
//   // TITLE
//   // =====================================================

//   ws.mergeCells("A4:K4");

//   ws.getCell("A4").value =
//     "Schedule of Contract Closing Information";

//   ws.getCell("A4").font = {
//     name: "Arial",
//     bold: true,
//     size: 14,
//   };

//   ws.getCell("A4").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   ws.mergeCells("A5:K5");

//   ws.getCell("A5").value =
//     "for those Contracts which Work Effort was Completed During";

//   ws.getCell("A5").font = {
//     name: "Arial",
//     bold: true,
//     size: 12,
//   };

//   ws.getCell("A5").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // =====================================================
//   // FISCAL YEAR
//   // =====================================================

//   ws.mergeCells("A6:K6");

//   ws.getCell("A6").value =
//     `Fiscal Year End - 12/31/${year}`;

//   ws.getCell("A6").font = {
//     name: "Arial",
//     bold: true,
//     size: 11,
//   };

//   ws.getCell("A6").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   // =====================================================
//   // TABLE HEADER
//   // SAME STRUCTURE AS JSX
//   // =====================================================

//   const headerRow1 = ws.getRow(8);

//   headerRow1.values = [
//     "",
//     "CONTRACT NO.",
//     "ORDER NO.",
//     "PERFORMANCE PERIOD",
//     "",
//     "READY TO CLOSE (1)",
//     "CONTRACT CEILING AMOUNT (2)",
//     "FEE (3)",
//     "LEVEL OF EFFORT CUMULATIVE HOURS",
//     "",
//     "",
//   ];

//   ws.mergeCells("A8:A9");
//   ws.mergeCells("B8:B9");
//   ws.mergeCells("C8:C9");

//   ws.mergeCells("D8:E8");

//   ws.mergeCells("F8:F9");
//   ws.mergeCells("G8:G9");
//   ws.mergeCells("H8:H9");

//   ws.mergeCells("I8:J8");

//   ws.mergeCells("K8:K9");

//   ws.getCell("D9").value = "From";
//   ws.getCell("E9").value = "To";

//   ws.getCell("I9").value = "Required";
//   ws.getCell("J9").value = "Actual";

//   ws.getCell("A8").value = "SELECT";
//   ws.getCell("B8").value = "CONTRACT NO.";
//   ws.getCell("C8").value = "ORDER NO.";
//   ws.getCell("F8").value = "READY TO CLOSE (1)";
//   ws.getCell("G8").value = "CONTRACT CEILING AMOUNT (2)";
//   ws.getCell("H8").value = "FEE (3)";
//   ws.getCell("K8").value = "NOTES";

//   for (let row = 8; row <= 9; row++) {
//     ws.getRow(row).eachCell((cell) => {
//       cell.font = {
//         name: "Arial",
//         bold: true,
//         size: 10,
//       };

//       cell.alignment = {
//         horizontal: "center",
//         vertical: "middle",
//         wrapText: true,
//       };

//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: "FFE8F5FA",
//         },
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });
//   }

//   // =====================================================
//   // HELPER TO ADD API ROW
//   // =====================================================

//   const addDataRow = (item) => {
//     const row = ws.addRow([
//       "",
//       item.contractNo,
//       item.orderNo,
//       item.from,
//       item.to,
//       item.readyToClose,
//       item.ceilingAmount,
//       item.fee,
//       item.required,
//       item.actual,
//       item.notes,
//     ]);

//     row.eachCell((cell, index) => {
//       cell.font = {
//         name: "Arial",
//         size: 9,
//       };

//       cell.alignment = {
//         vertical: "middle",
//         horizontal:
//           index === 7 ||
//           index === 8 ||
//           index === 9 ||
//           index === 10
//             ? "right"
//             : "left",
//         wrapText: true,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     // Currency
//     if (
//       item.ceilingAmount !== "" &&
//       item.ceilingAmount != null
//     ) {
//       const cell = row.getCell(7);

//       cell.value = Number(
//         String(item.ceilingAmount).replace(/[$,]/g, "")
//       );

//       cell.numFmt =
//         '$#,##0.00;($#,##0.00);-';
//     }

//     if (
//       item.fee !== "" &&
//       item.fee != null
//     ) {
//       const cell = row.getCell(8);

//       cell.value = Number(
//         String(item.fee).replace(/[$,]/g, "")
//       );

//       cell.numFmt =
//         '$#,##0.00;($#,##0.00);-';
//     }

//     // Required
//     if (
//       item.required !== "" &&
//       item.required != null
//     ) {
//       const cell = row.getCell(9);

//       cell.value = Number(
//         String(item.required).replace(/[$,]/g, "")
//       );

//       cell.numFmt =
//         '#,##0.00;(#,##0.00);-';
//     }

//     // Actual
//     if (
//       item.actual !== "" &&
//       item.actual != null
//     ) {
//       const cell = row.getCell(10);

//       cell.value = Number(
//         String(item.actual).replace(/[$,]/g, "")
//       );

//       cell.numFmt =
//         '#,##0.00;(#,##0.00);-';
//     }

//     return row;
//   };

//   // =====================================================
//   // COST TYPE SECTION
//   // SAME AS UI
//   // =====================================================

//   const costHeaderRow = ws.addRow([
//     "Cost Type:",
//   ]);

//   ws.mergeCells(
//     costHeaderRow.number,
//     1,
//     costHeaderRow.number,
//     11
//   );

//   const costHeaderCell =
//     costHeaderRow.getCell(1);

//   costHeaderCell.font = {
//     name: "Times New Roman",
//     size: 13,
//     bold: true,
//     italic: true,
//   };

//   costHeaderCell.fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FFF4F9FB",
//     },
//   };

//   costHeaderCell.alignment = {
//     vertical: "middle",
//   };

//   // Same as JSX: NONE
//   const noneRow = ws.addRow([
//     "NONE",
//   ]);

//   ws.mergeCells(
//     noneRow.number,
//     1,
//     noneRow.number,
//     11
//   );

//   noneRow.getCell(1).font = {
//     name: "Times New Roman",
//     size: 13,
//     bold: true,
//   };

//   // API Cost Type rows
//   costTypeRows.forEach((item) => {
//     addDataRow(item);
//   });

//   // =====================================================
//   // TIME & MATERIAL SECTION
//   // =====================================================

//   const tmHeaderRow = ws.addRow([
//     "Time & Material",
//   ]);

//   ws.mergeCells(
//     tmHeaderRow.number,
//     1,
//     tmHeaderRow.number,
//     11
//   );

//   const tmHeaderCell =
//     tmHeaderRow.getCell(1);

//   tmHeaderCell.font = {
//     name: "Times New Roman",
//     size: 13,
//     bold: true,
//     italic: true,
//   };

//   tmHeaderCell.fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: {
//       argb: "FFF4F9FB",
//     },
//   };

//   tmHeaderCell.alignment = {
//     vertical: "middle",
//   };

//   // API Time & Material rows
//   timeMaterialRows.forEach((item) => {
//     addDataRow(item);
//   });

//   // =====================================================
//   // VIEW
//   // =====================================================

//   ws.views = [
//     {
//       showGridLines: false,
//     },
//   ];

//   // =====================================================
//   // FREEZE HEADER
//   // =====================================================

//   ws.freezePanes = {
//     ySplit: 9,
//   };

//   // =====================================================
//   // PRINT
//   // =====================================================

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.3,
//       right: 0.3,
//       top: 0.4,
//       bottom: 0.4,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   return ws;
// };

// //Supply A1
// const getSupplA1Data = async () => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/supply_A1_cost?fyCd=2025`,
//   );

//   if (!response.ok) {
//     throw new Error(`Suppl A-1 API failed: ${response.status}`);
//   }

//   return await response.json();
// };

// const addSupplA1 = async (workbook, companyName, companyAddress) => {
//   const data = await getSupplA1Data();

//   const ws = workbook.addWorksheet("Suppl A-1");

//   ws.columns = [
//     { width: 15 },
//     { width: 42 },
//     { width: 17 },
//     { width: 17 },
//     { width: 15 },
//     { width: 14 },
//     { width: 15 },
//   ];

//   // ---------------------------------------------------------
//   // Header
//   // ---------------------------------------------------------

//   ws.mergeCells("A1:G1");
//   ws.getCell("A1").value = companyName;
//   ws.getCell("A1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A1").alignment = {
//     horizontal: "center",
//   };
//   ws.getCell("A1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.mergeCells("A2:G2");
//   ws.getCell("A2").value = companyAddress;
//   ws.getCell("A2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A2").alignment = {
//     horizontal: "center",
//   };

//   ws.mergeCells("A3:G3");
//   ws.getCell("A3").value =
//     "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY ACCOUNT TO";

//   ws.mergeCells("A4:G4");
//   ws.getCell("A4").value =
//     "PRIOR FISCAL YEAR AND BUDGETARY DATA - OVERHEAD EXPENSES";

//   ws.getCell("A3").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A4").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A3").alignment = {
//     horizontal: "center",
//   };

//   ws.getCell("A4").alignment = {
//     horizontal: "center",
//   };

//   ws.mergeCells("A5:G5");
//   ws.getCell("A5").value = "Fiscal Year End - 12/31/2025";
//   ws.getCell("A5").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A5").alignment = {
//     horizontal: "center",
//   };
//   ws.getCell("A5").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.getCell("G1").value = "Suppl A-1";
//   ws.getCell("G1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   // ---------------------------------------------------------
//   // API schedules
//   // ---------------------------------------------------------

//   const schedules = data?.schedules || [];

//   let currentRow = 7;

//   schedules.forEach((schedule, sIdx) => {
//     // Schedule title
//     ws.mergeCells(`A${currentRow}:G${currentRow}`);

//     const titleCell = ws.getCell(`A${currentRow}`);
//     titleCell.value = schedule.name || "";
//     titleCell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//       italic: true,
//       color: { argb: "0000FF" },
//     };
//     titleCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "A0B0E0" },
//     };

//     currentRow++;

//     // Table header
//     const headerRow = ws.getRow(currentRow);

//     const headers = [
//       "ACC'T NO.",
//       "DESCRIPTION",
//       "CLAIMED\nPRIOR YR",
//       "CLAIMED\nCURRENT YR",
//       "$ CHANGE",
//       "% CHANGE",
//       "PERCENT\nTO TOTAL",
//     ];

//     headers.forEach((header, index) => {
//       const cell = headerRow.getCell(index + 1);
//       cell.value = header;
//       cell.font = {
//         name: "Arial",
//         size: 9,
//         bold: true,
//       };
//       cell.alignment = {
//         horizontal: index < 2 ? "left" : "center",
//         vertical: "middle",
//         wrapText: true,
//       };
//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     headerRow.height = 28;
//     currentRow++;

//     // -------------------------------------------------------
//     // API rows
//     // -------------------------------------------------------

//     (schedule.rows || []).forEach((row) => {
//       const isSubtotal = row.totalName === "Subtotal";

//       const isTotalOverhead = row.totalName?.includes("Total Overhead");

//       const isIntermediate = row.totalName === "Total Intermediate Allocations";

//       const isHighlightName =
//         row.acctName?.includes("California Intermediate") ||
//         row.totalName?.includes("California Intermediate");

//       const excelRow = ws.getRow(currentRow);

//       const values = [
//         row.acctId || "",
//         row.acctName || row.totalName || "",
//         row.claimedPriorYr ?? 0,
//         row.claimedCurrentYr ?? 0,
//         row.changeDollar ?? 0,
//         row.changePercent ?? 0,
//         row.total ?? 0,
//       ];

//       values.forEach((value, index) => {
//         const cell = excelRow.getCell(index + 1);

//         cell.value = value;

//         cell.font = {
//           name: "Arial",
//           size: 9,
//           bold:
//             index === 1 && (isSubtotal || isTotalOverhead || isIntermediate),
//         };

//         cell.alignment = {
//           vertical: "middle",
//           horizontal: index < 2 ? "left" : "right",
//           wrapText: true,
//         };

//         cell.border = {
//           top: { style: "thin" },
//           bottom: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });

//       // Current year = linked/API value
//       excelRow.getCell(4).fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: isSubtotal || isTotalOverhead ? "00FFFF" : "FFFF00",
//         },
//       };

//       // Formula/calculated cells
//       [3, 5, 6, 7].forEach((col) => {
//         excelRow.getCell(col).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "00FFFF" },
//         };
//       });

//       // Highlight California Intermediate
//       if (isHighlightName) {
//         excelRow.getCell(2).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFFF00" },
//         };

//         excelRow.getCell(2).font = {
//           name: "Arial",
//           size: 9,
//           bold: true,
//         };
//       }

//       // Number formats
//       excelRow.getCell(3).numFmt = "#,##0;(#,##0);0";
//       excelRow.getCell(4).numFmt = "#,##0;(#,##0);0";
//       excelRow.getCell(5).numFmt = "#,##0;(#,##0);0";

//       // JSX does `${Number(val).toFixed(1)}%`
//       // so Excel should use 0.0"%" rather than 0.0%
//       // because API value is already percentage points.
//       excelRow.getCell(6).numFmt = '0.0"%"';
//       excelRow.getCell(7).numFmt = '0.0"%"';

//       currentRow++;
//     });

//     currentRow += 2;
//   });

//   // ---------------------------------------------------------
//   // Footer legend
//   // ---------------------------------------------------------

//   ws.getCell(`A${currentRow}`).value = "Linked to Other Worksheet";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${currentRow}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFF00" },
//   };

//   currentRow++;

//   ws.getCell(`A${currentRow}`).value = "Cell Contains a Formula";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${currentRow}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "00FFFF" },
//   };

//   currentRow += 2;

//   ws.getCell(`A${currentRow}`).value = "Note:";
//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   currentRow++;

//   ws.mergeCells(`A${currentRow}:G${currentRow + 2}`);

//   ws.getCell(`A${currentRow}`).value =
//     "Initial Filing Status: FY 2025 represents the Company's initial Incurred Cost Submission. As such, there are no 'Prior Year Claimed' indirect costs reported in Suppl A-1. All balances reflect only the current fiscal year performance.";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//   };

//   ws.getCell(`A${currentRow}`).alignment = {
//     vertical: "top",
//     wrapText: true,
//   };

//   // ---------------------------------------------------------
//   // Page setup
//   // ---------------------------------------------------------

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 6,
//     },
//   ];
// };

// //Supply A2
// const getSupplA2Data = async () => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/supply_A2_cost?fyCd=2025`,
//   );

//   if (!response.ok) {
//     throw new Error(`Suppl A-2 API failed: ${response.status}`);
//   }

//   return await response.json();
// };

// const addSupplA2 = async (workbook, companyName, companyAddress) => {
//   const data = await getSupplA2Data();

//   const ws = workbook.addWorksheet("Suppl A-2");

//   ws.columns = [
//     { width: 15 },
//     { width: 42 },
//     { width: 17 },
//     { width: 17 },
//     { width: 15 },
//     { width: 14 },
//     { width: 15 },
//   ];

//   // ---------------------------------------------------------
//   // HEADER
//   // ---------------------------------------------------------

//   ws.mergeCells("A1:G1");
//   ws.getCell("A1").value = companyName;
//   ws.getCell("A1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A1").alignment = { horizontal: "center" };
//   ws.getCell("A1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.mergeCells("A2:G2");
//   ws.getCell("A2").value = companyAddress;
//   ws.getCell("A2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A2").alignment = { horizontal: "center" };

//   ws.mergeCells("A3:G3");
//   ws.getCell("A3").value =
//     "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY";

//   ws.mergeCells("A4:G4");
//   ws.getCell("A4").value =
//     "ACCOUNT TO PRIOR FISCAL YEAR AND BUDGETARY DATA - G&A";

//   ws.getCell("A3").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A4").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A3").alignment = {
//     horizontal: "center",
//   };

//   ws.getCell("A4").alignment = {
//     horizontal: "center",
//   };

//   ws.mergeCells("A5:G5");
//   ws.getCell("A5").value = "Fiscal Year End - 12/31/2025";
//   ws.getCell("A5").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A5").alignment = {
//     horizontal: "center",
//   };
//   ws.getCell("A5").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.getCell("G1").value = "Suppl A-2";
//   ws.getCell("G1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   // ---------------------------------------------------------
//   // API SCHEDULES
//   // ---------------------------------------------------------

//   const schedules = data?.schedules || [];

//   let currentRow = 7;

//   schedules.forEach((schedule) => {
//     // Schedule header
//     ws.mergeCells(`A${currentRow}:G${currentRow}`);

//     const titleCell = ws.getCell(`A${currentRow}`);
//     titleCell.value = schedule.name || "";
//     titleCell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//       italic: true,
//       color: { argb: "0000FF" },
//     };
//     titleCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "A0B0E0" },
//     };

//     currentRow++;

//     // Table headers
//     const headers = [
//       "ACC'T NO.",
//       "DESCRIPTION",
//       "CLAIMED\nPRIOR YR",
//       "CLAIMED\nCURRENT YR",
//       "$ CHANGE",
//       "% CHANGE",
//       "PERCENT\nTO TOTAL",
//     ];

//     const headerRow = ws.getRow(currentRow);

//     headers.forEach((header, index) => {
//       const cell = headerRow.getCell(index + 1);

//       cell.value = header;

//       cell.font = {
//         name: "Arial",
//         size: 9,
//         bold: true,
//       };

//       cell.alignment = {
//         horizontal: index < 2 ? "left" : "center",
//         vertical: "middle",
//         wrapText: true,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     headerRow.height = 28;
//     currentRow++;

//     // -------------------------------------------------------
//     // ROWS — DIRECTLY FROM API
//     // -------------------------------------------------------

//     (schedule.rows || []).forEach((row) => {
//       const isSubtotal = row.totalName === "Subtotal";

//       const isTotalPool = row.totalName === "Total Overhead Pool";

//       const isIntermediate = row.totalName === "Total Intermediate Allocations";

//       const isHighlightName =
//         row.acctName?.includes("California Intermediate") ||
//         row.totalName?.includes("California Intermediate");

//       const excelRow = ws.getRow(currentRow);

//       const values = [
//         row.acctId || "",
//         row.acctName || row.totalName || "",
//         row.claimedPriorYr ?? 0,
//         row.claimedCurrentYr ?? 0,
//         row.changeDollar ?? 0,
//         row.changePercent ?? 0,
//         row.total ?? 0,
//       ];

//       values.forEach((value, index) => {
//         const cell = excelRow.getCell(index + 1);

//         cell.value = value;

//         cell.font = {
//           name: "Arial",
//           size: 9,
//           bold: index === 1 && (isSubtotal || isTotalPool || isIntermediate),
//         };

//         cell.alignment = {
//           vertical: "middle",
//           horizontal: index < 2 ? "left" : "right",
//           wrapText: true,
//         };

//         cell.border = {
//           top: { style: "thin" },
//           bottom: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });

//       // Claimed Prior Year
//       if (isSubtotal || isTotalPool) {
//         excelRow.getCell(3).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "00FFFF" },
//         };
//       }

//       // Claimed Current Year
//       excelRow.getCell(4).fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: isSubtotal || isTotalPool ? "00FFFF" : "FFFF00",
//         },
//       };

//       // Change / percentages
//       [5, 6, 7].forEach((col) => {
//         excelRow.getCell(col).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "00FFFF" },
//         };
//       });

//       // California Intermediate highlight
//       if (isHighlightName) {
//         excelRow.getCell(2).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFFF00" },
//         };

//         excelRow.getCell(2).font = {
//           name: "Arial",
//           size: 9,
//           bold: true,
//         };
//       }

//       // Number formatting
//       excelRow.getCell(3).numFmt = "#,##0;(#,##0);0";

//       excelRow.getCell(4).numFmt = "#,##0;(#,##0);0";

//       excelRow.getCell(5).numFmt = "#,##0;(#,##0);0";

//       // JSX uses Number(val).toFixed(1) + "%"
//       excelRow.getCell(6).numFmt = '0.0"%"';

//       excelRow.getCell(7).numFmt = '0.0"%"';

//       currentRow++;
//     });

//     currentRow += 2;
//   });

//   // ---------------------------------------------------------
//   // FOOTER
//   // ---------------------------------------------------------

//   ws.mergeCells(`A${currentRow}:G${currentRow + 2}`);

//   ws.getCell(`A${currentRow}`).value =
//     "Initial Filing Status: FY 2025 represents the Company's initial Incurred Cost Submission. As such, there are no 'Prior Year Claimed' indirect costs reported in Supplement A-2. All balances reflect only the current fiscal year performance.";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//   };

//   ws.getCell(`A${currentRow}`).alignment = {
//     vertical: "top",
//     wrapText: true,
//   };

//   currentRow += 4;

//   ws.getCell(`A${currentRow}`).value = "Linked to Other Worksheet";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${currentRow}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFF00" },
//   };

//   currentRow++;

//   ws.getCell(`A${currentRow}`).value = "Cell Contains a Formula";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${currentRow}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "00FFFF" },
//   };

//   // ---------------------------------------------------------
//   // PAGE SETUP
//   // ---------------------------------------------------------

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 6,
//     },
//   ];
// };

// //Supply A3

// const getSupplA3Data = async () => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/supply_A3_cost?fyCd=2025`,
//   );

//   if (!response.ok) {
//     throw new Error(`Suppl A-3 API failed: ${response.status}`);
//   }

//   return await response.json();
// };

// const addSupplA3 = async (workbook, companyName, companyAddress) => {
//   const data = await getSupplA3Data();

//   const ws = workbook.addWorksheet("Suppl A-3");

//   ws.columns = [
//     { width: 15 },
//     { width: 42 },
//     { width: 17 },
//     { width: 17 },
//     { width: 15 },
//     { width: 14 },
//     { width: 15 },
//   ];

//   // Header
//   ws.mergeCells("A1:G1");
//   ws.getCell("A1").value = companyName;
//   ws.getCell("A1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A1").alignment = { horizontal: "center" };
//   ws.getCell("A1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.mergeCells("A2:G2");
//   ws.getCell("A2").value = companyAddress;
//   ws.getCell("A2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A2").alignment = { horizontal: "center" };

//   ws.mergeCells("A3:G3");
//   ws.getCell("A3").value =
//     "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY ACCOUNT TO";

//   ws.mergeCells("A4:G4");
//   ws.getCell("A4").value =
//     "PRIOR FISCAL YEAR AND BUDGETARY DATA - INTERMEDIATE POOL COSTS";

//   ["A3", "A4"].forEach((cell) => {
//     ws.getCell(cell).font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };
//     ws.getCell(cell).alignment = {
//       horizontal: "center",
//     };
//   });

//   ws.mergeCells("A5:G5");
//   ws.getCell("A5").value = "Fiscal Year End - 12/31/2025";
//   ws.getCell("A5").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A5").alignment = {
//     horizontal: "center",
//   };
//   ws.getCell("A5").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   ws.getCell("G1").value = "Suppl A-3";
//   ws.getCell("G1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   let currentRow = 7;

//   // API schedules
//   (data?.schedules || []).forEach((schedule) => {
//     // Schedule name
//     ws.mergeCells(`A${currentRow}:G${currentRow}`);

//     const scheduleCell = ws.getCell(`A${currentRow}`);
//     scheduleCell.value = schedule.name || "";
//     scheduleCell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//       italic: true,
//       underline: true,
//       color: { argb: "0000FF" },
//     };
//     scheduleCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "C0C0C0" },
//     };

//     currentRow++;

//     // Table header
//     const headers = [
//       "ACC'T NO.",
//       "DESCRIPTION",
//       "CLAIMED\nPRIOR YR",
//       "CLAIMED\nCURRENT YR",
//       "$ CHANGE",
//       "% CHANGE",
//       "PERCENT\nTO TOTAL",
//     ];

//     const headerRow = ws.getRow(currentRow);

//     headers.forEach((header, index) => {
//       const cell = headerRow.getCell(index + 1);

//       cell.value = header;
//       cell.font = {
//         name: "Arial",
//         size: 9,
//         bold: true,
//       };

//       cell.alignment = {
//         horizontal: index < 2 ? "left" : "center",
//         vertical: "middle",
//         wrapText: true,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     headerRow.height = 28;
//     currentRow++;

//     // API rows
//     (schedule.rows || []).forEach((row) => {
//       const isSubtotal = row.totalName === "Subtotal";

//       const isTotalPool = row.totalName === "Intermediate Pool Total";

//       const isIntermediate = row.totalName === "Intermediate Allocations:";

//       const excelRow = ws.getRow(currentRow);

//       const values = [
//         row.acctId || "",
//         row.acctName || row.totalName || "",
//         row.claimedPriorYr ?? 0,
//         row.claimedCurrentYr ?? 0,
//         row.changeDollar ?? 0,
//         row.changePercent ?? 0,
//         row.total ?? 0,
//       ];

//       values.forEach((value, index) => {
//         const cell = excelRow.getCell(index + 1);

//         cell.value = value;

//         cell.font = {
//           name: "Arial",
//           size: 9,
//           bold: index === 1 && (isSubtotal || isTotalPool || isIntermediate),
//         };

//         cell.alignment = {
//           vertical: "middle",
//           horizontal: index < 2 ? "left" : "right",
//           wrapText: true,
//         };

//         cell.border = {
//           top: { style: "thin" },
//           bottom: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });

//       // Claimed Prior Year
//       if (isSubtotal || isTotalPool) {
//         excelRow.getCell(3).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "00FFFF" },
//         };
//       }

//       // Claimed Current Year
//       excelRow.getCell(4).fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: {
//           argb: isSubtotal || isTotalPool ? "00FFFF" : "FFFF00",
//         },
//       };

//       // $ Change / % Change / Percent to Total
//       [5, 6, 7].forEach((col) => {
//         excelRow.getCell(col).fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "00FFFF" },
//         };
//       });

//       // Number formats
//       excelRow.getCell(3).numFmt = "#,##0;(#,##0);0";

//       excelRow.getCell(4).numFmt = "#,##0;(#,##0);0";

//       excelRow.getCell(5).numFmt = "#,##0;(#,##0);0";

//       excelRow.getCell(6).numFmt = '0.0"%"';

//       excelRow.getCell(7).numFmt = '0.0"%"';

//       currentRow++;
//     });

//     currentRow += 2;
//   });

//   // Footer note
//   ws.mergeCells(`A${currentRow}:G${currentRow + 2}`);

//   ws.getCell(`A${currentRow}`).value =
//     "Initial Filing Status: FY 2025 represents the Company's initial Incurred Cost Submission. As such, there are no 'Prior Year Claimed' indirect costs reported in Supplement A-3. All balances reflect only the current fiscal year performance.";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//   };

//   ws.getCell(`A${currentRow}`).alignment = {
//     vertical: "top",
//     wrapText: true,
//   };

//   currentRow += 4;

//   // Legend
//   ws.getCell(`A${currentRow}`).value = "Linked to Other Worksheet";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${currentRow}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFF00" },
//   };

//   currentRow++;

//   ws.getCell(`A${currentRow}`).value = "Cell Contains a Formula";

//   ws.getCell(`A${currentRow}`).font = {
//     name: "Arial",
//     size: 9,
//     bold: true,
//   };

//   ws.getCell(`A${currentRow}`).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "00FFFF" },
//   };

//   // Page setup
//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 6,
//     },
//   ];
// };

// //Suppy A4
// const getSupplA4Data = async () => {
//   const response = await fetch(
//     `${backendUrl}/api/TrialBalance/supply_A4_cost?fyCd=2025`,
//   );

//   if (!response.ok) {
//     throw new Error(`Suppl A-4 API failed: ${response.status}`);
//   }

//   return await response.json();
// };

// const addSupplA4 = async (workbook, companyName, companyAddress) => {
//   const data = await getSupplA4Data();

//   const rows = data?.rows || [];

//   const ws = workbook.addWorksheet("Suppl A-4");

//   // Column widths
//   ws.columns = [
//     { width: 42 },
//     { width: 16 },
//     { width: 16 },
//     { width: 18 },
//     { width: 16 },
//     { width: 13 },
//     { width: 15 },
//     { width: 8 },
//   ];

//   // ---------------------------------------------------------
//   // Header
//   // ---------------------------------------------------------

//   ws.mergeCells("A1:C1");
//   ws.getCell("A1").value = "This Schedule is linked to Summary Sch H";
//   ws.getCell("A1").font = { name: "Arial", size: 10, bold: true };

//   ws.mergeCells("A2:C2");
//   ws.getCell("A2").value = "ICE MANUAL";
//   ws.getCell("A2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//     color: { argb: "FF0000FF" },
//     underline: true,
//   };

//   ws.mergeCells("D1:F1");
//   ws.getCell("D1").value = companyName || "";
//   ws.getCell("D1").font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };
//   ws.getCell("D1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };
//   ws.getCell("D1").alignment = { horizontal: "center" };

//   ws.mergeCells("D2:F2");
//   ws.getCell("D2").value = companyAddress || "";
//   ws.getCell("D2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("D2").alignment = { horizontal: "center" };

//   ws.mergeCells("D3:F3");
//   ws.getCell("D3").value =
//     "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY";
//   ws.getCell("D3").font = { name: "Arial", size: 10, bold: true };
//   ws.getCell("D3").alignment = { horizontal: "center" };

//   ws.mergeCells("D4:F4");
//   ws.getCell("D4").value =
//     "ACCOUNT TO PRIOR FISCAL YEAR AND BUDGETARY DATA - DIRECT";
//   ws.getCell("D4").font = { name: "Arial", size: 10, bold: true };
//   ws.getCell("D4").alignment = { horizontal: "center" };

//   ws.mergeCells("D5:F5");
//   ws.getCell("D5").value = "Fiscal Year End - 12/31/2025";
//   ws.getCell("D5").font = { name: "Arial", size: 10, bold: true };
//   ws.getCell("D5").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };
//   ws.getCell("D5").alignment = { horizontal: "center" };

//   ws.getCell("G1").value = "Suppl A-4";
//   ws.getCell("G2").value = "OPTIONAL SCH.";
//   ws.getCell("G3").value = "ICE (version 2.0.1h)";

//   ["G1", "G2", "G3"].forEach((cell) => {
//     ws.getCell(cell).font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };
//     ws.getCell(cell).alignment = { horizontal: "right" };
//   });

//   // ---------------------------------------------------------
//   // Table header
//   // ---------------------------------------------------------

//   const headerRow = ws.addRow([
//     "DESCRIPTION",
//     "CLAIMED\nPRIOR YR",
//     "Adjustment",
//     "CLAIMED\nCURRENT YR",
//     "$ CHANGE",
//     "% CHANGE",
//     "PERCENT\nTO TOTAL",
//     "Note",
//   ]);

//   headerRow.height = 30;

//   headerRow.eachCell((cell) => {
//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };

//     cell.border = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };
//   });

//   headerRow.getCell(1).alignment = {
//     horizontal: "left",
//     vertical: "middle",
//     wrapText: true,
//   };

//   // ---------------------------------------------------------
//   // Helpers - same behavior as JSX
//   // ---------------------------------------------------------

//   const formatNumber = (value) => {
//     if (value === null || value === undefined) return "-";
//     if (value === 0) return "-";

//     const num = Number(value);

//     if (Number.isNaN(num)) return "-";

//     return num;
//   };

//   const getNoteIndex = (acctName) => {
//     switch (acctName) {
//       case "Direct Labor - OH - Onsite":
//         return "1";

//       case "Travel":
//         return "2";

//       case "Other Direct Costs":
//         return "3";

//       case "Subcontracts":
//         return "4";

//       default:
//         return "";
//     }
//   };

//   // ---------------------------------------------------------
//   // API rows
//   // ---------------------------------------------------------

//   rows.forEach((row) => {
//     const isTotalDirectLabor = row.totalName === "Total Direct Labor";

//     const isTotalDirectCosts = row.totalName === "Total Direct Costs";

//     const isHighlightedRow =
//       row.acctName === "Direct Labor - OH - Onsite" ||
//       row.acctName === "Direct Labor - OH - Offsite";

//     const noteIndex = getNoteIndex(row.acctName);

//     const excelRow = ws.addRow([
//       row.acctName || row.totalName || "",
//       formatNumber(row.claimedPriorYr),
//       formatNumber(row.adjustment),
//       formatNumber(row.claimedCurrentYr),
//       formatNumber(row.changeDollar),
//       "N/A",
//       row.total === null || row.total === undefined
//         ? "0.0%"
//         : `${Number(row.total).toFixed(1)}%`,
//       noteIndex,
//     ]);

//     excelRow.eachCell((cell) => {
//       cell.font = {
//         name: "Arial",
//         size: 10,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };

//       cell.alignment = {
//         vertical: "middle",
//       };
//     });

//     // Description
//     excelRow.getCell(1).alignment = {
//       horizontal: "left",
//       vertical: "middle",
//     };

//     // Numeric cells
//     [2, 3, 4, 5].forEach((col) => {
//       excelRow.getCell(col).alignment = {
//         horizontal: "right",
//         vertical: "middle",
//       };
//     });

//     excelRow.getCell(6).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     excelRow.getCell(7).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     excelRow.getCell(8).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     // Number formats
//     [2, 3, 4, 5].forEach((col) => {
//       excelRow.getCell(col).numFmt = "#,##0;(#,##0);-";
//     });

//     excelRow.getCell(7).numFmt = '0.0"%"';

//     // -------------------------------------------------------
//     // Highlight Direct Labor rows
//     // -------------------------------------------------------

//     if (isHighlightedRow) {
//       excelRow.getCell(1).fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFFFFF00" },
//       };

//       excelRow.getCell(1).font = {
//         name: "Arial",
//         size: 10,
//         bold: true,
//       };
//     }

//     // -------------------------------------------------------
//     // Current year
//     // Total Direct Costs = cyan
//     // Everything else = yellow
//     // -------------------------------------------------------

//     excelRow.getCell(4).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: {
//         argb: isTotalDirectCosts ? "FF00FFFF" : "FFFFFF00",
//       },
//     };

//     // -------------------------------------------------------
//     // $ Change = cyan
//     // -------------------------------------------------------

//     excelRow.getCell(5).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FF00FFFF" },
//     };

//     // -------------------------------------------------------
//     // % Change = cyan
//     // Percent to Total = cyan
//     // -------------------------------------------------------

//     excelRow.getCell(6).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FF00FFFF" },
//     };

//     excelRow.getCell(7).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FF00FFFF" },
//     };

//     // -------------------------------------------------------
//     // Total rows
//     // -------------------------------------------------------

//     if (isTotalDirectLabor || isTotalDirectCosts) {
//       excelRow.eachCell((cell) => {
//         cell.font = {
//           name: "Arial",
//           size: 10,
//           bold: true,
//         };

//         cell.border = {
//           top: { style: "thin" },
//           bottom: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });
//     }
//   });

//   // ---------------------------------------------------------
//   // Explanatory notes
//   // ---------------------------------------------------------

//   ws.addRow([]);

//   const notes = [
//     "Explanatory Notes:",
//     "1. Non reimbursable Labor cost to the project 80NM0018D0004 for $212 has been adjusted from claimed labor cost.",
//     "2. Non reimbursable travel cost to the project 80GFSC25CA034 ($1,165.15) and 47QFCA21F0001 (440.02) has been updated as adjustment from the claimed Travel costs.",
//     "3. Non reimbursable ODC cost to the project 4400574846 for $2,953.60 has been updated as adjustment from the claimed ODC costs.",
//     "4. A contract limitation of $276K for project 80GFSC25CA034 has been applied to Teammate Fee Costs, as these are not claimed.",
//   ];

//   notes.forEach((note, index) => {
//     const row = ws.addRow([note]);

//     ws.mergeCells(`A${row.number}:H${row.number}`);

//     row.getCell(1).font = {
//       name: "Arial",
//       size: 10,
//       bold: index === 0,
//       underline: index === 0,
//     };

//     row.getCell(1).alignment = {
//       horizontal: "left",
//       vertical: "middle",
//       wrapText: true,
//     };
//   });

//   // ---------------------------------------------------------
//   // Legend
//   // ---------------------------------------------------------

//   ws.addRow([]);

//   const linkedRow = ws.addRow(["Linked to Other Worksheet"]);

//   linkedRow.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };

//   linkedRow.getCell(1).font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   linkedRow.getCell(1).border = {
//     top: { style: "thin" },
//     bottom: { style: "thin" },
//     left: { style: "thin" },
//     right: { style: "thin" },
//   };

//   const formulaRow = ws.addRow(["Cell Contains a Formula"]);

//   formulaRow.getCell(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FF00FFFF" },
//   };

//   formulaRow.getCell(1).font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   formulaRow.getCell(1).border = {
//     top: { style: "thin" },
//     bottom: { style: "thin" },
//     left: { style: "thin" },
//     right: { style: "thin" },
//   };

//   // ---------------------------------------------------------
//   // Footer note
//   // ---------------------------------------------------------

//   ws.addRow([]);

//   const footerRow = ws.addRow([
//     "Note: This is the contractor's initial Incurred Cost Submission; therefore, prior year claimed amounts are not applicable and are reflected as zero.",
//   ]);

//   ws.mergeCells(`A${footerRow.number}:H${footerRow.number}`);

//   footerRow.getCell(1).font = {
//     name: "Arial",
//     size: 10,
//     color: { argb: "FF666666" },
//   };

//   footerRow.getCell(1).alignment = {
//     wrapText: true,
//     vertical: "top",
//   };

//   // ---------------------------------------------------------
//   // Freeze / print setup
//   // ---------------------------------------------------------

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 6,
//     },
//   ];

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//   };

//   ws.pageSetup.printArea = `A1:H${ws.lastRow.number}`;
// };

// // Supply B

// const getSupplBData = async (year = 2025) => {
//   const [hdrRes, detlRes] = await Promise.all([
//     fetch(`${backendUrl}/api/SupplBHdr/get-by-year?year=${year}`),
//     fetch(`${backendUrl}/api/SupplBDetl?year=${year}`),
//   ]);

//   const header = hdrRes.ok ? await hdrRes.json() : null;
//   const details = detlRes.ok ? await detlRes.json() : [];

//   return {
//     header,
//     details: Array.isArray(details) ? details : [],
//   };
// };

// const addSupplB = async (
//   workbook,
//   companyName = EXPORT_COMPANY_NAME,
//   companyAddress = "Vienna",
//   year = 2025,
// ) => {
//   const { header, details } = await getSupplBData(year);

//   const ws = workbook.addWorksheet("Suppl B");

//   ws.columns = [
//     { width: 24 },
//     { width: 14 },
//     { width: 30 },
//     { width: 10 },
//     { width: 16 },
//     { width: 12 },
//     { width: 12 },
//     { width: 15 },
//     { width: 15 },
//     { width: 14 },
//     { width: 15 },
//     { width: 12 },
//     { width: 14 },
//     { width: 15 },
//   ];

//   // =========================================================
//   // HEADER
//   // =========================================================

//   ws.mergeCells("A1:N1");
//   ws.getCell("A1").value = companyName;
//   ws.getCell("A1").font = {
//     name: "Arial",
//     size: 11,
//     bold: true,
//   };
//   ws.getCell("A1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFF00" },
//   };
//   ws.getCell("A1").alignment = {
//     horizontal: "center",
//   };

//   ws.mergeCells("A2:N2");
//   ws.getCell("A2").value = companyAddress;
//   ws.getCell("A2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A2").alignment = {
//     horizontal: "center",
//   };

//   ws.mergeCells("A3:N3");
//   ws.getCell("A3").value =
//     "GENERAL ORGANIZATIONAL INFORMATION AND COMPENSATION FOR CERTAIN CONTRACTOR EMPLOYEES PER FAR 31/205-6(p)";
//   ws.getCell("A3").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };
//   ws.getCell("A3").alignment = {
//     horizontal: "center",
//     wrapText: true,
//   };

//   // =========================================================
//   // CONTRACTOR DATA
//   // =========================================================

//   ws.mergeCells("A5:N5");
//   ws.getCell("A5").value = "Contractor Compensation Information";
//   ws.getCell("A5").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.mergeCells("A6:N6");
//   ws.getCell("A6").value = "Contractor Data";
//   ws.getCell("A6").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   // Contractor name / FYE
//   const contractorHeader = ws.addRow([
//     "CONTRACTOR NAME:",
//     "",
//     header?.cntrName || "",
//     "",
//     "",
//     "CONTRACTOR FYE (MM/DD/YY):",
//     "",
//     header?.cntrYear ? new Date(header.cntrYear) : "",
//   ]);

//   ws.mergeCells(`A${contractorHeader.number}:B${contractorHeader.number}`);
//   ws.mergeCells(`C${contractorHeader.number}:E${contractorHeader.number}`);
//   ws.mergeCells(`F${contractorHeader.number}:G${contractorHeader.number}`);

//   contractorHeader.eachCell((cell) => {
//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };
//     cell.border = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };
//     cell.alignment = {
//       vertical: "middle",
//       horizontal: "center",
//     };
//   });

//   contractorHeader.getCell(3).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFFFFFF" },
//   };

//   contractorHeader.getCell(8).numFmt = "mm/dd/yy";

//   // Column headers
//   const contractorColumns = ws.addRow([
//     "SIC/NAICS CODE:",
//     "CODE",
//     "SIC/NAICS CODE DESCRIPTION",
//     "YEAR",
//     "SALES",
//     "GOVT %",
//     "ADV %",
//     "EMPLYS. #",
//   ]);

//   contractorColumns.eachCell((cell) => {
//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFDFF1FA" },
//     };

//     cell.border = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };
//   });

//   // =========================================================
//   // PRIMARY / SECONDARY
//   // =========================================================

//   const primary = {
//     type: "PRIMARY",
//     sicCode: header?.primaryNaicsCd || "",
//     sicDescription: header?.primaryNaicsDesc || "",
//     year: header?.year || year,
//     sales: header?.salesAmt ?? "",
//     govtPercent: header?.govtPercent ?? "",
//     advPercent: header?.advPercent ?? "",
//     employees: header?.emplYsPercent ?? "",
//   };

//   const secondary = {
//     type: "SECONDARY",
//     sicCode: header?.secondNaicsCd || "",
//     sicDescription: header?.secondNaicsDesc || "",
//     year: "",
//     sales: "",
//     govtPercent: "",
//     advPercent: "",
//     employees: "",
//   };

//   [primary, secondary].forEach((item) => {
//     const row = ws.addRow([
//       item.type,
//       item.sicCode,
//       item.sicDescription,
//       item.year,
//       item.sales,
//       item.govtPercent,
//       item.advPercent,
//       item.employees,
//     ]);

//     row.eachCell((cell) => {
//       cell.font = {
//         name: "Arial",
//         size: 10,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     row.getCell(5).numFmt = "#,##0.00;(#,##0.00);-";
//     row.getCell(6).numFmt = "0";
//     row.getCell(7).numFmt = "0";
//     row.getCell(8).numFmt = "0";
//   });

//   // =========================================================
//   // COMPENSATION DATA
//   // =========================================================

//   ws.addRow([]);

//   const compensationTitle = ws.addRow(["Compensation Data"]);

//   ws.mergeCells(`A${compensationTitle.number}:N${compensationTitle.number}`);

//   compensationTitle.getCell(1).font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   const compensationHeader = ws.addRow([
//     "FY",
//     "POSITION",
//     "SALES SCOPE",
//     "% TIME DIRECT",
//     "BASE SALARY",
//     "BONUS",
//     "401(k) MATCH",
//     "HEALTH/LIFE INS.",
//     "AUTO ALLOW.",
//     "DEFERRED COMP.",
//     "LTI",
//     "OTHER*",
//     "VOL. DELS.",
//     "PROPOSED COMP.",
//   ]);

//   compensationHeader.eachCell((cell) => {
//     cell.font = {
//       name: "Arial",
//       size: 10,
//       bold: true,
//     };

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFDFF1FA" },
//     };

//     cell.border = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };

//     cell.alignment = {
//       horizontal: "center",
//       vertical: "middle",
//       wrapText: true,
//     };
//   });

//   // =========================================================
//   // DETAIL API DATA
//   // Same mapping as JSX
//   // =========================================================

//   details.forEach((d) => {
//     const row = ws.addRow([
//       d.year || year,
//       d.position || "",
//       d.salesAmt ?? "",
//       d.directTimePercent ?? "",
//       d.baseSalAmt ?? "",
//       "", // BONUS - JSX does not load bonus from API
//       d.employer401Amt ?? "",
//       d.healthLifeInsAmt ?? "",
//       d.autoAllowAmt ?? "",
//       d.deferredCompAmt ?? "",
//       d.ltiAmt ?? "",
//       d.otherAmt ?? "",
//       d.volDelsAmt ?? "",
//       d.proposedCompAmt ?? "",
//     ]);

//     row.eachCell((cell) => {
//       cell.font = {
//         name: "Arial",
//         size: 10,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };

//       cell.alignment = {
//         vertical: "middle",
//       };
//     });

//     // Numeric formatting
//     for (let col = 3; col <= 14; col++) {
//       row.getCell(col).numFmt = "#,##0.00;(#,##0.00);-";
//       row.getCell(col).alignment = {
//         horizontal: "right",
//       };
//     }

//     row.getCell(4).numFmt = "0";
//   });

//   // =========================================================
//   // BASIS OF CONTRACTOR'S COMPENSATION
//   // =========================================================

//   ws.addRow([]);

//   const basisTitle = ws.addRow(["Basis of Contractor's Compensation"]);

//   ws.mergeCells(`A${basisTitle.number}:N${basisTitle.number}`);

//   basisTitle.getCell(1).font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   const basisDescription = ws.addRow([
//     "Below, please check the box next to the item which describes the contractor's basis for the proposed compensation costs, i.e. how the compensation levels were established in accordance with any existing policies and procedures. Also, did the contractor consider whether the proposed compensation was reasonable in accordance with FAR 31.205-6(b)? If so, include any reasonableness analysis, including all assumptions, data relied upon, compensation surveys and/or any other data. Include any attachments separately.",
//   ]);

//   ws.mergeCells(`A${basisDescription.number}:N${basisDescription.number}`);

//   basisDescription.getCell(1).alignment = {
//     wrapText: true,
//     vertical: "top",
//   };

//   basisDescription.getCell(1).font = {
//     name: "Arial",
//     size: 10,
//   };

//   // ---------------------------------------------------------
//   // Basis values come from SupplBHdr API
//   // ---------------------------------------------------------

//   const basisRows = [
//     [
//       header?.marketPriceDataFl,
//       "Market Pricing Data (Compensation Surveys)",
//       header?.priorDcaaAuditFl,
//       "Prior DCAA Audit of Compensation Reasonableness",
//     ],
//     [
//       header?.writtenCompPlanFl,
//       "Written Compensation Plan/Policy",
//       header?.thirdPartyCompFl,
//       "3rd Party (Consultant) Compensation Analysis",
//     ],
//     [
//       header?.managementJudgement,
//       "Management Judgment (No written plan/policy)",
//       header?.other ? true : false,
//       `Other -- ${header?.other || ""}`,
//     ],
//     [header?.determinedByBodFl, "Determined by Board of Directors", "", ""],
//   ];

//   basisRows.forEach((basis) => {
//     const row = ws.addRow([
//       basis[0] ? "☑" : "☐",
//       basis[1],
//       basis[2] ? "☑" : "☐",
//       basis[3],
//     ]);

//     ws.mergeCells(`B${row.number}:G${row.number}`);
//     ws.mergeCells(`D${row.number}:N${row.number}`);

//     row.eachCell((cell) => {
//       cell.font = {
//         name: "Arial",
//         size: 10,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });
//   });

//   // ---------------------------------------------------------
//   // Job descriptions
//   // ---------------------------------------------------------

//   const jobDescRow = ws.addRow([
//     "(1) Indicate if Job Descriptions are available:",
//     header?.jobDescFl === true ? "YES" : "NO",
//   ]);

//   ws.mergeCells(`A${jobDescRow.number}:F${jobDescRow.number}`);

//   jobDescRow.getCell(1).font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   jobDescRow.getCell(2).font = {
//     name: "Arial",
//     size: 10,
//   };

//   // =========================================================
//   // STATIC JSX TEXT / NOTES
//   // These are labels, not financial API values.
//   // =========================================================

//   const otherDescription = ws.addRow([
//     "*Written description Other compensation: personal usage of leased vehicle; PTO payout; cell phone reimbursement",
//   ]);

//   ws.mergeCells(`A${otherDescription.number}:N${otherDescription.number}`);

//   const otherBreakdown = ws.addRow([
//     "*Breakdown of Other compensation by cost element: $25,539 personal usage of leased vehicle; $24,304 PTO pay-out; $1,920 cell phone reimbursement",
//   ]);

//   ws.mergeCells(`A${otherBreakdown.number}:N${otherBreakdown.number}`);

//   [otherDescription, otherBreakdown].forEach((row) => {
//     row.getCell(1).font = {
//       name: "Arial",
//       size: 10,
//     };

//     row.getCell(1).alignment = {
//       wrapText: true,
//     };
//   });

//   ws.addRow([]);

//   const footer = ws.addRow([
//     "The contractor data above is fixed. Use the controls in the Compensation Data table below to manage compensation rows.",
//   ]);

//   ws.mergeCells(`A${footer.number}:N${footer.number}`);

//   footer.getCell(1).font = {
//     name: "Arial",
//     size: 9,
//     color: { argb: "FF4B6471" },
//   };

//   footer.getCell(1).alignment = {
//     wrapText: true,
//   };

//   // =========================================================
//   // PAGE SETUP
//   // =========================================================

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 9,
//     },
//   ];

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//   };

//   ws.pageSetup.printArea = `A1:N${ws.lastRow.number}`;
// };

// //Supply C
// const getSupplCData = async (year = 2025) => {
//   const token =
//     localStorage.getItem("token") ||
//     JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

//   const response = await fetch(
//     `${backendUrl}/api/SupplC?year=${year}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch Suppl C: ${response.status}`
//     );
//   }

//   const data = await response.json();

//   const records = Array.isArray(data)
//     ? data
//     : data
//       ? [data]
//       : [];

//   // Same mapping as the JSX
//   return records.map((item) => {
//     const startDt = item.subcPopStartDt
//       ? formatDateToString(new Date(item.subcPopStartDt))
//       : "";

//     const endDt = item.subcPopEndDt
//       ? formatDateToString(new Date(item.subcPopEndDt))
//       : "";

//     let releaseText = "";

//     if (item.subcToPrime === true) {
//       releaseText = "Yes";
//     } else if (item.subcToPrime === false) {
//       releaseText = "No";
//     }

//     return {
//       primeCntrNameAddr: item.primeCntrNameAddr || "",
//       primeCntrNo: item.primeCntrNo || "",
//       subcNo: item.subcNo || "",
//       subcType: item.subcType || "",
//       releaseText,
//       startDt,
//       endDt,
//       subcAmt:
//         item.subcAmt != null
//           ? Number(item.subcAmt)
//           : "",
//     };
//   });
// };

// const addSupplC = async (workbook, year = 2025) => {
//   const records = await getSupplCData(year);

//   const ws = workbook.addWorksheet("Suppl C");

//   // ---------------------------------------------------------
//   // Column widths - based on supplied UI/reference
//   // ---------------------------------------------------------
//   ws.columns = [
//     { width: 42 }, // A - Prime contractor Name and Full Address
//     { width: 20 }, // B - Prime Contract No.
//     { width: 18 }, // C - Subcontract Number
//     { width: 18 }, // D - Subcontract Type
//     { width: 4 },  // E - spacing
//     { width: 18 }, // F - Release Subcontractor Data To Prime
//     { width: 28 }, // G - Subcontract Period of Performance
//     { width: 18 }, // H - Subcontract Value
//     { width: 12 }, // I - spacing
//   ];

//   // ---------------------------------------------------------
//   // Header
//   // ---------------------------------------------------------
//   ws.getCell("A1").value =
//     "This Schedule does not contain any";

//   ws.getCell("A2").value =
//     " links to other schedules.";

//   ws.getCell("A3").value =
//     "ICE MANUAL";

//   ws.mergeCells("B1:G1");
//   ws.mergeCells("B2:G2");
//   ws.mergeCells("B3:G3");

//   ws.getCell("B1").value =
//     "IDENTIFICATION OF PRIME CONTRACTS UNDER";

//   ws.getCell("B2").value =
//     "WHICH THE CONTRACTOR PERFROMS AS A SUBCONTRACTOR";

//   ws.getCell("B3").value =
//     `Fiscal Year End - 12/31/${year}`;

//   ws.getCell("H1").value =
//     "Suppl C";

//   ws.getCell("H2").value =
//     " ICE (version 2.0.1h)";

//   // ---------------------------------------------------------
//   // Header styling
//   // ---------------------------------------------------------
//   ws.getCell("A1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A3").font = {
//     name: "Arial",
//     size: 10,
//     color: { argb: "FF0000FF" },
//     underline: true,
//   };

//   ws.getCell("B1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("B2").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("B3").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("H1").font = {
//     name: "Times New Roman",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("H2").font = {
//     name: "Times New Roman",
//     size: 10,
//     bold: true,
//   };

//   ["B1", "B2", "B3"].forEach((cell) => {
//     ws.getCell(cell).alignment = {
//       horizontal: "center",
//       vertical: "bottom",
//       wrapText: true,
//     };
//   });

//   // ---------------------------------------------------------
//   // Table header - same as JSX
//   // ---------------------------------------------------------
//   ws.getRow(6).values = [
//     "Prime contractor  Name",
//     "Prime Contract No.",
//     "Subcontract",
//     "Subcontract",
//     "",
//     "Release Subcontractor",
//     "Subcontract Period of",
//     "Subcontract",
//     "",
//   ];

//   ws.getRow(7).values = [
//     "and Full Address",
//     "",
//     "Number",
//     "Type",
//     "",
//     "Data To Prime",
//     "Performance",
//     "Value",
//     "",
//   ];

//   ws.getCell("F8").value = "Yes/No";

//   // ---------------------------------------------------------
//   // Table header styling
//   // ---------------------------------------------------------
//   for (let row = 6; row <= 8; row++) {
//     for (let col = 1; col <= 9; col++) {
//       const cell = ws.getCell(row, col);

//       cell.font = {
//         name: row <= 7 ? "Arial" : "Arial",
//         size: row === 6 && (col === 3 || col === 7 || col === 8)
//           ? 11
//           : 10,
//         bold: true,
//         italic: row <= 7,
//       };

//       cell.alignment = {
//         horizontal:
//           col === 8
//             ? "left"
//             : "center",
//         vertical: "bottom",
//         wrapText: true,
//       };
//     }
//   }

//   // ---------------------------------------------------------
//   // Gray separator row - same as reference
//   // ---------------------------------------------------------
//   for (let col = 1; col <= 9; col++) {
//     const cell = ws.getCell(9, col);

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFC0C0C0" },
//     };

//     cell.border = {
//       top: {
//         style: "thin",
//       },
//       bottom: {
//         style: "thin",
//       },
//     };
//   }

//   // ---------------------------------------------------------
//   // API DATA ONLY
//   // ---------------------------------------------------------
//   const startRow = 11;

//   records.forEach((item, index) => {
//     const rowNumber = startRow + index;

//     ws.getRow(rowNumber).values = [
//       item.primeCntrNameAddr,
//       item.primeCntrNo,
//       item.subcNo,
//       item.subcType,
//       "",
//       item.releaseText,
//       item.startDt || item.endDt
//         ? `${item.startDt || ""}${
//             item.startDt && item.endDt ? " - " : ""
//           }${item.endDt || ""}`
//         : "",
//       item.subcAmt,
//       "",
//     ];

//     // -------------------------------------------------------
//     // Row styling
//     // -------------------------------------------------------
//     for (let col = 1; col <= 9; col++) {
//       const cell = ws.getCell(rowNumber, col);

//       cell.font = {
//         name: "Arial",
//         size: 10,
//       };

//       cell.alignment = {
//         vertical: "center",
//         horizontal:
//           col === 2 ||
//           col === 3 ||
//           col === 4 ||
//           col === 6 ||
//           col === 7
//             ? "center"
//             : col === 8
//               ? "left"
//               : "left",
//         wrapText: true,
//       };

//       cell.border = {
//         top: {
//           style: "thin",
//         },
//         bottom: {
//           style: "thin",
//         },
//         left: {
//           style: "thin",
//         },
//         right: {
//           style: "thin",
//         },
//       };
//     }

//     // -------------------------------------------------------
//     // Subcontract value
//     // Same actual API value as JSX
//     // -------------------------------------------------------
//     if (
//       item.subcAmt !== null &&
//       item.subcAmt !== undefined &&
//       item.subcAmt !== ""
//     ) {
//       ws.getCell(rowNumber, 8).numFmt =
//         "$#,##0.00;($#,##0.00);-";
//     }
//   });

//   // ---------------------------------------------------------
//   // Empty rows - UI has editable empty rows
//   // These are NOT actual/static data.
//   // ---------------------------------------------------------
//   const minimumRows = 16;

//   for (
//     let index = records.length;
//     index < minimumRows;
//     index++
//   ) {
//     const rowNumber = startRow + index;

//     for (let col = 1; col <= 9; col++) {
//       const cell = ws.getCell(rowNumber, col);

//       cell.font = {
//         name: "Arial",
//         size: 10,
//       };

//       cell.border = {
//         top: {
//           style: "thin",
//         },
//         bottom: {
//           style: "thin",
//         },
//         left: {
//           style: "thin",
//         },
//         right: {
//           style: "thin",
//         },
//       };
//     }
//   }

//   // ---------------------------------------------------------
//   // Row heights - same general UI/reference layout
//   // ---------------------------------------------------------
//   for (let row = 1; row <= 28; row++) {
//     ws.getRow(row).height = 20;
//   }

//   // Data rows
//   for (
//     let row = startRow;
//     row < startRow + Math.max(records.length, minimumRows);
//     row++
//   ) {
//     ws.getRow(row).height = 35;
//   }

//   // ---------------------------------------------------------
//   // Page setup
//   // ---------------------------------------------------------
//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     paperSize: 9,
//     margins: {
//       left: 0.25,
//       right: 0.25,
//       top: 0.5,
//       bottom: 0.5,
//       header: 0.2,
//       footer: 0.2,
//     },
//   };

//   // ---------------------------------------------------------
//   // Freeze above data
//   // ---------------------------------------------------------
//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 10,
//     },
//   ];

//   return ws;
// };

// //Traisl Balance

// const getTrialBalanceData = async () => {
//   const response = await fetch(`${backendUrl}/api/TrialBalance`);

//   if (!response.ok) {
//     throw new Error(
//       `Trial Balance API failed: ${response.status} ${response.statusText}`,
//     );
//   }

//   const data = await response.json();

//   return Array.isArray(data) ? data : [];
// };

// const addTrialBalance = async (workbook) => {
//   const data = await getTrialBalanceData();

//   const ws = workbook.addWorksheet("Trial Balance");

//   // Same columns as the JSX
//   const headers = [
//     "Account ID",
//     "Account Name",
//     "Org ID",
//     "Beginning Balance",
//     "Prior Pd YTD Activity",
//     "Current Pd Activity",
//     "Ending Balance",
//     "Adjustments",
//     "Adjusted Balance",
//   ];

//   ws.addRow(headers);

//   // Same data mapping as JSX export
//   data.forEach((item) => {
//     ws.addRow([
//       item.acctId,
//       item.acctName?.trim() || "",
//       item.orgId,
//       item.beginningBalance ?? 0,
//       item.priorPeriodYtdActivity ?? 0,
//       item.currentPdActivity ?? 0,
//       item.endingBalance ?? 0,
//       item.adjustments ?? 0,
//       item.adjustedBalance ?? 0,
//     ]);
//   });

//   // Header formatting
//   const headerRow = ws.getRow(1);

//   headerRow.font = {
//     bold: true,
//     color: { argb: "FFFFFFFF" },
//   };

//   headerRow.fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FF475569" },
//   };

//   headerRow.alignment = {
//     vertical: "middle",
//     horizontal: "center",
//   };

//   headerRow.height = 24;

//   // Borders
//   ws.eachRow((row) => {
//     row.eachCell((cell) => {
//       cell.border = {
//         top: {
//           style: "thin",
//           color: { argb: "FFE2E8F0" },
//         },
//         bottom: {
//           style: "thin",
//           color: { argb: "FFE2E8F0" },
//         },
//         left: {
//           style: "thin",
//           color: { argb: "FFE2E8F0" },
//         },
//         right: {
//           style: "thin",
//           color: { argb: "FFE2E8F0" },
//         },
//       };
//     });
//   });

//   // Account columns
//   ws.getColumn(1).width = 18;
//   ws.getColumn(2).width = 35;
//   ws.getColumn(3).width = 15;

//   // Numeric columns
//   for (let col = 4; col <= 9; col++) {
//     ws.getColumn(col).width = 22;

//     for (let row = 2; row <= ws.rowCount; row++) {
//       ws.getCell(row, col).numFmt = "$#,##0.00;($#,##0.00);-";

//       ws.getCell(row, col).alignment = {
//         horizontal: "right",
//       };
//     }
//   }

//   // Account / Org alignment
//   for (let row = 2; row <= ws.rowCount; row++) {
//     ws.getCell(row, 1).font = {
//       bold: true,
//     };

//     ws.getCell(row, 3).alignment = {
//       horizontal: "center",
//     };
//   }

//   // Match frontend's important ending/adjusted balance emphasis
//   for (let row = 2; row <= ws.rowCount; row++) {
//     ws.getCell(row, 7).font = {
//       bold: true,
//     };

//     ws.getCell(row, 9).font = {
//       bold: true,
//       color: { argb: "FF312E81" },
//     };
//   }

//   // Freeze header
//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 1,
//     },
//   ];

//   // Filter
//   ws.autoFilter = {
//     from: "A1",
//     to: `I${Math.max(ws.rowCount, 1)}`,
//   };

//   // Print setup
//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//   };
// };

// // Job cost ledger

// const getJobCostLedgerData = async () => {
//   const response = await fetch(`${backendUrl}/api/JobCostLedger`);

//   if (!response.ok) {
//     throw new Error(`Job Cost Ledger API failed: ${response.status}`);
//   }

//   const data = await response.json();

//   return Array.isArray(data) ? data : [];
// };

// const addJobCostLedger = async (workbook) => {
//   const data = await getJobCostLedgerData();

//   const ws = workbook.addWorksheet("Job Cost Ledger");

//   // =====================================================
//   // COLUMNS
//   // =====================================================

//   ws.columns = [
//     { header: "Year", key: "year", width: 12 },
//     { header: "Project ID", key: "projId", width: 18 },
//     { header: "Project Name", key: "projName", width: 35 },
//     { header: "Account ID", key: "acctId", width: 18 },
//     { header: "Org ID", key: "orgId", width: 15 },
//     { header: "Billing Level", key: "billingLvl", width: 16 },
//     { header: "Report Level", key: "reportLvl", width: 16 },
//     { header: "Project Type", key: "projType", width: 18 },
//     {
//       header: "Prime Contract ID",
//       key: "primeCntrId",
//       width: 22,
//     },
//     {
//       header: "Subcontract ID",
//       key: "subctrId",
//       width: 22,
//     },
//     { header: "Amount", key: "amount", width: 18 },
//   ];

//   // =====================================================
//   // HEADER STYLING
//   // =====================================================

//   const headerRow = ws.getRow(1);

//   headerRow.eachCell((cell) => {
//     cell.font = {
//       bold: true,
//       color: { argb: "FF334155" },
//     };

//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFF1F5F9" },
//     };

//     cell.alignment = {
//       vertical: "middle",
//       horizontal: "center",
//       wrapText: true,
//     };

//     cell.border = {
//       top: { style: "thin", color: { argb: "FFE2E8F0" } },
//       bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
//       left: { style: "thin", color: { argb: "FFE2E8F0" } },
//       right: { style: "thin", color: { argb: "FFE2E8F0" } },
//     };
//   });

//   headerRow.height = 24;

//   // =====================================================
//   // API DATA
//   // SAME MAPPING AS FRONTEND
//   // =====================================================

//   data.forEach((item) => {
//     const row = ws.addRow({
//       year: item.year,
//       projId: item.projId,
//       projName: item.projName?.trim() || "",
//       acctId: item.acctId,
//       orgId: item.orgId,
//       billingLvl: item.billingLvl,
//       reportLvl: item.reportLvl,
//       projType: item.projType,
//       primeCntrId: item.primeCntrId || "",
//       subctrId: item.subctrId || "",
//       amount: item.amount ?? 0,
//     });

//     // ---------------------------------------------------
//     // General alignment
//     // ---------------------------------------------------

//     row.getCell(1).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     row.getCell(5).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     row.getCell(6).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     row.getCell(7).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     row.getCell(8).alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     row.getCell(11).alignment = {
//       horizontal: "right",
//       vertical: "middle",
//     };

//     // ---------------------------------------------------
//     // Project ID - same visual emphasis as JSX
//     // ---------------------------------------------------

//     row.getCell(2).font = {
//       bold: true,
//     };

//     // ---------------------------------------------------
//     // Amount
//     // Frontend uses USD currency formatting
//     // ---------------------------------------------------

//     row.getCell(11).font = {
//       bold: true,
//     };

//     row.getCell(11).numFmt = "$#,##0.00;($#,##0.00);-";

//     // ---------------------------------------------------
//     // Borders
//     // ---------------------------------------------------

//     row.eachCell((cell) => {
//       cell.border = {
//         bottom: {
//           style: "thin",
//           color: { argb: "FFE2E8F0" },
//         },
//       };
//     });
//   });

//   // =====================================================
//   // FREEZE HEADER
//   // =====================================================

//   ws.views = [
//     {
//       state: "frozen",
//       ySplit: 1,
//     },
//   ];

//   // =====================================================
//   // FILTER
//   // =====================================================

//   if (data.length > 0) {
//     ws.autoFilter = {
//       from: "A1",
//       to: `K${data.length + 1}`,
//     };
//   }

//   // =====================================================
//   // PAGE SETUP
//   // =====================================================

//   ws.pageSetup = {
//     orientation: "landscape",
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//   };
// };

// // ============================================================
// // Suppl O
// // ============================================================

// const getSupplOData = async (year) => {
//   const token =
//     localStorage.getItem("token") ||
//     JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   // SAME API AS JSX
//   const hdrResponse = await fetch(
//     `${backendUrl}/api/SupplOHdr?year=${year}`,
//     { headers }
//   );

//   const schedResponse = await fetch(
//     `${backendUrl}/api/ScheduleO?year=${year}`,
//     { headers }
//   );

//   const headersData = hdrResponse.ok
//     ? await hdrResponse.json()
//     : [];

//   const scheduleData = schedResponse.ok
//     ? await schedResponse.json()
//     : [];

//   const contracts = [];

//   // SAME CONTRACT/TAB LOGIC AS JSX
//   const seenContractKeys = new Set();

//   const supplList = Array.isArray(headersData)
//     ? headersData
//     : [];

//   const schedList = Array.isArray(scheduleData)
//     ? scheduleData
//     : [];

//   supplList.forEach((hdr) => {
//     const contractNo = (hdr.primeCntrNo || "").trim();

//     if (contractNo) {
//       seenContractKeys.add(contractNo.toLowerCase());
//     }

//     contracts.push({
//       header: hdr,
//       source: "SupplOHdr",
//     });
//   });

//   schedList.forEach((item) => {
//     const contractNo = (item.contractNo || "").trim();
//     const key = contractNo.toLowerCase();

//     if (key && seenContractKeys.has(key)) return;

//     if (key) {
//       seenContractKeys.add(key);
//     }

//     contracts.push({
//       header: item,
//       source: "ScheduleO",
//     });
//   });

//   // NOW FETCH DETAILS EXACTLY LIKE JSX
//   for (const contract of contracts) {
//     const hdr = contract.header;

//     const cntrName = (hdr.cntrName || "").trim();
//     const primeCntrNo = (
//       hdr.primeCntrNo ||
//       hdr.contractNo ||
//       ""
//     ).trim();

//     if (!cntrName && !primeCntrNo) {
//       contract.originalContract = null;
//       contract.modifications = [];
//       continue;
//     }

//     const params = new URLSearchParams();

//     if (cntrName) {
//       params.append("cntrName", cntrName);
//     }

//     if (primeCntrNo) {
//       params.append("primeCntrNo", primeCntrNo);
//     }

//     params.append("year", year);

//     const response = await fetch(
//       `${backendUrl}/api/SupplODetl?${params.toString()}`,
//       { headers }
//     );

//     const details = response.ok
//       ? await response.json()
//       : [];

//     const detls = Array.isArray(details)
//       ? details
//       : [];

//     // EXACT SAME JSX MAPPING
//     const origRec = detls.find(
//       (d) => d.modNo === 0
//     );

//     const originalContract = origRec
//       ? {
//           date: origRec.modDt || "",

//           changeInFunding:
//             origRec.fundChngAmt != null
//               ? String(origRec.fundChngAmt)
//               : "",

//           totalFunding:
//             origRec.totFundAmt != null
//               ? String(origRec.totFundAmt)
//               : "",

//           cost:
//             origRec.costAmt != null
//               ? String(origRec.costAmt)
//               : "",

//           profitFee:
//             origRec.profitFeeAmt != null
//               ? String(origRec.profitFeeAmt)
//               : "",

//           total:
//             origRec.totFundAmt != null
//               ? String(origRec.totFundAmt)
//               : "",
//         }
//       : null;

//     const modifications = detls
//       .filter((d) => d.modNo > 0)
//       .sort((a, b) => a.modNo - b.modNo)
//       .map((d) => ({
//         modificationNumber: String(d.modNo),

//         date: d.modDt || "",

//         changeInFunding:
//           d.fundChngAmt != null
//             ? String(d.fundChngAmt)
//             : "",

//         totalFunding:
//           d.totFundAmt != null
//             ? String(d.totFundAmt)
//             : "",

//         cost:
//           d.costAmt != null
//             ? String(d.costAmt)
//             : "",

//         profitFee:
//           d.profitFeeAmt != null
//             ? String(d.profitFeeAmt)
//             : "",

//         total:
//           d.totFundAmt != null
//             ? String(d.totFundAmt)
//             : "",
//       }));

//     contract.originalContract = originalContract;
//     contract.modifications = modifications;
//   }

//   return contracts;
// };
// const addSupplO = async (
//   workbook,
//   {
//     companyName = "",
//     companyAddress = "",
//     year = FISCAL_YEAR,
//   } = {}
// ) => {
//   const contracts = await getSupplOData(year);

//   const ws = workbook.addWorksheet("Suppl O");

//   // ------------------------------------------------------------
//   // COLUMN WIDTHS
//   // ------------------------------------------------------------
//   ws.columns = [
//     { width: 18 }, // A
//     { width: 16 }, // B
//     { width: 20 }, // C
//     { width: 18 }, // D
//     { width: 18 }, // E
//     { width: 18 }, // F
//     { width: 18 }, // G
//     { width: 18 }, // H
//     { width: 18 }, // I
//   ];

//   // ------------------------------------------------------------
//   // HEADER
//   // ------------------------------------------------------------

//   ws.mergeCells("A1:G1");
//   ws.getCell("A1").value =
//     "This Schedule does not contain any links to other schedules.";

//   ws.getCell("A1").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("A3").value = "ICE MANUAL";
//   ws.getCell("A3").font = {
//     name: "Arial",
//     size: 10,
//     color: { argb: "0000FF" },
//     underline: true,
//   };

//   ws.getCell("H1").value = "Suppl O";
//   ws.getCell("H1").font = {
//     name: "Times New Roman",
//     size: 11,
//     bold: true,
//   };

//   ws.getCell("H2").value = "ICE (version 2.0.1h)";
//   ws.getCell("H2").font = {
//     name: "Times New Roman",
//     size: 11,
//     bold: true,
//   };

//   // Company
//   ws.mergeCells("C5:F5");

//   ws.getCell("C5").value = companyName;

//   ws.getCell("C5").font = {
//     name: "Times New Roman",
//     size: 12,
//     bold: true,
//   };

//   ws.getCell("C5").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   ws.getCell("C5").border = {
//     bottom: {
//       style: "thin",
//       color: { argb: "000000" },
//     },
//   };

//   ws.mergeCells("C6:F6");

//   ws.getCell("C6").value = companyAddress;

//   ws.getCell("C6").font = {
//     name: "Times New Roman",
//     size: 11,
//   };

//   ws.getCell("C6").alignment = {
//     horizontal: "center",
//   };

//   // Title
//   ws.mergeCells("C8:F8");

//   ws.getCell("C8").value =
//     "Suppl O — CONTRACT MODIFICATIONS";

//   ws.getCell("C8").font = {
//     name: "Arial",
//     size: 12,
//     bold: true,
//   };

//   ws.getCell("C8").alignment = {
//     horizontal: "center",
//   };

//   ws.mergeCells("C9:F9");

//   ws.getCell("C9").value =
//     `Fiscal Year End - 12/31/${year}`;

//   ws.getCell("C9").font = {
//     name: "Arial",
//     size: 10,
//     bold: true,
//   };

//   ws.getCell("C9").alignment = {
//     horizontal: "center",
//   };

//   // ------------------------------------------------------------
//   // CONTRACTS
//   // ------------------------------------------------------------

//   let row = 11;

//   if (!contracts.length) {
//     ws.mergeCells(`A${row}:G${row}`);

//     ws.getCell(`A${row}`).value =
//       "No Suppl O data available from API.";

//     ws.getCell(`A${row}`).font = {
//       name: "Arial",
//       size: 10,
//       italic: true,
//     };

//     ws.getCell(`A${row}`).alignment = {
//       horizontal: "center",
//     };
//   }

//   contracts.forEach((contract, contractIndex) => {
//     const hdr = contract.header || {};
//     const original = contract.original;
//     const modifications = contract.modifications || [];

//     // ----------------------------------------------------------
//     // CONTRACT INFORMATION
//     // ----------------------------------------------------------

//     ws.mergeCells(`A${row}:G${row}`);

//     ws.getCell(`A${row}`).value =
//       `Contract ${contractIndex + 1}`;

//     ws.getCell(`A${row}`).font = {
//       name: "Arial",
//       size: 11,
//       bold: true,
//     };

//     ws.getCell(`A${row}`).fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFF500" },
//     };

//     row++;

//     ws.getCell(`A${row}`).value = "Contractor Name:";
//     ws.getCell(`B${row}`).value = hdr.cntrName || "";

//     ws.mergeCells(`B${row}:D${row}`);

//     ws.getCell(`E${row}`).value = "Contract Number:";
//     ws.getCell(`F${row}`).value =
//       hdr.primeCntrNo || "";

//     ws.mergeCells(`F${row}:G${row}`);

//     row++;

//     ws.getCell(`A${row}`).value = "Subcontract Number:";
//     ws.getCell(`B${row}`).value =
//       hdr.subcntrNo || "";

//     ws.mergeCells(`B${row}:D${row}`);

//     ws.getCell(`E${row}`).value = "Award Date:";
//     ws.getCell(`F${row}`).value =
//       hdr.awardDt || "";

//     ws.mergeCells(`F${row}:G${row}`);

//     row++;

//     ws.getCell(`A${row}`).value = "Contract Type:";
//     ws.getCell(`B${row}`).value =
//       hdr.cntrType || "";

//     ws.mergeCells(`B${row}:D${row}`);

//     ws.getCell(`E${row}`).value = "Contract Job No.:";
//     ws.getCell(`F${row}`).value =
//       hdr.cntrJobNo ?? "";

//     ws.mergeCells(`F${row}:G${row}`);

//     row++;

//     ws.getCell(`A${row}`).value =
//       "Period of Performance:";
//     ws.getCell(`B${row}`).value =
//       hdr.popStartDt || "";

//     ws.getCell(`C${row}`).value = "TO";

//     ws.getCell(`D${row}`).value =
//       hdr.popEndDt || "";

//     ws.getCell(`E${row}`).value =
//       "Total Modifications:";

//     ws.getCell(`F${row}`).value =
//       hdr.totModNo ?? "";

//     ws.mergeCells(`F${row}:G${row}`);

//     row += 2;

//     // ----------------------------------------------------------
//     // MODIFICATION TABLE
//     // ----------------------------------------------------------

//     ws.mergeCells(`A${row}:G${row}`);

//     ws.getCell(`A${row}`).value =
//       "Summary of Contract Modifications";

//     ws.getCell(`A${row}`).font = {
//       name: "Arial",
//       size: 11,
//       bold: true,
//     };

//     ws.getCell(`A${row}`).alignment = {
//       horizontal: "center",
//     };

//     ws.getCell(`A${row}`).border = {
//       bottom: {
//         style: "thin",
//         color: { argb: "000000" },
//       },
//     };

//     row++;

//     const headerRow = row;

//     const tableHeaders = [
//       "Modification",
//       "Date",
//       "Change in Funding",
//       "Total Funding",
//       "Cost",
//       "Profit / Fee",
//       "Total",
//     ];

//     tableHeaders.forEach((header, index) => {
//       const cell = ws.getCell(
//         headerRow,
//         index + 1
//       );

//       cell.value = header;

//       cell.font = {
//         name: "Arial",
//         size: 10,
//         bold: true,
//       };

//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "E8F5FA" },
//       };

//       cell.alignment = {
//         horizontal: "center",
//         vertical: "middle",
//         wrapText: true,
//       };

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     row++;

//     // ----------------------------------------------------------
//     // ORIGINAL CONTRACT
//     // ----------------------------------------------------------

//     const originalValues = [
//       "Original Contract",
//       original?.modDt || "",
//       original?.fundChngAmt ?? "",
//       original?.totFundAmt ?? "",
//       original?.costAmt ?? "",
//       original?.profitFeeAmt ?? "",
//       original?.totFundAmt ?? "",
//     ];

//     originalValues.forEach((value, index) => {
//       const cell = ws.getCell(
//         row,
//         index + 1
//       );

//       cell.value = value;

//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };

//       cell.alignment = {
//         vertical: "middle",
//         horizontal:
//           index === 0 ? "left" : "right",
//       };

//       if (index >= 2 && index <= 6) {
//         cell.numFmt = '$#,##0.00;($#,##0.00);-';
//       }
//     });

//     row++;

//     // ----------------------------------------------------------
//     // MODIFICATIONS FROM API
//     // ----------------------------------------------------------

//     modifications.forEach((mod) => {
//       const values = [
//         mod.modNo ?? "",
//         mod.modDt || "",
//         mod.fundChngAmt ?? "",
//         mod.totFundAmt ?? "",
//         mod.costAmt ?? "",
//         mod.profitFeeAmt ?? "",
//         mod.totFundAmt ?? "",
//       ];

//       values.forEach((value, index) => {
//         const cell = ws.getCell(
//           row,
//           index + 1
//         );

//         cell.value = value;

//         cell.border = {
//           top: { style: "thin" },
//           bottom: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//         };

//         cell.alignment = {
//           vertical: "middle",
//           horizontal:
//             index === 0 ? "center" : "right",
//         };

//         if (index >= 2 && index <= 6) {
//           cell.numFmt =
//             '$#,##0.00;($#,##0.00);-';
//         }
//       });

//       row++;
//     });

//     row += 2;
//   });

//   // ------------------------------------------------------------
//   // GENERAL FORMATTING
//   // ------------------------------------------------------------

//   ws.eachRow((excelRow) => {
//     excelRow.height = 20;

//     excelRow.eachCell((cell) => {
//       cell.font = cell.font || {
//         name: "Arial",
//         size: 10,
//       };

//       cell.alignment = {
//         ...(cell.alignment || {}),
//         vertical: "middle",
//       };
//     });
//   });

//   ws.freezePanes = {
//     ySplit: 10,
//   };

//   ws.pageSetup = {
//     orientation: "landscape",
//     paperSize: 9,
//     fitToPage: true,
//     fitToWidth: 1,
//     fitToHeight: 0,
//     horizontalCentered: true,
//   };

//   ws.pageMargins = {
//     left: 0.25,
//     right: 0.25,
//     top: 0.5,
//     bottom: 0.5,
//     header: 0.2,
//     footer: 0.2,
//   };

//   return ws;
// };

// // =========================================================
// // MAIN EXPORT
// // =========================================================

// // =========================================================
// // MAIN EXPORT
// // =========================================================

// export const exportSchedulesToExcel = async ({
//   companyName = EXPORT_COMPANY_NAME,
//   companyAddress = EXPORT_COMPANY_ADDRESS,
// } = {}) => {
//   try {
//     companyName = EXPORT_COMPANY_NAME;
//     companyAddress = EXPORT_COMPANY_ADDRESS;
//     const workbook = new ExcelJS.Workbook();
//     workbook.calcProperties = { fullCalcOnLoad: true, forceFullCalc: true };

//     workbook.creator = "Finaxis";
//     workbook.lastModifiedBy = "Finaxis";
//     workbook.created = new Date();
//     workbook.modified = new Date();

//     // =====================================================
//     // SCHEDULE A
//     // =====================================================

//     await addScheduleA(workbook, {
//       companyName,
//       companyAddress,
//     });

//     // =====================================================
//     // SCHEDULE B
//     // =====================================================

//     await addScheduleB(workbook, {
//       companyName,
//       companyAddress,
//     });

//     // =====================================================
//     // SCHEDULE C (1)
//     // =====================================================

//     await addCSchedule(workbook, {
//   sheetName: "Schedule C (1)",
//   scheduleName: "SCHEDULE C (1)",
//   sectionTitle: "Customer Site Overhead",
//   companyName,
//   companyAddress,
//   getData: getScheduleC1Data,
//   includeCalifornia: true,
//   includeFringe: true,
// });

//     // =====================================================
//     // SCHEDULE C (2)
//     // =====================================================

//     await addCSchedule(workbook, {
//       sheetName: "SCHEDULE C (2)",
//       scheduleName: "SCHEDULE C (2)",
//       sectionTitle: "Columbus Site Overhead",
//       companyName,
//       companyAddress,
//       getData: getScheduleC2Data,
//       includeCalifornia: true,
//       includeFringe: false,
//     });

//     // =====================================================
//     // SCHEDULE C (6)
//     // =====================================================

//     await addCSchedule(workbook, {
//       sheetName: "SCHEDULE C (6)",
//       scheduleName: "SCHEDULE C (6)",
//       sectionTitle: "Subk & Material Handling",
//       companyName,
//       companyAddress,
//       getData: getScheduleC6Data,
//       includeCalifornia: false,
//       includeFringe: true,
//     });

//     // =====================================================
//     // SCHEDULE D (1)
//     // =====================================================

//     await addScheduleD1(workbook, {
//       sheetName: "SCHEDULE D (1)",
//       scheduleName: "SCHEDULE D (1)",
//       sectionTitle: "AERO Fringe",
//       companyName,
//       companyAddress,
//       getData: getScheduleD1Data,
//       includeCalifornia: false,
//       includeFringe: true,
//     });

//     //Schedule D (2)

//     // await addScheduleD2(workbook, {
//     //   sheetName: "SCHEDULE D (2)",
//     //   scheduleName: "SCHEDULE D (2)",
//     //   sectionTitle: "California Intermediate Ind. Pool",
//     //   companyName,
//     //   companyAddress,
//     //   getData: getScheduleD2Data,
//     // });

//     await addScheduleE(workbook, {
//       companyName,
//       companyAddress,
//     });

//     await addFringe(workbook, {
//       year: FISCAL_YEAR,
//       companyName,
//       companyAddress,
//     });

//     await addScheduleG(workbook, {
//       companyName,
//       companyAddress,
//     });

//     await addScheduleG1(workbook, {
//       companyName,
//       companyAddress,
//     });

//     await addSummaryScheduleH(workbook, {
//   companyName,
//   companyAddress
// });

//     await addScheduleH(workbook,companyName, companyAddress, 2025);

//     await addScheduleH1(workbook, {
//   companyName,
//   companyAddress
// });

//     await addScheduleJ(workbook, {
//       companyName,
//       companyAddress,
//       fiscalYearEnd: `${2025}-12-31`,
//     });

//     await addScheduleI(workbook, {
//       companyName,
//       companyAddress,
//       year: FISCAL_YEAR,
//     });

//     await addScheduleK(workbook, {
//       companyName,
//       companyAddress,
//       year: 2025,
//     });

//     await addScheduleL(workbook, 2025); // some error

//     await addScheduleM(workbook, {
//       year: FISCAL_YEAR,
//       companyName,
//       companyAddress,
//     });

//     await addScheduleMFPRA(workbook);

//     await addScheduleN(workbook, {
//       year: FISCAL_YEAR,
//       companyName,
//     });

//     await addScheduleO(workbook, {
//       companyName,
//       companyAddress});

//     await addSupplA1(workbook, companyName, companyAddress);

//     await addSupplA2(workbook, companyName, companyAddress);

//     await addSupplA3(workbook, companyName, companyAddress);

//     await addSupplA4(workbook, companyName, companyAddress);

//     // await addSupplB(workbook, companyName, companyAddress, 2025); //404 api not found

//     await addSupplC(workbook, 2025);

//     //SUPPLY O
//     await addSupplO(workbook, {
//   companyName,
//   companyAddress
// });

//     await addTrialBalance(workbook);

//     await addJobCostLedger(workbook);

//     addInternalScheduleLinks(workbook);
//     applyWholeNumberFormats(workbook);

//     // =====================================================
//     // DOWNLOAD
//     // =====================================================

//     const buffer = await workbook.xlsx.writeBuffer();

//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     const url = window.URL.createObjectURL(blob);

//     const anchor = document.createElement("a");

//     anchor.href = url;

//     anchor.download = `ICE_Submission_${FISCAL_YEAR}.xlsx`;

//     document.body.appendChild(anchor);

//     anchor.click();

//     document.body.removeChild(anchor);

//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Failed to export schedules:", error);

//     throw error;
//   }
// };

// src/utils/scheduleExcelExport.js

import ExcelJS from "exceljs";
import { backendUrl } from "../components/config";
import signature from "../assets/signature.png";

const FISCAL_YEAR = 2025;
const FISCAL_YEAR_END = "12/31/2025";

const YELLOW = "FFFF00";
const CYAN = "00FFFF";
const BLUE = "1F4E78";
const WHITE = "FFFFFF";
const BLACK = "000000";
const GREY = "A8A8A8";
const GREY_TEXT = "808080";

const COMPANY_NAME =
  import.meta.env?.VITE_COMPANY_NAME ||
  import.meta.env?.VITE_COMPANY_NAME ||
  "Revolve FinTech LLC";
const COMPANY_ADDRESS =
  import.meta.env?.VITE_COMPANY_ADDRESS ||
  import.meta.env?.VITE_COMPANY_ADDRESS ||
  "Vienna, VA 22182";

const INT_FMT = "#,##0;(#,##0);-";
const PCT_FMT = "0.00%";

const SHEET_LINK_MAP = {
  "Sched A": "SCHEDULE A",
  "SCHED A": "SCHEDULE A",
  "Sched B": "SCHEDULE B",
  "SCHED B": "SCHEDULE B",
  "Sched C (1)": "Schedule C (1)",
  "Sched C (2)": "SCHEDULE C (2)",
  "Sched C (6)": "SCHEDULE C (6)",
  "Sched D (1)": "SCHEDULE D (1)",
  "Sched D (2)": "SCHEDULE D (2)",
  "Sched E": "SCHEDULE E",
  "SCHED E": "SCHEDULE E",
  Fringe: "Fringe",
  "Sched G": "SCHEDULE G",
  "SCHED G": "SCHEDULE G",
  "Sched G-1": "SCHEDULE G-1",
  "Sched H": "Schedule H",
  "SCHED H": "Schedule H",
  "Sched H-1": "Schedule H-1",
  "Summary Sched H": "Summary Schedule H",
  "SUM SCHED H": "Summary Schedule H",
  "Sched I": "Schedule I",
  "SCHED I": "Schedule I",
  "Sched J": "Schedule J",
  "Sched K": "SCHEDULE K",
  "SCHED K": "SCHEDULE K",
  "Sched L": "Schedule L",
  "Sched M": "Schedule M",
  "Sched N": "Schedule N",
  "Sched O": "Schedule O",
};

const linkToSheet = (cell, label, targetSheetName) => {
  const sheetName = targetSheetName || SHEET_LINK_MAP[label];

  if (sheetName) {
    cell.value = {
      text: label,
      hyperlink: `#'${sheetName.replace(/'/g, "''")}'!A1`,
      tooltip: `Go to ${sheetName}`,
    };
  } else {
    cell.value = label;
  }

  cell.font = {
    name: "Arial",
    size: 9,
    bold: true,
    underline: true,
    color: { argb: "FFFFFFFF" },
  };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1717B9" },
  };
  cell.alignment = { horizontal: "center", vertical: "middle" };
};

const styleAsPlainLinkText = (cell, label) => {
  cell.value = label;
  cell.font = {
    name: "Arial",
    size: 9,
    underline: true,
    color: { argb: "FF0563C1" },
  };
};

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

const formatDateToString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const safeMerge = (ws, range) => {
  try {
    console.log("Merging:", range);
    ws.mergeCells(range);
  } catch (error) {
    console.error("FAILED MERGE:", range);
    console.error(error);
    throw error;
  }
};

const numberValue = (value) => {
  if (value === null || value === undefined || value === "" || value === "-") {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/[()]/g, (m) => (m === "(" ? "-" : ""));

  const result = Number(cleaned);

  return Number.isNaN(result) ? 0 : result;
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "0.00%";
  }

  return `${Number(value).toFixed(2)}%`;
};

const setCell = (
  cell,
  value,
  {
    bold = false,
    underline = false,
    align = "left",
    fill = null,
    fontSize = 10,
    italic = false,
    color = BLACK,
  } = {},
) => {
  cell.value = value;

  cell.font = {
    name: "Arial",
    size: fontSize,
    bold,
    italic,
    underline: underline ? "single" : undefined,
    color: { argb: color },
  };

  cell.alignment = {
    horizontal: align,
    vertical: "middle",
    wrapText: true,
  };

  if (fill) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fill },
    };
  }
};

const applyBottomBorder = (row, start = 1, end = row.cellCount) => {
  for (let i = start; i <= end; i++) {
    row.getCell(i).border = {
      bottom: {
        style: "thin",
        color: { argb: BLACK },
      },
    };
  }
};

const setupWorksheet = (worksheet) => {
  worksheet.views = [
    {
      showGridLines: false,
    },
  ];

  worksheet.properties.defaultRowHeight = 18;

  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: worksheet.PAPERSIZE_LETTER,
  };

  worksheet.pageMargins = {
    left: 0.25,
    right: 0.25,
    top: 0.4,
    bottom: 0.4,
    header: 0.2,
    footer: 0.2,
  };
};

// ---------------------------------------------------------
// Common Schedule Header
// ---------------------------------------------------------

const addCompanyHeader = (
  worksheet,
  { companyName, companyAddress, scheduleName, title },
) => {
  worksheet.mergeCells("B2:F2");
  worksheet.mergeCells("B3:F3");

  setCell(
    worksheet.getCell("B2"),
    companyName ||
      import.meta.env?.VITE_COMPANY_NAME ||
      import.meta.env?.VITE_COMPANY_NAME ||
      "Revolve FinTech LLC",
    {
      bold: true,
      align: "center",
      fill: YELLOW,
      fontSize: 11,
    },
  );

  setCell(
    worksheet.getCell("B3"),
    companyAddress ||
      import.meta.env?.VITE_COMPANY_ADDRESS ||
      import.meta.env?.VITE_COMPANY_ADDRESS ||
      "Vienna, VA 22182",
    {
      bold: true,
      align: "center",
      fill: YELLOW,
      fontSize: 11,
    },
  );

  worksheet.mergeCells("H2:J2");
  worksheet.mergeCells("H3:J3");

  setCell(worksheet.getCell("H2"), scheduleName, {
    bold: true,
    align: "right",
    fontSize: 12,
  });

  setCell(worksheet.getCell("H3"), "ICE (version 2.0.1h)", {
    bold: true,
    align: "right",
    fontSize: 10,
  });

  if (title) {
    worksheet.mergeCells("B5:F5");

    setCell(worksheet.getCell("B5"), title, {
      bold: true,
      italic: true,
      align: "center",
      fontSize: 11,
    });
  }

  worksheet.getRow(2).height = 20;
  worksheet.getRow(3).height = 20;
};

// ---------------------------------------------------------
// API
// ---------------------------------------------------------

const getJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${url}`);
  }

  return response.json();
};

// =============================================================
// ICE SETUP SHEET
//
// Unlike the other schedules, IceSetup.jsx has no useEffect/fetch at
// all — every checkbox, radio selection, and table value is static
// JSX, parameterized only by companyName/companyAddress. So there's
// just one function here, no getXData() counterpart.
// =============================================================

const addIceSetup = async (
  workbook,
  { companyName = "", companyAddress = "", sheetName = "Setup" } = {},
) => {
  const ws = workbook.addWorksheet(sheetName);

  ws.views = [{ showGridLines: false }];

  // ===========================================================
  // COLORS — matches the literal Tailwind arbitrary colors in the JSX
  // ===========================================================
  const PAGE_BLUE = "80B0FF";
  const GREY_LABEL = "D9D9D9";
  const YELLOW_BOX = "FFFFCC";
  const HEADER_GREY = "A6A6A6";
  const BANNER_BLUE = "1D4ED8"; // Tailwind blue-700
  const CYAN_BOX = "E6FFFF";
  const DARK_GREY = "808080";
  const MAROON = "800000";
  const WARN_TEXT = "FDE68A"; // text-yellow-300
  const WHITE = "FFFFFF";
  const BLACK = "000000";
  const PURPLE_HEADING = "581C87"; // text-purple-900
  const LINK_BLUE = "1E3A8A"; // text-blue-900

  // ⚠️ ASSUMPTION — sheet names for the real navigation links on the
  // right must match whatever workbook.addWorksheet("...") used for
  // those tabs. "Fringe" is copied verbatim from addFringe()'s own
  // default sheetName param (mixed case, not "FRINGE") to stay
  // consistent with that file.
  const NAV_SHEET_NAMES = {
    sched_b: "SCHEDULE B",
    sched_c1: "SCHEDULE C (1)",
    sched_c2: "SCHEDULE C (2)",
    sched_c6: "SCHEDULE C (6)",
    sched_fringe: "Fringe",
    sched_d1: "SCHEDULE D (1)",
    sched_d2: "SCHEDULE D (2)",
  };

  const thin = { style: "thin", color: { argb: BLACK } };
  const boxBorder = { top: thin, bottom: thin, left: thin, right: thin };

  const setFont = (
    cell,
    {
      bold = false,
      italic = false,
      underline = false,
      size = 9,
      color = BLACK,
    } = {},
  ) => {
    cell.font = {
      name: "Arial",
      size,
      bold,
      italic,
      underline,
      color: { argb: color },
    };
  };

  const setFill = (cell, argb) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
  };

  const setWrap = (cell, horizontal = "left") => {
    cell.alignment = { horizontal, vertical: "top", wrapText: true };
  };

  // A real internal hyperlink — used only for the right-column
  // schedule nav links, since those are the only elements in the
  // JSX with an actual onClick/onNavigate handler. Everything else
  // (ICE Manual, Cost of Money note, both Run Setup buttons) has no
  // handler in the source and is styled as plain/inert text to match.
  const setNavLink = (cell, label, targetTab) => {
    const sheetName = NAV_SHEET_NAMES[targetTab];
    cell.value = sheetName
      ? {
          text: label,
          hyperlink: `#'${sheetName}'!A1`,
          tooltip: `Go to ${sheetName}`,
        }
      : label;
    setFont(cell, { bold: true, underline: true, size: 9, color: LINK_BLUE });
    setWrap(cell, "left");
  };

  // ===========================================================
  // PAGE BACKGROUND — approximates the bg-[#80b0ff] page wash. Done
  // first so every more specific fill below paints over it.
  // ===========================================================
  for (let r = 1; r <= 42; r++) {
    for (let c = 1; c <= 20; c++) {
      setFill(ws.getCell(r, c), PAGE_BLUE);
    }
  }

  let row = 1;

  // ===========================================================
  // GENERAL INFORMATION
  // ===========================================================
  setFont(ws.getCell(row, 2), {
    bold: true,
    italic: true,
    size: 11,
    color: PURPLE_HEADING,
  });
  ws.getCell(row, 2).value = "General Information:";
  row++;

  const generalInfo = [
    ["Company Name:", companyName],
    ["Company Location:", companyAddress],
    ["Fiscal Year End Date:", "12/31/25"],
  ];

  generalInfo.forEach(([label, value]) => {
    const labelCell = ws.getCell(row, 2);
    labelCell.value = label;
    setFill(labelCell, GREY_LABEL);
    setFont(labelCell, { bold: true, italic: true });
    labelCell.border = boxBorder;

    ws.mergeCells(row, 3, row, 5);
    const valueCell = ws.getCell(row, 3);
    valueCell.value = value;
    setFill(valueCell, WHITE);
    setFont(valueCell, { bold: true });
    valueCell.border = boxBorder;

    row++;
  });

  row += 1;

  // ===========================================================
  // ACCOUNTING PRACTICES (checkboxes)
  // ===========================================================
  setFont(ws.getCell(row, 2), {
    bold: true,
    italic: true,
    size: 11,
    color: PURPLE_HEADING,
  });
  ws.getCell(row, 2).value = "Accounting Practices (Check all that apply):";
  row++;

  const accountingPractices = [
    ["Value-added G&A base is used instead of Total Cost Input", true],
    ["Final indirect pool costs are accumulated by Department", false],
    [
      "There is a final indirect pool with Material/Subcontracts costs as an allocation base",
      true,
    ],
    ["There is a separate pool to allocate fringe costs", true],
  ];

  const accountingBoxTop = row;
  accountingPractices.forEach(([label, checked]) => {
    ws.mergeCells(row, 2, row, 9);
    const cell = ws.getCell(row, 2);
    cell.value = `${checked ? "\u2611" : "\u2610"}  ${label}`;
    setFont(cell, { bold: true });
    setFill(cell, YELLOW_BOX);
    setWrap(cell, "left");
    row++;
  });
  for (let r = accountingBoxTop; r < row; r++) {
    ws.getCell(r, 2).border = boxBorder;
    ws.getCell(r, 9).border = boxBorder;
  }

  row += 1;

  // ===========================================================
  // SELECT NUMBER OF POOLS/RATES
  // ===========================================================
  setFont(ws.getCell(row, 2), {
    bold: true,
    italic: true,
    size: 11,
    color: PURPLE_HEADING,
  });
  ws.getCell(row, 2).value = "Select the number of pools/rates:";
  row++;

  const poolCounts = [
    ["2", "Number of Indirect Pools with labor dollars as an allocation base"],
    ["2", "Number of Intermediate Pools"],
    ["0", "Number of Cost of Money rates"],
  ];

  poolCounts.forEach(([count, label]) => {
    const countCell = ws.getCell(row, 2);
    countCell.value = count;
    setFill(countCell, YELLOW_BOX);
    setFont(countCell, { bold: true });
    countCell.alignment = { horizontal: "center", vertical: "middle" };
    countCell.border = boxBorder;

    ws.mergeCells(row, 3, row, 9);
    const labelCell = ws.getCell(row, 3);
    labelCell.value = label;
    setFill(labelCell, WHITE);
    setFont(labelCell, { bold: true });
    setWrap(labelCell, "left");
    labelCell.border = boxBorder;

    row++;
  });

  row += 1;

  // ===========================================================
  // POOL INFORMATION GRID
  //
  // Columns: B:C = Category Used?, D:G = Pool Name, H:I = Short Name
  // ===========================================================
  setFont(ws.getCell(row, 2), {
    bold: true,
    italic: true,
    size: 11,
    color: PURPLE_HEADING,
  });
  ws.getCell(row, 2).value = "Pool Information:";
  row++;

  const gridTop = row;

  ws.mergeCells(row, 2, row, 3);
  setCellGrid(
    ws.getCell(row, 2),
    "Category Used?",
    HEADER_GREY,
    true,
    "center",
  );
  ws.mergeCells(row, 4, row, 7);
  setCellGrid(
    ws.getCell(row, 4),
    "Pool Name (if category is used provide a descriptive name for this category, i.e. Engineering Pool)",
    HEADER_GREY,
    true,
    "center",
  );
  ws.mergeCells(row, 8, row, 9);
  setCellGrid(
    ws.getCell(row, 8),
    "Short Name (up to 10 characters)",
    HEADER_GREY,
    true,
    "center",
  );
  row++;

  const banner = (text) => {
    ws.mergeCells(row, 2, row, 9);
    const cell = ws.getCell(row, 2);
    cell.value = text;
    setFill(cell, BANNER_BLUE);
    setFont(cell, { bold: true, color: WHITE });
    cell.border = boxBorder;
    row++;
  };

  const poolRow = (poolName, shortName) => {
    ws.mergeCells(row, 2, row, 3);
    setCellGrid(ws.getCell(row, 2), "Yes", YELLOW_BOX, true, "center", true);

    ws.mergeCells(row, 4, row, 7);
    setCellGrid(ws.getCell(row, 4), poolName, WHITE, false, "left");

    ws.mergeCells(row, 8, row, 9);
    setCellGrid(ws.getCell(row, 8), shortName, WHITE, false, "left");

    row++;
  };

  banner("Primary Indirect Pools:");
  poolRow("General and Administrative (G&A) Expenses", "G&A");
  poolRow("Customer Site Overhead", "OH - Onsite");
  poolRow("Columbus Site Overhead", "OH - Offsite");
  poolRow("Subk & Material Handling", "SM&H");

  // Base Includes sub-row (radio options)
  ws.mergeCells(row, 2, row, 3);
  setCellGrid(ws.getCell(row, 2), "Base Includes:", WHITE, true, "right");
  ws.mergeCells(row, 4, row, 9);
  const baseIncludesCell = ws.getCell(row, 4);
  baseIncludesCell.value =
    "\u25CB only Material     \u25CB only Subcontracts     \u25CF both Material & Subcontracts";
  setFill(baseIncludesCell, CYAN_BOX);
  setFont(baseIncludesCell, { bold: true });
  setWrap(baseIncludesCell, "left");
  baseIncludesCell.border = boxBorder;
  row++;

  banner("Fringe:");
  poolRow("Fringe Pool", "Fringe");

  // Fringe options sub-row
  ws.mergeCells(row, 2, row, 3);
  setCellGrid(ws.getCell(row, 2), "", DARK_GREY, false, "left");
  ws.mergeCells(row, 4, row, 9);
  const fringeOptsCell = ws.getCell(row, 4);
  fringeOptsCell.value =
    "\u25CB Fringe is only an intermediate allocation\n\u25CF Fringe is applied as a final rate\n\u2611 Include direct labor fringe in the overhead base?";
  setFill(fringeOptsCell, CYAN_BOX);
  setFont(fringeOptsCell, { bold: true });
  setWrap(fringeOptsCell, "left");
  fringeOptsCell.border = boxBorder;
  ws.getRow(row).height = 45;
  row++;

  banner("Intermediate Pools (Pro-rates):");
  poolRow("AERO Fringe", "AERO Fringe");
  poolRow("California Intermediate", "California - Interm");

  const gridBottom = row - 1;
  for (let r = gridTop; r <= gridBottom; r++) {
    for (let c = 2; c <= 9; c++) {
      if (!ws.getCell(r, c).border) ws.getCell(r, c).border = boxBorder;
    }
  }

  row += 1;

  // ===========================================================
  // BOTTOM WARNING CARD (also duplicated at the top of the right
  // column, matching the JSX rendering it twice)
  // ===========================================================
  const warningCard = (atRow) => {
    ws.mergeCells(atRow, 2, atRow, 7);
    const cell = ws.getCell(atRow, 2);
    cell.value =
      "This Setup information will be used to customize the ICE model to reflect your organization. " +
      "After completing all General and Pool Information, click this button to complete the customization:";
    setFill(cell, MAROON);
    setFont(cell, { bold: true, color: WARN_TEXT, size: 9 });
    setWrap(cell, "left");
    ws.getRow(atRow).height = 45;
    for (let c = 2; c <= 7; c++) ws.getCell(atRow, c).border = boxBorder;

    const btnRow = atRow + 1;
    ws.mergeCells(btnRow, 6, btnRow, 7);
    const btn = ws.getCell(btnRow, 6);
    btn.value = "Run Setup";
    setFill(btn, "E5E7EB");
    setFont(btn, { bold: true, color: LINK_BLUE });
    btn.alignment = { horizontal: "center", vertical: "middle" };
    btn.border = boxBorder;
    setFill(ws.getCell(btnRow, 2), MAROON);
    return btnRow;
  };

  row = warningCard(row) + 2;

  // ===========================================================
  // RIGHT COLUMN — ICE Manual link, duplicate warning card, Cost of
  // Money note, and the 7 real schedule navigation links (columns
  // K onward, independent of the left column's row count).
  // ===========================================================
  let rRow = 1;

  const iceManualCell = ws.getCell(rRow, 11);
  iceManualCell.value = "ICE Manual";
  setFont(iceManualCell, {
    bold: true,
    underline: true,
    size: 11,
    color: LINK_BLUE,
  });
  rRow += 2;

  rRow =
    warningCard2(
      ws,
      rRow,
      MAROON,
      WARN_TEXT,
      WHITE,
      LINK_BLUE,
      boxBorder,
      setFill,
      setFont,
      setWrap,
    ) + 2;

  ws.mergeCells(rRow, 11, rRow, 14);
  const costOfMoneyCell = ws.getCell(rRow, 11);
  costOfMoneyCell.value =
    "Please see Note in ICE Manual under Cost of Money - Sched F";
  setFont(costOfMoneyCell, {
    bold: true,
    underline: true,
    size: 9,
    color: LINK_BLUE,
  });
  setWrap(costOfMoneyCell, "left");
  rRow += 3;

  const navLinks = [
    ["Enter detailed Pool costs on Sched B", "sched_b"],
    ["Enter detailed Pool costs on Sched C (1)", "sched_c1"],
    ["Enter detailed Pool costs on Sched C (2)", "sched_c2"],
    ["Enter detailed Pool costs on Sched C (6)", "sched_c6"],
    ["Enter detailed Pool costs on Fringe Worksheet", "sched_fringe"],
    ["Enter detailed Pool costs on Sched D (1)", "sched_d1"],
    ["Enter detailed Pool costs on Sched D (2)", "sched_d2"],
  ];

  navLinks.forEach(([label, target], idx) => {
    ws.mergeCells(rRow, 11, rRow, 14);
    setNavLink(ws.getCell(rRow, 11), label, target);
    // Extra gap before Sched D (1), matching the JSX's "pt-4" spacer
    rRow += idx === 3 ? 2 : 1;
  });

  // ===========================================================
  // COLUMN WIDTHS
  // ===========================================================
  ws.columns = [
    { width: 3 }, // A gutter
    { width: 16 }, // B
    { width: 14 }, // C
    { width: 14 }, // D
    { width: 14 }, // E
    { width: 14 }, // F
    { width: 14 }, // G
    { width: 12 }, // H
    { width: 12 }, // I
    { width: 3 }, // J gutter
    { width: 40 }, // K
    { width: 14 }, // L
    { width: 14 }, // M
    { width: 14 }, // N
  ];

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
  };

  return ws;

  // -----------------------------------------------------------
  // Local helper for pool-grid cells (kept as a plain function
  // declaration so it's hoisted and usable above where it's called)
  // -----------------------------------------------------------
  function setCellGrid(cell, text, fillColor, bold, align, italic = false) {
    cell.value = text;
    setFill(cell, fillColor);
    setFont(cell, { bold, italic, size: 9 });
    cell.alignment = { horizontal: align, vertical: "middle", wrapText: true };
  }

  // Second copy of the warning-card renderer, scoped for the right
  // column's absolute column offsets (K:N instead of B:G).
  function warningCard2(
    sheet,
    atRow,
    maroon,
    warnText,
    white,
    linkBlue,
    border,
    fill,
    font,
    wrap,
  ) {
    sheet.mergeCells(atRow, 11, atRow, 14);
    const cell = sheet.getCell(atRow, 11);
    cell.value =
      "This Setup information will be used to customize the ICE model to reflect your organization. " +
      "After completing all General and Pool Information, click this button to complete the customization:";
    fill(cell, maroon);
    font(cell, { bold: true, color: warnText, size: 9 });
    wrap(cell, "left");
    sheet.getRow(atRow).height = 45;
    for (let c = 11; c <= 14; c++) sheet.getCell(atRow, c).border = border;

    const btnRow = atRow + 1;
    sheet.mergeCells(btnRow, 13, btnRow, 14);
    const btn = sheet.getCell(btnRow, 13);
    btn.value = "Run Setup";
    fill(btn, "E5E7EB");
    font(btn, { bold: true, color: linkBlue });
    btn.alignment = { horizontal: "center", vertical: "middle" };
    btn.border = border;
    fill(sheet.getCell(btnRow, 11), maroon);
    return btnRow;
  }
};

// =========================================================
// SCHEDULE A
// =========================================================

const getScheduleAData = async () => {
  const data = await getJson(
    `${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=${FISCAL_YEAR}`,
  );

  const apiSchedules = data.schedules || [];

  // Mirrors SECTION_METADATA in the JSX exactly, including the second
  // reference badge (reference2 / targetTab2) that the previous export
  // function was missing.
  const metadata = [
    {
      apiKey: "Customer Site Overhead",
      title: "Customer Site Overhead",
      rateLabel: "OH RATE",
      reference: "SCHED C (1)",
      targetTab: "sched_c1",
      reference2: "SCHEDULE E",
      targetTab2: "sched_e",
    },
    {
      apiKey: "Off - Site Overhead",
      title: "Off - Site Overhead",
      rateLabel: "OH RATE",
      reference: "SCHED C (2)",
      targetTab: "sched_c2",
      reference2: "SCHEDULE E",
      targetTab2: "sched_e",
    },
    {
      apiKey: "Subk & Material Handling",
      title: "Subk & Material Handling",
      rateLabel: "OH RATE",
      reference: "SCHED C (6)",
      targetTab: "sched_c6",
      reference2: "SCHEDULE E",
      targetTab2: "sched_e",
    },
    {
      apiKey: "General and Administrative (G&A) Expenses",
      title: "General and Administrative (G&A) Expenses",
      rateLabel: "G&A RATE",
      reference: "SCHED B",
      targetTab: "sched_b",
      reference2: "SCHEDULE E",
      targetTab2: "sched_e",
    },
    {
      apiKey: "Fringe Pool",
      title: "Fringe Pool",
      rateLabel: "FRINGE RATE",
      reference: "FRINGE",
      targetTab: "sched_fringe",
    },
    {
      apiKey: "AERO Fringe",
      title: "AERO Fringe",
      rateLabel: "AERO FRINGE RATE",
      reference: "SCHED D (1)",
      targetTab: "sched_d1",
    },
    {
      apiKey: "California Intermediate",
      title: "California Intermediate",
      rateLabel: "RATE",
      reference: "SCHED D (2)",
      targetTab: "sched_d2",
    },
  ];

  return metadata.map((meta) => {
    const item = apiSchedules.find(
      (x) => x.name?.toLowerCase() === meta.apiKey.toLowerCase(),
    );

    return {
      ...meta,
      pool: item?.pool ?? 0,
      base: item?.base ?? 0,
      rate: item?.rate ?? 0,
    };
  });
};

const addScheduleA = async (workbook, { companyName, companyAddress }) => {
  // ⚠️ ASSUMPTION — adjust to match the exact sheet names you pass into
  // workbook.addWorksheet(...) for each schedule. Internal hyperlinks in
  // ExcelJS resolve by sheet name, so these strings must exactly match
  // (case + spacing) whatever addWorksheet("...") uses for those tabs.
  const TAB_TO_SHEET_NAME = {
    sched_c1: "SCHEDULE C (1)",
    sched_c2: "SCHEDULE C (2)",
    sched_c6: "SCHEDULE C (6)",
    sched_b: "SCHEDULE B",
    sched_e: "SCHEDULE E",
    sched_fringe: "FRINGE",
    sched_d1: "SCHEDULE D (1)",
    sched_d2: "SCHEDULE D (2)",
  };

  // Turns a cell that already has text/style applied into a real internal
  // hyperlink (jump-to-sheet), same idea as onNavigate() in the JSX. Call
  // this AFTER setCell() so the style sticks — in ExcelJS, cell.style and
  // cell.value are independent, so reassigning value to a hyperlink object
  // here does not wipe out the fill/font already set.
  const makeInternalHyperlink = (cell, label, targetTab) => {
    const sheetName = TAB_TO_SHEET_NAME[targetTab];
    if (!sheetName) return; // no mapping/target — leave as plain styled text
    cell.value = {
      text: label,
      hyperlink: `#'${sheetName}'!A1`,
      tooltip: `Go to ${sheetName}`,
    };
  };

  const worksheet = workbook.addWorksheet("Schedule A");

  setupWorksheet(worksheet);

  addCompanyHeader(worksheet, {
    companyName,
    companyAddress,
    scheduleName: "SCHEDULE A",
    title: "Summary of all Claimed Indirect Rates",
  });

  worksheet.mergeCells("B6:F6");

  setCell(worksheet.getCell("B6"), `Fiscal Year End - ${FISCAL_YEAR_END}`, {
    bold: true,
    align: "center",
    fill: YELLOW,
  });

  // --- "Schedule A is linked to the following schedules" block ------------
  // This whole block was missing from the previous export — the left-hand
  // text stack in the JSX with 5 clickable schedule links + "ICE MANUAL".
  // Placed in columns H:J so it can't collide with the B:F header/company
  // header layout above. Move the start row/column if it overlaps your real
  // header once addCompanyHeader's rows are visible.
  const linkRows = [
    { text: "Schedule A is linked to the following", link: false },
    { text: "schedules:", link: false },
    { text: "Schedule C, Overhead", link: true, targetTab: "sched_c1" },
    { text: "Schedule B, G&A", link: true, targetTab: "sched_b" },
    { text: "Schedule D, Occupancy", link: true, targetTab: "sched_d1" },
    { text: "Schedule E, Cost of Money", link: true, targetTab: "sched_e" },
    { text: "Schedule E, Bases", link: true, targetTab: "sched_e" },
    { text: "ICE MANUAL", link: false, underline: true },
  ];

  let linkRowStart = 3;
  linkRows.forEach((row) => {
    const cell = worksheet.getCell(`H${linkRowStart}`);
    if (row.link) {
      setCell(cell, row.text, {
        bold: true,
        underline: true,
        color: BLUE,
        fontSize: 9,
      });
      makeInternalHyperlink(cell, row.text, row.targetTab);
    } else {
      setCell(cell, row.text, {
        bold: false,
        underline: !!row.underline,
        color: row.underline ? BLUE : undefined,
        fontSize: 9,
      });
    }
    linkRowStart += 1;
  });
  // --------------------------------------------------------------------

  // Header
  worksheet.getRow(8).values = ["", "COST ELEMENT", "CLAIMED", "", "REFERENCE"];

  worksheet.mergeCells("B8:B9");
  worksheet.mergeCells("C8:D9");
  worksheet.mergeCells("E8:F9");

  setCell(worksheet.getCell("B8"), "COST ELEMENT", {
    bold: true,
    underline: true,
  });

  setCell(worksheet.getCell("C8"), "CLAIMED", {
    bold: true,
    underline: true,
    align: "center",
  });

  setCell(worksheet.getCell("E8"), "REFERENCE", {
    bold: true,
    underline: true,
  });

  applyBottomBorder(worksheet.getRow(9), 2, 5);

  const sections = await getScheduleAData();

  let rowNumber = 11;

  sections.forEach((section) => {
    worksheet.mergeCells(`B${rowNumber}:B${rowNumber}`);

    setCell(worksheet.getCell(`B${rowNumber}`), section.title, {
      bold: true,
      underline: true,
      fill: YELLOW,
    });

    setCell(worksheet.getCell(`B${rowNumber + 1}`), "POOL");

    setCell(worksheet.getCell(`B${rowNumber + 2}`), "BASE");

    setCell(worksheet.getCell(`B${rowNumber + 3}`), section.rateLabel);

    setCell(worksheet.getCell(`C${rowNumber + 1}`), numberValue(section.pool), {
      align: "right",
      fill: YELLOW,
    });

    setCell(worksheet.getCell(`C${rowNumber + 2}`), numberValue(section.base), {
      align: "right",
      fill: YELLOW,
    });

    setCell(
      worksheet.getCell(`C${rowNumber + 3}`),
      Number(section.rate) / 100,
      {
        align: "right",
        fill: CYAN,
      },
    );

    worksheet.getCell(`C${rowNumber + 1}`).numFmt = "#,##0.00;(#,##0.00);-";

    worksheet.getCell(`C${rowNumber + 2}`).numFmt = "#,##0.00;(#,##0.00);-";

    worksheet.getCell(`C${rowNumber + 3}`).numFmt = "0.00%";

    // Reference badge 1 — real hyperlink to the target sheet, styled to
    // match the blue "button" from the JSX (bg-blue-700 + white text).
    if (section.reference) {
      const refCell1 = worksheet.getCell(`E${rowNumber + 1}`);
      setCell(refCell1, section.reference, {
        bold: true,
        underline: true,
        color: WHITE,
        fill: BLUE,
        align: "center",
      });
      makeInternalHyperlink(refCell1, section.reference, section.targetTab);
    }

    // Reference badge 2 — only present for sections that have a second
    // link (Overhead pools + G&A also point at SCHEDULE E). Sits one row
    // below badge 1, same as the vertical stack in the JSX.
    if (section.reference2) {
      const refCell2 = worksheet.getCell(`E${rowNumber + 2}`);
      setCell(refCell2, section.reference2, {
        bold: true,
        underline: true,
        color: WHITE,
        fill: BLUE,
        align: "center",
      });
      makeInternalHyperlink(refCell2, section.reference2, section.targetTab2);
    }

    rowNumber += 5;
  });

  worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);

  setCell(worksheet.getCell(`B${rowNumber}`), "Imported from Other Worksheet", {
    fill: YELLOW,
    fontSize: 9,
  });

  worksheet.mergeCells(`B${rowNumber + 1}:C${rowNumber + 1}`);

  setCell(worksheet.getCell(`B${rowNumber + 1}`), "Cell Contains a Formula", {
    fill: CYAN,
    fontSize: 9,
  });

  worksheet.columns = [
    { width: 3 },
    { width: 36 },
    { width: 18 },
    { width: 4 },
    { width: 22 },
    { width: 4 },
    { width: 4 },
    { width: 20 },
    { width: 18 },
    { width: 18 },
  ];
};

// =========================================================
// SCHEDULE B
// =========================================================

const getScheduleBData = async () => {
  const data = await getJson(
    `${backendUrl}/api/TrialBalance/scheduleB_cost?fycd=${FISCAL_YEAR}`,
  );

  const accountsList = Array.isArray(data) ? data : data.accounts || [];

  const fringeAllocation = data.fringeAllocation || {
    acctName: "Fringe Allocation",
    endingBalance: 0,
  };

  const aggregated = accountsList.reduce((acc, item) => {
    const acctId = item.acctId;
    const endingBalance = item.endingBalance || 0;

    if (!acc[acctId]) {
      acc[acctId] = {
        account: acctId,
        description: item.acctName ? item.acctName.trim() : "",
        amountRaw: endingBalance,
        adjustmentRaw: 0,
      };
    } else {
      acc[acctId].amountRaw += endingBalance;
    }

    return acc;
  }, {});

  const rows = Object.values(aggregated).map((row) => {
    let adjustment = row.adjustmentRaw;

    if (row.account === "90-03-01") {
      adjustment = -row.amountRaw;
    }

    const total = row.amountRaw;
    const claimed = total + adjustment;

    return {
      account: row.account,
      description: row.description,
      amountRaw: row.amountRaw,
      totalRaw: total,
      adjustmentRaw: adjustment,
      claimedRaw: claimed,
    };
  });

  return {
    rows,
    fringeBalance: fringeAllocation.endingBalance || 0,
  };
};

const addScheduleB = async (workbook, { companyName, companyAddress }) => {
  const worksheet = workbook.addWorksheet("Schedule B");

  setupWorksheet(worksheet);

  addCompanyHeader(worksheet, {
    companyName,
    companyAddress,
    scheduleName: "SCHEDULE B",
    title: "General and Administrative (G&A) Expenses",
  });

  // ⚠️ ASSUMPTION — addCompanyHeader's own output is assumed to occupy rows
  // 1-5 (company name/address + schedule title), leaving rows 6-7 free for
  // the two header lines the JSX has that addCompanyHeader alone doesn't
  // cover, before the table header hard-codes row 8. Adjust rows 6/7 below
  // if addCompanyHeader actually uses more/fewer rows.
  worksheet.mergeCells("C6:H6");
  setCell(
    worksheet.getCell("C6"),
    "General and Administrative (G&A) Expenses (Final Indirect Cost Pool)",
    { bold: true, align: "center" },
  );

  worksheet.mergeCells("C7:H7");
  setCell(worksheet.getCell("C7"), `Fiscal Year End - ${FISCAL_YEAR_END}`, {
    bold: true,
    align: "center",
    fill: YELLOW,
  });

  // --- "Schedule B is linked to the following schedules" block ------------
  // Missing entirely from the previous export. Placed in column K, which
  // sits outside the table's B:J range, so it can't collide with the
  // header row (which uses every column from B to I) at row 8.
  //
  // ⚠️ ASSUMPTION — sheet-name strings must exactly match whatever
  // workbook.addWorksheet("...") uses for those tabs, since ExcelJS
  // resolves internal hyperlinks by sheet name.
  const TAB_TO_SHEET_NAME = {
    sched_d1: "SCHEDULE D (1)",
    sched_e: "SCHEDULE E",
    sched_h: "SCHEDULE H",
    sched_summaryh: "SUMMARY SCH H",
  };

  const makeInternalHyperlink = (cell, label, targetTab) => {
    const sheetName = TAB_TO_SHEET_NAME[targetTab];
    if (!sheetName) return;
    cell.value = {
      text: label,
      hyperlink: `#'${sheetName}'!A1`,
      tooltip: `Go to ${sheetName}`,
    };
  };

  const topLinks = [
    { text: "Schedule B is linked to the following" },
    { text: "schedules:" },
    { text: "Schedule D (x), Intermediate Allocations", targetTab: "sched_d1" },
    { text: "Schedule E, Bases", targetTab: "sched_e" },
    { text: "Schedule H, Contract Costs", targetTab: "sched_h" },
    { text: "Summary Sch H", targetTab: "sched_summaryh" },
    { text: "Sched P, IR&D&B&P", grey: true },
    { text: "ICE MANUAL", underline: true },
  ];

  topLinks.forEach((item, idx) => {
    const cell = worksheet.getCell(`K${idx + 1}`);
    if (item.targetTab) {
      setCell(cell, item.text, {
        underline: true,
        color: BLUE,
        fontSize: 9,
      });
      makeInternalHyperlink(cell, item.text, item.targetTab);
    } else {
      setCell(cell, item.text, {
        underline: !!item.underline,
        color: item.underline ? BLUE : item.grey ? GREY_TEXT : undefined,
        fontSize: 9,
      });
    }
  });
  // -------------------------------------------------------------------

  const { rows, fringeBalance } = await getScheduleBData();

  let row = 8;

  // Header
  const headers = [
    "ACCOUNT NUMBER",
    "DESCRIPTION",
    "Acct Balances\nAmount",
    "TOTAL PER G/L,\n& TRIAL BAL/F/S",
    "ADJUSTMENTS",
    "CLAIMED",
    "Notes",
    "Ref.",
  ];

  headers.forEach((header, index) => {
    const cell = worksheet.getCell(row, index + 2);

    setCell(cell, header, {
      bold: true,
      underline: index === 0 || index === 1,
      align: "center",
    });

    if (index === 2) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: YELLOW },
      };
    }
  });

  applyBottomBorder(worksheet.getRow(row), 2, 9);

  row++;

  // Data rows
  rows.forEach((item) => {
    setCell(worksheet.getCell(row, 2), item.account);

    setCell(worksheet.getCell(row, 3), item.description);

    setCell(worksheet.getCell(row, 4), item.amountRaw, { align: "right" });

    // Frontend's TOTAL value
    setCell(worksheet.getCell(row, 5), item.totalRaw, {
      align: "right",
      fill: CYAN,
    });

    setCell(worksheet.getCell(row, 6), item.adjustmentRaw, {
      align: "right",
    });

    // Frontend's CLAIMED value
    setCell(
      worksheet.getCell(row, 7),
      {
        formula: `E${row}+F${row}`,
      },
      {
        align: "right",
        fill: CYAN,
      },
    );

    worksheet.getCell(row, 4).numFmt = "#,##0.00;(#,##0.00);-";
    worksheet.getCell(row, 5).numFmt = "#,##0.00;(#,##0.00);-";
    worksheet.getCell(row, 6).numFmt = "#,##0.00;(#,##0.00);-";
    worksheet.getCell(row, 7).numFmt = "#,##0.00;(#,##0.00);-";

    row++;
  });

  // SUBTOTAL
  const subtotalRow = row;

  setCell(worksheet.getCell(subtotalRow, 3), "SUBTOTAL", {
    bold: true,
    underline: true,
  });

  worksheet.getCell(subtotalRow, 4).value = {
    formula: `SUM(D${8 + 1}:D${subtotalRow - 1})`,
  };
  worksheet.getCell(subtotalRow, 5).value = {
    formula: `SUM(E${8 + 1}:E${subtotalRow - 1})`,
  };
  worksheet.getCell(subtotalRow, 6).value = {
    formula: `SUM(F${8 + 1}:F${subtotalRow - 1})`,
  };
  worksheet.getCell(subtotalRow, 7).value = {
    formula: `SUM(G${8 + 1}:G${subtotalRow - 1})`,
  };

  for (let col = 4; col <= 7; col++) {
    worksheet.getCell(subtotalRow, col).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: CYAN },
    };
    worksheet.getCell(subtotalRow, col).font = {
      name: "Arial",
      bold: true,
      size: 10,
    };
    worksheet.getCell(subtotalRow, col).numFmt = "#,##0.00;(#,##0.00);-";
    worksheet.getCell(subtotalRow, col).alignment = { horizontal: "right" };
  }

  applyBottomBorder(worksheet.getRow(subtotalRow), 2, 9);

  // "Intermediate Allocations:" header — was missing entirely.
  row = subtotalRow + 2;
  const allocHeaderRow = row;
  worksheet.mergeCells(`B${allocHeaderRow}:I${allocHeaderRow}`);
  setCell(
    worksheet.getCell(`B${allocHeaderRow}`),
    "Intermediate Allocations:",
    {
      bold: true,
      underline: true,
    },
  );

  // California Intermediate row — was missing entirely.
  row += 1;
  const californiaRow = row;

  setCell(worksheet.getCell(californiaRow, 3), "California Intermediate", {
    fill: YELLOW,
  });
  setCell(worksheet.getCell(californiaRow, 4), 0, {
    align: "right",
    fill: YELLOW,
  });
  setCell(worksheet.getCell(californiaRow, 5), 0, {
    align: "right",
    fill: CYAN,
  });
  setCell(worksheet.getCell(californiaRow, 6), 0, {
    align: "right",
    fill: CYAN,
  });
  setCell(worksheet.getCell(californiaRow, 7), 0, {
    align: "right",
    fill: YELLOW,
  });
  worksheet.getCell(californiaRow, 4).numFmt = INT_FMT;
  worksheet.getCell(californiaRow, 5).numFmt = INT_FMT;
  worksheet.getCell(californiaRow, 6).numFmt = INT_FMT;
  worksheet.getCell(californiaRow, 7).numFmt = INT_FMT;

  // Two stacked buttons in the JSX become two side-by-side cells (I, J) —
  // a single Excel cell can't carry two independent hyperlinks.
  setCell(worksheet.getCell(californiaRow, 9), "Sched D (1)", {
    bold: true,
    color: WHITE,
    fill: BLUE,
    align: "center",
    fontSize: 9,
  });
  linkToSheet(worksheet.getCell(californiaRow, 9), "Sched D (1)");

  setCell(worksheet.getCell(californiaRow, 10), "Sched D (2)", {
    bold: true,
    color: WHITE,
    fill: BLUE,
    align: "center",
    fontSize: 9,
  });
  linkToSheet(worksheet.getCell(californiaRow, 10), "Sched D (2)");

  // ADD: Fringe Allocation
  row += 1;
  const fringeRow = row;

  setCell(worksheet.getCell(fringeRow, 2), "ADD: Fringe Allocation", {
    bold: true,
  });

  // The diagonal-hatch placeholder background in the JSX has no direct
  // ExcelJS equivalent (solid fills only) — approximated with a light grey.
  setCell(worksheet.getCell(fringeRow, 3), "", { fill: GREY });

  setCell(worksheet.getCell(fringeRow, 4), fringeBalance, {
    align: "right",
    fill: YELLOW,
  });

  // Total is a real formula off the imported Amount cell (cyan = formula).
  setCell(
    worksheet.getCell(fringeRow, 5),
    { formula: `D${fringeRow}` },
    { align: "right", fill: CYAN },
  );

  setCell(worksheet.getCell(fringeRow, 6), 0, {
    align: "right",
    fill: CYAN,
  });

  setCell(worksheet.getCell(fringeRow, 7), fringeBalance, {
    align: "right",
    fill: YELLOW,
  });

  worksheet.getCell(fringeRow, 4).numFmt = "#,##0.00;(#,##0.00);-";
  worksheet.getCell(fringeRow, 5).numFmt = "#,##0.00;(#,##0.00);-";
  worksheet.getCell(fringeRow, 6).numFmt = "#,##0.00;(#,##0.00);-";
  worksheet.getCell(fringeRow, 7).numFmt = "#,##0.00;(#,##0.00);-";

  setCell(worksheet.getCell(fringeRow, 9), "Fringe", {
    bold: true,
    color: WHITE,
    fill: BLUE,
    align: "center",
    fontSize: 9,
  });
  linkToSheet(worksheet.getCell(fringeRow, 9), "Fringe");

  // Intermediate SUBTOTAL (same label reused, per the JSX)
  row += 1;
  const intermediateSubtotalRow = row;

  setCell(worksheet.getCell(intermediateSubtotalRow, 3), "SUBTOTAL", {
    bold: true,
    underline: true,
  });

  worksheet.getCell(intermediateSubtotalRow, 4).value = {
    formula: `D${subtotalRow}`,
  };
  worksheet.getCell(intermediateSubtotalRow, 5).value = {
    formula: `E${subtotalRow}+E${fringeRow}`,
  };
  worksheet.getCell(intermediateSubtotalRow, 6).value = {
    formula: `F${subtotalRow}`,
  };
  worksheet.getCell(intermediateSubtotalRow, 7).value = {
    formula: `G${subtotalRow}+E${fringeRow}`,
  };

  for (const col of [4, 5, 6, 7]) {
    worksheet.getCell(intermediateSubtotalRow, col).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: CYAN },
    };
    worksheet.getCell(intermediateSubtotalRow, col).numFmt = INT_FMT;
    worksheet.getCell(intermediateSubtotalRow, col).alignment = {
      horizontal: "right",
    };
  }

  row += 2;

  // IR&D / B&P breakdown (matches SchedB.jsx exactly — Total/Claimed fill
  // colors are NOT symmetric in the source UI, so they're spelled out per
  // row rather than derived, to stay a faithful copy)
  const irdBpRows = [
    {
      label: "IR & D Mat'l, Trvl, ODC (Sum SCH H)",
      totalFill: YELLOW,
      claimedFill: YELLOW,
      links: ["SUM SCHED H"],
    },
    {
      label: "IR & D Labor (Sum SCH H)",
      totalFill: YELLOW,
      claimedFill: YELLOW,
      links: ["SUM SCHED H"],
    },
    {
      label: "IR&D Fringe",
      totalFill: GREY,
      claimedFill: GREY,
      links: [],
    },
    {
      label: "IR & D Overhead (Sum SCH H & SCH E)",
      totalFill: GREY,
      claimedFill: YELLOW,
      links: ["SUM SCHED H", "SCHED E"],
    },
    {
      label: "B & P Mat'l, Trvl, ODC (Sum SCH H)",
      totalFill: YELLOW,
      claimedFill: YELLOW,
      links: ["SUM SCHED H"],
    },
    {
      label: "B & P Labor (Sum SCH H)",
      totalFill: YELLOW,
      claimedFill: YELLOW,
      links: ["SUM SCHED H"],
    },
    {
      label: "B&P Fringe",
      totalFill: GREY,
      claimedFill: YELLOW,
      links: [],
    },
    {
      label: "B & P Overhead (Sum SCH H & SCH E)",
      totalFill: GREY,
      claimedFill: YELLOW,
      links: ["SUM SCHED H", "SCHED E"],
    },
  ];

  irdBpRows.forEach((item) => {
    // Description column (C), not Account column — the account cell (B)
    // stays empty per the JSX's leading <td></td>.
    setCell(worksheet.getCell(row, 3), item.label, { fontSize: 9 });

    // Amount column (D) stays fully empty per the JSX's empty <td></td> —
    // no value, no fill.

    setCell(worksheet.getCell(row, 5), 0, {
      align: "right",
      fill: item.totalFill,
    });
    setCell(worksheet.getCell(row, 6), 0, { align: "right", fill: CYAN });
    setCell(worksheet.getCell(row, 7), 0, {
      align: "right",
      fill: item.claimedFill,
    });

    worksheet.getCell(row, 5).numFmt = INT_FMT;
    worksheet.getCell(row, 6).numFmt = INT_FMT;
    worksheet.getCell(row, 7).numFmt = INT_FMT;

    // Reference button(s) — Reference column is I (9), not H (8, Notes).
    item.links.forEach((label, idx) => {
      const cell = worksheet.getCell(row, 9 + idx);
      setCell(cell, label, {
        bold: true,
        color: WHITE,
        fill: BLUE,
        align: "center",
        fontSize: 9,
      });
      linkToSheet(cell, label);
    });

    row++;
  });

  row += 1;

  // Final Pool Total — colSpan="3" in the JSX means Account+Description+
  // Amount (B:D), not just B:C.
  const finalTotalRow = row;

  worksheet.mergeCells(`B${finalTotalRow}:D${finalTotalRow}`);
  setCell(worksheet.getCell(`B${finalTotalRow}`), "TOTAL G & A EXPENSE POOL", {
    bold: true,
  });

  worksheet.getCell(finalTotalRow, 5).value = {
    formula: `E${intermediateSubtotalRow}`,
  };
  worksheet.getCell(finalTotalRow, 6).value = {
    formula: `F${subtotalRow}`,
  };
  worksheet.getCell(finalTotalRow, 7).value = {
    formula: `G${intermediateSubtotalRow}`,
  };

  for (const col of [5, 6, 7]) {
    worksheet.getCell(finalTotalRow, col).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: CYAN },
    };
    worksheet.getCell(finalTotalRow, col).font = { bold: true };
    worksheet.getCell(finalTotalRow, col).numFmt = "#,##0.00;(#,##0.00);-";
    worksheet.getCell(finalTotalRow, col).alignment = { horizontal: "right" };
  }

  // Explanatory Notes — was missing entirely.
  row = finalTotalRow + 2;
  worksheet.mergeCells(`B${row}:I${row}`);
  setCell(worksheet.getCell(`B${row}`), "Explanatory Notes:", {
    bold: true,
    underline: true,
  });

  row += 1;
  worksheet.mergeCells(`B${row}:I${row}`);
  setCell(
    worksheet.getCell(`B${row}`),
    "1. Unallowable State Tax Expense for Pass-Thru Entity Tax - Mississippi FAR 31.205-41(b)(1)",
    { fontSize: 8 },
  );

  row += 1;
  worksheet.mergeCells(`B${row}:I${row}`);
  setCell(
    worksheet.getCell(`B${row}`),
    "2. Income recorded in 9XX GLs has not been added to POOL cost. In accordance with the principle of consistency and FAR 31.205-20, since income not arises out of regular business so excluded to ensure the government only receives credits related to allowable costs.",
    { fontSize: 8 },
  );

  // Legend
  row += 3;
  setCell(worksheet.getCell(`B${row}`), "Imported from Other Worksheet", {
    fill: YELLOW,
    fontSize: 9,
  });
  setCell(worksheet.getCell(`C${row}`), "As Referenced", { fontSize: 9 });

  row++;
  setCell(worksheet.getCell(`B${row}`), "Cell Contains a Formula", {
    fill: CYAN,
    fontSize: 9,
  });
  setCell(worksheet.getCell(`C${row}`), "Totals, Claimed and Differences", {
    fontSize: 9,
  });

  row++;
  setCell(worksheet.getCell(`B${row}`), "Cell Contains a Formula With Links", {
    fill: GREY,
    fontSize: 9,
  });
  setCell(
    worksheet.getCell(`C${row}`),
    "Complex formulas, linked between Sched B and E",
    { fontSize: 9 },
  );
  // (No stray formulas/fills here — the previous version accidentally
  // attached Final-Total-row formulas and CYAN fill to this legend row.)

  worksheet.columns = [
    { width: 3 },
    { width: 18 },
    { width: 40 },
    { width: 18 },
    { width: 20 },
    { width: 18 },
    { width: 18 },
    { width: 8 },
    { width: 14 },
    { width: 14 },
    { width: 32 },
  ];
};

// =========================================================
// COMMON C SCHEDULE DATA
// =========================================================

const getCAccountRows = (accounts, aggregate = true) => {
  if (!aggregate) {
    return accounts.map((item) => {
      const amount = item.endingBalance || 0;

      return {
        account: item.acctId,
        description: item.acctName ? item.acctName.trim() : "",
        amountRaw: amount,
        totalRaw: amount,
        adjustmentRaw: 0,
        claimedRaw: amount,
      };
    });
  }

  const aggregated = accounts.reduce((acc, item) => {
    const acctId = item.acctId;
    const amount = item.endingBalance || 0;

    if (!acc[acctId]) {
      acc[acctId] = {
        account: acctId,
        description: item.acctName ? item.acctName.trim() : "",
        amountRaw: amount,
        adjustmentRaw: 0,
      };
    } else {
      acc[acctId].amountRaw += amount;
    }

    return acc;
  }, {});

  return Object.values(aggregated).map((item) => ({
    ...item,
    totalRaw: item.amountRaw,
    claimedRaw: item.amountRaw + item.adjustmentRaw,
  }));
};

// =========================================================
// SCHEDULE C1
// =========================================================

// =========================================================
// SHARED: Reference button
// Mirrors the <ReferenceBox> component used identically by
// SchedC1, SchedC2 and SchedC6 in the JSX — bg-blue-700,
// white bold underlined text, centered. Used for
// "Sched D (1)", "Sched D (2)", and "Fringe".
// =========================================================

const addRefButton = (worksheet, row, col, label) => {
  const cell = worksheet.getCell(row, col);

  cell.value = label;

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    // NOTE: verify whether your fill helper elsewhere expects
    // an "FF" alpha prefix (e.g. "FF1D4ED8") or bare hex like
    // this. Match whatever YELLOW/CYAN use so all three fills
    // render consistently.
    fgColor: { argb: "1D4ED8" },
  };

  cell.font = {
    name: "Arial",
    size: 9,
    bold: true,
    underline: true,
    color: { argb: "FFFFFF" },
  };

  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
};

// =========================================================
// SCHEDULE C1
// =========================================================

const getScheduleC1Data = async () => {
  const data = await getJson(
    `${backendUrl}/api/TrialBalance/scheduleC1_cost?fycd=${FISCAL_YEAR}`,
  );

  const rows = getCAccountRows(data.accounts || [], true);

  const amounts = data.amounts || [];

  const california = amounts.find((x) =>
    x.name?.toLowerCase().includes("california intermediate"),
  );

  const fringe = amounts.find((x) => x.name?.toLowerCase().includes("fringe"));

  return {
    rows,
    californiaIntermediate: Number(california?.amount || 0),
    fringeAllocation: Number(fringe?.amount || 0),
  };
};

// =========================================================
// SCHEDULE C2
// =========================================================

const getScheduleC2Data = async () => {
  const data = await getJson(
    `${backendUrl}/api/TrialBalance/scheduleC2_cost?fycd=${FISCAL_YEAR}`,
  );

  // NOTE: getCAccountRows(accounts, false) — for this to match the
  // JSX exactly, when the second arg is false it needs to set
  // totalRaw = amountRaw per row, since SchedC2's "TOTAL PER G/L"
  // column just repeats the Amount column (no separate aggregation
  // happens in that JSX, unlike C1/C6). Worth double-checking the
  // body of getCAccountRows for this.
  const rows = getCAccountRows(data.accounts || [], false);

  const amounts = data.amounts || [];

  const california = amounts.find((x) =>
    x.name?.toLowerCase().includes("california intermediate"),
  );

  return {
    rows,
    californiaIntermediate: Number(california?.amount || 0),
    fringeAllocation: 0, // matches JSX: fringeAllocationVal is always 0 for C2
  };
};

// =========================================================
// SCHEDULE C6
// =========================================================

const getScheduleC6Data = async () => {
  const data = await getJson(
    `${backendUrl}/api/TrialBalance/scheduleC6_cost?fycd=${FISCAL_YEAR}`,
  );

  const rows = getCAccountRows(data.accounts || [], true);

  return {
    rows,
    californiaIntermediate: 0, // matches JSX: californiaIntermediate is always 0 for C6
    fringeAllocation: Number(data.fringeAllocation?.endingBalance || 0),
  };
};

// =========================================================
// MAIN ACCOUNT TABLE (unchanged from your version — mapping
// already matched the JSX correctly)
// =========================================================

const addCScheduleTable = (worksheet, startRow, rows) => {
  let row = startRow;

  const headers = [
    "ACCOUNT\nNUMBER",
    "DESCRIPTION",
    "Acct Balances\nAmount",
    "TOTAL PER G/L\n& TRIAL BAL/F/S",
    "ADJUSTMENTS",
    "CLAIMED",
    "Notes",
    "Ref.",
  ];

  headers.forEach((header, index) => {
    const cell = worksheet.getCell(row, index + 2);

    setCell(cell, header, {
      bold: true,
      underline: index === 0 || index === 1,
      align: "center",
    });

    if (index === 2) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: YELLOW },
      };
    }
  });

  worksheet.getRow(row).height = 35;

  applyBottomBorder(worksheet.getRow(row), 2, 9);

  row++;

  const firstDataRow = row;

  rows.forEach((item) => {
    setCell(worksheet.getCell(row, 2), item.account);
    setCell(worksheet.getCell(row, 3), item.description);

    setCell(worksheet.getCell(row, 4), item.amountRaw, { align: "right" });

    setCell(worksheet.getCell(row, 5), item.totalRaw, {
      align: "right",
      fill: CYAN,
    });

    setCell(worksheet.getCell(row, 6), item.adjustmentRaw, {
      align: "right",
    });

    worksheet.getCell(row, 7).value = { formula: `E${row}+F${row}` };

    worksheet.getCell(row, 7).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: CYAN },
    };

    worksheet.getCell(row, 7).alignment = { horizontal: "right" };

    for (let col = 4; col <= 7; col++) {
      worksheet.getCell(row, col).numFmt = "#,##0.00;(#,##0.00);-";
    }

    row++;
  });

  const subtotalRow = row;

  setCell(worksheet.getCell(subtotalRow, 3), "Subtotal", {
    bold: true,
    underline: true,
  });

  for (let col = 4; col <= 7; col++) {
    const letter = String.fromCharCode(64 + col);

    worksheet.getCell(subtotalRow, col).value = {
      formula: `SUM(${letter}${firstDataRow}:${letter}${subtotalRow - 1})`,
    };

    worksheet.getCell(subtotalRow, col).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: CYAN },
    };

    worksheet.getCell(subtotalRow, col).font = {
      name: "Arial",
      bold: true,
      size: 10,
    };

    worksheet.getCell(subtotalRow, col).alignment = { horizontal: "right" };

    worksheet.getCell(subtotalRow, col).numFmt = "#,##0.00;(#,##0.00);-";
  }

  applyBottomBorder(worksheet.getRow(subtotalRow), 2, 9);

  return subtotalRow;
};

// =========================================================
// ALLOCATION ROW (unchanged)
// =========================================================

const addAllocationRow = (
  worksheet,
  row,
  label,
  amount,
  { fill = YELLOW } = {},
) => {
  setCell(worksheet.getCell(row, 3), label, {
    bold: true,
    underline: true,
    fill,
  });

  setCell(worksheet.getCell(row, 4), 0, { align: "right", fill });
  setCell(worksheet.getCell(row, 5), amount, { align: "right", fill });
  setCell(worksheet.getCell(row, 7), amount, { align: "right", fill: CYAN });

  worksheet.getCell(row, 4).numFmt = "#,##0.00;(#,##0.00);-";
  worksheet.getCell(row, 5).numFmt = "#,##0.00;(#,##0.00);-";
  worksheet.getCell(row, 7).numFmt = "#,##0.00;(#,##0.00);-";
};

// =========================================================
// MAIN SHEET BUILDER
// =========================================================

const addCSchedule = async (
  workbook,
  {
    sheetName,
    scheduleName,
    sectionTitle,
    companyName,
    companyAddress,
    getData,
    includeFringe,
    includeCalifornia,
  },
) => {
  const worksheet = workbook.addWorksheet(sheetName);

  setupWorksheet(worksheet);

  // ============================================================
  // HEADER
  // ============================================================

  addCompanyHeader(worksheet, {
    companyName,
    companyAddress,
    scheduleName,
    title: "Overhead Expenses (final indirect cost pool)",
  });

  worksheet.mergeCells("B6:F6");

  setCell(worksheet.getCell("B6"), sectionTitle, {
    bold: true,
    align: "center",
    fill: YELLOW,
  });

  worksheet.mergeCells("B7:F7");

  setCell(worksheet.getCell("B7"), `Fiscal Year End - ${FISCAL_YEAR_END}`, {
    bold: true,
    align: "center",
    fill: YELLOW,
  });

  // ============================================================
  // API DATA
  // ============================================================

  const data = await getData();

  // ============================================================
  // MAIN ACCOUNT TABLE
  // ============================================================

  const subtotalRow = addCScheduleTable(worksheet, 9, data.rows);

  let row = subtotalRow + 2;

  let californiaRow = null;
  let fringeRow = null;

  // ============================================================
  // CALIFORNIA INTERMEDIATE
  // FIX: both buttons now use the shared addRefButton helper
  // instead of the broken setCell + overwritten .font combo.
  // ============================================================

  if (includeCalifornia) {
    californiaRow = row;

    addAllocationRow(
      worksheet,
      row,
      "California Intermediate",
      Number(data.californiaIntermediate || 0),
    );

    addRefButton(worksheet, row, 9, "Sched D (1)");

    row++;

    addRefButton(worksheet, row, 9, "Sched D (2)");

    row++;
  }

  // ============================================================
  // FRINGE ALLOCATION
  // FIX: "Fringe" reference now matches the same blue-button
  // style as Sched D (1)/(2) — the JSX uses the identical
  // <ReferenceBox> component for all three.
  // ============================================================

  if (includeFringe) {
    fringeRow = row;

    setCell(worksheet.getCell(row, 2), "ADD: Fringe Allocation", {
      bold: true,
    });

    setCell(worksheet.getCell(row, 4), "", { align: "right", fill: YELLOW });

    setCell(worksheet.getCell(row, 5), Number(data.fringeAllocation || 0), {
      align: "right",
      fill: YELLOW,
    });

    setCell(worksheet.getCell(row, 6), 0, { align: "right", fill: CYAN });

    setCell(worksheet.getCell(row, 7), Number(data.fringeAllocation || 0), {
      align: "right",
      fill: YELLOW,
    });

    worksheet.getCell(row, 5).numFmt = "#,##0.00;(#,##0.00);-";
    worksheet.getCell(row, 6).numFmt = "#,##0.00;(#,##0.00);-";
    worksheet.getCell(row, 7).numFmt = "#,##0.00;(#,##0.00);-";

    addRefButton(worksheet, row, 9, "Fringe");

    row++;
  }

  // ============================================================
  // TOTAL OVERHEAD POOL
  // ============================================================

  const totalRow = row + 1;

  setCell(worksheet.getCell(totalRow, 3), "Total Overhead Pool", {
    bold: true,
  });

  const totalReferences = [
    `E${subtotalRow}`,
    californiaRow ? `E${californiaRow}` : null,
    fringeRow ? `E${fringeRow}` : null,
  ].filter(Boolean);

  const claimedReferences = [
    `G${subtotalRow}`,
    californiaRow ? `G${californiaRow}` : null,
    fringeRow ? `G${fringeRow}` : null,
  ].filter(Boolean);

  worksheet.getCell(totalRow, 5).value = {
    formula: totalReferences.join("+"),
  };

  worksheet.getCell(totalRow, 6).value = { formula: `F${subtotalRow}` };

  worksheet.getCell(totalRow, 7).value = {
    formula: claimedReferences.join("+"),
  };

  for (let col = 5; col <= 7; col++) {
    const cell = worksheet.getCell(totalRow, col);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: CYAN },
    };

    cell.font = { name: "Arial", size: 10, bold: true };

    cell.alignment = { horizontal: "right", vertical: "middle" };

    cell.numFmt = "#,##0.00;(#,##0.00);-";
  }

  applyBottomBorder(worksheet.getRow(totalRow), 2, 9);

  // ============================================================
  // EXPLANATORY NOTES
  // NOTE: this note text is only present in SchedC1's JSX, not
  // C2 or C6. If addCSchedule is reused for all three sheets as-is,
  // C2/C6 will get this note even though their live UI doesn't show
  // one. Consider making this conditional (e.g. an `explanatoryNote`
  // param, only passed for the C1 call site) if you want an exact match.
  // ============================================================

  const notesStartRow = totalRow + 3;

  worksheet.mergeCells(`B${notesStartRow}:I${notesStartRow}`);

  setCell(worksheet.getCell(`B${notesStartRow}`), "Explanatory Notes:", {
    bold: true,
    underline: true,
  });

  worksheet.mergeCells(`B${notesStartRow + 2}:I${notesStartRow + 2}`);

  setCell(
    worksheet.getCell(`B${notesStartRow + 2}`),
    "Explanation reflects the allocation of two separate Fringe benefit pools (D-1). AERO Fringe Pool 2 (D-1) has been linked directly to the Fringe Allocation section to ensure consistent treatment with Fringe Pool 1. These costs are allocated to the benefiting Overhead and G&A pools based on the specific labor categories assigned to each fringe group.",
    { size: 9, wrapText: true },
  );

  worksheet.getRow(notesStartRow + 2).height = 55;

  // ============================================================
  // LEGEND
  // ============================================================

  const legendRow = notesStartRow + 5;

  setCell(worksheet.getCell(`B${legendRow}`), "Imported from Other Worksheet", {
    size: 9,
    fill: YELLOW,
  });

  setCell(worksheet.getCell(`C${legendRow}`), "As Referenced", { size: 9 });

  setCell(worksheet.getCell(`B${legendRow + 1}`), "Cell Contains a Formula", {
    size: 9,
    fill: CYAN,
  });

  setCell(
    worksheet.getCell(`C${legendRow + 1}`),
    "Totals Claimed and Reconciling Differences",
    { size: 9 },
  );

  // ============================================================
  // COLUMN WIDTHS
  // ============================================================

  worksheet.columns = [
    { width: 3 },
    { width: 18 },
    { width: 36 },
    { width: 16 },
    { width: 19 },
    { width: 17 },
    { width: 17 },
    { width: 10 },
    { width: 12 },
  ];

  // ============================================================
  // PAGE SETUP
  // ============================================================

  worksheet.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  return worksheet;
};

//Schedule D1

//Schedule D1

async function getScheduleD1Data(fiscalYear = FISCAL_YEAR) {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/scheduleD1_cost?fycd=${fiscalYear}`,
  );

  if (!response.ok) {
    throw new Error(`Schedule D (1) API failed: HTTP ${response.status}`);
  }

  const data = await response.json();

  const accounts = (data.accounts || []).map((item) => {
    const perGL = item.endingBalance || 0;
    const adjustment = 0;
    const claimed = perGL + adjustment;

    return {
      account: item.acctId,
      description: item.acctName ? item.acctName.trim() : "",
      perGLRaw: perGL,
      adjustmentRaw: adjustment,
      claimedRaw: claimed,
      notes: "",
      reference: "",
    };
  });

  const allocation = data.allocation || {};

  const allocationData = {
    rows: allocation.rows || [],
    totals: {
      totalBaseLaborDollars: allocation.totalBaseLaborDollars || 0,
      totalPercentage: allocation.totalPercentage || 100,
      totalClaimedExpenseAllocation:
        allocation.totalClaimedExpenseAllocation || 0,
      totalAllocationBasedOnGlAmounts:
        allocation.totalAllocationBasedOnGlAmounts || 0,
    },
  };

  return {
    accounts,
    allocation: allocationData,
  };
}

// =============================================================
// SCHEDULE D (1)
// =============================================================

async function addScheduleD1(
  workbook,
  {
    sheetName = "SCHEDULE D (1)",
    scheduleName = "SCHEDULE D (1)",
    sectionTitle = "AERO Fringe",
    companyName = "",
    companyAddress = "",
    getData = getScheduleD1Data,
  } = {},
) {
  const { accounts, allocation } = await getData(FISCAL_YEAR);

  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.views = [{ showGridLines: false }];

  worksheet.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.columns = [
    { width: 22 }, // A
    { width: 30 }, // B
    { width: 17 }, // C
    { width: 15 }, // D
    { width: 18 }, // E
    { width: 18 }, // F
    { width: 8 }, // G - TO
    { width: 16 }, // H - Reference
  ];

  // =========================================================
  // COLORS
  // FIX: JSX uses TWO different blue buttons — ReferenceBox
  // (bg-blue-800, only for the account table's "Sched A") and
  // AllocationReference (#1717b9, everything in the allocation
  // section). Split into two constants instead of one.
  // =========================================================

  const YELLOW = "FFFF00";
  const CYAN = "28C3C8";
  const BLACK = "000000";
  const WHITE = "FFFFFF";
  const BLUE_ALLOCATION = "1717B9"; // AllocationReference — allocation section buttons
  const BLUE_ACCOUNT = "1E40AF"; // ReferenceBox (tailwind blue-800) — account table's "Sched A" only
  const BLUE_ICE_LINK = "1E40AF"; // text-blue-800 for the "ICE MANUAL" label

  const thinBlackBorder = { style: "thin", color: { argb: BLACK } };

  // =========================================================
  // HELPERS
  // =========================================================

  const formatNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value)) ||
      Number(value) === 0
    ) {
      return "-";
    }
    return Math.round(Number(value));
  };

  const setFont = (cell, options = {}) => {
    cell.font = { name: "Arial", size: 9, color: { argb: BLACK }, ...options };
  };

  const setCenter = (cell) => {
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
  };

  const setRight = (cell) => {
    cell.alignment = { horizontal: "right", vertical: "middle" };
  };

  const setLeft = (cell) => {
    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
  };

  const setYellow = (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: YELLOW },
    };
  };

  const setCyan = (cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CYAN } };
  };

  // =========================================================
  // BLUE REFERENCE BUTTON
  // FIX: now takes a color, so the account-table "Sched A"
  // button can use blue-800 while allocation buttons use #1717b9,
  // matching ReferenceBox vs AllocationReference in the JSX.
  // =========================================================

  const setBlue = (cell, color = BLUE_ALLOCATION) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };

    cell.font = {
      name: "Arial",
      size: 9,
      bold: true,
      underline: true,
      color: { argb: WHITE },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: false,
    };

    cell.border = {
      top: { style: "thin", color: { argb: color } },
      bottom: { style: "thin", color: { argb: color } },
      left: { style: "thin", color: { argb: color } },
      right: { style: "thin", color: { argb: color } },
    };
  };

  const setHatched = (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "darkGrid",
      fgColor: { argb: "666666" },
      bgColor: { argb: "1F1F1F" },
    };
  };

  // =========================================================
  // REFERENCE ROW
  // FIX: now accepts style overrides so the account table's
  // "Sched A" (plain "TO" label, blue-800 button) renders
  // differently from the allocation section's buttons (bold
  // "TO" label, #1717b9 button) — matching the two distinct
  // JSX components instead of collapsing them into one look.
  // =========================================================

  const setToReference = (
    row,
    reference,
    { color = BLUE_ALLOCATION, boldToLabel = true } = {},
  ) => {
    const toCell = worksheet.getCell(row, 7);
    toCell.value = "TO";
    setFont(toCell, { bold: boldToLabel, size: 9 });
    toCell.alignment = { horizontal: "right", vertical: "middle" };

    const referenceCell = worksheet.getCell(row, 8);
    referenceCell.value = reference;
    setBlue(referenceCell, color);
    referenceCell.alignment = { horizontal: "center", vertical: "middle" };
  };

  // =========================================================
  // HEADER
  // =========================================================

  // ---------------------------------------------------------
  // LEFT HEADER
  // FIX: "ICE MANUAL" is styled distinctly (blue-800, underline)
  // in the JSX, separate from the plain black text above it.
  // Using richText to split styling within the merged cell.
  // (No hyperlink target — the JSX itself has no onClick on this
  // label, just the visual link styling.)
  // =========================================================

  worksheet.mergeCells("A1:B3");

  const leftHeaderCell = worksheet.getCell("A1");
  leftHeaderCell.value = {
    richText: [
      {
        font: { name: "Arial", size: 9, color: { argb: BLACK } },
        text: "This Schedule does not contain any links to\nother schedules.\n\n",
      },
      {
        font: {
          name: "Arial",
          size: 9,
          underline: true,
          color: { argb: BLUE_ICE_LINK },
        },
        text: "ICE MANUAL",
      },
    ],
  };

  setLeft(leftHeaderCell);

  // ---------------------------------------------------------
  // COMPANY NAME / ADDRESS
  // ---------------------------------------------------------

  worksheet.mergeCells("C1:F1");
  worksheet.getCell("C1").value = companyName;
  setYellow(worksheet.getCell("C1"));
  setCenter(worksheet.getCell("C1"));
  setFont(worksheet.getCell("C1"), { bold: true, size: 11 });

  worksheet.mergeCells("C2:F2");
  worksheet.getCell("C2").value = companyAddress;
  setYellow(worksheet.getCell("C2"));
  setCenter(worksheet.getCell("C2"));
  setFont(worksheet.getCell("C2"), { bold: true, size: 11 });

  // ---------------------------------------------------------
  // SCHEDULE NAME / ICE VERSION
  // FIX: JSX has both lines as the same small text-xs size,
  // left-aligned (no centering) — was bold/size10/centered
  // for the name and a different size for the version line.
  // ---------------------------------------------------------

  worksheet.getCell("H1").value = scheduleName;
  setFont(worksheet.getCell("H1"), { bold: true, size: 9 });
  setLeft(worksheet.getCell("H1"));

  worksheet.getCell("H2").value = "ICE (version 2.0.1h)";
  setFont(worksheet.getCell("H2"), { bold: true, size: 9 });
  setLeft(worksheet.getCell("H2"));

  // =========================================================
  // SECTION TITLE
  // =========================================================

  worksheet.mergeCells("B5:F5");
  worksheet.getCell("B5").value = `${sectionTitle} (final indirect cost pool)`;
  setFont(worksheet.getCell("B5"), { bold: true, italic: true, size: 11 });
  setCenter(worksheet.getCell("B5"));

  worksheet.mergeCells("B6:F6");
  worksheet.getCell("B6").value = sectionTitle;
  setYellow(worksheet.getCell("B6"));
  setCenter(worksheet.getCell("B6"));
  setFont(worksheet.getCell("B6"), { bold: true, size: 11 });

  worksheet.mergeCells("B7:F7");
  worksheet.getCell("B7").value = `Fiscal Year End - 12/31/${FISCAL_YEAR}`;
  setYellow(worksheet.getCell("B7"));
  setCenter(worksheet.getCell("B7"));
  setFont(worksheet.getCell("B7"), { bold: true, size: 11 });

  // =========================================================
  // ACCOUNT TABLE HEADER
  // =========================================================

  let rowNumber = 9;

  const accountHeaders = [
    "ACCOUNT\nNUMBER",
    "DESCRIPTION",
    "PER G/L\n& TRIAL BAL/F.S",
    "ADJUSTMENT",
    "CLAIMED",
    "",
    "NOTES",
    "REFERENCE",
  ];

  accountHeaders.forEach((header, index) => {
    const cell = worksheet.getCell(rowNumber, index + 1);
    cell.value = header;
    setFont(cell, { bold: true, size: 9 });
    setCenter(cell);
    cell.border = { bottom: thinBlackBorder };
  });

  worksheet.getRow(rowNumber).height = 32;

  rowNumber++;

  // =========================================================
  // ACCOUNT DATA
  // =========================================================

  let totalPerGL = 0;
  let totalAdjustment = 0;
  let totalClaimed = 0;

  accounts.forEach((row) => {
    const currentRow = worksheet.getRow(rowNumber);

    currentRow.getCell(1).value = row.account || "";
    currentRow.getCell(2).value = row.description || "";
    currentRow.getCell(3).value = formatNumber(row.perGLRaw);
    currentRow.getCell(4).value =
      row.adjustmentRaw === 0 ? "" : formatNumber(row.adjustmentRaw);
    currentRow.getCell(5).value = formatNumber(row.claimedRaw);
    currentRow.getCell(6).value = "";
    currentRow.getCell(7).value = row.notes || "";
    currentRow.getCell(8).value = row.reference || "";

    setLeft(currentRow.getCell(1));
    setLeft(currentRow.getCell(2));
    setRight(currentRow.getCell(3));
    setRight(currentRow.getCell(4));
    setRight(currentRow.getCell(5));
    setLeft(currentRow.getCell(7));
    setLeft(currentRow.getCell(8));

    setCyan(currentRow.getCell(5));

    for (let col = 1; col <= 8; col++) {
      setFont(currentRow.getCell(col), { size: 9 });
    }

    totalPerGL += Number(row.perGLRaw || 0);
    totalAdjustment += Number(row.adjustmentRaw || 0);
    totalClaimed += Number(row.claimedRaw || 0);

    rowNumber++;
  });

  // =========================================================
  // TOTAL SEPARATOR
  // =========================================================

  for (let col = 3; col <= 5; col++) {
    worksheet.getCell(rowNumber, col).border = { bottom: thinBlackBorder };
  }

  rowNumber++;

  // =========================================================
  // TOTAL
  // =========================================================

  worksheet.getCell(rowNumber, 2).value = "Total";
  setFont(worksheet.getCell(rowNumber, 2), { bold: true, size: 9 });

  worksheet.getCell(rowNumber, 3).value = formatNumber(totalPerGL);
  worksheet.getCell(rowNumber, 4).value =
    totalAdjustment === 0 ? "-" : formatNumber(totalAdjustment);
  worksheet.getCell(rowNumber, 5).value = formatNumber(totalClaimed);

  for (let col = 3; col <= 5; col++) {
    setCyan(worksheet.getCell(rowNumber, col));
    setRight(worksheet.getCell(rowNumber, col));
    setFont(worksheet.getCell(rowNumber, col), { size: 9 });
  }

  // =========================================================
  // TOTAL W / ALLOC.
  // =========================================================

  rowNumber += 2;

  worksheet.getCell(rowNumber, 2).value = "Total W / Alloc.";
  setFont(worksheet.getCell(rowNumber, 2), { bold: true, size: 9 });

  worksheet.getCell(rowNumber, 3).value = formatNumber(totalPerGL);
  worksheet.getCell(rowNumber, 4).value =
    totalAdjustment === 0 ? "-" : formatNumber(totalAdjustment);
  worksheet.getCell(rowNumber, 5).value = formatNumber(totalClaimed);

  for (let col = 3; col <= 5; col++) {
    setCyan(worksheet.getCell(rowNumber, col));
    setRight(worksheet.getCell(rowNumber, col));
    worksheet.getCell(rowNumber, col).border = { bottom: thinBlackBorder };
    setFont(worksheet.getCell(rowNumber, col), { size: 9 });
  }

  // ---------------------------------------------------------
  // TO SCHED A (account table)
  // FIX: uses blue-800 + plain "TO" label, matching ReferenceBox
  // (distinct from the allocation section's AllocationReference)
  // ---------------------------------------------------------

  setToReference(rowNumber, "Sched A", {
    color: BLUE_ACCOUNT,
    boldToLabel: false,
  });

  // =========================================================
  // ALLOCATION SECTION TITLE
  // =========================================================

  rowNumber += 4;

  worksheet.getCell(rowNumber, 1).value = "Allocation of Expenses Based on";
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  rowNumber++;

  worksheet.getCell(rowNumber, 1).value = "Straight-Time Labor Dollars";
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  rowNumber += 2;

  // =========================================================
  // ALLOCATION HEADER
  // =========================================================

  const allocationHeaders = [
    "",
    "Base\n$",
    "% of\nTotal",
    "Adjustments",
    "Claimed\nExpense\nAllocation",
    "Allocation\nof Amts per\nG/L",
  ];

  allocationHeaders.forEach((header, index) => {
    const cell = worksheet.getCell(rowNumber, index + 1);
    cell.value = header;
    setFont(cell, { bold: true, size: 9 });
    setCenter(cell);
    cell.border = { bottom: thinBlackBorder };
  });

  worksheet.getRow(rowNumber).height = 45;

  rowNumber++;

  // =========================================================
  // SAME SECTIONS AS JSX
  // =========================================================

  const sections = [
    {
      title: "G & A",
      navLabel: "Sched B",
      items: [{ label: "Amount", nameMatch: "G & A" }],
    },
    {
      title: "O/H - OH - Onsite",
      navLabel: "Sched C (1)",
      items: [
        { label: "Indirect Labor", nameMatch: "Indirect labor" },
        { label: "Direct Labor Amount", nameMatch: "Direct Labor Amount" },
        { label: "Direct NonReim Labor", nameMatch: "Direct NonReim Labor" },
      ],
    },
    {
      title: "O/H - OH - Offsite",
      navLabel: "Sched C (2)",
      items: [{ label: "Amount", nameMatch: "O/H - OH - Offsite" }],
    },
    {
      title: "O/H - SM&H",
      navLabel: "Sched C (6)",
      items: [{ label: "Amount", nameMatch: "O/H - SM&H" }],
    },
    {
      title: "Alloc to Other Intermed. Pools:",
      navLabel: "Sched D (2)",
      items: [{ label: "California - Interm", nameMatch: "California" }],
    },
  ];

  const findAllocationRow = (item) => {
    return (
      allocation.rows.find(
        (r) =>
          r.subname?.toLowerCase().includes(item.nameMatch.toLowerCase()) ||
          r.name?.toLowerCase().includes(item.nameMatch.toLowerCase()),
      ) || {}
    );
  };

  // =========================================================
  // ALLOCATION SECTIONS
  // =========================================================

  sections.forEach((section) => {
    const sectionRow = worksheet.getRow(rowNumber);

    sectionRow.getCell(1).value = section.title;
    setYellow(sectionRow.getCell(1));
    setFont(sectionRow.getCell(1), { bold: true, size: 9 });
    setLeft(sectionRow.getCell(1));

    for (let col = 2; col <= 6; col++) {
      setHatched(sectionRow.getCell(col));
    }

    // Allocation-section buttons always use BLUE_ALLOCATION + bold TO
    setToReference(rowNumber, section.navLabel);

    sectionRow.height = 22;

    rowNumber++;

    section.items.forEach((item) => {
      const data = findAllocationRow(item);
      const currentRow = worksheet.getRow(rowNumber);

      currentRow.getCell(1).value = item.label;
      setYellow(currentRow.getCell(1));
      setFont(currentRow.getCell(1), { size: 9 });
      setLeft(currentRow.getCell(1));

      currentRow.getCell(2).value = formatNumber(data.baseLaborDollars);

      // FIX: percentage now matches the JSX's plain display
      // (e.g. 12.34 -> "12.34%") instead of dividing by 100
      // and using a literal-text "%" format, which produced
      // values 100x too small.
      const percentage =
        data.percentageOfTotal !== undefined && data.percentageOfTotal !== null
          ? Number(data.percentageOfTotal)
          : 0;

      currentRow.getCell(3).value = percentage;
      currentRow.getCell(3).numFmt = '0.00"%"';

      currentRow.getCell(4).value = data.adjustments
        ? formatNumber(data.adjustments)
        : "";

      currentRow.getCell(5).value = formatNumber(data.claimedExpenseAllocation);
      currentRow.getCell(6).value = formatNumber(
        data.allocationBasedOnGlAmounts,
      );

      for (let col = 2; col <= 6; col++) {
        setRight(currentRow.getCell(col));
        setFont(currentRow.getCell(col), { size: 9 });
      }

      setCyan(currentRow.getCell(3));
      setCyan(currentRow.getCell(5));
      setCyan(currentRow.getCell(6));

      rowNumber++;
    });
  });

  // =========================================================
  // ALLOCATION TOTAL
  // =========================================================

  rowNumber++;

  const totalAllocationRow = worksheet.getRow(rowNumber);

  totalAllocationRow.getCell(2).value = formatNumber(
    allocation.totals.totalBaseLaborDollars,
  );

  // FIX: JSX uses a truthy fallback here ("totals.totalPercentage ?
  // ... : 100.00%"), so a 0 falls back to 100, unlike the item-row
  // check above which treats 0 as a real value. Matching that
  // (probably-unintentional) JSX behavior exactly. Also removed
  // the incorrect /100 division — see fix above.
  const totalPercentage = Number(allocation.totals.totalPercentage) || 100;

  totalAllocationRow.getCell(3).value = totalPercentage;
  totalAllocationRow.getCell(3).numFmt = '0.00"%"';

  totalAllocationRow.getCell(4).value = "";

  totalAllocationRow.getCell(5).value = formatNumber(
    allocation.totals.totalClaimedExpenseAllocation,
  );

  totalAllocationRow.getCell(6).value = formatNumber(
    allocation.totals.totalAllocationBasedOnGlAmounts,
  );

  // FIX: JSX's totals row leaves the Adjustments column (col 4)
  // with no fill at all — only Base/%/Claimed/GL get cyan. The
  // border still spans the full row (the JSX border is on the
  // parent grid, not per-cell), so borders stay on every column.
  for (let col = 2; col <= 6; col++) {
    if (col !== 4) {
      setCyan(totalAllocationRow.getCell(col));
    }

    setRight(totalAllocationRow.getCell(col));

    totalAllocationRow.getCell(col).border = {
      top: thinBlackBorder,
      bottom: thinBlackBorder,
    };

    setFont(totalAllocationRow.getCell(col), { bold: true, size: 9 });
  }

  // Allocation totals' "Sched A" uses AllocationReference styling
  // (BLUE_ALLOCATION, bold TO) — same as the section buttons above,
  // NOT the account table's blue-800 button.
  setToReference(rowNumber, "Sched A");

  // =========================================================
  // EXPLANATORY NOTES
  // =========================================================

  rowNumber += 3;

  worksheet.getCell(rowNumber, 1).value = "Explanatory Notes:";
  setFont(worksheet.getCell(rowNumber, 1), {
    bold: true,
    underline: true,
    size: 9,
  });

  rowNumber++;

  worksheet.mergeCells(rowNumber, 1, rowNumber, 6);

  worksheet.getCell(rowNumber, 1).value =
    "AERO Fringe and associated labors captured separately to burden the projects consistently.";

  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });
  setLeft(worksheet.getCell(rowNumber, 1));

  // =========================================================
  // LEGEND
  // =========================================================

  rowNumber += 3;

  worksheet.mergeCells(rowNumber, 1, rowNumber, 3);
  worksheet.getCell(rowNumber, 1).value = "Linked to Other Worksheet";
  setYellow(worksheet.getCell(rowNumber, 1));
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  rowNumber++;

  worksheet.mergeCells(rowNumber, 1, rowNumber, 3);
  worksheet.getCell(rowNumber, 1).value = "Cell Contains a Formula";
  setCyan(worksheet.getCell(rowNumber, 1));
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  // =========================================================
  // FINAL ROW HEIGHTS
  // =========================================================

  worksheet.getRow(1).height = 20;
  worksheet.getRow(2).height = 20;
  worksheet.getRow(5).height = 20;
  worksheet.getRow(6).height = 20;
  worksheet.getRow(7).height = 20;

  return worksheet;
}

//schedule D (2)

async function getScheduleD2Data(fiscalYear = 2025) {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/scheduleD2_cost?fycd=${fiscalYear}`,
  );

  if (!response.ok) {
    throw new Error(`Schedule D (2) API failed: HTTP ${response.status}`);
  }

  const data = await response.json();

  const accounts = (data.accounts || []).map((item) => {
    const perGL = item.endingBalance || 0;
    const adjustment = 0;
    const claimed = perGL + adjustment;

    return {
      account: item.acctId,
      description: item.acctName ? item.acctName.trim() : "",
      amountRaw: perGL,
      adjustmentRaw: adjustment,
      claimedRaw: claimed,
    };
  });

  const allocation = data.allocation || {};

  const allocationData = {
    rows: allocation.rows || [],
    totals: {
      totalBaseLaborDollars: allocation.totalBaseLaborDollars || 0,
      totalPercentage: allocation.totalPercentage || 100,
      totalClaimedExpenseAllocation:
        allocation.totalClaimedExpenseAllocation || 0,
      totalAllocationBasedOnGlAmounts:
        allocation.totalAllocationBasedOnGlAmounts || 0,
    },
    // NOTE: this correctly comes from the API, unlike the live JSX
    // (SchedD2.jsx) which currently hardcodes
    // `const fringeAllocationAmount = 437526;`. That means the app UI
    // and this Excel export will disagree whenever the real value
    // differs from 437526 — worth fixing the JSX to match this.
    fringeAllocationAmount: allocation.fringeAllocationAmount || 0,
  };

  return {
    accounts,
    allocation: allocationData,
  };
}

async function addScheduleD2(
  workbook,
  {
    fiscalYear = 2025,
    companyName = "",
    companyAddress = "",
    getData = getScheduleD2Data,
  } = {},
) {
  const { accounts, allocation } = await getData(fiscalYear);

  const worksheet = workbook.addWorksheet("SCHEDULE D (2)");

  worksheet.views = [{ showGridLines: false }];

  worksheet.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.columns = [
    { width: 16 },
    { width: 30 },
    { width: 16 },
    { width: 14 },
    { width: 16 },
    { width: 5 },
    { width: 15 },
    { width: 15 },
  ];

  // =========================================================
  // COLORS
  // FIX: JSX uses two distinct blue buttons — ReferenceBox
  // (#1717b7, only for Fringe/Sched A under "Total W / Alloc.")
  // and AllocationReference (#1717b9, everything in the
  // allocation section below). Split into two constants.
  // =========================================================

  const YELLOW = "FFFF00";
  const CYAN = "29C5CA";
  const BLACK = "000000";
  const WHITE = "FFFFFF";
  const BLUE_ALLOCATION = "1717B9"; // AllocationReference
  const BLUE_REFERENCE = "1717B7"; // ReferenceBox
  const BLUE_ICE_LINK = "1E40AF"; // text-blue-800 for the ICE MANUAL label
  const DARK = "1F1F1F";

  const thinBorder = { style: "thin", color: { argb: BLACK } };

  const formatNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value)) ||
      Number(value) === 0
    ) {
      return "-";
    }
    return Math.round(Number(value));
  };

  const setFont = (cell, options = {}) => {
    cell.font = { name: "Arial", size: 9, color: { argb: BLACK }, ...options };
  };

  const setCenter = (cell) => {
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
  };

  const setRight = (cell) => {
    cell.alignment = {
      horizontal: "right",
      vertical: "middle",
      wrapText: true,
    };
  };

  const setLeft = (cell) => {
    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
  };

  const setYellow = (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: YELLOW },
    };
  };

  const setCyan = (cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CYAN } };
  };

  // FIX: now takes a color so callers can pick BLUE_REFERENCE vs
  // BLUE_ALLOCATION, matching ReferenceBox vs AllocationReference.
  const setBlue = (cell, color = BLUE_ALLOCATION) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };

    cell.font = {
      name: "Arial",
      size: 9,
      bold: true,
      underline: "single",
      color: { argb: WHITE },
    };

    setCenter(cell);
  };

  const addBottomBorder = (cell) => {
    cell.border = { ...cell.border, bottom: thinBorder };
  };

  const addTopBottomBorder = (cell) => {
    cell.border = { ...cell.border, top: thinBorder, bottom: thinBorder };
  };

  const setHatched = (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "darkGrid",
      fgColor: { argb: DARK },
      bgColor: { argb: "666666" },
    };
  };

  // =========================================================
  // HEADER
  // FIX: "ICE MANUAL" is a real link in this JSX (onClick ->
  // sched_d1), so wire an actual internal hyperlink, guarded so
  // it doesn't break if that sheet isn't built yet. Also splits
  // the plain text from the link styling via richText, matching
  // the visual distinction in the JSX (the label says "ICE
  // MANUAL" but navigates to Schedule D(1) — that mismatch is in
  // the source JSX itself; replicated faithfully rather than
  // guessing a fix).
  // =========================================================

  worksheet.mergeCells("A1:B3");

  const iceManualTarget = workbook.getWorksheet("SCHEDULE D (1)")
    ? "#'SCHEDULE D (1)'!A1"
    : null;

  const leftHeaderCell = worksheet.getCell("A1");
  leftHeaderCell.value = {
    richText: [
      {
        font: { name: "Arial", size: 9, color: { argb: BLACK } },
        text: "Schedule D(2) is linked to the following\nSchedule D(x)\n\n",
      },
      {
        font: {
          name: "Arial",
          size: 9,
          underline: true,
          color: { argb: BLUE_ICE_LINK },
        },
        text: "ICE MANUAL",
      },
    ],
  };

  setLeft(leftHeaderCell);

  if (iceManualTarget) {
    leftHeaderCell.value = {
      ...leftHeaderCell.value,
      hyperlink: iceManualTarget,
    };
  }

  /* Company */

  worksheet.mergeCells("C1:F1");
  worksheet.getCell("C1").value = companyName;
  setYellow(worksheet.getCell("C1"));
  setCenter(worksheet.getCell("C1"));
  setFont(worksheet.getCell("C1"), { bold: true, size: 11 });

  worksheet.mergeCells("C2:F2");
  worksheet.getCell("C2").value = companyAddress;
  setYellow(worksheet.getCell("C2"));
  setCenter(worksheet.getCell("C2"));
  setFont(worksheet.getCell("C2"), { bold: true, size: 11 });

  /* Schedule title
     FIX: JSX renders this as plain small bold text (text-[12px]
     font-bold), not centered/size-10. */

  worksheet.getCell("H1").value = "SCHEDULE D (2)";
  setFont(worksheet.getCell("H1"), { bold: true, size: 9 });
  setLeft(worksheet.getCell("H1"));

  worksheet.getCell("H2").value = "ICE (version 2.0.1h)";
  setFont(worksheet.getCell("H2"), { bold: true, size: 9 });
  setLeft(worksheet.getCell("H2"));

  /* Pool title */

  worksheet.mergeCells("B5:F5");
  worksheet.getCell("B5").value = "Intermediate Indirect Cost Pool";
  setFont(worksheet.getCell("B5"), { bold: true, italic: true, size: 11 });
  setCenter(worksheet.getCell("B5"));

  worksheet.mergeCells("B6:F6");
  worksheet.getCell("B6").value = "California Intermediate Ind. Pool";
  setYellow(worksheet.getCell("B6"));
  setCenter(worksheet.getCell("B6"));
  setFont(worksheet.getCell("B6"), { bold: true, size: 11 });

  worksheet.mergeCells("B7:F7");
  worksheet.getCell("B7").value = `Fiscal Year End - 12/31/${fiscalYear}`;
  setYellow(worksheet.getCell("B7"));
  setCenter(worksheet.getCell("B7"));
  setFont(worksheet.getCell("B7"), { bold: true, size: 11 });

  // =========================================================
  // ACCOUNT TABLE HEADER
  // =========================================================

  const headerRow = 9;

  const headers = [
    "ACCOUNT\nNUMBER",
    "DESCRIPTION",
    "PER G/L\nTRIAL BAL/F.S",
    "ADJUSTMENT",
    "CLAIMED",
    "",
    "NOTES",
    "REFERENCE",
  ];

  headers.forEach((header, index) => {
    const cell = worksheet.getCell(headerRow, index + 1);
    cell.value = header;
    setFont(cell, { bold: true, size: 9 });
    setCenter(cell);
    addBottomBorder(cell);
  });

  // =========================================================
  // ACCOUNT DATA
  // =========================================================

  let rowNumber = headerRow + 1;

  let totalAmount = 0;
  let totalAdjustment = 0;
  let totalClaimed = 0;

  accounts.forEach((row) => {
    const currentRow = worksheet.getRow(rowNumber);

    currentRow.getCell(1).value = row.account || "";
    currentRow.getCell(2).value = row.description || "";
    currentRow.getCell(3).value = formatNumber(row.amountRaw);
    currentRow.getCell(4).value =
      row.adjustmentRaw === 0 ? "" : formatNumber(row.adjustmentRaw);
    currentRow.getCell(5).value = formatNumber(row.claimedRaw);

    setLeft(currentRow.getCell(1));
    setLeft(currentRow.getCell(2));
    setRight(currentRow.getCell(3));
    setRight(currentRow.getCell(4));
    setRight(currentRow.getCell(5));

    setCyan(currentRow.getCell(5));
    setCyan(currentRow.getCell(6));

    for (let col = 1; col <= 8; col++) {
      setFont(currentRow.getCell(col), { size: 9 });
    }

    totalAmount += Number(row.amountRaw || 0);
    totalAdjustment += Number(row.adjustmentRaw || 0);
    totalClaimed += Number(row.claimedRaw || 0);

    rowNumber++;
  });

  // =========================================================
  // TOTAL
  // FIX: the top border now lands on the SAME row as the Total
  // values (cols 3–6), matching the JSX's border-t on that row
  // directly, instead of on an empty row above it.
  // =========================================================

  worksheet.getCell(rowNumber, 2).value = "Total";
  setFont(worksheet.getCell(rowNumber, 2), { bold: true, size: 9 });

  worksheet.getCell(rowNumber, 3).value = formatNumber(totalAmount);
  worksheet.getCell(rowNumber, 4).value = formatNumber(totalAdjustment);
  worksheet.getCell(rowNumber, 5).value = formatNumber(totalClaimed);

  for (let col = 3; col <= 6; col++) {
    setCyan(worksheet.getCell(rowNumber, col));
    setRight(worksheet.getCell(rowNumber, col));
    setFont(worksheet.getCell(rowNumber, col), { size: 9 });

    worksheet.getCell(rowNumber, col).border = { top: thinBorder };
  }

  // =========================================================
  // ADD: INTERMEDIATE POOL ALLOCATIONS
  // =========================================================

  rowNumber++;

  worksheet.getCell(rowNumber, 2).value = "ADD: Intermediate Pool Allocations";
  setFont(worksheet.getCell(rowNumber, 2), { bold: true, size: 9 });

  for (let col = 4; col <= 6; col++) {
    setHatched(worksheet.getCell(rowNumber, col));
  }

  // =========================================================
  // FRINGE ALLOCATION — API VALUE ONLY
  // =========================================================

  const fringeAllocationAmount = Number(allocation.fringeAllocationAmount || 0);

  rowNumber++;

  worksheet.getCell(rowNumber, 2).value = "ADD: Fringe Allocation";
  setFont(worksheet.getCell(rowNumber, 2), { bold: true, size: 9 });

  worksheet.getCell(rowNumber, 3).value = formatNumber(fringeAllocationAmount);
  worksheet.getCell(rowNumber, 4).value = "-";
  worksheet.getCell(rowNumber, 5).value = formatNumber(fringeAllocationAmount);

  setYellow(worksheet.getCell(rowNumber, 3));
  setCyan(worksheet.getCell(rowNumber, 4));
  setYellow(worksheet.getCell(rowNumber, 5));

  setRight(worksheet.getCell(rowNumber, 3));
  setRight(worksheet.getCell(rowNumber, 4));
  setRight(worksheet.getCell(rowNumber, 5));

  setCyan(worksheet.getCell(rowNumber, 6));

  // =========================================================
  // TOTAL WITH ALLOCATION
  // FIX: "Fringe" and "TO / Sched A" now live in column 8 only,
  // stacked across two rows (column 7 stays empty on the Fringe
  // row) — matching the JSX's flex-col stack inside a single
  // grid cell, instead of being smushed into one "TO Sched A"
  // string in the wrong column.
  // =========================================================

  const totalWithAllocAmount = totalAmount + fringeAllocationAmount;
  const totalWithAllocClaimed = totalClaimed + fringeAllocationAmount;

  rowNumber++;

  const totalWithAllocRow = rowNumber;

  worksheet.getCell(rowNumber, 2).value = "Total W / Alloc.";
  setFont(worksheet.getCell(rowNumber, 2), { bold: true, size: 9 });

  worksheet.getCell(rowNumber, 3).value = formatNumber(totalWithAllocAmount);
  worksheet.getCell(rowNumber, 4).value = "-";
  worksheet.getCell(rowNumber, 5).value = formatNumber(totalWithAllocClaimed);

  for (let col = 3; col <= 6; col++) {
    setCyan(worksheet.getCell(rowNumber, col));
    setRight(worksheet.getCell(rowNumber, col));
    worksheet.getCell(rowNumber, col).border = { bottom: thinBorder };
  }

  // Fringe button — column 8 only, ReferenceBox color (#1717b7)
  worksheet.getCell(totalWithAllocRow, 8).value = "Fringe";
  setBlue(worksheet.getCell(totalWithAllocRow, 8), BLUE_REFERENCE);

  // TO / Sched A — stacked on the row below, matching JSX's
  // second flex-col line ("TO" label + button)
  const schedARow = totalWithAllocRow + 1;

  worksheet.getCell(schedARow, 7).value = "TO";
  setFont(worksheet.getCell(schedARow, 7), { size: 9 });
  setCenter(worksheet.getCell(schedARow, 7));

  worksheet.getCell(schedARow, 8).value = "Sched A";
  setBlue(worksheet.getCell(schedARow, 8), BLUE_REFERENCE);

  // =========================================================
  // ALLOCATION SECTION
  // =========================================================

  rowNumber = totalWithAllocRow + 4;

  worksheet.getCell(rowNumber, 1).value = "Allocation of Expenses Based on";
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  rowNumber++;

  worksheet.getCell(rowNumber, 1).value = "Payroll";
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  rowNumber += 2;

  // =========================================================
  // ALLOCATION HEADER
  // =========================================================

  const allocationHeaderRow = rowNumber;

  const allocationHeaders = [
    "",
    "Base\n$",
    "% of\nTotal",
    "Adjustments",
    "Claimed\nExpense\nAllocation",
    "Allocation\nof Amts per\nG/L",
    "",
    "",
  ];

  allocationHeaders.forEach((header, index) => {
    const cell = worksheet.getCell(allocationHeaderRow, index + 1);
    cell.value = header;
    setFont(cell, { bold: true, size: 9 });
    setCenter(cell);
    addBottomBorder(cell);
  });

  rowNumber++;

  // =========================================================
  // SECTIONS
  // =========================================================

  const sections = [
    {
      title: "G & A",
      navLabel: "Sched B",
      items: [{ label: "Amount", nameMatch: "G&A" }],
    },
    {
      title: "O/H - OH - Onsite",
      navLabel: "Sched C (1)",
      items: [
        {
          label: "Direct Labor & Fringe Allocation Amount",
          nameMatch: "O/H - OH - Onsite",
        },
      ],
    },
    {
      title: "O/H - OH - Offsite",
      navLabel: "Sched C (2)",
      items: [
        {
          label: "Direct Labor & Fringe Allocation Amount",
          nameMatch: "O/H - OH - Offsite",
        },
      ],
    },
    {
      title: "O/H - SM&H",
      navLabel: "Sched C (6)",
      items: [{ label: "Amount", nameMatch: "O/H - SM&H" }],
    },
  ];

  const findAllocationRow = (item) => {
    return (
      allocation.rows.find(
        (r) =>
          r.name?.toLowerCase().includes(item.nameMatch.toLowerCase()) ||
          r.subname?.toLowerCase().includes(item.nameMatch.toLowerCase()),
      ) || {}
    );
  };

  sections.forEach((section) => {
    const sectionRow = worksheet.getRow(rowNumber);

    sectionRow.getCell(1).value = section.title;
    setYellow(sectionRow.getCell(1));
    setFont(sectionRow.getCell(1), { bold: true, size: 9 });

    sectionRow.getCell(7).value = "TO";
    setFont(sectionRow.getCell(7), { bold: true, size: 9 });
    setCenter(sectionRow.getCell(7));

    sectionRow.getCell(8).value = section.navLabel;
    setBlue(sectionRow.getCell(8), BLUE_ALLOCATION);

    for (let col = 2; col <= 6; col++) {
      setHatched(sectionRow.getCell(col));
    }

    rowNumber++;

    section.items.forEach((item) => {
      const data = findAllocationRow(item);
      const currentRow = worksheet.getRow(rowNumber);

      currentRow.getCell(1).value = item.label;

      currentRow.getCell(2).value = formatNumber(data.baseLaborDollars);

      currentRow.getCell(3).value =
        data.percentageOfTotal !== undefined && data.percentageOfTotal !== null
          ? `${Number(data.percentageOfTotal).toFixed(2)}%`
          : "0.00%";

      currentRow.getCell(4).value = data.adjustments
        ? formatNumber(data.adjustments)
        : "";

      currentRow.getCell(5).value = formatNumber(data.claimedExpenseAllocation);
      currentRow.getCell(6).value = formatNumber(
        data.allocationBasedOnGlAmounts,
      );

      setYellow(currentRow.getCell(1));
      setFont(currentRow.getCell(1), { size: 9 });

      for (let col = 2; col <= 6; col++) {
        setRight(currentRow.getCell(col));
        setFont(currentRow.getCell(col), { size: 9 });
      }

      setCyan(currentRow.getCell(3));
      setCyan(currentRow.getCell(5));
      setCyan(currentRow.getCell(6));

      rowNumber++;
    });
  });

  // =========================================================
  // ALLOCATION TOTAL
  // FIX: percentage fallback now matches the JSX's truthy check
  // (a 0 falls back to "100.00%"), not just an undefined check.
  // =========================================================

  rowNumber++;

  const totalAllocationRow = worksheet.getRow(rowNumber);

  totalAllocationRow.getCell(2).value = formatNumber(
    allocation.totals.totalBaseLaborDollars,
  );

  totalAllocationRow.getCell(3).value = Number(
    allocation.totals.totalPercentage,
  )
    ? `${Number(allocation.totals.totalPercentage).toFixed(2)}%`
    : "100.00%";

  totalAllocationRow.getCell(5).value = formatNumber(
    allocation.totals.totalClaimedExpenseAllocation,
  );

  totalAllocationRow.getCell(6).value = formatNumber(
    allocation.totals.totalAllocationBasedOnGlAmounts,
  );

  for (let col = 2; col <= 6; col++) {
    setCyan(totalAllocationRow.getCell(col));
    setRight(totalAllocationRow.getCell(col));
    addTopBottomBorder(totalAllocationRow.getCell(col));
    setFont(totalAllocationRow.getCell(col), { bold: true, size: 9 });
  }

  totalAllocationRow.getCell(7).value = "TO";
  setFont(totalAllocationRow.getCell(7), { bold: true, size: 9 });
  setCenter(totalAllocationRow.getCell(7));

  totalAllocationRow.getCell(8).value = "Sched A";
  setBlue(totalAllocationRow.getCell(8), BLUE_ALLOCATION);

  // =========================================================
  // EXPLANATORY NOTES
  // =========================================================

  rowNumber += 3;

  worksheet.getCell(rowNumber, 1).value = "Explanatory Notes:";
  setFont(worksheet.getCell(rowNumber, 1), {
    bold: true,
    underline: "single",
    size: 9,
  });

  rowNumber++;

  worksheet.mergeCells(rowNumber, 1, rowNumber, 6);
  worksheet.getCell(rowNumber, 1).value =
    "To Split the California OH cost based on Direct Labor-Fringe on Direct Labor for Onsite and Offsite";
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  // =========================================================
  // LEGEND
  // =========================================================

  rowNumber += 3;

  worksheet.mergeCells(rowNumber, 1, rowNumber, 3);
  worksheet.getCell(rowNumber, 1).value = "Linked to Other Worksheet";
  setYellow(worksheet.getCell(rowNumber, 1));
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  rowNumber++;

  worksheet.mergeCells(rowNumber, 1, rowNumber, 3);
  worksheet.getCell(rowNumber, 1).value = "Cell Contains a Formula";
  setCyan(worksheet.getCell(rowNumber, 1));
  setFont(worksheet.getCell(rowNumber, 1), { size: 9 });

  return worksheet;
}

// =========================================================
// SCHEDULE E - API DATA
// =========================================================

const getScheduleEData = async (year = 2025) => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/scheduleDE_cost?fyCd=${year}`,
  );

  if (!response.ok) {
    throw new Error(`Schedule E API failed: ${response.status}`);
  }

  const data = await response.json();

  const schedules = data.schedules || [];

  // Same mapping as ScheduleE.jsx
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

  return mapped;
};

// =========================================================
// SCHEDULE E
// =========================================================

const addScheduleE = async (
  workbook,
  { companyName = "", companyAddress = "", year = 2025 } = {},
) => {
  // =======================================================
  // GET SAME API DATA AS JSX
  // =======================================================

  const data = await getScheduleEData(year);

  // =======================================================
  // CREATE WORKSHEET
  // =======================================================

  const ws = workbook.addWorksheet("Schedule E");

  // =======================================================
  // PAGE SETUP
  // =======================================================

  ws.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.35,
      bottom: 0.35,
      header: 0.1,
      footer: 0.1,
    },
  };

  ws.properties.defaultRowHeight = 18;

  // =======================================================
  // COLUMN WIDTHS
  // =======================================================

  ws.columns = [
    { width: 34 }, // A - Label
    { width: 21 }, // B - Per G/L
    { width: 21 }, // C - Adjustment
    { width: 21 }, // D - Claimed
    { width: 10 }, // E - Notes
    { width: 20 }, // F - Reference
  ];

  // =======================================================
  // COLORS
  // =======================================================

  const YELLOW = "FFFF00";
  const TEAL = "28C4C8";
  const BLUE = "1717B8";
  const LIGHT_BLUE = "CFE7E9";

  const thinBlack = { style: "thin", color: { argb: "000000" } };
  const borderBottom = { bottom: thinBlack };
  const borderTopBottom = { top: thinBlack, bottom: thinBlack };

  // =======================================================
  // HELPERS
  // =======================================================

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number.isNaN(Number(value))
    ) {
      return "-";
    }
    if (Number(value) === 0) return "-";
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatRate = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number.isNaN(Number(value))
    ) {
      return "-";
    }
    return `${Number(value).toFixed(2)}%`;
  };

  const getMetric = (schedName, subName, isRate = false) => {
    const sched = data[schedName] || data[schedName?.replace("&", " & ")];
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

  const setDisplayValue = (cell, value, fill = null, horizontal = "right") => {
    cell.value = value === null || value === undefined ? "" : value;

    cell.font = { name: "Arial", size: 10 };

    cell.alignment = { horizontal, vertical: "center", wrapText: true };

    if (fill) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fill },
      };
    }
  };

  const setLabel = (cell, value, bold = false) => {
    cell.value = value;
    cell.font = { name: "Arial", size: 10, bold };
    cell.alignment = { vertical: "center", wrapText: true };
  };

  const setHeader = (cell, value) => {
    cell.value = value;
    cell.font = { name: "Arial", size: 10, bold: true };
    cell.alignment = {
      horizontal: "center",
      vertical: "center",
      wrapText: true,
    };
  };

  const setReference = (cell, value) => {
    cell.value = value;
    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      underline: true,
      color: { argb: "FFFFFF" },
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "center",
      wrapText: true,
    };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BLUE } };
    cell.border = {
      top: { style: "thin", color: { argb: BLUE } },
      bottom: { style: "thin", color: { argb: BLUE } },
      left: { style: "thin", color: { argb: BLUE } },
      right: { style: "thin", color: { argb: BLUE } },
    };
  };

  // =======================================================
  // TOP HEADER
  // =======================================================

  ws.mergeCells("A1:A4");
  ws.getCell("A1").value =
    "Schedule E is linked to the following\n" +
    "schedules:\n" +
    "Summary Sched H\n" +
    "Sched H, Contract Costs\n" +
    "Schedule C(x), Overhead\n" +
    "Schedule B, G&A\n\n" +
    "ICE MANUAL";
  ws.getCell("A1").font = { name: "Arial", size: 9 };
  ws.getCell("A1").alignment = { vertical: "top", wrapText: true };

  ws.mergeCells("B1:E1");
  ws.getCell("B1").value =
    companyName || import.meta.env?.VITE_COMPANY_NAME || "Revolve FinTech LLC";
  ws.getCell("B1").font = { name: "Arial", size: 11, bold: true };
  ws.getCell("B1").alignment = { horizontal: "center", vertical: "center" };
  ws.getCell("B1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: YELLOW },
  };

  ws.mergeCells("B2:E2");
  ws.getCell("B2").value =
    companyAddress ||
    import.meta.env?.VITE_COMPANY_ADDRESS ||
    "Vienna, VA 22182";
  ws.getCell("B2").font = { name: "Arial", size: 11, bold: true };
  ws.getCell("B2").alignment = { horizontal: "center", vertical: "center" };
  ws.getCell("B2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: YELLOW },
  };

  ws.mergeCells("B3:E3");
  ws.getCell("B3").value =
    "Claimed Allocation Bases by element of cost used to distribute indirect costs";
  ws.getCell("B3").font = { name: "Arial", size: 10, bold: true };
  ws.getCell("B3").alignment = {
    horizontal: "center",
    vertical: "center",
    wrapText: true,
  };

  ws.mergeCells("B4:E4");
  ws.getCell("B4").value = `Fiscal Year End - 12/31/${year}`;
  ws.getCell("B4").font = { name: "Arial", size: 10, bold: true };
  ws.getCell("B4").alignment = { horizontal: "center", vertical: "center" };
  ws.getCell("B4").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: YELLOW },
  };

  ws.getCell("F1").value = "SCHEDULE E";
  ws.getCell("F1").font = { name: "Arial", size: 10, bold: true };
  ws.getCell("F1").alignment = { horizontal: "left", vertical: "top" };

  ws.getCell("F2").value = "ICE (version 2.0.1h)";
  ws.getCell("F2").font = { name: "Arial", size: 10 };
  ws.getCell("F2").alignment = { horizontal: "left", vertical: "top" };

  ws.getRow(1).height = 22;
  ws.getRow(2).height = 22;
  ws.getRow(3).height = 25;
  ws.getRow(4).height = 22;

  // =======================================================
  // COMMON POOL HEADER
  // =======================================================

  const addPoolHeader = (rowNumber, title) => {
    const row = ws.getRow(rowNumber);
    row.height = 34;

    setHeader(row.getCell(1), title);
    row.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: LIGHT_BLUE },
    };
    row.getCell(1).font = {
      name: "Arial",
      size: 13,
      bold: true,
      color: { argb: "0D369B" },
    };

    setHeader(row.getCell(2), "PER G/L, F/S\n& TRIAL BAL/F.S");
    setHeader(row.getCell(3), "PER G/L\nADJUSTMENTS");
    setHeader(row.getCell(4), "CLAIMED");
    setHeader(row.getCell(5), "Notes");
    setHeader(row.getCell(6), "Ref.");

    for (let c = 1; c <= 6; c++) {
      row.getCell(c).border = borderBottom;
    }
  };

  // =======================================================
  // NORMAL METRIC ROW — corrected
  // =======================================================

  const addMetricRow = (
    rowNumber,
    label,
    metric,
    {
      fsFill = YELLOW, // PER G/L column — yellow by default, matching ValueCell's default color
      claimedFill = YELLOW, // override to TEAL for rows where JSX passes color="teal"
      showAdjustment = true, // false when JSX renders a bare <div/> (no value) for Adjustments
      adjustmentFill = YELLOW,
      note = "",
      reference = "",
      bold = false, // JSX: only "Pool"/header summary rows are bold; detail rows are plain
    } = {},
  ) => {
    const row = ws.getRow(rowNumber);

    setLabel(row.getCell(1), label, bold);

    // PER G/L — always filled now
    setDisplayValue(row.getCell(2), metric.trialBal, fsFill);

    // ADJUSTMENT — only written when JSX actually shows a value there
    if (showAdjustment) {
      setDisplayValue(row.getCell(3), metric.adjustment, adjustmentFill);
    } else {
      row.getCell(3).value = "";
    }

    // CLAIMED
    setDisplayValue(row.getCell(4), metric.claimed, claimedFill);

    // NOTES
    setDisplayValue(row.getCell(5), note, null, "center");

    // REFERENCE
    if (reference) {
      setReference(row.getCell(6), reference);
    }

    for (let c = 1; c <= 6; c++) {
      row.getCell(c).border = borderBottom;
    }
  };

  // =======================================================
  // CLAIMED ONLY ROW
  // =======================================================

  const addClaimedOnlyRow = (
    rowNumber,
    label,
    value,
    { fill = YELLOW, note = "", reference = "", bold = false } = {},
  ) => {
    const row = ws.getRow(rowNumber);

    setLabel(row.getCell(1), label, bold);

    row.getCell(2).value = "";
    row.getCell(3).value = "";

    setDisplayValue(row.getCell(4), value, fill);
    setDisplayValue(row.getCell(5), note, null, "center");

    if (reference) {
      setReference(row.getCell(6), reference);
    }

    for (let c = 1; c <= 6; c++) {
      row.getCell(c).border = borderBottom;
    }
  };

  // =======================================================
  // RATE ROW
  // =======================================================

  const addRateRow = (rowNumber, label, metric) => {
    const row = ws.getRow(rowNumber);

    setLabel(row.getCell(1), label, true);
    setDisplayValue(row.getCell(2), metric.trialBal, TEAL);
    row.getCell(3).value = "";
    setDisplayValue(row.getCell(4), metric.claimed, TEAL);
    row.getCell(5).value = "";
    row.getCell(6).value = "";

    row.getCell(1).border = borderBottom;
  };

  // =======================================================
  // TOTAL ROW
  // =======================================================

  const addTotalRow = (rowNumber, label, metric) => {
    const row = ws.getRow(rowNumber);

    setLabel(row.getCell(1), label, true);
    setDisplayValue(row.getCell(2), metric.trialBal, TEAL);
    setDisplayValue(row.getCell(3), metric.adjustment, TEAL);
    setDisplayValue(row.getCell(4), metric.claimed, TEAL);
    row.getCell(5).value = "";
    row.getCell(6).value = "";

    for (let c = 1; c <= 6; c++) {
      row.getCell(c).border = borderTopBottom;
    }
  };

  // =======================================================
  // OH - ONSITE
  // =======================================================

  let r = 6;

  addPoolHeader(r, "OH - Onsite");
  r++;

  addMetricRow(r, "Overhead Pool", getMetric("OH Onsite", "Overhead Pool"), {
    bold: true,
    claimedFill: YELLOW,
    reference: "Sched C (1)",
  });
  r += 2;

  setLabel(ws.getCell(`A${r}`), "Overhead Base:", true);
  ws.getCell(`A${r}`).border = borderBottom;
  r++;

  addMetricRow(
    r,
    "Total Contract Labor",
    getMetric("OH Onsite", "Total Contract Labor"),
    {
      showAdjustment: false,
      claimedFill: TEAL,
    },
  );
  r++;

  addMetricRow(
    r,
    "IR&D Labor",
    { trialBal: "-", adjustment: "-", claimed: "-" },
    {
      showAdjustment: false,
      claimedFill: TEAL,
    },
  );
  r++;

  addMetricRow(
    r,
    "B&P Labor",
    { trialBal: "-", adjustment: "-", claimed: "-" },
    {
      showAdjustment: false,
      claimedFill: TEAL,
    },
  );
  r++;

  addMetricRow(
    r,
    "Fringe on D/L (before adjustments)",
    getMetric("OH Onsite", "Fringe on D/L (before adjustments)"),
    { showAdjustment: false, claimedFill: TEAL },
  );
  r++;

  addTotalRow(
    r,
    "Total Overhead Base",
    getMetric("OH Onsite", "Total Overhead Base"),
  );
  r++;

  addRateRow(r, "Overhead Rate", getMetric("OH Onsite", "Overhead Rate", true));
  r += 2;

  ws.mergeCells(`A${r}:F${r}`);
  ws.getCell(`A${r}`).value =
    "Overhead Base* - Straight time direct labor dollars of all contracts and projects including labor costs of IR&D/B&P projects plus fringe on direct labor.";
  ws.getCell(`A${r}`).font = { name: "Arial", size: 9, bold: true };
  ws.getCell(`A${r}`).alignment = { wrapText: true, vertical: "center" };
  ws.getRow(r).height = 32;

  // =======================================================
  // OH - OFFSITE
  // =======================================================

  r += 2;

  addPoolHeader(r, "OH - Offsite");
  r++;

  addMetricRow(r, "Overhead Pool", getMetric("OH Offsite", "Overhead Pool"), {
    bold: true,
    claimedFill: YELLOW,
    reference: "Sched C (2)",
  });
  r += 2;

  setLabel(ws.getCell(`A${r}`), "Overhead Base:", true);
  ws.getCell(`A${r}`).border = borderBottom;
  r++;

  addMetricRow(
    r,
    "Total Contract Labor",
    getMetric("OH Offsite", "Total Contract Labor"),
    {
      showAdjustment: false,
      claimedFill: TEAL,
    },
  );
  r++;

  addMetricRow(
    r,
    "IR&D Labor",
    { trialBal: "-", adjustment: "-", claimed: "-" },
    {
      showAdjustment: false,
      claimedFill: TEAL,
    },
  );
  r++;

  addMetricRow(
    r,
    "B&P Labor",
    { trialBal: "-", adjustment: "-", claimed: "-" },
    {
      showAdjustment: false,
      claimedFill: TEAL,
    },
  );
  r++;

  addMetricRow(
    r,
    "Fringe on D/L (before adjustments)",
    getMetric("OH Offsite", "Fringe on D/L (before adjustments)"),
    { showAdjustment: false, claimedFill: TEAL },
  );
  r++;

  addTotalRow(
    r,
    "Total Overhead Base",
    getMetric("OH Offsite", "Total Overhead Base"),
  );
  r++;

  addRateRow(
    r,
    "Overhead Rate",
    getMetric("OH Offsite", "Overhead Rate", true),
  );
  r += 2;

  ws.mergeCells(`A${r}:F${r}`);
  ws.getCell(`A${r}`).value =
    "Overhead Base* - Straight time direct labor dollars of all contracts and projects including labor costs of IR&D/B&P projects plus fringe on direct labor.";
  ws.getCell(`A${r}`).font = { name: "Arial", size: 9, bold: true };
  ws.getCell(`A${r}`).alignment = { wrapText: true, vertical: "center" };
  ws.getRow(r).height = 32;

  // =======================================================
  // SM&H
  // =======================================================

  r += 2;

  addPoolHeader(r, "SM&H");
  r++;

  addMetricRow(r, "Overhead Pool", getMetric("SM&H", "Overhead Pool"), {
    bold: true,
    claimedFill: YELLOW,
    reference: "Sched C (6)",
  });
  r += 2;

  addMetricRow(
    r,
    "Total Contract Material & Subcontract",
    getMetric("SM&H", "Total Contract Material & Subcontract"),
    { claimedFill: TEAL, note: "2", reference: "Summary Sched H" },
  );
  r++;

  addTotalRow(
    r,
    "Total Overhead Base",
    getMetric("SM&H", "Total Overhead Base"),
  );
  r++;

  addRateRow(r, "Overhead Rate", getMetric("SM&H", "Overhead Rate", true));
  r++;

  addMetricRow(r, "Fringe Pool", getMetric("Fringe", "Overhead Pool"), {
    bold: true,
    claimedFill: YELLOW,
    reference: "Fringe",
  });

  // =======================================================
  // FRINGE POOL
  // =======================================================

  r += 2;

  setLabel(ws.getCell(`A${r}`), "Fringe Pool:", true);
  ws.getCell(`A${r}`).border = borderBottom;
  r++;

  addMetricRow(r, "G&A Labor", getMetric("Fringe", "G&A Labor"), {
    showAdjustment: false,
    claimedFill: TEAL,
    reference: "Fringe",
  });
  r++;

  addMetricRow(r, "Direct Labor", getMetric("Fringe", "Direct Labor"), {
    showAdjustment: false,
    claimedFill: TEAL,
    reference: '"',
  });
  r++;

  addMetricRow(
    r,
    "Indirect Labor (Overhead Pools)",
    getMetric("Fringe", "Indirect Labor (Overhead Pools)"),
    { showAdjustment: false, claimedFill: TEAL, reference: '"' },
  );
  r++;

  addMetricRow(
    r,
    "Indirect Labor (Intermediate Pools)",
    getMetric("Fringe", "Indirect Labor (Intermediate Pools)"),
    { showAdjustment: false, claimedFill: TEAL, reference: '"' },
  );
  r++;

  addTotalRow(
    r,
    "Total Fringe Base",
    getMetric("Fringe", "Total Overhead Base"),
  );
  r++;

  addRateRow(r, "Fringe Rate", getMetric("Fringe", "Overhead Rate", true));
  r++;

  ws.mergeCells(`A${r}:F${r}`);
  ws.getCell(`A${r}`).value =
    "Fringe Base* - All labor dollars i.e. direct, indirect, and unallowable labor dollars (except AERO division).";
  ws.getCell(`A${r}`).font = { name: "Arial", size: 9, bold: true };
  ws.getCell(`A${r}`).alignment = { wrapText: true, vertical: "center" };
  ws.getRow(r).height = 30;

  // =======================================================
  // AERO FRINGE
  // =======================================================

  r += 2;

  addPoolHeader(r, "AERO Fringe");
  r++;

  addMetricRow(r, "Fringe Pool", getMetric("AERO Fringe", "Overhead Pool"), {
    bold: true,
    claimedFill: YELLOW,
    note: "1",
    reference: "Sched D (1)",
  });
  r += 2;

  setLabel(ws.getCell(`A${r}`), "Fringe Base:", true);
  ws.getCell(`A${r}`).border = borderBottom;
  r++;

  addMetricRow(
    r,
    "G&A Labor",
    { trialBal: "", adjustment: "", claimed: "-" },
    {
      showAdjustment: false,
      claimedFill: TEAL,
      reference: "Sched D (1)",
    },
  );
  r++;

  addMetricRow(r, "Direct Labor", getMetric("AERO Fringe", "Direct Labor"), {
    showAdjustment: false,
    claimedFill: TEAL,
    reference: '"',
  });
  r++;

  addMetricRow(
    r,
    "Indirect Labor (Overhead Pools)",
    getMetric("AERO Fringe", "Indirect Labor (Overhead Pools)"),
    { showAdjustment: false, claimedFill: TEAL, reference: '"' },
  );
  r++;

  addMetricRow(
    r,
    "Indirect Labor (Intermediate Pools)",
    { trialBal: "", adjustment: "", claimed: "-" },
    { showAdjustment: false, claimedFill: TEAL },
  );
  r++;

  addTotalRow(
    r,
    "Total Fringe Base",
    getMetric("AERO Fringe", "Total Overhead Base"),
  );
  r++;

  addRateRow(r, "Fringe Rate", getMetric("AERO Fringe", "Overhead Rate", true));
  r++;

  ws.mergeCells(`A${r}:F${r}`);
  ws.getCell(`A${r}`).value =
    "AERO Fringe Base* - All AERO associated labor dollars i.e. direct, indirect and unallowable labor dollars.";
  ws.getCell(`A${r}`).font = { name: "Arial", size: 9, bold: true };
  ws.getCell(`A${r}`).alignment = { wrapText: true, vertical: "center" };
  ws.getRow(r).height = 30;

  // =======================================================
  // G&A POOL
  // =======================================================

  r += 2;

  addPoolHeader(r, "G&A Pool");
  r++;

  addMetricRow(r, "G & A Base:", getMetric("G&A", "G&A Base:"), {
    bold: true,
    claimedFill: YELLOW,
    reference: "Sched B",
  });
  r += 2;

  setLabel(ws.getCell(`A${r}`), "G & A Base:", true);
  ws.getCell(`A${r}`).border = borderBottom;
  r++;

  addMetricRow(r, "Contract Labor", getMetric("G&A", "Contract Labor"), {
    showAdjustment: false,
    claimedFill: YELLOW,
  });
  r++;

  addMetricRow(r, "Contract Travel", getMetric("G&A", "Contract Travel"), {
    showAdjustment: false,
    claimedFill: YELLOW,
  });
  r++;

  addMetricRow(r, "Contract Material", getMetric("G&A", "Contract Material"), {
    showAdjustment: false,
    claimedFill: YELLOW,
  });
  r++;

  addMetricRow(
    r,
    "Other Direct Costs",
    getMetric("G&A", "Other Direct Costs"),
    {
      showAdjustment: false,
      claimedFill: YELLOW,
    },
  );
  r++;

  addMetricRow(r, "Subcontracts", getMetric("G&A", "Subcontracts"), {
    showAdjustment: true,
    claimedFill: YELLOW,
  });
  r++;

  addTotalRow(
    r,
    "Subtotal = DIRECT COSTS",
    getMetric("G&A", "Subtotal = DIRECT COSTS"),
  );
  r += 2;

  // =======================================================
  // GENERAL LEDGER SECTION
  // =======================================================

  addClaimedOnlyRow(
    r,
    "General Ledger Overhead (before adjustments)",
    getMetric("G&A", "General Ledger Overhead (before adjustments)").claimed,
    { fill: YELLOW, reference: "Sched C (x)" },
  );
  r++;

  addClaimedOnlyRow(
    r,
    "Fringe on Direct Labor (before adjustments)",
    getMetric("G&A", "Fringe on Direct Labor (before adjustments)").claimed,
    { fill: YELLOW, reference: "Sched H" },
  );
  r++;

  addClaimedOnlyRow(r, "IR&D/B&P Fringe transferred to G & A pool.", "-", {
    fill: YELLOW,
  });
  r += 1;

  // =======================================================
  // DEDUCTIONS
  // =======================================================

  addClaimedOnlyRow(r, "Less: IR&D/B&P OH transferred to G & A pool.", "-", {
    fill: YELLOW,
    reference: "SCHED B",
  });
  r++;

  addClaimedOnlyRow(r, "IR&D OH (at G/L rate)", "-", { fill: YELLOW });
  r++;

  addClaimedOnlyRow(r, "B&P OH (at G/L rate)", "", { fill: YELLOW });
  r++;

  addClaimedOnlyRow(
    r,
    "Less: Material related costs to arrive at Value Added base.",
    "",
    { fill: YELLOW },
  );
  r++;

  addClaimedOnlyRow(
    r,
    "Direct Material",
    getMetric("G&A", "Direct Material").claimed,
    {
      fill: YELLOW,
    },
  );
  r++;

  addClaimedOnlyRow(
    r,
    "Subcontracts",
    getMetric("G&A", "Subcontractors").claimed,
    {
      fill: YELLOW,
    },
  );
  r += 1;

  // =======================================================
  // VALUE ADDED BASE
  // =======================================================

  const valueAddedMetric = getMetric("G&A", "G&A Base");
  const valueAddedRow = ws.getRow(r);

  setLabel(
    valueAddedRow.getCell(1),
    "G&A Base - Value Added [excludes IR&D/B&P and COM]",
    true,
  );

  valueAddedRow.getCell(2).value = "";
  valueAddedRow.getCell(3).value = "";

  setDisplayValue(valueAddedRow.getCell(4), valueAddedMetric.claimed, TEAL);

  valueAddedRow.getCell(5).value = "";
  valueAddedRow.getCell(6).value = "";

  for (let c = 1; c <= 6; c++) {
    valueAddedRow.getCell(c).border = borderBottom;
  }

  r += 2;

  // =======================================================
  // G&A RATE
  // =======================================================

  const gaRate = getMetric("G&A", "G&A Rate", true);
  const gaRateRow = ws.getRow(r);

  setLabel(gaRateRow.getCell(1), "G&A Rate", true);
  gaRateRow.getCell(1).border = borderBottom;

  gaRateRow.getCell(2).value = "";
  gaRateRow.getCell(3).value = "";

  setDisplayValue(gaRateRow.getCell(4), gaRate.claimed, TEAL);

  gaRateRow.getCell(5).value = "";
  gaRateRow.getCell(6).value = "";

  // =======================================================
  // EXPLANATORY NOTES
  // =======================================================

  r += 3;

  ws.mergeCells(`A${r}:F${r}`);
  ws.getCell(`A${r}`).value = "Explanatory Notes:";
  ws.getCell(`A${r}`).font = {
    name: "Arial",
    size: 10,
    bold: true,
    underline: true,
  };
  ws.getCell(`A${r}`).alignment = { vertical: "center" };
  r++;

  const notes = [
    "1. AERO Fringe added as per Sched D (1) as it determines a final rate and not working as intermediary pool.",
    "2. Adjustments were made to the Subcontractor and Material Handling (SM&H) base to exclude non-labor flow-through costs, specifically teammate travel, teammate ODC, and teammate fee.",
    "This methodology ensures an equitable allocation of SM&H costs in accordance with FAR 31.203 and the Company's established accounting practices.",
  ];

  notes.forEach((note) => {
    ws.mergeCells(`A${r}:F${r}`);
    ws.getCell(`A${r}`).value = note;
    ws.getCell(`A${r}`).font = { name: "Arial", size: 9 };
    ws.getCell(`A${r}`).alignment = { wrapText: true, vertical: "center" };
    ws.getRow(r).height = 30;
    r++;
  });

  // =======================================================
  // LEGEND
  // =======================================================

  r += 2;

  ws.mergeCells(`A${r}:B${r}`);
  ws.getCell(`A${r}`).value = "Imported from Other Worksheet";
  ws.getCell(`A${r}`).font = { name: "Arial", size: 10 };
  ws.getCell(`A${r}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: YELLOW },
  };
  ws.getCell(`A${r}`).alignment = { horizontal: "left", vertical: "center" };

  r += 2;

  ws.mergeCells(`A${r}:B${r}`);
  ws.getCell(`A${r}`).value = "Cell Contains a Formula";
  ws.getCell(`A${r}`).font = { name: "Arial", size: 10 };
  ws.getCell(`A${r}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: TEAL },
  };
  ws.getCell(`A${r}`).alignment = { horizontal: "left", vertical: "center" };

  // =======================================================
  // GENERAL FORMATTING
  // =======================================================

  ws.eachRow((row) => {
    row.eachCell((cell) => {
      if (!cell.font) {
        cell.font = { name: "Arial", size: 10 };
      }
      cell.alignment = {
        ...cell.alignment,
        vertical: cell.alignment?.vertical || "center",
      };
    });
  });

  // =======================================================
  // FREEZE
  // =======================================================

  ws.views = [{ state: "frozen", ySplit: 5 }];

  // =======================================================
  // PRINT AREA
  // =======================================================

  ws.pageSetup.printArea = `A1:F${r}`;

  return ws;
};

//Fringe

// =============================================================
// FRINGE API DATA
// =============================================================

// =============================================================
// GET FRINGE DATA
// Same API + same mapping as Fringe.jsx
// Missing / invalid numeric values => 0
// =============================================================

const getFringeData = async (year = FISCAL_YEAR) => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/firing-allocation?fyCd=${year}`,
  );

  if (!response.ok) {
    throw new Error(`Fringe API failed: ${response.status}`);
  }

  const data = await response.json();

  // ===========================================================
  // SAFE NUMBER
  // ===========================================================

  const safeNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "-"
    ) {
      return 0;
    }

    const num = Number(value);

    return Number.isFinite(num) ? num : 0;
  };

  // ===========================================================
  // 1. FRINGE COST
  // Same aggregation as Fringe.jsx
  // ===========================================================

  const rawFringeCost = Array.isArray(data?.fringeCost) ? data.fringeCost : [];

  const aggregatedGL = rawFringeCost.reduce((acc, item) => {
    const acctId = item?.acctId || "";

    const endingBal = safeNumber(item?.endingBalance);

    if (!acc[acctId]) {
      acc[acctId] = {
        account: acctId,

        description: item?.acctName ? String(item.acctName).trim() : "",

        perGLRaw: endingBal,

        adjustmentRaw: 0,
      };
    } else {
      acc[acctId].perGLRaw += endingBal;
    }

    return acc;
  }, {});

  const fringeCostData = Object.values(aggregatedGL).map((row) => {
    const perGLRaw = safeNumber(row?.perGLRaw);

    const adjustmentRaw = safeNumber(row?.adjustmentRaw);

    return {
      account: row?.account || "",

      description: row?.description || "",

      perGLRaw,

      adjustmentRaw,

      claimedRaw: perGLRaw + adjustmentRaw,
    };
  });

  // ===========================================================
  // 2. ALLOCATION ROWS
  // ===========================================================

  const rawAllocationRows = Array.isArray(data?.rows) ? data.rows : [];

  // These allocations should always be displayed.
  // If API doesn't return one, use 0.
  const expectedAllocations = [
    {
      name: "G&A Labor",
      subname: "Total Contract Labor",
    },
    {
      name: "O/H - OH - Onsite",
      subname: "Total Contract Labor",
    },
    {
      name: "O/H - OH - Offsite",
      subname: "Total Contract Labor",
    },
    {
      name: "O/H - SM&L",
      subname: "Total Contract Labor",
    },
    {
      name: "AERO Fringe",
      subname: "Total Contract Labor",
    },
    {
      name: "California",
      subname: "Total Contract Labor",
    },
  ];

  const allocationRows = expectedAllocations.map((expected) => {
    const existingRow = rawAllocationRows.find(
      (row) => row?.name === expected.name,
    );

    // =========================================================
    // API ROW EXISTS
    // =========================================================

    if (existingRow) {
      return {
        ...existingRow,

        name: existingRow?.name || expected.name,

        subname: existingRow?.subname || expected.subname,

        baseLaborDollars: safeNumber(existingRow?.baseLaborDollars),

        percentageOfTotal: safeNumber(existingRow?.percentageOfTotal),

        adjustments: safeNumber(existingRow?.adjustments),

        claimedExpenseAllocation: safeNumber(
          existingRow?.claimedExpenseAllocation,
        ),

        allocationBasedOnGlAmounts: safeNumber(
          existingRow?.allocationBasedOnGlAmounts,
        ),
      };
    }

    // =========================================================
    // API ROW DOES NOT EXIST
    // =========================================================

    return {
      name: expected.name,

      subname: expected.subname,

      baseLaborDollars: 0,

      percentageOfTotal: 0,

      adjustments: 0,

      claimedExpenseAllocation: 0,

      allocationBasedOnGlAmounts: 0,
    };
  });

  // ===========================================================
  // 3. ALLOCATION TOTALS
  // ===========================================================

  const allocationTotals = {
    totalBaseLaborDollars: safeNumber(data?.totalBaseLaborDollars),

    totalPercentage: safeNumber(data?.totalPercentage),

    totalClaimedExpenseAllocation: safeNumber(
      data?.totalClaimedExpenseAllocation,
    ),

    totalAllocationBasedOnGlAmounts: safeNumber(
      data?.totalAllocationBasedOnGlAmounts,
    ),
  };

  // ===========================================================
  // 4. RETURN
  // ===========================================================

  return {
    fringeCostData,

    allocationRows,

    allocationTotals,
  };
};

// =============================================================
// ADD FRINGE SHEET
// Same UI structure as Fringe.jsx
// Missing / invalid numeric values => 0
// =============================================================

const addFringe = async (
  workbook,
  {
    year = FISCAL_YEAR,
    companyName = "",
    companyAddress = "",
    sheetName = "Fringe",
  } = {},
) => {
  // ===========================================================
  // API DATA
  // ===========================================================

  const { fringeCostData, allocationRows, allocationTotals } =
    await getFringeData(year);

  // ===========================================================
  // SAFE NUMBER
  // ===========================================================

  const safeNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "-"
    ) {
      return 0;
    }

    const num = Number(value);

    return Number.isFinite(num) ? num : 0;
  };

  // ===========================================================
  // WORKSHEET
  // ===========================================================

  const ws = workbook.addWorksheet(sheetName);

  ws.views = [
    {
      showGridLines: false,
    },
  ];

  // ===========================================================
  // COLUMN WIDTHS
  // ===========================================================

  ws.columns = [
    { width: 32 }, // A
    { width: 24 }, // B
    { width: 20 }, // C
    { width: 16 }, // D
    { width: 18 }, // E
    { width: 12 }, // F
    { width: 22 }, // G
    { width: 16 }, // H
  ];

  // ===========================================================
  // COLORS
  // ===========================================================

  const YELLOW = "FFFF00";
  const CYAN = "27C4C7";
  const CYAN_BORDER = "08767B";
  const BLUE = "211FAE";
  const BLACK = "000000";
  const WHITE = "FFFFFF";
  const DARK_HATCH = "1F1F1F";
  const LIGHT_HATCH = "666666";

  // ===========================================================
  // REFERENCE SHEET NAMES
  // ===========================================================

  const REFERENCE_SHEET_NAMES = {
    "Sched A": "SCHEDULE A",
    "Sched B": "SCHEDULE B",
    "Sched C (1)": "SCHEDULE C (1)",
    "Sched C (2)": "SCHEDULE C (2)",
    "Sched C (3)": "SCHEDULE C (3)",
    "Sched C (6)": "SCHEDULE C (6)",
    "Sched D (1)": "SCHEDULE D (1)",
    "Sched D (2)": "SCHEDULE D (2)",
  };

  // ===========================================================
  // BORDERS
  // ===========================================================

  const blackBorder = {
    top: {
      style: "thin",
      color: { argb: BLACK },
    },
    bottom: {
      style: "thin",
      color: { argb: BLACK },
    },
    left: {
      style: "thin",
      color: { argb: BLACK },
    },
    right: {
      style: "thin",
      color: { argb: BLACK },
    },
  };

  const cyanBorder = {
    bottom: {
      style: "thin",
      color: { argb: CYAN_BORDER },
    },
  };

  // ===========================================================
  // HELPERS
  // ===========================================================

  const setFont = (
    cell,
    {
      bold = false,
      underline = false,
      size = 9,
      color = BLACK,
      italic = false,
    } = {},
  ) => {
    cell.font = {
      name: "Arial",
      size,
      bold,
      underline,
      italic,
      color: {
        argb: color,
      },
    };
  };

  const setCenter = (cell, wrapText = true) => {
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText,
    };
  };

  const setLeft = (cell, wrapText = true) => {
    cell.alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText,
    };
  };

  const setRight = (cell) => {
    cell.alignment = {
      horizontal: "right",
      vertical: "middle",
      wrapText: false,
    };
  };

  // ===========================================================
  // NUMBER FORMAT
  // ===========================================================

  const numberFormat = "#,##0;(#,##0);-";

  // ===========================================================
  // NORMAL NUMBER CELL
  // ===========================================================

  const normalNumberCell = (cell, value) => {
    const numeric = safeNumber(value);

    cell.value = numeric;

    cell.numFmt = numberFormat;

    setRight(cell);

    cell.border = blackBorder;

    setFont(cell, {
      size: 9,
    });
  };

  // ===========================================================
  // FORMULA CELL
  //
  // IMPORTANT:
  // ExcelJS does not calculate formulas.
  // Therefore we provide BOTH:
  //   formula
  //   result
  //
  // This prevents #VALUE! / blank formula result when workbook
  // is opened before Excel recalculates.
  // ===========================================================

  const formulaCell = (cell, formula, result = 0) => {
    const safeResult = safeNumber(result);

    cell.value = {
      formula,
      result: safeResult,
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: CYAN,
      },
    };

    cell.numFmt = numberFormat;

    setRight(cell);

    cell.border = cyanBorder;

    setFont(cell, {
      size: 9,
    });
  };

  // ===========================================================
  // BLUE REFERENCE BUTTON
  // ===========================================================

  const setReferenceButton = (cell, text) => {
    const sheetName = REFERENCE_SHEET_NAMES[text];

    if (sheetName) {
      cell.value = {
        text,
        hyperlink: `#'${sheetName}'!A1`,
        tooltip: `Go to ${sheetName}`,
      };
    } else {
      cell.value = text;
    }

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: BLUE,
      },
    };

    cell.font = {
      name: "Arial",
      size: 9,
      bold: true,
      underline: true,
      color: {
        argb: WHITE,
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: false,
    };

    cell.border = {
      top: {
        style: "thin",
        color: {
          argb: BLUE,
        },
      },
      bottom: {
        style: "thin",
        color: {
          argb: BLUE,
        },
      },
      left: {
        style: "thin",
        color: {
          argb: BLUE,
        },
      },
      right: {
        style: "thin",
        color: {
          argb: BLUE,
        },
      },
    };
  };

  // ===========================================================
  // TO + REFERENCE
  // ===========================================================

  const setToReference = (rowNumber, reference) => {
    const toCell = ws.getCell(rowNumber, 7);

    toCell.value = "TO";

    setFont(toCell, {
      bold: false,
      size: 9,
    });

    toCell.alignment = {
      horizontal: "right",
      vertical: "middle",
    };

    const referenceCell = ws.getCell(rowNumber, 8);

    setReferenceButton(referenceCell, reference);
  };

  // ===========================================================
  // HATCHED CELL
  // ===========================================================

  const setHatched = (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "darkGrid",
      fgColor: {
        argb: LIGHT_HATCH,
      },
      bgColor: {
        argb: DARK_HATCH,
      },
    };

    cell.border = blackBorder;
  };

  // ===========================================================
  // TOP HEADER
  // ===========================================================

  ws.mergeCells("A1:B1");
  ws.mergeCells("A2:B2");
  ws.mergeCells("A3:B3");
  ws.mergeCells("A4:B4");

  ws.getCell("A1").value = "Schedule Fringe is linked to the following";

  ws.getCell("A2").value = "schedule(s):";

  ws.getCell("A3").value = "Schedule D (x)";

  ws.getCell("A4").value = "ICE MANUAL";

  setFont(ws.getCell("A1"), {
    size: 9,
  });

  setFont(ws.getCell("A2"), {
    size: 9,
  });

  setFont(ws.getCell("A3"), {
    size: 9,
  });

  setFont(ws.getCell("A4"), {
    size: 9,
    underline: true,
    color: "0000AA",
  });

  setLeft(ws.getCell("A1"));
  setLeft(ws.getCell("A2"));
  setLeft(ws.getCell("A3"));
  setLeft(ws.getCell("A4"));

  // ===========================================================
  // COMPANY / TITLE
  // ===========================================================

  ws.mergeCells("C1:E1");
  ws.mergeCells("C2:E2");
  ws.mergeCells("C4:E4");
  ws.mergeCells("C5:E5");

  const companyNameCell = ws.getCell("C1");

  companyNameCell.value = companyName || "";

  const companyAddressCell = ws.getCell("C2");

  companyAddressCell.value = companyAddress || "";

  const titleCell = ws.getCell("C4");

  titleCell.value = "Fringe Pool";

  const fiscalCell = ws.getCell("C5");

  fiscalCell.value = `Fiscal Year End - 12/31/${year}`;

  [companyNameCell, companyAddressCell, titleCell, fiscalCell].forEach(
    (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: YELLOW,
        },
      };

      setFont(cell, {
        bold: true,
        size: 10,
      });

      setCenter(cell);
    },
  );

  // ===========================================================
  // RIGHT HEADER
  // ===========================================================

  ws.mergeCells("F1:H1");
  ws.mergeCells("F2:H2");

  ws.getCell("F1").value = "SCHEDULE Fringe";

  ws.getCell("F2").value = "ICE (version 2.0.1h)";

  setFont(ws.getCell("F1"), {
    bold: true,
    size: 9,
  });

  setFont(ws.getCell("F2"), {
    bold: true,
    size: 9,
  });

  setCenter(ws.getCell("F1"));
  setCenter(ws.getCell("F2"));

  // ===========================================================
  // DETAIL TABLE HEADER
  // ===========================================================

  let rowNumber = 8;

  const detailHeaders = [
    "ACCOUNT\nNUMBER",
    "DESCRIPTION",
    "PER G/L\n& TRIAL BAL/FS",
    "ADJUSTMENT",
    "CLAIMED",
    "NOTES",
    "REFERENCE",
  ];

  detailHeaders.forEach((header, index) => {
    const cell = ws.getCell(rowNumber, index + 1);

    cell.value = header;

    setFont(cell, {
      bold: true,
      size: 9,
    });

    setCenter(cell);

    cell.border = {
      bottom: {
        style: "thin",
        color: {
          argb: BLACK,
        },
      },
    };
  });

  ws.getRow(rowNumber).height = 35;

  rowNumber++;

  // ===========================================================
  // DETAIL DATA
  // ===========================================================

  const firstDetailDataRow = rowNumber;

  fringeCostData.forEach((row) => {
    const excelRow = ws.getRow(rowNumber);

    const perGL = safeNumber(row?.perGLRaw);

    const adjustment = safeNumber(row?.adjustmentRaw);

    const claimed = perGL + adjustment;

    // ---------------------------------------------------------
    // ACCOUNT
    // ---------------------------------------------------------

    excelRow.getCell(1).value = row?.account || "";

    setLeft(excelRow.getCell(1));

    setFont(excelRow.getCell(1), {
      size: 9,
    });

    // ---------------------------------------------------------
    // DESCRIPTION
    // ---------------------------------------------------------

    excelRow.getCell(2).value = row?.description || "";

    setLeft(excelRow.getCell(2));

    setFont(excelRow.getCell(2), {
      size: 9,
    });

    // ---------------------------------------------------------
    // PER G/L
    // ---------------------------------------------------------

    normalNumberCell(excelRow.getCell(3), perGL);

    // ---------------------------------------------------------
    // ADJUSTMENT
    // ---------------------------------------------------------

    // Always put numeric 0 instead of blank/null.
    normalNumberCell(excelRow.getCell(4), adjustment);

    // ---------------------------------------------------------
    // CLAIMED
    //
    // Formula:
    // C + D
    //
    // result is supplied so Excel does not show #VALUE!
    // ---------------------------------------------------------

    formulaCell(excelRow.getCell(5), `C${rowNumber}+D${rowNumber}`, claimed);

    // ---------------------------------------------------------
    // NOTES
    // ---------------------------------------------------------

    excelRow.getCell(6).value = "";

    excelRow.getCell(6).border = blackBorder;

    // ---------------------------------------------------------
    // REFERENCE
    // ---------------------------------------------------------

    excelRow.getCell(7).value = "";

    excelRow.getCell(7).border = blackBorder;

    rowNumber++;
  });

  const lastDetailDataRow = rowNumber - 1;

  // ===========================================================
  // DETAIL TOTAL
  // ===========================================================

  rowNumber++;

  const detailTotalRow = ws.getRow(rowNumber);

  detailTotalRow.getCell(2).value = "Total";

  setFont(detailTotalRow.getCell(2), {
    bold: true,
    size: 9,
  });

  // Calculate actual totals for formula result
  const totalPerGL = fringeCostData.reduce(
    (sum, row) => sum + safeNumber(row?.perGLRaw),
    0,
  );

  const totalAdjustment = fringeCostData.reduce(
    (sum, row) => sum + safeNumber(row?.adjustmentRaw),
    0,
  );

  const totalClaimed = totalPerGL + totalAdjustment;

  // ---------------------------------------------------------
  // PER GL
  // ---------------------------------------------------------

  formulaCell(
    detailTotalRow.getCell(3),
    lastDetailDataRow >= firstDetailDataRow
      ? `SUM(C${firstDetailDataRow}:C${lastDetailDataRow})`
      : "0",
    totalPerGL,
  );

  // ---------------------------------------------------------
  // ADJUSTMENT
  // ---------------------------------------------------------

  formulaCell(
    detailTotalRow.getCell(4),
    lastDetailDataRow >= firstDetailDataRow
      ? `SUM(D${firstDetailDataRow}:D${lastDetailDataRow})`
      : "0",
    totalAdjustment,
  );

  // ---------------------------------------------------------
  // CLAIMED
  // ---------------------------------------------------------

  formulaCell(
    detailTotalRow.getCell(5),
    `C${rowNumber}+D${rowNumber}`,
    totalClaimed,
  );

  // ---------------------------------------------------------
  // NOTES
  // ---------------------------------------------------------

  detailTotalRow.getCell(6).value = "";

  detailTotalRow.getCell(6).border = blackBorder;

  // ---------------------------------------------------------
  // TO SCHED A
  // ---------------------------------------------------------

  setToReference(rowNumber, "Sched A");

  ws.getRow(rowNumber).height = 22;

  // ===========================================================
  // SCREEN 2
  // ALLOCATION OF EXPENSES
  // ===========================================================

  rowNumber += 3;

  // ===========================================================
  // ALLOCATION TITLE
  // ===========================================================

  ws.mergeCells(rowNumber, 1, rowNumber, 6);

  ws.getCell(rowNumber, 1).value = "Allocation of Expenses Based on";

  setFont(ws.getCell(rowNumber, 1), {
    size: 9,
  });

  setLeft(ws.getCell(rowNumber, 1));

  rowNumber++;

  ws.mergeCells(rowNumber, 1, rowNumber, 6);

  ws.getCell(rowNumber, 1).value = "Straight-Time Labor Dollars";

  setFont(ws.getCell(rowNumber, 1), {
    size: 9,
  });

  setLeft(ws.getCell(rowNumber, 1));

  rowNumber += 2;

  // ===========================================================
  // ALLOCATION HEADER
  // ===========================================================

  const allocationHeaders = [
    "",
    "Base\nLabor Dollars",
    "% of\nTotal",
    "Adjustments",
    "Claimed\nExpense\nAllocation",
    "Allocation\nbased on\nPer G/L Amts",
  ];

  allocationHeaders.forEach((header, index) => {
    const cell = ws.getCell(rowNumber, index + 1);

    cell.value = header;

    setFont(cell, {
      bold: true,
      size: 9,
    });

    setCenter(cell);

    cell.border = {
      bottom: {
        style: "thin",
        color: {
          argb: BLACK,
        },
      },
    };
  });

  ws.getRow(rowNumber).height = 45;

  rowNumber++;

  // ===========================================================
  // SCHEDULE LABEL MAP
  // ===========================================================

  const scheduleLabelMap = {
    "G&A Labor": "Sched B",

    "O/H - OH - Onsite": "Sched C (1)",

    "O/H - OH - Offsite": "Sched C (2)",

    "O/H - SM&L": "Sched C (3)",

    "AERO Fringe": "Sched D (1)",

    California: "Sched C (6)",
  };

  // ===========================================================
  // ALLOCATION BODY
  // ===========================================================

  allocationRows.forEach((row, index) => {
    const previousRow = allocationRows[index - 1];

    const showHeader = index === 0 || previousRow?.name !== row?.name;

    // =======================================================
    // CATEGORY HEADER
    // =======================================================

    if (showHeader) {
      const categoryRow = ws.getRow(rowNumber);

      // -----------------------------------------------------
      // NAME
      // -----------------------------------------------------

      categoryRow.getCell(1).value = row?.name || "";

      categoryRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: YELLOW,
        },
      };

      setFont(categoryRow.getCell(1), {
        bold: true,
        size: 9,
      });

      setLeft(categoryRow.getCell(1));

      // -----------------------------------------------------
      // HATCHED CELLS
      // -----------------------------------------------------

      for (let col = 2; col <= 6; col++) {
        setHatched(categoryRow.getCell(col));
      }

      // -----------------------------------------------------
      // REFERENCE
      // -----------------------------------------------------

      const reference = scheduleLabelMap[row?.name];

      if (reference) {
        setToReference(rowNumber, reference);
      }

      categoryRow.height = 22;

      rowNumber++;
    }

    // =======================================================
    // ALLOCATION SUB ROW
    // =======================================================

    const allocationRow = ws.getRow(rowNumber);

    const baseLabor = safeNumber(row?.baseLaborDollars);

    const percentage = safeNumber(row?.percentageOfTotal);

    const adjustment = safeNumber(row?.adjustments);

    const claimedExpense = safeNumber(row?.claimedExpenseAllocation);

    const allocationGL = safeNumber(row?.allocationBasedOnGlAmounts);

    // -------------------------------------------------------
    // SUBNAME
    // -------------------------------------------------------

    allocationRow.getCell(1).value = row?.subname || "";

    setLeft(allocationRow.getCell(1));

    setFont(allocationRow.getCell(1), {
      size: 9,
    });

    // -------------------------------------------------------
    // BASE LABOR
    // -------------------------------------------------------

    normalNumberCell(allocationRow.getCell(2), baseLabor);

    // -------------------------------------------------------
    // PERCENTAGE
    // -------------------------------------------------------

    formulaCell(allocationRow.getCell(3), `${percentage}`, percentage);

    allocationRow.getCell(3).numFmt = '0.00"%"';

    // -------------------------------------------------------
    // ADJUSTMENT
    // -------------------------------------------------------

    // Always numeric 0 if API doesn't provide it.
    normalNumberCell(allocationRow.getCell(4), adjustment);

    // -------------------------------------------------------
    // CLAIMED EXPENSE
    // -------------------------------------------------------

    formulaCell(allocationRow.getCell(5), `${claimedExpense}`, claimedExpense);

    // -------------------------------------------------------
    // ALLOCATION BASED ON GL
    // -------------------------------------------------------

    formulaCell(allocationRow.getCell(6), `${allocationGL}`, allocationGL);

    // -------------------------------------------------------
    // EMPTY REFERENCE AREA
    // -------------------------------------------------------

    allocationRow.getCell(7).value = "";

    allocationRow.getCell(8).value = "";

    rowNumber++;
  });

  // ===========================================================
  // TOTAL ALLOCATION
  // ===========================================================

  rowNumber++;

  const totalRow = ws.getRow(rowNumber);

  const totalBaseLabor = safeNumber(allocationTotals?.totalBaseLaborDollars);

  const totalPercentage = safeNumber(allocationTotals?.totalPercentage);

  const totalClaimedExpense = safeNumber(
    allocationTotals?.totalClaimedExpenseAllocation,
  );

  const totalAllocationGL = safeNumber(
    allocationTotals?.totalAllocationBasedOnGlAmounts,
  );

  // -----------------------------------------------------------
  // LABEL
  // -----------------------------------------------------------

  totalRow.getCell(1).value = "Total";

  setFont(totalRow.getCell(1), {
    bold: true,
    size: 9,
  });

  setLeft(totalRow.getCell(1));

  // -----------------------------------------------------------
  // BASE LABOR
  // -----------------------------------------------------------

  formulaCell(totalRow.getCell(2), `${totalBaseLabor}`, totalBaseLabor);

  // -----------------------------------------------------------
  // TOTAL %
  // -----------------------------------------------------------

  formulaCell(totalRow.getCell(3), `${totalPercentage}`, totalPercentage);

  totalRow.getCell(3).numFmt = '0.00"%"';

  // -----------------------------------------------------------
  // ADJUSTMENT
  // -----------------------------------------------------------

  normalNumberCell(totalRow.getCell(4), 0);

  // -----------------------------------------------------------
  // CLAIMED
  // -----------------------------------------------------------

  formulaCell(
    totalRow.getCell(5),
    `${totalClaimedExpense}`,
    totalClaimedExpense,
  );

  // -----------------------------------------------------------
  // GL
  // -----------------------------------------------------------

  formulaCell(totalRow.getCell(6), `${totalAllocationGL}`, totalAllocationGL);

  // -----------------------------------------------------------
  // REFERENCE
  // -----------------------------------------------------------

  setToReference(rowNumber, "Sched D (2)");

  totalRow.height = 22;

  // ===========================================================
  // EXPLANATORY NOTES
  // ===========================================================

  rowNumber += 3;

  ws.mergeCells(rowNumber, 1, rowNumber, 8);

  ws.getCell(rowNumber, 1).value = "Explanatory Notes:";

  setFont(ws.getCell(rowNumber, 1), {
    bold: true,
    underline: true,
    size: 9,
  });

  setLeft(ws.getCell(rowNumber, 1));

  // ===========================================================
  // LEGEND
  // ===========================================================

  rowNumber += 3;

  // -----------------------------------------------------------
  // LINKED
  // -----------------------------------------------------------

  ws.mergeCells(rowNumber, 1, rowNumber, 3);

  const linkedLegend = ws.getCell(rowNumber, 1);

  linkedLegend.value = "Linked to Other Worksheet";

  linkedLegend.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: YELLOW,
    },
  };

  setFont(linkedLegend, {
    size: 9,
  });

  setLeft(linkedLegend);

  // -----------------------------------------------------------
  // FORMULA
  // -----------------------------------------------------------

  rowNumber++;

  ws.mergeCells(rowNumber, 1, rowNumber, 3);

  const formulaLegend = ws.getCell(rowNumber, 1);

  formulaLegend.value = "Cell Contains a Formula";

  formulaLegend.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: CYAN,
    },
  };

  setFont(formulaLegend, {
    size: 9,
  });

  setLeft(formulaLegend);

  // ===========================================================
  // ROW HEIGHTS
  // ===========================================================

  ws.getRow(1).height = 18;
  ws.getRow(2).height = 18;
  ws.getRow(3).height = 18;
  ws.getRow(4).height = 18;
  ws.getRow(5).height = 18;

  // ===========================================================
  // PAGE SETUP
  // ===========================================================

  ws.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,

    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  ws.pageSetup.horizontalDpi = 300;
  ws.pageSetup.verticalDpi = 300;

  // ===========================================================
  // FREEZE / VIEW
  // ===========================================================

  ws.views = [
    {
      showGridLines: false,
    },
  ];

  return ws;
};

// Schedule G - 1

const getScheduleG1Data = async () => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/scheduleDG1_cost?fyCd=2025`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Schedule G-1 data. Status: ${response.status}`,
    );
  }

  const data = await response.json();

  const rows =
    data?.schedules?.[0]?.rows
      ?.filter((row) => !row.subname?.toLowerCase().includes("total"))
      ?.map((row) => ({
        subname: row.subname || "",
        trialBal: Number(row.trialBal || 0),
        claimed: Number(row.claimed || 0),
      })) || [];

  return rows;
};

const addScheduleG1 = async (workbook, { companyName, companyAddress }) => {
  const rows = await getScheduleG1Data();

  const worksheet = workbook.addWorksheet("SCHEDULE G-1");

  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.views = [{ showGridLines: false }];

  worksheet.columns = [
    { width: 32 }, // Cost Element
    { width: 20 }, // Per General Ledger
    { width: 20 }, // Per Job Cost Ledger
    { width: 17 }, // Difference
    { width: 10 }, // Notes
    { width: 17 }, // Reference
  ];

  // ---------------------------------------------------------
  // Styles
  // ---------------------------------------------------------

  const yellowFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };
  const formulaFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF29C4C8" },
  };
  const blueFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1719A8" },
  };
  const blackBorder = { style: "thin", color: { argb: "FF000000" } };

  // FIX: same split as Schedule G — JSX's formatCurrency() (Per
  // General Ledger, Per Job Cost Ledger) shows "$0.00" on zero;
  // formatDifference() (Difference only) shows "-" on zero.
  const dollarFormat = '$#,##0.00;($#,##0.00);"$0.00"';
  const dashZeroFormat = "$#,##0.00;($#,##0.00);-";

  const baseFont = { name: "Times New Roman", size: 11 };
  const boldFont = { name: "Times New Roman", size: 11, bold: true };

  // ---------------------------------------------------------
  // Top information
  // ---------------------------------------------------------

  worksheet.mergeCells("A1:B1");
  worksheet.getCell("A1").value =
    "Schedule G-1 is linked to the following schedule:";

  worksheet.mergeCells("A2:B2");
  worksheet.getCell("A2").value = "Schedule G, Reconciled to GL";

  worksheet.getCell("A3").value = "ICE MANUAL";
  worksheet.getCell("A3").font = {
    ...baseFont,
    color: { argb: "FF0000CC" },
    underline: true,
  };

  worksheet.mergeCells("C3:D4");
  const companyCell = worksheet.getCell("C3");
  companyCell.value = `${companyName || ""}\n${companyAddress || ""}`;
  companyCell.fill = yellowFill;
  companyCell.font = boldFont;
  companyCell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.mergeCells("E1:F3");
  const scheduleTitle = worksheet.getCell("E1");
  scheduleTitle.value = "SCHEDULE G-1\n(OPTIONAL)\nICE (version 2.0.1h)";
  scheduleTitle.font = boldFont;
  scheduleTitle.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.mergeCells("C6:D7");
  const heading = worksheet.getCell("C6");
  heading.value = "RECONCILIATION OF CLAIMED DIRECT\nCOSTS TO JOB COST LEDGER";
  heading.font = boldFont;
  heading.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.mergeCells("C8:D8");
  const fiscalYearCell = worksheet.getCell("C8");
  fiscalYearCell.value = "Fiscal Year End - 12/31/2025";
  fiscalYearCell.fill = yellowFill;
  fiscalYearCell.font = boldFont;
  fiscalYearCell.alignment = { horizontal: "center", vertical: "middle" };

  // ---------------------------------------------------------
  // Table Header
  // ---------------------------------------------------------

  const headerRow = 10;

  const headers = [
    "Cost Element",
    "Per General\nLedger",
    "Per Job\nCost Ledger",
    "Difference",
    "Notes",
    "Reference",
  ];

  headers.forEach((header, index) => {
    const cell = worksheet.getCell(headerRow, index + 1);
    cell.value = header;
    cell.font = boldFont;
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.border = { bottom: blackBorder };
  });

  worksheet.getCell(headerRow, 1).alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true,
  };
  worksheet.getCell(headerRow, 1).font = { ...boldFont, underline: true };
  worksheet.getCell(headerRow, 4).font = { ...boldFont, underline: true };
  worksheet.getCell(headerRow, 5).font = { ...baseFont, underline: true };
  worksheet.getCell(headerRow, 6).font = { ...boldFont, underline: true };

  // ---------------------------------------------------------
  // API rows
  // ---------------------------------------------------------

  let currentRow = headerRow + 1;

  let totalGl = 0;
  let totalJobCost = 0;

  rows.forEach((item, index) => {
    const glAmount = Number(item.trialBal || 0);
    const jclAmount = Number(item.claimed || 0);
    const difference = glAmount - jclAmount;

    totalGl += glAmount;
    totalJobCost += jclAmount;

    const row = worksheet.getRow(currentRow);

    row.getCell(1).value = item.subname;
    row.getCell(2).value = glAmount;
    row.getCell(3).value = jclAmount;
    row.getCell(4).value = difference;
    row.getCell(5).value = "";

    if (index === 0) {
      row.getCell(6).value = "Sched G";
    }

    row.getCell(1).font = baseFont;
    row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

    row.getCell(2).fill = yellowFill;
    row.getCell(2).font = baseFont;
    row.getCell(2).numFmt = dollarFormat; // FIX: was dashZeroFormat
    row.getCell(2).alignment = { horizontal: "right", vertical: "middle" };

    row.getCell(3).font = baseFont;
    row.getCell(3).numFmt = dollarFormat; // FIX: was dashZeroFormat
    row.getCell(3).alignment = { horizontal: "right", vertical: "middle" };

    row.getCell(4).fill = formulaFill;
    row.getCell(4).font = baseFont;
    row.getCell(4).numFmt = dashZeroFormat; // correct as-is: matches formatDifference
    row.getCell(4).alignment = { horizontal: "right", vertical: "middle" };

    row.getCell(5).font = baseFont;

    if (index === 0) {
      row.getCell(6).fill = blueFill;
      row.getCell(6).font = {
        ...boldFont,
        color: { argb: "FFFFFFFF" },
        underline: true,
      };
      row.getCell(6).alignment = { horizontal: "center", vertical: "middle" };
    }

    currentRow++;
  });

  // ---------------------------------------------------------
  // Total Direct
  // FIX: totalGl/totalJobCost use dollar-zero format (formatCurrency
  // in JSX); only totalDifference uses dash-zero (formatDifference).
  // ---------------------------------------------------------

  const totalDifference = totalGl - totalJobCost;

  const totalRow = worksheet.getRow(currentRow);

  totalRow.getCell(1).value = "Total Direct";
  totalRow.getCell(2).value = totalGl;
  totalRow.getCell(3).value = totalJobCost;
  totalRow.getCell(4).value = totalDifference;

  for (let col = 1; col <= 6; col++) {
    totalRow.getCell(col).border = { top: blackBorder };
  }

  totalRow.getCell(1).font = boldFont;

  totalRow.getCell(2).fill = formulaFill;
  totalRow.getCell(3).fill = formulaFill;
  totalRow.getCell(4).fill = formulaFill;

  totalRow.getCell(2).font = boldFont;
  totalRow.getCell(3).font = boldFont;
  totalRow.getCell(4).font = boldFont;

  totalRow.getCell(2).numFmt = dollarFormat; // FIX: was dashZeroFormat
  totalRow.getCell(3).numFmt = dollarFormat; // FIX: was dashZeroFormat
  totalRow.getCell(4).numFmt = dashZeroFormat; // correct as-is

  totalRow.getCell(2).alignment = { horizontal: "right" };
  totalRow.getCell(3).alignment = { horizontal: "right" };
  totalRow.getCell(4).alignment = { horizontal: "right" };

  // ---------------------------------------------------------
  // Legend
  // ---------------------------------------------------------

  const legendStartRow = currentRow + 5;

  worksheet.mergeCells(`A${legendStartRow}:B${legendStartRow}`);
  worksheet.getCell(`A${legendStartRow}`).value =
    "Imported from Other Worksheet";
  worksheet.getCell(`A${legendStartRow}`).fill = yellowFill;
  worksheet.getCell(`A${legendStartRow}`).font = baseFont;

  worksheet.mergeCells(`A${legendStartRow + 1}:B${legendStartRow + 1}`);
  worksheet.getCell(`A${legendStartRow + 1}`).value = "Cell Contains a Formula";
  worksheet.getCell(`A${legendStartRow + 1}`).fill = formulaFill;
  worksheet.getCell(`A${legendStartRow + 1}`).font = baseFont;

  // ---------------------------------------------------------
  // Row heights
  // ---------------------------------------------------------

  worksheet.getRow(1).height = 20;
  worksheet.getRow(2).height = 20;
  worksheet.getRow(3).height = 20;
  worksheet.getRow(6).height = 20;
  worksheet.getRow(7).height = 20;
  worksheet.getRow(8).height = 20;
  worksheet.getRow(10).height = 32;

  for (let row = 11; row <= currentRow; row++) {
    worksheet.getRow(row).height = 20;
  }

  worksheet.printArea = `A1:F${legendStartRow + 1}`;

  return worksheet;
};

// Schedule G

const getScheduleGData = async () => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/scheduleDG_cost?fyCd=2025`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Schedule G data. Status: ${response.status}`,
    );
  }

  const data = await response.json();

  const rows =
    data?.schedules?.[0]?.rows
      ?.filter((row) => !row.subname?.toLowerCase().includes("subtotal"))
      ?.map((row) => ({
        subname: row.subname || "",
        trialBal: Number(row.trialBal || 0),
        adjustment: Number(row.adjustment || 0),
        claimed: Number(row.claimed || 0),
      })) || [];

  return rows;
};

const addScheduleG = async (workbook, { companyName, companyAddress }) => {
  const rows = await getScheduleGData();

  const worksheet = workbook.addWorksheet("SCHEDULE G");

  worksheet.views = [{ showGridLines: false }];

  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.columns = [
    { width: 8 }, // ACCT
    { width: 36 }, // DESCRIPTION
    { width: 20 }, // AMOUNT PER GL
    { width: 20 }, // ADJUSTMENTS
    { width: 20 }, // AMOUNT CLAIMED
    { width: 9 }, // NOTES
    { width: 25 }, // REF
  ];

  // ---------------------------------------------------------
  // Styles
  // ---------------------------------------------------------

  const yellowFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };
  const formulaFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF29C4C8" },
  };
  const blueFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1719A8" },
  };
  const blackBorder = { style: "thin", color: { argb: "FF000000" } };

  const baseFont = { name: "Times New Roman", size: 11 };
  const boldFont = { name: "Times New Roman", size: 11, bold: true };

  // FIX: split into two formats — JSX's formatCurrency() shows "$0.00"
  // for zero (used on Amount Per GL / Amount Claimed), while
  // formatAdjustment() shows "-" for zero (used only on Adjustments).
  // The old single `moneyFormat` applied the dash behavior everywhere.
  const dollarFormat = '$#,##0.00;($#,##0.00);"$0.00"';
  const dashZeroFormat = "$#,##0.00;($#,##0.00);-";

  // ---------------------------------------------------------
  // Header information
  // ---------------------------------------------------------

  worksheet.mergeCells("A1:B1");
  worksheet.getCell("A1").value =
    "Schedule G is linked to the following schedule:";

  worksheet.mergeCells("A2:B2");
  worksheet.getCell("A2").value = "Summary Schedule H";

  worksheet.getCell("A3").value = "ICE MANUAL";
  worksheet.getCell("A3").font = {
    ...baseFont,
    color: { argb: "FF0000CC" },
    underline: true,
  };

  worksheet.mergeCells("C2:E3");
  const companyCell = worksheet.getCell("C2");
  companyCell.value = `${companyName || ""}\n${companyAddress || ""}`;
  companyCell.fill = yellowFill;
  companyCell.font = boldFont;
  companyCell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.mergeCells("F1:G2");
  const scheduleTitle = worksheet.getCell("F1");
  // NOTE: JSX literally shows "ICF (version 2.0.1h)" — a typo for "ICE"
  // — kept as-is here to match the live UI exactly. Flag if you want
  // it corrected in both places.
  scheduleTitle.value = "SCHEDULE G\nICF (version 2.0.1h)";
  scheduleTitle.font = boldFont;
  scheduleTitle.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.mergeCells("C5:E6");
  const heading = worksheet.getCell("C5");
  heading.value =
    "Reconciliation of Books of Account and Claimed Direct Costs\nby major cost element";
  heading.font = boldFont;
  heading.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.mergeCells("C7:E7");
  const fiscalYearCell = worksheet.getCell("C7");
  fiscalYearCell.value = "Fiscal Year End - 12/31/2025";
  fiscalYearCell.fill = yellowFill;
  fiscalYearCell.font = boldFont;
  fiscalYearCell.alignment = { horizontal: "center", vertical: "middle" };

  // ---------------------------------------------------------
  // Table Header
  // FIX: Notes and Ref. headers are underlined but NOT bold in the
  // JSX (`text-[14px] underline`, no font-bold), unlike every other
  // header. Previously all headers got boldFont as a base regardless.
  // ---------------------------------------------------------

  const headerRow = 9;

  const headers = [
    "ACCT",
    "DESCRIPTION*",
    "AMOUNT\nPER GENERAL\nLEDGER",
    "ADJUSTMENTS",
    "AMOUNT\nCLAIMED",
    "Notes",
    "Ref.",
  ];

  headers.forEach((header, index) => {
    const cell = worksheet.getCell(headerRow, index + 1);
    cell.value = header;

    const isNotesOrRef = index === 5 || index === 6;
    const underline =
      index === 0 || index === 1 || index === 3 || index === 5 || index === 6;

    cell.font = isNotesOrRef
      ? { ...baseFont, underline }
      : { ...boldFont, underline };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.border = { bottom: blackBorder };
  });

  // ---------------------------------------------------------
  // API rows
  // ---------------------------------------------------------

  let currentRow = headerRow + 1;

  let totalTrialBal = 0;
  let totalAdjustment = 0;
  let totalClaimed = 0;

  rows.forEach((item, index) => {
    const trialBal = Number(item.trialBal || 0);
    const adjustment = Number(item.adjustment || 0);
    const claimed = Number(item.claimed || 0);

    totalTrialBal += trialBal;
    totalAdjustment += adjustment;
    totalClaimed += claimed;

    const row = worksheet.getRow(currentRow);

    row.getCell(2).value = item.subname;
    row.getCell(3).value = trialBal;
    row.getCell(4).value = adjustment;
    row.getCell(5).value = claimed;

    if (adjustment !== 0) {
      row.getCell(6).value = index + 1;
    }

    if (index === 0) {
      row.getCell(7).value = "Summary Sched H";
    }

    row.getCell(1).font = baseFont;

    row.getCell(2).font = baseFont;
    row.getCell(2).alignment = { horizontal: "left", vertical: "middle" };

    row.getCell(3).fill = yellowFill;
    row.getCell(3).font = baseFont;
    row.getCell(3).numFmt = dollarFormat; // FIX: was dashZeroFormat
    row.getCell(3).alignment = { horizontal: "right", vertical: "middle" };

    row.getCell(4).font = baseFont;
    row.getCell(4).numFmt = dashZeroFormat; // correct as-is: matches formatAdjustment
    row.getCell(4).alignment = { horizontal: "right", vertical: "middle" };

    row.getCell(5).fill = formulaFill;
    row.getCell(5).font = baseFont;
    row.getCell(5).numFmt = dollarFormat; // FIX: was dashZeroFormat
    row.getCell(5).alignment = { horizontal: "right", vertical: "middle" };

    row.getCell(6).font = baseFont;
    row.getCell(6).alignment = { horizontal: "center", vertical: "middle" };

    if (index === 0) {
      row.getCell(7).fill = blueFill;
      row.getCell(7).font = {
        ...boldFont,
        color: { argb: "FFFFFFFF" },
        underline: true,
      };
      row.getCell(7).alignment = { horizontal: "center", vertical: "middle" };
    } else {
      row.getCell(7).value = '"';
      row.getCell(7).alignment = { horizontal: "center", vertical: "middle" };
    }

    currentRow++;
  });

  // ---------------------------------------------------------
  // TOTAL DIRECT COSTS
  // FIX: same dollar-vs-dash split applies to the total row —
  // totalTrialBal/totalClaimed use formatCurrency (dollar-zero) in
  // the JSX, only totalAdjustment uses formatAdjustment (dash-zero).
  // ---------------------------------------------------------

  const totalRow = worksheet.getRow(currentRow);

  totalRow.getCell(2).value = "TOTAL DIRECT COSTS";
  totalRow.getCell(3).value = totalTrialBal;
  totalRow.getCell(4).value = totalAdjustment;
  totalRow.getCell(5).value = totalClaimed;

  for (let col = 1; col <= 7; col++) {
    totalRow.getCell(col).border = { top: blackBorder };
  }

  totalRow.getCell(2).font = boldFont;

  [3, 5].forEach((col) => {
    const cell = totalRow.getCell(col);
    cell.fill = formulaFill;
    cell.font = boldFont;
    cell.numFmt = dollarFormat; // FIX: was dashZeroFormat
    cell.alignment = { horizontal: "right", vertical: "middle" };
  });

  const adjTotalCell = totalRow.getCell(4);
  adjTotalCell.fill = formulaFill;
  adjTotalCell.font = boldFont;
  adjTotalCell.numFmt = dashZeroFormat; // correct as-is
  adjTotalCell.alignment = { horizontal: "right", vertical: "middle" };

  // ---------------------------------------------------------
  // Explanatory Notes
  // ---------------------------------------------------------

  const notesStartRow = currentRow + 4;

  worksheet.getCell(`A${notesStartRow}`).value = "Explanatory Notes:";
  worksheet.getCell(`A${notesStartRow}`).font = {
    ...boldFont,
    underline: true,
  };

  worksheet.mergeCells(`A${notesStartRow + 1}:G${notesStartRow + 1}`);
  worksheet.getCell(`A${notesStartRow + 1}`).value =
    "1. Non reimbursable Labor cost to the project 80N1001D0004 for $212 has been adjusted from claimed Labor cost.";

  worksheet.mergeCells(`A${notesStartRow + 2}:G${notesStartRow + 2}`);
  worksheet.getCell(`A${notesStartRow + 2}`).value =
    "2. Non reimbursable Travel cost to the project 80GFSC25C004 for $(1,165) and 47QFCA21F0001 (440.02) has been updated as adjustment from the claimed Travel costs.";

  worksheet.mergeCells(`A${notesStartRow + 3}:G${notesStartRow + 3}`);
  worksheet.getCell(`A${notesStartRow + 3}`).value =
    "3. Non reimbursable ODC cost to the project 4400574846 for $2,953.50 has been updated as adjustment from the claimed ODC costs.";

  worksheet.mergeCells(`A${notesStartRow + 4}:G${notesStartRow + 4}`);
  worksheet.getCell(`A${notesStartRow + 4}`).value =
    "4. An adjustment of $(276,702) for project 80GFSC25C004 is made for Teammate Fee Costs, as these are not claimed.";

  for (let row = notesStartRow; row <= notesStartRow + 4; row++) {
    worksheet.getRow(row).font = baseFont;
  }

  // ---------------------------------------------------------
  // Legend
  // ---------------------------------------------------------

  const legendRow = notesStartRow + 6;

  worksheet.mergeCells(`A${legendRow}:B${legendRow}`);
  worksheet.getCell(`A${legendRow}`).value = "Linked to Other Worksheet";
  worksheet.getCell(`A${legendRow}`).fill = yellowFill;
  worksheet.getCell(`A${legendRow}`).font = baseFont;
  worksheet.getCell(`C${legendRow}`).value = "As Referenced";

  worksheet.mergeCells(`A${legendRow + 1}:B${legendRow + 1}`);
  worksheet.getCell(`A${legendRow + 1}`).value = "Cell Contains a Formula";
  worksheet.getCell(`A${legendRow + 1}`).fill = formulaFill;
  worksheet.getCell(`A${legendRow + 1}`).font = baseFont;
  worksheet.getCell(`C${legendRow + 1}`).value = "Totals and Differences";

  // ---------------------------------------------------------
  // Row heights
  // ---------------------------------------------------------

  worksheet.getRow(1).height = 20;
  worksheet.getRow(2).height = 20;
  worksheet.getRow(3).height = 20;
  worksheet.getRow(5).height = 25;
  worksheet.getRow(6).height = 25;
  worksheet.getRow(7).height = 20;
  worksheet.getRow(headerRow).height = 45;

  for (let row = 10; row <= currentRow; row++) {
    worksheet.getRow(row).height = 20;
  }

  worksheet.printArea = `A1:G${legendRow + 1}`;

  return worksheet;
};

// ============================================================
// SCHEDULE H-1 / H CONT
// ============================================================

const getScheduleH1Data = async () => {
  // =========================================================
  // SAME APIs AS SchedHCont.jsx
  // =========================================================
  const [ledgerRes, ratesRes] = await Promise.all([
    fetch(`${backendUrl}/api/JobCostLedger`),
    fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=2025`),
  ]);

  if (!ledgerRes.ok) {
    throw new Error(`JobCostLedger API failed: ${ledgerRes.status}`);
  }

  if (!ratesRes.ok) {
    throw new Error(`scheduleDA_cost API failed: ${ratesRes.status}`);
  }

  const ledgerData = await ledgerRes.json();
  const ratesData = await ratesRes.json();

  // =========================================================
  // EXACT SAME RATE EXTRACTION AS COMPONENT
  // =========================================================
  const rates = {
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

      if (schedule.name.includes("Fringe Pool") || schedule.name === "Fringe") {
        rates.fringe = r;
      } else if (schedule.name.includes("AERO Fringe")) {
        rates.aeroFringe = r;
      } else if (schedule.name.includes("Customer Site Overhead")) {
        rates.custOH = r;
      } else if (schedule.name.includes("Off - Site Overhead")) {
        rates.colOH = r;
      } else if (schedule.name.includes("Subk & Material Handling")) {
        rates.smh = r;
      } else if (schedule.name.includes("General and Administrative")) {
        rates.ga = r;
      }
    });
  }

  // =========================================================
  // EXACT SAME CATEGORIES AS COMPONENT
  // =========================================================
  const createCategory = () => ({
    laborOnsite: 0,
    laborOffsite: 0,
    laborAero: 0,
    material: 0,
    odc: 0,
    subcontracts: 0,
    unburden: 0,
    travel: 0,
  });

  const categories = {
    "Cost-Type": createCategory(),
    "Flexibly Priced": createCategory(),
    "T&M": createCategory(),
    "Fixed Price": createCategory(),
    Commercial: createCategory(),
    "IR&D&BP": createCategory(),
  };

  // =========================================================
  // EXACT SAME LEDGER CLASSIFICATION
  // =========================================================
  ledgerData
    .filter((row) => Number(row.year) === 2025)
    .forEach((row) => {
      const pt = (row.projType || "").toUpperCase();

      let cat = "Flexibly Priced";

      if (pt.includes("CPFF") || pt.includes("COST") || pt.includes("CPAF")) {
        cat = "Cost-Type";
      } else if (pt === "T&M" || pt.includes("T&M")) {
        cat = "T&M";
      } else if (pt.includes("FIXED") || pt === "FFP") {
        cat = "Fixed Price";
      } else if (pt.includes("COMMERCIAL")) {
        cat = "Commercial";
      } else if (pt.includes("IR&D") || pt.includes("B&P")) {
        cat = "IR&D&BP";
      }

      const amount = parseFloat(row.amount) || 0;

      if (
        row.acctId === "50-00-01" ||
        row.acctId === "50-00-98" ||
        row.acctId === "59-00-01"
      ) {
        if (row.orgId === "1.1.01" || row.acctId === "59-00-01") {
          categories[cat].laborAero += amount;
        } else {
          categories[cat].laborOnsite += amount;
        }
      } else if (row.acctId === "50-00-02") {
        categories[cat].laborOffsite += amount;
      } else if (
        row.acctId &&
        (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
      ) {
        categories[cat].travel += amount;
      } else if (["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)) {
        categories[cat].material += amount;
      } else if (
        ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(row.acctId)
      ) {
        categories[cat].odc += amount;
      } else if (
        ["50-21-01", "50-21-02", "50-21-03", "50-21-04", "50-22-01"].includes(
          row.acctId,
        )
      ) {
        categories[cat].subcontracts += amount;
      } else if (["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)) {
        categories[cat].unburden += amount;
      }
    });

  // =========================================================
  // EXACT SAME CALCULATION AS COMPONENT
  // =========================================================
  const catBases = {};

  const baseTotals = {
    onsite: 0,
    offsite: 0,
    smh: 0,
    ga: 0,
  };

  for (const [cat, rawItem] of Object.entries(categories)) {
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

    const fringeOnsite = Math.round(item.laborOnsite * rates.fringe);

    const fringeOffsite = Math.round(item.laborOffsite * rates.fringe);

    const fringeAero = Math.round(item.laborAero * rates.aeroFringe);

    // EXACT SAME DISPLAY BASE AS COMPONENT
    const ohOnsiteBaseDisplay =
      cat === "Cost-Type" || cat === "T&M"
        ? item.laborOnsite + item.laborAero
        : item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;

    // EXACT SAME G&A BASE CALCULATION
    const ohOnsiteBaseForGA =
      item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;

    const ohOffsiteBase = item.laborOffsite;

    const smhBase = item.material + item.subcontracts;

    const ohOnsiteDisplay = Math.round(ohOnsiteBaseDisplay * rates.custOH);

    const ohOnsiteForGA = Math.round(ohOnsiteBaseForGA * rates.custOH);

    const ohOffsite = Math.round((ohOffsiteBase + fringeOffsite) * rates.colOH);

    const ohSMH = Math.round(smhBase * rates.smh);

    const totalDirectCosts =
      totalLabor +
      item.travel +
      item.material +
      item.odc +
      item.subcontracts +
      item.unburden;

    const totalIndirectCosts =
      fringeOnsite +
      fringeOffsite +
      fringeAero +
      ohOnsiteForGA +
      ohOffsite +
      ohSMH;

    const directPlusOH = totalDirectCosts + totalIndirectCosts;

    const gaBase =
      directPlusOH -
      (item.material + item.subcontracts + item.unburden + ohSMH);

    catBases[cat] = {
      ohOnsiteBase: ohOnsiteBaseDisplay,
      ohOffsiteBase,
      smhBase,
      gaBase,
    };

    baseTotals.onsite += ohOnsiteBaseDisplay;

    baseTotals.offsite += ohOffsiteBase;

    baseTotals.smh += smhBase;

    baseTotals.ga += gaBase;
  }

  // =========================================================
  // EXACT SAME ROW VALUES AS UI
  // =========================================================
  const categoryNames = [
    "Cost-Type",
    "Flexibly Priced",
    "T&M",
    "Fixed Price",
    "Commercial",
    "IR&D&BP",
  ];

  const rows = categoryNames.map((type) => {
    const cb = catBases[type] || {
      ohOnsiteBase: 0,
      ohOffsiteBase: 0,
      smhBase: 0,
      gaBase: 0,
    };

    return {
      type,

      onsiteAmount: cb.ohOnsiteBase,
      onsitePct:
        baseTotals.onsite === 0 ? 0 : cb.ohOnsiteBase / baseTotals.onsite,

      offsiteAmount: cb.ohOffsiteBase,
      offsitePct:
        baseTotals.offsite === 0 ? 0 : cb.ohOffsiteBase / baseTotals.offsite,

      smhAmount: cb.smhBase,
      smhPct: baseTotals.smh === 0 ? 0 : cb.smhBase / baseTotals.smh,

      gaAmount: cb.gaBase,
      gaPct: baseTotals.ga === 0 ? 0 : cb.gaBase / baseTotals.ga,

      ref: type === "Cost-Type" ? "SCHED H" : '"',
    };
  });

  // EXACT SAME TOTAL ROW
  rows.push({
    type: "Total",

    onsiteAmount: baseTotals.onsite,
    onsitePct: baseTotals.onsite === 0 ? 0 : 1,

    offsiteAmount: baseTotals.offsite,
    offsitePct: baseTotals.offsite === 0 ? 0 : 1,

    smhAmount: baseTotals.smh,
    smhPct: baseTotals.smh === 0 ? 0 : 1,

    gaAmount: baseTotals.ga,
    gaPct: baseTotals.ga === 0 ? 0 : 1,

    ref: "",
    total: true,
  });

  return {
    rows,
    rates,
    baseTotals,
  };
};

// =========================================================
// SCHEDULE H-1
// =========================================================
const addScheduleH1 = async (
  workbook,
  { companyName = "", companyAddress = "", year = FISCAL_YEAR } = {},
) => {
  // =========================================================
  // IMPORTANT:
  // getScheduleH1Data() must use the EXACT API + mapping +
  // calculations from SchedHCont.jsx.
  // =========================================================
  const { rows } = await getScheduleH1Data(year);

  const ws = workbook.addWorksheet("Schedule H Cont");

  // ---------------------------------------------------------
  // COLORS
  // ---------------------------------------------------------
  const YELLOW = "FFFF00";
  const CYAN = "2BBEC3";
  const PERCENT_CYAN = "28C0C5";
  const BLUE = "29258F";
  const BLACK = "222222";

  const thinBlack = {
    style: "thin",
    color: { argb: BLACK },
  };

  // ---------------------------------------------------------
  // COLUMNS
  // ---------------------------------------------------------
  ws.columns = [
    { width: 20 }, // A Contract Type
    { width: 18 }, // B Onsite Amount
    { width: 12 }, // C Onsite %
    { width: 18 }, // D Offsite Amount
    { width: 12 }, // E Offsite %
    { width: 18 }, // F SM&H Amount
    { width: 12 }, // G SM&H %
    { width: 18 }, // H G&A Amount
    { width: 12 }, // I G&A %
    { width: 18 }, // J Ref
  ];

  // ---------------------------------------------------------
  // DEFAULT FONT / ROW HEIGHT
  // ---------------------------------------------------------
  for (let r = 1; r <= 40; r++) {
    ws.getRow(r).height = 20;

    for (let c = 1; c <= 10; c++) {
      ws.getCell(r, c).font = {
        name: "Arial",
        size: 10,
        color: { argb: "000000" },
      };
    }
  }

  // ---------------------------------------------------------
  // TOP LINKS
  // ---------------------------------------------------------
  ws.getCell("A1").value = "Schedule H-1 is linked to the following schedules:";

  ws.getCell("A1").font = {
    name: "Arial",
    size: 10,
  };

  ws.getCell("A2").value = "Schedule H, Contract Costs";

  ws.getCell("A2").font = {
    name: "Arial",
    size: 10,
    underline: true,
    color: { argb: "00158F" },
  };

  ws.getCell("A3").value = "ICE MANUAL";

  ws.getCell("A3").font = {
    name: "Arial",
    size: 9,
    underline: true,
    color: { argb: "00158F" },
  };

  // ---------------------------------------------------------
  // RIGHT HEADER
  // ---------------------------------------------------------
  ws.mergeCells("J1:J2");

  ws.getCell("J1").value = "Schedule H-1\nICE (version 2.0.1h)";

  ws.getCell("J1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("J1").alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  // ---------------------------------------------------------
  // COMPANY BANNER
  // ---------------------------------------------------------
  ws.mergeCells("B4:I5");

  ws.getCell("B4").value = `${companyName}\n${companyAddress}`;

  ws.getCell("B4").font = {
    name: "Arial",
    size: 11,
    bold: true,
  };

  ws.getCell("B4").alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  ws.getCell("B4").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: YELLOW },
  };

  // ---------------------------------------------------------
  // TITLE
  // ---------------------------------------------------------
  ws.mergeCells("B6:I7");

  ws.getCell("B6").value =
    "Subsidiary Schedule of\nGovernment Participation Percentages";

  ws.getCell("B6").font = {
    name: "Arial",
    size: 11,
    bold: true,
  };

  ws.getCell("B6").alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  // ---------------------------------------------------------
  // FISCAL YEAR
  // ---------------------------------------------------------
  ws.mergeCells("B8:I8");

  ws.getCell("B8").value = `Fiscal Year End - 12/31/${year}`;

  ws.getCell("B8").font = {
    name: "Arial",
    size: 11,
    bold: true,
  };

  ws.getCell("B8").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  ws.getCell("B8").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: YELLOW },
  };

  // ---------------------------------------------------------
  // TABLE HEADER
  // ---------------------------------------------------------
  const headerRow = 11;

  ws.getCell(`A${headerRow}`).value = "Contract Type";

  ws.getCell(`B${headerRow}`).value = "OH - Onsite";

  ws.getCell(`D${headerRow}`).value = "OH - Offsite";

  ws.getCell(`F${headerRow}`).value = "SM&H";

  ws.getCell(`H${headerRow}`).value = "G&A";

  ws.getCell(`J${headerRow}`).value = "Ref.";

  ws.mergeCells(`B${headerRow}:C${headerRow}`);
  ws.mergeCells(`D${headerRow}:E${headerRow}`);
  ws.mergeCells(`F${headerRow}:G${headerRow}`);
  ws.mergeCells(`H${headerRow}:I${headerRow}`);

  // Main section headers
  [2, 4, 6, 8].forEach((col) => {
    const cell = ws.getCell(headerRow, col);

    cell.font = {
      name: "Arial",
      size: 11,
      bold: true,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: YELLOW },
    };

    cell.border = {
      top: thinBlack,
      bottom: thinBlack,
    };
  });

  ws.getCell(`A${headerRow}`).font = {
    name: "Arial",
    size: 11,
    bold: true,
  };

  ws.getCell(`J${headerRow}`).font = {
    name: "Arial",
    size: 11,
    bold: true,
  };

  ws.getCell(`A${headerRow}`).border = {
    bottom: thinBlack,
  };

  ws.getCell(`J${headerRow}`).border = {
    bottom: thinBlack,
  };

  // ---------------------------------------------------------
  // SUB HEADERS
  // ---------------------------------------------------------
  const subHeaderRow = 12;

  ws.getCell(`B${subHeaderRow}`).value = "Overhead\nBase Amount";

  ws.getCell(`C${subHeaderRow}`).value = "%";

  ws.getCell(`D${subHeaderRow}`).value = "Overhead\nBase Amount";

  ws.getCell(`E${subHeaderRow}`).value = "%";

  ws.getCell(`F${subHeaderRow}`).value = "Overhead\nBase Amount";

  ws.getCell(`G${subHeaderRow}`).value = "%";

  ws.getCell(`H${subHeaderRow}`).value = "G&A\nBase Amount";

  ws.getCell(`I${subHeaderRow}`).value = "%";

  for (let col = 2; col <= 9; col++) {
    const cell = ws.getCell(subHeaderRow, col);

    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      bottom: thinBlack,
    };
  }

  ws.getRow(subHeaderRow).height = 35;

  // =========================================================
  // DATA
  // =========================================================
  const startRow = 13;

  rows.forEach((item, index) => {
    const r = startRow + index;

    const isTotal = item.total === true;

    // -------------------------------------------------------
    // CONTRACT TYPE
    // -------------------------------------------------------
    ws.getCell(r, 1).value = item.type || "";

    ws.getCell(r, 1).font = {
      name: "Arial",
      size: 10,
      bold: isTotal,
    };

    ws.getCell(r, 1).alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    // -------------------------------------------------------
    // AMOUNTS
    //
    // getScheduleH1Data() should return NUMBERS here.
    // Do not use the UI formatted strings such as "12,345".
    // -------------------------------------------------------
    const amountValues = [
      item.onsiteAmount,
      item.offsiteAmount,
      item.smhAmount,
      item.gaAmount,
    ];

    [2, 4, 6, 8].forEach((col, index) => {
      const cell = ws.getCell(r, col);

      const value = amountValues[index];

      cell.value =
        value === null || value === undefined || value === ""
          ? 0
          : Number(value) || 0;

      cell.font = {
        name: "Arial",
        size: 10,
        bold: isTotal,
      };

      cell.alignment = {
        horizontal: "right",
        vertical: "middle",
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: isTotal ? CYAN : YELLOW,
        },
      };

      cell.border = {
        bottom: thinBlack,
      };

      cell.numFmt = "#,##0;(#,##0);-";
    });

    // -------------------------------------------------------
    // PERCENTAGES
    //
    // IMPORTANT:
    // getScheduleH1Data() returns ratios:
    //
    // 0.25 => 25.0%
    // 0.753 => 75.3%
    //
    // Excel formats these using 0.0%.
    // -------------------------------------------------------
    const percentageValues = [
      item.onsitePct,
      item.offsitePct,
      item.smhPct,
      item.gaPct,
    ];

    [3, 5, 7, 9].forEach((col, index) => {
      const cell = ws.getCell(r, col);

      const value = percentageValues[index];

      cell.value =
        value === null || value === undefined || value === ""
          ? 0
          : Number(value) || 0;

      cell.font = {
        name: "Arial",
        size: 10,
        bold: isTotal,
      };

      cell.alignment = {
        horizontal: "right",
        vertical: "middle",
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: isTotal ? CYAN : PERCENT_CYAN,
        },
      };

      cell.border = {
        bottom: thinBlack,
      };

      cell.numFmt = "0.0%";
    });

    // -------------------------------------------------------
    // REFERENCE
    // -------------------------------------------------------
    const refCell = ws.getCell(r, 10);

    refCell.value = item.ref || "";

    refCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    if (item.ref === "SCHED H") {
      refCell.font = {
        name: "Arial",
        size: 10,
        bold: true,
        underline: true,
        color: { argb: "FFFFFF" },
      };

      refCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BLUE },
      };
    }
  });

  // =========================================================
  // LEGEND
  // =========================================================
  const legendRow = startRow + rows.length + 3;

  // Linked
  ws.mergeCells(`A${legendRow}:B${legendRow}`);

  ws.getCell(`A${legendRow}`).value = "Linked to Other Worksheet";

  ws.getCell(`A${legendRow}`).font = {
    name: "Arial",
    size: 10,
  };

  ws.getCell(`A${legendRow}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: YELLOW },
  };

  // Formula
  ws.mergeCells(`A${legendRow + 2}:B${legendRow + 2}`);

  ws.getCell(`A${legendRow + 2}`).value = "Cell Contains a Formula";

  ws.getCell(`A${legendRow + 2}`).font = {
    name: "Arial",
    size: 10,
  };

  ws.getCell(`A${legendRow + 2}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: CYAN },
  };

  // ---------------------------------------------------------
  // VIEW
  // ---------------------------------------------------------
  ws.views = [
    {
      state: "frozen",
      ySplit: 12,
    },
  ];

  // ---------------------------------------------------------
  // PAGE SETUP
  // ---------------------------------------------------------
  ws.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    horizontalDpi: 300,
    verticalDpi: 300,
  };

  ws.pageSetup.margins = {
    left: 0.25,
    right: 0.25,
    top: 0.5,
    bottom: 0.5,
    header: 0.2,
    footer: 0.2,
  };

  return ws;
};

// ============================================================
// SUMMARY SCHEDULE H
// ============================================================

const getSummaryScheduleHData = async (year = 2025) => {
  const response = await fetch(`${backendUrl}/api/JobCostLedger`);

  if (!response.ok) {
    throw new Error(`Job Cost Ledger API failed: ${response.status}`);
  }

  const data = await response.json();

  const acc = {
    laborOnsite: 0,
    laborOffsite: 0,
    laborAero: 0,
    material: 0,
    travel: 0,
    odc: 0,
    subcontracts: 0,
    unburden: 0,
  };

  data.forEach((row) => {
    if (Number(row.year) !== Number(year)) return;

    const amount = parseFloat(row.amount) || 0;

    if (
      row.acctId === "50-00-01" ||
      row.acctId === "50-00-98" ||
      row.acctId === "59-00-01"
    ) {
      if (row.orgId === "1.1.01") {
        acc.laborAero += amount;
      } else {
        acc.laborOnsite += amount;
      }
    } else if (row.acctId === "50-00-02") {
      acc.laborOffsite += amount;
    } else if (
      row.acctId &&
      (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
    ) {
      acc.travel += amount;
    } else if (["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)) {
      acc.material += amount;
    } else if (
      ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(row.acctId)
    ) {
      acc.odc += amount;
    } else if (
      ["50-21-01", "50-21-02", "50-21-03", "50-21-04", "50-22-01"].includes(
        row.acctId,
      )
    ) {
      acc.subcontracts += amount;
    } else if (["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)) {
      acc.unburden += amount;
    }
  });

  const totals = {
    laborOnsite: Math.round(acc.laborOnsite),
    laborOffsite: Math.round(acc.laborOffsite),
    laborAero: Math.round(acc.laborAero),
    material: Math.round(acc.material),
    travel: Math.round(acc.travel),
    odc: Math.round(acc.odc),
    subcontracts: Math.round(acc.subcontracts),
    unburden: Math.round(acc.unburden),
  };

  const totalLabor =
    totals.laborOnsite + totals.laborOffsite + totals.laborAero;

  const totalDirectCosts =
    totalLabor +
    totals.material +
    totals.travel +
    totals.odc +
    totals.subcontracts +
    totals.unburden;

  return {
    ...totals,
    totalLabor,
    totalDirectCosts,
  };
};

const addSummaryScheduleH = async (
  workbook,
  { companyName = "", companyAddress = "", year = 2025 } = {},
) => {
  const data = await getSummaryScheduleHData(year);

  const ws = workbook.addWorksheet("Schedule Summary H", {
    views: [{ showGridLines: false }],
  });

  // =========================================================
  // COLORS - SAME AS JSX
  // =========================================================

  const YELLOW = "FFFF00";
  const CYAN = "29BEC2";
  const GRAY = "A8A8A8";
  const BLUE = "1717A8";
  const BLACK = "000000";
  const WHITE = "FFFFFF";

  const thinBlack = {
    style: "thin",
    color: { argb: BLACK },
  };

  const dashedGray = {
    style: "dashed",
    color: { argb: "666666" },
  };

  const noBorder = {
    style: "thin",
    color: { argb: "FFFFFF" },
  };

  // =========================================================
  // COLUMN WIDTHS
  //
  // UI:
  // 302 | 100 | 100 | 110 | 110 | 100 | 100 | 75 | 55
  // =========================================================

  ws.columns = [
    { width: 42 },
    { width: 14 },
    { width: 14 },
    { width: 15 },
    { width: 15 },
    { width: 14 },
    { width: 14 },
    { width: 11 },
    { width: 8 },
  ];

  // =========================================================
  // HELPERS
  // =========================================================

  const setFont = (cell, opts = {}) => {
    cell.font = {
      name: "Arial",
      size: 10,
      color: { argb: BLACK },
      ...opts,
    };
  };

  const setLabel = (
    row,
    col,
    value,
    { bold = false, indent = 0, align = "left" } = {},
  ) => {
    const cell = ws.getCell(row, col);
    cell.value = value;

    setFont(cell, {
      bold,
      size: 10,
    });

    cell.alignment = {
      horizontal: align,
      vertical: "middle",
      indent,
      wrapText: true,
    };

    return cell;
  };

  const setValue = (
    row,
    col,
    value,
    { fill = null, bold = false, borderBottom = false, align = "right" } = {},
  ) => {
    const cell = ws.getCell(row, col);

    cell.value = value;

    setFont(cell, {
      bold,
      size: 10,
    });

    cell.alignment = {
      horizontal: align,
      vertical: "middle",
    };

    if (fill) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fill },
      };
    }

    if (borderBottom) {
      cell.border = {
        bottom: thinBlack,
      };
    }

    if (typeof value === "number") {
      cell.numFmt = "#,##0;(#,##0);-";
    }

    return cell;
  };

  const setDashLine = (row, col) => {
    const cell = ws.getCell(row, col);

    cell.border = {
      bottom: dashedGray,
    };

    cell.alignment = {
      vertical: "middle",
    };

    return cell;
  };

  const setReference = (row, col, text) => {
    const cell = ws.getCell(row, col);

    cell.value = text;

    cell.font = {
      name: "Arial",
      size: 9,
      bold: true,
      underline: true,
      color: { argb: WHITE },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BLUE },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: {
        style: "thin",
        color: { argb: BLUE },
      },
      bottom: {
        style: "thin",
        color: { argb: BLUE },
      },
      left: {
        style: "thin",
        color: { argb: BLUE },
      },
      right: {
        style: "thin",
        color: { argb: BLUE },
      },
    };

    return cell;
  };

  const amount = (value) => {
    return value === 0 ? "-" : value;
  };

  // =========================================================
  // HEADER
  // =========================================================

  // =========================================================
  // HEADER
  // =========================================================

  ws.mergeCells("B2:G3");
  ws.mergeCells("B5:G6");

  setLabel(2, 1, "Summary Schedule H is linked from the following schedules:");

  setLabel(3, 1, "Schedule H, Contract Costs", {
    align: "left",
  });

  setLabel(4, 1, "Schedule E, Indirect Rate", {
    align: "left",
  });

  setLabel(5, 1, "ICE MANUAL", {
    align: "left",
  });

  ws.getCell("A5").font = {
    name: "Arial",
    size: 10,
    underline: true,
    color: { argb: "000099" },
  };

  // Company banner
  ws.getCell("B2").value = `${companyName}\n${companyAddress}`;

  ws.getCell("B2").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("B2").alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  ws.getCell("B2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };

  // Main title
  ws.getCell("B5").value =
    `Summary Schedule H of Direct Contract/Subcontract/IR&D/B&P Costs\nFiscal Year End - 12/31/${year}`;

  ws.getCell("B5").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("B5").alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  ws.getCell("B5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };

  ws.getRow(2).height = 20;
  ws.getRow(3).height = 20;
  ws.getRow(5).height = 20;
  ws.getRow(6).height = 20;

  // =========================================================
  // DIRECT COST HEADER
  // =========================================================

  let r = 8;

  const headers = [
    "DIRECT COST ELEMENTS",
    "OH - Onsite",
    "OH - Offsite",
    "AERO OH Onsite",
    "CONTRACT\nTOTAL",
    "IR&D/B&P\nTOTAL",
    "GRAND\nTOTAL",
    "Ref.",
    "Notes",
  ];

  headers.forEach((value, i) => {
    const cell = ws.getCell(r, i + 1);

    cell.value = value;

    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "bottom",
      wrapText: true,
    };

    cell.border = {
      bottom: thinBlack,
    };
  });

  ws.getRow(r).height = 32;

  // =========================================================
  // DIRECT COST ROW
  // =========================================================

  const addDirectRow = ({
    label,
    onsite = null,
    offsite = null,
    aero = null,
    contract,
    irbp = "-",
    grand,
    reference = "",
    note = "",
    bold = false,
    totalRow = false,
  }) => {
    r++;

    setLabel(r, 1, label, {
      bold,
      indent: 1,
    });

    if (onsite !== null) {
      setValue(r, 2, amount(onsite), {
        fill: YELLOW,
      });
    } else {
      setDashLine(r, 2);
    }

    if (offsite !== null) {
      setValue(r, 3, amount(offsite), {
        fill: YELLOW,
      });
    } else {
      setDashLine(r, 3);
    }

    if (aero !== null) {
      setValue(r, 4, amount(aero), {
        fill: YELLOW,
      });
    } else {
      setDashLine(r, 4);
    }

    setValue(r, 5, amount(contract), {
      fill: CYAN,
      bold: totalRow,
      borderBottom: totalRow,
    });

    setValue(r, 6, irbp, {
      fill: totalRow ? CYAN : YELLOW,
      bold: totalRow,
      borderBottom: totalRow,
    });

    setValue(r, 7, amount(grand), {
      fill: CYAN,
      bold: totalRow,
      borderBottom: totalRow,
    });

    if (reference) {
      setReference(r, 8, reference);
    }

    if (note) {
      setLabel(r, 9, note);
    }

    ws.getRow(r).height = 20;
  };

  addDirectRow({
    label: "Direct Contract Labor",
    onsite: data.laborOnsite,
    offsite: data.laborOffsite,
    aero: data.laborAero,
    contract: data.totalLabor,
    grand: data.totalLabor,
    reference: "Sched H",
    bold: true,
  });

  addDirectRow({
    label: "Direct Material",
    contract: data.material,
    grand: data.material,
  });

  addDirectRow({
    label: "Travel",
    contract: data.travel,
    grand: data.travel,
  });

  addDirectRow({
    label: "Other Direct Costs (ODC)",
    contract: data.odc,
    grand: data.odc,
  });

  addDirectRow({
    label: "Subcontracts",
    contract: data.subcontracts,
    grand: data.subcontracts,
  });

  addDirectRow({
    label: "Unburden Teammate Cost",
    contract: data.unburden,
    grand: data.unburden,
  });

  addDirectRow({
    label: "TOT. DIR. CONTRACT COSTS",
    contract: data.totalDirectCosts,
    irbp: "-",
    grand: data.totalDirectCosts,
    bold: true,
    totalRow: true,
  });

  // =========================================================
  // IR&D / B&P
  // =========================================================

  r += 2;

  ws.mergeCells(r, 1, r, 1);

  setLabel(r, 1, "IR&D AND B&P COSTS", {
    bold: true,
  });

  ws.getCell(r, 1).border = {
    bottom: thinBlack,
  };

  r += 2;

  const addIRBPRow = ({
    label,
    fill = YELLOW,
    reference = "",
    note = "",
    total = false,
    gray = false,
  }) => {
    r++;

    setLabel(r, 1, label, {
      indent: 1,
      bold: total,
    });

    for (let c = 2; c <= 6; c++) {
      ws.getCell(r, c).value = null;
    }

    setValue(r, 7, "-", {
      fill: gray ? GRAY : fill,
      bold: total,
    });

    if (reference) {
      setReference(r, 8, reference);
    }

    if (note) {
      setLabel(r, 9, note);
    }

    ws.getRow(r).height = 20;
  };

  addIRBPRow({
    label: "IR&D Labor",
    reference: "Sched H",
  });

  addIRBPRow({
    label: "B&P Labor",
  });

  addIRBPRow({
    label: "Subtotal IR&D/B&P Labor",
    fill: CYAN,
    total: true,
  });

  addIRBPRow({
    label: "IR&D Labor Fringe (NOTE 1)",
    fill: CYAN,
    reference: "Sched E",
    note: "RATES",
  });

  addIRBPRow({
    label: "B&P Labor Fringe (NOTE 1)",
    fill: CYAN,
    reference: "Sched H",
    note: "RATES",
  });

  addIRBPRow({
    label: "IR&D Material",
  });

  addIRBPRow({
    label: "B&P Material",
  });

  addIRBPRow({
    label: "IR&D Subcontract",
    gray: true,
  });

  addIRBPRow({
    label: "B&P Subcontract",
    reference: "Sched H",
  });

  addIRBPRow({
    label: "IR&D Other Costs",
  });

  addIRBPRow({
    label: "B&P Other Costs",
  });

  addIRBPRow({
    label: "TOTAL IR&D/B&P",
    fill: CYAN,
    total: true,
  });

  // =========================================================
  // SCREEN 2
  // =========================================================

  r += 3;

  const addContinuedRow = ({
    label,
    fill = YELLOW,
    reference = "",
    gray = false,
    total = false,
  }) => {
    r++;

    setLabel(r, 1, label, {
      indent: 1,
      bold: total,
    });

    setValue(r, 7, "-", {
      fill: gray ? GRAY : fill,
      bold: total,
    });

    if (reference) {
      setReference(r, 8, reference);
    }

    ws.getRow(r).height = 20;
  };

  addContinuedRow({
    label: "B&P Material",
  });

  addContinuedRow({
    label: "IR&D Material Overhead (NOTE 1)",
    gray: true,
  });

  addContinuedRow({
    label: "B&P Material Overhead (NOTE 1)",
    gray: true,
  });

  addContinuedRow({
    label: "IR&D Other Costs",
    reference: "Sched H",
  });

  addContinuedRow({
    label: "B&P Other Costs",
  });

  addContinuedRow({
    label: "TOTAL IR&D/B&P",
    fill: CYAN,
    total: true,
  });

  // =========================================================
  // TOTAL DIRECT LABOR
  // =========================================================

  r += 2;

  setLabel(r, 1, "TOTAL DIRECT LABOR", {
    bold: true,
  });

  ws.getCell(r, 1).border = {
    bottom: thinBlack,
  };

  r += 1;

  setLabel(r, 1, "Total Contract Labor", {
    indent: 1,
  });

  setValue(r, 5, amount(data.totalLabor), {
    fill: CYAN,
  });

  setLabel(r, 7, "- see total above", {
    indent: 1,
  });

  r++;

  setLabel(r, 1, "Total IR&D/B&P Labor", {
    indent: 1,
  });

  setValue(r, 5, amount(data.totalLabor), {
    fill: CYAN,
    borderBottom: true,
  });

  setLabel(r, 7, "to Schedule G and L", {
    indent: 1,
  });

  r++;

  setLabel(r, 1, "TOTAL CONTRACT/IR&D/B&P LABOR", {
    bold: true,
  });

  // =========================================================
  // NOTES
  // =========================================================

  r += 2;

  setLabel(r, 1, "Explanatory Notes:", {
    bold: true,
  });

  ws.getCell(r, 1).font = {
    name: "Arial",
    size: 10,
    bold: true,
    underline: true,
  };

  r += 2;

  ws.mergeCells(r, 1, r, 9);

  setLabel(
    r,
    1,
    "1. Total direct costs include teammate nonreimbursable fee, however burden not applied and did not claim it during the billing.",
  );

  r++;

  ws.mergeCells(r, 1, r, 9);

  setLabel(
    r,
    1,
    "2. Summary Schedule H represents total incurred costs per the General Ledger to ensure a complete tie-out to the FY 2025 Financial Statements. All contract-specific exclusions, unallowable costs, and limitations are itemized and adjusted on Schedule I and Supplement A-4 to reach the final claimed allowable totals.",
  );

  ws.getRow(r).height = 35;

  // =========================================================
  // LEGEND
  // =========================================================

  r += 2;

  const legendStart = r;

  const legend = [
    ["Linked to Other Worksheet", YELLOW, "As Referenced"],
    ["Cell Contains a Formula", CYAN, "Totals, Claimed and Differences"],
    [
      "Cell Contains a Formula With Links",
      GRAY,
      "Complex formulas, linked between Sched E and H",
    ],
  ];

  legend.forEach(([label, fill, explanation], index) => {
    const row = legendStart + index;

    ws.mergeCells(row, 1, row, 3);

    const labelCell = ws.getCell(row, 1);

    labelCell.value = label;
    labelCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fill },
    };

    labelCell.font = {
      name: "Arial",
      size: 10,
    };

    labelCell.alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    ws.mergeCells(row, 4, row, 9);

    const explanationCell = ws.getCell(row, 4);

    explanationCell.value = explanation;
    explanationCell.font = {
      name: "Arial",
      size: 10,
    };

    explanationCell.alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    ws.getRow(row).height = 20;
  });

  // =========================================================
  // GENERAL ALIGNMENT / FONT
  // =========================================================

  ws.eachRow((row) => {
    row.eachCell((cell) => {
      if (!cell.font || !cell.font.name) {
        cell.font = {
          name: "Arial",
          size: 10,
        };
      }

      if (!cell.alignment) {
        cell.alignment = {
          vertical: "middle",
        };
      }
    });
  });

  // =========================================================
  // PRINT / PAGE SETUP
  // =========================================================

  ws.views = [
    {
      showGridLines: false,
      state: "normal",
    },
  ];

  ws.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 2,
    horizontalDpi: 300,
    verticalDpi: 300,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.35,
      bottom: 0.35,
      header: 0.1,
      footer: 0.1,
    },
  };

  ws.pageSetup.printArea = `A1:I${r}`;

  ws.pageSetup.horizontalCentered = false;

  ws.freezePanes = {
    xSplit: 0,
    ySplit: 8,
  };

  return ws;
};

const getScheduleIDataForExport = async (year = FISCAL_YEAR) => {
  const [ledgerRes, schedKRes, scheduleIRes, ratesRes] = await Promise.all([
    fetch(`${backendUrl}/api/JobCostLedger`),
    fetch(`${backendUrl}/api/TrialBalance/ScheduleK`),
    fetch(`${backendUrl}/api/TrialBalance/GetScheduleIDataByYear/${year}`),
    fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=${year}`),
  ]);

  const ledgerData = ledgerRes.ok ? await ledgerRes.json() : [];
  const schedKData = schedKRes.ok ? await schedKRes.json() : [];
  const scheduleIData = scheduleIRes.ok ? await scheduleIRes.json() : [];
  const ratesData = ratesRes.ok ? await ratesRes.json() : null;

  const savedByReportLvl = {};
  (Array.isArray(scheduleIData) ? scheduleIData : []).forEach((item) => {
    if (item.reportLvl) savedByReportLvl[String(item.reportLvl).trim()] = item;
  });

  // ===========================================================
  // RATES — extracted exactly as SchedI.jsx's buildRows() does, from
  // the same scheduleDA_cost payload Schedule A/Schedule DA use. The
  // previous export never fetched this at all, so flex-row "Current
  // Year Cost" was just a raw ledger sum with no fringe/OH/G&A burden
  // applied — this restores that calculation.
  // ===========================================================
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

  const flexGroup = {};
  const lookupDict = {};

  // ===========================================================
  // MAPPING THE LEDGER TO SCHEDULE H CATEGORIES — same project-type
  // categorization as SchedI.jsx. NOTE: "Flexibly Priced" is the
  // DEFAULT category (not just CPFF/CPAF) — anything that isn't
  // specifically T&M / Fixed Price / Commercial / IR&D&B&P falls
  // through to "Flexibly Priced" and is included here. The previous
  // export only matched CPFF/CPAF directly, which silently dropped
  // every default-category flex row.
  // ===========================================================
  (Array.isArray(ledgerData) ? ledgerData : []).forEach((row) => {
    const key = row.reportLvl || row.projId;
    if (!key) return;

    if (!lookupDict[key]) {
      lookupDict[key] = {
        contract: row.primeCntrId || "",
        sub: row.subctrId || "",
      };
    }

    if (Number(row.year) === Number(year)) {
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
        } else if (["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)) {
          flexGroup[key].material += amount;
        } else if (
          ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(row.acctId)
        ) {
          flexGroup[key].odc += amount;
        } else if (
          ["50-21-01", "50-21-02", "50-21-03", "50-21-04", "50-22-01"].includes(
            row.acctId,
          )
        ) {
          flexGroup[key].subcontracts += amount;
        } else if (["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)) {
          flexGroup[key].unburden += amount;
        }
      }
    }
  });

  // ===========================================================
  // SCHEDULE H "GRAND TOTAL" BURDEN CALC — same math as SchedI.jsx's
  // buildRows(): direct costs -> fringe -> overhead -> G&A. The
  // result is written back into `.amount` so the existing generic
  // buildRows(group) below (shared with the T&M rows, which need no
  // burden calc) can stay unchanged.
  // ===========================================================
  Object.values(flexGroup).forEach((rawItem) => {
    const laborOnsite = Math.round(rawItem.laborOnsite);
    const laborOffsite = Math.round(rawItem.laborOffsite);
    const laborAero = Math.round(rawItem.laborAero);
    const travel = Math.round(rawItem.travel);
    const material = Math.round(rawItem.material);
    const odc = Math.round(rawItem.odc);
    const subcontracts = Math.round(rawItem.subcontracts);
    const unburden = Math.round(rawItem.unburden);

    const totalLabor = laborOnsite + laborOffsite + laborAero;
    const totalDirectCosts =
      totalLabor + travel + material + odc + subcontracts + unburden;

    const fringeOnsite = Math.round(laborOnsite * rates.fringe);
    const fringeOffsite = Math.round(laborOffsite * rates.fringe);
    const fringeAero = Math.round(laborAero * rates.aeroFringe);

    const ohOnsiteBase = laborOnsite + fringeOnsite + laborAero + fringeAero;
    const ohOffsiteBase = laborOffsite + fringeOffsite;
    const smhBase = material + subcontracts;

    const ohOnsite = Math.round(ohOnsiteBase * rates.custOH);
    const ohOffsite = Math.round(ohOffsiteBase * rates.colOH);
    const ohSMH = Math.round(smhBase * rates.smh);

    const totalIndirectCosts =
      fringeOnsite + fringeOffsite + fringeAero + ohOnsite + ohOffsite + ohSMH;

    const directPlusOH = totalDirectCosts + totalIndirectCosts;
    const gaBase = directPlusOH - (material + subcontracts + unburden + ohSMH);
    const gaApplied = Math.round(gaBase * rates.ga);

    const grandTotal = directPlusOH + gaApplied;

    // Feeds straight into buildRows(group) below via item.amount, same
    // field the T&M group already uses.
    rawItem.amount = grandTotal;
  });

  const tmGroup = {};
  (Array.isArray(schedKData) ? schedKData : []).forEach((row) => {
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

  // Mirrors buildRows()'s per-row math in SchedI.jsx exactly
  const buildRows = (group) =>
    Object.values(group).map((item) => {
      const reportLvl = String(item.order).trim();
      const saved = savedByReportLvl[reportLvl] || null;

      const currentYear = Number(item.amount) || 0;
      const priorYear = saved?.pyCost != null ? Number(saved.pyCost) : 0;

      const pyrSettledAmt =
        saved?.pyrSettledAmt != null
          ? Number(saved.pyrSettledAmt)
          : saved?.pyr_Settled_Amt != null
            ? Number(saved.pyr_Settled_Amt)
            : 0;

      const cumulative = priorYear + currentYear;
      const netCumulative =
        saved?.netCum != null ? Number(saved.netCum) : cumulative;
      const limitation = cumulative - netCumulative;
      const billedAmt = Number(saved?.billedAmt) || 0;

      return {
        contract: item.contract || saved?.primeCntrId || "",
        sub: item.sub || saved?.subctrId || "",
        reportLvl,
        penaltyClause: saved?.penaltyClause ?? saved?.penalty_Clause ?? "",
        pyrSettledAmt,
        priorYear,
        currentYear,
        cumulative,
        limitation,
        netCumulative,
        pvNo: saved?.pvNo || "",
        billedDt: saved?.billedDt || null,
        billedAmt,
        overUnderBilling: billedAmt - netCumulative,
        completeFl: !!saved?.completeFl,
        note: saved?.note ?? saved?.Note ?? "",
      };
    });

  const flexRows = buildRows(flexGroup);
  const tmRows = buildRows(tmGroup);

  const sumField = (rows, field) =>
    rows.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);

  const totalsFor = (rows) => ({
    cum: sumField(rows, "cumulative"),
    net: sumField(rows, "netCumulative"),
    billed: sumField(rows, "billedAmt"),
    overUnder: sumField(rows, "overUnderBilling"),
  });

  return {
    flexRows,
    tmRows,
    flexTotals: totalsFor(flexRows),
    tmTotals: totalsFor(tmRows),
  };
};

const addScheduleI = async (
  workbook,
  {
    companyName = COMPANY_NAME,
    companyAddress = COMPANY_ADDRESS,
    year = FISCAL_YEAR,
  } = {},
) => {
  const { flexRows, tmRows, flexTotals, tmTotals } =
    await getScheduleIDataForExport(year);

  const worksheet = workbook.addWorksheet("Schedule I");
  setupWorksheet(worksheet);

  addCompanyHeader(worksheet, {
    companyName,
    companyAddress,
    scheduleName: "SCHEDULE I",
    title:
      "Schedule of Cumulative Direct and Indirect Costs Claimed and Billed by Contract and Subcontract",
  });

  worksheet.mergeCells("B6:F6");
  setCell(worksheet.getCell("B6"), `Fiscal Year End - 12/31/${year}`, {
    bold: true,
    align: "center",
    fill: YELLOW,
  });

  // --- "Schedule I is linked to the following schedules" block ------------
  // Was missing entirely from the previous export. Note: unlike other
  // schedules, the JSX's <a> tags here have NO onClick handler at all
  // (they're plain styled text, not real navigation), so these are
  // intentionally plain text — no hyperlinks — to match exactly. Placed
  // in column 18, past the table's 16 columns, so it can't collide with
  // the two-tier table header.
  const topLinksCol = 18;
  const topLinks = [
    "Schedule I is linked to the following schedules:",
    "Schedule H, Contract Costs",
    "Schedule K, T&M",
    "ICE MANUAL",
  ];
  topLinks.forEach((text, idx) => {
    const cell = worksheet.getCell(idx + 1, topLinksCol);
    setCell(cell, text, {
      underline: idx > 0,
      color: idx > 0 ? BLUE : undefined,
      fontSize: 9,
      align: "left",
    });
  });
  // -------------------------------------------------------------------

  /* =========================================================
     Two-tier header — matches the JSX's top-header + column-header rows
  ========================================================= */
  const topRow = 8;
  const colRow = 9;
  const LAST_COL = 16;

  worksheet.mergeCells(topRow, 1, topRow, 5);

  worksheet.mergeCells(topRow, 6, topRow, 7);
  setCell(
    worksheet.getCell(topRow, 6),
    "Unsettled/Claimed Direct And Indirect Costs Using",
    { bold: true, align: "center" },
  );

  worksheet.mergeCells(topRow, 8, colRow, 8);
  setCell(worksheet.getCell(topRow, 8), "Total Cumulative Settled or Claimed", {
    bold: true,
    align: "center",
  });

  worksheet.mergeCells(topRow, 9, colRow, 9);
  setCell(
    worksheet.getCell(topRow, 9),
    "Less Contract Limitations Rebates/Credits",
    { bold: true, align: "center" },
  );

  worksheet.mergeCells(topRow, 10, colRow, 10);
  setCell(worksheet.getCell(topRow, 10), "Net Cumulative Settled or Claimed", {
    bold: true,
    align: "center",
  });

  worksheet.mergeCells(topRow, 11, topRow, 13);
  setCell(
    worksheet.getCell(topRow, 11),
    "Cumulative Cost Billed (Manual Entry)",
    {
      bold: true,
      align: "center",
    },
  );

  worksheet.mergeCells(topRow, 14, colRow, 14);
  setCell(worksheet.getCell(topRow, 14), "Over (Under) Billing", {
    bold: true,
    align: "center",
  });

  worksheet.mergeCells(topRow, 15, colRow, 15);
  setCell(worksheet.getCell(topRow, 15), "Physically Complete (Note 7)", {
    bold: true,
    align: "center",
  });

  worksheet.mergeCells(topRow, 16, colRow, 16);
  setCell(worksheet.getCell(topRow, 16), "Note", {
    bold: true,
    align: "center",
  });

  worksheet.getRow(topRow).height = 30;

  const columnHeaders = [
    "Contract No.",
    "Subcontract No.",
    "Order No.",
    "Subject To Penalty Clause Note (2)",
    "Prior Years Settled Total Costs Note (3)",
    "Prior Year Costs FYE Note (4)",
    "Current Year Costs FYE Note (4)",
    null,
    null,
    null, // rowspan from top header
    "PV No.",
    "Date Cost Billed Through",
    "Amount",
    null,
    null,
    null, // rowspan from top header
  ];

  columnHeaders.forEach((h, i) => {
    if (h === null) return;
    const cell = worksheet.getCell(colRow, i + 1);
    setCell(cell, h, { bold: true, align: "center" });
    cell.alignment = { ...cell.alignment, wrapText: true, vertical: "middle" };
  });

  worksheet.getRow(colRow).height = 45;
  applyBottomBorder(worksheet.getRow(colRow), 1, LAST_COL);

  let row = colRow + 1;

  /* =========================================================
     Column style map — matches JSX cell classes exactly
     yellow = linked from another sheet/API, not editable
     cyan   = same-sheet formula
     others = editable/plain
  ========================================================= */
  const MONEY_COLS = [4, 5, 6, 7, 8, 9, 12, 13];
  const YELLOW_COLS = [0, 1, 2, 6]; // contract, sub, order, currentYear
  const CYAN_COLS = [7, 9, 13]; // cumulative, netCumulative, overUnder
  const LEFT_COLS = [0, 1, 2, 10, 15]; // contract, sub, order, pvNo, note

  const alignFor = (i) => {
    if (MONEY_COLS.includes(i)) return "right";
    if (LEFT_COLS.includes(i)) return "left";
    return "center";
  };

  const fillFor = (i) => {
    if (YELLOW_COLS.includes(i)) return YELLOW;
    if (CYAN_COLS.includes(i)) return CYAN;
    return null;
  };

  const writeSection = (sectionLabel, sectionText, rows, navLabel, totals) => {
    worksheet.mergeCells(row, 1, row, LAST_COL);
    linkToSheet(worksheet.getCell(row, 1), navLabel);
    worksheet.getCell(row, 1).alignment = {
      horizontal: "left",
      vertical: "middle",
    };
    worksheet.getRow(row).height = 20;
    setCell(worksheet.getCell(row, 2), sectionText, { bold: true });
    row++;

    if (rows.length === 0) {
      worksheet.mergeCells(row, 1, row, LAST_COL);
      setCell(worksheet.getCell(row, 1), "No data available", {
        italic: true,
        align: "center",
      });
      row++;
    }

    rows.forEach((item) => {
      const values = [
        item.contract,
        item.sub,
        item.reportLvl,
        item.penaltyClause,
        item.pyrSettledAmt,
        item.priorYear,
        item.currentYear,
        item.cumulative,
        item.limitation,
        item.netCumulative,
        item.pvNo,
        item.billedDt ? formatDateToString(new Date(item.billedDt)) : "",
        item.billedAmt,
        item.overUnderBilling,
        item.completeFl ? "Y" : "N",
        item.note,
      ];

      values.forEach((v, i) => {
        const cell = worksheet.getCell(row, i + 1);
        const isMoney = MONEY_COLS.includes(i);
        setCell(cell, isMoney ? numberValue(v) : v, {
          align: alignFor(i),
          fill: fillFor(i),
        });
        if (isMoney) cell.numFmt = INT_FMT;
      });
      row++;
    });

    const totalRow = row;
    worksheet.mergeCells(totalRow, 1, totalRow, 7);
    setCell(worksheet.getCell(totalRow, 1), `Subtotal - ${sectionLabel}`, {
      bold: true,
      underline: true,
    });
    setCell(worksheet.getCell(totalRow, 8), totals.cum, {
      bold: true,
      fill: CYAN,
      align: "right",
    });
    setCell(worksheet.getCell(totalRow, 10), totals.net, {
      bold: true,
      fill: CYAN,
      align: "right",
    });
    setCell(worksheet.getCell(totalRow, 13), totals.billed, {
      bold: true,
      fill: CYAN,
      align: "right",
    });
    setCell(worksheet.getCell(totalRow, 14), totals.overUnder, {
      bold: true,
      fill: CYAN,
      align: "right",
    });
    [8, 10, 13, 14].forEach(
      (c) => (worksheet.getCell(totalRow, c).numFmt = INT_FMT),
    );
    applyBottomBorder(worksheet.getRow(totalRow), 1, LAST_COL);
    row += 2;
  };

  writeSection(
    "Cost & Flexibly Priced Contracts",
    "Cost Type & Flexibly Priced:",
    flexRows,
    "Sched H",
    flexTotals,
  );

  writeSection(
    "Time & Material Contracts",
    "Time & Material",
    tmRows,
    "Sched K",
    tmTotals,
  );

  const grandTotals = {
    cum: flexTotals.cum + tmTotals.cum,
    net: flexTotals.net + tmTotals.net,
    billed: flexTotals.billed + tmTotals.billed,
    overUnder: flexTotals.overUnder + tmTotals.overUnder,
  };

  // Total heading row (matches JSX's separate "total-heading" row)
  worksheet.mergeCells(row, 1, row, LAST_COL);
  setCell(
    worksheet.getCell(row, 1),
    "Total - Cost/Flexibly Priced and Time & Material Contracts",
    { bold: true, align: "center" },
  );
  row++;

  // Grand total values row (no label, matches JSX)
  setCell(worksheet.getCell(row, 8), grandTotals.cum, {
    bold: true,
    fill: CYAN,
    align: "right",
  });
  setCell(worksheet.getCell(row, 10), grandTotals.net, {
    bold: true,
    fill: CYAN,
    align: "right",
  });
  setCell(worksheet.getCell(row, 13), grandTotals.billed, {
    bold: true,
    fill: CYAN,
    align: "right",
  });
  setCell(worksheet.getCell(row, 14), grandTotals.overUnder, {
    bold: true,
    fill: CYAN,
    align: "right",
  });
  [8, 10, 13, 14].forEach((c) => (worksheet.getCell(row, c).numFmt = INT_FMT));
  applyBottomBorder(worksheet.getRow(row), 1, LAST_COL);
  row += 3;

  /* =========================================================
     Notes — verbatim from SchedI.jsx <Notes/>
  ========================================================= */
  worksheet.mergeCells(row, 1, row, LAST_COL);
  setCell(worksheet.getCell(row, 1), "Explanatory Notes:", {
    bold: true,
    underline: true,
  });
  row++;

  const notes = [
    "1. Fiscal Year 2025 represents initial formal Incurred Cost Submission (ICS). The amounts reflected in Schedule I, Column 'Prior Year Costs' (Note 4), represent the cumulative actual costs incurred on flexibly priced contracts from their respective inception dates through December 31, 2024. Historically, these contracts were not subject to formal ICS filing requirements; however, prior year actuals have been included herein to establish the accurate cumulative-to-date cost position and to ensure proper reconciliation with life-to-date billings.",
    "2. Revenue totals in the Financial Statements include a $1,029.30 revenue accrual that does not have corresponding costs on project C1435.001. This revenue accrual is excluded from the Incurred Cost Submission as no allowable costs were incurred or billed related to this balance in FY 2025.",
    "3. Project C1800.U is non billable project and it has $382K labor costs accrued for 12/29 & 12/31, which is allowable cost. These costs were accrued to a nonbillable project code C1800.U in the General Ledger to exclude from NASA 533 reporting but are properly allocable to the active project C1800.C for the period of 12/29–12/31. Hence shown as under billed and ensures proper matching of incurred costs to contract billings and revenue for FY 2025. The unbilled in accounting system tie back to the under bill amount of this project on this schedule 'I'.",
    "4. Contract limitation of $276K updated for project C1800.C as the cost not billed/claimed towards the teammate's Fee.",
  ];

  notes.forEach((n) => {
    worksheet.mergeCells(row, 1, row, LAST_COL);
    const cell = worksheet.getCell(row, 1);
    setCell(cell, n, { fontSize: 9, align: "left" });
    cell.alignment = { ...cell.alignment, wrapText: true, vertical: "top" };
    worksheet.getRow(row).height = 30;
    row++;
  });

  row += 1;

  // Legend — matches the 3 legend rows in the JSX exactly
  worksheet.mergeCells(row, 1, row, 3);
  setCell(worksheet.getCell(row, 1), "Linked to Other Worksheet", {
    fill: YELLOW,
  });
  setCell(
    worksheet.getCell(row, 4),
    "Current Year Contract Costs, Schedule H and K",
  );
  row++;

  worksheet.mergeCells(row, 1, row, 3);
  setCell(worksheet.getCell(row, 1), "Cell Contains a Formula", { fill: CYAN });
  setCell(
    worksheet.getCell(row, 4),
    "Formulas calculate Total and Net Cumulative Claimed and or Settled Amounts",
  );
  row++;

  worksheet.mergeCells(row, 1, row, 3);
  setCell(worksheet.getCell(row, 1), "Cell Contains a Formula With Links", {
    fill: "CFCFCF",
  });
  setCell(worksheet.getCell(row, 4), "None");
  row++;

  worksheet.columns = [
    { width: 16 },
    { width: 16 },
    { width: 14 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 16 },
    { width: 14 },
    { width: 16 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 10 },
    { width: 14 },
    { width: 3 },
    { width: 34 },
  ];

  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
  };

  return worksheet;
};

//Shcdule H
const getScheduleHData = async (year = 2025) => {
  const [ledgerResponse, ratesResponse] = await Promise.all([
    fetch(`${backendUrl}/api/JobCostLedger`),
    fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=${year}`),
  ]);

  if (!ledgerResponse.ok) {
    throw new Error(`Job Cost Ledger API failed: ${ledgerResponse.status}`);
  }

  if (!ratesResponse.ok) {
    throw new Error(`Schedule D(A) API failed: ${ratesResponse.status}`);
  }

  const ledgerData = await ledgerResponse.json();
  const ratesData = await ratesResponse.json();

  // =====================================================
  // SAME RATE MAPPING AS SCHEDULE H JSX
  // =====================================================

  const rates = {
    fringe: 0,
    aeroFringe: 0,
    custOH: 0,
    colOH: 0,
    smh: 0,
    ga: 0,
  };

  if (ratesData?.schedules) {
    ratesData.schedules.forEach((schedule) => {
      const rate = Number(schedule.rate || 0) / 100;

      if (schedule.name === "Fringe Pool") {
        rates.fringe = rate;
      } else if (schedule.name === "AERO Fringe") {
        rates.aeroFringe = rate;
      } else if (schedule.name === "Customer Site Overhead") {
        rates.custOH = rate;
      } else if (schedule.name === "Columbus Site Overhead") {
        rates.colOH = rate;
      } else if (schedule.name === "Subk & Material Handling") {
        rates.smh = rate;
      } else if (
        schedule.name === "General and Administrative (G&A) Expenses"
      ) {
        rates.ga = rate;
      }
    });
  }

  // =====================================================
  // SAME GROUPING AS JSX
  // =====================================================

  const grouped = {
    A: {},
    B: {},
    C: {},
    D: {},
    E: {},
  };

  ledgerData
    .filter((row) => Number(row.year) === Number(year))
    .forEach((row) => {
      const key = row.reportLvl || row.projId;

      if (!key) return;

      let section = "B";

      const projectType = (row.projType || "").toUpperCase();

      if (
        projectType.includes("CPFF") ||
        projectType.includes("COST") ||
        projectType.includes("CPAF")
      ) {
        section = "A";
      } else if (projectType.includes("T&M") || projectType.includes("TIME")) {
        section = "C";
      } else if (projectType.includes("FIXED") || projectType === "FFP") {
        section = "D";
      } else if (projectType.includes("COMMERCIAL")) {
        section = "E";
      }

      if (!grouped[section][key]) {
        grouped[section][key] = {
          jobOrder: key,
          contractNumber: row.primeCntrId || "",
          subcontractNumber: row.subctrId || "",

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

      // =================================================
      // LABOR
      // =================================================

      if (row.acctId === "50-00-01" || row.acctId === "50-00-98") {
        if (row.orgId === "1.1.01") {
          grouped[section][key].laborAero += amount;
        } else {
          grouped[section][key].laborOnsite += amount;
        }
      }

      // =================================================
      // OFFSITE LABOR
      // =================================================
      else if (row.acctId === "50-00-02") {
        grouped[section][key].laborOffsite += amount;
      }

      // =================================================
      // TRAVEL
      // =================================================
      else if (
        row.acctId &&
        (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
      ) {
        grouped[section][key].travel += amount;
      }

      // =================================================
      // MATERIAL
      // =================================================
      else if (["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)) {
        grouped[section][key].material += amount;
      }

      // =================================================
      // ODC
      // =================================================
      else if (["50-50-01", "50-50-02", "50-50-03"].includes(row.acctId)) {
        grouped[section][key].odc += amount;
      }

      // =================================================
      // SUBCONTRACTS
      // =================================================
      else if (
        ["50-21-01", "50-21-02", "50-21-03", "50-21-04", "50-22-01"].includes(
          row.acctId,
        )
      ) {
        grouped[section][key].subcontracts += amount;
      }

      // =================================================
      // UNBURDEN TEAMMATE COST
      // =================================================
      else if (["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)) {
        grouped[section][key].unburden += amount;
      }
    });

  // =====================================================
  // SAME FORMAT/CALCULATION AS JSX
  // =====================================================

  const formatSection = (sectionObject) => {
    return Object.values(sectionObject).map((item) => {
      // -----------------------------------------------
      // Direct Labor
      // -----------------------------------------------

      const totalLabor = item.laborOnsite + item.laborOffsite + item.laborAero;

      // -----------------------------------------------
      // Direct Costs
      // -----------------------------------------------

      const totalDirectCosts =
        totalLabor +
        item.travel +
        item.material +
        item.odc +
        item.subcontracts +
        item.unburden;

      // -----------------------------------------------
      // Fringe
      // -----------------------------------------------

      const fringeOnsite = item.laborOnsite * rates.fringe;

      const fringeOffsite = item.laborOffsite * rates.fringe;

      const fringeAero = item.laborAero * rates.aeroFringe;

      // -----------------------------------------------
      // Overhead
      // Same formulas as JSX
      // -----------------------------------------------

      const ohOnsite =
        (item.laborOnsite + fringeOnsite + item.laborAero + fringeAero) *
        rates.custOH;

      const ohOffsite = (item.laborOffsite + totalLabor) * rates.colOH;

      const ohSMH = (item.material + item.subcontracts) * rates.smh;

      // -----------------------------------------------
      // Total Indirect Costs
      // -----------------------------------------------

      const totalIndirectCosts =
        fringeOnsite +
        fringeOffsite +
        fringeAero +
        ohOnsite +
        ohOffsite +
        ohSMH;

      // -----------------------------------------------
      // Direct + OH
      // -----------------------------------------------

      const directPlusOH = totalDirectCosts + totalIndirectCosts;

      // -----------------------------------------------
      // G&A Base
      // -----------------------------------------------

      const gaBase =
        directPlusOH -
        (item.travel +
          item.material +
          item.odc +
          item.subcontracts +
          item.unburden);

      // -----------------------------------------------
      // G&A Applied
      // -----------------------------------------------

      const gaApplied = gaBase * rates.ga;

      // -----------------------------------------------
      // Total Costs
      // -----------------------------------------------

      const totalCosts = directPlusOH + gaApplied;

      return {
        jobOrder: item.jobOrder,
        contractNumber: item.contractNumber,
        subcontractNumber: item.subcontractNumber,

        laborOnsite: item.laborOnsite,
        laborOffsite: item.laborOffsite,
        laborAero: item.laborAero,

        totalLabor,

        travel: item.travel,
        material: item.material,
        odc: item.odc,
        subcontracts: item.subcontracts,
        unburden: item.unburden,

        totalDirectCosts,

        fringeOnsite,
        fringeOffsite,
        fringeAero,

        ohOnsite,
        ohOffsite,
        ohSMH,

        directPlusOH,
        gaBase,
        gaApplied,
        totalCosts,
      };
    });
  };

  return {
    rates,

    sectionA: formatSection(grouped.A),
    sectionB: formatSection(grouped.B),
    sectionC: formatSection(grouped.C),
    sectionD: formatSection(grouped.D),
    sectionE: formatSection(grouped.E),
  };
};

const addScheduleH = async (
  workbook,
  companyName,
  companyAddress,
  year = 2025,
) => {
  const { rates, sectionA, sectionB, sectionC, sectionD, sectionE } =
    await getScheduleHData(year);

  const ws = workbook.addWorksheet("Schedule H");

  // =====================================================
  // SAME HEADERS AS JSX
  // =====================================================

  const headers = [
    "JOB ORDER",
    "CONTRACT NUMBER",
    "SUBCONTRACT NUMBER",
    "Labor OH - Onsite",
    "Labor OH - Offsite",
    "Labor AERO OH Onsite",
    "Total Labor",
    "Travel",
    "Material",
    "ODC",
    "Sub-Contracts",
    "Unburden Teammate Cost",
    "Direct Costs",
    "Claimed Fringe OH - Onsite",
    "Claimed Fringe OH - Offsite",
    "Claimed Fringe AERO OH Onsite",
    "Claimed O/H OH - Onsite",
    "Claimed O/H OH - Offsite",
    "Claimed O/H SM&H",
    "Direct Costs Plus O/H & Fringe",
    "G&A Base (Value Added)",
    "Claimed G&A Applied",
    "Total Costs",
    "Total COM",
    "Grand Total",
  ];

  // =====================================================
  // COLORS
  // =====================================================

  const CYAN = "FF29BEC2";
  const GREY = "FFA8A8A8";
  const LIGHT_GREY = "FFF1F1F1";
  const HEADER_GREY = "FFEFEFEF";
  const YELLOW = "FFFFFF00";
  const BLUE = "FF29258F";
  const BLACK = "FF444444";
  const WHITE = "FFFFFFFF";

  // Same cell background logic as JSX
  const cellBg = (index) => {
    if ([6, 12, 19, 20, 22, 24].includes(index)) {
      return CYAN;
    }

    if (index >= 13 && index <= 18) {
      return GREY;
    }

    return LIGHT_GREY;
  };

  // =====================================================
  // COLUMN WIDTHS
  // =====================================================

  const widths = [
    16, 28, 24, 17, 17, 20, 15, 13, 13, 12, 17, 22, 17, 20, 20, 23, 20, 20, 18,
    25, 22, 20, 17, 17, 17,
  ];

  ws.columns = headers.map((header, index) => ({
    header,
    key: `col${index}`,
    width: widths[index],
  }));

  // =====================================================
  // HEADER
  // =====================================================

  ws.mergeCells("A1:C1");

  ws.getCell("A1").value = "Schedule H is linked to the following schedules:";

  ws.getCell("A2").value = "Schedule A - Applied Overhead, G&A, & COM Rates";

  ws.getCell("A3").value = "Summary Schedule H";

  ws.getCell("A4").value = "Schedule H-1 Govt Participation";

  ws.getCell("A5").value = "ICE MANUAL";

  ws.getCell("A5").font = {
    color: {
      argb: "FF0D2B86",
    },
    underline: true,
  };

  // Company
  ws.mergeCells("D1:T1");
  ws.mergeCells("D2:T2");

  ws.getCell("D1").value = companyName;

  ws.getCell("D2").value = companyAddress;

  ["D1", "D2"].forEach((cellAddress) => {
    const cell = ws.getCell(cellAddress);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: YELLOW,
      },
    };

    cell.font = {
      bold: true,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  });

  // Title
  ws.mergeCells("D4:T4");
  ws.mergeCells("D5:T5");

  ws.getCell("D4").value = "Schedule of Direct Costs by Contract/Subcontract";

  ws.getCell("D5").value = "and Indirect Expense Applied at Claimed Rates";

  ["D4", "D5"].forEach((cellAddress) => {
    ws.getCell(cellAddress).font = {
      bold: true,
    };

    ws.getCell(cellAddress).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  });

  ws.mergeCells("D6:T6");

  ws.getCell("D6").value = `Fiscal Year End - 12/31/${year}`;

  ws.getCell("D6").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: YELLOW,
    },
  };

  ws.getCell("D6").font = {
    bold: true,
  };

  ws.getCell("D6").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // Schedule H
  ws.mergeCells("U1:Y1");
  ws.mergeCells("U2:Y2");

  ws.getCell("U1").value = "SCHEDULE H";

  ws.getCell("U2").value = "ICE (version 2.0.1h)";

  ws.getCell("U1").font = {
    bold: true,
  };

  ws.getCell("U2").font = {
    bold: true,
  };

  ws.getCell("U1").alignment = {
    horizontal: "center",
  };

  ws.getCell("U2").alignment = {
    horizontal: "center",
  };

  // =====================================================
  // SCHED A REFERENCE BARS
  // =====================================================

  ws.mergeCells("T8:U8");

  ws.getCell("T8").value = "Sched A";

  ws.getCell("T8").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: BLUE,
    },
  };

  ws.getCell("T8").font = {
    bold: true,
    color: {
      argb: WHITE,
    },
    underline: true,
  };

  ws.getCell("T8").alignment = {
    horizontal: "center",
  };

  ws.getCell("Y8").value = "Sched A";

  ws.getCell("Y8").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: BLUE,
    },
  };

  ws.getCell("Y8").font = {
    bold: true,
    color: {
      argb: WHITE,
    },
    underline: true,
  };

  ws.getCell("Y8").alignment = {
    horizontal: "center",
  };

  // =====================================================
  // TABLE HEADER
  // =====================================================

  const headerRow = ws.addRow(headers);

  headerRow.height = 48;

  headerRow.eachCell((cell, columnNumber) => {
    const index = columnNumber - 1;

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: HEADER_GREY,
      },
    };

    cell.font = {
      bold: true,
      size: 9,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      right: {
        style: "thin",
        color: {
          argb: BLACK,
        },
      },
      bottom: {
        style: "thin",
        color: {
          argb: BLACK,
        },
      },
    };
  });

  // =====================================================
  // ROW FORMATTER
  // =====================================================

  const addDataRow = (item) => {
    const values = [
      item.jobOrder,
      item.contractNumber,
      item.subcontractNumber,

      item.laborOnsite,
      item.laborOffsite,
      item.laborAero,
      item.totalLabor,

      item.travel,
      item.material,
      item.odc,
      item.subcontracts,
      item.unburden,

      item.totalDirectCosts,

      item.fringeOnsite,
      item.fringeOffsite,
      item.fringeAero,

      item.ohOnsite,
      item.ohOffsite,
      item.ohSMH,

      item.directPlusOH,
      item.gaBase,
      item.gaApplied,
      item.totalCosts,

      0,

      item.totalCosts,
    ];

    const row = ws.addRow(values);

    row.height = 18;

    row.eachCell((cell, columnNumber) => {
      const index = columnNumber - 1;

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: cellBg(index),
        },
      };

      cell.border = {
        right: {
          style: "thin",
          color: {
            argb: BLACK,
          },
        },
        bottom: {
          style: "thin",
          color: {
            argb: BLACK,
          },
        },
      };

      cell.alignment = {
        horizontal: index < 3 ? "left" : "right",
        vertical: "middle",
      };

      if (index >= 3) {
        cell.numFmt = "#,##0;(#,##0);-";
      }
    });

    return row;
  };

  // =====================================================
  // SECTION
  // =====================================================

  const addSection = (title, rows, totalLabel, emptyRows = 1) => {
    const sectionRow = ws.addRow([title]);

    ws.mergeCells(`A${sectionRow.number}:Y${sectionRow.number}`);

    sectionRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFD0D0D0",
      },
    };

    sectionRow.getCell(1).font = {
      bold: true,
      size: 11,
    };

    sectionRow.getCell(1).alignment = {
      vertical: "middle",
    };

    if (rows.length === 0) {
      for (let i = 0; i < emptyRows; i++) {
        const empty = Array(headers.length).fill("");

        const emptyRow = ws.addRow(empty);

        emptyRow.height = 18;

        emptyRow.eachCell((cell, columnNumber) => {
          const index = columnNumber - 1;

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: cellBg(index),
            },
          };

          cell.border = {
            right: {
              style: "thin",
              color: {
                argb: BLACK,
              },
            },
            bottom: {
              style: "thin",
              color: {
                argb: BLACK,
              },
            },
          };
        });
      }
    } else {
      rows.forEach(addDataRow);
    }

    // Blank row
    ws.addRow([]);

    // =================================================
    // TOTAL
    // =================================================

    const totals = calculateScheduleHTotal(rows);

    const totalValues = [
      "",
      "",
      "",
      totals.laborOnsite,
      totals.laborOffsite,
      totals.laborAero,
      totals.totalLabor,
      totals.travel,
      totals.material,
      totals.odc,
      totals.subcontracts,
      totals.unburden,
      totals.totalDirectCosts,
      totals.fringeOnsite,
      totals.fringeOffsite,
      totals.fringeAero,
      totals.ohOnsite,
      totals.ohOffsite,
      totals.ohSMH,
      totals.directPlusOH,
      totals.gaBase,
      totals.gaApplied,
      totals.totalCosts,
      0,
      totals.totalCosts,
    ];

    const totalRow = ws.addRow(totalValues);

    totalRow.height = 18;

    // Merge first 3 cells for label
    ws.mergeCells(`A${totalRow.number}:C${totalRow.number}`);

    totalRow.getCell(1).value = totalLabel;

    totalRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: CYAN,
      },
    };

    totalRow.getCell(1).font = {
      bold: true,
    };

    totalRow.getCell(1).alignment = {
      vertical: "middle",
    };

    for (let col = 4; col <= headers.length; col++) {
      const cell = totalRow.getCell(col);

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: CYAN,
        },
      };

      cell.font = {
        bold: true,
      };

      cell.alignment = {
        horizontal: "right",
        vertical: "middle",
      };

      cell.numFmt = "#,##0;(#,##0);-";

      cell.border = {
        right: {
          style: "thin",
          color: {
            argb: BLACK,
          },
        },
        bottom: {
          style: "thin",
          color: {
            argb: BLACK,
          },
        },
      };
    }
  };

  // =====================================================
  // TOTAL CALCULATION
  // SAME AS calcTotal() IN JSX
  // =====================================================

  const calculateScheduleHTotal = (rows) => {
    const totals = {
      laborOnsite: 0,
      laborOffsite: 0,
      laborAero: 0,
      totalLabor: 0,

      travel: 0,
      material: 0,
      odc: 0,
      subcontracts: 0,
      unburden: 0,

      totalDirectCosts: 0,

      fringeOnsite: 0,
      fringeOffsite: 0,
      fringeAero: 0,

      ohOnsite: 0,
      ohOffsite: 0,
      ohSMH: 0,

      directPlusOH: 0,
      gaBase: 0,
      gaApplied: 0,
      totalCosts: 0,
    };

    rows.forEach((item) => {
      totals.laborOnsite += Number(item.laborOnsite || 0);

      totals.laborOffsite += Number(item.laborOffsite || 0);

      totals.laborAero += Number(item.laborAero || 0);

      totals.totalLabor += Number(item.totalLabor || 0);

      totals.travel += Number(item.travel || 0);

      totals.material += Number(item.material || 0);

      totals.odc += Number(item.odc || 0);

      totals.subcontracts += Number(item.subcontracts || 0);

      totals.unburden += Number(item.unburden || 0);

      totals.totalDirectCosts += Number(item.totalDirectCosts || 0);

      totals.fringeOnsite += Number(item.fringeOnsite || 0);

      totals.fringeOffsite += Number(item.fringeOffsite || 0);

      totals.fringeAero += Number(item.fringeAero || 0);

      totals.ohOnsite += Number(item.ohOnsite || 0);

      totals.ohOffsite += Number(item.ohOffsite || 0);

      totals.ohSMH += Number(item.ohSMH || 0);

      totals.directPlusOH += Number(item.directPlusOH || 0);

      totals.gaBase += Number(item.gaBase || 0);

      totals.gaApplied += Number(item.gaApplied || 0);

      totals.totalCosts += Number(item.totalCosts || 0);
    });

    return totals;
  };

  // =====================================================
  // SECTIONS A-E
  // =====================================================

  addSection(
    "A. COST TYPE (no entry on title line)",
    sectionA,
    "A. TOTAL COST TYPE:",
    1,
  );

  addSection(
    "B. OTHER FLEXIBLY PRICED",
    sectionB,
    "B. TOTAL OTHER FLEXIBLY PRICED",
    2,
  );

  addSection("C. TIME & MAT'L", sectionC, "C. TOTAL TIME & MAT'L", 1);

  addSection("D. FIXED PRICE", sectionD, "D. TOTAL FIXED PRICE", 2);

  addSection("E. COMMERCIAL WORK", sectionE, "E. TOTAL COMMERCIAL WORK", 2);

  // =====================================================
  // GRAND CONTRACT TOTAL
  // =====================================================

  const allRows = [
    ...sectionA,
    ...sectionB,
    ...sectionC,
    ...sectionD,
    ...sectionE,
  ];

  const grandTotals = calculateScheduleHTotal(allRows);

  const grandValues = [
    "",
    "",
    "",
    grandTotals.laborOnsite,
    grandTotals.laborOffsite,
    grandTotals.laborAero,
    grandTotals.totalLabor,
    grandTotals.travel,
    grandTotals.material,
    grandTotals.odc,
    grandTotals.subcontracts,
    grandTotals.unburden,
    grandTotals.totalDirectCosts,
    grandTotals.fringeOnsite,
    grandTotals.fringeOffsite,
    grandTotals.fringeAero,
    grandTotals.ohOnsite,
    grandTotals.ohOffsite,
    grandTotals.ohSMH,
    grandTotals.directPlusOH,
    grandTotals.gaBase,
    grandTotals.gaApplied,
    grandTotals.totalCosts,
    0,
    grandTotals.totalCosts,
  ];

  const contractTotalRow = ws.addRow(grandValues);

  ws.mergeCells(`A${contractTotalRow.number}:C${contractTotalRow.number}`);

  contractTotalRow.getCell(1).value = "TOTAL CONTRACT COSTS";

  contractTotalRow.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: CYAN,
    },
  };

  contractTotalRow.getCell(1).font = {
    bold: true,
  };

  for (let col = 4; col <= headers.length; col++) {
    const cell = contractTotalRow.getCell(col);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: CYAN,
      },
    };

    cell.font = {
      bold: true,
    };

    cell.numFmt = "#,##0;(#,##0);-";

    cell.alignment = {
      horizontal: "right",
    };
  }

  // =====================================================
  // IR&D
  // =====================================================

  const irndRow = ws.addRow(Array(headers.length).fill("-"));

  irndRow.getCell(1).value = "";
  irndRow.getCell(2).value = "IR & D";

  // =====================================================
  // B&P
  // =====================================================

  const bnpRow = ws.addRow(Array(headers.length).fill("-"));

  bnpRow.getCell(1).value = "";
  bnpRow.getCell(2).value = "B&P";

  // =====================================================
  // TOTAL IR&D / B&P
  // JSX uses all "-"
  // =====================================================

  const irndBnpTotal = ws.addRow(Array(headers.length).fill("-"));

  ws.mergeCells(`A${irndBnpTotal.number}:C${irndBnpTotal.number}`);

  irndBnpTotal.getCell(1).value = "TOTAL IR & D/B & P";

  irndBnpTotal.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: CYAN,
    },
  };

  irndBnpTotal.getCell(1).font = {
    bold: true,
  };

  for (let col = 4; col <= headers.length; col++) {
    irndBnpTotal.getCell(col).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: CYAN,
      },
    };
  }

  // =====================================================
  // GRAND TOTAL
  // =====================================================

  const grandTotalRow = ws.addRow(grandValues);

  ws.mergeCells(`A${grandTotalRow.number}:C${grandTotalRow.number}`);

  grandTotalRow.getCell(1).value = "GRAND TOTAL";

  grandTotalRow.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: CYAN,
    },
  };

  grandTotalRow.getCell(1).font = {
    bold: true,
  };

  for (let col = 4; col <= headers.length; col++) {
    const cell = grandTotalRow.getCell(col);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: CYAN,
      },
    };

    cell.font = {
      bold: true,
    };

    cell.numFmt = "#,##0;(#,##0);-";
  }

  // =====================================================
  // EXPLANATORY NOTES
  // =====================================================

  ws.addRow([]);
  ws.addRow([]);

  const notesTitle = ws.addRow(["Explanatory Notes:"]);

  ws.mergeCells(`A${notesTitle.number}:Y${notesTitle.number}`);

  notesTitle.getCell(1).font = {
    bold: true,
    underline: true,
  };

  ws.addRow(["1. Direct costs not claimed are explained in Schedule G"]);

  ws.addRow([
    "2. Claimed indirect expense rates are applicable to cost-type and flexibly-priced effort.",
  ]);

  ws.addRow([
    "3. Teammate cost ODC, Travel and Fee, doesn't apply the burden as per contract requirement. Hense shown separately on the schedule.",
  ]);

  // =====================================================
  // LEGEND
  // =====================================================

  ws.addRow([]);

  const legend1 = ws.addRow(["Linked to Other Worksheet"]);

  ws.mergeCells(`A${legend1.number}:C${legend1.number}`);

  legend1.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: YELLOW,
    },
  };

  const legend2 = ws.addRow(["Cell Contains a Formula"]);

  ws.mergeCells(`A${legend2.number}:C${legend2.number}`);

  legend2.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: CYAN,
    },
  };

  const legend3 = ws.addRow([
    "Cell Contains a Formula With Links",
    "",
    "",
    "Complex Formulas, using Claimed Rates from Schedule A",
  ]);

  ws.mergeCells(`A${legend3.number}:C${legend3.number}`);

  ws.mergeCells(`D${legend3.number}:J${legend3.number}`);

  legend3.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: GREY,
    },
  };

  legend3.getCell(4).alignment = {
    vertical: "middle",
  };

  // =====================================================
  // FREEZE
  // =====================================================

  ws.views = [
    {
      state: "frozen",
      ySplit: 9,
    },
  ];

  // =====================================================
  // PAGE SETUP
  // =====================================================

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  ws.pageSetup.margins = {
    left: 0.25,
    right: 0.25,
    top: 0.5,
    bottom: 0.5,
    header: 0.2,
    footer: 0.2,
  };
};

// Schedule J

/* =========================================================
   Fetch Schedule J live from the backend — replaces the
   dead localStorage read. Mirrors fetchScheduleJData() in
   SchedJ.jsx exactly (same grouping + row-array shape).
========================================================= */
const getScheduleJData = async (year = 2025) => {
  const emptyResult = {
    costType: [],
    tm: [],
    incentive: [],
    idiq: [],
    interdivision: [],
  };

  try {
    const token =
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${backendUrl}/api/ScheduleJ?year=${year}`, {
      headers,
    });

    if (!response.ok) return emptyResult;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return emptyResult;

    const grouped = {
      costType: [],
      tm: [],
      incentive: [],
      idiq: [],
      interdivision: [],
    };

    data.forEach((item) => {
      const secKey = item.subcType || "costType";
      const targetKey = grouped[secKey] ? secKey : "costType";

      const rowArr = [
        item.subcNo || "",
        item.prmCntrNo || "",
        item.prmCntrAmt != null ? String(item.prmCntrAmt) : "",
        item.subcNameAddr || "",
        item.subcDunsNo || "",
        item.pocPhoneNo || "",
        item.subcAmt != null ? String(item.subcAmt) : "",
        item.popStartDt || "",
        item.popEndDt || "",
        item.incrPriorYrAmt != null ? String(item.incrPriorYrAmt) : "",
        item.awardType || "",
      ];

      grouped[targetKey].push(rowArr);
    });

    return grouped;
  } catch (err) {
    console.warn("Could not fetch Schedule J records for export:", err);
    return emptyResult;
  }
};

const addScheduleJ = async (
  workbook,
  {
    companyName = import.meta.env?.VITE_COMPANY_NAME || "Revolve FinTech LLC",
    companyAddress = import.meta.env?.VITE_COMPANY_ADDRESS ||
      "Vienna, VA 22182",
    fiscalYearEnd = "2025-12-31",
  } = {},
) => {
  // Derive year exactly like getYear() does in the JSX
  const year = (() => {
    if (!fiscalYearEnd) return 2025;
    const parts = fiscalYearEnd.split("-");
    return parts.length > 0 ? parseInt(parts[0], 10) || 2025 : 2025;
  })();

  const sectionRows = await getScheduleJData(year);

  const ws = workbook.addWorksheet("Schedule J");

  // ---------------------------------------------------------
  // HEADER
  // ---------------------------------------------------------

  ws.mergeCells("A1:L1");
  ws.getCell("A1").value = companyName;
  ws.getCell("A1").font = { name: "Times New Roman", size: 14, bold: true };
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.mergeCells("A2:L2");
  ws.getCell("A2").value = companyAddress;
  ws.getCell("A2").font = { name: "Times New Roman", size: 14, bold: true };
  ws.getCell("A2").alignment = { horizontal: "center" };
  ws.getCell("A2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.mergeCells("A4:L4");
  ws.getCell("A4").value = "Subcontractor Information";
  ws.getCell("A4").font = { name: "Times New Roman", size: 15, bold: true };
  ws.getCell("A4").alignment = { horizontal: "center" };

  ws.mergeCells("A5:L5");
  ws.getCell("A5").value = `Fiscal Year End - ${fiscalYearEnd}`;
  ws.getCell("A5").font = { name: "Times New Roman", size: 14, bold: true };
  ws.getCell("A5").alignment = { horizontal: "center" };
  ws.getCell("A5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  // ---------------------------------------------------------
  // TABLE HEADERS — two-tier, matches the JSX's
  // "Performance Period" colSpan-2 header + From/To sub-row
  // ---------------------------------------------------------

  const topHeaders = [
    { text: "", col: 1 },
    { text: "SUBCONTRACT NO.", col: 2 },
    { text: "PRIME CONTRACT NO.", col: 3 },
    { text: "PRIME CONTRACT VALUE", col: 4 },
    { text: "SUBCONTRACTOR'S NAME & ADDRESS", col: 5 },
    { text: "SUBCONTRACTOR'S DUNS NUMBER", col: 6 },
    { text: "POINT OF CONTACT AND PHONE NO.", col: 7 },
    { text: "SUBCONTRACT VALUE", col: 8 },
    { text: "Performance Period", col: 9, span: 2 }, // spans 9-10
    { text: "SUBCONTRACT INCURRED IN FY 2009", col: 11 },
    { text: "AWARD TYPE", col: 12 },
  ];

  const headerCellStyle = (cell) => {
    cell.font = { name: "Arial", size: 9, bold: true };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE4F5FC" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFC9E5F2" } },
      bottom: { style: "thin", color: { argb: "FFC9E5F2" } },
      left: { style: "thin", color: { argb: "FFC9E5F2" } },
      right: { style: "thin", color: { argb: "FFC9E5F2" } },
    };
  };

  let currentRow = 7;

  const writeHeader = () => {
    const topRow = currentRow;
    const subRow = currentRow + 1;

    topHeaders.forEach(({ text, col, span }) => {
      const cell = ws.getCell(topRow, col);
      cell.value = text;
      headerCellStyle(cell);

      if (span) {
        ws.mergeCells(topRow, col, topRow, col + span - 1);
      } else {
        ws.mergeCells(topRow, col, subRow, col); // rowspan
      }
    });

    // From / To sub-header under "Performance Period"
    const fromCell = ws.getCell(subRow, 9);
    fromCell.value = "From";
    headerCellStyle(fromCell);

    const toCell = ws.getCell(subRow, 10);
    toCell.value = "To";
    headerCellStyle(toCell);

    ws.getRow(topRow).height = 26;
    ws.getRow(subRow).height = 18;

    currentRow = subRow + 1;
  };

  // ---------------------------------------------------------
  // SECTION WRITER
  // ---------------------------------------------------------

  const writeSection = (title, rows) => {
    ws.mergeCells(currentRow, 1, currentRow, 12);

    const sectionCell = ws.getCell(currentRow, 1);
    sectionCell.value = title;
    sectionCell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      color: { argb: "FF12384A" },
    };
    sectionCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEAF7FB" },
    };
    sectionCell.alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };

    currentRow++;

    writeHeader();

    if (!rows || rows.length === 0) {
      const row = ws.getRow(currentRow);
      row.getCell(1).value = "No data available";
      ws.mergeCells(currentRow, 1, currentRow, 12);
      row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row.getCell(1).font = {
        name: "Arial",
        size: 9,
        color: { argb: "FF8AA4B2" },
      };
      currentRow++;
      return;
    }

    rows.forEach((dataRow) => {
      const row = ws.getRow(currentRow);

      for (let i = 0; i < 11; i++) {
        let value = dataRow?.[i] ?? "";

        // Amount columns: 2 = Prime Contract Value, 6 = Subcontract Value, 9 = Subcontract Incurred
        if ([2, 6, 9].includes(i)) {
          const numericValue = Number(
            String(value).replace(/[$,]/g, "").trim(),
          );
          value =
            value !== "" && Number.isFinite(numericValue) ? numericValue : "";
        }

        const cell = row.getCell(i + 2);
        cell.value = value;
        cell.font = { name: "Arial", size: 9 };
        cell.alignment = {
          horizontal: [3, 5].includes(i) ? "left" : "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFD7E8EF" } },
          bottom: { style: "thin", color: { argb: "FFD7E8EF" } },
          left: { style: "thin", color: { argb: "FFD7E8EF" } },
          right: { style: "thin", color: { argb: "FFD7E8EF" } },
        };

        if ([2, 6, 9].includes(i)) {
          cell.numFmt = "$#,##0.00;($#,##0.00);-";
          cell.alignment = { horizontal: "right", vertical: "middle" };
        }
      }

      // First column is the selection checkbox in the UI — not needed in Excel.
      row.getCell(1).value = "";
      row.height = 31;

      currentRow++;
    });

    currentRow += 1;
  };

  // ---------------------------------------------------------
  // SECTIONS — SAME ORDER AS JSX (SECTION_DEFINITIONS)
  // ---------------------------------------------------------

  const sectionMap = [
    {
      id: "costType",
      title:
        "Cost-type subcontracts issued under flexibly priced prime contracts",
    },
    {
      id: "tm",
      title: "T&M/LH subcontracts issued under flexibly priced prime contracts",
    },
    {
      id: "incentive",
      title: "Incentive subcontracts under flexibly priced prime contracts",
    },
    {
      id: "idiq",
      title:
        "Subcontract orders based on cost issued under IDIQ prime contracts",
    },
    {
      id: "interdivision",
      title:
        "Inter-divisional/intercompany and FFP effort issued under flexibly priced prime contracts",
    },
  ];

  sectionMap.forEach((section) => {
    writeSection(section.title, sectionRows[section.id]);
  });

  // ---------------------------------------------------------
  // NOTE — verbatim from JSX
  // ---------------------------------------------------------

  ws.mergeCells(currentRow, 1, currentRow, 12);
  const noteCell = ws.getCell(currentRow, 1);
  noteCell.value =
    "Note: Subject schedule is to provide identification of subcontracts you have awarded to companies for which you are the prime or upper-tier contractor, including inter-divisional effort. This information is required at the pricing action level (e.g. delivery order, CLIN) for all subcontract awards (e.g. cost-type, incentive contracts, T&M/LH, FFP etc.) issued under flexibly-priced and IDIQ prime contracts.";
  noteCell.font = { name: "Arial", size: 9, color: { argb: "FF49616D" } };
  noteCell.alignment = { vertical: "top", wrapText: true };
  noteCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF7F9FA" },
  };
  noteCell.border = {
    top: { style: "thin", color: { argb: "FFD3E0E6" } },
    bottom: { style: "thin", color: { argb: "FFD3E0E6" } },
    left: { style: "thin", color: { argb: "FFD3E0E6" } },
    right: { style: "thin", color: { argb: "FFD3E0E6" } },
  };
  ws.getRow(currentRow).height = 55;

  // ---------------------------------------------------------
  // COLUMN WIDTHS
  // ---------------------------------------------------------

  const widths = [4, 17, 18, 17, 28, 20, 24, 17, 15, 15, 22, 15];
  widths.forEach((width, index) => {
    ws.getColumn(index + 1).width = width;
  });

  // ---------------------------------------------------------
  // FREEZE / PRINT
  // ---------------------------------------------------------

  ws.views = [{ state: "frozen", ySplit: 8 }]; // header now spans 2 rows (7-8)

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.4,
      bottom: 0.4,
      header: 0.2,
      footer: 0.2,
    },
  };

  ws.pageSetup.printArea = `A1:L${currentRow}`;

  return ws;
};

//Schedule K

const getScheduleKData = async (year = 2025) => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/ScheduleK?year=${year}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Schedule K data. Status: ${response.status}`,
    );
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
};

// Small helper so we never write a broken internal hyperlink if the
// target sheet hasn't been built yet (you said 2-3 sheets are still pending).
const sheetHyperlink = (workbook, sheetName, cellRef = "A1") => {
  const target = workbook.getWorksheet(sheetName);
  return target ? `#'${sheetName}'!${cellRef}` : null;
};

const addScheduleK = async (
  workbook,
  { companyName, companyAddress, year = 2025 },
) => {
  const laborData = await getScheduleKData(year);

  // ---------------------------------------------------------
  // Same contract mapping as JSX
  // ---------------------------------------------------------

  const contractMap = new Map();

  laborData.forEach((item) => {
    const key = `${item.invcProjId || ""}_${item.taskId || ""}`;

    if (!contractMap.has(key)) {
      contractMap.set(key, {
        key,
        contractNo: item.invcProjId || "N/A",
        taskId: item.taskId || "N/A",
        materialCost: Number(item.materialCost || 0),
        subcontractor: Number(item.subcontractor || 0),
        materialOverhead: Number(item.materialOverhead || 0),
        travelCost: Number(item.travelCost || 0),
        odcCost: Number(item.odcCost || 0),
        taskCeiling: Number(item.taskCeiling || 0),
      });
    }
  });

  const contracts = Array.from(contractMap.values());

  // ---------------------------------------------------------
  // Same category mapping as JSX
  // ---------------------------------------------------------

  const categoryMap = new Map();

  laborData.forEach((item) => {
    const category = item.plcDesc || "Uncategorized";

    if (!categoryMap.has(category)) {
      categoryMap.set(category, {});
    }

    const categoryEntry = categoryMap.get(category);

    const contractKey = `${item.invcProjId || ""}_${item.taskId || ""}`;

    if (!categoryEntry[contractKey]) {
      categoryEntry[contractKey] = [];
    }

    categoryEntry[contractKey].push({
      rate: Number(item.rate || 0),
      hours: Number(item.hours || 0),
      amount: Number(item.amount || 0),
    });
  });

  const categoryRows = Array.from(categoryMap.entries()).map(
    ([category, contractValues]) => ({
      category,
      contractValues,
    }),
  );

  // ---------------------------------------------------------
  // Same labor totals as JSX
  // ---------------------------------------------------------

  const contractLaborTotals = {};

  contracts.forEach((contract) => {
    contractLaborTotals[contract.key] = {
      hours: 0,
      amount: 0,
    };
  });

  laborData.forEach((item) => {
    const key = `${item.invcProjId || ""}_${item.taskId || ""}`;

    if (contractLaborTotals[key]) {
      contractLaborTotals[key].hours += Number(item.hours || 0);
      contractLaborTotals[key].amount += Number(item.amount || 0);
    }
  });

  // ---------------------------------------------------------
  // Worksheet
  // ---------------------------------------------------------

  const worksheet = workbook.addWorksheet("Schedule K");

  worksheet.views = [
    {
      showGridLines: false,
    },
  ];

  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  // ---------------------------------------------------------
  // Styles
  // ---------------------------------------------------------

  const yellowFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  const cyanFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF67E8F9" },
  };

  const blueFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" },
  };

  const emeraldBorder = {
    style: "thin",
    color: { argb: "FF065F46" }, // tailwind emerald-800, matches border-emerald-800 in JSX
  };

  const blackBorder = {
    style: "thin",
    color: { argb: "FF000000" },
  };

  const grayBorder = {
    style: "thin",
    color: { argb: "FFD1D5DB" },
  };

  const baseFont = { name: "Arial", size: 9 };
  const boldFont = { name: "Arial", size: 9, bold: true };
  const linkFont = {
    name: "Arial",
    size: 9,
    bold: true,
    underline: true,
    color: { argb: "FF1D4ED8" },
  }; // tailwind blue-700

  const moneyFormat = "#,##0.00;(#,##0.00);-";
  const integerFormat = "#,##0;(#,##0);-";
  const percentRateFormat = '0.00"%"'; // for Material Overhead / G&A rate rows only
  const dollarRateFormat = '"$"#,##0.00;("$"#,##0.00);-'; // for per-category Rate (2) column

  // ---------------------------------------------------------
  // Dynamic columns
  // First column = Category
  // Each contract = Rate + Hrs + Amount
  // ---------------------------------------------------------

  worksheet.getColumn(1).width = 32;

  let column = 2;

  contracts.forEach(() => {
    worksheet.getColumn(column).width = 12; // Rate
    worksheet.getColumn(column + 1).width = 12; // Hrs
    worksheet.getColumn(column + 2).width = 16; // Amount
    column += 3;
  });

  const lastColumn = Math.max(1, 1 + contracts.length * 3);

  // ---------------------------------------------------------
  // Header / metadata (top-left notes block)
  // ---------------------------------------------------------

  worksheet.mergeCells("A1:C1");
  worksheet.getCell("A1").value =
    "This Schedule is linked to schedule A for the G&A rate.";
  worksheet.getCell("A1").border = {
    top: emeraldBorder,
    left: emeraldBorder,
    right: emeraldBorder,
    bottom: emeraldBorder,
  };
  worksheet.getCell("A1").font = boldFont;

  worksheet.getCell("A3").value = "Any changes in data will affect Schedule I.";
  worksheet.getCell("A3").font = boldFont;

  worksheet.mergeCells("A4:C4");
  worksheet.getCell("A4").value =
    "Other than G&A rate, only manual or externally imported entries";
  worksheet.getCell("A4").font = boldFont;

  // Schedule A link -> real internal hyperlink if that sheet exists yet
  const scheduleALink = sheetHyperlink(workbook, "SCHEDULE A");
  worksheet.getCell("A5").value = scheduleALink
    ? {
        text: "Schedule A - Applied Overhead, G&A, & COM Rates",
        hyperlink: scheduleALink,
      }
    : "Schedule A - Applied Overhead, G&A, & COM Rates";
  worksheet.getCell("A5").font = linkFont;

  // ICE Manual link -> same pattern, only links if a sheet named "ICE MANUAL" exists
  const iceManualLink = sheetHyperlink(workbook, "ICE MANUAL");
  worksheet.getCell("A6").value = iceManualLink
    ? { text: "ICE MANUAL", hyperlink: iceManualLink }
    : "ICE MANUAL";
  worksheet.getCell("A6").font = linkFont;

  // ---------------------------------------------------------
  // Top-right title block: "SCHEDULE K" / "ICE (version 2.0.1h)"
  // Two separate stacked cells (NOT one merged cell) — matches the
  // two separate <div> lines in the JSX.
  // ---------------------------------------------------------

  const titleColumn = Math.max(4, lastColumn);

  worksheet.getCell(1, titleColumn).value = "SCHEDULE K";
  worksheet.getCell(1, titleColumn).font = { ...boldFont, size: 11 };
  worksheet.getCell(1, titleColumn).alignment = {
    horizontal: "right",
    vertical: "middle",
  };

  worksheet.getCell(2, titleColumn).value = "ICE (version 2.0.1h)";
  worksheet.getCell(2, titleColumn).font = { ...boldFont, size: 11 };
  worksheet.getCell(2, titleColumn).alignment = {
    horizontal: "right",
    vertical: "middle",
  };

  // ---------------------------------------------------------
  // Company / title yellow banner — full width, matches the
  // full-width <div className="bg-yellow-300..."> block in JSX
  // ---------------------------------------------------------

  const bannerStart = 1;
  const bannerEnd = lastColumn;

  worksheet.mergeCells(8, bannerStart, 8, bannerEnd);
  worksheet.getCell(8, bannerStart).value = companyName;
  worksheet.getCell(8, bannerStart).fill = yellowFill;
  worksheet.getCell(8, bannerStart).font = { ...boldFont, size: 10 };
  worksheet.getCell(8, bannerStart).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.mergeCells(9, bannerStart, 9, bannerEnd);
  worksheet.getCell(9, bannerStart).value = companyAddress;
  worksheet.getCell(9, bannerStart).fill = yellowFill;
  worksheet.getCell(9, bannerStart).font = boldFont;
  worksheet.getCell(9, bannerStart).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.mergeCells(10, bannerStart, 10, bannerEnd);
  worksheet.getCell(10, bannerStart).value =
    "Summary of Hours and Amounts on Time and Material/Labor Hour Contracts";
  worksheet.getCell(10, bannerStart).fill = yellowFill;
  worksheet.getCell(10, bannerStart).font = boldFont;
  worksheet.getCell(10, bannerStart).alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  worksheet.mergeCells(11, bannerStart, 11, bannerEnd);
  worksheet.getCell(11, bannerStart).value = `Fiscal Year End - 12/31/${year}`;
  worksheet.getCell(11, bannerStart).fill = yellowFill;
  worksheet.getCell(11, bannerStart).font = boldFont;
  worksheet.getCell(11, bannerStart).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // ---------------------------------------------------------
  // Contract Header Row (row 13) + Task Row (row 14)
  // Column A is ONE cell spanning both rows (rowSpan=2 in JSX,
  // holding "Contract Labor" and "Contract No." together).
  // Row 15 col A is the separate "Category (1)" header.
  // ---------------------------------------------------------

  const contractHeaderRow = 13;
  const taskRow = 14;
  const columnHeaderRow = 15;

  worksheet.mergeCells(contractHeaderRow, 1, taskRow, 1);
  const laborLabelCell = worksheet.getCell(contractHeaderRow, 1);
  laborLabelCell.value = "Contract Labor".padEnd(20, " ") + "Contract No.";
  laborLabelCell.font = boldFont;
  laborLabelCell.alignment = { horizontal: "left", vertical: "bottom" };
  laborLabelCell.border = { bottom: blackBorder, right: grayBorder };

  column = 2;
  contracts.forEach((contract) => {
    worksheet.mergeCells(
      contractHeaderRow,
      column,
      contractHeaderRow,
      column + 2,
    );
    const cell = worksheet.getCell(contractHeaderRow, column);
    cell.value = contract.contractNo;
    cell.font = boldFont;
    cell.alignment = { horizontal: "right", vertical: "middle" };
    cell.border = { bottom: blackBorder, right: grayBorder };
    column += 3;
  });

  column = 2;
  contracts.forEach((contract) => {
    worksheet.mergeCells(taskRow, column, taskRow, column + 2);
    const cell = worksheet.getCell(taskRow, column);
    cell.value = `Task: ${contract.taskId}`;
    cell.font = boldFont;
    cell.alignment = { horizontal: "right", vertical: "middle" };
    cell.border = { bottom: blackBorder, right: grayBorder };
    column += 3;
  });

  // ---------------------------------------------------------
  // Column Headers (row 15): Category (1) / Rate (2) / Hrs / Amount
  // ---------------------------------------------------------

  worksheet.getCell(columnHeaderRow, 1).value = "Category (1)";
  worksheet.getCell(columnHeaderRow, 1).font = boldFont;
  worksheet.getCell(columnHeaderRow, 1).border = {
    bottom: blackBorder,
    right: grayBorder,
  };

  column = 2;
  contracts.forEach(() => {
    const rateCell = worksheet.getCell(columnHeaderRow, column);
    rateCell.value = "Rate (2)";
    rateCell.font = boldFont;
    rateCell.alignment = { horizontal: "right" };
    rateCell.border = { bottom: blackBorder, right: grayBorder };

    const hrsCell = worksheet.getCell(columnHeaderRow, column + 1);
    hrsCell.value = "Hrs";
    hrsCell.font = boldFont;
    hrsCell.alignment = { horizontal: "right" };
    hrsCell.border = { bottom: blackBorder, right: grayBorder };

    const amountCell = worksheet.getCell(columnHeaderRow, column + 2);
    amountCell.value = "Amount";
    amountCell.fill = cyanFill;
    amountCell.font = boldFont;
    amountCell.alignment = { horizontal: "right" };
    amountCell.border = { bottom: blackBorder, right: grayBorder };

    column += 3;
  });

  // ---------------------------------------------------------
  // Labor Categories
  // FIX: Rate cell now shows ALL entries (like Hours/Amount already
  // did), and uses a dollar rate format instead of the percent format.
  // ---------------------------------------------------------

  let currentRow = columnHeaderRow + 1;

  categoryRows.forEach((categoryRow) => {
    worksheet.getCell(currentRow, 1).value = categoryRow.category;
    worksheet.getCell(currentRow, 1).font = baseFont;

    column = 2;

    contracts.forEach((contract) => {
      const entries = categoryRow.contractValues[contract.key] || [];

      // --- Rate ---
      const rateCell = worksheet.getCell(currentRow, column);
      if (entries.length === 1) {
        rateCell.value = Number(entries[0].rate || 0);
        rateCell.numFmt = dollarRateFormat;
      } else if (entries.length > 1) {
        rateCell.value = entries
          .map((entry) => `$${Number(entry.rate || 0).toFixed(2)}`)
          .join("\n");
      }
      rateCell.alignment = {
        horizontal: "right",
        vertical: "top",
        wrapText: entries.length > 1,
      };

      // --- Hours ---
      const hrsCell = worksheet.getCell(currentRow, column + 1);
      if (entries.length === 1) {
        hrsCell.value = Number(entries[0].hours || 0);
        hrsCell.numFmt = integerFormat;
      } else if (entries.length > 1) {
        hrsCell.value = entries
          .map((entry) => Number(entry.hours || 0).toLocaleString())
          .join("\n");
      }
      hrsCell.alignment = {
        horizontal: "right",
        vertical: "top",
        wrapText: entries.length > 1,
      };

      // --- Amount ---
      const amountCell = worksheet.getCell(currentRow, column + 2);
      if (entries.length === 1) {
        amountCell.value = Number(entries[0].amount || 0);
        amountCell.numFmt = integerFormat;
      } else if (entries.length > 1) {
        amountCell.value = entries
          .map((entry) => Number(entry.amount || 0).toLocaleString())
          .join("\n");
      } else {
        amountCell.value = "-";
      }
      amountCell.fill = cyanFill;
      amountCell.alignment = {
        horizontal: "right",
        vertical: "top",
        wrapText: entries.length > 1,
      };

      column += 3;
    });

    currentRow++;
  });

  // ---------------------------------------------------------
  // LABOR TOTAL
  // ---------------------------------------------------------

  const laborTotalRow = currentRow;

  worksheet.getCell(laborTotalRow, 1).value = "TOTAL";
  worksheet.getCell(laborTotalRow, 1).font = boldFont;
  worksheet.getCell(laborTotalRow, 1).border = { top: blackBorder };

  column = 2;
  contracts.forEach((contract) => {
    const total = contractLaborTotals[contract.key] || { hours: 0, amount: 0 };

    worksheet.getCell(laborTotalRow, column + 1).value = total.hours;
    worksheet.getCell(laborTotalRow, column + 1).numFmt = integerFormat;
    worksheet.getCell(laborTotalRow, column + 1).alignment = {
      horizontal: "right",
    };

    worksheet.getCell(laborTotalRow, column + 2).value = total.amount;
    worksheet.getCell(laborTotalRow, column + 2).fill = cyanFill;
    worksheet.getCell(laborTotalRow, column + 2).numFmt = integerFormat;
    worksheet.getCell(laborTotalRow, column + 2).font = boldFont;
    worksheet.getCell(laborTotalRow, column + 2).alignment = {
      horizontal: "right",
    };

    column += 3;
  });

  currentRow++;

  // ---------------------------------------------------------
  // OTHER COSTS
  // ---------------------------------------------------------

  worksheet.mergeCells(currentRow, 1, currentRow, lastColumn);
  worksheet.getCell(currentRow, 1).value = "OTHER COSTS";
  worksheet.getCell(currentRow, 1).font = boldFont;
  worksheet.getCell(currentRow, 1).border = {
    top: blackBorder,
    bottom: grayBorder,
  };

  currentRow++;

  const addOtherCostRow = (label, valueKey) => {
    worksheet.getCell(currentRow, 1).value = label;
    worksheet.getCell(currentRow, 1).font = baseFont;

    column = 2;
    contracts.forEach((contract) => {
      worksheet.getCell(currentRow, column).value = "";
      worksheet.getCell(currentRow, column + 1).value = "";

      const amountCell = worksheet.getCell(currentRow, column + 2);
      const value = Number(contract[valueKey] || 0);
      amountCell.value = value || "-";
      amountCell.numFmt = integerFormat;
      amountCell.alignment = { horizontal: "right" };

      column += 3;
    });

    currentRow++;
  };

  addOtherCostRow("Material Costs (3)", "materialCost");
  addOtherCostRow("Subcontractor", "subcontractor");

  // ---------------------------------------------------------
  // Material Overhead — label cell is now a clickable hyperlink
  // to Schedule A (the "blue button" from the JSX), when that
  // sheet exists in the workbook yet.
  // ---------------------------------------------------------

  const materialOverheadLink = sheetHyperlink(workbook, "SCHEDULE A");
  const moLabelCell = worksheet.getCell(currentRow, 1);
  moLabelCell.value = materialOverheadLink
    ? { text: "Material Overhead   [Sched A]", hyperlink: materialOverheadLink }
    : "Material Overhead   [Sched A]";
  moLabelCell.font = materialOverheadLink ? linkFont : boldFont;

  column = 2;
  contracts.forEach((contract) => {
    const rateCell = worksheet.getCell(currentRow, column);
    rateCell.value = 2.42; // TODO: replace with live G&A-schedule value once Schedule A mapping is wired up
    rateCell.numFmt = percentRateFormat;
    rateCell.fill = yellowFill;
    rateCell.font = boldFont;

    const amountCell = worksheet.getCell(currentRow, column + 2);
    amountCell.value = Number(contract.materialOverhead || 0) || "-";
    amountCell.numFmt = integerFormat;
    amountCell.alignment = { horizontal: "right" };

    column += 3;
  });

  currentRow++;

  addOtherCostRow("Travel Costs (3)", "travelCost");
  addOtherCostRow("ODC", "odcCost");

  // ---------------------------------------------------------
  // G&A Rate — same hyperlink treatment
  // ---------------------------------------------------------

  const gaLink = sheetHyperlink(workbook, "SCHEDULE A");
  const gaLabelCell = worksheet.getCell(currentRow, 1);
  gaLabelCell.value = gaLink
    ? { text: "G&A @:  Sched A                         (4)", hyperlink: gaLink }
    : "G&A @:  Sched A                         (4)";
  gaLabelCell.font = gaLink ? linkFont : boldFont;

  column = 2;
  contracts.forEach(() => {
    const rateCell = worksheet.getCell(currentRow, column);
    rateCell.value = 12.99; // TODO: replace with live G&A rate from Schedule A once wired up
    rateCell.numFmt = percentRateFormat;
    rateCell.fill = yellowFill;
    rateCell.font = boldFont;

    const amountCell = worksheet.getCell(currentRow, column + 2);
    amountCell.value = "-";
    amountCell.fill = cyanFill;

    column += 3;
  });

  currentRow++;

  // ---------------------------------------------------------
  // Subtotal
  // ---------------------------------------------------------

  worksheet.getCell(currentRow, 1).value = "Subtotal";
  worksheet.getCell(currentRow, 1).font = boldFont;

  column = 2;
  contracts.forEach(() => {
    worksheet.getCell(currentRow, column + 2).value = "-";
    worksheet.getCell(currentRow, column + 2).fill = cyanFill;
    worksheet.getCell(currentRow, column + 2).border = { bottom: blackBorder };
    column += 3;
  });

  currentRow++;

  // ---------------------------------------------------------
  // FINAL TOTAL
  // ---------------------------------------------------------

  worksheet.getCell(currentRow, 1).value = "TOTAL";
  worksheet.getCell(currentRow, 1).font = boldFont;

  column = 2;
  contracts.forEach((contract) => {
    const total = contractLaborTotals[contract.key] || { amount: 0 };

    worksheet.getCell(currentRow, column + 2).value = total.amount;
    worksheet.getCell(currentRow, column + 2).fill = cyanFill;
    worksheet.getCell(currentRow, column + 2).numFmt = integerFormat;
    worksheet.getCell(currentRow, column + 2).font = boldFont;

    column += 3;
  });

  currentRow++;

  // ---------------------------------------------------------
  // TASK CEILINGS
  // ---------------------------------------------------------

  worksheet.getCell(currentRow, 1).value = "Task Ceilings";
  worksheet.getCell(currentRow, 1).font = boldFont;

  column = 2;
  contracts.forEach((contract) => {
    const ceiling = Number(contract.taskCeiling || 0);
    worksheet.getCell(currentRow, column + 2).value = ceiling || "-";
    worksheet.getCell(currentRow, column + 2).numFmt = integerFormat;
    column += 3;
  });

  currentRow += 2;

  // ---------------------------------------------------------
  // Explanatory Notes
  // ---------------------------------------------------------

  worksheet.getCell(currentRow, 1).value = "Explanatory Notes:";
  worksheet.getCell(currentRow, 1).font = { ...boldFont, underline: true };

  currentRow++;

  const notes = [
    "(1) Represents effort performed by the company. Any subcontract effort should be identified separately.",
    "(2) Represents rates specified in the contract which may be higher or lower than actual rates incurred.",
    "(3) Represents actual costs recorded in the cost records.",
    "(4) G&A applied at the claimed rate excluding the Material and Travel Costs.",
  ];

  notes.forEach((note) => {
    worksheet.mergeCells(currentRow, 1, currentRow, Math.min(lastColumn, 8));
    worksheet.getCell(currentRow, 1).value = note;
    worksheet.getCell(currentRow, 1).font = baseFont;
    worksheet.getCell(currentRow, 1).alignment = {
      wrapText: true,
      vertical: "top",
    };
    currentRow++;
  });

  // ---------------------------------------------------------
  // Legend
  // ---------------------------------------------------------

  currentRow++;

  worksheet.getCell(currentRow, 1).value = "Cell Contains a Formula";
  worksheet.getCell(currentRow, 1).fill = cyanFill;
  worksheet.getCell(currentRow, 1).font = boldFont;
  worksheet.getCell(currentRow, 2).value = "Indicates Summary Amounts";

  currentRow++;

  worksheet.getCell(currentRow, 1).value = "Linked to Other Worksheet";
  worksheet.getCell(currentRow, 1).fill = yellowFill;
  worksheet.getCell(currentRow, 1).font = boldFont;
  worksheet.getCell(currentRow, 2).value = "Linked to Schedule A Rate";

  worksheet.printArea = `A1:${String.fromCharCode(
    64 + Math.min(lastColumn, 26),
  )}${currentRow}`;

  return worksheet;
};

// Schedule L

const getScheduleLData = async (year = 2025) => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/ScheduleL_cost?fyCd=${year}`,
  );

  if (!response.ok) {
    throw new Error(`Schedule L API failed: ${response.status}`);
  }

  return await response.json();
};

const addScheduleL = async (
  workbook,
  {
    year = 2025,
    companyName = COMPANY_NAME,
    companyAddress = COMPANY_ADDRESS,
  } = {},
) => {
  const data = await getScheduleLData(year);

  // =====================================================
  // SAME DATA MAPPING AS JSX
  // =====================================================

  const manualEntry = data?.manualEntry || {};
  const rows = data?.rows || [];

  const tableRows = rows.filter(
    (r) => r.acctName !== "TOTAL LABOR DISTRIBUTION",
  );

  const totalLaborRow = rows.find(
    (r) => r.acctName === "TOTAL LABOR DISTRIBUTION",
  );

  const totalLaborDistribution = totalLaborRow?.generalLedger || 0;

  // =====================================================
  // IRS FORM 941
  // =====================================================

  const payrollRows = [
    {
      description: "1ST QTR.",
      ledger: manualEntry.qtr1 || 0,
    },
    {
      description: "2ND QTR",
      ledger: manualEntry.qtr2 || 0,
    },
    {
      description: "3rd QTR.",
      ledger: manualEntry.qtr3 || 0,
    },
    {
      description: "4th QTR.",
      ledger: manualEntry.qtr4 || 0,
    },
  ];

  const totalIRS = payrollRows.reduce(
    (acc, row) => acc + Number(row.ledger || 0),
    0,
  );

  // =====================================================
  // PRETAX DEDUCTIONS
  // =====================================================

  const pretaxRows = [
    {
      description: "401K",
      ledger: manualEntry.retirement401K || 0,
    },
    {
      description: "Medical",
      ledger: manualEntry.medical || 0,
    },
    {
      description: "Dental",
      ledger: manualEntry.dental || 0,
    },
    {
      description: "FSA",
      ledger: manualEntry.fsa || 0,
    },
    {
      description: "Cafe 125 HSA",
      ledger: manualEntry.cafe125 || 0,
    },
    {
      description: "Health Care Benefit",
      ledger: manualEntry.healthcare || 0,
    },
    {
      description: "Miscellaneous",
      ledger: manualEntry.misc || 0,
    },
  ];

  const totalPretax = pretaxRows.reduce(
    (acc, row) => acc + Number(row.ledger || 0),
    0,
  );

  // =====================================================
  // PAYROLL AND LEAVE ACCRUALS
  // =====================================================
  // NOTE:
  // These values are currently hardcoded in the JSX/exporter.
  // They are kept here exactly as your current implementation.
  // For a strict API-only export, these need to come from API data.

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
      description: "Minus: D/L Customer Site 2025 labor booked 2026 (50-00-01)",
      ledger: 14826.24,
    },
  ];

  const totalAccrual = accrualRows.reduce(
    (acc, row) => acc + Number(row.ledger || 0),
    0,
  );

  // =====================================================
  // ADJUSTMENTS
  // =====================================================
  // NOTE:
  // These values are currently hardcoded in the JSX/exporter.
  // For a strict API-only export, these need to come from API data.

  const adjustmentRows = [
    {
      account: "60-06-04",
      description: "Health & Welfare",
      ledger: -145.88,
    },
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
    {
      account: "60-03-13",
      description: "Severance",
      ledger: 5068.8,
    },
  ];

  const totalAdjustments = adjustmentRows.reduce(
    (acc, row) => acc + Number(row.ledger || 0),
    0,
  );

  // =====================================================
  // SAME JSX CALCULATIONS
  // =====================================================

  const totalPayroll = totalIRS + totalPretax + totalAccrual + totalAdjustments;

  const variance = totalPayroll - totalLaborDistribution;

  const variancePercent = totalLaborDistribution
    ? variance / totalLaborDistribution
    : 0;

  // =====================================================
  // CREATE SHEET
  // =====================================================

  const ws = workbook.addWorksheet("Schedule L");

  // =====================================================
  // COLUMNS
  // =====================================================

  ws.columns = [
    { width: 16 }, // A - Acct No.
    { width: 45 }, // B - Description
    { width: 4 }, // C - spacer
    { width: 4 }, // D - spacer
    { width: 18 }, // E - Ledger
    { width: 4 }, // F - spacer
    { width: 28 }, // G - Reference
  ];

  // =====================================================
  // HEADER
  // =====================================================

  // IMPORTANT:
  // DO NOT merge G1:G1.
  // G1:G6 is merged below.
  ws.mergeCells("A1:F1");

  ws.getCell("A1").value = "Schedule L is linked to the following schedules:";

  ws.getCell("A2").value = "Schedule C, Overhead";
  ws.getCell("A3").value = "Schedule B, G&A";
  ws.getCell("A4").value = "Schedule D, Occupancy";
  ws.getCell("A5").value = "Schedule H, Claimed Allocation Bases";
  ws.getCell("A6").value = "ICE MANUAL";

  // ONLY THIS MERGE FOR COLUMN G
  ws.mergeCells("G1:G6");

  ws.getCell("G1").value = "SCHEDULE L\nICE (version 2.0.1h)";

  ws.getCell("A1").font = {
    bold: true,
  };

  ws.getCell("A6").font = {
    bold: true,
    underline: true,
    color: { argb: "FF0000FF" },
  };

  ["A2", "A3", "A4", "A5"].forEach((cell) => {
    ws.getCell(cell).font = {
      color: { argb: "FF0000FF" },
      underline: true,
    };
  });

  ws.getCell("G1").alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  ws.getCell("G1").font = {
    bold: true,
    size: 14,
  };

  // =====================================================
  // COMPANY
  // =====================================================

  ws.mergeCells("A7:G7");

  ws.getCell("A7").value = `${companyName}\n${companyAddress}`;

  ws.getCell("A7").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.getCell("A7").font = {
    bold: true,
  };

  ws.getCell("A7").alignment = {
    wrapText: true,
    vertical: "middle",
  };

  // =====================================================
  // TITLES
  // =====================================================

  ws.mergeCells("A8:G8");

  ws.getCell("A8").value = "Reconciliation of Total Payroll per IRS form 941";

  ws.mergeCells("A9:G9");

  ws.getCell("A9").value = "to Total Labor Costs Distribution";

  ws.mergeCells("A10:G10");

  ws.getCell("A10").value =
    `Fiscal Year End - 12/31/${manualEntry.year || year}`;

  ["A8", "A9", "A10"].forEach((cell) => {
    ws.getCell(cell).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    ws.getCell(cell).font = {
      bold: true,
    };
  });

  // =====================================================
  // MAIN TABLE HEADER
  // =====================================================

  ws.addRow(["Acct No.", "Description", "", "", "Ledger", "", "Reference"]);

  const headerRow = ws.lastRow.number;

  ws.getRow(headerRow).eachCell((cell) => {
    cell.font = {
      bold: true,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFEFEF" },
    };

    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // =====================================================
  // GENERAL
  // =====================================================

  ws.addRow(["", "General", "", "", "", "", ""]);

  ws.getCell(ws.lastRow.number, 2).font = {
    bold: true,
  };

  // =====================================================
  // MAIN API ROWS
  // =====================================================

  tableRows.forEach((row) => {
    let reference = "";

    if (row.acctName === "Direct Labor") {
      reference = "Summary SCHED H";
    } else if (row.acctName === "General & Administrative:") {
      reference = "SCHED B";
    } else if (row.acctName === "G&A Executive Labor") {
      reference = "link from Schedule B";
    } else if (row.acctName === "Overhead Pools (incl Fringe):") {
      reference = "SCHED C (x)";
    } else if (row.acctName?.includes("Cust Site OH Labor")) {
      reference = "link from Schedule C";
    } else if (row.acctName === "CA Overhead Labor") {
      reference = "SCHED D (x)";
    }

    const excelRow = ws.addRow([
      row.acctId || "",
      row.acctName || "",
      "",
      "",
      row.generalLedger || 0,
      "",
      reference,
    ]);

    // API-linked ledger
    excelRow.getCell(5).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" },
    };

    // References
    if (
      row.acctName === "Direct Labor" ||
      row.acctName === "General & Administrative:"
    ) {
      excelRow.getCell(7).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000FF" },
      };

      excelRow.getCell(7).font = {
        color: { argb: "FFFFFFFF" },
      };
    } else if (
      row.acctName === "Overhead Pools (incl Fringe):" ||
      row.acctName === "CA Overhead Labor"
    ) {
      excelRow.getCell(7).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF3366FF" },
      };

      excelRow.getCell(7).font = {
        color: { argb: "FFFFFFFF" },
      };
    }
  });

  // =====================================================
  // TOTAL LABOR DISTRIBUTION
  // =====================================================

  const totalLaborExcelRow = ws.addRow([
    "",
    "TOTAL LABOR DISTRIBUTION",
    "",
    "",
    totalLaborDistribution,
    "",
    "",
  ]);

  totalLaborExcelRow.getCell(5).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF00FFFF" },
  };

  totalLaborExcelRow.font = {
    bold: true,
  };

  // =====================================================
  // IRS FORM 941
  // =====================================================

  ws.addRow([]);

  const irsHeader = ws.addRow(["", "", "", "", "PER IRS FORM 941", "", ""]);

  irsHeader.font = {
    bold: true,
  };

  payrollRows.forEach((row) => {
    ws.addRow(["", row.description, "", "", row.ledger, "", ""]);
  });

  // =====================================================
  // PRETAX DEDUCTIONS
  // =====================================================

  ws.addRow([]);

  const pretaxHeader = ws.addRow([
    "",
    "Pretax Deductions :",
    "",
    "",
    "",
    "",
    "",
  ]);

  pretaxHeader.font = {
    bold: true,
  };

  pretaxRows.forEach((row) => {
    ws.addRow(["", row.description, "", "", row.ledger, "", ""]);
  });

  // =====================================================
  // PAYROLL & LEAVE ACCRUALS
  // =====================================================

  ws.addRow([]);

  const accrualHeader = ws.addRow([
    "",
    "Payroll and Leave Accruals :",
    "",
    "",
    "",
    "",
    "",
  ]);

  accrualHeader.font = {
    bold: true,
  };

  accrualRows.forEach((row) => {
    ws.addRow([row.account, row.description, "", "", row.ledger, "", ""]);
  });

  // =====================================================
  // ADJUSTMENTS
  // =====================================================

  ws.addRow([]);

  const adjustmentHeader = ws.addRow(["", "Adjustments:", "", "", "", "", ""]);

  adjustmentHeader.font = {
    bold: true,
  };

  adjustmentRows.forEach((row) => {
    ws.addRow([row.account, row.description, "", "", row.ledger, "", ""]);
  });

  // =====================================================
  // FINAL TOTAL
  // =====================================================

  ws.addRow([]);

  const totalPayrollRow = ws.addRow([
    "",
    "TOTAL PAYROLL",
    "",
    "",
    totalPayroll,
    "",
    "",
  ]);

  totalPayrollRow.font = {
    bold: true,
  };

  totalPayrollRow.getCell(5).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF00FFFF" },
  };

  // =====================================================
  // VARIANCE
  // =====================================================

  const varianceRow = ws.addRow(["", "Variance", "", "", variance, "", ""]);

  varianceRow.getCell(5).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: "FF00FFFF",
  };

  // =====================================================
  // VARIANCE %
  // =====================================================

  const variancePercentRow = ws.addRow([
    "",
    "Variance %",
    "",
    "",
    variancePercent,
    "",
    "",
  ]);

  variancePercentRow.getCell(5).numFmt = "0.00%";

  // =====================================================
  // NUMBER FORMATTING
  // =====================================================

  ws.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      if (colNumber === 5) {
        cell.numFmt = "#,##0.00;(#,##0.00);-";

        cell.alignment = {
          horizontal: "right",
          vertical: "middle",
        };
      }

      if (colNumber === 1 || colNumber === 2 || colNumber === 7) {
        cell.alignment = {
          vertical: "middle",
        };
      }
    });
  });

  // Re-apply percentage format because
  // the general number formatting above would
  // otherwise overwrite it.
  variancePercentRow.getCell(5).numFmt = "0.00%";

  // =====================================================
  // LEGEND
  // =====================================================

  ws.addRow([]);

  const legend1 = ws.addRow([
    "",
    "Linked to Other Worksheet",
    "",
    "",
    "",
    "",
    "As Referenced",
  ]);

  legend1.getCell(2).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  const legend2 = ws.addRow([
    "",
    "Cell Contains a Formula",
    "",
    "",
    "",
    "",
    "Summarizes Totals and Differences",
  ]);

  legend2.getCell(2).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF00FFFF" },
  };

  // =====================================================
  // FREEZE HEADER
  // =====================================================

  ws.views = [
    {
      state: "frozen",
      ySplit: headerRow,
    },
  ];

  // =====================================================
  // PAGE SETUP
  // =====================================================

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };
};

// Schedule M / FPRA
const addScheduleMFPRA = async (workbook) => {
  const ws = workbook.addWorksheet("Schedule M FRPA 2025");

  // Column widths
  ws.columns = [{ width: 32 }, { width: 58 }, { width: 22 }];

  // =========================
  // HEADER
  // =========================

  ws.mergeCells("A1:C1");
  ws.getCell("A1").value = "CONTROLLED UNCLASSIFIED INFORMATION (CUI)";

  ws.getCell("A1").font = {
    bold: true,
    size: 12,
    name: "Arial",
  };

  ws.getCell("A1").alignment = {
    horizontal: "center",
  };

  // NASA heading
  ws.getCell("A3").value = "National Aeronautics and";
  ws.getCell("A4").value = "Space Administration";

  ws.getCell("A6").value = "Mary W. Jackson NASA Headquarters";
  ws.getCell("A7").value = "Washington, DC 20546-0001";

  ["A6", "A7"].forEach((cell) => {
    ws.getCell(cell).font = {
      bold: true,
      name: "Arial",
    };
  });

  // NASA logo
  // If you have the logo file available to the exporter,
  // it can be inserted here using workbook.addImage(...).

  // =========================
  // META
  // =========================

  ws.getCell("A9").value = "IN REPLY REFER TO:";
  ws.getCell("A9").font = {
    bold: true,
    size: 9,
    name: "Arial",
  };

  ws.getCell("A10").value = "Cognizant Federal Agency Office";

  ws.getCell("C9").value = "August 19, 2025";
  ws.getCell("C9").font = {
    bold: true,
  };

  ws.getCell("C9").alignment = {
    horizontal: "right",
  };

  // =========================
  // ADDRESS
  // =========================

  ws.getCell("A12").value = "William Bennett";
  ws.getCell("A13").value = "Director of Finance";
  ws.getCell("A14").value = "Columbus Technologies and Services, Inc.";
  ws.getCell("A15").value = "1960 E Grand Ave. Suite 1000";
  ws.getCell("A16").value = "El Segundo, CA 90245";

  // =========================
  // SUBJECT
  // =========================

  ws.getCell("A18").value = "Subject:";
  ws.getCell("A18").font = {
    bold: true,
  };

  ws.mergeCells("B18:C18");

  ws.getCell("B18").value =
    "Established Provisional Billing Rates for Contractor Fiscal Year (CFY) 2025";

  // =========================
  // LETTER
  // =========================

  ws.mergeCells("A20:C20");
  ws.getCell("A20").value = "Dear William Bennett,";

  ws.mergeCells("A22:C24");
  ws.getCell("A22").value =
    "In accordance with Federal Acquisition Regulation (FAR) 42.704, Billing Rates, Columbus Technologies and Services, Inc. provisional billing rates for CFY 2025 are as follows:";

  ws.getCell("A22").alignment = {
    wrapText: true,
    vertical: "top",
  };

  // =========================
  // RATE TABLE
  // =========================

  const headerRow = ws.addRow([
    "Indirect Pool",
    "Allocation Base Description",
    "Provisional Billing Rate (%)",
  ]);

  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: { style: "medium" },
      bottom: { style: "medium" },
      left: { style: "medium" },
      right: { style: "medium" },
    };
  });

  // Same static rows from JSX
  const tableRows = [
    {
      indirectPool: "NASA/NIH Fringe",
      allocationBase: "Total Direct and Indirect labor costs",
      rate: "33.04%",
    },
    {
      indirectPool: "Columbus Site OH Rate",
      allocationBase: "Total Direct Columbus site Labor and Fringe",
      rate: "6.02%",
    },
    {
      indirectPool: "Customer Site OH Rate",
      allocationBase: "Total Direct Customer site Labor and Fringe",
      rate: "4.26%",
    },
    {
      indirectPool: "G&A",
      allocationBase: "Value Added",
      rate: "7.45%",
    },
    {
      indirectPool: "MH",
      allocationBase: "Direct Materials and Subcontract Labor",
      rate: "1.81%",
    },
  ];

  tableRows.forEach((item) => {
    const row = ws.addRow([item.indirectPool, item.allocationBase, item.rate]);

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "medium" },
        left: { style: "medium" },
        right: { style: "medium" },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    });

    row.getCell(3).font = {
      bold: true,
    };
  });

  // =========================
  // LETTER CONTINUATION
  // =========================

  const startRow = ws.lastRow.number + 2;

  ws.mergeCells(`A${startRow}:C${startRow + 2}`);

  ws.getCell(`A${startRow}`).value =
    "Columbus Technologies and Services, Inc. should immediately begin using the established billing rates in preparing SF 1443, Contractor's Request for Progress Payment, SF 1034, Public Vouchers for Purchases and Services and/or Cost Vouchers.";

  ws.getCell(`A${startRow}`).alignment = {
    wrapText: true,
    vertical: "top",
  };

  const nextRow = startRow + 4;

  ws.mergeCells(`A${nextRow}:C${nextRow + 1}`);

  ws.getCell(`A${nextRow}`).value =
    "All contract payments should be adjusted to reflect these provisional rates.";

  ws.getCell(`A${nextRow}`).alignment = {
    wrapText: true,
    vertical: "top",
  };

  // =========================
  // FOOTER
  // =========================

  const footerRow = nextRow + 4;

  ws.getCell(`A${footerRow}`).value =
    "Controlled Unclassified Information (CUI)";

  ws.getCell(`A${footerRow + 1}`).value =
    "Controlled By: NASA Headquarters Office of Procurement";

  ws.getCell(`A${footerRow + 2}`).value =
    "CUI Category: General Proprietary Business Information";

  ws.getCell(`A${footerRow + 3}`).value =
    "Point of Contact: john.d.moore@nasa.gov";

  for (let i = 0; i < 4; i++) {
    ws.getCell(`A${footerRow + i}`).font = {
      bold: true,
    };
  }

  // =========================
  // GENERAL FORMATTING
  // =========================

  ws.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = {
        ...(cell.font || {}),
        name: "Times New Roman",
        size: cell.font?.size || 11,
      };
    });
  });

  ws.pageSetup = {
    paperSize: 9, // A4
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.5,
      right: 0.5,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  ws.views = [
    {
      showGridLines: false,
    },
  ];
};

// Schedule M

// Same date helpers as ScheduleM.jsx, needed to derive year from fiscalYearEnd
const parseDate = (dateStr) => {
  if (!dateStr || String(dateStr).includes("#")) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

const getScheduleMData = async (year) => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${backendUrl}/api/ScheduleM?year=${year}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Schedule M API failed: ${response.status}`);
  }

  const records = await response.json();

  const recordsArr = Array.isArray(records)
    ? records
    : records
      ? [records]
      : [];

  // Same mapping as ScheduleM.jsx's fetchScheduleMData
  return recordsArr.map((item, index) => ({
    id: `entry-db-${item.year}-${index}`,
    change_hdr: item.changeHdr || item.change_hdr || "",
    change_desc: item.changeDesc || item.change_desc || "",
    effective_dt: item.effectiveDt ? new Date(item.effectiveDt) : null,
  }));
};

const addScheduleM = async (
  workbook,
  {
    fiscalYearEnd = `12/31/${FISCAL_YEAR}`, // matches ScheduleM.jsx's default state
    companyName = import.meta.env?.VITE_COMPANY_NAME || "Revolve FinTech LLC", // matches ScheduleM.jsx's default state
    companyAddress = import.meta.env?.VITE_COMPANY_ADDRESS ||
      "Vienna, VA 22182", // matches ScheduleM.jsx's default state
    iceVersion = "ICE (version 2.0.1h)",
  } = {},
) => {
  // Derive year from fiscalYearEnd, exactly like getSelectedYear() in the JSX,
  // instead of trusting a separately-passed year that could drift out of sync.
  const parsedFYE = parseDate(fiscalYearEnd);
  const year = parsedFYE ? parsedFYE.getFullYear() : FISCAL_YEAR;

  const entries = await getScheduleMData(year);

  const ws = workbook.addWorksheet("Schedule M");

  ws.columns = [
    { key: "description", width: 75 },
    { key: "effective", width: 22 },
  ];

  // =====================================================
  // TOP HEADER
  // =====================================================

  ws.mergeCells("A1:B1");
  const manualCell = ws.getCell("A1");
  manualCell.value = "Manual Entry";
  manualCell.font = {
    name: "Arial",
    color: { argb: "FF0000FF" },
    underline: true,
    size: 11,
  };

  // =====================================================
  // HEADER — now reflects the actual saved fiscalYearEnd,
  // not a hardcoded 12/31
  // =====================================================

  ws.mergeCells("A2:B2");
  const headerCell = ws.getCell("A2");

  headerCell.value =
    `${companyName}\n` +
    `${companyAddress}\n` +
    `SCHEDULE OF DESCRIPTION OF ACCOUNTING SYSTEM AND OTHER SIGNIFICANT\n` +
    `CHANGES AND OTHER AGREEMENTS AND APPROVALS\n` +
    `FISCAL YEAR ENDED ${fiscalYearEnd}`;

  headerCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  headerCell.font = { name: "Arial", bold: true, size: 11 };

  headerCell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  ws.getRow(2).height = 95;

  // =====================================================
  // SCHEDULE / VERSION
  // =====================================================

  const scheduleCell = ws.getCell("B3");
  scheduleCell.value = "SCHEDULE M";
  scheduleCell.font = { name: "Arial", bold: true, size: 13 };

  const versionCell = ws.getCell("B4");
  versionCell.value = iceVersion;
  versionCell.font = { name: "Arial", size: 11 };

  // =====================================================
  // TABLE HEADER
  // =====================================================

  const headerRow = ws.addRow(["Description of change", "Effective"]);
  headerRow.height = 22;

  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", bold: true, size: 11 };
    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // =====================================================
  // API DATA
  // =====================================================

  entries.forEach((entry, index) => {
    // Change Header + Effective Date
    const headerDataRow = ws.addRow([entry.change_hdr, entry.effective_dt]);
    headerDataRow.height = 28;

    const changeHeaderCell = headerDataRow.getCell(1);
    changeHeaderCell.font = { name: "Arial", bold: true, size: 11 };
    changeHeaderCell.alignment = { vertical: "middle", wrapText: true };

    const effectiveCell = headerDataRow.getCell(2);
    if (entry.effective_dt) {
      effectiveCell.numFmt = "mm/dd/yyyy";
    }
    effectiveCell.font = { name: "Arial", bold: true, size: 11 };
    effectiveCell.alignment = { vertical: "middle", horizontal: "left" };

    headerDataRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Description from API
    const descriptionRow = ws.addRow([entry.change_desc, ""]);
    ws.mergeCells(`A${descriptionRow.number}:B${descriptionRow.number}`);

    const descriptionCell = descriptionRow.getCell(1);
    descriptionCell.font = { name: "Arial", size: 11 };
    descriptionCell.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };
    descriptionCell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    descriptionRow.height = index === 0 ? 180 : 60;
  });

  // =====================================================
  // FONT
  // =====================================================

  ws.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = { ...(cell.font || {}), name: "Arial" };
    });
  });

  ws.views = [{ showGridLines: false }];

  ws.pageSetup = {
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.4,
      right: 0.4,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  return ws;
};

//Schedule N
const SCHEDULE_N_STORAGE_KEY = "SCHEDULE_N_DATA";

const formatDateForExcel = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${month}/${day}/${year}`;
};

// Same calculation as ScheduleN.jsx
const getFiscalYearStart = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  const previousYear = new Date(year - 1, month - 1, day);
  previousYear.setDate(previousYear.getDate() + 1);

  const startYear = previousYear.getFullYear();
  const startMonth = String(previousYear.getMonth() + 1).padStart(2, "0");
  const startDay = String(previousYear.getDate()).padStart(2, "0");

  return `${startYear}-${startMonth}-${startDay}`;
};

const formatLongDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(year, month - 1, day);
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Reads the same localStorage key the ScheduleN.jsx Save button
// writes to. This runs fine here since this file executes in the
// browser (Vite), not on a Node server.
const getScheduleNData = (year) => {
  let fiscalYearEnd = `${year}-12-31`;
  let dateOfExecution = "";

  try {
    const savedData =
      typeof window !== "undefined"
        ? localStorage.getItem(SCHEDULE_N_STORAGE_KEY)
        : null;

    if (savedData) {
      const parsedData = JSON.parse(savedData);

      if (parsedData.fiscalYearEnd) {
        fiscalYearEnd = parsedData.fiscalYearEnd;
      }

      if (parsedData.dateOfExecution) {
        dateOfExecution = parsedData.dateOfExecution;
      }
    }
  } catch (error) {
    console.warn("Unable to load Schedule N data:", error);
  }

  return { fiscalYearEnd, dateOfExecution };
};

const addScheduleN = async (
  workbook,
  {
    // FIX: no more bare reference to an undefined FISCAL_YEAR global —
    // pass the year in explicitly, same pattern as Schedule K's export.
    year = new Date().getFullYear(),
    companyName = import.meta.env?.VITE_COMPANY_NAME || "Revolve FinTech LLC",
  } = {},
) => {
  // =====================================================
  // DATA SOURCE — same as ScheduleN.jsx
  // =====================================================

  const { fiscalYearEnd, dateOfExecution } = getScheduleNData(year);

  const fiscalYear = fiscalYearEnd ? fiscalYearEnd.split("-")[0] : year;
  const fiscalYearStart = getFiscalYearStart(fiscalYearEnd);

  // =====================================================
  // WORKSHEET
  // =====================================================

  const ws = workbook.addWorksheet("Schedule N");

  ws.columns = [{ width: 18 }, { width: 95 }];

  // =====================================================
  // TITLE
  // =====================================================

  ws.mergeCells("A1:B1");

  const titleCell = ws.getCell("A1");
  titleCell.value = "Certificate of Final Indirect Costs";
  titleCell.font = { name: "Arial", size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  // This subtitle is commented out (not rendered) in the JSX,
  // so it stays out here too to match the live UI exactly.
  // Uncomment if you actually want this row in the Excel export:
  //
  // ws.mergeCells("A2:B2");
  // const fiscalCell = ws.getCell("A2");
  // fiscalCell.value = `Fiscal Year End - ${formatDateForExcel(fiscalYearEnd)}`;
  // fiscalCell.font = { name: "Arial", size: 14, bold: true };
  // fiscalCell.alignment = { horizontal: "center", vertical: "middle" };

  // =====================================================
  // CERTIFICATION INTRO
  // =====================================================

  ws.mergeCells("A4:B5");
  ws.getCell("A4").value =
    "This is to certify that I have reviewed this proposal to establish final indirect cost rates, and to the best of my knowledge and belief:";

  // =====================================================
  // ITEM 1
  // =====================================================

  ws.mergeCells("A7:B9");
  ws.getCell("A7").value =
    `1. All costs included in the proposal, ${companyName}, FY${fiscalYear} ICS, to establish final indirect cost rates for ${formatLongDate(
      fiscalYearStart,
    )} to ${formatLongDate(
      fiscalYearEnd,
    )}. Are allowable in accordance with the cost principles of the Federal Acquisition Regulation (FAR) and its supplements applicable to the contracts to which the final indirect cost rates will apply; and`;

  // =====================================================
  // ITEM 2
  // =====================================================

  ws.mergeCells("A11:B12");
  ws.getCell("A11").value =
    "2. This proposal does not include any costs that are expressly unallowable under applicable cost principles of the FAR or its supplements.";

  // =====================================================
  // SIGNATURE INFORMATION
  // =====================================================

  ws.getCell("A14").value = "Firm:";
  ws.getCell("B14").value = companyName;

  ws.getCell("A15").value = "Signature:";

  // Underline strip under the signature, matching the borderBottom
  // on the <span> wrapping the signature image in the JSX.
  ws.getCell("B15").border = {
    bottom: { style: "thin", color: { argb: "FF999999" } },
  };

  ws.getCell("A16").value = "Name of Certifying Official:";
  ws.getCell("B16").value = "William Bennett";

  ws.getCell("A17").value = "Title:";
  ws.getCell("B17").value = "Director of Finance";

  ws.getCell("A18").value = "Date of Execution:";
  ws.getCell("B18").value = formatDateForExcel(dateOfExecution);

  // =====================================================
  // SIGNATURE IMAGE
  // FIX: fetch the bundler-resolved asset URL, same as the JSX's
  // <img src={signature} /> does. No filesystem access needed —
  // this is a browser context.
  // =====================================================

  try {
    const signatureResponse = await fetch(signature);

    if (signatureResponse.ok) {
      const signatureBuffer = await signatureResponse.arrayBuffer();

      const imageId = workbook.addImage({
        buffer: signatureBuffer,
        extension: "png",
      });

      ws.addImage(imageId, {
        tl: { col: 1.25, row: 14.15 },
        ext: { width: 220, height: 45 },
      });
    } else {
      console.warn(
        "Schedule N signature fetch failed:",
        signatureResponse.status,
      );
    }
  } catch (error) {
    console.warn("Unable to load Schedule N signature image:", error);
  }

  // =====================================================
  // FAR SECTION
  // =====================================================

  ws.mergeCells("A20:B20");
  ws.getCell("A20").value =
    "FAR Part 52.242-4-- Certification of Final Indirect Costs.";

  ws.mergeCells("A21:B21");
  ws.getCell("A21").value =
    "As prescribed in 42.703-2(f), insert the following clause:";

  ws.mergeCells("A22:B22");
  ws.getCell("A22").value = "Certification of Final Indirect Costs (Jan 1997)";

  // =====================================================
  // FAR PARAGRAPHS
  // =====================================================

  const paragraphs = [
    "(a) The Contractor shall --",
    "(1) Certify any proposal to establish or modify final indirect cost rates.",
    "(2) Use the format in paragraph (c) of this clause to certify; and",
    "(3) Have the certificate signed by an individual of the Contractor's organization at a level no lower than a vice president or chief financial officer of the business segment of the Contractor that submits the proposal.",
    "(b) Failure by the Contractor to submit a signed certificate, as described in this clause, may result in final indirect costs at rates unilaterally established by the Contracting Officer.",
    "(c) The certificate of final indirect costs shall be read as follows: (see above)",
  ];

  let row = 24;
  paragraphs.forEach((text) => {
    ws.mergeCells(`A${row}:B${row}`);
    ws.getCell(`A${row}`).value = text;
    row++;
  });

  // =====================================================
  // GENERAL FORMATTING
  // =====================================================

  ws.eachRow((r) => {
    r.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10, ...(cell.font || {}) };
      cell.alignment = {
        vertical: "top",
        wrapText: true,
        ...(cell.alignment || {}),
      };
    });
  });

  // =====================================================
  // BOLD LABELS
  // =====================================================

  ["A14", "A15", "A16", "A17", "A18"].forEach((address) => {
    ws.getCell(address).font = { name: "Arial", size: 10, bold: true };
  });

  ws.getCell("A20").font = { name: "Arial", size: 10, bold: true };
  ws.getCell("A22").font = { name: "Arial", size: 10, bold: true };

  // =====================================================
  // ROW HEIGHTS
  // =====================================================

  ws.getRow(1).height = 28;
  ws.getRow(4).height = 45;
  ws.getRow(7).height = 70;
  ws.getRow(11).height = 45;
  ws.getRow(15).height = 48;

  // =====================================================
  // VIEW / PAGE SETUP
  // =====================================================

  ws.views = [{ showGridLines: false }];

  ws.pageSetup = {
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.3,
      right: 0.3,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  return ws;
};

export { addScheduleN };

/* =========================================================
   Suppl B — new sheet
========================================================= */

const supplBParseNumeric = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const clean = String(val).replace(/[$,]/g, "").trim();
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
};

const getSupplBData = async (year = FISCAL_YEAR) => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const [hdrRes, detlRes] = await Promise.all([
    fetch(`${backendUrl}/api/SupplBHdr/get-by-year?year=${year}`, { headers }),
    fetch(`${backendUrl}/api/SupplBDetl?year=${year}`, { headers }),
  ]);

  const hdr = hdrRes.ok ? await hdrRes.json() : null;
  const detls = detlRes.ok ? await detlRes.json() : [];
  const detlArr = Array.isArray(detls) ? detls : [];

  const contractorRows = [
    {
      type: "PRIMARY",
      sicCode: hdr?.primaryNaicsCd || "",
      sicDescription: hdr?.primaryNaicsDesc || "",
      year: hdr?.year != null ? String(hdr.year) : String(year),
      sales: hdr?.salesAmt != null ? Number(hdr.salesAmt) : null,
      govtPercent: hdr?.govtPercent != null ? Number(hdr.govtPercent) : null,
      advPercent: hdr?.advPercent != null ? Number(hdr.advPercent) : null,
      employees: hdr?.emplYsPercent != null ? Number(hdr.emplYsPercent) : null,
    },
    {
      type: "SECONDARY",
      sicCode: hdr?.secondNaicsCd || "",
      sicDescription: hdr?.secondNaicsDesc || "",
      year: "",
      sales: null,
      govtPercent: null,
      advPercent: null,
      employees: null,
    },
  ];

  const compensationRows = detlArr
    .filter((d) => !d.year || Number(d.year) === Number(year))
    .map((d) => ({
      fy: String(d.year || year),
      position: d.position || "",
      scope: d.salesAmt != null ? Number(d.salesAmt) : null,
      direct: d.directTimePercent != null ? Number(d.directTimePercent) : null,
      salary: d.baseSalAmt != null ? Number(d.baseSalAmt) : null,
      // Bonus has no backing API field — JSX itself leaves this blank on read
      // (it's only folded into otherAmt at save time), so export mirrors that.
      bonus: null,
      match: d.employer401Amt != null ? Number(d.employer401Amt) : null,
      insurance: d.healthLifeInsAmt != null ? Number(d.healthLifeInsAmt) : null,
      auto: d.autoAllowAmt != null ? Number(d.autoAllowAmt) : null,
      deferred: d.deferredCompAmt != null ? Number(d.deferredCompAmt) : null,
      lti: d.ltiAmt != null ? Number(d.ltiAmt) : null,
      other: d.otherAmt != null ? Number(d.otherAmt) : null,
      dels: d.volDelsAmt != null ? Number(d.volDelsAmt) : null,
      proposed: d.proposedCompAmt != null ? Number(d.proposedCompAmt) : null,
    }));

  const basis = {
    market: !!hdr?.marketPriceDataFl,
    dcaa: !!hdr?.priorDcaaAuditFl,
    writtenPlan: !!hdr?.writtenCompPlanFl,
    consultant: !!hdr?.thirdPartyCompFl,
    management: !!hdr?.managementJudgement,
    other: !!hdr?.other,
    board: !!hdr?.determinedByBodFl,
    jobDescYes: hdr?.jobDescFl === true,
    jobDescNo: hdr?.jobDescFl === false,
    otherText: hdr?.other || "",
  };

  const fiscalYearEnd = hdr?.cntrYear
    ? formatDateToString(new Date(hdr.cntrYear))
    : `12/31/${year}`;

  return {
    contractorName: hdr?.cntrName || "",
    fiscalYearEnd,
    contractorRows,
    compensationRows,
    basis,
  };
};

const addSupplB = async (
  workbook,
  {
    companyName = COMPANY_NAME,
    companyAddress = COMPANY_ADDRESS,
    year = FISCAL_YEAR,
  } = {},
) => {
  const {
    contractorName,
    fiscalYearEnd,
    contractorRows,
    compensationRows,
    basis,
  } = await getSupplBData(year);

  const ws = workbook.addWorksheet("Suppl B");
  const LAST_COL_CONTRACTOR = 8;
  const LAST_COL_COMP = 14;
  const LAST_COL = Math.max(LAST_COL_CONTRACTOR, LAST_COL_COMP);

  const MONEY_FMT = "$#,##0.00;($#,##0.00);-";

  /* =========================================================
     HEADER — matches .supplb-company / .supplb-title
  ========================================================= */
  let row = 1;

  ws.mergeCells(row, 1, row, LAST_COL);
  setCell(ws.getCell(row, 1), `${companyName}`, {
    bold: true,
    align: "center",
    fill: YELLOW,
  });
  row++;

  ws.mergeCells(row, 1, row, LAST_COL);
  setCell(ws.getCell(row, 1), companyAddress, {
    bold: true,
    align: "center",
    fill: YELLOW,
  });
  row += 2;

  ws.mergeCells(row, 1, row, LAST_COL);
  setCell(
    ws.getCell(row, 1),
    "GENERAL ORGANIZATIONAL INFORMATION AND COMPENSATION FOR CERTAIN CONTRACTOR EMPLOYEES PER FAR 31/205-6(p)",
    { bold: true, align: "center" },
  );
  ws.getRow(row).height = 30;
  row += 2;

  ws.mergeCells(row, 1, row, LAST_COL);
  setCell(ws.getCell(row, 1), "Contractor Compensation Information", {
    bold: true,
    align: "left",
  });
  row += 2;

  /* =========================================================
     SECTION 1: CONTRACTOR DATA
     8 columns: label | code | description | year | sales | govt% | adv% | employees
  ========================================================= */
  ws.mergeCells(row, 1, row, LAST_COL_CONTRACTOR);
  setCell(ws.getCell(row, 1), "Contractor Data", { bold: true, align: "left" });
  row++;

  // Contractor Name / FYE info row
  ws.mergeCells(row, 1, row, 2);
  setCell(ws.getCell(row, 1), "CONTRACTOR NAME:", {
    bold: true,
    align: "center",
  });

  ws.mergeCells(row, 3, row, 5);
  setCell(ws.getCell(row, 3), contractorName, { bold: true, align: "center" });

  ws.mergeCells(row, 6, row, 7);
  setCell(ws.getCell(row, 6), "CONTRACTOR FYE (MM/DD/YYYY):", {
    bold: true,
    align: "center",
  });

  setCell(ws.getCell(row, 8), fiscalYearEnd, { bold: true, align: "center" });
  ws.getRow(row).height = 24;
  row++;

  // Column header row
  const contractorHeaders = [
    "SIC/NAICS CODE:",
    "CODE",
    "SIC/NAICS CODE DESCRIPTION",
    "YEAR",
    "SALES",
    "GOVT %",
    "ADV %",
    "EMPLYS. #",
  ];
  contractorHeaders.forEach((h, i) => {
    const cell = ws.getCell(row, i + 1);
    setCell(cell, h, { bold: true, align: "center" });
    cell.alignment = { ...cell.alignment, wrapText: true, vertical: "middle" };
  });
  ws.getRow(row).height = 28;
  applyBottomBorder(ws.getRow(row), 1, LAST_COL_CONTRACTOR);
  row++;

  // PRIMARY / SECONDARY rows
  contractorRows.forEach((item) => {
    const values = [
      item.type,
      item.sicCode,
      item.sicDescription,
      item.year,
      item.sales,
      item.govtPercent,
      item.advPercent,
      item.employees,
    ];

    values.forEach((v, i) => {
      const cell = ws.getCell(row, i + 1);
      const isMoney = i === 4; // sales
      const isPercent = i === 5 || i === 6; // govt%, adv%

      setCell(cell, isMoney || isPercent ? numberValue(v) : v, {
        align: i === 2 ? "left" : "center",
      });

      if (isMoney) cell.numFmt = MONEY_FMT;
      if (isPercent && v !== null && v !== "") cell.numFmt = "0";
    });
    row++;
  });

  row += 2;

  /* =========================================================
     SECTION 2: COMPENSATION DATA
     14 columns, same order as SUPPLB_COPY_HEADERS
  ========================================================= */
  ws.mergeCells(row, 1, row, LAST_COL_COMP);
  setCell(ws.getCell(row, 1), "Compensation Data", {
    bold: true,
    align: "left",
  });
  row++;

  const compHeaders = [
    "FY",
    "POSITION",
    "SALES SCOPE",
    "% TIME DIRECT",
    "BASE SALARY",
    "BONUS",
    "401(k) MATCH",
    "HEALTH/LIFE INS.",
    "AUTO ALLOW.",
    "DEFERRED COMP.",
    "LTI",
    "OTHER*",
    "VOL. DELS.",
    "PROPOSED COMP.",
  ];

  compHeaders.forEach((h, i) => {
    const cell = ws.getCell(row, i + 1);
    setCell(cell, h, { bold: true, align: "center" });
    cell.alignment = { ...cell.alignment, wrapText: true, vertical: "middle" };
  });
  ws.getRow(row).height = 34;
  applyBottomBorder(ws.getRow(row), 1, LAST_COL_COMP);
  row++;

  if (compensationRows.length === 0) {
    ws.mergeCells(row, 1, row, LAST_COL_COMP);
    setCell(ws.getCell(row, 1), "No data available", {
      italic: true,
      align: "center",
    });
    row++;
  }

  const MONEY_COL_INDEXES = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // salary..proposed
  const PERCENT_COL_INDEXES = [3]; // % time direct

  compensationRows.forEach((item) => {
    const values = [
      item.fy,
      item.position,
      item.scope,
      item.direct,
      item.salary,
      item.bonus,
      item.match,
      item.insurance,
      item.auto,
      item.deferred,
      item.lti,
      item.other,
      item.dels,
      item.proposed,
    ];

    values.forEach((v, i) => {
      const cell = ws.getCell(row, i + 1);
      const isMoney = MONEY_COL_INDEXES.includes(i) || i === 2; // scope is also money
      const isPercent = PERCENT_COL_INDEXES.includes(i);

      setCell(cell, isMoney || isPercent ? numberValue(v) : v, {
        align: i === 1 ? "left" : isMoney || isPercent ? "right" : "center",
      });

      if (isMoney) cell.numFmt = MONEY_FMT;
      if (isPercent && v !== null && v !== "") cell.numFmt = "0";
    });
    row++;
  });

  row += 2;

  /* =========================================================
     SECTION 3: BASIS OF CONTRACTOR'S COMPENSATION
  ========================================================= */
  ws.mergeCells(row, 1, row, LAST_COL);
  setCell(ws.getCell(row, 1), "Basis of Contractor's Compensation", {
    bold: true,
    align: "left",
  });
  row++;

  ws.mergeCells(row, 1, row, LAST_COL);
  const noteIntroCell = ws.getCell(row, 1);
  setCell(
    noteIntroCell,
    "Below, please check the box next to the item which describes the contractor's basis for the proposed compensation costs, i.e. how the compensation levels were established in accordance with any existing policies and procedures. Also, did the contractor consider whether the proposed compensation was reasonable in accordance with FAR 31.205-6(b)? If so, include any reasonableness analysis, including all assumptions, data relied upon, compensation surveys and/or any other data. Include any attachments separately.",
    { fontSize: 9, align: "left" },
  );
  noteIntroCell.alignment = {
    ...noteIntroCell.alignment,
    wrapText: true,
    vertical: "top",
  };
  ws.getRow(row).height = 45;
  row++;

  const checkVal = (b) => (b ? "X" : "");

  const basisPairs = [
    [
      {
        label: "Market Pricing Data (Compensation Surveys)",
        checked: basis.market,
      },
      {
        label: "Prior DCAA Audit of Compensation Reasonableness",
        checked: basis.dcaa,
      },
    ],
    [
      { label: "Written Compensation Plan/Policy", checked: basis.writtenPlan },
      {
        label: "3rd Party (Consultant) Compensation Analysis",
        checked: basis.consultant,
      },
    ],
    [
      {
        label: "Management Judgment (No written plan/policy)",
        checked: basis.management,
      },
      { label: `Other -- ${basis.otherText || ""}`, checked: basis.other },
    ],
    [
      { label: "Determined by Board of Directors", checked: basis.board },
      { label: "", checked: false },
    ],
  ];

  basisPairs.forEach((pair) => {
    // Left checkbox + label (cols 1-2)
    setCell(ws.getCell(row, 1), checkVal(pair[0].checked), {
      align: "center",
      border: true,
    });
    ws.mergeCells(row, 2, row, 4);
    setCell(ws.getCell(row, 2), pair[0].label, { align: "left", border: true });

    // Right checkbox + label (cols 5-8)
    setCell(ws.getCell(row, 5), checkVal(pair[1].checked), {
      align: "center",
      border: true,
    });
    ws.mergeCells(row, 6, row, 8);
    setCell(ws.getCell(row, 6), pair[1].label, { align: "left", border: true });

    ws.getRow(row).height = 20;
    row++;
  });

  row++;

  // Job Descriptions Yes/No
  ws.mergeCells(row, 1, row, 3);
  setCell(
    ws.getCell(row, 1),
    "(1) Indicate if Job Descriptions are available:",
    {
      bold: true,
      align: "left",
    },
  );
  setCell(ws.getCell(row, 4), basis.jobDescYes ? "X" : "", { align: "center" });
  setCell(ws.getCell(row, 5), "YES", { align: "left" });
  setCell(ws.getCell(row, 6), basis.jobDescNo ? "X" : "", { align: "center" });
  setCell(ws.getCell(row, 7), "NO", { align: "left" });
  row += 2;

  // Static note lines — hardcoded verbatim in the JSX
  ws.mergeCells(row, 1, row, LAST_COL);
  const otherNote1 = ws.getCell(row, 1);
  setCell(
    otherNote1,
    "*Written description Other compensation: personal usage of leased vehicle; PTO payout; cell phone reimbursement",
    { fontSize: 9, align: "left" },
  );
  otherNote1.alignment = { ...otherNote1.alignment, wrapText: true };
  row++;

  ws.mergeCells(row, 1, row, LAST_COL);
  const otherNote2 = ws.getCell(row, 1);
  setCell(
    otherNote2,
    "*Breakdown of Other compensation by cost element: $25,539 personal usage of leased vehicle; $24,304 PTO pay-out; $1,920 cell phone reimbursement",
    { fontSize: 9, align: "left" },
  );
  otherNote2.alignment = { ...otherNote2.alignment, wrapText: true };
  row += 2;

  /* =========================================================
     COLUMN WIDTHS / PAGE SETUP
  ========================================================= */
  ws.columns = [
    { width: 16 },
    { width: 12 },
    { width: 26 },
    { width: 10 },
    { width: 14 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
  ];

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
  };

  return ws;
};

//schedule O
const getScheduleOData = async (year = FISCAL_YEAR) => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${backendUrl}/api/ScheduleO?year=${year}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Schedule O API failed: ${response.status}`);
  }

  const data = await response.json();

  const records = Array.isArray(data) ? data : data ? [data] : [];

  // =====================================================
  // SAME MAPPING AS ScheduleO.jsx
  // =====================================================

  const costTypeRows = [];
  const timeMaterialRows = [];

  records.forEach((item, index) => {
    const mappedRow = {
      id: `db-row-${index}`,

      contractNo: item.contractNo || "",

      orderNo: item.orderNo || "",

      from: item.popStartDt || "",

      to: item.popEndDt || "",

      readyToClose: item.readyToCloseFl ? "Y" : "N",

      ceilingAmount:
        item.cntrCeilingAmt != null ? String(item.cntrCeilingAmt) : "",

      fee: item.feeAmt != null ? String(item.feeAmt) : "",

      required: item.reqHrs != null ? String(item.reqHrs) : "",

      actual: item.actualHrs != null ? String(item.actualHrs) : "",

      notes: item.notes || "",
    };

    // SAME SECTION LOGIC AS JSX
    if (item.projType === "CostType") {
      costTypeRows.push(mappedRow);
    } else {
      timeMaterialRows.push(mappedRow);
    }
  });

  return {
    costTypeRows,
    timeMaterialRows,
  };
};

const addScheduleO = async (
  workbook,
  { companyName = "", companyAddress = "", year = FISCAL_YEAR } = {},
) => {
  const { costTypeRows, timeMaterialRows } = await getScheduleOData(year);

  const ws = workbook.addWorksheet("Schedule O");

  // =====================================================
  // COLUMN WIDTHS
  // =====================================================

  ws.columns = [
    { width: 5 }, // Select
    { width: 16 }, // Contract
    { width: 13 }, // Order
    { width: 13 }, // From
    { width: 13 }, // To
    { width: 16 }, // Ready
    { width: 21 }, // Ceiling
    { width: 14 }, // Fee
    { width: 13 }, // Required
    { width: 13 }, // Actual
    { width: 25 }, // Notes
  ];

  // =====================================================
  // HEADER
  // =====================================================

  ws.mergeCells("A1:K1");

  const companyCell = ws.getCell("A1");

  companyCell.value = companyName;

  companyCell.font = {
    name: "Arial",
    bold: true,
    size: 13,
  };

  companyCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  ws.mergeCells("A2:K2");

  const addressCell = ws.getCell("A2");

  addressCell.value = companyAddress;

  addressCell.font = {
    name: "Arial",
    bold: true,
    size: 12,
  };

  addressCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // =====================================================
  // SCHEDULE O
  // =====================================================

  ws.getCell("K3").value = "SCHEDULE O";

  ws.getCell("K3").font = {
    name: "Arial",
    bold: true,
    size: 13,
  };

  ws.getCell("K3").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // =====================================================
  // TITLE
  // =====================================================

  ws.mergeCells("A4:K4");

  ws.getCell("A4").value = "Schedule of Contract Closing Information";

  ws.getCell("A4").font = {
    name: "Arial",
    bold: true,
    size: 14,
  };

  ws.getCell("A4").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  ws.mergeCells("A5:K5");

  ws.getCell("A5").value =
    "for those Contracts which Work Effort was Completed During";

  ws.getCell("A5").font = {
    name: "Arial",
    bold: true,
    size: 12,
  };

  ws.getCell("A5").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // =====================================================
  // FISCAL YEAR
  // =====================================================

  ws.mergeCells("A6:K6");

  ws.getCell("A6").value = `Fiscal Year End - 12/31/${year}`;

  ws.getCell("A6").font = {
    name: "Arial",
    bold: true,
    size: 11,
  };

  ws.getCell("A6").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // =====================================================
  // TABLE HEADER
  // SAME STRUCTURE AS JSX
  // =====================================================

  const headerRow1 = ws.getRow(8);

  headerRow1.values = [
    "",
    "CONTRACT NO.",
    "ORDER NO.",
    "PERFORMANCE PERIOD",
    "",
    "READY TO CLOSE (1)",
    "CONTRACT CEILING AMOUNT (2)",
    "FEE (3)",
    "LEVEL OF EFFORT CUMULATIVE HOURS",
    "",
    "",
  ];

  ws.mergeCells("A8:A9");
  ws.mergeCells("B8:B9");
  ws.mergeCells("C8:C9");

  ws.mergeCells("D8:E8");

  ws.mergeCells("F8:F9");
  ws.mergeCells("G8:G9");
  ws.mergeCells("H8:H9");

  ws.mergeCells("I8:J8");

  ws.mergeCells("K8:K9");

  ws.getCell("D9").value = "From";
  ws.getCell("E9").value = "To";

  ws.getCell("I9").value = "Required";
  ws.getCell("J9").value = "Actual";

  ws.getCell("A8").value = "SELECT";
  ws.getCell("B8").value = "CONTRACT NO.";
  ws.getCell("C8").value = "ORDER NO.";
  ws.getCell("F8").value = "READY TO CLOSE (1)";
  ws.getCell("G8").value = "CONTRACT CEILING AMOUNT (2)";
  ws.getCell("H8").value = "FEE (3)";
  ws.getCell("K8").value = "NOTES";

  for (let row = 8; row <= 9; row++) {
    ws.getRow(row).eachCell((cell) => {
      cell.font = {
        name: "Arial",
        bold: true,
        size: 10,
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFE8F5FA",
        },
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  // =====================================================
  // HELPER TO ADD API ROW
  // =====================================================

  const addDataRow = (item) => {
    const row = ws.addRow([
      "",
      item.contractNo,
      item.orderNo,
      item.from,
      item.to,
      item.readyToClose,
      item.ceilingAmount,
      item.fee,
      item.required,
      item.actual,
      item.notes,
    ]);

    row.eachCell((cell, index) => {
      cell.font = {
        name: "Arial",
        size: 9,
      };

      cell.alignment = {
        vertical: "middle",
        horizontal:
          index === 7 || index === 8 || index === 9 || index === 10
            ? "right"
            : "left",
        wrapText: true,
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Currency
    if (item.ceilingAmount !== "" && item.ceilingAmount != null) {
      const cell = row.getCell(7);

      cell.value = Number(String(item.ceilingAmount).replace(/[$,]/g, ""));

      cell.numFmt = "$#,##0.00;($#,##0.00);-";
    }

    if (item.fee !== "" && item.fee != null) {
      const cell = row.getCell(8);

      cell.value = Number(String(item.fee).replace(/[$,]/g, ""));

      cell.numFmt = "$#,##0.00;($#,##0.00);-";
    }

    // Required
    if (item.required !== "" && item.required != null) {
      const cell = row.getCell(9);

      cell.value = Number(String(item.required).replace(/[$,]/g, ""));

      cell.numFmt = "#,##0.00;(#,##0.00);-";
    }

    // Actual
    if (item.actual !== "" && item.actual != null) {
      const cell = row.getCell(10);

      cell.value = Number(String(item.actual).replace(/[$,]/g, ""));

      cell.numFmt = "#,##0.00;(#,##0.00);-";
    }

    return row;
  };

  // =====================================================
  // COST TYPE SECTION
  // SAME AS UI
  // =====================================================

  const costHeaderRow = ws.addRow(["Cost Type:"]);

  ws.mergeCells(costHeaderRow.number, 1, costHeaderRow.number, 11);

  const costHeaderCell = costHeaderRow.getCell(1);

  costHeaderCell.font = {
    name: "Times New Roman",
    size: 13,
    bold: true,
    italic: true,
  };

  costHeaderCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "FFF4F9FB",
    },
  };

  costHeaderCell.alignment = {
    vertical: "middle",
  };

  // Same as JSX: NONE
  const noneRow = ws.addRow(["NONE"]);

  ws.mergeCells(noneRow.number, 1, noneRow.number, 11);

  noneRow.getCell(1).font = {
    name: "Times New Roman",
    size: 13,
    bold: true,
  };

  // API Cost Type rows
  costTypeRows.forEach((item) => {
    addDataRow(item);
  });

  // =====================================================
  // TIME & MATERIAL SECTION
  // =====================================================

  const tmHeaderRow = ws.addRow(["Time & Material"]);

  ws.mergeCells(tmHeaderRow.number, 1, tmHeaderRow.number, 11);

  const tmHeaderCell = tmHeaderRow.getCell(1);

  tmHeaderCell.font = {
    name: "Times New Roman",
    size: 13,
    bold: true,
    italic: true,
  };

  tmHeaderCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "FFF4F9FB",
    },
  };

  tmHeaderCell.alignment = {
    vertical: "middle",
  };

  // API Time & Material rows
  timeMaterialRows.forEach((item) => {
    addDataRow(item);
  });

  // =====================================================
  // VIEW
  // =====================================================

  ws.views = [
    {
      showGridLines: false,
    },
  ];

  // =====================================================
  // FREEZE HEADER
  // =====================================================

  ws.freezePanes = {
    ySplit: 9,
  };

  // =====================================================
  // PRINT
  // =====================================================

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.3,
      right: 0.3,
      top: 0.4,
      bottom: 0.4,
      header: 0.2,
      footer: 0.2,
    },
  };

  return ws;
};

//Supply A1
const getSupplA1Data = async () => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/supply_A1_cost?fyCd=2025`,
  );

  if (!response.ok) {
    throw new Error(`Suppl A-1 API failed: ${response.status}`);
  }

  return await response.json();
};

const addSupplA1 = async (workbook, companyName, companyAddress) => {
  const data = await getSupplA1Data();

  const ws = workbook.addWorksheet("Suppl A-1");

  ws.columns = [
    { width: 15 },
    { width: 42 },
    { width: 17 },
    { width: 17 },
    { width: 15 },
    { width: 14 },
    { width: 15 },
  ];

  // ---------------------------------------------------------
  // Header
  // ---------------------------------------------------------

  ws.mergeCells("A1:G1");
  ws.getCell("A1").value = companyName;
  ws.getCell("A1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A1").alignment = {
    horizontal: "center",
  };
  ws.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.mergeCells("A2:G2");
  ws.getCell("A2").value = companyAddress;
  ws.getCell("A2").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A2").alignment = {
    horizontal: "center",
  };

  ws.mergeCells("A3:G3");
  ws.getCell("A3").value =
    "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY ACCOUNT TO";

  ws.mergeCells("A4:G4");
  ws.getCell("A4").value =
    "PRIOR FISCAL YEAR AND BUDGETARY DATA - OVERHEAD EXPENSES";

  ws.getCell("A3").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("A4").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("A3").alignment = {
    horizontal: "center",
  };

  ws.getCell("A4").alignment = {
    horizontal: "center",
  };

  ws.mergeCells("A5:G5");
  ws.getCell("A5").value = "Fiscal Year End - 12/31/2025";
  ws.getCell("A5").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A5").alignment = {
    horizontal: "center",
  };
  ws.getCell("A5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.getCell("G1").value = "Suppl A-1";
  ws.getCell("G1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  // ---------------------------------------------------------
  // API schedules
  // ---------------------------------------------------------

  const schedules = data?.schedules || [];

  let currentRow = 7;

  schedules.forEach((schedule, sIdx) => {
    // Schedule title
    ws.mergeCells(`A${currentRow}:G${currentRow}`);

    const titleCell = ws.getCell(`A${currentRow}`);
    titleCell.value = schedule.name || "";
    titleCell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      italic: true,
      color: { argb: "0000FF" },
    };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "A0B0E0" },
    };

    currentRow++;

    // Table header
    const headerRow = ws.getRow(currentRow);

    const headers = [
      "ACC'T NO.",
      "DESCRIPTION",
      "CLAIMED\nPRIOR YR",
      "CLAIMED\nCURRENT YR",
      "$ CHANGE",
      "% CHANGE",
      "PERCENT\nTO TOTAL",
    ];

    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      cell.font = {
        name: "Arial",
        size: 9,
        bold: true,
      };
      cell.alignment = {
        horizontal: index < 2 ? "left" : "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    headerRow.height = 28;
    currentRow++;

    // -------------------------------------------------------
    // API rows
    // -------------------------------------------------------

    (schedule.rows || []).forEach((row) => {
      const isSubtotal = row.totalName === "Subtotal";

      const isTotalOverhead = row.totalName?.includes("Total Overhead");

      const isIntermediate = row.totalName === "Total Intermediate Allocations";

      const isHighlightName =
        row.acctName?.includes("California Intermediate") ||
        row.totalName?.includes("California Intermediate");

      const excelRow = ws.getRow(currentRow);

      const values = [
        row.acctId || "",
        row.acctName || row.totalName || "",
        row.claimedPriorYr ?? 0,
        row.claimedCurrentYr ?? 0,
        row.changeDollar ?? 0,
        row.changePercent ?? 0,
        row.total ?? 0,
      ];

      values.forEach((value, index) => {
        const cell = excelRow.getCell(index + 1);

        cell.value = value;

        cell.font = {
          name: "Arial",
          size: 9,
          bold:
            index === 1 && (isSubtotal || isTotalOverhead || isIntermediate),
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: index < 2 ? "left" : "right",
          wrapText: true,
        };

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Current year = linked/API value
      excelRow.getCell(4).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: isSubtotal || isTotalOverhead ? "00FFFF" : "FFFF00",
        },
      };

      // Formula/calculated cells
      [3, 5, 6, 7].forEach((col) => {
        excelRow.getCell(col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00FFFF" },
        };
      });

      // Highlight California Intermediate
      if (isHighlightName) {
        excelRow.getCell(2).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" },
        };

        excelRow.getCell(2).font = {
          name: "Arial",
          size: 9,
          bold: true,
        };
      }

      // Number formats
      excelRow.getCell(3).numFmt = "#,##0;(#,##0);0";
      excelRow.getCell(4).numFmt = "#,##0;(#,##0);0";
      excelRow.getCell(5).numFmt = "#,##0;(#,##0);0";

      // JSX does `${Number(val).toFixed(1)}%`
      // so Excel should use 0.0"%" rather than 0.0%
      // because API value is already percentage points.
      excelRow.getCell(6).numFmt = '0.0"%"';
      excelRow.getCell(7).numFmt = '0.0"%"';

      currentRow++;
    });

    currentRow += 2;
  });

  // ---------------------------------------------------------
  // Footer legend
  // ---------------------------------------------------------

  ws.getCell(`A${currentRow}`).value = "Linked to Other Worksheet";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
    bold: true,
  };

  ws.getCell(`A${currentRow}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };

  currentRow++;

  ws.getCell(`A${currentRow}`).value = "Cell Contains a Formula";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
    bold: true,
  };

  ws.getCell(`A${currentRow}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "00FFFF" },
  };

  currentRow += 2;

  ws.getCell(`A${currentRow}`).value = "Note:";
  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
    bold: true,
  };

  currentRow++;

  ws.mergeCells(`A${currentRow}:G${currentRow + 2}`);

  ws.getCell(`A${currentRow}`).value =
    "Initial Filing Status: FY 2025 represents the Company's initial Incurred Cost Submission. As such, there are no 'Prior Year Claimed' indirect costs reported in Suppl A-1. All balances reflect only the current fiscal year performance.";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
  };

  ws.getCell(`A${currentRow}`).alignment = {
    vertical: "top",
    wrapText: true,
  };

  // ---------------------------------------------------------
  // Page setup
  // ---------------------------------------------------------

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  ws.views = [
    {
      state: "frozen",
      ySplit: 6,
    },
  ];
};

//Supply A2
const getSupplA2Data = async () => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/supply_A2_cost?fyCd=2025`,
  );

  if (!response.ok) {
    throw new Error(`Suppl A-2 API failed: ${response.status}`);
  }

  return await response.json();
};

const addSupplA2 = async (workbook, companyName, companyAddress) => {
  const data = await getSupplA2Data();

  const ws = workbook.addWorksheet("Suppl A-2");

  ws.columns = [
    { width: 15 },
    { width: 42 },
    { width: 17 },
    { width: 17 },
    { width: 15 },
    { width: 14 },
    { width: 15 },
  ];

  // ---------------------------------------------------------
  // HEADER
  // ---------------------------------------------------------

  ws.mergeCells("A1:G1");
  ws.getCell("A1").value = companyName;
  ws.getCell("A1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A1").alignment = { horizontal: "center" };
  ws.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.mergeCells("A2:G2");
  ws.getCell("A2").value = companyAddress;
  ws.getCell("A2").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A2").alignment = { horizontal: "center" };

  ws.mergeCells("A3:G3");
  ws.getCell("A3").value =
    "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY";

  ws.mergeCells("A4:G4");
  ws.getCell("A4").value =
    "ACCOUNT TO PRIOR FISCAL YEAR AND BUDGETARY DATA - G&A";

  ws.getCell("A3").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("A4").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("A3").alignment = {
    horizontal: "center",
  };

  ws.getCell("A4").alignment = {
    horizontal: "center",
  };

  ws.mergeCells("A5:G5");
  ws.getCell("A5").value = "Fiscal Year End - 12/31/2025";
  ws.getCell("A5").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A5").alignment = {
    horizontal: "center",
  };
  ws.getCell("A5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.getCell("G1").value = "Suppl A-2";
  ws.getCell("G1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  // ---------------------------------------------------------
  // API SCHEDULES
  // ---------------------------------------------------------

  const schedules = data?.schedules || [];

  let currentRow = 7;

  schedules.forEach((schedule) => {
    // Schedule header
    ws.mergeCells(`A${currentRow}:G${currentRow}`);

    const titleCell = ws.getCell(`A${currentRow}`);
    titleCell.value = schedule.name || "";
    titleCell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      italic: true,
      color: { argb: "0000FF" },
    };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "A0B0E0" },
    };

    currentRow++;

    // Table headers
    const headers = [
      "ACC'T NO.",
      "DESCRIPTION",
      "CLAIMED\nPRIOR YR",
      "CLAIMED\nCURRENT YR",
      "$ CHANGE",
      "% CHANGE",
      "PERCENT\nTO TOTAL",
    ];

    const headerRow = ws.getRow(currentRow);

    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);

      cell.value = header;

      cell.font = {
        name: "Arial",
        size: 9,
        bold: true,
      };

      cell.alignment = {
        horizontal: index < 2 ? "left" : "center",
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    headerRow.height = 28;
    currentRow++;

    // -------------------------------------------------------
    // ROWS — DIRECTLY FROM API
    // -------------------------------------------------------

    (schedule.rows || []).forEach((row) => {
      const isSubtotal = row.totalName === "Subtotal";

      const isTotalPool = row.totalName === "Total Overhead Pool";

      const isIntermediate = row.totalName === "Total Intermediate Allocations";

      const isHighlightName =
        row.acctName?.includes("California Intermediate") ||
        row.totalName?.includes("California Intermediate");

      const excelRow = ws.getRow(currentRow);

      const values = [
        row.acctId || "",
        row.acctName || row.totalName || "",
        row.claimedPriorYr ?? 0,
        row.claimedCurrentYr ?? 0,
        row.changeDollar ?? 0,
        row.changePercent ?? 0,
        row.total ?? 0,
      ];

      values.forEach((value, index) => {
        const cell = excelRow.getCell(index + 1);

        cell.value = value;

        cell.font = {
          name: "Arial",
          size: 9,
          bold: index === 1 && (isSubtotal || isTotalPool || isIntermediate),
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: index < 2 ? "left" : "right",
          wrapText: true,
        };

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Claimed Prior Year
      if (isSubtotal || isTotalPool) {
        excelRow.getCell(3).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00FFFF" },
        };
      }

      // Claimed Current Year
      excelRow.getCell(4).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: isSubtotal || isTotalPool ? "00FFFF" : "FFFF00",
        },
      };

      // Change / percentages
      [5, 6, 7].forEach((col) => {
        excelRow.getCell(col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00FFFF" },
        };
      });

      // California Intermediate highlight
      if (isHighlightName) {
        excelRow.getCell(2).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" },
        };

        excelRow.getCell(2).font = {
          name: "Arial",
          size: 9,
          bold: true,
        };
      }

      // Number formatting
      excelRow.getCell(3).numFmt = "#,##0;(#,##0);0";

      excelRow.getCell(4).numFmt = "#,##0;(#,##0);0";

      excelRow.getCell(5).numFmt = "#,##0;(#,##0);0";

      // JSX uses Number(val).toFixed(1) + "%"
      excelRow.getCell(6).numFmt = '0.0"%"';

      excelRow.getCell(7).numFmt = '0.0"%"';

      currentRow++;
    });

    currentRow += 2;
  });

  // ---------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------

  ws.mergeCells(`A${currentRow}:G${currentRow + 2}`);

  ws.getCell(`A${currentRow}`).value =
    "Initial Filing Status: FY 2025 represents the Company's initial Incurred Cost Submission. As such, there are no 'Prior Year Claimed' indirect costs reported in Supplement A-2. All balances reflect only the current fiscal year performance.";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
  };

  ws.getCell(`A${currentRow}`).alignment = {
    vertical: "top",
    wrapText: true,
  };

  currentRow += 4;

  ws.getCell(`A${currentRow}`).value = "Linked to Other Worksheet";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
    bold: true,
  };

  ws.getCell(`A${currentRow}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };

  currentRow++;

  ws.getCell(`A${currentRow}`).value = "Cell Contains a Formula";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
    bold: true,
  };

  ws.getCell(`A${currentRow}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "00FFFF" },
  };

  // ---------------------------------------------------------
  // PAGE SETUP
  // ---------------------------------------------------------

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  ws.views = [
    {
      state: "frozen",
      ySplit: 6,
    },
  ];
};

//Supply A3

const getSupplA3Data = async () => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/supply_A3_cost?fyCd=2025`,
  );

  if (!response.ok) {
    throw new Error(`Suppl A-3 API failed: ${response.status}`);
  }

  return await response.json();
};

const addSupplA3 = async (workbook, companyName, companyAddress) => {
  const data = await getSupplA3Data();

  const ws = workbook.addWorksheet("Suppl A-3");

  ws.columns = [
    { width: 15 },
    { width: 42 },
    { width: 17 },
    { width: 17 },
    { width: 15 },
    { width: 14 },
    { width: 15 },
  ];

  // Header
  ws.mergeCells("A1:G1");
  ws.getCell("A1").value = companyName;
  ws.getCell("A1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A1").alignment = { horizontal: "center" };
  ws.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.mergeCells("A2:G2");
  ws.getCell("A2").value = companyAddress;
  ws.getCell("A2").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A2").alignment = { horizontal: "center" };

  ws.mergeCells("A3:G3");
  ws.getCell("A3").value =
    "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY ACCOUNT TO";

  ws.mergeCells("A4:G4");
  ws.getCell("A4").value =
    "PRIOR FISCAL YEAR AND BUDGETARY DATA - INTERMEDIATE POOL COSTS";

  ["A3", "A4"].forEach((cell) => {
    ws.getCell(cell).font = {
      name: "Arial",
      size: 10,
      bold: true,
    };
    ws.getCell(cell).alignment = {
      horizontal: "center",
    };
  });

  ws.mergeCells("A5:G5");
  ws.getCell("A5").value = "Fiscal Year End - 12/31/2025";
  ws.getCell("A5").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("A5").alignment = {
    horizontal: "center",
  };
  ws.getCell("A5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  ws.getCell("G1").value = "Suppl A-3";
  ws.getCell("G1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  let currentRow = 7;

  // API schedules
  (data?.schedules || []).forEach((schedule) => {
    // Schedule name
    ws.mergeCells(`A${currentRow}:G${currentRow}`);

    const scheduleCell = ws.getCell(`A${currentRow}`);
    scheduleCell.value = schedule.name || "";
    scheduleCell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      italic: true,
      underline: true,
      color: { argb: "0000FF" },
    };
    scheduleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "C0C0C0" },
    };

    currentRow++;

    // Table header
    const headers = [
      "ACC'T NO.",
      "DESCRIPTION",
      "CLAIMED\nPRIOR YR",
      "CLAIMED\nCURRENT YR",
      "$ CHANGE",
      "% CHANGE",
      "PERCENT\nTO TOTAL",
    ];

    const headerRow = ws.getRow(currentRow);

    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);

      cell.value = header;
      cell.font = {
        name: "Arial",
        size: 9,
        bold: true,
      };

      cell.alignment = {
        horizontal: index < 2 ? "left" : "center",
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    headerRow.height = 28;
    currentRow++;

    // API rows
    (schedule.rows || []).forEach((row) => {
      const isSubtotal = row.totalName === "Subtotal";

      const isTotalPool = row.totalName === "Intermediate Pool Total";

      const isIntermediate = row.totalName === "Intermediate Allocations:";

      const excelRow = ws.getRow(currentRow);

      const values = [
        row.acctId || "",
        row.acctName || row.totalName || "",
        row.claimedPriorYr ?? 0,
        row.claimedCurrentYr ?? 0,
        row.changeDollar ?? 0,
        row.changePercent ?? 0,
        row.total ?? 0,
      ];

      values.forEach((value, index) => {
        const cell = excelRow.getCell(index + 1);

        cell.value = value;

        cell.font = {
          name: "Arial",
          size: 9,
          bold: index === 1 && (isSubtotal || isTotalPool || isIntermediate),
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: index < 2 ? "left" : "right",
          wrapText: true,
        };

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Claimed Prior Year
      if (isSubtotal || isTotalPool) {
        excelRow.getCell(3).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00FFFF" },
        };
      }

      // Claimed Current Year
      excelRow.getCell(4).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: isSubtotal || isTotalPool ? "00FFFF" : "FFFF00",
        },
      };

      // $ Change / % Change / Percent to Total
      [5, 6, 7].forEach((col) => {
        excelRow.getCell(col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00FFFF" },
        };
      });

      // Number formats
      excelRow.getCell(3).numFmt = "#,##0;(#,##0);0";

      excelRow.getCell(4).numFmt = "#,##0;(#,##0);0";

      excelRow.getCell(5).numFmt = "#,##0;(#,##0);0";

      excelRow.getCell(6).numFmt = '0.0"%"';

      excelRow.getCell(7).numFmt = '0.0"%"';

      currentRow++;
    });

    currentRow += 2;
  });

  // Footer note
  ws.mergeCells(`A${currentRow}:G${currentRow + 2}`);

  ws.getCell(`A${currentRow}`).value =
    "Initial Filing Status: FY 2025 represents the Company's initial Incurred Cost Submission. As such, there are no 'Prior Year Claimed' indirect costs reported in Supplement A-3. All balances reflect only the current fiscal year performance.";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
  };

  ws.getCell(`A${currentRow}`).alignment = {
    vertical: "top",
    wrapText: true,
  };

  currentRow += 4;

  // Legend
  ws.getCell(`A${currentRow}`).value = "Linked to Other Worksheet";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
    bold: true,
  };

  ws.getCell(`A${currentRow}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };

  currentRow++;

  ws.getCell(`A${currentRow}`).value = "Cell Contains a Formula";

  ws.getCell(`A${currentRow}`).font = {
    name: "Arial",
    size: 9,
    bold: true,
  };

  ws.getCell(`A${currentRow}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "00FFFF" },
  };

  // Page setup
  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  ws.views = [
    {
      state: "frozen",
      ySplit: 6,
    },
  ];
};

//Suppy A4
const getSupplA4Data = async () => {
  const response = await fetch(
    `${backendUrl}/api/TrialBalance/supply_A4_cost?fyCd=2025`,
  );

  if (!response.ok) {
    throw new Error(`Suppl A-4 API failed: ${response.status}`);
  }

  return await response.json();
};

const addSupplA4 = async (workbook, companyName, companyAddress) => {
  const data = await getSupplA4Data();

  const rows = data?.rows || [];

  const ws = workbook.addWorksheet("Suppl A-4");

  // Column widths
  ws.columns = [
    { width: 42 },
    { width: 16 },
    { width: 16 },
    { width: 18 },
    { width: 16 },
    { width: 13 },
    { width: 15 },
    { width: 8 },
  ];

  // ---------------------------------------------------------
  // Header
  // ---------------------------------------------------------

  ws.mergeCells("A1:C1");
  ws.getCell("A1").value = "This Schedule is linked to Summary Sch H";
  ws.getCell("A1").font = { name: "Arial", size: 10, bold: true };

  ws.mergeCells("A2:C2");
  ws.getCell("A2").value = "ICE MANUAL";
  ws.getCell("A2").font = {
    name: "Arial",
    size: 10,
    bold: true,
    color: { argb: "FF0000FF" },
    underline: true,
  };

  ws.mergeCells("D1:F1");
  ws.getCell("D1").value = companyName || "";
  ws.getCell("D1").font = {
    name: "Arial",
    size: 11,
    bold: true,
  };
  ws.getCell("D1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };
  ws.getCell("D1").alignment = { horizontal: "center" };

  ws.mergeCells("D2:F2");
  ws.getCell("D2").value = companyAddress || "";
  ws.getCell("D2").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };
  ws.getCell("D2").alignment = { horizontal: "center" };

  ws.mergeCells("D3:F3");
  ws.getCell("D3").value =
    "COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY";
  ws.getCell("D3").font = { name: "Arial", size: 10, bold: true };
  ws.getCell("D3").alignment = { horizontal: "center" };

  ws.mergeCells("D4:F4");
  ws.getCell("D4").value =
    "ACCOUNT TO PRIOR FISCAL YEAR AND BUDGETARY DATA - DIRECT";
  ws.getCell("D4").font = { name: "Arial", size: 10, bold: true };
  ws.getCell("D4").alignment = { horizontal: "center" };

  ws.mergeCells("D5:F5");
  ws.getCell("D5").value = "Fiscal Year End - 12/31/2025";
  ws.getCell("D5").font = { name: "Arial", size: 10, bold: true };
  ws.getCell("D5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };
  ws.getCell("D5").alignment = { horizontal: "center" };

  ws.getCell("G1").value = "Suppl A-4";
  ws.getCell("G2").value = "OPTIONAL SCH.";
  ws.getCell("G3").value = "ICE (version 2.0.1h)";

  ["G1", "G2", "G3"].forEach((cell) => {
    ws.getCell(cell).font = {
      name: "Arial",
      size: 10,
      bold: true,
    };
    ws.getCell(cell).alignment = { horizontal: "right" };
  });

  // ---------------------------------------------------------
  // Table header
  // ---------------------------------------------------------

  const headerRow = ws.addRow([
    "DESCRIPTION",
    "CLAIMED\nPRIOR YR",
    "Adjustment",
    "CLAIMED\nCURRENT YR",
    "$ CHANGE",
    "% CHANGE",
    "PERCENT\nTO TOTAL",
    "Note",
  ]);

  headerRow.height = 30;

  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  headerRow.getCell(1).alignment = {
    horizontal: "left",
    vertical: "middle",
    wrapText: true,
  };

  // ---------------------------------------------------------
  // Helpers - same behavior as JSX
  // ---------------------------------------------------------

  const formatNumber = (value) => {
    if (value === null || value === undefined) return "-";
    if (value === 0) return "-";

    const num = Number(value);

    if (Number.isNaN(num)) return "-";

    return num;
  };

  const getNoteIndex = (acctName) => {
    switch (acctName) {
      case "Direct Labor - OH - Onsite":
        return "1";

      case "Travel":
        return "2";

      case "Other Direct Costs":
        return "3";

      case "Subcontracts":
        return "4";

      default:
        return "";
    }
  };

  // ---------------------------------------------------------
  // API rows
  // ---------------------------------------------------------

  rows.forEach((row) => {
    const isTotalDirectLabor = row.totalName === "Total Direct Labor";

    const isTotalDirectCosts = row.totalName === "Total Direct Costs";

    const isHighlightedRow =
      row.acctName === "Direct Labor - OH - Onsite" ||
      row.acctName === "Direct Labor - OH - Offsite";

    const noteIndex = getNoteIndex(row.acctName);

    const excelRow = ws.addRow([
      row.acctName || row.totalName || "",
      formatNumber(row.claimedPriorYr),
      formatNumber(row.adjustment),
      formatNumber(row.claimedCurrentYr),
      formatNumber(row.changeDollar),
      "N/A",
      row.total === null || row.total === undefined
        ? "0.0%"
        : `${Number(row.total).toFixed(1)}%`,
      noteIndex,
    ]);

    excelRow.eachCell((cell) => {
      cell.font = {
        name: "Arial",
        size: 10,
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      cell.alignment = {
        vertical: "middle",
      };
    });

    // Description
    excelRow.getCell(1).alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    // Numeric cells
    [2, 3, 4, 5].forEach((col) => {
      excelRow.getCell(col).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
    });

    excelRow.getCell(6).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    excelRow.getCell(7).alignment = {
      horizontal: "right",
      vertical: "middle",
    };

    excelRow.getCell(8).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Number formats
    [2, 3, 4, 5].forEach((col) => {
      excelRow.getCell(col).numFmt = "#,##0;(#,##0);-";
    });

    excelRow.getCell(7).numFmt = '0.0"%"';

    // -------------------------------------------------------
    // Highlight Direct Labor rows
    // -------------------------------------------------------

    if (isHighlightedRow) {
      excelRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
      };

      excelRow.getCell(1).font = {
        name: "Arial",
        size: 10,
        bold: true,
      };
    }

    // -------------------------------------------------------
    // Current year
    // Total Direct Costs = cyan
    // Everything else = yellow
    // -------------------------------------------------------

    excelRow.getCell(4).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: isTotalDirectCosts ? "FF00FFFF" : "FFFFFF00",
      },
    };

    // -------------------------------------------------------
    // $ Change = cyan
    // -------------------------------------------------------

    excelRow.getCell(5).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF00FFFF" },
    };

    // -------------------------------------------------------
    // % Change = cyan
    // Percent to Total = cyan
    // -------------------------------------------------------

    excelRow.getCell(6).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF00FFFF" },
    };

    excelRow.getCell(7).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF00FFFF" },
    };

    // -------------------------------------------------------
    // Total rows
    // -------------------------------------------------------

    if (isTotalDirectLabor || isTotalDirectCosts) {
      excelRow.eachCell((cell) => {
        cell.font = {
          name: "Arial",
          size: 10,
          bold: true,
        };

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  // ---------------------------------------------------------
  // Explanatory notes
  // ---------------------------------------------------------

  ws.addRow([]);

  const notes = [
    "Explanatory Notes:",
    "1. Non reimbursable Labor cost to the project 80NM0018D0004 for $212 has been adjusted from claimed labor cost.",
    "2. Non reimbursable travel cost to the project 80GFSC25CA034 ($1,165.15) and 47QFCA21F0001 (440.02) has been updated as adjustment from the claimed Travel costs.",
    "3. Non reimbursable ODC cost to the project 4400574846 for $2,953.60 has been updated as adjustment from the claimed ODC costs.",
    "4. A contract limitation of $276K for project 80GFSC25CA034 has been applied to Teammate Fee Costs, as these are not claimed.",
  ];

  notes.forEach((note, index) => {
    const row = ws.addRow([note]);

    ws.mergeCells(`A${row.number}:H${row.number}`);

    row.getCell(1).font = {
      name: "Arial",
      size: 10,
      bold: index === 0,
      underline: index === 0,
    };

    row.getCell(1).alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };
  });

  // ---------------------------------------------------------
  // Legend
  // ---------------------------------------------------------

  ws.addRow([]);

  const linkedRow = ws.addRow(["Linked to Other Worksheet"]);

  linkedRow.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFF00" },
  };

  linkedRow.getCell(1).font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  linkedRow.getCell(1).border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  const formulaRow = ws.addRow(["Cell Contains a Formula"]);

  formulaRow.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF00FFFF" },
  };

  formulaRow.getCell(1).font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  formulaRow.getCell(1).border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // ---------------------------------------------------------
  // Footer note
  // ---------------------------------------------------------

  ws.addRow([]);

  const footerRow = ws.addRow([
    "Note: This is the contractor's initial Incurred Cost Submission; therefore, prior year claimed amounts are not applicable and are reflected as zero.",
  ]);

  ws.mergeCells(`A${footerRow.number}:H${footerRow.number}`);

  footerRow.getCell(1).font = {
    name: "Arial",
    size: 10,
    color: { argb: "FF666666" },
  };

  footerRow.getCell(1).alignment = {
    wrapText: true,
    vertical: "top",
  };

  // ---------------------------------------------------------
  // Freeze / print setup
  // ---------------------------------------------------------

  ws.views = [
    {
      state: "frozen",
      ySplit: 6,
    },
  ];

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
  };

  ws.pageSetup.printArea = `A1:H${ws.lastRow.number}`;
};

// Supply B

//Supply C
const getSupplCData = async (year = 2025) => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

  const response = await fetch(`${backendUrl}/api/SupplC?year=${year}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Suppl C: ${response.status}`);
  }

  const data = await response.json();

  const records = Array.isArray(data) ? data : data ? [data] : [];

  // Same mapping as the JSX
  return records.map((item) => {
    const startDt = item.subcPopStartDt
      ? formatDateToString(new Date(item.subcPopStartDt))
      : "";

    const endDt = item.subcPopEndDt
      ? formatDateToString(new Date(item.subcPopEndDt))
      : "";

    let releaseText = "";

    if (item.subcToPrime === true) {
      releaseText = "Yes";
    } else if (item.subcToPrime === false) {
      releaseText = "No";
    }

    return {
      primeCntrNameAddr: item.primeCntrNameAddr || "",
      primeCntrNo: item.primeCntrNo || "",
      subcNo: item.subcNo || "",
      subcType: item.subcType || "",
      releaseText,
      startDt,
      endDt,
      subcAmt: item.subcAmt != null ? Number(item.subcAmt) : "",
    };
  });
};

const addSupplC = async (workbook, year = 2025) => {
  const records = await getSupplCData(year);

  const ws = workbook.addWorksheet("Suppl C");

  // ---------------------------------------------------------
  // Column widths - based on supplied UI/reference
  // ---------------------------------------------------------
  ws.columns = [
    { width: 42 }, // A - Prime contractor Name and Full Address
    { width: 20 }, // B - Prime Contract No.
    { width: 18 }, // C - Subcontract Number
    { width: 18 }, // D - Subcontract Type
    { width: 4 }, // E - spacing
    { width: 18 }, // F - Release Subcontractor Data To Prime
    { width: 28 }, // G - Subcontract Period of Performance
    { width: 18 }, // H - Subcontract Value
    { width: 12 }, // I - spacing
  ];

  // ---------------------------------------------------------
  // Header
  // ---------------------------------------------------------
  ws.getCell("A1").value = "This Schedule does not contain any";

  ws.getCell("A2").value = " links to other schedules.";

  ws.getCell("A3").value = "ICE MANUAL";

  ws.mergeCells("B1:G1");
  ws.mergeCells("B2:G2");
  ws.mergeCells("B3:G3");

  ws.getCell("B1").value = "IDENTIFICATION OF PRIME CONTRACTS UNDER";

  ws.getCell("B2").value = "WHICH THE CONTRACTOR PERFROMS AS A SUBCONTRACTOR";

  ws.getCell("B3").value = `Fiscal Year End - 12/31/${year}`;

  ws.getCell("H1").value = "Suppl C";

  ws.getCell("H2").value = " ICE (version 2.0.1h)";

  // ---------------------------------------------------------
  // Header styling
  // ---------------------------------------------------------
  ws.getCell("A1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("A2").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("A3").font = {
    name: "Arial",
    size: 10,
    color: { argb: "FF0000FF" },
    underline: true,
  };

  ws.getCell("B1").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("B2").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("B3").font = {
    name: "Arial",
    size: 10,
    bold: true,
  };

  ws.getCell("H1").font = {
    name: "Times New Roman",
    size: 10,
    bold: true,
  };

  ws.getCell("H2").font = {
    name: "Times New Roman",
    size: 10,
    bold: true,
  };

  ["B1", "B2", "B3"].forEach((cell) => {
    ws.getCell(cell).alignment = {
      horizontal: "center",
      vertical: "bottom",
      wrapText: true,
    };
  });

  // ---------------------------------------------------------
  // Table header - same as JSX
  // ---------------------------------------------------------
  ws.getRow(6).values = [
    "Prime contractor  Name",
    "Prime Contract No.",
    "Subcontract",
    "Subcontract",
    "",
    "Release Subcontractor",
    "Subcontract Period of",
    "Subcontract",
    "",
  ];

  ws.getRow(7).values = [
    "and Full Address",
    "",
    "Number",
    "Type",
    "",
    "Data To Prime",
    "Performance",
    "Value",
    "",
  ];

  ws.getCell("F8").value = "Yes/No";

  // ---------------------------------------------------------
  // Table header styling
  // ---------------------------------------------------------
  for (let row = 6; row <= 8; row++) {
    for (let col = 1; col <= 9; col++) {
      const cell = ws.getCell(row, col);

      cell.font = {
        name: row <= 7 ? "Arial" : "Arial",
        size: row === 6 && (col === 3 || col === 7 || col === 8) ? 11 : 10,
        bold: true,
        italic: row <= 7,
      };

      cell.alignment = {
        horizontal: col === 8 ? "left" : "center",
        vertical: "bottom",
        wrapText: true,
      };
    }
  }

  // ---------------------------------------------------------
  // Gray separator row - same as reference
  // ---------------------------------------------------------
  for (let col = 1; col <= 9; col++) {
    const cell = ws.getCell(9, col);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC0C0C0" },
    };

    cell.border = {
      top: {
        style: "thin",
      },
      bottom: {
        style: "thin",
      },
    };
  }

  // ---------------------------------------------------------
  // API DATA ONLY
  // ---------------------------------------------------------
  const startRow = 11;

  records.forEach((item, index) => {
    const rowNumber = startRow + index;

    ws.getRow(rowNumber).values = [
      item.primeCntrNameAddr,
      item.primeCntrNo,
      item.subcNo,
      item.subcType,
      "",
      item.releaseText,
      item.startDt || item.endDt
        ? `${item.startDt || ""}${
            item.startDt && item.endDt ? " - " : ""
          }${item.endDt || ""}`
        : "",
      item.subcAmt,
      "",
    ];

    // -------------------------------------------------------
    // Row styling
    // -------------------------------------------------------
    for (let col = 1; col <= 9; col++) {
      const cell = ws.getCell(rowNumber, col);

      cell.font = {
        name: "Arial",
        size: 10,
      };

      cell.alignment = {
        vertical: "center",
        horizontal:
          col === 2 || col === 3 || col === 4 || col === 6 || col === 7
            ? "center"
            : col === 8
              ? "left"
              : "left",
        wrapText: true,
      };

      cell.border = {
        top: {
          style: "thin",
        },
        bottom: {
          style: "thin",
        },
        left: {
          style: "thin",
        },
        right: {
          style: "thin",
        },
      };
    }

    // -------------------------------------------------------
    // Subcontract value
    // Same actual API value as JSX
    // -------------------------------------------------------
    if (
      item.subcAmt !== null &&
      item.subcAmt !== undefined &&
      item.subcAmt !== ""
    ) {
      ws.getCell(rowNumber, 8).numFmt = "$#,##0.00;($#,##0.00);-";
    }
  });

  // ---------------------------------------------------------
  // Empty rows - UI has editable empty rows
  // These are NOT actual/static data.
  // ---------------------------------------------------------
  const minimumRows = 16;

  for (let index = records.length; index < minimumRows; index++) {
    const rowNumber = startRow + index;

    for (let col = 1; col <= 9; col++) {
      const cell = ws.getCell(rowNumber, col);

      cell.font = {
        name: "Arial",
        size: 10,
      };

      cell.border = {
        top: {
          style: "thin",
        },
        bottom: {
          style: "thin",
        },
        left: {
          style: "thin",
        },
        right: {
          style: "thin",
        },
      };
    }
  }

  // ---------------------------------------------------------
  // Row heights - same general UI/reference layout
  // ---------------------------------------------------------
  for (let row = 1; row <= 28; row++) {
    ws.getRow(row).height = 20;
  }

  // Data rows
  for (
    let row = startRow;
    row < startRow + Math.max(records.length, minimumRows);
    row++
  ) {
    ws.getRow(row).height = 35;
  }

  // ---------------------------------------------------------
  // Page setup
  // ---------------------------------------------------------
  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  // ---------------------------------------------------------
  // Freeze above data
  // ---------------------------------------------------------
  ws.views = [
    {
      state: "frozen",
      ySplit: 10,
    },
  ];

  return ws;
};

//Traisl Balance

const getTrialBalanceData = async () => {
  const response = await fetch(`${backendUrl}/api/TrialBalance`);

  if (!response.ok) {
    throw new Error(
      `Trial Balance API failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
};

const addTrialBalance = async (workbook) => {
  const data = await getTrialBalanceData();

  const ws = workbook.addWorksheet("Trial Balance");

  // Same columns as the JSX
  const headers = [
    "Account ID",
    "Account Name",
    "Org ID",
    "Beginning Balance",
    "Prior Pd YTD Activity",
    "Current Pd Activity",
    "Ending Balance",
    "Adjustments",
    "Adjusted Balance",
  ];

  ws.addRow(headers);

  // Same data mapping as JSX export
  data.forEach((item) => {
    ws.addRow([
      item.acctId,
      item.acctName?.trim() || "",
      item.orgId,
      item.beginningBalance ?? 0,
      item.priorPeriodYtdActivity ?? 0,
      item.currentPdActivity ?? 0,
      item.endingBalance ?? 0,
      item.adjustments ?? 0,
      item.adjustedBalance ?? 0,
    ]);
  });

  // Header formatting
  const headerRow = ws.getRow(1);

  headerRow.font = {
    bold: true,
    color: { argb: "FFFFFFFF" },
  };

  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF475569" },
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  headerRow.height = 24;

  // Borders
  ws.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
        bottom: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
        left: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
        right: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
      };
    });
  });

  // Account columns
  ws.getColumn(1).width = 18;
  ws.getColumn(2).width = 35;
  ws.getColumn(3).width = 15;

  // Numeric columns
  for (let col = 4; col <= 9; col++) {
    ws.getColumn(col).width = 22;

    for (let row = 2; row <= ws.rowCount; row++) {
      ws.getCell(row, col).numFmt = "$#,##0.00;($#,##0.00);-";

      ws.getCell(row, col).alignment = {
        horizontal: "right",
      };
    }
  }

  // Account / Org alignment
  for (let row = 2; row <= ws.rowCount; row++) {
    ws.getCell(row, 1).font = {
      bold: true,
    };

    ws.getCell(row, 3).alignment = {
      horizontal: "center",
    };
  }

  // Match frontend's important ending/adjusted balance emphasis
  for (let row = 2; row <= ws.rowCount; row++) {
    ws.getCell(row, 7).font = {
      bold: true,
    };

    ws.getCell(row, 9).font = {
      bold: true,
      color: { argb: "FF312E81" },
    };
  }

  // Freeze header
  ws.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  // Filter
  ws.autoFilter = {
    from: "A1",
    to: `I${Math.max(ws.rowCount, 1)}`,
  };

  // Print setup
  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };
};

// Job cost ledger

const getJobCostLedgerData = async () => {
  const response = await fetch(`${backendUrl}/api/JobCostLedger`);

  if (!response.ok) {
    throw new Error(`Job Cost Ledger API failed: ${response.status}`);
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
};

const addJobCostLedger = async (workbook) => {
  const data = await getJobCostLedgerData();

  const ws = workbook.addWorksheet("Job Cost Ledger");

  // =====================================================
  // COLUMNS
  // =====================================================

  ws.columns = [
    { header: "Year", key: "year", width: 12 },
    { header: "Project ID", key: "projId", width: 18 },
    { header: "Project Name", key: "projName", width: 35 },
    { header: "Account ID", key: "acctId", width: 18 },
    { header: "Org ID", key: "orgId", width: 15 },
    { header: "Billing Level", key: "billingLvl", width: 16 },
    { header: "Report Level", key: "reportLvl", width: 16 },
    { header: "Project Type", key: "projType", width: 18 },
    {
      header: "Prime Contract ID",
      key: "primeCntrId",
      width: 22,
    },
    {
      header: "Subcontract ID",
      key: "subctrId",
      width: 22,
    },
    { header: "Amount", key: "amount", width: 18 },
  ];

  // =====================================================
  // HEADER STYLING
  // =====================================================

  const headerRow = ws.getRow(1);

  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FF334155" },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    cell.border = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  });

  headerRow.height = 24;

  // =====================================================
  // API DATA
  // SAME MAPPING AS FRONTEND
  // =====================================================

  data.forEach((item) => {
    const row = ws.addRow({
      year: item.year,
      projId: item.projId,
      projName: item.projName?.trim() || "",
      acctId: item.acctId,
      orgId: item.orgId,
      billingLvl: item.billingLvl,
      reportLvl: item.reportLvl,
      projType: item.projType,
      primeCntrId: item.primeCntrId || "",
      subctrId: item.subctrId || "",
      amount: item.amount ?? 0,
    });

    // ---------------------------------------------------
    // General alignment
    // ---------------------------------------------------

    row.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(5).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(6).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(7).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(8).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(11).alignment = {
      horizontal: "right",
      vertical: "middle",
    };

    // ---------------------------------------------------
    // Project ID - same visual emphasis as JSX
    // ---------------------------------------------------

    row.getCell(2).font = {
      bold: true,
    };

    // ---------------------------------------------------
    // Amount
    // Frontend uses USD currency formatting
    // ---------------------------------------------------

    row.getCell(11).font = {
      bold: true,
    };

    row.getCell(11).numFmt = "$#,##0.00;($#,##0.00);-";

    // ---------------------------------------------------
    // Borders
    // ---------------------------------------------------

    row.eachCell((cell) => {
      cell.border = {
        bottom: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
      };
    });
  });

  // =====================================================
  // FREEZE HEADER
  // =====================================================

  ws.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  // =====================================================
  // FILTER
  // =====================================================

  if (data.length > 0) {
    ws.autoFilter = {
      from: "A1",
      to: `K${data.length + 1}`,
    };
  }

  // =====================================================
  // PAGE SETUP
  // =====================================================

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };
};

// ============================================================
// Suppl O
// ============================================================

const getSupplOData = async (year) => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const hdrResponse = await fetch(`${backendUrl}/api/SupplOHdr?year=${year}`, {
    headers,
  });
  const schedResponse = await fetch(
    `${backendUrl}/api/ScheduleO?year=${year}`,
    { headers },
  );

  const headersData = hdrResponse.ok ? await hdrResponse.json() : [];
  const scheduleData = schedResponse.ok ? await schedResponse.json() : [];

  const contracts = [];
  const seenContractKeys = new Set();

  const supplList = Array.isArray(headersData) ? headersData : [];
  const schedList = Array.isArray(scheduleData) ? scheduleData : [];

  // Same dedup logic as SupplO.jsx: SupplOHdr records take priority,
  // ScheduleO items only added if their contract isn't already covered
  supplList.forEach((hdr) => {
    const contractNo = (hdr.primeCntrNo || "").trim();
    if (contractNo) seenContractKeys.add(contractNo.toLowerCase());
    contracts.push({ header: hdr, source: "SupplOHdr" });
  });

  schedList.forEach((item) => {
    const contractNo = (item.contractNo || "").trim();
    const key = contractNo.toLowerCase();
    if (key && seenContractKeys.has(key)) return;
    if (key) seenContractKeys.add(key);

    // Same field mapping as the JSX's fetchHeadersForYear() for ScheduleO fallback rows
    const isCost = item.projType === "CostType";
    contracts.push({
      header: {
        year,
        cntrName: item.notes || contractNo || "",
        primeCntrNo: contractNo,
        subcntrNo: item.orderNo || null,
        popStartDt: item.popStartDt || "",
        popEndDt: item.popEndDt || "",
        cntrType: isCost ? "CPFF" : "T&M",
        estimatedCost: isCost ? (item.cntrCeilingAmt ?? null) : null,
        estimatedFee: item.feeAmt ?? null,
        totPrice: item.cntrCeilingAmt ?? null,
      },
      source: "ScheduleO",
    });
  });

  for (const contract of contracts) {
    const hdr = contract.header;
    const cntrName = (hdr.cntrName || "").trim();
    const primeCntrNo = (hdr.primeCntrNo || hdr.contractNo || "").trim();

    if (!cntrName && !primeCntrNo) {
      contract.originalContract = null;
      contract.modifications = [];
      continue;
    }

    const params = new URLSearchParams();
    if (cntrName) params.append("cntrName", cntrName);
    if (primeCntrNo) params.append("primeCntrNo", primeCntrNo);
    params.append("year", year);

    const response = await fetch(
      `${backendUrl}/api/SupplODetl?${params.toString()}`,
      { headers },
    );
    const details = response.ok ? await response.json() : [];
    const detls = Array.isArray(details) ? details : [];

    const origRec = detls.find((d) => d.modNo === 0);

    contract.originalContract = origRec
      ? {
          date: origRec.modDt || "",
          changeInFunding:
            origRec.fundChngAmt != null ? Number(origRec.fundChngAmt) : null,
          totalFunding:
            origRec.totFundAmt != null ? Number(origRec.totFundAmt) : null,
          cost: origRec.costAmt != null ? Number(origRec.costAmt) : null,
          profitFee:
            origRec.profitFeeAmt != null ? Number(origRec.profitFeeAmt) : null,
          total: origRec.totFundAmt != null ? Number(origRec.totFundAmt) : null,
        }
      : null;

    contract.modifications = detls
      .filter((d) => d.modNo > 0)
      .sort((a, b) => a.modNo - b.modNo)
      .map((d) => ({
        modificationNumber: String(d.modNo),
        date: d.modDt || "",
        changeInFunding: d.fundChngAmt != null ? Number(d.fundChngAmt) : null,
        totalFunding: d.totFundAmt != null ? Number(d.totFundAmt) : null,
        cost: d.costAmt != null ? Number(d.costAmt) : null,
        profitFee: d.profitFeeAmt != null ? Number(d.profitFeeAmt) : null,
        total: d.totFundAmt != null ? Number(d.totFundAmt) : null,
      }));
  }

  return contracts;
};

const addSupplO = async (
  workbook,
  {
    companyName = COMPANY_NAME,
    companyAddress = COMPANY_ADDRESS,
    year = FISCAL_YEAR,
  } = {},
) => {
  const contracts = await getSupplOData(year);

  const ws = workbook.addWorksheet("Suppl O");

  ws.columns = [
    { width: 20 },
    { width: 18 },
    { width: 20 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
  ];

  ws.mergeCells("A1:G1");
  setCell(
    ws.getCell("A1"),
    "This Schedule does not contain any links to other schedules.",
    {
      bold: true,
      fontSize: 10,
    },
  );

  setCell(ws.getCell("A3"), "ICE MANUAL", {
    fontColor: "0000FF",
    underline: true,
  });

  setCell(ws.getCell("G1"), "Suppl O", { bold: true, fontSize: 11 });
  setCell(ws.getCell("G2"), "ICE (version 2.0.1h)", { fontSize: 11 });

  ws.mergeCells("C5:F5");
  setCell(ws.getCell("C5"), companyName, {
    bold: true,
    align: "center",
    fontSize: 12,
  });

  ws.mergeCells("C6:F6");
  setCell(ws.getCell("C6"), companyAddress, { align: "center" });

  ws.mergeCells("C8:F8");
  setCell(ws.getCell("C8"), "Suppl O — CONTRACT MODIFICATIONS", {
    bold: true,
    align: "center",
    fontSize: 12,
  });

  ws.mergeCells("C9:F9");
  setCell(ws.getCell("C9"), `Fiscal Year End - 12/31/${year}`, {
    bold: true,
    align: "center",
  });

  let row = 11;

  if (!contracts.length) {
    ws.mergeCells(`A${row}:G${row}`);
    setCell(ws.getCell(`A${row}`), "No Suppl O data available from API.", {
      italic: true,
      align: "center",
    });
    row++;
  }

  const boolToYN = (v) => (v === true ? "Yes" : v === false ? "No" : "");

  contracts.forEach((contract, contractIndex) => {
    const hdr = contract.header || {};
    const original = contract.originalContract; // FIXED: was contract.original (always undefined)
    const modifications = contract.modifications || [];

    ws.mergeCells(`A${row}:G${row}`);
    setCell(ws.getCell(`A${row}`), `Contract ${contractIndex + 1}`, {
      bold: true,
      fontSize: 11,
      fill: YELLOW,
    });
    row++;

    // Core identifiers — same as before
    setCell(ws.getCell(`A${row}`), "Contractor Name:");
    ws.mergeCells(`B${row}:D${row}`);
    setCell(ws.getCell(`B${row}`), hdr.cntrName || "");
    setCell(ws.getCell(`E${row}`), "Contract Number:");
    ws.mergeCells(`F${row}:G${row}`);
    setCell(ws.getCell(`F${row}`), hdr.primeCntrNo || "");
    row++;

    setCell(ws.getCell(`A${row}`), "Subcontract Number:");
    ws.mergeCells(`B${row}:D${row}`);
    setCell(ws.getCell(`B${row}`), hdr.subcntrNo || "");
    setCell(ws.getCell(`E${row}`), "Award Date:");
    ws.mergeCells(`F${row}:G${row}`);
    setCell(ws.getCell(`F${row}`), hdr.awardDt || "");
    row++;

    setCell(ws.getCell(`A${row}`), "Contract Type:");
    ws.mergeCells(`B${row}:D${row}`);
    setCell(ws.getCell(`B${row}`), hdr.cntrType || "");
    setCell(ws.getCell(`E${row}`), "Contract Job No.:");
    ws.mergeCells(`F${row}:G${row}`);
    setCell(ws.getCell(`F${row}`), hdr.cntrJobNo ?? "");
    row++;

    setCell(ws.getCell(`A${row}`), "Period of Performance:");
    setCell(ws.getCell(`B${row}`), hdr.popStartDt || "");
    setCell(ws.getCell(`C${row}`), "TO");
    setCell(ws.getCell(`D${row}`), hdr.popEndDt || "");
    setCell(ws.getCell(`E${row}`), "Total Modifications:");
    ws.mergeCells(`F${row}:G${row}`);
    setCell(ws.getCell(`F${row}`), hdr.totModNo ?? "");
    row++;

    // Additional header fields the JSX captures but the export was dropping entirely.
    // Only rendered when the API actually returned them (SupplOHdr records, not ScheduleO fallback rows).
    setCell(ws.getCell(`A${row}`), "Prime Contractor:");
    ws.mergeCells(`B${row}:D${row}`);
    setCell(ws.getCell(`B${row}`), hdr.primeCntrName || "");
    setCell(ws.getCell(`E${row}`), "Cognizant DCAA Office:");
    ws.mergeCells(`F${row}:G${row}`);
    setCell(ws.getCell(`F${row}`), hdr.cogDcaaOffice || "");
    row++;

    setCell(ws.getCell(`A${row}`), "Acquiring Agency:");
    ws.mergeCells(`B${row}:D${row}`);
    setCell(ws.getCell(`B${row}`), hdr.acqAgencyName || "");
    setCell(ws.getCell(`E${row}`), "Admin Contracting Office:");
    ws.mergeCells(`F${row}:G${row}`);
    setCell(ws.getCell(`F${row}`), hdr.adminCntrOff || "");
    row++;

    setCell(ws.getCell(`A${row}`), "Is Subcontract:");
    setCell(ws.getCell(`B${row}`), boolToYN(hdr.subcntrFl));
    setCell(ws.getCell(`C${row}`), "T&M / FP w/ Rates Attached:");
    setCell(ws.getCell(`D${row}`), boolToYN(hdr.tmFl));
    setCell(ws.getCell(`E${row}`), "Cost Sharing Contract:");
    setCell(ws.getCell(`F${row}`), boolToYN(hdr.costSharingFl));
    row++;

    setCell(ws.getCell(`A${row}`), "Level of Effort Clause:");
    setCell(ws.getCell(`B${row}`), boolToYN(hdr.lvlEffFl));
    setCell(ws.getCell(`C${row}`), "Ceiling on Indirect Costs:");
    setCell(ws.getCell(`D${row}`), boolToYN(hdr.ceilIndirFl));
    setCell(ws.getCell(`E${row}`), "FCCM Allowable:");
    setCell(ws.getCell(`F${row}`), boolToYN(hdr.fccmAllowFl));
    row++;

    setCell(ws.getCell(`A${row}`), "FAR Penalty Clause (52.242-3):");
    setCell(ws.getCell(`B${row}`), boolToYN(hdr.farPenaltyFl));
    setCell(ws.getCell(`C${row}`), "Precontract/Cost Restrictions:");
    setCell(ws.getCell(`D${row}`), boolToYN(hdr.preCntrFl));
    setCell(ws.getCell(`E${row}`), "Overtime Restrictions:");
    setCell(ws.getCell(`F${row}`), boolToYN(hdr.otRestricFl));
    row++;

    if (hdr.sowDetl) {
      ws.mergeCells(`A${row}:G${row}`);
      const cell = ws.getCell(`A${row}`);
      setCell(cell, `Scope of Work: ${hdr.sowDetl}`, { fontSize: 9 });
      cell.alignment = { ...cell.alignment, wrapText: true };
      row++;
    }
    if (hdr.unallowCost) {
      ws.mergeCells(`A${row}:G${row}`);
      const cell = ws.getCell(`A${row}`);
      setCell(cell, `Unallowable Costs: ${hdr.unallowCost}`, { fontSize: 9 });
      cell.alignment = { ...cell.alignment, wrapText: true };
      row++;
    }
    if (hdr.profitFeeOpt) {
      ws.mergeCells(`A${row}:G${row}`);
      const cell = ws.getCell(`A${row}`);
      setCell(cell, `Profit/Fee Provisions: ${hdr.profitFeeOpt}`, {
        fontSize: 9,
      });
      cell.alignment = { ...cell.alignment, wrapText: true };
      row++;
    }
    if (hdr.speclLimit) {
      ws.mergeCells(`A${row}:G${row}`);
      const cell = ws.getCell(`A${row}`);
      setCell(cell, `Special Limitations: ${hdr.speclLimit}`, { fontSize: 9 });
      cell.alignment = { ...cell.alignment, wrapText: true };
      row++;
    }

    row += 1;

    // Modification table
    ws.mergeCells(`A${row}:G${row}`);
    const summaryCell = ws.getCell(`A${row}`);
    setCell(summaryCell, "Summary of Contract Modifications", {
      bold: true,
      align: "center",
    });
    summaryCell.border = {
      bottom: { style: "thin", color: { argb: "000000" } },
    };
    row++;

    const headerRow = row;
    const tableHeaders = [
      "Modification",
      "Date",
      "Change in Funding",
      "Total Funding",
      "Cost",
      "Profit / Fee",
      "Total",
    ];

    tableHeaders.forEach((header, index) => {
      const cell = ws.getCell(headerRow, index + 1);
      setCell(cell, header, {
        bold: true,
        fontSize: 10,
        align: "center",
        fill: "E8F5FA",
      });
      cell.alignment = {
        ...cell.alignment,
        wrapText: true,
        vertical: "middle",
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row++;

    // FIXED: read from the mapped originalContract shape (date/changeInFunding/totalFunding/
    // cost/profitFee/total), not the raw API field names (modDt/fundChngAmt/etc.) that
    // don't exist on this object — this is why the row always rendered blank before.
    const originalValues = [
      "Original Contract",
      original?.date || "",
      original?.changeInFunding ?? "",
      original?.totalFunding ?? "",
      original?.cost ?? "",
      original?.profitFee ?? "",
      original?.total ?? "",
    ];

    originalValues.forEach((value, index) => {
      const cell = ws.getCell(row, index + 1);
      setCell(cell, value, { align: index === 0 ? "left" : "right" });
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
      if (index >= 2 && index <= 6 && value !== "")
        cell.numFmt = "$#,##0.00;($#,##0.00);-";
    });
    row++;

    // FIXED: same mapped-field-name correction for every modification row
    modifications.forEach((mod) => {
      const values = [
        mod.modificationNumber ?? "",
        mod.date || "",
        mod.changeInFunding ?? "",
        mod.totalFunding ?? "",
        mod.cost ?? "",
        mod.profitFee ?? "",
        mod.total ?? "",
      ];

      values.forEach((value, index) => {
        const cell = ws.getCell(row, index + 1);
        setCell(cell, value, { align: index === 0 ? "center" : "right" });
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        if (index >= 2 && index <= 6 && value !== "")
          cell.numFmt = "$#,##0.00;($#,##0.00);-";
      });
      row++;
    });

    row += 2;
  });

  ws.eachRow((excelRow) => {
    excelRow.height = 20;
    excelRow.eachCell((cell) => {
      cell.font = cell.font || { name: "Arial", size: 10 };
      cell.alignment = { ...(cell.alignment || {}), vertical: "middle" };
    });
  });

  ws.freezePanes = { ySplit: 10 };

  ws.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
  };

  ws.pageMargins = {
    left: 0.25,
    right: 0.25,
    top: 0.5,
    bottom: 0.5,
    header: 0.2,
    footer: 0.2,
  };

  return ws;
};

// =========================================================
// MAIN EXPORT
// =========================================================

// =========================================================
// MAIN EXPORT
// =========================================================

export const exportSchedulesToExcel = async ({
  companyName,
  companyAddress,
  year,
} = {}) => {
  try {
    companyName = import.meta.env?.VITE_COMPANY_NAME || "Revolve FinTech LLC";
    companyAddress =
      import.meta.env?.VITE_COMPANY_ADDRESS || "Vienna, VA 22182";
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Finaxis";
    workbook.lastModifiedBy = "Finaxis";
    workbook.created = new Date();
    workbook.modified = new Date();

    await addIceSetup(workbook, {
      companyName,
      companyAddress,
    });

    // =====================================================
    // SCHEDULE A
    // =====================================================

    await addScheduleA(workbook, {
      companyName,
      companyAddress,
    });

    // =====================================================
    // SCHEDULE B
    // =====================================================

    await addScheduleB(workbook, {
      companyName,
      companyAddress,
    });

    // =====================================================
    // SCHEDULE C (1)
    // =====================================================

    await addCSchedule(workbook, {
      sheetName: "Schedule C (1)",
      scheduleName: "SCHEDULE C (1)",
      sectionTitle: "Customer Site Overhead",
      companyName,
      companyAddress,
      getData: getScheduleC1Data,
      includeCalifornia: true,
      includeFringe: true,
    });

    // =====================================================
    // SCHEDULE C (2)
    // =====================================================

    await addCSchedule(workbook, {
      sheetName: "SCHEDULE C (2)",
      scheduleName: "SCHEDULE C (2)",
      sectionTitle: "Columbus Site Overhead",
      companyName,
      companyAddress,
      getData: getScheduleC2Data,
      includeCalifornia: true,
      includeFringe: false,
    });

    // =====================================================
    // SCHEDULE C (6)
    // =====================================================

    await addCSchedule(workbook, {
      sheetName: "SCHEDULE C (6)",
      scheduleName: "SCHEDULE C (6)",
      sectionTitle: "Subk & Material Handling",
      companyName,
      companyAddress,
      getData: getScheduleC6Data,
      includeCalifornia: false,
      includeFringe: true,
    });

    // =====================================================
    // SCHEDULE D (1)
    // =====================================================

    await addScheduleD1(workbook, {
      sheetName: "SCHEDULE D (1)",
      scheduleName: "SCHEDULE D (1)",
      sectionTitle: "AERO Fringe",
      companyName,
      companyAddress,
      getData: getScheduleD1Data,
      includeCalifornia: false,
      includeFringe: true,
    });

    //Schedule D (2)

    await addScheduleD2(workbook, {
      sheetName: "SCHEDULE D (2)",
      scheduleName: "SCHEDULE D (2)",
      sectionTitle: "California Intermediate Ind. Pool",
      companyName,
      companyAddress,
      getData: getScheduleD2Data,
    });

    await addScheduleE(workbook, {
      companyName,
      companyAddress,
    });

    await addFringe(workbook, { year: 2025, companyName, companyAddress });

    await addScheduleG(workbook, {
      companyName,
      companyAddress,
    });

    await addScheduleG1(workbook, {
      companyName,
      companyAddress,
    });

    await addSummaryScheduleH(workbook, {
      companyName,
      companyAddress,
    });

    await addScheduleH(workbook, companyName, companyAddress, 2025);

    await addScheduleH1(workbook, {
      companyName,
      companyAddress,
    });

    await addScheduleI(workbook, { companyName, companyAddress, year: 2025 });

    await addScheduleJ(workbook, {
      companyName,
      companyAddress,
      fiscalYearEnd: `${2025}-12-31`,
    });

    // summary and scout H pending

    //PENDING I

    await addScheduleK(workbook, {
      companyName,
      companyAddress,
      year: 2025,
    });

    await addScheduleL(workbook, { year: 2025, companyName, companyAddress });

    await addScheduleM(workbook, { year: 2025, companyName, companyAddress });

    // await addScheduleMFPRA(workbook);

    await addScheduleN(workbook);

    await addScheduleO(workbook, {
      companyName,
      companyAddress,
    });

    await addSupplA1(workbook, companyName, companyAddress);

    await addSupplA2(workbook, companyName, companyAddress);

    await addSupplA3(workbook, companyName, companyAddress);

    await addSupplA4(workbook, companyName, companyAddress);

    // await addSupplB(workbook, companyName, companyAddress, 2025); //404 api not found

    await addSupplC(workbook, year);

    await addSupplB(workbook, { companyName, companyAddress, year });

    //SUPPLY O
    await addSupplO(workbook, {
      companyName,
      companyAddress,
    });

    await addTrialBalance(workbook);

    await addJobCostLedger(workbook);

    // =====================================================
    // DOWNLOAD
    // =====================================================

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;

    anchor.download = `ICE_Submission_${FISCAL_YEAR}.xlsx`;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export schedules:", error);

    throw error;
  }
};
