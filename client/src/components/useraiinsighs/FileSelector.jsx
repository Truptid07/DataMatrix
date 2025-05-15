const FileSelector = ({ files, localFile, selectedFileId, setSelectedFileId }) => (
  <div className="mb-4 animate-fade-in-up">
    <label className="block text-blue-800 mb-2">Select File</label>
    <select
      className="w-full p-2 rounded border border-blue-300 bg-white"
      value={selectedFileId}
      onChange={(e) => setSelectedFileId(e.target.value)}
    >
      <option value="">-- Choose File --</option>
      {localFile?.fileName && <option value="local">(Local) {localFile.fileName}</option>}
      {files.map((f) => (
        <option key={f._id} value={f._id}>
          {f.fileName}
        </option>
      ))}
    </select>
  </div>
);

export default FileSelector;
