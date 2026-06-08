import { useState, useEffect } from "react";
import api from "../../api";

const AssignParts = () => {
  const [form, setForm] = useState({
    model_id: "",
    part_id: "",
    quantity_required: "",
  });

  const [assign, setAssign] = useState([]);
  const [cars, setCars] = useState([]);
  const [parts, setParts] = useState([]);
  const [showAssiForm, setshowAssiForm] = useState(false);
  const [error, setError] = useState("");
  const [edit_id, setEdit_id] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const a = await api.get("/assign");
    const c = await api.get("/cars");
    const p = await api.get("/parts");

    setAssign(a.data);
    setCars(c.data);
    setParts(p.data);
  };

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addAssign = async () => {
    // REQUIRED VALIDATION
    if (!form.model_id || !form.part_id || !form.quantity_required) {
      setError("All fields are required");
      return;
    }

    if (Number(form.quantity_required) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    try {
      const selectedPart = parts.find((p) => p.part_id == form.part_id);

      if (
        !selectedPart ||
        Number(form.quantity_required) > Number(selectedPart.quantity)
      ) {
        alert("Not enough stock available!");
        return;
      }

      if (edit_id) {
        await api.put(`/assign/${edit_id}`, form);
        setEdit_id(null);
      } else {
        await api.post("/assign", form);
      }

      fetchData();
      setshowAssiForm(false);

      setForm({
        model_id: "",
        part_id: "",
        quantity_required: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAssign = async (id) => {
    await api.delete(`/assign/${id}`);
    fetchData();
  };

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Assign Parts</h1>
            <p className="text-sm text-gray-500">
              Assign parts to car models with required quantity
            </p>
          </div>

          <button
            onClick={() => setshowAssiForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Assign Part
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Car Model</th>
                <th className="p-3 text-center">Part</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {assign.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{a.model_name}</td>
                  <td className="text-gray-600 text-center">{a.part_name}</td>
                  <td className="text-blue-600 text-center font-semibold">
                    {a.quantity_required}
                  </td>

                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => {
                        setForm({
                          model_id: a.model_id,
                          part_id: a.part_id,
                          quantity_required: a.quantity_required,
                        });
                        setEdit_id(a.id);
                        setshowAssiForm(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteAssign(a.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {assign.length === 0 && (
            <p className="text-center p-4 text-gray-500">No data found</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showAssiForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          onClick={() => setshowAssiForm(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {edit_id ? "Edit Assignment" : "Assign Part"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <select
              name="model_id"
              required
              value={form.model_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Car</option>
              {cars.map((c) => (
                <option key={c.model_id} value={c.model_id}>
                  {c.model_name}
                </option>
              ))}
            </select>

            <select
              name="part_id"
              required
              value={form.part_id}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Part</option>
              {parts.map((p) => (
                <option key={p.part_id} value={p.part_id}>
                  {p.part_name}
                </option>
              ))}
            </select>

            <input
              name="quantity_required"
              type="number"
              required
              min="1"
              placeholder="Quantity Required"
              value={form.quantity_required}
              onChange={handleChange}
              className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setshowAssiForm(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addAssign}
                disabled={
                  !form.model_id ||
                  !form.part_id ||
                  !form.quantity_required ||
                  Number(form.quantity_required) <= 0
                }
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {edit_id ? "Update" : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignParts;