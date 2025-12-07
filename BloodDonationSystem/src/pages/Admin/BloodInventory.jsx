import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Thêm dòng này

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BloodInventory = () => {
  const { getAllBloodUnit, getBloodBank, loading } = useApi();
  const navigate = useNavigate(); // Thêm dòng này

  // State cho thống kê lô máu
  const [bloodUnitStats, setBloodUnitStats] = useState([]);
  const [bloodBankStats, setBloodBankStats] = useState([]);
  const [bloodUnits, setBloodUnits] = useState([]);
  const [bloodBankData, setBloodBankData] = useState([]);

  // Fetch dữ liệu lô máu và tính thống kê
  useEffect(() => {
    const fetchBloodUnits = async () => {
      try {
        const res = await getAllBloodUnit();
        const units = res.data || [];
        setBloodUnits(units);

        // Tính tổng lượng máu theo nhóm máu
        const groupStats = {};
        units.forEach((unit) => {
          const group = unit.BloodGroup || "Unknown";
          const volume = parseInt(unit.Volume) || 0;
          if (groupStats[group]) {
            groupStats[group] += volume;
          } else {
            groupStats[group] = volume;
          }
        });

        // Chuyển đổi thành array để hiển thị
        const statsArray = Object.entries(groupStats).map(([group, total]) => ({
          group,
          total,
          count: units.filter((u) => u.BloodGroup === group).length,
        }));

        setBloodUnitStats(statsArray);
      } catch (err) {
        console.error("Load blood units failed", err);
      }
    };

    fetchBloodUnits();
    // Scroll to top khi component mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [getAllBloodUnit]);

  // Fetch dữ liệu ngân hàng máu và tính thống kê
  useEffect(() => {
    const fetchBloodBank = async () => {
      try {
        const res = await getBloodBank();
        const bankData = res.data || [];
        setBloodBankData(bankData);

        // Tính tổng lượng máu theo nhóm máu từ Blood Bank
        const groupStats = {};
        bankData.forEach((item) => {
          const group = item.BloodGroup || "Unknown";
          const volume = parseInt(item.Volume) || 0;
          if (groupStats[group]) {
            groupStats[group] += volume;
          } else {
            groupStats[group] = volume;
          }
        });

        // Chuyển đổi thành array để hiển thị
        const statsArray = Object.entries(groupStats).map(([group, total]) => ({
          group,
          total,
          count: bankData.filter((u) => u.BloodGroup === group).length,
        }));

        setBloodBankStats(statsArray);
      } catch (err) {
        console.error("Load blood bank failed", err);
      }
    };

    fetchBloodBank();
  }, [getBloodBank]);

  // Reload data function
  const handleReload = async () => {
    try {
      // Scroll to top khi reload
      window.scrollTo({ top: 0, behavior: "smooth" });

      const [bloodUnitRes, bloodBankRes] = await Promise.all([
        getAllBloodUnit(),
        getBloodBank(),
      ]);

      // Update blood units
      const units = bloodUnitRes.data || [];
      setBloodUnits(units);

      // Update blood bank
      const bankData = bloodBankRes.data || [];
      setBloodBankData(bankData);

      // Recalculate stats for blood units
      const unitGroupStats = {};
      units.forEach((unit) => {
        const group = unit.BloodGroup || "Unknown";
        const volume = parseInt(unit.Volume) || 0;
        if (unitGroupStats[group]) {
          unitGroupStats[group] += volume;
        } else {
          unitGroupStats[group] = volume;
        }
      });

      const unitStatsArray = Object.entries(unitGroupStats).map(
        ([group, total]) => ({
          group,
          total,
          count: units.filter((u) => u.BloodGroup === group).length,
        })
      );

      setBloodUnitStats(unitStatsArray);

      // Recalculate stats for blood bank
      const bankGroupStats = {};
      bankData.forEach((item) => {
        const group = item.BloodGroup || "Unknown";
        const volume = parseInt(item.Volume) || 0;
        if (bankGroupStats[group]) {
          bankGroupStats[group] += volume;
        } else {
          bankGroupStats[group] = volume;
        }
      });

      const bankStatsArray = Object.entries(bankGroupStats).map(
        ([group, total]) => ({
          group,
          total,
          count: bankData.filter((u) => u.BloodGroup === group).length,
        })
      );

      setBloodBankStats(bankStatsArray);
    } catch (err) {
      console.error("Reload failed", err);
    }
  };

  // Biểu đồ thống kê lô máu theo nhóm máu
  const bloodUnitChartData = {
    labels: bloodUnitStats.map((stat) => stat.group),
    datasets: [
      {
        label: "Lô máu - Tổng lượng (ml)",
        data: bloodUnitStats.map((stat) => stat.total),
        backgroundColor: "#DC2626",
        borderColor: "#B91C1C",
        borderWidth: 1,
      },
    ],
  };

  // Biểu đồ thống kê ngân hàng máu theo nhóm máu
  const bloodBankChartData = {
    labels: bloodBankStats.map((stat) => stat.group),
    datasets: [
      {
        label: "Ngân hàng máu - Tổng lượng (ml)",
        data: bloodBankStats.map((stat) => stat.total),
        backgroundColor: "#059669",
        borderColor: "#047857",
        borderWidth: 1,
      },
    ],
  };

  const bloodTypeList = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statusList = [
    { key: "Available", label: "Còn sử dụng", color: "text-green-600" },
    { key: "Expired", label: "Hết hạn", color: "text-gray-500" },
    { key: "Used", label: "Hết máu", color: "text-orange-600" },
  ];

  // Tính thống kê lô máu theo nhóm máu và trạng thái
  const bloodUnitStatusStats = bloodTypeList.map((group) => {
    const byStatus = {};
    statusList.forEach((status) => {
      const filtered = bloodUnits.filter(
        (unit) => unit.BloodGroup === group && unit.Status === status.key
      );
      byStatus[status.key] = {
        count: filtered.length,
        total: filtered.reduce((sum, unit) => sum + Number(unit.Volume || 0), 0),
      };
    });
    return { group, byStatus };
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen max-w-screen-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Quản lý Kho Máu</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/admin/report-history")}
        >
          Xem lịch sử báo cáo nhân viên
        </button>
      </div>

      {/* SUMMARY CARDS CHO LÔ MáU */}
      {bloodUnitStats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            📊 Thống kê Lô Máu
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            {bloodUnitStats.map((stat, idx) => (
              <motion.div
                key={stat.group}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-shadow"
              >
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {stat.group}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {stat.count} lô
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {stat.total.toLocaleString()} ml
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tổng kết lô máu */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-6 shadow-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {bloodUnitStats.reduce((sum, stat) => sum + stat.count, 0)}
                </div>
                <div className="text-red-100">Tổng số lô máu</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {bloodUnitStats
                    .reduce((sum, stat) => sum + stat.total, 0)
                    .toLocaleString()}{" "}
                  ml
                </div>
                <div className="text-red-100">Tổng lượng máu</div>
              </div>
              <div className="md:col-span-1 col-span-2">
                <div className="text-2xl font-bold">
                  {bloodUnitStats.length}
                </div>
                <div className="text-red-100">Nhóm máu khác nhau</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUMMARY CARDS CHO NGÂN HÀNG MÁU */}
      {bloodBankStats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            🏦 Thống kê Ngân hàng Máu
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            {bloodBankStats.map((stat, idx) => (
              <motion.div
                key={stat.group}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-shadow"
              >
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stat.group}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {stat.count} đơn vị
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {stat.total.toLocaleString()} ml
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tổng kết ngân hàng máu */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {bloodBankStats.reduce((sum, stat) => sum + stat.count, 0)}
                </div>
                <div className="text-green-100">Tổng số đơn vị</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {bloodBankStats
                    .reduce((sum, stat) => sum + stat.total, 0)
                    .toLocaleString()}{" "}
                  ml
                </div>
                <div className="text-green-100">Tổng lượng máu</div>
              </div>
              <div className="md:col-span-1 col-span-2">
                <div className="text-2xl font-bold">
                  {bloodBankStats.length}
                </div>
                <div className="text-green-100">Nhóm máu khác nhau</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHARTS GRID */}
      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        {/* Blood Unit Chart */}
        {bloodUnitStats.length > 0 && (
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              📈 Biểu đồ Lô Máu theo Nhóm Máu
            </h2>
            <Bar
              data={bloodUnitChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Thống kê lượng máu từ các lô máu",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Lượng máu (ml)",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Nhóm máu",
                    },
                  },
                },
              }}
            />
          </div>
        )}

        {/* Blood Bank Chart */}
        {bloodBankStats.length > 0 && (
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-green-600">
              📊 Biểu đồ Ngân hàng Máu theo Nhóm Máu
            </h2>
            <Bar
              data={bloodBankChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Thống kê lượng máu từ ngân hàng máu",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Lượng máu (ml)",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Nhóm máu",
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Bảng thống kê nhóm máu theo trạng thái */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <span role="img" aria-label="chart" className="text-3xl">📊</span>
          Thống kê Lô Máu Theo Trạng Thái
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-base border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100 text-gray-800 rounded-lg shadow">
                <th className="py-3 px-4 font-semibold text-center rounded-tl-xl">Nhóm máu</th>
                {statusList.map((status, idx) => (
                  <th
                    key={status.key}
                    className={`py-3 px-4 font-semibold text-center ${idx === statusList.length - 1 ? "rounded-tr-xl" : ""}`}
                  >
                    {status.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloodUnitStatusStats.map((row, idx) => (
                <tr key={row.group} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-bold text-center">{row.group}</td>
                  {statusList.map((status) => (
                    <td key={status.key} className={`py-3 px-4 text-center`}>
                      <span
                        className={`font-semibold ${
                          status.key === "Available"
                            ? "text-green-600 bg-green-50 px-2 py-1 rounded-lg"
                            : status.key === "Expired"
                            ? "text-gray-600 bg-gray-50 px-2 py-1 rounded-lg"
                            : "text-orange-600 bg-orange-50 px-2 py-1 rounded-lg"
                        }`}
                      >
                        {row.byStatus[status.key].count} lô, {row.byStatus[status.key].total.toLocaleString()} ml
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}
    </div>
  );
};

export default BloodInventory;
