import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { backendUrl } from "./config";
import { IoAccessibility } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const ConfigureField = ({
  externalSections,
  initialConfigMode = "user",
  initialSelectedRoleId = "",
  userOnly = false,
  selectedUser = null,
  roleOnly = false,
}) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(
    userOnly && selectedUser?.userId ? String(selectedUser.userId) : "",
  );
  const [visibility, setVisibility] = useState({}); // Stores { key: { view: bool, edit: bool } }
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("navigation");
  const [configMode, setConfigMode] = useState(initialConfigMode);
  const [selectedUserRole, setSelectedUserRole] = useState(
    initialSelectedRoleId,
  );

  const { loadConfig, canEdit } = useOutletContext();

  const isEditable = canEdit("roleRights");

  // Static definitions strictly for UI mapping
  const navigationSections = [
    {
      id: "dashboard",
      label: "Dashboard and Reporting",
      hideSelectAllEdit: true,
      fields: [
        // { id: "forecastReport", label: "Forecast", hideEdit: true },
        // { id: "spendReport", label: "Spend", hideEdit: true },
        // { id: "trendForecast", label: "Trend Forecast", hideEdit: true },
        // { id: "incomeStatement", label: "Income Statement", hideEdit: true },
        // { id: "balanceSheet", label: "Balance Sheet", hideEdit: true },
        {
          id: "executivedashboard",
          label: "Executive Dashboard",
          hideEdit: true,
        },
        { id: "activeReport", label: "Active Reports", hideEdit: true },
        { id: "versionanalysis", label: "Version Analysis", hideEdit: true },
        {
          id: "bireports",
          label: "BI Reports",
          hideEdit: true,
          children: [
            { id: "cfoReports", label: "CFO Reports", hideEdit: true },
            {
              id: "laborUtilization",
              label: "Labor Utilization",
              hideEdit: true,
            },
            { id: "totalCompany", label: "Total Company", hideEdit: true },
            {
              id: "top10Bottom10Projects",
              label: "Top 10 and Bottom 10 Projects",
              hideEdit: true,
            },
            {
              id: "currentMonthActualsVsForecast",
              label: "Current Month Actuals Vs Forecast",
              hideEdit: true,
            },
          ],
        },
      ],
    },
    //    {
    //   id: "bireports",
    //   label: "BI Reports",
    //   hideSelectAllEdit: true,
    //   fields: [
    //     // { id: "forecastReport", label: "Forecast", hideEdit: true },
    //     // { id: "spendReport", label: "Spend", hideEdit: true },
    //     // { id: "trendForecast", label: "Trend Forecast", hideEdit: true },
    //     // { id: "incomeStatement", label: "Income Statement", hideEdit: true },
    //     // { id: "balanceSheet", label: "Balance Sheet", hideEdit: true },
    //     { id: "executivedashboard", label: "Executive Dashboard", hideEdit: true },
    //     { id: "activeReports", label: "Active Reports", hideEdit: true },
    //     { id: "versionanalysis", label: "Version Analysis", hideEdit: true },
    //   ],
    // },
    {
      id: "procure to pay",
      label: "Procure-to-Pay",
      fields: [
        // { id: "planProjet", label: "Plan Project" },
        // { id: "BUD/EAC", label: "Labor" },
        // { id: "otherCost", label: "Non labor" },
        // { id: "monthlyForecast", label: "Monthly Forecast", hideEdit: true },
        // { id: "revenueDefinition", label: "Revenue Definition" },
        // // { id: "warning", label: "Warning", hideEdit: true },
        // { id: "massUtility", label: "Mass Utility" },
        // { id: "indirectCost", label: "Indirect Cost", hideEdit: true },
        // { id: "laborCategories", label: "Labor Categories" },
        // { id: "funding", label: "Funding", hideEdit: true },
        // { id: "adjustment", label: "Adjustment" },
        { id: "dashboard", label: "Dashboard", hideEdit: true },
      ],
    },
    {
      id: "program controls & analytics",
      label: "Program Controls & Analytics",
      adminOnly: false,
      fields: [
        // { id: "projectFinancialDashboards", label: "Project Financial Dashboards" },
        {
          id: "projectFinancialDashboards",
          label: "Project Financial Dashboards",
          hideEdit: true,
          children: [
            {
              id: "projectperformance",
              label: "Project Performance",
              hideEdit: true,
            },
            { id: "projectconsole", label: "Project Console", hideEdit: true },
            {
              id: "laborutilization",
              label: "Labor Utilization",
              hideEdit: true,
            },
          ],
        },

        // { id: "planProjectAndElc", label: "Plan Project and EAC" },
        {
          id: "planProjectAndElc",
          label: "Plan Project and EAC",
          hideEdit: true,
          children: [
            { id: "planprojects", label: "Plan Projects", hideEdit: true },
            { id: "quickbudget", label: "Quick Budget", hideEdit: true },
            { id: "massutility", label: "Mass Utility", hideEdit: true },
          ],
        },

        // { id: "planNewBusiness", label: "Plan New Business" },

        {
          id: "planNewBusiness",
          label: "Plan New Business",
          hideEdit: true,
          children: [
            {
              id: "managenewbusiness",
              label: "Manage New Business",
              hideEdit: true,
            },
            {
              id: "plannewbusinesses",
              label: "Plan New Businesses",
              hideEdit: true,
            },
            {
              id: "transferprojcetbudget",
              label: "Transfer Project Budget",
              hideEdit: true,
            },
          ],
        },

        // {
        //   id: "transferUtility",
        //   label: "Transfer Project Budget",
        //   hideEdit: true,
        // },
      ],
    },
    // {
    //   id: "forecastRates",
    //   label: "Forecast Rates",
    //   fields: [
    //     { id: "poolRateTabs", label: "Rate Configuration" },
    //     { id: "rateComputation", label: "Rate Computation" },
    //   ],
    // },
    {
      id: "opportunitie and pricing",
      label: "Opportunitie and Pricing",
      fields: [
        // { id: "captureOpportunityandPlanPipeline", label: "Capture Opportunity and Plan Pipeline" },
        {
          id: "captureOpportunityandPlanPipeline",
          label: "Capture Opportunity and Plan Pipeline",
          hideEdit: true,
          children: [
            {
              id: "importopportunities",
              label: "Import Opportunities",
              hideEdit: true,
            },
            {
              id: "planopportunities",
              label: "Plan Opportunities",
              hideEdit: true,
            },
            { id: "analogousrate", label: "Analogous Rate", hideEdit: true },
            { id: "parametricrate", label: "Parametric Rate", hideEdit: true },
          ],
        },
        // { id: "analogRate", label: "RNBIs Analogous Rate" },
        // { id: "parametricRate", label: "NBIs Parametric Rate" },
        // { id: "costProposalandPricing", label: "Cost Proposal and Pricing", hideEdit: true },

        {
          id: "costProposalandPricing",
          label: "Cost Proposal and Pricing",
          hideEdit: true,
          children: [
            { id: "contractsetup", label: "Contract Setup", hideEdit: true },
            {
              id: "proposalbuilder",
              label: "Proposal Builder",
              hideEdit: true,
            },
            { id: "pricingstudio", label: "Pricing Studio", hideEdit: true },
            { id: "massUtility", label: "Mass Utility", hideEdit: true },
            {
              id: "rateconfiguration",
              label: "Rate Configuration",
              hideEdit: true,
            }
          ],
        },
      ],
    },
    {
      id: "corporate budget",
      label: "Corporate Budget",
      fields: [
        { id: "byAccount", label: "By Account" },
        // { id: "analogRate", label: "RNBIs Analogous Rate" },
        // { id: "parametricRate", label: "NBIs Parametric Rate" },
        {
          id: "byDivision",
          label: "By Division/Department/Organization",
          hideEdit: true,
        },
      ],
    },
    {
      id: "govcon compliances",
      label: "Govcon Compliances",
      fields: [
        { id: "PBR", label: "Provisional Billing Rates(PBR)" },
        // { id: "analogRate", label: "RNBIs Analogous Rate" },
        // { id: "parametricRate", label: "NBIs Parametric Rate" },
        { id: "ICE", label: "Incurred Cost Moduel(ICE)", hideEdit: true },
        // { id: "FPRP", label: "Forward Pricing Rates(FPRP)", hideEdit: true },

        {
          id: "FPRP",
          label: "Forward Pricing Rates(FPRP)",
          hideEdit: true,
          children: [
            {
              id: "rateconfiguration",
              label: "Rate Configuration",
              hideEdit: true,
            },
            {
              id: "ratecomputation",
              label: "Rate Computation",
              hideEdit: true,
            },
          ],
        },
      ],
    },

    {
      id: "timeandsubcontractormanagement",
      label: "Time and Subcontractor Management",
      fields: [
        { id: "tmdashboard", label: "Dashboard", hideEdit: true },
        // { id: "analogRate", label: "RNBIs Analogous Rate" },
        // { id: "parametricRate", label: "NBIs Parametric Rate" },
        { id: "createtimesheet", label: "Create Timesheet", hideEdit: true },
        {
          id: "enquiryandapproval",
          label: "Enquiry and Approval",
          hideEdit: true,
        },
        { id: "generateinvoice", label: "Generate Invoice", hideEdit: true },
        { id: "invoiceexport", label: "Invoice Export", hideEdit: true },
        { id: "poinfo", label: "PO Info", hideEdit: true },
        { id: "postatus", label: "PO Status", hideEdit: true },
        { id: "workorder", label: "Work Order", hideEdit: true },
        { id: "report", label: "Report", hideEdit: true },
        { id: "manageproject", label: "Manage Project", hideEdit: true },
        { id: "manageemployee", label: "Manage Employee", hideEdit: true },
        { id: "groupmanagement", label: "Group Management", hideEdit: true },
        {
          id: "userworkflowmapping",
          label: "User Workflow Mapping",
          hideEdit: true,
        },
        {
          id: "employeeplcmapping",
          label: "Employee Project PLC Maping",
          hideEdit: true,
        },
        { id: "settings", label: "Settings", hideEdit: true },
      ],
    },

    {
      id: "settings",
      label: "Settings",
      fields: [
        { id: "configurationsettings", label: "Configuration Settings" },
        // { id: "analogRate", label: "RNBIs Analogous Rate" },
        // { id: "parametricRate", label: "NBIs Parametric Rate" },
        { id: "accessmapping", label: "Access Mapping", hideEdit: true },
        { id: "accountmapping", label: "Acccount Mapping", hideEdit: true },
        {
          id: "ceilingconfiguration",
          label: "Ceiling Configuration",
          hideEdit: true,
        },
        {
          id: "fiscalyearperiods",
          label: "Fiscal Year Periods",
          hideEdit: true,
        },
        { id: "annualholidays", label: "Annual Holidays", hideEdit: true },
        {
          id: "prospectiveidsetup",
          label: "Prospective ID Steup",
          hideEdit: true,
        },
      ],
    },

    {
      id: "admin",
      label: "Admin",
      fields: [
        { id: "managegroups", label: "Manage Groups" },
        // { id: "analogRate", label: "RNBIs Analogous Rate" },
        // { id: "parametricRate", label: "NBIs Parametric Rate" },
        { id: "manageuser", label: "Manage User", hideEdit: true },
        { id: "manageroles", label: "Manage Roles", hideEdit: true },
        { id: "managedevices", label: "Manage Devices", hideEdit: true },
      ],
    },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   fields: [
    //     { id: "globalConfiguration", label: "Configuration Settings" },
    //     { id: "accountMapping", label: "Account Mapping" },
    //     { id: "projectOrgSecurity", label: "Project Org Security" },
    //     { id: "prospectiveIdSetup", label: "Prospective ID Setup" },
    //     { id: "ceilingConfiguration", label: "Ceiling Configuration" },
    //     { id: "annualHolidays", label: "Annual Holidays" },
    //     { id: "fiscalYearPeriods", label: "Fiscal Year Periods" },
    //     { id: "roleRights", label: "Rights Settings" }, // <-- Uncommented so it maps correctly
    //     { id: "manageGroups", label: "Manage Groups" },
    //     { id: "manageUser", label: "Manage User" },
    //   ],
    // },
  ];

  const tableSections = [
    {
      id: "projectHours",
      label: "Project Hours",
      fields: [
        { id: "perHourRate", label: "Hour Rate" },
        { id: "cost", label: "Cost" },
      ],
    },
  ];

  useEffect(() => {
    setConfigMode(initialConfigMode);
    setSelectedUserRole(initialSelectedRoleId || "");
    setSelectedUserId(
      userOnly && selectedUser?.userId ? String(selectedUser.userId) : "",
    );
  }, [
    initialConfigMode,
    initialSelectedRoleId,
    userOnly,
    selectedUser?.userId,
  ]);

  useEffect(() => {
    if (configMode !== "role") return;
    setSelectedUserRole(initialSelectedRoleId || "");
  }, [configMode, initialSelectedRoleId]);

  useEffect(() => {
    if (configMode === "user") {
      setSelectedUserRole("");
    } else {
      setSelectedUserId("");
    }
  }, [configMode]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get(`${backendUrl}/api/User`);
  //       if (res.data) {
  //         const currentUser = JSON.parse(
  //           localStorage.getItem("currentUser") || "{}",
  //         );
  //         const currentUserId = currentUser.userId;

  //         const filteredUsers = res.data.filter(
  //           (user) => user.userId !== currentUserId,
  //         );
  //         setUsers(filteredUsers);
  //       }
  //     } catch (e) {
  //       console.error("User fetch failed", e);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  // useEffect(() => {
  //   const fetchRole = async () => {
  //     try {
  //       const res = await axios.get(`${backendUrl}/Orgnization/Roles`);
  //       if (res.data) setRoles(res.data);
  //     } catch (e) {
  //       console.error("User fetch failed", e);
  //     }
  //   };
  //   fetchRole();
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/User`);
        if (res.data) {
          const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}",
          );
          const currentUserId = currentUser.userId;

          const filteredUsers = res.data.filter(
            (user) =>
              user.userId !== currentUserId &&
              (user.role || "").toLowerCase() !== "admin", // <-- REMOVE ADMIN USERS
          );
          setUsers(filteredUsers);
        }
      } catch (e) {
        console.error("User fetch failed", e);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get(`${backendUrl}/Orgnization/Roles`);
        if (res.data) {
          // TARGET OBJECT FILTER: Accesses role.roleName to drop the ADMIN option from suggestions
          const filteredRoles = res.data.filter(
            (role) => (role.roleName || "").toLowerCase() !== "admin",
          );
          setRoles(filteredRoles);
        }
      } catch (e) {
        console.error("User fetch failed", e);
      }
    };
    fetchRole();
  }, []);

  const getCurrentSections = () => {
    return activeTab === "navigation" ? navigationSections : tableSections;
  };

  useEffect(() => {
    if (!selectedUserId) return;
    const loadConfig = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/Orgnization/${selectedUserId}`,
        );
        const data = res.data || {};
        const mergedVisibility = {
          ...(data.screens || {}),
          ...(data.fields || {}),
        };
        setVisibility(mergedVisibility);
      } catch (e) {
        setVisibility({});
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [selectedUserId, configMode]);

  useEffect(() => {
    if (!selectedUserRole) return;
    const loadConfig = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/Orgnization/role-permissions/${selectedUserRole}`,
        );
        const data = res.data || {};
        const mergedVisibility = {
          ...(data.screens || {}),
          ...(data.fields || {}),
        };
        setVisibility(mergedVisibility);
      } catch (e) {
        setVisibility({});
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [selectedUserRole]);

  const handleCheckboxChange = (fieldId, type, checked) => {
    setVisibility((prev) => {
      const current = prev[fieldId] || { view: false, edit: false };

      if (type === "edit" && checked) {
        return {
          ...prev,
          [fieldId]: { view: true, edit: true },
        };
      }

      if (type === "view" && !checked) {
        return {
          ...prev,
          [fieldId]: { view: false, edit: false },
        };
      }

      return {
        ...prev,
        [fieldId]: {
          ...current,
          [type]: checked,
        },
      };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const screens = {};
      const fields = {};

      navigationSections.forEach((sec) => {
        getPermissionFields(sec).forEach((f) => {
          if (visibility[f.id]) screens[f.id] = visibility[f.id];
        });
      });

      tableSections.forEach((sec) => {
        sec.fields.forEach((f) => {
          if (visibility[f.id]) fields[f.id] = visibility[f.id];
        });
      });

      const isUserMode = configMode === "user";

      const payload = {
        ...(isUserMode
          ? { userid: Number(selectedUserId) }
          : { roleId: Number(selectedUserRole) }),
        screens: screens,
        fields: fields,
      };

      const endpoint = isUserMode
        ? `${backendUrl}/Orgnization/user-settings`
        : `${backendUrl}/Orgnization/role-settings`;

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      const token = currentUser.token ?? "";

      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await loadConfig();
      toast.success("Configuration saved successfully!");
    } catch (e) {
      console.error("Save error:", e);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = (section, type, checked) => {
    setVisibility((prev) => {
      const nextState = { ...prev };

      getPermissionFields(section).forEach((field) => {
        const current = nextState[field.id] || { view: false, edit: false };

        if (type === "view") {
          nextState[field.id] = {
            view: checked,
            edit: checked ? current.edit : false,
          };
        } else if (type === "edit") {
          nextState[field.id] = {
            view: checked ? true : current.view,
            edit: checked,
          };
        }
      });

      return nextState;
    });
  };

  // Include nested BI Reports options in bulk selection and saved permissions.
  const getPermissionFields = (section) =>
    section.fields.flatMap((field) => [field, ...(field.children || [])]);

  const renderSection = (tab) => {
    const permissionFields = getPermissionFields(tab);
    const isAllView = permissionFields.every((f) => visibility[f.id]?.view);
    const isAllEdit = permissionFields.every((f) => visibility[f.id]?.edit);
    return (
      <div
        key={tab.id}
        className="border rounded border-gray-300 overflow-hidden"
      >
        <div
          className={`flex items-center justify-between p-2 ${expanded[tab.id]}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`input-label ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
            >
              {tab.label}
            </span>
            <div className="flex gap-2 ml-4 border-l pl-4 border-gray-400">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllView}
                  onChange={(e) =>
                    handleSelectAll(tab, "view", e.target.checked)
                  }
                  className="w-3 h-3 text-blue-600 rounded"
                  disabled={
                    (!selectedUserRole && !selectedUserId) || !isEditable
                  }
                />
                <span
                  className={`text-xs font-medium text ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
                >
                  Select All View
                </span>
              </label>
              {!tab.hideSelectAllEdit && (
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllEdit}
                    onChange={(e) =>
                      handleSelectAll(tab, "edit", e.target.checked)
                    }
                    className="w-3 h-3 text-blue-600 rounded"
                    disabled={
                      (!selectedUserRole && !selectedUserId) || !isEditable
                    }
                  />
                  <span
                    className={`text-xs font-medium text ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
                  >
                    Select All Edit
                  </span>
                </label>
              )}
            </div>
          </div>
          <button
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [tab.id]: !prev[tab.id] }))
            }
            className="text-xs font-medium hover:underline p-1 rounded cursor-pointer"
          >
            {expanded[tab.id]
              ? "Hide Items"
              : `(${tab.fields.length}) Show Items`}
          </button>
        </div>

        {expanded[tab.id] && (
          <div className="p-2 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              {tab.fields.map((field) => (
                <div
                  key={field.id}
                  className="p-2 border border-gray-200 rounded bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-xs font-medium text-gray-700 ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
                    >
                      {field.label}
                    </span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            !!visibility[field.id]?.view ||
                            !!visibility[field.id]?.edit
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              field.id,
                              "view",
                              e.target.checked,
                            )
                          }
                          className="w-3 h-3 text-blue-600 rounded"
                          disabled={
                            (!selectedUserRole && !selectedUserId) ||
                            !isEditable
                          }
                        />
                        <span
                          className={`text-[10px] ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
                        >
                          View
                        </span>
                      </label>
                      {!field.hideEdit && (
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!visibility[field.id]?.edit}
                            onChange={(e) =>
                              handleCheckboxChange(
                                field.id,
                                "edit",
                                e.target.checked,
                              )
                            }
                            disabled={
                              (!selectedUserRole && !selectedUserId) ||
                              !isEditable
                            }
                            className="w-3 h-3 text-blue-600 rounded"
                          />
                          <span
                            className={`text-[10px] ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
                          >
                            Edit
                          </span>
                        </label>
                      )}
                      {!!field.children?.length && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((prev) => ({
                              ...prev,
                              [`field-${field.id}`]: !prev[`field-${field.id}`],
                            }))
                          }
                          className="text-xs font-medium hover:underline whitespace-nowrap"
                        >
                          {expanded[`field-${field.id}`]
                            ? "Hide Items"
                            : `(${field.children.length}) Show Items`}
                        </button>
                      )}
                    </div>
                  </div>

                  {!!field.children?.length &&
                    expanded[`field-${field.id}`] && (
                      <div className="mt-3 ml-2 pl-3 border-l-2 border-[#17414d] space-y-2">
                        {field.children.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between gap-3 rounded border border-gray-200 bg-white px-3 py-2"
                          >
                            <span
                              className={`text-xs text-gray-700 ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
                            >
                              {child.label}
                            </span>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  !!visibility[child.id]?.view ||
                                  !!visibility[child.id]?.edit
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    child.id,
                                    "view",
                                    e.target.checked,
                                  )
                                }
                                className="w-3 h-3 text-blue-600 rounded"
                                disabled={
                                  (!selectedUserRole && !selectedUserId) ||
                                  !isEditable
                                }
                              />
                              <span
                                className={`text-[10px] ${!selectedUserRole && !selectedUserId ? "text-gray-400" : ""}`}
                              >
                                View
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  const hasSelection =
    configMode === "user" ? !!selectedUserId : !!selectedUserRole;

  return (
    <div className="min-h-screen text-gray-900 flex justify-center">
      <div className="w-full space-y-2">
        <div className="p-2 flex items-center justify-between bg-white rounded-sm">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1">
            <IoAccessibility size={16} className="text-blue-500" />
            Access Rights
          </h2>
        </div>

        <div className="bg-white rounded-sm p-2">
          {userOnly ? (
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm text-gray-900">Selected User:</label>
              <span className="text-sm text-black font-medium">
                {selectedUser?.fullName ||
                  selectedUser?.userName ||
                  selectedUser?.username ||
                  "Selected User"}
              </span>
            </div>
          ) : roleOnly ? (
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm text-gray-900">Selected Role:</label>
              <span className="text-sm text-black font-medium">
                {roles.find(
                  (r) => String(r.roleId) === String(selectedUserRole),
                )?.roleName || "Selected Role"}
              </span>
            </div>
          ) : (
            <>
              <div className="mb-4 flex gap-2 items-center">
                <span className="input-label">Configure by:</span>
                <button
                  onClick={() => setConfigMode("user")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer ${configMode === "user" ? "bg-[#17414d] text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  User
                </button>
                <button
                  onClick={() => setConfigMode("role")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer ${configMode === "role" ? "bg-[#17414d] text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  Role
                </button>
              </div>

              {configMode === "user" && (
                <div className="flex items-center gap-2 mb-2">
                  <label className="label-input">Select User:</label>
                  <Select
                    options={users.map((u) => ({
                      value: u.userId,
                      label: u.fullName,
                    }))}
                    value={
                      users
                        .map((u) => ({ value: u.userId, label: u.fullName }))
                        .find(
                          (option) =>
                            String(option.value) === String(selectedUserId),
                        ) || null
                    }
                    onChange={(opt) => setSelectedUserId(opt ? opt.value : "")}
                    className="w-[250px]"
                    isClearable
                  />
                </div>
              )}

              {configMode === "role" && (
                <div className="flex items-center gap-2 mb-2">
                  <label className="label-input">Select Role:</label>
                  <Select
                    options={roles.map((u) => ({
                      value: u.roleId,
                      label: u.roleName,
                    }))}
                    value={
                      roles
                        .map((u) => ({ value: u.roleId, label: u.roleName }))
                        .find(
                          (option) =>
                            String(option.value) === String(selectedUserRole),
                        ) || null
                    }
                    onChange={(opt) =>
                      setSelectedUserRole(opt ? opt.value : "")
                    }
                    className="w-[250px]"
                    isClearable
                  />
                </div>
              )}
            </>
          )}
        </div>

        {hasSelection && (
          <div className="bg-white rounded-sm p-4">
            <div className="flex item-center justify-between">
              <div className="flex gap-2 mb-4">
                <button
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${activeTab === "navigation" ? "bg-[#17414d] text-white" : "bg-gray-100"}`}
                  onClick={() => setActiveTab("navigation")}
                >
                  Screens
                </button>
                <button
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${activeTab === "tableHeaders" ? "bg-[#17414d] text-white" : "bg-gray-100"}`}
                  onClick={() => setActiveTab("tableHeaders")}
                >
                  Fields
                </button>
              </div>

              <div>
                {isEditable && (
                  <button
                    onClick={save}
                    disabled={saving || (!selectedUserRole && !selectedUserId)}
                    className="btn1 btn-blue"
                  >
                    {saving ? "Saving..." : `Save`}
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 mt-4">Loading...</span>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                {getCurrentSections().map(renderSection)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigureField;
