import React, { useEffect, useRef, useState } from "react";
import ProjectHoursDetails from "./ProjectHoursDetails";
import ProjectAmountsTable from "./ProjectAmountsTable";
import ProjectPoolCosts from "./ProjectPoolCosts";
import { toast } from "react-toastify";
import Draggable from "react-draggable";
import axios from "axios";
import { backendUrl } from "./config";
import { useOutletContext } from "react-router-dom";

const ProjectDetail = ({
  plans,
  hours = true,
  amount = true,
  indirect = true,
  selectedPlan,
  activeTab,
  fiscalYear,
  setRefreshPool,
  onColumnTotalsChange,
  refreshKey,
  onColumnAmtTotalsChange,
  setRefreshKey,
  refreshPool,
  otherColumnTotals,
  hoursColumnTotals,
  setRefreshData,
  // handleActionSelect,
  buttonDisable = true,
}) => {
  const ACCOUNT_KEYS = [
    "employeeLaborAccounts",
    "employeeNonLaborAccounts",
    "sunContractorLaborAccounts",
    "subContractorNonLaborAccounts",
    "otherDirectCostLaborAccounts",
    "otherDirectCostNonLaborAccounts",
    "plc",
  ];
  const { visibility, canView, canEdit } = useOutletContext();
  const nodeRef = useRef(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [calculation, setCalculation] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [allData, setAllData] = useState([]);
  const [allOrgData, setAllOrgData] = useState([]);
  const [isClosedPeriodEditable, setIsClosedPeriodEditable] = useState(false);
  const [allForcastData, setAllForcastData] = useState([]);
  const [durations, setDurations] = useState([]);
  const [isDurationLoading, setIsDurationLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [loadingPools, setLoadingPools] = useState(false);
  const [error, setError] = useState(null);

  const projectHoursRef = useRef(null);
  const projectAmountsRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [cloneData, setCloneData] = useState({
    frequency: "MONTHLY",
    baseDate: "",
    targetStartDate: "",
    increasePercentage: 0,
    sourceQuarter: "Q1",
    sourceYear: "",
    targetQuarter: "Q1",
    targetYear: "",
    isOverwrite: false, // New flag to indicate overwrite
  });

  const [importErrorModal, setImportErrorModal] = useState({
    isOpen: false,
    message: "",
    // details: null,
  });

  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  const handleFetchAuditLogs = async () => {
    if (!selectedPlan?.plId) return;
    setIsAuditLoading(true);
    setAuditModalOpen(true);
    try {
      const response = await axios.get(
        `${backendUrl}/AuditTable/GetByPlanId/${selectedPlan.plId}`,
      );
      setAuditLogs(
        Array.isArray(response.data) ? response.data : [response.data],
      );
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      toast.error("Failed to fetch audit log information.");
    } finally {
      setIsAuditLoading(false);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");

    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
      } catch (error) {
        console.error("Error parsing user:", error);
        setCurrentUserRole(null);
      }
    }
  }, []);

  const MONTHS = [
    { val: "01", label: "January" },
    { val: "02", label: "February" },
    { val: "03", label: "March" },
    { val: "04", label: "April" },
    { val: "05", label: "May" },
    { val: "06", label: "June" },
    { val: "07", label: "July" },
    { val: "08", label: "August" },
    { val: "09", label: "September" },
    { val: "10", label: "October" },
    { val: "11", label: "November" },
    { val: "12", label: "December" },
  ];

  // BUtton function
  const handleGlobalSave = async () => {
    setIsLoading(true);
    setIsSaving(true);

    try {
      const saveTasks = [];

      if (
        projectAmountsRef.current?.handleMasterSave &&
        (projectAmountsRef.current?.newEntries?.length > 0 ||
          projectAmountsRef.current?.hasUnsavedAmountChanges ||
          projectAmountsRef.current?.hasUnsavedFieldChanges)
      ) {
        saveTasks.push(
          projectAmountsRef.current.handleMasterSave().then((res) => ({
            section: "Amounts",
            success: res !== false,
          })),
        );
      }

      if (
        projectHoursRef.current?.handleMasterSave &&
        (projectHoursRef.current?.newEntries?.length > 0 ||
          projectHoursRef.current?.hasUnsavedHoursChanges ||
          projectHoursRef.current?.hasUnsavedEmployeeChanges)
      ) {
        saveTasks.push(
          projectHoursRef.current.handleMasterSave().then((res) => ({
            section: "Hours",
            success: res !== false,
          })),
        );
      }

      const results = await Promise.allSettled(saveTasks);

      const failedSections = [];

      results.forEach((result) => {
        if (result.status === "rejected") {
          failedSections.push("Unknown");
        } else if (!result.value.success) {
          failedSections.push(result.value.section);
        }
      });

      if (failedSections.length > 0) {
        toast.error(`Failed to save: ${failedSections.join(", ")}`);
        return;
      }

      // 1. Trigger internal UI key resets if your child components need to re-render local states
      if (typeof setRefreshKey === "function")
        setRefreshKey((prev) => prev + 1);
      if (typeof setRefreshPool === "function")
        setRefreshPool((prev) => prev + 1);

      // 2. Fetch the updated monthly data directly to refresh parent/sibling calculations
      if (selectedPlan) {
        setLoadingPools(true);
        try {
          const planType = selectedPlan?.plType || "";
          const planId = selectedPlan?.plId;
          const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

          const response = await axios.get(
            `${backendUrl}/Forecast/GetMonthlyDataV1?planID=${planId}&planType=${apiPlanType}`,
          );

          if (Array.isArray(response?.data)) {
            setAllForcastData(response.data);
          } else {
            setAllForcastData([]);
          }
        } catch (error) {
          console.error("Failed to refresh monthly data post-save:", error);
        } finally {
          setLoadingPools(false);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Global Save Failed");
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  //clone
  const handleCloneIncrease = async (isOverwrite = false) => {
    const {
      frequency,
      increasePercentage,
      sourceQuarter,
      sourceYear,
      targetQuarter,
      targetYear,
      sourceHalf,
      targetHalf,
      baseDate, // For monthly: "YYYY-MM"
      targetStartDate, // For monthly: "YYYY-MM"
    } = cloneData;

    const { projId, plId } = selectedPlan;

    // Variables to hold the mapped values for the API
    let sYear = sourceYear;
    let tYear = targetYear;
    let sPeriod = 1;
    let tPeriod = 1;

    try {
      // 1. Construct Period Numbers based on Frequency
      if (frequency === "QUARTERLY") {
        if (!sourceYear || !targetYear) {
          toast.error("Please select both Source and Target years.");
          return;
        }
        // Q1=1, Q2=2, Q3=3, Q4=4
        const qMap = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
        sPeriod = qMap[sourceQuarter || "Q1"];
        tPeriod = qMap[targetQuarter || "Q1"];
      } else if (frequency === "HALFYEARLY") {
        if (!sourceYear || !targetYear) {
          toast.error("Please select both Source and Target years.");
          return;
        }
        // H1=1, H2=2
        const hMap = { H1: 1, H2: 2 };
        sPeriod = hMap[sourceHalf || "H1"];
        tPeriod = hMap[targetHalf || "H1"];
      } else if (frequency === "YEARLY") {
        if (!sourceYear || !targetYear) {
          toast.error("Please select both Source and Target years.");
          return;
        }
        // Yearly usually implies period 1 (the whole year starting at period 1)
        sPeriod = 1;
        tPeriod = 1;
      } else {
        if (
          !cloneData.sourceMonth ||
          !cloneData.sourceYear ||
          !cloneData.targetMonth ||
          !cloneData.targetYear
        ) {
          toast.error("Please select both Source and Target Month/Year.");
          return;
        }

        sYear = cloneData.sourceYear;
        tYear = cloneData.targetYear;
        sPeriod = parseInt(cloneData.sourceMonth, 10);
        tPeriod = parseInt(cloneData.targetMonth, 10);
      }

      // 2. Validation
      if (increasePercentage === "" || increasePercentage === null) {
        toast.error("Increase percentage is required.");
        return;
      }

      // 3. API Call with new parameters
      setIsLoading(true);

      // Using the new API structure provided
      const params = new URLSearchParams({
        plId: plId,
        sourceYear: sYear,
        targetYear: tYear,
        sourcePeriod: sPeriod,
        targetPeriod: tPeriod,
        percentage: increasePercentage,
        periodType:
          frequency === "HALFYEARLY"
            ? "HalfYearly"
            : frequency.charAt(0).toUpperCase() +
              frequency.slice(1).toLowerCase(),
        overwriteExisting: isOverwrite,
      });

      const response = await axios.post(
        `${backendUrl}/api/ForecastReport/UpdateForecastWithPeriodShiftV1?${params.toString()}`,
      );

      console.log("Clone Response:", response.data);
      if (response.data === false) {
        setIsLoading(false); // Turn off loading spinner for the prompt

        const userConfirmed = window.confirm(
          "Data already exists for the target period. Do you want to overwrite it?",
        );

        if (userConfirmed) {
          // Run the function again, passing true to override
          await handleCloneIncrease(true);
        }
        return; // Stop this instance from running success logic
      }

      if (typeof handleCalc === "function") {
        await handleCalc();
      }
      toast.success("Plan cloned successfully!");

      setIsCloneModalOpen(false);
      setRefreshKey((prev) => prev + 1);
      setRefreshPool((prev) => prev + 1);
    } catch (err) {
      console.error("Clone Error:", err);
      toast.error(err.response?.data?.message || "Error cloning plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportPlanFromDetails = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error(
        "Invalid file format. Please upload an Excel file (.xlsx or .xls)",
      );
      return;
    }

    const toastId = toast.loading("Processing data import...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setIsImporting(true);
      await axios.post(
        `${backendUrl}/Forecast/ImportDirectCostPlanV2`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.update(toastId, {
        render: "Data imported successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      // console.error("Import Error:", err);

      // let errorMessage =
      //   "Failed to import file. Please verify the project ID and file format.";
      // let errorDetails = null;

      // if (err.response?.data) {
      //   if (typeof err.response.data === "string") {
      //     errorMessage = err.response.data;
      //   } else {
      //     errorMessage = err.response.data.message || errorMessage;
      //     errorDetails = err.response.data.details || null;
      //   }
      // }

      // toast.update(toastId, {
      //   render: (
      //     <div>
      //       <strong>{errorMessage}</strong>
      //       {errorDetails && (
      //         <div className="mt-2 text-xs">
      //           {Object.entries(errorDetails).map(([k, v]) => (
      //             <div key={k}>
      //               {k}: {v || "-"}
      //             </div>
      //           ))}
      //         </div>
      //       )}
      //     </div>
      //   ),
      //   type: "error",
      //   isLoading: false,
      //   autoClose: 8000,
      // });
      console.error("Import Error:", err);

      let errorMessage =
        "Failed to import file. Please verify the project ID and file format.";
      let errorDetails = null;

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else {
          // Fall back to top level message if available
          errorMessage = err.response.data.message || errorMessage;

          // Check if the structured 'errors' array exists in the backend response
          if (Array.isArray(err.response.data.errors)) {
            errorDetails = err.response.data.errors;
          } else {
            errorDetails = err.response.data.details || null;
          }
        }
      }

      // Close the loading toast silently
      toast.dismiss(toastId);

      // Open custom scrollable popup modal with normalized structural fields
      setImportErrorModal({
        isOpen: true,
        message: errorMessage,
        // details: errorDetails,
      });
    } finally {
      setIsImporting(false);
      setIsLoading(false);
      if (event.target) event.target.value = "";
    }
  };

  console.log(importErrorModal.message);

  const copyErrorsToClipboard = () => {
    let textToCopy = `Error: ${importErrorModal.message}\n`;
    if (importErrorModal.details) {
      textToCopy += "\nDetails:\n";
      Object.entries(importErrorModal.details).forEach(([key, val]) => {
        textToCopy += `${key}: ${val || "-"}\n`;
      });
    }
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success("Errors copied to clipboard!"))
      .catch((err) => console.error("Could not copy errors", err));
  };

  const handleExportPlan = async (planOverride) => {
    if (!selectedPlan) {
      toast.warning("Please select a plan first.");
      return;
    }
    const plan = planOverride || selectedPlan;

    if (!plan?.projId || !plan?.version || !plan?.plType) {
      toast.error("Missing required parameters for export.");
      return;
    }
    const toastId = toast.loading("Preparing Excel file, please wait...");

    try {
      setIsExporting(true);
      setIsLoading(true);
      const response = await axios.get(
        `${backendUrl}/Forecast/ExportPlanDirectCost`,
        {
          params: {
            projId: plan.projId,
            version: plan.version,
            type: plan.plType,
          },
          responseType: "blob",
        },
      );

      if (!response.data || response.data.size === 0) {
        toast.update(toastId, {
          render: "No data received from server",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      // Handle the file download silently in the background
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Plan_${plan.projId}_${plan.version}_${plan.plType}.xlsx`,
      );

      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.update(toastId, {
        render: "Export successful!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Export Error:", err);
      toast.update(toastId, {
        render:
          "Export failed: " + (err.response?.data?.message || err.message),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsExporting(false);
      setIsLoading(false);
    }
  };

  const handleCalc = async () => {
    setIsLoading(true);
    setCalculation(true);

    if (!selectedPlan) {
      toast.error("No plan selected for calculation.", {
        toastId: "no-plan-selected",
      });
      setIsLoading(false);
      setCalculation(false);
      return;
    }

    if (!selectedPlan.plId || !selectedPlan.templateId) {
      toast.error(
        "Cannot calculate: Missing required parameters (planID or templateId).",
        {
          toastId: "missing-params",
        },
      );
      setIsLoading(false);
      setCalculation(false);
      return;
    }

    try {
      // 1. Trigger the main revenue calculation API
      const response = await axios.get(
        `${backendUrl}/Forecast/CalculateRevenueCost?planID=${selectedPlan.plId}&templateId=${selectedPlan.templateId}&type=actual`,
      );

      const message =
        typeof response.data === "string"
          ? response.data
          : response.data?.message || "Revenue Calculation successful!";
      toast.success(message);

      // 2. Trigger internal UI key resets if child components need to re-render local states
      if (typeof setRefreshKey === "function") {
        setRefreshKey((prev) => prev + 1);
      }
      if (typeof setRefreshPool === "function") {
        setRefreshPool((prev) => prev + 1);
      }

      // 3. Fetch the updated monthly data directly to refresh parent/sibling calculations
      setLoadingPools(true);
      try {
        const planType = selectedPlan?.plType || "";
        const planId = selectedPlan?.plId;
        const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

        const monthlyResponse = await axios.get(
          `${backendUrl}/Forecast/GetMonthlyDataV1?planID=${planId}&planType=${apiPlanType}`,
        );

        if (Array.isArray(monthlyResponse?.data)) {
          setAllForcastData(monthlyResponse.data);
        } else {
          setAllForcastData([]);
        }
      } catch (monthlyErr) {
        console.error(
          "Failed to refresh monthly data post-calculation:",
          monthlyErr,
        );
        toast.error(
          "Calculation succeeded, but failed to fetch updated monthly data.",
        );
      } finally {
        setLoadingPools(false);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error during calculation.";
      toast.error(errorMessage);
    } finally {
      setCalculation(false);
      setIsLoading(false);
    }
  };

  // optimized api calls
  useEffect(() => {
    const encodedProjectId = encodeURIComponent(selectedPlan?.projId);

    // const getAllData = async () => {
    //   try {
    //     const projectResponse = await axios.get(
    //       `${backendUrl}/Project/GetAllProjectByProjId/${encodedProjectId}/${selectedPlan?.plType}`,
    //     );
    //     const data = Array.isArray(projectResponse.data)
    //       ? projectResponse.data[0]
    //       : projectResponse.data;
    //     setAllData(data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    const getAllData = async () => {
      try {
        const projectResponse = await axios.get(
          `${backendUrl}/Project/GetAllProjectByProjId/${encodedProjectId}/${selectedPlan?.plType}`,
        );

        const data = Array.isArray(projectResponse.data)
          ? projectResponse.data[0]
          : projectResponse.data;

        // Filter PLC based on source and selected plan type
        const filteredPlc = (data?.plc || []).filter((plc) => {
          if (selectedPlan?.plType === "EAC") {
            return plc.source === "N";
          }

          if (selectedPlan?.plType === "BUD") {
            return plc.source === "N";
          }

          // Default behavior
          return true;
        });

        const updatedData = {
          ...data,
          plc: filteredPlc,
        };

        setAllData(updatedData);
      } catch (error) {
        console.log(error);
      }
    };

    getAllData();
  }, [selectedPlan]);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/Orgnization/GetAllOrgs`,
        );
        setAllOrgData(response.data);
      } catch (err) {
        console.error("Failed to preload organizations", err);
      }
    };
    loadOrganizations();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/Configuration/GetConfigValueByName/isClosedPeriodEditable`,
        );
        console.log("hours", response.data);
        setIsClosedPeriodEditable(response.data?.value);
      } catch (err) {
        console.warn("Config fetch failed, defaulting to editable:", err);
        setIsClosedPeriodEditable(true);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchAndSetLaborCost = async () => {
      setLoadingPools(true);
      try {
        const planType = selectedPlan?.plType || "";
        const planId = selectedPlan?.plId;
        // ✅ FIXED: Pass planType correctly to the API
        const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

        const response = await axios.get(
          `${backendUrl}/Forecast/GetMonthlyDataV1?planID=${planId}&planType=${apiPlanType}`,
        );

        const data = response?.data;

        if (!Array.isArray(data)) {
          setAllForcastData([]);
          return;
        }

        // ✅ FIXED: Map the response correctly with all fields
        //                    const transformed = data.map(item => ({
        //   year: item.year,
        //   month: item.month,
        //   laborCost: Number(item.laborCost) || 0,
        //   nonLaborCost: Number(item.nonLaborCost) || 0,
        //   hours: Number(item.hours) || Number(item.hr) || 0,
        //   indirectCost: [
        //     { name: "OH-Off Site Lanham", value: Number(item.overhead) || 0 },
        //     { name: "OH-On Site Lanham", value: Number(item.overhead) || 0 }, // adjust if you have separate field
        //     { name: "Fringe", value: Number(item.fringe) || 0 },
        //     { name: "Material Handling Fee", value: Number(item.mnh) || 0 },
        //     { name: "G&A", value: Number(item.gna) || 0 }
        //   ]
        // }));

        setAllForcastData(response.data);
      } catch (error) {
        console.error("Failed to fetch labor cost data", error);
        setAllForcastData([]);
      } finally {
        setLoadingPools(false);
      }
    };
    fetchAndSetLaborCost();
  }, [selectedPlan]);

  useEffect(() => {
    const fetchDurations = async () => {
      if (!selectedPlan) return;

      const startDate = selectedPlan?.projStartDt;
      const endDate = selectedPlan?.projEndDt;
      if (!startDate || !endDate) {
        setDurations([]);
        setIsDurationLoading(false);
        setIsDataLoading(false);
        return;
      }
      setIsDurationLoading(true);
      setIsDataLoading(true);
      setError(null);
      try {
        let startingDate;
        let endingDate;

        const startStr = startDate.slice(0, 10);
        const endStr = endDate.slice(0, 10);

        if (!fiscalYear || fiscalYear === "All") {
          startingDate = startStr;
          endingDate = endStr;
        } else {
          const year = Number(fiscalYear);
          const fiscalStart = `${year}-01-01`;
          const fiscalEnd = `${year}-12-31`;

          // Take the later of originalStart and fiscalStart
          startingDate = startStr > fiscalStart ? startStr : fiscalStart;

          // Take the earlier of originalEnd and fiscalEnd
          endingDate = endStr < fiscalEnd ? endStr : fiscalEnd;
        }

        const durationResponse = await axios.get(
          `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startingDate}/${endingDate}`,
        );
        if (!Array.isArray(durationResponse.data)) {
          throw new Error("Invalid duration response format");
        }
        setDurations(durationResponse.data);
      } catch (err) {
        setError("Failed to load duration data. Please try again.");
        toast.error(
          "Failed to load duration data: " +
            (err.response?.data?.message || err.message),
          {
            toastId: "duration-error",
            autoClose: 3000,
          },
        );
      } finally {
        setIsDurationLoading(false);
        setIsDataLoading(false);
      }
    };
    fetchDurations();
    // projectHoursRef.current?.fetchEmployees()
  }, [selectedPlan, fiscalYear]);

  // const getProjectYears = () => {
  //   if (!selectedPlan?.projStartDt || !selectedPlan?.projEndDt) return [];
  //   const startYear = new Date(selectedPlan.projStartDt).getFullYear();
  //   const endYear = new Date(selectedPlan.projEndDt).getFullYear();
  //   const years = [];
  //   for (let y = startYear; y <= endYear; y++) {
  //     years.push(y);
  //   }
  //   return years;
  // };

  const getProjectYears = () => {
    if (!selectedPlan?.projStartDt || !selectedPlan?.projEndDt) return [];

    // Use getUTCFullYear() to avoid timezone subtraction errors
    const startYear = new Date(selectedPlan.projStartDt).getUTCFullYear();
    const endYear = new Date(selectedPlan.projEndDt).getUTCFullYear();

    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  };

  const projectYears = getProjectYears();

  const handleActionSelect = async (idx, action) => {
    console.log("call");
    // Use idx to get from plans if available, otherwise fallback to selectedPlan
    const plan =
      idx !== null && typeof plans !== "undefined" && plans[idx]
        ? plans[idx]
        : selectedPlan;

    console.log(plan);

    if (!plan || action === "None") return;

    // --- IMMEDIATE CONFIRMATION FOR DELETE ---
    if (action === "Delete") {
      const confirmed = window.confirm(
        `Are you sure you want to delete this plan?`,
      );
      if (!confirmed) return;
    }

    try {
      // setIsActionLoading(true)

      if (action === "Delete") {
        if (!plan.plId || Number(plan.plId) <= 0) {
          toast.error("Cannot delete: Invalid plan ID.");
          // setIsActionLoading(false);
          return;
        }

        toast.info("Deleting plan...");
        await axios.delete(
          `${backendUrl}/Project/DeleteProjectPlan/${plan.plId}`,
        );
        toast.success("Plan deleted successfully!");

        // Update local state if plans array exists
        // if (typeof plans !== "undefined") {
        //   setPlans(plans.filter((p) => p.plId !== plan.plId));
        // }

        // Clear selection if we deleted the currently viewed plan
        if (selectedPlan?.plId === plan.plId) {
          if (typeof onPlanSelect === "function") onPlanSelect(null);
        }
      } else if (
        action === "Create Budget" ||
        action === "Create Blank Budget" ||
        action === "Create EAC" ||
        action === "Create NB BUD"
      ) {
        // Use the ID from the plan object itself to avoid "not defined" errors
        const currentProjId = plan.projId;

        const payloadTemplate = {
          projId: currentProjId,
          plId: plan.plId || 0,
          plType:
            action === "Create NB BUD"
              ? "NBBUD"
              : action === "Create EAC"
                ? "EAC"
                : "BUD",
          // Source logic: B for Budget, E for EAC + version number
          source: `${plan.plType === "BUD" ? "B" : plan.plType === "EAC" ? "E" : ""}${plan.version || 0}`,
          type: plan.type || "A",
          version: plan.version || 0,
          versionCode: plan.versionCode || "",
          finalVersion: false,
          isCompleted: false,
          isApproved: false,
          status: "In Progress",
          createdBy: "User",
          modifiedBy: "User",
          templateId: plan.templateId || 1,
          projStartDt: selectedPlan?.projStartDt,
          projEndDt: selectedPlan?.projEndDt,
          fiscalYear: fiscalYear,
        };

        toast.info(`Creating ${action}...`);

        const response = await axios.post(
          `${backendUrl}/Project/AddProjectPlan?type=${action === "Create Blank Budget" ? "blank" : "actual"}`,
          payloadTemplate,
        );

        const rawCreatedPlan = response.data;

        // Refresh the table to show the new record
        // const newPlans = await refreshPlans(currentProjId);

        // if (newPlans && newPlans.length > 0) {
        //   // Find the newly created plan in the refreshed list
        //   const planToSelect = newPlans.find(p => p.plId === (rawCreatedPlan.plId || rawCreatedPlan.id)) || rawCreatedPlan;

        //   // Auto-select and scroll to the new plan
        //   handleRowClick(planToSelect);
        //   if (typeof onPlanSelect === "function") onPlanSelect(planToSelect);

        //   setTimeout(() => {
        //     const rowElement = document.getElementById(`plan-row-${planToSelect.plId}`);
        //     if (rowElement) rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
        //   }, 200);
        // }

        toast.success(
          `${
            action === "Create Budget"
              ? "Budget"
              : action === "Create Blank Budget"
                ? "Blank Budget"
                : action === "Create NB BUD"
                  ? "NB BUD"
                  : "EAC"
          } created successfully!`,
        );

        if (typeof setRefreshData === "function") {
          setRefreshData((prev) => !prev);
        }
        // setSelectedPlan(response.data);

        // setViewMode("details");
        // setActiveTab("hours");
      }
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
    } finally {
      // setIsActionLoading(false);
    }
  };
  return (
    <div className="w-full mx-auto grid md:grid-cols-1">
      <div className="flex items-center gap-2">
        <>
          {selectedPlan &&
            (selectedPlan.status === "Approved" ||
              selectedPlan.status === "Concluded") && (
              <div className="flex gap-2">
                {selectedPlan.plType === "BUD" ||
                selectedPlan.plType === "EAC" ? (
                  <>
                    {/* New Budget Button */}
                    {(canEdit("otherCost") || canEdit("BUD/EAC")) && (
                      <button
                        onClick={() =>
                          handleActionSelect(
                            plans?.findIndex(
                              (p) => p.projId === selectedPlan?.projId,
                            ),
                            "Create Budget",
                          )
                        }
                        className="btn1 btn-blue cursor-pointer whitespace-nowrap"
                        title="Create Budget"
                      >
                        New Budget
                      </button>
                    )}
                    {/* New EAC Button */}
                    {(canEdit("otherCost") || canEdit("BUD/EAC")) && (
                      <button
                        onClick={() =>
                          handleActionSelect(
                            plans?.findIndex(
                              (p) => p.projId === selectedPlan?.projId,
                            ),
                            "Create EAC",
                          )
                        }
                        className="btn1 btn-blue cursor-pointer whitespace-nowrap"
                        title="Create EAC"
                      >
                        New EAC
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {(canEdit("otherCost") || canEdit("BUD/EAC")) && (
                      <button
                        onClick={() =>
                          handleActionSelect(
                            plans?.findIndex(
                              (p) => p.projId === selectedPlan?.projId,
                            ),
                            "Create NB BUD",
                          )
                        }
                        className="btn1 btn-blue cursor-pointer whitespace-nowrap"
                        title="Create NB BUD"
                      >
                        Create NB BUD
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
        </>
        <div className={`flex items-center justify-between w-full`}>
          <div className="flex gap-2 items-center">
            <>
              {/* {(canView("BUD/EAC") || canView("otherCost")) && ( */}
              {/* {buttonDisable && ( */}
              <>
                {(canEdit("otherCost") || canEdit("BUD/EAC")) && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading || isImporting}
                    className="btn1 btn-blue cursor-pointer flex items-center"
                    title="Import Plan"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4"
                      />
                    </svg>
                    {isImporting ? "Importing" : "Import"}
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportPlanFromDetails}
                  accept=".xlsx,.xls"
                  className="hidden"
                />

                {/* ✅ EXPORT BUTTON - uses table ref */}
                <button
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   handleExportPlanFromDetails;
                  // }}
                  type="button"
                  onClick={() => handleExportPlan()}
                  className="btn1 btn-blue cursor-pointer flex items-center"
                  title="Export to Excel"
                  disabled={
                    !selectedPlan?.projId ||
                    !selectedPlan?.version ||
                    !selectedPlan?.plType ||
                    isLoading ||
                    isExporting
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  {isExporting ? "Exporting" : "Export"}
                </button>
              </>
              {/* )} */}

              {/* )} */}
              {/* <>
                <button
                  onClick={handleCalc}
                  className="btn1 btn-blue cursor-pointer flex items-center"
                  title="Import Plan"
                  disabled={calculation || isLoading}
                >
                  {calculation ? "Calculating" : "Calc"}
                </button>
              </> */}
              <>
                {(canEdit("otherCost") || canEdit("BUD/EAC")) && (
                  <button
                    onClick={handleCalc}
                    className={`btn1 cursor-pointer flex items-center ${
                      calculation ||
                      isLoading ||
                      selectedPlan?.status !== "In Progress"
                        ? "btn-disabled bg-gray-300 text-white cursor-not-allowed"
                        : "btn-blue"
                    }`}
                    title="Import Plan"
                    disabled={
                      calculation ||
                      isLoading ||
                      selectedPlan?.status !== "In Progress"
                    }
                  >
                    {calculation ? "Calculating" : "Calc"}
                  </button>
                )}
              </>

              {/* {canView("indirectCost") && ( */}
              {/* )} */}

              {selectedPlan?.status === "In Progress" &&
                buttonDisable &&
                (canEdit("otherCost") || canEdit("BUD/EAC")) && (
                  <button
                    onClick={() => setIsCloneModalOpen(true)}
                    className="btn1 btn-blue cursor-pointer flex items-center"
                    title="Clone"
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    Clone
                  </button>
                )}

              <button
                type="button"
                onClick={handleFetchAuditLogs}
                className="btn1 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-full p-1.5 flex items-center justify-center transition-colors"
                title="View Plan Audit Info"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </>
          </div>

          {/* {(canView("BUD/EAC") || canView("otherCost")) && ( */}
          <div>
            <div className="flex flex-1 justify-end p-1">
              {(canEdit("otherCost") || canEdit("BUD/EAC")) && (
                <button
                  onClick={handleGlobalSave}
                  disabled={
                    isLoading ||
                    isSaving ||
                    selectedPlan?.status != "In Progress"
                  }
                  className="btn1 btn-blue"
                >
                  {isSaving ? "Saving" : "Save"}
                </button>
              )}
            </div>
          </div>
          {/* )} */}
        </div>
      </div>

      {/* HOURS CARD */}
      {/* {canView("BUD/EAC") && ( */}
      {hours && canView("BUD/EAC") && (
        <div className="border mb-2 border-gray-200 rounded-md shadow-sm bg-white">
          <div className="px-2 pb-2">
            <ProjectHoursDetails
              activeTab={activeTab}
              ref={projectHoursRef}
              planId={selectedPlan.plId}
              refreshKey={refreshKey}
              // canView={canView}
              // canEdit={canEdit}
              projectId={selectedPlan.projId}
              templateId={selectedPlan.templateId}
              refreshCalc={calculation}
              status={selectedPlan.status}
              planType={selectedPlan.plType}
              closedPeriod={selectedPlan.closedPeriod}
              startDate={selectedPlan.projStartDt}
              endDate={selectedPlan.projEndDt}
              fiscalYear={fiscalYear}
              setRefreshPool={setRefreshPool}
              onSaveSuccess={() => {}}
              onColumnTotalsChange={onColumnTotalsChange}
              allData={allData}
              initialData={selectedPlan}
              allOrgData={allOrgData}
              isClosedPeriodEditable={isClosedPeriodEditable}
              // allowedPercentage={allowedPercentage}
              allForcastData={allForcastData}
              isDurationhrLoading={isDurationLoading}
              setIsDurationhrLoading={setIsDurationLoading}
              durations={durations}
              groupCd={selectedPlan.acctGrpCd}
              buttonDisable={buttonDisable}
              selectedPlan={selectedPlan}
            />
          </div>
        </div>
      )}
      {/* )} */}
      {/* Non-Labor CARD */}
      {/* {canView("otherCost") && ( */}
      {amount && canView("otherCost") && (
        <div className="border mb-2 border-gray-200 rounded-md shadow-sm bg-white">
          <div className="px-2 pb-2">
            <ProjectAmountsTable
              activeTab={activeTab}
              ref={projectAmountsRef}
              initialData={selectedPlan}
              allData={allData}
              startDate={selectedPlan.projStartDt}
              endDate={selectedPlan.projEndDt}
              planType={selectedPlan.plType}
              templateId={selectedPlan.templateId}
              fiscalYear={fiscalYear}
              refreshKey={refreshKey}
              setRefreshPool={setRefreshPool}
              onSaveSuccess={() => setRefreshKey((prev) => prev + 1)}
              onColumnTotalsChange={onColumnAmtTotalsChange}
              allOrgData={allOrgData}
              isClosedPeriodEditable={isClosedPeriodEditable}
              allForcastData={allForcastData}
              isDataLoading={isDataLoading}
              setIsDataLoading={setIsDataLoading}
              durations={durations}
              groupCd={selectedPlan.acctGrpCd}
              buttonDisable={buttonDisable}
              selectedPlan={selectedPlan}
            />
          </div>
        </div>
      )}
      {/* )} */}
      {/* POOL COST (ADMIN ONLY) */}
      {/* {canView("indirectCost") && ( */}
      {indirect && canView("indirectCost") && (
        <div className="border border-gray-200 rounded-md shadow-sm bg-white">
          <div className="px-2 pb-2">
            <ProjectPoolCosts
              refreshKey={refreshPool}
              planId={selectedPlan.plId}
              startDate={selectedPlan.projStartDt}
              planType={selectedPlan.plType}
              endDate={selectedPlan.projEndDt}
              templateId={selectedPlan.templateId}
              fiscalYear={fiscalYear}
              hoursColumnTotals={hoursColumnTotals}
              otherColumnTotals={otherColumnTotals}
              refreshCalculation={calculation}
              allForcastData={allForcastData}
              loadingPools={loadingPools}
              groupCd={selectedPlan.acctGrpCd}
            />
          </div>
        </div>
      )}
      {/* )} */}

      {isCloneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <Draggable nodeRef={nodeRef} handle=".modal-header" bounds="body">
            <div
              ref={nodeRef}
              className="bg-white rounded-lg shadow-2xl w-96 border border-gray-200"
            >
              <div className="modal-header cursor-move p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="text-md font-semibold text-gray-700 select-none">
                  Increase Plan
                </h3>
                <span className="text-gray-400 text-[10px] tracking-wider select-none">
                  ⠿ Drag to Move
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Frequency
                  </label>
                  <select
                    className="input-style w-full"
                    value={cloneData.frequency}
                    onChange={(e) =>
                      setCloneData({ ...cloneData, frequency: e.target.value })
                    }
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="HALFYEARLY">Half Yearly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* QUARTERLY: Q1-Q4 + Year Dropdown */}
                  {cloneData.frequency === "QUARTERLY" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Source Quarter
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.sourceQuarter || "Q1"}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                sourceQuarter: e.target.value,
                              })
                            }
                          >
                            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.sourceYear || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                sourceYear: e.target.value,
                              })
                            }
                          >
                            <option value="">Year</option>
                            {projectYears.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Quarter
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.targetQuarter || "Q1"}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                targetQuarter: e.target.value,
                              })
                            }
                          >
                            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.targetYear || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                targetYear: e.target.value,
                              })
                            }
                          >
                            <option value="">Year</option>
                            {projectYears.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* HALFYEARLY: H1/H2 + Year Dropdown */}
                  {cloneData.frequency === "HALFYEARLY" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Source Half
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.sourceHalf || "H1"}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                sourceHalf: e.target.value,
                              })
                            }
                          >
                            <option value="H1">H1 (Jan-Jun)</option>
                            <option value="H2">H2 (Jul-Dec)</option>
                          </select>
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.sourceYear || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                sourceYear: e.target.value,
                              })
                            }
                          >
                            <option value="">Year</option>
                            {projectYears.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Half
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.targetHalf || "H1"}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                targetHalf: e.target.value,
                              })
                            }
                          >
                            <option value="H1">H1 (Jan-Jun)</option>
                            <option value="H2">H2 (Jul-Dec)</option>
                          </select>
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.targetYear || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                targetYear: e.target.value,
                              })
                            }
                          >
                            <option value="">Year</option>
                            {projectYears.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* YEARLY: Year Dropdown only */}
                  {cloneData.frequency === "YEARLY" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Source Year
                        </label>
                        <select
                          className="input-style w-full text-xs"
                          value={cloneData.sourceYear || ""}
                          onChange={(e) =>
                            setCloneData({
                              ...cloneData,
                              sourceYear: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Year</option>
                          {projectYears.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Year
                        </label>
                        <select
                          className="input-style w-full text-xs"
                          value={cloneData.targetYear || ""}
                          onChange={(e) =>
                            setCloneData({
                              ...cloneData,
                              targetYear: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Year</option>
                          {projectYears.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* MONTHLY: Standard Month Picker */}
                  {/* {cloneData.frequency === "MONTHLY" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Base Month
                        </label>
                        <input
                          type="month"
                          className="input-style w-full text-xs"
                          value={cloneData.baseDate?.substring(0, 7) || ""}
                          onChange={(e) =>
                            setCloneData({
                              ...cloneData,
                              baseDate: e.target.value
                                ? `${e.target.value}-01`
                                : "",
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Month
                        </label>
                        <input
                          type="month"
                          className="input-style w-full text-xs"
                          value={
                            cloneData.targetStartDate?.substring(0, 7) || ""
                          }
                          onChange={(e) =>
                            setCloneData({
                              ...cloneData,
                              targetStartDate: e.target.value
                                ? `${e.target.value}-01`
                                : "",
                            })
                          }
                        />
                      </div>
                    </>
                  )} */}
                  {cloneData.frequency === "MONTHLY" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Base Month & Year
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.sourceMonth || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                sourceMonth: e.target.value,
                              })
                            }
                          >
                            <option value="">Month</option>
                            {MONTHS.map((m) => (
                              <option key={m.val} value={m.val}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.sourceYear || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                sourceYear: e.target.value,
                              })
                            }
                          >
                            <option value="">Year</option>
                            {projectYears.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Month & Year
                        </label>
                        <div className="flex gap-1">
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.targetMonth || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                targetMonth: e.target.value,
                              })
                            }
                          >
                            <option value="">Month</option>
                            {MONTHS.map((m) => (
                              <option key={m.val} value={m.val}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                          <select
                            className="input-style w-1/2 text-[10px]"
                            value={cloneData.targetYear || ""}
                            onChange={(e) =>
                              setCloneData({
                                ...cloneData,
                                targetYear: e.target.value,
                              })
                            }
                          >
                            <option value="">Year</option>
                            {projectYears.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Increase Percentage (%)
                  </label>
                  <input
                    type="number"
                    max="100"
                    className="input-style w-full"
                    value={cloneData.increasePercentage}
                    onChange={(e) =>
                      setCloneData({
                        ...cloneData,
                        increasePercentage: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 bg-gray-50 rounded-b-lg">
                <button
                  onClick={() => setIsCloneModalOpen(false)}
                  className="btn-click bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCloneIncrease(false)}
                  disabled={isLoading}
                  className={`btn-click min-w-[120px] ${!isLoading ? "btn-blue" : "bg-gray-300 text-white cursor-not-allowed"}`}
                >
                  {isLoading ? "Processing..." : "Process Clone"}
                </button>
              </div>
            </div>
          </Draggable>
        </div>
      )}

      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-gray-800">
                  Plan Information
                </h3>
              </div>
              <button
                onClick={() => setAuditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {isAuditLoading ? (
                <div className="text-center py-6 text-sm text-gray-500">
                  Loading audit information...
                </div>
              ) : auditLogs.filter(
                  (item) => item.notes && item.notes.trim() !== "",
                ).length > 0 ? (
                auditLogs
                  .filter((item) => item.notes && item.notes.trim() !== "")
                  .map((item, index) => (
                    <div
                      key={item.auditId || index}
                      className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {item.actionType || "Action Log"}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          Created At:{" "}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                        <span className="font-semibold text-gray-900 block mb-1">
                          Info:
                        </span>
                        <p className="whitespace-pre-line">
                          {item.notes ||
                            "No notes available for this audit record."}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6 text-sm text-gray-500">
                  No audit information available.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end px-5 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setAuditModalOpen(false)}
                className="btn1 bg-gray-800 text-white hover:bg-gray-900 px-4 py-1.5 text-xs rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {importErrorModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 p-2">
          <div className="relative flex flex-col bg-white w-full max-w-3xl h-[600px] rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-3 text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-bold tracking-wide text-red-800">
                    Import Data Validation Failed
                  </h3>
                  <p className="text-xs text-red-600 mt-0.5">
                    Please resolve the conflicts below before re-uploading.
                  </p>
                </div>
              </div>

              {/* Top Close Button */}
              <button
                onClick={() =>
                  setImportErrorModal({
                    isOpen: false,
                    message: "",
                    // details: null,
                  })
                }
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all p-1.5 rounded-full"
                title="Close Modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {/* Main Header Error Summary (with \n parsed safely) */}
              <div className="text-sm font-semibold text-gray-800 mb-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm whitespace-pre-line leading-relaxed border-l-4 border-l-red-500">
                {importErrorModal.message}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-100">
              <button
                type="button"
                onClick={copyErrorsToClipboard}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm"
                title="Copy Error details to Clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy Logs
              </button>
              <button
                type="button"
                onClick={() =>
                  setImportErrorModal({
                    isOpen: false,
                    message: "",
                    // details: null,
                  })
                }
                className="px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 active:bg-black transition-colors shadow-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
