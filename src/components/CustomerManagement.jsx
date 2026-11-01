import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "./config";

const STORAGE_KEY = "manageCustomersPage";

const initialCustomer = {
  customerAccount: "A00001",
  name: "ADNET Systems",
  paymentTerms: "Net 30",
};

const initialAddress = {
  customerAccount: "A00001",
  addressCode: "1",
  billTo: "Y",
  shipTo: "N",
  phone: "301-770-4850",
  emailAddress: "jblurton@adnet-sys.com",
  addressLine1: "164 Rollins AVE",
  addressLine2: "Suite 303",
  city: "Rockville",
  stateProvince: "MD",
  postalCode: "20852",
};

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([initialCustomer]);
  const [addresses, setAddresses] = useState([initialAddress]);
  const [loading, setLoading] = useState(false);

  // Track selected customer and address row IDs
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [selectedAddressIds, setSelectedAddressIds] = useState([]);

  // Active customer account used to filter address rows
  const [activeCustomerAccount, setActiveCustomerAccount] = useState("A00001");

  const [nextCustomerId, setNextCustomerId] = useState(1);
  const [nextAddressId, setNextAddressId] = useState(1);

  const [customerRows, setCustomerRows] = useState([]);
  const [addressRows, setAddressRows] = useState([]);

  // Fetch customers and addresses from the backend API
  const fetchCustomersWithAddress = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/Customer/GetAllWithAddress`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch customers (${response.status})`);
      }
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const loadedCustomers = [];
        const loadedAddresses = [];

        data.forEach((custItem, index) => {
          const custAccount = custItem.custId || `A0000${index + 1}`;

          loadedCustomers.push({
            _id: index,
            customerAccount: custAccount,
            name: custItem.custName || "",
            paymentTerms: custItem.terms || "Net 30",
          });

          if (
            Array.isArray(custItem.addresses) &&
            custItem.addresses.length > 0
          ) {
            custItem.addresses.forEach((addrItem, addrIndex) => {
              loadedAddresses.push({
                _id: loadedAddresses.length,
                customerAccount: custAccount,
                addressCode: addrItem.addrCd || String(addrIndex + 1),
                billTo: addrItem.billFl || "Y",
                shipTo: addrItem.shipFl || "N",
                phone: addrItem.phone || "",
                emailAddress: addrItem.emailAddress || "",
                addressLine1: addrItem.ln1 || "",
                addressLine2: addrItem.ln2 || "",
                city: addrItem.city || "",
                stateProvince: addrItem.state || "",
                postalCode: addrItem.postal || "",
              });
            });
          }
        });

        setCustomers(loadedCustomers);
        setAddresses(loadedAddresses);
        setCustomerRows(loadedCustomers);
        setAddressRows(loadedAddresses);
        setNextCustomerId(loadedCustomers.length);
        setNextAddressId(loadedAddresses.length);

        if (loadedCustomers.length > 0) {
          setActiveCustomerAccount(loadedCustomers[0].customerAccount);
        }
      }
    } catch (err) {
      console.error("Error loading customers with addresses:", err);
      toast.error(
        "Failed to load customers from server. Falling back to local storage.",
      );

      // Fallback to localStorage if fetch fails
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const fallbackCust = saved
          ? JSON.parse(saved).customers || [initialCustomer]
          : [initialCustomer];
        const fallbackAddr = saved
          ? JSON.parse(saved).addresses || [initialAddress]
          : [initialAddress];
        setCustomers(fallbackCust);
        setAddresses(fallbackAddr);
        setCustomerRows(fallbackCust.map((r, i) => ({ ...r, _id: i })));
        setAddressRows(fallbackAddr.map((r, i) => ({ ...r, _id: i })));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersWithAddress();
  }, []);

  const inputClass =
    "w-full h-[27px] rounded border border-gray-300 bg-white px-2 text-xs text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100";
  const tableHeaderClass =
    "border border-gray-300 bg-[#e5f3fb] px-2 py-2 text-center text-xs font-semibold text-gray-800";
  const tableCellClass = "border border-gray-300 px-1 py-1 align-middle";

  const updateRow = (section, id, field, value) => {
    const setter = section === "customer" ? setCustomerRows : setAddressRows;
    setter((prev) =>
      prev.map((row) => (row._id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSelectCustomer = (id, account) => {
    setSelectedCustomerIds([id]);
    setActiveCustomerAccount(account);
    setSelectedAddressIds([]);
  };

  const handleNew = (section) => {
    if (section === "customer") {
      const custId = customerRows.length + nextCustomerId + 1;
      const addrId = addressRows.length + nextAddressId + 1;
      setNextCustomerId(custId);
      setNextAddressId(addrId);

      const newAccountCode = `A0000${custId}`;

      setCustomerRows((prev) => [
        ...prev,
        {
          _id: custId,
          customerAccount: newAccountCode,
          name: "",
          paymentTerms: "Net 30",
        },
      ]);
      setSelectedCustomerIds([custId]);
      setActiveCustomerAccount(newAccountCode);

      setAddressRows((prev) => [
        ...prev,
        {
          _id: addrId,
          customerAccount: newAccountCode,
          addressCode: "1",
          billTo: "Y",
          shipTo: "Y",
          phone: "",
          emailAddress: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          stateProvince: "",
          postalCode: "",
        },
      ]);
      setSelectedAddressIds([addrId]);
    } else {
      if (!activeCustomerAccount) {
        toast.warn("Please select a customer first before adding an address.");
        return;
      }

      const id = addressRows.length + nextAddressId + 1;
      setNextAddressId(id);

      setAddressRows((prev) => [
        ...prev,
        {
          _id: id,
          customerAccount: activeCustomerAccount,
          addressCode: String(
            prev.filter((a) => a.customerAccount === activeCustomerAccount)
              .length + 1,
          ),
          billTo: "Y",
          shipTo: "Y",
          phone: "",
          emailAddress: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          stateProvince: "",
          postalCode: "",
        },
      ]);
      setSelectedAddressIds((prev) => [...prev, id]);
    }
  };

  const handleCopy = (section) => {
    const isCustomer = section === "customer";
    const rows = isCustomer ? customerRows : filteredAddresses;
    const selectedIds = isCustomer ? selectedCustomerIds : selectedAddressIds;
    const setRows = isCustomer ? setCustomerRows : setAddressRows;
    const setSelected = isCustomer
      ? setSelectedCustomerIds
      : setSelectedAddressIds;
    const setNextId = isCustomer ? setNextCustomerId : setNextAddressId;
    const nextIdVal = (isCustomer ? nextCustomerId : nextAddressId) + 1;
    const selected = rows.find((row) => selectedIds.includes(row._id));

    if (!selected) {
      toast.warn(
        `Please select a ${isCustomer ? "customer" : "customer address"} to copy.`,
      );
      return;
    }

    setNextId(nextIdVal);
    const newId = rows.length > 0 ? Math.max(...rows.map((r) => r._id)) + 1 : 1;
    const copiedRow = { ...selected, _id: newId };
    setRows((prev) => [...prev, copiedRow]);
    setSelected((prev) => [...prev, newId]);
  };

  const handleDelete = (section) => {
    const isCustomer = section === "customer";
    const selectedIds = isCustomer ? selectedCustomerIds : selectedAddressIds;
    const rows = isCustomer ? customerRows : addressRows;
    const setRows = isCustomer ? setCustomerRows : setAddressRows;
    const setSelected = isCustomer
      ? setSelectedCustomerIds
      : setSelectedAddressIds;

    if (!selectedIds.length) {
      toast.warn(
        `Please select a ${isCustomer ? "customer" : "customer address"} to delete.`,
      );
      return;
    }
    setRows(rows.filter((row) => !selectedIds.includes(row._id)));
    setSelected([]);
  };

  const handleClear = () => {
    try {
      setCustomerRows(customers.map((row, index) => ({ ...row, _id: index })));
      setAddressRows(addresses.map((row, index) => ({ ...row, _id: index })));
      setSelectedCustomerIds([]);
      setSelectedAddressIds([]);
      if (customers.length > 0) {
        setActiveCustomerAccount(customers[0].customerAccount);
      }
      toast.info("Unsaved changes cleared.");
    } catch (error) {
      toast.warn("Unable to restore the changes. Please try again.");
    }
  };

  const handleSave = () => {
    try {
      // 1. Validate Customer Required Fields
      for (const cust of customerRows) {
        if (
          !cust.customerAccount?.trim() ||
          !cust.name?.trim() ||
          !cust.paymentTerms?.trim()
        ) {
          toast.warn(
            "Validation Error: Customer Account, Name, and Payment Terms are required for all customers.",
          );
          return;
        }
      }

      // 2. Validate Unique Customer Accounts
      const accounts = customerRows
        .map((r) => r.customerAccount.trim())
        .filter(Boolean);
      const uniqueAccounts = new Set(accounts);
      if (uniqueAccounts.size !== accounts.length) {
        toast.warn(
          "Validation Error: Customer Account numbers cannot be repeated. Each customer account must be unique.",
        );
        return;
      }

      // 3. Validate Address Required Fields
      for (const addr of addressRows) {
        if (
          !addr.phone?.trim() ||
          !addr.emailAddress?.trim() ||
          !addr.addressLine1?.trim() ||
          !addr.city?.trim() ||
          !addr.stateProvince?.trim()
        ) {
          toast.warn(
            "Validation Error: Phone, Email Address, Address Line 1, City, and State/Province are required for all customer addresses.",
          );
          return;
        }
      }

      // 4. Validate Bill To & Ship To per Customer Account scope
      const customerAccountList = Array.from(
        new Set(addressRows.map((a) => a.customerAccount)),
      );
      for (const account of customerAccountList) {
        const accountAddresses = addressRows.filter(
          (a) => a.customerAccount === account,
        );

        if (accountAddresses.length > 1) {
          for (const row of accountAddresses) {
            if (row.billTo === "Y" && row.shipTo === "Y") {
              toast.warn(
                `Validation Error (Customer: ${account}, Address Code: ${row.addressCode || "New"}): When multiple addresses exist, both Bill To and Ship To cannot be 'Y' in the same row.`,
              );
              return;
            }
          }
        }

        const billToYCount = accountAddresses.filter(
          (r) => r.billTo === "Y",
        ).length;
        if (billToYCount > 1) {
          toast.warn(
            `Validation Error (${account}): Please select only one address for Bill To.`,
          );
          return;
        }

        const shipToYCount = accountAddresses.filter(
          (r) => r.shipTo === "Y",
        ).length;
        if (shipToYCount > 1) {
          toast.warn(
            `Validation Error (${account}): Please select only one address for Ship To.`,
          );
          return;
        }
      }

      const cleanCustomers = customerRows.map(({ _id, ...row }) => row);
      const cleanAddresses = addressRows.map(({ _id, ...row }) => row);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          customers: cleanCustomers,
          addresses: cleanAddresses,
        }),
      );
      setCustomers(cleanCustomers);
      setAddresses(cleanAddresses);
      toast.success("Customer details saved successfully.");
    } catch (error) {
      toast.warn("Unable to save the changes. Please try again.");
    }
  };

  const filteredAddresses = activeCustomerAccount
    ? addressRows.filter((row) => row.customerAccount === activeCustomerAccount)
    : [];

  const renderTextInput = (section, row, field, placeholder = "") => (
    <input
      type="text"
      value={row[field] ?? ""}
      onChange={(event) =>
        updateRow(section, row._id, field, event.target.value)
      }
      className={inputClass}
      placeholder={placeholder}
    />
  );

  const renderToolbar = (section) => (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => handleNew(section)}
        className="btn1 btn-blue whitespace-nowrap"
      >
        New
      </button>
      <button
        type="button"
        onClick={() => handleCopy(section)}
        className="btn1 btn-blue whitespace-nowrap"
      >
        Copy
      </button>
      <button
        type="button"
        onClick={() => handleDelete(section)}
        className="btn1 btn-red whitespace-nowrap"
      >
        Delete
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="btn1 btn-blue whitespace-nowrap"
      >
        Clear
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Customer Section */}
      <section className="mb-1">
        <div className="mb-2 flex min-h-[42px] items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800">
            Manage Customers {loading ? "(Loading...)" : ""}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {renderToolbar("customer")}
            <button
              type="button"
              onClick={handleSave}
              className="btn1 btn-blue whitespace-nowrap"
            >
              Save
            </button>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
          <div className="w-full overflow-x-auto rounded-sm border border-gray-200">
            <table className="w-full min-w-[760px] table-fixed border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className={`${tableHeaderClass} w-7`}>
                    <input
                      type="checkbox"
                      aria-label="Select all customers"
                      checked={
                        customerRows.length > 0 &&
                        selectedCustomerIds.length === customerRows.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomerIds(
                            customerRows.map((r) => r._id),
                          );
                          setActiveCustomerAccount("");
                        } else {
                          setSelectedCustomerIds([]);
                          setActiveCustomerAccount("");
                        }
                      }}
                      className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                    />
                  </th>
                  <th className={tableHeaderClass}>
                    Customer Account <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    Name <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    Payment Terms <span className="text-red-600">*</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-gray-300 px-4 py-8 text-center text-xs text-gray-500"
                    >
                      No customers available. Click New to add a customer.
                    </td>
                  </tr>
                ) : (
                  customerRows.map((row) => {
                    const isSelected = selectedCustomerIds.includes(row._id);
                    return (
                      <tr
                        key={row._id}
                        onClick={() =>
                          handleSelectCustomer(row._id, row.customerAccount)
                        }
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                      >
                        <td className={`${tableCellClass} text-center`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedCustomerIds((prev) =>
                                  prev.filter((id) => id !== row._id),
                                );
                                setActiveCustomerAccount("");
                              } else {
                                handleSelectCustomer(
                                  row._id,
                                  row.customerAccount,
                                );
                              }
                            }}
                            className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                          />
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput(
                            "customer",
                            row,
                            "customerAccount",
                            "Customer account",
                          )}
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput("customer", row, "name", "Name")}
                        </td>

                        {/* Payment Terms Dropdown */}
                        <td className={tableCellClass}>
                          <select
                            value={row.paymentTerms ?? "Net 30"}
                            onChange={(e) =>
                              updateRow(
                                "customer",
                                row._id,
                                "paymentTerms",
                                e.target.value,
                              )
                            }
                            className={inputClass}
                          >
                            <option value="Due on receipt">
                              Due on receipt
                            </option>
                            <option value="Net 15">Net 15</option>
                            <option value="Net 30">Net 30</option>
                            <option value="Net 60">Net 60</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>Total customers: {customerRows.length}</span>
            <span>Selected: {selectedCustomerIds.length}</span>
          </div>
        </div>
      </section>

      {/* Customer Address Section */}
      <section className="mt-3">
        <div className="mb-2 flex min-h-[42px] flex-wrap items-center justify-between gap-2 rounded-md bg-white px-3 py-2 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800">
            Customer Address{" "}
            {activeCustomerAccount ? `(${activeCustomerAccount})` : ""}
          </h2>
          {renderToolbar("address")}
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
          <div className="w-full overflow-x-auto rounded-sm border border-gray-200">
            <table className="w-full min-w-[1500px] table-fixed border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className={`${tableHeaderClass} w-7`}>
                    <input
                      type="checkbox"
                      aria-label="Select all customer addresses"
                      checked={
                        filteredAddresses.length > 0 &&
                        selectedAddressIds.length === filteredAddresses.length
                      }
                      onChange={(e) =>
                        setSelectedAddressIds(
                          e.target.checked
                            ? filteredAddresses.map((r) => r._id)
                            : [],
                        )
                      }
                      className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                    />
                  </th>
                  <th className={tableHeaderClass}>
                    Address Code <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    Bill To <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    Ship To <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    Phone <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    Email Address <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    Address Line 1 <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>Address Line 2</th>
                  <th className={tableHeaderClass}>
                    City <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>
                    State/Province <span className="text-red-600">*</span>
                  </th>
                  <th className={tableHeaderClass}>Postal Code</th>
                </tr>
              </thead>
              <tbody>
                {filteredAddresses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="border border-gray-300 px-4 py-8 text-center text-xs text-gray-500"
                    >
                      {activeCustomerAccount
                        ? "No customer addresses available. Click New to add an address."
                        : "Please select a customer to view or add addresses."}
                    </td>
                  </tr>
                ) : (
                  filteredAddresses.map((row) => {
                    const isSelected = selectedAddressIds.includes(row._id);
                    return (
                      <tr
                        key={row._id}
                        onClick={() => setSelectedAddressIds([row._id])}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                      >
                        <td className={`${tableCellClass} text-center`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() =>
                              setSelectedAddressIds((prev) =>
                                prev.includes(row._id)
                                  ? prev.filter((id) => id !== row._id)
                                  : [...prev, row._id],
                              )
                            }
                            className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                          />
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput(
                            "address",
                            row,
                            "addressCode",
                            "Address code",
                          )}
                        </td>

                        {/* Bill To Dropdown */}
                        <td className={tableCellClass}>
                          <select
                            value={row.billTo ?? "Y"}
                            onChange={(e) =>
                              updateRow(
                                "address",
                                row._id,
                                "billTo",
                                e.target.value,
                              )
                            }
                            className={inputClass}
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </td>

                        {/* Ship To Dropdown */}
                        <td className={tableCellClass}>
                          <select
                            value={row.shipTo ?? "Y"}
                            onChange={(e) =>
                              updateRow(
                                "address",
                                row._id,
                                "shipTo",
                                e.target.value,
                              )
                            }
                            className={inputClass}
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </td>

                        <td className={tableCellClass}>
                          {renderTextInput("address", row, "phone", "Phone")}
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput(
                            "address",
                            row,
                            "emailAddress",
                            "Email address",
                          )}
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput(
                            "address",
                            row,
                            "addressLine1",
                            "Address line 1",
                          )}
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput(
                            "address",
                            row,
                            "addressLine2",
                            "Address line 2",
                          )}
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput("address", row, "city", "City")}
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput(
                            "address",
                            row,
                            "stateProvince",
                            "State/Province",
                          )}
                        </td>
                        <td className={tableCellClass}>
                          {renderTextInput(
                            "address",
                            row,
                            "postalCode",
                            "Postal code",
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>Total addresses: {filteredAddresses.length}</span>
            <span>Selected: {selectedAddressIds.length}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageCustomers;
