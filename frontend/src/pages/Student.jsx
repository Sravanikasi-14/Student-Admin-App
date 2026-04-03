import { useState } from "react";
import axios from "axios";

const Student = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [descriptions, setDescriptions] = useState([]);

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedFiles((prev) => [...prev, ...files]);
    setDescriptions((prev) => [...prev, ...files.map(() => "")]);
  };

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setDescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append("file", selectedFiles[i]);
        formData.append("description", descriptions[i]);

        await axios.post("/api/files/upload", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Uploaded ✅");
      setSelectedFiles([]);
      setDescriptions([]);

    } catch {
      alert("Upload failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Upload Files
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-6"
        />

        <div className="grid grid-cols-3 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded shadow">

              <img
                src={URL.createObjectURL(file)}
                className="h-32 w-full object-cover rounded"
              />

              <input
                placeholder="Description..."
                className="w-full mt-2 p-1 border rounded"
                onChange={(e) => {
                  const newDesc = [...descriptions];
                  newDesc[index] = e.target.value;
                  setDescriptions(newDesc);
                }}
              />

              <button
                onClick={() => handleRemove(index)}
                className="mt-2 w-full bg-red-500 text-white rounded py-1"
              >
                Remove
              </button>

            </div>
          ))}
        </div>

        {selectedFiles.length > 0 && (
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
          >
            Upload All
          </button>
        )}

      </div>
    </div>
  );
};

export default Student;