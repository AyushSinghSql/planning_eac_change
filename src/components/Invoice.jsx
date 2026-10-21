import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImg from "../assets/image.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { backendUrl } from "./config";

const InvoiceViewer = ({ data, setInvoiceModalVisible, onInvoiceSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [invoicesCreated, setInvoicesCreated] = useState(new Set());
  const invoiceRefs = useRef([]);

  // Store original ungrouped data for API calls
  const originalInvoiceData = useRef(data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No invoice data available</div>;
  }

  const handleConfirmInvoices = async () => {
    setIsLoading(true);

    try {
      const successfulInvoices = new Set();

      // Process each invoice separately with API calls
      for (let i = 0; i < originalInvoiceData.current.length; i++) {
        const invoice = originalInvoiceData.current[i];

        try {
          // Calculate total from ORIGINAL ungrouped line items
          const totalAmount = invoice.originalLineItems
            ? invoice.originalLineItems.reduce(
                (acc, line) => acc + line.amount,
                0,
              )
            : invoice.lineItems.reduce((acc, line) => acc + line.amount, 0);

          const invoicePayload = {
            invoiceNumber: invoice.invoiceId,
            invoiceDate: new Date(invoice.period).toISOString(),
            invoiceAmount: invoice.totalAmount,
            venderName: invoice.venderName,
            createdBy: "Test",
            updatedBy: "Test",
            billTo: invoice.billTo,
            remitTo: invoice.remitTo,
            po_Number: invoice.po_Number,
            po_rlse_Number: invoice.po_rlse_Number,
            po_Start_End_Date: invoice.po_Start_End_Date,
            buyer: invoice.buyer,
            terms: invoice.terms,
            currency: invoice.currency,
            // Use ORIGINAL ungrouped line items for API call
            invoiceTimesheetLines: (
              invoice.originalLineItems || invoice.lineItems
            ).map((line) => ({
              poLineNumber: line.poLine,
              timesheetLineNo: line.line_No,
              mappedHours: line.hours,
              mappedAmount: line.amount,
              rate: line.rate,
              employee: line.employee,
              vendor: line.vendor,
              plc: line.plc,
              hours_Date: line.hours_Date,
              createdBy: "Test",
              updatedBy: "Test",
            })),
          };

          console.log(
            `Creating invoice ${i + 1}/${originalInvoiceData.current.length}:`,
            invoicePayload,
          );

          const response = await fetch(`${backendUrl}/api/Invoices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoicePayload),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to create invoice ${invoice.invoiceId}: ${response.status}`,
            );
          }

          const responseData = await response.json();
          console.log(`Invoice ${i + 1} created successfully:`, responseData);

          successfulInvoices.add(i);
          toast.success(
            `Invoice ${i + 1} (${invoice.invoiceId}) created successfully`,
          );

          // Small delay between API calls to prevent overwhelming the server
          if (i < originalInvoiceData.current.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Error creating invoice ${i + 1}:`, error);
          toast.error(`Failed to create invoice ${i + 1}: ${error.message}`);
        }
      }

      setInvoicesCreated(successfulInvoices);

      if (successfulInvoices.size === originalInvoiceData.current.length) {
        toast.success(
          `All ${originalInvoiceData.current.length} invoices created successfully! You can now download them individually.`,
        );
      } else if (successfulInvoices.size > 0) {
        toast.warning(
          `${successfulInvoices.size}/${originalInvoiceData.current.length} invoices created successfully. Some failed - check individual statuses.`,
        );
      } else {
        toast.error("Failed to create any invoices. Please try again.");
      }

      setInvoiceModalVisible(false);
      // Call success callback
      if (onInvoiceSuccess && successfulInvoices.size > 0) {
        setTimeout(() => {
          onInvoiceSuccess(
            originalInvoiceData.current.filter((_, index) =>
              successfulInvoices.has(index),
            ),
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error in invoice confirmation process:", error);
      toast.error("Error processing invoices");
    } finally {
      setIsLoading(false);
    }
  };

  // Download individual invoice as separate PDF
  const handleDownloadSinglePdf = async (invoice, index) => {
    if (!invoicesCreated.has(index)) {
      toast.warning(
        `Please create Invoice ${
          index + 1
        } first by clicking "Confirm All Invoices"`,
      );
      return;
    }

    setDownloadingIndex(index);

    if (!invoiceRefs.current[index]) {
      toast.error("Invoice content not found");
      setDownloadingIndex(null);
      return;
    }

    try {
      const element = invoiceRefs.current[index];
      await generatePdfForElement(
        element,
        `invoice_${invoice.invoiceId || `${index + 1}`}.pdf`,
      );
      toast.success(
        `Invoice ${invoice.invoiceId || index + 1} downloaded successfully`,
      );
    } catch (error) {
      console.error(`Error downloading invoice ${index + 1}:`, error);
      toast.error(`Error downloading invoice ${index + 1}`);
    } finally {
      setDownloadingIndex(null);
    }
  };

  // Helper function to generate PDF from DOM element
  const generatePdfForElement = async (element, filename) => {
    // Store original styles
    const originalStyles = {
      height: element.style.height,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      position: element.style.position,
      transform: element.style.transform,
      width: element.style.width,
      minHeight: element.style.minHeight,
    };

    // Prepare element for capture
    element.style.height = "auto";
    element.style.maxHeight = "none";
    element.style.minHeight = "auto";
    element.style.overflow = "visible";
    element.style.position = "relative";
    element.style.transform = "none";
    element.style.width = "800px";

    // Prepare all child elements
    const allChildren = element.querySelectorAll("*");
    const childrenOriginalStyles = [];

    allChildren.forEach((child, index) => {
      childrenOriginalStyles[index] = {
        height: child.style.height,
        maxHeight: child.style.maxHeight,
        overflow: child.style.overflow,
        minHeight: child.style.minHeight,
        width: child.style.width,
        maxWidth: child.style.maxWidth,
      };

      child.style.height = "auto";
      child.style.maxHeight = "none";
      child.style.minHeight = "auto";
      child.style.overflow = "visible";
    });

    // Control logo sizes
    const logoElements = element.querySelectorAll(
      'img, .logo, [class*="logo"], [id*="logo"]',
    );
    logoElements.forEach((logo) => {
      if (logo.tagName === "IMG") {
        logo.style.width = "120px";
        logo.style.height = "auto";
        logo.style.maxWidth = "120px";
        logo.style.maxHeight = "60px";
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    element.offsetHeight; // Trigger reflow

    const actualHeight = Math.max(
      element.scrollHeight,
      element.offsetHeight,
      element.clientHeight,
      element.getBoundingClientRect().height,
    );
    const actualWidth = Math.max(element.scrollWidth, element.offsetWidth, 800);

    // Capture canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: actualWidth,
      height: actualHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      removeContainer: false,
      imageTimeout: 0,
      onclone: (clonedDoc, clonedElement) => {
        clonedElement.style.height = "auto";
        clonedElement.style.maxHeight = "none";
        clonedElement.style.minHeight = "auto";
        clonedElement.style.overflow = "visible";
        clonedElement.style.position = "relative";
        clonedElement.style.width = actualWidth + "px";

        // Control cloned logos
        const clonedLogos = clonedDoc.querySelectorAll(
          'img, .logo, [class*="logo"], [id*="logo"]',
        );
        clonedLogos.forEach((logo) => {
          if (logo.tagName === "IMG") {
            logo.style.width = "120px";
            logo.style.height = "auto";
            logo.style.maxWidth = "120px";
            logo.style.maxHeight = "60px";
          }
        });

        // Fix tables and cells
        const tables = clonedDoc.querySelectorAll("table");
        tables.forEach((table) => {
          table.style.tableLayout = "auto";
          table.style.width = "100%";
          table.style.borderCollapse = "collapse";
        });

        const cells = clonedDoc.querySelectorAll("td, th");
        cells.forEach((cell) => {
          cell.style.wordWrap = "break-word";
          cell.style.whiteSpace = "normal";
          cell.style.overflow = "visible";
          cell.style.padding = "4px";
          cell.style.border = "1px solid #ccc";
          cell.style.verticalAlign = "top";
        });
      },
    });

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const usableWidth = pdfWidth - 2 * margin;
    const usableHeight = pdfHeight - 2 * margin;

    const imgData = canvas.toDataURL("image/png", 1.0);
    const imgProps = pdf.getImageProperties(imgData);

    const imgWidthMM = (imgProps.width * 25.4) / (96 * 2);
    const imgHeightMM = (imgProps.height * 25.4) / (96 * 2);

    const scale = usableWidth / imgWidthMM;
    const scaledWidth = usableWidth;
    const scaledHeight = imgHeightMM * scale;

    // Handle multi-page PDF if needed
    let yOffset = 0;
    let pageCount = 0;

    while (yOffset < scaledHeight) {
      if (pageCount > 0) {
        pdf.addPage();
      }

      const remainingHeight = scaledHeight - yOffset;
      const heightForThisPage = Math.min(usableHeight, remainingHeight);

      const sourceY = ((yOffset / scale) * (96 * 2)) / 25.4;
      const sourceHeight = ((heightForThisPage / scale) * (96 * 2)) / 25.4;

      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      pageCanvas.width = imgProps.width;
      pageCanvas.height = sourceHeight;

      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        imgProps.width,
        sourceHeight,
        0,
        0,
        imgProps.width,
        sourceHeight,
      );

      const pageImgData = pageCanvas.toDataURL("image/png", 1.0);
      pdf.addImage(
        pageImgData,
        "PNG",
        margin,
        margin,
        scaledWidth,
        heightForThisPage,
      );

      yOffset += heightForThisPage;
      pageCount++;

      if (pageCount > 50) {
        console.warn("Too many pages, stopping");
        break;
      }
    }

    // Restore original styles
    Object.assign(element.style, originalStyles);
    allChildren.forEach((child, index) => {
      if (childrenOriginalStyles[index]) {
        Object.assign(child.style, childrenOriginalStyles[index]);
      }
    });

    // Save the PDF
    pdf.save("invoice.pdf");
  };

  // Render individual invoice component
  const renderSingleInvoice = (invoice, index) => {
    const groupedByPoLine = invoice.lineItems.reduce((groups, item) => {
      const key = item.poLine || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});

    const isCreated = invoicesCreated.has(index);

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

    const invoiceInfoStyle = {
      textAlign: "right",
      fontSize: "12px",
      color: "#000", // Changed from #666 to match the image
      fontFamily: "monospace",
      position: "absolute", // Position it absolutely
      top: "0",
      right: "0",
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
      <div key={`invoice-${index}`} style={containerStyle}>
        {/* <div style={statusBadgeStyle}>{isCreated ? "CREATED" : "PENDING"}</div> */}

        <div ref={(el) => (invoiceRefs.current[index] = el)}>
          {/* Invoice Header */}
          <div style={headerContainerStyle}>
            <img src={logoImg} alt="Company Logo" style={logoStyle} />
            <div style={invoiceInfoStyle}>
              <div>
                <strong>
                  Invoice #{index + 1} of {data.length}
                </strong>
              </div>
              <div>ID: {invoice.invoiceId || "N/A"}</div>
            </div>
            <h1 style={companyTitleStyle}>{invoice.venderName || ""}</h1>
            <div style={spacerStyle}></div>
          </div>

          {/* <h1 style={titleStyle}>SUMARIA SYSTEMS, LLC</h1> */}

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
                  `Revolve Fintech
                
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

          {/* Invoice Table */}
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
                  {/* <tr>
                    <td
                      colSpan={8}
                      style={{
                        fontWeight: 700,
                        fontSize: "12px",
                        paddingBottom: "10px",
                      }}
                    >
                      PO LINE {poLine}
                    </td>{" "}
                  </tr> */}
                  {items.map((item, index) => (
                    <tr key={index}>
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
                      {/* <td style={tdStyle}>{item.plc || ""}</td>
                                <td style={tdStyle}>
                                  {[item.vendor, item.employee].filter(Boolean).join("\n")}
                                </td> */}
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
            Total Amount Due: ${invoice.totalAmount?.toFixed(2) || "0.00"}
          </div>
        </div>

        {/* Individual Download Button */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "15px",
          }}
        >
          {/* <button
            onClick={() => handleDownloadSinglePdf(invoice, index)}
            disabled={downloadingIndex === index || !isCreated}
            style={{
              padding: "8px 16px",
              backgroundColor:
                downloadingIndex === index
                  ? "#9ca3af"
                  : !isCreated
                  ? "#d1d5db"
                  : "#10b981",
              color: !isCreated ? "#6b7280" : "#fff",
              fontWeight: "500",
              borderRadius: "4px",
              cursor:
                downloadingIndex === index
                  ? "not-allowed"
                  : !isCreated
                  ? "not-allowed"
                  : "pointer",
              border: "none",
              fontSize: "14px",
            }}
          >
            {downloadingIndex === index
              ? "Downloading..."
              : !isCreated
              ? "Create Invoice First"
              : `Download Invoice #${index + 1}`}
          </button> */}
        </div>
      </div>
    );
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
    position: "sticky",
    bottom: "0",
    backgroundColor: "white",
    padding: "20px 0",
    borderTop: "2px solid #e5e7eb",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontWeight: "500",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    minWidth: "140px",
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div
        className="overflow-y-auto p-4 scrollbar-thin font-inter"
        style={{ maxHeight: "70vh" }}
      >
        {/* Header */}
        <div className="text-center font-bold text-base mb-4 text-gray-800 bg-[#e5f3fb] border border-blue-100 p-3 rounded-lg shadow-sm">
          <div>
            Invoice Preview - {data.length} Invoice
            {data.length > 1 ? "s" : ""} Found
          </div>
        </div>

        {/* Render each invoice */}
        {data.map((invoice, index) => renderSingleInvoice(invoice, index))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 bg-white font-inter">
        <button
          onClick={() => setInvoiceModalVisible(false)}
          className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Close
        </button>

        <button
          onClick={handleConfirmInvoices}
          disabled={isLoading}
          className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Invoices..." : `Confirm`}
        </button>
      </div>
    </>
  );
};

export default InvoiceViewer;
