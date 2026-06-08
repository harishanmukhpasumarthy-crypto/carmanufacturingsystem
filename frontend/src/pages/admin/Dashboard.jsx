import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    cars: 0,
    factories: 0,
    employees: 0,
    sales: 0,
    users: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  return (
    <div className="p-6">

      <div className="grid grid-cols-5 gap-4 mb-8">

        <TopCard title="Car Models" value={stats.cars} icon="🚗" />
        <TopCard title="Factories" value={stats.factories} icon="🏗️" />
        <TopCard title="Employees" value={stats.employees} icon="👷" />
        <TopCard title="Sales Records" value={stats.sales} icon="💰" />
        <TopCard title="Users" value={stats.users} icon="👤" />

      </div>

     
      <div className="grid grid-cols-4 gap-6">

        <ModuleCard
          title="Car Models"
          desc="Manage vehicle model specs, pricing, and engine types"
          icon="🚗"
          onClick={() => navigate("/admin/cars")}
        />

        <ModuleCard
          title="Assign Parts"
          desc="Assign parts with required quantities to car models"
          icon="🔩"
          onClick={() => navigate("/admin/assign-parts")}
        />

        <ModuleCard
          title="Parts"
          desc="Parts inventory, pricing, and stock levels"
          icon="⚙️"
          onClick={() => navigate("/admin/parts")}
        />

        <ModuleCard
          title="Suppliers"
          desc="Supplier contacts and records"
          icon="🏭"
          onClick={() => navigate("/admin/suppliers")}
        />

        <ModuleCard
          title="Supply Records"
          desc="Track part delivery transactions from suppliers"
          icon="📦"
          onClick={() => navigate("/admin/supply-records")}
        />

        <ModuleCard
          title="Production Records"
          desc="Log production runs by factory and model"
          icon="🔧"
          onClick={() => navigate("/admin/production")}
        />

        <ModuleCard
          title="Factories"
          desc="Factory locations and production capacity"
          icon="🏗️"
          onClick={() => navigate("/admin/factories")}
        />

        <ModuleCard
          title="Employees"
          desc="Employee records linked to factories"
          icon="👷"
          onClick={() => navigate("/admin/employees")}
        />

        <ModuleCard
          title="Dealers"
          desc="Dealer network contacts and locations"
          icon="🤝"
          onClick={() => navigate("/admin/dealers")}
        />

        <ModuleCard
          title="Sales"
          desc="Vehicle sales transactions through dealers"
          icon="💰"
          onClick={() => navigate("/admin/sales")}
        />

        <ModuleCard
          title="Manage Users"
          desc="User accounts and role management"
          icon="👤"
          onClick={() => navigate("/admin/users")}
        />

      </div>
    </div>
  );
};

export default Dashboard;

const TopCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </div>
  );
};

const ModuleCard = ({ title, desc, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow p-5 cursor-pointer 
                 hover:scale-105 hover:shadow-xl transition"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h2 className="font-bold mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
};