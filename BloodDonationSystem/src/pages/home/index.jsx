import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import VanillaTilt from "vanilla-tilt";
import DonateBlood from "./DonateBlood";
import { DateFilter } from "../../components/DateFilter";
import { FAQPage } from "./FAQ";
import {
  triggerHapticFeedback,
  playButtonSound,
} from "../../utils/buttonEffects";

// Helper function to check if current path is auth related
const isAuthRoute = (pathname) => {
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/profile",
    "/auth/",
  ];
  return authRoutes.some((route) => pathname.includes(route));
};

// ScrollToTopButton Component
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false); // State để theo dõi chatbot
  const location = useLocation(); // Get current location

  // Kiểm tra xem có phải là trang auth không
  const isAuthPage = isAuthRoute(location.pathname);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    // Lắng nghe custom event từ chatbot
    const handleChatbotToggle = (event) => {
      setChatbotOpen(event.detail.isOpen);
    };

    // Chỉ thêm event listener nếu không phải là trang auth
    if (!isAuthPage) {
      window.addEventListener("scroll", toggleVisibility);
      window.addEventListener("chatbotToggle", handleChatbotToggle);
    }

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("chatbotToggle", handleChatbotToggle);
    };
  }, [isAuthPage]); // Thêm isAuthPage vào dependency array

  const scrollToTop = () => {
    // Thêm hiệu ứng âm thanh và haptic
    triggerHapticFeedback("light");
    playButtonSound();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Nếu là trang auth hoặc không visible, không hiển thị nút
  if (isAuthPage || !visible || chatbotOpen) {
    return null;
  }

  return (
    <motion.button
      onClick={scrollToTop}
      className={`fixed-button-base scroll-to-top-btn w-12 h-12 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white rounded-full shadow-lg flex items-center justify-center group z-[1002] 
                md:bottom-[240px] md:right-[15px] 
                max-[480px]:bottom-[200px] max-[480px]:right-[10px]`}
      aria-label="Scroll to top"
      title="Cuộn lên đầu trang"
      style={{ right: "20px" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: [0, -5, 0],
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.1,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={{ y: 0 }}
        animate={{ y: [-2, 2, -2] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M7 11l5-5m0 0l5 5m-5-5v12"
        />
      </motion.svg>
    </motion.button>
  );
};

const Homepage = () => {
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

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const bannerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

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
  }, []); // Remove dependencies

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();

  const handleSearch = () => {
    // Chuyển sang trang DonateBlood với startDate và endDate
    navigate("/donate", {
      state: {
        startDate: startDate,
        endDate: endDate,
        shouldFilter: true, // Flag để tự động filter
      },
    });
  };

  return (
    <motion.div
      className="container mx-auto mt-8 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Section 1 */}
          <motion.div
            className="relative bg-[#000000] w-full h-[400px] overflow-hidden rounded-lg"
            variants={bannerVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="/image/DonateBloodBanner.jpg"
              alt="DaiVietBlood"
              className="object-cover w-full h-full opacity-35"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.h1
                  className="font-bold text-white md:text-4xl text-3xl mb-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Một giọt máu cho đi – Thắp sáng hy vọng
                </motion.h1>
                <motion.p
                  className="text-white md:text-lg text-base mt-2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  DaiVietBlood kết nối những tấm lòng nhân ái với những người
                  đang cần máu gấp, mở ra một hành trình sẻ chia an toàn, đơn
                  giản và đáng tin cậy.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Statistics & Search */}
          <motion.section variants={itemVariants} className="py-6">
            <motion.p
              className="text-center text-[#D32F2F] py-3 bg-[#FFE6E6] rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.strong
                initial={{ color: "#D32F2F" }}
                animate={{ color: ["#D32F2F", "#B71C1C", "#D32F2F"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                "Một giọt máu cho đi – Một cuộc đời ở lại."
              </motion.strong>
            </motion.p>
            <motion.div
              className="mt-8 text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <motion.h2
                className="text-3xl font-bold text-[#D32F2F]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, duration: 0.6, type: "spring" }}
              >
                Mỗi giọt máu trao đi – Thắp lên tia hy vọng.
              </motion.h2>
              <motion.p
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                Chung tay hiến máu – Trao sự sống, gieo hy vọng cho cộng đồng.
              </motion.p>
              <motion.div
                className="flex justify-center mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
              >
                <div className="w-full max-w-xl">
                  <DateFilter
                    onSearch={handleSearch}
                    onDateChange={setDateRange}
                    startDate={startDate}
                    endDate={endDate}
                    modernStyle={true}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Stories */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
           
          
          </motion.div>

          {/* About Us Section */}
          <motion.section variants={itemVariants} className="mt-12">
            <motion.h4
              className="text-center text-3xl font-bold text-[#D32F2F] mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              Về chúng tôi
            </motion.h4>

            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <motion.h5
                    className="text-2xl font-bold text-[#D32F2F] mb-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    DaiVietBlood - Kết nối yêu thương
                  </motion.h5>
                  <motion.p
                    className="text-gray-700 mb-4 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    DaiVietBlood là nền tảng hiến máu trực tuyến hàng đầu Việt
                    Nam, được thành lập với sứ mệnh kết nối những tấm lòng nhân
                    ái với những người đang cần máu gấp. Chúng tôi tin rằng mỗi
                    giọt máu hiến tặng đều mang trong mình tình yêu thương và hy
                    vọng cho cuộc sống.
                  </motion.p>
                  <motion.p
                    className="text-gray-700 mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    Với hệ thống hiện đại và quy trình an toàn, chúng tôi đã tạo
                    ra một cầu nối tin cậy giữa người hiến máu và những bệnh
                    nhân cần được cứu chữa khẩn cấp.
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {[
                      { icon: "❤️", label: "An toàn & Tin cậy" },
                      { icon: "⚡", label: "Nhanh chóng & Hiệu quả" },
                      { icon: "🏥", label: "Hoạt động vì cộng đồng " },
                      { icon: "🌟", label: "Hỗ trợ 24/7" },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="text-center bg-[#FFE6E6] p-4 rounded-lg flex-1 min-w-[120px]"
                        variants={{
                          hidden: { y: 20, opacity: 0 },
                          visible: {
                            y: 0,
                            opacity: 1,
                            transition: {
                              duration: 0.5,
                            },
                          },
                        }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "#FFD6D6",
                        }}
                      >
                        <motion.div
                          className="text-2xl mb-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 1 + index * 0.1,
                            type: "spring",
                          }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div className="text-sm text-gray-600 font-medium">
                          {feature.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <motion.div
                    className="bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] p-8 rounded-lg text-white shadow-xl"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    <motion.h6
                      className="text-xl font-bold mb-4"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      Tầm nhìn của chúng tôi
                    </motion.h6>
                    <motion.p
                      className="mb-4 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      Trở thành hệ thống hiến máu trực tuyến hàng đầu, góp phần
                      xây dựng một cộng đồng khỏe mạnh và đầy tình yêu thương.
                    </motion.p>

                    <motion.h6
                      className="text-xl font-bold mb-4"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      Sứ mệnh của chúng tôi
                    </motion.h6>
                    <motion.p
                      className="leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      Kết nối và hỗ trợ hoạt động hiến máu nhân đạo một cách
                      hiệu quả, an toàn và minh bạch, mang lại hy vọng cho hàng
                      ngàn gia đình.
                    </motion.p>

                    <motion.div
                      className="mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                    >
                      <Link
                        to="/blood-type-info"
                        className="inline-block bg-white text-[#D32F2F] px-6 py-3 rounded-lg font-semibold border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 shadow-lg"
                      >
                        Tìm hiểu về nhóm máu →
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFE6E6] rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#D32F2F] rounded-full"
                    animate={{
                      scale: [1, 0.8, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.section>

          {/* Eligibility */}
          <motion.section variants={itemVariants} className="mt-12">
            <motion.h4
              className="text-center text-3xl font-bold text-[#D32F2F] mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              Bạn có đủ điều kiện hiến máu?
            </motion.h4>
            <motion.div
              className="bg-[#E57373] p-6 rounded-lg shadow-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="grid md:grid-cols-4 grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
              >
                {[
                  {
                    title: "Độ tuổi & Cân nặng",
                    lines: ["18–60 tuổi", "Nữ ≥45kg, Nam ≥50kg"],
                  },
                  {
                    title: "Sức khỏe",
                    lines: [
                      "Không bệnh truyền nhiễm",
                      "Không dùng chất kích thích",
                    ],
                  },
                  {
                    title: "Tần suất",
                    lines: ["Nữ: mỗi 3 tháng", "Nam: mỗi 2 tháng"],
                  },
                  {
                    title: "Phụ nữ",
                    lines: ["Không mang thai", "Không trong kỳ kinh nguyệt"],
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { y: 20, opacity: 0, scale: 0.8 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 0.6,
                          ease: "easeOut",
                        },
                      },
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      rotateY: 10,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="tilt-card bg-[#D32F2F] text-white p-4 rounded-md cursor-pointer"
                  >
                    <motion.p
                      className="font-semibold mb-2"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.title}
                    </motion.p>
                    {item.lines.map((l, j) => (
                      <motion.p
                        key={j}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + j * 0.1 }}
                      >
                        {l}
                      </motion.p>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Image Grid */}
          <motion.section variants={itemVariants} className="py-12">
            <motion.h4
              className="text-center text-3xl font-bold text-[#D32F2F] mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              Hiến máu nhân đạo – Lan tỏa yêu thương
            </motion.h4>
            <motion.div
              className="grid md:grid-cols-4 grid-cols-2 gap-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {["Gruop", "mobile", "emergency", "thanks"].map((img) => (
                <motion.div
                  key={img}
                  className="tilt-card rounded-md overflow-hidden shadow cursor-pointer"
                  variants={{
                    hidden: { y: 20, opacity: 0, scale: 0.8 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -10,
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src={`/image/${img}.png`}
                    alt={img}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* FAQ link */}
          <motion.section variants={itemVariants} className="text-center mb-10">
            <motion.h2
              className="text-2xl font-bold text-[#D32F2F] hover:underline"
              whileHover={{ scale: 1.05, color: "#B71C1C" }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/faq">Bạn đang thắc mắc? Xem FAQ tại đây!</Link>
            </motion.h2>
          </motion.section>
        </div>
      </div>

      {/* Scroll To Top Button */}
      {/* <ScrollToTopButton /> */}
    </motion.div>
  );
};

export default Homepage;
