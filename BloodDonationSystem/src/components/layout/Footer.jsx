import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import GeminiChatbot from "../chatbot/Chatbot";

// Helper function để kiểm tra xem có phải trang auth không
const isAuthRoute = (pathname) => {
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/profile",
    "/auth/",
  ];
  return authRoutes.some((route) => pathname.includes(route));
};

const Footer = () => {
  const location = useLocation();
  const isAuthPage = isAuthRoute(location.pathname);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);

    // Lắng nghe custom event từ chatbot
    const handleChatbotToggle = (event) => {
      setChatbotOpen(event.detail.isOpen);
    };
    window.addEventListener("chatbotToggle", handleChatbotToggle);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener("chatbotToggle", handleChatbotToggle);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <footer className="bg-[#23272f] py-8 mt-8 border-t border-[#2d323c]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
          {/* Box: Về chúng tôi */}
          <div className="bg-[#23272f] rounded-lg p-6 flex flex-col items-center justify-center text-white min-h-[180px] h-full text-center">
            <span className="font-semibold text-xl mb-2">Về chúng tôi</span>
            <p className="mb-2 text-base leading-relaxed">
              DaiVietBlood là dự án kết nối cộng đồng hiến máu tình nguyện, lan
              tỏa yêu thương và trách nhiệm xã hội. Chúng tôi cam kết minh bạch,
              an toàn và tận tâm phục vụ cộng đồng.
            </p>
            <span className="italic text-sm text-[#D32F2F]">
              "Mỗi giọt máu trao đi – Kết nối triệu trái tim"
            </span>
          </div>
          {/* Box 1: Địa chỉ của chúng tôi */}
          <div className="bg-[#23272f] rounded-lg p-6 flex flex-col items-center justify-center text-white min-h-[180px] h-full text-center">
            <h3 className="font-semibold text-xl mb-2">
              Địa chỉ của chúng tôi
            </h3>
            <p className="text-base">Địa chỉ: Lô E2a-8, Đường D1, Khu Công nghệ cao, Phường Tăng Nhơn Phú,
                TPHCM</p>
            <p className="text-base">Hotline: 0123 456 789</p>
            <p className="text-base">Email: daivietblood@gmail.com</p>
          </div>
          {/* Box 2: Lịch khám */}
          <div className="bg-[#23272f] rounded-lg p-6 flex flex-col items-center justify-center text-white min-h-[180px] h-full text-center">
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="text-green-400 mr-2 text-lg" />
              <span className="font-semibold text-xl">Lịch khám</span>
            </div>
            <p className="text-base">Thứ 2 – Thứ 6: 6h30 – 17h00</p>
            <p className="text-base">Thứ 7: 7h30 – 17h00</p>
            <p className="text-base">Tổng đài Đặt lịch khám: 1900 96 96 70</p>
          </div>
          {/* Box 3: Lịch hiến máu tình nguyện */}
          <div className="bg-[#23272f] rounded-lg p-6 flex flex-col items-center justify-center text-white min-h-[180px] h-full text-center">
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="text-green-400 mr-2 text-lg" />
              <span className="font-semibold text-xl">
                Lịch hiến máu tình nguyện
              </span>
            </div>
            <p className="text-base">
              Hiến máu tình nguyện: 7h00 – 18h00 (Tất cả các ngày)
            </p>
            <p className="text-base">Tổng đài: 0976 99 00 66</p>
          </div>
        </div>
        <div className="w-max mx-auto mt-6 text-[#b0b6c3] font-medium text-base">
          © 2025 DaiVietBlood. Mọi quyền được bảo lưu.
        </div>

        {/* Floating Emergency Button - Ẩn ở trang auth */}
        {!isAuthPage && (
          <>
            {/* Nút Scroll to Top - chỉ hiện khi lướt xuống & chatbot đang đóng */}
            {showScrollTop && !chatbotOpen && (
              <button
                className="fixed-button-base scroll-to-top-btn bg-white/80 hover:bg-white text-[#D32F2F] shadow-lg flex items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-full transition-all border border-[#D32F2F] backdrop-blur-sm"
                style={{ backdropFilter: 'blur(4px)', fontWeight: 700 }}
                onClick={scrollToTop}
                aria-label="Lên đầu trang"
                title="Lên đầu trang"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            )}
            <div
              className="fixed-button-base emergency-btn
                       md:bottom-[80px] md:right-[15px] 
                       max-[480px]:bottom-[70px] max-[480px]:right-[10px]"
            >
              <a
                href="/emergency"
                className="flex items-center gap-2 bg-[#D32F2F] text-white px-5 py-3 rounded-full shadow-lg hover:bg-red-700 transition font-bold text-lg"
                title="🚨 Yêu cầu hiến máu khẩn cấp - Hỗ trợ tức thì!"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Hiến máu khẩn cấp
              </a>
            </div>
          </>
        )}

        {/* Floating Chatbot - Độc lập */}
        <GeminiChatbot />
      </footer>
    </>
  );
};

export default Footer;
