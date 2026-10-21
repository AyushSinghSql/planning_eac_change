import React, { useState, useEffect, useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";
import { MdManageAccounts } from "react-icons/md";

const AccountMapping = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // Multiple New Rows
  // ---------------------------------------------------------

  const [newRows, setNewRows] = useState([]);

  // Selected existing rows
  const [selectedIds, setSelectedIds] = useState([]);

  // Existing edited rows
  // Key = ORIGINAL accountId
  const [editedRows, setEditedRows] = useState({});

  const [lastUpdatedIds, setLastUpdatedIds] = useState([]);

  // ---------------------------------------------------------
  // Filters
  // ---------------------------------------------------------

  const [filters, setFilters] = useState({
    accountId: "",
    accountName: "",
    accountType: "",
    budgetSheet: "",
    costType: "",
  });

  // ---------------------------------------------------------
  // Find & Replace
  // ---------------------------------------------------------

  const [showFindReplace, setShowFindReplace] = useState(false);

  const [findReplace, setFindReplace] = useState({
    field: "accountType",
    findValue: "",
    replaceValue: "",
    selectedOnly: false,
  });

  const didFetchRef = useRef(false);

  const { canEdit } = useOutletContext();

  const isEditable = canEdit("accountMapping");

  // ---------------------------------------------------------
  // Fetch Data
  // ---------------------------------------------------------

  useEffect(() => {
    if (didFetchRef.current) return;

    didFetchRef.current = true;

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${backendUrl}/api/ChartOfAccounts`);

      if (!response.ok) {
        throw new Error("API not responding");
      }

      const result = await response.json();

      const rawList = Array.isArray(result) ? result : result.data || [];

      const mappedData = rawList.map((row) => ({
        accountId: row.accountId || "",
        accountName: row.accountName || "",
        costType: row.costType || "",
        accountType: row.accountType || "",
        budgetSheet: row.budgetSheet || "",
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching account mapping:", error);

      setData([]);

      toast.error("Unable to load account mapping.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Current Existing Row
  // ---------------------------------------------------------

  const getRowData = (item) => {
    return editedRows[item.accountId] || item;
  };

  // ---------------------------------------------------------
  // Filter Existing Data
  // ---------------------------------------------------------

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const row = editedRows[item.accountId] || item;

      return (
        (row.accountId || "")
          .toLowerCase()
          .startsWith(filters.accountId.toLowerCase()) &&
        (row.accountName || "")
          .toLowerCase()
          .startsWith(filters.accountName.toLowerCase()) &&
        (row.accountType || "")
          .toLowerCase()
          .startsWith(filters.accountType.toLowerCase()) &&
        (row.budgetSheet || "")
          .toLowerCase()
          .startsWith(filters.budgetSheet.toLowerCase()) &&
        (row.costType || "")
          .toLowerCase()
          .startsWith(filters.costType.toLowerCase())
      );
    });
  }, [data, editedRows, filters]);

  // ---------------------------------------------------------
  // Add Multiple New Rows
  // ---------------------------------------------------------

  const handleAddNewRow = () => {
    const newAccountRow = {
      _rowId: crypto.randomUUID(),
      accountId: "",
      accountName: "",
      costType: "",
      accountType: "",
      budgetSheet: "",
    };

    setNewRows((prev) => [newAccountRow, ...prev]);
  };

  // ---------------------------------------------------------
  // Change New Row
  // ---------------------------------------------------------

  const handleNewRowChange = (rowId, field, value) => {
    setNewRows((prev) =>
      prev.map((row) =>
        row._rowId === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  // ---------------------------------------------------------
  // Remove Unsaved New Row
  // ---------------------------------------------------------

  const handleRemoveNewRow = (rowId) => {
    setNewRows((prev) => prev.filter((row) => row._rowId !== rowId));
  };

  // ---------------------------------------------------------
  // Filters
  // ---------------------------------------------------------

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // Selection
  // ---------------------------------------------------------

  const handleSelectRow = (accountId) => {
    setSelectedIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId],
    );
  };

  const handleSelectAll = () => {
    const visibleIds = filteredData.map((item) => item.accountId);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const allVisibleSelected =
    filteredData.length > 0 &&
    filteredData.every((item) => selectedIds.includes(item.accountId));

  // ---------------------------------------------------------
  // Existing Row Inline Edit
  // ---------------------------------------------------------

  const handleCellChange = (originalAccountId, field, value) => {
    const originalRow = data.find(
      (item) => item.accountId === originalAccountId,
    );

    if (!originalRow) return;

    const currentRow = editedRows[originalAccountId] || originalRow;

    const updatedRow = {
      ...currentRow,
      [field]: value,
    };

    const isSameAsOriginal =
      updatedRow.accountId === originalRow.accountId &&
      updatedRow.accountName === originalRow.accountName &&
      updatedRow.costType === originalRow.costType &&
      updatedRow.accountType === originalRow.accountType &&
      updatedRow.budgetSheet === originalRow.budgetSheet;

    if (isSameAsOriginal) {
      setEditedRows((prev) => {
        const updated = { ...prev };

        delete updated[originalAccountId];

        return updated;
      });

      return;
    }

    setEditedRows((prev) => ({
      ...prev,
      [originalAccountId]: updatedRow,
    }));
  };

  const dirtyIds = Object.keys(editedRows);

  // Total records pending save
  const totalPendingChanges = dirtyIds.length + newRows.length;

  // ---------------------------------------------------------
  // Clear Everything
  // ---------------------------------------------------------

  const handleClearAll = () => {
    setEditedRows({});
    setNewRows([]);
    setSelectedIds([]);

    setFilters({
      accountId: "",
      accountName: "",
      accountType: "",
      budgetSheet: "",
      costType: "",
    });

    setFindReplace({
      field: "accountType",
      findValue: "",
      replaceValue: "",
      selectedOnly: false,
    });
  };

  // ---------------------------------------------------------
  // GLOBAL SAVE
  //
  // New Rows      => POST
  // Existing Rows => PUT
  // ---------------------------------------------------------

  const handleSaveChanges = async () => {
    if (totalPendingChanges === 0) {
      toast.info("No changes to save.");
      return;
    }

    // -------------------------------------------------------
    // Validate New Rows
    // -------------------------------------------------------

    const invalidNewRows = newRows.filter((row) => !row.accountId?.trim());

    if (invalidNewRows.length > 0) {
      toast.error("Account ID is required for all new rows.");
      return;
    }

    // -------------------------------------------------------
    // Check duplicate Account IDs inside new rows
    // -------------------------------------------------------

    const newAccountIds = newRows.map((row) =>
      row.accountId.trim().toLowerCase(),
    );

    const duplicateNewIds = newAccountIds.filter(
      (id, index) => newAccountIds.indexOf(id) !== index,
    );

    if (duplicateNewIds.length > 0) {
      toast.error("Duplicate Account IDs found in new rows.");
      return;
    }

    // -------------------------------------------------------
    // Check if new account already exists
    // -------------------------------------------------------

    const existingAccountIds = data.map((row) => row.accountId.toLowerCase());

    const alreadyExisting = newRows.find((row) =>
      existingAccountIds.includes(row.accountId.trim().toLowerCase()),
    );

    if (alreadyExisting) {
      toast.error(`Account ID "${alreadyExisting.accountId}" already exists.`);
      return;
    }

    const loadingToast = toast.info(
      `Saving ${totalPendingChanges} record${
        totalPendingChanges > 1 ? "s" : ""
      }...`,
      {
        autoClose: false,
      },
    );

    try {
      // -----------------------------------------------------
      // Create Requests
      // -----------------------------------------------------

      const createRequests = newRows.map((row) => ({
        type: "create",
        key: row._rowId,

        promise: fetch(`${backendUrl}/api/ChartOfAccounts`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            accountId: row.accountId.trim(),
            accountName: row.accountName,
            costType: row.costType,
            accountType: row.accountType,
            budgetSheet: row.budgetSheet,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        }),
      }));

      // -----------------------------------------------------
      // Update Requests
      // -----------------------------------------------------

      const updateRequests = dirtyIds.map((originalAccountId) => {
        const row = editedRows[originalAccountId];

        return {
          type: "update",
          key: originalAccountId,

          promise: fetch(
            `${backendUrl}/api/ChartOfAccounts/${encodeURIComponent(
              originalAccountId,
            )}`,
            {
              method: "PUT",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                ...row,
                updatedAt: new Date().toISOString(),
              }),
            },
          ),
        };
      });

      const allRequests = [...createRequests, ...updateRequests];

      // -----------------------------------------------------
      // Execute All Requests
      // -----------------------------------------------------

      const results = await Promise.all(
        allRequests.map(async (request) => {
          try {
            const response = await request.promise;

            let errorMessage = "";

            if (!response.ok) {
              try {
                const contentType = response.headers.get("content-type");

                if (contentType?.includes("application/json")) {
                  const result = await response.json();

                  errorMessage =
                    result.message || result.error || "Request failed";
                } else {
                  errorMessage = await response.text();
                }
              } catch {
                errorMessage = "Request failed";
              }
            }

            return {
              ...request,
              success: response.ok,
              errorMessage,
            };
          } catch (error) {
            return {
              ...request,
              success: false,
              errorMessage: error.message,
            };
          }
        }),
      );

      toast.dismiss(loadingToast);

      // -----------------------------------------------------
      // Find successful / failed requests
      // -----------------------------------------------------

      const successfulCreates = results
        .filter((result) => result.type === "create" && result.success)
        .map((result) => result.key);

      const successfulUpdates = results
        .filter((result) => result.type === "update" && result.success)
        .map((result) => result.key);

      const failedResults = results.filter((result) => !result.success);

      // -----------------------------------------------------
      // Remove only successfully created rows
      // -----------------------------------------------------

      if (successfulCreates.length > 0) {
        setNewRows((prev) =>
          prev.filter((row) => !successfulCreates.includes(row._rowId)),
        );
      }

      // -----------------------------------------------------
      // Remove only successfully updated rows
      // -----------------------------------------------------

      if (successfulUpdates.length > 0) {
        setEditedRows((prev) => {
          const updated = { ...prev };

          successfulUpdates.forEach((accountId) => {
            delete updated[accountId];
          });

          return updated;
        });

        setLastUpdatedIds(successfulUpdates);
      }

      // -----------------------------------------------------
      // Refresh backend data
      // -----------------------------------------------------

      if (successfulCreates.length > 0 || successfulUpdates.length > 0) {
        await fetchData();
      }

      // -----------------------------------------------------
      // Toast Result
      // -----------------------------------------------------

      if (failedResults.length === 0) {
        toast.success(
          `${totalPendingChanges} record${
            totalPendingChanges > 1 ? "s" : ""
          } saved successfully.`,
        );
      } else {
        const successCount = results.length - failedResults.length;

        if (successCount > 0) {
          toast.warning(
            `${successCount} saved successfully. ${failedResults.length} failed and remain unsaved.`,
          );
        } else {
          toast.error("Unable to save the changes. Please try again.");
        }

        console.error("Failed account mapping requests:", failedResults);
      }

      if (successfulUpdates.length > 0) {
        setTimeout(() => {
          setLastUpdatedIds([]);
        }, 3000);
      }
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(`Network Error: ${error.message}`);
    }
  };

  // ---------------------------------------------------------
  // Delete Selected Existing Rows
  // ---------------------------------------------------------

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Please select at least one account.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} selected account${
        selectedIds.length > 1 ? "s" : ""
      }?`,
    );

    if (!confirmed) return;

    const loadingToast = toast.info(
      `Deleting ${selectedIds.length} account${
        selectedIds.length > 1 ? "s" : ""
      }...`,
      {
        autoClose: false,
      },
    );

    try {
      const responses = await Promise.all(
        selectedIds.map((accountId) =>
          fetch(
            `${backendUrl}/api/ChartOfAccounts/${encodeURIComponent(
              accountId,
            )}`,
            {
              method: "DELETE",
            },
          ),
        ),
      );

      toast.dismiss(loadingToast);

      const allOk = responses.every((response) => response.ok);

      if (!allOk) {
        toast.error("Some accounts could not be deleted.");

        await fetchData();

        return;
      }

      toast.success(
        `${selectedIds.length} account${
          selectedIds.length > 1 ? "s" : ""
        } deleted successfully.`,
      );

      setSelectedIds([]);
      setEditedRows({});

      await fetchData();
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(`Network Error: ${error.message}`);
    }
  };

  // ---------------------------------------------------------
  // Find & Replace
  // ---------------------------------------------------------

  const findReplaceOptions = {
    accountType: ["LABOR", "NON-LABOR", "Income"],

    budgetSheet: [
      "EMPLOYEE",
      "OTHER DIRECT COSTS",
      "SUBCONTRACTOR HOURS",
      "Revenue - Commercial",
      "Revenue - Government",
      "N/A – Non-cost account",
      "Revenue - Other",
    ],
  };

  const getFindReplaceOptions = () => {
    if (findReplace.field === "accountType") {
      return findReplaceOptions.accountType;
    }

    if (findReplace.field === "budgetSheet") {
      return findReplaceOptions.budgetSheet;
    }

    return [];
  };

  const handleFindReplace = () => {
    if (!findReplace.findValue) {
      toast.error("Please select or enter a value to find.");

      return;
    }

    if (!findReplace.replaceValue) {
      toast.error("Please select or enter a replacement value.");

      return;
    }

    const rows = findReplace.selectedOnly
      ? filteredData.filter((item) => selectedIds.includes(item.accountId))
      : filteredData;

    let count = 0;

    rows.forEach((item) => {
      const row = getRowData(item);

      const currentValue = row[findReplace.field] || "";

      if (currentValue.toLowerCase() === findReplace.findValue.toLowerCase()) {
        handleCellChange(
          item.accountId,
          findReplace.field,
          findReplace.replaceValue,
        );

        count++;
      }
    });

    if (count === 0) {
      toast.info("No matching accounts found.");
      return;
    }

    toast.success(
      `${count} account${
        count > 1 ? "s" : ""
      } updated. Click Save to apply changes.`,
    );
  };

  const isDropdownField =
    findReplace.field === "accountType" || findReplace.field === "budgetSheet";

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen text-gray-900 flex flex-col gap-y-2 items-center ml-2">
      <div>
        {/* Header */}

        <div className="p-4 w-full flex items-center rounded-sm bg-white">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MdManageAccounts size={20} className="text-blue-500" />
            Account Mapping
          </h2>
        </div>

        <div className="bg-white py-2 rounded mt-2">
          {/* Filters */}

          <div className="shrink-0">
            <div className="border-gray-200 rounded bg-white overflow-hidden mb-2">
              <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                {/* Account ID */}

                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Account ID</label>

                  <input
                    name="accountId"
                    value={filters.accountId}
                    onChange={handleFilterChange}
                    className="input-style"
                  />
                </div>

                {/* Cost Type */}

                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Cost Type</label>

                  <input
                    name="costType"
                    value={filters.costType}
                    onChange={handleFilterChange}
                    className="input-style"
                  />
                </div>

                {/* Expenses Type */}

                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Expenses Type</label>

                  <select
                    name="budgetSheet"
                    value={filters.budgetSheet}
                    onChange={handleFilterChange}
                    className="input-style"
                  >
                    <option value="">-- Select --</option>

                    <option value="EMPLOYEE">Employee</option>

                    <option value="OTHER DIRECT COSTS">
                      Other direct costs
                    </option>

                    <option value="SUBCONTRACTOR HOURS">
                      Subcontractor hours
                    </option>

                    <option value="Revenue - Other">Revenue - Other</option>

                    <option value="N/A – Non-cost account">
                      N/A – Non-cost account
                    </option>

                    <option value="Revenue - Government">
                      Revenue - Government
                    </option>

                    <option value="Revenue - Commercial">
                      Revenue - Commercial
                    </option>
                  </select>
                </div>

                {/* Account Name */}

                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Account Name</label>

                  <input
                    name="accountName"
                    value={filters.accountName}
                    onChange={handleFilterChange}
                    className="input-style"
                  />
                </div>

                {/* Account Type */}

                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Account Type</label>

                  <select
                    name="accountType"
                    value={filters.accountType}
                    onChange={handleFilterChange}
                    className="input-style"
                  >
                    <option value="">-- Select --</option>

                    <option value="LABOR">Labor</option>

                    <option value="NON-LABOR">Non-labor</option>

                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Toolbar */}
          {/* ------------------------------------------------ */}

          <div className="flex gap-2 px-4 pb-2 pt-2 bg-white items-center">
            {isEditable && (
              <>
                <div className="flex-1" />

                {/* ADD MULTIPLE ROWS */}

                <button
                  onClick={handleAddNewRow}
                  className="btn1 btn-blue flex items-center gap-1"
                >
                  Add
                </button>

                <button
                  onClick={handleClearAll}
                  className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    totalPendingChanges === 0 &&
                    selectedIds.length === 0 &&
                    !Object.values(filters).some(Boolean) &&
                    !findReplace.findValue &&
                    !findReplace.replaceValue
                  }
                >
                  Clear
                </button>

                <button
                  onClick={() => setShowFindReplace(!showFindReplace)}
                  className="btn1 btn-blue flex items-center gap-1"
                >
                  {showFindReplace ? "Close" : "Find / Replace"}
                </button>

                <button
                  disabled={selectedIds.length === 0}
                  onClick={handleDeleteSelected}
                  className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50"
                >
                  Delete
                </button>

                {/* GLOBAL SAVE */}
                <button
                  disabled={totalPendingChanges === 0}
                  onClick={handleSaveChanges}
                  className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </>
            )}
          </div>

          {/* ------------------------------------------------ */}
          {/* Find & Replace */}
          {/* ------------------------------------------------ */}

          {isEditable && showFindReplace && (
            <div className="mx-4 mb-2 px-3 py-2 border border-gray-200 rounded bg-gray-50">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-gray-600">
                  Find & Replace
                </span>

                <select
                  value={findReplace.field}
                  onChange={(e) =>
                    setFindReplace((prev) => ({
                      ...prev,
                      field: e.target.value,
                      findValue: "",
                      replaceValue: "",
                    }))
                  }
                  className="input-style !w-40"
                >
                  <option value="accountType">Account Type</option>

                  <option value="budgetSheet">Expenses Type</option>
                </select>

                <span className="text-xs text-gray-400">Find</span>

                {isDropdownField ? (
                  <select
                    value={findReplace.findValue}
                    onChange={(e) =>
                      setFindReplace((prev) => ({
                        ...prev,
                        findValue: e.target.value,
                      }))
                    }
                    className="input-style !w-40"
                  >
                    <option value="">-- Select --</option>

                    {getFindReplaceOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={findReplace.findValue}
                    onChange={(e) =>
                      setFindReplace((prev) => ({
                        ...prev,
                        findValue: e.target.value,
                      }))
                    }
                    placeholder="Find..."
                    className="input-style !w-40"
                  />
                )}

                <span className="text-xs text-gray-400">Replace</span>

                {isDropdownField ? (
                  <select
                    value={findReplace.replaceValue}
                    onChange={(e) =>
                      setFindReplace((prev) => ({
                        ...prev,
                        replaceValue: e.target.value,
                      }))
                    }
                    className="input-style !w-40"
                  >
                    <option value="">-- Select --</option>

                    {getFindReplaceOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={findReplace.replaceValue}
                    onChange={(e) =>
                      setFindReplace((prev) => ({
                        ...prev,
                        replaceValue: e.target.value,
                      }))
                    }
                    placeholder="Replace..."
                    className="input-style !w-40"
                  />
                )}

                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={findReplace.selectedOnly}
                    onChange={(e) =>
                      setFindReplace((prev) => ({
                        ...prev,
                        selectedOnly: e.target.checked,
                      }))
                    }
                    className="accent-blue-600"
                  />
                  Selected only
                </label>

                <button
                  onClick={handleFindReplace}
                  disabled={
                    !findReplace.findValue ||
                    !findReplace.replaceValue ||
                    (findReplace.selectedOnly && selectedIds.length === 0)
                  }
                  className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50"
                >
                  Replace All
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* Table */}
          {/* ------------------------------------------------ */}

          <div className="flex-1 overflow-hidden px-4 pb-4">
            <div className="border border-gray-200 rounded bg-white shadow-sm overflow-y-auto h-[calc(100vh-300px)]">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="thead">
                  <tr className="text-[10px] capitalize text-gray-500 border-b">
                    {isEditable && (
                      <th className="th-thead w-[4%] text-center">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={handleSelectAll}
                          className="accent-blue-600 cursor-pointer"
                        />
                      </th>
                    )}

                    <th className="th-thead">Account ID</th>

                    <th className="th-thead">Account Name</th>

                    <th className="th-thead">Cost Type</th>

                    <th className="th-thead">Account Type</th>

                    <th className="th-thead">Expenses Type Mapping</th>
                  </tr>
                </thead>

                <tbody className="tbody">
                  {/* ======================================== */}
                  {/* MULTIPLE NEW ROWS */}
                  {/* ======================================== */}

                  {isEditable &&
                    newRows.map((row) => (
                      <tr
                        key={row._rowId}
                        className="bg-blue-50 border-b border-gray-200 text-xs"
                      >
                        {/* NEW / CANCEL */}

                        <td className="p-2 border-r border-gray-200 text-center">
                          <button
                            onClick={() => handleRemoveNewRow(row._rowId)}
                            className="text-red-500 cursor-pointer"
                            title="Remove new row"
                          >
                            <X size={15} />
                          </button>
                        </td>

                        {/* Account ID */}

                        <td className="p-2 border-r border-gray-200">
                          <input
                            className="table-input"
                            value={row.accountId}
                            onChange={(e) =>
                              handleNewRowChange(
                                row._rowId,
                                "accountId",
                                e.target.value,
                              )
                            }
                            placeholder="Account ID"
                          />
                        </td>

                        {/* Account Name */}

                        <td className="p-2 border-r border-gray-200">
                          <input
                            className="table-input"
                            value={row.accountName}
                            onChange={(e) =>
                              handleNewRowChange(
                                row._rowId,
                                "accountName",
                                e.target.value,
                              )
                            }
                            placeholder="Account Name"
                          />
                        </td>

                        {/* Cost Type */}

                        <td className="p-2 border-r border-gray-200">
                          <input
                            className="table-input"
                            value={row.costType}
                            onChange={(e) =>
                              handleNewRowChange(
                                row._rowId,
                                "costType",
                                e.target.value,
                              )
                            }
                            placeholder="Cost Type"
                          />
                        </td>

                        {/* Account Type */}

                        <td className="p-2 border-r border-gray-200">
                          <select
                            value={row.accountType}
                            onChange={(e) =>
                              handleNewRowChange(
                                row._rowId,
                                "accountType",
                                e.target.value,
                              )
                            }
                            className="table-input"
                          >
                            <option value="">-- Select --</option>

                            <option value="LABOR">Labor</option>

                            <option value="NON-LABOR">Non-labor</option>

                            <option value="Income">Income</option>
                          </select>
                        </td>

                        {/* Expenses Type */}

                        <td className="p-2 border-r border-gray-200">
                          <select
                            value={row.budgetSheet}
                            onChange={(e) =>
                              handleNewRowChange(
                                row._rowId,
                                "budgetSheet",
                                e.target.value,
                              )
                            }
                            className="table-input"
                          >
                            <option value="">-- Select --</option>

                            <option value="EMPLOYEE">Employee</option>

                            <option value="OTHER DIRECT COSTS">
                              Other direct costs
                            </option>

                            <option value="SUBCONTRACTOR HOURS">
                              Subcontractor hours
                            </option>

                            <option value="Revenue - Other">
                              Revenue - Other
                            </option>

                            <option value="N/A – Non-cost account">
                              N/A – Non-cost account
                            </option>

                            <option value="Revenue - Government">
                              Revenue - Government
                            </option>

                            <option value="Revenue - Commercial">
                              Revenue - Commercial
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}

                  {/* Loading */}

                  {loading && (
                    <tr>
                      <td colSpan={isEditable ? 6 : 5} className="py-10">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />

                          <span className="ml-2 mt-4 text-sm text-gray-500 font-medium">
                            Loading...
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Empty */}

                  {!loading &&
                    filteredData.length === 0 &&
                    newRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={isEditable ? 6 : 5}
                          className="py-10 text-center text-sm text-gray-500"
                        >
                          No accounts found.
                        </td>
                      </tr>
                    )}

                  {/* ======================================== */}
                  {/* EXISTING DATA */}
                  {/* ======================================== */}

                  {!loading &&
                    filteredData.map((item) => {
                      const rowData = getRowData(item);

                      const isSelected = selectedIds.includes(item.accountId);

                      const isDirty = dirtyIds.includes(item.accountId);

                      const isJustUpdated = lastUpdatedIds.includes(
                        item.accountId,
                      );

                      return (
                        <tr
                          key={item.accountId}
                          className={`border-b border-gray-200 transition-colors duration-500 text-xs text-gray-800 hover:bg-gray-50`}
                        >
                          {/* Selection */}

                          {isEditable && (
                            <td className="p-2 border-r border-gray-200 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(item.accountId)}
                                className="accent-blue-600 cursor-pointer"
                              />
                            </td>
                          )}

                          {/* Account ID */}

                          <td className="p-2 border-r border-gray-200 w-[15%]">
                            {item.accountId}
                          </td>

                          {/* Account Name */}

                          <td className="p-2 border-r border-gray-200 w-[25%]">
                            {item.accountName}
                          </td>

                          {/* Cost Type */}

                          <td className="p-2 border-r border-gray-200 w-[18%] capitalize">
                            {item.costType}
                          </td>

                          {/* Account Type */}

                          <td className="p-2 border-r border-gray-200 w-[18%] uppercase">
                            {isEditable ? (
                              <select
                                value={rowData.accountType}
                                onChange={(e) =>
                                  handleCellChange(
                                    item.accountId,
                                    "accountType",
                                    e.target.value,
                                  )
                                }
                                className="table-input"
                              >
                                <option value="">-- Select --</option>

                                <option value="LABOR">Labor</option>

                                <option value="NON-LABOR">Non-labor</option>

                                <option value="Income">Income</option>
                              </select>
                            ) : (
                              item.accountType
                            )}
                          </td>

                          {/* Expenses Type */}

                          <td className="p-2 border-r border-gray-200 w-[18%] uppercase">
                            {isEditable ? (
                              <select
                                value={rowData.budgetSheet}
                                onChange={(e) =>
                                  handleCellChange(
                                    item.accountId,
                                    "budgetSheet",
                                    e.target.value,
                                  )
                                }
                                className="table-input"
                              >
                                <option value="">-- Select --</option>

                                <option value="EMPLOYEE">Employee</option>

                                <option value="OTHER DIRECT COSTS">
                                  Other direct costs
                                </option>

                                <option value="SUBCONTRACTOR HOURS">
                                  Subcontractor hours
                                </option>

                                <option value="Revenue - Other">
                                  Revenue - Other
                                </option>

                                <option value="N/A – Non-cost account">
                                  N/A – Non-cost account
                                </option>

                                <option value="Revenue - Government">
                                  Revenue - Government
                                </option>

                                <option value="Revenue - Commercial">
                                  Revenue - Commercial
                                </option>
                              </select>
                            ) : (
                              item.budgetSheet
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AccountMapping;

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useOutletContext, useParams } from "react-router-dom";
// import { Save, Plus, X, Trash2, Replace, Search } from "lucide-react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { backendUrl } from "./config";
// import { MdManageAccounts } from "react-icons/md";

// const AccountMapping = () => {
//   const { projectId, projectType } = useParams();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isAdding, setIsAdding] = useState(false);

//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     accountName: "",
//     costType: "",
//     accountType: "",
//     budgetSheet: "",
//   });

//   const [selectedIds, setSelectedIds] = useState([]);
//   const [editedRows, setEditedRows] = useState({});
//   const [lastUpdatedIds, setLastUpdatedIds] = useState([]);

//   // ---------------------------------------------------------
//   // Combined Search / Find & Replace
//   // ---------------------------------------------------------

//   const [operation, setOperation] = useState("search");

//   const [search, setSearch] = useState({
//     field: "accountId",
//     value: "",
//   });

//   const [findReplace, setFindReplace] = useState({
//     field: "accountId",
//     findValue: "",
//     replaceValue: "",
//     selectedOnly: false,
//   });

//   const didFetchRef = useRef(false);

//   const { canView, canEdit } = useOutletContext();

//   const isEditable = canEdit("accountMapping");

//   // ---------------------------------------------------------
//   // Fetch
//   // ---------------------------------------------------------

//   useEffect(() => {
//     if (didFetchRef.current) return;

//     didFetchRef.current = true;

//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${backendUrl}/api/ChartOfAccounts`
//       );

//       if (!response.ok) {
//         throw new Error("API not responding");
//       }

//       const result = await response.json();

//       const rawList = Array.isArray(result)
//         ? result
//         : result.data || [];

//       setData(
//         rawList.map((item) => ({
//           accountId: item.accountId || "",
//           accountName: item.accountName || "",
//           costType: item.costType || "",
//           accountType: item.accountType || "",
//           budgetSheet: item.budgetSheet || "",
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching account mapping:", error);
//       setData([]);
//       toast.error("Unable to load account mapping.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------------------------------------
//   // Current Row
//   // ---------------------------------------------------------

//   const getRowData = (item) => {
//     return editedRows[item.accountId] || item;
//   };

//   // ---------------------------------------------------------
//   // Field options
//   // ---------------------------------------------------------

//   const fieldLabels = {
//     accountId: "Account ID",
//     accountName: "Account Name",
//     costType: "Cost Type",
//     accountType: "Account Type",
//     budgetSheet: "Expenses Type",
//   };

//   const accountTypeOptions = [
//     "LABOR",
//     "NON-LABOR",
//   ];

//   const budgetSheetOptions = [
//     "Employee",
//     "Other Direct Costs",
//     "SUBCONTRACTOR HOURS",
//   ];

//   const getFieldOptions = (field) => {
//     if (field === "accountType") {
//       return accountTypeOptions;
//     }

//     if (field === "budgetSheet") {
//       return budgetSheetOptions;
//     }

//     return [];
//   };

//   const isSelectField = (field) => {
//     return (
//       field === "accountType" ||
//       field === "budgetSheet"
//     );
//   };

//   // ---------------------------------------------------------
//   // Search
//   // ---------------------------------------------------------

//   const filteredData = useMemo(() => {
//     if (!search.value.trim()) {
//       return data;
//     }

//     const value = search.value.toLowerCase();

//     return data.filter((item) => {
//       const row = getRowData(item);

//       return String(row[search.field] || "")
//         .toLowerCase()
//         .includes(value);
//     });
//   }, [data, editedRows, search]);

//   const handleSearchFieldChange = (e) => {
//     const field = e.target.value;

//     setSearch({
//       field,
//       value: "",
//     });
//   };

//   const handleSearchValueChange = (e) => {
//     setSearch((prev) => ({
//       ...prev,
//       value: e.target.value,
//     }));
//   };

//   // ---------------------------------------------------------
//   // Selection
//   // ---------------------------------------------------------

//   const handleSelectRow = (accountId) => {
//     setSelectedIds((prev) =>
//       prev.includes(accountId)
//         ? prev.filter((id) => id !== accountId)
//         : [...prev, accountId]
//     );
//   };

//   const handleSelectAll = () => {
//     const visibleIds = filteredData.map(
//       (item) => item.accountId
//     );

//     const allSelected =
//       visibleIds.length > 0 &&
//       visibleIds.every((id) =>
//         selectedIds.includes(id)
//       );

//     if (allSelected) {
//       setSelectedIds((prev) =>
//         prev.filter(
//           (id) => !visibleIds.includes(id)
//         )
//       );
//     } else {
//       setSelectedIds((prev) => [
//         ...new Set([...prev, ...visibleIds]),
//       ]);
//     }
//   };

//   const allVisibleSelected =
//     filteredData.length > 0 &&
//     filteredData.every((item) =>
//       selectedIds.includes(item.accountId)
//     );

//   // ---------------------------------------------------------
//   // Inline Edit
//   // ---------------------------------------------------------

//   const handleCellChange = (
//     originalAccountId,
//     field,
//     value
//   ) => {
//     const originalRow = data.find(
//       (item) =>
//         item.accountId === originalAccountId
//     );

//     if (!originalRow) return;

//     const currentRow =
//       editedRows[originalAccountId] ||
//       originalRow;

//     const updatedRow = {
//       ...currentRow,
//       [field]: value,
//     };

//     const unchanged =
//       updatedRow.accountId ===
//         originalRow.accountId &&
//       updatedRow.accountName ===
//         originalRow.accountName &&
//       updatedRow.costType ===
//         originalRow.costType &&
//       updatedRow.accountType ===
//         originalRow.accountType &&
//       updatedRow.budgetSheet ===
//         originalRow.budgetSheet;

//     if (unchanged) {
//       setEditedRows((prev) => {
//         const updated = { ...prev };
//         delete updated[originalAccountId];
//         return updated;
//       });

//       return;
//     }

//     setEditedRows((prev) => ({
//       ...prev,
//       [originalAccountId]: updatedRow,
//     }));
//   };

//   const dirtyIds = Object.keys(editedRows);

//   // ---------------------------------------------------------
//   // Find & Replace
//   // ---------------------------------------------------------

//   const handleFindReplaceFieldChange = (e) => {
//     const field = e.target.value;

//     setFindReplace({
//       field,
//       findValue: "",
//       replaceValue: "",
//       selectedOnly: findReplace.selectedOnly,
//     });
//   };

//   const handleFindReplace = () => {
//     const {
//       field,
//       findValue,
//       replaceValue,
//       selectedOnly,
//     } = findReplace;

//     if (!findValue) {
//       toast.error(
//         "Please select or enter a value to find."
//       );
//       return;
//     }

//     if (!replaceValue) {
//       toast.error(
//         "Please select or enter a replacement value."
//       );
//       return;
//     }

//     const rows = selectedOnly
//       ? data.filter((item) =>
//           selectedIds.includes(item.accountId)
//         )
//       : data;

//     let count = 0;

//     rows.forEach((item) => {
//       const row = getRowData(item);

//       const currentValue = String(
//         row[field] || ""
//       );

//       if (
//         currentValue.toLowerCase() ===
//         String(findValue).toLowerCase()
//       ) {
//         handleCellChange(
//           item.accountId,
//           field,
//           replaceValue
//         );

//         count++;
//       }
//     });

//     if (count === 0) {
//       toast.info("No matching accounts found.");
//       return;
//     }

//     toast.success(
//       `${count} account${
//         count > 1 ? "s" : ""
//       } updated. Click Save to apply changes.`
//     );
//   };

//   // ---------------------------------------------------------
//   // Save
//   // ---------------------------------------------------------

//   const handleSaveChanges = async () => {
//     if (dirtyIds.length === 0) {
//       toast.info("No changes to save.");
//       return;
//     }

//     try {
//       const responses = await Promise.all(
//         dirtyIds.map((originalId) => {
//           const row = editedRows[originalId];

//           return fetch(
//             `${backendUrl}/api/ChartOfAccounts/${originalId}`,
//             {
//               method: "PUT",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 ...row,
//                 updatedAt:
//                   new Date().toISOString(),
//               }),
//             }
//           );
//         })
//       );

//       if (!responses.every((res) => res.ok)) {
//         toast.error(
//           "Some updates failed. Please try again."
//         );
//         return;
//       }

//       toast.success(
//         `${dirtyIds.length} account${
//           dirtyIds.length > 1 ? "s" : ""
//         } updated successfully.`
//       );

//       setLastUpdatedIds([...dirtyIds]);
//       setEditedRows({});

//       await fetchData();

//       setTimeout(() => {
//         setLastUpdatedIds([]);
//       }, 3000);
//     } catch (error) {
//       toast.error(
//         `Network Error: ${error.message}`
//       );
//     }
//   };

//   // ---------------------------------------------------------
//   // Add
//   // ---------------------------------------------------------

//   const handleSaveNewRow = async () => {
//     if (!newRow.accountId.trim()) {
//       toast.error("Account ID is required.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/ChartOfAccounts`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...newRow,
//             createdAt:
//               new Date().toISOString(),
//             updatedAt:
//               new Date().toISOString(),
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to create account");
//       }

//       toast.success(
//         "Account created successfully."
//       );

//       setIsAdding(false);

//       setNewRow({
//         accountId: "",
//         accountName: "",
//         costType: "",
//         accountType: "",
//         budgetSheet: "",
//       });

//       await fetchData();
//     } catch (error) {
//       toast.error(
//         `Network Error: ${error.message}`
//       );
//     }
//   };

//   // ---------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------

//   const handleDeleteSelected = async () => {
//     if (selectedIds.length === 0) {
//       toast.info(
//         "Please select at least one account."
//       );
//       return;
//     }

//     const confirmed = window.confirm(
//       `Are you sure you want to delete ${selectedIds.length} selected account${
//         selectedIds.length > 1 ? "s" : ""
//       }?`
//     );

//     if (!confirmed) return;

//     try {
//       const responses = await Promise.all(
//         selectedIds.map((accountId) =>
//           fetch(
//             `${backendUrl}/api/ChartOfAccounts/${accountId}`,
//             {
//               method: "DELETE",
//             }
//           )
//         )
//       );

//       if (!responses.every((res) => res.ok)) {
//         toast.error(
//           "Some accounts could not be deleted."
//         );
//         return;
//       }

//       toast.success(
//         `${selectedIds.length} account${
//           selectedIds.length > 1 ? "s" : ""
//         } deleted successfully.`
//       );

//       setSelectedIds([]);
//       setEditedRows({});

//       await fetchData();
//     } catch (error) {
//       toast.error(
//         `Network Error: ${error.message}`
//       );
//     }
//   };

//   // ---------------------------------------------------------
//   // Render Search / Replace Input
//   // ---------------------------------------------------------

//   const renderValueInput = (
//     field,
//     value,
//     onChange,
//     placeholder
//   ) => {
//     if (isSelectField(field)) {
//       return (
//         <select
//           value={value}
//           onChange={onChange}
//           className="input-style"
//         >
//           <option value="">
//             -- Select --
//           </option>

//           {getFieldOptions(field).map(
//             (option) => (
//               <option
//                 key={option}
//                 value={option}
//               >
//                 {option ===
//                 "Other Direct Costs"
//                   ? "OTHER DIRECT COSTS"
//                   : option}
//               </option>
//             )
//           )}
//         </select>
//       );
//     }

//     return (
//       <input
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="input-style"
//       />
//     );
//   };

//   // ---------------------------------------------------------
//   // UI
//   // ---------------------------------------------------------

//   return (
//     <div className="min-h-screen text-gray-900 flex flex-col gap-y-2 items-center ml-2">
//       <div>
//         {/* Header */}

//         <div className="p-4 w-full flex items-center rounded-sm bg-white">
//           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <MdManageAccounts
//               size={20}
//               className="text-blue-500"
//             />

//             Account Mapping
//           </h2>
//         </div>

//         <div className="bg-white py-2 rounded mt-2">
//           {/* ------------------------------------------------ */}
//           {/* Combined Search / Find Replace */}
//           {/* ------------------------------------------------ */}

//           <div className="border-gray-200 rounded bg-white overflow-hidden mb-2">
//             <div className="p-2 flex items-center gap-2 flex-wrap">

//               {/* Operation */}

//               <div className="flex items-center gap-2">
//                 <label className="input-label">
//                   Action
//                 </label>

//                 <select
//                   value={operation}
//                   onChange={(e) => {
//                     const value =
//                       e.target.value;

//                     setOperation(value);

//                     if (
//                       value === "replace"
//                     ) {
//                       setFindReplace(
//                         (prev) => ({
//                           ...prev,
//                           findValue: "",
//                           replaceValue: "",
//                         })
//                       );
//                     } else {
//                       setSearch((prev) => ({
//                         ...prev,
//                         value: "",
//                       }));
//                     }
//                   }}
//                   className="input-style !w-36"
//                 >
//                   <option value="search">
//                     Search
//                   </option>

//                   <option value="replace">
//                     Find & Replace
//                   </option>
//                 </select>
//               </div>

//               {/* Search */}

//               {operation === "search" && (
//                 <>
//                   <div className="flex items-center gap-2">
//                     <label className="input-label">
//                       Column
//                     </label>

//                     <select
//                       value={search.field}
//                       onChange={
//                         handleSearchFieldChange
//                       }
//                       className="input-style !w-40"
//                     >
//                       {Object.entries(
//                         fieldLabels
//                       ).map(
//                         ([value, label]) => (
//                           <option
//                             key={value}
//                             value={value}
//                           >
//                             {label}
//                           </option>
//                         )
//                       )}
//                     </select>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <label className="input-label">
//                       Value
//                     </label>

//                     {renderValueInput(
//                       search.field,
//                       search.value,
//                       handleSearchValueChange,
//                       "Search..."
//                     )}
//                   </div>

//                   {search.value && (
//                     <button
//                       onClick={() =>
//                         setSearch((prev) => ({
//                           ...prev,
//                           value: "",
//                         }))
//                       }
//                       className="text-gray-400 hover:text-gray-600"
//                       title="Clear"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}

//                   <span className="text-xs text-gray-400">
//                     {filteredData.length} result
//                     {filteredData.length !== 1
//                       ? "s"
//                       : ""}
//                   </span>
//                 </>
//               )}

//               {/* Find & Replace */}

//               {operation === "replace" && (
//                 <>
//                   <div className="flex items-center gap-2">
//                     <label className="input-label">
//                       Column
//                     </label>

//                     <select
//                       value={
//                         findReplace.field
//                       }
//                       onChange={
//                         handleFindReplaceFieldChange
//                       }
//                       className="input-style !w-40"
//                     >
//                       {Object.entries(
//                         fieldLabels
//                       ).map(
//                         ([value, label]) => (
//                           <option
//                             key={value}
//                             value={value}
//                           >
//                             {label}
//                           </option>
//                         )
//                       )}
//                     </select>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <label className="input-label">
//                       Find
//                     </label>

//                     {renderValueInput(
//                       findReplace.field,
//                       findReplace.findValue,
//                       (e) =>
//                         setFindReplace(
//                           (prev) => ({
//                             ...prev,
//                             findValue:
//                               e.target.value,
//                           })
//                         ),
//                       "Find..."
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <label className="input-label">
//                       Replace
//                     </label>

//                     {renderValueInput(
//                       findReplace.field,
//                       findReplace.replaceValue,
//                       (e) =>
//                         setFindReplace(
//                           (prev) => ({
//                             ...prev,
//                             replaceValue:
//                               e.target.value,
//                           })
//                         ),
//                       "Replace..."
//                     )}
//                   </div>

//                   <label className="flex items-center gap-1 text-xs text-gray-600">
//                     <input
//                       type="checkbox"
//                       checked={
//                         findReplace.selectedOnly
//                       }
//                       onChange={(e) =>
//                         setFindReplace(
//                           (prev) => ({
//                             ...prev,
//                             selectedOnly:
//                               e.target.checked,
//                           })
//                         )
//                       }
//                       className="accent-blue-600"
//                     />

//                     Selected only
//                   </label>

//                   <button
//                     onClick={handleFindReplace}
//                     disabled={
//                       !findReplace.findValue ||
//                       !findReplace.replaceValue ||
//                       (findReplace.selectedOnly &&
//                         selectedIds.length === 0)
//                     }
//                     className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50"
//                   >
//                     <Replace size={14} />

//                     Replace All
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* ------------------------------------------------ */}
//           {/* Toolbar */}
//           {/* ------------------------------------------------ */}

//           {isEditable && (
//             <div className="flex gap-2 px-4 pb-2 pt-1 bg-white items-center">
//               <button
//                 onClick={() =>
//                   setIsAdding(true)
//                 }
//                 className="btn1 btn-blue flex items-center gap-1"
//               >
//                 <Plus size={14} />
//                 Add Row
//               </button>

//               <div className="flex-1" />

//               {selectedIds.length > 0 && (
//                 <span className="text-xs text-gray-500">
//                   {selectedIds.length} selected
//                 </span>
//               )}

//               {dirtyIds.length > 0 && (
//                 <span className="text-xs text-amber-600">
//                   {dirtyIds.length} unsaved
//                 </span>
//               )}

//               <button
//                 disabled={
//                   selectedIds.length === 0
//                 }
//                 onClick={
//                   handleDeleteSelected
//                 }
//                 className="btn1 flex items-center gap-1 text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
//               >
//                 <Trash2 size={14} />

//                 Delete Selected
//               </button>

//               <button
//                 disabled={
//                   dirtyIds.length === 0
//                 }
//                 onClick={
//                   handleSaveChanges
//                 }
//                 className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Save size={14} />

//                 Save
//                 {dirtyIds.length > 0 &&
//                   ` (${dirtyIds.length})`}
//               </button>
//             </div>
//           )}

//           {/* ------------------------------------------------ */}
//           {/* Table */}
//           {/* ------------------------------------------------ */}

//           <div className="flex-1 overflow-hidden px-4 pb-4">
//             <div className="border border-gray-200 rounded bg-white shadow-sm overflow-y-auto h-[calc(100vh-250px)]">
//               <table className="w-full text-left border-collapse table-fixed">

//                 <thead className="thead">
//                   <tr className="text-[10px] captialize text-gray-500 border-b">

//                     {isEditable && (
//                       <th className="th-thead w-[4%] text-center">
//                         <input
//                           type="checkbox"
//                           checked={
//                             allVisibleSelected
//                           }
//                           onChange={
//                             handleSelectAll
//                           }
//                           className="accent-blue-600 cursor-pointer"
//                         />
//                       </th>
//                     )}

//                     <th className="th-thead">
//                       Account ID
//                     </th>

//                     <th className="th-thead">
//                       Account Name
//                     </th>

//                     <th className="th-thead">
//                       Cost Type
//                     </th>

//                     <th className="th-thead">
//                       Account Type
//                     </th>

//                     <th className="th-thead">
//                       Expenses Type Mapping
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="tbody">

//                   {/* New Row */}

//                   {isAdding && (
//                     <tr className="bg-gray-50">

//                       <td className="tbody-td">
//                         <span className="text-blue-500 text-[10px]">
//                           NEW
//                         </span>
//                       </td>

//                       <td className="tbody-td">
//                         <input
//                           className="table-input"
//                           value={
//                             newRow.accountId
//                           }
//                           onChange={(e) =>
//                             setNewRow({
//                               ...newRow,
//                               accountId:
//                                 e.target.value,
//                             })
//                           }
//                         />
//                       </td>

//                       <td className="tbody-td">
//                         <input
//                           className="table-input"
//                           value={
//                             newRow.accountName
//                           }
//                           onChange={(e) =>
//                             setNewRow({
//                               ...newRow,
//                               accountName:
//                                 e.target.value,
//                             })
//                           }
//                         />
//                       </td>

//                       <td className="tbody-td">
//                         <input
//                           className="table-input"
//                           value={
//                             newRow.costType
//                           }
//                           onChange={(e) =>
//                             setNewRow({
//                               ...newRow,
//                               costType:
//                                 e.target.value,
//                             })
//                           }
//                         />
//                       </td>

//                       <td className="tbody-td">
//                         <select
//                           value={
//                             newRow.accountType
//                           }
//                           onChange={(e) =>
//                             setNewRow({
//                               ...newRow,
//                               accountType:
//                                 e.target.value,
//                             })
//                           }
//                           className="table-input"
//                         >
//                           <option value="">
//                             -- Select --
//                           </option>

//                           {accountTypeOptions.map(
//                             (option) => (
//                               <option
//                                 key={option}
//                                 value={option}
//                               >
//                                 {option}
//                               </option>
//                             )
//                           )}
//                         </select>
//                       </td>

//                       <td className="tbody-td">
//                         <div className="flex gap-2">

//                           <select
//                             value={
//                               newRow.budgetSheet
//                             }
//                             onChange={(e) =>
//                               setNewRow({
//                                 ...newRow,
//                                 budgetSheet:
//                                   e.target.value,
//                               })
//                             }
//                             className="table-input flex-1"
//                           >
//                             <option value="">
//                               -- Select --
//                             </option>

//                             {budgetSheetOptions.map(
//                               (option) => (
//                                 <option
//                                   key={option}
//                                   value={option}
//                                 >
//                                   {option ===
//                                   "Other Direct Costs"
//                                     ? "OTHER DIRECT COSTS"
//                                     : option}
//                                 </option>
//                               )
//                             )}
//                           </select>

//                           <button
//                             onClick={
//                               handleSaveNewRow
//                             }
//                             className="text-green-600"
//                             title="Save"
//                           >
//                             <Save size={15} />
//                           </button>

//                           <button
//                             onClick={() =>
//                               setIsAdding(false)
//                             }
//                             className="text-red-600"
//                             title="Cancel"
//                           >
//                             <X size={15} />
//                           </button>

//                         </div>
//                       </td>
//                     </tr>
//                   )}

//                   {/* Loading */}

//                   {loading && (
//                     <tr>
//                       <td
//                         colSpan={
//                           isEditable ? 6 : 5
//                         }
//                         className="py-10"
//                       >
//                         <div className="flex flex-col items-center justify-center">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />

//                           <span className="ml-2 mt-4 text-sm text-gray-500 font-medium">
//                             Loading...
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   )}

//                   {/* Empty */}

//                   {!loading &&
//                     filteredData.length === 0 && (
//                       <tr>
//                         <td
//                           colSpan={
//                             isEditable ? 6 : 5
//                           }
//                           className="py-10 text-center text-sm text-gray-500"
//                         >
//                           No accounts found.
//                         </td>
//                       </tr>
//                     )}

//                   {/* Data */}

//                   {!loading &&
//                     filteredData.map(
//                       (item, idx) => {
//                         const rowData =
//                           getRowData(item);

//                         const isSelected =
//                           selectedIds.includes(
//                             item.accountId
//                           );

//                         const isDirty =
//                           dirtyIds.includes(
//                             item.accountId
//                           );

//                         const isJustUpdated =
//                           lastUpdatedIds.includes(
//                             item.accountId
//                           );

//                         return (
//                           <tr
//                             key={idx}
//                             className={`border-b border-gray-200 transition-colors duration-500 text-xs text-gray-800 ${
//                               isJustUpdated
//                                 ? "bg-green-100"
//                                 : isDirty
//                                   ? "bg-yellow-50"
//                                   : "hover:bg-gray-50"
//                             }`}
//                           >

//                             {/* Checkbox */}

//                             {isEditable && (
//                               <td className="p-2 border-r border-gray-200 text-center">
//                                 <input
//                                   type="checkbox"
//                                   checked={
//                                     isSelected
//                                   }
//                                   onChange={() =>
//                                     handleSelectRow(
//                                       item.accountId
//                                     )
//                                   }
//                                   className="accent-blue-600 cursor-pointer"
//                                 />
//                               </td>
//                             )}

//                             {/* Account ID */}

//                             <td className="p-2 border-r border-gray-200">
//                               {isEditable ? (
//                                 <input
//                                   className="table-input"
//                                   value={
//                                     rowData.accountId
//                                   }
//                                   onChange={(e) =>
//                                     handleCellChange(
//                                       item.accountId,
//                                       "accountId",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                               ) : (
//                                 item.accountId
//                               )}
//                             </td>

//                             {/* Account Name */}

//                             <td className="p-2 border-r border-gray-200">
//                               {isEditable ? (
//                                 <input
//                                   className="table-input"
//                                   value={
//                                     rowData.accountName
//                                   }
//                                   onChange={(e) =>
//                                     handleCellChange(
//                                       item.accountId,
//                                       "accountName",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                               ) : (
//                                 item.accountName
//                               )}
//                             </td>

//                             {/* Cost Type */}

//                             <td className="p-2 border-r border-gray-200 uppercase">
//                               {isEditable ? (
//                                 <input
//                                   className="table-input"
//                                   value={
//                                     rowData.costType
//                                   }
//                                   onChange={(e) =>
//                                     handleCellChange(
//                                       item.accountId,
//                                       "costType",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                               ) : (
//                                 item.costType
//                               )}
//                             </td>

//                             {/* Account Type */}

//                             <td className="p-2 border-r border-gray-200 uppercase">
//                               {isEditable ? (
//                                 <select
//                                   value={
//                                     rowData.accountType
//                                   }
//                                   onChange={(e) =>
//                                     handleCellChange(
//                                       item.accountId,
//                                       "accountType",
//                                       e.target.value
//                                     )
//                                   }
//                                   className="table-input"
//                                 >
//                                   <option value="">
//                                     -- Select --
//                                   </option>

//                                   {accountTypeOptions.map(
//                                     (option) => (
//                                       <option
//                                         key={option}
//                                         value={option}
//                                       >
//                                         {option}
//                                       </option>
//                                     )
//                                   )}
//                                 </select>
//                               ) : (
//                                 item.accountType
//                               )}
//                             </td>

//                             {/* Expenses Type */}

//                             <td className="p-2 border-r border-gray-200 uppercase">
//                               {isEditable ? (
//                                 <select
//                                   value={
//                                     rowData.budgetSheet
//                                   }
//                                   onChange={(e) =>
//                                     handleCellChange(
//                                       item.accountId,
//                                       "budgetSheet",
//                                       e.target.value
//                                     )
//                                   }
//                                   className="table-input"
//                                 >
//                                   <option value="">
//                                     -- Select --
//                                   </option>

//                                   {budgetSheetOptions.map(
//                                     (option) => (
//                                       <option
//                                         key={option}
//                                         value={option}
//                                       >
//                                         {option ===
//                                         "Other Direct Costs"
//                                           ? "OTHER DIRECT COSTS"
//                                           : option}
//                                       </option>
//                                     )
//                                   )}
//                                 </select>
//                               ) : (
//                                 item.budgetSheet
//                               )}
//                             </td>

//                           </tr>
//                         );
//                       }
//                     )}

//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountMapping;
