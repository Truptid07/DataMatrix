import { useLocalFile } from "../../context/LocalFileContext";

function FileSelector({ files, selectedFileId, setSelectedFileId, isLocal }) {
  const { localFile } = useLocalFile();

  return (
    <div className="mb-6">
      <label className="font-medium text-gray-700">Select File:</label>
      <select
        value={selectedFileId || (isLocal ? "local" : "")}
        onChange={(e) => setSelectedFileId(e.target.value)}
        className="w-full border mt-2 px-3 py-2 rounded"
      >
        <option value="">-- Choose a file --</option>

        {localFile && (
          <option value="local">
            (Local) {localFile.fileName}
          </option>
        )}

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
