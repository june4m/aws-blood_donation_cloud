import React, { useEffect, useState, useMemo } from "react";
import useApi from "../../hooks/useApi";

export default function StaffReportHistory() {
  const { getStaffReports } = useApi();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getStaffReports()
      .then(res => setReports(res.data || []))
      .finally(() => setLoading(false));
  }, [getStaffReports]);

  // Hàm format ngày dd/mm/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("T")[0].split("-");
    return `${d}/${m}/${y}`;
  };

  // Sắp xếp báo cáo mới nhất lên đầu (theo Report_Date giảm dần)
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const dateA = new Date(a.Report_Date || 0);
      const dateB = new Date(b.Report_Date || 0);
      return dateB - dateA;
    });
  }, [reports]);

  // Lọc theo tên, số điện thoại hoặc ngày báo cáo
  const filteredReports = sortedReports.filter(row => {
    const searchLower = search.trim().toLowerCase();
    if (!searchLower) return true;
    const name = (row.User_Name || "").toLowerCase();
    const phone = (row.Phone || "").toLowerCase();
    const date = formatDate(row.Report_Date);
    return (
      name.includes(searchLower) ||
      phone.includes(searchLower) ||
      date.includes(searchLower)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-red-700 mb-8 flex items-center gap-3">
        <i className="fa fa-file-alt text-red-500" /> Lịch sử báo cáo nhân viên
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            className="border px-4 py-2 rounded-lg w-72 text-base"
            placeholder="Tìm theo tên, SĐT, ngày báo cáo"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-lg text-gray-500">
            <i className="fa fa-spinner fa-spin mr-3 text-2xl" />
            Đang tải dữ liệu...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg">
            Không có báo cáo nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-base border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-100 text-gray-800 rounded-lg shadow">
                  <th className="py-3 px-4 font-semibold text-center rounded-tl-xl">Tên nhân viên</th>
                  <th className="py-3 px-4 font-semibold text-center">Tiêu đề</th>
                  <th className="py-3 px-4 font-semibold text-center">Mô tả</th>
                  <th className="py-3 px-4 font-semibold text-center">Số điện thoại</th>
                  <th className="py-3 px-4 font-semibold text-center">Email</th>
                  <th className="py-3 px-4 font-semibold text-center rounded-tr-xl">Ngày báo cáo</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((row, idx) => (
                  <tr key={idx} className="border-b last:border-b-0 hover:bg-red-50 transition">
                    <td className="py-3 px-4 text-center font-bold text-red-700">{row.User_Name}</td>
                    <td className="py-3 px-4 text-center">{row.Title}</td>
                    <td className="py-3 px-4 text-justify whitespace-pre-line break-words max-w-[220px] truncate">
                      {row.Description}
                    </td>
                    <td className="py-3 px-4 text-center">{row.Phone}</td>
                    <td className="py-3 px-4 text-center">{row.Email}</td>
                    <td className="py-3 px-4 text-center">
                      {formatDate(row.Report_Date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}