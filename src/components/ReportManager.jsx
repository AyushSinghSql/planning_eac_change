import React, { useEffect, useState } from "react";
import ActiveReport from "./ActiveReport";
import ReportingScreen from "./ReportingScreen";
import axios from "axios";
import { backendUrl } from "./config";
import { getCacheAge } from "../utils/cachedDataTime";

const ReportsManager = () => {
  const [showVariance, setShowVariance] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [summaryDataLoading, setSummaryDataLoading] = useState([]);
  const [cachedAge, setCachedAge] = useState("");
  const [closingPeriod, setClosingPeriod] = useState("");

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
        // roleName: user
      };
    } catch {
      return { userId: "", role: "" };
    }
  };

  const { userId, role } = getCurrentUserContext();

  const fetchSummaryData = async (byPassCache = false) => {
    setSummaryDataLoading(true);
    try {
      const response =
        role === "admin"
          ? await fetch(
              `${backendUrl}/Forecast/GetSummaryV4?bypassCache=${byPassCache}`,
            )
          : await fetch(
              `${backendUrl}/Forecast/GetSummaryByUser?UserId=${userId}`,
            );

      const data = await response.json();
      if (data) {
        const summaryDataAge = getCacheAge(data.createdAt);

        setCachedAge(summaryDataAge);
        setSummaryData(data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSummaryDataLoading(false);
    }
  };

  const fetchClosingPeriod = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
      );
      if (!res.ok) return;

      const configs = await res.json();
      const item = Array.isArray(configs)
        ? configs.find((c) => c.name === "closing_period")
        : null;

      if (item?.value) {
        const [y, m] = String(item.value).split("-").map(Number);
        if (y && m) setClosingPeriod({ year: y, month: m });
      }
    } catch (err) {
      console.error("Closing period error:", err);
    }
  };

  console.log(closingPeriod);

  useEffect(() => {
    fetchSummaryData();
    fetchClosingPeriod();
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-slate-50">
      {/* 
        Smooth sliding and fading transition framework.
        When variance is active, the standard report slides out of view, 
        and the reporting screen slides in seamlessly.
      */}
      <div
        className={`w-full transition-all duration-500 ease-in-out transform ${
          showVariance
            ? "opacity-0 -translate-x-full absolute pointer-events-none"
            : "opacity-100 translate-x-0"
        }`}
      >
        <ActiveReport
          summaryLoading={summaryDataLoading}
          closingPeriod={closingPeriod}
          summaryData={summaryData}
          onShowVariance={() => setShowVariance(true)}
          cachedAge={cachedAge}
          fetchSummaryData={fetchSummaryData}
        />
      </div>

      <div
        className={`w-full transition-all duration-500 ease-in-out transform ${
          showVariance
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full absolute pointer-events-none"
        }`}
      >
        <ReportingScreen
          summaryLoading={summaryDataLoading}
          closingPeriod={closingPeriod}
          summaryData={summaryData}
          onHideVariance={() => setShowVariance(false)}
          cachedAge={cachedAge}
          fetchSummaryData={fetchSummaryData}
        />
      </div>
    </div>
  );
};

export default ReportsManager;
