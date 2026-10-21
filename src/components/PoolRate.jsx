import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { backendUrl } from "./config";

// Basic Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "Please try again later."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const PoolRate = ({
  userName = "User",
  selectedTemplateId,
  initialYear = "All",
  isFromProjectBudgetStatus = false,
  selectedPlan = null,
  yearOptions = [],
}) => {
  const [templates, setTemplates] = useState([]);
  const [pools, setPools] = useState([]);
  const [allPoolsData, setAllPoolsData] = useState([]); // Stores raw pools response for Escalation Table
  const [poolEscalations, setPoolEscalations] = useState({}); // Stores year-specific esc_Percent map { [code]: esc_Percent }
  const [editedEscalations, setEditedEscalations] = useState(new Set()); // Tracks changed pool codes

  const [selectedTemplate, setSelectedTemplate] = useState(
    selectedTemplateId || "",
  );
  // const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedYear, setSelectedYear] = useState(
    initialYear && initialYear !== "" ? initialYear : "All",
  );
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editMonths, setEditMonths] = useState(new Set());
  const [findValue, setFindAndReplace] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [selectedPools, setSelectedPools] = useState([]);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);

  const [bulkEscConfig, setBulkEscConfig] = useState({
    selectedPools: [], // Array of poolIds
    escValue: "",
    fromMonth: "January",
    toMonth: "December",
    fromYear: selectedYear,
    toYear: selectedYear,
  });

  const [escalationConfigs, setEscalationConfigs] = useState({
    escallation_percent: "",
    vendor_escallation_percent: "",
    nonlabor_escallation_percent: "",
  });

  const [isEscalationEdited, setIsEscalationEdited] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const initialMonthlyData = useRef([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  // const currentYear = new Date().getFullYear();
  // const years = [
  //   "All",
  //   ...Array.from({ length: 20 }, (_, i) => currentYear - 10 + i),
  // ];

  const { visibility, canView, canEdit } = useOutletContext();

  console.log(initialYear);

  const isEditable = canEdit("poolRateTabs");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const isNavigating = useRef(false);
  const pendingNavigation = useRef(null);

  // useEffect(() => {
  //   if (initialYear || initialYear === "All") {
  //     setSelectedYear(initialYear);
  //   }
  // }, [initialYear]);
  // 1. Keep this useEffect ACTIVE to sync incoming prop updates
  useEffect(() => {
    if (initialYear) {
      setSelectedYear(initialYear);
    } else {
      setSelectedYear("All");
    }
  }, [initialYear]);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/Orgnization/GetAllTemplates`,
        );
        // console.log("Templates API Response:", response.data);
        setTemplates(response.data || []);
        setError(null);
      } catch (err) {
        const errorMessage =
          "Failed to fetch templates: " +
          (err.response?.data?.message || err.message || "Unknown error");
        setError(errorMessage);
        // console.error(errorMessage, err);
        toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleApplyBulkEscalation = () => {
    const { selectedPools, escValue, fromMonth, toMonth, fromYear, toYear } =
      bulkEscConfig;

    if (!selectedPools.length) {
      toast.error("Please select at least one pool.");
      return;
    }

    const escNum = parseFloat(escValue);
    if (isNaN(escNum) || escNum < 0) {
      toast.error("Please enter a valid positive escalation percentage.");
      return;
    }

    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const startMonthIdx = monthOrder.indexOf(fromMonth);
    const endMonthIdx = monthOrder.indexOf(toMonth);
    const startYr = parseInt(fromYear, 10);
    const endYr = parseInt(toYear, 10);

    const newEditKeys = new Set(editMonths);

    const updatedMonthly = monthlyData.map((m) => {
      const rowYr = parseInt(m.year || selectedYear, 10);
      const rowMIdx = monthOrder.indexOf(m.month);

      // Date range validation check across month/year
      const isAfterStart =
        rowYr > startYr || (rowYr === startYr && rowMIdx >= startMonthIdx);
      const isBeforeEnd =
        rowYr < endYr || (rowYr === endYr && rowMIdx <= endMonthIdx);

      if (!isAfterStart || !isBeforeEnd) return m;

      const updatedRates = { ...m.rates };

      selectedPools.forEach((poolId) => {
        const rateObj = updatedRates[poolId] || {};
        const actual = parseFloat(rateObj.actualRate || 0);
        const calculatedTarget = (actual * (1 + escNum / 100)).toFixed(6);

        updatedRates[poolId] = {
          ...rateObj,
          escPercent: escValue,
          targetRate: calculatedTarget,
        };

        newEditKeys.add(`${m.month}_${poolId}`);
      });

      return { ...m, rates: updatedRates };
    });

    setMonthlyData(updatedMonthly);
    setEditMonths(newEditKeys);
    toast.success("Bulk escalation applied successfully.");
  };

  const normalizedFiscalYear =
    selectedYear === "All" || !selectedYear
      ? "All"
      : String(selectedYear).trim();

  const yearParam =
    selectedYear === "All" || !selectedYear
      ? 0
      : encodeURIComponent(selectedYear);

  useEffect(() => {
    const fetchDirectEscallation = async () => {
      if (!isFromProjectBudgetStatus || !selectedPlan) return;

      const planId = selectedPlan?.plId || selectedPlan;
      if (!planId) return;

      try {
        const response = await axios.get(
          `${backendUrl}/api/PlDirectEscallation/${planId}`,
        );

        if (response.data) {
          setEscalationConfigs({
            escallation_percent: response.data.labEsc ?? "",
            vendor_escallation_percent: response.data.vendEsc ?? "",
            nonlabor_escallation_percent: response.data.nonLabEsc ?? "",
          });
          setIsEscalationEdited(false);
        }
      } catch (err) {
        // Fallback to selectedPlan values if GET fails
        setEscalationConfigs({
          escallation_percent: selectedPlan?.escallation_percent ?? "",
          vendor_escallation_percent:
            selectedPlan?.vendor_escallation_percent ?? "",
          nonlabor_escallation_percent:
            selectedPlan?.nonlabor_escallation_percent ?? "",
        });
      }
    };

    fetchDirectEscallation();
  }, [isFromProjectBudgetStatus, selectedPlan]);

  useEffect(() => {
    // if (!selectedTemplate) {
    //   setPools([]);
    //   setMonthlyData([]);
    //   setEditMonths(new Set());
    //   setSelectedPools([]);
    //   return;
    // }
    if (!isFromProjectBudgetStatus) {
      if (!selectedTemplate || selectedYear === "" || selectedYear === "All") {
        setPools([]);
        setMonthlyData([]);
        setEditMonths(new Set());
        setSelectedPools([]);
        return;
      }
    } else {
      // If coming from Project Budget Status, require at least the template
      if (!selectedTemplate) {
        setPools([]);
        setMonthlyData([]);
        setEditMonths(new Set());
        setSelectedPools([]);
        return;
      }
    }

    // const fetchPoolsAndRates = async () => {
    //   setLoading(true);
    //   try {
    //     // const poolsResponse = await axios.get(
    //     //   `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${selectedTemplate}`,
    //     // );
    //     const requests = [
    //       axios.get(
    //         `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${selectedTemplate}`,
    //       ),
    //     ];

    //     // if (isFromProjectBudgetStatus) {
    //     //   requests.push(axios.get(`${backendUrl}/Orgnization/GetAllPools`));
    //     // }
    //     // console.log("Pools API Response:", poolsResponse.data);
    //     // const poolList = poolsResponse.data || [];
    //     const [poolsResponse, allPoolsResponse] = await Promise.all(requests);
    //     const rawPoolList = poolsResponse.data || [];

    //     const poolList = rawPoolList.filter(
    //       (pool) =>
    //         !["FRINGEONGNA", "OVERHEADONGNA", "FRINGEONOVERHEAD"].includes(
    //           pool.poolId,
    //         ),
    //     );

    //     // Process All Pools for top Escalation table when flag is true
    //     if (isFromProjectBudgetStatus) {
    //       setAllPoolsData(poolList);

    //       const initialEscMap = {};
    //       const selectedYearNum = parseInt(selectedYear, 10);

    //       poolList.forEach((pool) => {
    //         // Look inside pool.escPercent array for the year record
    //         const yearEscObj = pool.escPercent?.find(
    //           (e) => Number(e.year) === selectedYearNum,
    //         );

    //         // Priority: pooled specific-year rate -> pool fallback rate -> 0
    //         initialEscMap[pool.poolId] = yearEscObj
    //           ? yearEscObj.escalationPercent
    //           : pool.escalationPercent || 0;
    //       });

    //       setPoolEscalations(initialEscMap);
    //     }

    //     // Filter out specific poolIds that shouldn't show on UI

    //     setPools(poolList);

    //     if (poolList.length === 0) {
    //       setError("No pools found for the selected template.");
    //       setMonthlyData([]);
    //       setLoading(false);
    //       return;
    //     }

    //     const planId = selectedPlan?.plId || selectedPlan;

    //     const ratesPromises = poolList.map(async (pool) => {
    //       const apiUrl = isFromProjectBudgetStatus
    //         ? `${backendUrl}/api/PlBudTemplatePoolRates/GetRatesByPoolsTemplateId?templateId=${selectedTemplate}&poolId=${encodeURIComponent(pool.poolId)}&year=${yearParam}&plid=${planId}`
    //         : `${backendUrl}/Orgnization/GetRatesByPoolsTemplateId?templateId=${selectedTemplate}&poolId=${encodeURIComponent(pool.poolId)}&year=${yearParam}`;

    //       const response = await axios.get(apiUrl);
    //       return response.data;
    //     });

    //     // axios
    //     //   .get(
    //     //     `${backendUrl}/Orgnization/GetRatesByPoolsTemplateId?templateId=${selectedTemplate}&poolId=${encodeURIComponent(pool.poolId)}&year=${selectedYear}`,
    //     //   )
    //     //   .catch((err) => {
    //     //     // console.error(
    //     //     //   `Failed to fetch rates for pool ${pool.poolId}:`,
    //     //     //   err
    //     //     // );
    //     //     return { data: [] };
    //     //   }),
    //     const ratesResponses = await Promise.all(ratesPromises);

    //     let parsedMonthlyRows = [];

    //     if (selectedYear === "All") {
    //       // Group returned records dynamically by unique (Year + Month)
    //       const rowMap = new Map();

    //       poolList.forEach((pool, poolIdx) => {
    //         const poolRates = ratesResponses[poolIdx] || [];

    //         poolRates.forEach((item) => {
    //           const rowKey = `${item.year}_${item.month}`;
    //           if (!rowMap.has(rowKey)) {
    //             rowMap.set(rowKey, {
    //               year: item.year,
    //               monthIndex: item.month,
    //               month: months[item.month - 1] || `Month ${item.month}`,
    //               rates: {},
    //             });
    //           }

    //           const rowObj = rowMap.get(rowKey);
    //           rowObj.rates[pool.poolId] = {
    //             targetRate: item.targetRate?.toString() || "0",
    //             actualRate: item.actualRate?.toString() || "0",
    //             escPercent: item.escPercent?.toString() || "0",
    //             id: item.id || 0,
    //           };
    //         });
    //       });

    //       // Sort rows by Year ascending and Month ascending
    //       parsedMonthlyRows = Array.from(rowMap.values()).sort((a, b) => {
    //         if (a.year !== b.year) return a.year - b.year;
    //         return a.monthIndex - b.monthIndex;
    //       });
    //     } else {
    //       // Standard single-year mapping
    //       parsedMonthlyRows = months.map((month, index) => {
    //         const monthIndex = index + 1;
    //         const monthRates = {};

    //         poolList.forEach((pool, idx) => {
    //           const fetchedRates = ratesResponses[idx] || [];
    //           const monthData = fetchedRates.find(
    //             (item) => item.month === monthIndex,
    //           );
    //           monthRates[pool.poolId] = {
    //             targetRate: monthData ? monthData.targetRate?.toString() : "0",
    //             actualRate: monthData ? monthData.actualRate?.toString() : "0",
    //             escPercent: monthData ? monthData.escPercent?.toString() : "0",
    //             id: monthData ? monthData.id : 0,
    //           };
    //         });

    //         return {
    //           year: selectedYear,
    //           monthIndex,
    //           month,
    //           rates: monthRates,
    //         };
    //       });
    //     }

    //     setMonthlyData(parsedMonthlyRows);
    //     initialMonthlyData.current = JSON.parse(
    //       JSON.stringify(parsedMonthlyRows),
    //     );
    //     setEditMonths(new Set());
    //     setError(null);

    //     // const ratesResponses = await Promise.all(ratesPromises);
    //     // console.log("Rates API Responses:", ratesResponses);

    //     // const monthlyData = months.map((month, index) => {
    //     //   const monthIndex = index + 1;
    //     //   const monthRates = {};
    //     //   poolList.forEach((pool, idx) => {
    //     //     // const fetchedRates = ratesResponses[idx].data || [];
    //     //     const fetchedRates = ratesResponses[idx] || [];
    //     //     // console.log(
    //     //     //   `Rates for pool ${pool.poolId}, month ${monthIndex}:`,
    //     //     //   fetchedRates
    //     //     // );
    //     //     const monthData = fetchedRates.find(
    //     //       (item) => item.month === monthIndex,
    //     //     );
    //     //     monthRates[pool.poolId] = {
    //     //       targetRate: monthData ? monthData.targetRate?.toString() : "0",
    //     //       actualRate: monthData ? monthData.actualRate?.toString() : "0",
    //     //       escPercent: monthData ? monthData.escPercent?.toString() : "0",
    //     //       id: monthData ? monthData.id : 0,
    //     //     };
    //     //   });
    //     //   return { month, rates: monthRates };
    //     // });

    //     // console.log(monthlyData);

    //     // setMonthlyData(monthlyData);
    //     // initialMonthlyData.current = JSON.parse(JSON.stringify(monthlyData));
    //     // setEditMonths(new Set());
    //     // setError(null);
    //   } catch (err) {
    //     const errorMessage =
    //       "Failed to fetch pools or rates: " +
    //       (err.response?.data?.message || err.message || "Bad request");
    //     setError(errorMessage);
    //     // console.error(errorMessage, err);
    //     toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchPoolsAndRates = async () => {
      setLoading(true);
      try {
        const planId = selectedPlan?.plId || selectedPlan;

        const poolsReq = axios.get(
          `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${selectedTemplate}`,
        );

        const ratesUrl = isFromProjectBudgetStatus
          ? `${backendUrl}/api/PlBudTemplatePoolRates/GetAllPoolRatesByTemplateId?templateId=${selectedTemplate}&year=${yearParam}&plid=${planId}`
          : // : `${backendUrl}/Orgnization/GetAllPoolRatesByTemplateId?templateId=${selectedTemplate}&year=${yearParam}`;
            `${backendUrl}/Orgnization/GetRatesByPoolsTemplateId?templateId=${selectedTemplate}&year=${yearParam}`;

        const ratesReq = axios.get(ratesUrl);

        const [poolsResponse, ratesResponse] = await Promise.all([
          poolsReq,
          ratesReq,
        ]);

        const rawPoolList = poolsResponse.data || [];
        const poolList = rawPoolList.filter(
          (pool) =>
            !["FRINGEONGNA", "OVERHEADONGNA", "FRINGEONOVERHEAD"].includes(
              pool.poolId,
            ),
        );

        if (isFromProjectBudgetStatus) {
          setAllPoolsData(poolList);

          const initialEscMap = {};
          const selectedYearNum = parseInt(selectedYear, 10);

          poolList.forEach((pool) => {
            const yearEscObj = pool.escPercent?.find(
              (e) => Number(e.year) === selectedYearNum,
            );

            initialEscMap[pool.poolId] = yearEscObj
              ? yearEscObj.escalationPercent
              : pool.escalationPercent || 0;
          });

          setPoolEscalations(initialEscMap);
        }

        setPools(poolList);

        if (poolList.length === 0) {
          setError("No pools found for the selected template.");
          setMonthlyData([]);
          setLoading(false);
          return;
        }

        const allRatesData = ratesResponse.data || [];
        let parsedMonthlyRows = [];

        if (selectedYear === "All") {
          const rowMap = new Map();

          allRatesData.forEach((item) => {
            const rowKey = `${item.year}_${item.month}`;
            if (!rowMap.has(rowKey)) {
              rowMap.set(rowKey, {
                year: item.year,
                monthIndex: item.month,
                month: months[item.month - 1] || `Month ${item.month}`,
                rates: {},
              });
            }

            const rowObj = rowMap.get(rowKey);
            rowObj.rates[item.poolId] = {
              targetRate: item.targetRate?.toString() || "0",
              actualRate: item.actualRate?.toString() || "0",
              escPercent: item.escPercent?.toString() || "0",
              id: item.id || 0,
            };
          });

          parsedMonthlyRows = Array.from(rowMap.values()).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.monthIndex - b.monthIndex;
          });
        } else {
          parsedMonthlyRows = months.map((month, index) => {
            const monthIndex = index + 1;
            const monthRates = {};

            poolList.forEach((pool) => {
              const monthData = allRatesData.find(
                (item) =>
                  item.poolId === pool.poolId && item.month === monthIndex,
              );

              monthRates[pool.poolId] = {
                targetRate: monthData ? monthData.targetRate?.toString() : "0",
                actualRate: monthData ? monthData.actualRate?.toString() : "0",
                escPercent: monthData ? monthData.escPercent?.toString() : "0",
                id: monthData ? monthData.id : 0,
              };
            });

            return {
              year: selectedYear,
              monthIndex,
              month,
              rates: monthRates,
            };
          });
        }

        setMonthlyData(parsedMonthlyRows);
        initialMonthlyData.current = JSON.parse(
          JSON.stringify(parsedMonthlyRows),
        );
        setEditMonths(new Set());
        setError(null);
      } catch (err) {
        const errorMessage =
          "Failed to fetch pools or rates: " +
          (err.response?.data?.message || err.message || "Bad request");
        setError(errorMessage);
        toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchPoolsAndRates();
  }, [selectedTemplate, selectedYear, isFromProjectBudgetStatus, selectedPlan]);

  // Custom navigation blocking for react-router-dom v7
  useEffect(() => {
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    const handleNavigation = (nextPath) => {
      if (isNavigating.current) return true;
      if (editMonths.size > 0 && nextPath !== location.pathname) {
        // console.log("Navigation attempt with unsaved changes:", {
        //   current: location.pathname,
        //   next: nextPath,
        //   editMonths: Array.from(editMonths),
        // });
        isNavigating.current = true;
        pendingNavigation.current = nextPath;

        const userConfirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        );
        if (userConfirmed) {
          isNavigating.current = false;
          pendingNavigation.current = null;
          return true; // Allow navigation
        } else {
          isNavigating.current = false;
          return false; // Block navigation
        }
      }
      isNavigating.current = false;
      return true; // Allow navigation
    };

    window.history.pushState = function (...args) {
      const nextPath = args[2] || location.pathname;
      if (handleNavigation(nextPath)) {
        return originalPush.apply(window.history, args);
      }
    };

    window.history.replaceState = function (...args) {
      const nextPath = args[2] || location.pathname;
      if (handleNavigation(nextPath)) {
        return originalReplace.apply(window.history, args);
      }
    };

    const handlePopState = () => {
      const nextPath = window.location.pathname;
      if (!handleNavigation(nextPath)) {
        // Revert popstate to stay on current page
        window.history.pushState({}, "", location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [editMonths, location.pathname]);

  // Handle beforeunload for browser tab close or external navigation
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (editMonths.size > 0 && !isNavigating.current) {
        // console.log(
        //   "BeforeUnload triggered: Unsaved changes detected",
        //   Array.from(editMonths)
        // );
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editMonths]);

  // Handle Escalation Percent Change
  const handleEscPercentChange = (poolId, newEscPercent, year) => {
    const currentYearStr = year || selectedYear;
    const escKey = `${poolId}_${currentYearStr}`;

    // Update escalation map state only (no rate recalculation)
    setPoolEscalations((prev) => ({
      ...prev,
      [escKey]: newEscPercent,
      [poolId]: newEscPercent,
    }));
  };

  // const handleTargetRateChange = (month, poolId, inputValue) => {
  //   let value = inputValue;

  //   // Check if the value starts with minus or is negative
  //   if (
  //     value.startsWith("-") ||
  //     (value !== "" && !isNaN(value) && parseFloat(value) < 0)
  //   ) {
  //     toast.error(
  //       "Negative values are not allowed. Please enter a positive value.",
  //       {
  //         position: "top-right",
  //         autoClose: 3000,
  //       },
  //     );
  //     return; // Don't update the state with negative value
  //   }

  //   // Handle validation for non-empty, non-decimal-point values
  //   if (value !== "" && value !== ".") {
  //     // Check if it's a valid number
  //     if (!isNaN(value)) {
  //       const numValue = parseFloat(value);

  //       // Check for infinite values
  //       if (!isFinite(numValue)) {
  //         toast.error("Invalid value. Please enter a finite number.", {
  //           position: "top-right",
  //           autoClose: 3000,
  //         });
  //         return;
  //       }

  //       // Only restrict decimal places, NOT the whole number part
  //       const parts = value.split(".");
  //       if (parts.length === 2 && parts[1].length > 6) {
  //         // Truncate to 6 decimal places only
  //         value = parts[0] + "." + parts[1].substring(0, 6);
  //         toast.warning(
  //           "Maximum 6 decimal places allowed. Value has been truncated.",
  //           {
  //             position: "top-right",
  //             autoClose: 2500,
  //           },
  //         );
  //       }
  //     } else {
  //       // Invalid number format
  //       toast.error("Please enter a valid number.", {
  //         position: "top-right",
  //         autoClose: 3000,
  //       });
  //       return;
  //     }
  //   }

  //   // Allow empty string, decimal point, or any valid positive number
  //   if (
  //     value === "" ||
  //     value === "." ||
  //     (!isNaN(value) && isFinite(parseFloat(value)) && parseFloat(value) >= 0)
  //   ) {
  //     setMonthlyData((prev) =>
  //       prev.map((item) =>
  //         item.month === month
  //           ? {
  //               ...item,
  //               rates: {
  //                 ...item.rates,
  //                 [poolId]: { ...item.rates[poolId], targetRate: value },
  //               },
  //             }
  //           : item,
  //       ),
  //     );

  //     const monthIndex = months.indexOf(month);
  //     const initialValue =
  //       initialMonthlyData.current[monthIndex]?.rates[poolId]?.targetRate ||
  //       "0";
  //     const hasChanged = value !== initialValue;

  //     setEditMonths((prev) => {
  //       const newSet = new Set(prev);
  //       const key = `${month}_${poolId}`;
  //       if (hasChanged) {
  //         newSet.add(key);
  //       } else {
  //         newSet.delete(key);
  //       }
  //       // console.log("EditMonths updated:", Array.from(newSet));
  //       return newSet;
  //     });
  //   }
  // };

  const handleTargetRateChange = (
    month,
    poolId,
    inputValue,
    year,
    field = "targetRate",
  ) => {
    let value = inputValue;

    // 1. Validation for negative values
    if (
      value.startsWith("-") ||
      (value !== "" && !isNaN(value) && parseFloat(value) < 0)
    ) {
      toast.error("Negative values are not allowed.");
      return;
    }

    // 2. Truncate decimals (max 6 places)
    if (value !== "" && value !== "." && !isNaN(value)) {
      const parts = value.split(".");
      if (parts.length === 2 && parts[1].length > 6) {
        value = parts[0] + "." + parts[1].substring(0, 6);
      }
    }

    // 3. Process state update & bi-directional calculation
    if (
      value === "" ||
      value === "." ||
      (!isNaN(value) && isFinite(parseFloat(value)))
    ) {
      setMonthlyData((prev) =>
        prev.map((item) => {
          const itemYear = item.year || selectedYear;
          if (item.month !== month || itemYear !== year) return item;

          const currentPoolData = item.rates?.[poolId] || {};
          const actual = parseFloat(currentPoolData.actualRate || 0);

          const updatedRates = {
            ...currentPoolData,
            [field]: value,
          };

          if (value === "" || value === ".") {
            // Clear partner field if input is erased
            if (field === "escPercent") updatedRates.targetRate = "";
            if (field === "targetRate") updatedRates.escPercent = "";
          } else {
            const numValue = parseFloat(value);

            // Scenario A: User edits escPercent -> targetRate = actual * (1 + esc / 100)
            if (field === "escPercent") {
              const finalRateWithEsc = actual * (1 + numValue / 100);
              updatedRates.targetRate = finalRateWithEsc.toFixed(6);
            }

            // Scenario B: User edits targetRate -> escPercent = ((targetRate - actual) / actual) * 100
            if (field === "targetRate") {
              if (actual > 0) {
                const computedEsc = ((numValue - actual) / actual) * 100;
                updatedRates.escPercent = computedEsc.toFixed(2);
              } else {
                updatedRates.escPercent = "0.00";
              }
            }
          }

          return {
            ...item,
            rates: {
              ...item.rates,
              [poolId]: updatedRates,
            },
          };
        }),
      );

      const key = `${month}_${poolId}`;
      setEditMonths((prev) => new Set([...prev, key]));
    }
  };

  const handlePoolToggle = (poolId) => {
    setSelectedPools((prev) =>
      prev.includes(poolId)
        ? prev.filter((id) => id !== poolId)
        : [...prev, poolId],
    );
  };

  // Find & Replace Handler
  const handleFindAndReplace = () => {
    if (!findValue || !replaceValue || monthlyData.length === 0) {
      toast.error("Please enter both find and replace values.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (selectedPools.length === 0) {
      toast.error(
        "Please select at least one pool to perform find and replace.",
        { position: "top-right", autoClose: 3000 },
      );
      return;
    }

    const updatedMonthlyData = monthlyData.map((monthData, monthIndex) => {
      const updatedRates = { ...monthData.rates };
      const poolsToProcess = pools.filter((pool) =>
        selectedPools.includes(pool.poolId),
      );

      poolsToProcess.forEach((pool) => {
        const currentRate = monthData.rates[pool.poolId]?.targetRate || "0";
        if (currentRate === findValue) {
          updatedRates[pool.poolId] = {
            ...updatedRates[pool.poolId],
            targetRate: replaceValue,
          };
          const initialValue =
            initialMonthlyData.current[monthIndex]?.rates[pool.poolId]
              ?.targetRate || "0";
          const hasChanged = replaceValue !== initialValue;

          setEditMonths((prev) => {
            const newSet = new Set(prev);
            const key = `${monthData.month}_${pool.poolId}`;
            if (hasChanged) newSet.add(key);
            else newSet.delete(key);
            return newSet;
          });
        }
      });
      return { ...monthData, rates: updatedRates };
    });

    setMonthlyData(updatedMonthlyData);
    setFindAndReplace("");
    setReplaceValue("");
    setSelectedPools([]);
    toast.success("Find and Replace applied successfully.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Unified Save Handler (Saves Monthly Rates & Pool Escalation percentages)
  const saveAllData = async () => {
    if ((editMonths.size === 0 && editedEscalations.size === 0) || isSaving)
      return;

    setIsSaving(true);
    try {
      const planId = selectedPlan?.plId || selectedPlan || 0;
      const promises = [];

      // 1. Build and post Pool Rates Payload if monthly changes detected
      if (editMonths.size > 0) {
        const rates = Array.from(editMonths).map((key) => {
          const [month, poolId] = key.split("_");
          const monthIndex = months.indexOf(month) + 1;
          const monthData = monthlyData.find((item) => item.month === month);
          const targetRate =
            monthData?.rates?.[poolId]?.targetRate === ""
              ? 0
              : parseFloat(monthData?.rates?.[poolId]?.targetRate) || 0;

          return {
            id: monthData?.rates?.[poolId]?.id || 0,
            templateId: parseInt(selectedTemplate, 10),
            ...(isFromProjectBudgetStatus && { plId: parseInt(planId, 10) }),
            poolId: poolId,
            year: parseInt(selectedYear, 10),
            month: monthIndex,
            targetRate,
            modifiedBy: userName,
          };
        });

        const ratesPayload = { rates };
        promises.push(
          axios.post(
            `${backendUrl}/Orgnization/UpsertPoolRatesForTemplate?updatedBy=${userName}`,
            ratesPayload,
          ),
        );
      }

      // 2. Build and post Escalation Payload if escalation edits detected
      if (isFromProjectBudgetStatus && editedEscalations.size > 0) {
        const escalationPayload = Array.from(editedEscalations).map((code) => {
          const poolItem = allPoolsData.find((p) => p.code === code);
          return {
            code: poolItem.code,
            name: poolItem.name,
            type: poolItem.type,
            description: poolItem.description,
            isActive: poolItem.isActive,
            sequence: poolItem.sequence,
            poolNo: poolItem.poolNo,
            esc_Percent: parseFloat(poolEscalations[code]) || 0,
            modifiedBy: userName,
            year: parseInt(selectedYear, 10),
            plId: parseInt(planId, 10),
          };
        });

        promises.push(
          axios.post(
            `${backendUrl}/Orgnization/SavePoolEscalations`,
            escalationPayload,
          ),
        );
      }

      await Promise.all(promises);

      // Reset modification trackers
      initialMonthlyData.current = JSON.parse(JSON.stringify(monthlyData));
      setEditMonths(new Set());
      setEditedEscalations(new Set());
      setError(null);
      toast.success("All changes saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage =
        "Failed to save data: " +
        (err.response?.data?.message || err.message || "Unknown error");
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    } finally {
      setIsSaving(false);
    }
  };

  const saveMonthlyData = async () => {
    // if (editMonths.size === 0 || isSaving) return;
    // Allow saving if table cells were edited OR if we are in Project Budget Status mode
    const hasTableEdits = editMonths.size > 0;
    if ((!hasTableEdits && !isFromProjectBudgetStatus) || isSaving) return;

    setIsSaving(true);
    try {
      const planId = selectedPlan?.plId || selectedPlan || 0;
      const templateId = selectedPlan?.templateId || selectedPlan || 0;
      const type = selectedPlan?.plType || selectedPlan || 0;
      const projId = selectedPlan?.projId || 0;
      const savePromises = [];

      if (isFromProjectBudgetStatus && isEscalationEdited) {
        const escalationPayload = {
          plId: parseInt(planId, 10),
          labEsc: parseFloat(escalationConfigs.escallation_percent) || 0,
          vendEsc:
            parseFloat(escalationConfigs.vendor_escallation_percent) || 0,
          nonLabEsc:
            parseFloat(escalationConfigs.nonlabor_escallation_percent) || 0,
        };

        savePromises.push(
          axios.post(
            `${backendUrl}/api/PlDirectEscallation/Upsert`,
            escalationPayload,
          ),
        );

        const calcUrl = `${backendUrl}/Forecast/CalculateRevenueCost?planID=${planId}&templateId=${templateId}&type=${type}`;
        await axios.get(calcUrl);
      }

      let poolRatesPromiseIndex = -1;
      // Build payload preserving existing id and actualRate
      if (hasTableEdits) {
        const rates = Array.from(editMonths).map((key) => {
          // Split safely on the first underscore in case poolId contains underscores
          const firstUnderscoreIdx = key.indexOf("_");
          const month = key.substring(0, firstUnderscoreIdx);
          const poolId = key.substring(firstUnderscoreIdx + 1);

          const monthData = monthlyData.find((item) => item.month === month);
          const monthIndex = monthData?.monthIndex || months.indexOf(month) + 1;

          // Safely find the pool rate object regardless of exact key casing
          const ratesObj = monthData?.rates || {};
          const matchedPoolKey = Object.keys(ratesObj).find(
            (k) => k === poolId,
          );
          const poolRateObj = ratesObj[matchedPoolKey || poolId] || {};

          const targetRate =
            poolRateObj.targetRate === ""
              ? 0
              : parseFloat(poolRateObj.targetRate) || 0;

          const actualRate =
            poolRateObj.actualRate === ""
              ? 0
              : parseFloat(poolRateObj.actualRate) || 0;

          const escPercent =
            poolRateObj.escPercent === ""
              ? 0
              : parseFloat(poolRateObj.escPercent) || 0;

          // Ensure valid integer year even when selectedYear is "All" or unassigned
          const parsedSelectedYear = parseInt(selectedYear, 10);
          const rowYear =
            !isNaN(parsedSelectedYear) && parsedSelectedYear > 0
              ? parsedSelectedYear
              : parseInt(monthData?.year, 10) || 0;

          return {
            id: poolRateObj.id || 0,
            templateId: parseInt(selectedTemplate, 10) || 0,
            ...(isFromProjectBudgetStatus && {
              plId: parseInt(planId, 10) || 0,
            }),
            poolId: poolId,
            year: rowYear,
            month: monthIndex,
            actualRate: actualRate,
            targetRate: targetRate,
            escPercent: escPercent,
            modifiedBy: userName,
          };
        });

        const payload = isFromProjectBudgetStatus ? { rates } : rates;

        const apiUrl = isFromProjectBudgetStatus
          ? `${backendUrl}/api/PlBudTemplatePoolRates/BulkUpsert`
          : `${backendUrl}/Orgnization/UpsertPoolRatesForTemplate?updatedBy=${userName}`;

        poolRatesPromiseIndex = savePromises.length;
        savePromises.push(axios.post(apiUrl, payload));
      }

      // const response = await axios.post(apiUrl, payload);
      const responses = await Promise.all(savePromises);
      if (poolRatesPromiseIndex !== -1) {
        const poolRatesResponse = responses[poolRatesPromiseIndex];
        let savedItems = [];

        if (Array.isArray(poolRatesResponse.data)) {
          savedItems = poolRatesResponse.data;
        } else if (
          poolRatesResponse.data &&
          typeof poolRatesResponse.data === "object"
        ) {
          savedItems = poolRatesResponse.data.rates || [poolRatesResponse.data];
        }

        const updatedMonthlyData = monthlyData.map((item) => {
          const updatedRates = { ...item.rates };
          const currentMonthIndex =
            item.monthIndex || months.indexOf(item.month) + 1;
          const currentYear = parseInt(item.year, 10);

          if (savedItems.length > 0) {
            savedItems.forEach((savedItem) => {
              const isSameYear =
                !savedItem.year ||
                !currentYear ||
                savedItem.year === currentYear;

              if (
                savedItem &&
                savedItem.month === currentMonthIndex &&
                isSameYear &&
                updatedRates[savedItem.poolId]
              ) {
                updatedRates[savedItem.poolId] = {
                  ...updatedRates[savedItem.poolId],
                  id: savedItem.id,
                  targetRate: savedItem.targetRate?.toString() || "0",
                  actualRate: savedItem.actualRate?.toString() || "0",
                  escPercent: savedItem.escPercent?.toString() || "0",
                };
              }
            });
          }

          return { ...item, rates: updatedRates };
        });

        // let savedItems = [];
        // if (Array.isArray(response.data)) {
        //   savedItems = response.data;
        // } else if (response.data && typeof response.data === "object") {
        //   savedItems = response.data.rates || [response.data];
        // }

        // // Map saved IDs back to component state
        // const updatedMonthlyData = monthlyData.map((item) => {
        //   const updatedRates = { ...item.rates };
        //   const currentMonthIndex =
        //     item.monthIndex || months.indexOf(item.month) + 1;
        //   const currentYear = parseInt(item.year, 10);

        //   if (savedItems.length > 0) {
        //     savedItems.forEach((savedItem) => {
        //       const isSameYear =
        //         !savedItem.year || !currentYear || savedItem.year === currentYear;

        //       if (
        //         savedItem &&
        //         savedItem.month === currentMonthIndex &&
        //         isSameYear &&
        //         updatedRates[savedItem.poolId]
        //       ) {
        //         updatedRates[savedItem.poolId] = {
        //           ...updatedRates[savedItem.poolId],
        //           id: savedItem.id,
        //           targetRate: savedItem.targetRate?.toString() || "0",
        //           actualRate: savedItem.actualRate?.toString() || "0",
        //           escPercent: savedItem.escPercent?.toString() || "0",
        //         };
        //       }
        //     });
        //   }

        //   return { ...item, rates: updatedRates };
        // });

        setMonthlyData(updatedMonthlyData);
        initialMonthlyData.current = JSON.parse(
          JSON.stringify(updatedMonthlyData),
        );
      }

      setEditMonths(new Set());
      setIsEscalationEdited(false);
      setError(null);
      toast.success("Data saved successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage =
        "Failed to save monthly data: " +
        (err.response?.data?.message || err.message || "Unknown error");
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const proceedWithNavigation = () => {
    if (pendingNavigation.current && !isNavigating.current) {
      const targetPath = pendingNavigation.current;
      pendingNavigation.current = null;
      isNavigating.current = true;
      navigate(targetPath);
      isNavigating.current = false;
    }
  };

  // const handleApplyEscalation = () => {
  //   if (!monthlyData.length) return;

  //   const updatedMonthlyData = monthlyData.map((m) => {
  //     const currentYearStr = m.year || selectedYear;
  //     const yearNum = parseInt(currentYearStr, 10);

  //     const updatedRates = { ...m.rates };

  //     pools.forEach((pool) => {
  //       // 1. Get escalation percent for pool and year
  //       const yearlyObj = pool.escPercent?.find(
  //         (e) => Number(e.year) === yearNum,
  //       );
  //       const escPercent =
  //         poolEscalations[`${pool.poolId}_${currentYearStr}`] ??
  //         poolEscalations[pool.poolId] ??
  //         yearlyObj?.escalationPercent ??
  //         pool.escalationPercent ??
  //         0;

  //       const rateObj = updatedRates[pool.poolId] || {};
  //       const actual = parseFloat(rateObj.actualRate ?? 0);
  //       const percent = parseFloat(escPercent ?? 0);

  //       // 2. Increase rate from actual rate: actual * (1 + percent / 100)
  //       const calculatedTargetRate = (actual * (1 + percent / 100)).toFixed(6);

  //       updatedRates[pool.poolId] = {
  //         ...rateObj,
  //         targetRate: calculatedTargetRate,
  //       };
  //     });

  //     return { ...m, rates: updatedRates };
  //   });

  //   // 3. Update component state and mark months as edited for Save
  //   setMonthlyData(updatedMonthlyData);

  //   const allMonths = new Set(monthlyData.map((m) => m.month));
  //   setEditMonths(allMonths);

  //   toast.success("Escalations applied! Click Save to keep changes.");
  // };

  // Add dropdownRef alongside your other hooks inside PoolRate
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isFromProjectBudgetStatus && selectedPlan) {
      const planId = selectedPlan?.plId || selectedPlan;
      const projId = selectedPlan?.projId || 0;

      // Prefill from selectedPlan if available, or fetch via API
      setEscalationConfigs({
        escallation_percent: selectedPlan.escallation_percent ?? "",
        vendor_escallation_percent:
          selectedPlan.vendor_escallation_percent ?? "",
        nonlabor_escallation_percent:
          selectedPlan.nonlabor_escallation_percent ?? "",
      });
    }
  }, [isFromProjectBudgetStatus, selectedPlan]);

  const handleApplyEscalation = () => {
    if (!monthlyData.length) return;

    const newEditKeys = new Set(editMonths);

    const updatedMonthlyData = monthlyData.map((m) => {
      const currentYearStr = m.year || selectedYear;
      const yearNum = parseInt(currentYearStr, 10);

      const updatedRates = { ...m.rates };

      pools.forEach((pool) => {
        // 1. Resolve Escalation Percent
        const yearlyObj = pool.escPercent?.find(
          (e) => Number(e.year) === yearNum,
        );
        const escPercent =
          poolEscalations[`${pool.poolId}_${currentYearStr}`] ??
          poolEscalations[pool.poolId] ??
          yearlyObj?.escalationPercent ??
          pool.escalationPercent ??
          0;

        const rateObj = updatedRates[pool.poolId] || {};
        const actual = parseFloat(rateObj.actualRate ?? 0);
        const percent = parseFloat(escPercent ?? 0);

        // 2. Calculate New Target Rate
        const calculatedTargetRate = (actual * (1 + percent / 100)).toFixed(6);

        // 3. Update both escalation percentage and calculated target rate
        updatedRates[pool.poolId] = {
          ...rateObj,
          escPercent: percent.toFixed(2),
          targetRate: calculatedTargetRate,
        };

        // 4. Register exact key for edit state tracking
        newEditKeys.add(`${m.month}_${pool.poolId}`);
      });

      return { ...m, rates: updatedRates };
    });

    setMonthlyData(updatedMonthlyData);
    setEditMonths(newEditKeys);

    toast.success("Escalations applied! Click Save to keep changes.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // const handleApplyEscalation = () => {
  //   if (!monthlyData.length) return;

  //   const newEditKeys = new Set(editMonths);

  //   const updatedMonthlyData = monthlyData.map((m) => {
  //     const currentYearStr = m.year || selectedYear;
  //     const yearNum = parseInt(currentYearStr, 10);

  //     const updatedRates = { ...m.rates };

  //     pools.forEach((pool) => {
  //       // 1. Get escalation percent for pool and year
  //       const yearlyObj = pool.escPercent?.find(
  //         (e) => Number(e.year) === yearNum,
  //       );
  //       const escPercent =
  //         poolEscalations[`${pool.poolId}_${currentYearStr}`] ??
  //         poolEscalations[pool.poolId] ??
  //         yearlyObj?.escalationPercent ??
  //         pool.escalationPercent ??
  //         0;

  //       const rateObj = updatedRates[pool.poolId] || {};
  //       const actual = parseFloat(rateObj.actualRate ?? 0);
  //       const percent = parseFloat(escPercent ?? 0);

  //       // 2. Increase rate from actual rate: actual * (1 + percent / 100)
  //       const calculatedTargetRate = (actual * (1 + percent / 100)).toFixed(6);

  //       updatedRates[pool.poolId] = {
  //         ...rateObj,
  //         targetRate: calculatedTargetRate,
  //       };

  //       // 3. Register exact "Month_PoolId" composite key for save tracking
  //       newEditKeys.add(`${m.month}_${pool.poolId}`);
  //     });

  //     return { ...m, rates: updatedRates };
  //   });

  //   setMonthlyData(updatedMonthlyData);
  //   setEditMonths(newEditKeys);

  //   toast.success("Escalations applied! Click Save to keep changes.", {
  //     position: "top-right",
  //     autoClose: 3000,
  //   });
  // };

  const handleUndoChanges = () => {
    if (initialMonthlyData.current.length > 0) {
      setMonthlyData(JSON.parse(JSON.stringify(initialMonthlyData.current)));
      setEditMonths(new Set());
      toast.info("All unsaved changes have been undone.", {
        position: "top-right",
        autoClose: 2500,
      });
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 text-sm font-roboto">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className=" mx-auto mt-4">
        {/* <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
        /> */}
        {/* <h1 className="w-full  bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg shadow-sm mb-4 blue-text">
          Pool Rate
        </h1> */}
        {loading && <p className="text-gray-600 text-sm mb-2">Loading...</p>}
        {isSaving && <p className="text-gray-600 text-sm mb-2">Saving...</p>}
        {/* {error && <p className="text-red-600 text-sm mb-2">Error: {error}</p>} */}
        <div className="flex flex-col gap-2 w-full">
          <div className="gap-4 flex w-full items-center ">
            {!isFromProjectBudgetStatus && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="template" className="input-label">
                    Template
                  </label>
                  <select
                    id="template"
                    className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-[200px]"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select Template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.templateCode}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="year" className="input-label">
                    Year
                  </label>
                  <select
                    id="year"
                    // size={5}
                    className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-[200px] overflow-y-auto"
                    style={{ direction: "ltr" }}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* <div className="flex items-center gap-2"> */}
            <div className="flex items-center gap-2 justify-end flex-wrap w-full">
              {isFromProjectBudgetStatus && isEditable && (
                <>
                  {/* <div className="gap-2"> */}
                  {/* <button
                    type="button"
                    className="btn1 btn-blue"
                    onClick={handleApplyEscalation}
                    disabled={loading || isSaving || !monthlyData.length}
                  >
                    Apply Escalation
                  </button>

                  <button
                    type="button"
                    className="btn1 btn-blue"
                    onClick={handleUndoChanges}
                    disabled={editMonths.size === 0 || loading || isSaving}
                  >
                    Undo Changes
                  </button> */}
                  {/* </div> */}
                </>
              )}

              {isEditable && (
                <button
                  type="button"
                  className="btn1 btn-blue"
                  onClick={saveMonthlyData}
                  // disabled={editMonths.size === 0 || loading || isSaving}
                  disabled={
                    (!isEscalationEdited && editMonths.size === 0) ||
                    loading ||
                    isSaving
                  }
                >
                  Save
                </button>
              )}
              {/* </div>
              <div> */}
              {pendingNavigation.current && (
                <button
                  type="button"
                  className="btn1 btn-blue"
                  onClick={proceedWithNavigation}
                >
                  Proceed with Navigation
                </button>
              )}
              {/* </div> */}
              {/* <div> */}
              {isEditable && (
                <button
                  type="button"
                  className="btn1 btn-blue flex items-center gap-1"
                  onClick={() => setIsFindReplaceOpen(!isFindReplaceOpen)}
                  disabled={loading || isSaving}
                >
                  <svg
                    className={`w-4 h-4 transform ${
                      isFindReplaceOpen ? "rotate-45" : ""
                    } transition-transform-xs`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Find and Replace</span>
                </button>
              )}

              {isFindReplaceOpen && (
                <div className="fixed inset-0 z-40 w-full flex items-start justify-center bg-black/20">
                  <div className="mt-20 w-full max-w-md bg-white rounded-lg shadow-xl border">
                    <div className="mt-3 space-y-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between px-2 ">
                        <h3 className="text-lg font-semibold">
                          Find and Replace
                        </h3>
                        <button
                          type="button"
                          className="bg-gray-200 text-gray-700 cursor-pointer p-1 rounded "
                          onClick={() => setIsFindReplaceOpen(false)}
                          disabled={loading || isSaving}
                        >
                          <svg
                            className={`w-5 h-5 transform ${
                              isFindReplaceOpen ? "rotate-45" : ""
                            } transition-transform-xs`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="find"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Find Value
                        </label>
                        <input
                          id="find"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                          value={findValue}
                          onChange={(e) => setFindAndReplace(e.target.value)}
                          placeholder="Enter value to find"
                          disabled={loading || isSaving}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="replace"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Replace With
                        </label>
                        <input
                          id="replace"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                          value={replaceValue}
                          onChange={(e) => setReplaceValue(e.target.value)}
                          placeholder="Enter new value"
                          disabled={loading || isSaving}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Pools
                        </label>
                        {pools.length > 0 ? (
                          <div className="flex flex-wrap gap-4 py-2">
                            {pools.map((pool) => (
                              <label
                                key={pool.poolId}
                                className="flex items-center space-x-2 text-sm text-gray-700 whitespace-nowrap min-w-fit"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPools.includes(pool.poolId)}
                                  onChange={() => handlePoolToggle(pool.poolId)}
                                  disabled={loading || isSaving}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="break-words max-w-[150px]">
                                  {pool.groupName}
                                </span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">
                            No pools available
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn1 btn-blue"
                        onClick={handleFindAndReplace}
                        disabled={
                          loading || isSaving || !findValue || !replaceValue
                        }
                      >
                        Replace All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* </div> */}
          </div>
          {/* Apply Escalation Controls */}

          {isFromProjectBudgetStatus && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-4 shadow-sm flex items-center justify-start gap-6 overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">
                  Labor Escalation %
                </label>
                <input
                  type="number"
                  value={escalationConfigs.escallation_percent}
                  onChange={(e) => {
                    setEscalationConfigs({
                      ...escalationConfigs,
                      escallation_percent: e.target.value,
                    });
                    setIsEscalationEdited(true);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 w-24"
                  disabled={loading || isSaving || !isEditable}
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">
                  Vendor Escalation %
                </label>
                <input
                  type="number"
                  value={escalationConfigs.vendor_escallation_percent}
                  onChange={(e) => {
                    setEscalationConfigs({
                      ...escalationConfigs,
                      vendor_escallation_percent: e.target.value,
                    });
                    setIsEscalationEdited(true);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 w-24"
                  disabled={loading || isSaving || !isEditable}
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">
                  Non-Labor Escalation %
                </label>
                <input
                  type="number"
                  value={escalationConfigs.nonlabor_escallation_percent}
                  onChange={(e) => {
                    setEscalationConfigs({
                      ...escalationConfigs,
                      nonlabor_escallation_percent: e.target.value,
                    });
                    setIsEscalationEdited(true);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 w-24"
                  disabled={loading || isSaving || !isEditable}
                />
              </div>
            </div>
          )}
          {/* Apply Escalation Controls */}
          {isFromProjectBudgetStatus && (
            <div className="bg-gray-50 p-4 border border-gray-300 rounded-lg mb-4 flex flex-wrap gap-4 items-end shadow-sm">
              {/* Select Pools Dropdown with Checkboxes */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-xs font-semibold text-gray-700">
                  Select Pools
                </label>
                <div className="relative group">
                  <details
                    ref={dropdownRef}
                    className="relative dropdown-container"
                  >
                    <summary className="border border-gray-300 rounded px-3 py-1.5 text-xs bg-white cursor-pointer shadow-sm flex justify-between items-center w-48 select-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <span className="truncate">
                        {bulkEscConfig.selectedPools?.length === 0
                          ? "Select Pools"
                          : bulkEscConfig.selectedPools?.length === pools.length
                            ? "All Pools Selected"
                            : `${bulkEscConfig.selectedPools?.length} Pool(s) Selected`}
                      </span>
                      <span className="ml-2 text-gray-400 text-[10px]">▼</span>
                    </summary>
                    <div className="absolute left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2 max-h-48 overflow-y-auto">
                      {/* Select All Toggle */}
                      <label className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-xs font-medium cursor-pointer border-b mb-1">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                          checked={
                            pools.length > 0 &&
                            bulkEscConfig.selectedPools?.length === pools.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkEscConfig((prev) => ({
                                ...prev,
                                selectedPools: pools.map((p) => p.poolId),
                              }));
                            } else {
                              setBulkEscConfig((prev) => ({
                                ...prev,
                                selectedPools: [],
                              }));
                            }
                          }}
                        />
                        <span className="text-gray-900">Select All</span>
                      </label>

                      {/* Pool Checkboxes */}
                      {pools.map((p) => {
                        const isChecked = bulkEscConfig.selectedPools?.includes(
                          p.poolId,
                        );
                        return (
                          <label
                            key={p.poolId}
                            className="flex items-center gap-2 p-1.5 hover:bg-blue-50 rounded text-xs cursor-pointer text-gray-700"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                              value={p.poolId}
                              checked={isChecked}
                              onChange={(e) => {
                                const poolId = p.poolId;
                                setBulkEscConfig((prev) => {
                                  const current = prev.selectedPools || [];
                                  const updated = e.target.checked
                                    ? [...current, poolId]
                                    : current.filter((id) => id !== poolId);
                                  return { ...prev, selectedPools: updated };
                                });
                              }}
                            />
                            <span className="truncate">{p.groupName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </div>

              {/* Escalation % Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Esc (%)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="border border-gray-300 rounded px-2 py-1.5 text-xs w-20 bg-white outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                  value={bulkEscConfig.escValue}
                  onChange={(e) =>
                    setBulkEscConfig((prev) => ({
                      ...prev,
                      escValue: e.target.value,
                    }))
                  }
                />
              </div>

              {/* From Range */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  From (Month / Year)
                </label>
                <div className="flex gap-1.5">
                  <select
                    className="border border-gray-300 rounded px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-500 shadow-sm"
                    value={bulkEscConfig.fromMonth}
                    onChange={(e) =>
                      setBulkEscConfig((prev) => ({
                        ...prev,
                        fromMonth: e.target.value,
                      }))
                    }
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border border-gray-300 rounded px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-500 shadow-sm"
                    value={bulkEscConfig.fromYear}
                    onChange={(e) =>
                      setBulkEscConfig((prev) => ({
                        ...prev,
                        fromYear: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Year</option>
                    {yearOptions?.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* To Range */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  To (Month / Year)
                </label>
                <div className="flex gap-1.5">
                  <select
                    className="border border-gray-300 rounded px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-500 shadow-sm"
                    value={bulkEscConfig.toMonth}
                    onChange={(e) =>
                      setBulkEscConfig((prev) => ({
                        ...prev,
                        toMonth: e.target.value,
                      }))
                    }
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border border-gray-300 rounded px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-500 shadow-sm"
                    value={bulkEscConfig.toYear}
                    onChange={(e) =>
                      setBulkEscConfig((prev) => ({
                        ...prev,
                        toYear: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Year</option>
                    {yearOptions?.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn1 btn-blue"
                  onClick={handleApplyBulkEscalation}
                  disabled={loading || isSaving || !monthlyData.length}
                >
                  Apply Escalation
                </button>

                <button
                  type="button"
                  className="btn1 btn-blue"
                  onClick={handleUndoChanges}
                  disabled={editMonths.size === 0 || loading || isSaving}
                >
                  Undo Changes
                </button>
              </div>
            </div>
          )}

          <div className="">
            {selectedTemplate && selectedYear && (
              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-1">
                  Target Rates
                </h2>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto border border-gray-300 rounded-lg shadow overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      {/* Top Header Row */}
                      <tr className="sticky top-0 z-30 bg-gray-50">
                        {" "}
                        {isFromProjectBudgetStatus && (
                          <th
                            rowSpan={2}
                            className="th-thead w-10 sticky left-0 z-20 bg-gray-100 align-middle"
                          >
                            Year
                          </th>
                        )}
                        <th
                          rowSpan={isFromProjectBudgetStatus ? 3 : 1}
                          className={
                            isFromProjectBudgetStatus
                              ? `th-thead align-middle sticky left-10 z-20`
                              : `th-thead align-middle sticky left-0 z-20`
                          }
                        >
                          Month
                        </th>
                        {pools.map((pool) => (
                          <th
                            key={pool.poolId}
                            colSpan={isFromProjectBudgetStatus ? 3 : 1}
                            className={`th-thead text-center ${
                              pool.groupName.toLowerCase() === "hr"
                                ? "uppercase"
                                : ""
                            }`}
                          >
                            {pool.groupName.toLowerCase() === "hr"
                              ? pool.groupName.toUpperCase()
                              : pool.groupName}
                          </th>
                        ))}
                      </tr>

                      {/* Sub-Header Row for Project Budget Status */}
                      {isFromProjectBudgetStatus && (
                        <tr className="sticky top-[19px] z-30 bg-gray-100">
                          {pools.map((pool) => (
                            <React.Fragment key={`sub-${pool.poolId}`}>
                              <th className="th-thead w-12 text-xs text-center border-t border-gray-200 bg-gray-100">
                                Target Rate
                              </th>
                              <th className="th-thead w-12 text-xs text-center border-t border-gray-200 bg-gray-100">
                                Esc (%)
                              </th>
                              <th className="th-thead w-12 text-xs text-center border-t border-gray-200 bg-gray-100">
                                After Esc Rate
                              </th>
                            </React.Fragment>
                          ))}
                        </tr>
                      )}
                    </thead>

                    <tbody className="tbody">
                      {monthlyData.length > 0 && !loading && !error ? (
                        monthlyData.map((data) => (
                          <tr
                            // key={`${data.year || selectedYear}-${data.month}`}
                            key={`${data.year}-${data.month}`}
                            className="bg-white"
                          >
                            {isFromProjectBudgetStatus && (
                              <td className="tbody-td sticky left-0 z-20 bg-white">
                                {data.year || selectedYear}
                              </td>
                            )}
                            <td
                              className={
                                isFromProjectBudgetStatus
                                  ? `tbody-td align-middle bg-white sticky left-10 z-20`
                                  : `tbody-td align-middle bg-white sticky left-0 z-20`
                              }
                            >
                              {data.month}
                            </td>

                            {pools.map((pool) => {
                              const poolData = data.rates?.[pool.poolId] || {};

                              if (isFromProjectBudgetStatus) {
                                return (
                                  <React.Fragment key={pool.poolId}>
                                    {/* Target Rate Column mapped to actualRate */}
                                    <td className="tbody-td w-18">
                                      <input
                                        type="text"
                                        className={`table-input w-20 ${
                                          isEditable
                                            ? "bg-gray-100"
                                            : "bg-gray-100"
                                        }`}
                                        value={poolData.actualRate ?? ""}
                                        onChange={(e) =>
                                          handleTargetRateChange(
                                            data.month,
                                            pool.poolId,
                                            e.target.value,
                                            data.year || selectedYear,
                                            "actualRate",
                                          )
                                        }
                                        placeholder="0.000000"
                                        disabled
                                      />
                                    </td>
                                    <td className="tbody-td w-12">
                                      <input
                                        type="text"
                                        className={`table-input w-20 ${
                                          isEditable
                                            ? "bg-white"
                                            : "bg-gray-100"
                                        }`}
                                        value={poolData.escPercent ?? ""}
                                        onChange={(e) =>
                                          handleTargetRateChange(
                                            data.month,
                                            pool.poolId,
                                            e.target.value,
                                            data.year || selectedYear,
                                            "escPercent",
                                          )
                                        }
                                        placeholder="0.00"
                                        disabled={
                                          loading || isSaving || !isEditable
                                        }
                                      />
                                    </td>

                                    {/* After Esc Rate Column mapped to targetRate */}
                                    <td className="tbody-td w-12">
                                      <input
                                        type="text"
                                        className={`table-input w-20 ${
                                          isEditable
                                            ? "bg-white"
                                            : "bg-gray-100"
                                        }`}
                                        value={poolData.targetRate ?? ""}
                                        onChange={(e) =>
                                          handleTargetRateChange(
                                            data.month,
                                            pool.poolId,
                                            e.target.value,
                                            data.year || selectedYear,
                                            "targetRate",
                                          )
                                        }
                                        placeholder="0.000000"
                                        disabled={
                                          loading || isSaving || !isEditable
                                        }
                                      />
                                    </td>
                                  </React.Fragment>
                                );
                              }

                              // Default Single Input Mode
                              return (
                                <td key={pool.poolId} className="tbody-td">
                                  <input
                                    type="text"
                                    className={`table-input ${
                                      isEditable ? "bg-white" : "bg-gray-100"
                                    }`}
                                    value={poolData.targetRate ?? ""}
                                    onChange={(e) =>
                                      handleTargetRateChange(
                                        data.month,
                                        pool.poolId,
                                        e.target.value,
                                        data.year || selectedYear,
                                      )
                                    }
                                    placeholder="0.000000"
                                    disabled={
                                      loading || isSaving || !isEditable
                                    }
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={
                              (isFromProjectBudgetStatus
                                ? pools.length * 2
                                : pools.length) +
                              (isFromProjectBudgetStatus ? 3 : 1)
                            }
                            className="tbody-td"
                          >
                            <div className="flex justify-center items-center">
                              <span className="text-red-600 text-sm mb-2">
                                Error: {error}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td
                            colSpan={
                              (isFromProjectBudgetStatus
                                ? pools.length * 2
                                : pools.length) +
                              (isFromProjectBudgetStatus ? 3 : 1)
                            }
                            className="tbody-td"
                          >
                            {loading ? (
                              <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                <span className="ml-2">Loading...</span>
                              </div>
                            ) : (
                              "Select a template and year to view data"
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const ScrollableSelect = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <label className="input-label text-xs sm:text-sm font-medium">
        {label}
      </label>

      <div className="relative w-[200px]">
        {/* The Trigger (Looks like your original select) */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner cursor-pointer flex justify-between items-center"
        >
          <span>{value || placeholder}</span>
          <span className="text-[10px] text-gray-400">▼</span>
        </div>

        {/* The Scrollable List (Only shows when clicked) */}
        {isOpen && (
          <>
            {/* Click outside to close overlay */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-[160px] overflow-y-auto">
              <li
                className="px-2 py-1.5 hover:bg-blue-50 text-xs sm:text-sm cursor-pointer border-b border-gray-100"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
              >
                {placeholder}
              </li>
              {options.map((opt) => (
                <li
                  key={opt}
                  className="px-2 py-1.5 hover:bg-blue-100 text-xs sm:text-sm cursor-pointer"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default PoolRate;
