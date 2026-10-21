import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Database,
  Layers,
  Search,
  Folder,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BarChart3,
  Settings,
  Briefcase,
  Loader2,
  AlertCircle,
  Plus,
  X,
  TrendingUp,
  Target,
  Percent,
  SlidersHorizontal,
} from "lucide-react";
import { backendUrl } from "./config";

// 100% Complete Component & Page inventory directly from NavigationSidebar.jsx
const initialComponentAndPageInventory = [
  // --- BI Reports ---
  {
    type: "Page",
    name: "BIReports.jsx",
    label: "CFO Reports",
    path: "/dashboard/cfo-bi-reports",
    tables: ["bi_report_metadata"],
    section: "BI Reports",
  },
  {
    type: "Page",
    name: "LaborUtilizationSummary.jsx",
    label: "Labor Utilization",
    path: "/dashboard/cfo-bi-reports-labor",
    tables: ["pl_employeeburdencalculated"],
    section: "BI Reports",
  },

  // --- Financial Forecast / Reporting Screens ---
  {
    type: "Page",
    name: "FinancialDashboard.jsx",
    label: "Dashboard",
    path: "/dashboard/project-report",
    tables: ["pl_project", "account"],
    section: "Reporting Screens",
  },
  {
    type: "Page",
    name: "ReportingScreen.jsx",
    label: "Active Reports",
    path: "/dashboard/reporting-screen",
    tables: ["report_template"],
    section: "Reporting Screens",
  },
  {
    type: "Page",
    name: "ProjectVariance.jsx",
    label: "Version Analysis",
    path: "/dashboard/project-variance",
    tables: ["pl_project_variance"],
    section: "Reporting Screens",
  },
  {
    type: "Page",
    name: "PSRTrendReport.jsx",
    label: "Project Console",
    path: "/dashboard/project-analysis-dash",
    tables: ["pl_project"],
    section: "Reporting Screens",
  },

  // --- Project Budget / General Section ---
  {
    type: "Component",
    name: "ProjectBudgetStatus.jsx",
    label: "Plan Projects",
    path: "/dashboard/project-budget-status",
    tables: ["pl_project", "pl_project_budget"],
    section: "Project Planning",
  },
  {
    type: "Component",
    name: "CreateProjectBudget.jsx",
    label: "Quick Budget",
    path: "/dashboard/quick-budget",
    tables: ["pl_project_budget"],
    section: "Project Planning",
  },
  {
    type: "Component",
    name: "MassUtilityProject.jsx",
    label: "Mass Utility",
    path: "/dashboard/mass-utility",
    tables: ["pl_project"],
    section: "Project Planning",
  },

  // --- New Business Budget Section ---
  {
    type: "Component",
    name: "NewBusinessComponent.jsx",
    label: "Manage New Business",
    path: "/dashboard/new-business",
    tables: ["opportunities"],
    section: "New Business Budget",
  },
  {
    type: "Component",
    name: "NewBusiness.jsx",
    label: "Plan New Businesses",
    path: "/dashboard/nb-project",
    tables: ["opportunities"],
    section: "New Business Budget",
  },
  {
    type: "Component",
    name: "CreateProjectBudget.jsx",
    label: "Transfer Project Budget",
    path: "/dashboard/create-project-budget",
    tables: ["pl_project_budget"],
    section: "New Business Budget",
  },
  {
    type: "Component",
    name: "Pricing.jsx",
    label: "Pricing",
    path: "/dashboard/pricing",
    tables: [],
    section: "New Business Budget",
  },

  // --- Opportunity Budget Section ---
  {
    type: "Component",
    name: "Import.jsx",
    label: "Import Opportunities",
    path: "/dashboard/import-opportunity",
    tables: [],
    section: "Opportunity Budget",
  },
  {
    type: "Component",
    name: "Opportunities.jsx",
    label: "Plan Opportunities",
    path: "/dashboard/opp-project",
    tables: ["opportunities"],
    section: "Opportunity Budget",
  },
  {
    type: "Component",
    name: "AnalogRate.jsx",
    label: "NBIs Analogous Rate",
    path: "/dashboard/analog-rate",
    tables: [],
    section: "Opportunity Budget",
  },
  {
    type: "Component",
    name: "NBIParametricRate.jsx",
    label: "NBIs Parametric Rate",
    path: "/dashboard/parametric-rate",
    tables: [],
    section: "Opportunity Budget",
  },

  // --- Forecast Rates Section ---
  {
    type: "Component",
    name: "PoolRateTabs.jsx",
    label: "Rate Configuration",
    path: "/dashboard/pool-rate-tabs",
    tables: [],
    section: "Forecast Rates",
  },
  {
    type: "Component",
    name: "RateConfigure.jsx",
    label: "Rate Computation",
    path: "/dashboard/rate-configure",
    tables: [],
    section: "Forecast Rates",
  },

  // --- Configuration Management ---
  {
    type: "Component",
    name: "GlobalConfiguration.jsx",
    label: "Configuration Settings",
    path: "/dashboard/global-configuration",
    tables: [],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "UserOrgProjectMapping.jsx",
    label: "Project Org Security",
    path: "/dashboard/projectmapping",
    tables: ["user_profiles"],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "AccountMapping.jsx",
    label: "Account Mapping",
    path: "/dashboard/account-mapping",
    tables: ["account"],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "CeilingConfiguration.jsx",
    label: "Ceiling Configuration",
    path: "/dashboard/ceiling-configuration",
    tables: [],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "MaintainFiscalYearPeriods.jsx",
    label: "Fiscal Year Periods",
    path: "/dashboard/maintain-fiscal-year-periods",
    tables: [],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "HolidayCalendar.jsx",
    label: "Annual Holidays",
    path: "/dashboard/annual-holidays",
    tables: [],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "ProspectiveIdSetup.jsx",
    label: "Prospective ID Setup",
    path: "/dashboard/prospective-id-setup",
    tables: [],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "ManageGroups.jsx",
    label: "Manage Groups",
    path: "/dashboard/manage-groups",
    tables: [],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "ManageUser.jsx",
    label: "Manage Users",
    path: "/dashboard/manage-users",
    tables: [],
    section: "Configuration Settings",
  },
  {
    type: "Component",
    name: "ConfigureField.jsx",
    label: "Rights Settings",
    path: "/dashboard/role-rights",
    tables: [],
    section: "Configuration Settings",
  },

  // --- R-AI Assistant ---
  {
    type: "Component",
    name: "ChatBot.jsx",
    label: "R-AI",
    path: "/dashboard/our-ai",
    tables: ["chat_history"],
    section: "AI Core",
  },
];

const APIInventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({});
  const [inventory, setInventory] = useState(initialComponentAndPageInventory);

  const [dbTables, setDbTables] = useState([]);
  const [liveTablesMap, setLiveTablesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFormTable, setSelectedFormTable] = useState({});

  useEffect(() => {
    const fetchDbSchemaInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/ForecastReport/GetDbInfoV1`,
        );

        if (response.data && response.data.tables) {
          setDbTables(response.data.tables);
          const map = {};
          response.data.tables.forEach((table) => {
            map[table.tableName.toLowerCase()] = {
              tableName: table.tableName,
              rowCount: table.rowCount,
            };
          });
          setLiveTablesMap(map);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch current database catalog tables stream.");
      } finally {
        setLoading(false);
      }
    };
    fetchDbSchemaInfo();
  }, []);

  const handleAddTable = (componentName) => {
    const tableToAdd = selectedFormTable[componentName];
    if (!tableToAdd) return;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.name === componentName) {
          if (item.tables.includes(tableToAdd)) return item;
          return { ...item, tables: [...item.tables, tableToAdd] };
        }
        return item;
      }),
    );
    setSelectedFormTable((prev) => ({ ...prev, [componentName]: "" }));
  };

  const handleRemoveTable = (componentName, tableNameToRemove) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.name === componentName) {
          return {
            ...item,
            tables: item.tables.filter((t) => t !== tableNameToRemove),
          };
        }
        return item;
      }),
    );
  };

  const groupedInventory = useMemo(() => {
    const filtered = inventory.filter((item) => {
      const matchQuery = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(matchQuery) ||
        item.label.toLowerCase().includes(matchQuery) ||
        item.tables.some((t) => t.toLowerCase().includes(matchQuery))
      );
    });

    const groups = {};
    filtered.forEach((item) => {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    });
    return groups;
  }, [searchTerm, inventory]);

  const getSectionIcon = (section) => {
    switch (section) {
      case "BI Reports":
        return <BarChart3 size={18} className="text-blue-500" />;
      case "Reporting Screens":
        return <TrendingUp size={18} className="text-indigo-500" />;
      case "Project Planning":
        return <Briefcase size={18} className="text-teal-500" />;
      case "New Business Budget":
        return <Percent size={18} className="text-amber-500" />;
      case "Opportunity Budget":
        return <Target size={18} className="text-rose-500" />;
      case "Forecast Rates":
        return <SlidersHorizontal size={18} className="text-cyan-500" />;
      case "AI Core":
        return <Sparkles size={18} className="text-purple-500" />;
      default:
        return <Settings size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header Block */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Database className="text-emerald-500" size={26} />
                System Component & Database Schema Registry
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Map database tracking schemas onto layouts mapped directly from
                your sidebar routing elements.
              </p>
            </div>

            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search views, modules, or linked schema tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-medium text-slate-500">
            {loading && (
              <span className="flex items-center gap-1.5 text-blue-600 animate-pulse">
                <Loader2 size={14} className="animate-spin" /> Loading API
                tables catalog...
              </span>
            )}
            {error && (
              <span className="flex items-center gap-1.5 text-rose-600">
                <AlertCircle size={14} /> {error}
              </span>
            )}
            {!loading && !error && (
              <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                ● Live Database: {dbTables.length} layout structural schema
                options fully synced.
              </span>
            )}
          </div>
        </div>

        {/* Accordion Group Modules */}
        {Object.keys(groupedInventory).length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500">
            No UI elements matched criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedInventory).map(([sectionName, items]) => {
              const isCollapsed = collapsedSections[sectionName];
              return (
                <div
                  key={sectionName}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() =>
                      setCollapsedSections((p) => ({
                        ...p,
                        [sectionName]: !p[sectionName],
                      }))
                    }
                    className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getSectionIcon(sectionName)}
                      <h2 className="font-semibold text-slate-900 text-base">
                        {sectionName}
                      </h2>
                      <span className="bg-slate-200/80 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                        {items.length} Elements
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight size={18} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-400" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracker-wider w-24">
                              Layer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracker-wider w-64">
                              Component Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracker-wider">
                              Assigned Tables & Dynamic Schema Form Mapping
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {items.map((item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-slate-50/40 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${
                                    item.type === "Page"
                                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                                      : "bg-purple-50 text-purple-700 border border-purple-100"
                                  }`}
                                >
                                  {item.type}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-sm">
                                <div className="font-bold text-slate-900">
                                  {item.label}
                                </div>
                                <div className="text-slate-500 font-mono text-xs mt-0.5 flex items-center gap-1">
                                  <Folder
                                    size={12}
                                    className="text-slate-400"
                                  />{" "}
                                  {item.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {item.path}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-3">
                                  {/* Render Current Assignment Badges */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {item.tables.length === 0 ? (
                                      <span className="text-xs text-slate-400 italic">
                                        No structural schema tables assigned
                                        yet.
                                      </span>
                                    ) : (
                                      item.tables.map((tName, idx) => {
                                        const liveInfo =
                                          liveTablesMap[tName.toLowerCase()];
                                        return (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 pl-2 pr-1 py-0.5 text-xs font-mono font-medium rounded animate-fadeIn"
                                          >
                                            <Database
                                              size={11}
                                              className="text-emerald-500"
                                            />
                                            {liveInfo
                                              ? liveInfo.tableName
                                              : tName}
                                            {liveInfo && (
                                              <span className="bg-emerald-200/50 text-emerald-900 font-sans text-[10px] px-1 font-bold rounded">
                                                {liveInfo.rowCount} r
                                              </span>
                                            )}
                                            <button
                                              onClick={() =>
                                                handleRemoveTable(
                                                  item.name,
                                                  tName,
                                                )
                                              }
                                              className="text-emerald-400 hover:text-rose-600 rounded p-0.5 ml-1 transition-colors"
                                            >
                                              <X size={12} />
                                            </button>
                                          </span>
                                        );
                                      })
                                    )}
                                  </div>

                                  {/* Dynamic Assignment Form Actions */}
                                  <div className="flex items-center gap-2 max-w-md">
                                    <select
                                      value={selectedFormTable[item.name] || ""}
                                      onChange={(e) =>
                                        setSelectedFormTable((prev) => ({
                                          ...prev,
                                          [item.name]: e.target.value,
                                        }))
                                      }
                                      className="flex-1 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                                    >
                                      <option value="">
                                        -- Add database table assignment --
                                      </option>
                                      {dbTables.map((dbT) => (
                                        <option
                                          key={dbT.tableName}
                                          value={dbT.tableName}
                                        >
                                          {dbT.tableName} ({dbT.rowCount} rows)
                                        </option>
                                      ))}
                                    </select>

                                    <button
                                      onClick={() => handleAddTable(item.name)}
                                      disabled={!selectedFormTable[item.name]}
                                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs px-2.5 py-1.5 rounded-md transition-colors"
                                    >
                                      <Plus size={14} /> Assign
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default APIInventoryDashboard;
