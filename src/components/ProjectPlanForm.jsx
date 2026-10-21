import React, { useState, useEffect, version } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "./config";
import Select from "react-select";

const ProjectPlanForm = ({
  projectId,
  fiscalYear,
  onClose,
  onPlanCreated,
  existingProjects,
  sourcePlan,
  planType: initialPlanType,
  handleActionSelect,
  plans,
  selectedPlan,
  setShowForm,
  action,
  setIsActionLoading,
  refreshPlans,
  handleRowClick,
  onPlanSelect,
  getAllPlans,
  getButtonAvailability,
  editingDates,
  escalationConfigs,
  setEscalationConfigs,
}) => {
  const [versionCode, setVersionCode] = useState("QTR1");
  const [planType, setPlanType] = useState(initialPlanType || "BUD");
  const [template, setTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [sourceType, setSourceType] = useState(""); // "Actual" or "Existing"
  const [existingProjectId, setExistingProjectId] = useState("");
  const [sourcePeriodRange, setSourcePeriodRange] = useState("");
  const [targetProjectRange, setTargetProjectRange] = useState("");
  const [selectedSourceProjId, setSelectedSourceProjId] = useState("");
  const [selectedVer, setSelectedVer] = useState(0);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (selectedProjectOption) {
      setSourcePeriodRange(selectedProjectOption.startDate || "");
      setTargetProjectRange(selectedProjectOption.endDate || "");
    }
  }, [selectedSourceProjId]);
  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        const response = await axios.get(
          `${backendUrl}/Orgnization/GetAllTemplates`,
        );
        // console.log('GetAllTemplates API response:', response.data);
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format from templates API");
        }
        setTemplates(response.data);
        setTemplate(response.data[0]?.templateCode || "SYSTEM");
      } catch (err) {
        // console.error('Fetch templates error:', err);
        toast.error(
          "Failed to load templates: " +
            (err.response?.data?.message || err.message),
          { toastId: "fetch-templates-error" },
        );
        setTemplates([
          {
            id: 1,
            templateCode: "SYSTEM",
            description: "Default System Template",
          },
        ]);
        setTemplate("SYSTEM");
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const projectOptions = existingProjects
    ? Array.from(
        // new Map(existingProjects.map((p) => [p.projId, p])).values(),
        new Map(
          existingProjects.map((p) => [
            // Create a unique key using both ID and Version
            `${p.projId}-${p.version}-${p.plType}`,
            p,
          ]),
        ).values(),
      ).map((project) => {
        return {
          value: project.projId,
          planId: project.plId,
          startDate: project.projStartDt,
          endDate: project.projEndDt,
          ver: project.version,
          plType: project.plType,
          // label: `${project.projId} - (${project.version} - ${project.plType} - ${project.projName || "No Name"}`,
          label: `${project.projId} | Version: ${project.version} | Type: ${project.plType} | ${project.projName || "No Name"}`,
          key: `${project.projId}-${project.version}-${project.plId}`,
        };
      })
    : [];

  const selectedProjectOption = projectOptions.find(
    (opt) =>
      opt.value === selectedSourceProjId &&
      opt.ver === selectedVer &&
      opt.plType === selectedType,
  );

  const isChildProjectId = (projId) => {
    return projId && typeof projId === "string" && projId.includes(".");
  };

  const createBudget = async (idx) => {
    const plan = selectedPlan;

    if (!plan) {
      toast.error("Please select a valid plan.");
      return;
    }

    if (!sourceType) {
      toast.error("Please select a source type (Actual or Existing Project).");
      return;
    }

    if (sourceType === "Existing" && !selectedProjectOption) {
      toast.error("Please select an existing project.");
      return;
    }

    if (
      sourceType === "Existing" &&
      (!sourcePeriodRange || !targetProjectRange)
    ) {
      toast.error(
        "Please select both Start Date and End Date for the existing project.",
      );
      return;
    }

    const startDate =
      editingDates[plan.plId]?.startDate ||
      selectedPlan.projStartDt ||
      plan.startDate ||
      "";

    const endDate =
      editingDates[plan.plId]?.endDate ||
      selectedPlan.projEndDt ||
      plan.endDate ||
      "";

    if (sourceType === "Actual" && (!startDate || !endDate)) {
      toast.error("Please enter Start Date and End Date.");
      return;
    }

    if (
      (sourceType === "Existing" && sourcePeriodRange > targetProjectRange) ||
      (sourceType === "Actual" && startDate > endDate)
    ) {
      toast.error("End Date cannot be earlier than Start Date.");
      return;
    }

    try {
      setIsActionLoading(true);

      // --- Added validation check ---
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
      // ------------------------------

      const payloadTemplate = {
        plId: selectedProjectOption?.planId || 0,
        projId: selectedPlan?.projId || plan.projId || "",
        plType: "BUD",

        sourceProjId: selectedProjectOption?.value || null,
        sourceProjStartDt:
          sourcePeriodRange || selectedProjectOption?.startDate || null,
        sourceProjEndDt:
          targetProjectRange || selectedProjectOption?.endDate || null,

        source: `${
          plan.plType === "BUD" ? "B" : plan.plType === "EAC" ? "E" : ""
        }${plan.version || 0}`,

        type: plan.type || "A",

        version: plan.version || 0,
        copyFromExistingProject: sourceType === "Existing",

        versionCode: plan.versionCode || "",
        finalVersion: false,
        isCompleted: false,
        isApproved: false,
        status: "In Progress",

        createdBy: plan.createdBy || "User",
        modifiedBy: plan.modifiedBy || "User",
        approvedBy: "",

        templateId: plan.templateId || 1,
        fiscalYear: fiscalYear,

        projStartDt:
          startDate || sourcePeriodRange || selectedProjectOption?.startDate,
        projEndDt:
          endDate || targetProjectRange || selectedProjectOption?.endDate,

        // // Escalation configs passed into payload
        // Escalation values sent when Existing option is used
        ...(sourceType === "Existing" && {
          laborEscallation: Number(escalationConfigs?.escallation_percent) || 0,
          nonLaborEscallation:
            Number(escalationConfigs?.nonlabor_escallation_percent) || 0,
          vendorEscallation:
            Number(escalationConfigs?.vendor_escallation_percent) || 0,
        }),
      };

      toast.info("Creating Budget...");
      setShowForm(false);

      const response = await axios.post(
        `${backendUrl}/Project/AddProjectPlan?type=${
          sourceType === "Existing" ? "actual" : "actual"
        }`,
        payloadTemplate,
      );

      const rawCreatedPlan = response.data;

      if (!rawCreatedPlan?.plId) {
        toast.error("Invalid response from backend.");
        return;
      }

      const effectiveProjIdForRefresh = projectId || rawCreatedPlan.projId;

      const newPlans = await refreshPlans(effectiveProjIdForRefresh);

      if (newPlans?.length > 0) {
        const planToSelect =
          newPlans.find((p) => p.plId === rawCreatedPlan.plId) ||
          rawCreatedPlan;

        handleRowClick(planToSelect);

        if (typeof onPlanSelect === "function") {
          onPlanSelect(planToSelect);
        }

        setTimeout(() => {
          document
            .getElementById(`plan-row-${planToSelect.plId}`)
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        }, 100);
      }

      toast.success("Budget created successfully!");
      getAllPlans();
    } catch (err) {
      const errorMessage =
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.response?.data?.message ||
        err.message;

      toast.error(errorMessage || "Failed to create budget. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div
      className="px-2 py-2 space-y-6 text-[14px] sm:text-xs
      overflow-y-auto max-h-[85vh] 
      text-gray-800 font-sans mx-auto
      animate-premium-popup bg-white rounded-lg"
    >
      <form>
        {/* Step 1: Selection between Actual or Existing */}
        <div className="mb-2 flex justify-between items-center">
          <label className="input-label">Select Source:</label>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs w-[75%]"
            required
          >
            <option value="">-- Select Option --</option>
            <option value="Actual">Actual</option>
            <option value="Existing">Existing Project</option>
          </select>
        </div>

        {/* Step 2: Conditional Dropdown for Existing Project */}
        {sourceType === "Existing" && (
          <div className="mb-4 flex justify-between items-center">
            <label className="input-label">Select Existing Project:</label>
            <Select
              options={projectOptions}
              value={
                selectedSourceProjId
                  ? projectOptions.find(
                      (o) =>
                        o.value === selectedSourceProjId &&
                        o.version === selectedVer &&
                        o.plType === selectedType,
                    )
                  : null
              }
              onChange={(opt) => {
                setSelectedSourceProjId(opt ? opt.value : "");
                setSelectedVer(opt ? opt.ver : 0);
                setSelectedType(opt ? opt.plType : "");
              }}
              placeholder="Select a Project"
              isSearchable
              className="rounded text-xs w-[75%]"
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuPlacement="auto"
              styles={{
                singleValue: (provided) => ({
                  ...provided,
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }),
                option: (provided) => ({
                  ...provided,
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>
        )}

        {/* Step 3: Fields for Source Period and Target Project */}
        {sourceType === "Existing" && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <label className="input-label">Start Date:</label>
              <input
                type="date"
                value={sourcePeriodRange || ""}
                onChange={(e) => setSourcePeriodRange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs w-[75%]"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="input-label">End Date:</label>
              <input
                type="date"
                value={targetProjectRange || ""}
                onChange={(e) => setTargetProjectRange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs w-[75%]"
              />
            </div>
          </div>
        )}

        {/* Step 4: Escalation Config Inputs */}
        {sourceType === "Existing" && (
          <div className="space-y-4 border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <label className="input-label">Labor Escalation %:</label>
              <input
                type="number"
                value={escalationConfigs?.escallation_percent || ""}
                onChange={(e) =>
                  setEscalationConfigs({
                    ...escalationConfigs,
                    escallation_percent: e.target.value,
                  })
                }
                className="border border-gray-300 rounded px-2 py-1 text-xs w-[75%]"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="input-label">Vendor Escalation %:</label>
              <input
                type="number"
                value={escalationConfigs?.vendor_escallation_percent || ""}
                onChange={(e) =>
                  setEscalationConfigs({
                    ...escalationConfigs,
                    vendor_escallation_percent: e.target.value,
                  })
                }
                className="border border-gray-300 rounded px-2 py-1 text-xs w-[75%]"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="input-label">Non-Labor Escalation %:</label>
              <input
                type="number"
                value={escalationConfigs?.nonlabor_escallation_percent || ""}
                onChange={(e) =>
                  setEscalationConfigs({
                    ...escalationConfigs,
                    nonlabor_escallation_percent: e.target.value,
                  })
                }
                className="border border-gray-300 rounded px-2 py-1 text-xs w-[75%]"
              />
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="btn1 btn-blue">
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              createBudget(
                plans.findIndex((p) => p.plId === selectedPlan?.plId),
              );
            }}
            disabled={!sourceType}
            className={`btn1 btn-blue`}
          >
            Create Budget
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectPlanForm;
