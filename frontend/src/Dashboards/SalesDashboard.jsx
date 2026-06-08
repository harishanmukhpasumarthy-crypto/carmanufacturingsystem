import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaStore,
  FaCar,
  FaMoneyBillWave,
} from "react-icons/fa";

const SalesDashboard = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    sales: 0,
    dealers: 0,
    models: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const s = await api.get("/sales");
      const d = await api.get("/dealers");
      const c = await api.get("/cars");

      let totalRevenue = 0;

      s.data.forEach((sale) => {
        const model = c.data.find((m) => m.model_id === sale.model_id);
        if (model) {
          totalRevenue += sale.quantity * model.price;
        }
      });

      setCounts({
        sales: s.data.length,
        dealers: d.data.length,
        models: c.data.length,
        revenue: totalRevenue,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of sales performance</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TopCard title="Total Sales" value={counts.sales} icon={<FaChartLine />} color="text-blue-500" />
        <TopCard title="Dealers" value={counts.dealers} icon={<FaStore />} color="text-yellow-500" />
        <TopCard title="Car Models" value={counts.models} icon={<FaCar />} color="text-green-500" />
        <TopCard title="Revenue" value={`₹ ${counts.revenue}`} icon={<FaMoneyBillWave />} color="text-purple-500" />
      </div>

      {/* NAVIGATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <ModuleCard
          title="Dealers"
          desc="Manage dealer records"
          icon={<FaStore />}
          onClick={() => navigate("/sales/dealers")}
        />

        <ModuleCard
          title="Sales Records"
          desc="View and add sales transactions"
          icon={<FaMoneyBillWave />}
          onClick={() => navigate("/sales/sales-records")}
        />

      </div>
    </div>
  );
};

export default SalesDashboard;

const TopCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    <div className={`text-2xl ${color}`}>{icon}</div>
    <div>
      <h2 className="text-xl font-bold">{value}</h2>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  </div>
);

const ModuleCard = ({ title, desc, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer hover:scale-105 transition"
  >
    <div className="text-xl mb-2">{icon}</div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);