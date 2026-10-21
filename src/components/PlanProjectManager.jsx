// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ProjectBudgetStatus from "./ProjectBudgetStatus";

// const PlanProjectManager = ({ type = "" }) => {
//   const navigate = useNavigate();
//   const [activeType, setActiveType] = useState(type);

//   // Sync state whenever the route/prop changes
//   useEffect(() => {
//     setActiveType(type);
//   }, [type]);

//   // Toggle state AND navigate to the corresponding path
//   const handleTogglePlan = (currentType) => {
//     const nextType = currentType === "PROJECT" ? "NBBUD" : "PROJECT";
//     setActiveType(nextType);

//     if (nextType === "NBBUD") {
//       navigate("/dashboard/nb-project");
//     } else {
//       navigate("/dashboard/project-budget-status");
//     }
//   };

//   const isShowingNBBUD = activeType === "NBBUD";

//   return (
//     <div className="relative w-full overflow-hidden min-h-screen bg-slate-50">
//       <div className="grid grid-cols-1 grid-rows-1 w-full">
//         {/* PROJECT View Screen */}
//         <div
//           className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
//             isShowingNBBUD
//               ? "opacity-0 -translate-x-full pointer-events-none"
//               : "opacity-100 translate-x-0"
//           }`}
//         >
//           <ProjectBudgetStatus
//             type="PROJECT"
//             onshowProject={handleTogglePlan}
//           />
//         </div>

//         {/* NBBUD View Screen */}
//         <div
//           className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
//             isShowingNBBUD
//               ? "opacity-100 translate-x-0"
//               : "opacity-0 translate-x-full pointer-events-none"
//           }`}
//         >
//           <ProjectBudgetStatus type="NBBUD" onshowProject={handleTogglePlan} />
//         </div>
//         <div
//           className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
//             isShowingNBBUD
//               ? "opacity-100 translate-x-0"
//               : "opacity-0 translate-x-full pointer-events-none"
//           }`}
//         >
//           <ProjectBudgetStatus
//             type="NBBUDPRICING"
//             onshowProject={handleTogglePlan}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanProjectManager;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectBudgetStatus from "./ProjectBudgetStatus";

const PlanProjectManager = ({ type = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial type from prop or URL path fallback
  const getInitialType = () => {
    if (type) return type;
    const path = location.pathname.toLowerCase();
    if (path.includes("/pricing-nb-project") || path.includes("/nb-project")) {
      return "NBBUD";
    }
    if (path.includes("/pricing-studio")) {
      return "NBBUDPRICING";
    }
    return "PROJECT";
  };

  const [activeType, setActiveType] = useState(getInitialType());

  // Sync state whenever route or prop changes
  useEffect(() => {
    if (type) {
      setActiveType(type);
    } else {
      const path = location.pathname.toLowerCase();
      if (
        path.includes("/pricing-nb-project") ||
        path.includes("/nb-project")
      ) {
        setActiveType("NBBUD");
      } else if (path.includes("/pricing-studio")) {
        setActiveType("NBBUDPRICING");
      } else {
        setActiveType("PROJECT");
      }
    }
  }, [type, location.pathname]);

  // Toggle state and navigate to corresponding path
  const handleTogglePlan = (targetType) => {
    setActiveType(targetType);

    if (targetType === "NBBUD") {
      navigate("/dashboard/nb-project");
    } else if (targetType === "NBBUDPRICING") {
      navigate("/dashboard/pricing-studio");
    } else {
      navigate("/dashboard/project-budget-status");
    }
  };

  const isProject = activeType === "PROJECT";
  const isNbBud = activeType === "NBBUD";
  const isPricing = activeType === "NBBUDPRICING";

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-slate-50">
      <div className="grid grid-cols-1 grid-rows-1 w-full">
        {/* PROJECT View Screen */}
        <div
          className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
            isProject
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <ProjectBudgetStatus
            type="PROJECT"
            onshowProject={() => handleTogglePlan("NBBUD")}
          />
        </div>

        {/* NBBUD View Screen */}
        <div
          className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
            isNbBud
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          <ProjectBudgetStatus
            type="NBBUD"
            onshowProject={() => handleTogglePlan("PROJECT")}
          />
        </div>

        {/* NBBUDPRICING View Screen */}
        <div
          className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
            isPricing
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          <ProjectBudgetStatus
            type="NBBUDPRICING"
            onshowProject={() => handleTogglePlan("PROJECT")}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanProjectManager;
