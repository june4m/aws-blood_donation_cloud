import { Outlet } from "react-router-dom";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";


const LayoutDeFault = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutDeFault;
