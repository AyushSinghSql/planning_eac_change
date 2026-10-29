// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import {
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   Plus,
//   Minus,
//   BarChart2,
//   Layers,
//   LayoutDashboard,
//   Target,
//   Gauge,
//   ShieldCheck,
//   Pin,
//   PinOff,
//   Handshake,
//   Briefcase,
//   FileCheck2,
// } from "lucide-react";

// const NavigationSidebar = ({
//   setIsHovered,
//   isHovered,
//   setIsSidebarOpen,
//   isSidebarOpen,
//   visibility,
//   canView,
//   canEdit,
//   toggleLock,
//   isLocked,
// }) => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");

//   const [generalMenuOpen, setGeneralMenuOpen] = useState(
//     pathname.includes("/dashboard"),
//   );

//   // Top-Level Section States
//   const [reportingOpen, setReportingOpen] = useState(
//     pathname.includes("/dashboard/project-report") ||
//       pathname.includes("/dashboard/project-variance") ||
//       pathname.includes("/dashboard/project-performance") ||
//       pathname.includes("/dashboard/gl-budgeting") ||
//       pathname.includes("/dashboard/project-analysis-dash") ||
//       pathname.includes("/dashboard/labor-utilization-summary") ||
//       pathname.includes("/dashboard/reporting-screen"),
//   );
//   const [prToPoTrackerOpen, setPrToPoTrackerOpen] = useState(
//     pathname.includes("/dashboard/pr-to-po-tracker"),
//   );

//   const [planningOpen, setPlanningOpen] = useState(
//     pathname.includes("/dashboard/project-budget-status") ||
//       pathname.includes("/dashboard/mass-utility") ||
//       pathname.includes("/dashboard/quick-budget"),
//   );

//   const [oppSectionOpen, setOppSectionOpen] = useState(
//     pathname.includes("/dashboard/import-opportunity") ||
//       pathname.includes("/dashboard/opp-project") ||
//       pathname.includes("/dashboard/parametric-rate") ||
//       pathname.includes("/dashboard/analog-rate") ||
//       pathname.includes("/dashboard/pricing-new-business") ||
//       pathname.includes("/dashboard/pricing-nb-project") ||
//       pathname.includes("/dashboard/pricing-rate-configure") ||
//       pathname.includes("/dashboard/pricing-dfars") ||
//       pathname.includes("/dashboard/pricing-mass-utility") ||
//       pathname.includes("/dashboard/pricing"),
//   );

//   const [pbrSectionOpen, setPbrSectionOpen] = useState(
//     pathname.includes("/dashboard/pbr-report") ||
//       pathname.includes("/dashboard/ice-tabs") ||
//       pathname.includes("/dashboard/pool-rate-tabs") ||
//       pathname.includes("/dashboard/rate-configure"),
//   );

//   const [subContractorSectionOpen, setSubContractorSectionOpen] = useState(
//     pathname.includes("/dashboard/sub-create-timesheet") ||
//       pathname.includes("/dashboard/sub-report") ||
//       pathname.includes("/dashboard/sub-dashboards") ||
//       pathname.includes("/dashboard/sub-settings") ||
//       pathname.includes("/dashboard/sub-enquiry-approval") ||
//       pathname.includes("/dashboard/sub-work-assign") ||
//       pathname.includes("/dashboard/sub-invoice-export") ||
//       pathname.includes("/dashboard/sub-export-table") ||
//       pathname.includes("/dashboard/sub-employeeplc-mapping") ||
//       pathname.includes("/dashboard/sub-workflow-mapping") ||
//       pathname.includes("/dashboard/sub-po-info") ||
//       pathname.includes("/dashboard/sub-pstaus"),
//   );

//   const [configurationOpen, setConfigurationOpen] = useState(
//     pathname.includes("/dashboard/global-configuration") ||
//       pathname.includes("/dashboard/projectmapping") ||
//       pathname.includes("/dashboard/account-mapping") ||
//       pathname.includes("/dashboard/ceiling-configuration") ||
//       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//       pathname.includes("/dashboard/annual-holidays") ||
//       pathname.includes("/dashboard/prospective-id-setup"),
//   );

//   const [adminSetingOpen, setAdminSetingOpen] = useState(
//     pathname.includes("/dashboard/manage-groups") ||
//       pathname.includes("/dashboard/manage-users") ||
//       pathname.includes("/dashboard/manage-roles"),
//   );

//   const [corporateBudgetOpen, setCorporateBudgetOpen] = useState(false);

//   const [selectedPage, setSelectedPage] = useState(pathname);
//   const [currentUserRole, setCurrentUserRole] = useState(null);
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     const userString = localStorage.getItem("currentUser");
//     if (userString) {
//       try {
//         const userObj = JSON.parse(userString);
//         setUserName(userObj.name);
//         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
//       } catch {
//         setCurrentUserRole(null);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     setSelectedPage(pathname);
//   }, [pathname]);

//   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
//   const isExpanded = isLocked || isSidebarOpen || isHovered;

//   const handleLinkClick = (pagePath) => {
//     setSelectedPage(pagePath);
//     navigate(pagePath);
//     if (isSidebarOpen) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const showSubScreen =
//     currentUserRole !== "user" && currentUserRole !== "subk_user";

//   return (
//     <div className="flex min-h-screen font-inter">
//       {/* Mobile Toggle */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
//         onClick={() => setIsSidebarOpen(!isExpanded)}
//       >
//         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>

//       {/* Sidebar */}
//       <div
//         onMouseEnter={() => {
//           if (!isLocked) setIsHovered(true);
//         }}
//         onMouseLeave={() => {
//           if (!isLocked) setIsHovered(false);
//         }}
//         className={`fixed inset-y-0 left-0 z-40 flex flex-col
//           bg-white border-r border-gray-200
//           transition-all duration-300 ease-in-out shadow-sm
//           ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
//           md:translate-x-0
//         `}
//       >
//         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 scrollbar-thin">
//           <div
//             className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
//             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
//           >
//             <div className="w-8 flex justify-center">
//               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
//             </div>
//             <span
//               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${
//                 isExpanded ? "opacity-100" : "opacity-0"
//               }`}
//             >
//               Menu
//             </span>
//           </div>

