import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useApi();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await forgotPassword(email);
      toast.success("Gửi yêu cầu thành công! Vui lòng kiểm tra email.", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/reset-password");
    } catch (error) {
      toast.error(error.message || "Gửi yêu cầu thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setSending(false);
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
          <div className="text-center mb-8">
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#D32F2F] drop-shadow-sm">
              Quên mật khẩu
            </h2>
            <p className="text-gray-700 mt-2 font-medium">
              Đừng lo, chúng tôi sẽ giúp bạn khôi phục!
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[#555555] font-medium">
                Nhập email đã đăng ký
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full px-4 py-3 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-md focus:bg-white shadow-md"
                  required
                  disabled={sending}
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
              <p className="text-sm text-gray-500 mt-2">
                Chúng tôi sẽ gửi link khôi phục mật khẩu đến email này
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#D32F2F] to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-red-200/50 active:translate-y-0 active:shadow-inner"
              disabled={sending}
            >
              {sending ? "Đang gửi..." : "Gửi yêu cầu khôi phục"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-[#D32F2F] hover:text-red-600 font-medium hover:underline transition-all duration-200 group"
            >
              <GoArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Quay lại trang đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
