import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { validatePasswords, PasswordEye } from "./Register";

const ResetPasswordPage = () => {
  const [form, setForm] = useState({
    otp: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.otp.trim()) newErrors.otp = "OTP là bắt buộc";
    const passwordError = validatePasswords(form.new_password, form.confirm_password);
    if (passwordError) {
      if (passwordError === "Mật khẩu xác nhận không khớp") newErrors.confirm_password = passwordError;
      else newErrors.new_password = passwordError;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await resetPassword({
        otp: form.otp,
        newPassword: form.new_password,
        confirmPassword: form.confirm_password,
      });
      toast.success("Đổi mật khẩu thành công!", { position: "top-center", autoClose: 2000 });
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Đổi mật khẩu thất bại", { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: "url('/image/bloodActivity.png')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 via-white/60 to-red-50/70"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100/50 ring-1 ring-white/40">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#D32F2F]">Đặt lại mật khẩu</h2>
            <p className="text-gray-700 mt-2 font-medium">Nhập OTP và mật khẩu mới</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium mb-1">OTP:</label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl ${errors.otp ? "border-red-500" : "border-gray-200/60"}`}
                required
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Mật khẩu mới:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl ${errors.new_password ? "border-red-500" : "border-gray-200/60"}`}
                  required
                />
                <PasswordEye show={showPassword} setShow={setShowPassword} />
              </div>
              {errors.new_password && <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Xác nhận mật khẩu:</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl ${errors.confirm_password ? "border-red-500" : "border-gray-200/60"}`}
                  required
                />
                <PasswordEye show={showConfirmPassword} setShow={setShowConfirmPassword} />
              </div>
              {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#D32F2F] to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-red-600 hover:to-red-700"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
