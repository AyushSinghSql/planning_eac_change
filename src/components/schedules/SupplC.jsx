// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { backendUrl } from "../config";

// const BASE_URL = backendUrl;

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("token") ||
//     JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// const handleDateKeyDown = (e) => {
//   if (
//     [
//       "Backspace",
//       "Tab",
//       "ArrowLeft",
//       "ArrowRight",
//       "ArrowUp",
//       "ArrowDown",
//       "Delete",
//       "Enter",
//     ].includes(e.key) ||
//     e.ctrlKey ||
//     e.metaKey
//   ) {
//     return;
//   }
//   if (!/^[0-9/-]$/.test(e.key)) {
//     e.preventDefault();
//   }
// };

// const parseDate = (dateStr) => {
//   if (!dateStr || String(dateStr).includes("#")) return null;
//   if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
//   const str = String(dateStr).trim();
//   if (str.includes("/")) {
//     const parts = str.split("/");
//     if (parts.length === 3) {
//       const m = parseInt(parts[0], 10) - 1;
//       const d = parseInt(parts[1], 10);
//       let y = parseInt(parts[2], 10);
//       if (y < 100) y += y > 50 ? 1900 : 2000;
//       const dt = new Date(y, m, d);
//       return isNaN(dt.getTime()) ? null : dt;
//     }
//   }
//   if (str.includes("-")) {
//     const cleanStr = str.split("T")[0];
//     const parts = cleanStr.split("-");
//     if (parts.length === 3 && parts[0].length === 4) {
//       const y = parseInt(parts[0], 10);
//       const m = parseInt(parts[1], 10) - 1;
//       const d = parseInt(parts[2], 10);
//       const dt = new Date(y, m, d);
//       return isNaN(dt.getTime()) ? null : dt;
//     }
//   }
//   const d = new Date(str);
//   return isNaN(d.getTime()) ? null : d;
// };

// const formatDateToString = (date) => {
//   if (!date) return "";
//   const d = date instanceof Date ? date : parseDate(date);
//   if (!d || isNaN(d.getTime())) return "";
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   const yyyy = d.getFullYear();
//   return `${mm}/${dd}/${yyyy}`;
// };

