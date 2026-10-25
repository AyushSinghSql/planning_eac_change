// import React, { useEffect, useState } from "react";
// import { Navigate, useNavigate, Outlet } from "react-router-dom";
// import NavigationSidebar from "../components/NavigationSidebar";
// import TopBar from "../components/TopBar";

// const Dashboard = () => {
//   const [userName, setUserName] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   // hover state (existing)
//   const [isHovered, setIsHovered] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userString = localStorage.getItem("currentUser");
//     if (userString) {
//       try {
//         const userObj = JSON.parse(userString);
//         setUserName(
//           userObj.fullName
//             ? userObj.fullName.replace(/\b\w/g, (c) => c.toUpperCase())
//             : "null",
//         );
//       } catch {
//         navigate("/login", { replace: true });
//       }
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     try {
//       localStorage.removeItem("currentUser");
//       localStorage.removeItem("authToken");
//     } catch {}
//     navigate("/login", { replace: true });
//   };

//   // Auth Guard
//   const storedUser = localStorage.getItem("currentUser");
//   if (!storedUser) return <Navigate to="/login" replace />;

//   const sidebarWidth = isHovered ? "w-[190px]" : "w-[56px]";
//   return (
//     <>
//       {/* Top Bar - Kept Fixed */}
//       <div className="fixed top-0 left-0 right-0 z-90 h-14 bg-white border-b border-gray-200 flex items-center">
//         <TopBar fullName={userName} onLogout={handleLogout} />
//       </div>

//       {/* Main Container */}
//       <div className="flex h-screen overflow-hidden bg-[#E6F2F5]">
//         {/* Sidebar Container */}
//         {/* <div className="group bg-white border-r border-gray-200 h-full w-[56px] hover:w-[190px] transition-all duration-300">
//           <NavigationSidebar isHovered={isHovered} isSidebarOpen=
//           {isSidebarOpen} setIsHovered={setIsHovered} setIsSidebarOpen={setIsSidebarOpen} />
//         </div> */}
//         <div
//           className={`group h-full transition-all duration-300 ${sidebarWidth} `}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <NavigationSidebar
//             isSidebarOpen={isSidebarOpen}
//             setIsSidebarOpen={setIsSidebarOpen}
//             isHovered={isHovered}
//             setIsHovered={setIsHovered}
//           />
//         </div>

//         {/* Main Content Area */}
//         <div
//           className={`flex-1 h-full mt-4 overflow-y-auto `}
//           style={{ scrollbarGutter: "stable" }}
//         >
//           <Outlet />
//         </div>
//         {/* <div
//           className={`flex-1 h-[calc(100vh-40px)] p-4 ml-2  `}
//           style={{ scrollbarGutter: "stable" }}

//         >
//           <Outlet />
//         </div>  */}
//       </div>
//     </>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import NavigationSidebar from "../components/NavigationSidebar";
import TopBar from "../components/TopBar";
import axios from "axios";
import { backendUrl } from "../components/config";
import ChatBot from "../components/ChatBot";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 1. Add persistent or local isLocked state
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem("sidebar_locked") === "true";
  });

  // Visibility States & Loading
  const [visibility, setVisibility] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // 1. Fetch User Visibility Configuration
  const loadConfig = async () => {
    setLoading(true);
    try {
      const currentUserString = localStorage.getItem("currentUser") || "{}";
      const currentUserObj = JSON.parse(currentUserString);
      const userRole = (currentUserObj.role || "").toUpperCase();

      // If user is ADMIN, skip network rules or handle empty responses by defaulting to show all
      // if (userRole === "ADMIN") {
      //   // Option A: Skip API fetch entirely and keep visibility clear so fallback takes over
      //   setVisibility({});
      //   setLoading(false);
      //   return;
      // }

      const res = await axios.get(`${backendUrl}/Orgnization/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("currentUser") || "{}").token ?? ""}`,
        },
      });

      const data = res.data || {};
      const mergedVisibility = {
        ...(data.screens || {}),
        ...(data.fields || {}),
      };
      setVisibility(mergedVisibility);
      localStorage.setItem("userVisibility", JSON.stringify(mergedVisibility));
      console.log(mergedVisibility);
    } catch (e) {
      setVisibility({});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user?.userId) return;

    loadConfig();
  }, [user?.userId]);

  // 2. Parse User Metadata & Handle Auth Redirection
  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        setUserName(
          userObj.fullName
            ? userObj.fullName.replace(/\b\w/g, (c) => c.toUpperCase())
            : "null",
        );
      } catch {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate]);

  // Permission Helper Functions
  // const canView = (key) => visibility[key]?.view === true;
  // const canEdit = (key) => visibility[key]?.edit === true;

  const canView = (key) => {
    // 1. Check if the logged-in user is an Admin
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        // if (userObj.role?.toUpperCase() === "ADMIN") {
        //   return true; // Bypass restriction and show all screens/fields
        // }
      } catch (e) {
        console.error("Error parsing user role for permission check:", e);
      }
    }

    // 2. Fallback to normal behavior for regular users
    if (!visibility || Object.keys(visibility).length === 0) return true;
    return visibility[key]?.view === true;
  };

  const canEdit = (key) => {
    // 1. Check if the logged-in user is an Admin
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        // if (userObj.role?.toUpperCase() === "ADMIN") {
        //   return true; // Bypass restriction and allow edits everywhere
        // }
      } catch (e) {
        console.error("Error parsing user role for permission check:", e);
      }
    }

    // 2. Fallback to normal behavior for regular users
    if (!visibility || Object.keys(visibility).length === 0) return false;
    return visibility[key]?.edit === true;
  };

  // const handleLogout = () => {
  //   try {
  //     localStorage.removeItem("currentUser");
  //     localStorage.removeItem("authToken");
  //   } catch {}
  //   navigate("/login", { replace: true });
  // };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/User/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");

      navigate("/login", { replace: true });
    }
  };

  // Auth Guard
  if (!localStorage.getItem("currentUser")) {
    return <Navigate to="/login" replace />;
  }

  const toggleLock = () => {
    setIsLocked((prev) => {
      const nextState = !prev;
      localStorage.setItem("sidebar_locked", String(nextState));
      return nextState;
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-inter bg-[#E6F2F5]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 text-sm sm:text-base">
          Loading Config...
        </span>
      </div>
    );
  }

  // const sidebarWidth = isHovered ? "w-[190px]" : "w-[56px]";
  const sidebarWidth = isLocked || isHovered ? "w-[190px]" : "w-[56px]";

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-90 h-14 bg-white border-b border-gray-200 flex items-center">
        <TopBar fullName={userName} onLogout={handleLogout} />
      </div>

      {/* Main Container */}
      <div className="flex h-screen overflow-hidden bg-[#E6F2F5]">
        {/* Sidebar Container */}
        <div
          className={`group h-full transition-all duration-300 ${sidebarWidth}`}
          // onMouseEnter={() => setIsHovered(true)}
          // onMouseLeave={() => setIsHovered(false)}
          onMouseEnter={() => {
            if (!isLocked) setIsHovered(true);
          }}
          onMouseLeave={() => {
            if (!isLocked) setIsHovered(false);
          }}
        >
          <NavigationSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            visibility={visibility}
            canView={canView}
            canEdit={canEdit}
            toggleLock={toggleLock}
            isLocked={isLocked}
          />
        </div>

        {/* Main Content Area */}
        <div
          className="flex-1 h-full mt-4 overflow-y-auto "
          style={{ scrollbarGutter: "stable" }}
        >
          {/* CRITICAL CHANGE: Passing the context to child routes */}
          <Outlet context={{ visibility, canView, canEdit, loadConfig }} />
        </div>
        {/* <ChatBot /> */}
      </div>
    </>
  );
};

export default Dashboard;
