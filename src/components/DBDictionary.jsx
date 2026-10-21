// import React, { useState } from 'react';

// const SchemaBrowser = () => {
//   const data = {
//     "tables": [
//       {
//         "tableName": "account",
//         "rowCount": 1476,
//         "columns": [
//           { "columnName": "acct_id", "columnType": "character varying(30)", "isNullable": false },
//           { "columnName": "acct_name", "columnType": "character varying(100)", "isNullable": false },
//           { "columnName": "active_flag", "columnType": "character varying(1)", "isNullable": true },
//           { "columnName": "created_at", "columnType": "timestamp with time zone", "isNullable": true },
//           { "columnName": "lvl_no", "columnType": "integer", "isNullable": false },
//           { "columnName": "modified_at", "columnType": "timestamp with time zone", "isNullable": true }
//         ]
//       },
//       {
//         "tableName": "account_group_setup",
//         "rowCount": 853,
//         "columns": [
//           { "columnName": "acct_grp_cd", "columnType": "character varying(50)", "isNullable": false },
//           { "columnName": "acct_id", "columnType": "character varying(50)", "isNullable": false },
//           { "columnName": "active_fl", "columnType": "boolean", "isNullable": false },
//           { "columnName": "time_stamp", "columnType": "timestamp with time zone", "isNullable": false, "defaultValue": "CURRENT_TIMESTAMP" }
//         ]
//       }
//     ]
//   };

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedTable, setSelectedTable] = useState(data.tables[0]);

//   // Filter tables based on search input
//   const filteredTables = data.tables.filter(table =>
//     table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

//       {/* LEFT SIDEBAR */}
//       <div className="w-64 flex flex-col border-r border-gray-300 bg-white">
//         <div className="p-4 border-b border-gray-300 bg-neutral-100">
//           <label className="input-label mb-2 block">Search Tables</label>
//           <input
//             type="text"
//             placeholder="Filter tables..."
//             className="input-style !w-full" // Force full width for sidebar
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="flex-1 overflow-y-auto middle-scrollbar p-2 space-y-1">
//           {filteredTables.map((table) => (
//             <button
//               key={table.tableName}
//               onClick={() => setSelectedTable(table)}
//               className={`btn w-full text-left truncate block ${
//                 selectedTable.tableName === table.tableName ? 'btn-active' : 'btn-inactive'
//               }`}
//             >
//               {table.tableName}
//             </button>
//           ))}
//           {filteredTables.length === 0 && (
//             <p className="text-xs text-gray-500 p-2 italic">No tables found...</p>
//           )}
//         </div>
//       </div>

//       {/* RIGHT DETAIL SECTION */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Detail Header */}
//         <div className="p-4 bg-white border-b border-gray-300 flex justify-between items-center shadow-sm">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900 capitalize italic">
//               {selectedTable.tableName}
//             </h2>
//             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
//               Schema Information
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-xs font-semibold text-gray-600 underline">Row Count:</span>
//             <span className="btn-blue px-3 py-1 rounded text-xs font-mono">
//               {selectedTable.rowCount.toLocaleString()}
//             </span>
//           </div>
//         </div>

//         {/* Column Table */}
//         <div className="flex-1 p-4 overflow-hidden">
//           <div className="border-line bg-white h-full flex flex-col overflow-hidden">
//             <div className="overflow-auto right-scrollbar">
//               <table className="table w-full">
//                 <thead className="thead">
//                   <tr>
//                     <th className="th-thead">Column Name</th>
//                     <th className="th-thead">Data Type</th>
//                     <th className="th-thead">Nullable</th>
//                     <th className="th-thead">Default</th>
//                   </tr>
//                 </thead>
//                 <tbody className="tbody">
//                   {selectedTable.columns.map((col, idx) => (
//                     <tr key={idx} className="hover:bg-blue-50/30">
//                       <td className="tbody-td font-medium text-left px-4 !text-blue-800">
//                         {col.columnName}
//                       </td>
//                       <td className="tbody-td text-gray-600">{col.columnType}</td>
//                       <td className="tbody-td">
//                         {!col.isNullable ? (
//                           <span className="text-red-600 font-bold text-[10px] border border-red-200 bg-red-50 px-1 rounded">
//                             NOT NULL
//                           </span>
//                         ) : (
//                           <span className="text-gray-400">null</span>
//                         )}
//                       </td>
//                       <td className="tbody-td text-gray-500 font-mono italic">
//                         {col.defaultValue || '-'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchemaBrowser;

