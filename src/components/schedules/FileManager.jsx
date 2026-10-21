import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Download, Upload, FileSpreadsheet, Loader2, X } from "lucide-react";
import { backendUrl } from "../config";

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingYear, setDownloadingYear] = useState(null);

  // Upload Modal State
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadYear, setUploadYear] = useState(currentYear.toString());
  const [uploading, setUploading] = useState(false);

  // Generate Year Options: (Current Year - 5) to (Current Year + 2)
  const yearOptions = useMemo(() => {
    const years = [];
    const startYear = currentYear - 5;
    const endYear = currentYear + 2;
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/Files/all`);
      setFiles(response.data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download Handler with forced custom name: ICE_DATA_Year_<year>
  const handleDownload = async (year, originalStoragePath = "") => {
    setDownloadingYear(year);
    try {
      const response = await axios.get(
        `${backendUrl}/api/Files/download/${year}`,
        { responseType: "blob" },
      );

      let extension = "xlsx";
      if (originalStoragePath) {
        const parts = originalStoragePath.split(".");
        if (parts.length > 1) extension = parts.pop();
      }

      const customFileName = `ICE_REPORT_${year}.${extension}`;

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", customFileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    } finally {
      setDownloadingYear(null);
    }
  };

  // Upload Handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadYear) {
      alert("Please select a file and enter a year.");
      return;
    }

    setUploading(true);

    // Extract file extension and construct target filename
    const fileExtension = selectedFile.name.split(".").pop();
    const newFileName = `ICE_Report_${uploadYear}.${fileExtension}`;

    // Create a renamed File instance
    const renamedFile = new File([selectedFile], newFileName, {
      type: selectedFile.type,
    });

    const formData = new FormData();
    formData.append("file", renamedFile);

    try {
      await axios.post(
        `${backendUrl}/api/Files/upload/${uploadYear}`,
        formData,
        {
          params: { relativeFolderPath: "Uploads" },
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setIsModalOpen(false);
      setSelectedFile(null);
      await fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const getFileName = (path) => (path ? path.split("/").pop() : "");

  return (
    <div className="p-3 w-full space-y-3 bg-gray-50/50 min-h-screen font-sans text-xs">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-md border border-gray-200 shadow-2xs w-full">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-bold text-gray-800 tracking-wide">
            ICE Report History
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-md border border-gray-200 shadow-2xs overflow-hidden w-full">
        {loading ? (
          <div className="py-8 flex justify-center items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Loading...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No files available.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="px-3 py-2 w-20">Year</th>
                  <th className="px-3 py-2">File Name</th>
                  <th className="px-3 py-2">Storage Path</th>
                  <th className="px-3 py-2 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {files.map((file, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-3 py-2 font-bold text-gray-900">
                      {file.year}
                    </td>
                    <td className="px-3 py-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {getFileName(file.storagePath)}
                      </a>
                    </td>
                    <td className="px-3 py-2 text-gray-500 font-mono text-[11px]">
                      {file.storagePath}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() =>
                          handleDownload(file.year, file.storagePath)
                        }
                        disabled={downloadingYear === file.year}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium text-xs border border-blue-200 disabled:opacity-50 whitespace-nowrap"
                      >
                        {downloadingYear === file.year ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        Download Excel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compact Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-2">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4 border border-gray-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Upload className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-gray-900 uppercase">
                Upload Ledger File
              </h3>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={uploadYear}
                  onChange={(e) => setUploadYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                >
                  {yearOptions.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                  Select File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept=".xlsx, .xls"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-gray-300 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium disabled:opacity-50"
                >
                  {uploading && <Loader2 className="w-3 h-3 animate-spin" />}
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
