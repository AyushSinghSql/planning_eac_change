// //////
// "use client";
import { useEffect, useState } from "react";
import React from "react";
import { FaFilePdf } from "react-icons/fa";

// Components
import ForecastReport from "./ForecastReport";
import SpendChart from "./SpendChart";
import UtilizationChart from "./UtilizationChart";
import Opportunities from "./Opportunities";
import PSRTrendReport from "./PSRTrendReport";
import IS_Report from "./IS_Report"; // Import the new Income Statement component
import ForecastPSRReport from "./ForecastPSRReport";
import { FaArrowTrendUp } from "react-icons/fa6";
import InteractiveCashFlow from "./CashFlow";
import BalanceSheet from "./BalanceSheet";
import { useOutletContext } from "react-router-dom";
import FinancialPerformanceDashboard from "./FinancialDashboardWithKpi";
import CostStructureDashboard from "./CostStructureDashboard";

import CashFlowDashboard from "./CashFlowDashboard";
import { backendUrl } from "./config";
import BalanceSheetDashboard from "./BalancesheetDashboard"

const FinancialDashboard = () => {
  // Added 'is_report' to the state logic
  const [activeTab, setActiveTab] = useState("highlevel");
  const [fullApiResponse] = useState({ employeeForecastSummary: [] });
  const { visibility, canView, canEdit } = useOutletContext();
  const [closingPeriod, setClosingPeriod] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedTab = params.get("tab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    // If they can't view the default 'forecast' tab, automatically switch them to one they can see
    if (!canView("forecastReport")) {
      if (canView("spendReport")) setActiveTab("spend");
      else if (canView("trendForecast")) setActiveTab("forecastpsr");
      else if (canView("incomeStatement")) setActiveTab("is_report");
      else if (canView("balanceSheet")) setActiveTab("balancesheet");
    }
  }, []);

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
  useEffect(() => {
    fetchClosingPeriod();
  }, []);

  // 2. Update the URL whenever the tab changes
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    const newRelativePathQuery = window.location.pathname + `?tab=${tabName}`;
    window.history.pushState(null, "", newRelativePathQuery);
  };

  const getTabClasses = (tabName) =>
    `px-2 py-3 text-base text-[12px] font-semibold transition-all duration-300 focus:outline-none ${
      activeTab === tabName
        ? "border-b-4 border-blue-600 text-blue-600 bg-white shadow-lg"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="financial-dashboard-content">
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-full mx-auto px-6 flex justify-between items-center">
            <div className="flex overflow-x-auto">
              {canView("forecastReport") && (
                <button
                  className={getTabClasses("highlevel")}
                  onClick={() => handleTabChange("highlevel")}
                >
                  Financial Performance
                </button>
              )}
              {canView("forecastReport") && (
                <button
                  className={getTabClasses("cost")}
                  onClick={() => handleTabChange("cost")}
                >
                  Cost Structure & YoY Drivers
                </button>
              )}
              {/* New Income Statement Tab */}
              {canView("incomeStatement") && (
                <button
                  className={getTabClasses("is_report")}
                  onClick={() => handleTabChange("is_report")}
                >
                  Trend Income Statement
                </button>
              )}
              {canView("trendForecast") && (
                <button
                  className={getTabClasses("forecastpsr")}
                  onClick={() => handleTabChange("forecastpsr")}
                >
                  Trend Forecast{" "}
                </button>
              )}
              {canView("forecastReport") && (
                <button
                  className={getTabClasses("forecast")}
                  onClick={() => handleTabChange("forecast")}
                >
                  Trend Forecast Drill Down
                </button>
              )}
              {/* <button className={getTabClasses('utilization')} onClick={() => setActiveTab('utilization')}>👥 Utilization</button> */}
              {/* <button className={getTabClasses('opportunities')} onClick={() => setActiveTab('opportunities')}>✨ Opportunities</button> */}

              {/* <button className={getTabClasses('psrtrend')} onClick={() =>handleTabChange('psrtrend')}>📈 Trend PSR </button> */}

              {/* New Balance Sheet Tab */}
              {canView("balanceSheet") && (
                <button
                  className={getTabClasses("balancesheet")}
                  onClick={() => handleTabChange("balancesheet")}
                >
                  Balance Sheet Dashboard
                </button>
              )}
              {canView("balanceSheet") && (
                <button
                  className={getTabClasses("balancesheetStatement")}
                  onClick={() => handleTabChange("balancesheetStatement")}
                >
                  Balance Sheet Statement
                </button>
              )}

              {/* New Cash Flow Tab */}
              <button
                className={getTabClasses("cashflow")}
                onClick={() => handleTabChange("cashflow")}
              >
                Cash Flow Dashboard
              </button>
              {/* New Cash Flow Tab */}
              <button
                className={getTabClasses("cashflowStatement")}
                onClick={() => handleTabChange("cashflowStatement")}
              >
                Cash Flow Statement
              </button>

              {canView("spendReport") && (
                <button
                  className={getTabClasses("spend")}
                  onClick={() => handleTabChange("spend")}
                >
                  Project Spend Chart
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto">
          {activeTab === "highlevel" && (
            <div className="p-2">
              <FinancialPerformanceDashboard />
            </div>
          )}
          {activeTab === "cost" && (
            <div className="p-2">
              <CostStructureDashboard />
            </div>
          )}
          {activeTab === "forecast" && (
            <div className="p-2">
              <ForecastReport fullApiResponse={fullApiResponse} />
            </div>
          )}
          {activeTab === "spend" && (
            <div className="p-2">
              <SpendChart fullApiResponse={fullApiResponse} />
            </div>
          )}
          {/* {activeTab === 'utilization' && <div className="p-2"><UtilizationChart fullApiResponse={fullApiResponse} /></div>} */}
          {/* {activeTab === 'opportunities' && <div className="p-2"><Opportunities fullApiResponse={fullApiResponse} /></div>} */}

          {activeTab === "psrtrend" && (
            <div className="p-2 bg-white min-h-screen">
              <PSRTrendReport />
            </div>
          )}
          {activeTab === "forecastpsr" && (
            <div className="p-2 bg-white min-h-screen">
              <ForecastPSRReport closingPeriod={closingPeriod} />
            </div>
          )}

          {/* Render the Income Statement Component */}
          {activeTab === "is_report" && (
            <div className="p-2 bg-white min-h-screen">
              <IS_Report closingPeriod={closingPeriod} />
            </div>
          )}
          {/* Render the Cash Flow Component */}

          {activeTab === "cashflow" && (
            <div className="p-2 bg-white min-h-screen">
              <CashFlowDashboard />
            </div>
          )}
          {activeTab === "cashflowStatement" && (
            <div className="p-2 bg-white min-h-screen">
              <InteractiveCashFlow />
            </div>
          )}

          {activeTab === "balancesheet" && (
            <div className="p-2 bg-white min-h-screen">
              <BalanceSheetDashboard />
            </div>
          )}
          {activeTab === "balancesheetStatement" && (
            <div className="p-2 bg-white min-h-screen">
              <BalanceSheet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
