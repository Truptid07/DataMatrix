function FileSelector({ files, selectedFileId, setSelectedFileId }) {
    return (
      <div className="mb-6">
        <label className="font-medium text-gray-700">Select File:</label>
        <select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
          className="w-full border mt-2 px-3 py-2 rounded"
        >
          <option value="">-- Choose a file --</option>
          {files.map((file) => (
            <option key={file._id} value={file._id}>
              {file.fileName}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export default FileSelector;
  