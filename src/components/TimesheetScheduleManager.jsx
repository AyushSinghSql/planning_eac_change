import React, { useState, useEffect } from "react";
import { backendUrl } from "./config";

const LockOpenIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-green-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
    />
  </svg>
);

const LockClosedIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM11 7a2 2 0 012-2h0a2 2 0 012 2v4h-4V7z"
    />
  </svg>
);

const showToast = (message, type = "info", duration = 3000) => {
  const toast = document.createElement("div");
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  };
  toast.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-[10000] ${typeClasses[type] || typeClasses["info"]}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) document.body.removeChild(toast);
  }, duration);
};

export default function TimesheetScheduleManager({ onScheduleChange }) {
  const currentYear = new Date().getFullYear();
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track expanded schedule periods and loading state per schedule ID
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);
  const [schedulePeriodsMap, setSchedulePeriodsMap] = useState({});
  const [loadingPeriodsId, setLoadingPeriodsId] = useState(null);

  // Form State matching the POST payload structure
  const [scheduleYear, setScheduleYear] = useState(currentYear);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timesheetType, setTimesheetType] = useState("Weekly");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all master schedules (GET /api/TimesheetSchedule)
  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/TimesheetSchedule`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch schedules");
      const data = await response.json();
      if (Array.isArray(data)) {
        setSchedules(data);
        if (onScheduleChange) onScheduleChange(data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      showToast("Could not load schedules from server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Handle POST /api/TimesheetSchedule
  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!startDate || !endDate) {
      setErrorMsg("Please provide both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg("Start date cannot be after the end date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        scheduleYear: parseInt(scheduleYear, 10),
        startDate: startDate,
        endDate: endDate,
        timesheetType: timesheetType,
      };

      const response = await fetch(`${backendUrl}/api/TimesheetSchedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to create schedule");
      }

      showToast("Timesheet schedule created successfully!", "success");
      setStartDate("");
      setEndDate("");
      fetchSchedules(); // Refresh the list
    } catch (error) {
      console.error("Creation error:", error);
      showToast(error.message || "Error creating schedule.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch periods by year when clicking "View Periods" -> GET /api/TimesheetSchedule/year/{year}
  const handleViewPeriods = async (schedule) => {
    const targetYear = schedule.scheduleYear;
    const id = schedule.id || schedule.scheduleId;

    // Toggle collapse if already expanded for this schedule
    if (expandedScheduleId === schedule.scheduleId) {
      setExpandedScheduleId(null);
      return;
    }

    setExpandedScheduleId(schedule.scheduleId);

    // If periods are already fetched for this year, don't re-fetch
    if (schedulePeriodsMap[targetYear]) return;

    setLoadingPeriodsId(schedule.scheduleId);
    try {
      const response = await fetch(
        `${backendUrl}/api/TimesheetSchedule/id/${id}?year=${targetYear}`,
        {
          credentials: "include",
        },
      );
      if (!response.ok)
        throw new Error(`Failed to fetch periods for year ${targetYear}`);

      const data = await response.json();
      // The API returns the schedule object containing the 'periods' array
      const periodsList = data.periods || data[0]?.periods || [];

      setSchedulePeriodsMap((prev) => ({
        ...prev,
        [targetYear]: periodsList,
      }));
    } catch (error) {
      console.error("Error fetching year periods:", error);
      showToast(`Could not load periods for year ${targetYear}.`, "error");
    } finally {
      setLoadingPeriodsId(null);
    }
  };

  // Handle PATCH /api/TimesheetSchedule/periods/{periodId}/open or /close
  const togglePeriodStatus = async (periodId, currentStatus, yearKey) => {
    const action = currentStatus ? "close" : "open";
    try {
      const response = await fetch(
        `${backendUrl}/api/TimesheetSchedule/periods/${periodId}/${action}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) throw new Error(`Failed to ${action} period`);

      showToast(`Period successfully ${action}d.`, "success");

      // Update local state map for periods smoothly
      setSchedulePeriodsMap((prev) => ({
        ...prev,
        [yearKey]: prev[yearKey]?.map((p) =>
          p.periodId === periodId ? { ...p, isOpen: !currentStatus } : p,
        ),
      }));
    } catch (error) {
      console.error("Toggle error:", error);
      showToast(`Error updating period status.`, "error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 w-full max-w-6xl mx-auto font-sans">
      <div className="mb-5 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">
          Timesheet Schedule & Periods Management
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Create master schedule configurations and fetch/manage generated
          periods dynamically by year.
        </p>
      </div>

      {/* Form: POST /api/TimesheetSchedule */}
      <form
        onSubmit={handleCreateSchedule}
        className="bg-sky-50/60 p-4 rounded-lg border border-sky-100 mb-6"
      >
        <h3 className="text-xs font-semibold text-gray-700 mb-3">
          Create Schedule Configuration (/api/TimesheetSchedule)
        </h3>

        {errorMsg && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 text-xs rounded font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Schedule Year
            </label>
            <input
              type="number"
              value={scheduleYear}
              onChange={(e) => setScheduleYear(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Timesheet Type
            </label>
            <select
              value={timesheetType}
              onChange={(e) => setTimesheetType(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Semi-Monthly">Semi-Monthly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-medium py-2 px-3 rounded shadow-sm transition-colors cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "POST Schedule"}
            </button>
          </div>
        </div>
      </form>

      {/* Schedules Master Table */}
      <div className="mb-3">
        <span className="text-xs font-semibold text-gray-700">
          Master Schedules List ({schedules.length})
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300 max-h-[500px] overflow-y-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-[#e5f3fb] text-black font-semibold border-b border-gray-300">
            <tr>
              <th className="px-3 py-2 text-center w-12 border-r border-gray-300">
                #
              </th>
              <th className="px-3 py-2 border-r border-gray-300">
                Schedule ID
              </th>
              <th className="px-3 py-2 border-r border-gray-300">Year</th>
              <th className="px-3 py-2 border-r border-gray-300">Type</th>
              <th className="px-3 py-2 text-center border-r border-gray-300">
                Date Range
              </th>
              <th className="px-3 py-2 text-center border-r border-gray-300">
                Total Periods
              </th>
              <th className="px-3 py-2 text-center w-36">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-400">
                  Loading schedules from API...
                </td>
              </tr>
            ) : schedules.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-400">
                  No schedules found.
                </td>
              </tr>
            ) : (
              schedules.map((schedule, idx) => (
                <React.Fragment key={schedule.scheduleId}>
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="px-3 py-2 text-center font-medium text-gray-500 border-r border-gray-200">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 font-mono font-semibold text-gray-800 border-r border-gray-200">
                      #{schedule.scheduleId}
                    </td>
                    <td className="px-3 py-2 text-gray-700 border-r border-gray-200">
                      {schedule.scheduleYear}
                    </td>
                    <td className="px-3 py-2 font-semibold text-blue-600 border-r border-gray-200">
                      {schedule.timesheetType}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-gray-600 border-r border-gray-200">
                      {schedule.startDate?.split("T")[0]} to{" "}
                      {schedule.endDate?.split("T")[0]}
                    </td>
                    <td className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-200">
                      {schedule.totalPeriods || schedule.periods?.length || 0}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleViewPeriods(schedule)}
                        disabled={loadingPeriodsId === schedule.scheduleId}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 text-gray-700 font-medium rounded text-[11px] border border-gray-300 transition-colors cursor-pointer"
                      >
                        {loadingPeriodsId === schedule.scheduleId
                          ? "Loading..."
                          : expandedScheduleId === schedule.scheduleId
                            ? "Hide Periods"
                            : "View Periods"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Sub-table for Periods fetched via GET /api/TimesheetSchedule/year/{year} */}
                  {expandedScheduleId === schedule.scheduleId && (
                    <tr>
                      <td
                        colSpan="7"
                        className="bg-gray-50 p-3 border-b border-gray-300"
                      >
                        <div className="p-2 bg-white rounded border border-gray-200 shadow-inner">
                          <h4 className="text-xs font-bold text-gray-700 mb-2">
                            Periods Breakdown for Year {schedule.scheduleYear}{" "}
                            (GET /api/TimesheetSchedule/year/
                            {schedule.scheduleYear})
                          </h4>
                          <div className="max-h-60 overflow-y-auto">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead className="bg-gray-100 text-gray-700 sticky top-0">
                                <tr>
                                  <th className="px-2 py-1.5 border-b">
                                    Period #
                                  </th>
                                  <th className="px-2 py-1.5 border-b">
                                    Start Date
                                  </th>
                                  <th className="px-2 py-1.5 border-b">
                                    End Date
                                  </th>
                                  <th className="px-2 py-1.5 border-b text-center">
                                    Status (Patch Open/Close)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {!schedulePeriodsMap[schedule.scheduleYear] ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="text-center py-4 text-gray-400"
                                    >
                                      Loading periods...
                                    </td>
                                  </tr>
                                ) : schedulePeriodsMap[schedule.scheduleYear]
                                    .length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="text-center py-4 text-gray-400"
                                    >
                                      No periods found for this year.
                                    </td>
                                  </tr>
                                ) : (
                                  schedulePeriodsMap[schedule.scheduleYear].map(
                                    (period) => (
                                      <tr
                                        key={period.periodId}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-2 py-1.5 border-b font-medium">
                                          Period {period.periodNumber}
                                        </td>
                                        <td className="px-2 py-1.5 border-b font-mono text-gray-600">
                                          {
                                            period.periodStartDate?.split(
                                              "T",
                                            )[0]
                                          }
                                        </td>
                                        <td className="px-2 py-1.5 border-b font-mono text-gray-600">
                                          {period.periodEndDate?.split("T")[0]}
                                        </td>
                                        <td className="px-2 py-1.5 border-b text-center">
                                          <button
                                            onClick={() =>
                                              togglePeriodStatus(
                                                period.periodId,
                                                period.isOpen,
                                                schedule.scheduleYear,
                                              )
                                            }
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                                              period.isOpen
                                                ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                                : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                                            }`}
                                          >
                                            {period.isOpen ? (
                                              <>
                                                <LockOpenIcon /> Open
                                              </>
                                            ) : (
                                              <>
                                                <LockClosedIcon /> Closed
                                              </>
                                            )}
                                          </button>
                                        </td>
                                      </tr>
                                    ),
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
