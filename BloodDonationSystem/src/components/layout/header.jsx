import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import "./header.css";

/* -----------------------------------------------------------
 * 1. Tiện ích dựng sẵn class cho <NavLink>
 * --------------------------------------------------------- */
const navItemClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-md transition-colors duration-200 font-medium border-b-2 border-b-transparent whitespace-nowrap",
    isActive
      ? "border-b-red-500 text-[#D32F2F] bg-[#FDE8E8]"
      : "text-gray-700 hover:text-red-500 hover:border-b-red-500 hover:bg-gray-100/40",
  ].join(" ");

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("isLoggedIn");
  const { getCurrentUser, logout } = useApi();

  /* -----------------------------------------------------------
   * 2. Lấy thông tin người dùng khi đăng nhập
   * --------------------------------------------------------- */
  useEffect(() => {
    if (isLoggedIn) {
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isLoggedIn, getCurrentUser]);

  /* -----------------------------------------------------------
   * 3. Đóng dropdown khi click ra ngoài
   * --------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = user?.user_role;

  /* -----------------------------------------------------------
   * 4. JSX
   * --------------------------------------------------------- */
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo - Responsive với text ẩn trên mobile */}
          <NavLink
            to="/"
            className="font-bold flex items-center text-[#D32F2F] hover:text-[#B71C1C] transition-colors duration-200 flex-shrink-0"
          >
            <img
              src="/image.png"
              alt="DaiVietBlood"
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
            />
            {/* Text logo ẩn trên mobile, hiện từ xs trở lên */}
            <span className="logo-text ml-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-black truncate">
              DaiVietBlood
            </span>
          </NavLink>

          {/* ----- NAVBAR DESKTOP (căn giữa) ----- */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex xl:gap-x-8 lg:gap-x-6 md:gap-x-4 items-center xl:text-base lg:text-sm md:text-xs">
              <li>
                <NavLink to="/" end className={navItemClass}>
                  Trang chủ
                </NavLink>
              </li>
              <li>
                <NavLink to="/blood-type-info" className={navItemClass}>
                  <span className="nav-text-full">Thông tin nhóm máu</span>
                  <span className="nav-text-short">Nhóm máu</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/news" className={navItemClass}>
                  Bài viết
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={navItemClass}>
                  Liên hệ
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* ----- AVATAR / AUTH DESKTOP ----- */}
          <div className="hidden md:flex items-center gap-2 text-sm lg:text-base">
            {isLoggedIn && role === "member" ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="w-10 h-10 rounded-full bg-[#D32F2F] text-white flex items-center justify-center hover:bg-[#B71C1C] transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <ul className="py-2 text-sm">
                      <li>
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => setDropdown(false)}
                        >
                          Cập nhật trang cá nhân
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#D32F2F] transition-colors"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink to="/login" className={navItemClass}>
                  Đăng nhập
                </NavLink>
                <div className="bg-[#D32F2F] text-white rounded-md px-3 py-2 hover:bg-[#B71C1C] transition-colors">
                  <NavLink to="/register" className="text-white">
                    Đăng ký
                  </NavLink>
                </div>
              </>
            )}
          </div>

          {/* ----- BURGER ICON (MOBILE) ----- */}
          <button
            className={`hamburger-btn md:hidden text-[#D32F2F] flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
              isOpen ? "active" : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Mở menu"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* ----- MENU MOBILE ----- */}
        {isOpen && (
          <nav className="mobile-menu md:hidden bg-white border-t">
            <ul className="flex flex-col px-4 py-3 gap-y-2 text-[15px]">
              {[
                { to: "/", label: "Trang chủ", exact: true },
                { to: "/blood-type-info", label: "Thông tin nhóm máu" },
                { to: "/faq", label: "FAQ" },
                { to: "/news", label: "Tin tức" },
                { to: "/contact", label: "Liên hệ" },
              ].map(({ to, label, exact }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={exact}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      [
                        "mobile-nav-item block rounded-md px-3 py-2 font-medium transition-colors duration-150",
                        isActive
                          ? "bg-[#D32F2F]/10 text-[#D32F2F] border-b-2 border-b-red-500"
                          : "hover:bg-gray-100/40",
                      ].join(" ")
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              {/* Auth mobile */}
              {isLoggedIn ? (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 font-medium hover:bg-gray-100/40"
                    >
                      Cập nhật trang cá nhân
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left rounded-md px-3 py-2 font-medium text-[#D32F2F] hover:bg-gray-100/40"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 font-medium hover:bg-gray-100/40"
                    >
                      Đăng nhập
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 font-medium hover:bg-gray-100/40"
                    >
                      Đăng kí
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
