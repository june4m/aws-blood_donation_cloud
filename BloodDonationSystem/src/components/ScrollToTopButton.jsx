import React, { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      className="fixed-button-base scroll-to-top-btn bg-white/80 hover:bg-white text-[#D32F2F] shadow-lg flex items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-full transition-all border border-[#D32F2F] backdrop-blur-sm"
      style={{ backdropFilter: "blur(4px)", fontWeight: 700 }}
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
  );
};

export default ScrollToTopButton; 