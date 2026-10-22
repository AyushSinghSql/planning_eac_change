import React, { useState, useEffect, useRef } from "react";
import { backendUrl } from "./config";
import {
  ArrowRightLeft,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

export default function ProjectAnalysisDashboard() {
  const [analysisMode, setAnalysisMode] = useState("PROJECT"); // "PROJECT" or "NEW_BUSINESS"
  const [rawData, setRawData] = useState([]); // Keeps V2 data for summary & tracking ring
  const [rawDataV1, setRawDataV1] = useState([]); // NEW: Dedicated state for V1 API responses

  const [nbData, setNbData] = useState([]); // NEW: State for New Business Analysis data[cite: 2]
  const [nbPlans, setNbPlans] = useState([]);
  const [nbPlansV1, setNbPlansV1] = useState([]);
  const [nbSummary, setNbSummary] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [error, setError] = useState(null);

  const [summarySearch, setSummarySearch] = useState("");
  const [approvalSearch, setApprovalSearch] = useState("");
  const [budgetSearch, setBudgetSearch] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
        fullName: userObj.fullName?.toLowerCase() ?? "",
      };
    } catch {
      return { userId: "", role: "", fullName: "" };
    }
  };

  const { userId, role, fullName } = getCurrentUserContext();

  // Load All APIs Required for New Business Analysis
  const loadNewBusinessDashboardData = async () => {
    try {
      setLoading(true);
      const [nbPlansRes, v1Res, summaryRes] = await Promise.all([
        fetch(`${backendUrl}/Project/GetNBPlans/${userId}/${role}/?type=NBBUD`),
        fetch(
          `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/?status=&type=NBBUD`,
        ),
        fetch(`${backendUrl}/GetAllNewBusiness`),
      ]);

      if (!nbPlansRes.ok || !v1Res.ok || !summaryRes.ok) {
        throw new Error("Failed to fetch response from one or more endpoints.");
      }

      const nbPlansData = await nbPlansRes.json();
      const v1Data = await v1Res.json();
      const summaryData = await summaryRes.json();

      setNbPlans(nbPlansData || []);
      setNbPlansV1(v1Data || []);
      setNbSummary(summaryData || []);
    } catch (err) {
      // setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    loadNewBusinessDashboardData().finally(() => setLoading(false));
  }, [analysisMode]);

  // --- ACTIONS ---
  const handleApproveNB = async (plId, projId) => {
    setActionLoadingId(`approve-${plId}`);
    try {
      const targetRecord = nbPlansV1.find((item) => item.plId === plId);
      if (!targetRecord) throw new Error("Target plan record not found.");

      const updatedPayload = {
        ...targetRecord,
        isApproved: true,
        status: "Approved",
        approvedBy: fullName,
      };

      const response = await fetch(`${backendUrl}/Project/UpdateProjectPlan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) throw new Error("Approval failed.");

      toast.success(
        `New Business Plan for project ${projId} has been approved!`,
      );
      await loadNewBusinessDashboardData();
    } catch (err) {
      toast.error(`Approval error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTransfer = async (businessBudgetId) => {
    setActionLoadingId(`transfer-${businessBudgetId}`);
    try {
      alert(`Transfer initialized for Project ID: ${businessBudgetId}`);
      // Add your API endpoint logic for handling Transfer to execution phase here
    } catch (err) {
      alert(`Transfer error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- KPI CALCULATIONS ---
  const totalValue = nbPlans.reduce(
    (acc, curr) => acc + (curr.forecastRevenue || 0),
    0,
  );

  const totalRevenue = nbPlans.reduce(
    (acc, curr) => acc + (curr.revenue || curr.proj_f_tot_amt || 0),
    0,
  );
  const totalLaborCost = nbPlans.reduce(
    (acc, curr) => acc + (curr.forecastedLaborCost || 0),
    0,
  );
  const totalNonLaborCost = nbPlans.reduce(
    (acc, curr) => acc + (curr.forecastedNonLaborCost || 0),
    0,
  );
  const totalIndirect = nbPlans.reduce(
    (acc, curr) => acc + (curr.totalBurden || 0),
    0,
  );
  const opportunitiesCount = nbPlansV1.length;
  const wonOpportunities = nbPlansV1.filter(
    (item) => item.status === "TRANSFERRED",
  ).length;
  const winRate =
    opportunitiesCount > 0 ? (wonOpportunities / opportunitiesCount) * 100 : 0;
  const activeProjects = nbSummary.filter(
    (p) => p.status === "In Progress",
  ).length;

  // --- PIE CHART DATA GENERATORS ---
  // 1. Awarded vs In-Progress Business
  const awardedValue = nbPlansV1
    .filter((item) => item.status === "TRANSFERRED")
    .reduce((acc, curr) => acc + (curr.revenue || curr.proj_f_tot_amt || 0), 0);

  const pipelineValue = totalValue - awardedValue;

  // 2. Revenue Distribution (by Organization/Customer)
  const revenueByOrg = nbPlansV1.reduce((acc, curr) => {
    const key = curr.customer || curr.orgId || "Other";
    acc[key] = (acc[key] || 0) + (curr.contractValue || 0);
    return acc;
  }, {});

  // --- FILTERED LISTS ---
  const pendingApprovals = nbPlansV1.filter(
    (item) => item.status === "Submitted",
  );
  const transferrableProjects = nbPlansV1.filter(
    (item) => item.status === "Concluded",
  );

  const filteredGridData = nbSummary.filter((item) => {
    // 1. Strict status check: Keep only "In Progress" (removes TRANSFERRED, Concluded, etc.)
    const isInProgress = item.status === "In Progress";

    // 2. Search query check
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.businessBudgetId?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query);

    return isInProgress && matchesSearch;
  });

  // Fetch initial dashboard feed data (V2)[cite: 2]
  // const fetchDashboardData = () => {
  //   setLoading2(true);
  //   return fetch(
  //     `${backendUrl}/Project/GetProjectPlansV2/${userId}/${role}/?status=&type=PROJECT`,
  //   )
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  //       return res.json();
  //     })
  //     .then((json) => {
  //       setRawData(json || []);
  //       setLoading2(false);
  //     });
  // };

  // // Fetch initial dashboard feed data (V1) for pending actions[cite: 2]
  // const fetchDashboardData1 = () => {
  //   setLoading3(true);
  //   return fetch(
  //     `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/?status=&type=PROJECT`,
  //   )
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  //       return res.json();
  //     })
  //     .then((json) => {

  //       setRawDataV1(json || []); // Target dedicated V1 state array
  //       setLoading3(false);
  //     });
  // };

  // Define excluded prefixes array outside component or at top level
  const EXCLUDED_PROJECT_CODES = [
    "UNA01",
    "SMH01",
    "FRG01",
    "OVH01",
    "GNA01",
    "LEAVE",
  ];

  // Helper function for clean, fast filtering
  const filterExcludedProjects = (data) => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => {
      if (!item?.projId) return false;
      const upperProjId = item.projId.toUpperCase();
      // Returns true ONLY IF the projId contains NONE of the excluded keywords
      return !EXCLUDED_PROJECT_CODES.some((code) => upperProjId.includes(code));
    });
  };

  // Fetch initial dashboard feed data (V2)
  const fetchDashboardData = () => {
    setLoading2(true);
    return fetch(
      `${backendUrl}/Project/GetProjectPlansV2/${userId}/${role}/?status=&type=PROJECT`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const filtered = filterExcludedProjects(json);
        setRawData(filtered);
        setLoading2(false);
      });
  };

  // Fetch initial dashboard feed data (V1) for pending actions
  const fetchDashboardData1 = () => {
    setLoading3(true);
    return fetch(
      `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/?status=&type=PROJECT`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const filtered = filterExcludedProjects(json);
        setRawDataV1(filtered);
        setLoading3(false);
      });
  };

  // NEW: Fetch New Business Data
  const fetchNewBusinessData = () => {
    setLoading4(false);
    return fetch(
      `${backendUrl}/Project/GetNBPlans/${userId}/${role}/?type=NBBUD`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setNbData(json || []);
        setLoading4(false);
      });
  };

  // Trigger loading state updates depending on the active navigation filter
  // useEffect(() => {
  //   setLoading(true);
  //   setError(null);

  //   if (analysisMode === "PROJECT") {
  //     Promise.all([fetchDashboardData1(), fetchDashboardData()])
  //       .then(() => setLoading(false))
  //       .catch((err) => {
  //         setError(err.message);
  //         setLoading(false);
  //       });
  //   } else {
  //     fetchNewBusinessData()
  //       .then(() => setLoading(false))
  //       .catch((err) => {
  //         setError(err.message);
  //         setLoading(false);
  //       });
  //   }
  // }, [analysisMode]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Waits for ALL 4 requests to complete, regardless of success or failure
        const results = await Promise.allSettled([
          fetchDashboardData(),
          fetchDashboardData1(),
          fetchNewBusinessData(),
          loadNewBusinessDashboardData(),
        ]);

        // Extract any failures from the settled results
        const rejected = results.filter((res) => res.status === "rejected");

        if (rejected.length > 0) {
          // Grab the error message from the first failed request
          const firstErrorMessage = rejected[0].reason?.message;
          setError(
            firstErrorMessage ||
              `${rejected.length} dashboard request(s) failed.`,
          );
        }
      } catch (err) {
        // Catches unexpected synchronous code errors
        setError(err.message || "Failed to load dashboard data.");
      }
    };

    loadData();
  }, [analysisMode]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       if (analysisMode === "PROJECT") {
  //         await Promise.all([fetchDashboardData1(), fetchDashboardData()]);
  //       } else {
  //         await Promise.all([
  //           loadNewBusinessDashboardData(),
  //           fetchNewBusinessData(),
  //         ]);
  //       }
  //     } catch (err) {
  //       setError(err.message || "Failed to load dashboard data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [analysisMode]);

  // --- INTERACTION WORKFLOW HANDLERS ---[cite: 2]

  const handleApprove = async (projectId) => {
    const uniqueId = `approve-${projectId}`;
    setActionLoadingId(uniqueId);
    try {
      const targetRecord = rawDataV1.find(
        (item) =>
          item.projId === projectId &&
          item.status?.toLowerCase() === "submitted",
      );

      if (!targetRecord) {
        throw new Error(
          "Target plan record marked as Submitted could not be located.",
        );
      }

      let updatedPlanPayload = {
        ...targetRecord,
        plId: targetRecord.plId || 0,
        projId: projectId,
        plType: targetRecord.plType,
        templateId: targetRecord.templateId || 1,
        versionCode: targetRecord.versionCode,
        approvedBy: `"${userId}"`,
      };

      updatedPlanPayload.isApproved = true;
      updatedPlanPayload.status = updatedPlanPayload.isApproved
        ? "Approved"
        : "Submitted";
      if (!updatedPlanPayload.isApproved) {
        updatedPlanPayload.finalVersion = false;
      }

      const response = await fetch(`${backendUrl}/Project/UpdateProjectPlan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlanPayload),
      });

      if (!response.ok) {
        throw new Error("Approval update failed on remote API execution.");
      }

      toast.success(`Project ${projectId} approved successfully!`);
      await Promise.all([fetchDashboardData1(), fetchDashboardData()]);
    } catch (err) {
      toast.error(`Error updating project: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreate = async (projectId, calculatedType) => {
    const uniqueId = `create-${projectId}`;
    setActionLoadingId(uniqueId);
    try {
      const referencePlan =
        rawDataV1.find((item) => item.projId === projectId) || {};

      const targetStartDate =
        referencePlan.projStartDt || referencePlan.startDate || "";
      const targetEndDate =
        referencePlan.projEndDt || referencePlan.endDate || "";

      if (!targetStartDate || !targetEndDate) {
        throw new Error(
          "Cannot initialize creation routine: Project lacks historical bounds (Start / End Date).",
        );
      }

      const typeQueryParam = "actual";

      const payloadTemplate = {
        plId: referencePlan.plId || 0,
        projId: projectId,
        plType: calculatedType,
        source: `${referencePlan.plType === "BUD" ? "B" : referencePlan.plType === "EAC" ? "E" : ""}${referencePlan.version || 0}`,
        type: referencePlan.type || "A",
        version: referencePlan.version || 0,
        versionCode: referencePlan.versionCode || "",
        finalVersion: false,
        isCompleted: false,
        isApproved: false,
        status: "In Progress",
        createdBy: referencePlan.createdBy || "User",
        modifiedBy: referencePlan.modifiedBy || "User",
        approvedBy: "",
        templateId: referencePlan.templateId || 1,
        fiscalYear:
          referencePlan.fiscalYear || new Date().getFullYear().toString(),
        projStartDt: targetStartDate,
        projEndDt: targetEndDate,
      };

      const response = await fetch(
        `${backendUrl}/Project/AddProjectPlan?type=${typeQueryParam}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadTemplate),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "AddProjectPlan execution failure on remote endpoint.",
        );
      }

      toast.success(
        `${calculatedType} plan successfully initialized for Project ${projectId}!`,
      );

      await Promise.all([fetchDashboardData1(), fetchDashboardData()]);
    } catch (err) {
      toast.error(`Error initializing plan: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- BUSINESS LOGIC & DATA TRANSFORMATIONS ---[cite: 2]

  const processProjectSummary = () => {
    const groups = {};

    rawData.forEach((item) => {
      if (!groups[item.projId]) {
        groups[item.projId] = [];
      }
      groups[item.projId].push(item);
    });

    const summaryList = [];

    Object.keys(groups).forEach((projId) => {
      const plans = groups[projId];

      let selectedPlan = plans.find(
        (p) => p.plType === "EAC" && p.status === "Concluded",
      );

      if (!selectedPlan) {
        selectedPlan = plans.find(
          (p) => p.plType === "BUD" && p.status === "Concluded",
        );
      }

      if (!selectedPlan) {
        selectedPlan = plans[0];
      }

      const budget = selectedPlan.budgetRevenue || 0;
      const forecast = selectedPlan.forecastRevenue || 0;
      const actual = selectedPlan.actualRevenue || 0;
      const funded = selectedPlan.proj_f_tot_amt || 0;
      const variance = selectedPlan.variance || 0;
      const source = selectedPlan.source;
      const elapsedMonths = selectedPlan.elapsedMonths;
      const projStartDt = selectedPlan.projStartDt;
      const projEndDt = selectedPlan.projEndDt;
      const fundedUtilized = selectedPlan.fundingUtilized || 0;
      const totalBurden = selectedPlan.totalBurden || 0;
      const grossProfitPercentage = selectedPlan.grossProfitPercentage || 0;
      const netProfit = selectedPlan?.netProfit || 0;

      summaryList.push({
        id: projId,
        name: selectedPlan.projName || projId,
        funded,
        budget,
        forecast,
        actual,
        variance,
        source,
        elapsedMonths,
        projStartDt,
        projEndDt,
        fundedUtilized,
        totalBurden,
        grossProfitPercentage,
        netProfit,
        eacDate: selectedPlan.updatedAt
          ? selectedPlan.updatedAt.split("T")[0]
          : "N/A",
      });
    });

    // return summaryList;
    return summaryList.sort((a, b) => b.netProfit - a.netProfit);
  };

  const projectSummaryData = processProjectSummary();

  const pendingApprovalData = rawDataV1
    .filter((item) => item.status?.toLowerCase() === "submitted")
    .map((item) => ({
      id: item.projId,
      startDate: item.projStartDt || "N/A",
      dueDate: item.projEndDt || "N/A",
    }));

  const getPendingBudgetData = () => {
    const activePlanIds = new Set(
      rawDataV1
        .filter(
          (item) =>
            item.plId !== undefined && item.plId !== null && item.plId !== "",
        )
        .map((item) => item.projId),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return rawDataV1
      .filter((item) => {
        if (item.plId) return false;
        if (activePlanIds.has(item.projId)) return false;

        const hasActiveChildNode = Array.from(activePlanIds).some(
          (activeId) =>
            activeId.startsWith(item.projId + ".") ||
            item.projId.startsWith(activeId + "."),
        );

        return !hasActiveChildNode;
      })
      .filter((item) => {
        if (!item.projEndDt) return false;
        const endDate = new Date(item.projEndDt);
        endDate.setHours(0, 0, 0, 0);
        return endDate >= today;
      })
      .map((item) => {
        return {
          id: item.projId,
          startDate: item.projStartDt,
          dueDate: item.projEndDt,
          type: "BUD",
        };
      });
  };
  const pendingBudgetData = getPendingBudgetData();

  const inProgressCount = rawDataV1.filter(
    (p) => p.status?.toLowerCase() === "in progress",
  ).length;
  const submittedCount = pendingApprovalData.length;
  const approvedCount = rawDataV1.filter(
    (p) => p.status?.toLowerCase() === "approved",
  ).length;
  const concludedCount = rawDataV1.filter(
    (p) => p.status?.toLowerCase() === "concluded",
  ).length;

  const totalCount = rawDataV1.length;
  const otherCount = Math.max(
    0,
    inProgressCount + submittedCount + approvedCount + concludedCount,
  );
  const totalStates = totalCount || 1;

  const [activeHover, setActiveHover] = useState(null);
  const ringRef = useRef(null);
  const [selectedSlice, setSelectedSlice] = useState(null);

  const getCenterDisplay = () => {
    switch (activeHover) {
      case "inProgress":
        return { count: inProgressCount, label: "In Progress" };
      case "submitted":
        return { count: submittedCount, label: "Submitted" };
      case "approved":
        return { count: approvedCount, label: "Approved" };
      case "concluded":
        return { count: concludedCount, label: "Concluded" };
      default:
        return { count: otherCount, label: "Total Records" };
    }
  };

  const centerData = getCenterDisplay();

  const handleRingMouseMove = (e) => {
    if (!ringRef.current || totalStates === 0) return;

    const rect = ringRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;

    const currentPercentage = (angle / 360) * 100;

    const ipLimit = (inProgressCount / totalStates) * 100;
    const subLimit = ipLimit + (submittedCount / totalStates) * 100;
    const appLimit = subLimit + (approvedCount / totalStates) * 100;

    if (currentPercentage <= ipLimit) {
      setActiveHover("inProgress");
    } else if (currentPercentage <= subLimit) {
      setActiveHover("submitted");
    } else if (currentPercentage <= appLimit) {
      setActiveHover("approved");
    } else {
      setActiveHover("concluded");
    }
  };

  const formatElapsedMonths = (totalMonths) => {
    if (!totalMonths || totalMonths <= 0) return "0 mos";

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const yearParts = years > 0 ? `${years} ${years === 1 ? "yr" : "yrs"}` : "";
    const monthParts =
      months > 0 ? `${months} ${months === 1 ? "mo" : "mos"}` : "";

    return [yearParts, monthParts].filter(Boolean).join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Split string directly to avoid UTC/timezone offsets shifting the day
    const [year, month, day] = dateString.split("T")[0].split("-");

    if (year && month && day) {
      return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
    }

    // Fallback for standard Date objects or ISO strings
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const yyyy = date.getUTCFullYear();

    return `${mm}/${dd}/${yyyy}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 mt-4">Loading...</span>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="p-6 text-red-600 font-semibold bg-red-50 rounded-md border border-red-200 m-6">
  //       Error loading project analysis data: {error}
  //     </div>
  //   );
  // }

  // Filter datasets depending on active state parameters
  const filteredSummary = projectSummaryData.filter(
    (p) =>
      p.id.toLowerCase().includes(summarySearch.toLowerCase()) ||
      p.name.toLowerCase().includes(summarySearch.toLowerCase()),
  );

  const filteredNB = nbData.filter(
    (p) =>
      (p.projId || "").toLowerCase().includes(summarySearch.toLowerCase()) ||
      (p.projName || "").toLowerCase().includes(summarySearch.toLowerCase()),
  );

  const filteredApproval = pendingApprovalData.filter((p) =>
    p.id.toLowerCase().includes(approvalSearch.toLowerCase()),
  );

  const filteredBudget = pendingBudgetData.filter((p) =>
    p.id.toLowerCase().includes(budgetSearch.toLowerCase()),
  );

  const formatPercent = (amount) => {
    const roundedPercentage = Math.ceil((amount || 0) * 100) / 100;

    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(roundedPercentage / 100);
  };

  return (
    <div className="space-y-2 text-sm sm:text-base text-gray-800 font-inter">
      <div className="flex flex-col gap-2">
        {/* --- DASHBOARD BLOCK HEADER --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-sm p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">
              {analysisMode === "PROJECT"
                ? "Project Console"
                : "New Business Analysis Console"}
            </h2>
          </div>

          {/* TOGGLE ELEMENT: Radio button view selection tab */}
          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 self-end sm:self-auto">
            <button
              onClick={() => setAnalysisMode("PROJECT")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                analysisMode === "PROJECT"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BriefcaseBusiness size={14} />
              Project Analysis
            </button>
            <button
              onClick={() => setAnalysisMode("NEW_BUSINESS")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                analysisMode === "NEW_BUSINESS"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp size={14} />
              New Business Analysis
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
          {/* --- CONDITIONALLY RENDERED DASHBOARDS --- */}
          {analysisMode === "NEW_BUSINESS" ? (
            /* --- NEW BUSINESS ANALYSIS TABLE DASHBOARD --- */
            <div className="space-y-6">
              {/* TOP SECTION: TABLE (3/4 WIDTH) + STATUS PIE CHART (1/4 WIDTH) */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <div className="md:col-span-3 rounded border border-gray-200 p-2 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="mb-2 font-bold text-md">
                      New Business Summary
                    </h2>
                    <input
                      placeholder="Search New Business Proj..."
                      className="mb-2 p-1 border border-gray-300 rounded w-[300px] text-xs"
                      value={summarySearch}
                      onChange={(e) => setSummarySearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[500px] overflow-y-auto border border-gray-200 rounded">
                    <table className="min-w-full table-auto divide-gray-200">
                      <thead className="bg-gray-200 sticky top-0">
                        <tr>
                          <th className="th-thead">Project ID</th>
                          <th className="th-thead">Project Name</th>
                          <th className="th-thead">Status</th>
                          <th className="th-thead">Funding</th>
                          <th className="th-thead">Forecast Revenue</th>
                          <th className="th-thead">Forecasted Labor Cost</th>
                          <th className="th-thead">
                            Forecasted Non-Labor Cost
                          </th>
                          <th className="th-thead">Indirect Cost</th>
                          <th className="th-thead">Funding Utilized</th>
                          <th className="th-thead">Gross Profit Percentage</th>
                          <th className="th-thead">Net Profit Percentage</th>
                          {/* <th className="th-thead">Timeline Bounds</th> */}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {loading || loading2 || loading3 || loading4 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-xs font-semibold text-gray-600">
                                  Fetching New Business Data...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredNB.length === 0 ? (
                          <tr>
                            <td
                              colSpan="9"
                              className="py-8 text-center text-gray-400 italic"
                            >
                              No new business plans matching search criterion.
                            </td>
                          </tr>
                        ) : (
                          filteredNB.map((project, idx) => (
                            <tr
                              key={`${project.projId}-${idx}`}
                              className="hover:bg-blue-50 bg-white"
                            >
                              <td className="px-2 py-2 text-xs font-mono border-r border-b border-gray-300 text-gray-900 text-left">
                                {project.projId}
                              </td>
                              <td className="px-2 py-2 text-xs font-semibold border-r border-b border-gray-300 text-slate-700 text-left">
                                {project.projName}
                              </td>
                              <td className="px-2 py-2 text-xs font-semibold border-r border-b border-gray-300 text-slate-700 text-left">
                                {/* {project.source} */}
                                {project.source
                                  ? project.source.charAt(0).toUpperCase() +
                                    project.source.slice(1).toLowerCase()
                                  : ""}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatCurrency(project.proj_f_tot_amt)}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatCurrency(project.forecastRevenue)}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatCurrency(project.forecastedLaborCost)}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatCurrency(project.forecastedNonLaborCost)}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatCurrency(project.totalBurden)}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatPercent(project.fundingUtilized)}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatPercent(project.grossProfitPercentage)}
                              </td>
                              <td className="px-2 py-2 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right font-mono">
                                {formatPercent(project.profitPercentage)}
                              </td>
                              {/* <td className="px-2 py-2 text-xs font-normal border-b border-gray-300 text-gray-500 text-center text-[11px]">
                            {project.projStartDt} to {project.projEndDt}
                          </td> */}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {(() => {
                  const dataSource = filteredNB || [];

                  // 1. Color palette mapping for known statuses + fallback generator for unexpected values
                  const COLOR_PALETTE = {
                    healthy: {
                      hex: "#10b981",
                      badgeBg: "bg-emerald-50/40",
                      badgeBorder: "border-emerald-100/30",
                      badgeText: "text-emerald-700",
                      countBg: "bg-emerald-100/60",
                    },
                    average: {
                      hex: "#f59e0b",
                      badgeBg: "bg-amber-50/40",
                      badgeBorder: "border-amber-100/30",
                      badgeText: "text-amber-700",
                      countBg: "bg-amber-100/60",
                    },
                    "at risk": {
                      hex: "#ef4444",
                      badgeBg: "bg-red-50/40",
                      badgeBorder: "border-red-100/30",
                      badgeText: "text-red-700",
                      countBg: "bg-red-100/60",
                    },
                    "at-risk": {
                      hex: "#ef4444",
                      badgeBg: "bg-red-50/40",
                      badgeBorder: "border-red-100/30",
                      badgeText: "text-red-700",
                      countBg: "bg-red-100/60",
                    },
                    "not started": {
                      hex: "#6b7280",
                      badgeBg: "bg-slate-50",
                      badgeBorder: "border-slate-200/40",
                      badgeText: "text-slate-700",
                      countBg: "bg-slate-200/60",
                    },
                    "not-started": {
                      hex: "#6b7280",
                      badgeBg: "bg-slate-50",
                      badgeBorder: "border-slate-200/40",
                      badgeText: "text-slate-700",
                      countBg: "bg-slate-200/60",
                    },
                  };

                  const DEFAULT_COLORS = [
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                    "#14b8a6",
                    "#f97316",
                  ];

                  // Helper to format raw source strings nicely (e.g. "at-risk" -> "At Risk")
                  const formatStatusLabel = (str) => {
                    if (!str) return "N/A";
                    return str
                      .replace(/[-_]/g, " ")
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ");
                  };

                  // 2. Dynamically extract distinct status counts
                  const statusCountsMap = dataSource.reduce((acc, proj) => {
                    const rawStatus = (proj.source || "Unknown")
                      .toLowerCase()
                      .trim();
                    acc[rawStatus] = (acc[rawStatus] || 0) + 1;
                    return acc;
                  }, {});

                  const totalProjects = dataSource.length;
                  const totalForCalc = totalProjects || 1;

                  // 3. Build dynamic status breakdown array with calculated cumulative percentage angles
                  let cumulativePct = 0;
                  const statusItems = Object.entries(statusCountsMap).map(
                    ([rawKey, count], index) => {
                      const pct = (count / totalForCalc) * 100;
                      const startPct = cumulativePct;
                      cumulativePct += pct;

                      const palette = COLOR_PALETTE[rawKey] || {
                        hex: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                        badgeBg: "bg-blue-50/40",
                        badgeBorder: "border-blue-100/30",
                        badgeText: "text-blue-700",
                        countBg: "bg-blue-100/60",
                      };

                      return {
                        key: rawKey,
                        label: formatStatusLabel(rawKey),
                        count,
                        pct,
                        startPct,
                        endPct: cumulativePct,
                        color: palette.hex,
                        badgeBg: palette.badgeBg,
                        badgeBorder: palette.badgeBorder,
                        badgeText: palette.badgeText,
                        countBg: palette.countBg,
                      };
                    },
                  );

                  // 4. Build conic-gradient string dynamically
                  const conicGradientString =
                    statusItems.length > 0
                      ? statusItems
                          .map(
                            (item) =>
                              `${item.color} ${item.startPct}% ${item.endPct}%`,
                          )
                          .join(", ")
                      : "#e2e8f0 0% 100%";

                  // 5. Dynamic Hover Data for Pie Center Display
                  const getCenterData = () => {
                    if (activeHover) {
                      const activeItem = statusItems.find(
                        (item) => item.key === activeHover,
                      );
                      if (activeItem) {
                        return {
                          count: activeItem.count,
                          label: activeItem.label,
                        };
                      }
                    }
                    return { count: totalProjects, label: "Total Projects" };
                  };

                  const centerData = getCenterData();

                  // 6. Dynamic Segment Detection on Mouse Move
                  const handleDynamicMouseMove = (e) => {
                    if (!ringRef.current || totalProjects === 0) return;

                    const rect = ringRef.current.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    let angle =
                      Math.atan2(e.clientY - centerY, e.clientX - centerX) *
                      (180 / Math.PI);
                    angle = (angle + 90 + 360) % 360;

                    const currentPercentage = (angle / 360) * 100;

                    const matchedItem = statusItems.find(
                      (item) =>
                        currentPercentage >= item.startPct &&
                        currentPercentage <= item.endPct,
                    );

                    if (matchedItem) {
                      setActiveHover(matchedItem.key);
                    }
                  };

                  return (
                    <div className="flex flex-col items-start rounded border border-gray-200 p-2 bg-white">
                      <h2 className="mb-3 text-md font-bold text-gray-800 self-start">
                        New Business Status
                      </h2>
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="flex flex-col items-center justify-center gap-4 w-full">
                          {/* DYNAMIC PIE CHART RING */}
                          <div
                            ref={ringRef}
                            onMouseMove={handleDynamicMouseMove}
                            onMouseLeave={() => setActiveHover(null)}
                            className={`relative flex h-36 w-36 items-center justify-center rounded-full shadow-sm transition-all duration-300 flex-shrink-0 cursor-pointer bg-slate-50 p-1 ${
                              activeHover ? "scale-[1.03] shadow-md" : ""
                            }`}
                            style={{
                              background: `conic-gradient(${conicGradientString})`,
                            }}
                          >
                            <div className="h-[92px] w-[92px] rounded-full bg-white flex flex-col items-center justify-center shadow-xs border border-slate-100/40 pointer-events-none select-none">
                              <span className="text-2xl font-black text-gray-800 tracking-tight leading-none transition-all duration-150">
                                {centerData.count}
                              </span>
                              <span className="text-[10px] text-gray-400 font-extrabold tracking-widest mt-1 text-center px-1 truncate max-w-full">
                                {centerData.label}
                              </span>
                            </div>
                          </div>

                          {/* DYNAMIC LEGEND CARDS GRID */}
                          <div
                            className={`grid gap-2 w-full ${
                              statusItems.length > 2
                                ? "grid-cols-2"
                                : "grid-cols-1"
                            }`}
                          >
                            {statusItems.map((item) => (
                              <div
                                key={item.key}
                                onMouseEnter={() => setActiveHover(item.key)}
                                onMouseLeave={() => setActiveHover(null)}
                                className={`flex items-center justify-between p-2 rounded-lg ${item.badgeBg} border ${item.badgeBorder} hover:brightness-95 transition-all duration-200 cursor-pointer`}
                              >
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 truncate">
                                  <span
                                    className="h-2 w-2 rounded-full block flex-shrink-0 ring-2 ring-white"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="truncate">{item.label}</span>
                                </div>
                                <span
                                  className={`text-[11px] font-black ${item.badgeText} ${item.countBg} px-1.5 py-0.5 rounded min-w-[20px] text-center ml-1`}
                                >
                                  {item.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Funding</p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Revenue</p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">
                    Labor Cost
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatCurrency(totalLaborCost)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">
                    Non-Labor Cost
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatCurrency(totalNonLaborCost)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">
                    Indirect Cost
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatCurrency(totalIndirect)}
                  </p>
                </div>

                {/* <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">
                    Opportunities
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {opportunitiesCount}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Win Rate</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {winRate.toFixed(0)}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">
                    Avg Margin
                  </p>
                  <p className="text-lg font-bold text-slate-800">42%</p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">
                    Active Projects
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {activeProjects}
                  </p>
                </div> */}
              </div>

              {/* --- SECTION 2: PIE CHARTS & ANALYTICS --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className="text-emerald-600" />{" "}
                    Pending Approval (To-Do)
                  </h3>
                  <div className="max-h-48 overflow-y-auto border border-slate-100 rounded">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="p-2">Proj ID</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Amount</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="p-4 text-center text-slate-400 italic"
                            >
                              No pending approvals
                            </td>
                          </tr>
                        ) : (
                          pendingApprovals.map((item) => (
                            <tr
                              key={item.plId}
                              className="border-t border-slate-100 hover:bg-slate-50"
                            >
                              <td className="p-2 font-mono font-medium">
                                {item.projId}
                              </td>
                              <td className="p-2">{item.projName}</td>
                              <td className="p-2">
                                {formatCurrency(item.proj_f_tot_amt)}
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() =>
                                    handleApproveNB(item.plId, item.projId)
                                  }
                                  disabled={
                                    actionLoadingId === `approve-${item.plId}`
                                  }
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-[11px]"
                                >
                                  Approve
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <ArrowRightLeft size={16} className="text-blue-600" />{" "}
                    Available to Transfer (Concluded)
                  </h3>
                  <div className="max-h-48 overflow-y-auto border border-slate-100 rounded">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="p-2">Proj ID</th>
                          <th className="p-2">Project Name</th>
                          {/* <th className="p-2">Status</th>
                          <th className="p-2 text-center">Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {transferrableProjects.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="p-4 text-center text-slate-400 italic"
                            >
                              No concluded projects ready for transfer
                            </td>
                          </tr>
                        ) : (
                          transferrableProjects.map((item) => (
                            <tr
                              key={item.plId}
                              className="border-t border-slate-100 hover:bg-slate-50"
                            >
                              <td className="p-2 font-mono font-medium">
                                {item.projId}
                              </td>
                              <td className="p-2">{item.projName}</td>
                              {/* <td className="p-2">
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => handleTransfer(item.projId)}
                                  disabled={
                                    actionLoadingId ===
                                    `transfer-${item.projId}`
                                  }
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-[11px]"
                                >
                                  Transfer
                                </button>
                              </td> */}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- ORIGINAL PROJECT SUMMARY VIEW WITH GRIDS AND CHARTS --- */
            <>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <div className="md:col-span-3 rounded border border-gray-200 p-2">
                  <div className="flex items-center justify-between ">
                    <h2 className="mb-2 font-bold text-md">Project Summary</h2>
                    <input
                      placeholder="Search Project..."
                      className="mb-2 p-1 border border-gray-300 rounded w-[300px] text-xs"
                      value={summarySearch}
                      onChange={(e) => setSummarySearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[300px] md:cols-3 overflow-y-auto border border-gray-200 rounded">
                    <table className="min-w-full table-auto divide-gray-200">
                      <thead className="bg-gray-200 sticky top-0">
                        <tr>
                          <th className="th-thead w-10">Project ID</th>
                          <th className="th-thead w-10">Project Name</th>
                          <th className="th-thead w-10">Funding</th>
                          <th className="th-thead w-10">Funding Utilized</th>
                          <th className="th-thead w-10">Project Age</th>
                          <th className="th-thead w-14">Start Date</th>
                          <th className="th-thead w-14">End Date</th>
                          <th className="th-thead w-10">Budget</th>
                          <th className="th-thead w-10">Forecast</th>
                          <th className="th-thead w-10">Actual to Date</th>
                          <th className="th-thead w-10">Variance</th>
                          <th className="th-thead w-10">Net Profit</th>
                          <th className="th-thead w-10">Project Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {loading || loading2 || loading3 || loading4 ? (
                          <tr>
                            <td colSpan="7" className="py-12 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-xs font-semibold text-gray-600">
                                  Fetching Data...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredSummary.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="py-8 text-center text-gray-400 italic"
                            >
                              No Concluded Projects
                            </td>
                          </tr>
                        ) : (
                          filteredSummary.map((project, idx) => {
                            const isAtRisk = project.source === "At Risk";
                            return (
                              <tr
                                key={`${project.id}-${idx}`}
                                className="hover:bg-blue-50 bg-white"
                              >
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-left">
                                  {project.id}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-left">
                                  {project.name}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatCurrency(project.funded)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatPercent(project.fundedUtilized)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatElapsedMonths(project.elapsedMonths)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatDate(project.projStartDt)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatDate(project.projEndDt)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatCurrency(project.budget)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatCurrency(project.forecast)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatCurrency(project.actual)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatCurrency(project.variance)}
                                </td>
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-right">
                                  {formatPercent(project.netProfit)}
                                </td>
                                <td className="tbody-td-fun">
                                  <span
                                    className={`inline-block w-24 py-1 text-center font-semibold rounded text-[11px] border ${
                                      {
                                        "At Risk":
                                          "bg-red-100 text-red-700 border-red-200",
                                        "At-Risk":
                                          "bg-red-100 text-red-700 border-red-200",
                                        Healthy:
                                          "bg-emerald-100 text-emerald-700 border-emerald-200",
                                        Average:
                                          "bg-amber-100 text-amber-700 border-amber-200",
                                        "Not Started":
                                          "bg-slate-100 text-slate-700 border-slate-200",
                                        "Not-Started":
                                          "bg-slate-100 text-slate-700 border-slate-200",
                                      }[project.source] ||
                                      "bg-gray-100 text-gray-700 border-gray-200"
                                    }`}
                                  >
                                    {project.source}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* <div className="flex flex-col items-start rounded border border-gray-200 p-2 bg-white">
                  <h2 className="mb-4 text-md font-bold text-gray-800 self-start">
                    Estimate-to-Complete Tracking
                  </h2>
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex flex-col items-center justify-center gap-6 pt-2 pl-2">
                      <div
                        ref={ringRef}
                        onMouseMove={handleRingMouseMove}
                        onMouseLeave={() => setActiveHover(null)}
                        className={`relative flex h-36 w-36 items-center justify-center rounded-full shadow-sm transition-all duration-300 flex-shrink-0 cursor-pointer bg-slate-50 p-1 ${
                          activeHover ? "scale-[1.03] shadow-md" : ""
                        }`}
                        style={{
                          background: `conic-gradient(
                            #3182ce 0% ${(inProgressCount / totalStates) * 100}%,
                            #dd6b20 ${(inProgressCount / totalStates) * 100}% ${((inProgressCount + submittedCount) / totalStates) * 100}%,
                            #319795 ${((inProgressCount + submittedCount) / totalStates) * 100}% ${((inProgressCount + submittedCount + approvedCount) / totalStates) * 100}%,
                            #4a5568 ${((inProgressCount + submittedCount + approvedCount) / totalStates) * 100}% 100%
                          )`,
                        }}
                      >
                        <div className="h-[96px] w-[96px] rounded-full bg-white flex flex-col items-center justify-center shadow-xs border border-slate-100/40 pointer-events-none select-none">
                          <span className="text-3xl font-black text-gray-800 tracking-tight leading-none transition-all duration-150">
                            {centerData.count}
                          </span>
                          <span className="text-[10px] text-gray-400 font-extrabold tracking-widest mt-1.5 text-center px-1 truncate max-w-full">
                            {centerData.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/40 border border-blue-100/20 hover:bg-blue-50/70 transition-all duration-200">
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#3182ce] block flex-shrink-0 ring-4 ring-blue-50" />
                            <span>In Progress</span>
                          </div>
                          <span className="text-xs font-black text-blue-700 bg-blue-100/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                            {inProgressCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/40 border border-orange-100/20 hover:bg-orange-50/70 transition-all duration-200">
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#dd6b20] block flex-shrink-0 ring-4 ring-orange-50" />
                            <span>Submitted</span>
                          </div>
                          <span className="text-xs font-black text-orange-700 bg-orange-100/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                            {submittedCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/40 border border-teal-100/20 hover:bg-teal-50/70 transition-all duration-200">
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#319795] block flex-shrink-0 ring-4 ring-teal-50" />
                            <span>Approved</span>
                          </div>
                          <span className="text-xs font-black text-teal-700 bg-teal-100/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                            {approvedCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/30 hover:bg-slate-100/60 transition-all duration-200">
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#4a5568] block flex-shrink-0 ring-4 ring-slate-100" />
                            <span>Concluded</span>
                          </div>
                          <span className="text-xs font-black text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                            {concludedCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {(() => {
                  const dataSource = filteredSummary || [];

                  // 1. Calculate status counts based on project.source
                  const healthyCount = dataSource.filter(
                    (p) => p.source === "Healthy",
                  ).length;

                  const averageCount = dataSource.filter(
                    (p) => p.source === "Average",
                  ).length;

                  const atRiskCount = dataSource.filter(
                    (p) => p.source === "At Risk" || p.source === "At-Risk",
                  ).length;

                  const notStartedCount = dataSource.filter(
                    (p) =>
                      p.source === "Not Started" || p.source === "Not-Started",
                  ).length;

                  const totalSourceStates = dataSource.length || 1;

                  // 2. Conic gradient breakpoints
                  const healthyPct = (healthyCount / totalSourceStates) * 100;
                  const averagePct =
                    healthyPct + (averageCount / totalSourceStates) * 100;
                  const atRiskPct =
                    averagePct + (atRiskCount / totalSourceStates) * 100;

                  // 3. Click Segment Detection on Pie Chart Ring
                  const handleSourceRingClick = (e) => {
                    if (dataSource.length === 0) return;

                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const dx = e.clientX - centerX;
                    const dy = e.clientY - centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Strict boundary: Only trigger if clicked on the donut ring band (48px to 73px)
                    // Ignore clicks inside the white center circle (< 48px) or outside the circle (> 73px)
                    if (distance < 48 || distance > 73) {
                      return;
                    }

                    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    angle = (angle + 90 + 360) % 360;

                    const currentPercentage = Math.min(
                      100,
                      Math.max(0, (angle / 360) * 100),
                    );

                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;

                    const segments = [
                      {
                        key: "healthy",
                        label: "Healthy",
                        count: healthyCount,
                        color: "#10b981",
                        start: 0,
                        end: healthyPct,
                      },
                      {
                        key: "average",
                        label: "Average",
                        count: averageCount,
                        color: "#f59e0b",
                        start: healthyPct,
                        end: averagePct,
                      },
                      {
                        key: "atRisk",
                        label: "At Risk",
                        count: atRiskCount,
                        color: "#ef4444",
                        start: averagePct,
                        end: atRiskPct,
                      },
                      {
                        key: "notStarted",
                        label: "Not Started",
                        count: notStartedCount,
                        color: "#6b7280",
                        start: atRiskPct,
                        end: 100,
                      },
                    ];

                    const matched = segments.find(
                      (seg) =>
                        seg.count > 0 &&
                        currentPercentage >= seg.start &&
                        currentPercentage <= seg.end,
                    );

                    if (matched) {
                      setSelectedSlice({
                        key: matched.key,
                        label: matched.label,
                        count: matched.count,
                        color: matched.color,
                        x: clickX,
                        y: clickY,
                      });
                    }
                  };

                  return (
                    <div className="flex flex-col items-start rounded border border-gray-200 p-2 bg-white">
                      <h2 className="mb-4 text-md font-bold text-gray-800 self-start">
                        Project Status Breakdown
                      </h2>
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="flex flex-col items-center justify-center gap-6 pt-2 pl-2 w-full">
                          {/* PIE CHART WRAPPER */}
                          <div className="relative flex flex-col items-center justify-center">
                            {/* DONUT RING */}
                            <div
                              ref={ringRef}
                              onClick={handleSourceRingClick}
                              className="relative flex h-36 w-36 items-center justify-center rounded-full shadow-sm transition-all duration-300 flex-shrink-0 cursor-pointer bg-slate-50 p-1"
                              style={{
                                background: `conic-gradient(
                   #10b981 0% ${healthyPct}%,
                   #f59e0b ${healthyPct}% ${averagePct}%,
                   #ef4444 ${averagePct}% ${atRiskPct}%,
                   #6b7280 ${atRiskPct}% 100%
                 )`,
                              }}
                            >
                              {/* FLOATING BADGE DIRECTLY AT CLICKED SECTION */}
                              {selectedSlice && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute z-30 pointer-events-auto -translate-x-1/2 -translate-y-[calc(100%+6px)] flex flex-col items-center animate-in fade-in zoom-in-95 duration-150"
                                  style={{
                                    left: `${selectedSlice.x}px`,
                                    top: `${selectedSlice.y}px`,
                                  }}
                                >
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 backdrop-blur-sm text-white rounded-md shadow-xl border border-slate-700 text-xs whitespace-nowrap">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                                      style={{
                                        backgroundColor: selectedSlice.color,
                                      }}
                                    />
                                    <span className="font-medium text-slate-300">
                                      {selectedSlice.label}:
                                    </span>
                                    <span className="font-bold text-white text-xs">
                                      {selectedSlice.count}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSlice(null);
                                      }}
                                      className="ml-1 text-slate-400 hover:text-white font-bold leading-none cursor-pointer text-sm"
                                      title="Close"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5 border-r border-b border-slate-700" />
                                </div>
                              )}

                              {/* CENTER WHITE CIRCLE - TOTAL PROJECTS */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSlice(null);
                                }}
                                className="h-[96px] w-[96px] rounded-full bg-white flex flex-col items-center justify-center shadow-xs border border-slate-100/40 select-none cursor-default"
                              >
                                <span className="text-3xl font-black text-gray-800 tracking-tight leading-none transition-all duration-150">
                                  {dataSource.length}
                                </span>
                                <span className="text-[10px] text-gray-400 font-extrabold tracking-widest mt-1.5 text-center px-1 truncate max-w-full">
                                  Total Projects
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* LEGEND CARDS */}
                          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                            {/* HEALTHY */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100/20 hover:bg-emerald-50/70 transition-all duration-200">
                              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] block flex-shrink-0 ring-4 ring-emerald-50" />
                                <span>Healthy</span>
                              </div>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                {healthyCount}
                              </span>
                            </div>

                            {/* AVERAGE */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/40 border border-amber-100/20 hover:bg-amber-50/70 transition-all duration-200">
                              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] block flex-shrink-0 ring-4 ring-amber-50" />
                                <span>Average</span>
                              </div>
                              <span className="text-xs font-black text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                {averageCount}
                              </span>
                            </div>

                            {/* AT RISK */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/40 border border-red-100/20 hover:bg-red-50/70 transition-all duration-200">
                              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] block flex-shrink-0 ring-4 ring-red-50" />
                                <span>At Risk</span>
                              </div>
                              <span className="text-xs font-black text-red-700 bg-red-100/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                {atRiskCount}
                              </span>
                            </div>

                            {/* NOT STARTED */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/30 hover:bg-slate-100/60 transition-all duration-200">
                              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#6b7280] block flex-shrink-0 ring-4 ring-slate-100" />
                                <span>Not Started</span>
                              </div>
                              <span className="text-xs font-black text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                {notStartedCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* --- LOWER ROW: PENDING ACTIONS PANELS --- */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className="md:col-span-5 rounded border border-gray-200 p-2">
                  <div className="flex items-center justify-between ">
                    <h2 className="mb-2 font-bold text-md">Pending Approval</h2>
                    <input
                      placeholder="Search Project..."
                      className="mb-2 p-1 border border-gray-300 rounded w-[300px] text-xs"
                      value={approvalSearch}
                      onChange={(e) => setApprovalSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded">
                    <table className="min-w-full table-auto divide-gray-200">
                      <thead className="bg-gray-200 sticky top-0">
                        <tr>
                          <th className="th-thead">Project ID</th>
                          <th className="th-thead">Start Date</th>
                          <th className="th-thead">End Date</th>
                          <th className="th-thead">Approve</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {loading || loading2 || loading3 || loading4 ? (
                          <tr>
                            <td colSpan="11" className="py-12 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-xs font-semibold text-gray-600">
                                  Fetching Data...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredApproval.length === 0 ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="py-8 text-center text-gray-400 italic"
                            >
                              No pending approvals
                            </td>
                          </tr>
                        ) : (
                          filteredApproval.map((row, index) => {
                            const isBtnLoading =
                              actionLoadingId === `approve-${row.id}`;
                            return (
                              <tr
                                key={`pending-app-${index}`}
                                className="hover:bg-blue-50 bg-white"
                              >
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-left">
                                  {row.id}
                                </td>
                                <td className="tbody-td-fun">
                                  {row.startDate}
                                </td>
                                <td className="tbody-td-fun">{row.dueDate}</td>
                                <td className="tbody-td-fun">
                                  <button
                                    disabled={actionLoadingId !== null}
                                    onClick={() => handleApprove(row.id)}
                                    className="btn1 btn-blue"
                                  >
                                    {isBtnLoading ? (
                                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                      "Approve"
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="md:col-span-7 rounded border border-gray-200 p-2">
                  <div className="flex items-center justify-between ">
                    <h2 className="mb-2 font-bold text-md">Pending Budget</h2>
                    <input
                      placeholder="Search Project..."
                      className="mb-2 p-1 border border-gray-300 rounded w-[300px] text-xs"
                      value={budgetSearch}
                      onChange={(e) => setBudgetSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded">
                    <table className="min-w-full table-auto divide-gray-200">
                      <thead className="bg-gray-200 sticky top-0">
                        <tr>
                          <th className="th-thead">Project ID</th>
                          <th className="th-thead">Start Date</th>
                          <th className="th-thead">End Date</th>
                          <th className="th-thead">Type</th>
                          <th className="th-thead">Create</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {loading || loading2 || loading3 || loading4 ? (
                          <tr>
                            <td colSpan="4" className="py-12 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-xs font-semibold text-gray-600">
                                  Fetching New Business Data...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredBudget.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="py-8 text-center text-gray-400 italic"
                            >
                              No pending budgets or EACs
                            </td>
                          </tr>
                        ) : (
                          filteredBudget.map((row, index) => {
                            const isBtnLoading =
                              actionLoadingId === `create-${row.id}`;
                            return (
                              <tr
                                key={`pending-bud-${index}`}
                                className="hover:bg-blue-50 bg-white"
                              >
                                <td className="px-2 py-1 text-xs font-normal border-r border-b border-gray-300 text-gray-900 text-left">
                                  {row.id}
                                </td>
                                <td className="tbody-td-fun">
                                  {row.startDate}
                                </td>
                                <td className="tbody-td-fun">{row.dueDate}</td>
                                <td className="tbody-td-fun">{row.type}</td>
                                <td className="tbody-td-fun">
                                  <button
                                    disabled={actionLoadingId !== null}
                                    onClick={() =>
                                      handleCreate(row.id, row.type)
                                    }
                                    className="btn1 btn-blue"
                                  >
                                    {isBtnLoading ? (
                                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                      "Create"
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sm:p-2 rounded p-1 bg-white mb-1">
          <div className="flex flex-wrap items-start gap-x-1 text-[12px] text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Notes:</span>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span>
                  Funding Utilized is calculated as (Revenue Consumed / Funding
                  Available to Date) × 100.
                </span>
                <span>
                  Funding Available to Date = (Total Project Funding / Total
                  Project Months) × Elapsed Months.
                </span>
              </div>
              <div className="flex gap-1">
                <span>
                  <strong>At Risk:</strong> utilization below 75% or consumption
                  exceeds available funding;
                </span>
                <span>
                  <strong>Average:</strong> 75%–90%;
                </span>
                <span>
                  <strong>Healthy:</strong> above 90%;
                </span>
                <span>
                  <strong>Not Started:</strong> project has not started.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
