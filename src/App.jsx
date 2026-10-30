// // // import React from "react";
// // // import { ToastContainer } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";
// // // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // // import Login from "./components/Login";
// // // import Dashboard from "./pages/Dashboard";

// // // function App() {
// // //   return (
// // //     <>
// // //      <Router>
// // //       <Routes>
// // //         <Route path="/" element={<Login />} />
// // //         <Route path="/dashboard/*" element={<Dashboard />} />
// // //       </Routes>
// // //     </Router>
// // //     <ToastContainer
// // //         position="top-right"
// // //         autoClose={3000}
// // //         hideProgressBar={false}
// // //         closeOnClick
// // //       />
// // //     </>

// // //   );
// // // }

// // // export default App;

// // import React, { useEffect, useState } from "react";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import {
// //   BrowserRouter as Router,
// //   Routes,
// //   Route,
// //   Navigate,
// // } from "react-router-dom";

// // // Pages & Components
// // import Login from "./components/Login";
// // import Dashboard from "./pages/Dashboard";
// // import ProjectBudgetStatus from "./components/ProjectBudgetStatus";
// // import FinancialDashboard from "./components/FinancialDashboard";
// // import MassUtilityProject from "./components/MassUtilityProject";
// // import Import from "./components/Import";
// // import UserOrgProjectMapping from "./components/UserOrgProjectMapping";
// // import NewBusinessComponent from "./components/NewBusinessComponent";
// // import CreateProjectBudget from "./components/CreateProjectBudget";
// // import Opportunities from "./components/Opportunities";
// // import ManageGroups from "./components/ManageGroups";
// // import ManageUser from "./components/ManageUser";
// // import AnalysisByPeriodContent from "./components/AnalysisByPeriodContent";
// // import PoolRateTabs from "./components/PoolRateTabs";
// // import ConfigureField from "./components/ConfigureField";
// // import OverrideSettings from "./components/OverrideSettings";
// // import PoolConfigurationTable from "./components/PoolConfigurationTable";
// // import TemplatePoolMapping from "./components/TemplatePoolMapping";
// // import Template from "./components/Template";
// // import CeilingConfiguration from "./components/CeilingConfiguration";
// // import AnalogRate from "./components/AnalogRate";
// // import GlobalConfiguration from "./components/GlobalConfiguration";
// // import ProspectiveIdSetup from "./components/ProspectiveIdSetup";
// // import DisplaySettings from "./components/DisplaySettings";
// // import AnnualHolidays from "./components/HolidayCalendar";
// // import MaintainFiscalYearPeriods from "./components/MaintainFiscalYearPeriods";
// // import AccountMapping from "./components/AccountMapping";
// // import FinancialReport from "./components/FinancialReport";
// // import { backendUrl } from "./components/config";
// // import NBIParametricRate from "./components/NBIParametricRate";
// // import RateConfigure from "./components/RateConfigure";
// // import ControllerDashboard from "./components/PBRS";
// // import ReportingScreen from "./components/ReportingScreen";
// // import ProjectExpandableTable from "./components/ProjectExpandableTable";

// // function App() {
// //   if (import.meta.env.VITE_CHECK === "production") {
// //     console.log = () => {};
// //     console.info = () => {};
// //     console.warn = () => {};
// //     console.error = () => {};
// //   }

// //   return (
// //     <>
// //       <Router>
// //         <Routes>
// //           <Route path="/" element={<Login />} />
// //           <Route path="/login" element={<Login />} />

// //           {/* Dashboard Layout and its Children */}
// //           <Route path="/dashboard" element={<Dashboard />}>
// //             {/* Default Index View */}
// //             <Route
// //               index
// //               element={
// //                 <div className="flex items-center justify-center min-h-[80vh]">
// //                   <div className="max-w-md w-full text-center">
// //                     <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
// //                       FinAxis
// //                     </span>
// //                     <h1 className="text-2xl font-semibold text-gray-900 mt-4">
// //                       Welcome to FinAxis Planning
// //                     </h1>
// //                     <p className="text-gray-600 mt-2">
// //                       Select an option from the sidebar to get started.
// //                     </p>
// //                   </div>
// //                 </div>
// //               }
// //             />

// //             {/* General Routes */}
// //             <Route
// //               path="project-budget-status"
// //               element={<ProjectBudgetStatus type="PROJECT" />}
// //             />
// //             <Route
// //               path="opp-project"
// //               element={<ProjectBudgetStatus type="OPP" />}
// //             />
// //             <Route
// //               path="nb-project"
// //               element={<ProjectBudgetStatus type="NBBUD" />}
// //             />
// //             <Route
// //               path="project-report"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <FinancialDashboard />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="mass-utility"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <MassUtilityProject />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="import-utility"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <Import />
// //                 </div>
// //               }
// //             />
// //             <Route path="projectmapping" element={<UserOrgProjectMapping />} />
// //             <Route
// //               path="new-business"
// //               element={
// //                 <div className="mt-10">
// //                   <NewBusinessComponent />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="create-project-budget"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <CreateProjectBudget />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="import-opportunity"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <Opportunities />
// //                 </div>
// //               }
// //             />

// //             <Route
// //               path="monthly-forecast"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <AnalysisByPeriodContent />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="financial-report"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <FinancialReport />
// //                 </div>
// //               }
// //             />

