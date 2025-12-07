import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaKey,
  FaChartBar,
  FaTools,
  FaBell,
} from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="p-4 sm:p-8 max-w-screen-xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Chào mừng đến với trang Admin Dashboard
      </h1>
      <p className="text-gray-700 mb-6">
        Đây là trang tổng quan dành cho quản trị viên hệ thống.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/admin"
          className="bg-blue-100 p-4 rounded shadow flex flex-col items-center hover:bg-blue-200 transition"
        >
          <FaTachometerAlt className="text-2xl mb-2 text-blue-700" />
          <span className="font-semibold">Dashboard</span>
        </Link>
        <Link
          to="#"
          className="bg-blue-100 p-4 rounded shadow flex flex-col items-center hover:bg-blue-200 transition"
        >
          <FaUserShield className="text-2xl mb-2 text-blue-700" />
          <span className="font-semibold">Quản lý Staff</span>
        </Link>
        <Link
          to="/manage-role"
          className="bg-blue-100 p-4 rounded shadow flex flex-col items-center hover:bg-blue-200 transition"
        >
          <FaKey className="text-2xl mb-2 text-blue-700" />
          <span className="font-semibold">Quản lý Role</span>
        </Link>
        <Link
          to="#"
          className="bg-blue-100 p-4 rounded shadow flex flex-col items-center hover:bg-blue-200 transition"
        >
          <FaChartBar className="text-2xl mb-2 text-blue-700" />
          <span className="font-semibold">Báo cáo tổng hợp</span>
        </Link>
        <Link
          to="/emergency-request"
          className="bg-blue-100 p-4 rounded shadow flex flex-col items-center hover:bg-blue-200 transition"
        >
          <FaBell className="text-2xl mb-2 text-blue-700" />
          <span className="font-semibold">Yêu cầu khẩn cấp</span>
        </Link>
        <Link
          to="#"
          className="bg-blue-100 p-4 rounded shadow flex flex-col items-center hover:bg-blue-200 transition"
        >
          <FaTools className="text-2xl mb-2 text-blue-700" />
          <span className="font-semibold">Cài đặt</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
