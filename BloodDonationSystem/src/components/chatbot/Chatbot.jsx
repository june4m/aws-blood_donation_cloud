import { useState, useEffect, useRef, useCallback } from "react";
import { askGemini } from "./askGemini";
import useApi from "../../hooks/useApi";
import TypewriterText from "./TypewriterText";
import "./Chatbot.css";
import { useLocation } from "react-router-dom";

// Helper function để kiểm tra xem có phải trang auth không
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

export default function GeminiChatbot() {
  const location = useLocation();
  const isAuthPage = isAuthRoute(location.pathname);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // Thêm state lưu tên
  const chatContentRef = useRef(null); // Ref cho phần chat content
  // eslint-disable-next-line no-unused-vars
  const [typingMessageId, setTypingMessageId] = useState(null); // ID của tin nhắn đang typing
  const [isTyping, setIsTyping] = useState(false); // State để theo dõi typing
  const [shouldStopTyping, setShouldStopTyping] = useState(false); // State để dừng typing
  const [isExpanded, setIsExpanded] = useState(false); // State để phóng to chatbot
  const typingTimeoutRef = useRef(null); // Ref để lưu timeout ID
  const { getCurrentUser } = useApi();
  const [showFAQ, setShowFAQ] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // State phát hiện người dùng kéo
  const [autoScrollLocked, setAutoScrollLocked] = useState(false); // Khóa auto scroll khi user kéo lên

  // Dispatch custom event khi chatbot mở/đóng để ẩn/hiện nút scroll to top
  useEffect(() => {
    const event = new CustomEvent("chatbotToggle", {
      detail: { isOpen: open },
    });
    window.dispatchEvent(event);
  }, [open]);

  // Component để format text đẹp hơn
  const FormattedText = ({ text }) => {
    // Tách text thành các đoạn và format
    const formatText = (rawText) => {
      if (!rawText) return rawText;

      // Tách theo dấu xuống dòng hoặc dấu chấm kết thúc câu
      let formatted = rawText
        // Xử lý các ký hiệu đặc biệt trước (để tránh conflict)
        .replace(/\*\*\*/g, "\n")
        .replace(/\*\*/g, "")
        // Chỉ thay thế * thành bullet nếu nó ở đầu dòng hoặc sau khoảng trắng
        .replace(/(^|\s)\*\s/gm, "$1• ")
        // Thêm xuống dòng sau dấu chấm nếu theo sau là chữ hoa
        .replace(
          /\. ([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂÂÊÔƠƯẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴ])/g,
          ".\n$1"
        )
        // Thêm xuống dòng trước các dấu hiệu liệt kê
        .replace(/(\d+\.|•|-|\+)\s/g, "\n$1 ")
        // Thêm xuống dòng sau dấu hai chấm nếu theo sau là chữ hoa
        .replace(
          /: ([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂÂÊÔƠƯẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴ])/g,
          ":\n$1"
        )
        // Thêm xuống dòng trước các từ khóa quan trọng
        .replace(/(Lưu ý|Chú ý|Quan trọng|Cần thiết|Khuyến cáo):/gi, "\n$1:")
        // Loại bỏ dấu chấm thừa sau dấu hai chấm
        .replace(/:\.(\s|$)/g, ":$1")
        // Loại bỏ nhiều xuống dòng liên tiếp
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim();

      return formatted;
    };

    const formattedText = formatText(text);

    return (
      <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
        {formattedText.split("\n").map((line, index) => {
          // Nếu là dòng trống thì tạo khoảng cách
          if (!line.trim()) {
            return <div key={index} style={{ height: "8px" }} />;
          }

          // Kiểm tra xem có phải là tiêu đề không (có dấu hai chấm ở cuối)
          const isTitle = line.trim().endsWith(":") && line.length < 50;

          // Kiểm tra xem có phải là danh sách không
          const isList = /^(•|\d+\.|[a-z]\)|-|\+)\s/.test(line.trim());

          return (
            <div
              key={index}
              style={{
                marginBottom: isTitle ? "8px" : isList ? "4px" : "6px",
                fontWeight: isTitle ? "600" : "normal",
                color: isTitle ? "#D32F2F" : "#333",
                paddingLeft: isList ? "12px" : "0",
                position: "relative",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  // Lấy tên user khi mở chatbot
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (open && isLoggedIn) {
      getCurrentUser()
        .then((user) => {
          setUserName(user?.data?.user_name || "Khách");
        })
        .catch(() => setUserName("Khách"));
    }
  }, [open, getCurrentUser]); // Removed localStorage.getItem from dependency
  useEffect(() => {
    setOpen(false); // Luôn đóng chatbot khi userName đổi (đăng nhập/xuất)
    setMessages([]);
    setInput("");
  }, [userName]);

  // Cập nhật title động cho tab khi chatbot mở/đóng
  useEffect(() => {
    const originalTitle = document.title;

    if (open) {
      if (isTyping) {
        document.title = "✍️ DaiVietBlood AI đang trả lời...";
      } else {
        document.title = "💬 DaiVietBlood AI Assistant - Đang tư vấn...";
      }
    } else {
      document.title = originalTitle;
    }

    // Cleanup khi component unmount
    return () => {
      document.title = originalTitle;
    };
  }, [open, isTyping]);

  const faqList = [
    {
      question: "Làm cách nào để đăng ký tài khoản trên hệ thống?",
      answer:
        "Bạn nhấp vào nút “Đăng ký” ở góc trên bên phải, điền họ tên, email, số điện thoại, địa chỉ, ngày sinh, mật khẩu rồi bấm “Đăng ký”.",
    },
    {
      question: "Chưa biết nhóm máu có đăng ký hiến được không?",
      answer:
        "Được. Chọn “Đăng kí hiến máu”, sau đó ra cơ sở xét nghiệm miễn phí và gửi kết quả cho nhân viên y tế xác minh.",
    },
    // ...thêm các câu hỏi/đáp án khác từ FAQ.jsx...
  ];
  const suggestions = [
    "Các câu hỏi thường gặp",
    "Tôi thuộc nhóm máu nào?",
    "Nhóm máu O có thể hiến cho ai?",
    "Nhóm máu A nhận được từ nhóm nào?",
    "Nhóm máu B nên lưu ý gì khi hiến máu?",
    "Nhóm máu AB có đặc điểm gì?",
    "Tư vấn chọn nhóm máu phù hợp để hiến tặng",
    "Làm thế nào để đăng ký hiến máu?",
    "Tôi cần chuẩn bị gì trước khi hiến máu?",
    "Ai không nên hiến máu?",
    "Hiến máu có lợi ích gì?",
    "Sau khi hiến máu nên làm gì?",
  ];

  // Thêm các câu trả lời nhanh cho câu hỏi phổ biến
  const quickAnswers = {
    "nhóm máu o có thể hiến cho ai":
      "Nhóm máu O có thể hiến cho: O, A, B, AB (nhóm máu vạn năng về hiến máu)",
    "nhóm máu a nhận được từ nhóm nào": "Nhóm máu A nhận được từ: A và O",
    "nhóm máu b nên lưu ý gì khi hiến máu":
      "Nhóm máu B: Có thể hiến cho B và AB, nhận từ B và O. Lưu ý kiểm tra sức khỏe trước khi hiến.",
    "nhóm máu ab có đặc điểm gì":
      "Nhóm máu AB: Nhận được từ tất cả nhóm máu (vạn năng về nhận máu), chỉ hiến cho AB.",
    "làm thế nào để đăng ký hiến máu":
      "Đăng ký hiến máu: Vào trang chủ → Đăng ký hiến máu → Điền thông tin → Chọn địa điểm và thời gian.",
    "tôi cần chuẩn bị gì trước khi hiến máu":
      "Chuẩn bị: Ngủ đủ giấc, ăn uống đầy đủ, mang CMND, không uống rượu bia 24h trước.",
    "ai không nên hiến máu":
      "Không nên hiến: Dưới 18 tuổi, cân nặng dưới 45kg, đang mang thai, có bệnh lý tim mạch, nhiễm trùng.",
    "hiến máu có lợi ích gì":
      "Lợi ích: Kích thích tạo máu mới, kiểm tra sức khỏe miễn phí, giúp đỡ người khó khăn, cảm thấy ý nghĩa.",
    "sau khi hiến máu nên làm gì":
      "Sau hiến máu: Nghỉ ngơi 10-15 phút, uống nhiều nước, ăn nhẹ, tránh gắng sức 24h đầu.",
  };

  // Hàm kiểm tra và trả lời nhanh
  const getQuickAnswer = (question) => {
    const normalizedQuestion = question.toLowerCase().trim();
    for (const [key, answer] of Object.entries(quickAnswers)) {
      if (
        normalizedQuestion.includes(key) ||
        key.includes(normalizedQuestion)
      ) {
        return answer;
      }
    }
    return null;
  };

  // Hàm xử lý chuyển đổi kích thước ngay lập tức
  const handleToggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Hiệu ứng nhấn đơn giản cho nút
    const button = e.target.closest("button");
    if (button) {
      button.style.transform = "scale(0.9)";
      button.style.transition = "transform 0.1s ease";
      setTimeout(() => {
        button.style.transform = "";
        button.style.transition = "";
      }, 100);
    }

    // Đổi state ngay lập tức - không có animation
    setIsExpanded(!isExpanded);

    // Scroll ngay sau khi resize
    setTimeout(() => {
      if (chatContentRef.current) {
        chatContentRef.current.scrollTo({
          top: chatContentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 50); // Delay nhỏ để DOM cập nhật
  };

  // Theo dõi sự kiện scroll của người dùng
  useEffect(() => {
    const chatDiv = chatContentRef.current;
    if (!chatDiv) return;
    const handleScroll = () => {
      // Nếu người dùng ở gần cuối (cách dưới 40px), mở lại auto scroll
      if (
        chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight <
        40
      ) {
        setIsUserScrolling(false);
        setAutoScrollLocked(false);
      } else {
        setIsUserScrolling(true);
        setAutoScrollLocked(true); // Khóa auto scroll khi user kéo lên
      }
    };
    chatDiv.addEventListener("scroll", handleScroll);
    return () => chatDiv.removeEventListener("scroll", handleScroll);
  }, [chatContentRef]);

  // Hàm scroll xuống dưới với hiệu ứng mượt, chỉ scroll nếu user không kéo và không bị khóa
  const scrollToBottom = useCallback(
    (immediate = false, force = false) => {
      if (chatContentRef.current) {
        if ((!isUserScrolling && !autoScrollLocked) || force) {
          if (immediate) {
            chatContentRef.current.scrollTop =
              chatContentRef.current.scrollHeight;
          } else {
            chatContentRef.current.scrollTo({
              top: chatContentRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      }
    },
    [isUserScrolling, autoScrollLocked, chatContentRef]
  );

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0 && !autoScrollLocked) {
      setTimeout(() => scrollToBottom(false), 100); // Chỉ scroll nếu user không kéo và không bị khóa
    }
  }, [messages, scrollToBottom, autoScrollLocked]);

  // Auto scroll khi phóng to/thu nhỏ chatbot - ngay lập tức
  useEffect(() => {
    if (messages.length > 0 && !autoScrollLocked) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [isExpanded, messages, scrollToBottom, autoScrollLocked]);

  // Scroll đặc biệt khi bot đang typing
  useEffect(() => {
    if (isTyping && !autoScrollLocked) {
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [isExpanded, isTyping, scrollToBottom, autoScrollLocked]);

  // Hàm thêm tin nhắn bot với typing effect
  const addBotMessage = (text) => {
    const messageId = Date.now().toString();
    // Thêm chú thích nhắc gặp bác sĩ vào cuối mỗi phản hồi bot
    const finalText = `${text}\n\n🤝 Lưu ý: Để đảm bảo an toàn và nhận được lời khuyên phù hợp nhất với tình trạng sức khỏe của bạn, hãy gặp trực tiếp bác sĩ hoặc chuyên viên y tế khi cần thiết nhé!`;
    setMessages((msgs) => [
      ...msgs,
      {
        from: "bot",
        text: finalText,
        id: messageId,
        isTyping: true,
      },
    ]);
    setTypingMessageId(messageId);
    setIsTyping(true); // Bắt đầu typing
    setShouldStopTyping(false); // Reset shouldStop flag
    setLoading(false);
    // Chỉ auto scroll nếu không bị khóa
    if (!autoScrollLocked) {
      setTimeout(scrollToBottom, 100);
    }
  };

  // Hàm hoàn thành typing - sử dụng useCallback để tránh re-render
  const handleTypingComplete = useCallback(
    (messageId) => {
      setMessages((msgs) =>
        msgs.map((msg) =>
          msg.id === messageId ? { ...msg, isTyping: false } : msg
        )
      );
      setTypingMessageId(null);
      setIsTyping(false);
      setShouldStopTyping(false); // Reset shouldStop flag
      // Chỉ auto scroll nếu không bị khóa
      if (!autoScrollLocked) {
        setTimeout(() => scrollToBottom(false), 100);
      }
    },
    [scrollToBottom, autoScrollLocked]
  );

  // Hàm dừng typing
  const stopTyping = () => {
    setShouldStopTyping(true); // Signal để dừng typing
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Hàm xây dựng prompt chuẩn hóa cho Gemini
  function buildPrompt(messages, userInput) {
    let prompt = `Bạn là trợ lý DaiVietBlood AI tư vấn về hiến máu, nhóm máu, sức khỏe. Hãy trả lời NGẮN GỌN, RÕ RÀNG, ưu tiên tốc độ phản hồi nhanh. Luôn dùng lời lẽ nhẹ nhàng, vui vẻ, nhân văn, truyền cảm hứng, động viên người hỏi. Nếu không biết, hãy nói rõ một cách tích cực.\n`;
    if (messages && messages.length > 0) {
      prompt += "\nLịch sử hội thoại:";
      messages.forEach((msg) => {
        if (msg.from === "user") prompt += `\nNgười dùng: ${msg.text}`;
        else if (msg.from === "bot") prompt += `\nAI: ${msg.text}`;
      });
    }
    prompt += `\nNgười dùng: ${userInput}\nAI:`;
    return prompt;
  }

  // Gửi câu hỏi (từ input hoặc gợi ý)
  const handleSend = async (customInput, isFAQ = false) => {
    const question = typeof customInput === "string" ? customInput : input;
    if (!question.trim()) return;

    // Nếu là "Các câu hỏi thường gặp" thì toggle hiển thị danh sách, không gửi lên chat
    if (question.trim() === "Các câu hỏi thường gặp") {
      setShowFAQ(!showFAQ); // Toggle thay vì chỉ set true
      return;
    }

    setMessages([
      ...messages,
      { from: "user", text: question, id: Date.now().toString() },
    ]);
    setInput("");
    setLoading(true);
    setIsUserScrolling(false); // Reset auto scroll khi gửi tin nhắn mới
    setAutoScrollLocked(false); // Mở lại auto scroll khi gửi tin nhắn mới

    // Scroll ngay khi gửi câu hỏi
    setTimeout(scrollToBottom, 100);

    // Nếu là câu hỏi FAQ thì trả lời đúng đáp án
    if (isFAQ) {
      const faq = faqList.find((f) => f.question === question.trim());
      if (faq) {
        addBotMessage(faq.answer);
        return;
      }
    }

    // Nếu là câu hỏi nhóm máu thì lấy từ API user
    if (question.trim() === "Tôi thuộc nhóm máu nào?") {
      try {
        const user = await getCurrentUser();
        const bloodType = user?.data?.blood_group || "Chưa cập nhật nhóm máu";
        addBotMessage(`Nhóm máu của bạn là: ${bloodType}`);
      } catch {
        addBotMessage("Không lấy được thông tin nhóm máu của bạn.");
      }
      return;
    }

    // Kiểm tra câu trả lời nhanh trước khi gọi Gemini
    const quickAnswer = getQuickAnswer(question);
    if (quickAnswer) {
      addBotMessage(quickAnswer);
      return;
    }

    // Các câu hỏi khác gọi Gemini với lịch sử hội thoại
    try {
      // Xây dựng prompt chuẩn hóa
      const prompt = buildPrompt(messages, question);
      const reply = await askGemini(prompt);
      addBotMessage(reply);
    } catch {
      addBotMessage(
        "Xin lỗi, tôi không thể trả lời câu hỏi này ngay bây giờ. Vui lòng thử lại sau."
      );
    }
  };

  // Avatar
  const botAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
  const userAvatar = "https://cdn-icons-png.flaticon.com/512/1946/1946429.png";

  return (
    <>
      {/* Không hiển thị chatbot khi ở trang auth */}
      {!isAuthPage && !open && (
        <div
          className="chatbot-trigger fixed-button-base chatbot-btn"
          onClick={() => setOpen(true)}
          title="💬 DaiVietBlood AI Assistant - Tư vấn hiến máu 24/7"
        >
          <div className="chatbot-button">
            <span className="emoji">💬</span>
            <span>DaiVietBlood AI</span>
            <div className="status-indicator"></div>
          </div>
        </div>
      )}
      {!isAuthPage && open && (
        <div className={`chatbot-window ${isExpanded ? "expanded" : "normal"}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img src={botAvatar} alt="bot" className="chatbot-avatar" />
              <div>
                <div className="chatbot-title">
                  🩸 DaiVietBlood AI Assistant
                </div>
                <div className="chatbot-subtitle">
                  Tư vấn hiến máu • Nhóm máu • Sức khỏe 24/7
                </div>
                <div className="chatbot-greeting">
                  Xin chào <b>{userName || "Bạn"}</b>! Tôi có thể giúp gì cho
                  bạn?
                </div>
              </div>
            </div>
            <div className="chatbot-controls">
              <button
                onClick={handleToggleExpand}
                className="chatbot-control-btn expand"
                title={
                  isExpanded
                    ? "📱 Thu nhỏ để tiếp tục duyệt web"
                    : "🔍 Phóng to để trò chuyện thoải mái hơn"
                }
              >
                {isExpanded ? "🗗" : "🗖"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="chatbot-control-btn close"
                title="❌ Đóng trò chuyện - Hẹn gặp lại!"
              >
                ×
              </button>
            </div>
          </div>
          {/* Nội dung chat */}
          <div
            ref={chatContentRef}
            className={`chatbot-content ${isExpanded ? "expanded" : "normal"}`}
          >
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`message ${msg.from === "user" ? "user" : ""}`}
              >
                <img
                  src={msg.from === "user" ? userAvatar : botAvatar}
                  alt={msg.from}
                  className="message-avatar"
                />
                <div className={`message-content ${msg.from}`}>
                  {msg.from === "bot" && msg.isTyping ? (
                    <TypewriterText
                      key={`stable-${msg.id}`}
                      text={msg.text}
                      onComplete={handleTypingComplete}
                      messageId={msg.id}
                      shouldStop={shouldStopTyping}
                      scrollToBottom={scrollToBottom}
                    />
                  ) : msg.from === "bot" ? (
                    <FormattedText text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="loading-indicator">
                <img src={botAvatar} alt="bot" className="message-avatar" />
                <div className="loading-content">
                  <span className="loading-text">Đang suy nghĩ</span>
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nút dừng phản hồi khi bot đang typing */}
          {isTyping && messages.some((msg) => msg.isTyping) && (
            <div className="stop-typing-container">
              <button
                onClick={stopTyping}
                className="stop-typing-btn"
                title="Dừng phản hồi để hỏi câu khác"
              >
                <span>⏹️</span>
                Dừng phản hồi
              </button>
            </div>
          )}

          {/* Gợi ý câu hỏi */}
          <div className="suggestions-container">
            {suggestions.slice(0, 6).map((s, idx) => (
              <button
                key={idx}
                className={`suggestion-btn ${
                  s === "Các câu hỏi thường gặp" && showFAQ
                    ? "active"
                    : "normal"
                }`}
                disabled={loading}
                onClick={() => handleSend(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          {showFAQ && (
            <div className="faq-container">
              {faqList.map((q, idx) => (
                <button
                  key={idx}
                  className="faq-btn"
                  onClick={() => {
                    handleSend(q.question, true);
                    setShowFAQ(false);
                  }}
                >
                  {q.question}
                </button>
              ))}
              <button
                className="faq-close-btn"
                onClick={() => setShowFAQ(false)}
              >
                Đóng
              </button>
            </div>
          )}

          {/* Input */}
          <div className="input-container">
            <input
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="💭 Hỏi về hiến máu, nhóm máu, sức khỏe..."
              disabled={loading}
            />
            <button
              className="send-btn"
              onClick={() => handleSend()}
              disabled={loading}
              title="Gửi tin nhắn"
            >
              <span role="img" aria-label="send">
                ➤
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}