import React, { useState, useEffect } from "react";
import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { backendUrl } from "./config";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Reusable FormField component for consistent layout
const FormField = ({ label, children }) => (
  <div className="label-input-div">
    <label className="input-label">{label}:</label>
    <div className="flex-1 ml-1">{children}</div>
  </div>
);

const SavedBusinessTableDisplay = ({
  allBusinessBudgets,
  onNewBusiness,
  onEditClick,
  onDeleteClick,
  onBackToSearch,
}) => {
  if (!allBusinessBudgets || allBusinessBudgets.length === 0) {
    return (
      <div className="bg-white rounded p-4 text-center">
        <p className="text-gray-600 mb-4">
          No project plan data available to display.
        </p>
      </div>
    );
  }

  // Define table headers matching the second image structure
  const headers = [
    { label: "Export", key: "export" },
    { label: "Project ID", key: "projId" },
    { label: "Project Name", key: "projectName" },
    { label: "BUD/EAC", key: "plType" },
    { label: "Revision", key: "version" },
    { label: "Version Type", key: "versionCode" },
    { label: "Origin", key: "origin" },
    { label: "Submitted", key: "isCompleted" },
    { label: "Approved", key: "isApproved" },
    { label: "Concluded", key: "concluded" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" }, // For Edit/Delete buttons
  ];

  // Helper function to format display values
  const formatValue = (key, value) => {
    if (key === "isCompleted" || key === "isApproved" || key === "concluded") {
      // These appear to be checkboxes in the image
      return (
        <input
          type="checkbox"
          checked={value || false}
          readOnly
          className="accent-blue-600"
          style={{ width: 14, height: 14 }}
        />
      );
    }
    if (key === "export") {
      // Excel export icon
      return (
        <div className="flex justify-center">
          <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">XAyush</span>
          </div>
        </div>
      );
    }
    if (key === "origin") {
      // Display as number, defaulting to 0 if not present
      return String(value || "0");
    }
    // For any other value, display it as string, otherwise empty
    return value !== null && value !== undefined && value !== ""
      ? String(value)
      : "";
  };

  // FIX: Updated sort function for project plans data
  const sortPlans = (a, b) => {
    // Use projId instead of businessBudgetId and handle undefined values
    const idA = a.projId || "";
    const idB = b.projId || "";

    // Basic string comparison for project IDs
    return idA.localeCompare(idB);
  };

  const sortedPlans = [...allBusinessBudgets].sort(sortPlans);

  return (
    <div className="p-2 sm:p-4 space-y-6 text-[11px] sm:text-xs text-gray-800 font-sans max-w-full mx-auto">
      <div className="bg-white rounded  p-2 sm:p-4 mb-4 relative">
        <h2 className="text-xs sm:text-sm font-normal mb-3 font-sans">
          Project Plans
        </h2>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className="px-2 py-2 text-left text-[11px] sm:text-xs font-normal text-gray-700 font-sans"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPlans.map((plan, index) => (
                <tr key={plan.plId || index}>
                  {headers.map((header) => (
                    <td
                      key={header.key}
                      className="px-2 py-2 whitespace-nowrap text-[11px] sm:text-xs font-normal text-gray-900 font-sans"
                    >
                      {header.key === "actions" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onEditClick(plan);
                            }}
                            className="bg-green-600 text-white px-3 py-2 rounded text-[10px] hover:bg-green-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteClick(plan.projId)}
                            className="bg-red-600 text-white px-3 py-2 rounded text-[10px] hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>{formatValue(header.key, plan[header.key])}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NewBusiness = ({
  mode,
  selectedBusiness,
  onClose,
  onSaveSuccess,
  setDataItem,
}) => {
  const [form, setForm] = useState({
    businessBudgetId: "",
    description: "",
    level: "",
    active: false, // Matches isActive from API
    version: "",
    versionCode: "",
    winningProbability: "",
    contractValue: "",
    contractTypes: "",
    startDate: "",
    endDate: "",
    period: "Q1 2024", // Read-only
    weeks: "12", // Read-only
    escalationRate: "",
    orgId: "",
    accountGrp: "", // Matches accountGroup from API
    burdenTemplateId: "",
    pgoCalculation: "",
    pwinValue: "100",
    type: "",
    ourRole: "prime",
    workshare: "",
    trf_ProjId: "",
    status: "",
    revenue: "",

    // NEW FIELDS REQUESTED
    existingProjectId: "",
    sector: "", // To be confirmed with Jakir (Dropdown)
    businessUnit: "", // To be confirmed with Jakir (Dropdown)
    customer: "", // Maps/Syncs with Account Name
    stage: "", // Suggested by Nilesh Sir
    transitionPeriod: "", // Dropdown for days (0, 15, 30, etc.)
    forecastCategory: "", // Dropdown (pipeline, best case, closed, omitted)
    offSiteLaborPercent: "40",
    onsiteLaborPercent: "40",
    nonLaborPercent: "20",
    spreadDuration: "",
  });

  const [viewMode, setViewMode] = useState("form");
  const [allBusinessBudgets, setAllBusinessBudgets] = useState([]);
  const [burdenTemplates, setBurdenTemplates] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedBusiness));
  const [isSaving, setIsSaving] = useState(false);
  const [orgOptions, setOrgOptions] = useState([]);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [revFormulaOptions, setRevFormulaOptions] = useState([]);
  const [ratesData, setRatesData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ACCT_MAP = {
    offSiteLabor: "50-00-98", // Replace with your actual labor account string/ID
    nonLabor: "50-30-01", // Replace with your actual non-billable labor ID
    onsiteLabor: "50-00-01", // Replace with your actual travel/non-labor ID
  };

  const MONTH_MAP = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  // Dropdown Configurations
  const forecastCategoryOptions = [
    { label: "Pipeline", value: "pipeline" },
    { label: "Best Case", value: "best case" },
    { label: "Closed", value: "closed" },
    { label: "Omitted", value: "omitted" },
  ];

  const ourRoleOptions = [
    { label: "Prime", value: "prime" },
    { label: "SubContractor", value: "subcontractor" },
  ];

  const transitionPeriodOptions = [
    { label: "0 Days", value: "0" },
    { label: "15 Days", value: "15" },
    { label: "30 Days", value: "30" },
    { label: "45 Days", value: "45" },
    { label: "60 Days", value: "60" },
    { label: "90 Days", value: "90" },
  ];

  // Placeholder arrays: Update these values after verifying with Jakir & Nilesh Sir
  const sectorOptions = [
    { label: "Sector A", value: "SectorA" },
    { label: "Sector B", value: "SectorB" },
  ];

  const businessUnitOptions = [
    { label: "BU 1", value: "BU1" },
    { label: "BU 2", value: "BU2" },
  ];

  const stageOptions = [
    { label: "01 - Planning", value: "PLANNING" },
    { label: "02 - Positioning", value: "POSTIONING" },
    { label: "03 - Pursuing", value: "PURUING" },
    { label: "04 - Proposal", value: "PROPOSAL" },
    { label: "05 - Post Submit", value: "POSTSUBMIT" },
    { label: "06 - Won", value: "WIN" },
    { label: "07 - Lost", value: "LOSS" },
    { label: "08 - Canceled", value: "CANCELED" },
    { label: "09 - No Bid", value: "NOBID9" },
    { label: "10 - Postponed", value: "POSTPON10" },
    { label: "Lead", value: "LEAD" },
    { label: "Qualified", value: "QUAL" },
    { label: "Capture", value: "CAPTURE" },
    { label: "Proposal Prep", value: "PROPPREP" },
    { label: "Proposal Submitted", value: "PROPSUB" },
    { label: "Negotiation", value: "NEGOTIATE" },
    { label: "Identification", value: "IDENT" },
    { label: "Won", value: "WON" },
    { label: "Lost", value: "LOST" },
    { label: "Cancel", value: "CANCEL" },
    { label: "No Bid", value: "NOBID" },
    { label: "Postponed", value: "POSTPONED" },
    { label: "Review", value: "REVIEW" },
    { label: "In Protest", value: "PROTEST" },
  ];

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [orgRes, accRes, revFormulaRes] = await Promise.all([
          axios.get(`${backendUrl}/Orgnization/GetAllOrgs`),
          axios.get(`${backendUrl}/Project/GetAccountGroupCodes`),
          axios.get(`${backendUrl}/RevFormula`),
        ]);
        setOrgOptions(orgRes.data || []);
        setAccountGroupOptions(accRes.data || []);
        // Map dynamic revenue formula array to standard React-Select format
        if (revFormulaRes.data && Array.isArray(revFormulaRes.data)) {
          setRevFormulaOptions(
            revFormulaRes.data.map((item) => ({
              label: `${item.formulaDesc} (${item.formulaCd})`,
              value: item.formulaCd,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching lookup data", error);
      }
    };
    fetchLookupData();
  }, []);

  useEffect(() => {
    if (!selectedBusiness) return;
    setForm({
      businessBudgetId: selectedBusiness.businessBudgetId || "",
      description: selectedBusiness.description || "",
      level: selectedBusiness.level || "",
      active: selectedBusiness.isActive || false,
      version: selectedBusiness.version || "",
      versionCode: selectedBusiness.versionCode || "",
      winningProbability: selectedBusiness.winningProbability || "",
      contractValue: selectedBusiness.contractValue || "",
      contractTypes: selectedBusiness.contractTypes || "",
      startDate: selectedBusiness.startDate
        ? selectedBusiness.startDate.split("T")[0]
        : "",
      endDate: selectedBusiness.endDate
        ? selectedBusiness.endDate.split("T")[0]
        : "",
      period: "Q1 2024",
      weeks: "12",
      escalationRate: selectedBusiness.escalationRate || "",
      orgId: selectedBusiness.orgId || "",
      accountGrp: selectedBusiness.accountGroup || "",
      burdenTemplateId: selectedBusiness.burdenTemplateId || "",
      pgoCalculation: selectedBusiness.pgoCalculation || "",
      pwinValue: selectedBusiness.pwinValue || "",
      type: selectedBusiness.type || "",
      ourRole: selectedBusiness.ourRole || "",
      workshare: selectedBusiness.ourWorkshare || "",
      revenue: selectedBusiness.revenue || "",

      // Load new fields if they exist from update entity
      existingProjectId: selectedBusiness.existingProjectId || "",
      sector: selectedBusiness.sector || "",
      businessUnit: selectedBusiness.businessUnit || "",
      customer: selectedBusiness.customer || "",
      stage: selectedBusiness.stage || "",
      transitionPeriod: selectedBusiness.transitionPeriod || "",
      forecastCategory: selectedBusiness.forecastCategory || "",
      offSiteLaborPercent: selectedBusiness.offSiteLaborPercent || "",
      onsiteLaborPercent: selectedBusiness.onsiteLaborPercent || "",
      nonLaborPercent: selectedBusiness.nonLaborPercent || "",
      spreadDuration: selectedBusiness.spreadDuration || "",
    });
  }, [selectedBusiness]);

  useEffect(() => {
    const fetchBurdenTemplates = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/Orgnization/GetAllTemplates`,
        );
        if (response.data && Array.isArray(response.data)) {
          setBurdenTemplates(response.data);
        } else {
          toast.error(
            "Failed to fetch burden templates: Unexpected data format.",
          );
        }
      } catch (error) {
        toast.error(`Error fetching burden templates: ${error.message}`);
      }
    };
    fetchBurdenTemplates();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "level" && value !== "") {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 1 || num > 14) {
        toast.error("Level must be between 1 and 14", { autoClose: 2000 });
        return;
      }
    }

    if (name === "version" && value !== "") {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 1 || num > 999) {
        toast.error("Version must be between 1 and 999", { autoClose: 2000 });
        return;
      }
    }

    // 2. Validate individual fields aren't above 100 (e.g., winningProbability)
    if (["winningProbability", "workshare", "pwinValue"].includes(name)) {
      if (Number(value) > 100) {
        toast.error("Percentage cannot be more than 100", { autoClose: 2000 });
        return;
      }
    }

    // 3. Validate COMBINED sum of Labor and ODC allocations
    // if (
    //   ["offSiteLaborPercent", "onsiteLaborPercent", "nonLaborPercent"].includes(
    //     name,
    //   )
    // ) {
    //   const newValue = Number(value) || 0;

    //   // Get current values for the other two fields from the existing form state
    //   const offSite =
    //     name === "offSiteLaborPercent"
    //       ? newValue
    //       : Number(form.offSiteLaborPercent) || 0;
    //   const onSite =
    //     name === "onsiteLaborPercent"
    //       ? newValue
    //       : Number(form.onsiteLaborPercent) || 0;
    //   const nonLabor =
    //     name === "nonLaborPercent"
    //       ? newValue
    //       : Number(form.nonLaborPercent) || 0;

    //   if (offSite + onSite + nonLabor > 100) {
    //     toast.error(
    //       "The total allocation (Direct Labor + Subcontractor + ODCs) cannot exceed 100%",
    //       {
    //         autoClose: 2000,
    //       },
    //     );
    //     return; // Reject change
    //   }
    // }

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // Keep customer account sync logic intact if necessary
      if (name === "customer") {
        updatedForm.customer = value;
      }
      return updatedForm;
    });
  };

  const handleSaveOldWithoutSplit = async () => {
    const offSite = parseFloat(form.offSiteLaborPercent) || 0;
    const onSite = parseFloat(form.onsiteLaborPercent) || 0;
    const nonLabor = parseFloat(form.nonLaborPercent) || 0;
    const totalAllocation = offSite + onSite + nonLabor;

    if (totalAllocation !== 100) {
      toast.error(
        `Total allocation must be exactly 100%. Currently it is ${totalAllocation}%. Please distribute it correctly.`,
        { autoClose: 3000 },
      );
      return; // Block execution and prevent submission
    }

    setIsSaving(true);
    const shortDate = new Date().toISOString().split("T")[0];

    const businessPayload = {
      businessBudgetId: form.businessBudgetId,
      description: form.description,
      level: parseInt(form.level) || 0,
      isActive: form.active,
      version: parseInt(form.version) || 0,
      versionCode: form.versionCode,
      winningProbability: parseFloat(form.winningProbability) || 0,
      contractValue: parseFloat(form.contractValue || ""),
      contractTypes: String(form.contractTypes || ""),
      startDate: form.startDate
        ? `${form.startDate.split("T")[0]}T00:00:00`
        : "0001-01-01T00:00:00",
      endDate: form.endDate
        ? `${form.endDate.split("T")[0]}T00:00:00`
        : "0001-01-01T00:00:00",
      escalationRate: parseFloat(form.escalationRate) || 0,
      // escalationRate: 0,
      orgId: form.orgId || "",
      accountGroup: form.accountGrp || "DIR",
      burdenTemplateId: parseInt(form.burdenTemplateId) || 2,
      modifiedBy: "admin",
      pgoCalculation: parseFloat(form.pgoCalculation || ""),
      pwinValue: parseFloat(form.pwinValue || ""),
      type: form.type || "",
      ourRole: form.ourRole || "",
      workshare: parseFloat(form.workshare || ""),
      trf_ProjId: form.trf_ProjId || form.businessBudgetId,
      status: form.status || "In Progress",
      nbType: "NBBUD",
      revenue: parseFloat(form.revenue) || 0,

      // NEW FIELDS MAPPING
      existingProjectId: form.existingProjectId || "",
      sector: form.sector || "",
      businessUnit: form.businessUnit || "",
      customer: form.customer || "",
      stage: form.stage || "",
      transitionPeriod: parseInt(form.transitionPeriod) || 0,
      forecastCategory: form.forecastCategory || "",
      offSiteLaborPercent: parseFloat(form.offSiteLaborPercent) || 0,
      onsiteLaborPercent: parseFloat(form.onsiteLaborPercent) || 0,
      nonLaborPercent: parseFloat(form.nonLaborPercent) || 0,
      spreadDuration: parseFloat(form.spreadDuration) || 0,
    };

    const projectPayload = {
      projId: form.businessBudgetId,
      plId: 0,
      plType: "NBBUD",
      source: "",
      type: "A",
      version: parseInt(form.version) || 0,
      versionCode: form.versionCode || "",
      finalVersion: false,
      isCompleted: false,
      isApproved: false,
      status: "In Progress",
      createdBy: "User",
      modifiedBy: "User",
      approvedBy: "",
      templateId: parseInt(form.burdenTemplateId) || 2,
      projStartDt: form.startDate ? form.startDate.split("T")[0] : shortDate,
      projEndDt: form.endDate ? form.endDate.split("T")[0] : "2078-01-01",
      revenue: parseFloat(form.revenue) || 0,

      // NEW FIELDS PASSED TO PROJECT
      existingProjectId: form.existingProjectId || "",
      sector: form.sector || "",
      businessUnit: form.businessUnit || "",
      stage: form.stage || "",
      forecastCategory: form.forecastCategory || "",
      revenueFormula: String(form.contractTypes || ""),
    };

    try {
      let response;
      let businessResponse;

      if (isUpdateMode) {
        response = await axios.put(
          `${backendUrl}/UpdateNewBusiness`,
          businessPayload,
          { headers: { "Content-Type": "application/json" } },
        );
        toast.success("Budget details updated successfully!");
      } else {
        businessResponse = await axios.post(
          `${backendUrl}/AddNewBusiness`,
          businessPayload,
          { headers: { "Content-Type": "application/json" } },
        );

        response = await axios.post(
          `${backendUrl}/Project/AddProjectPlan`,
          projectPayload,
          { headers: { "Content-Type": "application/json" } },
        );
      }

      setIsUpdateMode(false);
      handleNewBusinessClick();

      if (onSaveSuccess && businessResponse && mode === "business") {
        await onSaveSuccess(businessResponse.data);
        toast.success("Budget details saved successfully!");
      } else if (onSaveSuccess && response) {
        await onSaveSuccess(response.data);
      }

      onClose();

      // if (!isUpdateMode) {
      //   navigate("/dashboard/nb-project");
      // }
    } catch (error) {
      console.error("Error saving/updating form data:", error);
      toast.error(
        "Failed to save/update budget details. ID exists or check fields.",
      );
      setIsUpdateMode(false);
    } finally {
      setIsSaving(false);
      setDataItem([]);
    }
  };

  const handleSave = async () => {
    if (
      !form.businessBudgetId ||
      !form.description ||
      !form.startDate ||
      !form.contractValue ||
      !form.endDate ||
      !form.orgId ||
      !form.pwinValue ||
      !form.nonLaborPercent ||
      !form.offSiteLaborPercent ||
      !form.onsiteLaborPercent ||
      !form.ourRole ||
      !form.contractTypes
    ) {
      toast.error("Please fill in all required fields marked with *", {
        autoClose: 3000,
      });
      return; // Block execution and prevent submission
    }

    const offSite = parseFloat(form.offSiteLaborPercent) || 0;
    const onSite = parseFloat(form.onsiteLaborPercent) || 0;
    const nonLabor = parseFloat(form.nonLaborPercent) || 0;
    const totalAllocation = offSite + onSite + nonLabor;

    if (totalAllocation !== 100) {
      toast.error(
        `Total allocation must be exactly 100%. Currently it is ${totalAllocation}%. Please distribute it correctly.`,
        { autoClose: 3000 },
      );
      return; // Block execution and prevent submission
    }

    setIsSaving(true);
    const shortDate = new Date().toISOString().split("T")[0];

    const businessPayload = {
      businessBudgetId: form.businessBudgetId,
      description: form.description,
      level: parseInt(form.level) || 0,
      isActive: form.active,
      version: parseInt(form.version) || 0,
      versionCode: form.versionCode,
      winningProbability: parseFloat(form.winningProbability) || 0,
      contractValue: parseFloat(form.contractValue || ""),
      contractTypes: String(form.contractTypes || ""),
      startDate: form.startDate
        ? `${form.startDate.split("T")[0]}T00:00:00`
        : "0001-01-01T00:00:00",
      endDate: form.endDate
        ? `${form.endDate.split("T")[0]}T00:00:00`
        : "0001-01-01T00:00:00",
      escalationRate: parseFloat(form.escalationRate) || 0,
      // escalationRate: 0,
      orgId: form.orgId || "",
      accountGroup: form.accountGrp || "DIR",
      burdenTemplateId: parseInt(form.burdenTemplateId) || 2,
      modifiedBy: "admin",
      pgoCalculation: parseFloat(form.pgoCalculation || ""),
      pwinValue: parseFloat(form.pwinValue || ""),
      type: form.type || "",
      ourRole: form.ourRole || "",
      workshare: parseFloat(form.workshare || ""),
      trf_ProjId: form.trf_ProjId || form.businessBudgetId,
      status: form.status || "In Progress",
      nbType: "NBBUD",
      revenue: parseFloat(form.revenue) || 0,

      // NEW FIELDS MAPPING
      existingProjectId: form.existingProjectId || "",
      sector: form.sector || "",
      businessUnit: form.businessUnit || "",
      customer: form.customer || "",
      stage: form.stage || "",
      transitionPeriod: parseInt(form.transitionPeriod) || 0,
      forecastCategory: form.forecastCategory || "",
      offSiteLaborPercent: parseFloat(form.offSiteLaborPercent) || 0,
      onsiteLaborPercent: parseFloat(form.onsiteLaborPercent) || 0,
      nonLaborPercent: parseFloat(form.nonLaborPercent) || 0,
      spreadDuration: parseFloat(form.spreadDuration) || 0,
    };

    const projectPayload = {
      projId: form.businessBudgetId,
      plId: 0,
      plType: "NBBUD",
      source: "",
      type: "A",
      version: parseInt(form.version) || 0,
      versionCode: form.versionCode || "",
      finalVersion: false,
      isCompleted: false,
      isApproved: false,
      status: "In Progress",
      createdBy: "User",
      modifiedBy: "User",
      approvedBy: "",
      templateId: parseInt(form.burdenTemplateId) || 2,
      projStartDt: form.startDate ? form.startDate.split("T")[0] : shortDate,
      projEndDt: form.endDate ? form.endDate.split("T")[0] : "2078-01-01",
      revenue: parseFloat(form.revenue) || 0,

      // NEW FIELDS PASSED TO PROJECT
      existingProjectId: form.existingProjectId || "",
      sector: form.sector || "",
      businessUnit: form.businessUnit || "",
      stage: form.stage || "",
      forecastCategory: form.forecastCategory || "",
      revenueFormula: String(form.contractTypes || ""),
    };

    try {
      let response;
      let businessResponse;

      if (isUpdateMode) {
        response = await axios.put(
          `${backendUrl}/UpdateNewBusiness`,
          businessPayload,
          { headers: { "Content-Type": "application/json" } },
        );
        toast.success("Budget details updated successfully!");
      } else {
        businessResponse = await axios.post(
          `${backendUrl}/AddNewBusiness`,
          businessPayload,
          { headers: { "Content-Type": "application/json" } },
        );

        response = await axios.post(
          `${backendUrl}/Project/AddProjectPlan`,
          projectPayload,
          { headers: { "Content-Type": "application/json" } },
        );

        const generatedPlId = response.data?.plId;

        if (generatedPlId) {
          toast.info(
            "Budget created. Processing automated financial splits...",
          );
          await handleAutomatedSplitsAndSync(
            generatedPlId,
            form.businessBudgetId,
          );
        }
      }

      setIsUpdateMode(false);
      handleNewBusinessClick();

      if (onSaveSuccess && businessResponse && mode === "business") {
        await onSaveSuccess(businessResponse.data);
        toast.success("Budget details saved successfully!");
      } else if (onSaveSuccess && response) {
        await onSaveSuccess(response.data);
      }

      onClose();

      // if (!isUpdateMode) {
      //   navigate("/dashboard/nb-project");
      // }
    } catch (error) {
      console.error("Error saving/updating form data:", error);
      toast.error(
        "Failed to save/update budget details. ID exists or check fields.",
      );
      setIsUpdateMode(false);
    } finally {
      setIsSaving(false);
      setDataItem([]);
    }
  };

  // const handleAutomatedSplitsAndSync = async (plId, projId) => {
  //   try {
  //     console.log("--- STARTING AUTOMATED SPLITS ---");
  //     console.log("Project Details:", { plId, projId });

  //     const totalContractValue = parseFloat(form.contractValue) || 0;
  //     if (totalContractValue === 0) {
  //       console.warn(
  //         "Contract value is 0 or invalid. Exiting splits calculation.",
  //       );
  //       return;
  //     }

  //     // 1. Calculate PWin Adjusted Value
  //     const pwinPercent = parseFloat(form.pwinValue) || 100;
  //     const adjustedValue = totalContractValue * (pwinPercent / 100);
  //     console.log(`PWin Adjusted Value: ${adjustedValue}`);

  //     // 2. Determine Month Span & Dynamic Calendar Months Array
  //     if (!form.startDate || !form.endDate) {
  //       console.error("Missing Project Start Date or End Date.");
  //       return;
  //     }

  //     const start = new Date(form.startDate);
  //     const end = new Date(form.endDate);

  //     const activeMonthsList = [];
  //     let currentIterDate = new Date(start.getFullYear(), start.getMonth(), 1);

  //     while (currentIterDate <= end) {
  //       activeMonthsList.push({
  //         month: currentIterDate.getMonth() + 1,
  //         year: currentIterDate.getFullYear(),
  //       });
  //       currentIterDate.setMonth(currentIterDate.getMonth() + 1);
  //     }

  //     const totalMonthsCount = activeMonthsList.length;
  //     console.log(`Calculated Total Months Span: ${totalMonthsCount}`);

  //     if (totalMonthsCount === 0) {
  //       console.warn(
  //         "Total months evaluated to 0. Check your Start and End dates.",
  //       );
  //       return;
  //     }

  //     // 3. Split the Adjusted Value equally across all months
  //     const monthlyAllocatedAmount = adjustedValue / totalMonthsCount;

  //     // Parse percentages from the form
  //     const offSitePct = parseFloat(form.offSiteLaborPercent) || 0;
  //     const onSitePct = parseFloat(form.onsiteLaborPercent) || 0;
  //     const nonLaborPct = parseFloat(form.nonLaborPercent) || 0;

  //     // Use the standard ISO short string formatting required by updatedat attributes
  //     const shortDate = new Date().toISOString().split("T")[0];
  //     const templateId = parseInt(form.burdenTemplateId) || 1;
  //     const orgIdString = form.orgId || "LUMINA_CORP";

  //     const defaultHourlyRate = 60;

  //     // 4. Formulate Cost Splits Breakdown per month using configured matching keys
  //     const splitsPerMonth = {
  //       offSiteLabor: monthlyAllocatedAmount * (offSitePct / 100), // Mapped to LAB_ON
  //       onsiteLabor: monthlyAllocatedAmount * (onSitePct / 100), // Mapped to SUB_LAB
  //       nonLabor: monthlyAllocatedAmount * (nonLaborPct / 100), // Mapped to TRAFFIC
  //     };

  //     console.log(`Monthly baseline splits breakdown:`, splitsPerMonth);

  //     const laborGroupsMap = {};
  //     const nonLaborPayloadMap = {};

  //     // Initialize structured parent groups for all keys in ACCT_MAP
  //     Object.keys(ACCT_MAP).forEach((splitType) => {
  //       const acctId = ACCT_MAP[splitType];
  //       const isLabor =
  //         splitType === "offSiteLabor" || splitType === "onsiteLabor";

  //       if (isLabor) {
  //         // Initialize Employee Structured Group
  //         laborGroupsMap[splitType] = {
  //           emplId: "TBD",
  //           firstName: "1",
  //           lastName: "",
  //           type: "Other",
  //           isRev: false,
  //           isBrd: false,
  //           plcGlcCode: "GSA Sr. Writer/Editor I",
  //           perHourRate: 0,
  //           status: "Act",
  //           accId: acctId,
  //           orgId: orgIdString,
  //           plId: plId,
  //           plForecasts: [],
  //           escllationDate: `${new Date().getFullYear()}-01-01`,
  //           esc_Percent: 0,
  //         };
  //       } else {
  //         // Initialize Direct Cost Structured Group matching exactly your requested JSON layout
  //         nonLaborPayloadMap[acctId] = {
  //           dctId: 0,
  //           plId: plId,
  //           acctId: acctId,
  //           orgId: orgIdString,
  //           category: "a",
  //           id: "TBD",
  //           type: "Other",
  //           isRev: false,
  //           isBrd: false,
  //           plcGlc: "GSA Sr. Writer/Editor I",
  //           status: "Act",
  //           createdBy: "System",
  //           lastModifiedBy: "System",
  //           plForecasts: [],
  //         };
  //       }
  //     });

  //     // 5. Generate nested forecasts distributed sequentially across active timeframes
  //     activeMonthsList.forEach(({ month, year }) => {
  //       Object.keys(ACCT_MAP).forEach((splitType) => {
  //         const acctId = ACCT_MAP[splitType];
  //         const allocationAmount = splitsPerMonth[splitType] || 0;
  //         const isLabor =
  //           splitType === "offSiteLabor" || splitType === "onsiteLabor";

  //         if (isLabor) {
  //           const calculatedHours =
  //             allocationAmount > 0 ? allocationAmount / defaultHourlyRate : 0;

  //           laborGroupsMap[splitType].plForecasts.push({
  //             forecastedhours: calculatedHours,
  //             cost: allocationAmount,
  //             projId: projId,
  //             plId: plId,
  //             emplId: "TBD",
  //             month: month,
  //             year: year,
  //             acctId: acctId,
  //             orgId: orgIdString,
  //             plc: "GSA Sr. Writer/Editor I",
  //             hrlyRate: defaultHourlyRate,
  //           });
  //         } else {
  //           nonLaborPayloadMap[acctId].plForecasts.push({
  //             forecastedamt: allocationAmount,
  //             forecastid: 0,
  //             projId: projId,
  //             plId: plId,
  //             emplId: "TBD",
  //             dctId: 0,
  //             month: month,
  //             year: year,
  //             updatedat: shortDate,
  //             acctId: acctId,
  //             orgId: orgIdString,
  //             hrlyRate: 0,
  //             plc: " ",
  //             effectDt: null,
  //           });
  //         }
  //       });
  //     });

  //     // Filter structures to clean away accounts that didn't receive any allocations
  //     const laborPayloads = Object.values(laborGroupsMap).filter((g) =>
  //       g.plForecasts.some((f) => f.forecastedhours > 0),
  //     );
  //     const nonLaborPayloads = Object.values(nonLaborPayloadMap).filter((g) =>
  //       g.plForecasts.some((f) => f.forecastedamt > 0),
  //     );

  //     console.log("--- NESTED FINAL STRUCT PAYLOADS LOG ---");
  //     console.log(
  //       "Labor Payload (Structured Employees Endpoint):",
  //       JSON.stringify(laborPayloads, null, 2),
  //     );
  //     console.log(
  //       "Non-Labor Payload (Structured Direct Cost Endpoint):",
  //       JSON.stringify(nonLaborPayloads, null, 2),
  //     );

  //     // 6. API Calls for Posting Costs
  //     if (laborPayloads.length > 0) {
  //       await axios.post(
  //         `${backendUrl}/Employee/AddNewEmployees?plid=${plId}&templateid=${templateId}`,
  //         laborPayloads,
  //         { headers: { "Content-Type": "application/json" } },
  //       );
  //     }

  //     if (nonLaborPayloads.length > 0) {
  //       await axios.post(
  //         `${backendUrl}/DirectCost/AddNewDirectCosts?plid=${plId}&templateid=${templateId}`,
  //         nonLaborPayloads,
  //         { headers: { "Content-Type": "application/json" } },
  //       );
  //     }

  //     // 7. API Call for Posting Revenues spread across months
  //     const revPayload = activeMonthsList.map(({ month, year }) => ({
  //       fy_Cd: year,
  //       period: month,
  //       revAmt: monthlyAllocatedAmount,
  //     }));

  //     console.log("Revenue Payload:", JSON.stringify(revPayload, null, 2));

  //     await axios.post(
  //       `${backendUrl}/ProjRevWrkPd/AddRevenueForNB?pl_id=${plId}&proj_id=${projId}`,
  //       revPayload,
  //       { headers: { "Content-Type": "application/json" } },
  //     );

  //     console.log("--- ALL OPERATIONS COMPILED AND SYNCED SUCCESSFULLY ---");
  //     toast.success("Automated monthly split sync processing complete!");
  //   } catch (err) {
  //     console.error("CRITICAL Sync Error encountered:", err);
  //     toast.error(`Auto-split calculation fallback: ${err.message}`);
  //   }
  // };

  useEffect(() => {
    const fetchAllRatesTogether = async () => {
      // Only attempt fetch if all required parameters are populated
      if (!form.orgId || !form.startDate || !form.endDate) {
        return;
      }

      try {
        setLoading(true);

        // 1. Build the array of account IDs directly from ACCT_MAP
        const accountIds = Object.values(ACCT_MAP); // ["50.01.01", "50.24.01", "50.26.01"]

        // 2. Format start and end dates to YYYY-MM-DD
        const formattedStart = form.startDate.split("T")[0];
        const formattedEnd = form.endDate.split("T")[0];

        // 3. Construct the JSON payload
        const payload = {
          accountIds: accountIds,
          orgId: form.orgId,
          startDate: formattedStart,
          endDate: formattedEnd,
        };

        // 4. Perform the POST request
        //  const response = await fetch(`${backendUrl}/GetAverageIndirectRates`, {
        const response = await fetch(`${backendUrl}/GetAverageIndirectRates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          setRatesData(data);
        } else {
          console.error(
            "Failed to fetch indirect rates with status:",
            response.status,
          );
        }
      } catch (err) {
        console.error("Failed to fetch account rates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRatesTogether();
  }, [form.orgId, form.startDate, form.endDate]);

  const getRawLaborCost = (burdenedCost, rates = {}) => {
    const { fringe = 0, overhead = 0, gna = 0, hr = 0, mnh = 0 } = rates;
    const multiplier =
      (1 + fringe / 100) *
      (1 + overhead / 100) *
      (1 + gna / 100) *
      (1 + hr / 100) *
      (1 + mnh / 100);
    if (isNaN(multiplier) || multiplier <= 0) return burdenedCost;
    return Number((burdenedCost / multiplier).toFixed(2));
  };

  const calculateCostByAccountType = (
    accountKey,
    burdenedCost,
    rateToggles = {
      fringe: true,
      overhead: true,
      gna: true,
      hr: true,
      mnh: true,
    },
  ) => {
    const accountId = ACCT_MAP[accountKey];

    const rateInfo = Array.isArray(ratesData)
      ? ratesData.find(
          (item) => item.accountId === accountId || item.acctId === accountId,
        )
      : ratesData?.[accountId];

    if (!rateInfo) {
      return burdenedCost;
    }

    // Extract all rate values based on flags
    const fringe = rateToggles.fringe ? rateInfo.fringeRate || 0 : 0;
    const overhead = rateToggles.overhead ? rateInfo.overheadRate || 0 : 0;
    const gna = rateToggles.gna ? rateInfo.gnaRate || 0 : 0;
    const hr = rateToggles.hr ? rateInfo.hrRate || 0 : 0;
    const mnh = rateToggles.mnh ? rateInfo.mnhRate || 0 : 0;

    // Pass all rates to your calculation helper
    return getRawLaborCost(burdenedCost, { fringe, overhead, gna, hr, mnh });
  };

  const handleAutomatedSplitsAndSync = async (plId, projId) => {
    try {
      console.log("--- STARTING AUTOMATED SPLITS ---");
      console.log("Project Details:", { plId, projId });

      const totalContractValue = parseFloat(form.contractValue) || 0;
      if (totalContractValue === 0) {
        console.warn(
          "Contract value is 0 or invalid. Exiting splits calculation.",
        );
        return;
      }

      // 1. Calculate PWin Adjusted Value
      const pwinPercent = parseFloat(form.pwinValue) || 100;
      const adjustedValue = totalContractValue * (pwinPercent / 100);
      console.log(`PWin Adjusted Value: ${adjustedValue}`);

      // 2. Determine Month Span & Dynamic Calendar Months Array
      if (!form.startDate || !form.endDate) {
        toast.error("Missing Project Start Date or End Date.");
        return;
      }

      const startStr = form.startDate.split("T")[0];
      const endStr = form.endDate.split("T")[0];

      // Fetch dynamic calendar configuration boundaries and escalation variables simultaneously
      console.log(
        "Fetching working hours calendar definitions & escalation configs...",
      );
      let workingHoursMap = {};
      let escMonth = "1";
      let escPercent = 0;

      try {
        const [hoursResponse, configResponse] = await Promise.all([
          axios.get(
            `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startStr}/${endStr}`,
          ),
          axios.get(
            `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
          ),
        ]);

        if (hoursResponse.data && Array.isArray(hoursResponse.data)) {
          hoursResponse.data.forEach((item) => {
            const key = `${item.year}-${item.monthNo}`;
            workingHoursMap[key] = parseFloat(item.workingHours) || 168;
          });
        }

        if (configResponse.data && Array.isArray(configResponse.data)) {
          const monthConfig = configResponse.data.find(
            (c) => c.name === "escallation_month",
          );
          const percentConfig = configResponse.data.find(
            (c) => c.name === "escallation_percent",
          );
          if (monthConfig) escMonth = monthConfig.value;
          if (percentConfig) escPercent = parseFloat(percentConfig.value) || 0;
        }
      } catch (apiErr) {
        console.warn(
          "External configuration APIs failed. Using fallback defaults.",
          apiErr,
        );
      }

      const [startYear, startMonth, startDay] = form.startDate
        .split("-")
        .map(Number);
      const [endYear, endMonth, endDay] = form.endDate.split("-").map(Number);

      const activeMonthsList = [];
      let currentIterDate = new Date(startYear, startMonth - 1, 1);
      const limitDate = new Date(endYear, endMonth - 1, 1);

      while (currentIterDate <= limitDate) {
        activeMonthsList.push({
          month: currentIterDate.getMonth() + 1,
          year: currentIterDate.getFullYear(),
        });
        currentIterDate.setMonth(currentIterDate.getMonth() + 1);
      }

      const totalMonthsCount = activeMonthsList.length;
      console.log(`Calculated Total Months Span: ${totalMonthsCount}`);

      if (totalMonthsCount === 0) {
        console.warn(
          "Total months evaluated to 0. Check your Start and End dates.",
        );
        return;
      }

      // --- CALCULATE GRAND TOTAL HOURS ACROSS ENTIRE PERIOD ---
      let grandTotalHours = 0;
      activeMonthsList.forEach(({ month, year }) => {
        const hoursKey = `${year}-${month}`;
        grandTotalHours += workingHoursMap[hoursKey] || 168;
      });
      console.log(`Grand Total Period Working Hours: ${grandTotalHours}`);

      // 3. Split the Adjusted Value equally across all months
      const monthlyAllocatedAmount = adjustedValue / totalMonthsCount;

      // Parse percentages from the form
      const offSitePct = parseFloat(form.offSiteLaborPercent) || 0;
      const onSitePct = parseFloat(form.onsiteLaborPercent) || 0;
      const nonLaborPct = parseFloat(form.nonLaborPercent) || 0;

      const shortDate = new Date().toISOString().split("T")[0];
      const templateId = parseInt(form.burdenTemplateId) || 2;
      const orgIdString = form.orgId || "LUMINA_CORP";

      const defaultHourlyRate = 60;

      // 1. Parse escalation percentage from config or form input
      const escalationRate = parseFloat(form.escalationRate) || escPercent || 0; // e.g., 2 for 2%

      // 2. Compute monthly labor amounts AFTER deducting escalation
      const rawOffSiteMonthly = monthlyAllocatedAmount * (offSitePct / 100);
      const rawOnSiteMonthly = monthlyAllocatedAmount * (onSitePct / 100);
      const rawNonLaborMonthly = monthlyAllocatedAmount * (nonLaborPct / 100);

      const splitsPerMonth = {
        // Deduct escalation percentage (e.g., $16,000 - 2% = $15,680)
        offSiteLabor: rawOffSiteMonthly * (1 - escalationRate / 100),
        onsiteLabor: rawOnSiteMonthly * (1 - escalationRate / 100),
        nonLabor: rawNonLaborMonthly * (1 - escalationRate / 100), // Non-labor remains unadjusted
      };

      // const fringeRate = 28.3850145;
      // const overheadRate = 17.42382717;
      // const gnaRate = 25.71784183;

      // 3. Overall Totals using base (un-escalated) labor figures
      // const overallTotals = {
      //   offSiteLabor: splitsPerMonth.offSiteLabor * totalMonthsCount, // $15,680 * 3 = $47,040
      //   onsiteLabor: splitsPerMonth.onsiteLabor * totalMonthsCount, // $9,408 * 3 = $28,224
      // };

      const overallTotals = {
        offSiteLaborBurdened: splitsPerMonth.offSiteLabor * totalMonthsCount,
        onsiteLaborBurdened: splitsPerMonth.onsiteLabor * totalMonthsCount,
        nonLaborBurdened: splitsPerMonth.nonLabor * totalMonthsCount,

        // offSiteLabor: getRawLaborCost(
        //   splitsPerMonth.offSiteLabor * totalMonthsCount,
        //   fringeRate,
        //   overheadRate,
        //   gnaRate,
        // ),
        // onsiteLabor: getRawLaborCost(
        //   splitsPerMonth.onsiteLabor * totalMonthsCount,
        //   0,
        //   0,
        //   gnaRate,
        // ),
        // nonLabor: getRawLaborCost(
        //   splitsPerMonth.nonLabor * totalMonthsCount,
        //   0,
        //   0,
        //   gnaRate,
        // ),
        offSiteLabor: calculateCostByAccountType(
          "offSiteLabor",
          splitsPerMonth.offSiteLabor * totalMonthsCount,
          {
            fringe: true,
            overhead: true,
            gna: true,
            hr: true,
            mnh: true,
          },
        ),
        onsiteLabor: calculateCostByAccountType(
          "onsiteLabor",
          splitsPerMonth.onsiteLabor * totalMonthsCount,
          {
            fringe: true,
            overhead: true,
            gna: true,
            hr: true,
            mnh: true,
          },
        ),
        nonLabor: calculateCostByAccountType(
          "nonLabor",
          splitsPerMonth.nonLabor * totalMonthsCount,
          {
            fringe: true,
            overhead: true,
            gna: true,
            hr: true,
            mnh: true,
          },
        ),
      };

      // 4. Fixed Hourly Rates calculated against un-escalated budgets
      const overallRates = {
        offSiteLabor:
          grandTotalHours > 0
            ? overallTotals.offSiteLabor / grandTotalHours
            : 0, // $47,040 / 504 = $93.33333333
        onsiteLabor:
          grandTotalHours > 0 ? overallTotals.onsiteLabor / grandTotalHours : 0, // $28,224 / 504 = $56.00000000
      };

      // 4. Formulate Cost Splits Breakdown per month using configured matching keys
      // const splitsPerMonth = {
      //   offSiteLabor: monthlyAllocatedAmount * (offSitePct / 100), // Mapped to LAB_ON
      //   onsiteLabor: monthlyAllocatedAmount * (onSitePct / 100), // Mapped to SUB_LAB
      //   nonLabor: monthlyAllocatedAmount * (nonLaborPct / 100), // Mapped to TRAFFIC
      // };

      // Calculate OVERALL Project-wide Total Budget Caps for each Category
      // const overallTotals = {
      //   offSiteLabor: splitsPerMonth.offSiteLabor * totalMonthsCount,
      //   onsiteLabor: splitsPerMonth.onsiteLabor * totalMonthsCount,
      // };

      // const overallTotals = {
      //   offSiteLabor: splitsPerMonth.offSiteLabor * totalMonthsCount,
      //   onsiteLabor: splitsPerMonth.onsiteLabor * totalMonthsCount,
      // };

      // const overallRates = {
      //   offSiteLabor:
      //     grandTotalHours > 0
      //       ? overallTotals.offSiteLabor / grandTotalHours
      //       : 0,

      //   onsiteLabor:
      //     grandTotalHours > 0 ? overallTotals.onsiteLabor / grandTotalHours : 0,
      // };

      console.log("Overall Labor Budgets", overallTotals);
      console.log("Overall Hourly Rates", overallRates);

      // --- CRITICAL OVERALL HOURLY RATE CALCULATIONS ---
      // const overallRates = {
      //   offSiteLabor:
      //     grandTotalHours > 0
      //       ? overallTotals.offSiteLabor / grandTotalHours
      //       : defaultHourlyRate,
      //   onsiteLabor:
      //     grandTotalHours > 0
      //       ? overallTotals.onsiteLabor / grandTotalHours
      //       : defaultHourlyRate,
      // };

      console.log(`Calculated Fixed Overall Hourly Rates:`, overallRates);

      const laborResourceTracks = {};
      const nonLaborPayloadMap = {};

      // Helper method updated to assign the calculated flat rate to the parent object right away
      const ensureSingleLaborResourceExists = (splitType, acctId) => {
        if (!laborResourceTracks[splitType]) {
          const paddedEscMonth = String(escMonth).padStart(2, "0");
          const finalFlatRate = overallRates[splitType] || defaultHourlyRate;

          laborResourceTracks[splitType] = {
            emplId: "TBD",
            firstName:
              splitType === "offSiteLabor"
                ? "Direct Labor Baseline"
                : "Subcontractor Labor Baseline",
            lastName: "",
            type: "Other",
            isRev: true,
            isBrd: true,
            plcGlcCode: "E15",
            perHourRate: parseFloat(finalFlatRate.toFixed(4)), // Fixed Overall Rate assigned on parent
            status: "Act",
            accId: acctId,
            orgId: orgIdString,
            plId: plId,
            plForecasts: [],
            escllationDate: `${startYear + 1}-${paddedEscMonth}-01`,
            esc_Percent: form.escalationRate || escPercent,
            // esc_Percent: 0,
          };
        }
        return laborResourceTracks[splitType];
      };

      // Initialize structured parent groups for non-labor entities upfront
      Object.keys(ACCT_MAP).forEach((splitType) => {
        const acctId = ACCT_MAP[splitType];
        const isLabor =
          splitType === "offSiteLabor" || splitType === "onsiteLabor";

        if (!isLabor) {
          nonLaborPayloadMap[acctId] = {
            dctId: 0,
            plId: plId,
            acctId: acctId,
            orgId: orgIdString,
            category: "A",
            id: "TBD",
            type: "Other",
            isRev: true,
            isBrd: true,
            plcGlc: "",
            status: "Act",
            createdBy: "System",
            lastModifiedBy: "System",
            plForecasts: [],
          };
        }
      });

      // 5. Generate forecasts across timeframes utilizing calculated flat hourly rate metrics
      activeMonthsList.forEach(({ month, year }) => {
        const hoursKey = `${year}-${month}`;
        const maxWorkingHours = workingHoursMap[hoursKey] || 168;

        Object.keys(ACCT_MAP).forEach((splitType) => {
          const acctId = ACCT_MAP[splitType];
          const allocationAmount = splitsPerMonth[splitType] || 0;
          const isLabor =
            splitType === "offSiteLabor" || splitType === "onsiteLabor";

          if (isLabor) {
            const currentResource = ensureSingleLaborResourceExists(
              splitType,
              acctId,
            );

            const flatHourlyRate = overallRates[splitType];

            const hoursToAssign = maxWorkingHours;

            let calculatedCost = hoursToAssign * flatHourlyRate;

            // Last month adjustment
            const isLastMonth =
              month === activeMonthsList[activeMonthsList.length - 1].month &&
              year === activeMonthsList[activeMonthsList.length - 1].year;

            if (isLastMonth) {
              const existingTotal = currentResource.plForecasts.reduce(
                (sum, x) => sum + x.cost,
                0,
              );

              calculatedCost = overallTotals[splitType] - existingTotal;
            }

            calculatedCost = parseFloat(calculatedCost.toFixed(2));

            // const flatHourlyRate = overallRates[splitType] || defaultHourlyRate;

            // // Monthly breakdown calculation based strictly on calculated overarching timeline rate
            // const hoursToAssign = maxWorkingHours;
            // const calculatedCost = hoursToAssign * flatHourlyRate;

            currentResource.plForecasts.push({
              forecastedhours: parseFloat(hoursToAssign.toFixed(2)),
              cost: calculatedCost, // Cleanly aligns with months hours * global rate
              projId: projId,
              plId: plId,
              emplId: currentResource.emplId,
              month: month,
              year: year,
              acctId: acctId,
              orgId: orgIdString,
              plc: "E15",
              hrlyRate: parseFloat(flatHourlyRate.toFixed(4)), // Matches the fixed overall runtime rate perfectly
            });
          } else {
            // Direct Costs mapping directly onto matching arrays without division logic constraints
            nonLaborPayloadMap[acctId].plForecasts.push({
              forecastedamt: parseFloat(allocationAmount.toFixed(2)),
              forecastid: 0,
              projId: projId,
              plId: plId,
              emplId: "TBD",
              dctId: 0,
              month: month,
              year: year,
              updatedat: shortDate,
              acctId: acctId,
              orgId: orgIdString,
              hrlyRate: 0,
              plc: " ",
              effectDt: null,
            });
          }
        });
      });

      // Format payload from single resource map tracks
      const laborPayloads = [];
      Object.keys(laborResourceTracks).forEach((splitType) => {
        const resourceGroup = laborResourceTracks[splitType];
        resourceGroup.plForecasts.sort(
          (a, b) => a.year - b.year || a.month - b.month,
        );

        // FIXED: Access plForecasts directly on resourceGroup
        const totalCost = resourceGroup.plForecasts.reduce(
          (sum, x) => sum + x.cost,
          0,
        );

        // FIXED: Access plForecasts directly on resourceGroup
        const totalHours = resourceGroup.plForecasts.reduce(
          (sum, x) => sum + x.forecastedhours,
          0,
        );

        console.log("----------------------------------");
        console.log(splitType);
        console.log("Budget :", overallTotals[splitType].toFixed(2));
        console.log("Split Cost :", totalCost.toFixed(2));
        console.log("Hours :", totalHours.toFixed(2));
        console.log("Rate :", overallRates[splitType].toFixed(4));
        console.table(laborResourceTracks[splitType].plForecasts);

        if (resourceGroup.plForecasts.some((f) => f.cost > 0)) {
          laborPayloads.push(resourceGroup);
        }
      });

      // Object.keys(laborResourceTracks).forEach((key) => {
      //   const resourceGroup = laborResourceTracks[key];

      //   resourceGroup.plForecasts.sort(
      //     (a, b) => a.year - b.year || a.month - b.month,
      //   );

      //   const totalCost = resourceGroup[key].plForecasts.reduce(
      //     (sum, x) => sum + x.cost,
      //     0,
      //   );

      //   const totalHours = resourceGroup[key].plForecasts.reduce(
      //     (sum, x) => sum + x.forecastedhours,
      //     0,
      //   );

      //   console.log("----------------------------------");
      //   console.log(key);
      //   console.log("Budget :", overallTotals[key].toFixed(2));
      //   console.log("Split Cost :", totalCost.toFixed(2));
      //   console.log("Hours :", totalHours.toFixed(2));
      //   console.log("Rate :", overallRates[key].toFixed(4));
      //   console.table(laborResourceTracks[key].plForecasts);

      //   if (resourceGroup.plForecasts.some((f) => f.cost > 0)) {
      //     laborPayloads.push(resourceGroup);
      //   }
      // });

      const nonLaborPayloads = Object.values(nonLaborPayloadMap).filter((g) =>
        g.plForecasts.some((f) => f.forecastedamt > 0),
      );

      // --- CONSOLE PAYLOAD LOGS ---
      console.log("--- FINAL PAYLOAD BUNDLES FOR TRANSMISSION ---");
      console.log(
        "Labor Payload (Single Fixed Variable-Rate TBD structure):",
        JSON.stringify(laborPayloads, null, 2),
      );
      console.log(
        "Non-Labor Payload:",
        JSON.stringify(nonLaborPayloads, null, 2),
      );

      // 6. API Calls for Posting Costs
      if (laborPayloads.length > 0) {
        await axios.post(
          `${backendUrl}/Employee/AddNewEmployees?plid=${plId}&templateid=${templateId}`,
          laborPayloads,
          { headers: { "Content-Type": "application/json" } },
        );
      }

      if (nonLaborPayloads.length > 0) {
        await axios.post(
          `${backendUrl}/DirectCost/AddNewDirectCosts?plid=${plId}&templateid=${templateId}`,
          nonLaborPayloads,
          { headers: { "Content-Type": "application/json" } },
        );
      }

      // 7. API Call for Posting Revenues spread across months
      const revPayload = activeMonthsList.map(({ month, year }) => ({
        fy_Cd: year,
        period: month,
        revAmt: monthlyAllocatedAmount,
      }));

      await axios.post(
        `${backendUrl}/ProjRevWrkPd/AddRevenueForNB?pl_id=${plId}&proj_id=${projId}`,
        revPayload,
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("--- ALL OPERATIONS COMPILED AND SYNCED SUCCESSFULLY ---");
      toast.success("Automated monthly split sync processing complete!");
    } catch (err) {
      console.error("CRITICAL Sync Error encountered:", err);
      toast.error(`Auto-split calculation fallback: ${err.message}`);
    }
  };

  const handleNewBusinessClick = () => {
    setViewMode("form");
    setIsUpdateMode(false);
    setForm({
      businessBudgetId: "",
      description: "",
      level: "",
      active: false,
      version: "",
      versionCode: "",
      winningProbability: "",
      contractValue: "",
      contractTypes: "",
      startDate: "",
      endDate: "",
      period: "Q1 2024",
      weeks: "12",
      escalationRate: "",
      orgId: "",
      accountGrp: "",
      burdenTemplateId: "",
      pgoCalculation: "",
      pwinValue: "",
      type: "",
      ourRole: "",
      customer: "",
      workshare: "",
      trf_ProjId: "",
      status: "",
      revenue: "",
      existingProjectId: "",
      sector: "",
      businessUnit: "",
      stage: "",
      transitionPeriod: "",
      forecastCategory: "",
      offSiteLaborPercent: "",
      onsiteLaborPercent: "",
      nonLaborPercent: "",
      spreadDuration: "",
    });
  };

  return (
    <div className="p-3 py-10 space-y-6 text-[14px] sm:text-xs overflow-y-auto max-h-[85vh] text-gray-800 font-sans mx-auto animate-premium-popup bg-white rounded-lg">
      {viewMode === "form" && (
        <form className="space-y-4">
          {/* Header Actions */}
          <div className="bg-white flex justify-between items-center pb-4 border-b">
            <h2 className="text-[16px] font-medium text-gray-700">
              {isUpdateMode ? "Update Business Budget" : "New Business Budget"}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="btn1 btn-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : isUpdateMode ? "Update" : "Save"}
              </button>

              <button
                type="button"
                className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isSaving}
                title="Close"
              >
                <CircleArrowLeft size={12} className="text-white" />
                Back
              </button>
            </div>
          </div>

          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {/* LEFT COLUMN */}
            <div className="space-y-3">
              <div className="label-input-div">
                <label className="input-label">
                  Business Budget ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="businessBudgetId"
                  value={form.businessBudgetId}
                  onChange={handleChange}
                  readOnly={isUpdateMode}
                  className="input-style"
                  type="text"
                />
              </div>

              {/* <div className="label-input-div">
                <label className="input-label">Existing Project ID</label>
                <input
                  name="existingProjectId"
                  value={form.existingProjectId}
                  onChange={handleChange}
                  className="input-style"
                  type="text"
                />
              </div> */}

              {[
                ["Description", "description", "text"],
                // ["Level", "level", "number"],
                // ["Version", "version", "number"],
                // ["Version Code", "versionCode", "text"],
                ["Contract Value", "contractValue", "number"],
                // ["Contract Type", "contractTypes", "text"],
                // ["Winning Probability %", "winningProbability", "number"],
                // ["PGO Calculation", "pgoCalculation", "number"],
                // ["Pwin Value", "pwinValue", "number"],
                // ["Revenue Value", "revenue", "number"],
              ].map(([label, name, type]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label">
                    {label}{" "}
                    {(label === "Description" ||
                      label === "Contract Value") && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    type={type}
                    className="input-style"
                  />
                </div>
              ))}
              <div className="label-input-div">
                <label className="input-label">Customer Name</label>
                <input
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  className="input-style"
                  type="text"
                />
              </div>

              {/* Direct Labor, onsiteLaborPercent, nonLaborPercent Inputs */}
              {[
                ["Pwin Value(%)", "pwinValue", "number"],
                ["Direct Labor(%)", "offSiteLaborPercent", "number"],
                ["Subcontractor(%)", "onsiteLaborPercent", "number"],
                ["ODCs(%)", "nonLaborPercent", "number"],
              ].map(([label, name, type]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label">
                    {label}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    type="number"
                    className="input-style"
                  />
                </div>
              ))}

              {/* <div className="label-input-div">
                <label className="input-label">Active</label>
                <div className="flex justify-start w-[60%]">
                  <input
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    type="checkbox"
                    className="accent-blue-600"
                  />
                </div>
              </div> */}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-3">
              <div className="label-input-div">
                <label className="input-label">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  type="date"
                  className="input-style"
                />
              </div>

              <div className="label-input-div">
                <label className="input-label">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate}
                  type="date"
                  className="input-style"
                />
              </div>
              {/* 
              <div className="label-input-div">
                <label className="input-label">Escalation Rate</label>
                <input
                  name="escalationRate"
                  value={form.escalationRate}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  className="input-style"
                />
              </div> */}

              {/* <div className="label-input-div">
                <label className="input-label">Spread Duration</label>
                <input
                  name="spreadDuration"
                  value={form.spreadDuration}
                  onChange={handleChange}
                  type="number"
                  className="input-style"
                />
              </div> */}

              {/* Dropdowns Layout */}
              {/* <div className="relative flex items-center w-full justify-between">
                <label className="input-label">Sector</label>
                <Select
                  options={sectorOptions}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    sectorOptions.find((o) => o.value === form.sector) || null
                  }
                  onChange={(opt) =>
                    setForm((p) => ({ ...p, sector: opt ? opt.value : "" }))
                  }
                  isSearchable
                />
              </div> */}

              {/* Project Type */}
              {/* <div className="relative flex items-center w-full justify-between">
                <label className="input-label">Business Unit</label>
                <Select
                  options={businessUnitOptions}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    businessUnitOptions.find(
                      (o) => o.value === form.businessUnit,
                    ) || null
                  }
                  onChange={(opt) =>
                    setForm((p) => ({
                      ...p,
                      businessUnit: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                />
              </div> */}

              <div className="relative flex items-center w-full justify-between">
                <label className="input-label">Stage</label>
                <Select
                  options={stageOptions}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    stageOptions.find((o) => o.value === form.stage) || null
                  }
                  onChange={(opt) =>
                    setForm((p) => ({ ...p, stage: opt ? opt.value : "" }))
                  }
                  isSearchable
                />
              </div>

              {/* <div className="relative flex items-center w-full justify-between">
                <label className="input-label">Forecast Category</label>
                <Select
                  options={forecastCategoryOptions}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    forecastCategoryOptions.find(
                      (o) => o.value === form.forecastCategory,
                    ) || null
                  }
                  onChange={(opt) =>
                    setForm((p) => ({
                      ...p,
                      forecastCategory: opt ? opt.value : "",
                    }))
                  }
                />
              </div> */}

              {/* <div className="relative flex items-center w-full justify-between">
                <label className="input-label">Transition Period</label>
                <Select
                  options={transitionPeriodOptions}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    transitionPeriodOptions.find(
                      (o) => o.value === form.transitionPeriod,
                    ) || null
                  }
                  onChange={(opt) =>
                    setForm((p) => ({
                      ...p,
                      transitionPeriod: opt ? opt.value : "",
                    }))
                  }
                />
              </div> */}
              <div className="relative flex items-center w-full justify-between">
                <label className="input-label">
                  Contract Types <span className="text-red-500">*</span>
                </label>
                <Select
                  options={revFormulaOptions}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    revFormulaOptions.find(
                      (o) => o.value === form.contractTypes,
                    ) || null
                  }
                  onChange={(opt) =>
                    setForm((p) => ({
                      ...p,
                      contractTypes: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                  placeholder="Select Contract Type..."
                />
              </div>

              {/* Standard Async Select Lookups */}
              <div className="relative flex items-center w-full justify-between">
                <label className="input-label">
                  Org ID <span className="text-red-500">*</span>
                </label>
                <Select
                  options={orgOptions.map((opt) => ({
                    label: `${opt.orgId} - ${opt.orgName}`,
                    value: opt.orgId,
                  }))}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    form.orgId
                      ? orgOptions
                          .map((opt) => ({
                            label: `${opt.orgId} - ${opt.orgName}`,
                            value: opt.orgId,
                          }))
                          .find((o) => o.value === form.orgId)
                      : null
                  }
                  onChange={(opt) =>
                    setForm((prev) => ({
                      ...prev,
                      orgId: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                />
              </div>

              <div className="relative flex items-center w-full justify-between">
                <label className="input-label">Account Group</label>
                <Select
                  options={accountGroupOptions.map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    form.accountGrp
                      ? { label: form.accountGrp, value: form.accountGrp }
                      : null
                  }
                  onChange={(opt) =>
                    setForm((prev) => ({
                      ...prev,
                      accountGrp: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                  placeholder="Select Account Group..."
                />
              </div>

              <div className="relative flex items-center w-full justify-between">
                <label className="input-label">Our Role</label>
                <Select
                  options={ourRoleOptions}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    ourRoleOptions.find((o) => o.value === form.ourRole) || null
                  }
                  onChange={(opt) =>
                    setForm((p) => ({
                      ...p,
                      ourRole: opt ? opt.value : "",
                    }))
                  }
                />
              </div>

              {/* <div className="relative flex items-center w-full justify-between">
                <label className="input-label">
                  Account Group <span className="text-red-500">*</span>
                </label>
                <Select
                  options={accountGroupOptions.map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    form.accountGrp
                      ? { label: form.accountGrp, value: form.accountGrp }
                      : null
                  }
                  onChange={(opt) =>
                    setForm((prev) => ({
                      ...prev,
                      accountGrp: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                />
              </div> */}

              {/* <div className="relative flex items-center w-full justify-between">
                <label className="input-label">
                  Burden Template ID <span className="text-red-500">*</span>
                </label>
                <Select
                  options={burdenTemplates.map((t) => ({
                    label: t.templateCode,
                    value: t.id,
                  }))}
                  className="rounded outline-none text-xs sm:text-sm bg-white w-[60%]"
                  value={
                    form.burdenTemplateId
                      ? burdenTemplates
                          .map((t) => ({ label: t.templateCode, value: t.id }))
                          .find((o) => o.value === form.burdenTemplateId)
                      : null
                  }
                  onChange={(opt) =>
                    setForm((prev) => ({
                      ...prev,
                      burdenTemplateId: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                />
              </div> */}

              {/* {[
                // ["Our Role", "ourRole"],
                ["Our Workshare", "workshare"],
                // ["Type", "type"],
              ].map(([label, name]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label">{label}</label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>
              ))} */}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewBusiness;
