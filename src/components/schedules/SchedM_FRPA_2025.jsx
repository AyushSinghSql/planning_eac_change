import React from "react";

const SchedM_FPRA_2025 = ({ companyName, companyAddress }) => {
  const tableRows = [
    {
      indirectPool: "NASA/NIH Fringe",
      allocationBase: "Total Direct and Indirect labor costs",
      rate: "33.04%",
    },
    {
      indirectPool: "Off Site OH Rate",
      allocationBase: "Total Direct Off site Labor and Fringe",
      rate: "6.02%",
    },
    {
      indirectPool: "Customer Site OH Rate",
      allocationBase: "Total Direct Customer site Labor and Fringe",
      rate: "4.26%",
    },
    {
      indirectPool: "G&A",
      allocationBase: "Value Added",
      rate: "7.45%",
    },
    {
      indirectPool: "MH",
      allocationBase: "Direct Materials and Subcontract Labor",
      rate: "1.81%",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.document}>
        <div style={styles.topTitle}>
          CONTROLLED UNCLASSIFIED INFORMATION (CUI)
        </div>

        <div style={styles.headerRow}>
          <div style={styles.leftHeader}>
            <div>National Aeronautics and</div>
            <div>Space Administration</div>

            <div style={styles.headerGap} />

            <div style={styles.bold}>Mary W. Jackson NASA Headquarters</div>
            <div style={styles.bold}>Washington, DC 20546-0001</div>
          </div>

          <div style={styles.logoWrap}>
            <img src="/nasa-logo.png" alt="NASA" style={styles.logo} />
          </div>
        </div>

        <div style={styles.metaRow}>
          <div>
            <div style={styles.smallCaps}>IN REPLY REFER TO:</div>
            <div> Cognizant Federal Agency Office</div>
          </div>
          <div style={styles.date}>August 19, 2025</div>
        </div>

        <div style={styles.addressBlock}>
          <div>William Bennett</div>
          <div>Director of Finance</div>
          <div>{companyName}</div>
          {/* <div>1960 E Grand Ave. Suite 1000</div> */}
          <div>{companyAddress}</div>
        </div>

        <div style={styles.subjectRow}>
          <span style={styles.subjectLabel}>Subject:</span>
          <span>
            {" "}
            Established Provisional Billing Rates for Contractor Fiscal Year
            (CFY) 2025
          </span>
        </div>

        <div style={styles.paragraph}>Dear William Bennett,</div>

        <div style={styles.paragraph}>
          In accordance with Federal Acquisition Regulation (FAR) 42.704,
          Billing Rates, {companyName} provisional billing rates for CFY 2025
          are as follows:
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.col1 }}>Indirect Pool</th>
              <th style={{ ...styles.th, ...styles.col2 }}>
                Allocation Base Description
              </th>
              <th style={{ ...styles.th, ...styles.col3 }}>
                Provisional
                <br />
                Billing Rate
                <br />
                (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                <td
                  style={{ ...styles.td, ...styles.col1, textAlign: "center" }}
                >
                  {row.indirectPool}
                </td>
                <td
                  style={{ ...styles.td, ...styles.col2, textAlign: "center" }}
                >
                  {row.allocationBase}
                </td>
                <td
                  style={{ ...styles.td, ...styles.col3, ...styles.boldCell }}
                >
                  {row.rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.paragraph}>
          {companyName} should immediately begin using the established billing
          rates in preparing SF 1443, Contractor's Request for Progress Payment,
          SF 1034, Public Vouchers for Purchases and Services and/or Cost
          Vouchers.
        </div>

        <div style={styles.paragraph}>
          All contract payments should be adjusted to reflect these provisional
          rates.
        </div>

        <div style={styles.footerBlock}>
          <div>Controlled Unclassified Information (CUI)</div>
          <div>Controlled By: NASA Headquarters Office of Procurement</div>
          <div>CUI Category: General Proprietary Business Information</div>
          <div>Point of Contact: john.d.moore@nasa.gov</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    padding: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: '"Times New Roman", Times, serif',
  },
  document: {
    width: "820px",
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: "48px 44px 56px",
    boxSizing: "border-box",
    lineHeight: 1.15,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  topTitle: {
    textAlign: "center",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    marginBottom: "38px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "22px",
  },
  leftHeader: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    lineHeight: 1.15,
  },
  headerGap: {
    height: "12px",
  },
  bold: {
    fontWeight: 700,
  },
  logoWrap: {
    width: "110px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingTop: "8px",
  },
  logo: {
    width: "78px",
    height: "78px",
    objectFit: "contain",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    fontSize: "13px",
  },
  smallCaps: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  date: {
    fontSize: "14px",
    fontWeight: 700,
    paddingTop: "4px",
    whiteSpace: "nowrap",
  },
  addressBlock: {
    fontSize: "13px",
    marginBottom: "22px",
  },
  subjectRow: {
    display: "flex",
    alignItems: "baseline",
    fontSize: "13px",
    marginBottom: "18px",
  },
  subjectLabel: {
    fontWeight: 400,
  },
  paragraph: {
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "left",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px",
    marginBottom: "18px",
    fontSize: "13px",
  },
  th: {
    border: "2px solid #000",
    padding: "6px 8px",
    textAlign: "center",
    verticalAlign: "middle",
    fontWeight: 700,
    lineHeight: 1.1,
  },
  td: {
    border: "2px solid #000",
    padding: "5px 8px",
    verticalAlign: "middle",
    lineHeight: 1.05,
  },
  boldCell: {
    fontWeight: 700,
    textAlign: "center",
  },
  col1: {
    width: "27%",
  },
  col2: {
    width: "57%",
  },
  col3: {
    width: "16%",
  },
  footerBlock: {
    marginTop: "56px",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.2,
  },
};

export default SchedM_FPRA_2025;
