import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validatePasswords = (password, confirmPassword) => {
  if (!password) return "Mật khẩu mới là bắt buộc";
  if (!passwordRegex.test(password))
    return "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
  if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp";
  return "";
};

export const PasswordEye = ({ show, setShow }) => (
  <button
    type="button"
    onClick={() => setShow((v) => !v)}
    className="absolute inset-y-0 right-0 flex items-center pr-3"
    tabIndex={-1}
  >
    {show ? (
      <AiOutlineEyeInvisible className="text-gray-500 hover:text-gray-700 w-5 h-5" />
    ) : (
      <AiOutlineEye className="text-gray-500 hover:text-gray-700 w-5 h-5" />
    )}
  </button>
);

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, register } = useApi();
  const navigate = useNavigate();

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

  // Validate độ tuổi
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
    if (actualAge < 18) {
      return "Bạn phải từ 18 tuổi trở lên để đăng ký hiến máu";
    }
    if (actualAge > 60) {
      return "Độ tuổi hiến máu tối đa là 60 tuổi";
    }
    return "";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Họ và tên là bắt buộc";
    if (!form.email.trim()) newErrors.email = "Email là bắt buộc";
    if (!form.password.trim()) newErrors.password = "Mật khẩu là bắt buộc";
    if (!form.date_of_birth) newErrors.date_of_birth = "Ngày sinh là bắt buộc";
    const passwordError = validatePasswords(
      form.password,
      form.confirm_password
    );
    if (passwordError) newErrors.confirm_password = passwordError;
    const ageError = validateAge(form.date_of_birth);
    if (ageError) newErrors.date_of_birth = ageError;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await register({
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        name: form.name,
        date_of_birth: form.date_of_birth,
      });
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background image for entire page - cute blood donation illustration */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: "url('/image/bloodActivity.png')",
        }}
      ></div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 via-white/60 to-red-50/70"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100/50 ring-1 ring-white/40">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D32F2F] to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ring-4 ring-white/30">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#D32F2F] drop-shadow-sm">
              Đăng Ký
            </h2>
            <p className="text-gray-700 mt-2 font-medium">
              Tham gia cộng đồng hiến máu tình nguyện!
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#555555] font-medium mb-1">
                Họ và tên:
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên của bạn"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-md focus:bg-white shadow-md ${
                    errors.name ? "border-red-500" : "border-gray-200/60"
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#555555] font-medium mb-1">
                Email:
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-md focus:bg-white shadow-md ${
                    errors.email ? "border-red-500" : "border-gray-200/60"
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#555555] font-medium mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu của bạn"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-md focus:bg-white shadow-md ${
                    errors.password ? "border-red-500" : "border-gray-200/60"
                  }`}
                  required
                />
                <PasswordEye
                  show={showPassword}
                  setShow={setShowPassword}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#555555] font-medium mb-1">
                Xác nhận mật khẩu:
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu của bạn"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-md focus:bg-white shadow-md ${
                    errors.confirm_password
                      ? "border-red-500"
                      : "border-gray-200/60"
                  }`}
                  required
                />
                <PasswordEye
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                />
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.confirm_password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#555555] font-medium mb-1">
                Ngày sinh:
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  min={ageLimit.min}
                  max={ageLimit.max}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-md focus:bg-white shadow-md ${
                    errors.date_of_birth
                      ? "border-red-500"
                      : "border-gray-200/60"
                  }`}
                  required
                />
              </div>
              <p className="text-gray-500 text-xs mt-1 flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Độ tuổi hiến máu: từ 18 đến 60 tuổi
              </p>
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.date_of_birth}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#D32F2F] to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-red-200/50 active:translate-y-0 active:shadow-inner"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang đăng ký...
                  </div>
                ) : (
                  "Tạo tài khoản"
                )}
              </button>
            </div>
          </form>
          <div className="flex justify-center mt-6 pt-6 border-t border-gray-100">
            <span className="text-gray-600 mr-2">Đã có tài khoản?</span>
            <Link
              to="/login"
              className="text-[#D32F2F] hover:text-red-600 font-medium hover:underline transition-colors duration-200"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
