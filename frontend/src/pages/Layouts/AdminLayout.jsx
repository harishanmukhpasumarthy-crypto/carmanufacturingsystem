import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow px-6 py-4">
          <h1 className="text-3xl font-semibold text-blue-600">
            Welcome to Admin Page
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;