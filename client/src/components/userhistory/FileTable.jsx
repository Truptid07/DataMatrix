import React from "react";
import FileRow from "./FileRow";

const FileTable = ({ files, onView, onDownload, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden animate-fade-in-up">
      <thead>
        <tr className="bg-blue-100 text-blue-800 text-left">
          <th className="p-4">📄 Filename</th>
          <th className="p-4">🗓 Upload Date</th>
          <th className="p-4">🔍 View / ⬇️ Download</th>
          <th className="p-4">❌ Delete</th>
        </tr>
      </thead>
      <tbody>
        {files.length > 0 ? (
          files.map((file, index) => (
            <FileRow
              key={file._id}
              file={file}
              index={index}
              onView={() => onView(file._id)}
              onDownload={() => onDownload(file._id, file.fileName)}
              onDelete={() => onDelete(file._id)}
            />
          ))
        ) : (
          <tr>
            <td colSpan="4" className="p-4 text-center text-gray-500">
              No files uploaded yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default FileTable;
