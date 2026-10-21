// import React, { useState, useEffect, useMemo } from "react";
// import BurdenCostCeilingDetails from "./BurdenCostCeilingDetails";
// import EmployeeHoursCeilings from "./EmployeeHoursCeilings";
// import DirectCostCeilings from "./DirectCostCeilings";
// import HoursCeilings from "./HoursCeilings";
// import CostFeeOverrideDetails from "./CostFeeOverrideDetails";
// import Select from "react-select";
// import { FcDataConfiguration } from "react-icons/fc";
// import { backendUrl } from "./config";
// import { useOutletContext } from "react-router-dom";
// import { debounce } from "lodash";

// const userName = "yourUserName"; // <-- Replace with actual user logic or prop

// const CeilingConfiguration = () => {
//   // projectInput (free-text) removed — selection should come only from API-provided dropdown
//   const [selectedProjectId, setSelectedProjectId] = useState("");
//   const [activeTab, setActiveTab] = useState("Burden Cost Ceiling Details");
//   const [isSearched, setIsSearched] = useState(false);
//   const [availableProjects, setAvailableProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [term, setTerm] = useState("");
//   const tabs = [
//     "Burden Cost Ceiling Details",
//     "Employee Hours Ceilings",
//     "Direct Cost Ceilings",
//     "Hours Ceilings",
//     // "Cost Fee Override Details",
//   ];

//   const { visibility, canView, canEdit } = useOutletContext();
//   const isEditable = canEdit("ceilingConfiguration");

//   // const projectOptions = availableProjects.map((project) => ({
//   //   value: project.projectId,
//   //   label: project.name
//   //     ? `${project.projectId} - ${project.name}`
//   //     : project.projectId,
//   // }));

//   const getCurrentUserContext = () => {
//     try {
//       const userString = localStorage.getItem("currentUser");
//       if (!userString) return { userId: "", role: "" };
//       const userObj = JSON.parse(userString);
//       return {
//         userId: userObj.userId ?? "",
//         role: userObj.role?.toLowerCase() ?? "",
//         fullName: userObj.fullName?.toLowerCase() ?? "",
//         // roleName: user
//       };
//     } catch {
//       return { userId: "", role: "", fullName: "" };
//     }
//   };

//   const { userId, role, fullName } = getCurrentUserContext();

//   const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500

//   const fetchAllProjects = async (searchTerm) => {
//     if (!searchTerm || searchTerm.length < 4) {
//       setAvailableProjects([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const apiUrl = `${backendUrl}/Project/GetAllProjectsForSearchV3?UserId=${userId}&Role=${role}&type=PROJECT&ProjId=${encodeURIComponent(
//         searchTerm
//       )}&take=${lookupTake}`;

//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const projects = await response.json();
//       setAvailableProjects(Array.isArray(projects) ? projects : []);
//     } catch (e) {
//       setError("Failed to load project list. Please check your API connection.");
//       setAvailableProjects([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Stable Debounced Search Hook (Doesn't recreate on every keystroke)
//   const debouncedFetchProjects = useMemo(
//     () => debounce((query) => fetchAllProjects(query), 500),
//     [backendUrl, userId, role, lookupTake] // Excluded 'term' from dependencies
//   );

//   // Clean up debounce timer on unmount
//   useEffect(() => {
//     return () => debouncedFetchProjects.cancel();
//   }, [debouncedFetchProjects]);

//   // 3. Trigger Search when 'term' changes
//   useEffect(() => {
//     if (term.trim().length >= 4) {
//       setLoading(true);
//       debouncedFetchProjects(term.trim());
//     } else {
//       debouncedFetchProjects.cancel();
//       setAvailableProjects([]);
//       setLoading(false);
//     }
//   }, [term, debouncedFetchProjects]);

//   // 4. Transform & Sort Project Options Safely
//   const projectOptions = useMemo(() => {
//     return availableProjects
//       .map((project) => ({
//         value: project?.projectId ?? "",
//         label: project?.name
//           ? `${project.projectId} - ${project.name}`
//           : String(project?.projectId ?? ""),
//       }))
//       .sort((a, b) =>
//         (a.label ?? "").localeCompare(b.label ?? "", undefined, {
//           numeric: true,
//           sensitivity: "base",
//         })
//       );
//   }, [availableProjects]);

