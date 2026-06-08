import { useState, useEffect } from "react";
import api from "../../api";

const Parts = () => {
  const [form, setForm] = useState({
    part_name: "",
    category: "",
    cost: "",
    quantity: "",
  });

  const [part, setPart] = useState([]);
  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/parts")
      .then((res) => setPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setError(""); // clear error
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPart = async () => {
    // REQUIRED VALIDATION
    if (
      !form.part_name.trim() ||
      !form.category.trim() ||
      !form.cost ||
      !form.quantity
    ) {
      setError("All fields are required");
      return;
    }

    // COST + QUANTITY VALIDATION
    if (Number(form.cost) <= 0 || Number(form.quantity) < 0) {
      setError("Cost must be > 0 and quantity ≥ 0");
      return;
    }

    if (edit_id) {
      await api.put(`/parts/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/parts", form);
    }

    setShowEform(false);

    const res = await api.get("/parts");
    setPart(res.data);

    setForm({
      part_name: "",
      category: "",
      cost: "",
      quantity: "",
    });
  };

  const deletePart = async (id) => {
    await api.delete(`/parts/${id}`);
    const res = await api.get("/parts");
    setPart(res.data);
  };

  const filteredParts = part.filter(
    (p) =>
      p.part_name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Parts</h1>
            <p className="text-sm text-gray-500">
              Manage parts inventory and stock levels
            </p>
          </div>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Part
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by part or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Part</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Cost</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParts.map((p) => (
                <tr key={p.part_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{p.part_name}</td>
                  <td className="text-gray-600 text-center">{p.category}</td>
                  <td className="text-green-600 text-center font-semibold">
                    ₹{p.cost}
                  </td>
                  <td className="text-blue-600 font-semibold text-center">
                    {p.quantity}
                  </td>

                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => {
                        setForm(p);
                        setEdit_id(p.part_id);
                        setShowEform(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePart(p.part_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredParts.length === 0 && (
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
              {edit_id ? "Edit Part" : "Add Part"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <input
              name="part_name"
              placeholder="Part Name"
              value={form.part_name}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="cost"
              placeholder="Cost (per part)"
              value={form.cost}
              onChange={handleChange}
              type="number"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              type="number"
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
                onClick={addPart}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={
                  !form.part_name ||
                  !form.category ||
                  !form.cost ||
                  !form.quantity
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Parts;