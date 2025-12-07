import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaKey,
  FaChartBar,
  FaTools,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import useApi from "../../hooks/useApi";

// nav item classes for admin: maintain border, font and prevent shift
const adminNavItemClass = ({ isActive }) =>
  [
    "flex items-center gap-2 px-3 py-2 transition-colors duration-200 font-medium rounded-r-md border-l-4 border-l-transparent",
    isActive
      ? "border-l-red-500 bg-[#FDE8E8] text-[#D32F2F]"
      : "text-white hover:text-[#D32F2F] hover:bg-gray-100/40",
  ].join(" ");

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useApi();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.log("Logout error:", e);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="w-64 min-h-screen bg-[#FEE2E2] text-[#D32F2F] flex flex-col items-stretch px-0 py-0 border-r border-gray-200 shadow-md">
      <div className="py-8 px-4">
        <h2 className="text-2xl font-extrabold mb-10 text-[#D32F2F] tracking-wide text-center uppercase">DaiVietBlood Admin</h2>
      </div>
      <nav className="flex-1 flex flex-col gap-4 px-4">
        <Link
          to="/admin"
          className={({ isActive }) =>
            `block w-full px-0 py-3 rounded-2xl font-semibold text-lg text-center transition-all duration-150 ${isActive ? 'bg-[#D32F2F] text-white shadow' : 'bg-white text-[#D32F2F] hover:bg-[#FCA5A5] hover:text-[#D32F2F]'} `
          }
        >
          Dashboard
        </Link>
        <Link
          to="/admin/manage-role"
          className={({ isActive }) =>
            `block w-full px-0 py-3 rounded-2xl font-semibold text-lg text-center transition-all duration-150 ${isActive ? 'bg-[#D32F2F] text-white shadow' : 'bg-white text-[#D32F2F] hover:bg-[#FCA5A5] hover:text-[#D32F2F]'} `
          }
        >
          Quản lý người dùng
        </Link>
        <Link
          to="/admin/create-slot"
          className={({ isActive }) =>
            `block w-full px-0 py-3 rounded-2xl font-semibold text-lg text-center transition-all duration-150 ${isActive ? 'bg-[#D32F2F] text-white shadow' : 'bg-white text-[#D32F2F] hover:bg-[#FCA5A5] hover:text-[#D32F2F]'} `
          }
        >
          Tạo ca
        </Link>
        {/* <Link
          to="/admin/emergency-request"
          className={({ isActive }) =>
            `block w-full px-0 py-3 rounded-2xl font-semibold text-lg text-center transition-all duration-150 ${isActive ? 'bg-[#D32F2F] text-white shadow' : 'bg-[#FCA5A5] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white'} `
          }
        >
Yêu cầu khẩn cấp
        </Link> */}
        <Link
          to="/admin/blood-inventory"
          className={({ isActive }) =>
            `block w-full px-0 py-3 rounded-2xl font-semibold text-lg text-center transition-all duration-150 ${isActive ? 'bg-[#D32F2F] text-white shadow' : 'bg-white text-[#D32F2F] hover:bg-[#FCA5A5] hover:text-[#D32F2F]'} `
          }
        >
          Quản lý kho máu
        </Link>
        <Link
          to="/admin/blog"
          className={({ isActive }) =>
            `block w-full px-0 py-3 rounded-2xl font-semibold text-lg text-center transition-all duration-150 ${isActive ? 'bg-[#D32F2F] text-white shadow' : 'bg-white text-[#D32F2F] hover:bg-[#FCA5A5] hover:text-[#D32F2F]'} `
          }
        >
          Quản lý tin tức
        </Link>
        <button
          onClick={logout}
          className="block w-full px-0 py-3 rounded-2xl font-semibold text-lg text-center bg-white text-[#D32F2F] hover:bg-[#FCA5A5] hover:text-[#D32F2F] transition-all duration-150 mt-6"
        >
          Đăng xuất
        </button>
      </nav>
    </div>
  );
};

export default AdminNavbar;