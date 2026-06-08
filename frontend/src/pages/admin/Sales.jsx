import { useState, useEffect } from "react";
import api from "../../api";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [cars, setCars] = useState([]);

  const [form, setForm] = useState({
    dealer_id: "",
    model_id: "",
    quantity: "",
    sale_date: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const s = await api.get("/sales");
      const d = await api.get("/dealers");
      const c = await api.get("/cars");

      setSales(s.data);
      setDealers(d.data);
      setCars(c.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "dealer_id" || name === "model_id" || name === "quantity"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async () => {
    // REQUIRED VALIDATION
    if (!form.dealer_id || !form.model_id || !form.quantity || !form.sale_date) {
      setError("All fields are required");
      return;
    }

    if (Number(form.quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    setError("");

    try {
      await api.post("/sales", form);

      setShowForm(false);
      setForm({
        dealer_id: "",
        model_id: "",
        quantity: "",
        sale_date: "",
      });

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = sales.filter(
    (s) =>
      s.dealer_name.toLowerCase().includes(search.toLowerCase()) ||
      s.model_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales Records</h1>
            <p className="text-sm text-gray-500">
              Manage car sales and dealer transactions
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Sale
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search dealer or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Dealer</th>
                <th className="p-3 text-center">Model</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.sale_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{s.dealer_name}</td>
                  <td className="text-gray-600 text-center">{s.model_name}</td>
                  <td className="text-blue-600 font-semibold text-center">{s.quantity}</td>
                  <td className="text-center">{s.sale_date?.split("T")[0]}</td>
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
              Add Sale
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <select
              name="dealer_id"
              value={form.dealer_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Dealer</option>
              {dealers.map((d) => (
                <option key={d.dealer_id} value={d.dealer_id}>
                  {d.dealer_name}
                </option>
              ))}
            </select>

            <select
              name="model_id"
              value={form.model_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Car Model</option>
              {cars.map((c) => (
                <option key={c.model_id} value={c.model_id}>
                  {c.model_name}
                </option>
              ))}
            </select>

            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="date"
              name="sale_date"
              value={form.sale_date}
              onChange={handleChange}
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
                  !form.dealer_id ||
                  !form.model_id ||
                  !form.quantity ||
                  !form.sale_date ||
                  Number(form.quantity) <= 0
                }
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
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

export default Sales;