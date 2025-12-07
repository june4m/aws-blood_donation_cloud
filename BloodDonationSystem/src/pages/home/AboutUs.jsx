const AboutUs = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen py-6 px-2">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6 md:p-8">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#D32F2F] mb-8">
          Giới Thiệu
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-[#D32F2F] mb-1">Sứ Mệnh</h3>
          <p className="text-gray-700 text-sm md:text-base">
            DaiVietBlood cam kết kết nối người hiến máu và người nhận máu, cung
            cấp giải pháp an toàn, minh bạch và nhân văn để cứu sống cộng đồng.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-[#D32F2F] mb-1">Tầm Nhìn</h3>
          <p className="text-gray-700 text-sm md:text-base">
            Trở thành nền tảng hiến máu hàng đầu Việt Nam, nơi mỗi giọt máu trao
            đi mang lại hy vọng cho bệnh nhân và gia đình họ.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-[#D32F2F] mb-1">Giá Trị Cốt Lõi</h3>
          <ul className="text-gray-700 text-sm md:text-base list-none pl-0 space-y-1">
            <li>
              <span className="font-bold text-black">Nhân ái:</span> Chia sẻ yêu
              thương và hỗ trợ những hoàn cảnh khó khăn.
            </li>
            <li>
              <span className="font-bold text-black">An toàn:</span> Tuân thủ
              nghiêm ngặt quy trình y tế để bảo vệ sức khỏe cộng đồng.
            </li>
            <li>
              <span className="font-bold text-black">Minh bạch:</span> Mọi thông
              tin và hoạt động đều được công khai, dễ dàng kiểm chứng.
            </li>
            <li>
              <span className="font-bold text-black">Đoàn kết:</span> Kết nối
              tình nguyện viên, tổ chức và cá nhân để lan tỏa những điều tốt
              đẹp.
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-[#D32F2F] mb-3">
            Đội Ngũ Chúng Tôi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#fafbfc] rounded-lg shadow p-4 flex flex-col items-center">
              <span className="font-bold text-[#D32F2F]">Nguyễn Thị A</span>
              <span className="text-gray-700 text-xs md:text-sm mt-1">
                Giám đốc điều hành
              </span>
            </div>
            <div className="bg-[#fafbfc] rounded-lg shadow p-4 flex flex-col items-center">
              <span className="font-bold text-[#D32F2F]">Trần Văn B</span>
              <span className="text-gray-700 text-xs md:text-sm mt-1">
                Trưởng phòng Y tế
              </span>
            </div>
            <div className="bg-[#fafbfc] rounded-lg shadow p-4 flex flex-col items-center">
              <span className="font-bold text-[#D32F2F]">Phạm Thị C</span>
              <span className="text-gray-700 text-xs md:text-sm mt-1">
                Quản lý Truyền thông
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[#D32F2F] mb-1">
            Đối Tác &amp; Cộng Tác
          </h3>
          <p className="text-gray-700 text-sm md:text-base mb-2">
            Chúng tôi tự hào hợp tác với các bệnh viện, tổ chức y tế và cộng
            đồng tình nguyện để mở rộng mạng lưới hiến máu:
          </p>
          <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base space-y-1">
            <li>Bệnh viện A</li>
            <li>Bệnh viện B</li>
            <li>Tổ chức Y tế C</li>
            <li>Câu lạc bộ Tình nguyện D</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