// //             {/* Admin Only Routes */}
// //             <Route
// //               path="manage-groups"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <ManageGroups />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="manage-users"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <ManageUser />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="pool-rate-tabs"
// //               element={
// //                 <div className="mt-12">
// //                   <PoolRateTabs />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="role-rights"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <ConfigureField />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="override-settings"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <OverrideSettings />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="pool-configuration"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <PoolConfigurationTable />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="template-pool-mapping"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <TemplatePoolMapping />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="template"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <Template />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="ceiling-configuration"
// //               element={
// //                 <div className="mt-12">
// //                   <CeilingConfiguration />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="analog-rate"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <AnalogRate />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="global-configuration"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <GlobalConfiguration />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="prospective-id-setup"
// //               element={
// //                 <div className="mt-10">
// //                   <ProspectiveIdSetup />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="display-settings"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <DisplaySettings />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="annual-holidays"
// //               element={
// //                 <div className="mt-4">
// //                   <AnnualHolidays />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="maintain-fiscal-year-periods"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   <MaintainFiscalYearPeriods />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="account-mapping"
// //               element={
// //                 <div className="mt-10">
// //                   <AccountMapping />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="parametric-rate"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   {" "}
// //                   <NBIParametricRate />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="rate-configure"
// //               element={
// //                 <div className="mt-10">
// //                   {" "}
// //                   <RateConfigure />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="pbr"
// //               element={
// //                 <div className="mt-10">
// //                   {" "}
// //                   <ControllerDashboard />
// //                 </div>
// //               }
// //             />

// //             <Route
// //               path="reporting-screen"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   {" "}
// //                   <ReportingScreen />
// //                 </div>
// //               }
// //             />
// //             <Route
// //               path="quick-budget"
// //               element={
// //                 <div className="mt-12 ml-2">
// //                   {" "}
// //                   <ProjectExpandableTable />
// //                 </div>
// //               }
// //             />
// //           </Route>
// //         </Routes>
// //       </Router>
// //       <ToastContainer
// //         position="top-right"
// //         autoClose={3000}
// //         hideProgressBar={false}
// //         closeOnClick
// //       />
// //     </>
// //   );
// // }

// // export default App;

// // import React from "react";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Login from "./components/Login";
// // import Dashboard from "./pages/Dashboard";

// // function App() {
// //   return (
// //     <>
// //      <Router>
// //       <Routes>
// //         <Route path="/" element={<Login />} />
// //         <Route path="/dashboard/*" element={<Dashboard />} />
// //       </Routes>
// //     </Router>
// //     <ToastContainer
// //         position="top-right"
// //         autoClose={3000}
// //         hideProgressBar={false}
// //         closeOnClick
// //       />
// //     </>

// //   );
// // }

// // export default App;

// import React, { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Pages & Componentspricing
// import Login from "./components/Login";
// import Dashboard from "./pages/Dashboard";
// import ProjectBudgetStatus from "./components/ProjectBudgetStatus";
// import FinancialDashboard from "./components/FinancialDashboard";
// import MassUtilityProject from "./components/MassUtilityProject";
// import Import from "./components/Import";
// import UserOrgProjectMapping from "./components/UserOrgProjectMapping";
// import NewBusinessComponent from "./components/NewBusinessComponent";
// import CreateProjectBudget from "./components/CreateProjectBudget";
// import Opportunities from "./components/Opportunities";
// import ManageGroups from "./components/ManageGroups";
// import ManageUser from "./components/ManageUser";
// import AnalysisByPeriodContent from "./components/AnalysisByPeriodContent";
// import PoolRateTabs from "./components/PoolRateTabs";
// import ConfigureField from "./components/ConfigureField";
// import OverrideSettings from "./components/OverrideSettings";
// import PoolConfigurationTable from "./components/PoolConfigurationTable";
// import TemplatePoolMapping from "./components/TemplatePoolMapping";
// import Template from "./components/Template";
// import CeilingConfiguration from "./components/CeilingConfiguration";
// import AnalogRate from "./components/AnalogRate";
// import GlobalConfiguration from "./components/GlobalConfiguration";
// import ProspectiveIdSetup from "./components/ProspectiveIdSetup";
// import DisplaySettings from "./components/DisplaySettings";
// import AnnualHolidays from "./components/HolidayCalendar";
// import MaintainFiscalYearPeriods from "./components/MaintainFiscalYearPeriods";
// import AccountMapping from "./components/AccountMapping";
// import FinancialReport from "./components/FinancialReport";
// import { backendUrl } from "./components/config";
// import NBIParametricRate from "./components/NBIParametricRate";
// import RateConfigure from "./components/RateConfigure";
// import ControllerDashboard from "./components/PBRS";
// import ReportingScreen from "./components/ReportingScreen";
// import ProjectExpandableTable from "./components/ProjectExpandableTable";
// import DBDictionary from "./components/DBDictionary";
// import { ProjectVariance } from "./components/ProjectVariance";
// import BIReports from "./components/BIReports";
// import ChatBot from "./components/ChatBot";
// import ProjectAnalysisDashboard from "./components/ProjectAnalysisDashboard";
// import ReportsManager from "./components/ReportManager";
// import PlanProjectManager from "./components/PlanProjectManager";
// import { LaborUtilizationSummary } from "./components/LaborUtilizationSummary";
// import ManageRole from "./components/ManageRole";
// import PBRReport from "./components/PBRReport";
// import ExcelTabNavigation from "./components/ICETabManage";
// import Pricing from "./components/Pricing";
// import DFARS from "./components/DFARS";
// import ProjectPerformance from "./components/ProjectPerformance";
// import MainTable from "./components/MainTable";
// import POStatusTable from "./components/POStatus";
// import Report from "./components/Report";
// import Approval from "./components/Approval";
// import InvoiceExport from "./components/InvoiceExport";
// import GroupsTable from "./components/GroupsTable";
// import WorkAssignment from "./components/WorkAssignment";
// import GLBudgeting from "./components/GLBudgeting";
// import BudgetByDept from "./components/BudgetByDept";
// import Vendor_Expenses from "./components/Vendor_Exp";
// import CreditCardExpenses from "./components/Credit_Exp";
// import ExportTable from "./components/ExportTable";
// import DashboardGraphs from "./components/DashboardGraphs";
// import Settings from "./components/Settings";
// import UserTable from "./components/UserTable";
// import POTrackerApp from "./components/POTrackerApp";
// import AuthorizedDevice from "./components/AuthorizedDevice";
// import GroupManagement from "./components/GroupManagement";
// import EmployeeProjectPlcMapping from "./components/EmployeeProjectPlcMapping";
// import WorkflowUserMapping from "./components/WorkflowUserMapping";
// import ProjectMaster from "./components/ProjectMaster";
// import EmployeeMaster from "./components/EmployeeMaster";
// import ProjectUserMapping from "./components/ProjectUserMapping";
// import ApprovalEnquiry from "./components/ApprovalEnquiry";

