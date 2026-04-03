import { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    const res = await axios.get("/api/files", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFiles(res.data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/files/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFiles();
  };

  const handleUpdate = async () => {
    await axios.put(
      `/api/files/${editingFile._id}`,
      { description: newDescription },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingFile(null);
    fetchFiles();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </h1>

      <input
        placeholder="Search..."
        className="w-full mb-6 p-2 border rounded"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-4">
        {files
          .filter((f) =>
            f.fileName.toLowerCase().includes(search.toLowerCase())
          )
          .map((file) => (
            <div key={file._id} className="bg-white p-4 rounded shadow">

              <img
                src={`https://drive.google.com/thumbnail?id=${file.fileId}`}
                className="h-40 w-full object-cover rounded"
              />

              <h2>{file.fileName}</h2>
              <p>{file.description}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    window.open(
                      `https://drive.google.com/file/d/${file.fileId}/view`
                    )
                  }
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  View
                </button>

                <button
                  onClick={() => {
                    setEditingFile(file);
                    setNewDescription(file.description);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(file._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
      </div>

      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-2 border"
            />
            <button
              onClick={handleUpdate}
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;