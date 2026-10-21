import React, { useEffect, useState } from "react";
import signature from "../../assets/signature.png";

const SCHEDULE_N_STORAGE_KEY = "SCHEDULE_N_DATA";

const ScheduleN = ({ companyName, companyAddress, year }) => {
  const [fiscalYearEnd, setFiscalYearEnd] = useState(`${year}-12-31`);
  const [dateOfExecution, setDateOfExecution] = useState(`${year}-05-26`);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(SCHEDULE_N_STORAGE_KEY);
      if (!savedData) return;

      const parsedData = JSON.parse(savedData);
      if (parsedData.fiscalYearEnd) setFiscalYearEnd(parsedData.fiscalYearEnd);
      if (parsedData.dateOfExecution)
        setDateOfExecution(parsedData.dateOfExecution);
    } catch (error) {
      console.error("Unable to load saved Schedule N data:", error);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        SCHEDULE_N_STORAGE_KEY,
        JSON.stringify({
          fiscalYearEnd,
          dateOfExecution,
        }),
      );

      alert("Changes saved successfully.");
    } catch (error) {
      console.error("Unable to save Schedule N data:", error);
      alert("Unable to save changes.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  const formatLongDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-").map(Number);
    const value = new Date(year, month - 1, day);
    return value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFiscalYearStart = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-").map(Number);
    const fiscalEnd = new Date(year, month - 1, day);
    const previousYear = new Date(year - 1, month - 1, day);

    // The start date is one day after the same calendar date one year earlier.
    // This creates a complete one-year period ending on the selected fiscal year end.
    previousYear.setDate(previousYear.getDate() + 1);

    const startYear = previousYear.getFullYear();
    const startMonth = String(previousYear.getMonth() + 1).padStart(2, "0");
    const startDay = String(previousYear.getDate()).padStart(2, "0");

    return `${startYear}-${startMonth}-${startDay}`;
  };

  const fiscalYear = fiscalYearEnd ? fiscalYearEnd.split("-")[0] : "";

  const fiscalYearStart = getFiscalYearStart(fiscalYearEnd);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#111",
        backgroundColor: "#fff",
        padding: "32px 40px",
        maxWidth: "900px",
        margin: "0 auto",
        lineHeight: 1.45,
        fontSize: "15px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontWeight: 700, fontSize: "22px" }}>
          Certificate of Final Indirect Costs
        </div>
        {/* <div style={{ fontWeight: 700, fontSize: "20px", marginTop: "4px" }}>
          Fiscal Year End - {formatDate(fiscalYearEnd)}
        </div> */}

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <label style={{ fontSize: "14px", fontWeight: 600 }}>
            Fiscal Year End:
          </label>
          <input
            type="date"
            value={fiscalYearEnd}
            onChange={(e) => setFiscalYearEnd(e.target.value)}
            style={{
              padding: "5px 8px",
              border: "1px solid #999",
              borderRadius: "3px",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
            }}
          />
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "7px 18px",
              border: "none",
              borderRadius: "18px",
              backgroundColor: "#164653",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "Arial, sans-serif",
            }}
          >
            Save
          </button>
        </div>
      </div>

      <p style={{ marginBottom: "28px" }}>
        This is to certify that I have reviewed this proposal to establish final
        indirect cost rates, and to the best of my knowledge and belief:
      </p>

      <div style={{ marginBottom: "26px" }}>
        <p style={{ marginBottom: "18px" }}>
          <strong>1.</strong> All costs included in the proposal, Revolve
          FinTech LLC, FY{fiscalYear} ICS, to establish final indirect cost
          rates for {formatLongDate(fiscalYearStart)} to{" "}
          {formatLongDate(fiscalYearEnd)}. Are allowable in accordance with the
          cost principles of the Federal Acquisition Regulation (FAR) and its
          supplements applicable to the contracts to which the final indirect
          cost rates will apply; and
        </p>

        <p>
          <strong>2.</strong> This proposal does not include any costs that are
          expressly unallowable under applicable cost principles of the FAR or
          its supplements.
        </p>
      </div>

      <div style={{ marginTop: "48px", marginBottom: "42px" }}>
        <p style={{ margin: "0 0 12px 0" }}>
          <strong>Firm:</strong> {companyName}
        </p>

        <p style={{ margin: "0 0 12px 0", display: "flex", alignItems: "end" }}>
          <strong style={{ marginRight: "8px" }}>Signature:</strong>
          <span
            style={{
              borderBottom: "1px solid #999",
              display: "inline-block",
              width: "220px",
              paddingBottom: "2px",
            }}
          >
            <img
              src={signature}
              alt="William Bennett signature"
              style={{
                width: "220px",
                height: "45px",
                objectFit: "contain",
                objectPosition: "left bottom",
                display: "block",
              }}
            />
          </span>
        </p>

        <p style={{ margin: "0 0 12px 0" }}>
          <strong>Name of Certifying Official:</strong> William Bennett
        </p>

        <p style={{ margin: "0 0 12px 0" }}>
          <strong>Title:</strong> Director of Finance
        </p>

        <p
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <strong style={{ marginRight: "8px" }}>Date of Execution:</strong>
          <input
            type="date"
            value={dateOfExecution}
            onChange={(e) => setDateOfExecution(e.target.value)}
            style={{
              border: "none",
              borderBottom: "1px solid #999",
              outline: "none",
              fontSize: "15px",
              fontFamily: "Arial, sans-serif",
              padding: "2px 4px",
              width: "150px",
              backgroundColor: "transparent",
            }}
          />
        </p>
      </div>

      <div style={{ marginTop: "36px" }}>
        <p style={{ marginBottom: "14px", fontWeight: 700 }}>
          FAR Part 52.242-4-- Certification of Final Indirect Costs.
        </p>

        <p style={{ marginBottom: "14px" }}>
          As prescribed in 42.703-2(f), insert the following clause:
        </p>

        <p style={{ marginBottom: "14px", fontWeight: 700 }}>
          Certification of Final Indirect Costs (Jan 1997)
        </p>

        <div style={{ paddingLeft: "18px" }}>
          <p style={{ margin: "0 0 10px 0" }}>
            <strong>(a)</strong> The Contractor shall --
          </p>

          <p style={{ margin: "0 0 8px 18px" }}>
            <strong>(1)</strong> Certify any proposal to establish or modify
            final indirect cost rates.
          </p>

          <p style={{ margin: "0 0 8px 18px" }}>
            <strong>(2)</strong> Use the format in paragraph (c) of this clause
            to certify; and
          </p>

          <p style={{ margin: "0 0 10px 18px" }}>
            <strong>(3)</strong> Have the certificate signed by an individual of
            the Contractor's organization at a level no lower than a vice
            president or chief financial officer of the business segment of the
            Contractor that submits the proposal.
          </p>

          <p style={{ margin: "0 0 10px 0" }}>
            <strong>(b)</strong> Failure by the Contractor to submit a signed
            certificate, as described in this clause, may result in final
            indirect costs at rates unilaterally established by the Contracting
            Officer.
          </p>

          <p style={{ margin: 0 }}>
            <strong>(c)</strong> The certificate of final indirect costs shall
            be read as follows: (see above)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleN;
