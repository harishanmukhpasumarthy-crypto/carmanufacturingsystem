import { useState, useEffect } from "react";
import api from "../../api";

const Cars = () => {
  const [form, setForm] = useState({
    model_name: "",
    company: "",
    price: "",
    engine_type: "",
  });

  const [car, setCar] = useState([]);
  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/cars")
      .then((res) => setCar(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setError(""); // clear error while typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCar = async () => {
    // REQUIRED VALIDATION
    if (
      !form.model_name.trim() ||
      !form.company.trim() ||
      !form.price ||
      !form.engine_type.trim()
    ) {
      setError("All fields are required");
      return;
    }

    // PRICE VALIDATION
    if (Number(form.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setError("");

    if (edit_id) {
      await api.put(`/cars/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/cars", form);
    }

    setShowEform(false);

    const res = await api.get("/cars");
    setCar(res.data);

    setForm({
      model_name: "",
      company: "",
      price: "",
      engine_type: "",
    });
  };

  const deleteCar = async (id) => {
    await api.delete(`/cars/${id}`);
    const res = await api.get("/cars");
    setCar(res.data);
  };

  const filteredCars = car.filter(
    (c) =>
      c.model_name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Car Models</h1>
            <p className="text-sm text-gray-500">
              Manage vehicle model specs and pricing
            </p>
          </div>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Model
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by model or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Model</th>
                <th className="p-3 text-center">Company</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Engine</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.model_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">
                    {car.model_name}
                  </td>

                  <td className="text-gray-600 text-center">{car.company}</td>

                  <td className="text-green-600 font-semibold text-center">
                    ₹{car.price}
                  </td>

                  <td className="text-center">
                    <span className="bg-gray-200 px-2 py-1 rounded inline-block">
                      {car.engine_type}
                    </span>
                  </td>

                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => {
                        setForm(car);
                        setEdit_id(car.model_id);
                        setShowEform(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-center"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCar(car.model_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-center"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCars.length === 0 && (
            <p className="text-center p-4 text-gray-500">No data found</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showEform && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          onClick={() => setShowEform(false)} // close on outside click
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2 className="text-lg font-bold mb-4">
              {edit_id ? "Edit Car" : "Add Car"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <input
              name="model_name"
              value={form.model_name}
              onChange={handleChange}
              placeholder="Model Name"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="engine_type"
              value={form.engine_type}
              onChange={handleChange}
              placeholder="Engine Type"
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
                onClick={addCar}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={
                  !form.model_name ||
                  !form.company ||
                  !form.price ||
                  !form.engine_type
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

export default Cars;