// function App() {
//   const getCurrentUserContext = () => {
//     try {
//       const userString = localStorage.getItem("currentUser");
//       if (!userString) return { userId: "", role: "" };
//       const userObj = JSON.parse(userString);
//       return {
//         userId: userObj.userId ?? "",
//         role: userObj.role?.toLowerCase() ?? "",
//         // roleName: user
//       };
//     } catch {
//       return { userId: "", role: "" };
//     }
//   };

//   const { userId, role } = getCurrentUserContext();

//   const isAuthenticated = Boolean(role);
//   const isAdmin = role === "admin";

//   const datasetName = import.meta.env.VITE_DATASET_NAME;
//   const datasetName2 = import.meta.env.VITE_DATASET_NAME2;
//   const datasetName3 = import.meta.env.VITE_DATASET_NAME3;
//   const datasetName4 = import.meta.env.VITE_DATASET_NAME4;
//   const datasetName5 = import.meta.env.VITE_DATASET_NAME5;

//   const RequireAuth = ({ children }) =>
//     isAuthenticated ? children : <Navigate to="/login" replace />;

//   const RequireAdmin = ({ children }) =>
//     isAdmin ? (
//       children
//     ) : (
//       <Navigate to="/dashboard/project-budget-status" replace />
//     );
//   // isAdmin ? children : <NotFound />;

//   // Add this helper component inside App.jsx or import it
//   const RequirePermission = ({ screenKey, children }) => {
//     // 1. Check if user is Admin (admins bypass all screen restrictions based on your logic)
//     try {
//       const userString = localStorage.getItem("currentUser");
//       if (userString) {
//         const userObj = JSON.parse(userString);
//         if (userObj.role?.toUpperCase() === "ADMIN") {
//           return children;
//         }
//       }
//     } catch (e) {
//       console.error("Error checking admin role:", e);
//     }

//     // 2. Fetch visibility from your stored state/localStorage or cache if saved,
//     // Alternatively, you can pull it from a shared context or storage.
//     // Assuming visibility configuration or user settings are saved or cached,
//     // let's read it safely from a global place or local storage if stored there,
//     // or pass a lightweight check function.
//     // Here we check the user organization object stored in localStorage or API cache:
//     const currentUserString = localStorage.getItem("currentUser") || "{}";

//     // Note: If you store the raw visibility config object in localStorage during login/load:
//     // e.g., localStorage.setItem("userVisibility", JSON.stringify(mergedVisibility));
//     const cachedVisibility = JSON.parse(
//       localStorage.getItem("userVisibility") || "{}",
//     );

//     const hasViewAccess =
//       Object.keys(cachedVisibility).length === 0 ||
//       cachedVisibility[screenKey]?.view === true;

//     if (!hasViewAccess) {
//       return (
//         <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full shadow-sm">
//             <div className="text-red-500 text-4xl mb-3">⚠️</div>
//             <h2 className="text-xl font-bold text-gray-800 mb-2">
//               Access Denied
//             </h2>
//             <p className="text-sm text-gray-600">
//               You do not have permission to view this screen (
//               <span className="font-mono font-semibold">{screenKey}</span>).
//               Please contact your administrator if you believe this is an error.
//             </p>
//           </div>
//         </div>
//       );
//     }

//     return children;
//   };

//   if (import.meta.env.VITE_CHECK === "production") {
//     console.log = () => {};
//     console.info = () => {};
//     console.warn = () => {};
//     console.error = () => {};
//   }

//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} />

//           {/* Dashboard Layout and its Children */}
//           <Route
//             path="/dashboard"
//             element={
//               <RequireAuth>
//                 <Dashboard />
//               </RequireAuth>
//             }
//           >
//             {/* Default Index View */}
//             <Route
//               index
//               element={
//                 <div className="flex items-center justify-center min-h-[80vh]">
//                   <div className="max-w-md w-full text-center">
//                     <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
//                       FinAxis
//                     </span>
//                     <h1 className="text-2xl font-semibold text-gray-900 mt-4">
//                       Welcome to FinAxis Planning
//                     </h1>
//                     <p className="text-gray-600 mt-2">
//                       Select an option from the sidebar to get started.
//                     </p>
//                   </div>
//                 </div>
//               }
//             />

