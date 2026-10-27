import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProjectPlanForm from "./ProjectPlanForm";
import NewBusiness from "./NewBusiness";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "./utils";
import { backendUrl } from "./config";
import { SlCalender } from "react-icons/sl";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const BOOLEAN_FIELDS = ["finalVersion", "isCompleted", "isApproved"];

const COLUMN_LABELS = {
  projId: "Project ID",
  projName: "Project Name",
  plType: "BUD/EAC",
  version: "Revision",
  versionCode: "Version Type",
  revenueFormula: "Rev Formula",
  source: "Origin",
  finalVersion: "Concluded",
  isCompleted: "Submitted",
  isApproved: "Approved",
  status: "Status",
  templateId: "Burden Type",
  type: "Revenue Method",
  closedPeriod: "Closed Period",
  projectStartDate: "Project Start Date",
  projectEndDate: "Project End Date",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

const ProjectPlanTable = forwardRef(
  (
    {
      onPlanSelect,
      selectedPlan,
      projectId,
      fiscalYear,
      setFiscalYear,
      fiscalYearOptions,
      searched,
      filteredProjects,
      onPlanCreated,
      onOpenDetails,
      onOpenMonthly,
      onExportPlan,
      onImportPlan,
      status,
      setSearchTerm,
      fetchNewBussiness,
      statusFilter,
      setStatusFilter,
      typeFilter,
      setTypeFilter,
      type,
    },
    ref,
  ) => {
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const fileInputRef = useRef(null);
    const [lastImportedVersion, setLastImportedVersion] = useState(null);
    const [lastImportTime, setLastImportTime] = useState(null);
    const [editingVersionCodeIdx, setEditingVersionCodeIdx] = useState(null);
    const [editingVersionCodeValue, setEditingVersionCodeValue] = useState("");
    const [budEacFilter, setBudEacFilter] = useState(false);
    const [showNewBusinessPopup, setShowNewBusinessPopup] = useState(false);
    const [editingDates, setEditingDates] = useState({});
    const [allProjectPlans, setAllProjectPlans] = useState([]);
    const [versionData, setVersionData] = useState([]);
    const [action, setAction] = useState("");
    const [existingProjectsList, setExistingProjectsList] = useState([]);
    const [importErrorModal, setImportErrorModal] = useState({
      isOpen: false,
      message: "",
      // details: null,
    });
    const [revFormulas, setRevFormulas] = useState([]);
    const [revFormFilter, setRevFormFilter] = useState("");

    const [allData, setAllData] = useState([]);
    const { visibility, canView, canEdit } = useOutletContext();

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(30);
    const [totalPages, setTotalPages] = useState(0); // Update this from your
    const [totalRecords, setTotalRecords] = useState(0);
    // API response
    const [goToValue, setGoToValue] = useState("");
    const [clientIp, setClientIp] = useState("");

    const [manualProjectDates, setManualProjectDates] = useState({
      startDate: "",
      endDate: "",
    });
    const [manualDatesSubmitted, setManualDatesSubmitted] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [templateMap, setTemplateMap] = useState({});
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [auditModal, setAuditModal] = useState({
      isOpen: false,
      loading: false,
      data: [],
      planId: null,
    });
    const [luminaPeoplePlan, setLuminaPeoplePlan] = useState(false);

    const [dateModal, setDateModal] = useState({
      isOpen: false,
      action: "",
      plan: null,
      startDate: "",
      endDate: "",
    });

    const isLumina = import.meta.env.VITE_CLIENT_ID === "LUMINA";

    // --- Escalation Config State ---
    const [escalationConfigs, setEscalationConfigs] = useState({
      escallation_percent: "",
      nonlabor_escallation_percent: "",
      vendor_escallation_percent: "",
    });

    const [carryForwardPriorYear, setCarryForwardPriorYear] = useState(false);
    // const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
    const [selectedFiscalYear, setSelectedFiscalYear] = useState(
      fiscalYearOptions[1] || "",
    );
    const [carryForwardType, setCarryForwardType] = useState("source");

    const handleFetchAuditLogs = async (plan) => {
      const planId = plan.plId; // Ensure this maps to your plan ID field
      if (!planId) {
        toast.error("Plan ID is missing.");
        return;
      }

      setAuditModal({
        isOpen: true,
        loading: true,
        data: [],
        planId,
        projId: plan.projId, // <-- Store it here
        versionCode: plan.version, // <-- Store it here
      });

      try {
        const res = await axios.get(
          `${backendUrl}/AuditTable/GetByPlanId/${planId}`,
          // `https://localhost:58652/AuditTable/GetByPlanId/2918`,
        );
        setAuditModal((prev) => ({
          ...prev,
          loading: false,
          data: res.data || [],
        }));
      } catch (error) {
        console.error("Error fetching audit details:", error);
        toast.error("Failed to fetch audit logs.");
        setAuditModal((prev) => ({ ...prev, loading: false }));
      }
    };

    useEffect(() => {
      const activeProjId = selectedPlan?.projId || projectId;
      if (activeProjId) {
        axios
          // .get(`${backendUrl}/Project/GetEscalationConfigs/${activeProjId}`)
          .get(
            `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
          )
          .then((res) => {
            if (Array.isArray(res.data) && res.data.length > 0) {
              const newConfigs = { ...escalationConfigs };
              res.data.forEach((item) => {
                if (item.name in newConfigs) {
                  newConfigs[item.name] = item.value;
                }
              });
              setEscalationConfigs(newConfigs);
            }
          })
          .catch((err) =>
            console.error("Error fetching escalation configs:", err),
          );
      }
    }, [selectedPlan?.projId, projectId]);

    // Add this with your other useRef hooks
    const tableContainerRef = useRef(null);

    const lastSelectedPlanRef = useRef(null);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const isEditable =
      type === "PROJECT"
        ? canEdit("planProjet")
        : type === "NBBUD"
          ? canEdit("planNewBusiness")
          : canEdit("planOpportunity");

    const handleMouseDown = (e) => {
      dragging.current = true;
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    };

    // --- Handlers ---
    const handlePageClick = (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    };

    // const handleGoTo = (e) => {
    //   if (e.key === "Enter") {
    //     e.preventDefault();
    //     const val = parseInt(goToValue);
    //     if (val >= 1 && val <= totalPages) {
    //       setCurrentPage(val);
    //       // setGoToValue("");
    //     }
    //   }
    // };

    const handleGoTo = (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Stop form submission if wrapped in a form tag
        const val = parseInt(goToValue, 10);
        if (!isNaN(val) && val >= 1 && val <= totalPages) {
          setCurrentPage(val);
        } else {
          toast.warning(
            `Please enter a page number between 1 and ${totalPages}`,
          );
        }
      }
    };

    const handleMouseMove = (e) => {
      if (!dragging.current) return;

      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    useEffect(() => {
      const getVersionData = async () => {
        try {
          const res = await axios.get(
            `${backendUrl}/Orgnization/GetAllVersionCodes`,
          );
          setVersionData(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getVersionData();
    }, []);

    useEffect(() => {
      fetch(`${backendUrl}/RevFormula`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRevFormulas(data);
          }
        })
        .catch((err) => console.error("Error fetching formulas:", err));
    }, []);

    // Update your fetch function or create a dedicated one for the dropdown
    const fetchExistingProjectList = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/Project/MassUtilityGetAllPlans?UserId=${userId}&Role=${role}`,
          {
            params: {
              search: "",
              type: "",
              status: "", // Filter for approved plans to copy from
              active: "",
            },
          },
        );
        if (response.data) {
          setExistingProjectsList(response.data);
        }
      } catch (err) {
        console.error("Error fetching projects for dropdown:", err);
      }
    };

    // Call this when the component mounts or when the "Add" button is clicked
    useEffect(() => {
      fetchExistingProjectList();
    }, []);

    useEffect(() => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    }, []);

    useEffect(() => {
      const lastPlId = sessionStorage.getItem("lastSelectedPlanId");

      if (!lastPlId || plans.length === 0) return;

      // 👇 freeze window scroll position
      const windowScrollY = window.scrollY;

      const timer = setTimeout(() => {
        window.scrollTo({ top: windowScrollY });

        const rowElement = document.getElementById(`plan-row-${lastPlId}`);
        const container = tableContainerRef.current;

        if (rowElement && container) {
          const rowTop = rowElement.offsetTop - container.offsetTop;

          const scrollPosition =
            rowTop - container.clientHeight / 2 + rowElement.clientHeight / 2;

          container.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });

          sessionStorage.removeItem("lastSelectedPlanId");
        }
      }, 10);

      return () => clearTimeout(timer);
    }, [plans, filteredPlans]);

    useEffect(() => {
      const fetchTemplates = async () => {
        try {
          const res = await axios.get(
            `${backendUrl}/Orgnization/GetAllTemplates`,
          );
          const data = Array.isArray(res.data) ? res.data : [];
          setTemplates(data);

          const map = {};
          data.forEach((t) => {
            // choose what to display; here using templateCode - description
            // map[t.id] = `${t.templateCode} - ${t.description}`;
            map[t.id] = `${t.templateCode}`;
          });
          setTemplateMap(map);
        } catch (err) {
          // toast.error("Failed to load templates.");
        }
      };

      fetchTemplates();
    }, []);

    useEffect(() => {
      const userString = localStorage.getItem("currentUser");
      if (userString) {
        try {
          const userObj = JSON.parse(userString);
          setUserName(userObj.name ? capitalizeWords(userObj.name) : null);
          setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
        } catch {
          setCurrentUserRole(null);
        }
      }
    }, []);

    //   const handleTemplateChange = async (plan, newTemplateId) => {
    //    if (!plan.plType) {
    //    setPlans((prev) =>
    //       prev.map((p) =>
    //         p.plId === plan.plId && p.projId === plan.projId
    //           ? { ...p, templateId: parsedId }
    //           : p
    //       )
    //     );
    //   return;
    // }
    //     // 1. Existing check for status
    //     if (plan.status !== "In Progress") {
    //       toast.warning(
    //         "Template can only be changed when status is In Progress."
    //       );
    //       return;
    //     }

    //     const parsedId = Number(newTemplateId) || 0;
    //     const templateName = templateMap[parsedId] || "Selected Template";

    //     // 2. Confirmation Step
    //     const confirmChange = window.confirm(
    //       `Are you sure you want to change the template for ${plan.projId} to "${templateName}"?`
    //     );

    //     if (!confirmChange) {
    //       // If user cancels, we do nothing (the dropdown will stay at its previous value
    //       // because we haven't updated the state yet)
    //       return;
    //     }

    //     // 3. Update local state
    //     setPlans((prev) =>
    //       prev.map((p) =>
    //         p.plId === plan.plId && p.projId === plan.projId
    //           ? { ...p, templateId: parsedId }
    //           : p
    //       )
    //     );
    //     setFilteredPlans((prev) =>
    //       prev.map((p) =>
    //         p.plId === plan.plId && p.projId === plan.projId
    //           ? { ...p, templateId: parsedId }
    //           : p
    //       )
    //     );

    //     // 4. Update selectedPlan if necessary
    //     if (
    //       selectedPlan &&
    //       selectedPlan.plId === plan.plId &&
    //       selectedPlan.projId === plan.projId
    //     ) {
    //       if (typeof onPlanSelect === "function") {
    //         onPlanSelect({ ...plan, templateId: parsedId });
    //       }
    //     }

    //     // 5. Backend update
    //     try {
    //       await axios.put(`${backendUrl}/Project/UpdateProjectPlan`, {
    //         plId: plan.plId,
    //         projId: plan.projId,
    //         templateId: parsedId,
    //       });
    //       toast.success("Template updated successfully.");
    //     } catch (err) {
    //       toast.error("Failed to update template in the database.");

    //       // Optional: Revert local state on failure
    //       fetchPlans();
    //     }
    //   };

    const handleTemplateChange = async (plan, newTemplateId) => {
      // 1. Move initialization to the top
      const parsedId = Number(newTemplateId) || 0;

      // 2. Handle new rows (No plType)
      // If no plType exists, we only update local state and skip confirmation/backend
      if (!plan.plType) {
        setPlans((prev) =>
          prev.map((p) =>
            p.plId === plan.plId && p.projId === plan.projId
              ? { ...p, templateId: parsedId }
              : p,
          ),
        );
        // Also update filtered plans so the UI reflects the change immediately
        setFilteredPlans((prev) =>
          prev.map((p) =>
            p.plId === plan.plId && p.projId === plan.projId
              ? { ...p, templateId: parsedId }
              : p,
          ),
        );
        return;
      }

      // 3. Existing check for status (only for rows that have a plType)
      if (plan.status !== "In Progress") {
        toast.warning(
          "Template can only be changed when status is In Progress.",
        );
        return;
      }

      const templateName = templateMap[parsedId] || "Selected Template";

      // 4. Confirmation Step
      const confirmChange = window.confirm(
        `Are you sure you want to change the template for ${plan.projId} to "${templateName}"?`,
      );

      if (!confirmChange) return;

      // 5. Update local state
      const updateLocal = (prev) =>
        prev.map((p) =>
          p.plId === plan.plId && p.projId === plan.projId
            ? { ...p, templateId: parsedId }
            : p,
        );

      setPlans(updateLocal);
      setFilteredPlans(updateLocal);

      // 6. Update selectedPlan if necessary
      if (
        selectedPlan &&
        selectedPlan.plId === plan.plId &&
        selectedPlan.projId === plan.projId
      ) {
        if (typeof onPlanSelect === "function") {
          onPlanSelect({ ...plan, templateId: parsedId });
        }
      }

      // 7. Backend update
      try {
        await axios.put(
          `${backendUrl}/Project/UpdateProjectPlanTemplateRateType`,
          {
            plId: plan.plId,
            projId: plan.projId,
            templateId: parsedId,
            type: plan.type,
          },
        );
        toast.success("Template updated successfully.");
      } catch (err) {
        toast.error("Failed to update template in the database.");
        if (typeof fetchPlans === "function") fetchPlans();
      }
    };

    const handleRevenueType = async (plan, selectedValue) => {
      // 1. Identify labels for the confirmation message
      const typeLabels = {
        A: "Actual",
        T: "Target",
        // "": "None",
      };
      const selectedLabel = typeLabels[selectedValue] || "Selected Type";

      // 2. Handle new rows (No plType exists yet)
      if (!plan.plType) {
        const updateLocalOnly = (prev) =>
          prev.map((p) =>
            p.plId === plan.plId && p.projId === plan.projId
              ? { ...p, type: selectedValue }
              : p,
          );
        setPlans(updateLocalOnly);
        setFilteredPlans(updateLocalOnly);
        return;
      }

      // 3. Status check for existing plans
      if (plan.status !== "In Progress") {
        toast.warning(
          "Revenue Method can only be changed when status is In Progress.",
        );
        return;
      }

      // 4. Confirmation Step
      const confirmChange = window.confirm(
        `Are you sure you want to change the type for ${plan.projId} to "${selectedLabel}"?`,
      );
      if (!confirmChange) return;

      // 5. Update Local States
      const updateWithBackendData = (prev) =>
        prev.map((p) =>
          p.plId === plan.plId && p.projId === plan.projId
            ? { ...p, type: selectedValue }
            : p,
        );

      setPlans(updateWithBackendData);
      setFilteredPlans(updateWithBackendData);

      // 6. Sync with the selectedPlan if this is the active row
      if (
        selectedPlan?.plId === plan.plId &&
        selectedPlan?.projId === plan.projId
      ) {
        if (typeof onPlanSelect === "function") {
          onPlanSelect({ ...plan, type: selectedValue });
        }
      }

      // 7. Backend API Call
      try {
        await axios.put(
          `${backendUrl}/Project/UpdateProjectPlanTemplateRateType
 `,
          {
            plId: plan.plId,
            projId: plan.projId,
            templateId: plan.templateId,
            type: selectedValue, // This passes "A" or "T"
          },
        );
        toast.success(`Revenue Method updated to ${selectedLabel}.`);
      } catch (err) {
        console.error("Update failed", err);
        toast.error("Failed to update type in database.");
        // Revert UI if fetchPlans is available
        if (typeof fetchPlans === "function") fetchPlans();
      }
    };
    //   const handleTemplateChange = async (plan, newTemplateId) => {

    //      if (plan.status !== "In Progress") {
    //     toast.warning("Template can only be changed when status is In Progress.");
    //     return;
    //   }

    //   const parsedId = Number(newTemplateId) || 0;

    //   // update local state first
    //   setPlans((prev) =>
    //     prev.map((p) =>
    //       p.plId === plan.plId && p.projId === plan.projId
    //         ? { ...p, templateId: parsedId }
    //         : p
    //     )
    //   );
    //   setFilteredPlans((prev) =>
    //     prev.map((p) =>
    //       p.plId === plan.plId && p.projId === plan.projId
    //         ? { ...p, templateId: parsedId }
    //         : p
    //     )
    //   );

    //   // optionally update selectedPlan if this is the selected one
    //   if (selectedPlan && selectedPlan.plId === plan.plId && selectedPlan.projId === plan.projId) {
    //     if (typeof onPlanSelect === "function") onPlanSelect({ ...plan, templateId: parsedId });
    //   }

    //   // call backend if you have an endpoint to save templateId
    //   try {
    //     await axios.put(`${backendUrl}/Project/UpdateProjectPlan`, {
    //       plId: plan.plId,
    //       projId: plan.projId,
    //       templateId: parsedId,

    //     });
    //     toast.success("Template updated.");
    //   } catch (err) {
    //     toast.error("Failed to update template.");
    //   }
    // };

    // Track last fetched project ID and full ID

    const lastFetchedProjectId = useRef(null);
    const lastFetchedPage = useRef(null);
    const fullProjectId = useRef(null);

    // Ref mirror of manual dates (used for non-reactive flows)
    // const tempManualDatesRef = useRef({ startDate: "", endDate: "" });
    const tempManualDatesRef = useRef({ startDate: "", endDate: "" });

    const isChildProjectId = (projId) => {
      return projId && typeof projId === "string" && projId.includes(".");
    };

    const formatDateWithTime = (dateStr) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      } catch (e) {
        return dateStr;
      }
    };

    const formatDateOnly = (value) => {
      if (!value) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-");
        return `${month}/${day}/${year}`;
      }
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        const y = date.getUTCFullYear();
        const m = date.getUTCMonth() + 1;
        const d = date.getUTCDate();
        return `${m < 10 ? "0" + m : m}/${d < 10 ? "0" + d : d}/${y}`;
      } catch (e) {
        return value;
      }
    };

    //     const formatDateOnly = (value) => {
    //   if (!value) return "";

    //   // Handle yyyy-mm-dd explicitly
    //   if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    //     const [year, month, day] = value.split("-");
    //     return `${month}/${day}/${year}`;
    //   }

    //   try {
    //     const date = new Date(value);
    //     if (isNaN(date.getTime())) return value;

    //     return date.toLocaleDateString("en-US", {
    //       timeZone: "America/New_York",
    //       year: "numeric",
    //       month: "2-digit",
    //       day: "2-digit",
    //     });
    //   } catch {
    //     return value;
    //   }
    // };

    const sortPlansByProjIdPlTypeVersion = (plansArray) => {
      return [...plansArray].sort((a, b) => {
        if (a.projId < b.projId) return -1;
        if (a.projId > b.projId) return 1;
        if (a.plType < b.plType) return -1;
        if (a.plType > b.plType) return 1;
        const aVersion = Number(a.version) || 0;
        const bVersion = Number(b.version) || 0;
        return aVersion - bVersion;
      });
    };

    useEffect(() => {
      if (filteredProjects.length > 0) {
        const project = filteredProjects[0];
        const hasStartDate = project.startDate || project.projStartDt;
        const hasEndDate = project.endDate || project.projEndDt;

        const initialDates = {
          startDate: hasStartDate || "",
          endDate: hasEndDate || "",
        };

        setManualProjectDates(initialDates);
        tempManualDatesRef.current = initialDates;

        setColumns([
          "projId",
          "projName",
          "plType",
          "version",
          "versionCode",
          "revenueFormula",
          "source",
          "isCompleted",
          "isApproved",
          "finalVersion",
          "status",
          "templateId",
          "type",
          "closedPeriod",
          "projectStartDate",
          "projectEndDate",
        ]);
      } else {
        setColumns([
          "projId",
          "projName",
          "plType",
          "version",
          "versionCode",
          "revenueFormula",
          "source",
          "isCompleted",
          "isApproved",
          "finalVersion",
          "status",
          "templateId",
          "type",
          "closedPeriod",
          "projectStartDate",
          "projectEndDate",
        ]);
        setManualProjectDates({ startDate: "", endDate: "" });
      }
    }, [filteredProjects, projectId]);

    const getAllPlans = async () => {
      try {
        const term = "";
        console.log("calling");

        const apiType = type === "NBBUDPRICING" ? "NBBUD" : type;
        // Note: ensure userId, role, and status are available in this scope
        const response = await axios.get(
          `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/${term}?status=${status}&type=${apiType}`,
        );

        const transformedPlans = response.data.map((plan) => ({
          plId: plan.plId || plan.id || 0,
          projId:
            plan.fullProjectId ||
            plan.projId ||
            plan.project_id ||
            plan.projectId ||
            projectId,
          projName: plan.projName || plan.description || plan.desc || "",
          plType:
            plan.plType === "Budget"
              ? "BUD"
              : plan.plType === "EAC"
                ? "EAC"
                : plan.plType || "",
          source: plan.source || "",
          version: plan.version || 0,
          versionCode: plan.versionCode || "",
          finalVersion: !!plan.finalVersion,
          isCompleted: !!plan.isCompleted,
          isApproved: !!plan.isApproved,
          status:
            plan.plType && plan.version
              ? (plan.status || "In Progress")
                  .replace("Working", "In Progress")
                  .replace("Completed", "Submitted")
              : "",
          closedPeriod: plan.closedPeriod || "",
          templateId: plan.templateId || "",
          createdAt: plan.createdAt || "",
          updatedAt: plan.updatedAt || "",
          modifiedBy: plan.modifiedBy || "",
          approvedBy: plan.approvedBy || "",
          createdBy: plan.createdBy || "",
          projStartDt: plan.projStartDt || "",
          projEndDt: plan.projEndDt || "",
          orgId: plan.orgId || "",
          fundedCost: plan.proj_f_cst_amt || "",
          fundedFee: plan.proj_f_fee_amt || "",
          fundedRev: plan.proj_f_tot_amt || "",
          revenueAccount: plan.revenueAccount || "",
          Rev: plan.revenue || plan.Rev || "",
          revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
          revenueFormula: plan.revenueFormula || "",
          acctGrpCd: plan.acctGrpCd || "",
        }));

        const sortedPlans = sortPlansByProjIdPlTypeVersion(transformedPlans);
        setAllProjectPlans(sortedPlans);
        return sortedPlans; // Return for immediate use in handleActionSelect
      } catch (error) {
        console.error("Error refreshing all plans:", error);
        return [];
      }
    };

    const getAllPlan = async () => {
      try {
        const term = "";
        console.log("calling");
        const apiType = type === "NBBUDPRICING" ? "NBBUD" : type;
        // Note: ensure userId, role, and status are available in this scope
        const response = await axios.get(
          `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/${term}?status=&type=${apiType}`,
        );

        const transformedPlans = response.data.map((plan) => ({
          plId: plan.plId || plan.id || 0,
          projId:
            plan.fullProjectId ||
            plan.projId ||
            plan.project_id ||
            plan.projectId ||
            projectId,
          projName: plan.projName || plan.description || plan.desc || "",
          plType:
            plan.plType === "Budget"
              ? "BUD"
              : plan.plType === "EAC"
                ? "EAC"
                : plan.plType || "",
          source: plan.source || "",
          version: plan.version || 0,
          versionCode: plan.versionCode || "",
          finalVersion: !!plan.finalVersion,
          isCompleted: !!plan.isCompleted,
          isApproved: !!plan.isApproved,
          status:
            plan.plType && plan.version
              ? (plan.status || "In Progress")
                  .replace("Working", "In Progress")
                  .replace("Completed", "Submitted")
              : "",
          closedPeriod: plan.closedPeriod || "",
          templateId: plan.templateId || "",
          createdAt: plan.createdAt || "",
          updatedAt: plan.updatedAt || "",
          modifiedBy: plan.modifiedBy || "",
          approvedBy: plan.approvedBy || "",
          createdBy: plan.createdBy || "",
          projStartDt: plan.projStartDt || "",
          projEndDt: plan.projEndDt || "",
          orgId: plan.orgId || "",
          fundedCost: plan.proj_f_cst_amt || "",
          fundedFee: plan.proj_f_fee_amt || "",
          fundedRev: plan.proj_f_tot_amt || "",
          revenueAccount: plan.revenueAccount || "",
          Rev: plan.revenue || plan.Rev || "",
          revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
          acctGrpCd: plan.acctGrpCd || "",
          revenueFormula: plan.revenueFormula || "",
        }));

        const sortedPlans = sortPlansByProjIdPlTypeVersion(transformedPlans);
        setAllProjectPlans(sortedPlans);
        setAllData(sortedPlans);
        return sortedPlans; // Return for immediate use in handleActionSelect
      } catch (error) {
        console.error("Error refreshing all plans:", error);
        return [];
      }
    };

    // Update your useEffect to use this new function
    useEffect(() => {
      getAllPlan();
    }, []);

    const fetchPlans = async () => {
      if (!searched && projectId.trim() === "") {
        setPlans([]);
        setFilteredPlans([]);
        setLoading(false);
        lastFetchedProjectId.current = null;
        fullProjectId.current = null;
        return;
      }

      // if (lastFetchedProjectId.current === projectId) {
      //   setLoading(false);
      //   return;
      // }

      if (
        lastFetchedProjectId.current === projectId &&
        lastFetchedPage.current === currentPage
      ) {
        setLoading(false);
        return;
      }

      fullProjectId.current = projectId;
      const encodedProjId = encodeURIComponent(projectId);

      setLoading(true);
      const apiType = type === "NBBUDPRICING" ? "NBBUD" : type;
      try {
        const response = await axios.get(
          // `${backendUrl}/Project/GetProjectPlans/${projectId}`
          `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/${encodedProjId}?status=${status}&type=${apiType}`,
          // `${backendUrl}/Project/GetProjectPlansPaged/${userId}/${role}/${encodedProjId}?fetchNewBussiness=N&pageNumber=${currentPage}&pageSize=${pageSize}`,
        );

        const transformedPlans = response.data.map((plan, idx) => ({
          plId: plan.plId || plan.id || 0,
          projId:
            plan.fullProjectId ||
            plan.projId ||
            plan.project_id ||
            plan.projectId ||
            projectId,
          // projName: plan.projName || "",
          projName: plan.projName || plan.description || plan.desc || "",
          plType:
            plan.plType === "Budget"
              ? "BUD"
              : plan.plType === "EAC"
                ? "EAC"
                : plan.plType || "",
          source: plan.source || "",
          version: plan.version || 0,
          versionCode: plan.versionCode || "",
          finalVersion: !!plan.finalVersion,
          isCompleted: !!plan.isCompleted,
          isApproved: !!plan.isApproved,
          status:
            plan.plType && plan.version
              ? (plan.status || "In Progress")
                  .replace("Working", "In Progress")
                  .replace("Completed", "Submitted")
              : "",
          closedPeriod: plan.closedPeriod || "",
          templateId: plan.templateId || "",
          type: plan.type || "",
          createdAt: plan.createdAt || "",
          updatedAt: plan.updatedAt || "",
          modifiedBy: plan.modifiedBy || "",
          approvedBy: plan.approvedBy || "",
          createdBy: plan.createdBy || "",
          // templateId: plan.templateId || 0,
          projStartDt: plan.projStartDt || "",
          projEndDt: plan.projEndDt || "",
          orgId: plan.orgId || "",
          fundedCost: plan.proj_f_cst_amt || "",
          fundedFee: plan.proj_f_fee_amt || "",
          fundedRev: plan.proj_f_tot_amt || "",
          revenueAccount: plan.revenueAccount || "",
          Rev: plan.revenue || plan.Rev || "",
          revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
          revenueFormula: plan.revenueFormula || "",
          acctGrpCd: plan.acctGrpCd || "",
        }));

        const sortedPlans = sortPlansByProjIdPlTypeVersion(transformedPlans);
        setPlans(sortedPlans);
        setFilteredPlans(sortedPlans);
        setColumns([
          "projId",
          "projName",
          "plType",
          "version",
          "versionCode",
          "revenueFormula",
          "source",
          "isCompleted",
          "isApproved",
          "finalVersion",
          "status",
          "templateId",
          "type",
          "closedPeriod",
          "projectStartDate",
          "projectEndDate",
        ]);

        // lastFetchedProjectId.current = projectId;
        lastFetchedProjectId.current = projectId;
        lastFetchedPage.current = currentPage;
        setTotalRecords(response.data.totalRecords);
        const ceilValue = Math.ceil(response.data.totalRecords / pageSize);
        setTotalPages(ceilValue);
      } catch (error) {
        setPlans([]);
        setFilteredPlans([]);
        toast.error("Failed to fetch plans.");
        lastFetchedProjectId.current = null;
        fullProjectId.current = null;
      } finally {
        setLoading(false);
      }
    };

    // useEffect(() => {
    //   fetchPlans();
    // }, [type]);
    useEffect(() => {
      fetchPlans();
    }, [type, pageSize, currentPage]);

    useEffect(() => {
      if (budEacFilter) {
        const filtered = plans.filter(
          (plan) => plan.plType === "BUD" || plan.plType === "EAC",
        );
        setFilteredPlans(filtered);
      } else {
        setFilteredPlans(plans);
      }
    }, [budEacFilter, plans]);

    // useEffect(() => {
    //   if (projectId !== lastFetchedProjectId.current) {
    //     fetchPlans();
    //   }
    // }, [projectId]);
    useEffect(() => {
      if (projectId !== lastFetchedProjectId.current) {
        setCurrentPage(1); // Reset back to page 1 when project changes
        fetchPlans();
      }
    }, [projectId]);

    useEffect(() => {
      if (selectedPlan && plans.length > 0) {
        const latest = plans.find(
          (p) =>
            p.plId === selectedPlan.plId && p.projId === selectedPlan.projId,
        );
        if (
          latest &&
          (latest.status !== selectedPlan.status ||
            latest.isCompleted !== selectedPlan.isCompleted ||
            latest.isApproved !== selectedPlan.isApproved ||
            latest.finalVersion !== selectedPlan.finalVersion)
        ) {
          if (typeof onPlanSelect === "function") onPlanSelect(latest);
        }
      }
    }, [plans, selectedPlan, onPlanSelect]);

    const getCurrentPlan = () => {
      if (!selectedPlan) return null;
      return (
        plans.find(
          (p) =>
            p.plId === selectedPlan.plId && p.projId === selectedPlan.projId,
        ) || selectedPlan
      );
    };

    const getCurrentUserContext = () => {
      try {
        const userString = localStorage.getItem("currentUser");
        if (!userString) return { userId: "", role: "" };
        const userObj = JSON.parse(userString);
        return {
          userId: userObj.userId ?? "",
          role: userObj.role?.toLowerCase() ?? "",
          fullName: userObj.fullName?.toLowerCase() ?? "",
          // roleName: user
        };
      } catch {
        return { userId: "", role: "", fullName: "" };
      }
    };

    const { userId, role, fullName } = getCurrentUserContext();

    const refreshPlans = async (overrideProjId) => {
      const effectiveProjId = (overrideProjId || projectId || "").trim();
      const encodedProjId = encodeURIComponent(effectiveProjId);
      if (!effectiveProjId) {
        setPlans([]);
        setFilteredPlans([]);
        return;
      }
      // if (!projectId) {
      //   setPlans([]);
      //   setFilteredPlans([]);
      //   return;
      // }
      const apiType = type === "NBBUDPRICING" ? "NBBUD" : type;

      try {
        const response = await axios.get(
          // `${backendUrl}/Project/GetProjectPlans/${projectId}`
          //  ` ${backendUrl}/Project/GetProjectPlans/${effectiveProjId}`
          `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/${encodedProjId}?status=${status}&type=${apiType}`,
        );

        const transformedPlans = response.data.map((plan) => ({
          plId: plan.plId || plan.id || 0,
          projId:
            plan.fullProjectId ||
            plan.projId ||
            plan.project_id ||
            plan.projectId ||
            projectId,
          // projName: plan.projName || "",
          projName: plan.projName || plan.description || plan.desc || "",
          plType:
            plan.plType === "Budget"
              ? "BUD"
              : plan.plType === "EAC"
                ? "EAC"
                : plan.plType || "",
          source: plan.source || "",
          version: plan.version || 0,
          versionCode: plan.versionCode || "",
          finalVersion: !!plan.finalVersion,
          isCompleted: !!plan.isCompleted,
          isApproved: !!plan.isApproved,
          status:
            plan.plType && plan.version
              ? (plan.status || "In Progress")
                  .replace("Working", "In Progress")
                  .replace("Completed", "Submitted")
              : "",
          closedPeriod: plan.closedPeriod || "",
          templateId: plan.templateId || "",
          type: plan.type || "",
          createdAt: plan.createdAt || "",
          updatedAt: plan.updatedAt || "",
          modifiedBy: plan.modifiedBy || "",
          approvedBy: plan.approvedBy || "",
          createdBy: plan.createdBy || "",
          // templateId: plan.templateId || 0,
          projStartDt: plan.projStartDt || "",
          projEndDt: plan.projEndDt || "",
          orgId: plan.orgId || "",
          fundedCost: plan.proj_f_cst_amt || "",
          fundedFee: plan.proj_f_fee_amt || "",
          fundedRev: plan.proj_f_tot_amt || "",
          revenueAccount: plan.revenueAccount || "",
          Rev: plan.revenue || plan.Rev || "",
          revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
          acctGrpCd: plan.acctGrpCd || "",
          revenueFormula: plan.revenueFormula || "",
        }));

        const sortedPlans = sortPlansByProjIdPlTypeVersion(transformedPlans);
        setPlans(sortedPlans);
        setFilteredPlans(sortedPlans);
        setSearchTerm(effectiveProjId);
        return sortedPlans;
      } catch (error) {
        // toast.error("Failed to refresh plans.");
        return [];
      }
    };

    // Only used when projectId is empty but a row is selected.
    const refreshPlansForSelected = async () => {
      if (!selectedPlan?.projId) return [];
      const encodedProjId = encodeURIComponent(selectedPlan.projId);
      const apiType = type === "NBBUDPRICING" ? "NBBUD" : type;

      try {
        const response = await axios.get(
          // `${backendUrl}/Project/GetProjectPlans/${selectedPlan.projId}`
          `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/${encodedProjId}?type=${apiType}`,
        );

        const transformedPlans = response.data.map((plan) => ({
          plId: plan.plId || plan.id || 0,
          projId:
            plan.fullProjectId ||
            plan.projId ||
            plan.project_id ||
            plan.projectId ||
            selectedPlan.projId,
          // projName: plan.projName || "",
          projName: plan.projName || plan.description || plan.desc || "",
          plType:
            plan.plType === "Budget"
              ? "BUD"
              : plan.plType === "EAC"
                ? "EAC"
                : plan.plType || "",
          source: plan.source || "",
          version: plan.version || 0,
          versionCode: plan.versionCode || "",
          finalVersion: !!plan.finalVersion,
          isCompleted: !!plan.isCompleted,
          isApproved: !!plan.isApproved,
          status:
            plan.plType && plan.version
              ? (plan.status || "In Progress")
                  .replace("Working", "In Progress")
                  .replace("Completed", "Submitted")
              : "",
          closedPeriod: plan.closedPeriod || "",
          templateId: plan.templateId || "",
          createdAt: plan.createdAt || "",
          updatedAt: plan.updatedAt || "",
          modifiedBy: plan.modifiedBy || "",
          approvedBy: plan.approvedBy || "",
          createdBy: plan.createdBy || "",
          // templateId: plan.templateId || 0,
          projStartDt: plan.projStartDt || "",
          projEndDt: plan.projEndDt || "",
          orgId: plan.orgId || "",
          fundedCost: plan.proj_f_cst_amt || "",
          fundedFee: plan.proj_f_fee_amt || "",
          fundedRev: plan.proj_f_tot_amt || "",
          revenueAccount: plan.revenueAccount || "",
          Rev: plan.revenue || plan.Rev || "",
          revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
          acctGrpCd: plan.acctGrpCd || "",
          revenueFormula: plan.revenueFormula || "",
        }));

        const sortedPlans = sortPlansByProjIdPlTypeVersion(transformedPlans);

        return sortedPlans;
      } catch (error) {
        // toast.error("Failed to refresh plans.");
        return [];
      }
    };

    // const handleNewBusinessSave = async (savedData) => {
    //   const newPlans = await refreshPlans();
    //   const newPlanId = savedData.projId || savedData.businessBudgetId;

    //   if (newPlanId && newPlans) {
    //     const planToSelect = newPlans.find(
    //       (p) => p.projId === newPlanId && p.plType === "NBBUD"
    //     );
    //     if (planToSelect) {
    //       handleRowClick(planToSelect);
    //       toast.success(`NB BUD plan for ${newPlanId} created and selected.`);
    //     } else {
    //       toast.error("Plan created, but auto-selection failed.");
    //     }
    //   }
    // };

    // 1. Store and pre-fill project dates when dateModal opens
    useEffect(() => {
      if (dateModal.isOpen && dateModal.plan) {
        const projStart = dateModal.plan.projStartDt || "";
        const projEnd = dateModal.plan.projEndDt || "";

        setDateModal((prev) => ({
          ...prev,
          // Retain the stored original project dates for validation
          origProjStartDt: projStart,
          origProjEndDt: projEnd,
          // Pre-fill fields if not already edited
          startDate: prev.startDate || projStart,
          endDate: prev.endDate || projEnd,
        }));
      }
    }, [dateModal.isOpen, dateModal.plan]);

    // 2. Automatically trigger "Carry Forward" when Start Date exceeds Original Project End Date
    useEffect(() => {
      if (
        dateModal.isOpen &&
        dateModal.startDate &&
        dateModal.origProjEndDt &&
        dateModal.startDate > dateModal.origProjEndDt
      ) {
        setCarryForwardPriorYear(true);
      }
    }, [dateModal.startDate, dateModal.origProjEndDt, dateModal.isOpen]);

    const handleNewBusinessSave = async (savedData) => {
      // 1. Get the new project id coming from NewBusiness
      const newProjId = savedData.projId || savedData.businessBudgetId || "";

      if (!newProjId) {
        toast.error("New Business saved, but project id is missing.");
        return;
      }

      // 2. Refresh plans specifically for that new project id
      const newPlans = await refreshPlans(newProjId);

      if (!newPlans || newPlans.length === 0) {
        toast.error("NB BUD created, but plans could not be loaded.");
        return;
      }

      // 3. Try to find the NB BUD plan; fall back to first plan if not found
      const planToSelect =
        newPlans.find((p) => p.projId === newProjId && p.plType === "NBBUD") ||
        newPlans[0];

      // 4. Select the plan in the grid (this calls onPlanSelect)
      handleRowClick(planToSelect);

      // 5. Let the parent know so it can update Project ID textbox + header
      onPlanCreated?.(planToSelect);

      toast.success(`NB BUD plan for ${newProjId} created and selected.`);
      setShowNewBusinessPopup(false);
    };

    const handleRowClick = (plan, tempDates = manualProjectDates) => {
      // 1. Check if there are any current unsaved edits for this specific plan
      // const currentEdits = editingDates[plan.plId];

      if (
        selectedPlan?.projId === plan?.projId &&
        selectedPlan?.version === plan?.version &&
        selectedPlan?.plType === plan?.plType
      ) {
        return;
      }

      // // 2. Calculate effective dates:
      // // Priority: 1. Current edits in state > 2. Plan properties > 3. Empty string
      // const effectiveStartDate =
      //   currentEdits?.startDate || plan.projStartDt || plan.startDate || "";
      // const effectiveEndDate =
      //   currentEdits?.endDate || plan.projEndDt || plan.endDate || "";

      const startDate = plan.projStartDt || "";
      const endDate = plan.projEndDt || "";

      // 3. Prepare the updated plan object with the LATEST dates
      // const updatedPlan = {
      //   ...plan,
      //   projStartDt: effectiveStartDate,
      //   projEndDt: effectiveEndDate,
      //   startDate: effectiveStartDate,
      //   endDate: effectiveEndDate,
      //   revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
      // };

      // 4. Update local editing state (maintains consistency)
      setEditingDates((prev) => ({
        ...prev,
        [plan.plId]: {
          startDate,
          endDate,
        },
      }));

      // 5. Always trigger the select action
      // This satisfies your requirement to "treat second click as another"
      // and ensures the parent component gets the latest edited dates.
      onPlanSelect?.({
        ...plan,
        projStartDt: startDate,
        projEndDt: endDate,
        revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
      });

      // sessionStorage.setItem("lastSelectedPlanId", plan.plId);
    };

    useEffect(() => {
      if (selectedPlan && plans.length > 0) {
        const freshPlan = getCurrentPlan(); // Latest from plans[]
        if (freshPlan && typeof onPlanSelect === "function") {
          onPlanSelect(freshPlan); // Always sync - safe, no loops
        }
      }
    }, [refreshKey, plans]);

    const handleDateCellChange = (plId, dateColumn, value) => {
      const dateType =
        dateColumn === "projectStartDate" ? "startDate" : "endDate";
      const currentDates = editingDates[plId] || {};
      const newDates = { ...currentDates, [dateType]: value };

      // Update state with new dates
      setEditingDates((prev) => ({ ...prev, [plId]: newDates }));

      // Check if we have both dates in valid format
      const isFullDate = (v) =>
        typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
      const hasStartDate = isFullDate(newDates.startDate);
      const hasEndDate = isFullDate(newDates.endDate);
    };

    const handleExportPlan = async (plan) => {
      if (typeof onExportPlan === "function") {
        // delegate to parent if provided
        return onExportPlan(plan);
      }
      if (!selectedPlan?.projId || !plan.version || !plan.plType) {
        toast.error("Missing required parameters for export");
        return;
      }
      try {
        setIsActionLoading(true);
        toast.info("Exporting plan...");

        const response = await axios.get(
          `${backendUrl}/Forecast/ExportPlanDirectCost`,
          {
            params: {
              projId: selectedPlan.projId,
              version: selectedPlan.version,
              type: selectedPlan.plType,
            },
            responseType: "blob",
          },
        );

        if (!response.data || response.data.size === 0) {
          toast.error("No data received from server");
          return;
        }

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        link.setAttribute(
          "download",
          `Plan_${selectedPlan.projId}_${plan.version}_${plan.plType}.xlsx`,
        );

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);

        toast.success("Plan exported successfully!");
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            toast.error("Export endpoint not found or data not available");
          } else if (err.response.status === 500) {
            toast.error("Server error occurred during export");
          } else {
            toast.error(
              `Export failed: ${err.response.status} - ${err.response.statusText}`,
            );
          }
        } else if (err.request) {
          toast.error("Network error: Unable to reach server");
        } else {
          toast.error("Error exporting plan: " + err.message);
        }
      } finally {
        setIsActionLoading(false);
      }
    };

    const handleImportPlan = async (event) => {
      if (typeof onImportPlan === "function") {
        return onImportPlan(event);
      }
      const file = event.target.files[0];
      if (!file) {
        toast.error("No file selected");
        return;
      }
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
      const formData = new FormData();
      formData.append("file", file);

      // formData.append("projId", selectedPlan.projId);

      try {
        setIsActionLoading(true);
        toast.info("Importing plan...");
        const response = await axios.post(
          `${backendUrl}/Forecast/ImportDirectCostPlanV2`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        let extractedVersion = null;
        if (typeof response.data === "string") {
          const versionMatch = response.data.match(/version\s*-\s*'([^']+)'/i);
          if (versionMatch) extractedVersion = versionMatch[1];
        } else if (response.data?.version) {
          extractedVersion = response.data.version;
        }
        if (extractedVersion) setLastImportedVersion(extractedVersion);
        setLastImportTime(Date.now());
        toast.success(
          response.data && typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data),
          { toastId: "import-success-" + Date.now(), autoClose: 5000 },
        );
        await refreshPlans();
      } catch (err) {
        // // console.log(err)
        // let errorMessage =
        //   "Failed to import plan. Please check the file and project ID, or contact support.";
        // let errorDetails = null;
        // if (err.response) {
        //   if (typeof err.response.data === "string" && err.response.data)
        //     errorMessage = err.response.data;
        //   else if (err.response.data?.message) {
        //     if (err.response.data?.details) {
        //       errorDetails = err.response.data?.details || null;
        //     }
        //     errorMessage = err.response.data.message;
        //   } else if (err.response.data)
        //     errorMessage = JSON.stringify(err.response.data);
        //   else if (err.response.status === 500)
        //     errorMessage =
        //       "Server error occurred. Please verify the file format, project ID, and ensure type is EXCEL.";
        // } else errorMessage = err.message || errorMessage;
        // // toast.error(errorMessage, { toastId: "import-error", autoClose: 5000 });

        // toast.error(
        //   <div>
        //     <strong>{errorMessage}</strong>
        //     {errorDetails && (
        //       <div className="mt-2 text-xs space-y-1">
        //         {Object.entries(errorDetails).map(([k, v]) => (
        //           <div key={k}>
        //             • <span className="font-medium">{k}</span>:{" "}
        //             {v !== "" ? v : "-"}
        //           </div>
        //         ))}
        //       </div>
        //     )}
        //   </div>,
        //   { toastId: "import-error", autoClose: 8000 },
        // );

        let errorMessage =
          "Failed to import plan. Please check the file and project ID, or contact support.";
        let errorDetails = null;

        // 2. Intercept structured server responses
        if (err.response?.data) {
          const resData = err.response.data;

          if (typeof resData === "string") {
            errorMessage = resData;
          } else {
            // Set the primary message summary banner text (e.g., "Hours validation failed:")
            errorMessage = resData.message || errorMessage;

            // Extract detailed structural array loops if provided by your server
            if (Array.isArray(resData.errors)) {
              errorDetails = resData.errors;
            } else if (resData.details) {
              errorDetails = resData.details;
            }
          }
        } else if (err.response?.status === 500) {
          errorMessage =
            "Server error occurred. Please verify the file format, project ID, and ensure type is EXCEL.";
        } else {
          errorMessage = err.message || errorMessage;
        }

        // 3. Populate your custom modal state instead of triggering standard toast alerts
        setImportErrorModal({
          isOpen: true,
          message: errorMessage,
          // details: errorDetails,
        });
      } finally {
        setIsActionLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    const syncLuminaPeoplePlans = async (file) => {
      if (!file) {
        toast.error("Please select a file first.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      setLuminaPeoplePlan(true);
      try {
        toast.info("Syncing Lumina People Plans...");

        const response = await axios.post(
          `${backendUrl}/SyncLuminaPeoplePlans`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob", // Instructs Axios to handle binary response
          },
        );

        // =========================================================
        // Check if the response is JSON (No changes detected / No file generated)
        // =========================================================
        const contentType = response.headers["content-type"] || "";

        if (contentType.includes("application/json")) {
          // Parse the JSON message from the Blob response
          const responseText = await response.data.text();
          const parsedData = JSON.parse(responseText);

          toast.info(
            parsedData.message || "No changes detected. No file generated.",
          );
          return parsedData;
        }

        // =========================================================
        // File was returned -> Trigger direct browser download
        // =========================================================
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

        let baseName = "Lumina_People_Plans";
        let fileExtension = "pdf"; // Default extension fallback set to pdf

        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(
            /filename="?([^";]+)"?/,
          );
          if (fileNameMatch && fileNameMatch[1]) {
            const fullFileName = fileNameMatch[1];
            const extMatch = fullFileName.match(/\.([^/.]+)$/);

            if (extMatch) {
              fileExtension = extMatch[1];
            }
            baseName = fullFileName.replace(/\.[^/.]+$/, "");
          }
        }

        const mimeTypes = {
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          pdf: "application/pdf",
        };
        const mimeType =
          mimeTypes[fileExtension] || contentType || "application/octet-stream";

        const fileName = `${baseName}_${timestamp}.${fileExtension}`;

        const blob = new Blob([response.data], { type: mimeType });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup memory allocation
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Sync completed successfully!");
        return response.data;
      } catch (error) {
        console.error("Sync failed:", error);

        let errorMessage = "Failed to sync Lumina People Plans.";
        if (error.response?.data instanceof Blob) {
          errorMessage = await error.response.data.text();
          try {
            const parsed = JSON.parse(errorMessage);
            errorMessage = parsed.message || parsed.error || errorMessage;
          } catch {
            // Fallback to raw text error string
          }
        } else if (typeof error.response?.data === "string") {
          errorMessage = error.response.data;
        }

        toast.error(errorMessage);
        throw error;
      } finally {
        setLuminaPeoplePlan(false);
      }
    };

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

    // EXPOSE HANDLERS TO PARENT
    // useImperativeHandle(ref, () => ({
    //   exportSelectedPlan() {
    //     if (!selectedPlan?.projId) {
    //       toast.info("Please select a plan first.");
    //       return;
    //     }
    //     return handleExportPlan(selectedPlan);  // ✅ Works even without parent props
    //   },
    //   importPlanFile(event) {
    //     return handleImportPlan(event);  // ✅ Works even without parent props
    //   },
    //   openFileDialog() {
    //     fileInputRef.current?.click();
    //   },
    // }));

    useImperativeHandle(
      ref,
      () => ({
        exportSelectedPlan() {
          // This checks the selectedPlan prop passed from the parent
          if (!selectedPlan || !selectedPlan.projId) {
            toast.warning("Please select a plan in the table first.");
            return;
          }
          // Calls the axios function with the dynamic plan parameters
          return handleExportPlan(selectedPlan);
        },
        importPlanFile(event) {
          return handleImportPlan(event);
        },
      }),
      [selectedPlan],
    );

    const handleUpdateProjectDates = async (newDates) => {
      if (!projectId || !newDates.startDate || !newDates.endDate) {
        toast.error("Project ID or both dates are missing for update.");
        return false;
      }
      const payload = {
        projId: selectedPlan?.projId || fullProjectId.current || projectId,
        projStartDt: newDates.startDate,
        projEndDt: newDates.endDate,
      };

      setIsActionLoading(true);
      try {
        await axios.put(`${backendUrl}/Project/UpdateDates`, payload);
        toast.success("Project dates updated successfully!");

        setManualDatesSubmitted(true);

        if (filteredProjects.length > 0) {
          const projectIndex = filteredProjects.findIndex(
            (p) => p.projId === projectId,
          );
          if (projectIndex !== -1) {
            filteredProjects[projectIndex].startDate = newDates.startDate;
            filteredProjects[projectIndex].projStartDt = newDates.startDate;
            filteredProjects[projectIndex].endDate = newDates.endDate;
            filteredProjects[projectIndex].projEndDt = newDates.endDate;

            // Keep manual dates so they stay visible
            setManualProjectDates({
              startDate: newDates.startDate,
              endDate: newDates.endDate,
            });
            tempManualDatesRef.current = {
              startDate: newDates.startDate,
              endDate: newDates.endDate,
            };

            if (selectedPlan) {
              handleRowClick(selectedPlan, newDates);
            }
          }
        }
        return true;
      } catch (err) {
        toast.error(
          "Failed to update project dates. " +
            (err.response?.data?.message || err.message),
        );
        return false;
      } finally {
        setIsActionLoading(false);
      }
    };

    const isSaveDatesDisabled = () => {
      const currentPlan = getCurrentPlan();
      if (!currentPlan) return true;

      const edited = editingDates[currentPlan.plId];
      if (!edited) return true;

      const originalStart =
        currentPlan.projStartDt || currentPlan.startDate || "";
      const originalEnd = currentPlan.projEndDt || currentPlan.endDate || "";

      const newStart = edited.startDate || "";
      const newEnd = edited.endDate || "";

      // enable only if at least one date changed
      return originalStart === newStart && originalEnd === newEnd;
    };

    const handleSaveDatesClick = async () => {
      // if (!selectedPlan?.plId) {
      //   toast.error("No plan selected to save dates.", {
      //     toastId: "no-plan-selected-dates",
      //   });
      //   return;
      // }

      const currentDates = editingDates[selectedPlan.plId] || {};
      const { startDate, endDate } = currentDates;

      // Reuse exactly the same validation as earlier
      const isFullDate = (v) =>
        typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
      const hasStartDate = isFullDate(startDate);
      const hasEndDate = isFullDate(endDate);

      if (!hasStartDate || !hasEndDate) {
        toast.warning(
          "Please select both start and end dates to save changes",
          {
            autoClose: 3000,
          },
        );
        return;
      }

      // Get the plan (same as before)
      const plan = plans.find((p) => p.plId === selectedPlan.plId);
      if (!plan?.projId) {
        toast.error("Missing project id for selected plan.");
        return;
      }

      try {
        setIsActionLoading(true);

        // Same payload / endpoint as old handleDateCellChange
        await axios.put(`${backendUrl}/Project/UpdateDates`, {
          projId: selectedPlan.projId,
          projStartDt: startDate,
          projEndDt: endDate,
        });

        toast.success("Dates updated successfully", { autoClose: 2000 });

        // Refresh the plans to get updated data (same logic)
        const updatedPlans = projectId?.trim()
          ? await refreshPlans()
          : await refreshPlansForSelected();

        // Update the selected plan with new dates (same shape)
        if (selectedPlan?.plId === plan.plId) {
          const updatedPlan = {
            ...selectedPlan,
            projStartDt: startDate,
            projEndDt: endDate,
            startDate,
            endDate,
          };
          if (typeof onPlanSelect === "function") onPlanSelect(updatedPlan);
        }
      } catch (error) {
        toast.error(
          `Failed to update dates: ${
            error.response?.data?.message || error.message
          }`,
          {
            autoClose: 4000,
          },
        );
      } finally {
        setIsActionLoading(false);
      }
    };

    const transformSource = (source) => {
      if (!source || typeof source !== "string") return source;
      const match = source.match(/^([A-Z])(\d+)$/);
      if (match) {
        const letter = match[1];
        const number = parseInt(match[2], 10);
        return `${letter}${number + 1}`;
      }
      return source;
    };

    useEffect(() => {
      setStatusFilter("");
      setTypeFilter("");
    }, [type]);

    const handleCheckboxChange = async (idx, field) => {
      // 1. Setup & Identification
      const prevPlans = [...plans];
      const planToUpdate = filteredPlans[idx];
      const planId = planToUpdate.plId;

      // 2. Validation Guard Clauses
      if (!planToUpdate.plType || !planToUpdate.version) {
        toast.error(
          `Cannot update ${field}: Plan Type and Version are required.`,
          {
            toastId: "checkbox-error",
          },
        );
        return;
      }

      if (field === "isApproved" && !planToUpdate.isCompleted) {
        toast.error("You can't approve this row until Submitted is checked", {
          toastId: "checkbox-error",
        });
        return;
      }

      if (field === "finalVersion" && !planToUpdate.isApproved) {
        toast.error("You can't set Conclude until Approved is checked", {
          toastId: "checkbox-error",
        });
        return;
      }

      // 3. Calculate the new state for the specific plan
      let updated = { ...planToUpdate, [field]: !planToUpdate[field] };

      // Handle Status & Dependency Cascades
      if (field === "isCompleted") {
        updated.status = updated.isCompleted ? "Submitted" : "In Progress";
        if (!updated.isCompleted) {
          updated.isApproved = false;
          updated.finalVersion = false;
        }
      }

      if (field === "isApproved") {
        updated.status = updated.isApproved ? "Approved" : "Submitted";
        if (!updated.isApproved) updated.finalVersion = false;
      }

      if (field === "finalVersion") {
        updated.status = updated.finalVersion ? "Concluded" : "Approved";
      }

      // 4. Optimistic UI Update (Update the local list immediately)
      const newPlans = plans.map((p) => {
        // If it's the plan we clicked
        if (p.plId === planId) {
          return updated;
        }

        // Rule: Only one "Final Version" per Plan Type/Project
        if (field === "finalVersion" && updated.finalVersion) {
          if (p.plType === updated.plType && p.projId === updated.projId) {
            return { ...p, finalVersion: false };
          }
        }

        // Rule: If this plan is set to "In Progress", move any other "In Progress" to "Submitted"
        // if (updated.status === "In Progress") {
        //   if (
        //     p.status === "In Progress" &&
        //     p.plType === updated.plType &&
        //     p.projId === updated.projId
        //   ) {
        //     return { ...p, status: "Submitted", isCompleted: true };
        //   }
        // }

        return p;
      });

      setPlans(newPlans);

      // 5. Trigger external callback for the UI
      if (typeof onPlanSelect === "function") onPlanSelect(updated);

      // 6. Persistence (API Call)
      const canUpdateBackend =
        planId &&
        Number(planId) > 0 &&
        (BOOLEAN_FIELDS.includes(field) || field === "status");

      if (canUpdateBackend) {
        const updateUrl = `${backendUrl}/Project/UpdateProjectPlan`;
        const payload = {
          plId: updated.plId,
          projId: selectedPlan?.projId || plans.projId || updated.projId,
          plType: updated.plType,
          version: updated.version,
          finalVersion: updated.finalVersion,
          isCompleted: updated.isCompleted,
          isApproved: updated.isApproved,
          modifiedBy: `${fullName}`,
          status: updated.status,
          approvedBy: updated.approvedBy,
          templateId: updated.templateId,
          versionCode: updated.versionCode,
          revenueFormula: updated.revenueFormula || "",
        };

        try {
          await axios.put(updateUrl, payload);

          // Refresh to ensure sync with DB (handled by your helper function)
          // const refreshed = await refreshPlans(payload.projId);

          // Re-sync selection if necessary
          // if (Array.isArray(refreshed) && typeof onPlanSelect === "function") {
          //   const reselected = refreshed.find((p) => p.plId === updated.plId);
          //   if (reselected) onPlanSelect(reselected);
          // }

          toast.success("Status updated successfully.", {
            toastId: "plan-status-updated",
          });
        } catch (err) {
          // Rollback UI on error
          setPlans(prevPlans);
          // toast.error(
          //   "Error updating plan: " +
          //     (err.response?.data?.message || err.message),
          //   { toastId: "checkbox-error" },
          // );
          toast.error(err.response?.data || err.message);
        }
      }
    };

    const handleVersionCodeChange = async (plId, value) => {
      const prevPlans = [...plans];

      const currentPlan = plans.find(
        (p) =>
          p.plId === plId && p.projId === (selectedPlan?.projId || p.projId),
      );

      if (!currentPlan || currentPlan.versionCode === value) return;

      const updated = { ...currentPlan, versionCode: value };

      const newPlans = plans.map((plan) =>
        plan.plId === plId && plan.projId === currentPlan.projId
          ? updated
          : plan,
      );

      setPlans(newPlans);
      setFilteredPlans(newPlans);

      if (plId && Number(plId) > 0) {
        const updateUrl = `${backendUrl}/Project/UpdateProjectPlan`;
        toast.info("Updating version code...", {
          toastId: "version-code-info",
        });
        try {
          setIsActionLoading(true);
          // Sending 'updated' directly as requested
          await axios.put(updateUrl, updated);
          toast.success("Version code updated successfully!", {
            toastId: "version-code-success",
          });
        } catch (err) {
          setPlans(prevPlans);
          setFilteredPlans(prevPlans);
          toast.error(
            "Error updating version code: " +
              (err.response?.data?.message || err.message),
            { toastId: "version-code-error" },
          );
        } finally {
          setIsActionLoading(false);
        }
      }
    };

    const fetchClientIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json", {
          transformRequest: [
            (data, headers) => {
              // Add safe optional chaining / checks
              if (headers) {
                if (headers.common) delete headers.common["Authorization"];
                delete headers["Authorization"];
              }
              return data;
            },
          ],
        });
        console.log(
          "Fetched IP Address (outside core handler):",
          response.data.ip,
        );
        return response.data.ip;
      } catch (ipErr) {
        console.error("Failed to fetch client IP address:", ipErr);
        return "Unknown";
      }
    };

    useEffect(() => {
      const fetchIpAndSet = async () => {
        const ip = await fetchClientIp();
        setClientIp(ip);
      };
      fetchIpAndSet();
    }, []);

    const handleActionSelect = async (
      idx,
      action,
      customStartDate = null,
      customEndDate = null,
      customEscalationConfigs = null,
      isCarryForwardBase = false,
      customBaseYear = 0,
      notes = "",
      description = "",
    ) => {
      const plan = plans[idx];
      if (
        !plan.plType &&
        !showForm &&
        (action === "Create Budget" || action === "Create EAC")
      ) {
        setAction(action);
        // if(action !== "Create NB BUD"){
        setShowForm(true);
        // }
        setIsActionLoading(false);
        return;
      }
      if (action === "None") return;

      if (action === "Delete") {
        const confirmed = window.confirm(
          "Are you sure you want to delete this plan? This action cannot be undone.",
        );
        if (!confirmed) {
          setIsActionLoading(false);
          return;
        }
      }
      // Confirmation

      try {
        setIsActionLoading(true);

        const updatedAllPlans = await getAllPlans();
        // Refresh to get latest 'lockDotLevel'
        const isActionStillValid = getButtonAvailability(
          plan,
          action,
          updatedAllPlans,
        );

        if (!isActionStillValid) {
          toast.error(`"${action}" is already created on another level`);
          setIsActionLoading(false);
          return;
        }

        if (action === "Delete") {
          // Validation: Fetch fresh data to check for dependents
          const freshMasterPlans = await getAllPlans();
          const planTypeLetter =
            plan.plType === "BUD" ? "B" : plan.plType === "EAC" ? "E" : "";
          const sourceString = `${planTypeLetter}${plan.version}`;

          const hasDependents = freshMasterPlans.some(
            (p) => p.source === sourceString && p.projId === plan.projId,
          );

          if (hasDependents) {
            toast.error(
              `Cannot delete: This plan (Version ${plan.version}) is the source for other plans.`,
            );
            setIsActionLoading(false);
            return;
          }

          if (!plan.plId || Number(plan.plId) <= 0) {
            toast.error("Cannot delete: Invalid plan ID.");
            setIsActionLoading(false);
            return;
          }

          toast.info("Deleting plan...");
          try {
            await axios.delete(
              `${backendUrl}/Project/DeleteProjectPlan/${plan.plId}`,
            );
            try {
              const auditPayload = {
                auditId: 0,
                projectId: plan.projId || "",
                planId: plan.plId || 0,
                planType: plan.plType || "",
                username: `${fullName}`, // Replace with your auth state/context if available
                actionType: "Delete",
                actionDetails: "deleted",
                version: plan.version || 0,
                createdAt: new Date().toISOString(),
              };

              await axios.post(`${backendUrl}/AuditTable/Add`, auditPayload);
            } catch (auditErr) {
              console.error(
                "Failed to log delete action to audit trails:",
                auditErr,
              );
              // Optional: Don't block the UI flow if only the audit logging fails
            }

            toast.success("Plan deleted successfully!");

            // Cleanup local state
            setPlans(plans.filter((p, i) => i !== idx));
            await refreshPlans(selectedPlan?.projId || plan.projId);

            if (selectedPlan?.plId === plan.plId) {
              if (typeof onPlanSelect === "function") onPlanSelect(null);
            }

            // setIsActionLoading(false);
            // return;
          } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting plan");
          } finally {
            setIsActionLoading(false);
            getAllPlan();
          }
          return;
        } else if (
          action === "Create Budget" ||
          action === "Create Blank Budget" ||
          action === "Create EAC" ||
          action === "Create NB BUD"
        ) {
          const startDate =
            customStartDate ||
            editingDates[plan.plId]?.startDate ||
            plan.projStartDt ||
            plan.startDate ||
            "";
          const endDate =
            customEndDate ||
            editingDates[plan.plId]?.endDate ||
            plan.projEndDt ||
            plan.endDate ||
            "";

          // Intercept and ask to confirm/modify dates only if it is an existing source plan AND custom dates haven't been confirmed yet
          if (plan.plType && !customStartDate && !customEndDate) {
            setDateModal({
              isOpen: true,
              action,
              plan,
              startDate,
              endDate,
              // Keep track of index so the modal's confirm button can feed it back to this function
              planIndex: idx,
            });
            setIsActionLoading(false);
            return;
          }

          if (!startDate || !endDate) {
            toast.error("Cannot create plan: Set Start and End Date.");
            setIsActionLoading(false);
            return;
          }

          const actionProjId =
            fullProjectId.current || plan.projId || projectId || "";

          // const startDate =
          //   editingDates[plan.plId]?.startDate ||
          //   plan.projStartDt ||
          //   plan.startDate ||
          //   "";
          // const endDate =
          //   editingDates[plan.plId]?.endDate ||
          //   plan.projEndDt ||
          //   plan.endDate ||
          //   "";

          let payloadTemplate = {
            plId: plan.plId || 0,
            projId: selectedPlan?.projId || actionProjId || "",
            plType:
              action === "Create NB BUD"
                ? "NBBUD"
                : action === "Create Budget" || action === "Create Blank Budget"
                  ? "BUD"
                  : "EAC",
            source: `${plan.plType === "BUD" ? "B" : plan.plType === "EAC" ? "E" : ""}${plan.version || 0}`,
            //  type: plan.type || "A",
            type:
              typeof isChildProjectId === "function" &&
              isChildProjectId(selectedPlan?.projId)
                ? "A"
                : plan.type || "A",
            version: plan.version || 0,
            versionCode: plan.versionCode || "",
            finalVersion: false,
            isCompleted: false,
            isApproved: false,
            status: "In Progress",
            createdBy: `${fullName}`,
            modifiedBy: plan.modifiedBy || "User",
            approvedBy: "",
            templateId:
              action === "Create NB BUD"
                ? plan.templateId || 2
                : plan.templateId || 1,
            fiscalYear: fiscalYear,
            projStartDt:
              customStartDate ||
              editingDates[plan.plId]?.startDate ||
              selectedPlan?.projStartDt,
            projEndDt:
              customEndDate ||
              editingDates[plan.plId]?.endDate ||
              selectedPlan?.projEndDt,

            // Escalation Percent Configuration Payload Options
            laborEscallation: isCarryForwardBase
              ? escalationConfigs.escallation_percent || 0
              : null,
            nonLaborEscallation: isCarryForwardBase
              ? escalationConfigs.nonlabor_escallation_percent || 0
              : null,
            vendorEscallation: isCarryForwardBase
              ? escalationConfigs.vendor_escallation_percent || 0
              : null,
            // carryForwardPriorYear: carryForwardPriorYear,
            // baseYear: carryForwardPriorYear
            //   ? Number(selectedFiscalYear) || 0
            //   : 0,
            // Correctly mapped Base vs Source carry forward flags
            carryForwardPriorYear: Boolean(isCarryForwardBase),
            notes: notes || "",
            baseYear: isCarryForwardBase ? Number(customBaseYear) || 0 : 0,
            description: description || plan.description || plan.desc || "",
          };

          toast.info(
            `Creating ${
              action === "Create Budget"
                ? "Budget"
                : action === "Create Blank Budget"
                  ? "Blank Budget"
                  : action === "Create NB BUD"
                    ? "NB BUD"
                    : "EAC"
            }...`,
          );

          setShowForm(false);

          const response = await axios.post(
            `${backendUrl}/Project/AddProjectPlan?type=${
              action === "Create Blank Budget" ? "blank" : "actual"
            }`,
            payloadTemplate,
          );
          const rawCreatedPlan = response.data;

          const normalizedPlan = {
            ...plan,
            ...rawCreatedPlan,
            plId: rawCreatedPlan.plId || rawCreatedPlan.id || 0,
            projId: rawCreatedPlan.projId || plan.projId,
            // projName: rawCreatedPlan.projName || plan.projName || "",
            projName:
              rawCreatedPlan.projName ||
              plan.projName ||
              plan.description ||
              plan.desc ||
              "",
            plType:
              rawCreatedPlan.plType === "Budget"
                ? "BUD"
                : rawCreatedPlan.plType || "BUD",
            version: Number(rawCreatedPlan.version) || 0,
            status: "In Progress",
            finalVersion: false,
            isCompleted: false,
            isApproved: false,
            projStartDt:
              customStartDate ||
              rawCreatedPlan.projStartDt ||
              plan.projStartDt ||
              "",
            projEndDt:
              customEndDate || rawCreatedPlan.projEndDt || plan.projEndDt || "",

            // Escalation Percent Configuration Payload Options
            laborEscallation: isCarryForwardBase
              ? escalationConfigs.escallation_percent || 0
              : null,
            nonLaborEscallation: isCarryForwardBase
              ? escalationConfigs.nonlabor_escallation_percent || 0
              : null,
            vendorEscallation: isCarryForwardBase
              ? escalationConfigs.vendor_escallation_percent || 0
              : null,
            notes: notes || "",
            // Correctly mapped Base vs Source carry forward flags
            carryForwardPriorYear: Boolean(isCarryForwardBase),
            baseYear: isCarryForwardBase ? Number(customBaseYear) || 0 : 0,
            description:
              description ||
              rawCreatedPlan.description ||
              plan.description ||
              plan.desc ||
              "",
            // carryForwardPriorYear: carryForwardPriorYear,
            // baseYear: carryForwardPriorYear
            //   ? Number(selectedFiscalYear) || 0
            //   : 0,

            type: rawCreatedPlan.type || plan.type || "A",
          };

          // if (!normalizedPlan.projId || !normalizedPlan.plType) {
          //   toast.error(
          //     "Plan returned from backend is missing required fields. Please reload and try again."
          //   );
          //   setIsActionLoading(false);
          //   return;
          // }

          // await refreshPlans();

          // setTimeout(() => {
          //   onPlanSelect(normalizedPlan);
          //   onPlanCreated?.(normalizedPlan);
          // }, 100);

          if (!normalizedPlan.projId || !normalizedPlan.plType) {
            toast.error(
              "Plan returned from backend is missing required fields. Please reload and try again.",
            );
            setIsActionLoading(false);
            return;
          }

          // Use created projId to load plans when there was no search
          // const effectiveProjIdForRefresh =
          //   fullProjectId.current ||
          //   normalizedPlan.projId ||
          //   projectId;
          const effectiveProjIdForRefresh = projectId || rawCreatedPlan.projId;

          const newPlans = await refreshPlans(effectiveProjIdForRefresh);

          if (newPlans && newPlans.length > 0) {
            const planToSelect =
              newPlans.find(
                (p) =>
                  p.plId === normalizedPlan.plId &&
                  p.projId === normalizedPlan.projId &&
                  p.plType === normalizedPlan.plType,
              ) || normalizedPlan;

            handleRowClick(planToSelect);
            // onPlanCreated?.(planToSelect);
            if (typeof onPlanSelect === "function") {
              onPlanSelect(planToSelect);
            }

            // setTimeout(() => {
            //   if (tableContainerRef.current) {
            //     // Find the index of the newly created plan in the visible list
            //     const index = newPlans.findIndex(
            //       (p) => p.plId === planToSelect.plId
            //     );
            //     if (index !== -1) {
            //       const rowHeight = 35; // Standard height for your text-xs rows
            //       tableContainerRef.current.scrollTo({
            //         top: index * rowHeight,
            //         behavior: "smooth",
            //       });
            //     }
            //   }
            // }, 100);
            setTimeout(() => {
              const rowElement = document.getElementById(
                `plan-row-${planToSelect.plId}`,
              );
              if (rowElement) {
                rowElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center", // This forces the row to be in the middle of the container
                });
              }
            }, 100);
          }

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
          getAllPlans();
        } else {
          toast.info(`Action "${action}" selected`);
        }
      } catch (err) {
        // toast.error(
        //   "Error performing action: " +
        //     (err.response?.data?.message || err.message)
        // );
        // Extract only the backend message or the raw error messag
        // Show the message directly
        const errorMessage =
          (typeof err.response?.data === "string" ? err.response.data : null) ||
          err.response?.data?.message ||
          err.message;

        toast.error(errorMessage);
      } finally {
        setIsActionLoading(false);
      }
    };

    const getProjectDotLevel = (projId) => {
      if (!projId || typeof projId !== "string") return 0;
      return (projId.match(/\./g) || []).length;
    };

    const getActionOptions = (plan, allPlansSource = null) => {
      let options = ["None"];

      if (!plan?.projId) {
        return options;
      }

      const sourceData = allPlansSource || allData || allProjectPlans || [];
      const masterId = plan.projId.split(".")[0];

      // --- 1. NBBUD Logic ---
      if (plan.plType === "NBBUD") {
        if (plan.status === "In Progress") return ["None", "Delete"];
        if (plan.status === "Approved" || plan.status === "Concluded") {
          return ["None", "Create NB BUD"];
        }
        return options;
      }

      // --- 2. ENTIRE PATH VALIDATION ---
      // Find all existing BUD plans for this master project
      const existingBudgets = sourceData.filter(
        (p) => p.plType === "BUD" && p.projId?.startsWith(masterId),
      );

      let isPathBlocked = false;

      if (existingBudgets.length > 0) {
        const currentId = selectedPlan.projId; // The ID of the row being rendered

        for (const b of existingBudgets) {
          const budgetId = b.projId; // The ID where a budget already exists

          if (currentId === budgetId) {
            // Same level is always allowed
            isPathBlocked = false;
            break;
          }

          // Check if current row is a PARENT of the budget
          // (e.g., current is 20001.00.000100.0000 and budget is 20001.00.000100.0000.0000)
          const isParent = budgetId.startsWith(currentId + ".");

          // Check if current row is a CHILD of the budget
          // (e.g., current is 20001.00.000100.0000.0000 and budget is 20001.00.000100.0000)
          const isChild = currentId.startsWith(budgetId + ".");

          if (isParent || isChild) {
            isPathBlocked = true;
            break;
          }
        }
      }

      // --- 3. APPLY PERMISSIONS ---
      if (!plan.plType && !plan.version) {
        // This is the "Creation Row" (where plType is null)
        if (isPathBlocked) return ["None"];

        return [
          "None",
          "Create Budget",
          "Create Blank Budget",
          "Create NB BUD",
        ];
      }

      // This is an existing plan row
      if (plan.status === "In Progress") {
        options = ["None", "Delete"];
      } else if (plan.status === "Approved" || plan.status === "Concluded") {
        // If path is blocked by a budget at a different level, don't allow creating new ones here
        if (isPathBlocked) {
          options = ["None", "Create EAC"]; // Usually EAC is allowed even if level is locked, or just ["None"]
        } else {
          options = [
            "None",
            "Create Budget",
            "Create Blank Budget",
            "Create EAC",
          ];
        }
      }

      return options;
    };

    const getButtonAvailability = (plan, action, allPlansSource = null) => {
      const options = getActionOptions(plan, allPlansSource);
      return options.includes(action);
    };
    // const getButtonAvailability = (plan, action,allPlansSource = null) => {

    //   const options = getActionOptions(plan,allPlansSource);
    //   return options.includes(action);
    // };

    const checkedFinalVersionIdx = plans.findIndex((plan) => plan.finalVersion);
    const isUser = role.toLowerCase() === "user";

    // const getCheckboxProps = (plan, col, idx) => {
    //   if (!plan.plType || !plan.version)
    //     return { checked: false, disabled: true };

    //   // 2. NEW: If status is Transferred, disable all checkboxes (Submit, Approve, Conclude)
    //   if (plan.status?.toLowerCase() === "transferred") {
    //     return { checked: !!plan[col], disabled: true };
    //   }

    //   if (col === "isCompleted")
    //     return { checked: plan.isCompleted, disabled: !!plan.isApproved };

    //   if (col === "isApproved")
    //     return {
    //       checked: plan.isApproved,
    //       disabled: !plan.isCompleted || plan.finalVersion || isUser,
    //     };

    //   if (col === "finalVersion") {
    //     const anotherFinalVersionIdx = plans.findIndex(
    //       (p, i) =>
    //         i !== idx &&
    //         p.plType === plan.plType &&
    //         p.projId === plan.projId &&
    //         p.finalVersion,
    //     );

    //     return {
    //       checked: plan.finalVersion,
    //       disabled:
    //         anotherFinalVersionIdx !== -1 ||
    //         !plan.isCompleted ||
    //         !plan.isApproved ||
    //         isUser,
    //     };
    //   }

    //   return { checked: plan[col], disabled: false };
    // };

    const getCheckboxProps = (plan, col, idx) => {
      if (!plan.plType || !plan.version)
        return { checked: false, disabled: true };

      if (plan.status?.toLowerCase() === "transferred") {
        return { checked: !!plan[col], disabled: true };
      }

      // 1. Submitted: Disabled if Approved
      if (col === "isCompleted")
        return { checked: plan.isCompleted, disabled: !!plan.isApproved };

      // 2. Approved: Disabled if Not Submitted OR if ALREADY Concluded (Restored Logic)
      if (col === "isApproved")
        return {
          checked: plan.isApproved,
          // This line now correctly locks Approved if the row is Concluded
          disabled: !plan.isCompleted || !!plan.finalVersion || isUser,
        };

      // 3. Concluded: Disabled if ANOTHER row is already Concluded
      if (col === "finalVersion") {
        const anotherFinalVersion = plans.find(
          (p) =>
            p.plId !== plan.plId &&
            p.plType === plan.plType &&
            p.projId === plan.projId &&
            p.finalVersion,
        );

        return {
          checked: plan.finalVersion,
          disabled:
            !!anotherFinalVersion ||
            !plan.isCompleted ||
            !plan.isApproved ||
            isUser,
        };
      }

      return { checked: plan[col], disabled: false };
    };

    const handleTopButtonToggle = async (field) => {
      if (!selectedPlan) {
        toast.error(`No plan selected to update ${field}.`, {
          toastId: "no-plan-selected",
        });
        return;
      }
      const idx = plans.findIndex((p) => p.plId === selectedPlan.plId);
      if (idx === -1) {
        toast.error(`Selected plan not found.`, { toastId: "plan-not-found" });
        return;
      }
      setIsActionLoading(true);
      await handleCheckboxChange(idx, field);
      setIsActionLoading(false);
    };

    const handleCalc = async () => {
      if (!selectedPlan) {
        toast.error("No plan selected for calculation.", {
          toastId: "no-plan-selected",
        });
        return;
      }
      if (!selectedPlan.plId || !selectedPlan.templateId) {
        toast.error(
          "Cannot calculate: Missing required parameters (planID or templateId).",
          {
            toastId: "missing-params",
          },
        );
        return;
      }
      setIsActionLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/Forecast/CalculateRevenueCost?planID=${selectedPlan.plId}&templateId=${selectedPlan.templateId}&type=actual`,
        );
        const message =
          typeof response.data === "string"
            ? response.data
            : response.data?.message || "Revenue Calculation successful!";
        toast.success(message);
        refreshPlans();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Error during calculation.";
        toast.error(errorMessage);
      } finally {
        setIsActionLoading(false);
      }
    };

    const getTopButtonDisabled = (field) => {
      const currentPlan = getCurrentPlan();
      if (!currentPlan || !currentPlan.plType || !currentPlan.version)
        return true;

      // 2. NEW: Disable all action buttons if the plan is Transferred
      if (currentPlan.status?.toLowerCase() === "transferred") {
        return true;
      }

      if (field === "isCompleted") return !!currentPlan.isApproved;
      // if (field === "isApproved") return !currentPlan.isCompleted;
      if (field === "isApproved") {
        // Allow approve/unapprove even when concluded - unconclude first if needed
        return !currentPlan.isCompleted && !currentPlan.finalVersion;
      }
      if (field === "finalVersion") {
        const anotherFinalVersionIdx = plans.findIndex(
          (p) =>
            p.plId !== currentPlan.plId &&
            p.plType === currentPlan.plType &&
            p.projId === currentPlan.projId &&
            p.finalVersion,
        );
        if (anotherFinalVersionIdx !== -1) return true;
        return !currentPlan.isApproved;
      }
      return false;
    };

    const getCalcButtonDisabled = () => {
      return !selectedPlan || !selectedPlan.plId || !selectedPlan.templateId;
    };

    const isAnyActionPerformed = (plansList, selectedProjId) => {
      if (!selectedProjId) return false;
      const selectedLevel = getProjectDotLevel(selectedProjId);
      return plansList.some(
        (plan) => !!plan.plType && plan.projId === selectedProjId,
      );
    };

    const getMasterProjects = (plansList) => {
      return plansList.filter((plan) => {
        const projId = plan.projId?.trim();
        if (!projId) return false;
        return !projId.includes(".");
      });
    };

    const getMasterAndRelatedProjects = (plansList, clickedProjId) => {
      if (!clickedProjId)
        return { master: null, related: [], sameLevelBud: false };

      const parts = clickedProjId.split(".");
      const masterId = parts[0];
      const selectedLevel = parts.length;

      const filtered = plansList.filter(
        (p) => p.projId?.startsWith(masterId) && p.plType === "BUD",
      );

      const seen = new Set();
      const related = filtered
        .filter((p) => {
          if (seen.has(p.projId)) return false;
          seen.add(p.projId);
          return true;
        })
        .map((p) => ({
          ...p,
          level: p.projId.split(".").length,
        }));

      if (related.length === 0) {
        return { master: masterId, related, selectedLevel, sameLevelBud: true };
      }

      const sameLevelBud = related.some((r) => r.level === selectedLevel);

      return { master: masterId, related, selectedLevel, sameLevelBud };
    };

    const currentPlan = getCurrentPlan();

    useEffect(() => {
      let filtered = plans;

      if (typeFilter === "") {
        filtered = filtered.filter(
          (plan) =>
            plan.plType === "" ||
            plan.plType === "BUD" ||
            plan.plType === "EAC" ||
            plan.plType === "NBBUD",
        );
      } else if (typeFilter === "BUD/EAC") {
        filtered = filtered.filter(
          (plan) =>
            plan.plType === "BUD" ||
            plan.plType === "EAC" ||
            plan.plType === "NBBUD",
        );
      } else if (
        typeFilter === "BUD" ||
        typeFilter === "EAC" ||
        typeFilter === "NBBUD"
      ) {
        filtered = filtered.filter((plan) => plan.plType === typeFilter);
      }

      // Apply Type Filter
      // if (typeFilter !== "All") {
      //   if(typeFilter === "BUD/EAC"){
      //     filtered = filtered.filter(
      //       (plan) =>
      //         plan.plType === "BUD" ||
      //         plan.plType === "EAC" ||
      //         plan.plType === "NBBUD",
      //     );
      //   }else {
      //     filtered = filtered.filter((plan) => plan.plType === typeFilter);
      //   }
      // }
      // if (typeFilter === "BUD/EAC") {
      //   filtered = filtered.filter((plan) => plan.plType === 'BUD' || plan.plType === 'EAC');
      //   // setBudEacFilter(!budEacFilter);
      // }

      // Apply Status Filter
      if (typeFilter === "" || typeFilter === "All") {
        filtered = filtered.filter(
          (plan) =>
            plan.plType === "" ||
            plan.plType === "BUD" ||
            plan.plType === "EAC" ||
            plan.plType === "NBBUD",
        );
      } else if (typeFilter === "BUD/EAC") {
        filtered = filtered.filter(
          (plan) =>
            plan.plType === "BUD" ||
            plan.plType === "EAC" ||
            plan.plType === "NBBUD",
        );
      } else if (typeFilter === "BUD" || typeFilter === "EAC") {
        filtered = filtered.filter((plan) => plan.plType === typeFilter);
      }
      // Apply Type Filter
      // if (typeFilter === "BUD/EAC") {
      //   filtered = filtered.filter((plan) => plan.plType === 'BUD' || plan.plType === 'EAC');
      //   // setBudEacFilter(!budEacFilter);
      // }

      // Apply Status Filter
      if (statusFilter === "All" || statusFilter === "") {
        filtered = filtered.filter(
          (plan) =>
            plan.status === "" ||
            plan.status === "In Progress" ||
            plan.status === "Concluded" ||
            plan.status === "Approved" ||
            plan.status === "Submitted" ||
            plan.status.toLowerCase() === "transferred",
        );
      } else {
        filtered = filtered.filter((plan) => plan.status === statusFilter);
      }

      // Apply existing BUD/EAC filter if active
      if (budEacFilter) {
        filtered = filtered.filter(
          (plan) =>
            plan.plType === "BUD" ||
            plan.plType === "EAC" ||
            plan.plType === "NBBUD",
        );
      }

      if (revFormFilter && revFormFilter !== "All" && revFormFilter !== "") {
        // Find the corresponding formula object using either code or description
        const selectedFormulaObj = revFormulas.find(
          (f) =>
            f.formulaDesc === revFormFilter || f.formulaCd === revFormFilter,
        );

        filtered = filtered.filter((plan) => {
          // Make sure 'revenueFormula' points to the correct field on your plan object
          const planFormula = plan.revenueFormula;

          // Check against the filter string directly, OR match against the resolved object properties
          const matchesFilterDirectly = planFormula === revFormFilter;
          const matchesResolvedCode =
            selectedFormulaObj && planFormula === selectedFormulaObj.formulaCd;
          const matchesResolvedDesc =
            selectedFormulaObj &&
            planFormula === selectedFormulaObj.formulaDesc;

          return (
            matchesFilterDirectly || matchesResolvedCode || matchesResolvedDesc
          );
        });
      }

      setFilteredPlans(filtered);
    }, [
      plans,
      typeFilter,
      statusFilter,
      budEacFilter,
      revFormFilter,
      revFormulas,
    ]);

    const isDateMissing =
      filteredProjects.length > 0 &&
      !manualDatesSubmitted && // keep this if you still want banner until API call
      !filteredProjects[0]?.startDate &&
      !filteredProjects[0]?.projStartDt &&
      !filteredProjects[0]?.endDate &&
      !filteredProjects[0]?.projEndDt;

    const displayStartDate =
      manualProjectDates.startDate ||
      filteredProjects[0]?.startDate ||
      filteredProjects[0]?.projStartDt;

    const displayEndDate =
      manualProjectDates.endDate ||
      filteredProjects[0]?.endDate ||
      filteredProjects[0]?.projEndDt;

    if (error) {
      return (
        <div className="p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 relative z-10" key={refreshKey}>
        {isActionLoading && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-20">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-700">Processing...</span>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center mb-2 gap-1 w-full  ">
            {/* LEFT: all action buttons */}
            <div className="flex gap-1 flex-wrap items-center">
              {plans.length >= 0 && (
                <>
                  {currentPlan &&
                    type !== "NBBUD" &&
                    type !== "NBBUDPRICING" &&
                    type !== "OPP" &&
                    getButtonAvailability(currentPlan, "Create Budget") &&
                    isEditable && (
                      <button
                        onClick={() => {
                          setIsActionLoading(true);
                          handleActionSelect(
                            plans.findIndex(
                              (p) => p.plId === selectedPlan?.plId,
                            ),
                            "Create Budget",
                          );
                        }}
                        disabled={
                          !currentPlan ||
                          !getButtonAvailability(currentPlan, "Create Budget")
                        }
                        className={`btn1 ${
                          !currentPlan ||
                          !getButtonAvailability(currentPlan, "Create Budget")
                            ? "btn-disabled"
                            : "btn-blue cursor-pointer"
                        }`}
                        title="Create Budget"
                      >
                        New Budget
                      </button>
                    )}

                  {currentPlan &&
                    type !== "NBBUD" &&
                    type !== "NBBUDPRICING" &&
                    type !== "OPP" &&
                    getButtonAvailability(currentPlan, "Create Blank Budget") &&
                    isEditable && (
                      <button
                        onClick={() => {
                          setIsActionLoading(true);
                          handleActionSelect(
                            plans.findIndex(
                              (p) => p.plId === selectedPlan?.plId,
                            ),
                            "Create Blank Budget",
                          );
                        }}
                        disabled={
                          !currentPlan ||
                          !getButtonAvailability(
                            currentPlan,
                            "Create Blank Budget",
                          )
                        }
                        className={`btn1 ${
                          !currentPlan ||
                          !getButtonAvailability(
                            currentPlan,
                            "Create Blank Budget",
                          )
                            ? "btn-disabled"
                            : "btn-blue cursor-pointer"
                        }`}
                        title="Create Blank Budget"
                      >
                        New Blank Budget
                      </button>
                    )}

                  {currentPlan &&
                    type !== "NBBUD" &&
                    type !== "NBBUDPRICING" &&
                    type !== "OPP" &&
                    getButtonAvailability(currentPlan, "Create EAC") &&
                    isEditable && (
                      <button
                        onClick={() => {
                          setIsActionLoading(true);
                          handleActionSelect(
                            plans.findIndex(
                              (p) => p.plId === selectedPlan?.plId,
                            ),
                            "Create EAC",
                          );
                        }}
                        disabled={
                          !currentPlan ||
                          !getButtonAvailability(currentPlan, "Create EAC")
                        }
                        className={`btn1 ${
                          !currentPlan ||
                          !getButtonAvailability(currentPlan, "Create EAC")
                            ? "btn-disabled"
                            : "btn-blue cursor-pointer"
                        }`}
                        title="Create EAC"
                      >
                        New EAC
                      </button>
                    )}

                  {selectedPlan &&
                    ((selectedPlan.plType === "" &&
                      (type === "NBBUD" ||
                        type === "OPP" ||
                        type === "NBBUDPRICING")) ||
                      ((selectedPlan.status === "Approved" ||
                        selectedPlan.status === "Concluded") &&
                        (type === "NBBUD" ||
                          type === "OPP" ||
                          type === "NBBUDPRICING"))) &&
                    isEditable && (
                      <button
                        onClick={() => {
                          setIsActionLoading(true);
                          handleActionSelect(
                            plans.findIndex(
                              (p) => p.plId === selectedPlan?.plId,
                            ),
                            "Create NB BUD",
                          );
                        }}
                        className="btn1 btn-blue cursor-pointer"
                        title="Create NB BUD"
                      >
                        Create NB BUD
                      </button>
                    )}

                  {/* Detail */}
                  {currentPlan && !isActionLoading && currentPlan?.plType && (
                    <button
                      onClick={() => {
                        if (!selectedPlan) return;
                        sessionStorage.setItem(
                          "lastSelectedPlanId",
                          currentPlan.plId,
                        );
                        onOpenDetails?.();
                      }}
                      className="btn1 btn-blue cursor-pointer"
                      title="View plan details"
                    >
                      Detail
                    </button>
                  )}

                  {/* Monthly Forecast */}
                  {currentPlan &&
                    !isActionLoading &&
                    currentPlan?.plType &&
                    canView("monthlyForecast") &&
                    isEditable && (
                      <button
                        onClick={() => {
                          if (!selectedPlan) return;
                          sessionStorage.setItem(
                            "lastSelectedPlanId",
                            currentPlan.plId,
                          );
                          onOpenMonthly?.();
                        }}
                        className="btn1 btn-blue cursor-pointer"
                        title="Monthly Forecast"
                      >
                        Monthly Forecast
                      </button>
                    )}

                  {/* Submit / Unsubmit */}
                  {!getTopButtonDisabled("isCompleted") &&
                    (role.toLowerCase() === "user" ||
                      role.toLowerCase() === "admin") &&
                    !isActionLoading &&
                    isEditable && (
                      <button
                        onClick={() => handleTopButtonToggle("isCompleted")}
                        className={`btn1 ${
                          getCurrentPlan()?.status === "Submitted"
                            ? "btn-orange cursor-pointer"
                            : "btn-blue cursor-pointer"
                        }`}
                        title={
                          getCurrentPlan()?.status === "Submitted"
                            ? "Unsubmit"
                            : "Submit"
                        }
                      >
                        {isActionLoading
                          ? "Processing..."
                          : getCurrentPlan()?.status === "Submitted"
                            ? "Unsubmit"
                            : "Submit"}
                      </button>
                    )}

                  {/* Approve / Unapprove */}
                  {!getTopButtonDisabled("isApproved") &&
                    (role.toLowerCase() === "approver" ||
                      role.toLowerCase() === "admin") &&
                    !isActionLoading &&
                    !getCurrentPlan()?.finalVersion &&
                    isEditable && (
                      <button
                        onClick={() => handleTopButtonToggle("isApproved")}
                        className={`btn1 ${
                          getCurrentPlan()?.status === "Approved" ||
                          getCurrentPlan()?.finalVersion
                            ? "btn-orange cursor-pointer"
                            : "btn-blue cursor-pointer"
                        }`}
                        title={
                          getCurrentPlan()?.status === "Approved"
                            ? "Unapprove"
                            : "Approve"
                        }
                      >
                        {isActionLoading
                          ? "Processing..."
                          : getCurrentPlan()?.status === "Approved" ||
                              getCurrentPlan()?.finalVersion
                            ? "Unapprove"
                            : "Approve"}
                      </button>
                    )}

                  {/* Conclude / Unconclude */}
                  {!getTopButtonDisabled("finalVersion") &&
                    role.toLowerCase() === "admin" &&
                    !isActionLoading &&
                    isEditable && (
                      <button
                        onClick={() => handleTopButtonToggle("finalVersion")}
                        className={`btn1 ${
                          getCurrentPlan()?.finalVersion
                            ? "btn-orange cursor-pointer"
                            : "btn-blue cursor-pointer"
                        }`}
                        title={
                          getCurrentPlan()?.finalVersion
                            ? "Unconclude"
                            : "Conclude"
                        }
                      >
                        {isActionLoading
                          ? "Processing..."
                          : getCurrentPlan()?.finalVersion
                            ? "Unconclude"
                            : "Conclude"}
                      </button>
                    )}

                  {/* Calc */}
                  {/* {!getCalcButtonDisabled() && role != "user" && (
                    <button
                      onClick={() => {
                        setIsActionLoading(true);
                        handleCalc();
                      }}
                      className="btn1 btn-blue cursor-pointer"
                      title="Calculate"
                    >
                      Calc
                    </button>
                  )} */}
                  {!getCalcButtonDisabled() &&
                    role.toLowerCase() !== "user" &&
                    selectedPlan?.status === "In Progress" &&
                    isEditable && (
                      <button
                        onClick={() => {
                          setIsActionLoading(true);
                          handleCalc();
                        }}
                        className="btn1 btn-blue cursor-pointer"
                        title="Calculate"
                      >
                        Calc
                      </button>
                    )}

                  {/* BUD/EAC filter always visible */}
                  {/* <button
                    onClick={() => setBudEacFilter(!budEacFilter)}
                    className={`btn1 ${
                      budEacFilter
                        ? "btn-orange cursor-pointer"
                        : "btn-blue cursor-pointer"
                    }`}
                    title={
                      budEacFilter ? "Show All Plans" : "Filter BUD/EAC Plans"
                    }
                  >
                    {budEacFilter ? "Show All" : "BUD/EAC"}
                  </button> */}

                  {/* New Business always visible */}
                  {/* <button
    onClick={() => setShowNewBusinessPopup(true)}
    className="btn1 btn-green cursor-pointer"
    title="New Business"
  >
    New Business
  </button> */}

                  {/* Save Date */}
                  {/* {!isActionLoading && !isSaveDatesDisabled() && (
                    <button
                      onClick={handleSaveDatesClick}
                      className="btn1 btn-blue cursor-pointer"
                      title="Save Project Dates"
                    >
                      Save Date
                    </button>
                  )} */}

                  {/* Delete */}
                  {currentPlan &&
                    !currentPlan.isApproved &&
                    getButtonAvailability(currentPlan, "Delete") &&
                    getMasterAndRelatedProjects(plans, currentPlan?.projId)
                      .sameLevelBud &&
                    isEditable && (
                      <button
                        onClick={() => {
                          setIsActionLoading(true);
                          handleActionSelect(
                            plans.findIndex(
                              (p) => p.plId === selectedPlan?.plId,
                            ),
                            "Delete",
                          );
                        }}
                        className="btn1 btn-red cursor-pointer"
                        title="Delete Selected Plan"
                      >
                        Delete
                      </button>
                    )}

                  {/* <button
                  onClick={() => setShowNewBusinessPopup(true)}
                  className="btn1 btn-green cursor-pointer"
                  title="New Business"
                >
                  New Business
                </button> */}

                  {/* <button
  onClick={handleSaveDatesClick}
  disabled={isActionLoading || !selectedPlan}
  className={`btn1 ${
    isActionLoading || !selectedPlan ? "btn-disabled" : "btn-blue"
  }`}
  title="Save Project Dates"
>
  Save Dates
</button> */}
                  {/* <button
                  onClick={handleSaveDatesClick}
                  disabled={isActionLoading || isSaveDatesDisabled()}
                  className={`btn1 ${
                    isActionLoading || isSaveDatesDisabled()
                      ? "btn-disabled"
                      : "btn-blue cursor-pointer"
                  }`}
                  title="Save Project Dates"
                >
                  Save Date
                </button>
 
                 <button
                  onClick={() => {
                    setIsActionLoading(true);
                    handleActionSelect(
                      plans.findIndex((p) => p.plId === selectedPlan?.plId),
                      "Delete"
                    );
                  }}
                  disabled={
                    !currentPlan ||
                    selectedPlan.isApproved ||
                    !getButtonAvailability(currentPlan, "Delete") ||
                    !getMasterAndRelatedProjects(plans, currentPlan?.projId)
                      .sameLevelBud
                  }
                  className={`btn1 ${
                    !currentPlan ||
                    currentPlan.isApproved ||
                    !getButtonAvailability(currentPlan, "Delete") ||
                    !getMasterAndRelatedProjects(plans, currentPlan?.projId)
                      .sameLevelBud
                      ? "btn-disabled"
                      : "btn-red cursor-pointer"
                  }`}
                  title="Delete Selected Plan"
                >
                  Delete
                </button> */}
                </>
              )}
            </div>

            {/* RIGHT: Import + filters (pushed right) */}
            <div className="flex flex-col gap-2 ml-auto ">
              {/* FIRST LINE: Import + Fiscal Year */}
              {/* <div className="flex items-center gap-2">
     
      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-blue-600 text-white px-1 py-1 rounded hover:bg-blue-700 flex items-center text-xs cursor-pointer whitespace-nowrap"
        title="Import Plan"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 mr-0.5"
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
        Import
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportPlan}
        accept=".xlsx,.xls"
        className="hidden"
      />

    
    </div> */}

              {/* SECOND LINE: Plan Type + Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  {type === "PROJECT" && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-gray-500 whitespace-nowrap ">
                        Plan Type
                      </span>
                      <select
                        className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 "
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        disabled={filteredProjects.length === 0}
                      >
                        <option value="">All</option>
                        <option value="BUD/EAC">BUD/EAC</option>
                        <option value="BUD">BUD</option>
                        <option value="EAC">EAC</option>
                        {/* <option value="NBBUD">NBBUD</option> */}
                      </select>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-500">
                      Status
                    </span>
                    <select
                      className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100  "
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      disabled={filteredProjects.length === 0}
                    >
                      <option value="">All</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Concluded">Concluded</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                      Revenue Formula
                    </span>
                    <select
                      className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 max-w-[150px]"
                      value={revFormFilter}
                      onChange={(e) => setRevFormFilter(e.target.value)}
                      disabled={
                        filteredProjects.length === 0 ||
                        revFormulas.length === 0
                      }
                    >
                      <option value="">All</option>
                      {revFormulas.map((formula) => (
                        <option
                          key={formula.formulaCd}
                          value={formula.formulaCd}
                        >
                          {formula.formulaDesc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isEditable && (
                    <div className="flex items-center">
                      <button
                        onClick={() => fileInputRef.current.click()}
                        // disabled={
                        //   filteredProjects.length === 0 ||
                        //   selectedPlan?.status !== "In Progress"
                        // }
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        Import
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportPlan}
                        accept=".xlsx,.xls"
                        className="hidden"
                      />
                    </div>
                  )}

                  {isLumina && (
                    <div className="flex items-center">
                      <button
                        onClick={() => fileInputRef.current.click()}
                        // disabled={
                        //   filteredProjects.length === 0 ||
                        //   selectedPlan?.status !== "In Progress"
                        // }
                        className="btn1 btn-blue cursor-pointer flex items-center"
                        title="Upload Plan"
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
                        {luminaPeoplePlan ? "Uploading..." : "Upload"}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) =>
                          syncLuminaPeoplePlans(e.target.files[0])
                        }
                        accept=".xlsx,.xls"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded border border-gray-200 overflow-hidden relative ${
              showNewBusinessPopup ? "" : ""
            }`}
          >
            {showNewBusinessPopup && (
              <div className="absolute inset-0 z-40">
                <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4">
                      <NewBusiness
                        onClose={() => setShowNewBusinessPopup(false)}
                        onSaveSuccess={handleNewBusinessSave}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              ref={tableContainerRef}
              // className={`overflow-x-auto max-h-[65vh] min-h-[65vh] ${
              //   showNewBusinessPopup ? "blur-sm pointer-events-none" : ""
              // }`}
              className={`overflow-x-auto h-[calc(100vh-260px)] ${
                showNewBusinessPopup ? "blur-sm pointer-events-none" : ""
              }`}
            >
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead
                  className={`bg-gray-200 sticky top-0 ${loading ? "z-0" : "z-50"}`}
                >
                  <tr>
                    <th className="border-b border-r border-gray-300 px-2 py-1 text-[12px] font-semibold bg-[#e5f3fb] text-black capitalize tracking-wide w-6 text-center">
                      Export
                    </th>

                    {columns.map((col) => (
                      <th
                        key={col}
                        className={`border-b border-gray-300 w-6 border-r whitespace-nowrap text-xs px-2 py-1 text-[12px] font-semibold bg-[#e5f3fb] text-black capitalize tracking-wide text-center"
                        }`}
                      >
                        {COLUMN_LABELS[col] || col}
                      </th>
                    ))}
                    <th className="border-b border-r border-gray-300 px-2 py-1 text-[12px] font-semibold whitespace-nowrap bg-[#e5f3fb] text-black capitalize tracking-wide w-6 text-center">
                      Audit Trail
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={columns.length}>
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2 mt-4">
                            Loading project plans...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPlans.length === 0 ||
                    (!searched && projectId.trim() === "") ? (
                    <tr>
                      <td colSpan={columns.length + 1}>
                        <div className="p-8 text-center text-gray-500 text-lg">
                          Search and select a valid Project to view details
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPlans.map((plan, idx) => (
                      <tr
                        id={`plan-row-${plan.plId}`}
                        key={`plan-${plan.plId || idx}-${
                          plan.projId || "unknown"
                        }`}
                        className={`transition-all duration-200 cursor-pointer ${
                          selectedPlan &&
                          // selectedPlan.plId === plan.plId &&
                          // selectedPlan.projId === plan.projId
                          String(selectedPlan.projId) === String(plan.projId) &&
                          Number(selectedPlan.plId || 0) ===
                            Number(plan.plId || 0)
                            ? "bg-blue-200 hover:bg-blue-300 "
                            : " hover:bg-blue-50"
                        }`}
                        onClick={() => {
                          handleRowClick(plan);
                          getMasterAndRelatedProjects(plans, plan.projId);
                        }}
                        onDoubleClick={() => {
                          if (plan.plType) {
                            sessionStorage.setItem(
                              "lastSelectedPlanId",
                              currentPlan.plId,
                            );
                            onOpenDetails?.();
                          }
                        }}
                      >
                        <td className="px-1 py-1 h-1 text-xs border-r border-b border-gray-300 text-gray-700  text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportPlan(plan);
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Export to Excel"
                            disabled={
                              !plan.projId || !plan.version || !plan.plType
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 cursor-pointer"
                              viewBox="0 0 48 48"
                            >
                              <defs>
                                <linearGradient
                                  id="grad1"
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="100%"
                                >
                                  <stop
                                    offset="0%"
                                    style={{ stopColor: "#21A366" }}
                                  />
                                  <stop
                                    offset="100%"
                                    style={{ stopColor: "#185C37" }}
                                  />
                                </linearGradient>
                              </defs>

                              <rect
                                x="18"
                                y="6"
                                width="24"
                                height="18"
                                fill="url(#grad1)"
                              />
                              <rect
                                x="18"
                                y="24"
                                width="24"
                                height="18"
                                fill="#107C41"
                              />

                              <rect
                                x="6"
                                y="10"
                                width="16"
                                height="28"
                                rx="2"
                                fill="#185C37"
                              />

                              <path
                                fill="#fff"
                                d="M11.5 29.5L14.2 24l-2.7-5.5h2.9l1.5 3.6 1.5-3.6h2.9L17.2 24l2.7 5.5h-2.9l-1.5-3.6-1.5 3.6z"
                              />
                            </svg>
                          </button>
                        </td>
                        {columns.map((col) => (
                          <td
                            key={col}
                            className={`
      text-xs h-1 px-1 py-1 text-gray-700 border-r border-b border-gray-200
      ${
        col === "projId" || col === "projName"
          ? "text-left break-words"
          : "text-center"
      }
      ${
        col === "createdAt" || col === "updatedAt" || col === "closedPeriod"
          ? " whitespace-nowrap"
          : ""
      }
    `}
                          >
                            {col === "closedPeriod" ? (
                              formatDateOnly(plan[col])
                            ) : col === "createdAt" || col === "updatedAt" ? (
                              formatDateWithTime(plan[col])
                            ) : col === "projectStartDate" ||
                              col === "projectEndDate" ? (
                              selectedPlan?.plId === plan.plId &&
                              selectedPlan?.projId === plan.projId ? (
                                <input
                                  type="date"
                                  value={
                                    editingDates[plan.plId]?.[
                                      col === "projectStartDate"
                                        ? "startDate"
                                        : "endDate"
                                    ] ||
                                    (col === "projectStartDate"
                                      ? plan.projStartDt || plan.startDate
                                      : plan.projEndDt || plan.endDate) ||
                                    ""
                                  }
                                  // IMPORTANT: remove onClick stopPropagation here
                                  // onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    // explicitly keep this row as selected when typing in date
                                    handleRowClick(plan);
                                    handleDateCellChange(
                                      plan.plId,
                                      col,
                                      e.target.value,
                                    );
                                  }}
                                  className={`rounded px-1 py-0.5 text-xs w-26 text-center border transition-colors ${
                                    // Visual feedback: Yellow background if it's editable
                                    !plan.plType || isEditable
                                      ? "bg-yellow-50 border-blue-300 focus:border-blue-500"
                                      : "bg-gray-100 border-transparent"
                                  }`}
                                  disabled={plan.plType || !isEditable}
                                  // && plan.status !== "In Progress"
                                  // &&  plan.status !== "In Progress"

                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                // <div
                                //   className="relative flex justify-center"
                                //   onClick={(e) => e.stopPropagation()}
                                // >
                                //   <DatePicker
                                //     // Get current value from state or plan
                                //     selected={(() => {
                                //       const dateStr =
                                //         editingDates[plan.plId]?.[
                                //           col === "projectStartDate"
                                //             ? "startDate"
                                //             : "endDate"
                                //         ] ||
                                //         (col === "projectStartDate"
                                //           ? plan.projStartDt || plan.startDate
                                //           : plan.projEndDt || plan.endDate);
                                //       return dateStr
                                //         ? new Date(dateStr + "T00:00:00")
                                //         : null;
                                //     })()}
                                //     onChange={(date) => {
                                //       handleRowClick(plan);
                                //       if (date) {
                                //         // Format to YYYY-MM-DD to keep your backend/logic happy
                                //         const yyyy = date.getFullYear();
                                //         const mm = String(
                                //           date.getMonth() + 1,
                                //         ).padStart(2, "0");
                                //         const dd = String(
                                //           date.getDate(),
                                //         ).padStart(2, "0");
                                //         const formatted = `${yyyy}-${mm}-${dd}`;
                                //         handleDateCellChange(
                                //           plan.plId,
                                //           col,
                                //           formatted,
                                //         );
                                //       }
                                //     }}
                                //     // The display format you requested
                                //     dateFormat="MM/dd/yyyy"
                                //     className={`rounded px-1 py-0.5 text-xs  w-full text-center border transition-colors cursor-pointer ${
                                //       !plan.plType
                                //         ? "bg-yellow-50 border-blue-300 focus:border-blue-500"
                                //         : "bg-gray-100 border-transparent"
                                //     }`}
                                //     disabled={!!plan.plType}
                                //     placeholderText="MM/DD/YYYY"
                                //     // Prevent typing to enforce picker
                                //     onFocus={(e) => (e.target.readOnly = true)}
                                //     // portalId="root-portal"
                                //     popperPlacement="bottom-end"
                                //   />

                                //   {!plan.plType && (
                                //     <SlCalender className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs cursor-pointer pointer-events-none" />
                                //   )}
                                // </div>
                                <span className="text-xs text-gray-700 text-center">
                                  {formatDateOnly(
                                    col === "projectStartDate"
                                      ? plan.projStartDt || plan.startDate
                                      : plan.projEndDt || plan.endDate || "",
                                  )}
                                </span>
                              )
                            ) : col === "templateId" ? (
                              <select
                                value={plan.templateId || 0}
                                onChange={(e) =>
                                  handleTemplateChange(plan, e.target.value)
                                }
                                // className="border border-gray-300 rounded px-1 py-0.5 text-xs"
                                // disabled={plan.status !== "In Progress"}
                                disabled={
                                  (plan.plType &&
                                    plan.status !== "In Progress") ||
                                  !isEditable
                                }
                                className={`border border-gray-300 rounded px-1 py-0.5 text-xs ${
                                  (plan.plType &&
                                    plan.status !== "In Progress") ||
                                  !isEditable
                                    ? "cursor-not-allowed bg-gray-200"
                                    : "bg-white"
                                }`}
                              >
                                {/* <option value={0}>Select</option> */}
                                {templates.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.templateCode}
                                  </option>
                                ))}
                              </select>
                            ) : col === "type" ? (
                              <select
                                value={plan.type || ""} // Maps to "A", "T", or empty string
                                onChange={(e) =>
                                  handleRevenueType(plan, e.target.value)
                                }
                                disabled={
                                  (plan.plType &&
                                    plan.status !== "In Progress") ||
                                  !isEditable
                                }
                                className={`border border-gray-300 rounded px-1 py-0.5 text-xs ${
                                  (plan.plType &&
                                    plan.status !== "In Progress") ||
                                  !isEditable
                                    ? "cursor-not-allowed bg-gray-200"
                                    : "bg-white"
                                }`}
                              >
                                {/* <option value="">Select</option> */}
                                <option value="A">Actual</option>
                                <option value="T">Target</option>
                              </select>
                            ) : col === "versionCode" ? (
                              // <input
                              //   type="text"
                              //   value={
                              //     editingVersionCodeIdx === plan.plId
                              //       ? editingVersionCodeValue
                              //       : plan.versionCode || ""
                              //   }
                              //   autoFocus={editingVersionCodeIdx === plan.plId}
                              //   onClick={(e) => {
                              //     e.stopPropagation();
                              //     setEditingVersionCodeIdx(plan.plId);
                              //     setEditingVersionCodeValue(
                              //       plan.versionCode || "",
                              //     );
                              //   }}
                              //   onChange={(e) =>
                              //     setEditingVersionCodeValue(e.target.value)
                              //   }
                              //   onBlur={() => {
                              //     if (editingVersionCodeIdx === plan.plId) {
                              //       if (
                              //         editingVersionCodeValue !==
                              //         plan.versionCode
                              //       ) {
                              //         handleVersionCodeChange(
                              //           plan.plId,
                              //           editingVersionCodeValue,
                              //         );
                              //       }
                              //       setEditingVersionCodeIdx(null);
                              //     }
                              //   }}
                              //   onKeyDown={(e) => {
                              //     if (e.key === "Enter") {
                              //       if (
                              //         editingVersionCodeValue !==
                              //         plan.versionCode
                              //       ) {
                              //         handleVersionCodeChange(
                              //           plan.plId,
                              //           editingVersionCodeValue,
                              //         );
                              //       }
                              //       setEditingVersionCodeIdx(null);
                              //     } else if (e.key === "Escape") {
                              //       setEditingVersionCodeIdx(null);
                              //       setEditingVersionCodeValue(
                              //         plan.versionCode || "",
                              //       );
                              //     }
                              //   }}
                              //   className={`border border-gray-300 rounded px-2 py-1 w-20 text-xs hover:border-blue-500 focus:border-blue-500 focus:outline-none ${
                              //     !plan.plType || !plan.version
                              //       ? "bg-gray-100 cursor-not-allowed"
                              //       : "bg-white"
                              //   }`}
                              //   disabled={!plan.plType || !plan.version}
                              // />
                              <select
                                value={plan.versionCode || ""}
                                onChange={(e) =>
                                  handleVersionCodeChange(
                                    plan.plId,
                                    e.target.value,
                                  )
                                }
                                //  disabled={
                                //   plan.plType && plan.status !== "In Progress"
                                // }
                                // className={`border border-gray-300 rounded px-1 py-0.5 text-xs ${
                                //   plan.plType && plan.status !== "In Progress"
                                //     ? "cursor-not-allowed bg-gray-200"
                                //     : "bg-white"
                                // }`}
                                className={`border border-gray-300 rounded px-2 py-1 w-20 text-xs hover:border-blue-500 focus:border-blue-500 focus:outline-none ${
                                  !plan.projId ||
                                  !isEditable ||
                                  plan.status !== "In Progress"
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white"
                                }`}
                                disabled={
                                  (!plan.projId && !isEditable) ||
                                  plan.status !== "In Progress"
                                }
                              >
                                <option value="">Select</option>

                                {versionData?.map((version) => (
                                  <option key={version.id} value={version.id}>
                                    {version.versionCodeValue}
                                  </option>
                                ))}
                              </select>
                            ) : typeof plan[col] === "boolean" ? (
                              <input
                                type="checkbox"
                                checked={
                                  getCheckboxProps(plan, col, idx).checked
                                }
                                disabled={
                                  getCheckboxProps(plan, col, idx).disabled ||
                                  !isEditable ||
                                  // If none of these allowed pairings are true, disable the checkbox
                                  !(
                                    (role === "admin" &&
                                      col === "finalVersion") ||
                                    ((role === "user" || role === "admin") &&
                                      col === "isCompleted") ||
                                    ((role === "approver" ||
                                      role === "admin") &&
                                      col === "isApproved")
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleCheckboxChange(idx, col);
                                }}
                                className="cursor-pointer"
                              />
                            ) : col === "status" ? (
                              <span
                                className={`
          inline-block rounded-2xl px-4 py-1 whitespace-nowrap
          ${
            plan.status === "Submitted"
              ? "bg-yellow-100 text-black"
              : plan.status === "In Progress"
                ? "bg-red-100 text-black"
                : plan.status === "Approved"
                  ? "bg-green-100 text-black"
                  : plan.status === "Concluded"
                    ? "bg-blue-200 text-black"
                    : ""
          }
        `}
                                style={{ minWidth: 90, textAlign: "center" }}
                              >
                                {plan.status}
                              </span>
                            ) : (
                              plan[col] || ""
                            )}
                          </td>
                        ))}
                        {/* 3. Actions Column (Last) */}
                        <td className="px-4 py-2.5 whitespace-nowrap text-center text-gray-700">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFetchAuditLogs(plan);
                            }}
                            // disabled={!plan.plId}
                            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded transition-colors disabled:text-gray-400"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {/* <div className="w-full bg-[#e5f3fb] text-white flex items-center justify-center ">
              <div className="flex items-center justify-end gap-2 px-4 py-2  border-gray-100 w-fit ml-auto mb-1 text-sm text-gray-900">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  className="text-[#17414d] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const showMax = 5; // Adjustment for number of visible page buttons
                    if (totalPages <= showMax + 2) {
                      // If total pages are few, show all of them
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      // Logic for large page counts (like 50)
                      pages.push(1); // Always show first page

                      if (currentPage > 3) {
                        pages.push("...");
                      }

                      // Show pages around the current page
                      let start = Math.max(2, currentPage - 1);
                      let end = Math.min(totalPages - 1, currentPage + 1);

                      // Keep a consistent number of buttons when at the edges
                      if (currentPage <= 2) end = 4;
                      if (currentPage >= totalPages - 1) start = totalPages - 3;

                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push("...");
                      }

                      pages.push(totalPages); // Always show last page
                    }

                    return pages.map((page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === "number" && handlePageClick(page)
                        }
                        disabled={page === "..."}
                        className={`w-8 h-8 flex items-center cursor-pointer justify-center rounded-full transition-all ${
                          currentPage === page
                            ? "bg-[#17414d] text-white font-bold "
                            : page === "..."
                              ? "cursor-default text-gray-400"
                              : "hover:bg-white hover:text-[#17414d]"
                        }`}
                      >
                        {page}
                      </button>
                    ));
                  })()}
                </div>

           
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  className="text-[#17414d] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
 
                <div className="relative flex items-center rounded px-2 bg-white transition-colors">
             
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-transparent py-1 pr-4 pl-1 
                           focus:outline-none cursor-pointer text-black"
                  >
                    <option value={30} className="text-black bg-white">
                      30 / page
                    </option>
                    <option value={60} className="text-black bg-white">
                      60 / page
                    </option>
                    <option value={90} className="text-black bg-white">
                      90 / page
                    </option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="absolute right-2 text-gray-400 pointer-events-none"
                  />
                </div>

                
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-black font-semibold">Go to</span>
                  <input
                    type="text"
                    value={goToValue}
                    onChange={(e) =>
                      setGoToValue(e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={handleGoTo}
                    placeholder="#"
                    className="w-12 border border-gray-200 outline-none bg-white rounded py-1 text-center transition-all "
                  />
                  <span className="text-black font-semibold">Page</span>
                </div>
              </div>
            </div> */}
          </div>
          {showForm && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => {
                  setShowForm(false);
                  setIsActionLoading(false);
                }}
              ></div>

              <div
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                className="relative bg-white w-full max-w-[650px] max-h-[100vh] overflow-hidden flex flex-col border rounded"
              >
                <div
                  onMouseDown={handleMouseDown}
                  className="cursor-move p-2 font-semibold border-b"
                >
                  Create New Project Plan
                </div>
                <div className="overflow-y-auto p-4 custom-scrollbar">
                  <ProjectPlanForm
                    projectId={fullProjectId.current || projectId}
                    existingProjects={existingProjectsList}
                    action={action}
                    handleActionSelect={handleActionSelect}
                    setShowForm={setShowForm}
                    fiscalYear={fiscalYear}
                    plans={plans}
                    selectedPlan={selectedPlan}
                    onClose={() => {
                      setShowForm(false);
                      setIsActionLoading(false);
                    }}
                    onPlanCreated={() => {
                      refreshPlans();
                      setShowForm(false);
                      setIsActionLoading(false);
                    }}
                    setIsActionLoading={setIsActionLoading}
                    refreshPlans={refreshPlans}
                    handleRowClick={handleRowClick}
                    onPlanSelect={onPlanSelect}
                    getAllPlans={getAllPlans}
                    getButtonAvailability={getButtonAvailability}
                    editingDates={editingDates}
                    escalationConfigs={escalationConfigs}
                    setEscalationConfigs={setEscalationConfigs}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {importErrorModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
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
              <div className="flex-1 overflow-auto p-2 bg-gray-50">
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

        {/* Audit Logs Modal */}
        {auditModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  Audit Trails : Project ID: {auditModal?.projId} | Version
                  Type: {auditModal?.versionCode}
                </h3>
                <button
                  onClick={() =>
                    setAuditModal({
                      isOpen: false,
                      loading: false,
                      data: [],
                      planId: null,
                      projId: null,
                      versionCode: null,
                    })
                  }
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 min-h-[250px]">
                {auditModal.loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-500 text-sm">
                      Loading logs...
                    </span>
                  </div>
                ) : auditModal.data.length === 0 ? (
                  <div className="text-center text-gray-500 py-12 text-sm">
                    No audit records found for this plan.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Dynamic Global Notes Section */}
                    {auditModal.data[0]?.notes && (
                      <div className="bg-amber-50/60 border border-amber-200 rounded p-4 text-xs text-gray-700 shadow-sm">
                        <h4 className="font-semibold text-amber-900 mb-1.5 tracking-wider text-[10px]">
                          System Version & Modification Notes
                        </h4>
                        <p className="whitespace-pre-line leading-relaxed max-h-[160px] overflow-y-auto pr-2 font-mono">
                          {auditModal.data[0].notes}
                        </p>
                      </div>
                    )}

                    <div className="overflow-x-auto shadow-sm border border-gray-200 rounded">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 ">
                              User
                            </th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 ">
                              Action
                            </th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 ">
                              Details
                            </th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">
                              Timestamp
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-xs">
                          {auditModal.data.map((log) => (
                            <tr
                              key={log.auditId}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-2.5 text-gray-700 font-medium">
                                <span className="bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-800 border border-gray-200/60">
                                  {log.username}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 font-semibold text-blue-600">
                                {log.actionType}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 max-w-xs break-words">
                                {log.actionDetails}
                              </td>
                              <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                                {formatDateWithTime(log.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() =>
                    setAuditModal({
                      isOpen: false,
                      loading: false,
                      data: [],
                      planId: null,
                    })
                  }
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {dateModal.isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Explicit background color assignment
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            className="animate-fadeIn"
          >
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100 transform transition-all">
              {/* Header */}
              <div className="mb-4">
                <p className="mt-1 text-sm text-gray-500">
                  <span className="font-semibold text-blue-600">
                    {dateModal.action}
                  </span>
                  .
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 my-5">
                <div className="label-input-div">
                  <label className="input-label">Start Date</label>
                  <input
                    type="date"
                    value={dateModal.startDate}
                    onChange={(e) =>
                      setDateModal({ ...dateModal, startDate: e.target.value })
                    }
                    min={selectedPlan?.projStartDt}
                    className="input-style"
                  />
                </div>

                <div className="label-input-div">
                  <label className="input-label">End Date</label>
                  <input
                    type="date"
                    value={dateModal.endDate}
                    onChange={(e) =>
                      setDateModal({ ...dateModal, endDate: e.target.value })
                    }
                    className="input-style"
                  />
                </div>

                {/* Description Input Field */}
                <div className="label-input-div">
                  <label className="input-label">Description</label>
                  <textarea
                    rows={3}
                    value={dateModal.description || ""}
                    onChange={(e) =>
                      setDateModal({
                        ...dateModal,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description..."
                    className="input-style"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* Carry Forward Options (Radio Buttons) */}
                  <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <input
                      type="radio"
                      id="carryForwardBase"
                      name="carryForwardOption"
                      value="base"
                      checked={carryForwardType === "base"}
                      onChange={(e) => setCarryForwardType(e.target.value)}
                      className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="carryForwardBase"
                      className="cursor-pointer text-sm font-medium text-gray-700"
                    >
                      Carry Forward From Base Year
                    </label>
                  </div>

                  <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <input
                      type="radio"
                      id="carryForwardSource"
                      name="carryForwardOption"
                      value="source"
                      checked={carryForwardType === "source"}
                      onChange={(e) => setCarryForwardType(e.target.value)}
                      className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="carryForwardSource"
                      className="cursor-pointer text-sm font-medium text-gray-700"
                    >
                      Carry Forward From Source
                    </label>
                  </div>
                </div>

                {carryForwardType === "base" && (
                  <>
                    <div className="label-input-div">
                      <label className="input-label text-xs max-w-full leading-tight">
                        Fiscal / Project Year
                      </label>
                      <select
                        value={selectedFiscalYear}
                        onChange={(e) => setSelectedFiscalYear(e.target.value)}
                        className="input-style mt-1"
                      >
                        <option value="0">Select Year</option>
                        {fiscalYearOptions
                          ?.filter(
                            (year) => String(year).toLowerCase() !== "all",
                          )
                          .map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                      </select>
                    </div>
                    {/* Escalation Config Input Fields */}
                    <div className="label-input-div">
                      <label className="input-label">Labor Escalation %</label>
                      <input
                        type="number"
                        value={escalationConfigs.escallation_percent}
                        onChange={(e) =>
                          setEscalationConfigs({
                            ...escalationConfigs,
                            escallation_percent: e.target.value,
                          })
                        }
                        className="input-style"
                      />
                    </div>

                    <div className="label-input-div">
                      <label className="input-label">Vendor Escalation %</label>
                      <input
                        type="number"
                        value={escalationConfigs.vendor_escallation_percent}
                        onChange={(e) =>
                          setEscalationConfigs({
                            ...escalationConfigs,
                            vendor_escallation_percent: e.target.value,
                          })
                        }
                        className="input-style"
                      />
                    </div>

                    <div className="label-input-div">
                      <label className="input-label">
                        Non-Labor Escalation %
                      </label>
                      <input
                        type="number"
                        value={escalationConfigs.nonlabor_escallation_percent}
                        onChange={(e) =>
                          setEscalationConfigs({
                            ...escalationConfigs,
                            nonlabor_escallation_percent: e.target.value,
                          })
                        }
                        className="input-style"
                      />
                    </div>
                  </>
                )}

                {/* Conditional Project Plan Year Dropdown (Only shown when base is selected) */}
                {/* {carryForwardType === "base" && (
                 
                )} */}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const {
                      startDate,
                      endDate,
                      action,
                      planIndex,
                      description,
                    } = dateModal;

                    if (!startDate || !endDate) {
                      toast.error("Both Start and End dates are required.");
                      return;
                    }
                    if (startDate > endDate) {
                      toast.error("Start Date cannot be after End Date.");
                      return;
                    }

                    // Validation: require year selection if Base is active
                    if (
                      carryForwardType === "base" &&
                      (!selectedFiscalYear || selectedFiscalYear === "0")
                    ) {
                      toast.error("Please select a Fiscal/Project Year.");
                      return;
                    }

                    // 1. Boolean flag: true if base, false if source or unselected
                    const carryForwardPriorYearFlag =
                      carryForwardType === "base";

                    // 2. Base year value: pass selected fiscal year if base, 0 if source or unselected
                    const baseYearValue =
                      carryForwardType === "base"
                        ? Number(selectedFiscalYear) || 0
                        : 0;

                    const origStart =
                      dateModal.plan?.projStartDt ||
                      dateModal.plan?.startDate ||
                      "N/A";
                    const origEnd =
                      dateModal.plan?.projEndDt ||
                      dateModal.plan?.endDate ||
                      "N/A";

                    const isDateChanged =
                      startDate !== origStart || endDate !== origEnd;

                    // let notes = isDateChanged
                    //   ? `Date range updated from [${origStart} - ${origEnd}] to [${startDate} - ${endDate}].`
                    //   : `Date range: [${startDate} - ${endDate}].`;

                    // if (carryForwardType === "base") {
                    //   notes += ` Carry Forward enabled (Base Year) for Fiscal/Project Year: ${selectedFiscalYear}.`;
                    //   notes += ` Escalations applied - Labor: ${escalationConfigs.escallation_percent || 0}%, Vendor: ${escalationConfigs.vendor_escallation_percent || 0}%, Non-Labor: ${escalationConfigs.nonlabor_escallation_percent || 0}%.`;
                    // } else if (carryForwardType === "source") {
                    //   notes += ` Carry Forward enabled (Source).`;
                    //   notes += ` Escalations carried forward directly from source without escalation for Non-Labor, and retaining source values for Labor.`;
                    // } else {
                    //   notes += ` Carry Forward disabled.`;
                    //   notes += ` Escalations applied - Labor: ${escalationConfigs.escallation_percent || 0}%, Vendor: ${escalationConfigs.vendor_escallation_percent || 0}%, Non-Labor: ${escalationConfigs.nonlabor_escallation_percent || 0}%.`;
                    // }

                    // // Append description to notes if provided
                    // if (description?.trim()) {
                    //   notes += ` Description: ${description.trim()}.`;
                    // }
                    let notes = isDateChanged
                      ? `Date range updated from [${origStart} - ${origEnd}] to [${startDate} - ${endDate}].`
                      : `Date range: [${startDate} - ${endDate}].`;

                    if (carryForwardType === "base") {
                      notes += `\nCarry Forward enabled (Base Year) for Fiscal/Project Year: ${selectedFiscalYear}.`;
                      notes += `\nEscalations applied - Labor: ${escalationConfigs.escallation_percent || 0}%, Vendor: ${escalationConfigs.vendor_escallation_percent || 0}%, Non-Labor: ${escalationConfigs.nonlabor_escallation_percent || 0}%.`;
                    } else if (carryForwardType === "source") {
                      notes += `\nCarry Forward enabled (Source).`;
                      notes += `\nEscalations carried forward directly from source without escalation for Non-Labor, and retaining source values for Labor.`;
                    } else {
                      notes += `\nCarry Forward disabled.`;
                      notes += `\nEscalations applied - Labor: ${escalationConfigs.escallation_percent || 0}%, Vendor: ${escalationConfigs.vendor_escallation_percent || 0}%, Non-Labor: ${escalationConfigs.nonlabor_escallation_percent || 0}%.`;
                    }

                    // Append description to notes if provided
                    if (description?.trim()) {
                      notes += `\nDescription: ${description.trim()}.`;
                    }
                    // notes += ` Escalations applied - Labor: ${escalationConfigs.escallation_percent || 0}%, Vendor: ${escalationConfigs.vendor_escallation_percent || 0}%, Non-Labor: ${escalationConfigs.nonlabor_escallation_percent || 0}%.`;

                    setDateModal({ ...dateModal, isOpen: false });

                    // 3. Dispatch converted flags to action handler
                    handleActionSelect(
                      planIndex,
                      action,
                      startDate,
                      endDate,
                      escalationConfigs,
                      carryForwardPriorYearFlag, // Passes true for base, false for source
                      baseYearValue, // Passes year number for base, 0 for source
                      notes,
                      description || "",
                    );
                  }}
                  className="btn1 btn-blue cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setDateModal({ ...dateModal, isOpen: false })}
                  className="btn1 btn-blue cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default ProjectPlanTable;
