import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ name: "", email: "", message: "" });
    alert("Message sent!");
  };

  return (
    <div className="bg-[#fff6f6] min-h-screen py-10 px-2">
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#D32F2F] mb-10 tracking-tight drop-shadow-sm">
        Liên hệ với chúng tôi
      </h2>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-8">
        <div className="bg-white/90 rounded-3xl shadow-lg p-8 flex-1 min-w-0 border border-[#ffeaea] flex flex-col gap-7 justify-center">
          <div className="bg-white/80 rounded-xl px-5 py-3 shadow text-[#D32F2F] text-base md:text-lg font-medium text-left border border-[#ffeaea] mb-5">
            Nếu bạn có bất kỳ thắc mắc nào liên quan đến các hoạt động hiến máu
            tình nguyện, xin vui lòng liên hệ với chúng tôi qua địa chỉ email{" "}
            <span className="font-semibold underline">
              daivietblood@gmail.com
            </span>{" "}
            hoặc gửi thông tin cho chúng tôi qua liên hệ bên dưới.
          </div>
          <div>
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-[#D32F2F]">
              <FiMapPin className="text-2xl" /> Địa chỉ của chúng tôi
            </h3>
            <div className="flex items-start gap-2 text-gray-700 mb-2">
              <FiMapPin className="mt-1 text-[#D32F2F]" />
              <span>
                Lô E2a-8, Đường D1, Khu Công nghệ cao, Phường Tăng Nhơn Phú,
                TPHCM
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-[#D32F2F]">
              <FiMail className="text-2xl" /> Liên hệ
            </h3>
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <FiPhone className="text-[#D32F2F]" />
              <span>Hotline: 0123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FiMail className="text-[#D32F2F]" />
              <span>Email: daivietblood@gmail.com</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-[#D32F2F]">
              <FiClock className="text-2xl" /> Giờ làm việc
            </h3>

            <div className="text-gray-700 text-base ml-1">
              <div className="flex  w-full">
                <span>Thứ 2 – Thứ 6:</span> <span> 7h00 – 17h00</span>
              </div>
              <div className="flex w-full">
                <span>Thứ 7:</span> <span>7h00 – 12h00</span>
              </div>
              <div className="flex  w-full">
                <span>Chủ nhật:</span>{" "}
                <span className="text-[#D32F2F] font-semibold">Nghỉ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
