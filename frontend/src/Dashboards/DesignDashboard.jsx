import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FaCar, FaCogs, FaTools, FaTruck, FaBox } from "react-icons/fa";

const DesignDashboard = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    cars: 0,
    parts: 0,
    suppliers: 0,
    supply: 0,
  });

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const c = await api.get("/cars");
      const p = await api.get("/parts");
      const s = await api.get("/suppliers");
      const sp = await api.get("/part-supply");

      setCounts({
        cars: c.data.length,
        parts: p.data.length,
        suppliers: s.data.length,
        supply: sp.data.length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your system</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaCar className="text-blue-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">{counts.cars}</h2>
            <p className="text-gray-500 text-sm">Car Models</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaTools className="text-green-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">{counts.parts}</h2>
            <p className="text-gray-500 text-sm">Parts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaTruck className="text-yellow-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">{counts.suppliers}</h2>
            <p className="text-gray-500 text-sm">Suppliers</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaBox className="text-purple-500 text-2xl" />
          <div>
            <h2 className="text-xl font-bold">{counts.supply}</h2>
            <p className="text-gray-500 text-sm">Supply Records</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div
          onClick={() => navigate("/design/cars")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaCar className="text-blue-500 text-xl mb-2" />
          <h3 className="font-semibold">Car Models</h3>
          <p className="text-sm text-gray-500">Manage vehicle model specs</p>
        </div>

        <div
          onClick={() => navigate("/design/assign-parts")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaCogs className="text-indigo-500 text-xl mb-2" />
          <h3 className="font-semibold">Assign Parts</h3>
          <p className="text-sm text-gray-500">Assign parts to car models</p>
        </div>

        <div
          onClick={() => navigate("/design/parts")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaTools className="text-green-500 text-xl mb-2" />
          <h3 className="font-semibold">Parts</h3>
          <p className="text-sm text-gray-500">Parts inventory and stock</p>
        </div>

        <div
          onClick={() => navigate("/design/suppliers")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaTruck className="text-yellow-500 text-xl mb-2" />
          <h3 className="font-semibold">Suppliers</h3>
          <p className="text-sm text-gray-500">Supplier contacts and records</p>
        </div>

        <div
          onClick={() => navigate("/design/supply-records")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <FaBox className="text-purple-500 text-xl mb-2" />
          <h3 className="font-semibold">Supply Records</h3>
          <p className="text-sm text-gray-500">Track supply transactions</p>
        </div>
      </div>
    </div>
  );
};

export default DesignDashboard;
