import React, { useState, useMemo } from "react";
import {
  Save,
  Layers,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Check,
  Search,
  Zap,
  MousePointerClick,
  CheckSquare,
  Square,
  RefreshCw,
} from "lucide-react";

// Mock Data Definitions
const INITIAL_STATIC_ORGS = Array.from({ length: 300 }, (_, i) => ({
  id: `ORG-${100 + i}`,
  name: `Org ${100 + i} - ${i % 2 === 0 ? "Operations" : "Management"}`,
}));

const INITIAL_STATIC_ACCOUNTS = Array.from({ length: 500 }, (_, i) => ({
  id: `${1000 + i}`,
  name: `${1000 + i} - Account Description ${i + 1}`,
}));

const INITIAL_STATIC_POOLS = [
  { id: "POOL-Fringe", name: "Fringe Benefits Pool" },
  { id: "POOL-Overhead", name: "Overhead Pool" },
  { id: "POOL-GnA", name: "General & Administrative (G&A)" },
  { id: "POOL-Direct", name: "Direct Cost Pool" },
];

const INITIAL_STATIC_MAPPINGS = [
  { id: "1", orgId: "ORG-100", accountId: "1000", poolId: "POOL-GnA" },
  { id: "2", orgId: "ORG-101", accountId: "1001", poolId: "POOL-Direct" },
  { id: "3", orgId: "ORG-102", accountId: "1002", poolId: "POOL-Overhead" },
];

