import { Outlet } from "react-router-dom";
import HeaderStaff from "../components/layout/headerStaff";
import FooterStaff from "../components/layout/FooterStaff";

const LayoutStaff = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderStaff />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterStaff />
    </div>
  );
};

export default LayoutStaff;