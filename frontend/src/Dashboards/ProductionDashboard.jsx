import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const ProductionDashboard = () => {
  const [stats, setStats] = useState({
    totalProduction: 0,
    totalFactories: 0,
    totalEmployees: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const p = await api.get("/production");
      const f = await api.get("/factories");
      const e = await api.get("/employees");

      setStats({
        totalProduction: p.data.length,
        totalFactories: f.data.length,
        totalEmployees: e.data.length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Production Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of production activities and resources
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <TopCard title="Production Records" value={stats.totalProduction} icon="🔧" />
        <TopCard title="Factories" value={stats.totalFactories} icon="🏗️" />
        <TopCard title="Employees" value={stats.totalEmployees} icon="👷" />
      </div>

      {/* NAVIGATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModuleCard
          title="Production Records"
          desc="View and add production entries"
          icon="🔧"
          onClick={() => navigate("/production/records")}
        />

        <ModuleCard
          title="Factories"
          desc="Manage factory locations and capacity"
          icon="🏗️"
          onClick={() => navigate("/production/factories")}
        />

        <ModuleCard
          title="Employees"
          desc="Manage factory employees"
          icon="👷"
          onClick={() => navigate("/production/employees")}
        />
      </div>
    </div>
  );
};

export default ProductionDashboard;

const TopCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  </div>
);

const ModuleCard = ({ title, desc, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow p-5 cursor-pointer hover:scale-105 hover:shadow-xl transition"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <h2 className="font-bold mb-1">{title}</h2>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);