//   useEffect(() => {
//     // mark searched when a user chooses a project from dropdown
//     setIsSearched(!!selectedProjectId);
//   }, [selectedProjectId]);

//   // search is handled by selecting a project from the dropdown — no free-text search

//   const handleTabClick = (tab) => {
//     if (activeTab === tab) {
//       // toggling the same tab off should clear selection so we don't keep a stale project
//       setActiveTab("");
//       setIsSearched(false);
//       setSelectedProjectId("");
//     } else {
//       setActiveTab(tab);
//     }
//   };

//   return (
//     <div className="min-h-screen text-gray-900 flex flex-col gap-y-2 ml-2 ">
//       <div className="p-4 border-b w-full rounded-sm border-gray-100 flex justify-between bg-white">
//         <h2 className="text-lg  font-bold text-gray-800 flex items-center gap-2">
//           <FcDataConfiguration size={20} className="text-blue-500" />
//           Ceiling Configuration
//         </h2>
//       </div>
//       <div className="w-full mx-auto bg-white  p-4 rounded space-y-4 ">
//         {/* <h1 className="w-full  bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg shadow-sm mb-4 blue-text">
//         Ceiling Configuration
//       </h1> */}

//         {/* project selector (API-sourced) — free-text entry removed on purpose */}
//         <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
//   {/* Label */}
//   <label htmlFor="projectId" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
//     Project ID <span className="text-red-500">*</span>
//   </label>

//   {/* Relative wrapper ensures the dropdown positions directly under the input */}
//   <div className="relative w-full">
//     <input
//       id="projectId"
//       type="text"
//       className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//       placeholder="Search Project ID or Name..."
//       value={term}
//       onChange={(e) => {
//         setTerm(e.target.value);
//         setShowSuggestions(true);
//       }}
//       onFocus={() => setShowSuggestions(true)}
//       autoComplete="off"
//     />

//     {/* Dropdown Suggestions */}
//     {showSuggestions && projectOptions.length > 0 && (
//       <ul className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5">
//         {projectOptions.map((proj, index) => (
//           <li
//             key={proj.value || index}
//             className="flex flex-col px-3 py-2 text-xs cursor-pointer border-b border-gray-100 last:border-none transition hover:bg-blue-50 active:bg-blue-100"
//             onMouseDown={(e) => {
//               e.preventDefault(); // Prevents input blur before selection
//               setSelectedProjectId(proj.value);
//               setTerm(proj.value); // Populates field with selected ID
//               setShowSuggestions(false); // Closes menu
//             }}
//           >
//             <span className="font-semibold text-blue-900">{proj.value}</span>
//             <span className="text-gray-500 truncate">{proj.label}</span>
//           </li>
//         ))}
//       </ul>
//     )}
//   </div>
// </div>

//           {/* <Select
//             inputId="projectId"
//             className="w-[50%] cursor-pointer"
//             options={projectOptions}
//             isLoading={loading}
//             value={
//               selectedProjectId
//                 ? projectOptions.find((opt) => opt.value === selectedProjectId)
//                 : null
//             }
//             onChange={(opt) => setSelectedProjectId(opt ? opt.value : "")}
//             isSearchable
//             placeholder="Search & select a project"
//             menuPlacement="auto"
//           /> */}

