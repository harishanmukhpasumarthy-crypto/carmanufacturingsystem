import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const DesignLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="p-4 border-b bg-white shadow-sm">
          <h1 className="font-semibold text-3xl text-blue-600">Design and Supply Manager</h1>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default DesignLayout;