export default function OrgAccountPoolMapping() {
  const [activeTab, setActiveTab] = useState("visual");
  const [mappings, setMappings] = useState(INITIAL_STATIC_MAPPINGS);
  const [statusMsg, setStatusMsg] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Multi-delete active mappings state
  const [selectedToDelete, setSelectedToDelete] = useState([]);

  // Visual & Paste states
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedPool, setSelectedPool] = useState(INITIAL_STATIC_POOLS[0].id);
  const [orgSearch, setOrgSearch] = useState("");
  const [accountSearch, setAccountSearch] = useState("");
  const [pastedText, setPastedText] = useState("");

  // Quick lookup map: "OrgID_AccountID" -> PoolID for checking mapped state
  const activeMappingMap = useMemo(() => {
    const map = new Map();
    mappings.forEach((m) => {
      map.set(`${m.orgId}_${m.accountId}`, m.poolId);
    });
    return map;
  }, [mappings]);

  const filteredOrgs = useMemo(() => {
    if (!orgSearch.trim()) return INITIAL_STATIC_ORGS.slice(0, 50);
    const term = orgSearch.toLowerCase();
    return INITIAL_STATIC_ORGS.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.name.toLowerCase().includes(term),
    ).slice(0, 100);
  }, [orgSearch]);

  const filteredAccounts = useMemo(() => {
    if (!accountSearch.trim()) return INITIAL_STATIC_ACCOUNTS.slice(0, 50);
    const term = accountSearch.toLowerCase();
    return INITIAL_STATIC_ACCOUNTS.filter(
      (a) =>
        a.id.toLowerCase().includes(term) ||
        a.name.toLowerCase().includes(term),
    ).slice(0, 100);
  }, [accountSearch]);

  const toggleOrg = (id) => {
    setSelectedOrgs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAccount = (id) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Add / Re-map combinations
  const handleVisualBulkAdd = () => {
    setStatusMsg("");
    if (selectedOrgs.length === 0 || selectedAccounts.length === 0) {
      setStatusMsg("Select at least one Organization and one Account.");
      return;
    }

    let updatedCount = 0;
    let addedCount = 0;

    setMappings((prevMappings) => {
      const updatedList = [...prevMappings];

      selectedOrgs.forEach((orgId) => {
        selectedAccounts.forEach((acctId) => {
          const existingIndex = updatedList.findIndex(
            (m) => m.orgId === orgId && m.accountId === acctId,
          );

          if (existingIndex > -1) {
            // Update mapping if already existing
            updatedList[existingIndex] = {
              ...updatedList[existingIndex],
              poolId: selectedPool,
            };
            updatedCount++;
          } else {
            // Add new mapping if unmapped
            updatedList.unshift({
              id: `${Date.now()}_${Math.random()}`,
              orgId,
              accountId: acctId,
              poolId: selectedPool,
            });
            addedCount++;
          }
        });
      });

      return updatedList;
    });

    setStatusMsg(
      `Processed selection: ${addedCount} new mapping(s) added, ${updatedCount} existing mapping(s) re-mapped to ${selectedPool}.`,
    );
  };

  // Parse Excel / CSV paste input
  const handleParseAndImport = () => {
    setStatusMsg("");
    if (!pastedText.trim()) {
      setStatusMsg(
        "Please paste tab-separated or comma-separated mapping data.",
      );
      return;
    }

    const lines = pastedText.trim().split("\n");
    let addedCount = 0;
    let updatedCount = 0;
    let skippedLines = 0;

    setMappings((prev) => {
      const updatedList = [...prev];

      lines.forEach((line) => {
        const parts = line.includes("\t")
          ? line.split("\t").map((s) => s.trim())
          : line.split(",").map((s) => s.trim());

        const [orgId, accountId, poolId] = parts;

        if (orgId && accountId && poolId) {
          const existingIndex = updatedList.findIndex(
            (m) => m.orgId === orgId && m.accountId === accountId,
          );

          if (existingIndex > -1) {
            updatedList[existingIndex] = {
              ...updatedList[existingIndex],
              poolId,
            };
            updatedCount++;
          } else {
            updatedList.unshift({
              id: `${Date.now()}_${Math.random()}`,
              orgId,
              accountId,
              poolId,
            });
            addedCount++;
          }
        } else {
          skippedLines++;
        }
      });

      return updatedList;
    });

    setPastedText("");
    setStatusMsg(
      `Import complete: ${addedCount} added, ${updatedCount} updated.${
        skippedLines > 0 ? ` ${skippedLines} invalid line(s) skipped.` : ""
      }`,
    );
  };

  const visibleMappings = useMemo(() => {
    if (!searchFilter.trim()) return mappings;
    const term = searchFilter.toLowerCase();
    return mappings.filter(
      (m) =>
        m.orgId.toLowerCase().includes(term) ||
        m.accountId.toLowerCase().includes(term) ||
        m.poolId.toLowerCase().includes(term),
    );
  }, [mappings, searchFilter]);

  const toggleSelectToDelete = (id) => {
    setSelectedToDelete((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAllVisibleToDelete = () => {
    const visibleIds = visibleMappings.map((m) => m.id);
    const allSelected = visibleIds.every((id) => selectedToDelete.includes(id));

    if (allSelected) {
      setSelectedToDelete((prev) =>
        prev.filter((id) => !visibleIds.includes(id)),
      );
    } else {
      setSelectedToDelete((prev) =>
        Array.from(new Set([...prev, ...visibleIds])),
      );
    }
  };

  const handleBulkDeleteSelected = () => {
    const count = selectedToDelete.length;
    if (count === 0) return;

    setMappings((prev) => prev.filter((m) => !selectedToDelete.includes(m.id)));
    setSelectedToDelete([]);
    setStatusMsg(`Deleted ${count} mapping(s).`);
  };

  const resetToInitialData = () => {
    setMappings(INITIAL_STATIC_MAPPINGS);
    setSelectedOrgs([]);
    setSelectedAccounts([]);
    setSelectedToDelete([]);
    setStatusMsg("Reset back to default static state.");
  };

  const totalPossibleCombos = selectedOrgs.length * selectedAccounts.length;
  const isAllVisibleSelected =
    visibleMappings.length > 0 &&
    visibleMappings.every((m) => selectedToDelete.includes(m.id));

  return (
    <div className="w-full mx-auto p-2 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" /> Org, Account & Pool
            Mapping
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Map accounts using Visual Selection or Direct Excel Paste
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToInitialData}
            className="p-2 text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
            title="Reset Mock Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert(`Saved ${mappings.length} mappings.`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            <Save className="w-4 h-4" /> Save Mappings ({mappings.length})
          </button>
        </div>
      </div>

      {/* Alert Status Banner */}
      {statusMsg && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-indigo-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200 mb-4 bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => {
            setActiveTab("visual");
            setStatusMsg("");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === "visual"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <MousePointerClick className="w-4 h-4" /> Visual Multi-Select Mode
        </button>
        <button
          onClick={() => {
            setActiveTab("paste");
            setStatusMsg("");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === "paste"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel / CSV
          Paste Mode
        </button>
      </div>

      {/* Visual Multi-Select Panel */}
      {activeTab === "visual" && (
        <div className="bg-white p-4 rounded-b-xl border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Cost Pool
              </label>
              <select
                value={selectedPool}
                onChange={(e) => setSelectedPool(e.target.value)}
                className="w-full text-xs font-semibold text-indigo-900 border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {INITIAL_STATIC_POOLS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setSelectedOrgs([]);
                  setSelectedAccounts([]);
                  setStatusMsg("");
                }}
                className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Reset Selects
              </button>
              <button
                onClick={handleVisualBulkAdd}
                disabled={totalPossibleCombos === 0}
                className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-lg text-xs hover:bg-indigo-700 flex items-center justify-center gap-2 transition"
              >
                <Zap className="w-4 h-4" /> Map {totalPossibleCombos} Pair(s)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Organizations Selection List */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Select Organizations ({selectedOrgs.length})
                </label>
                <button
                  onClick={() =>
                    setSelectedOrgs(
                      selectedOrgs.length === filteredOrgs.length
                        ? []
                        : filteredOrgs.map((o) => o.id),
                    )
                  }
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Select Visible
                </button>
              </div>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orgs..."
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md outline-none focus:border-indigo-500"
                />
              </div>
              <div className="max-h-44 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                {filteredOrgs.map((org) => {
                  const checked = selectedOrgs.includes(org.id);
                  return (
                    <div
                      key={org.id}
                      onClick={() => toggleOrg(org.id)}
                      className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded cursor-pointer select-none transition ${
                        checked
                          ? "bg-indigo-100/70 border border-indigo-300 text-indigo-900 font-medium"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          checked
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {checked && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </div>
                      <span className="truncate">
                        {org.id} - {org.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accounts Selection List with Mapped Status */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Select Accounts ({selectedAccounts.length})
                </label>
                <button
                  onClick={() =>
                    setSelectedAccounts(
                      selectedAccounts.length === filteredAccounts.length
                        ? []
                        : filteredAccounts.map((a) => a.id),
                    )
                  }
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Select Visible
                </button>
              </div>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={accountSearch}
                  onChange={(e) => setAccountSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md outline-none focus:border-indigo-500"
                />
              </div>
              <div className="max-h-44 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                {filteredAccounts.map((acct) => {
                  const checked = selectedAccounts.includes(acct.id);

                  // Check mapping status against selected Orgs
                  const mappedToPools = selectedOrgs
                    .map((orgId) => activeMappingMap.get(`${orgId}_${acct.id}`))
                    .filter(Boolean);

                  const isMappedForSelection = mappedToPools.length > 0;

                  return (
                    <div
                      key={acct.id}
                      onClick={() => toggleAccount(acct.id)}
                      className={`flex items-center justify-between text-xs px-2 py-1.5 rounded cursor-pointer select-none transition ${
                        checked
                          ? "bg-indigo-100/70 border border-indigo-300 text-indigo-900 font-medium"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            checked
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked && (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          )}
                        </div>
                        <span className="truncate">{acct.name}</span>
                      </div>

                      {/* Status Badges */}
                      {selectedOrgs.length > 0 && (
                        <div className="shrink-0">
                          {isMappedForSelection ? (
                            <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded font-medium">
                              Mapped ({mappedToPools.join(", ")})
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded">
                              Unmapped
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paste Mode Panel */}
      {activeTab === "paste" && (
        <div className="bg-white p-4 rounded-b-xl border border-slate-200 shadow-sm mb-6">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Paste Columns from Excel (Format: OrgID [Tab/Comma] AccountID
            [Tab/Comma] PoolID)
          </label>
          <textarea
            rows={5}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder={`ORG-100\t1010\tPOOL-GnA\nORG-101\t5000\tPOOL-Direct\nORG-102\t7020\tPOOL-Overhead`}
            className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
          />

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setPastedText("")}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md transition"
            >
              Clear Input
            </button>
            <button
              onClick={handleParseAndImport}
              className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-md text-xs hover:bg-indigo-700 transition"
            >
              Process & Import Rows
            </button>
          </div>
        </div>
      )}

      {/* Active Mappings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Active Mappings ({visibleMappings.length})
            </span>

            {selectedToDelete.length > 0 && (
              <button
                onClick={handleBulkDeleteSelected}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition shadow-sm animate-in fade-in"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected ({selectedToDelete.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter active list..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs border border-slate-300 rounded-md outline-none bg-white focus:border-indigo-500"
              />
            </div>
            {mappings.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Clear all active mappings?")) {
                    setMappings([]);
                    setSelectedToDelete([]);
                  }
                }}
                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table Header Row */}
        {visibleMappings.length > 0 && (
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase">
            <div className="col-span-1 flex items-center gap-2">
              <button
                onClick={toggleSelectAllVisibleToDelete}
                className="text-slate-500 hover:text-slate-800"
                title="Select all visible"
              >
                {isAllVisibleSelected ? (
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <span>#</span>
            </div>
            <div className="col-span-4">Org ID</div>
            <div className="col-span-3">Account ID</div>
            <div className="col-span-3">Target Pool</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
        )}

        {/* Table Content List */}
        <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
          {visibleMappings.length > 0 ? (
            visibleMappings.map((row, index) => {
              const isSelected = selectedToDelete.includes(row.id);
              return (
                <div
                  key={row.id}
                  className={`p-2.5 grid grid-cols-12 gap-2 items-center text-xs transition ${
                    isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => toggleSelectToDelete(row.id)}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {index + 1}
                    </span>
                  </div>
                  <span className="col-span-4 font-medium text-slate-800 truncate">
                    {row.orgId}
                  </span>
                  <span className="col-span-3 text-slate-600 truncate">
                    {row.accountId}
                  </span>
                  <span className="col-span-3 font-semibold text-indigo-900 truncate">
                    {row.poolId}
                  </span>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => {
                        setMappings((prev) =>
                          prev.filter((m) => m.id !== row.id),
                        );
                        setSelectedToDelete((prev) =>
                          prev.filter((i) => i !== row.id),
                        );
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No active mappings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