//         <div className=" mb-4">
//           <nav className="flex flex-wrap gap-2 sm:gap-3" aria-label="Tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => handleTabClick(tab)}
//                 className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors${
//                   activeTab === tab
//                     ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
//                     : "text-gray-600 hover:text-gray-800 bg-gray-100"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="min-h-[400px]">
//           {activeTab === "Burden Cost Ceiling Details" && (
//             <BurdenCostCeilingDetails
//               projectId={selectedProjectId}
//               isSearched={isSearched}
//               updatedBy={userName}
//               isEditable={isEditable}
//             />
//           )}
//           {activeTab === "Employee Hours Ceilings" && (
//             <EmployeeHoursCeilings
//               projectId={selectedProjectId}
//               isSearched={isSearched}
//               isEditable={isEditable}
//             />
//           )}
//           {activeTab === "Direct Cost Ceilings" && (
//             <DirectCostCeilings
//               projectId={selectedProjectId}
//               isSearched={isSearched}
//               updatedBy={userName}
//               isEditable={isEditable}
//             />
//           )}
//           {activeTab === "Hours Ceilings" && (
//             <HoursCeilings
//               projectId={selectedProjectId}
//               isSearched={isSearched}
//               updatedBy={userName}
//               isEditable={isEditable}
//             />
//           )}
//           {activeTab === "Cost Fee Override Details" && (
//             <CostFeeOverrideDetails
//               projectId={selectedProjectId}
//               isSearched={isSearched}
//               updatedBy={userName}
//               isEditable={isEditable}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CeilingConfiguration;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import BurdenCostCeilingDetails from "./BurdenCostCeilingDetails";
import EmployeeHoursCeilings from "./EmployeeHoursCeilings";
import DirectCostCeilings from "./DirectCostCeilings";
import HoursCeilings from "./HoursCeilings";
import CostFeeOverrideDetails from "./CostFeeOverrideDetails";
import { FcDataConfiguration } from "react-icons/fc";
import { Search, X } from "lucide-react";
import { backendUrl } from "./config";
import { useOutletContext } from "react-router-dom";
import { debounce } from "lodash";

const userName = "yourUserName";

