import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";

export const ConfirmEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, confirmEmail } = useApi();
  
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Vui lòng nhập email", { position: "top-center" });
      return;
    }
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã xác thực", { position: "top-center" });
      return;
    }

    try {
      await confirmEmail(email, code);
      toast.success("Xác thực email thành công! Vui lòng đăng nhập.", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message || "Xác thực thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/image/bloodActivity.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 via-white/60 to-red-50/70"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100/50">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D32F2F] to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#D32F2F]">Xác Thực Email</h2>
            <p className="text-gray-700 mt-2">
              Nhập mã xác thực đã được gửi đến email của bạn
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#555555] font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent bg-white/90 shadow-md"
                required
              />
            </div>

            <div>
              <label className="block text-[#555555] font-medium mb-1">Mã xác thực:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã 6 số"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent bg-white/90 shadow-md text-center text-2xl tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#D32F2F] to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 shadow-lg"
              disabled={loading}
            >
              {loading ? "Đang xác thực..." : "Xác thực"}
            </button>
          </form>

          <div className="flex justify-center mt-6 pt-6 border-t border-gray-100">
            <Link
              to="/login"
              className="text-[#D32F2F] hover:text-red-600 font-medium hover:underline"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
