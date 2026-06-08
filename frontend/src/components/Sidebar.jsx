import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaCogs,
  FaTools,
  FaTruck,
  FaBox,
  FaIndustry,
  FaBuilding,
  FaUsers,
  FaHandshake,
  FaDollarSign,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const adminMenu = [
    { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/cars", label: "Car Models", icon: <FaCar /> },
    { path: "/admin/assign-parts", label: "Assign Parts", icon: <FaCogs /> },
    { path: "/admin/parts", label: "Parts", icon: <FaTools /> },
    { path: "/admin/suppliers", label: "Suppliers", icon: <FaTruck /> },
    { path: "/admin/supply-records", label: "Supply Records", icon: <FaBox /> },
    {
      path: "/admin/production",
      label: "Production Records",
      icon: <FaIndustry />,
    },
    { path: "/admin/factories", label: "Factories", icon: <FaBuilding /> },
    { path: "/admin/employees", label: "Employees", icon: <FaUsers /> },
    { path: "/admin/dealers", label: "Dealers", icon: <FaHandshake /> },
    { path: "/admin/sales", label: "Sales", icon: <FaDollarSign /> },
    { path: "/admin/users", label: "Manage Users", icon: <FaUserShield /> },
  ];
  const designMenu = [
    { path: "/design", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/design/cars", label: "Car Models", icon: <FaCar /> },
    { path: "/design/assign-parts", label: "Assign Parts", icon: <FaCogs /> },
    { path: "/design/parts", label: "Parts", icon: <FaTools /> },
    { path: "/design/suppliers", label: "Suppliers", icon: <FaTruck /> },
    {
      path: "/design/supply-records",
      label: "Supply Records",
      icon: <FaBox />,
    },
  ];

  const menu =
    role === "admin"
      ? [
          { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
          { path: "/admin/cars", label: "Car Models", icon: <FaCar /> },
          {
            path: "/admin/assign-parts",
            label: "Assign Parts",
            icon: <FaCogs />,
          },
          { path: "/admin/parts", label: "Parts", icon: <FaTools /> },
          { path: "/admin/suppliers", label: "Suppliers", icon: <FaTruck /> },
          {
            path: "/admin/supply-records",
            label: "Supply Records",
            icon: <FaBox />,
          },
          {
            path: "/admin/production",
            label: "Production Records",
            icon: <FaIndustry />,
          },
          {
            path: "/admin/factories",
            label: "Factories",
            icon: <FaBuilding />,
          },
          { path: "/admin/employees", label: "Employees", icon: <FaUsers /> },
          { path: "/admin/dealers", label: "Dealers", icon: <FaHandshake /> },
          { path: "/admin/sales", label: "Sales", icon: <FaDollarSign /> },
          {
            path: "/admin/users",
            label: "Manage Users",
            icon: <FaUserShield />,
          },
        ]
      : role === "design"
        ? [
            { path: "/design", label: "Dashboard", icon: <FaTachometerAlt /> },
            { path: "/design/cars", label: "Car Models", icon: <FaCar /> },
            {
              path: "/design/assign-parts",
              label: "Assign Parts",
              icon: <FaCogs />,
            },
            { path: "/design/parts", label: "Parts", icon: <FaTools /> },
            {
              path: "/design/suppliers",
              label: "Suppliers",
              icon: <FaTruck />,
            },
            {
              path: "/design/supply-records",
              label: "Supply Records",
              icon: <FaBox />,
            },
          ]
        : role === "production"
          ? [
              {
                path: "/production",
                label: "Dashboard",
                icon: <FaTachometerAlt />,
              },
              {
                path: "/production/records",
                label: "Production",
                icon: <FaIndustry />,
              },
              {
                path: "/production/factories",
                label: "Factories",
                icon: <FaBuilding />,
              },
              {
                path: "/production/employees",
                label: "Employees",
                icon: <FaUsers />,
              },
            ]
          : role === "sales"
            ? [
                {
                  path: "/sales",
                  label: "Dashboard",
                  icon: <FaTachometerAlt />,
                },
                {
                  path: "/sales/dealers",
                  label: "Dealers",
                  icon: <FaHandshake />,
                },
                {
                  path: "/sales/sales-records",
                  label: "Sales Records",
                  icon: <FaDollarSign />,
                },
              ]
            : [];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between shadow-lg">
      <div>
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-wide">🚗 CMS</h1>
          <p className="text-xs text-gray-400">Car Manufacturing</p>
        </div>
        {/* Role Info */}
        <div className="p-4 border-b border-gray-700">
          <p className="text-sm font-semibold">
            {role === "admin"
              ? "System Administrator"
              : role === "design"
                ? "Design & Supply Manager"
                : "User"}
          </p>
          <p className="text-xs text-gray-400 capitalize">{role}</p>
        </div>

        <ul className="p-3 space-y-1 text-sm">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 shadow-md"
                    : "hover:bg-gray-700 hover:pl-4"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 py-2 rounded text-sm transition"
        >
          <FaSignOutAlt />
          Sign Out
        </button>
      </div>
    </div>
  );
}