//             {/* General Routes */}
//             <Route
//               path="project-budget-status"
//               element={<PlanProjectManager type="PROJECT" />}
//             />
//             <Route
//               path="opp-project"
//               element={<ProjectBudgetStatus type="OPP" />}
//             />
//             <Route
//               path="nb-project"
//               element={<PlanProjectManager type="NBBUD" />}
//             />
//             <Route
//               path="pricing-nb-project"
//               element={<PlanProjectManager type="NBBUDPRICING" />}
//             />
//             <Route
//               path="project-report"
//               element={
//                 <div className="mt-12 ml-2">
//                   <FinancialDashboard />
//                 </div>
//               }
//             />
//             <Route
//               path="mass-utility"
//               element={
//                 <div className="mt-12 ml-2">
//                   <MassUtilityProject isForPricing={false} />
//                 </div>
//               }
//             />
//             <Route
//               path="pricing-mass-utility"
//               element={
//                 <div className="mt-12 ml-2">
//                   <MassUtilityProject isForPricing={true} />
//                 </div>
//               }
//             />
//             <Route
//               path="import-utility"
//               element={
//                 <div className="mt-12 ml-2">
//                   <Import />
//                 </div>
//               }
//             />
//             <Route path="projectmapping" element={<UserOrgProjectMapping />} />
//             <Route
//               path="new-business"
//               element={
//                 <div className="mt-10">
//                   <NewBusinessComponent
//                     title="Manage New Business"
//                     isForPricing={false}
//                   />
//                 </div>
//               }
//             />
//             <Route
//               path="pricing-new-business"
//               element={
//                 <div className="mt-10">
//                   <NewBusinessComponent
//                     title="Contract Setup"
//                     isForPricing={true}
//                   />
//                 </div>
//               }
//             />
//             <Route
//               path="create-project-budget"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <CreateProjectBudget />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="import-opportunity"
//               element={
//                 <div className="mt-12 ml-2">
//                   <Opportunities />
//                 </div>
//               }
//             />

//             <Route
//               path="monthly-forecast"
//               element={
//                 <div className="mt-12 ml-2">
//                   <AnalysisByPeriodContent />
//                 </div>
//               }
//             />
//             <Route
//               path="financial-report"
//               element={
//                 <div className="mt-12 ml-2">
//                   <FinancialReport />
//                 </div>
//               }
//             />
//             <Route
//               path="pbr-report"
//               element={
//                 <div className="mt-12 ml-2">
//                   <PBRReport />
//                 </div>
//               }
//             />
//             <Route
//               path="ice-tabs"
//               element={
//                 <div className="mt-12 ml-2">
//                   <ExcelTabNavigation />
//                 </div>
//               }
//             />

//             {/* Admin Only Routes */}
//             <Route
//               path="manage-groups"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <ManageGroups />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="manage-users"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <ManageUser />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="manage-roles"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <ManageRole />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="pool-rate-tabs"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12">
//                     <PoolRateTabs />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="role-rights"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <ConfigureField />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="pricing"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <Pricing />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="project-performance"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <ProjectPerformance />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="override-settings"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <OverrideSettings />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="pool-configuration"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <PoolConfigurationTable />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="template-pool-mapping"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <TemplatePoolMapping />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="template"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <Template />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="ceiling-configuration"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12">
//                     <CeilingConfiguration />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="analog-rate"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <AnalogRate />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="global-configuration"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <GlobalConfiguration />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="pricing-dfars"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <DFARS />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="prospective-id-setup"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-10">
//                     <ProspectiveIdSetup />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="display-settings"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <DisplaySettings />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="annual-holidays"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-4">
//                     <AnnualHolidays />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="maintain-fiscal-year-periods"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <MaintainFiscalYearPeriods />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="account-mapping"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-10">
//                     <AccountMapping />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="parametric-rate"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <NBIParametricRate />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="rate-configure"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <RateConfigure />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="pricing-rate-configure"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <PoolRateTabs />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="pbr"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-10">
//                     {" "}
//                     <ControllerDashboard />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="credit-expenses"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-10">
//                     {" "}
//                     <CreditCardExpenses />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="vendor-expenses"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-10">
//                     {" "}
//                     <Vendor_Expenses />
//                   </div>
//                 </RequireAdmin>
//               }
//             />

//             <Route
//               path="reporting-screen"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <ReportsManager />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="quick-budget"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <ProjectExpandableTable />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="db-table-dictionary"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <DBDictionary />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="authorize-device"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <AuthorizedDevice />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="project-variance"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <ProjectVariance />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="labor-utilization-summary"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <LaborUtilizationSummary />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-pstaus"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <POStatusTable />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-create-timesheet"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <MainTable />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-report"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <Report />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-enquiry-approval"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   {/* <Approval /> */}
//                   {isAdmin ? <Approval /> : <ApprovalEnquiry />}
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-invoice-export"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <InvoiceExport />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-employeeplc-mapping"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <EmployeeProjectPlcMapping />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-workflow-mapping"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <WorkflowUserMapping />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-export-table"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <ExportTable />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-project-master"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <ProjectMaster />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-employee-master"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <EmployeeMaster />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-project-user-mapping"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <ProjectUserMapping />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-dashboards"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <DashboardGraphs />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-settings"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <Settings />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-users-table"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <UserTable />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-po-info"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <GroupsTable />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="sub-work-assign"
//               element={
//                 // <RequireAdmin>
//                 <div className="mt-12 ml-2">
//                   {" "}
//                   <WorkAssignment />
//                 </div>
//                 // </RequireAdmin>
//               }
//             />
//             <Route
//               path="gl-budgeting"
//               element={
//                 <div className="mt-12 ml-2">
//                   <GLBudgeting />
//                 </div>
//               }
//             />
//             <Route
//               path="pr-to-po-tracker"
//               element={
//                 <div className="mt-12 ml-2">
//                   <POTrackerApp />
//                 </div>
//               }
//             />
//             <Route
//               path="cfo-bi-reports"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <BIReports datasetName={datasetName} />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="cfo-bi-reports-labor"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <BIReports datasetName={datasetName2} />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="total-company-bi-reports"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <BIReports datasetName={datasetName3} />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="top10-bottom10-bi-reports"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <BIReports datasetName={datasetName4} />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="current-month-actuals-vs-forecast"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     {" "}
//                     <BIReports datasetName={datasetName5} />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="corporate-budget-department"
//               element={
//                 <div className="mt-12 ml-2">
//                   <BudgetByDept />
//                 </div>
//               }
//             />
//             <Route
//               path="group-management"
//               element={
//                 <div className="mt-12 ml-2">
//                   <GroupManagement />
//                 </div>
//               }
//             />
//             <Route
//               path="our-ai"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <ChatBot />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//             <Route
//               path="project-analysis-dash"
//               element={
//                 <RequireAdmin>
//                   <div className="mt-12 ml-2">
//                     <ProjectAnalysisDashboard />
//                   </div>
//                 </RequireAdmin>
//               }
//             />
//           </Route>

