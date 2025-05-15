function FileInput({ onChange }) {
  return (
    <div className="mb-4 flex justify-center">
      <input
        id="upload-input"
        type="file"
        accept=".xls,.xlsx"
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor="upload-input"
        className="inline-block px-4 py-2 bg-[#007ea7] text-white rounded-full cursor-pointer hover:bg-[#009dc4] text-sm"
      >
        Choose File
      </label>
    </div>
  );
}

export default FileInput;