const CeilingConfiguration = () => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject, setSelectedProject] = useState({});
  const [activeTab, setActiveTab] = useState("Burden Cost Ceiling Details");

  const [isSearched, setIsSearched] = useState(false);

  const [availableProjects, setAvailableProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [term, setTerm] = useState("");

  const tabs = [
    "Burden Cost Ceiling Details",
    "Employee Hours Ceilings",
    "Direct Cost Ceilings",
    "Hours Ceilings",
    // "Cost Fee Override Details",
  ];

  const { canEdit } = useOutletContext();

  const isEditable = canEdit("ceilingConfiguration");

  // ---------------------------------------------------------
  // Current User Context
  // ---------------------------------------------------------

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
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiUrl =
          `${backendUrl}/Project/GetAllProjectsForSearchV3` +
          `?UserId=${userId}` +
          `&Role=${role}` +
          `&type=PROJECT` +
          `&ProjId=${encodeURIComponent(searchTerm)}` +
          `&take=${lookupTake}`;
        const nbbudApiUrl =
          `${backendUrl}/Project/GetAllProjectsForSearchV3` +
          `?UserId=${userId}` +
          `&Role=${role}` +
          `&type=NBBUD` +
          `&ProjId=${encodeURIComponent(searchTerm)}` +
          `&take=${lookupTake}`;

        const planResponse = await fetch(apiUrl);
        const nbbudResponse = await fetch(nbbudApiUrl);

        if (!planResponse.ok || !nbbudResponse.ok) {
          throw new Error(`HTTP error! status: ${planResponse.status}`);
        }

        const plan = await planResponse.json();
        const nbbud = await nbbudResponse.json();

        const projects = [...plan, ...nbbud];

        setAvailableProjects(Array.isArray(projects) ? projects : []);
      } catch (e) {
        console.error("Failed to load projects:", e);

        setError("Failed to load project list. Please try again.");

        setAvailableProjects([]);
      } finally {
        setLoading(false);
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
      setLoading(true);
      debouncedFetchProjects(searchTerm);
    } else {
      debouncedFetchProjects.cancel();

      setAvailableProjects([]);
      setLoading(false);
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
        type: project?.type ?? "",
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

  // ---------------------------------------------------------
  // Project Selection
  // ---------------------------------------------------------

  useEffect(() => {
    setIsSearched(!!selectedProjectId);
  }, [selectedProjectId]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSelectedProjectId(project.value);
    setTerm(project.value);
    setShowSuggestions(false);
    setAvailableProjects([]);
    setError(null);
  };

  const handleClearProject = () => {
    debouncedFetchProjects.cancel();

    setSelectedProjectId("");
    setSelectedProject({});
    setTerm("");
    setAvailableProjects([]);
    setShowSuggestions(false);
    setIsSearched(false);
    setError(null);
  };

  // ---------------------------------------------------------
  // Tab Handling
  // ---------------------------------------------------------

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen text-gray-900 flex flex-col gap-y-2 ml-2">
      {/* ===================================================== */}
      {/* Header */}
      {/* ===================================================== */}

      <div className="p-4 w-full flex items-center rounded-sm bg-white">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FcDataConfiguration size={20} />
          Ceiling Configuration
        </h2>
      </div>

      {/* ===================================================== */}
      {/* Main Card */}
      {/* ===================================================== */}

      <div className="w-full bg-white rounded-sm">
        {/* ================================================= */}
        {/* Project Search */}
        {/* ================================================= */}

        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 ">
            {/* Project ID */}

            <div className=" flex items-center gap-2 w-full sm:w-[420px] ">
              <label htmlFor="projectId" className="input-label mb-1 block">
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
                    setSelectedProject({});
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

                {term && !loading && (
                  <button
                    type="button"
                    onClick={handleClearProject}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                    title="Clear"
                  >
                    <X size={15} />
                  </button>
                )}

                {/* Loading */}

                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                  </div>
                )}

                {/* Suggestions */}

                {showSuggestions &&
                  term.trim().length >= 4 &&
                  !loading &&
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
                              {project.label.replace(`${project.value} - `, "")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                {/* No Results */}

                {showSuggestions &&
                  term.trim().length >= 4 &&
                  !loading &&
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

            {/* Selected Project */}

            {/* {selectedProjectId && (

          <div className="flex items-center gap-2 pb-1">

            <span className="text-[11px] text-gray-500">
              Selected Project:
            </span>

            <span className="rounded bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {selectedProjectId}
            </span>

          </div>

        )} */}
          </div>
        </div>

        {/* ================================================= */}
        {/* Tabs */}
        {/* ================================================= */}

        <div className="px-4 pt-3 pb-2">
          <nav
            className="flex flex-wrap gap-2"
            aria-label="Ceiling Configuration Tabs"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`
                rounded-lg
                px-3
                py-2
                text-xs
                font-semibold
                cursor-pointer
                transition-colors
                disabled:opacity-40
                ${
                  isActive
                    ? "bg-[#17414d] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }
              `}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================================================= */}
        {/* Empty State */}
        {/* ================================================= */}

        {/* {!selectedProjectId && (

      <div className="mx-4 mb-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-4">

        <div className="text-center">

          <p className="text-xs font-medium text-gray-600">
            Select a project to view ceiling configuration.
          </p>

          <p className="mt-1 text-[11px] text-gray-400">
            Search for a Project ID or Project Name above.
          </p>

        </div>

      </div>

    )} */}

        {/* ================================================= */}
        {/* Child Components */}
        {/* ================================================= */}

        <div className="px-4 pb-4 min-h-[400px]">
          {activeTab === "Burden Cost Ceiling Details" && (
            <BurdenCostCeilingDetails
              projectId={selectedProjectId}
              project={selectedProject}
              isSearched={isSearched}
              updatedBy={userName}
              isEditable={isEditable}
            />
          )}

          {activeTab === "Employee Hours Ceilings" && (
            <EmployeeHoursCeilings
              projectId={selectedProjectId}
              project={selectedProject}
              isSearched={isSearched}
              isEditable={isEditable}
            />
          )}

          {activeTab === "Direct Cost Ceilings" && (
            <DirectCostCeilings
              projectId={selectedProjectId}
              isSearched={isSearched}
              projectDirect={selectedProject}
              updatedBy={userName}
              isEditable={isEditable}
            />
          )}

          {activeTab === "Hours Ceilings" && (
            <HoursCeilings
              projectId={selectedProjectId}
              project={selectedProject}
              isSearched={isSearched}
              updatedBy={userName}
              isEditable={isEditable}
            />
          )}

          {activeTab === "Cost Fee Override Details" && (
            <CostFeeOverrideDetails
              projectId={selectedProjectId}
              project={selectedProject}
              isSearched={isSearched}
              updatedBy={userName}
              isEditable={isEditable}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CeilingConfiguration;
