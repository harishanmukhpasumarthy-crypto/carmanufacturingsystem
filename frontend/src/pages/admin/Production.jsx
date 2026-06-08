import { useState, useEffect } from "react";
import api from "../../api";

const Production = () => {
  const [data, setData] = useState([]);
  const [factories, setFactories] = useState([]);
  const [models, setModels] = useState([]);

  const [form, setForm] = useState({
    factory_id: "",
    model_id: "",
    quantity: "",
    production_date: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
    loadDropdowns();
  }, []);

  // 🔹 load table data
  const loadData = async () => {
    const res = await api.get("/production");
    setData(res.data);
  };

  // 🔹 load dropdown data
  const loadDropdowns = async () => {
    const f = await api.get("/factories");
    const m = await api.get("/cars");

    setFactories(f.data);
    setModels(m.data);
  };

  const handleSubmit = async () => {
    // REQUIRED VALIDATION
    if (!form.factory_id || !form.model_id || !form.quantity || !form.production_date) {
      setError("All fields are required");
      return;
    }

    setError("");

    await api.post("/production", form);

    setShowForm(false);
    setForm({
      factory_id: "",
      model_id: "",
      quantity: "",
      production_date: "",
    });

    loadData();
  };

  const filtered = data.filter((d) =>
    d.model_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Production</h1>
            <p className="text-sm text-gray-500">
              Manage factory production records
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add
          </button>
        </div>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Factory</th>
                <th className="p-3 text-center">Model</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d) => (
                <tr key={d.production_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{d.factory_location}</td>
                  <td className="text-gray-600 text-center ">{d.model_name}</td>
                  <td className="text-blue-600 text-center font-semibold">{d.quantity}</td>
                  <td>{d.production_date?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center p-4 text-gray-500">No data found</p>
          )}
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              Add Record
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <select
              value={form.factory_id}
              onChange={(e) => setForm({ ...form, factory_id: e.target.value })}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Factory</option>
              {factories.map((f) => (
                <option key={f.factory_id} value={f.factory_id}>
                  {f.location}
                </option>
              ))}
            </select>

            <select
              value={form.model_id}
              onChange={(e) => setForm({ ...form, model_id: e.target.value })}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m.model_id} value={m.model_id}>
                  {m.model_name}
                </option>
              ))}
            </select>

            <input
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              type="number"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="date"
              value={form.production_date}
              onChange={(e) =>
                setForm({ ...form, production_date: e.target.value })
              }
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
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={
                  !form.factory_id ||
                  !form.model_id ||
                  !form.quantity ||
                  !form.production_date
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

export default Production;