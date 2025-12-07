import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

export const FAQPage = () => {
  /* ---------- 1. DANH SÁCH FAQ HOÀN CHỈNH ---------- */
  const [faqList] = useState([
    /* ── I. ĐĂNG KÝ & XÁC NHẬN NHÓM MÁU ─────────────────────────── */
    {
      id: 1,
      question: "Làm cách nào để đăng ký tài khoản trên hệ thống?",
      answer:
        "Bạn nhấp vào nút “Đăng ký” ở góc trên bên phải, điền họ tên, email, số điện thoại, khai báo nhóm máu rồi bấm “Đăng ký”.",
    },
    {
      id: 2,
      question: "Chưa biết nhóm máu có đăng ký hiến được không?",
      answer:
        "Được. Chọn “Đăng kí hiến máu”, sau đó ra cơ sở xét nghiệm miễn phí và gửi kết quả cho nhân viên y tế xác minh.",
    },
    {
      id: 3,
      question: "Tôi có tự cập nhật nhóm máu của mình được không?",
      answer:
        "Không. Chỉ nhân viên y tế được phép nhập & xác nhận nhóm máu để bảo đảm độ chính xác.",
    },
    {
      id: 4,
      question: "Mất bao lâu để staff xác nhận nhóm máu?",
      answer:
        "Thường 24 – 48 giờ sau khi phòng xét nghiệm trả kết quả. Ứng dụng sẽ thông báo khi hoàn tất.",
    },

    /* ── II. HIẾN MÁU CƠ BẢN ────────────────────────────────────── */
    {
      id: 5,
      question: "Hiến máu có đau không?",
      answer:
        "Bạn chỉ cảm thấy hơi nhói khi kim chích vào da, tương tự lấy máu xét nghiệm.",
    },
    {
      id: 6,
      question: "Mỗi lần hiến lấy bao nhiêu máu?",
      answer: "Khoảng 250 – 450 ml tùy cân nặng người hiến.",
    },
    {
      id: 7,
      question: "Bao lâu tôi mới được hiến máu lại?",
      answer: "Nam: 3 tháng – Nữ: 4 tháng kể từ lần hiến trước.",
    },
    {
      id: 8,
      question: "Cần chuẩn bị gì trước khi hiến máu?",
      answer: "Ngủ đủ, ăn sáng nhẹ, không rượu bia, mang CMND/CCCD.",
    },
    {
      id: 9,
      question: "Tôi có phải xét nghiệm gì trước khi hiến không?",
      answer:
        "Tại điểm hiến, bác sĩ đo huyết áp, mạch, cân nặng và xét nghiệm nhanh để bảo đảm đủ điều kiện.",
    },
    {
      id: 10,
      question: "Sau khi hiến máu tôi nên làm gì?",
      answer:
        "Nghỉ 10 – 15 phút, uống nước, ăn nhẹ, tránh vận động mạnh trong 24 giờ.",
    },
    {
      id: 11,
      question: "Có thể hiến máu khi đang cảm nhẹ không?",
      answer: "Không. Bạn chỉ hiến khi sức khỏe hoàn toàn bình thường.",
    },
    {
      id: 12,
      question: "Hiến máu có ảnh hưởng sức khỏe lâu dài không?",
      answer:
        "Cơ thể tái tạo lượng máu đã hiến trong vài tuần; không gây hại nếu tuân thủ đúng khoảng cách hiến.",
    },
    {
      id: 13,
      question: "Nếu tôi sợ kim tiêm thì làm sao?",
      answer:
        "Hít thở sâu, nhắm mắt, nhờ nhân viên y tế hỗ trợ; quy trình diễn ra nhanh & an toàn.",
    },

    /* ── III. CHỨC NĂNG ỨNG DỤNG ───────────────────────────────── */
    {
      id: 14,
      question: "Khách có cần tài khoản để đặt lịch hiến không?",
      answer:
        "Khách có thể xem thông tin, nhưng cần đăng ký/đăng nhập để đặt lịch và lưu lịch sử.",
    },
    {
      id: 15,
      question: "Cách đặt lịch hiến máu trực tuyến?",
      answer:
        "Đăng nhập → “Đăng ký hiến máu” → chọn loại hiến, địa điểm, thời gian → xác nhận. Hệ thống gửi email/SMS kèm mã QR.",
    },
    {
      id: 16,
      question: "Gửi yêu cầu máu khẩn cấp thế nào?",
      answer:
        "Vào “Yêu cầu khẩn cấp”, nhập nhóm máu, số lượng. Hệ thống thông báo cho thành viên phù hợp gần nhất.",
    },
    {
      id: 17,
      question: "Ứng dụng có nhắc khi đủ thời gian hiến lại không?",
      answer:
        "Có. Sau mỗi lần hiến, hệ thống tự ghi nhận và nhắc khi đủ 3 tháng (nam) hoặc 4 tháng (nữ).",
    },
    {
      id: 18,
      question: "Tôi xem lịch sử hiến máu và tải chứng nhận ở đâu?",
      answer:
        "Đăng nhập → “Lịch sử hiến máu”. Xem chi tiết và tải chứng nhận PDF.",
    },
    {
      id: 19,
      question: "Thay đổi ngôn ngữ giao diện thế nào?",
      answer: "Vào Cài đặt → “Ngôn ngữ” → chọn Tiếng Việt hoặc English.",
    },

    /* ── IV. KIẾN THỨC NHÓM MÁU ────────────────────────────────── */
    {
      id: 20,
      question: "Có bao nhiêu nhóm máu cơ bản?",
      answer:
        "Hệ ABO (A, B, AB, O) kết hợp Rh ± → 8 nhóm: A+, A−, B+, B−, AB+, AB−, O+, O−.",
    },
    {
      id: 21,
      question: 'Nhóm O− có phải "người cho máu toàn cầu"?',
      answer:
        "Đúng. O− không mang kháng nguyên A/B và Rh nên truyền được cho hầu hết người nhận trong cấp cứu.",
    },
    {
      id: 22,
      question: 'Ai là "người nhận máu toàn cầu"?',
      answer: "Người nhóm AB+ vì có cả kháng nguyên A, B và Rh+.",
    },
    {
      id: 23,
      question: "Tôi không biết nhóm máu của mình, phải làm sao?",
      answer:
        "Bạn có thể xét nghiệm tại bệnh viện hoặc khi hiến; kết quả sẽ được cập nhật vào hồ sơ.",
    },
    {
      id: 24,
      question: "Nhóm máu Rh− ở Việt Nam hiếm thế nào?",
      answer:
        "Chỉ ~0,04 – 0,07 % dân số mang Rh−, nên ngân hàng máu Rh− luôn cần bổ sung.",
    },
    {
      id: 25,
      question:
        "Có thể hiến riêng hồng cầu, tiểu cầu hay huyết tương tùy nhóm máu không?",
      answer:
        "Có. Bác sĩ sẽ chỉ định hiến thành phần phù hợp nhóm máu và nhu cầu điều trị.",
    },
  ]);

  /* ---------- 2. PHÂN TRANG ---------- */
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [openFAQs, setOpenFAQs] = useState([]);

  /* ---------- 3. REF LƯU DOM & CUỘN ---------- */
  const itemRefs = useRef({});
  const prevTopRef = useRef(null);
  const toggledIdRef = useRef(null);

  /* ---------- 4. CUỘN LÊN KHI MOUNT ---------- */
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  /* ---------- 5. CẮT TRANG ---------- */
  const paginatedFAQs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return faqList.slice(start, start + itemsPerPage);
  }, [currentPage, faqList]);

  const placeholderCount = itemsPerPage - paginatedFAQs.length;
  const totalPages = Math.ceil(faqList.length / itemsPerPage);

  /* ---------- 6. GIỮ NGUYÊN SCROLL ---------- */
  useLayoutEffect(() => {
    if (prevTopRef.current == null || toggledIdRef.current == null) return;

    const newTop =
      itemRefs.current[toggledIdRef.current]?.getBoundingClientRect().top ?? 0;
    const diff = newTop - prevTopRef.current;

    window.scrollBy({ top: diff, left: 0, behavior: "instant" });

    prevTopRef.current = null;
    toggledIdRef.current = null;
  }, [openFAQs]);

  /* ---------- 7. HÀM XỬ LÝ ---------- */
  const toggleFAQ = (id) => {
    const el = itemRefs.current[id];
    if (el) {
      prevTopRef.current = el.getBoundingClientRect().top;
      toggledIdRef.current = id;
    }

    setOpenFAQs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setOpenFAQs([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- 8. RENDER ---------- */
  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-center text-2xl pb-8 text-[#D32F2F]">
        Câu Hỏi Thường Gặp
      </h1>

      {/* DANH SÁCH FAQ */}
      <div className="max-w-4xl mx-auto space-y-4">
        {paginatedFAQs.map((item) => (
          <div
            key={item.id}
            className="w-full border rounded-lg shadow-sm"
            ref={(el) => (itemRefs.current[item.id] = el)}
          >
            {/* CÂU HỎI */}
            <button
              className="w-full flex justify-between p-4 bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleFAQ(item.id)}
            >
              <h2 className="font-semibold">{item.question}</h2>
              <AiFillCaretDown
                className={`transform transition ${
                  openFAQs.includes(item.id) ? "rotate-180" : ""
                } text-gray-400`}
              />
            </button>

            {/* CÂU TRẢ LỜI – scaleY mượt */}
            <AnimatePresence initial={false}>
              {openFAQs.includes(item.id) && (
                <motion.div
                  key="content"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="origin-top overflow-hidden"
                >
                  <div className="p-4">
                    <p className="text-black">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* PLACEHOLDER giữ chiều cao */}
        {Array.from({ length: placeholderCount }).map((_, idx) => (
          <div
            key={`placeholder-${idx}`}
            className="border rounded-lg shadow-sm h-[64px] invisible"
          />
        ))}
      </div>

      {/* THANH PHÂN TRANG */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((n) =>
            totalPages <= 5
              ? true
              : Math.abs(n - currentPage) <= 2 || n === 1 || n === totalPages
          )
          .map((n, idx, arr) => {
            const isEllipsis = idx > 0 && n - arr[idx - 1] > 1;
            return (
              <span key={n} className="flex">
                {isEllipsis && <span className="px-2">…</span>}
                <button
                  onClick={() => goToPage(n)}
                  className={`px-3 py-1 border rounded ${
                    n === currentPage
                      ? "bg-[#D32F2F] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              </span>
            );
          })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    </div>
  );
};
