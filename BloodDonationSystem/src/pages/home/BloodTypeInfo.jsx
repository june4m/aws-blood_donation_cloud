import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VanillaTilt from "vanilla-tilt";
import BloodCompatibilityDiagram from "../../components/custom/BloodCompatibilityDiagram";

const BloodTypeInfo = () => {
  const [withRh, setWithRh] = useState(false); // State cho bảng
  const [diagramWithRh, setDiagramWithRh] = useState(false); // State cho sơ đồ
  const [showDonation, setShowDonation] = useState(true); // State cho chế độ hiến/nhận (true = hiến, false = nhận)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    // Scroll to top when component first mounts
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []); // Empty dependency array - only runs once on mount

  useEffect(() => {
    // Apply tilt
    const tiltCards = document.querySelectorAll(".tilt-card");
    VanillaTilt.init(tiltCards, {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
    });

    return () => {
      // Cleanup tilt instances
      tiltCards.forEach((element) => {
        if (element.vanillaTilt) {
          element.vanillaTilt.destroy();
        }
      });
    };
  }, [withRh, diagramWithRh]); // Re-init when states change

  return (
    <motion.div
      className="container mx-auto mt-8 relative px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-[#D32F2F] mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Thông tin nhóm máu
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tìm hiểu về các nhóm máu và tính tương thích trong việc hiến máu.
          Thông tin chính xác giúp bạn hiểu rõ hơn về khả năng hiến và nhận máu
          an toàn.
        </motion.p>
      </motion.div>

      {/* Blood Type Basics */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-6 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Hiểu về nhóm máu
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold text-[#D32F2F] mb-4">
              Hệ thống ABO
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold">
                  A
                </span>
                <span>Có kháng nguyên A trên hồng cầu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                  B
                </span>
                <span>Có kháng nguyên B trên hồng cầu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                  AB
                </span>
                <span>Có cả kháng nguyên A và B</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold">
                  O
                </span>
                <span>Không có kháng nguyên A và B</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold text-[#D32F2F] mb-4">
              Hệ thống Rh
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                  +
                </span>
                <span>Rh dương tính: Có kháng nguyên Rh</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold">
                  -
                </span>
                <span>Rh âm tính: Không có kháng nguyên Rh</span>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Rh âm tính chỉ chiếm khoảng 15% dân số
                  thế giới và rất hiếm ở người châu Á (&lt; 1%).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Compatibility Table */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-6 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Bảng tương thích nhóm máu
        </motion.h2>

        {/* Nút chuyển chế độ cho bảng */}
        <motion.div
          className="flex justify-center gap-3 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Nút chế độ hiến/nhận */}
          <motion.div
            className="flex bg-gray-100 rounded-lg p-1 mr-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.button
              onClick={() => setShowDonation(true)}
              className={`px-3 py-2 rounded-md font-semibold transition-all duration-300 ${
                showDonation
                  ? "bg-[#D32F2F] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hiến
            </motion.button>
            <motion.button
              onClick={() => setShowDonation(false)}
              className={`px-3 py-2 rounded-md font-semibold transition-all duration-300 ${
                !showDonation
                  ? "bg-[#D32F2F] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nhận
            </motion.button>
          </motion.div>

          {/* Nút chế độ cơ bản/chi tiết */}
          <motion.button
            onClick={() => setWithRh(false)}
            className={`px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
              !withRh
                ? "bg-[#D32F2F] text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Chế độ cơ bản
          </motion.button>
          <motion.button
            onClick={() => setWithRh(true)}
            className={`px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
              withRh
                ? "bg-[#D32F2F] text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Chế độ chi tiết
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`table-${withRh}-${showDonation}`}
            className="rounded-md shadow overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <table className="w-full table-fixed">
              <thead className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white">
                <tr>
                  <th className="py-4 px-4 w-1/3 text-left font-bold text-sm sm:text-base transition-all duration-300">
                    Nhóm máu
                  </th>
                  <th className="py-4 px-4 w-2/3 text-left font-bold text-sm sm:text-base transition-all duration-300">
                    {showDonation ? "Có thể hiến cho" : "Có thể nhận từ"}
                  </th>
                </tr>
              </thead>
              <tbody key={`table-${withRh}-${showDonation}`}>
                {withRh
                  ? // Bảng ABO + Rh
                    showDonation
                    ? // Chế độ hiến
                      [
                        ["O-", "O-, O+, A-, A+, B-, B+, AB-, AB+"],
                        ["O+", "O+, A+, B+, AB+"],
                        ["A-", "A-, A+, AB-, AB+"],
                        ["A+", "A+, AB+"],
                        ["B-", "B-, B+, AB-, AB+"],
                        ["B+", "B+, AB+"],
                        ["AB-", "AB-, AB+"],
                        ["AB+", "AB+"],
                      ].map(([t, r], i) => (
                        <tr
                          key={`rh-donate-${t}`}
                          className={
                            "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                            (i % 2 ? "bg-gray-50/50" : "bg-white")
                          }
                          style={{
                            animation: `fadeInUp 0.5s ease-out ${
                              i * 0.1
                            }s both`,
                          }}
                        >
                          <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                            {t}
                          </td>
                          <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                            <div className="flex flex-wrap gap-2">
                              {r.split(", ").map((bloodType, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                                >
                                  {bloodType}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    : // Chế độ nhận
                      [
                        ["O-", "O-"],
                        ["O+", "O-, O+"],
                        ["A-", "O-, A-"],
                        ["A+", "O-, O+, A-, A+"],
                        ["B-", "O-, B-"],
                        ["B+", "O-, O+, B-, B+"],
                        ["AB-", "O-, A-, B-, AB-"],
                        ["AB+", "O-, O+, A-, A+, B-, B+, AB-, AB+"],
                      ].map(([t, r], i) => (
                        <tr
                          key={`rh-receive-${t}`}
                          className={
                            "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                            (i % 2 ? "bg-gray-50/50" : "bg-white")
                          }
                          style={{
                            animation: `fadeInUp 0.5s ease-out ${
                              i * 0.1
                            }s both`,
                          }}
                        >
                          <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                            {t}
                          </td>
                          <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                            <div className="flex flex-wrap gap-2">
                              {r.split(", ").map((bloodType, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                                >
                                  {bloodType}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                  : // Bảng ABO thường
                  showDonation
                  ? // Chế độ hiến
                    [
                      ["O", "O, A, B, AB"],
                      ["A", "A, AB"],
                      ["B", "B, AB"],
                      ["AB", "AB"],
                    ].map(([t, r], i) => (
                      <tr
                        key={`abo-donate-${t}`}
                        className={
                          "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                          (i % 2 ? "bg-gray-50/50" : "bg-white")
                        }
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                        }}
                      >
                        <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                          {t}
                        </td>
                        <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                          <div className="flex flex-wrap gap-2">
                            {r.split(", ").map((bloodType, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                              >
                                {bloodType}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  : // Chế độ nhận
                    [
                      ["O", "O"],
                      ["A", "O, A"],
                      ["B", "O, B"],
                      ["AB", "O, A, B, AB"],
                    ].map(([t, r], i) => (
                      <tr
                        key={`abo-receive-${t}`}
                        className={
                          "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                          (i % 2 ? "bg-gray-50/50" : "bg-white")
                        }
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                        }}
                      >
                        <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                          {t}
                        </td>
                        <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                          <div className="flex flex-wrap gap-2">
                            {r.split(", ").map((bloodType, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                              >
                                {bloodType}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* Diagram */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-6 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Sơ đồ tương thích nhóm máu
        </motion.h2>
        <motion.div
          className="max-w-5xl mx-auto p-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Nút chuyển chế độ cho sơ đồ */}
          <motion.div
            className="flex justify-center gap-3 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={() => setDiagramWithRh(false)}
              className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                !diagramWithRh
                  ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg transform scale-105"
                  : "bg-white text-[#D32F2F] border-[#D32F2F] hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Chế độ cơ bản
            </motion.button>
            <motion.button
              onClick={() => setDiagramWithRh(true)}
              className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                diagramWithRh
                  ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg transform scale-105"
                  : "bg-white text-[#D32F2F] border-[#D32F2F] hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Chế độ chi tiết
            </motion.button>
          </motion.div>

          {/* Container cho sơ đồ với overflow hidden */}
          <AnimatePresence mode="wait">
            <motion.div
              key={diagramWithRh ? "rh-mode" : "basic-mode"}
              className="w-full overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <BloodCompatibilityDiagram withRh={diagramWithRh} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* Important Notes */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-6 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Lưu ý quan trọng
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h3 className="text-lg font-bold text-red-700 mb-3">
              ⚠️ Trước khi hiến máu
            </h3>
            <ul className="space-y-2 text-red-600">
              <li>• Kiểm tra sức khỏe tổng quát</li>
              <li>• Xác nhận nhóm máu chính xác</li>
              <li>• Tuân thủ thời gian nghỉ giữa các lần hiến</li>
              <li>• Báo cáo tiền sử bệnh lý (nếu có)</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-lg font-bold text-green-700 mb-3">
              ✅ Lợi ích của việc hiến máu
            </h3>
            <ul className="space-y-2 text-green-600">
              <li>• Giúp cứu sống những người cần máu</li>
              <li>• Kiểm tra sức khỏe miễn phí</li>
              <li>• Thúc đẩy sản sinh máu mới</li>
              <li>• Đóng góp cho cộng đồng</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Blood Facts & Knowledge */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-8 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Kiến thức về máu và hiến máu
        </motion.h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {/* Fact 1 */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-4xl mb-4 text-center">🩸</div>
            <h3 className="text-lg font-bold text-blue-700 mb-3">
              Thành phần của máu
            </h3>
            <ul className="space-y-2 text-blue-600 text-sm">
              <li>
                <strong>Hồng cầu (45%):</strong> Vận chuyển oxy
              </li>
              <li>
                <strong>Huyết tương (55%):</strong> Chứa protein, kháng thể
              </li>
              <li>
                <strong>Bạch cầu:</strong> Chống nhiễm trùng
              </li>
              <li>
                <strong>Tiểu cầu:</strong> Đông máu khi bị thương
              </li>
            </ul>
          </motion.div>

          {/* Fact 2 */}
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-4xl mb-4 text-center">⏰</div>
            <h3 className="text-lg font-bold text-purple-700 mb-3">
              Chu kỳ tái tạo máu
            </h3>
            <ul className="space-y-2 text-purple-600 text-sm">
              <li>
                <strong>Hồng cầu:</strong> 120 ngày
              </li>
              <li>
                <strong>Bạch cầu:</strong> Vài giờ đến vài ngày
              </li>
              <li>
                <strong>Tiểu cầu:</strong> 8-10 ngày
              </li>
              <li>
                <strong>Huyết tương:</strong> Tái tạo trong 24-48h
              </li>
            </ul>
          </motion.div>

          {/* Fact 3 */}
          <motion.div
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-4xl mb-4 text-center">📊</div>
            <h3 className="text-lg font-bold text-green-700 mb-3">
              Thống kê nhóm máu
            </h3>
            <ul className="space-y-2 text-green-600 text-sm">
              <li>
                <strong>O:</strong> 45% dân số
              </li>
              <li>
                <strong>A:</strong> 40% dân số
              </li>
              <li>
                <strong>B:</strong> 11% dân số
              </li>
              <li>
                <strong>AB:</strong> 4% dân số
              </li>
            </ul>
          </motion.div>

          {/* Fact 4 */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-4xl mb-4 text-center">🌍</div>
            <h3 className="text-lg font-bold text-orange-700 mb-3">
              Sự khác biệt theo vùng
            </h3>
            <ul className="space-y-2 text-orange-600 text-sm">
              <li>
                <strong>Châu Á:</strong> Nhóm B cao hơn
              </li>
              <li>
                <strong>Châu Âu:</strong> Nhóm A phổ biến
              </li>
              <li>
                <strong>Châu Phi:</strong> Nhóm O chiếm ưu thế
              </li>
              <li>
                <strong>Rh âm:</strong> Hiếm ở châu Á (&lt;1%)
              </li>
            </ul>
          </motion.div>

          {/* Fact 5 */}
          <motion.div
            className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-4xl mb-4 text-center">🏥</div>
            <h3 className="text-lg font-bold text-pink-700 mb-3">
              Bảo quản máu
            </h3>
            <ul className="space-y-2 text-pink-600 text-sm">
              <li>
                <strong>Hồng cầu:</strong> 35-42 ngày (2-6°C)
              </li>
              <li>
                <strong>Tiểu cầu:</strong> 5 ngày (20-24°C)
              </li>
              <li>
                <strong>Huyết tương:</strong> 1 năm (-18°C)
              </li>
              <li>
                <strong>Máu toàn phần:</strong> 35 ngày
              </li>
            </ul>
          </motion.div>

          {/* Fact 6 */}
          <motion.div
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-lg font-bold text-yellow-700 mb-3">
              Lượng máu hiến
            </h3>
            <ul className="space-y-2 text-yellow-600 text-sm">
              <li>
                <strong>Một lần hiến:</strong> 350-450ml
              </li>
              <li>
                <strong>Cứu được:</strong> Tối đa 3 người
              </li>
              <li>
                <strong>Tái tạo hoàn toàn:</strong> 56 ngày
              </li>
              <li>
                <strong>Huyết tương:</strong> Tái tạo trong 1-2 ngày
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Historical Facts */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-8 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Lịch sử phát hiện nhóm máu
        </motion.h2>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Các mốc thời gian quan trọng
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-[#D32F2F] text-white px-2 py-1 rounded text-sm font-bold">
                    1900
                  </span>
                  <p className="text-gray-600">
                    Karl Landsteiner phát hiện hệ thống nhóm máu ABO
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#D32F2F] text-white px-2 py-1 rounded text-sm font-bold">
                    1940
                  </span>
                  <p className="text-gray-600">
                    Phát hiện hệ thống Rh bởi Landsteiner và Wiener
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#D32F2F] text-white px-2 py-1 rounded text-sm font-bold">
                    1930
                  </span>
                  <p className="text-gray-600">
                    Karl Landsteiner nhận giải Nobel Y học
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                <span className="text-2xl mr-2">🔬</span>
                Tại sao có nhóm máu khác nhau?
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>Tiến hóa:</strong> Các nhóm máu khác nhau phát triển
                  qua hàng triệu năm tiến hóa để giúp con người thích nghi với
                  môi trường và bệnh tật khác nhau.
                </p>
                <p>
                  <strong>Kháng nguyên:</strong> Sự khác biệt nằm ở các kháng
                  nguyên trên bề mặt hồng cầu - như "thẻ căn cước" của từng tế
                  bào máu.
                </p>
                <p>
                  <strong>Kháng thể:</strong> Hệ miễn dịch tạo ra kháng thể để
                  "nhận diện" và tấn công các kháng nguyên lạ.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Myths vs Facts */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-8 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Phá bỏ những hiểu lầm về hiến máu
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Myths */}
          <motion.div
            className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
              <span className="text-2xl mr-2">❌</span>
              Những quan niệm sai lầm
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-red-600 font-medium">
                  "Hiến máu làm yếu cơ thể"
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-red-600 font-medium">
                  "Hiến máu có thể nhiễm bệnh"
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-red-600 font-medium">
                  "Người gầy không thể hiến máu"
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-red-600 font-medium">
                  "Hiến máu gây nghiện"
                </p>
              </div>
            </div>
          </motion.div>

          {/* Facts */}
          <motion.div
            className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
              <span className="text-2xl mr-2">✅</span>
              Sự thật khoa học
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-green-600 font-medium">
                  Cơ thể tái tạo máu mới trong vài tuần
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-green-600 font-medium">
                  Dụng cụ hoàn toàn vô trùng, một lần dùng
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-green-600 font-medium">
                  Chỉ cần đủ cân nặng tối thiểu (45-50kg)
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-green-600 font-medium">
                  Hiến máu thúc đẩy sức khỏe tim mạch
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Emergency Blood Types */}
      <motion.section variants={itemVariants} className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-[#D32F2F] mb-8 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          Nhóm máu trong tình huống khẩn cấp
        </motion.h2>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="text-5xl mb-4">🚨</div>
              <h3 className="text-lg font-bold text-red-700 mb-3">Cấp cứu</h3>
              <p className="text-red-600 text-sm mb-2">
                Khi không có thời gian xét nghiệm nhóm máu, bác sĩ thường sử
                dụng:
              </p>
              <div className="bg-white p-3 rounded border border-red-300">
                <span className="font-bold text-red-700">
                  Nhóm O- (Universal Donor)
                </span>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-orange-700 mb-3">
                Tốc độ sử dụng
              </h3>
              <p className="text-orange-600 text-sm mb-2">
                Mỗi giây có người cần máu:
              </p>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border border-orange-300 text-sm">
                  <strong>2 giây:</strong> 1 người cần máu
                </div>
                <div className="bg-white p-2 rounded border border-orange-300 text-sm">
                  <strong>1 đơn vị máu:</strong> Cứu 3 người
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="text-5xl mb-4">💝</div>
              <h3 className="text-lg font-bold text-pink-700 mb-3">
                Giá trị hiến máu
              </h3>
              <p className="text-pink-600 text-sm mb-2">
                Một lần hiến máu có thể:
              </p>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border border-pink-300 text-sm">
                  <strong>Cứu sống:</strong> Tối đa 3 người
                </div>
                <div className="bg-white p-2 rounded border border-pink-300 text-sm">
                  <strong>Thời gian:</strong> Chỉ 8-10 phút
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default BloodTypeInfo;
