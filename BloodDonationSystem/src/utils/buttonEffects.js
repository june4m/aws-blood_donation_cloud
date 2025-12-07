// Fixed Buttons Helper Functions
// Tạo hiệu ứng âm thanh và haptic feedback

export const playButtonSound = () => {
  // Chỉ phát âm thanh nếu người dùng đã tương tác với trang
  if (typeof window !== "undefined" && window.AudioContext) {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      // Âm thanh không được hỗ trợ hoặc bị chặn
    }
  }
};

export const playEmergencySound = () => {
  if (typeof window !== "undefined" && window.AudioContext) {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 1000;
      oscillator.type = "square";

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch {
      // Âm thanh không được hỗ trợ hoặc bị chặn
    }
  }
};

export const triggerHapticFeedback = (intensity = "medium") => {
  // Haptic feedback cho thiết bị hỗ trợ
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      switch (intensity) {
        case "light":
          navigator.vibrate(50);
          break;
        case "medium":
          navigator.vibrate(100);
          break;
        case "strong":
          navigator.vibrate([100, 50, 100]);
          break;
        default:
          navigator.vibrate(100);
      }
    } catch {
      // Haptic không được hỗ trợ
    }
  }
};

export const addButtonEffects = (buttonElement, type = "default") => {
  if (!buttonElement) return;

  const handleClick = () => {
    triggerHapticFeedback(type === "emergency" ? "strong" : "medium");

    if (type === "emergency") {
      playEmergencySound();
    } else {
      playButtonSound();
    }

    // Thêm hiệu ứng visual
    buttonElement.style.transform = "scale(0.95)";
    setTimeout(() => {
      buttonElement.style.transform = "";
    }, 150);
  };

  buttonElement.addEventListener("click", handleClick);

  // Return cleanup function
  return () => {
    buttonElement.removeEventListener("click", handleClick);
  };
};
