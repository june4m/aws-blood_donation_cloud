import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useApi from "../../hooks/useApi";

// nav item classes for staff: maintain border and font to prevent shift
const staffNavItemClass = ({ isActive }) =>
  [
    "px-4 py-2 rounded-md transition-colors duration-200 font-medium border-b-2 border-b-transparent whitespace-nowrap min-w-[150px] text-center",
    isActive
      ? "border-b-red-500 text-[#D32F2F] bg-[#FDE8E8]"
      : "text-black hover:text-red-500 hover:border-b-red-500 hover:bg-gray-100/40",
  ].join(" ");

const HeaderStaff = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const isLoggedIn = !!localStorage.getItem("isLoggedIn");
  const dropdownRef = useRef(null);
  const { getCurrentUser, logout } = useApi();

  // fetch user data
  useEffect(() => {
    if (isLoggedIn) {
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isLoggedIn, getCurrentUser]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = user?.user_role;

  return (
    <>
      {/* top banner */}
      <div className="w-full bg-[#E57373]">
        <div className="container mx-auto h-[30px] flex justify-center items-center text-[12px] sm:text-[14px] md:text-[16px] text-white">
          Quản lý nhân viên Đại việt Blood
        </div>
      </div>

      <header className="w-full bg-white shadow">
        <div className="mx-auto max-w-full">
          <div className="flex items-center px-[20px] py-[10px]">
            <NavLink
              to="/dashboard"
              className="font-[900] text-[#D32F2F] xl:text-[28px] lg:text-[26px] md:text-[24px] text-[22px] whitespace-nowrap mr-8"
            >
              DaiVietBlood
            </NavLink>
            <div className="flex flex-1 items-center justify-center">
              <nav className="hidden md:flex">
                <ul className="flex gap-x-[18px] xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] items-center">
                  <li>
                    <NavLink to="/dashboard" className={staffNavItemClass + ' whitespace-nowrap'}>
                      Báo cáo thống kê
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/confirm-blood" className={staffNavItemClass + ' whitespace-nowrap'}>
                      Quản lý đăng ký hiến máu
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/manage-emergency" className={staffNavItemClass + ' whitespace-nowrap'}>
                      Yêu cầu khẩn cấp
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/edit-blood" className={staffNavItemClass + ' whitespace-nowrap'}>
                      Quản lý danh sách hiến máu
                    </NavLink>
                  </li>
                </ul>
              </nav>
              {/* Avatar staff luôn sát menu */}
              <div className="hidden md:flex items-center ml-4">
                {isLoggedIn && role === "staff" ? (
                  <div className="relative flex items-center">
                    <button
                      onClick={() => setDropdown(!dropdown)}
                      className="w-9 h-9 rounded-full bg-[#D32F2F] text-white flex items-center justify-center font-bold text-lg"
                    >
                      ST
                    </button>
                    {dropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                        <ul className="py-2 text-[18px]">
                          <li>
                            <NavLink
                              to="/staff/profile"
                              className="block px-4 py-2 hover:bg-gray-100"
                              onClick={() => setDropdown(false)}
                            >
                              Cập nhật trang cá nhân
                            </NavLink>
                          </li>
                          <li>
                            <button
                              onClick={logout}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#D32F2F]"
                            >
                              Đăng xuất
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink to="/login" className="hover:underline ml-2">
                    Đăng nhập
                  </NavLink>
                )}
              </div>
            </div>
            {/* Mobile burger */}
            <button
              className="md:hidden text-[#D32F2F] text-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <nav className="md:hidden bg-white border-t">
              <ul className="flex flex-col px-[26px] py-[12px] gap-y-2 text-[14px]">
                {[
                  { to: "/dashboard", label: "Báo cáo thống kê", exact: true },
                  { to: "/confirm-blood", label: "Xác nhận nhóm máu" },
                  { to: "/manage-emergency", label: "Yêu cầu khẩn cấp" },
                  { to: "/edit-blood", label: "Quản lý danh sách hiến máu" },
                ].map(({ to, label, exact }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={exact}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        [
                          "block rounded-md px-3 py-2 font-medium border-b-2 border-b-transparent",
                          isActive
                            ? "border-b-red-500 text-[#D32F2F] bg-[#FDE8E8]"
                            : "hover:bg-gray-100/40",
                        ].join(" ")
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
                {isLoggedIn ? (
                  <>
                    <li>
                      <NavLink
                        to="/staff/profile"
                        className="block rounded-md px-3 py-2 hover:bg-gray-100/40"
                        onClick={() => setIsOpen(false)}
                      >
                        Cập nhật trang cá nhân
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                        className="block w-full text-left rounded-md px-3 py-2 text-[#D32F2F] hover:bg-gray-100/40"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      className="block rounded-md px-3 py-2 hover:bg-gray-100/40"
                      onClick={() => setIsOpen(false)}
                    >
                      Đăng nhập
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderStaff;