// const formatDateToISO = (dateStr) => {
//   if (!dateStr) return null;
//   const d = parseDate(dateStr);
//   if (!d || isNaN(d.getTime())) return null;
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const parseNumeric = (val) => {
//   if (val === null || val === undefined || val === "") return null;
//   const clean = String(val).replace(/[$,]/g, "").trim();
//   const num = parseFloat(clean);
//   return isNaN(num) ? null : num;
// };

// const formatThousandSeparator = (val) => {
//   if (val === null || val === undefined || val === "") return "";
//   const clean = String(val).replace(/[$,]/g, "").trim();
//   if (clean === "") return "";
//   const num = parseFloat(clean);
//   if (isNaN(num)) return val;
//   return num.toLocaleString("en-US", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   });
// };

// /*
//  * Suppl C
//  * READ-ONLY reproduction of the supplied Excel worksheet.
//  * Values and visual formatting are taken directly from the workbook.
//  */

// const SHEET = {
//   rows: 28,
//   cols: 9,
//   widths: [484.0, 256.0, 193.6, 88.0, 14.4, 160.8, 198.4, 130.4, 80.0],
//   heights: [
//     20.0, 20.0, 20.0, 20.0, 19.2, 19.2, 19.2, 20.0, 20.0, 20.0, 35.2, 35.2,
//     20.0, 35.2, 20.0, 35.2, 20.0, 35.2, 20.0, 35.2, 20.0, 20.0, 20.0, 35.2,
//     35.2, 20.0, 20.0, 19.2,
//   ],
//   cells: [
//     {
//       r: 1,
//       c: 1,
//       text: "This Schedule does not contain any",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 1,
//       c: 2,
//       text: "IDENTIFICATION OF PRIME CONTRACTS UNDER",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 1,
//       c: 8,
//       text: "SUPPLEMENTAL C",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Times New Roman",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 1,
//       c: 9,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Times New Roman",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 2,
//       c: 1,
//       text: " links to other schedules.",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 2,
//       c: 2,
//       text: "WHICH THE CONTRACTOR PERFROMS AS A SUBCONTRACTOR",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 2,
//       c: 8,
//       text: " ICE (version 2.0.1h)",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Times New Roman",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 3,
//       c: 1,
//       text: "ICE MANUAL",
//       fill: null,
//       fontColor: "#0000FF",
//       bold: false,
//       italic: false,
//       underline: true,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "left",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 3,
//       c: 2,
//       text: "Fiscal Year End - 12/31/2025",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 4,
//       c: 1,
//       text: "",
//       fill: null,
//       fontColor: "#0000FF",
//       bold: false,
//       italic: false,
//       underline: true,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "left",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 1,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 2,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 3,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 4,
//       text: " ",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 5,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 7,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 8,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 5,
//       c: 9,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 1,
//       text: "Prime contractor  Name",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 2,
//       text: "Prime Contract No.",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 3,
//       text: "Subcontract",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 4,
//       text: "Subcontract",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 5,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 6,
//       text: "Release Subcontractor ",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 7,
//       text: "Subcontract Period of",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 8,
//       text: "Subcontract",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "left",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 6,
//       c: 9,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 1,
//       text: "and Full Address",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 2,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 3,
//       text: "Number",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 4,
//       text: "Type",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 5,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 6,
//       text: "Data To Prime",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 7,
//       text: "      Performance",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 8,
//       text: "Value",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "left",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 7,
//       c: 9,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: false,
//       underline: false,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 8,
//       c: 6,
//       text: "Yes/No",
//       fill: null,
//       fontColor: null,
//       bold: true,
//       italic: true,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 1,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 2,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 3,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 4,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 5,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "center",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 6,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 7,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 9,
//       c: 8,
//       text: "",
//       fill: "#C0C0C0",
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: false,
//       fontSize: 10.0,
//       fontName: "Arial",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "thin", color: null },
//         bottom: { style: "thin", color: null },
//       },
//     },
//     {
//       r: 28,
//       c: 1,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: true,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 28,
//       c: 2,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: true,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 28,
//       c: 3,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: true,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//     {
//       r: 28,
//       c: 4,
//       text: "",
//       fill: null,
//       fontColor: null,
//       bold: false,
//       italic: false,
//       underline: true,
//       fontSize: 11.0,
//       fontName: "Calibri",
//       hAlign: "general",
//       vAlign: "bottom",
//       wrap: false,
//       indent: 0,
//       border: {
//         left: { style: "", color: null },
//         right: { style: "", color: null },
//         top: { style: "", color: null },
//         bottom: { style: "", color: null },
//       },
//     },
//   ],
//   merges: [
//     [3, 2, 3, 7],
//     [2, 2, 2, 7],
//     [1, 2, 1, 7],
//   ],
// };

// const SUPPLC_STORAGE_KEY = "supplc-page-data-v2";
// const SUPPLC_DATA_START_ROW = 11;
// const SUPPLC_EDITABLE_COLUMNS = [1, 2, 3, 4, 6, 7, 8];

// const SUPPLC_COPY_HEADERS = [
//   "PRIME CONTRACTOR NAME & ADDRESS",
//   "PRIME CONTRACT NO.",
//   "SUBCONTRACT NO.",
//   "SUBCONTRACT TYPE",
//   "RELEASE DATA TO PRIME",
//   "POP START",
//   "POP END",
//   "SUBCONTRACT VALUE",
// ];

// const isSupplCHeaderLine = (line) => {
//   const upper = line.toUpperCase().trim();
//   if (!upper) return true;
//   if (
//     upper.includes("PRIME CONTRACT") ||
//     upper.includes("SUBCONTRACT NO") ||
//     upper.includes("SUBCONTRACT NUMBER") ||
//     upper.includes("SUBCONTRACT TYPE") ||
//     upper.includes("RELEASE") ||
//     upper.includes("PERIOD OF") ||
//     upper.includes("SUBCONTRACT VALUE") ||
//     upper.includes("SUPPLEMENTAL C") ||
//     upper.includes("ICE (VERSION") ||
//     upper.includes("ICE MANUAL") ||
//     upper.includes("FISCAL YEAR END") ||
//     upper.includes("THIS SCHEDULE DOES NOT")
//   ) {
//     return true;
//   }
//   return false;
// };

// const splitPopString = (popStr) => {
//   if (!popStr) return { start: "", end: "" };
//   const str = String(popStr).trim();
//   if (str.toLowerCase().includes(" to ")) {
//     const parts = str.split(/ to /i);
//     return { start: parts[0]?.trim() || "", end: parts[1]?.trim() || "" };
//   }
//   if (str.includes("–")) {
//     const parts = str.split("–");
//     return { start: parts[0]?.trim() || "", end: parts[1]?.trim() || "" };
//   }
//   if (str.includes("-")) {
//     const parts = str.split("-");
//     if (parts.length === 2) {
//       return { start: parts[0]?.trim() || "", end: parts[1]?.trim() || "" };
//     }
//     if (parts.length === 6) {
//       return {
//         start: `${parts[0]}-${parts[1]}-${parts[2]}`.trim(),
//         end: `${parts[3]}-${parts[4]}-${parts[5]}`.trim(),
//       };
//     }
//   }
//   return { start: str, end: "" };
// };

// const parseSupplCClipboardLine = (line) => {
//   const trimmed = line.trim();
//   if (!trimmed || isSupplCHeaderLine(trimmed)) return null;

//   const rawCols = line.split("\t").map((c) => c.trim());
//   if (rawCols.length === 0 || rawCols.every((c) => !c)) return null;

//   let primeName = "";
//   let primeNo = "";
//   let subcNo = "";
//   let subcType = "";
//   let release = "";
//   let popStart = "";
//   let popEnd = "";
//   let amt = "";

//   const isYesNo = (val) => {
//     if (!val) return false;
//     const v = String(val).toLowerCase().trim();
//     return ["yes", "no", "y", "n", "true", "false", "1", "0"].includes(v);
//   };

//   const isDateLike = (val) => {
//     if (!val) return false;
//     const v = String(val).trim();
//     return (
//       /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/.test(v) ||
//       v.toLowerCase().includes("to") ||
//       (v.includes("-") && /\d/.test(v))
//     );
//   };

//   // Case 1: Excel copy with blank spacer column 5
//   if (
//     rawCols.length >= 8 &&
//     (!rawCols[4] || isYesNo(rawCols[5])) &&
//     (isYesNo(rawCols[5]) || isDateLike(rawCols[6]))
//   ) {
//     primeName = rawCols[0] || "";
//     primeNo = rawCols[1] || "";
//     subcNo = rawCols[2] || "";
//     subcType = rawCols[3] || "";
//     release = rawCols[5] || "";
//     const pop = splitPopString(rawCols[6] || "");
//     popStart = pop.start;
//     popEnd = pop.end;
//     amt = rawCols[7] || "";
//   } else if (
//     rawCols.length >= 8 &&
//     (isDateLike(rawCols[5]) || isDateLike(rawCols[6]))
//   ) {
//     // Case 2: Internal copy: [Name, PrimeNo, SubcNo, SubcType, Release, PoPStart, PoPEnd, Amt]
//     primeName = rawCols[0] || "";
//     primeNo = rawCols[1] || "";
//     subcNo = rawCols[2] || "";
//     subcType = rawCols[3] || "";
//     release = rawCols[4] || "";
//     popStart = rawCols[5] || "";
//     popEnd = rawCols[6] || "";
//     amt = rawCols[7] || "";
//   } else if (rawCols.length >= 7) {
//     // Case 3: 7 columns: [Name, PrimeNo, SubcNo, SubcType, Release, PoPRange, Amt]
//     primeName = rawCols[0] || "";
//     primeNo = rawCols[1] || "";
//     subcNo = rawCols[2] || "";
//     subcType = rawCols[3] || "";
//     release = rawCols[4] || "";
//     const pop = splitPopString(rawCols[5] || "");
//     popStart = pop.start;
//     popEnd = pop.end;
//     amt = rawCols[6] || "";
//   } else if (rawCols.length >= 6) {
//     primeName = rawCols[0] || "";
//     primeNo = rawCols[1] || "";
//     subcNo = rawCols[2] || "";
//     subcType = rawCols[3] || "";
//     release = rawCols[4] || "";
//     amt = rawCols[5] || "";
//   } else {
//     primeName = rawCols[0] || "";
//     primeNo = rawCols[1] || "";
//     subcNo = rawCols[2] || "";
//     subcType = rawCols[3] || "";
//     if (rawCols[4]) amt = rawCols[4];
//   }

//   let formattedRelease = release;
//   if (isYesNo(release)) {
//     formattedRelease = ["yes", "y", "true", "1"].includes(release.toLowerCase())
//       ? "Yes"
//       : "No";
//   }

//   return {
//     1: primeName,
//     2: primeNo,
//     3: subcNo,
//     4: subcType,
//     6: formattedRelease,
//     7: {
//       start: popStart ? formatDateToString(popStart) || popStart : "",
//       end: popEnd ? formatDateToString(popEnd) || popEnd : "",
//     },
//     8: amt ? formatThousandSeparator(amt) : "",
//   };
// };

// const getInitialRow = () => ({
//   1: "",
//   2: "",
//   3: "",
//   4: "",
//   6: "",
//   7: { start: "", end: "" },
//   8: "",
// });

// const getInitialSupplCData = () => [getInitialRow()];

// const borderCss = (side) => {
//   if (!side || !side.style) return "none";
//   const styles = {
//     thin: "1px solid",
//     medium: "2px solid",
//     thick: "3px solid",
//     double: "3px double",
//     hair: "1px solid",
//     dotted: "1px dotted",
//     dashed: "1px dashed",
//   };
//   return `${styles[side.style] || "1px solid"} ${side.color || "#000000"}`;
// };

// const alignMap = {
//   general: "left",
//   left: "left",
//   center: "center",
//   right: "right",
//   justify: "justify",
//   fill: "left",
// };

// const getCellStyle = (cell) => ({
//   background: cell.fill || "transparent",
//   color: cell.fontColor || "#000",
//   fontFamily: cell.fontName || "Arial",
//   fontSize: `${cell.fontSize || 10}px`,
//   fontWeight: cell.bold ? 700 : 400,
//   fontStyle: cell.italic ? "italic" : "normal",
//   textDecoration: cell.underline ? "underline" : "none",

//   textAlign: alignMap[cell.hAlign] || "left",

//   justifyContent:
//     cell.hAlign === "center"
//       ? "center"
//       : cell.hAlign === "right"
//         ? "flex-end"
//         : "flex-start",

//   verticalAlign:
//     cell.vAlign === "center"
//       ? "middle"
//       : cell.vAlign === "top"
//         ? "top"
//         : "bottom",
//   whiteSpace: cell.wrap ? "normal" : "nowrap",
//   overflow: "hidden",
//   paddingLeft: `${4 + (cell.indent || 0) * 6}px`,
//   paddingRight: "4px",
//   boxSizing: "border-box",
//   borderLeft: borderCss(cell.border?.left),
//   borderRight: borderCss(cell.border?.right),
//   borderTop: borderCss(cell.border?.top),
//   borderBottom: borderCss(cell.border?.bottom),
//   lineHeight: 1.05,
// });

// const getCellTextAlign = (col) => {
//   switch (col) {
//     case 1: // Prime contractor Name and Full Address
//       return "left";
//     case 2: // Prime Contract No.
//       return "center";
//     case 3: // Subcontract Number
//       return "center";
//     case 4: // Subcontract Type
//       return "center";
//     case 6: // Release Subcontractor Data To Prime (Date to Prime)
//       return "center";
//     case 7: // Period of Performance
//       return "center";
//     case 8: // Subcontract Value (number)
//       return "left";
//     default:
//       return "left";
//   }
// };

// export default function SupplC() {
//   const [rows, setRows] = useState(getInitialSupplCData);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [fiscalYearEnd, setFiscalYearEnd] = useState("2025-12-31");
//   const [saved, setSaved] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const getSelectedYear = useCallback(() => {
//     const d = parseDate(fiscalYearEnd);
//     return d ? d.getFullYear() : 2025;
//   }, [fiscalYearEnd]);

//   const fetchSupplCData = useCallback(async () => {
//     const year = getSelectedYear();
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/SupplC?year=${year}`, {
//         headers: getAuthHeaders(),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         const records = Array.isArray(data) ? data : data ? [data] : [];
//         if (records.length > 0) {
//           const mappedRows = records.map((item) => {
//             const primeName =
//               item.primeCntrNameAddr ?? item.PrimeCntrNameAddr ?? "";
//             const primeNo = item.primeCntrNo ?? item.PrimeCntrNo ?? "";
//             const subcNo = item.subcNo ?? item.SubcNo ?? "";
//             const subcType = item.subcType ?? item.SubcType ?? "";
//             const releaseVal =
//               item.subcToPrime !== undefined
//                 ? item.subcToPrime
//                 : item.SubcToPrime;
//             const startDtRaw = item.subcPopStartDt ?? item.SubcPopStartDt;
//             const endDtRaw = item.subcPopEndDt ?? item.SubcPopEndDt;
//             const amtRaw =
//               item.subcAmt !== undefined ? item.subcAmt : item.SubcAmt;

//             const startDt = startDtRaw
//               ? formatDateToString(parseDate(startDtRaw))
//               : "";
//             const endDt = endDtRaw
//               ? formatDateToString(parseDate(endDtRaw))
//               : "";

//             let releaseText = "";
//             if (
//               releaseVal === true ||
//               String(releaseVal).toLowerCase() === "true" ||
//               String(releaseVal) === "1"
//             ) {
//               releaseText = "Yes";
//             } else if (
//               releaseVal === false ||
//               String(releaseVal).toLowerCase() === "false" ||
//               String(releaseVal) === "0"
//             ) {
//               releaseText = "No";
//             } else if (typeof releaseVal === "string" && releaseVal.trim()) {
//               releaseText = releaseVal.trim();
//             }

//             return {
//               1: primeName,
//               2: primeNo,
//               3: subcNo,
//               4: subcType,
//               6: releaseText,
//               7: { start: startDt, end: endDt },
//               8: amtRaw != null ? formatThousandSeparator(amtRaw) : "",
//             };
//           });

//           setRows(mappedRows.length > 0 ? mappedRows : [getInitialRow()]);
//         } else {
//           setRows([getInitialRow()]);
//         }
//       } else {
//         setRows([getInitialRow()]);
//       }
//     } catch (err) {
//       console.error("Error fetching Suppl C data:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [getSelectedYear]);

//   useEffect(() => {
//     fetchSupplCData();
//   }, [fetchSupplCData]);

//   const markUnsaved = () => setSaved(false);

//   const updateRow = (index, column, value) => {
//     setRows((current) => {
//       const nextRows = current.map((row, rowIndex) =>
//         rowIndex === index ? { ...row, [column]: value } : row,
//       );
//       return nextRows;
//     });
//     markUnsaved();
//   };

//   const updatePopDate = (index, field, value) => {
//     let sanitizedValue = value;
//     if (typeof value === "string") {
//       sanitizedValue = value.replace(/[^0-9/-]/g, "");
//     }
//     setRows((current) => {
//       const nextRows = current.map((row, rowIndex) => {
//         if (rowIndex === index) {
//           const currentPop =
//             typeof row[7] === "object" && row[7] !== null
//               ? row[7]
//               : { start: "", end: "" };
//           return {
//             ...row,
//             7: { ...currentPop, [field]: sanitizedValue },
//           };
//         }
//         return row;
//       });
//       return nextRows;
//     });
//     markUnsaved();
//   };

//   const addRow = () => {
//     setRows((current) => [...current, getInitialRow()]);
//     markUnsaved();
//   };

//   const handleCopy = async () => {
//     if (selectedRows.length === 0) {
//       toast.warning("Please select at least one row to copy.");
//       return;
//     }

//     const selectedData = selectedRows.map((idx) => rows[idx]).filter(Boolean);

//     if (selectedData.length === 0) return;

//     const headerLine = SUPPLC_COPY_HEADERS.join("\t");
//     const dataLines = selectedData.map((r) => {
//       const popStart =
//         typeof r[7] === "object" && r[7] !== null ? r[7].start || "" : "";
//       const popEnd =
//         typeof r[7] === "object" && r[7] !== null ? r[7].end || "" : "";
//       return [
//         (r[1] || "").toString().replace(/\t/g, " "),
//         (r[2] || "").toString().replace(/\t/g, " "),
//         (r[3] || "").toString().replace(/\t/g, " "),
//         (r[4] || "").toString().replace(/\t/g, " "),
//         (r[6] || "").toString().replace(/\t/g, " "),
//         popStart.replace(/\t/g, " "),
//         popEnd.replace(/\t/g, " "),
//         (r[8] || "").toString().replace(/\t/g, " "),
//       ].join("\t");
//     });

//     const tsvString = [headerLine, ...dataLines].join("\n");

//     try {
//       await navigator.clipboard.writeText(tsvString);
//       toast.success(`${selectedData.length} row(s) copied.`);
//     } catch (err) {
//       const textArea = document.createElement("textarea");
//       textArea.value = tsvString;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand("copy");
//       document.body.removeChild(textArea);
//       toast.success(`${selectedData.length} row(s) copied.`);
//     }
//   };

//   const handlePaste = async (clipboardText = null) => {
//     let text = clipboardText;
//     if (!text || typeof text !== "string") {
//       try {
//         text = await navigator.clipboard.readText();
//       } catch (err) {
//         toast.warning(
//           "Clipboard access unavailable. Please use Ctrl + V to paste.",
//         );
//         return;
//       }
//     }

//     if (!text || typeof text !== "string" || !text.trim()) {
//       toast.warning("Clipboard is empty.");
//       return;
//     }

//     const rawLines = text.split(/\r\n|\n|\r/);
//     const parsedRows = [];

//     rawLines.forEach((line) => {
//       const parsed = parseSupplCClipboardLine(line);
//       if (parsed) {
//         parsedRows.push(parsed);
//       }
//     });

//     if (parsedRows.length === 0) {
//       toast.warning("No valid data rows found to paste.");
//       return;
//     }

//     setRows((current) => {
//       const isInitialBlank =
//         current.length === 1 &&
//         !current[0][1] &&
//         !current[0][2] &&
//         !current[0][3] &&
//         !current[0][4] &&
//         !current[0][6] &&
//         !current[0][7]?.start &&
//         !current[0][7]?.end &&
//         !current[0][8];

//       return isInitialBlank ? [...parsedRows] : [...current, ...parsedRows];
//     });

//     setSelectedRows([]);
//     markUnsaved();
//     toast.success(`${parsedRows.length} row(s) pasted.`);
//   };

//   const handleKeyDown = (e) => {
//     if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
//       const activeEl = document.activeElement;
//       const isInputFocused =
//         activeEl &&
//         (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
//       const hasTextSelection =
//         window.getSelection() && window.getSelection().toString().length > 0;

//       if (!isInputFocused || !hasTextSelection) {
//         if (selectedRows.length > 0) {
//           e.preventDefault();
//           handleCopy();
//         }
//       }
//     }
//   };

//   const handlePasteEvent = (e) => {
//     const clipboardData = e.clipboardData || window.clipboardData;
//     const pastedText = clipboardData ? clipboardData.getData("text") : "";

//     if (
//       pastedText &&
//       (pastedText.includes("\t") || pastedText.includes("\n"))
//     ) {
//       e.preventDefault();
//       handlePaste(pastedText);
//     }
//   };

//   const toggleSelectAllRows = (checked) => {
//     setSelectedRows(checked ? rows.map((_, index) => index) : []);
//   };

//   const deleteRows = async () => {
//     if (!selectedRows.length) return;
//     const year = getSelectedYear();
//     const selected = new Set(selectedRows);

//     const toDeletePayload = [];
//     selectedRows.forEach((idx) => {
//       const r = rows[idx];
//       if (r && r[2] && r[3] && r[4]) {
//         toDeletePayload.push({
//           year,
//           primeCntrNo: String(r[2]).trim(),
//           subcNo: String(r[3]).trim(),
//           subcType: String(r[4]).trim(),
//         });
//       }
//     });

//     if (toDeletePayload.length > 0) {
//       try {
//         const res = await fetch(`${BASE_URL}/api/SupplC/bulk-delete`, {
//           method: "POST",
//           headers: getAuthHeaders(),
//           body: JSON.stringify(toDeletePayload),
//         });
//         if (res.ok) {
//           toast.success("Selected row(s) deleted successfully.");
//         }
//       } catch (err) {
//         console.error("Error deleting rows:", err);
//       }
//     }

//     setRows((current) => {
//       const remaining = current.filter((_, index) => !selected.has(index));
//       return remaining.length > 0 ? remaining : [getInitialRow()];
//     });
//     setSelectedRows([]);
//     markUnsaved();
//   };

//   const clearRows = async () => {
//     if (selectedRows.length > 0) {
//       const selected = new Set(selectedRows);
//       setRows((current) =>
//         current.map((row, index) =>
//           selected.has(index) ? getInitialRow() : row,
//         ),
//       );
//       setSelectedRows([]);
//       markUnsaved();
//       toast.info("Selected row(s) cleared.");
//     } else {
//       await fetchSupplCData();
//       setSelectedRows([]);
//       setSaved(false);
//       toast.info("All unsaved changes cleared.");
//     }
//   };

//   const savePage = async () => {
//     const year = getSelectedYear();

//     const usedKeys = new Set();
//     const payload = [];

//     rows.forEach((r, idx) => {
//       const primeName = (r[1] || "").toString().trim();
//       let primeNo = (r[2] || "").toString().trim();
//       let subcNo = (r[3] || "").toString().trim();
//       let subcType = (r[4] || "").toString().trim();
//       const releaseVal = (r[6] || "").toString().trim().toLowerCase();
//       const popVal = r[7];
//       const amtVal = r[8];

//       const hasPop =
//         typeof popVal === "object" && popVal !== null
//           ? Boolean(popVal.start || popVal.end)
//           : Boolean(popVal);

//       const hasAnyData =
//         primeName ||
//         primeNo ||
//         subcNo ||
//         subcType ||
//         releaseVal ||
//         hasPop ||
//         (amtVal !== "" && amtVal !== undefined && amtVal !== null);
//       if (!hasAnyData) return;

//       // Provide sensible fallback keys if any of the composite primary key fields are blank:
//       if (!primeNo) primeNo = `PRM-${idx + 1}`;
//       if (!subcNo) subcNo = `SUB-${idx + 1}`;
//       if (!subcType) subcType = "FFP";

//       // Prevent duplicate PK collisions in DB if two rows have identical keys:
//       let key = `${primeNo}_${subcNo}_${subcType}`;
//       if (usedKeys.has(key)) {
//         subcNo = `${subcNo}-${idx + 1}`;
//         key = `${primeNo}_${subcNo}_${subcType}`;
//       }
//       usedKeys.add(key);

//       let subcToPrime = null;
//       if (["yes", "y", "true", "1"].includes(releaseVal)) subcToPrime = true;
//       else if (["no", "n", "false", "0"].includes(releaseVal))
//         subcToPrime = false;

//       let subcPopStartDt = null;
//       let subcPopEndDt = null;
//       if (popVal) {
//         if (typeof popVal === "object") {
//           subcPopStartDt = popVal.start ? formatDateToISO(popVal.start) : null;
//           subcPopEndDt = popVal.end ? formatDateToISO(popVal.end) : null;
//         } else if (typeof popVal === "string") {
//           const { start, end } = splitPopString(popVal);
//           subcPopStartDt = start ? formatDateToISO(start) : null;
//           subcPopEndDt = end ? formatDateToISO(end) : null;
//         }
//       }

//       payload.push({
//         year,
//         primeCntrNameAddr: primeName || null,
//         primeCntrNo: primeNo,
//         subcNo: subcNo,
//         subcType: subcType,
//         subcToPrime: subcToPrime,
//         subcPopStartDt: subcPopStartDt,
//         subcPopEndDt: subcPopEndDt,
//         subcAmt: parseNumeric(amtVal),
//       });
//     });

//     if (payload.length === 0) {
//       toast.info("Please fill in data for at least one row before saving.");
//       return;
//     }

//     try {
//       const res = await fetch(`${BASE_URL}/api/SupplC/bulk-upsert`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         toast.success("Supplemental C records saved successfully!");
//         setSaved(true);
//         setSelectedRows([]);
//         window.setTimeout(() => setSaved(false), 2000);
//         localStorage.setItem(
//           SUPPLC_STORAGE_KEY,
//           JSON.stringify({ rows, fiscalYearEnd }),
//         );
//         await fetchSupplCData();
//       } else {
//         const err = await res.json().catch(() => ({}));
//         toast.error(err.message || "Failed to save Supplemental C.");
//       }
//     } catch (err) {
//       console.error("Error saving Suppl C:", err);
//       toast.error("Network error while saving Supplemental C.");
//     }
//   };

//   const cellMap = useMemo(() => {
//     const map = new Map();
//     SHEET.cells.forEach((cell) => map.set(`${cell.r}:${cell.c}`, cell));
//     return map;
//   }, []);

//   const mergeMap = useMemo(() => {
//     const map = new Map();
//     SHEET.merges.forEach(([minRow, minCol, maxRow, maxCol]) => {
//       for (let r = minRow; r <= maxRow; r++) {
//         for (let c = minCol; c <= maxCol; c++) {
//           if (r === minRow && c === minCol) {
//             map.set(`${r}:${c}`, {
//               master: true,
//               rowSpan: maxRow - minRow + 1,
//               colSpan: maxCol - minCol + 1,
//             });
//           } else {
//             map.set(`${r}:${c}`, { master: false });
//           }
//         }
//       }
//     });
//     return map;
//   }, []);

//   const getDataCellValue = (rowIndex, column, fallback) => {
//     if (rowIndex < SUPPLC_DATA_START_ROW || column === 5 || column === 9)
//       return fallback;
//     const dataIndex = rowIndex - SUPPLC_DATA_START_ROW;
//     const val = rows[dataIndex]?.[column];
//     return val !== undefined ? val : fallback;
//   };

//   const isDataRow = (rowIndex) =>
//     rowIndex >= SUPPLC_DATA_START_ROW &&
//     rowIndex < SUPPLC_DATA_START_ROW + rows.length;
//   const displayRowCount = Math.max(10 + rows.length + 1, 12);
//   const displayHeights = Array.from({ length: displayRowCount }, (_, index) => {
//     const rowNumber = index + 1;
//     if (
//       rowNumber >= SUPPLC_DATA_START_ROW &&
//       rowNumber < SUPPLC_DATA_START_ROW + rows.length
//     ) {
//       return 35.2;
//     }
//     return SHEET.heights[index] || 20;
//   });

//   return (
//     <div
//       className="supplc-page"
//       onKeyDown={handleKeyDown}
//       onPaste={handlePasteEvent}
//     >
//       <style>{`
//         * { box-sizing: border-box; }

//         .supplc-page {
//           min-height: 100vh;
//           background: #e5e5e5;
//           padding: 12px;
//           font-family: Arial, Helvetica, sans-serif;
//         }

//         .supplc-toolbar {
//           width: 100%;
//           max-width: 1500px;
//           height: 34px;
//           margin: 0 auto 8px;
//           padding: 0 10px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           border: 1px solid #aaa;
//           background: #f7f7f7;
//           color: #333;
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .supplc-toolbar-title {
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .supplc-toolbar-actions {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .supplc-header-with-checkbox {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .supplc-select-all-header {
//           position: absolute;
//           left: 4px;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 13px;
//           height: 13px;
//           margin: 0;
//           padding: 0;
//           cursor: pointer;
//           z-index: 2;
//         }

//         .supplc-btn {
//           border: 0;
//           border-radius: 16px;
//           min-width: 68px;
//           height: 28px;
//           padding: 0 12px;
//           font-weight: 700;
//           font-size: 10px;
//           color: #fff;
//           background: #0c465b;
//           cursor: pointer;
//         }

//         .supplc-btn:hover:not(:disabled) { filter: brightness(.94); }
//         .supplc-btn:disabled { opacity: 0.45; cursor: not-allowed; }
//         .supplc-btn.delete { background: #f39a9d; }
//         .supplc-saved {
//           font-size: 11px;
//           color: #24734a;
//           margin-left: 4px;
//         }

//         .supplc-cell-input {
//           width: 100%;
//           height: 100%;
//           min-width: 0;
//           border: 0;
//           outline: none;
//           background: transparent;
//           color: inherit;
//           font: inherit;
//           padding: 0 4px;
//         }

//         .supplc-pop-container {
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 2px;
//         }

//         .supplc-pop-container .react-datepicker-wrapper {
//           flex: 1;
//           min-width: 0;
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//         }

//         .supplc-pop-container .react-datepicker__input-container {
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//         }

//         .supplc-pop-date-input {
//           width: 100%;
//           height: 24px;
//           border: 1px solid #c0c7d0;
//           border-radius: 2px;
//           background: #fff;
//           font-family: Arial, sans-serif;
//           font-size: 11px;
//           padding: 1px 4px;
//           color: #333;
//           outline: none;
//           text-align: center;
//         }

//         .supplc-pop-date-input:focus {
//           border-color: #0c465b;
//           box-shadow: 0 0 0 1px #0c465b;
//         }

//         .supplc-pop-sep {
//           font-size: 11px;
//           font-weight: bold;
//           color: #555;
//           user-select: none;
//           padding: 0 1px;
//         }

//         .supplc-data-cell-with-checkbox {
//           position: relative;
//         }

//         .supplc-row-checkbox {
//           position: absolute;
//           left: 4px;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 13px;
//           height: 13px;
//           margin: 0;
//           padding: 0;
//           cursor: pointer;
//           z-index: 2;
//         }

//         .supplc-data-cell-with-checkbox .supplc-cell-input {
//           padding-left: 21px;
//         }

//         .supplc-cell-input:focus {
//           outline: 1px solid #8bb8d0;
//           outline-offset: -1px;
//         }

//         .supplc-fiscal-date-box {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .supplc-fiscal-date-box .react-datepicker-wrapper,
//         .supplc-fiscal-date-box .react-datepicker__input-container {
//           display: inline-flex !important;
//           width: auto !important;
//           align-items: center;
//         }

//         .supplc-fiscal-datepicker-input {
//           width: 76px;
//           height: 20px;
//           border: 0;
//           outline: none;
//           background: transparent;
//           color: inherit;
//           font-family: inherit;
//           font-size: inherit;
//           font-weight: inherit;
//           text-align: left;
//           cursor: pointer;
//           padding: 0;
//         }

//         .supplc-fiscal-datepicker-input:hover {
//           text-decoration: underline;
//         }

//         .react-datepicker-wrapper {
//           display: inline-flex;
//           align-items: center;
//           width: auto;
//         }

//         .react-datepicker__input-container {
//           display: inline-flex;
//           align-items: center;
//           width: auto;
//         }

//         .react-datepicker-popper {
//           z-index: 99999 !important;
//         }

//         .readonly-badge {
//           padding: 3px 8px;
//           border: 1px solid #999;
//           background: #eee;
//           color: #555;
//           font-size: 10px;
//           letter-spacing: .4px;
//         }

//         .supplc-scroll {
//           width: 100%;
//           max-width: 1500px;
//           margin: 0 auto;
//           overflow: auto;
//           background: #fff;
//           border: 1px solid #999;
//           box-shadow: 0 2px 8px rgba(0,0,0,.12);
//         }

//         .excel-sheet {
//           display: grid;
//           width: max-content;
//           min-width: 100%;
//           background: #fff;
//         }

//         .excel-cell {
//           min-width: 0;
//           min-height: 0;
//           display: flex;
//           align-items: center;
//           overflow: hidden;
//           user-select: text;
//           cursor: default;
//         }

//         .supplc-legend {
//           width: 100%;
//           max-width: 1500px;
//           margin: 8px auto 0;
//           display: flex;
//           gap: 22px;
//           align-items: center;
//           padding: 6px 9px;
//           border: 1px solid #b7b7b7;
//           background: #fff;
//           color: #333;
//           font-size: 10px;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .legend-color {
//           width: 24px;
//           height: 12px;
//           border: 1px solid #777;
//         }

//         .yellow { background: #FFFF00; }
//         .cyan { background: #00FFFF; }

//         @media print {
//           .supplc-page { padding: 0; background: #fff; }
//           .supplc-toolbar { display: none; }
//           .supplc-scroll {
//             max-width: none;
//             overflow: visible;
//             border: 0;
//             box-shadow: none;
//           }
//           .supplc-legend {
//             max-width: none;
//             border: 0;
//           }
//         }
//       `}</style>

//       <div className="supplc-toolbar">
//         <div className="supplc-toolbar-title">SUPPLEMENTAL C</div>
//         <div className="supplc-toolbar-actions">
//           <button type="button" className="supplc-btn" onClick={addRow}>
//             New
//           </button>
//           <button
//             type="button"
//             className="supplc-btn"
//             onClick={handleCopy}
//             disabled={selectedRows.length === 0}
//           >
//             Copy
//           </button>
//           <button
//             type="button"
//             className="supplc-btn"
//             onClick={() => handlePaste()}
//             disabled={selectedRows.length === 0}
//           >
//             Paste
//           </button>
//           <button
//             type="button"
//             className="supplc-btn delete"
//             onClick={deleteRows}
//             disabled={selectedRows.length === 0}
//           >
//             Delete
//           </button>
//           <button type="button" className="supplc-btn" onClick={clearRows}>
//             Clear
//           </button>
//           <button type="button" className="supplc-btn" onClick={savePage}>
//             Save
//           </button>
//           {saved && <span className="supplc-saved">Saved</span>}
//         </div>
//       </div>

//       <div className="supplc-scroll">
//         <div
//           className="excel-sheet"
//           style={{
//             gridTemplateColumns: SHEET.widths.map((w) => `${w}px`).join(" "),
//             gridTemplateRows: displayHeights.map((h) => `${h}px`).join(" "),
//           }}
//         >
//           {Array.from({ length: displayRowCount }, (_, rowIndex) => {
//             const r = rowIndex + 1;

//             return Array.from({ length: SHEET.cols }, (_, colIndex) => {
//               const c = colIndex + 1;
//               const key = `${r}:${c}`;
//               const merge = mergeMap.get(key);

//               if (merge && !merge.master) return null;

//               const cell = cellMap.get(key) || {
//                 r,
//                 c,
//                 text: "",
//                 fill: null,
//                 fontColor: "#000",
//                 bold: false,
//                 italic: false,
//                 underline: false,
//                 fontSize: 10,
//                 fontName: "Arial",
//                 hAlign: "general",
//                 vAlign: "bottom",
//                 wrap: false,
//                 indent: 0,
//                 border: {},
//               };

//               return (
//                 <div
//                   key={key}
//                   className="excel-cell"
//                   style={{
//                     gridRow: `${r} / span ${merge?.rowSpan || 1}`,
//                     gridColumn: `${c} / span ${merge?.colSpan || 1}`,
//                     ...getCellStyle(cell),
//                   }}
//                 >
//                   {r === 3 && c === 2 ? (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <div className="supplc-fiscal-date-box">
//                         <span style={{ whiteSpace: "nowrap", marginRight: 4 }}>
//                           Fiscal Year End -
//                         </span>
//                         <DatePicker
//                           selected={parseDate(fiscalYearEnd)}
//                           onChange={(date) => {
//                             const nextDate = date
//                               ? formatDateToString(date)
//                               : "";
//                             setFiscalYearEnd(nextDate);
//                             try {
//                               localStorage.setItem(
//                                 SUPPLC_STORAGE_KEY,
//                                 JSON.stringify({
//                                   rows,
//                                   fiscalYearEnd: nextDate,
//                                 }),
//                               );
//                             } catch (error) {
//                               console.error(
//                                 "Failed to persist Suppl C fiscal year end:",
//                                 error,
//                               );
//                             }
//                             markUnsaved();
//                           }}
//                           onChangeRaw={(e) => {
//                             if (e?.target?.value !== undefined) {
//                               const clean = e.target.value.replace(
//                                 /[^0-9/-]/g,
//                                 "",
//                               );
//                               setFiscalYearEnd(clean);
//                               markUnsaved();
//                             }
//                           }}
//                           onKeyDown={handleDateKeyDown}
//                           dateFormat="MM/dd/yyyy"
//                           placeholderText="MM/DD/YYYY"
//                           className="supplc-fiscal-datepicker-input"
//                           popperPlacement="bottom-start"
//                         />
//                       </div>
//                     </div>
//                   ) : isDataRow(r) && SUPPLC_EDITABLE_COLUMNS.includes(c) ? (
//                     c === 7 ? (
//                       <div
//                         className="supplc-pop-container"
//                         onClick={(event) => {
//                           event.stopPropagation();
//                           setSelectedRows((current) =>
//                             current.includes(r - SUPPLC_DATA_START_ROW)
//                               ? current
//                               : [...current, r - SUPPLC_DATA_START_ROW],
//                           );
//                         }}
//                       >
//                         <DatePicker
//                           selected={parseDate(
//                             rows[r - SUPPLC_DATA_START_ROW]?.[7]?.start,
//                           )}
//                           onChange={(date) =>
//                             updatePopDate(
//                               r - SUPPLC_DATA_START_ROW,
//                               "start",
//                               date ? formatDateToString(date) : "",
//                             )
//                           }
//                           onChangeRaw={(e) => {
//                             if (e?.target?.value !== undefined) {
//                               const clean = e.target.value.replace(
//                                 /[^0-9/-]/g,
//                                 "",
//                               );
//                               updatePopDate(
//                                 r - SUPPLC_DATA_START_ROW,
//                                 "start",
//                                 clean,
//                               );
//                             }
//                           }}
//                           onKeyDown={handleDateKeyDown}
//                           dateFormat="MM/dd/yyyy"
//                           placeholderText="MM/DD/YYYY"
//                           className="supplc-pop-date-input"
//                           popperPlacement="bottom-start"
//                         />
//                         <span className="supplc-pop-sep">–</span>
//                         <DatePicker
//                           selected={parseDate(
//                             rows[r - SUPPLC_DATA_START_ROW]?.[7]?.end,
//                           )}
//                           onChange={(date) =>
//                             updatePopDate(
//                               r - SUPPLC_DATA_START_ROW,
//                               "end",
//                               date ? formatDateToString(date) : "",
//                             )
//                           }
//                           onChangeRaw={(e) => {
//                             if (e?.target?.value !== undefined) {
//                               const clean = e.target.value.replace(
//                                 /[^0-9/-]/g,
//                                 "",
//                               );
//                               updatePopDate(
//                                 r - SUPPLC_DATA_START_ROW,
//                                 "end",
//                                 clean,
//                               );
//                             }
//                           }}
//                           onKeyDown={handleDateKeyDown}
//                           dateFormat="MM/dd/yyyy"
//                           placeholderText="MM/DD/YYYY"
//                           className="supplc-pop-date-input"
//                           popperPlacement="bottom-start"
//                         />
//                       </div>
//                     ) : (
//                       <div
//                         className={
//                           c === 1 ? "supplc-data-cell-with-checkbox" : undefined
//                         }
//                         style={{ width: "100%", height: "100%" }}
//                       >
//                         {c === 1 && (
//                           <input
//                             type="checkbox"
//                             className="supplc-row-checkbox"
//                             checked={selectedRows.includes(
//                               r - SUPPLC_DATA_START_ROW,
//                             )}
//                             onChange={(event) => {
//                               event.stopPropagation();
//                               const rowIndex = r - SUPPLC_DATA_START_ROW;
//                               setSelectedRows((current) =>
//                                 event.target.checked
//                                   ? current.includes(rowIndex)
//                                     ? current
//                                     : [...current, rowIndex]
//                                   : current.filter(
//                                       (index) => index !== rowIndex,
//                                     ),
//                               );
//                             }}
//                             onClick={(event) => event.stopPropagation()}
//                             aria-label={`Select Suppl C row ${r}`}
//                           />
//                         )}
//                         <input
//                           type="text"
//                           className="supplc-cell-input"
//                           value={getDataCellValue(r, c, cell.text)}
//                           onChange={(event) =>
//                             updateRow(
//                               r - SUPPLC_DATA_START_ROW,
//                               c,
//                               event.target.value,
//                             )
//                           }
//                           onBlur={(event) => {
//                             if (c === 8) {
//                               const formatted = formatThousandSeparator(
//                                 event.target.value,
//                               );
//                               updateRow(
//                                 r - SUPPLC_DATA_START_ROW,
//                                 c,
//                                 formatted,
//                               );
//                             }
//                           }}
//                           onClick={(event) => {
//                             event.stopPropagation();
//                             setSelectedRows((current) =>
//                               current.includes(r - SUPPLC_DATA_START_ROW)
//                                 ? current
//                                 : [...current, r - SUPPLC_DATA_START_ROW],
//                             );
//                           }}
//                           style={{
//                             textAlign: getCellTextAlign(c),
//                           }}
//                           aria-label={`Suppl C row ${r} column ${c}`}
//                         />
//                       </div>
//                     )
//                   ) : (
//                     cell.text
//                   )}
//                 </div>
//               );
//             });
//           })}
//         </div>
//       </div>

//       <div className="supplc-legend">
//         {/* <div className="legend-item">
//           <span className="legend-color yellow" />
//           <span>Linked / highlighted worksheet value</span>
//         </div>
//         <div className="legend-item">
//           <span className="legend-color cyan" />
//           <span>Formula / calculated value</span>
//         </div> */}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../config";

const BASE_URL = backendUrl;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleDateKeyDown = (e) => {
  if (
    [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Delete",
      "Enter",
    ].includes(e.key) ||
    e.ctrlKey ||
    e.metaKey
  ) {
    return;
  }
  if (!/^[0-9/-]$/.test(e.key)) {
    e.preventDefault();
  }
};

const parseDate = (dateStr) => {
  if (!dateStr || String(dateStr).includes("#")) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
  const str = String(dateStr).trim();
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length === 3) {
      const m = parseInt(parts[0], 10) - 1;
      const d = parseInt(parts[1], 10);
      let y = parseInt(parts[2], 10);
      if (y < 100) y += y > 50 ? 1900 : 2000;
      const dt = new Date(y, m, d);
      return isNaN(dt.getTime()) ? null : dt;
    }
  }
  if (str.includes("-")) {
    const cleanStr = str.split("T")[0];
    const parts = cleanStr.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dt = new Date(y, m, d);
      return isNaN(dt.getTime()) ? null : dt;
    }
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const formatDateToString = (date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : parseDate(date);
  if (!d || isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const formatDateToISO = (dateStr) => {
  if (!dateStr) return null;
  const d = parseDate(dateStr);
  if (!d || isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const parseNumeric = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const clean = String(val).replace(/[$,]/g, "").trim();
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
};

const formatThousandSeparator = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const clean = String(val).replace(/[$,]/g, "").trim();
  if (clean === "") return "";
  const num = parseFloat(clean);
  if (isNaN(num)) return val;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/*
 * Suppl C
 * READ-ONLY reproduction of the supplied Excel worksheet.
 * Values and visual formatting are taken directly from the workbook.
 */

const SUPPLC_STORAGE_KEY = "supplc-page-data-v2";
const SUPPLC_DATA_START_ROW = 11;
const SUPPLC_EDITABLE_COLUMNS = [1, 2, 3, 4, 6, 7, 8];

const SUPPLC_COPY_HEADERS = [
  "PRIME CONTRACTOR NAME & ADDRESS",
  "PRIME CONTRACT NO.",
  "SUBCONTRACT NO.",
  "SUBCONTRACT TYPE",
  "RELEASE DATA TO PRIME",
  "POP START",
  "POP END",
  "SUBCONTRACT VALUE",
];

const isSupplCHeaderLine = (line) => {
  const upper = line.toUpperCase().trim();
  if (!upper) return true;
  if (
    upper.includes("PRIME CONTRACT") ||
    upper.includes("SUBCONTRACT NO") ||
    upper.includes("SUBCONTRACT NUMBER") ||
    upper.includes("SUBCONTRACT TYPE") ||
    upper.includes("RELEASE") ||
    upper.includes("PERIOD OF") ||
    upper.includes("SUBCONTRACT VALUE") ||
    upper.includes("SUPPLEMENTAL C") ||
    upper.includes("ICE (VERSION") ||
    upper.includes("ICE MANUAL") ||
    upper.includes("FISCAL YEAR END") ||
    upper.includes("THIS SCHEDULE DOES NOT")
  ) {
    return true;
  }
  return false;
};

const splitPopString = (popStr) => {
  if (!popStr) return { start: "", end: "" };
  const str = String(popStr).trim();
  if (str.toLowerCase().includes(" to ")) {
    const parts = str.split(/ to /i);
    return { start: parts[0]?.trim() || "", end: parts[1]?.trim() || "" };
  }
  if (str.includes("–")) {
    const parts = str.split("–");
    return { start: parts[0]?.trim() || "", end: parts[1]?.trim() || "" };
  }
  if (str.includes("-")) {
    const parts = str.split("-");
    if (parts.length === 2) {
      return { start: parts[0]?.trim() || "", end: parts[1]?.trim() || "" };
    }
    if (parts.length === 6) {
      return {
        start: `${parts[0]}-${parts[1]}-${parts[2]}`.trim(),
        end: `${parts[3]}-${parts[4]}-${parts[5]}`.trim(),
      };
    }
  }
  return { start: str, end: "" };
};

const parseSupplCClipboardLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed || isSupplCHeaderLine(trimmed)) return null;

  const rawCols = line.split("\t").map((c) => c.trim());
  if (rawCols.length === 0 || rawCols.every((c) => !c)) return null;

  let primeName = "";
  let primeNo = "";
  let subcNo = "";
  let subcType = "";
  let release = "";
  let popStart = "";
  let popEnd = "";
  let amt = "";

  const isYesNo = (val) => {
    if (!val) return false;
    const v = String(val).toLowerCase().trim();
    return ["yes", "no", "y", "n", "true", "false", "1", "0"].includes(v);
  };

  const isDateLike = (val) => {
    if (!val) return false;
    const v = String(val).trim();
    return (
      /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/.test(v) ||
      v.toLowerCase().includes("to") ||
      (v.includes("-") && /\d/.test(v))
    );
  };

  if (
    rawCols.length >= 8 &&
    (!rawCols[4] || isYesNo(rawCols[5])) &&
    (isYesNo(rawCols[5]) || isDateLike(rawCols[6]))
  ) {
    primeName = rawCols[0] || "";
    primeNo = rawCols[1] || "";
    subcNo = rawCols[2] || "";
    subcType = rawCols[3] || "";
    release = rawCols[5] || "";
    const pop = splitPopString(rawCols[6] || "");
    popStart = pop.start;
    popEnd = pop.end;
    amt = rawCols[7] || "";
  } else if (
    rawCols.length >= 8 &&
    (isDateLike(rawCols[5]) || isDateLike(rawCols[6]))
  ) {
    primeName = rawCols[0] || "";
    primeNo = rawCols[1] || "";
    subcNo = rawCols[2] || "";
    subcType = rawCols[3] || "";
    release = rawCols[4] || "";
    popStart = rawCols[5] || "";
    popEnd = rawCols[6] || "";
    amt = rawCols[7] || "";
  } else if (rawCols.length >= 7) {
    primeName = rawCols[0] || "";
    primeNo = rawCols[1] || "";
    subcNo = rawCols[2] || "";
    subcType = rawCols[3] || "";
    release = rawCols[4] || "";
    const pop = splitPopString(rawCols[5] || "");
    popStart = pop.start;
    popEnd = pop.end;
    amt = rawCols[6] || "";
  } else if (rawCols.length >= 6) {
    primeName = rawCols[0] || "";
    primeNo = rawCols[1] || "";
    subcNo = rawCols[2] || "";
    subcType = rawCols[3] || "";
    release = rawCols[4] || "";
    amt = rawCols[5] || "";
  } else {
    primeName = rawCols[0] || "";
    primeNo = rawCols[1] || "";
    subcNo = rawCols[2] || "";
    subcType = rawCols[3] || "";
    if (rawCols[4]) amt = rawCols[4];
  }

  let formattedRelease = release;
  if (isYesNo(release)) {
    formattedRelease = ["yes", "y", "true", "1"].includes(release.toLowerCase())
      ? "Yes"
      : "No";
  }

  return {
    1: primeName,
    2: primeNo,
    3: subcNo,
    4: subcType,
    6: formattedRelease,
    7: {
      start: popStart ? formatDateToString(popStart) || popStart : "",
      end: popEnd ? formatDateToString(popEnd) || popEnd : "",
    },
    8: amt ? formatThousandSeparator(amt) : "",
  };
};

const getInitialRow = () => ({
  1: "",
  2: "",
  3: "",
  4: "",
  6: "",
  7: { start: "", end: "" },
  8: "",
});

const getInitialSupplCData = () => [getInitialRow()];

const borderCss = (side) => {
  if (!side || !side.style) return "none";
  const styles = {
    thin: "1px solid",
    medium: "2px solid",
    thick: "3px solid",
    double: "3px double",
    hair: "1px solid",
    dotted: "1px dotted",
    dashed: "1px dashed",
  };
  return `${styles[side.style] || "1px solid"} ${side.color || "#000000"}`;
};

const alignMap = {
  general: "left",
  left: "left",
  center: "center",
  right: "right",
  justify: "justify",
  fill: "left",
};

const getCellStyle = (cell) => ({
  background: cell.fill || "transparent",
  color: cell.fontColor || "#000",
  fontFamily: cell.fontName || "Arial",
  fontSize: `${cell.fontSize || 10}px`,
  fontWeight: cell.bold ? 700 : 400,
  fontStyle: cell.italic ? "italic" : "normal",
  textDecoration: cell.underline ? "underline" : "none",
  textAlign: alignMap[cell.hAlign] || "left",
  justifyContent:
    cell.hAlign === "center"
      ? "center"
      : cell.hAlign === "right"
        ? "flex-end"
        : "flex-start",
  verticalAlign:
    cell.vAlign === "center"
      ? "middle"
      : cell.vAlign === "top"
        ? "top"
        : "bottom",
  whiteSpace: cell.wrap ? "normal" : "nowrap",
  overflow: "hidden",
  paddingLeft: `${4 + (cell.indent || 0) * 6}px`,
  paddingRight: "4px",
  boxSizing: "border-box",
  borderLeft: borderCss(cell.border?.left),
  borderRight: borderCss(cell.border?.right),
  borderTop: borderCss(cell.border?.top),
  borderBottom: borderCss(cell.border?.bottom),
  lineHeight: 1.05,
});

const getCellTextAlign = (col) => {
  switch (col) {
    case 1:
      return "left";
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
      return "center";
    case 8:
      return "left";
    default:
      return "left";
  }
};

export default function SupplC({ year }) {
  const SHEET = {
    rows: 28,
    cols: 9,
    widths: [484.0, 256.0, 193.6, 88.0, 14.4, 160.8, 198.4, 130.4, 80.0],
    heights: [
      20.0, 20.0, 20.0, 20.0, 19.2, 19.2, 19.2, 20.0, 20.0, 20.0, 35.2, 35.2,
      20.0, 35.2, 20.0, 35.2, 20.0, 35.2, 20.0, 35.2, 20.0, 20.0, 20.0, 35.2,
      35.2, 20.0, 20.0, 19.2,
    ],
    cells: [
      {
        r: 1,
        c: 1,
        text: "This Schedule does not contain any",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 1,
        c: 2,
        text: "IDENTIFICATION OF PRIME CONTRACTS UNDER",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 1,
        c: 8,
        text: "SUPPLEMENTAL C",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Times New Roman",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 1,
        c: 9,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Times New Roman",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 2,
        c: 1,
        text: " links to other schedules.",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 2,
        c: 2,
        text: "WHICH THE CONTRACTOR PERFROMS AS A SUBCONTRACTOR",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 2,
        c: 8,
        text: " ICE (version 2.0.1h)",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Times New Roman",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 3,
        c: 1,
        text: "ICE MANUAL",
        fill: null,
        fontColor: "#0000FF",
        bold: false,
        italic: false,
        underline: true,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "left",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 3,
        c: 2,
        text: `Fiscal Year End - 12/31/${year}`,
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 4,
        c: 1,
        text: "",
        fill: null,
        fontColor: "#0000FF",
        bold: false,
        italic: false,
        underline: true,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "left",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 1,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 2,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 3,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 4,
        text: " ",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 5,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 7,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 8,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 5,
        c: 9,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 1,
        text: "Prime contractor  Name",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 2,
        text: "Prime Contract No.",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 3,
        text: "Subcontract",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 4,
        text: "Subcontract",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 5,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 6,
        text: "Release Subcontractor ",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 7,
        text: "Subcontract Period of",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 8,
        text: "Subcontract",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "left",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 6,
        c: 9,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 1,
        text: "and Full Address",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 2,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 3,
        text: "Number",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 4,
        text: "Type",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 5,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 6,
        text: "Data To Prime",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 7,
        text: "      Performance",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 8,
        text: "Value",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "left",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 7,
        c: 9,
        text: "",
        fill: null,
        fontColor: null,
        bold: true,
        italic: false,
        underline: false,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 8,
        c: 6,
        text: "Yes/No",
        fill: null,
        fontColor: null,
        bold: true,
        italic: true,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 9,
        c: 1,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 9,
        c: 2,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 9,
        c: 3,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 9,
        c: 4,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 9,
        c: 5,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "center",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 9,
        c: 6,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 9,
        c: 7,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 9,
        c: 8,
        text: "",
        fill: "#C0C0C0",
        fontColor: null,
        bold: false,
        italic: false,
        underline: false,
        fontSize: 10.0,
        fontName: "Arial",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "thin", color: null },
          bottom: { style: "thin", color: null },
        },
      },
      {
        r: 28,
        c: 1,
        text: "",
        fill: null,
        fontColor: null,
        bold: false,
        italic: false,
        underline: true,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 28,
        c: 2,
        text: "",
        fill: null,
        fontColor: null,
        bold: false,
        italic: false,
        underline: true,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 28,
        c: 3,
        text: "",
        fill: null,
        fontColor: null,
        bold: false,
        italic: false,
        underline: true,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
      {
        r: 28,
        c: 4,
        text: "",
        fill: null,
        fontColor: null,
        bold: false,
        italic: false,
        underline: true,
        fontSize: 11.0,
        fontName: "Calibri",
        hAlign: "general",
        vAlign: "bottom",
        wrap: false,
        indent: 0,
        border: {
          left: { style: "", color: null },
          right: { style: "", color: null },
          top: { style: "", color: null },
          bottom: { style: "", color: null },
        },
      },
    ],
    merges: [
      [3, 2, 3, 7],
      [2, 2, 2, 7],
      [1, 2, 1, 7],
    ],
  };

  const [rows, setRows] = useState(getInitialSupplCData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fiscalYearEnd, setFiscalYearEnd] = useState(`${year}-12-31`);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getSelectedYear = useCallback(() => {
    const d = parseDate(fiscalYearEnd);
    return d ? d.getFullYear() : year;
  }, [fiscalYearEnd]);

  const fetchSupplCData = useCallback(async () => {
    const year = getSelectedYear();
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/SupplC?year=${year}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const records = Array.isArray(data) ? data : data ? [data] : [];
        if (records.length > 0) {
          const mappedRows = records.map((item) => {
            const primeName =
              item.primeCntrNameAddr ?? item.PrimeCntrNameAddr ?? "";
            const primeNo = item.primeCntrNo ?? item.PrimeCntrNo ?? "";
            const subcNo = item.subcNo ?? item.SubcNo ?? "";
            const subcType = item.subcType ?? item.SubcType ?? "";
            const releaseVal =
              item.subcToPrime !== undefined
                ? item.subcToPrime
                : item.SubcToPrime;
            const startDtRaw = item.subcPopStartDt ?? item.SubcPopStartDt;
            const endDtRaw = item.subcPopEndDt ?? item.SubcPopEndDt;
            const amtRaw =
              item.subcAmt !== undefined ? item.subcAmt : item.SubcAmt;

            const startDt = startDtRaw
              ? formatDateToString(parseDate(startDtRaw))
              : "";
            const endDt = endDtRaw
              ? formatDateToString(parseDate(endDtRaw))
              : "";

            let releaseText = "";
            if (
              releaseVal === true ||
              String(releaseVal).toLowerCase() === "true" ||
              String(releaseVal) === "1"
            ) {
              releaseText = "Yes";
            } else if (
              releaseVal === false ||
              String(releaseVal).toLowerCase() === "false" ||
              String(releaseVal) === "0"
            ) {
              releaseText = "No";
            } else if (typeof releaseVal === "string" && releaseVal.trim()) {
              releaseText = releaseVal.trim();
            }

            return {
              1: primeName,
              2: primeNo,
              3: subcNo,
              4: subcType,
              6: releaseText,
              7: { start: startDt, end: endDt },
              8: amtRaw != null ? formatThousandSeparator(amtRaw) : "",
            };
          });

          setRows(mappedRows.length > 0 ? mappedRows : [getInitialRow()]);
        } else {
          setRows([getInitialRow()]);
        }
      } else {
        setRows([getInitialRow()]);
      }
    } catch (err) {
      console.error("Error fetching Suppl C data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getSelectedYear]);

  useEffect(() => {
    fetchSupplCData();
  }, [fetchSupplCData]);

  const markUnsaved = () => setSaved(false);

  const updateRow = (index, column, value) => {
    setRows((current) => {
      const nextRows = current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [column]: value } : row,
      );
      return nextRows;
    });
    markUnsaved();
  };

  const updatePopDate = (index, field, value) => {
    let sanitizedValue = value;
    if (typeof value === "string") {
      sanitizedValue = value.replace(/[^0-9/-]/g, "");
    }
    setRows((current) => {
      const nextRows = current.map((row, rowIndex) => {
        if (rowIndex === index) {
          const currentPop =
            typeof row[7] === "object" && row[7] !== null
              ? row[7]
              : { start: "", end: "" };
          return {
            ...row,
            7: { ...currentPop, [field]: sanitizedValue },
          };
        }
        return row;
      });
      return nextRows;
    });
    markUnsaved();
  };

  const addRow = () => {
    setRows((current) => [...current, getInitialRow()]);
    markUnsaved();
  };

  const handleCopy = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to copy.");
      return;
    }

    const selectedData = selectedRows.map((idx) => rows[idx]).filter(Boolean);

    if (selectedData.length === 0) return;

    const headerLine = SUPPLC_COPY_HEADERS.join("\t");
    const dataLines = selectedData.map((r) => {
      const popStart =
        typeof r[7] === "object" && r[7] !== null ? r[7].start || "" : "";
      const popEnd =
        typeof r[7] === "object" && r[7] !== null ? r[7].end || "" : "";
      return [
        (r[1] || "").toString().replace(/\t/g, " "),
        (r[2] || "").toString().replace(/\t/g, " "),
        (r[3] || "").toString().replace(/\t/g, " "),
        (r[4] || "").toString().replace(/\t/g, " "),
        (r[6] || "").toString().replace(/\t/g, " "),
        popStart.replace(/\t/g, " "),
        popEnd.replace(/\t/g, " "),
        (r[8] || "").toString().replace(/\t/g, " "),
      ].join("\t");
    });

    const tsvString = [headerLine, ...dataLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvString);
      toast.success(`${selectedData.length} row(s) copied.`);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = tsvString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success(`${selectedData.length} row(s) copied.`);
    }
  };

  const handlePaste = async (clipboardText = null) => {
    let text = clipboardText;
    if (!text || typeof text !== "string") {
      try {
        text = await navigator.clipboard.readText();
      } catch (err) {
        toast.warning(
          "Clipboard access unavailable. Please use Ctrl + V to paste.",
        );
        return;
      }
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      toast.warning("Clipboard is empty.");
      return;
    }

    const rawLines = text.split(/\r\n|\n|\r/);
    const parsedRows = [];

    rawLines.forEach((line) => {
      const parsed = parseSupplCClipboardLine(line);
      if (parsed) {
        parsedRows.push(parsed);
      }
    });

    if (parsedRows.length === 0) {
      toast.warning("No valid data rows found to paste.");
      return;
    }

    setRows((current) => {
      const isInitialBlank =
        current.length === 1 &&
        !current[0][1] &&
        !current[0][2] &&
        !current[0][3] &&
        !current[0][4] &&
        !current[0][6] &&
        !current[0][7]?.start &&
        !current[0][7]?.end &&
        !current[0][8];

      return isInitialBlank ? [...parsedRows] : [...current, ...parsedRows];
    });

    setSelectedRows([]);
    markUnsaved();
    toast.success(`${parsedRows.length} row(s) pasted.`);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      const hasTextSelection =
        window.getSelection() && window.getSelection().toString().length > 0;

      if (!isInputFocused || !hasTextSelection) {
        if (selectedRows.length > 0) {
          e.preventDefault();
          handleCopy();
        }
      }
    }
  };

  const handlePasteEvent = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData ? clipboardData.getData("text") : "";

    if (
      pastedText &&
      (pastedText.includes("\t") || pastedText.includes("\n"))
    ) {
      e.preventDefault();
      handlePaste(pastedText);
    }
  };

  const deleteRows = async () => {
    if (!selectedRows.length) return;
    const year = getSelectedYear();
    const selected = new Set(selectedRows);

    const toDeletePayload = [];
    selectedRows.forEach((idx) => {
      const r = rows[idx];
      if (r && r[2] && r[3] && r[4]) {
        toDeletePayload.push({
          year,
          primeCntrNo: String(r[2]).trim(),
          subcNo: String(r[3]).trim(),
          subcType: String(r[4]).trim(),
        });
      }
    });

    if (toDeletePayload.length > 0) {
      try {
        const res = await fetch(`${BASE_URL}/api/SupplC/bulk-delete`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(toDeletePayload),
        });
        if (res.ok) {
          toast.success("Selected row(s) deleted successfully.");
        }
      } catch (err) {
        console.error("Error deleting rows:", err);
      }
    }

    setRows((current) => {
      const remaining = current.filter((_, index) => !selected.has(index));
      return remaining.length > 0 ? remaining : [getInitialRow()];
    });
    setSelectedRows([]);
    markUnsaved();
  };

  const clearRows = async () => {
    if (selectedRows.length > 0) {
      const selected = new Set(selectedRows);
      setRows((current) =>
        current.map((row, index) =>
          selected.has(index) ? getInitialRow() : row,
        ),
      );
      setSelectedRows([]);
      markUnsaved();
      toast.info("Selected row(s) cleared.");
    } else {
      await fetchSupplCData();
      setSelectedRows([]);
      setSaved(false);
      toast.info("All unsaved changes cleared.");
    }
  };

  const savePage = async () => {
    const year = getSelectedYear();

    const usedKeys = new Set();
    const payload = [];

    rows.forEach((r, idx) => {
      const primeName = (r[1] || "").toString().trim();
      let primeNo = (r[2] || "").toString().trim();
      let subcNo = (r[3] || "").toString().trim();
      let subcType = (r[4] || "").toString().trim();
      const releaseVal = (r[6] || "").toString().trim().toLowerCase();
      const popVal = r[7];
      const amtVal = r[8];

      const hasPop =
        typeof popVal === "object" && popVal !== null
          ? Boolean(popVal.start || popVal.end)
          : Boolean(popVal);

      const hasAnyData =
        primeName ||
        primeNo ||
        subcNo ||
        subcType ||
        releaseVal ||
        hasPop ||
        (amtVal !== "" && amtVal !== undefined && amtVal !== null);
      if (!hasAnyData) return;

      if (!primeNo) primeNo = `PRM-${idx + 1}`;
      if (!subcNo) subcNo = `SUB-${idx + 1}`;
      if (!subcType) subcType = "FFP";

      let key = `${primeNo}_${subcNo}_${subcType}`;
      if (usedKeys.has(key)) {
        subcNo = `${subcNo}-${idx + 1}`;
        key = `${primeNo}_${subcNo}_${subcType}`;
      }
      usedKeys.add(key);

      let subcToPrime = null;
      if (["yes", "y", "true", "1"].includes(releaseVal)) subcToPrime = true;
      else if (["no", "n", "false", "0"].includes(releaseVal))
        subcToPrime = false;

      let subcPopStartDt = null;
      let subcPopEndDt = null;
      if (popVal) {
        if (typeof popVal === "object") {
          subcPopStartDt = popVal.start ? formatDateToISO(popVal.start) : null;
          subcPopEndDt = popVal.end ? formatDateToISO(popVal.end) : null;
        } else if (typeof popVal === "string") {
          const { start, end } = splitPopString(popVal);
          subcPopStartDt = start ? formatDateToISO(start) : null;
          subcPopEndDt = end ? formatDateToISO(end) : null;
        }
      }

      payload.push({
        year,
        primeCntrNameAddr: primeName || null,
        primeCntrNo: primeNo,
        subcNo: subcNo,
        subcType: subcType,
        subcToPrime: subcToPrime,
        subcPopStartDt: subcPopStartDt,
        subcPopEndDt: subcPopEndDt,
        subcAmt: parseNumeric(amtVal),
      });
    });

    if (payload.length === 0) {
      toast.info("Please fill in data for at least one row before saving.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/SupplC/bulk-upsert`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Supplemental C records saved successfully!");
        setSaved(true);
        setSelectedRows([]);
        window.setTimeout(() => setSaved(false), 2000);
        localStorage.setItem(
          SUPPLC_STORAGE_KEY,
          JSON.stringify({ rows, fiscalYearEnd }),
        );
        await fetchSupplCData();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to save Supplemental C.");
      }
    } catch (err) {
      console.error("Error saving Suppl C:", err);
      toast.error("Network error while saving Supplemental C.");
    }
  };

  const cellMap = useMemo(() => {
    const map = new Map();
    SHEET.cells.forEach((cell) => map.set(`${cell.r}:${cell.c}`, cell));
    return map;
  }, []);

  const mergeMap = useMemo(() => {
    const map = new Map();
    SHEET.merges.forEach(([minRow, minCol, maxRow, maxCol]) => {
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          if (r === minRow && c === minCol) {
            map.set(`${r}:${c}`, {
              master: true,
              rowSpan: maxRow - minRow + 1,
              colSpan: maxCol - minCol + 1,
            });
          } else {
            map.set(`${r}:${c}`, { master: false });
          }
        }
      }
    });
    return map;
  }, []);

  const getDataCellValue = (rowIndex, column, fallback) => {
    if (rowIndex < SUPPLC_DATA_START_ROW || column === 5 || column === 9)
      return fallback;
    const dataIndex = rowIndex - SUPPLC_DATA_START_ROW;
    const val = rows[dataIndex]?.[column];
    return val !== undefined ? val : fallback;
  };

  const isDataRow = (rowIndex) =>
    rowIndex >= SUPPLC_DATA_START_ROW &&
    rowIndex < SUPPLC_DATA_START_ROW + rows.length;
  const displayRowCount = Math.max(10 + rows.length + 1, 12);
  const displayHeights = Array.from({ length: displayRowCount }, (_, index) => {
    const rowNumber = index + 1;
    if (
      rowNumber >= SUPPLC_DATA_START_ROW &&
      rowNumber < SUPPLC_DATA_START_ROW + rows.length
    ) {
      return 35.2;
    }
    return SHEET.heights[index] || 20;
  });

  return (
    <div
      className="min-h-screen bg-[#e5e5e5] p-3 font-sans print:p-0 print:bg-white"
      onKeyDown={handleKeyDown}
      onPaste={handlePasteEvent}
    >
      {/* Top Toolbar */}
      <div className="w-full max-w-[1500px] h-[34px] mx-auto mb-2 px-2.5 flex items-center justify-between border border-[#aaa] bg-[#f7f7f7] text-[#333] text-xs font-bold print:hidden">
        <div className="text-xs font-bold">SUPPLEMENTAL C</div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="border-0 rounded-full min-w-[68px] h-[28px] px-3 font-bold text-[10px] text-white bg-[#0c465b] cursor-pointer hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={addRow}
          >
            New
          </button>
          <button
            type="button"
            className="border-0 rounded-full min-w-[68px] h-[28px] px-3 font-bold text-[10px] text-white bg-[#0c465b] cursor-pointer hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={handleCopy}
            disabled={selectedRows.length === 0}
          >
            Copy
          </button>
          <button
            type="button"
            className="border-0 rounded-full min-w-[68px] h-[28px] px-3 font-bold text-[10px] text-white bg-[#0c465b] cursor-pointer hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={() => handlePaste()}
            disabled={selectedRows.length === 0}
          >
            Paste
          </button>
          <button
            type="button"
            className="border-0 rounded-full min-w-[68px] h-[28px] px-3 font-bold text-[10px] text-white bg-[#f39a9d] cursor-pointer hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={deleteRows}
            disabled={selectedRows.length === 0}
          >
            Delete
          </button>
          <button
            type="button"
            className="border-0 rounded-full min-w-[68px] h-[28px] px-3 font-bold text-[10px] text-white bg-[#0c465b] cursor-pointer hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={clearRows}
          >
            Clear
          </button>
          <button
            type="button"
            className="border-0 rounded-full min-w-[68px] h-[28px] px-3 font-bold text-[10px] text-white bg-[#0c465b] cursor-pointer hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={savePage}
          >
            Save
          </button>
          {saved && (
            <span className="text-[11px] text-[#24734a] ml-1">Saved</span>
          )}
        </div>
      </div>

      {/* Spreadsheet Canvas Container */}
      <div className="w-full max-w-[1500px] mx-auto overflow-auto bg-white border border-[#999] shadow-[0_2px_8px_rgba(0,0,0,0.12)] print:max-w-none print:overflow-visible print:border-0 print:shadow-none">
        <div
          className="grid w-max min-w-full bg-white"
          style={{
            gridTemplateColumns: SHEET.widths.map((w) => `${w}px`).join(" "),
            gridTemplateRows: displayHeights.map((h) => `${h}px`).join(" "),
          }}
        >
          {Array.from({ length: displayRowCount }, (_, rowIndex) => {
            const r = rowIndex + 1;

            return Array.from({ length: SHEET.cols }, (_, colIndex) => {
              const c = colIndex + 1;
              const key = `${r}:${c}`;
              const merge = mergeMap.get(key);

              if (merge && !merge.master) return null;

              const cell = cellMap.get(key) || {
                r,
                c,
                text: "",
                fill: null,
                fontColor: "#000",
                bold: false,
                italic: false,
                underline: false,
                fontSize: 10,
                fontName: "Arial",
                hAlign: "general",
                vAlign: "bottom",
                wrap: false,
                indent: 0,
                border: {},
              };

              return (
                <div
                  key={key}
                  className="min-w-0 min-h-0 flex items-center overflow-hidden select-text cursor-default"
                  style={{
                    gridRow: `${r} / span ${merge?.rowSpan || 1}`,
                    gridColumn: `${c} / span ${merge?.colSpan || 1}`,
                    ...getCellStyle(cell),
                  }}
                >
                  {r === 3 && c === 2 ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="inline-flex items-center justify-center">
                        <span className="whitespace-nowrap mr-1">
                          Fiscal Year End -
                        </span>
                        <DatePicker
                          selected={parseDate(fiscalYearEnd)}
                          onChange={(date) => {
                            const nextDate = date
                              ? formatDateToString(date)
                              : "";
                            setFiscalYearEnd(nextDate);
                            try {
                              localStorage.setItem(
                                SUPPLC_STORAGE_KEY,
                                JSON.stringify({
                                  rows,
                                  fiscalYearEnd: nextDate,
                                }),
                              );
                            } catch (error) {
                              console.error(
                                "Failed to persist Suppl C fiscal year end:",
                                error,
                              );
                            }
                            markUnsaved();
                          }}
                          onChangeRaw={(e) => {
                            if (e?.target?.value !== undefined) {
                              const clean = e.target.value.replace(
                                /[^0-9/-]/g,
                                "",
                              );
                              setFiscalYearEnd(clean);
                              markUnsaved();
                            }
                          }}
                          onKeyDown={handleDateKeyDown}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="w-[76px] h-[20px] border-0 outline-none bg-transparent color-inherit font-inherit text-inherit font-inherit text-left cursor-pointer p-0 hover:underline"
                          popperPlacement="bottom-start"
                        />
                      </div>
                    </div>
                  ) : isDataRow(r) && SUPPLC_EDITABLE_COLUMNS.includes(c) ? (
                    c === 7 ? (
                      <div
                        className="w-full h-full flex items-center justify-center gap-0.5"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedRows((current) =>
                            current.includes(r - SUPPLC_DATA_START_ROW)
                              ? current
                              : [...current, r - SUPPLC_DATA_START_ROW],
                          );
                        }}
                      >
                        <DatePicker
                          selected={parseDate(
                            rows[r - SUPPLC_DATA_START_ROW]?.[7]?.start,
                          )}
                          onChange={(date) =>
                            updatePopDate(
                              r - SUPPLC_DATA_START_ROW,
                              "start",
                              date ? formatDateToString(date) : "",
                            )
                          }
                          onChangeRaw={(e) => {
                            if (e?.target?.value !== undefined) {
                              const clean = e.target.value.replace(
                                /[^0-9/-]/g,
                                "",
                              );
                              updatePopDate(
                                r - SUPPLC_DATA_START_ROW,
                                "start",
                                clean,
                              );
                            }
                          }}
                          onKeyDown={handleDateKeyDown}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="w-full h-[24px] border border-[#c0c7d0] rounded-[2px] bg-white font-sans text-[11px] px-1 py-[1px] text-[#333] outline-none text-center focus:border-[#0c465b] focus:ring-1 focus:ring-[#0c465b]"
                          popperPlacement="bottom-start"
                        />
                        <span className="text-[11px] font-bold text-[#555] select-none px-[1px]">
                          –
                        </span>
                        <DatePicker
                          selected={parseDate(
                            rows[r - SUPPLC_DATA_START_ROW]?.[7]?.end,
                          )}
                          onChange={(date) =>
                            updatePopDate(
                              r - SUPPLC_DATA_START_ROW,
                              "end",
                              date ? formatDateToString(date) : "",
                            )
                          }
                          onChangeRaw={(e) => {
                            if (e?.target?.value !== undefined) {
                              const clean = e.target.value.replace(
                                /[^0-9/-]/g,
                                "",
                              );
                              updatePopDate(
                                r - SUPPLC_DATA_START_ROW,
                                "end",
                                clean,
                              );
                            }
                          }}
                          onKeyDown={handleDateKeyDown}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="w-full h-[24px] border border-[#c0c7d0] rounded-[2px] bg-white font-sans text-[11px] px-1 py-[1px] text-[#333] outline-none text-center focus:border-[#0c465b] focus:ring-1 focus:ring-[#0c465b]"
                          popperPlacement="bottom-start"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        {c === 1 && (
                          <input
                            type="checkbox"
                            className="absolute left-1 top-1/2 -translate-y-1/2 w-[13px] h-[13px] m-0 p-0 cursor-pointer z-10"
                            checked={selectedRows.includes(
                              r - SUPPLC_DATA_START_ROW,
                            )}
                            onChange={(event) => {
                              event.stopPropagation();
                              const rowIndex = r - SUPPLC_DATA_START_ROW;
                              setSelectedRows((current) =>
                                event.target.checked
                                  ? current.includes(rowIndex)
                                    ? current
                                    : [...current, rowIndex]
                                  : current.filter(
                                      (index) => index !== rowIndex,
                                    ),
                              );
                            }}
                            onClick={(event) => event.stopPropagation()}
                            aria-label={`Select Suppl C row ${r}`}
                          />
                        )}
                        <input
                          type="text"
                          className={`w-full h-full min-w-0 border-0 outline-none bg-transparent color-inherit font-inherit px-1 focus:outline-1 focus:outline-[#8bb8d0] focus:-outline-offset-1 ${
                            c === 1 ? "pl-[21px]" : ""
                          }`}
                          value={getDataCellValue(r, c, cell.text)}
                          onChange={(event) =>
                            updateRow(
                              r - SUPPLC_DATA_START_ROW,
                              c,
                              event.target.value,
                            )
                          }
                          onBlur={(event) => {
                            if (c === 8) {
                              const formatted = formatThousandSeparator(
                                event.target.value,
                              );
                              updateRow(
                                r - SUPPLC_DATA_START_ROW,
                                c,
                                formatted,
                              );
                            }
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedRows((current) =>
                              current.includes(r - SUPPLC_DATA_START_ROW)
                                ? current
                                : [...current, r - SUPPLC_DATA_START_ROW],
                            );
                          }}
                          style={{
                            textAlign: getCellTextAlign(c),
                          }}
                          aria-label={`Suppl C row ${r} column ${c}`}
                        />
                      </div>
                    )
                  ) : (
                    cell.text
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* Legend Box */}
      <div className="w-full max-w-[1500px] mx-auto mt-2 flex gap-[22px] items-center p-[6px_9px] border border-[#b7b7b7] bg-white text-[#333] text-[10px] print:max-w-none print:border-0" />
    </div>
  );
}
