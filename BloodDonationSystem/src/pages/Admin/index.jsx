import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import useApi from "../../hooks/useApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COLORS = ["#F72585", "#FF8A00", "#FF6B6B", "#FFC300", "#3B82F6", "#34D399", "#6366F1", "#F59E42"];

const AdminDashboard = () => {
  const { getBloodBank, getAppointments, getAllBloodUnit, getEmergencyRequestList } = useApi();
  const [pieData, setPieData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [donationsToday, setDonationsToday] = useState(0);
  const [donorsByMonth, setDonorsByMonth] = useState([]);
  const [bloodByMonth, setBloodByMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodToday, setBloodToday] = useState(0);
  const [newDonorsThisWeek, setNewDonorsThisWeek] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);

  useEffect(() => {
    const fetchBloodBank = async () => {
      setLoading(true);
      try {
        const res = await getBloodBank();
        const data = res.data || [];
        const groupMap = {};
        data.forEach(item => {
          groupMap[item.BloodGroup] = item.Volume;
        });
        const pieArr = BLOOD_GROUPS.map(group => ({
          name: group,
          value: groupMap[group] ? Number(groupMap[group]) : 0,
        }));
        setPieData(pieArr);
      } catch (err) {
        setPieData(BLOOD_GROUPS.map(group => ({ name: group, value: 0 })));
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      const res = await getAppointments();
      const data = res.data || [];
      setAppointments(data);

      // Loại bỏ các appointment có Status là "Canceled"
      const validAppointments = data.filter(a => a.Status !== "Canceled");

      // Tổng ca hiến trong ngày
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayCount = validAppointments.filter(a => a.DATE?.slice(0, 10) === todayStr).length;
      setDonationsToday(todayCount);

      // Tổng số người hiến theo tháng
      const monthMap = {};
      validAppointments.forEach(a => {
        if (a.DATE) {
          const d = new Date(a.DATE);
          const key = `Th${d.getMonth() + 1}`;
          monthMap[key] = (monthMap[key] || 0) + 1;
        }
      });
      const months = Object.keys(monthMap).sort((a, b) => parseInt(a.replace("Th", "")) - parseInt(b.replace("Th", "")));
      setDonorsByMonth(months.map(m => ({
        month: m,
        donors: monthMap[m]
      })));

      // Người hiến mới / tuần (tính từ Thứ Hai)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const userIdsBeforeWeek = new Set(
        validAppointments.filter(a => new Date(a.DATE) < startOfWeek).map(a => a.User_ID)
      );
      const userIdsThisWeek = new Set(
        validAppointments.filter(a => {
          const d = new Date(a.DATE);
          return d >= startOfWeek && d <= now;
        }).map(a => a.User_ID)
      );
      let newCount = 0;
      userIdsThisWeek.forEach(uid => {
        if (!userIdsBeforeWeek.has(uid)) newCount++;
      });
      setNewDonorsThisWeek(newCount);
    };

    const fetchBloodUnit = async () => {
      try {
        const res = await getAllBloodUnit();
        const data = res.data || [];
        const bloodMonthMap = {};
        let todayTotal = 0;
        const todayStr = new Date().toISOString().slice(0, 10);
        data.forEach(unit => {
          if (unit.Collected_Date && unit.Volume) {
            const d = new Date(unit.Collected_Date);
            if (d.getFullYear() === 2025) {
              const key = `Th${d.getMonth() + 1}`;
              bloodMonthMap[key] = (bloodMonthMap[key] || 0) + Number(unit.Volume);
            }
            // Tổng lượng máu thu hôm nay
            if (unit.Collected_Date.slice(0, 10) === todayStr) {
              todayTotal += Number(unit.Volume);
            }
          }
        });
        const months = Object.keys(bloodMonthMap).sort((a, b) => parseInt(a.replace("Th", "")) - parseInt(b.replace("Th", "")));
        setBloodByMonth(months.map(m => ({
          month: m,
          units: bloodMonthMap[m]
        })));
        setBloodToday(todayTotal);
      } catch {
        setBloodByMonth([]);
        setBloodToday(0);
      }
    };

    // Đếm số yêu cầu khẩn cấp từ API
    const fetchEmergencyCount = async () => {
      try {
        const res = await getEmergencyRequestList();
        const data = res.data || [];
        setEmergencyCount(data.length);
      } catch {
        setEmergencyCount(0);
      }
    };

    fetchBloodBank();
    fetchAppointments();
    fetchBloodUnit();
    fetchEmergencyCount();
  }, [getBloodBank, getAppointments, getAllBloodUnit, getEmergencyRequestList]);

  // Tính tổng kho máu thực tế từ pieData
  const totalVolume = pieData.reduce((sum, p) => sum + p.value, 0);

  // Thống kê nhanh (chỉ Tổng kho máu lấy từ dữ liệu thật, các số khác demo)
  const stats = [
    { label: "Đơn vị thu hôm nay (ml)", value: bloodToday },
    { label: "Tổng ca hiến trong ngày", value: donationsToday },
    { label: "Người hiến mới / tuần", value: newDonorsThisWeek },
    { label: "Yêu cầu khẩn cấp", value: emergencyCount },
    { label: "Tổng kho máu (đv)", value: totalVolume },
  ];

  // Demo dữ liệu cho các biểu đồ khác
  const demoLine = [
    { month: "Th1", units: 260 },
    { month: "Th2", units: 310 },
    { month: "Th3", units: 180 },
    { month: "Th4", units: 330 },
    { month: "Th5", units: 420 },
    { month: "Th6", units: 390 },
    { month: "Th7", units: 480 },
  ];

  /* ---------- Line chart ---------- */
  const lineChartData = {
    labels: bloodByMonth.map((d) => d.month),
    datasets: [
      {
        label: "Đơn vị máu",
        data: bloodByMonth.map((d) => d.units),
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  /* ---------- Pie chart ---------- */
  const pieChartData = {
    labels: pieData.map((p) => p.name),
    datasets: [
      {
        data: pieData.map((p) => p.value),
        backgroundColor: COLORS,
        hoverOffset: 6,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  /* ---------- Histogram (Bar) ---------- */
  const barChartData = {
    labels: donorsByMonth.map((h) => h.month),
    datasets: [
      {
        label: "Người hiến",
        data: donorsByMonth.map((h) => h.donors),
        backgroundColor: "#3B82F6", // tailwind blue-500
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // cần để lấp đầy khung cố định cao
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true } },
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ===== THỐNG KÊ NHANH ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-white shadow flex flex-col items-center py-6"
          >
            <span className="text-sm font-medium text-gray-600 text-center px-2">
              {s.label}
            </span>
            <p className="mt-2 text-3xl font-bold text-red-600">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ===== 2 BIỂU ĐỒ ĐẦU ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart */}
        <div className="rounded-lg bg-white shadow p-4">
          <h3 className="text-center font-semibold mb-4">
            Lượng máu thu theo tháng
          </h3>
          <Line data={lineChartData} options={lineOptions} height={300} />
        </div>

        {/* Pie chart + số lượng còn lại */}
        <div className="rounded-lg bg-white shadow p-4">
          <h3 className="text-center font-semibold mb-4">
            Tồn kho theo nhóm máu
          </h3>
          {loading ? (
            <div>Đang tải dữ liệu...</div>
          ) : (
            <>
              <Pie data={pieChartData} options={pieOptions} height={300} />
              <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-8 text-sm">
                {pieData.map((p, idx) => (
                  <div
                    key={p.name}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="w-12 inline-block">{p.name}:</span>
                    <span className="font-semibold">{p.value}</span>
                    <span>đv</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== HISTOGRAM ===== */}
      <div className="rounded-lg bg-white shadow p-4 mt-6">
        <h3 className="text-center font-semibold mb-4">
          Tổng số người hiến theo tháng
        </h3>
        {/* Khung cao 64 (≈256 px) */}
        <div className="h-64">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

const BlogAdmin = () => {
  const { callApi } = useApi();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", image_url: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Lấy danh sách blog
  const fetchBlogs = () => {
    setLoading(true);
    callApi("/blogs")
      .then((res) => {
        setBlogs(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải tin tức!");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Xử lý submit tạo/sửa
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return alert("Vui lòng nhập đủ tiêu đề và nội dung!");
    if (editingId) {
      // Sửa
      callApi(`/blogs/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      })
        .then(() => {
          setShowForm(false);
          setEditingId(null);
          setForm({ title: "", content: "", image_url: "" });
          fetchBlogs();
        })
        .catch(() => alert("Lỗi khi sửa tin tức!"));
    } else {
      // Tạo mới
      callApi("/blogs/create", {
        method: "POST",
        body: JSON.stringify(form),
      })
        .then(() => {
          setShowForm(false);
          setForm({ title: "", content: "", image_url: "" });
          fetchBlogs();
        })
        .catch(() => alert("Lỗi khi tạo tin tức!"));
    }
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin này?")) return;
    callApi(`/blogs/${id}`, { method: "DELETE" })
      .then(() => fetchBlogs())
      .catch(() => alert("Lỗi khi xóa tin tức!"));
  };

  // Mở form sửa
  const handleEdit = (blog) => {
    setForm({ title: blog.title, content: blog.content, image_url: blog.image_url || "" });
    setEditingId(blog.blogId || blog.id);
    setShowForm(true);
  };

  // Mở form tạo mới
  const handleAdd = () => {
    setForm({ title: "", content: "", image_url: "" });
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#D32F2F]">Quản lý tin tức (Blog)</h2>
      <button onClick={handleAdd} className="mb-4 px-4 py-2 bg-[#D32F2F] text-white rounded">+ Thêm tin mới</button>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Tiêu đề</th>
              <th className="p-2 border">Ảnh</th>
              <th className="p-2 border">Nội dung</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.blogId || blog.id}>
                <td className="border p-2">{blog.title}</td>
                <td className="border p-2">{blog.image_url && <img src={blog.image_url} alt="" className="w-24 h-16 object-cover" />}</td>
                <td className="border p-2 max-w-xs truncate">{blog.content}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(blog)} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">Sửa</button>
                  <button onClick={() => handleDelete(blog.blogId || blog.id)} className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingId ? "Sửa tin tức" : "Thêm tin tức mới"}</h3>
            <div className="mb-2">
              <label className="block mb-1">Tiêu đề</label>
              <input type="text" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Link ảnh (image_url)</label>
              <input type="text" className="w-full border p-2 rounded" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Nội dung</label>
              <textarea className="w-full border p-2 rounded" rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-[#D32F2F] text-white rounded">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
