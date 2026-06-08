import { useState, useEffect } from "react";
import api from "../../api";

const Factories = () => {
  const [factories, setFactories] = useState([]);
  const [form, setForm] = useState({ location: "", capacity: "" });

  const [edit_id, setEdit_id] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    loadFactories();
  }, []);

  const loadFactories = async () => {
    const res = await api.get("/factories");
    setFactories(res.data);
  };

  const handleSubmit = async () => {
    // REQUIRED VALIDATION
    if (!form.location || !form.capacity) {
      setError("All fields are required");
      return;
    }

    if (Number(form.capacity) <= 0) {
      setError("Capacity must be greater than 0");
      return;
    }

    setError("");

    if (edit_id) {
      await api.put(`/factories/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/factories", form);
    }

    setShowForm(false);
    setForm({ location: "", capacity: "" });
    loadFactories();
  };

  const handleDelete = async (id) => {
    await api.delete(`/factories/${id}`);
    loadFactories();
  };

  const filtered = factories.filter((f) =>
    f.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Factories</h1>
            <p className="text-sm text-gray-500">
              Manage factory locations and capacities
            </p>
          </div>

       
          {role === "admin" && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              + Add Factory
            </button>
          )}
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search by location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Location</th>
                <th className="p-3 text-center">Capacity(Units Per Day)</th>

              
                {role === "admin" && (
                  <th className="p-3 text-center">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filtered.map((f) => (
                <tr key={f.factory_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{f.location}</td>
                  <td className= " text-center text-blue-600 font-semibold">{f.capacity}</td>

                  {/* ✅ ONLY ADMIN */}
                  {role === "admin" && (
                    <td className="flex justify-center gap-2 p-2">
                      <button
                        onClick={() => {
                          setForm(f);
                          setEdit_id(f.factory_id);
                          setShowForm(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(f.factory_id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center p-4 text-gray-500">No data found</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {role === "admin" &&
        showForm && ( 
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
            onClick={() => setShowForm(false)}
          >
            <div
              className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4">
                {edit_id ? "Edit Factory" : "Add Factory"}
              </h2>

              {error && (
                <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
              )}

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => {
                  setError("");
                  setForm({ ...form, location: e.target.value });
                }}
                className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
              />

              <input
                placeholder="Capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => {
                  setError("");
                  setForm({ ...form, capacity: e.target.value });
                }}
                className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={
                    !form.location ||
                    !form.capacity ||
                    Number(form.capacity) <= 0
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {edit_id ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Factories;