//           {generalMenuOpen && (
//             <div className="space-y-1 mt-2">
//               {/* Search Bar & Lock */}
//               <div
//                 className={`px-3 pt-4 pb-2 ${
//                   isExpanded ? "flex items-center gap-2" : "hidden"
//                 }`}
//               >
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//                   className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full bg-white shadow-inner"
//                 />
//                 <button
//                   type="button"
//                   onClick={toggleLock}
//                   className="p-1 text-gray-500 hover:text-[#17414d] rounded-md transition-colors flex-shrink-0"
//                   title={
//                     isLocked ? "Unlock Navigation" : "Lock Navigation Expanded"
//                   }
//                 >
//                   {isLocked ? (
//                     <Pin className="w-4 h-4 fill-[#17414d] text-[#17414d]" />
//                   ) : (
//                     <PinOff className="w-4 h-4 text-gray-400" />
//                   )}
//                 </button>
//               </div>

//               {/* LEVEL 1: Dashboard Section */}
//               {(canView("activeReport") ||
//                 canView("executivedashboard") ||
//                 canView("versionanalysis") ||
//                 canView("cfoReports") ||
//                 canView("laborUtilization") ||
//                 canView("totalCompany") ||
//                 canView("top10Bottom10Projects") ||
//                 canView("currentMonthActualsVsForecast")) && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setReportingOpen(!reportingOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <LayoutDashboard className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Dashboard & Reporting
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (reportingOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {/* LEVEL 2: Under Dashboard */}
//                   {(reportingOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                       {canView("executivedashboard") && (
//                         <NavItem
//                           label="Executive Dashboard"
//                           path="/dashboard/project-report"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {canView("activeReport") && (
//                         <NavItem
//                           label="Active Reports"
//                           path="/dashboard/reporting-screen"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {canView("versionanalysis") && (
//                         <NavItem
//                           label="Version Analysis"
//                           path="/dashboard/project-variance"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {/* LEVEL 2 Sub-Group (3rd Level Trigger) */}
//                       {(canView("cfoReports") ||
//                         canView("laborUtilization") ||
//                         canView("totalCompany") ||
//                         canView("top10Bottom10Projects") ||
//                         canView("currentMonthActualsVsForecast")) && (
//                         <NavSubGroup
//                           label="BI Reports"
//                           searchTerm={searchTerm}
//                           defaultOpen={
//                             pathname.includes("/dashboard/cfo-bi-reports") ||
//                             pathname.includes(
//                               "/dashboard/cfo-bi-reports-labor",
//                             ) ||
//                             pathname.includes(
//                               "/dashboard/top10-bottom10-bi-reports",
//                             ) ||
//                             pathname.includes(
//                               "/dashboard/total-company-bi-reports",
//                             ) ||
//                             pathname.includes(
//                               "/dashboard/current-month-actuals-vs-forecast",
//                             )
//                           }
//                         >
//                           {canView("cfoReports") && (
//                             <NavItem
//                               label="CFO Reports"
//                               path="/dashboard/cfo-bi-reports"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("laborUtilization") && (
//                             <NavItem
//                               label="Labor Utilization"
//                               path="/dashboard/cfo-bi-reports-labor"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("totalCompany") && (
//                             <NavItem
//                               label="Total Company"
//                               path="/dashboard/total-company-bi-reports"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("top10Bottom10Projects") && (
//                             <NavItem
//                               label="Top 10 and Bottom 10 Projects"
//                               path="/dashboard/top10-bottom10-bi-reports"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("currentMonthActualsVsForecast") && (
//                             <NavItem
//                               label="Current month Actuals Vs Forecast"
//                               path="/dashboard/current-month-actuals-vs-forecast"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         </NavSubGroup>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {canView("dashboard") && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setPrToPoTrackerOpen(!prToPoTrackerOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <FileCheck2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Procure-to-Pay
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (prToPoTrackerOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(prToPoTrackerOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                       <NavItem
//                         label="Dashboard"
//                         path="/dashboard/pr-to-po-tracker"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* LEVEL 1: Projects Section */}
//               {!searchTerm && (
//                 <div
//                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                   onClick={() => setPlanningOpen(!planningOpen)}
//                 >
//                   <div className="flex items-center">
//                     <div className="w-8 flex justify-center">
//                       <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                     </div>
//                     <span
//                       className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                         isExpanded ? "opacity-100" : "opacity-0"
//                       }`}
//                     >
//                       Program Controls & Analytics
//                     </span>
//                   </div>
//                   {isExpanded &&
//                     (planningOpen ? (
//                       <ChevronDown size={14} />
//                     ) : (
//                       <ChevronRight size={14} />
//                     ))}
//                 </div>
//               )}

//               {(planningOpen || searchTerm) && isExpanded && (
//                 <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                   {canView("projectfinancialdashboards") && (
//                     <NavSubGroup
//                       label="Project Financial Dashboards"
//                       searchTerm={searchTerm}
//                       defaultOpen={
//                         pathname.includes("/dashboard/project-performance") ||
//                         pathname.includes(
//                           "/dashboard/labor-utilization-summary",
//                         )
//                       }
//                     >
//                       <NavItem
//                         label="Project Performance"
//                         path="/dashboard/project-performance"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                       <NavItem
//                         label="Project Console"
//                         path="/dashboard/project-analysis-dash"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                       <NavItem
//                         label="Labor Utilization"
//                         path="/dashboard/labor-utilization-summary"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     </NavSubGroup>
//                   )}

//                   {canView("planProjectAndEac") && (
//                     <NavSubGroup
//                       label="Plan Project and EAC"
//                       searchTerm={searchTerm}
//                       defaultOpen={
//                         pathname.includes("/dashboard/project-budget-status") ||
//                         pathname.includes("/dashboard/mass-utility") ||
//                         pathname.includes("/dashboard/quick-budget")
//                       }
//                     >
//                       <NavItem
//                         label="Plan Projects"
//                         path="/dashboard/project-budget-status"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                       {canView("quickBudget") && (
//                         <NavItem
//                           label="Quick Budget"
//                           path="/dashboard/quick-budget"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("massUtility") && (
//                         <NavItem
//                           label="Mass Utility"
//                           path="/dashboard/mass-utility"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </NavSubGroup>
//                   )}
//                   {(canView("manageNewBusiness") ||
//                     canView("transferUtility") ||
//                     canView("planNewBusiness")) && (
//                     <NavSubGroup
//                       label="Plan New Business"
//                       searchTerm={searchTerm}
//                       defaultOpen={
//                         pathname.includes("/dashboard/new-business") ||
//                         pathname.includes("/dashboard/create-project-budget") ||
//                         pathname.includes("/dashboard/nb-project")
//                       }
//                     >
//                       {canView("manageNewBusiness") && (
//                         <NavItem
//                           label="Manage New Business"
//                           path="/dashboard/new-business"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("planNewBusiness") && (
//                         <NavItem
//                           label="Plan New Businesses"
//                           path="/dashboard/nb-project"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("transferUtility") && (
//                         <NavItem
//                           label="Transfer Project Budget"
//                           path="/dashboard/create-project-budget"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </NavSubGroup>
//                   )}
//                 </div>
//               )}

//               {/* LEVEL 1: Opportunities & Pricing Section */}
//               {(canView("planOpportunity") ||
//                 canView("impOpportunity") ||
//                 canView("captureOpportunityandPlanPipeline") ||
//                 canView("costProposalandPricing")) && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setOppSectionOpen(!oppSectionOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <Target className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Opportunity & Pricing
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (oppSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(oppSectionOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                       {canView("captureOpportunityandPlanPipeline") && (
//                         <NavSubGroup
//                           label="Capture Opportunity & Plan Pipeline"
//                           searchTerm={searchTerm}
//                           defaultOpen={
//                             pathname.includes(
//                               "/dashboard/import-opportunity",
//                             ) ||
//                             pathname.includes("/dashboard/opp-project") ||
//                             pathname.includes("/dashboard/analog-rate") ||
//                             pathname.includes("/dashboard/parametric-rate")
//                           }
//                         >
//                           {canView("impOpportunity") && (
//                             <NavItem
//                               label="Import Opportunities"
//                               path="/dashboard/import-opportunity"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("planOpportunity") && (
//                             <NavItem
//                               label="Plan Opportunities"
//                               path="/dashboard/opp-project"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("analogRate") && (
//                             <NavItem
//                               label="Analogous Rate"
//                               path="/dashboard/analog-rate"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("parametricRate") && (
//                             <NavItem
//                               label="Parametric Rate"
//                               path="/dashboard/parametric-rate"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         </NavSubGroup>
//                       )}
//                       {canView("costProposalandPricing") && (
//                         <NavSubGroup
//                           label="Cost Proposal and Pricing"
//                           searchTerm={searchTerm}
//                           defaultOpen={
//                             pathname.includes(
//                               "/dashboard/pricing-new-business",
//                             ) ||
//                             pathname.includes(
//                               "/dashboard/pricing-nb-project",
//                             ) ||
//                             pathname.includes(
//                               "/dashboard/pricing-mass-utility",
//                             ) ||
//                             pathname.includes(
//                               "/dashboard/pricing-rate-configure",
//                             ) ||
//                             pathname.includes("/dashboard/pricing")
//                           }
//                         >
//                           {canView("manageNewBusiness") && (
//                             <NavItem
//                               label="Contract Setup"
//                               path="/dashboard/pricing-new-business"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("planNewBusiness") && (
//                             <NavItem
//                               label="Proposal Builder"
//                               path="/dashboard/pricing-nb-project"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           <NavItem
//                             label="Pricing Studio"
//                             path="/dashboard/pricing"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                           {canView("massUtility") && (
//                             <NavItem
//                               label="Mass Utility"
//                               path="/dashboard/pricing-mass-utility"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("poolRateTabs") && (
//                             <NavItem
//                               label="Rate Configuration"
//                               path="/dashboard/pricing-rate-configure"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         </NavSubGroup>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {canView("corporate budget") && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() =>
//                         setCorporateBudgetOpen(!corporateBudgetOpen)
//                       }
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Corporate Budget
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (corporateBudgetOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(corporateBudgetOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                       <NavItem
//                         label="By Account"
//                         path="/dashboard/gl-budgeting"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                       <NavItem
//                         label="By Division/Department/Organization"
//                         path="/dashboard/corporate-budget-department"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* LEVEL 1: Compliance (DCAA) */}
//               {canView("govcon compliances") && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setPbrSectionOpen(!pbrSectionOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <Gauge className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           GovCon Compliances
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (pbrSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(pbrSectionOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                       <NavItem
//                         label="Provisional Billing Rates (PBR)"
//                         path="/dashboard/pbr-report"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                       <NavItem
//                         label="Incurred Cost Model (ICE)"
//                         path="/dashboard/ice-tabs"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                       <NavSubGroup
//                         label="Forward Pricing Rates (FPRP)"
//                         searchTerm={searchTerm}
//                         defaultOpen={
//                           pathname.includes("/dashboard/pool-rate-tabs") ||
//                           pathname.includes("/dashboard/rate-configure")
//                         }
//                       >
//                         {canView("poolRateTabs") && (
//                           <NavItem
//                             label="Rate Configuration"
//                             path="/dashboard/pool-rate-tabs"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("rateComputation") && (
//                           <NavItem
//                             label="Rate Computation"
//                             path="/dashboard/rate-configure"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                       </NavSubGroup>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Time and Subcontractor Management */}
//               <div>
//                 {!searchTerm && (
//                   <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                     onClick={() =>
//                       setSubContractorSectionOpen(!subContractorSectionOpen)
//                     }
//                   >
//                     <div className="flex items-center">
//                       <div className="w-8 flex justify-center">
//                         <Handshake className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                       </div>
//                       <span
//                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                           isExpanded ? "opacity-100" : "opacity-0"
//                         }`}
//                       >
//                         Time and Subcontractor Management
//                       </span>
//                     </div>
//                     {isExpanded &&
//                       (subContractorSectionOpen ? (
//                         <ChevronDown size={14} />
//                       ) : (
//                         <ChevronRight size={14} />
//                       ))}
//                   </div>
//                 )}

//                 {(subContractorSectionOpen || searchTerm) && isExpanded && (
//                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                     {canView("dashboard") && (
//                       <NavItem
//                         label="Dashboard"
//                         path="/dashboard/sub-dashboards"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     <NavItem
//                       label="Create Timesheet"
//                       path="/dashboard/sub-create-timesheet"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                       searchTerm={searchTerm}
//                     />
//                     {showSubScreen && (
//                       <NavItem
//                         label="Enquiry & Approval"
//                         path="/dashboard/sub-enquiry-approval"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Generate Invoice"
//                         path="/dashboard/sub-export-table"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Invoice Export"
//                         path="/dashboard/sub-invoice-export"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="PO Info"
//                         path="/dashboard/sub-po-info"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="PO Status"
//                         path="/dashboard/sub-pstaus"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Work Order"
//                         path="/dashboard/sub-work-assign"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Report"
//                         path="/dashboard/sub-report"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Manage Project"
//                         path="/dashboard/sub-project-master"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Manage Employee"
//                         path="/dashboard/sub-employee-master"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Groups Management"
//                         path="/dashboard/group-management"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="User Workflow Mapping"
//                         path="/dashboard/sub-workflow-mapping"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Employee Project Mapping"
//                         path="/dashboard/sub-project-user-mapping"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {showSubScreen && (
//                       <NavItem
//                         label="Settings"
//                         path="/dashboard/sub-settings"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* LEVEL 1: Settings */}
//               {canView("settings") &&
//                 (canView("globalConfiguration") ||
//                   canView("projectOrgSecurity") ||
//                   canView("accountMapping") ||
//                   canView("ceilingConfiguration") ||
//                   canView("fiscalYearPeriods") ||
//                   canView("annualHolidays") ||
//                   canView("prospectiveIdSetup")) && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() => setConfigurationOpen(!configurationOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <Layers className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                               isExpanded ? "opacity-100" : "opacity-0"
//                             }`}
//                           >
//                             Settings
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (configurationOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}

//                     {(configurationOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                         {canView("globalConfiguration") && (
//                           <NavItem
//                             label="Configuration Settings"
//                             path="/dashboard/global-configuration"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("projectOrgSecurity") && (
//                           <NavItem
//                             label="Access Mapping"
//                             path="/dashboard/projectmapping"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("accountMapping") && (
//                           <NavItem
//                             label="Account Mapping"
//                             path="/dashboard/account-mapping"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("ceilingConfiguration") && (
//                           <NavItem
//                             label="Ceiling Configuration"
//                             path="/dashboard/ceiling-configuration"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("fiscalYearPeriods") && (
//                           <NavItem
//                             label="Fiscal Year Periods"
//                             path="/dashboard/maintain-fiscal-year-periods"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("annualHolidays") && (
//                           <NavItem
//                             label="Annual Holidays"
//                             path="/dashboard/annual-holidays"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("prospectiveIdSetup") && (
//                           <NavItem
//                             label="Prospective ID Setup"
//                             path="/dashboard/prospective-id-setup"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//               {/* LEVEL 1: Admin */}
//               {canView("admin") &&
//                 (canView("manageGroups") ||
//                   canView("manageUser") ||
//                   canView("roleRights")) && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() => setAdminSetingOpen(!adminSetingOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <ShieldCheck className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                               isExpanded ? "opacity-100" : "opacity-0"
//                             }`}
//                           >
//                             Admin
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (adminSetingOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}

//                     {(adminSetingOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                         {canView("manageGroups") && (
//                           <NavItem
//                             label="Manage Groups"
//                             path="/dashboard/manage-groups"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("manageUser") && (
//                           <NavItem
//                             label="Manage Users"
//                             path="/dashboard/manage-users"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("manageUser") && (
//                           <NavItem
//                             label="Manage Roles"
//                             path="/dashboard/manage-roles"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Manage Devices"
//                             path="/dashboard/authorize-device"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//             </div>
//           )}
//         </div>

//         {/* AI Assistant Button */}
//         <div className="px-3 mb-2">
//           <div className="px-1.5 py-1">
//             <Link
//               to="/dashboard/our-ai"
//               onClick={() => handleLinkClick("/dashboard/our-ai")}
//               className={`flex items-center rounded-md transition-all duration-200 ${
//                 !isExpanded
//                   ? "justify-center w-8 h-8 mx-auto"
//                   : "px-3 py-2 text-xs w-full gap-2.5"
//               } ${
//                 selectedPage === "/dashboard/our-ai"
//                   ? "text-white font-semibold"
//                   : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
//               }`}
//               style={{
//                 backgroundColor:
//                   selectedPage === "/dashboard/our-ai" ? "#17414d" : "",
//               }}
//               title={!isExpanded ? "R-AI" : ""}
//             >
//               <svg
//                 className={`${!isExpanded ? "w-5 h-5" : "w-4 h-4"} shrink-0`}
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2.5}
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M9.813 15.904L9 21L14.907 15.904L21 18L18 3L3 12L9.813 15.904Z" />
//               </svg>
//               {isExpanded && <span className="truncate">R-AI</span>}
//             </Link>
//           </div>
//         </div>

//         {/* Footer Version */}
//         <div
//           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${
//             isExpanded ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <div className="text-[10px] text-gray-400 font-mono select-none">
//             v{appVersion}
//           </div>
//         </div>
//       </div>

//       {/* Background Overlay for mobile */}
//       {isExpanded && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}
//     </div>
//   );
// };

// // 1. Leaf Navigation Item
// export const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
//   if (searchTerm && !label.toLowerCase().includes(searchTerm.toLowerCase())) {
//     return null;
//   }

//   return (
//     <Link
//       to={path}
//       className={`block px-3 py-1.5 text-xs rounded-md transition-colors whitespace-normal break-words leading-snug ${
//         selected === path
//           ? "text-white font-semibold"
//           : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//       }`}
//       style={{
//         backgroundColor: selected === path ? "#17414d" : undefined,
//       }}
//       onClick={(e) => {
//         e.preventDefault();
//         onClick?.(path);
//       }}
//     >
//       {label}
//     </Link>
//   );
// };

// // Helper function to check if any descendant child matches the search term recursively
// const hasMatchingChild = (children, term) => {
//   if (!term) return true;
//   const termLower = term.toLowerCase();

//   return React.Children.toArray(children).some((child) => {
//     if (!React.isValidElement(child)) return false;

//     if (child.props.label?.toLowerCase().includes(termLower)) {
//       return true;
//     }

//     if (child.props.children) {
//       return hasMatchingChild(child.props.children, term);
//     }

//     return false;
//   });
// };

// // 2. Recursive Subgroup Component
// export const NavSubGroup = ({
//   label,
//   children,
//   searchTerm,
//   defaultOpen = false,
// }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);

//   const matchesSelf = searchTerm
//     ? label.toLowerCase().includes(searchTerm.toLowerCase())
//     : false;
//   const matchesNested = hasMatchingChild(children, searchTerm);

//   if (searchTerm && !matchesSelf && !matchesNested) {
//     return null;
//   }

//   const shouldOpen = searchTerm ? matchesSelf || matchesNested : isOpen;

//   const renderedChildren = React.Children.map(children, (child) => {
//     if (!React.isValidElement(child)) return child;
//     return React.cloneElement(child, { searchTerm });
//   });

//   return (
//     <div className="space-y-1">
//       {!searchTerm && (
//         <div
//           className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer rounded-md transition-colors hover:bg-gray-50 select-none"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <span className="font-medium break-words whitespace-normal leading-tight mr-2">
//             {label}
//           </span>
//           <span className="shrink-0 text-gray-400">
//             {shouldOpen ? (
//               <ChevronDown size={12} />
//             ) : (
//               <ChevronRight size={12} />
//             )}
//           </span>
//         </div>
//       )}
//       {shouldOpen && (
//         <div className="ml-2 border-l border-gray-200 pl-2 space-y-1">
//           {renderedChildren}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NavigationSidebar;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  BarChart2,
  Layers,
  LayoutDashboard,
  Target,
  Gauge,
  ShieldCheck,
  Pin,
  PinOff,
  Handshake,
  Briefcase,
  FileCheck2,
} from "lucide-react";

const NavigationSidebar = ({
  setIsHovered,
  isHovered,
  setIsSidebarOpen,
  isSidebarOpen,
  toggleLock,
  isLocked,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [generalMenuOpen, setGeneralMenuOpen] = useState(
    pathname.includes("/dashboard"),
  );

  // Top-Level Section States
  const [reportingOpen, setReportingOpen] = useState(
    pathname.includes("/dashboard/project-report") ||
      pathname.includes("/dashboard/project-variance") ||
      pathname.includes("/dashboard/project-performance") ||
      pathname.includes("/dashboard/gl-budgeting") ||
      pathname.includes("/dashboard/project-analysis-dash") ||
      pathname.includes("/dashboard/labor-utilization-summary") ||
      pathname.includes("/dashboard/reporting-screen"),
  );
  const [prToPoTrackerOpen, setPrToPoTrackerOpen] = useState(
    pathname.includes("/dashboard/pr-to-po-tracker"),
  );

  const [planningOpen, setPlanningOpen] = useState(
    pathname.includes("/dashboard/project-budget-status") ||
      pathname.includes("/dashboard/mass-utility") ||
      pathname.includes("/dashboard/quick-budget"),
  );

  const [oppSectionOpen, setOppSectionOpen] = useState(
    pathname.includes("/dashboard/import-opportunity") ||
      pathname.includes("/dashboard/opp-project") ||
      pathname.includes("/dashboard/parametric-rate") ||
      pathname.includes("/dashboard/analog-rate") ||
      pathname.includes("/dashboard/pricing-new-business") ||
      pathname.includes("/dashboard/pricing-nb-project") ||
      pathname.includes("/dashboard/pricing-rate-configure") ||
      pathname.includes("/dashboard/pricing-dfars") ||
      pathname.includes("/dashboard/pricing-mass-utility") ||
      pathname.includes("/dashboard/pricing"),
  );

  const [pbrSectionOpen, setPbrSectionOpen] = useState(
    pathname.includes("/dashboard/pbr-report") ||
      pathname.includes("/dashboard/ice-tabs") ||
      pathname.includes("/dashboard/pool-rate-tabs") ||
      pathname.includes("/dashboard/rate-configure"),
  );

  const [subContractorSectionOpen, setSubContractorSectionOpen] = useState(
    pathname.includes("/dashboard/sub-create-timesheet") ||
      pathname.includes("/dashboard/sub-report") ||
      pathname.includes("/dashboard/sub-dashboards") ||
      pathname.includes("/dashboard/sub-settings") ||
      pathname.includes("/dashboard/sub-enquiry-approval") ||
      pathname.includes("/dashboard/sub-work-assign") ||
      pathname.includes("/dashboard/sub-invoice-export") ||
      pathname.includes("/dashboard/sub-export-table") ||
      pathname.includes("/dashboard/sub-employeeplc-mapping") ||
      pathname.includes("/dashboard/sub-workflow-mapping") ||
      pathname.includes("/dashboard/sub-po-info") ||
      pathname.includes("/dashboard/sub-pstaus"),
  );

  const [configurationOpen, setConfigurationOpen] = useState(
    pathname.includes("/dashboard/global-configuration") ||
      pathname.includes("/dashboard/projectmapping") ||
      pathname.includes("/dashboard/account-mapping") ||
      pathname.includes("/dashboard/ceiling-configuration") ||
      pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
      pathname.includes("/dashboard/annual-holidays") ||
      pathname.includes("/dashboard/prospective-id-setup"),
  );

  const [adminSetingOpen, setAdminSetingOpen] = useState(
    pathname.includes("/dashboard/manage-groups") ||
      pathname.includes("/dashboard/manage-users") ||
      pathname.includes("/dashboard/manage-roles"),
  );

  const [corporateBudgetOpen, setCorporateBudgetOpen] = useState(false);

  const [selectedPage, setSelectedPage] = useState(pathname);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        setUserName(userObj.name);
        setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
      } catch {
        setCurrentUserRole(null);
      }
    }
  }, []);

  useEffect(() => {
    setSelectedPage(pathname);
  }, [pathname]);

  const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
  const isExpanded = isLocked || isSidebarOpen || isHovered;

  const handleLinkClick = (pagePath) => {
    setSelectedPage(pagePath);
    navigate(pagePath);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen font-inter">
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
        onClick={() => setIsSidebarOpen(!isExpanded)}
      >
        {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        onMouseEnter={() => {
          if (!isLocked) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (!isLocked) setIsHovered(false);
        }}
        className={`fixed inset-y-0 left-0 z-40 flex flex-col
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out shadow-sm
          ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
          md:translate-x-0
        `}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 scrollbar-thin">
          <div
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
          >
            <div className="w-8 flex justify-center">
              {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
            </div>
            <span
              className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${
                isExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Menu
            </span>
          </div>

          {generalMenuOpen && (
            <div className="space-y-1 mt-2">
              {/* Search Bar & Lock */}
              <div
                className={`px-3 pt-4 pb-2 ${
                  isExpanded ? "flex items-center gap-2" : "hidden"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full bg-white shadow-inner"
                />
                <button
                  type="button"
                  onClick={toggleLock}
                  className="p-1 text-gray-500 hover:text-[#17414d] rounded-md transition-colors flex-shrink-0"
                  title={
                    isLocked ? "Unlock Navigation" : "Lock Navigation Expanded"
                  }
                >
                  {isLocked ? (
                    <Pin className="w-4 h-4 fill-[#17414d] text-[#17414d]" />
                  ) : (
                    <PinOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* LEVEL 1: Dashboard Section */}
              {currentUserRole?.toUpperCase() === "ADMIN" &&<div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() => setReportingOpen(!reportingOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <LayoutDashboard className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Dashboard & Reporting
                      </span>
                    </div>
                    {isExpanded &&
                      (reportingOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {/* LEVEL 2: Under Dashboard */}
                {(reportingOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    <NavItem
                      label="Executive Dashboard"
                      path="/dashboard/project-report"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />

                    <NavItem
                      label="Active Reports"
                      path="/dashboard/reporting-screen"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />

                    <NavItem
                      label="Version Analysis"
                      path="/dashboard/project-variance"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />

                    {/* LEVEL 2 Sub-Group (3rd Level Trigger) */}
                    <NavSubGroup
                      label="BI Reports"
                      searchTerm={searchTerm}
                      defaultOpen={
                        pathname.includes("/dashboard/cfo-bi-reports") ||
                        pathname.includes("/dashboard/cfo-bi-reports-labor") ||
                        pathname.includes(
                          "/dashboard/top10-bottom10-bi-reports",
                        ) ||
                        pathname.includes(
                          "/dashboard/total-company-bi-reports",
                        ) ||
                        pathname.includes(
                          "/dashboard/current-month-actuals-vs-forecast",
                        )
                      }
                    >
                      <NavItem
                        label="CFO Reports"
                        path="/dashboard/cfo-bi-reports"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Labor Utilization"
                        path="/dashboard/cfo-bi-reports-labor"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Total Company"
                        path="/dashboard/total-company-bi-reports"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Top 10 and Bottom 10 Projects"
                        path="/dashboard/top10-bottom10-bi-reports"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Current month Actuals Vs Forecast"
                        path="/dashboard/current-month-actuals-vs-forecast"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                    </NavSubGroup>
                  </div>
                )}
              </div>}

              {currentUserRole?.toUpperCase() === "ADMIN" &&<div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() => setPrToPoTrackerOpen(!prToPoTrackerOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <FileCheck2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Procure-to-Pay
                      </span>
                    </div>
                    {isExpanded &&
                      (prToPoTrackerOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {(prToPoTrackerOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    <NavItem
                      label="Dashboard"
                      path="/dashboard/pr-to-po-tracker"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                  </div>
                )}
              </div>}

              {/* LEVEL 1: Projects Section */}
              {currentUserRole?.toUpperCase() === "ADMIN" && !searchTerm && (
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                  onClick={() => setPlanningOpen(!planningOpen)}
                >
                  <div className="flex items-center">
                    <div className="w-8 flex justify-center">
                      <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                    </div>
                    <span
                      className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                        isExpanded ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Program Controls & Analytics
                    </span>
                  </div>
                  {isExpanded &&
                    (planningOpen ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    ))}
                </div>
              )}

              {currentUserRole?.toUpperCase() === "ADMIN" && (planningOpen || searchTerm) && isExpanded && (
                <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                  <NavSubGroup
                    label="Project Financial Dashboards"
                    searchTerm={searchTerm}
                    defaultOpen={
                      pathname.includes("/dashboard/project-performance") ||
                      pathname.includes("/dashboard/labor-utilization-summary")
                    }
                  >
                    <NavItem
                      label="Project Performance"
                      path="/dashboard/project-performance"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Project Console"
                      path="/dashboard/project-analysis-dash"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Labor Utilization"
                      path="/dashboard/labor-utilization-summary"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                  </NavSubGroup>

                  <NavSubGroup
                    label="Plan Project and EAC"
                    searchTerm={searchTerm}
                    defaultOpen={
                      pathname.includes("/dashboard/project-budget-status") ||
                      pathname.includes("/dashboard/mass-utility") ||
                      pathname.includes("/dashboard/quick-budget")
                    }
                  >
                    <NavItem
                      label="Plan Projects"
                      path="/dashboard/project-budget-status"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Quick Budget"
                      path="/dashboard/quick-budget"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Mass Utility"
                      path="/dashboard/mass-utility"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                  </NavSubGroup>

                  <NavSubGroup
                    label="Plan New Business"
                    searchTerm={searchTerm}
                    defaultOpen={
                      pathname.includes("/dashboard/new-business") ||
                      pathname.includes("/dashboard/create-project-budget") ||
                      pathname.includes("/dashboard/nb-project")
                    }
                  >
                    <NavItem
                      label="Manage New Business"
                      path="/dashboard/new-business"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Plan New Businesses"
                      path="/dashboard/nb-project"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Transfer Project Budget"
                      path="/dashboard/create-project-budget"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                  </NavSubGroup>
                </div>
              )}

              {/* LEVEL 1: Opportunities & Pricing Section */}
              {currentUserRole?.toUpperCase() === "ADMIN" &&<div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() => setOppSectionOpen(!oppSectionOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <Target className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Opportunity & Pricing
                      </span>
                    </div>
                    {isExpanded &&
                      (oppSectionOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {(oppSectionOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    <NavSubGroup
                      label="Capture Opportunity & Plan Pipeline"
                      searchTerm={searchTerm}
                      defaultOpen={
                        pathname.includes("/dashboard/import-opportunity") ||
                        pathname.includes("/dashboard/opp-project") ||
                        pathname.includes("/dashboard/analog-rate") ||
                        pathname.includes("/dashboard/parametric-rate")
                      }
                    >
                      <NavItem
                        label="Import Opportunities"
                        path="/dashboard/import-opportunity"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Plan Opportunities"
                        path="/dashboard/opp-project"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Analogous Rate"
                        path="/dashboard/analog-rate"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Parametric Rate"
                        path="/dashboard/parametric-rate"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                    </NavSubGroup>

                    <NavSubGroup
                      label="Cost Proposal and Pricing"
                      searchTerm={searchTerm}
                      defaultOpen={
                        pathname.includes("/dashboard/pricing-new-business") ||
                        pathname.includes("/dashboard/pricing-nb-project") ||
                        pathname.includes("/dashboard/pricing-mass-utility") ||
                        pathname.includes(
                          "/dashboard/pricing-rate-configure",
                        ) ||
                        pathname.includes("/dashboard/pricing")
                      }
                    >
                      <NavItem
                        label="Contract Setup"
                        path="/dashboard/pricing-new-business"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Proposal Builder"
                        path="/dashboard/pricing-nb-project"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Pricing Studio"
                        path="/dashboard/pricing"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Mass Utility"
                        path="/dashboard/pricing-mass-utility"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Rate Configuration"
                        path="/dashboard/pricing-rate-configure"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                    </NavSubGroup>
                  </div>
                )}
              </div>}

              {currentUserRole?.toUpperCase() === "ADMIN" &&<div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() => setCorporateBudgetOpen(!corporateBudgetOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Corporate Budget
                      </span>
                    </div>
                    {isExpanded &&
                      (corporateBudgetOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {(corporateBudgetOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    <NavItem
                      label="By Account"
                      path="/dashboard/gl-budgeting"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="By Division/Department/Organization"
                      path="/dashboard/corporate-budget-department"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                  </div>
                )}
              </div>}

              {/* LEVEL 1: Compliance (DCAA) */}
              {currentUserRole?.toUpperCase() === "ADMIN" && <div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() => setPbrSectionOpen(!pbrSectionOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <Gauge className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        GovCon Compliances
                      </span>
                    </div>
                    {isExpanded &&
                      (pbrSectionOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {(pbrSectionOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    <NavItem
                      label="Provisional Billing Rates (PBR)"
                      path="/dashboard/pbr-report"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Incurred Cost Model (ICE)"
                      path="/dashboard/ice-tabs"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavSubGroup
                      label="Forward Pricing Rates (FPRP)"
                      searchTerm={searchTerm}
                      defaultOpen={
                        pathname.includes("/dashboard/pool-rate-tabs") ||
                        pathname.includes("/dashboard/rate-configure")
                      }
                    >
                      <NavItem
                        label="Rate Configuration"
                        path="/dashboard/pool-rate-tabs"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="Rate Computation"
                        path="/dashboard/rate-configure"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                    </NavSubGroup>
                  </div>
                )}
              </div>}

              {/* Time and Subcontractor Management */}
              <div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() =>
                      setSubContractorSectionOpen(!subContractorSectionOpen)
                    }
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <Handshake className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Time and Subcontractor Management
                      </span>
                    </div>
                    {isExpanded &&
                      (subContractorSectionOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {(subContractorSectionOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    {currentUserRole?.toUpperCase() === "ADMIN" && <NavItem
                      label="Dashboard"
                      path="/dashboard/sub-dashboards"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />}
                    <NavItem
                      label="Create Timesheet"
                      path="/dashboard/sub-create-timesheet"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    {(currentUserRole?.toUpperCase() === "ADMIN" || currentUserRole?.toUpperCase() === "SUPERVISOR" || currentUserRole?.toUpperCase() === "PROJECT MANAGER") && <NavItem
                      label="Enquiry & Approval"
                      path="/dashboard/sub-enquiry-approval"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />}
                    {(currentUserRole?.toUpperCase() === "ADMIN") && 
                    <NavItem
                      label="Generate Invoice"
                      path="/dashboard/sub-export-table"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />}
                    {(currentUserRole?.toUpperCase() === "ADMIN") &&
                    <NavItem
                      label="Invoice Export"
                      path="/dashboard/sub-invoice-export"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
}
                    {/* <NavItem
                      label="PO Info"
                      path="/dashboard/sub-po-info"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="PO Status"
                      path="/dashboard/sub-pstaus"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Work Order"
                      path="/dashboard/sub-work-assign"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    /> */}
                    {(currentUserRole?.toUpperCase() === "ADMIN") &&
                    <NavItem
                      label="Report"
                      path="/dashboard/sub-report"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    /> }
                    {(currentUserRole?.toUpperCase() === "ADMIN") && <><NavItem
                      label="Manage Project"
                      path="/dashboard/sub-project-master"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Manage Employee"
                      path="/dashboard/sub-employee-master"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Project Leave Mapping"
                      path="/dashboard/leave-project-mapping"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Manage Timesheet Schdule"
                      path="/dashboard/sub-schedule-manager"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Groups Management"
                      path="/dashboard/group-management"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="User Workflow Mapping"
                      path="/dashboard/sub-workflow-mapping"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Employee Project Mapping"
                      path="/dashboard/sub-project-user-mapping"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    
                    <NavItem
                      label="Settings"
                      path="/dashboard/sub-settings"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    /></>}
                  </div>
                )}
              </div>

              {/* LEVEL 1: Settings */}
              {currentUserRole?.toUpperCase() === "ADMIN" &&<div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() => setConfigurationOpen(!configurationOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <Layers className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Settings
                      </span>
                    </div>
                    {isExpanded &&
                      (configurationOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {(configurationOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    <NavItem
                      label="Project Plc Mapping"
                      path="/dashboard/sub-plc-mapping"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Configuration Settings"
                      path="/dashboard/global-configuration"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Access Mapping"
                      path="/dashboard/projectmapping"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Account Mapping"
                      path="/dashboard/account-mapping"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Ceiling Configuration"
                      path="/dashboard/ceiling-configuration"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Fiscal Year Periods"
                      path="/dashboard/maintain-fiscal-year-periods"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Annual Holidays"
                      path="/dashboard/annual-holidays"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Prospective ID Setup"
                      path="/dashboard/prospective-id-setup"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                  </div>
                )}
              </div>}

              {/* LEVEL 1: Admin */}
             {currentUserRole?.toUpperCase() === "ADMIN" && <div>
                {!searchTerm && (
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                    onClick={() => setAdminSetingOpen(!adminSetingOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center">
                        <ShieldCheck className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                      </div>
                      <span
                        className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                          isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Admin
                      </span>
                    </div>
                    {isExpanded &&
                      (adminSetingOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </div>
                )}

                {(adminSetingOpen || searchTerm) && isExpanded && (
                  <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                    {/* <NavItem
                      label="Manage Groups"
                      path="/dashboard/manage-groups"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    /> */}

                    <NavItem
                      label="Manage Users"
                      path="/dashboard/manage-users"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Manage Roles"
                      path="/dashboard/manage-roles"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                    <NavItem
                      label="Manage Devices"
                      path="/dashboard/authorize-device"
                      selected={selectedPage}
                      onClick={handleLinkClick}
                      searchTerm={searchTerm}
                    />
                  </div>
                )}
              </div>}
            </div>
          )}
        </div>

        {/* AI Assistant Button */}
        {/* <div className="px-3 mb-2">
          <div className="px-1.5 py-1">
            <Link
              to="/dashboard/our-ai"
              onClick={() => handleLinkClick("/dashboard/our-ai")}
              className={`flex items-center rounded-md transition-all duration-200 ${
                !isExpanded
                  ? "justify-center w-8 h-8 mx-auto"
                  : "px-3 py-2 text-xs w-full gap-2.5"
              } ${
                selectedPage === "/dashboard/our-ai"
                  ? "text-white font-semibold"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              style={{
                backgroundColor:
                  selectedPage === "/dashboard/our-ai" ? "#17414d" : "",
              }}
              title={!isExpanded ? "R-AI" : ""}
            >
              <svg
                className={`${!isExpanded ? "w-5 h-5" : "w-4 h-4"} shrink-0`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9.813 15.904L9 21L14.907 15.904L21 18L18 3L3 12L9.813 15.904Z" />
              </svg>
              {isExpanded && <span className="truncate">R-AI</span>}
            </Link>
          </div>
        </div> */}

        {/* Footer Version */}
        <div
          className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-[10px] text-gray-400 font-mono select-none">
            v{appVersion}
          </div>
        </div>
      </div>

      {/* Background Overlay for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

// 1. Leaf Navigation Item
export const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
  if (searchTerm && !label.toLowerCase().includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <Link
      to={path}
      className={`block px-3 py-1.5 text-xs rounded-md transition-colors whitespace-normal break-words leading-snug ${
        selected === path
          ? "text-white font-semibold"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
      style={{
        backgroundColor: selected === path ? "#17414d" : undefined,
      }}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(path);
      }}
    >
      {label}
    </Link>
  );
};

// Helper function to check if any descendant child matches the search term recursively
const hasMatchingChild = (children, term) => {
  if (!term) return true;
  const termLower = term.toLowerCase();

  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;

    if (child.props.label?.toLowerCase().includes(termLower)) {
      return true;
    }

    if (child.props.children) {
      return hasMatchingChild(child.props.children, term);
    }

    return false;
  });
};

// 2. Recursive Subgroup Component
export const NavSubGroup = ({
  label,
  children,
  searchTerm,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const matchesSelf = searchTerm
    ? label.toLowerCase().includes(searchTerm.toLowerCase())
    : false;
  const matchesNested = hasMatchingChild(children, searchTerm);

  if (searchTerm && !matchesSelf && !matchesNested) {
    return null;
  }

  const shouldOpen = searchTerm ? matchesSelf || matchesNested : isOpen;

  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { searchTerm });
  });

  return (
    <div className="space-y-1">
      {!searchTerm && (
        <div
          className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer rounded-md transition-colors hover:bg-gray-50 select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium break-words whitespace-normal leading-tight mr-2">
            {label}
          </span>
          <span className="shrink-0 text-gray-400">
            {shouldOpen ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </span>
        </div>
      )}
      {shouldOpen && (
        <div className="ml-2 border-l border-gray-200 pl-2 space-y-1">
          {renderedChildren}
        </div>
      )}
    </div>
  );
};

export default NavigationSidebar;
