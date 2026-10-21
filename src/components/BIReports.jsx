// import React, { useEffect, useState } from "react";
// import { PowerBIEmbed } from "powerbi-client-react";
// import { models } from "powerbi-client";
// import { backendUrl } from "./config";

// const BIReports = ({ datasetName }) => {
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(false)
//   // const backendUrl = "https://localhost:58652";

//   // const datasetName = import.meta.env.VITE_DATASET_NAME;
//   useEffect(() => {
//     const loadReport = async () => {
//       // const workspaceId = "YOUR_WORKSPACE_ID";
//       // console.log('go')
//       const response = await fetch(
//         `${backendUrl}/api/PowerBI/embed-config?datasetName=${encodeURIComponent(datasetName)}`,
//       );

//       const data = await response.json();

//       console.log(data);
//       if (data) {
//         setReport(data);
//       }
//     };

//     loadReport();
//   }, [datasetName]);

//   return (
//     <div className="h-screen">
//       <PowerBIEmbed
//         embedConfig={{
//           type: "report",
//           id: report?.reportId,
//           embedUrl: report?.embedUrl,

//           // THIS MUST BE AN EMBED TOKEN
//           accessToken: report?.embedToken,

//           tokenType: 1,
//         }}
//         cssClassName="h-[90%] w-full"
//       />
//     </div>
//   );
// };

// export default BIReports;

import React, { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { backendUrl } from "./config";

const BIReports = ({ datasetName }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true); // 1. Start as true

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true); // Reset loading when datasetName changes
      try {
        const response = await fetch(
          `${backendUrl}/api/PowerBI/embed-config?datasetName=${encodeURIComponent(datasetName)}`,
        );

        const data = await response.json();

        if (data) {
          setReport(data);
        }
      } catch (error) {
        console.error("Error fetching PowerBI config:", error);
        setLoading(false);
      }
    };

    loadReport();
  }, [datasetName]);

  // 2. Custom Tailwind PowerBI Loading Spinner component
  const LoadingOverlay = () => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Glow - using your brand color with 20% opacity */}
        <div className="absolute h-20 w-20 animate-ping rounded-full bg-[#17414D]/20"></div>

        {/* Custom themed Spinner - border-t uses your brand color */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#17414D]"></div>

        {/* Center Logo Placeholder - styled with your brand color */}
        <div className="absolute text-xl font-bold text-[#17414D]">BI</div>
      </div>

      {/* Loading Text - updated text color */}
      <p className="mt-4 text-sm font-semibold text-[#17414D] animate-pulse">
        Loading Power BI Report...
      </p>
    </div>
  );

  return (
    <div className="relative h-screen">
      {" "}
      {/* Made relative to position the loader absolutely */}
      {/* 3. Show loading overlay if API is fetching OR if report object isn't ready */}
      {(loading || !report) && <LoadingOverlay />}
      <PowerBIEmbed
        embedConfig={{
          type: "report",
          id: report?.reportId,
          embedUrl: report?.embedUrl,
          accessToken: report?.embedToken,
          tokenType: 1,
          settings: {
            panes: {
              filters: { expanded: false, visible: false },
            },
          },
        }}
        cssClassName="h-[90%] w-full"
        // 4. PowerBI event hooks to hide loader once iframe is completely rendered
        eventHandlers={
          new Map([
            [
              "loaded",
              function () {
                console.log("Report loaded");
              },
            ],
            [
              "rendered",
              function () {
                console.log("Report rendered fully");
                setLoading(false); // Hide spinner when visual is ready
              },
            ],
            [
              "error",
              function (event) {
                console.error("Embedding Error:", event.detail);
                setLoading(false);
              },
            ],
          ])
        }
      />
    </div>
  );
};

export default BIReports;
