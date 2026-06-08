import { useState, useEffect } from "react";
import api from "../../api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [factories, setFactories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    role: "",
    factory_id: "",
  });

  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    loadEmployees();
    loadFactories();
  }, []);

  const loadEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const loadFactories = async () => {
    const res = await api.get("/factories");
    setFactories(res.data);
  };

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "factory_id" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    // REQUIRED VALIDATION
    if (!form.name || !form.role || !form.factory_id) {
      setError("All fields are required");
      return;
    }

    setError("");

    if (edit_id) {
      await api.put(`/employees/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/employees", form);
    }

    setShowEform(false);
    setForm({ name: "", role: "", factory_id: "" });
    loadEmployees();
  };

  const handleDelete = async (id) => {
    await api.delete(`/employees/${id}`);
    loadEmployees();
  };

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
            <p className="text-sm text-gray-500">
              Manage employees and assign them to factories
            </p>
          </div>

          {role === "admin" && (
            <button
              onClick={() => setShowEform(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              + Add Employee
            </button>
          )}
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search employee..."
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
                <th className="p-3 text-center">Role</th>
                <th className="p-3 text-center">Factory</th>

                {role === "admin" && (
                  <th className="p-3 text-center">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filtered.map((e) => (
                <tr key={e.employee_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{e.name}</td>
                  <td className="text-gray-600 text-center">{e.role}</td>
                  <td className="text-center">{e.factory_location}</td>

                  {role === "admin" && (
                    <td className="flex justify-center gap-2 p-2">
                      <button
                        onClick={() => {
                          setForm({
                            name: e.name,
                            role: e.role,
                            factory_id: e.factory_id,
                          });
                          setEdit_id(e.employee_id);
                          setShowEform(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(e.employee_id)}
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
      {role === "admin" && showEform && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          onClick={() => setShowEform(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {edit_id ? "Edit Employee" : "Add Employee"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Role"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400"
            />

            <select
              name="factory_id"
              value={form.factory_id}
              onChange={handleChange}
              className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Factory</option>
              {factories.map((f) => (
                <option key={f.factory_id} value={f.factory_id}>
                  {f.location}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEform(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.role || !form.factory_id}
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

export default Employees;
