import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImg from "../assets/CapComm_Logo_v2_nobk.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { backendUrl } from "./config";

const InvoiceViewer = ({ data, setInvoiceModalVisible }) => {
  const [isLoading, setIsLoading] = useState(false);
  const invoiceRef = useRef();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>Loading...</div>;
  }

  const invoice = data[0];

  // Group line items by PO Line for rendering with headers
  const groupedByPoLine = invoice.lineItems.reduce((groups, item) => {
    const key = item.poLine || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});


  const handleDownloadPdf = async () => {
    setIsLoading(true);

    if (!invoiceRef.current || !invoice) {
      console.warn("Invoice content or data is missing.");
      setIsLoading(false);
      return;
    }

    try {
      // Get current invoice data
      const currentInvoice = invoice;

      // Group and combine line items (same logic as downloadInvoices)
      const groupAndCombineLineItems = (lineItems) => {
        if (!lineItems || !Array.isArray(lineItems)) {
          return [];
        }

        const groupedItems = {};

        lineItems.forEach((item) => {
          const plcKey = item.plc || "";
          const vendorKey = item.vendor || "";
          const employeeKey = item.employee || "";
          const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

          if (groupedItems[groupKey]) {
            const existingHours = parseFloat(groupedItems[groupKey].hours) || 0;
            const newHours = parseFloat(item.hours) || 0;
            groupedItems[groupKey].hours = existingHours + newHours;

            const existingAmount =
              parseFloat(groupedItems[groupKey].amount) || 0;
            const newAmount = parseFloat(item.amount) || 0;
            groupedItems[groupKey].amount = existingAmount + newAmount;
          } else {
            groupedItems[groupKey] = {
              poLine: item.poLine || " ",
              plc: item.plc || " ",
              vendor: item.vendor || " ",
              employee: item.employee || " ",
              hours: parseFloat(item.hours) || 0,
              rate: item.rate || 0,
              amount: parseFloat(item.amount) || 0,
              line_No: item.line_No || " ",
            };
          }
        });

        return Object.values(groupedItems).map((item) => ({
          poLine: item.poLine,
          plc: item.plc,
          vendor: item.vendor,
          employee: item.employee,
          hours: Number(item.hours.toFixed(2)),
          rate: item.rate,
          amount: Number(item.amount.toFixed(2)),
          line_No: item.line_No,
        }));
      };

      // Group and combine line items
      const combinedLineItems = groupAndCombineLineItems(
        currentInvoice.lineItems || []
      );

      // Recalculate total amount based on combined line items
      const newTotalAmount = combinedLineItems.reduce((sum, item) => {
        return sum + (parseFloat(item.amount) || 0);
      }, 0);

      // Transform data with combined line items (same structure as downloadInvoices)
      const transformedData = [
        {
          invoiceId: currentInvoice.invoiceId || " ",
          invoiceDate:
            currentInvoice.period || currentInvoice.invoiceDate || " ",
          currency: currentInvoice.currency || " ",
          totalAmount: Number(newTotalAmount.toFixed(2)),
          lineItems: combinedLineItems,
          billTo: currentInvoice.billTo || " ",
          buyer: currentInvoice.buyer || " ",
          purchaseOrderId:
            currentInvoice.po_Number || currentInvoice.purchaseOrderId || " ",
          releaseNumber:
            currentInvoice.po_rlse_Number ||
            currentInvoice.releaseNumber ||
            " ",
          poStartEndDate:
            currentInvoice.po_Start_End_Date ||
            currentInvoice.poStartEndDate ||
            " ",
          terms: currentInvoice.terms || " ",
          amountDue: Number(newTotalAmount.toFixed(2)),
          period: currentInvoice.period || " ",
          po_Number: currentInvoice.po_Number || " ",
          po_rlse_Number: currentInvoice.po_rlse_Number || " ",
          po_Start_End_Date: currentInvoice.po_Start_End_Date || " ",
          venderName: currentInvoice.venderName || "",
        },
      ];

      // Create temporary container with same styling as downloadInvoices
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "14mm";
      tempContainer.style.margin = "0";
      tempContainer.style.boxSizing = "border-box";
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "12px";
      tempContainer.style.lineHeight = "1.4";
      tempContainer.style.color = "#000000";
      document.body.appendChild(tempContainer);

      // Create temporary React root and render InvoiceViewer
      const ReactDOM = (await import("react-dom/client")).default;
      const React = (await import("react")).default;
      const { default: InvoiceViewer } = await import("./InvoiceViewer");

      const root = ReactDOM.createRoot(tempContainer);

      await new Promise((resolve) => {
        root.render(
          React.createElement(InvoiceViewer, {
            data: transformedData,
            setInvoiceModalVisible: () => {},
          })
        );
        setTimeout(resolve, 3000);
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const input =
        tempContainer.querySelector(
          'div[style*="max-width: 768px"], .invoice-content, .invoice-viewer'
        ) ||
        tempContainer.firstElementChild ||
        tempContainer;

      if (!input) {
        throw new Error("Invoice content not found");
      }

      // Ensure content is visible
      input.style.display = "block";
      input.style.visibility = "visible";
      input.style.opacity = "1";

      // Initialize PDF with same settings as downloadInvoices
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const bottomMargin = 31.5; // space for footer
      const usableWidth = pdfWidth - 2 * margin;
      // const usableHeight = pdfHeight - 2 * margin;
      const usableHeight = pdfHeight - margin - bottomMargin;

      // Capture full content first with same settings as downloadInvoices
      const fullCanvas = await html2canvas(input, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        width: input.scrollWidth || input.clientWidth,
        height: input.scrollHeight || input.clientHeight,
        windowWidth: 1200,
        logging: false,
      });

      if (fullCanvas.width === 0 || fullCanvas.height === 0) {
        throw new Error("Canvas has zero dimensions");
      }

      const fullImgData = fullCanvas.toDataURL("image/png", 0.98);

      // Calculate scaling
      const imgProps = pdf.getImageProperties(fullImgData);
      const scale = usableWidth / imgProps.width;
      const scaledHeight = imgProps.height * scale;

      // Calculate pages needed
      const pageHeight = usableHeight;

      // Smart page breaking - detect table rows and avoid cutting them
      let currentY = 0;
      let pageNumber = 0;

      // Detect table rows by looking for horizontal patterns in the content
      const detectTableRows = () => {
        const rows = [];
        const tableElements = input.querySelectorAll(
          'tr, .table-row, [class*="row"]'
        );

        if (tableElements.length > 0) {
          tableElements.forEach((row) => {
            const rect = row.getBoundingClientRect();
            const inputRect = input.getBoundingClientRect();
            const relativeTop = rect.top - inputRect.top + input.scrollTop;
            const relativeBottom = relativeTop + rect.height;

            rows.push({
              top: relativeTop * scale,
              bottom: relativeBottom * scale,
              height: rect.height * scale,
            });
          });
        }

        return rows.sort((a, b) => a.top - b.top);
      };

      const tableRows = detectTableRows();

      while (currentY < scaledHeight && pageNumber < 50) {
        // Safety limit
        if (pageNumber > 0) {
          pdf.addPage();
        }

        // let nextY = currentY + pageHeight;
        let nextY = currentY + usableHeight;

        // Check if we would cut through a table row
        if (tableRows.length > 0) {
          for (const row of tableRows) {
            // If a row would be cut by the page break
            if (row.top < nextY && row.bottom > nextY) {
              // If the row can fit on current page, adjust nextY to include it
              if (row.bottom - currentY <= pageHeight) {
                nextY = row.bottom;
              } else {
                // If row is too big for current page, move it to next page
                nextY = row.top;
              }
              break;
            }
          }
        }

        // Ensure we don't go beyond content
        const actualHeight = Math.min(
          nextY - currentY,
          scaledHeight - currentY
        );

        if (actualHeight > 0) {
          // Create canvas for this page section
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");

          const sourceY = currentY / scale;
          const sourceHeight = actualHeight / scale;

          pageCanvas.width = fullCanvas.width;
          pageCanvas.height = sourceHeight;

          // Draw the section
          pageCtx.drawImage(
            fullCanvas,
            0,
            sourceY,
            fullCanvas.width,
            sourceHeight,
            0,
            0,
            fullCanvas.width,
            sourceHeight
          );

          const pageImgData = pageCanvas.toDataURL("image/png", 0.98);

          // Add to PDF
          pdf.addImage(
            pageImgData,
            "PNG",
            margin,
            margin,
            usableWidth,
            actualHeight
          );
        }

        currentY = nextY;
        pageNumber++;
      }

      // Fallback: if no pages were created, add the full image
      if (pageNumber === 0) {
        pdf.addImage(
          fullImgData,
          "PNG",
          margin,
          margin,
          usableWidth,
          Math.min(scaledHeight, pageHeight)
        );
      }

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      // Save PDF with invoice number as filename
      const filename = `${
        currentInvoice.invoiceId || currentInvoice.invoiceNumber || "invoice"
      }.pdf`;
      pdf.save(filename);

      setIsLoading(false);
      setInvoiceModalVisible(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF: ${error.message}`);
      setIsLoading(false);
    }
  };

  // catch (error) {
  //   console.error("Error creating invoice or generating PDF:", error);
  // }

  const containerStyle = {
    maxWidth: "768px",
    margin: "auto",
    padding: "20px",
    border: "2px solid #d1d5db",
    fontFamily: "monospace",
    fontSize: "15px",
    color: "#1a202c",
    backgroundColor: "#fff",
  };
  const titleStyle = {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "18px",
    fontWeight: "600",
  };
  const infoStyle = {
    marginBottom: "20px",
    fontFamily: "monospace",
    fontSize: "15px",
    whiteSpace: "pre-line",
  };
  const boldTextStyle = {
    fontWeight: 700,
    fontSize: "12px",
    // Ensure consistent font size for bold text
  };
  const flexBetweenStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    fontFamily: "monospace",
    fontSize: "12px", // Reduced from 15px
    whiteSpace: "nowrap",
    paddingBottom: "20px",
  };

  const columnStyle = {
    width: "49%",
    whiteSpace: "pre-line",
    fontSize: "12px", // Added explicit font size
    lineHeight: "1.3", // Tighter line spacing
  };

  const addressBlockStyle = { marginBottom: "16px" };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    fontSize: "10px", // Reduced from 12px to match the reference
    fontFamily: "monospace",
  };
  const thStyle = {
    border: "1px solid #d1d5db",
    padding: "4px",
    textAlign: "left",
    backgroundColor: "#f3f4f6",
  };
  const thRightStyle = { ...thStyle, textAlign: "right" };
  const tdStyle = {
    border: "1px solid #d1d5db",
    padding: "2px",
    whiteSpace: "pre-line",
  };

  const tdRightStyle = { ...tdStyle, textAlign: "right" };
  const totalAmountStyle = {
    textAlign: "right",
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "24px",
  };
  const buttonStyle = {
    display: "block",
    margin: "20px auto 0",
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px", // space between buttons
    marginTop: "20px",
  };

  const confirm = {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  };

  const cancel = {
    padding: "10px 20px",
    backgroundColor: "#eb370fff",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  };

  // const enhancedTitleStyle = {
  //   color: "#1e40af",
  //   fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
  //   fontSize: "1.5rem",
  //   fontWeight: "700",
  //   letterSpacing: "0.05em",
  //   textAlign: "center",
  //   textShadow: "0 2px 4px rgba(30, 64, 175, 0.1)",
  // };

  const headerContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Changed from flex-start
    marginBottom: "20px",
    position: "relative",
  };

  const logoStyle = {
    height: "60px",
    objectFit: "contain",
    flex: "0 0 auto", // Don't grow or shrink
  };

  const companyTitleStyle = {
    color: "#0f20e0ff",
    fontFamily: '"Times New Roman", Times, serif', // Changed to Times New Roman with fallbacks
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.02em",
    margin: "0",
    textAlign: "center",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
  };

  // Add an invisible spacer to balance the logo
  const spacerStyle = {
    width: "60px", // Same width as logo
    height: "60px",
  };

  const formatAddress = (addressString) => {
    if (!addressString) return "";

    // Split on comma or 2+ consecutive spaces using regex
    const parts = addressString.split(/[,]|\s{2,}/);

    // Clean up each part (remove extra whitespace) and filter out empty parts
    const formattedLines = parts
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    // Join with newlines
    return formattedLines.join("\n");
  };

  return (
    <>
      <div ref={invoiceRef} style={containerStyle}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div style={headerContainerStyle}>
          <img src={logoImg} alt="Company Logo" style={logoStyle} />

          <h1 style={companyTitleStyle}>{invoice.venderName || ""}</h1>
          <div style={spacerStyle}></div>
        </div>
        {/* <h1 style={titleStyle} className="font-bold">REVOLVE</h1> */}

        {/* Two-column information block */}

        <div style={flexBetweenStyle}>
          <div style={columnStyle}>
            <div>
              <span style={boldTextStyle}>Invoice Number: </span>
              {invoice.invoiceId || ""}
            </div>
            <div style={{ ...addressBlockStyle, marginTop: "16px" }}>
              <span style={boldTextStyle}>Bill To: {"\n"}</span>
              {invoice.billT ||
                `FedAxis
              
              Ashburn, VA 20147 `}
            </div>
            <div>
              <span style={boldTextStyle}>Buyer: </span>
              {invoice.buyer || " "}
            </div>
            <div style={{ marginTop: "16px" }}>
              <span style={boldTextStyle}>Purchase Order ID: </span>
              {invoice.po_Number || ""} Release Number{" "}
              {invoice.po_rlse_Number || ""}
            </div>
            <div style={{ marginTop: "16px" }}>
              <span style={boldTextStyle}> PO Start and End Date: </span>
              {invoice.po_Start_End_Date || " "}
            </div>
          </div>

          <div style={columnStyle}>
            <div>
              <span style={boldTextStyle}>Invoice Date: </span>
              {invoice.period || " "}
            </div>
            <div>
              <span style={boldTextStyle}>Billing Currency: </span>

              {invoice.currency || "USD"}
            </div>
            <div style={{ ...addressBlockStyle, marginTop: "16px" }}>
              <span style={boldTextStyle}>Remit To: {"\n"}</span>
              {formatAddress(invoice.billTo) || ``}
            </div>
            <div>
              <span style={boldTextStyle}>Terms: </span>
              {invoice.terms || "PAYNPD"}
            </div>
            <div>
              <span style={boldTextStyle}>Amount Due </span>$
              {invoice.totalAmount?.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>PO LINE</th>
              <th
                style={{
                  border: "1px solid #d1d5db",
                  padding: "4px",
                  textAlign: "left",
                  backgroundColor: "#f3f4f6",
                  borderRight: "none",
                }}
              >
                PLC
              </th>
              <th style={thStyle}>Vendor Employee</th>
              <th style={thRightStyle}>Current Hrs/Qty</th>
              <th style={thRightStyle}>Rate</th>
              <th style={thRightStyle}>Additional Amount</th>
              <th style={thRightStyle}>Current Amount</th>
              <th style={thRightStyle}>Cumulative Hrs/Qty</th>
              <th style={thRightStyle}>Cumulative Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByPoLine).map(([poLine, items]) => (
              <React.Fragment key={poLine}>
                {items.map((item, index) => (
                  <tr key={index}>
                    {/* <td style={tdStyle}>{item.plc || ""}</td>
                      <td style={tdStyle}>
                        {[item.vendor, item.employee].filter(Boolean).join("\n")}
                      </td> */}
                    <td
                      // colSpan={8}
                      style={{
                        border: "1px solid #d1d5db",
                        padding: "4px",
                        fontWeight: 700,
                        fontSize: "12px",
                        paddingBottom: "10px",
                      }}
                    >
                      {poLine}
                    </td>{" "}
                    <td
                      style={{
                        border: "1px solid #d1d5db",
                        padding: "4px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        verticalAlign: "top",
                      }}
                      colSpan={2} // span across the two previous separate columns
                    >
                      <div>{item.plc}</div>
                      <div
                        style={{
                          paddingLeft: "20px",
                          marginTop: "2px",
                        }}
                      >
                        <div>{item.employee}</div>
                        {/* <div>{item.vendor}</div> */}
                      </div>
                    </td>
                    <td style={tdRightStyle}>{item.hours.toFixed(2)}</td>
                    <td style={tdRightStyle}>${item.rate.toFixed(2)}</td>
                    <td style={tdRightStyle}>$0.00</td>
                    <td style={tdRightStyle}>${item.amount.toFixed(2)}</td>
                    <td style={tdRightStyle}>{item.hours.toFixed(2)}</td>
                    <td style={tdRightStyle}>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div style={totalAmountStyle}>
          Total Amount Due: ${invoice.totalAmount.toFixed(2)}
        </div>
      </div>

      <div style={buttonContainerStyle}>
        {/* {isLoading && <div>Loading, please wait...</div>} */}

        <button
          onClick={handleDownloadPdf}
          style={confirm}
          disabled={isLoading}
        >
          {isLoading ? "Downloading..." : "Download Invoice"}
        </button>

        <button onClick={() => setInvoiceModalVisible(false)} style={cancel}>
          Close
        </button>
      </div>
    </>
  );
};

export default InvoiceViewer;
