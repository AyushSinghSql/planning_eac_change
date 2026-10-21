// // import React, { useState, useEffect } from "react";
// // import {
// //   Link,
// //   useLocation,
// //   useNavigate,
// //   useOutletContext,
// // } from "react-router-dom";

// // import {
// //   Menu,
// //   X,
// //   ChevronDown,
// //   ChevronRight,
// //   Plus,
// //   Minus,
// //   BarChart2,
// //   Layers,
// //   FileText,
// //   Settings,
// //   BriefcaseBusiness,
// //   SlidersHorizontal,
// //   LayoutDashboard,
// //   TrendingUp, // For Reporting/Dashboard
// //   Target,
// //   Users,
// //   Percent, // new icon for New Business Budget section
// // } from "lucide-react";

// // const NavigationSidebar = ({
// //   setIsHovered,
// //   isHovered,
// //   setIsSidebarOpen,
// //   isSidebarOpen,
// //   visibility, // <-- Added
// //   canView, // <-- Added
// //   canEdit,
// // }) => {
// //   const { pathname } = useLocation();
// //   const navigate = useNavigate();

// //   const [onHoverChange, setOnhoverChange] = useState(false);

// //   // const { visibility, canView, canEdit } = useOutletContext();

// //   const [searchTerm, setSearchTerm] = useState("");

// //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// //     pathname.includes("/dashboard/project-budget-status") ||
// //       pathname.includes("/dashboard/nb-project") ||
// //       pathname.includes("/dashboard/opp-project") ||
// //       pathname.includes("/dashboard/new-business") ||
// //       pathname.includes("/dashboard/pool-rate-tabs") ||
// //       pathname.includes("/dashboard/pool-configuration") ||
// //       pathname.includes("/dashboard/template-pool-mapping") ||
// //       pathname.includes("/dashboard/template") ||
// //       pathname.includes("/dashboard/ceiling-configuration") ||
// //       pathname.includes("/dashboard/global-configuration") ||
// //       pathname.includes("/dashboard/prospective-id-setup") ||
// //       pathname.includes("/dashboard/display-settings") ||
// //       pathname.includes("/dashboard/annual-holidays") ||
// //       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //       pathname.includes("/dashboard/analog-rate") ||
// //       pathname.includes("/dashboard/parametric-rate") ||
// //       pathname.includes("/dashboard/project-report") ||
// //       pathname.includes("/dashboard/reporting-screen") ||
// //       pathname.includes("/dashboard/role-rights") ||
// //       pathname.includes("/dashboard/mass-utility") ||
// //       pathname.includes("/dashboard/quick-budget") ||
// //       pathname.includes("/dashboard/import-utility") ||
// //       pathname.includes("/dashboard/account-mapping") ||
// //       pathname.includes("/dashboard/projectmapping") ||
// //       pathname.includes("/dashboard/monthly-forecast") ||
// //       pathname.includes("/dashboard/create-project-budget") ||
// //       pathname.includes("/dashboard/import-opportunity") ||
// //       pathname.includes("/dashboard/manage-users") ||
// //       pathname.includes("/dashboard/manage-groups") ||
// //       pathname.includes("/dashboard/override-settings") ||
// //       pathname.includes("/dashboard/rate-configure") ||
// //       pathname.includes("/dashboard/pbr"),
// //   );

// //   const [planningOpen, setPlanningOpen] = useState(
// //     pathname.includes("/dashboard/project-budget-status") ||
// //       pathname.includes("/dashboard/mass-utility") ||
// //       pathname.includes("/dashboard/quick-budget"),
// //   );

// //   const [configurationOpen, setConfigurationOpen] = useState(
// //     pathname.includes("/dashboard/global-configuration") ||
// //       pathname.includes("/dashboard/projectmapping") ||
// //       pathname.includes("/dashboard/account-mapping") ||
// //       pathname.includes("/dashboard/ceiling-configuration") ||
// //       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //       pathname.includes("/dashboard/annual-holidays") ||
// //       pathname.includes("/dashboard/prospective-id-setup") ||
// //       pathname.includes("/dashboard/manage-groups") ||
// //       pathname.includes("/dashboard/manage-users"),
// //   );

// //   // const [poolMappingOpen, setPoolMappingOpen] = useState(
// //   //   pathname.includes("/dashboard/pool-configuration") ||
// //   //     pathname.includes("/dashboard/template-pool-mapping") ||
// //   //     pathname.includes("/dashboard/rate-configure")
// //   // );

// //   // NEW: New Business Budget section open state
// //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// //     pathname.includes("/dashboard/new-business") ||
// //       pathname.includes("/dashboard/nb-project") ||
// //       pathname.includes("/dashboard/create-project-budget"),
// //   );

// //   const [oppSectionOpen, setOppSectionOpen] = useState(
// //     pathname.includes("/dashboard/import-opportunity") ||
// //       pathname.includes("/dashboard/opp-project") ||
// //       pathname.includes("/dashboard/parametric-rate") ||
// //       pathname.includes("/dashboard/analog-rate"),
// //   );

// //   const [reportingOpen, setReportingOpen] = useState(
// //     pathname.includes("/dashboard/project-report"),
// //     pathname.includes("/dashboard/reporting-screen"),
// //   );
// //   const [rateOpen, setRateOpen] = useState(
// //     pathname.includes("/dashboard/pool-rate-tabs") ||
// //       pathname.includes("/dashboard/rate-configure"),
// //   );
// //   const [pbrOpen, setPbrOpen] = useState(pathname.includes("/dashboard/pbr"));

// //   // NEW: Manage (Users & Groups) section open state
// //   // const [manageSectionOpen, setManageSectionOpen] = useState(
// //   //   pathname.includes("/dashboard/manage-users") ||
// //   //     pathname.includes("/dashboard/manage-groups") ||
// //   //     pathname.includes("/dashboard/rate-configure")
// //   // );

// //   // const [manageSettingOpen, setManageSettingOpen] = useState(
// //   //   pathname.includes("/dashboard/global-configuration") ||
// //   //     pathname.includes("/dashboard/display-settings") ||
// //   //     pathname.includes("/dashboard/rate-configure")
// //   // );

// //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const [selectedPage, setSelectedPage] = useState(pathname);
// //   const [currentUserRole, setCurrentUserRole] = useState(null);
// //   const [userName, setUserName] = useState("");

// //   // hover state (existing)
// //   // const [isHovered, setIsHovered] = useState(false);

// //   useEffect(() => {
// //     const userString = localStorage.getItem("currentUser");
// //     if (userString) {
// //       try {
// //         const userObj = JSON.parse(userString);
// //         setUserName(userObj.name);
// //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// //       } catch {
// //         setCurrentUserRole(null);
// //       }
// //     }
// //   }, []);

// //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// //   const isExpanded = isSidebarOpen || isHovered;
// //   useEffect(() => {
// //     setSelectedPage(pathname);

// //     if (currentUserRole === "admin") {
// //       setGeneralMenuOpen(
// //         pathname.includes("/dashboard/project-budget-status") ||
// //           pathname.includes("/dashboard/nb-project") ||
// //           pathname.includes("/dashboard/opp-project") ||
// //           pathname.includes("/dashboard/new-business") ||
// //           pathname.includes("/dashboard/pool-rate-tabs") ||
// //           pathname.includes("/dashboard/pool-configuration") ||
// //           pathname.includes("/dashboard/template-pool-mapping") ||
// //           pathname.includes("/dashboard/template") ||
// //           pathname.includes("/dashboard/ceiling-configuration") ||
// //           pathname.includes("/dashboard/global-configuration") ||
// //           pathname.includes("/dashboard/prospective-id-setup") ||
// //           pathname.includes("/dashboard/display-settings") ||
// //           pathname.includes("/dashboard/annual-holidays") ||
// //           pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //           pathname.includes("/dashboard/analog-rate") ||
// //           pathname.includes("/dashboard/parametric-rate") ||
// //           pathname.includes("/dashboard/project-report") ||
// //           pathname.includes("/dashboard/reporting-screen") ||
// //           pathname.includes("/dashboard/role-rights") ||
// //           pathname.includes("/dashboard/mass-utility") ||
// //           pathname.includes("/dashboard/quick-budget") ||
// //           pathname.includes("/dashboard/import-utility") ||
// //           pathname.includes("/dashboard/account-mapping") ||
// //           pathname.includes("/dashboard/projectmapping") ||
// //           pathname.includes("/dashboard/monthly-forecast") ||
// //           pathname.includes("/dashboard/create-project-budget") ||
// //           pathname.includes("/dashboard/import-opportunity") ||
// //           pathname.includes("/dashboard/manage-users") ||
// //           pathname.includes("/dashboard/manage-groups") ||
// //           pathname.includes("/dashboard/override-settings") ||
// //           pathname.includes("/dashboard/rate-configure") ||
// //           pathname.includes("/dashboard/pbr"),
// //       );
// //       setPlanningOpen(
// //         pathname.includes("/dashboard/project-budget-status") ||
// //           pathname.includes("/dashboard/quick-budget") ||
// //           pathname.includes("/dashboard/mass-utility"),
// //       );
// //       setConfigurationOpen(
// //         pathname.includes("/dashboard/global-configuration") ||
// //           pathname.includes("/dashboard/projectmapping") ||
// //           pathname.includes("/dashboard/account-mapping") ||
// //           pathname.includes("/dashboard/ceiling-configuration") ||
// //           pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //           pathname.includes("/dashboard/annual-holidays") ||
// //           pathname.includes("/dashboard/prospective-id-setup") ||
// //           pathname.includes("/dashboard/manage-groups") ||
// //           pathname.includes("/dashboard/manage-users"),
// //       );
// //       //   setPoolMappingOpen(
// //       //     pathname.includes("/dashboard/pool-configuration") ||
// //       //     pathname.includes("/dashboard/nb-project") ||
// //       // pathname.includes("/dashboard/opp-project") ||
// //       //       pathname.includes("/dashboard/template-pool-mapping") ||
// //       //   pathname.includes("/dashboard/rate-configure")
// //       //   );
// //       setNewBusinessSectionOpen(
// //         pathname.includes("/dashboard/new-business") ||
// //           pathname.includes("/dashboard/nb-project") ||
// //           pathname.includes("/dashboard/create-project-budget"),
// //       );
// //       setReportingOpen(
// //         pathname.includes("/dashboard/project-report") ||
// //           pathname.includes("/dashboard/reporting-screen"),
// //       );
// //       setRateOpen(
// //         pathname.includes("/dashboard/pool-rate-tabs") ||
// //           pathname.includes("/dashboard/rate-configure"),
// //       );
// //       setPbrOpen(pathname.includes("/dashboard/pbr"));
// //       setOppSectionOpen(
// //         pathname.includes("/dashboard/import-opportunity") ||
// //           pathname.includes("/dashboard/opp-project") ||
// //           pathname.includes("/dashboard/parametric-rate") ||
// //           pathname.includes("/dashboard/analog-rate"),
// //       );
// //       //   setManageSectionOpen(
// //       //     pathname.includes("/dashboard/manage-users") ||
// //       //     pathname.includes("/dashboard/nb-project") ||
// //       // pathname.includes("/dashboard/opp-project") ||
// //       //       pathname.includes("/dashboard/manage-groups") ||
// //       //   pathname.includes("/dashboard/rate-configure")
// //       //   );
// //     } else if (currentUserRole === "user" || currentUserRole === "User") {
// //       const isProjectBudget =
// //         pathname.includes("/dashboard/project-budget-status") ||
// //         pathname.includes("/dashboard/project-report") ||
// //         pathname.includes("/dashboard/reporting-screen") ||
// //         pathname.includes("/dashboard/mass-utility") ||
// //         pathname.includes("/dashboard/quick-budget") ||
// //         pathname.includes("/dashboard/import-utility") ||
// //         pathname.includes("dashboard/new-business") ||
// //         pathname.includes("/dashboard/nb-project") ||
// //         pathname.includes("/dashboard/opp-project") ||
// //         pathname.includes("/dashboard/rate-configure") ||
// //         pathname.includes("/dashboard/pbr");
// //       setGeneralMenuOpen(isProjectBudget);
// //       setPlanningOpen(isProjectBudget);
// //       setConfigurationOpen(false);
// //       setPoolMappingOpen(false);
// //       setNewBusinessSectionOpen(false);
// //       setReportingOpen(false);
// //       setRateOpen(false);
// //       setPbrOpen(false);
// //       setOppSectionOpen(false);
// //       setManageSectionOpen(false);

// //       if (!isProjectBudget) {
// //         navigate("/dashboard/project-budget-status");
// //       }
// //     }
// //   }, [pathname, currentUserRole, navigate]);

// //   const handleLinkClick = (pagePath) => {
// //     setSelectedPage(pagePath);
// //     navigate(pagePath);
// //     if (isSidebarOpen) {
// //       setIsSidebarOpen(false);
// //     }
// //   };

// //   const handleCloseSidebar = () => {
// //     setSearchTerm("");
// //     setIsSidebarOpen(false);
// //   };
// //   const handleOpenSidebar = () => {
// //     setIsSidebarOpen(true);
// //   };

// //   return (
// //     <div
// //       // onMouseOver={handleOpenSidebar}
// //       // onMouseLeave={handleCloseSidebar}
// //       className="flex min-h-screen font-inter"
// //     >
// //       {/* Mobile Toggle */}
// //       <button
// //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// //         onClick={() => setIsSidebarOpen(!isExpanded)}
// //       >
// //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// //       </button>

// //       {/* Sidebar - Hover to expand */}
// //       <div
// //         // onMouseEnter={() => setIsHovered(true)}
// //         // onMouseLeave={() => setIsHovered(false)}
// //         // className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm
// //         //   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
// //         //   md:translate-x-0
// //         //   w-14 hover:w-55
// //         // `}
// //         onMouseEnter={() => setIsHovered(true)}
// //         onMouseLeave={() => setIsHovered(false)}
// //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// //       bg-white border-r border-gray-200
// //       transition-all duration-300 ease-in-out shadow-sm
// //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// //       md:translate-x-0

// //     `}
// //       >
// //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4">
// //           {/* Menu / General Toggle Section */}
// //           <div
// //             className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
// //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// //           >
// //             <div className="w-8 flex justify-center">
// //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// //             </div>
// //             <span
// //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${
// //                 isExpanded ? "opacity-100" : "opacity-0"
// //               }`}
// //             >
// //               Menu
// //             </span>
// //           </div>

// //           {generalMenuOpen && (
// //             <div className="space-y-1 mt-2">
// //               {/* --- PLANNING SECTION --- */}
// //               <div>
// //                 <div
// //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// //                 >
// //                   <input
// //                     type="text"
// //                     placeholder="Search..."
// //                     value={searchTerm}
// //                     onChange={(e) =>
// //                       setSearchTerm(e.target.value.toLowerCase())
// //                     }
// //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// //                   />
// //                 </div>