import React, { useState, useEffect, useMemo } from "react";
import { backendUrl } from "./config";

const DBDictionary = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendUrl}/api/ForecastReport/GetDbInfoV1`,
        );
        if (!response.ok) throw new Error("Failed to fetch table data");

        const data = await response.json();
        const rawTables = data.tables || [];

        // --- DISTINCT LOGIC ---
        const uniqueTablesMap = new Map();
        rawTables.forEach((table) => {
          if (!uniqueTablesMap.has(table.tableName)) {
            uniqueTablesMap.set(table.tableName, table);
          }
        });

        const distinctTables = Array.from(uniqueTablesMap.values());
        setTables(distinctTables);

        if (distinctTables.length > 0) {
          setSelectedTable(distinctTables[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTables = useMemo(() => {
    return tables.filter((table) =>
      table.tableName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [tables, searchTerm]);

  // Helper to check if a column is a Foreign Key
  const getFKInfo = (colName) => {
    return selectedTable?.foreignKeys?.find((fk) =>
      fk.columns.includes(colName),
    );
  };

  if (loading)
    return (
      <div className="p-10 text-center font-semibold text-gray-500">
        Loading Database Schema...
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Error: {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <div className="w-72 flex flex-col border-r border-gray-300 bg-white">
        <div className="p-4 border-b border-gray-300 bg-neutral-100">
          <label className="input-label mb-2 block">Search Tables</label>
          <input
            type="text"
            placeholder="Search..."
            className="input-style !w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto middle-scrollbar p-2 space-y-1">
          {filteredTables.map((table) => (
            <button
              key={table.tableName}
              onClick={() => setSelectedTable(table)}
              className={`btn w-full text-left truncate block ${
                selectedTable?.tableName === table.tableName
                  ? "btn-active"
                  : "btn-inactive"
              }`}
            >
              {table.tableName}
            </button>
          ))}
        </div>
      </div>

      {/* DETAIL CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {selectedTable ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-300 flex justify-between items-center shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 italic uppercase">
                  {selectedTable.tableName}
                </h2>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                    PK: {selectedTable.primaryKeys?.join(", ") || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 underline">
                  Row Count:
                </span>
                <span className="btn-blue px-3 py-1 rounded text-xs font-mono">
                  {selectedTable.rowCount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 p-4 overflow-hidden bg-gray-50/50">
              <div className="border-line bg-white h-full flex flex-col overflow-hidden">
                <div className="overflow-auto right-scrollbar">
                  <table className="table w-full">
                    <thead className="thead sticky top-0 z-10">
                      <tr>
                        <th className="th-thead">Column Name</th>
                        <th className="th-thead">Type</th>
                        <th className="th-thead">Constraints</th>
                        <th className="th-thead">Relationships</th>
                        <th className="th-thead">Default</th>
                      </tr>
                    </thead>
                    <tbody className="tbody">
                      {selectedTable.columns?.map((col, idx) => {
                        const fk = getFKInfo(col.columnName);
                        return (
                          <tr key={idx} className="hover:bg-blue-50/30">
                            <td className="tbody-td font-bold text-left px-4 !text-blue-900">
                              <div className="flex items-center gap-2">
                                {col.isPrimaryKey && (
                                  <span title="Primary Key">🔑</span>
                                )}
                                {col.columnName}
                              </div>
                            </td>
                            <td className="tbody-td text-gray-600 font-mono text-[11px]">
                              {col.columnType}
                            </td>
                            <td className="tbody-td">
                              {!col.isNullable && (
                                <span className="text-red-600 font-bold text-[9px] border border-red-200 bg-red-50 px-1 rounded mr-1">
                                  NOT NULL
                                </span>
                              )}
                              {selectedTable.indexes?.some((idx) =>
                                idx.columns.includes(col.columnName),
                              ) && (
                                <span className="text-emerald-600 font-bold text-[9px] border border-emerald-200 bg-emerald-50 px-1 rounded">
                                  INDEXED
                                </span>
                              )}
                            </td>
                            <td className="tbody-td text-left px-2">
                              {fk ? (
                                <div className="text-[10px] leading-tight">
                                  <span className="text-orange-600 font-bold">
                                    FK →{" "}
                                  </span>
                                  <span className="text-gray-600">
                                    {fk.principalTable}({fk.principalColumns[0]}
                                    )
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="tbody-td text-gray-500 font-mono italic">
                              {col.defaultValue || "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a table to view schema details.
          </div>
        )}
      </div>
    </div>
  );
};

export default DBDictionary;
