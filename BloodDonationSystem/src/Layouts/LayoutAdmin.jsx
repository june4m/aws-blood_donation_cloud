import AdminNavbar from "../components/layout/SidebarAdmin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminNavbar />
      <main className="p-8 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
