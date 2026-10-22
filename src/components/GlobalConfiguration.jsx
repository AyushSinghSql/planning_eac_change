import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Select from "react-select";
import { backendUrl } from "./config";
import { Plus, Trash2, Edit, X, Cog, Search } from "lucide-react";
import DisplaySettingsContent from "./DisplaySettings";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { debounce } from "lodash";
import { Info } from "lucide-react";
import axios from "axios";

const cn = (...args) => {
  return args.filter(Boolean).join(" ");
};

// --- Main LaborForm Component with Tabs ---
const LaborForm = () => {
  const [activeTab, setActiveTab] = useState("OrganizationSettings");

  const [budgetHeaderDateFormat, setBudgetHeaderDateFormat] = useState(""); // Default to empty for "Select"
  const [reportVarianceCalculation, setReportVarianceCalculation] =
    useState(""); // Default to empty for "Select"

  // NEW states for additional fields from the image
  const [reportHeaderDateFormatOrg, setReportHeaderDateFormatOrg] =
    useState("01/3109");
  const [reportHeaderDateFormatProject, setReportHeaderDateFormatProject] =
    useState("JAN-09");
  const [dropdownListDateFormat, setDropdownListDateFormat] =
    useState("01/3109");
  const [reportPrecisionDollar, setReportPrecisionDollar] = useState("2");
  const [reportPrecisionHour, setReportPrecisionHour] = useState("1");
  const [reportPrecisionPercent, setReportPrecisionPercent] = useState("2");
  const [poLagDays, setPoLagDays] = useState("3");
  const [financialStatementCode, setFinancialStatementCode] =
    useState("INDSTM");

  // NEW states for checkboxes
  const [includeInactiveOrganizations, setIncludeInactiveOrganizations] =
    useState(false);
  const [includeInactiveVendors, setIncludeInactiveVendors] = useState(false);
  const [includeEmployeeVendors, setIncludeEmployeeVendors] = useState(false);
  const [includeVendorEmployees, setIncludeVendorEmployees] = useState(false);
  const [includeCostOfMoneyRevenueFee, setIncludeCostOfMoneyRevenueFee] =
    useState(false);
  const [displayDetailAccounts, setDisplayDetailAccounts] = useState(false);
  const [
    includePendingApprovedRequisitions,
    setIncludePendingApprovedRequisitions,
  ] = useState(false);
  const [includeUnreleasedBlanketPO, setIncludeUnreleasedBlanketPO] =
    useState(false);
  const [pendingChangesReportingMethod, setPendingChangesReportingMethod] =
    useState("Exclude From Total Cost");

  const [version, setVersion] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupNames, setGroupNames] = useState({});

  // Add this near line 240 with other project configuration states
  const [
    allowSubmissionWhenBudgetIsEmpty,
    setAllowSubmissionWhenBudgetIsEmpty,
  ] = useState(false);
  const [
    allowSubmissionWhenBudgetIsEmptyId,
    setAllowSubmissionWhenBudgetIsEmptyId,
  ] = useState("");
  const [allowSubmissionWhenEACIsEmpty, setAllowSubmissionWhenEACIsEmpty] =
    useState(false);
  const [allowSubmissionWhenEACIsEmptyId, setAllowSubmissionWhenEACIsEmptyId] =
    useState("");

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState(null);
  const [newVersion, setNewVersion] = useState({
    id: "",
    versionCodeValue: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { visibility, canView, canEdit } = useOutletContext();

  const isEditableField = canEdit("globalConfiguration");

  const currentYear = new Date().getFullYear(); // 2026
  const yearOptions = Array.from({ length: 9 }, (_, i) =>
    String(currentYear - 3 + i),
  );

  const [newSecurityItem, setNewSecurityItem] = useState({});

  // Convert comma-separated database values into UI lists.
  const parseSecurityList = (value) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const updateSecurityList = (configName, items) => {
    setSecurityConfigs((previous) =>
      previous.map((config) =>
        config.name === configName
          ? { ...config, value: items.join(",") }
          : config,
      ),
    );
  };

  const addSecurityItem = (configName) => {
    const input = (newSecurityItem[configName] || "").trim();

    if (!input) return;

    const config = securityConfigs.find((item) => item.name === configName);

    if (!config) return;

    const currentItems = parseSecurityList(config.value);

    if (
      currentItems.some((item) => item.toLowerCase() === input.toLowerCase())
    ) {
      toast.info("This item already exists.");
      return;
    }

    updateSecurityList(configName, [...currentItems, input]);

    setNewSecurityItem((previous) => ({
      ...previous,
      [configName]: "",
    }));
  };

  const removeSecurityItem = (configName, itemToRemove) => {
    const config = securityConfigs.find((item) => item.name === configName);

    if (!config) return;

    updateSecurityList(
      configName,
      parseSecurityList(config.value).filter((item) => item !== itemToRemove),
    );
  };

  const validateSecurityList = (configName, items) => {
    if (configName === "IpFiltering_RestrictedPaths") {
      return items.every((path) => path.startsWith("/") && !/\s/.test(path));
    }

    if (
      configName === "IpFiltering_AllowedIps" ||
      configName === "IpFiltering_BlockedIps"
    ) {
      // Supports IPv4 addresses.
      return items.every((ip) => {
        const parts = ip.split(".");
        return (
          parts.length === 4 &&
          parts.every(
            (part) =>
              /^\d{1,3}$/.test(part) &&
              Number(part) >= 0 &&
              Number(part) <= 255,
          )
        );
      });
    }

    return true;
  };

  const renderSecurityListEditor = (config) => {
    const items = parseSecurityList(config.value);

    return (
      <div className="space-y-3">
        <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
          {items.length === 0 && (
            <span className="self-center text-xs text-gray-400">
              No items added yet
            </span>
          )}

          {items.map((item) => (
            <span
              key={item}
              className="inline-flex max-w-full items-center gap-2 rounded-md border border-[#d5e5e8] bg-white px-3 py-1.5 text-xs font-medium text-[#17414d] shadow-sm"
            >
              <span className="break-all">{item}</span>

              {isEditableField && (
                <button
                  type="button"
                  onClick={() => removeSecurityItem(config.name, item)}
                  title={`Remove ${item}`}
                  aria-label={`Remove ${item}`}
                  className="shrink-0 rounded text-gray-400 hover:text-red-600"
                >
                  <span className="text-base leading-none">×</span>
                </button>
              )}
            </span>
          ))}
        </div>

        {isEditableField && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newSecurityItem[config.name] || ""}
              onChange={(e) =>
                setNewSecurityItem((previous) => ({
                  ...previous,
                  [config.name]: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSecurityItem(config.name);
                }
              }}
              placeholder={
                config.name === "IpFiltering_RestrictedPaths"
                  ? "/api/new-path"
                  : "203.0.113.12"
              }
              className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17414d] focus:ring-1 focus:ring-[#17414d]"
            />

            <button
              type="button"
              onClick={() => addSecurityItem(config.name)}
              className="rounded-md border border-[#17414d] px-3 py-2 text-xs font-semibold text-[#17414d] hover:bg-[#edf4f5]"
            >
              + Add
            </button>
          </div>
        )}
      </div>
    );
  };

  const [securityConfigs, setSecurityConfigs] = useState([]);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);

  const SECURITY_DEFAULTS = [
    {
      name: "enable_jwt_auth",
      label: "JWT Authorization",
      description:
        "When enabled, protected API endpoints require a valid JWT token to allow access. Requests with a missing, invalid, or expired token are rejected. Endpoints explicitly marked AllowAnonymous can still be accessed without a JWT token. When disabled, JWT authorization enforcement controlled by this setting is turned off.",
      type: "boolean",
      defaultValue: "false",
    },
    {
      name: "enable_device_auth",
      label: "Device Authentication",
      description:
        "When enabled, API requests must satisfy the device-authentication checks implemented by the backend. Requests that fail those checks are rejected. When disabled, the device-authentication requirement controlled by this setting is turned off. This setting only takes effect if the backend device-authentication logic reads and enforces it.",
      type: "boolean",
      defaultValue: "true",
    },
    {
      name: "IpFiltering_Enabled",
      label: "Enable IP Filtering",
      description:
        "When enabled, the backend checks the requesting client's IP address against the blocked-IP list and applies the allowed-IP restriction to the configured restricted API paths. Blocked IP addresses are denied access to all endpoints, while IP addresses not in the allowed list are denied access to restricted paths. When disabled, both IP-blocking and restricted-path IP checks are skipped, so these IP filtering rules do not prevent access.",
      type: "boolean",
      defaultValue: "true",
    },
    // {
    //   name: "IpFiltering_RestrictedPaths",
    //   label: "Restricted API Paths",
    //   description:
    //     "Enter comma-separated API paths that should only be accessible to IP addresses listed in Allowed IP Addresses. For example, /api/admin,/api/financialreport,/api/export. When IP filtering is enabled, requests to these paths, including their subpaths, are rejected with HTTP 403 Forbidden if the client's IP address is not in the allowed list. Other paths are not restricted by this list, but blocked IP addresses are still denied access to every endpoint.",
    //   type: "text",
    //   defaultValue: "/api/admin,/api/financialreport,/api/export",
    // },
    {
      name: "IpFiltering_AllowedIps",
      label: "Allowed IP Addresses",
      description:
        "Enter comma-separated IP addresses permitted to access the API paths configured in Restricted API Paths. For example, 203.0.113.10,203.0.113.11. When IP filtering is enabled, requests to a restricted path are allowed through the IP-filtering check only if the client's IP address matches an address in this list and is not blocked. IP addresses in this list can access other, unrestricted paths unless they are blocked. Being allowed by IP filtering does not bypass JWT, device-authentication, or other security checks.",
      type: "text",
      defaultValue: "203.0.113.10,203.0.113.11",
    },
    {
      name: "IpFiltering_BlockedIps",
      label: "Blocked IP Addresses",
      description:
        "Enter comma-separated IP addresses that must be denied access to every API endpoint. For example, 1.1.1.1. When IP filtering is enabled, if a request comes from an IP address in this list, the backend immediately rejects the request with HTTP 403 Forbidden, regardless of the requested API path or whether that IP address is also in the allowed list. Blocked IP rules take priority over allowed-IP rules.",
      type: "text",
      defaultValue: "1.1.1.1",
    },
  ];

  const fetchSecurityConfigs = useCallback(async () => {
    setSecurityLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
      );

      if (!response.ok) {
        throw new Error("Failed to load security configuration.");
      }

      const data = await response.json();
      const records = Array.isArray(data) ? data : [];

      const securityRows = SECURITY_DEFAULTS.map((setting) => {
        const existing = records.find((item) => item.name === setting.name);

        return {
          id: existing?.id ?? 0,
          name: setting.name,
          label: setting.label,
          description: setting.description,
          type: setting.type,
          value: existing?.value ?? setting.defaultValue,
          projId: existing?.projId ?? "xxxxx",
          createdAt: existing?.createdAt ?? new Date().toISOString(),
        };
      });

      setSecurityConfigs(securityRows);
    } catch (error) {
      toast.error(error.message || "Unable to load security settings.");
    } finally {
      setSecurityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "securityConfiguration") {
      fetchSecurityConfigs();
    }
  }, [activeTab, fetchSecurityConfigs]);

  const handleSaveSecurityConfigs = async () => {
    if (!isEditableField) {
      toast.error("You do not have permission to edit configuration.");
      return;
    }

    // Validate configured IP addresses before saving.
    const ipConfig = securityConfigs.find(
      (item) => item.name === "IpFiltering_AllowedIps",
    );

    const blockedConfig = securityConfigs.find(
      (item) => item.name === "IpFiltering_BlockedIps",
    );

    const isValidIp = (ip) => {
      const parts = ip.trim().split(".");

      return (
        parts.length === 4 &&
        parts.every(
          (part) =>
            /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255,
        )
      );
    };

    for (const config of [ipConfig, blockedConfig]) {
      const ips = (config?.value ?? "")
        .split(",")
        .map((ip) => ip.trim())
        .filter(Boolean);

      if (ips.some((ip) => !isValidIp(ip))) {
        toast.error(`Invalid IPv4 address in ${config.label}.`);
        return;
      }
    }

    for (const config of securityConfigs) {
      if (
        config.type === "text" &&
        !validateSecurityList(config.name, parseSecurityList(config.value))
      ) {
        toast.error(`Please check the entries in ${config.label}.`);
        return;
      }
    }

    setSecuritySaving(true);

    try {
      const payload = securityConfigs.map((config) => ({
        id: config.id || 0,
        name: config.name,
        value: String(config.value),
        createdAt: config.createdAt || new Date().toISOString(),
        projId: "xxxxx",
      }));

      const response = await axios.put(
        `${backendUrl}/api/Configuration/UpdateConfigValues`,
        payload,
      );
      if (!response) {
        throw new Error("Failed to save security configuration.");
      }

      toast.success("Security configuration saved successfully.");
      await fetchSecurityConfigs();
    } catch (error) {
      toast.error(error.message || "Unable to save security settings.");
    } finally {
      setSecuritySaving(false);
    }
  };

  // Fetch templates and pools on mount

  // Handle saving Display Settings to an API
  const handleSaveSettings = useCallback(async () => {
    setIsLoading(true);
    // console.log("Attempting to save Display Settings...");

    // Basic validation for required fields
    if (!budgetHeaderDateFormat) {
      // alert("Please select a Budget Header Date Format.");
      toast.info("Please select a Budget Header Date Format.");
      return;
    }
    if (!reportVarianceCalculation) {
      // alert("Please select a Report Variance Calculation option.");
      toast.info("Please select a Report Variance Calculation option.");
      return;
    }
    if (!reportPrecisionPercent) {
      // alert("Report Precision Percent is required.");
      toast.info("Report Precision Percent is required.");
      return;
    }
    if (!poLagDays) {
      // alert("PO Lag Days is required.");
      toast.info("PO Lag Days is required.");
      return;
    }
    if (!financialStatementCode) {
      // alert("Financial Statement Code is required.");
      toast.info("Financial Statement Code is required.");
      return;
    }

    // Placeholder API endpoint for saving Display Settings
    // You will need to replace this with your actual API endpoint.
    // api/Configuration/UpdateConfigValues
    const updateApiUrl = `${backendUrl}/api/Configuration/bulk-upsert`;

    const dataToSave = {
      budgetHeaderDateFormat: budgetHeaderDateFormat,
      reportVarianceCalculation: reportVarianceCalculation,
      reportHeaderDateFormatOrg: reportHeaderDateFormatOrg,
      reportHeaderDateFormatProject: reportHeaderDateFormatProject,
      dropdownListDateFormat: dropdownListDateFormat,
      reportPrecisionDollar: reportPrecisionDollar,
      reportPrecisionHour: reportPrecisionHour,
      reportPrecisionPercent: reportPrecisionPercent,
      poLagDays: poLagDays,
      financialStatementCode: financialStatementCode,
      includeInactiveOrganizations: includeInactiveOrganizations,
      includeInactiveVendors: includeInactiveVendors,
      includeEmployeeVendors: includeEmployeeVendors,
      includeVendorEmployees: includeVendorEmployees,
      includeCostOfMoneyRevenueFee: includeCostOfMoneyRevenueFee,
      displayDetailAccounts: displayDetailAccounts,
      includePendingApprovedRequisitions: includePendingApprovedRequisitions,
      includeUnreleasedBlanketPO: includeUnreleasedBlanketPO,
      pendingChangesReportingMethod: pendingChangesReportingMethod,
    };

    // console.log("Display Settings Data to Save:", dataToSave);

    try {
      const response = await fetch(updateApiUrl, {
        method: "POST", // Or 'PUT' or 'PATCH' as per your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server error" }));
        throw new Error(
          `Failed to save settings: ${errorData.message || response.statusText}`,
        );
      }

      const result = await response.json();
      // console.log('Display settings saved successfully:', result);
      // alert("Display settings saved successfully!"); // Provide user feedback
      toast.success("Display settings saved successfully!");
    } catch (e) {
      // console.error("Error saving Display settings:", e);
      alert(`Error saving Display settings: ${e.message}`);
      toast.error(`Error saving Display settings: ${e.message}`); // Provide user feedback
    } finally {
      setIsLoading(false);
    }
  }, [
    budgetHeaderDateFormat,
    reportVarianceCalculation,
    reportHeaderDateFormatOrg,
    reportHeaderDateFormatProject,
    dropdownListDateFormat,
    reportPrecisionDollar,
    reportPrecisionHour,
    reportPrecisionPercent,
    poLagDays,
    financialStatementCode,
    includeInactiveOrganizations,
    includeInactiveVendors,
    includeEmployeeVendors,
    includeVendorEmployees,
    includeCostOfMoneyRevenueFee,
    displayDetailAccounts,
    includePendingApprovedRequisitions,
    includeUnreleasedBlanketPO,
    pendingChangesReportingMethod,
  ]);

  // 1. Separate the API save call into its own function so both paths can call i

  // States from LaborFormContent
  const [projectBudgetPeriodMethod, setProjectBudgetPeriodMethod] = useState(
    "Accounting Periods ONLY",
  );
  const [unlockEACLastClosedPeriod, setUnlockEACLastClosedPeriod] =
    useState(false);
  const [projectAccountGroupCode, setProjectAccountGroupCode] = useState("");
  const [resourceBudgetCommitFlagDefault, setResourceBudgetCommitFlagDefault] =
    useState(false);
  const [autoPlugCalculation, setAutoPlugCalculation] = useState("On");
  const [
    importBudgetEACsFromExcelCommitFlagDefault,
    setImportBudgetEACsFromExcelCommitFlagDefault,
  ] = useState(false);
  const [timesheetImportHistory, setTimesheetImportHistory] = useState(36); // Default to 36
  const [
    importNewBusinessBudgetFromExcelCommitFlag,
    setImportNewBusinessBudgetFromExcelCommitFlag,
  ] = useState(false);
  const [timesheetScheduleCode, setTimesheetScheduleCode] = useState("");
  const [
    checkTheProjectBudgetEnableSubtaskRowHideOptionByDefault,
    setCheckTheProjectBudgetEnableSubtaskRowHideOptionByDefault,
  ] = useState(false);
  const [laborEscalationMonth, setLaborEscalationMonth] = useState(""); // Initialize as empty for API data
  const [enableProjectHideBudEAC, setEnableProjectHideBudEAC] = useState(false);
  const [laborEscalationValue, setLaborEscalationValue] = useState(""); // Initialize as empty for API data
  const [nonLaborEscalationValue, setNonLaborEscalationValue] = useState(""); // Initialize as empty for API data
  const [vendorEmployeeEscalationValue, setVendorEmployeeEscalationValue] =
    useState(""); // Initialize as empty for API data
  const [showBudEACOnlyDefault, setShowBudEACOnlyDefault] = useState(false);
  const [projectSecurityToBeBasedOn, setProjectSecurityToBeBasedOn] = useState(
    "Project Budget Security",
  );
  const [enableBudgetAutoInspect, setEnableBudgetAutoInspect] = useState(false);
  const [
    allowBUDEACCreationPriorToPeriodClose,
    setAllowBUDEACCreationPriorToPeriodClose,
  ] = useState("Create BUD/EACs based on Current Period");
  const [
    ifLaborSuppressionIsOffDoYouWantToShowEmployeeLaborRatePlanning,
    setIfLaborSuppressionIsOffDoYouWantToShowEmployeeLaborRatePlanning,
  ] = useState("Yes");
  const [defaultBurdenTemplate, setDefaultBurdenTemplate] = useState("DEFAULT");
  const [projectBudgetSequentialLocking, setProjectBudgetSequentialLocking] =
    useState(false);
  const [workforceRule, setWorkforceRule] = useState("Enforce"); // Default value
  const [orgLevelDisplay, setOrgLevelDisplay] = useState(4); // Default value
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [availableProjects, setAvailableProjects] = useState([]); // To store fetched project IDs/
  const [closingPeriod, setClosingPeriod] = useState("");
  // Store initial closing period loaded from DB
  const [initialClosingPeriod, setInitialClosingPeriod] = useState("");

  // Modal visibility & form controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [sendToConfigured, setSendToConfigured] = useState(true);
  const [sendToPM, setSendToPM] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading for projects and config
  const [error, setError] = useState(null);
  const [configValues, setConfigValues] = useState([]);
  const [closingPeriodId, setClosingPeriodId] = useState("");
  const [escalationPercentId, setEscalationPercentId] = useState("");
  const [nonLaborEscalationPercentId, setNonLaborEscalationPercentId] =
    useState("");
  const [vendorEscalationPercentId, setVendorEscalationPercentId] =
    useState("");
  const [escalationMonthId, setEscalationMonthId] = useState("");
  const [isEditableId, setIsEditableId] = useState("");
  const [escalationPercent, setEscalationPercent] = useState("");
  const [nonLaborEscalationPercent, setNonLaborEscalationPercent] =
    useState("");
  const [vendorEscalationPercent, setVendorEscalationPercent] = useState("");
  const [escalationMonth, setEscalationMonth] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [projLoading, setProjLoading] = useState(false);

  // Dynamic API & Dropdown states for Pool Escalations
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [allPoolsData, setAllPoolsData] = useState([]);
  const [poolEscalations, setPoolEscalations] = useState({});
  const [isPoolsLoading, setIsPoolsLoading] = useState(false);

  // Generate Year Options: Current Year - 3 to Current Year + 5

  // Month options mapping numeric values to display text
  const monthOptions = [
    { value: "0", label: "Employee's Anniversary Month" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const workforceRules = ["Enforce", "Do Not Enforce"];

  const handleLaborEscalationValueChange = (value) => {
    // Allow only numbers and a single decimal point (up to 5 decimal places)
    const regex = /^[0-9]*(\.[0-9]{0,5})?$/;
    if (value === "" || regex.test(value)) {
      setLaborEscalationValue(value);
    }
  };
  const handleNonLaborEscalationValueChange = (value) => {
    // Allow only numbers and a single decimal point (up to 5 decimal places)
    const regex = /^[0-9]*(\.[0-9]{0,5})?$/;
    if (value === "" || regex.test(value)) {
      setNonLaborEscalationValue(value);
    }
  };
  const handleVendorEmployeeEscalationValueChange = (value) => {
    // Allow only numbers and a single decimal point (up to 5 decimal places)
    const regex = /^[0-9]*(\.[0-9]{0,5})?$/;
    if (value === "" || regex.test(value)) {
      setVendorEmployeeEscalationValue(value);
    }
  };

  // States from NewTabContent
  const [paidTimeOffExpenseAccount, setPaidTimeOffExpenseAccount] =
    useState("60-100-001");
  const [updateEmployeeHomeOrg, setUpdateEmployeeHomeOrg] = useState(false);
  const [holidayExpenseAccount, setHolidayExpenseAccount] =
    useState("60-100-001");
  const [updateEmployeeAccrualRate, setUpdateEmployeeAccrualRate] =
    useState(false);
  const [ptoCalculationMethod, setPtoCalculationMethod] = useState("Hours");
  const [
    applyProbabilityToNewBusinessBudgets,
    setApplyProbabilityToNewBusinessBudgets,
  ] = useState(false);
  const [defaultPtoAccrualRate, setDefaultPtoAccrualRate] =
    useState("10.000000");
  const [orgBudgetSequentialLocking, setOrgBudgetSequentialLocking] =
    useState(false);
  const [partTimeHolidayCalculation, setPartTimeHolidayCalculation] =
    useState("0.500000");
  const [defaultFeeRate, setDefaultFeeRate] = useState("0.070000");
  const [defaultUtilization, setDefaultUtilization] = useState("0.820000");
  const [laborExpenseOrgLevels, setLaborExpenseOrgLevels] = useState("4");
  const [nonLaborExpenseOrgLevels, setNonLaborExpenseOrgLevels] = useState("4");
  const [orgBudgetRevenueCalculation, setOrgBudgetRevenueCalculation] =
    useState("Project Plus Org Revenue Adjustment");
  const [nlabHistoryMethod, setNlabHistoryMethod] = useState(
    "Populate GL Account History",
  );
  const [isLoading, setIsLoading] = useState(false);

  const [term, setTerm] = useState("");

  const handleNumericInput = (setter) => (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*(\.[0-9]*)?$/;
    if (value === "" || regex.test(value)) {
      setter(value);
    }
  };

  // const projectOptions = availableProjects.map((project) => ({
  //   value: project.projectId,
  //   label: project.name
  //     ? `${project.projectId} - ${project.name}`
  //     : project.projectId,
  // }));

  // useEffect(() => {
  //   const fetchClosingPeriod = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(
  //         `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`
  //       );
  //       if (!res.ok) throw new Error("Failed to fetch closing period");

  //       const data = await res.json(); // 👈 parse JSON
  //       const rawValue = (data?.value || "").trim();
  //       setClosingPeriodId(data?.id || null);
  //       let formattedDate = "";

  //       if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
  //         // Already yyyy-MM-dd
  //         formattedDate = rawValue;
  //       } else if (/^\d{2}-\d{2}-\d{4}$/.test(rawValue)) {
  //         // Convert dd-MM-yyyy → yyyy-MM-dd
  //         const [day, month, year] = rawValue.split("-");
  //         formattedDate = `${year}-${month}-${day}`;
  //       } else if (rawValue) {
  //         // console.warn("Unexpected closing_period format:", rawValue);
  //       }

  //       setClosingPeriod(formattedDate);
  //     } catch (err) {
  //       // console.error("Error fetching closing period:", err);
  //       setClosingPeriod("");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchClosingPeriod();
  // }, []);

  // --- API Fetching for ALL available Project IDs ---

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");

      if (!userString) {
        return {
          userId: "",
          role: "",
          fullName: "",
        };
      }

      const userObj = JSON.parse(userString);

      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
        fullName: userObj.fullName?.toLowerCase() ?? "",
      };
    } catch {
      return {
        userId: "",
        role: "",
        fullName: "",
      };
    }
  };

  const { userId, role } = getCurrentUserContext();

  const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500;

  // ---------------------------------------------------------
  // Fetch Projects
  // ---------------------------------------------------------

  const fetchAllProjects = useCallback(
    async (searchTerm) => {
      if (!searchTerm || searchTerm.length < 4) {
        setAvailableProjects([]);
        setProjLoading(false);
        return;
      }

      setProjLoading(true);
      setError(null);

      try {
        const apiUrl =
          `${backendUrl}/Project/GetAllProjectsForSearchV3` +
          `?UserId=${userId}` +
          `&Role=${role}` +
          `&type=PROJECT` +
          `&ProjId=${encodeURIComponent(searchTerm)}` +
          `&take=${lookupTake}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projects = await response.json();

        setAvailableProjects(Array.isArray(projects) ? projects : []);
      } catch (e) {
        console.error("Failed to load projects:", e);

        setError("Failed to load project list. Please try again.");

        setAvailableProjects([]);
      } finally {
        setProjLoading(false);
      }
    },
    [userId, role, lookupTake],
  );

  // ---------------------------------------------------------
  // Debounced Project Search
  // ---------------------------------------------------------

  const debouncedFetchProjects = useMemo(
    () =>
      debounce((query) => {
        fetchAllProjects(query);
      }, 500),
    [fetchAllProjects],
  );

  useEffect(() => {
    return () => {
      debouncedFetchProjects.cancel();
    };
  }, [debouncedFetchProjects]);

  useEffect(() => {
    const searchTerm = term.trim();

    if (searchTerm.length >= 4) {
      setProjLoading(true);
      debouncedFetchProjects(searchTerm);
    } else {
      debouncedFetchProjects.cancel();

      setAvailableProjects([]);
      setProjLoading(false);
      setError(null);
    }
  }, [term, debouncedFetchProjects]);

  // ---------------------------------------------------------
  // Project Options
  // ---------------------------------------------------------

  const projectOptions = useMemo(() => {
    return availableProjects
      .map((project) => ({
        value: project?.projectId ?? "",
        label: project?.name
          ? `${project.projectId} - ${project.name}`
          : String(project?.projectId ?? ""),
      }))
      .sort((a, b) =>
        (a.label ?? "").localeCompare(b.label ?? "", undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );
  }, [availableProjects]);

  useEffect(() => {
    setIsSearched(!!selectedProjectId);
  }, [selectedProjectId]);

  const handleProjectSelect = (project) => {
    setSelectedProjectId(project.value);
    setTerm(project.value);
    setShowSuggestions(false);
    setAvailableProjects([]);
    setError(null);
  };

  const handleClearProject = () => {
    debouncedFetchProjects.cancel();

    setSelectedProjectId("");
    setTerm("");
    setAvailableProjects([]);
    setShowSuggestions(false);
    setIsSearched(false);
    setError(null);
  };

  const formatDateOnly = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal).split("T")[0];
    return d.toISOString().split("T")[0]; // Returns "2026-05-31"
  };

  useEffect(() => {
    const fetchOrgConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
        );
        if (!res.ok) throw new Error("Failed to fetch organization config");
        const configArray = await res.json();

        // Fetch values by name
        const closingConfig = configArray.find(
          (cfg) => cfg.name === "closing_period",
        );
        const percentConfig = configArray.find(
          (cfg) => cfg.name === "escallation_percent",
        );
        const percentVendorConfig = configArray.find(
          (cfg) => cfg.name === "vendor_escallation_percent",
        );
        const percentNonLaborConfig = configArray.find(
          (cfg) => cfg.name === "nonlabor_escallation_percent",
        );
        const monthConfig = configArray.find(
          (cfg) => cfg.name === "escallation_month",
        );
        const isEditableConfig = configArray.find(
          (cfg) => cfg.name === "isClosedPeriodEditable",
        );
        // <-- Added: Find configuration item matching the unique backend key name
        const emptyBudgetConfig = configArray.find(
          (cfg) => cfg.name === "allow_submission_when_budget_is_empty",
        );
        const emptyEACConfig = configArray.find(
          (cfg) => cfg.name === "allow_submission_when_eac_is_empty",
        );

        setClosingPeriodId(closingConfig?.id || 0);
        setEscalationPercentId(percentConfig?.id || 0);
        setNonLaborEscalationPercentId(percentNonLaborConfig?.id || 0);
        setVendorEscalationPercentId(percentVendorConfig?.id || 0);
        setEscalationMonthId(monthConfig?.id || 0);
        setIsEditableId(isEditableConfig?.id || 0);

        // <-- Added: Track the dynamic backend ID mapping for updates
        setAllowSubmissionWhenBudgetIsEmptyId(emptyBudgetConfig?.id || 0);
        setAllowSubmissionWhenEACIsEmptyId(emptyEACConfig?.id || 0);

        // Format date for input type="date" (yyyy-MM-dd)
        // let formattedDate = "";
        // if (closingConfig?.value) {
        //   const rawValue = closingConfig.value.trim();
        //   if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
        //     formattedDate = rawValue;
        //   } else if (/^\d{2}-\d{2}-\d{4}$/.test(rawValue)) {
        //     const [day, month, year] = rawValue.split("-");
        //     formattedDate = `${year}-${month}-${day}`;
        //   }
        // }
        // setClosingPeriod(formattedDate);
        let formattedDate = "";

        if (closingConfig?.value) {
          const rawValue = closingConfig.value.trim();

          // YYYY-MM-DD → YYYY-MM
          if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
            formattedDate = rawValue.slice(0, 7);
          }
          // DD-MM-YYYY → YYYY-MM
          else if (/^\d{2}-\d{2}-\d{4}$/.test(rawValue)) {
            const [, month, year] = rawValue.split("-");
            formattedDate = `${year}-${month}`;
          }
        }

        setClosingPeriod(formattedDate);
        setInitialClosingPeriod(formattedDate);
        setEscalationPercent(percentConfig?.value || "");
        setNonLaborEscalationPercent(percentNonLaborConfig?.value || "");
        setVendorEscalationPercent(percentVendorConfig?.value || "");
        setEscalationMonth(monthConfig?.value?.toString() || "");
        setIsEditable(isEditableConfig?.value === "true");
        setAllowSubmissionWhenBudgetIsEmpty(
          emptyBudgetConfig?.value === "true",
        );
        setAllowSubmissionWhenEACIsEmpty(emptyEACConfig?.value === "true");
      } catch (err) {
        setClosingPeriod("");
        setInitialClosingPeriod("");
        setEscalationPercent("");
        setNonLaborEscalationPercent("");
        setVendorEmployeeEscalationValue("");
        setEscalationMonth("");
        setIsEditable(false);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgConfig();
  }, []);

  // useEffect(() => {
  //   const fetchAllProjects = async () => {
  //     setLoading(true); // Set loading to true for initial project list fetch
  //     setError(null);
  //     try {
  //       const apiUrl = `${backendUrl}/Project/GetAllProjects`; // Your API endpoint to get ALL projects

  //       const response = await fetch(apiUrl);

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const projects = await response.json();
  //       setAvailableProjects(projects);

  //       // Automatically select the first project if available
  //       if (projects.length > 0) {
  //         setSelectedProjectId(projects[0].id);
  //       } else {
  //         setLoading(false); // No projects to load config for
  //       }
  //     } catch (e) {
  //       // console.error("Failed to fetch project list:", e);
  //       setError(
  //         "Failed to load project list. Please check your API connection.",
  //       );
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllProjects();
  // }, []); // Runs once on component mount to get the list of projects

  useEffect(() => {
    const fetchEscalationData = async () => {
      if (!selectedProjectId) {
        // Reset state if no project selected
        setLaborEscalationMonth("");
        setLaborEscalationValue("");
        setVendorEmployeeEscalationValue("");
        setNonLaborEscalationValue("");
        setWorkforceRule("");
        setConfigValues([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiUrl = `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/${selectedProjectId}`;
        const response = await fetch(apiUrl);

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const fetchedConfigValues = (await response.json()) || [];

        if (fetchedConfigValues.length === 0) {
          // ✅ If nothing in backend, initialize defaults
          const defaults = [
            {
              id: 0,
              name: "escallation_month",
              value: "",
              projId: selectedProjectId,
            },
            {
              id: 0,
              name: "escallation_percent",
              value: "",
              projId: selectedProjectId,
            },
            {
              id: 0,
              name: "vendor_escallation_percent",
              value: "",
              projId: selectedProjectId,
            },
            {
              id: 0,
              name: "non_labor_escallation_percent",
              value: "",
              projId: selectedProjectId,
            },
            { id: 0, name: "workforce", value: "", projId: selectedProjectId },
          ];
          setConfigValues(defaults);
        } else {
          setConfigValues(fetchedConfigValues);
        }

        // Set state for individual fields
        const monthConfig = fetchedConfigValues.find(
          (c) => c.name === "escallation_month",
        );
        const percentConfig = fetchedConfigValues.find(
          (c) => c.name === "escallation_percent",
        );
        const vendorPercentConfig = fetchedConfigValues.find(
          (c) => c.name === "vendor_escallation_percent",
        );
        const nonLaborPercentConfig = fetchedConfigValues.find(
          (c) => c.name === "non_labor_escallation_percent",
        );
        const workforceConfig = fetchedConfigValues.find(
          (c) => c.name === "workforce",
        );

        setLaborEscalationMonth(monthConfig?.value ?? "");
        setLaborEscalationValue(percentConfig?.value ?? "");
        setNonLaborEscalationValue(nonLaborPercentConfig?.value ?? "");
        setVendorEmployeeEscalationValue(vendorPercentConfig?.value ?? "");
        setWorkforceRule(
          workforceConfig?.value != null
            ? String(workforceConfig.value).toLowerCase() === "true"
              ? "Enforce"
              : "Do Not Enforce"
            : "",
        );
      } catch (e) {
        // console.error(
        //   `Failed to fetch config for project ${selectedProjectId}:`,
        //   e
        // );
        setError(
          `Failed to load settings for project ${selectedProjectId}. Please try again.`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEscalationData();
  }, [selectedProjectId]);

  const handleSaveProjectSettings = useCallback(async () => {
    setIsLoading(true);
    if (!selectedProjectId) {
      toast.info("Please select a Project ID to save settings.");
      return;
    }

    const updateApiUrl = `${backendUrl}/api/Configuration/UpdateConfigValues`;
    const nowIsoString = new Date().toISOString();

    let dataToSave = [];

    if (configValues.length > 0) {
      // Map over existing configValues
      dataToSave = configValues.map((config) => {
        let newValue = config.value;

        if (config.name === "escallation_month")
          newValue = String(laborEscalationMonth);
        if (config.name === "escallation_percent")
          newValue = String(laborEscalationValue);
        if (config.name === "vendor_escallation_percent")
          newValue = String(nonLaborEscalationValue);
        if (config.name === "non_labor_escallation_percent")
          newValue = String(vendorEmployeeEscalationValue);
        if (config.name === "workforce")
          newValue = workforceRule === "Enforce" ? "true" : "false";

        return {
          id: config.id || 0, // ✅ always include id
          name: config.name,
          value: newValue,
          createdAt: nowIsoString,
          projId: selectedProjectId,
        };
      });
    } else {
      // ✅ If nothing came from backend, build payload fresh from UI
      dataToSave = [
        {
          id: 0,
          name: "escallation_month",
          value: String(laborEscalationMonth || "0"),
          createdAt: nowIsoString,
          projId: selectedProjectId,
        },
        {
          id: 0,
          name: "escallation_percent",
          value: String(laborEscalationValue || "0"),
          createdAt: nowIsoString,
          projId: selectedProjectId,
        },
        {
          id: 0,
          name: "vendor_escallation_percent",
          value: String(vendorEmployeeEscalationValue || "0"),
          createdAt: nowIsoString,
          projId: selectedProjectId,
        },
        {
          id: 0,
          name: "non_labor_escallation_percent",
          value: String(nonLaborEscalationValue || "0"),
          createdAt: nowIsoString,
          projId: selectedProjectId,
        },
        {
          id: 0,
          name: "workforce",
          value: workforceRule === "Enforce" ? "true" : "false",
          createdAt: nowIsoString,
          projId: selectedProjectId,
        },
      ];
    }

    // console.log("Project Settings Data to Save:", dataToSave);

    try {
      const response = await fetch(updateApiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server error" }));
        throw new Error(errorData.message || response.statusText);
      }

      const result = await response.json();
      // console.log("Project settings saved successfully:", result);
      toast.success("Project settings saved successfully!");
    } catch (e) {
      // console.error("Error saving project settings:", e);
      toast.error(`Error saving project settings: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedProjectId,
    laborEscalationMonth,
    laborEscalationValue,
    nonLaborEscalationValue,
    vendorEmployeeEscalationValue,
    workforceRule,
    configValues,
  ]);

  const getMonthEndDate = (yearMonth) => {
    if (!yearMonth) return "";

    const [year, month] = yearMonth.split("-").map(Number);

    // month is 1-based → Date expects 0-based
    const lastDay = new Date(year, month, 0).getDate();

    return `${year}-${String(month).padStart(2, "0")}-${lastDay}`;
  };

  // const handleSaveOrganizationSettings = useCallback(async () => {
  //   setIsLoading(true);
  //   // if (!selectedProjectId) {
  //   //   alert("Please select a Project ID first.");
  //   //   return;
  //   // }

  //   // console.log("Attempting to save Closing Period...");
  //   if (!closingPeriod) {
  //     toast.error("Please select a Closing Period before saving.");
  //     return;
  //   }

  //   const updateApiUrl = `${backendUrl}/api/Configuration/UpdateConfigValues`;

  //   const nowIsoString = new Date().toISOString();

  //   // Build payload ONLY for closing period
  //   const closingPeriodPayload = [
  //     {
  //       id: closingPeriodId, // 0 = let backend assign, or use existing id if you fetched it
  //       name: "closing_period",
  //       // value: closingPeriod,
  //       //  // <-- your state variable for closing period
  //       value: getMonthEndDate(closingPeriod),
  //       createdAt: nowIsoString,
  //       projId: "xxxxx",
  //     },
  //     {
  //       id: escalationMonthId, // 0 = let backend assign, or use existing id if you fetched it
  //       name: "escallation_month",
  //       value: escalationMonth, // <-- your state variable for closing period
  //       createdAt: nowIsoString,
  //       projId: "xxxxx",
  //     },
  //     {
  //       id: escalationPercentId, // 0 = let backend assign, or use existing id if you fetched it
  //       name: "escallation_percent",
  //       value: escalationPercent, // <-- your state variable for closing period
  //       createdAt: nowIsoString,
  //       projId: "xxxxx",
  //     },
  //     {
  //       id: isEditableId,
  //       name: "isClosedPeriodEditable",
  //       value: isEditable.toString(), // ✅ Boolean → "true"/"false"
  //       createdAt: nowIsoString,
  //       projId: "xxxxx",
  //     },
  //     {
  //       id: allowSubmissionWhenBudgetIsEmptyId, // Passes tracked dynamic ID or 0 if it's new
  //       name: "allow_submission_when_budget_is_empty",
  //       value: allowSubmissionWhenBudgetIsEmpty ? "true" : "false", // ✅ Boolean → "true"/"false"
  //       createdAt: nowIsoString,
  //       projId: "xxxxx",
  //     },
  //     {
  //       id: allowSubmissionWhenEACIsEmptyId, // Passes tracked dynamic ID or 0 if it's new
  //       name: "allow_submission_when_eac_is_empty",
  //       value: allowSubmissionWhenEACIsEmpty ? "true" : "false", // ✅ Boolean → "true"/"false"
  //       createdAt: nowIsoString,
  //       projId: "xxxxx",
  //     },
  //   ];

  //   // console.log("Closing Period Payload:", closingPeriodPayload);

  //   try {
  //     const response = await fetch(updateApiUrl, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(closingPeriodPayload),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response
  //         .json()
  //         .catch(() => ({ message: "Server error" }));
  //       throw new Error(
  //         `Failed to save closing period: ${
  //           errorData.message || response.statusText
  //         }`,
  //       );
  //     }

  //     const result = await response.json();
  //     // console.log("Closing period saved successfully:", result);
  //     toast.success("Setting saved successfully!");
  //     // alert("Closing period saved successfully!");
  //   } catch (e) {
  //     // console.error("Error saving Closing Period:", e);
  //     // alert(`Error saving Closing Period: ${e.message}`);
  //     toast.error(`Error saving Closing Period: ${e.message}`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [
  //   closingPeriod,
  //   escalationMonth,
  //   escalationPercent,
  //   closingPeriodId,
  //   escalationMonthId,
  //   escalationPercentId,
  //   isEditableId,
  //   isEditable,
  //   allowSubmissionWhenBudgetIsEmptyId, // 🌟 Added to callback dependencies
  //   allowSubmissionWhenBudgetIsEmpty,
  //   allowSubmissionWhenEACIsEmptyId, // 🌟 Added to callback dependencies
  //   allowSubmissionWhenEACIsEmpty,
  // ]);

  // 1. Core API call logic
  // 1. Function that performs the API Save

  const executeSaveOrganizationSettings = async () => {
    setIsLoading(true);

    if (!closingPeriod) {
      toast.error("Please select a Closing Period before saving.");
      setIsLoading(false);
      return;
    }

    const updateApiUrl = `${backendUrl}/api/Configuration/UpdateConfigValues`;
    const nowIsoString = new Date().toISOString();

    const closingPeriodPayload = [
      {
        id: closingPeriodId,
        name: "closing_period",
        value: getMonthEndDate(closingPeriod),
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
      {
        id: escalationMonthId,
        name: "escallation_month",
        value: escalationMonth,
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
      {
        id: escalationPercentId,
        name: "escallation_percent",
        value: escalationPercent,
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
      {
        id: nonLaborEscalationPercentId,
        name: "nonlabor_escallation_percent",
        value: escalationPercent,
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
      {
        id: escalationPercentId,
        name: "vendor_escallation_percent",
        value: escalationPercent,
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
      {
        id: isEditableId,
        name: "isClosedPeriodEditable",
        value: isEditable.toString(),
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
      {
        id: allowSubmissionWhenBudgetIsEmptyId,
        name: "allow_submission_when_budget_is_empty",
        value: allowSubmissionWhenBudgetIsEmpty ? "true" : "false",
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
      {
        id: allowSubmissionWhenEACIsEmptyId,
        name: "allow_submission_when_eac_is_empty",
        value: allowSubmissionWhenEACIsEmpty ? "true" : "false",
        createdAt: nowIsoString,
        projId: "xxxxx",
      },
    ];

    try {
      const response = await fetch(updateApiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(closingPeriodPayload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server error" }));
        throw new Error(
          `Failed to save closing period: ${
            errorData.message || response.statusText
          }`,
        );
      }

      toast.success("Setting saved successfully!");

      // --- CHECK CONDITION AFTER SUCCESSFUL SAVE ---
      const isPeriodAdvanced =
        initialClosingPeriod &&
        closingPeriod &&
        initialClosingPeriod < closingPeriod &&
        initialClosingPeriod !== closingPeriod;

      if (isPeriodAdvanced) {
        // Open the modal now that saving is complete
        setIsModalOpen(true);
      } else {
        // Update baseline state since no generation popup is needed
        setInitialClosingPeriod(closingPeriod);
      }
    } catch (e) {
      toast.error(`Error saving Closing Period: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Click handler bound to the Save button
  const handleSaveOrganizationSettings = useCallback(async () => {
    await executeSaveOrganizationSettings();
  }, [
    initialClosingPeriod,
    closingPeriod,
    escalationMonth,
    escalationPercent,
    closingPeriodId,
    escalationMonthId,
    escalationPercentId,
    vendorEscalationPercentId,
    nonLaborEscalationPercentId,
    isEditableId,
    isEditable,
    allowSubmissionWhenBudgetIsEmptyId,
    allowSubmissionWhenBudgetIsEmpty,
    allowSubmissionWhenEACIsEmptyId,
    allowSubmissionWhenEACIsEmpty,
  ]);

  // 3. Modal "Generate" Handler (Only handles batch generate now)
  // Reliable helper to get the last day of the month without timezone shifts
  const getLastDayOfMonth = (dateVal) => {
    if (!dateVal) return "";

    // If dateVal is "2026-06" or "2026-06-01" or ISO string, extract YYYY and MM
    const str = String(dateVal);
    const parts = str.split("T")[0].split("-");

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // 1-indexed (e.g. 6 for June)

    if (isNaN(year) || isNaN(month)) return "";

    // Creating local date: (year, month, 0) gives the LAST day of 'month'
    // Note: Month parameter in Date constructor is 0-indexed, so passing (2026, 6, 0) gives June 30th!
    const lastDay = new Date(year, month, 0);

    const yyyy = lastDay.getFullYear();
    const mm = String(lastDay.getMonth() + 1).padStart(2, "0");
    const dd = String(lastDay.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  // const handleGenerateFromModal = async () => {
  //   setIsGenerating(true);
  //   try {
  //     const payload = {
  //       oldClosingPeriod: getLastDayOfMonth(initialClosingPeriod),
  //       newClosingPeriod: getLastDayOfMonth(closingPeriod),
  //       includeConfigEmail: false,
  //       sendToPM: false,
  //     };

  //     const response = await fetch(`${backendUrl}/Project/ProcessClosePeriod`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     // 1. Check HTTP status FIRST before attempting to download
  //     if (!response.ok) {
  //       const errorData = await response
  //         .json()
  //         .catch(() => ({ message: "Server error during generation" }));

  //       if (errorData.errors) {
  //         const firstError = Object.values(errorData.errors)[0]?.[0];
  //         throw new Error(firstError || "Validation failed on backend");
  //       }

  //       throw new Error(errorData.message || response.statusText);
  //     }

  //     // 2. Extract Binary Blob directly from fetch response
  //     const fileBlob = await response.blob();

  //     // 3. Generate current timestamp (YYYY-MM-DD_HH-mm-ss)
  //     const now = new Date();
  //     const timestamp =
  //       [
  //         now.getFullYear(),
  //         String(now.getMonth() + 1).padStart(2, "0"),
  //         String(now.getDate()).padStart(2, "0"),
  //       ].join("-") +
  //       "_" +
  //       [
  //         String(now.getHours()).padStart(2, "0"),
  //         String(now.getMinutes()).padStart(2, "0"),
  //         String(now.getSeconds()).padStart(2, "0"),
  //       ].join("-");

  //     // 4. Extract or define base filename
  //     let baseName = "Close_Period_Update";
  //     const contentDisposition = response.headers.get("content-disposition"); // Header lookup in fetch uses .get()

  //     if (contentDisposition) {
  //       const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
  //       if (fileNameMatch && fileNameMatch[1]) {
  //         baseName = fileNameMatch[1].replace(/\.[^/.]+$/, "");
  //       }
  //     }

  //     // 5. Construct final filename with timestamp
  //     const fileName = `${baseName}_${timestamp}.docx`;

  //     // 6. Create Object URL and trigger download
  //     const url = window.URL.createObjectURL(fileBlob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", fileName);
  //     document.body.appendChild(link);
  //     link.click();

  //     // 7. Cleanup memory
  //     link.remove();
  //     window.URL.revokeObjectURL(url);

  //     toast.success("Batch generation initiated successfully!");

  //     setInitialClosingPeriod(closingPeriod);
  //     setIsModalOpen(false);
  //   } catch (err) {
  //     toast.error(`Generation failed: ${err.message}`);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const handleGenerateFromModal = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        oldClosingPeriod: getLastDayOfMonth(initialClosingPeriod),
        newClosingPeriod: getLastDayOfMonth(closingPeriod),
        includeConfigEmail: false,
        sendToPM: false,
      };

      const response = await fetch(`${backendUrl}/Project/ProcessClosePeriod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 1. Check HTTP status FIRST before attempting to download
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Server error during generation" }));

        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0]?.[0];
          throw new Error(firstError || "Validation failed on backend");
        }

        throw new Error(errorData.message || response.statusText);
      }

      // 2. Extract Binary Blob directly from fetch response and ensure PDF mime-type
      const rawBlob = await response.blob();
      const fileBlob = new Blob([rawBlob], { type: "application/pdf" });

      // 3. Generate current timestamp (YYYY-MM-DD_HH-mm-ss)
      const now = new Date();
      const timestamp =
        [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, "0"),
          String(now.getDate()).padStart(2, "0"),
        ].join("-") +
        "_" +
        [
          String(now.getHours()).padStart(2, "0"),
          String(now.getMinutes()).padStart(2, "0"),
          String(now.getSeconds()).padStart(2, "0"),
        ].join("-");

      // 4. Extract or define base filename
      let baseName = "Close_Period_Update";
      const contentDisposition = response.headers.get("content-disposition"); // Header lookup in fetch uses .get()

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          baseName = fileNameMatch[1].replace(/\.[^/.]+$/, "");
        }
      }

      // 5. Construct final filename with timestamp and .pdf extension
      const fileName = `${baseName}_${timestamp}.pdf`;

      // 6. Create Object URL and trigger download
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // 7. Cleanup memory
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Batch PDF generation initiated successfully!");

      setInitialClosingPeriod(closingPeriod);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAllSettings = async () => {
    if (activeTab === "projectSettings") {
      await handleSaveProjectSettings();
    } else if (activeTab === "OrganizationSettings") {
      await handleSaveOrganizationSettings();
    } else if (activeTab === "displaySettings") {
      await handleSaveSettings();
    } else if (activeTab === "ratesGlobal") {
      await handleSavePoolEscalations();
    } else if (activeTab === "securityConfiguration") {
      await handleSaveSecurityConfigs();
    }
  };

  // version code
  // Fetch All Version Codes
  const fetchVersionCode = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/Orgnization/GetAllVersionCodes`,
      );
      if (!response.ok) throw new Error("Failed to fetch Version Codes");
      const data = await response.json();
      setVersion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we are on the correct tab to save resources
    if (activeTab === "versionCodeType") {
      fetchVersionCode();
    }
  }, [activeTab]); // This triggers the fetch whenever the tab changes

  // Handle Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();

    if (!newVersion.versionCodeValue) {
      setError("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const method = editingVersion ? "PUT" : "POST";
      const url = editingVersion
        ? `${backendUrl}/Orgnization/UpdateVersionCode/${editingVersion.id}`
        : `${backendUrl}/Orgnization/CreateVersionCode`;

      // Map your state to the expected API payload
      const payload = {
        id: newVersion.id || 0,
        versionCodeValue: newVersion.versionCodeValue,
      };

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(
          `Failed to ${editingVersion ? "update" : "create"} Version Code`,
        );

      // Refresh and close
      await fetchVersionCode();
      closeForm();
      toast.success(
        editingVersion ? "Version Code updated!" : "Version Code created!",
      );
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save");
      toast.error(err.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (version) => {
    if (
      !confirm(`Are you sure you want to delete Version Code "${version.id}"?`)
    )
      return;

    try {
      const response = await fetch(
        `${backendUrl}/Orgnization/DeleteVersionCode/${version.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete Version Code");

      toast.success("Deleted Successfully!!");
      await fetchVersionCode();
    } catch (err) {
      setError(err.message || "Failed to delete");
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVersion((prev) => ({ ...prev, [name]: value }));
  };

  const openForm = (version = null) => {
    setEditingVersion(version);
    setNewVersion({
      id: version?.id || "",
      versionCodeValue: version?.versionCodeValue || "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVersion(null);
    setNewVersion({ id: "", versionCodeValue: "" });
    setError(null);
  };

  // 1. Fetch Templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${backendUrl}/Orgnization/GetAllTemplates`);
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplates(data || []);
        if (data && data.length > 0) {
          setSelectedTemplateId(data[0].id); // Default select the first template
        }
      } catch (err) {
        toast.error(`Error loading templates: ${err.message}`);
      }
    };
    fetchTemplates();
  }, []);

  // 2. Fetch Pools whenever selectedTemplateId changes
  useEffect(() => {
    if (!selectedTemplateId) return;

    const fetchPools = async () => {
      setIsPoolsLoading(true);
      try {
        const res = await fetch(
          `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${selectedTemplateId}`,
        );
        if (!res.ok) throw new Error("Failed to fetch pool data");
        const data = await res.json();
        setAllPoolsData(data || []);
        setPoolEscalations({}); // Reset unsaved local changes on template change
      } catch (err) {
        toast.error(`Error loading pool escalations: ${err.message}`);
      } finally {
        setIsPoolsLoading(false);
      }
    };

    fetchPools();
  }, [selectedTemplateId]);

  // Handle local input changes for pool escalations
  const handleEscPercentChange = (poolId, value, year) => {
    setPoolEscalations((prev) => ({
      ...prev,
      [`${poolId}_${year}`]: value,
    }));
  };

  // Execute Bulk Upsert for Pool Escalations
  const handleSavePoolEscalations = async () => {
    setIsLoading(true);
    try {
      const escalationsArray = [];

      // Determine target years (either the selected single year or all dynamic years)
      const targetYears =
        selectedYear === "all" || selectedYear === ""
          ? yearOptions
          : [selectedYear];

      allPoolsData.forEach((pool) => {
        targetYears.forEach((year) => {
          const key = `${pool.poolId}_${year}`;

          // Get updated local value, existing backend yearly object value, default pool escalation, or 0
          const yearlyObj = pool.escPercent?.find(
            (e) => Number(e.year) === parseInt(year, 10),
          );

          const val =
            poolEscalations[key] ??
            yearlyObj?.escalationPercent ??
            pool.escalationPercent ??
            0;

          escalationsArray.push({
            poolCode: pool.poolId,
            year: parseInt(year, 10),
            escalationPercent: parseFloat(val) || 0,
            modifiedBy: "Admin", // Pass current active user context if applicable
          });
        });
      });

      const payload = { escalations: escalationsArray };

      const res = await fetch(
        `${backendUrl}/Orgnization/BulkUpsertDefaultEscallation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || "Failed to bulk upsert pool escalations",
        );
      }

      toast.success("Pool escalations saved successfully!");

      // Re-fetch updated pools data from backend
      const updatedRes = await fetch(
        `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${selectedTemplateId}`,
      );
      const updatedData = await updatedRes.json();
      setAllPoolsData(updatedData || []);
      setPoolEscalations({});
    } catch (err) {
      toast.error(`Error saving pool escalations: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = availableProjects.filter((project) => {
    const keyword = selectedProjectId ? selectedProjectId.toLowerCase() : "";
    const projectIdMatch =
      typeof project.projectId === "string" &&
      project.projectId.toLowerCase().includes(keyword);
    const nameMatch =
      typeof project.name === "string" &&
      project.name.toLowerCase().includes(keyword);
    return projectIdMatch || nameMatch;
  });

  // if (loading && availableProjects.length === 0 && !error) {
  //   return (
  //     <div className="p-4 text-center text-blue-600">
  //       Loading available projects...
  //     </div>
  //   );
  // }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  // Options for Budget Header Date Format dropdown (from previous iteration)
  const dateFormatOptions = [
    { label: "01/31/09", value: "1" },
    { label: "01/31/2009", value: "2" },
    { label: "01/01-01/31*09", value: "3" },
    { label: "FY09-1", value: "4" },
    { label: "FY09-1-2", value: "5" },
    { label: "01/31/09 (160/176)", value: "6" },
    { label: "01/31/2009 (160/176)", value: "7" },
    { label: "01/01-01/31*09 (160/176)", value: "8" },
    { label: "FY09-1 (160/176)", value: "9" },
    { label: "FY09-1-2 (80/88)", value: "10" },
    { label: "MMM-YY (xxx/xxx)", value: "11" },
    { label: "2009_1_2 (xxx/xxx)", value: "12" },
  ];

  // Options for Report Variance Calculation dropdown (from previous iteration)
  const varianceCalculationOptions = [
    { label: "Actuals", value: "Actuals" },
    { label: "Budgets", value: "Budgets" },
  ];

  // New dropdown options for Report Header Date Format - Project
  const projectDateFormatOptions = [
    { label: "JAN-09", value: "JAN-09" },
    { label: "FEB-09", value: "FEB-09" },
    { label: "MAR-09", value: "MAR-09" },
    { label: "APR-09", value: "APR-09" },
    // Add more options as needed based on actual requirements
  ];

  // New dropdown options for Drop-Down List Date Format
  const dropDownListDateFormatOptions = [
    { label: "01/3109", value: "01/3109" },
    { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
    // Add more options as needed
  ];

  // New dropdown options for Pending Changes Reporting Method
  const pendingChangesReportingMethodOptions = [
    { label: "Exclude From Total Cost", value: "Exclude From Total Cost" },
    { label: "Include In Total Cost", value: "Include In Total Cost" },
    // Add more options as needed
  ];

  return (
    <div className="min-h-screen text-gray-900 flex justify-center">
      {/* Retained w-full px-8 for wider display within its parent */}
      <div className="w-full space-y-2">
        <div className="p-4 flex items-center justify-between bg-white rounded-sm">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Cog size={20} className="text-blue-500" />
            Settings
          </h2>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-sm p-4">
          {/* Tab Navigation */}
          <div className="flex  justify-between items-center">
            <div className="flex gap-x-2">
              <button
                // className={cn(
                //   "py-2 px-4 text-[16px] rounded-lg  focus:outline-none",
                //   activeTab === "OrganizationSettings"
                //     ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
                //     : "text-gray-600 hover:text-gray-800 bg-gray-100",
                // )}
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeTab === "OrganizationSettings"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveTab("OrganizationSettings")}
              >
                Organization Settings
              </button>
              <button
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeTab === "projectSettings"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveTab("projectSettings")}
              >
                Project Settings
              </button>
              {/* <button
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeTab === "displaySettings"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveTab("displaySettings")}
              >
                Display Settings
              </button> */}
              <button
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeTab === "versionCodeType"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveTab("versionCodeType")}
              >
                Configure Version Code
              </button>
              <button
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeTab === "ratesGlobal"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveTab("ratesGlobal")}
              >
                Configure Pool Rate Esc
              </button>

              <button
                type="button"
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === "securityConfiguration"
                    ? "border-b-2 bg-[#17414d] text-white"
                    : "text-gray-600 hover:text-gray-800 bg-gray-100"
                }`}
                onClick={() => setActiveTab("securityConfiguration")}
              >
                Security Configuration
              </button>
            </div>

            {activeTab != "versionCodeType" && isEditableField && (
              <div className="flex justify-end ">
                <button
                  type="button"
                  onClick={handleSaveAllSettings}
                  className="btn1 btn-blue cursor-pointer"
                  disabled={isLoading}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          {activeTab === "OrganizationSettings" && (
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between"></div>
              {/* Changed gap-y-8 back to gap-y-5 for more compact layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* closing period */}
                  <div className="label-input-div">
                    <label htmlFor="closingPeriod" className="input-label">
                      Closing Period <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="closingPeriod"
                      type="month"
                      value={closingPeriod}
                      onChange={(e) => setClosingPeriod(e.target.value)}
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={!isEditableField}
                      // disabled={loading || !selectedProjectId}
                    />
                  </div>

                  {/* Labor Escalation Month */}
                  <div className="label-input-div">
                    <label
                      htmlFor="laborEscalationMonth"
                      className="input-label"
                    >
                      Escalation Month <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="laborEscalationMonth"
                      value={escalationMonth}
                      onChange={(e) => setEscalationMonth(e.target.value)}
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={loading || !isEditableField}
                    >
                      <option value="">Select Option</option>
                      {monthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Labor Escalation Value */}
                  <div className="label-input-div">
                    <label
                      htmlFor="laborEscalationValue"
                      className="input-label"
                    >
                      Labor Escalation Value{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {/* <div className=" "> */}
                    <input
                      id="laborEscalationValue"
                      type="text"
                      value={escalationPercent ? `${escalationPercent}%` : ""}
                      onChange={(e) =>
                        setEscalationPercent(e.target.value.replace("%", ""))
                      }
                      placeholder="0.00000"
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={loading || !isEditableField}
                    />
                    {/* </div> */}
                  </div>
                  {/* Vendor Employee Escalation Value */}
                  <div className="label-input-div">
                    <label
                      htmlFor="vendorEmployeeEscalationValue"
                      className="input-label"
                    >
                      Vendor Employee Escalation Value{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {/* <div className=" "> */}
                    <input
                      id="vendorEmployeeEscalationValue"
                      type="text"
                      value={
                        vendorEscalationPercent
                          ? `${vendorEscalationPercent}%`
                          : ""
                      }
                      onChange={(e) =>
                        setVendorEscalationPercent(
                          e.target.value.replace("%", ""),
                        )
                      }
                      placeholder="0.00000"
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={loading || !isEditableField}
                    />
                    {/* </div> */}
                  </div>
                  {/* Non Labor Escalation Value */}
                  <div className="label-input-div">
                    <label
                      htmlFor="nonLaborEscalationValue"
                      className="input-label"
                    >
                      Non-Labor Escalation Value{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {/* <div className=" "> */}
                    <input
                      id="nonLaborEscalationValue"
                      type="text"
                      value={
                        nonLaborEscalationPercent
                          ? `${nonLaborEscalationPercent}%`
                          : ""
                      }
                      onChange={(e) =>
                        setNonLaborEscalationPercent(
                          e.target.value.replace("%", ""),
                        )
                      }
                      placeholder="0.00000"
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={loading || !isEditableField}
                    />
                    {/* </div> */}
                  </div>

                  <div className="label-input-div">
                    <label htmlFor="isEditableId" className="input-label">
                      Is Closed Period Editable for EAC
                    </label>
                    <div className="flex justify-start w-[60%]">
                      <input
                        id="isEditableId"
                        type="checkbox"
                        checked={isEditable}
                        onChange={(e) => setIsEditable(e.target.checked)}
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={loading || !isEditableField}
                      />
                    </div>
                  </div>

                  <div className="label-input-div">
                    <label
                      htmlFor="allowSubmissionWhenBudgetIsEmpty"
                      className="input-label"
                    >
                      Allow submission when Budget is empty
                    </label>
                    <div className="flex justify-start w-[60%]">
                      <input
                        id="allowSubmissionWhenBudgetIsEmpty"
                        type="checkbox"
                        checked={allowSubmissionWhenBudgetIsEmpty}
                        onChange={(e) =>
                          setAllowSubmissionWhenBudgetIsEmpty(e.target.checked)
                        }
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={loading || !isEditableField}
                      />
                    </div>
                  </div>
                  <div className="label-input-div">
                    <label
                      htmlFor="allowSubmissionWhenEACIsEmpty"
                      className="input-label"
                    >
                      Allow submission when EAC is empty
                    </label>
                    <div className="flex justify-start w-[60%]">
                      <input
                        id="allowSubmissionWhenEACIsEmpty"
                        type="checkbox"
                        checked={allowSubmissionWhenEACIsEmpty}
                        onChange={(e) =>
                          setAllowSubmissionWhenEACIsEmpty(e.target.checked)
                        }
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={loading || !isEditableField}
                      />
                    </div>
                  </div>

                  {/* <div className="label-input-div">
                    <label
                      htmlFor="paidTimeOffExpenseAccount"
                      className="input-label"
                    >
                      Paid Time Off Expense Account{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="paidTimeOffExpenseAccount"
                      type="text"
                      value={paidTimeOffExpenseAccount}
                      onChange={(e) =>
                        setPaidTimeOffExpenseAccount(e.target.value)
                      }
                      className="input-style"
                    />
                  </div> */}

                  {/* Holiday Expense Account */}
                  {/* <div className="label-input-div">
                    <label
                      htmlFor="holidayExpenseAccount"
                      className="input-label"
                    >
                      Holiday Expense Account{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="holidayExpenseAccount"
                      type="text"
                      value={holidayExpenseAccount}
                      onChange={(e) => setHolidayExpenseAccount(e.target.value)}
                      className="input-style"
                    />
                  </div> */}

                  {/* PTO Calculation Method */}
                  {/* <div className="label-input-div">
                    <label
                      htmlFor="ptoCalculationMethod"
                      className="input-label"
                    >
                      PTO Calculation Method{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="ptoCalculationMethod"
                      value={ptoCalculationMethod}
                      onChange={(e) => setPtoCalculationMethod(e.target.value)}
                      className="input-style"
                    >
                      <option key="pto-hours" value="Hours">
                        Hours
                      </option>
                    </select>
                  </div> */}

                  {/* Default PTO Accrual Rate */}
                  {/* <div className="label-input-div">
                    <label
                      htmlFor="defaultPtoAccrualRate"
                      className="input-label"
                    >
                      Default PTO Accrual Rate{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="defaultPtoAccrualRate"
                      type="text"
                      value={defaultPtoAccrualRate}
                      onChange={handleNumericInput(setDefaultPtoAccrualRate)}
                      className="input-style"
                    />
                  </div> */}

                  {/* Part-Time Holiday Calculation % */}
                  {/* <div className="label-input-div">
                    <label
                      htmlFor="partTimeHolidayCalculation"
                      className="input-label"
                    >
                      Part-Time Holiday Calculation %{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="partTimeHolidayCalculation"
                      type="text"
                      value={partTimeHolidayCalculation}
                      onChange={handleNumericInput(
                        setPartTimeHolidayCalculation,
                      )}
                      className="input-style"
                    />
                  </div> */}
                </div>

                {/* Right Column (Checkboxes) */}
                {/* <div className="space-y-4"> */}
                {/* Default Fee Rate */}
                {/* <div className="label-input-div">
                    <label htmlFor="defaultFeeRate" className="input-label">
                      Default Fee Rate <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="defaultFeeRate"
                      type="text"
                      value={defaultFeeRate}
                      onChange={handleNumericInput(setDefaultFeeRate)}
                      className="input-style"
                    />
                  </div> */}
                {/* Default Utilization % */}
                {/* <div className="label-input-div">
                    <label htmlFor="defaultUtilization" className="input-label">
                      Default Utilization %{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="defaultUtilization"
                      type="text"
                      value={defaultUtilization}
                      onChange={handleNumericInput(setDefaultUtilization)}
                      className="input-style"
                    />
                  </div> */}
                {/* Labor Expense Org Level(s) */}
                {/* <div className="label-input-div">
                    <label
                      htmlFor="laborExpenseOrgLevels"
                      className="input-label"
                    >
                      Labor Expense Org Level(s){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="laborExpenseOrgLevels"
                      type="text"
                      value={laborExpenseOrgLevels}
                      onChange={(e) => setLaborExpenseOrgLevels(e.target.value)}
                      className="input-style"
                    />
                  </div> */}
                {/* Non-Labor Expense Org Level(s) */}
                {/* <div className="label-input-div">
                    <label
                      htmlFor="nonLaborExpenseOrgLevels"
                      className="input-label"
                    >
                      Non-Labor Expense Org Level(s){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nonLaborExpenseOrgLevels"
                      type="text"
                      value={nonLaborExpenseOrgLevels}
                      onChange={(e) =>
                        setNonLaborExpenseOrgLevels(e.target.value)
                      }
                      className="input-style"
                    />
                  </div> */}
                {/* Org Budget Revenue Calculation */}
                {/* <div className="label-input-div">
                    <label
                      htmlFor="orgBudgetRevenueCalculation"
                      className="input-label"
                    >
                      Org Budget Revenue Calculation{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="orgBudgetRevenueCalculation"
                      value={orgBudgetRevenueCalculation}
                      onChange={(e) =>
                        setOrgBudgetRevenueCalculation(e.target.value)
                      }
                      className="input-style"
                    >
                      <option
                        key="org-budget-revenue-project-plus-org-revenue"
                        value="Project Plus Org Revenue Adjustment"
                      >
                        Project Plus Org Revenue Adjustment
                      </option>
                    </select>
                  </div> */}
                {/* NLAB $ History Method */}
                {/* <div className="label-input-div">
                    <label htmlFor="nlabHistoryMethod" className="input-label">
                      NLAB $ History Method{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="nlabHistoryMethod"
                      value={nlabHistoryMethod}
                      onChange={(e) => setNlabHistoryMethod(e.target.value)}
                      className="input-style"
                    >
                      <option
                        key="nlab-populate-gl-account-history"
                        value="Populate GL Account History"
                      >
                        Populate GL Account History
                      </option>
                    </select>
                  </div>{" "} */}
                {/* Adjusted space-y to 4 for checkboxes for slightly less spacing */}
                {/* Closed Period Editable */}

                {/* <div className="flex flex-col gap-y-1"> */}
                {/* <div className="flex items-center space-x-2">
                      <input
                        id="isEditableId"
                        type="checkbox"
                        checked={isEditable}
                        onChange={(e) => setIsEditable(e.target.checked)}
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="isEditableId" className="text-sm">
                        Is Closed Period Editable for EAC
                      </label>
                    </div> */}

                {/* Update Employee Home Org */}
                {/* <div className="flex items-center space-x-2">
                      <input
                        id="updateEmployeeHomeOrg"
                        type="checkbox"
                        checked={updateEmployeeHomeOrg}
                        onChange={(e) =>
                          setUpdateEmployeeHomeOrg(e.target.checked)
                        }
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="updateEmployeeHomeOrg"
                        className="text-sm"
                      >
                        Update Employee Home Org
                      </label>
                    </div> */}
                {/* Update Employee Accrual Rate */}
                {/* <div className="flex items-center space-x-2">
                      <input
                        id="updateEmployeeAccrualRate"
                        type="checkbox"
                        checked={updateEmployeeAccrualRate}
                        onChange={(e) =>
                          setUpdateEmployeeAccrualRate(e.target.checked)
                        }
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="updateEmployeeAccrualRate"
                        className="text-sm"
                      >
                        Update Employee Accrual Rate
                      </label>
                    </div> */}
                {/* Apply % Probability to New Business Budgets */}
                {/* <div className="flex items-center space-x-2">
                      <input
                        id="applyProbabilityToNewBusinessBudgets"
                        type="checkbox"
                        checked={applyProbabilityToNewBusinessBudgets}
                        onChange={(e) =>
                          setApplyProbabilityToNewBusinessBudgets(
                            e.target.checked,
                          )
                        }
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="applyProbabilityToNewBusinessBudgets"
                        className="text-sm"
                      >
                        Apply % Probability to New Business Budgets
                      </label>
                    </div> */}
                {/* Org Budget Sequential Locking */}
                {/* <div className="flex items-center space-x-2">
                      <input
                        id="orgBudgetSequentialLocking"
                        type="checkbox"
                        checked={orgBudgetSequentialLocking}
                        onChange={(e) =>
                          setOrgBudgetSequentialLocking(e.target.checked)
                        }
                        className="rounded-md h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="orgBudgetSequentialLocking"
                        className="text-sm"
                      >
                        Org Budget Sequential Locking
                      </label>
                    </div> */}
                {/* </div> */}
                {/* </div> */}

                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Closing Period Updated
                      </h3>

                      <div className="mt-4 space-y-4 text-sm text-gray-600">
                        <p>
                          The closing period was updated from{" "}
                          <span className="font-semibold text-gray-900">
                            {initialClosingPeriod}
                          </span>{" "}
                          to{" "}
                          <span className="font-semibold text-blue-600">
                            {closingPeriod}
                          </span>
                          .
                        </p>
                        <p className="text-xs text-gray-500">
                          Do you want to generate new plan versions for this new
                          closing period?
                        </p>

                        {/* Email Field */}
                        {/* <div className="space-y-1 pt-2">
              <label className="block text-xs font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter additional email address"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div> */}

                        {/* Checkboxes */}
                        {/* <div className="space-y-2 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendToConfigured}
                  onChange={(e) => setSendToConfigured(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs text-gray-700">Send to Configured Email</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendToPM}
                  onChange={(e) => setSendToPM(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs text-gray-700">Send to Project Managers (PMs)</span>
              </label>
            </div> */}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-end space-x-2 border-t pt-3">
                        <button
                          type="button"
                          onClick={handleGenerateFromModal}
                          disabled={isGenerating}
                          className="btn1 btn-blue cursor-pointer"
                        >
                          {isGenerating ? "Generating..." : "Generate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          disabled={isGenerating}
                          className="rounded-full bg-gray-100 cursor-pointer px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "projectSettings" && (
            <div className="p-4">
              <div className="flex items-center justify-between"></div>
              {/* Changed gap-y-8 back to gap-y-5 for more compact layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Project ID Dropdown */}
                  {/* <div>
                    <label
                      htmlFor="projectId"
                      className="block text-sm font-medium"
                    >
                      Project ID <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="projectId"
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="input-style"
                      disabled={loading}
                    >
                      <option key="select-project-placeholder" value="">
                        Select a Project
                      </option>
                      
                      {availableProjects.map((project, index) => (
                        <option
                          key={
                            project.projectId
                              ? String(project.projectId)
                              : `project-idx-${index}`
                          }
                          value={project.projectId}
                        >
                          {project.name
                            ? `${project.projectId} - ${project.name}`
                            : project.id}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  {/* <div className="label-input-div">
                    <label htmlFor="projectId" className="input-label">
                      Project ID <span className="text-red-500">*</span>
                    </label>
                    <Select
                      inputId="projectId"
                      className="w-[60%]"
                      options={projectOptions}
                      isLoading={loading}
                      value={
                        projectOptions.find(
                          (opt) => opt.value === selectedProjectId,
                        ) || null
                      }
                      onChange={(opt) =>
                        setSelectedProjectId(opt ? opt.value : "")
                      }
                      isSearchable
                      placeholder="Search & select a project"
                      menuPlacement="auto"
                      isDisabled={!isEditableField}
                    />
                  </div> */}

                  <div className=" flex items-center gap-2 w-full sm:w-[420px] ">
                    <label
                      htmlFor="projectId"
                      className="input-label mb-1 block"
                    >
                      Project ID
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className="relative w-full max-w-md">
                      <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                      />

                      <input
                        id="projectId"
                        type="text"
                        className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9 w-full"
                        placeholder="Search Project ID or Name..."
                        value={term}
                        onChange={(e) => {
                          setTerm(e.target.value);
                          setSelectedProjectId("");
                          setShowSuggestions(true);
                        }}
                        onFocus={() => {
                          if (term.trim().length >= 4) {
                            setShowSuggestions(true);
                          }
                        }}
                        autoComplete="off"
                      />

                      {/* Clear */}

                      {term && !projLoading && (
                        <button
                          type="button"
                          onClick={handleClearProject}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                          title="Clear"
                        >
                          <X size={15} />
                        </button>
                      )}

                      {/* projLoading */}

                      {projLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                        </div>
                      )}

                      {/* Suggestions */}

                      {showSuggestions &&
                        term.trim().length >= 4 &&
                        !projLoading &&
                        projectOptions.length > 0 && (
                          <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                            {projectOptions.map((project, index) => (
                              <li
                                key={project.value || index}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleProjectSelect(project);
                                }}
                                className="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer border-b last:border-none"
                              >
                                <div className="font-bold text-blue-900">
                                  {project.value}
                                </div>

                                {project.label !== project.value && (
                                  <div className="text-gray-600 truncate">
                                    {project.label.replace(
                                      `${project.value} - `,
                                      "",
                                    )}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                      {/* No Results */}

                      {showSuggestions &&
                        term.trim().length >= 4 &&
                        !projLoading &&
                        projectOptions.length === 0 &&
                        !error && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-xs text-gray-500 shadow-lg">
                            No projects found.
                          </div>
                        )}
                    </div>

                    {/* Helper Text */}

                    {error && (
                      <p className="mt-1 text-[11px] text-red-500">{error}</p>
                    )}
                    {/* : (
                              !selectedProjectId && (
                                <p className="mt-1 text-[11px] text-gray-400">
                                  Enter at least 4 characters to search for a project.
                                </p>
                              )
                            )} */}
                  </div>

                  {/* Project Budget Period Method */}
                  {/* <div>
                    <label
                      htmlFor="projectBudgetPeriodMethod"
                      className="block text-sm font-medium"
                    >
                      Project Budget Period Method{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="projectBudgetPeriodMethod"
                      value={projectBudgetPeriodMethod}
                      onChange={(e) => setProjectBudgetPeriodMethod(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId} // Disable if no project selected
                    >
                      <option
                        key="pbp-accounting-periods-only"
                        value="Accounting Periods ONLY"
                      >
                        Accounting Periods ONLY
                      </option>
                    </select>
                  </div> */}

                  {/* Project Account Group Code */}
                  {/* <div>
                    <label
                      htmlFor="projectAccountGroupCode"
                      className="block text-sm font-medium"
                    >
                      Project Account Group Code
                    </label>
                    <input
                      id="projectAccountGroupCode"
                      type="text"
                      value={projectAccountGroupCode}
                      onChange={(e) => setProjectAccountGroupCode(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    />
                  </div> */}

                  {/* Auto Plug Calculation */}
                  {/* <div>
                    <label
                      htmlFor="autoPlugCalculation"
                      className="block text-sm font-medium"
                    >
                      Auto Plug Calculation <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="autoPlugCalculation"
                      value={autoPlugCalculation}
                      onChange={(e) => setAutoPlugCalculation(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    >
                      <option key="apc-on" value="On">
                        On
                      </option>
                      <option key="apc-off" value="Off">
                        Off
                      </option>
                    </select>
                  </div> */}

                  {/* Timesheet Import History */}
                  {/* <div>
                    <label
                      htmlFor="timesheetImportHistory"
                      className="block text-sm font-medium"
                    >
                      Timesheet Import History
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        id="timesheetImportHistory"
                        type="number"
                        value={timesheetImportHistory}
                        onChange={(e) =>
                          setTimesheetImportHistory(parseInt(e.target.value, 10))
                        }
                        className="w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading || !selectedProjectId}
                      />
                      <span className="ml-2 text-sm text-gray-600">Months</span>
                    </div>
                  </div> */}

                  {/* Timesheet Schedule Code */}
                  {/* <div>
                    <label
                      htmlFor="timesheetScheduleCode"
                      className="block text-sm font-medium"
                    >
                      Timesheet Schedule Code
                    </label>
                    <input
                      id="timesheetScheduleCode"
                      type="text"
                      value={timesheetScheduleCode}
                      onChange={(e) => setTimesheetScheduleCode(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    />
                  </div> */}

                  {/* Labor Escalation Month */}
                  <div className="label-input-div">
                    <label
                      htmlFor="laborEscalationMonth"
                      className="input-label"
                    >
                      Escalation Month <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="laborEscalationMonth"
                      value={laborEscalationMonth}
                      onChange={(e) => setLaborEscalationMonth(e.target.value)}
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={
                        (loading || !selectedProjectId) && !isEditableField
                      }
                    >
                      <option key="lem-select-option" value="">
                        Select Option
                      </option>
                      {monthOptions.map((option) => (
                        // Ensured option.value is a string for key
                        <option key={String(option.value)} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Labor Escalation Value */}
                  <div className="label-input-div">
                    <label
                      htmlFor="laborEscalationValue"
                      className="input-label"
                    >
                      Labor Escalation Value{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {/* <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        %
                      </span> */}
                    <input
                      id="laborEscalationValue"
                      type="text"
                      value={
                        laborEscalationValue ? `${laborEscalationValue}%` : ""
                      }
                      onChange={(e) => {
                        let val = e.target.value.replace("%", ""); // strip % when typing
                        handleLaborEscalationValueChange(val);
                      }}
                      placeholder="0.00000"
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={
                        (loading || !selectedProjectId) && !isEditableField
                      }
                    />
                  </div>
                  {/* Non Labor Escalation Value */}
                  {/* <div className="label-input-div">
                    <label
                      htmlFor="nonLaborEscalationValue"
                      className="input-label"
                    >
                      Non Labor Escalation Value{" "}
                      <span className="text-red-500">*</span>
                    </label>
                   
                    <input
                      id="nonLaborEscalationValue"
                      type="text"
                      value={
                        nonLaborEscalationValue ? `${nonLaborEscalationValue}%` : ""
                      }
                      onChange={(e) => {
                        let val = e.target.value.replace("%", ""); // strip % when typing
                        handleNonLaborEscalationValueChange(val);
                      }}
                      placeholder="0.00000"
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={
                        (loading || !selectedProjectId) && !isEditableField
                      }
                    />
                  </div> */}
                  {/* Vendor Escalation Value */}
                  {/* <div className="label-input-div">
                    <label
                      htmlFor="laborEscalationValue"
                      className="input-label"
                    >
                      Vendor Employee Escalation Value{" "}
                      <span className="text-red-500">*</span>
                    </label>
               
                    <input
                      id="vendorEmployeeEscalationValue"
                      type="text"
                      value={
                        vendorEmployeeEscalationValue ? `${vendorEmployeeEscalationValue}%` : ""
                      }
                      onChange={(e) => {
                        let val = e.target.value.replace("%", ""); // strip % when typing
                        handleVendorEmployeeEscalationValueChange(val);
                      }}
                      placeholder="0.00000"
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={
                        (loading || !selectedProjectId) && !isEditableField
                      }
                    />
                  </div> */}

                  {/* Project Security to be based on */}
                  {/* <div>
                    <label
                      htmlFor="projectSecurityToBeBasedOn"
                      className="block text-sm font-medium"
                    >
                      Project Security to be based on{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="projectSecurityToBeBasedOn"
                      value={projectSecurityToBeBasedOn}
                      onChange={(e) => setProjectSecurityToBeBasedOn(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    >
                      <option
                        key="ps-project-budget-security"
                        value="Project Budget Security"
                      >
                        Project Budget Security
                      </option>
                      <option key="ps-org-id" value="Org ID">
                        Org ID
                      </option>
                    </select>
                  </div> */}

                  {/* Allow BUD/EAC Creation Prior to Period Close */}
                  {/* <div>
                    <label
                      htmlFor="allowBUDEACCreationPriorToPeriodClose"
                      className="block text-sm font-medium"
                    >
                      Allow BUD/EAC creation prior to period close{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="allowBUDEACCreationPriorToPeriodClose"
                      value={allowBUDEACCreationPriorToPeriodClose}
                      onChange={(e) =>
                        setAllowBUDEACCreationPriorToPeriodClose(e.target.value)
                      }
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    >
                      <option
                        key="ace-current-period"
                        value="Create BUD/EACs based on Current Period"
                      >
                        Create BUD/EACs based on Current Period
                      </option>
                      <option
                        key="ace-last-closed-period"
                        value="Create BUD/EACs based on Last Closed Period (Standard function)"
                      >
                        Create BUD/EACs based on Last Closed Period (Standard function)
                      </option>
                    </select>
                  </div> */}

                  {/* If Labor Suppression is off, do you want to show Employee Labor Rate Planning */}
                  {/* <div>
                    <label
                      htmlFor="ifLaborSuppressionIsOffDoYouWantToShowEmployeeLaborRatePlanning"
                      className="block text-sm font-medium"
                    >
                      If Labor Suppression is off, do you want to show Employee Labor
                      Rate Planning?
                    </label>
                    <select
                      id="ifLaborSuppressionIsOffDoYouWantToShowEmployeeLaborRatePlanning"
                      value={
                        ifLaborSuppressionIsOffDoYouWantToShowEmployeeLaborRatePlanning
                      }
                      onChange={(e) =>
                        setIfLaborSuppressionIsOffDoYouWantToShowEmployeeLaborRatePlanning(
                          e.target.value
                        )
                      }
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    >
                      <option key="slrp-yes" value="Yes">
                        Yes
                      </option>
                      <option key="slrp-no" value="No">
                        No
                      </option>
                    </select>
                  </div> */}

                  {/* Default Burden Template */}
                  {/* <div>
                    <label
                      htmlFor="defaultBurdenTemplate"
                      className="block text-sm font-medium"
                    >
                      Default Burden Template <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="defaultBurdenTemplate"
                      type="text"
                      value={defaultBurdenTemplate}
                      onChange={(e) => setDefaultBurdenTemplate(e.target.value)}
                      readOnly
                      className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm cursor-not-allowed"
                      disabled={loading || !selectedProjectId}
                    />
                  </div> */}

                  {/* Workforce Rule */}
                  <div className="label-input-div">
                    <label htmlFor="workforceRule" className="input-label">
                      Workforce Rule <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="workforceRule"
                      value={workforceRule}
                      onChange={(e) => setWorkforceRule(e.target.value)}
                      className={`input-style ${!isEditableField ? "bg-gray-100" : "bg-white"}`}
                      disabled={
                        (loading || !selectedProjectId) && !isEditableField
                      }
                    >
                      {workforceRules.map((rule) => (
                        <option key={rule} value={rule}>
                          {rule}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Org Level Display */}
                  {/* <div>
                    <label
                      htmlFor="orgLevelDisplay"
                      className="block text-sm font-medium"
                    >
                      Org Level Display <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="orgLevelDisplay"
                      type="number"
                      value={orgLevelDisplay}
                      onChange={(e) => setOrgLevelDisplay(parseInt(e.target.value, 10))}
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    />
                  </div> */}
                  {/* closing period */}
                  {/* <div>
                    <label
                      htmlFor="closingPeriod"
                      className="block text-sm font-medium"
                    >
                      Closing Period <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="closingPeriod"
                      type="date"
                      value={closingPeriod}
                      onChange={(e) => setClosingPeriod(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 
                       text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading || !selectedProjectId}
                    />
                  </div> */}
                </div>

                {/* Right Column (Checkboxes) */}
                {/* Adjusted space-y-4 to space-y-5 to match left column if desired, or keep at space-y-4 for slightly tighter checkbox groups */}
                <div className="flex flex-col gap-y-1 ">
                  {" "}
                  {/* Adjusted to space-y-5 for consistency */}
                  {/* Unlock EAC Last Closed Period */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="unlockEACLastClosedPeriod"
                      type="checkbox"
                      checked={unlockEACLastClosedPeriod}
                      onChange={(e) =>
                        setUnlockEACLastClosedPeriod(e.target.checked)
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="unlockEACLastClosedPeriod"
                      className="text-sm"
                    >
                      Unlock EAC Last Closed Period
                    </label>
                  </div> */}
                  {/* Resource Budget Commit Flag Default */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="resourceBudgetCommitFlagDefault"
                      type="checkbox"
                      checked={resourceBudgetCommitFlagDefault}
                      onChange={(e) =>
                        setResourceBudgetCommitFlagDefault(e.target.checked)
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="resourceBudgetCommitFlagDefault"
                      className="text-sm"
                    >
                      Resource Budget Commit Flag Default
                    </label>
                  </div> */}
                  {/* Import Budget/EACs from Excel Commit Flag Default */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="importBudgetEACsFromExcelCommitFlagDefault"
                      type="checkbox"
                      checked={importBudgetEACsFromExcelCommitFlagDefault}
                      onChange={(e) =>
                        setImportBudgetEACsFromExcelCommitFlagDefault(
                          e.target.checked,
                        )
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="importBudgetEACsFromExcelCommitFlagDefault"
                      className="text-sm"
                    >
                      Import Budget/EACs from Excel Commit Flag Default
                    </label>
                  </div> */}
                  {/* Import New Business Budget from Excel Commit Flag */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="importNewBusinessBudgetFromExcelCommitFlag"
                      type="checkbox"
                      checked={importNewBusinessBudgetFromExcelCommitFlag}
                      onChange={(e) =>
                        setImportNewBusinessBudgetFromExcelCommitFlag(
                          e.target.checked,
                        )
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="importNewBusinessBudgetFromExcelCommitFlag"
                      className="text-sm"
                    >
                      Import New Business Budget from Excel Commit Flag
                    </label>
                  </div> */}
                  {/* Check the Project Budget "Enable Subtask Row Hide" option by default */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="checkTheProjectBudgetEnableSubtaskRowHideOptionByDefault"
                      type="checkbox"
                      checked={
                        checkTheProjectBudgetEnableSubtaskRowHideOptionByDefault
                      }
                      onChange={(e) =>
                        setCheckTheProjectBudgetEnableSubtaskRowHideOptionByDefault(
                          e.target.checked,
                        )
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="checkTheProjectBudgetEnableSubtaskRowHideOptionByDefault"
                      className="text-sm"
                    >
                      Check the Project Budget "Enable Subtask Row Hide" option
                      by default
                    </label>
                  </div> */}
                  {/* Enable Project "Hide Bud/EAC" */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="enableProjectHideBudEAC"
                      type="checkbox"
                      checked={enableProjectHideBudEAC}
                      onChange={(e) =>
                        setEnableProjectHideBudEAC(e.target.checked)
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="enableProjectHideBudEAC"
                      className="text-sm"
                    >
                      Enable Project "Hide Bud/EAC"
                    </label>
                  </div> */}
                  {/* Show Budget/EAC Only Default */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="showBudEACOnlyDefault"
                      type="checkbox"
                      checked={showBudEACOnlyDefault}
                      onChange={(e) =>
                        setShowBudEACOnlyDefault(e.target.checked)
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label htmlFor="showBudEACOnlyDefault" className="text-sm">
                      Show Budget/EAC Only Default
                    </label>
                  </div> */}
                  {/* Enable Budget Auto Inspect */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="enableBudgetAutoInspect"
                      type="checkbox"
                      checked={enableBudgetAutoInspect}
                      onChange={(e) =>
                        setEnableBudgetAutoInspect(e.target.checked)
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="enableBudgetAutoInspect"
                      className="text-sm"
                    >
                      Enable Budget Auto Inspect
                    </label>
                  </div> */}
                  {/* Project Budget Sequential Locking */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      id="projectBudgetSequentialLocking"
                      type="checkbox"
                      checked={projectBudgetSequentialLocking}
                      onChange={(e) =>
                        setProjectBudgetSequentialLocking(e.target.checked)
                      }
                      className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={loading || !selectedProjectId}
                    />
                    <label
                      htmlFor="projectBudgetSequentialLocking"
                      className="text-sm"
                    >
                      Project Budget Sequential Locking
                    </label>
                  </div> */}
                </div>
              </div>
            </div>
          )}
          {activeTab === "displaySettings" && (
            <div>
              {/* Changed max-w-5xl to w-full px-8 for wider display */}
              <div className="w-full space-y-2 ">
                {/* Changed text-center to text-left */}
                {/* <div className="p-4  flex items-center justify-between rounded-sm bg-white">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Cog size={20} className="text-blue-500" />
              Display Settings
            </h2>
        </div> */}
                {/* Added bg-gray-50, p-4, rounded-lg, border, and border-gray-300 to the grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-white p-4 rounded-sm">
                  {/* Left Column Fields */}
                  <div className="space-y-4">
                    {" "}
                    {/* No changes to this inner div */}
                    {/* Budget Header Date Format (Existing) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="budgetHeaderDateFormat"
                        className="input-label"
                      >
                        Budget Header Date Format{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="budgetHeaderDateFormat"
                        value={budgetHeaderDateFormat}
                        onChange={(e) =>
                          setBudgetHeaderDateFormat(e.target.value)
                        }
                        className="input-style"
                      >
                        <option value="">Select</option>
                        {dateFormatOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Report Header Date Format - Org (NEW) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="reportHeaderDateFormatOrg"
                        className="input-label"
                      >
                        Report Header Date Format - Org
                      </label>
                      <input
                        id="reportHeaderDateFormatOrg"
                        type="text"
                        value={reportHeaderDateFormatOrg}
                        onChange={(e) =>
                          setReportHeaderDateFormatOrg(e.target.value)
                        }
                        className="input-style"
                      />
                    </div>
                    {/* Report Header Date Format - Project (NEW) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="reportHeaderDateFormatProject"
                        className="input-label"
                      >
                        Report Header Date Format - Project
                      </label>
                      <select
                        id="reportHeaderDateFormatProject"
                        value={reportHeaderDateFormatProject}
                        onChange={(e) =>
                          setReportHeaderDateFormatProject(e.target.value)
                        }
                        className="input-style"
                      >
                        {projectDateFormatOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Drop-Down List Date Format (NEW) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="dropdownListDateFormat"
                        className="input-label"
                      >
                        Drop-Down List Date Format
                      </label>
                      <select
                        id="dropdownListDateFormat"
                        value={dropdownListDateFormat}
                        onChange={(e) =>
                          setDropdownListDateFormat(e.target.value)
                        }
                        className="input-style"
                      >
                        {dropDownListDateFormatOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Report Precision Dollar (NEW) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="reportPrecisionDollar"
                        className="input-label"
                      >
                        Report Precision Dollar
                      </label>
                      <input
                        id="reportPrecisionDollar"
                        type="text" // Using text to allow empty or partial numeric input
                        value={reportPrecisionDollar}
                        onChange={handleNumericInput(setReportPrecisionDollar)}
                        className="input-style"
                      />
                    </div>
                    {/* Report Precision Hour (NEW) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="reportPrecisionHour"
                        className="input-label"
                      >
                        Report Precision Hour
                      </label>
                      <input
                        id="reportPrecisionHour"
                        type="text"
                        value={reportPrecisionHour}
                        onChange={handleNumericInput(setReportPrecisionHour)}
                        className="input-style"
                      />
                    </div>
                    {/* Report Precision Percent (NEW) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="reportPrecisionPercent"
                        className="input-label"
                      >
                        Report Precision Percent{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reportPrecisionPercent"
                        type="text"
                        value={reportPrecisionPercent}
                        onChange={handleNumericInput(setReportPrecisionPercent)}
                        className="input-style"
                      />
                    </div>
                    {/* PO Lag Days (NEW) */}
                    <div className="label-input-div">
                      <label htmlFor="poLagDays" className="input-label">
                        PO Lag Days <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="poLagDays"
                        type="text"
                        value={poLagDays}
                        onChange={handleNumericInput(setPoLagDays)}
                        className="input-style"
                      />
                    </div>
                  </div>

                  {/* Right Column Checkboxes and other fields */}
                  <div className="space-y-4 md:mt-0">
                    {/* Financial Statement Code (NEW) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="financialStatementCode"
                        className="input-label"
                      >
                        Financial Statement Code{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="financialStatementCode"
                        type="text"
                        value={financialStatementCode}
                        onChange={(e) =>
                          setFinancialStatementCode(e.target.value)
                        }
                        className="input-style"
                      />
                    </div>
                    {/* Report Variance Calculation in favor of (Existing) */}
                    <div className="label-input-div">
                      <label
                        htmlFor="reportVarianceCalculation"
                        className="input-label"
                      >
                        Report Variance Calculation in favor of{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="reportVarianceCalculation"
                        value={reportVarianceCalculation}
                        onChange={(e) =>
                          setReportVarianceCalculation(e.target.value)
                        }
                        className="input-style"
                      >
                        <option value="">Select</option>
                        {varianceCalculationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>{" "}
                    <div className="label-input-div">
                      <label
                        htmlFor="pendingChangesReportingMethod"
                        className="input-label"
                      >
                        Pending Changes Reporting Method
                      </label>
                      <select
                        id="pendingChangesReportingMethod"
                        value={pendingChangesReportingMethod}
                        onChange={(e) =>
                          setPendingChangesReportingMethod(e.target.value)
                        }
                        className="input-style"
                      >
                        {pendingChangesReportingMethodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* No changes to this inner div */}
                    {/* Checkboxes */}
                    <div className="flex flex-col gap-y-1">
                      <div className="flex items-center space-x-2">
                        <input
                          id="includeInactiveOrganizations"
                          type="checkbox"
                          checked={includeInactiveOrganizations}
                          onChange={(e) =>
                            setIncludeInactiveOrganizations(e.target.checked)
                          }
                          className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="includeInactiveOrganizations"
                          className="text-sm"
                        >
                          Include Inactive Organizations in Lookups and dropdown
                          lists
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="includeInactiveVendors"
                          type="checkbox"
                          checked={includeInactiveVendors}
                          onChange={(e) =>
                            setIncludeInactiveVendors(e.target.checked)
                          }
                          className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="includeInactiveVendors"
                          className="text-sm"
                        >
                          Include Inactive Vendors in Lookups and dropdown lists
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="includeEmployeeVendors"
                          type="checkbox"
                          checked={includeEmployeeVendors}
                          onChange={(e) =>
                            setIncludeEmployeeVendors(e.target.checked)
                          }
                          className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="includeEmployeeVendors"
                          className="text-sm"
                        >
                          Include Employee Vendors in Vendor Lookups and
                          dropdown lists
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="includeVendorEmployees"
                          type="checkbox"
                          checked={includeVendorEmployees}
                          onChange={(e) =>
                            setIncludeVendorEmployees(e.target.checked)
                          }
                          className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="includeVendorEmployees"
                          className="text-sm"
                        >
                          Include Vendor Employees in Vendor Lookups and
                          dropdown lists
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="includeCostOfMoneyRevenueFee"
                          type="checkbox"
                          checked={includeCostOfMoneyRevenueFee}
                          onChange={(e) =>
                            setIncludeCostOfMoneyRevenueFee(e.target.checked)
                          }
                          className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="includeCostOfMoneyRevenueFee"
                          className="text-sm"
                        >
                          Include Cost of Money Revenue Fee
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="displayDetailAccounts"
                          type="checkbox"
                          checked={displayDetailAccounts}
                          onChange={(e) =>
                            setDisplayDetailAccounts(e.target.checked)
                          }
                          className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="displayDetailAccounts"
                          className="text-sm"
                        >
                          Display Detail Accounts in Active Level Reports and
                          PSR
                        </label>
                      </div>
                    </div>
                    {/* Pending section */}
                    <div className="mt-4">
                      <span className="input-label">Pending</span>
                      <div className="flex flex-col gap-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            id="includePendingApprovedRequisitions"
                            type="checkbox"
                            checked={includePendingApprovedRequisitions}
                            onChange={(e) =>
                              setIncludePendingApprovedRequisitions(
                                e.target.checked,
                              )
                            }
                            className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="includePendingApprovedRequisitions"
                            className="text-sm"
                          >
                            Include Pending/Approved Requisitions
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            id="includeUnreleasedBlanketPO"
                            type="checkbox"
                            checked={includeUnreleasedBlanketPO}
                            onChange={(e) =>
                              setIncludeUnreleasedBlanketPO(e.target.checked)
                            }
                            className="rounded-md  h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="includeUnreleasedBlanketPO"
                            className="text-sm"
                          >
                            Include Unreleased Blanket PO Amount in Pending
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* Pending Changes Reporting Method (NEW) */}
                    {/* <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        className="bg-[#17414d] text-white group-hover:text-gray font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        Save Settings
                      </button>
                    </div> */}
                  </div>
                </div>

                {/* Submit button for this standalone form */}
              </div>
            </div>
          )}
          {activeTab === "versionCodeType" && (
            <div>
              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="input-label text-sm">Configure Version Codes</h2>
                {isEditableField && (
                  <button
                    onClick={() => openForm()}
                    className="btn1 btn-blue flex items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Version Code</span>
                  </button>
                )}
              </div>

              {/* Form Section */}
              {isFormOpen && (
                <div className="mb-6 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">
                      {editingVersion
                        ? `Edit Version: ${editingVersion.id}`
                        : "New Version Code"}
                    </h3>
                    <button
                      onClick={closeForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* <div className="flex flex-col gap-1">
              <label className="input-label">Version Code</label>
              <input
                type="text"
                name="id"
                value={newVersion.id}
                onChange={handleInputChange}
                className="input-style"
                placeholder="e.g., V1, BURDEN_2024"
                required
                disabled={isSubmitting}
              />
            </div> */}
                      <div className="flex flex-col gap-1">
                        <label className="input-label">Version Code</label>
                        <input
                          type="text"
                          name="versionCodeValue"
                          value={newVersion.versionCodeValue}
                          onChange={handleInputChange}
                          className="input-style"
                          placeholder="Enter description..."
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      {/* <div className="flex flex-col gap-1">
              <label className="input-label">Description</label>
              <input
                type="text"
                name="versionCodeValue"
                value={newVersion.versionCodeValue}
                onChange={handleInputChange}
                className="input-style"
                placeholder="Enter description..."
                required
                disabled={isSubmitting}
              />
            </div> */}
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="btn1 btn-blue"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Saving..."
                          : editingVersion
                            ? "Update Version"
                            : "Save Version"}
                      </button>
                      <button
                        type="button"
                        onClick={closeForm}
                        className="btn1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table Section */}
              <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="min-w-full table">
                  <thead className="thead">
                    <tr>
                      <th className="th-thead">Version Code</th>
                      {/* <th className="th-thead">Description</th> */}
                      <th className="th-thead">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="tbody">
                    {version.map((version) => (
                      <tr key={version.id} className="hover:bg-gray-50">
                        {/* <td className="tbody-td">{version.id}</td> */}
                        <td className="tbody-td">{version.versionCodeValue}</td>
                        {/* <td className="tbody-td">{version.versionCodeValue}</td> */}
                        <td className="tbody-td">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openForm(version)}
                              className={`${
                                isEditableField
                                  ? "text-blue-600 hover:text-blue-800"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                              title="Edit"
                              disabled={!isEditableField}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(version)}
                              className={`${
                                isEditableField
                                  ? "text-red-600 hover:text-red-800"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                              title="Delete"
                              disabled={!isEditableField}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {version.length === 0 && (
                      <tr>
                        <td
                          colSpan="3"
                          className="tbody-td text-center py-8 text-gray-500"
                        >
                          No Version Codes found. Click "Add Version Code" to
                          create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "ratesGlobal" && (
            <div className="mt-2">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Pool Escalations (
                  {selectedYear === "" || selectedYear === "all"
                    ? "All Years"
                    : selectedYear}
                  )
                </h2>

                {/* Template & Year Filters */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="templateSelect"
                      className="text-xs font-medium text-gray-700"
                    >
                      Template:
                    </label>
                    <select
                      id="templateSelect"
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className="input-style text-xs py-1 px-2 border rounded"
                      disabled={isPoolsLoading || !isEditableField}
                    >
                      {templates.map((tmpl) => (
                        <option key={tmpl.id} value={tmpl.id}>
                          {tmpl.templateCode} - {tmpl.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="yearSelect"
                      className="text-xs font-medium text-gray-700"
                    >
                      Year:
                    </label>
                    <select
                      id="yearSelect"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="input-style text-xs py-1 px-2 border rounded"
                      disabled={isPoolsLoading}
                    >
                      <option value="all">All Years</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pools Table */}
              {isPoolsLoading ? (
                <div className="p-4 text-center text-sm text-blue-600">
                  Loading Pool Escalations...
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg shadow overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="th-thead font-semibold bg-gray-100 sticky left-0 z-20 px-4 py-2 text-left text-xs">
                          Escalation Year
                        </th>
                        {allPoolsData.map((pool) => (
                          <th
                            key={pool.poolId}
                            className="th-thead text-center px-4 py-2 text-xs"
                          >
                            {pool.groupName || pool.poolId}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="tbody divide-y divide-gray-200">
                      {(selectedYear === "all" || selectedYear === ""
                        ? yearOptions
                        : [selectedYear]
                      ).map((year) => (
                        <tr key={year} className="bg-white">
                          <td className="tbody-td font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 px-4 py-2 text-xs">
                            {year}
                          </td>
                          {allPoolsData.map((pool) => {
                            const yearlyObj = pool.escPercent?.find(
                              (e) => Number(e.year) === parseInt(year, 10),
                            );
                            const escValue =
                              poolEscalations[`${pool.poolId}_${year}`] ??
                              yearlyObj?.escalationPercent ??
                              pool.escalationPercent ??
                              0;

                            return (
                              <td
                                key={`${pool.poolId}_${year}`}
                                className="tbody-td text-center px-2 py-1"
                              >
                                <input
                                  type="number"
                                  step="any"
                                  // className={`table-input text-center w-20 px-2 py-1 border rounded text-xs ${
                                  //   isEditableField ? "bg-white" : "bg-gray-100"
                                  // }`}
                                  className={`table-input text-center w-20 px-2 py-1 border rounded text-xs
    appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none
    ${isEditableField ? "bg-white" : "bg-gray-100"}
  `}
                                  value={escValue}
                                  onChange={(e) =>
                                    handleEscPercentChange(
                                      pool.poolId,
                                      e.target.value,
                                      year,
                                    )
                                  }
                                  disabled={
                                    loading ||
                                    isPoolsLoading ||
                                    !isEditableField
                                  }
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "securityConfiguration" && (
            <div className="relative mt-3 rounded-xl border border-gray-200 bg-white shadow-sm">
              {securityLoading ? (
                <div className="animate-pulse divide-y divide-gray-100">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[320px_1fr] lg:gap-8"
                    >
                      <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-gray-200" />
                        <div className="h-3 w-56 rounded bg-gray-100" />
                      </div>
                      <div className="h-9 w-full max-w-md rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {securityConfigs.map((config) => {
                    const isOn = String(config.value).toLowerCase() === "true";

                    return (
                      <div
                        key={config.name}
                        className="grid grid-cols-1 items-start gap-3 px-5 py-4 transition-colors hover:bg-gray-50/60 lg:grid-cols-[320px_1fr] lg:gap-8"
                      >
                        {/* Left: label + description */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {config.label}
                            </span>

                            <div className="group relative inline-flex ">
                              <button
                                type="button"
                                aria-label={`Explain ${config.label}`}
                                className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-400 transition-colors hover:border-[#17414d] hover:text-[#17414d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17414d]/40"
                              >
                                i
                              </button>
                              <div
                                className="
    pointer-events-none
    absolute left-0 top-6
    z-[9999] hidden
    w-64 max-w-[calc(100vw-3rem)]
    whitespace-normal break-words
    rounded-lg bg-gray-900 p-3
    text-xs leading-5 text-white
    shadow-xl
    group-hover:block
    group-focus-within:block
  "
                              >
                                {config.description}
                              </div>
                            </div>
                          </div>

                          {/* <p className="mt-1 hidden text-xs leading-5 text-gray-500 lg:block">
                  {config.description}
                </p> */}
                        </div>

                        {/* Right: control */}
                        <div className="min-w-0">
                          {config.type === "boolean" ? (
                            <label
                              className={`inline-flex items-center gap-3 ${
                                isEditableField
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-70"
                              }`}
                            >
                              <span className="relative inline-flex shrink-0">
                                <input
                                  type="checkbox"
                                  role="switch"
                                  checked={isOn}
                                  disabled={!isEditableField}
                                  onChange={(e) =>
                                    setSecurityConfigs((previous) =>
                                      previous.map((item) =>
                                        item.name === config.name
                                          ? {
                                              ...item,
                                              value: e.target.checked
                                                ? "true"
                                                : "false",
                                            }
                                          : item,
                                      ),
                                    )
                                  }
                                  className="peer sr-only"
                                />
                                <span className="h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-[#17414d] peer-focus-visible:ring-2 peer-focus-visible:ring-[#17414d]/40 peer-focus-visible:ring-offset-2" />
                                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  isOn
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    isOn ? "bg-emerald-500" : "bg-gray-400"
                                  }`}
                                />
                                {isOn ? "Enabled" : "Disabled"}
                              </span>
                            </label>
                          ) : (
                            <div className="w-full max-w-4xl">
                              {renderSecurityListEditor(config)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit button for the whole form - can be moved inside each tab if needed */}
        {/* <div className="flex justify-end mt-6 h-10">
          <button
            type="button"
            onClick={handleSaveAllSettings}
            className="bg-[#17414d] text-white group-hover:text-gray font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Save Setting
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LaborForm;
