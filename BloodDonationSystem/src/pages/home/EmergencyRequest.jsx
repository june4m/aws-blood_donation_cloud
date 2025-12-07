import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";

const EmergencyRequest = () => {
  const { addEmergencyRequest, getCurrentUser, loading } = useApi();
  
  const [form, setForm] = useState({
    bloodType: "",
    volume: "",
    neededDate: "",
    reason_Need : "" // Thêm trường này
  });
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  // Lấy thông tin user hiện tại khi component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      
      // Chỉ gọi API khi đã đăng nhập
      if (!isLoggedIn) {
        return;
      }

      try {
        const userResponse = await getCurrentUser();
        console.log('Current user:', userResponse);
        if (userResponse.status) {
          setUser(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchCurrentUser();
  }, [getCurrentUser]);

  // Validate date (must be future date)
  const isValidDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!form.bloodType) {
      newErrors.bloodType = "Vui lòng chọn loại máu.";
    }
    
    if (!form.volume) {
      newErrors.volume = "Lượng máu là bắt buộc.";
    } else if (isNaN(form.volume) || Number(form.volume) <= 0) {
      newErrors.volume = "Lượng máu phải là số dương.";
    } else if (Number(form.volume) > 5000) {
      newErrors.volume = "Lượng máu không được vượt quá 5000ml.";
    }
    
    if (!form.neededDate) {
      newErrors.neededDate = "Ngày cần máu là bắt buộc.";
    } else if (!isValidDate(form.neededDate)) {
      newErrors.neededDate = "Ngày cần máu phải là ngày trong tương lai.";
    }
    
    if (!form.reason_Need ) {
      newErrors.reason_Need  = "Vui lòng nhập lý do cần máu.";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      // Kiểm tra địa chỉ
     if (!user?.address) {
    toast.warning("Bạn cần cập nhật địa chỉ trước khi gửi yêu cầu!");
    return;
  }
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Map bloodType string to BloodType_ID
      const bloodTypeMapping = {
        "A+": "BT001", "A-": "BT002", "B+": "BT003", "B-": "BT004", 
        "AB+": "BT005", "AB-": "BT006", "O+": "BT007", "O-": "BT008"
      };

      // Chuẩn bị dữ liệu theo format API backend với thông tin từ user
      const requestData = {
        BloodType_ID: bloodTypeMapping[form.bloodType],
        Volume: parseInt(form.volume),
        Needed_Before: form.neededDate,
        reason_Need: form.reason_Need  // Truyền lên BE
      };

      // Gọi API thông qua hook
      const response = await addEmergencyRequest(requestData);

      if (response.success) {
        toast.success("Yêu cầu hiến máu khẩn cấp đã được gửi thành công!", {
          autoClose: 3000,
        });

        // Reset form
        setForm({
          bloodType: "",
          volume: "",
          neededDate: "",
          reason_Need: ""
        });
        setErrors({});
      } else {
        throw new Error('Gửi yêu cầu thất bại');
      }
    } catch (error) {
      console.error('Error submitting emergency request:', error);
      toast.error(error.message, {
        autoClose: 3000,
      });
    }
  };

  // Lấy ngày hiện tại để set min date
  const today = new Date();
  const minDate = new Date(today.getTime() + 24 * 60 * 60 * 1000) // Tối thiểu từ ngày mai
    .toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-2 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#D32F2F] text-center mb-6">
          🚨 Yêu cầu hiến máu khẩn cấp
        </h2>
        
        {/* Hiển thị thông tin người yêu cầu */}
        {user && ( // 🔄 Đổi từ currentUser thành user
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-blue-800 font-medium">👤 Thông tin người yêu cầu</h4>
                <p className="text-sm text-blue-700 mt-1">
                  <strong>Tên:</strong> {user.user_name || "Chưa cập nhật"} 
                </p>
                <p className="text-sm text-blue-700">
                  <strong>SĐT:</strong> {user.phone || "Chưa cập nhật"} 
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Email:</strong> {user.email || "Chưa cập nhật"} 
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"} 
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Lưu ý:</strong> Yêu cầu này sẽ được gửi tới đội ngũ y tế và những người hiến máu phù hợp trong hệ thống.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          {/* Loại máu */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              <span className="text-red-500">*</span> Loại máu cần thiết
            </label>
            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F] text-lg ${
                errors.bloodType ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="">-- Chọn loại máu cần thiết --</option>
              <option value="A+">🅰️ A+</option>
              <option value="A-">🅰️ A-</option>
              <option value="B+">🅱️ B+</option>
              <option value="B-">🅱️ B-</option>
              <option value="AB+">🆎 AB+</option>
              <option value="AB-">🆎 AB-</option>
              <option value="O+">⭕ O+</option>
              <option value="O-">⭕ O-</option>
            </select>
            {errors.bloodType && (
              <p className="text-red-500 text-sm mt-2">{errors.bloodType}</p>
            )}
          </div>

          {/* Lượng máu */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              <span className="text-red-500">*</span> Lượng máu cần thiết (ml)
            </label>
            <input
              type="number"
              name="volume"
              value={form.volume}
              onChange={handleChange}
              placeholder="Ví dụ: 500"
              min="1"
              max="5000"
              step="1"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F] text-lg ${
                errors.volume ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <div className="mt-2 text-sm text-gray-600">
              <p>💡 <strong>Lưu ý:</strong> Lượng máu thông thường mỗi người hiến: 250-500ml</p>
              <p>🩸 <strong>Khuyến nghị:</strong> 250ml, 350ml, 450ml hoặc 500ml</p>
            </div>
            {errors.volume && (
              <p className="text-red-500 text-sm mt-2">{errors.volume}</p>
            )}
          </div>

          {/* Ngày cần máu */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              <span className="text-red-500">*</span> Ngày cần máu
            </label>
            <input
              type="date"
              name="neededDate"
              value={form.neededDate}
              onChange={handleChange}
              min={minDate}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F] text-lg ${
                errors.neededDate ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              ⏰ <strong>Lưu ý:</strong> Chọn ngày cần có máu (tối thiểu từ ngày mai)
            </p>
            {errors.neededDate && (
              <p className="text-red-500 text-sm mt-2">{errors.neededDate}</p>
            )}
          </div>

          {/* Lý do cần máu */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              <span className="text-red-500">*</span> Lý do cần máu
            </label>
            <input
              type="text"
              name="reason_Need"
              value={form.reason_Need}
              onChange={handleChange}
              placeholder="Nhập lý do cần máu..."
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F] text-lg ${
                errors.reason_Need  ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.reason_Need  && (
              <p className="text-red-500 text-sm mt-2">{errors.reason_Need }</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white px-6 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center ${
              loading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#D32F2F] hover:bg-[#b71c1c] hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi yêu cầu...
              </>
            ) : (
              <>
                🚨 Gửi yêu cầu khẩn cấp
              </>
            )}
          </button>
        </form>

        {/* Thông tin hỗ trợ */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
            📞 Cần hỗ trợ khẩn cấp?
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>Hotline 24/7:</strong> <span className="text-lg font-bold">0976 99 00 66</span></p>
            <p><strong>Email:</strong> daivietblood@gmail.com</p>
            <p className="text-xs text-blue-600 italic">
              * Liên hệ trực tiếp nếu tình huống cực kỳ khẩn cấp
            </p>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-green-800">Hỗ trợ khẩn cấp</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">5-15 phút</div>
            <div className="text-sm text-red-800">Thời gian phản hồi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequest;