// //                 {/* Dashboard */}
// //                 {/* {canView("reports") && ( */}
// //                 {(canView("forecastReport") ||
// //                   canView("spendReport") ||
// //                   canView("incomeStatement") ||
// //                   canView("balanceSheet") ||
// //                   canView("trendForecast") ||
// //                   canView("activeReport")) && (
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                         onClick={() => setReportingOpen(!reportingOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <LayoutDashboard className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                               isExpanded ? "opacity-100" : "opacity-0"
// //                             }`}
// //                           >
// //                             Dashboard
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (reportingOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}
// //                     {(reportingOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {/* {canView("reports") && ( */}
// //                         <>
// //                           {(canView("forecastReport") ||
// //                             canView("spendReport") ||
// //                             canView("incomeStatement") ||
// //                             canView("balanceSheet") ||
// //                             canView("trendForecast")) && (
// //                             <NavItem
// //                               label="Dashboard"
// //                               path="/dashboard/project-report"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                           {canView("activeReport") && (
// //                             <NavItem
// //                               label="Active Reports"
// //                               path="/dashboard/reporting-screen"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         </>
// //                         {/* )} */}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //                 {/* )} */}

// //                 {!searchTerm && (
// //                   <div
// //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                     onClick={() => setPlanningOpen(!planningOpen)}
// //                   >
// //                     <div className="flex items-center">
// //                       <div className="w-8 flex justify-center">
// //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                       </div>
// //                       <span
// //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                           isExpanded ? "opacity-100" : "opacity-0"
// //                         }`}
// //                       >
// //                         Projects
// //                       </span>
// //                     </div>
// //                     {isExpanded &&
// //                       (planningOpen ? (
// //                         <ChevronDown size={14} />
// //                       ) : (
// //                         <ChevronRight size={14} />
// //                       ))}
// //                   </div>
// //                 )}

// //                 {(planningOpen || searchTerm) && isExpanded && (
// //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                     <NavItem
// //                       label="Plan Projects"
// //                       path="/dashboard/project-budget-status"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                       searchTerm={searchTerm}
// //                     />

// //                     {canView("quickBudget") && (
// //                       <NavItem
// //                         label="Quick Budget"
// //                         path="/dashboard/quick-budget"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     )}

// //                     {canView("massUtility") && (
// //                       <NavItem
// //                         label="Mass Utility"
// //                         path="/dashboard/mass-utility"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     )}

// //                     {/* <NavItem
// //                       label="Import"
// //                       path="/dashboard/import-utility"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                       searchTerm={searchTerm}
// //                     /> */}

// //                     {/* <NavItem
// //                       label="New Business Budget"
// //                       path="/dashboard/new-business"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     /> */}
// //                     {/* Monthly Forecast is still commented, preserving logic */}
// //                     {/* <NavItem
// //                       label="Monthly Forecast"
// //                       path="/dashboard/monthly-forecast"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     /> */}
// //                   </div>
// //                 )}
// //               </div>
// //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// //               {/* {currentUserRole === "admin" && ( */}
// //               {(canView("manageNewBusiness") ||
// //                 canView("planNewBusiness") ||
// //                 canView("transferUtility")) && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() =>
// //                         setNewBusinessSectionOpen(!newBusinessSectionOpen)
// //                       }
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           New Businesses
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (newBusinessSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}
// //                   {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {canView("planNewBusiness") && (
// //                         <NavItem
// //                           label="Plan New Businesses"
// //                           path="/dashboard/nb-project"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}

// //                       {canView("manageNewBusiness") && (
// //                         <NavItem
// //                           label="Manage New Business"
// //                           path="/dashboard/new-business"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}

// //                       {canView("transferUtility") && (
// //                         <NavItem
// //                           label="Transfer Project Budget"
// //                           path="/dashboard/create-project-budget"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {(canView("planOpportunity") ||
// //                 canView("analogRate") ||
// //                 canView("parametricRate") ||
// //                 canView("impOpportunity")) && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() => setOppSectionOpen(!oppSectionOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <Target className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           Opportunities
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (oppSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}
// //                   {(oppSectionOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {canView("planOpportunity") && (
// //                         <NavItem
// //                           label="Plan Opportunities"
// //                           path="/dashboard/opp-project"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("impOpportunity") && (
// //                         <>
// //                           <NavItem
// //                             label="Import Opportunities"
// //                             path="/dashboard/import-opportunity"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         </>
// //                       )}
// //                       {canView("analogRate") && (
// //                         <NavItem
// //                           label="NBIs Analogous Rate"
// //                           path="/dashboard/analog-rate"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("parametricRate") && (
// //                         <NavItem
// //                           label="NBIs Parametric Rate"
// //                           path="/dashboard/parametric-rate"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {(canView("poolRateTabs") || canView("rateComputation")) && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() => setRateOpen(!rateOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           Forecast Rates
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (rateOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}

// //                   {(rateOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {canView("poolRateTabs") && (
// //                         <NavItem
// //                           label="Rate Configuration"
// //                           path="/dashboard/pool-rate-tabs"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("rateComputation") && (
// //                         <NavItem
// //                           label="Rate Computation"
// //                           path="/dashboard/rate-configure"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Hide PBR it is neccessary further */}
// //               {/* <div>
// //                 {!searchTerm && (
// //                   <div
// //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                     onClick={() => setPbrOpen(!pbrOpen)}
// //                   >
// //                     <div className="flex items-center">
// //                       <div className="w-8 flex justify-center">
// //                         <Percent className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                       </div>
// //                       <span
// //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                           isExpanded ? "opacity-100" : "opacity-0"
// //                         }`}
// //                       >
// //                         PBR
// //                       </span>
// //                     </div>
// //                     {isExpanded &&
// //                       (pbrOpen ? (
// //                         <ChevronDown size={14} />
// //                       ) : (
// //                         <ChevronRight size={14} />
// //                       ))}
// //                   </div>
// //                 )}
// //                 {(pbrOpen || searchTerm) && isExpanded && (
// //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                     {currentUserRole === "admin" && (
// //                       <>
// //                         <NavItem
// //                           label="PBR"
// //                           path="/dashboard/pbr"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       </>
// //                     )}
// //                   </div>
// //                 )}
// //               </div> */}
// //               {/* )} */}
// //               {/* {currentUserRole === "admin" && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() => setManageSectionOpen(!manageSectionOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isHovered ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           Manage
// //                         </span>
// //                       </div>
// //                       {isSidebarOpen &&
// //                         (manageSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}

// //                   {(manageSectionOpen || searchTerm) && isSidebarOpen && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       <NavItem
// //                         label="Manage Groups"
// //                         path="/dashboard/manage-groups"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                       <NavItem
// //                         label="Manage Users"
// //                         path="/dashboard/manage-users"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     </div>
// //                   )}
// //                 </div>
// //               )} */}
// //               {/* Nested Pool Mapping */}
// //               {/* {currentUserRole === "admin" && (
// //     <div>
// //      <div
// //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// //                     onClick={() => setPoolMappingOpen(!poolMappingOpen)}
// //                   >
// //                     <div className="flex items-center">
// //                       <div className="w-8 flex justify-center">
// //                         <SlidersHorizontal className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// //                       </div>
// //                       <span
// //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                           isHovered ? "opacity-100" : "opacity-0"
// //                         }`}
// //                       >
// //                         Pool
// //                       </span>
// //                     </div>
// //                     {isSidebarOpen &&
// //                       (poolMappingOpen ? (
// //                         <ChevronDown size={14} />
// //                       ) : (
// //                         <ChevronRight size={14} />
// //                       ))}
// //                   </div>
// // {poolMappingOpen && isSidebarOpen && (
// //                       <div className="py-1">
// //                         {poolMappingOpen && (
// //                           <div className="ml-12 mr-4 space-y-1 border-l border-gray-100"> */}
// //               {/* <NavItem
// //                               label="Org Account"
// //                               path="/dashboard/pool-configuration"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                             />
// //                             <NavItem
// //                               label="Template Pool Mapping"
// //                               path="/dashboard/template-pool-mapping"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                             /> */}
// //               {/* </div>
// //                         )}
// //                       </div>
// //                       )}
// //                       </div>
// //    )} */}
// //               {/* --- CONFIGURATION SECTION --- */}
// //               {(canView("globalConfiguration") ||
// //                 canView("manageGroups") ||
// //                 canView("manageUser") ||
// //                 canView("projectOrgSecurity") ||
// //                 canView("accountMapping") ||
// //                 canView("ceilingConfiguration") ||
// //                 canView("fiscalYearPeriods") ||
// //                 canView("annualHolidays") ||
// //                 canView("prospectiveIdSetup") ||
// //                 canView("roleRights")) && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// //                       onClick={() => setConfigurationOpen(!configurationOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isHovered ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           Settings
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (configurationOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}

// //                   {(configurationOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {canView("globalConfiguration") && (
// //                         <NavItem
// //                           label="Configuration Settings"
// //                           path="/dashboard/global-configuration"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("projectOrgSecurity") && (
// //                         <NavItem
// //                           label="Project Org Security"
// //                           path="/dashboard/projectmapping"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("accountMapping") && (
// //                         <NavItem
// //                           label="Account Mapping"
// //                           path="/dashboard/account-mapping"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("ceilingConfiguration") && (
// //                         <NavItem
// //                           label="Ceiling Configuration"
// //                           path="/dashboard/ceiling-configuration"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("fiscalYearPeriods") && (
// //                         <NavItem
// //                           label="Fiscal Year Periods"
// //                           path="/dashboard/maintain-fiscal-year-periods"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}

// //                       {canView("annualHolidays") && (
// //                         <NavItem
// //                           label="Annual Holidays"
// //                           path="/dashboard/annual-holidays"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("prospectiveIdSetup") && (
// //                         <NavItem
// //                           label="Prospective ID Setup"
// //                           path="/dashboard/prospective-id-setup"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("manageGroups") && (
// //                         <NavItem
// //                           label="Manage Groups"
// //                           path="/dashboard/manage-groups"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("manageUser") && (
// //                         <NavItem
// //                           label="Manage Users"
// //                           path="/dashboard/manage-users"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {currentUserRole === "admin" && (
// //                         <NavItem
// //                           label="Rights Settings"
// //                           path="/dashboard/role-rights"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                         />
// //                       )}

// //                       {/* <NavItem
// //                         label="Override Configuration"
// //                         path="/dashboard/override-settings"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                       /> */}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //               {/* Setting Tap */}
// //               {/* {currentUserRole === "admin" && (
// //     <div>
// //      <div
// //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// //                     onClick={() => setManageSettingOpen(!manageSettingOpen)}
// //                   >
// //                     <div className="flex items-center">
// //                       <div className="w-8 flex justify-center">
// //                         <Settings className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// //                       </div>
// //                       <span
// //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                           isHovered ? "opacity-100" : "opacity-0"
// //                         }`}
// //                       >
// //                         Settings
// //                       </span>
// //                     </div>
// //                     {isSidebarOpen &&
// //                       (manageSettingOpen ? (
// //                         <ChevronDown size={14} />
// //                       ) : (
// //                         <ChevronRight size={14} />
// //                       ))}
// //                   </div>
// // {manageSettingOpen && isSidebarOpen && (
// //                       <div className="py-1">
// //                         {manageSettingOpen && (
// //                           <div className="ml-12 mr-4 space-y-1 border-l border-gray-100"> */}
// //               {/* <NavItem
// //                         label="Display Settings"
// //                         path="/dashboard/display-settings"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                       /> */}
// //               {/* <NavItem
// //                         label="Rights Settings"
// //                         path="/dashboard/role-rights"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                       /> */}
// //               {/* </div>
// //                         )}
// //                       </div>
// //                       )}
// //                       </div>
// //    )} */}
// //             </div>
// //           )}
// //         </div>

// //         {/* Footer Version */}
// //         <div
// //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${
// //             isExpanded ? "opacity-100" : "opacity-0"
// //           }`}
// //         >
// //           <div className="text-[10px] text-gray-400 font-mono select-none">
// //             v{appVersion}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Background Overlay for mobile */}
// //       {isExpanded && (
// //         <div
// //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// //           onClick={handleCloseSidebar}
// //         ></div>
// //       )}
// //     </div>
// //   );
// // };

// // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// //     return null;
// //   }

// //   return (
// //     <Link
// //       to={path}
// //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${
// //         selected === path
// //           ? "text-white font-semibold"
// //           : "text-gray-500 hover:text-gray-900"
// //       }`}
// //       style={{
// //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// //       }}
// //       onClick={(e) => {
// //         e.preventDefault();
// //         onClick(path);
// //       }}
// //     >
// //       {label}
// //     </Link>
// //   );
// // };

// // export default NavigationSidebar;

// // import React, { useState, useEffect } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";

// // import {
// //   Menu,
// //   X,
// //   ChevronDown,
// //   ChevronRight,
// //   Plus,
// //   Minus,
// //   BarChart2,
// //   Layers,
// //   BriefcaseBusiness,
// //   LayoutDashboard,
// //   TrendingUp,
// //   Target,
// //   BarChart3,
// //   CircleDollarSign,
// //   Gauge,
// //   Calculator,
// //   ShieldCheck,
// //   Pin,
// //   PinOff,
// // } from "lucide-react";

// // const NavigationSidebar = ({
// //   setIsHovered,
// //   isHovered,
// //   setIsSidebarOpen,
// //   isSidebarOpen,
// //   visibility,
// //   canView,
// //   canEdit,
// //   toggleLock,
// //   isLocked,
// // }) => {
// //   const { pathname } = useLocation();
// //   const navigate = useNavigate();

// //   const [searchTerm, setSearchTerm] = useState("");

// //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// //     pathname.includes("/dashboard/project-budget-status") ||
// //       pathname.includes("/dashboard/nb-project") ||
// //       pathname.includes("/dashboard/pricing-nb-project") ||
// //       pathname.includes("/dashboard/opp-project") ||
// //       pathname.includes("/dashboard/new-business") ||
// //       pathname.includes("/dashboard/pricing-new-business") ||
// //       pathname.includes("/dashboard/pool-rate-tabs") ||
// //       pathname.includes("/dashboard/pool-configuration") ||
// //       pathname.includes("/dashboard/template-pool-mapping") ||
// //       pathname.includes("/dashboard/template") ||
// //       pathname.includes("/dashboard/ceiling-configuration") ||
// //       pathname.includes("/dashboard/global-configuration") ||
// //       pathname.includes("/dashboard/prospective-id-setup") ||
// //       pathname.includes("/dashboard/display-settings") ||
// //       pathname.includes("/dashboard/annual-holidays") ||
// //       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //       pathname.includes("/dashboard/analog-rate") ||
// //       pathname.includes("/dashboard/parametric-rate") ||
// //       pathname.includes("/dashboard/project-report") ||
// //       pathname.includes("/dashboard/project-variance") ||
// //       pathname.includes("/dashboard/project-performance") ||
// //       pathname.includes("/dashboard/project-analysis-dash") ||
// //       pathname.includes("/dashboard/labor-utilization-summary") ||
// //       pathname.includes("/dashboard/cfo-bi-reports") ||
// //       pathname.includes("/dashboard/total-company-bi-reports") ||
// //       pathname.includes("/dashboard/top10-bottom10-bi-reports") ||
// //       pathname.includes("/dashboard/current-month-actuals-vs-forecast") ||
// //       pathname.includes("/dashboard/cfo-bi-reports-labor") ||
// //       pathname.includes("/dashboard/reporting-screen") ||
// //       pathname.includes("/dashboard/role-rights") ||
// //       pathname.includes("/dashboard/our-ai") ||
// //       pathname.includes("/dashboard/mass-utility") ||
// //       pathname.includes("/dashboard/quick-budget") ||
// //       pathname.includes("/dashboard/import-utility") ||
// //       pathname.includes("/dashboard/account-mapping") ||
// //       pathname.includes("/dashboard/projectmapping") ||
// //       pathname.includes("/dashboard/monthly-forecast") ||
// //       pathname.includes("/dashboard/create-project-budget") ||
// //       pathname.includes("/dashboard/import-opportunity") ||
// //       pathname.includes("/dashboard/manage-users") ||
// //       pathname.includes("/dashboard/manage-roles") ||
// //       pathname.includes("/dashboard/manage-groups") ||
// //       pathname.includes("/dashboard/override-settings") ||
// //       pathname.includes("/dashboard/rate-configure") ||
// //       pathname.includes("/dashboard/pricing-rate-configure") ||
// //       pathname.includes("/dashboard/pricing-dfars") ||
// //       pathname.includes("/dashboard/pbr-report") ||
// //       pathname.includes("/dashboard/pricing") ||
// //       pathname.includes("/dashboard/pricing-mass-utility") ||
// //       pathname.includes("/dashboard/ice-tabs") ||
// //       pathname.includes("/dashboard/pbr"),
// //   );

// //   const [planningOpen, setPlanningOpen] = useState(
// //     pathname.includes("/dashboard/project-budget-status") ||
// //       pathname.includes("/dashboard/mass-utility") ||
// //       pathname.includes("/dashboard/quick-budget"),
// //   );

// //   const [configurationOpen, setConfigurationOpen] = useState(
// //     pathname.includes("/dashboard/global-configuration") ||
// //       pathname.includes("/dashboard/projectmapping") ||
// //       pathname.includes("/dashboard/account-mapping") ||
// //       pathname.includes("/dashboard/ceiling-configuration") ||
// //       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //       pathname.includes("/dashboard/annual-holidays") ||
// //       pathname.includes("/dashboard/prospective-id-setup"),
// //     //  ||
// //     // pathname.includes("/dashboard/manage-groups") ||
// //     // pathname.includes("/dashboard/manage-users") ||
// //     // pathname.includes("/dashboard/manage-roles"),
// //   );

// //   const [adminSetingOpen, setAdminSetingOpen] = useState(
// //     pathname.includes("/dashboard/manage-groups") ||
// //       pathname.includes("/dashboard/manage-users") ||
// //       pathname.includes("/dashboard/manage-roles"),
// //   );

// //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// //     pathname.includes("/dashboard/new-business") ||
// //       pathname.includes("/dashboard/nb-project") ||
// //       pathname.includes("/dashboard/create-project-budget"),
// //   );

// //   const [oppSectionOpen, setOppSectionOpen] = useState(
// //     pathname.includes("/dashboard/import-opportunity") ||
// //       pathname.includes("/dashboard/opp-project") ||
// //       pathname.includes("/dashboard/parametric-rate") ||
// //       pathname.includes("/dashboard/analog-rate"),
// //   );

// //   const [pbrSectionOpen, setPbrSectionOpen] = useState(
// //     pathname.includes("/dashboard/pbr-report"),
// //   );

// //   const [pricingSectionOpen, setPricingSectionOpen] = useState(
// //     pathname.includes("/dashboard/pricing-new-business") ||
// //       pathname.includes("/dashboard/pricing-nb-project") ||
// //       pathname.includes("/dashboard/pricing-rate-configure") ||
// //       pathname.includes("/dashboard/pricing-dfars") ||
// //       pathname.includes("/dashboard/pricing-mass-utility") ||
// //       pathname.includes("/dashboard/pricing"),
// //   );

// //   const [iceSectionOpen, setIceSectionOpen] = useState(
// //     pathname.includes("/dashboard/ice-tabs"),
// //   );

// //   const [reportingOpen, setReportingOpen] = useState(
// //     pathname.includes("/dashboard/project-report") ||
// //       pathname.includes("/dashboard/project-variance") ||
// //       pathname.includes("/dashboard/project-performance") ||
// //       pathname.includes("/dashboard/project-analysis-dash") ||
// //       pathname.includes("/dashboard/labor-utilization-summary") ||
// //       pathname.includes("/dashboard/reporting-screen"),
// //   );
// //   const [biReportingOpen, setBiReportingOpen] = useState(
// //     pathname.includes("/dashboard/cfo-bi-reports") ||
// //       pathname.includes("/dashboard/total-company-bi-reports") ||
// //       pathname.includes("/dashboard/top10-bottom10-bi-reports") ||
// //       pathname.includes("/dashboard/current-month-actuals-vs-forecast") ||
// //       pathname.includes("/dashboard/cfo-bi-reports-labor"),
// //   );
// //   const [rateOpen, setRateOpen] = useState(
// //     pathname.includes("/dashboard/pool-rate-tabs") ||
// //       pathname.includes("/dashboard/rate-configure"),
// //   );

// //   const [selectedPage, setSelectedPage] = useState(pathname);
// //   const [currentUserRole, setCurrentUserRole] = useState(null);
// //   const [userName, setUserName] = useState("");

// //   useEffect(() => {
// //     const userString = localStorage.getItem("currentUser");
// //     if (userString) {
// //       try {
// //         const userObj = JSON.parse(userString);
// //         setUserName(userObj.name);
// //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// //       } catch {
// //         setCurrentUserRole(null);
// //       }
// //     }
// //   }, []);

// //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// //   // const isExpanded = isSidebarOpen || isHovered;
// //   const isExpanded = isLocked || isSidebarOpen || isHovered;

// //   const handleLinkClick = (pagePath) => {
// //     setSelectedPage(pagePath);
// //     navigate(pagePath);
// //     if (isSidebarOpen) {
// //       setIsSidebarOpen(false);
// //     }
// //   };

// //   return (
// //     <div className="flex min-h-screen font-inter">
// //       {/* Mobile Toggle */}
// //       <button
// //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// //         onClick={() => setIsSidebarOpen(!isExpanded)}
// //       >
// //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// //       </button>

// //       {/* Sidebar */}
// //       <div
// //         // onMouseEnter={() => setIsHovered(true)}
// //         // onMouseLeave={() => setIsHovered(false)}
// //         onMouseEnter={() => {
// //           if (!isLocked) setIsHovered(true);
// //         }}
// //         onMouseLeave={() => {
// //           if (!isLocked) setIsHovered(false);
// //         }}
// //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// //           bg-white border-r border-gray-200
// //           transition-all duration-300 ease-in-out shadow-sm
// //           ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// //           md:translate-x-0
// //         `}
// //       >
// //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 scrollbar-thin">
// //           <div
// //             className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
// //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// //           >
// //             <div className="w-8 flex justify-center">
// //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// //             </div>
// //             <span
// //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${
// //                 isExpanded ? "opacity-100" : "opacity-0"
// //               }`}
// //             >
// //               Menu
// //             </span>
// //           </div>

// //           {generalMenuOpen && (
// //             <div className="space-y-1 mt-2">
// //               <div>
// //                 {/* <div
// //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// //                 > */}
// //                 <div
// //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "flex items-center gap-2" : "hidden"}`}
// //                 >
// //                   <input
// //                     type="text"
// //                     placeholder="Search..."
// //                     value={searchTerm}
// //                     onChange={(e) =>
// //                       setSearchTerm(e.target.value.toLowerCase())
// //                     }
// //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full bg-white shadow-inner"
// //                   />
// //                   {/* Pin/Lock Button */}
// //                   <button
// //                     type="button"
// //                     onClick={toggleLock}
// //                     className="p-1 text-gray-500 hover:text-[#17414d] rounded-md transition-colors flex-shrink-0"
// //                     title={
// //                       isLocked
// //                         ? "Unlock Navigation"
// //                         : "Lock Navigation Expanded"
// //                     }
// //                   >
// //                     {isLocked ? (
// //                       <Pin className="w-4 h-4 fill-[#17414d] text-[#17414d]" />
// //                     ) : (
// //                       <PinOff className="w-4 h-4 text-gray-400" />
// //                     )}
// //                   </button>
// //                 </div>

// //                 {currentUserRole === "admin" && (
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                         onClick={() => setBiReportingOpen(!biReportingOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                               isExpanded ? "opacity-100" : "opacity-0"
// //                             }`}
// //                           >
// //                             BI Reports
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (biReportingOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}
// //                     {(biReportingOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="CFO Reports"
// //                             path="/dashboard/cfo-bi-reports"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Labor Utilization"
// //                             path="/dashboard/cfo-bi-reports-labor"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Total Company"
// //                             path="/dashboard/total-company-bi-reports"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Top 10 and Bottom 10 Projects"
// //                             path="/dashboard/top10-bottom10-bi-reports"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Current month Actuals Vs Forecast"
// //                             path="/dashboard/current-month-actuals-vs-forecast"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}

// //                 {/* Dashboard Section aligned to permissions */}
// //                 {canView("activeReport") && (
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                         onClick={() => setReportingOpen(!reportingOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <LayoutDashboard className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                               isExpanded ? "opacity-100" : "opacity-0"
// //                             }`}
// //                           >
// //                             Dashboard
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (reportingOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}
// //                     {(reportingOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {currentUserRole === "admin" &&
// //                           (canView("forecastReport") ||
// //                             canView("spendReport") ||
// //                             canView("incomeStatement") ||
// //                             canView("balanceSheet") ||
// //                             canView("trendForecast")) && (
// //                             <NavItem
// //                               label="Dashboard"
// //                               path="/dashboard/project-report"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("activeReport") && (
// //                           <NavItem
// //                             label="Active Reports"
// //                             path="/dashboard/reporting-screen"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Version Analysis"
// //                             path="/dashboard/project-variance"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Project Performance"
// //                             path="/dashboard/project-performance"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Project Console"
// //                             path="/dashboard/project-analysis-dash"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" && (
// //                           <NavItem
// //                             label="Labor Utilization"
// //                             path="/dashboard/labor-utilization-summary"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}

// //                 {/* Projects Section */}
// //                 {!searchTerm && (
// //                   <div
// //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                     onClick={() => setPlanningOpen(!planningOpen)}
// //                   >
// //                     <div className="flex items-center">
// //                       <div className="w-8 flex justify-center">
// //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                       </div>
// //                       <span
// //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                           isExpanded ? "opacity-100" : "opacity-0"
// //                         }`}
// //                       >
// //                         Projects
// //                       </span>
// //                     </div>
// //                     {isExpanded &&
// //                       (planningOpen ? (
// //                         <ChevronDown size={14} />
// //                       ) : (
// //                         <ChevronRight size={14} />
// //                       ))}
// //                   </div>
// //                 )}

// //                 {(planningOpen || searchTerm) && isExpanded && (
// //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                     <NavItem
// //                       label="Plan Projects"
// //                       path="/dashboard/project-budget-status"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                       searchTerm={searchTerm}
// //                     />
// //                     {canView("quickBudget") && (
// //                       <NavItem
// //                         label="Quick Budget"
// //                         path="/dashboard/quick-budget"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     )}
// //                     {canView("massUtility") && (
// //                       <NavItem
// //                         label="Mass Utility"
// //                         path="/dashboard/mass-utility"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     )}
// //                   </div>
// //                 )}
// //               </div>

// //               {/* New Businesses Section */}
// //               {(canView("manageNewBusiness") ||
// //                 // canView("transferUtility") ||
// //                 canView("planNewBusiness")) && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() =>
// //                         setNewBusinessSectionOpen(!newBusinessSectionOpen)
// //                       }
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           New Businesses
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (newBusinessSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}
// //                   {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {canView("manageNewBusiness") && (
// //                         <NavItem
// //                           label="Manage New Business"
// //                           path="/dashboard/new-business"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("planNewBusiness") && (
// //                         <NavItem
// //                           label="Plan New Businesses"
// //                           path="/dashboard/nb-project"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {currentUserRole === "admin" &&
// //                         canView("transferUtility") && (
// //                           <NavItem
// //                             label="Transfer Project Budget"
// //                             path="/dashboard/create-project-budget"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Opportunities Section */}
// //               {(canView("planOpportunity") ||
// //                 // canView("analogRate") ||
// //                 // canView("parametricRate") ||
// //                 canView("impOpportunity")) && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() => setOppSectionOpen(!oppSectionOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <Target className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           Opportunities
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (oppSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}
// //                   {(oppSectionOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {canView("impOpportunity") && (
// //                         <NavItem
// //                           label="Import Opportunities"
// //                           path="/dashboard/import-opportunity"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("planOpportunity") && (
// //                         <NavItem
// //                           label="Plan Opportunities"
// //                           path="/dashboard/opp-project"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {currentUserRole === "admin" && canView("analogRate") && (
// //                         <NavItem
// //                           label="NBIs Analogous Rate"
// //                           path="/dashboard/analog-rate"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {currentUserRole === "admin" &&
// //                         canView("parametricRate") && (
// //                           <NavItem
// //                             label="NBIs Parametric Rate"
// //                             path="/dashboard/parametric-rate"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {currentUserRole === "admin" && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() => setPricingSectionOpen(!pricingSectionOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <CircleDollarSign className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           Contract Pricing
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (pricingSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}
// //                   {(pricingSectionOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {canView("manageNewBusiness") && (
// //                         <NavItem
// //                           label="Contract Setup"
// //                           path="/dashboard/pricing-new-business"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("planNewBusiness") && (
// //                         <NavItem
// //                           label="Proposal Builder"
// //                           path="/dashboard/pricing-nb-project"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {currentUserRole === "admin" && (
// //                         <NavItem
// //                           label="Pricing Studio"
// //                           path="/dashboard/pricing"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                       {canView("massUtility") && (
// //                         <NavItem
// //                           label="Mass Utility"
// //                           path="/dashboard/pricing-mass-utility"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}

// //                       {/* {currentUserRole === "admin" && (
// //                         <NavItem
// //                           label="DFARS"
// //                           path="/dashboard/pricing-dfars"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )} */}
// //                       {canView("poolRateTabs") && (
// //                         <NavItem
// //                           label="Rate Configuration"
// //                           path="/dashboard/pricing-rate-configure"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {currentUserRole === "admin" && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() => setPbrSectionOpen(!pbrSectionOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <Gauge className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           Provisional Billing Rate
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (pbrSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}
// //                   {(pbrSectionOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {currentUserRole === "admin" && (
// //                         <NavItem
// //                           label="PBR Package"
// //                           path="/dashboard/pbr-report"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {currentUserRole === "admin" && (
// //                 <div>
// //                   {!searchTerm && (
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                       onClick={() => setIceSectionOpen(!iceSectionOpen)}
// //                     >
// //                       <div className="flex items-center">
// //                         <div className="w-8 flex justify-center">
// //                           <Calculator className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                         </div>
// //                         <span
// //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                             isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                         >
// //                           ICE
// //                         </span>
// //                       </div>
// //                       {isExpanded &&
// //                         (iceSectionOpen ? (
// //                           <ChevronDown size={14} />
// //                         ) : (
// //                           <ChevronRight size={14} />
// //                         ))}
// //                     </div>
// //                   )}
// //                   {(iceSectionOpen || searchTerm) && isExpanded && (
// //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                       {currentUserRole === "admin" && (
// //                         <NavItem
// //                           label="ICE"
// //                           path="/dashboard/ice-tabs"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Forecast Rates Section */}
// //               {currentUserRole === "admin" &&
// //                 (canView("poolRateTabs") || canView("rateComputation")) && (
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                         onClick={() => setRateOpen(!rateOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                               isExpanded ? "opacity-100" : "opacity-0"
// //                             }`}
// //                           >
// //                             Forecast Rates
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (rateOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}
// //                     {(rateOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {canView("poolRateTabs") && (
// //                           <NavItem
// //                             label="Rate Configuration"
// //                             path="/dashboard/pool-rate-tabs"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("rateComputation") && (
// //                           <NavItem
// //                             label="Rate Computation"
// //                             path="/dashboard/rate-configure"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}

// //               {/* Configuration Settings Section */}
// //               {currentUserRole === "admin" &&
// //                 (canView("globalConfiguration") ||
// //                   // canView("manageGroups") ||
// //                   // canView("manageUser") ||
// //                   canView("projectOrgSecurity") ||
// //                   canView("accountMapping") ||
// //                   canView("ceilingConfiguration") ||
// //                   canView("fiscalYearPeriods") ||
// //                   canView("annualHolidays") ||
// //                   canView("prospectiveIdSetup")) && (
// //                   // || canView("roleRights"))
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <Layers className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                               isExpanded ? "opacity-100" : "opacity-0"
// //                             }`}
// //                           >
// //                             Settings
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (configurationOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}

// //                     {(configurationOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {canView("globalConfiguration") && (
// //                           <NavItem
// //                             label="Configuration Settings"
// //                             path="/dashboard/global-configuration"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("projectOrgSecurity") && (
// //                           <NavItem
// //                             label="Access Mapping"
// //                             path="/dashboard/projectmapping"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("accountMapping") && (
// //                           <NavItem
// //                             label="Account Mapping"
// //                             path="/dashboard/account-mapping"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("ceilingConfiguration") && (
// //                           <NavItem
// //                             label="Ceiling Configuration"
// //                             path="/dashboard/ceiling-configuration"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("fiscalYearPeriods") && (
// //                           <NavItem
// //                             label="Fiscal Year Periods"
// //                             path="/dashboard/maintain-fiscal-year-periods"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("annualHolidays") && (
// //                           <NavItem
// //                             label="Annual Holidays"
// //                             path="/dashboard/annual-holidays"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("prospectiveIdSetup") && (
// //                           <NavItem
// //                             label="Prospective ID Setup"
// //                             path="/dashboard/prospective-id-setup"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {/* {canView("manageGroups") && (
// //                           <NavItem
// //                             label="Manage Groups"
// //                             path="/dashboard/manage-groups"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )} */}
// //                         {/* {currentUserRole === "admin" &&
// //                           canView("manageUser") && (
// //                             <NavItem
// //                               label="Manage Users"
// //                               path="/dashboard/manage-users"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {currentUserRole === "admin" &&
// //                           canView("manageUser") && (
// //                             <NavItem
// //                               label="Manage Roles"
// //                               path="/dashboard/manage-roles"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )} */}

// //                         {/* Strictly limits Rights Settings to admin user role configuration */}
// //                         {/* {currentUserRole === "admin" &&
// //                           canView("roleRights") && (
// //                             <NavItem
// //                               label="Rights Settings"
// //                               path="/dashboard/role-rights"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )} */}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               {currentUserRole === "admin" &&
// //                 (canView("manageGroups") ||
// //                   canView("manageUser") ||
// //                   canView("roleRights")) && (
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// //                         onClick={() => setAdminSetingOpen(!adminSetingOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <ShieldCheck className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// //                               isExpanded ? "opacity-100" : "opacity-0"
// //                             }`}
// //                           >
// //                             Admin
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (adminSetingOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}

// //                     {(adminSetingOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {canView("manageGroups") && (
// //                           <NavItem
// //                             label="Manage Groups"
// //                             path="/dashboard/manage-groups"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {currentUserRole === "admin" &&
// //                           canView("manageUser") && (
// //                             <NavItem
// //                               label="Manage Users"
// //                               path="/dashboard/manage-users"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {currentUserRole === "admin" &&
// //                           canView("manageUser") && (
// //                             <NavItem
// //                               label="Manage Roles"
// //                               path="/dashboard/manage-roles"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}

// //                         {/* Strictly limits Rights Settings to admin user role configuration */}
// //                         {/* {currentUserRole === "admin" &&
// //                           canView("roleRights") && (
// //                             <NavItem
// //                               label="Manage Rights"
// //                               path="/dashboard/role-rights"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )} */}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //             </div>
// //           )}
// //         </div>

// //         <div className="px-3 mb-2">
// //           <div className="px-1.5 py-1">
// //             <Link
// //               to="/dashboard/our-ai"
// //               onClick={handleLinkClick}
// //               className={`flex items-center rounded-md transition-all duration-200 ${
// //                 !isExpanded
// //                   ? "justify-center w-6 h-7 mx-auto"
// //                   : "px-3 py-2 text-xs w-full gap-2.5"
// //               } ${
// //                 selectedPage === "/dashboard/our-ai"
// //                   ? "text-white font-semibold "
// //                   : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
// //               }`}
// //               style={{
// //                 backgroundColor:
// //                   selectedPage === "/dashboard/our-ai" ? "#17414d" : "",
// //               }}
// //               title={!isExpanded ? "R-AI" : ""}
// //             >
// //               {/* Clean Modern Message Icon */}

// //               <svg
// //                 className={`${!isExpanded ? "w-5 h-5" : "w-4 h-4"} shrink-0`}
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth={2.5}
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path d="M9.813 15.904L9 21L14.907 15.904L21 18L18 3L3 12L9.813 15.904Z" />
// //               </svg>
// //               {isExpanded && <span className="truncate">R-AI</span>}
// //             </Link>
// //           </div>
// //         </div>
// //         {/* Footer Version */}
// //         <div
// //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${
// //             isExpanded ? "opacity-100" : "opacity-0"
// //           }`}
// //         >
// //           <div className="text-[10px] text-gray-400 font-mono select-none">
// //             v{appVersion}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Background Overlay for mobile */}
// //       {isExpanded && (
// //         <div
// //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// //           onClick={() => setIsSidebarOpen(false)}
// //         ></div>
// //       )}
// //     </div>
// //   );
// // };

// // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// //     return null;
// //   }

// //   return (
// //     <Link
// //       to={path}
// //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${
// //         selected === path
// //           ? "text-white font-semibold"
// //           : "text-gray-500 hover:text-gray-900"
// //       }`}
// //       style={{
// //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// //       }}
// //       onClick={(e) => {
// //         e.preventDefault();
// //         onClick(path);
// //       }}
// //     >
// //       {label}
// //     </Link>
// //   );
// // };

// // export default NavigationSidebar;

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
//       pathname.includes("/dashboard/project-analysis-dash") ||
//       pathname.includes("/dashboard/labor-utilization-summary") ||
//       pathname.includes("/dashboard/reporting-screen"),
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
//       // Pricing paths included as they are under the same L1
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
//       pathname.includes("/dashboard/sub-enquiry-approval") ||
//       pathname.includes("/dashboard/sub-work-assign") ||
//       pathname.includes("/dashboard/sub-invoice-export") ||
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

//   // Update selected page when pathname changes
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
//               {canView("activeReport") && (
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
//                       {currentUserRole === "admin" &&
//                         (canView("forecastReport") ||
//                           canView("spendReport") ||
//                           canView("incomeStatement") ||
//                           canView("balanceSheet") ||
//                           canView("trendForecast")) && (
//                           <NavItem
//                             label="Executive Dashboard"
//                             path="/dashboard/project-report"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}

//                       {canView("activeReport") && (
//                         <NavItem
//                           label="Active Reports"
//                           path="/dashboard/reporting-screen"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Version Analysis"
//                           path="/dashboard/project-variance"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Project Console"
//                           path="/dashboard/project-analysis-dash"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {/* LEVEL 2 Sub-Group (3rd Level Trigger) */}
//                       {currentUserRole === "admin" && (
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
//                           <NavItem
//                             label="CFO Reports"
//                             path="/dashboard/cfo-bi-reports"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                           <NavItem
//                             label="Labor Utilization"
//                             path="/dashboard/cfo-bi-reports-labor"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                           <NavItem
//                             label="Total Company"
//                             path="/dashboard/total-company-bi-reports"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                           <NavItem
//                             label="Top 10 and Bottom 10 Projects"
//                             path="/dashboard/top10-bottom10-bi-reports"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                           <NavItem
//                             label="Current month Actuals Vs Forecast"
//                             path="/dashboard/current-month-actuals-vs-forecast"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         </NavSubGroup>
//                       )}
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
//                       Program Plan
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
//                   {currentUserRole === "admin" && (
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
//                         label="Labor Utilization"
//                         path="/dashboard/labor-utilization-summary"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     </NavSubGroup>
//                   )}
//                   {currentUserRole === "admin" && (
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
//                       {currentUserRole === "admin" &&
//                         canView("transferUtility") && (
//                           <NavItem
//                             label="Transfer Project Budget"
//                             path="/dashboard/create-project-budget"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                     </NavSubGroup>
//                   )}
//                 </div>
//               )}

//               {/* LEVEL 1: Opportunities & Pricing Section */}
//               {(canView("planOpportunity") || canView("impOpportunity")) && (
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
//                       {currentUserRole === "admin" && (
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
//                       {currentUserRole === "admin" && (
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

//               {/* LEVEL 1: Compliance (DCAA) */}
//               {currentUserRole === "admin" && (
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
//                           Compliance (DCAA)
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

//               {currentUserRole === "admin" && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() =>
//                         setSubContractorSectionOpen(!subContractorSectionOpen)
//                       }
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <Handshake className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Subcontractor Management
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (subContractorSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(subContractorSectionOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Create Timesheet"
//                           path="/dashboard/sub-create-timesheet"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Enquiry & Approval"
//                           path="/dashboard/sub-enquiry-approval"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Invoice Export"
//                           path="/dashboard/sub-invoice-export"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="PO Info"
//                           path="/dashboard/sub-po-info"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="PO Status"
//                           path="/dashboard/sub-pstaus"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Work Order"
//                           path="/dashboard/sub-work-assign"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Report"
//                           path="/dashboard/sub-report"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//               {/* LEVEL 1: Settings */}
//               {currentUserRole === "admin" &&
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
//               {currentUserRole === "admin" &&
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
//   // If a search term exists and the label doesn't match, hide it
//   if (searchTerm && !label.toLowerCase().includes(searchTerm.toLowerCase())) {
//     return null;
//   }

//   return (
//     <Link
//       to={path}
//       // Replaced 'truncate' with text wrapping classes to avoid '...' clipping
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

//     // Direct label match
//     if (child.props.label?.toLowerCase().includes(termLower)) {
//       return true;
//     }

//     // Recursive check for nested children
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

//   // Check if this subgroup or any nested item matches search term
//   const matchesSelf = searchTerm
//     ? label.toLowerCase().includes(searchTerm.toLowerCase())
//     : false;
//   const matchesNested = hasMatchingChild(children, searchTerm);

//   // Hide entire group if neither self nor nested children match during search
//   if (searchTerm && !matchesSelf && !matchesNested) {
//     return null;
//   }

//   // Force open when searching if there are matching contents
//   const shouldOpen = searchTerm ? matchesSelf || matchesNested : isOpen;

//   // Render children, passing down the search term
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
//           {/* Replaced 'truncate' with text wrapping for group header titles */}
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

// // // --- LEVEL 2 SUB-GROUP FOR LEVEL 3 NESTING ---
// // const NavSubGroup = ({ label, children, searchTerm, defaultOpen = false }) => {
// //   const [isOpen, setIsOpen] = useState(defaultOpen);

// //   // If searching, keep subgroup open if it has children
// //   const shouldOpen = searchTerm ? React.Children.count(children) > 0 : isOpen;

// //   // Count visible children based on search
// //   const visibleChildren = React.Children.toArray(children).filter((child) => {
// //     if (!searchTerm) return true;
// //     return child.props.label.toLowerCase().includes(searchTerm);
// //   });

// //   if (searchTerm && visibleChildren.length === 0) {
// //     return null;
// //   }

// //   return (
// //     <div className="space-y-1">
// //       {/* {!searchTerm && (
// //         <div
// //           className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer rounded-md transition-colors hover:bg-gray-50"
// //           onClick={() => setIsOpen(!isOpen)}
// //         >
// //           <span className="font-medium truncate" title={label}>{label}</span>
// //           {shouldOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
// //         </div>
// //       )} */}
// //       {!searchTerm && (
// //         <div
// //           className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer rounded-md transition-colors hover:bg-gray-50"
// //           onClick={() => setIsOpen(!isOpen)}
// //         >
// //           {/* Replaced 'truncate' with wrapping utilities + margin right */}
// //           <span
// //             className="font-medium break-words whitespace-normal leading-tight mr-2"
// //             title={label}
// //           >
// //             {label}
// //           </span>
// //           <span className="shrink-0">
// //             {shouldOpen ? (
// //               <ChevronDown size={12} />
// //             ) : (
// //               <ChevronRight size={12} />
// //             )}
// //           </span>
// //         </div>
// //       )}
// //       {shouldOpen && (
// //         <div className="ml-1 border-l border-gray-200 pl-2 space-y-1">
// //           {visibleChildren}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // --- INDIVIDUAL LEAF NAVIGATION ITEM ---
// // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// //     return null;
// //   }

// //   const isSelected = selected === path;

// //   return (
// //     <Link
// //       to={path}
// //       title={label}
// //       // className={`block px-3 py-1.5 text-xs transition-colors rounded-md truncate ${
// //       //   isSelected
// //       //     ? "text-white font-semibold"
// //       //     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
// //       // }`}
// //       className={`block px-3 py-2 text-xs transition-colors rounded-md truncate ${
// //         selected === path
// //           ? "text-white font-semibold"
// //           : "text-gray-500 hover:text-gray-900"
// //       }`}
// //       style={{
// //         backgroundColor: isSelected ? "#17414d" : "transparent",
// //       }}
// //       onClick={(e) => {
// //         // Only prevent default if you want to handle navigation manually via navigate()
// //         // Otherwise, let Link component handle it.
// //         // e.preventDefault();
// //         onClick(path);
// //       }}
// //     >
// //       {label}
// //     </Link>
// //   );
// // };

// export default NavigationSidebar;

// // import React, { useState, useEffect } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import {
// //   FileText,
// //   Home,
// //   Search,
// //   Clock,
// //   BarChart2,
// //   Briefcase,
// //   Users,
// //   Calculator,
// //   Settings as SettingsIcon,
// //   X,
// //   ChevronDown,
// //   ChevronRight,
// //   Pin,
// //   PinOff,
// //   Layers,
// //   LayoutDashboard,
// //   ShieldCheck,
// // } from "lucide-react";

// // // Helper Sub-Component for Nested Tree Groups
// // const NavSubGroup = ({ label, children, searchTerm, defaultOpen = false }) => {
// //   const [isOpen, setIsOpen] = useState(defaultOpen);

// //   useEffect(() => {
// //     if (searchTerm) setIsOpen(true);
// //   }, [searchTerm]);

// //   return (
// //     <div className="space-y-1 my-0.5">
// //       <div
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="flex items-center justify-between text-xs font-medium text-slate-700 py-1 px-2 hover:bg-slate-100 rounded cursor-pointer transition-colors"
// //       >
// //         <span>{label}</span>
// //         {isOpen ? (
// //           <ChevronDown size={14} className="text-slate-400" />
// //         ) : (
// //           <ChevronRight size={14} className="text-slate-400" />
// //         )}
// //       </div>
// //       {(isOpen || searchTerm) && (
// //         <div className="ml-3 pl-3 border-l border-slate-200 space-y-1">
// //           {children}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // Helper Sub-Component for Leaf Item Links
// // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// //   if (searchTerm && !label.toLowerCase().includes(searchTerm.toLowerCase())) {
// //     return null;
// //   }

// //   const isActive = selected === path;

// //   return (
// //     <div
// //       onClick={() => onClick(path)}
// //       className={`text-xs py-1 px-2 rounded cursor-pointer transition-colors block truncate font-normal ${
// //         isActive
// //           ? "bg-[#1d4ed8] text-white font-medium"
// //           : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
// //       }`}
// //     >
// //       {label}
// //     </div>
// //   );
// // };

// // const NavigationSidebar = ({
// //   setIsHovered,
// //   isHovered,
// //   setIsSidebarOpen,
// //   isSidebarOpen,
// //   canView,
// //   toggleLock,
// //   isLocked,
// // }) => {
// //   const { pathname } = useLocation();
// //   const navigate = useNavigate();

// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [activeTab, setActiveTab] = useState("accounting"); // Controls popout focus

// //   // Section States
// //   const [reportingOpen, setReportingOpen] = useState(true);
// //   const [configurationOpen, setConfigurationOpen] = useState(true);
// //   const [adminSetingOpen, setAdminSetingOpen] = useState(true);

// //   const [selectedPage, setSelectedPage] = useState(pathname);
// //   const [currentUserRole, setCurrentUserRole] = useState(null);

// //   useEffect(() => {
// //     const userString = localStorage.getItem("currentUser");
// //     if (userString) {
// //       try {
// //         const userObj = JSON.parse(userString);
// //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// //       } catch {
// //         setCurrentUserRole(null);
// //       }
// //     }
// //   }, []);

// //   useEffect(() => {
// //     setSelectedPage(pathname);
// //   }, [pathname]);

// //   const handleLinkClick = (pagePath) => {
// //     setSelectedPage(pagePath);
// //     navigate(pagePath);
// //   };

// //   const mainIcons = [
// //     { id: "documents", icon: FileText },
// //     { id: "home", icon: Home },
// //     { id: "search", icon: Search },
// //     { id: "history", icon: Clock },
// //     { id: "analytics", icon: BarChart2 },
// //     { id: "projects", icon: Briefcase },
// //     { id: "people", icon: Users },
// //     { id: "accounting", icon: Calculator },
// //   ];

// //   return (
// //     <div className="flex h-screen bg-slate-100 font-sans antialiased text-slate-800">
// //       {/* 1. Primary Left Icon Rail */}
// //       <div className="w-14 bg-white border-r border-slate-200 flex flex-col justify-between items-center py-3 z-30 shadow-sm">
// //         <div className="flex flex-col items-center gap-3 w-full">
// //           {mainIcons.map((item) => {
// //             const Icon = item.icon;
// //             const isActive = activeTab === item.id;
// //             return (
// //               <button
// //                 key={item.id}
// //                 onClick={() => {
// //                   setActiveTab(item.id);
// //                   setIsSidebarOpen(true);
// //                 }}
// //                 className={`p-2.5 rounded-lg transition-all ${
// //                   isActive
// //                     ? "bg-[#1c4eb8] text-white shadow-sm"
// //                     : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
// //                 }`}
// //               >
// //                 <Icon size={18} />
// //               </button>
// //             );
// //           })}
// //         </div>

// //         <div>
// //           <button
// //             onClick={() => {
// //               setActiveTab("settings");
// //               setIsSidebarOpen(true);
// //             }}
// //             className={`p-2.5 rounded-lg transition-colors ${
// //               activeTab === "settings"
// //                 ? "bg-[#1c4eb8] text-white"
// //                 : "text-slate-500 hover:bg-slate-100"
// //             }`}
// //           >
// //             <SettingsIcon size={18} />
// //           </button>
// //         </div>
// //       </div>

// //       {/* 2. Popout Drawer / Card */}
// //       {isSidebarOpen && (
// //         <div className="relative z-20 p-3">
// //           <div className="w-72 bg-white rounded-xl border border-slate-200 shadow-xl flex flex-col max-h-[95vh] overflow-hidden transition-all">
// //             {/* Modal Header */}
// //             <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
// //               <div className="flex items-center gap-2">
// //                 <div className="p-1.5 bg-[#1c4eb8] text-white rounded-md">
// //                   <Layers size={16} />
// //                 </div>
// //                 <span className="font-semibold text-sm text-slate-800 capitalize">
// //                   {activeTab}
// //                 </span>
// //               </div>
// //               <div className="flex items-center gap-1">
// //                 <button
// //                   type="button"
// //                   onClick={toggleLock}
// //                   className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
// //                   title={isLocked ? "Unlock" : "Lock"}
// //                 >
// //                   {isLocked ? (
// //                     <Pin className="w-3.5 h-3.5 fill-slate-600 text-slate-600" />
// //                   ) : (
// //                     <PinOff className="w-3.5 h-3.5" />
// //                   )}
// //                 </button>
// //                 <button
// //                   onClick={() => setIsSidebarOpen(false)}
// //                   className="p-1 text-slate-400 hover:text-slate-600 rounded"
// //                 >
// //                   <X size={16} />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Filter Search Input */}
// //             <div className="px-3 pt-3 pb-1">
// //               <input
// //                 type="text"
// //                 placeholder="Search menu..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
// //                 className="w-full border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
// //               />
// //             </div>

// //             {/* Tree Scroll Container */}
// //             <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-slate-300">
// //               {/* Dashboard & Reporting */}
// //               {canView("activeReport") && (
// //                 <div className="mb-2">
// //                   <div
// //                     className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer group"
// //                     onClick={() => setReportingOpen(!reportingOpen)}
// //                   >
// //                     <div className="flex items-center gap-2">
// //                       <LayoutDashboard size={15} className="text-slate-500" />
// //                       <span className="text-xs font-semibold text-slate-700">
// //                         General Ledger & Reports
// //                       </span>
// //                     </div>
// //                     {reportingOpen ? (
// //                       <ChevronDown size={14} className="text-slate-400" />
// //                     ) : (
// //                       <ChevronRight size={14} className="text-slate-400" />
// //                     )}
// //                   </div>

// //                   {(reportingOpen || searchTerm) && (
// //                     <div className="ml-3 pl-3 border-l border-slate-200 space-y-1 mt-1">
// //                       <NavSubGroup
// //                         label="Company Calendar"
// //                         searchTerm={searchTerm}
// //                       >
// //                         <NavItem
// //                           label="Fiscal Year"
// //                           path="/dashboard/project-report"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         <NavItem
// //                           label="Period"
// //                           path="/dashboard/reporting-screen"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         <NavItem
// //                           label="Subperiod"
// //                           path="/dashboard/project-variance"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       </NavSubGroup>

// //                       <NavSubGroup
// //                         label="Organizations"
// //                         searchTerm={searchTerm}
// //                       >
// //                         <NavItem
// //                           label="Organization Setup"
// //                           path="/dashboard/project-analysis-dash"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         <NavItem
// //                           label="User Define Label"
// //                           path="/dashboard/cfo-bi-reports"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       </NavSubGroup>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Settings Section */}
// //               {currentUserRole === "admin" && (
// //                 <div className="mb-2">
// //                   <div
// //                     className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer group"
// //                     onClick={() => setConfigurationOpen(!configurationOpen)}
// //                   >
// //                     <div className="flex items-center gap-2">
// //                       <Layers size={15} className="text-slate-500" />
// //                       <span className="text-xs font-semibold text-slate-700">
// //                         Configuration
// //                       </span>
// //                     </div>
// //                     {configurationOpen ? (
// //                       <ChevronDown size={14} className="text-slate-400" />
// //                     ) : (
// //                       <ChevronRight size={14} className="text-slate-400" />
// //                     )}
// //                   </div>

// //                   {(configurationOpen || searchTerm) && (
// //                     <div className="ml-3 pl-3 border-l border-slate-200 space-y-1 mt-1">
// //                       <NavItem
// //                         label="Global Configuration"
// //                         path="/dashboard/global-configuration"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                       <NavItem
// //                         label="Account Mapping"
// //                         path="/dashboard/account-mapping"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Administration Section */}
// //               {currentUserRole === "admin" && (
// //                 <div className="mb-2">
// //                   <div
// //                     className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer group"
// //                     onClick={() => setAdminSetingOpen(!adminSetingOpen)}
// //                   >
// //                     <div className="flex items-center gap-2">
// //                       <ShieldCheck size={15} className="text-slate-500" />
// //                       <span className="text-xs font-semibold text-slate-700">
// //                         Administration
// //                       </span>
// //                     </div>
// //                     {adminSetingOpen ? (
// //                       <ChevronDown size={14} className="text-slate-400" />
// //                     ) : (
// //                       <ChevronRight size={14} className="text-slate-400" />
// //                     )}
// //                   </div>

// //                   {(adminSetingOpen || searchTerm) && (
// //                     <div className="ml-3 pl-3 border-l border-slate-200 space-y-1 mt-1">
// //                       <NavItem
// //                         label="Manage Groups"
// //                         path="/dashboard/manage-groups"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                       <NavItem
// //                         label="Manage Users"
// //                         path="/dashboard/manage-users"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                       <NavItem
// //                         label="Manage Roles"
// //                         path="/dashboard/manage-roles"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default NavigationSidebar;

// /// Ne with erp style nav bar

// // import React, { useState, useEffect } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import {
// //   Menu,
// //   X,
// //   ChevronDown,
// //   ChevronRight,
// //   ChevronLeft,
// //   BarChart2,
// //   Layers,
// //   BriefcaseBusiness,
// //   Users,
// //   Home,
// //   LayoutDashboard,
// //   Star,
// //   Clock,
// //   Search,
// //   Settings,
// //   HomeIcon,
// //   Calculator,
// //   FileText,
// //   Trash2,
// //   CornerDownLeft,
// //   BarChart3,
// //   Target,
// //   CircleDollarSign,
// //   Gauge,
// //   TrendingUp,
// //   ShieldCheck,
// //   MessageCircle,
// // } from "lucide-react";

// // const NavigationSidebar = ({ canView, isSidebarOpen, setIsSidebarOpen }) => {
// //   const { pathname } = useLocation();
// //   const navigate = useNavigate();
// //   // const { recentPages, clearRecentPages } = useRecentStore();

// //   // State for collapse / expand matching sidebar.jsx
// //   const [isCollapsed, setIsCollapsed] = useState(true);

// //   // State for which main module is active/open in the flyout
// //   const [activeModule, setActiveModule] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [isRailHovered, setIsRailHovered] = useState(false);
// //   const [openSubMenus, setOpenSubMenus] = useState({});

// //   const HIDDEN_FEATURES =
// //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// //   const toggleSubMenu = (key) => {
// //     setOpenSubMenus((prev) => ({
// //       ...prev,
// //       [key]: !prev[key],
// //     }));
// //   };

// //   // Define the structure based on your current logic
// //   const modules = [
// //     {
// //       id: "bi-reports",
// //       label: "BI Reports",
// //       icon: <BarChart3 size={18} />,
// //       adminOnly: true,
// //       items: [
// //         {
// //           label: "CFO Reports",
// //           path: "/dashboard/cfo-bi-reports",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Labor Utilization",
// //           path: "/dashboard/cfo-bi-reports-labor",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Total Company",
// //           path: "/dashboard/total-company-bi-reports",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Top 10 and Bottom 10 Projects",
// //           path: "/dashboard/top10-bottom10-bi-reports",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Current month Actuals Vs Forecast",
// //           path: "/dashboard/current-month-actuals-vs-forecast",
// //           adminOnly: true,
// //         },
// //       ],
// //     },

// //     {
// //       id: "dashboard",
// //       label: "Dashboard",
// //       icon: <LayoutDashboard size={18} />,
// //       permission: "activeReport",
// //       items: [
// //         {
// //           label: "Dashboard",
// //           path: "/dashboard/project-report",
// //           adminOnly: true,
// //           permissions: [
// //             "forecastReport",
// //             "spendReport",
// //             "incomeStatement",
// //             "balanceSheet",
// //             "trendForecast",
// //           ],
// //         },
// //         {
// //           label: "Active Reports",
// //           path: "/dashboard/reporting-screen",
// //           permission: "activeReport",
// //         },
// //         {
// //           label: "Version Analysis",
// //           path: "/dashboard/project-variance",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Project Performance",
// //           path: "/dashboard/project-performance",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Project Console",
// //           path: "/dashboard/project-analysis-dash",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Labor Utilization",
// //           path: "/dashboard/labor-utilization-summary",
// //           adminOnly: true,
// //         },
// //       ],
// //     },

// //     {
// //       id: "projects",
// //       label: "Projects",
// //       icon: <BarChart2 size={18} />,
// //       items: [
// //         {
// //           label: "Plan Projects",
// //           path: "/dashboard/project-budget-status",
// //         },
// //         {
// //           label: "Quick Budget",
// //           path: "/dashboard/quick-budget",
// //           permission: "quickBudget",
// //         },
// //         {
// //           label: "Mass Utility",
// //           path: "/dashboard/mass-utility",
// //           permission: "massUtility",
// //         },
// //       ],
// //     },

// //     {
// //       id: "new-business",
// //       label: "New Businesses",
// //       icon: <BriefcaseBusiness size={18} />,
// //       permissions: ["manageNewBusiness", "planNewBusiness"],
// //       items: [
// //         {
// //           label: "Manage New Business",
// //           path: "/dashboard/new-business",
// //           permission: "manageNewBusiness",
// //         },
// //         {
// //           label: "Plan New Businesses",
// //           path: "/dashboard/nb-project",
// //           permission: "planNewBusiness",
// //         },
// //         {
// //           label: "Transfer Project Budget",
// //           path: "/dashboard/create-project-budget",
// //           permission: "transferUtility",
// //           adminOnly: true,
// //         },
// //       ],
// //     },

// //     {
// //       id: "opportunities",
// //       label: "Opportunities",
// //       icon: <Target size={18} />,
// //       permissions: ["planOpportunity", "impOpportunity"],
// //       items: [
// //         {
// //           label: "Import Opportunities",
// //           path: "/dashboard/import-opportunity",
// //           permission: "impOpportunity",
// //         },
// //         {
// //           label: "Plan Opportunities",
// //           path: "/dashboard/opp-project",
// //           permission: "planOpportunity",
// //         },
// //         {
// //           label: "NBIs Analogous Rate",
// //           path: "/dashboard/analog-rate",
// //           permission: "analogRate",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "NBIs Parametric Rate",
// //           path: "/dashboard/parametric-rate",
// //           permission: "parametricRate",
// //           adminOnly: true,
// //         },
// //       ],
// //     },

// //     {
// //       id: "contract-pricing",
// //       label: "Contract Pricing",
// //       icon: <CircleDollarSign size={18} />,
// //       adminOnly: true,
// //       items: [
// //         {
// //           label: "Contract Setup",
// //           path: "/dashboard/pricing-new-business",
// //           permission: "manageNewBusiness",
// //         },
// //         {
// //           label: "Proposal Builder",
// //           path: "/dashboard/pricing-nb-project",
// //           permission: "planNewBusiness",
// //         },
// //         {
// //           label: "Pricing Studio",
// //           path: "/dashboard/pricing",
// //           adminOnly: true,
// //         },
// //         {
// //           label: "Mass Utility",
// //           path: "/dashboard/pricing-mass-utility",
// //           permission: "massUtility",
// //         },
// //         {
// //           label: "Rate Configuration",
// //           path: "/dashboard/pricing-rate-configure",
// //           permission: "poolRateTabs",
// //         },
// //       ],
// //     },

// //     {
// //       id: "provisional-billing-rate",
// //       label: "Provisional Billing Rate",
// //       icon: <Gauge size={18} />,
// //       adminOnly: true,
// //       items: [
// //         {
// //           label: "PBR Package",
// //           path: "/dashboard/pbr-report",
// //           adminOnly: true,
// //         },
// //       ],
// //     },

// //     {
// //       id: "ice",
// //       label: "ICE",
// //       icon: <Calculator size={18} />,
// //       adminOnly: true,
// //       items: [
// //         {
// //           label: "ICE",
// //           path: "/dashboard/ice-tabs",
// //           adminOnly: true,
// //         },
// //       ],
// //     },

// //     {
// //       id: "forecast-rates",
// //       label: "Forecast Rates",
// //       icon: <TrendingUp size={18} />,
// //       adminOnly: true,
// //       permissions: ["poolRateTabs", "rateComputation"],
// //       items: [
// //         {
// //           label: "Rate Configuration",
// //           path: "/dashboard/pool-rate-tabs",
// //           permission: "poolRateTabs",
// //         },
// //         {
// //           label: "Rate Computation",
// //           path: "/dashboard/rate-configure",
// //           permission: "rateComputation",
// //         },
// //       ],
// //     },

// //     {
// //       id: "settings",
// //       label: "Settings",
// //       icon: <Layers size={18} />,
// //       adminOnly: true,
// //       permissions: [
// //         "globalConfiguration",
// //         "projectOrgSecurity",
// //         "accountMapping",
// //         "ceilingConfiguration",
// //         "fiscalYearPeriods",
// //         "annualHolidays",
// //         "prospectiveIdSetup",
// //       ],
// //       items: [
// //         {
// //           label: "Configuration Settings",
// //           path: "/dashboard/global-configuration",
// //           permission: "globalConfiguration",
// //         },
// //         {
// //           label: "Access Mapping",
// //           path: "/dashboard/projectmapping",
// //           permission: "projectOrgSecurity",
// //         },
// //         {
// //           label: "Account Mapping",
// //           path: "/dashboard/account-mapping",
// //           permission: "accountMapping",
// //         },
// //         {
// //           label: "Ceiling Configuration",
// //           path: "/dashboard/ceiling-configuration",
// //           permission: "ceilingConfiguration",
// //         },
// //         {
// //           label: "Fiscal Year Periods",
// //           path: "/dashboard/maintain-fiscal-year-periods",
// //           permission: "fiscalYearPeriods",
// //         },
// //         {
// //           label: "Annual Holidays",
// //           path: "/dashboard/annual-holidays",
// //           permission: "annualHolidays",
// //         },
// //         {
// //           label: "Prospective ID Setup",
// //           path: "/dashboard/prospective-id-setup",
// //           permission: "prospectiveIdSetup",
// //         },
// //       ],
// //     },

// //     {
// //       id: "admin",
// //       label: "Admin",
// //       icon: <ShieldCheck size={18} />,
// //       adminOnly: true,
// //       permissions: ["manageGroups", "manageUser", "roleRights"],
// //       items: [
// //         {
// //           label: "Manage Groups",
// //           path: "/dashboard/manage-groups",
// //           permission: "manageGroups",
// //         },
// //         {
// //           label: "Manage Users",
// //           path: "/dashboard/manage-users",
// //           permission: "manageUser",
// //         },
// //         {
// //           label: "Manage Roles",
// //           path: "/dashboard/manage-roles",
// //           permission: "manageUser",
// //         },
// //       ],
// //     },
// //   ];

// //   const Admin = [
// //     {
// //       id: "r-ai",
// //       label: "R-AI",
// //       path: "/dashboard/our-ai",
// //       icon: <MessageCircle size={18} />,
// //     },
// //   ];

// //   const handleLinkClick = (path) => {
// //     if (!path) return;

// //     navigate(path);
// //     setActiveModule(null);
// //     setSearchTerm("");
// //   };

// //   const isExpanded = !isCollapsed || isRailHovered;

// //   const toggleCollapse = () => {
// //     setIsCollapsed((prev) => {
// //       const next = !prev;
// //       if (setIsSidebarOpen) setIsSidebarOpen(!next);
// //       return next;
// //     });
// //   };

// //   return (
// //     <div className="flex fixed inset-y-0 left-0 items-center ml-1 mt-5 z-50 font-sans pointer-events-none">
// //       {/* PANEL 1: STATIC ICON RAIL */}
// //       <div
// //         onMouseEnter={() => setIsRailHovered(true)}
// //         onMouseLeave={() => setIsRailHovered(false)}
// //         className={`h-[90%] bg-white rounded-xl border border-slate-200/90 flex flex-col items-center py-2.5 shadow-lg pointer-events-auto transition-all ease-in-out duration-300 ${
// //           isExpanded ? "w-48 px-2" : "w-14 px-1"
// //         }`}
// //       >
// //         {/* Rail Branding Header with Chevron Toggle Button */}
// //         <div className="w-full px-1.5 pt-0.5 pb-2 border-b border-slate-200/80 flex items-center justify-between overflow-hidden select-none mb-1">
// //           <div className="flex items-center gap-2 min-w-0">
// //             <div className="w-8 h-8 min-w-[32px] bg-[#17414d] rounded-lg flex items-center justify-center shadow-xs">
// //               <FileText className="h-4 w-4 text-white" />
// //             </div>
// //             <div
// //               className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
// //                 isExpanded
// //                   ? "opacity-100 w-auto"
// //                   : "opacity-0 w-0 pointer-events-none"
// //               }`}
// //             >
// //               <h2 className="font-bold text-xs text-slate-800 tracking-tight">
// //                 FinAxis ERP
// //               </h2>
// //             </div>
// //           </div>
// //           {isExpanded && (
// //             <button
// //               onClick={toggleCollapse}
// //               className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer shrink-0"
// //               title={isCollapsed ? "Pin sidebar open" : "Collapse sidebar"}
// //             >
// //               <ChevronLeft
// //                 className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
// //               />
// //             </button>
// //           )}
// //         </div>

// //         {/* Dynamic Modules */}
// //         <div className="flex flex-col h-full w-full justify-between overflow-y-auto custom-scrollbar">
// //           <div>
// //             {/* <RailIcon
// //               icon={<HomeIcon size={18} />}
// //               isHovered={isExpanded}
// //               active={pathname === "/dashboard"}
// //               label="Home"
// //               onClick={() => {
// //                 setActiveModule(null); // Close any open flyouts
// //                 navigate("/dashboard");
// //               }}
// //             />

// //             <div className="flex justify-center py-0.5">
// //               <div
// //                 className={`h-[1px] bg-slate-200 transition-all duration-300 ${
// //                   isExpanded ? "w-full mx-2" : "w-6"
// //                 }`}
// //               />
// //             </div> */}

// //             <RailIcon
// //               icon={<Search size={18} />}
// //               label="Search"
// //               isHovered={isExpanded}
// //               active={activeModule === "global-search"}
// //               onClick={() => {
// //                 setSearchTerm("");
// //                 setActiveModule(
// //                   activeModule === "global-search" ? null : "global-search",
// //                 );
// //               }}
// //             />
// //             {/* <RailIcon
// //               icon={<Clock size={18} />}
// //               label="Recent"
// //               isHovered={isExpanded}
// //               active={activeModule === "recent-history"}
// //               onClick={() => {
// //                 setSearchTerm("");
// //                 setActiveModule(
// //                   activeModule === "recent-history" ? null : "recent-history",
// //                 );
// //               }}
// //             /> */}
// //             {modules.map((mod) => (
// //               <RailIcon
// //                 key={mod.id}
// //                 icon={mod.icon}
// //                 label={mod.label}
// //                 active={
// //                   mod.path ? pathname === mod.path : activeModule === mod.id
// //                 }
// //                 isHovered={isExpanded}
// //                 onClick={() => {
// //                   // Direct navigation when there are no child items
// //                   if (!mod.items || mod.items.length === 0) {
// //                     handleLinkClick(mod.path);
// //                     return;
// //                   }

// //                   // Open flyout when module has children
// //                   setSearchTerm("");
// //                   setActiveModule(activeModule === mod.id ? null : mod.id);
// //                 }}
// //               />
// //             ))}
// //           </div>
// //           <div className="pt-2 border-t border-slate-200/80">
// //             {Admin.map((mod) => (
// //               <RailIcon
// //                 key={mod.id}
// //                 icon={mod.icon}
// //                 label={mod.label}
// //                 active={pathname === mod.path}
// //                 isHovered={isExpanded}
// //                 onClick={() => {
// //                   // If module has no items, navigate directly
// //                   if (!mod.items || mod.items.length === 0) {
// //                     handleLinkClick(mod.path);
// //                     return;
// //                   }

// //                   // Otherwise open flyout
// //                   setSearchTerm("");
// //                   setActiveModule(activeModule === mod.id ? null : mod.id);
// //                 }}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* PANEL 2: THE FLYOUT (Triggered by activeModule) */}
// //       {activeModule && (
// //         <div className="flex items-center h-[80%] ml-1 pointer-events-auto">
// //           {/* Backdrop to close when clicking away */}
// //           <div
// //             className="fixed inset-0 bg-transparent z-[-1]"
// //             onClick={() => {
// //               setSearchTerm("");
// //               setActiveModule(null);
// //             }}
// //           />

// //           <div className="relative w-64 bg-white shadow-2xl border border-slate-200/90 rounded-xl flex flex-col animate-in slide-in-from-left-2 duration-200 h-full z-100 overflow-hidden">
// //             {/* Header */}
// //             <div className="p-3.5 border-b border-slate-200/80 flex justify-between items-center bg-[#17414d]/5 select-none">
// //               <div className="flex items-center gap-2 min-w-0">
// //                 <div className="w-6 h-6 min-w-[24px] bg-[#17414d] rounded-md flex items-center justify-center shadow-2xs">
// //                   {activeModule === "recent-history" ? (
// //                     <Clock size={13} className="text-white" />
// //                   ) : (
// //                     <Layers size={13} className="text-white" />
// //                   )}
// //                 </div>
// //                 <div className="min-w-0">
// //                   <h2 className="text-xs font-bold text-slate-800 tracking-wide truncate">
// //                     {activeModule === "recent-history"
// //                       ? "Recent Pages"
// //                       : [...modules, ...Admin].find(
// //                           (m) => m.id === activeModule,
// //                         )?.label ||
// //                         (activeModule === "global-search"
// //                           ? "Global Search"
// //                           : "Menu")}
// //                   </h2>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => {
// //                   setSearchTerm("");
// //                   setActiveModule(null);
// //                 }}
// //                 className="p-1 hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
// //               >
// //                 <X size={14} />
// //               </button>
// //             </div>

// //             <div className="p-3 flex-1 flex flex-col min-h-0">
// //               {/* Search Bar */}
// //               {(activeModule === "global-search" ||
// //                 activeModule === "recent-history") && (
// //                 <div className="relative mb-3">
// //                   <Search
// //                     className="absolute left-3 top-2.5 text-slate-400"
// //                     size={14}
// //                   />
// //                   <input
// //                     className="w-full bg-slate-50 border border-slate-200/90 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#17414d]/30 focus:border-[#17414d] transition-all"
// //                     placeholder={
// //                       activeModule === "recent-history"
// //                         ? "Filter recent pages..."
// //                         : "Quick find..."
// //                     }
// //                     autoFocus
// //                     value={searchTerm}
// //                     onChange={(e) =>
// //                       setSearchTerm(e.target.value.toLowerCase())
// //                     }
// //                   />
// //                 </div>
// //               )}
// //               <nav className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
// //                 {(activeModule === "global-search"
// //                   ? [...modules, ...Admin]
// //                   : [[...modules, ...Admin].find((m) => m.id === activeModule)]
// //                 )
// //                   .filter(Boolean)
// //                   .map((section) => {
// //                     const isSearching =
// //                       activeModule === "global-search" &&
// //                       Boolean(searchTerm.trim());
// //                     const filteredItems = (section.items || []).filter(
// //                       (item) => {
// //                         const hasPerm =
// //                           !item.permission ||
// //                           (typeof canView === "function"
// //                             ? canView(item.permission)
// //                             : true);
// //                         const notHidden = !isHidden(item.permission);
// //                         const matchSearch = isSearching
// //                           ? item.label
// //                               .toLowerCase()
// //                               .includes(searchTerm.trim().toLowerCase())
// //                           : true;
// //                         return hasPerm && notHidden && matchSearch;
// //                       },
// //                     );

// //                     if (filteredItems.length === 0) return null;

// //                     return (
// //                       <div key={section.id} className="space-y-1">
// //                         {activeModule === "global-search" && (
// //                           <div className="px-3 py-1 text-[10px] font-semibold text-[#17414d] uppercase tracking-wider">
// //                             {section.label}
// //                           </div>
// //                         )}

// //                         {filteredItems.map((item) => {
// //                           const hasSubItems = item.subItems?.length > 0;
// //                           const itemKey = item.path || item.label;
// //                           const isSubOpen = openSubMenus[itemKey];

// //                           return (
// //                             <div key={itemKey} className="flex flex-col">
// //                               {/* LEVEL 1 */}
// //                               <button
// //                                 onClick={() =>
// //                                   hasSubItems
// //                                     ? toggleSubMenu(itemKey)
// //                                     : handleLinkClick(item.path)
// //                                 }
// //                                 className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
// //                                   pathname === item.path
// //                                     ? "bg-[#17414d] text-white shadow-xs font-semibold"
// //                                     : "text-slate-700 hover:bg-[#17414d]/10 hover:text-[#17414d]"
// //                                 }`}
// //                               >
// //                                 <span className="truncate">{item.label}</span>

// //                                 {hasSubItems && (
// //                                   <ChevronRight
// //                                     size={14}
// //                                     className={`transition-transform duration-200 ${
// //                                       isSubOpen
// //                                         ? "rotate-90 text-[#17414d]"
// //                                         : "text-slate-400"
// //                                     }`}
// //                                   />
// //                                 )}
// //                               </button>

// //                               {/* LEVEL 2 */}
// //                               {hasSubItems && isSubOpen && (
// //                                 <div className="ml-3 mt-1 space-y-1 pl-2 border-l border-slate-200/80 animate-in slide-in-from-top-1">
// //                                   {item.subItems.map((sub) => {
// //                                     const hasNested = sub.subItems?.length > 0;
// //                                     const subKey = sub.path || sub.label;
// //                                     const isNestedOpen = openSubMenus[subKey];

// //                                     // ✅ NORMAL SUB ITEM
// //                                     if (!hasNested) {
// //                                       return (
// //                                         <button
// //                                           key={subKey}
// //                                           onClick={() =>
// //                                             handleLinkClick(sub.path)
// //                                           }
// //                                           className={`w-full text-left px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
// //                                             pathname === sub.path
// //                                               ? "bg-[#17414d] text-white font-semibold shadow-2xs"
// //                                               : "text-slate-600 hover:text-[#17414d] hover:bg-[#17414d]/10"
// //                                           }`}
// //                                         >
// //                                           {sub.label}
// //                                         </button>
// //                                       );
// //                                     }

// //                                     // ✅ LEVEL 3 DROPDOWN
// //                                     return (
// //                                       <div
// //                                         key={subKey}
// //                                         className="flex flex-col"
// //                                       >
// //                                         <button
// //                                           onClick={() => toggleSubMenu(subKey)}
// //                                           className="w-full flex items-center justify-between px-3.5 py-1.5 text-[11px] font-medium text-slate-600 hover:text-[#17414d] hover:bg-[#17414d]/10 rounded-lg cursor-pointer transition-all"
// //                                         >
// //                                           <span>{sub.label}</span>

// //                                           <ChevronRight
// //                                             size={12}
// //                                             className={`transition-transform duration-200 ${
// //                                               isNestedOpen
// //                                                 ? "rotate-90 text-[#17414d]"
// //                                                 : "text-slate-400"
// //                                             }`}
// //                                           />
// //                                         </button>

// //                                         {isNestedOpen && (
// //                                           <div className="ml-3 mt-1 space-y-1 pl-2 border-l border-slate-200/60">
// //                                             {sub.subItems.map((deep) => (
// //                                               <button
// //                                                 key={deep.path}
// //                                                 onClick={() =>
// //                                                   handleLinkClick(deep.path)
// //                                                 }
// //                                                 className={`w-full text-left px-3.5 py-1 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
// //                                                   pathname === deep.path
// //                                                     ? "bg-[#17414d] text-white font-semibold"
// //                                                     : "text-slate-500 hover:text-[#17414d] hover:bg-[#17414d]/10"
// //                                                 }`}
// //                                               >
// //                                                 {deep.label}
// //                                               </button>
// //                                             ))}
// //                                           </div>
// //                                         )}
// //                                       </div>
// //                                     );
// //                                   })}
// //                                 </div>
// //                               )}
// //                             </div>
// //                           );
// //                         })}
// //                       </div>
// //                     );
// //                   })}
// //               </nav>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // /* Sub-component for the Rail Icons */
// // const RailIcon = ({ icon, label, onClick, active, isHovered }) => (
// //   <div className="flex flex-col mb-1.5 items-center w-full px-1.5">
// //     <button
// //       onClick={onClick}
// //       className={`w-full flex items-center cursor-pointer p-2 rounded-lg transition-all duration-200 group relative whitespace-nowrap ${
// //         active
// //           ? "bg-[#17414d] text-white shadow-xs font-semibold"
// //           : "text-slate-600 hover:bg-[#17414d]/10 hover:text-[#17414d]"
// //       }`}
// //     >
// //       <div className="min-w-[20px] h-4 flex items-center justify-center">
// //         {icon}
// //       </div>

// //       <div
// //         className={`ml-2.5 transition-all duration-200 overflow-hidden  ${
// //           isHovered ? "opacity-100 w-auto" : "opacity-0 w-0 pointer-events-none"
// //         }`}
// //       >
// //         <span className="text-xs font-medium tracking-wide">{label}</span>
// //       </div>
// //     </button>
// //   </div>
// // );

// // export default NavigationSidebar;
// import React, { useState, useEffect } from "react";
// import {
//   Link,
//   useLocation,
//   useNavigate,
//   useOutletContext,
// } from "react-router-dom";

// import {
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   Plus,
//   Minus,
//   BarChart2,
//   Layers,
//   FileText,
//   Settings,
//   BriefcaseBusiness,
//   SlidersHorizontal,
//   LayoutDashboard,
//   TrendingUp, // For Reporting/Dashboard
//   Target,
//   Users,
//   Percent, // new icon for New Business Budget section
// } from "lucide-react";

// const NavigationSidebar = ({
//   setIsHovered,
//   isHovered,
//   setIsSidebarOpen,
//   isSidebarOpen,
//   visibility, // <-- Added
//   canView, // <-- Added
//   canEdit,
// }) => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   const [onHoverChange, setOnhoverChange] = useState(false);

//   // const { visibility, canView, canEdit } = useOutletContext();

//   const [searchTerm, setSearchTerm] = useState("");

//   // --- ALL ORIGINAL LOGIC PRESERVED ---
//   const [generalMenuOpen, setGeneralMenuOpen] = useState(
//     pathname.includes("/dashboard/project-budget-status") ||
//       pathname.includes("/dashboard/nb-project") ||
//       pathname.includes("/dashboard/opp-project") ||
//       pathname.includes("/dashboard/new-business") ||
//       pathname.includes("/dashboard/pool-rate-tabs") ||
//       pathname.includes("/dashboard/pool-configuration") ||
//       pathname.includes("/dashboard/template-pool-mapping") ||
//       pathname.includes("/dashboard/template") ||
//       pathname.includes("/dashboard/ceiling-configuration") ||
//       pathname.includes("/dashboard/global-configuration") ||
//       pathname.includes("/dashboard/prospective-id-setup") ||
//       pathname.includes("/dashboard/display-settings") ||
//       pathname.includes("/dashboard/annual-holidays") ||
//       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//       pathname.includes("/dashboard/analog-rate") ||
//       pathname.includes("/dashboard/parametric-rate") ||
//       pathname.includes("/dashboard/project-report") ||
//       pathname.includes("/dashboard/reporting-screen") ||
//       pathname.includes("/dashboard/role-rights") ||
//       pathname.includes("/dashboard/mass-utility") ||
//       pathname.includes("/dashboard/quick-budget") ||
//       pathname.includes("/dashboard/import-utility") ||
//       pathname.includes("/dashboard/account-mapping") ||
//       pathname.includes("/dashboard/projectmapping") ||
//       pathname.includes("/dashboard/monthly-forecast") ||
//       pathname.includes("/dashboard/create-project-budget") ||
//       pathname.includes("/dashboard/import-opportunity") ||
//       pathname.includes("/dashboard/manage-users") ||
//       pathname.includes("/dashboard/manage-groups") ||
//       pathname.includes("/dashboard/override-settings") ||
//       pathname.includes("/dashboard/rate-configure") ||
//       pathname.includes("/dashboard/pbr"),
//   );

//   const [planningOpen, setPlanningOpen] = useState(
//     pathname.includes("/dashboard/project-budget-status") ||
//       pathname.includes("/dashboard/mass-utility") ||
//       pathname.includes("/dashboard/quick-budget"),
//   );

//   const [configurationOpen, setConfigurationOpen] = useState(
//     pathname.includes("/dashboard/global-configuration") ||
//       pathname.includes("/dashboard/projectmapping") ||
//       pathname.includes("/dashboard/account-mapping") ||
//       pathname.includes("/dashboard/ceiling-configuration") ||
//       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//       pathname.includes("/dashboard/annual-holidays") ||
//       pathname.includes("/dashboard/prospective-id-setup") ||
//       pathname.includes("/dashboard/manage-groups") ||
//       pathname.includes("/dashboard/manage-users"),
//   );

//   // const [poolMappingOpen, setPoolMappingOpen] = useState(
//   //   pathname.includes("/dashboard/pool-configuration") ||
//   //     pathname.includes("/dashboard/template-pool-mapping") ||
//   //     pathname.includes("/dashboard/rate-configure")
//   // );

//   // NEW: New Business Budget section open state
//   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
//     pathname.includes("/dashboard/new-business") ||
//       pathname.includes("/dashboard/nb-project") ||
//       pathname.includes("/dashboard/create-project-budget"),
//   );

//   const [oppSectionOpen, setOppSectionOpen] = useState(
//     pathname.includes("/dashboard/import-opportunity") ||
//       pathname.includes("/dashboard/opp-project") ||
//       pathname.includes("/dashboard/parametric-rate") ||
//       pathname.includes("/dashboard/analog-rate"),
//   );

//   const [reportingOpen, setReportingOpen] = useState(
//     pathname.includes("/dashboard/project-report"),
//     pathname.includes("/dashboard/reporting-screen"),
//   );
//   const [rateOpen, setRateOpen] = useState(
//     pathname.includes("/dashboard/pool-rate-tabs") ||
//       pathname.includes("/dashboard/rate-configure"),
//   );
//   const [pbrOpen, setPbrOpen] = useState(pathname.includes("/dashboard/pbr"));

//   // NEW: Manage (Users & Groups) section open state
//   // const [manageSectionOpen, setManageSectionOpen] = useState(
//   //   pathname.includes("/dashboard/manage-users") ||
//   //     pathname.includes("/dashboard/manage-groups") ||
//   //     pathname.includes("/dashboard/rate-configure")
//   // );

//   // const [manageSettingOpen, setManageSettingOpen] = useState(
//   //   pathname.includes("/dashboard/global-configuration") ||
//   //     pathname.includes("/dashboard/display-settings") ||
//   //     pathname.includes("/dashboard/rate-configure")
//   // );

//   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedPage, setSelectedPage] = useState(pathname);
//   const [currentUserRole, setCurrentUserRole] = useState(null);
//   const [userName, setUserName] = useState("");

//   // hover state (existing)
//   // const [isHovered, setIsHovered] = useState(false);

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

//   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
//   const isExpanded = isSidebarOpen || isHovered;
//   useEffect(() => {
//     setSelectedPage(pathname);

//     if (currentUserRole === "admin") {
//       setGeneralMenuOpen(
//         pathname.includes("/dashboard/project-budget-status") ||
//           pathname.includes("/dashboard/nb-project") ||
//           pathname.includes("/dashboard/opp-project") ||
//           pathname.includes("/dashboard/new-business") ||
//           pathname.includes("/dashboard/pool-rate-tabs") ||
//           pathname.includes("/dashboard/pool-configuration") ||
//           pathname.includes("/dashboard/template-pool-mapping") ||
//           pathname.includes("/dashboard/template") ||
//           pathname.includes("/dashboard/ceiling-configuration") ||
//           pathname.includes("/dashboard/global-configuration") ||
//           pathname.includes("/dashboard/prospective-id-setup") ||
//           pathname.includes("/dashboard/display-settings") ||
//           pathname.includes("/dashboard/annual-holidays") ||
//           pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//           pathname.includes("/dashboard/analog-rate") ||
//           pathname.includes("/dashboard/parametric-rate") ||
//           pathname.includes("/dashboard/project-report") ||
//           pathname.includes("/dashboard/reporting-screen") ||
//           pathname.includes("/dashboard/role-rights") ||
//           pathname.includes("/dashboard/mass-utility") ||
//           pathname.includes("/dashboard/quick-budget") ||
//           pathname.includes("/dashboard/import-utility") ||
//           pathname.includes("/dashboard/account-mapping") ||
//           pathname.includes("/dashboard/projectmapping") ||
//           pathname.includes("/dashboard/monthly-forecast") ||
//           pathname.includes("/dashboard/create-project-budget") ||
//           pathname.includes("/dashboard/import-opportunity") ||
//           pathname.includes("/dashboard/manage-users") ||
//           pathname.includes("/dashboard/manage-groups") ||
//           pathname.includes("/dashboard/override-settings") ||
//           pathname.includes("/dashboard/rate-configure") ||
//           pathname.includes("/dashboard/pbr"),
//       );
//       setPlanningOpen(
//         pathname.includes("/dashboard/project-budget-status") ||
//           pathname.includes("/dashboard/quick-budget") ||
//           pathname.includes("/dashboard/mass-utility"),
//       );
//       setConfigurationOpen(
//         pathname.includes("/dashboard/global-configuration") ||
//           pathname.includes("/dashboard/projectmapping") ||
//           pathname.includes("/dashboard/account-mapping") ||
//           pathname.includes("/dashboard/ceiling-configuration") ||
//           pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//           pathname.includes("/dashboard/annual-holidays") ||
//           pathname.includes("/dashboard/prospective-id-setup") ||
//           pathname.includes("/dashboard/manage-groups") ||
//           pathname.includes("/dashboard/manage-users"),
//       );
//       //   setPoolMappingOpen(
//       //     pathname.includes("/dashboard/pool-configuration") ||
//       //     pathname.includes("/dashboard/nb-project") ||
//       // pathname.includes("/dashboard/opp-project") ||
//       //       pathname.includes("/dashboard/template-pool-mapping") ||
//       //   pathname.includes("/dashboard/rate-configure")
//       //   );
//       setNewBusinessSectionOpen(
//         pathname.includes("/dashboard/new-business") ||
//           pathname.includes("/dashboard/nb-project") ||
//           pathname.includes("/dashboard/create-project-budget"),
//       );
//       setReportingOpen(
//         pathname.includes("/dashboard/project-report") ||
//           pathname.includes("/dashboard/reporting-screen"),
//       );
//       setRateOpen(
//         pathname.includes("/dashboard/pool-rate-tabs") ||
//           pathname.includes("/dashboard/rate-configure"),
//       );
//       setPbrOpen(pathname.includes("/dashboard/pbr"));
//       setOppSectionOpen(
//         pathname.includes("/dashboard/import-opportunity") ||
//           pathname.includes("/dashboard/opp-project") ||
//           pathname.includes("/dashboard/parametric-rate") ||
//           pathname.includes("/dashboard/analog-rate"),
//       );
//       //   setManageSectionOpen(
//       //     pathname.includes("/dashboard/manage-users") ||
//       //     pathname.includes("/dashboard/nb-project") ||
//       // pathname.includes("/dashboard/opp-project") ||
//       //       pathname.includes("/dashboard/manage-groups") ||
//       //   pathname.includes("/dashboard/rate-configure")
//       //   );
//     } else if (currentUserRole === "user" || currentUserRole === "User") {
//       const isProjectBudget =
//         pathname.includes("/dashboard/project-budget-status") ||
//         pathname.includes("/dashboard/project-report") ||
//         pathname.includes("/dashboard/reporting-screen") ||
//         pathname.includes("/dashboard/mass-utility") ||
//         pathname.includes("/dashboard/quick-budget") ||
//         pathname.includes("/dashboard/import-utility") ||
//         pathname.includes("dashboard/new-business") ||
//         pathname.includes("/dashboard/nb-project") ||
//         pathname.includes("/dashboard/opp-project") ||
//         pathname.includes("/dashboard/rate-configure") ||
//         pathname.includes("/dashboard/pbr");
//       setGeneralMenuOpen(isProjectBudget);
//       setPlanningOpen(isProjectBudget);
//       setConfigurationOpen(false);
//       setPoolMappingOpen(false);
//       setNewBusinessSectionOpen(false);
//       setReportingOpen(false);
//       setRateOpen(false);
//       setPbrOpen(false);
//       setOppSectionOpen(false);
//       setManageSectionOpen(false);

//       if (!isProjectBudget) {
//         navigate("/dashboard/project-budget-status");
//       }
//     }
//   }, [pathname, currentUserRole, navigate]);

//   const handleLinkClick = (pagePath) => {
//     setSelectedPage(pagePath);
//     navigate(pagePath);
//     if (isSidebarOpen) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const handleCloseSidebar = () => {
//     setSearchTerm("");
//     setIsSidebarOpen(false);
//   };
//   const handleOpenSidebar = () => {
//     setIsSidebarOpen(true);
//   };

//   return (
//     <div
//       // onMouseOver={handleOpenSidebar}
//       // onMouseLeave={handleCloseSidebar}
//       className="flex min-h-screen font-inter"
//     >
//       {/* Mobile Toggle */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
//         onClick={() => setIsSidebarOpen(!isExpanded)}
//       >
//         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>

//       {/* Sidebar - Hover to expand */}
//       <div
//         // onMouseEnter={() => setIsHovered(true)}
//         // onMouseLeave={() => setIsHovered(false)}
//         // className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm
//         //   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         //   md:translate-x-0
//         //   w-14 hover:w-55
//         // `}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className={`fixed inset-y-0 left-0 z-40 flex flex-col
//       bg-white border-r border-gray-200
//       transition-all duration-300 ease-in-out shadow-sm
//       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
//       md:translate-x-0

//     `}
//       >
//         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4">
//           {/* Menu / General Toggle Section */}
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
//               {/* --- PLANNING SECTION --- */}
//               <div>
//                 <div
//                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) =>
//                       setSearchTerm(e.target.value.toLowerCase())
//                     }
//                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
//                   />
//                 </div>

//                 {/* Dashboard */}
//                 {/* {canView("reports") && ( */}
//                 {(canView("forecastReport") ||
//                   canView("spendReport") ||
//                   canView("incomeStatement") ||
//                   canView("balanceSheet") ||
//                   canView("trendForecast") ||
//                   canView("activeReport")) && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() => setReportingOpen(!reportingOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <LayoutDashboard className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                               isExpanded ? "opacity-100" : "opacity-0"
//                             }`}
//                           >
//                             Dashboard
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (reportingOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}
//                     {(reportingOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                         {/* {canView("reports") && ( */}
//                         <>
//                           {(canView("forecastReport") ||
//                             canView("spendReport") ||
//                             canView("incomeStatement") ||
//                             canView("balanceSheet") ||
//                             canView("trendForecast")) && (
//                             <NavItem
//                               label="Dashboard"
//                               path="/dashboard/project-report"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                           {canView("activeReport") && (
//                             <NavItem
//                               label="Active Reports"
//                               path="/dashboard/reporting-screen"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         </>
//                         {/* )} */}
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {/* )} */}

//                 {!searchTerm && (
//                   <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                     onClick={() => setPlanningOpen(!planningOpen)}
//                   >
//                     <div className="flex items-center">
//                       <div className="w-8 flex justify-center">
//                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                       </div>
//                       <span
//                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                           isExpanded ? "opacity-100" : "opacity-0"
//                         }`}
//                       >
//                         Projects
//                       </span>
//                     </div>
//                     {isExpanded &&
//                       (planningOpen ? (
//                         <ChevronDown size={14} />
//                       ) : (
//                         <ChevronRight size={14} />
//                       ))}
//                   </div>
//                 )}

//                 {(planningOpen || searchTerm) && isExpanded && (
//                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                     <NavItem
//                       label="Plan Projects"
//                       path="/dashboard/project-budget-status"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                       searchTerm={searchTerm}
//                     />

//                     {canView("quickBudget") && (
//                       <NavItem
//                         label="Quick Budget"
//                         path="/dashboard/quick-budget"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}

//                     {canView("massUtility") && (
//                       <NavItem
//                         label="Mass Utility"
//                         path="/dashboard/mass-utility"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}

//                     {/* <NavItem
//                       label="Import"
//                       path="/dashboard/import-utility"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                       searchTerm={searchTerm}
//                     /> */}

//                     {/* <NavItem
//                       label="New Business Budget"
//                       path="/dashboard/new-business"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     /> */}
//                     {/* Monthly Forecast is still commented, preserving logic */}
//                     {/* <NavItem
//                       label="Monthly Forecast"
//                       path="/dashboard/monthly-forecast"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     /> */}
//                   </div>
//                 )}
//               </div>
//               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
//               {/* {currentUserRole === "admin" && ( */}
//               {(canView("manageNewBusiness") ||
//                 canView("planNewBusiness") ||
//                 canView("transferUtility")) && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() =>
//                         setNewBusinessSectionOpen(!newBusinessSectionOpen)
//                       }
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           New Businesses
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (newBusinessSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}
//                   {(newBusinessSectionOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {canView("planNewBusiness") && (
//                         <NavItem
//                           label="Plan New Businesses"
//                           path="/dashboard/nb-project"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {canView("manageNewBusiness") && (
//                         <NavItem
//                           label="Manage New Business"
//                           path="/dashboard/new-business"
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
//                     </div>
//                   )}
//                 </div>
//               )}

//               {(canView("planOpportunity") ||
//                 canView("analogRate") ||
//                 canView("parametricRate") ||
//                 canView("impOpportunity")) && (
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
//                           Opportunities
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
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {canView("planOpportunity") && (
//                         <NavItem
//                           label="Plan Opportunities"
//                           path="/dashboard/opp-project"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("impOpportunity") && (
//                         <>
//                           <NavItem
//                             label="Import Opportunities"
//                             path="/dashboard/import-opportunity"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         </>
//                       )}
//                       {canView("analogRate") && (
//                         <NavItem
//                           label="NBIs Analogous Rate"
//                           path="/dashboard/analog-rate"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("parametricRate") && (
//                         <NavItem
//                           label="NBIs Parametric Rate"
//                           path="/dashboard/parametric-rate"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {(canView("poolRateTabs") || canView("rateComputation")) && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setRateOpen(!rateOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Forecast Rates
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (rateOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(rateOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {canView("poolRateTabs") && (
//                         <NavItem
//                           label="Rate Configuration"
//                           path="/dashboard/pool-rate-tabs"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("rateComputation") && (
//                         <NavItem
//                           label="Rate Computation"
//                           path="/dashboard/rate-configure"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Hide PBR it is neccessary further */}
//               {/* <div>
//                 {!searchTerm && (
//                   <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                     onClick={() => setPbrOpen(!pbrOpen)}
//                   >
//                     <div className="flex items-center">
//                       <div className="w-8 flex justify-center">
//                         <Percent className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                       </div>
//                       <span
//                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                           isExpanded ? "opacity-100" : "opacity-0"
//                         }`}
//                       >
//                         PBR
//                       </span>
//                     </div>
//                     {isExpanded &&
//                       (pbrOpen ? (
//                         <ChevronDown size={14} />
//                       ) : (
//                         <ChevronRight size={14} />
//                       ))}
//                   </div>
//                 )}
//                 {(pbrOpen || searchTerm) && isExpanded && (
//                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                     {currentUserRole === "admin" && (
//                       <>
//                         <NavItem
//                           label="PBR"
//                           path="/dashboard/pbr"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div> */}
//               {/* )} */}
//               {/* {currentUserRole === "admin" && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setManageSectionOpen(!manageSectionOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isHovered ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Manage
//                         </span>
//                       </div>
//                       {isSidebarOpen &&
//                         (manageSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(manageSectionOpen || searchTerm) && isSidebarOpen && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       <NavItem
//                         label="Manage Groups"
//                         path="/dashboard/manage-groups"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                       <NavItem
//                         label="Manage Users"
//                         path="/dashboard/manage-users"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     </div>
//                   )}
//                 </div>
//               )} */}
//               {/* Nested Pool Mapping */}
//               {/* {currentUserRole === "admin" && (
//     <div>
//      <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
//                     onClick={() => setPoolMappingOpen(!poolMappingOpen)}
//                   >
//                     <div className="flex items-center">
//                       <div className="w-8 flex justify-center">
//                         <SlidersHorizontal className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
//                       </div>
//                       <span
//                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                           isHovered ? "opacity-100" : "opacity-0"
//                         }`}
//                       >
//                         Pool
//                       </span>
//                     </div>
//                     {isSidebarOpen &&
//                       (poolMappingOpen ? (
//                         <ChevronDown size={14} />
//                       ) : (
//                         <ChevronRight size={14} />
//                       ))}
//                   </div>
// {poolMappingOpen && isSidebarOpen && (
//                       <div className="py-1">
//                         {poolMappingOpen && (
//                           <div className="ml-12 mr-4 space-y-1 border-l border-gray-100"> */}
//               {/* <NavItem
//                               label="Org Account"
//                               path="/dashboard/pool-configuration"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                             />
//                             <NavItem
//                               label="Template Pool Mapping"
//                               path="/dashboard/template-pool-mapping"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                             /> */}
//               {/* </div>
//                         )}
//                       </div>
//                       )}
//                       </div>
//    )} */}
//               {/* --- CONFIGURATION SECTION --- */}
//               {(canView("globalConfiguration") ||
//                 canView("manageGroups") ||
//                 canView("manageUser") ||
//                 canView("projectOrgSecurity") ||
//                 canView("accountMapping") ||
//                 canView("ceilingConfiguration") ||
//                 canView("fiscalYearPeriods") ||
//                 canView("annualHolidays") ||
//                 canView("prospectiveIdSetup") ||
//                 canView("roleRights")) && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
//                       onClick={() => setConfigurationOpen(!configurationOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isHovered ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Settings
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (configurationOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}

//                   {(configurationOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {canView("globalConfiguration") && (
//                         <NavItem
//                           label="Configuration Settings"
//                           path="/dashboard/global-configuration"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("projectOrgSecurity") && (
//                         <NavItem
//                           label="Project Org Security"
//                           path="/dashboard/projectmapping"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("accountMapping") && (
//                         <NavItem
//                           label="Account Mapping"
//                           path="/dashboard/account-mapping"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("ceilingConfiguration") && (
//                         <NavItem
//                           label="Ceiling Configuration"
//                           path="/dashboard/ceiling-configuration"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("fiscalYearPeriods") && (
//                         <NavItem
//                           label="Fiscal Year Periods"
//                           path="/dashboard/maintain-fiscal-year-periods"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {canView("annualHolidays") && (
//                         <NavItem
//                           label="Annual Holidays"
//                           path="/dashboard/annual-holidays"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("prospectiveIdSetup") && (
//                         <NavItem
//                           label="Prospective ID Setup"
//                           path="/dashboard/prospective-id-setup"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("manageGroups") && (
//                         <NavItem
//                           label="Manage Groups"
//                           path="/dashboard/manage-groups"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("manageUser") && (
//                         <NavItem
//                           label="Manage Users"
//                           path="/dashboard/manage-users"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Rights Settings"
//                           path="/dashboard/role-rights"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                         />
//                       )}

//                       {/* <NavItem
//                         label="Override Configuration"
//                         path="/dashboard/override-settings"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                       /> */}
//                     </div>
//                   )}
//                 </div>
//               )}
//               {/* Setting Tap */}
//               {/* {currentUserRole === "admin" && (
//     <div>
//      <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
//                     onClick={() => setManageSettingOpen(!manageSettingOpen)}
//                   >
//                     <div className="flex items-center">
//                       <div className="w-8 flex justify-center">
//                         <Settings className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
//                       </div>
//                       <span
//                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                           isHovered ? "opacity-100" : "opacity-0"
//                         }`}
//                       >
//                         Settings
//                       </span>
//                     </div>
//                     {isSidebarOpen &&
//                       (manageSettingOpen ? (
//                         <ChevronDown size={14} />
//                       ) : (
//                         <ChevronRight size={14} />
//                       ))}
//                   </div>
// {manageSettingOpen && isSidebarOpen && (
//                       <div className="py-1">
//                         {manageSettingOpen && (
//                           <div className="ml-12 mr-4 space-y-1 border-l border-gray-100"> */}
//               {/* <NavItem
//                         label="Display Settings"
//                         path="/dashboard/display-settings"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                       /> */}
//               {/* <NavItem
//                         label="Rights Settings"
//                         path="/dashboard/role-rights"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                       /> */}
//               {/* </div>
//                         )}
//                       </div>
//                       )}
//                       </div>
//    )} */}
//             </div>
//           )}
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
//           onClick={handleCloseSidebar}
//         ></div>
//       )}
//     </div>
//   );
// };

// const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
//   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
//     return null;
//   }

//   return (
//     <Link
//       to={path}
//       className={`block px-3 py-2 text-xs transition-colors rounded-md ${
//         selected === path
//           ? "text-white font-semibold"
//           : "text-gray-500 hover:text-gray-900"
//       }`}
//       style={{
//         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
//       }}
//       onClick={(e) => {
//         e.preventDefault();
//         onClick(path);
//       }}
//     >
//       {label}
//     </Link>
//   );
// };

// export default NavigationSidebar;

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
//   BriefcaseBusiness,
//   LayoutDashboard,
//   TrendingUp,
//   Target,
//   BarChart3,
//   CircleDollarSign,
//   Gauge,
//   Calculator,
//   ShieldCheck,
//   Pin,
//   PinOff,
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
//     pathname.includes("/dashboard/project-budget-status") ||
//       pathname.includes("/dashboard/nb-project") ||
//       pathname.includes("/dashboard/pricing-nb-project") ||
//       pathname.includes("/dashboard/opp-project") ||
//       pathname.includes("/dashboard/new-business") ||
//       pathname.includes("/dashboard/pricing-new-business") ||
//       pathname.includes("/dashboard/pool-rate-tabs") ||
//       pathname.includes("/dashboard/pool-configuration") ||
//       pathname.includes("/dashboard/template-pool-mapping") ||
//       pathname.includes("/dashboard/template") ||
//       pathname.includes("/dashboard/ceiling-configuration") ||
//       pathname.includes("/dashboard/global-configuration") ||
//       pathname.includes("/dashboard/prospective-id-setup") ||
//       pathname.includes("/dashboard/display-settings") ||
//       pathname.includes("/dashboard/annual-holidays") ||
//       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//       pathname.includes("/dashboard/analog-rate") ||
//       pathname.includes("/dashboard/parametric-rate") ||
//       pathname.includes("/dashboard/project-report") ||
//       pathname.includes("/dashboard/project-variance") ||
//       pathname.includes("/dashboard/project-performance") ||
//       pathname.includes("/dashboard/project-analysis-dash") ||
//       pathname.includes("/dashboard/labor-utilization-summary") ||
//       pathname.includes("/dashboard/cfo-bi-reports") ||
//       pathname.includes("/dashboard/total-company-bi-reports") ||
//       pathname.includes("/dashboard/top10-bottom10-bi-reports") ||
//       pathname.includes("/dashboard/current-month-actuals-vs-forecast") ||
//       pathname.includes("/dashboard/cfo-bi-reports-labor") ||
//       pathname.includes("/dashboard/reporting-screen") ||
//       pathname.includes("/dashboard/role-rights") ||
//       pathname.includes("/dashboard/our-ai") ||
//       pathname.includes("/dashboard/mass-utility") ||
//       pathname.includes("/dashboard/quick-budget") ||
//       pathname.includes("/dashboard/import-utility") ||
//       pathname.includes("/dashboard/account-mapping") ||
//       pathname.includes("/dashboard/projectmapping") ||
//       pathname.includes("/dashboard/monthly-forecast") ||
//       pathname.includes("/dashboard/create-project-budget") ||
//       pathname.includes("/dashboard/import-opportunity") ||
//       pathname.includes("/dashboard/manage-users") ||
//       pathname.includes("/dashboard/manage-roles") ||
//       pathname.includes("/dashboard/manage-groups") ||
//       pathname.includes("/dashboard/override-settings") ||
//       pathname.includes("/dashboard/rate-configure") ||
//       pathname.includes("/dashboard/pricing-rate-configure") ||
//       pathname.includes("/dashboard/pricing-dfars") ||
//       pathname.includes("/dashboard/pbr-report") ||
//       pathname.includes("/dashboard/pricing") ||
//       pathname.includes("/dashboard/pricing-mass-utility") ||
//       pathname.includes("/dashboard/ice-tabs") ||
//       pathname.includes("/dashboard/pbr"),
//   );

//   const [planningOpen, setPlanningOpen] = useState(
//     pathname.includes("/dashboard/project-budget-status") ||
//       pathname.includes("/dashboard/mass-utility") ||
//       pathname.includes("/dashboard/quick-budget"),
//   );

//   const [configurationOpen, setConfigurationOpen] = useState(
//     pathname.includes("/dashboard/global-configuration") ||
//       pathname.includes("/dashboard/projectmapping") ||
//       pathname.includes("/dashboard/account-mapping") ||
//       pathname.includes("/dashboard/ceiling-configuration") ||
//       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//       pathname.includes("/dashboard/annual-holidays") ||
//       pathname.includes("/dashboard/prospective-id-setup"),
//     //  ||
//     // pathname.includes("/dashboard/manage-groups") ||
//     // pathname.includes("/dashboard/manage-users") ||
//     // pathname.includes("/dashboard/manage-roles"),
//   );

//   const [adminSetingOpen, setAdminSetingOpen] = useState(
//     pathname.includes("/dashboard/manage-groups") ||
//       pathname.includes("/dashboard/manage-users") ||
//       pathname.includes("/dashboard/manage-roles"),
//   );

//   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
//     pathname.includes("/dashboard/new-business") ||
//       pathname.includes("/dashboard/nb-project") ||
//       pathname.includes("/dashboard/create-project-budget"),
//   );

//   const [oppSectionOpen, setOppSectionOpen] = useState(
//     pathname.includes("/dashboard/import-opportunity") ||
//       pathname.includes("/dashboard/opp-project") ||
//       pathname.includes("/dashboard/parametric-rate") ||
//       pathname.includes("/dashboard/analog-rate"),
//   );

//   const [pbrSectionOpen, setPbrSectionOpen] = useState(
//     pathname.includes("/dashboard/pbr-report"),
//   );

//   const [pricingSectionOpen, setPricingSectionOpen] = useState(
//     pathname.includes("/dashboard/pricing-new-business") ||
//       pathname.includes("/dashboard/pricing-nb-project") ||
//       pathname.includes("/dashboard/pricing-rate-configure") ||
//       pathname.includes("/dashboard/pricing-dfars") ||
//       pathname.includes("/dashboard/pricing-mass-utility") ||
//       pathname.includes("/dashboard/pricing"),
//   );

//   const [iceSectionOpen, setIceSectionOpen] = useState(
//     pathname.includes("/dashboard/ice-tabs"),
//   );

//   const [reportingOpen, setReportingOpen] = useState(
//     pathname.includes("/dashboard/project-report") ||
//       pathname.includes("/dashboard/project-variance") ||
//       pathname.includes("/dashboard/project-performance") ||
//       pathname.includes("/dashboard/project-analysis-dash") ||
//       pathname.includes("/dashboard/labor-utilization-summary") ||
//       pathname.includes("/dashboard/reporting-screen"),
//   );
//   const [biReportingOpen, setBiReportingOpen] = useState(
//     pathname.includes("/dashboard/cfo-bi-reports") ||
//       pathname.includes("/dashboard/total-company-bi-reports") ||
//       pathname.includes("/dashboard/top10-bottom10-bi-reports") ||
//       pathname.includes("/dashboard/current-month-actuals-vs-forecast") ||
//       pathname.includes("/dashboard/cfo-bi-reports-labor"),
//   );
//   const [rateOpen, setRateOpen] = useState(
//     pathname.includes("/dashboard/pool-rate-tabs") ||
//       pathname.includes("/dashboard/rate-configure"),
//   );

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

//   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
//   // const isExpanded = isSidebarOpen || isHovered;
//   const isExpanded = isLocked || isSidebarOpen || isHovered;

//   const handleLinkClick = (pagePath) => {
//     setSelectedPage(pagePath);
//     navigate(pagePath);
//     if (isSidebarOpen) {
//       setIsSidebarOpen(false);
//     }
//   };

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
//         // onMouseEnter={() => setIsHovered(true)}
//         // onMouseLeave={() => setIsHovered(false)}
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
//               <div>
//                 {/* <div
//                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
//                 > */}
//                 <div
//                   className={`px-3 pt-4 pb-2 ${isExpanded ? "flex items-center gap-2" : "hidden"}`}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) =>
//                       setSearchTerm(e.target.value.toLowerCase())
//                     }
//                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full bg-white shadow-inner"
//                   />
//                   {/* Pin/Lock Button */}
//                   <button
//                     type="button"
//                     onClick={toggleLock}
//                     className="p-1 text-gray-500 hover:text-[#17414d] rounded-md transition-colors flex-shrink-0"
//                     title={
//                       isLocked
//                         ? "Unlock Navigation"
//                         : "Lock Navigation Expanded"
//                     }
//                   >
//                     {isLocked ? (
//                       <Pin className="w-4 h-4 fill-[#17414d] text-[#17414d]" />
//                     ) : (
//                       <PinOff className="w-4 h-4 text-gray-400" />
//                     )}
//                   </button>
//                 </div>

//                 {currentUserRole === "admin" && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() => setBiReportingOpen(!biReportingOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                               isExpanded ? "opacity-100" : "opacity-0"
//                             }`}
//                           >
//                             BI Reports
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (biReportingOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}
//                     {(biReportingOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="CFO Reports"
//                             path="/dashboard/cfo-bi-reports"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Labor Utilization"
//                             path="/dashboard/cfo-bi-reports-labor"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Total Company"
//                             path="/dashboard/total-company-bi-reports"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Top 10 and Bottom 10 Projects"
//                             path="/dashboard/top10-bottom10-bi-reports"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Current month Actuals Vs Forecast"
//                             path="/dashboard/current-month-actuals-vs-forecast"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Dashboard Section aligned to permissions */}
//                 {canView("activeReport") && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() => setReportingOpen(!reportingOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <LayoutDashboard className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                               isExpanded ? "opacity-100" : "opacity-0"
//                             }`}
//                           >
//                             Dashboard
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (reportingOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}
//                     {(reportingOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                         {currentUserRole === "admin" &&
//                           (canView("forecastReport") ||
//                             canView("spendReport") ||
//                             canView("incomeStatement") ||
//                             canView("balanceSheet") ||
//                             canView("trendForecast")) && (
//                             <NavItem
//                               label="Dashboard"
//                               path="/dashboard/project-report"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("activeReport") && (
//                           <NavItem
//                             label="Active Reports"
//                             path="/dashboard/reporting-screen"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Version Analysis"
//                             path="/dashboard/project-variance"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Project Performance"
//                             path="/dashboard/project-performance"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Project Console"
//                             path="/dashboard/project-analysis-dash"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" && (
//                           <NavItem
//                             label="Labor Utilization"
//                             path="/dashboard/labor-utilization-summary"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Projects Section */}
//                 {!searchTerm && (
//                   <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                     onClick={() => setPlanningOpen(!planningOpen)}
//                   >
//                     <div className="flex items-center">
//                       <div className="w-8 flex justify-center">
//                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                       </div>
//                       <span
//                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                           isExpanded ? "opacity-100" : "opacity-0"
//                         }`}
//                       >
//                         Projects
//                       </span>
//                     </div>
//                     {isExpanded &&
//                       (planningOpen ? (
//                         <ChevronDown size={14} />
//                       ) : (
//                         <ChevronRight size={14} />
//                       ))}
//                   </div>
//                 )}

//                 {(planningOpen || searchTerm) && isExpanded && (
//                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                     <NavItem
//                       label="Plan Projects"
//                       path="/dashboard/project-budget-status"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                       searchTerm={searchTerm}
//                     />
//                     {canView("quickBudget") && (
//                       <NavItem
//                         label="Quick Budget"
//                         path="/dashboard/quick-budget"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {canView("massUtility") && (
//                       <NavItem
//                         label="Mass Utility"
//                         path="/dashboard/mass-utility"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* New Businesses Section */}
//               {(canView("manageNewBusiness") ||
//                 // canView("transferUtility") ||
//                 canView("planNewBusiness")) && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() =>
//                         setNewBusinessSectionOpen(!newBusinessSectionOpen)
//                       }
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           New Businesses
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (newBusinessSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}
//                   {(newBusinessSectionOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
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
//                       {currentUserRole === "admin" &&
//                         canView("transferUtility") && (
//                           <NavItem
//                             label="Transfer Project Budget"
//                             path="/dashboard/create-project-budget"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Opportunities Section */}
//               {(canView("planOpportunity") ||
//                 // canView("analogRate") ||
//                 // canView("parametricRate") ||
//                 canView("impOpportunity")) && (
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
//                           Opportunities
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
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {canView("impOpportunity") && (
//                         <NavItem
//                           label="Import Opportunities"
//                           path="/dashboard/import-opportunity"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("planOpportunity") && (
//                         <NavItem
//                           label="Plan Opportunities"
//                           path="/dashboard/opp-project"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && canView("analogRate") && (
//                         <NavItem
//                           label="NBIs Analogous Rate"
//                           path="/dashboard/analog-rate"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" &&
//                         canView("parametricRate") && (
//                           <NavItem
//                             label="NBIs Parametric Rate"
//                             path="/dashboard/parametric-rate"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {currentUserRole === "admin" && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setPricingSectionOpen(!pricingSectionOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <CircleDollarSign className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           Contract Pricing
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (pricingSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}
//                   {(pricingSectionOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {canView("manageNewBusiness") && (
//                         <NavItem
//                           label="Contract Setup"
//                           path="/dashboard/pricing-new-business"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("planNewBusiness") && (
//                         <NavItem
//                           label="Proposal Builder"
//                           path="/dashboard/pricing-nb-project"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="Pricing Studio"
//                           path="/dashboard/pricing"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                       {canView("massUtility") && (
//                         <NavItem
//                           label="Mass Utility"
//                           path="/dashboard/pricing-mass-utility"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}

//                       {/* {currentUserRole === "admin" && (
//                         <NavItem
//                           label="DFARS"
//                           path="/dashboard/pricing-dfars"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )} */}
//                       {canView("poolRateTabs") && (
//                         <NavItem
//                           label="Rate Configuration"
//                           path="/dashboard/pricing-rate-configure"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {currentUserRole === "admin" && (
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
//                           Provisional Billing Rate
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
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="PBR Package"
//                           path="/dashboard/pbr-report"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {currentUserRole === "admin" && (
//                 <div>
//                   {!searchTerm && (
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                       onClick={() => setIceSectionOpen(!iceSectionOpen)}
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 flex justify-center">
//                           <Calculator className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                         </div>
//                         <span
//                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                             isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                         >
//                           ICE
//                         </span>
//                       </div>
//                       {isExpanded &&
//                         (iceSectionOpen ? (
//                           <ChevronDown size={14} />
//                         ) : (
//                           <ChevronRight size={14} />
//                         ))}
//                     </div>
//                   )}
//                   {(iceSectionOpen || searchTerm) && isExpanded && (
//                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                       {currentUserRole === "admin" && (
//                         <NavItem
//                           label="ICE"
//                           path="/dashboard/ice-tabs"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Forecast Rates Section */}
//               {currentUserRole === "admin" &&
//                 (canView("poolRateTabs") || canView("rateComputation")) && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() => setRateOpen(!rateOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
//                               isExpanded ? "opacity-100" : "opacity-0"
//                             }`}
//                           >
//                             Forecast Rates
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (rateOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}
//                     {(rateOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
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
//                       </div>
//                     )}
//                   </div>
//                 )}

//               {/* Configuration Settings Section */}
//               {currentUserRole === "admin" &&
//                 (canView("globalConfiguration") ||
//                   // canView("manageGroups") ||
//                   // canView("manageUser") ||
//                   canView("projectOrgSecurity") ||
//                   canView("accountMapping") ||
//                   canView("ceilingConfiguration") ||
//                   canView("fiscalYearPeriods") ||
//                   canView("annualHolidays") ||
//                   canView("prospectiveIdSetup")) && (
//                   // || canView("roleRights"))
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
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
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
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
//                         {/* {canView("manageGroups") && (
//                           <NavItem
//                             label="Manage Groups"
//                             path="/dashboard/manage-groups"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )} */}
//                         {/* {currentUserRole === "admin" &&
//                           canView("manageUser") && (
//                             <NavItem
//                               label="Manage Users"
//                               path="/dashboard/manage-users"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {currentUserRole === "admin" &&
//                           canView("manageUser") && (
//                             <NavItem
//                               label="Manage Roles"
//                               path="/dashboard/manage-roles"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )} */}

//                         {/* Strictly limits Rights Settings to admin user role configuration */}
//                         {/* {currentUserRole === "admin" &&
//                           canView("roleRights") && (
//                             <NavItem
//                               label="Rights Settings"
//                               path="/dashboard/role-rights"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )} */}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               {currentUserRole === "admin" &&
//                 (canView("manageGroups") ||
//                   canView("manageUser") ||
//                   canView("roleRights")) && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
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
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                         {canView("manageGroups") && (
//                           <NavItem
//                             label="Manage Groups"
//                             path="/dashboard/manage-groups"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {currentUserRole === "admin" &&
//                           canView("manageUser") && (
//                             <NavItem
//                               label="Manage Users"
//                               path="/dashboard/manage-users"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {currentUserRole === "admin" &&
//                           canView("manageUser") && (
//                             <NavItem
//                               label="Manage Roles"
//                               path="/dashboard/manage-roles"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}

//                         {/* Strictly limits Rights Settings to admin user role configuration */}
//                         {/* {currentUserRole === "admin" &&
//                           canView("roleRights") && (
//                             <NavItem
//                               label="Manage Rights"
//                               path="/dashboard/role-rights"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )} */}
//                       </div>
//                     )}
//                   </div>
//                 )}
//             </div>
//           )}
//         </div>

//         <div className="px-3 mb-2">
//           <div className="px-1.5 py-1">
//             <Link
//               to="/dashboard/our-ai"
//               onClick={handleLinkClick}
//               className={`flex items-center rounded-md transition-all duration-200 ${
//                 !isExpanded
//                   ? "justify-center w-6 h-7 mx-auto"
//                   : "px-3 py-2 text-xs w-full gap-2.5"
//               } ${
//                 selectedPage === "/dashboard/our-ai"
//                   ? "text-white font-semibold "
//                   : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
//               }`}
//               style={{
//                 backgroundColor:
//                   selectedPage === "/dashboard/our-ai" ? "#17414d" : "",
//               }}
//               title={!isExpanded ? "R-AI" : ""}
//             >
//               {/* Clean Modern Message Icon */}

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

// const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
//   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
//     return null;
//   }

//   return (
//     <Link
//       to={path}
//       className={`block px-3 py-2 text-xs transition-colors rounded-md ${
//         selected === path
//           ? "text-white font-semibold"
//           : "text-gray-500 hover:text-gray-900"
//       }`}
//       style={{
//         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
//       }}
//       onClick={(e) => {
//         e.preventDefault();
//         onClick(path);
//       }}
//     >
//       {label}
//     </Link>
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
  ContactRound,
  FileCheck2,
} from "lucide-react";

const NavigationSidebar = ({
  setIsHovered,
  isHovered,
  setIsSidebarOpen,
  isSidebarOpen,
  visibility,
  canView,
  canEdit,
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
      // Pricing paths included as they are under the same L1
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
      pathname.includes("/dashboard/sub-po-info") ||
      pathname.includes("/dashboard/sub-pstaus"),
  );

  const [vendorSectionOpen, setVendorSectionOpen] = useState(
    pathname.includes("/dashboard/credit-expenses") ||
      pathname.includes("/dashboard/vendor-expenses"),
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

  // Update selected page when pathname changes
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
              {canView("activeReport") && (
                <div>
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
                      {currentUserRole === "admin" &&
                        (canView("forecastReport") ||
                          canView("spendReport") ||
                          canView("incomeStatement") ||
                          canView("balanceSheet") ||
                          canView("trendForecast")) && (
                          <NavItem
                            label="Executive Dashboard"
                            path="/dashboard/project-report"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}

                      {canView("activeReport") && (
                        <NavItem
                          label="Active Reports"
                          path="/dashboard/reporting-screen"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}

                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Version Analysis"
                          path="/dashboard/project-variance"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}

                      {/* {currentUserRole === "admin" && (
                        <NavItem
                          label="Project Console"
                          path="/dashboard/project-analysis-dash"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )} */}

                      {/* LEVEL 2 Sub-Group (3rd Level Trigger) */}
                      {currentUserRole === "admin" && (
                        <NavSubGroup
                          label="BI Reports"
                          searchTerm={searchTerm}
                          defaultOpen={
                            pathname.includes("/dashboard/cfo-bi-reports") ||
                            pathname.includes(
                              "/dashboard/cfo-bi-reports-labor",
                            ) ||
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
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentUserRole === "admin" && (
                <div>
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
                          PR-PO
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

                  {/* LEVEL 2: Under Dashboard */}
                  {(prToPoTrackerOpen || searchTerm) && isExpanded && (
                    <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Dashboard"
                          path="/dashboard/pr-to-po-tracker"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* LEVEL 1: Projects Section */}
              {!searchTerm && (
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

              {(planningOpen || searchTerm) && isExpanded && (
                <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                  {currentUserRole === "admin" && (
                    <NavSubGroup
                      label="Project Financial Dashboards"
                      searchTerm={searchTerm}
                      defaultOpen={
                        pathname.includes("/dashboard/project-performance") ||
                        pathname.includes(
                          "/dashboard/labor-utilization-summary",
                        )
                      }
                    >
                      <NavItem
                        label="Project Performance"
                        path="/dashboard/project-performance"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />

                      {/* {currentUserRole === "admin" && ( */}
                      <NavItem
                        label="Project Console"
                        path="/dashboard/project-analysis-dash"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      {/* ) */}
                      {/* } */}

                      {/* <NavItem
                        label="GL Package"
                        path="/dashboard/gl-budgeting"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      /> */}

                      <NavItem
                        label="Labor Utilization"
                        path="/dashboard/labor-utilization-summary"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                    </NavSubGroup>
                  )}
                  {currentUserRole === "admin" && (
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
                      {canView("quickBudget") && (
                        <NavItem
                          label="Quick Budget"
                          path="/dashboard/quick-budget"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {canView("massUtility") && (
                        <NavItem
                          label="Mass Utility"
                          path="/dashboard/mass-utility"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                    </NavSubGroup>
                  )}
                  {(canView("manageNewBusiness") ||
                    canView("transferUtility") ||
                    canView("planNewBusiness")) && (
                    <NavSubGroup
                      label="Plan New Business"
                      searchTerm={searchTerm}
                      defaultOpen={
                        pathname.includes("/dashboard/new-business") ||
                        pathname.includes("/dashboard/create-project-budget") ||
                        pathname.includes("/dashboard/nb-project")
                      }
                    >
                      {canView("manageNewBusiness") && (
                        <NavItem
                          label="Manage New Business"
                          path="/dashboard/new-business"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {canView("planNewBusiness") && (
                        <NavItem
                          label="Plan New Businesses"
                          path="/dashboard/nb-project"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" &&
                        canView("transferUtility") && (
                          <NavItem
                            label="Transfer Project Budget"
                            path="/dashboard/create-project-budget"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                    </NavSubGroup>
                  )}
                </div>
              )}

              {/* LEVEL 1: Opportunities & Pricing Section */}
              {(canView("planOpportunity") || canView("impOpportunity")) && (
                <div>
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
                      {currentUserRole === "admin" && (
                        <NavSubGroup
                          label="Capture Opportunity & Plan Pipeline"
                          searchTerm={searchTerm}
                          defaultOpen={
                            pathname.includes(
                              "/dashboard/import-opportunity",
                            ) ||
                            pathname.includes("/dashboard/opp-project") ||
                            pathname.includes("/dashboard/analog-rate") ||
                            pathname.includes("/dashboard/parametric-rate")
                          }
                        >
                          {canView("impOpportunity") && (
                            <NavItem
                              label="Import Opportunities"
                              path="/dashboard/import-opportunity"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                          {canView("planOpportunity") && (
                            <NavItem
                              label="Plan Opportunities"
                              path="/dashboard/opp-project"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                          {canView("analogRate") && (
                            <NavItem
                              label="Analogous Rate"
                              path="/dashboard/analog-rate"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                          {canView("parametricRate") && (
                            <NavItem
                              label="Parametric Rate"
                              path="/dashboard/parametric-rate"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                        </NavSubGroup>
                      )}
                      {currentUserRole === "admin" && (
                        <NavSubGroup
                          label="Cost Proposal and Pricing"
                          searchTerm={searchTerm}
                          defaultOpen={
                            pathname.includes(
                              "/dashboard/pricing-new-business",
                            ) ||
                            pathname.includes(
                              "/dashboard/pricing-nb-project",
                            ) ||
                            pathname.includes(
                              "/dashboard/pricing-mass-utility",
                            ) ||
                            pathname.includes(
                              "/dashboard/pricing-rate-configure",
                            ) ||
                            pathname.includes("/dashboard/pricing")
                          }
                        >
                          {canView("manageNewBusiness") && (
                            <NavItem
                              label="Contract Setup"
                              path="/dashboard/pricing-new-business"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                          {canView("planNewBusiness") && (
                            <NavItem
                              label="Proposal Builder"
                              path="/dashboard/pricing-nb-project"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                          <NavItem
                            label="Pricing Studio"
                            path="/dashboard/pricing"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                          {canView("massUtility") && (
                            <NavItem
                              label="Mass Utility"
                              path="/dashboard/pricing-mass-utility"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                          {canView("poolRateTabs") && (
                            <NavItem
                              label="Rate Configuration"
                              path="/dashboard/pricing-rate-configure"
                              selected={selectedPage}
                              onClick={handleLinkClick}
                              searchTerm={searchTerm}
                            />
                          )}
                        </NavSubGroup>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentUserRole === "admin" && (
                <div>
                  {!searchTerm && (
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                      onClick={() =>
                        setCorporateBudgetOpen(!corporateBudgetOpen)
                      }
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
                        label="By GL"
                        path="/dashboard/gl-budgeting"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                      <NavItem
                        label="By Department/Organization"
                        path="/dashboard/corporate-budget-department"
                        selected={selectedPage}
                        onClick={handleLinkClick}
                        searchTerm={searchTerm}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* LEVEL 1: Compliance (DCAA) */}
              {currentUserRole === "admin" && (
                <div>
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
                          Compliance (DCAA)
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
                        {canView("poolRateTabs") && (
                          <NavItem
                            label="Rate Configuration"
                            path="/dashboard/pool-rate-tabs"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("rateComputation") && (
                          <NavItem
                            label="Rate Computation"
                            path="/dashboard/rate-configure"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                      </NavSubGroup>
                    </div>
                  )}
                </div>
              )}

              {currentUserRole === "admin" && (
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
                          Subcontractor Management
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
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Dashboard"
                          path="/dashboard/sub-dashboards"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Create Timesheet"
                          path="/dashboard/sub-create-timesheet"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Enquiry & Approval"
                          path="/dashboard/sub-enquiry-approval"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Generate Invoice"
                          path="/dashboard/sub-export-table"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Invoice Export"
                          path="/dashboard/sub-invoice-export"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="PO Info"
                          path="/dashboard/sub-po-info"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="PO Status"
                          path="/dashboard/sub-pstaus"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Work Order"
                          path="/dashboard/sub-work-assign"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Report"
                          path="/dashboard/sub-report"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Settings"
                          path="/dashboard/sub-settings"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentUserRole === "admin" && (
                <div>
                  {!searchTerm && (
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
                      onClick={() => setVendorSectionOpen(!vendorSectionOpen)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 flex justify-center">
                          <ContactRound className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
                        </div>
                        <span
                          className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
                            isExpanded ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          Vendor Management
                        </span>
                      </div>
                      {isExpanded &&
                        (vendorSectionOpen ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        ))}
                    </div>
                  )}

                  {(vendorSectionOpen || searchTerm) && isExpanded && (
                    <div className="ml-12 mr-4 space-y-1 border-l border-gray-100 pl-2">
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Vendor Expenses"
                          path="/dashboard/vendor-expenses"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                      {currentUserRole === "admin" && (
                        <NavItem
                          label="Credit Expenses"
                          path="/dashboard/credit-expenses"
                          selected={selectedPage}
                          onClick={handleLinkClick}
                          searchTerm={searchTerm}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* LEVEL 1: Settings */}
              {currentUserRole === "admin" &&
                (canView("globalConfiguration") ||
                  canView("projectOrgSecurity") ||
                  canView("accountMapping") ||
                  canView("ceilingConfiguration") ||
                  canView("fiscalYearPeriods") ||
                  canView("annualHolidays") ||
                  canView("prospectiveIdSetup")) && (
                  <div>
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
                        {canView("globalConfiguration") && (
                          <NavItem
                            label="Configuration Settings"
                            path="/dashboard/global-configuration"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("projectOrgSecurity") && (
                          <NavItem
                            label="Access Mapping"
                            path="/dashboard/projectmapping"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("accountMapping") && (
                          <NavItem
                            label="Account Mapping"
                            path="/dashboard/account-mapping"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("ceilingConfiguration") && (
                          <NavItem
                            label="Ceiling Configuration"
                            path="/dashboard/ceiling-configuration"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("fiscalYearPeriods") && (
                          <NavItem
                            label="Fiscal Year Periods"
                            path="/dashboard/maintain-fiscal-year-periods"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("annualHolidays") && (
                          <NavItem
                            label="Annual Holidays"
                            path="/dashboard/annual-holidays"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("prospectiveIdSetup") && (
                          <NavItem
                            label="Prospective ID Setup"
                            path="/dashboard/prospective-id-setup"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* LEVEL 1: Admin */}
              {currentUserRole === "admin" &&
                (canView("manageGroups") ||
                  canView("manageUser") ||
                  canView("roleRights")) && (
                  <div>
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
                        {canView("manageGroups") && (
                          <NavItem
                            label="Manage Groups"
                            path="/dashboard/manage-groups"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("manageUser") && (
                          <NavItem
                            label="Manage Users"
                            path="/dashboard/manage-users"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                        {canView("manageUser") && (
                          <NavItem
                            label="Manage Roles"
                            path="/dashboard/manage-roles"
                            selected={selectedPage}
                            onClick={handleLinkClick}
                            searchTerm={searchTerm}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* AI Assistant Button */}
        <div className="px-3 mb-2">
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
        </div>

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
  // If a search term exists and the label doesn't match, hide it
  if (searchTerm && !label.toLowerCase().includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <Link
      to={path}
      // Replaced 'truncate' with text wrapping classes to avoid '...' clipping
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

    // Direct label match
    if (child.props.label?.toLowerCase().includes(termLower)) {
      return true;
    }

    // Recursive check for nested children
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

  // Check if this subgroup or any nested item matches search term
  const matchesSelf = searchTerm
    ? label.toLowerCase().includes(searchTerm.toLowerCase())
    : false;
  const matchesNested = hasMatchingChild(children, searchTerm);

  // Hide entire group if neither self nor nested children match during search
  if (searchTerm && !matchesSelf && !matchesNested) {
    return null;
  }

  // Force open when searching if there are matching contents
  const shouldOpen = searchTerm ? matchesSelf || matchesNested : isOpen;

  // Render children, passing down the search term
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
          {/* Replaced 'truncate' with text wrapping for group header titles */}
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

// // --- LEVEL 2 SUB-GROUP FOR LEVEL 3 NESTING ---
// const NavSubGroup = ({ label, children, searchTerm, defaultOpen = false }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);

//   // If searching, keep subgroup open if it has children
//   const shouldOpen = searchTerm ? React.Children.count(children) > 0 : isOpen;

//   // Count visible children based on search
//   const visibleChildren = React.Children.toArray(children).filter((child) => {
//     if (!searchTerm) return true;
//     return child.props.label.toLowerCase().includes(searchTerm);
//   });

//   if (searchTerm && visibleChildren.length === 0) {
//     return null;
//   }

//   return (
//     <div className="space-y-1">
//       {/* {!searchTerm && (
//         <div
//           className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer rounded-md transition-colors hover:bg-gray-50"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <span className="font-medium truncate" title={label}>{label}</span>
//           {shouldOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
//         </div>
//       )} */}
//       {!searchTerm && (
//         <div
//           className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer rounded-md transition-colors hover:bg-gray-50"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {/* Replaced 'truncate' with wrapping utilities + margin right */}
//           <span
//             className="font-medium break-words whitespace-normal leading-tight mr-2"
//             title={label}
//           >
//             {label}
//           </span>
//           <span className="shrink-0">
//             {shouldOpen ? (
//               <ChevronDown size={12} />
//             ) : (
//               <ChevronRight size={12} />
//             )}
//           </span>
//         </div>
//       )}
//       {shouldOpen && (
//         <div className="ml-1 border-l border-gray-200 pl-2 space-y-1">
//           {visibleChildren}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- INDIVIDUAL LEAF NAVIGATION ITEM ---
// const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
//   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
//     return null;
//   }

//   const isSelected = selected === path;

//   return (
//     <Link
//       to={path}
//       title={label}
//       // className={`block px-3 py-1.5 text-xs transition-colors rounded-md truncate ${
//       //   isSelected
//       //     ? "text-white font-semibold"
//       //     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//       // }`}
//       className={`block px-3 py-2 text-xs transition-colors rounded-md truncate ${
//         selected === path
//           ? "text-white font-semibold"
//           : "text-gray-500 hover:text-gray-900"
//       }`}
//       style={{
//         backgroundColor: isSelected ? "#17414d" : "transparent",
//       }}
//       onClick={(e) => {
//         // Only prevent default if you want to handle navigation manually via navigate()
//         // Otherwise, let Link component handle it.
//         // e.preventDefault();
//         onClick(path);
//       }}
//     >
//       {label}
//     </Link>
//   );
// };

export default NavigationSidebar;
