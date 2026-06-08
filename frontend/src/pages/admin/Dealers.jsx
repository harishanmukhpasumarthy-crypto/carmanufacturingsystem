import { useState, useEffect } from "react";
import api from "../../api";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [form, setForm] = useState({
    dealer_name: "",
    city: "",
    contact: "",
  });

  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    const res = await api.get("/dealers");
    setDealers(res.data);
  };

  const handleSubmit = async () => {
    // REQUIRED VALIDATION
    if (!form.dealer_name || !form.city || !form.contact) {
      setError("All fields are required");
      return;
    }

    setError("");

    if (edit_id) {
      await api.put(`/dealers/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/dealers", form);
    }

    setShowEform(false);
    setForm({ dealer_name: "", city: "", contact: "" });
    loadDealers();
  };

  const handleDelete = async (id) => {
    await api.delete(`/dealers/${id}`);
    loadDealers();
  };

  const filtered = dealers.filter((d) =>
    d.dealer_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dealers</h1>
            <p className="text-sm text-gray-500">
              Manage dealer network and distribution
            </p>
          </div>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Dealer
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search dealer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Name</th>
                <th className="p-3 text-center">City</th>
                <th className="p-3 text-center">Contact</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d) => (
                <tr key={d.dealer_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{d.dealer_name}</td>
                  <td className="text-gray-600 text-center">{d.city}</td>
                  <td className="text-center">{d.contact}</td>

                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => {
                        setForm(d);
                        setEdit_id(d.dealer_id);
                        setShowEform(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(d.dealer_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
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
      {showEform && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          onClick={() => setShowEform(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {edit_id ? "Edit Dealer" : "Add Dealer"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <input
              placeholder="Dealer Name"
              value={form.dealer_name}
              onChange={(e) => {
                setError("");
                setForm({ ...form, dealer_name: e.target.value });
              }}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => {
                setError("");
                setForm({ ...form, city: e.target.value });
              }}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => {
                setError("");
                setForm({ ...form, contact: e.target.value });
              }}
              className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEform(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!form.dealer_name || !form.city || !form.contact}
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

export default Dealers;
