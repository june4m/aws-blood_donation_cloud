import { useState, useEffect, useRef, memo } from "react";

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

// Component TypewriterText được tách riêng và hoàn toàn độc lập
const TypewriterText = memo(
  ({ text, onComplete, messageId, shouldStop, scrollToBottom }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [stopped, setStopped] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
      if (shouldStop && !stopped) {
        setStopped(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        // Không hiển thị full text, chỉ dừng tại chỗ hiện tại
        if (onComplete) onComplete(messageId);
        return;
      }

      if (currentIndex < text.length && !stopped) {
        timerRef.current = setTimeout(() => {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);

          // Auto scroll mượt mà hơn - scroll mỗi 5 ký tự thay vì 10
          if (currentIndex > 0 && currentIndex % 5 === 0 && scrollToBottom) {
            setTimeout(() => scrollToBottom(false), 5);
          }

          // Scroll đặc biệt khi gặp ký tự xuống dòng để đảm bảo luôn thấy dòng mới
          const currentChar = text[currentIndex];
          if (currentChar === "\n" && scrollToBottom) {
            setTimeout(() => scrollToBottom(false), 10);
          }

          // Scroll khi hoàn thành câu (gặp dấu chấm, chấm hỏi, chấm than)
          if (/[.!?]/.test(currentChar) && scrollToBottom) {
            setTimeout(() => scrollToBottom(false), 15);
          }

          // Scroll khi gặp dấu hai chấm (thường là tiêu đề)
          if (currentChar === ":" && scrollToBottom) {
            setTimeout(() => scrollToBottom(false), 15);
          }
        }, 30); // Tốc độ typing (30ms mỗi ký tự)

        return () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        };
      } else if (currentIndex >= text.length && !stopped) {
        // Hoàn thành typing tự nhiên
        if (onComplete) onComplete(messageId);
        // Scroll cuối cùng để đảm bảo toàn bộ nội dung được hiển thị
        if (scrollToBottom) {
          setTimeout(() => scrollToBottom(false), 50);
        }
      }
    }, [
      currentIndex,
      text,
      onComplete,
      messageId,
      shouldStop,
      stopped,
      scrollToBottom,
    ]);

    // Cleanup khi component unmount
    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, []);

    return <FormattedText text={displayText} />;
  },
  (prevProps, nextProps) => {
    // Custom comparison - chỉ re-render khi các props quan trọng thay đổi
    return (
      prevProps.text === nextProps.text &&
      prevProps.messageId === nextProps.messageId &&
      prevProps.shouldStop === nextProps.shouldStop &&
      prevProps.onComplete === nextProps.onComplete &&
      prevProps.scrollToBottom === nextProps.scrollToBottom
    );
  }
);

TypewriterText.displayName = "TypewriterText";

export default TypewriterText;
