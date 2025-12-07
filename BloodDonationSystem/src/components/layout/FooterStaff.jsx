import { Link } from "react-router-dom";

const FooterStaff = () => {
  return (
    <>
      <footer className="bg-[#333333]">
        <div className="container mx-auto h-full ">
            <div className="font-[500] text-white mt-[20px]  lg:text-[19px] md:text-[15px] text-[13px] text-center">
              <p className="font-sans text-lg">
                "Mỗi giọt máu trao đi – kết nối triệu trái tim, cứu sống nhiều
                cuộc đời."
              </p>
            </div>
          
          <div className="w-max mx-auto mt-[40px] text-white font-[600] text-[20px]">
            © 2025 DaiVietBlood. Mọi quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterStaff;