//           <Route path="*" element={<ProjectBudgetStatus type="PROJECT" />} />
//         </Routes>
//       </Router>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         className="!mt-14"
//       />
//       <ToastContainer
//         containerId="alert-container"
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={true}
//         closeOnClick={false}
//         className="!mt-14"
//       />
//     </>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages & Components
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import ProjectBudgetStatus from "./components/ProjectBudgetStatus";
import FinancialDashboard from "./components/FinancialDashboard";
import MassUtilityProject from "./components/MassUtilityProject";
import Import from "./components/Import";
import UserOrgProjectMapping from "./components/UserOrgProjectMapping";
import NewBusinessComponent from "./components/NewBusinessComponent";
import CreateProjectBudget from "./components/CreateProjectBudget";
import Opportunities from "./components/Opportunities";
import ManageGroups from "./components/ManageGroups";
import ManageUser from "./components/ManageUser";
import AnalysisByPeriodContent from "./components/AnalysisByPeriodContent";
import PoolRateTabs from "./components/PoolRateTabs";
import ConfigureField from "./components/ConfigureField";
import OverrideSettings from "./components/OverrideSettings";
import PoolConfigurationTable from "./components/PoolConfigurationTable";
import TemplatePoolMapping from "./components/TemplatePoolMapping";
import Template from "./components/Template";
import CeilingConfiguration from "./components/CeilingConfiguration";
import AnalogRate from "./components/AnalogRate";
import GlobalConfiguration from "./components/GlobalConfiguration";
import ProspectiveIdSetup from "./components/ProspectiveIdSetup";
import DisplaySettings from "./components/DisplaySettings";
import AnnualHolidays from "./components/HolidayCalendar";
import MaintainFiscalYearPeriods from "./components/MaintainFiscalYearPeriods";
import AccountMapping from "./components/AccountMapping";
import FinancialReport from "./components/FinancialReport";
import { backendUrl } from "./components/config";
import NBIParametricRate from "./components/NBIParametricRate";
import RateConfigure from "./components/RateConfigure";
import ControllerDashboard from "./components/PBRS";
import ReportingScreen from "./components/ReportingScreen";
import ProjectExpandableTable from "./components/ProjectExpandableTable";
import DBDictionary from "./components/DBDictionary";
import { ProjectVariance } from "./components/ProjectVariance";
import BIReports from "./components/BIReports";
import ChatBot from "./components/ChatBot";
import ProjectAnalysisDashboard from "./components/ProjectAnalysisDashboard";
import ReportsManager from "./components/ReportManager";
import PlanProjectManager from "./components/PlanProjectManager";
import { LaborUtilizationSummary } from "./components/LaborUtilizationSummary";
import ManageRole from "./components/ManageRole";
import PBRReport from "./components/PBRReport";
import ExcelTabNavigation from "./components/ICETabManage";
import Pricing from "./components/Pricing";
import DFARS from "./components/DFARS";
import ProjectPerformance from "./components/ProjectPerformance";
import MainTable from "./components/MainTable";
import POStatusTable from "./components/POStatus";
import Report from "./components/Report";
import Approval from "./components/Approval";
import InvoiceExport from "./components/InvoiceExport";
import GroupsTable from "./components/GroupsTable";
import WorkAssignment from "./components/WorkAssignment";
import GLBudgeting from "./components/GLBudgeting";
import BudgetByDept from "./components/BudgetByDept";
import Vendor_Expenses from "./components/Vendor_Exp";
import CreditCardExpenses from "./components/Credit_Exp";
import ExportTable from "./components/ExportTable";
import DashboardGraphs from "./components/DashboardGraphs";
import Settings from "./components/Settings";
import UserTable from "./components/UserTable";
import POTrackerApp from "./components/POTrackerApp";
import AuthorizedDevice from "./components/AuthorizedDevice";
import GroupManagement from "./components/GroupManagement";
import EmployeeProjectPlcMapping from "./components/EmployeeProjectPlcMapping";
import WorkflowUserMapping from "./components/WorkflowUserMapping";
import ProjectMaster from "./components/ProjectMaster";
import EmployeeMaster from "./components/EmployeeMaster";
import ProjectUserMapping from "./components/ProjectUserMapping";
import ApprovalEnquiry from "./components/ApprovalEnquiry";
import LeaveProjectMapping from "./components/LeaveProjectMapping";
import TimesheetScheduleManager from "./components/TimesheetScheduleManager";
import ProjectPlcMapping from "./components/ProjectPlcMapping";
import SubkTimesheetExport from "./components/SubkTimesheetExport";
import CapCommInteractiveInvoiceBuilder from "./components/CapCommStaticInvoiceViewer";

