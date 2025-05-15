import axios from "axios";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SaveToDashboardButton({
  localFile,
  setFileData,
  setSelectedFileId,
  fetchFiles,
  isSaved,
  setIsSaved,
}) {
  const { token } = useSelector((state) => state.auth);

  const handleSaveToDashboard = () => {
    if (!localFile || !localFile.data || !localFile.fileName)
      return alert("No local file to save.");

    const worksheet = XLSX.utils.json_to_sheet(localFile.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const formData = new FormData();
    formData.append("file", blob, localFile.fileName);

    axios
      .post(`${BASE_URL}/api/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async () => {
        alert("✅ File saved to dashboard.");
        await fetchFiles();
        setSelectedFileId("");
        setFileData(null);
        setIsSaved(true);
      })
      .catch(() => alert("❌ Failed to save file."));
  };

  return (
    <button
      onClick={handleSaveToDashboard}
      disabled={isSaved}
      className={`mb-4 px-4 py-2 rounded text-white transition ${
        isSaved ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {isSaved ? "✔️ Saved" : "Save to Dashboard"}
    </button>
  );
}
