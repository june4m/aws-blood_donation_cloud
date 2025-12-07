import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const bloodTypeMapping = {
  "A+": "BT001", "A-": "BT002", "B+": "BT003", "B-": "BT004",
  "AB+": "BT005", "AB-": "BT006", "O+": "BT007", "O-": "BT008"
};
const bloodTypes = Object.keys(bloodTypeMapping);

const RoleManagement = () => {
  const {
    getAllUsers,
    banUser,
    unbanUser,
    createStaffAccount,
    addPotential,
    getApprovedPotentialList,
    updatePotentialStatus,
  } = useApi();

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(""); // "ban" hoặc "unban"
  const [selectedId, setSelectedId] = useState(null);

  // Modal tạo staff
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    bloodType: "",
    date_of_birth: "",
  });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Potential
  const [potentialList, setPotentialList] = useState([]);
  const [showPotentialPopup, setShowPotentialPopup] = useState(false);
  const [potentialLoading, setPotentialLoading] = useState(false);

  // Thêm state để lưu danh sách User_ID của người tiềm năng đã approved
  const [potentialUserIds, setPotentialUserIds] = useState([]);
  const [noteInput, setNoteInput] = useState(""); // Thêm state cho Note

  // Thêm state cho popup nhập Note
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [pendingPotentialUserId, setPendingPotentialUserId] = useState(null);

  // State cho popup xem chi tiết user
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchStaffs = async () => {
    setLoading(true);
    const res = await getAllUsers();
    const staffList = (res.data || res).filter(
      u => u.User_Role === "staff" || u.User_Role === "member"
    );
    setStaffs(staffList);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleBan = (userId) => {
    setSelectedId(userId);
    setActionType("ban");
    setShowConfirm(true);
  };

  const handleUnban = (userId) => {
    setSelectedId(userId);
    setActionType("unban");
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (actionType === "ban") {
      await banUser(selectedId);
      toast.success("Khóa tài khoản thành công!");
    } else {
      await unbanUser(selectedId);
      toast.success("Mở khóa tài khoản thành công!");
    }
    setShowConfirm(false);
    setSelectedId(null);
    setActionType("");
    fetchStaffs();
  };

  // Tính toán ngày tối thiểu và tối đa cho độ tuổi 18-60
  const calculateAgeLimit = () => {
    const today = new Date();
    const maxDate = new Date();
    const minDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);
    minDate.setFullYear(today.getFullYear() - 60);
    return {
      min: minDate.toISOString().split("T")[0],
      max: maxDate.toISOString().split("T")[0],
    };
  };
  const ageLimit = calculateAgeLimit();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;
    if (actualAge < 18 || actualAge > 60) {
      return "Phải nhập trên 18 tuổi";
    }
    return "";
  };

  // Validate giống trang Register
  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email là bắt buộc";
    if (!form.password.trim()) newErrors.password = "Mật khẩu là bắt buộc";
    else if (!passwordRegex.test(form.password))
      newErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
    if (!form.name.trim()) newErrors.name = "Họ và tên là bắt buộc";
    if (!form.bloodType) newErrors.bloodType = "Vui lòng chọn nhóm máu";
    if (!form.date_of_birth) newErrors.date_of_birth = "Ngày sinh là bắt buộc";
    const ageError = validateAge(form.date_of_birth);
    if (ageError) newErrors.date_of_birth = ageError;
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (name === "date_of_birth") {
      const ageError = validateAge(value);
      setErrors({ ...errors, date_of_birth: ageError });
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCreating(true);
    try {
      await createStaffAccount({
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        name: form.name,
        date_of_birth: form.date_of_birth,
        bloodType_id: bloodTypeMapping[form.bloodType]
      });
      toast.success("Tạo tài khoản staff thành công!");
      setShowCreateModal(false);
      setForm({
        email: "",
        password: "",
        confirm_password: "",
        name: "",
        bloodType: "",
        date_of_birth: "",
      });
      fetchStaffs();
    } catch (error) {
      toast.error(error.message || "Tạo tài khoản thất bại!");
    } finally {
      setCreating(false);
    }
  };

  // --- Potential logic ---
  const handleAddPotential = (userId) => {
    setPendingPotentialUserId(userId);
    setNoteInput("");
    setShowNotePopup(true);
  };

  const handleConfirmAddPotential = async () => {
    try {
      await addPotential(pendingPotentialUserId, noteInput);
      toast.success("Đã thêm vào danh sách người tiềm năng!");
      setShowNotePopup(false);
      setPendingPotentialUserId(null);
      setNoteInput("");
      handleShowPotentialList(); // Cập nhật lại danh sách tiềm năng nếu cần
    } catch (err) {
      toast.error(err.message || "Thêm thất bại!");
    }
  };

  const handleShowPotentialList = async () => {
    setPotentialLoading(true);
    try {
      const res = await getApprovedPotentialList();
      setPotentialList(res.data || []);
      // Lưu mảng User_ID của người tiềm năng đã approved
      setPotentialUserIds((res.data || []).map(item => item.User_ID));
      setShowPotentialPopup(true);
    } catch (err) {
      toast.error("Không lấy được danh sách người tiềm năng!");
    }
    setPotentialLoading(false);
  };

  const handleUpdatePotentialStatus = async (potentialId, status) => {
    try {
      await updatePotentialStatus(potentialId, status);
      toast.success("Cập nhật trạng thái thành công!");
      handleShowPotentialList();
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-extrabold text-[#D32F2F] mb-6 text-center">Quản lý tài khoản</h2>
      <div className="flex justify-between items-center mb-4 max-w-6xl mx-auto">
        <button
          className="px-6 py-2.5 bg-[#D32F2F] text-white rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <span className="text-lg">+</span> Tạo tài khoản staff
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
          onClick={handleShowPotentialList}
        >
          Xem danh sách tiềm năng
        </button>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-4 mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-red-50">
                <th className="py-3 px-4 text-left font-semibold text-[#D32F2F] rounded-tl-xl">Tên</th>
                <th className="py-3 px-4 text-left font-semibold text-[#D32F2F]">Email</th>
                <th className="py-3 px-4 text-center font-semibold text-[#D32F2F]">Vai trò</th>
                <th className="py-3 px-4 text-center font-semibold text-[#D32F2F] min-w-[120px]">Trạng thái</th>
                <th className="py-3 px-4 text-center font-semibold text-[#D32F2F] rounded-tr-xl">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D32F2F]"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : staffs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">Không có staff nào.</td>
                </tr>
              ) : (
                staffs.map((user, idx) => (
                  <tr
                    key={user.User_ID}
                    className={`transition-all duration-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-red-50`}
                  >
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-blue-700 hover:underline font-semibold cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          {user.User_Name}
                        </span>
                        <button
                          className="text-gray-500 hover:text-blue-600"
                          title="Xem chi tiết"
                          onClick={() => setSelectedUser(user)}
                          tabIndex={-1}
                        >
                          <AiOutlineEye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.Email}</td>
                    <td className="py-3 px-4 text-center">{user.User_Role === "staff" ? "Nhân viên" : "Thành viên"}</td>
                    <td className="py-3 px-4 text-center align-middle">
                      {user.isDelete === "1" || user.isDelete === true ? (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 w-28">
                          Đang mở khóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 w-28">
                          Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-row gap-2 justify-center items-center">
                        {user.isDelete === "1" || user.isDelete === true ? (
                          <button
                            onClick={() => handleBan(user.User_ID)}
                            className="px-4 py-1 bg-red-500 text-white text-xs rounded-full font-semibold hover:bg-red-600 transition-all duration-200 shadow-sm"
                          >
                            Khóa
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnban(user.User_ID)}
                            className="px-4 py-1 bg-[#D32F2F] text-white text-xs rounded-full font-semibold hover:bg-red-700 transition-all duration-200 shadow-sm"
                          >
                            Mở khóa
                          </button>
                        )}
                        {user.User_Role === "member" && (
                          <button
                            className={`px-4 py-1 text-xs rounded-full font-semibold transition-all duration-200
                              ${potentialUserIds.includes(user.User_ID)
                                ? "bg-gray-300 text-gray-400 cursor-not-allowed opacity-60"
                                : "bg-blue-500 text-white hover:bg-blue-700"}
                            `}
                            onClick={() => handleAddPotential(user.User_ID)}
                            disabled={potentialUserIds.includes(user.User_ID)}
                            style={{ minWidth: 110 }}
                          >
                            + Tiềm năng
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup xem chi tiết user */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[350px] max-w-full relative border-2 border-blue-300">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Thông tin người dùng</h3>
            <div className="space-y-2 text-gray-700">
              <div><b>Tên:</b> {selectedUser.User_Name}</div>
              <div><b>Email:</b> {selectedUser.Email}</div>
              <div><b>Số điện thoại:</b> {selectedUser.Phone || "—"}</div>
              <div>
                <b>Giới tính:</b> {selectedUser.Gender === "M" ? "Nam" : selectedUser.Gender === "F" ? "Nữ" : "—"}
              </div>
              <div>
                <b>Năm sinh:</b> {selectedUser.YOB
                  ? (() => {
                      const date = new Date(selectedUser.YOB);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()
                  : "—"}
              </div>
              <div><b>Vai trò:</b> {selectedUser.User_Role === "staff" ? "Nhân viên" : "Thành viên"}</div>
              <div><b>Loại máu:</b> {selectedUser.BloodGroup || "—"}</div>
               <div><b>Số lần hiến máu:</b> {selectedUser.Donation_Count ?? "—"}</div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setSelectedUser(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo staff */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 relative border-t-4 border-[#D32F2F]">
            <h3 className="text-xl font-bold text-[#D32F2F] mb-6 text-center">Tạo tài khoản staff</h3>
            <form className="space-y-4" onSubmit={handleCreateStaff}>
              <div>
                <label className="block font-medium mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Mật khẩu:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Xác nhận mật khẩu:</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${errors.confirm_password ? "border-red-500" : "border-gray-300"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Họ và tên:</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Nhóm máu:</label>
                <select
                  name="bloodType"
                  value={form.bloodType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${errors.bloodType ? "border-red-500" : "border-gray-300"}`}
                  required
                >
                  <option value="">-- Chọn nhóm máu --</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.bloodType && <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Ngày sinh:</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth || ""}
                  onChange={handleChange}
                  min={ageLimit.min}
                  max={ageLimit.max}
                  className={`w-full px-3 py-2 border rounded ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Độ tuổi: từ 18 đến 60</p>
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  disabled={creating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D32F2F] text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200"
                  disabled={creating}
                >
                  {creating ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 relative border-t-4 border-[#D32F2F]">
            <h3 className="text-xl font-bold text-[#D32F2F] mb-4 text-center">
              {actionType === "ban" ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản"}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {actionType === "ban"
                ? "Bạn có chắc chắn muốn khóa tài khoản này không?"
                : "Bạn có chắc chắn muốn mở khóa tài khoản này không?"}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 ${
                  actionType === "ban"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-[#D32F2F] hover:bg-red-700"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup danh sách người tiềm năng */}
      {showPotentialPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[700px] max-w-3xl w-full relative border-2 border-blue-300">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Danh sách người tiềm năng</h2>
            {potentialLoading ? (
              <div className="text-center py-8 text-lg text-gray-500">Đang tải...</div>
            ) : (
              <table className="min-w-full text-base mb-4 rounded-xl overflow-hidden shadow">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                    <th className="py-2 px-4 text-center">Tên</th>
                    <th className="py-2 px-4 text-center">Email</th>
                    <th className="py-2 px-4 text-center">Trạng thái</th>
                    <th className="py-2 px-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {potentialList.map((item) => (
                    <tr key={item.Potential_ID} className="hover:bg-blue-50 transition text-center">
                      <td className="font-semibold text-gray-800 py-2 px-4">{item.User_Name}</td>
                      <td className="py-2 px-4">{item.Email}</td>
                      <td className="py-2 px-4">
                        <span className={
                          item.Status === "Approved" ? "text-green-600 font-semibold" :
                          item.Status === "Rejected" ? "text-red-600 font-semibold" :
                          "text-gray-600"
                        }>
                          {item.Status === "Approved" && "Đang hoạt động"}
                          {item.Status === "Rejected" && "Đã bị vô hiệu hóa"}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {item.Status === "Approved" ? (
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={() => handleUpdatePotentialStatus(item.Potential_ID, "Rejected")}
                          >
                            Khóa
                          </button>
                        ) : (
                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-800"
                            onClick={() => handleUpdatePotentialStatus(item.Potential_ID, "Approved")}
                          >
                            Mở khóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setShowPotentialPopup(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup nhập Note khi thêm người tiềm năng */}
      {showNotePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[350px] max-w-full relative border-2 border-blue-300">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Nhập ghi chú cho người tiềm năng</h3>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Nhập ghi chú (Note)..."
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                onClick={() => { setShowNotePopup(false); setPendingPotentialUserId(null); }}
              >
                Hủy
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                onClick={handleConfirmAddPotential}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;