function App() {
  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
      };
    } catch {
      return { userId: "", role: "" };
    }
  };

  const { userId, role } = getCurrentUserContext();

  const isAuthenticated = Boolean(role);
  const isAdmin = role === "admin";

  const datasetName = import.meta.env.VITE_DATASET_NAME;
  const datasetName2 = import.meta.env.VITE_DATASET_NAME2;
  const datasetName3 = import.meta.env.VITE_DATASET_NAME3;
  const datasetName4 = import.meta.env.VITE_DATASET_NAME4;
  const datasetName5 = import.meta.env.VITE_DATASET_NAME5;

  const RequireAuth = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />;

  const RequireAdmin = ({ children }) =>
    isAdmin ? (
      children
    ) : (
      <Navigate to="/dashboard/project-budget-status" replace />
    );

  const RequirePermission = ({ screenKey, children }) => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (userString) {
        const userObj = JSON.parse(userString);
        // if (userObj.role?.toUpperCase() === "ADMIN") {
        //   return children;
        // }
      }
    } catch (e) {
      console.error("Error checking admin role:", e);
    }

    const cachedVisibility = JSON.parse(
      localStorage.getItem("userVisibility") || "{}",
    );

    const hasViewAccess =
      Object.keys(cachedVisibility).length === 0 ||
      cachedVisibility[screenKey]?.view === true;

    if (!hasViewAccess) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full shadow-sm">
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-gray-600">
              You do not have permission to view this screen 
              {/* (<span className="font-mono font-semibold">{screenKey}</span>). */}
              Please contact your administrator if you believe this is an error.
            </p>
          </div>
        </div>
      );
    }

    return children;
  };

  if (import.meta.env.VITE_CHECK === "production") {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard Layout and its Children */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          >
            {/* Default Index View */}
            <Route
              index
              element={
                <div className="flex items-center justify-center min-h-[80vh]">
                  <div className="max-w-md w-full text-center">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
                      FedAxis
                    </span>
                    <h1 className="text-2xl font-semibold text-gray-900 mt-4">
                      Welcome to FedAxis
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Select an option from the sidebar to get started.
                    </p>
                  </div>
                </div>
              }
            />

            {/* General & Mapped Routes with Permission Checks */}
            <Route
              path="project-budget-status"
              element={
                <RequirePermission screenKey="planprojects">
                  <PlanProjectManager type="PROJECT" />
                </RequirePermission>
              }
            />
            <Route
              path="opp-project"
              element={
                <RequirePermission screenKey="planopportunities">
                  <ProjectBudgetStatus type="OPP" />
                </RequirePermission>
              }
            />
            <Route
              path="nb-project"
              element={
                <RequirePermission screenKey="plannewbusinesses">
                  <PlanProjectManager type="NBBUD" />
                </RequirePermission>
              }
            />
            <Route
              path="pricing-nb-project"
              element={
                <RequirePermission screenKey="proposalbuilder">
                  <PlanProjectManager type="NBBUDPRICING" />
                </RequirePermission>
              }
            />
            <Route
              path="project-report"
              element={
                <RequirePermission screenKey="executivedashboard">
                  <div className="mt-12 ml-2">
                    <FinancialDashboard />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="mass-utility"
              element={
                <RequirePermission screenKey="massutility">
                  <div className="mt-12 ml-2">
                    <MassUtilityProject isForPricing={false} />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pricing-mass-utility"
              element={
                <RequirePermission screenKey="massUtility">
                  <div className="mt-12 ml-2">
                    <MassUtilityProject isForPricing={true} />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="import-utility"
              element={
                <div className="mt-12 ml-2">
                  <Import />
                </div>
              }
            />
            <Route
              path="projectmapping"
              element={
                <RequirePermission screenKey="accessmapping">
                  <UserOrgProjectMapping />
                </RequirePermission>
              }
            />
            <Route
              path="new-business"
              element={
                <RequirePermission screenKey="managenewbusiness">
                  <div className="mt-10">
                    <NewBusinessComponent
                      title="Manage New Business"
                      isForPricing={false}
                    />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pricing-new-business"
              element={
                <RequirePermission screenKey="contractsetup">
                  <div className="mt-10">
                    <NewBusinessComponent
                      title="Contract Setup"
                      isForPricing={true}
                    />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="create-project-budget"
              element={
                <RequirePermission screenKey="transferprojcetbudget">
                  <div className="mt-12 ml-2">
                    <CreateProjectBudget />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="import-opportunity"
              element={
                <RequirePermission screenKey="importopportunities">
                  <div className="mt-12 ml-2">
                    <Opportunities />
                  </div>
                </RequirePermission>
              }
            />

            <Route
              path="monthly-forecast"
              element={
                // <RequirePermission screenKey="monthlyForecast">
                <div className="mt-12 ml-2">
                  <AnalysisByPeriodContent />
                </div>
                // </RequirePermission>
              }
            />
            <Route
              path="financial-report"
              element={
                // <RequirePermission screenKey="report">
                <div className="mt-12 ml-2">
                  <FinancialReport />
                </div>
                // </RequirePermission>
              }
            />
            <Route
              path="pbr-report"
              element={
                <RequirePermission screenKey="PBR">
                  <div className="mt-12 ml-2">
                    <PBRReport />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="ice-tabs"
              element={
                <RequirePermission screenKey="ICE">
                  <div className="mt-12 ml-2">
                    <ExcelTabNavigation />
                  </div>
                </RequirePermission>
              }
            />

            {/* Admin / Config & General Routes */}
            <Route
              path="manage-groups"
              element={
                <RequirePermission screenKey="managegroups">
                  <div className="mt-12 ml-2">
                    <ManageGroups />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="manage-users"
              element={
                <RequirePermission screenKey="manageuser">
                  <div className="mt-12 ml-2">
                    <ManageUser />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="manage-roles"
              element={
                <RequirePermission screenKey="manageroles">
                  <div className="mt-12 ml-2">
                    <ManageRole />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pool-rate-tabs"
              element={
                <RequirePermission screenKey="rateconfiguration">
                  <div className="mt-12">
                    <PoolRateTabs />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="role-rights"
              element={
                <RequireAdmin>
                  <div className="mt-12 ml-2">
                    <ConfigureField />
                  </div>
                </RequireAdmin>
              }
            />
            <Route
              path="pricing"
              element={
                <RequirePermission screenKey="pricingstudio">
                  <div className="mt-12 ml-2">
                    <Pricing />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="project-performance"
              element={
                <RequirePermission screenKey="projectperformance">
                  <div className="mt-12 ml-2">
                    <ProjectPerformance />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="override-settings"
              element={
                <RequirePermission screenKey="configurationsettings">
                  <div className="mt-12 ml-2">
                    <OverrideSettings />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pool-configuration"
              element={
                <RequirePermission screenKey="rateconfiguration">
                  <div className="mt-12 ml-2">
                    <PoolConfigurationTable />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="template-pool-mapping"
              element={
                <RequirePermission screenKey="ratecomputation">
                  <div className="mt-12 ml-2">
                    <TemplatePoolMapping />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="template"
              element={
                <RequirePermission screenKey="configurationsettings">
                  <div className="mt-12 ml-2">
                    <Template />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="ceiling-configuration"
              element={
                <RequirePermission screenKey="ceilingconfiguration">
                  <div className="mt-12">
                    <CeilingConfiguration />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="analog-rate"
              element={
                <RequirePermission screenKey="analogousrate">
                  <div className="mt-12 ml-2">
                    <AnalogRate />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="global-configuration"
              element={
                <RequirePermission screenKey="configurationsettings">
                  <div className="mt-12 ml-2">
                    <GlobalConfiguration />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pricing-dfars"
              element={
                <RequirePermission screenKey="costProposalandPricing">
                  <div className="mt-12 ml-2">
                    <DFARS />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="prospective-id-setup"
              element={
                <RequirePermission screenKey="prospectiveidsetup">
                  <div className="mt-10">
                    <ProspectiveIdSetup />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="display-settings"
              element={
                <RequirePermission screenKey="configurationsettings">
                  <div className="mt-12 ml-2">
                    <DisplaySettings />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="annual-holidays"
              element={
                <RequirePermission screenKey="annualholidays">
                  <div className="mt-4">
                    <AnnualHolidays />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="maintain-fiscal-year-periods"
              element={
                <RequirePermission screenKey="fiscalyearperiods">
                  <div className="mt-12 ml-2">
                    <MaintainFiscalYearPeriods />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="account-mapping"
              element={
                <RequirePermission screenKey="accountmapping">
                  <div className="mt-10">
                    <AccountMapping />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="parametric-rate"
              element={
                <RequirePermission screenKey="parametricrate">
                  <div className="mt-12 ml-2">
                    <NBIParametricRate />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="rate-configure"
              element={
                <RequirePermission screenKey="ratecomputation">
                  <div className="mt-12 ml-2">
                    <RateConfigure />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pricing-rate-configure"
              element={
                <RequirePermission screenKey="rateconfiguration">
                  <div className="mt-12 ml-2">
                    <PoolRateTabs />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pbr"
              element={
                <RequirePermission screenKey="PBR">
                  <div className="mt-10">
                    <ControllerDashboard />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="credit-expenses"
              element={
                <RequirePermission screenKey="otherCost">
                  <div className="mt-10">
                    <CreditCardExpenses />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="vendor-expenses"
              element={
                <RequirePermission screenKey="otherCost">
                  <div className="mt-10">
                    <Vendor_Expenses />
                  </div>
                </RequirePermission>
              }
            />

            <Route
              path="reporting-screen"
              element={
                <RequirePermission screenKey="activeReport">
                  <div className="mt-12 ml-2">
                    <ReportsManager />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="quick-budget"
              element={
                <RequirePermission screenKey="quickbudget">
                  <div className="mt-12 ml-2">
                    <ProjectExpandableTable />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="db-table-dictionary"
              element={
                <RequireAdmin>
                  <div className="mt-12 ml-2">
                    <DBDictionary />
                  </div>
                </RequireAdmin>
              }
            />
            <Route
              path="authorize-device"
              element={
                <RequirePermission screenKey="managedevices">
                  <div className="mt-12 ml-2">
                    <AuthorizedDevice />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="project-variance"
              element={
                <RequirePermission screenKey="versionanalysis">
                  <div className="mt-12 ml-2">
                    <ProjectVariance />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="labor-utilization-summary"
              element={
                <RequirePermission screenKey="laborutilization">
                  <div className="mt-12 ml-2">
                    <LaborUtilizationSummary />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-pstaus"
              element={
                <RequirePermission screenKey="postatus">
                  <div className="mt-12 ml-2">
                    <POStatusTable />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-create-timesheet"
              element={
                <RequirePermission screenKey="createtimesheet">
                  <div className="mt-12 ml-2">
                    <MainTable />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-report"
              element={
                <RequirePermission screenKey="report">
                  <div className="mt-12 ml-2">
                    <Report />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-enquiry-approval"
              element={
                <RequirePermission screenKey="enquiryandapproval">
                  <div className="mt-12 ml-2">
                    {isAdmin ? <Approval /> : <ApprovalEnquiry />}
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-invoice-export"
              element={
                <RequirePermission screenKey="invoiceexport">
                  <div className="mt-12 ml-2">
                    <InvoiceExport />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-employeeplc-mapping"
              element={
                <RequirePermission screenKey="employeeplcmapping">
                  <div className="mt-12 ml-2">
                    <EmployeeProjectPlcMapping />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-workflow-mapping"
              element={
                <RequirePermission screenKey="userworkflowmapping">
                  <div className="mt-12 ml-2">
                    <WorkflowUserMapping />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-export-table"
              element={
                <RequirePermission screenKey="generateinvoice">
                  <div className="mt-12 ml-2">
                    {/* <ExportTable /> */}
                    <CapCommInteractiveInvoiceBuilder />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-project-master"
              element={
                <RequirePermission screenKey="manageproject">
                  <div className="mt-12 ml-2">
                    <ProjectMaster />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-employee-master"
              element={
                <RequirePermission screenKey="manageemployee">
                  <div className="mt-12 ml-2">
                    <EmployeeMaster />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-project-user-mapping"
              element={
                <RequirePermission screenKey="employeeplcmapping">
                  <div className="mt-12 ml-2">
                    <ProjectUserMapping />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-dashboards"
              element={
                <RequirePermission screenKey="tmdashboard">
                  <div className="mt-12 ml-2">
                    <DashboardGraphs />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-timesheet-export"
              element={
                <RequirePermission screenKey="tmdashboard">
                  <div className="mt-12 ml-2">
                    <SubkTimesheetExport />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-settings"
              element={
                <RequirePermission screenKey="settings">
                  <div className="mt-12 ml-2">
                    <Settings />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-users-table"
              element={
                <RequirePermission screenKey="manageuser">
                  <div className="mt-12 ml-2">
                    <UserTable />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-po-info"
              element={
                <RequirePermission screenKey="poinfo">
                  <div className="mt-12 ml-2">
                    <GroupsTable />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="sub-work-assign"
              element={
                <RequirePermission screenKey="workorder">
                  <div className="mt-12 ml-2">
                    <WorkAssignment />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="gl-budgeting"
              element={
                <RequirePermission screenKey="byAccount">
                  <div className="mt-12 ml-2">
                    <GLBudgeting />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="pr-to-po-tracker"
              element={
                <RequirePermission screenKey="dashboard">
                  <div className="mt-12 ml-2">
                    <POTrackerApp />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="cfo-bi-reports"
              element={
                <RequirePermission screenKey="cfoReports">
                  <div className="mt-12 ml-2">
                    <BIReports datasetName={datasetName} />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="cfo-bi-reports-labor"
              element={
                <RequirePermission screenKey="laborUtilization">
                  <div className="mt-12 ml-2">
                    <BIReports datasetName={datasetName2} />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="total-company-bi-reports"
              element={
                <RequirePermission screenKey="totalCompany">
                  <div className="mt-12 ml-2">
                    <BIReports datasetName={datasetName3} />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="top10-bottom10-bi-reports"
              element={
                <RequirePermission screenKey="top10Bottom10Projects">
                  <div className="mt-12 ml-2">
                    <BIReports datasetName={datasetName4} />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="current-month-actuals-vs-forecast"
              element={
                <RequirePermission screenKey="currentMonthActualsVsForecast">
                  <div className="mt-12 ml-2">
                    <BIReports datasetName={datasetName5} />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="corporate-budget-department"
              element={
                <RequirePermission screenKey="byDivision">
                  <div className="mt-12 ml-2">
                    <BudgetByDept />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="group-management"
              element={
                <RequirePermission screenKey="groupmanagement">
                  <div className="mt-12 ml-2">
                    <GroupManagement />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="leave-project-mapping"
              element={
                  <div className="mt-12 ml-2">
                    <LeaveProjectMapping />
                  </div>
              }
            />
            <Route
              path="sub-schedule-manager"
              element={
                // <RequirePermission screenKey="invoiceexport">
                <div className="mt-12 ml-2">
                  <TimesheetScheduleManager />
                </div>
                // </RequirePermission>
              }
            />
            <Route
              path="sub-plc-mapping"
              element={
                // <RequirePermission screenKey="invoiceexport">
                <div className="mt-12 ml-2">
                  <ProjectPlcMapping />
                </div>
                // </RequirePermission>
              }
            />
            <Route
              path="our-ai"
              element={
                <RequirePermission screenKey="bireports">
                  <div className="mt-12 ml-2">
                    <ChatBot />
                  </div>
                </RequirePermission>
              }
            />
            <Route
              path="project-analysis-dash"
              element={
                <RequirePermission screenKey="projectconsole">
                  <div className="mt-12 ml-2">
                    <ProjectAnalysisDashboard />
                  </div>
                </RequirePermission>
              }
            />
          </Route>

          <Route path="*" element={<ProjectBudgetStatus type="PROJECT" />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        className="!mt-14"
      />
      <ToastContainer
        containerId="alert-container"
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick={false}
        className="!mt-14"
      />
    </>
  );
}

export default App;
