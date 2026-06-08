import { useState, useEffect } from "react";
import api from "../../api";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    phone_num: "",
    created_date: "",
  });

  const [edit_id, setEdit_id] = useState(null);
  const [showEform, setShowEform] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // REQUIRED VALIDATION
    if (!form.email || !form.role) {
      setError("Email and role are required");
      return;
    }

    if (!edit_id && !form.password) {
      setError("Password is required");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    setError("");

    if (edit_id) {
      await api.put(`/users/${edit_id}`, form);
      setEdit_id(null);
    } else {
      await api.post("/users", form);
    }

    setShowEform(false);
    setForm({
      email: "",
      password: "",
      role: "",
      phone_num: "",
      created_date: "",
    });

    loadUsers();
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-500">
              Manage system users and roles
            </p>
          </div>

          <button
            onClick={() => setShowEform(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add User
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-center">Email</th>
                <th className="p-3 text-center">Role</th>
                <th className="p-3 text-center">Phone</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u.user_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-center">{u.email}</td>
                  <td className="text-gray-600 capitalize text-center">{u.role}</td>
                  <td className="text-center">{u.phone_num || "-"}</td>
                  <td className="text-center">{u.created_date?.split("T")[0]}</td>

                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => {
                        setForm({
                          ...u,
                          password: "",
                          created_date: u.created_date?.split("T")[0] || "",
                        });
                        setEdit_id(u.user_id);
                        setShowEform(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u.user_id)}
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
            <p className="text-center p-4 text-gray-500">No users found</p>
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
              {edit_id ? "Edit User" : "Add User"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}

            {/* EMAIL */}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* PASSWORD */}
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={edit_id ? "Leave blank to keep same" : "Password"}
              type="password"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* ROLE */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="design">Design</option>
              <option value="production">Production</option>
              <option value="sales">Sales</option>
            </select>

            {/* PHONE */}
            <input
              name="phone_num"
              value={form.phone_num}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* DATE */}
            <input
              type="date"
              name="created_date"
              value={form.created_date}
              onChange={handleChange}
              className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEform(false)}
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!form.email || !form.role}
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

export default Users;